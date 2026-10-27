---
id: roan-capital-motor-vehicle-v1
name: Roan Capital — Motor Vehicle, the logbook loan, product version 1 (proposed)
kind: product-version
status: proposed
law: LR-03
released: unreleased
owner: Delivery lead
classification: Internal
review_ids: [FS-934, FS-935, FS-957, FS-981]
last_reviewed: 2026-10-27
---

# Roan Capital · Motor Vehicle, the logbook loan · product version 1 · proposed

    product:   Motor Vehicle (secured by the vehicle's logbook)
    version:   1 (proposed, not submitted)
    drafted:   2026-10-23, by Dibon, for Roan Capital's product owner
    status:    proposed: drafted by Dibon; Roan Capital adopts it as its
               own draft, and every Ask is answered, before it is submitted
    source:    Roan Capital's weekly update of 21 October 2026, where the
               product was defined (FS-934); lender-rules §2.4 (the
               vocabulary), §2.11 (selling security)

**What 21 October agreed** (FS-934). Up to 50% of the vehicle's value;
one to twelve months; repaid monthly; 15% a month on the gross principal;
secured by the logbook. The 15% is made of a base rate, the cost of
funds, an admin fee of 2 to 3% and a processing fee of 2%. Agreed for
every product: no grace, default the day after a missed payment; a due
date on a holiday moves to the next working day; every amount to two
decimal places; payouts by bank only, none from 23:00 to 04:00;
restructuring at 365 days, earlier by exception. Roan Capital is to share
the vehicle tracking, chattels mortgage and valuation charges, and a
sample one-month and multi-month calculation, so the fee split can be
checked.

**First, the sale window** (FS-935, Critical). Roan Capital's ladder
recovers or sells the vehicle between days 31 and 47. The regulations
want thirty days' notice before movable security is sold (reg 30(4)), and
the Auctioneers Rules add their own notices and waiting days before an
auction (lender-rules §2.11). The ladder in A10 is therefore Roan
Capital's as given, marked to change; this product cannot be submitted
until it does.

In git and the reader by exception, as Biashara is, until Roan Capital's
workspace in Dibon's Odoo Documents holds it (FS-806): it holds no
personal data. How to read the tables, and how the questionnaires are
built from them, is in Biashara's document
([roan-capital-30-day-loan-v1](roan-capital-30-day-loan-v1.md)).

## A · Product terms

Published once approved.

| Id | Term | Value | Source | Ask |
|---|---|---|---|---|
| A1 | Amount limits | Up to 50% of the vehicle's value; the smallest and largest loans in shillings | Roan Capital's weekly update, 21 October | Provide |
| A2 | Term | 1 to 12 months, chosen for each loan | Roan Capital's weekly update, 21 October | Confirm |
| A3 | Repayment frequency | Monthly, the first instalment a month after disbursement | Roan Capital's weekly update, 21 October | Confirm |
| A4 | Interest method | Flat, on the gross principal | Roan Capital's weekly update, 21 October | Confirm |
| A5 | Interest rate and its unit | 15% a month; CBK's approval of the pricing (reg 55) to record | Roan Capital's weekly update, 21 October | Confirm |
| A6 | Fees | The 15% includes an admin fee of 2 to 3% and a processing fee of 2%. Are these charged within the rate, or as fees of their own? Either way each is disclosed in the agreement and the APR (reg 54(4)) | Roan Capital's weekly update, 21 October | Provide |
| A7 | Insurance | The vehicle's insurance: who holds it, whether Roan Capital is named on it, and whether any premium is charged through the loan. Parked on 21 October, with no owner yet | Roan Capital's weekly update, 21 October | Provide |
| A8 | Default interest | Penalties "accruing throughout" the recovery ladder: the rate, its base and when it starts | Roan Capital's weekly update, 21 October | Provide |
| A9 | Default period | For a loan longer than thirty days the regulations allow up to 90 days past due before a loan is non-performing (reg 57); 21 October agreed default the day after a missed payment. The agreement states the period (reg 57(3)) | The regulations; Roan Capital's weekly update, 21 October | Choose: 90 days / 30 days / Shorter (give the days) |
| A10 | Collection ladder | Reminder day 25; recovery or sale days 31 to 47. To change: thirty days' notice before a sale (reg 30(4)) and the auction's own steps (FS-935) | Roan Capital's weekly update, 21 October | Decide |
| A11 | Holiday rule | A due date on a holiday moves to the next working day | Roan Capital's weekly update, 21 October | Confirm |
| A12 | Rounding | KES, to 2 decimal places | Roan Capital's weekly update, 21 October | Confirm |
| A13 | Early repayment | Interest only to the repayment date, never a penalty (reg 56(3), (4)). 21 October said early repayment "shortens the duration at the same rate": to be read against these | The regulations | — |
| A14 | Rate type | Fixed | Roan Capital's weekly update, 21 October | Confirm |
| A15 | Rate by risk class | One rate for every borrower; a lower band for low-risk borrowers is with Roan Capital's CFO | Roan Capital's weekly update, 21 October | Choose: One rate for every borrower / A rate by risk class (give the range) |
| A16 | Interest basis | 15% × the gross principal × the months in the term | Roan Capital's weekly update, 21 October | Confirm |
| A17 | Tax on fees | Excise duty at 20% on each fee, not on interest; how it applies, with counsel (LQ-14) | The Excise Duty Act | — |
| A18 | Who pays the rail's charges | The bank's charges on payouts and repayments | None yet | Choose: The borrower / Roan Capital |
| A19 | Third-party costs | Vehicle tracking, the chattels mortgage's registration in the collateral registry, and the valuation: their amounts, and whether passed on at cost | Roan Capital's weekly update, 21 October | Provide |
| A20 | Grace | None: default the day after a missed payment | Roan Capital's weekly update, 21 October | Confirm |
| A21 | Collateral | The vehicle, by its logbook, registered as a security right in the collateral registry; up to 50% loan-to-value, on a valuation whose source is to be named | Roan Capital's weekly update, 21 October | Confirm |
| A22 | Guarantors | Whether a guarantor is also required | None yet | Provide |
| A23 | Restructuring | At 365 days as standard, earlier by exception | Roan Capital's weekly update, 21 October | Confirm |
| A24 | Statements | How often, to the borrower (reg 47(2)) | None yet | Decide |
| A25 | Languages | English; Swahili | Dibon's proposal | Choose: English only / English and Swahili |

## B · Eligibility and limits

Roan Capital's credit policy; its thresholds stay internal.

| Id | Rule | Value | Source | Ask |
|---|---|---|---|---|
| B1 | Who may borrow | Individuals and businesses who own the vehicle, by its logbook | Roan Capital's weekly update, 21 October | Confirm |
| B2 | Affordability | From M-Pesa and bank statements and income, as for Biashara; the monthly instalment the borrower can afford | Roan Capital's weekly update, 21 October | Decide |
| B3 | Limits by KYC tier | The largest loan at each tier | None yet | Decide |
| B4 | First loan and limit growth | Limits grow with repayment behaviour and more collateral | Roan Capital's weekly update, 21 October | Confirm |
| B5 | Exposure | Loans one borrower may hold at once, across Biashara and this product | None yet | Decide |
| B6 | Bureau | A credit report before lending | None yet | Choose: On every application / On the first loan only / Not checked |
| B7 | Cooling-off period | 14 days was named on 21 October, unverified against the credit policy (reg 25(2)(f)) | Roan Capital's weekly update, 21 October | Decide |

## C · How it runs

Linked configuration, never published.

| Id | Setting | Value | Source | Ask |
|---|---|---|---|---|
| C1 | Approval chain | As Biashara's, or another for secured loans | None yet | Provide |
| C2 | Documents | The logbook, the valuation report, the vehicle's insurance, the borrower's identity and statements | Dibon's proposal | Confirm |
| C3 | Disbursement | By bank only | Roan Capital's weekly update, 21 October | Confirm |
| C4 | Cut-off | No payout released 23:00 to 04:00 | Roan Capital's weekly update, 21 October | Confirm |
| C5 | Purposes | The purpose, from a list or in the borrower's words | None yet | Provide |
| C6 | Bureau reporting | Not in R1 (crb, phase 2) | Dibon's plan | — |

## The product, typed

FS-823, as in Biashara's document: `proposed` is what we have, `options`
a Choose's options in order, `value` what Roan Capital settled; `null` a
blank still to fill.

```json product-version
{
  "term": {"item": "A2", "proposed": {"min": 1, "max": 12, "unit": "month"}},
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
  "collateral": {"item": "A21", "proposed": {"types": ["vehicle"], "loan_to_value": 50}},
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
| reg 30 | reg 30(4) | No harassing, shaming or threatening collection: nothing posted to shame a borrower (30(1)(d)), no messages to their contacts (30(1)(e)), no calls outside working hours, no taking of essential personal effects (30(1)(k)); no charges not disclosed in the contract (30(2)); land security recovered under the Land Act (30(3)); thirty days' notice before selling movable security (30(4)) |
| reg 47 | reg 47(2) | Product information fair, clear and current, and easily available at branches, websites and every channel (47(1)(d)); the lender says it is regulated by the Central Bank, and shows its company name |
| reg 54 | reg 54(4) | At signing, the customer receives the agreement, the repayment schedule and the total cost of credit; the agreement states the loan, charges, rates, the APR, early repayment without charge (54(4)(h)) and more (54(4)); a variation needs thirty days' notice and the borrower's acceptance (54(7)) |
| reg 55 | reg 55 | Pricing parameters and credit terms change only with the Central Bank's prior written approval, after thirty days' notice to the customer and the customer's acceptance |
| reg 56 | reg 56(3), reg 56(4) | A repayment credited on the day it is paid, applied to due principal, then fees and charges, then interest; early repayment, in whole or part, without notice or penalty (56(3)), and no interest for the remaining term on full early repayment (56(4)) |
| reg 57 | reg 57, reg 57(3) | A loan is non-performing when principal or interest is outstanding thirty days past due, for a loan of thirty days or less, or ninety days, for a longer one (57(1)); the credit policy (57(2)) and each loan agreement (57(3)) state the default period |
