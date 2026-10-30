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
  const pending = [];
  const typed = parseTyped(lines, items, problems, pending, (front.name || '').split(' — ')[0]);
  return { front, items, problems, pending, lines, typed };
}

// ── The typed block (FS-823) ─────────────────────────────────────────────
// The tables are the conversation with the institution; the block is the
// product as data, one entry per vocabulary term:
//   { "item": "A1", "proposed": {...}, "options": [{...}, ...], "value": {...} }
// "proposed" is what we have, "options" the typed form of a Choose's
// options in their order, "value" what the institution settled. The
// schema that checks the values themselves is the code repository's
// (product-versions §4); here only the shape is held.
const FENCE = '```json product-version';
const ENTRY_KEYS = new Set(['item', 'proposed', 'options', 'value']);
const slug = (name) => name.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const hasNull = (v) => v === null || (typeof v === 'object' && Object.values(v).some(hasNull));

// Problems are the draft out of form; pending, settled answers a person
// has still to encode (the check fails both; the read-back only the first).
function parseTyped(lines, items, problems, pending, inst) {
  const start = lines.indexOf(FENCE);
  if (start < 0) { problems.push(`no typed block: a fenced block opening "${FENCE}"`); return null; }
  const end = lines.indexOf('```', start + 1);
  if (end < 0) { problems.push('the typed block is not closed'); return null; }
  let data;
  try { data = JSON.parse(lines.slice(start + 1, end).join('\n')); } catch (e) { problems.push(`the typed block is not valid JSON: ${e.message}`); return null; }
  const byId = new Map(items.map((it) => [it.id, it]));
  const keyed = new Set();
  for (const [key, entry] of Object.entries(data)) {
    const where = `typed block, ${key}`;
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) { problems.push(`${where}: not an object`); continue; }
    for (const k of Object.keys(entry)) if (!ENTRY_KEYS.has(k)) problems.push(`${where}: "${k}" is not item, proposed, options or value`);
    const it = byId.get(entry.item);
    if (!it) { problems.push(`${where}: names item "${entry.item}", which the tables do not have`); continue; }
    if (slug(it.name) !== key) problems.push(`${where}: ${it.id} is "${it.name}", whose key is "${slug(it.name)}"`);
    keyed.add(it.id);
    if (entry.options !== undefined) {
      if (!Array.isArray(entry.options)) problems.push(`${where}: options is not a list`);
      else if (it.ask && it.ask !== 'Choose') problems.push(`${where}: options, but ${it.id} is not a Choose`);
      else if (it.ask === 'Choose' && entry.options.length !== it.options.length) problems.push(`${where}: ${entry.options.length} options typed, ${it.id} offers ${it.options.length}`);
    }
    if (entry.value !== undefined) {
      if (it.ask) problems.push(`${where}: a value, but ${it.id} is still asked (${it.askText.split(':')[0]})`);
      if (hasNull(entry.value)) problems.push(`${where}: the value has a blank (null) still to encode`);
    }
  }
  for (const it of items) {
    if (inst && it.source.startsWith(`${inst},`) && !(data[slug(it.name)] && data[slug(it.name)].value !== undefined)) {
      pending.push(`${it.id} ${it.name} is settled by ${inst} but has no typed value: encode it in the typed block`);
    }
  }
  return { data, start, end };
}

// The block as written: anything that fits in 100 columns on one line,
// broken a level at a time where it does not (the diagrams' width, FS-579).
const WIDTH = 100;
const oneLine = (v) => (v === null || typeof v !== 'object' ? JSON.stringify(v)
  : Array.isArray(v) ? `[${v.map(oneLine).join(', ')}]`
    : `{${Object.entries(v).map(([k, x]) => `${JSON.stringify(k)}: ${oneLine(x)}`).join(', ')}}`);
function layout(v, indent, prefix, suffix) {
  const flat = `${indent}${prefix}${oneLine(v)}${suffix}`;
  if (flat.length <= WIDTH || v === null || typeof v !== 'object') return [flat];
  const inner = `${indent}  `;
  const parts = Array.isArray(v) ? v.map((x) => ['', x]) : Object.entries(v).map(([k, x]) => [`${JSON.stringify(k)}: `, x]);
  const [open, close] = Array.isArray(v) ? ['[', ']'] : ['{', '}'];
  return [`${indent}${prefix}${open}`,
    ...parts.flatMap(([p, x], i) => layout(x, inner, p, i < parts.length - 1 ? ',' : '')),
    `${indent}${close}${suffix}`];
}
const formatTyped = (data) => layout(data, '', '', '').join('\n');

// A table cell's text: one line, no pipes.
const cellText = (s) => String(s).replace(/\r?\n+/g, '; ').replace(/\|/g, '/').replace(/\s+/g, ' ').trim();

// The draft with the given items' rows rewritten, and the typed block
// replaced when one is given.
function rewrite(md, changed, typedData) {
  const crlf = md.includes('\r\n');
  const { lines, typed } = parse(md);
  for (const it of changed) {
    lines[it.line] = `| ${it.id} | ${it.name} | ${cellText(it.value)} | ${cellText(it.source)} | ${it.askText} |`;
  }
  if (typedData && typed) lines.splice(typed.start + 1, typed.end - typed.start - 1, ...formatTyped(typedData).split('\n'));
  const out = lines.join('\n');
  return crlf ? out.replace(/\n/g, '\r\n') : out;
}

// Why each term matters, from the vocabulary (product-versions §4).
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

module.exports = { ASKS, HEADS, FENCE, parse, parseAsk, rewrite, purposes, cellText, slug, hasNull, formatTyped };
