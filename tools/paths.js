// Paths written as plain text in a document, and what each one means
// (FS-856). The reader links them and the links check checks them, both
// from here, so they never disagree. The Markdown stays plain: we write
// "docs/governance/regulation.md, compliance.md, privacy.md", and the short names
// after the first path mean the same folder.
//
// A name.md resolves to, in order: the folder last named on the same line
// (so a list reads as it is meant), the mentioning document's own folder,
// the root (README.md alone is the repository's), then the one document
// anywhere with that name. A relative path
// (modules/access.md) resolves from the document's folder, then from
// docs/, then from the root. A folder (docs/customers/, handbook/) resolves
// inside docs/, or is a folder outside it (tools/), or is nothing.

'use strict';

const fs = require('fs');
const path = require('path');

const dirs = new Map();
const PATH = /(?<![\w./:-])((?:[\w-]+\/)+)?([\w-][\w.-]*\.md)\b|(?<![\w./:-])((?:[\w-]+\/)+)(?![\w.])/g;

// Every path written in `text`: { at, text, dir, name } for a file,
// { at, text, folder } for a folder.
function mentions(text) {
  return [...text.matchAll(PATH)].map((m) => (m[2]
    ? { at: m.index, text: m[0], dir: m[1] || '', name: m[2] }
    : { at: m.index, text: m[0], folder: m[3] }));
}

// docs: a Set of repository paths ("docs/x.md", "README.md").
function index(docs) {
  const byName = new Map();
  for (const f of docs) {
    const b = path.posix.basename(f);
    byName.set(b, [...(byName.get(b) || []), f]);
  }
  return { docs, byName };
}

// The document a file mention means, or null. `last` is the folder last
// named on the line ("docs/modules/"), or ''.
function resolveFile(idx, file, dir, name, last) {
  const here = path.posix.dirname(file);
  if (dir) {
    const tries = [path.posix.normalize(path.posix.join(here, dir + name)), dir.startsWith('docs/') ? dir + name : `docs/${dir}${name}`, dir + name];
    return tries.find((c) => idx.docs.has(c)) || null;
  }
  // Nearest first; then a file at the root ("README.md" alone is the
  // repository's own), then the one document anywhere with the name.
  const near = [last && last + name, here === '.' ? name : `${here}/${name}`, name].find((c) => c && idx.docs.has(c));
  if (near) return near;
  const same = idx.byName.get(name) || [];
  return same.length === 1 ? same[0] : null;
}

// Several documents share the name, and nothing on the line says which.
function ambiguous(idx, file, name, last) {
  return (idx.byName.get(name) || []).length > 1 && !resolveFile(idx, file, '', name, last);
}

// A folder mention: { docs: 'docs/x/' } inside docs/, { other: 'tools/' }
// outside it, or null.
function resolveFolder(root, file, folder) {
  const isDir = (p) => {
    // FS-877: a folder's existence asked once a run, not once a mention.
    const abs = path.join(root, ...p.split('/'));
    if (!dirs.has(abs)) { let d = false; try { d = fs.statSync(abs).isDirectory(); } catch { /* none */ } dirs.set(abs, d); }
    return dirs.get(abs);
  };
  const here = path.posix.dirname(file);
  const inDocs = [path.posix.normalize(path.posix.join(here, folder)), folder.startsWith('docs/') ? folder : `docs/${folder}`]
    .map((p) => p.replace(/\/?$/, '/')).find((p) => p.startsWith('docs/') && isDir(p));
  if (inDocs) return { docs: inDocs };
  return isDir(folder) ? { other: folder } : null;
}

// The folder a resolved mention leaves "last" for the rest of the line.
const folderOf = (f) => (f.includes('/') ? `${path.posix.dirname(f)}/` : '');

module.exports = { mentions, index, resolveFile, resolveFolder, ambiguous, folderOf };
