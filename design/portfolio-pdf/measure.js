// Measures every printed page of both editions for overflow: content past
// the page edge, content running under the footer (FS-593), and boxes whose
// content is clipped (FS-541). Build first:
//   node design/portfolio-pdf/build.js --html-only
//   node design/portfolio-pdf/measure.js
// Prints nothing under an edition when every page fits; exits 1 otherwise.
// Proven by padding the omni-channel intro: page 15 reported 1667 px of
// content on an 1123 px page.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find((p) => fs.existsSync(p));
const probe = `<script>window.addEventListener('load',()=>setTimeout(()=>{const out=[];document.querySelectorAll('.page').forEach((pg,i)=>{const pr=pg.getBoundingClientRect();let maxB=0;const clipped=[];pg.querySelectorAll('*').forEach(el=>{const r=el.getBoundingClientRect();if(!r.width||!r.height)return;const cs=getComputedStyle(el);if(cs.position==='absolute'&&/footer|foot|folio/i.test(el.className))return;maxB=Math.max(maxB,r.bottom-pr.top);if(el.scrollHeight>el.clientHeight+2&&cs.overflow!=='visible'&&el.clientHeight>0)clipped.push((el.className||el.tagName)+':'+(el.scrollHeight-el.clientHeight));if(r.right-pr.left>pr.width+1)clipped.push('wide '+(el.className||el.tagName));});const foot=pg.querySelector('[class*=foot]');const fTop=foot?foot.getBoundingClientRect().top-pr.top:pr.height;let cB=0;pg.querySelectorAll('.content *').forEach(el=>{const r=el.getBoundingClientRect();if(r.width&&r.height)cB=Math.max(cB,r.bottom-pr.top);});out.push({page:i+1,cls:pg.className,heightPx:Math.round(pr.height),contentBottom:Math.round(maxB),footerTop:Math.round(fTop),bodyBottom:Math.round(cB),clipped:clipped.slice(0,4)});});const pre=document.createElement('pre');pre.id='measure';pre.textContent=JSON.stringify(out);document.body.appendChild(pre);},500));</script>`;
let bad = 0;
for (const f of ['portfolio-full.html', 'portfolio-short.html']) {
  const src = path.join(ROOT, 'build/portfolio', f);
  const tmp = path.join(path.dirname(src), 'measure-' + f);
  fs.writeFileSync(tmp, fs.readFileSync(src, 'utf8').replace('</body>', probe + '</body>'));
  const dom = execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--virtual-time-budget=8000', '--dump-dom', 'file:///' + tmp.replace(/\\/g, '/')], { encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'ignore'] });
  fs.unlinkSync(tmp);
  const m = dom.match(/<pre id="measure">([^<]*)<\/pre>/);
  if (!m) { console.log(f, 'NO MEASURE'); continue; }
  const rows = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
  console.log('==', f, rows.length, 'pages');
  for (const r of rows) {
    const over = r.contentBottom > r.heightPx + 1;
    const under = r.bodyBottom > r.footerTop + 1;
    if (over || under || r.clipped.length) bad++, console.log(' page', r.page, r.cls, 'height', r.heightPx, 'content', r.contentBottom, 'body', r.bodyBottom, 'footer', r.footerTop, under ? 'UNDER THE FOOTER' : '', r.clipped.join(' | '));
  }
}
process.exit(bad ? 1 : 0);
