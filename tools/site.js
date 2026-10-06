#!/usr/bin/env node
// Generates build/site/: the repository as linked HTML pages, for reading
// in a browser (FS-563, FS-567).
//
//   node tools/site.js
//
// The Markdown stays plain; links are made here, never typed there. Every
// id a table defines (a capability, a register row, a requirement, a law,
// a partner) becomes an anchor, and every mention of it anywhere becomes a
// link to that anchor. Each capability row lists where it is cited, and a
// journey shows each capability's status beside it, computed from the
// modules. Like tools/assemble.js, it refuses to build while any check
// fails, and it lives in build/, which git ignores.

'use strict';

const fs = require('fs');
const path = require('path');
const { runAll } = require('./check');

const ID = '(?:OB-[A-Z]{2,3}-\\d{2}|[A-Z]{2}-\\d{2,3})';
const ID_CELL = new RegExp(`^${ID}$`);
const ID_TEXT = new RegExp(`\\b${ID}\\b`, 'g');
const STATUSES = ['Live', 'Built', 'Designed', 'Planned'];

function read(root, rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/\r\n/g, '\n');
}

function sources(root) {
  const out = ['README.md', 'HANDOFF.md', 'REVIEW.md'].filter((f) => fs.existsSync(path.join(root, f)));
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

const cells = (line) => line.split('|').slice(1, -1).map((c) => c.trim());

// First pass: where each id is defined, and what each capability is.
function indexIds(root, files) {
  const defs = new Map();
  const caps = new Map();
  const ordered = [...files.filter((f) => f.startsWith('docs/modules/')), ...files.filter((f) => !f.startsWith('docs/modules/'))];
  for (const f of ordered) {
    const { body } = frontMatter(read(root, f));
    let section = '';
    let fenced = false;
    for (const line of body.split('\n')) {
      if (line.startsWith('```')) fenced = !fenced;
      if (fenced) continue;
      if (/^## /.test(line)) section = line;
      if (!line.startsWith('|')) continue;
      const c = cells(line);
      if (!ID_CELL.test(c[0] || '') || defs.has(c[0])) continue;
      let target = { page: pageOf(f), anchor: c[0], text: c[1] || '' };
      // A journey's index row points at the journey itself.
      const link = c[0].startsWith('JN-') && (c[c.length - 1].match(/\]\(([^)]+\.md)\)/) || [])[1];
      if (link) target = { page: pageOf(path.posix.join(path.posix.dirname(f), link)), anchor: null, text: c[1] };
      defs.set(c[0], target);
      if (f.startsWith('docs/modules/') && /^## 3 · /.test(section) && STATUSES.includes(c[2])) {
        caps.set(c[0], { status: c[2], phase: c[c.length - 1], text: c[1] });
      }
    }
  }
  return { defs, caps };
}

// Inline Markdown: code spans kept verbatim, then links, ids, emphasis.
function inline(text, ctx) {
  const parts = text.split(/(`[^`]*`)/);
  return parts.map((p) => {
    if (/^`[^`]*`$/.test(p)) return `<code>${html(p.slice(1, -1))}</code>`;
    const keep = [];
    let s = html(p).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
      let h = href.replace(/&amp;/g, '&');
      if (!/^[a-z]+:/i.test(h)) {
        const [file, hash] = h.split('#');
        const target = file ? path.posix.normalize(path.posix.join(path.posix.dirname(ctx.page), file)) : ctx.page;
        h = file.endsWith('.md') ? pageOf(relHref(ctx.page, target.replace(/\.html$/, '.md'))) + (hash ? `#${hash}` : '') : h;
      }
      keep.push(`<a href="${html(h)}">${label}</a>`);
      return `\u0000${keep.length - 1}\u0000`;
    });
    s = s.replace(ID_TEXT, (id) => {
      const d = ctx.defs.get(id);
      if (!d) return id;
      ctx.cite(id);
      if (ctx.self === id) return `<a class="self" href="#${id}">${id}</a>`;
      const href = relHref(ctx.page, d.page) + (d.anchor ? `#${d.anchor}` : '');
      const cap = ctx.caps.get(id);
      const title = cap ? `${cap.status} · phase ${cap.phase} · ${cap.text.slice(0, 120)}` : d.text.replace(/\*\*/g, '').slice(0, 140);
      const badge = cap && ctx.badges ? ` <span class="st st-${cap.status.toLowerCase()}">${cap.status}</span>` : '';
      keep.push(`<a class="id" href="${html(href)}" title="${html(title)}">${id}</a>${badge}`);
      return `\u0000${keep.length - 1}\u0000`;
    });
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
    return s.replace(/\u0000(\d+)\u0000/g, (_, n) => keep[+n]);
  }).join('');
}

// Block Markdown: the subset these documents use.
function render(body, ctx) {
  const out = [];
  const lines = body.replace(/<!--[\s\S]*?-->/g, '').split('\n');
  let i = 0;
  const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('```')) {
      const buf = [];
      for (i++; i < lines.length && !lines[i].startsWith('```'); i++) buf.push(lines[i]);
      i++;
      out.push(`<pre>${html(buf.join('\n'))}</pre>`);
      continue;
    }
    const h = line.match(/^(#{1,4}) (.*)$/);
    if (h) {
      const n = h[1].length;
      out.push(`<h${n} id="${slug(h[2])}">${inline(h[2], ctx)}</h${n}>`);
      i++;
      continue;
    }
    if (line.startsWith('|')) {
      const rows = [];
      for (; i < lines.length && lines[i].startsWith('|'); i++) rows.push(lines[i]);
      const head = cells(rows[0]);
      const body2 = rows.slice(rows[1] && /^\|[\s:|-]+\|$/.test(rows[1]) ? 2 : 1);
      const tr = body2.map((r) => {
        const c = cells(r);
        const id = ID_CELL.test(c[0] || '') && ctx.defs.get(c[0]) && ctx.defs.get(c[0]).page === ctx.page && ctx.defs.get(c[0]).anchor === c[0] ? c[0] : null;
        ctx.row = id;
        ctx.self = id;
        const tds = c.map((x) => `<td>${inline(x, ctx)}</td>`);
        ctx.self = null;
        if (id && ctx.caps.has(id)) tds[0] = tds[0].replace('</td>', `<!--CITED:${id}--></td>`);
        ctx.row = null;
        return `<tr${id ? ` id="${id}"` : ''}>${tds.join('')}</tr>`;
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
    const para = [];
    for (; i < lines.length && lines[i].trim() && !/^(#{1,4} |\||```|\s*(-|\d+\.) )/.test(lines[i]); i++) para.push(lines[i].trim());
    if (para.length) out.push(`<p>${inline(para.join(' '), ctx)}</p>`);
    else i++;
  }
  return out.join('\n');
}

const STYLE = `
:root{--bg:#fbfaf7;--fg:#1f1d1a;--muted:#6b665e;--line:#e4e0d8;--accent:#460d4d;--link:#5a2a8a;--code:#f1eee8;
--planned:#8a6d1f;--planned-bg:#f6edd3;--designed:#1f5d8a;--designed-bg:#dcebf6;--built:#2e6b34;--built-bg:#dcefdc;--live:#1d5a3a;--live-bg:#cdeedb}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#171513;--fg:#ebe7e0;--muted:#a49d92;--line:#33302b;--accent:#d9a5e0;--link:#c6a4f0;--code:#24211d;
--planned:#e8c873;--planned-bg:#3a3020;--designed:#8cc4ef;--designed-bg:#1c2f3e;--built:#92d39a;--built-bg:#1f3322;--live:#7fdcaa;--live-bg:#173426}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif}
header{position:sticky;top:0;z-index:2;background:var(--bg);border-bottom:1px solid var(--line);padding:10px 16px;display:flex;gap:14px;flex-wrap:wrap;align-items:center}
header b{color:var(--accent)}header a{color:var(--fg);text-decoration:none;font-size:14px}header a:hover{color:var(--link)}
main{max-width:1180px;margin:0 auto;padding:16px}a{color:var(--link)}a.id{text-decoration:none;font-weight:600;white-space:nowrap}a.id:hover{text-decoration:underline}
a.self{color:var(--accent);text-decoration:none;font-weight:700;white-space:nowrap}
html{scroll-padding-top:64px}td:first-child{min-width:5.5em}
.meta{color:var(--muted);font-size:13px;margin:0 0 12px}.tw{overflow-x:auto;margin:12px 0}
table{border-collapse:collapse;font-size:14px;min-width:100%}th,td{border:1px solid var(--line);padding:6px 8px;vertical-align:top;text-align:left}
th{background:var(--code)}tr:target{outline:2px solid var(--accent);background:var(--code)}
pre{background:var(--code);padding:12px;overflow-x:auto;font:13px/1.4 ui-monospace,Consolas,monospace}code{background:var(--code);padding:0 3px;font:13px ui-monospace,Consolas,monospace}
.st{font-size:11px;padding:0 5px;border-radius:3px;white-space:nowrap}.st-planned{color:var(--planned);background:var(--planned-bg)}
.st-designed{color:var(--designed);background:var(--designed-bg)}.st-built{color:var(--built);background:var(--built-bg)}.st-live{color:var(--live);background:var(--live-bg)}
details{font-size:12px;color:var(--muted);margin-top:4px}details a{font-size:12px}
#q{width:100%;max-width:520px;padding:8px 10px;font-size:15px;border:1px solid var(--line);background:var(--bg);color:var(--fg);border-radius:4px}
#hits div{padding:4px 0;border-bottom:1px solid var(--line)}#hits small{color:var(--muted)}
@media (max-width:640px){main{padding:12px 16px}table{font-size:13px}}
`;

function shell(title, page, content) {
  const nav = [['index.html', 'Search'], ['README.html', 'README'], ['docs/start-here.html', 'Start here'], ['docs/journeys/README.html', 'Journeys'],
    ['docs/delivery-plan.html', 'Delivery plan'], ['docs/customers/roan-capital.html', 'Roan Capital'], ['REVIEW.html', 'Review'], ['HANDOFF.html', 'Handoff']];
  const links = nav.map(([p, t]) => `<a href="${relHref(page, p)}">${t}</a>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${html(title)}</title><style>${STYLE}</style></head><body><header><b>Dibon FS</b>${links}</header><main>${content}</main></body></html>\n`;
}

function build(root, outDir = path.join(root, 'build', 'site')) {
  const failures = runAll(root);
  if (failures.length) {
    const err = new Error(`checks failing (${failures.length}); the site is not built from failing sources`);
    err.failures = failures;
    throw err;
  }
  const files = sources(root);
  const { defs, caps } = indexIds(root, files);
  const cited = new Map();
  const pages = [];
  for (const f of files) {
    const { fields, body } = frontMatter(read(root, f));
    const page = pageOf(f);
    const ctx = {
      page, defs, caps, self: null, row: null, badges: f.startsWith('docs/journeys/'),
      cite(id) {
        if (this.self === id) return;
        if (!cited.has(id)) cited.set(id, new Map());
        const where = this.row ? `${page}#${this.row}` : page;
        cited.get(id).set(where, this.row ? `${this.row}` : (fields.name || f));
      },
    };
    const title = (body.match(/^# (.+)$/m) || [])[1] || fields.name || f;
    const meta = Object.entries(fields).filter(([k]) => ['kind', 'release', 'owner', 'version', 'last_reviewed', 'review_ids'].includes(k))
      .map(([k, v]) => `${k.replace('_', ' ')}: ${inline(v.replace(/^\[|\]$/g, ''), ctx)}`).join(' · ');
    const content = (meta ? `<p class="meta">${f} · ${meta}</p>` : `<p class="meta">${f}</p>`) + render(body, ctx);
    pages.push({ f, page, title, content });
  }
  fs.rmSync(outDir, { recursive: true, force: true });
  for (const p of pages) {
    const content = p.content.replace(/<!--CITED:([A-Z]{2}-\d{2})-->/g, (_, id) => {
      const where = [...(cited.get(id) || new Map())];
      if (!where.length) return '<details><summary>cited nowhere</summary></details>';
      const links = where.map(([href, label]) => `<a href="${relHref(p.page, href.split('#')[0])}${href.includes('#') ? `#${href.split('#')[1]}` : ''}">${html(label)}</a>`);
      return `<details><summary>cited ${where.length}×</summary>${links.join(', ')}</details>`;
    });
    const out = path.join(outDir, p.page);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, shell(p.title, p.page, content));
  }
  const entries = [...defs].map(([id, d]) => {
    const cap = caps.get(id);
    return { id, t: d.text.replace(/\*\*|`/g, '').slice(0, 160), h: d.page + (d.anchor ? `#${d.anchor}` : ''), s: cap ? cap.status : '' };
  }).concat(pages.map((p) => ({ id: '', t: p.title, h: p.page, s: p.f })));
  const search = `<h1>Dibon financial services</h1><p class="meta">Generated ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC from ${pages.length} documents and ${defs.size} ids. Type an id (MF-01, FS-548, RC-43, JN-02) or words.</p>
<input id="q" autofocus placeholder="Search ids and titles"><div id="hits"></div>
<script>const E=${JSON.stringify(entries).replace(/</g, '\\u003c')};const q=document.getElementById('q'),h=document.getElementById('hits');
function show(){const v=q.value.trim().toLowerCase();if(!v){h.innerHTML='';return}const r=E.filter(e=>(e.id+' '+e.t).toLowerCase().includes(v)).slice(0,60);
h.innerHTML=r.map(e=>'<div><a href="'+e.h+'">'+(e.id||'page')+'</a> '+(e.s?'<small>'+e.s+'</small> ':'')+e.t.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</div>').join('')||'<div>No match</div>'}
q.addEventListener('input',show);</script>`;
  fs.writeFileSync(path.join(outDir, 'index.html'), shell('Dibon financial services', 'index.html', search));
  return { outDir, pages: pages.length, ids: defs.size };
}

module.exports = { build };

if (require.main === module) {
  const root = path.join(__dirname, '..');
  try {
    const { outDir, pages, ids } = build(root);
    console.log(`built ${path.relative(root, outDir)}/index.html: ${pages} pages, ${ids} ids linked`);
  } catch (e) {
    for (const f of e.failures || []) console.log(`FAIL ${f.check}  ${f.file}${f.line ? `:${f.line}` : ''}  ${f.message}`);
    console.log(e.message);
    process.exit(1);
  }
}
