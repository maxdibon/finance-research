---
id: jn-13-bank-disbursement
name: JN-13 · A bank disbursement, from release to settlement, return or recall
kind: journey
release: R1
status: draft
validated_with: not yet
owner: Solution architect
classification: Internal
review_ids: [FS-548, FS-586, FS-587, FS-588, FS-594, FS-611, FS-661, FS-668, FS-680, FS-682, FS-683]
last_reviewed: 2026-10-10
---

# JN-13 · A bank disbursement, from release to settlement, return or recall

An approved and signed loan is paid to the borrower's bank account in
R1, from Roan Capital's own account at its bank (open answer 6: NCBA,
and perhaps Access Bank). JN-04 ends at step 8 with "paid by bank
transfer"; this journey is what that step holds. Each payout is one
instruction, from approval to settlement, under one id (rails RL-01):
what is approved is what is sent, a silence is never resent blind, and a
payment that comes back is reversed by an entry, never deleted.

Until a bank grants API or host-to-host access (FS-344), R1 pays by a
bulk-payment file that Roan Capital's signatories release in the bank's
internet banking. Both paths are built; which applies is configuration
per bank account, with the limit from that bank's mandate letter
(RL-07, FS-594, FS-611).

## 1 · Who and where

- **Who:** the borrower; Roan Capital's finance officer, who prepares
  the disbursement; the approver; Roan Capital's signatories at the bank;
  its accountant, who sees the exceptions.
- **Channel:** the back office for staff; the bank's internet banking for
  the signatories, on the file path; SMS and the borrower's own page for
  the borrower.
- **Starts when:** a loan is approved and signed, and its disbursement is
  prepared to a bank account (JN-04 step 7).
- **Ends when:** the bank's statement shows the payment, the loan is
  posted in Kapu Core, and the borrower has a receipt; or the money is
  back in Roan Capital's account, the posting reversed, and the borrower
  told what happens next.
- **Target:** released the same business day as the approval, if approved
  before the bank's cut-off; in the borrower's account by the next
  business day (proposed).
- **Moments that matter:** the wait for the money, where the borrower
  knows when it will arrive and is told at once if it is late; a return,
  told plainly, and never charged for money they did not receive; for the
  signatories, totals in the bank's portal that match what was approved,
  so their release is a check and not a formality.
- **Data:** the borrower's bank, branch, account number and the account
  holder's name, and the name the bank returns (privacy PR-02).

## 2 · Steps

```
  1 Disbursement prepared to the borrower's own account
        |-- the borrower withdraws, or details change ... cancelled (3e)
        v
  2 The account holder's name confirmed with the bank
        |-- the name does not match .............. held (3a)
        v
  3 A second person approves, re-authenticated
        |-- the approver prepared it ............. refused (3b)
        v
  4 Released by the bank account's path
    API or host-to-host, within the mandate-letter limit;
    otherwise a file the signatories release
        |-- changed after approval ............... refused (3c)
        |-- the file in the portal differs ....... not released (3d)
        |-- after the cut-off, or in the close ... held to the next window (3j)
        v
  5 The bank accepts, or rejects
        |-- rejected: account closed, invalid .... borrower asked (3f)
        |-- no answer ............................ pending, asked (3g)
        v
  6 The statement shows the debit; every line compared
        |-- a line not approved .................. incident (3d)
        v
  7 Posted in Kapu Core at the value date; the borrower's receipt
        v
  8 Chained, logged, kept seven years
        :
    Returned by the borrower's bank ............. reversed, re-sent (3h)
    Sent wrong, recalled ........................ recall, or recovery (3i)
    The platform down ........................... paid by hand (3k)
    Stops partway ............................... reminded, escalated (3l)
```

| # | Step | Who | Messages | Capabilities |
|---|---|---|---|---|
| 1 | The finance officer prepares the disbursement from the approved and signed loan only, to an account in the borrower's own name: the individual's for a personal loan, the company's for a business loan. The account is one seen on the statements filed at appraisal, or on the bank's letter | Finance officer | — | MF-11, RL-01, ID-15 |
| 2 | The account holder's name is confirmed through the bank's account-validation service where it offers one, and the result kept with the instruction | Platform | — | RL-29, RL-07 |
| 3 | A second person approves, re-authenticated at the act, from the console or email. The approval records a hash of the amount, payee name, bank, account, rail and reference | Approver | T26 | MD-01, MD-06, MD-18, AC-05, KC-08 |
| 4 | The instruction is released by the path configured for the bank account. Within the limit in the bank's mandate letter, with API or host-to-host access, it goes straight through: signed with Roan Capital's key inside OpenBao and sent over mutual TLS, with no person in between. Otherwise by file, in layers (FS-683): the platform builds it only when asked, with its line count, total and hash on the approval record; the finance officer downloads it once, after step-up, to the designated machine, uploads it to internet banking and deletes it, and a second download raises an alert. Before release, the portal's view of the uploaded batch is exported and uploaded back, and the platform compares every line (name, account, amount) with the approval; where the portal cannot export, the signatories compare every line against the approval screen. Only the signatories release it, never the person who uploaded, and only on a match | Platform; finance officer; signatories | — | RL-07, RL-01, RL-12, AC-05, FC-16 |
| 5 | The bank's status closes the "sent" state: accepted or rejected, from its API, its status report, or its portal | Platform; accountant | — | RL-01, RL-07, RL-10 |
| 6 | Within the hour, the bank's debit alerts, or a same-day statement where the bank gives one, are compared with the approval. The statement (MT940, CAMT.053 or CSV) then arrives; every line is compared with what was approved, and the payment matched to its instruction | Platform | — | RL-07, RO-02, RO-04 |
| 7 | Only then is the disbursement posted in Kapu Core, dated by the bank's value date, so the schedule runs from the day the money left. The borrower receives the receipt by SMS with the bank's reference and a link to their page | Platform | T05 | KC-04, MF-38, MS-12 |
| 8 | Every event is chained, the approval and the bank's evidence kept with the instruction for at least seven years | Platform | — | RO-24, RO-19, FC-12 |

## 3 · When it goes wrong

| # | At step | What happens | Capabilities |
|---|---|---|---|
| a | 2 | **The name the bank returns does not match the borrower.** The payout is held before it is sent. The finance officer asks the borrower for the right account, or the bank's letter; a new account is a new payee, approved afresh | RL-29, MF-11 |
| b | 3 | **The approver prepared the disbursement.** Refused: one person never completes two consecutive steps | MD-06, KC-08 |
| c | 4 | **The amount, payee or account changed after approval.** The adapter refuses an instruction whose hash differs from the approval's; any change re-opens approval (FS-588) | RL-01 |
| d | 4, 6 | **The batch in the portal differs from the approval:** a line count, total, name, account or amount. It is not released: the batch is deleted from the portal, the file deleted, and a ticket opened. After release, a line that was not approved, or was altered, is a severity 1 incident, and a recall is requested at once (3i) | RL-07, RO-05, BS-01 |
| e | 1 to 4 | **The borrower withdraws, or the account details change, before release.** The instruction is cancelled with its reason, and nothing is posted. Once the bank has it, cancellation is a recall (3i) | RL-01 |
| f | 5 | **The bank rejects the payment:** the account is closed, dormant or invalid. Nothing left the account. The borrower is asked for an account in their own name, which is confirmed (step 2) and approved (step 3) afresh | RL-01, RL-29, MF-12 |
| g | 5 | **No answer comes from the bank.** The payment is pending, not failed: the bank's status is asked, and the statement settles it. It is never resent blind. If the target time passes, the borrower is told it is on its way and when they will hear next (T35) | RL-10, RL-14, MF-12 |
| h | after 7 | **The borrower's bank returns the money** (an account closed after validation, a name the receiving bank refused). The return is matched to its instruction; the posting is reversed by an entry dated as the original, so no interest or fee runs for money the borrower never had; the borrower is told (T36), and asked for another account in their own name | RL-01, RO-02, KC-04, MF-38 |
| i | after 5 | **The payment went where it should not:** to a wrong account, or twice. A recall is requested through the bank under two approvals, within the bank's time limit; a recall returns money only to where it came from. If the receiving bank refuses, the recovery is the institution's, with the evidence from step 8 | RL-01, MD-06, RO-24 |
| j | 4 | **It is after the bank's cut-off, a weekend or holiday, or within Roan Capital's end-of-day window** (11 pm to 4 am, RC-21). A rule holds what the platform would send until the next window; the borrower's expected date says so | FC-16, KC-15 |
| k | 1 to 6 | **The platform is down.** Roan Capital's own staff pay from internet banking under its two-person control (architecture §3). The payment is recorded as a manual act and approved afterwards; a queued instruction is released only once the statement shows the payment was not made by hand | RL-01, MD-06 |
| l | 3, 4 | **The approval stops partway:** approval not given, or a file uploaded and not released. The instruction waits in its state; the approver is reminded, then the request escalated; a file not released by the cut-off is in the morning's exceptions, and the accountant chases the signatories. A file not released within two business days is withdrawn from the portal and the instruction cancelled (proposed) | MD-08, RO-05, MF-12 |

## 4 · Gaps

| Gap | Release or phase today | In its absence | Proposed |
|---|---|---|---|
| API or host-to-host access at NCBA and Access Bank (FS-344) | Open: Roan Capital's request to each bank | Every bank payout goes by the internet-banking file, released by the signatories, with the protections in step 4 | Accept for R1. Host-to-host is the first thing Roan Capital asks NCBA for: it takes the file out of anyone's hands (FS-683) |
| The portal's export of an uploaded batch (step 4) | Depends on each bank's portal | The signatories compare every line against the approval screen; practical at Roan Capital's volumes | Accept for R1; ask NCBA and Access Bank |
| A bank account-validation service (step 2) | Depends on each bank; PesaLink's name lookup (RL-06) is phase 2 | The finance officer checks the account against the borrower's statement or bank letter, and records that check on the instruction | Accept for R1; ask NCBA and Access Bank what they offer |
| SE-14, managed devices for staff | R2 | The bank file lands on an ordinary laptop | Accept for R1 with one designated machine at Roan Capital, used only for bank work: disk encryption, patched, endpoint protection, no email or general browsing, only finance staff signing in, internet banking reachable only from it where the bank allows; named in its runbook (FS-682) |

## 5 · Open questions

- **For Roan Capital:** NCBA only, or NCBA and Access Bank (open answer
  6); who its bank signatories are, and whether every bulk file needs two
  of them; whether a loan is ever paid to someone other than the
  borrower, such as a car dealer for a vehicle loan, and on what
  evidence; who uploads bank files and who releases them, never the
  same person.
- **For NCBA and Access Bank:** host-to-host access; account validation,
  and whether names are checked on upload; whether the portal can export
  an uploaded batch before release; dual control, so one person uploads
  and another releases; limits per batch and per payment; internet
  banking restricted to one machine, and hardware tokens for signatories;
  an alert to a second person on each release; debit alerts or a
  same-day statement; the cut-off for each rail; how a return is
  reported, and in what time; their recall procedure and its time limit.
- **For the owner:** whether two business days is the right time to
  withdraw a file the signatories have not released (3l).
