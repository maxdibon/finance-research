---
id: event-bus-kafka
name: The event bus on Kafka — component specification
kind: spec
type: component
status: draft
release: R1
implements: [recon-observability]
depends_on: [observability-grafana]
used_by: [approval-engine, lender-rules, kapu-core-fineract, end-of-day-runner, messaging]
version: 0.1.0
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-453, FS-584, FS-627, FS-667]
last_reviewed: 2026-10-08
---

# The event bus on Kafka — component specification

How the platform's services tell each other what happened, for R1: the
version, the envelope every event wears, one catalogue of event names, the
rules of delivery, and what must be tried on a running cluster before the
build relies on it (FS-667). Sources: Apache Kafka 4.3, Strimzi 1.2,
Apicurio Registry 3.3 and the CloudEvents 1.0 specification with its Kafka
binding, read on 2026-10-08. Nothing here is built.

## 1 · Purpose and scope

The bus answers one question: *what happened, and can anyone prove it?*
Every state change is published once, as a signed event, so
reconciliation, messaging, financial crime and insights read the same
facts without asking each product (architecture §6). It carries facts;
it never holds the record of anything (the authorities do).

| Id | Capability | In R1 |
|---|---|---|
| RO-23 | Every step a signed event, carrying one transaction id end to end | Yes |
| RO-24 | Events hash-chained, so a change shows | Yes |
| RO-25 | The chain anchored in an append-only transparency log | Yes, design; the log's choice open (§13) |
| MS-12 | Messages made from product events | Yes, as a consumer |

**Out of R1:** streams processing for insights, tiered storage, events
shared with institutions' own systems.

**Where it sits.**

```
  +--------------------+  +--------------------+  +--------------------+  +--------------------+
  | KAPU MFI           |  | APPROVAL ENGINE    |  | RAILS              |  | KAPU CORE          |
  | asks, then acts    |  | decides            |  | pays               |  | records            |
  | [kapu_service]     |  | [kapu_service]     |  | [kapu_service]     |  | [apache_fineract]  |
  +--------------------+  +--------------------+  +--------------------+  +--------------------+
            | signed                |                       |                       | Avro, via
            | events                |                       |                       | adapter
            v                       v                       v                       v
  +--------------------------------------------------------------------------------------------+
  | EVENT BUS                                                                                  |
  | carries events                                                                             |
  | [kafka]                                                                                    |
  |                                                                                            |
  | outbox --> CloudEvents, signed --> one topic per domain --> each consumer, at least once,  |
  | in order per subject --> hashes chained, anchored in the transparency log                  |
  +--------------------------------------------------------------------------------------------+
            |                       |                       |                       |
            |                       |                       |                       |
            v                       v                       v                       v
  +--------------------+  +--------------------+  +--------------------+  +--------------------+
  | RECONCILIATION     |  | MESSAGING          |  | LENDER RULES       |  | OBSERVABILITY      |
  | matches            |  | sends to people    |  | corrects           |  | watches, alerts    |
  | [kapu_service]     |  | [kapu_service]     |  | [kapu_service]     |  | [grafana]          |
  +--------------------+  +--------------------+  +--------------------+  +--------------------+
```

**Related:** implements
[recon-observability](../modules/recon-observability.md); depends on
[observability-grafana](observability-grafana.md); used by
[approval-engine](approval-engine.md), [lender-rules](lender-rules.md),
[kapu-core-fineract](kapu-core-fineract.md),
[end-of-day-runner](end-of-day-runner.md) and
[messaging](messaging.md); the rules every event follows are also in
[interfaces](../architecture/interfaces.md).

## 2 · Version and hosting

- **Apache Kafka 4.x** (4.3.1 at writing), in KRaft mode, pinned to the
  latest minor that passes §12's checks; Apache-2.0.
- **Strimzi** (1.2, Apache-2.0, a CNCF project) runs it on Kubernetes, in
  each institution's instance.
- **Three brokers,** each also a controller; every topic replicated three
  times, two copies needed to accept a write. A broker's loss loses
  nothing and stops nothing.
- **To the second site:** MirrorMaker 2 copies every topic for warm
  standby (deployment.md §2); consumers resume from translated offsets.
- **Apicurio Registry** (3.3, Apache-2.0) holds each event's data schema.

## 3 · Features used and not used

| Feature | Used | Why |
|---|---|---|
| KRaft, three brokers, replication 3, two in sync | Yes | No loss on a broker's failure |
| Idempotent producers | Yes | A retry never writes twice |
| Topic per domain, keyed by subject | Yes | Order per record (§5) |
| Access lists per service, over mutual TLS | Yes | A service writes only its own domain (§8) |
| A dead-letter topic per consumer | Yes | A poison event set aside, with an alert, never dropped |
| MirrorMaker 2 | Yes | Warm standby |
| The schema registry, backward-compatible | Yes | A consumer never breaks on a new field |
| Kafka transactions across topics | No, in R1 | The outbox gives what we need (§6) |
| Kafka Streams, ksqlDB | No, in R1 | Insights reads the authorities |
| Tiered storage | No, in R1 | Retention is short (§9) |

## 4 · The envelope

Every event is a **CloudEvent 1.0** in structured JSON:

| Attribute | Holds |
|---|---|
| `specversion` | `1.0` |
| `id` | A UUID, unique per event; consumers use it to ignore repeats |
| `source` | `/kapu/{institution}/{service}` |
| `type` | `ke.dibon.` and the event's name from the catalogue (§5), for example `ke.dibon.kapu.mandates.request.approved` |
| `subject` | The record it is about: a request id, a loan id, an instruction id |
| `time` | When it happened, UTC (architecture §10) |
| `datacontenttype` | `application/json` |
| `dataschema` | The schema's address in the registry, with its version |
| `traceparent` | W3C trace context, for operational traces |
| `txid` | The transaction's id, end to end (RO-23) |
| `institution` | The institution's id |
| `prevhash` | The hash of the producer's previous event on this subject (RO-24) |
| `sig` | A detached signature over the event, by the producing service's identity, its key in OpenBao (RO-23) |

**Facts, not records.** An event may carry a fact as it was at the time
(an amount, the payer name the rail reported); never a Restricted value;
never a document (architecture §2, §7).

## 5 · The catalogue

**Names:** `kapu.{domain}.{entity}.{what happened}`, in the past tense;
the domain is the producing module. Specs write the name; the event's
`type` adds `ke.dibon.`. Topic per domain: `kapu.{domain}.events`.
A breaking change is a new name ending `.v2`, run beside the old until
every consumer has moved. A name not in this table is not published.

| Domain | Events | Producer | Main consumers |
|---|---|---|---|
| mandates | `kapu.mandates.request.submitted`, `.step.opened`, `.decision.recorded`, `.step.completed`, `.step.stalled`, `.sla.breached`, `.step.escalated`, `.request.approved`, `.request.declined`, `.request.returned`, `.request.withdrawn`, `.mandate.activated` | Approval engine | Kapu MFI, messaging (T26, T27), recon |
| mfi | `kapu.mfi.application.submitted`, `.loan.approved`, `.loan.declined`, `.loan.disbursed`, `.loan.settled`, `.loan.variation.issued`, `.loan.variation.accepted`, `.product.version.activated`, `.guarantor.named`, `.guarantor.statement.due`, `.guarantor.notice.issued`, `.guarantee.released`, `.complaint.logged`, `.complaint.resolved`, `.complaint.overdue` | Kapu MFI | Messaging, insights |
| mfi (lender rules) | `kapu.mfi.loan.nonperforming`, `.loan.performing`, `.loan.cap.reached`, `.loan.charge.waived`, `.repayment.allocated`, `.repayment.allocation.mismatch`, `.loan.ladder.changed` | Lender rules | Messaging, recon, insights |
| core | `kapu.core.loan.approved`, `.loan.disbursed`, `.repayment.posted`, `.transaction.reversed`, `.loan.closed` | Kapu Core, through the adapter (kapu-core-fineract §5) | Recon, lender rules |
| core (the close) | `kapu.core.eod.checked`, `.held`, `.released`, `.closed`, `.failed`, `.reported` | End-of-day runner | Observability, recon |
| rails | `kapu.rails.payment.received`, `.payout.sent`, `.payout.confirmed`, `.payout.failed`, `.payout.unknown`, `.reversal.completed` | Rails | Kapu MFI, recon |
| collect | `kapu.collect.payment.unplaced`, `.payment.still_unplaced`, `.payment.returned` | Collect | Messaging (T28 to T30) |
| recon | `kapu.recon.exception.opened`, `.exception.resolved` | Reconciliation | Service desk, insights |
| access | `kapu.access.role.changed`, `.blocked`, `.recovered` | Access | Messaging (T23, T25), audit |
| identity | `kapu.identity.sim.changed` | Identity | Messaging (T24), access |
| messaging | `kapu.messaging.message.sent`, `.delivered`, `.failed`, `.held`, `.blocked`, `.opted_out` | Messaging | Products, Odoo, observability |

A dot-leading name (`.loan.approved`) continues the domain's prefix.

## 6 · Delivery

- **Published through an outbox:** a service writes its change and the
  event in one database transaction; a relay publishes from the outbox;
  nothing is lost between the two, and nothing is sent for a change that
  did not happen (interfaces.md).
- **At least once:** each consumer records the event ids it has applied
  and ignores a repeat.
- **In order per subject:** the subject is the key, so every event about
  one request or loan lands in one partition, in order.
- **A poison event** goes to the consumer's dead-letter topic, with an
  alert; the consumer goes on.
- **Replay:** a consumer may re-read from any point inside retention
  (§9).
- **Signatures checked:** a consumer verifies `sig` and `prevhash`
  before acting; a failure is set aside and is a severity 1.

## 7 · The audit chain

Every event's hash, with its `prevhash`, is written to the audit store;
the chain's head is anchored in an append-only transparency log at least
hourly (RO-24, RO-25), so anyone holding our public keys can verify that
no event was changed or removed. Kafka is the carrier, not the archive:
the evidence lives in the audit store, for the institution's record
period.

## 8 · Security

- **Mutual TLS** between every client and broker, each service with its
  own identity (SE-05).
- **Access lists:** a service writes only its own domain's topic and
  reads only what it consumes; no service reads every topic.
- **No Restricted data** in any event (§4).
- **Disks encrypted** (SE-08); topics short-lived (§9).
- **The registry and the relay** run under their own identities; a schema
  change is a change under change enablement.

## 9 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| Events on topics | Confidential | 7 days (proposed); dead letters 30 days | Ids, and facts as reported (a payer's name) |
| The audit store: hashes and anchors | Internal | The institution's record period | None: hashes only |
| Schemas | Internal | Always, versioned | None |

## 10 · Quality and metrics

- **Tier 1:** a broker's loss loses nothing; an event reaches its
  consumers within a second at the 95th percentile (proposed).
- **Metrics:** consumer lag per consumer; dead letters; signature
  failures; outbox age per service; replication health; MirrorMaker lag.
- **Alerts** (observability-grafana §4): consumers more than 10 minutes
  behind (2); a signature failure (1); a dead letter (3); the outbox
  older than 5 minutes (2).

## 11 · Threats

| Threat | For example | The answer |
|---|---|---|
| Spoofing | A service publishes another's events | Access lists by identity; signatures checked by consumers |
| Tampering | An event altered in flight or at rest | The signature and `prevhash`; the anchored chain |
| Repudiation | A producer denies an event | Its signature and the anchored chain |
| Information disclosure | A consumer reads topics it should not | Access lists; no Restricted data in events |
| Denial of service | A flood from one producer | Quotas per client; lag alerts |
| Elevation of privilege | The registry used to break consumers | Backward compatibility enforced; schema changes under change enablement |

## 12 · Checks before the build

| # | Check | Settles |
|---|---|---|
| B1 | A broker stopped mid-load: no event lost, writes continue | §2 |
| B2 | The outbox relay killed mid-publish: on restart, nothing lost and consumers apply each event once | §6 |
| B3 | A tampered event is refused by its consumer and raises a severity 1 | §6, RO-23 |
| B4 | A schema change that drops a field is refused by the registry | §3 |
| B5 | Failover to the second site: consumers resume from translated offsets | §2 |
| B6 | A service tries to write another domain's topic: refused | §8 |
| B7 | A poison event goes to the dead letters, with an alert, and the consumer continues | §6 |
| B8 | The chain's anchor verified by a tool outside the platform | §7 |

## 13 · Open questions

**For the owner:**

1. The transparency log: Trillian or Rekor (RO-25).
2. JSON Schema or Avro for event data; designed: JSON Schema, since the
   envelope is JSON; Fineract's Avro converted by the adapter.
3. Retention on topics: 7 days proposed.
