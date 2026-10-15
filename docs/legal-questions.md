---
id: legal-questions
name: Legal questions — what we need counsel to answer, and what each answer changes
kind: register
status: living
released: 2026.10.15
owner: Compliance and risk officer
classification: Internal
review_ids: [FS-400, FS-624, FS-673, FS-740, FS-742, FS-744, FS-762, FS-807, FS-814, FS-830]
last_reviewed: 2026-10-15
---

# Legal questions

**What this tracks:** every question we need a lawyer to answer, where it
came from, whose it is, and, once answered, what the answer changed in the
design (FS-742). A document that raises a question cites its LQ id here
instead of holding the question itself, so nothing is asked twice or
lost.

**Rules for this file:**

1. **Whose question it is** decides who pays for the answer: *Dibon* for
   our own position and our design; *Institutions* where the answer
   binds every lender we serve, which Dibon asks once and shares; *an
   institution* by name only where it is that institution's alone, and
   then it goes to its own counsel through its delivery map.
2. **Questions for an institution, not a lawyer,** stay in its delivery
   map's open answers (docs/customers/).
3. **Status:** *Open* (not yet asked), *With counsel* (asked, with the
   date), *Answered* (with the date and the answer's source).
4. **An answer is applied before the row closes:** the design changed,
   or confirmed, with the register row that did it.

**Counsel:** none engaged yet. Bowmans Kenya is the first choice
(partners PT-43, decision SD-12); the approach is drafted
(outreach/legal-partner-request.md).

## The register

| Id | Question | Raised in | Whose | Law | Status | Designed meanwhile | Refs |
|---|---|---|---|---|---|---|---|
| LQ-01 | Do fees and penalties count within the cap on interest owed on a non-performing loan, and does "outstanding principal amount" mean principal when the loan became non-performing, or principal now? | lender-rules §9 | Institutions | CBK lender regulations reg 29 (LR-03) | Open | Yes, they count; principal at non-performance | FS-400 |
| LQ-02 | On a rollover or restructure of a non-performing loan, does the cap carry over? | lender-rules §9 | Institutions | Reg 29 (LR-03) | Open | Yes, it carries over | FS-400 |
| LQ-03 | Is the effective annual rate acceptable to CBK as the APR, and is mandatory insurance a third-party cost? | lender-rules §9 | Institutions | Reg 59 (LR-03) | Open | The effective annual rate; insurance as a third-party cost | FS-400 |
| LQ-04 | Is a loan non-performing "after thirty days" counted from the due date? | lender-rules §9 | Institutions | Reg 57 (LR-03) | Open | Counted from the due date | FS-400 |
| LQ-05 | Are 08:00 to 18:00, Monday to Saturday, the "working hours" within which a borrower may be contacted about collection? | lender-rules §9 | Institutions | Reg 30 (LR-03) | Open | Those hours, held by quiet hours (MS-15) | FS-400 |
| LQ-06 | Does reg 54(7)'s thirty days' notice apply when the borrower asks for the restructure, delaying relief to a borrower in distress? | JN-06 §4 | Institutions | Reg 54(7) (LR-03) | Open | The design waits the thirty days | FS-624 |
| LQ-07 | Must a guarantor consent to a restructure that raises or extends their exposure, and what happens to the guarantee if they will not? | JN-06 §4 | Institutions | Reg 42 (LR-03); the law of guarantees | Open | Consent asked; the restructure held without it | FS-624 |
| LQ-08 | Is an unplaced payment that cannot be returned held "in a fiduciary capacity" (abandoned after two years) or as a "credit memo" (five years)? Do the Act's regulations add anything? | JN-16 §5 | Institutions | Unclaimed Financial Assets Act ss.13, 14 (LR-38) | Open | Kept in suspense, reported in the morning report; the payer written to before any report | FS-673 |
| LQ-09 | Which of Dibon's services need CBK authorisation as a payment service provider today, and which would under the 2026 Bill? | compliance LC-06 | Dibon | National Payment System Act s.2; the NPS Bill, 2026 | Open | Money never passes through Dibon; we apply for our own authorisation (FS-031) | FS-031, FS-376 |
| LQ-10 | May a lender send borrowers reminders and offers on WhatsApp, under Meta's commerce rules for financial services and the lender regulations' contact rules? | FS-165 | Institutions | Reg 30 (LR-03); Meta's business policy | Open | WhatsApp left out of R1 until answered (FS-674); notices and links only | FS-165, FS-737 |
| LQ-11 | In the NDA with an institution: should the indemnity be capped, and should disputes go to arbitration rather than the courts? | The NDA's internal note (clients/, out of git) | Dibon | Contract | Open | Uncapped; the courts of Kenya | FS-740 |
| LQ-12 | May an identity vendor supply credit-bureau reports, under its own bureau subscription, to a lender through our platform; and may it resell national-register lookups under its own access agreement? | partners PT-53 (FS-762) | Institutions | CRB Regulations 2020 reg 2 (LR-06); the register's access terms; Data Protection Act s.25 | Open | Bureau reports only through the institution's own subscription (crb CR-01); register lookups through our own connection (PT-29), or a vendor that shows its access agreement (FS-202) | FS-202, FS-447, FS-762 |
| LQ-13 | May a lender charge a minimum number of days' interest when a loan is repaid early (the prototype's 14 days), given reg 56(3) and (4): early repayment without penalty, and no interest for the remaining term? | FS-807 | Institutions | CBK lender regulations reg 56 (LR-03) | Open | No: the vocabulary cannot express it, and interest is charged only to the repayment date | FS-807 |
| LQ-14 | Do a non-deposit-taking lender's fees attract excise duty at 20%, as fees of a digital lender or of a financial institution under the Excise Duty Act; and must the duty be shown on top of each fee in the key information document? | lender-rules §2.4 (FS-814) | Institutions | Excise Duty Act, First Schedule, Part II, paragraphs 4 and 6 | Open | Yes: 20% on every fee, never on interest or insurance premiums, shown with each fee and in the total cost of credit | FS-814 |
| LQ-15 | What is the "cooling off period" a credit policy must state (reg 25(2)(f)): a time after signing in which a borrower may withdraw without charge, a wait before a new loan, or either as the lender defines it; and does the Consumer Protection Act, which reg 25(1) names, set one? | lender-rules §2.4 (FS-830) | Institutions | CBK NDTCP Regulations 2026 reg 25(2)(f) (LR-03); Consumer Protection Act (not yet in the law register) | Open | The lender defines it in its credit policy; we ask each institution which it means and how long | FS-830 |
