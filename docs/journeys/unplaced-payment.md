---
id: jn-16-unplaced-payment
name: JN-16 · An unplaced payment, from arrival to its account or back to the payer
kind: journey
release: R1
status: draft
validated_with: not yet
owner: Solution architect
classification: Internal
review_ids: [FS-548, FS-661, FS-663, FS-668, FS-670]
last_reviewed: 2026-10-09
---

# JN-16 · An unplaced payment, from arrival to its account or back to the payer

A payment reaches Roan Capital's paybill in R1 and cannot be placed: no
reference, a reference that matches no account, and a paying phone that
matches no customer. It happens when a payer types the reference wrong,
pays a till (which carries no reference), pays while our validation check
is down and M-Pesa completes it anyway (FS-661), or pays by bank transfer
with a reference we cannot read. The money is the institution's to hold
for the payer, never ours, and never kept: it is placed on evidence or
returned at day 7 (collect CO-21, FS-663).

## 1 · Who and where

- **Who:** the payer, who may not be a customer at all; Roan Capital's
  accountant, who owns the ticket; its follow-up team; two approvers for
  a return.
- **Channel:** the payer's own phone, by SMS (and WhatsApp where they
  consented); the back office and Odoo Helpdesk for staff; the replies in
  Flowza's inbox, linked to the ticket.
- **Starts when:** a payment lands that cannot be placed.
- **Ends when:** the money is on the right account and the payer has a
  receipt; or it is back with the payer, with the return's reference.
- **Target:** placed within 24 hours of the payer's answer; returned by
  day 7 at the latest (proposed).
- **Moments that matter:** the first message, which must reassure: the
  money arrived, it is safe, and it will be placed or returned; the
  follow-up call, courteous and brief; the return, confirmed with a
  reference the payer can quote.
- **Data:** the paying number and the name M-Pesa reported, the payment,
  and the payer's replies, kept on the ticket (privacy PR-02, PR-07).

## 2 · Steps

```
  1 A payment arrives and cannot be placed: to the holding queue
        |-- the same customer, from a new number ..... bind it after (3i)
        v
  2 A ticket opens for the accountant, the clock running
        v
  3 The payer is asked which account it is for
        |-- no phone to ask (a bank transfer) ........ follow-up at once (3a)
        v
  4 The reply reaches the inbox and the ticket
        v
  5 Applied: automatically if the account is the phone's own,
    otherwise by the accountant
        |-- the account named is someone else's ...... verified first (3b)
        |-- the account is closed or settled ......... asked, or returned (3c)
        v
  6 Posted with the payment's own date; the receipt sent
        |-- more than the loan owes .................. the rest returned (3d)
        v
  7 No answer in 24 hours: a reminder
        v
  8 At 48 hours: the follow-up team calls
        v
  9 Day 7, unclaimed: returned to the payer, and told
        |-- the reversal window has passed ........... refunded instead (3e)
        |-- the return fails ......................... held, reported (3f)
        v
 10 Chained, logged, kept seven years
        :
    The platform down ........................... payments still land (3g)
    Stops partway ............................... kept, resumed or lapsed (3h)
```

| # | Step | Who | Messages | Capabilities |
|---|---|---|---|---|
| 1 | A payment lands at the institution's paybill. Matching tries the reference, then the paying phone; neither places it, so it goes to the holding queue, never guessed | Platform | — | CO-21, RO-02, RL-03 |
| 2 | A ticket opens in Odoo Helpdesk for the accountant, with the payment, the paying number, the name M-Pesa reported, and its SLA clock | Platform | — | RO-05, BS-01 |
| 3 | The payer is asked on the paying number which account it is for, by reply or by link; the message names no account holder | Platform | T28 | CO-21, MS-12 |
| 4 | The payer's reply reaches Flowza's inbox and is recorded on the ticket | Payer; platform | — | MS-10, CO-21 |
| 5 | If the account named belongs to the paying phone, the payment is applied automatically; otherwise the accountant confirms it on evidence before applying | Platform; accountant | — | CO-21, MF-10, RO-02 |
| 6 | The payment is posted to the account dated by its M-Pesa receipt, not the day it was placed, and the payer receives the receipt | Platform | T06 | MF-10, MF-22, MF-38 |
| 7 | With no answer after 24 hours, the payer is reminded | Platform | T29 | CO-21 |
| 8 | At 48 hours, the follow-up team calls the payer, and the call is recorded on the ticket | Follow-up team | — | CO-21, RO-05 |
| 9 | At day 7, unclaimed, the money goes back to the payer: an M-Pesa reversal within its window, or a refund approved by two people; the payer is told, with the return's reference | Approvers; platform | T30 | CO-21, RL-01, MD-01, MD-06 |
| 10 | Every event is chained, and the ticket and its evidence kept for at least seven years | Platform | — | RO-24, FC-12 |

## 3 · When it goes wrong

| # | At step | What happens | Capabilities |
|---|---|---|---|
| a | 3 | **There is no phone to ask:** a bank transfer, or a number that cannot receive SMS. The follow-up team acts at once, through the bank's remitter details where the bank gives them | RO-05, RL-07 |
| b | 5 | **The reply names someone else's account.** Not applied: the accountant checks with the account holder first, and a reply that looks like an attempt to redirect money is raised on the ticket for the compliance officer | CO-21, BS-01 |
| c | 5 | **The account is closed, or its loan already settled.** The payer is asked whether it was meant for another account; if not, it is returned as in step 9 | CO-21, RL-01 |
| d | 6 | **The payment is more than the loan owes.** What the loan owes is applied, as the regulated order sets; anything beyond the payoff goes back to the payer | MF-22, RL-01 |
| e | 9 | **M-Pesa's reversal window has passed.** A refund by B2C instead, to the paying number, after the registered name is confirmed and two people approve | RL-01, RL-21, MD-06 |
| f | 9 | **The return fails:** the number is closed, or the bank account gone. The money stays in a suspense account, never income, reported in the morning report until it is placed or the law's unclaimed-funds procedure applies (§5) | RO-05, RO-08 |
| g | 1 to 9 | **The platform is down.** Payments still land in the paybill (architecture §3); they are caught up from M-Pesa's records when it returns, and placed through these same steps | RL-20, CO-21 |
| h | 3 to 8 | **The payer stops partway:** a reply with a name but no account, or a link opened and left. It is kept on the ticket; the clock runs on; the reminder, the call and the return at day 7 follow as usual | CO-21 |
| i | 1 | **The same customer pays repeatedly from a number not on their record.** After the payment is placed, the customer is asked to add the number; once confirmed by code to that number, it is bound to their record and future payments match on it | ID-11, ID-12 |

## 4 · Gaps

| Gap | Release or phase today | In its absence | Proposed |
|---|---|---|---|
| Flowza as the inbox for replies (step 4) | Not yet fit for institutions' customers: hosting, its transfer clause, its unofficial WhatsApp channel (FS-664 to FS-666) | Replies by SMS reach messaging's inbound path and are recorded on the ticket | Close FS-664 to FS-666 before R1 go-live, or run R1 without Flowza |
| Case management for a suspicious reply (step 5, 3b) | financial-crime FC-08 is phase 2 | A ticket for the compliance officer in Odoo Helpdesk, as decided for identity mismatches | Accept for R1 |
| CO-21, the holding queue, the payer asked, the return at day 7 (steps 1, 3, 5, 7 to 9) | phase 1, not in R1 | Unmatched repayments wait in MF-10's matching; the accountant contacts payers by hand, with no clock and no return rule | Move CO-21 into R1: Roan Capital's repayments land on its own paybill, and FS-663 designed this for them |
| RL-20, M-Pesa Pull Transactions (3g) | phase 1, not in R1 | A missed callback is found only on the next statement; the night's check C3 (end-of-day-runner §4) cannot run as designed | Move RL-20 into R1 |
| ID-12, binding a number to the customer (3i) | phase 1, not in R1 | The number is confirmed by code (ID-11) and noted on the record, but not bound to its SIM | Move ID-12 into R1: access-keycloak §3 already assumes customers' numbers are bound, and ID-13 holds on a SIM change |
| MS-10, inbound replies (step 4) | phase 1, not in R1 | The payer's reply is not captured; the accountant asks them to call | Move MS-10 into R1: without it nobody can answer step 3 |
| MS-12, product events becoming messages (step 3) | phase 1, not in R1, though the messaging spec counts it in R1 | Messages sent by hand from the ticket | Move MS-12 into R1: every template in the R1 catalogue rides on it |
| RO-08, suspense holding exactly the open breaks (3f) | phase 1, not in R1 | A suspense account in the general ledger, reconciled by hand each morning | Accept for R1 |

## 5 · Open questions

- **For counsel:** when an unclaimed payment cannot be returned (3f), what
  the Unclaimed Financial Assets Act requires of the institution, and
  when. The Act is not yet in the law register, and has not been read.
- **For Roan Capital:** who forms its follow-up team, and their hours;
  whether day 7 suits its customers.
- **For the owner:** whether a till payment, which carries no reference,
  should prompt the payer for the account automatically, rather than
  waiting for the accountant.
