#!/usr/bin/env node
// The document register's table (docs/governance/document-register.md; FS-835,
// FS-857), read by its header, so a column added or moved changes this file
// only, and an older register (at an earlier release's tag) still reads.
// Every tool that reads or writes the register comes here.
//
// Each customer's delivery map shows its own documents, in §6, as a table
// generated from the register: never typed, so it cannot drift. The check
// fails a stale one; this refreshes them:
//
//   node tools/docregister.js            every customer page
//   node tools/docregister.js <customer> one

'use strict';

const fs = require('fs');
const path = require('path');

const COLUMNS = [
  ['id', 'Id'], ['party', 'Party'], ['title', 'Title'], ['summary', 'Summary'], ['kind', 'Kind'],
  ['version', 'Version'], ['status', 'Status'], ['date', 'Date'], ['from', 'From'], ['where', 'Where'],
  ['print', 'Fingerprint'], ['rows', 'Rows'],
];
const norm = (s) => s.replace(/\r\n/g, '\n');
const cells = (l) => l.split('|').slice(1, -1).map((s) => s.trim());

// { header: [names], rows: [{ line, cells, id, party, title, … }] }
function parse(text) {
  const lines = norm(text).split('\n');
  const h = lines.findIndex((l) => /^\| Id \| Party \|/.test(l));
  const header = h < 0 ? [] : cells(lines[h]);
  const rows = [];
  lines.forEach((l, i) => {
    if (!/^\| DR-\d{3} \|/.test(l)) return;
    const c = cells(l);
    const r = { line: i + 1, cells: c };
    header.forEach((name, k) => {
      const col = COLUMNS.find(([, n]) => n === name);
      if (col) r[col[0]] = c[k];
    });
    rows.push(r);
  });
  return { header, rows };
}

// One row of the register, in its column order.
const row = (o) => `| ${COLUMNS.map(([k]) => String(o[k] ?? '—').replace(/\|/g, '/')).join(' | ')} |`;

// ── each customer's documents ────────────────────────────────────────────
const MARK = '*Generated from the [document register](../governance/document-register.md) by tools/docregister.js: edit the register, never this table.*';
const SHOWN = [['id', 'Id'], ['title', 'Title'], ['summary', 'Summary'], ['kind', 'Kind'], ['status', 'Status'], ['date', 'Date'], ['from', 'From']];
function table(registerText, party) {
  const mine = parse(registerText).rows.filter((r) => r.party === party);
  if (!mine.length) return 'No documents registered yet.';
  return [`| ${SHOWN.map(([, n]) => n).join(' | ')} |`, `|${SHOWN.map(() => '---').join('|')}|`, ...mine.map((r) => `| ${SHOWN.map(([k]) => r[k] || '—').join(' | ')} |`)].join('\n');
}
// The party a customer page is for: its front matter's name, before " —".
const partyOf = (page) => (norm(page).match(/^name: *(.+?) —/m) || [])[1];
// The page's block: the mark, a blank line, then the table (or the one
// line saying there is none). null when the page has no mark.
function block(page) {
  const t = norm(page);
  const at = t.indexOf(`${MARK}\n\n`);
  if (at < 0) return null;
  const from = at + MARK.length + 2;
  const end = t.indexOf('\n\n', from);
  return { from, to: end < 0 ? t.length : end, text: t.slice(from, end < 0 ? t.length : end) };
}
// Refreshes one customer page in place; true when it changed.
function refresh(root, id) {
  const p = path.join(root, 'docs', 'customers', `${id}.md`);
  const raw = fs.readFileSync(p, 'utf8');
  const b = block(raw);
  if (!b) return false;
  const want = table(fs.readFileSync(path.join(root, 'docs', 'governance', 'document-register.md'), 'utf8'), partyOf(raw));
  if (b.text === want) return false;
  const t = norm(raw);
  const out = t.slice(0, b.from) + want + t.slice(b.to);
  fs.writeFileSync(p, raw.includes('\r\n') ? out.replace(/\n/g, '\r\n') : out);
  return true;
}
const customers = (root) => fs.readdirSync(path.join(root, 'docs', 'customers')).filter((f) => f.endsWith('.md') && !f.startsWith('_')).map((f) => f.slice(0, -3));

module.exports = { COLUMNS, parse, row, MARK, table, partyOf, block, refresh, customers };

if (require.main === module) {
  const root = path.join(__dirname, '..');
  const ids = process.argv[2] ? [process.argv[2]] : customers(root);
  for (const id of ids) console.log(`${id}: ${refresh(root, id) ? 'refreshed' : 'already current'}`);
}
