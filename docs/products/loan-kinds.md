---
id: loan-kinds
name: Loan kinds — what our product vocabulary can describe, and what it cannot yet
kind: guide
status: living
law: LR-03
released: unreleased
owner: Product lead, lending
classification: Internal
review_ids: [FS-989, FS-990, FS-991, FS-1000]
last_reviewed: 2026-10-27
---

# Loan kinds

**What this is** (FS-989): the kinds of loan an institution may ask us to
run, each with the vocabulary terms it needs (lender-rules §2.4), whether
the vocabulary can describe it today, the capabilities that run it, and
the law it touches. A kind the vocabulary cannot describe cannot be
drafted, previewed or approved as a product version; so this list is
also what to build next. The kinds come from what Kenya's lenders sell
and what our customers ask for; examples name products in the market
only to show the kind.

**The four terms added for these kinds** (FS-989): **Facility** (a term
loan, or a credit line with draws), **Repayment source** (who repays:
the borrower, an employer by check-off, the buyer of an invoice, a share
of the borrower's till takings), **Payee** (who receives the money: the
borrower, or a third party against a proof, from an approved list) and
**Partner** (the third party's part: its data, any fee it pays towards
the price, any first loss it takes, returns). Collateral gains financed
goods, receivables and salary.

## The kinds

| Kind | For example | Terms it needs | Describable now | Runs on | Law it touches |
|---|---|---|---|---|---|
| A short unsecured loan | Roan Capital's Biashara | The terms we have | Yes | MF-01 to MF-39 | LR-03 |
| A secured loan: a vehicle, land | Roan Capital's Motor Vehicle, Title Deed | The terms we have | Yes | MF-03, MF-18 | LR-23, LR-41 to LR-43, LR-47 |
| **Supplier or distributor financing** | A bank's retailer finance: stock bought from a distributor, paid to it | Facility (a line, renewed monthly from purchases), Payee (the distributor, against an invoice), Partner (the distributor's sales data, first loss) | Yes, with the four terms | MF-40, MF-11, recon | LR-03; LR-17 for the distributor's data (LQ-22) |
| Asset finance and hire purchase | Motorbikes, solar, equipment, paid to the dealer | Payee (the dealer), Collateral (financed goods, title kept) | Yes, with the four terms | MF-40, MF-03 | LR-42 (LQ-19, LQ-21), LR-23 |
| Pay-as-you-go devices | A solar kit that locks when payments stop | As asset finance, and a device lock | No: the lock is a device service we do not have | — | LR-42; conduct (reg 30) |
| School fees, medical, insurance premiums | Paid to the school, hospital or insurer | Payee (the institution, against a fee structure or premium notice) | Yes, with the four terms | MF-40 | LR-03 |
| Buy now, pay later at a till | The merchant pays a fee | Facility (a line), Payee (the merchant), Partner (its fee) | Yes, with the four terms; the APR still disclosed | MF-40 | LR-03 regs 48, 59 |
| LPO and invoice financing | Repaid by the buyer | Repayment source (the buyer), Collateral (receivables), Payee | Yes, with the four terms | MF-32 | LR-23 (receivables) |
| Agricultural inputs | Paid to the agro-dealer, repaid at harvest, or by the produce buyer | Payee, Repayment source (the buyer), Repayment frequency at maturity | Yes, with the four terms | MF-40 | LR-03 |
| Check-off and pay-day loans | Repaid by the employer from wages | Repayment source (employer), Collateral (salary), Facility (a line for pay-day limits) | Yes, with the four terms | MF-36, BS-17 | Employment Act s.19(3) |
| Revenue-based, from till takings | A share of each day's M-Pesa takings | Repayment source (a share of the till) | Yes, with the four terms | MF-40, Collect | LR-03 |
| **Savings and loans inside a mobile wallet** | M-Shwari (NCBA with Safaricom), M-Fanisi (Onit Bank, then Maisha Microfinance, with Airtel Money, 2017): an account opened from the phone, savings and lock savings, a limit from the operator's data, 30-day loans for a one-off fee, recovered from savings | Loans: Facility (a line, its limit from the operator's data), Repayment source (automatic recovery), Partner (the mobile operator). Savings: the deposit product terms (deposits-service §4) | Loans yes, with the terms of FS-989 and FS-991; savings once the deposit terms have their schema | The deposits service, the lending service (MF-36, MF-40), decisioning, rails (RL-03; Airtel RL-04), omni-channel (OC-03) | LR-04 or LR-07 for the deposits; LR-03; LR-17 for the operator's data |
| Revolving credit and overdrafts | A business credit line | Facility | Yes, with the four terms | MF-40 | LR-03 |
| Staged or construction loans | Paid in tranches by milestone | A schedule of payouts, each approved | No: payouts in stages are not a term yet | — | LR-03 |
| Group and chama loans | Group liability | Who may borrow (a group), Guarantors | Partly | MF-17 (phase 2) | LR-03 |
| Sharia-compliant finance | Murabaha: the lender buys the goods and sells them at a mark-up | A profit rate in place of interest | No: a vocabulary of its own | — | LR-03; LR-04 for banks |

**What we have run before** (customers CU-03): the USSD channel and
digital lending for a bank's retailer finance, float lending, term loans
and Sharia-compliant (Sahl) lending, 2022 to 2025, on Dibon's menu
platform; the loans were booked on the bank's own loan core, Sopra's (FS-994). The core held one limit per retailer, so the limit for each distributor was held in our layer and every draw checked against both (FS-1000): the lending service does the same, holding limits beneath whatever the core can (per relationship, product or partner).

**What a wallet product still needs** (FS-991): fully automated limits,
explained to the customer (MF-29) and tried in shadow first (DE-05);
recovery from the wallet, which depends on the operator (FS-993); the
product inside the operator's menu (FS-993); and a load test at millions
of accounts and around-the-clock savings (FS-992).

## A worked example: retailer financing

From Dibon's own concept of April 2025 (sources/dibon/
2025-04-01-retailer-financing-for-msmes.pptx; FS-990), and the model a
bank's retailer finance runs (FS-989):

1. **The partner:** a distributor shares, with each retailer's consent, a
   few months of what the retailer bought from it (Partner: data; LQ-22).
2. **The limit:** the lender scores the purchases and sets a credit line,
   renewed each month from new purchases (Facility: a line, renewed
   monthly, its basis the partner's purchases).
3. **A draw:** the retailer asks, by USSD, WhatsApp or the app, to buy
   stock from that distributor; the request carries the distributor's
   invoice (Payee: a supplier, against an invoice, from the approved
   list).
4. **The payout:** the approval engine ties the payout to the
   distributor's account and the invoice's amount; the rails pay the
   distributor, never the retailer (RL-01).
5. **Repayment:** by the retailer, on the draw's term (Repayment source:
   the borrower), or a share of its till takings where agreed.
6. **What can go wrong, and the answer:** false purchase data or an
   inflated invoice (the partner's first loss, recon of what was paid
   against what was delivered); returned goods (refunded to the loan, not
   the retailer: Partner, returns); the distributor's own failure (a
   limit on exposure to one partner); a dispute over the goods (LQ-20).

What the concept left to settle, and this example settles in the
vocabulary: the price and who pays it, the limit's formula and renewal,
the repayment route, the distributor's risk, and the retailer's consent.

## Not yet

- **Pay-as-you-go devices:** a device lock is a service of its own.
- **Payouts in stages:** a schedule of tranches, each approved.
- **Sharia-compliant finance:** a vocabulary without interest.

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](../law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 30 | reg 30 | No harassing, shaming or threatening collection: nothing posted to shame a borrower (30(1)(d)), no messages to their contacts (30(1)(e)), no calls outside working hours, no taking of essential personal effects (30(1)(k)); no charges not disclosed in the contract (30(2)); land security recovered under the Land Act (30(3)); thirty days' notice before selling movable security (30(4)) |
| reg 48 | reg 48 | A key information document for each product: its benefits, risks, terms and conditions, in summary |
| reg 59 | reg 59 | A pricing model with clear parameters: its components and costs justified, rates that may vary with the borrower's creditworthiness (59(2)(c)), the criteria for non-performance, credit bureau scores, all-inclusive pricing except third-party costs (59(2)(f)), and the APR disclosed |

**[LR-30](../law/LR-30.md) The Employment Act (Cap. 226).** Regulator: The Ministry responsible for labour; disputes go to the Employment and Labour Relations Court. Made under: An Act of Parliament. In force: Yes. Version read: as at 2024-04-26, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2007/11/eng@2024-04-26).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 19 | s. 19(3) | Deductions from wages only those the section allows, among them one the employee asks for in writing (19(1)(g)); all deductions together no more than two-thirds of wages (19(3)); a deduction paid over as the law or agreement requires, failing which an offence (19(5)) |
