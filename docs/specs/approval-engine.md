---
id: approval-engine
name: Approval engine — build specification
kind: spec
type: build
status: draft
law: LR-17
released: 2026.10.16
release: R1
implements: [mandates]
depends_on: [kapu-core-fineract, access-keycloak, event-bus-kafka]
used_by: [recon, staff-workspace, lending-service, deposits-service, kapu-console, product-versions]
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-492, FS-494, FS-495, FS-498, FS-516, FS-532, FS-547, FS-586, FS-587, FS-588, FS-606, FS-622, FS-625, FS-627, FS-642, FS-661, FS-667, FS-769, FS-770, FS-792, FS-793, FS-802, FS-965, FS-983, FS-1018, FS-1032, FS-1053, FS-1054, FS-1056, FS-1058]
last_reviewed: 2026-10-30
---

# Approval engine — build specification

How the signing side of the mandates module (docs/modules/mandates.md) is
designed to be built for R1, Roan Capital's pilot. The source is the MFI
PRD, FR-6 (sources/kapu), and Roan Capital's delivery map
(docs/customers/roan-capital.md). Nothing here is built; every behaviour
is **designed**. Fineract's side is in docs/specs/kapu-core-fineract.md, settled from
its documentation (FS-625); what only a running instance can show is that
spec's §12.

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

**Where it sits.**

```
  approvers: in the Kapu Console, by email link, in the app
        |
        v
  +---------------------+  roles, step-up      +---------------------+
  | APPROVAL ENGINE     |--------------------->| ACCESS              |
  | decides             |                      | signs in, steps up  |
  | [kapu_service]      |                      | [keycloak]          |
  +---------------------+                      +---------------------+
     ^ request    | approved, declined
     |            v
  +---------------------+  approve, reject,    +---------------------+      +---------------------+
  | LENDING SERVICE     |--------------------->| CORE ADAPTER        |----->| KAPU CORE           |
  | asks, then acts     |  disburse            | posts to the core   |      | records             |
  | [kapu_service]      |                      | [kapu_service]      |      | [apache_fineract]   |
  +---------------------+                      +---------------------+      +---------------------+
```

**Related:** implements [mandates](../modules/mandates.md); depends on
[kapu-core-fineract](kapu-core-fineract.md),
[access-keycloak](access-keycloak.md) and [event-bus-kafka](event-bus-kafka.md); used by [kapu-console](kapu-console.md), [deposits-service](deposits-service.md), [lending-service](lending-service.md), [recon](recon.md), which compares approvals with the ledger (rails, to write, will be too), and [staff-workspace](staff-workspace.md), where staff decide; journeys
[JN-02](../journeys/manual-identity-check.md),
[JN-04](../journeys/loan-to-disbursement.md),
[JN-05](../journeys/guarantor.md) and
[JN-06](../journeys/restructuring.md); product versions are approved here ([product-versions](product-versions.md)).

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

The engine keeps its own PostgreSQL database in each institution's
instance (architecture §9). Decisions and request history are append-only:
the database role the service runs as cannot update or delete them.

**mandate**

| Field | Type | Notes |
|---|---|---|
| id | uuid | |
| subject_type | text | `loan.application`, `loan.disbursement`, `loan.restructure` (FS-516), `mandate.change`, `product.version` (a product version document, decided by two people, then held until CBK's letter is recorded; product-versions, FS-802), `access.role.change` (a role granted or removed, decided by a second person at step-up; access-keycloak §6, FS-642; raised automatically from a job position's role set, and carrying the date it takes effect, FS-770), `manual.act` (a payout or approval made by hand while the platform was down, approved afterwards by the institution's approvers so the nightly comparison can explain it; FS-661), `kyc.manual_verification` (the manual identity route, FS-547; docs/journeys/manual-identity-check.md), `payment.reversal` and `payment.recall` (a reversal or recall of a sent instruction, rails RL-01, FS-587), `guarantee.demand` (a demand to a guarantor, only after the notice and the recovery from the borrower, mfi MF-37, FS-622); later `bill.payment` and `payroll.run` (a month's payroll and its remittances, business-suite BS-19, FS-606) |
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

Each rule has a test in §14.

1. **Resolution.** On submission the engine finds the active mandate
   for subject type and product (falling back to `*`), picks the tier by
   amount, appends any flag authorities, and freezes the result on the
   request. A later mandate change never alters it (MD-03).
2. **The originator never decides** any step of their own request, nor
   does anyone who is, by ID number across realms, the borrower, a
   guarantor or an officer of the business the request is for (ID-26,
   FS-1018) (RC-13).
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
   still eligible stand. **A role left too thin is caught first**
   (FS-769, JN-18): every `access.role.change` that removes someone, and
   every exit, is checked against the active mandate steps that name the
   role; where the holders left would be fewer than a quorum step's N, or
   than its whole membership when unanimous, or no one eligible for a
   sequential step once MD-06 is applied, the approver of a move sees a
   warning naming the steps before deciding. An exit is never held back:
   the administrator and the manager are told at once, and the role shows
   as short in the administrator's view until filled. The same check runs
   nightly.
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

**REST** (internal to the instance; called by the lending service, the console and
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
RO-24). Names from the event bus catalogue (event-bus-kafka §5):
`kapu.mandates.request.submitted`, `kapu.mandates.step.opened`,
`kapu.mandates.decision.recorded`, `kapu.mandates.step.completed`,
`kapu.mandates.step.stalled`, `kapu.mandates.sla.breached`,
`kapu.mandates.step.escalated`, `kapu.mandates.request.approved`,
`kapu.mandates.request.declined`, `kapu.mandates.request.returned`,
`kapu.mandates.request.withdrawn`, `kapu.mandates.mandate.activated`.
Every event carries the request id as the trace id, the subject, and the
mandate version; a decision event also carries the actor, `acr` and
channel. The products act on `kapu.mandates.request.approved`, never on a
decision.

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
  approve or disburse a loan; only the lending service's account does, and
  it acts only on `kapu.mandates.request.approved` (§9).
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
checks it: a global setting, then one per permission (kapu-core-fineract §4). Running both would put two
approval records side by side that can disagree. So:

1. The lending service creates the loan application in Fineract (state: submitted
   and pending approval) and submits a request to the engine with the
   Fineract loan id as subject. The loan carries our application id as
   its external id (kapu-core-fineract §5).
2. Approvers decide in the engine: console, email or app.
3. On `kapu.mandates.request.approved`, the lending service calls Fineract's approve
   command; on `kapu.mandates.request.declined`, its reject command; on a
   withdrawal, its withdraw command. Fineract's own maker-checker stays
   off for these, and staff roles hold none of their permissions. The
   commands, permission codes and the request id's place are in
   kapu-core-fineract §4 and §5.
4. Disbursement (MF-11) is a second request, `loan.disbursement`, with
   its own maker-checker chain. On approval, the lending service pays through the
   rail (RL-03 or RL-07) and posts the disbursal to Fineract when the
   rail confirms.
5. A nightly comparison lists any Fineract loan approved or disbursed
   without an approved request (reconciliation RO-02). There should be
   none; one is an incident. Recon runs it and raises it (recon §8); the
   engine stays the authority.

## 10 · Beyond R1: bill payments (FS-494)

Supplier bills, and payment once a bill is approved, are phase 2 and
designed in the mandates module (MD-19, MD-20; FS-1058): a subject type,
`bill.payment`, with a chain by amount tier like any other; nothing in
R1 depends on them.

## 11 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| Requests: subject, amount, product, flags, the frozen chain | Confidential | As long as the record they authorise: seven years after the loan closes (docs/documents.md) | The subject's reference only, never a borrower's name |
| Decisions: who, when, how they authenticated, the comment, the step-up token's hash | Confidential | The same | Approvers' identities, as staff data (docs/privacy.md) |
| Mandates and their versions | Internal | Always, versioned | — |

## 12 · Quality and metrics

- **Tier 1** (approvals), recovered as docs/architecture/quality.md sets.
- **A decision recorded within a second** at the 95th percentile, the
  step-up itself excluded; an approval email within a minute of a step
  opening (proposed).
- **Metrics:** requests open by step and age; time in step; SLA breaches;
  step-up failures and lockouts; decisions per approver; the nightly
  comparison's result.
- **Alerts** (observability-grafana §4): the comparison finding an
  unapproved act (severity 1); lockouts spiking (2); SLA breaches (3).

## 13 · Threats

STRIDE for security, LINDDUN for privacy (platform-security SE-16):

| Threat | For example | The answer |
|---|---|---|
| Spoofing | Someone decides in an approver's open session | Step-up at level 3 at each decision, bound to the request and its hash (access-keycloak §7) |
| Tampering | The request changed after approval | The chain frozen at submission (MD-03); the content hash bound to the approval; rails refuse an instruction whose hash differs (RL-01) |
| Repudiation | "I never approved that" | Each decision carries its step-up record; events signed and chained (RO-23, RO-24) |
| Information disclosure | An approval email reveals a borrower | Emails carry reference, product, amount and step only (§8); links single-use |
| Denial of service | Requests or link openings flooded | Rate limits per person and source (§8); SLA alerts |
| Elevation of privilege | An approver grants themselves a role | Roles only through an approved `access.role.change`; no self-approval (MD-06); no Dibon role in any chain (FS-588) |
| Linkability (privacy) | An approver's activity profiled | Decision history read by role; reports aggregate |

## 14 · Acceptance tests

| # | Given | When | Then | Id, source |
|---|---|---|---|---|
| A1 | Tiers 0 to 100,000 and 100,001 upward | Saved | The gap is refused | MD-01 |
| A2 | Tiers 0 to 500,000 and 500,000 upward | A 500,000 request is submitted | The upper tier applies (`max` exclusive) | MD-01 |
| A3 | A request in progress | The mandate gains a step | The request's chain is unchanged; a new request gets the new step | MD-03 |
| A4 | An admin edits a mandate | They submit it; then they try to approve it | It stays inactive until a second admin approves; their own approval is refused | MD-02, rule 11 |
| A5 | A Credit Officer submits an application | They try to decide the Credit Officer step | Refused | RC-13, rule 2 |
| A6 | A person in both the Credit Officer role and the committee | They approve step 1 | They cannot vote in step 2 | MD-06, rule 3 |
| A7 | A committee of three, one of them the originator | A 3-of-3 request is previewed | Reported unfillable, and not created | Rule 4 |
| A8 | The committee step open with three members | Two approve; then the third | The step stays open; then completes | MD-09, RC-12 |
| A9 | Two approvals | The third member declines | The request is declined and the loan rejected in Fineract | MD-09 |
| A10 | A member returns the request | The originator resubmits | The committee step opens again with no votes counted; the Credit Officer's approval stands | Rule 7 |
| A11 | An amount at the threshold; one shilling below | Submitted | The chain ends with the Head Office Committee; below, it does not | RC-12 |
| A12 | A flagged `limit_override` request in the lowest tier | Resolved | The override authority is the last step | MD-07 |
| A13 | A committee member removed mid-step | The quorum can no longer be reached | The step is stalled and the admin told; reopened, the remaining votes stand | Rule 8 |
| A14 | An SLA of 24 hours | It passes; then the escalation threshold | Approvers reminded; then the escalation role sees it too, and the approvers remain | MD-08 |
| A15 | A session but no step-up in 5 minutes | An approver decides a money step | Refused; step-up asked for | MD-10, RC-32 |
| A16 | An email link | Opened a second time | Refused; a security event raised | MD-18 |
| A17 | A forwarded link | Another person opens it | They cannot sign in as the approver; nothing is decided | MD-18 |
| A18 | A reply to the notification email | Received | No decision recorded; the sender told to use the link | MD-18 |
| A19 | A staff user with Fineract access | They try to approve a loan in Fineract directly | Fineract refuses it | §9 |
| A20 | A loan approved in Fineract without an approved request | The nightly comparison runs | An exception is raised | §9 |
| A21 | A request's decisions | Any stored decision is altered | The hash chain no longer verifies | RO-24 |
| A22 | A request in progress | The originator opens it | They see the current step, who holds it, how long it has waited and when it is due | FS-494 |
| A23 | A three-member unanimous committee | One member's exit is recorded | The exit goes ahead; the administrator and the manager are told the committee is short; a move of a second member warns its approver first | Rule 8, FS-769 |
| A24 | A joiner recorded on Wednesday, starting Monday | Their position's roles are approved on Friday | The roles are mapped on Monday, not before; the joiner is told by email (T42) | access-keycloak §6, FS-770 |

## 15 · Open questions

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

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-17](../law/LR-17.md) The Data Protection Act (Cap. 411C).** Regulator: Office of the Data Protection Commissioner. Made under: An Act of Parliament. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2019/24/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 48 | s. 48 | Personal data transferred out of Kenya only with proof of appropriate safeguards given to the Data Commissioner, or where the transfer is necessary on a ground the section lists |
