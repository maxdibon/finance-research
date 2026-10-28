---
id: roan-capital-30-day-loan-v1
name: Roan Capital — Biashara, the 30-day loan, product version 1 (proposed)
kind: product-version
status: proposed
law: LR-03
released: 2026.10.16
owner: Delivery lead
classification: Internal
review_ids: [FS-800, FS-801, FS-802, FS-806, FS-807, FS-814, FS-815, FS-816, FS-817, FS-823, FS-826, FS-831, FS-830, FS-934, FS-981, FS-1044]
last_reviewed: 2026-10-28
---

# Roan Capital · Biashara, the 30-day loan · product version 1 · proposed

    product:   Biashara (unsecured), the 30-day loan
    version:   1 (proposed, not submitted)
    drafted:   2026-10-14, by Dibon, for Roan Capital's product owner
    status:    proposed: drafted by Dibon; Roan Capital adopts it as its
               own draft, and every Ask is answered, before it is submitted
    source:    Roan Capital's requirement document; delivery map RC-26,
               RC-27, RC-30; lender-rules §2.4 (the vocabulary), §2.9

**Agreed on 21 October 2026, folded into the items below** (FS-934, FS-1044;
Roan Capital's weekly update). This product is the one Roan Capital calls
**Biashara**: KES 3,000 to 100,000, 14 or 30 days, daily, 1% a day flat,
chattels held by the client and guarantors, with the Life Income Fund fee
(A1 to A5, A7, A21, A22, as here). Agreed besides: no grace, default the
day after a missed payment (A20); a due date on a holiday moves to the
next working day (A11); every amount to two decimal places (A12, where we
had instalments rounded up to the shilling); payouts by bank only, with a
cut-off from 23:00 to 04:00 (A18 becomes the bank's charges); restructuring
at 365 days, earlier by exception (A23). Two answers want a second look
before they are encoded: early repayment that "shortens the term at the
same rate" (A13), against reg 56(3) and (4); and the 1% a day, open to
change after CBK's declination (A5; reg 55). Its two siblings, Motor
Vehicle and Title Deed, get documents of their own.

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

## A · Product terms

Published once approved.

| Id | Term | Value | Source | Ask |
|---|---|---|---|---|
| A1 | Amount limits | Minimum KES 3,000; maximum KES 100,000 | Roan Capital's weekly update, 21 October; the prototype | Confirm |
| A2 | Term | 14 or 30 days, chosen for each loan | Roan Capital's weekly update, 21 October; Roan Capital's application form | Confirm |
| A3 | Repayment frequency | Daily, the first instalment the day after disbursement (KES 13,000 over 30 days: KES 434 a day, the last smaller) | Roan Capital's weekly update, 21 October; Roan Capital's application form | Confirm |
| A4 | Interest method | Flat, on the principal | Roan Capital's weekly update, 21 October; the prototype | Confirm |
| A5 | Interest rate and its unit | 1% a day, flat (KES 3,000 on KES 10,000 over 30 days); to revisit if CBK declines the pricing; CBK's approval (reg 55) to record | Roan Capital's weekly update, 21 October; Roan Capital's application form | Confirm |
| A6 | Fees | Membership, KES 100, once per client, and application, KES 500, on the first loan: both paid upfront, non-refundable. On later loans, application, KES 500 (KES 3,000 to 19,999) or KES 1,000 (KES 20,000 to 100,000), deducted at disbursement. On every loan: remittance, KES 120; chattels mortgage, KES 500 (KES 5,001 to 9,999) or KES 1,000 (KES 10,000 to 100,000); both deducted at disbursement. One question: on a first loan of KES 20,000 or more, is the application fee KES 500 or KES 1,000? | Roan Capital's application form; the prototype | Confirm |
| A7 | Insurance | The Life Income Fund ("LIF"), KES 200 on every loan, deducted at disbursement: what it covers, and whether it is a fee or a third party's cost (LQ-03) | Roan Capital's weekly update, 21 October; Roan Capital's application form | Provide |
| A8 | Default interest | 1% a day on overdue daily instalments, until the arrears are cleared | Roan Capital's application form; the prototype (open answer 3) | Confirm |
| A9 | Default period | We suggest 30 days past due, the longest reg 57 allows; shorter only if your agreement says so. Non-performing from day 61 if 30 | The regulations; Dibon's suggestion | Choose: 30 days / Shorter (give the days) |
| A10 | Collection ladder | Reminder day 25; default run days 30 to 40; final warning days 40 to 47; closure day 47 | The requirement document (RC-27) | Confirm |
| A11 | Holiday rule | A due date on a holiday moves to the next working day | Roan Capital's weekly update, 21 October | Confirm |
| A12 | Rounding | KES, to 2 decimal places | Roan Capital's weekly update, 21 October | Confirm |
| A13 | Early repayment | Interest only to the repayment date; never a minimum (the prototype's 14 days is not carried over: LQ-13) | The regulations (reg 56(3), (4)) | — |
| A14 | Rate type | Fixed | The prototype | Confirm |
| A15 | Rate by risk class | One rate for every borrower | The prototype; the requirement document scores borrowers (RC-11) | Choose: One rate for every borrower / A rate by risk class (give the range) |
| A16 | Interest basis | Flat on the principal, by days: 1% × principal × days in the term | The prototype | Confirm |
| A17 | Tax on fees | Excise duty at 20% on each fee, not on interest or the insurance premium; how it applies to Roan Capital, with counsel (LQ-14) | The Excise Duty Act; not in the prototype | — |
| A18 | Who pays the rail's charges | The bank's charges on payouts and repayments (payouts by bank only) | Roan Capital's weekly update, 21 October, for payouts by bank; who pays, none yet | Choose: The borrower / Roan Capital |
| A19 | Third-party costs | The chattels mortgage fee | The prototype | Choose: Roan Capital's own fee / The collateral registry's charge, passed on at cost |
| A20 | Grace | None: default the day after a missed payment | Roan Capital's weekly update, 21 October | Confirm |
| A21 | Collateral | Chattels: business and household items the borrower charges, each with its quantity and estimated value and where they are kept; vehicles by logbook (RC-08). The loan-to-value, which the form does not state | Roan Capital's weekly update, 21 October (chattels held by the client and guarantors); Roan Capital's application form | Provide |
| A22 | Guarantors | One, required; the guarantor also charges business stock or items as security, with their value. The guarantor's limit (open answer 16) | Roan Capital's weekly update, 21 October; Roan Capital's application form | Provide |
| A23 | Restructuring | At 365 days as standard, earlier by exception; the terms of a restructure (open answer 10) | Roan Capital's weekly update, 21 October | Confirm |
| A24 | Statements | How often, to the borrower and the guarantor (reg 47(2)) | None yet | Decide |
| A25 | Languages | English; Swahili (the form is in English) | Dibon's proposal; Roan Capital's application form | Choose: English only / English and Swahili |

## B · Eligibility and limits

Roan Capital's credit policy; its thresholds stay internal.

| Id | Rule | Value | Source | Ask |
|---|---|---|---|---|
| B1 | Who may borrow | Individuals and businesses, with the documents RC-01 lists | The requirement document (open answers 17 to 19) | Confirm |
| B2 | Affordability | The form records six months of M-Pesa and bank cash flows, daily income, stock value and how often stock turns over, and current loans (number and value). The rule that turns these into the largest instalment a borrower can afford | Roan Capital's application form; the requirement document (open answer 13) | Decide |
| B3 | Limits by KYC tier | The largest loan at each tier (OB-MF-06) | None yet | Decide |
| B4 | First loan and limit growth | The prototype marks a "first loan", and the form is reused for later loans of the same amount: the first loan's cap, and how the limit grows | Roan Capital's application form; the prototype | Decide |
| B5 | Exposure | Loans one borrower may hold at once; whether top-ups are allowed. The form asks for current loans, number and value | Roan Capital's application form | Decide |
| B6 | Bureau | A credit report before lending (open answer 12) | None yet | Choose: On every application / On the first loan only / Not checked |
| B7 | Cooling-off period | Your credit policy must state a cooling-off period: how many days, and is it a time after signing in which a borrower may withdraw without charge, or a wait before a new loan? (LQ-15) | The regulations (reg 25(2)(f)) | Decide |

## C · How it runs

Linked configuration, never published.

| Id | Setting | Value | Source | Ask |
|---|---|---|---|---|
| C1 | Approval chain | Credit Manager, Head Office, CEO: the form's approval block has all three (the prototype has the same chain); the requirement document has the committee chain (RC-12) | Roan Capital's application form; the prototype; the requirement document (open answer 28) | Choose: Credit Manager, Head Office, CEO / Credit Officer, the credit committee, the Head Office Committee above a threshold |
| C2 | Documents | RC-01's checklist; the form adds the KRA PIN, an email address (required), a bank account, six months of M-Pesa and bank statements, a guarantor, the spouse and two next of kin | Roan Capital's application form; the requirement document (open answers 14, 17 to 21) | Confirm |
| C3 | Disbursement | By bank only (NCBA; Access Bank, open answer 6) | Roan Capital's weekly update, 21 October | Confirm |
| C4 | Cut-off | No payout released 23:00 to 04:00 | Roan Capital's weekly update, 21 October; the requirement document | Confirm |
| C5 | Purposes | The form asks for the purpose in the borrower's own words: a list to choose from, or free text? | Roan Capital's application form; the prototype | Provide |
| C6 | Bureau reporting | Not in R1 (crb, phase 2) | Dibon's plan | — |

## The product, typed

FS-823. The tables are the conversation with
Roan Capital; this block is the product as data, one entry per term of
the vocabulary, keyed by its name. `proposed` is what we have, `options`
the typed form of a Choose's options in their order, and `value` what Roan
Capital settled; `null` is a blank still to fill. The read-back writes a
settled value here when it can, and lists the rest for a person to encode.
The check holds the block's shape; the values themselves are checked by
the schema in the code repository (lender-rules §2.4), not here.

```json product-version
{
  "amount_limits": {"item": "A1", "proposed": {"min": 3000, "max": 100000, "currency": "KES"}},
  "term": {"item": "A2", "proposed": {"allowed": [14, 30], "unit": "day"}},
  "repayment_frequency": {
    "item": "A3",
    "proposed": {"every": "day", "first_due": "day_after_disbursement"}
  },
  "interest_method": {"item": "A4", "proposed": {"method": "flat", "on": "principal"}},
  "interest_rate_and_its_unit": {
    "item": "A5",
    "proposed": {"value": 1, "unit": "percent", "per": "day"}
  },
  "fees": {
    "item": "A6",
    "proposed": [
      {
        "name": "membership",
        "amount": 100,
        "currency": "KES",
        "once_per": "client",
        "taken": "upfront",
        "refundable": false
      },
      {
        "name": "application_first_loan",
        "amount": 500,
        "currency": "KES",
        "once_per": "first_loan",
        "taken": "upfront",
        "refundable": false
      },
      {
        "name": "application",
        "currency": "KES",
        "once_per": "repeat_loan",
        "taken": "disbursement",
        "tiers": [
          {"from": 3000, "to": 19999, "amount": 500},
          {"from": 20000, "to": 100000, "amount": 1000}
        ]
      },
      {
        "name": "remittance",
        "amount": 120,
        "currency": "KES",
        "once_per": "loan",
        "taken": "disbursement"
      },
      {
        "name": "chattels_mortgage",
        "currency": "KES",
        "once_per": "loan",
        "taken": "disbursement",
        "tiers": [
          {"from": 5001, "to": 9999, "amount": 500},
          {"from": 10000, "to": 100000, "amount": 1000}
        ]
      }
    ]
  },
  "insurance": {
    "item": "A7",
    "proposed": {
      "name": "LIF",
      "amount": 200,
      "currency": "KES",
      "taken": "disbursement",
      "kind": null,
      "cover": null
    }
  },
  "default_interest": {
    "item": "A8",
    "proposed": {
      "rate": 1,
      "unit": "percent",
      "per": "day",
      "base": "overdue_instalments",
      "from_day_past_due": 1
    }
  },
  "default_period": {
    "item": "A9",
    "proposed": {"days_past_due": 30},
    "options": [{"days_past_due": 30}, {"days_past_due": null}]
  },
  "collection_ladder": {
    "item": "A10",
    "proposed": {
      "counted_from": "disbursement",
      "stages": [
        {"stage": "reminder", "from": 25, "to": 25},
        {"stage": "default_run", "from": 30, "to": 40},
        {"stage": "final_warning", "from": 40, "to": 47},
        {"stage": "closure", "from": 47, "to": 47}
      ]
    }
  },
  "holiday_rule": {
    "item": "A11",
    "proposed": {"due_on_holiday": "next_working_day"}
  },
  "rounding": {
    "item": "A12",
    "proposed": {"currency": "KES", "decimals": 2}
  },
  "rate_type": {"item": "A14", "proposed": {"type": "fixed"}},
  "rate_by_risk_class": {
    "item": "A15",
    "proposed": {"by_risk_class": false},
    "options": [{"by_risk_class": false}, {"by_risk_class": true, "range": null}]
  },
  "interest_basis": {
    "item": "A16",
    "proposed": {"basis": "days_in_term", "formula": "rate * principal * days"}
  },
  "tax_on_fees": {
    "item": "A17",
    "proposed": {
      "excise_duty_percent": 20,
      "on": "fees",
      "not_on": ["interest", "insurance_premium"]
    }
  },
  "who_pays_the_rails_charges": {
    "item": "A18",
    "options": [{"payer": "borrower"}, {"payer": "institution"}]
  },
  "third_party_costs": {
    "item": "A19",
    "options": [
      {"items": [{"name": "chattels_mortgage", "kind": "institution_fee"}]},
      {"items": [{"name": "chattels_mortgage", "kind": "third_party_at_cost"}]}
    ]
  },
  "grace": {"item": "A20", "proposed": {"days": 0}},
  "collateral": {
    "item": "A21",
    "proposed": {"types": ["chattels", "vehicle"], "loan_to_value": null}
  },
  "guarantors": {"item": "A22", "proposed": {"count": 1, "limit": null}},
  "restructuring": {"item": "A23", "proposed": {"allowed": true}},
  "languages": {
    "item": "A25",
    "proposed": {"languages": ["en", "sw"]},
    "options": [{"languages": ["en"]}, {"languages": ["en", "sw"]}]
  },
  "who_may_borrow": {"item": "B1", "proposed": {"individuals": true, "businesses": true}},
  "bureau": {
    "item": "B6",
    "options": [{"lookup": "every_application"}, {"lookup": "first_loan"}, {"lookup": "none"}]
  },
  "approval_chain": {
    "item": "C1",
    "proposed": {
      "stages": [
        {"role": "credit_manager"},
        {"role": "head_office"},
        {"role": "chief_executive_officer"}
      ]
    },
    "options": [
      {
        "stages": [
          {"role": "credit_manager"},
          {"role": "head_office"},
          {"role": "chief_executive_officer"}
        ]
      },
      {
        "stages": [
          {"role": "credit_officer"},
          {"role": "credit_committee", "quorum": "all"},
          {"role": "head_office_committee", "above": null}
        ]
      }
    ]
  },
  "documents": {"item": "C2", "proposed": {"checklist": "requirement_document"}},
  "disbursement": {"item": "C3", "proposed": {"channels": ["ncba_bank_transfer"]}},
  "cut_off": {
    "item": "C4",
    "proposed": {"no_payout_from": "23:00", "to": "04:00", "zone": "Africa/Nairobi"}
  },
  "bureau_reporting": {"item": "C6", "proposed": {"reporting": false}}
}
```

## From Roan Capital's application form

FS-831; the blank form in
clients/, not in git). It confirms the term, daily instalments, the
rate, default interest and the fees above, and the approval block
names the prototype's chain. Once the platform issues each loan's
agreement and key information document from this product (lender-rules
§2.3), the paper form retires, and these documents carry what the
regulations ask of an agreement:

- **Early repayment without charge** (reg 54(4)(h); reg 56(3), (4)):
  interest only to the day of repayment. The form's note on
  prepayments within two weeks becomes this (LQ-13).
- **Everything reg 54(4) lists:** the charges and when they apply, the
  total cost of credit and the APR, the default period (reg 57(3)), when
  a non-performing loan may be reported to a bureau, and how to
  complain; the form's agreement section has the amount, purpose, rate,
  instalments and dates.
- **Excise duty on the fees** (LQ-14), which the form's charges do not
  show; a charge not disclosed in the contract cannot be recovered
  (reg 30(2)).
- **Consent to use personal data** for the loan and its recovery, specific
  to that purpose (Data Protection Act s.30, s.32; LR-17); publishing a
  borrower's information to shame them is forbidden (lender regulations reg 30(1)(d)), so
  the form's "publication of whatever nature" is not carried over.
- **Contact in collections** only with the borrower and the guarantor
  (reg 30(1)(e)); the spouse and next of kin the form records are
  references, not people to call about a debt.
- **Security:** household items may be charged, but essential personal
  effects may not be taken in recovery (reg 30(1)(k)), and a sale needs
  thirty days' notice (reg 30(4)). The chattels mortgage is registered
  in the collateral registry (MF-03).
- **The witness line** on the chattels mortgage names another
  organisation; the platform's version names Roan Capital's officer.

## Not terms, and before submission

**Not terms, and so not here:** the repayment order (reg 56) and the cap
on a non-performing loan (reg 29) are the regulations'; any reading not
yet settled is in the interpretation record (recon §3.1.3).

**Before submission** the back office's form will preview, for a sample
loan: the schedule, the APR and total cost of credit, the key information
document, and the companion's own figures. Then two of Roan Capital's
people approve it; CBK's letter is recorded where reg 55 requires it; and
it is activated from its effective date, for new loans only.

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](../law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 25 | reg 25(2)(f) | A written credit policy, consistent with the law, stating among other things the cooling-off period (25(2)(f)) and how the borrower's ability to repay is determined (25(2)(s)) |
| reg 29 | reg 29 | What can be recovered on a non-performing loan is capped at the principal then owing, interest up to that principal, and reasonable recovery costs; the cap is measured from the last time the loan became non-performing (29(3)); interest under a court order after the order is outside it (29(4)) |
| reg 30 | reg 30(1)(d), reg 30(1)(e), reg 30(1)(k), reg 30(2), reg 30(4) | No harassing, shaming or threatening collection: nothing posted to shame a borrower (30(1)(d)), no messages to their contacts (30(1)(e)), no calls outside working hours, no taking of essential personal effects (30(1)(k)); no charges not disclosed in the contract (30(2)); land security recovered under the Land Act (30(3)); thirty days' notice before selling movable security (30(4)) |
| reg 47 | reg 47(2) | Product information fair, clear and current, and easily available at branches, websites and every channel (47(1)(d)); the lender says it is regulated by the Central Bank, and shows its company name |
| reg 54 | reg 54(4), reg 54(4)(h) | At signing, the customer receives the agreement, the repayment schedule and the total cost of credit; the agreement states the loan, charges, rates, the APR, early repayment without charge (54(4)(h)) and more (54(4)); a variation needs thirty days' notice and the borrower's acceptance (54(7)) |
| reg 55 | reg 55 | Pricing parameters and credit terms change only with the Central Bank's prior written approval, after thirty days' notice to the customer and the customer's acceptance |
| reg 56 | reg 56, reg 56(3), reg 56(4) | A repayment credited on the day it is paid, applied to due principal, then fees and charges, then interest; early repayment, in whole or part, without notice or penalty (56(3)), and no interest for the remaining term on full early repayment (56(4)) |
| reg 57 | reg 57, reg 57(3) | A loan is non-performing when principal or interest is outstanding thirty days past due, for a loan of thirty days or less, or ninety days, for a longer one (57(1)); the credit policy (57(2)) and each loan agreement (57(3)) state the default period |

**[LR-17](../law/LR-17.md) The Data Protection Act (Cap. 411C).** Regulator: Office of the Data Protection Commissioner. Made under: An Act of Parliament. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2019/24/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 30 | s. 30 | No processing without a lawful basis: the person's consent for a stated purpose, or necessity for a contract, a legal obligation, vital interests, a public task or another ground the section lists |
| s. 32 | s. 32 | Whoever relies on consent proves it was given for the purpose; consent can be withdrawn at any time; it is not freely given where a service is made to depend on consent to processing it does not need |
