// Reads the portfolio copy from docs/marketing/portfolio.md (FS-352).
//
// The Markdown is the single source of every word in the portfolio. Its
// format is strict, so a mistake stops the build with a message that says
// where, instead of quietly printing the wrong words:
//
//   ## Page            a section
//   ### Card           an item within the section, in page order
//   **Label:** text    a field; the text may wrap onto following lines
//   **Label:**         a list field; its items follow as "- " lines, and an
//   - item               item may wrap onto lines indented by two spaces
//
// Text before the first "##" is the editors' preamble and is not read.

'use strict';

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', '..', 'docs', 'marketing', 'portfolio.md');

function parse(text, file = FILE) {
  const lines = text.replace(/\r\n/g, '\n').replace(/^---\n[\s\S]*?\n---\n/, (fm) => '\n'.repeat(fm.split('\n').length - 1)).split('\n');
  const sections = [];
  let section = null;
  let target = null; // the section or item that fields go into
  let field = null; // { holder, key, list }
  const where = (i) => `${path.relative(process.cwd(), file)}:${i + 1}`;
  lines.forEach((raw, i) => {
    const line = raw.replace(/\s+$/, '');
    let m;
    if ((m = line.match(/^## (.+)$/))) {
      section = { title: m[1], fields: {}, items: [], line: i + 1 };
      sections.push(section);
      target = section; field = null;
    } else if (!section) {
      // preamble
    } else if ((m = line.match(/^### (.+)$/))) {
      const item = { title: m[1], fields: {}, line: i + 1 };
      section.items.push(item);
      target = item; field = null;
    } else if ((m = line.match(/^\*\*([^*]+):\*\*\s*(.*)$/))) {
      if (m[1] in target.fields) throw new Error(`${where(i)}: "${m[1]}" appears twice in "${target.title}"`);
      target.fields[m[1]] = m[2] ? m[2] : [];
      field = { holder: target.fields, key: m[1], list: !m[2] };
    } else if ((m = line.match(/^- (.+)$/))) {
      if (!field || !field.list) throw new Error(`${where(i)}: a list item with no list label above it`);
      field.holder[field.key].push(m[1]);
    } else if ((m = line.match(/^ {2}(\S.*)$/)) && field && field.list && field.holder[field.key].length) {
      const list = field.holder[field.key];
      list[list.length - 1] += ` ${m[1]}`;
    } else if (line === '') {
      field = field && field.list ? field : null;
    } else if (field && !field.list) {
      field.holder[field.key] += ` ${line.trim()}`;
    } else {
      throw new Error(`${where(i)}: text with no label, "${line.slice(0, 40)}". Every line belongs to a **Label:**`);
    }
  });
  return sections;
}

// Escapes for HTML and turns *words* into the highlight tag.
function inline(s, tag = 'span') {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*([^*]+)\*/g, `<${tag}>$1</${tag}>`);
}

// Splits a "Label: text" list item at its first colon.
function pair(s) {
  const at = s.indexOf(': ');
  if (at < 0) throw new Error(`"${s}" needs a label before a colon`);
  return [s.slice(0, at), s.slice(at + 2)];
}

function load(file = FILE) {
  const sections = parse(fs.readFileSync(file, 'utf8'), file);
  const byTitle = new Map(sections.map((s) => [s.title, s]));
  const need = (holder, key, ctx) => {
    if (!(key in holder.fields)) throw new Error(`portfolio copy: "${ctx}" has no **${key}:**`);
    return holder.fields[key];
  };
  const section = (title) => {
    const s = byTitle.get(title);
    if (!s) throw new Error(`portfolio copy: no "## ${title}" section`);
    return {
      title: s.title,
      get: (key) => need(s, key, s.title),
      has: (key) => key in s.fields,
      items: (count) => {
        if (count !== undefined && s.items.length !== count) {
          throw new Error(`portfolio copy: "${s.title}" has ${s.items.length} cards; the layout has room for ${count}. Change the design first, then the copy`);
        }
        return s.items.map((it) => ({ title: it.title, get: (key) => need(it, key, `${s.title} › ${it.title}`), has: (key) => key in it.fields }));
      },
    };
  };
  return { sections, section, inline, pair };
}

module.exports = { load, parse, inline, pair, FILE };
