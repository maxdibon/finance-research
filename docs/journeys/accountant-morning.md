---
id: jn-17-accountant-morning
name: JN-17 · The accountant's morning, from the night's report to a day signed off
kind: journey
release: R1
status: draft
validated_with: not yet
owner: Solution architect
classification: Internal
review_ids: [FS-548, FS-633, FS-634, FS-668, FS-765, FS-766, FS-767, FS-778]
last_reviewed: 2026-10-12
---

# JN-17 · The accountant's morning, from the night's report to a day signed off

Each night the end-of-day runner checks the day, closes it in Kapu Core,
runs the lender rules and reconciles (end-of-day-runner §3). **The
matching is not the accountant's work:** every M-Pesa repayment is posted
and matched to its loan as it lands, a payment whose confirmation never
arrived is found and posted automatically, and every bank statement line
is matched to its instruction, all day and overnight. At 06:00 the
morning report tells the accountant how much matched by itself and what
did not. This journey is what they do with the remainder: confirm the
night closed, settle the few items the rules could not, release a held
close, and sign the day off, so that every shilling the ledger shows is
matched to M-Pesa or the bank, and every one that is not is owned by
someone with a date.

## 1 · Who and where

- **Who:** Roan Capital's accountant, who owns the morning; its finance
  lead, who approves corrections and, with our on-call engineer,
  overrides a held close; its finance officer, for disbursements; Dibon's
  operations and on-call engineer, for anything the platform did.
- **Channel:** the morning report by email; the back office (Kapu MFI's
  exception queue, reconciliation and reports), signed in with single
  sign-on and two authenticators; the morning's ticket in Odoo Helpdesk.
- **Starts when:** the morning report arrives at 06:00, or fails to.
- **Ends when:** the night's close is confirmed; every exception and
  break is matched, placed, or owned with a due date; the morning's
  ticket is closed with the accountant's note, which is the sign-off.
- **Target:** at least 98% of the day's transactions matched
  automatically, published each cycle (owner, FS-767); every exception owned
  by 10:00 and the morning signed off by 12:00 (owner, FS-778); a held close released before the institution's
  working day starts, or overridden by two people.
- **Moments that matter:** the report's first line, which must say
  plainly whether the night closed and how much matched by itself; a held close, where the accountant
  needs to know that payments are still landing and no borrower is
  charged wrongly; the figures agreeing (ledger, M-Pesa, bank), which is
  what lets them sign.
- **Data:** payments, loans and their exceptions, seen in the back office
  with fields masked by role; the report's email carries counts, amounts
  and references, never a name or a phone number (privacy PR-02, PR-03).

## 2 · Steps

```
  1 06:00: the morning report arrives; the morning's ticket opens
        |-- the close was held ....................... released or overridden (3a)
        |-- the close failed, or ran past 03:00 ...... an incident, in hand (3b)
        |-- no report by 06:15 ....................... silence is an alert (3c)
        v
  2 The accountant signs in and opens the exception queue
        v
  3 Loans the close could not process: each traced and fixed
        v
  4 Matched automatically; the accountant settles only what the rules
    could not
        |-- yesterday's bank statement not in by 09:00  a reminder (3j)
        |-- a payment posted twice ................... reversed by two people (3d)
        |-- a break nobody can explain ............... nothing posted by hand (3e)
        v
  5 Unapplied money placed, or on its way back
        v
  6 Disbursements still pending, returned or not released
        v
  7 The checks' warnings, each to its owner
        v
  8 The trial balance and the day's totals
        v
  9 The portfolio and income reports for the day
        v
 10 Signed off: the ticket closed, open items owned and dated
        :
    The accountant away .............................. the deputy (3f)
    Month end ........................................ open items carried, listed (3g)
    The platform down ................................ M-Pesa and bank records first (3h)
    Stops partway .................................... escalated at noon (3i)
```

| # | Step | Who | Messages | Capabilities |
|---|---|---|---|---|
| 1 | At 06:00 the morning report reaches the accountant and our operations by email: closed, held or failed; the share of the day's transactions matched automatically, by channel; each check's result; the time of each step; loans closed and locked; any hold or override; reconciliation breaks and unapplied money, as counts and amounts. The morning's ticket opens in the helpdesk with the same summary and links into the back office | Platform | — | KC-07, RO-04, RO-17, BS-01 |
| 2 | The accountant signs in and opens the exception queue, which holds only what automatic matching could not settle, ordered by the time left on each item's SLA, not by amount, each with its owner and age; fields they need not see are masked | Accountant | — | AC-02, AC-16, RO-05, MF-12, RO-19 |
| 3 | Each loan the close could not process is listed with its ticket. Our operations find the cause; once fixed, the loan closes in the next run or the catch-up, with every accrual dated as it should have been | Accountant; Dibon operations | — | MF-12, KC-07, KC-04 |
| 4 | Matching has already run without the accountant: each M-Pesa repayment posted as it landed and matched to its loan by its reference or paying phone; a repayment whose confirmation never arrived found by Pull Transactions and posted with its own M-Pesa date, its receipt sent; an M-Pesa payment still pending chased by its status query until it clears; each bank statement line matched to its instruction, the statement in R1 being NCBA's email forwarded whole to Roan Capital's statement address, or uploaded, and checked before any line is matched; a cut-off difference held in transit until the day it should clear. The accountant sees only what the rules could not settle, each by its outcome: a suggested match to approve, a variance outside tolerance, an item unmatched on our side or the counterparty's, a duplicate | Platform; accountant | T06 | RO-01, RO-02, RO-04, RO-07, RL-20, RL-07, MF-10, MF-22, KC-09 |
| 5 | Payments that could not be placed are worked through the unplaced-payment path (JN-16): those the payer has answered are placed today; the rest follow its reminders, calls and day-7 return | Accountant | — | CO-21, MF-10 |
| 6 | Disbursements: one with no answer from the rail or bank is pending, never failed, until a status query or the statement settles it, and never resent blind; a return is matched and reversed (JN-13); a bank file not released by the cut-off is chased with the signatories. A borrower whose money is late is told when they will hear next | Accountant; finance officer | T35 | RL-10, RL-14, RL-01, MF-11 |
| 7 | The warning checks go to their owners: intraday breaks not yet acknowledged, to the accountant; holidays missing from the calendar, to the finance lead to add under maker-checker; a half-applied product change or low disk space, to our operations | Accountant; finance lead; Dibon operations | — | KC-07, KC-15, KC-08 |
| 8 | The trial balance balanced at the close (the runner checked it); the accountant compares the day's totals by component (principal, interest, fees, default interest) with the cash that moved | Accountant | — | KC-05, MF-15 |
| 9 | The portfolio dashboard and reports are current from last night's snapshots: arrears buckets, PAR30, income by component, loans that moved on the collection ladder | Accountant | — | MF-14, MF-15, MF-39 |
| 10 | The accountant closes the morning's ticket with a note: what was resolved, and every open item with its owner and due date. The sign-off, and every action of the morning, is in the audit trail | Accountant | — | BS-01, RO-05, RO-27 |

## 3 · When it goes wrong

| # | At step | What happens | Capabilities |
|---|---|---|---|
| a | 1 | **The close was held.** A blocking check failed at 23:45, for example the day's M-Pesa intake incomplete or unapplied money above the tolerance; the accountant and our on-call engineer were told then. The business date moved at midnight, so payments kept landing; only the close waits. The cause is fixed (a repayment posted, a service restored), the runner checks again and releases the close, which catches up day by day. Where a check cannot pass and closing is the safer course, the finance lead and the on-call engineer override it together, each re-authenticated, each giving a reason; a check a regulation drives cannot be overridden. The day's ladder moves and reminders go out after the close, within working hours | KC-07, AC-05, RO-18, RO-24, MS-15 |
| b | 1 | **The close failed, or ran past 03:00.** The on-call engineer was phoned (severity 1). By the morning it is fixed, and the report says so with the times; or it is an incident in hand, and our operations tell the accountant its status at the start of the day and as it changes | RO-18, KC-07 |
| c | 1 | **No report by 06:15.** The runner's heartbeat going quiet has already alerted our on-call; the accountant raises a ticket rather than waiting, and works from the exception queue meanwhile | RO-17, BS-01 |
| d | 4 | **A repayment was posted twice,** or a payment matched to the wrong loan. The wrong posting is reversed by a correcting entry dated as the original, never edited, approved by two people, neither the one who proposed it; the borrower is not charged for the difference | KC-04, MD-01, MD-06 |
| e | 4, 8 | **A break nobody can explain,** or totals that do not agree with the cash. Nothing is posted by hand to make it agree. Our operations trace the payment's signed journey; anything that looks like fraud goes to the compliance officer in the helpdesk's restricted team | RO-25, RO-23, BS-01 |
| f | 1 | **The accountant is away.** The report also goes to the deputy Roan Capital names, who works the morning the same way; items keep their owners and SLAs, and an item past its SLA escalates to the finance lead | RO-05, BS-01 |
| g | 10 | **The last morning of the month.** Items still open are listed as reconciling items in the month's figures, each with its amount and the day it should clear, so the month closes with every difference explained | RO-04, MF-15 |
| h | 1 to 9 | **The platform is down** (JN-19). Payments still land at the paybill and the bank; the accountant keeps M-Pesa's and the bank's records; when the platform returns, missed days close in order and Pull Transactions finds every payment, matched through these same steps | RL-20, KC-07 |
| i | 2 to 10 | **The accountant stops partway.** The morning's ticket stays open with what was done; at 12:00 items past their SLA escalate to the finance lead; anything still open appears in the next morning's report with its age | RO-05, BS-01 |
| j | 4 | **Yesterday's bank statement is not in by 09:00,** or fails its checks. The accountant is reminded; they forward the bank's email again, or download the statement from internet banking and upload it. A file that fails is rejected with the reason (another account, a gap or overlap in dates, lines that do not sum, already loaded), and the right one is asked of the bank. The bank's items stay in transit meanwhile, never guessed | RO-01, RO-05 |

## 4 · Gaps

| Gap | Release or phase today | In its absence | Proposed |
|---|---|---|---|
| BS-08, the core's daily totals posted to Odoo's general ledger | phase 2 | The accountant takes the day's totals from Kapu Core's reports into Roan Capital's books by hand, or its books stay where they are | Ask Roan Capital where its books are kept (§5) before deciding |
| NCBA's statement and status by API (RL-07; FS-344) | Open: Roan Capital's request to the bank | Its statement email forwarded whole, or uploaded, and checked (RO-01); bank items settle a day behind M-Pesa's | Accept for R1 (FS-767) |
| RO-08, suspense holding exactly the open breaks | phase 1, not in R1 | A suspense account reconciled by hand each morning (as JN-16) | Accept for R1 |
| RO-09, the disbursement account's balance against payouts queued | phase 1, not in R1 | The finance officer checks the bank balance before releasing a file; the balance API is among our requests to the banks | Accept for R1 |
| RO-11, duplicate and anomaly detection | phase 1, not in R1 | The matching engine's duplicate outcome, and the accountant's eye | Accept for R1 |

## 5 · Open questions

- **For Roan Capital** (the operations conversation, OB-KC-04): who
  receives the morning report besides the accountant, and who deputises;
  the accountant's working hours; the tolerance for unapplied money; and
  where its books are kept today (Odoo, another package, spreadsheets),
  which decides BS-08 (delivery map, open answer 24).
- **For NCBA and Access Bank:** when each day's statement is available,
  which decides how much of step 4 the morning can settle (outreach,
  the account requests).
