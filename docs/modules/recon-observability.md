---
id: recon-observability
name: Recon & Observability
kind: shared-service
version: 0.1.0
owner: Solution architect
classification: Internal
audience: [bank, sacco, mfi, psp, imt, fintech]
depends_on: [rails, notifications, mandates]
consumed_by: [collect, gateway, mfi, sacco, sme-recon]
review_ids: [FS-011, FS-012, FS-038, FS-063, FS-095, FS-096, FS-097, FS-098, FS-099, FS-100, FS-101, FS-102, FS-103]
last_reviewed: 2026-10-01
---

# Recon & Observability

## 1 · In one paragraph

Recon & Observability is a shared service in two parts. **The recon
engine** matches every transaction across both sides — rails, banks and
the customer's ledger — and keeps every break open and visible until
evidence closes it. **The observability layer** watches the systems that
move the money: their metrics, logs, traces, alerts and on-call. The two
are loosely coupled but share the same data. Every Kapu product uses the
service. Institutions also get it with **an operations surface of its
own**: a control tower, an exception queue, a trace for every
transaction, and a ledger view in which suspense is the exception queue
seen from the books. The SME version is a separate product, sme-recon. It
runs on this same engine behind an ERP — FS-095.

## 2 · Who it is for

**Segments:** fintechs and microfinances first, as in the July proposal.
Then the institution tiers in FS-029, and international money transfer and
forex operators. The first prospect is one of those (FS-012).

**The problem, concretely:** reconciliation is done by hand, across
channels, after the fact. Exceptions are found late and resolved without a
trail. Fraud checks raise false positives. SLAs are missed because nobody
can see which breaks are about to breach (July proposal, Introduction).

**People who use it:**

| Role | What they need from it |
|---|---|
| Operations analyst | An exception queue in SLA order; a trace of any transaction; a way to resolve with evidence |
| Finance and treasury | Proof that the books tie at day close; float and settlement positions; where every shilling of difference sits |
| Branch supervisor | Each till's count by currency and denomination, against what it should hold |
| Compliance and audit | Evidence for the period, without retyping; an audit trail where nothing is rewritten |
| Engineering and on-call | Rail and service health, SLOs, alerts routed by severity, incident timelines |

## 3 · What it does

**Two sources, neither of them a build.** The Automated Channels
Reconciliation proposal (Jul 2026) is a functional specification at a high
level. The prospect prototype (Aug 2026) is a clickable demo that draws
every screen. Both count as **Designed** evidence. Neither shows anything
running — FS-099, FS-100.

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| RO-01 | Ingest rail, bank and ledger events: real-time callbacks, API pulls, statement files | Designed | Proposal: data pipeline. Prototype: manual load of CSV, XLSX, MT940, fixed-width | 1 |
| RO-02 | Matching engine with configurable rules. Outcomes: matched clean, matched with variance, unmatched on our side, unmatched at the counterparty, duplicate | Designed | Proposal: analysis engine. Prototype: Recon Workbench | 1 |
| RO-03 | Three-way matching: ledger, statement and expected | Designed | Prototype: Manual Recon | 1 |
| RO-04 | Intraday and end-of-day cycles, mirroring the customer's own cycle | Designed | Proposal: functional spec. Prototype: Control Tower cycle table | 1 |
| RO-05 | Exception queue, ordered by SLA remaining rather than by amount, with owner and age | Designed | Proposal: SLA routing. Prototype: Exception Queue | 1 |
| RO-06 | Transaction trace: every hop, with both sides' evidence | Designed | Prototype: Transaction Trace | 1 |
| RO-07 | Remediation: status query, retry, repost, reversal — each audited | Designed | Proposal: actors and corrective workflows. Prototype: status query that completes a break. Control rule in §8 — FS-097 | 1 |
| RO-08 | Ledger replica, checked two ways: real-time assertions from posting events, and a nightly batch proof that subledgers sum to their parents. Suspense holds exactly the open breaks | Designed | Prototype: GL & Subledger | 1 |
| RO-09 | Treasury and float: where the money sits, and hours of float left at the current burn | Designed | Prototype: Treasury & Float | 2 |
| RO-10 | Branch and till cash by currency and denomination | Designed | Prototype: Branches & Tellers. For institutions with cash; not every customer | 2 |
| RO-11 | Duplicate and anomaly detection | Designed | Proposal: fraud detection and risk mitigation. Rule-based in the specification; nothing learned | 1 |
| RO-12 | Integration with an existing fraud system | Planned | Proposal: one line, no specification | 2 |
| RO-13 | Evidence for a period, assembled from traces rather than retyped | Designed | Prototype: Recon Attestation | 2 |
| RO-14 | Regulatory returns and suspicious-activity reporting | Planned | Prototype: marked "Phase 2 — illustrative"; not real forms | 2 |
| RO-15 | AML and sanctions screening (sanctions lists, PEP, structuring) | Planned | Prototype: Phase 2, illustrative — FS-098 | 2 |
| RO-16 | Observability: metrics (Prometheus), logs (Loki), traces (Tempo or Jaeger), dashboards (Grafana) | Designed | Proposal: Observability. Kapu technical documentation uses the same stack | 1 |
| RO-17 | Alerting and SLOs, including reconciliation SLOs such as match rate | Designed | Proposal: Alerting & SLO | 1 |
| RO-18 | On-call and incident response | Designed | Proposal: Grafana IRM. On-prem availability unverified — FS-101 | 1 |
| RO-19 | Role-based field masking, MFA, access audit, encryption at rest and in transit | Designed | Proposal: Security Features. Prototype: role-based masking | 1 |
| RO-20 | Processor settlement reports: gross transactions matched to net, batched settlements after fees | Planned | Needed if payment processors are partners — FS-096, FS-102 | 2 |

## 4 · Where it sits

**Depends on:** rails (feeds), notifications (alerts), mandates
(maker-checker for reversals and reposts).
**Used by:** collect (end-of-day against the core), gateway (every
merchant payment), mfi and sacco (repayments against Fineract), sme-recon
(the same engine behind an ERP).

**Does this cover the SME use case?** The engine does; the product does
not (FS-095).

| | Institution (this module's surface) | SME (sme-recon) |
|---|---|---|
| Matches against | The ledger: core or Fineract, GL and subledgers | The ERP: invoices, bills, expenses, investments |
| Feeds | Rails, nostro and settlement accounts, the core's postings | The SME's own bank, mobile-money and card statements |
| Resolution | Exceptions, suspense, remediation actors | Allocation in the ERP; unapplied funds stay visible |
| Surface | Control tower, queue, trace, ledger view | Inside Odoo, Zoho and others, through a wrapper |
| Moves money | Retries and reversals, controlled (§8) | Payments approved in the ERP (FS-037) |

**Who holds which record** (docs/architecture.md §2):

| Record | System of record | This module |
|---|---|---|
| Funds and balances | Core or Fineract | **Never authoritative.** The ledger replica (RO-08) is a checked copy, labelled as one |
| Parties | Odoo, or the core | References by id. A payer name the rail reported is kept as a fact of the event |
| Rail events, statements, matches, exceptions, resolutions | **Recon engine** | Holds. Append-only |
| Telemetry | The observability stores | Holds |

**What this module never stores:** a balance it treats as authoritative, or
an edited history. A correction is a new event; the old one stays.

**Under each ledger mode:**

| | Integrated — customer has a core | Native — no core; Fineract is the ledger |
|---|---|---|
| Where funds are posted | The core. This module does not post, except through remediation (§8) | Fineract |
| What differs in this module | RO-08 replicates the core's books from its posting events and proves them nightly. Breaks sit between the rails and the core | No replica is needed: Fineract is ours to read directly. Breaks sit between the rails and Fineract, a simpler problem |
| What the customer must provide | A posting-event feed or a GL extract on its cycle; chart-of-accounts mapping | Rail credentials or statements |
| Who it suits | Banks, IMTs, larger Saccos | Small MFIs and Saccos on Fineract |

## 5 · How it works

```
   RAILS & BANKS           CUSTOMER LEDGER          EXPECTED
   callbacks, pulls,       core postings or         payment requests,
   statement files         Fineract                 invoices, schedules
        |                        |                        |
        +------------------------+------------------------+
                                 |
                       +-------------------+
                       |  INGEST           |   normalise, keep the
                       |  (RO-01)          |   institution's reference
                       +-------------------+
                                 |
                       +-------------------+
                       |  MATCH            |   rules; three-way
                       |  (RO-02, RO-03)   |
                       +-------------------+
                         |               |
                  matched              break
                         |               |
                         v               v
                  +------------+   +-------------------+
                  | LEDGER     |   | EXCEPTION QUEUE   |
                  | VIEW       |   | SLA order, owner  |
                  | (RO-08)    |   | (RO-05, RO-06)    |
                  +------------+   +-------------------+
                                         |
                                 evidence, never inference
                                         |
                                 +-------------------+
                                 | REMEDIATE (RO-07) |
                                 | query: automatic  |
                                 | money: mandated   |
                                 +-------------------+

   OBSERVABILITY (RO-16 to RO-18) watches every box above, and the
   rails themselves: metrics, logs, traces, alerts, on-call.
```

**The rule the prototype's demo turns on:** suspense *is* the exception
queue, seen from the ledger side. When the queue is empty, suspense is
zero, and that is what closing the day means.

## 6 · Rails and integrations

| Rail / system | Direction | Feed | Status |
|---|---|---|---|
| M-Pesa, Airtel Money, T-Kash | in | real-time callback; statement file | Designed (RO-01) |
| PesaLink, bank EFT, RTGS | in | API pull; statement file (MT940) | Designed (RO-01) |
| SWIFT / nostro | in | statement file (MT940) | Designed (prototype) |
| Card acquiring | in | settlement file | Designed (prototype) |
| Payment processors, as partners | in | settlement report, net of fees | Planned (RO-20) |
| Core banking postings | in | event feed or GL extract | Designed (RO-08) |
| Fineract | in | API | Planned — mfi and sacco |
| Rails, for remediation | out | status query; retry; reversal | Designed (RO-07) |

## 7 · Regulatory position

- **Custody:** none. The engine reads, matches and reports. Its only
  outbound acts are remediation (RO-07): a status query moves nothing, but
  a retry, repost or reversal moves money. Those run under the customer's
  own credentials and authority, never ours.
- **Licence relied on:** the customer's own. The service holds no funds.
- **Regulators:** none directly. The customer's regulator — CBK, SASRA —
  will inspect the evidence it produces (RO-13). RO-14 would make it part
  of the customer's regulatory reporting.
- **Data:** transaction-level records are Confidential. A person's full
  payment history, assembled by the trace, is a pile worth more than its
  rows (docs/architecture.md §7). Bulk export is a separate permission.
  Retention periods are open — FS-063.
- **Open legal checks:** FS-063, FS-098.

## 8 · Controls

- **Nothing resolves by inference.** A break closes only on evidence: a
  rail's status-query response, a statement line, a posting. A timeout is
  not evidence of failure, and silence is not evidence of success.
- **Remediation is split by what it moves** — FS-097:
  - *Reads* — status queries and statement re-pulls — may run
    automatically.
  - *Money* — retries of payouts, reposts, reversals — needs maker-checker
    through the mandate engine. Each act is attributed at the moment it
    happens.
- **Append-only.** Every break, retry, SLA breach and resolution stays in
  the audit. Nothing is rewritten.
- **Role-based masking.** Each role sees only the fields it needs (RO-19).

## 9 · Deployment

Cloud-native on Kubernetes, as the July proposal describes. It runs on the
customer's premises or on Liquid's Azure Stack (FS-032). For an institution
it sits beside the core. For Kapu products it runs once, shared, inside
Kapu's own deployment. Grafana IRM may not be available outside Grafana's
own cloud — FS-101.

## 10 · What it does not do

- Hold funds, or act as the ledger.
- Decide a match by guessing. Unmatched funds stay unapplied and visible.
- Learn fraud patterns. RO-11 is rules; anything statistical is
  unspecified.
- File regulatory returns. RO-14 is Planned, and the prototype's forms are
  not real.
- Serve SMEs directly. That is sme-recon (FS-095).

## 11 · Open questions

FS-011, FS-012, FS-038, FS-063, FS-095, FS-096, FS-097, FS-098, FS-099,
FS-100, FS-101, FS-102, FS-103.

## 12 · Sources

- Automated Channels Reconciliation and Exception Handling System —
  technical proposal (Canva), Jul 2026.
- Prospect reconciliation prototype and demo script, Aug 2026. Shaped to a
  named prospect; *derived, not reproduced* (clients/).
- Kapu Pay Technical Documentation, v1.0, Apr 2026 — Operations & Support.
  *Derived, not reproduced.*
- docs/architecture.md §2, §5, §7.
