---
id: treasury
name: Kapu Treasury
kind: product
status: living
released: unreleased
owner: Product lead
classification: Internal
audience: [bank, sacco, mfi, psp, imt, sme, fintech]
depends_on: [rails, core, recon-observability, mandates, financial-crime]
consumed_by: []
review_ids: [FS-1164, FS-1169, FS-1170, FS-1171, FS-1172, FS-1173, FS-1175, FS-1176, FS-1181, FS-1182]
last_reviewed: 2026-11-11
---

# Kapu Treasury

## 1 · In one paragraph

Treasury manages money and the risks that come with it: whether there is
the right cash, in the right place and currency, at the right time, at a
risk the owner accepts (FS-1169). Kapu Treasury is designed around two
ideas (FS-1181). **Books:** it runs the institution's own money and,
apart from it, every pool it holds or manages for others: each fund, each
retirement scheme, customers' money held in trust, another bank's vostro.
**Rulebooks:** each regulator's definitions, ratios, limits and reporting
dates are data, versioned and cited, so an institution's regulatory
profile chooses the rules that bind it and a change in the rules is a
change of data. On those two, one common core (positions, forecast,
float, funding, investments, limits, governance) serves every customer
type, from a lender with one finance person to a bank with a dealing
room. The money is always its owner's, in its own accounts; Kapu
Treasury shows it, forecasts it and asks for it to move, through the
owner's approvals.

## 2 · Who it is for

**Segments:** every customer type we serve (FS-1181). Each takes the
common core, the books its business holds, and the rulebook of its
regulator; the packages in §3 group them for sale.

| Customer type | Regulator | Rulebook, as we hold it | Books | Package |
|---|---|---|---|---|
| Microfinance lender, digital credit provider (Roan Capital) | Central Bank | Non-deposit-taking credit providers (LR-03): no capital or liquidity ratio; liquidity risk in its risk framework; told before any third party finances it (reg 22(4)) | Its own; investors' capital as funding (FS-1170, LQ-38) | Essentials |
| Microfinance bank | Central Bank | Microfinance Act and LN 58 of 2008 (LR-07, LR-33): core capital 10% of risk-weighted assets, 8% of deposits, total 12%, at least KES 60 or 20 million; liquidity 20%; an asset and liability committee | Its own | Deposit-taker |
| Bank | Central Bank | Banking Act and the prudential guidelines (LR-04): 10.5% and 14.5% with the buffer; core capital to KES 10 billion by 2029; liquidity 20%; FX exposure within 10% of core capital | Its own; vostros | Bank |
| Deposit-taking Sacco | SASRA | LN 95 of 2010 (LR-09): core capital 10% of total assets, institutional capital 8%, 8% of deposits, at least KES 10 million; liquidity 15%, averaged each Wednesday; a liquidity policy, a credit line, a contingency plan | Its own | Deposit-taker |
| Non-deposit-taking Sacco | SASRA | LN 82 of 2020 (LR-10), to read | Its own | Essentials |
| Chama or investment group | None | Its own constitution | Its own | Essentials |
| Payment service provider, e-money issuer | Central Bank | National Payment System regulations (LR-12): customers' e-money in trust, to read | Its own; customers' money in trust | Transfer and FX |
| Money remittance operator (Flex Money) | Central Bank | Money remittance regulations (LR-50): core capital KES 20 million; customers' funds in an account at a bank, reconciled; netting with partners | Its own; customers' money in trust; partners' prefunding | Transfer and FX |
| Forex bureau | Central Bank | Forex bureau guidelines (2011), the Foreign Exchange Code (2023), to read | Its own | Transfer and FX |
| Fund manager and its schemes (Lofty Corban) | CMA | Collective investment schemes (LR-51): the manager's liquid capital 5 million or 8% of liabilities; each fund's composition and limits; a custodian for each | Its own; each fund | Funds |
| Retirement scheme, its administrator | RBA | Occupational and individual schemes regulations and their investment guidelines (LR-45), to provide | Its own; each scheme | Funds |
| Insurer | IRA | To read, when Lofty Corban's insurance line comes | Its own; each fund | Funds, later |
| A business banking with an institution (SME) | None | — | Its own, offered by its institution under the institution's name (FS-1174) | Business |

**The problem, concretely:** a payout fails because the M-Pesa float ran
out at four in the afternoon; a Sacco learns of a liquidity shortfall
when members queue to withdraw; a fund manager's treasury team matches
yesterday's money by hand before it can decide today's placement; a
remittance corridor's partner runs short of prefunding on a Friday; a
return to a regulator is assembled by hand from five systems. Each is a
treasury question asked too late. Flex Money's prototype showed a
treasury and float view (RO-09's evidence), and Flex Money and Lofty
Corban each have a treasury team (FS-1169, FS-1171).

**People who use it:**

| Role | What they need from it |
|---|---|
| Treasurer, or the finance manager acting as one | Today's positions in every book, the forecast, what to fund and from where, what to invest and until when |
| The owner's approvers | Each treasury movement, level, limit, rate and policy to approve |
| Asset and liability committee, investment committee, board | The month's liquidity, funding, maturity and capital picture; their decisions recorded and followed |
| Compliance | The rulebook's ratios each day, the returns' dates, warning before a breach |
| A fund's or scheme's trustee and custodian | Each book's cash and holdings reconciled with theirs |
| Our operations team | Which paying accounts are near their levels, across the institutions we run |

## 3 · What it does

Every row is **Planned** unless it says otherwise: designed in this
module, not yet specified. Ids are kept as first given; the groups say
where each belongs (FS-1181).

**The common core · every customer type**

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| TR-01 | Treasury and float: where the money sits, and hours of float left at the current burn; for an institution that reaches the rails through a larger bank, the settlement account's balance against the transfers queued for release (rails RL-27) | Designed | Prototype: Treasury & Float. Owner, 2026-10-06: phase 1, in R2 (FS-585); moved from recon-observability RO-09 (FS-1171) | 1 |
| TR-13 | Books: the institution's own and each pool it holds or manages for others (a fund, a scheme, customers' money in trust, a vostro, a partner's prefunding), each with its owner, regulator, accounts and limits; positions, forecasts and limits kept by book and never mixed; each book held for others proved whole each day, what is owed against what its accounts hold | Planned | FS-1181; money remittance reg 30 (LR-50); the custodian under LR-51 | 2 |
| TR-02 | Float levels and top-ups: each paying account's levels (top up, low, critical, floor) and velocity limits, set by treasury and enforced by the rails (rails rule 14); each top-up, and each sweep of a collections account above its upper level, a transaction of kind treasury, approved (transactions W28) | Planned | FS-1158, FS-1164 | 2 |
| TR-03 | A cash forecast from each book's own records, by day for the weeks ahead: payouts approved and in the pipeline, repayments due, deposits and placements maturing, interest, dividends and yields due, check-off expected, subscriptions and redemptions by the dealing cut-off, each against the usual for its type of day (core KC-15); actuals beside the forecast, the gap explained | Planned | FS-1169, FS-1175 | 2 |
| TR-04 | Funding: each source (a bank's line, a development lender, the interbank market, a bond, investors' capital) with its limit, rate, draws, repayments, maturities and covenants; each draw and repayment a transaction (FS-1170; LQ-38 first for investors) | Planned | FS-1084, FS-1169, FS-1172 | 2 |
| TR-05 | Investments: Treasury bills and bonds, fixed deposits and call placements by book, bought, held, matured and rolled over; coupons and interest received; maturities in the forecast; each purchase and maturity a transaction | Planned | FS-1169 | 2 |
| TR-25 | Valuation by policy: each book's investments valued as its accounting policy and rulebook say, the RBA's rule on unrealised bond gains in a scheme's declared returns among them | Planned | FS-1172, FS-1181 | later |
| TR-18 | Limits: every treasury limit (counterparty, concentration, currency, maturity gap, a fund's composition) one rule in financial crime's shape (FC-16), each citing its source, a rulebook's provision or the owner's policy; a breach alerted and escalated to the committee | Planned | FS-1160, FS-1172 | 2 |
| TR-19 | Counterparty limits: how much of each book may sit with each bank, correspondent or settlement bank, exposure shown against each | Planned | FS-1172 | 2 |
| TR-17 | Governance: each policy, plan and committee the owner's rulebook or its own rules require (a Sacco's annual liquidity policy and its person responsible, a microfinance bank's asset and liability committee, a fund's investment committee), each with its review date, approval through the approval engine, meetings and decisions | Planned | LR-09 reg 13; LR-33 reg 29; FS-1181 | 2 |

**Rulebooks · each regulator's rules, as data**

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| TR-14 | Rulebooks: each regulator's definitions (what counts as liquid, what each ratio divides by), thresholds, limits, averaging and reporting dates, versioned and effective-dated, each value citing its provision on a law card; an institution's regulatory profile chooses the rulebooks for its own book and for each book it holds; typed by a schema with worked examples, as the product vocabulary is | Planned | FS-1181; code/lender-rules (the pattern) | 2 |
| TR-15 | The regulatory map of the chart of accounts: each account's liquid-asset class, risk weight and maturity band, mapped once per institution, so a rulebook's ratio is computed from either ledger mode | Planned | FS-1181 | 2 |
| TR-06 | The rulebook's liquidity, daily: each ratio computed from the ledger by its own definition (a bank's and a microfinance bank's 20%, a Sacco's 15% averaged each Wednesday), with the trend and a warning before a breach | Planned | FS-1169, FS-1173 | 2 |
| TR-21 | Capital: the rulebook's capital ratios (risk-weighted for a bank or a microfinance bank, on total assets for a Sacco, liquid capital for a fund manager), and a projection against any phase-in, a bank's core capital rising to KES 10 billion by 2029 | Planned | FS-1172, FS-1173 | 2 |
| TR-16 | The returns calendar: each return's date on the business calendar (core KC-15), from every ten working days to monthly, warned of ahead; each assembled by financial crime's returns (FC-13) from the rulebook | Planned | FS-1181 | 2 |
| TR-07 | The asset and liability pack: the maturity gap by period, the interest-rate gap, the concentration of deposits and funding; for the committee each month | Planned | FS-1169 | 2 |
| TR-20 | Liquidity under stress: scenarios (a run on deposits, a funding line withdrawn, a rail down, a currency short), how long each book survives, and its contingency plan's triggers, actions and owners; required of a Sacco | Planned | LR-09 reg 13(4); FS-1172 | 2 |
| TR-22 | Interest-rate risk: net interest income and economic value under rate shifts, with assumptions on how long deposits stay | Planned | FS-1172 | later |
| TR-24 | The Basel liquidity ratios (LCR, NSFR) and intraday liquidity, as a rulebook when the Central Bank applies them | Planned | FS-1172, FS-1181 | later |

**Transfer and FX · remittance operators, payment providers, forex bureaus, any book in more than one currency**

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| TR-08 | Positions by currency and the net open position, intraday, against the owner's limits and its rulebook's | Planned | FS-1169; CBK's prudential guidelines (10% of core capital) | later |
| TR-09 | Rates: buying and selling rates by currency and channel, with their source, spread, approval and start; every exchange traced to the rate in force (FS-1163); quoted with the rate locked for a set time, as the Foreign Exchange Code expects (to read) | Planned | FS-1163, FS-1175 | later |
| TR-10 | Corridor and correspondent prefunding: each remittance partner's and correspondent's account against the payouts expected through it, with levels and top-ups as TR-02 | Planned | FS-1169; rails RL-28 | later |
| TR-26 | Corridors and partners: each corridor's partner, cut-offs, limits and the lead time to prefund it abroad, in the forecast | Planned | FS-1175 | later |
| TR-27 | Partner settlement: each partner's statement, fees and commissions reconciled, payments netted as the rules allow (LR-50 reg 32) | Planned | FS-1175 | later |
| TR-28 | Rebalancing deals: currency bought from and sold to the owner's own banks, recorded, confirmed and settled; never dealing for others | Planned | FS-1175 | later |
| TR-29 | Revaluation: each currency position valued at the day's closing rate, gains and losses shown realised and not; the margin earned by each corridor after rates, fees and partners' costs | Planned | FS-1175 | later |
| TR-30 | Nostro and vostro accounts: a register of each, ours with them and theirs with us, its currency, counterparty, purpose and limits; for a nostro, our mirror of it matched each day against its statement (MT940, MT950 or camt.053), open items aged by kind, charges and interest checked against the agreement; for a vostro, the balances we keep for its holder, the statements we send it, its limits, charges and interest, and due diligence on what flows through it. A smaller institution's settlement account at a larger bank, a nostro in shillings, first | Planned | FS-1176; rails RL-27, RL-28 | 2 |
| TR-11 | Branch and till cash by currency and denomination | Designed | Prototype: Branches & Tellers; moved from recon-observability RO-10 (FS-1171) | 2 |

**Funds · fund managers, retirement schemes, later insurers**

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| TR-31 | Each fund's and scheme's own book: its cash at its custodian and banks, subscriptions and redemptions by the dealing cut-off, redemptions under notice and their cover, placements maturing, distributions due; the manager's own book beside it, never mixed | Planned | FS-1175; LR-51 | later |
| TR-32 | Composition and placement limits by fund and scheme, from the CMA's and the RBA's rulebooks, as TR-18's limits | Planned | FS-1175; LR-51; LR-45 | later |
| TR-33 | Custodian reconciliation: the custodian's statements of holdings and cash matched each day against each fund's records | Planned | FS-1175 | later |
| TR-34 | Units at the cut-off: each subscription and redemption priced in units at the day's NAV from the fund system (the transaction's units, FS-1163), the fund system staying the source of NAV | Planned | FS-1175; Lofty Corban LF-01 | later |
| TR-35 | Retirement schemes: employers' contributions by schedule, split per member as check-off is, and benefits paid | Planned | FS-1175 | later |

**Business · an institution's business clients, under its name**

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| TR-36 | A business's own book: its positions across its bank, till and paybill, and a forecast from its receivables and payables in its own books (business-suite), offered by its institution under the institution's name, as the gateway is white-labelled (GW-15) | Planned | FS-1174 | later |

**A bank with its own treasury system**

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| TR-12 | Integration with the bank's own treasury system: our products' positions, flows and forecasts sent to it; its deals' settlements reconciled by reconciliation; ours never replaces it, as the split mode never replaces a core | Planned | FS-1169 | later |
| TR-23 | Funds transfer pricing: each product charged for the money it uses and credited for what it brings | Planned | FS-1172 | later |

**The packages** (for sale; the capabilities above are one product):

| Package | Takes | For |
|---|---|---|
| Essentials | The common core, with the rulebook of its regulator where it has one | Every customer type; alone for a microfinance lender, a digital credit provider, a non-deposit-taking Sacco, a chama |
| Deposit-taker | Essentials and the rulebooks' liquidity, capital, returns, ALM and stress | Microfinance banks, deposit-taking Saccos |
| Transfer and FX | Essentials and the FX group | Remittance operators, payment providers, forex bureaus |
| Funds | Essentials and the funds group | Fund managers, retirement schemes, later insurers |
| Business | A business's own book | An institution's business clients, under its name |
| Bank | Deposit-taker, Transfer and FX, and the bank group | Banks, beside their own treasury systems |

## 4 · Where it sits

**Depends on:** rails (balances of every account on a rail; treasury
movements sent), core (the ledger and the business calendar, KC-15),
recon-observability (statements, matches and the three ledgers'
balances), mandates (every movement, level, limit, rate and policy
approved), financial-crime (limits in its rule shape, FC-16; returns
assembled, FC-13).
**Used by:** none yet; the lending and deposits products read its forecast
when they are next revised.

**In the architecture** (FS-1182): a product, beside collect, gateway and
escrow (architecture README §1), run by a treasury service of its own
that reads every system of record and never holds money. It reads the
funds ledger through the core adapter, the rails' balances, the recon
engine's statements and three ledgers, Odoo's funding agreements, a fund
system's units and a custodian's statements. It writes nothing straight
to a ledger: each movement it asks for is a transaction, approved by the
approval engine, sent by the rails and posted by the service that owns
the account. Its rulebooks live beside lender rules, as data in code
with a schema and worked examples.

**Who holds which record** (docs/architecture/README.md §2):

| Record | System of record | This module |
|---|---|---|
| Funds and balances | The banks, the rails, the core; a fund's custodian; a fund system's units | **Never holds.** Reads balances; asks for movements through the approval engine and the rails |
| Books | **Treasury** | Which accounts belong to which book, its owner and regulator |
| Positions and the forecast | **Treasury** | Computed from the systems of record, each day's kept |
| Rulebooks and the regulatory map | **Treasury**, as data | Versioned, effective-dated, each value cited |
| Funding lines and investments | **Treasury**, agreements in Odoo | Their terms and schedule; each movement a transaction |
| Levels, limits and rates | **Treasury**, as rail settings and transaction rules | Set through the approval engine; the rails and financial crime enforce them |
| Returns | Financial crime (FC-13) | Supplies their figures from the rulebook |

**What this module never stores:** anyone's money, a balance as an
authority (it is always read from its system of record), a credential.

**Under each ledger mode** (docs/architecture/README.md §4):

| | Integrated: the institution has a core | Native: no core; Fineract is the ledger |
|---|---|---|
| Where funds are posted | The institution's core, through the core adapter, by the service that owns the account | Kapu Core, the same way |
| What differs in this module | Balances, maturities and the general ledger read from its core, through the regulatory map | Read from Kapu Core |
| What the customer must provide | Read access to its core's balances and general ledger; its funding agreements | Its funding agreements |

A fund's or scheme's book has its own system of record (the fund system,
the custodian): read, never written.

## 5 · How it works

```
  SYSTEMS OF RECORD                 TREASURY                        ACTIONS
  core, through the adapter -->+                                 +--> top-up, sweep, placement:
  rails' balances           -->+--> books --> positions,         |    a transaction, approved,
  recon: statements, ledgers-->+              forecast, limits --+    sent by the rails
  Odoo: funding agreements  -->+                 ^                +--> alerts at each level
  fund system, custodian    -->+                 |                +--> committee packs
                                       rulebooks + regulatory map +--> returns' figures (FC-13)
```

Each morning, treasury opens with the night's positions in each book,
read from each account's system of record and reconciled; the day's
forecast; each paying account against its levels; each book's ratios by
its rulebook; and what it proposes: a top-up, a sweep, a placement to
mature before a known outflow. Each proposal is a transaction the
treasurer starts and the owner's approvers approve; the rails send it.

## 6 · Rails and integrations

| Rail / system | Direction | Feed | Status |
|---|---|---|---|
| Banks | in / out | balances and statements by API or file (rails RL-07); transfers for top-ups and placements | Planned |
| M-Pesa (Daraja) | in | each shortcode's balance (rails RL-03) | Built (the rail); its use here Planned |
| The Central Bank's securities depository | in / out | Treasury bill and bond holdings and auctions, through the owner's bank or directly where it is a member (to confirm) | Planned |
| Correspondent banks | in / out | through the larger bank, by SWIFT (rails RL-28); statements MT940, MT950 or camt.053 | Planned |
| Rate sources | in | the owner's bank's rates, the Central Bank's indicative rates (to confirm per institution) | Planned |
| A fund system (UnitMaster for Lofty Corban) and a custodian | in | units and NAV at the cut-off; holdings and cash statements | Planned |
| A bank's own treasury system | out / in | positions and forecasts out; settled deals back | Planned |

## 7 · Regulatory position

- **Custody:** none. Every book's money is its owner's, in its own
  accounts; treasury asks for it to move through its owner's approvals
  (FS-056, FS-588).
- **Licence relied on:** each owner's own.
- **Regulators:** as §2's table. Each rulebook is read into the law
  register and its law cards before it is specified, never set from
  memory; held so far: LR-03, LR-04, LR-07, LR-09, LR-33, LR-50, LR-51, and
  CBK's prudential (2013), forex bureau (2011) and foreign exchange
  guidelines; to provide: the RBA's, the CMA's and CBK's further documents
  (FS-1180).
- **Data:** positions, forecasts, funding and investments are
  Confidential; no personal data beyond the names on agreements, and a
  fund's investors only as its fund system holds them.
- **Open legal checks:** LQ-38.

## 8 · Controls

- **Attribution:** every movement, level, limit, rate and policy is
  started by a named person in the treasurer's role and approved by
  another, stepped up (access AC-05).
- **Mandates:** each through the approval engine: movements as
  transactions (kind treasury), levels and limits as rail settings
  (`rail.setting`), rates, rulebook values and policies as their own
  subjects; the chain at least two people, more where the owner's
  mandate says.
- **Books apart:** a movement names its book; nothing moves between two
  owners' books but as a transaction both owners' approvers approve.
- **Segregation:** the person who proposes never approves; where there is
  a dealing desk, the one who agrees a deal never settles or reconciles
  it.
- **Audit:** every position, forecast, rulebook version and decision kept
  as it was on the day, so what treasury knew when it decided can be
  shown later.
- **Exceptions:** a balance that cannot be read is unknown, never the
  last figure; a forecast missing a source says which.

## 9 · Deployment

Part of each institution's instance, in-country (FS-032). Rate sources,
fund systems, custodians and a bank's own treasury system are reached as
the rails reach banks.

## 10 · What it does not do

- **Trade.** It is not a dealing system: no foreign-exchange or money
  market deals for others, no derivatives, no market data sold.
- **Manage clients' portfolios.** A fund manager's investment decisions
  are its own; Kapu Treasury runs each fund's liquidity and limits, not
  its strategy.
- **Hold investors' records or their portal.** Each investor's capital,
  returns and statements are an investor-funds capability, and the portal
  a channel on the customer pages (FS-1170).
- **Compute a fund's NAV.** The fund system does (TR-34).
- **Replace a bank's treasury system** (TR-12).
- **Move money by itself.**

## 11 · Open questions

FS-1169 (what Flex Money's treasury team needs, after the meeting),
FS-1170, FS-1174, FS-1180 (the documents to provide), FS-1182 (who posts a
treasury movement), LQ-38.

## 12 · Sources

- The owner, 2026-11-10 and 2026-11-11 (FS-1164, FS-1169 to FS-1182).
- Prototype: Treasury & Float; Branches & Tellers (RO-09 and RO-10, now
  TR-01 and TR-11).
- The rules read (FS-1173, FS-1177): LR-03, LR-04, LR-07, LR-09, LR-33,
  LR-50, LR-51; CBK's prudential guidelines (2013).
- FloQast, "What is treasury management in banks?", 20 October 2025
  (FS-1174).
- docs/customers/lofty-corban.md; docs/specs/rails.md rule 14;
  docs/specs/transactions.md (kind treasury, the exchange, units, W28).
