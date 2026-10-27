---
id: brief-wallet-lending
name: Wallet savings and loans — an account and a loan inside a mobile wallet
kind: guide
status: living
law: LR-03
released: unreleased
owner: Product lead, lending
classification: Internal
review_ids: [FS-1029]
last_reviewed: 2026-10-27
---

# Wallet savings and loans

**What it is:** a savings account and short loans offered inside a
mobile operator's wallet. The customer opens the account from the
wallet's menu, saves into it, and borrows for up to 30 days for a
one-off fee, with a limit set from how they use the wallet. A missed
repayment is recovered from their savings or wallet balance. M-Shwari
(NCBA with Safaricom) and KCB M-Pesa are the best known; Onit Bank ran
M-Fanisi with Airtel Money from 2017 (loan-kinds; FS-991).

**Why it is interesting:** it reaches millions of people who have a
phone and a wallet but no bank account or credit history, and it brings
the institution deposits as well as loans.

## 1 · How it works

```
   customer, in the wallet's menu
            |
            |  opts in; consents to the operator sharing their data
            v
   +--------------------+        +-----------------------------+
   | mobile operator    | -----> | the institution             |
   | menu, wallet,      |  data  |  account opened, KYC from   |
   | subscriber data    |        |  the operator as evidence,  |
   | (monthly, with     |        |  tier 1 (ID-23)             |
   |  consent)          |        |  limit scored from the      |
   +--------------------+        |  operator's data            |
            ^                    +--------------+--------------+
            |                                   |
            |    loan paid into the wallet      |
            +-----------------------------------+
            |
            |    repaid from the wallet by the due date
            |    or, if not, recovered from savings or the
            |    wallet balance, as the agreement allows
            v
   every day: the loan book reconciled with the operator's;
   the fee shared as the agreement says
```

## 2 · Why it is hard for an institution to do alone

- **Scale.** Millions of accounts, loans of a few hundred shillings,
  savings moving round the clock: the core and everything around it
  must hold up at that volume (FS-992).
- **Decisions with no one in the loop.** Every limit is set, explained
  and changed automatically, from the operator's data, and must be
  tried in shadow before it lends (MF-29; DE-05).
- **The operator's agreement.** The product sits in the operator's menu;
  the data, recovery from the wallet and the fee's split are all the
  operator's to agree (FS-993). The agreement covers data, KYC, credit
  risk, reports, audits and run-off (FS-1002).
- **Deposits and loans together.** Savings, lock savings and loans share
  one customer and one limit, across a deposit system and a loan system.
- **The rails.** The operator's own payment rails, for M-Pesa or Airtel
  Money, each with its own integration (RL-03, RL-04).

## 3 · What we bring

| Need | How it is met | Ids |
|---|---|---|
| Savings and lock savings | The deposits service and its savings product terms | deposits-service §4 |
| Loans on a line, limit from the operator's data | The lending service; Facility (a line), its limit basis the operator's data; Repayment source (automatic recovery); Partner (the operator) | MF-36, MF-40; loan-kinds; FS-991 |
| Limits set and explained automatically | Decisioning, tried in shadow first | MF-29; DE-05 |
| KYC from the operator, as evidence | Labelled with its source; tier 1 at most on its own | ID-23 |
| The wallet's rails | Safaricom and Airtel | RL-03, RL-04 |
| The menu and the other channels | The operator's menu, and our own USSD and app | OC-03; channels |
| Daily reconciliation with the operator | Recon | recon |

**Where it stands:** loans in phase 2; wallet savings once the deposit
terms have their schema (product-landscape).

## 4 · What we have learnt

From the contracts of a microfinance bank that ran such a product
(FS-999, FS-1002), as lessons only: the operator's menu offers, opts
in, pays out, repays and recovers; KYC is shared only after a loan is
taken, with consent; the raw data stays the operator's and is returned
or deleted at the end; the lender bears all the credit risk; the fee is
shared net of non-performing loans; and the loans run off after the
agreement ends.

## 5 · What is still open

- **Scale:** a load test at a prospect's own volumes (FS-992).
- **The operator's agreement:** each one the institution's, which we
  build to (FS-993).
- **Recovering from savings or the wallet:** what consent and notice it
  needs, and whether the lender regulations' limits on collection apply
  (LQ-28).
- **A deposit licence:** savings need a bank's or microfinance bank's
  licence (LR-04, LR-07); a lender without one offers the loans only.

## 6 · Who might want it

Microfinance banks and tier 2 and 3 banks wanting deposits and young
customers through the wallet (product-landscape §4). Onit Bank is the
nearest: it ran M-Fanisi, and its focus now is more traditional
banking services (CU-02).

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
