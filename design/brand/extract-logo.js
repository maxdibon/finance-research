// Extracts one image XObject and its soft mask from a PDF as an RGBA PNG.
//   node extract-logo.js <pdf> <objNum> <out.png>
const fs = require('fs');
const zlib = require('zlib');
const [pdfPath, objNum, outPath] = process.argv.slice(2);
const buf = fs.readFileSync(pdfPath);
const s = buf.toString('latin1');

function getObj(n) {
  const re = new RegExp('(?:^|[^0-9])' + n + ' 0 obj\\s*<<');
  const m = re.exec(s);
  if (!m) throw new Error('object not found: ' + n);
  const start = m.index + m[0].indexOf('<<');
  // Find matching >> for the dictionary.
  let depth = 0, i = start;
  for (; i < s.length; i++) {
    if (s.startsWith('<<', i)) { depth++; i++; }
    else if (s.startsWith('>>', i)) { depth--; i++; if (depth === 0) break; }
  }
  const dict = s.slice(start, i + 1);
  let p = s.indexOf('stream', i);
  p += 6; if (s[p] === '\r') p++; if (s[p] === '\n') p++;
  let len = dict.match(/\/Length\s+(\d+)(\s+0\s+R)?/);
  let L = +len[1];
  if (len[2]) { const lm = new RegExp('(?:^|[^0-9])' + len[1] + ' 0 obj\\s*(\\d+)').exec(s); L = +lm[1]; }
  return { dict, data: buf.subarray(p, p + L) };
}

function decode(o) {
  let d = o.data;
  if (/\/FlateDecode/.test(o.dict)) d = zlib.inflateSync(d);
  const w = +o.dict.match(/\/Width\s+(\d+)/)[1];
  const h = +o.dict.match(/\/Height\s+(\d+)/)[1];
  const bpc = +o.dict.match(/\/BitsPerComponent\s+(\d+)/)[1];
  const pred = o.dict.match(/\/Predictor\s+(\d+)/);
  const colors = /\/DeviceGray/.test(o.dict) || /\/SMask/.test('') ? 1 : null;
  return { d, w, h, bpc, pred: pred ? +pred[1] : 1 };
}

function unpredict(d, w, h, comps) {
  const stride = w * comps; const out = Buffer.alloc(stride * h); let prev = Buffer.alloc(stride);
  for (let y = 0; y < h; y++) {
    const f = d[y * (stride + 1)]; const line = Buffer.from(d.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)));
    for (let x = 0; x < stride; x++) {
      const a = x >= comps ? line[x - comps] : 0, up = prev[x], c = x >= comps ? prev[x - comps] : 0; let v = line[x];
      if (f === 1) v += a; else if (f === 2) v += up; else if (f === 3) v += Math.floor((a + up) / 2);
      else if (f === 4) { const pp = a + up - c, pa = Math.abs(pp - a), pb = Math.abs(pp - up), pc = Math.abs(pp - c); v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? up : c); }
      line[x] = v & 255;
    }
    line.copy(out, y * stride); prev = line;
  }
  return out;
}

function crc32(b) { let c, crc = 0xffffffff; for (let n = 0; n < b.length; n++) { c = (crc ^ b[n]) & 0xff; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crc = (crc >>> 8) ^ c; } return (crc ^ 0xffffffff) >>> 0; }
function chunk(t, d) { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t, 'ascii'), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc32(td)); return Buffer.concat([l, td, c]); }

const img = getObj(objNum);
const smaskRef = img.dict.match(/\/SMask\s+(\d+)\s+0\s+R/);
const I = decode(img);
const comps = I.d.length / (I.w * I.h) >= 3 && I.pred === 1 ? 3 : 3;
let rgb = I.pred >= 10 ? unpredict(I.d, I.w, I.h, 3) : I.d;
let alpha = Buffer.alloc(I.w * I.h, 255);
if (smaskRef) {
  const m = getObj(smaskRef[1]); const M = decode(m);
  alpha = M.pred >= 10 ? unpredict(M.d, M.w, M.h, 1) : M.d;
}
console.log({ w: I.w, h: I.h, bpc: I.bpc, pred: I.pred, rgbBytes: rgb.length, alphaBytes: alpha.length, smask: !!smaskRef });
const raw = Buffer.alloc((I.w * 4 + 1) * I.h);
for (let y = 0; y < I.h; y++) {
  raw[y * (I.w * 4 + 1)] = 0;
  for (let x = 0; x < I.w; x++) {
    const o = y * (I.w * 4 + 1) + 1 + x * 4, i = y * I.w + x;
    raw[o] = rgb[i * 3]; raw[o + 1] = rgb[i * 3 + 1]; raw[o + 2] = rgb[i * 3 + 2]; raw[o + 3] = alpha[i];
  }
}
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(I.w, 0); ihdr.writeUInt32BE(I.h, 4); ihdr[8] = 8; ihdr[9] = 6;
fs.writeFileSync(outPath, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]));
// Report the colour of opaque pixels.
const t = {}; for (let i = 0; i < I.w * I.h; i++) if (alpha[i] > 200) { const k = [rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]].map((v) => v.toString(16).padStart(2, '0')).join(''); t[k] = (t[k] || 0) + 1; }
console.log('opaque colours', Object.entries(t).sort((a, b) => b[1] - a[1]).slice(0, 4));
