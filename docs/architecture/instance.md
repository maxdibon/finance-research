---
id: architecture-instance
name: Architecture — one instance, as R1 deploys it
kind: architecture
status: draft
released: 2026.10.15
owner: Solution architect
classification: Internal
review_ids: [FS-491, FS-649, FS-663, FS-698, FS-704, FS-976, FS-1032, FS-1053, FS-1055, FS-1070]
last_reviewed: 2026-11-01
---

# One instance, as R1 deploys it

What runs in one institution's instance, as R1 deploys it for Roan Capital
(FS-649). Every institution gets its own (FS-491). How each box is built
or run is in [the specs](../specs/README.md); how instances sit on the
sites is in [deployment](deployment.md).

```
  PEOPLE      staff, in a browser       borrowers, by links and codes    the rails' callbacks
                          |                             |                             |
            +--------------------------------------------------------------------------------------+
  EDGE      | EDGE   the only way in: firewall, gateway, rate limits  [envoy, coraza]              |
            +--------------------------------------------------------------------------------------+
                                                        |
            +--------------------------------------------------------------------------------------+
  SIGN-IN   | ACCESS   staff by password and key; customers by a code to their                     |
            | phone; four realms; step-up for every decision         [keycloak]                    |
            +--------------------------------------------------------------------------------------+
                          |                             |                             |
            +--------------------------+  +--------------------------+  +--------------------------+
  SCREENS   | STAFF WORKSPACE          |  | KAPU CONSOLE             |  | CUSTOMER PAGES           |
            | daily lending, in Odoo   |  | approvals; the fallback  |  | consents, signing,       |
            | [odoo]                   |  | [kapu_service]           |  | statements               |
            |                          |  |                          |  | [kapu_service]           |
            +--------------------------+  +--------------------------+  +--------------------------+
                          |     as the person           |                             |
            +--------------------------------------------------------+  +--------------------------+
  CORE      | LENDING SERVICE   Kapu MFI's service:                  |  | DEPOSITS SERVICE         |
  SERVICES  | applications, collateral, product versions,            |  | deposit accounts,        |
            | partners; the only writer to the ledger;               |  | native mode              |
            | LENDER RULES beside it        [kapu_service]           |  | [kapu_service]           |
            +--------------------------------------------------------+  +--------------------------+
                          |     asks                    |                             |
            +--------------------------+  +--------------------------+  +--------------------------+
  SERVICES  | APPROVAL ENGINE          |  | RAILS                    |  | MESSAGING                |
            | decides, with step-up    |  | pays, collects: M-Pesa,  |  | SMS, WhatsApp, email     |
            |                          |  | banks                    |  |                          |
            +--------------------------+  +--------------------------+  +--------------------------+
            +--------------------------+  +--------------------------+  +--------------------------+
            | IDENTITY                 |  | FLOWZA                   |  | END-OF-DAY RUNNER        |
            | register checks          |  | conversations            |  | closes the day           |
            +--------------------------+  +--------------------------+  +--------------------------+
            +--------------------------+  +--------------------------+  +--------------------------+
            | BACK-OFFICE GATEWAY      |  | CORE ADAPTER             |  | VAULT                    |
            | the ERP's jobs           |  | posts to the core        |  | signed documents         |
            +--------------------------+  +--------------------------+  +--------------------------+
                          |                             |
            +--------------------------+  +--------------------------+
  RECORDS   | ODOO                     |  | KAPU CORE                |
            | back office: Sign,       |  | the ledger               |
            | Helpdesk, HR   [odoo]    |  | [apache_fineract]        |
            +--------------------------+  +--------------------------+
  EVENTS    ==== EVENT BUS [kafka]: every change, signed, in order =================================
            +--------------------------+  +--------------------------+
  CHECKS    | RECONCILIATION           |  | OBSERVABILITY            |
            | three ledgers agree      |  | metrics, logs, alerts    |
            |                          |  | [grafana]                |
            +--------------------------+  +--------------------------+
            +--------------------------+  +--------------------------+  +--------------------------+
  DATA      | DATABASE                 |  | OBJECT STORAGE           |  | OPENBAO                  |
            | five clusters, by tier   |  | the vault's files and    |  | keys and secrets         |
            | [postgresql]             |  | Odoo's filestore         |  | [openbao]                |
            |                          |  | [ceph_or_blob]           |  |                          |
            +--------------------------+  +--------------------------+  +--------------------------+

  people reach anything inside only through the BASTION, by ticket; never through the edge
```

Each layer asks only the one below it, as the arrows show; every change goes on the event bus, which reconciliation and observability read. Every box runs in this institution's own instance, with its own databases, keys and backups (FS-491): the edge in its namespace, the databases, event bus, OpenBao and object storage in the data namespace, the rest in services; each talks to the others only as the network policy allows (SE-05).

| Box | What it is | Spec or module |
|---|---|---|
| EDGE | The only way in: a web application firewall and an API gateway; how it works, [flows](flows.md) §1 | platform-security SE-01, SE-02 |
| KAPU CONSOLE | Our operators' approvals, the read-only fallback, products read-only, outside Odoo | [kapu-console](../specs/kapu-console.md) |
| STAFF WORKSPACE | Staff's screens for daily lending, inside Odoo | [staff-workspace](../specs/staff-workspace.md) |
| CUSTOMER PAGES | Borrowers' and members' own pages: consents, signing, statements | to write |
| LENDING SERVICE | Applications, collateral, vetting, product versions, partners; the only writer to the core; Kapu MFI is it configured for lenders | [lending-service](../specs/lending-service.md) |
| DEPOSITS SERVICE | Deposit accounts, in native mode | [deposits-service](../specs/deposits-service.md) |
| CORE ADAPTER | One interface to the core: Kapu Core, or the institution's own | [lending-service](../specs/lending-service.md) |
| BACK-OFFICE GATEWAY | The back office's jobs, through one adapter per ERP | [back-office](../specs/back-office.md) |
| VAULT | Every document carrying personal data, and its evidence | [vault](../specs/vault.md) |
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
| DATABASE | PostgreSQL, a database per component, nothing shared; by tier, below | [README](README.md) §6.1 |
| OBJECT STORAGE | The vault's files, Odoo's filestore | identity ID-15 |
| OPENBAO | Every key and secret | [README](README.md) §6 |
| OBSERVABILITY | Agents and local stores, feeding the fleet's Grafana | [observability-grafana](../specs/observability-grafana.md) |

## Stores and namespaces

Counted so they cannot drift (FS-1032; the review of
[27 October](../reviews/architecture-2026-10-27.md)). **The clusters and
namespaces are proposed, for the owner to decide (FS-1036).**

**Databases: 16 in an instance** (15 without deposits, as R1), each its
own, reached only by its component's role. **Proposed: five PostgreSQL
clusters,** by tier, each a primary and a synchronous standby:

| Cluster | Its databases | Why apart |
|---|---|---|
| Ledger | Fineract | The ledger; its database is Fineract's alone (kapu-core-fineract) |
| Access | Keycloak | Restricted as a whole (access-keycloak) |
| Back office | Odoo | Large, and upgraded on its own cadence (back-office §9.4) |
| Secrets | OpenBao | First up on failover; nothing else waits on it |
| Services | Lending, deposits, approvals, lender rules, rails, recon, companion, messaging, identity and the vault, end-of-day, back-office gateway, Flowza | A database and a role each; their outboxes with them |

Without a database: the core adapter, the Kapu Console (sessions only),
customer pages, the shadow ledger (in memory), the staff workspace (in
Odoo). Other stores: the event bus, and object storage.

**Namespaces: proposed, a cluster per institution in production, and ten
namespaces in it,** the four zones (deployment §1) and the platform's
own. Site B the same, at zero.

| Namespace | What runs there |
|---|---|
| edge | The web application firewall and API gateway |
| services | Our services, Kapu Core, access, Odoo, Flowza |
| data | The PostgreSQL clusters, the event bus, OpenBao, object storage's gateway |
| bastion | The bastion through which people reach anything inside |
| flux-system | GitOps |
| cnpg-system | The PostgreSQL operator |
| kafka-system | The event bus's operator |
| cert-manager | Certificates |
| spire | Workload identity |
| observability | Agents and local stores, feeding the fleet's Grafana |

A component added to an instance is added to the table of boxes above,
with its database and namespace; every deployment's register follows
(deployments, FS-1037).

**Environments.** One code base, the same signed images, promoted through:

| Environment | What it is for | Data |
|---|---|---|
| Development | Each engineer's own, with the simulators (rails RL-17, identity ID-20) | Synthetic only |
| Test | Shared; every acceptance test and the checks before the build (Fineract F1 to F13, Keycloak K1 to K15, Grafana G1 to G8) | Synthetic only |
| Staging | Each release, configured as production is, before it reaches an institution | Synthetic only |
| Production | One per institution | Real |

**Production data never leaves production:** no copy, sample or
anonymised extract goes to another environment. A defect is reproduced
with synthetic data.
