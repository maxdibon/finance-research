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
// FS-779: every open row is rated; a closed row has none.
const CRITICALITIES = ['Critical', 'High', 'Medium', 'Low'];
const DIAGRAM_WIDTH = 100; // FS-579: was 78

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
// FS-866: the register is REVIEW.md and review/ (tools/register.js), read
// as one; each row knows its file.
function parseRegister(root) {
  return require('./register').rows(root); // beside the check, as dibon.js is
}

// ── citations ────────────────────────────────────────────────────────────
// FS-868: each law whose provisions we cite has a card in docs/law/ (its
// citation, regulator, what it was made under, whether in force, what it
// is, and what each cited provision requires); a document that names its
// main instrument (law: LR-03) has every cite placed and on its card, and
// ends with "Regulations cited", generated from the cards (tools/citations.js).
function checkCitations(root) {
  const cit = require('./citations'); // beside the check, as dibon.js is
  if (!fs.existsSync(path.join(root, cit.LAW_DIR))) return [];
  const out = [];
  const lawRegister = cit.register(root);
  const cards = cit.cards(root);
  const known = cit.names(root);
  for (const [id, card] of cards) {
    const at = (m) => out.push(fail('citations', card.file, 0, `${id}: ${m}`));
    if (!lawRegister.has(id)) at('is not in the law register');
    for (const k of ['Citation', 'Regulator', 'Made under', 'In force', 'What it is']) if (!card.fields[k]) at(`no "${k}"`);
    if (!card.provisions.length) at('no provisions cited: a card is for a law whose provisions we cite');
    const seen = new Set();
    for (const p of card.provisions) {
      const s = cit.show(p);
      if (seen.has(s)) at(`${s} has two rows`);
      seen.add(s);
      if (!p.requires) at(`${s} says nothing about what it requires`);
    }
  }
  for (const file of cit.documents(root)) {
    const text = read(root, file);
    const law = cit.mainLaw(text);
    if (law && !cards.has(law)) { out.push(fail('citations', file, 1, `law: ${law} has no card in docs/law/`)); continue; }
    for (const c of cit.cites(text, law, known)) {
      if (!c.law) out.push(fail('citations', file, c.line, `${cit.show(c)} names no instrument, and the document has no main one (law: mixed): name it, or give its id`));
      else if (!cards.has(c.law)) out.push(fail('citations', file, c.line, `${cit.show(c)} is placed with ${c.law}, which has no card: write docs/law/${c.law}.md, or give the cite its instrument's id`));
      else if (!cards.get(c.law).provisions.some((r) => cit.covers(r, c))) out.push(fail('citations', file, c.line, `${cit.show(c)} (${c.law}) has no row on its card: add what it requires to docs/law/${c.law}.md`));
    }
    const b = cit.block(text);
    if (!b) out.push(fail('citations', file, 0, 'no "Regulations cited" section at its end: run node tools/citations.js'));
    else if (b.text !== cit.section(root, file)) out.push(fail('citations', file, 0, 'its "Regulations cited" section differs from the cards: run node tools/citations.js'));
  }
  return out;
}

// ── markup ───────────────────────────────────────────────────────────────
// FS-866: what a Markdown preview (GitHub, the desktop app) cannot show.
// A file over 200 KB: one of 414 KB showed as raw text, with no table
// (the limit lies between 256 and 360 KB). A word in angle brackets
// outside code (<file>): read as an HTML tag, it vanishes; write it in
// backticks.
const MARKUP_LIMIT = 200 * 1024;
function checkMarkup(root, files) {
  const out = [];
  for (const file of files.filter((f) => f.endsWith('.md'))) {
    const raw = fs.readFileSync(path.join(root, file), 'utf8');
    if (Buffer.byteLength(raw) > MARKUP_LIMIT) out.push(fail('markup', file, 0, `${Math.round(Buffer.byteLength(raw) / 1024)} KB: over ${MARKUP_LIMIT / 1024} KB, a preview may show it as raw text; split it`));
    let fenced = false;
    raw.replace(/\r\n/g, '\n').split('\n').forEach((line, i) => {
      if (/^\s*```/.test(line)) { fenced = !fenced; return; }
      if (fenced || /^ {4}/.test(line)) return;
      const m = line.replace(/`[^`]*`/g, '').match(/<([A-Za-z][A-Za-z0-9 _-]*)>/);
      if (m && !/^(br|b|i|em|strong|sub|sup|code|kbd|details|summary|p|div|span)$/i.test(m[1])) out.push(fail('markup', file, i + 1, `"<${m[1]}>" is read as an HTML tag and vanishes: write it in backticks`));
    });
  }
  return out;
}

function checkRegister(root) {
  const failures = [];
  const reg = require('./register');
  const rows = parseRegister(root);
  const team = reg.team(root);
  // FS-905: a name is one person, and so is a handle.
  for (const r of team.repeated) failures.push(fail('register', 'docs/service-management/ways-of-working.md', 0, `the team lists ${r} twice: a name must mean one person (add an initial), a handle too`));
  // A heading holding a table's cells is a script's slip (FS-779): it
  // renders as a huge title and hides the rows it should have changed.
  // FS-866: so is a heading holding any pipe or a row's marker, which a
  // marking script once wrote into the title. In every register file.
  for (const file of reg.files(root)) {
    read(root, file).split('\n').forEach((line, i) => {
      if (/^#/.test(line) && (/\|/.test(line) || /\[decision\]/.test(line))) failures.push(fail('register', file, i + 1, 'a heading holds a pipe or a row\'s marker: a script wrote into it'));
    });
  }
  // Every id once, none skipped, across the files; each file in id order.
  const seen = new Map();
  for (const r of rows) seen.set(r.n, (seen.get(r.n) || 0) + 1);
  const top = Math.max(0, ...rows.map((r) => r.n));
  for (let n = 1; n <= top; n++) {
    const id = `FS-${String(n).padStart(3, '0')}`;
    if (!seen.has(n)) failures.push(fail('register', reg.MAIN, 0, `${id} is missing: ids are never skipped`));
    else if (seen.get(n) > 1) failures.push(fail('register', reg.MAIN, 0, `${id} appears ${seen.get(n)} times`));
  }
  rows.forEach((row, i) => {
    const at = (msg) => failures.push(fail('register', row.file, row.line, msg));
    const prev = rows[i - 1];
    if (prev && prev.file === row.file && prev.n >= row.n) at(`${row.id} out of sequence after ${prev.id}`);
    // FS-866: open rows in REVIEW.md, closed rows in their hundred's file.
    const want = row.status === 'OPEN' ? reg.MAIN : reg.fileFor(row.n);
    if (REVIEW_STATUSES.includes(row.status) && row.file !== want) at(`${row.id} is ${row.status} and belongs in ${want}: run node tools/register.js tidy`);
    if (row.cellCount !== 7) at(`${row.id} has ${row.cellCount} cells; expected 7`);
    // FS-882: who has an open row, by first name, from the team in
    // ways-of-working §1; a closed row says who did it, or "—".
    else if (row.status === 'OPEN' && !team.has(row.with)) at(`${row.id} is open, with "${row.with}": say who has it, by a name from the team in ways-of-working §1 (${[...team.keys()].join(', ')})`);
    else if (row.status !== 'OPEN' && row.with !== '—' && !team.has(row.with)) at(`${row.id} is ${row.status}, with "${row.with}": "—", or a name from the team`);
    if (!REVIEW_STATUSES.includes(row.status)) at(`${row.id} status "${row.status}" not in ${REVIEW_STATUSES.join('/')}`);
    if (row.status === 'OPEN' && !CRITICALITIES.includes(row.criticality)) at(`${row.id} is open with criticality "${row.criticality}"; one of ${CRITICALITIES.join('/')}`);
    if (row.status !== 'OPEN' && row.criticality !== '—') at(`${row.id} is ${row.status} but still rated "${row.criticality}"; a closed row has —`);
    if (!row.raisedBy) at(`${row.id} has no raiser`);
    if (row.status === 'DECLINED' && !row.notes) at(`${row.id} declined with no reason`);
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
        if (!known.has(m[0])) failures.push(fail('review-ids', file, i + 1, `${m[0]} is not in the register (REVIEW.md, review/)`));
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
  // FS-868: the generated "Regulations cited" closes a document after its
  // own sections; a template's order is compared without it.
  return body.split('\n').filter((l) => /^## /.test(l)).map((l) => l.slice(3).trim()).filter((h) => h !== 'Regulations cited');
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
// A fence with no language is a diagram (FS-064) and must fit 100 columns
// (FS-579): GitHub and the generated reader show that much without scrolling.
function checkDiagrams(root, files) {
  const failures = [];
  for (const file of files.filter((f) => f.endsWith('.md'))) {
    let inDiagram = false;
    let inFence = false;
    read(root, file).split('\n').forEach((line, i) => {
      if (/^\s*```/.test(line)) {
        if (!inFence) { inFence = true; inDiagram = /^\s*```\s*$/.test(line); } else { inFence = false; inDiagram = false; }
        // Diagrams are ASCII; the owner prefers it to Mermaid (FS-628).
        if (/^\s*```\s*mermaid\b/.test(line)) failures.push(fail('diagrams', file, i + 1, 'a Mermaid diagram; draw it in ASCII (FS-628)'));
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
      failures.push(fail('decisions', r.file, r.line, `${r.id} is marked [decision] but has no entry in docs/decisions.md`));
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

// ── obligations ──────────────────────────────────────────────────────────
// A decision names what it requires to exist (FS-515), the light version of
// GateKeepr's obligations register. From FS-490 on, every entry carries a
// "- **Requires:**" line. Each item is a capability id a module defines, or
// a file under docs/ with an optional § section it must have and an
// optional "quoted text" it must contain. "nothing" stands alone, for a
// decision that only confirmed or removed something.
const OBLIGATIONS_FROM = 490;
const REQUIRE_RE = /(docs\/[\w./-]+\.md)(?: §(\d+(?:\.\d+)?))?(?: "([^"]+)")?|\b([A-Z]{2}-\d{2})\b/g;

function checkObligations(root) {
  const failures = [];
  const known = new Set(moduleFiles(root).flatMap((f) => capabilityRows(read(root, f)).map((r) => r.id)));
  const lines = read(root, DECISIONS).split('\n');
  const entries = [];
  let cur = null;
  lines.forEach((t, i) => {
    if (t.startsWith('## ')) {
      const m = t.match(/FS-(\d{3})/);
      cur = m ? { id: m[0], n: Number(m[1]), line: i + 1, req: null } : null;
      if (cur) entries.push(cur);
      return;
    }
    const r = t.match(/^- \*\*Requires:\*\* (.*)$/);
    if (r && cur) {
      let text = r[1];
      for (let j = i + 1; j < lines.length && /^ {2}\S/.test(lines[j]); j++) text += ` ${lines[j].trim()}`;
      cur.req = { text, line: i + 1 };
    }
  });
  for (const e of entries) {
    if (!e.req) {
      if (e.n >= OBLIGATIONS_FROM) failures.push(fail('obligations', DECISIONS, e.line, `${e.id} has no "Requires:" line; name what the decision requires to exist, or "nothing"`));
      continue;
    }
    const { text, line } = e.req;
    if (/^nothing\b/.test(text)) continue;
    const rest = text.replace(REQUIRE_RE, '').replace(/[\s,;.]+/g, '');
    if (rest) failures.push(fail('obligations', DECISIONS, line, `${e.id} "Requires:" has items not understood: ${rest.slice(0, 60)}`));
    for (const m of text.matchAll(REQUIRE_RE)) {
      const [, file, section, quote, id] = m;
      if (id) {
        if (!known.has(id)) failures.push(fail('obligations', DECISIONS, line, `${e.id} requires ${id}, which no module defines`));
        continue;
      }
      const abs = path.join(root, ...file.split('/'));
      if (!fs.existsSync(abs)) { failures.push(fail('obligations', DECISIONS, line, `${e.id} requires ${file}, which does not exist`)); continue; }
      const body = fs.readFileSync(abs, 'utf8').replace(/\r\n/g, '\n');
      if (section && !new RegExp(`^#{2,3} ${section.replace('.', '\\.')} · `, 'm').test(body)) failures.push(fail('obligations', DECISIONS, line, `${e.id} requires ${file} §${section}, which has no such section`));
      if (quote && !body.includes(quote)) failures.push(fail('obligations', DECISIONS, line, `${e.id} requires ${file} to say "${quote}", and it does not`));
    }
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
  // "Depends on" lives at the foot of the register, one subsection per
  // customer (FS-721): "### CU-01 · Name", then its capabilities by module.
  const text = read(root, CUSTOMERS);
  const foot = text.split(/^## What each customer depends on\s*$/m)[1] || '';
  const dependsOf = new Map();
  for (const block of foot.split(/^### /m).slice(1)) {
    const id = (block.match(/^(CU-\d{2})\b/) || [])[1];
    if (id) dependsOf.set(id, new Set(block.split('\n').slice(1).join('\n').match(ID_RE) || []));
  }
  text.split('\n').forEach((line, i) => {
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (!/^CU-\d{2}$/.test(cells[0] || '')) return;
    if (cells.length !== 10) { failures.push(fail('customers', CUSTOMERS, i + 1, `${cells[0]} has ${cells.length} cells; expected 10`)); return; }
    if (!dependsOf.has(cells[0])) { failures.push(fail('customers', CUSTOMERS, i + 1, `${cells[0]} has no "### ${cells[0]}" under "What each customer depends on"`)); return; }
    const depends = dependsOf.get(cells[0]);
    for (const id of depends) if (!known.has(id)) failures.push(fail('customers', CUSTOMERS, i + 1, `${cells[0]} depends on ${id}, which no module defines`));
    const link = cells[8].match(/\]\(([^)]+)\)/);
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
  rowIds(path.join('docs', 'documents.md'), /^\| (DT-\d{2}) \|/).forEach((id) => ids.add(id)); // FS-538
  // FS-873: a law may shape a partner decision, as the Advocates Act does SD-12.
  rowIds(path.join('docs', 'partners.md'), /^\| ((?:SD|PT)-\d{2}) \|/).forEach((id) => ids.add(id));
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

// ── references ───────────────────────────────────────────────────────────
// A capability id cited anywhere in docs/ exists in a module, so a plan, a
// register or a note cannot point at a row that was renumbered, moved or
// never written (FS-473). Prefixes are read from the modules themselves;
// "X-01 to X-05" ranges are expanded.
function checkReferences(root, files) {
  const live = new Set(moduleFiles(root).flatMap((f) => capabilityRows(read(root, f)).map((r) => r.id)));
  const prefixes = new Set([...live].map((id) => id.slice(0, 2)));
  const failures = [];
  // A module lists the ids it retired ("**Retired ids:** GW-09, moved to …");
  // history may cite them, but a retired id is never reused for a live row.
  const retired = new Set();
  for (const f of moduleFiles(root)) {
    read(root, f).split('\n').forEach((line, i) => {
      if (!line.startsWith('**Retired ids:**')) return;
      for (const id of line.slice(16).split(/[,;]/).map((s) => (s.trim().match(/^([A-Z]{2}-\d{2})\b/) || [])[1]).filter(Boolean)) {
        if (live.has(id)) failures.push(fail('references', f, i + 1, `${id} is retired but used again by a live row`));
        retired.add(id);
      }
    });
  }
  const known = new Set([...live, ...retired]);
  for (const file of files.filter((f) => f.split(path.sep)[0] === 'docs')) {
    read(root, file).split('\n').forEach((line, i) => {
      for (const m of line.matchAll(/\b([A-Z]{2})-(\d{2})(?: to (?:\1-)?(\d{2}))?\b/g)) {
        if (!prefixes.has(m[1])) continue;
        const a = +m[2]; const b = m[3] ? +m[3] : a;
        for (let n = a; n <= b; n++) {
          const id = `${m[1]}-${String(n).padStart(2, '0')}`;
          if (!known.has(id)) failures.push(fail('references', file, i + 1, `cites ${id}, which no module defines`));
        }
      }
    });
  }
  return failures;
}

// ── dependencies ─────────────────────────────────────────────────────────
// A module's depends_on and consumed_by agree with every other module's, both
// ways, and its §4 names each one (FS-478). A module used by every module
// says so in §4 ("every module") and lists none.
function checkDependencies(root) {
  const list = (t, k) => ((t.match(new RegExp(`^${k}:\\s*\\[([^\\]]*)\\]`, 'm')) || [])[1] || '')
    .split(',').map((s) => s.trim()).filter(Boolean);
  const mods = {};
  for (const file of moduleFiles(root)) {
    const t = read(root, file);
    const s4 = t.slice(t.indexOf('## 4 · '), t.indexOf('## 5 · '));
    mods[path.basename(file, '.md')] = {
      file, d: list(t, 'depends_on'), c: list(t, 'consumed_by'),
      dep: (s4.match(/\*\*Depends on:\*\*([\s\S]*?)\*\*Used by:\*\*/) || [])[1] || '',
      used: (s4.match(/\*\*Used by:\*\*([\s\S]*?)\n\n/) || [])[1] || '',
    };
  }
  const failures = [];
  for (const [a, m] of Object.entries(mods)) {
    for (const b of m.d) {
      if (!mods[b]) { failures.push(fail('dependencies', m.file, 1, `depends on ${b}, which is not a module`)); continue; }
      if (!mods[b].c.includes(a) && !/every module/.test(mods[b].used)) failures.push(fail('dependencies', mods[b].file, 1, `consumed_by lacks ${a}, which depends on it`));
      if (!m.dep.includes(b)) failures.push(fail('dependencies', m.file, 0, `§4 "Depends on" does not name ${b}`));
    }
    for (const b of m.c) {
      if (!mods[b]) { failures.push(fail('dependencies', m.file, 1, `consumed by ${b}, which is not a module`)); continue; }
      if (!mods[b].d.includes(a)) failures.push(fail('dependencies', mods[b].file, 1, `depends_on lacks ${a}, which lists it as a consumer`));
      if (!m.used.includes(b) && !/every module/.test(m.used)) failures.push(fail('dependencies', m.file, 0, `§4 "Used by" does not name ${b}`));
    }
  }
  return failures;
}

// ── scope ────────────────────────────────────────────────────────────────
// v1 is capped (FS-490): the number of phase-1 capabilities across the
// modules may not exceed the cap the delivery plan states. Raising it is a
// decision recorded on that line.
const DELIVERY = path.join('docs', 'delivery-plan.md');

function checkScope(root) {
  if (!fs.existsSync(path.join(root, DELIVERY))) return [fail('scope', DELIVERY, 0, 'delivery plan missing')];
  const text = read(root, DELIVERY);
  const m = text.match(/^\*\*v1 cap:\*\* (\d+) capabilities in phase 1 \((FS-\d{3})(?:, FS-\d{3})*\)\.$/m);
  if (!m) return [fail('scope', DELIVERY, 0, 'no "**v1 cap:** N capabilities in phase 1 (FS-xxx)." line')];
  const cap = +m[1];
  let n = 0;
  for (const file of moduleFiles(root)) {
    const t = read(root, file);
    let inSection = false;
    for (const line of t.split('\n')) {
      if (/^## /.test(line)) inSection = /^## 3 · /.test(line);
      if (!inSection) continue;
      const c = line.split('|').slice(1, -1).map((x) => x.trim());
      if (/^[A-Z]{2}-\d{2}$/.test(c[0] || '') && c[c.length - 1] === '1') n++;
    }
  }
  return n > cap ? [fail('scope', DELIVERY, 0, `phase 1 has ${n} capabilities; the v1 cap is ${cap}. Move something out, or raise the cap by decision`)] : [];
}

// ── journeys ─────────────────────────────────────────────────────────────
// A journey (FS-548) keeps the template's headings, has a release, cites
// the capabilities each step relies on and never types their status. A
// capability outside the journey's release is cited in §4 Gaps: for R1,
// one in "R1 in detail" and in phase 1; for R2 to R5, one in phase 1.
// Every journey is listed in the index with a link to its file, and §2
// opens with a flow diagram that shows every step and every §3 row.
const JOURNEYS = path.join('docs', 'journeys');
const RELEASES = ['R1', 'R2', 'R3', 'R4', 'R5', 'phase 2'];
// FS-668: draft, agreed by the owner, walked through with real users, tested.
const JOURNEY_STATUSES = ['draft', 'agreed', 'validated', 'tested'];

function capabilityInfo(root) {
  const info = new Map();
  for (const file of moduleFiles(root)) {
    let inSection = false;
    for (const line of read(root, file).split('\n')) {
      if (/^## /.test(line)) inSection = /^## 3 · /.test(line);
      if (!inSection) continue;
      const c = line.split('|').slice(1, -1).map((x) => x.trim());
      if (/^[A-Z]{2}-\d{2}$/.test(c[0] || '')) info.set(c[0], { status: c[2], phase: c[c.length - 1] });
    }
  }
  return info;
}

// Capability ids in a piece of text, "X-01 to X-05" ranges expanded.
function citedIds(text, prefixes) {
  const ids = [];
  for (const m of text.matchAll(/\b([A-Z]{2})-(\d{2})(?: to (?:\1-)?(\d{2}))?\b/g)) {
    if (!prefixes.has(m[1])) continue;
    for (let n = +m[2]; n <= (m[3] ? +m[3] : +m[2]); n++) ids.push(`${m[1]}-${String(n).padStart(2, '0')}`);
  }
  return ids;
}

function journeyFiles(root) {
  const dir = path.join(root, JOURNEYS);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'README.md' && !f.startsWith('_'))
    .map((f) => path.join(JOURNEYS, f));
}

function parseJourney(text, prefixes) {
  const front = (text.match(/^---\n([\s\S]*?)\n---\n/) || [])[1] || '';
  const j = {
    release: (front.match(/^release: *(.+)$/m) || [])[1],
    id: (front.match(/^name: *(JN-\d{2})\b/m) || [])[1],
    steps: [], gaps: '', diagram: null,
  };
  let section = null;
  let fence = null;
  text.split('\n').forEach((line, i) => {
    if (/^```/.test(line)) {
      if (fence === null) fence = line === '```' && section === 2 && j.diagram === null ? '' : false;
      else { if (fence !== false) j.diagram = fence; fence = null; }
      return;
    }
    if (fence !== null) { if (fence !== false) fence += `${line}\n`; return; }
    if (/^## /.test(line)) { section = +((line.match(/^## (\d+) · /) || [])[1] || 0); return; }
    if (section === 4) j.gaps += `${line}\n`;
    if (section !== 2 && section !== 3) return;
    const c = line.split('|').slice(1, -1).map((x) => x.trim());
    if (!/^(\d+|[a-z])$/.test(c[0] || '')) return;
    j.steps.push({ line: i + 1, section, step: c[0], text: c.slice(1).join(' '), last: c[c.length - 1], ids: citedIds(c[c.length - 1], prefixes) });
  });
  j.gapIds = new Set(citedIds(j.gaps, prefixes));
  return j;
}

function r1Scope(root) {
  const text = read(root, DELIVERY);
  const start = text.indexOf('## R1 in detail');
  if (start < 0) return '';
  const end = text.indexOf('\n## ', start + 1);
  return text.slice(start, end < 0 ? undefined : end);
}

function checkJourneys(root) {
  const files = journeyFiles(root);
  if (!files.length) return [];
  const info = capabilityInfo(root);
  const prefixes = new Set([...info.keys()].map((id) => id.slice(0, 2)));
  const r1 = new Set(citedIds(r1Scope(root), prefixes));
  const wantHeadings = headings(read(root, path.join(JOURNEYS, '_template.md')));
  const index = read(root, path.join(JOURNEYS, 'README.md'));
  const statusWord = new RegExp(`\\b(${STATUSES.join('|')})\\b`);
  const catalogue = path.join(root, 'docs', 'specs', 'messaging.md');
  const templates = new Set(fs.existsSync(catalogue)
    ? [...read(root, path.join('docs', 'specs', 'messaging.md')).matchAll(/^\| (T\d+) \|/gm)].map((m) => m[1]) : []);
  const failures = [];
  for (const file of files) {
    const text = read(root, file);
    const at = (line, m) => failures.push(fail('journeys', file, line, m));
    const j = parseJourney(text, prefixes);
    if (!RELEASES.includes(j.release)) at(1, `release "${j.release || ''}" outside ${RELEASES.join(', ')}`);
    if (!j.id) at(1, 'name does not start with a JN id');
    else if (!index.split('\n').some((l) => l.startsWith(`| ${j.id} |`) && l.includes(`](${path.basename(file)})`))) {
      at(1, `${j.id} is not listed in ${JOURNEYS.split(path.sep).join('/')}/README.md with a link to its file`);
    }
    const got = headings(text);
    for (let i = 0; i < Math.max(got.length, wantHeadings.length); i++) {
      if (got[i] !== wantHeadings[i]) { at(0, `heading ${i + 1} is "${got[i] || '(missing)'}"; template has "${wantHeadings[i] || '(none)'}"`); break; }
    }
    // The flow diagram (FS-558) names every step by number and every §3 row
    // as "(3x)"; it carries no capability ids, so the table stays their one place.
    if (j.diagram === null) at(0, '§2 has no flow diagram (a fence with no language, before the table)');
    // FS-668: a status, the evidence, a target, the moments, the data,
    // the messages each step sends, and what happens when someone stops.
    const front = (text.match(/^---\n([\s\S]*?)\n---\n/) || [])[1] || '';
    const jstatus = (front.match(/^status: *(\S+)/m) || [])[1];
    if (!JOURNEY_STATUSES.includes(jstatus)) at(1, `status "${jstatus || ''}" is not one of ${JOURNEY_STATUSES.join(', ')}`);
    if (!/^validated_with: *\S/m.test(front)) at(1, 'front matter missing "validated_with"');
    const s1 = (text.split(/^## 1 · .*$/m)[1] || '').split(/^## /m)[0];
    for (const k of ['Target', 'Moments that matter', 'Data']) if (!s1.includes(`- **${k}:**`)) at(0, `§1 has no "${k}" line`);
    const s2 = (text.split(/^## 2 · .*$/m)[1] || '').split(/^## /m)[0];
    if (!s2.includes('| # | Step | Who | Messages | Capabilities |')) at(0, '§2\'s table has no Messages column before Capabilities');
    for (const line of s2.split('\n').filter((l) => /^\| \d+ \|/.test(l))) {
      const c = line.split('|').slice(1, -1).map((x) => x.trim());
      const msg = c[c.length - 2] || '';
      if (msg !== '—') for (const tid of msg.split(/,\s*/)) if (!templates.has(tid)) at(0, `step ${c[0]} sends ${tid}, which the messaging catalogue does not have`);
    }
    if (!j.steps.some((s) => s.section === 3 && /stops partway|starts but does not finish/i.test(s.text))) at(0, '§3 has no "stops partway" row');
    for (const s of j.steps) {
      if (j.diagram === null) break;
      const shown = s.section === 2 ? new RegExp(`^\\s*${s.step}\\s`, 'm').test(j.diagram) : j.diagram.includes(`(3${s.step})`);
      if (!shown) at(s.line, `${s.section === 2 ? `step ${s.step}` : `§3 ${s.step}`} is not in the flow diagram${s.section === 3 ? ` as "(3${s.step})"` : ''}`);
    }
    for (const s of j.steps) {
      if (!s.ids.length && s.last !== '—') at(s.line, `step ${s.step} cites no capability; cite one, or "—" and name it in §4`);
      if (s.last === '—' && !new RegExp(`\\bstep ${s.step}\\b`).test(j.gaps)) at(s.line, `step ${s.step} is "—" but §4 does not name "step ${s.step}"`);
      if (statusWord.test(s.text)) at(s.line, `step ${s.step} types a status; statuses are computed from the modules`);
      for (const id of s.ids) {
        const cap = info.get(id);
        if (!cap || j.release === 'phase 2' || j.gapIds.has(id)) continue;
        const inRelease = cap.phase === '1' && (j.release !== 'R1' || r1.has(id));
        if (!inRelease) at(s.line, `step ${s.step} relies on ${id} (phase ${cap.phase}${j.release === 'R1' && !r1.has(id) ? ', not in R1' : ''}), outside ${j.release}, and §4 Gaps does not cite it`);
      }
    }
  }
  return failures;
}

// ── handbook ─────────────────────────────────────────────────────────────
// The handbook and the journeys stay in step (FS-771, FS-772). Each
// procedure ("## HB-01 · ...") has a unique id and a **From:** line naming
// the journey (JN-xx) or the spec section ("access-keycloak §6") it comes
// from, and that source exists. An HB id cited anywhere in docs/ exists.
// A journey past draft has at least one procedure that comes from it.
const HANDBOOK = path.join('docs', 'handbook');

function checkHandbook(root, files) {
  const dir = path.join(root, HANDBOOK);
  if (!fs.existsSync(dir)) return [];
  const failures = [];
  const journeys = new Map();
  for (const file of journeyFiles(root)) {
    const text = read(root, file);
    const id = (text.match(/^name: *(JN-\d{2})\b/m) || [])[1];
    if (id) journeys.set(id, { file, status: (text.match(/^status: *(\S+)/m) || [])[1] });
  }
  const specDir = path.join(root, SPECS);
  const specs = new Set(fs.existsSync(specDir) ? fs.readdirSync(specDir).filter((f) => f.endsWith('.md')).map((f) => f.slice(0, -3)) : []);
  const ids = new Set();
  const fromJourneys = new Set();
  for (const name of fs.readdirSync(dir).filter((f) => f.endsWith('.md') && !f.startsWith('_'))) {
    const file = path.join(HANDBOOK, name);
    let entry = null;
    const close = () => {
      if (entry && !entry.from) failures.push(fail('handbook', file, entry.line, `${entry.id} has no **From:** line naming its journey or spec`));
      entry = null;
    };
    read(root, file).split('\n').forEach((line, i) => {
      if (/^## /.test(line)) close();
      const h = line.match(/^## (HB-\d{2}) · /);
      if (h) {
        if (ids.has(h[1])) failures.push(fail('handbook', file, i + 1, `${h[1]} is used twice`));
        ids.add(h[1]);
        entry = { id: h[1], line: i + 1, from: false };
        return;
      }
      if (!entry || !/^\*\*From:\*\*/.test(line)) return;
      entry.from = true;
      const js = [...line.matchAll(/\bJN-\d{2}\b/g)].map((m) => m[0]);
      const sp = [...line.matchAll(/\b([a-z][a-z0-9-]+) §\d/g)].map((m) => m[1]).filter((s) => specs.has(s));
      for (const j of js) {
        if (journeys.has(j)) fromJourneys.add(j);
        else failures.push(fail('handbook', file, i + 1, `${entry.id} comes from ${j}, which is not a journey`));
      }
      if (!js.length && !sp.length) failures.push(fail('handbook', file, i + 1, `${entry.id}'s From line names no journey (JN-xx) or spec section (name §n)`));
    });
    close();
  }
  for (const file of files.filter((f) => f.endsWith('.md') && f.split(path.sep).join('/').startsWith('docs/'))) {
    read(root, file).split('\n').forEach((line, i) => {
      for (const m of line.matchAll(/\bHB-\d{2}\b/g)) {
        if (!ids.has(m[0])) failures.push(fail('handbook', file, i + 1, `${m[0]} is not in the handbook`));
      }
    });
  }
  for (const [id, j] of journeys) {
    if (JOURNEY_STATUSES.indexOf(j.status) > 0 && !fromJourneys.has(id)) failures.push(fail('handbook', j.file, 1, `${id} is ${j.status}, but no handbook procedure comes from it`));
  }
  return failures;
}

// ── overview ─────────────────────────────────────────────────────────────
// Every document under docs/ is reachable from the overview (FS-575): linked
// directly, or inside a folder the overview links ("journeys/" or
// "journeys/README.md"). Templates are copied, not read, and are exempt.
const OVERVIEW = path.join('docs', 'overview.md');

function checkOverview(root, files) {
  if (!fs.existsSync(path.join(root, OVERVIEW))) return [fail('overview', OVERVIEW, 0, 'overview missing')];
  const links = [...read(root, OVERVIEW).matchAll(/\]\(([^)\s#]+)(?:#[^)]*)?\)/g)]
    .filter((m) => !/^[a-z]+:/i.test(m[1]))
    .map((m) => path.posix.normalize(path.posix.join('docs', m[1])).replace(/\/?$/, m[1].endsWith('/') ? '/' : ''));
  const folders = links.filter((l) => l.endsWith('/') || l.endsWith('/README.md')).map((l) => (l.endsWith('/') ? l : `${path.posix.dirname(l)}/`));
  // A delivery map is reached through the customer register, which the
  // customers check holds to link every one (FS-720).
  if (links.includes('docs/customers.md') && fs.existsSync(path.join(root, CUSTOMERS))) {
    for (const m of read(root, CUSTOMERS).matchAll(/\]\((customers\/[^)\s#]+\.md)\)/g)) links.push(`docs/${m[1]}`);
  }
  return files
    .map((f) => f.split(path.sep).join('/'))
    .filter((f) => f.startsWith('docs/') && f.endsWith('.md') && f !== 'docs/overview.md' && !path.posix.basename(f).startsWith('_'))
    .filter((f) => !links.includes(f) && !folders.some((d) => f.startsWith(d)))
    .map((f) => fail('overview', OVERVIEW, 0, `${f} is not linked from the overview, directly or by its folder`));
}

// ── specs ────────────────────────────────────────────────────────────────
// Every spec follows docs/specs/_template.md (FS-627): its front matter; a
// first section ending in a "Where it sits" diagram and a Related line that
// links each module and spec the front matter names; relations agreed both
// ways; the closing sections its kind needs; a row in the index. Every box
// in its diagrams is named as the index's components table names it (FS-632).
const SPECS = path.join('docs', 'specs');
const SPEC_KEYS = ['id', 'name', 'kind', 'type', 'status', 'release', 'implements', 'depends_on', 'used_by', 'owner', 'classification', 'review_ids', 'last_reviewed'];
const SPEC_END = { build: 'Acceptance tests', component: 'Checks before the build' };
// FS-667: a lifecycle, and the sections every spec carries.
const SPEC_STATUSES = ['draft', 'agreed', 'building', 'built'];
const SPEC_SECTIONS = ['Data', 'Quality and metrics', 'Threats'];

function specFiles(root) {
  const dir = path.join(root, SPECS);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'README.md' && !f.startsWith('_'))
    .map((f) => path.join(SPECS, f));
}

function frontList(text, key) {
  const m = text.match(new RegExp(`^${key}: *\\[([^\\]]*)\\]`, 'm'));
  return m ? m[1].split(',').map((s) => s.trim()).filter(Boolean) : null;
}

// Fences with no language: the ASCII diagrams.
function plainFences(text) {
  const out = [];
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (!/^\s*```\s*$/.test(lines[i])) {
      if (/^\s*```/.test(lines[i])) for (i++; i < lines.length && !/^\s*```/.test(lines[i]); i++);
      continue;
    }
    const start = i + 1;
    const buf = [];
    for (i++; i < lines.length && !/^\s*```/.test(lines[i]); i++) buf.push(lines[i]);
    out.push({ start, text: buf.join('\n') });
  }
  return out;
}

// The first line inside each box drawn as +---+ over | ... |.
function boxNames(diagram) {
  const rows = diagram.split('\n');
  const out = [];
  rows.forEach((row, i) => {
    for (const m of row.matchAll(/\+-{3,}\+/g)) {
      const next = rows[i + 1] || '';
      const a = m.index;
      const b = m.index + m[0].length - 1;
      if (next[a] !== '|' || next[b] !== '|') continue;
      out.push({ row: i + 1, from: a + 1, to: b, name: next.slice(a + 1, b).trim() });
    }
  });
  return out;
}

function componentNames(root) {
  const p = path.join(root, SPECS, 'README.md');
  if (!fs.existsSync(p)) return new Set();
  const text = read(root, path.join(SPECS, 'README.md'));
  const section = (text.split(/^## Components$/m)[1] || '').split(/^## /m)[0];
  return new Set(section.split('\n').filter((l) => l.startsWith('|')).map((l) => l.split('|')[1].trim())
    .filter((c) => c && !/^-+$/.test(c) && c !== 'Name in diagrams'));
}

function checkSpecs(root) {
  const files = specFiles(root);
  if (!files.length) return [];
  const failures = [];
  const ids = new Set(files.map((f) => path.basename(f, '.md')));
  const index = fs.existsSync(path.join(root, SPECS, 'README.md')) ? read(root, path.join(SPECS, 'README.md')) : '';
  const names = componentNames(root);
  const info = capabilityInfo(root);
  const r1 = new Set(citedIds(r1Scope(root), new Set([...info.keys()].map((c) => c.slice(0, 2)))));
  const rel = new Map();
  for (const file of files) {
    const text = read(root, file);
    const at = (line, m) => failures.push(fail('specs', file, line, m));
    const id = path.basename(file, '.md');
    // A capability a spec counts in R1 is in the delivery plan's "R1 in
    // detail" (FS-674): the two drifted apart once, by 26 rows.
    let inTable = false;
    text.split('\n').forEach((l, i) => {
      if (/^\| Id \|.*\| In R1 \|\s*$/.test(l)) { inTable = true; return; }
      if (!l.startsWith('|')) { inTable = false; return; }
      if (!inTable) return;
      const c = l.split('|').map((s) => s.trim());
      const cap = c[1];
      if (info.has(cap) && /^yes/i.test(c[c.length - 2]) && !r1.has(cap)) {
        at(i + 1, `${cap} is "Yes" in R1 here, but the delivery plan's "R1 in detail" does not include it`);
      }
    });
    const keys = frontMatterKeys(text) || [];
    for (const k of SPEC_KEYS) if (!keys.includes(k)) at(1, `front matter missing "${k}"`);
    if ((text.match(/^id: *(\S+)/m) || [])[1] !== id) at(1, `id does not match file name "${id}"`);
    if (!/^kind: spec$/m.test(text)) at(1, 'kind is not "spec"');
    const type = (text.match(/^type: *(\S+)/m) || [])[1];
    if (!SPEC_END[type]) at(1, `type "${type || ''}" is neither build nor component`);
    const release = (text.match(/^release: *(.+)$/m) || [])[1];
    if (!RELEASES.includes((release || '').trim())) at(1, `release "${release || ''}" outside ${RELEASES.join(', ')}`);
    const impl = frontList(text, 'implements') || [];
    const deps = frontList(text, 'depends_on') || [];
    const used = frontList(text, 'used_by') || [];
    rel.set(id, { file, deps, used });
    if (!impl.length) at(1, 'implements no module');
    for (const m of impl) if (!fs.existsSync(path.join(root, 'docs', 'modules', `${m}.md`))) at(1, `implements "${m}", which is not a module`);
    for (const s of [...deps, ...used]) if (!ids.has(s)) at(1, `names spec "${s}", which does not exist; a spec still to write goes in the prose`);
    const got = headings(text);
    got.forEach((h, i) => { if (!h.startsWith(`${i + 1} · `)) at(0, `heading "${h}" is not numbered ${i + 1}`); });
    const n = got.length;
    if (got[0] !== '1 · Purpose and scope') at(0, `heading 1 is "${got[0] || '(missing)'}"; it must be "1 · Purpose and scope"`);
    if (SPEC_END[type] && got[n - 2] !== `${n - 1} · ${SPEC_END[type]}`) at(0, `the second-last heading must be "${n - 1} · ${SPEC_END[type]}" for a ${type} spec`);
    if (got[n - 1] !== `${n} · Open questions`) at(0, `the last heading must be "${n} · Open questions"`);
    const status = (text.match(/^status: *(\S+)/m) || [])[1];
    if (!SPEC_STATUSES.includes(status)) at(1, `status "${status || ''}" is not one of ${SPEC_STATUSES.join(', ')}`);
    for (const s of SPEC_SECTIONS) if (!got.some((h) => h.replace(/^\d+ · /, '') === s)) at(0, `no "${s}" section`);
    // Every test has an id, so the code can be tagged with it (docs/testing.md).
    const testsBody = (text.split(new RegExp(`^## ${n - 1} · .*$`, 'm'))[1] || '').split(/^## /m)[0];
    const testIds = testsBody.split('\n').filter((l) => l.startsWith('|')).map((l) => l.split('|')[1].trim())
      .filter((c) => c && !/^-+$/.test(c) && c !== '#');
    if (!testIds.length) at(0, 'the tests section has no table of tests');
    for (const tid of testIds) if (!/^[A-Z]{1,2}\d{1,3}$/.test(tid)) at(0, `test "${tid}" has no id like A1 or K12`);
    if (new Set(testIds).size !== testIds.length) at(0, 'two tests share an id');
    const body = text.replace(/<!--[\s\S]*?-->/g, '');
    const first = (body.split(/^## 1 · .*$/m)[1] || '').split(/^## /m)[0];
    if (!plainFences(first).length) at(0, '§1 has no "Where it sits" diagram');
    const from = first.indexOf('**Related:**');
    const related = from < 0 ? '' : first.slice(from).split(/\n\s*\n/)[0];
    if (!related) at(0, '§1 has no "**Related:**" line');
    else {
      for (const m of impl) if (!related.includes(`](../modules/${m}.md)`)) at(0, `the Related line does not link the module ${m}`);
      for (const s of [...deps, ...used]) if (!related.includes(`](${s}.md)`)) at(0, `the Related line does not link the spec ${s}`);
    }
    if (!index.split('\n').some((l) => l.startsWith(`| [${id}](${id}.md) |`))) at(1, `${id} is not listed in docs/specs/README.md with a link`);
    for (const fence of plainFences(text)) {
      for (const box of boxNames(fence.text)) {
        if (!names.has(box.name)) at(fence.start + box.row + 1, `box "${box.name}" is not named in the components table of docs/specs/README.md`);
      }
    }
  }
  for (const [a, r] of rel) {
    for (const b of r.deps) if (rel.has(b) && !rel.get(b).used.includes(a)) failures.push(fail('specs', rel.get(b).file, 1, `used_by lacks ${a}, which depends on it`));
    for (const b of r.used) if (rel.has(b) && !rel.get(b).deps.includes(a)) failures.push(fail('specs', rel.get(b).file, 1, `depends_on lacks ${a}, which lists it as a user`));
  }
  return failures;
}

// ── links ────────────────────────────────────────────────────────────────
// Every relative Markdown link, and every docs/… path written in the text,
// leads to a file that exists, so a rename cannot strand a reader (FS-627);
// a link to a section names a heading that exists, by GitHub's anchor
// (FS-641). REVIEW.md is history and keeps the paths it was written with.
// ── products ─────────────────────────────────────────────────────────────
// FS-816, FS-817: a product version's draft is the data its questionnaires
// are built from and its answers read back into. Every item has an id, a
// source and an ask from the fixed list; every item asked about is a term
// of the vocabulary, so the questionnaire can say why it matters.
// FS-825: and their values, against the vocabulary's schema and the rules
// across terms, both written as the first files of lender rules' code
// repository (code/lender-rules/) until it exists; then read from it.
const SCHEMA = path.join('code', 'lender-rules', 'product-vocabulary.schema.json');
const RULES_FILE = path.join('code', 'lender-rules', 'rules.js');
function checkProducts(root) {
  const { parse, purposes, slug } = require('./products/draft');
  const { validate, subsetProblems } = require('./products/validate');
  const dir = path.join(root, 'docs', 'products');
  if (!fs.existsSync(dir)) return [];
  const lr = path.join('docs', 'specs', 'lender-rules.md');
  const why = purposes(read(root, lr));
  const out = [];
  let schema = null;
  try { schema = JSON.parse(read(root, SCHEMA)); } catch (e) { out.push(fail('products', SCHEMA, 0, `the vocabulary's schema cannot be read: ${e.message}`)); }
  const { apply } = require(path.join(root, RULES_FILE));
  if (schema) {
    for (const msg of subsetProblems(schema)) out.push(fail('products', SCHEMA, 0, msg));
    const terms = Object.keys(why).map(slug);
    const defined = Object.keys(schema.properties || {});
    for (const t of terms.filter((x) => !defined.includes(x))) out.push(fail('products', SCHEMA, 0, `"${t}" is a term of the vocabulary (lender-rules §2.4) with no definition here`));
    for (const t of defined.filter((x) => !terms.includes(x))) out.push(fail('products', SCHEMA, 0, `"${t}" is defined here but is not a term of the vocabulary (lender-rules §2.4)`));
  }
  for (const name of fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort()) {
    const rel = path.join('docs', 'products', name);
    const text = read(root, rel);
    if (!/^kind: product-version$/m.test(text)) continue;
    const d = parse(text);
    if (!d.items.length) out.push(fail('products', rel, 0, 'no items: tables headed | Id | Term/Rule/Setting | Value | Source | Ask |'));
    for (const msg of d.problems) out.push(fail('products', rel, Number((msg.match(/^line (\d+)/) || [])[1] || 0), msg));
    for (const msg of d.pending) out.push(fail('products', rel, 0, msg));
    const data = (d.typed && d.typed.data) || {};
    for (const key of Object.keys(data)) {
      if (!Object.keys(why).some((term) => slug(term) === key)) out.push(fail('products', rel, 0, `typed block, ${key}: not a term of the vocabulary (lender-rules §2.4)`));
    }
    for (const it of d.items) {
      if (it.ask && !why[it.name]) out.push(fail('products', rel, it.line + 1, `${it.id} "${it.name}" is asked about but is not a term of the vocabulary (lender-rules §2.4)`));
    }
    if (!schema) continue;
    // Every value against its term's schema: what we propose and the
    // options we offer may hold blanks; a settled value may not.
    const product = {};
    for (const [key, entry] of Object.entries(data)) {
      const sub = schema.properties && schema.properties[key];
      if (!sub || !entry || typeof entry !== 'object') continue;
      const at = (part) => `typed block, ${key}.${part}`;
      if (entry.proposed !== undefined) for (const e of validate(sub, entry.proposed, { root: schema, blanks: true })) out.push(fail('products', rel, 0, `${at('proposed')}: ${e}`));
      (Array.isArray(entry.options) ? entry.options : []).forEach((o, i) => {
        for (const e of validate(sub, o, { root: schema, blanks: true })) out.push(fail('products', rel, 0, `${at(`options[${i}]`)}: ${e}`));
      });
      if (entry.value !== undefined) for (const e of validate(sub, entry.value, { root: schema })) out.push(fail('products', rel, 0, `${at('value')}: ${e}`));
      const v = entry.value !== undefined ? entry.value : entry.proposed;
      if (v !== undefined) product[key] = v;
    }
    // The rules across terms, on the product as it stands, and with each
    // option we offer in its place: we never offer a choice a rule forbids.
    const broken = new Set(apply(product).map((r) => {
      out.push(fail('products', rel, 0, `rule ${r.id} (${r.source}): ${r.message}`));
      return r.id;
    }));
    for (const [key, entry] of Object.entries(data)) {
      if (!entry || entry.value !== undefined || !Array.isArray(entry.options)) continue;
      entry.options.forEach((o, i) => {
        for (const r of apply({ ...product, [key]: o })) {
          if (!broken.has(r.id)) out.push(fail('products', rel, 0, `typed block, ${key}.options[${i}] (${entry.item}): offering it breaks rule ${r.id} (${r.source}): ${r.message}`));
        }
      });
    }
  }
  return out;
}

// ── status ───────────────────────────────────────────────────────────────
// FS-838, FS-839: every document under docs/ has a status its kind's
// lifecycle allows. A version of the whole set is a snapshot; a document's
// status says where it stands in it, so drafts show in every version.
// `version:` stays only on documents that go outside on their own.
const LIFECYCLES = {
  living: ['register', 'index', 'overview', 'plan', 'delivery', 'product', 'shared-service', 'channel', 'checklist', 'guide', 'service', 'law'],
  agreed: ['architecture', 'policy', 'handbook', 'manual', 'partner-model', 'marketing'],
};
function statusesFor(kind) {
  if (kind === 'spec') return SPEC_STATUSES;
  if (kind === 'journey') return JOURNEY_STATUSES;
  if (kind === 'outreach') return ['draft', 'sent', 'answered', 'withdrawn'];
  if (kind === 'product-version') return ['draft', 'awaiting-approval', 'awaiting-cbk', 'active', 'retired'];
  if (LIFECYCLES.living.includes(kind)) return ['living'];
  if (LIFECYCLES.agreed.includes(kind)) return ['draft', 'agreed', 'superseded'];
  return null;
}
// FS-855: Start here's "Statuses you will meet" explains every status the
// checks allow, and no other, so the words and the rules never drift apart
// (as the words check holds the guide to dibon). Each set is a row of one
// table, its statuses in bold (FS-858); the two document lifecycles also
// list their kinds.
const START_HERE = path.join('docs', 'start-here.md');
function statusSets() {
  return {
    'Documents kept current': { statuses: ['living'], kinds: LIFECYCLES.living },
    'Documents that are agreed': { statuses: statusesFor(LIFECYCLES.agreed[0]), kinds: LIFECYCLES.agreed },
    'Outreach letters': { statuses: statusesFor('outreach') },
    'Product versions': { statuses: statusesFor('product-version') },
    Specs: { statuses: SPEC_STATUSES },
    Journeys: { statuses: JOURNEY_STATUSES },
    Capabilities: { statuses: STATUSES },
    'Register rows (REVIEW.md)': { statuses: REVIEW_STATUSES },
    'Documents held with a party (the document register)': { statuses: [...new Set(Object.values(DOC_STATUSES).flat())] },
    'Partner candidates (partners.md)': { statuses: STAGES },
    'Partner decisions (partners.md)': { statuses: DECISION_STATUSES },
    "A document's release line": { statuses: ['unreleased', 'YYYY.MM.DD'] },
  };
}
function checkStatusGlossary(root) {
  if (!fs.existsSync(path.join(root, START_HERE))) return [];
  const at = (msg) => fail('status', START_HERE, 0, msg);
  const text = read(root, START_HERE);
  const start = text.search(/^## Statuses you will meet$/m);
  if (start < 0) return [at('no "## Statuses you will meet": every status the checks allow is explained there')];
  const rest = text.slice(start);
  const end = rest.slice(3).search(/^## /m);
  const section = end < 0 ? rest : rest.slice(0, end + 3);
  // FS-858: one table, a row per set: what, its statuses in bold, then its
  // kinds ("Kinds: `a`, `b`.") and examples.
  const rows = new Map(section.split('\n').filter((l) => /^\| [^|-]/.test(l) && !/^\| What \|/.test(l)).map((l) => {
    const c = l.split('|').slice(1, -1).map((s) => s.trim());
    return [c[0], { statuses: c[1] || '', more: c[2] || '' }];
  }));
  const sets = statusSets();
  const out = [];
  for (const name of Object.keys(sets).filter((n) => !rows.has(n))) out.push(at(`no row "${name}" in "Statuses you will meet"`));
  for (const [name, row] of rows) {
    const set = sets[name];
    if (!set) { out.push(at(`the row "${name}" is not a set of statuses the checks know`)); continue; }
    const shown = [...row.statuses.matchAll(/\*\*([^*]+)\*\*/g)].map((m) => m[1]);
    for (const s of set.statuses.filter((x) => !shown.includes(x))) out.push(at(`${name}: the checks allow "${s}", which is not explained here`));
    for (const s of shown.filter((x) => !set.statuses.includes(x))) out.push(at(`${name}: "${s}" is explained here, but the checks do not allow it`));
    if (!set.kinds) continue;
    const listed = [...((row.more.match(/Kinds: (.*?)\.(?: |$)/) || [])[1] || '').matchAll(/`([a-z-]+)`/g)].map((m) => m[1]);
    for (const k of set.kinds.filter((x) => !listed.includes(x))) out.push(at(`${name}: the kind "${k}" is not listed`));
    for (const k of listed.filter((x) => !set.kinds.includes(x))) out.push(at(`${name}: "${k}" is listed, but is not a kind of this set`));
  }
  return out;
}

// FS-852: each document says the release its content was last released in,
// "released: 2026.10.15", a release in CHANGELOG.md; a document not yet in
// one says "unreleased", and so does every template (_*.md), so a copy
// starts that way. tools/cut.js moves the stamp; nobody types it.
function checkStatus(root, files) {
  const out = [];
  const log = fs.existsSync(path.join(root, 'CHANGELOG.md')) ? read(root, 'CHANGELOG.md') : '';
  const releases = new Set((log.match(/^## \d{4}\.\d{2}\.\d{2}(?:\.\d+)? · /gm) || []).map((h) => h.slice(3, -3)));
  for (const file of files.filter((f) => f.endsWith('.md') && f.split(path.sep)[0] === 'docs')) {
    const fm = read(root, file).match(/^---\n([\s\S]*?)\n---\n/);
    if (!fm) continue;
    const stamp = (fm[1].match(/^released: *(.*)$/m) || [])[1];
    if (stamp === undefined) out.push(fail('status', file, 1, 'no "released:" in the front matter: the release its content was last released in, or "unreleased"'));
    else if (path.basename(file).startsWith('_') ? stamp.trim() !== 'unreleased' : !(stamp.trim() === 'unreleased' || releases.has(stamp.trim()))) {
      out.push(fail('status', file, 1, path.basename(file).startsWith('_')
        ? `a template says "released: unreleased", so a copy starts that way; it says "${stamp}"`
        : `"released: ${stamp}" is not a release in CHANGELOG.md, nor "unreleased"`));
    }
    const kind = (fm[1].match(/^kind: *([a-z-]+)/m) || [])[1];
    const status = (fm[1].match(/^status: *([a-z-]+)/m) || [])[1];
    const allowed = statusesFor(kind);
    // Specs' and journeys' own checks hold their lifecycles; not twice.
    if (kind === 'spec' || kind === 'journey') { /* their checks */ } else if (!allowed) out.push(fail('status', file, 1, `kind "${kind || ''}" has no lifecycle`));
    else if (!allowed.includes(status)) out.push(fail('status', file, 1, `status "${status || ''}" is not one a ${kind} may have (${allowed.join(', ')})`));
    if (kind !== 'outreach' && /^version:/m.test(fm[1])) out.push(fail('status', file, 1, 'a version: field; only a document that goes outside on its own keeps one (the set\'s version is in CHANGELOG.md)'));
  }
  return out;
}

// ── versions ─────────────────────────────────────────────────────────────
// FS-837, FS-838: CHANGELOG.md and each customer's §8 hold versions, newest
// first, each with its status line; only the newest may still read "to
// stamp" (tools/cut.js stamps it). Each customer page follows
// docs/customers/_template.md's headings, and splits its open answers into
// Open and Answered.
// FS-845: a release is named by its date (2026.10.15, a patch .1) and says
// its kind. `stamped` false for the external release notes, which carry no
// internal status line.
const RELEASE_HEAD = /^(\d{4})\.(\d{2})\.(\d{2})(?:\.(\d+))? · (major|minor|patch)$/;
const releaseOrder = (a, b) => { for (let i = 0; i < 4; i++) if ((a[i] || 0) !== (b[i] || 0)) return (a[i] || 0) - (b[i] || 0); return 0; };
function changelogProblems(text, level, file, from = 0, stamped = true) {
  const out = [];
  const lines = text.split('\n');
  const heads = [];
  lines.forEach((l, i) => {
    if (i < from || !l.startsWith(`${level} `)) return;
    const m = l.slice(level.length + 1).match(RELEASE_HEAD);
    if (m) heads.push({ i, v: l.slice(level.length + 1).split(' · ')[0], parts: [+m[1], +m[2], +m[3], +(m[4] || 0)] });
    else if (/^#+ \d/.test(l)) out.push(fail('versions', file, i + 1, `"${l}" is not "${level} YYYY.MM.DD · major|minor|patch"`));
  });
  if (!heads.length) out.push(fail('versions', file, 0, 'no releases'));
  heads.forEach((h, k) => {
    const end = k + 1 < heads.length ? heads[k + 1].i : lines.length;
    const body = lines.slice(h.i + 1, end).join('\n');
    if (stamped && !/^\*\*Status:\*\* /m.test(body)) out.push(fail('versions', file, h.i + 1, `${h.v} has no **Status:** line`));
    // FS-861: a labelled line ("**Status:**", "**Exchanged:**") is a
    // paragraph of its own; GitHub folds it into a line or list above it.
    for (let k = h.i + 2; k < end; k++) {
      if (/^\*\*[A-Z][^*]*:\*\* /.test(lines[k]) && lines[k - 1].trim()) out.push(fail('versions', file, k + 1, `"${lines[k].slice(0, 24)}…" follows a line with no blank line between, so it joins that line or list: add one`));
    }
    if (stamped && /^\*\*Status:\*\* to stamp$/m.test(body) && k > 0) out.push(fail('versions', file, h.i + 1, `${h.v} still reads "to stamp", but a later release exists: release it (tools/cut.js)`));
    const [y, mo, d] = h.parts;
    const day = new Date(Date.UTC(y, mo - 1, d));
    if (day.getUTCMonth() !== mo - 1 || day.getUTCDate() !== d) out.push(fail('versions', file, h.i + 1, `${h.v} is not a date`));
    if (k > 0 && releaseOrder(heads[k - 1].parts, h.parts) <= 0) out.push(fail('versions', file, h.i + 1, `${h.v} is not older than the release above it`));
  });
  return out;
}
// FS-845: change notes, one per merge request, in changes/.
const NOTE_KINDS = ['major', 'minor', 'patch'];
function checkChanges(root) {
  const dir = path.join(root, 'changes');
  if (!fs.existsSync(dir)) return [];
  const out = [];
  const review = new Set(parseRegister(root).map((r) => r.id)); // FS-866: every register file
  const customers = fs.existsSync(path.join(root, 'docs', 'customers'))
    ? fs.readdirSync(path.join(root, 'docs', 'customers')).filter((f) => f.endsWith('.md') && !f.startsWith('_')).map((f) => f.slice(0, -3)) : [];
  for (const name of fs.readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'README.md')) {
    const rel = path.join('changes', name);
    const at = (msg) => out.push(fail('changes', rel, 1, msg));
    const text = read(root, rel);
    const fm = (text.match(/^---\n([\s\S]*?)\n---\n/) || [])[1];
    if (!/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+\.md$/.test(name)) at('name it <YYYY-MM-DD>-<a-few-words>.md');
    if (!fm) { at('no front matter (kind, for, rows, by)'); continue; }
    const get = (k) => (fm.match(new RegExp(`^${k}: *(.*)$`, 'm')) || [])[1];
    const kind = get('kind');
    const forWhom = get('for');
    const rows = (get('rows') || '').match(/FS-\d{3}/g) || [];
    const body = text.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
    if (!NOTE_KINDS.includes(kind)) at(`kind "${kind || ''}" is not ${NOTE_KINDS.join(', ')}`);
    if (!['team', 'everyone', ...customers].includes(forWhom)) at(`for "${forWhom || ''}" is not team, everyone or a customer's id (${customers.join(', ')})`);
    if (!rows.length) at('rows: the register rows it serves');
    for (const r of rows) if (!review.has(r)) at(`rows: ${r} is not in REVIEW.md`);
    if (!(get('by') || '').trim()) at('by: who made the change, by name and role');
    if (!body) at('no text');
    if (forWhom !== 'team' && /\b[A-Z]{2,3}-\d{2,3}\b/.test(body)) at('read outside Dibon, so no register ids in its text: they belong in rows');
  }
  return out;
}
function checkVersions(root) {
  const out = [];
  if (!fs.existsSync(path.join(root, 'CHANGELOG.md'))) out.push(fail('versions', 'CHANGELOG.md', 0, 'missing'));
  else {
    const log = read(root, 'CHANGELOG.md');
    out.push(...changelogProblems(log, '##', 'CHANGELOG.md'));
    // FS-842: README.md says which release a reader of it is reading.
    const newest = (log.match(/^## (\d{4}\.\d{2}\.\d{2}(?:\.\d+)?) · (major|minor|patch)$/m) || []).slice(1).join(' · ');
    const said = (read(root, 'README.md').match(/^\*\*Release:\*\* (\S+ · \S+)/m) || [])[1];
    if (said !== newest) out.push(fail('versions', 'README.md', 0, `its release line says "${said || '(none)'}"; CHANGELOG.md's newest is "${newest}"`));
    if (fs.existsSync(path.join(root, 'HANDOFF.md'))) {
      const described = (read(root, 'HANDOFF.md').match(/^ {4}release: (\S+ · \S+)$/m) || [])[1];
      if (described !== newest) out.push(fail('versions', 'HANDOFF.md', 3, `it describes release "${described || '(none)'}"; CHANGELOG.md's newest is "${newest}"`));
    }
  }
  const notes = path.join(root, 'docs', 'marketing', 'release-notes.md');
  if (fs.existsSync(notes)) out.push(...changelogProblems(read(root, path.join('docs', 'marketing', 'release-notes.md')), '##', path.join('docs', 'marketing', 'release-notes.md'), 0, false));
  const dir = path.join(root, 'docs', 'customers');
  if (!fs.existsSync(dir)) return out;
  const template = headings(read(root, path.join('docs', 'customers', '_template.md')));
  for (const name of fs.readdirSync(dir).filter((f) => f.endsWith('.md') && !f.startsWith('_'))) {
    const rel = path.join('docs', 'customers', name);
    const text = read(root, rel);
    const got = headings(text);
    for (let i = 0; i < Math.max(got.length, template.length); i++) {
      if (!(got[i] || '').startsWith(template[i] || '\0')) { out.push(fail('versions', rel, 0, `heading ${i + 1} is "${got[i] || '(missing)'}"; the customer template has "${template[i] || '(none)'}"`)); break; }
    }
    const s4 = text.slice(text.indexOf('\n## 4 · '), text.indexOf('\n## 5 · '));
    if (!/^### Open$/m.test(s4) || !/^### Answered$/m.test(s4)) out.push(fail('versions', rel, 0, '§4 must split its open answers into "### Open" and "### Answered"'));
    const s8 = text.indexOf('\n## 8 · ');
    if (s8 >= 0) out.push(...changelogProblems(text, '###', rel, text.slice(0, s8).split('\n').length));
  }
  return out;
}

// ── words ────────────────────────────────────────────────────────────────
// FS-847 to FS-849: the guide has a section for every word the tool knows,
// and no word the tool does not, so the two never drift apart.
// FS-865: the guide is ways-of-working's §7 to §10; the words are §8.
const GUIDE = path.join('docs', 'service-management', 'ways-of-working.md');
function checkWords(root) {
  const tool = path.join(__dirname, 'dibon.js'); // the words live beside the check
  if (!fs.existsSync(tool)) return [];
  if (!fs.existsSync(path.join(root, GUIDE))) return [fail('words', GUIDE, 0, 'missing: the guide to the team\'s words')];
  const { WORDS } = require(tool);
  const text = read(root, GUIDE);
  const section = (text.split(/^## (?:\d+ · )?The words$/m)[1] || '').split(/^## /m)[0];
  const headed = [...section.matchAll(/^### (\S+)$/gm)].map((m) => m[1]);
  const words = WORDS.map((w) => w[0]);
  const out = [];
  for (const w of words.filter((x) => !headed.includes(x))) out.push(fail('words', GUIDE, 0, `the tool knows "${w}", but "The words" has no section for it`));
  for (const w of headed.filter((x) => !words.includes(x))) out.push(fail('words', GUIDE, 0, `"${w}" has a section, but the tool has no such word`));
  return out;
}

// ── document register ────────────────────────────────────────────────────
// FS-835: every document held with a party, as metadata. Each row has a
// kind and a status that kind allows, a date, a location outside git, and a
// fingerprint where the document is an original or a record; every DR id
// cited anywhere in docs/ exists.
const DOC_REGISTER = path.join('docs', 'document-register.md');
const DOC_STATUSES = {
  Original: ['kept', 'to keep'],
  Record: ['kept', 'to keep'],
  Working: ['draft', 'shared', 'agreed', 'superseded', 'withdrawn', 'internal'],
};
function docRegisterIds(root) {
  if (!fs.existsSync(path.join(root, DOC_REGISTER))) return null;
  return new Set(read(root, DOC_REGISTER).split('\n').map((l) => (l.match(/^\| (DR-\d{3}) \|/) || [])[1]).filter(Boolean));
}
function checkDocRegister(root, files) {
  if (!fs.existsSync(path.join(root, DOC_REGISTER))) return [fail('docregister', DOC_REGISTER, 0, 'the document register is missing')];
  const out = [];
  const review = new Set(parseRegister(root).map((r) => r.id)); // FS-866: every register file
  // FS-857: read by its header (tools/docregister.js), which must be the
  // columns the tools know, in their order.
  const reg = require('./docregister'); // beside the check, as dibon.js is
  const parsed = reg.parse(read(root, DOC_REGISTER));
  const names = reg.COLUMNS.map(([, n]) => n);
  if (parsed.header.join('|') !== names.join('|')) out.push(fail('docregister', DOC_REGISTER, 0, `the table's columns are "${parsed.header.join(', ')}"; the tools expect "${names.join(', ')}"`));
  let expect = 1;
  for (const r of parsed.rows) {
    const at = (msg) => out.push(fail('docregister', DOC_REGISTER, r.line, `${r.id}: ${msg}`));
    if (r.cells.length !== names.length) { at(`${r.cells.length} cells, expected ${names.length}`); continue; }
    const { title, summary, kind, status, date, from, where, print, rows } = r;
    const n = +r.id.slice(3);
    if (n !== expect) at(`out of sequence; DR-${String(expect).padStart(3, '0')} expected`);
    expect = n + 1;
    if (!title || !from) at('a title and a "from" are required');
    if (!summary || summary === '—') at('a summary is required: what it is, and why we hold it, in one line');
    if (!DOC_STATUSES[kind]) at(`kind "${kind}" is not ${Object.keys(DOC_STATUSES).join(', ')}`);
    else if (!DOC_STATUSES[kind].includes(status)) at(`status "${status}" is not one a${kind === 'Original' ? 'n' : ''} ${kind} may have (${DOC_STATUSES[kind].join(', ')})`);
    if (!/^(?:file dated )?\d{4}-\d{2}-\d{2}$/.test(date)) at(`date "${date}" is not YYYY-MM-DD or "file dated YYYY-MM-DD"`);
    if (!/^`(?:clients|sources\/confidential)\/[^`]*`$/.test(where)) at('its place must be in clients/ or sources/confidential/, outside git');
    if (status === 'kept' && !/\/originals\/`$/.test(where)) at('kept, but not in a party\'s originals/');
    if (kind === 'Working' ? print !== '—' : !/^`[0-9a-f]{12}`$/.test(print)) at(kind === 'Working' ? 'a working document has no fingerprint' : 'an original or a record needs its fingerprint, twelve hex characters');
    const ids = rows.match(/FS-\d{3}/g) || [];
    if (!ids.length) at('no register row (FS id) behind it');
    for (const id of ids) if (!review.has(id)) at(`cites ${id}, which REVIEW.md does not have`);
  }
  // FS-857: each customer page's §6 holds its documents, generated from the
  // register; a stale or missing table fails, and says how to refresh it.
  const custDir = path.join(root, 'docs', 'customers');
  for (const name of fs.existsSync(custDir) ? fs.readdirSync(custDir).filter((f) => f.endsWith('.md')) : []) {
    const rel = path.join('docs', 'customers', name);
    const page = read(root, rel);
    const b = reg.block(page);
    if (!b) { out.push(fail('docregister', rel, 0, '§6 has no table of its documents generated from the register; add the line the customer template has there, then run node tools/docregister.js')); continue; }
    if (name.startsWith('_')) continue;
    if (b.text !== reg.table(read(root, DOC_REGISTER), reg.partyOf(page))) out.push(fail('docregister', rel, 0, 'its table of documents differs from the document register: run node tools/docregister.js'));
  }
  const known = docRegisterIds(root);
  for (const file of files.filter((f) => f.endsWith('.md') && f.split(path.sep)[0] === 'docs')) {
    read(root, file).split('\n').forEach((line, i) => {
      for (const m of line.matchAll(/\bDR-(\d{3})(?: to DR-(\d{3}))?\b/g)) {
        for (let n = +m[1]; n <= +(m[2] || m[1]); n++) {
          const id = `DR-${String(n).padStart(3, '0')}`;
          if (!known.has(id)) out.push(fail('docregister', file, i + 1, `cites ${id}, which the document register does not have`));
        }
      }
    });
  }
  return out;
}

function githubAnchor(heading) {
  return heading.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[`*]/g, '').trim().toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}\s_-]/gu, '').replace(/ /g, '-');
}

function anchorsOf(text) {
  return new Set(text.replace(/```[\s\S]*?```/g, '').split('\n').filter((l) => /^#{1,6} /.test(l)).map((l) => githubAnchor(l.replace(/^#+ /, ''))));
}

function checkLinks(root, files) {
  const failures = [];
  const md = files.filter((f) => f.endsWith('.md') && !path.basename(f).startsWith('_') && (f.split(path.sep)[0] === 'docs' || (!f.includes(path.sep) && f !== 'REVIEW.md')));
  const exists = (rel) => fs.existsSync(path.join(root, ...rel.split('/')));
  const paths = require('./paths'); // beside the check, as dibon.js is
  const pathIdx = paths.index(new Set(files.filter((f) => f.endsWith('.md')).map((f) => f.split(path.sep).join('/'))));
  const docDirs = new Set(fs.existsSync(path.join(root, 'docs')) ? fs.readdirSync(path.join(root, 'docs'), { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name) : []);
  for (const file of md) {
    const dir = path.posix.dirname(file.split(path.sep).join('/'));
    const own = read(root, file);
    own.split('\n').forEach((line, i) => {
      for (const m of line.matchAll(/\]\(#([^)\s]+)\)/g)) {
        if (!anchorsOf(own).has(m[1])) failures.push(fail('links', file, i + 1, `links to #${m[1]}, which is no heading here`));
      }
      for (const m of line.matchAll(/\]\(([^)\s#]+)(?:#([^)]*))?\)/g)) {
        if (/^[a-z]+:/i.test(m[1])) continue;
        const target = path.posix.normalize(path.posix.join(dir, m[1]));
        if (!exists(target)) { failures.push(fail('links', file, i + 1, `links to ${m[1]}, which does not exist`)); continue; }
        // A folder opens as a bare listing, or not at all: link its README (FS-719).
        if (fs.statSync(path.join(root, ...target.split('/'))).isDirectory()) {
          failures.push(fail('links', file, i + 1, `links to the folder ${m[1]}; link ${m[1].replace(/\/?$/, '/')}README.md instead, and give the folder one if it has none`));
          continue;
        }
        if (m[2] && target.endsWith('.md') && !anchorsOf(read(root, target)).has(m[2])) failures.push(fail('links', file, i + 1, `links to ${m[1]}#${m[2]}, which is no heading there`));
      }
      for (const m of line.matchAll(/(?<![\w./-])(docs\/[\w./-]*\.md)\b/g)) {
        if (!exists(m[1])) failures.push(fail('links', file, i + 1, `names ${m[1]}, which does not exist`));
      }
    });
    // FS-856: a path written as plain text resolves as the reader resolves
    // it (tools/paths.js). A relative path into a folder of docs/ names a
    // document that exists; a short name shared by several documents has
    // a folder before it on its line, or is written as a path.
    let fenced = false;
    own.split('\n').forEach((raw, i) => {
      if (/^\s*```/.test(raw)) { fenced = !fenced; return; }
      if (fenced) return;
      const line = raw.replace(/`[^`]*`/g, '').replace(/\]\([^)]*\)/g, ']()');
      let last = '';
      for (const m of paths.mentions(line)) {
        if (!m.name) { const r = paths.resolveFolder(root, file.split(path.sep).join('/'), m.folder); if (r && r.docs) last = r.docs; continue; }
        const got = paths.resolveFile(pathIdx, file.split(path.sep).join('/'), m.dir, m.name, last);
        if (got) { last = paths.folderOf(got); continue; }
        if (m.dir && !m.dir.startsWith('docs/') && docDirs.has(m.dir.split('/')[0])) failures.push(fail('links', file, i + 1, `names ${m.text}, which is no document`));
        else if (!m.dir && paths.ambiguous(pathIdx, file.split(path.sep).join('/'), m.name, last)) {
          failures.push(fail('links', file, i + 1, `${m.name} could be ${pathIdx.byName.get(m.name).join(' or ')}: write its path, or name its folder earlier on the line`));
        }
      }
    });
  }
  return failures;
}

// ── frontmatter ──────────────────────────────────────────────────────────
// Front matter must be valid YAML, or viewers that render it show no header
// (FS-654). Our own tools split on the first colon and forgive what YAML
// does not: an unquoted value holding ": " is the usual fault. A comment
// (" # ...") is valid and allowed.
function checkFrontMatter(root, files) {
  const failures = [];
  for (const file of files.filter((f) => f.endsWith('.md'))) {
    const m = read(root, file).match(/^---\n([\s\S]*?)\n---\n/);
    if (!m) continue;
    m[1].split('\n').forEach((line, i) => {
      const kv = line.match(/^([a-z_]+):(?: (.*))?$/);
      if (!kv) { if (line.trim() && !line.trim().startsWith('#')) failures.push(fail('frontmatter', file, i + 2, `"${line.slice(0, 40)}" is not a key and value`)); return; }
      const value = (kv[2] || '').replace(/\s+#.*$/, '');
      if (/^["']/.test(value)) return;
      if (/: /.test(value)) failures.push(fail('frontmatter', file, i + 2, `${kv[1]}'s value holds ": "; quote it or reword it, or YAML viewers show no header`));
    });
  }
  return failures;
}

// Each journey's capabilities by status, computed: never typed (FS-548).
function journeyCounts(root) {
  const info = capabilityInfo(root);
  const prefixes = new Set([...info.keys()].map((id) => id.slice(0, 2)));
  const out = {};
  for (const file of journeyFiles(root)) {
    const j = parseJourney(read(root, file), prefixes);
    const ids = [...new Set(j.steps.flatMap((s) => s.ids))];
    out[j.id || file] = { release: j.release, capabilities: ids.length, ...ids.reduce((m, id) => {
      const s = (info.get(id) || {}).status || 'missing';
      m[s] = (m[s] || 0) + 1;
      return m;
    }, {}) };
  }
  return out;
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
  return require('child_process').execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 512 * 1024 * 1024 });
}

function checkReviewed(root, files) {
  try { if (git(root, ['rev-parse', '--show-toplevel']).trim().replace(/\\/g, '/').toLowerCase() !== path.resolve(root).replace(/\\/g, '/').toLowerCase()) return []; } catch { return []; }
  const docs = files.filter((f) => f.split(path.sep)[0] === 'docs' && f.endsWith('.md'));
  // The date of each file's latest change of substance: a change only to
  // its status, version, last_reviewed or released line is metadata, not
  // content, and asks for no review (FS-838, FS-852).
  const changed = new Map();
  const META = /^[+-](?:status|version|last_reviewed|released):/;
  const scan = (out, dateOf) => {
    let date = null;
    let file = null;
    for (const line of out.split('\n')) {
      if (line.startsWith('\0')) { date = line.slice(1); continue; }
      const d = line.match(/^diff --git a\/.* b\/(.*)$/);
      if (d) { file = d[1].replace(/^"|"$/g, ''); continue; }
      if (!file || changed.has(file) || /^(\+\+\+|---) /.test(line)) continue;
      if (/^[+-]/.test(line) && !META.test(line)) changed.set(file, dateOf(date));
    }
  };
  const today = localDate();
  // Uncommitted first (they are the latest), then history, newest first.
  scan(git(root, ['diff', 'HEAD', '--unified=0', '--no-color', '--', 'docs']), () => today);
  for (const line of git(root, ['status', '--porcelain', '--untracked-files=all', '--', 'docs']).split('\n')) {
    if (line.startsWith('??')) changed.set(line.slice(3).replace(/^"|"$/g, ''), today);
  }
  scan(git(root, ['log', '--format=%x00%cs', '-p', '--unified=0', '--no-color', '--', 'docs']), (d) => d);
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
    register: { rows: rows.length, byStatus: tally(rows.map((r) => r.status)), openByCriticality: tally(rows.filter((r) => r.status === 'OPEN').map((r) => r.criticality)), byRaiser: tally(rows.map((r) => r.raisedBy)) },
    modules,
    journeys: journeyCounts(root),
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
    ...checkMarkup(root, files),
    ...checkCitations(root),
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
    ...checkObligations(root),
    ...checkCustomers(root),
    ...checkRegulation(root, files),
    ...checkAssurance(root),
    ...checkReferences(root, files),
    ...checkDependencies(root),
    ...checkScope(root),
    ...checkJourneys(root),
    ...checkHandbook(root, files),
    ...checkOverview(root, files),
    ...checkSpecs(root),
    ...checkProducts(root),
    ...checkDocRegister(root, files),
    ...checkStatus(root, files),
    ...checkStatusGlossary(root),
    ...checkVersions(root),
    ...checkChanges(root),
    ...checkWords(root),
    ...checkLinks(root, files),
    ...checkFrontMatter(root, files),
    ...checkReviewed(root, files),
  ];
}

module.exports = { runAll, counts, moduleFiles, boxNames, plainFences, componentNames, githubAnchor };

if (require.main === module) {
  const args = process.argv.slice(2);
  const root = path.resolve(args.find((a) => !a.startsWith('--')) || path.join(__dirname, '..'));
  const failures = runAll(root);
  for (const f of failures) console.log(`FAIL ${f.check}  ${f.file}${f.line ? `:${f.line}` : ''}  ${f.message}`);
  if (args.includes('--counts')) console.log(JSON.stringify(counts(root), null, 2));
  console.log(failures.length ? `${failures.length} failure(s)` : 'all checks pass');
  process.exit(failures.length ? 1 : 0);
}
