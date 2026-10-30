---
id: architecture-flows
name: Architecture flows — how the components work together, one question at a time
kind: architecture
status: draft
released: 2026.10.15
owner: Solution architect
classification: Internal
review_ids: [FS-695, FS-698, FS-699, FS-704, FS-706, FS-707, FS-896, FS-1053]
last_reviewed: 2026-10-29
---

# Flows: how the components work together

One diagram for everything would show every line and explain none
(FS-706). Each flow here answers one question, follows one thing through
the platform, and keeps to the few boxes that question needs. Together
with the other views they cover the platform:

| Question | Where |
|---|---|
| What runs in an instance, and what each box is | [instance](instance.md) |
| Where instances run, and how a site's loss is survived | [deployment](deployment.md) |
| How a payment moves, step by step | [runtime](runtime.md), as sequence diagrams |
| What each component is, its class and why we chose it | [technology](technology.md) |
| How a request gets in | §1 below: the edge |
| How a change goes out and becomes evidence | §2 |
| How a secret reaches a service | §3 |
| How a release reaches production | §4 |
| How a fault reaches a person | §5 |
| How data reaches the second site and the offline copy | §6 |

## 1 · A request coming in: the edge

What happens between the internet and a service (FS-704). The edge is
the only way in for traffic; people reach servers only through the
bastion.

```
   staff . borrowers . approvers     partners' systems            the rails' callbacks
              |  HTTPS                  |  HTTPS, client certificate    |  HTTPS
              v                         v                               v
  +----------------------------------------------------------------------------------------------+
  | PROVIDER PROTECTION                                                                          |
  | absorbs floods before they reach us (SE-03)                                                  |
  | [liquid]                                                                                     |
  +----------------------------------------------------------------------------------------------+
                            |
                            v   one listener for each: web . partner API . callbacks
  +--------------------------------------------------------+    +--------------------------------+
  | EDGE PROXY                                             |    | EDGE CONTROL                   |
  | checks every request, in this order                    |<---| turns routes into settings     |
  | [envoy]                                                |    | [envoy_gateway]                |
  |                                                        |    | from GitOps, never by hand     |
  | 1 TLS ended. A partner's client certificate must be    |    +--------------------------------+
  |   the one it registered (FAPI 2.0)                     |
  |                                                        |
  | 2 A rail's callback must come from the rail's          |
  |   published addresses, or it is dropped                |
  |                                                        |    +--------------------------------+
  |                                                        |    | WAF                            |
  | 3 Inspected against the OWASP rules; a match is        |--->| the OWASP Core Rule Set        |
  |   blocked, and logged                                  |    | [coraza]                       |
  |                                                        |    +--------------------------------+
  |                                                        |    +--------------------------------+
  |                                                        |    | ACCESS                         |
  | 4 Its token must be signed with the realm's key,       |--->| publishes each realm's keys    |
  |   in date, and meant for this API                      |    | [keycloak]                     |
  |                                                        |    +--------------------------------+
  |                                                        |    +--------------------------------+
  |                                                        |    | RATE LIMITS                    |
  | 5 The client must be within its rate                   |--->| counts per client, shared      |
  |                                                        |    | [envoy_ratelimit, valkey]      |
  |                                                        |    +--------------------------------+
  |                                                        |
  |                                                        |
  | 6 Sent to the one service its route names;             |
  |   nothing else can be reached                          |
  +--------------------------------------------------------+
                            |
                            v   only where a route and the network policy allow (SE-05)
  +----------------------------------------------------------------------------------------------+
  | SERVICES                                                                                     |
  | each in this institution's own namespace                                                     |
  | [kapu_service, keycloak, odoo]                                                               |
  | LENDING SERVICE . KAPU CONSOLE . CUSTOMER PAGES . APPROVAL ENGINE . RAILS . the login pages  |
  +----------------------------------------------------------------------------------------------+

  every decision (allowed, blocked, limited) is logged and counted for OBSERVABILITY
  never through the edge: people reach servers and databases only through the BASTION
```

- **Three audiences, three listeners:** the web (staff, borrowers,
  approvers, and Keycloak's own login pages), partners' systems (with
  their client certificates, FAPI 2.0, access AC-04) and the rails'
  callbacks (accepted only from the addresses each rail publishes, then
  confirmed by a status query before they count, rails RL-11).
- **The order matters:** cheap checks first, so a flood or an unknown
  caller is dropped before the firewall's rules run.
- **The proxy holds no secrets of its own:** its certificates come from
  cert-manager, the realms' public keys from Keycloak, its settings from
  GitOps through the control.
- **A blocked request never reaches a service.** Each decision is logged
  and counted, so an attack shows on a dashboard before it shows anywhere
  else.
- **Being decided:** Envoy Gateway against APISIX, with Coraza called as
  an external processor (FS-698, FS-699).

## 2 · A change going out: an event

How one service tells the others what happened, and how that becomes
evidence no one can quietly change (event-bus-kafka; recon RO-23 to
RO-25).

```
  +--------------------------+      +--------------------------+      +--------------------------+
  | RAILS                    |      | DATABASE                 |      | RELAY                    |
  | pays; any service alike  |--1-> | the outbox, inside the   |--2-> | reads the outbox in      |
  | [kapu_service]           |      | service's own database   |      | order, signs, sends      |
  |                          |      | [postgresql]             |      | [kapu_service]           |
  | saves its change and     |      |                          |      |                          |
  | the event together       |      | published events kept    |      | signed with the          |
  |                          |      | 7 days                   |      | service's identity       |
  +--------------------------+      +--------------------------+      +--------------------------+
                                                                                    |
                                                                                    | 3
                                                                                    v
  +--------------------------+      +--------------------------+      +--------------------------+
  | AUDIT STORE              |      | CONSUMERS                |      | EVENT BUS                |
  | each event's hash and    | <-5--| check, then apply once   | <-4--| a topic per domain,      |
  | the one before it        |      | [kapu_service]           |      | in order per subject     |
  | [postgresql]             |      |                          |      | [kafka]                  |
  |                          |      | RECONCILIATION .         |      |                          |
  | a chain: a change        |      | MESSAGING . LENDER       |      | each event on three      |
  | anywhere shows           |      | RULES . INSIGHTS . AUDIT |      | brokers                  |
  +--------------------------+      +--------------------------+      +--------------------------+
                |
                | 6
                v
  +--------------------------+      +--------------------------+
  | TRANSPARENCY LOG         |      | WITNESSES                |
  | the chain's head, hourly |--7-> | co-sign each checkpoint  |
  | [rekor]                  |      | [witness]                |
  |                          |      |                          |
  | run by Dibon central;    |      | the institution keeps    |
  | hashes only              |      | its own copy             |
  +--------------------------+      +--------------------------+
```

1. The service saves its change and the event in one database
   transaction, so neither exists without the other.
2. The relay reads the outbox in order and signs each event with the
   service's own identity.
3. It sends each to its domain's topic; the outbox keeps it 7 days, so a
   fresh cluster can be refilled after a site's loss (FS-694).
4. Each consumer checks the signature and the chain, applies the event
   once, and records its id; a repeat is ignored.
5. The audit consumer writes each event's hash beside the previous one's.
6. Every hour the chain's head is recorded in the transparency log at
   Dibon central: hashes only, never data (FS-700).
7. Witnesses, the institution among them, co-sign each checkpoint, so a
   history rewritten later would not match what they hold.

## 3 · A secret reaching a service

How a service gets what it needs to act, without anyone handling a
secret (README §6; rails RL-12; platform-security SE-05, SE-27).

```
  +--------------------------+      +--------------------------+      +--------------------------+
  | SPIRE                    |      | RAILS                    |      | OPENBAO                  |
  | proves which service     |--1-> | needs a database login,  |--2-> | keys and secrets         |
  | this is                  |      | M-Pesa's keys, and       |      | [openbao]                |
  | [spire]                  |      | a signature              |      |                          |
  |                          |      | [kapu_service]           |      | answers only what this   |
  | checks its namespace,    |      |                          |      | identity's policy allows |
  | account and image        |      |                          |      |                          |
  +--------------------------+      +--------------------------+      +--------------------------+
                                                                                    |
                                                                                    | 3
                                                                                    v
  +----------------------------------------------------------------------------------------------+
  | WHAT IT ANSWERS                                                                              |
  | [openbao]                                                                                    |
  |                                                                                              |
  | 3 a database login made for this service, valid for one hour                                 |
  | 4 M-Pesa's keys, read for this call and never written to disk                                |
  | 5 a signature, made inside OpenBao: the signing key never leaves it                          |
  +----------------------------------------------------------------------------------------------+
                |
                | 6
                v
  +----------------------------------------------------------------------------------------------+
  | OBSERVABILITY                                                                                |
  | every request audited: who asked, for what, when; never a value                              |
  | [loki]                                                                                       |
  +----------------------------------------------------------------------------------------------+
```

- **1.** SPIRE proves which service is running, from its namespace, account
  and signed image, and gives it a short-lived identity.
- **2.** The service shows that identity to OpenBao; no password is involved.
- **3 to 5.** OpenBao answers only what that identity's policy allows: a database
  login made for this service and expiring within the hour (3), the
  rail's keys for this call (4), or a signature made inside OpenBao (5).
- **6.** Every request is audited, never its value. Engineers never see these
  secrets; Restricted fields are encrypted one by one (SE-27).

## 4 · A release reaching production

How code becomes a running, signed version, and how it is undone
(service management §2; platform-security SE-06, SE-12; FS-701).

```
  +--------------------------+      +--------------------------+      +--------------------------+
  | GITHUB                   |      | RUNNER                   |      | HARBOR                   |
  | the pull request,        |--1-> | builds, tests, scans,    |--2-> | the image, by digest     |
  | reviewed and approved    |      | signs                    |      | [harbor]                 |
  | [github]                 |      | [actions_runner]         |      |                          |
  |                          |      |                          |      | a copy at each site      |
  | approval by the          |      | in Kenya; every step     |      |                          |
  | change's kind            |      | pinned to a digest       |      |                          |
  +--------------------------+      +--------------------------+      +--------------------------+
                |                                                                   |
                | 3                                                                 | 6
                v                                                                   v
  +--------------------------+      +--------------------------+      +--------------------------+
  | FLUX                     |      | KYVERNO                  |      | SERVICES                 |
  | follows the manifest     |--4-> | admits only images       |--5-> | the new version, rolled  |
  | at the agreed window     |      | signed by our key        |      | out a few at a time      |
  | [flux]                   |      | [kyverno]                |      | [kapu_service]           |
  |                          |      |                          |      |                          |
  | never during the         |      | from our registry,       |      | a step back is a         |
  | close (service mgmt §2)  |      | unprivileged             |      | revert, by the same path |
  +--------------------------+      +--------------------------+      +--------------------------+
```

1. A pull request, reviewed and approved as its kind of change requires,
   starts the pipeline on our runners in Kenya.
2. The runner builds, tests and scans, signs the image and records the
   signature in Rekor; the image goes to Harbor, by digest.
3. The merge updates the environment's manifest; Flux, in each cluster,
   follows it at the agreed window, never during the close.
4. Kyverno admits only images signed with our key, from our registry,
   without privileges.
5. The new version rolls out a few at a time; its health decides whether
   it goes on.
6. Each site pulls the image from its own copy of Harbor. Undoing a
   release is a revert, by the same path.

## 5 · A signal reaching a person

How a fault becomes a phone ringing, with a record of every step
(observability-grafana §4, §5; incident management).

```
  +--------------------------+      +--------------------------+      +--------------------------+
  | SERVICES                 |      | COLLECTOR                |      | STORES                   |
  | metrics, logs, traces    |--1-> | gathers and cleans       |--2-> | metrics . logs . traces  |
  | [kapu_service]           |      | [opentelemetry]          |      | [prometheus, loki,       |
  |                          |      |                          |      | tempo]                   |
  | one transaction id       |      | Restricted fields        |      |                          |
  | in each                  |      | dropped, never sent      |      | at each site             |
  +--------------------------+      +--------------------------+      +--------------------------+
                                                                                    |
                                                                                    | 3
                                                                                    v
  +--------------------------+      +--------------------------+      +--------------------------+
  | TWILIO                   |      | ON-CALL                  |      | GRAFANA                  |
  | calls the phone, or      | <-5--| whose turn, and who      | <-4--| the rule fires, by       |
  | texts it                 |      | next if no answer        |      | severity                 |
  | [twilio]                 |      | [goalert]                |      | [grafana]                |
  |                          |      |                          |      |                          |
  | acknowledged with a      |      | severity 1: the next     |      | severity 3: a ticket     |
  | key, a reply or the app  |      | in 5 min, the CTIO at 15 |      | in Odoo instead          |
  +--------------------------+      +--------------------------+      +--------------------------+
```

1. Every service emits metrics, logs and traces, each carrying the
   transaction's id.
2. The collector gathers them and drops Restricted fields before
   anything is stored.
3. Prometheus, Loki and Tempo keep them at each site.
4. A Grafana rule fires by severity: 1 and 2 go to on-call; 3 becomes a
   ticket in Odoo instead.
5. GoAlert finds whose turn it is and calls through Twilio: for severity
   1 a phone call, the next in the rota after 5 minutes without an
   answer, the CTIO at 15; every step kept in the alert's timeline.

## 6 · A backup leaving the site

How each kind of data reaches the second site and the offline copy
(deployment §2 to §4; platform-security SE-10, SE-20 to SE-22).

```
  +--------------------------+      +--------------------------+      +--------------------------+
  | DATABASE                 |      | CLUSTER                  |      | OBJECT STORAGE           |
  | every database           |      | its objects and          |      | the vault's files        |
  | [postgresql]             |      | volumes                  |      | [ceph_or_blob]           |
  |                          |      | [rke2]                   |      |                          |
  +--------------------------+      +--------------------------+      +--------------------------+
                |                                 |                                 |
                | 1                               | 2                               | 3
                v                                 v                                 v
  +--------------------------+      +--------------------------+      +--------------------------+
  | BARMAN CLOUD             |      | VELERO                   |      | REPLICATION              |
  | the change log, as it    |      | a copy of the cluster    |      | each file copied         |
  | happens; a full copy     |      | nightly                  |      | as it lands              |
  | nightly                  |      | [velero]                 |      | [bucket_replication]     |
  | [barman_cloud]           |      |                          |      |                          |
  +--------------------------+      +--------------------------+      +--------------------------+
                |                                 |                                 |
                |                                 |                                 |
                v                                 v                                 v
  +----------------------------------------------------------------------------------------------+
  | BACKUP STORE                                                                                 |
  | at site B, write-once, in its own security domain: its own accounts and keys (SE-20)         |
  | [object_storage]                                                                             |
  +----------------------------------------------------------------------------------------------+
                |
                | 4
                v
  +----------------------------------------------------------------------------------------------+
  | OFFLINE                                                                                      |
  | a weekly copy, encrypted before it leaves; opened only by three of five key holders          |
  | [offline_media]                                                                              |
  +----------------------------------------------------------------------------------------------+
```

1. Barman Cloud ships each database's change log as it happens, and a
   full copy nightly: any minute can be restored.
2. Velero copies the cluster's objects and volumes nightly.
3. The vault's files are copied to site B as they land.
4. Weekly, a copy is encrypted with keys production never holds and
   taken offline; three of five key holders are needed to open it.
