---
id: deployment-roan-capital-production-fineract
name: Roan Capital, production — Fineract's settings
kind: guide
status: living
law: LR-03
released: unreleased
owner: Solution architect
classification: Internal
review_ids: [FS-1050]
last_reviewed: 2026-10-29
---

# Roan Capital, production · Fineract's settings

## 1 · This deployment

**KAPU CORE** in [Roan Capital's production](../roan-capital-production.md),
following the baseline [settings/fineract](../../settings/fineract.md) of
29 October 2026. Every setting not listed here is the baseline's. Its
products are its own configuration: Biashara, Motor Vehicle and Title
Deed, each product version 1, proposed (docs/products).

## 2 · Its choices

| Id | Setting | This deployment | Decided by | Source | Status |
|---|---|---|---|---|---|
| S08 | A due date on a holiday | Moves to the next working day | Roan Capital | Its weekly update, 21 October (onboarding OB-COM-20) | Agreed |
| S21 | Chart of accounts | Roan Capital's own | Roan Capital | Onboarding OB-KC-02 | To decide: its chart, and where its books are kept today (open answer 24) |
| S22 | Working days and holidays | Roan Capital's working days; Kenya's public holidays | Roan Capital | The business calendar (KC-15) | To decide: its working days |

## 3 · Departures from a default

None. Its time zone is Africa/Nairobi (S04); no staff use Fineract's
screens (S18); savings are off, as Roan Capital takes no deposits (S26).

## 4 · Exceptions to a mandatory setting

None.

## 5 · Checked

Not yet. Before go-live: checks F1 to F15 on Roan Capital's staging, on
Fineract 1.15, with its products as adopted (kapu-core-fineract §12);
from go-live, the nightly read-back (baseline §4).

## 6 · Changes

| Date | What changed | Row |
|---|---|---|
| 2026-10-29 | The file written from the baseline and the deployment page's settings | FS-1050 |

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
