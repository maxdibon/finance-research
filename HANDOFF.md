# Dibon financial services — session handoff

    version: 1.0.0
    updated: 2026-10-06
    supersedes: nothing; the first handoff (FS-507)
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
shared service, registers (law, privacy, partners, competitors, customers),
the delivery plan, build specifications, and the checks that keep all of
them true. The software itself is built elsewhere.

**The products:** Kapu MFI, Kapu Sacco and Kapu Core (on Apache Fineract),
Collect and the Pay Gateway (which ran in production at Onit Bank), Escrow,
SME Recon, and the business suite on Odoo. Under them, shared services:
access, identity, mandates (the approval engine), messaging, rails,
reconciliation, financial crime, insights and platform security.

**One line decides most questions:** the institution holds its licence,
its money and its records; Dibon holds the platform. Read
`docs/architecture.md` §2 and §3 before you argue with it.

**Each institution runs in its own isolated instance** (FS-491), and **v1
is capped** at the phase-1 count in `docs/delivery-plan.md` (FS-490). The
check fails if phase 1 grows past it; raising it is a decision.

## What is in flight

- **R1, Roan Capital's pilot** (customers CU-01): lending on Kapu MFI and
  Kapu Core, approvals including a 3-of-3 committee and approval from
  email, KYC with the national register and BRS, the lender rules of the
  CBK lender regulations 2026, sanctions screening, the document vault,
  and the platform and security minimum. Its delivery map is
  `docs/customers/roan-capital.md`; its open answers are §4 there.
- **Build specifications** in `docs/specs/`: the lender rules and the
  approval engine exist. The sanctions adapter, the M-Pesa port and the
  API contracts are still to write.
- **KCB and National Bank of Kenya** are current SMS customers, named
  internally only until their contracts are confirmed to allow more
  (FS-420). **Onit Bank** is named in the portfolio.

## Do this first

1. Read `README.md` (the map and the rules), then `docs/start-here.md`
   (reading order by role).
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
  against.
- **Git-ignored, and holding real material** (README, "What git does not
  see"): `clients/` (customer and prospect files, the KCB and NBK project
  list), `sources/confidential/` (including the protected-names list),
  `sources/gatekeepr/` (snapshots of the GateKeepr project's briefs,
  including its handoff and obligations register), `sources/regulation/`
  (Kenyan law texts, public but large) and `build/`. **Never commit them,
  and never copy names, ID numbers, phone numbers or internal addresses
  out of them.** Write *about* them.
- **The Onit spec in `clients/` holds internal addresses, a sample
  password and a person's name.** It must never be committed or quoted.
- Kenyan legislation is fetched from Kenya Law by navigating the browser
  pane to `{AKN expression}/source`; the file lands in Downloads as a
  `.tmp` with a GUID name. Match it by time and size, copy it to
  `sources/regulation/ke/<name>@<as-at date>.pdf`, then delete the
  download. Scripts get a 403; the browser does not.
- PDFs are read with `py` and `pypdf`, with `PYTHONIOENCODING=utf-8`.

## Current state — ask, do not read

```bash
node tools/check.js --counts       # every check, and the computed counts
node --test tools/check.test.js    # breaks each check on purpose
node tools/assemble.js             # builds build/master.md
git log --oneline -15
git status --short
```

Rows that block R1 are marked in the register:
`grep "blocks R1" REVIEW.md | grep "| OPEN |"`.

## How the owner wants you to work

- **Record before answering.** Every point raised gets a `REVIEW.md` row
  with the next FS id before you discuss it. Nothing is filtered at intake.
- **Recommend, then wait for "go".** For questions, answer with a
  recommendation and what it costs, record the proposal, and apply it when
  the owner says go (often "go with your recommendations"). A direct
  instruction is applied at once.
- **Disagree openly**, and say when your own earlier claim was wrong.
- **Compute counts; never type them.** Every figure in a document is run,
  not remembered. Typed counts have been wrong in this repository more
  than once.
- **Verify by breaking things.** A new check gets a test that makes it
  fail.
- **Say what you did not do**, in the reply, plainly.
- **Commit as you go**, with explicit paths (never `git add -A`) and the
  reasoning in the message, ending with the co-author line the session
  gives you. **Push only when the owner says "push".**
- **Roles, never names**, for people. **Customer-safe language** inside as
  well as outside: describe what a customer is working towards, never
  judge its systems.
- **Status is evidence:** Live, Built, Designed or Planned. Say "built"
  only of what is.
- **Downloads only with permission. Never sign in, or enter a password,
  on a live site.** Use the office line, +254 792 745 509, in anything
  outbound; never a personal number.

## The checks

`tools/check.js` runs, among others: names (the protected list), register
and review ids, the module template, capability rows, diagrams no wider
than 78 columns, partners, the public/internal line, copy and claims for
the portfolio, decisions, obligations (every decision from FS-490 names
what it requires in a `Requires:` line, and each item must exist),
`reviewed` (a changed file must carry a fresh
`last_reviewed`), customers (a customer's "Depends on" equals its delivery
map), regulation, assurance, references (every capability id cited
exists, or is retired and never reused), dependencies (two-way, and named
in §4 prose), and scope (the v1 cap). The pre-commit hook runs them.

**When a check fails, fix the document, not the check.** A check changes
only with a register row.

## Traps that have cost real time

- **`node -e` in Bash mangles regexes, backslashes and `${}`.** Write the
  script to the scratchpad with the Write tool and run it with node, or
  use Edit.
- **`REVIEW.md` may end without a newline.** Append by reading it,
  trimming trailing whitespace, and writing it back with the new rows and
  a final newline; a shell append once merged two rows.
- **Files are a mix of CRLF and LF.** Read with `\r\n` normalised before
  matching; git's line-ending warnings on commit are harmless.
- **Adding a capability row** can trip four checks at once: the scope cap
  if it is phase 1, references, dependencies if it names another module,
  and customers if a delivery map cites it. Run the checks after every
  edit, not at the end.
- **Subagents claim more than they did.** One sweep reported two-way
  dependencies and wrote one direction. Check their work by running the
  checks and reading a sample.
- **The portfolio layout overflows silently.** After a copy change, build
  with `node design/portfolio-pdf/build.js --html-only` and measure; some
  pages are bottom-anchored on purpose.
- **A PDF open in a viewer** makes the build write a timestamped file
  instead of replacing it.

## Waiting on the owner, outside the repository (as at 2026-10-06)

- The NPS Bill comments (`docs/outreach/nps-bill-2026-comments.md`) are
  **due 9 October**; the Bowmans letter, which asks for a review of them
  and a conflict check (they act for KCB), has not been sent.
- The Liquid and partner emails; enrolment in Microsoft Partner Center.
- Confirm that the KCB and NBK contracts allow naming them.
- Roan Capital's open answers (delivery map §4), especially its licence
  and its role list.
- Counsel's reading of two points: whether fees count inside the lender
  arrears cap (reg 29), and whether statutory deductions count inside the
  Employment Act's two-thirds limit.
- A licence decision on a virus scanner for uploads (ClamAV is GPL).

## What the last session left half-done

- The remaining R1 specs (above).
- Proposals awaiting "go" are the OPEN rows whose notes say "Proposal in
  chat"; read their notes before asking the owner again.
