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
const COPY = ['README.md', 'REVIEW.md', 'docs', path.join('sources', 'kapu'), path.join('design', 'portfolio-pdf'),
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
  const f = runWith((d) => patch(d, 'REVIEW.md', (t) => t.replace('| FS-002 |', '| FS-003 |')));
  assert.ok(names(f).includes('register'));
});

test('register: a row with an extra cell fails', () => {
  const f = runWith((d) => patch(d, 'REVIEW.md', (t) => t.replace(/^(\| FS-001 \|.*)$/m, '$1 extra |')));
  assert.deepStrictEqual(names(f), ['register']);
});

test('register: an unknown status fails', () => {
  // FS-002 has no decisions entry, so only the register check is involved.
  const f = runWith((d) => patch(d, 'REVIEW.md', (t) => t.replace(/^(\| FS-002 \|[^|]*\|[^|]*\|) DECIDED \|/m, '$1 DONE |')));
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
  const f = runWith((d) => patch(d, path.join('docs', 'architecture.md'),
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
  const f = runWith((d) => patch(d, 'REVIEW.md', (t) => t.replace(/^(\| FS-230 \|.*?) \[decision\] \|$/m, '$1 |')));
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
const engagement = (who, decision) => (t) => `${t.trimEnd()}\n| AS-01 | ${who} | Penetration test | Internet banking | Yes | ${decision} | 2026-10-05 | FS-440 |\n`;

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
  const f = runWith((d) => patch(d, DECISIONS, (t) => t.replace('docs/architecture.md §9 "an isolated', 'docs/architecture.md §19 "an isolated')));
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
  const f = runWith((d) => fs.writeFileSync(path.join(d, 'docs', 'orphan.md'), '---\nid: orphan\nlast_reviewed: 2026-10-06\n---\n\n# Orphan\n'));
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
  const f = runWith((d) => patch(d, SPEC('lender-rules'), (t) => t.replace('used_by: [end-of-day-runner]', 'used_by: []')));
  assert.deepStrictEqual(names(f), ['specs']);
});

test('specs: a Related line that does not link a spec in the front matter fails', () => {
  const f = runWith((d) => patch(d, SPEC('approval-engine'), (t) => t.replace('[kapu-core-fineract](kapu-core-fineract.md) (and', 'kapu-core-fineract (and')));
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
