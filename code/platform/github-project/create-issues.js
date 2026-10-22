#!/usr/bin/env node
// The MVP day's goals as GitHub issues on the board (FS-930), one per
// register row in goals.json (FS-938 to FS-951), each titled with its row,
// "blocked by" the goals it needs, labelled by workstream and critical
// path, and added to the project.
//
//   node create-issues.js --repo owner/name                   prints what it would do
//   node create-issues.js --repo owner/name --project 3 --owner login --apply
//
// It runs as whoever `gh` is signed in as: the issues are theirs, so the
// person who owns the board runs it, never Claude for them (FS-897).
// "Blocked by" uses GitHub's issue dependencies; where that call is refused,
// the script says which links to set by hand.

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const repo = opt('--repo');
const project = opt('--project');
const owner = opt('--owner');
const apply = args.includes('--apply');
if (!repo || !/^[\w.-]+\/[\w.-]+$/.test(repo)) { console.log('usage: node create-issues.js --repo owner/name [--project N --owner login] [--apply]'); process.exit(1); }

const goals = JSON.parse(fs.readFileSync(path.join(__dirname, 'goals.json'), 'utf8')).goals;
const gh = (a) => {
  if (!apply) { console.log(`  gh ${a.map((x) => (/\s/.test(x) ? JSON.stringify(x) : x)).join(' ')}`); return { ok: true, out: '' }; }
  const r = spawnSync('gh', a, { encoding: 'utf8' });
  return { ok: r.status === 0, out: (r.stdout || '').trim(), err: (r.stderr || '').trim() };
};

console.log(apply ? `Creating on ${repo}:` : `Dry run for ${repo} (add --apply to do it):`);

// Labels: the day, the critical path, each workstream.
const labels = [['mvp-day', '460d4d'], ['critical-path', 'fbb236'], ...[...new Set(goals.map((g) => g.workstream))].map((w) => [`ws:${w}`, 'ead9dc'])];
for (const [name, color] of labels) gh(['label', 'create', name, '--repo', repo, '--color', color, '--force']);

// The issues.
const made = new Map();
for (const g of goals) {
  const body = [
    `**Who:** ${g.who} · **Workstream:** ${g.workstream} · **Checkpoint:** ${g.checkpoint}${g.critical ? ' · **On the critical path**' : ''}`,
    '',
    `**Done when:** ${g.done}.`,
    '',
    g.needs.length ? `**Needs:** ${g.needs.join(', ')} (the register's rows; the issues are linked as "blocked by").` : '**Needs:** nothing first.',
    '',
    `The register's row is ${g.row}: its notes keep the record; this issue is the work in progress (FS-930).`,
  ].join('\n');
  const label = ['mvp-day', `ws:${g.workstream}`, ...(g.critical ? ['critical-path'] : [])].join(',');
  const r = gh(['issue', 'create', '--repo', repo, '--title', `${g.row}: ${g.title}`, '--body', body, '--label', label]);
  const url = apply ? r.out.split('\n').pop() : `(issue for ${g.row})`;
  if (apply && !r.ok) { console.log(`  ${g.row}: not created: ${r.err}`); continue; }
  const number = (url.match(/\/issues\/(\d+)$/) || [])[1];
  made.set(g.row, { url, number });
  if (apply) console.log(`  ${g.row}: ${url}`);
}

// "Blocked by", between the goals that are issues.
const byHand = [];
for (const g of goals) {
  const me = made.get(g.row);
  for (const n of g.needs) {
    const blocker = made.get(n);
    if (!blocker) { byHand.push(`${g.row} needs ${n}, which is not an issue here: say so on the issue`); continue; }
    if (!apply) { console.log(`  link: ${g.row} blocked by ${n}`); continue; }
    const id = gh(['api', `repos/${repo}/issues/${blocker.number}`, '--jq', '.id']);
    const r = id.ok ? gh(['api', '-X', 'POST', `repos/${repo}/issues/${me.number}/dependencies/blocked_by`, '-F', `issue_id=${id.out}`]) : id;
    if (!r.ok) byHand.push(`${g.row} (#${me.number}) blocked by ${n} (#${blocker.number})`);
  }
}

// Onto the board.
if (project && owner) for (const [row, m] of made) gh(['project', 'item-add', project, '--owner', owner, '--url', m.url]);
else console.log('No --project and --owner: add the issues to the board by hand, or run again with them.');

if (byHand.length) { console.log('Set by hand:'); for (const b of byHand) console.log(`  ${b}`); }
if (apply) {
  const out = path.join(__dirname, '..', '..', '..', 'build', 'mvp-issues.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(Object.fromEntries(made), null, 1));
  console.log(`The issues, by row: ${path.relative(process.cwd(), out)}`);
}
