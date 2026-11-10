---
id: rails
name: Rails — build specification
kind: spec
type: build
status: draft
released: unreleased
release: R1
implements: [rails]
depends_on: [transactions, approval-engine, event-bus-kafka]
used_by: [lending-service, deposits-service, recon]
owner: Solution architect
classification: Internal
review_ids: [FS-056, FS-093, FS-127, FS-208, FS-209, FS-586, FS-587, FS-588, FS-594, FS-611, FS-661, FS-1109, FS-1113, FS-1122, FS-1127, FS-1133, FS-1143, FS-1144, FS-1150, FS-1152, FS-1155, FS-1156, FS-1157, FS-1158, FS-1160, FS-1161, FS-1162]
last_reviewed: 2026-11-10
---

# Rails — build specification

How the platform moves money on every payment rail and bank, for R1,
written on [the transaction model](transactions.md) (FS-1155): one
interface that every product calls, one adapter per rail behind it, and
every outcome written to the transaction it belongs to. It answers FS-208
(the adapter interface) and designs FS-209 (how each rail's callbacks are
trusted), from the [rails module](../modules/rails.md), whose M-Pesa
connection ran in production at Onit Bank from February 2025 to June
2026 (RL-03). Nothing in this spec is built yet: every behaviour here is
**designed**, and each rail's own field names and limits are to confirm
against its documentation at the version we connect to.

## 1 · Purpose and scope

How money leaves and arrives on a rail, so that what was approved is
what is sent, and every outcome, or its absence, is recorded truthfully.

| Id | Capability | In R1 |
|---|---|---|
| RL-01 | One interface; every payout one instruction from approval to settlement; cancel, recall, reverse | Yes |
| RL-03 | M-Pesa (Daraja): push prompt, C2B, B2C, status, balance, reversal | Yes |
| RL-07 | Banks: API, host-to-host files, or a bulk file released by the institution's signatories | Yes |
| RL-10 | Unknown is a state | Yes |
| RL-12 | Credentials and signing keys in OpenBao, never exported | Yes |
| RL-14 | Idempotency: a repeat never pays twice | Yes |
| RL-20 | M-Pesa Pull Transactions, so a missed callback is found | Yes |
| RL-21 | M-Pesa's registered name before a payout | Yes |
| RL-29 | A bank account holder's name before a bank payout | Yes |
| RL-02 | One normalised event per call | Not yet: §13 question 1 |
| RL-11 | A callback the rail does not sign confirmed before it counts | Not yet: §13 question 1 |
| RL-22 | Safaricom's SIM-swap and IMSI check before money moves | Not yet: §13 question 1 |

**Out of R1:** Airtel Money and T-Kash (RL-04, RL-05: designed, their
dates to follow, FS-1109); PesaLink (RL-06, phase 2); cards and
processors (RL-08, RL-09); debit mandates and Ratiba (RL-16, RL-23);
other countries' rails (RL-18); SWIFT (RL-28). Each is one more adapter
behind the same interface: nothing above it changes when it comes.

**Where it sits.**

```
  +-------------------+   +-------------------+   +-------------------+
  | LENDING SERVICE   |   | DEPOSITS SERVICE  |   | RECONCILIATION    |
  | lends             |   | keeps deposits    |   | matches, by any id|
  | [kapu_service]    |   | [kapu_service]    |   | [kapu_service]    |
  +-------------------+   +-------------------+   +-------------------+
            |                       |                       |
            | pay out, resolve      | pay out, collect      | status, statements
            v                       v                       v
  +-------------------------------------------------------------------+
  | RAILS                                                             |
  | pays, collects                                                    |
  | [kapu_service]                                                    |
  +-------------------------------------------------------------------+
      |                   |                   |                   |
      | approval, by hash | credentials,      | instructions,     | footer entries
      |                   | signatures        | queries           |
      v                   v                   v                   v
  +-----------------+ +-----------------+ +-----------------+ +-----------------+
  | APPROVAL ENGINE | | OPENBAO         | | M-PESA          | | EVENT BUS       |
  | approves        | | keeps keys      | | moves money     | | carries, signed |
  | [kapu_service]  | | [openbao]       | | [rail]          | | [kafka]         |
  +-----------------+ +-----------------+ +-----------------+ +-----------------+
                                          +-----------------+
                                          | BANKS           |
                                          | move money      |
                                          | [rail]          |
                                          +-----------------+
```

**Reading it:** the products and reconciliation ask the rails; the rails
read the approval and check its hash, take credentials and signatures
from OpenBao, and send to M-Pesa or a bank, whose callbacks and statements
come back the same way; every outcome goes back to the product that asked
and, as footer entries, onto the event bus, which reconciliation reads.

**Related:** implements [rails](../modules/rails.md); depends on
[transactions](transactions.md), the model every instruction and outcome
is written in, [approval-engine](approval-engine.md), whose approval it
checks before sending, and [event-bus-kafka](event-bus-kafka.md); used by
[lending-service](lending-service.md) and
[deposits-service](deposits-service.md), which pay out and collect
through it, and [recon](recon.md), which queries status and fetches
statements through it; journeys none yet.

## 2 · Concepts

- **Adapter:** the code for one rail (M-Pesa's Daraja, a bank's API, a
  bank's files), behind the one interface (§4). A rail is added by adding
  an adapter.
- **Instruction:** what the rails send for one transaction: one per
  transaction, carrying our id (transactions rule 7). A payout from or to
  several accounts is several transactions, so several instructions
  (transactions rule 5).
- **The institution's account on a rail:** its shortcode (a paybill, a
  till, a B2C or B2B shortcode) or its bank account, the transaction's
  source for money out and destination for money in. The money is always
  the institution's, in its own account, never Dibon's (FS-056); the
  rails act on its credentials, under its written consent (RL-13).
- **Callback, status query, statement:** the three ways a rail tells us
  what happened. A callback is pushed to us; a status query is asked of
  the rail; a statement is the rail's record of a day. Only a statement
  or a confirmed status is final for a rail that does not sign its
  callbacks (rule 6).
- **Unknown:** sent, and the rail has not said what happened (RL-10).

## 3 · Rules

1. **One interface, every rail behind it** (RL-01, FS-093). Products call
   the operations in §4 and never a rail directly; an adapter translates
   them, and a rail's quirks stay inside its adapter.
2. **Every instruction is a transaction's** (transactions; FS-1155). The
   rails send nothing that is not a transaction on the model, and write
   every outcome to its footer: each status to `progress`, what moved to
   `settlement`, every id the rail returns to `ids` by issuer and scheme.
   Money arriving from outside is minted here, on first sight (a callback,
   a pulled transaction or a statement line), as a deposit or a
   repayment (transactions rule 7).
3. **What is approved is what is sent** (FS-588). Before sending, the
   adapter recomputes the body's hash and refuses an instruction whose
   hash differs from its approval's (transactions rule 2); any change
   reopens approval. It sends from the source the body names, and only
   there.
4. **Our id goes where each rail allows** (transactions rule 7): the txid
   without hyphens where a field takes 32 characters or more (Daraja's
   originator conversation id, a bank's end-to-end id), the reference
   where it takes fewer (an account reference, an occasion, a narration).
   An id the rail returns is never used as ours.
5. **Unknown is a state; nothing is resent blind** (RL-10, RL-14). A rail
   that does not answer in its window leaves the transaction unknown; a
   status query, Pull Transactions (RL-20) or the statement settles it.
   A retry reuses the instruction's idempotency key, and goes to the rail
   only when the rail has said the first did not happen.
6. **A callback counts only when it is proved** (RL-11, FS-209). A
   rail that signs its callbacks is checked by its signature; one that
   does not is confirmed by a status query before the outcome is final,
   and its source address checked as well. An unproved callback is held,
   never acted on. How each rail proves its callbacks is §6's, to confirm
   with each.
7. **The payee is checked before money goes** (transactions rule 4;
   RL-21, RL-29). An alias is resolved in two steps, the provider then
   the party, and the name returned matched against the payee's; at
   sending it is resolved again. A wallet's operator is taken from its
   national destination code and confirmed with that operator (FS-1144);
   its number's binding and SIM are checked (ID-12, RL-22). A payment to
   someone else is screened for sanctions and limits first (FS-1152).
   Each check is a footer entry; a failure holds the payout.
8. **Keys and credentials never leave OpenBao, and are rotated** (RL-12;
   FS-1156). Each institution's rail credentials are held there, per
   institution and rail; instructions to banks are signed inside it with
   the institution's key or its bank's certificate, never exported. A
   credential that can pay anyone, M-Pesa's B2C and B2B initiator above
   all, is released only to the rails' own service identity, and is
   usable at the rail only from the addresses registered with it. Each
   credential has a rotation schedule, set per rail in §6's terms and
   kept as a rail setting (rule 13): renewed before it lapses, with an
   alert ahead of the date; rotated at once when anyone who could reach
   it leaves, or when it may have been seen.
9. **Money returns only to where it came from** (RL-01). A reversal or a
   recall is a new transaction linked to the original (transactions rule
   5), back to the original's source; a return from the receiving side is
   the rail's fact, appended to the original before its reversal is
   created (transactions W7, W8).
10. **A degraded rail is paused, not hammered** (RL-15). When a rail's
    failures or latency pass its limits, new instructions to it wait,
    their products are told, and on-call is alerted; nothing is switched
    to another rail without a new transaction and its approval.
11. **The rails reach out only to the rails** (FS-1156). Their calls to
    every rail and bank leave through one egress gateway, from the fixed
    addresses registered with each rail, and are allowed only to that
    rail's own hosts, named in its adapter's configuration; every other
    destination is refused and alerted. No other service reaches a rail.
12. **A callback endpoint is hardened** (FS-1156). Each institution and
    rail has its own callback address, its path holding a secret that is
    rotated like a credential (rule 8); the gateway limits its rate, and
    refuses a callback whose rail id it has seen before, so a replay finds
    nothing to do. A rail that offers fixed source addresses has them
    allowed, and only them.
13. **A rail setting changes only through the approval engine** (FS-1156,
    FS-1157). Every setting that could redirect money or hide it (a
    shortcode, a callback address, a bank account, a bank's channel, its
    straight-through limit, a float threshold, a rotation schedule, a
    rail's hosts) is a request of subject type `rail.setting` on the
    approval engine: a chain of at least two people, the one who asks
    never the one who approves, more where the institution's mandate says;
    effective-dated, and each change an event. This is what the rails
    module's maker-checker means (RL-07, FS-611): the engine's smallest
    chain.
14. **Each paying account has float limits, at several thresholds**
    (FS-1156, FS-1158). The balance of every account the institution pays
    from (a B2C shortcode, a bank account) is read after every payout and
    on a schedule, and worked forward between reads from what was sent.
    Each account has thresholds, set as rail settings (rule 13), each with
    what happens and who is told (§6's float thresholds); and velocity
    limits, what may leave in an hour and in a day, so a drain made of
    payouts each valid on its own is stopped. The velocity limits are
    financial crime's transaction rules (FC-16) scoped to the paying
    account, one shape for every limit: a measure, a scope, a window and a
    threshold, against the usual for that type of day, looking below as
    well as above (FS-1160, FS-1162). A threshold crossed is a
    footer entry on the payout that crossed it, and an alert; at the
    floor, new payouts wait. Customers' own limits stay financial
    crime's (FC-16).

15. **Each rail is paced to what it takes** (FS-1161). The rails send to
    each rail no faster than its agreed rate (a shortcode's throughput, a
    bank's batch size and cut-offs), and queue the rest in the order
    approved; a peak raises the queue, never the rate past what the rail
    agreed. Each rail's rate is a rail setting (rule 13), raised with the
    rail ahead of a known peak (runbooks, peak and slow days).

## 4 · The interface

What every adapter offers, and what each writes to the transaction.

| Operation | In | Out, and what it writes | R1 rails |
|---|---|---|---|
| resolve | An alias (transaction-fields §3) | The address, the name returned, the directory; `parties.destination.resolution` | M-Pesa (registered name, RL-21); banks (account validation, RL-29) |
| confirm_operator | A wallet's number | Whether it is on the operator its code suggests now; a `progress.checks` entry | M-Pesa, when the query is agreed (§13 question 2) |
| check_sim | A wallet's number | Whether its SIM changed since enrolment; a `progress.checks` entry | M-Pesa, when RL-22 is in R1 |
| quote | A source, a destination, an amount | The rail's charge, for the product's quote before approval (transactions rule 8) | Each, from its tariff |
| pay_out | An approved transaction | `sent`, then `settled`, `rejected` or `unknown`; the rail's ids | M-Pesa B2C and B2B; banks |
| collect | A transaction asking a payer to pay (a push prompt) | The prompt's outcome; the payment as a settled transaction | M-Pesa Express |
| receive | A callback or a pulled line | A new transaction, minted here, or the outcome of one we sent | M-Pesa C2B; banks' notifications |
| status | A transaction we sent | Its outcome as the rail has it; settles an unknown | M-Pesa transaction status; banks' status reports |
| balance | The institution's account on the rail | Its balance, labelled with when it was read, never an authority | M-Pesa account balance; banks |
| statement | The institution's account, a day | Every line, for reconciliation and for minting what callbacks missed | M-Pesa Pull Transactions; banks' MT940, CAMT.053 or CSV |
| cancel | A transaction not yet processed | `cancelled` | Where the rail allows |
| recall, reverse | A settled transaction, approved | A new linked transaction (rule 9) | M-Pesa reversal; a bank's recall request |

## 5 · States

The rails write the transaction's states (transactions §5); this is how
each rail's answer maps to them.

| The rail says | The transaction becomes | Reason |
|---|---|---|
| Accepted for processing | `sent` | — |
| Completed (M-Pesa's result code 0; a bank's settled status) | `settled`, with the settled amount and the rail's time as reported | — |
| Refused, with a code | `rejected` | The rail's code mapped to an ISO 20022 reason (transaction-fields §3); unmapped, MS03 with the rail's code in the note |
| Nothing within the rail's window | `unknown` | AB05 |
| Sent back after settling (account closed, name mismatch) | `returned`, then a reversal created (rule 9) | AC04, BE01 and the rest, from the return |
| A callback not yet proved | No change: held until rule 6 proves it | — |

## 6 · The adapters

| Rail | Our id carried in | Its outcome comes by | Its callbacks proved by | Its statement | In R1 |
|---|---|---|---|---|---|
| M-Pesa B2C and B2B (Daraja) | Originator conversation id (the txid); occasion or account reference (the reference) | Result callback; transaction status query | Status query, and Safaricom's published source addresses; no signature known (to confirm) | Pull Transactions; the shortcode's statement | Yes |
| M-Pesa C2B (Daraja) | The payer types the account reference: an alias for a loan or account (RO-02) | Confirmation callback; validation where Safaricom enables it | As above | As above | Yes |
| M-Pesa Express (push prompt) | Account reference (the reference, within its 12 characters, to confirm) | Callback; push query | As above | As above | Yes |
| A bank by its API | End-to-end id (the txid, 32 characters, within 35) | The bank's status; its notification | Mutual TLS and the bank's signature, per bank (to confirm) | Its API, or MT940, CAMT.053 or CSV | Yes, per bank |
| A bank by host-to-host files | End-to-end id in the ISO 20022 payment file | Its status report file | The file's channel (SFTP with keys) and its signature | Its statement file | Yes, per bank |
| A bank by internet banking | The reference, in the bulk file's narration | The institution's signatories release it at the bank; the statement closes it | Not a callback: the statement is the proof | Its statement | Yes: R1's fallback (RL-07) |
| An M-Pesa paybill at a bank | The account number, then the loan's reference where the bank passes it on (FS-1133) | The bank's notification or statement, never a Daraja callback | As the bank | The bank's statement | Yes |
| Airtel Money, T-Kash | Each one's own fields (to confirm) | Callback; enquiry | To confirm | Each one's statement | No: designed |

A bank's channel is configuration, per institution and bank account, and
so is its straight-through limit from the bank's mandate letter, above
which the institution's signatories also release the file (RL-07,
FS-594, FS-611); each is a rail setting, changed only through the
approval engine (rule 13).

**Float thresholds** (rule 14). Each paying account's levels, set by the
institution at onboarding in amounts and checked against its usual day;
the defaults below are where it starts, in hours of its usual payouts:

| Level | When | What happens | Who is told, and how |
|---|---|---|---|
| Plenty | Above the top-up level | Nothing | — |
| Top up | Below about two days of payouts | Payouts go on | The institution's finance role, by email and in the console, once a day until topped up |
| Low | Below about one day | Payouts go on; their products warned that the float is low | Finance and the operations lead, by SMS and email, at once |
| Critical | Below about four hours | Payouts go on; any above a set size held for a person to release | Finance, the operations lead and our on-call, by SMS and a call |
| Floor | Below the largest payout waiting, or a set amount | New payouts wait; nothing is rejected; they go once topped up, in the order approved | All of the above; the products tell the customers their payout is waiting |
| Velocity | More left in an hour or a day than its limit, an FC-16 rule on the paying account | Further payouts wait for a person to release them | Finance, the operations lead and our on-call, at once: a possible drain |

The usual each level and limit is measured against is the usual for that
type of day (core KC-15): a month-end against month-ends, a public holiday
against holidays, so a known peak or a slow day does not alert falsely
(FS-1161, FS-1162).

A collections account may have an upper level too, above which the
institution sweeps it to its bank; whether it does is its choice.

**Credentials, by rail** (rule 8): each one's rotation is set when the
rail is connected, to the rail's own rules where it has them, else every
ninety days, and to confirm with each rail:

| Rail | Credentials | Renewed |
|---|---|---|
| M-Pesa (Daraja) | The app's consumer key and secret; the initiator's name and password, sent encrypted with Safaricom's certificate; the push prompt's passkey | On the schedule, and at once when anyone who could reach them leaves |
| A bank by API | Its client certificate for mutual TLS; its API keys | Before the certificate lapses; keys on the schedule |
| A bank by files | The SFTP key; the institution's signing key or the bank's certificate | As above |
| A bank by internet banking | The institution's signatories' own logins: theirs, never held by us | By the bank's own rules |

## 7 · Interfaces

- **To products:** the operations of §4, as one internal API, each call
  carrying the transaction and the caller's service identity; its
  contract an OpenAPI 3.1 file with the code.
- **From rails:** one callback endpoint per rail and institution, behind
  the gateway, answering at once and doing nothing until rule 6 proves
  what it was told.
- **Events:** every footer entry the rails write goes onto the event bus
  inside the existing money events (transactions §6; event-bus-kafka §5),
  signed with the rails' own identity; no rails events of their own.
- **Recon:** status queries and statement pulls on its request, for items
  in transit and breaks (recon §4.4).

## 8 · Security and audit

- **Who may call:** the lending and deposits services and recon, by their
  service identities; no person calls the rails directly.
- **Every call to a rail is kept,** request, response and timing,
  append-only, without its credentials (rails module §4).
- **Never logged:** a credential, a token, a signing key, a full account
  or phone number (masked, as every log is: architecture README §7).
- **Network:** each rail reached from fixed source addresses or a private
  link where it asks for one, from the in-country deployment; mutual TLS
  to every bank.

## 9 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| Every call to a rail, its request and response | Confidential | As the transactions they belong to (DT-23) | Payer and payee names and numbers |
| Statements fetched | Confidential | As the transactions | The same |
| Credentials and keys, in OpenBao | Restricted | Until the institution's agreement ends; then destroyed | None |
| Rail health and latency | Internal | As observability keeps metrics | None |

## 10 · Quality and metrics

The rails run at the platform's highest tier (architecture quality), and
add:

| Metric | Alert |
|---|---|
| Instructions unknown past their rail's window | Any (RL-10) |
| Callbacks held unproved | One older than its status query's window |
| A rail's failure rate or latency past its limit | The rail paused (rule 10); on-call alerted |
| Money arriving minted from a statement line, not a callback | A rise above the day's usual: callbacks are being missed |
| An instruction refused for a hash that differs | Any: someone changed an approved payment |
| A float threshold crossed | Each level as §6 sets it |
| Outflow past a velocity limit | Any: payouts wait; on-call called |
| A call to a host outside a rail's list | Any: refused at the egress gateway |
| A callback replayed, or past its rate limit | A rise above the usual |
| A credential within its warning period | Each, until renewed |
| Collections far below the usual for the hour and type of day | Any: a rail or its callbacks may be failing silently; recon pulls the rail's transactions at once (FS-1162) |
| Requests on a channel far below the usual | Any: the channel may be down (FS-1162) |
| Payouts sent far below payouts approved | Any: holds too strict, or a rail paused (FS-1162) |
| A rail's queue longer than its rate clears before its cut-off | Any: the rail asked for more, or the institution told (rule 15) |

## 11 · Threats

| Threat | For example | The answer |
|---|---|---|
| Spoofing | A forged callback says a repayment arrived | Rule 6: proved by signature, or confirmed by status query, before it counts |
| Tampering | The account number changed after approval | Rule 3: the hash checked before sending |
| Repudiation | A payout nobody admits releasing | Every call kept; the approval and the bank-side release linked (RL-07) |
| Information disclosure | A rail credential copied from a server | Rule 8: in OpenBao, never on a disk or a device |
| Denial of service | A rail down, retries piling up | Rule 10: the rail paused; rule 5: nothing resent blind |
| Elevation of privilege | A service sends a payout it has no approval for | Rule 3: no approval, no instruction |
| Linkability (LINDDUN) | A reference that reveals a borrower | Our ids carry no personal data (transactions rule 7) |
| Identifiability (LINDDUN) | A phone number in a rail's log | Masked in every log (§8) |
| Tampering | A callback address changed to an attacker's | Rule 13: every rail setting through the approval engine, two people at least |
| Spoofing | A captured callback replayed | Rule 12: a secret path, a rate limit, a rail id seen once |
| Information disclosure | A compromised service sends data to an outside host | Rule 11: one egress gateway, only each rail's hosts |
| Elevation of privilege | The B2C initiator's password used to pay from elsewhere | Rule 8: released only to the rails' identity, usable only from registered addresses, rotated |
| Denial of service | The float drained by many small payouts, each approved | Rule 14: velocity limits; payouts wait at the floor |

## 12 · Acceptance tests

| # | Given | When | Then | Id, source |
|---|---|---|---|---|
| A1 | Transactions W1, approved | Its amount is changed before sending | Refused: the hash differs | RL-01, rule 3 |
| A2 | W1 sent by B2C | M-Pesa does not answer in its window | Unknown; a status query settles it; nothing resent | RL-10, rule 5 |
| A3 | W1 retried by its product | The same idempotency key arrives | The same transaction; M-Pesa asked once | RL-14, rule 5 |
| A4 | A C2B confirmation that M-Pesa's status query does not know | It arrives | Held; never posted | RL-11, rule 6 |
| A5 | A C2B payment whose callback never came | Pull Transactions runs | The payment found, minted as a repayment, its account reference resolved to the loan | RL-20, rule 2 |
| A6 | W1's number, whose registered name does not match the borrower's | It is resolved before approval | Held, reason BE01 | RL-21, rule 7 |
| A7 | W7, a bank payout | The bank returns it, account closed | W7 returned, then reversal W8 created, back to W7's source | rule 9 |
| A8 | W11 and W12, one loan from two accounts | Each is sent | Each from its own source, with its own id; W10 settled once both have | rule 3 |
| A9 | A bank file above the mandate letter's limit | It is approved | Released at the bank by the institution's signatories, its totals and hash checked | RL-07 |
| A10 | M-Pesa failing past its limit | New payouts come | They wait; their products are told; on-call alerted | rule 10 |
| A11 | A paybill payment at the institution's bank | The bank's statement arrives | Minted from the line, matched by the reference the bank passes on | RL-07, FS-1133 |
| A12 | Any rail's adapter | Its simulator produces every outcome, silence included | Each maps to its state in §5 | RL-17, §5 |
| A13 | The B2C shortcode's float | A payout takes it below the low level | Payouts go on; finance and the operations lead told by SMS and email; the crossing on that payout's footer | rule 14 |
| A14 | The float below the largest payout waiting | A new payout is approved | It waits, is not rejected, and goes once the float is topped up | rule 14 |
| A15 | KES 2 million paid out in an hour against a limit of 1 million | The next payout comes | It waits for a person; on-call called | rule 14 |
| A16 | A request to change the callback address | The one who asked approves it | Refused: a second person must | rule 13 |
| A17 | The rails | A call to a host not in the rail's list | Refused at the egress gateway, and alerted | rule 11 |
| A18 | A C2B confirmation already received | It arrives again | Nothing done a second time | rule 12 |
| A19 | The initiator's password | Its rotation date nears | An alert ahead; renewed before it lapses | rule 8 |
| A20 | A month-end, its usual three times an ordinary day | Payouts run at twice an ordinary day | No velocity alert: the month-end's usual is the baseline | rule 14, KC-15 |
| A21 | M-Pesa's agreed rate for the shortcode | Payouts arrive faster than it | They queue in the order approved; none is sent faster than the rate | rule 15 |
| A22 | An ordinary weekday at noon | C2B collections in the last hour are a tenth of the usual | An alert; recon pulls the shortcode's transactions | §10, FS-1162 |

## 13 · Open questions

**For the owner:**

1. **R1's scope:** RL-02 (the normalised event), RL-11 (an unsigned
   callback confirmed) and RL-22 (the SIM-swap check) are used by this
   spec's rules and by the transactions spec, but are not in the delivery
   plan's R1. Bring them into R1, which the scope check counts, or say
   what holds in R1 without them.
2. **How each operator confirms a number** (FS-1144): the query each
   offers over our connections.
3. **Each rail's callbacks** (FS-209): whether Daraja signs its callbacks
   now, the source addresses it publishes, and each bank's mechanism;
   read from each rail's documentation, not from memory.
4. **Field limits:** Daraja's account reference, occasion and remarks
   lengths, and each bank's narration, against our eleven-character
   reference.

**For the customer:** which of its banks offers an API or host-to-host
files, and the straight-through limit in each mandate letter (RL-07);
its float thresholds and velocity limits for each paying account, and who
in finance is told at each level (rule 14).
