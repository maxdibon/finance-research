---
id: recon
name: Reconciliation platform — build specification
kind: spec
type: build
status: draft
release: R1
implements: [recon-observability]
depends_on: [kapu-core-fineract, event-bus-kafka, observability-grafana, access-keycloak, lender-rules, approval-engine]
used_by: [end-of-day-runner]
version: 0.3.0
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-095, FS-388, FS-509, FS-635, FS-766, FS-767, FS-785, FS-788, FS-789, FS-790, FS-791, FS-792, FS-793, FS-794, FS-796, FS-802]
last_reviewed: 2026-10-14
---

# Reconciliation platform — build specification

The reconciliation platform redesigned to be native to this environment
(FS-788), from the owner's notes (FS-790, FS-791): every shilling that
comes in or goes out accounted for, by count and amount, on every
channel; every hop of a transaction traceable; breaks corrected by rule,
by a person, or by a ticket; and **three ledgers that must always agree**:
the master's, a shadow built from the master's postings, and a companion
that works out on its own what every account should hold. The v1 platform's
prototypes (Control Tower, Recon Workbench, Exception Queue, Transaction
Trace, GL & Subledger) are its starting point; nothing here is built.

## 1 · Purpose and scope

Recon answers two questions, continuously: *is every movement of money
accounted for?* and *does every ledger agree with what actually
happened?*

| Id | Capability | In R1 |
|---|---|---|
| RO-01 | Ingest rail, bank and ledger events, and statement files | Yes, statement files and the M-Pesa feed; change-data capture from an institution's own core later |
| RO-02 | Matching with configurable rules: one to one, one to many, many to many, with tolerances | Yes |
| RO-03 | Three-way matching: ledger, statement and expected | No: R2 (FS-793) |
| RO-04 | Intraday and end-of-day cycles; cut-offs held in transit | Yes, end of day; intraday later |
| RO-05 | The exception queue, by time left | Yes |
| RO-06 | Transaction trace | No: phase 1; R1 traces through RO-23 to RO-25 |
| RO-07 | Remediation and the automatic chase of items in transit | Yes, for M-Pesa |
| RO-08 | The ledger replica: here the shadow and the companion (§3) | Yes: the shadow at go-live; the companion for Roan Capital's product within the first 30 days (FS-793) |
| RO-09 | Treasury and float | No: R2 |
| RO-11 | Duplicate and anomaly detection | No: phase 1 |
| RO-17 | Alerting and SLOs, the match rate among them | Yes |
| RO-19 | Masking by role, access audit | Yes |
| RO-26 | Fee verification | No: phase 2 |
| RO-28 | The extension catalogue | No: phase 2 |

**Out of R1:** the companion beyond Roan Capital's product, three-way
matching with expected payments, treasury, duplicate detection and
change-data capture (all R2); the extension catalogue (RO-28, phase 2).

**Where it sits.**

```
  +-------------------+   +-------------------+   +-------------------+
  | M-PESA            |   | BANKS             |   | KAPU CORE         |
  | moves money       |   | move money        |   | records           |
  | [rail]            |   | [rail]            |   | [apache_fineract] |
  +-------------------+   +-------------------+   +-------------------+
          | callbacks, pulls      | statements            | postings, checkpoints
          v                       v                       v
  +---------------------------------------------------------------------+
  | EVENT BUS                                                           |
  | carries signed events                                               |
  | [kafka]                                                             |
  +---------------------------------------------------------------------+
          | master postings       | rail events           | source events
          v                       v                       v
  +-------------------+   +-------------------+   +-------------------+
  | SHADOW LEDGER     |-->| RECONCILIATION    |<--| COMPANION LEDGER  |
  | mirrors           | GL| matches, compares | GL| recomputes        |
  | [kapu_service]    |   | [kapu_service]    |   | [kapu_service]    |
  +-------------------+   +-------------------+   +-------------------+
                             | tickets      | alerts
                             v              v
                  +-------------------+   +-------------------+
                  | ODOO              |   | OBSERVABILITY     |
                  | records tickets   |   | watches, alerts   |
                  | [odoo]            |   | [grafana]         |
                  +-------------------+   +-------------------+
```

**Related:** implements
[recon-observability](../modules/recon-observability.md); depends on
[kapu-core-fineract](kapu-core-fineract.md),
[event-bus-kafka](event-bus-kafka.md),
[observability-grafana](observability-grafana.md),
[access-keycloak](access-keycloak.md), [lender-rules](lender-rules.md)
and [approval-engine](approval-engine.md); used by
[end-of-day-runner](end-of-day-runner.md); journeys
[JN-16](../journeys/unplaced-payment.md),
[JN-17](../journeys/accountant-morning.md),
[JN-10](../journeys/deposit.md), [JN-11](../journeys/transfer-out.md)
and [JN-12](../journeys/transfer-in.md).

## 2 · Concepts

- **Master:** the system of record for balances: Kapu Core in native mode,
  the institution's own core in integrated mode.
- **Shadow ledger:** the master's general ledger and sub-ledgers rebuilt
  from the master's own postings as they happen, kept in memory, near
  real time. It trusts the master's inputs and checks its bookkeeping.
- **Companion ledger:** independent of the master. It computes its own
  postings and totals from the source events (the rails' records, the
  approvals, the product's terms, the tariffs and tax rules) and so
  catches a master that is consistently wrong, which a shadow would copy
  (owner, FS-791).
- **Source:** anything recon reads: a rail's callbacks or pulls, a bank's
  API or statement, the master's events, an institution's core by
  change-data capture.
- **Completeness proof:** for a channel and a cycle, the count and amount
  the source reports against the count and amount the ledger holds, by
  currency.
- **Leg:** one part of a split transaction: a C2B payment of 2,000 becomes
  the amount received, the operator's fee, excise duty on the fee, and any
  sums owed to tax agencies or other recipients.
- **Break:** a difference recon cannot explain. **In transit:** a
  difference with a day it should clear.
- **Action:** what follows a break: completed automatically, reversed,
  handed to a person, or a ticket.
- **Extension:** a proven action or rule from Dibon's signed catalogue,
  switched on and configured by an institution, never written by it.

## 3 · The three ledgers

| Ledger | Built from | When | Agrees with the master when |
|---|---|---|---|
| Master | Its own processing | Always | — |
| Shadow | The master's postings, as signed events, with per-account sequence numbers | Within 5 seconds of each posting; snapshotted each hour | Every account's balance, every GL account's total, at every checkpoint the master signs |
| Companion | The source events alone: the rails, approvals, the product's terms, tariffs and tax rules | Each posting for money that moved; each account at end of day, the same way the master closes its day | Every account's balance and every leg, at the close |

**Rules:**

1. **The three must always agree.** A shadow difference is a break at once;
   a companion difference is a break at the close. Neither is ever
   corrected by changing a ledger to match another: the master is fixed by
   an approved posting, and the shadow or companion by finding the cause.
2. **A balance that grew without money behind it is a severity 1.** The
   companion, having no posting for it, is how a direct edit of the
   master's database is caught (FS-789).
3. **Missing events show.** Each master event carries a sequence number
   per account, and the master emits a signed checkpoint each cycle
   (counts and totals per GL account); a gap or a checkpoint that does not
   match is a break.
4. **Two channels.** The shadow also reads balances through the master's
   API on a schedule, so suppressing events alone cannot hide a change.
5. **Integrated mode:** the shadow reads the institution's core by
   change-data capture (Debezium, Apache-2.0) instead of events; the
   companion works the same.
6. **Parallel runs:** before a go-live, a migration or a core replacement,
   the companion runs beside the old system and the new until they agree.
7. **The companion is independent by construction** (FS-793): written
   from the regulations and the product's terms, not from lender rules'
   code, and built by someone other than lender rules' author. Two
   implementations of the same rules is the point: a mistake in one shows
   as a disagreement with the other.
8. **A cut-off and an opening position** (FS-798, FS-802). The shadow and
   the companion start at a cut-off, from an opening position taken from
   the master: every account's balance and, for loans, the schedule,
   accrued interest, classification and any open cap episode. The
   institution's finance lead and Dibon sign it as the agreed start
   (onboarding OB-RO-05); what the institution already knows is
   unreconciled comes across as open items with owners, not hidden in the
   balances. With an institution's own core, change-data capture's initial
   snapshot is the opening position. Inputs are archived from the
   cut-off. Reports say "reconciled since" the cut-off, never more: what
   came before is agreed, not proven. A new cut-off takes the same two
   signatures and lists every difference it absorbs.

### 3.1 The companion for Roan Capital's product (R1)

The first companion: every loan on Roan Capital's 30-day product,
recomputed day by day without reading Fineract's schedule or lender
rules' results, and compared with both (FS-793, FS-796).

**3.1.1 What it reads, and nothing else.**

| Input | From | Why this source |
|---|---|---|
| The product version document, in its vocabulary (lender-rules §2.4): every term the companion needs | The signed document; the companion keeps its own copy, verifying the signature, the hash and the approval | The terms as approved, not as configured in Fineract |
| Each loan's contract: amount, product version, borrower's references | The approved request (`kapu.mandates.request.approved`) and the signed agreement's record | What was approved and signed |
| The disbursement and its value date | The rail's own record: the bank's statement or M-Pesa's confirmation (`kapu.rails.payout.confirmed`) | When money actually left |
| Every repayment, with its rail date | The rail's own record (`kapu.rails.payment.received`), identified by the account's payment reference (RO-02) | When money actually arrived |
| Waivers, recovery expenses, restructures, write-offs | Their approved requests in the approval engine | Only what was approved, never a posting |
| The business calendar | KC-15's signed calendar | Due dates and working days |
| The readings of the law not yet settled | The interpretation record (3.1.3) | One policy, two implementations |
| Disruption windows | Declared with an incident, approved by two people (lender-rules §2.10) | Charges the borrower did not cause |

**3.1.2 What it computes, per loan, each day and on each repayment.**

1. **Disbursed:** principal; the fee, deducted at disbursement; the
   interest for the term by the product's method; the due date from the
   value date and the term, on the business calendar.
2. **Each repayment, as reg 56 orders:** dated by the rail's time, never
   by posting; applied to due principal, then fees and charges, then
   interest; anything beyond what is due to principal; a full early
   repayment owing interest only to its date.
3. **Default interest:** from the first day past due, at the product's
   daily rate on its base, posted day by day.
4. **Classification (reg 57):** non-performing on the first day past the
   shorter of 30 days and the agreement's default period, counted from
   the due date; performing again when nothing is past due beyond it.
5. **The cap (reg 29):** on each non-performing day, the episode's
   `P_npl` and its bucket; nothing beyond the room; a new episode after a
   cure, from that moment's principal.
6. **Approved adjustments,** each from its approval's own figures.
7. **The day's general ledger:** the expected movement on each GL account
   the product uses (the loan portfolio, interest, fee and penalty
   income, suspense), for the comparison with the shadow and the master.

**3.1.3 The interpretation record.** Where the law or Roan Capital has not
yet settled a reading (open answers 3, 4 and 23; LQ-01 and LQ-04), the
reading is written once, as a versioned, effective-dated record approved
by two people, which both lender rules and the companion read. The code
stays independent; the policy is shared, because two programs reading
the law differently would only produce noise. Today's readings: the cap on
the principal when the loan became non-performing, fees inside the
bucket; days counted from the due date; the rate's unit and the base of
the 1% a day as Roan Capital answers; whether interest runs on a disputed
amount as open answer 23 settles. Rounding is a product term: the same
precision and the same rule in both.

**3.1.4 What it compares, and when.**

| When | Compared with | Tolerance | A difference is |
|---|---|---|---|
| Within 5 minutes of each repayment's posting | Fineract's breakdown of that posting (principal, fees, penalties, interest) | Exact, to the cent | A break, severity 3; lender rules raises its own mismatch, independently |
| After each night's close and lender rules' steps | Each loan's principal, fees, penalties, interest, total outstanding, days past due, classification, `P_npl`, bucket and room | Exact, to the cent | A break per loan, severity 3; severity 2 if the classification or the cap differs, or if more than 1% of loans differ (one cause, many loans) |
| The same night | The shadow's and Fineract's GL movements for the day | Exact | Severity 2 |
| Any time | A balance higher than its money explains | None | Severity 1 (FS-789) |
| Each night | Fineract's live product settings, and each loan's copied terms, against the product version document | Exact | Severity 2 (kapu-core-fineract F15) |

The companion never corrects anything: each break goes to the queue with
the companion's working, the master's figures, and the inputs behind
both, and is settled by an approved posting or by fixing whichever
calculation was wrong.

**3.1.5 Edge cases it must get right,** each an acceptance test (§14):
a repayment at 23:40 on the due date, posted after midnight; a backdated
repayment, which re-runs the loan from that date; a reversed repayment;
a part payment; an overpayment beyond the payoff; full early repayment;
a payment during the close; a restructure, which inherits the open cap
episode; a waiver; a recovery expense outside the bucket; a disputed
amount held by a complaint.

**3.1.6 How it starts within the first 30 days.**

- **The cut-off is go-live** (rule 8), with an empty opening position
  for new loans. **From go-live,** every input above is archived as it
  arrives, in the companion's own append-only store, since the event bus
  keeps events only seven days. Nothing is computed yet; nothing is lost.
- **By day 20:** the companion runs, replaying every loan from the
  archive, in silence: its breaks recorded, not raised, while it is
  checked against the worked examples and the first live loans.
- **By day 25,** before the first loan falls due on day 30 and before the
  first default interest on day 31: its breaks raised as in 3.1.4.
- **Migrated loans,** if any: they start from the signed-off migration
  balance (KC-11) as an opening position, recomputed forward from there.

**3.1.7 How lender rules and the companion relate: they never talk**
(FS-797). They share two signed records (the product version document and
the interpretation record) and the same source events. What lender rules
produces, its postings to Fineract and its events, is what recon compares
the companion against, never an input to it. A disagreement is a break;
the fix goes back through lender rules or an approved request.

**3.1.8 Who builds it.** Someone other than lender rules' author, from
the regulations, the product version record and the worked examples in
lender-rules §2.9, never from lender rules' code (rule 7). Both are tested
against the same worked examples, which are the shared truth.

## 4 · What recon does

**4.1 Incoming money.** Every credit on every channel matched to its
posting; completeness by count and amount per channel, per cycle, per
currency; an SLA per channel for the time from the rail to the ledger
(RO-02, RO-04, RO-17).

**4.2 Outgoing money.** Every payout matched from approval to settlement:
approved, released, accepted, debited, settled, or returned; the same
completeness and SLAs; queued payouts checked against the rail's statement
before release (RL-01, FS-661).

**4.3 Internal tracing.** Every hop of a transaction, with both sides'
evidence, verifiable by anyone holding our public keys (RO-23 to RO-25).

**4.4 Auto-correction.** Each break type has its action, set per
institution:

| Action | When | Who decides |
|---|---|---|
| Complete automatically | A read settles it: a status query, a pulled transaction, a statement line | Recon, alone (RO-07) |
| Reverse | Money moved wrongly | The institution's approval chain, never recon alone (MD-01) |
| A person in the middle | Anything the institution's rules say a person must see first | The role its rules name |
| A ticket | A break needs a person to act | A ticket only for a break that needs a person, and one ticket per root cause, linking every customer and transaction it touches; at millions of transactions a day, never one per transaction (FS-793) |
| An alert | A system fails: M-Pesa down, a feed silent, a checkpoint missing | On-call, through observability |

**4.5 Finance's manual reconciliation.** What the rules could not
settle, worked by the accountant in the exception queue, with suggested
matches to approve (RO-03, RO-05; JN-17).

**4.6 Reports.** The match rate by channel (98% automatically, FS-766);
weekly and monthly trends; performance by region, branch and rail;
balances and their discrepancies. In Superset, on the governed metrics
(insights; FS-791).

**4.7 The model for actions and deadlines** (FS-794). Each institution
sets its own rules, against the same criteria, so that no two are
configured from a blank page and none falls below the floor. The rules
are configuration, maker-checker and effective-dated, agreed at
onboarding (OB-RO-04), and reviewed after any incident they took part in,
as the end-of-day runner's checks are.

*Which action a break gets.* Four questions, in order; the first "yes"
decides:

| # | The question | If yes | The floor the institution cannot lower |
|---|---|---|---|
| 1 | Is it a system fault: a source silent, a rail down, a checkpoint missing, the ledgers disagreeing? | An alert to on-call, by severity; the institution told as incident management says | A ledger disagreement is severity 2; a balance grown without money is severity 1 |
| 2 | Can a read settle it: a status query, a pulled transaction, a statement line, including posting money the rail's own record shows has moved (CO-20)? | Completed automatically by recon | Only on the rail's own record, never on an inference |
| 3 | Would settling it otherwise move money or change a balance: a reversal, a return, a correction? | A proposal through the institution's approval chain | Never automatic, whatever the amount |
| 4 | Otherwise | A ticket to the role that owns it, one per root cause | — |

*When a person must look first,* even where the rule would complete it
alone: above the institution's amount threshold; anything touching a
customer's money; anything with a regulatory side (sanctions, suspicious
patterns, unclaimed money, a missing reg 32 detail); the first time a
new kind of break is seen; any reversal. The institution may add to this
list, never remove from it.

*Each channel's deadlines.* Three clocks per channel, each from the
rail's own settlement rules, the regulations, the promise the
institution makes its customers, and its cut-offs on the business
calendar. The defaults below come from the journeys the owner agreed; an
institution may tighten them, and loosens one only within what the rail
and the law allow.

| Channel | Arrival to posting | In transit, clears by | A break owned by, and resolved by |
|---|---|---|---|
| M-Pesa paybill or till, in | Within a minute of M-Pesa's confirmation (JN-10) | The same cycle | Owned by 10:00 the next morning; an unplaced payment returned at day 7 (JN-16, JN-17) |
| M-Pesa payout | The status within the rail's timeout; pending until a query or the statement settles it | The same cycle | Owned by 10:00; never resent blind (JN-13) |
| Bank transfer in, the bank's API | Within an hour of its credit (JN-12) | The next business day | Unidentified: returned within five business days, or the bank's window if shorter (JN-12) |
| Bank transfer in, statement only | By 10:00 the morning after (JN-12) | The next business day | As above |
| Bank transfer out, EFT or RTGS | Released the same business day if instructed before the cut-off (JN-11) | EFT the next business day; RTGS the same day | Owned by 10:00; an unreleased instruction lapses at the end of its day (JN-11) |
| A ledger disagreement | — | — | Severity 2: acknowledged within 15 minutes, worked until explained (incident management) |

## 5 · Split transactions

A payment's legs are computed by the companion before they are matched:
for a C2B payment of 2,000, the amount received, the operator's fee from
its tariff, excise duty on the fee, and any sums owed to tax agencies or
other recipients. Each leg is matched on its own, so a payment that does
not reconcile shows which leg is wrong. Tariffs and tax rates are
versioned and effective-dated, so a past payment is checked against the
rates of its day (RO-02, RO-26).

## 6 · Sources

- **Adding a source is configuration:** an adapter for its format (MT940,
  CAMT.053, CSV, a rail's API, change-data capture), a mapping of its
  fields to the normalised event, and a mapping of its result codes to
  ours (RL-02). No code for a source whose format we already read.
- **Files are streamed,** never loaded whole, and checked before any line
  is matched (RO-01, FS-767).
- **A source that goes quiet is a break,** not a pass: each source has an
  expected rhythm, and silence past it raises an alert.

## 7 · Extensions

A catalogue of proven extensions (RO-28, phase 2; R1 and R2 run the same
actions built in), built, tested and signed by Dibon, which an
institution switches on and configures (FS-791). **Odoo first** (owner,
FS-794): raise and update a ticket in Odoo Helpdesk, then Zoho; alert; pause a rail; notify a customer through messaging;
propose a reversal for approval. Two kinds: **per transaction**, which act
on one customer's break, and **per system**, which act on a source or a
rail. Institutions never upload code; a new extension enters the
catalogue through change enablement, and runs only as a signed image
(SE-06, SE-12).

## 8 · What recon takes over, and how it meets the other modules

Comparisons of two records of money move into recon (FS-788); each module
keeps acting on the result.

| Module | Today | With recon |
|---|---|---|
| Approval engine | Its nightly comparison of Fineract with approved requests (approval-engine §9) | Recon raises it; the engine stays the authority |
| End-of-day runner | Its checks C3 to C6 and P5 | Recon computes them and publishes the result; the runner decides to hold or close, and its morning report takes recon's breaks and match rate |
| Lender rules | Allocation mismatches; interest, fees and the cap | The companion recomputes them; lender rules keep enforcing |
| Rails | Statements against payouts; returns and recalls | Recon confirms settlement and returns; rails execute and hold |
| Collect | Unplaced payments (CO-21) | Recon identifies by the payment reference and its check digits (FS-785) and holds; Collect does the outreach |
| Kapu Core | Postings and the close | The master: it emits postings and signed checkpoints; recon never writes to it |
| Escrow | The daily tie-out (ES-10) | Recon's, as a rule |
| Business suite | Core totals into Odoo's ledger (BS-08) | Recon ties the two out daily |
| Insights | Reads recon's metrics | Unchanged |
| Odoo | Helpdesk | Receives tickets from recon's extensions |

Comparisons that move no money stay with their owners, on the same
pattern: roles against approvals (access-keycloak §6), employees against
users, Dibon's access register, and configuration against code.

## 9 · Interfaces

**Consumed:** the rails' events, Kapu Core's events and checkpoints,
approvals (`kapu.mandates.request.approved`), statement files, the
master's balances by API.

**Published** (event bus catalogue, event-bus-kafka §5):
`kapu.recon.break.opened`, `.break.cleared`, `.break.escalated`,
`.ledger.disagreed`, `.completeness.failed`, `.source.silent`,
`.cycle.closed`, `.action.taken`.

**Endpoints:** the exception queue and its actions; completeness and
match-rate figures; a transaction's trace and its evidence export
(RO-25).

## 10 · Security and audit

- **One way.** The shadow and the companion read; nothing reads back from
  them into the master, and recon never writes to the master: a
  correction is an approved posting made by the product's service.
- **A separate security domain** for the shadow and the companion: their
  own databases, administrators and credentials, as the backups have
  (SE-20). Whoever can change the master cannot change them.
- **Signed events,** checked on arrival; each event id accepted once;
  signatures made with short-lived keys OpenBao issues to each service,
  not a call to OpenBao per event (§11).
- **The master's database** (FS-789): no superuser and no human login,
  break-glass only, two people, recorded; pgAudit and database activity
  monitoring shipped at once to write-once storage in another domain;
  each journal row hashed into the audit chain and rescanned; data fixes
  only as approved postings; schema changes only through the pipeline;
  point-in-time recovery to before any tampering (SE-22).
- **Recon's own store** is append-only, and its results are anchored in
  the transparency log the institution witnesses (RO-24).
- **Masking by role** (RO-19); Restricted data never in a break's record.

## 11 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| Normalised events and statement lines | Confidential | Seven years (POCAMLA s.46) | Payers', payees' and customers' |
| Matches, breaks, actions and their evidence | Confidential | Seven years | As above |
| The shadow ledger | Confidential | In memory, snapshotted hourly; rebuilt from the event bus | Account references only |
| The companion's postings and totals | Confidential | Seven years, beside the master's | Account references only |
| Tariffs and tax rates, versioned | Internal | For as long as any payment they priced is kept | — |

## 12 · Quality and metrics

**Targets** (docs/architecture/quality.md, "Scale"): per instance, 25
million accounts and 10 million transactions a day, 2,000 a second at
peak; the shadow within 5 seconds of the master; the companion's close of
every account within 2 hours; 98% of transactions matched automatically.
None is proven until the load test in §14 passes.

**How it reaches them:** the shadow's balances in memory in Valkey (BSD-3;
not Redis, now AGPL), rebuilt from the event bus after a restart;
stores partitioned by day and by account range, old partitions archived;
the companion's close run in parallel by account range; files streamed;
the transparency log anchoring chain heads, not each event.

**Metrics:** match rate by channel; break count and age; completeness by
channel; the shadow's lag; ledger disagreements; source silence. **Alerts**
(observability-grafana §4): a balance grown without money, severity 1; a
ledger disagreement or a failed completeness proof, severity 2; a silent
source, by its rhythm.

## 13 · Threats

| Threat | For example | The answer |
|---|---|---|
| Spoofing | A forged posting event | Events signed by the issuing service and checked on arrival |
| Tampering | A balance edited directly in the master's database | The companion has no posting for it: a severity 1; pgAudit and activity monitoring off the instance; journal rows rescanned against the chain |
| Tampering | Events withheld to hide a change | Per-account sequence numbers, signed checkpoints, and the master's API read on a second channel |
| Repudiation | "Who corrected that break?" | Every action attributed and chained; money actions through the approval chain |
| Information disclosure | A break's record exposes a customer | Masking by role; no Restricted data in a break |
| Denial of service | A flood of events at peak | Partitioned consumers that scale out; the shadow's lag alerted |
| Elevation of privilege | Recon used to move money | Recon never writes to the master; reversals only through the approval chain |
| Linkability (privacy) | Trends that profile one customer | Reports aggregate; a person's trace only for a break or a dispute |

## 14 · Acceptance tests

| # | Given | When | Then | Id, source |
|---|---|---|---|---|
| A1 | A posting in Kapu Core | Its event arrives | The shadow agrees within 5 seconds | RO-08 |
| A2 | An account's balance updated directly in the database | The companion's next check | A severity 1 alert; the account named; no posting found | FS-789 |
| A3 | An event withheld from the bus | The next checkpoint | A sequence gap and a checkpoint mismatch, both breaks | §3 rule 3 |
| A4 | A C2B payment of 2,000 with a fee and excise duty | Matched | Each leg matched on its own; a wrong fee shows on its leg | §5 |
| A5 | M-Pesa's day: 10,000 payments | The cycle closes | Completeness by count and amount; any difference a break | RO-04 |
| A6 | A break whose action is "reverse" | Proposed | Nothing reversed until the institution's chain approves | MD-01 |
| A7 | A source silent past its rhythm | The rhythm passes | An alert, not a pass | §6 |
| A8 | A new statement source in a known format | Configured | Read and matched with no code change | §6 |
| A9 | 10 million transactions in a day, 2,000 a second at peak | The load test | The shadow within 5 seconds; the companion's close within 2 hours | Quality |
| A10 | Recon's own result altered in its store | The chain is verified | The change shows | RO-24 |
| A11 | Lender-rules §2.9's worked example: KES 100,000, nothing repaid | The companion runs to day 121 | Its figures match the example's table on days 30, 61 and 120, and nothing accrues from day 121 | §3.1, MF-21 |
| A12 | The same loan, KES 30,000 paid on day 70 | Recomputed | All to principal; default interest 700 a day; the bucket reaches the cap on day 142 with 600 posted | §3.1, MF-22 |
| A13 | A repayment at 23:40 on day 30, posted at 06:00 on day 31 | Compared | Dated day 30; no default interest expected; Fineract's figures agree, or a break | §3.1.5, MF-22 |
| A14 | A repayment backdated by five days | Posted | The loan recomputed from that date; every later day compared again | §3.1.5 |
| A15 | Fineract allocates a payment to interest before principal | The posting's breakdown is compared | A break within 5 minutes, with both breakdowns; lender rules' own mismatch raised separately | §3.1.4 |
| A16 | Full early repayment on day 10 of a 30-day loan | Compared | Interest only to day 10; no fee; a difference is a break | §3.1.2, MF-22 |
| A17 | A loan restructured while non-performing | Recomputed | The open cap episode carried over; the new terms from the approval's figures | §3.1.2, MF-09 |
| A18 | The interpretation record's reading changes, effective from a date | Both read it | Loans recomputed from that date by both; no break from the change itself | §3.1.3 |
| A19 | The companion starts on day 20 | It replays the archive | Every loan since go-live recomputed; breaks recorded, not raised, until day 25 | §3.1.6 |
| A20 | An institution with its own core; a signed opening position at a cut-off, with two known open items | The comparison starts | Computed forward from the opening position; the two items open with owners; reports say "reconciled since" the cut-off | §3 rule 8 |
| A21 | A product setting changed directly in Fineract | The night's comparison | A severity 2 break naming the setting and the document's value | §3.1.4 |

## 15 · Open questions

**For the owner:**

1. Database activity monitoring: an open-source tool on pgAudit, or a
   proprietary one for banks that require it. Left open by the owner
   (FS-794).

**For the customer:** its rules against §4.7's model: its amount
threshold, who is the person in the middle, and any deadline it tightens
(onboarding OB-RO-04).
