// A product version's draft (docs/products/*.md, kind: product-version)
// read as data (FS-816, FS-817): its items in three groups, each with an
// id, a name, a value, a source and an ask. The questionnaires are built
// from it, the read-back writes into it, and the check holds it to form.

'use strict';

const ASKS = ['Confirm', 'Choose', 'Provide', 'Decide'];
const HEADS = { A: 'Term', B: 'Rule', C: 'Setting' };
const HEAD = /^\| Id \| (Term|Rule|Setting) \| Value \| Source \| Ask \|$/;

// "Choose: a / b / c" → { kind: 'Choose', options: [a, b, c] }; "—" is
// nothing to answer.
function parseAsk(s) {
  if (s === '—') return { kind: null, options: [] };
  const m = s.match(/^(Confirm|Choose|Provide|Decide)(?::\s*(.+))?$/);
  if (!m) return null;
  const options = m[2] ? m[2].split(' / ').map((o) => o.trim()) : [];
  if (m[1] === 'Choose' && options.length < 2) return null;
  if (m[1] !== 'Choose' && options.length) return null;
  return { kind: m[1], options };
}

const cells = (line) => line.split('|').slice(1, -1).map((c) => c.trim());

// The draft's front matter and items. Problems are returned, not thrown,
// so the check can report every one.
function parse(md) {
  const text = md.replace(/\r\n/g, '\n');
  const front = {};
  const fm = text.match(/^---\n([\s\S]*?)\n---/);
  if (fm) for (const l of fm[1].split('\n')) { const m = l.match(/^(\w+):\s*(.*)$/); if (m) front[m[1]] = m[2]; }
  const items = [];
  const problems = [];
  const lines = text.split('\n');
  let head = null;
  lines.forEach((line, i) => {
    if (HEAD.test(line)) { head = line.match(HEAD)[1]; return; }
    if (head && /^\|---/.test(line)) return;
    if (head && line.startsWith('|')) {
      const c = cells(line);
      const where = `line ${i + 1}`;
      if (c.length !== 5) { problems.push(`${where}: ${c.length} cells, expected 5`); return; }
      const [id, name, value, source, askText] = c;
      const m = id.match(/^([ABC])(\d+)$/);
      if (!m) { problems.push(`${where}: id "${id}" is not a group letter and a number`); return; }
      if (HEADS[m[1]] !== head) problems.push(`${where}: ${id} sits in the ${head} table`);
      const ask = parseAsk(askText);
      if (!ask) problems.push(`${where}: ${id}'s ask "${askText}" is not Confirm, Choose: (two options or more, split by " / "), Provide, Decide or —`);
      if (!source) problems.push(`${where}: ${id} has no source`);
      items.push({ id, group: m[1], name, value, source, askText, ask: ask ? ask.kind : null, options: ask ? ask.options : [], line: i });
      return;
    }
    head = null;
  });
  const seen = new Set();
  for (const it of items) { if (seen.has(it.id)) problems.push(`${it.id} appears twice`); seen.add(it.id); }
  for (const g of 'ABC') {
    const ids = items.filter((it) => it.group === g).map((it) => Number(it.id.slice(1)));
    ids.forEach((n, k) => { if (n !== k + 1) problems.push(`group ${g}: ${g}${n} where ${g}${k + 1} was expected`); });
  }
  return { front, items, problems, lines };
}

// A table cell's text: one line, no pipes.
const cellText = (s) => String(s).replace(/\r?\n+/g, '; ').replace(/\|/g, '/').replace(/\s+/g, ' ').trim();

// The draft with the given items' rows rewritten.
function rewrite(md, changed) {
  const crlf = md.includes('\r\n');
  const { lines } = parse(md);
  for (const it of changed) {
    lines[it.line] = `| ${it.id} | ${it.name} | ${cellText(it.value)} | ${cellText(it.source)} | ${it.askText} |`;
  }
  const out = lines.join('\n');
  return crlf ? out.replace(/\n/g, '\r\n') : out;
}

// Why each term matters, from the vocabulary (lender-rules §2.4).
function purposes(lenderRules) {
  const t = lenderRules.replace(/\r\n/g, '\n');
  const s = t.indexOf('**The vocabulary**');
  const e = t.indexOf('**Never terms', s);
  const out = {};
  if (s < 0 || e < 0) return out;
  for (const m of t.slice(s, e).matchAll(/^\| ([^|]+?) \| [^|]+ \| ([^|]+?) \|$/gm)) {
    if (m[2] !== 'Why it matters') out[m[1]] = m[2];
  }
  return out;
}

module.exports = { ASKS, HEADS, parse, parseAsk, rewrite, purposes, cellText };
