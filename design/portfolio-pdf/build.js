#!/usr/bin/env node
// Builds the marketing PDF from pages.html (FS-264).
//
//   node design/portfolio-pdf/build.js
//
// Output goes to build/portfolio/, which git ignores. The logo file has no
// transparency (FS-250), so this recovers it: each pixel's distance from
// white becomes its opacity, drawn in the brand cream. Then headless Chrome
// prints the pages to A4.

'use strict';

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(ROOT, 'build', 'portfolio');
const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find((p) => fs.existsSync(p));

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

// Decode an 8-bit RGB PNG (the logo's format) to rows of RGB bytes.
function decodeRgb(file) {
  const b = fs.readFileSync(file);
  let p = 8, w, h; const idat = [];
  while (p < b.length) {
    const len = b.readUInt32BE(p); const type = b.toString('ascii', p + 4, p + 8); const d = b.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') { w = d.readUInt32BE(0); h = d.readUInt32BE(4); if (d[8] !== 8 || d[9] !== 2) throw new Error('logo is not 8-bit RGB'); }
    if (type === 'IDAT') idat.push(d);
    p += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat)); const stride = w * 3 + 1; const rows = []; let prev = Buffer.alloc(w * 3);
  for (let y = 0; y < h; y++) {
    const f = raw[y * stride]; const line = Buffer.from(raw.subarray(y * stride + 1, (y + 1) * stride));
    for (let x = 0; x < line.length; x++) {
      const a = x >= 3 ? line[x - 3] : 0, up = prev[x], c = x >= 3 ? prev[x - 3] : 0; let v = line[x];
      if (f === 1) v += a; else if (f === 2) v += up; else if (f === 3) v += Math.floor((a + up) / 2);
      else if (f === 4) { const pp = a + up - c, pa = Math.abs(pp - a), pb = Math.abs(pp - up), pc = Math.abs(pp - c); v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? up : c); }
      line[x] = v & 255;
    }
    rows.push(line); prev = line;
  }
  return { w, h, rows };
}

function recoveredLogo() {
  const { w, h, rows } = decodeRgb(path.join(ROOT, 'design', 'brand', 'dibon_logo.png'));
  const out = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    out[y * (w * 4 + 1)] = 0;
    for (let x = 0; x < w; x++) {
      const o = y * (w * 4 + 1) + 1 + x * 4;
      out[o] = 255; out[o + 1] = 242; out[o + 2] = 235;
      out[o + 3] = Math.min(255, (255 - rows[y][x * 3]) * 36);
    }
  }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(out)), chunk('IEND', Buffer.alloc(0))]);
  return `data:image/png;base64,${png.toString('base64')}`;
}

if (!CHROME) throw new Error('No Chrome or Edge found for headless printing');
fs.mkdirSync(OUT, { recursive: true });
const html = fs.readFileSync(path.join(__dirname, 'pages.html'), 'utf8').split('__LOGO__').join(recoveredLogo());
const htmlOut = path.join(OUT, 'portfolio.html');
fs.writeFileSync(htmlOut, html);
const pdfOut = path.join(OUT, 'dibon-financial-services-portfolio-p1-5.pdf');
execFileSync(CHROME, [
  '--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=8000',
  `--print-to-pdf=${pdfOut}`, `file:///${htmlOut.replace(/\\/g, '/')}`,
], { stdio: 'ignore' });
console.log(`built ${path.relative(ROOT, pdfOut)} (${fs.statSync(pdfOut).size} bytes)`);
