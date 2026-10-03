---
id: roan-capital
name: Roan Capital — delivery map
kind: delivery
version: 0.1.0
owner: Delivery lead
classification: Internal
review_ids: [FS-395, FS-397, FS-398, FS-399, FS-400, FS-401, FS-402, FS-403, FS-413, FS-414]
last_reviewed: 2026-10-03
---

# Roan Capital — delivery map

Customer CU-01 in docs/customers.md. What we are building for Roan Capital,
mapped requirement by requirement to the platform's capabilities. The
source is Roan Capital's *Business Requirement Document*, v1.0, 20 Aug
2026, held in clients/roan-capital/ outside git; section numbers below are
that document's. Statuses are not repeated here: each capability's status
is in its module, so it changes in one place.

## 1 · The engagement

A digital lending back office for Roan Capital's microfinance operations,
replacing Excel and paper: onboarding and KYC, collateral documents, a
committee approval chain with maker-checker, disbursement, repayment
reconciliation, arrears and collections, and management reports. It is
Kapu MFI on Kapu Core (Apache Fineract), delivered as an MVP pilot, with
the manual NTSA and land registry steps kept outside the system.

- **Products:** Kapu MFI (docs/modules/mfi.md) on Kapu Core
  (docs/modules/core.md), with mandates, identity, access, messaging and
  reconciliation as shared services.
- **Hosting:** Dibon's cloud (the document's assumption 4). The prototype
  runs on Vercel; real borrower data stays off it (FS-398).
- **Secrets:** OpenBao, not HashiCorp Vault as the document says (FS-403).
- **Reference:** Roan Capital is to be asked to be named once live
  (FS-401). Until it agrees, its name stays out of the portfolio and
  outreach.

**Fit:** *Covered* means the capabilities listed do what the requirement
asks. *Partial* means they cover part of it, and the note says what is
missing. *Gap* means no capability does it yet.

## 2 · Requirements against capabilities

### KYC and onboarding (§2.2)

| Ref | Requirement | Capabilities | Fit | Note |
|---|---|---|---|---|
| RC-01 | Borrowers as individuals, businesses and statement-based entities | KC-01, MF-01 | Partial | Kapu Core holds individuals and businesses; the statement-based entity type is not modelled |
| RC-02 | National ID and passport checked against IPRS in real time, with the cost of each query logged | ID-01, MF-02 | Partial | The document logs KES 5 a query; direct access is KES 20 a check plus KES 50,000 to connect (partners PT-29, compliance LC-12). Passport coverage unconfirmed (FS-329). Roan Capital provides the credentials (assumption 1) |
| RC-03 | Company status and directors checked with the Business Registration Service | ID-07 | Gap | ID-07 is phase 2; this document needs it in the MVP. Decide the phase |
| RC-04 | Documents uploaded and stored: ID, KRA PIN, photo, certificate of incorporation, directors' guarantees; status per document | ID-02, MF-02 | Covered | |
| RC-05 | Bank and M-Pesa statements (3 to 12 months) ingested for appraisal | — | Gap | Reconciliation ingests statements (RO-01) for matching, not for appraisal. Needs a parser feeding RC-11 |
| RC-06 | No loan account until verification is complete | MF-02 | Covered | The completeness gate cannot be overridden |
| RC-07 | Onboarding wizard with separate individual and business flows | MF-01, MF-02 | Partial | The flows exist; separate wizards per borrower type are screen design |

### Collateral (§2.2)

| Ref | Requirement | Capabilities | Fit | Note |
|---|---|---|---|---|
| RC-08 | Collateral record for a vehicle or land, linked to the loan | MF-03, MF-18 | Partial | Vehicle is the first type (MF-03); land titles are MF-18, phase 2. This document needs land in the MVP |
| RC-09 | The committee cannot open or approve an application until the logbook or title is attached; status "Logbook Pending" or "Logbook Attached" | MF-04 | Partial | MF-04 blocks acceptance on a failed verification; a gate on the document's presence is a narrower rule to configure |
| RC-10 | NTSA search, joint registration and discharge stay manual, outside the system | MF-04, MF-05 | Covered | Matches MF-04's manual verification; programmatic NTSA (MF-05) stays phase 2, as the document's exclusions say |

### Credit lifecycle and governance (§2.2)

| Ref | Requirement | Capabilities | Fit | Note |
|---|---|---|---|---|
| RC-11 | Appraisal from statements: turnover, liquidity, retainer ratio | MF-06 | Partial | MF-06 records an assessed limit and flags overrides; computing these ratios from statements is new (needs RC-05) |
| RC-12 | Chain: Credit Officer, then the Business Credit Committee (3 of 3, unanimous), then the Head Office Committee above a configurable threshold | MD-01, MF-07, MD-09 | Covered | Chains per product and amount tier are configuration. The unanimous committee needs quorum steps, moved to phase 1 for this delivery (FS-399, FS-402) |
| RC-13 | Maker-checker throughout: the decider is never the requester | MD-06 | Covered | |
| RC-14 | Behaviour score for repeat borrowers, from repayment timing | — | Gap | No capability scores repayment behaviour |
| RC-15 | A Class A borrower downgraded automatically on a pattern of late payment | — | Gap | Classification is reported (MF-14), not changed by rule |
| RC-16 | Committee composition and the escalation threshold configurable | MD-01, MD-02 | Covered | Effective-dated and audited |
| RC-17 | Review dashboards; a committee screen with per-member comments and a vote tracker; an escalation banner | MD-05, MD-09 | Partial | Decisions carry identity, comment and time (MD-05); the vote tracker comes with quorum steps |

### Disbursement and repayment (§2.2)

| Ref | Requirement | Capabilities | Fit | Note |
|---|---|---|---|---|
| RC-18 | Disbursement under maker-checker, through NCBA and Access Bank internet banking | MF-11, RL-07 | Partial | Maker-checker is MF-11. Bank APIs are RL-07, Planned; Roan Capital opens the NCBA API talks (assumption 2). The document names Access Bank in §2.1 only. M-Pesa B2C ran in production at Onit Bank (RL-03), with the name confirmed by Hakikisha (MF-20) |
| RC-19 | Repayments reconciled by parsing M-Pesa and bank statement narrations | MF-10, RO-02, RO-05 | Partial | Better with M-Pesa C2B on Roan Capital's paybill (RL-03, Built at Onit Bank): each repayment arrives with its account reference, and Pull Transactions (RL-20) finds any missed confirmation. Statement parsing becomes the fallback |
| RC-20 | SMS or WhatsApp reminder on day 25 of a 30-day loan | MF-13 | Covered | Through Roan Capital's own SMS gateway (assumption 5), or messaging MS-02 later |
| RC-21 | End-of-day lockout, 11 pm to 4 am: no fund movements, while leads and interest calculation continue | KC-07 | Gap | Kapu Core runs end of day (KC-07); a lockout window on fund movements is not a capability yet |
| RC-22 | Reconciliation dashboard: matched and unmatched, with a manual-match tool | RO-02, RO-05, MF-12 | Covered | |

### Operational risk, compliance and oversight (§2.2)

| Ref | Requirement | Capabilities | Fit | Note |
|---|---|---|---|---|
| RC-23 | Ageing report, buckets from 1 to 360+ days, with export | MF-14 | Covered | |
| RC-24 | Loan classification and a risk portfolio view | MF-14, MF-15 | Partial | Reported; the rule that changes a classification is RC-15 |
| RC-25 | Internal management P&L: interest, fees, penalties | MF-15 | Covered | Income by component |
| RC-26 | Loan calculator (rates 1% to 50%), with penalty interest after day 30 | KC-04, MF-21 | Partial | The rate's unit is not stated (a month, a year, flat?). Penalty interest must stay within the in duplum cap (MF-21, phase 1, FS-400) |
| RC-27 | Delinquency ladder: reminder day 25, default run days 30 to 40, final warning days 40 to 47, hard closure day 47 | MF-13, MF-14 | Partial | Reminders and arrears buckets exist; tiers that change a loan's collection state by day are new |

### Public lead capture, calculator and administration (§2.2)

| Ref | Requirement | Capabilities | Fit | Note |
|---|---|---|---|---|
| RC-28 | A public "Request a Loan" page and lead capture, with lead status from New to Converted or Dropped | BS-01 | Partial | Odoo's CRM (business suite) holds leads and their stages; the public page and conversion into a loan application are new |
| RC-29 | Loan calculator service and a public calculator page, from the same product configuration as live loans | KC-04 | Partial | Fineract computes schedules from the product; the public page is new |
| RC-30 | Loan products: rates, fees, insurance, penalties, amount and tenor limits; changes apply only to new loans | KC-04 | Covered | Fineract copies the product's terms onto each loan when it is created |
| RC-31 | Product changes approved under maker-checker, and audited | MD-01, MD-02, KC-08 | Covered | |

### Security and audit (§2.2, annex I)

| Ref | Requirement | Capabilities | Fit | Note |
|---|---|---|---|---|
| RC-32 | Time-based one-time codes (Google Authenticator) for every approver | AC-05, MD-10 | Partial | Step-up at the act is Planned. The prototype accepts a fixed code (123456): production must never |
| RC-33 | An immutable audit trail of every action, searchable by user, account, date and action | RO-19, MD-05 | Partial | Access audit and decision records exist; one searchable trail across modules is new |
| RC-34 | Roles: Credit Officer, committee members, Head Office Committee, administrator | AC-09 | Partial | The prototype has eight roles (adding CEO, finance, collections, auditor). Agree the list |
| RC-35 | Monitoring: Prometheus, Grafana, Loki; 99.9% uptime | RO-16, RO-17 | Covered | Ran for Collect at Onit Bank (collect CO-11). Uptime sits with the support tier |

## 3 · Out of scope for the MVP (§2.3)

NTSA automation, vehicle tracking, land registry search, WhatsApp-based
reconciliation and tax portals. Each is a later scoping exercise
(assumption 6). Programmatic NTSA is already designed as a drop-in
replacement (MF-05).

## 4 · Open answers

| # | Question | Raised | Status |
|---|---|---|---|
| 1 | Remove the prototype's public demo panel (accounts, a shared password, a fixed 2FA code) before anyone outside the team sees it | FS-395 | Open |
| 2 | Under which licence does Roan Capital lend? It decides the interest and disclosure rules | FS-400 | Open |
| 3 | 1% a day default interest: within the in duplum rule? | FS-400 | Open; the cap is MF-21 |
| 4 | The interest rate's unit | FS-395 | Open |
| 5 | BRS and land titles in the MVP, or phase 2? (RC-03, RC-08) | FS-413 | Open |
| 6 | Disbursement banks: NCBA only, or NCBA and Access Bank? (RC-18) | FS-395 | Open |
| 7 | The role list (RC-34) | FS-395 | Open |
| 8 | Approval chain and loan products | FS-399, FS-400 | Answered: both are configuration |
| 9 | Will Roan Capital be named as a reference once live? | FS-401 | Open |

The document also needs editing: two sections numbered 2.2.2, no section
1.3, exclusions referred to as §2.4 but numbered 2.3, assumption 4's text
inside the table of contents, and misaligned rows in the quality table.

## 5 · Where the detail is

- The requirement document and the full review: clients/roan-capital/
  (outside git).
- Capability statuses: the modules named in §2.
- Decisions: FS-399 to FS-403 in docs/decisions.md and REVIEW.md.
