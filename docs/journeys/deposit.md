---
id: jn-10-deposit
name: JN-10 · A deposit paid to the institution's paybill or till
kind: journey
release: R2
status: draft
validated_with: not yet
owner: Solution architect
classification: Internal
review_ids: [FS-548, FS-552, FS-554, FS-661, FS-663, FS-668, FS-782]
last_reviewed: 2026-10-13
---

# JN-10 · A deposit paid to the institution's paybill or till

A customer of a bank on Kapu Collect pays money into their own account
from their phone: from the M-Pesa menu to the bank's paybill, with their
account number as the reference, or to one of the bank's tills, at a
branch, an agent or a partner's collection point (CO-21). The money goes
straight to the bank, never through Dibon or a partner (FS-056). Where
M-Pesa asks us first, a deposit that cannot be accepted is refused
before it leaves the customer's wallet; every deposit accepted is posted
to the right account, on its own date, and confirmed to the customer.

A deposit by a payment prompt that a partner's app or a field collector
starts (CO-05) is the same journey from step 4; a payment that cannot be
placed continues as JN-16.

## 1 · Who and where

- **Who:** the depositor, the bank's customer; the bank's operations
  team, for anything held or unplaced; its compliance officer, for an
  alert; where the till is a partner's, the partner, told by callback.
- **Channel:** the depositor's own phone: the M-Pesa menu (Airtel Money
  and T-Kash the same way), Safaricom's confirmation SMS and ours; the
  bank's back office for staff.
- **Starts when:** the depositor enters the paybill and account number,
  or the till number, in their M-Pesa menu.
- **Ends when:** the deposit is posted to their account in the bank's
  core with the M-Pesa receipt's date, the depositor has our receipt, and
  the deposit is matched to M-Pesa's record; or it was refused before any
  money moved, and they were told why.
- **Target:** refused or accepted within M-Pesa's validation window (a
  few seconds); posted and confirmed within a minute of M-Pesa's
  confirmation (proposed); matched by the next reconciliation cycle.
- **Moments that matter:** the PIN, where the depositor trusts that the
  number they typed is right; the first seconds after, when they want to
  know it reached their own account; a refusal, which must say plainly
  that no money left them, and what to do instead.
- **Data:** the paying number and the name M-Pesa reports, the account
  number, the amount and the receipt (privacy PR-02, PR-07).

## 2 · Steps

```
  1 The depositor pays the paybill with their account number, or a till
        |-- a till, which carries no account number .. matched on the phone (3a)
        |-- the depositor cancels at the PIN ........... nothing moves (3l)
        v
  2 M-Pesa asks us first: account, status, limits
        |-- no such account ............................ refused, told (3b)
        |-- closed or frozen ........................... refused, told (3c)
        |-- above their tier's limit ................... refused, told how to raise it (3d)
        |-- dormant ..................................... accepted, the wake checked (3e)
        |-- we do not answer in time ................... M-Pesa completes anyway (3f)
        v
  3 Accepted: the depositor enters their PIN; Safaricom confirms to them
        v
  4 M-Pesa's confirmation reaches us; the rules run
        |-- the confirmation never arrives ............. found by Pull Transactions (3g)
        |-- the same confirmation twice ................ posted once (3h)
        |-- a pattern the rules flag ................... to the compliance officer (3i)
        v
  5 Posted to the account in the bank's core, dated by M-Pesa's receipt
        |-- the core does not answer ................... queued, never lost (3j)
        v
  6 The depositor's receipt; the partner told, if it was a partner's till
        v
  7 Matched to M-Pesa's record and the core in the next cycle
        :
    The platform down ............................... deposits still land (3k)
    A deposit the depositor disputes ................ the bank's complaint path (3m)
    Stops partway ................................... nothing moves (3l)
```

| # | Step | Who | Messages | Capabilities |
|---|---|---|---|---|
| 1 | The depositor opens the M-Pesa menu and pays the bank's paybill with their account number as the reference, or one of the bank's tills | Depositor | — | CO-21, RL-03, RL-04, RL-05 |
| 2 | Before taking the money, M-Pesa sends us the payment to validate. We check that the account exists and is open, that it accepts deposits, and that this deposit keeps it within its customer's KYC tier and the bank's transaction rules; and answer accept or refuse within M-Pesa's window | Platform | — | CO-21, ID-19, FC-16, RL-03 |
| 3 | Accepted, M-Pesa asks the depositor for their PIN and completes the payment; Safaricom's own SMS confirms it to them | Depositor; M-Pesa | — | RL-03 |
| 4 | M-Pesa's confirmation reaches us with its receipt; the transaction gets its one identifier, and each step from here is a signed, chained event | Platform | — | RL-03, RO-23, RO-24 |
| 5 | The deposit is posted to the account in the bank's core, through its adapter, dated by the M-Pesa receipt's time, once only for each receipt | Platform | — | KC-09, CO-08, RL-14 |
| 6 | The depositor gets our receipt by SMS: the amount, the account's last four digits, the date and the receipt, never the balance, which is behind sign-in. A partner whose till took it gets a callback | Platform | T43 | CO-18, MS-12, CO-09 |
| 7 | The next reconciliation cycle matches the deposit to M-Pesa's record and to the core's posting; anything that does not match is an exception with an owner | Platform; operations team | — | RO-02, RO-04, CO-12 |

## 3 · When it goes wrong

| # | At step | What happens | Capabilities |
|---|---|---|---|
| a | 1, 2 | **A till payment** carries no account number. It is matched on the paying phone to the one account bound to it; a phone with no account, or with several, goes to the holding queue and the unplaced-payment path (JN-16) | CO-21, ID-12 |
| b | 2 | **No such account number.** Refused before the money leaves. The depositor is told the account number was not recognised and no money left their M-Pesa, and to check it (T44); the message names no account holder | CO-21 |
| c | 2 | **The account is closed or frozen.** Refused the same way; the depositor is told to contact the bank (T44), never why it is frozen | CO-21 |
| d | 2 | **Above the tier's limit:** a single deposit, a day's total or a balance the customer's KYC tier does not allow. Refused, and the depositor is told the limit and how to raise their tier by completing their identity checks (T44) | ID-19, FC-16 |
| e | 2 | **The account is dormant.** The deposit is accepted and the account wakes under the bank's rules; the operator's name check runs again before the account can pay anything out (ID-14) | ID-14, ID-03 |
| f | 2 | **We do not answer in time:** the platform slow or down. M-Pesa completes the payment anyway, since its fallback is set to complete (safe mode). The checks run when the confirmation arrives: a deposit that breaks a limit is posted to a hold, not the account, and the operations team decides, within the bank's rules, to apply it or return it to the payer | SE-24, FC-16, RL-01 |
| g | 4 | **The confirmation never arrives.** Pull Transactions finds the payment in M-Pesa's own record and it is posted, dated by its receipt | CO-20, RL-20 |
| h | 4, 5 | **The same confirmation arrives twice.** Posted once: the M-Pesa receipt is the key | CO-08, RL-14 |
| i | 4 | **The rules flag a pattern:** deposits split to stay below a reporting threshold, or one account fed from many unrelated phones. The deposit is posted; an alert goes to the bank's compliance officer, who decides, in the restricted team, whether to report it | FC-16, FC-12 |
| j | 5 | **The bank's core does not answer.** The deposit waits in our outbox and posts when the core is back, with its own date; the depositor's receipt waits for the posting, so it never confirms money the account does not yet show | KC-09, RL-10 |
| k | 1 to 7 | **The platform is down.** Deposits still land in the bank's paybill, confirmed by Safaricom; they are caught up from M-Pesa's record when we return, and posted through these same steps (JN-19) | RL-20, SE-24 |
| l | 1, 3 | **The depositor stops partway:** they close the menu or cancel at the PIN. Nothing moves; a validation without a confirmation expires with nothing to undo | RL-03 |
| m | 6 | **The depositor says it went to the wrong account,** or was never meant to be paid. The bank's own complaint path; a correction is a reversing entry approved by two people, never an edit, and a refund to the paying number goes as a payout | MD-01, MD-06, RL-01 |

## 4 · Gaps

| Gap | Release or phase today | In its absence | Proposed |
|---|---|---|---|
| FC-07, monitoring rules over time (3i) | phase 2 | Patterns caught only by FC-16's rules on each transaction | Accept for R2; FC-07 with the first bank that needs it |
| FC-08, case management for an alert (3i) | phase 2 | The alert is a ticket for the compliance officer in the bank's helpdesk, in its restricted team | Accept for R2 |
| RO-22, self-service M-Pesa reversal (3m) | phase 2 | The bank's operations team handles a disputed deposit through Safaricom's own reversal process | Accept for R2 |
| Validation on tills, and on Airtel Money and T-Kash (steps 1, 2) | To confirm with Safaricom, Airtel and Telkom (CO-21) | Payments complete without our check; the checks run on confirmation, and a breach is held as in (f) | Ask each operator before R2's go-live |

## 5 · Open questions

- **For Safaricom:** whether a till payment can be validated before it
  completes; how long M-Pesa waits for our answer, and what the payer
  sees when we refuse.
- **For Airtel and Telkom:** whether their collections offer validation
  at all.
- **For the first bank:** its deposit limits per tier, its rules for a
  dormant account, and its rule for a deposit that breaks a limit after
  M-Pesa completed it (apply or return).
- **For the owner:** the target of a minute from M-Pesa's confirmation to
  the depositor's receipt.
