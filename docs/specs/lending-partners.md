---
id: lending-partners
name: Lending partners — build specification
kind: spec
type: build
status: draft
released: unreleased
release: phase 2
implements: [mfi]
depends_on: [lending-service, back-office, vault]
used_by: []
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-926, FS-993, FS-995, FS-996, FS-997, FS-999, FS-1000, FS-1002, FS-1004, FS-1005, FS-1058, FS-1070]
last_reviewed: 2026-11-01
---

# Lending partners — build specification

How an institution works with the third parties its products depend on:
distributors, dealers, schools, hospitals, insurers, employers, produce
buyers, merchants and mobile operators (product-versions §4, Partner).
It was lending-service §5, and is a spec of its own (FS-1058) so the
lending service's spec holds R1 and this design is ready when MF-41 and
MF-42 are scheduled. It runs inside the lending service, as the lender
rules do (FS-629), with the company's record in the back office. Nothing
is built: every behaviour here is **designed**.

## 1 · Purpose and scope

What it answers: how does an institution take on, rely on and let go of
a partner, with its money, its data and its people each kept in the
right place?

| Id | Capability | In R1 |
|---|---|---|
| MF-41 | Partners onboarded and managed: the record, its relationships and their limits, the lifecycle, signed events back | No: phase 2, with MF-40 (this spec) |
| MF-42 | Partner data feeds: a contract per feed, a consent gate, checks and quarantine, only metrics forward | No: phase 2 (this spec) |

**Out of scope:** what a product lends against a partner's data, which
is decisioning's (DE-01); paying a partner, which is rails'.

**Where it sits.**

```
  +--------------------+          +--------------------+          +--------------------+
  | STAFF WORKSPACE    | commands | LENDING SERVICE    | company  | BACK-OFFICE GATEWAY|
  | shows, asks        |--------->| lends              |--------->| translates         |
  | [odoo]             |          | [kapu_service]     | by ref   | [kapu_service]     |
  +--------------------+          +--------------------+          +--------------------+
                                      ^             |
                                      | metrics,    | each draw and payment,
                                      | held rows   | signed, retried
                                                    v
                          +--------------------+  the partner's own system,
                          | RECONCILIATION     |  over an encrypted connection
                          | matches            |
                          | [kapu_service]     |
                          +--------------------+
```

**Related:** implements [mfi](../modules/mfi.md); depends on
[lending-service](lending-service.md), [back-office](back-office.md) and [vault](vault.md), where its due diligence is filed;
used by none yet; the intake is recon's (RO-01).

## 2 · Concepts

- **A partner:** a third party a product works with, kept by one
  institution; Dibon helps, and never approves.
- **A relationship:** a borrower's tie to a partner, a record of its own
  with its own limit (§3).
- **A feed:** a partner's data about its borrowers, under a contract,
  through one intake (§4).

## 3 · The partner and its lifecycle

**One partner, in two places,** joined by our reference:

| Part | Where | Why |
|---|---|---|
| The company: registration, directors and owners, contacts, documents, signed agreements | Odoo, through the back-office gateway | Odoo holds the parties no core holds (architecture §2) |
| What touches money: its verified settlement accounts, its exposure cap, its first-loss share, what it pays towards the price, its status | This service | Each change a request to the approval engine, decided by a second person, a new payee adding an approver (MD-19) |

**Relationships are records** (FS-1000). A borrower's tie to a partner (a
retailer to its distributor) is a record of its own, with its own limit,
balance, status and the partner's codes for it (a sales route, a
territory). A borrower may have several. **Limits nest:** a draw is
checked against the relationship's limit, the product's, the borrower's
overall limit and whatever the core holds (FS-926); where the core holds
only one limit per borrower, as a bank's did, the others live here.

**The lifecycle:**

1. **Proposed** by the institution's partner manager, in Odoo.
2. **Due diligence** by compliance: the business registry (ID-07), the
   tax PIN, the directors and beneficial owners, sanctions (FC-05); the
   documents by kind of partner, as a bank asks of a company (its
   incorporation, its directors and shareholders, a board resolution,
   signatories, tax compliance, a year's accounts, a beneficial ownership
   form; FS-999).
3. **Agreements signed** in Odoo Sign: the partner agreement (its data
   accurate, returned goods refunded to the loan, its first loss, fraud)
   and a data-sharing agreement (what, why, for how long).
4. **Settlement accounts verified:** the bank account's or paybill's name
   checked before it may be paid (RL-01).
5. **A feed contract and a test feed** (below), passed.
6. **Approved** by two people; then **live**.
7. **Monitored:** each partner's feed freshness, exposure, its borrowers'
   arrears, returns and disputes, and fraud signals, on a dashboard.
8. **Frozen or exited:** new draws stop, its settlement accounts are
   frozen, a relationship or the whole partner; open loans run off.

## 4 · Its data

**Its data comes in through one intake** (MF-42), built on recon's
(RO-01): a file through the portal or by SFTP first, an API from its ERP
later (Odoo's through sme-recon's wrapper):

- **A contract per feed:** its fields, format, frequency and version.
- **A consent gate:** no person's data is used without their recorded
  consent (LQ-22, privacy PR-21), **given for each partner apart** by
  default (FS-1004): a retailer who buys from two distributors consents
  to each. The institution may set a product's partner terms to one
  consent for the partners named at that moment, never for future ones;
  or turn consent off only where another lawful basis is recorded by
  decision, with its impact assessment. A consent is withdrawable, and
  its withdrawal stops the partner's data at the next feed.
- **Checks and quarantine:** completeness, duplicates, freshness, and
  odd jumps (purchases inflated before a limit renews) held for a person.
- **Only metrics go forward** to decisioning (DE-01), never the raw file;
  a mobile operator's scores are taken as scores, never rebuilt into
  what the operator withholds (FS-1002).
- **Cross-checked** against what the institution actually paid the
  partner, by recon.

**At a partner's exit,** its raw files are deleted at once, as operators'
agreements require of their data (FS-1002); the metrics already in loan
files stay with them; its record, agreements and evidence stay for their
retention, read-only.

**It hears back, signed** (FS-997): each draw, payment, freeze and
change is sent to the partner's own system as an event, signed, over an
encrypted connection, retried until delivered, and logged; never a plain
call to a fixed address.

## 5 · Its people, and operators

**Its people take part:** a distributor's or a school's staff use a
partner portal in Odoo (portal users need no licence; BS-03) to upload
data, confirm deliveries, see what they were paid and handle returns,
each act that touches money a command to this service; a sales
representative may help a borrower in the field (a call back, the route's
borrowers) and nothing more. Larger partners use the API instead.

**Bulk limits:** the institution's risk team refreshes limits in bulk, by
an upload and a download, approved by two people.

**Mobile operators are integrations, not portal users:** API credentials
in OpenBao, a test and a live environment, rate limits and monitoring,
under the institution's agreement with the operator (FS-993), which must
also allow Dibon to host and process for it (FS-1002). Recovery from a
wallet is the operator's to grant and withdraw; a payment prompt the
customer approves is the fallback.

## 6 · Interfaces

- **Commands and reads** through the lending service, for the staff
  workspace's Partners screen and the partner portal: propose, check,
  approve, freeze, exit; each act that touches money a command (§5).
- **Feeds in** through recon's intake (§4); **events out** to each
  partner's own system (§4), named in a `partner` entity of the product's
  domain when built (event-bus-kafka §5).

## 7 · Security and audit

- Approval by two people, freezes and exits recorded with who and why;
  Dibon holds no product role (AC-09).
- A partner's credentials only in OpenBao; its events signed; its
  settlement accounts named-checked before any payment (RL-01).

## 8 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| Partners: settlement accounts, caps, status; relationships and their limits; events sent and their delivery | Confidential | While a partner and its loans run, then seven years | Borrowers' ties to partners |
| Raw partner feeds | Confidential, in recon's intake (§4) | At most 90 days | Borrowers', with their consent (PR-21) |

**Where partner data is kept** (FS-1005). All of it in the institution's
own instance, in Kenya; none in Dibon's central systems, in git or on a
device (endpoints §2); each partner's raw data apart from every other
source's, as operators' agreements require (FS-1002):

| What | Where | Protected by | Kept |
|---|---|---|---|
| The company: its record, contacts, directors and owners | Odoo, through the gateway | Staff sign-in through access; the partner manager and compliance only | While a partner, then as Dibon's records rules say (docs/governance/documents.md) |
| Due diligence and KYB evidence, signed agreements | The document vault (ID-15) | Each file encrypted under keys in OpenBao; access logged | As the agreement's and the regulations' records rules say |
| Settlement accounts, caps, first loss, status; relationships and their limits | This service's own database (PostgreSQL, a primary and a synchronous standby) | Encrypted at rest; every change an approved request, every read logged | While a partner and its loans run, then seven years |
| Consents, per person and partner | The back office's consent store (MS-11), through the gateway, with the time, the channel and the text consented to | As the back office | While the relationship runs, then with the loan file |
| Raw feed files, and those quarantined | Recon's intake, in object storage: a bucket per partner | Encrypted under keys in OpenBao; no person reads a file but to clear quarantine | At most 90 days (PR-21), less where the data-sharing agreement says; then deleted, the file's hash kept for lineage |
| Metrics made from the feeds | Decisioning, in the decision record (DE-01) | As decisioning | With the loan file, seven years (PR-18) |
| A partner's credentials: its API keys, its event signing secret | OpenBao | Never in a file or a database; rotated | While a partner |
| Events sent to a partner, and their delivery | This service's outbox and log; the event bus's signed chain | Signed; the chain never edited (PR-14) | As the event bus keeps |

## 9 · Quality and metrics

- **Each feed fresh** to its contract's frequency; a feed late past its
  window is an alert (3), as recon's silent sources are (recon §6).
- **Metrics,** per partner: feed freshness, rows quarantined, exposure
  against its cap, its borrowers' arrears, returns and disputes.

## 10 · Threats

| Threat | For example | The answer |
|---|---|---|
| Spoofing | A partner's feed sent by someone else | Its credentials in OpenBao, per partner; the feed contract's checks |
| Tampering | Purchases inflated before a limit renews | Odd jumps quarantined for a person (§4) |
| Tampering | A settlement account changed to divert money | Two people and an added approver; the name checked before payment |
| Information disclosure | One partner's raw data seen with another's | A bucket per partner; deleted at its exit (§4) |
| Linkability (LINDDUN) | A retailer's data shared with every distributor it buys from | Consent for each partner apart (§4) |

## 11 · Acceptance tests

| # | Given | When | Then | Id, source |
|---|---|---|---|---|
| A1 | A retailer with two distributors | It draws from one | The draw is checked against that relationship's limit, the product's, its overall limit and the core's; the other relationship is untouched | MF-41, §5 |
| A2 | A partner's feed with a retailer who has not consented | The feed arrives | That retailer's rows are held, never used, and the partner told | MF-42, §5 |
| A3 | A partner's settlement account changed | The change is asked for | It waits for a second person and an added approver; until then payouts go to the old account or stop | MF-41, MD-19 |
| A4 | A draw paid to a partner | The partner's system is told | The event is signed, retried until delivered, and logged | MF-41, §5 |

## 12 · Open questions

**For the owner:** none yet; each operator's agreement must also allow
Dibon to host and process for the institution (FS-1002), checked partner
by partner.
