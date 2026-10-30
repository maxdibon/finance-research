---
id: brief-retailer-finance
name: Retailer finance — stock paid to the distributor, a limit from its data
kind: guide
status: living
law: LR-03
released: unreleased
owner: Product lead, lending
classification: Internal
review_ids: [FS-1029, FS-1031, FS-1058]
last_reviewed: 2026-10-30
---

# Retailer finance

**What it is:** a shop borrows to buy stock from its distributor, and the
money goes to the distributor, never to the shop. The shop's limit comes
from what it has bought from that distributor before, shared with the
shop's consent, and the shop repays over a few weeks. Banks in Kenya
call it retailer, distributor or supplier finance; KCB, Equity (with
Unilever) and Faulu offer it (product-landscape). It is one of the loan
kinds the vocabulary describes (loan-kinds, "A worked example").

**Why it is interesting:** it lends to small shops that have no
statements or collateral, on evidence a lender cannot otherwise see, and
the money can only be spent on stock, so it is hard to divert.

## 1 · How it works

```
   distributor                 the lender                    retailer
   -----------                 ----------                    --------
   shares the retailer's  -->  scores the purchases,    <--  consents, for
   purchases (monthly,         sets a line per               this distributor
   with consent)               distributor, renewed          (FS-1004)
                               each month
                                     |
                               <-----+------  asks to draw: stock from
                                     |        this distributor, with
                                     |        its invoice (USSD, app,
                                     |        WhatsApp)
                                     v
                           checks: the line, the
                           distributor's exposure cap,
                           the invoice, the payee list
                                     |
   paid the invoice's  <-------------+
   amount, never more                |
         |                           v
   delivers the stock  ------------------------------------>  receives
                                                               the stock
                           repaid by the retailer, on    <--  repays on
                           the draw's term, or a share        the term
                           of its till takings
```

## 2 · Why it is hard for an institution to do alone

- **The limits sit beneath the core.** A retailer buys from several
  distributors, so it needs a line for each, under one overall limit.
  Many loan cores hold one limit per borrower; the per-distributor limits
  then have to be held, and every draw checked, somewhere else (the
  lesson of FS-1000).
- **The payout goes to someone else.** Paying a third party against an
  invoice, from an approved list, with the amount tied to the invoice,
  is not how a core disburses a personal loan.
- **The partner has to be onboarded and managed.** Each distributor is
  vetted, signs an agreement and a data-sharing agreement, sends data
  every month, takes a share of first loss, refunds returned goods to
  the loan, and has a cap on what the lender is exposed to through it.
  That is a partner programme, with its own people, portal and
  reconciliation.
- **The data needs consent, for each distributor.** A shop's purchase
  history is personal data; using it needs a lawful basis (LQ-22),
  recorded before any data is shared.
- **The channel is the shop's phone.** Shops draw several times a month,
  by USSD or WhatsApp, often at the counter while the delivery waits.

## 3 · What we bring

| Need | How it is met | Ids |
|---|---|---|
| A line per distributor, under the borrower's overall limit, whatever the core holds | The lending service holds the limits beneath the core and checks every draw against both | lending-service §5; MF-40; FS-1000 |
| The product described as data | Facility (a line, renewed monthly), Payee (the distributor, against an invoice), Partner (data, first loss, returns) | loan-kinds; product-versions §4 |
| The payout tied to the payee and the invoice | The approval engine holds the payout to the approved payee and amount; the rails pay it | MF-40; RL-01 |
| Partners onboarded and managed | Intake with KYB, the partner's agreement and data-sharing agreement, its people as profiles, a portal, signed events to its system, exposure caps and freezes | lending-service §5; MF-41, MF-42; JN-21; onboarding pack P1 to P3 |
| Consent, for each distributor apart | Asked and recorded before any of its data is used, withdrawable | FS-1004; privacy |
| The shop's channels | USSD, WhatsApp, the app | omni-channel; channels |
| Paid against delivered | Recon matches what was paid to what was delivered and returned | recon |

**Where it stands:** designed, phase 2 (product-landscape).

## 4 · What we have run or learnt

Dibon ran the USSD channel and digital lending for a bank's retailer
finance from 2022 to 2025 (customers CU-03). The loans were booked on the
bank's own core, which was built to hold one limit per retailer, so the
limit for each distributor was held in our layer and every draw checked
against both (FS-1000). The lending service is designed to do the same
for any core.

## 5 · What is still open

- **The distributor's data:** on what lawful basis it may be shared
  (LQ-22).
- **Goods faulty or never delivered:** whether the shop may withhold
  repayment, and what the agreements must say (LQ-20).
- **The price and who pays it:** the distributor's contribution, if any,
  set per product (Partner).

## 6 · Who might want it

Tier 2 and tier 3 banks with an SME book, microfinance banks, and
lenders working with a distributor that wants to grow its retailers'
buying (product-landscape §4).

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
