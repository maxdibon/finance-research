---
id: deployment-roan-capital-production-postgresql
name: Roan Capital, production — PostgreSQL's settings
kind: guide
status: living
law: LR-17
released: unreleased
owner: Operations lead
classification: Internal
review_ids: [FS-1050]
last_reviewed: 2026-10-29
---

# Roan Capital, production · PostgreSQL's settings

## 1 · This deployment

**DATABASE** in [Roan Capital's production](../roan-capital-production.md),
following the baseline [settings/postgresql](../../settings/postgresql.md)
of 29 October 2026. Every setting not listed here is the baseline's.

## 2 · Its choices

| Id | Setting | This deployment | Decided by | Source | Status |
|---|---|---|---|---|---|
| S05 | Site B | A replica cluster at site B for each of the five clusters, streaming | Its contract: warm standby | RC-35; deployment §1 | Set; site B's provider to decide (FS-775) |
| S18 | Size | Each cluster's nodes, storage and resources | Dibon | Architecture review A7 | To decide: its volumes, to ask (question 4.3 of Roles, approvals and going live) |

## 3 · Departures from a default

None: base backups daily (S07).

## 4 · Exceptions to a mandatory setting

None.

## 5 · Checked

Not yet. Before go-live: a restore on staging and the failover rehearsed
once (deployment §2); from go-live, the configuration record each night
and a restore each quarter.

## 6 · Changes

| Date | What changed | Row |
|---|---|---|
| 2026-10-29 | The file written from the baseline and the deployment page's settings | FS-1050 |

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
