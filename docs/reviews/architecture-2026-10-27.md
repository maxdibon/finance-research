---
id: architecture-2026-10-27
name: The architecture, reviewed — 27 October 2026
kind: review
status: draft
released: unreleased
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-1032, FS-1036]
last_reviewed: 2026-10-27
---

# The architecture, reviewed · 27 October 2026

**What was reviewed:** the architecture's documents (README, instance,
deployment, flows, technology) and the specs' components table, after
the design around Fineract (FS-970 to FS-988), against two questions:
how many databases, and how many Kubernetes namespaces, does the design
have (FS-1032)? **Not reviewed:** code, a running instance, costs from a
provider, or a security test; the counts are a reading of the documents.

**The short answer:** the design says "one database per service, nothing
shared" and "its own namespace" per institution, and counts neither. By
this reading an institution's instance has **16 databases** (15 without
deposits, as in R1), on **five PostgreSQL clusters** proposed below, in
**about ten namespaces** on a cluster of its own, proposed below; Dibon
central adds **five databases** and **about eight namespaces**.

## 1 · Databases

| # | Database | Component | Kind | Proposed cluster |
|---|---|---|---|---|
| 1 | Fineract | KAPU CORE | The ledger | Ledger |
| 2 | Keycloak | ACCESS | Identities, sessions; Restricted as a whole | Access |
| 3 | Odoo | ODOO | The back office, the staff workspace's records | Back office |
| 4 | OpenBao | OPENBAO | Keys and secrets, its storage in PostgreSQL | Secrets |
| 5 | Lending | LENDING SERVICE | Applications, collateral, product versions, partners and limits | Services |
| 6 | Deposits | DEPOSITS SERVICE | Native mode only; its store not yet specified | Services |
| 7 | Approvals | APPROVAL ENGINE | Mandates, requests, decisions, append-only | Services |
| 8 | Lender rules | LENDER RULES | Rule versions and results, append-only | Services |
| 9 | Rails | RAILS | Instructions, confirmations, status | Services |
| 10 | Recon | RECONCILIATION | Matches, exceptions, append-only | Services |
| 11 | Companion | COMPANION LEDGER | What each account should hold, append-only | Services |
| 12 | Messaging | MESSAGING | Templates, the message log, the suppression list | Services |
| 13 | Identity and the vault | IDENTITY, VAULT | Checks and their evidence; the vault's index (its files in object storage) | Services |
| 14 | End-of-day | END-OF-DAY RUNNER | Each night's runs and checks | Services |
| 15 | Back-office gateway | BACK-OFFICE GATEWAY | Its outbox and delivery queue | Services |
| 16 | Flowza | FLOWZA | Conversations | Services |

**Without a database of their own:** the core adapter, the Kapu Console
(sessions only), customer pages, the shadow ledger (in memory), the
staff workspace (inside Odoo). **Other stores:** the event bus (Kafka)
and object storage (the vault's files, Odoo's filestore). **Every service
that publishes events** keeps its outbox in its own database, so each
service above is also a source of events.

**Dibon central:** engineers' Keycloak, GoAlert, Harbor, Grafana's stores
(Loki and Tempo in object storage) and the transparency log (Rekor).

## 2 · Namespaces and clusters

**Proposed:** each institution's production instance on **a Kubernetes
cluster of its own**, and inside it a namespace per zone and the
platform's own:

| Namespace | What runs there |
|---|---|
| edge | The web application firewall and API gateway (EDGE) |
| services | Our services, Kapu Core, access, Odoo, Flowza |
| data | The PostgreSQL clusters, the event bus, OpenBao |
| bastion | The bastion through which people reach anything inside |
| flux-system | GitOps (FLUX) |
| cnpg-system | The PostgreSQL operator |
| kafka-system | The event bus's operator |
| cert-manager | Certificates |
| spire | Workload identity (flows §3) |
| observability | Agents and local stores, feeding the fleet's Grafana |

Ten in all; site B the same, at zero. Dibon central's cluster: about
eight (its Keycloak, Grafana's stack, GoAlert, Harbor, Flux, the runners,
Rekor, cert-manager).

## 3 · Findings

| Id | Finding | Proposed |
|---|---|---|
| A1 | **Whether institutions share a cluster is not decided.** The README promises that "a compromise of one does not reach the rest", but says only "its own namespace and cluster workloads". Namespaces in a shared cluster share the control plane, the nodes and the kernel, so they do not keep that promise on their own | A cluster per institution in production; namespaces by zone inside it (§2). The cost: a control plane each, met by building every cluster from the same code. To decide: FS-1036 |
| A2 | **How many PostgreSQL clusters is not decided,** and the specs disagree: the approval engine's spec said "its own schema", everywhere else "its own database" | Five per instance, by tier: the ledger (Fineract alone, as its spec says), access (Keycloak, Restricted), the back office (Odoo, upgraded on its own cadence), secrets (OpenBao, first up on failover) and services (a database and a role each). Each with a primary and a synchronous standby. To decide: FS-1036. The approval engine's spec now says "database" |
| A3 | **The instance page was out of date:** reviewed on 10 October, it showed Kapu MFI but not the lending or deposits services, the core adapter, the back-office gateway, the Kapu Console, the staff workspace, the vault or customer pages; deployment's warm-standby diagram likewise | Corrected (§4) |
| A4 | **Neither databases nor namespaces were counted,** so they could drift as components were added | A "Stores and namespaces" section in the instance page, kept with the components table |
| A5 | **Three specs in R1's path are still "to write":** rails, the vault, customer pages | Written before their build is planned (specs README) |
| A6 | **The deposits service's store is not specified** | In deposits-service, with FS-185 (Fineract's deposit fit-gap) |
| A7 | **An instance's footprint is not sized.** A small lender's instance runs Fineract, Keycloak (two replicas), Odoo, three Kafka brokers, three OpenBao nodes, five PostgreSQL clusters of two and about a dozen services | A sizing table per instance size (small lender, Sacco, bank), before Liquid's quote (FS-032) |
| A8 | **Insights (Superset) has no place in an instance yet** | Placed with IN-04 in phase 2: in the instance, or the fleet with per-institution data only |

## 4 · Corrections made

- **architecture/instance.md:** the diagram and its table with every
  component in an instance today; a new section, "Stores and namespaces"
  (A3, A4).
- **architecture/deployment.md:** the warm-standby diagram's services
  (A3).
- **architecture/README.md §9:** tenancy points to the proposal and
  FS-1036 (A1).
- **specs/approval-engine.md §3:** "its own PostgreSQL database" (A2).

## 5 · Next

1. **The owner decides FS-1036:** a cluster per institution, and the
   five PostgreSQL clusters.
2. **A5 to A8** become rows as each is taken up.
