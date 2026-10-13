#!/usr/bin/env node
// Prints a page built on the design system to PDF (FS-781).
//
//   node design/system/build.js                       the template, as a check
//   node design/system/build.js path/to/page.html     any page that links dibon.css
//
// The page links dibon.css and may use __LOGO__ for the white logo; both
// are inlined here, so the PDF needs nothing beside it. The footer band's
// label comes from <meta name="dibon-footer">. Output goes to
// build/design-system/, which git ignores. Headless Chrome (or Edge) prints
// to A4; look at every page of the result before sending it.

'use strict';

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(ROOT, 'build', 'design-system');
const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => fs.existsSync(p));
if (!CHROME) throw new Error('No Chrome or Edge found for headless printing');

const src = path.resolve(process.argv[2] || path.join(__dirname, 'template.html'));
let html = fs.readFileSync(src, 'utf8');

const css = fs.readFileSync(path.join(__dirname, 'dibon.css'), 'utf8');
const label = (html.match(/<meta name="dibon-footer" content="([^"]*)">/) || [])[1] || 'Dibon Consulting';
const quoted = label.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
const style = `<style>\n${css}\n@page { @bottom-left { content: "${quoted}"; } }\n</style>`;
const linked = /<link rel="stylesheet" href="[^"]*dibon\.css">/;
if (!linked.test(html)) throw new Error(`${src} does not link dibon.css`);
html = html.replace(linked, style);

const logo = `data:image/png;base64,${fs.readFileSync(path.join(ROOT, 'design', 'brand', 'dibon_logo_white.png')).toString('base64')}`;
html = html.split('__LOGO__').join(logo);

fs.mkdirSync(OUT, { recursive: true });
const base = path.basename(src, '.html');
const page = path.join(OUT, `${base}.html`);
const pdf = path.join(OUT, `${base}.pdf`);
fs.writeFileSync(page, html);
execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=8000',
  `--print-to-pdf=${pdf}`, `file:///${page.replace(/\\/g, '/')}`], { stdio: 'ignore' });
console.log(`printed ${path.relative(ROOT, pdf)}`);
