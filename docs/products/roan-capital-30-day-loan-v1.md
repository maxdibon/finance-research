---
id: roan-capital-30-day-loan-v1
name: Roan Capital — 30-day loan, product version 1 (draft)
kind: product-version
version: 0.1.0
owner: Delivery lead
classification: Internal
review_ids: [FS-800, FS-801, FS-802, FS-806, FS-807]
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
| Amount limits | Minimum KES 3,000; maximum KES 100,000 | **The prototype's,** to confirm (open answer 29) |
| Term | 30 days (the prototype also offers 14 days: a second term of this product, or a product of its own) | The requirement document; the 14-day term **to confirm** |
| Repayment frequency | **Daily**, the first instalment the day after disbursement (KES 13,000 over 30 days: KES 434 a day, the last smaller) | **The prototype's,** to confirm; not once at maturity, as first assumed |
| Interest method | Flat, on the principal | **The prototype's,** to confirm |
| Interest rate and its unit | 1% a day (KES 3,000 on KES 10,000 over 30 days) | **The prototype's,** answering open answer 4 if Roan Capital confirms; CBK's approval of the pricing (reg 55) to record |
| Fees | Membership, KES 100, once per client; application, KES 500 (KES 3,000 to 19,999) or KES 1,000 (KES 20,000 to 100,000); both paid upfront on the first loan, non-refundable; remittance, KES 120; chattels mortgage, KES 500 (KES 5,001 to 9,999) or KES 1,000 (KES 10,000 to 100,000); deducted at disbursement | **The prototype's,** to confirm |
| Insurance | "LIF", KES 200, deducted at disbursement | **The prototype's;** to confirm what it is, and whether it is a fee or a third party's cost (LQ-03) |
| Default interest | 1% a day, on overdue daily instalments | **The prototype's,** answering open answer 3 if Roan Capital confirms |
| Default period | ____ days past due (reg 57's 30 days, or shorter if the agreement says so) | **Blank:** lender-rules open question 7; non-performing on day 61 if 30 |
| Collection ladder | Reminder day 25; default run days 30 to 40; final warning days 40 to 47; closure day 47 | From the requirement document (RC-27) |
| Holiday rule | A due date on a holiday: moves to the next working day / stays | **Blank:** Roan Capital's credit policy (OB-COM-20) |
| Rounding | KES, to 2 decimal places; daily instalments rounded up to the shilling, the last instalment the remainder (the prototype) | To confirm |
| Early repayment | Interest only to the repayment date; never a minimum (the prototype's 14 days is not carried over: reg 56(3), (4); LQ-13) | The regulation's |

**Not terms, and so not here:** the repayment order (reg 56) and the cap
on a non-performing loan (reg 29) are the regulations'; any reading not
yet settled is in the interpretation record (recon §3.1.3).

**Before submission** the back office's form will preview, for a sample
loan: the schedule, the APR and total cost of credit, the key information
document, and the companion's own figures. Then two of Roan Capital's
people approve it; CBK's letter is recorded where reg 55 requires it; and
it is activated from its effective date, for new loans only.
