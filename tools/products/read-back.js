// Reads a returned product questionnaire (FS-817): every form field, by
// its tag, merged into the product's draft with the source
// "<institution>, <date>". Nothing is retyped. It reports what was
// answered, what changed a value we had, what needs a person, and what is
// still open, by kind of ask.
//
//   node tools/products/read-back.js clients/<institution>/<returned>.docx [--write] [--date 2026-10-20] [--draft docs/products/<draft>.md]
//
// Without --write it only reports. The returned file is client material:
// keep it in clients/ (which git ignores), never in git. It is untrusted:
// only its document and properties are read, in memory.

'use strict';

const fs = require('fs');
const path = require('path');
const zip = require('./zip');
const { parse, rewrite, cellText } = require('./draft');

const ROOT = path.join(__dirname, '..', '..');
process.on('uncaughtException', (e) => { console.error(e.code === 'ENOENT' ? `Not found: ${e.path}` : e.message); process.exit(1); });
const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const file = args.find((a) => /\.docx$/i.test(a));
if (!file) { console.error('Give the returned document: node tools/products/read-back.js <file>.docx [--write]'); process.exit(1); }

const unxml = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, '\'').replace(/&amp;/g, '&');
const attr = (xml, el, name) => { const m = xml.match(new RegExp(`<w:${el}\\b[^>]*\\bw:${name}="([^"]*)"`)); return m ? unxml(m[1]) : undefined; };

// Every content control in the document: its tag, whether it still shows
// its placeholder, its text, and for a list, the value chosen.
function readFields(xml) {
  const out = new Map();
  for (const m of xml.matchAll(/<w:sdt>([\s\S]*?)<\/w:sdt>/g)) {
    const pr = (m[1].match(/<w:sdtPr>([\s\S]*?)<\/w:sdtPr>/) || [])[1] || '';
    const body = (m[1].match(/<w:sdtContent>([\s\S]*?)<\/w:sdtContent>/) || [])[1] || '';
    const tag = attr(pr, 'tag', 'val');
    if (!tag) continue;
    const text = body.split('</w:p>')
      .map((para) => [...para.matchAll(/<w:t(?: [^>]*)?>([^<]*)<\/w:t>|<w:br\/>|<w:tab\/>/g)]
        .map((x) => (x[1] !== undefined ? unxml(x[1]) : x[0] === '<w:tab/>' ? ' ' : '\n')).join(''))
      .join('\n').trim();
    const items = [...pr.matchAll(/<w:listItem\b([^>]*)\/>/g)].map((x) => ({ text: unxml((x[1].match(/w:displayText="([^"]*)"/) || [])[1] || ''), value: unxml((x[1].match(/w:value="([^"]*)"/) || [])[1] || '') }));
    const blank = /<w:showingPlcHdr\/>/.test(pr) || !text;
    const chosen = items.length ? items.find((i) => i.text === text) : undefined;
    out.set(tag, { text: blank ? '' : text, blank, list: items.length > 0, value: chosen ? chosen.value : undefined });
  }
  return out;
}

const entries = zip.read(fs.readFileSync(file));
const docXml = entries.get('word/document.xml');
const coreXml = entries.get('docProps/core.xml');
if (!docXml) { console.error('Not a Word document: no word/document.xml'); process.exit(1); }
const core = coreXml ? coreXml.toString('utf8') : '';
const subject = unxml((core.match(/<dc:subject>([^<]*)<\/dc:subject>/) || [])[1] || '');
const sm = subject.match(/^(\S+) · group ([ABC]) · built (\d{4}-\d{2}-\d{2})$/);
if (!sm) { console.error(`This is not one of our questionnaires (its subject is "${subject}")`); process.exit(1); }
const [, draftId, group, built] = sm;
const modified = (core.match(/<dcterms:modified[^>]*>(\d{4}-\d{2}-\d{2})/) || [])[1];
const date = opt('--date') || modified || new Date().toISOString().slice(0, 10);

const draftPath = opt('--draft') || path.join(ROOT, 'docs/products', `${draftId}.md`);
const md = fs.readFileSync(draftPath, 'utf8');
const draft = parse(md);
if (draft.problems.length) { console.error(`The draft is out of form:\n${draft.problems.join('\n')}`); process.exit(1); }
const inst = (draft.front.name || '').split(' — ')[0];
const by = `${inst}, ${date}`;
const fields = readFields(docXml.toString('utf8'));

const answered = [];
const changed = [];
const forPerson = [];
const updates = [];
const items = draft.items.filter((it) => it.group === group);
const known = new Set();
// "Shorter (give the days)" with "15 days" beneath → "Shorter: 15 days"
const GIVE = /\s*\(give [^)]*\)$/;
const withDetail = (option, note) => (note ? `${option.replace(GIVE, '')}: ${note}` : option);
const same = (a, b) => cellText(a) === cellText(b);

for (const it of items) {
  const main = fields.get(it.id);
  const note = fields.get(`${it.id}.note`);
  known.add(it.id); known.add(`${it.id}.note`);
  if (!main) { if (it.ask) forPerson.push(`${it.id} ${it.name}: no field for it in this document (built ${built}; the draft may have changed since)`); continue; }
  const comment = note && note.text;
  if (!it.ask) {
    // Already settled, so the options are gone: compare the value this
    // answer would have made. Reading the same file twice changes nothing;
    // a different answer goes to a person, never over the one we have.
    if (main.blank || !it.source.startsWith(inst) || main.value === 'confirmed') continue;
    const would = main.value === 'not-right' ? comment : main.list && GIVE.test(main.text) ? withDetail(main.text, comment) : main.text;
    if (!same(would, it.value)) changed.push(`${it.id} ${it.name}: answered again, "${cellText(would)}"; the draft already has "${it.value}" (${it.source}). Not applied`);
    continue;
  }
  if (main.blank) continue;
  let value;
  if (it.ask === 'Confirm') {
    if (main.value === 'confirmed') {
      // A comment may qualify the answer: a person reads it before it counts.
      if (comment) { forPerson.push(`${it.id} ${it.name}: confirmed, with a comment: "${cellText(comment)}". Not applied`); continue; }
      value = it.value;
    } else if (main.value === 'not-right') {
      if (!comment) { forPerson.push(`${it.id} ${it.name}: marked not right, with no correct value given`); continue; }
      value = comment;
      changed.push(`${it.id} ${it.name}: "${it.value}" (${it.source}) is not right; now "${cellText(comment)}"`);
    } else { forPerson.push(`${it.id} ${it.name}: an answer not on the list: "${main.text}"`); continue; }
  } else if (it.ask === 'Choose') {
    const option = it.options[Number(main.value) - 1];
    if (!option) { forPerson.push(`${it.id} ${it.name}: an answer not on the list: "${main.text}"`); continue; }
    if (GIVE.test(option)) {
      if (!comment) { forPerson.push(`${it.id} ${it.name}: chose "${option}" without the detail`); continue; }
      value = withDetail(option, comment);
    } else {
      if (comment) { forPerson.push(`${it.id} ${it.name}: chose "${option}", with a comment: "${cellText(comment)}". Not applied`); continue; }
      value = option;
    }
  } else {
    value = main.text;
  }
  answered.push(`${it.id} ${it.name}: ${cellText(value)}`);
  updates.push({ ...it, value, source: by, askText: '—' });
}
const strangers = [...fields.keys()].filter((t) => !known.has(t));
for (const t of strangers) forPerson.push(`${t}: a field this draft does not have`);

const after = draft.items.map((it) => updates.find((u) => u.id === it.id) || it);
const open = {};
for (const it of after.filter((x) => x.askText !== '—')) (open[it.ask] = open[it.ask] || []).push(`${it.id} ${it.name}`);

const say = (title, list) => { console.log(`\n${title} (${list.length})`); for (const l of list) console.log(`  ${l}`); };
console.log(`${path.basename(file)}: ${draftId}, group ${group}, built ${built}; answers dated ${date}`);
say('Answered', answered);
say('Changed a value we had', changed);
say('For a person to look at', forPerson);
console.log('\nStill open, whole draft');
for (const k of ['Confirm', 'Choose', 'Provide', 'Decide']) if (open[k]) console.log(`  ${k} (${open[k].length}): ${open[k].join('; ')}`);
if (!Object.keys(open).length) console.log('  Nothing: every ask is answered');

if (args.includes('--write') && updates.length) {
  let out = rewrite(md, updates);
  out = out.replace(/^last_reviewed: .*$/m, `last_reviewed: ${new Date().toISOString().slice(0, 10)}`);
  fs.writeFileSync(draftPath, out);
  console.log(`\nWrote ${updates.length} answers into ${path.relative(ROOT, draftPath)}`);
} else if (updates.length) {
  console.log('\nNothing written: run again with --write to merge these into the draft');
}
