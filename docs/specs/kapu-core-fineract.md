---
id: kapu-core-fineract
name: Kapu Core on Apache Fineract — component specification
kind: spec
type: component
release: R1
implements: [core]
depends_on: [access-keycloak]
used_by: [approval-engine, lender-rules, end-of-day-runner]
version: 0.1.0
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-136, FS-139, FS-185, FS-625, FS-626, FS-630, FS-634, FS-642]
last_reviewed: 2026-10-08
---

# Kapu Core on Apache Fineract — component specification

How Dibon runs Apache Fineract as Kapu Core (docs/modules/core.md) for R1,
Roan Capital's loans: the version, what is used and what is not, the
settings, the contracts with the services around it, restructuring, end of
day, and what must be tried on a running instance before the build relies
on it. Sources: Fineract's documentation for 1.15.0, its API reference and
its source code, read on 2026-10-08 (FS-625). What they settle is stated
as fact here; what only a running instance can show is in §9. Nothing here
is built.

## 1 · Purpose and scope

Fineract is the ledger: it records clients, loans, schedules, repayments
and the general ledger, and closes each loan's day. It never decides: the
approval engine decides who may act, the lender-rules service decides what
the law allows, and Fineract records the result.

| Id | Capability | In R1 |
|---|---|---|
| KC-01 | Clients: individuals and businesses | Yes |
| KC-04 | Loans: products, schedules, charges, repayments split by component | Yes |
| KC-05 | General ledger: accrual accounting, a journal entry for every transaction | Yes |
| KC-07 | End of day, run by the end-of-day runner (end-of-day-runner) | Yes |
| KC-08 | Maker-checker through the approval engine, not Fineract's own | Yes |
| KC-09 | Mobile-money repayments posted in real time | Yes |
| KC-12 | Hosted per institution, isolated, on Liquid's Azure Stack | Yes |
| KC-15 | Working days and holidays set from the business calendar | Yes |
| MF-09 | Restructuring: reschedule, refinance, top-up (§6) | Yes |
| MF-22 | The regulated repayment order, as a product setting (§4) | Yes |
| MF-35 | Loan officers as Fineract staff | Yes |

**Out of R1:** savings, shares and tellers (KC-02, KC-03, KC-06), which
Saccos need and Roan Capital does not; Fineract as a deposit core waits on
FS-185. Groups (KC-01, later).

**Where it sits.**

```
  staff, back office                     borrowers, guarantors
        |                                        |
        v                                        v
  +----------------+   +--------------------------------+   +-------------------+
  | ACCESS         |-->| KAPU MFI                       |<->| APPROVAL ENGINE   |
  | signs in       |   | the only writer to the ledger  |   | decides           |
  | [keycloak]     |   | [kapu_service]                 |   | [kapu_service]    |
  +----------------+   +--------------------------------+   +-------------------+
        | OAuth          | commands,         ^ waivers
        |                | service account   |
        v                v                   |
  +-----------------------------------------------+   +-------------------+
  | KAPU CORE                                     |   | LENDER RULES      |
  | records: clients, loans, general ledger       |-->| corrects          |
  | [apache_fineract]                             |   | [kapu_service]    |
  +-----------------------------------------------+   +-------------------+
        |  events (Avro)       ^ business date, close of business
        v                      |
  +----------------+   +--------------------------------+
  | EVENT BUS      |   | END-OF-DAY RUNNER              |
  | carries events |   | closes the day                 |
  | [kafka]        |   | [kapu_service]                 |
  +----------------+   +--------------------------------+
```

**Related:** implements [core](../modules/core.md); depends on
[access-keycloak](access-keycloak.md) (and event-bus-kafka, to write); used by
[approval-engine](approval-engine.md), [lender-rules](lender-rules.md) and
[end-of-day-runner](end-of-day-runner.md); journeys
[JN-04](../journeys/loan-to-disbursement.md) and
[JN-06](../journeys/restructuring.md).

## 2 · Version and hosting

- **Apache Fineract 1.15.x, pinned.** A minor upgrade is taken only after
  §9's checks pass on it. The Mifos web app's version is open (FS-136).
- **No fork.** Anything Fineract lacks is added through its documented
  custom modules (custom services, business steps, transaction
  processors), never by changing its code.
- **Hosting:** one Fineract per institution on Liquid's Azure Stack in
  Kenya (KC-12), with PostgreSQL (architecture §6). Tenant time zone
  Africa/Nairobi (§7).
- **Sign-in:** Fineract's OAuth support, against Keycloak (access AC-02);
  basic authentication off.

## 3 · Features used and not used

| Feature | Used | Why |
|---|---|---|
| Progressive loan schedule, with advanced payment allocation | **Yes, every product** | The repayment order is a setting (§4); restructuring and a rate change on a live loan need it (§6). The two go together: Fineract allows one only with the other |
| Flat or declining-balance interest | Per product | Progressive loans have supported flat interest since 1.13; it is young, so §9 tests it (Roan's open answer 4) |
| Top-up, with the loan it closes | Yes | Refinance and top-up (§6) |
| Re-aging, re-amortization, reschedule requests | Yes | Restructuring (§6) |
| Interest and charge waivers | Yes | The arrears cap's same-day sweep (lender-rules) |
| Working days and holidays | Yes | Set from the business calendar (KC-15) |
| Staff, loan officers, bulk reassignment | Yes | MF-35 |
| External ids on loans and transactions | Yes | Every record carries ours (§5) |
| Close of business, business date | Yes | Run by the end-of-day runner (§7) |
| External events to Kafka, in Avro | Yes | Into the event bus through an adapter (§5) |
| Fineract's own maker-checker | **No** | The approval engine decides (KC-08); two approval records could disagree |
| Its overdue-penalty step | **No**, for capped products | Default interest is posted by lender-rules, within the cap |
| Savings, shares, tellers | No, in R1 | Roan Capital takes no deposits |
| Its SMS and email jobs | No | Messages go through our messaging service |
| Its report mailing | No | Reports come from insights and Odoo |

## 4 · Settings

**Global configuration:**

| Setting | Value | Why |
|---|---|---|
| maker-checker | off | §3 |
| allow-transactions-on-holiday, allow-transactions-on-non_workingday | on | Repayments land every day; M-Pesa never closes |
| reschedule-repayments-on-holidays, reschedule-future-repayments | per the institution's credit policy | Whether a due date on a holiday moves (onboarding OB-COM-20) |
| business date | on, moved only by the end-of-day runner (§7) | |

**Every loan product:**

| Setting | Value |
|---|---|
| Loan schedule type | Progressive |
| Transaction processing strategy | Advanced payment allocation |
| Payment allocation, default rule | Past-due principal, past-due fees, past-due penalties, past-due interest; then due principal, fees, penalties, interest; then in advance in the same order (reg 56: principal, then fees and charges, then interest) |
| Future installments | Next installment first, unless the product says otherwise |
| Interest method | Flat or declining balance, as the product version says |
| Minimum and maximum nominal rate | The product's range: a rate change outside it is refused |
| Overdue days for non-performing | Matched to reg 57 where the product's tenors sit wholly on one side of 30 days (lender-rules) |
| Moves out of non-performing only when arrears are cleared | On |
| Can be used for top-up | On, where the credit policy allows top-ups |
| Overdue penalty charges | None, for capped products |

**Roles and permissions:** staff roles never hold `APPROVE_LOAN`,
`REJECT_LOAN`, `WITHDRAW_LOAN`, `DISBURSE_LOAN`, `DISBURSETOSAVINGS_LOAN`,
`APPROVALUNDO_LOAN`, `DISBURSALUNDO_LOAN`, `CREATE_RESCHEDULELOAN`,
`APPROVE_RESCHEDULELOAN`, `REJECT_RESCHEDULELOAN`, `REAGE_LOAN`, `REAMORTIZE_LOAN`,
`WAIVEINTERESTPORTION_LOAN`, `WAIVE_LOANCHARGE`, `WRITEOFF_LOAN` or
`FORECLOSURE_LOAN`. Only Kapu MFI's service account does, and it acts only
on an approved request. Whether staff use Fineract's own screens at all,
and so whether they need a read-only role, is open (§10).

**Codes:** reschedule reasons and re-amortization reasons, matching the
reasons Kapu MFI records (MF-09).

**Accounting:** accrual accounting, the institution's chart of accounts
(OB-KC-02); accruals stop on a non-performing loan (§7).

## 5 · Contracts

**Commands Kapu MFI calls** (the service account, each only after the
approval engine's yes where one is needed):

| Act | Fineract command | Approval subject |
|---|---|---|
| Approve, reject a loan application | `loans/{id}?command=approve`, `reject` | `loan.application` |
| The applicant withdraws | `loans/{id}?command=withdrawnByApplicant` | — |
| Disburse, after the rail confirms | `loans/{id}?command=disburse` | `loan.disbursement` |
| Repayment | `loans/{id}/transactions?command=repayment` | — |
| Waive interest, waive a charge | `transactions?command=waiveInterest`; `charges/{id}?command=waive` | — (the cap sweep) |
| Reschedule | `rescheduleloans`, then `?command=approve` | `loan.restructure` |
| Re-age, re-amortize | `transactions?command=reAge`, `reAmortize` | `loan.restructure` |
| Top-up, refinance | A new loan with `isTopup` and `loanIdToClose` | `loan.restructure` |
| Assign, reassign officers | `assignLoanOfficer`; `loans/loanreassignment` | Bulk: a second person (MF-35) |

**External ids.** Each loan carries our application id as its external
id; each transaction carries our own id (a repayment, the M-Pesa receipt
number). Fineract accepts up to 100 characters, and a loan can be read by
its external id. The approval request's id goes in the command's note;
whether the approve command also takes an external id is in §9.

**Events.** Fineract saves each event in the same database transaction as
the change it describes, sends them in order, at least once, in Avro, to
Kafka. An adapter re-wraps them in the platform's signed CloudEvents
envelope (RO-23) for the event bus; consumers never read Fineract's topic
directly. Names follow the event bus spec, to write.

**Never:** a write by anyone but Kapu MFI's service account; a change to
a posted transaction (a correction is a reversal and a new posting).

## 6 · Restructuring

Fineract has no single restructure command; each kind of MF-09 maps to
its own feature, and the newer ones exist only for progressive loans
(FS-139):

| Kind (MF-09) | Fineract feature | Notes |
|---|---|---|
| Reschedule: the same loan, a new schedule | **Re-aging** (a new set of installments for what is outstanding: start date, number, frequency); **re-amortization** (overdue principal spread over the remaining installments); or a **reschedule request** (extra terms, a moved due date, or a new rate, one at a time, no grace) | A re-age can be undone only while it is the loan's latest transaction |
| Refinance or rollover: a new loan pays off the old | **Top-up**: the new loan names the loan it closes; at disbursement it pays that loan off and the net goes to the borrower | Fineract keeps the link from new to old; our tamper-evident chain is the event log (RO-24) |
| Top-up: more money on the loan | The same, with a top-up amount | The product must allow top-ups |
| Rate change on a live loan (lender-rules, variations) | A reschedule request with a new rate, from a stated date | Within the product's minimum and maximum |

**A top-up folds what is owed into the new loan.** It pays off the old
loan's whole balance, overdue interest included, out of the new loan's
principal: the capitalisation of arrears interest that reg 29 forbids.
So Kapu MFI refuses a refinance or top-up while interest is overdue,
unless that interest is first paid or waived (JN-06 §3 i).

**Fineract's own classification resets.** After a re-age, nothing is past
due, so Fineract's delinquency and non-performing status clear. The
arrears cap's episode does not (reg 29(3)): lender-rules keeps it, and
remains the authority on classification.

## 7 · End of day and dates

**What Fineract's close of business does.** One job, "Loan COB", closes
each loan's day in order of configured business steps: periodic
accruals, interest recalculation, arrears ageing, delinquency tags,
due and overdue checks, and overdue charges (not used, §3). Custom steps
can be added. Other jobs run on the scheduler: trial balance details,
loan-loss provisioning, the sending and purging of events.

**What it does not do.** It does not complete the day's postings: a
repayment or a disbursement is final, with its journal entries, when it
is posted. A core that holds deposits in temporary tables until its end
of day (Bankers' Realm at Onit, FS-630) behaves differently; recon treats
those cores' postings as provisional until their end of day.

**While it runs, the system stays open.** A loan waiting to be closed is
caught up first when a payment for it arrives; a loan being closed at
that moment refuses the write with HTTP 409, and Kapu MFI retries. A loan
whose close fails stays locked until it is fixed: the runner lists it
and raises a ticket (MF-12).

**The business date.** Fineract's business date is a logical date, not
the clock: it moves only when the runner moves it.

- Every transaction has a **value date** (when it happened: the M-Pesa
  receipt time), a **business date** (the ledger day it belongs to) and a
  **created time** (the clock, for audit).
- A transaction may be dated before the business date, never after: a
  payment at 23:59 posted at 00:05 keeps its own date (reg 56(1)).
- If the business date does not move, postings keep landing on the old
  day, and today's are refused as "in the future". The runner owns the
  date and raises the alarm if it lags.
- Missed days, after an outage, are closed one at a time
  (`loans/catch-up`); test environments move the date to run a loan's
  life in minutes.

The platform's rules for time are in docs/architecture/README.md §10; the run
itself is in the end-of-day-runner spec.

## 8 · Security

- **One writer.** Kapu MFI's service account; its credentials in OpenBao,
  rotated; every command it sends carries the approval request it acts on.
- **Staff sign in through Keycloak** (AC-02), never with Fineract's own
  passwords.
- **The database is Fineract's alone.** Nothing else reads or writes its
  tables; reports and insights read events and the API.
- **Nightly comparison** (approval-engine §9): any loan approved, disbursed
  or restructured in Fineract without an approved request is an alert.

## 9 · Checks before the build

On a running 1.15 instance, before the build relies on each (FS-625):

| # | Check | Settles |
|---|---|---|
| F1 | A flat-interest progressive loan: the schedule and APR match lender-rules' pricing | KC-04, MF-23 |
| F2 | A flat-interest loan repaid in full early: no interest charged for the remaining term | MF-22, reg 56; lender-rules A7 |
| F3 | A payment across past-due and due amounts allocates principal, then fees, then interest | MF-22; lender-rules A5 |
| F4 | Interest and charge waivers on a progressive loan | MF-21 |
| F5 | A re-age under each interest handling: no arrears interest moves into principal | MF-09, reg 29 |
| F6 | After a re-age, Fineract's delinquency and non-performing status, beside lender-rules' | MF-25 |
| F7 | A holiday added after a schedule exists: what moves, and what the holiday job does | KC-15 |
| F8 | A top-up on a progressive loan, with the net paid through our own rail | MF-09, MF-11 |
| F9 | Whether the approve command takes an external id, or only a note | KC-08 |
| F10 | A repayment at 23:59 posted after midnight keeps its own date | MF-22, reg 56(1) |
| F11 | A payment for a loan mid-close: caught up, or refused with 409 and retried | KC-07, KC-09 |
| F12 | A missed day caught up; the business date's alarm when it lags | KC-07 |
| F13 | Kafka events through the adapter: order, duplicates, a broker down and back | RO-23 |

## 10 · Open questions

**For the owner:**

1. Do staff use Fineract's own screens, through the Mifos web app, and
   which version (FS-136)? Until settled, staff have no Fineract role.
2. Fineract as a deposit core for Saccos and banks (FS-185).

**For Roan Capital:**

1. Flat or declining-balance interest, product by product (open answer 4).
2. Whether a due date on a holiday moves, and to which day.
3. Which kinds of restructure it offers, and how often per loan (open
   answer 10).
