---
id: deployment-roan-capital-production-edge
name: Roan Capital, production — the edge's settings
kind: guide
status: living
law: LR-17
released: unreleased
owner: Security lead
classification: Internal
review_ids: [FS-1050]
last_reviewed: 2026-10-29
---

# Roan Capital, production · the edge's settings

## 1 · This deployment

**EDGE** in [Roan Capital's production](../roan-capital-production.md),
following the baseline [settings/edge](../../settings/edge.md) of 29
October 2026. Every setting not listed here is the baseline's. R1 has no
partners' systems calling in, so the partners' listener carries no route
yet (baseline S05).

## 2 · Its choices

| Id | Setting | This deployment | Decided by | Source | Status |
|---|---|---|---|---|---|
| S13 | The limits | Per route, sized to Roan Capital's volumes | Dibon | Architecture review A7 | To decide: its volumes, to ask (question 4.3 of Roles, approvals and going live) |
| S19 | Upstream protection | Its hosting provider's flood protection | Dibon | SE-03 | To decide: the provider (FS-032, FS-775), to confirm with it |
| S20 | Host names | Roan Capital's own names for its staff's screens and its customers' pages | Roan Capital | Its domain | To decide |

## 3 · Departures from a default

None: the firewall at paranoia level 1 (S09); two replicas (S18).

## 4 · Exceptions to a mandatory setting

None.

## 5 · Checked

Not yet. Before go-live, on Roan Capital's staging: a known attack, a
callback from an address M-Pesa does not publish, an `ops` token and an
administration path tried from outside, each refused (baseline §4).

## 6 · Changes

| Date | What changed | Row |
|---|---|---|
| 2026-10-29 | The file written from the baseline | FS-1050 |

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
