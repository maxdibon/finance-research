# Dibon — financial services portfolio

The consolidated documents for Dibon's financial-services offerings. There
is one portfolio overview, built from modules, and buyer packs assembled
from the same modules (FS-001).

**Status: in design.** Everything is Markdown. No PDF is produced until the
designs are agreed (FS-009).

## Where things live

```
README.md            this file
REVIEW.md            the intake register — every point raised, with an id
docs/                the work. The only place we edit
  architecture.md    who holds what: the three authorities, the custody
                     line, ledger modes, feeds, hosting
  decisions.md       what each decision cost, and what was argued against
  overview.md        the portfolio; links modules, restates nothing (to do)
  modules/           one file per product, shared service or channel
    _template.md     copy this; keep every heading
  packs/             one manifest per buyer type (to do)
  commercials/       parked (FS-024); the one home for prices later
design/              look and feel: tokens, HTML/CSS template (to do)
build/               generated HTML and PDF — git-ignored, never edited
sources/             inputs as received — never edited
  dibon/             recon proposal, Kapu compliance one-pager
  kapu/              MFI PRD, 8 Jun 2026 meeting notes
  gatekeepr/         snapshots of GateKeepr briefs — git-ignored
  confidential/      client-specific documents — git-ignored
clients/             real prospect and customer material — git-ignored
tools/               check.js and its break tests
.githooks/           pre-commit: runs the checks
```

## Checks

```bash
git config core.hooksPath .githooks   # once per clone
node tools/check.js --counts          # every check, plus computed counts
node --test tools/check.test.js       # breaks each check on purpose
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
   Planned, with evidence. Present tense only for Live or Built.
4. **No figure without a source.** Pricing appears nowhere in the modules.
5. **Roles, never names.** Nothing from `clients/` or
   `sources/confidential/` is reproduced in `docs/`. Material from those
   folders is written about, never copied.
6. **ASCII diagrams**, at most 78 characters wide (FS-064).
7. **Two ledger models, always:** the customer has a core banking system,
   or it does not (FS-065).
8. **Commit as you go**, with the reasoning in the message. Pushing is the
   owner's call.

## What git does not see, and why

`clients/`, `sources/confidential/` and `sources/gatekeepr/` are
git-ignored. They hold a named prospect's real material, a document
prepared for a specific bank, and snapshots of another project's briefs
that name a real estate. Their authoritative copies are not here.
