---
id: deployment-template
name: The institution, the environment — one deployment
kind: register
status: living
law: LR-17
released: unreleased
owner: Solution architect
classification: Internal
review_ids: [FS-1037, FS-1045, FS-1046]
last_reviewed: 2026-10-28
---

# The institution · the environment

<!--
How to use this template (FS-1037): copy it to deployments/the-deployment.md
and add its row to the register in deployments/README.md. Keep every
heading, in order. List every box of architecture instance in §2, with
"No" and why for any not deployed. Name things and people by role; no
hosts, addresses, endpoints or secret values. Write "To confirm" or "To
decide", with the row, rather than guess.
-->

## 1 · The deployment

| | |
|---|---|
| Institution | Its name and customer id |
| Environment | Production, staging, test, or a sandbox |
| Sites | Where each site is, and its provider |
| Who runs it | Dibon, or the institution (architecture README §9) |
| Availability | Cold, warm or hot standby (deployment §2), as the contract says |
| Release | What it runs |
| Go-live | The date, or what it waits on |

## 2 · Components

| Component | Deployed | Version | Namespace | Database (cluster) | Replicas | Spec or module |
|---|---|---|---|---|---|---|
| EDGE | Yes | As its spec | edge | — | 2 | platform-security |

### How the components interact

A series of diagrams below the table, each adding a layer to the one
before: for a full instance, the way in; a request decided; money
moving; events and checks; documents; the night; what it stands on.
Only what this deployment runs, named as in the table.

## 3 · Settings

What this deployment sets, component by component: the settings each
spec defines, and the values the institution decides. Never a secret,
a host or an address: those stay in the generated configuration record
inside the instance (service management §3). **Status:** *Set* (as the
spec says, the same everywhere), *Agreed* (the institution's choice,
with its source) or *To decide* (with its open question or row).

| Component | Setting | This deployment | Defined in | Decided by | Status |
|---|---|---|---|---|---|
| | | | | | |

## 4 · Diagrams

The instance's diagram (architecture instance) and anything this
deployment draws differently: its sites, its integrations, its own
network.

## 5 · Integrations

| Integration | What for | Whose agreement | Credentials | Status |
|---|---|---|---|---|
| | | | By OpenBao id, never the value | |

## 6 · Continuity

| | |
|---|---|
| Recovery objectives | By tier (platform-security §3), as the contract says |
| Backups | What, how often, kept how long; the offline copy (deployment §3) |
| Restore tested | When last, and the result |
| Failover tested | When last, with whom, and how long it took |
| Runbooks | The ones this deployment uses (runbooks) |
| The institution's fallback | Its own runbook for an outage, agreed at onboarding (OB-COM-23) |
| Who is called | By role, on each side |

## 7 · Access

Who may reach what, by role: Dibon's standing access, just-in-time
access by ticket, the institution's own staff and operators, the broker
link (architecture README §9).

## 8 · Data

The privacy register's rows that apply, where the data lives, what
leaves Kenya, the impact assessment's status.

## 9 · Licences and suppliers

| Licence or supplier | What for | Count or terms | Whose | Status |
|---|---|---|---|---|

## 10 · Size

What it is sized for (staff, borrowers, loans a month, messages a day),
and the size of each node pool and database.

## 11 · Exit

How the institution's data is returned and purged if it leaves, and what
support it has through the handover.

## 12 · Changes

| Date | What changed | Row |
|---|---|---|

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
