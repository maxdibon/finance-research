// The design system for Word documents (FS-781): letters, agreements and
// anything a reader will edit. The same brand as dibon.css, in docx-js's
// terms. The repository installs no packages, so pass in the docx module
// from wherever your builder installed it (`npm install docx`):
//
//   const docx = require('docx');
//   const ds = require('<repo>/design/system/docx.js')(docx);
//   new docx.Document({ styles: ds.styles, numbering: ds.numbering,
//     sections: [{ properties: ds.page, headers: { default: ds.header('PARTNER TERMS') },
//       footers: { default: ds.footer('Dibon Company Limited · Prembly: proposed changes · 12 October 2026') },
//       children: [ds.h('1. A heading'), ds.p('Text with **bold** in it.'), ds.li('A bullet.')] }] });
//
// Render the result to PDF (Word's ExportAsFixedFormat, or LibreOffice) and
// look at every page before sending it.

'use strict';

const fs = require('fs');
const path = require('path');

module.exports = function designSystem(docx) {
  const {
    Paragraph, TextRun, ImageRun, AlignmentType, Table, TableRow, TableCell,
    WidthType, ShadingType, BorderStyle, Header, Footer, PageNumber, LevelFormat, VerticalAlign,
  } = docx;

  const COLOURS = { aubergine: '280430', plum: '460D4D', amber: 'FBB236', cream: 'FFF2EB', ink: '23122A', muted: '6B5A70', onDark: 'CDB3C9', line: 'E6D9E3', headFill: 'EFE6EE' };
  // Word has neither Montserrat nor Source Sans by default; Calibri reads
  // closest and is everywhere. Install the brand fonts to use them.
  const FONT = 'Calibri';
  const WIDTH = 9026; // A4's text width at 1-inch margins, in twentieths of a point

  const run = (text, o = {}) => new TextRun({ text, font: FONT, size: o.size || 21, bold: o.bold, italics: o.italics, color: o.color });
  // **bold** inside a string becomes a bold run.
  const rich = (s, o = {}) => s.split(/(\*\*[^*]+\*\*)/).filter(Boolean)
    .map((x) => (x.startsWith('**') ? run(x.slice(2, -2), { ...o, bold: true }) : run(x, o)));
  const p = (text, o = {}) => new Paragraph({
    children: typeof text === 'string' ? rich(text, o) : text,
    spacing: { after: o.after ?? 120, before: o.before ?? 0, line: 270 },
    alignment: o.align || AlignmentType.LEFT,
    keepNext: o.keepNext,
  });
  // A heading: plum, with the amber rule beneath, as h2 in dibon.css
  const h = (text) => new Paragraph({
    children: [run(text, { bold: true, color: COLOURS.plum, size: 23 })],
    spacing: { before: 240, after: 100 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: COLOURS.amber, space: 2 } },
    keepNext: true,
  });
  const li = (text) => new Paragraph({ children: rich(text), numbering: { reference: 'dots', level: 0 }, spacing: { after: 80, line: 270 } });

  const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  const LINE = { style: BorderStyle.SINGLE, size: 4, color: COLOURS.line };
  const cell = (text, w, o = {}) => new TableCell({
    width: { size: w, type: WidthType.DXA },
    shading: o.fill ? { type: ShadingType.CLEAR, color: 'auto', fill: o.fill } : undefined,
    margins: { top: 70, bottom: 70, left: 100, right: 100 },
    borders: { top: LINE, bottom: LINE, left: LINE, right: LINE },
    children: [new Paragraph({ children: rich(text, { size: 19, color: o.color }), spacing: { after: 0, line: 252 } })],
  });
  // A table: the first row is the header; widths must sum to WIDTH.
  const table = (rows, widths) => new Table({
    width: { size: WIDTH, type: WidthType.DXA },
    columnWidths: widths,
    rows: rows.map((r, i) => new TableRow({
      tableHeader: i === 0, cantSplit: true,
      children: r.map((t, j) => cell(i === 0 ? `**${t}**` : t, widths[j], i === 0 ? { fill: COLOURS.headFill, color: COLOURS.plum } : {})),
    })),
  });

  // The bands: aubergine with the white logo at the top, aubergine with the
  // label and an amber corner holding the page number at the foot.
  const logo = fs.readFileSync(path.join(__dirname, '..', 'brand', 'dibon_logo_white.png'));
  const band = (cells) => new Table({
    width: { size: WIDTH, type: WidthType.DXA },
    columnWidths: cells.map((c) => c.w),
    rows: [new TableRow({
      children: cells.map((c) => new TableCell({
        width: { size: c.w, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, color: 'auto', fill: c.fill },
        verticalAlign: VerticalAlign.CENTER,
        margins: { top: c.pad ?? 80, bottom: c.pad ?? 80, left: 180, right: 180 },
        borders: { top: NONE, bottom: NONE, left: NONE, right: NONE },
        children: c.children,
      })),
    })],
  });
  const header = (kicker) => new Header({
    children: [band([
      { w: 6626, fill: COLOURS.aubergine, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: logo, transformation: { width: 92, height: 40 } }), run('   DIBON CONSULTING', { bold: true, color: 'FFFFFF', size: 18 })] })] },
      { w: 2400, fill: COLOURS.amber, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [run(kicker.toUpperCase(), { bold: true, color: COLOURS.aubergine, size: 16 })] })] },
    ]), new Paragraph({ children: [], spacing: { after: 0 } })],
  });
  const footer = (label) => new Footer({
    children: [band([
      { w: 7826, fill: COLOURS.aubergine, pad: 60, children: [new Paragraph({ children: [run(label.toUpperCase(), { bold: true, color: COLOURS.onDark, size: 13 })] })] },
      { w: 1200, fill: COLOURS.amber, pad: 60, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, bold: true, size: 20, color: COLOURS.aubergine })] })] },
    ])],
  });

  return {
    COLOURS, FONT, WIDTH, run, rich, p, h, li, table, header, footer,
    styles: { default: { document: { run: { font: FONT, size: 21 } } } },
    numbering: { config: [{ reference: 'dots', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 260 } }, run: { color: COLOURS.plum } } }] }] },
    page: { page: { margin: { top: 1500, bottom: 1300, left: 1440, right: 1440, header: 400, footer: 400 } } },
  };
};
