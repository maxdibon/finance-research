---
id: runbook-institution-fallback
name: An institution's fallback — working through an outage, from its side
kind: manual
status: draft
law: LR-03
released: unreleased
owner: Solution architect
classification: Internal
review_ids: [FS-1037, FS-1064, FS-1065]
last_reviewed: 2026-11-01
---

# An institution's fallback

**A template each institution adopts as its own** at onboarding
(OB-COM-23), its blanks filled by its own people; Dibon never operates
it (FS-588). What keeps working in an outage, and what comes back in
afterwards, is architecture README §3 and platform-security SE-24. Roan
Capital's is its open answer 27.

## 1 · When to use it

The platform is down or in safe mode for longer than the institution can
wait: Dibon declares it, or the institution's staff find they cannot
sign in, pay out or see balances.

## 2 · Before you start

- **Who decides to enter and leave the fallback:** [the role]; and their
  deputy.
- **Who may pay out by hand,** and up to what amount a day: [the role,
  the limit].
- **Dibon's incident line** and the incident's reference.

## 3 · Steps

| # | Step | Who |
|---|---|---|
| 1 | **Enter the fallback,** and tell the staff | [The deciding role] |
| 2 | **Collections:** nothing to do; M-Pesa still pays into the paybill (SE-24), and a confirmation the platform missed is found afterwards by Pull Transactions (RL-20) | — |
| 3 | **Urgent payouts only,** by the bank's own portal, within the limit, each written in the fallback log with the borrower, amount and reason | [The paying role] |
| 4 | **Approvals** follow the institution's documented manual procedure; each written in the log | [The approvers] |
| 5 | **Borrowers asking:** told of the delay by the agreed message; nothing promised about balances | [Customer-facing role] |
| 6 | **Leave the fallback** when Dibon reopens the service | [The deciding role] |
| 7 | **Hand payouts first:** every hand payout in the fallback log entered as a `manual.act` and matched to the rail's statement; until then the payouts that were waiting stay held, since a bank's statement can lag a payout made in its portal (proposed, FS-1065) | [The paying role]; Dibon's on-call engineer checks the matching |
| 8 | **Then the rest:** the waiting payouts released; every other manual act entered, approved afterwards by its approvers | [The approvers] |

## 4 · Check it worked

- Every line of the fallback log is in the platform, approved.
- Recon shows each hand payout matched once, and no queued payout sent
  again (FS-661).

## 5 · If it goes wrong

- **A payout made twice:** recovered from the borrower by the
  institution's own procedure; recorded as an incident.
- **The outage passes a day:** the institution's own business continuity
  plan takes over; its regulator told as its rules require.

## 6 · Rehearsals

Once at onboarding, then with each failover rehearsal (deployment §2).

| Date | Deployment | Who | How long | What we changed |
|---|---|---|---|---|

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
