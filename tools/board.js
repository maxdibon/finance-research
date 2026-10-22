#!/usr/bin/env node
// The board (FS-891): the register's open rows as cards in four columns,
// built from the register and the branches, so there is no second list
// to keep. The reader shows it as board.html.
//
//   To pick up  open, and no branch carries its id yet
//   Doing       open, and a branch carries it (started, joined)
//   In review   open, and that branch is shared for review
//   Done        closed in the last fourteen days
//
// A branch is any in this copy, mine or uploaded (origin/…), whose name
// carries the row's id. "Shared for review" is what dibon share and dibon
// download last heard from GitHub, kept in .git/dibon-reviews.json; with
// no such file, nothing is in review. Each card says who is on it (the
// row's With, lead first: FS-892) and since when.

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const DONE_DAYS = 14;
const DAY = 86400000;
const git = (root, a) => { const r = spawnSync('git', ['-C', root, ...a], { encoding: 'utf8' }); return r.status === 0 ? r.stdout.trim() : ''; };
const lastDate = (notes) => [...(notes || '').matchAll(/\*\*(\d{4}-\d{2}-\d{2}):\*\*/g)].map((m) => m[1]).sort().pop() || null;
const firstDate = (notes) => [...(notes || '').matchAll(/\*\*(\d{4}-\d{2}-\d{2}):\*\*/g)].map((m) => m[1]).sort()[0] || null;
const people = (w) => (w || '').split(/\s*,\s*/).filter((x) => x && x !== '—');

// FS id → the branches carrying it: { name, since (ms), who }.
function branches(root) {
  const base = git(root, ['rev-parse', '--verify', '--quiet', 'origin/main']) ? 'origin/main' : 'main';
  const refs = git(root, ['for-each-ref', 'refs/heads', 'refs/remotes/origin', '--format=%(refname:short)']).split('\n').filter(Boolean);
  const out = new Map();
  const seen = new Set();
  const here = git(root, ['rev-parse', '--abbrev-ref', 'HEAD']);
  for (const ref of refs) {
    const name = ref.replace(/^origin\//, '');
    if (['main', 'master', 'HEAD', 'origin'].includes(name) || seen.has(name)) continue;
    const ids = name.match(/FS-\d{3}/g);
    if (!ids) continue;
    // Its first save of its own. With none, it is only just started if I
    // am on it; otherwise it is merged, or was left: not on the board.
    const first = git(root, ['log', '--reverse', '--format=%ct|%an', `${base}..${ref}`]).split('\n').filter(Boolean)[0];
    if (!first && name !== here) continue;
    seen.add(name);
    const [ct, who] = first ? first.split('|') : [String(Date.now() / 1000), ''];
    for (const id of new Set(ids)) out.set(id, [...(out.get(id) || []), { name, since: +ct * 1000, who }]);
  }
  return out;
}

// Branch name → when its review opened, from the cache dibon keeps.
function reviews(root) {
  const p = path.join(root, '.git', 'dibon-reviews.json');
  try { return new Map(JSON.parse(fs.readFileSync(p, 'utf8')).filter((r) => !r.isDraft).map((r) => [r.headRefName, Date.parse(r.createdAt) || Date.now()])); } catch { return new Map(); }
}

function board(root, now = Date.now()) {
  const rows = require('./register').rows(root);
  const br = branches(root);
  const rv = reviews(root);
  const cols = { pick: [], doing: [], review: [], done: [] };
  for (const r of rows) {
    const card = { id: r.id, point: r.point, with: people(r.with), criticality: r.criticality, status: r.status };
    if (r.status !== 'OPEN') {
      const d = lastDate(r.notes);
      if (d && now - Date.parse(d) <= DONE_DAYS * DAY) cols.done.push({ ...card, since: Date.parse(d) });
      continue;
    }
    const mine = br.get(r.id) || [];
    const shared = mine.filter((b) => rv.has(b.name));
    if (shared.length) cols.review.push({ ...card, since: Math.min(...shared.map((b) => rv.get(b.name))), branches: shared.map((b) => b.name) });
    else if (mine.length) cols.doing.push({ ...card, since: Math.min(...mine.map((b) => b.since)), branches: mine.map((b) => b.name) });
    else cols.pick.push({ ...card, since: Date.parse(firstDate(r.notes) || '') || null });
  }
  const order = ['Critical', 'High', 'Medium', 'Low'];
  for (const k of ['pick', 'doing', 'review']) cols[k].sort((a, b) => order.indexOf(a.criticality) - order.indexOf(b.criticality) || a.id.localeCompare(b.id));
  cols.done.sort((a, b) => b.since - a.since);
  return cols;
}

// What dibon share and download hear from GitHub: the open reviews.
function remember(root) {
  const r = spawnSync('gh', ['pr', 'list', '--state', 'open', '--json', 'headRefName,isDraft,createdAt', '--limit', '200'], { cwd: root, encoding: 'utf8' });
  if (r.status !== 0) return false;
  fs.writeFileSync(path.join(root, '.git', 'dibon-reviews.json'), r.stdout);
  return true;
}

module.exports = { board, branches, reviews, remember, people, DONE_DAYS };

if (require.main === module) {
  const root = path.join(__dirname, '..');
  const cols = board(root);
  const names = { pick: 'To pick up', doing: 'Doing', review: 'In review', done: `Done (last ${DONE_DAYS} days)` };
  for (const [k, list] of Object.entries(cols)) console.log(`${names[k]}: ${list.length}${list.length ? ` (${list.slice(0, 8).map((c) => c.id).join(', ')}${list.length > 8 ? ', …' : ''})` : ''}`);
}
