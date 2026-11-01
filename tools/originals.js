#!/usr/bin/env node
// Third parties' documents, kept as received (rules, Dibon 11; FS-834).
// A party's folder in clients/ has originals/: each file there is
// read-only and recorded in originals/MANIFEST.json with its SHA-256, size,
// when it arrived and from whom (by role). Work happens on a derived,
// named, versioned document elsewhere, whose first version cites the
// original's hash.
//
//   node tools/originals.js add <party-folder> <file> --from "<who, by role>" --received <YYYY-MM-DD> [--note "<text>"]
//   node tools/originals.js verify <party-folder>
//   node tools/originals.js cite <party-folder> <file-name>
//
// add moves the file into originals/ and makes it read-only; verify checks
// every file against the manifest (present, unchanged, read-only) and
// that nothing unrecorded sits beside them; cite prints the line a working
// document quotes. clients/ is never in git: the manifest lives with the
// files, until Odoo Documents' locked folders take over (rules, Dibon 10).

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const isReadOnly = (file) => (fs.statSync(file).mode & 0o200) === 0;
const manifestPath = (dir) => path.join(dir, 'originals', 'MANIFEST.json');
const load = (dir) => (fs.existsSync(manifestPath(dir)) ? JSON.parse(fs.readFileSync(manifestPath(dir), 'utf8')) : []);
const save = (dir, m) => fs.writeFileSync(manifestPath(dir), `${JSON.stringify(m, null, 2)}\n`);

function add(dir, file, opts) {
  if (!opts.from || !/^\d{4}-\d{2}-\d{2}$/.test(opts.received || '')) throw new Error('add needs --from "<who, by role>" and --received <YYYY-MM-DD>');
  if (!fs.existsSync(file)) throw new Error(`not found: ${file}`);
  const name = path.basename(file);
  const dest = path.join(dir, 'originals', name);
  const m = load(dir);
  if (m.some((e) => e.file === name)) throw new Error(`already an original: ${name}`);
  if (fs.existsSync(dest)) throw new Error(`a file of that name is already in originals/: ${name}`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  // A move across drives (Downloads on C:, the repository on E:) cannot
  // rename: copy, check the copy, then remove the source.
  try { fs.renameSync(file, dest); } catch (e) {
    if (e.code !== 'EXDEV') throw e;
    fs.copyFileSync(file, dest);
    if (sha256(dest) !== sha256(file)) { fs.unlinkSync(dest); throw new Error(`the copy of ${name} does not match it; nothing kept`); }
    fs.unlinkSync(file);
  }
  fs.chmodSync(dest, 0o444);
  const entry = {
    file: name, sha256: sha256(dest), bytes: fs.statSync(dest).size,
    received: opts.received, from: opts.from, ...(opts.note ? { note: opts.note } : {}),
    kept: (() => { const d = new Date(); const p = (n) => String(n).padStart(2, "0"); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`; })(),
  };
  m.push(entry);
  save(dir, m);
  return entry;
}

function verify(dir) {
  const problems = [];
  const m = load(dir);
  const odir = path.join(dir, 'originals');
  if (!m.length) problems.push('no manifest, or an empty one');
  for (const e of m) {
    const f = path.join(odir, e.file);
    if (!fs.existsSync(f)) { problems.push(`${e.file}: missing`); continue; }
    if (sha256(f) !== e.sha256) problems.push(`${e.file}: changed since it was kept (its SHA-256 differs)`);
    if (!isReadOnly(f)) problems.push(`${e.file}: not read-only`);
  }
  if (fs.existsSync(odir)) {
    for (const f of fs.readdirSync(odir)) {
      if (f === 'MANIFEST.json' || f.startsWith('~$')) continue;
      if (!m.some((e) => e.file === f)) problems.push(`${f}: in originals/ but not in the manifest`);
    }
  }
  // Against the document register (FS-835), for a party in this repository's
  // clients/: every kept file has its row, and every row its kept file.
  const repo = path.join(__dirname, '..');
  const register = path.join(repo, 'docs', 'governance', 'document-register.md');
  const rel = path.relative(repo, path.resolve(dir)).split(path.sep).join('/');
  if (fs.existsSync(register) && rel.startsWith('clients/')) {
    // By the register's header (tools/docregister.js, FS-857).
    const rows = require('./docregister').parse(fs.readFileSync(register, 'utf8')).rows.filter((r) => r.where === `\`${rel}/originals/\``);
    const printed = new Map(rows.map((r) => [r.print.replace(/`/g, ''), r.id]));
    for (const e of m) if (!printed.has(e.sha256.slice(0, 12))) problems.push(`${e.file}: kept, but no document register row has its fingerprint`);
    const kept = new Set(m.map((e) => e.sha256.slice(0, 12)));
    for (const [f, id] of printed) if (!kept.has(f)) problems.push(`${id}: in the document register as kept here, but no file in the manifest matches its fingerprint`);
  }
  return { count: m.length, problems };
}

const cite = (dir, name) => {
  const e = load(dir).find((x) => x.file === name);
  if (!e) throw new Error(`not an original: ${name}`);
  return `${e.file}, received ${e.received} from ${e.from}; SHA-256 ${e.sha256}`;
};

module.exports = { add, verify, cite, sha256 };

if (require.main === module) {
  const [cmd, dir, ...rest] = process.argv.slice(2);
  const opt = (k) => { const i = rest.indexOf(k); return i >= 0 ? rest[i + 1] : undefined; };
  try {
    if (cmd === 'add') {
      const e = add(dir, rest[0], { from: opt('--from'), received: opt('--received'), note: opt('--note') });
      console.log(`kept ${e.file} (${e.bytes} bytes), SHA-256 ${e.sha256}`);
    } else if (cmd === 'verify') {
      const { count, problems } = verify(dir);
      if (problems.length) { for (const p of problems) console.log(`FAIL ${p}`); process.exit(1); }
      console.log(`${count} originals, all unchanged and read-only`);
    } else if (cmd === 'cite') {
      console.log(cite(dir, rest[0]));
    } else {
      console.log('usage: node tools/originals.js add|verify|cite <party-folder> ...');
      process.exit(1);
    }
  } catch (e) { console.error(e.message); process.exit(1); }
}
