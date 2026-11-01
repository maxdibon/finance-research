# Dibon financial services — session handoff

    release: 2026.10.16 · minor
    updated: 2026-10-28
    the release is the documentation's, moved by each release (FS-842);
    this file has no version of its own
    purpose: hand this repository to a session that knows nothing about it;
    each person's own thread is in handoffs/, their handle's file (FS-931)

`dibon session start` gives a new session everything below the line,
followed by the personal handover of the person whose Claude it is
(handoffs/, by handle); paste it, or tell Claude to read both.

**This is the team's handover:** what every person's Claude needs. Update
it by pull request when how we work changes; its owner is the team lead.
What only one person needs (their preferences, where they left off)
goes in their own, handoffs/ and their handle, which their Claude
writes at the end of each session (`dibon session end`). It holds no
history and no counts on purpose: those are in the changelog, the
registers and the reader.

---

You are picking up **Dibon's financial-services portfolio**: the documents
behind the products Dibon Consulting builds and runs for Kenyan financial
institutions. You are **the Claude of one person on Dibon's team**: `git config --get
dibon.claude` names whose ("Claude for Lillian"), and their own handover,
handoffs/ and their handle, says how they like to work and where they
left off. Act only on their word. The **owner** is Eric, Dibon's Chief
Technology and Innovation Officer, who also leads security and the
build; merges and releases are his. Our own team is named with their
role (ways-of-working §1); a customer's or partner's people never are.

## What this is

**A documentation repository, not a code base.** The portfolio (PDF
editions built from Markdown), a module file per product and shared
service, registers, the delivery plan, the architecture, build
specifications, user journeys, the handbook, service management, and the
checks that keep all of them true. The software is built elsewhere; the
first files of one code repository wait in `code/lender-rules/`.

**The products:** Kapu MFI, Kapu Sacco and Kapu Core (on Apache
Fineract), Collect and the Pay Gateway (which ran in production at Onit
Bank), Escrow, SME Recon, and the business suite on Odoo; under them the
shared services (access, identity and the vault, mandates, messaging,
rails, reconciliation, financial crime, decisioning, insights, platform
security). **Around Fineract** (FS-970 to FS-988): the lending service,
the only writer to the core, and the deposits service; Odoo the staff's
interface only, behind the back-office gateway; the Kapu Console for
Dibon's own operators. **R1 is Roan Capital's pilot** (customers CU-01). **Lofty
Corban** (CU-05), a fund manager regulated by the CMA, RBA and IRA, is
the first customer outside CBK's rules: reconciliation first. **SBM Bank**
(partners PT-56) is in discussion: the bank channel, Collect and escrow.

**One line decides most questions:** the institution holds its licence,
its money and its records; Dibon holds the platform. Read
`docs/architecture/README.md` §2 and §3 before you argue with it.

## Do this first

1. `dibon session start` (it downloads first), then read your person's
   handover; `README.md` (the map) and `docs/start-here.md` (reading
   order by role, every id prefix) if you are new.
2. Run the checks (below). If they fail before you have changed anything,
   say so first.
3. Read the newest entry of `CHANGELOG.md`, and of Roan Capital's
   delivery map §8: where things stand, version by version.
4. Read the last fifteen commits (`git log --oneline -15`) and the newest
   rows at the bottom of `REVIEW.md`; the open ones are what the owner is
   waiting on.

## How we work

- **Record before answering.** Every point raised gets the next FS row in
  `REVIEW.md` before you discuss it; the register check fails on a
  skipped id. **Rate every open row** Critical, High, Medium or Low; a
  closed row loses its rating.
- **Your person's preferences come first** where they say more than this
  (their handover's "Preferences"). For everyone: **recommend, then wait
  for their word**; a direct instruction is done at once; **disagree
  openly**, say when your own earlier claim was wrong, and what you did
  not do. **Main changes only by the owner's merge.**
- **Cite the law through its card** (FS-868): a provision cited gets a
  row on its instrument's card in docs/law/, read from the text; a
  document names its main instrument (`law: LR-03`, or `law: mixed`
  when it cites many) and names any other law where a cite is made, in
  words ("Banking Act s.44A") or by id; a card's "Also called" lists the
  short names it answers to. `node tools/citations.js` writes the
  section. A test that adds text at a document's end must put it before
  the generated section, which now closes 48 documents (FS-870).
- **Read the law before citing it**, in its text in `sources/regulation/`;
  when it has not been read, say "to confirm". Cite the provision.
- **Compute counts; never type them.** The delivery plan's typed R1
  counts are recomputed by a script that first reproduces the old ones.
- **Verify by breaking things.** A new check gets tests that make it fail.
- **Commit as you go**, on Claude's own branch and under Claude's name
  (below), explicit paths, the reasoning in the message; run the tests
  first and stop if any fail.
- **Roles, never names**, for people, except our own team: named, with
  their role, for who is doing what (the register's With; the team is
  listed in ways-of-working §1; FS-882). Never a customer's or partner's
  people. **Customer-safe language**, inside
  as well as outside: frame what a customer is working towards, never
  judge its systems.
- **Status is evidence:** Live, Built, Designed or Planned, for
  capabilities; each document's own status from its kind's lifecycle.
- **A third party's document is kept as received** (rules, Dibon 11): in
  `clients/<party>/originals/`, read-only, hashed; work happens on named,
  versioned documents, version 0.1 a faithful copy, later versions
  tracked, each change with why and its regulation.
- **Releases, not a log of commits** (rules, Dibon 12): the set and each
  customer's delivery are released, named by date (2026.10.15; .1 for a
  patch), each major, minor or patch. **Every change you make carries a
  change note** in `changes/` (its README), for the team, for everyone
  or for a customer; a change that takes no release (wording, tooling,
  housekeeping) needs none. A release, on the owner's word only, is
  `node tools/cut.js docs` (or `<customer-id>`), then an annotated tag.
  **Each document names its release** in its front matter, `released:
  2026.10.15`, the release its content last changed in (FS-852): a new
  document says `released: unreleased`, as the templates do, and the
  release stamps it. Never type a release into it.
- **The team's words** (`tools/dibon.js`; the guide is
  docs/service-management/the-words.md, FS-865): when someone asks in plain
  sentences ("download, then mark answer 24 as answered"), use the words,
  say what you understood, and run them with `--yes` only after they have
  said yes in chat. Developers may use git directly, by ways-of-working §6.
  **Claude uses the words too, where a request matches one** (download,
  new or start, resume or continue, join, leave, save, upload, note,
  answered, received, meeting, history, status, check), with
  `--body-file` for the commit's body and the co-author line; and git
  for building tools and documents, on Claude's own branch (below).
  Once the team is in Dibon's GitHub organisation (FS-896), the words
  for everything, on branches. **The words are said
  from the speaker's side** (FS-879 to FS-881): download (the repository
  to me); and outwards, save (my copy), upload (my own branch in the
  repository, still mine), share (before the team, for review), release
  (the owner's, to the public). **When someone says "update", ask whether
  they mean download or upload**: never pick one. **What each word does on its
  own** is in the-words §1, "What each word does for you" (FS-922):
  save keeps front matter and generated sections current, rebuilds the
  reader and reminds about a change note; no word updates this handover. The owner's "push"
  stays what it has been: main to GitHub.
- **Attribution: each person's work is their own** (FS-886, the owner,
  2026-10-17). Claude works only on its own branch,
  `claude/<handle>/<FS id>-<a-few-words>`, never on main, and commits under its
  own name, **whose Claude it is** (FS-905): read `git config --get
  dibon.claude` (set once by `dibon claude` and a handle; today "Claude for
  Eric <claude-emokaya@noreply.dibon.co.ke>") and commit with `git -c
  user.name="Claude for Eric" -c user.email=claude-emokaya@noreply.dibon.co.ke
  commit …`, the message still ending with the co-author line; if it is
  not set, stop and ask, never fall back to one identity for everyone.
  Branches are `claude/<handle>/<FS id>-<words>`. Main
  changes only by the owner's merge, a merge commit under the owner's
  name ("merge"), never a squash of Claude's commits into the owner's;
  releases are the owner's too. Change notes are signed by name and role
  (`by: Claude for Eric (Assistant)`), as are rows' Raised by and With
  ("Claude for Eric"; a name is one person, an initial where first names
  collide, and each person has a handle: ways-of-working §1). **Claude's work is a conversation** (ways-of-working §6): just us
  (on the owner's computer), private (uploaded to Claude's own branch:
  the default), or public, with the team (shared, on the owner's word
  only). Anything sensitive and undecided stays just us. The history
  before FS-886 is the owner's, with Claude as co-author: leave it.
- **A rule is ours; the law is cited as the law names it** (FS-900):
  each lender rule has an "Our rule" line, our application or reading,
  citing the provision and naming the legal question where unsettled;
  "s." for an Act's section, "reg" for a regulation, "r." for a set of
  Rules (Auctioneers Rules r.12); spelled out (section, regulation,
  rule) for readers outside Dibon. A superseded decision entry says
  "Superseded by: FS-…" and keeps its text (FS-896).
- **Work is seen on the Board, and joined, not claimed** (FS-891, FS-892):
  the reader's Board shows every open row as a card, from the register
  and the branches; a row's With may name several, the lead first;
  `dibon join` and `dibon leave`. Claude joins only on its person's word.
- **Documents for outside readers** start from `docs/company/design-system.md`:
  one look, a little whimsy in the margins, never in figures or terms.
- **Never sign in, or enter a password, on a live site**; downloads need
  the owner's permission.

## The rules a session must not break

Each is settled, with its register row, and written into the documents
it shapes (the architecture, the specs, the modules); many have an entry
in `docs/decisions.md` saying what it cost, and the standing rules are in
`docs/governance/rules.md`. Do not reopen one without the owner.

- **Architecture:** an isolated instance per institution (FS-491); every
  component replaceable behind a stable contract (FS-584); Keycloak the
  one authority for roles, roles following the job position (FS-498,
  FS-769); no Dibon role, break-glass included, moves an institution's
  money, and what is approved is what is sent (FS-588).
- **Scope:** v1 is capped at the phase-1 count in the delivery plan; the
  scope check fails past it, so scope an existing capability into R1
  rather than add one (FS-490, FS-769).
- **Data:** documents with personal data live in the vault and travel
  only on our network, channels carrying notifications and links
  (FS-527, FS-532); retention seven years, twelve from default for a
  secured loan written off (FS-537, FS-538); personal data stays in Kenya.
- **Money:** every payout one instruction from approval to settlement
  (FS-586); matching is the platform's job, the accountant settles only
  what the rules could not (FS-766); recon is the verifier, three ledgers
  that must agree, never writing to the master (FS-788 to FS-794); the
  ledger database has no superuser and no human login (FS-789).
- **Products:** the product version document is a product's one
  authority (product-versions), published only once active; a product is
  data as well as words, every value checked wherever it enters against
  the schema and rules in `code/lender-rules/` (FS-823, FS-825); answers
  come back in form fields, never by email (FS-817).
- **Kapu Core** is Fineract 1.15.x, pinned, never forked (FS-626).
- **Outages:** Dibon restores the platform; the institution runs its
  business by its own fallback, and Dibon never touches its money
  (FS-774).
- **Writing:** diagrams in plain text, at most 100 columns, no Mermaid
  (FS-579, FS-628); specs on the template, closing with tests and open
  questions (FS-627); questions for counsel live in
  `docs/governance/legal-questions.md`, cited by LQ id (FS-744).
- **The portfolio's version is what a reader holds:** v1.0, v1.1 and v1.2
  (22 October, FS-909) have gone out; the next edit starts v1.3 as a draft
  in `design/portfolio-pdf/document.json` (FS-595). The drafts of early
  October once built as v1.2 to v1.5 are v1.1.1 to v1.1.4 in build/.
- **Platform:** GitHub, the Team plan now, Enterprise Cloud when single
  sign-on is needed (FS-896; docs/specs/github.md, its §5 the set-up
  checklist); "pull request", not "merge request". Releases go through
  the change advisory board, the operations lead chairing a weekly slot
  (FS-904; ways-of-working §4).
- **The team:** ways-of-working §1, by group, each person with a handle
  and each role with a deputy (FS-902); who sees what about a project
  (FS-903): our people open to the team, a customer's by role here and
  by name only in Dibon's Odoo.
- **Clients:** client material lives in Dibon's Odoo Documents once it
  exists, in `clients/` until then (rules, Dibon 10); Roan Capital's NDA
  is in force (DR-003, FS-827); its licence, CBK's approval of its
  pricing and consent to processors are for a senior management meeting
  (FS-827).

## Where things are

- Repo `E:\Agents\Claude\Financial Services`, private, `origin`
  `https://github.com/eric-mokaya/finance`, branch `main`.
- **`REVIEW.md`** is the intake, its open rows; the closed ones are in
  **`review/`**, a file per hundred ids (FS-866); **`CHANGELOG.md`** the releases, and
  `docs/marketing/release-notes.md` the same for readers outside Dibon;
  **`changes/`** the change notes waiting for the next release;
  **`docs/decisions.md`** what each decision cost; **`docs/governance/rules.md`** the
  standing rules; **`docs/governance/document-register.md`** every document held
  with a party, by DR id; **`docs/customers/`** a delivery map per
  customer, on `_template.md`, its changelog in §8.
- **The reader:** `build/site/index.html`, every document linked and every
  id a link, rebuilt by the pre-commit hook; its Review page lists open
  rows by criticality, its "Documents by status" page every draft, its
  "Unreleased" page the notes and documents changed since the release;
  every page's header names its release, and every document's page ends
  with its History, from git, by release (FS-853); its Board shows the
  open rows as cards by column (FS-891). In the desktop app,
  `preview_start` name `site`.
- **Tools:** each one, and what it is for, in README, "The tools" (FS-1053).
- **Git-ignored, holding real material:** `clients/` (per party:
  `originals/`, `working/`, meeting folders), `sources/confidential/`,
  `sources/gatekeepr/`, `sources/market/`, `sources/regulation/ke/reports/`
  and `build/`. The law texts themselves are in git (FS-901): add each
  new one with its register row. **Never commit them, and never copy names, ID
  numbers, phone numbers or internal addresses out of them.** Write about
  them; register them by DR id.
- **Kept local, never committed:** `sources/odpc_registration.png`,
  `sources/dibon/recon-notes/`, and `design/card_design.png`, a
  third-party design image.
- **Products:** `docs/products/`: each institution's product version
  drafts, the loan kinds the vocabulary can describe, and `briefs/`, a
  brief for each product that is hard for an institution to do alone
  (FS-1029), from `briefs/_template.md`, which the check holds them to
  (FS-1031). **Who uses which app:** `docs/market/channels.md`. **Starter
  templates** for an institution's business customers and partners:
  `docs/templates/` (FS-1021).
- **Our documents' numbers** (`DC-FS-<kind>-<serial>`) are in
  design-system §7, and who received each in the document register's
  distribution log (FS-1026): give anything sent outside a number, and
  log its sending.
- **Deployments and running them:** `docs/deployments/`, a page per
  deployment from its template (components, how they interact, settings,
  integrations, continuity, access, data, licences, size, exit), checked
  against architecture/instance.md (FS-1037, FS-1045, FS-1046);
  `docs/runbooks/`, the steps when something fails (FS-1037); the
  architecture's review of 27 October in `docs/reviews/` (FS-1032).
- **A customer's working drafts** (questionnaires, worksheets, emails)
  live in `clients/<customer>/working/`, outside git; the document
  register records each, by DR id and version. Questionnaires: build with
  `--one-file`, then `tools/regulations-page.py`, then render through
  Word and look (products README).
- **Reviews with the team** run in Google Workspace (FS-1041): Word files
  uploaded as they are, never converted, so questionnaires keep their
  answer fields; a customer gets clean copies rebuilt from the sources,
  never the reviewed files (FS-1042).
- **Binary files** are refused by the pre-commit hook unless listed in
  `.githooks/allowed-binaries`. **Logos:** `design/brand/` (FS-524).

## Current state — ask, do not read

```bash
node tools/check.js --counts       # every check, the counts, each journey's statuses
node --test tools/check.test.js    # breaks each check on purpose
node tools/site.js                 # builds build/site/; the hook does this too
node tools/originals.js verify clients/roan-capital
git tag --list                     # the releases: docs-<YYYY.MM.DD>, <customer>-<YYYY.MM.DD>
node tools/dibon.js status         # the branch, the release, unsaved work, notes waiting
node tools/dibon.js history <file> # what changed in one document, by release
git log --oneline -15
git status --short
```

The most pressing: `grep -E "\| OPEN \| (Critical|High) \|" REVIEW.md`, or
the reader's Review page. Proposals awaiting go: the open rows whose notes
say "proposal in chat".

## The checks

`tools/check.js` runs: names, register (across REVIEW.md and review/:
every id once, open rows in REVIEW.md, closed rows in their hundred's
file) and review ids, markup (no Markdown file over 200 KB, which a
preview may show as raw text; no word in angle brackets outside code),
citations (each card in docs/law/ complete; in a document naming its main
instrument, every cite placed and on its card, and its "Regulations cited"
current), the module template, capabilities, diagrams, partners, public, copy and claims,
decisions, obligations, customers, regulation, assurance, references,
dependencies, scope, journeys, handbook, overview, specs, products (the
drafts, their typed values against `code/lender-rules/`), docregister
(the document register, read by its header: a summary on every row; every
DR id cited; each customer's §6 table the same as the register's rows for
it), status (each document's status against its kind's lifecycle;
`version:` only on outreach; a `released:` line naming a release in
CHANGELOG.md, or `unreleased`, which every template says; Start here's
statuses table naming every status and kind the checks allow, and no
other),
versions (the changelogs, README.md's and this file's release lines, and
the customer template), changes (each change note's form; no register ids
in a note read outside Dibon), words (the guide has a section for every
word `dibon` knows, and no other), links (also a path written as plain
text: one into docs/ that names no document fails, and so does a short
name two documents share with no folder before it on its line),
frontmatter
and reviewed (a change of content needs today's `last_reviewed`; a
change only to status, version, last_reviewed or released does not). The
pre-commit hook runs them, then rebuilds the reader. **When a check
fails, fix the document, not the check**; a check changes only with a
register row.

## Fetching documents

- **Kenya Law:** find the version on the work's page,
  `https://new.kenyalaw.org/akn/ke/act/<year>/<number>` (its search API
  returned nothing on 22 October; guess the number and read the page's
  title), then navigate the
  browser pane to `{AKN expression}/source` (a plain download of that
  address also works, FS-899). **The download is a
  GUID-named `.tmp` in Downloads, with a Save As dialog Claude cannot
  see:** copy the `.tmp` at once (size settled, ending `%%EOF`) to
  `sources/regulation/ke/<name>@<as-at>.pdf`; only then tell the owner to
  press Cancel, which otherwise deletes it (FS-576, FS-578). Never touch
  Word's `~WRL….tmp` files. Add the law register row before the check
  accepts the file.
- **CBK and SASRA** allow `curl` with a browser user agent.
- **PDFs** are read and rendered with `py` and PyMuPDF; Word through
  PowerShell COM exports a .docx to PDF (no `python` or `pdftoppm` here).
- **Close the browser pane when done.**

## Traps that have cost real time

**Read [the traps](docs/service-management/traps.md) before your first
edit** (FS-1053): 37 things that have cost a session real time, each
with what to do instead. `dibon session start` hands them over with this
page. When something costs you time, add it there, in the same pass.

## What each person is waiting on

In their own handover, handoffs/ and their handle (FS-931): where they
left off, and a part generated from the register (the rows with them,
their work started, their Claude's work waiting). The owner's is
handoffs/emokaya.md. The team's most pressing: the Critical and High rows
(the command above), and GitHub's board for the MVP (FS-930).
