---
id: overview
name: Dibon financial services — the portfolio
kind: overview
status: living
owner: Solution architect
classification: Internal
review_ids: [FS-572, FS-627, FS-631, FS-633, FS-639, FS-641, FS-647, FS-660, FS-714, FS-719, FS-720, FS-744, FS-745, FS-753, FS-771, FS-806]
last_reviewed: 2026-10-15
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

**Six ideas run through every product:**

1. **We hold nobody's money unless we are licensed to.** Funds sit at the
   institution, the merchant or a licensed partner. We prompt, instruct,
   match and report (docs/architecture/README.md §3).
2. **Every record has one home.** The funds ledger holds money and loans:
   accounts, balances and loan schedules. Odoo holds the parties and the
   obligations outside the ledger: invoices, fees and charges. The recon
   engine holds what happened between them (docs/architecture/README.md §2).
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
5. **Dibon never moves an institution's money, and whoever acts is proven
   at the act.** No Dibon role, break-glass included, may initiate,
   approve or release an institution's payment; anything that moves money,
   approves or reveals a person asks who is acting at that moment, not
   only at login (docs/architecture/README.md §3, §7; FS-588).
6. **Delightful to use.** The right thing is the easy thing: what a person
   must do is obvious, fast and forgiving; what we cannot make obvious we
   teach (docs/experience.md; FS-660).

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

**Where we are:** R1 is Roan Capital's pilot on Kapu MFI. What it
includes, release by release, is in [the delivery plan](delivery-plan.md);
how each R1 component is built or run is in [the specs](specs/README.md);
what each person goes through is in [the journeys](journeys/README.md).

## The modules

**Products**

- [Kapu Collect](modules/collect.md) — deposits collected by third
  parties, held at the institution
- [Kapu Pay Gateway](modules/gateway.md) — one API and one reconciliation
  for every rail a merchant takes
- [Kapu Escrow](modules/escrow.md) — funds held at a bank until the agreed
  conditions are met
- [Kapu Core](modules/core.md) — hosted core banking on Apache Fineract
- [Kapu MFI](modules/mfi.md) — loan management for non-deposit-taking
  lenders, licensed or registered with CBK or applying
- [Kapu Sacco](modules/sacco.md) — deposit-taking and credit-only Saccos
- [SME Recon](modules/sme-recon.md) — reconciliation inside the SME's own ERP
- [Business Suite, on Odoo and Zoho](modules/business-suite.md) — CRM,
  helpdesk, accounting, HR and payroll, signing and portal

**Shared services**

- [Recon & Observability](modules/recon-observability.md) — the matching
  engine, the exception queue, and the monitoring of everything that moves
  money
- [Mandates](modules/mandates.md) — signing and debit mandates, one engine
- [Messaging](modules/messaging.md) — SMS, WhatsApp, Telegram and app; transactional and campaigns
- [CRB](modules/crb.md) — submissions to, and lookups from, every licensed bureau
- [Access](modules/access.md) — login, roles and step-up, on Keycloak
- [Identity verification](modules/identity.md) — who a person or business really is
- [Rails](modules/rails.md) — every payment-rail and bank connection, behind one interface
- [Insights](modules/insights.md) — governed metrics, dashboards and natural-language questions
- [Platform Security](modules/platform-security.md) — the security
  baseline every product runs on, from the perimeter to staff laptops
- [Financial Crime and Compliance](modules/financial-crime.md) — fraud
  scoring, screening, cases and the reports institutions file
- [Decisioning](modules/decisioning.md) — appraisal, behaviour scores and
  risk classes, rules first

**Channels**

- [Omni-channel](modules/omni-channel.md) — mobile apps, internet banking,
  USSD, and the field-officer app

## How to read the rest

**Start**

| If you want | Read |
|---|---|
| Where to start, if you are new | [start-here.md](start-here.md) |
| What changed, release by release, and each document's status | [the changelog](../CHANGELOG.md); in the reader, "Documents by status" and "Unreleased" |
| What changed, for readers outside Dibon | [the release notes](marketing/release-notes.md) |
| What a product does, and what is built | its module, §3 |

**Design and build**

| If you want | Read |
|---|---|
| Who holds which record, and where the licence line is | [architecture.md](architecture/README.md) |
| Why something was decided, and what it cost | [decisions.md](decisions.md) |
| How each component is built or run, and how they connect | [specs/](specs/README.md) |
| What a person goes through, step by step, and the gaps it shows | [journeys/](journeys/README.md) |
| How it should feel to use, and how we make it intuitive | [experience.md](experience.md) |
| How a capability is proven Built: acceptance items, tagged tests, user acceptance | [testing.md](testing.md) |

**Customers and delivery**

| If you want | Read |
|---|---|
| Who our customers are, and what we are building for each | [customers.md](customers.md), with each customer's delivery map linked from its row |
| Every document we hold with a party: received, sent or worked on, by DR id | [document-register.md](document-register.md) |
| What we build next, release by release | [delivery-plan.md](delivery-plan.md) |
| What a customer and each product need to go live | [onboarding.md](onboarding.md) |
| Which partners we are talking to | [partners.md](partners.md) |
| Which competitors we meet, and what we learn from each | [competitors.md](competitors.md) |
| Who keeps our commitments, and whom we hire next | [operating-model.md](operating-model.md) |

**Running the service**

| If you want | Read |
|---|---|
| How we run it: incidents, changes, problems, service levels, the configuration record, the tools | [service-management/](service-management/README.md) |
| What an institution does on the platform, who does it and when: the handbook template | [handbook/](handbook/README.md) |
| Each institution's products, as product version documents, drafts included | [products/](products/README.md) |
| How people learn it: manuals and training, by role | [training/](training/README.md) |
| How our printed documents look: tokens, components, templates and a little whimsy | [design-system.md](design-system.md) |
| How the service and the company keep going when something fails | [business-continuity.md](business-continuity.md) |

**Law and assurance**

| If you want | Read |
|---|---|
| Which laws apply to us and our customers, and what each drives | [regulation.md](regulation.md) |
| Which licences, registrations and certifications we hold or need | [compliance.md](compliance.md) |
| What personal data we process, why and for how long | [privacy.md](privacy.md) |
| What we hold ourselves, our customers and our partners to | [rules.md](rules.md) |
| What we need counsel to answer, and what each answer changes | [legal-questions.md](legal-questions.md) |
| Which documents an institution keeps, under which law, for how long | [documents.md](documents.md) |
| What a customer files with its regulator about us | [approval-pack.md](approval-pack.md) |
| Testing we offer institutions we do not supply, and its conflict register | [assurance.md](assurance.md) |

**Material for outside**

| If you want | Read |
|---|---|
| Every word of the portfolio PDF | [marketing/portfolio.md](marketing/portfolio.md) |
| Every word of the two-page bank channel proposal | [marketing/bank-channel-proposal.md](marketing/bank-channel-proposal.md) |
| How banks can offer SME Recon and the business suite to their customers | [bank-channel.md](bank-channel.md) |
| Drafts to partners, operators and regulators | [outreach](outreach/README.md) |
| How big each market segment is | business/market-sizing.xlsx |

**The register and the reader**

| If you want | Read |
|---|---|
| Everything still open | [REVIEW.md](../REVIEW.md) |
| All of it as linked pages, every id a link | build/site/index.html, rebuilt on every commit (FS-567); to build it yourself, README "Reading the documents" (FS-631) |

Packs for each buyer type will sit in packs/ and will list modules rather
than copy them.
