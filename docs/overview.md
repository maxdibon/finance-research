---
id: overview
name: Dibon financial services — the portfolio
kind: overview
version: 0.1.0
owner: Solution architect
classification: Internal
last_reviewed: 2026-10-01
---

# Dibon financial services — the portfolio

**This page tells the story and links to everything else.** It restates
nothing. What each product does is in its module; who holds which record is
in the architecture; what is built is in each module's §3. The generated
Master (build/master.md) puts all of it in one file, with counts computed
from the sources.

## What we offer

Dibon is building the infrastructure that lets financial institutions, and
the businesses around them, take in money, lend it, hold it safely and
prove where every shilling went. What exists today, and what is still
design, is stated per capability in each module. We sell it as **an ecosystem, not a set of
separate products** (8 Jun meeting). Payments, deposits, lending, escrow and
reconciliation come together with monitoring, messaging, CRM and an ERP.
Our customers get one partner instead of five, and one account of their
money instead of five that disagree.

**Three ideas run through every product:**

1. **We hold nobody's money unless we are licensed to.** Funds sit at the
   institution, the merchant or a licensed partner. We prompt, instruct,
   match and report (docs/architecture.md §3).
2. **Every record has one home.** The funds ledger holds money, Odoo holds
   who owes what, and the recon engine holds what happened between them
   (docs/architecture.md §2).
3. **Nothing is guessed.** An unmatched payment stays visible until
   evidence places it. A capability we have not built is not described as
   though we had.

## Who it is for

Banks, deposit-taking and credit-only Saccos, MFIs, international money
transfer operators, PSPs, fintechs and SMEs. We start with the smaller
institutions, to build the product and the brand (FS-029). For unlicensed
deposit-taking and funds-holding operators, we are the route into a
regulated framework, through a partner bank (FS-045).

Kenya comes first. The plan is to follow Liquid's Azure Stack footprint
into Uganda, Tanzania, Rwanda, Zambia, Zimbabwe and Nigeria (FS-105). Each
country brings its own licence, data rules and partners (FS-109;
docs/partners.md).

Dibon is the first customer of its own products: the Gateway carries our
own payments first, and insights runs on our own data first (FS-033).

## The modules

**Products**

- [Kapu Collect](modules/collect.md) — deposits collected by third
  parties, held at the institution
- [Kapu Pay Gateway](modules/gateway.md) — one API and one reconciliation
  for every rail a merchant takes
- [Kapu Escrow](modules/escrow.md) — funds held at a bank until the agreed
  conditions are met
- [Kapu MFI](modules/mfi.md) — loan management for informal lenders
- Kapu Sacco — deposit-taking and credit-only Saccos *(module to write)*
- [SME Recon](modules/sme-recon.md) — reconciliation inside the SME's own ERP

**Shared services**

- [Recon & Observability](modules/recon-observability.md) — the matching
  engine, the exception queue, and the monitoring of everything that moves
  money
- [Mandates](modules/mandates.md) — signing and debit mandates, one engine
- CRB, identity, notifications, rails, insights *(modules to
  write)*

**Channels**

- Omni-channel banking: mobile apps, internet banking, USSD *(module to
  write)*

## How to read the rest

| If you want | Read |
|---|---|
| Who holds which record, and where the licence line is | [architecture.md](architecture.md) |
| What a product does, and what is built | its module, §3 |
| Why something was decided, and what it cost | [decisions.md](decisions.md) |
| Which partners we are talking to | [partners.md](partners.md) |
| Everything still open | [REVIEW.md](../REVIEW.md) |

Packs for each buyer type will sit in packs/ and will list modules rather
than copy them.
