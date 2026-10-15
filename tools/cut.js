#!/usr/bin/env node
// Releases a version (FS-845; rules, Dibon 12). A version is the release's
// date, 2026.10.15; a second release the same day, or a patch to it, adds
// .1, .2. Each release gathers the change notes in changes/ (one per merge
// request), writes them where they belong, stamps the status, and says how
// to tag it. It never commits or tags by itself.
//
//   node tools/cut.js docs [--kind major|minor|patch] [--date YYYY-MM-DD]
//   node tools/cut.js <customer-id> [--kind …] [--date …]
//
// docs: CHANGELOG.md gets the entry (every note, internal); notes for
// everyone also go to docs/marketing/release-notes.md, the external
// changelog; README.md's release line moves. A customer: its delivery map's
// §8 gets the entry (its notes, written for it). Each document changed in a
// docs release says so in its front matter, "released: <version>". A note
// is removed once every place it belongs to has released it: the
// documentation always, and
// its customer when it is for one. An entry written by hand under the
// version's heading, with "**Status:** to stamp", is stamped and kept.

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const git = (args) => execFileSync('git', ['-C', ROOT, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 256 * 1024 * 1024 });
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
const norm = (s) => s.replace(/\r\n/g, '\n');
const STAMP = '**Status:** to stamp';
const KINDS = ['patch', 'minor', 'major'];
const VERSION = /^\d{4}\.\d{2}\.\d{2}(?:\.\d+)?$/;

const byVersion = (a, b) => {
  const [x, y] = [a, b].map((v) => v.split('.').map(Number));
  for (let i = 0; i < Math.max(x.length, y.length); i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) - (y[i] || 0);
  return 0;
};
const tagsOf = (series) => git(['tag', '--list', `${series}-*`]).split('\n').filter(Boolean)
  .map((t) => t.slice(series.length + 1)).filter((v) => VERSION.test(v)).sort(byVersion);
function previousTag(series, version) {
  const older = tagsOf(series).filter((v) => byVersion(v, version) < 0);
  return older.length ? `${series}-${older[older.length - 1]}` : null;
}
// Today's date as a version, or the next .N if that date is released.
function nextVersion(series, date) {
  const base = date.replace(/-/g, '.');
  const taken = tagsOf(series).filter((v) => v === base || v.startsWith(`${base}.`));
  if (!taken.length) return base;
  const n = Math.max(...taken.map((v) => +(v.split('.')[3] || 0)));
  return `${base}.${n + 1}`;
}

const front = (text) => (norm(text).match(/^---\n([\s\S]*?)\n---\n/) || [])[1] || '';
const field = (fm, k) => (fm.match(new RegExp(`^${k}: *(.*)$`, 'm')) || [])[1];

// ── change notes ─────────────────────────────────────────────────────────
const CHANGES = path.join(ROOT, 'changes');
function readNotes() {
  if (!fs.existsSync(CHANGES)) return [];
  return fs.readdirSync(CHANGES).filter((f) => f.endsWith('.md') && f !== 'README.md').sort().map((f) => {
    const text = norm(fs.readFileSync(path.join(CHANGES, f), 'utf8'));
    const fm = front(text);
    const list = (k) => (field(fm, k) || '').replace(/^\[|\]$/g, '').split(',').map((s) => s.trim()).filter(Boolean);
    return {
      file: path.join(CHANGES, f), kind: field(fm, 'kind'), for: field(fm, 'for'), rows: list('rows'),
      by: field(fm, 'by'), released: list('released'), body: text.replace(/^---\n[\s\S]*?\n---\n/, '').trim().replace(/\s*\n\s*/g, ' '),
    };
  });
}
const belongsTo = (note) => ['docs', ...(note.for !== 'team' && note.for !== 'everyone' ? [note.for] : [])];
function markReleased(note, series) {
  const done = [...new Set([...note.released, series])];
  if (belongsTo(note).every((s) => done.includes(s))) { fs.unlinkSync(note.file); return 'removed'; }
  const raw = fs.readFileSync(note.file, 'utf8');
  const crlf = raw.includes('\r\n');
  let t = norm(raw);
  t = /^released:/m.test(t) ? t.replace(/^released:.*$/m, `released: [${done.join(', ')}]`) : t.replace(/\n---\n/, `\nreleased: [${done.join(', ')}]\n---\n`);
  fs.writeFileSync(note.file, crlf ? t.replace(/\n/g, '\r\n') : t);
  return 'kept for its customer';
}

// ── the status stamps ────────────────────────────────────────────────────
function docStatuses(read, list) {
  const out = new Map();
  for (const f of list) {
    const fm = front(read(f));
    if (!fm || path.basename(f).startsWith('_')) continue;
    out.set(f, { kind: (field(fm, 'kind') || '').split(/\s/)[0], status: (field(fm, 'status') || '').split(/\s/)[0] });
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
  if (!prev) return `${counts}. The first dated release: nothing earlier to compare.`;
  const old = docStatuses((f) => git(['show', `${prev}:${f}`]), git(['ls-tree', '-r', '--name-only', prev, 'docs']).split('\n').filter((f) => f.endsWith('.md')));
  const moved = [...now].filter(([f, v]) => old.has(f) && old.get(f).status !== v.status).map(([f, v]) => `${f.replace(/^docs\//, '')} ${old.get(f).status} to ${v.status}`);
  const added = [...now.keys()].filter((f) => !old.has(f)).length;
  const removed = [...old.keys()].filter((f) => !now.has(f)).length;
  return `${counts}. Since ${prev}: ${moved.length ? moved.join('; ') : 'no status changed'}; ${added} documents added, ${removed} removed.`;
}
// FS-852: each document says the release its content was last released in.
// A document that is new, still "unreleased", or changed since the previous
// release (a moved stamp alone is no change) takes this one; the rest keep
// theirs. Templates (_*.md) stay "unreleased", so a copy starts that way.
function stampReleased(version) {
  const prev = previousTag('docs', version);
  const changed = prev ? require('./release').changedSince(git, prev, ['docs']) : new Set();
  const before = new Set(prev ? git(['ls-tree', '-r', '--name-only', prev, 'docs']).split('\n') : []);
  const files = git(['ls-files', '--cached', '--others', '--exclude-standard', 'docs']).split('\n').filter((f) => f.endsWith('.md'));
  let n = 0;
  for (const f of files) {
    if (path.basename(f).startsWith('_')) continue;
    const p = path.join(ROOT, f);
    const raw = fs.readFileSync(p, 'utf8');
    const t = norm(raw);
    const fm = front(t);
    if (!fm) continue;
    const had = (field(fm, 'released') || '').trim();
    if (prev && had && had !== 'unreleased' && before.has(f) && !changed.has(f)) continue;
    const head = /^released:/m.test(fm)
      ? fm.replace(/^released:.*$/m, `released: ${version}`)
      : /^status:.*$/m.test(fm) ? fm.replace(/^(status:.*)$/m, `$1\nreleased: ${version}`) : `${fm}\nreleased: ${version}`;
    const out = t.replace(`---\n${fm}\n---\n`, `---\n${head}\n---\n`);
    fs.writeFileSync(p, raw.includes('\r\n') ? out.replace(/\n/g, '\r\n') : out);
    n++;
  }
  return n;
}
function registerRows(text, party) {
  return norm(text).split('\n').map((l) => l.split('|').slice(1, -1).map((s) => s.trim()))
    .filter((c) => /^DR-\d{3}$/.test(c[0] || '') && c[1] === party).map((c) => ({ id: c[0], kind: c[3], status: c[5] }));
}
const openAnswers = (text) => {
  const t = norm(text);
  const s4 = t.slice(t.indexOf('## 4 · '), t.indexOf('## 5 · '));
  const part = (h) => (s4.split(`### ${h}`)[1] || '').split('###')[0];
  const nums = (p) => (p.match(/^\| (\d+) \|/gm) || []).map((x) => x.replace(/\D/g, ''));
  return { open: nums(part('Open')), answered: nums(part('Answered')) };
};
function stampCustomer(id, version, page, party) {
  const rows = registerRows(fs.readFileSync(path.join(ROOT, 'docs', 'document-register.md'), 'utf8'), party);
  const tally = {};
  for (const r of rows) tally[`${r.kind.toLowerCase()} ${r.status}`] = (tally[`${r.kind.toLowerCase()} ${r.status}`] || 0) + 1;
  const oa = openAnswers(fs.readFileSync(page, 'utf8'));
  const head = `Documents ${rows.length} (${Object.entries(tally).map(([k, n]) => `${n} ${k}`).join(', ')}); open answers ${oa.open.length} open, ${oa.answered.length} answered.`;
  const prev = previousTag(id, version);
  if (!prev) return `${head} The first dated release: nothing earlier to compare.`;
  const oldRows = new Map(registerRows(git(['show', `${prev}:docs/document-register.md`]), party).map((r) => [r.id, r]));
  const added = rows.filter((r) => !oldRows.has(r.id)).map((r) => r.id);
  const moved = rows.filter((r) => oldRows.has(r.id) && oldRows.get(r.id).status !== r.status).map((r) => `${r.id} ${oldRows.get(r.id).status} to ${r.status}`);
  const answered = oa.answered.filter((n) => !openAnswers(git(['show', `${prev}:${rel(page)}`])).answered.includes(n));
  return `${head} Since ${prev}: documents added ${added.join(', ') || 'none'}; status changes ${moved.join('; ') || 'none'}; newly answered ${answered.join(', ') || 'none'}.`;
}

// ── writing an entry ─────────────────────────────────────────────────────
// The entry for `version` under `level` headings: stamped if written by
// hand, else inserted above the newest; notes as bullets before its status.
function writeEntry(file, level, version, kind, bullets, stamp, insertAfter) {
  const raw = fs.readFileSync(file, 'utf8');
  const crlf = raw.includes('\r\n');
  let t = norm(raw);
  const headRe = new RegExp(`^${level} ${version.replace(/\./g, '\\.')} · (major|minor|patch)$`, 'm');
  const list = bullets.length ? `${bullets.join('\n')}\n` : '';
  const m = t.match(headRe);
  let actual = kind;
  if (m) {
    actual = m[1]; // a heading written by hand says the kind
    const rest = t.slice(m.index + m[0].length);
    const next = rest.search(new RegExp(`^#{2,${level.length}} `, 'm'));
    const entry = next < 0 ? rest : rest.slice(0, next);
    if (!entry.includes(STAMP)) throw new Error(`${rel(file)}: ${version} is already released`);
    t = t.slice(0, m.index + m[0].length) + entry.replace(STAMP, stamp === null ? list.trimEnd() : `${list}**Status:** ${stamp}`) + (next < 0 ? '' : rest.slice(next));
  } else {
    // An external entry (stamp null) carries no internal status line.
    const at = insertAfter(t);
    t = `${t.slice(0, at)}${level} ${version} · ${kind}\n\n${list}${stamp === null ? '' : `**Status:** ${stamp}\n`}\n${t.slice(at)}`;
  }
  fs.writeFileSync(file, crlf ? t.replace(/\n/g, '\r\n') : t);
  return actual;
}
const firstEntryAt = (level) => (t) => {
  const m = t.match(new RegExp(`^${level} \\d{4}\\.\\d{2}\\.\\d{2}`, 'm'));
  if (!m) throw new Error(`no ${level} entry to insert above`);
  return m.index;
};
const bullet = (n, withIds) => `- ${n.body}${withIds ? ` (${n.rows.join(', ')}; ${n.by}${n.for !== 'team' ? `; for ${n.for}` : ''})` : ''}`;

function release(series, opts) {
  const date = opts.date || new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('--date is YYYY-MM-DD');
  const version = nextVersion(series, date);
  const notes = readNotes().filter((n) => belongsTo(n).includes(series) && !n.released.includes(series));
  // The kind: given, else an entry's heading written by hand, else the
  // weightiest note's.
  const target = series === 'docs' ? path.join(ROOT, 'CHANGELOG.md') : path.join(ROOT, 'docs', 'customers', `${series}.md`);
  const written = fs.existsSync(target) && (norm(fs.readFileSync(target, 'utf8')).match(new RegExp(`^#{2,3} ${version.replace(/\./g, '\\.')} · (major|minor|patch)$`, 'm')) || [])[1];
  const kind = opts.kind || written || notes.map((n) => n.kind).sort((a, b) => KINDS.indexOf(b) - KINDS.indexOf(a))[0];
  if (!KINDS.includes(kind)) throw new Error('no change notes to release, and no --kind given');
  const done = [];
  let released = kind;
  if (series === 'docs') {
    const stamped = stampReleased(version);
    const summary = `${stampDocs(version)} Documents changed in it, now saying "released: ${version}": ${stamped}.`;
    released = writeEntry(path.join(ROOT, 'CHANGELOG.md'), '##', version, kind, notes.map((n) => bullet(n, true)), summary, firstEntryAt('##'));
    done.push('CHANGELOG.md', `${stamped} document${stamped === 1 ? '' : 's'} stamped`);
    const outside = notes.filter((n) => n.for === 'everyone');
    if (outside.length) {
      writeEntry(path.join(ROOT, 'docs', 'marketing', 'release-notes.md'), '##', version, kind, outside.map((n) => bullet(n, false)), null, firstEntryAt('##'));
      done.push('docs/marketing/release-notes.md');
    }
    const readme = path.join(ROOT, 'README.md');
    const raw = fs.readFileSync(readme, 'utf8');
    const line = `**Release:** ${version} · ${released} · see [CHANGELOG.md](CHANGELOG.md)`;
    if (!/^\*\*Release:\*\* .*$/m.test(raw)) throw new Error('README.md has no "**Release:**" line');
    fs.writeFileSync(readme, raw.replace(/^\*\*Release:\*\* .*$/m, line));
    done.push('README.md');
    // FS-842: the handover says which release it describes.
    const handoff = path.join(ROOT, 'HANDOFF.md');
    if (fs.existsSync(handoff)) {
      const h = fs.readFileSync(handoff, 'utf8');
      if (!/^ {4}release: .*$/m.test(h)) throw new Error('HANDOFF.md has no "    release:" line');
      fs.writeFileSync(handoff, h.replace(/^ {4}release: .*$/m, `    release: ${version} · ${released}`));
      done.push('HANDOFF.md');
    }
  } else {
    const page = path.join(ROOT, 'docs', 'customers', `${series}.md`);
    if (!fs.existsSync(page)) throw new Error(`no ${rel(page)}`);
    const party = (front(fs.readFileSync(page, 'utf8')).match(/^name: *(.+?) —/m) || [])[1];
    released = writeEntry(page, '###', version, kind, notes.map((n) => bullet(n, false)), stampCustomer(series, version, page, party), firstEntryAt('###'));
    done.push(rel(page));
  }
  const fates = notes.map((n) => `${path.basename(n.file)}: ${markReleased(n, series)}`);
  return { version, kind: released, done, fates, tag: `${series}-${version}` };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
  try {
    const series = args[0];
    if (!series || series.startsWith('--')) throw new Error('usage: node tools/cut.js docs|<customer-id> [--kind major|minor|patch] [--date YYYY-MM-DD]');
    const r = release(series, { kind: opt('--kind'), date: opt('--date') });
    console.log(`released ${series} ${r.version} (${r.kind}): ${r.done.join(', ')}`);
    for (const f of r.fates) console.log(`  ${f}`);
    console.log(`Next: commit ("Release ${r.tag}"), then  git tag -a ${r.tag} -m "${series} ${r.version}"  and push the tag with the commits.`);
  } catch (e) { console.error(e.message); process.exit(1); }
}

module.exports = { release, nextVersion, readNotes, byVersion, VERSION, stampReleased };
