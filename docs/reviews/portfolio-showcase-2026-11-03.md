---
id: portfolio-showcase-2026-11-03
name: A client's portfolio, and the book shown to incoming investors · Max's research, 3 November 2026
kind: review
status: draft
released: unreleased
owner: Solution architect
classification: Internal
review_ids: [MX-008, MX-007, FS-497]
last_reviewed: 2026-11-17
---

# A client's portfolio, and the book shown to incoming investors · 3 November 2026

**Research by Max (CI/CD engineer, the operations lead's deputy),**
drafted with his Claude (MX-008). Max asked for "drilling down on the
performance of a loan per client as a portfolio per client, based on
the loan and its details, for Roan admins to be able to use the
portfolio as a sales showcase for incoming investors". It answers two
questions: how does staff see one client's whole history as a
portfolio, and what may an institution show someone who is not yet its
investor?

**What was read:** mfi MF-14 and MF-15; insights IN-04, IN-16 and
IN-17; privacy PR-17; FS-497; the investors research
([investors-2026-11-03](investors-2026-11-03.md), MX-007); in Roan
Capital's back office, the client page, the reports and each funding
line's loans.

**Not read:** what Roan Capital's investors have asked to see; the Data
Protection Act's provisions on anonymised data, which the law register
does not yet carry. Nothing here is legal advice.

**The short answer:** no spec covers either. The portfolio dashboard
and reports (MF-14, MF-15) give the book's totals and each loan's
statement; the funder view and the investor pack (IN-16, IN-17) are for
investors already under contract. This proposes twelve capabilities, S1
to S12: a client's portfolio for staff (S1 to S5), and a track record
for the book, aggregated so that no borrower can be picked out, for an
incoming investor (S6 to S12).

## 1 · What exists today

| What | Where | Gives | For |
|---|---|---|---|
| Portfolio dashboard and reports | mfi MF-14, MF-15 (designed, R1) | Arrears by age, PAR 1, 7 and 30, income, collections, classification; a statement per loan | Staff |
| Funder view and investor pack | insights IN-16, IN-17 (phase 2) | The book's totals; a signed monthly pack; a pseudonymised loan tape under a data-sharing agreement | Investors under contract |
| The client page | Roan Capital's back office | A client's loans, as a list | Staff |
| A funding line's loans | Roan Capital's back office (MX-007) | The loans one investor's line funds | Staff |

## 2 · A client as a portfolio: for staff

| Id | Capability | What it shows |
|---|---|---|
| S1 | The client's history | Every loan, newest first: product, amount, term, paid out, status, days late now |
| S2 | How they repay | Instalments paid on time, late and missed, as a share; the longest run late; days late, month by month |
| S3 | How they grew | Each repeat loan's amount against the last; the time between loans; limit changes and any override (MF-06) |
| S4 | What they paid | Interest, fees and default interest paid, in total and per loan; what remains owed |
| S5 | Their exposure now | Principal outstanding, security held, guarantors, and the lines that fund their loans (MX-007) |

The client page grows a **Portfolio** tab. It is staff's, and is useful
for credit as much as for sales: the same view decides a repeat loan.
Identifiers stay masked, as on every other page.

## 3 · The book's track record: for an incoming investor

| Id | Capability | What it shows |
|---|---|---|
| S6 | Volume | Loans and amounts paid out, by month and by product |
| S7 | Repayment | Collected against due, by month; PAR 1, 30 and 90 over time |
| S8 | Vintages | Each month's loans followed over time: the share repaid, late and written off by months since payout |
| S9 | Losses | Written off and recovered, by product and by vintage |
| S10 | Repeat borrowers | First loans against repeat loans: their size, their repayment, their losses; how many clients come back |
| S11 | Yield | Interest and fees earned on principal lent, by product |
| S12 | The showcase | S6 to S11 on one page and as a signed PDF, dated, with its definitions; shared by link, never by email (FS-532) |

## 4 · What an incoming investor may see

An incoming investor has no contract and no data-sharing agreement
with the institution. So:

| Rule | Why |
|---|---|
| Totals and rates only; a group of fewer than ten loans is not shown, or is merged with the next | So no borrower can be picked out of a small group |
| No name, ID, phone, loan number, location finer than a county, or date finer than a month | The same |
| A pseudonymised loan tape is not shown: it is personal data still (PR-17) | Only an investor under a data-sharing agreement receives one (IN-17) |
| A borrower's own story only with their written consent, kept with the client's documents, or with its details changed so that no one could know them, and said so | The borrower decides |
| Each showcase is recorded: who made it, for whom, when, and what it held | So what was said to an investor can be shown later |

## 5 · Where it would land

| Capability | Proposed home |
|---|---|
| S1 to S5 | The staff workspace, from the lending service; in Roan Capital's back office, the client page |
| S6 to S11 | insights, as governed metrics (IN-02) over the analytical copies (IN-03) |
| S12 | insights, beside the investor pack (IN-17) |

**First for Roan Capital,** in its back office: S1 to S5 on the client
page, and S6 to S8 and S12 from the demo book, so the showcase can be
shown before insights is built.

## 6 · Open questions

**For the owner:**

1. A client's portfolio in R1, as part of MF-15, or later?
2. The showcase in R1 for Roan Capital, ahead of insights?
3. The smallest group shown: ten loans, or another number?

**For counsel:** when do totals and rates over a loan book stop being
personal data under the Data Protection Act, and is a borrower's
consent enough to show their story to a third party?

**For Roan Capital:** what its incoming investors ask to see, and
whether any borrower would agree to be a case study.
