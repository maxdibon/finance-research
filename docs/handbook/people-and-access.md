---
id: handbook-people
name: Handbook 2 — people and access
kind: handbook
status: draft
owner: Delivery lead
classification: Internal
review_ids: [FS-768, FS-769, FS-770, FS-771, FS-772]
last_reviewed: 2026-10-13
---

# 2 · People and access

The procedures behind [JN-18](../journeys/staff-access.md). The rules
they keep are the institution's agreed rules (docs/rules.md §2): named
users only, two authenticators, a leaver removed the same day, and a
quarterly access review the institution signs.

## HB-20 · A joiner

**From:** JN-18, steps 1 to 5.

**Who:** the manager; the administrator; the access approver. **When:**
at least two working days before the start date.

1. The manager records the joiner in Odoo's Employees app: name, work
   email and phone, job position, manager, start date. Its onboarding
   plan gives each person below their task, linked to this procedure.
2. The platform creates their user with no roles, and asks for the
   position's roles (HB-10).
3. The administrator checks the joiner's ID in person; only then is the
   invitation sent.
4. The access approver decides the role request (HB-21) before the start
   date; the roles take effect on that date, not before.
5. On their first day the joiner sets a password, registers two
   authenticators, and completes their role's training before working on
   live data.

**Record:** the employee record; the approved role request; the ID check
on the user. **Rule:** rules for institutions 1; AC-16.

## HB-21 · Deciding a role request

**From:** JN-18, step 3; approval-engine §4.

**Who:** the access approver, never the person asking or the one being
granted.

1. The request arrives in the console or by email, naming the person,
   the role, the reason and the date it takes effect.
2. The approver checks the role against the position (HB-10) and the
   pairs never held together (HB-11); a warning shows if the change would
   leave a role with too few holders.
3. They approve or decline, re-authenticated at the act. The person is
   told by email what changed (T42).

**Record:** the decision in the approval engine. **Rule:** AC-09; MD-06.

## HB-22 · A move

**From:** JN-18, steps 6 and 7.

**Who:** the manager; the access approver; the credit lead for a
portfolio.

1. The manager records the new job position in Odoo, with the date of the
   move.
2. The platform asks for the new position's roles and the removal of the
   old ones, in one request, decided as in HB-21; both take effect on the
   date of the move.
3. A credit officer's borrowers are reassigned in bulk, with a second
   person's approval; the history is kept.

**Record:** the employee record; the approved request; the reassignment.

## HB-23 · A leaver

**From:** JN-18, steps 8 to 10 and (i).

**Who:** the manager; the credit lead; the finance lead. **When:** the
day they leave, or ahead with the date.

1. The manager records the departure date in Odoo, and starts its
   offboarding plan, which gives each person below their task. At that
   date the platform disables the user, signs them out everywhere and removes
   their authenticators, within minutes.
2. Their borrowers are reassigned as in HB-22.
3. **Outside the platform, the same day:** if they were a bank
   signatory, held an internet-banking token or used the M-Pesa portal,
   the finance lead tells the bank and Safaricom, recovers the token, and
   removes their sign-in from the designated bank machine.
4. Their devices and keys are returned.

**Record:** the employee record; the offboarding plan's tasks, each
closed by its owner; the disable event; the bank's and Safaricom's
confirmation. **Rule:** rules for institutions 3.

## HB-24 · A sudden or hostile exit

**From:** JN-18 (b).

1. The administrator disables the user at once, without waiting for
   Odoo; sessions end everywhere.
2. Out of hours, the contact the institution named calls Dibon's desk,
   which switches the user off on that request and records it.
3. Then HB-23, from step 2.

**Rule:** rules for institutions 7.

## HB-25 · A lost authenticator

**From:** JN-18 (c).

1. The person tells the administrator at once; the authenticator is
   revoked.
2. A second administrator checks their identity in person or by video;
   only then is a new one registered.

**Rule:** AC-16.

## HB-26 · Administrators

**From:** JN-18 (e).

At least two at all times. The last one cannot be disabled until another
is created. An administrator manages users but never grants an approval
role, and never holds `access-approver` (HB-11).

## HB-27 · The quarterly access review

**From:** JN-18, step 11.

**Who:** the operations lead, with Dibon. **When:** in the first week of
each quarter.

1. Dibon prepares the list: every user, their position, their roles,
   when each was approved, and their last sign-in; with any user found
   without a current employee record, or holding a role their position
   does not carry.
2. The operations lead checks each line with the managers, and asks for
   any correction through HB-21 or HB-23.
3. The operations lead signs the review.

**Record:** the signed review, kept seven years. **Rule:** rules for
institutions 3.
