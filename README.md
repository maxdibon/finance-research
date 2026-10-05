# Dibon — financial services portfolio

The consolidated documents for Dibon's financial-services offerings. There
is one portfolio overview, built from modules, and buyer packs assembled
from the same modules (FS-001).

**Status:** the portfolio is issued in two editions built from the same
Markdown: the full portfolio (DC-FS-PF-001) and a short overview
(DC-FS-PF-002), each as a PDF and a web preview (FS-333, FS-352, FS-362). Designs still go to
Markdown or a preview before they reach the PDF (FS-009).

## Where things live

```
README.md            this file
REVIEW.md            the intake register — every point raised, with an id
docs/                the work. The only place we edit
  architecture.md    who holds what: the three authorities, the custody
                     line, ledger modes, feeds, hosting
  decisions.md       what each decision cost, and what was argued against
  customers.md       customers, their stage and what each depends on
  customers/         a delivery map per customer, requirement by requirement
  partners.md        partner candidates, conversations, selection decisions
  competitors.md     who we meet, and what we learn from each
  operating-model.md the people who keep the commitments; hiring order
  delivery-plan.md   phase 1 in releases, in the order customers need them
  privacy.md         what personal data we process, why, for how long
  business-continuity.md  people, suppliers and processes when things fail
  overview.md        the portfolio story; links modules, restates nothing
  onboarding.md      what each customer and product needs to go live
  compliance.md      licences, registrations and certifications
  regulation.md      the law register: what applies and what it drives
  approval-pack.md   what customers file with their regulator about us
  assurance.md       testing for institutions we do not supply; conflicts
  bank-channel.md    banks offering SME Recon and Odoo to their SMEs
  modules/           one file per product, shared service or channel
    _template.md     copy this; keep every heading
  marketing/
    portfolio.md     every word of the portfolio PDF; the build reads it
    bank-channel-proposal.md
                     every word of the two-page bank channel proposal
  business/          market sizing (a workbook)
  outreach/          drafts to banks, operators, partners and regulators
  packs/             one manifest per buyer type (to do)
  commercials/       parked (FS-024); the one home for prices later
design/              layout, diagrams and illustrative screens; no copy
  portfolio-pdf/     build.js, page layout, document.json, claims.json
  portfolio-preview/ the per-product diagrams both editions draw
  bank-channel-proposal/
                     build.js for the two-page proposal
  brand/             the Dibon logo, and the script that extracts it
build/               generated: master.md, the portfolio PDF and web
                     previews, the bank channel proposal, the NPS Bill
                     comments — git-ignored
sources/             inputs as received — never edited
  dibon/             recon proposal, Kapu compliance one-pager
  kapu/              MFI PRD, 8 Jun 2026 meeting notes (anonymised)
  gatekeepr/         snapshots of GateKeepr briefs — git-ignored
  confidential/      client-specific documents — git-ignored
  regulation/ke/     Kenyan legislation, by "as at" date; reports/ and
                     superseded/ beside it — git-ignored
clients/             customer and prospect material, one folder each,
                     and the KCB and NBK project list — git-ignored
tools/               check.js, assemble.js, and their break tests
.githooks/           pre-commit: runs the checks
```

## Checks

```bash
git config core.hooksPath .githooks   # once per clone
node tools/check.js --counts          # every check, plus computed counts
node --test tools/check.test.js       # breaks each check on purpose
node tools/assemble.js                # builds build/master.md; refuses if a check fails
node design/portfolio-pdf/build.js    # both editions: PDFs and web previews
node design/portfolio-pdf/build.js --edition short   # one edition
node design/portfolio-pdf/build.js --html-only   # pages only, no PDF
node design/bank-channel-proposal/build.js --for "Bank"   # the two-page proposal
```

The names check reads `sources/confidential/protected-names.txt`, which is
not tracked. **Without that file the check fails rather than passing** — a
fresh clone needs the list before it can commit.

## How to work here

1. **Record before answering.** Every point raised gets a REVIEW.md id
   before it is discussed. Nothing is filtered when it is recorded.
2. **Facts live once.** A module links to another module or to
   `architecture.md` rather than restating it. Packs list modules; they do
   not copy them.
3. **Tense follows status.** Every capability is Live, Built, Designed or
   Planned, with evidence. Present tense only for Live or Built. The
   portfolio copy is the exception (FS-263); its claims are listed in
   `design/portfolio-pdf/claims.json`.
4. **No figure without a source.** Pricing appears nowhere in the modules.
5. **Roles, never names, for people.** Customers the owner has released
   are named in internal documents (Onit Bank, Roan Capital, KCB, National
   Bank of Kenya; FS-414, FS-420). Onit Bank is also named in the
   portfolio (FS-391). Roan Capital stays out of the portfolio, its design
   and outreach until it agrees (FS-401), and the names check enforces
   that; KCB and NBK stay out of them until their contracts are confirmed
   to allow it (FS-420). Nothing from `clients/` or
   `sources/confidential/` is reproduced in `docs/`. Material from those
   folders is written about, never copied.
6. **ASCII diagrams**, at most 78 characters wide (FS-064).
7. **Two ledger models, always:** the customer has a core banking system,
   or it does not (FS-065).
8. **Commit as you go**, with the reasoning in the message. Pushing is the
   owner's call.

## What git does not see, and why

`clients/`, `sources/confidential/` and `sources/gatekeepr/` are
git-ignored. They hold customers' and prospects' real material, documents
prepared for specific banks, and snapshots of another project's briefs
that name a real estate. Their authoritative copies are not here.
`sources/regulation/` is git-ignored for size: the texts are public, and
are fetched again from the links in docs/regulation.md.
