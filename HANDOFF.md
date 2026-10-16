# Dibon financial services — session handoff

    release: 2026.10.15.1 · patch
    updated: 2026-10-15
    the release is the documentation's, moved by each release (FS-842);
    this file has no version of its own
    purpose: hand this repository to a session that knows nothing about it

Paste everything below the line into a new session as its first message.

**Update this file at the end of a session, or when the owner asks.** It
holds no history and no counts on purpose: those are in the changelog,
the registers and the reader.

---

You are picking up **Dibon's financial-services portfolio**: the documents
behind the products Dibon Consulting builds and runs for Kenyan financial
institutions. You are working with the **owner**, Dibon's Chief Technology
and Innovation Officer, who also leads security and the build. Refer to
people by role, never by name, in anything you write here.

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
security). **R1 is Roan Capital's pilot** (customers CU-01).

**One line decides most questions:** the institution holds its licence,
its money and its records; Dibon holds the platform. Read
`docs/architecture/README.md` §2 and §3 before you argue with it.

## Do this first

1. Read `README.md` (the map), then `docs/start-here.md` (reading order by
   role, every id prefix).
2. Run the checks (below). If they fail before you have changed anything,
   say so first.
3. Read the newest entry of `CHANGELOG.md`, and of Roan Capital's
   delivery map §8: where things stand, version by version.
4. Read the last fifteen commits (`git log --oneline -15`) and the newest
   rows at the bottom of `REVIEW.md`; the open ones are what the owner is
   waiting on.

## How the owner wants you to work

- **Record before answering.** Every point raised gets the next FS row in
  `REVIEW.md` before you discuss it; the register check fails on a
  skipped id. **Rate every open row** Critical, High, Medium or Low; a
  closed row loses its rating.
- **Recommend, then wait for "go".** A direct instruction is applied at
  once. When a message is ambiguous, answer every reading and ask which.
  **"Go" is not "push":** push only when the owner says "push".
- **Disagree openly**, say when your own earlier claim was wrong, and say
  what you did not do.
- **Cite the law through its card** (FS-868): a provision cited gets a
  row on its instrument's card in docs/law/, read from the text; a
  document names its main instrument (`law: LR-03`) and gives other
  cites their id where made; `node tools/citations.js` writes the section.
- **Read the law before citing it**, in its text in `sources/regulation/`;
  when it has not been read, say "to confirm". Cite the provision.
- **Compute counts; never type them.** The delivery plan's typed R1
  counts are recomputed by a script that first reproduces the old ones.
- **Verify by breaking things.** A new check gets tests that make it fail.
- **Commit as you go**, explicit paths, the reasoning in the message; run
  the tests first and stop if any fail.
- **Roles, never names**, for people. **Customer-safe language**, inside
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
- **The team's words** (`tools/dibon.js`; the guide is ways-of-working
  §7 to §10, FS-865): when someone asks in plain
  sentences ("update, then mark answer 24 as answered"), use the words,
  say what you understood, and run them with `--yes` only after they have
  said yes in chat. Developers may use git directly, by ways-of-working §6.
  **Claude uses the words too, where a request matches one** (release,
  note, answered, received, meeting, history, status, check), with
  `--body-file` for the commit's body and the co-author line; and git
  on main for building tools and documents, under the single-owner
  exception, since save and share refuse main (FS-862, owner, 2026-10-16).
  At GitLab, the words for everything, on branches.
- **Documents for outside readers** start from `docs/design-system.md`:
  one look, a little whimsy in the margins, never in figures or terms.
- **Never sign in, or enter a password, on a live site**; downloads need
  the owner's permission.

## The rules a session must not break

Each is settled, with its register row, and written into the documents
it shapes (the architecture, the specs, the modules); many have an entry
in `docs/decisions.md` saying what it cost, and the standing rules are in
`docs/rules.md`. Do not reopen one without the owner.

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
  authority (lender-rules §2.4), published only once active; a product is
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
  `docs/legal-questions.md`, cited by LQ id (FS-744).
- **The portfolio's version is what a reader holds:** v1.0 and v1.1 have
  gone out; the next edit starts v1.2 as a draft in
  `design/portfolio-pdf/document.json` (FS-595).
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
  **`docs/decisions.md`** what each decision cost; **`docs/rules.md`** the
  standing rules; **`docs/document-register.md`** every document held
  with a party, by DR id; **`docs/customers/`** a delivery map per
  customer, on `_template.md`, its changelog in §8.
- **The reader:** `build/site/index.html`, every document linked and every
  id a link, rebuilt by the pre-commit hook; its Review page lists open
  rows by criticality, its "Documents by status" page every draft, its
  "Unreleased" page the notes and documents changed since the release;
  every page's header names its release, and every document's page ends
  with its History, from git, by release (FS-853). In the desktop app,
  `preview_start` name `site`.
- **Tools:** `tools/check.js` and its tests; `tools/site.js`, the reader;
  `tools/assemble.js`, the Master; `tools/products/`, product
  questionnaires built and read back (the builder needs the docx package
  via DOCX_MODULE); `tools/originals.js`, originals kept and verified;
  `tools/cut.js`, releases; `tools/release.js`, which release a reader
  is reading; `tools/dibon.js` (with `dibon` and `dibon.cmd` at the
  root), the team's words; `tools/register.js`, the review register across
  REVIEW.md and review/, and `tidy`, which files each row by its status
  (FS-866); `tools/citations.js`, each document's "Regulations cited"
  from the instrument cards in docs/law/, and `--external` for a Word or
  PDF document (FS-868); `tools/paths.js`, what a path written as plain
  text means, for the reader and the links check (FS-856);
  `tools/docregister.js`, the one reader of the document register, by its
  header, and the maker of each customer's table of documents (FS-857).
- **Git-ignored, holding real material:** `clients/` (per party:
  `originals/`, `working/`, meeting folders), `sources/confidential/`,
  `sources/gatekeepr/`, `sources/market/`, `sources/regulation/` (the law
  texts) and `build/`. **Never commit them, and never copy names, ID
  numbers, phone numbers or internal addresses out of them.** Write about
  them; register them by DR id.
- **Kept local, never committed:** `sources/odpc_registration.png`,
  `sources/dibon/recon-notes/`, and `design/card_design.png`, a
  third-party design image.
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

- **Kenya Law** refuses scripts: find the version through
  `/search/api/documents/?search=` or the work's page, then navigate the
  browser pane to `{AKN expression}/source`. **The download is a
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

- **Heredocs and `node -e` eat backslashes, backticks and quotes**: a lost
  `\d` once made the check report every problem at line 0. Write any
  script holding them with the file tool and run it.
- **Count every anchor and stop unless it matches once**; a replacement
  that matches nothing can still write somewhere (FS-779). **Load a file
  once per script**: two edits from the same original overwrite each
  other. **Normalise CRLF and LF** before matching.
- **A guard for a table's header can swallow a real row of the same
  name**, and **a blank line inside a Markdown table splits it**: compare
  row counts before and after.
- **PowerShell variable names ignore case** (`$w` is `$W`), and
  PowerShell 5.1 garbles non-ASCII in file names: find them by wildcard.
- **The phase-1 cap is full**; adding a capability trips scope,
  references, dependencies, customers and obligations at once.
- **A break test goes stale** when the design catches up with it: run the
  whole suite after any change to ids or relations. **A new spec touches
  six others** (used_by, Related lines, the end-of-day runner).
- **The portfolio overflows silently:** build with `--html-only` and run
  `design/portfolio-pdf/measure.js`; look at the printed pages, do not
  only measure them. It is public copy: no register ids, not even in
  notes.
- **Word over COM** can crash on closing: note the WINWORD processes
  before starting one, and close only your own. A document open in Word
  is locked: copy beside it, never over it.
- **The docx package cannot make Word form fields**: the builder swaps
  marker paragraphs for content controls after packing.
- **Nested backticks break the reader**: describe a fence marker in words.
- **A settled answer must be encoded in the same commit**, or the
  products check blocks it.
- **A protected name can hide in a folder name**: the names check reads
  every committed word, paths in tables included.
- **A script can match nothing and still print "ok":** a mangled pattern
  once marked no register rows at all. Check the result (count the rows
  changed), never the script's own word.
- **Writing the marker `[decision]` in a row's notes marks the row as a
  decision**, and the decisions check then wants an entry for it: say "as
  a decision" in prose.
- **Every commit subject starts with its register row** ("FS-123: …"), or
  Merge, Revert or Release: the commit-msg hook refuses others.
- **Take the next FS id from the real register**,
  `node -e "console.log(require('./tools/register').nextId('.'))"`: the
  newest row may already be closed and in review/. Never from a sandbox
  or a practice copy, whose ids go nowhere.
- **After closing or reopening a row, run `node tools/register.js tidy`**,
  or the register check fails: closed rows live in review/, open rows in
  REVIEW.md. A closed row's later edits are in its review/ file.
- **Windows cannot rename across drives** (Downloads on C:, the
  repository on E:): copy, check the copy, then remove the source, as
  `tools/originals.js` does.
- **Never type a release into a document's `released:` line**: a new
  document says `unreleased` and the release stamps it. A diff that moves
  only that line is no change, to the reader's "changed since", to the
  history and to the reviewed check alike. The rule is written twice, in
  `tools/release.js` and in the reviewed check: change both together.
- **A throwaway clone for testing a tool gets no confidential files:**
  copying `sources/confidential/protected-names.txt` into one was refused,
  rightly. `tools/cut.js` and the history need none of it.
- **Run the full tests after a release,** not only the checks: a test
  that rebuilt the changelog from scratch failed from the release on,
  as the documents then named a release the fixture lacked (FS-861).
- **A throwaway clone tests what is committed in it, not your edits:**
  `git diff` leaves out new files (copy them in), and `dibon start`
  branches from the shared copy, which for a clone is the real
  repository; remove the clone's `origin` first.
- **The reader cannot italicise around a code span:** a line in
  asterisks holding a code span shows its asterisks. Write the path
  plainly inside emphasis.
- **The browser pane may not draw when it is hidden**, and a click or
  screenshot then times out: read the page with `find`, `get_page_text` or
  `javascript_tool` instead.
- **Subagents claim more than they did.** Check their work.

## Waiting on the owner (as at 2026-10-15)

- **In the register:** the Critical and High rows (the command above);
  decisions for FS-796 (who owns the interpretation record's readings,
  and who builds the companion); FS-812's remainder (starter templates
  and synthetic test products in code); storage (FS-819 to FS-821, the
  last after Liquid answers); provenance of the documents outside Roan
  Capital's folder (FS-840).
- **Roan Capital:** the evening's steps after the 15 October meeting
  (`clients/roan-capital/meeting-2026-10-15/record.md`); a senior
  management meeting (licence, CBK's approval of pricing, consent to
  processors, CBK's notice of a new delivery channel); its open answers,
  delivery map §4.
- **To send:** the Liquid enquiry with its storage questions, the Prembly
  changes letter, the bank requests to NCBA, KCB and SBM
  (`docs/outreach/`; each letter's status says whether it went). **The
  outreach statuses were set to "draft" without confirmation:** ask which
  went, and mark those "sent" (FS-839).
- **Releases:** the first, 2026.10.15, is released and tagged for the
  documentation and for Roan Capital. Six notes wait for the next, all
  patches: every document names its release (for everyone, FS-852) and
  shows its history (FS-853); statuses explained in Start here (FS-855),
  then in one table (FS-858); paths link in the reader (FS-856); each
  customer lists its documents (FS-857); the last five for the team.
  **The 36 document summaries (FS-857) were written from titles and our
  work, not from the files:** ask the owner to skim them, and to settle
  the "to confirm" ones. The next is the owner's call:
  propose one when the notes waiting (the reader's "Unreleased" page) are
  worth telling; then `node tools/cut.js`, commit (`Release <tag>`), an
  annotated tag, and the tag pushed with the commits. That release is the
  first to move the documents' `released:` lines: check that only the
  documents changed since 2026.10.15 move.
- **The team cannot share yet:** until the move to GitLab, only the owner
  pushes to GitHub, so a teammate's `dibon share` stops at "saved on your
  branch; tell the owner it is ready to merge". The owner merges.
- **Outside the repository:** the second site's provider before Roan
  Capital's go-live (FS-775); counsel for the LQ register (none engaged);
  the Odoo consultants (paid users; Odoo Enterprise for Dibon, FS-640);
  the Data Commissioner controller registration (FS-367, Critical).
- **Older asks not yet confirmed done:** the NPS Bill comments and the
  Bowmans letter; writing to BRS for registry access (PT-55); whether
  KCB's and NBK's contracts allow naming them (FS-420); which logo.
