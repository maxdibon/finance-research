---
id: settings-openbao
name: OpenBao — baseline settings for OPENBAO in every deployment
kind: guide
status: living
law: LR-17
released: unreleased
owner: Security lead
classification: Internal
review_ids: [FS-1050]
last_reviewed: 2026-10-29
---

# OpenBao · baseline settings

## 1 · What this covers

**OPENBAO:** every key and secret in an institution's instance: database
logins, rail and bank credentials, signing keys, the keys that encrypt
Restricted fields, certificates. How a service reaches a secret is
[flows §3](../architecture/flows.md). The recovery vault that opens
backups is a separate OpenBao, kept off and sealed (deployment §4), and
is not covered here. **Owner:** the security lead.

## 2 · Settings

| Id | Setting | Value | Class | Why | Enforced by | Checked by |
|---|---|---|---|---|---|---|
| S01 | Version | OpenBao, unmodified (MPL-2.0), the latest minor that passes our checks, the same across the fleet | Mandatory | One version; the licence rule (architecture README §6.1) | The image in git; Kyverno | Configuration record |
| S02 | One per instance | Three nodes, highly available, in the instance's data zone | Mandatory | Isolation per institution; a node's loss changes nothing | The instance's folder in git | Configuration record |
| S03 | Storage | PostgreSQL, the Secrets cluster | Mandatory | It crosses to site B with the databases; OpenBao has no replication between clusters (FS-693, FS-703) | Its configuration, from git | Configuration record |
| S04 | Unsealing | To decide (FS-1038): a key held at each site, as site B's is, or automatically from a hardware security module at the site | Mandatory | A restart must not wait on a person, nor put the key where an attacker finds it | Its configuration, from git | The unseal runbook's rehearsals |
| S05 | At site B | Started against the promoted database, unsealed with site B's own key, never the backup keys | Mandatory | Deployment §2, §4 | The failover runbook | Failover rehearsals |
| S06 | Root token | Revoked once set-up is done; made again only by break-glass, two people, recorded (proposed) | Mandatory | No standing all-powerful token | Set-up procedure | The access register |
| S07 | How services sign in | By their SPIFFE identity from SPIRE; no password, no static token | Mandatory | Nothing to steal from a file (flows §3; SE-05) | Its auth configuration, from git | Configuration record |
| S08 | How people sign in | No standing access: engineers through the `ops` realm, just in time against a ticket, and never to secrets' values | Mandatory | Rules, Dibon 3; engineers never see secrets (flows §3) | Its auth configuration, from git | The access register |
| S09 | Policies | One per service, its own paths only | Mandatory | Least privilege: one service's compromise reaches only its own secrets | Policies from git | Nightly read-back |
| S10 | Database logins | Made per service by the database engine, expiring within the hour | Mandatory | A stolen login expires (PostgreSQL S13) | Its engine's configuration, from git | Configuration record |
| S11 | Rail and bank credentials | Versioned, per institution; rotated as the rails spec sets, by the rotation runbook | Mandatory | RL-12; a rotation without a person reading the value | Its engine's configuration, from git | Rotation records |
| S12 | Signing | Signing keys used inside OpenBao, never exported; short-lived keys issued to each service for signing events | Mandatory | A signature cannot be forged from a copied key (recon §10) | The transit engine's configuration, from git | Configuration record |
| S13 | Field encryption | Restricted fields encrypted by the services with the transit engine before they reach a database | Mandatory | SE-27 | The transit engine's configuration | Configuration record |
| S14 | Certificates | Issued and renewed by its PKI engine with cert-manager | Mandatory | TLS everywhere (SE-09) | Its PKI configuration, from git | Expiry alerts at 30 days |
| S15 | Key rotation | Encryption and signing keys rotated every 90 days (proposed) | Default: every 90 days or more often | SE-08 | Its engines' configuration, from git | Nightly read-back |
| S16 | Audit | An audit device on; every request recorded, never a secret's value; shipped to Loki and write-once storage; requests refused if no audit record can be written | Mandatory | Every use of a secret traceable (flows §3) | Its configuration, from git | The audit alert; configuration record |
| S17 | Network and TLS | TLS on its listener; reachable only from the instance's workloads | Mandatory | SE-05, SE-09 | Cilium's policies; its configuration | Configuration record |
| S18 | Watch | Sealed state, leadership and audit failures alerted | Mandatory | A sealed OpenBao stops every service that needs a secret | Grafana's alert rules | The alert |

## 3 · How it is applied

The server from its resource in `platform`; its auth methods, policies
and engines as configuration from git, applied by a job after each
change, never by hand. Secrets' values never in git: each is entered at
its source (a rail's portal, a bank) and reaches OpenBao by the rotation
runbook.

## 4 · How it is checked

The configuration record and the nightly read-back of auth methods,
policies and engines against git; the alerts (S14, S16, S18); the unseal
and failover rehearsals (S04, S05).

## 5 · Changing this baseline

A normal change, approved by the operations lead and the security lead.

## 6 · Open questions

1. How each site unseals (FS-1038).
2. The rotation period for each kind of key, once the rails spec is
   written (S11, S15).

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
