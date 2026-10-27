---
id: roan-capital-title-deed-v1
name: Roan Capital — Title Deed, the land-secured loan, product version 1 (proposed)
kind: product-version
status: proposed
law: LR-03
released: unreleased
owner: Delivery lead
classification: Internal
review_ids: [FS-934, FS-957, FS-959, FS-981]
last_reviewed: 2026-10-27
---

# Roan Capital · Title Deed, the land-secured loan · product version 1 · proposed

    product:   Title Deed (secured by a charge over land)
    version:   1 (proposed, not submitted)
    drafted:   2026-10-23, by Dibon, for Roan Capital's product owner
    status:    proposed: drafted by Dibon; Roan Capital adopts it as its
               own draft, and every Ask is answered, before it is submitted
    source:    Roan Capital's weekly update of 21 October 2026, where the
               product was defined (FS-934); lender-rules §2.4 (the
               vocabulary)

**What 21 October agreed** (FS-934). An amount based on the land's
valuation; up to 36 months; repaid monthly; 15% a month on the gross
principal; secured by the title deed. The 15% is made of a base rate, the
cost of funds, an admin fee of 2 to 3% and a processing fee of 2%. Agreed
for every product: no grace, default the day after a missed payment; a
due date on a holiday moves to the next working day; every amount to two
decimal places; payouts by bank only, none from 23:00 to 04:00;
restructuring at 365 days, earlier by exception.

**Recovering land** is under the Land Act (LR-47), not the lender
regulations' own steps (reg 30(3)). The charge is registered against the
title before payout, with the spouse's assent if the land is a
matrimonial home (Land Act s.79). After a month in default, a notice
gives at least three months to pay (Land Act s.90); then a notice to sell,
and forty days before a sale completes (Land Act s.96), after a forced
sale valuation and at the best price reasonably obtainable (Land Act
s.97). So the earliest sale is about day 160 after a missed payment
(FS-959). Until the land is sold, the borrower may pay in full and take
it back (Land Act s.102).

In git and the reader by exception, as Biashara is, until Roan Capital's
workspace in Dibon's Odoo Documents holds it (FS-806): it holds no
personal data. How to read the tables, and how the questionnaires are
built from them, is in Biashara's document
([roan-capital-30-day-loan-v1](roan-capital-30-day-loan-v1.md)).

## A · Product terms

Published once approved.

| Id | Term | Value | Source | Ask |
|---|---|---|---|---|
| A1 | Amount limits | Based on the land's valuation: the smallest and largest loans in shillings | Roan Capital's weekly update, 21 October | Provide |
| A2 | Term | Up to 36 months, chosen for each loan; from one month, as Motor Vehicle, unless Roan Capital sets a longer shortest term | Roan Capital's weekly update, 21 October | Provide |
| A3 | Repayment frequency | Monthly, the first instalment a month after disbursement | Roan Capital's weekly update, 21 October | Confirm |
| A4 | Interest method | Flat, on the gross principal | Roan Capital's weekly update, 21 October | Confirm |
| A5 | Interest rate and its unit | 15% a month; CBK's approval of the pricing (reg 55) to record | Roan Capital's weekly update, 21 October | Confirm |
| A6 | Fees | The 15% includes an admin fee of 2 to 3% and a processing fee of 2%. Are these charged within the rate, or as fees of their own? Either way each is disclosed in the agreement and the APR (reg 54(4)) | Roan Capital's weekly update, 21 October | Provide |
| A7 | Insurance | Any cover required on the property or the borrower's life, and who pays for it. Parked on 21 October, with no owner yet | Roan Capital's weekly update, 21 October | Provide |
| A8 | Default interest | The rate on overdue instalments, its base and when it starts | None yet | Provide |
| A9 | Default period | For a loan longer than thirty days the regulations allow up to 90 days past due before a loan is non-performing (reg 57); 21 October agreed default the day after a missed payment. The agreement states the period (reg 57(3)) | The regulations; Roan Capital's weekly update, 21 October | Choose: 90 days / 30 days / Shorter (give the days) |
| A10 | Collection ladder | Reminders; after a month in default, the Land Act s.90 notice, at least three months to pay; then the notice to sell, forty days (Land Act s.96); a forced sale valuation first (Land Act s.97) | The Land Act | Decide |
| A11 | Holiday rule | A due date on a holiday moves to the next working day | Roan Capital's weekly update, 21 October | Confirm |
| A12 | Rounding | KES, to 2 decimal places | Roan Capital's weekly update, 21 October | Confirm |
| A13 | Early repayment | Interest only to the repayment date, never a penalty (reg 56(3), (4)); the Land Act lets a charge ask one month's notice or interest (Land Act s.85(3)), which reg 56 leaves no room for. 21 October said early repayment "shortens the duration at the same rate": to be read against these | The regulations | — |
| A14 | Rate type | Fixed | Roan Capital's weekly update, 21 October | Confirm |
| A15 | Rate by risk class | One rate for every borrower; a lower band for low-risk borrowers is with Roan Capital's CFO | Roan Capital's weekly update, 21 October | Choose: One rate for every borrower / A rate by risk class (give the range) |
| A16 | Interest basis | 15% × the gross principal × the months in the term | Roan Capital's weekly update, 21 October | Confirm |
| A17 | Tax on fees | Excise duty at 20% on each fee, not on interest; how it applies, with counsel (LQ-14) | The Excise Duty Act | — |
| A18 | Who pays the rail's charges | The bank's charges on payouts and repayments | None yet | Choose: The borrower / Roan Capital |
| A19 | Third-party costs | The valuation, the official search, registering the charge and its stamp duty: their amounts, and whether passed on at cost | Dibon's proposal | Provide |
| A20 | Grace | None: default the day after a missed payment | Roan Capital's weekly update, 21 October | Confirm |
| A21 | Collateral | A charge over the land in the prescribed form, registered against its title: holding the title deed alone is only a lien, enforced by a court (Land Act s.79); the loan-to-value on the valuation, and whose valuation | Roan Capital's weekly update, 21 October | Provide |
| A22 | Guarantors | Whether a guarantor is also required; a spouse's assent where the land is a matrimonial home (Land Act s.79) | None yet | Provide |
| A23 | Restructuring | At 365 days as standard, earlier by exception | Roan Capital's weekly update, 21 October | Confirm |
| A24 | Statements | How often, to the borrower (reg 47(2)) | None yet | Decide |
| A25 | Languages | English; Swahili | Dibon's proposal | Choose: English only / English and Swahili |

## B · Eligibility and limits

Roan Capital's credit policy; its thresholds stay internal.

| Id | Rule | Value | Source | Ask |
|---|---|---|---|---|
| B1 | Who may borrow | Individuals and businesses who own the land, by its title deed | Roan Capital's weekly update, 21 October | Confirm |
| B2 | Affordability | From M-Pesa and bank statements and income, as for Biashara; the monthly instalment the borrower can afford | Roan Capital's weekly update, 21 October | Decide |
| B3 | Limits by KYC tier | The largest loan at each tier | None yet | Decide |
| B4 | First loan and limit growth | Limits grow with repayment behaviour and more collateral | Roan Capital's weekly update, 21 October | Confirm |
| B5 | Exposure | Loans one borrower may hold at once, across all three products | None yet | Decide |
| B6 | Bureau | A credit report before lending | None yet | Choose: On every application / On the first loan only / Not checked |
| B7 | Cooling-off period | 14 days was named on 21 October, unverified against the credit policy (reg 25(2)(f)) | Roan Capital's weekly update, 21 October | Decide |

## C · How it runs

Linked configuration, never published.

| Id | Setting | Value | Source | Ask |
|---|---|---|---|---|
| C1 | Approval chain | As Biashara's, or another for secured loans | None yet | Provide |
| C2 | Documents | The title deed, an official search, the valuation report, the borrower's identity and statements | Dibon's proposal | Confirm |
| C3 | Disbursement | By bank only, once the charge is registered | Roan Capital's weekly update, 21 October | Confirm |
| C4 | Cut-off | No payout released 23:00 to 04:00 | Roan Capital's weekly update, 21 October | Confirm |
| C5 | Purposes | The purpose, from a list or in the borrower's words | None yet | Provide |
| C6 | Bureau reporting | Not in R1 (crb, phase 2) | Dibon's plan | — |

## The product, typed

FS-823, as in Biashara's document: `proposed` is what we have, `options`
a Choose's options in order, `value` what Roan Capital settled; `null` a
blank still to fill.

```json product-version
{
  "term": {"item": "A2", "proposed": {"min": 1, "max": 36, "unit": "month"}},
  "repayment_frequency": {
    "item": "A3",
    "proposed": {"every": "month", "first_due": "month_after_disbursement"}
  },
  "interest_method": {"item": "A4", "proposed": {"method": "flat", "on": "principal"}},
  "interest_rate_and_its_unit": {
    "item": "A5",
    "proposed": {"value": 15, "unit": "percent", "per": "month"}
  },
  "default_period": {
    "item": "A9",
    "options": [{"days_past_due": 90}, {"days_past_due": 30}, {"days_past_due": null}]
  },
  "holiday_rule": {"item": "A11", "proposed": {"due_on_holiday": "next_working_day"}},
  "rounding": {"item": "A12", "proposed": {"currency": "KES", "decimals": 2}},
  "rate_type": {"item": "A14", "proposed": {"type": "fixed"}},
  "grace": {"item": "A20", "proposed": {"days": 0}},
  "collateral": {"item": "A21", "proposed": {"types": ["land"], "loan_to_value": null}},
  "restructuring": {"item": "A23", "proposed": {"allowed": true}},
  "languages": {
    "item": "A25",
    "proposed": {"languages": ["en", "sw"]},
    "options": [{"languages": ["en"]}, {"languages": ["en", "sw"]}]
  },
  "bureau_reporting": {"item": "C6", "proposed": {"reporting": false}}
}
```

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](../law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 25 | reg 25(2)(f) | A written credit policy, consistent with the law, stating among other things the cooling-off period (25(2)(f)) and how the borrower's ability to repay is determined (25(2)(s)) |
| reg 30 | reg 30(3) | No harassing, shaming or threatening collection: nothing posted to shame a borrower (30(1)(d)), no messages to their contacts (30(1)(e)), no calls outside working hours, no taking of essential personal effects (30(1)(k)); no charges not disclosed in the contract (30(2)); land security recovered under the Land Act (30(3)); thirty days' notice before selling movable security (30(4)) |
| reg 47 | reg 47(2) | Product information fair, clear and current, and easily available at branches, websites and every channel (47(1)(d)); the lender says it is regulated by the Central Bank, and shows its company name |
| reg 54 | reg 54(4) | At signing, the customer receives the agreement, the repayment schedule and the total cost of credit; the agreement states the loan, charges, rates, the APR, early repayment without charge (54(4)(h)) and more (54(4)); a variation needs thirty days' notice and the borrower's acceptance (54(7)) |
| reg 55 | reg 55 | Pricing parameters and credit terms change only with the Central Bank's prior written approval, after thirty days' notice to the customer and the customer's acceptance |
| reg 56 | reg 56, reg 56(3), reg 56(4) | A repayment credited on the day it is paid, applied to due principal, then fees and charges, then interest; early repayment, in whole or part, without notice or penalty (56(3)), and no interest for the remaining term on full early repayment (56(4)) |
| reg 57 | reg 57, reg 57(3) | A loan is non-performing when principal or interest is outstanding thirty days past due, for a loan of thirty days or less, or ninety days, for a longer one (57(1)); the credit policy (57(2)) and each loan agreement (57(3)) state the default period |

**[LR-47](../law/LR-47.md) The Land Act (Cap. 280), formerly No. 6 of 2012.** Regulator: None: the courts apply it; the National Land Commission for public land. Made under: An Act of Parliament. In force: Yes. Version read: as at 2025-11-04, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2012/6/eng@2025-11-04).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 79 | s. 79 | A charge is made by an instrument in the prescribed form (79(1)); a charge of a matrimonial home is valid only if the spouse living there also signs or assents (79(3)); a formal charge takes effect only once registered, and gives no remedy until it is (79(5)); holding the title deed alone is an informal charge, a lien by deposit of documents, enforced only by a court's order (79(6), (7)) |
| s. 85 | s. 85(3) | The chargor may discharge the charge by paying everything owed at any time before a sale (85(1)); a term that takes away or fetters that right is void (85(2)); the instrument may ask for one month's notice, or at most one month's interest, on an early discharge (85(3)) |
| s. 90 | s. 90 | After one month in default, a written notice to the chargor (90(1)) stating the default, the amount to pay and a time of at least three months to pay it, or two months for any other default, what follows, and the right to apply to court (90(2)); if not met within ninety days of service, the chargee may sue, appoint a receiver, lease, take possession or sell (90(3)) |
| s. 96 | s. 96 | A sale only once the time in the s. 90 notice has passed in default (96(1)); then a notice to sell, and no contract of sale completed until forty days after it is served (96(2)); copies to the spouse who consented, co-owners, lessees, other chargees and guarantors, and posted at the land (96(3)) |
| s. 97 | s. 97 | The chargee owes the chargor, guarantors and later chargees a duty to get the best price reasonably obtainable (97(1)); a forced sale valuation by a valuer before selling (97(2)); a sale 25% or more below market value is presumed a breach, and the chargor may ask a court to void it (97(3)); none of this can be contracted out of (97(7)) |
| s. 102 | s. 102 | Until the land is sold, the chargor may discharge the charge by paying all it secures, and the chargee then delivers the discharge and the title documents |
