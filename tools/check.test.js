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
  const f = runWith((d) => patch(d, COLLECT, (t) => t.replace('| CO-02 |', '| CO-01 |')));
  assert.deepStrictEqual(names(f), ['capabilities']);
});

test('diagrams: a diagram line over 78 columns fails', () => {
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
  assert.deepStrictEqual(names(f), ['onboarding']);
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
