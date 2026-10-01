---
id: core
name: Kapu Core
kind: product
version: 0.1.0
owner: Product lead, Kapu
classification: Internal
audience: [mfi, sacco, bank]
depends_on: [access, identity, mandates, messaging, rails, recon-observability]
consumed_by: [mfi, sacco, collect, omni-channel, insights]
review_ids: [FS-062, FS-066, FS-178, FS-179, FS-180, FS-184, FS-185, FS-303, FS-311, FS-316, FS-319, FS-320, FS-321]
last_reviewed: 2026-10-02
---

# Kapu Core

## 1 · In one paragraph

Kapu Core is a hosted core banking system for institutions whose current
system is basic, or absent: MFIs on spreadsheets or old Mifos
installations, Saccos on desktop software, tier-3 banks on systems that
cannot keep up (FS-303). It runs on Apache Fineract, hosted in Kenya on
Liquid's Azure Stack: clients, savings, shares, loans, the general ledger,
tellers and end-of-day. Every Kapu product runs on top of it: MFI, Sacco,
Collect, omni-channel, reconciliation. It is the native mode of the
architecture, packaged as a product (docs/architecture.md §4). **The money
stays in the institution's own accounts; Kapu Core is its ledger.**

## 2 · Who it is for

**Segments:** MFIs and Saccos replacing spreadsheets, paper or legacy
systems. Tier-3 banks and deposit-taking Saccos whose core is basic and
cannot support mobile money, APIs or real-time reporting. Lenders who want
loans on a modern core while deposits stay where they are (the split
mode, FS-066).

**The problem, concretely:** the core cannot take a mobile-money payment
without someone keying it in. Interest is posted by hand at month-end.
The general ledger is rebuilt in a spreadsheet for the board. Every new
channel or product needs the core vendor, and the core vendor is slow or
gone.

**People who use it:**

| Role | What they need from it |
|---|---|
| Operations and tellers | Accounts, deposits, withdrawals and transfers; tills that balance |
| Credit staff | Loan products, schedules and repayments that post themselves |
| Finance | A general ledger that is right every day, not rebuilt at month-end |
| Management and the board | Portfolio, liquidity and returns, from one source |
| Regulator and auditor | Returns produced from the ledger; an audit trail that is never edited |

## 3 · What it does

**Status:** Fineract provides the underlying features; Dibon packages,
configures, hosts and integrates them. Loans and migration are specified
in the MFI PRD; the rest is **Planned** until a deployment is live.

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| KC-01 | Clients: individuals and businesses; groups later | Planned | FS-316; MFI PRD FR-1.4 (party model ready for groups) | 1 |
| KC-02 | Savings and current accounts, fixed deposits; interest calculated and posted automatically | Planned | FS-316 | 1 |
| KC-03 | Shares, for Saccos | Planned | sacco SC-02 | 1 |
| KC-04 | Loans: products, schedules, charges, repayments split by component | Designed | MFI PRD FR-7 | 1 |
| KC-05 | General ledger: chart of accounts, accrual accounting, journal entries for every transaction | Planned | FS-316 | 1 |
| KC-06 | Tellers and cashiers: tills, cash in and out, till balancing | Planned | recon-observability RO-10 | 2 |
| KC-07 | End of day: accruals, closing and batch jobs on the institution's own cycle | Planned | FS-316 | 1 |
| KC-08 | Maker-checker on core transactions, through the mandate engine | Planned | mandates MD-12 | 1 |
| KC-09 | Mobile-money deposits and repayments posted in real time (M-Pesa, Airtel Money, T-Kash) | Planned | rails RL-03 to RL-05 | 1 |
| KC-10 | Standard reports, and regulatory returns for SASRA and CBK | Planned | FS-184 | 2 |
| KC-11 | Migration from spreadsheets, Mifos or a previous core, with a signed-off reconciliation | Designed | MFI PRD FR-13 | 1 |
| KC-12 | Hosted per institution, isolated, on Liquid's Azure Stack | Planned | FS-032 | 1 |
| KC-13 | Open APIs for the institution's own apps and partners | Planned | FS-316 | 1 |
| KC-14 | Field-officer app with offline capture | Planned | FS-320: moved up to phase 2. Outside launch scope in MFI PRD §6; the benchmark leads with one | 2 |

## 4 · Where it sits

**Depends on:** access, identity, mandates, messaging, rails,
recon-observability (it ties to its own rails every day).
**Used by:** mfi, sacco, collect (as the core for an institution without
one), omni-channel, insights.

**Who holds which record** (docs/architecture.md §2):

| Record | System of record | This module |
|---|---|---|
| The institution's money | **Its own bank accounts and mobile-money shortcodes** | **Never holds** |
| Accounts, balances, loans, the general ledger | **Kapu Core** | Holds, as the institution's ledger |
| Members' and customers' KYC | **Kapu Core** (FS-172) | Holds; IPRS results from identity |
| The institution as Dibon's customer | Odoo | — |
| Matches between the ledger and the rails | Recon engine | Feeds |

**What this module never stores:** money. A ledger records it; the
institution's accounts hold it.

**Under each ledger mode:** this module *is* the native mode. Where an
institution keeps its core, Kapu Core is not used, unless it moves loans
here and keeps deposits there (the split mode, FS-066), with recon tying
the two together.

## 5 · How it works

```
  members pay            M-Pesa . Airtel . T-Kash . bank
        |                              |
        v                              v
  +--------------------------------------------+
  |  INSTITUTION'S OWN ACCOUNTS AND SHORTCODES |  <-- the money
  +--------------------------------------------+
        | confirmations (rails)
        v
  +--------------------------------------------+
  |  KAPU CORE (Apache Fineract)               |  <-- the ledger
  |  clients . savings . shares . loans . GL   |
  |  tellers . end of day . maker-checker      |
  +--------------------------------------------+
     ^          ^           ^             |
     |          |           |             v
  Kapu MFI   Kapu Sacco   omni-channel   recon: ledger against the
  Collect                 apps, USSD     rails, every day; insights
```

## 6 · Rails and integrations

| Rail / system | Direction | Feed | Status |
|---|---|---|---|
| Mobile money | in / out | through rails | Planned (KC-09) |
| Banks | in / out | through rails | Planned — banks are next (FS-309) |
| Recon engine | out | postings and statements | Planned |
| Odoo general ledger | out | daily summarised totals | Planned (business-suite BS-08) |
| Regulators | out | returns | Planned (KC-10) |

## 7 · Regulatory position

- **Custody:** none. The institution's money stays in its own accounts.
- **Dibon as core vendor:** for deposit-taking Saccos, SASRA's vendor
  rules (FS-179 to FS-181); for banks, CBK's expectations of a core
  vendor (FS-321). Both include audits, regulator access and incident
  reporting.
- **Fit:** Fineract must be confirmed against each segment's needs before
  it is sold as the deposit core (FS-185).
- **Data:** members' KYC and balances are Confidential; ID numbers are
  Restricted. Hosted in-country.

## 8 · Controls

- **Maker-checker on every transaction that needs it** (KC-08).
- **Nothing is edited after posting.** Corrections are reversing entries.
- **The ledger ties to the rails every day,** through recon. A difference
  is a break, not an adjustment.
- **Attribution at the act** for tellers and approvers (access AC-05).

## 9 · Deployment

Hosted per institution on Liquid's Azure Stack (FS-032), or on the
institution's premises where it requires.

## 10 · What it does not do

- Hold money.
- Replace a core an institution wants to keep. Integrated first, always.
- Field-officer offline collection, at launch. It follows in phase 2 (KC-14, FS-320).

## 11 · Open questions

FS-066, FS-185, FS-321.

## 12 · Sources

- REVIEW.md FS-303, FS-311, FS-316, FS-319.
- Kapu Pay MFI PRD section, Draft v0.2, Jun 2026 — FR-7, FR-13, §6.
- docs/architecture.md §2, §4.
- Musoni System public site, read 2026-10-02, as a benchmark only.
