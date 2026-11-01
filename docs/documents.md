---
id: documents
name: Document catalogue — what an institution keeps, why, and for how long
kind: register
status: living
law: mixed
released: 2026.10.16
owner: Compliance and risk officer
classification: Internal
review_ids: [FS-063, FS-527, FS-532, FS-537, FS-538, FS-591, FS-1024, FS-1073]
last_reviewed: 2026-11-01
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

Clock: **R** from the end of the relationship (nothing live for the period the institution set at onboarding, OB-COM-26; lending-service rule 9, FS-1073), **T** from the transaction
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
| DT-13 | Application, appraisal, assessed limit and any override with its reason; the decision record behind the appraisal: metrics, scores, risk class, reasons and the model version (decisioning DE-01, FS-582) | CBK lender regulations reg 28; POCAML Regs reg 42(1) | 7 years, T | Confidential | Generated (MF-01, MF-06) |
| DT-14 | Bank and M-Pesa statements used for appraisal | POCAML Regs reg 42(2) | 7 years, T | Confidential | From source (ID-18), or uploaded |
| DT-15 | Credit bureau report, and the consent to obtain it | CRB Regulations 2020 | 7 years, T (proposed) | Confidential | Fetched (crb) |
| DT-16 | Key information document, as offered | CBK lender regulations regs 48, 59 | 7 years, T | Confidential | Generated (MF-34) |
| DT-17 | Loan agreement, signed, with its signing certificate | POCAML Regs reg 42(1); Kenya Information and Communications Act s.83H (electronic retention) | 7 years, T; 12 years from default if a secured loan was written off or went to recovery (Limitation of Actions Act s.19(1)) | Confidential | Generated and signed (MF-34) |
| DT-18 | Guarantor's consent and signed guarantee | CBK lender regulations reg 42(1), (2) | 7 years, T; 12 years from default for a secured loan written off or in recovery | Confidential | Signed (MF-37) |
| DT-19 | Approval record: the frozen chain and every decision | Credit policy; POCAML Regs reg 42(1) | 7 years, T | Internal | Generated (mandates MD-05) |
| DT-20 | Restructuring request or notice, the new key information document, and acceptance | CBK lender regulations regs 28(3), 55 | 7 years, T | Confidential | Generated (MF-09) |
| DT-21 | Collateral: logbook or title scan, NTSA joint registration, collateral-registry search and registration, valuation, insurance | Movable Property Security Rights Act; credit policy | 7 years after release; 12 years from default if the loan was written off or went to recovery (Limitation of Actions Act s.19(1)) | Confidential | Upload, field app (MF-03) |
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
| DT-35 | Audit reports and the annual AML compliance report | POCAML Regs regs 43, 44; microfinance banks: internal audit reports and working papers at least 5 years (microfinance bank regulations reg 40(4)) | 7 years, D (proposed) | Internal | Odoo |
| DT-36 | Consents and their withdrawal: data processing, WhatsApp, marketing, sharing with an employer or a funder | Data Protection Act s.32 (the controller must prove consent) | As long as the processing, then 7 years, R (proposed) | Confidential | Generated (messaging MS-11) |
| DT-37 | Staff contracts and written particulars | Employment Act s.10(6): 5 years after employment ends; s.79 register | 5 years, E | Confidential | Vault (FS-527) |
| DT-38 | An employee's written request for a check-off deduction | Employment Act s.19(1)(g) | 5 years after the deduction ends (proposed) | Confidential | The employer's Odoo (BS-14) |
| DT-39 | Accounting and tax records: books, invoices, tax returns | Tax Procedures Act s.23(1)(c): five years from the end of the reporting period | 7 years, D (covers it) | Internal | Odoo |
| DT-40 | Directors' consent to, or notice of, the registry, bureau and sanctions checks made on them (onboarding pack B4; LQ-26) | Data Protection Act s.32; POCAML Regs reg 42(2) | 7 years, R | Confidential | Vault |
| DT-41 | A partner agreement, signed (onboarding pack P1) | The partnership; MF-41 | Term of the agreement and 7 years (proposed) | Confidential | Vault; the contract record in Odoo |
| DT-42 | A data-sharing agreement with a partner, signed (onboarding pack P2) | Data Protection Act; MF-42 | Term of the agreement and 7 years (proposed) | Confidential | Vault; the contract record in Odoo |
| DT-43 | A letter naming a partner's administrators, and each change to it (onboarding pack P3) | Authority to act for the partner; ID-25 | While a partner, and 7 years (proposed) | Confidential | Vault |

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

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 25 | reg 25 | A written credit policy, consistent with the law, stating among other things the cooling-off period (25(2)(f)) and how the borrower's ability to repay is determined (25(2)(s)) |
| reg 28 | reg 28, reg 28(3) | Applications considered under the credit policy, ability to repay assessed and no reckless lending (28(1)); a refusal given at once, with reasons (28(2)); a loan may be restructured on the borrower's request or with prior notice (28(3)) |
| reg 31 | reg 31 | Material services may be outsourced, but never the final decision to lend, management and control, the board's decisions, determining compliance with the law (31(1)(d)), or managing the loan book; the lender stays liable for its provider; the Central Bank told thirty days before, with the provider's background, owners and directors (31(3)); the contract gives the Central Bank oversight of, and access to, the provider's premises, books, records, systems and staff (31(5)) |
| reg 33 | reg 33 | Customers' credit information shared with licensed credit reference bureaus, timely, complete and accurate; no negative listing for an amount of one thousand shillings or less (33(3)) |
| reg 39 | reg 39(1), reg 39(1)(a), reg 39(3) | A receipt for every transaction, a free loan statement on request and a way to see it at any time (39(1)); errors corrected promptly (39(2)); a guarantor kept informed through periodic statements (39(3)) |
| reg 40 | reg 40(6) | A complaints mechanism made known to customers; acknowledgement within seven days where a complaint cannot be dealt with promptly; an oral complaint unresolved after forty-eight hours confirmed in writing; resolution within thirty days |
| reg 42 | reg 42(1), reg 42(2), reg 42(4) | A guarantor's consent sought and obtained before the appointment; recourse to a guarantor only after non-judicial recovery from the borrower is exhausted, and after fourteen days' notice of the default |
| reg 45 | reg 45(a) | Customers' personal and contact records updated from time to time, and at least every two years (45(a)); reliable services, channels and customer-facing staff |
| reg 48 | reg 48 | A key information document for each product: its benefits, risks, terms and conditions, in summary |
| reg 55 | reg 55 | Pricing parameters and credit terms change only with the Central Bank's prior written approval, after thirty days' notice to the customer and the customer's acceptance |
| reg 59 | reg 59 | A pricing model with clear parameters: its components and costs justified, rates that may vary with the borrower's creditworthiness (59(2)(c)), the criteria for non-performance, credit bureau scores, all-inclusive pricing except third-party costs (59(2)(f)), and the APR disclosed |
| reg 64 | reg 64 | Compliance with the Proceeds of Crime and Anti-Money Laundering Act and the Prevention of Terrorism Act, on pain of the Central Bank's penalties |

**[LR-06](law/LR-06.md) The Banking (Credit Reference Bureau) Regulations, 2020, Legal Notice No. 55 of 2020.** Regulator: Central Bank of Kenya. Made under: The Banking Act (Cap. 488), with the Microfinance Act and the Central Bank of Kenya Act. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2020/55/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 67 | reg 67(2) | A notice to a customer served by registered post, email, text message to the registered number, or delivery against acknowledgement; a record of every notice served kept for at least seven years (67(2)) |

**[LR-12](law/LR-12.md) The National Payment System Regulations, 2014, Legal Notice No. 109 of 2014.** Regulator: Central Bank of Kenya. Made under: The National Payment System Act (Cap. 491A). In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2014/109/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 29 | reg 29(1)(b) | A payment service provider keeps an accurate, fully accessible audit trail of every transaction, and records of every electronic transfer for at least seven years (29(1)(b)); monthly returns to the Central Bank |

**[LR-13](law/LR-13.md) The Proceeds of Crime and Anti-Money Laundering Act (Cap. 59A).** Regulator: The Financial Reporting Centre, with each institution's supervisor. Made under: An Act of Parliament. In force: Yes. Version read: as at 2025-11-04, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2009/9/eng@2025-11-04).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 44 | s. 44(5) | Complex, unusual, suspicious or large transactions monitored and suspicions reported to the Centre; the findings kept for at least seven years and made available to the Centre, the supervisor and auditors (44(5)); cash transactions above the prescribed amount reported in all cases |
| s. 46 | s. 46, s. 46(4) | A reporting institution keeps records of every transaction and of the evidence of each customer's identity, in the account holder's correct name, for at least seven years from the transaction or the end of the relationship, or longer where the Centre asks (46(4)) |

**[LR-14](law/LR-14.md) The Proceeds of Crime and Anti-Money Laundering Regulations, 2023, Legal Notice No. 153 of 2023.** Regulator: The Financial Reporting Centre, with each institution's supervisor. Made under: The Proceeds of Crime and Anti-Money Laundering Act (Cap. 59A). In force: Yes. Version read: as at 2023-11-17, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2023/153/eng@2023-11-17).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 32 | reg 32 | Every wire transfer carries the originator's name, account or reference and address or ID, and the beneficiary's name and account or reference; intermediary and receiving institutions have risk-based rules for a transfer lacking them, to execute, reject or suspend it (32(6)); no transfer to or from a person designated under the UN Security Council's terrorism resolutions (32(8)) |
| reg 42 | reg 42(1), reg 42(2) | Records of every transaction kept for at least seven years from its completion or the end of the relationship (42(1)); and the due-diligence records, copies of official documents, account files and correspondence, for the same period (42(2)) |
| reg 43 | reg 43 | An independent audit function checks the institution's compliance with the Act and these Regulations |
| reg 44 | reg 44 | An annual compliance report to the Centre by 31 January, on the Act, the Regulations and the institution's own rules |

**[LR-17](law/LR-17.md) The Data Protection Act (Cap. 411C).** Regulator: Office of the Data Protection Commissioner. Made under: An Act of Parliament. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2019/24/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 32 | s. 32 | Whoever relies on consent proves it was given for the purpose; consent can be withdrawn at any time; it is not freely given where a service is made to depend on consent to processing it does not need |
| s. 39 | s. 39 | Personal data kept only as long as needed for its purpose, unless the law, a lawful purpose or the person's consent requires longer; then deleted, erased, anonymised or pseudonymised |

**[LR-21](law/LR-21.md) The Kenya Information and Communications Act (Cap. 411A).** Regulator: Communications Authority of Kenya. Made under: An Act of Parliament. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/1998/2/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 83H | s. 83H | Where the law requires records kept for a period, keeping them electronically satisfies it, if they stay accessible, are kept in their original format or one shown to be accurate, and show their origin, destination and dates |

**[LR-30](law/LR-30.md) The Employment Act (Cap. 226).** Regulator: The Ministry responsible for labour; disputes go to the Employment and Labour Relations Court. Made under: An Act of Parliament. In force: Yes. Version read: as at 2024-04-26, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2007/11/eng@2024-04-26).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 10 | s. 10(6) | Written particulars of employment given to each employee, and kept for five years after the employment ends (10(6)) |
| s. 19 | s. 19(1)(g) | Deductions from wages only those the section allows, among them one the employee asks for in writing (19(1)(g)); all deductions together no more than two-thirds of wages (19(3)); a deduction paid over as the law or agreement requires, failing which an offence (19(5)) |
| s. 79 | s. 79 | A register of employees, with each one's name, age, sex, occupation, start date, nationality and education, and an annual return of employees by 31 January |

**[LR-31](law/LR-31.md) The Tax Procedures Act (Cap. 469B).** Regulator: Kenya Revenue Authority. Made under: An Act of Parliament. In force: Yes. Version read: as at 2026-09-01, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2015/29/eng@2026-09-01).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 23 | s. 23(1)(c) | Documents required under a tax law kept in an official language, so tax can be ascertained, for five years from the end of the period they relate to (23(1)(c)) |

**[LR-32](law/LR-32.md) The Limitation of Actions Act (Cap. 22).** Regulator: None: the courts apply it. Made under: An Act of Parliament. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/1968/21/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 4 | s. 4(4) | Claims in contract or tort brought within six years of the cause of action; a claim on a judgment within twelve years of it (4(4)) |
| s. 19 | s. 19(1) | A claim for a principal sum secured by a mortgage of land or movable property, or for the proceeds of selling land, brought within twelve years of the right accruing (19(1)) |

**[LR-33](law/LR-33.md) The Microfinance (Deposit-Taking Microfinance Institutions) Regulations, Legal Notice No. 58 of 2008.** Regulator: Central Bank of Kenya. Made under: The Microfinance Act (Cap. 493C). In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2008/58/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 37 | reg 37 | Customers properly identified, and records of customers, their sources of funds and their transactions kept for at least seven years; the institution satisfied that it deals with real persons and those empowered to act |
| reg 40 | reg 40(4) | An annual internal audit plan; the internal auditors' reports and working papers kept for at least five years (40(4)) |
