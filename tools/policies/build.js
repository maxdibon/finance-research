// An institution's policy from its template (FS-1087): a template in
// docs/templates/, the institution's values (a JSON file kept with its
// client folder, outside git), and its theme (design/system/themes/), out
// as a Word document in the institution's look.
//
//   node tools/policies/build.js docs/templates/ict-policy.md <values.json> <out.docx>
//
// The template's document is what lies between <!-- document --> and
// <!-- end -->; the rest is guidance for whoever fills it. In the document:
// "# " the title, "## " a section, "### " a subsection, "- " a bullet, "| " a
// table, a blank line ends a paragraph; <!-- landscape --> and <!-- portrait -->
// start a section of that orientation; <!-- image: name, caption --> places
// the values' assets/<name>.png; {{key}} is the value of that key, or
// "[To confirm: key]" when the values do not give it.

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
let docx;
try { docx = require(process.env.DOCX_MODULE || 'docx'); } catch (e) {
  console.error('The docx package was not found: `npm install docx` somewhere, then set DOCX_MODULE to its folder.');
  process.exit(1);
}

const [template, valuesFile, out] = process.argv.slice(2);
if (!template || !valuesFile || !out) { console.error('Say the template, the values and where to write: node tools/policies/build.js <template.md> <values.json> <out.docx>'); process.exit(1); }
const values = JSON.parse(fs.readFileSync(valuesFile, 'utf8'));
// Each document keeps its own version: "versions" by template id, else "version".
const templateId = (fs.readFileSync(template, 'utf8').match(/^id: *(.+)$/m) || [])[1];
if (values.versions && values.versions[templateId]) values.version = values.versions[templateId];
// And its own number, in the institution's scheme (design-system §7): "numbers" by template id, else "number".
if (values.numbers && values.numbers[templateId]) values.number = values.numbers[templateId];
const theme = values.theme ? JSON.parse(fs.readFileSync(path.resolve(ROOT, values.theme), 'utf8')) : {};
const t = require(path.join(ROOT, 'design', 'system', 'institution-docx.js'))(docx, theme);
const assets = path.resolve(path.dirname(valuesFile), values.assets || '.');

const text = fs.readFileSync(template, 'utf8').replace(/\r\n/g, '\n');
const a = text.indexOf('<!-- document -->');
const b = text.indexOf('<!-- end -->');
if (a < 0 || b < 0) { console.error(`${template}: no <!-- document --> … <!-- end --> block`); process.exit(1); }
const fill = (s) => s.replace(/\{\{([a-z_]+)\}\}/g, (m, k) => (values[k] !== undefined ? String(values[k]) : `[To confirm: ${k.replace(/_/g, ' ')}]`));
const plain = (s) => s.replace(/`/g, '');
const lines = fill(text.slice(a + '<!-- document -->'.length, b)).split('\n');

const sections = [];
let cur = { orientation: 'portrait', children: [] };
let para = [];
let bullet = null; // a bullet's text, continued by the indented lines under it
let rows = [];
let title = '';
const flushPara = () => {
  if (bullet !== null) { cur.children.push(t.li(plain(bullet))); bullet = null; }
  if (para.length) { cur.children.push(t.p(plain(para.join(' ')))); para = []; }
};
const flushTable = () => {
  if (!rows.length) return;
  const cells = rows.filter((r) => !/^\|\s*-/.test(r)).map((r) => r.replace(/^\||\|$/g, '').split('|').map((c) => plain(c.trim())));
  cur.children.push(t.table(cells, null, cur.orientation === 'landscape' ? t.LANDSCAPE_WIDTH : t.WIDTH));
  cur.children.push(t.p('', { after: 60 }));
  rows = [];
};
const flush = () => { flushPara(); flushTable(); };
for (const raw of lines) {
  const line = raw.trimEnd();
  const m = line.match(/^<!-- (landscape|portrait) -->$/);
  if (m) { flush(); sections.push(cur); cur = { orientation: m[1], children: [] }; continue; }
  const im = line.match(/^<!-- image: ([\w-]+)(?:, (.*))? -->$/);
  if (im) {
    flush();
    const f = path.join(assets, `${im[1]}.png`);
    if (fs.existsSync(f)) cur.children.push(t.image(f, cur.orientation === 'landscape' ? 930 : 600));
    else cur.children.push(t.p(`[To confirm: the image ${im[1]}.png, not found beside the values]`));
    if (im[2]) cur.children.push(t.p(im[2], { italics: true, size: 18 }));
    continue;
  }
  if (/^<!--/.test(line)) continue;
  if (line.startsWith('|')) { flushPara(); rows.push(line); continue; }
  flushTable();
  if (!line.trim()) { flushPara(); continue; }
  if (line.startsWith('# ')) { flushPara(); title = plain(line.slice(2)); cur.children.push(...t.titleBlock({ institution: values.institution_legal || values.institution, title, subtitle: values.subtitle })); continue; }
  if (line.startsWith('## ')) { flushPara(); cur.children.push(t.h1(plain(line.slice(3)))); continue; }
  if (line.startsWith('### ')) { flushPara(); cur.children.push(t.h2(plain(line.slice(4)))); continue; }
  if (/^- /.test(line)) { flushPara(); bullet = line.slice(2).trim(); continue; }
  if (bullet !== null && /^ {2,}\S/.test(line)) { bullet += ` ${line.trim()}`; continue; }
  if (bullet !== null) flushPara();
  para.push(line.trim());
}
flush();
sections.push(cur);

const label = `${values.institution} · ${title.replace(/^.*?·\s*/, '')} · v${values.version} draft · ${values.classification || 'Confidential'}`;
const doc = new docx.Document({
  creator: values.institution_legal || values.institution,
  title: `${values.institution} · ${title} · v${values.version}`,
  styles: t.styles,
  numbering: t.numbering,
  sections: sections.filter((s) => s.children.length).map((s) => ({ properties: s.orientation === 'landscape' ? t.landscape : t.portrait, footers: { default: t.footer(label) }, children: s.children })),
});
docx.Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(out, buf); console.log(`written ${out}`); });
