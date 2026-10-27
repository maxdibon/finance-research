---
id: jn-22-kyc-tier-up
name: JN-22 · A customer moves up a KYC tier
kind: journey
release: phase 2
status: draft
released: unreleased
validated_with: not yet
owner: Solution architect
classification: Internal
review_ids: [FS-1007, FS-1008]
last_reviewed: 2026-10-27
---

# JN-22 · A customer moves up a KYC tier

## 1 · Who and where

- **Who:** a customer at tier 1 who wants more: a higher limit, or a
  product tier 1 does not reach; a credit officer or branch staff who
  check evidence that cannot be checked by machine; compliance, for
  enhanced due diligence at tier 3.
- **Channel:** the app or the customer's own pages; USSD with an officer
  for a customer without a smartphone; a branch.
- **Starts when:** the customer asks for more than their tier allows, or
  the institution invites them to move up.
- **Ends when:** the customer is at the new tier, with its limits, and
  told; or told what is still missing.
- **Target:** tier 2 the same day when the photo check passes by machine;
  tier 3 within five working days.
- **Moments that matter:** the refusal that starts it, which must say
  what would change the answer and how; the photo check, which must not
  fail people for poor light or an old phone; the word that the tier has
  risen.
- **Data:** a selfie and the document's photo for tier 2, the KRA PIN;
  source of funds and enhanced due diligence for tier 3 (privacy PR-01,
  PR-05).

## 2 · Steps

```
  1 The customer asks for more than tier 1 allows
        v
  2 Told what the next tier needs, and why
        v
  3 The evidence given: a photo check and the KRA PIN
        |-- the photo check fails ................... another try, or a person (3a)
        v
  4 The evidence checked
        |-- a screening hit ......................... held for compliance (3b)
        v
  5 The tier rises; the new limits apply; the customer is told
    Tier 3: source of funds, enhanced due diligence  ...... compliance decides (3c)
    The customer stops partway ....................... kept, then lapses (3d)
```

| # | Step | Who | Messages | Capabilities |
|---|---|---|---|---|
| 1 | The customer asks for a loan or a product their tier does not reach; the refusal says the tier is the reason | Customer | — | ID-19, MF-01 |
| 2 | The customer is told what the next tier needs, in their language, and why it is asked | Customer | — | ID-24, OC-14 |
| 3 | The customer gives a selfie, the document's photo and the KRA PIN, in the app, or with an officer | Customer, credit officer | — | ID-04, ID-24 |
| 4 | The evidence is checked: the photo against the register, the PIN, screening; a person checks what a machine cannot | Credit officer | — | ID-01, ID-04, FC-05 |
| 5 | The tier rises from the evidence, never from the request; the new limits apply at once; the customer is told | Customer | — | ID-19, ID-24 |

## 3 · When it goes wrong

| # | At step | What happens | Capabilities |
|---|---|---|---|
| a | 3 | The photo check fails: another try with advice on light and framing; after two, a person checks by the manual route, flagged | ID-04, ID-24 |
| b | 4 | A screening hit holds the request for compliance; the customer is told only that it is being checked | FC-05 |
| c | 5 | **Tier 3:** source of funds and enhanced due diligence; compliance decides, and the customer is told the outcome | ID-19, FC-05 |
| d | 3 | **The customer stops partway.** The evidence given is kept 30 days, resumed from where they left, then lapses | ID-24 |

## 4 · Gaps

| Gap | Release or phase today | In its absence | Proposed |
|---|---|---|---|
| ID-24, moving up in the app | phase 2 | A branch visit with the documents | With the app (OC-01) |

## 5 · Open questions

1. Which tier 1 limits does each institution set, and what does it
   invite a customer to move up for?
