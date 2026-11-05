---
id: design-system
name: Design system — how Dibon's documents look, so they are one house without being one template
kind: guide
status: living
released: 2026.10.15
owner: Commercial lead
classification: Internal
review_ids: [FS-728, FS-781, FS-816, FS-817, FS-1024, FS-1025, FS-1026, FS-1039, FS-1087]
last_reviewed: 2026-11-05
---

# Design system

**What this is:** the look every printed document shares (portfolios,
proposals, letters, checklists, agreements, handbooks), so a reader
knows it is ours at a glance, while each document keeps the layout its
job needs (FS-728, FS-781). Consistent, not identical; and a little
whimsy, in its place.

**The parts:**

| Part | What it is | Where |
|---|---|---|
| The stylesheet | Tokens and every component, for HTML printed to PDF | [design/system/dibon.css](../../design/system/dibon.css) |
| The template | One page using every component: copy it to start | [design/system/template.html](../../design/system/template.html) |
| The printer | Inlines the stylesheet and logo, writes the footer band, prints A4 | [design/system/build.js](../../design/system/build.js) |
| Word | The same bands, headings, lists and tables for docx-js | [design/system/docx.js](../../design/system/docx.js) |
| The logo | White for dark bands; vector candidates in white, amber and plum | design/brand/ |

```bash
node design/system/build.js                      # the template, as a check
node design/system/build.js my-letter.html       # any page that links dibon.css
```

The portfolio ([design/portfolio-pdf/](../../design/portfolio-pdf/build.js))
and the bank-channel proposal keep their own builders, with the same
tokens; a new document starts from the template.

## 1 · Principles

1. **One house, many rooms.** Every document has the header band on its
   first page and the footer band on every page. Inside, choose the
   components the job needs.
2. **Plain words first.** Short sentences, the reader's words, one idea in
   bold where it carries the paragraph (docs/company/experience.md).
3. **Customer-safe, inside as well as out.** Say what a customer is working
   towards; never judge their systems.
4. **Roles, never names,** in anything we keep; a name appears only on a
   named copy, recorded in the distribution log on the CRM opportunity.
5. **No register ids in anything that leaves the building.** The public
   check fails on one in the portfolio's copy.
6. **Look at it.** Render every page and look before sending; measuring is
   not looking.

## 2 · Tokens

| Token | Value | Use |
|---|---|---|
| Aubergine | `#280430` | Bands, titles, strong text |
| Plum | `#460d4d` | Headings, markers, line drawings |
| Amber | `#fbb236` | The accent: rules, corners, page numbers, dots. Never body text |
| Amber text | `#8a5a00` | Amber words on white, where contrast matters |
| Cream | `#fff2eb` | Notes, text on aubergine |
| Paper | `#fffaf6` | Cards and full-page backgrounds |
| Ink | `#23122a` | Body text |
| Muted | `#5e4c66` | Leads, asides, captions |
| Line | `#ead9dc` | Table rules, borders |
| Money | `#0e7f5a` on `#e2f3ec` | Money in diagrams and tags, nothing else |

**Type:** Montserrat for display (titles, headings, kickers, labels, in
capitals with tracking for the small ones); Source Sans 3 for body text at
10 point. Word documents use Calibri unless the brand fonts are installed.

**Page:** A4; side margins 18 mm; the footer band 12 mm high, with the
page number in its amber corner.

## 3 · Components

| Component | Class | When |
|---|---|---|
| Header band | `.head` (`.compact` for letters) | The top of the first page: logo, kicker, title, meta line |
| Footer band | from `<meta name="dibon-footer">` | Every page: "Dibon Consulting · what it is · when" |
| Kicker | `.kicker` | What kind of document this is, above the title |
| Lead | `.lead` | One or two sentences on why the reader has this |
| Section heading | `h2` | Numbered ("1 · Scope"), with the amber rule beneath |
| Double rule | `.rule` | Opening a section that deserves a pause |
| Questions | `ol.q` with `.qid` | Questions a reader answers by id (A1, A2) |
| Note | `.note` | The one thing the reader must not miss |
| Table | `table`, `td.num` | Columns of facts; numbers right-aligned |
| Cards | `.cards` > `.card` | Two or three things side by side |
| Figure | `.stat` | A number worth reading at a glance |
| Tag | `.tag`, `.amber`, `.money` | A status, a phase, a tier |
| Signature | `.sign` | Letters and agreements |
| Corner line-art | `svg.corner` | A drawn curve in a page's or band's corner |
| Aside | `.wink` | A kind line in the margin of the argument |
| Illustration | `svg.illo` | Line drawings: plum lines, amber dashes, green money |
| Colophon | `.colophon` | The sign-off at the very end |

## 4 · Documents, and what each starts from

| Document | Starts from | Notes |
|---|---|---|
| Portfolio and its editions | design/portfolio-pdf/ | Its own pages and builder; copy only in docs/marketing/portfolio.md |
| A proposal, a one-pager | The template | Cover in the header band; cards and figures inside |
| A request or checklist to a bank or partner | The template, as the bank letters do | Numbered questions (`ol.q`); a spreadsheet beside it if they will answer in one |
| A letter | The template, `.head.compact`; or Word through docx.js when the reader will edit it | Signature by role |
| An agreement, an NDA | Word through docx.js | No whimsy at all |
| A questionnaire an institution answers | Word through docx.js, with a form field per question (tools/products/questionnaires.js) | Answers read back by script, never retyped; no "reply by email" |
| An institution's handbook | Markdown in docs/handbook/, published to its Odoo or the reader | The reader's own look |

## 5 · A little whimsy

We like a little whimsy: it makes a document feel made by people who
enjoy the work. It lives in the margins, never in the substance.

**Where it may go:**

- A **corner line-art** curve or a dot in a band or a page's corner.
- A **spot illustration**, line-drawn, where a picture explains faster
  than a paragraph.
- An **aside** (`.wink`): a short, kind line beside the argument, such as
  "We read the regulations so your team does not have to."
- The **kicker** and the **colophon**: "Made in Nairobi".

**Where it never goes:** figures, prices, dates and terms; anything a
regulator, an auditor or a court will read; agreements; incident notices
and anything about a customer's problem; anything at someone's expense.

**How much:** one touch per page at most, and none on a page that is
mostly numbers. If it needs explaining, it is not whimsy; cut it.

## 6 · One look per kind, in whoever's brand

FS-1025. **The aim:** two documents of the same kind, made by two people
at the same organisation, look the same: an agreement is an agreement,
whoever made it. Every document need not look alike, and not every
document is in our brand.

**One look per kind, by construction:** each kind of document is made
one way only: from its template and builder (§4), or generated by the
platform from its own template (agreements, key facts, statements,
receipts, the onboarding pack). No one starts a document of a kind that
has a template from a blank page, and the platform's documents cannot be
typed freely at all.

**Whose look a document takes:**

| When | Whose look | For example |
|---|---|---|
| **Dibon speaks in its own name** | **Dibon's** (§1 to §5) | The portfolio, proposals and decks, our letters, our agreements and NDAs with customers and partners, our reports to a customer, our invoices |
| **The institution speaks to its own customers or partners**, through what we built | **The institution's** (its theme, below) | Its agreements and key facts, statements and receipts, the onboarding pack it adopted, its website, its apps, its messages |
| **We prepare a document for an institution to use as its own** | **The institution's** | Its handbook, its credit policy, its product documents once adopted |
| **We prepare a document for an institution, as Dibon** | **Dibon's, "prepared for" the institution** | A Product Understanding Document, a delivery report, a review |
| **The form is set by someone else** | **Theirs, untouched** | Statutory forms (a registry's or the tax authority's), a regulator's returns, a party's own document (kept as received, rules, Dibon 11), an NDA in the other party's format |
| **No brand fits, or the institution has none yet** | **Plain:** the components and type, in neutral colours | A first draft for an institution still choosing its look |

**An institution's theme:** the same components and structure (§3), with
its own tokens: its logo, its colours mapped onto ours (its main colour
for aubergine and plum, its accent for amber), its fonts where it has
them. Money keeps its green, and contrast its rules, whatever the theme.
**In code** (FS-1087): `design/system/institution-docx.js` gives an
institution's Word documents the same components as ours with its
tokens, from its theme file in `design/system/themes/`; `plain.json` is
the plain look, the default until an institution gives us its own.
Kept with the institution's configuration, used by every builder, its
website and its apps; never whimsy in its documents.

## 7 · Numbers, versions, and who received what

FS-1026. **Every document Dibon produces for someone outside has a
number,** as the portfolio's do: `DC-FS-` (Dibon Consulting, Financial
Services), a kind, and a serial:

| Kind | Code | Example |
|---|---|---|
| Portfolio and its editions | PF | DC-FS-PF-001, the full portfolio |
| Proposal, one-pager | PR | |
| Deck, presentation | DK | |
| Letter, request, checklist to a bank or partner | LT | |
| Agreement, NDA | AG | |
| Questionnaire | QN | |
| Report, review, Product Understanding Document | RP | |
| Template or pack we give an institution | TM | DC-FS-TM-001, the onboarding pack; TM-003 to TM-005, the CBK licence pack's policies (templates/cbk-licence-pack) |

- **The number is the document,** across its versions; a serial is never
  reused. **The version** follows it (`DC-FS-PF-001 v1.2`): major for a
  new issue, minor for a change, a third place for a correction (FS-909).
- **On the document:** the number and version in the footer band, beside
  what it is and when.
- **File names:** `Dibon-<title>-v<version>-<date>`, and `-for-<recipient>`
  for a copy made for one organisation; the number inside the file, not in
  its name.
- **Who received what** is logged in the document register's
  distribution log (document-register, "Our documents"): the number and
  version, the organisation, the recipient's role, the date, how it went,
  and whether it was a named copy. A person's name stays on the CRM
  opportunity, never in git (§1, principle 4).
- **An institution's own documents** carry its own numbering, not ours.

## 8 · Before it goes out

- [ ] Printed and every page looked at, not only measured.
- [ ] The header band on page 1, the footer band and page number on every
      page.
- [ ] The footer label says what it is and when.
- [ ] No register ids, no names (except a named copy's recipient, logged),
      no customer data.
- [ ] Its number and version in the footer (§7), and its sending logged.
- [ ] Where it cites regulations, its last page lists them (tools/regulations-page.py for Word; tools/citations.js --external otherwise).
- [ ] Made from its kind's template, in the right look (§6).
- [ ] A version for anything a reader will hold, and the status "draft"
      until it is issued.
- [ ] Whimsy within §5.
