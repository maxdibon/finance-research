// An institution's own documents in Word: the same components as Dibon's
// look (docx.js), with the institution's tokens in place of ours, or the
// plain theme until it has one (docs/company/design-system.md, "Whose look a
// document takes"; FS-1087). Used by tools/policies/build.js.
//
//   const docx = require('docx');
//   const t = require('<repo>/design/system/institution-docx.js')(docx, theme);
//
// A theme is a JSON file in design/system/themes/ (plain.json the default):
// its name, its main colour (headings), its accent, its fonts, and its logo
// where it has one. Never whimsy in an institution's documents.

const fs = require('fs');
const path = require('path');

module.exports = function institution(docx, theme = {}) {
  const {
    Paragraph, TextRun, ImageRun, AlignmentType, Table, TableRow, TableCell,
    WidthType, ShadingType, BorderStyle, Footer, PageNumber, LevelFormat, PageOrientation, HeadingLevel,
  } = docx;
  const plain = JSON.parse(fs.readFileSync(path.join(__dirname, 'themes', 'plain.json'), 'utf8'));
  const T = { ...plain, ...theme, colours: { ...plain.colours, ...(theme.colours || {}) } };
  const C = T.colours;
  const FONT = T.font;
  const WIDTH = 9026; // A4 at 1-inch margins, in twentieths of a point
  const LANDSCAPE_WIDTH = 13958;

  const run = (text, o = {}) => new TextRun({ text, font: FONT, size: o.size || 21, bold: o.bold, italics: o.italics, color: o.color || C.ink, highlight: o.confirm ? 'yellow' : undefined });
  // "[To confirm: …]" highlighted, so nothing undecided goes out unseen; **bold** honoured.
  const rich = (s, o = {}) => String(s).split(/(\[To confirm[^\]]*\]|\*\*[^*]+\*\*)/).filter(Boolean).map((part) => {
    if (part.startsWith('[To confirm')) return run(part, { ...o, confirm: true, bold: true });
    if (part.startsWith('**')) return run(part.slice(2, -2), { ...o, bold: true });
    return run(part, o);
  });
  const p = (s, o = {}) => new Paragraph({ children: rich(s, o), spacing: { after: o.after ?? 120, line: 276 }, alignment: o.align, keepNext: o.keepNext });
  const h1 = (s) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [run(s, { bold: true, size: 28, color: C.main })], spacing: { before: 320, after: 140 }, keepNext: true });
  const h2 = (s) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [run(s, { bold: true, size: 23, color: C.main })], spacing: { before: 220, after: 100 }, keepNext: true });
  const li = (s) => new Paragraph({ children: rich(s), numbering: { reference: 'dots', level: 0 }, spacing: { after: 70, line: 264 } });
  const LINE = { style: BorderStyle.SINGLE, size: 4, color: C.line };
  const cell = (s, w, head) => new TableCell({
    width: { size: w, type: WidthType.DXA },
    shading: head ? { type: ShadingType.CLEAR, color: 'auto', fill: C.headFill } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    borders: { top: LINE, bottom: LINE, left: LINE, right: LINE },
    children: [new Paragraph({ children: rich(s, { size: 19, bold: head }), spacing: { after: 0, line: 252 } })],
  });
  // Columns share the width by their header's length, within bounds, unless given.
  const table = (rows, widths, total = WIDTH) => {
    const n = rows[0].length;
    let w = widths;
    if (!w) {
      const weight = rows[0].map((_, j) => Math.min(60, Math.max(14, ...rows.map((r) => String(r[j] || '').length))));
      const sum = weight.reduce((a, b) => a + b, 0);
      w = weight.map((x) => Math.floor((x / sum) * total));
      w[n - 1] += total - w.reduce((a, b) => a + b, 0);
    }
    return new Table({ width: { size: total, type: WidthType.DXA }, columnWidths: w, rows: rows.map((r, i) => new TableRow({ tableHeader: i === 0, children: r.map((c, j) => cell(c, w[j], i === 0)) })) });
  };
  // A PNG at a given width in pixels, its height kept in proportion.
  const image = (file, widthPx) => {
    const buf = fs.readFileSync(file);
    const wd = buf.readUInt32BE(16);
    const ht = buf.readUInt32BE(20);
    return new Paragraph({ children: [new ImageRun({ type: 'png', data: buf, transformation: { width: widthPx, height: Math.round((widthPx * ht) / wd) } })], spacing: { after: 120 } });
  };
  const logo = T.logo && fs.existsSync(path.resolve(__dirname, T.logo)) ? image(path.resolve(__dirname, T.logo), 140) : null;
  const titleBlock = ({ institution, title, subtitle }) => [
    ...(logo ? [logo] : []),
    p(institution, { size: 24, bold: true, after: 40, color: C.muted }),
    new Paragraph({ children: [run(title, { bold: true, size: 40, color: C.main })], spacing: { after: 120 } }),
    ...(subtitle ? [p(subtitle, { italics: true, color: C.muted, after: 240 })] : []),
  ];
  const footer = (label) => new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [run(`${label} · page `, { size: 16, color: C.muted }), new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: C.muted })] })] });
  const portrait = { page: { size: { width: 11906, height: 16838 }, margin: { top: 1300, bottom: 1200, left: 1440, right: 1440 } } };
  const landscape = { page: { size: { width: 11906, height: 16838, orientation: PageOrientation.LANDSCAPE }, margin: { top: 900, bottom: 900, left: 1000, right: 1000 } } };

  return {
    theme: T, FONT, WIDTH, LANDSCAPE_WIDTH, run, rich, p, h1, h2, li, table, image, titleBlock, footer, portrait, landscape,
    styles: { default: { document: { run: { font: FONT, size: 21 } } } },
    numbering: { config: [{ reference: 'dots', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 260 } }, run: { color: C.main } } }] }] },
  };
};
