---
id: handbook-outage
name: Handbook 7 — when things go wrong
kind: handbook
version: 0.1.0
owner: Delivery lead
classification: Internal
review_ids: [FS-773, FS-774, FS-775]
last_reviewed: 2026-10-12
---

# 7 · When things go wrong

The institution's fallback runbook: how it keeps lending and collecting
while the platform is down, and how everything comes back in afterwards
([JN-19](../journeys/outage.md)). Agreed at onboarding (OB-COM-23).

**Two jobs.** Getting the platform back is Dibon's. Keeping the business
going without it is the institution's, with its own paybill, M-Pesa
business portal, internet banking, approval form and outage log. **Dibon
never touches the institution's money, even if asked:** no one at Dibon
signs in to its portal or bank, holds those credentials, signs its form
or pays for it. Dibon advises by phone; the institution's staff act.

**Names the institution fills in:**

| Role | Who | Their deputy |
|---|---|---|
| Decides to enter and leave safe mode | [the operations lead] | [ ] |
| Pays out by hand, two together | [the finance officer and a signatory] | [ ] |
| Brings payments back in | [the accountant] | [ ] |
| Dibon calls first, then second | [ ], [ ] | — |
| Payout by hand: the most per payment, and per day | [KES ] | — |

## HB-70 · When Dibon calls: entering safe mode

**From:** JN-19, steps 2 and 3; (h).

**Who:** the operations lead. **When:** as soon as Dibon reports the
platform down, or staff find it down and Dibon confirms.

1. Take the call or email: what happened, what still works, what not to
   do, who leads at Dibon, when the next update comes.
2. Decide to enter safe mode, and tell Dibon, who holds the platform's
   payouts. **Release nothing from the platform** until Dibon confirms.
3. Tell staff: the runbook is open; who pays out by hand; where the
   outage log and approval forms are.
4. If staff find the platform down before Dibon calls, ring Dibon's
   support line, then work this runbook; it does not wait for us.

**Record:** the time of the decision, in the outage log.

## HB-71 · Borrowers' payments during an outage

**From:** JN-19, step 4.

Nothing to do: borrowers keep paying the paybill from the M-Pesa menu,
and Safaricom's SMS confirms it to them. If a borrower calls:

- Their payment has arrived and will be counted on the day they paid; no
  charge will run for the outage.
- Their receipt from us will follow when the platform is back.
- Write the call in the outage log (HB-74).

## HB-72 · A payout by hand

**From:** JN-19, step 5; (d).

**Who:** two people named above, never one. **When:** only for a payout
that cannot wait, such as a disbursement promised for today, within the
limits above.

1. Check the loan was approved before the outage, or approve it on the
   manual form (HB-73).
2. Pay from the M-Pesa business portal or internet banking, under the
   institution's two-person control, to the account the approval names.
3. Write it in the outage log: amount, payee, account, the rail's
   reference, the time, and both names.
4. Do not release, retry or re-send anything queued in the platform.

**Record:** the outage log line, and the portal's or bank's confirmation.

## HB-73 · An approval on the manual form

**From:** JN-19, step 6.

**Who:** the approvers the platform's chain would name for that loan or
payment. **When:** only for a decision that cannot wait.

1. Fill in the manual approval form: what is approved, the amount, the
   loan or payee, the reason it cannot wait.
2. Each approver signs and dates it, in the chain's order; no one signs
   twice.
3. Keep the form with the outage log.

**Record:** the signed form.

## HB-74 · Calls and complaints in the outage log

**From:** JN-19, step 6; JN-08 (j).

Every call, complaint and promise to pay is written in the outage log
with the time it was received, the borrower's loan reference and what
they said. A complaint's 30 days run from that time, not from when it is
entered later.

**The outage log and the forms hold borrowers' details on paper.** Keep
them locked away; never photograph them or send them by email or
WhatsApp; after they are entered (HB-75), file them as the institution's
records.

## HB-75 · Bringing it back in

**From:** JN-19, steps 9 and 10; (i).

**Who:** the accountant, with the approvers and the complaints handler.
**When:** within one working day of the platform's return.

1. Check with Dibon that the outage's M-Pesa payments are posted, each
   with its own date, and that the bank statement for the outage is
   loaded.
2. Enter each payout from the outage log as a manual act, with its
   rail's reference; the approvers approve it in the platform.
3. Enter each manual approval from its form the same way.
4. Enter each call and complaint with its original time.
5. Release nothing queued until the platform has checked it against the
   rail's statement: one already paid by hand is cancelled, never sent.

**Record:** each manual act, matched to its statement line; the
morning's exceptions list shows any payout the platform cannot explain
until it is entered.

## HB-76 · Leaving safe mode

**From:** JN-19, steps 11 and 12.

1. When Dibon confirms that money moves and balances are right, the
   operations lead decides to leave safe mode and tells Dibon.
2. Staff sign in again.
3. Once every manual act is entered (HB-75), confirm to Dibon; the
   incident closes, and Dibon's report follows: preliminary within 12
   hours, the root cause within 5 working days.
4. Review the runbook with Dibon: what slowed you down.

## HB-77 · When M-Pesa itself is down

**From:** JN-19 (b).

Not the platform: there is nothing for Dibon to fix. Tell borrowers they
may pay by bank transfer. When M-Pesa returns, decide whether to waive
charges for the days borrowers could not pay; a waiver is approved by two
people in the platform.

## HB-78 · A suspected attack

**From:** JN-19 (g).

1. Tell Dibon at once if anything looks wrong: an unexpected payout, a
   sign-in nobody recognises, a message borrowers did not expect.
2. Follow Dibon's instructions on safe mode; recovery from clean backups
   can take longer than an ordinary outage.
3. The institution's own notices stay its own: to the Data Commissioner
   where personal data was reached, and to CBK; Dibon gives the evidence
   (rules for institutions 8).
