---
id: brief-kapu-business
name: Kapu Business — a business's money, seen, forecast, paid and put to work
kind: guide
status: living
law: LR-11
released: unreleased
owner: Product lead, recon
classification: Internal
review_ids: [FS-1174, FS-1183, FS-1186]
last_reviewed: 2026-11-11
---

# Kapu Business

**What it is:** corporate treasury for a small or medium business: every
account it holds (its banks, its M-Pesa tills, paybills and Pochi) seen
together; each bank and mobile-money line matched to its invoices and
bills in its own books; a thirteen-week forecast of its cash; its
suppliers, payroll and taxes paid in bulk under its own approvals; a
shortfall bridged by finance from the institutions it banks with, and a
surplus put to work. Banks sell the same to large companies as treasury
services: cash management, payments and reconciliation, fraud
prevention, foreign exchange, and links to the company's own accounting
(FS-1174). Kapu Business brings it to businesses that have only ever had
a bank statement and a spreadsheet.

**Why it is interesting:** for the business, it answers the questions
its owner asks every week (how much do we have, will we make payroll,
who has paid) without a finance team. For the institution that offers
it under its own name, its business clients' money and payments stay
with it, and it sees, with their consent, which of them need finance and
when, before they ask elsewhere.

## 1 · How it works

```
   the business's      every account,          the business's
   banks, tills,  -->  matched to its    -->   position and its
   paybills            invoices and bills      13-week forecast
                                                     |
             +--------------------+------------------+------------------+
             v                    v                  v                  v
       payments, bulk       a shortfall:        a surplus:         payments
       and statutory,       finance offered     swept into a       abroad, through
       its approvals        by its institution  money market fund  its bank
```

1. **Connect:** the business connects its accounts, with its consent: its
   bank by statement or API, its tills and paybills by M-Pesa's own
   records.
2. **Reconcile:** each line is matched to its invoices and bills, and the
   matches written into its own books (Odoo, Zoho, QuickBooks Online);
   what is left unmatched stays visible.
3. **See and forecast:** one position across its accounts, and a forecast
   from what it is owed and owes, week by week.
4. **Act:** it pays its suppliers, payroll and taxes from its own
   accounts, each under its own approvals; a gap in the forecast is
   offered finance by its institution; a surplus is swept into a fund
   and back when needed.

## 2 · Why it is hard for an institution to do alone

- **Every account, not only its own:** a business banks in several
  places and takes mobile money on several numbers; seeing them together
  takes connections to each, and each statement's own format.
- **The business's own books:** reconciliation is only useful written
  into the business's own ERP, in its own terms (sme-recon SR-10, SR-15).
- **A forecast that means something:** built from receivables and
  payables, not from last month's balance.
- **Payments safely:** bulk and statutory payments under the business's
  own chain, with each payee verified and a changed payee held.
- **Finance at the right moment:** knowing, with consent, when a business
  will be short, and making an offer before it happens.
- **The law:** whether making a business's payments or reading its
  accounts through a platform is a payment service in itself (LQ-42).

## 3 · What we bring

| Need | How it is met | Ids |
|---|---|---|
| Every account in one place | Statements and notifications from banks and mobile money, balances in one view | SR-01 to SR-05; TR-36 |
| Reconciled into its books | Incoming and outgoing money matched to invoices and bills, written into its ERP | SR-06 to SR-10, SR-13 to SR-15 |
| A forecast | Thirteen weeks, from its receivables and payables | TR-36 |
| Payments | Bulk, payroll and statutory, approved in its own chain, payees verified | TR-37; MD-19; BS-19; FC-16; SR-11, SR-12 |
| Collections | Payment links and reminders | GW-07 |
| Finance when short | The institution's invoice and order finance, lines, overdrafts | TR-38; MF-32; MF-40 |
| Surplus at work | Swept into a money market fund or Treasury bills, and back | TR-39 |
| Foreign currency | Rates and payments abroad through its bank | TR-40 |
| A group of companies | Seen and forecast together, each apart | TR-41 |
| Its books | Odoo or Zoho, implemented by us, or its own QuickBooks | business-suite |

**Where it stands:** SME Recon's statements, matching and ERP wrappers are
designed (sme-recon); the treasury parts are planned in the treasury
module's Business group, the forecast and payments in phase 2, the rest
later.

## 4 · What we have run or learnt

Nothing of Kapu Business has run yet. Learnt so far: a fund manager's
reconciliation officer matches collections by hand each morning before
its treasury can decide the day, and a bank's notice of a transfer may
omit the payer's details altogether (customers, Lofty Corban); the same
gaps meet any business that takes money in more than one place.

## 5 · What is still open

- LQ-42: whether making a business's payments or reading its accounts
  through us needs a licence, and whether offering it under an
  institution's name changes that.
- FS-1183: the Business package's phases.
- FS-1174: the external version of this brief, for prospects.

## 6 · Who might want it

- **Banks, microfinance banks and Saccos** with business clients, to
  offer it under their own name, as the gateway is white-labelled
  (GW-15): it keeps their clients' money and payments with them, and
  shows them who will need finance.
- **Businesses directly**, through the business suite and SME Recon.
- **A fund manager**, for the money market fund a business's surplus is
  swept into.

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
