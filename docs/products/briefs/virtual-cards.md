---
id: brief-virtual-cards
name: Virtual cards — a card number in the app, drawing on an account or a line
kind: guide
status: living
law: LR-11
released: unreleased
owner: Product lead, lending
classification: Internal
review_ids: [FS-1029]
last_reviewed: 2026-10-27
---

# Virtual cards

**What it is:** a Visa or Mastercard number the customer sees in the
institution's app, with no plastic, for paying online and in other
apps. Each payment draws on the customer's deposit account or their
credit line. The customer can freeze it, replace it and set alerts from
the app (OC-25; FS-1010).

**Why it is interesting:** it lets a microfinance bank, Sacco or lender
give its customers a card for online spending, subscriptions and travel
bookings without a card programme of its own, and it makes a credit line
spendable anywhere cards are taken. Onit Bank asked for it (FS-1010).

## 1 · How it works

```
   customer pays online with the card
                 |
                 v
   card scheme (Visa or Mastercard)
                 |
                 v
   +------------------------------------+
   | issuer processor                   |   card numbers live here,
   | under a sponsor bank's BIN         |   and only here
   +-----------------+------------------+
                     |  authorisation request, in real time
                     v
   +------------------------------------+
   | the institution, on our platform   |
   |  the balance (deposits service)    |
   |   or the line (lending service)    |
   |  the rules (FC-16)                 |
   |  the customer's own alerts (OC-24) |
   +-----------------+------------------+
                     |  approve or decline, in a second or two
                     v
               back to the merchant

   each day: the scheme's settlement files  --> recon
   in the app: the card shown through the processor's secure display;
               freeze, replace, alerts
```

## 2 · Why it is hard for an institution to do alone

- **Scheme membership.** Issuing cards needs a BIN from Visa or
  Mastercard, through membership or a sponsor bank, with the scheme's
  approvals and fees.
- **PCI DSS.** Storing or seeing card numbers brings the full standard
  and its audits, a large undertaking for an institution whose business
  is lending and deposits.
- **Authorisation in real time.** Every payment is asked about while the
  customer waits: the balance or line must answer within a second or
  two, around the clock, and fail safely.
- **Settlement and disputes.** The scheme's daily files must be matched
  to what was authorised, and chargebacks handled.

## 3 · What we bring

| Need | How it is met | Ids |
|---|---|---|
| A BIN and card processing | Through partners: a sponsor bank's BIN and an issuer processor, as in Kenya today (KCB with Ukheshe, DTB with Paymentology) | OC-25; RL-26 |
| No card numbers on our side | Held only by the processor, shown in our app through its secure display; never stored or seen by us | OC-25; compliance LC-11 |
| The authorisation answered against the account or line | The deposits service or the lending service (Facility), the rules, the customer's alerts | OC-25; FC-16; OC-24 |
| Settlement matched | Recon of the scheme's files | recon |
| The card in the app | Shown, frozen, replaced from the app | channels |

**Where it stands:** designed, for later (channels; product-landscape).
Physical cards and card processing stay with the partners.

## 4 · What is still open

- **The approvals:** whether a microfinance bank or a lender may issue
  under a sponsor bank's BIN, with what approvals from CBK and the
  scheme, and how PCI DSS falls on a platform that never sees card
  numbers (LQ-23).
- **The partners:** a sponsor bank and an issuer processor for each
  market, and their price per card and per transaction.
- **Real-time availability:** the deposits and lending services
  answering authorisations around the clock, which the card path needs
  more than any other.

## 5 · Who might want it

Microfinance banks and Saccos whose customers pay online, and lenders
whose credit lines would be more useful as a card (product-landscape §2,
"Cards").

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
