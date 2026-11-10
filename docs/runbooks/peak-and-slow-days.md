---
id: runbook-peak-and-slow-days
name: Peak and slow days — preparing for a spike, and reading a lull
kind: manual
status: draft
law: LR-17
released: unreleased
owner: Solution architect
classification: Internal
review_ids: [FS-1161, FS-1162]
last_reviewed: 2026-11-10
---

# Peak and slow days

FS-1161, FS-1162. **What we do before, during and after a day far above
or far below the usual:** a month-end, a payday, a school-fee opening,
December, Black Friday for a merchant; or a public holiday, a Sunday,
January's first weeks. The design is in the rails spec (rules 14 and 15,
§10), financial crime's transaction rules (FC-16) and the business
calendar (core KC-15); this says what to do.

## 1 · When to use it

Two weeks before each peak day on an institution's calendar, and on the
day; and whenever traffic falls far below the usual for its type of day.
Not for an incident already declared: that is incident management's.

## 2 · Before you start

The operations lead decides and is told first; the institution's finance
role and its rail owner are told; on-call is named for the day. At hand:
the institution's calendar with its peak and slow days and their
multiples, last peak's review, each rail's agreed rate and contacts.

## 3 · Steps

| # | Step | Who |
|---|---|---|
| 1 | Check the day is on the institution's calendar as a peak day, with its expected multiple from history; add it, through the approval engine, if not | Operations lead |
| 2 | Load-test the instance at a margin above the expected peak, against the platform's targets (architecture quality); fix what fails before the day | Platform engineer |
| 3 | Schedule capacity to rise the day before and fall the day after; never wait for it to react | Platform engineer |
| 4 | Ask each rail, in writing, to raise its rate for the shortcode or account for the window, and record the answer as a rail setting (rails rule 15) | The institution's rail owner, with us |
| 5 | Ask finance to fund each paying account's float for the expected payouts, before the top-up level would be crossed (rails rule 14) | Operations lead, with the institution's finance role |
| 6 | Where a limit must rise for the window, raise it by an approved, effective-dated rail setting that reverts by itself after (rails rule 13); never by hand | Operations lead; two approvers |
| 7 | Confirm the change calendar holds no change for the peak day (service management, the change calendar) | Release lead |
| 8 | On the day: on-call staffed with a named lead; the rails, float and recon dashboards open; safe mode ready (platform-security SE-24) | On-call lead |
| 9 | Watch the queues against each rail's cut-off, and the float against its levels; tell the institution early | On-call lead |
| 10 | After: a short review, the day's real multiple recorded on the calendar for the next one, and anything that surprised us raised as a register row | Operations lead |

**A slow reading** (FS-1162). When traffic is far below the usual for its
type of day, ask in this order: is a rail or its callbacks failing (recon
pulls the rail's transactions); is a channel down; can customers pay at
all (the operator's status); are holds too strict, or approvals stuck;
and, for repayments below what the schedules expect, tell the
institution's credit lead: an early warning of arrears, not an incident.

## 4 · Check it worked

Before: the load test passed at the margin; each rail's answer recorded;
the float funded; the raised limits effective-dated, with their end. On
the day: no payout sent faster than its rail's rate; no false velocity
alert; no float below its low level unplanned. After: the review written
and the multiple updated.

## 5 · If it goes wrong

A rail refuses to raise its rate: the queue holds the rest in order, and
the institution tells its customers when payouts will go (rails rule 15).
The float runs low: finance tops up; at the floor, payouts wait and are
never rejected (rails rule 14). Capacity fails to rise: raise it by hand
and declare an incident. Anything that moves money wrongly: stop and
escalate to incident management at once.

## 6 · Rehearsals

| Date | Deployment | Who | How long | What we changed |
|---|---|---|---|---|

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
