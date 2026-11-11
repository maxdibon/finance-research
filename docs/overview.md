---
id: overview
name: Overview — what we offer, and where everything is
kind: overview
status: living
released: 2026.10.16
owner: Solution architect
classification: Internal
review_ids: [FS-572, FS-627, FS-631, FS-633, FS-639, FS-641, FS-647, FS-660, FS-714, FS-719, FS-720, FS-744, FS-745, FS-753, FS-771, FS-806, FS-960, FS-962, FS-973, FS-1006, FS-1012, FS-1021, FS-1032, FS-1037, FS-1047, FS-1045, FS-1050, FS-1053, FS-1074, FS-1076, FS-1079, FS-1087, FS-1097, FS-1171]
last_reviewed: 2026-11-11
---

# Overview — what we offer, and where everything is

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
   later (financial-crime; mfi MF-21 to MF-29; docs/governance/regulation.md; FS-484).
5. **Dibon never moves an institution's money, and whoever acts is proven
   at the act.** No Dibon role, break-glass included, may initiate,
   approve or release an institution's payment; anything that moves money,
   approves or reveals a person asks who is acting at that moment, not
   only at login (docs/architecture/README.md §3, §7; FS-588).
6. **Delightful to use.** The right thing is the easy thing: what a person
   must do is obvious, fast and forgiving; what we cannot make obvious we
   teach (docs/company/experience.md; FS-660).

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
partners (FS-109; docs/market/partners.md; docs/governance/compliance.md).

Collect and the Gateway ran in production at Onit Bank, with W-Harambee,
from February 2025 to June 2026 (FS-390), on M-Pesa. Since 2021 we have
supplied KCB and National Bank of Kenya. For KCB: a CRM, the SMS gateway,
work on its loan engine, and the USSD platform that carried its digital
lending from 2022 to 2025. For NBK: the SMS gateway and its operator
connections. Much of it is ongoing, with new integration work for KCB and
shortcodes and USSD for NBK in 2026 (FS-416, FS-419, FS-443). We are in
discussion with new partner banks (docs/market/partners.md). Roan Capital is in delivery on
Kapu MFI (docs/customers.md).

Dibon is the first customer of its own products: the Gateway carries our
own payments first, and insights runs on our own data first (FS-033).

**Where we are:** R1 is Roan Capital's pilot on Kapu MFI. What it
includes, release by release, is in [the delivery plan](delivery/delivery-plan.md);
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
- [Kapu Treasury](modules/treasury.md) — an institution's own money:
  positions, forecast, float, funding and investments; liquidity ratios
  and currencies where it needs them
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
| What an id means, where its row lives, and how the next is taken | [ids.md](ids.md) |
| What every field of a money movement means, once, for every component | [transaction-fields.md](transaction-fields.md) |

**Products and the market**

| If you want | Read |
|---|---|
| Each institution's products, as product version documents, drafts included; the kinds of loan we can describe; briefs on products hard to do alone | [products/](products/README.md), with [loan-kinds.md](products/loan-kinds.md) and [the briefs](products/briefs/README.md) |
| What eighteen of Kenya's institutions sell, from tier 1 banks to Saccos and digital lenders, against what we support | [product-landscape.md](market/product-landscape.md) |
| Every app and channel, who uses it, and one way in for people with several roles | [channels.md](market/channels.md) |
| Which competitors we meet, and what we learn from each | [competitors.md](market/competitors.md) |
| Which partners we are talking to | [partners.md](market/partners.md) |

**Design and build**

| If you want | Read |
|---|---|
| Who holds which record, and where the licence line is | [architecture.md](architecture/README.md) |
| Why something was decided, and what it cost | [decisions.md](decisions.md) |
| How each component is built or run, and how they connect | [specs/](specs/README.md) |
| What a person goes through, step by step, and the gaps it shows | [journeys/](journeys/README.md) |
| How it should feel to use, and how we make it intuitive | [experience.md](company/experience.md) |
| How a capability is proven Built: acceptance items, tagged tests, user acceptance | [testing.md](delivery/testing.md) |
| Reviews: OLP as it stands (26 October 2026), what we need from it being the [OLP spec](specs/olp.md); the architecture, its databases and namespaces counted (27 October); the specs against their template (29 October) | [reviews/olp-2026-10-26.md](reviews/olp-2026-10-26.md); [reviews/architecture-2026-10-27.md](reviews/architecture-2026-10-27.md); [reviews/specs-2026-10-29.md](reviews/specs-2026-10-29.md) |

**Customers and delivery**

| If you want | Read |
|---|---|
| Who our customers are, and what we are building for each | [customers.md](customers.md), with each customer's delivery map linked from its row |
| What we build next, release by release | [delivery-plan.md](delivery/delivery-plan.md) |
| The MVP day, 6 November 2026: the goal, the plan and who does what | [mvp-day.md](delivery/mvp-day.md) |
| Prembly in production, week of 2 November 2026: what we test, with whose details, and how Smile ID compares | [prembly-production-test.md](delivery/prembly-production-test.md) |
| What a customer and each product need to go live | [onboarding.md](delivery/onboarding.md) |
| Starter templates for onboarding a business or a partner, and where every document is kept and seen | [templates/onboarding-pack.md](templates/onboarding-pack.md) |
| The CBK licence pack: what a lender submits with its licence application, and the template for each | [templates/cbk-licence-pack.md](templates/cbk-licence-pack.md) |
| The ICT policy template, with the system description, the two diagrams and the plan for assurance | [templates/ict-policy.md](templates/ict-policy.md) |
| The data protection policy template | [templates/data-protection-policy.md](templates/data-protection-policy.md) |
| The credit, code of ethics and market conduct policy template | [templates/credit-conduct-policy.md](templates/credit-conduct-policy.md) |
| The statements on the Consumer Protection Act and the Competition Act | [templates/compliance-statements.md](templates/compliance-statements.md) |
| The delivery channels described, for the application and CBK's notice | [templates/delivery-channels.md](templates/delivery-channels.md) |
| The submission index: what goes now, and what follows with the application | [templates/submission-index.md](templates/submission-index.md) |
| Every document we hold with a party: received, sent or worked on, by DR id; our numbered documents and who received them | [document-register.md](governance/document-register.md) |
| What an institution does on the platform, who does it and when: the handbook template | [handbook/](handbook/README.md) |
| How people learn it: manuals and training, by role | [training/](training/README.md) |
| Who keeps our commitments, and whom we hire next | [operating-model.md](company/operating-model.md) |

**Running the service**

| If you want | Read |
|---|---|
| How we run it: incidents, changes, problems, service levels, the configuration record, the tools | [service-management/](service-management/README.md) |
| Every deployment, what runs in each, its continuity and its exit | [deployments/README.md](deployments/README.md) |
| Each component's settings: the baseline every deployment follows, mandatory, default or its own | [settings/README.md](settings/README.md) |
| The steps for what goes wrong, and for what we do rarely | [runbooks/README.md](runbooks/README.md) |
| How the service and the company keep going when something fails | [business-continuity.md](governance/business-continuity.md) |

**Law and assurance**

| If you want | Read |
|---|---|
| Which laws apply to us and our customers, and what each drives | [regulation.md](governance/regulation.md) |
| What each law we cite says, provision by provision: citation, regulator, what it requires | [law/](law/README.md) |
| Which licences, registrations and certifications we hold or need | [compliance.md](governance/compliance.md) |
| What personal data we process, why and for how long | [privacy.md](governance/privacy.md) |
| What we hold ourselves, our customers and our partners to | [rules.md](governance/rules.md) |
| What we need counsel to answer, and what each answer changes | [legal-questions.md](governance/legal-questions.md) |
| Which documents an institution keeps, under which law, for how long | [documents.md](governance/documents.md) |
| What a customer files with its regulator about us | [approval-pack.md](governance/approval-pack.md) |
| Testing we offer institutions we do not supply, and its conflict register | [assurance.md](market/assurance.md) |

**Material for outside**

| If you want | Read |
|---|---|
| Every word of the portfolio PDF | [marketing/portfolio.md](marketing/portfolio.md) |
| Every word of the two-page bank channel proposal | [marketing/bank-channel-proposal.md](marketing/bank-channel-proposal.md) |
| How banks can offer SME Recon and the business suite to their customers | [bank-channel.md](market/bank-channel.md) |
| Drafts to partners, operators and regulators | [outreach](outreach/README.md) |
| How our documents look: tokens, components, templates, numbers and a little whimsy | [design-system.md](company/design-system.md) |
| How big each market segment is | business/market-sizing.xlsx |

**The register and the reader**

| If you want | Read |
|---|---|
| Everything still open, and what waits on a decision | [REVIEW.md](../REVIEW.md); in the reader, the Review page leads with what waits on the owner |
| All of it as linked pages, every id a link | build/site/index.html, rebuilt on every commit (FS-567); to build it yourself, README "Reading the documents" (FS-631) |
