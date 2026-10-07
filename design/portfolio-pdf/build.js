#!/usr/bin/env node
// Builds the portfolio PDFs and web previews (FS-264).
//
//   node design/portfolio-pdf/build.js                      every edition
//   node design/portfolio-pdf/build.js --edition short      one edition
//   node design/portfolio-pdf/build.js --for "Recipient name"
//   node design/portfolio-pdf/build.js --html-only          pages, no PDF
//
// Every word comes from docs/marketing/portfolio.md (FS-352). document.json
// names each edition: its id, title, version, status, issue date and the pages it
// carries (FS-333, FS-362). Pages are numbered by position in the edition,
// and the contents page lists what that edition carries.
//
// A named copy carries "Prepared for" on the cover and the name in its
// filename, and is not published as the web preview. Record every named
// copy in the distribution log on the CRM opportunity; names never go in git.
//
// Output goes to build/portfolio/, which git ignores. The logo is the
// 1000-pixel transparent original extracted from Dibon's own July proposal
// (design/brand/extract-logo.js). Headless Chrome prints the pages to A4;
// the same pages, scaled to the screen, become the web preview.

'use strict';

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(ROOT, 'build', 'portfolio');
const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find((p) => fs.existsSync(p));
if (!CHROME) throw new Error('No Chrome or Edge found for headless printing');

const { F } = require(path.join(ROOT, 'design', 'portfolio-preview', 'figures.js'));
const { rest, CSS } = require(path.join(__dirname, 'pages-rest.js'));
const { load: loadCopy, inline, pair } = require(path.join(__dirname, 'copy.js'));
const copy = loadCopy();
const R = rest({ F, copy });
const arg = (name) => { const i = process.argv.indexOf(name); return i > 0 ? (process.argv[i + 1] || '').trim() : null; };
const htmlOnly = process.argv.includes('--html-only');
const recipient = arg('--for');
if (recipient === '') throw new Error('--for needs a name');
const DOC = JSON.parse(fs.readFileSync(path.join(__dirname, 'document.json'), 'utf8'));
const only = arg('--edition');
if (only && !DOC.editions[only]) throw new Error(`no edition "${only}"; document.json has ${Object.keys(DOC.editions).join(', ')}`);

// ── Fill pages.html from the copy ────────────────────────────────────────
// pages.html refers to the copy as {{Section|Field}}, a card's title
// {{Section|#n}}, a card's field {{Section|#n|Field}}, a list entry
// {{...|Field|n}}, or the halves of a "Label: text" entry {{...|Field|n|label}}
// and {{...|Field|n|text}}. An "em:" prefix highlights with <em> instead of
// <span>. A list the page shows entry by entry must have exactly as many
// entries as the page has room for.
const counted = (s) => s.replace('{products}', R.counts.products).replace('{services}', R.counts.services).replace('{Products}', R.word);
const prods = copy.section('Products').items();
const listUse = new Map();
function resolve(ref) {
  const parts = ref.split('|');
  const sec = copy.section(parts.shift());
  let holder = sec;
  if (/^#\d+$/.test(parts[0] || '')) {
    const item = sec.items()[+parts.shift().slice(1) - 1];
    if (!item) throw new Error(`pages.html refers to {{${ref}}}, which the copy does not have`);
    if (!parts.length) return item.title;
    holder = item;
  }
  const value = holder.get(parts.shift());
  if (!parts.length) return value;
  const n = +parts.shift();
  const key = ref.split('|').slice(0, -(parts.length + 1)).join('|');
  listUse.set(key, { max: Math.max(n, (listUse.get(key) || { max: 0 }).max), length: value.length });
  if (!value[n - 1]) throw new Error(`pages.html refers to {{${ref}}}, but the list has ${value.length} entries`);
  if (!parts.length) return value[n - 1];
  const [label, text] = pair(value[n - 1]);
  return parts[0] === 'label' ? label : text;
}
const SPECIAL = {
  toc: () => '__TOC__',
  lineup: () => prods.map((it) => `<span>${inline(it.title)}</span>`).join(''),
};
const pagesHtml = fs.readFileSync(path.join(__dirname, 'pages.html'), 'utf8').replace(/\{\{(em:)?([^}]+)\}\}/g, (m, em, ref) => {
  if (SPECIAL[ref]) return SPECIAL[ref]();
  return inline(counted(resolve(ref)), em ? 'em' : 'span');
});
for (const [key, u] of listUse) {
  if (u.max !== u.length) throw new Error(`portfolio copy: "${key.split('|').join(' › ')}" has ${u.length} entries; the page has room for ${u.max}. Change the design first, then the copy`);
}
const logo = `data:image/png;base64,${fs.readFileSync(path.join(ROOT, 'design', 'brand', 'dibon_logo_white.png')).toString('base64')}`;
// Counts are computed by pages-rest.js from the pages it builds, never typed.
const all = pagesHtml
  .split('__N_PRODUCTS__').join(String(R.counts.products))
  .split('__N_SERVICES__').join(String(R.counts.services))
  .split('__REST_CSS__').join(CSS)
  .split('__PAGE_06__').join(R.page06)
  .split('__PAGES_07_21__').join(R.pages0721)
  .split('__LOGO__').join(logo);

// ── Pages, by key ────────────────────────────────────────────────────────
// Each page is found by its layout id and given a key; an edition lists the
// keys it carries. The contents entry for a page is its copy section's
// "Contents" field.
const KEY_OF = { p03: 'who', p04: 'problems', p05: 'how', p06: 'glance', p16: 'suite', p17: 'platform', p18: 'who-for',
  p19: 'integrations', p20a: 'deployment', p20b: 'service', p20c: 'security', p20d: 'roadmap', p21: 'working' };
const SECTION_OF = { who: 'Who we are', problems: 'The problems we solve', how: 'How we build', glance: 'The portfolio at a glance',
  products: 'Products', suite: 'Business suite', platform: 'Platform services', 'who-for': 'Who it is for', integrations: 'Integrations',
  deployment: 'Deployment options', service: 'Support and service levels', security: 'Security and standards', roadmap: 'Where we are going', working: 'Working with us' };
const first = all.indexOf('<section class="page');
const last = all.lastIndexOf('</section>') + '</section>'.length;
const blocks = all.slice(first, last).match(/<section class="page[\s\S]*?<\/section>/g);
let productIndex = 0;
const pages = blocks.map((html) => {
  const id = (html.match(/^<section class="page[^"]*" id="(p\w+)"/) || [])[1];
  if (/^<section class="page cover"/.test(html)) return { key: 'cover', html };
  if (html.includes('<ol class="toc">')) return { key: 'contents', html };
  if (/^p(0[7-9]|1[0-5])$/.test(id)) return { key: 'products', html, id, product: prods[productIndex++].title };
  if (!KEY_OF[id]) throw new Error(`page ${id} has no key in build.js`);
  return { key: KEY_OF[id], html, id };
});

function edition(name) {
  const E = DOC.editions[name];
  for (const k of E.pages) if (!pages.some((p) => p.key === k)) throw new Error(`edition "${name}" lists page "${k}", which the layout does not have`);
  const kept = pages.filter((p) => E.pages.includes(p.key));
  // Number by position: the cover is unnumbered, the rest count from 2.
  let n = 1;
  const numbered = kept.map((p) => (p.key === 'cover' ? { ...p, num: null } : { ...p, num: String(++n).padStart(2, '0') }));
  const toc = [];
  for (const p of numbered) {
    if (p.key === 'cover' || p.key === 'contents') continue;
    const entry = (cls, title) => `      <li${cls}><a href="#p${p.num}">${title}</a><a class="n" href="#p${p.num}">${p.num}</a></li>`;
    if (p.key === 'products') {
      if (p.product === prods[0].title) toc.push(entry('', inline(copy.section('Products').get('Contents'))));
      toc.push(entry(' class="sub"', inline(p.product)));
    } else toc.push(entry('', inline(copy.section(SECTION_OF[p.key]).get('Contents'))));
  }
  // The version is the copy a reader holds (FS-595). Between issues an
  // edition is a draft: "Review draft" in its footer and file name, and
  // never sent, so a named copy of a draft is refused.
  if (!["draft", "issued"].includes(E.status)) throw new Error(`document.json: ${name} status "${E.status}"; expected draft or issued`);
  if (E.status === "draft" && recipient) throw new Error(`${E.id} v${E.version} is a draft; set its status to issued in document.json before preparing a copy for anyone`);
  const docRef = `${E.id} · v${E.version}${E.status === "draft" ? " · Review draft" : ""}`;
  const longDate = new Date(`${E.issued}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const prepared = recipient ? `<div class="prepared"><span>${inline(copy.section('Labels').get('Prepared for'))}</span>${esc(recipient)} · ${longDate}</div>` : '';
  const body = numbered.map((p) => {
    let h = p.html;
    if (p.num) {
      h = h.replace(/^(<section class="page[^"]*")( id="p\w+")?/, `$1 id="p${p.num}"`)
        .replace(/<span class="num">[^<]*<\/span>/, `<span class="num">${p.num}</span>`);
    }
    return h;
  }).join('\n\n');
  const html = (all.slice(0, first) + body + all.slice(last))
    .split('__TOC__').join(toc.join('\n'))
    .split('__DOC_TITLE__').join(`${E.title}, ${docRef}`)
    .split('__DOCREF__').join(docRef)
    .split('__PREPARED__').join(prepared);
  const left = html.match(/__[A-Z0-9_]+__/);
  if (left) throw new Error(`unfilled placeholder ${left[0]}`);
  return { E, html, docRef, count: numbered.length };
}

// A filename a person can read: title, version, issue date, and the
// recipient for a named copy. Hyphens, not spaces, so links do not break.
const slug = (s) => s.normalize('NFKD').replace(/[^\w\s.-]/g, '').trim().replace(/\s+/g, '-');

fs.mkdirSync(OUT, { recursive: true });
for (const name of only ? [only] : Object.keys(DOC.editions)) {
  const { E, html, docRef, count } = edition(name);
  const htmlOut = path.join(OUT, `portfolio-${name}.html`);
  fs.writeFileSync(htmlOut, html);
  const pdfOut = path.join(OUT, `${slug(E.title)}-v${E.version}${E.status === "draft" ? "-draft" : ""}-${E.issued}${recipient ? `-for-${slug(recipient)}` : ''}.pdf`);
  if (htmlOnly) console.log(`built ${path.relative(ROOT, htmlOut)} (${count} pages); no PDF printed (--html-only)`);
  else printPdf(htmlOut, pdfOut);
  if (recipient) {
    console.log(`distribution log: ${E.id} v${E.version}, ${E.issued}, for ${recipient}, file ${path.basename(pdfOut)}`);
    continue;
  }
  const webOut = path.join(OUT, `portfolio-${name}-web.html`);
  fs.writeFileSync(webOut, web(html, `${E.title} · ${docRef}`, count));
  console.log(`built ${path.relative(ROOT, webOut)} (${count} pages)`);
}

// Print to a fresh file, then move it into place. Chrome exits quietly when
// it cannot write, for example while the PDF is open in a viewer, so the
// build checks that a new file exists rather than trusting the exit (FS-322).
function printPdf(htmlOut, pdfOut) {
  const tmp = path.join(OUT, `print-${process.pid}.pdf`);
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=8000',
    `--print-to-pdf=${tmp}`, `file:///${htmlOut.replace(/\\/g, '/')}`,
  ], { stdio: 'ignore' });
  if (!fs.existsSync(tmp) || fs.statSync(tmp).size === 0) throw new Error('Chrome produced no PDF');
  try {
    fs.renameSync(tmp, pdfOut);
    console.log(`built ${path.relative(ROOT, pdfOut)} (${fs.statSync(pdfOut).size} bytes)`);
  } catch (e) {
    const stamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
    const alt = pdfOut.replace(/\.pdf$/, `-${stamp}.pdf`);
    fs.renameSync(tmp, alt);
    console.log(`${path.basename(pdfOut)} is locked (open in a viewer?); wrote ${path.relative(ROOT, alt)} instead`);
  }
}

// The web preview is the same pages, laid out as sheets and scaled to the
// screen, so it cannot drift from the PDF (FS-323). The artifact host adds
// the document skeleton, so this keeps only the head's links and styles and
// the body's pages.
function web(html, label, count) {
  const between = (s, a, b) => s.slice(s.indexOf(a) + a.length, s.indexOf(b));
  const head = between(html, '<head>', '</head>')
    .replace(/<meta[^>]*>\s*/g, '')
    .replace(/<title>[^<]*<\/title>/, '<title>Dibon Financial Services</title>');
  const SCREEN = `<style>
/* Screen only: the PDF's sheets on a desk, scaled to fit the width. The sheets keep their print colours in both themes; the desk follows the viewer's. */
:root { --desk: #eee4e3; --desk-ink: #4f3d55; --sheet-shadow: 0 1px 2px rgba(40, 4, 48, 0.14), 0 10px 28px rgba(40, 4, 48, 0.10); --fit: 1; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --desk: #170a1b; --desk-ink: #cdbcd2; --sheet-shadow: 0 10px 30px rgba(0, 0, 0, 0.55); color-scheme: dark; } }
:root[data-theme="dark"] { --desk: #170a1b; --desk-ink: #cdbcd2; --sheet-shadow: 0 10px 30px rgba(0, 0, 0, 0.55); color-scheme: dark; }
@media screen {
  html, body { background: var(--desk); }
  body { padding-block: 24px 40px; padding-inline: 16px; }
  .desk-head { width: calc(793.7px * var(--fit)); max-width: 100%; margin: 0 auto 14px; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 4px 16px; font: 600 11px/1.4 var(--display); letter-spacing: 0.1em; text-transform: uppercase; color: var(--desk-ink); }
  .page { margin: 0 auto 24px; box-shadow: var(--sheet-shadow); zoom: var(--fit); }
}
</style>`;
  const FIT = `<script>
(function () {
  var root = document.documentElement;
  function fit() {
    var cs = getComputedStyle(document.body);
    var room = document.body.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    root.style.setProperty('--fit', Math.min(1, room / 793.7).toFixed(4));
  }
  fit();
  addEventListener('resize', fit);
})();
</script>`;
  return `${head}${SCREEN}
<header class="desk-head"><span>${label}</span><span>${count} pages, the same as the PDF</span></header>
${between(html, '<body>', '</body>')}${FIT}
`;
}
