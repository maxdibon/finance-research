---
id: legal-questions
name: Legal questions — what we need counsel to answer, and what each answer changes
kind: register
status: living
law: LR-03
released: 2026.10.15
owner: Compliance and risk officer
classification: Internal
review_ids: [FS-400, FS-624, FS-673, FS-740, FS-742, FS-744, FS-762, FS-807, FS-814, FS-830]
last_reviewed: 2026-10-16
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

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 25 | reg 25(1), reg 25(2)(f) | A written credit policy, consistent with the law, stating among other things the cooling-off period (25(2)(f)) and how the borrower's ability to repay is determined (25(2)(s)) |
| reg 29 | reg 29 | What can be recovered on a non-performing loan is capped at the principal then owing, interest up to that principal, and reasonable recovery costs; the cap is measured from the last time the loan became non-performing (29(3)); interest under a court order after the order is outside it (29(4)) |
| reg 30 | reg 30 | No harassing, shaming or threatening collection: nothing posted to shame a borrower (30(1)(d)), no messages to their contacts (30(1)(e)), no calls outside working hours, no taking of essential personal effects (30(1)(k)); no charges not disclosed in the contract (30(2)); land security recovered under the Land Act (30(3)); thirty days' notice before selling movable security (30(4)) |
| reg 42 | reg 42 | A guarantor's consent sought and obtained before the appointment; recourse to a guarantor only after non-judicial recovery from the borrower is exhausted, and after fourteen days' notice of the default |
| reg 54 | reg 54(7) | At signing, the customer receives the agreement, the repayment schedule and the total cost of credit; the agreement states the loan, charges, rates, the APR, early repayment without charge (54(4)(h)) and more (54(4)); a variation needs thirty days' notice and the borrower's acceptance (54(7)) |
| reg 56 | reg 56, reg 56(3), reg 56(4) | A repayment credited on the day it is paid, applied to due principal, then fees and charges, then interest; early repayment, in whole or part, without notice or penalty (56(3)), and no interest for the remaining term on full early repayment (56(4)) |
| reg 57 | reg 57 | A loan is non-performing when principal or interest is outstanding thirty days past due, for a loan of thirty days or less, or ninety days, for a longer one (57(1)); the credit policy (57(2)) and each loan agreement (57(3)) state the default period |
| reg 59 | reg 59 | A pricing model with clear parameters: its components and costs justified, rates that may vary with the borrower's creditworthiness (59(2)(c)), the criteria for non-performance, credit bureau scores, all-inclusive pricing except third-party costs (59(2)(f)), and the APR disclosed |

**[LR-06](law/LR-06.md) The Banking (Credit Reference Bureau) Regulations, 2020, Legal Notice No. 55 of 2020.** Regulator: Central Bank of Kenya. Made under: The Banking Act (Cap. 488), with the Microfinance Act and the Central Bank of Kenya Act. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2020/55/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 2 | reg 2 | Its definitions; a "subscriber" is an institution licensed under the Banking Act, the Microfinance Act or the Sacco Societies Act that has subscribed to receive customer information from a bureau |

**[LR-11](law/LR-11.md) The National Payment System Act (Cap. 491A).** Regulator: Central Bank of Kenya. Made under: An Act of Parliament. In force: Yes. Version read: as at 2025-11-04, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2011/39/eng@2025-11-04).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 2 | s. 2 | Its definitions; a "payment service provider" includes whoever provides services for sending, receiving, storing or processing payments electronically, and any person that processes or stores data on behalf of such a provider or its users |

**[LR-17](law/LR-17.md) The Data Protection Act (Cap. 411C).** Regulator: Office of the Data Protection Commissioner. Made under: An Act of Parliament. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2019/24/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 25 | s. 25 | The principles of data protection: personal data processed lawfully, fairly and transparently, for explicit purposes, limited to what is necessary, accurate, kept no longer than needed, secure, and not transferred out of Kenya without safeguards |

**[LR-38](law/LR-38.md) The Unclaimed Financial Assets Act (Cap. 494; No. 40 of 2011).** Regulator: The Unclaimed Financial Assets Authority. Made under: An Act of Parliament. In force: Yes. Version read: as at 2023-07-01, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2011/40/eng@2023-07-01).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 13 | s. 13 | Assets held in a fiduciary capacity are presumed abandoned if the owner has shown no interest in them for two years after they became payable |
| s. 14 | s. 14 | A gift certificate, gift card or credit memo is presumed abandoned after five years unclaimed or unused |
