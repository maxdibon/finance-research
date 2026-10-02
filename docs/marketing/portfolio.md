---
id: portfolio
name: Dibon financial services — portfolio copy
kind: marketing
version: 0.2.0
owner: Commercial lead
classification: Public once approved
last_reviewed: 2026-10-02
---

# Dibon Financial Services portfolio

Every word in the portfolio comes from this file. The PDF and the web
preview are built from it, so edit the words here and nowhere else.

**How to edit.** Each `##` heading is a page and each `###` heading is a
card, product or row on that page, in the order they appear. Change the
words after a bold label freely; keep the labels themselves, because the
build reads them. A line in a list that starts with a label, such as
`- Channels: ...`, keeps everything before the first colon as its label.
Words between single asterisks, like `*this*`, are highlighted. Adding or
removing a card changes the layout, so the build stops and says so rather
than squeezing it in.

On a few cards the label is also the visible heading: Mission, Vision,
Values, Email and Phone.

Diagrams and illustrative screens, including the words drawn inside them,
are part of the design and live with it.

## Cover

**Kicker:** Financial services portfolio · 2026
**Title:** Financial services *infrastructure*
**Subtitle:** For institutions that take in, lend, hold and move money, and
need to prove where every shilling went.
**Line-up label:** The portfolio

## Contents

**Heading:** Contents

## Who we are

**Contents:** Who we are
**Eyebrow:** Who we are
**Heading:** One technology partner, not one product
**Intro:** Dibon Consulting builds the software that banks, Saccos,
microfinance institutions, payment providers and the businesses around them
use to collect, lend, hold and reconcile money. Payments, deposit-taking,
lending, escrow and reconciliation come together with monitoring,
messaging, identity and ERP integration, so an institution works with one
partner rather than five.
**Mission:** Driving scalable business expansion through immersive,
customized technology solutions.
**Vision:** Shaping the future through transformative partnerships,
harnessing emerging technologies and world-class resources.
**Values:** Innovation, customer-centricity, excellence, collaboration,
integrity, continuous learning, agility and social responsibility.
**At a glance:**
- {products}: products on one platform
- {services}: shared platform services
- 3: mobile-money networks, integrated directly
- PRSP: licensed by the Communications Authority of Kenya
**Markets heading:** Built for the markets we serve
**Markets:** Mobile money first. Statement files where banks do not yet
offer APIs. USSD alongside apps, because not every member has a
smartphone. Designed in Nairobi.
**Travel heading:** Ready to travel
**Travel:** Every product runs on your premises or in an in-country cloud,
so it can follow our customers from Kenya into Uganda, Tanzania, Rwanda,
Zambia, Zimbabwe and Nigeria, under each country's own rules.
**Map caption:** Kenya first, then six more markets. Positions are
indicative, not to scale.

## The problems we solve

**Contents:** The problems we solve
**Eyebrow:** The problems we solve
**Heading:** Where money gets lost in the work

### Reconciliation by hand

**Problem:** Statements downloaded from every bank and mobile-money portal,
matched line by line. Breaks found late, resolved without a trail.
**With Dibon:** *Reconciliation & Observability* matches every channel
automatically and queues each break by its SLA, with evidence from both
sides.

### Channels that disagree

**Problem:** M-Pesa, Airtel Money, bank transfers and cards each arrive in
a different place, in a different format, with a different idea of when a
payment is final.
**With Dibon:** *Kapu Pay Gateway* puts every rail behind one API. A
payment the rail has not confirmed is pending, never assumed.

### Approvals with no record

**Problem:** Loans and payments approved in conversation. Nobody can show
who approved what, and when.
**With Dibon:** *Approvals and mandates* route every decision by product
and amount, with no self-approval, and record who decided at the moment
they decided.

### Customers who cannot see their money

**Problem:** Members phone in to ask a balance, a loan limit, or whether a
contribution arrived.
**With Dibon:** *Omni-channel banking* gives every member an app, internet
banking and USSD under your brand, with the same answer on each.

### Growth held back by paperwork

**Problem:** Paper KYC, paper mandates, and monthly credit-bureau files
assembled by hand.
**With Dibon:** *Identity and e-signatures* take onboarding and consent off
paper, with credit-bureau submissions coming soon.

## How we build

**Contents:** How we build
**Eyebrow:** How we build
**Heading:** Three principles in every product

### Your money stays yours

**Heading:** We do not hold your money
**Text:** Funds stay in your accounts, at your bank, or with a licensed
partner. Our software prompts, instructs, matches and reports, so regulated
custody stays where it belongs.

### One source

**Heading:** Every record has one home
**Text:** Money lives in your core. Customers and what they owe live in
your ERP. Every match and every exception lives in our reconciliation
engine. Nothing is quietly copied.

### Evidence

**Heading:** Nothing is guessed
**Text:** An unmatched payment stays visible until evidence places it. An
unconfirmed payment is pending, not failed and not successful. Every number
traces back to one transaction.

## How we build, the stack

**Layers:**
- Channels: Mobile app · Internet banking · USSD
- Products: Collect · Gateway · Escrow · Core banking · MFI · Sacco ·
  Reconciliation · SME Reconciliation
- Platform: Approvals · Messaging · Identity and access · Credit bureaus ·
  Payment rails · Insights
**Records:**
- Your core, or ours: Money: accounts, balances, loans
- Your ERP: Customers, invoices, what is owed
- Reconciliation engine: Every match, every exception
**Caption:** Channels and products sit on shared platform services, above
three systems of record. Each record has exactly one.
**Band:** Follow the green line. *It never passes through Dibon.*
**Band text:** In every product diagram that follows, a solid green line is
money moving. It runs from payer to account, between institutions and
their customers, and never through our software.

## The portfolio at a glance

**Contents:** The portfolio at a glance
**Eyebrow:** The portfolio at a glance
**Heading:** {Products} products, one platform, one partner
**Suite title:** Also from Dibon: Business suite, on Odoo and Zoho
**Suite text:** CRM, helpdesk, accounting, HR and payroll, e-signatures and
a customer portal, implemented by Dibon as an Odoo and Zoho partner and
connected to every product.
**Platform title:** One platform underneath
**Platform:** Approvals and mandates · Messaging · Identity and access ·
Credit bureaus · Payment rails · Insights

## Products

**Contents:** Products
**Eyebrow:** Products · {n} of {total}

### Kapu Collect

**Tagline:** Deposits collected by partners, held at your bank
**Intro:** Kapu Collect lets a bank take deposits gathered by collection
firms, high-volume SMEs and funds-holding operators. Partners connect
through Kapu's APIs; every deposit lands in a real account at the bank, in
the end customer's name. The bank gains low-cost deposits, and the partner
a regulated home for its customers' money. Our first partner bank is being
onboarded.
**Diagram caption:** The deposit goes from the payer to the bank’s own
paybill and into the customer’s account. Kapu prompts, confirms and posts;
it never holds the money.
**Features:**
- Account and sub-account opening, gated on IPRS identity checks
- Deposits by mobile-money prompt; withdrawals to mobile, till or paybill
- Account-to-account transfers, balances and statements
- Partner and bank management portals
- Asynchronous callbacks, idempotent requests and queries by reference
- Daily reconciliation against the bank's core
- Customers notified the moment a deposit lands
**Facts:**
- Channels: M-Pesa, Airtel Money, T-Kash; PesaLink coming soon
- Runs: Inside the partner bank (being onboarded), or in-country cloud
- For: Tier-2 and tier-3 banks; their partners

### Kapu Pay Gateway

**Tagline:** One API for every rail a business takes
**Intro:** For businesses and fintechs that take payments on more than one
rail. One API and one dashboard cover mobile money today, with bank
transfers and cards coming soon, and every payment is reconciled against
what it paid for. You bring your own paybill or account, and payments
settle straight into it; we never hold the money. Already have a business
collection account at your bank, often called Lipa na Bank? The Gateway
works with it, with matching as each bank comes online.
**Diagram caption:** One API for every rail. The money settles straight
into the merchant’s own account; the Gateway handles the prompt, the
confirmation and the reconciliation.
**Features:**
- One collections API across M-Pesa, Airtel Money and T-Kash
- Cards and PesaLink, coming soon
- Payment links, including invoices sent by SMS
- A merchant dashboard: every payment matched, every exception listed
- Signed callbacks and idempotent requests
**Facts:**
- Channels: M-Pesa, Airtel Money, T-Kash; cards and PesaLink coming soon
- Settles: Into the merchant's own accounts
- For: SMEs, fintechs, MFIs and Saccos

### Kapu Escrow

**Tagline:** Funds held at a bank until the conditions are met
**Intro:** The buyer's money sits at a partner bank in an escrow account of
its own, released to the seller only when the agreed approvers sign off.
Neither party, nor Dibon, can release funds alone; in a dispute, the named
arbiter decides, and the bank still checks the release against the
account's mandate. Our first partner bank is being onboarded.
**Diagram caption:** The money waits in its own account at the bank.
Release needs the agreed approvals, and the bank checks the instruction
against the account’s own mandate.
**Features:**
- Digital escrow agreements, signed electronically by both parties
- One bank-held escrow account per agreement
- Milestones with evidence, partial releases and refunds
- Disputes frozen and decided by a named arbiter
- A daily tie-out of every escrow account against its agreement
**Facts:**
- Held at: A partner bank (being onboarded), one account per agreement
- Released: Only on the agreed approvals
- For: Property, vehicles, construction, trade

### Kapu Core

**Tagline:** A hosted core banking system, on Apache Fineract
**Intro:** For MFIs, Saccos and tier-3 banks ready for a modern core, or
running without one. Clients, savings, shares, loans, the general ledger, tellers and
end-of-day, hosted in Kenya, with every Kapu product running on top. The
money stays in your own accounts; Kapu Core is your ledger.
**Diagram caption:** The green line never touches the core: the money stays
in your accounts, and Kapu Core is the ledger that records it.
**Features:**
- Savings and current accounts, fixed deposits; interest posted
  automatically
- Shares for Saccos; loans with schedules, charges and repayment splits
- A general ledger that is right every day, not rebuilt at month-end
- Mobile-money deposits and repayments posted in real time
- Maker-checker on every transaction that needs it
- Migration from spreadsheets, Mifos or a previous core, signed off
**Facts:**
- Built on: Apache Fineract
- Hosted: In Kenya, one isolated instance per institution
- For: MFIs, Saccos, tier-3 banks

### Kapu MFI

**Tagline:** Loan management for growing lenders
**Intro:** For lenders moving off spreadsheets, paper or an earlier system.
The whole loan, from a digital application to closure or restructure, with
the process enforced and light enough for a team of three.
**Diagram caption:** The loan’s path, with gates that cannot be skipped.
Every step is timestamped and attributed; a restructure stays linked to the
loan it replaced.
**Dashboard caption:** Illustrative screen: the portfolio dashboard
**Features:**
- KYC with IPRS lookup and a completeness gate per product
- Collateral management, vehicles first, with verification evidence
- Approval chains by product and amount, with no self-approval
- Above-limit approvals flagged and tracked as their own cohort
- Repayments split into principal, interest, fees and insurance
- SMS reminders, a portfolio dashboard, and migration from Mifos
**Facts:**
- Built on: Apache Fineract
- Disburse and repay: M-Pesa now; bank transfer coming soon
- For: Lenders with 2 to 15 staff

### Kapu Sacco

**Tagline:** For credit-only and deposit-taking Saccos
**Intro:** For Saccos that want contributions, deposits, loans and
guarantees in one place, current every day rather than every month-end.
**Diagram caption:** Check-off, reconciled. The employer’s file is matched
against what each member should have paid; anything short, extra or
unknown stays open until someone explains it.
**Features:**
- Membership, share capital and member deposits; withdrawable savings for
  deposit-taking Saccos
- Contributions by M-Pesa, bank and employer check-off, matched to members
- Loan limits from members' deposits; guarantors who can see their exposure
- Credit-committee approval, recorded per member
- Dividends and interest computed from your bylaws, kept for the AGM
- Your own HR, payroll and accounting through the Business suite
**Facts:**
- Runs: Alongside your core, or as your core
- Contributions: M-Pesa, bank, employer check-off
- For: Credit-only and deposit-taking Saccos

### Reconciliation & Observability

**Tagline:** Every channel, every cycle, right now
**Intro:** Every transaction matched across the rail, the bank and your
ledger. Breaks are queued by how close they are to their SLA, not by size,
and traced hop by hop with evidence from both sides. When the queue is
empty, suspense is zero, and the day is closed.
**Steps:**
- Ingest
- Match
- Queue
- Resolve
- Close the day
**Diagram caption:** Both sides feed one engine. Every open break sits in
the queue, so the queue and the suspense account always agree: when the
queue is empty, the day is closed.
**Features:**
- Ingest from callbacks, APIs and MT940, CAMT and CSV files
- Rules, including three-way matching against what you expected
- Remediation: status queries automatic; reversals approved by a second
  person
- A ledger view proved two ways: real-time assertions and a nightly batch
- Treasury, float, and branch and till cash by denomination
**Facts:**
- Built on: Kubernetes, Prometheus, OpenTelemetry, Grafana
- Closes the day: Queue empty, suspense zero
- For: Banks, IMTs, PSPs, Saccos, MFIs

### SME Reconciliation

**Tagline:** Your bank and mobile money, inside your ERP
**Intro:** For businesses on Odoo, with Zoho and others to follow. Bank,
mobile-money and card statements flow into the ERP; incoming money is
matched to invoices, outgoing money to bills and expenses, and payments
approved in the ERP are executed by mobile money, with bank APIs coming
soon.
**Diagram caption:** Statements in, matches into the ERP. Payments approved
in the ERP leave the business’s own account; Dibon only instructs.
**Features:**
- Bank statements by file today; bank APIs coming soon
- M-Pesa, Airtel Money and T-Kash on your own shortcodes
- Incoming money matched to invoices, including partial payments
- Outgoing money matched to bills; bank charges posted as expenses
- Unmatched money stays unapplied and visible, never in suspense
**Facts:**
- ERPs: Odoo first, then Zoho
- Pays: By mobile money once approved; bank APIs coming soon
- For: SMEs and fintechs

### Omni-channel banking

**Tagline:** App, web and USSD, under your brand
**Intro:** A mobile app, internet banking and USSD menus, white-labelled for
each institution, on one channel API, so a balance is the same everywhere.
Anything that moves money asks the member to confirm who they are at that
moment, and runs a SIM-swap check where the operator offers one.
**Diagram caption:** Three channels, one API, one answer. Anything that
moves money passes step-up first, and a SIM-swap check where the operator
offers one.
**Features:**
- Balances, statements, contributions and payments
- Loan applications and guarantor requests
- Step-up confirmation before money moves; a SIM-swap check where available
- Every balance shown with when it was fetched
- USSD on any phone, with lower limits than the app
**Facts:**
- Channels: App, internet banking, USSD
- Brand: White-labelled per institution
- For: Saccos, MFIs and banks

## Business suite

**Contents:** Business suite, on Odoo and Zoho
**Eyebrow:** Also from Dibon
**Heading:** Business suite, on Odoo and Zoho
**Tagline:** The ERP, implemented by Dibon and connected to every product
**Intro:** For SMEs and fintechs without an ERP, and for Saccos, MFIs and
banks that want their own back office in order. Dibon implements Odoo, as
an Odoo Ready Partner, and Zoho, as a Zoho partner. Odoo runs on OLP, Odoo
Launch Pad, our own Odoo management platform, hosted in Kenya. An
institution's customer accounts stay in its core; Odoo receives the daily
totals for the general ledger.
**Apps:**
- CRM: Leads, accounts and pipeline in one place
- Helpdesk: Tickets with SLAs, linked to the customer
- Accounting: Statements already reconciled by SME Reconciliation
- HR and payroll: Contracts, leave, attendance and monthly payroll
- Sign: Agreements, mandates and consents signed online
- Portal: Invoices, statements and tickets for customers
- Campaigns: Delivered through Dibon's messaging, status written back
- Migration: From spreadsheets or an earlier system, balances signed off
**Diagram caption:** Odoo is the back office around your core, never a
second core.
**Band:** Odoo on OLP, *in Kenya.*
**Band text:** Instances, backups, staging and upgrades managed on Dibon's
own Odoo platform, on in-country infrastructure. Zoho runs on Zoho's own
cloud. One sign-on with the rest of the Dibon platform.

## Platform services

**Contents:** Platform services
**Eyebrow:** Platform services
**Heading:** The same services under every product
**Intro:** A customer who adds a second product gets the same approvals,
messages, logins and reports as the first.
**Services:**
- Approvals and mandates: Chains by product, amount and risk; no
  self-approval; every decision attributed when it is made. Debit mandates
  with the payer's consent and right to cancel.
- Messaging: SMS, WhatsApp, Telegram and app push. In Kenya, SMS goes direct
  to the operators under Dibon's PRSP licence. A status says only what the
  channel reported.
- Identity and access: One login for every system; re-authentication before
  money moves; financial-grade API security; IPRS, document and liveness
  checks.
- Credit bureaus: Coming soon. Monthly submissions generated from the
  ledger and reconciled; lookups with the purpose recorded first;
  corrections when a borrower settles.
- Payment rails: M-Pesa, Airtel Money, T-Kash, PesaLink, bank APIs and
  files, and cards behind one interface. Unconfirmed means pending, never
  assumed.
- Insights: Every metric defined once, for dashboards and plain-language
  questions. Each answer shows how it was calculated and how fresh the data
  is.
**Built-on caption:** Read from each product's design: the platform
services it is built on.
**Short product names:**
- Kapu Collect: Collect
- Kapu Pay Gateway: Gateway
- Kapu Escrow: Escrow
- Kapu Core: Kapu Core
- Kapu MFI: MFI
- Kapu Sacco: Sacco
- Reconciliation & Observability: Reconciliation
- SME Reconciliation: SME Recon
- Omni-channel banking: Omni-channel
- Business suite: Business suite
**Short service names:**
- Approvals and mandates: Approvals
- Messaging: Messaging
- Identity and access: Identity
- Credit bureaus: Bureaus
- Payment rails: Rails
- Insights: Insights

## Who it is for

**Contents:** Who it is for
**Eyebrow:** Who it is for
**Heading:** Where to start

### Tier-2 banks with a core but a manual back office

**Start with:** Reconciliation, with approvals and mandates
**Add:** The Business suite for helpdesk, HR and procurement; Collect

### Tier-3 banks

**Start with:** Collect; Reconciliation
**Add:** Escrow; omni-channel; Kapu Core, if a core upgrade is on your
roadmap

### Deposit-taking Saccos

**Start with:** Sacco; Reconciliation (check-off)
**Add:** Omni-channel; credit bureaus, coming soon

### Credit-only Saccos

**Start with:** Sacco
**Add:** Omni-channel; messaging

### MFIs moving off spreadsheets

**Start with:** MFI, on Kapu Core
**Add:** Omni-channel; credit bureaus, coming soon

### MFIs modernising their back office

**Start with:** MFI on your existing core; Reconciliation
**Add:** The Business suite; Kapu Core when you are ready to move

### Institutions planning a core upgrade

**Start with:** Kapu Core
**Add:** MFI or Sacco; Reconciliation; omni-channel

### Money-transfer operators and PSPs

**Start with:** Reconciliation
**Add:** Gateway; insights

### Fintechs

**Start with:** Gateway
**Add:** Reconciliation; Collect, through a partner bank

### SMEs

**Start with:** SME Reconciliation, or the Business suite
**Add:** Gateway; escrow

## Who it is for, closing

**Band:** Not on this list? *Start with your process.*
**Band text:** Tell us where money gets lost in your work, and we will
suggest where to begin, on your own data.

## Integrations

**Contents:** Integrations
**Eyebrow:** Integrations
**Heading:** What the platform connects to

### Mobile money

**Integrated:** M-Pesa (Daraja); Airtel Money; T-Kash
**Note:** Integrated directly

### Banks

**Coming soon:** Bank APIs; MT940; CAMT.053; CSV; PesaLink
**Note:** Coming soon: Dibon's own banks first

### Cards

**Coming soon:** Acquirers; Processors
**Note:** Coming soon. Card numbers will never touch our systems

### ERP

**Integrated:** Odoo; Zoho
**Note:** Implemented by Dibon, a partner of both

### Identity

**Integrated:** IPRS; Documents; Liveness
**Coming soon:** Business registration
**Note:** Checked before an account opens

### Credit bureaus

**Coming soon:** Every licensed bureau in Kenya
**Note:** Coming soon: submissions and lookups

### Core banking

**Integrated:** Your core, by adapter; Kapu Core, on Apache Fineract
**Note:** Integrated with your core first; Kapu Core when you choose to
upgrade

## Integrations, closing

**Diagram caption:** Each rail and each system is integrated once, in the
platform, and every product uses it.

## Deployment and security

**Contents:** Deployment and security
**Eyebrow:** Deployment and security
**Heading:** Built to be audited
**Rows:**
- Where it runs: On your premises, or in an in-country cloud. Kenya first;
  designed to follow our customers across East and Southern Africa and
  Nigeria.
- How it runs: Cloud-native on Kubernetes, mostly on permissively licensed
  open source: Apache Fineract, Keycloak, Kafka, Prometheus, OpenTelemetry
  and Apache Superset.
- Who can act: One login per person, never shared; re-authentication at the
  moment of any act that moves money; a second approver for payments,
  reversals and role changes.
- What is recorded: Every action, append-only. Nothing is edited after the
  fact; a correction is a new entry.
- How data is handled: Designed in line with Kenya's Data Protection Act,
  2019. Data is classified; the most sensitive never appears in logs or on
  a phone. Credentials never leave our servers.
- How it is watched: Monitoring, alerting and service-level objectives for
  every system that moves money.
**Band:** Evidence, *not assertions.*
**Band text:** Every number traces to a transaction, every approval to a
person at a moment, and every correction is a new entry an auditor can
read.

## Working with us

**Contents:** Working with us
**Eyebrow:** Working with us
**Heading:** From your process to your numbers

### Discovery

**What happens:** A working session with your team on the process that
costs you most today.
**You get:** A written map of the process, where money is lost, and what we
would change

### Your numbers

**What happens:** Give us extracts for one full cycle of your process, a
day, a week or a month; we show the product running on your own data
before we meet again.
**You get:** Your own transactions, matched, with the breaks and their
causes

### Pilot

**What happens:** One product, one process, measured against an agreed
outcome.
**You get:** A measured result against the outcome agreed at the start

### Rollout

**What happens:** Further products on the same platform, with the same
logins, approvals and reports.
**You get:** One platform, one sign-on, one set of approvals and reports

## Working with us, contact

**Title:** Talk to us
**Text:** Tell us the process that costs you most. We will come back with a
session date and what to bring.
**Email:** info@dibon.co.ke
**Phone:** +254 792 745 509

## Labels

**With Dibon:** With Dibon
**Start with:** Start with
**Add:** Add
**You get:** You get
**Integrated:** Integrated
**Coming soon:** Coming soon
**Illustrative screen:** Illustrative screen
**Built on:** built on
**Prepared for:** Prepared for
