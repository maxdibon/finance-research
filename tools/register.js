#!/usr/bin/env node
// The review register, across its files (FS-866). REVIEW.md holds the
// register's rules and every open row; a row that closes moves to
// review/, a file for each hundred ids (review/FS-100-199.md), so no file
// grows past what a Markdown preview will render (one file of 414 KB
// showed as raw text). The check, the reader, dibon and the Master read
// the register from here, as one.
//
//   node tools/register.js tidy    closed rows to review/, open rows back
//
// Run tidy after closing or reopening a row; dibon save runs it, and the
// register check fails a row in the wrong file and says to.

'use strict';

const fs = require('fs');
const path = require('path');

const MAIN = 'REVIEW.md';
const DIR = 'review';
const HEADER = '| Id | Raised by | Point | Status | Criticality | Notes |';
const RULE = '|---|---|---|---|---|---|';
const ROW = /^\| FS-(\d{3}) \|/;
const norm = (s) => s.replace(/\r\n/g, '\n');
const pad = (n) => String(n).padStart(3, '0');

// The file for a row's hundred: review/FS-001-099.md, review/FS-100-199.md.
const fileFor = (n) => {
  const h = Math.floor(n / 100) * 100;
  return `${DIR}/FS-${pad(Math.max(1, h))}-${pad(h + 99)}.md`;
};

// Every register file, REVIEW.md first, then review/ in id order.
function files(root) {
  const dir = path.join(root, DIR);
  const more = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /^FS-\d{3}-\d{3}\.md$/.test(f)).sort().map((f) => `${DIR}/${f}`) : [];
  return [MAIN, ...more].filter((f) => fs.existsSync(path.join(root, f)));
}

// Every row: { file, line, text, id, n, raisedBy, point, status, criticality, notes, cellCount }.
function rows(root) {
  const out = [];
  for (const file of files(root)) {
    norm(fs.readFileSync(path.join(root, file), 'utf8')).split('\n').forEach((text, i) => {
      const m = text.match(ROW);
      if (!m) return;
      const c = text.split('|').slice(1, -1).map((s) => s.trim());
      out.push({ file, line: i + 1, text, id: c[0], n: +m[1], raisedBy: c[1], point: c[2], status: c[3], criticality: c[4], notes: c[5], cellCount: c.length });
    });
  }
  return out;
}

const nextId = (root) => `FS-${pad(Math.max(0, ...rows(root).map((r) => r.n)) + 1)}`;

// A new file for a hundred: a title, what it holds, the table's header.
function newFile(n) {
  const h = Math.floor(n / 100) * 100;
  const span = `ids ${pad(Math.max(1, h))} to ${pad(h + 99)}`; // not FS ids: a range's end may not exist yet
  return `# Review register: ${span}, closed\n\nThe closed rows of the review register, ${span} (FS-866). The open\nrows, and the register's rules, are in REVIEW.md; tools/register.js\nmoves a row here when it closes, and back when it reopens.\n\n${HEADER}\n${RULE}\n`;
}

// Moves each row to where its status puts it, keeping every file in id
// order. Returns the rows moved, as "FS-123 to review/FS-100-199.md".
function tidy(root) {
  const all = rows(root);
  const want = (r) => (r.status === 'OPEN' ? MAIN : fileFor(r.n));
  const moving = all.filter((r) => want(r) !== r.file);
  if (!moving.length) return [];
  // Each file's text, its rows taken out, then the rows it should hold
  // put back in id order after its table's header.
  const texts = new Map();
  const load = (f) => {
    if (!texts.has(f)) {
      const p = path.join(root, f);
      texts.set(f, fs.existsSync(p) ? norm(fs.readFileSync(p, 'utf8')) : newFile(+f.match(/FS-(\d{3})/)[1]));
    }
    return texts.get(f);
  };
  const touched = new Set([...moving.map((r) => r.file), ...moving.map(want)]);
  for (const f of touched) {
    const lines = load(f).split('\n');
    const head = lines.indexOf(HEADER);
    if (head < 0) throw new Error(`${f}: no register table header`);
    const kept = all.filter((r) => want(r) === f).sort((a, b) => a.n - b.n).map((r) => r.text);
    const rest = lines.filter((l, i) => i <= head + 1 || !ROW.test(l));
    rest.splice(head + 2, 0, ...kept);
    texts.set(f, rest.join('\n'));
  }
  fs.mkdirSync(path.join(root, DIR), { recursive: true });
  for (const f of touched) fs.writeFileSync(path.join(root, f), texts.get(f));
  return moving.map((r) => `${r.id} to ${want(r)}`);
}

module.exports = { MAIN, DIR, HEADER, files, rows, nextId, fileFor, tidy };

if (require.main === module) {
  const root = path.join(__dirname, '..');
  if (process.argv[2] !== 'tidy') { console.log('usage: node tools/register.js tidy'); process.exit(1); }
  const moved = tidy(root);
  console.log(moved.length ? `moved ${moved.length}: ${moved.length > 8 ? `${moved.slice(0, 8).join('; ')}; …` : moved.join('; ')}` : 'the register is tidy');
}
