---
id: mfi
name: Kapu MFI
kind: product
version: 0.1.0
owner: Product lead, Kapu
classification: Internal
audience: [mfi]
depends_on: [mandates, identity, rails, messaging, recon-observability, crb, financial-crime]
consumed_by: [omni-channel, insights]
review_ids: [FS-019, FS-020, FS-045, FS-088, FS-136, FS-137, FS-138, FS-139, FS-140, FS-141, FS-320, FS-354, FS-388, FS-400, FS-407, FS-423, FS-431, FS-435, FS-447, FS-453]
last_reviewed: 2026-10-05
---

# Kapu MFI

## 1 · In one paragraph

Kapu MFI is loan management for small non-deposit-taking lenders —
licensed or registered with CBK, or applying — moving their book off
spreadsheets, paper or an earlier Mifos installation. It is designed to
cover the whole loan, from origination to closure or restructure: a
digital application, KYC with a completeness gate, collateral with
verification evidence, vetting with flagged overrides, an approval chain,
disbursement and repayment by mobile money or bank, and income split by
component without manual work. It will also carry the rules the CBK
lender regulations 2026 set for these lenders (MF-21 to MF-29). Fineract
is designed to be the system of record, so there is no external core to
reconcile against; the MFI PRD calls this architecturally the simplest of
the Kapu products. The PRD is a full specification, so most capabilities
are **Designed**. Nothing is shown built.

## 2 · Who it is for

**Segments:** non-deposit-taking lenders with 2–15 staff, usually
owner-led, lending individually to SMEs and salaried borrowers, licensed
or registered with CBK or applying under the lender regulations 2026
(law register LR-03; existing lenders apply by about 29 Mar 2027).
Secured products dominate, with logbook loans as the anchor. Operations
are cashless (MFI PRD §3.1). Credit-only institutions manage their own
CBK relationship (FS-045); Kapu MFI is built to the rules that licence
brings (MF-21 to MF-29; FS-423, FS-435).

**The problem, concretely** (MFI PRD §2, from discovery with a three-person
logbook lender):

1. Repayments are not split into principal, interest, fees and insurance;
   the accountant does it by hand.
2. Repeat borrowers are approved above their assessed limit with no flag
   and no recorded approver.
3. Rollovers and penalties are recorded ad hoc, with no link between a loan
   and its successor.
4. Repayment reminders are phone calls, or nothing.
5. KYC is paper, with no completeness check.
6. Approvals happen in conversation, with no record.

**People who use it** (MFI PRD §3.2): the CEO or owner (final approver,
portfolio owner), the accountant (mid-chain approver, income reporting,
reconciliation), the loan officer (origination, KYC, vetting) and the
borrower (SMS reminders, payment prompts, disbursements; no app at launch).

Success criteria for the first customer are in MFI PRD §8. Roan Capital
is in delivery on Kapu MFI; its requirements are mapped to these
capabilities in docs/customers/roan-capital.md (CU-01).

## 3 · What it does

**Evidence:** the MFI PRD, Draft v0.2, Jun 2026. Its FR numbers are cited
rather than restated. The PRD calls the M-Pesa, Airtel Money, PesaLink and
national register integrations "existing". M-Pesa has since run in
production at Onit Bank (rails RL-03, FS-390). For Airtel Money, PesaLink
and the register (NPDM, formerly IPRS), other sources dispute it — FS-088,
FS-393.

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| MF-01 | Digital loan application with drafts and a timestamped, attributed lifecycle from Draft to Closed, Restructured or Written Off | Designed | MFI PRD FR-1 | 1 |
| MF-02 | Borrower KYC: national register lookup (NPDM, formerly IPRS), a document checklist per product, and a completeness gate that cannot be overridden | Designed | MFI PRD FR-2 | 1 |
| MF-03 | Generic collateral model, with vehicle as the first type: coverage ratios, custody log, recovery and forced sale, release on settlement | Designed | MFI PRD FR-3 | 1 |
| MF-04 | Collateral verification done manually, with an immutable evidence record; a failed check blocks acceptance unless the override authority justifies it | Designed | MFI PRD FR-4.1 to FR-4.4 | 1 |
| MF-05 | Programmatic NTSA verification as a drop-in replacement for the manual step | Designed | MFI PRD FR-4.5. The access agreement is the long pole | 2 |
| MF-06 | Vetting with an assessed limit. An approval above it is flagged as an override: immutable, justified, and tracked as a cohort | Designed | MFI PRD FR-5 | 1 |
| MF-07 | Approval chains by product and amount tier, with no self-approval; overrides always end with the override authority | Designed | MFI PRD FR-6. Belongs to the shared mandates module — FS-138 | 1 |
| MF-08 | Repayments split automatically by component, in a configurable order, with the breakdown stored on every transaction | Designed | MFI PRD FR-7. For non-deposit-taking lenders the order is fixed by law: principal, then fees, then interest (MF-22, FS-435) | 1 |
| MF-09 | Restructure and rollover, with an immutable chain back to the original loan | Designed | MFI PRD FR-8. How Fineract does this is the largest unknown — FS-139 | 1 |
| MF-10 | Repayment by M-Pesa push prompt and paybill with automatic matching; bank transfers matched by the accountant | Designed | MFI PRD FR-9.1, FR-9.2. Whose shortcode — FS-140 | 1 |
| MF-11 | Disbursement by M-Pesa B2C or bank transfer, only from an approved application, with maker-checker on the disbursement itself | Designed | MFI PRD FR-9.3 | 1 |
| MF-12 | Payment failures in a retry and exception queue the accountant can see | Designed | MFI PRD FR-9.4. Delivered by recon-observability | 1 |
| MF-13 | SMS reminders on a configurable schedule, with templates, delivery logs and opt-out | Designed | MFI PRD FR-10. Sent through messaging MS-02: direct SMPP under Dibon's PRSP licence (Planned) | 1 |
| MF-14 | Portfolio dashboard: arrears buckets, PAR30, income by component, the override cohort, pipeline ageing | Designed | MFI PRD FR-11 | 1 |
| MF-15 | Reports: income by component, portfolio health, borrower statement, collateral register | Designed | MFI PRD FR-12 | 1 |
| MF-16 | Mifos migration, with a source-against-target reconciliation signed off before cutover | Designed | MFI PRD FR-13. Priced per onboarding (MFI PRD §7) | 1 |
| MF-17 | Group lending | Planned | MFI PRD §6, Phase 2. The party model is designed for it (FR-1.4) | 2 |
| MF-18 | Further collateral types: title deeds, chattels, equipment | Planned | MFI PRD §6, Phase 2 | 2 |
| MF-19 | CRB submission and lookups | Planned | MFI PRD §6, fast-follow. Only banks, microfinance banks and Saccos may subscribe to a CRB; lenders share data under LR-03 reg 33, and Dibon processes for the subscriber, never subscribes (FS-447); FS-019 | 2 |
| MF-20 | The borrower's registered name confirmed with M-Pesa Hakikisha before a disbursement is sent | Planned | Owner, 2026-10-03 (FS-388); rails RL-21; MF-11 | 1 |
| MF-21 | Arrears interest and penalties capped so they never exceed what the law allows: on a non-performing loan, interest no more than the principal owing when it became non-performing (Banking Act s.44A for banks; CBK lender regulations 2026, reg 29, for non-deposit-taking lenders), reset if the loan performs and falls back; enforced in the service layer because the core does not | Planned | FS-400. A customer's product charges 1% a day in default. 2026-10-05: law register LR-03 reg 29 and LR-04 s.44A; for microfinance banks the courts are split, for Saccos there is no statutory rule, so the cap is on by default for lenders and banks and configurable otherwise (FS-427) | 1 |
| MF-22 | For non-deposit-taking lenders, each repayment credited on the day it is paid and applied to due principal, then fees and charges, then interest; early repayment in whole or part without notice or penalty, and no interest for the remaining term | Planned | CBK lender regulations 2026 (law register LR-03), reg 56 (FS-435). Overrides MF-08's configurable order for these lenders | 1 |
| MF-23 | A pricing model with clear parameters, each loan's total cost shown as an annual percentage rate, and a key information document for every product | Planned | CBK lender regulations 2026 (law register LR-03), regs 48 and 59 (FS-435) | 1 |
| MF-24 | A change to pricing parameters or credit terms held until CBK's written approval is recorded, then 30 days' notice to each customer, applied once accepted | Planned | CBK lender regulations 2026 (law register LR-03), reg 55 (FS-435) | 1 |
| MF-25 | Loans classified non-performing as the regulations define (for a loan of 30 days or less, 30 days after the amount falls due), feeding the arrears cap (MF-21) | Planned | CBK lender regulations 2026 (law register LR-03), reg 57 (FS-435) | 1 |
| MF-26 | Collection conduct enforced in reminders and messages: never to a borrower's contacts or phone book, never outside working hours, no shaming language | Planned | CBK lender regulations 2026 (law register LR-03), reg 30 (FS-435); messaging quiet hours (MS-15) | 1 |
| MF-27 | No negative credit information sent to a bureau for an amount of KES 1,000 or less, and the pre-listing notice observed | Planned | CBK lender regulations 2026 (law register LR-03), reg 33 (FS-435); with CRB submission (MF-19) | 2 |
| MF-28 | Complaints logged with their clock: acknowledged within seven days where they cannot be resolved promptly | Planned | CBK lender regulations 2026 (law register LR-03), reg 40 (FS-435) | 1 |
| MF-29 | Where a lending decision is automated, the decision explained to the customer, who is told when dealing with an AI system rather than a person | Planned | CBK lender regulations 2026 (law register LR-03), reg 60 (FS-435) | 2 |

## 4 · Where it sits

**Depends on:** mandates (MF-07, MF-11), identity (NPDM, formerly IPRS),
rails (M-Pesa, Airtel Money, T-Kash, bank transfer), messaging (MF-13),
recon-observability (MF-10, MF-12), crb (MF-19), financial-crime
(sanctions screening, records and lenders' CBK returns; FS-431).
**Used by:** omni-channel (the borrower channels and the field-officer
app show its loans) and insights (its metrics). Otherwise it is the
product an MFI buys.

**Who holds which record** (docs/architecture.md §2):

| Record | System of record | This module |
|---|---|---|
| Loans, schedules, repayments, charges, balances | **Fineract** | Holds, as the MFI's funds ledger (native mode) |
| The MFI's money | The MFI's own M-Pesa shortcode and bank accounts | **Never holds** |
| Borrowers' KYC documents, collateral evidence | MFI, in its document store | Holds. Government IDs are Restricted |
| The MFI as our customer: contract, users, tickets | Odoo | Ops provisioning, sales-led (MFI PRD §4) |
| Approvals and mandate configuration | Mandate engine | Feeds |
| Repayment matches and exceptions | Recon engine | Feeds |

**What this module never stores:** borrower funds, or a borrower's mobile
money PIN or credentials.

**Under each ledger mode:**

| | Integrated — the MFI has a core | Native — no core; Fineract is the ledger |
|---|---|---|
| Where funds are posted | **Not offered at launch.** An MFI on an earlier Mifos installation is migrated (MF-16), which makes it native | Fineract |
| What differs in this module | — | The default. No end-of-day reconciliation against an outside core |
| What the customer must provide | — | Its shortcode and bank access; its loan products and fee structures; its approval chains |
| Who it suits | Lenders with a core of their own, if the product moves up-market — FS-141 | Lenders moving off Excel, paper or Mifos |

## 5 · How it works

```
  Loan officer       Approvers          Fineract        M-Pesa / bank
       |                 |                  |                  |
  application,           |                  |                  |
  KYC, collateral        |                  |                  |
  evidence, vetting      |                  |                  |
       |  gate: KYC +    |                  |                  |
       |  verified       |                  |                  |
       |  collateral     |                  |                  |
       |---------------->| mandate chain    |                  |
       |                 | (override ends   |                  |
       |                 |  with CEO)       |                  |
       |                 |----------------->| loan approved    |
       |                 |  maker-checker   |                  |
       |                 |  on disbursement |----------------->| B2C or bank
       |                 |                  |                  |
       |                 |                  |<-----------------| repayment
       |                 |                  | split by         |
       |                 |                  | component        |
       |                 |                  |                  |
  SMS reminders from schedule events; failures to the recon queue
```

## 6 · Rails and integrations

| Rail / system | Direction | Feed | Status |
|---|---|---|---|
| M-Pesa (push prompt, paybill, B2C) | in / out | real-time callback | Rail Built (rails RL-03); MFI flows Designed (MF-10, MF-11) |
| Airtel Money | in / out | real-time callback | Designed (MFI PRD §4; rails RL-04, v1) |
| T-Kash | in | real-time callback | Designed (rails RL-05, v1); field collections (omni-channel OC-18) |
| Bank transfer (PesaLink, through the sponsor bank) | in / out | API; manual match on the way in | Planned (rails RL-06, FS-408) |
| NPDM, formerly IPRS | read | API | Designed (MF-02) |
| NTSA | read | manual check now; API in Phase 2 | Designed (MF-04, MF-05) |
| SMS: Safaricom, Airtel, Telkom | out | SMPP; delivery reports | Planned (messaging MS-02); MF-13 Designed |
| CRBs | in / out | API | Planned (MF-19) |
| Mifos | in | database extract, once | Designed (MF-16) |

## 7 · Regulatory position

- **Custody:** none. Disbursements leave, and repayments arrive in, the
  MFI's own shortcode and accounts. **Pattern: pass-through** — provided
  the shortcode is the MFI's (FS-140).
- **Licence relied on:** the lender's own. Non-deposit-taking lenders are
  outside the Microfinance Act but within the CBK lender regulations 2026
  (law register LR-03): each must be licensed or registered with CBK, and
  existing lenders apply by about 29 Mar 2027 (reg 96; FS-423). Their
  relationship with CBK is theirs (FS-045); Kapu MFI is designed to meet
  the rules the regulations set for their loans (MF-21 to MF-29), and
  MF-08's repayment order is fixed for them (MF-22, FS-435).
- **Regulators:** CBK (LR-03). ODPC for borrowers' data. NTSA for
  collateral searches.
- **Data:** borrower KYC, statements and loan histories are Confidential.
  National ID numbers and national register results are Restricted. Collateral evidence
  includes vehicle ownership records.
- **Automated decisions:** vetting stays human. The system records and
  enforces; it does not decide (MFI PRD §6; FS-020).
- **Open legal checks:** FS-137, and the repossession evidence question in
  MFI PRD §7.

## 8 · Controls

- **Gates that cannot be overridden:** KYC completeness (FR-2.4) and
  verified collateral (FR-4.4) gate entry to the approval chain.
- **Overrides are visible, not prevented:** above-limit approvals are
  allowed, but flagged permanently, justified, and approved by the
  override authority (FR-5, FR-6.8).
- **No self-approval** across consecutive steps, even in a three-person
  team (FR-6.7).
- **Maker-checker on disbursement** (FR-9.3). Disbursement moves money, so
  it is attributed at the act (docs/architecture.md §7).
- **Nothing is deleted:** a restructured loan is closed as Restructured and
  linked, never modified (FR-8.2). Verification records are immutable
  (FR-4.2).

## 9 · Deployment

Hosted by us, one tenant per MFI, on Liquid's Azure Stack (FS-032). A
three-person lender will not run its own infrastructure. Shared platform
services as in docs/architecture.md §6. The MFI PRD calls it sales-led and
ops-provisioned through Odoo CRM.

## 10 · What it does not do

At launch (MFI PRD §6): group lending, programmatic NTSA, deposits and
savings, a borrower app or USSD, automated credit scoring, and CRB
submission. It does not decide who gets a loan. Two of the PRD's launch
exclusions have moved: field-officer and offline collection is now
phase 1, through the field-officer app and collections on M-Pesa, Airtel
Money and T-Kash (omni-channel OC-17 to OC-19, core KC-14; FS-453), and
CBK regulatory returns sit in financial-crime (FC-13), not here.

## 11 · Open questions

FS-019, FS-020, FS-088, FS-136, FS-137, FS-138, FS-139, FS-140, FS-141.

## 12 · Sources

- Kapu Pay MFI — Product Specification (PRD section), Draft v0.2, Jun 2026
  (sources/kapu/).
- docs/architecture.md §2, §3, §4.
- REVIEW.md FS-019, FS-020, FS-045.
