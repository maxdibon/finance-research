// An institution's product questionnaires (FS-815 to FS-817): one Word
// document per group of the vocabulary, built from the product's draft,
// with a form field (a Word content control) for every item still to
// answer, tagged with the item's id so tools/products/read-back.js can
// read the answers straight back into the draft.
//
//   node tools/products/questionnaires.js docs/products/<draft>.md [--out build/products] [--date 2026-10-14]
//
// The repository installs no packages: install docx anywhere
// (`npm install docx`) and point DOCX_MODULE at it if Node cannot find it.
// The documents land in build/, which git ignores. Render one and look at
// every page before sending it (design system, the checklist).

'use strict';

const fs = require('fs');
const path = require('path');
const zip = require('./zip');
const { parse, purposes } = require('./draft');

const ROOT = path.join(__dirname, '..', '..');
let docx;
try { docx = require(process.env.DOCX_MODULE || 'docx'); } catch (e) {
  console.error('The docx package was not found: `npm install docx` somewhere, then set DOCX_MODULE to its folder.');
  process.exit(1);
}
const ds = require(path.join(ROOT, 'design/system/docx.js'))(docx);
const { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle } = docx;

const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : dflt; };
const draftPath = args.find((a) => a.endsWith('.md'));
if (!draftPath) { console.error('Give the draft: node tools/products/questionnaires.js docs/products/<draft>.md'); process.exit(1); }
const outDir = path.resolve(opt('--out', path.join(ROOT, 'build/products')));
const date = opt('--date', new Date().toISOString().slice(0, 10));
// FS-1039: the document's number and version (design-system §7), in its footer.
const number = opt('--number', '');
const docVersion = opt('--version', '');
const longDate = new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

const draft = parse(fs.readFileSync(draftPath, 'utf8'));
if (draft.problems.length) { console.error(draft.problems.join('\n')); process.exit(1); }
const why = purposes(fs.readFileSync(path.join(ROOT, 'docs/specs/product-versions.md'), 'utf8'));
const [inst, rest] = (draft.front.name || '').split(' — ');
if (!inst || !rest) { console.error('The front matter\'s name must read "<institution> — <product>, product version <n> (draft)"'); process.exit(1); }
const product = rest.split(', product version')[0];
const version = (rest.match(/product version (\d+)/) || [])[1] || '1';

// No register ids leave the building: only the regulations are cited.
const plain = (s) => s.replace(/\*\*/g, '').replace(/`/g, '')
  .replace(/RC-01's checklist/g, 'The checklist in your requirement document')
  .replace(/the documents RC-01 lists/g, 'the documents your requirement document lists')
  .replace(/\s*\((?:[^()]*?\b(?:open answers?|open questions?|lender-rules|RC-\d|OB-[A-Z]|LQ-\d|FS-\d|MF-\d|ID-\d|DE-\d|CR-\d|crb)[^()]*?)\)/gi, '')
  .replace(/Not in R1/g, 'Not in the first release')
  .replace(/;?\s*\b(?:LQ|RC|FS|MF|ID|DE|CR|OB)-[A-Z-]*\d{2,3}\b/g, '')
  .replace(/\s+([,;.:])/g, '$1').replace(/[:;,]\s*$/, '').trim();

const GROUPS = {
  A: { file: 'A-product-terms', kicker: 'Product terms', who: 'product owner', title: 'Group A · The product\'s terms',
    intro: `These are the terms a borrower sees. Once the product is approved by two of ${inst}'s people and CBK, they are published on the product's page and in each key information document, as the lender regulations require (regs 47 and 48).` },
  B: { file: 'B-eligibility-and-limits', kicker: 'Credit policy', who: 'credit lead', title: 'Group B · Eligibility and limits',
    intro: `This is ${inst}'s credit policy for the product. Who may borrow is published; the thresholds behind a decision (scores, ratios, limits) stay internal.` },
  C: { file: 'C-how-it-runs', kicker: 'Operations', who: 'operations lead', title: 'Group C · How it runs',
    intro: 'This is how the product is operated on the platform. None of it is published.' },
};
// FS-1061: who answers each part, in the institution's own roles
// (--who "A=CEO,B=loan officers,C=loan officers"), and where the file goes
// back (--return 'upload it to the folder "Your answers"').
for (const pair of opt('--who', '').split(',').filter(Boolean)) {
  const [k, who] = pair.split('=').map((s) => s.trim());
  if (!GROUPS[k] || !who) { console.error(`--who: "${pair}" is not <A|B|C>=<role>`); process.exit(1); }
  GROUPS[k].who = who;
}
const returnTo = opt('--return', 'return the file itself to your Dibon delivery lead');
const ASK_LABEL = { Confirm: 'Confirm', Choose: 'Choose one', Provide: 'Provide', Decide: 'Decide' };
// The values the read-back keys on; the display text is free to change.
const CONFIRM = [{ text: 'Confirmed', value: 'confirmed' }, { text: 'Not right: the correct value below', value: 'not-right' }];

const LINE = { style: BorderStyle.SINGLE, size: 4, color: ds.COLOURS.line };
const para = (runs, o = {}) => new Paragraph({ children: runs, spacing: { after: o.after ?? 40, line: 252 }, keepNext: o.keepNext });
const cell = (children, w, o = {}) => new TableCell({
  width: { size: w, type: WidthType.DXA },
  shading: o.fill ? { type: ShadingType.CLEAR, color: 'auto', fill: o.fill } : undefined,
  margins: { top: 80, bottom: 80, left: 110, right: 110 },
  borders: { top: LINE, bottom: LINE, left: LINE, right: LINE },
  children,
});
const W = [2500, 3626, 2900];

// A form field is first written as a marker paragraph, then swapped for
// the content control's XML once docx has packed the document.
const fields = [];
const field = (tag, alias, kind, placeholder, options = []) => {
  fields.push({ tag, alias, kind, placeholder, options });
  return para([ds.run(`@@FIELD${fields.length - 1}@@`, { size: 19 })], { after: 60 });
};
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const RPR = (colour) => `<w:rPr><w:rFonts w:ascii="${ds.FONT}" w:hAnsi="${ds.FONT}"/>${colour ? `<w:color w:val="${colour}"/>` : ''}<w:sz w:val="19"/></w:rPr>`;
const fieldXml = (f, n) => `<w:sdt><w:sdtPr>${RPR()}<w:alias w:val="${esc(f.alias)}"/><w:tag w:val="${esc(f.tag)}"/><w:id w:val="${41000 + n}"/><w:lock w:val="sdtLocked"/><w:showingPlcHdr/>${
  f.kind === 'list'
    ? `<w:dropDownList>${f.options.map((o) => `<w:listItem w:displayText="${esc(o.text)}" w:value="${esc(o.value)}"/>`).join('')}</w:dropDownList>`
    : '<w:text w:multiLine="1"/>'
}</w:sdtPr><w:sdtContent><w:p><w:pPr><w:pBdr><w:top w:val="single" w:sz="4" w:space="2" w:color="${ds.COLOURS.line}"/><w:left w:val="single" w:sz="4" w:space="2" w:color="${ds.COLOURS.line}"/><w:bottom w:val="single" w:sz="4" w:space="2" w:color="${ds.COLOURS.line}"/><w:right w:val="single" w:sz="4" w:space="2" w:color="${ds.COLOURS.line}"/></w:pBdr><w:shd w:val="clear" w:color="auto" w:fill="${ds.COLOURS.cream}"/><w:spacing w:before="20" w:after="60" w:line="252" w:lineRule="auto"/></w:pPr><w:r>${RPR(ds.COLOURS.muted)}<w:t xml:space="preserve">${esc(f.placeholder)}</w:t></w:r></w:p></w:sdtContent></w:sdt>`;

function swapFields(xml) {
  return xml.replace(/<w:p(?: [^>]*)?>(?:(?!<w:p[ >])[\s\S])*?@@FIELD(\d+)@@[\s\S]*?<\/w:p>/g, (m, n) => fieldXml(fields[Number(n)], Number(n)));
}

function answerCell(it) {
  const alias = `${it.id} · ${it.name}`;
  const out = [para([ds.run(ASK_LABEL[it.ask], { bold: true, color: ds.COLOURS.plum, size: 17 })], { after: 40 })];
  if (it.ask === 'Confirm') {
    out.push(field(it.id, alias, 'list', 'Confirmed, or not right?', CONFIRM));
    out.push(field(`${it.id}.note`, `${alias}: correction or comment`, 'text', 'The correct value, or a comment'));
  } else if (it.ask === 'Choose') {
    const opts = it.options.map(plain);
    out.push(field(it.id, alias, 'list', 'Choose one', opts.map((o, i) => ({ text: o, value: String(i + 1) }))));
    out.push(field(`${it.id}.note`, `${alias}: detail or comment`, 'text', opts.some((o) => /\(give /.test(o)) ? 'The detail asked for, or a comment' : 'A comment, if any'));
  } else {
    out.push(field(it.id, alias, 'text', it.ask === 'Decide' ? 'Your decision' : 'Your answer'));
  }
  out.push(new Paragraph({ children: [], spacing: { after: 0, line: 120 } }));
  return out;
}

function itemRow(it) {
  const purpose = why[it.name];
  const left = [para([ds.run(it.id, { color: ds.COLOURS.muted, size: 16 })], { after: 0 }), para([ds.run(plain(it.name), { bold: true, size: 19 })], { after: purpose ? 40 : 0 })];
  if (purpose) left.push(para([ds.run(plain(purpose), { italics: true, color: ds.COLOURS.muted, size: 17 })], { after: 0 }));
  const value = plain(it.value);
  const mid = [para(ds.rich(value, { size: 19 }), { after: 60 }), para([ds.run(`Source: ${/^None yet/.test(it.source) ? 'none yet: this is what we need' : plain(it.source)}`, { color: ds.COLOURS.muted, size: 16 })], { after: 0 })];
  if (it.ask === 'Choose') mid.splice(1, 0, para([ds.run(`Options: ${it.options.map(plain).join('; ')}`, { color: ds.COLOURS.ink, size: 17 })], { after: 60 }));
  return new TableRow({ cantSplit: true, children: [cell(left, W[0]), cell(mid, W[1]), cell(answerCell(it), W[2])] });
}

const head = (labels) => new TableRow({ tableHeader: true, children: labels.map((h, i) => cell([para([ds.run(h, { bold: true, color: ds.COLOURS.plum, size: 18 })], { after: 0 })], W[i], { fill: ds.COLOURS.headFill })) });

fs.mkdirSync(outDir, { recursive: true });
// FS-1043: --one-file writes the three parts into one document, a section
// each; the read-back takes it whole, as its subject names the groups.
const oneFile = args.includes('--one-file');
// FS-1049: --agreed-on "21 October" sets apart what the institution told us
// then (a Confirm item whose source names it): those follow what needs an
// answer, in one block confirmed with one answer, a correction beside each.
const agreedOn = opt('--agreed-on', '');
const isAgreed = (it) => Boolean(agreedOn) && it.ask === 'Confirm' && it.source.includes(agreedOn);
const AGREED = [{ text: 'All as agreed', value: 'all' }, { text: 'Corrections below', value: 'corrections' }];
function agreedRow(it) {
  const left = [para([ds.run(it.id, { color: ds.COLOURS.muted, size: 16 })], { after: 0 }), para([ds.run(plain(it.name), { bold: true, size: 19 })], { after: 0 })];
  const mid = [para(ds.rich(plain(it.value), { size: 19 }), { after: 0 })];
  const right = [field(`${it.id}.note`, `${it.id} · ${it.name}: correction`, 'text', 'A correction, if any'), new Paragraph({ children: [], spacing: { after: 0, line: 120 } })];
  return new TableRow({ cantSplit: true, children: [cell(left, W[0]), cell(mid, W[1]), cell(right, W[2])] });
}
const partCounts = (key) => {
  const all = draft.items.filter((it) => it.group === key);
  const ask = all.filter((it) => it.ask);
  return { open: ask.filter((it) => !isAgreed(it)).length, told: ask.filter(isAgreed).length, settled: all.length - ask.length };
};
const footerFor = (key) => ds.footer(`${number ? `${number}${docVersion ? ` v${docVersion}` : ''} · ` : ''}Dibon Consulting · ${inst} · ${product}, ${oneFile ? 'part' : 'group'} ${key} · ${longDate}`);
const thanks = () => ds.p(`Thank you. Once all three ${oneFile ? 'parts' : 'groups'} are answered, the product goes to two of ${inst}'s people for approval, then to CBK, where its pricing needs approval (reg 55), and only then is it offered to borrowers.`, { before: 240 });
async function write(sections, subject, title, file, report) {
  const doc = new Document({ creator: 'Dibon Company Limited', title, subject, styles: ds.styles, numbering: ds.numbering, sections });
  const entries = zip.read(await Packer.toBuffer(doc));
  const after = swapFields(entries.get('word/document.xml').toString('utf8'));
  const left = (after.match(/@@FIELD\d+@@/g) || []).length;
  const made = (after.match(/<w:sdt>/g) || []).length;
  if (left || made !== fields.length) throw new Error(`${report}: ${made} fields made of ${fields.length}, ${left} markers left`);
  entries.set('word/document.xml', Buffer.from(after, 'utf8'));
  const out = path.join(outDir, file);
  fs.writeFileSync(out, zip.write(entries));
  return out;
}
const stem = `${inst.replace(/\s+/g, '-')}-${product.replace(/\s+/g, '-')}`;
(async () => {
  const sections = [];
  const made = [];
  for (const key of 'ABC') {
    const g = GROUPS[key];
    const all = draft.items.filter((it) => it.group === key);
    const ask = all.filter((it) => it.ask);
    const settled = all.filter((it) => !it.ask);
    if (!ask.length) { console.log(`group ${key}: nothing to ask`); continue; }
    if (!oneFile) fields.length = 0;
    const first = !oneFile || !made.length;
    const told = ask.filter(isAgreed);
    const open = ask.filter((it) => !isAgreed(it));
    const count = (k) => open.filter((it) => it.ask === k).length;
    const tally = ['Confirm', 'Choose', 'Provide', 'Decide'].filter(count)
      .map((k) => `${count(k)} to ${k === 'Choose' ? 'choose from options' : k.toLowerCase()}`);
    const children = [
      ds.p(`**${longDate}**`, { after: 160 }),
      new Paragraph({ children: [ds.run(`${product} · product version ${version} (${draft.front.status || 'draft'})`, { bold: true, color: ds.COLOURS.plum, size: 26 })], spacing: { after: 60 } }),
      new Paragraph({ children: [ds.run(oneFile ? g.title.replace(/^Group/, 'Part') : g.title, { bold: true, color: ds.COLOURS.aubergine, size: 22 })], spacing: { after: 200 } }),
      ds.p(`**For:** ${inst}'s ${g.who}.`),
      ds.p(g.intro),
    ];
    if (oneFile && first) {
      children.push(ds.p('This questionnaire has three parts, each for the person who knows its answers: A, the product\'s terms; B, eligibility and limits; C, how it runs. One person may answer all three.'));
      if (agreedOn) {
        const rows = [...'ABC'].map((k) => ({ k, ...partCounts(k) })).filter((c) => c.open + c.told);
        children.push(
          ds.p(`**Where to start.** Each part begins with what still needs your answer. What you told us on ${agreedOn} follows it, to confirm with one answer; what is settled comes last.`),
          ds.table([['Part', 'Needs your answer', `You told us on ${agreedOn}: confirm`, 'Already settled'],
            ...rows.map((c) => [`${c.k} · ${GROUPS[c.k].title.replace(/^Group . · /, '')}`, String(c.open), String(c.told), String(c.settled)]),
            ['**All parts**', `**${rows.reduce((s, c) => s + c.open, 0)}**`, `**${rows.reduce((s, c) => s + c.told, 0)}**`, `**${rows.reduce((s, c) => s + c.settled, 0)}**`]], [3026, 2000, 2000, 2000]),
        );
      }
    }
    const toldLine = told.length ? ` **${told.length} things** you told us on ${agreedOn} follow, to confirm with one answer.` : '';
    children.push(ds.p(`What we have comes from what you have given us: your requirement document, your prototype and our meetings. **${open.length} items** need your answer${oneFile ? ' in this part' : ''}: ${tally.join(', ')}.${toldLine} Under each item's name is why it matters; beside each value, where it came from.`, { after: 160 }));
    if (first) {
      children.push(
        ds.h('How to answer'),
        ds.li('Every answer goes in a field in the last column. Click it, then choose from its list or type.'),
        ds.li('**Confirm:** choose "Confirmed", or "Not right" and write the correct value in the field beneath.'),
        ds.li('**Choose one:** pick an option from the list; where it asks for detail, write it beneath.'),
        ds.li('**Provide** or **Decide:** type the answer.'),
        ...(agreedOn ? [ds.li(`**What you told us on ${agreedOn}:** choose "All as agreed" once for the whole list, or "Corrections below" and write each correction beside its item.`)] : []),
        ds.li('Unsure? Leave the field as it is, and we will go through it together.'),
        ds.li(`Save the document under its own name and ${returnTo}. We read the answers from the fields, so please do not retype them elsewhere or turn the file into a PDF.`),
      );
    }
    if (open.length) children.push(ds.h(agreedOn ? 'Needs your answer' : 'The questions'), new Table({ width: { size: ds.WIDTH, type: WidthType.DXA }, columnWidths: W, rows: [head(['Item', 'What we have', 'Your answer']), ...open.map(itemRow)] }));
    if (told.length) {
      children.push(
        ds.h(`What you told us on ${agreedOn}`),
        ds.p(`We have taken these from ${agreedOn}. If they are all as agreed, one answer confirms them all; if any is not, choose "Corrections below" and write the correction beside it.`),
        field(`${key}.agreed`, `Part ${key}: what you told us on ${agreedOn}`, 'list', 'All as agreed, or corrections below?', AGREED),
        new Table({ width: { size: ds.WIDTH, type: WidthType.DXA }, columnWidths: W, rows: [head(['Item', 'What you told us', 'Correction, if any']), ...told.map(agreedRow)] }),
      );
    }
    if (settled.length) {
      children.push(ds.h('Already settled'), ds.p('Nothing to answer here; for your information.'));
      for (const it of settled) children.push(ds.li(`**${it.id} · ${plain(it.name)}:** ${plain(it.value)}. Source: ${plain(it.source).replace(/^The /, 'the ')}.`));
    }
    const section = { properties: ds.page, headers: { default: ds.header(g.kicker) }, footers: { default: footerFor(key) }, children };
    made.push(key);
    if (oneFile) { sections.push(section); continue; }
    children.push(thanks());
    const out = await write([section], `${draft.front.id} · group ${key} · built ${date}`, `${inst} · ${product} · ${g.title}`, `${stem}-${g.file}.docx`, `group ${key}`);
    console.log(`${path.relative(ROOT, out)}: ${ask.length} items, ${fields.length} fields; ${settled.length} settled`);
  }
  if (oneFile && sections.length) {
    sections[sections.length - 1].children.push(thanks());
    const out = await write(sections, `${draft.front.id} · groups ${made.join('')} · built ${date}`, `${inst} · ${product} · questionnaire`, `${stem}-questionnaire.docx`, `parts ${made.join('')}`);
    console.log(`${path.relative(ROOT, out)}: parts ${made.join(', ')}, ${fields.length} fields`);
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
