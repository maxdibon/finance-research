---
id: start-here
name: Start here — a first week in this repository
kind: guide
version: 0.1.0
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-492, FS-534, FS-537, FS-631, FS-637]
last_reviewed: 2026-10-08
---

# Start here

This page is for someone joining the team. It gives a reading order by
role and the few rules that keep the documents true. The map of folders is
in [README.md](../README.md); the map of documents is in
[overview.md](overview.md), "How to read the rest". This page restates
neither.

## What we do, in one paragraph

Dibon builds and runs software for financial institutions in Kenya:
lenders, Saccos and banks, and the SMEs they serve. The products (Kapu
MFI, Kapu Sacco, Kapu Core, Collect, the Gateway, Escrow, SME Recon) sit
on shared services (identity, access, mandates, messaging, rails,
reconciliation, financial crime, insights, platform security). Each
institution runs in its own isolated instance (architecture §9). The
institution holds its licence and its records; we hold the platform. That
line is in [architecture.md](architecture.md) §2 and §3, and most
decisions follow from it.

## Your first day

1. Read [overview.md](overview.md), then
   [architecture.md](architecture.md) §2, §3 and §6.
2. Read [delivery-plan.md](delivery-plan.md): what we build now (R1,
   Roan Capital's pilot), the v1 rule, and the definition of done.
3. Read [customers.md](customers.md) and the delivery map in
   [customers/roan-capital.md](customers/roan-capital.md).
4. Clone, set the hook and run the checks (README, "Checks"); to read in
   a browser, README "Reading the documents". Ask the
   CTIO for `sources/confidential/protected-names.txt`; without it the
   names check fails, by design.

## Then, by role

| Role | Read next | Why |
|---|---|---|
| Builder (developer, Odoo engineer) | The modules R1 touches: [mfi](modules/mfi.md), [mandates](modules/mandates.md), [identity](modules/identity.md), [core](modules/core.md), [access](modules/access.md), [platform-security](modules/platform-security.md); then the build specs in [specs/](specs/), the [journeys](journeys/README.md) and [testing.md](testing.md) | Each module's §3 is the list of capabilities, with status and phase; a spec says how one is built; a journey is what a person goes through, and each of its steps and failures is an acceptance item to test |
| DevSecOps | [platform-security](modules/platform-security.md) (recovery tiers, incident commitments), [business-continuity.md](business-continuity.md), [operating-model.md](operating-model.md) | The commitments we make to customers are kept by the rota |
| Customer experience and project management | [onboarding.md](onboarding.md), [customers.md](customers.md), [approval-pack.md](approval-pack.md) | What a customer needs to go live, and what it files with its regulator |
| Odoo implementation | [business-suite](modules/business-suite.md), [sme-recon](modules/sme-recon.md), [bank-channel.md](bank-channel.md) | SME Recon and the bank channel are R3 |
| Compliance and risk | [regulation.md](regulation.md), [compliance.md](compliance.md), [privacy.md](privacy.md), [financial-crime](modules/financial-crime.md), [assurance.md](assurance.md) | The law register, our own licences, and what the institution cannot hand to us |
| Sales and partnerships | [marketing/portfolio.md](marketing/portfolio.md), [partners.md](partners.md), [competitors.md](competitors.md) | What we say outside, and to whom |

## The rules that matter most

- **Record before answering.** Every point raised gets a row in
  [REVIEW.md](../REVIEW.md) with an FS id. Decisions that cost something
  get an entry in [decisions.md](decisions.md).
- **Status is evidence.** A capability is Live, Built, Designed or
  Planned. Say "built" only when it is.
- **Facts live once.** Link to the document that holds a fact; never copy
  it.
- **Roles, not names, for people.** Customers are named in internal
  documents only when released (README, rule 5).
- **Client material stays out of git.** It lives in `clients/` and
  `sources/confidential/`; we write about it, never copy it.
- **Counts are computed.** `node tools/check.js --counts`; never type a
  count you have not run.
- **The checks are the guard.** If a check fails, fix the document, not
  the check. A check is changed only with a register row.
- **Language is customer-safe**, inside as well as outside: describe what
  a customer is working towards, never judge its systems.
- **Nothing needs reading.** Anything a person must confirm or be told is
  also available by voice or as numbers (omni-channel, FS-637).

## Words you will meet

| Word | Meaning here |
|---|---|
| Phase 1 / v1 | Everything with phase 1 in a module's §3; capped by the v1 rule |
| R1 to R5 | The releases that deliver phase 1, in the order customers need them |
| Kapu Core | The core banking engine, on Apache Fineract and PostgreSQL |
| Mandate | A chain of approvals, or a customer's authority to debit |
| The custody line | Who holds money and records: the institution, not us |

**Ids.** Every row anywhere has an id: a prefix, a hyphen and a number.
Ids are never reused; a retired capability id is listed in its module
(FS-534).

| Prefix | Where | What it numbers |
|---|---|---|
| FS | REVIEW.md | A point raised: a question, a request, a finding ("financial services") |
| AC | modules/access.md | Access: login, roles, step-up, recovery |
| BS | modules/business-suite.md | Business suite on Odoo and Zoho |
| CO | modules/collect.md | Kapu Collect |
| CR | modules/crb.md | Credit bureau connections |
| ES | modules/escrow.md | Kapu Escrow |
| DE | modules/decisioning.md | Decisioning: appraisal, scores, risk classes |
| FC | modules/financial-crime.md | Financial crime and compliance |
| GW | modules/gateway.md | Kapu Pay Gateway |
| ID | modules/identity.md | Identity verification, and the document vault |
| IN | modules/insights.md | Insights: metrics, dashboards, questions |
| KC | modules/core.md | Kapu Core |
| MD | modules/mandates.md | Mandates: approvals and debit mandates |
| MF | modules/mfi.md | Kapu MFI |
| MS | modules/messaging.md | Messaging |
| OC | modules/omni-channel.md | Omni-channel: app, web, USSD, WhatsApp, field app |
| RL | modules/rails.md | Rails: payment and bank integrations |
| RO | modules/recon-observability.md | Reconciliation and observability |
| SC | modules/sacco.md | Kapu Sacco |
| SE | modules/platform-security.md | Platform security |
| SR | modules/sme-recon.md | SME Recon |
| CU | customers.md | A customer |
| RC | customers/roan-capital.md | One of Roan Capital's requirements, mapped to capabilities |
| LR | regulation.md | A law or regulation in the law register |
| PR | privacy.md | A processing of personal data |
| DT | documents.md | A type of document an institution keeps, with its law and retention |
| LC | compliance.md | A licence, registration or certification we hold or need |
| PT | partners.md | A partner candidate |
| SD | partners.md | A partner selection decision |
| C1 to C9 | partners.md | The criteria partners are judged against |
| CP | competitors.md | A competitor |
| OB-COM, OB-MF and others | onboarding.md | A go-live item: common to every customer (COM), or per product (its prefix) |
| DC-FS-PF | README.md | A document code: the two portfolio editions |
| R1 to R5 | delivery-plan.md | A release |
| JN | journeys/README.md | A user journey, step by step |
