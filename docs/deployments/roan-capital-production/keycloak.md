---
id: deployment-roan-capital-production-keycloak
name: Roan Capital, production — Keycloak's settings
kind: guide
status: living
law: LR-17
released: unreleased
owner: Security lead
classification: Internal
review_ids: [FS-1050, FS-1055]
last_reviewed: 2026-10-30
---

# Roan Capital, production · Keycloak's settings

## 1 · This deployment

**ACCESS** in [Roan Capital's production](../roan-capital-production.md),
following the baseline [settings/keycloak](../../settings/keycloak.md) of
29 October 2026. Every setting not listed here is the baseline's.

## 2 · Its choices

| Id | Setting | This deployment | Decided by | Source | Status |
|---|---|---|---|---|---|
| S09 | Dibon's broker into `ops` | On, for platform tooling; data or production access only just in time, against a ticket | The model: Dibon runs the instance | Deployment §1; architecture README §9 | Set |
| S31 | Login theme | Roan Capital's logo and colours, in English and Swahili; the plain look until it gives them | Roan Capital | Design-system §6 | To decide: its brand files |
| S32 | Staff roles | The eight positions, folded for three or four staff; which roles each holds | Roan Capital | Customers/roan-capital §7; FS-982 | To decide: open answer 35, and question 1.1 of Roles, approvals and going live |
| S33 | The institution's administrators | Two, by role | Roan Capital | JN-18 | To decide: open answer 26, and question 1.2 |
| S34 | SMS sender | Roan Capital's sender ID, through our messaging service | Roan Capital | Its signed request of 9 October (DR-005, DR-006) | Agreed; whitelisting requested |

## 3 · Departures from a default

None. Replicas, password, session and engineer settings are the
baseline's (S03, S14, S15, S19, S21); Organisations stay off (S30).

## 4 · Exceptions to a mandatory setting

None.

## 5 · Checked

Not yet. Before go-live: checks K1 to K15 on Roan Capital's staging, on
Keycloak 26.8 (access-keycloak §12); from go-live, the nightly read-back
(baseline §4).

## 6 · Changes

| Date | What changed | Row |
|---|---|---|
| 2026-10-29 | The file written from the baseline and the deployment page's settings | FS-1050 |

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
