---
id: overview
name: Dibon financial services — the portfolio
kind: overview
version: 0.2.0
owner: Solution architect
classification: Internal
last_reviewed: 2026-10-05
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
   evidence places it. In these documents, a capability we have not built
   is not described as though we had. The customer-facing portfolio is the
   one exception: it presents each product as a working v1 (FS-263), and
   every integration it claims on that basis is listed in
   design/portfolio-pdf/claims.json.

## Who it is for

Banks, deposit-taking and credit-only Saccos, MFIs, international money
transfer operators, PSPs, fintechs and SMEs. We start with the smaller
institutions, to build the product and the brand (FS-029); our work for
tier-1 banks shows the experience behind it (FS-419). For unlicensed
deposit-taking and funds-holding operators, we are the route into a
regulated framework, through a partner bank (FS-045). We stay a platform
for licensed institutions; Dibon does not become a bank (FS-379).

Kenya is our home market. Uganda, Tanzania, Rwanda, Zambia, Zimbabwe and
Nigeria are ready markets, following Liquid's Azure Stack footprint
(FS-105, FS-371). Each country brings its own licence, data rules and
partners (FS-109; docs/partners.md; docs/compliance.md).

Collect and the Gateway ran in production at Onit Bank, with W-Harambee,
from February 2025 to June 2026 (FS-390), on M-Pesa. Before that, our USSD
platform carried KCB's digital lending from 2022 to 2025, and we supply
KCB and National Bank of Kenya with Meliora's SMS platform today
(FS-416, FS-419). We are in discussion
with new partner banks (docs/partners.md). Roan Capital is in delivery on
Kapu MFI (docs/customers.md).

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
- [Kapu Core](modules/core.md) — a hosted core banking system on Apache Fineract, for institutions ready for a modern core
- [Kapu MFI](modules/mfi.md) — loan management for informal lenders
- [Kapu Sacco](modules/sacco.md) — deposit-taking and credit-only Saccos
- [SME Recon](modules/sme-recon.md) — reconciliation inside the SME's own ERP
- [Business Suite, on Odoo and Zoho](modules/business-suite.md) — CRM, helpdesk, accounting, HR and payroll, Sign and portal, implemented by Dibon as an Odoo and Zoho partner

**Shared services**

- [Recon & Observability](modules/recon-observability.md) — the matching
  engine, the exception queue, and the monitoring of everything that moves
  money
- [Mandates](modules/mandates.md) — signing and debit mandates, one engine
- [Messaging](modules/messaging.md) — SMS, WhatsApp, Telegram and app; transactional and campaigns
- [CRB](modules/crb.md) — submissions to, and lookups from, every licensed bureau
- [Access](modules/access.md) — login, roles and step-up, on Keycloak
- [Identity](modules/identity.md) — verifying who a person or business is
- [Rails](modules/rails.md) — every payment-rail and bank connection, behind one interface
- [Insights](modules/insights.md) — governed metrics, dashboards and natural-language questions
- [Financial Crime and Compliance](modules/financial-crime.md) — fraud scoring, sanctions and PEP screening, cases, and the reports institutions file

**Channels**

- [Omni-channel](modules/omni-channel.md) — mobile apps, internet banking and USSD

## How to read the rest

| If you want | Read |
|---|---|
| Who holds which record, and where the licence line is | [architecture.md](architecture.md) |
| What a product does, and what is built | its module, §3 |
| Why something was decided, and what it cost | [decisions.md](decisions.md) |
| Who our customers are, and what we are building for each | [customers.md](customers.md) |
| Which partners we are talking to | [partners.md](partners.md) |
| Which licences, registrations and certifications we hold or need | [compliance.md](compliance.md) |
| Which laws apply to us and our customers, and what each drives | [regulation.md](regulation.md) |
| What a customer and each product need to go live | [onboarding.md](onboarding.md) |
| Every word of the portfolio PDF | [marketing/portfolio.md](marketing/portfolio.md) |
| How big each market segment is | business/market-sizing.xlsx |
| Drafts to partners, operators and regulators | outreach/ |
| Everything still open | [REVIEW.md](../REVIEW.md) |

Packs for each buyer type will sit in packs/ and will list modules rather
than copy them.
