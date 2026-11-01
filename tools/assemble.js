#!/usr/bin/env node
// Generates build/master.md: one file holding the whole design, for reading,
// searching and handing to a reviewer (FS-087, FS-121).
//
//   node tools/assemble.js
//
// The Master is generated, never written by hand, and lives in build/, which
// git ignores. It refuses to build while any check fails, so a Master that
// exists is one whose sources passed. Registers are published as counts
// computed from the source, not restated (building-a-master §5). The
// exception is docs/market/partners.md, included in full because it is short and
// generated output cannot drift from it.

'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { runAll, counts, moduleFiles } = require('./check');

const KIND_ORDER = ['product', 'shared-service', 'channel'];

function read(root, rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/\r\n/g, '\n');
}

function frontMatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  const fields = {};
  if (m) for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-z_]+): *(.*?)\s*(#.*)?$/);
    if (kv) fields[kv[1]] = kv[2];
  }
  return { fields, body: m ? text.slice(m[0].length) : text };
}

// Demote every heading one level, outside fences, so each source document
// becomes a section of the Master.
function demote(body) {
  let fenced = false;
  return body.split('\n').map((line) => {
    if (/^\s*```/.test(line)) fenced = !fenced;
    return !fenced && /^#{1,5} /.test(line) ? `#${line}` : line;
  }).join('\n');
}

// Relative links are written from the source's folder; re-point them from
// build/.
function relink(body, sourceRel, outDir, root) {
  return body.replace(/\]\((?!https?:|#|mailto:)([^)\s]+)\)/g, (all, target) => {
    const abs = path.resolve(root, path.dirname(sourceRel), target);
    return `](${path.relative(outDir, abs).split(path.sep).join('/')})`;
  });
}

function operativeRules(root) {
  const readme = read(root, 'README.md');
  const start = readme.indexOf('\n## How to work here\n');
  if (start < 0) throw new Error('README.md has no "How to work here" section to publish');
  const next = readme.indexOf('\n## ', start + 1);
  return readme.slice(start + 1, next < 0 ? undefined : next).trim();
}

function commit(root) {
  try {
    const sha = execSync('git rev-parse --short HEAD', { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    const dirty = execSync('git status --porcelain', { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    return dirty ? `${sha}, plus uncommitted changes` : sha;
  } catch (e) {
    return 'not a git checkout';
  }
}

function countsSection(c) {
  const line = (obj) => Object.entries(obj).map(([k, v]) => `${k} ${v}`).join(' · ') || 'none';
  const rows = Object.entries(c.modules)
    .map(([id, byStatus]) => `| ${id} | ${['Live', 'Built', 'Designed', 'Planned'].map((s) => byStatus[s] || 0).join(' | ')} |`);
  return [
    '## Counts, computed from the sources',
    '',
    '| Module | Live | Built | Designed | Planned |',
    '|---|---|---|---|---|',
    ...rows,
    '',
    `**Register (REVIEW.md, open; review/, closed):** ${c.register.rows} rows — ${line(c.register.byStatus)}.`,
    '',
    `**Partners:** ${c.partners.candidates} candidates — ${line(c.partners.byStage)}. ` +
      `Selection decisions — ${line(c.partners.decisions)}.`,
    '',
  ].join('\n');
}

function assemble(root, outFile = path.join(root, 'build', 'master.md')) {
  const failures = runAll(root);
  if (failures.length) {
    const err = new Error(`checks failing (${failures.length}); the Master is not built from failing sources`);
    err.failures = failures;
    throw err;
  }
  const outDir = path.dirname(outFile);

  const modules = moduleFiles(root).map((rel) => ({ rel, ...frontMatter(read(root, rel)) }))
    .sort((a, b) => (KIND_ORDER.indexOf(a.fields.kind) - KIND_ORDER.indexOf(b.fields.kind))
      || a.fields.id.localeCompare(b.fields.id));

  // A folder's README first, then its other documents (FS-641, FS-649).
  const folder = (name) => {
    const dir = path.join(root, 'docs', name);
    if (!fs.existsSync(dir)) return [];
    const rest = fs.readdirSync(dir).filter((x) => x.endsWith('.md') && x !== 'README.md').sort();
    return ['README.md', ...rest].filter((x) => fs.existsSync(path.join(dir, x))).map((x) => ({ rel: path.join('docs', name, x) }));
  };
  const docs = [
    { rel: path.join('docs', 'overview.md') },
    ...folder('architecture'),
    ...modules.map((m) => ({ rel: m.rel })),
    { rel: path.join('docs', 'decisions.md') },
    // FS-1053: the entries, a file per hundred ids, in order.
    ...(fs.existsSync(path.join(root, 'docs', 'decisions')) ? fs.readdirSync(path.join(root, 'docs', 'decisions')).filter((x) => /^\d+-\d+\.md$/.test(x)).sort((x, y) => parseInt(x, 10) - parseInt(y, 10)).map((x) => ({ rel: path.join('docs', 'decisions', x) })) : []),
    { rel: path.join('docs', 'market', 'partners.md') },
    // Every other register and plan in docs/ (FS-480): the Master holds all
    // of it. Outreach drafts and marketing copy are outward, not the design.
    ...fs.readdirSync(path.join(root, 'docs')).filter((f) => f.endsWith('.md')
      && !['overview.md', 'architecture.md', 'decisions.md', 'partners.md'].includes(f)).sort()
      .map((f) => ({ rel: path.join('docs', f) })),
    // FS-1053: the registers and plans that were loose in docs/, by folder.
    ...['market', 'governance', 'delivery', 'company'].flatMap(folder).filter((d) => !d.rel.endsWith(path.join('market', 'partners.md'))),
    ...folder('service-management'),
    ...folder('training'),
    ...(fs.existsSync(path.join(root, 'docs', 'customers')) ? fs.readdirSync(path.join(root, 'docs', 'customers'))
      .filter((f) => f.endsWith('.md')).sort().map((f) => ({ rel: path.join('docs', 'customers', f) })) : []),
  ].map((d) => {
    const { fields, body } = frontMatter(read(root, d.rel));
    return { ...d, fields, body };
  });

  // FS-852: each document's status and the release it was last released in.
  const contents = docs.map((d) => {
    const title = (d.body.match(/^# (.+)$/m) || [, d.rel])[1];
    return `- ${title} — \`${d.rel.split(path.sep).join('/')}\`, ${d.fields.status || 'no status'}${d.fields.released ? `, ${d.fields.released === 'unreleased' ? 'unreleased' : `released ${d.fields.released}`}` : ''}`;
  });

  const out = [
    '# Dibon financial services — Master',
    '',
    `> **${require('./release').line(require('./release').info(root))}.**`,
    '>',
    '> **Generated. Do not edit.** Built by `node tools/assemble.js` from',
    `> commit ${commit(root)}. Edit the sources in docs/ and rebuild. Every`,
    '> check passed when this was built.',
    '',
    '## Contents',
    '',
    '- How to work here — `README.md`',
    '- Counts, computed from the sources',
    ...contents,
    '- The register — `REVIEW.md` (counts only; the register is the source)',
    '',
    demote(operativeRules(root)),
    '',
    countsSection(counts(root)),
    ...docs.map((d) => [
      '---',
      '',
      `*Source: \`${d.rel.split(path.sep).join('/')}\`, ${d.fields.status || 'no status'}${d.fields.released ? `, ${d.fields.released === 'unreleased' ? 'unreleased' : `released ${d.fields.released}`}` : ''}.*`,
      '',
      demote(relink(d.body.trim(), d.rel, outDir, root)),
      '',
    ].join('\n')),
  ].join('\n');

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, out);
  return { outFile, documents: docs.length };
}

module.exports = { assemble };

if (require.main === module) {
  const root = path.join(__dirname, '..');
  try {
    const { outFile, documents } = assemble(root);
    console.log(`built ${path.relative(root, outFile)} from ${documents} documents`);
  } catch (e) {
    for (const f of e.failures || []) console.log(`FAIL ${f.check}  ${f.file}${f.line ? `:${f.line}` : ''}  ${f.message}`);
    console.log(e.message);
    process.exit(1);
  }
}
