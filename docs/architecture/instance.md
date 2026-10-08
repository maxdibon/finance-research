---
id: architecture-instance
name: Architecture — one instance, as R1 deploys it
kind: architecture
version: 0.1.0
owner: Solution architect
classification: Internal
review_ids: [FS-491, FS-649, FS-663]
last_reviewed: 2026-10-08
---

# One instance, as R1 deploys it

What runs in one institution's instance, as R1 deploys it for Roan Capital
(FS-649). Every institution gets its own (FS-491). How each box is built
or run is in [the specs](../specs/README.md); how instances sit on the
sites is in [deployment](deployment.md).

```
  staff (browser) . approvers (console, email link) . borrowers (links, codes) . rails
                                                |
                                                v
  +------------------------------------------------------------------------------------------+
  | EDGE                                                                                     |
  | filters and routes                                                                       |
  | [coraza, apisix]                                                                         |
  | web application firewall (SE-01); API gateway with rate limits (SE-02)                   |
  +------------------------------------------------------------------------------------------+
                                                |
                                                v
  +--------------------+  +--------------------+  +--------------------+  +--------------------+
  | KAPU MFI           |  | APPROVAL ENGINE    |  | LENDER RULES       |  | END-OF-DAY RUNNER  |
  | asks, then acts    |  | decides            |  | corrects           |  | closes the day     |
  | [kapu_service]     |  | [kapu_service]     |  | [kapu_service]     |  | [kapu_service]     |
  +--------------------+  +--------------------+  +--------------------+  +--------------------+

  +--------------------+  +--------------------+  +--------------------+  +--------------------+
  | RAILS              |  | RECONCILIATION     |  | MESSAGING          |  | IDENTITY           |
  | pays               |  | matches            |  | sends to people    |  | verifies           |
  | [kapu_service]     |  | [kapu_service]     |  | [kapu_service]     |  | [kapu_service]     |
  +--------------------+  +--------------------+  +--------------------+  +--------------------+

  +--------------------+  +--------------------+  +--------------------+  +--------------------+
  | KAPU CORE          |  | ODOO               |  | ACCESS             |  | EVENT BUS          |
  | records            |  | back office        |  | signs in, steps up |  | carries events     |
  | [apache_fineract]  |  | [odoo]             |  | [keycloak]         |  | [kafka]            |
  +--------------------+  +--------------------+  +--------------------+  +--------------------+

  +--------------------+  +--------------------+  +--------------------+  +--------------------+
  | DATABASE           |  | OBJECT STORAGE     |  | OPENBAO            |  | OBSERVABILITY      |
  | one per service    |  | vault files        |  | keys and secrets   |  | watches            |
  | [postgresql]       |  | [ceph_or_blob]     |  | [openbao]          |  | [grafana]          |
  +--------------------+  +--------------------+  +--------------------+  +--------------------+

  every box above runs in this institution's own namespace, with its own databases, keys and
  backups (FS-491); each talks to the others only as the network policy allows (SE-05)
```

| Box | What it is | Spec or module |
|---|---|---|
| EDGE | The only way in: a web application firewall and an API gateway | platform-security SE-01, SE-02 |
| KAPU MFI | The lending product's service: applications, collateral, vetting, the only writer to the ledger | mfi |
| APPROVAL ENGINE | Approval chains and decisions, step-up at each | [approval-engine](../specs/approval-engine.md) |
| LENDER RULES | The CBK lender regulations applied to each loan | [lender-rules](../specs/lender-rules.md) |
| END-OF-DAY RUNNER | The night's close: checks, Fineract's close, ours | [end-of-day-runner](../specs/end-of-day-runner.md) |
| RAILS | M-Pesa and bank instructions, confirmations and status | rails |
| RECONCILIATION | Matches rail events with the ledger; exceptions | recon-observability |
| FLOWZA | The team inbox for two-way conversations, sending through messaging; Dibon's own product (FS-663) | [messaging](../specs/messaging.md) §5 |
| MESSAGING | SMS, WhatsApp and email to people, from approved templates | [messaging](../specs/messaging.md) |
| IDENTITY | Register checks, the manual route, the document vault | identity |
| KAPU CORE | The ledger: Apache Fineract | [kapu-core-fineract](../specs/kapu-core-fineract.md) |
| ODOO | Back office: Sign, Helpdesk, HR, the institution's parties | business-suite |
| ACCESS | Keycloak: four realms, step-up | [access-keycloak](../specs/access-keycloak.md) |
| EVENT BUS | Kafka: every state change, signed | [event-bus-kafka](../specs/event-bus-kafka.md) |
| DATABASE | PostgreSQL, one database per service, nothing shared | [README](README.md) §6.1 |
| OBJECT STORAGE | The vault's files | identity ID-15 |
| OPENBAO | Every key and secret | [README](README.md) §6 |
| OBSERVABILITY | Agents and local stores, feeding the fleet's Grafana | [observability-grafana](../specs/observability-grafana.md) |

**Environments.** One code base, the same signed images, promoted through:

| Environment | What it is for | Data |
|---|---|---|
| Development | Each engineer's own, with the simulators (rails RL-17, identity ID-20) | Synthetic only |
| Test | Shared; every acceptance test and the checks before the build (Fineract F1 to F13, Keycloak K1 to K14, Grafana G1 to G8) | Synthetic only |
| Staging | Each release, configured as production is, before it reaches an institution | Synthetic only |
| Production | One per institution | Real |

**Production data never leaves production:** no copy, sample or
anonymised extract goes to another environment. A defect is reproduced
with synthetic data.
