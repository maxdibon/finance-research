# Dibon financial services — session handoff

    version: 1.2.0
    updated: 2026-10-06
    supersedes: 1.1.0, the same day; adds the end of the session
    purpose: hand this repository to a session that knows nothing about it

Paste everything below the line into a new session as its first message.

**Update this file at the end of a session, or when the owner asks.** It
carries no counts on purpose: see *Current state*.

---

You are picking up **Dibon's financial-services portfolio**: the documents
behind the products Dibon Consulting builds and runs for Kenyan financial
institutions. You are working with the **owner**, Dibon's Chief Technology
and Innovation Officer, who also leads security and the build. Refer to
people by role, never by name, in anything you write here.

## What this is

**A documentation repository, not a code base.** It holds the portfolio
(two PDF editions built from Markdown), one module file per product and
shared service, registers (law, privacy, documents, partners, competitors,
customers), the delivery plan, build specifications, and the checks that
keep all of them true. The software itself is built elsewhere.

**The products:** Kapu MFI, Kapu Sacco and Kapu Core (on Apache Fineract),
Collect and the Pay Gateway (which ran in production at Onit Bank), Escrow,
SME Recon, and the business suite on Odoo. Under them, shared services:
access, identity verification (with the document vault), mandates (the
approval engine), messaging, rails, reconciliation, financial crime,
insights and platform security.

**One line decides most questions:** the institution holds its licence,
its money and its records; Dibon holds the platform. Read
`docs/architecture.md` §2 and §3 before you argue with it.

## Settled: do not reopen without the owner

Each has a register row and, where it changed the design, an entry in
`docs/decisions.md` with what it cost.

- **An isolated instance per institution** (FS-491).
- **v1 is capped** at the phase-1 count in `docs/delivery-plan.md`
  (FS-490). The check fails past it; raising it is a decision, and has
  been raised openly several times. Most new ideas land in phase 2.
- **Keycloak is the one authority for roles** (FS-498).
- **Block easily; recover only after re-verification**, never on a
  one-time code alone (FS-503).
- **Documents and sensitive data travel only on our network**: links to
  our pages, the portal, an API or SFTP. WhatsApp, SMS, email and push
  carry notifications and links only. Once signed in, a customer may
  download and share their own copy as they choose (FS-532, architecture
  §7). USSD keeps balances behind the PIN.
- **People choose their channels**, one or more per kind of message, with
  three overrides: security alerts to every channel, regulatory notices on
  a channel with delivery reports, marketing by opt-in (FS-533).
- **Every document carrying personal data lives in the vault**; the
  contract record stays in Odoo with a link (FS-527, architecture §6).
- **Retention:** seven years from the end of the relationship or the
  transaction; twelve years from default for a secured loan written off
  or in recovery (`docs/documents.md`, FS-537, FS-538).
- **ClamAV scans uploads**, allowed by name as a separate GPL service;
  commercial engines at the customer's cost (FS-525).
- **Saccos have their own complaints clock**: 21 days, beside the
  lenders' 30 (FS-539).
- **The 2024 digital banking deck is retired**; the portfolio replaces it
  (FS-511).
- **Every decision from FS-490 names what it requires** in a `Requires:`
  line, and the check proves each item exists (FS-515).

## What is in flight

- **R1, Roan Capital's pilot** (customers CU-01): lending on Kapu MFI and
  Kapu Core with the CBK lender regulations' rules, restructuring, loan
  agreements signed through Odoo Sign, loan officers, guarantors' rights
  and borrowers' access; approvals including a 3-of-3 committee and
  approval from email; KYC with the national register and BRS; the
  document vault, sharing documents out, and email; sanctions screening;
  the platform and security minimum. Several of these were added by
  Dibon because the law requires them (RC-36 onwards). The delivery map is
  `docs/customers/roan-capital.md`; Roan's open answers are §4 there.
- **Build specifications** in `docs/specs/`: the lender rules and the
  approval engine. Still to write: the sanctions adapter, the M-Pesa
  port, the API contracts, and the design for guarantors and borrower
  access (MF-37, MF-38) inside the lender-rules spec.
- **KCB and National Bank of Kenya** are current SMS customers, named
  internally only until their contracts are confirmed to allow more
  (FS-420). **Onit Bank** is named in the portfolio. A 2024 prospect is
  in `clients/` and is not named in the documents.

## Do this first

1. Read `README.md` (the map and the rules), then `docs/start-here.md`
   (reading order by role, and what every id prefix means).
2. Run the checks (below). If they fail before you have changed anything,
   say so first.
3. Read the last fifteen commits: `git log --oneline -15`. The messages
   carry the reasoning.
4. Read the newest rows at the bottom of `REVIEW.md`; the open ones there
   are what the owner is waiting on.

## Where things are

- Repo `E:\Agents\Claude\Financial Services`, private, `origin` is
  `https://github.com/eric-mokaya/finance`, branch `main`.
- **`REVIEW.md`** is the intake: every point raised, with an FS id.
  **`docs/decisions.md`** says what each decision cost and what was argued
  against. **`docs/documents.md`** says what an institution keeps, under
  which law, for how long, and where.
- **Git-ignored, and holding real material** (README, "What git does not
  see"): `clients/`, `sources/confidential/` (including the
  protected-names list), `sources/gatekeepr/`, `sources/market/`
  (vendors' papers), `sources/regulation/` (law texts, and regulators'
  guidelines in `guidelines/`) and `build/`. **Never commit them, and
  never copy names, ID numbers, phone numbers or internal addresses out of
  them.** Write *about* them.
- **The Onit spec in `clients/` holds internal addresses, a sample
  password and a person's name.** It must never be committed or quoted.
- **Binary files** are refused by the pre-commit hook unless listed in
  `.githooks/allowed-binaries`. Add a path only after looking at the file
  and confirming it is Dibon's own and names no client.
- **Logos:** the builds use `design/brand/dibon_logo_white.png` until the
  owner chooses (FS-524, FS-542). Beside it are vector candidates of the
  "Dibon Consulting" mark in amber, plum and white
  (`dibon_consulting_logo_*.svg`), cropped from the owner's SVGs in
  `sources/dibon/`; 3.svg and 4.svg there are unusable (a JPEG with a black
  box). Switching is one line in each build, then a layout check.

## Fetching documents

- **Kenya Law** refuses scripts. Navigate the browser pane to
  `{AKN expression}/source`; the PDF lands in Downloads as a `.tmp` with a
  GUID name. **Take only GUID-named files created in the last minute**:
  picking "the newest .tmp" once moved an old Word temp file of the
  owner's (restored). Copy to `sources/regulation/ke/<name>@<as-at>.pdf`,
  compare, then delete the download. The search API is
  `/search/api/documents/?search=`.
- **CBK and SASRA** allow `curl` with a browser user agent. SASRA's files
  are at `/download/<slug>/?wpdmdl=<id>`; read the id from the page.
- **PDFs** are read with `py` and `pypdf` (`PYTHONIOENCODING=utf-8`).
  Ligatures break searches: "five" may be "ﬁve". **Scanned PDFs** have no
  text: render pages with PyMuPDF (`import pymupdf`, installed) and read
  the images.
- **Downloads need the owner's permission**; reading what the owner asked
  for counts.
- **Close the browser pane when the downloads are done** (FS-542).

## Current state — ask, do not read

```bash
node tools/check.js --counts       # every check, and the computed counts
node --test tools/check.test.js    # breaks each check on purpose
node tools/assemble.js             # builds build/master.md
git log --oneline -15
git status --short
```

Rows that block R1: `grep "blocks R1" REVIEW.md | grep "| OPEN |"`.
Proposals awaiting go: `grep "| OPEN |" REVIEW.md | grep "Proposal in chat"`.

## How the owner wants you to work

- **Record before answering.** Every point raised gets a `REVIEW.md` row
  with the next FS id before you discuss it. Nothing is filtered at intake.
- **Recommend, then wait for "go".** For questions, answer with a
  recommendation and what it costs, record the proposal, and apply it when
  the owner says go. A direct instruction is applied at once.
- **Disagree openly**, and say when your own earlier claim was wrong.
- **Read the law before citing it.** Every regulation number here was
  read in the text; when one has not been, say "to confirm".
- **Compute counts; never type them.** Typed counts have been wrong here
  more than once.
- **Verify by breaking things.** A new check gets a test that makes it
  fail.
- **Say what you did not do**, in the reply, plainly. Report your own
  mistakes the same way.
- **Commit as you go**, with explicit paths (never `git add -A`) and the
  reasoning in the message, ending with the co-author line the session
  gives you. **Push only when the owner says "push".**
- **Roles, never names**, for people. **Customer-safe language** inside as
  well as outside.
- **Status is evidence:** Live, Built, Designed or Planned.
- **Never sign in, or enter a password, on a live site.** Use the office
  line, +254 792 745 509, in anything outbound.

## The checks

`tools/check.js` runs: names, register and review ids, the module
template, capability rows, diagrams no wider than 78 columns, partners,
the public/internal line, copy and claims for the portfolio, decisions,
obligations, customers (a customer's "Depends on" equals its delivery
map), regulation (law rows may drive capabilities and document types),
assurance, references, dependencies (two-way, and named in §4 prose),
scope (the v1 cap) and `reviewed` (a changed file carries a fresh
`last_reviewed`). The pre-commit hook runs them.

**When a check fails, fix the document, not the check.** A check changes
only with a register row.

## Traps that have cost real time

- **`node -e` in Bash mangles regexes, backslashes, backticks and `${}`.**
  Write the script to the scratchpad with the Write tool and run it, or
  use Edit. Scripts that edit should print MISSING for every anchor they
  fail to find, and you should stop when one does.
- **`REVIEW.md` may end without a newline.** Append by reading it,
  trimming trailing whitespace, and writing back with a final newline.
- **Files are a mix of CRLF and LF.** Normalise `\r\n` before matching;
  git's line-ending warnings are harmless.
- **Adding a capability row** can trip several checks at once: scope if
  phase 1, references, dependencies if it names another module, customers
  if a delivery map cites it, obligations if a decision requires it. A
  phase-1 row in R1 also moves the delivery plan's computed counts.
- **Subagents claim more than they did.** Check their work by running the
  checks and reading a sample.
- **The portfolio layout overflows silently.** After a copy change, build
  with `node design/portfolio-pdf/build.js --html-only`, then run
  `node design/portfolio-pdf/measure.js`: it prints any page whose content
  passes the edge, and exits 1. A change to the copy bumps both editions
  in `design/portfolio-pdf/document.json` (now v1.4).
- **A PDF open in a viewer** makes the build write a timestamped file.

## Waiting on the owner, outside the repository (as at 2026-10-06)

- The NPS Bill comments (`docs/outreach/nps-bill-2026-comments.md`) are
  **due 9 October**; the Bowmans letter (review and a conflict check:
  they act for KCB) has not been sent.
- The Liquid email (now also asking about Sophos scanning, item 14) and
  the partner emails; enrolment in Microsoft Partner Center.
- Confirm that the KCB and NBK contracts allow naming them.
- Roan Capital's open answers (delivery map §4): its licence, its role
  list, and answer 10 (agreement and guarantee templates, how borrowers
  sign, its restructuring policy).
- The number of Odoo Enterprise users, for the commercials (FS-529).
- Counsel: whether fees count inside the arrears cap (reg 29); whether
  statutory deductions count inside the two-thirds limit (Employment Act
  s.19(3)); whether Odoo Sign with a code to the bound phone is an
  advanced electronic signature for loans and guarantees.
- The compliance and risk officer: confirm the periods marked
  *proposed* in `docs/documents.md`, and whether staff contracts follow
  the vault rule.
- Which logo: the current mark, or the "Dibon Consulting" vectors.

## Left half-done, or asked and not yet answered

- **To confirm technically:** that Odoo Sign can send link-only completion
  emails; if not, signing moves to our own page (FS-532).
- **The remaining R1 specs** (above), and the rows that block R1.
- Proposals awaiting go are the OPEN rows whose notes say "Proposal in
  chat"; read their notes before asking the owner again.
