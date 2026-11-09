---
id: transactions
name: Transactions — build specification
kind: spec
type: build
status: draft
released: unreleased
release: R1
implements: [rails, recon-observability, core]
depends_on: [event-bus-kafka]
used_by: []
owner: Solution architect
classification: Internal
review_ids: [FS-1119, FS-1120, FS-1121, FS-1122, FS-1123, FS-1124, FS-1125, FS-1126, FS-1127, FS-1128, FS-1129, FS-1131]
last_reviewed: 2026-11-09
---

# Transactions — build specification

One model of a money movement for every component, so that a field means
the same thing to the rails, the core, the back office and
reconciliation (FS-1119). It sets the transaction's shape (a header fixed
at creation, a body fixed at approval, a footer only ever appended to),
its kinds, its links, its ids and its versions, and the standards it uses.
Each field is defined once in [the field dictionary](../transaction-fields.md);
the typed form, the rules a schema cannot say and nine worked
transactions (W1 to W9) are in
[code/transactions](../../code/transactions/README.md). Decided by the
owner in FS-1123 (decisions 1 to 4) and FS-1131 (5 to 10, with the amount
type). Nothing is built: every behaviour here is **designed**.

## 1 · Purpose and scope

What a money movement is, wherever it is recorded, and how every
component names, links, identifies and changes it.

| Id | Capability | In R1 |
|---|---|---|
| RO-23 | One identifier end to end, every step a signed event | Yes |
| RO-24 | Each transaction's events hash-chained | Yes |
| RL-01 | One instruction per payout, one id from approval to settlement | Yes |
| RL-10 | Unknown is a state | Yes |
| RL-14 | Idempotency: a repeat never pays twice | Yes |
| RO-02 | Matching one to one, one to many, many to many | Yes |

**Out of R1:** the `instrument` field (TF-51), for an investment product
(FS-1120, LQ-38); card payments, which never reach us (RL-08); IBANs and
other countries' schemes, defined so that nothing changes when they come.

**Where it sits.**

```
  +-------------------+                          +-------------------+
  | LENDING SERVICE   |  body to approve, hash   | APPROVAL ENGINE   |
  | mints, for loans  |------------------------->| approves          |
  | [kapu_service]    |                          | [kapu_service]    |
  +-------------------+                          +-------------------+
  +-------------------+                          +-------------------+
  | DEPOSITS SERVICE  |  postings, by txid       | CORE ADAPTER      |
  | mints, deposits   |------------------------->| posts             |
  | [kapu_service]    |                          | [kapu_service]    |
  +-------------------+                          +-------------------+
  +-------------------+                          +-------------------+
  | RAILS             |  header, body, footer    | EVENT BUS         |
  | mints, money in   |------------------------->| carries, signed   |
  | [kapu_service]    |  entries, as events      | [kafka]           |
  +-------------------+                          +-------------------+
                                                           |
                                                           | every entry
                                                           v
                                                 +-------------------+
                                                 | RECONCILIATION    |
                                                 | matches, by any id|
                                                 | [kapu_service]    |
                                                 +-------------------+
```

**Reading it:** each arrow from the left is drawn from one minter but
holds for all three. Whichever mints a transaction (rule 7) asks the
approval engine to approve its body when money goes out, posts it through
the core adapter, and publishes every part as an event; reconciliation
reads them all and keeps the index that finds a transaction by any id.

**Related:** implements [rails](../modules/rails.md),
[recon-observability](../modules/recon-observability.md) and
[core](../modules/core.md); depends on [event-bus-kafka](event-bus-kafka.md);
used by none yet (each money spec adopts it when next revised, §12);
journeys none yet.

## 2 · Concepts

- **Transaction:** one money movement, or one change to a balance by
  hand (a write-off, an adjustment), in one institution's books.
- **Header, body, footer:** what is fixed when the transaction is created,
  what is fixed when it is approved, and what is appended after (§4).
- **Identifier, address, alias** (FS-1122), kept apart: an *identifier*
  says who or what (a BIC, an LEI, a registration number); an *address*
  says where money lands (a bank account, a wallet); an *alias* points to
  an address (a phone number, a paybill and account reference). A phone
  number is a wallet's address and may be an alias; it is never an
  identity (ID-12).
- **Allocation, split, many-to-one, batch** (FS-1124), kept apart: an
  *allocation* is how one payment settles a loan's principal, interest and
  fees, the footer's breakdown, never separate transactions; a *split* is
  one payment for several obligations, a parent with its parts; *many
  payments to one loan* are each linked to the loan's account, not to each
  other; a *batch* is a container for a run, each item its own
  transaction.
- **Amount type** (FS-1129, from Mojaloop): `send` fixes what leaves the
  payer, charges marked deducted coming out of it; `receive` fixes what
  the payee gets, charges on top.
- **Component map:** a component's own field names, by its version, against
  the dictionary's (dictionary §4).

**The standards it uses** (FS-1121, FS-1126):

| Standard | For |
|---|---|
| ISO 4217 | Every currency, and how many minor units it has (rule 3) |
| ISO 3166-1 alpha-2 | Every country: a party's, a bank account's, the issuer of a national identifier (rule 6) |
| ISO 20022 | Status, reason and purpose codes, the identifier schemes, and the name of each field's equivalent (dictionary §3) |
| ISO 9362, ISO 17442, ISO 6166 | BIC, LEI and ISIN, the international identifiers (rule 6) |
| ITU-T E.164, E.212 | A mobile number; a network, by its country and network codes (rule 4) |
| ISO 13616 | An IBAN, for an account abroad; Kenya does not use them (to confirm) |
| RFC 9562 | The txid, a UUIDv7 (rule 7) |
| Crockford base 32, ISO 7064 | The short reference and its check symbol (rule 7) |
| RFC 3339, ISO 8601 | Times in UTC and dates (rule 9) |
| RFC 8785, SHA-256 | The body's canonical form and its hash (rule 2) |
| CloudEvents 1.0, W3C trace context | The envelope every part travels in (event-bus-kafka §4) |
| Mojaloop FSP Interoperability API | Alias types, the two-step lookup, the quote before the transfer, the amount type (FS-1129) |
| PCI DSS | Met by never holding a card number (RL-08) |

## 3 · Rules

1. **Defined once.** Every field a transaction carries is a row of the
   dictionary, with its meaning, what it is not, its type, unit, class
   and ISO 20022 equivalent; every component maps its own names to it,
   and an event's data that uses a field outside it fails the pipeline's
   contract test (FS-1119; FS-697).
2. **Fixed, then appended.** The header is fixed when the transaction is
   created and the body when it is approved; the approval holds the
   SHA-256 of the body's canonical JSON (RFC 8785), and nothing is sent
   whose body differs (FS-588, RL-01). The footer is only appended to,
   each entry a signed event in the transaction's hash chain (RO-23,
   RO-24). Money going out, a reversal, a refund, a write-off and an
   adjustment are approved before they move; the engine's policy may
   grant an approval automatically, but the approval is always recorded.
3. **Money.** Every amount is an integer of the currency's minor units
   and an ISO 4217 code: `{minor: 250000, currency: "KES"}`. The `amount`
   is as instructed or as received; charges, the settled amount and the
   allocation are fields of their own; the `amount_type` says which side
   the amount is fixed on, so the settled amount follows from the amount
   and the deducted charges (FS-1123 decision 2, FS-1129; LQ-37). W1:
   KES 100,000 sent, a KES 5,000 fee and KES 1,000 excise duty on it
   deducted, KES 94,000 settled.
4. **Aliases.** An alias is resolved before approval, in Mojaloop's two
   steps: which provider holds it, then who the party is, with the name
   returned and matched against the payee's (BE01 when it does not
   match). The body holds the address it resolved to, the alias as
   entered and the resolution; the hash covers them. At sending the alias
   is resolved again, and a wallet's number is checked still bound to the
   payee (ID-12) and its SIM unchanged (RL-22): a different address or a
   failed check holds the payout, and it goes only as a new transaction
   that `replaces` it, approved again (FS-1122).
5. **Links point back; the target's footer records them.** A link sits in
   the header, is fixed at creation, points to an earlier transaction of
   the same institution and currency, and comes from a closed list
   (dictionary §3). Creating it appends the forward fact to the target's
   footer (`reversed_by`, `refunded_by`, `has_part`) in the same step, by
   the service creating the link; the target's own status does not change
   because of it, so a settled payout that is reversed stays settled, and
   its net is read from its `linked_by`. A rail's return is the rail's
   fact: it appends `returned` to the original first (W7), then the
   reversal is created (W8). A reversal is a new transaction in the
   opposite direction, never an edit; reversals and refunds together
   never exceed the original; a split's parts sum to their parent (W2 to
   W4) (FS-1124, FS-1131).
6. **Identifiers: international first.** An identifier is a scheme and a
   value: international schemes first (BIC, LEI, ISIN), then Kenya's
   where Kenya is the authority (a company's BRS number, an
   organisation's KRA PIN), each with its ISO 3166 issuer; our own only
   where none exists, as for the txid. A person is a party by our
   customer reference, with a name: a person's government ID number is
   Restricted and never in a transaction (architecture README §7; FS-1121).
7. **Ids: minted once, others kept by issuer.** The txid is a UUIDv7,
   minted by the first of our components to know of the movement: the
   lending or deposits service for a request, cash at a counter or a
   run of the end-of-day runner; the rails when money arrives; the core
   adapter for a posting made in an institution's own core in the split
   mode (FS-1127, FS-1128). Its short reference is ten Crockford base-32
   symbols and a check symbol. A retry with the same idempotency key is
   the same transaction (RL-14). Outbound, our id goes where each rail
   allows (dictionary §4); every other party's id is appended to the
   footer by its issuer and scheme, and one index finds the transaction
   by any of them. No id or reference carries personal data.
8. **Charges, tax and rounding.** Each charge is its own line; a tax on a
   fee is its own line pointing to that fee (excise duty, as the product
   states), and a tax on interest its own line (withholding tax, W9).
   Charges known before approval are in the body, as Mojaloop's quote
   puts them before the transfer; the rail's charges as it reported them
   are in the footer. Amounts are rounded only where a product term says;
   a remainder goes to the last line, so the lines always sum (FS-1126).
9. **Dates and times.** Three dates on every money record, as the
   architecture sets them (architecture README §10): the value date, the
   business date and our created time; the booking time beside them.
   Times are RFC 3339 in UTC; a rail's own time is kept as it reported
   it (`reported_at`).
10. **Versions.** The model is MAJOR.MINOR (1.0 now). A minor version only
    adds; a reader validates data against the version its event names
    (`dataschema`), reads the fields it knows and holds the rest. A major
    version removes or changes a type or unit, under new event names
    ending `.v2`, run beside the old. A field's meaning never changes: a
    new field instead, the old one deprecated first with its replacement
    and date. Each component map follows that component's own version.
    A transaction keeps the version it was written under and is never
    migrated: old versions are read through tested converters, and every
    version's schema is kept as long as the records (DT-23) (FS-1125).

## 4 · The transaction

**Its parts** (each field: dictionary §2):

| Part | Fixed | Holds |
|---|---|---|
| Header | At creation | txid, reference, model_version, kind, institution, channel, rail, created_at, initiated_by, idempotency_key, product_version, account, links |
| Body | At approval, under the hash | amount, amount_type, direction, payer, payee, destination, purpose, charges, instrument, expires_at |
| Footer | Never: appended to | approval, status_history, checks, external_ids, dates, settled, rail_charges, allocation, ledger_entries, recon, linked_by, changes |

It travels in the CloudEvents envelope (event-bus-kafka §4), whose `txid`
is the header's and whose `prevhash` and `sig` prove each footer entry's
order and author.

**The kinds.** Each kind is a profile of the one model:

| Kind | Direction | Approved before it moves | Must link | Minted by | Worked |
|---|---|---|---|---|---|
| disbursement | out | Yes | — | Lending service | W1, W7 |
| repayment | in; a part internal | No | `part_of`, when split | Rails on first sight; the lending service for the parts | W2 to W5 |
| deposit | in | No | — | Deposits service, or the rails for money arriving | — |
| withdrawal | out | Yes | — | Deposits service | — |
| transfer | internal | Yes | its legs `part_of` it | Deposits service | — |
| interest | internal | No | `in_batch` | Deposits service, in the end-of-day run | W9 |
| fee | internal | No | `fee_for`, where it is for one | The service of the account | — |
| reversal | opposite to the original | Yes | `reverses`, exactly one | Whoever learns of it: the rails for a return | W8 |
| refund | out | Yes | `refunds`, exactly one | The service of the account | W6 |
| write_off | internal, no rail | Yes | — | Lending service | — |
| adjustment | internal | Yes | `corrects`, exactly one | The service of the account | — |

**The worked set** ([examples.json](../../code/transactions/examples.json)):

| # | What happens | What it shows |
|---|---|---|
| W1 | A KES 100,000 loan paid to the borrower's M-Pesa: fee and excise deducted, KES 94,000 settled | Rules 2, 3, 4, 7, 8: approval hash, amount type, alias resolved again with number and SIM checks, M-Pesa's and Fineract's ids in the footer |
| W2 | One paybill payment of KES 12,000 for two loans | A parent: the alias is the paybill and the account reference |
| W3, W4 | Its two parts, KES 8,000 and KES 4,000, each allocated | Parts sum to the parent; allocation sums to what settled |
| W5, W6 | A payment made twice; the duplicate refunded, reason DUPL | A refund approved before it moves; `refunded_by` on W5 |
| W7, W8 | A bank payout returned for a closed account (AC04); its reversal | `returned` appended by the rail, then `reversed_by` on W7 |
| W9 | A month's interest on a deposit, withholding tax deducted, in the run's batch | Tax as its own line; one txid per account in a batch |

## 5 · States

| From | To | When |
|---|---|---|
| created | awaiting_approval | Money out, or a change by hand, is asked for |
| awaiting_approval | approved | The engine approves the body's hash |
| awaiting_approval, approved | cancelled | Withdrawn before sending |
| awaiting_approval, approved | expired | `expires_at` passes |
| approved | held | A check before sending fails (rule 4) |
| held | cancelled | Not cleared; a new transaction `replaces` it |
| approved | sent | Every check passed; given to the rail |
| sent | unknown | The rail has not answered in its window (RL-10) |
| sent, unknown | settled | The rail confirms, or a status query or statement shows it |
| sent, unknown | rejected | The rail refuses, with its reason |
| settled | returned | The receiving side sends it back (W7) |
| created | settled | Money in, as the rail reports it, or a book entry (W2, W9) |

Each state is a footer entry, with who and when and the ISO reason; its
ISO 20022 status is in dictionary §3.

## 6 · Interfaces

| What | Who offers it | What crosses |
|---|---|---|
| Resolve an alias | Rails | An alias in; the address, the name returned and the directory out, in Mojaloop's two steps (rule 4) |
| Quote | The lending or deposits service, with the rails' tariff | The charges and the settled amount, before approval (rule 8) |
| Approve | Approval engine | The body's hash in; the approval's reference out (rule 2) |
| Events | Every minter | Each existing money event in the catalogue (event-bus-kafka §5) carries, as its data, the transaction or the footer entries it appends, against the schema at the version in `dataschema`; which events carry which part is §12's first question |
| Find by any id | Reconciliation | A scheme, a value and an issuer in; the txid out (rule 7) |
| The schema, rules and examples | code/transactions | Read by the docs' check today, by each service's contract tests when built |

## 7 · Security and audit

- **Who writes what:** the header by the minter; the approval only by the
  approval engine's identity; each footer entry by the service that saw
  the fact, signed with its own identity (RO-23). A person's change
  carries their role and, for anything that moves money or changes a
  balance, its approval's reference.
- **Never edited:** a body that differs from its hash is refused before
  sending; a footer entry removed or reordered breaks the chain (RO-24).
- **Never held:** a person's government ID number (rule 6), a card number
  (RL-08), a credential.
- **Logs:** a txid and a reference may be logged; a name, a phone number
  or an account number only masked (architecture README §7).

## 8 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| Transactions: header, body, footer | Confidential | As disbursement and repayment records (DT-23): 7 years from the transaction; 12 years from default for a secured loan written off or in recovery | Borrowers' and members' names, phone numbers, account numbers |
| The index of external ids | Internal | As the transactions | None: ids only |
| Each version's schema and converters | Internal | As long as any transaction written under it | None |

## 9 · Quality and metrics

It inherits each owning service's targets (docs/architecture/quality.md);
it adds these:

| Metric | Alert |
|---|---|
| Events whose data fails the schema | Any: the producer is stopped from publishing the version |
| Transactions in unknown | One older than its rail's window (RL-10) |
| Payouts held at sending | A rise above the day's usual rate |
| Links whose target lacks the forward fact | Any, in the night's checks |
| Finding by an id | 95% within 100 ms |

## 10 · Threats

| Threat | For example | The answer |
|---|---|---|
| Spoofing | A forged callback claims a payment arrived | Callbacks verified by the rails; each external id kept with its issuer; events signed by the service's identity (RO-23) |
| Tampering | The account changed after approval | The approval's hash over the body (rule 2); the footer in a hash chain (RO-24) |
| Repudiation | Nobody owns a manual correction | Each change names who, in what role, why and under which approval (TF-29) |
| Information disclosure | A national ID number in an event | Never in a transaction (rule 6); classes per field (dictionary §2) |
| Denial of service | A rail retries a callback a thousand times | The idempotency key and the external id's issuer and scheme find the same transaction (rule 7) |
| Elevation of privilege | A service approves its own payout | Only the approval engine's identity writes an approval (§7) |
| Linkability (LINDDUN) | A reference reveals a borrower | Ids and references carry no personal data (rule 7) |
| Identifiability (LINDDUN) | A phone number as an alias in logs | Masked in logs (§7); Confidential in events |

## 11 · Acceptance tests

| # | Given | When | Then | Id, source |
|---|---|---|---|---|
| A1 | W1 approved | Its amount is changed before sending | Not sent: the hash differs | RL-01, rule 2 |
| A2 | W1 settled | A footer entry is removed | The chain breaks, and the night's checks report it | RO-24, rule 2 |
| A3 | A payout request | It is retried with the same idempotency key | The same txid; paid once | RL-14, rule 7 |
| A4 | A refund | It links to a transaction of another institution, or a later one | Refused | rule 5 |
| A5 | W7 returned | The reversal W8 is created | W7's footer gains `reversed_by` W8; W7 stays settled, then returned | rule 5 |
| A6 | W5 | A second refund would take refunds above KES 8,000 | Refused | rule 5 |
| A7 | W2 | Its parts W3 and W4 are posted | They sum to KES 12,000; each allocation sums to its part | rule 5, rule 8 |
| A8 | W1 for approval | The approver opens it | The fee, the excise duty and KES 94,000 to the borrower are shown | rule 3, rule 8 |
| A9 | W1 approved | The number resolves to another wallet at sending | Held; sent only as a new transaction that replaces it, approved again | rule 4 |
| A10 | W1 approved | The SIM was swapped since enrolment | Held | RL-22, ID-12, rule 4 |
| A11 | An alias resolved | The name returned does not match the borrower's | Held for the approver, reason BE01 | rule 4 |
| A12 | W1 sent | M-Pesa does not answer in its window | Unknown, until a status query settles it | RL-10 |
| A13 | A paybill payment with an account reference | It arrives | The rails mint its txid; the reference resolves to the loan's account | RO-02, rule 7 |
| A14 | A month's end at a deposit-taker | The end-of-day runner runs interest | One txid per account, each in the run's batch, withholding tax its own line | rule 7, rule 8 |
| A15 | The split mode | A posting is made in the institution's own core | The core adapter mints a txid on first sight and keeps the core's id by issuer | rule 7 |
| A16 | A person as payee | A national ID number is put in their identifiers | Refused by the schema | rule 6 |
| A17 | W1 | Its M-Pesa receipt, its conversation id, its Fineract id or its reference is looked up | W1's txid each time | rule 7 |
| A18 | Model 1.1 adds a field | A reader written for 1.0 reads a 1.1 event | It validates against 1.1, reads what it knows, holds the rest | rule 10 |
| A19 | A producer | It publishes data with a field outside the dictionary | Its contract test fails in the pipeline | rule 1 |
| A20 | The dictionary, the schema and the examples | One changes without the others | The docs' check fails | rule 1 |

## 12 · Open questions

**For the owner:**

1. **Which events carry which part:** each existing money event carries
   the transaction or the footer entries it appends (recommended), or one
   new family of transaction events beside them.
2. **Adoption:** the lending service, deposits service, approval engine,
   recon and Kapu Core specs name this one in `depends_on` when each is
   next revised, and the rails spec is written on it.
3. **The check symbol:** ISO 7064's hybrid method applied to Crockford's
   32 symbols (MOD 33,32) is not one of the standard's named systems; the
   alternative is its MOD 37,36 over 0 to 9 and A to Z, which can give a
   check symbol Crockford's alphabet leaves out (I, L, O, U).
4. **The operator behind a number:** since number portability, a prefix
   does not tell the operator, so the rails must look it up (FS-1121, a
   gap in FS-1103's chain).
5. **To confirm:** the ISO 20022 codes in dictionary §3 against the lists
   current at release; Daraja's, Fineract's and Odoo's field names
   against the versions we run; the network codes of each operator.

**For the customer:** whether its fees are deducted at payout, which
decides each disbursement's amount and amount type (LQ-37).
