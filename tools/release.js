// Which release a reader is reading (FS-842, FS-845): the newest docs-
// release, how far the documents have moved since it, which files changed,
// and the change notes not yet released. The reader, the Master and the
// checks read it from here, so they never disagree.

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const VERSION = /^\d{4}\.\d{2}\.\d{2}(?:\.\d+)?$/;
const byVersion = (a, b) => {
  const [x, y] = [a, b].map((v) => v.split('.').map(Number));
  for (let i = 0; i < Math.max(x.length, y.length); i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) - (y[i] || 0);
  return 0;
};
const norm = (s) => s.replace(/\r\n/g, '\n');

// The newest release in CHANGELOG.md, as "2026.10.15 · major".
function newestInLog(root) {
  const p = path.join(root, 'CHANGELOG.md');
  if (!fs.existsSync(p)) return null;
  const m = norm(fs.readFileSync(p, 'utf8')).match(/^## (\d{4}\.\d{2}\.\d{2}(?:\.\d+)?) · (major|minor|patch)$/m);
  return m ? { version: m[1], kind: m[2] } : null;
}

// Change notes in changes/ (their release state included).
function notes(root) {
  const dir = path.join(root, 'changes');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'README.md').sort().map((f) => {
    const text = norm(fs.readFileSync(path.join(dir, f), 'utf8'));
    const fm = (text.match(/^---\n([\s\S]*?)\n---\n/) || [])[1] || '';
    const get = (k) => ((fm.match(new RegExp(`^${k}: *(.*)$`, 'm')) || [])[1] || '').trim();
    return { file: f, kind: get('kind'), for: get('for'), rows: get('rows').replace(/^\[|\]$/g, ''), by: get('by'), released: get('released'), text: text.replace(/^---\n[\s\S]*?\n---\n/, '').trim() };
  });
}

// FS-852: each document's front matter says the release its content was
// last released in ("released: 2026.10.15", or "unreleased" before its
// first). A diff that moves only that line is not a change of content.
function stampOf(text) {
  const fm = (norm(text).match(/^---\n([\s\S]*?)\n---\n/) || [])[1] || '';
  const m = fm.match(/^released: *(.*)$/m);
  return m ? m[1].trim() : null;
}
// The files whose content differs from `ref` in the working tree, from a
// zero-context diff: a file whose only changed lines are its stamp is left out.
function changedSince(git, ref, paths = []) {
  const out = new Set();
  let file = null;
  for (const l of git(['diff', '--unified=0', '--no-color', ref, '--', ...paths]).split('\n')) {
    const d = l.match(/^diff --git a\/.* b\/(.*)$/);
    if (d) { file = d[1].replace(/^"|"$/g, ''); continue; }
    if (!file || out.has(file) || /^(\+\+\+|---) /.test(l)) continue;
    if (/^(new|deleted) file mode/.test(l) || /^Binary files/.test(l)) { out.add(file); continue; }
    if (/^[+-]/.test(l) && !/^[+-]released:/.test(l)) out.add(file);
  }
  return out;
}

// { version, kind, tag, tagged, ahead, dirty, changed:Set<path>, notes }.
function info(root) {
  const logged = newestInLog(root);
  const out = { version: logged ? logged.version : null, kind: logged ? logged.kind : null, tag: null, tagged: false, ahead: 0, dirty: false, changed: new Set(), notes: notes(root) };
  const git = (args) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 });
  try {
    const tags = git(['tag', '--list', 'docs-*']).split('\n').filter(Boolean).map((t) => t.slice(5)).filter((v) => VERSION.test(v)).sort(byVersion);
    if (tags.length) {
      const v = tags[tags.length - 1];
      out.tag = `docs-${v}`;
      out.tagged = out.version === v;
      out.ahead = +git(['rev-list', '--count', `${out.tag}..HEAD`]).trim();
      out.changed = changedSince(git, out.tag);
    }
    out.dirty = git(['status', '--porcelain', '--untracked-files=no']).trim() !== '';
  } catch { /* not a git checkout: the changelog alone says the release */ }
  return out;
}

// One line a reader sees: "Release 2026.10.15", or with what has moved since.
function line(i) {
  if (!i.version) return 'No release yet';
  const plus = [];
  if (i.ahead) plus.push(`${i.ahead} change${i.ahead === 1 ? '' : 's'} since`);
  if (i.dirty) plus.push('unsaved edits');
  const pending = i.notes.filter((n) => !n.released.includes('docs')).length;
  if (pending) plus.push(`${pending} note${pending === 1 ? '' : 's'} waiting`);
  return `Release ${i.version}${i.tagged ? '' : ' (not yet tagged)'}${plus.length ? ` + ${plus.join(', ')}` : ''}`;
}

// A customer's newest release, from its delivery map's §8.
function customerRelease(text) {
  const t = norm(text);
  const s8 = t.indexOf('\n## 8 · ');
  if (s8 < 0) return null;
  const m = t.slice(s8).match(/^### (\d{4}\.\d{2}\.\d{2}(?:\.\d+)?) · (major|minor|patch)$/m);
  return m ? `${m[1]} · ${m[2]}` : null;
}

module.exports = { info, line, notes, newestInLog, customerRelease, byVersion, stampOf, changedSince, VERSION };
