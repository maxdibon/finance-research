---
id: market-and-pricing-2026-11-11
name: Market sizing and pricing, reviewed — 11 November 2026
kind: review
status: draft
released: unreleased
owner: Commercial lead
classification: Internal
review_ids: [FS-1190]
last_reviewed: 2026-11-11
---

# Market sizing and pricing, reviewed · 11 November 2026

**What was reviewed:** every assumption behind the market-sizing model
(docs/business/market-sizing.xlsx, built 2 October, FS-345, FS-346):
its 24 sources, its ten segments and their inputs, and its team inputs
against the operating model; and every price we have written down: the
working model in FS-1185 (0.1% of money moved, across the rail
boundary), the competitor table's prices, the suppliers' prices we pass
on or carry, and any price agreed with a customer. **Not reviewed:**
what a customer would pay, which only asking them shows; Dibon's own
costs, which are not written down anywhere; and the market's growth.

**The short answer:** the institution counts are sound: each is from a
regulator or a statistics office, dated and quoted. Everything else in
the model is a placeholder, and the team it assumes is larger than the
team we have. On pricing, the working model is a good shape, but at the
small end it earns far less than what competitors list and than what
running an institution costs us, so **the floor, not the 0.1%, will set
most lenders' price**, and nothing yet tells us what the floor must be.
No customer has a price on record, Roan Capital included.

## 1 · The market-sizing model

| Part | What it rests on | Quality |
|---|---|---|
| Institution counts (S01 to S16) | CBK's 2025 annual report and directories, SASRA's 2025 report, KNBS's 2026 Economic Survey | Sound: primary, dated, quoted |
| AMFI-Kenya members (S09) | The association's "over 80"; its own 2025 report lists 74 | Weak: the headline, not the list |
| VAT-registered businesses (S17) | A news report quoting KRA | Weak: no primary figure |
| Licensed MSMEs (S19) | KNBS's 2016 survey, the latest | Stale |
| Payment volumes (S20 to S24) | KNBS, CBK, PesaLink | Sound, context only; PesaLink to 2024 |
| Share Dibon can reach, per segment | "Placeholder by Claude, no evidence" | None |
| Sales cycle, opportunities per seller, win rate, onboarding effort | Placeholders | None |
| Sellers (2) and delivery staff (4) | Placeholders | Above what we have (M3) |
| Annual contract value | Blank: pricing was parked (FS-024) | — |

## 2 · Pricing

| What | Where | State |
|---|---|---|
| 0.1% of money moved, across the rail boundary; bands that step the rate down; a minimum per tier; a minimum annual commitment | FS-1185 | The working model; bands and floors illustrative |
| "Per institution, with Odoo priced in" | market/competitors.md, Dibon's column | Superseded by FS-1185 |
| A compliance offer at KES 500,000, shown as USD 386.97 | A one-pager in sources/ | A 10× error, open (FS-016, FS-279) |
| Musoni from about EUR 15,000 a year; Craft Silicon a set-up fee then per transaction | market/competitors.md | The only benchmarks; others "not stated" |
| Craft Silicon's quote of about KES 150 million to a microfinance bank (CU-02) for a new platform | Eric, 11 November; not seen | Unverified: what it covered (licence, implementation, years of support) unknown |
| Identity checks: KES 20 a check from the national register; USD 1.35 a check from Smile ID, USD 149 a month minimum | market/partners.md | Known; pass-through at cost (FS-331) |
| Odoo Enterprise per user; SMS per message; managed security per endpoint; hosting | deployments/roan-capital-production §9 | Unpriced, and for Odoo, whose to pay is open (FS-529) |
| A price agreed with any customer | docs/customers/ | None |

## 3 · Findings

| Id | Finding | Proposed |
|---|---|---|
| M1 | **Three counts are weak:** AMFI-Kenya's 80 is its headline where its report lists 74; the 250,000 VAT-registered businesses come from a news report; the MSME count is from 2016 | Use 74, with the headline beside it; ask KRA for the VAT figure; mark the MSME count as context only |
| M2 | **Every behavioural input is a placeholder:** the share we can reach, the sales cycle, opportunities per seller, the win rate and onboarding effort, in every segment | Replace them from our own record first: the five customers in customers.md, first contact to signature, and Roan Capital's months from signature to go-live; then as each deal closes |
| M3 | **The team inputs are larger than the team.** The model assumes two full-time sellers; the commercial lead is the CEO, alongside his other roles (ways-of-working §1). It assumes four delivery staff; implementation for financial products is "covered by the project manager" (operating model). Sales is the bottleneck in every segment but SMEs, so customers won scale with sellers: with one seller, every segment but SMEs halves, and the 52 customers the model shows by year 3 fall to about 35 | Set the inputs to the team as it is, and show the hire that moves each bottleneck |
| M4 | **Segments missing:** tier-1 banks (8, S02) are left out without a reason; fund managers and insurers have no segment, though Lofty Corban is a customer (CU-05); payment service providers are counted (S11, 42) but unused; and the lenders the 2026 regulations bring under CBK are uncounted | Add fund managers (CMA, RBA) and payment service providers; state why tier-1 banks are out; add the newly regulated lenders when CBK publishes its register |
| M5 | **Two segments will become one.** Digital credit providers (281) and other MFIs (66) overlap, and the 2026 regulations license or register every non-deposit-taking lender under one regime (LR-03 reg 96) | One segment, non-deposit-taking credit providers, from CBK's register once it exists; until then the overlap stated, not added twice |
| M6 | **The revenue column no longer fits.** The model asks for an annual contract value per customer; the working price is a share of money moved, in bands, above a floor | Per segment: the money a typical institution moves a month (a median and a spread), the bands, and the floor; revenue from those |
| M7 | **The 15% target share is a capacity question, not a market one.** At the model's own capacity it would take from about five years (microfinance banks) to over a thousand (Saccos outside SASRA) | Keep the target as a test, and read it as the hiring it implies |
| P1 | **No customer has a price on record,** Roan Capital included, though it is R1's customer | A price, or a decision to price later, recorded for each customer, beginning with Roan Capital |
| P2 | **The one price we have published is wrong by ten times,** and has been open since early October | Correct or withdraw the one-pager before any pricing goes out (FS-016, FS-279) |
| P3 | **The competitor table still says "per institution, with Odoo priced in"** | Updated once FS-1185 is decided |
| P4 | **At the small end, 0.1% earns little.** The illustration in FS-1185 (a lender lending KES 10 million a month) gives about KES 250,000 a year: well under a sixth of Musoni's listed EUR 15,000. And the operating model needs four to five on the DevSecOps rota for just two institutions. For most lenders the floor will be the price | Decide the floor first, from what an institution costs to run; the 0.1% then matters only above it |
| P5 | **Small loans move small amounts.** Digital lenders lend KES 1,000 to 50,000 (product landscape); on a KES 1,000 loan, 0.1% is KES 1 a movement, likely less than the cost of matching it, recording it and answering for it | A minimum per movement, or a floor that covers it; messages and rail charges passed through at cost (FS-331) |
| P6 | **What we spend to serve an institution is unknown:** no instance is sized (architecture review A7; Roan Capital's deployment §10), hosting is undecided (FS-032), whose Odoo licences is open (FS-529), and managed security and SMS are unpriced | A cost per institution, by tier: hosting at two sites, licences, security, the people the operating model sets; the floor follows |
| P7 | **The bands are mine, and untested** (FS-1185) | Tested against two or three institutions' real monthly volumes from their statements, a bank among them |
| P8 | **Benchmarks are thin:** two competitors' prices, one from a list and one from a single contract; and one quote reported but unseen, Craft Silicon's KES 150 million to a microfinance bank for a new platform. If it holds, a bank-sized institution budgets in the hundreds of millions for a platform, paid largely up front: far above anything our bands give in a year, and a different shape of payment | The quote confirmed, and what it covered (licence, implementation, years of support), before it anchors a bank tier; three to five more benchmarks: a quote, a published price, or a contract a customer shares |
| P9 | **Tax and law are open** for every model: equity in a customer (LQ-43), a fund manager charging our fee to a scheme (LQ-44), whether a fee on money moved is a processing fee for VAT (LQ-45), whether Dibon is a payment service provider (LQ-09), and VAT against withholding (FS-434) | The finance lead and counsel before a price is quoted |

## 4 · What would settle it

1. **What one institution costs us a month,** by tier (P6): the floor.
2. **What three institutions move a month,** from their statements:
   Roan Capital, Lofty Corban, and a Sacco or a bank (P4, P7, M6).
3. **Our own pipeline's dates,** for the placeholders (M2).
4. **The team as it is,** with the hires planned (M3).
5. **Three to five competitor prices** (P8).
6. **The finance lead's and counsel's answers** on tax and law (P9).

## 5 · Next

1. **The owner decides** the floor once item 1 is known, and the price
   for Roan Capital (P1).
2. **The model is rebuilt** with one lending segment, fund managers and
   payment providers added, the team as it is, and revenue from money
   moved, bands and floor (M3 to M6).
3. **The one-pager corrected or withdrawn** (P2).
