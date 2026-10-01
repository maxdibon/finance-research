#!/usr/bin/env node
// Checks the documents against each other and against the register (FS-074).
//
//   node tools/check.js            run every check; exit 1 on any failure
//   node tools/check.js --counts   also print counts computed from the sources
//
// There is no build here to measure the documents against, so each check
// compares one document with another, or with REVIEW.md. Every check is
// broken on purpose in tools/check.test.js, and must fail there by name.
//
// Known limit: PDFs are not scanned for protected names. They are binary,
// and the ones tracked are Dibon's own published material.

'use strict';

const fs = require('fs');
const path = require('path');

// Mirrors .gitignore: these never reach a commit, so they are not checked.
const SKIP_DIRS = new Set([
  '.git', 'build', 'clients', 'node_modules',
  path.join('sources', 'confidential'), path.join('sources', 'gatekeepr'),
]);
const TEXT_EXT = new Set(['.md', '.txt', '.html', '.js', '.json', '.gitignore']);
const NAMES_FILE = path.join('sources', 'confidential', 'protected-names.txt');

const STATUSES = ['Live', 'Built', 'Designed', 'Planned'];
const REVIEW_STATUSES = ['OPEN', 'DECIDED', 'ANSWERED', 'DECLINED'];
const DIAGRAM_WIDTH = 78;

function walk(root, rel = '') {
  const out = [];
  for (const entry of fs.readdirSync(path.join(root, rel), { withFileTypes: true })) {
    const relPath = path.join(rel, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(relPath)) out.push(...walk(root, relPath));
    } else if (TEXT_EXT.has(path.extname(entry.name) || entry.name)) {
      out.push(relPath);
    }
  }
  return out;
}

function read(root, rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/\r\n/g, '\n');
}

function fail(check, file, line, message) {
  return { check, file: file.split(path.sep).join('/'), line, message };
}

// ── names ────────────────────────────────────────────────────────────────
// No protected name may appear in a file that can be committed. The list
// itself is not tracked, so a missing list is a failure, not a pass: a check
// that skips when it cannot run is a check that silences itself.
function checkNames(root, files) {
  const listPath = path.join(root, NAMES_FILE);
  if (!fs.existsSync(listPath)) {
    return [fail('names', NAMES_FILE, 0, 'protected-names list missing; the check cannot run')];
  }
  const terms = read(root, NAMES_FILE).split('\n')
    .map((t) => t.trim()).filter((t) => t && !t.startsWith('#'));
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(?<![\\w-])(${escaped.join('|')})(?![\\w-])`, 'i');
  const failures = [];
  for (const file of files) {
    read(root, file).split('\n').forEach((text, i) => {
      const m = text.match(pattern);
      if (m) failures.push(fail('names', file, i + 1, `protected name "${m[1]}"`));
    });
  }
  return failures;
}

// ── register ─────────────────────────────────────────────────────────────
function parseRegister(root) {
  const rows = [];
  read(root, 'REVIEW.md').split('\n').forEach((text, i) => {
    if (!/^\| FS-\d{3} \|/.test(text)) return;
    const cells = text.split('|').slice(1, -1).map((c) => c.trim());
    rows.push({ line: i + 1, id: cells[0], raisedBy: cells[1], point: cells[2],
      status: cells[3], notes: cells[4], cellCount: cells.length });
  });
  return rows;
}

function checkRegister(root) {
  const failures = [];
  const rows = parseRegister(root);
  rows.forEach((row, i) => {
    const expected = `FS-${String(i + 1).padStart(3, '0')}`;
    if (row.id !== expected) {
      failures.push(fail('register', 'REVIEW.md', row.line, `${row.id} out of sequence; expected ${expected}`));
    }
    if (row.cellCount !== 5) {
      failures.push(fail('register', 'REVIEW.md', row.line, `${row.id} has ${row.cellCount} cells; expected 5`));
    }
    if (!REVIEW_STATUSES.includes(row.status)) {
      failures.push(fail('register', 'REVIEW.md', row.line, `${row.id} status "${row.status}" not in ${REVIEW_STATUSES.join('/')}`));
    }
    if (!row.raisedBy) failures.push(fail('register', 'REVIEW.md', row.line, `${row.id} has no raiser`));
    if (row.status === 'DECLINED' && !row.notes) {
      failures.push(fail('register', 'REVIEW.md', row.line, `${row.id} declined with no reason`));
    }
  });
  return failures;
}

// ── review-ids ───────────────────────────────────────────────────────────
// Every FS id cited anywhere must exist in the register.
function checkReviewIds(root, files) {
  const known = new Set(parseRegister(root).map((r) => r.id));
  const failures = [];
  for (const file of files) {
    read(root, file).split('\n').forEach((text, i) => {
      for (const m of text.matchAll(/\bFS-\d{3}\b/g)) {
        if (!known.has(m[0])) failures.push(fail('review-ids', file, i + 1, `${m[0]} is not in REVIEW.md`));
      }
    });
  }
  return failures;
}

// ── template ─────────────────────────────────────────────────────────────
function frontMatterKeys(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  return m[1].split('\n')
    .map((l) => l.match(/^([a-z_]+):/)).filter(Boolean).map((k) => k[1]);
}

function headings(text) {
  // Headings inside fenced blocks and HTML comments are not headings.
  const body = text.replace(/<!--[\s\S]*?-->/g, '').replace(/```[\s\S]*?```/g, '');
  return body.split('\n').filter((l) => /^## /.test(l)).map((l) => l.slice(3).trim());
}

function moduleFiles(root) {
  const dir = path.join(root, 'docs', 'modules');
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((f) => path.join('docs', 'modules', f));
}

function checkTemplate(root) {
  const template = read(root, path.join('docs', 'modules', '_template.md'));
  const wantKeys = frontMatterKeys(template);
  const wantHeadings = headings(template);
  const failures = [];
  for (const file of moduleFiles(root)) {
    const text = read(root, file);
    const keys = frontMatterKeys(text);
    if (!keys) {
      failures.push(fail('template', file, 1, 'no front matter'));
    } else {
      for (const k of wantKeys) if (!keys.includes(k)) failures.push(fail('template', file, 1, `front matter missing "${k}"`));
      const id = text.match(/^id: *(\S+)/m);
      const base = path.basename(file, '.md');
      if (!id || id[1] !== base) failures.push(fail('template', file, 1, `id "${id ? id[1] : ''}" does not match file name "${base}"`));
    }
    const got = headings(text);
    const n = Math.max(got.length, wantHeadings.length);
    for (let i = 0; i < n; i++) {
      if (got[i] !== wantHeadings[i]) {
        failures.push(fail('template', file, 0, `heading ${i + 1} is "${got[i] || '(missing)'}"; template has "${wantHeadings[i] || '(none)'}"`));
        break;
      }
    }
  }
  return failures;
}

// ── capabilities ─────────────────────────────────────────────────────────
// Every capability row carries a status from the vocabulary and evidence.
function capabilityRows(text) {
  const rows = [];
  let inSection = false;
  text.split('\n').forEach((line, i) => {
    if (/^## /.test(line)) inSection = /^## 3 · /.test(line);
    if (!inSection) return;
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length && /^[A-Z]{2}-\d{2}$/.test(cells[0])) {
      rows.push({ line: i + 1, id: cells[0], status: cells[2], evidence: cells[3] });
    }
  });
  return rows;
}

function checkCapabilities(root) {
  const failures = [];
  for (const file of moduleFiles(root)) {
    const rows = capabilityRows(read(root, file));
    if (!rows.length) failures.push(fail('capabilities', file, 0, 'no capability rows in §3'));
    const seen = new Set();
    for (const row of rows) {
      if (seen.has(row.id)) failures.push(fail('capabilities', file, row.line, `${row.id} duplicated`));
      seen.add(row.id);
      if (!STATUSES.includes(row.status)) {
        failures.push(fail('capabilities', file, row.line, `${row.id} status "${row.status}" not in ${STATUSES.join('/')}`));
      }
      if (!row.evidence) failures.push(fail('capabilities', file, row.line, `${row.id} has no evidence`));
    }
  }
  return failures;
}

// ── diagrams ─────────────────────────────────────────────────────────────
// A fence with no language is a diagram (FS-064) and must fit 78 columns.
function checkDiagrams(root, files) {
  const failures = [];
  for (const file of files.filter((f) => f.endsWith('.md'))) {
    let inDiagram = false;
    let inFence = false;
    read(root, file).split('\n').forEach((line, i) => {
      if (/^\s*```/.test(line)) {
        if (!inFence) { inFence = true; inDiagram = /^\s*```\s*$/.test(line); } else { inFence = false; inDiagram = false; }
        return;
      }
      if (inDiagram && line.length > DIAGRAM_WIDTH) {
        failures.push(fail('diagrams', file, i + 1, `${line.length} columns; limit ${DIAGRAM_WIDTH}`));
      }
    });
  }
  return failures;
}

// ── partners ─────────────────────────────────────────────────────────────
// docs/partners.md: candidates have a stage from the vocabulary; decisions
// name only candidates, criteria and decisions that exist.
const PARTNERS_FILE = path.join('docs', 'partners.md');
const STAGES = ['Candidate', 'Contacted', 'In discussion', 'Onboarding', 'Live',
  'Unconfirmed', 'Parked', 'Declined'];
const DECISION_STATUSES = ['OPEN', 'DECIDED', 'PARKED'];

function parsePartners(root) {
  const out = { candidates: [], decisions: [], criteria: [] };
  if (!fs.existsSync(path.join(root, PARTNERS_FILE))) return out;
  read(root, PARTNERS_FILE).split('\n').forEach((text, i) => {
    const cells = text.split('|').slice(1, -1).map((c) => c.trim());
    if (!cells.length) return;
    const row = { line: i + 1, id: cells[0], cells };
    if (/^PT-\d{2}$/.test(cells[0])) out.candidates.push(row);
    else if (/^SD-\d{2}$/.test(cells[0])) out.decisions.push(row);
    else if (/^C\d+$/.test(cells[0])) out.criteria.push(row);
  });
  return out;
}

function checkPartners(root) {
  const failures = [];
  const { candidates, decisions, criteria } = parsePartners(root);
  const f = (line, msg) => failures.push(fail('partners', PARTNERS_FILE, line, msg));
  const sequence = (rows, prefix) => rows.forEach((r, i) => {
    const want = `${prefix}-${String(i + 1).padStart(2, '0')}`;
    if (r.id !== want) f(r.line, `${r.id} out of sequence; expected ${want}`);
  });
  sequence(candidates, 'PT');
  sequence(decisions, 'SD');
  for (const r of candidates) {
    if (r.cells.length !== 11) f(r.line, `${r.id} has ${r.cells.length} cells; expected 11`);
    if (!STAGES.includes(r.cells[6])) f(r.line, `${r.id} stage "${r.cells[6]}" not in ${STAGES.join('/')}`);
    if (!r.cells[5]) f(r.line, `${r.id} has no Verified entry; write "None" if nothing is verified`);
    if (!r.cells[7]) f(r.line, `${r.id} has no last event`);
  }
  const pt = new Set(candidates.map((r) => r.id));
  const sd = new Set(decisions.map((r) => r.id));
  const cr = new Set(criteria.map((r) => r.id));
  for (const r of decisions) {
    if (r.cells.length !== 7) f(r.line, `${r.id} has ${r.cells.length} cells; expected 7`);
    for (const m of (r.cells[2] || '').matchAll(/PT-\d{2}/g)) if (!pt.has(m[0])) f(r.line, `${r.id} names ${m[0]}, which is not a candidate`);
    for (const m of (r.cells[3] || '').matchAll(/C\d+/g)) if (!cr.has(m[0])) f(r.line, `${r.id} uses criterion ${m[0]}, which is not defined`);
    for (const m of (r.cells[4] || '').matchAll(/SD-\d{2}/g)) if (!sd.has(m[0])) f(r.line, `${r.id} depends on ${m[0]}, which does not exist`);
    if (!DECISION_STATUSES.includes(r.cells[5])) f(r.line, `${r.id} status "${r.cells[5]}" not in ${DECISION_STATUSES.join('/')}`);
  }
  return failures;
}

// ── counts ───────────────────────────────────────────────────────────────
function counts(root) {
  const tally = (xs) => xs.reduce((m, x) => ((m[x] = (m[x] || 0) + 1), m), {});
  const rows = parseRegister(root);
  const modules = {};
  for (const file of moduleFiles(root)) {
    modules[path.basename(file, '.md')] = tally(capabilityRows(read(root, file)).map((r) => r.status));
  }
  const p = parsePartners(root);
  return {
    register: { rows: rows.length, byStatus: tally(rows.map((r) => r.status)), byRaiser: tally(rows.map((r) => r.raisedBy)) },
    modules,
    partners: {
      candidates: p.candidates.length,
      byStage: tally(p.candidates.map((r) => r.cells[6])),
      decisions: tally(p.decisions.map((r) => r.cells[5])),
    },
  };
}

function runAll(root) {
  const files = walk(root);
  return [
    ...checkNames(root, files),
    ...checkRegister(root),
    ...checkReviewIds(root, files),
    ...checkTemplate(root),
    ...checkCapabilities(root),
    ...checkDiagrams(root, files),
    ...checkPartners(root),
  ];
}

module.exports = { runAll, counts, moduleFiles };

if (require.main === module) {
  const args = process.argv.slice(2);
  const root = path.resolve(args.find((a) => !a.startsWith('--')) || path.join(__dirname, '..'));
  const failures = runAll(root);
  for (const f of failures) console.log(`FAIL ${f.check}  ${f.file}${f.line ? `:${f.line}` : ''}  ${f.message}`);
  if (args.includes('--counts')) console.log(JSON.stringify(counts(root), null, 2));
  console.log(failures.length ? `${failures.length} failure(s)` : 'all checks pass');
  process.exit(failures.length ? 1 : 0);
}
