---
id: runbook-rail-credentials
name: Rotating a rail's credentials — M-Pesa and banks
kind: manual
status: draft
law: LR-17
released: unreleased
owner: Solution architect
classification: Internal
review_ids: [FS-1037]
last_reviewed: 2026-10-27
---

# Rotating a rail's credentials

A rail's credentials (for M-Pesa, Daraja's keys and the initiator's
password; for a bank, its API keys or certificates) live in OpenBao
only, never in a file, a message or a laptop (rules, Dibon 2). The rails
spec, still to write, sets each rail's schedule.

## 1 · When to use it

On the rail's schedule; when someone who could see them leaves, on the
institution's side or ours; when they may have been exposed; when the
rail's owner asks.

## 2 · Before you start

- **A ticket and a second person** (platform-security, "Mandates").
- **The institution's rail owner** at hand: the credentials are issued
  by its own portal or bank, to its own account; Dibon never holds the
  institution's sign-in to them.
- **A quiet moment:** not during the close, and payouts paused for the
  minutes it takes if the rail cannot hold two credentials at once.

## 3 · Steps

| # | Step | Who |
|---|---|---|
| 1 | **The institution issues the new credential** in its rail's portal, or the bank does | The institution's rail owner |
| 2 | **It is entered into OpenBao,** by the rail owner through the institution's own path, or by us from a one-time link, never pasted in a message | The rail owner, or the on-call engineer |
| 3 | **The rails service picks it up** and a test call is made (a balance, or the rail's status call) | On-call engineer |
| 4 | **The old credential is revoked** at the rail | The institution's rail owner |
| 5 | **Recorded:** the rotation, by whom, and when, in the access register (SE-26) | On-call engineer |

## 4 · Check it worked

- The test call succeeds with the new credential; the old one is refused.
- Callbacks still arrive and are matched (recon shows no gap).
- No payout was sent twice across the change.

## 5 · If it goes wrong

- **The test call fails:** keep the old credential until the new one
  works; payouts stay paused, collections still land in the paybill.
- **Exposure suspected:** revoke first, then rotate; an incident within
  the hour (rules, Dibon 7).

## 6 · Rehearsals

On staging, against the rail's sandbox, before each go-live.

| Date | Deployment | Who | How long | What we changed |
|---|---|---|---|---|

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
