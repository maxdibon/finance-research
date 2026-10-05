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
// Material that leaves Dibon: the portfolio and its design, and outreach drafts.
const PUBLIC_PATHS = [path.join('docs', 'marketing'), path.join('docs', 'outreach'), 'design'];

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
  const lines = read(root, NAMES_FILE).split('\n')
    .map((t) => t.trim()).filter((t) => t && !t.startsWith('#'));
  // A line starting "public:" names a customer the owner allows in internal
  // documents but not in anything that leaves Dibon (FS-414).
  const pattern = (terms) => terms.length && new RegExp(`(?<![\\w-])(${terms
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?![\\w-])`, 'i');
  const everywhere = pattern(lines.filter((t) => !/^public:/i.test(t)));
  const outward = pattern(lines.filter((t) => /^public:/i.test(t)).map((t) => t.replace(/^public:\s*/i, '')));
  const failures = [];
  for (const file of files) {
    const isOutward = PUBLIC_PATHS.some((p) => (file + path.sep).startsWith(p + path.sep));
    read(root, file).split('\n').forEach((text, i) => {
      const m = (everywhere && text.match(everywhere)) || (isOutward && outward && text.match(outward));
      if (m) failures.push(fail('names', file, i + 1, `protected name "${m[1]}"${isOutward && !(everywhere && text.match(everywhere)) ? ' in outward material' : ''}`));
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

// ── public ───────────────────────────────────────────────────────────────
// Documents in docs/marketing/ go to prospects (FS-244). They may not carry
// internal references: register ids, partner or decision ids, or paths
// into this repository.
const PUBLIC_DIR = path.join('docs', 'marketing');
const INTERNAL = /\b(FS-\d{3}|PT-\d{2}|SD-\d{2}|[A-Z]{2}-\d{2})\b|REVIEW\.md|sources\/|clients\/|docs\/(modules|architecture|partners|decisions)/;

function checkPublic(root) {
  const dir = path.join(root, PUBLIC_DIR);
  if (!fs.existsSync(dir)) return [];
  const failures = [];
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md'))) {
    const rel = path.join(PUBLIC_DIR, f);
    const body = read(root, rel).replace(/^---\n[\s\S]*?\n---\n/, '');
    const offset = read(root, rel).split('\n').length - body.split('\n').length;
    body.split('\n').forEach((text, i) => {
      const m = text.match(INTERNAL);
      if (m) failures.push(fail('public', rel, i + 1 + offset, `internal reference "${m[0]}" in a public document`));
    });
  }
  return failures;
}

// ── onboarding ───────────────────────────────────────────────────────────
// Everything the portfolio sells has an onboarding checklist (FS-343,
// FS-353). The products are read from the PDF's own list, so a product added
// to the portfolio without a checklist fails here.
const PAGES_REST = path.join('design', 'portfolio-pdf', 'pages-rest.js');
const ONBOARDING = path.join('docs', 'onboarding.md');

function portfolioProducts(root) {
  const m = read(root, PAGES_REST).match(/const products = \[([\s\S]*?)\];/);
  return m ? [...m[1].matchAll(/\['([a-z-]+)',/g)].map((x) => x[1]) : null;
}

function checkOnboarding(root) {
  const products = portfolioProducts(root);
  if (!products) return [fail('onboarding', PAGES_REST, 0, 'portfolio product list not found; the check cannot run')];
  if (!fs.existsSync(path.join(root, ONBOARDING))) return [fail('onboarding', ONBOARDING, 0, 'onboarding checklist missing')];
  const failures = [];
  const linked = new Map();
  read(root, ONBOARDING).split('\n').forEach((text, i) => {
    const m = text.match(/^Module: \[[^\]]+\]\(modules\/([a-z-]+)\.md\)/);
    if (!m) return;
    linked.set(m[1], i + 1);
    if (!fs.existsSync(path.join(root, 'docs', 'modules', `${m[1]}.md`))) {
      failures.push(fail('onboarding', ONBOARDING, i + 1, `links module ${m[1]}, which does not exist`));
    }
  });
  for (const p of products) {
    if (!linked.has(p)) failures.push(fail('onboarding', ONBOARDING, 0, `no checklist for ${p}, which the portfolio sells`));
  }
  return failures;
}

// ── claims ───────────────────────────────────────────────────────────────
// Every integration the portfolio shows as integrated (an "Integrated:" entry
// on the Integrations page of the copy) is listed in claims.json with its
// basis: "live", backed by a partner at stage Live or a capability that is
// Live or Built, or "v1", the owner's decision to present a working v1
// (FS-263). Nothing is claimed that the records do not back or the owner has
// not chosen (FS-353). The copy is the single source of the words (FS-352).
const CLAIMS = path.join('design', 'portfolio-pdf', 'claims.json');
const COPY = path.join('docs', 'marketing', 'portfolio.md');

function integratedChips(root) {
  const { parse } = require(path.join(root, 'design', 'portfolio-pdf', 'copy.js'));
  const integ = parse(read(root, COPY), path.join(root, COPY)).find((s) => s.title === 'Integrations');
  if (!integ) return null;
  return integ.items.flatMap((it) => (it.fields.Integrated ? it.fields.Integrated.split('; ').map((s) => s.trim()) : []));
}

function checkClaims(root) {
  let chips;
  try { chips = integratedChips(root); } catch (e) { return []; } // the copy check reports it
  if (!chips) return [fail('claims', COPY, 0, 'no Integrations page in the copy; the check cannot run')];
  if (!fs.existsSync(path.join(root, CLAIMS))) return [fail('claims', CLAIMS, 0, 'claims register missing')];
  let claims;
  try { claims = JSON.parse(read(root, CLAIMS)); } catch (e) { return [fail('claims', CLAIMS, 0, `not valid JSON: ${e.message}`)]; }
  const failures = [];
  const f = (msg) => failures.push(fail('claims', CLAIMS, 0, msg));
  const byName = new Map(claims.map((c) => [c.claim, c]));
  const live = new Set(parsePartners(root).candidates.filter((r) => r.cells[6] === 'Live').map((r) => r.id));
  const caps = new Map();
  for (const file of moduleFiles(root)) for (const r of capabilityRows(read(root, file))) caps.set(r.id, r.status);
  for (const chip of chips) if (!byName.has(chip)) f(`"${chip}" is shown as integrated but has no claim`);
  for (const c of claims) {
    if (!chips.includes(c.claim)) f(`"${c.claim}" is claimed but no longer shown as integrated; remove it`);
    if (c.basis === 'v1') {
      if (!/FS-263/.test(c.ref || '')) f(`"${c.claim}" rests on v1 framing but does not cite the owner's decision`);
    } else if (c.basis === 'live') {
      const ok = (c.evidence || []).some((e) => live.has(e) || ['Live', 'Built'].includes(caps.get(e)));
      if (!ok) f(`"${c.claim}" is claimed live, but none of its evidence is a Live partner or a Live or Built capability`);
    } else {
      f(`"${c.claim}" has basis "${c.basis}"; expected live or v1`);
    }
  }
  return failures;
}

// ── copy ─────────────────────────────────────────────────────────────────
// The portfolio copy parses in its strict format (FS-352), so a stray line
// fails here rather than at build time.
function checkCopy(root) {
  const { parse } = require(path.join(root, 'design', 'portfolio-pdf', 'copy.js'));
  try { parse(read(root, COPY), path.join(root, COPY)); } catch (e) { return [fail('copy', COPY, 0, e.message)]; }
  return [];
}

// ── decisions ────────────────────────────────────────────────────────────
// A register row marked [decision] has an entry in docs/decisions.md, and
// every entry there belongs to a marked row that was decided (FS-353).
const DECISIONS = path.join('docs', 'decisions.md');

function checkDecisions(root) {
  const failures = [];
  const rows = parseRegister(root);
  const byId = new Map(rows.map((r) => [r.id, r]));
  const entries = new Map();
  read(root, DECISIONS).split('\n').forEach((text, i) => {
    if (!text.startsWith('## ')) return;
    for (const m of text.matchAll(/FS-\d{3}/g)) entries.set(m[0], i + 1);
  });
  for (const r of rows) {
    if (r.notes.includes('[decision]') && !entries.has(r.id)) {
      failures.push(fail('decisions', 'REVIEW.md', r.line, `${r.id} is marked [decision] but has no entry in docs/decisions.md`));
    }
  }
  for (const [id, line] of entries) {
    const r = byId.get(id);
    if (!r) continue; // review-ids reports unknown ids
    if (!r.notes.includes('[decision]')) failures.push(fail('decisions', DECISIONS, line, `${id} has an entry, but its register row is not marked [decision]`));
    if (!['DECIDED', 'ANSWERED'].includes(r.status)) failures.push(fail('decisions', DECISIONS, line, `${id} has an entry but is ${r.status} in the register`));
  }
  return failures;
}

// ── customers ────────────────────────────────────────────────────────────
// Every capability a customer depends on exists in a module, and a customer
// with a delivery file depends on exactly the capabilities that file maps
// its requirements to, so the register cannot drift from the map (FS-413).
const CUSTOMERS = path.join('docs', 'customers.md');
const ID_RE = /\b[A-Z]{2}-\d{2}\b/g;

function checkCustomers(root) {
  if (!fs.existsSync(path.join(root, CUSTOMERS))) return [fail('customers', CUSTOMERS, 0, 'customer register missing')];
  const known = new Set(moduleFiles(root).flatMap((f) => capabilityRows(read(root, f)).map((r) => r.id)));
  const failures = [];
  read(root, CUSTOMERS).split('\n').forEach((line, i) => {
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (!/^CU-\d{2}$/.test(cells[0] || '')) return;
    if (cells.length !== 11) { failures.push(fail('customers', CUSTOMERS, i + 1, `${cells[0]} has ${cells.length} cells; expected 11`)); return; }
    const depends = new Set(cells[8].match(ID_RE) || []);
    for (const id of depends) if (!known.has(id)) failures.push(fail('customers', CUSTOMERS, i + 1, `${cells[0]} depends on ${id}, which no module defines`));
    const link = cells[9].match(/\]\(([^)]+)\)/);
    if (!link) return;
    const rel = path.join('docs', ...link[1].split('/'));
    if (!fs.existsSync(path.join(root, rel))) { failures.push(fail('customers', CUSTOMERS, i + 1, `${cells[0]} delivery file ${link[1]} missing`)); return; }
    const mapped = new Set();
    read(root, rel).split('\n').forEach((l, j) => {
      const c = l.split('|').slice(1, -1).map((x) => x.trim());
      if (!/^RC-\d{2}$/.test(c[0] || '') && !/^[A-Z]{2}-\d{2}$/.test(c[0] || '')) return;
      for (const id of c[2].match(ID_RE) || []) {
        if (!known.has(id)) failures.push(fail('customers', rel, j + 1, `${c[0]} maps to ${id}, which no module defines`));
        mapped.add(id);
      }
    });
    const missing = [...mapped].filter((id) => !depends.has(id));
    const extra = [...depends].filter((id) => !mapped.has(id));
    if (missing.length || extra.length) failures.push(fail('customers', CUSTOMERS, i + 1, `${cells[0]} "Depends on" differs from its delivery file: missing ${missing.join(', ') || 'none'}; not in the file ${extra.join(', ') || 'none'}`));
  });
  return failures;
}

// ── assurance ────────────────────────────────────────────────────────────
// Assurance work is never for a customer (FS-440): an engagement that names
// an institution in docs/customers.md fails unless it was declined.
const ASSURANCE = path.join('docs', 'assurance.md');
const ENGAGEMENT_DECISIONS = ['Accepted', 'Declined (conflict)', 'Declined (other)'];

function checkAssurance(root) {
  if (!fs.existsSync(path.join(root, ASSURANCE))) return [fail('assurance', ASSURANCE, 0, 'assurance register missing')];
  const customers = read(root, CUSTOMERS).split('\n')
    .map((l) => l.split('|').slice(1, -1).map((c) => c.trim()))
    .filter((c) => /^CU-\d{2}$/.test(c[0] || ''))
    .map((c) => c[1].replace(/\s*\(.*\)$/, '').toLowerCase());
  const failures = [];
  read(root, ASSURANCE).split('\n').forEach((line, i) => {
    const c = line.split('|').slice(1, -1).map((x) => x.trim());
    if (!/^AS-\d{2}$/.test(c[0] || '')) return;
    const at = (m) => failures.push(fail('assurance', ASSURANCE, i + 1, `${c[0]} ${m}`));
    if (c.length !== 8) return at(`has ${c.length} cells; expected 8`);
    if (!ENGAGEMENT_DECISIONS.includes(c[5])) at(`decision "${c[5]}" outside ${ENGAGEMENT_DECISIONS.join(', ')}`);
    const name = c[1].toLowerCase();
    const hit = customers.find((n) => name.includes(n) || n.includes(name));
    if (hit && !c[5].startsWith('Declined')) at(`names a customer (${hit}); assurance work is never for a customer`);
  });
  return failures;
}

// ── regulation ───────────────────────────────────────────────────────────
// The law register (FS-429): every row passes a scope test, a Deep or
// Targeted row drives something that exists, the version named in its link
// is the one in "As at", and every LR id cited anywhere is in the register.
// The texts themselves are kept out of git, so local copies are matched to
// the register only where the folder exists.
const REGULATION = path.join('docs', 'regulation.md');
const LAW_DIR = path.join('sources', 'regulation', 'ke');
const TESTS = ['Institution', 'Payments', 'Obligation', 'Source', 'Dibon'];
const DEPTHS = ['Deep', 'Targeted', 'Line', 'Unread'];
const REF_RE = /\b(?:OB-[A-Z]{2,3}-\d{2}|[A-Z]{2}-\d{2})\b/g;

function knownIds(root) {
  const ids = new Set(moduleFiles(root).flatMap((f) => capabilityRows(read(root, f)).map((r) => r.id)));
  const rowIds = (rel, re) => fs.existsSync(path.join(root, rel))
    ? read(root, rel).split('\n').map((l) => (l.match(re) || [])[1]).filter(Boolean) : [];
  rowIds(path.join('docs', 'compliance.md'), /^\| (LC-\d{2}) \|/).forEach((id) => ids.add(id));
  rowIds(path.join('docs', 'onboarding.md'), /^\| (OB-[A-Z]{2,3}-\d{2}) \|/).forEach((id) => ids.add(id));
  rowIds(REGULATION, /^\| (LR-\d{2}) \|/).forEach((id) => ids.add(id));
  return ids;
}

function checkRegulation(root, files) {
  if (!fs.existsSync(path.join(root, REGULATION))) return [fail('regulation', REGULATION, 0, 'law register missing')];
  const known = knownIds(root);
  const failures = [];
  const named = new Map();
  let expect = 1;
  read(root, REGULATION).split('\n').forEach((line, i) => {
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (!/^LR-\d{2}$/.test(cells[0] || '')) return;
    const at = (m) => failures.push(fail('regulation', REGULATION, i + 1, `${cells[0]} ${m}`));
    if (cells.length !== 10) return at(`has ${cells.length} cells; expected 10`);
    const [id, , link, asAt, tests, , drives, depth] = cells;
    if (+id.slice(3) !== expect) at(`out of sequence; expected LR-${String(expect).padStart(2, '0')}`);
    expect = +id.slice(3) + 1;
    const t = tests.split(',').map((x) => x.trim());
    if (!t.length || t.some((x) => !TESTS.includes(x))) at(`tests "${tests}" outside ${TESTS.join(', ')}`);
    if (!DEPTHS.includes(depth)) at(`depth "${depth}" outside ${DEPTHS.join(', ')}`);
    const m = link.match(/^\[([a-z0-9-]+)@(\d{4}-\d{2}-\d{2})\]\(https:\/\/new\.kenyalaw\.org\/akn\/ke\/[^)]+@(\d{4}-\d{2}-\d{2})\)$/);
    if (!m) at('link is not [name@date](Kenya Law expression URL)');
    else {
      if (m[2] !== m[3] || m[2] !== asAt) at(`link version ${m[2]}, URL version ${m[3]} and As at ${asAt} must agree`);
      named.set(`${m[1]}@${m[2]}.pdf`, { id, depth, line: i + 1 });
    }
    const refs = drives.match(REF_RE) || [];
    for (const r of refs) if (!known.has(r)) at(`drives ${r}, which does not exist`);
    if ((depth === 'Deep' || depth === 'Targeted') && !refs.length) at(`is ${depth} but drives nothing; it does not belong here`);
  });
  for (const file of files.filter((f) => f.split(path.sep)[0] === 'docs')) {
    const text = read(root, file);
    for (const r of new Set(text.match(/\bLR-\d{2}\b/g) || [])) {
      if (!known.has(r)) failures.push(fail('regulation', file, 0, `cites ${r}, which is not in the law register`));
    }
  }
  const dir = path.join(root, LAW_DIR);
  if (fs.existsSync(dir)) {
    const local = fs.readdirSync(dir).filter((f) => f.endsWith('.pdf'));
    for (const f of local) if (!named.has(f)) failures.push(fail('regulation', path.join(LAW_DIR, f), 0, 'a local text no register row names (or of another version)'));
    for (const [f, r] of named) if ((r.depth === 'Deep' || r.depth === 'Targeted') && !local.includes(f)) failures.push(fail('regulation', REGULATION, r.line, `${r.id} is ${r.depth} but ${f} is not in ${LAW_DIR.split(path.sep).join('/')}`));
  }
  return failures;
}

// ── reviewed ─────────────────────────────────────────────────────────────
// Every document under docs/ carries last_reviewed, and it is never older
// than the document's last change: a change being committed counts as
// today, otherwise the date of the last commit that touched it (FS-406).
// History lives in git, so a copy that is not a repository has nothing to
// compare against and is skipped; the break tests make a repository.
function localDate(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function git(root, args) {
  return require('child_process').execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
}

function checkReviewed(root, files) {
  try { if (git(root, ['rev-parse', '--show-toplevel']).trim().replace(/\\/g, '/').toLowerCase() !== path.resolve(root).replace(/\\/g, '/').toLowerCase()) return []; } catch { return []; }
  const docs = files.filter((f) => f.split(path.sep)[0] === 'docs' && f.endsWith('.md'));
  const changed = new Map();
  let date = null;
  for (const line of git(root, ['log', '--format=%x00%cs', '--name-only', '--', 'docs']).split('\n')) {
    if (line.startsWith('\0')) date = line.slice(1);
    else if (line && !changed.has(line)) changed.set(line, date);
  }
  const today = localDate();
  for (const line of git(root, ['status', '--porcelain', '--', 'docs']).split('\n')) {
    if (line.trim()) changed.set(line.slice(3).split(' -> ').pop().replace(/^"|"$/g, ''), today);
  }
  const failures = [];
  for (const file of docs) {
    const rel = file.split(path.sep).join('/');
    const front = read(root, file).match(/^---\n([\s\S]*?)\n---\n/);
    const m = front && front[1].match(/^last_reviewed: (\d{4}-\d{2}-\d{2})$/m);
    if (!m) { failures.push(fail('reviewed', file, 1, 'no last_reviewed in the front matter')); continue; }
    const last = changed.get(rel);
    if (last && m[1] < last) failures.push(fail('reviewed', file, 1, `changed ${last}, but last_reviewed is ${m[1]}`));
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
    ...checkPublic(root),
    ...checkOnboarding(root),
    ...checkCopy(root),
    ...checkClaims(root),
    ...checkDecisions(root),
    ...checkCustomers(root),
    ...checkRegulation(root, files),
    ...checkAssurance(root),
    ...checkReviewed(root, files),
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
