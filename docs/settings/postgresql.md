---
id: settings-postgresql
name: PostgreSQL — baseline settings for DATABASE in every deployment
kind: guide
status: living
law: LR-17
released: unreleased
owner: Operations lead
classification: Internal
review_ids: [FS-1050, FS-1051]
last_reviewed: 2026-10-29
---

# PostgreSQL · baseline settings

## 1 · What this covers

**DATABASE:** PostgreSQL, run by CloudNativePG, for every database in an
instance: Fineract's, Keycloak's, Odoo's, OpenBao's and each of our
services' (architecture instance, "Stores and namespaces"). How it
crosses to site B is [deployment §2](../architecture/deployment.md).
**Owner:** the operations lead, with the security lead for the controls
(S09 to S16).

## 2 · Settings

| Id | Setting | Value | Class | Why | Enforced by | Checked by |
|---|---|---|---|---|---|---|
| S01 | Engine | Community PostgreSQL, run by CloudNativePG; never MySQL or MariaDB | Mandatory | One engine; the licence rule (architecture README §6.1) | The operator's resources in git | Configuration record |
| S02 | Version | One PostgreSQL major across the fleet, the latest CloudNativePG supports that passes our tests; minors as released | Mandatory | One version to test and support | The image in git; Kyverno | Configuration record |
| S03 | Clusters | Five per instance, by tier: Ledger, Access, Back office, Secrets, Services (proposed, FS-1036) | Mandatory | A failure or a change in one tier leaves the others | The instance's folder in git | Configuration record |
| S04 | Within a site | Each cluster a primary and a synchronous standby on another node | Mandatory | A server's loss loses nothing | The operator's resources | Failover inside the site under 2 minutes |
| S05 | Site B | A replica cluster at site B streaming asynchronously; none under cold standby | Per deployment | Follows the availability model the contract takes (deployment §2) | The operator's resources | Replication lag, S16 |
| S06 | Archive | Every WAL segment archived continuously to write-once object storage at site B, at least every 5 minutes; point-in-time recovery to the minute | Mandatory | At most 5 minutes lost with a site; recovery to before an attack (SE-22) | Barman Cloud plugin, from git | Archive age under 5 minutes |
| S07 | Base backups | Daily, to object storage in Kenya and at site B, with an immutable copy (SE-10) | Default: daily or more often | The archive replays from them | Barman Cloud plugin, from git | Restore tests, S08 |
| S08 | Restores | Tested every quarter for each production deployment, against its recovery objectives | Mandatory | A backup never restored is a hope (SE-10) | The restore runbook | Its rehearsal record |
| S09 | Encryption at rest | Disks encrypted on every node; backups encrypted, their keys outside production (SE-21); Restricted fields encrypted by the service before they arrive (SE-27); the database itself encrypted, as SE-08 says, to decide (FS-1051) | Mandatory | Data on a stolen disk or backup unreadable | The nodes' storage; the backup plugin; our services | Configuration record |
| S10 | In transit | TLS on every connection, certificates from cert-manager and OpenBao's PKI; no plaintext connection accepted | Mandatory | SE-09 | The operator's resources | Configuration record |
| S11 | One database, one role | A database and a role per component, nothing shared; a component's role reaches only its own database | Mandatory | One component's compromise stays in its database | Roles from git | Nightly read-back |
| S12 | No superuser, no human login | CloudNativePG's superuser access off; no person logs in; break-glass only, two people, recorded | Mandatory | Whoever can log in can change a balance (FS-789) | The operator's resources | Nightly read-back; the access register |
| S13 | Service logins | Made by OpenBao for each service, expiring within the hour; no password in a file | Mandatory | A stolen login expires (flows §3) | OpenBao's database engine | Configuration record |
| S14 | Schema rights | Application roles without them; schema changes only through the pipeline's migrations | Mandatory | No change to a ledger's shape outside review | Roles from git | pgAudit, S15 |
| S15 | pgAudit | On every money database (Fineract's and the services that hold money's records: lending, deposits, approvals, rails, recon): every schema change and every write not made by the service's own role, shipped at once off the instance to write-once storage | Mandatory | A direct change is found, and its record survives the account that made it (FS-789, F14) | The operator's resources; the log shipper | F14 |
| S16 | Replication watch | Lag under 60 seconds; paged at 3 minutes | Mandatory | The 5-minute objective is never silently at risk (deployment §2) | Grafana's alert rules | The alert |
| S17 | Network | Reachable only from its component's workloads | Mandatory | SE-05 | Cilium's policies, from git | Configuration record |
| S18 | Size | Each cluster's nodes, storage and resources | Per deployment | Sized to the institution (architecture review A7) | The operator's resources | Grafana's capacity views |

## 3 · How it is applied

All by CloudNativePG from its resources in `platform`: each cluster, its
standby, its replica cluster, its backups and archive (the Barman Cloud
plugin), its roles and databases, its TLS. pgAudit's settings in the
cluster's PostgreSQL parameters. Nothing set by hand in a database.

## 4 · How it is checked

The configuration record, generated from the code and compared each night
with what runs; the replication and archive alerts (S06, S16); a restore
each quarter (S08); F14 for pgAudit on the ledger.

## 5 · Changing this baseline

A normal change, approved by the operations lead, and the security lead
for S09 to S17. A major version is a change of its own, rehearsed on a
copy of production first, as an upgrade of Odoo is (runbooks).

## 6 · Open questions

1. SE-08 says the databases use PostgreSQL's transparent data
   encryption; community PostgreSQL, as CloudNativePG runs it, has none.
   Choose: disk encryption with field encryption (SE-27) as the control,
   a PostgreSQL build that adds it, or a commercial one (FS-1051).
2. Database activity monitoring, beyond pgAudit (FS-790).
3. The five clusters, until FS-1036 is decided.

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
