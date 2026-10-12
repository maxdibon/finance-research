// Prints the bank requests' checklists (FS-717, FS-718) as PDFs on Dibon's
// letterhead, from docs/outreach/bank-api-requests-2026-10.md: Appendix A
// for the operational accounts, Appendix B for the credit card. Every word
// comes from that file; this one holds only the layout, in the
// portfolio's brand.
//
//   node design/outreach-pdf/build.js
//
// Writes build/outreach/<name>.html and .pdf, which git ignores.

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..', '..');
const SOURCE = path.join(ROOT, 'docs', 'outreach', 'bank-api-requests-2026-10.md');
const OUT = path.join(ROOT, 'build', 'outreach');
const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find((p) => fs.existsSync(p));
if (!CHROME) throw new Error('No Chrome or Edge found for headless printing');

const text = fs.readFileSync(SOURCE, 'utf8').replace(/\r\n/g, '\n');
const issued = text.match(/^last_reviewed: (\S+)$/m)[1];
const version = text.match(/^version: (\S+)$/m)[1];
const longDate = new Date(`${issued}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

// One appendix's body: from its heading to the next rule or heading.
function appendix(letter) {
  const start = text.search(new RegExp(`^## Appendix ${letter} · .*$`, 'm'));
  if (start < 0) throw new Error(`no Appendix ${letter} in ${path.relative(ROOT, SOURCE)}`);
  const body = text.slice(text.indexOf('\n', start) + 1);
  const end = body.search(/^(---|## )/m);
  return (end < 0 ? body : body.slice(0, end)).trim();
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s) => esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

// The appendices use three shapes: a bold line (a heading), a numbered
// list whose items may wrap, and a plain paragraph.
function toHtml(md) {
  let title = '';
  const html = md.split(/\n\s*\n/).map((block) => {
    const lines = block.split('\n');
    if (/^\d+\. /.test(lines[0])) {
      const items = [];
      for (const l of lines) {
        if (/^\d+\. /.test(l)) items.push(l.replace(/^\d+\. /, ''));
        else items[items.length - 1] += ' ' + l.trim();
      }
      return `<ol>${items.map((i) => `<li>${inline(i)}</li>`).join('')}</ol>`;
    }
    const joined = lines.map((l) => l.trim()).join(' ');
    const bold = joined.match(/^\*\*([^*]+)\*\*$/);
    if (bold && !title) { title = bold[1]; return ''; }
    if (bold) return `<h2>${esc(bold[1])}</h2>`;
    // A bold lead-in with text after it: the lead-in is the heading.
    const lead = joined.match(/^\*\*([^*]+)\*\*\s+(.+)$/);
    if (lead && title) return `<h2>${esc(lead[1].replace(/\.$/, ''))}</h2><p>${inline(lead[2])}</p>`;
    return `<p>${inline(joined)}</p>`;
  }).join('\n');
  return { title, html };
}

const logo = `data:image/png;base64,${fs.readFileSync(path.join(ROOT, 'design', 'brand', 'dibon_logo_white.png')).toString('base64')}`;

function page({ kicker, title, html }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Source+Sans+3:wght@400;600&display=swap">
<style>
:root {
  --aubergine: #280430; --plum: #460d4d; --amber: #fbb236; --cream: #fff2eb;
  --ink: #2a1f2d; --muted: #6b5a70; --rule: #e6d9e3;
  --display: "Montserrat", "Segoe UI", Arial, sans-serif;
  --body: "Source Sans 3", "Segoe UI", Arial, sans-serif;
}
@page { size: A4; margin: 14mm 0 10mm; }
@page :first { margin-top: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; background: #fff; }
body { font: 400 10pt/1.45 var(--body); color: var(--ink); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.head { background: var(--aubergine); color: var(--cream); padding: 11mm 18mm 8mm; position: relative; overflow: hidden; }
.head::after { content: ""; position: absolute; right: 0; top: 0; bottom: 0; width: 42mm; background: var(--amber); clip-path: polygon(45% 0, 100% 0, 100% 100%, 0 100%); }
.brand { display: flex; align-items: center; gap: 3mm; }
.brand img { height: 11mm; }
.wordmark { font: 700 7pt/1.25 var(--display); letter-spacing: 0.22em; text-transform: uppercase; }
.kicker { margin-top: 7mm; font: 600 7.5pt/1 var(--display); letter-spacing: 0.16em; text-transform: uppercase; color: var(--amber); }
h1 { margin: 3mm 0 0; max-width: 140mm; font: 800 19pt/1.2 var(--display); color: #fff; }
.meta { margin-top: 4mm; font: 600 7.5pt/1 var(--display); letter-spacing: 0.1em; text-transform: uppercase; color: #cdb3c9; }
main { padding: 7mm 18mm 16mm; }
main > p:first-child { color: var(--muted); font-style: italic; }
h2 { break-after: avoid; margin: 5mm 0 2mm; padding-bottom: 1.5mm; border-bottom: 0.6mm solid var(--amber); font: 700 10.5pt/1.3 var(--display); color: var(--plum); }
ol { margin: 0; padding-left: 6mm; }
li { margin: 0 0 1.2mm; padding-left: 1mm; break-inside: avoid; }
li::marker { font: 700 9pt var(--display); color: var(--plum); }
strong { color: var(--aubergine); }
p { margin: 0 0 2mm; }
.foot { margin: 6mm 18mm 0; padding-top: 3mm; border-top: 0.4mm solid var(--rule); display: flex; justify-content: space-between; color: var(--muted); font: 600 6.5pt/1 var(--display); letter-spacing: 0.14em; text-transform: uppercase; }
main { padding-bottom: 0; }
</style></head>
<body>
<header class="head">
  <div class="brand"><img alt="Dibon" src="${logo}"><span class="wordmark">Dibon<br>Consulting</span></div>
  <div class="kicker">${esc(kicker)}</div>
  <h1>${esc(title)}</h1>
  <div class="meta">Dibon Company Limited · ${esc(longDate)} · Checklist v${esc(version)}</div>
</header>
<main>
${html}
</main>
</body></html>`;
}

function printPdf(htmlOut, pdfOut) {
  const tmp = path.join(OUT, `print-${process.pid}.pdf`);
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=8000',
    `--print-to-pdf=${tmp}`, `file:///${htmlOut.replace(/\\/g, '/')}`,
  ], { stdio: 'ignore' });
  if (!fs.existsSync(tmp) || fs.statSync(tmp).size === 0) throw new Error('Chrome produced no PDF');
  try { fs.renameSync(tmp, pdfOut); } catch (e) {
    const alt = pdfOut.replace(/\.pdf$/, `-${Date.now()}.pdf`);
    fs.renameSync(tmp, alt);
    console.log(`${path.basename(pdfOut)} is locked (open in a viewer?); wrote ${path.relative(ROOT, alt)} instead`);
    return;
  }
  console.log(`built ${path.relative(ROOT, pdfOut)} (${fs.statSync(pdfOut).size} bytes)`);
}

fs.mkdirSync(OUT, { recursive: true });
for (const [letter, kicker, name] of [
  ['A', 'For NCBA and KCB · operational accounts', 'Dibon-bank-checklist-accounts'],
  ['B', 'For SBM Bank · corporate credit card', 'Dibon-bank-checklist-card'],
]) {
  const { title, html } = toHtml(appendix(letter));
  if (!title) throw new Error(`Appendix ${letter} has no bold title line`);
  const htmlOut = path.join(OUT, `${name}-${issued}.html`);
  fs.writeFileSync(htmlOut, page({ kicker, title, html }));
  printPdf(htmlOut, path.join(OUT, `${name}-${issued}.pdf`));
}
