// Breaks every check on purpose and confirms it fails by name (FS-074).
// A check that passes on correct data proves nothing.
//
//   node --test tools/check.test.js

'use strict';

const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const test = require('node:test');
const { runAll } = require('./check');

const ROOT = path.join(__dirname, '..');
const COPY = ['README.md', 'REVIEW.md', 'review', 'CHANGELOG.md', 'HANDOFF.md', 'docs', path.join('sources', 'kapu'), path.join('design', 'portfolio-pdf'), path.join('design', 'system'), 'code',
  path.join('sources', 'confidential', 'protected-names.txt')];

// A fresh copy of the checked files, perturbed by `edit`, then checked.
function runWith(edit) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-check-'));
  for (const rel of COPY) {
    fs.cpSync(path.join(ROOT, rel), path.join(dir, rel), { recursive: true });
  }
  edit(dir);
  const failures = runAll(dir);
  fs.rmSync(dir, { recursive: true, force: true });
  return failures;
}

function patch(dir, rel, fn) {
  const p = path.join(dir, rel);
  fs.writeFileSync(p, fn(fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n')));
}

function names(failures) {
  return [...new Set(failures.map((f) => f.check))].sort();
}

const COLLECT = path.join('docs', 'modules', 'collect.md');

test('the unperturbed copy passes', () => {
  assert.deepStrictEqual(runWith(() => {}), []);
});

// The test uses a made-up name added to the copied list. A real protected
// name here would put it in a tracked file, which is the thing being checked.
const SYNTHETIC = 'Quokka Savings';

test('names: a protected name in a document fails', () => {
  const f = runWith((d) => {
    patch(d, path.join('sources', 'confidential', 'protected-names.txt'), (t) => `${t}\n${SYNTHETIC}\n`);
    patch(d, 'README.md', (t) => `${t}\nPrepared for ${SYNTHETIC.toUpperCase()}.\n`);
  });
  assert.deepStrictEqual(names(f), ['names']);
});

test('names: a missing list fails rather than passing silently', () => {
  const f = runWith((d) => fs.rmSync(path.join(d, 'sources', 'confidential', 'protected-names.txt')));
  assert.deepStrictEqual(names(f), ['names']);
});

test('register: a row out of sequence fails', () => {
  const f = runWith((d) => patch(d, path.join('review', 'FS-001-099.md'), (t) => t.replace('| FS-002 |', '| FS-003 |')));
  assert.ok(names(f).includes('register'));
});

test('register: a row with an extra cell fails', () => {
  const f = runWith((d) => patch(d, path.join('review', 'FS-001-099.md'), (t) => t.replace(/^(\| FS-001 \|.*)$/m, '$1 extra |')));
  assert.deepStrictEqual(names(f), ['register']);
});

test('register: an unknown status fails', () => {
  // FS-002 has no decisions entry, so only the register check is involved.
  const f = runWith((d) => patch(d, path.join('review', 'FS-001-099.md'), (t) => t.replace(/^(\| FS-002 \|[^|]*\|[^|]*\|) DECIDED \|/m, '$1 DONE |')));
  assert.deepStrictEqual(names(f), ['register']);
});

test('register: an open row without a criticality fails', () => {
  const f = runWith((d) => patch(d, 'REVIEW.md', (t) => t.replace(/^(\| FS-012 \|[^|]*\|[^|]*\|) OPEN \| Low \|/m, '$1 OPEN | — |')));
  assert.deepStrictEqual(names(f), ['register']);
});

// FS-866: open rows in REVIEW.md, closed rows in review/, by the hundred.
test('register: a row closed but left in REVIEW.md fails, and tidy files it', () => {
  const close = (d) => patch(d, 'REVIEW.md', (t) => t.replace(/^(\| FS-012 \|[^|]*\|[^|]*\|) OPEN \| Low \|/m, '$1 DECIDED | — |'));
  assert.deepStrictEqual(names(runWith(close)), ['register']);
  const f = runWith((d) => {
    close(d);
    const moved = require('./register').tidy(d);
    assert.deepStrictEqual(moved, ['FS-012 to review/FS-001-099.md']);
  });
  assert.deepStrictEqual(f, []);
});

test('register: a row reopened in review/ fails, and tidy brings it back', () => {
  const reopen = (d) => patch(d, path.join('review', 'FS-001-099.md'), (t) => t.replace(/^(\| FS-002 \|[^|]*\|[^|]*\|) DECIDED \| — \| — \|/m, '$1 OPEN | Low | Eric |'));
  assert.deepStrictEqual(names(runWith(reopen)), ['register']);
  const f = runWith((d) => { reopen(d); require('./register').tidy(d); });
  assert.deepStrictEqual(f, []);
});

// FS-882: who has an open row, by a first name from the team.
test('register: an open row with no one on it fails', () => {
  // Whoever holds FS-012 today: the test must not depend on who it is.
  const f = runWith((d) => patch(d, 'REVIEW.md', (t) => t.replace(/^(\| FS-012 \|[^|]*\|[^|]*\| OPEN \| Low \|) [^|]+ \|/m, '$1 — |')));
  assert.deepStrictEqual(names(f), ['register']);
});

test('register: an open row with someone not on the team fails, and a teammate passes', () => {
  const give = (who) => (d) => patch(d, 'REVIEW.md', (t) => t.replace(/^(\| FS-012 \|[^|]*\|[^|]*\| OPEN \| Low \|) [^|]+ \|/m, `$1 ${who} |`));
  assert.deepStrictEqual(names(runWith(give('Somebody'))), ['register']);
  assert.deepStrictEqual(runWith(give('Betty')), []);
});

// FS-905: a name means one person, and so does a handle.
test('register: a name or a handle on the team twice fails', () => {
  const WOW = path.join('docs', 'service-management', 'ways-of-working.md');
  const add = (row) => (d) => patch(d, WOW, (t) => t.replace(/^(\| Cliff \|.*\|)$/m, `$1\n${row}`));
  assert.deepStrictEqual(names(runWith(add('| Cliff | cliff.k | DevOps | Engineer | — | To confirm |'))), ['register']);
  assert.deepStrictEqual(names(runWith(add('| Cliff K. | cliff | DevOps | Engineer | — | To confirm |'))), ['register']);
  assert.deepStrictEqual(runWith(add('| Cliff K. | cliff.k | DevOps | Engineer | — | To confirm |')), []);
});

test('register: the team is read by its header, so a column added moves nothing', () => {
  const team = require('./register').team(ROOT);
  assert.strictEqual(team.get('Betty').role, 'Project manager');
  assert.strictEqual(team.get('Betty').handle, 'betty');
  assert.strictEqual(team.get('Claude for Eric').team, 'Assistant');
});

test('register: an id missing from every file fails', () => {
  const f = runWith((d) => patch(d, path.join('review', 'FS-100-199.md'), (t) => t.replace(/^\| FS-150 \|.*\n/m, '')));
  assert.ok(names(f).includes('register'));
});

test('markup: a file over 200 KB, or a word in angle brackets, fails', () => {
  const big = runWith((d) => fs.appendFileSync(path.join(d, 'docs', 'testing.md'), `\n${'A long line of filler text for size. '.repeat(6000)}\n`));
  assert.deepStrictEqual(names(big), ['markup']);
  const tag = runWith((d) => patch(d, path.join('docs', 'testing.md'), (t) => `${t}\nCopy it to clients/<customer>/ first.\n`));
  assert.deepStrictEqual(names(tag), ['markup']);
  const coded = runWith((d) => patch(d, path.join('docs', 'testing.md'), (t) => `${t}\nCopy it to \`clients/<customer>/\` first.\n`));
  assert.deepStrictEqual(coded, []);
});

test('register: a closed row still rated fails', () => {
  const f = runWith((d) => patch(d, path.join('review', 'FS-001-099.md'), (t) => t.replace(/^(\| FS-001 \|[^|]*\|[^|]*\|) DECIDED \| — \|/m, '$1 DECIDED | High |')));
  assert.deepStrictEqual(names(f), ['register']);
});

test('register: a heading holding table cells fails', () => {
  const f = runWith((d) => patch(d, 'REVIEW.md', (t) => t.replace(/^(# .*)$/m, '$1 | DECIDED | a note |')));
  assert.deepStrictEqual(names(f), ['register']);
});

test('register: a row\'s marker written into the title fails (FS-866)', () => {
  const f = runWith((d) => patch(d, 'REVIEW.md', (t) => t.replace('# Financial Services — review register', '# Financial Services — review [decision] |register')));
  assert.deepStrictEqual(names(f), ['register']);
});

test('review-ids: citing an id the register does not have fails', () => {
  // Assembled at run time so this file does not itself cite a missing id.
  const missing = ['FS', '999'].join('-');
  const f = runWith((d) => patch(d, 'README.md', (t) => `${t}\nSee ${missing}.\n`));
  assert.deepStrictEqual(names(f), ['review-ids']);
});

test('template: a missing heading fails', () => {
  const f = runWith((d) => patch(d, COLLECT, (t) => t.replace('## 10 · What it does not do', '## 10 · Limits')));
  assert.deepStrictEqual(names(f), ['template']);
});

test('template: a missing front-matter field fails', () => {
  const f = runWith((d) => patch(d, COLLECT, (t) => t.replace(/^owner: .*\n/m, '')));
  assert.deepStrictEqual(names(f), ['template']);
});

test('template: an id that does not match the file name fails', () => {
  const f = runWith((d) => patch(d, COLLECT, (t) => t.replace(/^id: collect$/m, 'id: kapu-collect')));
  assert.deepStrictEqual(names(f), ['template']);
});

test('capabilities: a status outside the vocabulary fails', () => {
  // Replaces whatever status the row has, so the test survives status changes.
  const f = runWith((d) => patch(d, COLLECT, (t) => t.replace(/^(\| CO-01 \|[^|]*\|) \w+ \|/m, '$1 Ready |')));
  assert.deepStrictEqual(names(f), ['capabilities']);
});

test('capabilities: a row with no evidence fails', () => {
  const f = runWith((d) => patch(d, COLLECT, (t) => t.replace(/^(\| CO-01 \|[^|]*\|[^|]*\|)[^|]*\|/m, '$1  |')));
  assert.deepStrictEqual(names(f), ['capabilities']);
});

test('capabilities: a duplicated id fails', () => {
  const f = runWith((d) => patch(d, COLLECT, (t) => t.replace('| CO-04 |', '| CO-03 |')));
  assert.deepStrictEqual(names(f), ['capabilities', 'references']);
});

test('diagrams: a diagram line over 100 columns fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'architecture', 'README.md'),
    (t) => t.replace(' | FUNDS LEDGER     |', ` | FUNDS LEDGER     |${'-'.repeat(60)}`)));
  assert.deepStrictEqual(names(f), ['diagrams']);
});

test('diagrams: a long line in a fence with a language is not a diagram', () => {
  const f = runWith((d) => patch(d, 'README.md', (t) => `${t}\n\`\`\`bash\n${'x'.repeat(100)}\n\`\`\`\n`));
  assert.deepStrictEqual(f, []);
});

const PARTNERS = path.join('docs', 'partners.md');

test('partners: a stage outside the vocabulary fails', () => {
  const f = runWith((d) => patch(d, PARTNERS, (t) => t.replace(/(\| PT-07 \|(?:[^|]*\|){5}) Candidate \|/, '$1 Warm |')));
  assert.deepStrictEqual(names(f), ['partners']);
});

test('partners: a decision naming a candidate that does not exist fails', () => {
  const f = runWith((d) => patch(d, PARTNERS, (t) => t.replace('| SD-07 | Hosting partner | PT-01 |', '| SD-07 | Hosting partner | PT-99 |')));
  assert.deepStrictEqual(names(f), ['partners']);
});

test('partners: an undefined criterion fails', () => {
  const f = runWith((d) => patch(d, PARTNERS, (t) => t.replace('| PT-01 | C5 C11 |', '| PT-01 | C5 C42 |')));
  assert.deepStrictEqual(names(f), ['partners']);
});

test('partners: a candidate out of sequence fails', () => {
  const f = runWith((d) => patch(d, PARTNERS, (t) => t.replace('| PT-02 |', '| PT-03 |')));
  assert.ok(names(f).includes('partners'));
});

// ── assemble ─────────────────────────────────────────────────────────────
const { assemble } = require('./assemble');

function assembleWith(edit) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-assemble-'));
  for (const rel of COPY) fs.cpSync(path.join(ROOT, rel), path.join(dir, rel), { recursive: true });
  edit(dir);
  try {
    const { outFile } = assemble(dir);
    return { text: fs.readFileSync(outFile, 'utf8') };
  } catch (e) {
    return { error: e };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test('assemble: refuses to build from failing sources', () => {
  const missing = ['FS', '999'].join('-');
  const r = assembleWith((d) => patch(d, 'README.md', (t) => `${t}\nSee ${missing}.\n`));
  assert.ok(r.error && /checks failing/.test(r.error.message));
});

test('assemble: includes every module and a non-empty rules section', () => {
  const r = assembleWith(() => {});
  assert.ifError(r.error);
  for (const f of fs.readdirSync(path.join(ROOT, 'docs', 'modules')).filter((x) => !x.startsWith('_'))) {
    const title = fs.readFileSync(path.join(ROOT, 'docs', 'modules', f), 'utf8').match(/^# (.+)$/m)[1];
    assert.ok(r.text.includes(`## ${title}`), `missing ${title}`);
  }
  assert.match(r.text, /### How to work here\n\n1\. /);
});

test('assemble: a README without the rules section refuses rather than publishing nothing', () => {
  const r = assembleWith((d) => patch(d, 'README.md', (t) => t.replace('## How to work here', '## Working notes')));
  assert.ok(r.error && /How to work here/.test(r.error.message));
});

const PORTFOLIO = path.join('docs', 'marketing', 'portfolio.md');

test('public: a register id in a marketing document fails', () => {
  const missing = ['FS', '001'].join('-');
  // Inside a labelled field: the copy's strict format rejects unlabelled text.
  const f = runWith((d) => patch(d, PORTFOLIO, (t) => t.replace('**Kicker:** Financial services portfolio · 2026', `**Kicker:** Financial services portfolio · 2026, see ${missing}`)));
  assert.deepStrictEqual(names(f), ['public']);
});

test('public: a capability id in a marketing document fails', () => {
  const f = runWith((d) => patch(d, PORTFOLIO, (t) => t.replace('**Kicker:** Financial services portfolio · 2026', `**Kicker:** Financial services portfolio · 2026, as in ${['CO', '01'].join('-')}`)));
  assert.deepStrictEqual(names(f), ['public']);
});

// ── onboarding, claims, decisions (FS-353) ───────────────────────────────
const ONBOARDING = path.join('docs', 'onboarding.md');
const PAGES_REST = path.join('design', 'portfolio-pdf', 'pages-rest.js');
const CLAIMS = path.join('design', 'portfolio-pdf', 'claims.json');

test('onboarding: a product the portfolio sells with no checklist fails', () => {
  const f = runWith((d) => patch(d, ONBOARDING, (t) => t.replace(/^Module: \[escrow\].*\n/m, '')));
  assert.deepStrictEqual(names(f), ['onboarding']);
});

test('onboarding: a checklist linking a module that does not exist fails', () => {
  const f = runWith((d) => patch(d, ONBOARDING, (t) => t.replace('Module: [escrow](modules/escrow.md)', 'Module: [escrow](modules/escrow.md)\n\nModule: [lending](modules/lending.md)')));
  // The broken link also trips the links check (FS-627).
  assert.deepStrictEqual(names(f), ['links', 'onboarding']);
});

test('copy: a line with no label in the portfolio copy fails', () => {
  const f = runWith((d) => patch(d, PORTFOLIO, (t) => t.replace('## Cover\n', '## Cover\n\nA stray sentence.\n')));
  assert.deepStrictEqual(names(f), ['copy']);
});

test('claims: an integration shown as integrated with no claim fails', () => {
  const f = runWith((d) => patch(d, PORTFOLIO, (t) => t.replace('**Coming soon:** Bank APIs; MT940', '**Integrated:** Bank APIs\n**Coming soon:** MT940')));
  assert.deepStrictEqual(names(f), ['claims']);
});

test('claims: a live claim whose evidence is not live fails', () => {
  const f = runWith((d) => patch(d, CLAIMS, (t) => t.replace('"evidence": ["PT-31"]', '"evidence": ["PT-30"]')));
  assert.deepStrictEqual(names(f), ['claims']);
});

test('claims: a v1 claim that does not cite the owner\'s decision fails', () => {
  const f = runWith((d) => patch(d, CLAIMS, (t) => t.replace('{"claim": "T-Kash", "basis": "v1", "ref": "FS-263"', '{"claim": "T-Kash", "basis": "v1", "ref": ""')));
  assert.deepStrictEqual(names(f), ['claims']);
});

test('decisions: a row marked [decision] with no entry fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'decisions.md'), (t) => t.replace('## FS-230 · Superset for dashboards', '## Superset for dashboards')));
  assert.deepStrictEqual(names(f), ['decisions']);
});

test('decisions: an entry whose row is not marked fails', () => {
  const f = runWith((d) => patch(d, path.join('review', 'FS-200-299.md'), (t) => t.replace(/^(\| FS-230 \|.*?) \[decision\] \|$/m, '$1 |')));
  assert.deepStrictEqual(names(f), ['decisions']);
});

// The reviewed check reads git history, so these copies are repositories,
// committed on a fixed date that no document's last_reviewed predates.
function runInRepo(edit) {
  const { execFileSync } = require('child_process');
  return runWith((d) => {
    const env = { ...process.env, GIT_AUTHOR_DATE: '2026-10-01T12:00:00', GIT_COMMITTER_DATE: '2026-10-01T12:00:00' };
    const git = (...a) => execFileSync('git', ['-C', d, '-c', 'user.name=test', '-c', 'user.email=test@example.invalid', '-c', 'core.autocrlf=false', ...a], { env, stdio: 'ignore' });
    git('init', '-q');
    git('add', '-A');
    git('commit', '-q', '--no-verify', '-m', 'base');
    edit(d);
  });
}

test('reviewed: a committed copy passes', () => {
  assert.deepStrictEqual(runInRepo(() => {}), []);
});

test('reviewed: a document changed without its date fails', () => {
  // The date is set back explicitly, so the test does not depend on the
  // file's current last_reviewed being older than today.
  const f = runInRepo((d) => patch(d, path.join('docs', 'modules', 'crb.md'),
    (t) => `${t.replace(/^last_reviewed: .*$/m, 'last_reviewed: 2026-10-01')}\nA new line.\n`));
  assert.deepStrictEqual(names(f), ['reviewed']);
});

test('reviewed: the same change with today\'s date passes', () => {
  const p = (n) => String(n).padStart(2, '0');
  const now = new Date();
  const today = `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
  const f = runInRepo((d) => patch(d, path.join('docs', 'modules', 'crb.md'),
    (t) => `${t.replace(/^last_reviewed: .*$/m, `last_reviewed: ${today}`)}\nA new line.\n`));
  assert.deepStrictEqual(f, []);
});

test('reviewed: a change to the released line alone asks no review', () => {
  const f = runInRepo((d) => patch(d, path.join('docs', 'modules', 'crb.md'),
    (t) => t.replace(/^last_reviewed: .*$/m, 'last_reviewed: 2026-10-01').replace(/^released: .*$/m, 'released: unreleased')));
  assert.deepStrictEqual(f, []);
});

// FS-852: what the reader calls "changed since" is content, not the stamp.
test('release: a diff that moves only the released line is not a change', () => {
  const { execFileSync } = require('child_process');
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-release-'));
  const git = (...a) => execFileSync('git', ['-C', d, '-c', 'user.name=test', '-c', 'user.email=test@example.invalid', '-c', 'core.autocrlf=false', ...a], { encoding: 'utf8' });
  try {
    git('init', '-q');
    fs.writeFileSync(path.join(d, 'a.md'), '---\nstatus: draft\nreleased: unreleased\n---\n\n# A\n');
    fs.writeFileSync(path.join(d, 'b.md'), '---\nstatus: draft\nreleased: unreleased\n---\n\n# B\n');
    git('add', '-A');
    git('commit', '-q', '--no-verify', '-m', 'base');
    patch(d, 'a.md', (t) => t.replace('released: unreleased', 'released: 2026.10.15'));
    patch(d, 'b.md', (t) => `${t}More.\n`);
    fs.writeFileSync(path.join(d, 'c.md'), '# C\n');
    git('add', 'c.md');
    const changed = require('./release').changedSince((a) => git(...a), 'HEAD');
    assert.deepStrictEqual([...changed].sort(), ['b.md', 'c.md']);
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});

// FS-853: a document's history is its content's commits, by release.
test('release: a history lists content changes by release, and leaves out a moved stamp', () => {
  const { execFileSync } = require('child_process');
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-history-'));
  const git = (...a) => execFileSync('git', ['-C', d, '-c', 'user.name=test', '-c', 'user.email=test@example.invalid', '-c', 'core.autocrlf=false', ...a], { encoding: 'utf8' });
  try {
    git('init', '-q');
    fs.mkdirSync(path.join(d, 'docs'));
    fs.writeFileSync(path.join(d, 'docs', 'a.md'), '---\nstatus: draft\nreleased: unreleased\n---\n\n# A\n');
    git('add', '-A');
    git('commit', '-q', '--no-verify', '-m', 'FS-001: a written');
    git('tag', '-a', 'docs-2026.10.15', '-m', 'docs 2026.10.15');
    patch(d, path.join('docs', 'a.md'), (t) => t.replace('released: unreleased', 'released: 2026.10.15'));
    git('commit', '-q', '--no-verify', '-am', 'FS-002: a stamped');
    patch(d, path.join('docs', 'a.md'), (t) => `${t}More.\n`);
    git('commit', '-q', '--no-verify', '-am', 'FS-003: a extended');
    const list = require('./release').histories(d).get('docs/a.md');
    assert.deepStrictEqual(list.map((c) => [c.subject, c.release]), [['FS-003: a extended', null], ['FS-001: a written', '2026.10.15']]);
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});

test('reviewed: a document with no last_reviewed fails', () => {
  const f = runInRepo((d) => patch(d, path.join('docs', 'modules', 'crb.md'), (t) => t.replace(/^last_reviewed: .*\n/m, '')));
  assert.ok(names(f).includes('reviewed'));
});

test('names: a public-only name is allowed in an internal document', () => {
  const f = runWith((d) => {
    patch(d, path.join('sources', 'confidential', 'protected-names.txt'), (t) => `${t}\npublic: ${SYNTHETIC}\n`);
    patch(d, 'README.md', (t) => `${t}\nWorking with ${SYNTHETIC}.\n`);
  });
  assert.deepStrictEqual(f, []);
});

test('names: a public-only name in outward material fails', () => {
  const f = runWith((d) => {
    patch(d, path.join('sources', 'confidential', 'protected-names.txt'), (t) => `${t}\npublic: ${SYNTHETIC}\n`);
    patch(d, path.join('docs', 'outreach', 'portfolio-share.md'), (t) => `${t}\nAs used by ${SYNTHETIC}.\n`);
  });
  assert.deepStrictEqual(names(f), ['names']);
});

test('customers: a dependency no module defines fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'customers.md'), (t) => t.replace('| CO-01, CO-02,', '| CO-99, CO-02,')));
  assert.deepStrictEqual(names(f), ['customers', 'references']);
});

test('customers: a delivery map that drifts from the register fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'customers', 'roan-capital.md'), (t) => t.replace('| RC-13 | Maker-checker throughout: the decider is never the requester | MD-06 |', '| RC-13 | Maker-checker throughout: the decider is never the requester | MD-06, MD-11 |')));
  assert.deepStrictEqual(names(f), ['customers']);
});

const PRODUCT = path.join('docs', 'products', 'roan-capital-30-day-loan-v1.md');

test('products: an ask outside the fixed list fails', () => {
  const f = runWith((d) => patch(d, PRODUCT, (t) => t.replace('| The prototype (open answer 29) | Confirm |', '| The prototype (open answer 29) | Select |')));
  assert.deepStrictEqual(names(f), ['products']);
});

test('products: an item asked about that is not in the vocabulary fails', () => {
  const f = runWith((d) => patch(d, PRODUCT, (t) => t.replace('| A1 | Amount limits |', '| A1 | Loan size |')));
  assert.deepStrictEqual(names(f), ['products']);
});

test('products: an id out of sequence fails', () => {
  const f = runWith((d) => patch(d, PRODUCT, (t) => t.replace('| A2 | Term |', '| A3 | Term |')));
  assert.deepStrictEqual(names(f), ['products']);
});

test('products: a typed entry that is not a term of the vocabulary fails', () => {
  const f = runWith((d) => patch(d, PRODUCT, (t) => t.replace('"rate_type": {"item": "A14"', '"rate_kind": {"item": "A14"')));
  assert.deepStrictEqual(names(f), ['products']);
});

test('products: a Choose whose typed options do not match its options fails', () => {
  const f = runWith((d) => patch(d, PRODUCT, (t) => t.replace('"options": [{"payer": "borrower"}, {"payer": "institution"}]', '"options": [{"payer": "borrower"}]')));
  assert.deepStrictEqual(names(f), ['products']);
});

test('products: an item the institution settled with no typed value fails', () => {
  const f = runWith((d) => patch(d, PRODUCT, (t) => t.replace('| Rate type | Fixed | The prototype | Confirm |', '| Rate type | Fixed | Roan Capital, 2026-10-14 | — |')));
  assert.deepStrictEqual(names(f), ['products']);
});

const SCHEMA = path.join('code', 'lender-rules', 'product-vocabulary.schema.json');

test('products: a proposed value the schema does not allow fails', () => {
  const f = runWith((d) => patch(d, PRODUCT, (t) => t.replace('"proposed": {"type": "fixed"}', '"proposed": {"type": "floating"}')));
  assert.deepStrictEqual(names(f), ['products']);
});

test('products: a product that breaks a rule across terms fails', () => {
  const f = runWith((d) => patch(d, PRODUCT, (t) => t.replace('"proposed": {"min": 3000, "max": 100000, "currency": "KES"}', '"proposed": {"min": 300000, "max": 100000, "currency": "KES"}')));
  assert.ok(f.some((x) => x.check === 'products' && /amount-limits-in-order/.test(x.message)), JSON.stringify(f));
});

test('products: a vocabulary term the schema does not define fails', () => {
  const f = runWith((d) => patch(d, SCHEMA, (t) => t.replace('"bureau_reporting": {', '"bureau_reports": {')));
  assert.deepStrictEqual(names(f), ['products']);
});

test('products: a schema keyword outside the validator\'s subset fails', () => {
  const f = runWith((d) => patch(d, SCHEMA, (t) => t.replace('"uniqueItems": true, "items": {"enum": ["en", "sw"]}', '"uniqueItems": true, "maxItems": 2, "items": {"enum": ["en", "sw"]}')));
  assert.deepStrictEqual(names(f), ['products']);
});

test('products: offering an option that breaks a rule fails', () => {
  const f = runWith((d) => patch(d, PRODUCT, (t) => t.replace('"options": [{"days_past_due": 30}, {"days_past_due": null}]', '"options": [{"days_past_due": 30}, {"days_past_due": 45}]')));
  assert.ok(f.some((x) => x.check === 'products' && /default-period-within-reg-57/.test(x.message)), JSON.stringify(f));
});

test('products: every rule across terms behaves as its worked examples say', () => {
  const { RULES, apply } = require(path.join(ROOT, 'code', 'lender-rules', 'rules.js'));
  const examples = JSON.parse(fs.readFileSync(path.join(ROOT, 'code', 'lender-rules', 'rules.examples.json'), 'utf8'));
  for (const r of RULES) {
    const mine = examples.filter((e) => e.rule === r.id);
    assert.ok(mine.some((e) => e.breaks) && mine.some((e) => !e.breaks), `${r.id} needs an example that breaks it and one that does not`);
  }
  for (const e of examples) {
    const broke = apply(e.product).some((x) => x.id === e.rule);
    assert.strictEqual(broke, e.breaks, `${e.rule}: ${JSON.stringify(e.product)}`);
  }
});

test('status: a status its kind\'s lifecycle does not allow fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'regulation.md'), (t) => t.replace(/^status: living$/m, 'status: agreed')));
  assert.deepStrictEqual(names(f), ['status']);
});

test('status: a version field on a document that does not go outside fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'regulation.md'), (t) => t.replace(/^status: living$/m, 'status: living\nversion: 0.2.0')));
  assert.deepStrictEqual(names(f), ['status']);
});

// FS-856: paths written as plain text, as the reader and the links check
// resolve them.
test('paths: a short name after a path means the same folder; alone, the nearest', () => {
  const p = require('./paths');
  const idx = p.index(new Set(['README.md', 'docs/regulation.md', 'docs/privacy.md', 'docs/customers.md', 'docs/modules/collect.md', 'docs/modules/messaging.md', 'docs/specs/messaging.md', 'docs/specs/lender-rules.md', 'docs/journeys/README.md']));
  const walk = (file, text) => {
    let last = '';
    return p.mentions(text).filter((m) => m.name).map((m) => {
      const got = p.resolveFile(idx, file, m.dir, m.name, last);
      if (got) last = p.folderOf(got);
      return got;
    });
  };
  assert.deepStrictEqual(walk('docs/service-management/ways-of-working.md', 'docs/regulation.md, privacy.md, customers.md'), ['docs/regulation.md', 'docs/privacy.md', 'docs/customers.md']);
  assert.deepStrictEqual(walk('docs/overview.md', 'docs/modules/collect.md, messaging.md'), ['docs/modules/collect.md', 'docs/modules/messaging.md']);
  assert.deepStrictEqual(walk('docs/specs/lender-rules.md', 'messaging.md'), ['docs/specs/messaging.md']);
  assert.deepStrictEqual(walk('docs/overview.md', 'messaging.md'), [null]);
  assert.deepStrictEqual(walk('docs/start-here.md', 'README.md and journeys/README.md'), ['README.md', 'docs/journeys/README.md']);
});

test('links: a relative path into docs that names no document fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'overview.md'), (t) => `${t}\nSee modules/colect.md.\n`));
  assert.deepStrictEqual(names(f), ['links']);
});

test('links: a short name two documents share, with no folder before it, fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'overview.md'), (t) => `${t}\nSee messaging.md.\n`));
  assert.deepStrictEqual(names(f), ['links']);
});

test('links: the same short name after its folder on the line passes', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'overview.md'), (t) => `${t}\nSee docs/specs/lender-rules.md and messaging.md.\n`));
  assert.ok(!names(f).includes('links'));
});

// FS-868: citations of the law, placed, carded and summarised.
test('citations: each cite is placed with its instrument', () => {
  const { cites, show } = require('./citations');
  const placed = (text, law) => cites(text, law).map((c) => `${show(c)} ${c.law}`);
  assert.deepStrictEqual(placed('The cap (reg 29(3)); and regs 39(3), 42.', 'LR-03'), ['reg 29(3) LR-03', 'reg 39(3) LR-03', 'reg 42 LR-03']);
  assert.deepStrictEqual(placed('Seven years (POCAMLA s.46, LR-13; NPS Act s.26, LR-11).', 'LR-17'), ['s. 46 LR-13', 's. 26 LR-11']);
  assert.deepStrictEqual(placed('law register LR-03 reg 29 and LR-04 s.44A; split', 'LR-17'), ['reg 29 LR-03', 's. 44A LR-04']);
  assert.deepStrictEqual(placed('A credit policy (reg 28(1)(b), (c)); the regulations 2026.', 'LR-03'), ['reg 28(1)(b) LR-03', 'reg 28(1)(c) LR-03']);
});

// FS-870: names place cites as ids do, across a paragraph's lines.
test('citations: a law named in words places its cites, across lines', () => {
  const { cites, names, show } = require('./citations');
  const known = names(ROOT);
  const placed = (text, law) => cites(text, law, known).map((c) => `${show(c)} ${c.law}`);
  assert.deepStrictEqual(placed('Kept seven years (POCAML Regs reg 42(2); Kenya Information and Communications Act s.83H).', null), ['reg 42(2) LR-14', 's. 83H LR-21']);
  assert.deepStrictEqual(placed('Every company lodges them (Companies\n  Act s.93A), disclosed on a form (BO Regulations reg 14(1)(c)).', null), ['s. 93A LR-34', 'reg 14(1)(c) LR-35']);
  assert.deepStrictEqual(placed('The Data Protection Act (Cap. 411C), s.2 (profiling) and s.35.', 'LR-03'), ['s. 2 LR-17', 's. 35 LR-17']);
});

// FS-874: a "reg" is never an Act's, nor an "s." a set of Regulations'.
test('citations: a cite is placed only with a law of its kind', () => {
  const { cites, names, show } = require('./citations');
  const known = names(ROOT);
  const placed = (text) => cites(text, 'LR-03', known).map((c) => `${show(c)} ${c.law}`);
  assert.deepStrictEqual(placed('Consent under the Data Protection Act s.30; and no shaming (reg 30(1)(d)).'), ['s. 30 LR-17', 'reg 30(1)(d) LR-03']);
  assert.deepStrictEqual(placed('Excise Duty Act applies to fees; costs not disclosed are not recovered (reg 30(2)).'), ['reg 30(2) LR-03']);
});

// FS-900: a law's rules are cited "r.", the word "rule" alone being ours;
// spelled out for a reader outside Dibon.
test('citations: a statutory rule is cited as r., and spelled out', () => {
  const { cites, names, show, spell } = require('./citations');
  const known = names(ROOT);
  const placed = (text) => cites(text, 'LR-03', known).map((c) => `${show(c)} ${c.law} ${spell(c)}`);
  assert.deepStrictEqual(placed('Sold after notice (Auctioneers Rules r.12(1)(c), (f)); and reg 30(4).'),
    ['r. 12(1)(c) LR-43 rule 12(1)(c)', 'r. 12(1)(f) LR-43 rule 12(1)(f)', 'reg 30(4) LR-03 regulation 30(4)']);
  assert.deepStrictEqual(placed('The MPSR Act s.73(2) applies.'), ['s. 73(2) LR-23 section 73(2)']);
  assert.deepStrictEqual(placed('As FATF R.14 says; and handbook rule 4.'), []);
});

test('citations: a statutory rule cited as a reg fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'specs', 'lender-rules.md'), (t) => t.replace('Auctioneers Rules r.12(1)(c), (d)', 'Auctioneers Rules reg 12(1)(c), (d)')));
  assert.ok(names(f).includes('citations'));
});

test('citations: in a document citing many laws, a cite naming none fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'documents.md'), (t) => t.replace(/^(## [^\n]*\n)/m, '$1\nKept as reg 9 requires.\n')));
  assert.ok(names(f).includes('citations'));
});

test('citations: a cite with no row on its card fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'specs', 'lender-rules.md'), (t) => t.replace('## 1 · Purpose and scope\n', '## 1 · Purpose and scope\n\nAlso reg 61.\n')));
  assert.ok(names(f).includes('citations'));
});

test('citations: a cite of an instrument with no card fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'specs', 'lender-rules.md'), (t) => t.replace('## 1 · Purpose and scope\n', '## 1 · Purpose and scope\n\nAlso s. 12 (LR-14).\n')));
  assert.ok(names(f).includes('citations'));
});

test('citations: a card changed without refreshing fails, and refreshing mends it', () => {
  const change = (d) => patch(d, path.join('docs', 'law', 'LR-18.md'), (t) => t.replace('within seven days, in a common', 'within 7 days, in a common'));
  assert.deepStrictEqual(names(runWith(change)), ['citations']);
  const f = runWith((d) => { change(d); const c = require('./citations'); for (const doc of c.documents(d)) c.refresh(d, doc); });
  assert.deepStrictEqual(f, []);
});

test('citations: the section for a reader outside Dibon carries no register ids', () => {
  const s = require('./citations').section(ROOT, 'docs/privacy.md', { external: true });
  assert.ok(!/\bLR-\d{2}\b/.test(s) && /Kenya Law/.test(s));
  // FS-900: and spells each provision out.
  const rows = s.split('\n').filter((l) => /^\| (?:section|regulation|rule) \d/.test(l));
  assert.ok(rows.length > 0 && !s.split('\n').some((l) => /^\| (?:s\.|reg|r\.) \d/.test(l)));
});

// FS-855: Start here explains every status the checks allow, and no other.
const START = path.join('docs', 'start-here.md');
test('status: a status the checks allow, missing from Start here, fails', () => {
  const f = runWith((d) => patch(d, START, (t) => t.replace(/ · \*\*superseded\*\* \(replaced by a later document it names[^)]*\)/, '')));
  assert.deepStrictEqual(names(f), ['status']);
});

test('status: a status Start here explains but the checks do not allow fails', () => {
  const f = runWith((d) => patch(d, START, (t) => t.replace('**building**', '**paused** · **building**')));
  assert.deepStrictEqual(names(f), ['status']);
});

test('status: a kind missing from its lifecycle in Start here fails', () => {
  const f = runWith((d) => patch(d, START, (t) => t.replace('`checklist`, `guide`, ', '`checklist`, ')));
  assert.deepStrictEqual(names(f), ['status']);
});

// FS-852: each document says the release it was last released in.
test('status: a document with no released line fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'regulation.md'), (t) => t.replace(/^released: .*\n/m, '')));
  assert.deepStrictEqual(names(f), ['status']);
});

test('status: a released line naming no release in the changelog fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'regulation.md'), (t) => t.replace(/^released: .*$/m, 'released: 2026.10.14')));
  assert.deepStrictEqual(names(f), ['status']);
});

test('status: a document not yet released says so, and passes', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'regulation.md'), (t) => t.replace(/^released: .*$/m, 'released: unreleased')));
  assert.deepStrictEqual(f, []);
});

test('status: a template naming a release fails, so a copy never inherits one', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'customers', '_template.md'), (t) => t.replace(/^released: .*$/m, 'released: 2026.10.15')));
  assert.deepStrictEqual(names(f), ['status']);
});

test('versions: a customer page out of the template\'s order fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'customers', 'roan-capital.md'), (t) => t.replace('## 6 · Documents', '## 6 · Where the detail is')));
  assert.deepStrictEqual(names(f), ['versions']);
});

test('versions: an older entry still to stamp below a newer one fails', () => {
  // The real changelog, so every release a document names stays in it: a
  // newer entry above, and the newest real one set back to "to stamp".
  const f = runWith((d) => {
    patch(d, 'CHANGELOG.md', (t) => {
      const at = t.search(/^## \d{4}\./m);
      const head = t.slice(at).replace(/^\*\*Status:\*\* .*$/m, '**Status:** to stamp');
      return `${t.slice(0, at)}## 2026.10.20 · minor\n\n**Status:** to stamp\n\n${head}`;
    });
    patch(d, 'README.md', (t) => t.replace(/^\*\*Release:\*\* .*$/m, '**Release:** 2026.10.20 · minor'));
    patch(d, 'HANDOFF.md', (t) => t.replace(/^ {4}release: .*$/m, '    release: 2026.10.20 · minor'));
  });
  assert.deepStrictEqual(names(f), ['versions']);
});

test('versions: a status line straight after a release\'s bullets fails (FS-861)', () => {
  const f = runWith((d) => patch(d, 'CHANGELOG.md', (t) => t.replace(/\n\n(\*\*Status:\*\* )/, '\n$1')));
  assert.deepStrictEqual(names(f), ['versions']);
});

test('versions: a README whose release line disagrees with the changelog fails', () => {
  const f = runWith((d) => patch(d, 'README.md', (t) => t.replace(/^\*\*Release:\*\* .*$/m, '**Release:** 2026.10.14 · major')));
  assert.deepStrictEqual(names(f), ['versions']);
});

test('versions: a handover describing a release the changelog does not have fails', () => {
  const f = runWith((d) => patch(d, 'HANDOFF.md', (t) => t.replace(/^ {4}release: .*$/m, '    release: 2026.10.01 · minor')));
  assert.deepStrictEqual(names(f), ['versions']);
});

test('words: a word the tool knows with no section in the guide fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'service-management', 'ways-of-working.md'), (t) => t.replace('### discard\n', '### throw-away\n')));
  assert.deepStrictEqual(names(f), ['words']);
});

test('changes: a note read outside Dibon with a register id in its text fails', () => {
  const f = runWith((d) => {
    fs.mkdirSync(path.join(d, 'changes'), { recursive: true });
    fs.writeFileSync(path.join(d, 'changes', '2026-10-16-a-note.md'), '---\nkind: minor\nfor: roan-capital\nrows: [FS-845]\nby: Betty (Project manager)\n---\nOpen answer 24 settled (FS-845).\n');
  });
  assert.deepStrictEqual(names(f), ['changes']);
});

test('changes: a well-formed note for the team passes', () => {
  const f = runWith((d) => {
    fs.mkdirSync(path.join(d, 'changes'), { recursive: true });
    fs.writeFileSync(path.join(d, 'changes', '2026-10-16-a-note.md'), '---\nkind: minor\nfor: team\nrows: [FS-845]\nby: Betty (Project manager)\n---\nVersions are dated (FS-845).\n');
  });
  assert.deepStrictEqual(names(f), []);
});

const DOCREG = path.join('docs', 'document-register.md');

test('docregister: citing a DR id the register does not have fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'customers', 'roan-capital.md'), (t) => t.replace('- Capability statuses: the modules named in §2.', '- Capability statuses: the modules named in §2 (DR-999).')));
  assert.deepStrictEqual(names(f), ['docregister']);
});

test('docregister: a status its kind does not allow fails', () => {
  // Roan Capital's table follows the register, so it is refreshed too: only
  // the status rule is left to fail.
  const f = runWith((d) => {
    patch(d, DOCREG, (t) => t.replace(/^(\| DR-007 \|.*\| Original \| — \|) kept \|/m, '$1 draft |'));
    require('./docregister').refresh(d, 'roan-capital');
  });
  assert.deepStrictEqual(names(f), ['docregister']);
});

// FS-857: a summary for every document; each customer's table generated.
test('docregister: a document without a summary fails', () => {
  const f = runWith((d) => {
    patch(d, DOCREG, (t) => t.replace(/^(\| DR-004 \| [^|]+ \| [^|]+ \|) [^|]+ \|/m, '$1 — |'));
    require('./docregister').refresh(d, 'roan-capital');
  });
  assert.deepStrictEqual(names(f), ['docregister']);
});

test('docregister: a customer\'s table edited by hand, not from the register, fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'customers', 'roan-capital.md'), (t) => t.replace('| DR-003 | Non-disclosure agreement, executed', '| DR-003 | The NDA, executed')));
  assert.deepStrictEqual(names(f), ['docregister']);
});

test('docregister: refreshing after a register change makes the customer\'s table current again', () => {
  const f = runWith((d) => {
    patch(d, DOCREG, (t) => t.replace('| DR-004 | Roan Capital | Certificate of incorporation, certified copy |', '| DR-004 | Roan Capital | Certificate of incorporation (certified copy) |'));
    require('./docregister').refresh(d, 'roan-capital');
  });
  assert.deepStrictEqual(f, []);
});

test('docregister: an earlier release\'s register, without a summary column, reads by its header', () => {
  const old = '| Id | Party | Title | Kind | Version | Status | Date | From | Where | Fingerprint | Rows |\n|---|---|---|---|---|---|---|---|---|---|---|\n| DR-001 | Roan Capital | A title | Record | 1.0 | kept | 2026-08-20 | Dibon | `clients/x/originals/` | `1c108b8e1add` | FS-395 |\n';
  const r = require('./docregister').parse(old).rows[0];
  assert.deepStrictEqual([r.party, r.kind, r.status, r.print, r.summary], ['Roan Capital', 'Record', 'kept', '`1c108b8e1add`', undefined]);
});

test('originals: a kept file that is changed, made writable, or joined by an unrecorded one fails', () => {
  const { add, verify } = require(path.join(ROOT, 'tools', 'originals.js'));
  const party = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-originals-'));
  const src = path.join(party, 'form.docx');
  fs.writeFileSync(src, 'as received');
  add(party, src, { from: 'A partner', received: '2026-10-15' });
  assert.deepStrictEqual(verify(party).problems, []);
  const kept = path.join(party, 'originals', 'form.docx');
  fs.chmodSync(kept, 0o644);
  fs.writeFileSync(kept, 'edited');
  fs.writeFileSync(path.join(party, 'originals', 'stray.pdf'), 'x');
  const problems = verify(party).problems.join('\n');
  assert.match(problems, /form\.docx: changed since it was kept/);
  assert.match(problems, /form\.docx: not read-only/);
  assert.match(problems, /stray\.pdf: in originals\/ but not in the manifest/);
  fs.rmSync(party, { recursive: true, force: true });
});

const REG = path.join('docs', 'regulation.md');

test('regulation: a Deep law that drives nothing fails', () => {
  const f = runWith((d) => patch(d, REG, (t) => t.replace('| CR-01, CR-03, MF-19, MF-27 | Targeted |', '| — | Targeted |')));
  assert.deepStrictEqual(names(f), ['regulation']);
});

test('regulation: a law driving an id that does not exist fails', () => {
  const f = runWith((d) => patch(d, REG, (t) => t.replace('| CR-01, CR-03, MF-19, MF-27 |', '| CR-01, CR-03, MF-99, MF-27 |')));
  assert.deepStrictEqual(names(f), ['references', 'regulation']);
});

test('regulation: a version that disagrees with As at fails', () => {
  const f = runWith((d) => patch(d, REG, (t) => t.replace('/eng@2024-12-13) | 2024-12-13 |', '/eng@2024-12-13) | 2024-12-12 |')));
  assert.deepStrictEqual(names(f), ['regulation']);
});

test('regulation: citing a law the register does not have fails', () => {
  const f = runWith((d) => patch(d, COLLECT, (t) => `${t}\nSee the law register, LR-99.\n`));
  assert.deepStrictEqual(names(f), ['regulation']);
});

const ASR = path.join('docs', 'assurance.md');
// The row goes at the conflict register's end, before the generated
// "Regulations cited" (FS-870).
const engagement = (who, decision) => (t) => {
  const row = `| AS-01 | ${who} | Penetration test | Internet banking | Yes | ${decision} | 2026-10-05 | FS-440 |`;
  const at = t.indexOf('\n## Regulations cited\n');
  return at < 0 ? `${t.trimEnd()}\n${row}\n` : `${t.slice(0, at).trimEnd()}\n${row}\n${t.slice(at)}`;
};

test('assurance: an accepted engagement for a customer fails', () => {
  const f = runWith((d) => patch(d, ASR, engagement('KCB Bank Kenya', 'Accepted')));
  assert.deepStrictEqual(names(f), ['assurance']);
});

test('assurance: the same engagement declined for the conflict passes', () => {
  const f = runWith((d) => patch(d, ASR, engagement('KCB Bank Kenya', 'Declined (conflict)')));
  assert.deepStrictEqual(f, []);
});

test('assurance: a decision outside the vocabulary fails', () => {
  const f = runWith((d) => patch(d, ASR, engagement('A bank we do not supply', 'Maybe')));
  assert.deepStrictEqual(names(f), ['assurance']);
});

test('references: citing a capability no module defines fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'overview.md'), (t) => `${t}\nSee MF-98 to MF-99.\n`));
  assert.deepStrictEqual(names(f), ['references']);
});

test('references: a retired id used again by a live row fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'modules', 'gateway.md'), (t) => t.replace('**Retired ids:** GW-09,', '**Retired ids:** GW-01, GW-09,')));
  assert.deepStrictEqual(names(f), ['references']);
});

test('dependencies: a one-sided link fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'modules', 'crb.md'), (t) => t.replace(/^consumed_by: \[/m, 'consumed_by: [escrow, ')));
  assert.ok(names(f).includes('dependencies'));
});

test('dependencies: a dependency the §4 prose does not name fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'modules', 'sme-recon.md'), (t) => t.replace(' Also crb (individual lookups from the ERP).', '')));
  assert.deepStrictEqual(names(f), ['dependencies']);
});

test('scope: a capability moved into phase 1 past the cap fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'modules', 'insights.md'), (t) => t.replace(/^(\| IN-02 \|.*\| )2 \|$/m, '$11 |')));
  assert.deepStrictEqual(names(f), ['scope']);
});

const DECISIONS = path.join('docs', 'decisions.md');

test('obligations: a decision from FS-490 on without a Requires line fails', () => {
  const f = runWith((d) => patch(d, DECISIONS, (t) => t.replace(/^- \*\*Requires:\*\* docs\/delivery-plan\.md "v1 cap:"\.\n/m, '')));
  assert.deepStrictEqual(names(f), ['obligations']);
});

// FS-896: a superseded entry keeps its text and requires nothing more,
// but the entry that superseded it must exist.
test('obligations: a superseded entry requires nothing, and its successor must exist', () => {
  const D = path.join('docs', 'decisions.md');
  const gone = (d) => patch(d, D, (t) => t.replace('- **Superseded by:** FS-896:', '- **Superseded by:** FS-897:'));
  assert.deepStrictEqual(names(runWith(gone)), ['obligations']);
  const unmarked = (d) => patch(d, D, (t) => t.replace(/^- \*\*Superseded by:\*\* FS-896:.*\n/m, '- **Requires:** docs/specs/gitlab-was-here.md.\n'));
  assert.ok(names(runWith(unmarked)).includes('obligations'));
});

test('obligations: a required file that does not exist fails', () => {
  const f = runWith((d) => patch(d, DECISIONS, (t) => t.replace('docs/operating-model.md "Runbooks to write first"', 'docs/specs/recovery.md')));
  // The missing path also trips the links check (FS-627).
  assert.deepStrictEqual(names(f), ['links', 'obligations']);
});

test('obligations: required text the file no longer says fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'operating-model.md'), (t) => t.replace('**Runbooks to write first**', '**Runbooks**')));
  assert.deepStrictEqual(names(f), ['obligations']);
});

test('obligations: a required section the file does not have fails', () => {
  const f = runWith((d) => patch(d, DECISIONS, (t) => t.replace('docs/architecture/README.md §9 "an isolated', 'docs/architecture/README.md §19 "an isolated')));
  assert.deepStrictEqual(names(f), ['obligations']);
});

test('obligations: an item the check cannot read fails rather than passing', () => {
  const f = runWith((d) => patch(d, DECISIONS, (t) => t.replace('AC-14, AC-15, AC-16, SE-26;', 'AC-14, AC-15, AC-16, SE-26, the recovery screens;')));
  assert.deepStrictEqual(names(f), ['obligations']);
});

test('scope: moving one out keeps the count within the cap', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'modules', 'insights.md'), (t) => t.replace(/^(\| IN-02 \|.*\| )2 \|$/m, '$11 |').replace(/^(\| IN-15 \|.*\| )2 \|$/m, '$12 |').replace(/^(\| IN-01 \|.*\| )1 \|$/m, '$12 |')));
  assert.deepStrictEqual(f, []);
});

// ── journeys (FS-548) ────────────────────────────────────────────────────
const JOURNEY = path.join('docs', 'journeys', 'manual-identity-check.md');
const JOURNEY_INDEX = path.join('docs', 'journeys', 'README.md');
const STEP_1 = '| MF-01, KC-01, ID-02, MF-02 |';

test('journeys: a step relying on a phase-2 capability not in §4 Gaps fails', () => {
  const f = runWith((d) => patch(d, JOURNEY, (t) => t.replace(STEP_1, '| MF-01, KC-01, ID-02, MF-02, OC-08 |')));
  assert.deepStrictEqual(names(f), ['journeys']);
});

test('journeys: the same capability cited in §4 Gaps passes', () => {
  const f = runWith((d) => patch(d, JOURNEY, (t) => t.replace(STEP_1, '| MF-01, KC-01, ID-02, MF-02, OC-08 |')
    .replace('## 5 · Open questions', '| OC-08, applications by USSD | phase 2 | At the branch only | Accept |\n\n## 5 · Open questions')
    .replace(/\n\n(\| OC-08, applications)/, '\n$1')));
  assert.deepStrictEqual(f, []);
});

test('journeys: an R1 journey relying on a phase-1 capability outside R1 fails', () => {
  const f = runWith((d) => patch(d, JOURNEY, (t) => t.replace(STEP_1, '| MF-01, KC-01, ID-02, MF-02, ID-14 |')));
  assert.deepStrictEqual(names(f), ['journeys']);
});

test('journeys: a typed status fails', () => {
  const f = runWith((d) => patch(d, JOURNEY, (t) => t.replace('the product\'s document checklist appears', 'the product\'s document checklist appears (Planned)')));
  assert.deepStrictEqual(names(f), ['journeys']);
});

test('journeys: a step citing no capability fails', () => {
  const f = runWith((d) => patch(d, JOURNEY, (t) => t.replace(STEP_1, '| |')));
  assert.deepStrictEqual(names(f), ['journeys']);
});

test('journeys: a "—" step that §4 does not name fails', () => {
  const f = runWith((d) => patch(d, JOURNEY, (t) => t.replace(STEP_1, '| — |')));
  assert.deepStrictEqual(names(f), ['journeys']);
});

test('journeys: a release outside the list fails', () => {
  const f = runWith((d) => patch(d, JOURNEY, (t) => t.replace('release: R1', 'release: soon')));
  assert.deepStrictEqual(names(f), ['journeys']);
});

test('journeys: a journey missing from the index fails', () => {
  const f = runWith((d) => patch(d, JOURNEY_INDEX, (t) => t.replace(/^\| JN-02 \|.*\n/m, '')));
  assert.deepStrictEqual(names(f), ['journeys']);
});

const HB_PEOPLE = path.join('docs', 'handbook', 'people-and-access.md');

test('handbook: a procedure without a From line fails', () => {
  const f = runWith((d) => patch(d, HB_PEOPLE, (t) => t.replace('**From:** JN-18 (c).', '')));
  assert.deepStrictEqual(names(f), ['handbook']);
});

test('handbook: an HB id cited in docs that the handbook lacks fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'journeys', 'staff-access.md'), (t) => t.replace('(HB-20 to HB-27)', '(HB-20 to HB-29)')));
  assert.deepStrictEqual(names(f), ['handbook']);
});

test('handbook: a journey past draft with no procedure from it fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'journeys', 'electronic-identity-check.md'), (t) => t.replace(/^status: draft$/m, 'status: agreed')));
  assert.deepStrictEqual(names(f), ['handbook']);
});

test('journeys: a heading that differs from the template fails', () => {
  const f = runWith((d) => patch(d, JOURNEY, (t) => t.replace('## 4 · Gaps', '## 4 · Missing')));
  assert.deepStrictEqual(names(f), ['journeys']);
});

test('journeys: a journey with no flow diagram fails', () => {
  const f = runWith((d) => patch(d, JOURNEY, (t) => t.replace(/## 2 · Steps\n\n```\n[\s\S]*?```\n/, '## 2 · Steps\n\n')));
  assert.deepStrictEqual(names(f), ['journeys']);
});

test('journeys: a step missing from the flow diagram fails', () => {
  const f = runWith((d) => patch(d, JOURNEY, (t) => t.replace('  8 Chained, logged, kept seven years', '    Chained, logged, kept seven years')));
  assert.deepStrictEqual(names(f), ['journeys']);
});

test('journeys: a §3 row missing from the flow diagram fails', () => {
  const f = runWith((d) => patch(d, JOURNEY, (t) => t.replace('capture again (3d)', 'capture again')));
  assert.deepStrictEqual(names(f), ['journeys']);
});

// ── site (FS-563, FS-567) ────────────────────────────────────────────────
const { build: buildSite } = require('./site');

function siteWith(edit, read) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-site-'));
  for (const rel of COPY) fs.cpSync(path.join(ROOT, rel), path.join(dir, rel), { recursive: true });
  edit(dir);
  try {
    const { outDir } = buildSite(dir);
    return { page: (rel) => fs.readFileSync(path.join(outDir, rel), 'utf8') };
  } catch (e) {
    return { error: e };
  } finally {
    if (!read) fs.rmSync(dir, { recursive: true, force: true });
  }
}

test('site --reader: builds without the names list, and says so; refuses any other failure', () => {
  const names = path.join('sources', 'confidential', 'protected-names.txt');
  const ok = (() => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-site-'));
    for (const rel of COPY) fs.cpSync(path.join(ROOT, rel), path.join(dir, rel), { recursive: true });
    fs.rmSync(path.join(dir, names));
    try {
      assert.throws(() => buildSite(dir), /checks failing/);
      const r = buildSite(dir, undefined, { reader: true });
      assert.ok(r.reader);
      return fs.readFileSync(path.join(r.outDir, 'index.html'), 'utf8');
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  })();
  assert.match(ok, /class="reader">Built for reading, without the protected-names check/);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-site-'));
  for (const rel of COPY) fs.cpSync(path.join(ROOT, rel), path.join(dir, rel), { recursive: true });
  fs.rmSync(path.join(dir, names));
  patch(dir, 'README.md', (t) => `${t}\nSee ${['FS', '999'].join('-')}.\n`);
  try { assert.throws(() => buildSite(dir, undefined, { reader: true }), /checks failing/); } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('site: refuses to build from failing sources', () => {
  const missing = ['FS', '999'].join('-');
  const r = siteWith((d) => patch(d, 'README.md', (t) => `${t}\nSee ${missing}.\n`));
  assert.ok(r.error && /checks failing/.test(r.error.message));
});

test('site: a journey links each capability to its module row, with its status', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-site-'));
  for (const rel of COPY) fs.cpSync(path.join(ROOT, rel), path.join(dir, rel), { recursive: true });
  try {
    const { outDir } = buildSite(dir);
    const journey = fs.readFileSync(path.join(outDir, 'docs', 'journeys', 'manual-identity-check.html'), 'utf8');
    const status = fs.readFileSync(path.join(ROOT, 'docs', 'modules', 'mfi.md'), 'utf8').match(/^\| MF-02 \|[^|]*\| (\w+) \|/m)[1];
    assert.match(journey, new RegExp(`<a class="id" href="\.\./modules/mfi\.html#MF-02"[^>]*>MF-02</a> <span class="st st-${status.toLowerCase()}">${status}</span>`));
    const mfi = fs.readFileSync(path.join(outDir, 'docs', 'modules', 'mfi.html'), 'utf8');
    assert.match(mfi, /<tr id="MF-02"><td><a class="self" href="#MF-02">MF-02<\/a><details><summary>cited \d+×<\/summary>((?!<\/details>).)*href="\.\.\/journeys\/manual-identity-check\.html/);
    assert.match(fs.readFileSync(path.join(outDir, 'docs', 'journeys', 'README.html'), 'utf8'), /href="manual-identity-check\.html"/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// ── overview (FS-575) ────────────────────────────────────────────────────
test('overview: a document the overview does not link fails', () => {
  const f = runWith((d) => fs.writeFileSync(path.join(d, 'docs', 'orphan.md'), '---\nid: orphan\nkind: register\nstatus: living\nreleased: unreleased\nlast_reviewed: 2026-10-06\n---\n\n# Orphan\n'));
  assert.deepStrictEqual(names(f), ['overview']);
});

test('overview: a document inside a linked folder passes', () => {
  const f = runWith((d) => fs.writeFileSync(path.join(d, 'docs', 'journeys', 'later.md'), '---\nid: later\nlast_reviewed: 2026-10-06\n---\n\n# Later\n'));
  assert.ok(!names(f).includes('overview'));
});

test('overview: removing a direct link fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'overview.md'), (t) => t.replace('[testing.md](testing.md)', 'testing.md')));
  assert.deepStrictEqual(names(f), ['overview']);
});

// ── specs (FS-627, FS-632) ───────────────────────────────────────────────
const SPEC = (f) => path.join('docs', 'specs', `${f}.md`);

test('specs: a relation one spec states and the other does not fails', () => {
  const f = runWith((d) => patch(d, SPEC('lender-rules'), (t) => t.replace('used_by: [end-of-day-runner, recon]', 'used_by: [recon]')));
  assert.deepStrictEqual(names(f), ['specs']);
});

test('specs: a Related line that does not link a spec in the front matter fails', () => {
  const f = runWith((d) => patch(d, SPEC('approval-engine'), (t) => t.replace('[kapu-core-fineract](kapu-core-fineract.md),', 'kapu-core-fineract,')));
  assert.deepStrictEqual(names(f), ['specs']);
});

test('specs: closing sections out of place fail', () => {
  const f = runWith((d) => patch(d, SPEC('approval-engine'), (t) => t.replace(/^## (\d+) · Acceptance tests$/m, '## $1 · Tests')));
  assert.deepStrictEqual(names(f), ['specs']);
});

test('specs: a spec missing from the index fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'specs', 'README.md'), (t) => t.replace(/^\| \[lender-rules\]\(lender-rules\.md\) \|.*\n/m, '')));
  assert.ok(names(f).includes('specs'));
});

test('specs: a box named outside the components table fails', () => {
  const f = runWith((d) => patch(d, SPEC('approval-engine'), (t) => t.replace('| KAPU CORE           |', '| FINERACT            |')));
  assert.deepStrictEqual(names(f), ['specs']);
});

test('specs: implementing a module that does not exist fails', () => {
  const f = runWith((d) => patch(d, SPEC('lender-rules'), (t) => t.replace('implements: [mfi]', 'implements: [mfi, lending]')));
  assert.deepStrictEqual(names(f), ['specs']);
});

// ── links (FS-627) ───────────────────────────────────────────────────────
test('links: a relative link to a file that does not exist fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'start-here.md'), (t) => `${t}\nSee [the old map](old-map.md).\n`));
  assert.deepStrictEqual(names(f), ['links']);
});

test('links: a docs path in the text that does not exist fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'testing.md'), (t) => `${t}\nAs docs/specs/rails.md says.\n`));
  assert.deepStrictEqual(names(f), ['links']);
});

// ── site navigation (FS-627, FS-628) ─────────────────────────────────────
test('site: a spec shows what it implements and what uses it, what links to it, and its contents', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-site-'));
  for (const rel of COPY) fs.cpSync(path.join(ROOT, rel), path.join(dir, rel), { recursive: true });
  try {
    const { outDir } = buildSite(dir);
    const spec = fs.readFileSync(path.join(outDir, 'docs', 'specs', 'kapu-core-fineract.html'), 'utf8');
    assert.match(spec, /<nav class="rel"><span><b>Implements:<\/b> <a href="\.\.\/modules\/core\.html">core<\/a>/);
    assert.match(spec, /<b>Used by:<\/b>[^<]*<a href="approval-engine\.html">approval-engine<\/a>/);
    assert.match(spec, /<details class="back"><summary>Linked from \d+ documents?<\/summary>/);
    assert.match(spec, /<nav class="toc"><b>Contents<\/b><a href="#s1">/);
    const core = fs.readFileSync(path.join(outDir, 'docs', 'modules', 'core.html'), 'utf8');
    assert.match(core, /<b>Specs:<\/b>[^<]*<a href="\.\.\/specs\/end-of-day-runner\.html">/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('site: a section reference links to that section', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-site-'));
  for (const rel of COPY) fs.cpSync(path.join(ROOT, rel), path.join(dir, rel), { recursive: true });
  try {
    const { outDir } = buildSite(dir);
    const idx = fs.readFileSync(path.join(outDir, 'docs', 'specs', 'README.html'), 'utf8');
    assert.match(idx, /<a class="sec" href="approval-engine\.html#s9">approval-engine §9<\/a>/);
    const ae = fs.readFileSync(path.join(outDir, 'docs', 'specs', 'approval-engine.html'), 'utf8');
    assert.match(ae, /<h2 id="s9">/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('site: a diagram is drawn with box lines, names in bold; alerts become callouts', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-site-'));
  for (const rel of COPY) fs.cpSync(path.join(ROOT, rel), path.join(dir, rel), { recursive: true });
  patch(dir, path.join('docs', 'testing.md'), (t) => `${t}\n> [!WARNING]\n> Nothing here is built.\n`);
  try {
    const { outDir } = buildSite(dir);
    const spec = fs.readFileSync(path.join(outDir, 'docs', 'specs', 'approval-engine.html'), 'utf8');
    assert.match(spec, /<pre class="diagram">[\s\S]*┌─+┐[\s\S]*<span class="bn">APPROVAL ENGINE<\/span>[\s\S]*<span class="tg">\[kapu_service\]<\/span>/);
    assert.match(fs.readFileSync(path.join(outDir, 'docs', 'testing.html'), 'utf8'), /<div class="alert alert-warning"><b>Warning<\/b><p>Nothing here is built\.<\/p><\/div>/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('diagrams: a Mermaid diagram fails; ASCII is the rule (FS-628)', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'testing.md'), (t) => `${t}\n\`\`\`mermaid\nflowchart LR\n  A --> B\n\`\`\`\n`));
  assert.deepStrictEqual(names(f), ['diagrams']);
});

test('links: a link to a section that is no heading fails (FS-641)', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'service-management', 'README.md'), (t) => t.replace('(#2--change-enablement)', '(#2--changes)')));
  assert.deepStrictEqual(names(f), ['links']);
});

// ── frontmatter (FS-654) ─────────────────────────────────────────────────
test('frontmatter: an unquoted value holding ": " fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'architecture', 'risks.md'), (t) => t.replace(/^name: (.*)$/m, 'name: Architecture: $1')));
  assert.deepStrictEqual(names(f), ['frontmatter']);
});

test('frontmatter: a quoted value, or a comment, passes', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'architecture', 'risks.md'), (t) => t.replace(/^name: (.*)$/m, 'name: "Architecture: $1"  # quoted')));
  assert.ok(!names(f).includes('frontmatter'));
});

// ── specs: lifecycle, sections, test ids (FS-667) ────────────────────────
test('specs: a status outside the lifecycle fails', () => {
  const f = runWith((d) => patch(d, SPEC('messaging'), (t) => t.replace(/^status: draft$/m, 'status: finished')));
  assert.deepStrictEqual(names(f), ['specs']);
});

test('specs: a spec without a Threats section fails', () => {
  const f = runWith((d) => patch(d, SPEC('messaging'), (t) => t.replace(/^## (\d+) · Threats$/m, '## $1 · Risks')));
  assert.deepStrictEqual(names(f), ['specs']);
});

test('specs: a test without an id fails', () => {
  const f = runWith((d) => patch(d, SPEC('messaging'), (t) => t.replace(/^\| M1 \|/m, '| first |')));
  assert.deepStrictEqual(names(f), ['specs']);
});

test('specs: a capability counted in R1 that the delivery plan leaves out fails', () => {
  const f = runWith((d) => patch(d, SPEC('messaging'), (t) => t.replace(/^(\| MS-05 \|.*\|) No:[^|]*\|$/m, '$1 Yes |')));
  assert.deepStrictEqual(names(f), ['specs']);
});

test('links: a link to a folder, not its README, fails', () => {
  const f = runWith((d) => patch(d, path.join('docs', 'overview.md'), (t) => t.replace('](outreach/README.md)', '](outreach/)')));
  assert.deepStrictEqual(names(f), ['links']);
});

// ── journeys: status, messages, stopping partway (FS-668) ────────────────
const JN = (f) => path.join('docs', 'journeys', `${f}.md`);

test('journeys: a status outside the lifecycle fails', () => {
  const f = runWith((d) => patch(d, JN('guarantor'), (t) => t.replace(/^status: draft$/m, 'status: done')));
  assert.deepStrictEqual(names(f), ['journeys']);
});

test('journeys: a step sending a template the catalogue lacks fails', () => {
  const f = runWith((d) => patch(d, JN('guarantor'), (t) => t.replace('| T19 |', '| T99 |')));
  assert.deepStrictEqual(names(f), ['journeys']);
});

test('journeys: a journey with no "stops partway" row fails', () => {
  const f = runWith((d) => patch(d, JN('micro-trader'), (t) => t.replace('**He stops partway through enrolment.**', '**He changes his mind.**')));
  assert.deepStrictEqual(names(f), ['journeys']);
});
