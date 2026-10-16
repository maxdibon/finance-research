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

// The names a document may call an instrument by, longest first: each
// register title, without its chapter, notice or year (so "Data
// Protection Act" places a cite as LR-17 does), and each card's "Also
// called" (short forms such as "CBK lender regulations"), " · " between.
function names(root) {
  const out = [];
  const add = (name, id) => { const n = name.trim(); if (n.length >= 3 && !out.some((x) => x.name.toLowerCase() === n.toLowerCase())) out.push({ name: n, id }); };
  for (const [id, r] of register(root)) {
    const plain = r.instrument.replace(/\s*\((?:Cap\.|LN|No\.|Legal Notice)[^)]*\)/g, '').trim();
    add(plain, id);
    add(plain.replace(/,?\s+\d{4}$/, ''), id);
  }
  for (const [id, card] of cards(root)) for (const n of (card.fields['Also called'] || '').split(' · ')) if (n) add(n, id);
  out.sort((a, b) => b.name.length - a.name.length);
  // FS-874: what each instrument's provisions are called, so a "reg" is
  // never placed with an Act, nor an "s." with a set of Regulations.
  out.kindOf = new Map([...register(root)].map(([id, r]) => [id, /\b(?:Regulations|Rules)\b/.test(r.instrument) ? 'reg' : 's']));
  return out;
}
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Every cite in a document's text, outside code and the generated section,
// each placed with its instrument: an id or name written just after it
// ("s.26, LR-11"), else the nearest id or name before it in the same
// clause, else one a little after it, else the document's main instrument.
const CITE = /\b(regs?|regulations?|ss?\.)\s*(\d+[A-Z]?(?:\([0-9a-z]+\))*)((?:\s*(?:,|and|to)\s*(?:\d+[A-Z]?(?:\([0-9a-z]+\))*|(?:\([0-9a-z]+\))+))*)/gi;
function cites(text, defaultLaw, known = []) {
  const out = [];
  const body = text.split(`\n${HEADING}\n`)[0];
  // Read by span, not by line: a paragraph, a list item or a table row, so
  // a name at the end of one line places a cite at the start of the next.
  const spans = [];
  let fenced = false;
  let cur = null;
  const close = () => { if (cur) spans.push(cur); cur = null; };
  body.split('\n').forEach((raw, i) => {
    if (/^\s*```/.test(raw)) { fenced = !fenced; close(); return; }
    if (fenced || /^---$/.test(raw) || !raw.trim()) { close(); return; }
    const starts = /^\s*\|/.test(raw) || /^#/.test(raw) || /^\s*(?:[-*]|\d+\.)\s/.test(raw);
    if (starts || !cur || cur.table) close();
    if (!cur) cur = { text: '', lines: [], table: /^\s*\|/.test(raw) };
    cur.lines.push({ at: cur.text.length ? cur.text.length + 1 : 0, n: i + 1 });
    cur.text += cur.text.length ? ` ${raw.replace(/^\s+/, '')}` : raw;
    if (cur.table) close();
  });
  close();
  for (const span of spans) {
    const lineOf = (at) => span.lines.filter((l) => l.at <= at).pop().n;
    const line = span.text.replace(/`[^`]*`/g, (s) => ' '.repeat(s.length));
    const ids = [...line.matchAll(/\bLR-\d{2}\b/g)].map((m) => ({ id: m[0], at: m.index }));
    // Names, longest first, each span used once.
    let masked = line;
    for (const n of known) {
      for (const m of masked.matchAll(new RegExp(`\\b${escapeRe(n.name).replace(/ /g, '\\s+')}\\b`, 'gi'))) {
        ids.push({ id: n.id, at: m.index + m[0].length - 1 });
        masked = masked.slice(0, m.index) + ' '.repeat(m[0].length) + masked.slice(m.index + m[0].length);
      }
    }
    ids.sort((a, b) => a.at - b.at);
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
      // A clause ends at a sentence's end (a full stop, then a capital) or
      // a table cell's edge; "Cap. 411C" and "s. 44A" end nothing.
      const clause = (a, b) => !/[\w)\]]\.\s+[A-Z]|\s\|\s/.test(line.slice(a, b));
      const end = m.index + m[0].length;
      const fits = (x) => !known.kindOf || !known.kindOf.has(x.id) || known.kindOf.get(x.id) === kind;
      const own = ids.find((x) => fits(x) && x.at >= end && /^[\s,;(]{1,4}$/.test(line.slice(end, x.at)));
      const before = ids.filter((x) => fits(x) && x.at < m.index && clause(x.at, m.index)).pop();
      const after = ids.find((x) => fits(x) && x.at >= end && x.at - end <= 40 && clause(end, x.at));
      const law = (own || before || after || {}).id || defaultLaw || null;
      for (const p of list.filter(Boolean)) out.push({ line: lineOf(m.index), text: m[0].trim(), ...p, law });
    }
  }
  return out;
}

// A document's main instrument (law: LR-03), or none (law: mixed): then
// every cite names its instrument, by id or by name.
const mainLaw = (text) => (front(text).match(/^law: *(LR-\d{2})\s*$/m) || [])[1] || null;

// The card row covering a cite: the row whose provision is the cite or a
// whole of which it is a part.
const covers = (row, p) => row.kind === p.kind && row.parts.length <= p.parts.length && row.parts.every((x, k) => x === p.parts[k]);

// The section's body for a document: per instrument, a line of facts and
// a table of the provisions cited, what each requires, as the card says.
// FS-874: the section as data, for a document's text from anywhere (a
// Word document's included): each instrument cited, with its card's facts,
// the version read, and each provision's row and how it is cited here.
function sectionData(root, text, law) {
  const all = cards(root);
  const reg = register(root);
  const found = cites(text, law, names(root)).filter((c) => all.has(c.law));
  const byParts = (a, b) => { for (let k = 0; k < Math.max(a.parts.length, b.parts.length); k++) { const x = a.parts[k] || ''; const y = b.parts[k] || ''; if (x !== y) return (parseInt(x, 10) - parseInt(y, 10)) || x.localeCompare(y); } return 0; };
  return [...new Set(found.map((c) => c.law))].sort().map((id) => {
    const card = all.get(id);
    const r = reg.get(id) || {};
    const rows = card.provisions.filter((row) => found.some((c) => c.law === id && covers(row, c))).map((row) => ({
      provision: show(row),
      citedAs: [...new Map(found.filter((c) => c.law === id && covers(row, c)).sort(byParts).map((c) => [show(c), c])).keys()],
      requires: row.requires,
    }));
    return { id, file: card.file, citation: card.fields.Citation, regulator: card.fields.Regulator, madeUnder: card.fields['Made under'], inForce: card.fields['In force'], asAt: r.asAt || '?', url: r.url || '', rows };
  });
}
function section(root, file, opts = {}) {
  const text = read(root, file);
  const rel = (to) => path.posix.relative(path.posix.dirname(file), to);
  const parts = sectionData(root, text, mainLaw(text)).map((d) => {
    const name = opts.external ? d.citation : `[${d.id}](${rel(d.file)}) ${d.citation}`;
    const version = d.url ? `as at ${d.asAt}, [Kenya Law](${d.url})` : `as at ${d.asAt}`;
    return [
      `**${name}.** Regulator: ${d.regulator}. Made under: ${d.madeUnder}. In force: ${d.inForce}. Version read: ${version}.`,
      '',
      '| Provision | Cited here as | What it requires |',
      '|---|---|---|',
      ...d.rows.map((row) => `| ${row.provision} | ${row.citedAs.join(', ')} | ${row.requires} |`),
    ].join('\n');
  });
  return parts.length ? parts.join('\n\n') : 'No provisions cited.';
}

// A document's generated block: from the mark line, as far as its own
// lines go (an instrument's line in bold, its table, blank lines), so
// anything written after it is the document's, kept by a refresh.
function block(text) {
  const at = text.indexOf(`\n${HEADING}\n\n${MARK}\n\n`);
  if (at < 0) return null;
  const from = at + HEADING.length + MARK.length + 5;
  const lines = text.slice(from).split('\n');
  let n = 0;
  while (n < lines.length && (lines[n] === '' || /^\*\*.*\*\*/.test(lines[n]) || /^\|.*\|$/.test(lines[n]) || lines[n] === 'No provisions cited.')) n++;
  while (n > 0 && lines[n - 1] === '') n--;
  const own = lines.slice(0, n).join('\n');
  return { from, to: from + own.length, text: own };
}
// Documents in docs/ that name a main instrument.
const documents = (root) => {
  const out = [];
  const walk = (rel) => {
    for (const e of fs.readdirSync(path.join(root, rel), { withFileTypes: true })) {
      const r = `${rel}/${e.name}`;
      if (e.isDirectory()) { if (r !== LAW_DIR) walk(r); } else if (e.name.endsWith('.md') && /^law: *(?:LR-\d{2}|mixed)\s*$/m.test(front(read(root, r)))) out.push(r);
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
  if (b) { if (b.text === want) return false; out = `${t.slice(0, b.from)}${want}${t.slice(b.to) || '\n'}`; }
  else out = `${t.replace(/\n+$/, '')}\n\n${HEADING}\n\n${MARK}\n\n${want}\n`;
  fs.writeFileSync(path.join(root, file), raw.includes('\r\n') ? out.replace(/\n/g, '\r\n') : out);
  return true;
}

module.exports = { LAW_DIR, HEADING, MARK, cards, register, names, mainLaw, cites, sectionData, covers, section, block, documents, refresh, show, provision };

if (require.main === module) {
  const root = path.join(__dirname, '..');
  const args = process.argv.slice(2);
  if (args[0] === '--data') {
    // FS-874: a Word document's text, extracted, in; the section as JSON
    // out, for setting in the document (no register ids are used there).
    const law = args.includes('--law') ? args[args.indexOf('--law') + 1] : null;
    if (!args[1] || !fs.existsSync(args[1])) { console.log('usage: node tools/citations.js --data <text file> [--law LR-03]'); process.exit(1); }
    console.log(JSON.stringify(sectionData(root, norm(fs.readFileSync(args[1], 'utf8')), law), null, 1));
  } else if (args[0] === '--external') {
    const file = path.relative(root, path.resolve(args[1] || '')).split(path.sep).join('/');
    if (!args[1] || !fs.existsSync(path.join(root, file))) { console.log('usage: node tools/citations.js --external <file.md>'); process.exit(1); }
    console.log(`${HEADING}\n\n${section(root, file, { external: true })}`);
  } else {
    for (const f of documents(root)) console.log(`${f}: ${refresh(root, f) ? 'refreshed' : 'already current'}`);
  }
}
