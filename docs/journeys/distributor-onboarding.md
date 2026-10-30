---
id: jn-21-distributor-onboarding
name: JN-21 · A distributor onboarded for retailer financing
kind: journey
release: phase 2
status: draft
released: unreleased
validated_with: not yet
owner: Solution architect
classification: Internal
review_ids: [FS-989, FS-995, FS-996, FS-1000, FS-1004, FS-1058]
last_reviewed: 2026-10-30
---

# JN-21 · A distributor onboarded for retailer financing

## 1 · Who and where

- **Who:** the institution's partner manager, who proposes the
  distributor and runs its onboarding; its compliance officer, for due
  diligence; two approvers; the distributor's own staff and sales
  representatives; its retailers, who consent and borrow; the risk team,
  which sets limits.
- **Channel:** the staff workspace's Partners screen and Odoo, signed in
  through the `staff` realm; Odoo Sign for the agreements; the partner
  portal in Odoo for the distributor; USSD or the app for its retailers.
- **Starts when:** the partner manager proposes a distributor.
- **Ends when:** the distributor is live, its first retailers have
  consented and hold limits, and its system hears of each draw.
- **Target:** ten working days from proposal to live, most of it the
  distributor's own documents; a retailer's limit within a working day of
  its consent and data.
- **Moments that matter:** the distributor's first payment for a
  retailer's draw, which shows it the model works; a retailer's consent,
  which is the only way its purchases are used; a freeze, which must be
  immediate when fraud is suspected.
- **Data:** the distributor's company records, directors and owners
  (privacy PR-01, PR-05); each retailer's purchases from it, with consent
  (PR-21), and the limits made from them (PR-18).

## 2 · Steps

```
  1 The partner manager proposes the distributor
        v
  2 Due diligence: registry, tax PIN, owners, sanctions
        |-- a sanctions match or a registry mismatch ...... stopped (3a)
        v
  3 The partner agreement and the data-sharing agreement signed
        v
  4 Its settlement accounts verified by name
        |-- the name does not match ...................... not payable (3b)
        v
  5 The feed contract agreed, and a test feed passed
        |-- the test feed breaks the contract ............ quarantined (3c)
        v
  6 Two approvers approve; the distributor is live
        v
  7 Its staff and sales representatives given the partner portal
        v
  8 Its retailers consent, their purchases arrive, limits are set
        |-- a retailer does not consent .................. its rows held (3d)
        v
  9 A retailer draws; the distributor is paid and told
        |-- purchases inflated before a renewal .......... frozen (3e)
    Live, monitored
    The partner manager stops partway ................... kept, then lapses (3f)
```

| # | Step | Who | Messages | Capabilities |
|---|---|---|---|---|
| 1 | The partner manager proposes the distributor in the Partners screen; its company record is made in Odoo | Partner manager | — | MF-41, BS-01 |
| 2 | Compliance checks it: the business registry, the tax PIN, the directors and beneficial owners, sanctions; the documents a company account needs | Compliance officer | — | ID-07, FC-05, MF-41 |
| 3 | The partner agreement (accurate data, returns refunded to the loan, first loss, fraud) and the data-sharing agreement are signed in Odoo Sign | Partner manager, the distributor | — | BS-02, MF-41 |
| 4 | Each settlement account's name is checked before it may be paid | Partner manager | — | RL-01, MF-41 |
| 5 | The feed contract is agreed (fields, format, frequency) and a test feed passes its checks | Partner manager, the distributor | — | MF-42, RO-01 |
| 6 | Two approvers approve the distributor, its exposure cap and first-loss share; it goes live | Approvers | — | MD-01, MF-41 |
| 7 | Its staff and sales representatives get the partner portal; its system's address for events is registered and tested | Partner manager | — | BS-03, MF-41 |
| 8 | Each retailer consents, to this distributor apart, by USSD or the app; its purchases arrive through the intake; the risk team sets each relationship's limit | Retailers, risk team | — | MF-42, DE-01, MF-41 |
| 9 | A retailer draws against an invoice; the distributor is paid, and its system is told, signed | Retailer, the distributor | — | MF-40, MF-41 |

## 3 · When it goes wrong

| # | At step | What happens | Capabilities |
|---|---|---|---|
| a | 2 | A sanctions match or a registry mismatch stops onboarding; compliance decides, and a match is reported as the law requires | FC-05, ID-07 |
| b | 4 | An account whose name does not match is not payable; the distributor gives another, checked again | RL-01, MF-41 |
| c | 5 | A test feed that breaks its contract is quarantined; the distributor is told what failed, and resends | MF-42 |
| d | 8 | A retailer who has not consented: its rows are held and never used; the distributor is told | MF-42 |
| e | 9 | Purchases jump before a limit renews, or draws do not match what recon sees paid: the relationship, or the distributor, is frozen and the risk team reviews | MF-41, MF-42 |
| f | 1 | **The partner manager stops partway.** The proposal and its documents are kept 30 days, resumed from the step reached, then lapse | MF-41 |

## 4 · Gaps

| Gap | Release or phase today | In its absence | Proposed |
|---|---|---|---|
| MF-41 and MF-42, the partners and their feeds | phase 2 | A distributor's data by hand, as a spreadsheet the risk team reads | With MF-40, when the first supplier-financing customer signs |
| The partner portal's screens | Not drawn | The distributor emails its files | Drawn before MF-41 is built (FS-237) |

## 5 · Open questions

1. How long may a distributor's raw files be kept: the data-sharing
   agreement's term, at most 90 days (privacy PR-21)? Answered: a retailer
   consents to each distributor apart, unless the institution sets
   otherwise as lending-partners §4 allows (FS-1004).
