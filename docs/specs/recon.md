---
id: recon
name: Reconciliation platform — build specification
kind: spec
type: build
status: draft
release: R1
implements: [recon-observability]
depends_on: [kapu-core-fineract, event-bus-kafka, observability-grafana, access-keycloak, lender-rules, approval-engine]
used_by: [end-of-day-runner]
version: 0.1.0
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-095, FS-388, FS-509, FS-635, FS-766, FS-767, FS-785, FS-788, FS-789, FS-790, FS-791, FS-792]
last_reviewed: 2026-10-13
---

# Reconciliation platform — build specification

The reconciliation platform redesigned to be native to this environment
(FS-788), from the owner's notes (FS-790, FS-791): every shilling that
comes in or goes out accounted for, by count and amount, on every
channel; every hop of a transaction traceable; breaks corrected by rule,
by a person, or by a ticket; and **three ledgers that must always agree**:
the master's, a shadow built from the master's postings, and a companion
that works out on its own what every account should hold. The v1 platform's
prototypes (Control Tower, Recon Workbench, Exception Queue, Transaction
Trace, GL & Subledger) are its starting point; nothing here is built.

## 1 · Purpose and scope

Recon answers two questions, continuously: *is every movement of money
accounted for?* and *does every ledger agree with what actually
happened?*

| Id | Capability | In R1 |
|---|---|---|
| RO-01 | Ingest rail, bank and ledger events, and statement files | Yes, statement files and the M-Pesa feed; change-data capture from an institution's own core later |
| RO-02 | Matching with configurable rules: one to one, one to many, many to many, with tolerances | Yes |
| RO-03 | Three-way matching: ledger, statement and expected | No: phase 1, proposed for R2 (FS-792) |
| RO-04 | Intraday and end-of-day cycles; cut-offs held in transit | Yes, end of day; intraday later |
| RO-05 | The exception queue, by time left | Yes |
| RO-06 | Transaction trace | No: phase 1; R1 traces through RO-23 to RO-25 |
| RO-07 | Remediation and the automatic chase of items in transit | Yes, for M-Pesa |
| RO-08 | The ledger replica: here the shadow and the companion (§3) | No: phase 1, proposed for R1 (FS-792) |
| RO-09 | Treasury and float | No: R2 |
| RO-11 | Duplicate and anomaly detection | No: phase 1 |
| RO-17 | Alerting and SLOs, the match rate among them | Yes |
| RO-19 | Masking by role, access audit | Yes |
| RO-26 | Fee verification | No: phase 2 |

**Out of R1:** the companion, three-way matching with expected payments,
treasury, the extension catalogue (§7), change-data capture from an
institution's own core.

**Where it sits.**

```
  +-------------------+   +-------------------+   +-------------------+
  | M-PESA            |   | BANKS             |   | KAPU CORE         |
  | moves money       |   | move money        |   | records           |
  | [rail]            |   | [rail]            |   | [apache_fineract] |
  +-------------------+   +-------------------+   +-------------------+
          | callbacks, pulls      | statements            | postings, checkpoints
          v                       v                       v
  +---------------------------------------------------------------------+
  | EVENT BUS                                                           |
  | carries signed events                                               |
  | [kafka]                                                             |
  +---------------------------------------------------------------------+
          | master postings       | rail events           | source events
          v                       v                       v
  +-------------------+   +-------------------+   +-------------------+
  | SHADOW LEDGER     |-->| RECONCILIATION    |<--| COMPANION LEDGER  |
  | mirrors           | GL| matches, compares | GL| recomputes        |
  | [kapu_service]    |   | [kapu_service]    |   | [kapu_service]    |
  +-------------------+   +-------------------+   +-------------------+
                             | tickets      | alerts
                             v              v
                  +-------------------+   +-------------------+
                  | ODOO              |   | OBSERVABILITY     |
                  | records tickets   |   | watches, alerts   |
                  | [odoo]            |   | [grafana]         |
                  +-------------------+   +-------------------+
```

**Related:** implements
[recon-observability](../modules/recon-observability.md); depends on
[kapu-core-fineract](kapu-core-fineract.md),
[event-bus-kafka](event-bus-kafka.md),
[observability-grafana](observability-grafana.md),
[access-keycloak](access-keycloak.md), [lender-rules](lender-rules.md)
and [approval-engine](approval-engine.md); used by
[end-of-day-runner](end-of-day-runner.md); journeys
[JN-16](../journeys/unplaced-payment.md),
[JN-17](../journeys/accountant-morning.md),
[JN-10](../journeys/deposit.md), [JN-11](../journeys/transfer-out.md)
and [JN-12](../journeys/transfer-in.md).

## 2 · Concepts

- **Master:** the system of record for balances: Kapu Core in native mode,
  the institution's own core in integrated mode.
- **Shadow ledger:** the master's general ledger and sub-ledgers rebuilt
  from the master's own postings as they happen, kept in memory, near
  real time. It trusts the master's inputs and checks its bookkeeping.
- **Companion ledger:** independent of the master. It computes its own
  postings and totals from the source events (the rails' records, the
  approvals, the product's terms, the tariffs and tax rules) and so
  catches a master that is consistently wrong, which a shadow would copy
  (owner, FS-791).
- **Source:** anything recon reads: a rail's callbacks or pulls, a bank's
  API or statement, the master's events, an institution's core by
  change-data capture.
- **Completeness proof:** for a channel and a cycle, the count and amount
  the source reports against the count and amount the ledger holds, by
  currency.
- **Leg:** one part of a split transaction: a C2B payment of 2,000 becomes
  the amount received, the operator's fee, excise duty on the fee, and any
  sums owed to tax agencies or other recipients.
- **Break:** a difference recon cannot explain. **In transit:** a
  difference with a day it should clear.
- **Action:** what follows a break: completed automatically, reversed,
  handed to a person, or a ticket.
- **Extension:** a proven action or rule from Dibon's signed catalogue,
  switched on and configured by an institution, never written by it.

## 3 · The three ledgers

| Ledger | Built from | When | Agrees with the master when |
|---|---|---|---|
| Master | Its own processing | Always | — |
| Shadow | The master's postings, as signed events, with per-account sequence numbers | Within 5 seconds of each posting; snapshotted each hour | Every account's balance, every GL account's total, at every checkpoint the master signs |
| Companion | The source events alone: the rails, approvals, the product's terms, tariffs and tax rules | Each posting for money that moved; each account at end of day, the same way the master closes its day | Every account's balance and every leg, at the close |

**Rules:**

1. **The three must always agree.** A shadow difference is a break at once;
   a companion difference is a break at the close. Neither is ever
   corrected by changing a ledger to match another: the master is fixed by
   an approved posting, and the shadow or companion by finding the cause.
2. **A balance that grew without money behind it is a severity 1.** The
   companion, having no posting for it, is how a direct edit of the
   master's database is caught (FS-789).
3. **Missing events show.** Each master event carries a sequence number
   per account, and the master emits a signed checkpoint each cycle
   (counts and totals per GL account); a gap or a checkpoint that does not
   match is a break.
4. **Two channels.** The shadow also reads balances through the master's
   API on a schedule, so suppressing events alone cannot hide a change.
5. **Integrated mode:** the shadow reads the institution's core by
   change-data capture (Debezium, Apache-2.0) instead of events; the
   companion works the same.
6. **Parallel runs:** before a go-live, a migration or a core replacement,
   the companion runs beside the old system and the new until they agree.

## 4 · What recon does

**4.1 Incoming money.** Every credit on every channel matched to its
posting; completeness by count and amount per channel, per cycle, per
currency; an SLA per channel for the time from the rail to the ledger
(RO-02, RO-04, RO-17).

**4.2 Outgoing money.** Every payout matched from approval to settlement:
approved, released, accepted, debited, settled, or returned; the same
completeness and SLAs; queued payouts checked against the rail's statement
before release (RL-01, FS-661).

**4.3 Internal tracing.** Every hop of a transaction, with both sides'
evidence, verifiable by anyone holding our public keys (RO-23 to RO-25).

**4.4 Auto-correction.** Each break type has its action, set per
institution:

| Action | When | Who decides |
|---|---|---|
| Complete automatically | A read settles it: a status query, a pulled transaction, a statement line | Recon, alone (RO-07) |
| Reverse | Money moved wrongly | The institution's approval chain, never recon alone (MD-01) |
| A person in the middle | Anything the institution's rules say a person must see first | The role its rules name |
| A ticket | A customer or a transaction needs someone to act | A ticket per customer or transaction in Odoo (or Zoho), with the evidence |
| An alert | A system fails: M-Pesa down, a feed silent, a checkpoint missing | On-call, through observability |

**4.5 Finance's manual reconciliation.** What the rules could not
settle, worked by the accountant in the exception queue, with suggested
matches to approve (RO-03, RO-05; JN-17).

**4.6 Reports.** The match rate by channel (98% automatically, FS-766);
weekly and monthly trends; performance by region, branch and rail;
balances and their discrepancies. In Superset, on the governed metrics
(insights; FS-791).

## 5 · Split transactions

A payment's legs are computed by the companion before they are matched:
for a C2B payment of 2,000, the amount received, the operator's fee from
its tariff, excise duty on the fee, and any sums owed to tax agencies or
other recipients. Each leg is matched on its own, so a payment that does
not reconcile shows which leg is wrong. Tariffs and tax rates are
versioned and effective-dated, so a past payment is checked against the
rates of its day (RO-02, RO-26).

## 6 · Sources

- **Adding a source is configuration:** an adapter for its format (MT940,
  CAMT.053, CSV, a rail's API, change-data capture), a mapping of its
  fields to the normalised event, and a mapping of its result codes to
  ours (RL-02). No code for a source whose format we already read.
- **Files are streamed,** never loaded whole, and checked before any line
  is matched (RO-01, FS-767).
- **A source that goes quiet is a break,** not a pass: each source has an
  expected rhythm, and silence past it raises an alert.

## 7 · Extensions

A catalogue of proven extensions, built, tested and signed by Dibon, which
an institution switches on and configures (FS-791): raise a ticket in Odoo
or Zoho; alert; pause a rail; notify a customer through messaging;
propose a reversal for approval. Two kinds: **per transaction**, which act
on one customer's break, and **per system**, which act on a source or a
rail. Institutions never upload code; a new extension enters the
catalogue through change enablement, and runs only as a signed image
(SE-06, SE-12).

## 8 · What recon takes over, and how it meets the other modules

Comparisons of two records of money move into recon (FS-788); each module
keeps acting on the result.

| Module | Today | With recon |
|---|---|---|
| Approval engine | Its nightly comparison of Fineract with approved requests (approval-engine §9) | Recon raises it; the engine stays the authority |
| End-of-day runner | Its checks C3 to C6 and P5 | Recon computes them and publishes the result; the runner decides to hold or close, and its morning report takes recon's breaks and match rate |
| Lender rules | Allocation mismatches; interest, fees and the cap | The companion recomputes them; lender rules keep enforcing |
| Rails | Statements against payouts; returns and recalls | Recon confirms settlement and returns; rails execute and hold |
| Collect | Unplaced payments (CO-21) | Recon identifies by the payment reference and its check digits (FS-785) and holds; Collect does the outreach |
| Kapu Core | Postings and the close | The master: it emits postings and signed checkpoints; recon never writes to it |
| Escrow | The daily tie-out (ES-10) | Recon's, as a rule |
| Business suite | Core totals into Odoo's ledger (BS-08) | Recon ties the two out daily |
| Insights | Reads recon's metrics | Unchanged |
| Odoo | Helpdesk | Receives tickets from recon's extensions |

Comparisons that move no money stay with their owners, on the same
pattern: roles against approvals (access-keycloak §6), employees against
users, Dibon's access register, and configuration against code.

## 9 · Interfaces

**Consumed:** the rails' events, Kapu Core's events and checkpoints,
approvals (`kapu.mandates.request.approved`), statement files, the
master's balances by API.

**Published** (event bus catalogue, event-bus-kafka §5):
`kapu.recon.break.opened`, `.break.cleared`, `.break.escalated`,
`.ledger.disagreed`, `.completeness.failed`, `.source.silent`,
`.cycle.closed`, `.action.taken`.

**Endpoints:** the exception queue and its actions; completeness and
match-rate figures; a transaction's trace and its evidence export
(RO-25).

## 10 · Security and audit

- **One way.** The shadow and the companion read; nothing reads back from
  them into the master, and recon never writes to the master: a
  correction is an approved posting made by the product's service.
- **A separate security domain** for the shadow and the companion: their
  own databases, administrators and credentials, as the backups have
  (SE-20). Whoever can change the master cannot change them.
- **Signed events,** checked on arrival; each event id accepted once;
  signatures made with short-lived keys OpenBao issues to each service,
  not a call to OpenBao per event (§11).
- **The master's database** (FS-789): no superuser and no human login,
  break-glass only, two people, recorded; pgAudit and database activity
  monitoring shipped at once to write-once storage in another domain;
  each journal row hashed into the audit chain and rescanned; data fixes
  only as approved postings; schema changes only through the pipeline;
  point-in-time recovery to before any tampering (SE-22).
- **Recon's own store** is append-only, and its results are anchored in
  the transparency log the institution witnesses (RO-24).
- **Masking by role** (RO-19); Restricted data never in a break's record.

## 11 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| Normalised events and statement lines | Confidential | Seven years (POCAMLA s.46) | Payers', payees' and customers' |
| Matches, breaks, actions and their evidence | Confidential | Seven years | As above |
| The shadow ledger | Confidential | In memory, snapshotted hourly; rebuilt from the event bus | Account references only |
| The companion's postings and totals | Confidential | Seven years, beside the master's | Account references only |
| Tariffs and tax rates, versioned | Internal | For as long as any payment they priced is kept | — |

## 12 · Quality and metrics

**Targets** (docs/architecture/quality.md, "Scale"): per instance, 25
million accounts and 10 million transactions a day, 2,000 a second at
peak; the shadow within 5 seconds of the master; the companion's close of
every account within 2 hours; 98% of transactions matched automatically.
None is proven until the load test in §14 passes.

**How it reaches them:** the shadow's balances in memory in Valkey (BSD-3;
not Redis, now AGPL), rebuilt from the event bus after a restart;
stores partitioned by day and by account range, old partitions archived;
the companion's close run in parallel by account range; files streamed;
the transparency log anchoring chain heads, not each event.

**Metrics:** match rate by channel; break count and age; completeness by
channel; the shadow's lag; ledger disagreements; source silence. **Alerts**
(observability-grafana §4): a balance grown without money, severity 1; a
ledger disagreement or a failed completeness proof, severity 2; a silent
source, by its rhythm.

## 13 · Threats

| Threat | For example | The answer |
|---|---|---|
| Spoofing | A forged posting event | Events signed by the issuing service and checked on arrival |
| Tampering | A balance edited directly in the master's database | The companion has no posting for it: a severity 1; pgAudit and activity monitoring off the instance; journal rows rescanned against the chain |
| Tampering | Events withheld to hide a change | Per-account sequence numbers, signed checkpoints, and the master's API read on a second channel |
| Repudiation | "Who corrected that break?" | Every action attributed and chained; money actions through the approval chain |
| Information disclosure | A break's record exposes a customer | Masking by role; no Restricted data in a break |
| Denial of service | A flood of events at peak | Partitioned consumers that scale out; the shadow's lag alerted |
| Elevation of privilege | Recon used to move money | Recon never writes to the master; reversals only through the approval chain |
| Linkability (privacy) | Trends that profile one customer | Reports aggregate; a person's trace only for a break or a dispute |

## 14 · Acceptance tests

| # | Given | When | Then | Id, source |
|---|---|---|---|---|
| A1 | A posting in Kapu Core | Its event arrives | The shadow agrees within 5 seconds | RO-08 |
| A2 | An account's balance updated directly in the database | The companion's next check | A severity 1 alert; the account named; no posting found | FS-789 |
| A3 | An event withheld from the bus | The next checkpoint | A sequence gap and a checkpoint mismatch, both breaks | §3 rule 3 |
| A4 | A C2B payment of 2,000 with a fee and excise duty | Matched | Each leg matched on its own; a wrong fee shows on its leg | §5 |
| A5 | M-Pesa's day: 10,000 payments | The cycle closes | Completeness by count and amount; any difference a break | RO-04 |
| A6 | A break whose action is "reverse" | Proposed | Nothing reversed until the institution's chain approves | MD-01 |
| A7 | A source silent past its rhythm | The rhythm passes | An alert, not a pass | §6 |
| A8 | A new statement source in a known format | Configured | Read and matched with no code change | §6 |
| A9 | 10 million transactions in a day, 2,000 a second at peak | The load test | The shadow within 5 seconds; the companion's close within 2 hours | Quality |
| A10 | Recon's own result altered in its store | The chain is verified | The change shows | RO-24 |

## 15 · Open questions

**For the owner:**

1. Which of the proposals for R1 and R2 to take (FS-792).
2. Database activity monitoring: an open-source tool on pgAudit, or a
   proprietary one for banks that require it (FS-790).
3. The extension catalogue: which extensions ship first.

**For the customer:** its rules for each action (who is the person in the
middle, which breaks may complete alone), and each channel's SLA.
