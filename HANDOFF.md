# Dibon financial services — session handoff

    version: 1.5.0
    updated: 2026-10-08
    supersedes: 1.4.0; adds 8 October (FS-611 to FS-667)
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
`docs/architecture/README.md` §2 and §3 before you argue with it.

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
- **Diagrams are plain text, at most 100 columns** (FS-064, FS-579). In a
  box: the name in capitals as the components table in
  `docs/specs/README.md` names it, what it does in lower case, what it
  runs on in `[snake_case]` (FS-632). No Mermaid: the owner prefers ASCII
  (FS-628); the reader draws the ASCII with box lines.
- **Specs come in two kinds** on one template (FS-627): build (a service
  we write) and component (a product we configure). §1 ends with "Where it
  sits" and a Related line; relations in front matter, both ways; closing
  with tests (or "Checks before the build") and open questions.
- **Kapu Core is Fineract 1.15.x, pinned, never forked; every product
  progressive with advanced payment allocation; Fineract's maker-checker
  off; only Kapu MFI's service account may approve, disburse or
  restructure** (FS-626). The Mifos web app is open.
- **The night's close** (FS-633): checks at 21:00 and 23:45, blocking or
  warning by written criteria agreed with the institution; the business
  date moves at midnight regardless and only the close waits; two people
  to override; a severity 1 is a phone call. **Time** (FS-634): UTC
  stored, Nairobi business dates, three dates per money record, NTP with a
  500 ms alarm, references before time in matching (architecture §10).
  Items in transit are chased through each source's status query or
  statement until they clear (RO-07, FS-635).
- **Who holds what:** architecture §2 "Every store" lists every store,
  what it holds and never holds, its class and its protections (FS-636).
  Restricted fields encrypted one by one is SE-27, in R1 (FS-638).
- **Nothing needs reading** (FS-637): anything a person must confirm or be
  told is also available by voice or as numbers (omni-channel §1).
- **Bank payouts: one approval within limits a bank agrees by mandate
  letter, two above them** or through internet banking (RL-07, FS-594).
- **Payroll is paid from the employer's own accounts, never through
  Dibon**: net pay, statutory and check-off remittances in one approved
  run (business-suite BS-19, phase 2, FS-606, FS-608).
- **The portfolio's version is what a reader holds.** Only v1.0 has gone
  out; the work is v1.1, a draft, and the build refuses a named copy of a
  draft (FS-595).
- **Every decision from FS-490 names what it requires** in a `Requires:`
  line, and the check proves each item exists (FS-515).

## What is in flight

- **R1, Roan Capital's pilot** (customers CU-01). The delivery map is
  `docs/customers/roan-capital.md`; Roan's open answers are its §4, and
  answer 13 (the formulas, weights and thresholds behind appraisal and
  scoring) blocks decisioning's build. Roan's requirement document is
  Dibon's own and commits appraisal, a behaviour score and automatic
  downgrades to the MVP.
- **User journeys** in `docs/journeys/`: JN-01 to JN-06 written (the
  electronic and manual identity checks, the business borrower, a loan
  to disbursement, a guarantor, a restructure). JN-15 (a trader who does not read, phase 2) also written. Still to write for R1: JN-07 (borrower's documents), JN-08 (complaint), JN-14
  (settlement and the collateral's discharge), JN-13
  (a bank disbursement to settlement, return, recall or reversal). Each
  journey found gaps, settled with the owner one by one.
- **Architecture** is a folder (`docs/architecture/`, FS-649): README.md
  keeps §1 to §10, so "architecture §N" references hold; beside it the
  views: context, instance, deployment, runtime (sequence diagrams),
  interfaces, quality goals, constraints, risks.
- **Availability and recovery** (deployment.md §2 to §5): failover in
  seconds within a site; cold, warm (default), hot or hot-automatic across
  sites, chosen per institution; no active-active ledger (FS-655). Backups
  open through a recovery vault with three of five hardware-key holders,
  one outside Dibon (FS-657); never TOTP for shares (FS-659). Who carries a
  hardware key, and which: YubiKey 5C NFC for engineers and holders.
- **The preferred channel, never the only one** (architecture §3, FS-661):
  if we stop, the money does not; M-Pesa validation fallback set to
  complete; queued payouts checked before release; manual acts approved
  afterwards (manual.act); a fallback runbook per institution (OB-COM-23).
  Merchants give direct payment details by default (GW-16, FS-662).
- **Unplaced payments** (CO-21, FS-663): a ticket, the payer asked on the
  paying number, applied automatically only when the account is the
  phone's own, escalated at 48 hours, returned at day 7. **Flowza** (Dibon's
  own engagement platform) is the conversation layer, sending through
  messaging; its gaps before institutional use: FS-664 to FS-666.
- **Experience and training** (docs/experience.md, docs/training/):
  delightful to use is the sixth idea; draw, test with five users per
  role, measure; manuals by role, the key holder's written first. No
  designer on the team yet.
- **Every spec** (FS-667) carries a status (draft until the owner agrees it),
  Data, Quality and metrics, and Threats sections, and tests with ids; the
  check enforces them. **Events** are named only from the catalogue in
  `event-bus-kafka.md` §5 (CloudEvents, type `ke.dibon.` + name).
- **Specifications** in `docs/specs/` (index: `README.md`, with the map and
  the components table): approval engine, lender rules, Kapu Core on
  Fineract, the end-of-day runner, observability on Grafana, access on
  Keycloak (four realms per instance: staff, customers, ops, master;
  step-up as `loa3`; roles granted only by mandate; borrowers and
  guarantors code-only, FS-643; Odoo by OCA's `auth_oidc`, the one AGPL
  exception, FS-646). **Odoo is Enterprise, required** (FS-644).
  **Dibon engineers** (FS-645): one central identity brokered into each
  instance, no standing access to data, just-in-time grants approved by
  the institution where it runs operations, an access register compared
  monthly (SE-26, architecture §9). **Messaging** (`messaging.md`, FS-648):
  the R1 catalogue of 30 templates (27, then 3 for unplaced payments,
  FS-663); the institution owns and approves its
  words; a message never carries the outstanding balance. Next, in order:
  rails, reconciliation, kapu-mfi, identity, odoo, decisioning; then the sanctions adapter, guarantors and
  borrower access. **On-call:** Grafana OnCall's open-source edition was
  archived on 2026-03-24; GoAlert self-hosted with Twilio is proposed, the
  choice is the owner's (observability-grafana §5).
- **Incident management** (`docs/service-management/incident-management.md`): severities, the
  notification plan, what a notice says, the record and its closure.
  **Service management** (`docs/service-management/README.md`, FS-639): the
  ITIL 4 practices mapped; change kinds and the change calendar (no
  deployment during the night's close or at month-end); the configuration
  record generated from code (SE-23); problems and known errors; proposed
  service levels; tools on Odoo Helpdesk, Knowledge and the pipeline. Open:
  Odoo Enterprise for our own use, the GitOps tool, a status page. Its times are proposals until
  agreed with the rota and each customer.
- **Vendors for identity:** Smile ID, MetaMap and Prembly read from their
  API references (partners PT-30, PT-33, PT-53); Smile ID and Prembly
  proposed as the candidates; the owner has reached out to Prembly and
  will provide its updates.
- **The collateral registry** (Movable Property Security Rights Act and
  its regulations, law register LR-23, LR-37): MF-03 now searches before
  lending, records each notice, sends the borrower their copy within ten
  working days, warns before expiry and cancels at settlement, by hand on
  BRS's eCitizen portal in R1. No API is documented (partners PT-55).
- **Roan Capital's map** is nearly all Covered (FS-618); three rows stay
  Partial, each with a stated gap: RC-01, RC-02 and RC-36. R1 gained the
  collection ladder (MF-39), the public request page and calculator
  (BS-20) and one audit trail across modules (RO-27); the authenticator
  app is named in R1 (AC-16); the descoped collateral steps are tracked
  though done by hand (MF-04, FS-619).
- **The team** has been invited to read this repository and GateKeepr
  and to bring proposals on how to work together (FS-603). Nobody pushes
  here; a fresh clone fails the names check until it has the protected
  names list, which is not in git. They read the site with
  `node tools/site.js --reader`, which skips only that check and says so
  (FS-617).
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
- **`design/card_design.png`** is a third-party design image the owner
  shared as inspiration for page 17. It stays local and untracked; never
  commit it.
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
directly or by its folder), **specs** (template front matter and sections,
relations both ways, §1's diagram and Related line, the index, box names
from the components table), **links** (every relative link and every
`docs/…` path resolves; REVIEW.md exempt as history) and `reviewed`. The pre-commit hook runs them,
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
- **A blank line inside a Markdown table splits it**: the next row becomes
  a header and loses its anchor in the reader. Two were found in REVIEW.md.
- **A heredoc with nested quotes can fail in the Bash tool.** Write the
  script with the file tool instead.
- **A preview server serving `build/site` locks the folder on Windows**;
  the reader now empties it rather than deleting it.
- **Adding a capability row** can trip several checks at once: scope,
  references, dependencies (both front matter and §4 prose, both ways),
  customers, obligations. Moving one into R1 means a Roan map row, the
  CU-01 "Depends on" list and the delivery plan's R1 list together.
- **A break test can go stale** when the design catches up with it (one
  used MD-08 as an id Roan did not depend on, until Roan did).
- **Changing a template** changes its `last_reviewed` too.
- **Subagents claim more than they did.** Check their work.
- **Look at the portfolio, do not only measure it.** Render changed
  pages from the printed PDF (PyMuPDF) when the browser pane cannot take
  a screenshot; the probe has missed a problem once, and layout choices
  (a half-empty card, a squeezed text column) are not overflow.
- **The portfolio is public copy:** no register ids in it, not even in
  its editing notes; the public check fails on one.
- **A typed list in the copy goes stale.** Page 6's platform line was
  typed and fell two services behind; it is now read from Platform
  services. Prefer reading over typing.
- **The portfolio layout overflows silently**: build with
  `node design/portfolio-pdf/build.js --html-only`, then
  `node design/portfolio-pdf/measure.js`, which flags content past the
  page edge and, since FS-593, content running under the footer. On
  product and closing pages the last block is pushed to the bottom, so
  one extra line of copy anywhere above it overflows. **Versions are what a reader
  holds** (FS-595): only v1.0 has gone out. Between issues an edition is
  `"status": "draft"` in `design/portfolio-pdf/document.json` (now v1.1,
  draft), printed as a review draft, and the build refuses a named copy of
  it; the version moves only when an edition is issued.
- **A PDF open in a viewer** makes the build write a timestamped file.

## Waiting on the owner, outside the repository (as at 2026-10-06)

- The NPS Bill comments (`docs/outreach/nps-bill-2026-comments.md`) are
  **due 9 October**; the Bowmans letter has not been sent.
- Prembly: the outreach record and its updates (FS-546).
- The Liquid email and the partner emails; Microsoft Partner Center.
- Confirm that the KCB and NBK contracts allow naming them.
- Roan Capital's open answers (delivery map §4), above all 13 (appraisal
  and scoring definitions), 7 (roles), 10 (templates and policies), 11
  (the PEP question), 12 (bureau reports), 14 (statement-based entities)
  and 15 (its manual collateral steps and tracking provider); and Roan sending its banks
  the access request (`docs/outreach/bank-access-request.md`).
- The number of Odoo Enterprise users (FS-529).
- Counsel and the compliance officer, as listed in 1.2.0, plus whether an
  automatic downgrade "significantly affects" a borrower under s.35, and
  the two restructuring questions (FS-624).
- Which logo.
- Writing to BRS (mpsr@brs.go.ke): system-to-system access to the
  collateral registry, and organisation accounts (PT-55).
- Friday 9 October: the team's proposals (FS-603), the same day the NPS
  Bill comments are due.

## Left half-done, or asked and not yet answered

- **The R1 journeys still to write** (above), and the R2 ones indexed
  (JN-10 to JN-12).
- **Rows that block R1:** identity access and vendor choice (FS-202,
  FS-205, FS-329, FS-340), bank connections (FS-344), and business
  registry access for business borrowers (FS-564).
- **To confirm technically:** Odoo Sign link-only completion emails
  (FS-532); Fineract's thirteen checks on a running 1.15 instance
  (kapu-core-fineract §12, F1 to F13); Grafana and on-call checks
  (observability-grafana §11); whether the business registry's API returns
  beneficial owners (FS-566, FS-568); M-Pesa validation on tills and any
  Pochi API (CO-21); each bank's signing and certificate requirements.
- Proposals awaiting go: the OPEN rows whose notes say "Proposal in chat".
