---
id: runbook-close-of-business
name: Close of business — when the night's close is held, fails or overruns
kind: manual
status: draft
law: LR-03
released: unreleased
owner: Solution architect
classification: Internal
review_ids: [FS-1037]
last_reviewed: 2026-10-27
---

# Close of business

The steps when the end-of-day runner's close does not finish cleanly.
How the night runs, and which check is blocking, is the runner's spec
(end-of-day-runner §3 to §6).

## 1 · When to use it

The close is held at 23:45, still held at 03:00, fails, or overruns
03:00; or a post-check P1 to P6 fails (end-of-day-runner §5). **Not**
for a warning check at 21:00: that is a ticket for the morning.

## 2 · Before you start

- **The alert's severity** (end-of-day-runner §6): severity 1 is a phone
  call and an incident; severity 2 the on-call engineer and the
  accountant.
- **The institution's accountant reachable:** they decide whether to
  release a held close with a failing check, with a second person.
- **At hand:** the runner's report for the night; read-only access to
  Fineract's logs through the bastion, by ticket.

## 3 · Steps

| # | Step | Who |
|---|---|---|
| 1 | **Read the runner's report:** which check held it, or which step failed | On-call engineer |
| 2 | **A held close:** fix what the check found (a payment not posted, a rail not reconciled), or the accountant and a second person release it with a reason (the override) | On-call engineer; accountant |
| 3 | **A failed close:** see what Fineract could not close; a loan it could not close stays locked and ticketed (MF-12), and the rest go on | On-call engineer |
| 4 | **Re-run the close** from the runner, never from Fineract directly | On-call engineer |
| 5 | **After an outage of days:** let Fineract's catch-up close each missed day in order; the runner runs the lender rules for each day, then the post-checks | On-call engineer |
| 6 | **Tell the institution** what happened and what is still locked, in the morning report | On-call engineer |

## 4 · Check it worked

- Fineract's business date is today's; its oldest closed date the day
  just closed (P1, P2).
- Every active loan closed, or listed as locked with a ticket (P3, P4).
- The trial balance balances (P5); the lender rules ran after it.
- Fineract's outgoing events sent (P6).

## 5 · If it goes wrong

- **The trial balance does not balance:** the lender rules do not run;
  severity 1; the CTIO told. Nothing is adjusted by hand in the
  database (kapu-core-fineract: the database is Fineract's alone).
- **Still not closed by the start of business:** the institution is told
  before it opens; payouts stay held until the close is done.

## 6 · Rehearsals

Before each go-live, on staging: a held close, released; a failed close,
re-run; three missed days, caught up.

| Date | Deployment | Who | How long | What we changed |
|---|---|---|---|---|

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
