---
id: collect
name: Kapu Collect
kind: product
version: 0.1.0
owner: Product lead, Kapu
classification: Internal
audience: [bank, sacco, psp, fintech]
depends_on: [identity, rails, recon-observability, mandates, messaging]
consumed_by: [mfi, sacco]
review_ids: [FS-045, FS-050, FS-051, FS-052, FS-053, FS-054, FS-055, FS-056, FS-057, FS-058, FS-059, FS-060, FS-384, FS-388]
last_reviewed: 2026-10-01
---

# Kapu Collect

## 1 · In one paragraph

Kapu Collect lets a licensed institution take deposits that third parties
collect. Each deposit lands in a real account held at the institution in
the end user's name. The third party is a money collector, an SME or an
unlicensed deposit-taking or funds-holding operator (FS-045). It connects
through Kapu's APIs, and Kapu never holds the funds. For the institution,
Collect turns many small, scattered SME cash flows into deposits on its own
balance sheet. For the partner, it is the route into a regulated framework
without each partner holding its own licence first. Collect is designed to
run inside the institution's infrastructure, on-prem or on Liquid's Azure
Stack, and connects directly to the institution's core banking system.

## 2 · Who it is for

**Segments:** tier-2 and tier-3 banks first (8 Jun meeting), and
CBK-regulated institutions generally. On the partner side: collection
firms, SMEs with high collection volumes, and unlicensed deposit-taking or
funds-holding operators such as prepaid-card schemes (FS-045). Credit-only
lenders are not the target; they manage their own CBK relationship.

**The problem, concretely:** a large pool of SME collections sits outside
formal banking. The institution cannot reach it one SME at a time, and the
collector cannot be licensed quickly. Collect is how the two meet. The
compliance one-pager describes the pool as "multi-billion shilling". No
source in this folder supports that figure, and it must not be repeated
until one does (FS-051).

**People who use it:**

| Role | What they need from it |
|---|---|
| Institution operations team | Create and manage partners; see every partner's activity; dashboards and logs for the service |
| Institution technical team | A documented API and sandbox; integration with the core banking system; on-call and escalation paths |
| Partner (collector, SME, operator) | APIs to open accounts for its customers, collect, disburse and query; callbacks when async work finishes |
| End user | Funds held in a real account at a licensed institution. Interacts only through the partner's channel |

## 3 · What it does

**Collect ran in production at Onit Bank, with W-Harambee, from February
2025 to June 2026 (FS-390).** Rows that the Onit API technical
documentation (Feb 2025) and that deployment support are **Built**; the rest stay
Designed or Planned, and are not raised without evidence (FS-052). The
technical documentation (v1.0, Apr 2026) and the 8 Jun meeting remain the
sources for the rest.

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| CO-01 | Partner authentication (token issued per system identity) | Built | Onit API technical documentation (Feb 2025, held outside git); in production at Onit Bank, Feb 2025 to Jun 2026 (FS-384, FS-390). Technical documentation, Authentication API | 1 |
| CO-02 | Individual account opening, gated on an identity check (national ID, passport, alien ID) | Built | Onit API technical documentation (Feb 2025); in production at Onit Bank, Feb 2025 to Jun 2026 (FS-390). The gate was the phone number checked against the name the operator holds, through Onit's own agreements with Safaricom and Airtel, plus document-number validation; no IPRS call (FS-392). A new bank needs its own operator agreements | 1 |
| CO-03 | Sub-account opening under an existing customer | Built | Onit API technical documentation (Feb 2025, held outside git); in production at Onit Bank, Feb 2025 to Jun 2026 (FS-384, FS-390). Technical documentation, Sub-Account Opening | 1 |
| CO-04 | Balance, account info, account list, statement for a period | Built | Onit API technical documentation (Feb 2025, held outside git); in production at Onit Bank, Feb 2025 to Jun 2026 (FS-384, FS-390). Technical documentation, Account Management | 1 |
| CO-05 | Deposit by mobile-money push prompt, posted to the core on confirmation | Built | Technical documentation, Deposits; Safaricom go-live outstanding (8 Jun). M-Pesa push-prompt deposits ran in production at a Kenyan bank, Feb 2025 to Jun 2026 (FS-384) | 1 |
| CO-06 | Withdrawal to mobile, till or paybill | Built | Onit API technical documentation (Feb 2025, held outside git); in production at Onit Bank, Feb 2025 to Jun 2026 (FS-384, FS-390): withdrawal to mobile, till and paybill (B2C and B2B). Technical documentation, Withdrawals. Ordering defect — FS-054. Withdrawal to mobile (B2C) ran in production, Feb 2025 to Jun 2026 (FS-384); till and paybill (B2B) did not | 1 |
| CO-07 | Account-to-account transfer, synchronous | Built | Onit API technical documentation (Feb 2025, held outside git); in production at Onit Bank, Feb 2025 to Jun 2026 (FS-384, FS-390). Technical documentation, Funds Transfer | 1 |
| CO-08 | Transaction query by bank reference or by the partner's own request id; duplicate request ids refused | Built | Onit API technical documentation (Feb 2025, held outside git); in production at Onit Bank, Feb 2025 to Jun 2026 (FS-384, FS-390). Technical documentation, Query Transaction; response code 5001 | 1 |
| CO-09 | Asynchronous callbacks to the partner | Built | Onit API technical documentation (Feb 2025, held outside git); in production at Onit Bank, Feb 2025 to Jun 2026 (FS-384, FS-390). Technical documentation, Components | 1 |
| CO-10 | Management portal (institution) and partner portal | Designed | Technical documentation, Components. No screen specification in this folder | 1 |
| CO-11 | Metrics, logs and dashboards for the institution's operations team | Built | Onit API technical documentation (Feb 2025, held outside git); in production at Onit Bank, Feb 2025 to Jun 2026 (FS-384, FS-390). Technical documentation, Operations & Support | 1 |
| CO-12 | End-of-day reconciliation against the core banking system | Planned | Named in MFI PRD §1 ("the EOD reconciliation layer"); no specification. Delivered by recon-observability | 1 |
| CO-13 | Real-time transaction monitoring and automated fraud detection | Planned | **Both sources describe this as operating continuously; neither specifies it.** 8 Jun: fraud detection "must be designed in from the start" — FS-053 | 1 |
| CO-14 | Automated compliance reporting | Planned | Claimed in the one-pager; no specification — FS-053 | later |
| CO-15 | Maker-checker on partner and institution actions | Planned | MFI PRD FR-6 names Collect as a future consumer of the mandate engine | 2 |
| CO-16 | PesaLink as a deposit and withdrawal channel | Planned | Listed as a channel in the API; trust accounts with the PesaLink sponsor bank not yet in place (8 Jun) | 3 |
| CO-18 | Notifications to the end customer when a deposit lands, through messaging | Planned | Owner, 2026-10-02 (FS-315) | 1 |
| CO-17 | Loans on the bank's core: request, repayment, loan statement, loan balance, credit-limit check | Built | Onit API technical documentation (Feb 2025, held outside git); in production at Onit Bank, Feb 2025 to Jun 2026 (FS-384, FS-390), §2.6 | — |
| CO-19 | The recipient's registered name confirmed with M-Pesa Hakikisha before every withdrawal to mobile | Planned | Owner, 2026-10-03 (FS-388); rails RL-21 | 1 |
| CO-20 | A deposit whose confirmation never arrives is found with M-Pesa Pull Transactions and posted, not left unmatched | Planned | Owner, 2026-10-03 (FS-388); rails RL-20 | 1 |

## 4 · Where it sits

**Depends on:** identity (IPRS), rails (M-Pesa, Airtel Money, T-Kash,
PesaLink), recon-observability (CO-12,
CO-13), mandates (CO-15).
**Used by:** mfi and sacco, for deposit and repayment flows into a
regulated account.

**Who holds which record** (docs/architecture.md, pending):

| Record | System of record | This module |
|---|---|---|
| Funds and balances | The institution's core banking system | **Posts via; never holds.** Balances are read from the core on request |
| Customer KYC | The institution's core banking system | Passes through on account opening; identity result from IPRS |
| Partner registry, credentials, callback URLs | Collect | Holds |
| Transaction requests and their states | Collect | Holds, keyed on the partner's request id and the bank's reference |
| Matches and exceptions | Recon engine | Feeds |

**What this module never stores:** a balance of its own, or funds in any
account it controls. CO-04 balances come from the core. The only possible
breach of this line is the shortcode question in FS-056.

**Under each ledger mode:**

| | Integrated — institution has a core | Native — no core; Fineract is the ledger |
|---|---|---|
| Where funds are posted | The institution's core, through its API | Fineract, hosted for the institution |
| What differs in this module | Account opening and posting go through a core adapter written per core system. Balances are read live from the core | The same API to partners, posting to Fineract. The KYC record also lives in Fineract |
| What the customer must provide | Core API access, a sandbox, and its product codes | A licence to take deposits. **The institution is still the licensed party; Fineract is only its ledger** — FS-062 for DT-Saccos |
| Who it suits | Tier-2 and tier-3 banks, larger Saccos | Small DT-Saccos and licensed institutions without a digital core |

The technical documentation describes only the integrated mode.

## 5 · How it works

Partners call a single API service. Internal services communicate over
Kafka: the core-banking service, the mobile-money service and the
notification service. Every partner request is acknowledged at once, and
the outcome is delivered later by callback. If a callback fails, the
partner can recover the outcome by querying with its own request id.

**Deposit**, as the technical documentation's sequence diagram describes it:

```
  Partner      Kapu API       Ledger*      Mobile money    End user
     |            |              |              |              |
     | deposit    |              |              |              |
     |----------->| validate     |              |              |
     |            |------------->|              |              |
     | accepted   |              |              |              |
     |<-----------| push prompt  |              |              |
     |            |---------------------------->| PIN prompt   |
     |            |              |              |------------->|
     |            |              |              |     PIN      |
     |            |              | confirmation |<-------------|
     |            |<----------------------------|              |
     |            | post credit  |              |              |
     |            |------------->|              |              |
     |            |   posted     |              |              |
     | callback   |<-------------|              |              |
     |<-----------|              |              |              |

  * Ledger is the institution's core (integrated) or Fineract (native).
    The flow is the same; only the posting target differs.
```

**Withdrawal:** the sequence diagram debits the core first and then
disburses. The data-flow text says the two happen "simultaneously".
These describe different products — FS-054.

## 6 · Rails and integrations

| Rail / system | Direction | Feed | Status |
|---|---|---|---|
| M-Pesa (C2B push, B2C, B2B) | in / out | real-time callback | Built: ran in production at Onit Bank, Feb 2025 to Jun 2026 (FS-390). The 8 Jun note of an outstanding go-live is unexplained (FS-088) |
| Airtel Money | in / out | real-time callback | Designed |
| T-Kash | in / out | real-time callback | Designed (listed in the API; added to the suite 8 Jun) |
| PesaLink | in / out | to establish | Planned — CO-16 |
| Institution core banking system | read / post | API | Built: Onit Bank's core, through stored procedures (FS-390) |
| IPRS | read | API | Designed; integration not final (8 Jun). At Onit Bank the gate was the operators' number-and-name check, with no IPRS call (FS-392) |
| Rail statements for end-of-day matching | in | statement file / API pull | Planned — CO-12, FS-038 |

## 7 · Regulatory position

- **Custody:** funds rest in accounts at the licensed institution. Kapu
  holds none, **provided the mobile-money shortcodes and any trust account
  belong to the institution and not to Kapu or Dibon** (FS-056). If Kapu's
  own shortcode collects first and settles later, funds rest under our
  control, and that is regulated however briefly.
- **Licence relied on:** the partner institution's. The one-pager says
  Collect lets the institution "extend" its licence to cover collectors,
  and that collectors "operate under the bank's authority". Whether that
  wording is legally accurate, and what approval the institution needs from
  CBK to run it, is open — FS-057. Once Dibon holds a PSP licence (FS-031),
  that is a second route.
- **Regulators:** CBK (the institution; the NPS Act for the rails). SASRA
  where the institution is a DT-Sacco. ODPC for personal data.
- **Data:** customer KYC, phone numbers and statements are Confidential.
  Government ID numbers, partner credentials and tokens are Restricted.
  None of it may appear in samples or logs as real values — FS-058.
- **Open legal checks:** FS-056, FS-057.

## 8 · Controls

- **Attribution:** institution actions that create a partner, change a
  callback URL or move money are attributed at the moment of the act, not
  to the session. Designed as a requirement here; not in the technical
  documentation.
- **Mandates:** maker-checker through the mandate engine is Planned (CO-15).
  Until then, nothing in this module claims it.
- **Idempotency:** a repeated request id is refused (5001). This is the
  guard against a partner retry posting a deposit twice.
- **Exceptions:** a mobile-money confirmation that arrives without a core
  posting, or a posting without a confirmation, goes to the recon
  exception queue. It is never resolved by assumption. This depends on
  CO-12, which is Planned.

## 9 · Deployment

Designed for on-prem inside the institution's infrastructure, or on Liquid's
Azure Stack (FS-032). The 8 Jun meeting describes it as deployed in the
bank's own infrastructure under a licence fee. Pricing is excluded here by
design (FS-024).

The technical documentation commits to **99.99% API uptime**, which allows
about 52.6 minutes of downtime a year. That commitment depends on the
mobile-money rails and the institution's core, neither of which we
control — FS-059.

## 10 · What it does not do

- Hold funds, a wallet or a ledger of its own.
- Lend. Loan management sits in mfi and sacco (CO-17).
- Leave customers uninformed. Deposit notifications go through Dibon's
  messaging (CO-18, FS-315); the technical documentation's note that the
  institution's own notification service sends them is superseded, unless
  an institution prefers its own.
- License the partner. Partners still sit inside the institution's
  framework, under whatever approval FS-057 settles.
- Fraud detection, compliance reporting and maker-checker are not
  available yet: CO-13 to CO-15 are Planned.

## 11 · Open questions

FS-051, FS-052, FS-053, FS-054, FS-055, FS-056, FS-057, FS-058, FS-059,
FS-060.

## 12 · Sources

- Kapu Pay Technical Documentation, v1.0, 13 Apr 2026. Prepared for a
  partner bank; Confidential. *Derived, not reproduced.*
- Kapu Pay — Compliance By Design (one-pager, Canva), undated.
- KapuPay Discussion, meeting notes, 8 Jun 2026.
- Kapu Pay MFI PRD section, Draft v0.2, Jun 2026 (§1, §4, FR-6).
- REVIEW.md FS-045.
