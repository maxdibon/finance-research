---
id: runbooks
name: Runbooks — the steps for what goes wrong, and for what we do rarely
kind: index
status: living
law: LR-17
released: unreleased
owner: Solution architect
classification: Internal
review_ids: [FS-1037, FS-1058]
last_reviewed: 2026-10-30
---

# Runbooks

FS-1037. **The steps a person follows** when something fails, or for work
done too rarely to remember: one runbook each, from
[the template](_template.md). The design says what should happen
(architecture deployment, the specs); a runbook says who does what, in
what order, how to tell it worked, and what to do when it did not.
Each deployment's continuity section names the runbooks it uses
([deployments](../deployments/README.md)).

| Runbook | When | Who | Status |
|---|---|---|---|
| [Site failover](site-failover.md) | Site A is lost, or will not be back within an hour | On-call engineer; incident manager | Draft |
| [Restore from backup](restore-from-backup.md) | Data is lost or corrupted, the quarterly restore test, a drill | On-call engineer; three key holders; two approvers | Draft |
| [Close of business](close-of-business.md) | The night's close is held, fails or overruns | On-call engineer; the institution's accountant | Draft |
| [OpenBao unseal](openbao-unseal.md) | An instance's OpenBao is sealed: a restart, a failover | On-call engineer | Draft |
| [Rotating a rail's credentials](rail-credentials.md) | On schedule, when someone leaves, or when they may be exposed | On-call engineer; the institution's rail owner | Draft |
| [Upgrading Odoo](odoo-upgrade.md) | A new major version, once a year | Back-office engineer; the institution's staff check | Draft |
| [Setting up GitHub](github-setup.md) | Once: the organisation created and this repository moved into it | The team lead and the CEO; each person | Draft |
| [An institution's fallback](institution-fallback.md) | An outage, from the institution's side; each institution adopts its own | The institution's staff; never Dibon (FS-588) | Draft, a template for each institution |

**Rules for runbooks:**

- **Rehearsed before they are needed:** each before the first go-live
  that relies on it, then as its §6 says; a rehearsal is recorded there.
- **No secrets, hosts or addresses** in a runbook; it names them by role,
  and the generated configuration record says where (deployments
  README).
- **After a real use,** the incident's review says what the runbook got
  wrong, and the runbook is changed in the same week.

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
