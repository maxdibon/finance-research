#!/usr/bin/env node
// Cuts a version (FS-838, FS-839; rules, Dibon 12): stamps the status of
// its changelog entry, then says how to tag it. The entry's prose
// (Decided, Changed, Exchanged) is written by hand first, under its
// heading, with the line "**Status:** to stamp".
//
//   node tools/cut.js docs <version>            # CHANGELOG.md
//   node tools/cut.js <customer-id> <version>   # docs/customers/<id>.md, §8
//
// For the documentation: each document's status counted by kind, and what
// changed status since the last version's tag (docs-<version>). For a
// customer: its documents in the register by kind and status, its open
// answers, and what changed since its last tag (<customer-id>-<version>).
// It never commits or tags: it prints the commands.

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const git = (args) => execFileSync('git', ['-C', ROOT, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 256 * 1024 * 1024 });
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
const norm = (s) => s.replace(/\r\n/g, '\n');
const STAMP = '**Status:** to stamp';

const byVersion = (a, b) => { const [x, y] = [a, b].map((v) => v.split('.').map(Number)); return x[0] - y[0] || x[1] - y[1]; };
function previousTag(series, version) {
  const tags = git(['tag', '--list', `${series}-*`]).split('\n').filter(Boolean)
    .map((t) => t.slice(series.length + 1)).filter((v) => /^\d+\.\d+$/.test(v) && byVersion(v, version) < 0).sort(byVersion);
  return tags.length ? `${series}-${tags[tags.length - 1]}` : null;
}
const front = (text) => (norm(text).match(/^---\n([\s\S]*?)\n---\n/) || [])[1] || '';
const field = (fm, k) => (fm.match(new RegExp(`^${k}: *([^\\s#]+)`, 'm')) || [])[1];

function docStatuses(read, list) {
  const out = new Map();
  for (const f of list) {
    const fm = front(read(f));
    if (!fm || path.basename(f).startsWith('_')) continue;
    out.set(f, { kind: field(fm, 'kind'), status: field(fm, 'status') });
  }
  return out;
}

function stampDocs(version) {
  const files = git(['ls-files', '--cached', '--others', '--exclude-standard', 'docs']).split('\n').filter((f) => f.endsWith('.md'));
  const now = docStatuses((f) => fs.readFileSync(path.join(ROOT, f), 'utf8'), files);
  const groups = {};
  for (const { kind, status } of now.values()) {
    const g = kind === 'spec' ? 'specs' : kind === 'journey' ? 'journeys' : kind === 'outreach' ? 'outreach' : status === 'living' ? 'living documents' : 'other documents';
    (groups[g] = groups[g] || {})[status] = ((groups[g] || {})[status] || 0) + 1;
  }
  const order = ['specs', 'journeys', 'other documents', 'outreach', 'living documents'];
  const counts = order.filter((g) => groups[g]).map((g) => `${g[0].toUpperCase()}${g.slice(1)}: ${Object.entries(groups[g]).map(([s, n]) => `${n} ${s}`).join(', ')}`).join('. ');
  const prev = previousTag('docs', version);
  let since;
  if (!prev) since = 'the first version, so nothing earlier to compare';
  else {
    const old = docStatuses((f) => git(['show', `${prev}:${f}`]), git(['ls-tree', '-r', '--name-only', prev, 'docs']).split('\n').filter((f) => f.endsWith('.md')));
    const moved = [...now].filter(([f, v]) => old.has(f) && old.get(f).status !== v.status).map(([f, v]) => `${f.replace(/^docs\//, '')} ${old.get(f).status} to ${v.status}`);
    const added = [...now.keys()].filter((f) => !old.has(f)).length;
    const removed = [...old.keys()].filter((f) => !now.has(f)).length;
    since = `since ${prev}: ${moved.length ? moved.join('; ') : 'no status changed'}; ${added} added, ${removed} removed`;
  }
  return `${counts}. Status changes ${since}.`;
}

function registerRows(text, party) {
  return norm(text).split('\n').map((l) => l.split('|').slice(1, -1).map((s) => s.trim()))
    .filter((c) => /^DR-\d{3}$/.test(c[0] || '') && c[1] === party)
    .map((c) => ({ id: c[0], kind: c[3], status: c[5] }));
}
const openAnswers = (text) => {
  const t = norm(text);
  const s4 = t.slice(t.indexOf('## 4 · '), t.indexOf('## 5 · '));
  const part = (h) => (s4.split(`### ${h}`)[1] || '').split('###')[0];
  const nums = (p) => (p.match(/^\| (\d+) \|/gm) || []).map((x) => x.replace(/\D/g, ''));
  return { open: nums(part('Open')), answered: nums(part('Answered')) };
};

function stampCustomer(id, version, page) {
  const party = (front(fs.readFileSync(page, 'utf8')).match(/^name: *(.+?) —/m) || [])[1];
  if (!party) throw new Error(`${rel(page)}: its name must read "<customer> — …"`);
  const register = path.join(ROOT, 'docs', 'document-register.md');
  const rows = registerRows(fs.readFileSync(register, 'utf8'), party);
  const tally = {};
  for (const r of rows) tally[`${r.kind.toLowerCase()} ${r.status}`] = (tally[`${r.kind.toLowerCase()} ${r.status}`] || 0) + 1;
  const docs = Object.entries(tally).map(([k, n]) => `${n} ${k}`).join(', ');
  const oa = openAnswers(fs.readFileSync(page, 'utf8'));
  const prev = previousTag(id, version);
  let since;
  if (!prev) since = 'the first version cut, so nothing earlier to compare';
  else {
    const oldRows = new Map(registerRows(git(['show', `${prev}:docs/document-register.md`]), party).map((r) => [r.id, r]));
    const added = rows.filter((r) => !oldRows.has(r.id)).map((r) => r.id);
    const moved = rows.filter((r) => oldRows.has(r.id) && oldRows.get(r.id).status !== r.status).map((r) => `${r.id} ${oldRows.get(r.id).status} to ${r.status}`);
    const oldOa = openAnswers(git(['show', `${prev}:${rel(page)}`]));
    const answered = oa.answered.filter((n) => !oldOa.answered.includes(n));
    since = `since ${prev}: documents added ${added.join(', ') || 'none'}; status changes ${moved.join('; ') || 'none'}; newly answered ${answered.join(', ') || 'none'}`;
  }
  return `documents ${rows.length} (${docs}); open answers ${oa.open.length} open, ${oa.answered.length} answered. Changes ${since}.`;
}

if (require.main === module) {
  const [series, version] = process.argv.slice(2);
  try {
    if (!series || !/^\d+\.\d+$/.test(version || '')) throw new Error('usage: node tools/cut.js docs|<customer-id> <major>.<minor>');
    const file = series === 'docs' ? path.join(ROOT, 'CHANGELOG.md') : path.join(ROOT, 'docs', 'customers', `${series}.md`);
    if (!fs.existsSync(file)) throw new Error(`no ${rel(file)}`);
    const raw = fs.readFileSync(file, 'utf8');
    const crlf = raw.includes('\r\n');
    const text = norm(raw);
    const level = series === 'docs' ? '##' : '###';
    const head = text.match(new RegExp(`^${level} ${version.replace('.', '\\.')} · \\d{4}-\\d{2}-\\d{2}$`, 'm'));
    if (!head) throw new Error(`${rel(file)} has no entry headed "${level} ${version} · <date>"; write it first`);
    const rest = text.slice(head.index + head[0].length);
    const next = rest.search(new RegExp(`^#{2,${level.length}} `, 'm'));
    const entry = next < 0 ? rest : rest.slice(0, next);
    if (!entry.includes(STAMP)) throw new Error(`the ${version} entry has no "${STAMP}" line: already cut?`);
    const stamp = series === 'docs' ? stampDocs(version) : stampCustomer(series, version, file);
    const out = text.slice(0, head.index + head[0].length) + entry.replace(STAMP, `**Status:** ${stamp}`) + (next < 0 ? '' : rest.slice(next));
    fs.writeFileSync(file, crlf ? out.replace(/\n/g, '\r\n') : out);
    console.log(`stamped ${rel(file)}, ${version}:\n  ${stamp}\nNext: commit, then  git tag ${series}-${version}  (tags reach GitHub with the push).`);
  } catch (e) { console.error(e.message); process.exit(1); }
}

module.exports = { stampDocs, stampCustomer, previousTag };
