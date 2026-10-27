---
id: runbook-restore-from-backup
name: Restore from backup — a database or the vault, to a point in time
kind: manual
status: draft
law: LR-17
released: unreleased
owner: Solution architect
classification: Internal
review_ids: [FS-1037]
last_reviewed: 2026-10-27
---

# Restore from backup

The steps for deployment §4's "Unlocking a backup", and a restore after
it.

## 1 · When to use it

Data lost or corrupted that replication cannot fix (it copied the damage
too); ransomware (SE-25); the quarterly restore test (SE-10); a drill.
**Not** for a site's loss: that is [site failover](site-failover.md).

## 2 · Before you start

- **A reason, as a ticket:** the incident, the test or the drill.
- **The request:** the institution, the backup, the point in time, why.
- **Two approvers,** other than the initiator: for an incident, the CTIO
  or deputy, and the institution's named contact if its live data will
  be replaced; for a test or drill, Dibon's approval, the institution
  told.
- **Three key holders** of the five, none of them the initiator, with
  their hardware keys (deployment §4).

## 3 · Steps

| # | Step | Who |
|---|---|---|
| 1 | **Build a clean environment from code** (SE-23); never production | On-call engineer |
| 2 | **Start the recovery vault there,** sealed | On-call engineer |
| 3 | **Three holders each decrypt and enter their share:** in person for a test or drill; through the bastion on a recorded call in an incident | Key holders |
| 4 | **The vault unwraps that one backup's key,** and nothing else | The vault |
| 5 | **Restore the database to the point in time** from its base backup and log archive; the vault's files from object storage's versions | On-call engineer |
| 6 | **Check it** (§4) | On-call engineer; the institution's accountant |
| 7 | **Promote or destroy:** promoted to live in an incident, through change enablement's emergency route; destroyed after a test or drill | Incident manager, or on-call engineer |
| 8 | **Seal the vault and switch it off;** record who held shares and when | On-call engineer |

## 4 · Check it worked

- The backup's hash matches the one in the audit chain (recon RO-24).
- The trial balance balances; Fineract's last closed date is as expected.
- Reconciliation against the rails' own records, from the restore point
  to now, shows every difference as an exception with an owner.
- For a test: the time from request to a checked restore, recorded in §6.

## 5 · If it goes wrong

- **Fewer than three holders reachable:** the outside holder under the
  custody agreement is the fifth; never fewer than three shares.
- **A hash does not match:** stop; that backup is not used. Take the one
  before it and record why.
- **The trial balance does not balance:** do not promote; restore an
  earlier point and compare.

## 6 · Rehearsals

Every quarter, for each production deployment (SE-10).

| Date | Deployment | Who | How long | What we changed |
|---|---|---|---|---|

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
