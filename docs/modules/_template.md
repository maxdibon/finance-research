---
# ── Module front matter ────────────────────────────────────────────────
# Every field is required. Packs and the overview read these; they do not
# restate the module's prose.
id: example-module            # kebab-case, matches the file name
name: Example Module          # as it appears in the portfolio
kind: product                 # product | shared-service | channel
version: 0.1.0                # SemVer: patch = wording, minor = capability, major = restructure
owner: Product lead           # a role, never a person's name
classification: Internal      # Public | Internal | Confidential
audience: [bank, sacco, mfi, psp, imt, sme, fintech]   # who a pack may include this for
depends_on: []                # module ids this needs (shared services, rails)
consumed_by: []               # module ids that use this
review_ids: []                # REVIEW.md ids that bear on this module
last_reviewed: 2026-10-06
---

<!--
HOW TO USE THIS TEMPLATE

Copy to docs/modules/<id>.md. Keep every heading, in this order. A section
with nothing to say yet says so in one line ("None known.") rather than
being deleted — a missing heading reads as an oversight, a stated "none"
reads as a decision.

Writing rules (from REVIEW.md FS-050, FS-014, FS-015, and the GateKeepr
standards carried over):

1. Tense follows status. Present tense only for Live or Built. Designed is
   "is designed to"; Planned is "will". Never a live-sounding sentence about
   an unbuilt capability.
2. No figure without a source. A number names where it came from. Pricing
   does not appear in modules at all — commercials will live in one place
   (FS-024).
3. Roles, never names. No client names from confidential source material;
   write "a tier-2 bank", not the bank.
4. Facts live once. If another module or architecture.md owns a fact, link
   it — do not restate it. The division of labour between Odoo, the funds
   ledger and the recon engine is owned by docs/architecture.md (FS-025).
5. Section references name their document: "MFI PRD FR-6", not "FR-6".
6. Open questions are REVIEW.md ids, not restated prose.
-->

# Example Module

## 1 · In one paragraph

What it is, for whom, and the one problem it removes. Three to five
sentences. The overview links to this paragraph; write it so it stands
alone.

## 2 · Who it is for

**Segments:** which tiers and institution types, and why them first.

**The problem, concretely:** the manual process it replaces, in the
customer's terms. Use discovery evidence where it exists and say where it
came from.

**People who use it:**

| Role | What they need from it |
|---|---|
| | |

## 3 · What it does

One row per capability. **Status is not optional and needs evidence.**

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| EX-01 | | Live / Built / Designed / Planned | Where the status comes from | 1 / 2 / later |

Status definitions:

- **Live** — running in production for at least one customer.
- **Built** — code complete and tested; not yet in production.
- **Designed** — a specification exists; cite it.
- **Planned** — intended, no specification yet.

## 4 · Where it sits

**Depends on:** shared services and rails, by module id.
**Used by:** modules that consume it.

**Who holds which record** — the part of docs/architecture.md that applies
here. One row per record this module touches.

| Record | System of record | This module |
|---|---|---|
| Funds and balances | Bank core / Fineract | reads / posts via / never holds |
| Parties, obligations, tickets, documents | Odoo | |
| Matches and exceptions | Recon engine | |

**What this module never stores:** stated explicitly.

**Under each ledger mode** (docs/architecture.md §4). Every module states
how it behaves when the customer has a core banking system and when it does
not (FS-065). If a mode does not apply, say why in one line.

| | Integrated — customer has a core | Native — no core; Fineract is the ledger |
|---|---|---|
| Where funds are posted | | |
| What differs in this module | | |
| What the customer must provide | | |

## 5 · How it works

Components and the main flows. **Diagrams are ASCII** inside a fenced
block, so they read in any editor, diff line by line and need no renderer
(FS-064). Keep them under 100 characters wide (FS-579). Final artwork is a later step.

```
  +--------+      +-------------+      +------------------+
  | Source | ---> | This module | ---> | System of record |
  +--------+      +-------------+      +------------------+
```

For a sequence, one participant per column, time running down:

```
  Partner        Kapu API         Core
     |  request     |               |
     |------------->|  validate     |
     |              |-------------->|
     |  accepted    |               |
     |<-------------|               |
```

Draw each ledger mode from §4 separately where the flows differ.

## 6 · Rails and integrations

Never written as though there is one rail.

| Rail / system | Direction | Feed | Status |
|---|---|---|---|
| e.g. M-Pesa | in / out | real-time callback / statement file / API pull | Live / Built / Designed / Planned |

## 7 · Regulatory position

- **Custody:** do funds ever rest under our control? If yes, under whose
  licence.
- **Licence relied on:** the partner institution's, the customer's own, or
  ours once the PSP licence is held (FS-031).
- **Regulators:** CBK, SASRA, ODPC, others as applicable.
- **Data:** which classes this module stores (Public / Internal /
  Confidential / Restricted), and where.
- **Open legal checks:** REVIEW.md ids.

## 8 · Controls

- **Attribution:** which acts are authenticated at the moment of the act
  (anything that moves money, binds somebody, or reveals a person).
- **Mandates:** which actions run through the mandate engine, and the
  default chain.
- **Audit:** what is recorded, and that nothing is rewritten.
- **Exceptions:** what happens when it cannot verify — it says so and
  queues it, it does not guess.

## 9 · Deployment

On-prem or Liquid Azure Stack (FS-032). Anything that would leave that
boundary is named here, with its data class.

## 10 · What it does not do

Out of scope, deliberately excluded, and not yet built. Plainly.

## 11 · Open questions

REVIEW.md ids only.

## 12 · Sources

Documents this module was derived from, with their date. Confidential
sources are marked *derived, not reproduced*.
