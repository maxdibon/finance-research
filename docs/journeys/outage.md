---
id: jn-19-outage
name: JN-19 · An outage, from the first alert to everything brought back in
kind: journey
release: R1
status: draft
validated_with: not yet
owner: Solution architect
classification: Internal
review_ids: [FS-548, FS-651, FS-661, FS-668, FS-773]
last_reviewed: 2026-10-12
---

# JN-19 · An outage, from the first alert to everything brought back in

The platform stops for Roan Capital: a service fails, a site is lost, or
an attack forces it off. **If we stop, the money does not** (architecture
§3): borrowers keep paying Roan Capital's own paybill, and its own staff
can still pay out from its M-Pesa business portal and internet banking,
under its own two-person control. This journey is the outage from Roan
Capital's side: told quickly and plainly, working on its fallback
runbook, then every payment, payout, approval and complaint brought back
in, with nothing lost, nothing paid twice, and every balance right.
Dibon runs the recovery; Roan Capital runs its fallback, and Dibon never
operates it (FS-588).

## 1 · Who and where

- **Who:** Roan Capital's operations lead, who decides to enter and leave
  safe mode; its finance officer and signatories, for payouts by hand; its
  accountant, for bringing payments back in; its credit officers and
  complaints handler, for borrowers who call; its approvers. At Dibon:
  the on-call engineer, who leads; the CTIO for a severity 1 past an
  hour; customer experience, for the updates.
- **Channel:** phone and email from Dibon, on channels that do not depend
  on our own systems; Roan Capital's M-Pesa business portal and internet
  banking; its manual approval form and outage log; the back office again
  on recovery.
- **Starts when:** an alert shows the platform down for Roan Capital, or
  Roan Capital reports it.
- **Ends when:** the platform is back; every collection is posted with
  its own date; every payout and approval made by hand is entered and
  approved; queued payouts are released only after the statement shows
  they were not paid by hand; the institution confirms; the report is
  sent.
- **Target:** Roan Capital told within 30 minutes of the alert's
  acknowledgement, then every hour; for a site lost, back within 4 hours,
  with at most 5 minutes of data to recover from M-Pesa's and the bank's
  records (warm standby, deployment §1); every manual act entered within
  one working day of recovery (proposed).
- **Moments that matter:** the first call, which says what still works
  and what not to do; a borrower paying during the outage, who must find
  the payment counted, on its own date, without a penalty; coming back,
  when Roan Capital needs to see that nothing was paid twice and nothing
  is missing.
- **Data:** payments and payouts, caught up from the rails' records; the
  outage log and approval forms, which hold borrowers' details on paper
  until they are entered, then are filed as the institution's records
  (privacy PR-02, PR-03, PR-13).

## 2 · Steps

```
  1 The alert: severity 1, the on-call engineer paged
        |-- one part down, not all .................. its own fallback (3a)
        |-- M-Pesa itself down ...................... not ours; charges decided (3b)
        |-- an attack ............................... recovery from clean backups (3g)
        v
  2 Roan Capital told within 30 minutes: what works, what not to do
        |-- its contacts unreachable ................ the next named contact (3h)
        v
  3 Its operations lead enters safe mode and the fallback runbook
        v
  4 Borrowers keep paying the paybill; Safaricom confirms to them
        v
  5 Urgent payouts by hand, two people, written in the outage log
        v
  6 Urgent approvals on the manual form; calls and complaints logged
        v
  7 Updates every hour until money moves and balances are right
        v
  8 Restored, or failed over to the second site
        |-- the failover's loss window .............. pulled from the rails (3f)
        |-- the outage crossed midnight ............. missed days closed in order (3c)
        v
  9 Collections caught up and posted with their own dates
        |-- reminders now stale ..................... held until caught up (3e)
        v
 10 Manual payouts and approvals entered and approved
        |-- a payout both by hand and queued ........ the queued one never sent (3d)
        v
 11 Safe mode left; staff sign in again
        v
 12 Confirmed by Roan Capital; the report sent
        :
    Stops partway ................................. the incident stays open (3i)
```

| # | Step | Who | Messages | Capabilities |
|---|---|---|---|---|
| 1 | Health checks fail from the second site and from Dibon central; a severity 1 incident opens and the on-call engineer is phoned, then the next in the rota, then the CTIO | Platform; on-call engineer | — | RO-16, RO-17, RO-18 |
| 2 | Within 30 minutes of acknowledging, Dibon calls and emails Roan Capital's operations and incident contacts: what happened, whether money can move and balances are right, what to do and not do ("release no payouts from the platform until we confirm"), who leads, and when the next update comes. No personal data in the notice | Customer experience; incident lead | — | RO-18 |
| 3 | Roan Capital's operations lead decides to enter safe mode and opens its fallback runbook (handbook §7). Payouts on the platform are held; new ones queue | Operations lead; on-call engineer | — | SE-24, RL-10 |
| 4 | Borrowers keep paying Roan Capital's paybill from the M-Pesa menu; with our validation check down, M-Pesa completes the payment anyway, and Safaricom's own SMS confirms it to the payer. Every reminder already sent carries the paybill | Borrower | — | MF-10, MF-13 |
| 5 | A payout that cannot wait (a disbursement promised today) is made by hand from the M-Pesa business portal or internet banking, by two people under Roan Capital's own control, each written in the outage log with its amount, payee, reference and time | Finance officer; signatories | — | RL-14 |
| 6 | An approval that cannot wait is made on the manual approval form, signed by the approvers the chain would name. Calls, complaints and promises to pay are written in the outage log with the time received | Approvers; credit officers; complaints handler | — | MF-28 |
| 7 | Dibon updates Roan Capital every hour until money moves and balances are right, through the same channels | Customer experience | — | RO-18 |
| 8 | The service is restored, or under warm standby site A is fenced and the platform started at the second site; before reopening, smoke tests pass and anything in the loss window is checked against the rails | On-call engineer | — | SE-10, SE-22, RO-04 |
| 9 | M-Pesa's transactions for the outage are pulled and posted, each with its own M-Pesa date, so no borrower is charged for the days the platform was down; the bank's statement is loaded and matched; each borrower gets their receipt, within quiet hours | Platform; accountant | T06 | RL-20, KC-09, MF-22, RO-01, RO-02, MS-15 |
| 10 | Each manual payout is entered as a manual act, matched to the rail's statement and approved by Roan Capital's approvers; each manual approval is entered the same way; each queued payout is checked against the rail's statement before release. Calls and complaints from the log are entered with their original times, so their clocks are true | Accountant; approvers; complaints handler | — | MD-01, MD-05, MD-06, RL-14, RL-01, MF-28 |
| 11 | The operations lead leaves safe mode; staff sign in again, since sessions do not survive a failover | Operations lead; staff | — | SE-24, AC-10 |
| 12 | Roan Capital confirms the service is back and every manual act is entered. A preliminary report within 12 hours, the root cause within 5 working days; the incident's timeline is kept, and the runbook reviewed | Incident lead; operations lead | — | RO-27, RO-18 |

## 3 · When it goes wrong

| # | At step | What happens | Capabilities |
|---|---|---|---|
| a | 1 | **One part is down, not all:** messaging (receipts and codes wait; borrowers' sign-in codes fail), the approval engine (approvals wait), sign-in (no one can work in the back office). A severity 2 or 1 by what it stops; Roan Capital uses only the part of its runbook that applies | RO-17, AC-13, MS-09 |
| b | 1 | **M-Pesa itself is down,** not us. Nothing to post; borrowers may pay by bank. Roan Capital decides whether to waive charges for the days its borrowers could not pay; a bulk waiver is approved by two people and posted, never edited in | MD-01, KC-04 |
| c | 8 | **The outage crossed midnight.** The day's close did not run. On recovery the missed days close in order, each with its own payments, once the day's intake is complete (end-of-day runner, E10) | KC-07 |
| d | 10 | **A payout was made by hand and also sat in the platform's queue.** The check against the rail's statement finds the hand payment; the queued one is cancelled and never released | RL-14, RL-01 |
| e | 9 | **Reminders would now be wrong:** a loan paid during the outage shown as overdue. The day's close waits until the intake is complete, and the ladder's reminders and actions run only after it, so no borrower is chased for a payment they made | KC-07, MF-39 |
| f | 8 | **The failover's loss window:** up to 5 minutes before site A was lost. Payments in it are pulled again from M-Pesa and the bank; anything staff entered in it (a note, an approval, a document) may be gone, and Roan Capital is told what to check and re-enter | RL-20, RO-04 |
| g | 1 | **An attack forces the platform off.** Safe mode within 4 hours; the platform restored from backups taken before the attack began, in a clean environment, with the backup keys from the recovery vault; the security notice to Roan Capital, and the Data Commissioner where personal data was reached, on their own clocks (platform-security §3) | SE-10, SE-20, SE-21, SE-22 |
| h | 2 | **Roan Capital's contacts cannot be reached.** Dibon calls the next contact it named, then emails all of them; its fallback runbook does not wait for us, since it decides without us | RO-18 |
| i | 10 | **Bringing things back in stops partway:** manual acts not yet entered by the next close. The nightly comparison lists every payout the platform cannot explain as an exception, with its owner; the incident stays open until Roan Capital confirms every manual act is in | RO-05, MD-05 |

## 4 · Gaps

| Gap | Release or phase today | In its absence | Proposed |
|---|---|---|---|
| SE-24, safe mode decided in advance (steps 3, 11) | R2 | The on-call engineer holds payouts by configuration on the operations lead's word; the rest of safe mode's rules already hold in R1 (M-Pesa's validation fallback set to complete at onboarding; RL-10 and RL-14 against double payment; manual acts approved afterwards) | Bring SE-24 into R1: every R1 journey's outage row relies on it |
| SE-23, a clean rebuild from code (3g) | R2 | A restore into an environment rebuilt by hand from the deployment's records, slower and less certain | Accept for R1; first in R2 |
| The second site for warm standby (step 8) | Open: its provider (deployment §1) | Recovery from backups: about a day, as cold standby | Settle the provider before Roan Capital's go-live, or agree cold standby in its contract |
| Messages during an outage (steps 2, 7) | The incident notices are written by people, not templates in the messaging catalogue | Customer experience writes each from the notice's six points (incident management §4) | Accept for R1; the notice templates written before go-live, as incident management §4 says |

## 5 · Open questions

- **For Roan Capital** (its fallback runbook, onboarding OB-COM-23): who
  decides to enter and leave safe mode; who may pay out by hand, within
  what limit; its manual approval form; whom we call first, and second.
- **For the owner:** bringing SE-24 into R1; the target of one working
  day to enter every manual act; whether Roan Capital's contract takes
  warm standby (4 hours) or cold (about a day) until the second site is
  settled.
