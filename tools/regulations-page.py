# A "Regulations cited" page at the end of a Word document (FS-874), from
# the instrument cards (tools/citations.js), for a document read outside
# Dibon: no register ids; the note agreed under FS-876 where it cites a
# reading being confirmed (reg 54(7), reg 47(2)). Tracked, by "Dibon
# Consulting", when the document is a tracked-changes working version.
#   py tools/regulations-page.py <in.docx> <out.docx> [--tracked] [--law LR-03]
# Standard library only; node runs tools/citations.js --data for the content.
import sys, json, re, zipfile, shutil, html, subprocess, tempfile, os

args = sys.argv[1:]
if len(args) < 2 or not args[0].endswith(".docx") or not args[1].endswith(".docx"):
    sys.exit("usage: py tools/regulations-page.py <in.docx> <out.docx> [--tracked] [--law LR-03]")
src, dst = args[0], args[1]
tracked = "--tracked" in args
law = args[args.index("--law") + 1] if "--law" in args else "LR-03"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# The document's text, one paragraph per span, comments included.
zin = zipfile.ZipFile(src)
text = ""
for part in ["word/document.xml", "word/comments.xml"]:
    if part in zin.namelist():
        paras = re.findall(r"<w:p[ >].*?</w:p>", zin.read(part).decode("utf-8"), re.S)
        text += "\n\n".join(html.unescape(re.sub(r"<[^>]+>", "", p)) for p in paras) + "\n\n"
with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False, encoding="utf-8") as tf:
    tf.write(text)
out = subprocess.run(["node", os.path.join(ROOT, "tools", "citations.js"), "--data", tf.name, "--law", law], capture_output=True, text=True, encoding="utf-8")
os.unlink(tf.name)
if out.returncode != 0:
    sys.exit(out.stdout + out.stderr)
data = json.loads(out.stdout)
import datetime
AUTHOR, DATE = "Dibon Consulting", datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:00Z")
PLUM, PLUM_DARK, SHADE, EDGE = "460D4D", "280430", "EFE6EE", "E6D9E3"

doc = zin.read("word/document.xml").decode("utf-8")
rels = zin.read("word/_rels/document.xml.rels").decode("utf-8")

# Page width for tables: the body's section size less its margins.
sect = re.findall(r"<w:sectPr[ >].*?</w:sectPr>", doc, re.S)[-1]
pg = int(re.search(r'<w:pgSz[^>]*w:w="(\d+)"', sect).group(1))
ml = int(re.search(r'<w:pgMar[^>]*w:left="(\d+)"', sect).group(1))
mr = int(re.search(r'<w:pgMar[^>]*w:right="(\d+)"', sect).group(1))
width = pg - ml - mr

ids = [int(x) for x in re.findall(r'w:id="(\d+)"', doc)] or [0]
next_id = [max(ids) + 1000]
def nid():
    next_id[0] += 1
    return next_id[0]
def ins_attr():
    return f'w:id="{nid()}" w:author="{AUTHOR}" w:date="{DATE}"'

rel_ids = [int(x) for x in re.findall(r'Id="rId(\d+)"', rels)] or [0]
next_rel = [max(rel_ids)]
new_rels = []
def hyperlink_rel(url):
    next_rel[0] += 1
    rid = f"rId{next_rel[0]}"
    new_rels.append(f'<Relationship Id="{rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="{html.escape(url, quote=True)}" TargetMode="External"/>')
    return rid

def rpr(size, bold=False, color=None, underline=False):
    b = "<w:b/><w:bCs/>" if bold else ""
    c = f'<w:color w:val="{color}"/>' if color else ""
    u = '<w:u w:val="single"/>' if underline else ""
    return f'<w:rPr><w:rFonts w:ascii="Calibri" w:cs="Calibri" w:eastAsia="Calibri" w:hAnsi="Calibri"/>{b}{c}{u}<w:sz w:val="{size}"/><w:szCs w:val="{size}"/></w:rPr>'

def run(text, size, bold=False, color=None):
    r = f'<w:r>{rpr(size, bold, color)}<w:t xml:space="preserve">{html.escape(text, quote=False)}</w:t></w:r>'
    return f"<w:ins {ins_attr()}>{r}</w:ins>" if tracked else r

def link(text, url, size):
    rid = hyperlink_rel(url)
    r = f'<w:hyperlink r:id="{rid}"><w:r>{rpr(size, color="0563C1", underline=True)}<w:t xml:space="preserve">{html.escape(text, quote=False)}</w:t></w:r></w:hyperlink>'
    return f"<w:ins {ins_attr()}>{r}</w:ins>" if tracked else r

def para(runs, after=120, before=0, page_break=False):
    mark = f"<w:rPr><w:ins {ins_attr()}/></w:rPr>" if tracked else ""
    brk = "<w:pageBreakBefore/>" if page_break else ""
    return f'<w:p><w:pPr>{brk}<w:spacing w:before="{before}" w:after="{after}" w:line="264" w:lineRule="auto"/>{mark}</w:pPr>{"".join(runs)}</w:p>'

def cell(text_runs, w, head=False):
    shd = f'<w:shd w:fill="{SHADE}" w:color="auto" w:val="clear"/>' if head else ""
    borders = "".join(f'<w:{s} w:val="single" w:color="{EDGE}" w:sz="4"/>' for s in ("top", "left", "bottom", "right"))
    mark = f"<w:rPr><w:ins {ins_attr()}/></w:rPr>" if tracked else ""
    return (f'<w:tc><w:tcPr><w:tcW w:type="dxa" w:w="{w}"/><w:tcBorders>{borders}</w:tcBorders>{shd}'
            f'<w:tcMar><w:top w:type="dxa" w:w="60"/><w:left w:type="dxa" w:w="90"/><w:bottom w:type="dxa" w:w="60"/><w:right w:type="dxa" w:w="90"/></w:tcMar></w:tcPr>'
            f'<w:p><w:pPr><w:spacing w:after="0" w:line="240"/>{mark}</w:pPr>{"".join(text_runs)}</w:p></w:tc>')

def row(cells_xml, head=False):
    trpr = "<w:cantSplit/>" + ("<w:tblHeader/>" if head else "") + (f"<w:ins {ins_attr()}/>" if tracked else "")
    return f"<w:tr><w:trPr>{trpr}</w:trPr>{''.join(cells_xml)}</w:tr>"

UNSETTLED = {"reg 54(7)", "reg 47(2)"}
cited = {c for d in data for r in d["rows"] for c in r["citedAs"]}
out = []
out.append(para([run("Regulations cited", 28, True, PLUM)], after=60, page_break=True))
out.append(para([run("Each regulation this document cites: who oversees it, the version read, and what each provision cited requires, read from the official text on Kenya Law.", 20)], after=160))
both = UNSETTLED <= cited
if cited & UNSETTLED:
    parts = []
    if "reg 54(7)" in cited:
        parts.append("whether a restructure the borrower asks for must still wait the thirty days' notice that regulation 54(7) gives for any change to a loan agreement (the power to restructure itself is regulation 28(3))")
    if "reg 47(2)" in cited:
        parts.append("which regulation sets how often guarantors receive statements: we cite regulation 47(2), and regulation 39(3) may be the right one")
    lead = "Two readings we are confirming. " if both else "A reading we are confirming. "
    joined = "; and ".join(parts)
    body = joined[0].upper() + joined[1:] + ". We will confirm " + ("both" if both else "it") + " before anything is built on " + ("them" if both else "it") + ", and update this page; your counsel's view would be welcome."
    out.append(para([run(lead, 20, True, PLUM_DARK), run(body, 20)], after=200))
w1, w2 = int(width * 0.14), int(width * 0.22)
w3 = width - w1 - w2
for d in data:
    out.append(para([run(d["citation"] + ".", 20, True, PLUM_DARK)], after=40, before=120))
    facts = f"Regulator: {d['regulator']}. Made under: {d['madeUnder']}. In force: {d['inForce']}. Version read: as at {d['asAt']}, "
    out.append(para([run(facts, 19), link("Kenya Law", d["url"], 19), run(".", 19)], after=80))
    rows = [row([cell([run(h, 17, True, PLUM)], w, head=True) for h, w in (("Provision", w1), ("Cited here as", w2), ("What it requires", w3))], head=True)]
    for r in d["rows"]:
        # FS-900: spelled out for a reader outside Dibon ("regulation 30(4)", "section 73", "rule 12").
        long = r.get("citedAsLong", r["citedAs"])
        marks = [l + (", reading being confirmed" if c in UNSETTLED else "") for c, l in zip(r["citedAs"], long)]
        rows.append(row([cell([run(r.get("provisionLong", r["provision"]), 17)], w1), cell([run("; ".join(marks), 17)], w2), cell([run(r["requires"], 17)], w3)]))
    borders = "".join(f'<w:{s} w:val="single" w:color="auto" w:sz="4"/>' for s in ("top", "left", "bottom", "right", "insideH", "insideV"))
    out.append(f'<w:tbl><w:tblPr><w:tblW w:type="dxa" w:w="{width}"/><w:tblBorders>{borders}</w:tblBorders><w:tblLayout w:type="fixed"/></w:tblPr>'
               f'<w:tblGrid><w:gridCol w:w="{w1}"/><w:gridCol w:w="{w2}"/><w:gridCol w:w="{w3}"/></w:tblGrid>{"".join(rows)}</w:tbl>')
out.append(para([run("", 19)], after=0))

# Insert before the body's own (last) section properties.
at = doc.rfind("<w:sectPr")
doc2 = doc[:at] + "".join(out) + doc[at:]
rels2 = rels.replace("</Relationships>", "".join(new_rels) + "</Relationships>")

shutil.copyfile(src, dst)
zout = zipfile.ZipFile(dst + ".tmp", "w", zipfile.ZIP_DEFLATED)
for item in zin.infolist():
    if item.filename == "word/document.xml":
        zout.writestr(item, doc2)
    elif item.filename == "word/_rels/document.xml.rels":
        zout.writestr(item, rels2)
    else:
        zout.writestr(item, zin.read(item.filename))
zout.close()
zin.close()
shutil.move(dst + ".tmp", dst)
print("ok", dst.split("/")[-1], "instruments", len(data), "rows", sum(len(d["rows"]) for d in data), "note", bool(cited & UNSETTLED), "tracked", tracked)
