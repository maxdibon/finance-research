#!/usr/bin/env node
// Generates build/site/: the repository as linked HTML pages, for reading
// in a browser (FS-563, FS-567, FS-627, FS-628).
//
//   node tools/site.js            the full checks must pass
//   node tools/site.js --reader   for reading a clone without the protected-names
//                                 list (FS-617): that one failure is excused, and
//                                 every page says so; any other failure still stops it
//
// The Markdown stays plain; links are made here, never typed there. Every
// id a table defines (a capability, a register row, a requirement, a law,
// a partner) becomes an anchor, and every mention of it anywhere becomes a
// link to that anchor. Each capability row lists where it is cited, and a
// journey, the customer register and each delivery map show each
// capability's status beside it, computed from the modules (FS-721). A plain docs/… path becomes a link, and so does a section
// reference ("approval-engine §9", "architecture.md §10", "(§4)"). Each page
// opens with what it relates to (from its front matter), what links to it,
// and, when long, its contents. ASCII diagrams are drawn with box lines,
// names in bold and failure branches marked; GitHub alerts become callouts.
// Like tools/assemble.js, it refuses to build while any check fails, and it
// lives in build/, which git ignores.

'use strict';

const fs = require('fs');
const path = require('path');
const { runAll, boxNames, githubAnchor } = require('./check');
const release = require('./release');
const paths = require('./paths');

// FS-856: a folder in docs/ opens at its README, or, with none, at a page
// listing its documents, built here.
const folderPage = (ctx, dir) => (ctx.docs.has(`${dir}README.md`) ? pageOf(`${dir}README.md`) : `${dir}index.html`);

const ID = '(?:OB-[A-Z]{2,3}-\\d{2}|[A-Z]{2}-\\d{2,3})';
const ID_CELL = new RegExp(`^${ID}$`);
const ID_TEXT = new RegExp(`\\b${ID}\\b`, 'g');
const STATUSES = ['Live', 'Built', 'Designed', 'Planned'];

// FS-866: REVIEW.md holds the open rows and review/ the closed; the reader
// reads the register as one, every row in id order, so each FS id has its
// anchor on the Review page and links from anywhere resolve.
function read(root, rel) {
  const text = fs.readFileSync(path.join(root, rel), 'utf8').replace(/\r\n/g, '\n');
  if (rel !== 'REVIEW.md') return text;
  const lines = text.split('\n');
  const at = lines.findIndex((l) => /^\| FS-\d{3} \|/.test(l));
  if (at < 0) return text;
  const rows = require('./register').rows(root).sort((a, b) => a.n - b.n).map((r) => r.text);
  return [...lines.slice(0, at), ...rows, ...lines.slice(at).filter((l) => !/^\| FS-\d{3} \|/.test(l))].join('\n');
}

function sources(root) {
  const out = ['README.md', 'CHANGELOG.md', 'HANDOFF.md', 'REVIEW.md'].filter((f) => fs.existsSync(path.join(root, f)));
  const walk = (rel) => {
    for (const e of fs.readdirSync(path.join(root, rel), { withFileTypes: true })) {
      const r = `${rel}/${e.name}`;
      if (e.isDirectory()) walk(r);
      else if (e.name.endsWith('.md')) out.push(r);
    }
  };
  walk('docs');
  return out;
}

const html = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pageOf = (rel) => rel.replace(/\.md$/, '.html');
function relHref(from, to) {
  const r = path.posix.relative(path.posix.dirname(from), to);
  return r || path.posix.basename(to);
}

function frontMatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  const fields = {};
  if (m) for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-z_]+): *(.*)$/);
    if (kv) fields[kv[1]] = kv[2].trim();
  }
  return { fields, body: m ? text.slice(m[0].length) : text };
}
const list = (v) => (v && /^\[.*\]$/.test(v) ? v.slice(1, -1).split(',').map((s) => s.trim()).filter(Boolean) : []);

const cells = (line) => line.split('|').slice(1, -1).map((c) => c.trim());

// A heading's anchor: "## 9 · Fineract" is s9, "### 2.5 Non-performing" is
// s2-5, so a section reference can find it; any other heading, its slug.
function anchorOf(text) {
  const n = text.match(/^(\d+)(?:\.(\d+))?(?: ·|\s)/);
  if (n) return n[2] ? `s${n[1]}-${n[2]}` : `s${n[1]}`;
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// First pass: where each id is defined, what each capability is, and what
// each document is called, anchors and points at.
function indexIds(root, files) {
  const defs = new Map();
  const caps = new Map();
  const docs = new Map();
  const ordered = [...files.filter((f) => f.startsWith('docs/modules/')), ...files.filter((f) => !f.startsWith('docs/modules/'))];
  for (const f of ordered) {
    const { fields, body } = frontMatter(read(root, f));
    const title = (body.match(/^# (.+)$/m) || [])[1] || fields.name || f;
    const anchors = new Set();
    const refs = new Set();
    let section = '';
    let fenced = false;
    for (const line of body.split('\n')) {
      if (line.startsWith('```')) fenced = !fenced;
      if (fenced) continue;
      const h = line.match(/^#{2,4} (.*)$/);
      if (h) anchors.add(anchorOf(h[1]));
      for (const m of line.matchAll(/\]\(([^)\s#]+\.md)(?:#[^)]*)?\)/g)) {
        if (!/^[a-z]+:/i.test(m[1])) refs.add(path.posix.normalize(path.posix.join(path.posix.dirname(f), m[1])));
      }
      for (const m of line.matchAll(/(?<![\w./-])(docs\/[\w./-]*\.md)\b/g)) refs.add(m[1]);
      if (/^## /.test(line)) section = line;
      if (!line.startsWith('|')) continue;
      const c = cells(line);
      if (!ID_CELL.test(c[0] || '') || defs.has(c[0])) continue;
      // A register row's second cell is its raiser; its point is the third.
      let target = { page: pageOf(f), anchor: c[0], text: (c[0].startsWith('FS-') ? c[2] : c[1]) || '' };
      // A journey's index row points at the journey itself.
      const link = c[0].startsWith('JN-') && (c[c.length - 1].match(/\]\(([^)]+\.md)\)/) || [])[1];
      if (link) target = { page: pageOf(path.posix.join(path.posix.dirname(f), link)), anchor: null, text: c[1] };
      defs.set(c[0], target);
      if (f.startsWith('docs/modules/') && /^## 3 · /.test(section) && STATUSES.includes(c[2])) {
        caps.set(c[0], { status: c[2], phase: c[c.length - 1], text: c[1] });
      }
    }
    refs.delete(f);
    docs.set(f, { fields, title, anchors, refs });
  }
  // The names a section reference may use: a document's id, and its file
  // name where that is unique.
  const keys = new Map();
  const seen = new Map();
  for (const f of docs.keys()) {
    const base = path.posix.basename(f, '.md');
    if (base !== 'README') seen.set(base, seen.has(base) ? null : f);
  }
  for (const [base, f] of seen) if (f) keys.set(base, f);
  for (const [f, d] of docs) if (d.fields.id && !keys.has(d.fields.id) && !/^[A-Z]/.test(d.fields.id)) keys.set(d.fields.id, f);
  return { defs, caps, docs, keys };
}

function sectionHref(ctx, file, n, m) {
  const d = ctx.docs.get(file);
  const want = m && d.anchors.has(`s${n}-${m}`) ? `s${n}-${m}` : `s${n}`;
  if (!d.anchors.has(want)) return null;
  return (file === ctx.file ? '' : relHref(ctx.page, pageOf(file))) + `#${want}`;
}

// Inline Markdown: code spans kept verbatim, then links, section references,
// paths, ids, emphasis.
function inline(text, ctx) {
  const parts = text.split(/(`[^`]*`)/);
  return parts.map((p) => {
    if (/^`[^`]*`$/.test(p)) return `<code>${html(p.slice(1, -1))}</code>`;
    const keep = [];
    const hold = (s) => { keep.push(s); return `\u0000${keep.length - 1}\u0000`; };
    let s = html(p).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
      let h = href.replace(/&amp;/g, '&');
      if (!/^[a-z]+:/i.test(h)) {
        const [file, hash] = h.split('#');
        const target = file ? path.posix.normalize(path.posix.join(path.posix.dirname(ctx.page), file)) : ctx.page;
        // FS-856: a document the reader has no page for (a template's
        // placeholder, a README in code/) reads as text, not a dead link.
        if (file.endsWith('.md') && !ctx.docs.has(target)) return hold(label);
        if (file.endsWith('.md')) h = pageOf(relHref(ctx.page, target.replace(/\.html$/, '.md'))) + (hash ? `#${hash}` : '');
        else if (file.endsWith('/') && fs.existsSync(path.join(ctx.root, path.posix.dirname(ctx.file), file, 'README.md'))) h = `${file}README.html`;
      }
      return hold(`<a href="${html(h)}">${label}</a>`);
    });
    // "approval-engine §9", "docs/architecture.md §10", "lender-rules §2.4"
    s = s.replace(/(?<![\w/-])((?:docs\/)?(?:[\w-]+\/)*)([\w-]+)(\.md)? §(\d+)(?:\.(\d+))?/g, (all, dir, name, md, n, m) => {
      const file = dir ? `${dir.startsWith('docs/') ? '' : 'docs/'}${dir}${name}.md`.replace(/^docs\/docs\//, 'docs/') : ctx.keys.get(name);
      const href = file && ctx.docs.has(file) && sectionHref(ctx, file, n, m);
      return href ? hold(`<a class="sec" href="${html(href)}">${all}</a>`) : all;
    });
    // "(§4)", "and §3 d": a section of this page, when no word comes before.
    s = s.replace(/(^|[^\w\s]\s*|^\s*)§(\d+)(?:\.(\d+))?/g, (all, pre, n, m) => {
      const href = sectionHref(ctx, ctx.file, n, m);
      return href ? `${pre}${hold(`<a class="sec" href="${href}">§${n}${m ? `.${m}` : ''}</a>`)}` : all;
    });
    // FS-856: every path written as plain text (tools/paths.js): a document
    // links to its page, a folder in docs/ to its README or listing, a
    // folder outside docs/ reads as code.
    if (ctx.pathIdx) {
      let last = '';
      let out = '';
      let pos = 0;
      for (const m of paths.mentions(s)) {
        out += s.slice(pos, m.at);
        pos = m.at + m.text.length;
        if (m.name) {
          const f = paths.resolveFile(ctx.pathIdx, ctx.file, m.dir, m.name, last);
          if (f) { last = paths.folderOf(f); out += hold(`<a href="${html(relHref(ctx.page, pageOf(f)))}">${m.text}</a>`); continue; }
        } else {
          const r = paths.resolveFolder(ctx.root, ctx.file, m.folder);
          if (r && r.docs && ctx.docFolders.has(r.docs)) { last = r.docs; out += hold(`<a href="${html(relHref(ctx.page, folderPage(ctx, r.docs)))}">${m.text}</a>`); continue; }
          if (r && r.other) { out += hold(`<code>${m.text}</code>`); continue; }
        }
        out += m.text;
      }
      s = out + s.slice(pos);
    }
    s = s.replace(ID_TEXT, (id) => {
      const d = ctx.defs.get(id);
      if (!d) return id;
      ctx.cite(id);
      if (ctx.self === id) return `<a class="self" href="#${id}">${id}</a>`;
      const href = relHref(ctx.page, d.page) + (d.anchor ? `#${d.anchor}` : '');
      const cap = ctx.caps.get(id);
      const title = cap ? `${cap.status} · phase ${cap.phase} · ${cap.text.slice(0, 120)}` : d.text.replace(/\*\*/g, '').slice(0, 140);
      const badge = cap && ctx.badges ? ` <span class="st st-${cap.status.toLowerCase()}">${cap.status}</span>` : '';
      return hold(`<a class="id" href="${html(href)}" title="${html(title)}">${id}</a>${badge}`);
    });
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
    for (let k = 0; k < 3 && /\u0000\d+\u0000/.test(s); k++) s = s.replace(/\u0000(\d+)\u0000/g, (_, n) => keep[+n]);
    return s;
  }).join('');
}

// ── diagrams (FS-628, FS-632) ────────────────────────────────────────────
// The ASCII stays the source; here it is drawn with box lines. Each
// character keeps its column, so the layout holds.
const VERT = new Set(['|', '+', 'v', '^', ':']);
const HORZ = new Set(['-', '+']);
function drawChar(g, r, c) {
  const ch = g[r][c];
  const at = (rr, cc) => (g[rr] && g[rr][cc]) || ' ';
  const word = (x) => /[A-Za-z0-9]/.test(x);
  if (ch === '+') {
    const u = VERT.has(at(r - 1, c)); const d = VERT.has(at(r + 1, c));
    const l = HORZ.has(at(r, c - 1)); const rt = HORZ.has(at(r, c + 1)) || at(r, c + 1) === '>';
    const k = `${u ? 'u' : ''}${d ? 'd' : ''}${l ? 'l' : ''}${rt ? 'r' : ''}`;
    return { dr: '┌', dl: '┐', ur: '└', ul: '┘', udr: '├', udl: '┤', dlr: '┬', ulr: '┴', udlr: '┼', lr: '─', ud: '│' }[k] || ch;
  }
  if (ch === '-') {
    const l = at(r, c - 1); const rt = at(r, c + 1);
    return ['-', '+', '|', '<'].includes(l) || ['-', '+', '>', '|'].includes(rt) ? '─' : ch;
  }
  if (ch === '|') return at(r, c + 1) === '-' && at(r, c + 2) === '-' ? '├' : '│';
  if (ch === 'v' && !word(at(r, c - 1)) && !word(at(r, c + 1)) && (['|', '+'].includes(at(r - 1, c)) || g[r].join('').trim() === 'v')) return '▼';
  if (ch === '^' && !word(at(r, c - 1)) && !word(at(r, c + 1)) && ['|', '+'].includes(at(r + 1, c))) return '▲';
  if (ch === '>' && at(r, c - 1) === '-') return '►';
  if (ch === '<' && at(r, c + 1) === '-') return '◄';
  return ch;
}

function diagram(src, ctx) {
  const lines = src.split('\n');
  const g = lines.map((l) => [...l]);
  const cls = lines.map((l) => new Array([...l].length).fill(''));
  for (const b of boxNames(src)) {
    const row = lines[b.row] || '';
    const start = row.indexOf(b.name, b.from);
    if (start >= 0) for (let c = start; c < start + b.name.length; c++) cls[b.row][c] = 'bn';
  }
  lines.forEach((l, r) => {
    for (const m of l.matchAll(/\[[a-z_][a-z_, ]*\]/g)) for (let c = m.index; c < m.index + m[0].length; c++) cls[r][c] = 'tg';
    // A journey's failure branch ("|-- ... (3a)"); not an arrow in a sequence.
    const br = ctx.journey && l.match(/^(\s*)\|--/);
    if (br) for (let c = br[1].length + 3; c < l.length; c++) if (!cls[r][c]) cls[r][c] = 'br';
  });
  const out = lines.map((l, r) => {
    let s = '';
    let cur = null;
    let buf = '';
    const flush = () => {
      if (!buf) return;
      let t = html(buf).replace(ID_TEXT, (id) => {
        const d = ctx.defs.get(id);
        if (!d) return id;
        ctx.cite(id);
        return `<a class="id" href="${html(relHref(ctx.page, d.page) + (d.anchor ? `#${d.anchor}` : ''))}">${id}</a>`;
      }).replace(/\(3([a-z])\)/g, (all, x) => (ctx.rows.has(`r3${x}`) ? `(<a href="#r3${x}">3${x}</a>)` : all));
      if (cur) t = `<span class="${cur}">${t}</span>`;
      s += t;
      buf = '';
    };
    g[r].forEach((_, c) => {
      const k = cls[r][c];
      if (k !== cur) { flush(); cur = k; }
      buf += drawChar(g, r, c);
    });
    flush();
    return s;
  });
  return `<pre class="diagram">${out.join('\n')}</pre>`;
}

// Block Markdown: the subset these documents use.
function render(body, ctx) {
  const out = [];
  const lines = body.replace(/<!--[\s\S]*?-->/g, '').split('\n');
  let i = 0;
  let section = '';
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const buf = [];
      for (i++; i < lines.length && !lines[i].startsWith('```'); i++) buf.push(lines[i]);
      i++;
      out.push(lang ? `<pre>${html(buf.join('\n'))}</pre>` : diagram(buf.join('\n'), ctx));
      continue;
    }
    const h = line.match(/^(#{1,4}) (.*)$/);
    if (h) {
      const n = h[1].length;
      if (n === 2) section = h[2];
      // Our anchor (s9) for section references, and GitHub's, so a link
      // written for GitHub works here too (FS-641).
      const gh = githubAnchor(h[2]);
      const own = anchorOf(h[2]);
      out.push(`<h${n} id="${own}">${gh !== own ? `<span id="${html(gh)}"></span>` : ''}${inline(h[2], ctx)}</h${n}>`);
      i++;
      continue;
    }
    if (line.startsWith('>')) {
      const buf = [];
      for (; i < lines.length && lines[i].startsWith('>'); i++) buf.push(lines[i].replace(/^> ?/, ''));
      const alert = (buf[0] || '').match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*$/);
      // A quote keeps its own paragraphs, lists and emphasis: the outreach
      // letters are quotes, copied from this page into an email (FS-733).
      const inner = render((alert ? buf.slice(1) : buf).join('\n'), ctx);
      out.push(alert ? `<div class="alert alert-${alert[1].toLowerCase()}"><b>${alert[1][0]}${alert[1].slice(1).toLowerCase()}</b>${inner}</div>` : `<blockquote>${inner}</blockquote>`);
      continue;
    }
    // FS-863: a table indented under a list item ("- **Roles:**", a blank
    // line, then "  | … |") is a table too, as on GitHub, when its second
    // line is the separator row; it was read as one paragraph of pipes.
    const indentedTable = /^\s+\|/.test(line) && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1] || '');
    if (line.startsWith('|') || indentedTable) {
      const rows = [];
      for (; i < lines.length && /^\s*\|/.test(lines[i]) && (line.startsWith('|') ? lines[i].startsWith('|') : true); i++) rows.push(lines[i].trim());
      const head = cells(rows[0]);
      const body2 = rows.slice(rows[1] && /^\|[\s:|-]+\|$/.test(rows[1]) ? 2 : 1);
      const journeyRows = ctx.journey && /^3 · /.test(section);
      const tr = body2.map((r) => {
        const c = cells(r);
        const id = ID_CELL.test(c[0] || '') && ctx.defs.get(c[0]) && ctx.defs.get(c[0]).page === ctx.page && ctx.defs.get(c[0]).anchor === c[0] ? c[0] : null;
        const rowId = id || (journeyRows && /^[a-z]$/.test(c[0] || '') ? `r3${c[0]}` : null);
        ctx.row = id;
        ctx.self = id;
        const tds = c.map((x) => `<td>${inline(x, ctx)}</td>`);
        ctx.self = null;
        if (id && ctx.caps.has(id)) tds[0] = tds[0].replace('</td>', `<!--CITED:${id}--></td>`);
        ctx.row = null;
        return `<tr${rowId ? ` id="${rowId}"` : ''}>${tds.join('')}</tr>`;
      });
      out.push(`<div class="tw"><table><thead><tr>${head.map((x) => `<th>${inline(x, ctx)}</th>`).join('')}</tr></thead><tbody>${tr.join('')}</tbody></table></div>`);
      continue;
    }
    if (/^\s*(-|\d+\.) /.test(line)) {
      const ordered = /^\s*\d+\. /.test(line);
      const items = [];
      for (; i < lines.length && (/^\s*(-|\d+\.) /.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length)); i++) {
        if (/^\s*(-|\d+\.) /.test(lines[i])) items.push(lines[i].replace(/^\s*(-|\d+\.) /, ''));
        else items[items.length - 1] += ` ${lines[i].trim()}`;
      }
      const tag = ordered ? 'ol' : 'ul';
      out.push(`<${tag}>${items.map((x) => `<li>${inline(x, ctx)}</li>`).join('')}</${tag}>`);
      continue;
    }
    if (!line.trim()) { i++; continue; }
    // A rule between sections.
    if (/^-{3,}\s*$/.test(line)) { out.push('<hr>'); i++; continue; }
    const para = [];
    for (; i < lines.length && lines[i].trim() && !/^(#{1,4} |\||```|>|\s*(-|\d+\.) )/.test(lines[i]) && !/^-{3,}\s*$/.test(lines[i]); i++) para.push(lines[i].trim());
    // A line ending in a backslash breaks there, as in CommonMark, so a
    // letter's sign-off keeps its lines (FS-733).
    if (para.length) {
      out.push(`<p>${para.map((l, k) => (l.endsWith('\\')
        ? `${inline(l.slice(0, -1), ctx)}<br>`
        : inline(l, ctx) + (k < para.length - 1 ? ' ' : ''))).join('')}</p>`);
    }
    else i++;
  }
  return out.join('\n');
}

// What a page relates to, from its front matter; what links to it; and,
// for a long page, its contents (FS-627).
function related(f, idx, page) {
  const d = idx.docs.get(f);
  const link = (target, label) => `<a href="${html(relHref(page, pageOf(target)))}">${html(label)}</a>`;
  const mod = (id) => `docs/modules/${id}.md`;
  const spec = (id) => `docs/specs/${id}.md`;
  const groups = [];
  const add = (label, files) => {
    const ok = files.filter((x) => idx.docs.has(x));
    if (ok.length) groups.push(`<span><b>${label}:</b> ${ok.map((x) => link(x, path.posix.basename(x, '.md'))).join(', ')}</span>`);
  };
  if (f.startsWith('docs/modules/')) {
    add('Depends on', list(d.fields.depends_on).map(mod));
    add('Used by', list(d.fields.consumed_by).map(mod));
    const id = path.posix.basename(f, '.md');
    add('Specs', [...idx.docs].filter(([x, o]) => x.startsWith('docs/specs/') && list(o.fields.implements).includes(id)).map(([x]) => x));
  }
  if (f.startsWith('docs/specs/') && d.fields.kind === 'spec') {
    add('Implements', list(d.fields.implements).map(mod));
    add('Depends on', list(d.fields.depends_on).map(spec));
    add('Used by', list(d.fields.used_by).map(spec));
  }
  const back = [...idx.docs].filter(([x, o]) => x !== f && o.refs.has(f)).map(([x, o]) => ({ x, t: o.title }));
  const parts = [];
  if (groups.length) parts.push(`<nav class="rel">${groups.join('')}</nav>`);
  if (back.length) {
    parts.push(`<details class="back"><summary>Linked from ${back.length} document${back.length > 1 ? 's' : ''}</summary>${back.map((b) => link(b.x, b.t)).join(' · ')}</details>`);
  }
  return parts.join('');
}

// FS-844: a contents list where a reader needs one: five sections or
// more on a page of 600 words or more, or 1,000 words or more in at
// least two; subsections nested. A short page needs none.
function contents(body) {
  const hs = [];
  let fenced = false;
  for (const line of body.replace(/<!--[\s\S]*?-->/g, '').split('\n')) {
    if (line.startsWith('```')) fenced = !fenced;
    const h = !fenced && line.match(/^(##|###) (.*)$/);
    if (h) hs.push({ level: h[1].length, text: h[2] });
  }
  const sections = hs.filter((h) => h.level === 2).length;
  const words = body.split(/\s+/).length;
  if (words < 600 || (sections < 5 && !(sections >= 2 && words >= 1000))) return '';
  return `<nav class="toc"><b>Contents</b>${hs.map((h) => `<a${h.level === 3 ? ' class="sub"' : ''} href="#${anchorOf(h.text)}">${html(h.text.replace(/[`*]/g, ''))}</a>`).join('')}</nav>`;
}

// The file's path, each folder with an index linked to it.
function crumbs(root, f, page) {
  const parts = f.split('/');
  return parts.map((p, k) => {
    if (k === parts.length - 1) return html(p);
    const dir = parts.slice(0, k + 1).join('/');
    const index = dir === 'docs' ? 'docs/overview.md' : `${dir}/README.md`;
    return fs.existsSync(path.join(root, index)) && index !== f ? `<a href="${html(relHref(page, pageOf(index)))}">${html(p)}</a>` : html(p);
  }).join('/');
}

const STYLE = `
:root{--bg:#fbfaf7;--fg:#1f1d1a;--muted:#6b665e;--line:#e4e0d8;--accent:#460d4d;--link:#5a2a8a;--code:#f1eee8;--card:#f5f2ec;
--planned:#8a6d1f;--planned-bg:#f6edd3;--designed:#1f5d8a;--designed-bg:#dcebf6;--built:#2e6b34;--built-bg:#dcefdc;--live:#1d5a3a;--live-bg:#cdeedb;
--note:#1f5d8a;--warn:#8a6d1f;--caution:#9a2b2b}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#171513;--fg:#ebe7e0;--muted:#a49d92;--line:#33302b;--accent:#d9a5e0;--link:#c6a4f0;--code:#24211d;--card:#1f1c19;
--planned:#e8c873;--planned-bg:#3a3020;--designed:#8cc4ef;--designed-bg:#1c2f3e;--built:#92d39a;--built-bg:#1f3322;--live:#7fdcaa;--live-bg:#173426;
--note:#8cc4ef;--warn:#e8c873;--caution:#f0a0a0}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif}
header{position:sticky;top:0;z-index:2;background:var(--bg);border-bottom:1px solid var(--line);padding:10px 16px;display:flex;gap:14px;flex-wrap:wrap;align-items:center}header .rel{margin-left:auto;font-size:12px;color:var(--muted)}
header b{color:var(--accent)}header a{color:var(--fg);text-decoration:none;font-size:14px}header a:hover{color:var(--link)}
main{max-width:1180px;margin:0 auto;padding:16px}a{color:var(--link)}a.id{text-decoration:none;font-weight:600;white-space:nowrap}a.id:hover{text-decoration:underline}
a.self{color:var(--accent);text-decoration:none;font-weight:700;white-space:nowrap}a.sec{white-space:nowrap}
html{scroll-padding-top:64px}td:first-child{min-width:5.5em}
.toc a.sub{padding-left:14px;font-size:12px}.meta{color:var(--muted);font-size:13px;margin:0 0 8px}.meta a{color:var(--muted)}.tw{overflow-x:auto;margin:12px 0}
table{border-collapse:collapse;font-size:14px;min-width:100%}th,td{border:1px solid var(--line);padding:6px 8px;vertical-align:top;text-align:left}
th{background:var(--code)}tr:target{outline:2px solid var(--accent);background:var(--code)}
pre{background:var(--code);padding:12px;overflow-x:auto;font:13px/1.4 ui-monospace,Consolas,monospace}code{background:var(--code);padding:0 3px;font:13px ui-monospace,Consolas,monospace}
pre.diagram{background:var(--card);border:1px solid var(--line);border-radius:6px;line-height:1.18;padding:14px 16px;font-family:"Cascadia Mono",Consolas,ui-monospace,monospace}
pre.diagram .bn{font-weight:700;color:var(--accent)}pre.diagram .tg{color:var(--muted)}pre.diagram .br{color:var(--warn)}pre.diagram a{text-decoration:none}
.st{font-size:11px;padding:0 5px;border-radius:3px;white-space:nowrap}.st-planned{color:var(--planned);background:var(--planned-bg)}
.st-designed{color:var(--designed);background:var(--designed-bg)}.st-doc-draft{color:var(--planned);background:var(--planned-bg)}.st-doc-agreed,.st-doc-sent,.st-doc-active{color:var(--built);background:var(--built-bg)}.st-doc-living{color:var(--muted);border:1px solid var(--muted)}.st-built{color:var(--built);background:var(--built-bg)}.st-live{color:var(--live);background:var(--live-bg)}
details{font-size:12px;color:var(--muted);margin-top:4px}details a{font-size:12px}
nav.rel{display:flex;flex-wrap:wrap;gap:6px 18px;font-size:13px;padding:8px 12px;background:var(--card);border:1px solid var(--line);border-radius:6px;margin:8px 0}
nav.rel b{color:var(--muted);font-weight:600}details.back{margin:4px 0 8px}
a.hist{text-decoration:none}details.history{font-size:13px;margin:6px 0}details.history summary{cursor:pointer;color:var(--text,inherit);font-weight:600}details.history ul{margin:4px 0 8px;padding-left:20px}details.history li{margin:2px 0}details.history a{font-size:13px}
nav.toc{font-size:13px;margin:8px 0 16px;display:flex;flex-wrap:wrap;gap:4px 14px}nav.toc b{color:var(--muted);font-weight:600;margin-right:4px}nav.toc a{text-decoration:none}
.alert{border-left:4px solid var(--note);background:var(--card);padding:8px 12px;margin:12px 0;border-radius:0 6px 6px 0}.alert b{color:var(--note)}.alert p{margin:4px 0 0}
.alert-warning,.alert-important{border-color:var(--warn)}.alert-warning b,.alert-important b{color:var(--warn)}.alert-caution{border-color:var(--caution)}.alert-caution b{color:var(--caution)}
blockquote{border-left:3px solid var(--line);margin:12px 0;padding:2px 14px}blockquote>p:first-child{margin-top:6px}
#q{width:100%;max-width:520px;padding:8px 10px;font-size:15px;border:1px solid var(--line);background:var(--bg);color:var(--fg);border-radius:4px}
#hits div{padding:4px 0;border-bottom:1px solid var(--line)}
.reader{margin:0;padding:6px 16px;background:var(--planned-bg);color:var(--planned);font-size:13px}#hits small{color:var(--muted)}
@media (max-width:640px){main{padding:12px 16px}table{font-size:13px}}
`;

const NAV = [['index.html', 'Search'], ['README.html', 'README'], ['docs/start-here.html', 'Start here'], ['docs/overview.html', 'Overview'],
  ['docs/journeys/README.html', 'Journeys'], ['docs/specs/README.html', 'Specs'], ['docs/customers/roan-capital.html', 'Roan Capital'],
  ['docs/delivery-plan.html', 'Delivery plan'], ['REVIEW.html', 'Review'], ['HANDOFF.html', 'Handoff']];

// FS-853: a document's history at its foot, from git and never written by
// hand: the commits that changed its content, newest first, grouped by the
// release each went into, the newest group open. The first dated release
// holds all the work before it.
function historyHtml(list, page, first) {
  if (!list || !list.length) return '';
  const groups = [];
  for (const c of list) {
    const k = c.release || '';
    if (!groups.length || groups[groups.length - 1].k !== k) groups.push({ k, cs: [] });
    groups[groups.length - 1].cs.push(c);
  }
  const review = relHref(page, 'REVIEW.html');
  const subject = (s) => html(s).replace(/\b[A-Z]{2}-\d{2,3}\b/g, (id) => (id.startsWith('FS-') ? `<a href="${review}#${id}">${id}</a>` : id));
  const label = (k) => (!k ? 'Not yet released' : k === first ? `${k}, the first dated release, with all the work before it` : `Release ${k}`);
  const body = groups.map((g, i) => `<details class="history"${i === 0 ? ' open' : ''}><summary>${html(label(g.k))} (${g.cs.length} change${g.cs.length === 1 ? '' : 's'})</summary><ul>${g.cs.map((c) => `<li><code>${c.hash}</code> ${c.date} · ${subject(c.subject)}</li>`).join('')}</ul></details>`).join('');
  return `<h2 id="doc-history">History</h2><p class="meta">From git: each change to this document's content, newest first, by the release it went into. A change to its status, dates or release line alone is left out. Outside the reader: <code>dibon history ${html(page.replace(/\.html$/, '.md'))}</code>.</p>${body}`;
}

// FS-842: the release every page was built from, set once per build.
let RELEASE = '';
function shell(title, page, content, note = '') {
  const links = NAV.map(([p, t]) => `<a href="${relHref(page, p)}">${t}</a>`).join('');
  const rel = RELEASE ? `<a class="rel" href="${relHref(page, 'unreleased.html')}">${html(RELEASE)}</a>` : '';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${html(title)}</title><style>${STYLE}</style></head><body><header><b>Dibon FS</b>${links}${rel}</header>${note ? `<p class="reader">${note}</p>` : ''}<main>${content}</main></body></html>\n`;
}

// The one failure a reader may skip: the protected-names list, which is never
// in git, so a fresh clone cannot run that check. Reading locally cannot leak
// what the check guards; committing still needs it (FS-617).
const NAMES_MISSING = (f) => f.check === 'names' && /protected-names list missing/.test(f.message);
const READER_NOTE = 'Built for reading, without the protected-names check: this clone has no list. Commits still need the full checks.';

// The register stays one table in id order, its record; the Review page
// leads with the open rows by criticality, then the register (FS-779).
const CRITICALITY_ORDER = ['Critical', 'High', 'Medium', 'Low'];

function reviewBody(body) {
  const lines = body.split('\n');
  const at = lines.findIndex((l) => /^\| Id \| Raised by \| Point \| Status \| Criticality \| Notes \|$/.test(l));
  if (at < 0) return body;
  const rows = lines.filter((l) => /^\| FS-\d{3} \|/.test(l)).map((l) => l.split('|').slice(1, -1).map((s) => s.trim()));
  const open = rows.filter((c) => c[3] === 'OPEN')
    .sort((a, b) => CRITICALITY_ORDER.indexOf(a[4]) - CRITICALITY_ORDER.indexOf(b[4]) || a[0].localeCompare(b[0]));
  const tally = (list, i) => list.reduce((m, c) => { m[c[i]] = (m[c[i]] || 0) + 1; return m; }, {});
  const byCrit = tally(open, 4);
  const byStatus = tally(rows.filter((c) => c[3] !== 'OPEN'), 3);
  const summary = [
    '## Open, by criticality',
    '',
    `${open.length} open: ${CRITICALITY_ORDER.map((k) => `${byCrit[k] || 0} ${k}`).join(', ')}. Closed: ${Object.entries(byStatus).map(([k, n]) => `${n} ${k.toLowerCase()}`).join(', ')}.`,
    '',
    // FS-844: a subsection per criticality, and the register by the
    // hundred, so the contents list gives real jump points.
    ...CRITICALITY_ORDER.filter((k) => byCrit[k]).flatMap((k) => [`### ${k} (${byCrit[k]})`, '', '| Id | Point |', '|---|---|', ...open.filter((c) => c[4] === k).map((c) => `| ${c[0]} | ${c[2]} |`), '']),
    '## The register, in id order',
    '',
  ];
  const end = at + 2 + lines.slice(at + 2).findIndex((l) => !/^\| FS-\d{3} \|/.test(l));
  const table = lines.slice(at + 2, end < at + 2 ? lines.length : end);
  const hundreds = [...new Set(table.map((l) => Math.floor(+l.slice(5, 8) / 100)))];
  const grouped = hundreds.flatMap((h) => [`### FS-${String(Math.max(1, h * 100)).padStart(3, '0')} to FS-${String(h * 100 + 99).padStart(3, '0')}`, '', lines[at], lines[at + 1], ...table.filter((l) => Math.floor(+l.slice(5, 8) / 100) === h), '']);
  return [...lines.slice(0, at), ...summary, ...grouped, ...lines.slice(end < at + 2 ? lines.length : end)].join('\n');
}

function build(root, outDir = path.join(root, 'build', 'site'), opts = {}) {
  const all = runAll(root);
  const excused = opts.reader ? all.filter(NAMES_MISSING) : [];
  const failures = all.filter((f) => !excused.includes(f));
  const note = excused.length ? READER_NOTE : '';
  if (failures.length) {
    const err = new Error(`checks failing (${failures.length}); the site is not built from failing sources`);
    err.failures = failures;
    throw err;
  }
  const files = sources(root);
  const rel = release.info(root);
  RELEASE = release.line(rel);
  const hist = release.histories(root);
  const pathIdx = paths.index(new Set(files));
  // FS-856: the folders in docs/ that hold documents, each with a page.
  const docFolders = new Set(files.filter((f) => f.startsWith('docs/')).flatMap((f) => {
    const parts = f.split('/').slice(0, -1);
    return parts.map((_, i) => `${parts.slice(0, i + 1).join('/')}/`);
  }));
  const firstRelease = [...hist.values()].flat().map((c) => c.release).filter(Boolean).sort(release.byVersion)[0];
  const idx = indexIds(root, files);
  const { defs, caps } = idx;
  const cited = new Map();
  const pages = [];
  for (const f of files) {
    const fm = frontMatter(read(root, f));
    const { fields } = fm;
    const body = f === 'REVIEW.md' ? reviewBody(fm.body) : fm.body;
    const page = pageOf(f);
    const journey =f.startsWith('docs/journeys/') && !f.endsWith('README.md');
    const rows = new Set();
    if (journey) {
      let sec = '';
      for (const line of body.split('\n')) {
        if (/^## /.test(line)) sec = line;
        const c = line.startsWith('|') ? cells(line) : [];
        if (/^## 3 · /.test(sec) && /^[a-z]$/.test(c[0] || '')) rows.add(`r3${c[0]}`);
      }
    }
    const ctx = {
      root, file: f, page, defs, caps, docs: idx.docs, keys: idx.keys, pathIdx, docFolders, self: null, row: null, badges: f.startsWith('docs/journeys/') || f === 'docs/customers.md' || f.startsWith('docs/customers/'),
      journey, rows,
      cite(id) {
        if (this.self === id) return;
        if (!cited.has(id)) cited.set(id, new Map());
        const where = this.row ? `${page}#${this.row}` : page;
        cited.get(id).set(where, this.row ? `${this.row}` : (fields.name || f));
      },
    };
    const title = idx.docs.get(f).title;
    const meta = Object.entries(fields).filter(([k]) => ['kind', 'type', 'release', 'owner', 'version', 'last_reviewed', 'review_ids'].includes(k))
      .map(([k, v]) => `${k.replace('_', ' ')}: ${inline(v.replace(/^\[|\]$/g, ''), ctx)}`).join(' · ');
    // FS-839: each document's status leads its header, as a badge.
    const st = fields.status ? `<span class="st st-doc-${html(fields.status)}">${html(fields.status)}</span> ` : '';
    // FS-842, FS-852: the release this document's content was last released
    // in, and whether it has changed since; a customer's page names its own.
    const stamp = fields.released;
    const since = rel.tag && rel.changed.has(f);
    const badge = stamp
      ? `<span class="st st-doc-${since || stamp === 'unreleased' ? 'draft' : 'agreed'}">${stamp === 'unreleased' ? 'unreleased' : `released ${html(stamp)}${since ? ' · changed since' : ''}`}</span>`
      : since ? `<span class="st st-doc-draft">changed since ${html(rel.tag.slice(5))}</span>` : '';
    // FS-853: the badge opens the page's history.
    const moved = badge ? `${hist.has(f) ? `<a class="hist" href="#doc-history" title="This document's history">${badge}</a>` : badge} ` : '';
    const delivery = f.startsWith('docs/customers/') && !f.includes('/_') ? release.customerRelease(read(root, f)) : null;
    const own = delivery ? `<span class="st st-doc-agreed">delivery ${html(delivery)}</span> ` : '';
    const head = `<p class="meta">${st}${moved}${own}${crumbs(root, f, page)}${meta ? ` · ${meta}` : ''}</p>`;
    const content = head + related(f, idx, page) + contents(body) + render(body, ctx) + historyHtml(hist.get(f), page, firstRelease);
    pages.push({ f, page, title, content });
  }
  // Emptied, not removed: a preview server may be serving from it, and
  // Windows will not delete a folder that a process has open.
  fs.mkdirSync(outDir, { recursive: true });
  for (const e of fs.readdirSync(outDir)) fs.rmSync(path.join(outDir, e), { recursive: true, force: true });
  for (const p of pages) {
    const content = p.content.replace(/<!--CITED:([A-Z]{2}-\d{2})-->/g, (_, id) => {
      const where = [...(cited.get(id) || new Map())];
      if (!where.length) return '<details><summary>cited nowhere</summary></details>';
      const links = where.map(([href, label]) => `<a href="${relHref(p.page, href.split('#')[0])}${href.includes('#') ? `#${href.split('#')[1]}` : ''}">${html(label)}</a>`);
      return `<details><summary>cited ${where.length}×</summary>${links.join(', ')}</details>`;
    });
    const out = path.join(outDir, p.page);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, shell(p.title, p.page, content, note));
  }
  const entries = [...defs].map(([id, d]) => {
    const cap = caps.get(id);
    return { id, t: d.text.replace(/\*\*|`/g, '').slice(0, 160), h: d.page + (d.anchor ? `#${d.anchor}` : ''), s: cap ? cap.status : '' };
  }).concat(pages.map((p) => ({ id: '', t: p.title, h: p.page, s: p.f })));
  const search = `<h1>Dibon financial services</h1><p class="meta">Generated ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC from ${pages.length} documents and ${defs.size} ids. Type an id (MF-01, FS-548, RC-43, JN-02) or words. <a href="status.html">Documents by status</a> · <a href="CHANGELOG.html">Changelog</a>.</p>
<input id="q" autofocus placeholder="Search ids and titles"><div id="hits"></div>
<script>const E=${JSON.stringify(entries).replace(/</g, '\\u003c')};const q=document.getElementById('q'),h=document.getElementById('hits');
function show(){const v=q.value.trim().toLowerCase();if(!v){h.innerHTML='';return}const r=E.filter(e=>(e.id+' '+e.t).toLowerCase().includes(v)).slice(0,60);
h.innerHTML=r.map(e=>'<div><a href="'+e.h+'">'+(e.id||'page')+'</a> '+(e.s?'<small>'+e.s+'</small> ':'')+e.t.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</div>').join('')||'<div>No match</div>'}
q.addEventListener('input',show);</script>`;
  fs.writeFileSync(path.join(outDir, 'index.html'), shell('Dibon financial services', 'index.html', search, note));
  // FS-839: every document that is not living, by status, so a version's
  // drafts are one page away.
  const byStatus = new Map();
  for (const p of pages) {
    const fields = frontMatter(read(root, p.f)).fields;
    if (!fields.status || fields.status === 'living' || p.f.includes('/_')) continue;
    if (!byStatus.has(fields.status)) byStatus.set(fields.status, []);
    byStatus.get(fields.status).push(`<li><a href="${p.page}">${html(p.title)}</a> <small>${html(fields.kind || '')}</small></li>`);
  }
  const order = ['draft', 'awaiting-approval', 'awaiting-cbk', 'sent', 'answered', 'agreed', 'validated', 'building', 'built', 'tested', 'active', 'superseded', 'withdrawn', 'retired'];
  const sts = [...byStatus.keys()].sort((a, b) => (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99));
  const statusPage = `<h1>Documents by status</h1><p class="meta">Every document that is not a living register or index, by its status (FS-839). Versions are in <a href="CHANGELOG.html">the changelog</a>.</p>${sts.map((s) => `<h2>${html(s)} (${byStatus.get(s).length})</h2><ul>${byStatus.get(s).join('')}</ul>`).join('')}`;
  fs.writeFileSync(path.join(outDir, 'status.html'), shell('Documents by status', 'status.html', statusPage, note));
  // FS-856: a page for each folder in docs/ with no README, listing what it
  // holds, so a folder named in a document opens somewhere useful.
  const folders = [...docFolders].filter((d) => !idx.docs.has(`${d}README.md`));
  for (const dir of folders) {
    const page = `${dir}index.html`;
    const inside = files.filter((f) => f.startsWith(dir) && !f.slice(dir.length).includes('/')).sort();
    const subs = [...new Set(files.filter((f) => f.startsWith(dir) && f.slice(dir.length).includes('/')).map((f) => `${dir}${f.slice(dir.length).split('/')[0]}/`))].sort();
    const row = (f) => {
      const { fields } = frontMatter(read(root, f));
      return `<tr><td><a href="${html(relHref(page, pageOf(f)))}">${html(idx.docs.get(f).title)}</a></td><td>${html(fields.kind || '')}</td><td>${html(fields.status || '')}</td><td>${html(fields.released || '')}</td></tr>`;
    };
    const body = `<h1>${html(dir)}</h1><p class="meta">A folder with no README of its own: what it holds, from each document's front matter (FS-856).</p>`
      + (inside.length ? `<table><thead><tr><th>Document</th><th>Kind</th><th>Status</th><th>Released</th></tr></thead><tbody>${inside.map(row).join('')}</tbody></table>` : '')
      + (subs.length ? `<h2>Folders</h2><ul>${subs.map((d) => `<li><a href="${html(relHref(page, folderPage({ docs: idx.docs }, d)))}">${html(d)}</a></li>`).join('')}</ul>` : '');
    fs.mkdirSync(path.join(outDir, dir), { recursive: true });
    fs.writeFileSync(path.join(outDir, page), shell(dir, page, body, note));
  }
  // FS-842, FS-845: what has changed since the release, and the change
  // notes waiting for the next one, so the team sees updates as they land.
  const waiting = rel.notes.filter((n) => !n.released.includes('docs'));
  const forCustomer = rel.notes.filter((n) => n.released.includes('docs'));
  const noteRow = (n) => `<li><b>${html(n.kind)}</b> · for ${html(n.for)} · ${html(n.by)} · ${html(n.rows)}<br>${html(n.text)}</li>`;
  const changedPages = [...rel.changed].filter((f) => f.endsWith('.md')).sort();
  const unreleased = `<h1>Unreleased</h1><p class="meta">${html(RELEASE)}. Releases are in <a href="CHANGELOG.html">the changelog</a>; how to write a change note is in changes/README.md.</p>`
    + `<h2>Change notes waiting for the next release (${waiting.length})</h2>${waiting.length ? `<ul>${waiting.map(noteRow).join('')}</ul>` : '<p>None.</p>'}`
    + (forCustomer.length ? `<h2>Released in the documentation, waiting for their customer's release (${forCustomer.length})</h2><ul>${forCustomer.map(noteRow).join('')}</ul>` : '')
    + `<h2>Documents changed since ${html(rel.tag ? rel.tag.slice(5) : 'the release')} (${changedPages.length})</h2>${changedPages.length ? `<ul>${changedPages.map((f) => `<li>${idx.docs.has(f) ? `<a href="${pageOf(f)}">${html(f)}</a>` : html(f)}</li>`).join('')}</ul>` : '<p>None.</p>'}`;
  fs.writeFileSync(path.join(outDir, 'unreleased.html'), shell('Unreleased', 'unreleased.html', unreleased, note));
  return { outDir, pages: pages.length, ids: defs.size, reader: Boolean(note) };
}

module.exports = { build };

if (require.main === module) {
  const root = path.join(__dirname, '..');
  try {
    const { outDir, pages, ids, reader } = build(root, undefined, { reader: process.argv.includes('--reader') });
    if (reader) console.log('built for reading: the protected-names list is missing, so that check was skipped');
    console.log(`built ${path.relative(root, outDir)}/index.html: ${pages} pages, ${ids} ids linked`);
  } catch (e) {
    for (const f of e.failures || []) console.log(`FAIL ${f.check}  ${f.file}${f.line ? `:${f.line}` : ''}  ${f.message}`);
    console.log(e.message);
    process.exit(1);
  }
}
