---
id: runbook-openbao-unseal
name: OpenBao unseal — bringing an instance's secrets back after a restart or failover
kind: manual
status: draft
law: LR-17
released: unreleased
owner: Solution architect
classification: Internal
review_ids: [FS-1037, FS-1038]
last_reviewed: 2026-10-27
---

# OpenBao unseal

An instance's OpenBao holds every key and secret its services use
(architecture README §6); while it is sealed, nothing that needs a secret
starts. This runbook is for an instance's own OpenBao, not the recovery
vault, which opens only with three key holders ([restore from
backup](restore-from-backup.md)).

## 1 · When to use it

OpenBao reports sealed: after its nodes restart, after an upgrade, or at
site B in a [failover](site-failover.md). **Not** when one node of three
restarts and rejoins on its own.

## 2 · Before you start

- **How each site's OpenBao unseals is still to decide** (FS-1038): a key
  held at the site, as deployment §2 says for site B, or unsealing
  automatically from a hardware security module at the site. Until it is
  decided this runbook assumes a key held at the site.
- **A ticket,** and a second person: unsealing is a key operation, and
  each needs one (platform-security, "Mandates").
- **Never the backup keys:** those are for the offline copy only
  (deployment §4).

## 3 · Steps

| # | Step | Who |
|---|---|---|
| 1 | **Confirm its storage is healthy:** its database is the writer at this site (after a failover, promoted) | On-call engineer |
| 2 | **Start OpenBao's three nodes** against it | On-call engineer |
| 3 | **Unseal with this site's key,** with the second person present, through the bastion | On-call engineer; a second engineer |
| 4 | **Let the services start:** each fetches its secrets as it comes up | On-call engineer |

## 4 · Check it worked

- OpenBao reports unsealed, three nodes, one leader.
- Each service has started and fetched its secrets; none is waiting.
- OpenBao's audit log shows the unseal, with who and when.

## 5 · If it goes wrong

- **The key is rejected:** stop. Check it is this site's key; never try
  others in turn. Escalate to the CTIO.
- **The storage is damaged:** restore OpenBao's database
  ([restore from backup](restore-from-backup.md)), then unseal.
- **Services still fail:** a secret may have expired while sealed; the
  rail's or service's own runbook rotates it
  ([rotating a rail's credentials](rail-credentials.md)).

## 6 · Rehearsals

With every failover rehearsal, and once at each site before go-live.

| Date | Deployment | Who | How long | What we changed |
|---|---|---|---|---|

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
