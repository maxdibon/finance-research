---
id: deployment-roan-capital-production-openbao
name: Roan Capital, production — OpenBao's settings
kind: guide
status: living
law: LR-17
released: unreleased
owner: Security lead
classification: Internal
review_ids: [FS-1050]
last_reviewed: 2026-10-29
---

# Roan Capital, production · OpenBao's settings

## 1 · This deployment

**OPENBAO** in [Roan Capital's production](../roan-capital-production.md),
following the baseline [settings/openbao](../../settings/openbao.md) of
29 October 2026. Every setting is the baseline's: OpenBao has no setting
of a deployment's own. How each site unseals is still to decide for every
deployment (baseline S04, FS-1038); site B's unseal key is to be held at
site B before go-live (deployment §2).

## 2 · Its choices

| Id | Setting | This deployment | Decided by | Source | Status |
|---|---|---|---|---|---|

## 3 · Departures from a default

None: keys rotated every 90 days (S15).

## 4 · Exceptions to a mandatory setting

None.

## 5 · Checked

Not yet. Before go-live: the unseal and failover runbooks rehearsed at
both sites; from go-live, the nightly read-back (baseline §4).

## 6 · Changes

| Date | What changed | Row |
|---|---|---|
| 2026-10-29 | The file written from the baseline | FS-1050 |

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
