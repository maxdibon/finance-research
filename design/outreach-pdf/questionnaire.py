"""The bank checklists as spreadsheets to answer (FS-729, FS-730).

Reads Appendix A and B from docs/outreach/bank-api-requests-2026-10.md, the
same source as the PDFs, so the questions and their ids (A1, A2) can never
differ between the two. One workbook per bank, in Dibon's colours: each
question with a dropdown for the answer, how it is offered, and notes.

    py design/outreach-pdf/questionnaire.py

Run by design/outreach-pdf/build.js after the PDFs. Writes to
build/outreach/, which git ignores.
"""

import re
import sys
from datetime import date
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.worksheet.datavalidation import DataValidation

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "docs" / "outreach" / "bank-api-requests-2026-10.md"
OUT = ROOT / "build" / "outreach"

AUBERGINE, PLUM, AMBER, CREAM = "280430", "460D4D", "FBB236", "FFF2EB"
ANSWERS = ["Available", "Planned", "Not available", "Not applicable"]

text = SOURCE.read_text(encoding="utf-8").replace("\r\n", "\n")
issued = re.search(r"^last_reviewed: (\S+)$", text, re.M).group(1)
version = re.search(r"^version: (\S+)$", text, re.M).group(1)
long_date = date.fromisoformat(issued).strftime("%-d %B %Y") if sys.platform != "win32" else date.fromisoformat(issued).strftime("%#d %B %Y")


def appendix(letter):
    m = re.search(rf"^## Appendix {letter} · .*$", text, re.M)
    if not m:
        raise SystemExit(f"no Appendix {letter} in {SOURCE}")
    body = text[m.end():]
    end = re.search(r"^(---|## )", body, re.M)
    return (body[: end.start()] if end else body).strip()


def plain(s):
    return re.sub(r"\*\*([^*]+)\*\*", r"\1", s).strip()


def parse(md):
    """Title, sections [(letter, heading, intro, [questions])], closing notes."""
    title, sections, notes = "", [], []
    for block in re.split(r"\n\s*\n", md):
        lines = block.split("\n")
        if re.match(r"^\d+\. ", lines[0]):
            items = []
            for line in lines:
                if re.match(r"^\d+\. ", line):
                    items.append(re.sub(r"^\d+\. ", "", line))
                else:
                    items[-1] += " " + line.strip()
            sections[-1][3].extend(plain(i) for i in items)
            continue
        joined = " ".join(l.strip() for l in lines)
        bold = re.match(r"^\*\*([^*]+)\*\*(.*)$", joined)
        if bold and not title and not bold.group(2).strip():
            title = bold.group(1)
            continue
        if bold:
            head = bold.group(1).rstrip(".")
            letter = (re.match(r"^([A-Z])\. ", head) or [None, ""])[1]
            sections.append([letter, head, plain(bold.group(2)), []])
            continue
        if sections and not sections[-1][3]:
            sections[-1][2] = (sections[-1][2] + " " + plain(joined)).strip()
        elif sections:
            notes.append(plain(joined))
        else:
            notes.insert(0, plain(joined))
    return title, sections, notes


thin = Side(style="thin", color="E6D9E3")
border = Border(top=thin, bottom=thin, left=thin, right=thin)
wrap = Alignment(wrap_text=True, vertical="top")


def build(letter, bank, subject, name):
    title, sections, notes = parse(appendix(letter))
    wb = Workbook()
    ws = wb.active
    ws.title = "Questions"
    widths = {"A": 7, "B": 70, "C": 18, "D": 28, "E": 40}
    for col, w in widths.items():
        ws.column_dimensions[col].width = w

    def band(row, value, fill, font, height=None):
        ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=5)
        c = ws.cell(row=row, column=1, value=value)
        c.fill = PatternFill("solid", fgColor=fill)
        c.font = font
        c.alignment = Alignment(vertical="center", wrap_text=True, indent=1)
        if height:
            ws.row_dimensions[row].height = height

    band(1, "DIBON CONSULTING", AUBERGINE, Font(name="Montserrat", bold=True, color=AMBER, size=9), 22)
    band(2, title, AUBERGINE, Font(name="Montserrat", bold=True, color="FFFFFF", size=15), 30)
    band(3, f"For {bank} · {subject} · Dibon Company Limited · {long_date} · v{version}", AUBERGINE,
         Font(name="Montserrat", color="CDB3C9", size=9), 20)
    band(4, "How to answer: pick an answer for each question from the list in column C; say how it is "
            "offered in D (API, SFTP, portal, file, email); anything else in E. Questions are numbered as in "
            "the PDF, so an email reply can cite them too. " + (notes[0] if notes else ""),
         CREAM, Font(name="Source Sans 3", italic=True, color="6B5A70", size=10), 44)

    row = 6
    for i, head in enumerate(["Id", "Question", "Answer", "How it is offered", "Notes"], start=1):
        c = ws.cell(row=row, column=i, value=head)
        c.fill = PatternFill("solid", fgColor=PLUM)
        c.font = Font(name="Montserrat", bold=True, color="FFFFFF", size=10)
        c.alignment = Alignment(vertical="center")
        c.border = border
    ws.row_dimensions[row].height = 20
    ws.freeze_panes = "A7"

    dv = DataValidation(type="list", formula1='"' + ",".join(ANSWERS) + '"', allow_blank=True,
                        showErrorMessage=True, errorTitle="Choose an answer",
                        error="Choose one of: " + ", ".join(ANSWERS))
    ws.add_data_validation(dv)

    for letter_, head, intro, questions in sections:
        if not questions:
            continue
        row += 1
        lead = intro.rstrip(":").rstrip(".")
        band(row, head + (f". {lead}." if intro else ""), CREAM,
             Font(name="Montserrat", bold=True, color=PLUM, size=10), 22 if not intro else 34)
        for n, q in enumerate(questions, start=1):
            row += 1
            ws.cell(row=row, column=1, value=f"{letter_}{n}").font = Font(name="Montserrat", bold=True, color=PLUM, size=10)
            ws.cell(row=row, column=2, value=q).font = Font(name="Source Sans 3", size=10)
            for col in range(1, 6):
                cell = ws.cell(row=row, column=col)
                cell.alignment = wrap
                cell.border = border
            dv.add(ws.cell(row=row, column=3))
            ws.row_dimensions[row].height = max(18, 15 * (len(q) // 80 + 1))

    # Sections with no questions (how we handle the data) close the sheet.
    for letter_, head, intro, questions in sections:
        if questions:
            continue
        row += 2
        band(row, head, CREAM, Font(name="Montserrat", bold=True, color=PLUM, size=10), 20)
        if intro:
            row += 1
            band(row, intro, "FFFFFF", Font(name="Source Sans 3", size=10), 15 * (len(intro) // 120 + 2))
    tail = [n for n in notes[1:]]
    for t in tail:
        row += 1
        band(row, t, "FFFFFF", Font(name="Source Sans 3", size=10), 15 * (len(t) // 120 + 2))

    ws.sheet_view.showGridLines = False
    ws.print_options.horizontalCentered = True
    ws.page_setup.orientation = "landscape"
    ws.page_setup.fitToWidth = 1
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    ws.page_setup.fitToHeight = 0
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f"{name}-{issued}.xlsx"
    try:
        wb.save(path)
    except PermissionError:
        path = OUT / f"{name}-{issued}-new.xlsx"
        wb.save(path)
        print(f"{name}-{issued}.xlsx is open; wrote {path.name} instead")
        return
    print(f"built {path.relative_to(ROOT)}")


# One workbook per bank, as with the PDFs, so no bank sees another's name.
for letter, bank, subject, name in [
    ("A", "NCBA", "operational accounts", "Dibon-questionnaire-for-NCBA"),
    ("A", "KCB", "operational accounts", "Dibon-questionnaire-for-KCB"),
    ("B", "SBM Bank", "corporate credit card", "Dibon-questionnaire-for-SBM-Bank"),
]:
    build(letter, bank, subject, name)
