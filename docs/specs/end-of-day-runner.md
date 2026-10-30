---
id: end-of-day-runner
name: End-of-day runner — build specification
kind: spec
type: build
status: draft
law: LR-03
released: 2026.10.16
release: R1
implements: [core, recon-observability]
depends_on: [kapu-core-fineract, lender-rules, observability-grafana, access-keycloak, event-bus-kafka, recon]
used_by: []
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-574, FS-630, FS-633, FS-634, FS-642, FS-667, FS-674, FS-765, FS-778, FS-792, FS-793, FS-1054]
last_reviewed: 2026-10-30
---

# End-of-day runner — build specification

How each institution's business day is closed in R1, for Roan Capital on
Kapu Core: checks first, then Fineract's close of business, then the
lender rules, each step watched, and every failure told to the right
person by the incident-management plan (FS-633, FS-634). Fineract
schedules jobs but does not check before them, order our steps around
them, or call anyone; the runner does. Nothing here is built.

## 1 · Purpose and scope

The runner answers one question each night: *may this day be closed,
and did it close?*

| Id | Capability | In R1 |
|---|---|---|
| KC-07 | End of day: checks, the scheduled run, monitoring and escalation, on the institution's own cycle | Yes |
| KC-15 | The business calendar the dates come from | Yes |
| RO-04 | Reconciliation's end-of-day cycle, run after the close | Yes, end of day; intraday later |
| RO-17 | Alerts and SLOs: the run's own | Yes |
| RO-18 | On-call: a severity 1 pages by phone | Yes |
| MF-12 | Loans the close could not process, in the exception queue | Yes |

**Out of R1:** more than one institution per run (each has its own
runner), and runs for Saccos' savings and shares.

**Where it sits.**

```
  +-------------------+  checks, runs, watches   +-------------------+
  | END-OF-DAY RUNNER |------------------------->| KAPU CORE         |
  | closes the day    |  business date, close    | records           |
  | [kapu_service]    |  of business             | [apache_fineract] |
  +-------------------+                          +-------------------+
     |        |   classification, cap, sweep     +-------------------+
     |        +--------------------------------->| LENDER RULES      |
     |                                           | corrects          |
     | metrics, failures                         | [kapu_service]    |
     v                                           +-------------------+
  +-------------------+  severity 1     +-------------------+
  | OBSERVABILITY     |---------------->| ON-CALL           |---> phone call
  | watches, alerts   |                 | escalates         |     to the engineer
  | [grafana]         |                 | [goalert]         |
  +-------------------+                 +-------------------+
```

**Related:** implements [core](../modules/core.md) and
[recon-observability](../modules/recon-observability.md); depends on
[kapu-core-fineract](kapu-core-fineract.md),
[lender-rules](lender-rules.md),
[observability-grafana](observability-grafana.md),
[access-keycloak](access-keycloak.md), [event-bus-kafka](event-bus-kafka.md) and
[recon](recon.md), which computes the intake and break checks; used by none; the
plan it notifies by is [incident management](../service-management/incident-management.md).

## 2 · Concepts

- **Business date:** the ledger's day, moved only by the runner
  (kapu-core-fineract §7). Africa/Nairobi.
- **Close:** Fineract's close of business for the day just ended, then
  the lender rules' steps for the same day.
- **Check:** a test run before the close, with a **class**: *blocking*
  (the close waits) or *warning* (the close goes ahead; someone is told).
- **Hold:** the close waits on a blocking check. The business date still
  moves at midnight, so the day's payments keep landing; only the close
  waits, and catches up when released.
- **Override:** two people release a held close despite a blocking check
  (§8).

## 3 · The night, by the clock

Times are Africa/Nairobi, configured per institution. The run starts at
midnight (owner, 2026-10-08).

| Time | What |
|---|---|
| 21:00 | First pass of the checks: an early warning while people are still about |
| 23:45 | Final pass: decides whether the close runs or is held |
| 00:00 | The business date moves to the new day, whatever the checks say |
| 00:00 | If not held: Fineract's close of business for the day just ended |
| After it | Post-checks; then the lender rules' steps; then the general-ledger summary to Odoo, reconciliation (RO-04), snapshots for MF-14 and MF-15 |
| 03:00 | Deadline: anything unfinished, or a close still held, is a severity 1 |
| 06:00 | The morning report to the institution's accountant and our operations |

Roan Capital's 11 pm to 4 am window, in which staff release nothing
(RC-21), is its own procedure and stays; the runner does not need it.

## 4 · Checks, and what makes one blocking

**The criteria** (FS-633). A check is **blocking** if closing the day
while it fails would:

1. put a wrong figure in the ledger that the close would compound: an
   accrual, an ageing, default interest or the cap computed on a balance
   that is missing a posting;
2. date a transaction to the wrong business day, against reg 56(1);
3. leave a close that could not finish, or could not be recovered; or
4. break the audit trail, so the night could not be proven afterwards.

Otherwise it is a **warning**: the close goes ahead, and the issue is put
right the next day without changing any figure the close produced, or it
affects only reports.

**Three rules on top.** A check that a regulation drives is never lowered
to a warning. The institution may raise a warning to blocking; it may not
lower a blocking check below the criteria. Each check's class is agreed
with the institution at onboarding (OB-KC-04), as part of the operations
conversation, and reviewed after every incident it took part in.

**The checks, with their proposed class.** C3 to C6 and P5 are computed
by recon and published to the runner, which decides whether to hold or
close (recon §8, FS-793):

| # | Check | Class | Why |
|---|---|---|---|
| C1 | Yesterday's close finished: Fineract's oldest closed date is the day before | Blocking | 1 |
| C2 | No loan still locked from a failed close | Blocking | 1 |
| C3 | The day's M-Pesa intake complete: missed confirmations pulled (rails RL-20); every receipt posted or in the exception queue | Blocking | 1, 2: a missing repayment would draw default interest tonight |
| C4 | No disbursement paid by the rail and not yet posted | Blocking | 1 |
| C5 | Unapplied money within the institution's tolerance | Warning up to the tolerance, blocking above it | 1, for the borrowers it belongs to |
| C6 | Intraday reconciliation breaks acknowledged | Warning | Corrected next day; matched again by RO-04 |
| C7 | Fineract, its database, the lender-rules service, Kafka and the event adapter healthy | Blocking | 3, 4 |
| C8 | Last backup completed and verified within 24 hours | Blocking | 3 |
| C9 | Every host's clock within 500 ms of the source (architecture §10) | Blocking | 2, 4 |
| C10 | Holidays for the next 30 days in the calendar (KC-15) | Warning | Affects due dates later, not tonight |
| C11 | No product version or bulk change half-applied | Warning | Finished or rolled back next day |
| C12 | Disk and capacity under 80% | Warning; blocking at 95% | 3 |

## 5 · The run

```
  SCHEDULED --> CHECKING --> READY ----> CLOSING --> POST-CHECKS --> OUR STEPS --> REPORTED
                   |                        |             |              |
                   +--> HELD --override--> READY           +--> FAILED <--+
                         |  (released, or two people)       |
                         +--> severity 1 at 03:00 <---------+ (and any overrun)
```

**Post-checks**, before the lender rules run:

| # | Post-check | If it fails |
|---|---|---|
| P1 | The business date is today's calendar date | Severity 1 |
| P2 | Fineract's oldest closed date is the day just closed | Severity 1 |
| P3 | Every active loan closed: the count matches | Severity 2; the rest go on |
| P4 | No loan newly locked | Each one is a ticket (MF-12), severity 3; more than 10, severity 2 |
| P5 | The trial balance balances | Severity 1; the lender rules do not run |
| P6 | Fineract's outgoing events sent | Severity 2 |

A loan Fineract could not close is left locked, listed and ticketed; the
lender rules skip it and say so in the report.

**Missed days.** After an outage, Fineract's catch-up closes each missed
day in order; the runner runs the lender rules for each day in turn, then
the post-checks for each.

## 6 · Watching and telling

Every step's start, end and result is a metric and a log line (§7);
Grafana's alert rules turn them into alerts with a severity label, and
the incident-management plan decides who is told, how, and with what.

| Event | Severity | Who is told first (incident-management §3) |
|---|---|---|
| A warning check fails, at either pass | 3 | The institution's accountant and our operations: a ticket, and the morning report |
| A blocking check fails at 21:00 | 3 | The same, at once, so it can be fixed before 23:45 |
| The close is held at 23:45 | 2 | The on-call engineer (SMS and app) and the institution's accountant (email and ticket) |
| Still held at 03:00 | 1 | The on-call engineer by phone call, then the rota, then the CTIO |
| The close or our steps fail, or overrun 03:00 | 1 | The same |
| P1, P2 or P5 fails | 1 | The same |
| P3, P4 (over 10) or P6 fails | 2 | On-call engineer and accountant |

## 7 · Interfaces

**To Fineract** (kapu-core-fineract §7), with the runner's own service
account:

| Act | Call |
|---|---|
| Move the business date | Run the job "Increase Business Date by 1 day" (`POST /jobs/short-name/{name}`) |
| Close of business | Run the job "Loan COB"; its progress from the job's run history |
| Yesterday closed? | `GET /loans/oldest-cob-closed` |
| Missed days | `POST /loans/catch-up`; `GET /loans/is-catch-up-running` |
| Locked loans | The locked-loans list |

Fineract's own scheduler does not run these two jobs: only the runner
does, so nothing closes without the checks.

**To lender rules:** run the day's steps for a business date (lender-rules
§3, end of day, steps 3 to 6), and report per loan.

**To observability:** metrics `eod_run_state`, `eod_check_result`
(labels: check, class, pass), `eod_step_duration_seconds`,
`eod_locked_loans`, `eod_business_date_lag_days`; a heartbeat every five
minutes while running, so silence is itself an alert.

**Events** (from the event bus catalogue, event-bus-kafka §5):
`kapu.core.eod.checked`, `.held`, `.released`, `.closed`, `.failed`,
`.reported`.

**The morning report**, 06:00, by email to the institution's accountant
and our operations: each check's result, the times of each step, loans
closed and locked, any hold and override, and reconciliation breaks. It
also opens the morning's ticket in the institution's helpdesk, which
the accountant closes to sign the day off (JN-17). The email carries
counts, amounts and references only, never a name or a phone number;
the detail is behind sign-in, in the back office (owner, FS-778).

## 8 · Security and audit

- **An override takes two people,** each re-authenticated (access AC-05):
  the institution's finance lead and our on-call engineer. Each states a
  reason; a check that a regulation drives cannot be overridden.
- **Configuration is maker-checker and effective-dated:** the times,
  each check's class, the tolerance in C5 and the contacts.
- **Every check, step, hold, override and notice is recorded,**
  append-only, in the audit chain (RO-24, RO-27).
- **The service account** may run only the jobs in §7 and read status.

## 9 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| Each night's record: every check's result, step times, holds, notices sent | Internal | Seven years, as evidence of the ledger's close | — |
| Overrides, with both reasons | Confidential | Seven years | The two people who overrode |

## 10 · Quality and metrics

- **The close finished by 03:00,** or someone is phoned
  (docs/architecture/quality.md).
- **The checks complete within 10 minutes;** a heartbeat every five
  minutes while running.
- **Metrics and alerts:** §7 and §6.

## 11 · Threats

| Threat | For example | The answer |
|---|---|---|
| Spoofing | A forged override | Two people, each stepped up (§8) |
| Tampering | A blocking check quietly made a warning | Classes under maker-checker, effective-dated; a check a regulation drives is never lowered |
| Repudiation | "Who released the hold?" | Signed records of every hold and release |
| Denial of service | The runner itself stops | Its heartbeat goes quiet, and on-call is paged (observability G3) |
| Elevation of privilege | The runner's account used for other writes | It may run only its jobs (§8) |

## 12 · Acceptance tests

| # | Given | When | Then | Id, source |
|---|---|---|---|---|
| E1 | Every check passes | 00:00 | Date moves; close runs; post-checks pass; lender rules run; report at 06:00 | KC-07 |
| E2 | C3 fails at 21:00 | Fixed by 23:45 | Severity 3 ticket at 21:00; close runs at 00:00 | KC-07 |
| E3 | C3 still failing at 23:45 | 00:00 | Date moves; close held; severity 2 to on-call and accountant | KC-07, FS-633 |
| E4 | Close held | 03:00 | Severity 1: the on-call engineer is phoned; no acknowledgement in 5 minutes, the next in the rota | RO-18 |
| E5 | Close held | Finance lead and on-call engineer override, each stepped up | Close runs; override recorded with both reasons | AC-05, RO-24 |
| E6 | Close held | One person overrides | Refused | §8 |
| E7 | Close runs | Three loans fail | Listed, locked, three tickets; the rest closed; lender rules skip the three | MF-12 |
| E8 | Close done | Trial balance out | Severity 1; lender rules do not run | KC-05 |
| E9 | Repayment at 00:02 for a loan being closed | Posted | Refused with 409, retried, posted with its own date | MF-22, reg 56(1) |
| E10 | Two days missed after an outage | Released | Each day closed in order, lender rules for each | KC-07 |
| E11 | A host's clock 2 seconds out | 23:45 | C9 fails; close held; severity 2 | §4 |
| E12 | A warning check fails | 06:00 | In the morning report; close was not held | §4 |

## 13 · Open questions

**For the owner:**

1. The acknowledgement and escalation times (incident-management §6).
2. Whether the lender rules may run for the loans that closed when some
   did not (designed: yes, skipping those, and saying so).

**For Roan Capital** (the operations conversation, OB-KC-04):

3. Each check's class, against the criteria in §4.
4. The tolerance for unapplied money (C5).
5. Who receives each notice: its accountant, its finance lead, others.

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](../law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 56 | reg 56(1) | A repayment credited on the day it is paid, applied to due principal, then fees and charges, then interest; early repayment, in whole or part, without notice or penalty (56(3)), and no interest for the remaining term on full early repayment (56(4)) |
