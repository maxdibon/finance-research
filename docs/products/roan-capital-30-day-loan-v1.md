---
id: roan-capital-30-day-loan-v1
name: Roan Capital — 30-day loan, product version 1 (draft)
kind: product-version
version: 0.1.0
owner: Delivery lead
classification: Internal
review_ids: [FS-800, FS-801, FS-802, FS-806]
last_reviewed: 2026-10-14
---

# Roan Capital · 30-day loan · product version 1 · draft

    product:   30-day loan
    version:   1 (draft, not submitted)
    drafted:   2026-10-14, by Dibon, for Roan Capital's product owner
    status:    draft: blanks below must be filled before it can be submitted
    source:    Roan Capital's requirement document; delivery map RC-26,
               RC-27, RC-30; lender-rules §2.4 (the vocabulary), §2.9

In git and the reader by exception, until Roan Capital's workspace in
Dibon's Odoo Documents exists (rules, Dibon 10; FS-806): it holds no
personal data. On approval it is stored, signed, in lender rules' store in
Roan Capital's instance; this file is only the working draft.

| Term | Value | Status |
|---|---|---|
| Amount limits | Minimum KES ____ ; maximum KES ____ | **Blank:** Roan Capital to give (RC-30) |
| Term | 30 days | From the requirement document |
| Repayment frequency | Once, at maturity (day 30 from the disbursement's value date) | From the requirement document; to confirm |
| Interest method | Flat, for the term | **To confirm** (the worked example in lender-rules §2.9 assumes it) |
| Interest rate and its unit | ____ % per ____ (the calculator's range is 1% to 50%) | **Blank: open answer 4**, the rate's unit |
| Fees | Processing fee: ____ (fixed KES, or % of principal), taken at disbursement / added to the schedule | **Blank:** Roan Capital to give |
| Insurance | ____ : a fee, or a third party's cost passed on at cost (reg 59(2)(f)) | **Blank:** Roan Capital to give; decides whether it is in the APR (LQ-03) |
| Default interest | 1% a day, from day 31 (the first day past due), on ____ | **Blank: open answer 3**, the base (principal outstanding, or the overdue amount) |
| Default period | ____ days past due (reg 57's 30 days, or shorter if the agreement says so) | **Blank:** lender-rules open question 7; non-performing on day 61 if 30 |
| Collection ladder | Reminder day 25; default run days 30 to 40; final warning days 40 to 47; closure day 47 | From the requirement document (RC-27) |
| Holiday rule | A due date on a holiday: moves to the next working day / stays | **Blank:** Roan Capital's credit policy (OB-COM-20) |
| Rounding | KES, to ____ decimal places, rounding ____ (half up, or half to even) | **Blank:** proposed: 2 places, half up |

**Not terms, and so not here:** the repayment order (reg 56) and the cap
on a non-performing loan (reg 29) are the regulations'; any reading not
yet settled is in the interpretation record (recon §3.1.3).

**Before submission** the back office's form will preview, for a sample
loan: the schedule, the APR and total cost of credit, the key information
document, and the companion's own figures. Then two of Roan Capital's
people approve it; CBK's letter is recorded where reg 55 requires it; and
it is activated from its effective date, for new loans only.
