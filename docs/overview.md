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

**Four ideas run through every product:**

1. **We hold nobody's money unless we are licensed to.** Funds sit at the
   institution, the merchant or a licensed partner. We prompt, instruct,
   match and report (docs/architecture.md §3).
2. **Every record has one home.** The funds ledger holds money and loans:
   accounts, balances and loan schedules. Odoo holds the parties and the
   obligations outside the ledger: invoices, fees and charges. The recon
   engine holds what happened between them (docs/architecture.md §2).
3. **Nothing is guessed.** An unmatched payment stays visible until
   evidence places it. In these documents, a capability we have not built
   is not described as though we had. The customer-facing portfolio is the
   one exception: it presents each product as a working v1 (FS-263), and
   every integration it claims on that basis is listed in
   design/portfolio-pdf/claims.json.
4. **Compliance built in, not bolted on.** What our customers answer to,
   the lender rules, sanctions screening, data protection, records, is a
   capability in the product, checked like any other, not a report added
   later (financial-crime; mfi MF-21 to MF-29; docs/regulation.md; FS-484).

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
from February 2025 to June 2026 (FS-390), on M-Pesa. Since 2021 we have
supplied KCB and National Bank of Kenya. For KCB: a CRM, the SMS gateway,
work on its loan engine, and the USSD platform that carried its digital
lending from 2022 to 2025. For NBK: the SMS gateway and its operator
connections. Much of it is ongoing, with new integration work for KCB and
shortcodes and USSD for NBK in 2026 (FS-416, FS-419, FS-443). We are in
discussion with new partner banks (docs/partners.md). Roan Capital is in delivery on
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
- [Kapu MFI](modules/mfi.md) — loan management for non-deposit-taking
  lenders, licensed or registered with CBK or applying
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
- [Platform Security](modules/platform-security.md) — the security baseline every product runs on, from the perimeter to the database and to staff laptops and field phones
- [Financial Crime and Compliance](modules/financial-crime.md) — fraud scoring, sanctions and PEP screening, cases, and the reports institutions file

**Channels**

- [Omni-channel](modules/omni-channel.md) — mobile apps, internet banking,
  USSD, and the field-officer app

## How to read the rest

| If you want | Read |
|---|---|
| Who holds which record, and where the licence line is | [architecture.md](architecture.md) |
| What a product does, and what is built | its module, §3 |
| Why something was decided, and what it cost | [decisions.md](decisions.md) |
| Who our customers are, and what we are building for each | [customers.md](customers.md) |
| Which partners we are talking to | [partners.md](partners.md) |
| Which competitors we meet, and what we learn from each | [competitors.md](competitors.md) |
| Who keeps our commitments, and whom we hire next | [operating-model.md](operating-model.md) |
| What we build next, release by release | [delivery-plan.md](delivery-plan.md) |
| What personal data we process, why and for how long | [privacy.md](privacy.md) |
| How the service and the company keep going when something fails | [business-continuity.md](business-continuity.md) |
| Which licences, registrations and certifications we hold or need | [compliance.md](compliance.md) |
| Which laws apply to us and our customers, and what each drives | [regulation.md](regulation.md) |
| What a customer files with its regulator about us | [approval-pack.md](approval-pack.md) |
| Testing we offer institutions we do not supply, and its conflict register | [assurance.md](assurance.md) |
| How banks can offer SME Recon and the business suite to their customers | [bank-channel.md](bank-channel.md) |
| What a customer and each product need to go live | [onboarding.md](onboarding.md) |
| Every word of the portfolio PDF | [marketing/portfolio.md](marketing/portfolio.md) |
| Every word of the two-page bank channel proposal | [marketing/bank-channel-proposal.md](marketing/bank-channel-proposal.md) |
| How big each market segment is | business/market-sizing.xlsx |
| Drafts to partners, operators and regulators | outreach/ |
| Everything still open | [REVIEW.md](../REVIEW.md) |

Packs for each buyer type will sit in packs/ and will list modules rather
than copy them.
