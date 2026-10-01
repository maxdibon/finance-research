#!/usr/bin/env node
// Builds the marketing PDF from pages.html (FS-264).
//
//   node design/portfolio-pdf/build.js
//
// Output goes to build/portfolio/, which git ignores. The logo is the
// 1000-pixel transparent original extracted from Dibon's own July proposal
// (design/brand/extract-logo.js). Pages 6 and 8 onwards come from
// pages-rest.js. Diagrams come from the same script as the web preview, so
// the two never draw a product differently. Headless Chrome prints the pages
// to A4.

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
const R = rest({ F });
const logo = `data:image/png;base64,${fs.readFileSync(path.join(ROOT, 'design', 'brand', 'dibon_logo_white.png')).toString('base64')}`;

// Counts are computed by pages-rest.js from the pages it builds, never typed.
const html = fs.readFileSync(path.join(__dirname, 'pages.html'), 'utf8')
  .split('__N_PRODUCTS__').join(String(R.counts.products))
  .split('__N_SERVICES__').join(String(R.counts.services))
  .split('__REST_CSS__').join(CSS)
  .split('__PAGE_06__').join(R.page06)
  .split('__PAGES_08_20__').join(R.pages0820)
  .split('__FIG_COLLECT__').join(F['Kapu Collect'])
  .split('__LOGO__').join(logo);
const left = html.match(/__[A-Z0-9_]+__/);
if (left) throw new Error(`unfilled placeholder ${left[0]}`);

fs.mkdirSync(OUT, { recursive: true });
const htmlOut = path.join(OUT, 'portfolio.html');
fs.writeFileSync(htmlOut, html);

// Print to a fresh file, then move it into place. Chrome exits quietly when
// it cannot write, for example while the PDF is open in a viewer, so the
// build checks that a new file exists rather than trusting the exit (FS-322).
const pdfOut = path.join(OUT, 'dibon-financial-services-portfolio-review.pdf');
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
