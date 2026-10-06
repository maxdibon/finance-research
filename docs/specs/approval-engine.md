---
id: approval-engine
name: Approval engine — build specification
kind: spec
version: 0.1.0
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-492, FS-494, FS-495, FS-498, FS-516, FS-532, FS-547, FS-586, FS-587, FS-588]
last_reviewed: 2026-10-06
---

# Approval engine — build specification

How the signing side of the mandates module (docs/modules/mandates.md) is
designed to be built for R1, Roan Capital's pilot. The source is the MFI
PRD, FR-6 (sources/kapu), and Roan Capital's delivery map
(docs/customers/roan-capital.md). Nothing here is built; every behaviour
is **designed**. Where the design relies on Fineract behaviour that has
not been verified, it says **to confirm against Fineract**.

## 1 · Purpose and scope

The engine answers one question: *may this act happen yet?* It holds the
rules (mandates), applies them to each request, records every decision,
and tells the product when the answer is yes or no. It never executes the
act (mandates §10).

| Id | Capability | In R1 |
|---|---|---|
| MD-01 | Chains by role, per product and amount tier; tiers contiguous | Yes |
| MD-02 | Configuration effective-dated and audited | Yes |
| MD-03 | Chain resolved at submission and frozen | Yes |
| MD-04 | Roles resolved to people at runtime | Yes |
| MD-05 | Approve, decline, return; identity, comment, time | Yes |
| MD-06 | No self-approval; no one person on two consecutive steps | Yes |
| MD-07 | A flag routes to its authority as the last step | Yes, for overrides (MF-06) |
| MD-08 | Time-in-step SLAs, reminders, escalation | Yes: reminders and escalation as below |
| MD-09 | Quorum steps (N of M), for the 3-of-3 committee | Yes |
| MD-10 | Each decision re-authenticated at the act | Yes |
| MD-18 | Approval from email, step-up at the act | Yes |
| AC-05, AC-09 | Step-up, and roles read from Keycloak | Yes, as the engine's dependencies |

**Out of R1:** debit mandates (MD-13 to MD-17), the bank-side mirror
(MD-11), approval on a phone for a request started elsewhere (access
AC-06), and consumers other than Kapu MFI (MD-12): bill payments (§10),
Sacco committees, Collect and Gateway maker-checker. The engine is built
for them: a *subject type* is configuration, not code.

**Request status is part of R1.** Every request shows where it is, who
holds it and for how long, to the originator, the approvers and the
auditor (§6). This is the tracking FS-494 asks for, and it costs nothing
extra: the engine holds the facts already.

## 2 · Concepts

- **Mandate:** the rules for one *subject type* and *product*: a set of
  amount tiers, each with an ordered chain of steps. Versioned and
  effective-dated (MD-02).
- **Tier:** an amount range, `min` inclusive and `max` exclusive, in
  minor units. The tiers of one mandate cover zero to unbounded with no
  gap and no overlap, checked on save (MD-01).
- **Step:** a role and a type. `sequential` needs one eligible person;
  `quorum` needs N approvals from distinct members of a role (MD-09).
- **Flag rule:** a flag raised on a request (an override of the assessed
  limit, MF-06) appends the flag's authority role as the last step,
  whatever the tier (MD-07). A flagged loan cannot leave through a
  one-approver tier.
- **Request:** one act awaiting approval: its subject (a Fineract loan
  application id), amount, product, flags, originator, and the chain
  frozen onto it at submission (MD-03).
- **Decision:** one person's approve, decline or return on one step, with
  a comment, the time, and how they authenticated (MD-05, MD-10).

## 3 · Data model

The engine keeps its own PostgreSQL schema in each institution's
instance (architecture §9). Decisions and request history are append-only:
the database role the service runs as cannot update or delete them.

**mandate**

| Field | Type | Notes |
|---|---|---|
| id | uuid | |
| subject_type | text | `loan.application`, `loan.disbursement`, `loan.restructure` (FS-516), `mandate.change`, `kyc.manual_verification` (the manual identity route, FS-547; docs/journeys/manual-identity-check.md), `payment.reversal` and `payment.recall` (a reversal or recall of a sent instruction, rails RL-01, FS-587); later `bill.payment` |
| product_code | text | The Fineract product short name, or `*` |
| version | int | Increments on every change |
| effective_from | timestamptz | Africa/Nairobi in the UI, UTC stored |
| effective_to | timestamptz, null | Set when superseded |
| state | enum | `draft`, `pending_approval`, `active`, `retired` |
| change_request_id | uuid | The request that approved this version |

**tier**: `mandate_id`, `min_minor` (bigint), `max_minor` (bigint, null
for unbounded), `currency` (KES).

**step_def**: `tier_id`, `seq` (int), `type` (`sequential` or `quorum`),
`role` (Keycloak group path), `quorum_n` (int, null), `unanimous`
(bool), `moves_money` (bool), `sla_hours` (int, null), `escalate_after_hours`
(int, null), `escalate_to_role` (text, null).

**flag_rule**: `mandate_id`, `flag` (e.g. `limit_override`),
`authority_role`.

**request**

| Field | Type | Notes |
|---|---|---|
| id | uuid | Also the trace id carried on every event (architecture §6) |
| subject_type, subject_ref | text | e.g. `loan.application`, the Fineract loan id |
| product_code | text | |
| amount_minor, currency | bigint, text | |
| flags | text[] | |
| originator_sub | text | Keycloak subject id |
| summary | jsonb | What approvers see; no Restricted data (§8) |
| mandate_id, mandate_version | uuid, int | What was resolved |
| chain | jsonb | The frozen steps, as resolved |
| state | enum | §5 |
| current_seq | int | |
| idempotency_key | text | Unique per subject; a resubmission is a new key |
| created_at, closed_at | timestamptz | |

**step_instance**: `request_id`, `seq`, `opened_at`, `closed_at`,
`state`, `eligible` (the people who held the role when the step opened,
frozen for quorum steps), `due_at`, `escalated_at`.

**decision**: `id`, `request_id`, `seq`, `actor_sub`, `actor_roles`,
`decision` (`approve`, `decline`, `return`), `comment`, `decided_at`,
`acr` (authentication level), `auth_time`, `channel` (`console`,
`email`, `app`), `event_id` (the signed traceability event, RO-24).

## 4 · Rules

Each rule has a test in §11.

1. **Resolution.** On submission the engine finds the active mandate
   for subject type and product (falling back to `*`), picks the tier by
   amount, appends any flag authorities, and freezes the result on the
   request. A later mandate change never alters it (MD-03).
2. **The originator never decides** any step of their own request
   (RC-13).
3. **No one person decides two consecutive steps**, even holding both
   roles (MD-06). In a quorum step a person counts once.
4. **Unfillable chains are refused at submission.** If the frozen chain
   cannot be completed by distinct eligible people under rules 2 and 3,
   the request is not created, and the originator is told which step
   lacks people. Small teams find this out before a loan waits, not
   after.
5. **Sequential step:** one eligible approve completes it; one decline
   ends the request; one return sends it back.
6. **Quorum step:** completes when `quorum_n` distinct eligible members
   approve. With `unanimous`, every member of the role must approve:
   `quorum_n` is the number of members when the step opens, any decline
   ends the request, and a member barred by rule 2 or 3 makes the chain
   unfillable (rule 4) rather than shrinking the committee. Without it, the request
   is declined as soon as the approvals still possible fall below
   `quorum_n`. A member can change their vote only until the step
   closes; every vote is kept in the history.
7. **Return for revision** goes back to the originator, who may edit and
   resubmit. The chain resets from the returned step: votes in that step
   no longer count, earlier steps stand (FR-6.6). A resubmission with a
   changed amount or product is a new request, resolved afresh.
8. **Membership changes.** People are resolved from Keycloak when a step
   opens (MD-04). A quorum step's eligible set is then frozen. Someone
   who loses the role can no longer vote; if the quorum can no longer be
   reached, the step is *stalled* and escalates to the institution
   admin, who may re-open it with the current members. Votes from members
   still eligible stand.
9. **Withdrawal.** The originator may withdraw a request until it is
   approved.
10. **SLAs** (MD-08). When a step passes `sla_hours`, its approvers are
    reminded through messaging; past `escalate_after_hours` the step is
    shown to `escalate_to_role` as well. Escalation never decides, and
    never removes the original approvers.
11. **Configuration changes need a second person** (FS-144, RC-31). A
    new mandate version is itself a `mandate.change` request. Its own
    mandate has a floor the engine enforces: at least two steps, distinct
    administrators, so no one person can rewrite the chains. The first
    version is set at installation by Dibon and confirmed by the
    institution in writing.
12. **Step-up for money** (MD-10). A decision on a step marked
    `moves_money` is accepted only with a fresh step-up (AC-05): a time-
    based one-time code (RC-32) no older than 5 minutes. The engine reads
    `acr` and `auth_time` from the token; a session login is not enough.

**Roan Capital in R1** (RC-12, RC-16), all configuration:

| Tier (KES) | Steps |
|---|---|
| 0 to the threshold | Credit Officer (not the originator); then the Business Credit Committee, quorum 3 of 3, unanimous |
| The threshold and above | The same, then the Head Office Committee |
| Any tier, flagged `limit_override` | Then the override authority, last |

## 5 · States

```
  request
  -------
  submitted --> in_progress --+--> approved   (all steps complete)
                  |   ^       +--> declined   (a decline, or quorum lost)
                  |   |       +--> withdrawn  (by the originator)
                  v   |
               returned --- resubmitted (same request, same chain)

  step
  ----
  waiting --> open --+--> complete
                |    +--> declined
                |    +--> returned
                +--> stalled --> open  (admin re-opens; rule 8)
                |
                +-- past SLA: reminded; past threshold: escalated
                    (flags on an open step, not states)
```

## 6 · Interfaces

**REST** (internal to the instance; called by Kapu MFI, the console and
the email landing page; OAuth 2 tokens from Keycloak, AC-01):

| Method and path | Purpose |
|---|---|
| `POST /v1/mandates` | Create a draft version |
| `PUT /v1/mandates/{id}` | Edit a draft; tiers checked on save |
| `POST /v1/mandates/{id}/submit` | Open its `mandate.change` request |
| `GET /v1/mandates?subject_type=&product=&at=` | The version in force at a time |
| `POST /v1/requests/preview` | Resolve without creating: shows the chain, or why it is unfillable |
| `POST /v1/requests` | Submit: subject, amount, product, flags, summary, idempotency key |
| `GET /v1/requests/{id}` | State, frozen chain, current step, who holds it, time in step, due time |
| `GET /v1/requests?state=&assignee=me&subject_ref=` | Queues: mine to decide, mine submitted, overdue |
| `GET /v1/requests/{id}/history` | Every event, decision and reminder, in order |
| `POST /v1/requests/{id}/steps/{seq}/decisions` | Decide: approve, decline or return, with a comment; step-up checked |
| `POST /v1/requests/{id}/resubmit` | After a return |
| `POST /v1/requests/{id}/withdraw` | By the originator |
| `POST /v1/steps/{request_id}/{seq}/reopen` | Admin, for a stalled step |

**Events** on Kafka, as CloudEvents, each signed with the service's
SPIFFE identity and hash-chained per request (architecture §6, RO-23,
RO-24). Names proposed, to align with the lender-rules spec:
`kapu.mandates.request.submitted`, `kapu.mandates.step.opened`,
`kapu.mandates.decision.recorded`, `kapu.mandates.step.completed`,
`kapu.mandates.step.stalled`, `kapu.mandates.sla.breached`,
`kapu.mandates.step.escalated`, `kapu.mandates.request.approved`,
`kapu.mandates.request.declined`, `kapu.mandates.request.returned`,
`kapu.mandates.request.withdrawn`, `kapu.mandates.mandate.activated`.
Every event carries the request id as the trace id, the subject, and the
mandate version; a decision event also carries the actor, `acr` and
channel. The products act on `request.approved`, never on a decision.

## 7 · Approval from email (MD-18)

1. When a step opens, each eligible approver receives an email (messaging
   MS-01) with the summary, the amount, the step, the due time and one
   link. Outlook actionable messages and Gmail can show it as a button.
2. The link carries a token signed by the engine with a key held in
   OpenBao's transit engine; the key never leaves OpenBao. The token
   binds the request, the step, the approver's subject id, an expiry and
   a nonce. For anything that moves money, the request also carries a hash
   of its content (amount, currency, payee name, account or number, rail,
   reference), shown to the approver and recorded with the decision; rails
   send only an instruction whose hash matches, and a change re-opens
   approval (rails RL-01, FS-588).
3. Opening the link checks the signature, the expiry, that the step is
   still open, and that the nonce is unused; the nonce is then spent.
4. **Anything that moves money:** the page signs the approver in through
   Keycloak as that person, then asks for the one-time code (AC-05). A
   forwarded link is useless to anyone else: they cannot sign in as the
   approver. The token only opens the page; it never decides.
5. **One click** is allowed only on a step marked `moves_money = false`,
   only if the institution turns it on (off by default), and with a
   token valid for at most 4 hours. Its decisions are recorded with
   `acr = email-link`, so they are visibly weaker.
6. **Never by reply.** Replies to the notification address are not
   read for decisions; an auto-answer says so.
7. Money links expire after 24 hours or when the step closes, whichever
   is first; the approver can ask for a new one from the console.
8. Logged: email sent, link opened (time, IP, user agent), sign-in,
   step-up, decision. A spent or expired nonce presented again is a
   security event (SE-18).

## 8 · Security and audit

- **Attribution at the act.** Every decision records who, when, how they
  authenticated and through which channel (architecture §7).
- **Append-only.** Decisions, history and versions are never updated or
  deleted; a correction is a new record. Each request's events are
  hash-chained (RO-24), so a change shows.
- **No path around the engine.** Staff hold no Fineract permission to
  approve or disburse a loan; only the Kapu MFI service account does, and
  it acts only on `request.approved` (§9).
- **What goes into an email:** request reference, product, amount, step
  and due time. No names, national ID numbers, statements or documents:
  an email sent through Microsoft or Google leaves Kenya (Data Protection
  Act s.48), and notifications carry links only (architecture §7,
  FS-532).
- **Rate limits** on decisions and on link opening, per person and per
  source address. Five failed codes lock step-up for that person for 15
  minutes and raise a security event.
- **Restricted data never in a log** (SE-18): codes, tokens and nonces
  are not logged; their hashes are.

## 9 · Fineract, for R1

**Recommendation: the engine decides; Fineract records.** Fineract has
its own maker-checker, which can hold a command until a second user
checks it (to confirm against Fineract). Running both would put two
approval records side by side that can disagree. So:

1. Kapu MFI creates the loan application in Fineract (state: submitted
   and pending approval) and submits a request to the engine with the
   Fineract loan id as subject.
2. Approvers decide in the engine: console, email or app.
3. On `request.approved`, Kapu MFI calls Fineract's approve command with
   the service account, putting the engine's request id in the note or
   an external id (to confirm against Fineract).
4. On `request.declined`, Kapu MFI calls Fineract's reject command; on a
   withdrawal, its withdraw command (to confirm against Fineract).
5. Fineract's own maker-checker stays off for the commands the engine
   governs, and staff roles in Fineract lose the approve, reject and
   disburse permissions (permission codes to confirm against Fineract).
6. Disbursement (MF-11) is a second request, `loan.disbursement`, with
   its own maker-checker chain. On approval, Kapu MFI pays through the
   rail (RL-03 or RL-07) and posts the disbursal to Fineract when the
   rail confirms.
7. A nightly comparison lists any Fineract loan approved or disbursed
   without an approved request (reconciliation RO-02). There should be
   none; one is an incident.

## 10 · Beyond R1: bill payments (FS-494)

Supplier bills from Odoo or Zoho will be a subject type, `bill.payment`
(mandates MD-19, phase 2), with a chain by amount tier like any other.
Two rules matter more for bills than for loans: a supplier whose bank or
M-Pesa details are new or changed in the last 30 days adds a second
approver, since changed details are how invoice fraud works; and an
approved bill is paid only for the approved amount, to the approved
payee, so a change to either re-opens approval.

**Payment triggers** (MD-20, phase 2): once a bill is approved, payment
can follow automatically, on approval, on the due date, or in the next
scheduled batch, through SME Recon's payment execution (SR-11), with the
outcome written back (SR-12). Automatic means *after* approval, never
instead of it. The one exception is a standing approval: a recurring
bill (rent, a subscription) approved once with a payee, a cap per
payment and an end date, which pays within those limits until it ends or
is revoked.

## 11 · Acceptance tests

1. **MD-01:** given tiers 0 to 100,000 and 100,001 upward, when saved,
   then the gap is refused.
2. **MD-01:** given a product with tiers 0 to 500,000 and 500,000
   upward, when a 500,000 request is submitted, then the upper tier
   applies (`max` exclusive).
3. **MD-03:** given a request in progress, when the mandate gains a
   step, then the request's chain is unchanged and a new request gets the
   new step.
4. **MD-02, rule 11:** given an admin edits a mandate, when they submit
   it, then it stays inactive until a second admin approves; when the
   same admin tries to approve, then it is refused.
5. **RC-13, rule 2:** given a Credit Officer submits an application,
   when they try to decide the Credit Officer step, then it is refused.
6. **MD-06, rule 3:** given a person in both the Credit Officer role and
   the committee, when they approve step 1, then they cannot vote in
   step 2.
7. **Rule 4:** given a committee of three, one of whom is the originator,
   when a 3-of-3 request is previewed, then it is reported unfillable and
   not created.
8. **MD-09, RC-12:** given the committee step open with three members,
   when two approve, then the step stays open; when the third approves,
   then the step completes.
9. **MD-09:** given two approvals, when the third member declines, then
   the request is declined and the loan is rejected in Fineract.
10. **Rule 7:** given a member returns the request, when the originator
    resubmits, then the committee step opens again with no votes counted
    and the Credit Officer's approval stands.
11. **RC-12:** given an amount at the threshold, when submitted, then the
    chain ends with the Head Office Committee; one shilling below, it
    does not.
12. **MD-07:** given a flagged `limit_override` request in the lowest
    tier, when resolved, then the override authority is the last step.
13. **Rule 8:** given a committee member removed from the group mid-step,
    when the quorum can no longer be reached, then the step is stalled
    and the admin is told; re-opened, the remaining votes stand.
14. **MD-08:** given an SLA of 24 hours, when it passes, then the
    approvers are reminded; at the escalation threshold, the escalation
    role sees the request too and the approvers remain.
15. **MD-10, RC-32:** given a session but no step-up in 5 minutes, when
    an approver decides a money step, then it is refused and step-up
    asked for.
16. **MD-18:** given an email link, when it is opened a second time,
    then it is refused and a security event raised.
17. **MD-18:** given a forwarded link, when another person opens it,
    then they cannot sign in as the approver and nothing is decided.
18. **MD-18:** given a reply to the notification email, then no decision
    is recorded and the sender is told to use the link.
19. **§9:** given a staff user with Fineract access, when they try to
    approve a loan in Fineract directly, then Fineract refuses it.
20. **§9:** given a loan approved in Fineract without an approved
    request, when the nightly comparison runs, then an exception is
    raised.
21. **RO-24:** given a request's decisions, when any stored decision is
    altered, then the hash chain no longer verifies.
22. **FS-494:** given a request in progress, when the originator opens
    it, then they see the current step, who holds it, how long it has
    waited and when it is due.

## 12 · Open questions

1. **Where roles come from:** decided, Keycloak groups (FS-498). Left
   here so the numbering of the other questions holds.
2. **Roan Capital's role list** (RC-34, open answer 7), and who
   originates: if the Credit Officer originates, rule 2 means a second
   Credit Officer reviews.
3. **The Head Office Committee:** its members, its quorum and the
   threshold (RC-12, RC-16).
4. **The override authority** for `limit_override` at Roan Capital
   (MF-06).
5. **SLAs and escalation roles** per step.
6. **Borrower names in emails:** decided: never (FS-532).
7. **One-click** for non-money steps: wanted at all?
8. **Fineract:** the approve, reject, withdraw and disburse commands,
   their permission codes, where an external reference can go, and how
   its own maker-checker is turned off per command.
