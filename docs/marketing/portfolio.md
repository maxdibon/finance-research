---
id: portfolio
name: Dibon financial services — portfolio (draft for prospects)
kind: marketing
version: 0.1.0
owner: Commercial lead
classification: Internal until approved; Public once approved
last_reviewed: 2026-10-01
---

# Dibon Financial Services

**Infrastructure for institutions that take in, lend, hold and move
money — and need to prove where every shilling went.**

---

## Who we are

Dibon Consulting designs and builds software for banks, Saccos, microfinance
institutions, payment providers and the businesses that work with them.
We are a technology partner, not a single product. Payments,
deposit-taking, lending, escrow and reconciliation come together with
monitoring, messaging, identity and ERP integration, so an institution
deals with one partner rather than five.

We work from Nairobi, and we design for the markets we serve: mobile money
first, statement files where APIs do not yet exist, and feature phones
alongside smartphones.

---

## The problems we solve

- **Reconciliation by hand.** Statements are downloaded from every bank
  and mobile-money portal, then matched line by line. Breaks are found
  late and resolved without a trail.
- **Channels that disagree.** M-Pesa, Airtel Money, bank transfers and
  cards each arrive in a different place, in a different format, with a
  different idea of when a payment is final.
- **Approvals with no record.** Loans and payments are approved in
  conversation. Nobody can show who approved what, and when.
- **Customers who cannot see their own money.** Members phone in to ask
  a balance, a loan limit, or whether a contribution arrived.
- **Growth held back by paperwork.** Paper KYC, paper mandates, and
  monthly credit-bureau files assembled by hand.

---

## How we build

Three principles run through every product.

**1. We do not hold your money.** Funds stay in your accounts, at your
bank, or with a licensed partner. Our software prompts, instructs,
matches and reports. That keeps regulated custody where it belongs and
keeps our platform out of the path of your funds.

**2. Every record has one home.** Money lives in your core banking system
(or our hosted core, if you have none). Customers, invoices and
obligations live in your ERP. What happened between them — every match
and every exception — lives in our reconciliation engine. Nothing is
quietly copied, so there are never two answers to the same question.

**3. Nothing is guessed.** A payment that cannot be matched stays
visible until evidence places it. A payment the rail has not confirmed is
pending, not failed and not successful. Every number on every screen can
be traced back to a single transaction.

```
 +--------------------------------------------------------------------+
 | CHANNELS        mobile app . internet banking . USSD               |
 +--------------------------------------------------------------------+
 | PRODUCTS        Collect . Gateway . Escrow . MFI . Sacco .         |
 |                 Reconciliation . SME Reconciliation                |
 +--------------------------------------------------------------------+
 | PLATFORM        approvals . messaging . identity and access .      |
 |                 credit bureaus . payment rails . insights          |
 +--------------------------------------------------------------------+
          |                       |                        |
 +------------------+   +-------------------+   +--------------------+
 | YOUR CORE        |   | YOUR ERP          |   | RECONCILIATION     |
 | (or ours)        |   | customers and     |   | ENGINE             |
 | money            |   | what is owed      |   | every match        |
 +------------------+   +-------------------+   +--------------------+
```

---

## Products

Each product shows its **maturity**: *specification complete* means the
full functional design is written; *in design* means the scope is set and
the detailed design is under way. Ask us for the current state of any
product.

### Kapu Collect — deposits, collected by partners, held at your bank

For banks and other regulated institutions that want to reach the large
pool of collections that sits outside formal banking. Collection firms,
high-volume SMEs and unlicensed funds-holding operators connect through
Kapu's APIs. Every deposit lands in a real account at the bank, in the end
customer's name. The bank gains low-cost deposits; the partner gets a
regulated home for its customers' money.

- Account and sub-account opening, gated on IPRS identity checks
- Deposits by mobile-money prompt; withdrawals to mobile, till or paybill
- Account-to-account transfers, balances and statements
- Partner and bank management portals
- Asynchronous callbacks, idempotent requests, and queries by reference
- Daily reconciliation against the bank's core

*Channels:* M-Pesa, Airtel Money, T-Kash; PesaLink to follow.
*Deployment:* inside the bank's infrastructure, or in-country cloud.
*Maturity:* specification complete.

### Kapu Pay Gateway — one API for every rail a business takes

For businesses and fintechs that take payments on more than one rail. One
API and one dashboard cover mobile money, bank transfers and cards. Every
payment is reconciled automatically against what it paid for. Payments
settle straight into the merchant's own accounts.

- One collections API across M-Pesa, Airtel Money and T-Kash
- Cards and PesaLink
- Payment links, including invoices sent by SMS
- A merchant dashboard, with every payment matched and every exception
  listed
- Signed callbacks and idempotent requests

*Maturity:* in design.

### Kapu Escrow — funds held at a bank until the conditions are met

For property, vehicle sales, construction milestones, B2B trade and
marketplaces. The buyer's money sits at a partner bank, in an escrow
account of its own. It is released to the seller only when the agreed
approvers sign off. The agreement, signatures and milestone evidence are
all digital. Neither party, nor Dibon, can release funds alone.

- Digital escrow agreements, signed electronically by both parties
- One bank-held escrow account per agreement
- Milestones with evidence, partial releases, refunds
- Disputes frozen and decided by a named arbiter
- Daily tie-out of every escrow account against its agreement

*Maturity:* in design.

### Kapu Core — a hosted core banking system

For MFIs, Saccos and tier-3 banks whose current system is basic, or
absent. Clients, savings, shares, loans, the general ledger, tellers and
end-of-day on Apache Fineract, hosted in Kenya, with every Kapu product
running on top. The money stays in the institution's own accounts; Kapu
Core is its ledger.

- Savings and current accounts, fixed deposits; interest posted
  automatically
- Shares for Saccos; loans with schedules, charges and repayment splits
- A general ledger that is right every day
- Mobile-money deposits and repayments posted in real time
- Maker-checker on every transaction that needs it
- Migration from spreadsheets, Mifos or a previous core, signed off

*Built on:* Apache Fineract.

### Kapu MFI — loan management for growing lenders

For lenders moving off spreadsheets, paper and ageing systems. It covers
the whole loan, from a digital application to closure or restructure, and
enforces the process while staying light enough for a team of three.

- Digital applications with a full, attributed lifecycle
- KYC with IPRS lookup and a completeness gate per product
- Collateral management — vehicles first — with verification evidence
- Approval chains by product and amount, with no self-approval
- Above-limit approvals flagged and tracked as their own cohort
- Repayments split automatically into principal, interest, fees and
  insurance
- Rollovers and restructures linked back to the original loan
- Disbursement and repayment by M-Pesa and bank transfer
- SMS reminders, a portfolio dashboard (PAR, arrears buckets, income by
  component), and migration from Mifos

*Built on:* Apache Fineract.
*Maturity:* specification complete.

### Kapu Sacco — for credit-only and deposit-taking Saccos

For Saccos that want members' contributions, deposits, loans and
guarantees in one place, current every day rather than every month-end.

- Membership, share capital and member deposits
- Withdrawable savings for deposit-taking Saccos
- Contributions by M-Pesa, bank and employer check-off, matched to
  members automatically
- Check-off reconciliation against each employer's remittance
- Loan limits from members' deposits; guarantors who can see their own
  exposure
- Credit-committee approval with a recorded decision per member
- Annual dividends and interest, computed from your bylaws and kept for
  the AGM
- Run alongside your existing core, or as your core

*Maturity:* in design.

### Reconciliation & Observability — every channel, every cycle, right now

For banks, money-transfer operators, PSPs, Saccos and MFIs. Every
transaction is matched across the rail, the bank and your ledger. Every
break sits in a queue ordered by how close it is to its SLA, not by its
size. Every transaction can be traced hop by hop, with evidence from both
sides. Suspense is the exception queue seen from the ledger side: when
the queue is empty, suspense is zero, and that is what closing the day
means.

- Ingest from callbacks, APIs and statement files (MT940, CAMT, CSV)
- Matching rules, including three-way matching against what you expected
- An exception queue ordered by SLA, with owners and ageing
- A trace for every transaction, hop by hop
- Remediation: status queries run automatically; reversals and reposts
  approved by a second person
- A ledger view proved two ways: real-time assertions and a nightly batch
  proof
- Treasury and float positions; branch and till cash by denomination
- Monitoring, alerting and SLOs for every system that moves money

*Built on:* Kubernetes, Prometheus, OpenTelemetry and Grafana.
*Maturity:* specification complete.

### SME Reconciliation — your bank and mobile money, inside your ERP

For businesses on Odoo, with Zoho and others to follow. Bank, mobile-money
and card statements flow into the ERP without anyone downloading them.
Incoming money is matched to invoices, and outgoing money to bills and
expenses. Payments approved in the ERP are executed by bank API or mobile
money, and the outcome comes back to the ERP. The accountant works inside
the ERP's own reconciliation; nothing unmatched is hidden in suspense.

*Maturity:* in design.

### Omni-channel banking — app, web and USSD, under your brand

For Saccos, MFIs and banks. A mobile app, internet banking and USSD menus,
white-labelled for each institution, on one channel API. A balance is the
same on every channel. Members can check balances and statements, apply
for loans, accept guarantor requests, contribute and pay. Anything that
moves money asks the member to confirm who they are at that moment, and a
SIM-swap check runs first, where the operator offers one. USSD works on
any phone.

*Maturity:* in design.

### Business Suite, on Odoo and Zoho — the ERP, connected

For SMEs and fintechs without an ERP, and for Saccos, MFIs and banks that
want their own back office in order. Dibon implements Odoo as an Odoo
Ready Partner, and Zoho as a Zoho partner: CRM, helpdesk, accounting, HR
and payroll, e-signatures, a customer portal and campaigns. It comes already connected to the products: bank and
mobile-money statements reconciled into the books, campaigns delivered
through Dibon's messaging, and one sign-on across every system. An
institution's customer accounts stay in its core; Odoo receives the daily
totals for the general ledger.

- CRM, helpdesk with SLAs, accounting and invoicing
- Odoo Sign for agreements, mandates and consents
- A customer portal for invoices, statements and tickets
- Statements reconciled into accounting through SME Reconciliation
- Campaigns and SMS through Dibon's messaging
- Migration from spreadsheets or a previous system

---

## The platform underneath

Every product shares the same services, so a customer who adds a second
product gets the same approvals, messages, logins and reports as the
first.

| Service | What it does |
|---|---|
| **Approvals and mandates** | Approval chains by product, amount and risk flag; no self-approval; every decision attributed at the moment it is made. Debit mandates for recurring collections, with the payer's consent and right to cancel |
| **Messaging** | SMS, WhatsApp, Telegram and app push, for reminders, receipts, alerts and campaigns. In Kenya, SMS goes directly to the operators under Dibon's PRSP licence. A message's status says only what the channel actually reported |
| **Identity and access** | One login for every system, with passkeys and one-time codes; re-authentication before any act that moves money; financial-grade API security for partners. Identity checks against IPRS, documents and liveness |
| **Credit bureaus** | Monthly submissions generated from the ledger and reconciled against what the bureau accepted. Lookups at vetting, with the purpose recorded first. Corrections when a borrower settles |
| **Payment rails** | M-Pesa, Airtel Money, T-Kash, PesaLink, bank APIs and statement files, and cards, behind one interface. An unconfirmed payment is pending until the rail confirms it |
| **Insights** | Every metric defined once, used by dashboards and by questions asked in plain language. Every answer shows how it was calculated and how fresh the data is |

*Maturity:* approvals, payment rails and identity are partly specified;
the other services are in design.

---

## Who it is for

| You are | Start with | Add |
|---|---|---|
| A tier-2 or tier-3 bank | Collect; Reconciliation | Escrow; omni-channel |
| A deposit-taking Sacco | Sacco; Reconciliation (check-off) | Omni-channel; credit bureaus |
| A credit-only Sacco | Sacco | Omni-channel; messaging |
| An MFI | MFI | Credit bureaus; omni-channel |
| A money-transfer operator or PSP | Reconciliation | Gateway; insights |
| A fintech | Gateway | Reconciliation; Collect, through a partner bank |
| An SME | SME Reconciliation, or the Business Suite if there is no ERP yet | Gateway; escrow |

---

## Integrations

| Area | Today's design covers |
|---|---|
| Mobile money | M-Pesa (Daraja), Airtel Money, T-Kash — integrated directly |
| Banks | Bank APIs, statement files (MT940, CAMT.053, CSV), PesaLink |
| Cards | Through acquirers and processors; card numbers never touch our systems |
| ERP | Odoo first, then Zoho; Odoo implemented by Dibon as an Odoo Ready Partner |
| Identity | IPRS; document and liveness checks |
| Credit bureaus | Every licensed bureau in Kenya |
| Core banking | Your core, through an adapter; or Apache Fineract, hosted for you |

---

## Deployment and security

- **Where it runs:** on your premises, or in an in-country cloud. Kenya
  first; designed to follow our customers across East and Southern Africa
  and Nigeria.
- **How it runs:** cloud-native on Kubernetes, built mostly on open-source
  components with permissive licences: Apache Fineract, Keycloak,
  Kafka, Prometheus, OpenTelemetry and Apache Superset.
- **Who can act:** one login per person, never shared; re-authentication
  at the moment of any act that moves money; approval by a second person
  for payments, reversals and role changes.
- **What is recorded:** every action, append-only. Nothing is edited after
  the fact; a correction is a new entry.
- **How data is handled:** designed in line with Kenya's Data Protection
  Act, 2019. Data is classified; the most sensitive never appears in logs
  or on a phone. Credentials never leave our servers.
- **How it is watched:** monitoring, alerting and service-level objectives
  for every system that moves money.

---

## Working with us

1. **Discovery.** A working session with your team on the process that
   costs you most today.
2. **Your numbers.** Give us extracts for one full cycle of your process,
   a day, a week or a month, and we will show the product running on your
   own data before we meet again.
3. **Pilot.** One product, one process, measured against an agreed
   outcome.
4. **Rollout.** Further products on the same platform, with the same
   logins, approvals and reports.

---

## Contact

**Dibon Consulting** · info@dibon.co.ke · +254 792 745 509
