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
const COPY = ['README.md', 'REVIEW.md', 'docs', path.join('sources', 'kapu'),
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
  const f = runWith((d) => patch(d, 'REVIEW.md', (t) => t.replace(/^(\| FS-001 \|[^|]*\|[^|]*\|) DECIDED \|/m, '$1 DONE |')));
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
  const f = runWith((d) => patch(d, COLLECT, (t) => t.replace(/^(\| CO-01 \|[^|]*\|) Designed \|/m, '$1 Ready |')));
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
