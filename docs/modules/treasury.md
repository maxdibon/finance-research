---
id: treasury
name: Kapu Treasury
kind: product
status: living
released: unreleased
owner: Product lead
classification: Internal
audience: [bank, sacco, mfi, psp, imt, sme, fintech]
depends_on: [rails, core, recon-observability, mandates]
consumed_by: []
review_ids: [FS-1164, FS-1169, FS-1170, FS-1171]
last_reviewed: 2026-11-11
---

# Kapu Treasury

## 1 · In one paragraph

Treasury manages an institution's own money and the risks that come with
it: whether it has the right cash, in the right place and currency, at
the right time, at a risk it accepts (FS-1169). Kapu Treasury is designed
to give each institution its positions in every account, a forecast of
what is coming in and going out from its own books, the levels at which
it funds each paying account, its funding and its investments, and,
where it needs them, its regulator's liquidity ratios and its exposure in
each currency. It is one function in four tiers, so a microfinance lender
with one finance person and a bank with a dealing room each take what
fits. The money is always the institution's, in its own accounts; Kapu
Treasury shows it, forecasts it and asks for it to move, through the
institution's own approvals.

## 2 · Who it is for

**Segments:** every institution we serve, by tier (§3). Lenders and
microfinance lenders first, with tier 1; deposit-taking Saccos and
microfinance banks with tier 2; money transfer operators, forex bureaus
and any institution holding foreign currency with tier 3; tier-1 banks,
whose own treasury systems we feed, with tier 4.

**The problem, concretely:** a payout fails because the M-Pesa float ran
out at four in the afternoon; a Sacco learns of a liquidity shortfall
when members queue to withdraw; a fund manager's treasury team matches
yesterday's money by hand before it can decide today's placement; a
remittance corridor's partner runs short of prefunding on a Friday. Each
is a treasury question asked too late, from figures gathered by hand.
Flex Money's prototype showed a treasury and float view (RO-09's
evidence), and Flex Money and Lofty Corban each have a treasury team
(FS-1169, FS-1171).

**People who use it:**

| Role | What they need from it |
|---|---|
| Treasurer, or the finance manager acting as one | Today's positions, the forecast, what to fund and from where, what to invest and until when |
| The institution's approvers | Each treasury movement, level and rate to approve, with what it is for |
| Asset and liability committee, or the board | The month's liquidity, funding and maturity picture, and their decisions recorded |
| Compliance, for a deposit-taker or an FX business | The regulator's ratios each day, and warning before a breach |
| Our operations team | Which paying accounts are near their levels, across the institutions we run |

## 3 · What it does

Every row is **Planned** unless it says otherwise: designed in this
module, not yet specified. The tiers are cumulative.

**Tier 1 · Every institution**

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| TR-01 | Treasury and float: where the money sits, and hours of float left at the current burn; for an institution that reaches the rails through a larger bank, the settlement account's balance against the transfers queued for release (rails RL-27) | Designed | Prototype: Treasury & Float. Owner, 2026-10-06: phase 1, in R2 (FS-585); moved from recon-observability RO-09 (FS-1171) | 1 |
| TR-02 | Float levels and top-ups: each paying account's levels (top up, low, critical, floor) and velocity limits, set by treasury and enforced by the rails (rails rule 14); each top-up, and each sweep of a collections account above its upper level, a transaction of kind treasury, approved (transactions W28) | Planned | FS-1158, FS-1164 | 2 |
| TR-03 | A cash forecast from the institution's own books, by day for the weeks ahead: payouts approved and in the pipeline, repayments due by their schedules, deposits and investments maturing, interest, dividends and investors' yields due, check-off expected, each against the usual for its type of day (core KC-15); actuals beside the forecast, and the gap explained | Planned | FS-1169 | 2 |
| TR-04 | Funding: each source (a bank's line, a development lender, investors' capital) with its limit, rate, draws, repayments, maturities and covenants; each draw and repayment a transaction; investors' capital held as funding, its lock-ups and yields in the forecast (FS-1170; LQ-38 first) | Planned | FS-1084, FS-1169 | 2 |

**Tier 2 · Deposit-takers: Saccos, microfinance banks, banks**

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| TR-05 | Investments register: Treasury bills and bonds, fixed deposits and call placements, bought, held, matured and rolled over; coupons and interest received; maturities in the forecast; each purchase and maturity a transaction | Planned | FS-1169 | 2 |
| TR-06 | The regulator's liquidity, daily: each regulator's ratios (the Central Bank's for banks and microfinance banks, SASRA's for deposit-taking Saccos) computed from the ledger each day, with the trend and a warning before a breach; each ratio read into the law register, never set from memory | Planned | FS-1169 | 2 |
| TR-07 | The asset and liability pack: the maturity gap by period, the interest-rate gap, the concentration of deposits and funding; for the committee each month, its decisions recorded and their actions followed | Planned | FS-1169 | 2 |

**Tier 3 · Foreign exchange: transfer operators, forex bureaus, any institution in more than one currency**

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| TR-08 | Positions by currency and the net open position, intraday, against the institution's limits and its regulator's | Planned | FS-1169 | later |
| TR-09 | Rates: buying and selling rates by currency and channel, each with its source, its spread, who approved it and from when; every exchange traced to the rate in force (the transaction's exchange, FS-1163) | Planned | FS-1163, FS-1169 | later |
| TR-10 | Corridor and correspondent prefunding: each remittance partner's and correspondent bank's account against the payouts expected through it, with levels and top-ups as TR-02; reconciled each day by reconciliation | Planned | FS-1169; rails RL-28 | later |
| TR-11 | Branch and till cash by currency and denomination | Designed | Prototype: Branches & Tellers; moved from recon-observability RO-10 (FS-1171) | 2 |

**Tier 4 · A bank with its own treasury system**

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| TR-12 | Integration with the institution's own treasury system: our products' positions, flows and forecasts sent to it; its deals' settlements reconciled by reconciliation; ours never replaces it, as the split mode never replaces a core | Planned | FS-1169 | later |

## 4 · Where it sits

**Depends on:** rails (the balances of every account on a rail, and the
treasury movements sent), core (the ledger and the business calendar,
KC-15), recon-observability (statements, matches and the three ledgers'
balances), mandates (every treasury movement, level and rate approved).
**Used by:** none yet; the lending and deposits products read its forecast
when they are next revised.

**Who holds which record** (docs/architecture/README.md §2):

| Record | System of record | This module |
|---|---|---|
| Funds and balances | The banks, the rails and the core | **Never holds.** Reads balances; asks for movements through the approval engine and the rails |
| Positions and the forecast | **Treasury** | Computes them from the ledgers and the rails; keeps each day's, so a forecast can be compared with what happened |
| Funding lines and investments | **Treasury**, their agreements in Odoo | Holds their terms and schedule; each movement is a transaction, posted to the core |
| Levels, limits and rates | **Treasury**, as rail settings and transaction rules | Sets them through the approval engine; the rails and financial crime enforce them |
| The regulator's ratios | Computed from the ledger | Reports them; the return itself is financial crime's (FC-13) |

**What this module never stores:** a customer's money, a balance as an
authority (it is always read from its system of record), a credential.

**Under each ledger mode** (docs/architecture/README.md §4):

| | Integrated: the institution has a core | Native: no core; Fineract is the ledger |
|---|---|---|
| Where funds are posted | The institution's core, through the core adapter | Kapu Core |
| What differs in this module | Balances and maturities read from its core; a deposit-taker's ratios computed from its core's general ledger | Read from Kapu Core directly |
| What the customer must provide | Read access to its core's balances and general ledger; its funding agreements | Its funding agreements |

## 5 · How it works

```
  LEDGERS AND RAILS                 TREASURY                     ACTIONS
  core balances, maturities -->+                          +--> top-up, sweep, placement
  rails balances (float)    -->+--> positions, forecast --+    (transaction, approved,
  recon: statements, matches-->+    levels, ratios        |     sent by the rails)
  pipeline, schedules       -->+    funding, investments  +--> alerts at each level
                                                          +--> ALCO pack, ratios
                                                                (return: FC-13)
```

Each morning, treasury's view opens with the night's positions, read from
each account's system of record and reconciled; the day's forecast,
built from the books; each paying account against its levels; and what
it proposes: a top-up, a sweep, a placement to mature before a known
outflow. Each proposal is a transaction the treasurer starts and the
institution's approvers approve; the rails send it.

## 6 · Rails and integrations

| Rail / system | Direction | Feed | Status |
|---|---|---|---|
| Banks | in / out | balances and statements by API or file (rails RL-07); transfers for top-ups and placements | Planned |
| M-Pesa (Daraja) | in | account balance of each shortcode (rails RL-03) | Built (the rail); its use here Planned |
| The Central Bank's securities depository | in / out | Treasury bill and bond holdings and auctions, through the institution's bank or directly where it is a member (to confirm) | Planned |
| Correspondent banks | in / out | through the larger bank, by SWIFT (rails RL-28) | Planned |
| Rate sources | in | the institution's bank's rates, the Central Bank's indicative rates (to confirm per institution) | Planned |
| An institution's own treasury system | out / in | positions and forecasts out; settled deals back, for reconciliation | Planned |

## 7 · Regulatory position

- **Custody:** none. The money is the institution's, in its own accounts;
  treasury asks for it to move through the institution's own approvals
  (FS-056, FS-588).
- **Licence relied on:** the institution's own.
- **Regulators:** the Central Bank (banks, microfinance banks, lenders,
  forex bureaus, money remittance operators), SASRA (Saccos), the Capital
  Markets Authority and the Retirement Benefits Authority (fund managers
  and schemes); each one's liquidity, reserve and open-position rules to
  read into the law register before tier 2 or 3 is specified.
- **Data:** positions, forecasts, funding and investments are
  Confidential; no personal data beyond the names on funding agreements.
- **Open legal checks:** LQ-38 (investors' money into a lender's pool).

## 8 · Controls

- **Attribution:** every treasury movement, level, limit and rate is
  started by a named person in the treasurer's role and approved by
  another, stepped up (access AC-05).
- **Mandates:** each through the approval engine: treasury movements as
  transactions (kind treasury), levels and limits as rail settings
  (`rail.setting`), rates as their own subject; the chain at least two
  people, more where the institution's mandate says.
- **Segregation:** the person who proposes a movement never approves it;
  where an institution has a dealing desk, the one who agrees a deal
  never settles or reconciles it.
- **Audit:** every position, forecast and decision kept as it was on the
  day, so what treasury knew when it decided can be shown later.
- **Exceptions:** a balance that cannot be read is shown as unknown,
  never as the last figure; a forecast missing a source says which.

## 9 · Deployment

Part of each institution's instance, in-country (FS-032). Rate sources
and a bank's own treasury system are reached as the rails reach banks.

## 10 · What it does not do

- **Trade.** It is not a dealing system: no foreign-exchange or money
  market deals are made in it, and no market data is sold through it.
- **Manage clients' portfolios.** A fund manager's investment business is
  its own; Kapu Treasury runs the manager's own liquidity, not its
  clients' funds.
- **Hold investors' records or their portal.** Each investor's capital,
  returns and statements are an investor-funds capability, and the portal
  a channel on the customer pages (FS-1170); treasury holds investors'
  capital only as funding.
- **Replace a bank's treasury system** (TR-12).
- **Move money by itself.** Every movement is approved by the
  institution's people.

## 11 · Open questions

FS-1169 (what Flex Money's treasury team needs, after the meeting),
FS-1170, FS-1171, LQ-38.

## 12 · Sources

- The owner, 2026-11-10 and 2026-11-11 (FS-1164, FS-1169 to FS-1171).
- Prototype: Treasury & Float; Branches & Tellers (the evidence for
  RO-09 and RO-10, now TR-01 and TR-11).
- docs/customers/lofty-corban.md (its treasury team).
- docs/specs/rails.md rule 14; docs/specs/transactions.md (kind
  treasury, the exchange, W28).
