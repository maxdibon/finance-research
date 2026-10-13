---
id: observability-grafana
name: Observability on Grafana, with on-call — component specification
kind: spec
type: component
status: draft
release: R1
implements: [recon-observability]
depends_on: [access-keycloak, messaging]
used_by: [end-of-day-runner, event-bus-kafka, endpoints, recon]
version: 0.2.0
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-101, FS-633, FS-640, FS-642, FS-648, FS-653, FS-667, FS-711, FS-792]
last_reviewed: 2026-10-13
---

# Observability on Grafana, with on-call — component specification

How Dibon runs Grafana and its stack for R1: metrics, logs, traces,
dashboards, alert rules, and the on-call rota that turns a severity 1
into a phone call to an engineer (FS-633). Sources: Grafana's
documentation for alerting, contact points, notification policies and
mute timings, its OnCall maintenance notice, and GoAlert's documentation,
read on 2026-10-08. Nothing here is built.

## 1 · Purpose and scope

Observability answers *is the platform healthy, and who must know when it
is not?* It watches; it never moves money or changes a record.

| Id | Capability | In R1 |
|---|---|---|
| RO-16 | Metrics (Prometheus), logs (Loki), traces (Tempo), dashboards (Grafana) | Yes |
| RO-17 | Alerting and SLOs, reconciliation's included | Yes |
| RO-18 | On-call and incident response: a severity 1 pages by phone | Yes |
| RO-19 | Each role sees only what it needs | Yes, per institution |
| AC-02 | Staff sign in once, through Keycloak | Yes, as a dependency |

**Out of R1:** business analytics, which is insights (insights IN-01 and
on); security event monitoring, which is the managed detection service
(platform-security SE-13).

**Where it sits.**

```
  every service: metrics, logs, traces, heartbeats
        |
        v
  +----------------------------------+  severity 1, 2   +-----------------+   +-----------------+
  | OBSERVABILITY                    |----------------->| ON-CALL         |-->| TWILIO          |
  | watches, alerts                  |  webhook         | escalates       |   | phones, texts   |
  | [grafana, prometheus, loki]      |                  | [goalert]       |   | [partner]       |
  +----------------------------------+                  +-----------------+   +-----------------+
        |  severity 3, 4: email                                                  |
        v                                                                        v
  +-----------------+   +-----------------+                          the on-call engineer
  | ODOO            |   | MESSAGING       |<-- fallback SMS, if ON-CALL is silent
  | holds tickets   |   | sends SMS       |
  | [odoo]          |   | [kapu_service]  |
  +-----------------+   +-----------------+
```

**Related:** implements
[recon-observability](../modules/recon-observability.md); depends on
[access-keycloak](access-keycloak.md) and [messaging](messaging.md); used by
[end-of-day-runner](end-of-day-runner.md), [event-bus-kafka](event-bus-kafka.md), [endpoints](endpoints.md) and [recon](recon.md); routes by
[incident management](../service-management/incident-management.md).

## 2 · Version and hosting

- **Grafana OSS 13.x** (13.2.3, released 2026-09-29), self-hosted in
  Kenya beside the platform, unmodified; Grafana, Loki and Tempo are
  AGPL-licensed (architecture §6), which costs nothing while we do not
  change them.
- **Prometheus** for metrics, **Loki** for logs, **Tempo** for traces
  (RO-16).
- **Configuration as code:** data sources, dashboards, alert rules,
  contact points, mute timings and the notification policy tree are
  provisioned from files in the platform's repository. Grafana treats the
  whole policy tree as one resource, so it is provisioned whole, never
  edited by hand on a live instance.
- **Sign-in** by OpenID Connect against Keycloak (AC-02).

## 3 · Features used and not used

| Feature | Used | Why |
|---|---|---|
| Dashboards, per institution and Dibon-wide | Yes | RO-16, RO-19 |
| Grafana-managed alert rules, with labels | Yes | One place for every rule; labels carry the severity |
| Notification policies, routed by label | Yes | Severity decides the route (§4) |
| Contact points: webhook, email | Yes | To on-call, tickets and the fallback SMS |
| Mute timings and active time intervals | Yes | Notices to institutions in their working hours, for severity 3 |
| Silences | Yes | Planned maintenance, with a reason and an end |
| **Grafana OnCall (open source)** | **No** | Archived on 2026-03-24; its phone and SMS relay through Grafana Cloud stopped the same day |
| **Grafana Cloud IRM** | Not proposed | On-call now lives only there, a hosted service outside Kenya (FS-101); the alternative in §5 |
| Grafana's SLO app | No | A Grafana Cloud product; SLOs are Prometheus recording rules instead (RO-17) |
| A status page for customers | Optional | Gatus (Apache-2.0), which also checks our endpoints, or Uptime Kuma (MIT), self-hosted: customers' staff see a service's state without waiting for a notice; offered first to the Complete tier (FS-640) |

## 4 · Settings

**Labels on every alert:** `severity` (1 to 4, incident-management §1),
`service`, `institution`, `runbook` (a link), and `team`. No label or
annotation carries personal data (§7).

**The notification policy tree** (time zone Africa/Nairobi):

| Policy | Matches | Contact point | Grouping |
|---|---|---|---|
| Page | `severity=1` | ON-CALL, escalation policy "severity 1"; also the fallback SMS | By alert and institution; wait 30 seconds; repeat hourly |
| Notify | `severity=2` | ON-CALL, escalation policy "severity 2" | Wait 1 minute; repeat every 4 hours |
| Ticket | `severity=3` | Email to the helpdesk (a ticket in Odoo), and to the institution's operations contact in its working hours | Wait 5 minutes; daily |
| Request | `severity=4` | Email to the helpdesk | Daily |
| Default | anything unlabelled | Notify, and a rule to fix the missing label | — |

**The watchdog:** a rule that always fires, sent to ON-CALL's heartbeat;
if Grafana, Prometheus or the route between them stops, the heartbeat
goes quiet and ON-CALL pages.

**Alert rules for R1** (FS-653). Thresholds are proposed, and tuned after
go-live; severities follow the incident plan.

| Area | Condition | Severity |
|---|---|---|
| Callbacks | 95th-percentile latency over half the rail's timeout for 5 minutes; over 80% | 3; 2 |
| Callbacks | More than 1% answered with an error over 5 minutes | 2 |
| Callbacks | A payment found by status query or the nightly pull with no callback; more than 5 in an hour | 3; 2 |
| Callbacks | An unsigned callback not confirmed by status query within 2 minutes (RL-11) | 3 |
| Payouts | A result unknown after 15 minutes; after an hour (RL-10) | 2; 1 |
| Rails | A rail paused as degraded (RL-15); credentials or certificates 30 days from expiry | 2; 3 |
| Ledger | A repayment not posted 5 minutes after the rail confirmed it; 30 minutes | 3; 2 |
| Ledger | A write refused by Fineract after its retries | 3, per loan |
| Reconciliation | An exception past its SLA (RO-05) | As its SLA policy says |
| The night's close | As end-of-day-runner §6 | As there |
| Integrity | A nightly comparison finds an act without an approved request (approval-engine §9, access-keycloak §6) | 1 |
| Integrity | The audit chain fails verification (RO-24) | 1 |
| Recovery | Database replication more than 5 minutes behind: the recovery objective breached | 1 |
| Recovery | A backup, or a restore test, failed | 2 |
| Platform | Event consumers more than 10 minutes behind | 2 |
| Platform | A host's clock more than 500 ms out | 2 |
| Platform | Disk over 80%; over 95% | 3; 2 |
| Platform | A certificate 30 days from expiry | 3 |
| Access | Lockouts at more than three times their usual rate: a possible attack | 2 |
| Messages | Delivery failures on a route over 10% in 15 minutes; one-time codes taking over 30 seconds | 2 |
| Watchdog | The heartbeat silent | 1, paged by ON-CALL |

## 5 · On-call: the phone call

Grafana alone cannot keep a rota, escalate, or place a call. Three ways
to add it:

| Option | How | For | Against |
|---|---|---|---|
| **A. GoAlert, self-hosted (proposed)** | Open source (Apache 2.0), released September 2026; rotas, schedules, escalation policies, heartbeat monitors, a Grafana integration; sign-in by OpenID Connect; runs on PostgreSQL | Runs in Kenya with the platform; no per-user fee | Voice and SMS only through Twilio; one more service to run |
| B. Grafana Cloud IRM | Grafana's hosted on-call and incident product | Least to run; phone, SMS and app built in | Alerts leave Kenya; a per-user fee; a second vendor account to secure |
| C. Our own escalation | Grafana's webhook to a small service of ours, calling through our messaging and a Kenyan voice provider | Everything in Kenya | Code to write and keep: rotas, acknowledgement, escalation |

**Proposed: A**, with these rules:

- Escalation policy "severity 1": phone call to whoever is on call; no
  acknowledgement in 5 minutes, the next in the rota; after 15, the CTIO
  (incident-management §3).
- Escalation policy "severity 2": SMS and app notification; a phone call
  if not acknowledged in 15 minutes.
- Acknowledged by pressing a key on the call, replying to the SMS, or in
  the app; every step kept in the alert's timeline.
- Twilio receives only engineers' numbers and the short form of the
  notice (incident-management §4): no customer data.
- **The fallback:** severity 1 also goes, by webhook, to our messaging
  service, which sends an SMS on its own route; if ON-CALL is down the
  engineer is still told.

## 6 · Contracts

- **Every service** exposes Prometheus metrics, writes structured logs to
  Loki, and sends traces; the end-of-day runner's metrics and heartbeat
  are in its spec (end-of-day-runner §7).
- **Alert rules live beside the service** that owns them, as files, with
  their severity and runbook.
- **ON-CALL** has one integration key per service; Grafana's contact
  point posts to it.
- **Tickets:** severity 3 and 4 reach Odoo Helpdesk by email (business-suite
  BS-01).

## 7 · Security

- **No personal or Restricted data** in metrics, labels, log lines or
  alert text (platform-security SE-18): ids, never names or numbers.
- **Sign-in through Keycloak;** an institution's users see only its own
  folder of dashboards (RO-19); Dibon's operations see all.
- **Secrets** (Twilio's keys, GoAlert's data-encryption key, Grafana's
  service accounts) in OpenBao.
- **Alert history is kept,** with each acknowledgement and escalation, for
  the incident record (incident-management §5).

## 8 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| Metrics | Internal | 13 months (proposed) | None |
| Logs | Internal; Confidential where an id appears | 90 days searchable, a year archived; security events as SE-18 sets (proposed) | Ids only, never names or numbers |
| Traces | Internal | 14 days (proposed) | Ids only |
| Alert history, on-call timelines | Internal | With the incident record (service management) | Engineers' identities |

## 9 · Quality and metrics

- **A severity 1 rings within a minute** (G1); the watchdog proves the
  path continuously.
- **Its own health:** rule evaluation failures, notifications failed,
  ingestion lag; the fleet's Grafana watches each instance's.

## 10 · Threats

| Threat | For example | The answer |
|---|---|---|
| Tampering | An attacker silences alerts | Silences need a reason and an end, and are audited; the watchdog pages if the path stops |
| Information disclosure | Personal data in a log | Ids only (§7); checked by G8 |
| Spoofing | A page acknowledged by someone else | ON-CALL's sign-in through the `ops` realm, hardware keys only |
| Denial of service | A storm of alerts hides the one that matters | Grouping, inhibition and routing by severity (§4) |
| Elevation of privilege | One institution's dashboards seen by another | A folder per institution (RO-19; G7) |

## 11 · Checks before the build

| # | Check | Settles |
|---|---|---|
| G1 | A test severity 1 rings an engineer's Kenyan phone within one minute | RO-18 |
| G2 | No acknowledgement in 5 minutes: the next in the rota is phoned | RO-18 |
| G3 | Grafana stopped: the heartbeat goes quiet and ON-CALL pages | RO-17 |
| G4 | ON-CALL stopped: the fallback SMS still arrives | RO-18 |
| G5 | A severity 3 at 22:00 waits for the institution's working hours; the helpdesk ticket is immediate | RO-17 |
| G6 | A fresh instance provisioned from the files matches the live one | RO-16 |
| G7 | Sign-in through Keycloak; one institution cannot see another's dashboards | AC-02, RO-19 |
| G8 | An alert built with a name in it is caught before sending | SE-18 |

## 12 · Open questions

**For the owner:**

1. The on-call option: A, B or C (§5). Proposed: A.
2. A Twilio account, and the cost of calls and SMS to Kenyan numbers.
3. The rota: three engineers today (docs/operating-model.md).
4. A status page (§3): whether to offer one, and with which tool.
