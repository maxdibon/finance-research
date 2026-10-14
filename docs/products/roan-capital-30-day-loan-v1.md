---
id: roan-capital-30-day-loan-v1
name: Roan Capital — 30-day loan, product version 1 (draft)
kind: product-version
version: 0.2.0
owner: Delivery lead
classification: Internal
review_ids: [FS-800, FS-801, FS-802, FS-806, FS-807, FS-814, FS-815, FS-816, FS-817]
last_reviewed: 2026-10-14
---

# Roan Capital · 30-day loan · product version 1 · draft

    product:   30-day loan
    version:   1 (draft, not submitted)
    drafted:   2026-10-14, by Dibon, for Roan Capital's product owner
    status:    draft: every Ask below answered before it can be submitted
    source:    Roan Capital's requirement document; delivery map RC-26,
               RC-27, RC-30; lender-rules §2.4 (the vocabulary), §2.9

In git and the reader by exception, until Roan Capital's workspace in
Dibon's Odoo Documents exists (rules, Dibon 10; FS-806): it holds no
personal data. On approval it is stored, signed, in lender rules' store in
Roan Capital's instance; this file is only the working draft.

**How to read it** (FS-816, FS-817). Each item has an **Id**, which is
also its form field's tag in the questionnaires. **Source** is where the
value came from: the requirement document, the prototype, the
regulations, Dibon's proposal, or none yet; an answer read back from a
questionnaire becomes "Roan Capital, [date]". **Ask** is what we need:
**Confirm** a value we have, **Choose** one of the options given,
**Provide** a fact we do not have, or **Decide** a policy; "—" means
nothing to answer (the regulations', or our plan). Why each term matters is
in the vocabulary (lender-rules §2.4).

**The questionnaires** are built from these tables, one Word document per
group, with a form field per item; the answers are read back by script
into these tables, never retyped: tools/products/questionnaires.js
builds them, tools/products/read-back.js reads a returned one, until the
back office's product form replaces both (lender-rules §2.4). Returned
documents are client material: kept in clients/, never in git.

**A · Product terms** (published once approved):

| Id | Term | Value | Source | Ask |
|---|---|---|---|---|
| A1 | Amount limits | Minimum KES 3,000; maximum KES 100,000 | The prototype (open answer 29) | Confirm |
| A2 | Term | 30 days; the prototype also offers 14 days | The requirement document; the 14 days, the prototype | Choose: 30 days only / 30 and 14 days, as two terms of this product / 14 days as a product of its own |
| A3 | Repayment frequency | Daily, the first instalment the day after disbursement (KES 13,000 over 30 days: KES 434 a day, the last smaller) | The prototype; first assumed once at maturity | Choose: Daily / Weekly / Once at maturity |
| A4 | Interest method | Flat, on the principal | The prototype | Confirm |
| A5 | Interest rate and its unit | 1% a day (KES 3,000 on KES 10,000 over 30 days); CBK's approval of the pricing (reg 55) to record | The prototype (open answer 4) | Confirm |
| A6 | Fees | Membership, KES 100, once per client; application, KES 500 (KES 3,000 to 19,999) or KES 1,000 (KES 20,000 to 100,000); both paid upfront on the first loan, non-refundable; remittance, KES 120; chattels mortgage, KES 500 (KES 5,001 to 9,999) or KES 1,000 (KES 10,000 to 100,000); deducted at disbursement | The prototype | Confirm |
| A7 | Insurance | "LIF", KES 200, deducted at disbursement: what it covers, and whether it is a fee or a third party's cost (LQ-03) | The prototype | Provide |
| A8 | Default interest | 1% a day, on overdue daily instalments | The prototype (open answer 3) | Confirm |
| A9 | Default period | Reg 57's 30 days past due, or shorter if the agreement says so; non-performing on day 61 if 30 | The regulations (lender-rules open question 7) | Choose: 30 days / Shorter (give the days) |
| A10 | Collection ladder | Reminder day 25; default run days 30 to 40; final warning days 40 to 47; closure day 47 | The requirement document (RC-27) | Confirm |
| A11 | Holiday rule | A due date that falls on a holiday | None yet (OB-COM-20) | Choose: Moves to the next working day / Stays |
| A12 | Rounding | KES, to 2 decimal places; daily instalments rounded up to the shilling, the last instalment the remainder | The prototype | Confirm |
| A13 | Early repayment | Interest only to the repayment date; never a minimum (the prototype's 14 days is not carried over: LQ-13) | The regulations (reg 56(3), (4)) | — |
| A14 | Rate type | Fixed | The prototype | Confirm |
| A15 | Rate by risk class | One rate for every borrower | The prototype; the requirement document scores borrowers (RC-11) | Choose: One rate for every borrower / A rate by risk class (give the range) |
| A16 | Interest basis | Flat on the principal, by days: 1% × principal × days in the term | The prototype | Confirm |
| A17 | Tax on fees | Excise duty at 20% on each fee, not on interest or the insurance premium; how it applies to Roan Capital, with counsel (LQ-14) | The Excise Duty Act; not in the prototype | — |
| A18 | Who pays the rail's charges | M-Pesa's charges on repayments and payouts | None yet | Choose: The borrower / Roan Capital |
| A19 | Third-party costs | The chattels mortgage fee | The prototype | Choose: Roan Capital's own fee / The collateral registry's charge, passed on at cost |
| A20 | Grace | Days after an instalment falls due before default interest starts | None yet | Provide |
| A21 | Collateral | Chattels, under a chattels mortgage; vehicles by logbook (RC-08): the types, and the loan-to-value | The prototype; the requirement document | Provide |
| A22 | Guarantors | One per loan: the guarantor's limit (open answer 16) | The prototype | Provide |
| A23 | Restructuring | Whether, and on what terms, a borrower in difficulty can have new terms (open answer 10) | None yet | Decide |
| A24 | Statements | How often, to the borrower and the guarantor (reg 47(2)) | None yet | Decide |
| A25 | Languages | English; Swahili | Dibon's proposal | Choose: English only / English and Swahili |

**B · Eligibility and limits** (Roan Capital's credit policy; thresholds
internal):

| Id | Rule | Value | Source | Ask |
|---|---|---|---|---|
| B1 | Who may borrow | Individuals and businesses, with the documents RC-01 lists | The requirement document (open answers 17 to 19) | Confirm |
| B2 | Affordability | Assessed from bank and M-Pesa statements (RC-05): the rule | The requirement document (open answer 13) | Decide |
| B3 | Limits by KYC tier | The largest loan at each tier (OB-MF-06) | None yet | Decide |
| B4 | First loan and limit growth | The prototype marks a "first loan": its cap, and how the limit grows | The prototype | Decide |
| B5 | Exposure | Loans one borrower may hold at once; whether top-ups are allowed | None yet | Decide |
| B6 | Bureau | A credit report before lending (open answer 12) | None yet | Choose: On every application / On the first loan only / Not checked |

**C · How it runs** (linked configuration, never published):

| Id | Setting | Value | Source | Ask |
|---|---|---|---|---|
| C1 | Approval chain | Credit Manager, Head Office, CEO (the prototype), or the committee chain (RC-12) | The prototype; the requirement document (open answer 28) | Choose: Credit Manager, Head Office, CEO / Credit Officer, the credit committee, the Head Office Committee above a threshold |
| C2 | Documents | RC-01's checklist | The requirement document (open answers 14, 17 to 21) | Confirm |
| C3 | Disbursement | M-Pesa, and NCBA by bank transfer (RC-18) | The requirement document (open answer 6) | Confirm |
| C4 | Cut-off | No payout released 23:00 to 04:00 (RC-21) | The requirement document | Confirm |
| C5 | Purposes | The list a borrower chooses from (the prototype asks for a purpose) | The prototype | Provide |
| C6 | Bureau reporting | Not in R1 (crb, phase 2) | Dibon's plan | — |

**Not terms, and so not here:** the repayment order (reg 56) and the cap
on a non-performing loan (reg 29) are the regulations'; any reading not
yet settled is in the interpretation record (recon §3.1.3).

**Before submission** the back office's form will preview, for a sample
loan: the schedule, the APR and total cost of credit, the key information
document, and the companion's own figures. Then two of Roan Capital's
people approve it; CBK's letter is recorded where reg 55 requires it; and
it is activated from its effective date, for new loans only.
