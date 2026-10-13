---
id: lender-rules
name: Lender rules — build specification
kind: spec
type: build
status: draft
release: R1
implements: [mfi]
depends_on: [kapu-core-fineract, messaging, event-bus-kafka]
used_by: [end-of-day-runner, recon]
version: 0.2.0
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-492, FS-531, FS-565, FS-625, FS-627, FS-629, FS-648, FS-667, FS-744, FS-763, FS-764, FS-792, FS-793]
last_reviewed: 2026-10-13
---

# Lender rules — build specification

How Kapu MFI on Kapu Core (Apache Fineract) is designed to apply the CBK
Non-Deposit Taking Credit Providers Regulations 2026 (law register LR-03)
to Roan Capital's loans in R1. Nothing here is built; every behaviour is
**designed**. Fineract's side is in docs/specs/kapu-core-fineract.md, settled from
its documentation (FS-625); what only a running instance can show is that
spec's §9.

## 1 · Purpose and scope

| Id | Rule | Regulation | In R1 |
|---|---|---|---|
| MF-21 | Arrears cap (in duplum for lenders) | reg 29 | Yes |
| MF-22 | Repayment order, credit on the day paid, early repayment | reg 56 | Yes |
| MF-23 | Pricing model, APR, key information document | regs 48, 59 | Yes |
| MF-24 | Price changes: CBK approval, notice, acceptance | reg 55 | Yes |
| MF-25 | Non-performing classification | reg 57 | Yes |
| MF-26 | Collection conduct in messages | reg 30 | Yes |
| MF-27 | Bureau floor and pre-listing notice | reg 33 | No: phase 2, with CRB submission (MF-19) in R5; R1 keeps the data it needs |
| MF-28 | Complaints clock | reg 40 | Yes |
| MF-37 | Guarantors: consent, statements, notice, recourse last | regs 39(3), 42 | Yes; rules in the module row, design to add here (FS-531) |
| MF-38 | Borrower access: receipts, status, statements by link | reg 39(1) | Yes; rules in the module row, design to add here (FS-531) |
| MF-29 | Automated decisions explained, AI disclosed | reg 60 | No: Roan Capital has no automated lending decisions in R1, vetting stays human (MFI §7). It applies once a score or AI system takes part in a decision |

**Also out of R1:** court-ordered interest (reg 29(4)), handled by a flag and a manual
step; recovery of land security (reg 30(3)), which waits on MF-18.

**One component owns the rules:** the *lender-rules service* in the Kapu
MFI service layer. Fineract stays the system of record for loans,
schedules and balances (KC-04). The service decides what Fineract may
post and corrects what it should not hold. Fineract does not apply the
in duplum rule itself.

**Where it sits** (inside Kapu MFI's service layer, not a product of its
own: FS-629).

```
  +---------------------+
  | END-OF-DAY RUNNER   |
  | closes the day      |
  | [kapu_service]      |
  +---------------------+
        | the day's steps
        v
  +---------------------+  waivers, default interest  +---------------------+
  | LENDER RULES        |---------------------------->| KAPU CORE           |
  | corrects            |<----------------------------| records             |
  | [kapu_service]      |  balances, schedules        | [apache_fineract]   |
  +---------------------+                             +---------------------+
        | templates, hours and recipients checked
        v
  +---------------------+
  | MESSAGING           |
  | sends SMS           |
  | [kapu_service]      |
  +---------------------+
```

**Related:** implements [mfi](../modules/mfi.md); depends on
[kapu-core-fineract](kapu-core-fineract.md),
[messaging](messaging.md) and [event-bus-kafka](event-bus-kafka.md);
used by [end-of-day-runner](end-of-day-runner.md) and [recon](recon.md), whose companion recomputes what the rules produce, independently: written from the regulations and the product's terms, not from this service's code (recon §3, FS-793); journeys
[JN-04](../journeys/loan-to-disbursement.md),
[JN-05](../journeys/guarantor.md) and
[JN-06](../journeys/restructuring.md).

## 2 · The rules

### 2.1 Arrears cap — reg 29, MF-21

**Regulation.** On a non-performing loan the lender recovers at most the
principal owing when it became non-performing, plus contractual interest
not exceeding that principal, plus reasonable recovery expenses (29(2));
if the loan performs and falls back, the limit is set from the last time
it became non-performing (29(3)).

**Behaviour.**

1. When a loan becomes non-performing (2.5), the service opens a *cap
   episode*: `P_npl`, the principal outstanding at that moment, and the
   *bucket*, which opens at all interest, fees, penalties and charges
   then unpaid.
2. Every interest accrual, penalty and charge posted during the episode
   adds to the bucket, whether later paid or not. The bucket never
   exceeds `P_npl`.
3. Fees and penalties count in the bucket, not only interest: the
   regulations' definition of "charges" includes interest and fees, and
   29(2) has no separate allowance for them. This is the cautious reading
   (open question 1).
4. Recovery expenses (29(2)(c)) sit outside the bucket, only as a
   `recovery-expense` charge with a receipt, maker-checker approval
   (KC-08) and a contract clause disclosing it (reg 30(2)).
5. Repayments follow reg 56 (2.2). They do not change `P_npl`.
6. **Reset (29(3)).** Returning to performing closes the episode; a new
   one opens if the loan falls back, from the principal and unpaid
   charges at that moment.
7. **Court orders (29(4)).** Interest a court awards after its order is
   not capped; the flag is set manually under maker-checker.

**Where enforced.**

| Concern | Fineract | Service layer |
|---|---|---|
| Interest on non-performing loans | Product's non-performing setting; Fineract stops accruing income on a non-performing loan (kapu-core-fineract §4) | Recomputes the bucket daily regardless |
| Roan's 1% a day default interest | Not set up as a Fineract overdue charge for capped products | Posted daily as a dated charge of `min(daily amount, room)` |
| Anything else over the cap | — | Same-day waiver of the excess (Fineract's waive-interest or waive-charge command, kapu-core-fineract §5) |
| Write-off | Fineract write-off | Only on a credit decision to stop recovery, never as the cap mechanism |

Waiving is preferred to write-off: the statement shows only what may
lawfully be collected, and income reports (MF-15) show the amount waived.

**Data.** Per episode: opened at, `P_npl`, opening bucket, bucket, room,
closed at and why. Per posting: amount, type, capped or waived.

**Edge cases.** A backdated repayment re-ages the schedule: the service
re-runs the cap for that loan on posting. A rollover or restructure
(MF-09) inherits the open episode, and capitalised interest never enters
a new `P_npl` (open question 2).

### 2.2 Repayment order — reg 56, MF-22

**Regulation.** A repayment is credited on the date paid and applied to
due principal, then fees and charges, then interest (56(1), (2)); the
borrower may repay early, in whole or part, without notice or penalty,
and on full early repayment owes no interest for the rest of the term
(56(3), (4)).

**Behaviour.**

- Fineract's transaction date is the date the money was paid (M-Pesa or
  bank value date, Africa/Nairobi), not the posting date.
- Allocation, oldest instalment first: due principal, then fees and
  penalties, then interest. This replaces MF-08's configurable order for
  lenders.
- Money beyond what is due reduces outstanding principal.
- Payoff = outstanding principal + fees due + interest accrued to the
  payment date. No early-repayment fee may exist on a product.

**Where enforced.** Every loan product uses Fineract's progressive
schedule with advanced payment allocation, whose order is a setting:
past-due principal, fees, penalties, interest; then due; then in advance
(kapu-core-fineract §4). A custom transaction processor, Fineract's
documented extension, is the fallback if check F3 fails. The service
compares every posted breakdown with its own allocation and raises a
mismatch event on any difference. Whether Fineract's payoff drops unearned
interest on flat-rate loans is check F2; if not, the service waives it in
the same posting.

**Edge cases.** Payments during the end-of-day run; reversals (re-run
allocation and the cap); a payment below due principal (all to
principal).

### 2.3 APR and key information document — regs 48, 59; MF-23

**Regulation.** A pricing model with clear, all-inclusive parameters
except third-party costs, and full disclosure of the APR (59); a key
information document summarising each product's benefits, risks and
terms (48). Advertising and the agreement also carry the APR and total
cost of credit (51, 54(4)).

**APR method.** The regulations neither define APR nor prescribe a
method. Proposed: the effective annual rate `i` solving

    sum of advances A_k (1+i)^(-t_k/365)
      = sum of repayments B_j (1+i)^(-s_j/365)

Advances are what the borrower receives, net of fees deducted at
disbursement; repayments are every scheduled principal, interest and
mandatory fee; `t` and `s` are days from disbursement. Default interest
(contingent) and third-party costs passed on at cost (59(2)(f)) are left
out of the APR and shown in the total cost of credit (open question 3).

*Example:* KES 100,000 for 30 days, 10% interest for the term
(illustrative; the rate's unit is Roan open answer 4), a KES 2,000 fee
deducted. Received 98,000, repaid 110,000 on day 30:
APR = (110,000 / 98,000)^(365/30) − 1 ≈ **307.7%** (simple annualised:
149.0%).

**Key information document.** The company name (reg 49); amount and
tenor limits; the periodic rate, monthly or annual, flat or reducing,
fixed or variable (52(3)); APR; total cost of credit with an example;
every fee and when it applies; default interest and the reg 29 cap in
plain words; repayment order and free early repayment; when a loan
becomes non-performing (57(3)); bureau listing and its notice period;
collection conduct; complaint channels and the right to go to CBK
(50(3)).

**Where enforced.** Service layer, from the product configuration
Fineract uses, so the calculator (RC-29) and live loans agree. Generated
per product version, stored with a hash, shown before the agreement is
accepted; the acceptance is recorded on the loan.

### 2.4 Price changes — reg 55, MF-24

**Regulation.** No change to pricing parameters or credit terms without
CBK's prior written approval, then at least 30 days' notice to the
customer, who has accepted (55; also 54(7)).

**Behaviour.**

1. A change is a new **product version**, approved under maker-checker
   (MD-01, MD-02; Roan RC-31).
2. It stays *Awaiting CBK* until CBK's approval is recorded (reference,
   date, letter attached). No approval, no activation.
3. Once active it applies to new loans only: Fineract copies a product's
   terms onto each loan at creation (Roan RC-30).
4. Changing an existing loan is a *variation*: a notice setting out the
   changes (54(8)), effective no earlier than 30 days after delivery and
   only once the borrower's acceptance is recorded; otherwise the loan
   keeps its terms. A rate change reaches a live loan as a reschedule
   request with the new rate from the day it takes effect, within the
   product's range (kapu-core-fineract §6).

### 2.5 Non-performing classification — reg 57, MF-25

**Regulation.** A loan with a specific repayment date is non-performing
when principal or interest stays outstanding after 30 days for a loan
contracted for 30 days or less; after 90 days for a longer loan; or when
a payment is unpaid for the period the agreement specifies (57(1)), a
period the credit policy and agreement must state (57(2), (3)).

**Behaviour.** Daily, per loan: days past due of the oldest unpaid
principal or interest. Non-performing from the first day that exceeds
the threshold: the shorter of the statutory period (30 or 90 days, by
contracted term) and the agreement's default period. Days are counted
from the due date (open question 4). The loan returns to performing when
nothing is past due beyond the threshold, which closes the cap episode.

**Where enforced.** The service is the authority. Fineract's NPA days
are set to match where a product's tenor range sits wholly on one side
of 30 days; a product spanning both is flagged at configuration. Fineract's
flag cannot be set by API: it follows the product's overdue days, and
clears after a re-age, so the service keeps its own (kapu-core-fineract §6).

### 2.6 Collection conduct — reg 30, MF-26

**Regulation.** In collection: no messages to a customer's contacts or
phone book, no shaming or obscene language, no threats, no calls outside
working hours (30(1)); no undisclosed charges (30(2)); 30 days' notice
before selling movable security (30(4)).

**Behaviour.**

- **Recipients.** Collection messages go only to the borrower's verified
  numbers. Guarantors get statements (47(2)), never collection pressure.
  Alternative contacts (50(1)(i)) are excluded from every collection
  template. Phone books are never read.
- **Working hours.** Not defined in the regulations. Proposed default:
  08:00 to 18:00, Monday to Saturday, not public holidays,
  Africa/Nairobi; narrower allowed, never wider (open question 5).
  Messaging's quiet hours (MS-15) hold a collection message until the
  window opens, never dropping it silently. Staff call tasks are hidden
  outside the window; calls are logged.
- **Language.** Collection templates are a separate category, approved
  under maker-checker by a compliance role, linted against a banned-terms
  list (shaming, threats of arrest or publication, telling contacts) and
  versioned. Messaging refuses an unapproved one.
- **Charges and security.** A charge type not in the loan's contract
  snapshot is refused. A vehicle sale is blocked until 30 days after the
  sale notice is delivered.

**Where enforced.** Messaging (MS-15) applies a policy the lender-rules
service supplies. Roan Capital's messages go through Dibon's own
messaging service (RC-20, FS-565), so the checks run in one place.

### 2.7 Bureau floor and notice — reg 33, MF-27 (phase 2)

**Regulation.** No negative listing where KES 1,000 or less is
outstanding (33(3)); notice at least 30 days before listing, or a shorter
contractual period, not under seven days for loans repaid at intervals of
less than 30 days (33(6)); notice within 30 days after listing (33(7)).

**Design for R5.** Submission (crb CR-03, CR-06) drops negative records
at or below KES 1,000 and holds each until its notice period has run with
proof of delivery. R1 records the non-performing dates and notice
evidence now.

### 2.8 Complaints clock — reg 40, MF-28

**Regulation.** Complaints are dealt with promptly; otherwise
acknowledged within seven days (40(3)); an oral complaint unresolved
after 48 hours is confirmed in writing (40(4)); resolved within 30 days
(40(5)); a record kept (40(6)) and reported to CBK (40(7)).

**Behaviour.** Each complaint carries received-at, channel (oral or
written) and three clocks: 48 hours, 7 days, 30 days, counted in calendar
days from the customer's report. It is acknowledged on logging (T16), not
by day 7, and worked to a target of 14 days inside the 30 (owner,
2026-10-12, FS-764); warnings at day 12, for the target, and day 25, and
an overdue event on any breach; the 7-day clock stays as the backstop if
the acknowledgement was not delivered. The record holds
40(6)'s fields: date, nature, status, reason pending, time to resolve,
outcome.

**Where enforced.** Complaints live in Odoo's service desk
(docs/operating-model.md); the service computes the clocks from desk
events, unless the desk's own service-level settings can carry them (to
confirm with the Odoo engineer).

### 2.9 Roan Capital's product under the cap — RC-26, RC-27

Roan Capital's 30-day product charges 1% a day default interest after day
30, with a ladder: reminder day 25, default run days 30 to 40, final
warning days 40 to 47, hard closure day 47 (days from disbursement).

**The ladder** is a collection state the service moves by day, separate
from non-performing status. The day-25 reminder obeys working hours.
**A disputed amount holds it** (MF-39, FS-764): while a complaint about an
amount is open (§2.8), no reminder or ladder action is taken on that
amount; the hold is recorded on the loan and lifts when the complaint
closes. Whether interest accrues on it meanwhile is Roan open answer 23.
Hard closure stops new lending and opens recovery; the cap still runs,
and a vehicle sale still waits for its 30-day notice. Unless the
agreement sets a shorter default period, the loan becomes non-performing
on day 61, more than 30 days past the day-30 due date.

**Worked example** (illustrative: the penalty base, assumed here to be
outstanding principal, and the rate's unit are Roan open answers 3 and 4).
KES 100,000, 10% interest for the term, KES 2,000 fee deducted; nothing
repaid.

| Day | Event | Principal | Bucket | Room |
|---|---|---|---|---|
| 30 | Due: 110,000 unpaid | 100,000 | — | — |
| 31 to 60 | Default interest, 1,000 a day | 100,000 | — | — |
| 61 | Non-performing: `P_npl` 100,000; bucket opens at 10,000 + 30,000 | 100,000 | 40,000 | 60,000 |
| 120 | Bucket reaches the cap | 100,000 | 100,000 | 0 |
| 121 on | Nothing more accrues | 100,000 | 100,000 | 0 |

The most recoverable: 100,000 + 100,000 + reasonable recovery expenses
with receipts (say 7,500 for towing and storage) = **KES 207,500**.
Uncapped, by day 180 it would be KES 260,000 plus expenses. Had the
agreement made the loan non-performing on day 48, the bucket would open
at 27,000 and still reach 100,000 on day 120: with nothing repaid, the
date matters only through the principal.

**With a part payment.** KES 30,000 paid on day 70 goes wholly to
principal (reg 56): principal 70,000, `P_npl` still 100,000. The bucket
is 49,000 at the end of day 69; default interest drops to 700 a day; the
bucket reaches 100,000 on day 142, when 600 is posted instead of 700. If
29(5)'s "outstanding principal amount" means current principal, the limit
is 70,000, reached on day 99 (open question 1).

**Reset.** A longer loan becomes non-performing at principal 100,000
(cap 100,000), clears its arrears, then falls back at principal 60,000:
the new episode's cap is 60,000.

## 3 · Interfaces

**Endpoints** (lender-rules service, internal):

| Endpoint | Purpose |
|---|---|
| `GET /loans/{id}/cap` | Episode: `P_npl`, bucket, room |
| `POST /loans/{id}/charges:check` | Amount of a charge allowed |
| `GET /loans/{id}/payoff?date=` | Early repayment quote |
| `GET /loans/{id}/classification` | Days past due, status, ladder state |
| `GET /products/{id}/versions/{v}/apr` | APR and total cost of credit |
| `GET /products/{id}/versions/{v}/kid` | Key information document |
| `POST /product-changes`, `.../{id}/cbk-approval` | Product version, CBK approval |
| `POST /loans/{id}/variations`, `.../acceptance` | Variation notice, acceptance |
| `GET /policies/collection-messaging` | Working hours, recipients, template rules |
| `POST /complaints/events` | Desk events in, clocks out |

**Kafka events** (CloudEvents, signed per RO-23; names from the event bus
catalogue, event-bus-kafka §5): `kapu.mfi.loan.nonperforming`,
`kapu.mfi.loan.performing`, `kapu.mfi.loan.cap.reached`,
`kapu.mfi.loan.charge.waived`, `kapu.mfi.repayment.allocated`,
`kapu.mfi.repayment.allocation.mismatch`, `kapu.mfi.loan.ladder.changed`,
`kapu.mfi.product.version.activated`, `kapu.mfi.loan.variation.accepted`,
`kapu.messaging.message.blocked` (published by messaging), `kapu.mfi.complaint.pending`, `kapu.mfi.complaint.overdue`.

**End of day** (KC-07), Africa/Nairobi, run by the end-of-day runner after
its checks (end-of-day-runner):

1. Close the day's intake: post repayments dated today; ask M-Pesa Pull
   Transactions (RL-20) for missed confirmations.
2. Fineract's close of business (kapu-core-fineract §7). Its
   overdue-penalty step is not used for capped products.
3. Classification: open or close cap episodes; emit events.
4. Default interest posted by the service, capped at room.
5. Cap sweep: waive any excess over `P_npl` the same day.
6. Ladder states moved; reminders queued for the next working window.
7. Fineract accounting close; snapshots for MF-14 and MF-15;
   reconciliation (RO-02).

A failure stops the later steps for the loans affected and raises an
exception to the accountant's queue (MF-12).

## 4 · Security and audit

- **Its own service account,** which may post only waivers and default
  interest, and read loans (kapu-core-fineract §4).
- **Rule parameters are configuration under maker-checker,**
  effective-dated: rates, the cap's components, working hours, banned
  terms. A pricing change cannot activate without CBK's approval recorded
  (MF-24).
- **Every waiver, default-interest posting and change of classification**
  is a signed event carrying the rule version that produced it (RO-23).
- **No one overrides the cap.** A court-ordered exception is a flag and a
  manual step, approved and recorded.

## 5 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| Cap episodes, classifications, collection stages | Confidential | Seven years after the loan closes (docs/documents.md) | A borrower's repayment conduct (docs/privacy.md) |
| Product versions, CBK approvals, variation notices and acceptances | Confidential | Seven years after the product or loan ends | Acceptances are the borrower's |
| Complaints clocks | Confidential | With the complaint | The complainant's |

## 6 · Quality and metrics

- **Within the night's close:** its steps for 10,000 loans in under 15
  minutes (proposed).
- **The same answer every time:** each result reproducible from the rule
  version and its inputs. The worked examples in §2 and the tests in this
  spec become machine-readable test vectors, kept with the code, that the
  code must pass; allocation and the cap are also tested with generated
  cases (property-based tests).
- **Metrics:** loans by classification and stage; cap episodes open;
  amounts waived; allocation mismatches; messages blocked.
- **Alerts** (observability-grafana §4): an allocation mismatch (2); a
  failed step of the close (end-of-day-runner §6).

## 7 · Threats

| Threat | For example | The answer |
|---|---|---|
| Tampering | A rate or the cap's parameters changed quietly | Maker-checker, effective-dating, CBK's approval recorded; the rule version on every result |
| Repudiation | A borrower disputes a charge | Each posting carries its rule version and inputs; the statement shows what was waived |
| Information disclosure | A collection message reaches a borrower's contact | Recipient rules in messaging; a blocked event (§2.6) |
| Elevation of privilege | Staff waive to favour a borrower | Waivers only by rule, or through an approved request |
| A wrong rule | A defect charges past the cap | Test vectors, generated tests, the same-day sweep, reconciliation |
| Purpose (privacy) | A classification used for something else | Used for the regulation's purposes; decisioning reads it only under its own privacy row (PR-18) |

## 8 · Acceptance tests

| # | Given | When | Then | Id, reg |
|---|---|---|---|---|
| A1 | The worked example in 2.9 | End of day 61 | Episode opens: `P_npl` 100,000, bucket 40,000 before the day's default interest | MF-21, 29(2) |
| A2 | Bucket at 99,500 | Default interest of 1,000 due | 500 posted; cap-reached event | MF-21, 29(2)(b) |
| A3 | Loan at the cap | Recovery expense with receipt and approval | Posted outside the bucket | MF-21, 29(2)(c) |
| A4 | Cured, then non-performing at principal 60,000 | Classification | New episode, cap 60,000 | MF-21, 29(3) |
| A5 | Due: principal 5,000, fees 500, interest 1,000 | 5,200 paid | 5,000 principal, 200 fees, 0 interest | MF-22, 56(2) |
| A6 | Paid 23:40 on day 30 | Posted 06:00 day 31 | Dated day 30; no default interest | MF-22, 56(1) |
| A7 | 30-day flat loan | Repaid in full on day 10 | Interest to day 10 only; no fee | MF-22, 56(3), (4) |
| A8 | The product in 2.3 | APR computed | 307.7% | MF-23, 59(2)(g) |
| A9 | A product version | Document generated | Every item in 2.3; acceptance before disbursement | MF-23, 48 |
| A10 | New version, no CBK approval | Activation | Refused | MF-24, 55(1) |
| A11 | Variation notice delivered day 0 | Accepted day 5 | Effective day 30 | MF-24, 55(2) |
| A12 | 30-day loan due day 30, unpaid | Days 60 and 61 | Performing, then non-performing | MF-25, 57(1)(a) |
| A13 | 6-month loan | 90, then 91 days past due | Performing, then non-performing | MF-25, 57(1)(b) |
| A14 | Collection reminder at 19:30 | Messaging processes it | Held to 08:00 next working day | MF-26, 30(1)(i) |
| A15 | Collection template to an alternative contact | Send | Refused; blocked event | MF-26, 30(1)(c), (e) |
| A16 | Template with a banned term | Approval | Refused | MF-26, 30(1)(b) |
| A17 | Written complaint, unresolved | Day 7 with no acknowledgement | Overdue event | MF-28, 40(3) |
| A18 | Oral complaint | 48 hours unresolved | Pending event; written confirmation sent (messaging T41) | MF-28, 40(4) |
| A19 | Complaint logged | Day 12 with no outcome | Target warning to the handler | MF-28 (FS-764) |
| A20 | KES 5,000 of the day-30 amount disputed in an open complaint | Day 30 default run | No default-run message or action on the KES 5,000; the rest proceeds; the hold recorded | MF-39, MF-28 |

## 9 · Open questions

**For counsel** (docs/legal-questions.md, with what is designed
meanwhile):

1. What counts within reg 29's cap, and on which principal: LQ-01.
2. Whether the cap carries over a rollover or restructure: LQ-02.
3. The effective annual rate as the APR; insurance as a third-party
   cost: LQ-03.
4. Reg 57's thirty days, counted from the due date: LQ-04.
5. Reg 30's working hours: LQ-05.

**For Roan Capital:**

6. The interest rate's unit and the base of the 1% a day (open answers 3
   and 4).
7. The default period its agreement states (reg 57(3)), and what hard
   closure on day 47 does to the loan.
8. Its pricing model and CBK's approval of current pricing (regs 55, 59),
   and the licence it lends under (open answer 2).
9. The recovery expenses it charges, and where its contract discloses
   them.
