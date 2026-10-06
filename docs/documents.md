---
id: documents
name: Document catalogue — what an institution keeps, why, and for how long
kind: register
version: 0.1.0
owner: Compliance and risk officer
classification: Internal
review_ids: [FS-063, FS-527, FS-532, FS-537, FS-538]
last_reviewed: 2026-10-06
---

# Document catalogue

What a lender, Sacco or bank on our platform may need, or is required, to
keep; which law says so; how long; and where it lives. The vault (identity
ID-15) takes its retention clock and data class from this table, and each
product's document checklist (ID-02) draws from it. It answers FS-063,
which left retention periods open.

**Read from the law texts we hold** (docs/regulation.md). A period marked
*proposed* has no source in those texts; it is our recommendation, for the
compliance and risk officer to confirm with the institution.

## The rule that covers most of it

**Seven years from the end of the relationship or the completion of the
transaction, whichever is later.** **Twelve years from default for a loan
secured on land or movable property that was written off or went to
recovery**, a logbook loan included, because recovery of a secured
principal can be claimed for twelve years (Limitation of Actions Act
s.19(1)); and twelve years from any judgment (s.4(4)). A secured loan
repaid in full leaves no such claim, so seven years is enough for it. The POCAML Regulations 2023, reg 42(1),
set that minimum for every transaction record, and reg 42(2) extends it to
everything gathered for customer due diligence, *including copies of
identity documents*. CBK's guideline for banks (CBK/PG/08 §5.17), the
microfinance bank regulations (reg 37) and SASRA's AML guidelines for
Saccos (§6.8, e-KYC records included) say the same. The POCAML Act s.46(4) allows the Financial Reporting
Centre to require longer. So does a dispute or an investigation: a **legal
hold** stops the clock until it is lifted.

**At the end of the period the document is deleted** (Data Protection Act
s.39), together with its backups (privacy PR-15). The vault does this; no
one has to remember.

**Where it lives** follows architecture §6 (FS-527): every document that
carries personal data is in the vault; documents with none stay in Odoo.
**How it arrives and leaves** follows architecture §7 (FS-532): links,
the portal, an API or SFTP, never as an attachment.

## The catalogue

Clock: **R** from the end of the relationship, **T** from the transaction
or the loan's closure, **D** from the document's date, **E** from the end
of employment.

### Knowing the customer: individuals

| Id | Document | Required by | Keep for | Class | Arrives by |
|---|---|---|---|---|---|
| DT-01 | Copy of the national ID, passport, alien or refugee ID | POCAML Regs reg 42(2); SASRA AML guidelines §6.8 for Saccos | 7 years, R | Restricted | Console, upload link, field app (ID-15) |
| DT-02 | Photo, selfie and liveness evidence | POCAML Regs reg 42(2); biometric data is sensitive (Data Protection Act); SASRA AML guidelines §6.8 (e-KYC records) | 7 years, R | Restricted | Upload link, field app (ID-04) |
| DT-03 | Results of register checks: national register, operator name check, SIM-swap and IMSI checks; the result and its reference, never a copy of the register's record | POCAML Regs reg 42(2); ID-10 | 7 years, R | Restricted | Fetched (ID-01, ID-05, ID-12) |
| DT-04 | KRA PIN | The institution's credit policy | 7 years, R | Confidential | Fetched (ID-06), or uploaded |
| DT-05 | Sanctions and PEP screening results, and the decision on any match | POCAML Act; CBK lender regulations reg 64 | 7 years, R | Confidential | Generated (financial-crime FC-05) |
| DT-06 | Updated contact details | CBK lender regulations reg 45(a): refreshed at least every two years | 7 years, R | Confidential | Any channel, logged |

### Knowing the customer: businesses

| Id | Document | Required by | Keep for | Class | Arrives by |
|---|---|---|---|---|---|
| DT-07 | Registration: status, directors and shareholders (the content of a CR12); the certificate where the lender asks for it | POCAML Regs reg 42(2) | 7 years, R | Confidential | Fetched from the business registry (ID-07); the certificate uploaded |
| DT-08 | Constitution: memorandum and articles, or partnership deed | POCAML Regs reg 42(2) | 7 years, R | Confidential | Upload link, from the SME's Odoo (ID-16) |
| DT-09 | Resolution to borrow, and the list of authorised signatories | Authority to act for the company | 7 years, R | Confidential | From the SME's Odoo (BS-18, ID-16), upload link |
| DT-10 | Directors' and beneficial owners' IDs and declarations | POCAML Regs reg 42(2) | 7 years, R | Restricted | As DT-01; beneficial owners declared |
| DT-11 | Tax compliance certificate | Credit policy; it expires after a year | 7 years, R; re-checked on expiry (ID-03) | Confidential | Fetched (ID-06) |
| DT-12 | Business permits and sector licences | Credit policy | 7 years, R; re-checked on expiry | Internal | Upload; licences checked against regulators' lists (ID-18) |

### The loan

| Id | Document | Required by | Keep for | Class | Arrives by |
|---|---|---|---|---|---|
| DT-13 | Application, appraisal, assessed limit and any override with its reason | CBK lender regulations reg 28; POCAML Regs reg 42(1) | 7 years, T | Confidential | Generated (MF-01, MF-06) |
| DT-14 | Bank and M-Pesa statements used for appraisal | POCAML Regs reg 42(2) | 7 years, T | Confidential | From source (ID-18), or uploaded |
| DT-15 | Credit bureau report, and the consent to obtain it | CRB Regulations 2020 | 7 years, T (proposed) | Confidential | Fetched (crb) |
| DT-16 | Key information document, as offered | CBK lender regulations regs 48, 59 | 7 years, T | Confidential | Generated (MF-34) |
| DT-17 | Loan agreement, signed, with its signing certificate | POCAML Regs reg 42(1); Kenya Information and Communications Act s.83H (electronic retention) | 7 years, T; 12 years from default if a secured loan was written off or went to recovery (Limitation of Actions Act s.19(1)) | Confidential | Generated and signed (MF-34) |
| DT-18 | Guarantor's consent and signed guarantee | CBK lender regulations reg 42(1), (2) | 7 years, T; 12 years from default for a secured loan written off or in recovery | Confidential | Signed (MF-37) |
| DT-19 | Approval record: the frozen chain and every decision | Credit policy; POCAML Regs reg 42(1) | 7 years, T | Internal | Generated (mandates MD-05) |
| DT-20 | Restructuring request or notice, the new key information document, and acceptance | CBK lender regulations regs 28(3), 55 | 7 years, T | Confidential | Generated (MF-09) |
| DT-21 | Collateral: logbook or title scan, NTSA joint registration, collateral-registry search and registration, valuation, insurance | Movable Property Security Rights Act; credit policy | 7 years after release; 12 years from default if the loan was written off or went to recovery (s.19(1)) | Confidential | Upload, field app (MF-03) |
| DT-22 | The original logbook or title, held physically | Custody until release on settlement | Returned on release; the release record 7 years | Confidential | Custody log (MF-03) |

### Money moving, and what the customer is told

| Id | Document | Required by | Keep for | Class | Arrives by |
|---|---|---|---|---|---|
| DT-23 | Disbursement and repayment records, and the receipts sent | POCAML Regs reg 42(1); CBK lender regulations reg 39(1)(a); NPS Regulations 2014 reg 29(1)(b) for a payment service provider | 7 years, T; 12 years from default for a secured loan written off or in recovery | Confidential | Generated (MF-10, MF-11, MF-38) |
| DT-24 | Statements issued to borrowers and to guarantors | CBK lender regulations reg 39(1), (3) | 7 years, T | Confidential | Generated, shared by link (MF-38, ID-17) |
| DT-25 | Notices: collection, the 14-day notice to a guarantor, notice before a bureau listing | CBK lender regulations regs 33, 42(4); CRB Regulations 2020 reg 67(2): at least 7 years | 7 years, D | Confidential | Generated (MF-26, MF-27, MF-37) |
| DT-26 | Complaints and their handling | CBK lender regulations reg 40(6) keeps the record; no period stated. For Saccos, SASRA's model policy: acknowledge in three working days, resolve in 21 calendar days | 7 years, D (proposed) | Confidential | Service desk (MF-28) |
| DT-27 | Price changes: CBK's approval, the notice to customers and their acceptance | CBK lender regulations reg 55 | 7 years after the product version is retired | Internal; acceptances Confidential | Generated (MF-24) |

### Anti-money laundering

| Id | Document | Required by | Keep for | Class | Arrives by |
|---|---|---|---|---|---|
| DT-28 | Findings on complex or unusual transactions, and reports to the Financial Reporting Centre | POCAML Act s.44(5): at least 7 years; s.46 | 7 years, D | Restricted: the reporting officer only, so the customer is never tipped off | Generated (financial-crime) |
| DT-29 | Information that travels with a cross-border wire transfer | POCAML Regs reg 32 | 7 years, T | Confidential | Rails |

### The institution itself

| Id | Document | Required by | Keep for | Class | Home |
|---|---|---|---|---|---|
| DT-30 | Licence or registration, and CBK's or SASRA's letters | The institution's licence conditions | For the life of the institution (proposed) | Internal | Odoo |
| DT-31 | Credit policy, AML policy and other policies, with each version | CBK lender regulations reg 25; POCAML Act | 7 years after a version is replaced (proposed) | Internal | Odoo |
| DT-32 | Board and committee minutes | Governance | For the life of the institution (proposed) | Internal; Confidential where they name customers | Vault where they name customers, Odoo otherwise |
| DT-33 | Regulatory returns and correspondence | CBK and SASRA reporting | 7 years, D (proposed) | Internal | Odoo |
| DT-34 | Outsourcing agreements, CBK's approval or notice, and the exit plan | CBK lender regulations reg 31 | Term of the agreement and 7 years (proposed) | Internal | Odoo (no personal data) |
| DT-35 | Audit reports and the annual AML compliance report | POCAML Regs regs 43, 44; microfinance banks: internal audit reports and working papers at least 5 years (reg 40(4)) | 7 years, D (proposed) | Internal | Odoo |
| DT-36 | Consents and their withdrawal: data processing, WhatsApp, marketing, sharing with an employer or a funder | Data Protection Act s.32 (the controller must prove consent) | As long as the processing, then 7 years, R (proposed) | Confidential | Generated (messaging MS-11) |
| DT-37 | Staff contracts and written particulars | Employment Act s.10(6): 5 years after employment ends; s.79 register | 5 years, E | Confidential | Vault (FS-527) |
| DT-38 | An employee's written request for a check-off deduction | Employment Act s.19(1)(g) | 5 years after the deduction ends (proposed) | Confidential | The employer's Odoo (BS-14) |
| DT-39 | Accounting and tax records: books, invoices, tax returns | Tax Procedures Act s.23(1)(c): five years from the end of the reporting period | 7 years, D (covers it) | Internal | Odoo |

## What else was read (FS-538)

- **Tax Procedures Act** (LR-31): five years for tax records, inside
  seven.
- **Limitation of Actions Act** (LR-32): six years on a contract, inside
  seven; **twelve on a secured principal or a judgment**, which is why
  a secured loan that defaulted keeps its evidence for twelve years.
- **CBK** (CBK/PG/08 §5.17) and the **microfinance bank regulations**
  (LR-33): seven years, as POCAML; internal audit papers five.
- **SASRA:** its AML guidelines (2024) set seven years, e-KYC records
  included; its model complaints policy (2025) sets timelines but no
  period; the Sacco Societies Act and both sets of regulations set none.
- **The joint Financial Consumer Protection Framework** is a draft
  (March 2026): regulators may prescribe retention later. To watch.

Regulators' guidelines are listed in docs/regulation.md.
