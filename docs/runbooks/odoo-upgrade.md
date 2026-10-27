---
id: runbook-odoo-upgrade
name: Upgrading Odoo — one major version, in an institution's instance
kind: manual
status: draft
law: LR-17
released: unreleased
owner: Solution architect
classification: Internal
review_ids: [FS-1037]
last_reviewed: 2026-10-27
---

# Upgrading Odoo

The steps for back-office §10's rules for an upgrade, for Odoo
Enterprise inside an institution's instance.

## 1 · When to use it

Once a year, a major version, within the versions Odoo supports; one
version at a time unless Odoo's own service skips safely (back-office
§10, rule 6). **Not** for a minor update, which goes through change
enablement as any change does.

## 2 · Before you start

- **Ready to move** (rule 4): our modules ported, and every OCA module we
  depend on (auth_oidc first) released for the target version.
- **A change, approved** through change enablement, in an agreed window,
  the institution told.
- **The new edition's adapter** for the back-office gateway built and
  passing the contract suite (back-office §11).

## 3 · Steps

| # | Step | Who |
|---|---|---|
| 1 | **Copy production to staging** | Back-office engineer |
| 2 | **Upgrade the copy** through Odoo's upgrade service, which carries Sign, Helpdesk and Documents (rule 3) | Back-office engineer |
| 3 | **Re-apply the configuration** from our module's data files, and check it (rule 5) | Back-office engineer |
| 4 | **Run three checks on the copy:** the contract suite, our modules' tests, and a staff check by the institution | Back-office engineer; the institution's staff |
| 5 | **In the window, upgrade production** the same way; the old and new editions side by side until cut-over (rule 1) | Back-office engineer |
| 6 | **Switch the instance's edition setting** to the new version | Back-office engineer |
| 7 | **Record how long it took** and how many customisations we carry (rule 7) | Back-office engineer |

## 4 · Check it worked

- Sign, Helpdesk and Documents work; the contract suite passes; counts
  reconcile (back-office A10).
- Staff sign in through Keycloak as before.
- The gateway's queue drains: what waited during the window is
  delivered, in order.

## 5 · If it goes wrong

- **A check fails on the copy:** production is not touched; the upgrade
  waits for a fix.
- **Production fails after the switch:** switch the edition setting back;
  the old edition still runs until cut-over is confirmed.

## 6 · Rehearsals

The copy in step 1 to 4 is itself the rehearsal, each time.

| Date | Deployment | Who | How long | What we changed |
|---|---|---|---|---|

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
