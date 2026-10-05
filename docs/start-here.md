---
id: start-here
name: Start here — a first week in this repository
kind: guide
version: 0.1.0
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-492]
last_reviewed: 2026-10-06
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
4. Clone, set the hook and run the checks (README, "Checks"). Ask the
   CTIO for `sources/confidential/protected-names.txt`; without it the
   names check fails, by design.

## Then, by role

| Role | Read next | Why |
|---|---|---|
| Builder (developer, Odoo engineer) | The modules R1 touches: [mfi](modules/mfi.md), [mandates](modules/mandates.md), [identity](modules/identity.md), [core](modules/core.md), [access](modules/access.md), [platform-security](modules/platform-security.md); then the build specs in [specs/](specs/) | Each module's §3 is the list of capabilities, with status and phase; a spec says how one is built |
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

## Words you will meet

| Word | Meaning here |
|---|---|
| Phase 1 / v1 | Everything with phase 1 in a module's §3; capped by the v1 rule |
| R1 to R5 | The releases that deliver phase 1, in the order customers need them |
| Kapu Core | The core banking engine, on Apache Fineract and PostgreSQL |
| Mandate | A chain of approvals, or a customer's authority to debit |
| The custody line | Who holds money and records: the institution, not us |
| FS-nnn | A row in the intake register, REVIEW.md |
| LR, PR, CP, PT, CU, RC | Rows in the law, privacy, competitor, partner, customer and Roan Capital registers |
