# Dibon financial services — session handoff

    version: 1.3.0
    updated: 2026-10-06
    supersedes: 1.2.0, the same day; adds the second session (FS-544 to FS-589)
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
customers), the delivery plan, build specifications, user journeys, the
testing approach, and the checks that keep all of them true. The software
itself is built elsewhere.

**The products:** Kapu MFI, Kapu Sacco and Kapu Core (on Apache Fineract),
Collect and the Pay Gateway (which ran in production at Onit Bank), Escrow,
SME Recon, and the business suite on Odoo. Under them, shared services:
access, identity verification (with the document vault), mandates (the
approval engine), messaging, rails, reconciliation, financial crime,
decisioning (appraisal, scores and risk classes), insights and platform
security.

**One line decides most questions:** the institution holds its licence,
its money and its records; Dibon holds the platform. Read
`docs/architecture.md` §2 and §3 before you argue with it.

## Settled: do not reopen without the owner

Each has a register row and, where it changed the design, an entry in
`docs/decisions.md` with what it cost.

- **An isolated instance per institution** (FS-491).
- **v1 is capped** at the phase-1 count in `docs/delivery-plan.md`
  (FS-490). The check fails past it; raising it is a decision, and has
  been raised openly many times. Most new ideas land in phase 2.
- **Keycloak is the one authority for roles** (FS-498).
- **Block easily; recover only after re-verification** (FS-503).
- **Documents and sensitive data travel only on our network**; WhatsApp,
  SMS, email and push carry notifications and links only (FS-532).
- **People choose their channels**, with three overrides (FS-533).
- **Every document carrying personal data lives in the vault** (FS-527).
- **Retention:** seven years; twelve from default for a secured loan
  written off or in recovery (FS-537, FS-538).
- **Identity:** a manual route only where no register or vendor covers a
  document, never for a mismatch, with a second approval and the record
  marked verified manually (FS-544); a mismatch goes to a restricted
  compliance team in the institution's Odoo Helpdesk, because tipping off
  is an offence (FS-555); **KYC tiers** from the evidence held, limits
  per tier set by each institution (FS-551); USSD self-sign-up is phase 2.
- **Roan Capital runs on Dibon's own messaging service**, not its own SMS
  gateway (FS-565).
- **Collect takes deposits paid to the institution's own paybill and
  tills**, never into a partner's own shortcode or a Pochi la Biashara;
  money that becomes a deposit goes through Collect, money that pays a
  merchant through the Gateway (FS-552, FS-554).
- **Transaction rules and a business calendar** (financial-crime FC-16,
  core KC-15): every money movement meets the institution's rules before
  a rail; the strictest outcome wins; an allow-list never relaxes a legal
  limit, a sanctions match or a SIM-swap hold (FS-574).
- **Decisioning is one shared engine**, rules first, evidence for people
  in R1, built to take AI later behind one contract; the Data Protection
  Act s.35 safeguards before anything is automated (FS-582, FS-583).
- **Every component is replaceable behind a stable contract**
  (architecture §6, FS-584).
- **Every payout is one instruction from approval to settlement**, with
  cancellation, recall, returns and reversals; the Gateway is never on an
  institution's payout path (FS-586, FS-587).
- **What is approved is what is sent**, and **no Dibon role, break-glass
  included, moves an institution's money** (FS-588).
- **Diagrams are plain text, at most 100 columns** (FS-064, FS-579).
- **Every decision from FS-490 names what it requires** in a `Requires:`
  line, and the check proves each item exists (FS-515).

## What is in flight

- **R1, Roan Capital's pilot** (customers CU-01). The delivery map is
  `docs/customers/roan-capital.md`; Roan's open answers are its §4, and
  answer 13 (the formulas, weights and thresholds behind appraisal and
  scoring) blocks decisioning's build. Roan's requirement document is
  Dibon's own and commits appraisal, a behaviour score and automatic
  downgrades to the MVP.
- **User journeys** in `docs/journeys/`: JN-01 to JN-04 written (the
  electronic and manual identity checks, the business borrower, a loan
  to disbursement). Still to write for R1: JN-05 (guarantor), JN-06
  (restructuring), JN-07 (borrower's documents), JN-08 (complaint), JN-13
  (a bank disbursement to settlement, return, recall or reversal). Each
  journey found gaps, settled with the owner one by one.
- **Build specifications** in `docs/specs/`: the lender rules and the
  approval engine. Still to write: the sanctions adapter, the M-Pesa
  port, the API contracts, guarantors and borrower access.
- **Vendors for identity:** Smile ID, MetaMap and Prembly read from their
  API references (partners PT-30, PT-33, PT-53); Smile ID and Prembly
  proposed as the candidates; the owner has reached out to Prembly and
  will provide its updates.
- **KCB and National Bank of Kenya** are current SMS customers, named
  internally only until their contracts allow more (FS-420).

## Do this first

1. Read `README.md` (the map and the rules), then `docs/start-here.md`
   (reading order by role, and every id prefix).
2. Run the checks (below). If they fail before you have changed anything,
   say so first.
3. Read the last fifteen commits: `git log --oneline -15`. The messages
   carry the reasoning.
4. Read the newest rows at the bottom of `REVIEW.md`; the open ones there
   are what the owner is waiting on.

## Where things are

- Repo `E:\Agents\Claude\Financial Services`, private, `origin` is
  `https://github.com/eric-mokaya/finance`, branch `main`.
- **`REVIEW.md`** is the intake. **`docs/decisions.md`** says what each
  decision cost. **`docs/journeys/`** walks what people go through, with
  the gaps each journey found. **`docs/testing.md`** says how a capability
  is proven Built: acceptance items here, tagged tests in the code
  repository, a coverage matrix.
- **The reader:** `build/site/index.html`, linked HTML of every document,
  every id a link, rebuilt by the pre-commit hook. Open it in a browser;
  in the desktop app, start it with `preview_start` name `site`
  (`.claude/launch.json`, local and git-ignored).
- **Git-ignored, and holding real material:** `clients/` (Roan Capital's
  requirement document is there), `sources/confidential/`,
  `sources/gatekeepr/`, `sources/market/`, `sources/regulation/` (the law
  texts) and `build/`. **Never commit them, and never copy names, ID
  numbers, phone numbers or internal addresses out of them.** Write
  *about* them.
- **Binary files** are refused by the pre-commit hook unless listed in
  `.githooks/allowed-binaries`.
- **Logos:** the builds use `design/brand/dibon_logo_white.png` until the
  owner chooses (FS-524, FS-542).

## Fetching documents

- **Kenya Law** refuses scripts. Find the latest version through
  `/search/api/documents/?search=` or the work's page, then navigate the
  browser pane to `{AKN expression}/source`. The navigation may report a
  failure; the file still downloads.
- **The download is a GUID-named `.tmp` in Downloads, and Windows opens a
  Save As dialog for it** that Claude cannot see or close. **Copy the
  `.tmp` at once** (wait for its size to settle, check it ends `%%EOF`),
  to `sources/regulation/ke/<name>@<as-at>.pdf`; only then tell the owner
  it is safe to press **Cancel**. Cancelling first deletes the file
  (FS-576, FS-578). Take only GUID-named files created since the download
  began; `~WRL….tmp` files are Word's, never touch them.
- Add the law register row (`docs/regulation.md`, next LR id) before the
  check will accept the new file.
- **CBK and SASRA** allow `curl` with a browser user agent.
- **PDFs** are read with `py` and `pypdf`; a reusable search script is
  worth writing to the scratchpad. Ligatures break searches.
- **Downloads need the owner's permission**; reading what the owner asked
  for counts. **Close the browser pane when done.**

## Current state — ask, do not read

```bash
node tools/check.js --counts       # every check, the counts, each journey's statuses
node --test tools/check.test.js    # breaks each check on purpose
node tools/site.js                 # builds build/site/; the hook does this too
git log --oneline -15
git status --short
```

Rows that block R1: `grep "blocks R1" REVIEW.md | grep "| OPEN |"`.
Proposals awaiting go: `grep "| OPEN |" REVIEW.md | grep "Proposal in chat"`.

## How the owner wants you to work

- **Record before answering.** Every point raised gets a `REVIEW.md` row
  with the next FS id before you discuss it, in order: the register check
  fails on a skipped id.
- **Recommend, then wait for "go".** A direct instruction is applied at
  once. When a message is ambiguous, answer every reading and ask which.
- **Disagree openly**, and say when your own earlier claim was wrong.
- **Read the law before citing it.** When a text has not been read, say
  "to confirm", and ask to download it.
- **Compute counts; never type them.** The delivery plan carries typed
  counts in four places; recompute them with a script after any change to
  phase 1 or Roan's map, and check the script reproduces the old figures
  first.
- **Verify by breaking things.** A new check gets tests that make it
  fail.
- **Say what you did not do**, plainly, and report your own mistakes.
- **Commit as you go**, with explicit paths and the reasoning in the
  message. **Run the tests before committing, and stop if any fail**: a
  chained command once committed with a failing test. **Push only when
  the owner says "push".**
- **Roles, never names**, for people. **Customer-safe language** inside as
  well as outside.
- **Status is evidence:** Live, Built, Designed or Planned.
- **Never sign in, or enter a password, on a live site.**

## The checks

`tools/check.js` runs: names, register and review ids, the module
template, capability rows, diagrams no wider than 100 columns, partners,
the public/internal line, copy and claims, decisions, obligations,
customers, regulation, assurance, references, dependencies, scope,
**journeys** (template headings, a release, capabilities on every step,
no typed status, a flow diagram showing every step and failure, anything
outside the release named in §4 Gaps, every journey indexed),
**overview** (every document under `docs/` linked from the overview,
directly or by its folder) and `reviewed`. The pre-commit hook runs them,
then rebuilds the reader.

**When a check fails, fix the document, not the check.** A check changes
only with a register row.

## Traps that have cost real time

- **`node -e` in Bash mangles regexes, backticks and `${}`.** Write
  scripts to the scratchpad and run them. Scripts that edit should count
  each anchor and stop unless it matches exactly once. **Count a regex's
  matches with a global regex**: `match` without `g` returns the capture
  groups too, and once made every anchor look doubled.
- **`REVIEW.md` may end without a newline**, and its last row then has no
  trailing `\n` to anchor on.
- **Files are a mix of CRLF and LF.** Normalise before matching.
- **Adding a capability row** can trip several checks at once: scope,
  references, dependencies (both front matter and §4 prose, both ways),
  customers, obligations. Moving one into R1 means a Roan map row, the
  CU-01 "Depends on" list and the delivery plan's R1 list together.
- **A break test can go stale** when the design catches up with it (one
  used MD-08 as an id Roan did not depend on, until Roan did).
- **Changing a template** changes its `last_reviewed` too.
- **Subagents claim more than they did.** Check their work.
- **The portfolio layout overflows silently**: build with
  `node design/portfolio-pdf/build.js --html-only`, then
  `node design/portfolio-pdf/measure.js`.
- **A PDF open in a viewer** makes the build write a timestamped file.

## Waiting on the owner, outside the repository (as at 2026-10-06)

- The NPS Bill comments (`docs/outreach/nps-bill-2026-comments.md`) are
  **due 9 October**; the Bowmans letter has not been sent.
- Prembly: the outreach record and its updates (FS-546).
- The Liquid email and the partner emails; Microsoft Partner Center.
- Confirm that the KCB and NBK contracts allow naming them.
- Roan Capital's open answers (delivery map §4), above all 13 (appraisal
  and scoring definitions), 7 (roles), 10 (templates and policies), 11
  (the PEP question) and 12 (bureau reports); and Roan sending its banks
  the access request (`docs/outreach/bank-access-request.md`).
- The number of Odoo Enterprise users (FS-529).
- Counsel and the compliance officer, as listed in 1.2.0, plus whether an
  automatic downgrade "significantly affects" a borrower under s.35.
- Which logo.

## Left half-done, or asked and not yet answered

- **The R1 journeys still to write** (above), and the R2 ones indexed
  (JN-10 to JN-12).
- **Rows that block R1:** identity access and vendor choice (FS-202,
  FS-205, FS-329, FS-340), bank connections (FS-344), and business
  registry access for business borrowers (FS-564).
- **To confirm technically:** Odoo Sign link-only completion emails
  (FS-532); Fineract's working days and holidays fed from the business
  calendar (KC-15); whether the business registry's API returns
  beneficial owners (FS-566, FS-568); M-Pesa validation on tills and any
  Pochi API (CO-21); each bank's signing and certificate requirements.
- **The portfolio** still names MetaMap as coming soon and describes
  Collect as partner-collected only; changing it bumps both editions.
- Proposals awaiting go: the OPEN rows whose notes say "Proposal in chat".
