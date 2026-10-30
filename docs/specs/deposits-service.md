---
id: deposits-service
name: The Kapu deposits service — build specification
kind: spec
type: build
status: draft
released: unreleased
release: R4
implements: [core, sacco]
depends_on: [kapu-core-fineract, approval-engine]
used_by: [lending-service]
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-066, FS-178, FS-179, FS-185, FS-985, FS-991, FS-1058]
last_reviewed: 2026-10-30
---

# The Kapu deposits service — build specification

Banks, microfinance banks and deposit-taking Saccos hold their customers'
and members' money. How we handle deposits depends on the ledger mode
(architecture §4; FS-985): in **integrated** mode, the usual case for a
bank, deposits stay in the institution's own core and we never hold or
copy them as the record; in **native** mode, for a deposit-taker
replacing its core, Kapu Core holds them, and Dibon becomes a
core-system vendor (FS-178, FS-179). This service is the deposits'
counterpart to the lending service: thin, the only writer of deposit
postings, with each regulator's deposit rules beside it. **Designed now,
built for the first native deposit-taker,** after Fineract's fit as a
deposit core is tested (FS-185). Nothing is built.

## 1 · Purpose and scope

What it answers: who keeps deposit accounts right, under the rules of
whichever regulator licenses the institution?

| Id | Capability | In R1 |
|---|---|---|
| KC-02 | Savings and current accounts, fixed deposits; interest calculated and posted automatically | No: R4, with Kapu Sacco and Kapu Core's first deposit-taker |
| KC-03 | Shares, for Saccos | No: R4 |

**Out of scope:** an integrated institution's deposits, which stay in its
core: there we bring Collect (JN-10), channels (JN-11, JN-12), recon and
approvals around the core, not this service.

**Where it sits.**

```
  +----------------------+  deposits and     +----------------------+
  | DEPOSITS SERVICE     |  shares read      | LENDING SERVICE      |
  | keeps accounts       |------------------>| lends                |
  | [kapu_service]       |                   | [kapu_service]       |
  +----------------------+                   +----------------------+
             |  postings, through the core adapter
             v
  +----------------------+  withdrawals,     +----------------------+
  | KAPU CORE            |  approved         | APPROVAL ENGINE      |
  | records              |<------------------| decides              |
  | [apache_fineract]    |                   | [kapu_service]       |
  +----------------------+                   +----------------------+
```

**Related:** implements [core](../modules/core.md) and
[sacco](../modules/sacco.md); depends on
[kapu-core-fineract](kapu-core-fineract.md) and
[approval-engine](approval-engine.md); used by
[lending-service](lending-service.md); journeys
[JN-10](../journeys/deposit.md), [JN-11](../journeys/transfer-out.md)
and [JN-12](../journeys/transfer-in.md).

## 2 · Concepts

- **A deposit account:** savings, current, fixed or recurring, or a
  Sacco member's non-withdrawable deposits (BOSA) and withdrawable
  savings (FOSA), and shares.
- **A rule set:** one regulator's deposit rules: SASRA and the Sacco
  Societies Act for deposit-taking Saccos; the Microfinance Act for
  microfinance banks; the Banking Act and CBK's prudential guidelines for
  banks; the deposit insurer's (KDIC) premiums and cover. Each is read
  into the law register before it is specified.

## 3 · Rules

1. **The money stays in the institution's accounts,** never Dibon's
   (FS-056).
2. **One ledger of record per account:** the institution's core or Kapu
   Core, never both.
3. **The only writer of deposit postings,** through the core adapter;
   tellers' cash (KC-06) and mobile money (KC-09) post through it.
4. **Money out is guarded:** step-up, limits by channel, the SIM-swap
   check before money moves (OC-06), and the approval engine where the
   product asks.
5. **Every balance shown is a live read,** labelled with when it was
   fetched (OC-11).
6. **Rules common to every deposit-taker:** dormant accounts and
   unclaimed assets, withholding tax on interest, anti-money-laundering
   monitoring (financial-crime), each from its law, to read and cite.
7. **A higher tier than lending:** withdrawals and transfers run around
   the clock.

## 4 · Savings products and their terms

FS-991. A savings product is described as a loan is (product-versions §4):
a version, in a vocabulary, checked, approved by two people and activated
from a date; the schema follows when the first native deposit-taker
signs. Its terms:

| Term | Values | Why it matters |
|---|---|---|
| Account kind | Regular savings; lock or fixed (a term to maturity); recurring (a regular amount); a Sacco's deposits (BOSA) and savings (FOSA); shares | What the customer holds, and how they reach it |
| Interest rate | A rate, or a rate per balance tier (M-Shwari pays more above each threshold), with its period | What the customer earns; published |
| Interest basis and posting | The day count; when interest accrues; when it is posted (monthly, at maturity) | Decides interest to the shilling |
| Lock term | Shortest and longest term, and whether the customer sets it (one to twelve months, for example) | How long locked money stays locked |
| Early break | Allowed or not; whole or partial; what is lost (the interest, a fee); how soon the money is paid (48 hours, for example) | What it costs to take locked money out early |
| Opening and minimum balance | The least to open and to keep | Who can open one, and what keeps it open |
| Withdrawal limits | By channel and KYC tier (identity ID-19), daily and per transaction | Guards money out (rule 4) |
| Fees | Each fee, as for loans; most savings carry none | What the customer pays |
| Withholding tax | On interest, as the law sets it | What the customer receives after tax |
| Dormancy | Days without activity before an account is dormant, and what follows (unclaimed assets) | What happens to an account left alone |
| Deposit insurance | The deposit insurer's cover, stated to the customer | What protects the money |
| Lien for loans | Whether savings secure a loan, and are recovered from on default (lender-rules, Repayment source: automatic recovery) | Whether a loan can be recovered from savings |

## 5 · Interfaces

Reads of accounts and balances for the lending service, the staff
workspace and the channels; commands to open, close and post; events in
a `kapu.deposits` domain, to add to the bus's catalogue when built.

## 6 · Security and audit

As the lending service; every money-out act with step-up and the
person's own token.

## 7 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| Account records beyond the core's | Confidential | As the regulator requires, then seven years | Customers' and members' |

## 8 · Quality and metrics

Around-the-clock tier; a withdrawal answered within two seconds at the
95th percentile, at the scale a wallet product brings (FS-992); alerts on any posting the core received that this
service did not make.

## 9 · Threats

| Threat | For example | The answer |
|---|---|---|
| Spoofing | A SIM swap, then a withdrawal | Rule 4 |
| Tampering | A balance changed in the core | Only writer (rule 3); recon's three ledgers |
| Repudiation | A withdrawal disputed | Step-up, the person's token, the event chain |
| Information disclosure | Balances cached and shown stale | Rule 5 |
| Denial of service | A busy month-end | The higher tier (rule 7) |
| Elevation of privilege | A teller posting outside their till | Tills and maker-checker (KC-06, KC-08) |

## 10 · Acceptance tests

| # | Given | When | Then | Id, source |
|---|---|---|---|---|
| A1 | A member's deposits | The lending service checks a loan's limit | It reads them here, live, with when they were fetched | KC-03, rule 5 |
| A2 | A SIM swapped in the last day | A withdrawal is asked for | It is held as financial crime says | KC-02, rule 4 |
| A3 | A posting made directly in the core | The nightly check runs | It is found and alerted | rule 3 |

## 11 · Open questions

**For the owner:**

1. Fineract's fit as a deposit core (FS-185), before native deposits are
   offered to anyone.
2. Our obligations as a core-system vendor (FS-179), met before the first
   native deposit-taker goes live.
3. The split mode (FS-066): deposits in the institution's core, loans in
   ours.
4. The scale a wallet product needs: millions of accounts, savings round
   the clock (FS-992).
