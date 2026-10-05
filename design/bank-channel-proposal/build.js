// Builds the two-page bank channel proposal (FS-441, FS-442) from
// docs/marketing/bank-channel-proposal.md. Every word comes from the copy;
// this file holds only the layout. Same brand as the portfolio.
//
//   node design/bank-channel-proposal/build.js
//   node design/bank-channel-proposal/build.js --for "Name of Bank"
//
// Writes build/proposals/<name>.html and .pdf.

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { load, inline } = require('../portfolio-pdf/copy');

const ROOT = path.join(__dirname, '..', '..');
const COPY = path.join(ROOT, 'docs', 'marketing', 'bank-channel-proposal.md');
const OUT = path.join(ROOT, 'build', 'proposals');
const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find((p) => fs.existsSync(p));

const args = process.argv.slice(2);
const forIdx = args.indexOf('--for');
const bank = forIdx >= 0 ? args[forIdx + 1] : '';
if (forIdx >= 0 && !bank) throw new Error('--for needs a name');

const copy = load(COPY);
const meta = fs.readFileSync(COPY, 'utf8').match(/^version: (\S+)$/m)[1];
const version = meta.split('.').slice(0, 2).join('.');
const issued = fs.readFileSync(COPY, 'utf8').match(/^last_reviewed: (\S+)$/m)[1];

// "[Bank]" becomes the bank's name, or "your bank" ("Your bank" where a
// sentence starts), before the text is escaped.
const named = (s) => (bank
  ? s.split('[Bank]').join(bank)
  : s.replace(/(^|[.!?:]\s+)\[Bank\]/g, '$1Your bank').split('[Bank]').join('your bank'));
const t = (s) => inline(named(s));
const pair = (s) => { const i = s.indexOf(': '); return i < 0 ? [s, ''] : [s.slice(0, i), s.slice(i + 2)]; };

const D = copy.section('Document');
const O = copy.section('The opportunity');
const P = copy.section('Partnership');
const list = (items) => `<ul>${items.map((x) => `<li>${t(x)}</li>`).join('')}</ul>`;
const rows = (items) => items.map((x) => { const [a, b] = pair(x); return `<div class="kv"><em>${t(a)}</em><span>${t(b.charAt(0).toUpperCase() + b.slice(1))}</span></div>`; }).join('');
const steps = O.get('How it works').map((x) => pair(x));
if (steps.length !== 3) throw new Error(`proposal copy: How it works has ${steps.length} steps; the layout has room for 3`);

const logo = `data:image/png;base64,${fs.readFileSync(path.join(ROOT, 'design', 'brand', 'dibon_logo_white.png')).toString('base64')}`;
const ref = `${inline(D.get('Reference'))} · v${version}`;
const footer = (n) => `<footer class="footer"><span class="brand"><img alt="Dibon" src="${logo}"><span class="wordmark">Dibon<br>Consulting</span></span><span class="draft">${ref}</span><span class="num">${n}</span></footer>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${t(D.get('Title'))}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Source+Sans+3:wght@400;600&display=swap">
<style>
:root {
  --aubergine: #280430; --plum: #460d4d; --amber: #fbb236; --cream: #fff2eb;
  --paper: #fffaf6; --ink: #23122a; --muted: #5e4c66; --line: #ead9dc;
  --amber-text: #8a5a00; --money: #0e7f5a;
  --display: "Montserrat", "Segoe UI", Arial, sans-serif;
  --body: "Source Sans 3", "Segoe UI", Arial, sans-serif;
}
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; background: #e9e1e3; }
body { font: 400 10pt/1.45 var(--body); color: var(--ink); }
.page { width: 210mm; height: 297mm; position: relative; overflow: hidden; background: var(--paper); margin: 0 auto 8mm; page-break-after: always; }
.page:last-child { page-break-after: auto; }
@media print { html, body { background: none; } .page { margin: 0; } }
.content { position: absolute; left: 16mm; right: 16mm; top: 14mm; bottom: 30mm; }
h1, h2, h3 { font-family: var(--display); color: var(--aubergine); margin: 0; }
.eyebrow { font: 700 7.5pt/1 var(--display); letter-spacing: 0.18em; text-transform: uppercase; color: var(--amber-text); margin: 0 0 2.5mm; }
.hero { background: var(--aubergine); color: var(--cream); margin: -14mm -16mm 7mm; padding: 16mm 16mm 10mm; position: relative; }
.hero .eyebrow { color: var(--amber); }
.hero h1 { color: var(--cream); font: 800 23pt/1.12 var(--display); max-width: 150mm; }
.hero .prepared { margin-top: 5mm; font: 600 9pt/1.3 var(--display); color: #e7cfe0; }
.hero::after { content: ""; position: absolute; right: 0; bottom: 0; width: 42mm; height: 5mm; background: var(--amber); clip-path: polygon(25% 0, 100% 0, 100% 100%, 0 100%); }
.lede { font: 400 11.5pt/1.5 var(--body); margin: 0 0 6mm; }
.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; }
.cols3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4.5mm; }
.card { border: 0.3mm solid var(--line); border-radius: 1.5mm; padding: 4mm 4.5mm; background: #fff; }
.card h3 { font: 700 10.5pt/1.25 var(--display); margin-bottom: 2mm; }
.card.dark { background: var(--aubergine); color: var(--cream); border: none; }
.card.dark h3 { color: var(--amber); }
ul { margin: 0; padding-left: 4.2mm; }
li { margin: 0 0 1.6mm; }
li::marker { color: var(--amber-text); }
.card.dark li::marker { color: var(--amber); }
h2 { font: 800 15pt/1.2 var(--display); margin: 7mm 0 3mm; }
.steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; margin-top: 2mm; }
.step { border-top: 1.2mm solid var(--amber); padding-top: 2.5mm; }
.step b { display: block; font: 700 10.5pt/1.2 var(--display); color: var(--aubergine); margin-bottom: 1mm; }
.step b span { color: var(--amber-text); margin-right: 1.5mm; }
.intro { margin: 0 0 4mm; font-size: 10.5pt; }
.kv { display: grid; grid-template-columns: 36mm 1fr; gap: 2mm; padding: 1.4mm 0; border-bottom: 0.3mm solid var(--line); }
.kv:last-child { border-bottom: none; }
.kv em { font: 600 8pt/1.35 var(--display); font-style: normal; color: var(--muted); }
.band { margin: 4mm 0 0; background: var(--cream); border-left: 1.4mm solid var(--amber); padding: 3mm 4.5mm; font: 600 10pt/1.4 var(--display); color: var(--aubergine); }
.small { font-size: 9.2pt; }
.next { margin-top: 5mm; display: grid; grid-template-columns: 1fr auto; gap: 6mm; align-items: center; background: var(--aubergine); color: var(--cream); border-radius: 1.5mm; padding: 4mm 5mm; }
.next b { font: 700 10.5pt/1.35 var(--display); }
.next span { font: 600 8.5pt/1.4 var(--display); color: var(--amber); white-space: nowrap; }
.footer { position: absolute; left: 0; right: 0; bottom: 0; height: 20mm; background: var(--aubergine); display: flex; align-items: center; padding-left: 14mm; }
.footer .brand { display: flex; align-items: center; }
.footer img { height: 9mm; }
.footer .wordmark { font: 700 6.5pt/1.2 var(--display); letter-spacing: 0.22em; color: var(--cream); text-transform: uppercase; margin-left: 3mm; }
.footer .draft { margin-left: auto; margin-right: 44mm; font: 600 6.5pt/1 var(--display); letter-spacing: 0.14em; text-transform: uppercase; color: #cdb3c9; }
.footer::after { content: ""; position: absolute; right: 0; top: 0; bottom: 0; width: 38mm; background: var(--amber); clip-path: polygon(40% 0, 100% 0, 100% 100%, 0 100%); }
.footer .num { position: absolute; right: 9mm; z-index: 1; font: 700 11pt/1 var(--display); color: var(--aubergine); }
</style></head><body>

<section class="page">
  <div class="content">
    <div class="hero">
      <p class="eyebrow">${t(D.get('Kicker'))}</p>
      <h1>${t(D.get('Title'))}</h1>
      <p class="prepared">${bank ? `Prepared for ${inline(bank)} · ` : ''}${issued}</p>
    </div>
    <p class="lede">${t(O.get('Lede'))}</p>
    <div class="cols">
      <div class="card"><h3>For your customers</h3>${list(O.get('For your customers'))}</div>
      <div class="card dark"><h3>For the bank</h3>${list(O.get('For the bank'))}</div>
    </div>
    <h2>How it works</h2>
    <div class="steps">${steps.map(([a, b], i) => `<div class="step"><b><span>${i + 1}</span>${t(a)}</b>${t(b)}</div>`).join('')}</div>
    <h2>Why Dibon</h2>
    <div class="card dark">${list(P.get('Why Dibon'))}</div>
  </div>
  ${footer(1)}
</section>

<section class="page">
  <div class="content">
    <h2 style="margin-top:0">${t(P.get('Heading'))}</h2>
    <p class="intro">${t(P.get('Intro'))}</p>
    <div class="cols">
      <div class="card"><h3>Referral</h3>${rows(P.get('Referral'))}</div>
      <div class="card"><h3>Bundle</h3>${rows(P.get('Bundle'))}</div>
    </div>
    <p class="band">${t(P.get('Recommendation'))}</p>
    <div class="cols3" style="margin-top:5mm">
      <div class="card small"><h3>${t(P.get('Data heading'))}</h3>${list(P.get('Data'))}</div>
      <div class="card small"><h3>${t(P.get('Pilot heading'))}</h3>${list(P.get('Pilot'))}</div>
      <div class="card small"><h3>What we need from you</h3>${list(P.get('From the bank'))}</div>
    </div>
    <div class="next"><b>${t(P.get('Next step'))}</b><span>${t(P.get('Contact'))}</span></div>
  </div>
  ${footer(2)}
</section>
</body></html>`;

fs.mkdirSync(OUT, { recursive: true });
const slug = (s) => s.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');
const base = `Dibon-Bank-Channel-Proposal-v${version}-${issued}${bank ? `-for-${slug(bank)}` : ''}`;
const htmlOut = path.join(OUT, `${base}.html`);
fs.writeFileSync(htmlOut, html);
if (args.includes('--html-only')) { console.log(`built ${path.relative(ROOT, htmlOut)}`); process.exit(0); }
if (!CHROME) throw new Error('No Chrome or Edge found for headless printing');
const pdfOut = path.join(OUT, `${base}.pdf`);
const tmp = `${pdfOut}.tmp-${Date.now()}.pdf`;
execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=8000', `--print-to-pdf=${tmp}`, `file:///${htmlOut.replace(/\\/g, '/')}`], { stdio: 'ignore' });
if (!fs.existsSync(tmp) || fs.statSync(tmp).size === 0) throw new Error('Chrome produced no PDF');
fs.renameSync(tmp, pdfOut);
console.log(`built ${path.relative(ROOT, pdfOut)} (${fs.statSync(pdfOut).size} bytes)`);
if (bank) console.log(`distribution log: ${issued} · ${base}.pdf · prepared for ${bank}`);
