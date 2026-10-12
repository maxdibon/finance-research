---
id: jn-18-staff-access
name: JN-18 · A member of staff joins, moves and leaves, with roles granted by mandate
kind: journey
release: R1
status: draft
validated_with: not yet
owner: Solution architect
classification: Internal
review_ids: [FS-498, FS-503, FS-548, FS-645, FS-668, FS-768, FS-769]
last_reviewed: 2026-10-12
---

# JN-18 · A member of staff joins, moves and leaves, with roles granted by mandate

A credit officer joins Roan Capital, later moves to its committee, and
one day leaves. What they may do follows the role, never the person:
roles live in the institution's own Keycloak realm, each one granted only
when a second person approves it, and read by the approval engine at the
moment a step needs someone (access-keycloak §6, AC-09). The aim is that
nobody ever shares a login, nobody holds a role they no longer need, and a
leaver's access ends within minutes of the exit being recorded (rules,
institutions 1 and 3).

Dibon's own engineers join and leave differently, through Dibon's central
identity and hardware keys: that is JN-20.

## 1 · Who and where

- **Who:** the member of staff; their manager, who asks for the access;
  Roan Capital's administrator, who creates and disables users but cannot
  grant an approval role; the second person who approves each role
  change; the accountant or credit lead who reassigns a portfolio.
- **Channel:** the back office, signed in through the `staff` realm with
  a password and an authenticator app or security key; approvals from the
  console or email; Keycloak's own emails for the invitation.
- **Starts when:** a manager asks for a joiner's access, a move, or
  records an exit.
- **Ends when:** the person holds exactly the roles their job needs, or,
  for a leaver, none, with their work reassigned and the change in the
  audit trail and the next access review.
- **Target:** a joiner able to work on their first day, the request made
  two working days ahead (owner, FS-769); a mover's old roles removed the day
  the move takes effect; a leaver's access ended within minutes of the
  exit being recorded, and the exit recorded the same day.
- **Moments that matter:** the first day, when the joiner signs in with
  their own account and can do their job; the move, with no day where
  approvals stall and none where the person holds both roles; the exit,
  when the institution is certain access has ended and borrowers' loans
  are still looked after.
- **Data:** the person's name, work email and phone, roles, authenticators
  and sign-in events (privacy PR-20, PR-13, PR-14).

## 2 · Steps

```
  Joins
  1 The manager asks for the joiner's access
        v
  2 The administrator creates the user, with no roles
        v
  3 Each role asked for, and approved by a second person
        |-- refused, or two roles that conflict ...... not granted (3a)
        v
  4 A credit officer gets a staff record and a portfolio
        v
  5 First sign-in: password, two authenticators, training done
        |-- not taken up in time ..................... the invitation lapses (3h)
        |-- an authenticator lost later .............. revoked at once (3c)
  Moves
  6 The new role approved, the old one removed the same day
        |-- a role left with too few holders ......... a warning (3d)
        v
  7 The portfolio and pending approvals move with second-person approval
  Leaves
  8 The exit recorded: disabled, signed out, authenticators removed
        |-- a sudden or hostile exit ................. switched off at once (3b)
        |-- the last administrator ................... never fewer than two (3e)
        |-- a bank signatory or M-Pesa portal user ... the bank and Safaricom told (3i)
        v
  9 Their approvals and requests reach other holders
        v
 10 Their portfolio reassigned, the history kept
        v
 11 Recorded; confirmed in the next access review
        :
    A role mapped without approval .................. found that night (3f)
    On leave ........................................ approvals flow on (3g)
    The platform down ............................... the exit applied first (3j)
    Stops partway ................................... the request waits, then lapses (3k)
```

| # | Step | Who | Messages | Capabilities |
|---|---|---|---|---|
| 1 | The manager asks the administrator for the joiner's access: name, work email and phone, start date, and the roles the job needs | Manager | — | AC-09 |
| 2 | The administrator creates the user in the institution's `staff` realm, with no roles. Keycloak emails an invitation to set a password and register authenticators; the administrator has checked the joiner's ID in person | Administrator | — | AC-01, AC-08, AC-02 |
| 3 | Each role is a request to the approval engine, decided by a second person, re-authenticated at the act; only then is the role mapped. A request from the approver for themselves is refused. The person is told what was granted | Manager; approver | T26, T42 | AC-09, MD-01, MD-05, MD-06, MD-10, AC-05 |
| 4 | For a credit officer, the staff record in Kapu Core is created and borrowers assigned to them, with a second person's approval; an officer never approves their own applications | Credit lead; approver | — | MF-35, MD-06 |
| 5 | On first sign-in the joiner sets a password and registers two authenticators (an authenticator app, and a security key or passkey where Roan Capital uses one), on a device that meets our minimum and never keeps customer data; the training module for their role is done before they work on live data | Joiner | — | AC-16, AC-10 |
| 6 | **A move:** the new role is requested and approved as in step 3, and the old role removed by the same approval, on the day the move takes effect, never accumulated | Manager; approver | T26, T42 | AC-09, MD-01, MD-06 |
| 7 | The mover's borrowers are reassigned in bulk with a second person's approval, the history kept. Approval steps are named by role and resolved to people when needed, so a step waiting on the old role goes to its other holders | Credit lead; approver | — | MF-35, MD-04 |
| 8 | **An exit:** the administrator records it the day it happens, or ahead with its date. Within minutes the user is disabled, signed out everywhere, and their authenticators removed; links in approval emails stop working, since each needs step-up at the act | Administrator | T42 | AC-10, AC-16, MD-18 |
| 9 | Approvals waiting on the leaver resolve to the role's other holders; requests they started stay with their history, under their manager | Platform | T26 | MD-04, MD-08 |
| 10 | Their borrowers are reassigned in bulk with a second person's approval, the history kept | Credit lead; approver | — | MF-35, MD-06 |
| 11 | Every grant, removal and exit is a signed event in the audit trail; the quarterly access review, which we prepare and Roan Capital signs, confirms each one | Platform; administrator | — | RO-27, AC-11, AC-09 |

## 3 · When it goes wrong

| # | At step | What happens | Capabilities |
|---|---|---|---|
| a | 3, 6 | **A role is refused,** or two roles conflict: the same person as maker and checker on one chain. Not granted; the request records why. The person has no role until one is approved, so can do nothing that needs one | MD-05, MD-06, AC-09 |
| b | 8 | **A sudden or hostile exit.** The administrator disables the user at once; out of hours, the contact Roan Capital named calls Dibon's desk, which switches the user off on that request and records it (rules, institutions 7). Sessions end everywhere at once | AC-10, AC-09 |
| c | 5 | **An authenticator is lost** (a phone stolen, a key mislaid). It is revoked at once; a new one is registered only after a second administrator checks the person's identity in person or by video | AC-16 |
| d | 6, 8 | **A role is left with too few holders,** such as a three-member committee down to two. The approval engine checks every role change and exit against the chains that name the role (approval-engine §4, rule 8): a move's approver sees the warning before deciding; an exit is never held back, but the administrator and the manager are told at once, and the role shows as short until it is filled. Its approvals cannot be decided until someone is appointed | MD-09, MD-04 |
| e | 8 | **The leaver is an administrator.** There are always at least two; the last cannot be disabled until another is created. No Dibon role, break-glass included, can stand in for an institution's role | AC-09 |
| f | 11 | **A role is mapped without an approval,** by someone working round the engine. The nightly comparison finds it, alerts, and the role is removed; it is investigated as a security incident | AC-09, AC-11 |
| g | 7, 9 | **The person is on leave.** Their roles stay; their approvals, if not decided in time, are reminded and escalated to other holders; their borrowers are reassigned for the leave if it is long, with approval | MD-08, MF-35 |
| h | 5 | **The invitation is not taken up** within 72 hours: it lapses, and the administrator sends another. An account never signed into is disabled after 30 days (owner, FS-769) | AC-10 |
| i | 8 | **The leaver was a bank signatory, held an internet-banking token, or used the M-Pesa portal.** Those are outside the platform: Roan Capital tells NCBA and Safaricom the same day and recovers the token; the designated bank machine's sign-in is removed (JN-13) | — |
| j | 8 | **The platform is down** when someone leaves. Nobody can sign in meanwhile; when it returns, the exit is applied before anyone else signs in, and any bank or portal access is ended by Roan Capital as in (i) | AC-10 |
| k | 3, 6 | **The request stops partway:** a role asked for and not decided. It waits in its state; the approver is reminded, then it escalates; the person has no new role until it is decided | MD-08 |

## 4 · Gaps

| Gap | Release or phase today | In its absence | Proposed |
|---|---|---|---|
| BS-12, joiners and leavers recorded in Odoo HR, which provisions Keycloak (MF-35 assumes it) | phase 1, not in R1 | The manager asks the administrator, who creates or disables the user in the back office | Accept for R1 |
| An away status, so approvals skip a person on leave (3g) | Not specified | Reminders and escalation after the step's due time | Accept for R1 |
| MD-11, the signing mandate mirrored at the bank (step i: bank and M-Pesa portal access are outside the platform) | phase 2 | Roan Capital changes its bank mandate itself, the same day | Accept for R1 |
| SE-14, managed devices for the institution's staff (step 5) | R2 | Our device minimum agreed at onboarding, and the designated bank machine (JN-13) | Accept for R1 |

## 5 · Open questions

- **For Roan Capital** (delivery map, open answer 26): who approves staff
  role changes; who its two administrators are; who tells the
  administrator of joiners, moves and leavers; and whether staff use
  Roan Capital's own devices. Its role list is open answer 7.
