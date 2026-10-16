#!/usr/bin/env node
// Citations of the law (FS-868). Each law whose provisions we cite has an
// instrument card, docs/law/LR-nn.md: its citation, regulator, what it was
// made under, whether it is in force, what it is, and a row for each
// provision we cite saying what it requires. A document that cites
// provisions names its main instrument in its front matter (law: LR-03);
// a cite of another carries its id where it is made ("s. 44A (LR-04)").
// It ends with "Regulations cited", generated here from the cards, so
// what a provision requires is written once and read everywhere.
//
//   node tools/citations.js                  refresh every document's section
//   node tools/citations.js --external <md>  the same, for a reader outside
//                                             Dibon: no register ids, Kenya
//                                             Law links (for Word or PDF)

'use strict';

const fs = require('fs');
const path = require('path');

const LAW_DIR = 'docs/law';
const HEADING = '## Regulations cited';
const MARK = '*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*';
const norm = (s) => s.replace(/\r\n/g, '\n');
const read = (root, f) => norm(fs.readFileSync(path.join(root, f), 'utf8'));
const cells = (l) => l.split('|').slice(1, -1).map((s) => s.trim());
const front = (t) => (t.match(/^---\n([\s\S]*?)\n---\n/) || [])[1] || '';

// "reg 28(1)(b)" → { kind: 'reg', parts: ['28', '1', 'b'] }; "s. 44A" → s.
function provision(text) {
  const m = text.trim().match(/^(reg|s\.)\s*(\d+[A-Z]?)((?:\([0-9a-z]+\))*)$/);
  if (!m) return null;
  return { kind: m[1] === 'reg' ? 'reg' : 's', parts: [m[2], ...[...m[3].matchAll(/\(([0-9a-z]+)\)/g)].map((x) => x[1])] };
}
const show = (p) => `${p.kind === 'reg' ? 'reg' : 's.'} ${p.parts[0]}${p.parts.slice(1).map((x) => `(${x})`).join('')}`;

// Every card: id → { file, fields, provisions: [{ kind, parts, requires }] }.
function cards(root) {
  const out = new Map();
  const dir = path.join(root, LAW_DIR);
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir).filter((x) => /^LR-\d{2}\.md$/.test(x))) {
    const file = `${LAW_DIR}/${f}`;
    const t = read(root, file);
    const fields = {};
    const provisions = [];
    let inProv = false;
    for (const l of t.split('\n')) {
      if (/^## Provisions we cite/.test(l)) inProv = true;
      else if (/^## /.test(l)) inProv = false;
      if (!l.startsWith('|') || /^\|[-|\s]+\|$/.test(l)) continue;
      const c = cells(l);
      if (inProv) {
        const p = provision(c[0]);
        if (p) provisions.push({ ...p, requires: c[1] || '', line: l });
      } else if (c.length === 2 && c[0] !== 'Field') fields[c[0]] = c[1];
    }
    out.set(f.slice(0, -3), { file, fields, provisions });
  }
  return out;
}

// The law register's rows: id → { instrument, asAt, url }.
function register(root) {
  const out = new Map();
  for (const l of read(root, 'docs/regulation.md').split('\n')) {
    const c = cells(l);
    if (!/^LR-\d{2}$/.test(c[0] || '')) continue;
    const m = (c[2] || '').match(/\]\((https:[^)]+)\)/);
    out.set(c[0], { instrument: c[1], asAt: c[3], url: m ? m[1] : '' });
  }
  return out;
}

// Every cite in a document's text, outside code and the generated section,
// each placed with its instrument: the nearest id before it in the same
// clause, else one just after it in the same clause, else the default.
const CITE = /\b(regs?|regulations?|ss?\.)\s*(\d+[A-Z]?(?:\([0-9a-z]+\))*)((?:\s*(?:,|and|to)\s*(?:\d+[A-Z]?(?:\([0-9a-z]+\))*|(?:\([0-9a-z]+\))+))*)/gi;
function cites(text, defaultLaw) {
  const out = [];
  const body = text.split(`\n${HEADING}\n`)[0];
  let fenced = false;
  body.split('\n').forEach((raw, i) => {
    if (/^\s*```/.test(raw)) { fenced = !fenced; return; }
    if (fenced || /^---$/.test(raw)) return;
    const line = raw.replace(/`[^`]*`/g, (s) => ' '.repeat(s.length));
    const ids = [...line.matchAll(/\bLR-\d{2}\b/g)].map((m) => ({ id: m[0], at: m.index }));
    for (const m of line.matchAll(CITE)) {
      if (+m[2].match(/^\d+/)[0] >= 1000) continue; // "regulations 2026": a year
      const kind = /^s/i.test(m[1]) ? 's' : 'reg';
      const first = provision(`${kind === 'reg' ? 'reg' : 's.'} ${m[2]}`);
      if (!first) continue;
      const list = [first];
      for (const t of (m[3] || '').matchAll(/(?:,|and|to)\s*(\d+[A-Z]?(?:\([0-9a-z]+\))*|(?:\([0-9a-z]+\))+)/g)) {
        const prev = list[list.length - 1];
        if (/^\d/.test(t[1])) list.push(provision(`${kind === 'reg' ? 'reg' : 's.'} ${t[1]}`));
        else {
          const sub = [...t[1].matchAll(/\(([0-9a-z]+)\)/g)].map((x) => x[1]);
          list.push({ kind, parts: [...prev.parts.slice(0, Math.max(1, prev.parts.length - sub.length)), ...sub] });
        }
      }
      // An id written right after the cite ("s.26, LR-11") is its own;
      // then the nearest before it in the clause; then one a little after.
      const clause = (a, b) => !/\.\s|\s\|\s/.test(line.slice(a, b));
      const end = m.index + m[0].length;
      const own = ids.find((x) => x.at >= end && /^[\s,;(]{1,4}$/.test(line.slice(end, x.at)));
      const before = ids.filter((x) => x.at < m.index && clause(x.at, m.index)).pop();
      const after = ids.find((x) => x.at >= end && x.at - end <= 40 && clause(end, x.at));
      const law = (own || before || after || {}).id || defaultLaw || null;
      for (const p of list.filter(Boolean)) out.push({ line: i + 1, text: m[0].trim(), ...p, law });
    }
  });
  return out;
}

// The card row covering a cite: the row whose provision is the cite or a
// whole of which it is a part.
const covers = (row, p) => row.kind === p.kind && row.parts.length <= p.parts.length && row.parts.every((x, k) => x === p.parts[k]);

// The section's body for a document: per instrument, a line of facts and
// a table of the provisions cited, what each requires, as the card says.
function section(root, file, opts = {}) {
  const text = read(root, file);
  const law = (front(text).match(/^law: *(LR-\d{2})/m) || [])[1];
  const all = cards(root);
  const reg = register(root);
  const found = cites(text, law).filter((c) => all.has(c.law));
  const order = [...new Set(found.map((c) => c.law))].sort();
  const rel = (to) => path.posix.relative(path.posix.dirname(file), to);
  const parts = order.map((id) => {
    const card = all.get(id);
    const r = reg.get(id) || {};
    const rows = card.provisions.filter((row) => found.some((c) => c.law === id && covers(row, c)));
    const byParts = (a, b) => { for (let k = 0; k < Math.max(a.parts.length, b.parts.length); k++) { const x = a.parts[k] || ''; const y = b.parts[k] || ''; if (x !== y) return (parseInt(x, 10) - parseInt(y, 10)) || x.localeCompare(y); } return 0; };
    const citedAs = (row) => [...new Map(found.filter((c) => c.law === id && covers(row, c)).sort(byParts).map((c) => [show(c), c])).keys()].join(', ');
    const name = opts.external ? card.fields.Citation : `[${id}](${rel(card.file)}) ${card.fields.Citation}`;
    const version = r.url ? `as at ${r.asAt}, [Kenya Law](${r.url})` : `as at ${r.asAt || '?'}`;
    return [
      `**${name}.** Regulator: ${card.fields.Regulator}. Made under: ${card.fields['Made under']}. In force: ${card.fields['In force']}. Version read: ${version}.`,
      '',
      '| Provision | Cited here as | What it requires |',
      '|---|---|---|',
      ...rows.map((row) => `| ${show(row)} | ${citedAs(row)} | ${row.requires} |`),
    ].join('\n');
  });
  return parts.length ? parts.join('\n\n') : 'No provisions cited.';
}

// A document's generated block: everything after the mark line.
function block(text) {
  const at = text.indexOf(`\n${HEADING}\n\n${MARK}\n\n`);
  if (at < 0) return null;
  const from = at + HEADING.length + MARK.length + 5;
  return { from, text: text.slice(from).replace(/\n+$/, '') };
}
// Documents in docs/ that name a main instrument.
const documents = (root) => {
  const out = [];
  const walk = (rel) => {
    for (const e of fs.readdirSync(path.join(root, rel), { withFileTypes: true })) {
      const r = `${rel}/${e.name}`;
      if (e.isDirectory()) { if (r !== LAW_DIR) walk(r); } else if (e.name.endsWith('.md') && /^law: *LR-\d{2}/m.test(front(read(root, r)))) out.push(r);
    }
  };
  walk('docs');
  return out.sort();
};
// Writes or refreshes a document's section, at its end; true when changed.
function refresh(root, file) {
  const raw = fs.readFileSync(path.join(root, file), 'utf8');
  const t = norm(raw);
  const want = section(root, file);
  const b = block(t);
  let out;
  if (b) { if (b.text === want) return false; out = `${t.slice(0, b.from)}${want}\n`; }
  else out = `${t.replace(/\n+$/, '')}\n\n${HEADING}\n\n${MARK}\n\n${want}\n`;
  fs.writeFileSync(path.join(root, file), raw.includes('\r\n') ? out.replace(/\n/g, '\r\n') : out);
  return true;
}

module.exports = { LAW_DIR, HEADING, MARK, cards, register, cites, covers, section, block, documents, refresh, show, provision };

if (require.main === module) {
  const root = path.join(__dirname, '..');
  const args = process.argv.slice(2);
  if (args[0] === '--external') {
    const file = path.relative(root, path.resolve(args[1] || '')).split(path.sep).join('/');
    if (!args[1] || !fs.existsSync(path.join(root, file))) { console.log('usage: node tools/citations.js --external <file.md>'); process.exit(1); }
    console.log(`${HEADING}\n\n${section(root, file, { external: true })}`);
  } else {
    for (const f of documents(root)) console.log(`${f}: ${refresh(root, f) ? 'refreshed' : 'already current'}`);
  }
}
