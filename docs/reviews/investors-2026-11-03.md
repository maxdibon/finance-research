---
id: investors-2026-11-03
name: Investors — their record, their money, and where it is lent · Max's research, 3 November 2026
kind: review
status: draft
released: unreleased
owner: Solution architect
classification: Internal
review_ids: [MX-007, MX-006, MX-005, FS-497]
last_reviewed: 2026-11-13
---

# Investors: their record, their money, and where it is lent · 3 November 2026

**Research by Max (CI/CD engineer, the operations lead's deputy),**
drafted with his Claude (MX-007). Max asked for "an investors dashboard
that captures their data, source of funds and tracking their invested
amount, how it is being loaned out, in addition to the reporting". It
answers: what must an institution hold about each investor, how does
their money come in, get lent and come back, and what does each person
see?

**What was read:** FS-497 and what it decided, the funder view, the
investor pack and the governance view (insights IN-16 to IN-18);
privacy PR-17; identity (ID-01, ID-07, ID-15, ID-17, ID-19) and
financial crime (FC-05, FC-06, FC-08, FC-12, FC-16); the lending
service, the back office, recon (RO-09) and the Sacco module (SC-02,
SC-11); the instrument cards for the AML Act and Regulations (LR-13,
LR-14) and the lender regulations (LR-03); MX-005 and MX-006.

**Not read:** Roan Capital's Business Requirement Document, which is
outside git; the Capital Markets Act (LR-44, unread in the register);
whether the lender regulations say anything of a lender's own funding.
Nothing here is legal advice; §7's questions are counsel's.

**The short answer:** the platform designs what an investor **sees**
(FS-497) but not the investor, nor their **money**. This proposes
fourteen capabilities, F1 to F14: the investor's record and due
diligence, their source of funds, each funding line and its terms, the
money in, how each loan is funded from the lines, each investor's
position, what is paid back, the covenants, the controls, and the books;
then two dashboards on top, one for the institution's staff and one for
the investor. Borrowers' personal data never reaches an investor.

## 1 · What exists today

| Who puts money in | Designed | Where | When |
|---|---|---|---|
| Investors and lenders to an institution | What they see: portfolio totals, a monthly signed pack, a pseudonymised loan tape under a data-sharing agreement, a governance view | insights IN-16, IN-17, IN-18; privacy PR-17 (FS-497) | Phase 2, R5 |
| A Sacco's members | Share capital and the annual dividend | sacco SC-02, SC-11 | Phases 1 and 2 |
| A deposit-taker's depositors | Savings and fixed deposits | core KC-02 | R4 |
| The institution's own cash | Treasury and float | recon RO-09 | R2 |
| **A lender's funders: shareholders, bank lines, impact investors, notes** | **Nothing** | — | — (MX-006) |

## 2 · Who an investor is here

**An investor** is a person, a company or a fund that puts money into
an institution under an agreement. **A funding line** is one agreement
with one investor: an investor may hold several. Each line is one of:

| Instrument | The investor is owed | Example |
|---|---|---|
| Equity | A share of profit, as dividends the board declares | A shareholder's capital |
| A loan or a note | Its principal back, and interest at the agreed rate | An impact investor's three-year loan at 14% |
| A facility | Interest on what is drawn; principal as drawn amounts fall due | A bank's credit line |
| A participation | A share of the interest and the losses of the loans it funds | An investor funding a named product only |

## 3 · What to build

| Id | Capability | What it does | Builds on |
|---|---|---|---|
| F1 | The investor's record | A person or a company: identity checked from source (national register; for a company, its registry record, directors and beneficial owners); every document in the vault; a risk rating; approved by a second person before any money is taken | identity ID-01, ID-07, ID-15, ID-19 |
| F2 | Source of funds and of wealth | Where this money comes from, declared and evidenced: a bank statement, audited accounts, a sale agreement, a fund's own investors; checked by compliance before the line opens and again for each new commitment; enhanced for a politically exposed person, with senior management's approval | LR-14 reg 26; FC-06; kyc-tier-up's tier 3 |
| F3 | Screening | Sanctions, politically exposed persons and adverse media at onboarding and whenever a list changes; a match frozen and made a case | FC-05, FC-06, FC-08 |
| F4 | The funding line | Its terms: instrument, amount committed, currency, start and end, the return (rate, share, dividend), fees, how it is repaid; which loans it may fund (products, sectors, regions, the largest loan, the largest share in one borrower); how it is allocated (F6); its covenants (F10); signed in the vault; a change of terms is a new version, approved by a second person | product-versions' versioning; approval engine |
| F5 | Money in | Each receipt matched to its line from the bank's credit: the payer's name and account checked against the investor; a payment from anyone else held and made a case, never credited; a drawdown on a facility recorded as it lands | recon; FC-16; LR-14 reg 32 |
| F6 | How each loan is funded | At each payout, the loan takes its funding from the lines, by one of two methods the institution sets per product: **pooled**, every loan shared by the eligible lines in proportion to their cash available that morning; or **dedicated**, the loan given to the line whose rules it meets, first by its start date. The split is fixed at payout and kept on the loan; it changes only by a two-person decision, recorded | lending service; Fineract holds one fund per loan, so a shared loan's split lives in the funding ledger |
| F7 | Each investor's position | Daily, from the ledger, per line: committed; received; lent out (outstanding principal of the loans it funds); cash not yet lent; principal repaid; interest and fees earned; arrears and non-performing loans (lender regulations reg 57) in its loans; losses written off; owed to the investor; paid to them | lending service; end-of-day runner |
| F8 | Paid back | What each line is owed, computed from its terms: interest, principal, dividends once declared; a payout prepared and released by two people, as every payout; withholding tax where it applies (§7); a statement for each payment | rails; approval engine; the two-step payout (FS-936) |
| F9 | Statements | Monthly and on request: the line's movements, its position, and its share of the portfolio's performance; issued as a link, never by email | vault ID-17; FS-532 |
| F10 | Covenants | Each line's limits measured daily: the arrears rate, non-performing loans, the largest borrower, a sector's share, the capital ratio; a breach alerts the institution's finance lead the same day and is flagged in the investor pack | insights IN-17 |
| F11 | The staff dashboard | §5 | insights; the staff workspace |
| F12 | The investor's dashboard | §5; the funder view (IN-16) widened to the investor's own position, statements and documents | insights IN-16, IN-17 |
| F13 | Controls | Two people for: an investor approved, a line's terms, an allocation changed, a payout released. Every view and change logged. An investor sees their own lines only | access; audit |
| F14 | The books | Each line booked in the back office's general ledger as equity or a borrowing, with interest payable accrued; the funding ledger and the general ledger compared every night | back office; recon |

## 4 · How the money moves

```
  INVESTOR --money in (F5)--> FUNDING LINE --at each payout (F6)--> LOANS
     ^                         | committed        pooled or dedicated   |
     |                         | received                               | repayments,
     |                         | lent out <-------------------------------+ interest,
     |                         | cash not lent                          | arrears, losses
     +----paid back (F8)-------+ owed, paid (F7)                        v
         two people release                                     LEDGER (Fineract)
```

Each repayment of a loan credits the lines that fund it, in the loan's
split: principal back to their cash, interest and fees to what they
earned, a write-off to their losses.

## 5 · The two dashboards

| Shows | Staff (finance, compliance, the board) | The investor |
|---|---|---|
| Investors and their status: due diligence, screening, risk rating, review date | All | Their own |
| Each line: committed, received, lent out, cash not lent, repaid, earned, owed, paid | All, and totals | Their own |
| How the money is lent: by product, sector, region, loan size, tenor | All, down to the loan | Their own lines, aggregated |
| Performance: arrears at 1, 30, 60 and 90 days, non-performing loans, write-offs, yield | All | Their own lines, aggregated |
| Covenants and breaches | All | Their own |
| Payouts due and made | All | Their own |
| Statements, the monthly pack, the agreement | All | Their own, by link |
| A borrower's name, ID, phone or loan record | By role, as today | **Never** |

## 6 · The data

| What | Class | Kept |
|---|---|---|
| An investor's identity, documents and source of funds | Restricted | Seven years from the end of the relationship (LR-13 s.46; LR-14 reg 42) |
| A line's terms and its movements | Confidential | Seven years from the last movement |
| What an investor sees of the portfolio | Aggregated: no personal data | As the reports |
| A pseudonymised loan tape | Personal data still (PR-17) | Only under a data-sharing agreement, as it sets |

An investor's personal data is processed for the investment
agreement and for the AML duties: a new row in privacy, beside PR-17.

## 7 · The law: questions for counsel

1. **Taking money from investors at all:** a lender that takes no
   deposits may not take money from the public as deposits. When is an
   investor's loan or note a deposit, and how many investors, or what
   kind of offer, makes it one? (the lender regulations, LR-03; the
   Banking Act, LR-04)
2. **Many investors in one pool:** does offering several investors a
   share of a loan book make it a collective investment scheme or a
   public offer under the Capital Markets Act (LR-44, unread)?
3. **AML:** is the lender a reporting institution for its investors'
   money as for its borrowers' (LR-13, LR-14), and so must it establish
   source of funds for every investor, or only on risk?
4. **Tax:** withholding tax on interest paid to an investor, resident
   and not.

## 8 · Where it would land

| Capability | Proposed home |
|---|---|
| F1 to F3 | identity and financial crime, as for a borrower; the investor a new kind of customer |
| F4 to F8, F10, F13 | the lending service: it already owns each loan and each payout, so the split is kept where the loan is; a funding ledger beside the loans |
| F9, F11, F12 | insights, widening IN-16 and IN-17 |
| F14 | the back office, through the gateway |

**Two phases:** first what an institution needs to take investors'
money lawfully and know where it is (F1 to F7, F11, F13, F14); then
what the investor sees and is paid without staff (F8 to F10, F12). The
first could come forward for Roan Capital if its funders need it at
go-live (MX-005).

## 9 · Open questions

**For the owner:**

1. Funders' money in scope, and in which release (MX-006)?
2. Its home: the lending service, as §8 proposes, or a module of its own
   with its own capability ids?
3. Both allocation methods, or pooled only to begin?
4. The investor's dashboard in R1 for anyone, or the staff dashboard
   only?

**For Roan Capital (MX-005):** who funds its book today, under what
agreements; what each funder is owed and shown; and whether any is a
participation in named loans.
