#!/usr/bin/env node
// Builds the marketing PDF from pages.html (FS-264).
//
//   node design/portfolio-pdf/build.js
//   node design/portfolio-pdf/build.js --for "Recipient name"
//
// The document id, version and issue date come from document.json (FS-333).
// A named copy carries "Prepared for" on the cover and the name in its
// filename, and is not published as the web preview. Record every named
// copy in the distribution log on the CRM opportunity; names never go in git.
//
// Output goes to build/portfolio/, which git ignores. The logo is the
// 1000-pixel transparent original extracted from Dibon's own July proposal
// (design/brand/extract-logo.js). Pages 6 and 8 onwards come from
// pages-rest.js, and the diagrams from design/portfolio-preview/figures.js.
// Headless Chrome prints the pages to A4. The same pages, scaled to the
// screen, become the web preview (build/portfolio/portfolio-web.html).

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
const htmlOnly = process.argv.includes('--html-only');

// Every word comes from docs/marketing/portfolio.md (FS-352). pages.html
// refers to it as {{Section|Field}}, a card's title {{Section|#n}}, a card's
// field {{Section|#n|Field}}, a list entry {{...|Field|n}}, or the halves of a
// "Label: text" entry {{...|Field|n|label}} and {{...|Field|n|text}}. An
// "em:" prefix highlights with <em> instead of <span>. A list the page shows
// entry by entry must have exactly as many entries as the page has room for.
const PAGE = { 'Who we are': '03', 'The problems we solve': '04', 'How we build': '05', 'The portfolio at a glance': '06',
  Products: '07', 'Business suite': '16', 'Platform services': '17', 'Who it is for': '18', Integrations: '19',
  'Deployment and security': '20', 'Working with us': '21' };
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
const toc = [];
for (const s of copy.sections) {
  if (!('Contents' in s.fields)) continue;
  const id = PAGE[s.title];
  if (!id) throw new Error(`portfolio copy: "${s.title}" has a contents entry but no page in the layout`);
  toc.push(`      <li><a href="#p${id}">${inline(s.fields.Contents)}</a><a class="n" href="#p${id}">${id}</a></li>`);
  if (s.title === 'Products') {
    prods.forEach((it, i) => {
      const n = String(7 + i).padStart(2, '0');
      toc.push(`      <li class="sub"><a href="#p${n}">${inline(it.title)}</a><a class="n" href="#p${n}">${n}</a></li>`);
    });
  }
}
const SPECIAL = {
  toc: () => toc.join('\n'),
  lineup: () => prods.map((it) => `<span>${inline(it.title)}</span>`).join(''),
};
const pagesHtml = fs.readFileSync(path.join(__dirname, 'pages.html'), 'utf8').replace(/\{\{(em:)?([^}]+)\}\}/g, (m, em, ref) => {
  if (SPECIAL[ref]) return SPECIAL[ref]();
  const pe = ref.match(/^product-eyebrow:(\d+)$/);
  if (pe) return inline(copy.section('Products').get('Eyebrow').replace('{n}', pe[1]).replace('{total}', R.counts.products));
  return inline(counted(resolve(ref)), em ? 'em' : 'span');
});
for (const [key, u] of listUse) {
  if (u.max !== u.length) throw new Error(`portfolio copy: "${key.split('|').join(' › ')}" has ${u.length} entries; the page has room for ${u.max}. Change the design first, then the copy`);
}
const DOC = JSON.parse(fs.readFileSync(path.join(__dirname, 'document.json'), 'utf8'));
const at = process.argv.indexOf('--for');
const recipient = at > 0 ? (process.argv[at + 1] || '').trim() : '';
if (at > 0 && !recipient) throw new Error('--for needs a name');
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const longDate = new Date(`${DOC.issued}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const docRef = `${DOC.id} · v${DOC.version}`;
const prepared = recipient ? `<div class="prepared"><span>${inline(copy.section('Labels').get('Prepared for'))}</span>${esc(recipient)} · ${longDate}</div>` : '';
const logo = `data:image/png;base64,${fs.readFileSync(path.join(ROOT, 'design', 'brand', 'dibon_logo_white.png')).toString('base64')}`;

// Counts are computed by pages-rest.js from the pages it builds, never typed.
const html = pagesHtml
  .split('__N_PRODUCTS__').join(String(R.counts.products))
  .split('__N_SERVICES__').join(String(R.counts.services))
  .split('__REST_CSS__').join(CSS)
  .split('__PAGE_06__').join(R.page06)
  .split('__PAGES_08_20__').join(R.pages0820)
  .split('__FIG_COLLECT__').join(R.figCollect)
  .split('__DOC_TITLE__').join(`${DOC.title}, ${docRef}`)
  .split('__DOCREF__').join(docRef)
  .split('__PREPARED__').join(prepared)
  .split('__LOGO__').join(logo);
const left = html.match(/__[A-Z0-9_]+__/);
if (left) throw new Error(`unfilled placeholder ${left[0]}`);

fs.mkdirSync(OUT, { recursive: true });
const htmlOut = path.join(OUT, 'portfolio.html');
fs.writeFileSync(htmlOut, html);
// A filename a person can read: title, version, issue date, and the
// recipient for a named copy. Hyphens, not spaces, so links do not break.
const slug = (s) => s.normalize('NFKD').replace(/[^\w\s.-]/g, '').trim().replace(/\s+/g, '-');
const pdfOut = path.join(OUT, `${slug(DOC.title)}-v${DOC.version}-${DOC.issued}${recipient ? `-for-${slug(recipient)}` : ''}.pdf`);
if (htmlOnly) console.log(`built ${path.relative(ROOT, htmlOut)}; no PDF printed (--html-only)`);
else printPdf();

// Print to a fresh file, then move it into place. Chrome exits quietly when
// it cannot write, for example while the PDF is open in a viewer, so the
// build checks that a new file exists rather than trusting the exit (FS-322).
function printPdf() {
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

if (recipient) {
  console.log(`distribution log: ${DOC.id} v${DOC.version}, ${DOC.issued}, for ${recipient}, file ${path.basename(pdfOut)}`);
  process.exit(0);
}

// The web preview is the same pages, laid out as sheets and scaled to the
// screen, so it cannot drift from the PDF (FS-323). The artifact host adds
// the document skeleton, so this keeps only the head's links and styles and
// the body's pages.
const between = (s, a, b) => s.slice(s.indexOf(a) + a.length, s.indexOf(b));
const head = between(html, '<head>', '</head>')
  .replace(/<meta[^>]*>\s*/g, '')
  .replace(/<title>[^<]*<\/title>/, '<title>Dibon Financial Services</title>');
const pages = (html.match(/<section class="page/g) || []).length;
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
const web = `${head}${SCREEN}
<header class="desk-head"><span>Dibon Financial Services · Review draft</span><span>${pages} pages, the same as the PDF</span></header>
${between(html, '<body>', '</body>')}${FIT}
`;
const webOut = path.join(OUT, 'portfolio-web.html');
fs.writeFileSync(webOut, web);
console.log(`built ${path.relative(ROOT, webOut)} (${pages} pages)`);
