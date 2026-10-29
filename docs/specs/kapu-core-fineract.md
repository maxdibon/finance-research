---
id: kapu-core-fineract
name: Kapu Core on Apache Fineract — component specification
kind: spec
type: component
status: draft
law: LR-03
released: 2026.10.16
release: R1
implements: [core]
depends_on: [access-keycloak, event-bus-kafka]
used_by: [approval-engine, lender-rules, end-of-day-runner, recon, lending-service, deposits-service]
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-136, FS-139, FS-185, FS-625, FS-626, FS-630, FS-634, FS-642, FS-667, FS-674, FS-792, FS-793, FS-802, FS-965, FS-983, FS-1050]
last_reviewed: 2026-10-29
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
| KC-09 | Mobile-money repayments posted in real time | Yes, M-Pesa; Airtel Money and T-Kash later |
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
[access-keycloak](access-keycloak.md) and [event-bus-kafka](event-bus-kafka.md); used by
[deposits-service](deposits-service.md), [lending-service](lending-service.md), [approval-engine](approval-engine.md), [lender-rules](lender-rules.md),
[end-of-day-runner](end-of-day-runner.md) and [recon](recon.md); journeys
[JN-04](../journeys/loan-to-disbursement.md) and
[JN-06](../journeys/restructuring.md).

## 2 · Version and hosting

- **Apache Fineract 1.15.x, pinned.** A minor upgrade is taken only after
  §12's checks pass on it. The Mifos web app's version is open (FS-136).
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
| Flat or declining-balance interest | Per product | Progressive loans have supported flat interest since 1.13; it is young, so §12 tests it (Roan's open answer 4) |
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

**The settings are Fineract's baseline,** [settings/fineract](../settings/fineract.md)
(FS-1050), each with its class (mandatory, default or per deployment),
why, and how it is enforced and checked; each deployment's own values are
its file, `deployments/<deployment>/fineract.md`; its database's are the
[PostgreSQL baseline](../settings/postgresql.md). In short: maker-checker
off, as the approval engine decides (baseline S06); the business date
moved only by the end-of-day runner (S09); every product progressive,
with the repayment order reg 56 sets (S10, S11), set only from its signed
product version and compared each night (S12, check F15); no staff role
able to move a loan, only Kapu MFI's service account (S16, S17).

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
directly. Names are in the event bus catalogue (event-bus-kafka §5).

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
- **No superuser, no human login** (FS-789, FS-793): CloudNativePG's
  superuser access turned off; Fineract's role without schema rights;
  people reach the data only by break-glass, two people, recorded. pgAudit
  logs every schema change and every write not made by Fineract's role,
  shipped at once off the instance (SE-18). A correction is an approved
  posting, never SQL.
- **Three ledgers** (recon §3): every posting and a signed checkpoint per
  cycle go to recon as events, with per-account sequence numbers; recon's
  shadow and companion must agree with Fineract.
- **Nightly comparison** (approval-engine §9): any loan approved, disbursed
  or restructured in Fineract without an approved request is an alert.

## 9 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| Clients, loans, schedules, transactions, the general ledger | Confidential | Seven years after the relationship ends (docs/documents.md) | Borrowers' and guarantors' |
| National ID numbers | Restricted | — | Not stored in Fineract in clear: the identity record holds them (identity ID-15), referenced by id; any field Fineract must hold is encrypted (SE-27) |
| Fineract's command audit | Confidential | Seven years | Staff and service identities |

## 10 · Quality and metrics

- **Tier 1.** A repayment command answered within 500 ms at the 95th
  percentile; the close of business for 10,000 loans within 30 minutes
  (both proposed, measured in §12's checks).
- **Metrics,** from Fineract's own instrumentation to Prometheus: API
  latency and errors; the close's duration and loans failed; loans
  locked; events waiting to be sent.
- **Alerts** (observability-grafana §4): a write refused after retries
  (3); events not sent (2); the close (end-of-day-runner §6).

## 11 · Threats

| Threat | For example | The answer |
|---|---|---|
| Elevation of privilege | Staff approve or disburse in Fineract directly | No staff role holds those permissions; only Kapu MFI's account (§4) |
| Spoofing | The service account's key stolen | Its key in OpenBao, a signed client assertion, mutual TLS; rotated |
| Tampering | The database edited directly | Reachable only by Fineract; encrypted; the nightly comparison; the ledger reconciled with the rails |
| Repudiation | A posting nobody can explain | Every command carries the approval it acts on; Fineract's audit |
| Information disclosure | A bulk export of clients | Exports need their own permission (architecture §7); no ID numbers in clear |
| Denial of service | Writes refused during the close | Retries; catch-up (§7) |

## 12 · Checks before the build

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
| F14 | A balance updated directly in the database is caught by recon's companion as a severity 1, and pgAudit's record of it survives the account that made it | FS-789, FS-793; recon A2 |
| F15 | A product setting changed directly in Fineract is found the next morning, against the product version document | lender-rules §2.4, FS-802 |

## 13 · Open questions

**For the owner:**

1. Answered (FS-965): staff do not use the Mifos web app; they work in
   the staff workspace in Odoo, over Kapu MFI (staff-workspace). Staff
   have no Fineract role, unless a read-only one for named staff is
   chosen as the fallback (staff-workspace, open question 2).
2. Fineract as a deposit core for Saccos and banks (FS-185).

**For Roan Capital:**

1. Flat or declining-balance interest, product by product (open answer 4).
2. Whether a due date on a holiday moves, and to which day.
3. Which kinds of restructure it offers, and how often per loan (open
   answer 10).

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](../law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 29 | reg 29, reg 29(3) | What can be recovered on a non-performing loan is capped at the principal then owing, interest up to that principal, and reasonable recovery costs; the cap is measured from the last time the loan became non-performing (29(3)); interest under a court order after the order is outside it (29(4)) |
| reg 56 | reg 56, reg 56(1) | A repayment credited on the day it is paid, applied to due principal, then fees and charges, then interest; early repayment, in whole or part, without notice or penalty (56(3)), and no interest for the remaining term on full early repayment (56(4)) |
