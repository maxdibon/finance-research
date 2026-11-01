---
id: mfi
name: Kapu MFI
kind: product
status: living
law: LR-03
released: 2026.10.16
owner: Product lead, Kapu
classification: Internal
audience: [mfi]
depends_on: [mandates, identity, rails, messaging, recon-observability, crb, financial-crime, access, collect, core, gateway, sme-recon, business-suite, escrow, decisioning]
consumed_by: [omni-channel, insights, business-suite, sacco]
review_ids: [FS-019, FS-020, FS-045, FS-088, FS-136, FS-137, FS-138, FS-139, FS-140, FS-141, FS-320, FS-354, FS-388, FS-400, FS-407, FS-423, FS-431, FS-435, FS-447, FS-453, FS-496, FS-499, FS-500, FS-522, FS-516, FS-517, FS-518, FS-519, FS-531, FS-532, FS-582, FS-581, FS-602, FS-618, FS-619, FS-625, FS-629, FS-764, FS-769, FS-812, FS-983, FS-989, FS-995, FS-996, FS-1069]
last_reviewed: 2026-11-01
---

# Kapu MFI

## 1 · In one paragraph

**It runs on the Kapu lending service** (FS-983; docs/specs/lending-service.md):
one thin service for MFI and Sacco, with Fineract configured for what it
does natively and Odoo, through the back-office gateway, for what it does
well; Kapu MFI is that service configured for lenders, with lender rules
beside it.

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
| MF-01 | Digital loan application with drafts and a timestamped, attributed lifecycle from Draft to Closed, Restructured or Written Off. The application follows the institution's own paper form, section by section (for Roan Capital: the client and the loan, guarantor, chattels mortgage, house visit, review), and shows the cost of credit as it is entered: the instalment, each charge and the net payout (FS-812) | Designed | MFI PRD FR-1 | 1 |
| MF-02 | Borrower KYC: national register lookup (NPDM, formerly IPRS), a document checklist per product, and a completeness gate that cannot be overridden | Designed | MFI PRD FR-2 | 1 |
| MF-03 | Generic collateral model, with vehicle as the first type: coverage ratios, custody log, recovery and forced sale, release on settlement. Scans, the NTSA joint-registration record and the collateral-registry search are filed in the document vault (identity ID-15); the collateral-registry number is kept on the record (Movable Property Security Rights Act, LR-23); originals are tracked in the custody log and released only on settlement with a second person's approval. In R1, a land title is a second type, stored only: the record, the title in the vault and the registry reference; searches and charge registration stay MF-18 (FS-581). The collateral registry (Movable Property Security Rights Act, FS-602): at appraisal, a search by the collateral's serial number or the borrower's identifier, with its certificate filed, so an earlier lender's right is found first; on registration, the notice's number, time and expiry recorded, and the copy sent to the borrower through their own link within ten working days, the deadline tracked (LR-23 s.31(2), an offence if missed); six months before expiry, a warning if the loan is still live (LR-23 s.30); on settlement, the cancellation notice registered as part of the release, free and within ten working days of any request (LR-23 s.33). In R1 each act is done on the registry's portal by a named officer, and the platform records it and tracks the deadlines | Designed | MFI PRD FR-3; owner, 2026-10-06: vault, registry number and release (FS-519) | 1 |
| MF-04 | Collateral verification done manually (the design: lending-service §5.2, FS-1069), with an immutable evidence record; a failed check blocks acceptance unless the override authority justifies it. Every manual collateral step is tracked, though the platform does not perform it (FS-619): a checklist per collateral type and stage (before approval, before disbursement, during the loan, at settlement), each step with an owner, a due date, evidence filed in the vault and an outcome: the NTSA ownership search, joint registration and custody switching, the land registry search and charge registration, insurance and its expiry, and discharge at settlement beside the registry cancellation (MF-03). The institution chooses which steps block approval or disbursement. A tracking provider's device and certificate are kept on the record, and its alerts (a red zone, a vehicle untraceable) are logged as events, a recovery opened from them. Overdue steps are reminded and escalated (mandates MD-08). Automation replaces a step, not the checklist: NTSA (MF-05), land (MF-18), a tracker's API | Designed | MFI PRD FR-4.1 to FR-4.4. Owner, 2026-10-08: the manual steps Roan Capital's document keeps outside the system, tracked (FS-619) | 1 |
| MF-05 | Programmatic NTSA verification as a drop-in replacement for the manual step | Designed | MFI PRD FR-4.5. The access agreement is the long pole | 2 |
| MF-06 | Vetting with an assessed limit. An approval above it is flagged as an override: immutable, justified, and tracked as a cohort | Designed | MFI PRD FR-5 | 1 |
| MF-07 | Approval chains by product and amount tier, with no self-approval; overrides always end with the override authority | Designed | MFI PRD FR-6. Belongs to the shared mandates module — FS-138 | 1 |
| MF-08 | Repayments split automatically by component, in a configurable order, with the breakdown stored on every transaction | Designed | MFI PRD FR-7. For non-deposit-taking lenders the order is fixed by law: principal, then fees, then interest (MF-22, FS-435) | 1 |
| MF-09 | Restructuring: a reschedule (same loan, new schedule), a refinance or rollover (a new loan pays off the old, with an immutable chain back to it), or a top-up; on the borrower's request or with prior notice (CBK lender regulations reg 28(3)); approved through the mandate engine as its own request; a new key information document the borrower accepts; arrears interest never capitalised into new principal, and the arrears cap not reset by it (reg 29(3)); restructured loans flagged and tracked as a cohort, with a limit on how often one loan is restructured | Designed | MFI PRD FR-8; owner, 2026-10-06: in R1 (FS-516). In Fineract: re-aging, a reschedule request or a top-up, and a refinance refused while interest is overdue (docs/specs/kapu-core-fineract.md §6; FS-139, FS-625) | 1 |
| MF-10 | Repayment by M-Pesa push prompt and paybill with automatic matching; bank transfers matched by the accountant | Designed | MFI PRD FR-9.1, FR-9.2. Whose shortcode — FS-140 | 1 |
| MF-11 | Disbursement by M-Pesa B2C or bank transfer, only from an approved application, with maker-checker on the disbursement itself | Designed | MFI PRD FR-9.3 | 1 |
| MF-12 | Payment failures in a retry and exception queue the accountant can see | Designed | MFI PRD FR-9.4. Delivered by recon-observability | 1 |
| MF-13 | SMS reminders on a configurable schedule, with templates, delivery logs and opt-out | Designed | MFI PRD FR-10. Sent through messaging MS-02: direct SMPP under Dibon's PRSP licence (Planned) | 1 |
| MF-14 | Portfolio dashboard: arrears buckets, PAR30, income by component, the override cohort, pipeline ageing; PAR 1, 7 and 30; money collected against money due, by day; items awaiting action (FS-812) | Designed | MFI PRD FR-11 | 1 |
| MF-15 | Reports: income by component, portfolio health, borrower statement, collateral register; each exportable to CSV: the active portfolio, arrears and overdue, disbursements, collections, income, clients onboarded (FS-812) | Designed | MFI PRD FR-12 | 1 |
| MF-16 | Mifos migration, with a source-against-target reconciliation signed off before cutover | Designed | MFI PRD FR-13. Priced per onboarding (MFI PRD §7) | 1 |
| MF-17 | Group lending | Planned | MFI PRD §6, Phase 2. The party model is designed for it (FR-1.4) | 2 |
| MF-18 | Further collateral types: title deeds, chattels, equipment | Planned | MFI PRD §6, Phase 2 | 2 |
| MF-19 | CRB submission and lookups | Planned | MFI PRD §6, fast-follow. Only banks, microfinance banks and Saccos may subscribe to a CRB; lenders share data under LR-03 reg 33, and Dibon processes for the subscriber, never subscribes (FS-447); FS-019 | 2 |
| MF-20 | The borrower's registered name confirmed with M-Pesa Hakikisha before a disbursement is sent | Planned | Owner, 2026-10-03 (FS-388); rails RL-21; MF-11 | 1 |
| MF-21 | Arrears interest and penalties capped so they never exceed what the law allows: on a non-performing loan, interest no more than the principal owing when it became non-performing (Banking Act s.44A, LR-04, for banks; CBK lender regulations 2026, LR-03 reg 29, for non-deposit-taking lenders), reset if the loan performs and falls back; enforced in the service layer because the core does not | Planned | FS-400. A customer's product charges 1% a day in default. 2026-10-05: law register LR-03 reg 29 and LR-04 s.44A; for microfinance banks the courts are split, for Saccos there is no statutory rule, so the cap is on by default for lenders and banks and configurable otherwise (FS-427) | 1 |
| MF-22 | For non-deposit-taking lenders, each repayment credited on the day it is paid and applied to due principal, then fees and charges, then interest; early repayment in whole or part without notice or penalty, and no interest for the remaining term | Planned | CBK lender regulations 2026 (law register LR-03), reg 56 (FS-435). Overrides MF-08's configurable order for these lenders | 1 |
| MF-23 | A pricing model with clear parameters, each loan's total cost shown as an annual percentage rate, and a key information document for every product; and every loan's charges itemised down to the net payout, on its page and its statement (FS-812) | Planned | CBK lender regulations 2026 (law register LR-03), regs 48 and 59 (FS-435) | 1 |
| MF-24 | A change to pricing parameters or credit terms held until CBK's written approval is recorded, then 30 days' notice to each customer, applied once accepted | Planned | CBK lender regulations 2026 (law register LR-03), reg 55 (FS-435) | 1 |
| MF-25 | Loans classified non-performing as the regulations define (for a loan of 30 days or less, 30 days after the amount falls due), feeding the arrears cap (MF-21) | Planned | CBK lender regulations 2026 (law register LR-03), reg 57 (FS-435) | 1 |
| MF-26 | Collection conduct enforced in reminders and messages: never to a borrower's contacts or phone book, never outside working hours, no shaming language | Planned | CBK lender regulations 2026 (law register LR-03), reg 30 (FS-435); messaging quiet hours (MS-15) | 1 |
| MF-27 | No negative credit information sent to a bureau for an amount of KES 1,000 or less, and the pre-listing notice observed | Planned | CBK lender regulations 2026 (law register LR-03), reg 33 (FS-435); with CRB submission (MF-19) | 2 |
| MF-28 | Complaints logged with their clock: acknowledged within seven days where they cannot be resolved promptly | Planned | CBK lender regulations 2026 (law register LR-03), reg 40 (FS-435) | 1 |
| MF-29 | Where a lending decision is automated, the decision explained to the customer, who is told when dealing with an AI system rather than a person | Planned | CBK lender regulations 2026 (law register LR-03), reg 60 (FS-435) | 2 |
| MF-30 | Collateral lifecycle: revaluation dates, insurance expiry, where the logbook or title is held, joint registration and discharge status, each with reminders before it lapses | Planned | Owner, 2026-10-06 (FS-496). Extends MF-03; land and other types with MF-18 | 2 |
| MF-31 | Collateral API: the register read and its changes published as events, for the institution's systems and partners (valuers, insurers, vehicle trackers), scoped by role | Planned | Owner, 2026-10-06 (FS-496). Partner clients per access AC-04 | 2 |
| MF-32 | LPO and invoice financing for SMEs: the lender sees purchase orders and invoices confirmed in the SME's Odoo and SME Recon, with the SME's consent; repaid from the buyer's payment; the supplier paid through Escrow on delivery where agreed | Planned | Owner, 2026-10-06 (FS-522). Ordinary lending under the CBK lender regulations (LR-03) | 2 |
| MF-34 | Loan agreements: the agreement and key information document generated from the product version and the loan's terms, from templates approved under maker-checker; signed by the borrower and guarantors through Odoo Sign (business-suite BS-02) with a code to their bound phone; the offered and the signed versions filed in the document vault against the loan (identity ID-15), the signed one with its signing certificate and a hash recorded in the loan's trace (recon RO-23); the borrower's copy by link (identity ID-17), never as an attachment | Planned | Owner, 2026-10-06: in R1 (FS-516). Electronic signatures: Kenya Information and Communications Act s.83B (LR-21); whether this meets an advanced signature for loans and guarantees is for counsel | 1 |
| MF-35 | Loan officers: each borrower and loan assigned to an officer, reassigned in bulk on leave or exit with a second person's approval and the history kept; joining in Odoo's Employees app (business-suite BS-12) creates the Keycloak user, the Fineract staff record and an enrolled field device; performance by officer (portfolio, disbursements, arrears, collections, overrides, visits); officers never approve their own applications and handle no cash | Planned | Owner, 2026-10-06 (FS-517). Fineract assigns loans to staff, and reassigns them in bulk (docs/specs/kapu-core-fineract.md §5). Owner, 2026-10-06: in R1 | 1 |
| MF-36 | Pay-day limits: a limit approved once like any loan; each draw from the phone to M-Pesa, Airtel Money, T-Kash or the bank without further approval, checked on every draw for the limit left, employment still active (a leaver in Odoo HR blocks it), deduction headroom on the next payroll and arrears; repaid by check-off over one to three payrolls | Planned | Owner, 2026-10-06 (FS-518). The lender notifies CBK of a new channel 30 days before launch (reg 27) | 2 |
| MF-37 | Guarantors: consent sought and recorded before anyone is appointed, the guarantee signed (MF-34); the guarantor kept informed by periodic loan statements; recourse only after non-judicial recovery from the borrower is exhausted, and no demand before the guarantor has had 14 days' notice of the default | Planned | CBK lender regulations reg 39(3), reg 42 (LR-03); owner, 2026-10-06: in R1 (FS-531) | 1 |
| MF-38 | Borrower access: a receipt for every transaction; a message at each change of status (approved, disbursed, due, overdue, restructured, settled); a free statement on request, by a single-use link to our own page, never as an attachment | Planned | CBK lender regulations reg 39(1) (LR-03); owner, 2026-10-06: in R1 (FS-531) | 1 |
| MF-39 | The collection ladder: stages by days past due, configured per product (for Roan Capital: a reminder on day 25, the default run from day 30, a final warning from day 40, closure on day 47), each with its messages, its actions and who acts; a loan moves between stages by rule each day on the business calendar (core KC-15), and back when it is paid up; every message within the conduct rules (MF-26), every charge within the arrears cap (MF-21), and the bureau notice before any listing (MF-27). An amount disputed in an open complaint (MF-28) holds the ladder: no reminders or ladder actions on it until the complaint closes, the hold recorded on the loan; the rest of the loan carries on. A workbench for it: promises to pay, call and visit logs with their notes, the guarantor shown, filters by how late; a promise holds the reminders until its date (FS-812) | Planned | Owner, 2026-10-08 (FS-618); Roan Capital RC-27; owner, 2026-10-12: the hold (FS-764, JN-08) | 1 |
| MF-40 | Loans paid to a third party, or drawn on a line: the payee checked against an approved list and its proof (an invoice, a fee structure) before the payout, which the approval engine ties to the payee; credit lines with draws and limits renewed from a partner's data; partner terms (its data with the borrower's consent, its share of the price, first loss, returns refunded to the loan); repayment by the borrower, an employer, an invoice's buyer or a share of till takings | Planned | FS-989; docs/products/loan-kinds.md | 2 |
| MF-41 | Partners onboarded and managed by the institution: one record (the company in Odoo; settlement accounts, exposure cap, first loss and status here, each change approved by a second person); relationships with their own limits, nested with the product's, the borrower's and the core's; due diligence, agreements, verified accounts, two approvals, monitoring, freeze and exit; signed events to the partner's system; a partner portal in Odoo; bulk limit refresh | Planned | FS-996, FS-1000; docs/specs/lending-service.md §5 | 2 |
| MF-42 | Partner data feeds: a contract per feed, files first and an API later, a consent gate per person, checks and quarantine, only metrics to decisioning, a mobile operator's scores taken as scores, cross-checked against what was paid | Planned | FS-995, FS-1002; docs/specs/lending-service.md §5 | 2 |

**Retired ids:** MF-33, moved to decisioning DE-03 (the behaviour score) and DE-06 (learned scoring and affordability from source) (FS-582).

## 4 · Where it sits

**Depends on:** mandates (MF-07, MF-11), identity (NPDM, formerly IPRS),
rails (M-Pesa, Airtel Money, T-Kash, bank transfer), messaging (MF-13),
recon-observability (MF-10, MF-12), crb (MF-19), financial-crime
(sanctions screening, records and lenders' CBK returns; FS-431),
decisioning (statement metrics, the behaviour score and risk classes
for appraisal, MF-06; FS-582). Also access (login, roles and step-up); collect (repayments and deposits collected through partners); core (Kapu Core, where the institution has no core of its own); gateway (collections from customers' wallets); sme-recon, business-suite and escrow (LPO and invoice financing, MF-32).
**Used by:** omni-channel (the borrower channels and the field-officer
app show its loans), insights (its metrics) and business-suite (check-off
schedules to employers, BS-15) and sacco (group lending for chamas,
SC-19). Otherwise it is the product an MFI buys.

**Who holds which record** (docs/architecture/README.md §2):

| Record | System of record | This module |
|---|---|---|
| Loans, schedules, repayments, charges, balances | **Fineract** | Holds, as the MFI's funds ledger (native mode) |
| The MFI's money | The MFI's own M-Pesa shortcode and bank accounts | **Never holds** |
| Borrowers' KYC documents, collateral evidence | The document vault (identity ID-15) | References by id. Government IDs are Restricted |
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

**Inside the service layer** (FS-629): the *lender-rules service* applies
the CBK lender regulations to every loan (docs/specs/lender-rules.md); the
approval engine decides (docs/specs/approval-engine.md); Fineract records
(docs/specs/kapu-core-fineract.md); the end-of-day runner closes each day
(docs/specs/end-of-day-runner.md).

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
  it is attributed at the act (docs/architecture/README.md §7).
- **Nothing is deleted:** a restructured loan is closed as Restructured and
  linked, never modified (FR-8.2). Verification records are immutable
  (FR-4.2).

## 9 · Deployment

Hosted by us, one tenant per MFI, on Liquid's Azure Stack (FS-032). A
three-person lender will not run its own infrastructure. Shared platform
services as in docs/architecture/README.md §6. The MFI PRD calls it sales-led and
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

FS-088, FS-141.

## 12 · Sources

- Kapu Pay MFI — Product Specification (PRD section), Draft v0.2, Jun 2026
  (sources/kapu/).
- docs/architecture/README.md §2, §3, §4.
- REVIEW.md FS-019, FS-020, FS-045.

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](../law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 27 | reg 27 | Thirty days' notice to the Central Bank before a new delivery channel rolls out, with the mobile money account, apps and bank accounts to be used; a way to opt out of marketing messages; channels that are available, safe, protected from fraud, easy to use and affordable |
| reg 28 | reg 28(3) | Applications considered under the credit policy, ability to repay assessed and no reckless lending (28(1)); a refusal given at once, with reasons (28(2)); a loan may be restructured on the borrower's request or with prior notice (28(3)) |
| reg 29 | reg 29, reg 29(3) | What can be recovered on a non-performing loan is capped at the principal then owing, interest up to that principal, and reasonable recovery costs; the cap is measured from the last time the loan became non-performing (29(3)); interest under a court order after the order is outside it (29(4)) |
| reg 30 | reg 30 | No harassing, shaming or threatening collection: nothing posted to shame a borrower (30(1)(d)), no messages to their contacts (30(1)(e)), no calls outside working hours, no taking of essential personal effects (30(1)(k)); no charges not disclosed in the contract (30(2)); land security recovered under the Land Act (30(3)); thirty days' notice before selling movable security (30(4)) |
| reg 33 | reg 33 | Customers' credit information shared with licensed credit reference bureaus, timely, complete and accurate; no negative listing for an amount of one thousand shillings or less (33(3)) |
| reg 39 | reg 39(1), reg 39(3) | A receipt for every transaction, a free loan statement on request and a way to see it at any time (39(1)); errors corrected promptly (39(2)); a guarantor kept informed through periodic statements (39(3)) |
| reg 40 | reg 40 | A complaints mechanism made known to customers; acknowledgement within seven days where a complaint cannot be dealt with promptly; an oral complaint unresolved after forty-eight hours confirmed in writing; resolution within thirty days |
| reg 42 | reg 42 | A guarantor's consent sought and obtained before the appointment; recourse to a guarantor only after non-judicial recovery from the borrower is exhausted, and after fourteen days' notice of the default |
| reg 48 | reg 48 | A key information document for each product: its benefits, risks, terms and conditions, in summary |
| reg 55 | reg 55 | Pricing parameters and credit terms change only with the Central Bank's prior written approval, after thirty days' notice to the customer and the customer's acceptance |
| reg 56 | reg 56 | A repayment credited on the day it is paid, applied to due principal, then fees and charges, then interest; early repayment, in whole or part, without notice or penalty (56(3)), and no interest for the remaining term on full early repayment (56(4)) |
| reg 57 | reg 57 | A loan is non-performing when principal or interest is outstanding thirty days past due, for a loan of thirty days or less, or ninety days, for a longer one (57(1)); the credit policy (57(2)) and each loan agreement (57(3)) state the default period |
| reg 59 | reg 59 | A pricing model with clear parameters: its components and costs justified, rates that may vary with the borrower's creditworthiness (59(2)(c)), the criteria for non-performance, credit bureau scores, all-inclusive pricing except third-party costs (59(2)(f)), and the APR disclosed |
| reg 60 | reg 60 | Where artificial intelligence makes lending decisions: decisions explained, customers told they are dealing with a machine, human oversight kept, bias assessed, models robust and explainable, data protected |
| reg 96 | reg 96 | A lender in business when the Regulations began applies within six months of publication and may continue meanwhile; one licensed under the Digital Credit Providers Regulations, 2022 is deemed licensed |

**[LR-04](../law/LR-04.md) The Banking Act (Cap. 488).** Regulator: Central Bank of Kenya. Made under: An Act of Parliament. In force: Yes. Version read: as at 2024-12-27, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/1989/9/eng@2024-12-27).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 44A | s. 44A | What an institution may recover on a non-performing loan is capped at the principal then owing, interest up to that principal, and recovery expenses; the cap is measured from the last time the loan became non-performing; interest under a court order after the order is outside it. The same cap as reg 29 of the Credit Providers Regulations, for banks |

**[LR-21](../law/LR-21.md) The Kenya Information and Communications Act (Cap. 411A).** Regulator: Communications Authority of Kenya. Made under: An Act of Parliament. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/1998/2/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 83B | s. 83B | The part on electronic transactions does not apply to the creation or execution of a will, or to negotiable instruments; the Cabinet Secretary may add or remove classes by order. Everything else may be done electronically under that part |

**[LR-23](../law/LR-23.md) The Movable Property Security Rights Act (Cap. 499A).** Regulator: The Registrar of security rights, who keeps the collateral registry. Made under: An Act of Parliament. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2017/13/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 30 | s. 30 | A registered notice is effective for the period the registrant states, at most ten years; it can be extended only within the six months before it expires, by an amendment notice |
| s. 31 | s. 31(2) | The Registrar sends the registrant a copy of each registered notice; the registrant sends it to the grantor within ten working days (31(2)), and failing to is an offence (31(3)) |
| s. 33 | s. 33 | The secured creditor registers an amendment or cancellation notice where a notice exceeds what the grantor authorised, collateral is released, or the security right is extinguished; free of charge, and within ten working days of the grantor's request, or the grantor may go to the Registrar |
