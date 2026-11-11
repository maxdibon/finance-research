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
used_by: [recon, lending-service, deposits-service, approval-engine, kapu-core-fineract, rails]
owner: Solution architect
classification: Internal
review_ids: [FS-1119, FS-1120, FS-1121, FS-1122, FS-1123, FS-1124, FS-1125, FS-1126, FS-1127, FS-1128, FS-1129, FS-1131, FS-1137, FS-1142, FS-1143, FS-1144, FS-1145, FS-1146, FS-1149, FS-1150, FS-1151, FS-1152, FS-1153, FS-1154, FS-1155, FS-1163, FS-1164, FS-1171, FS-1187, FS-1188]
last_reviewed: 2026-11-11
---

# Transactions — build specification

One model of a money movement for every component, so that a field means
the same thing to the rails, the core, the back office and
reconciliation (FS-1119). It sets the transaction's shape (a header fixed
at creation, a body fixed at approval, a footer only ever appended to),
its kinds, its links, its ids and its versions, and the standards it uses.
Each field is defined once in [the field dictionary](../transaction-fields.md);
the typed form, the rules a schema cannot say and twenty-eight worked
transactions (W1 to W28), with two holds, are in
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

**Out of R1, designed now so that nothing changes when they come**
(FS-1163): two currencies in one movement (escrow ES-11, rails RL-28);
cards, authorised then captured, and their chargebacks (gateway GW-03,
omni-channel OC-25; card numbers never reach us, RL-08); investments, by
units and price (`instrument`, TF-58, and `units`; Lofty Corban, LQ-38);
holds (sacco SC-08, escrow); records observed in books not the
institution's with us (sme-recon SR-06 to SR-08); IBANs and other
countries' schemes.

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
  +-------------------+                                    |
  | TREASURY          |  the same, for the                 | every entry
  | mints, own money  |  institution's own                 v
  | [kapu_service]    |  accounts                +-------------------+
  +-------------------+                          | RECONCILIATION    |
                                                 | matches, by any id|
                                                 | [kapu_service]    |
                                                 +-------------------+
```

**Reading it:** each arrow from the left is drawn from one minter but
holds for all four. Whichever mints a transaction (rule 7) asks the
approval engine to approve its body when money goes out, posts it through
the core adapter, and publishes every part as an event; reconciliation
reads them all and keeps the index that finds a transaction by any id.

**Related:** implements [rails](../modules/rails.md),
[recon-observability](../modules/recon-observability.md) and
[core](../modules/core.md); depends on [event-bus-kafka](event-bus-kafka.md);
used by [recon](recon.md), whose night checks run the link rules (§9),
[lending-service](lending-service.md) and
[deposits-service](deposits-service.md), which mint and write
transactions, [approval-engine](approval-engine.md), which approves their
bodies, and [kapu-core-fineract](kapu-core-fineract.md), whose fields map to
them, and [rails](rails.md), which carries them to each rail and mints
money arriving; journeys none yet.

## 2 · Concepts

- **Transaction:** one money movement, or one change to a balance by
  hand (a write-off, an adjustment), in one institution's books.
- **Header, body, footer:** what is fixed when the transaction is created,
  what is fixed when it is approved, and what is appended after (§4).
- **Identifier, address, alias** (FS-1122), kept apart: an *identifier*
  says who or what (a BIC, an LEI, a registration number); an *address*
  says where money leaves from or lands (a bank account, a wallet, a
  shortcode); an *alias* points to
  an address (a phone number, a paybill and account reference). A phone
  number is a wallet's address and may be an alias; it is never an
  identity (ID-12).
- **Deposit, withdrawal, payment, transfer** (FS-1152), kept apart by
  where the money goes: a *deposit* comes in to an account with us, from
  anyone, the payer saying who; a *withdrawal* goes out to the account
  holder themselves (their own wallet, bank or cash); a *payment* goes out
  to someone else (a paybill, a till, another wallet, another bank); a
  *transfer* stays within the institution's books, between any two of its
  accounts, one person's or two.
- **Allocation, split, many-to-one, batch** (FS-1124), kept apart, for any
  account: an *allocation* is how what one transaction settled is shared
  among the parts of what it pays (a loan's principal, interest, fees and
  penalties; a member's deposits and shares), the footer's breakdown,
  never separate transactions; a *split* is one movement for several
  accounts or obligations (one paybill payment for two loans, an
  employer's check-off for many members, one payout from two of the
  institution's accounts), a parent with its parts; *many to one* is
  several movements towards one account (a loan repaid in instalments, a
  savings goal), each linked to that account, not to each other; a
  *batch* is a container for a run (a month's interest, a payroll), each
  item its own transaction.
- **Source and destination** (FS-1150): every transaction moves money
  from one account to one account, as a rail does: its *source*, the
  account it leaves from, and its *destination*, where it lands. The payer
  and payee are who; the source and destination are where.
- **Amount type** (FS-1129, from Mojaloop): `send` fixes what leaves the
  payer, charges marked deducted coming out of it; `receive` fixes what
  the payee gets, charges on top.
- **Hold** (FS-1163): an amount held on an account without moving it (a
  guarantor's pledge, an escrow's hold, a lien, a card's authorisation,
  funds not yet cleared). A companion record, never a kind of
  transaction (dictionary §6); what it holds moves, if it moves, as a
  transaction of its own. It is kept by the service that owns the account
  it is on, as that service writes the account's postings (FS-1187).
- **Observed** (FS-1163): a record read from books not the institution's
  with us, such as an SME's own bank account, for reconciliation; never
  instructed by us, so never approved or sent (`what.observed`).
- **Treasury** (FS-1164): the institution's own money between its own
  accounts (a float topped up from its bank, a sweep back), a function of
  its own (treasury TR-01), with a kind of its own; never a
  customer's money.
- **Component map:** a component's own field names, by its version, against
  the dictionary's (dictionary §4).

**The standards it uses** (FS-1121, FS-1126):

| Standard | For |
|---|---|
| ISO 4217 | Every currency, and how many minor units it has (rule 3) |
| ISO 3166-1 alpha-2 | Every country: a party's, a bank account's, the issuer of a national identifier (rule 6) |
| ISO 20022 | Status, reason and purpose codes, the identifier schemes, and the name of each field's equivalent (dictionary §3) |
| ISO 9362, ISO 17442, ISO 6166 | BIC, LEI and ISIN, the international identifiers (rule 6) |
| ITU-T E.164, E.212 | A mobile number; a network, by its country and network codes; Kenya's national destination codes and network codes as the Communications Authority assigns them (dictionary §3; rule 4) |
| ISO 13616 | An IBAN, for an account abroad; Kenya does not use them (to confirm) |
| RFC 9562 | The txid, a UUIDv7 (rule 7) |
| Crockford base 32, ISO 7064 MOD 97-10 | The short reference and its two check digits, as in IBANs and LEIs (rule 7) |
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
   A customer's own instruction (a payment, a withdrawal, a transfer) is
   approved by the customer, stepped up (MD-10), and recorded by the
   approval engine under the product's policy (FS-1152). A pull under a
   debit mandate or standing order names it (`what.mandate`), and a
   movement asked for a day (`terms.execute_on`) never moves before it
   (W20). An observed record needs no approval: we never instruct it
   (FS-1163).
3. **Money.** Every amount is an integer of the currency's minor units
   and an ISO 4217 code: `{minor: 250000, currency: "KES"}`. The `amount`
   is as instructed or as received; charges, the settled amount and the
   allocation are fields of their own; the `amount_type` says which side
   the amount is fixed on, so the settled amount follows from the amount
   and the deducted charges (FS-1123 decision 2, FS-1129; LQ-37). W1:
   KES 100,000 sent, a KES 5,000 fee and KES 1,000 excise duty on it
   deducted, KES 94,000 settled. **Two currencies** are one parent with
   its `exchange` (from, to, the rate, its source and time) and a part in
   each currency; the parent's amount is the `from`, the parts in the
   other currency sum to the `to`, and the rate is exact decimal text,
   never a float (W21 to W23). **Units** of a fund are a quantity and a
   price in decimal text, priced on one day and settling on another, and
   their product is the amount (W26; FS-1163).
4. **Aliases.** An alias is resolved before approval, in Mojaloop's two
   steps: which provider holds it, then who the party is, with the name
   returned and matched against the payee's (BE01 when it does not
   match). The body holds the address it resolved to, the alias as
   entered and the resolution; the hash covers them. At sending the alias
   is resolved again, and a wallet's number is checked: its operator,
   still bound to the payee (ID-12), its SIM unchanged (RL-22). The
   operator is taken from the number's national destination code, as the
   Communications Authority assigns them (dictionary §3), and confirmed
   with that operator over our own connections to it, since a ported
   number keeps its code (FS-1144). A payment, money to someone else at a
   customer's word, is also screened before it goes: sanctions and the
   customer's limits (FS-1152). A different address or a failed check
   holds the payout, and it goes only as a new transaction that
   `replaces` it, approved again (FS-1122).
5. **Links point back; the target's footer records them.** A link sits in
   the header, is fixed at creation, points to an earlier transaction of
   the same institution and currency, and comes from a closed list
   (dictionary §3). Creating it appends the forward fact to the target's
   footer (`reversed_by`, `refunded_by`, `has_part`) in the same step, by
   the service creating the link; the target's own status does not change
   because of it, so a settled payout that is reversed stays settled, and
   what is left of it is its *position*, computed from its `linked_by`
   (§5). A rail's return is the rail's
   fact: it appends `returned` to the original first (W7), then the
   reversal is created (W8). A reversal is a new transaction in the
   opposite direction, never an edit; reversals and refunds together
   never exceed the original; a split's parts sum to their parent (W2 to
   W4) (FS-1124, FS-1131). **Money out names its source** before
   approval: the institution's shortcode, float or bank account. Money
   paid from, or to, more than one account is one parent and a part per
   account (FS-1150): the parent posts the whole to the loan or account
   and moves no money itself (its rail `none`); each part is its own
   instruction, with its own source and destination, and `part_of` the
   parent; the parts sum to what the parent pays on (its amount, less
   charges deducted from a send amount). One approval covers the plan:
   the parent and each part carry its reference, each with its own hash,
   and no transaction outside the plan may share it. The parent settles
   only when every part has, and a failed part is replaced (`replaces`),
   never edited (W10 to W12). Money recovered on a written-off loan
   `recovers` the write-off (W18, W19); a chargeback, like a reversal,
   `reverses` what it undoes (W24, W25) (FS-1163).
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
   run of the end-of-day runner; treasury for the institution's own money
   between its own accounts (FS-1188); the rails when money arrives; the core
   adapter for a posting made in an institution's own core in the split
   mode (FS-1127, FS-1128). Its short reference is nine Crockford base-32
   symbols and two check digits by ISO 7064 MOD 97-10, the method IBANs
   and LEIs use (FS-1143): eleven characters, a mistyped character or two
   swapped ones caught before a payment is matched. A retry with the same idempotency key is
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

Each part's fields sit in groups one level deep, each answering one
question (FS-1149):

| Part | Fixed | Its groups, and what they hold |
|---|---|---|
| Header | At creation | **id** (txid, reference, idempotency_key); **what** (kind, institution, account, product_version); **origin** (channel, rail, created_at, initiated_by); with model_version and links beside them |
| Body | At approval, under the hash | **money** (amount, amount_type, direction, charges); **parties** (payer, payee, source, destination); **terms** (purpose, instrument, expires_at) |
| Footer | Never: appended to | **progress** (status_history, checks); **settlement** (settled, rail_charges, dates); **books** (allocation, ledger_entries, recon); with approval, ids, linked_by and changes beside them |

The footer's groups follow who writes them (§7): the approval engine its
approval, the rails its progress and settlement, the core adapter and
reconciliation its books.

**W1, as it is held** (cut down; every value in
[examples.json](../../code/transactions/examples.json)):

```
  header   model_version  1.0
           id        { txid 01a1bf1b-...-000000000001, reference 8YCC826SG20,
                       idempotency_key loan-L00042-disburse-1 }
           what      { kind disbursement, institution example-mfi, account loan L00042 }
           origin    { channel staff_workspace, rail mpesa, created_at, initiated_by }
           links     [ ]
  ---------------------------------------------------------- fixed at creation
  body     money     { amount KES 100,000, amount_type send, direction out,
                       charges [ fee 5,000 deducted, excise 1,000 deducted ] }
           parties   { payer the institution, payee the borrower,
                       source its B2C shortcode, destination the borrower's wallet,
                       with the alias as entered and the name returned }
           terms     { purpose LOAN }
  ---------------------------------------------------------- fixed at approval, hashed
  footer   approval    { ref apr-000981, body_hash sha256:..., at }
           progress    { status_history [ created, awaiting_approval, approved,
                         sent, settled ], checks [ resolved_again, operator,
                         number_binding, sim_swap ] }
           settlement  { settled KES 94,000, rail_charges [ M-Pesa's B2C charge ],
                         dates { value_date, business_date, booked_at } }
           books       { ledger_entries [ Fineract's entry ], recon { match } }
           ids         [ M-Pesa's conversation ids and receipt, Fineract's id ]
           linked_by   [ ]    changes  [ ]
  ---------------------------------------------------------- appended to, never changed
```

It travels in the CloudEvents envelope (event-bus-kafka §4), whose `txid`
is the header's and whose `prevhash` and `sig` prove each footer entry's
order and author.

**The kinds.** Each kind is a profile of the one model:

| Kind | Direction | Approved before it moves | Must link | Minted by | Worked |
|---|---|---|---|---|---|
| disbursement | out | Yes | `part_of`, when paid from or to more than one account | Lending service | W1, W7, W10 to W12 |
| repayment | in; a part internal | No | `part_of`, when split | Rails on first sight; the lending service for the parts | W2 to W5 |
| deposit | in | No | — | Deposits service, or the rails for money arriving | — |
| withdrawal | out, to the account holder | Yes, by the holder | — | Deposits service | — |
| payment | out, to someone else | Yes, by the customer, screened | `part_of`, when to several payees | Deposits service | W13 |
| transfer | internal, between two accounts with us | Yes, by the customer | its legs `part_of` it | Deposits service | W14, W15 |
| interest | internal | No | `in_batch` | Deposits service, in the end-of-day run | W9 |
| fee | internal | No | `fee_for`, where it is for one | The service of the account | — |
| reversal | opposite to the original | Yes | `reverses`, exactly one | Whoever learns of it: the rails for a return | W8 |
| refund | out | Yes | `refunds`, exactly one | The service of the account | W6 |
| write_off | internal, no rail | Yes | — | Lending service | — |
| adjustment | internal | Yes | `corrects`, exactly one | The service of the account | — |
| treasury | internal, between the institution's own accounts | Yes | — | Treasury (TR-01), through the console | W28 |
| dividend | internal, on a share account | No: the year's dividend is approved at the general meeting, the run under it | `in_batch` | Deposits service, in the run | W16 |
| waiver | internal, no rail | Yes, by the product's policy where automatic (the cap's sweep) | — | Lending service | W17 |
| chargeback | in, opposite to the card payment | No: the card network's decision | `reverses`, exactly one | The rails, from the card's processor | W25 |
| subscription | internal or in: money to a fund | No, beyond the customer's own step-up | — | The deposits service, or the fund's administrator | W26 |
| redemption | out of a fund | Yes | — | The fund's administrator | — |
| distribution | out of a fund: income paid on units | No: the fund's declaration | `in_batch` | The fund's administrator | — |

**The worked set** ([examples.json](../../code/transactions/examples.json)):

| # | What happens | What it shows |
|---|---|---|
| W1 | A KES 100,000 loan paid to the borrower's M-Pesa: fee and excise deducted, KES 94,000 settled | Rules 2, 3, 4, 7, 8: approval hash, amount type, alias resolved again with number and SIM checks, M-Pesa's and Fineract's ids in the footer |
| W2 | One paybill payment of KES 12,000 for two loans | A parent: the alias is the paybill and the account reference |
| W3, W4 | Its two parts, KES 8,000 and KES 4,000, each allocated | Parts sum to the parent; allocation sums to what settled |
| W5, W6 | A payment made twice; the duplicate refunded, reason DUPL | A refund approved before it moves; `refunded_by` on W5 |
| W7, W8 | A bank payout returned for a closed account (AC04); its reversal | `returned` appended by the rail, then `reversed_by` on W7 |
| W9 | A month's interest on a deposit, withholding tax deducted, in the run's batch | Tax as its own line; one txid per account in a batch |
| W10 to W12 | A KES 100,000 loan paid from two of the institution's accounts: KES 60,000 from its B2C shortcode to the borrower's M-Pesa (W11), KES 40,000 from its bank to the borrower's bank (W12) | One parent and a part per account; each part its own source; one approval for the three; the parent settled once both parts have |
| W13 | A member pays a school's paybill KES 15,000 from savings, a KES 50 fee and its excise on top | A payment: the member's step-up its approval; the paybill and admission number an alias, resolved; sanctions and limits checked before it goes |
| W14, W15 | KES 5,000 from the member's savings to their loan | A transfer within the books, its parent the deposits service's; the loan's repayment its part, allocated |
| W16 | A share dividend, withholding tax deducted, credited to the member's savings | A dividend; tax as its own line |
| W17 | Capped interest waived on a loan by the night's sweep | A waiver, apart from a write-off |
| W18, W19 | A loan written off; KES 15,000 recovered from its collateral's sale | `recovers`, and its forward fact on the write-off |
| W20 | A group's repayment pulled under its standing order on the day asked | `what.mandate`, `terms.execute_on`, a group as payer |
| W21 to W23 | USD 1,000 from a buyer abroad into an escrow, credited as KES 129,000 | An exchange: the parent and a leg in each currency |
| W24, W25 | A virtual card payment, authorised then captured, its hold H1; charged back | `authorised`, `captured`; a chargeback reverses it |
| W26 | 1,000 units of a money market fund at 10.5000 | Units and price, settling two days after pricing |
| W27 | An SME's customer pays an invoice into the SME's own bank | Observed: read from the statement, never approved or sent |
| W28 | Treasury tops up the B2C float from the bank before a month-end | Treasury: the institution's own money, approved |
| H1, H2 | A card's authorisation, captured; a guarantor's pledge, reduced, then released | Holds, beside the transactions |

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
| approved | settled | A parent with parts: once every part has settled (W10) |
| created | authorised | A card payment authorised, its amount held (W24, H1) |
| authorised | captured | The merchant captures it |
| captured | settled | The processor settles it |

Each state is a footer entry, with who and when and the ISO reason; its
ISO 20022 status is in dictionary §3.

**The position** (FS-1137). What a reversal or refund leaves of a
transaction is computed from its footer's forward facts, never stored, and
shown wherever the status is: W5 is *refunded* by W6; W7 is *reversed* by
W8; a refund of part of a payment leaves it *partly refunded*. Its
values are dictionary §2's. The status stays the rail's fact, so
reconciliation still matches W7 against the bank's statement as a
payout that settled and came back.

## 6 · Interfaces

| What | Who offers it | What crosses |
|---|---|---|
| Resolve an alias | Rails | An alias in; the address, the name returned and the directory out, in Mojaloop's two steps (rule 4) |
| Quote | The lending or deposits service, with the rails' tariff | The charges and the settled amount, before approval (rule 8) |
| Approve | Approval engine | The body's hash in, or a plan's hashes (a parent and its parts) together; one approval reference out (rules 2, 5) |
| Events | Every minter | Each existing money event in the catalogue (event-bus-kafka §5) carries, as its data, the transaction or the footer entries it appends, against the schema at the version in `dataschema`; no family of transaction events beside them (FS-1142) |
| Find by any id | Reconciliation | A scheme, a value and an issuer in; the txid out (rule 7) |
| Confirm a number's operator | Rails, over our connections to each operator | A number in; whether it is on that operator's network now (rule 4) |
| The night's link checks | Reconciliation | The link rules over the day's transactions: forward facts, reversals within the original, parts summing (recon §4.8) |
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
| Links whose target lacks the forward fact, reversals above the original, parts not summing | Any, in the night's checks (recon §4.8) |
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
| A21 | W5, refunded in full by W6 | Staff open W5 | Settled, refunded by W6: its position, beside its status | §5 |
| A22 | A reversal whose original lacks its forward fact | The night's checks run | A break, owned and worked as recon §4.7 sets | §9 |
| A23 | A number in NDC 722, ported from Safaricom to Airtel | A payout to it is about to be sent | Safaricom does not confirm it; held, the operator check failed | rule 4 |
| A24 | W1's reference, 8YCC826SG20 | A borrower types 8YCC862SG20 (two characters swapped), or 8YCC826SG21 | Its check digits fail; asked for again, never matched to another transaction; 8YCC826SG2O, a letter O, is read as the zero Crockford's alphabet takes it for | rule 7 |
| A25 | A loan to be paid from two accounts | It is approved | One approval; W10, W11 and W12 carry its reference, each with its own hash; each part sent from its own source | rule 5 |
| A26 | W12, the bank part, rejected | The night's checks run | W10 not settled; W12 replaced by a new part, approved, never edited | rule 5 |
| A27 | A payout with no source | It is put for approval | Refused: the account it leaves from is named first | rule 5 |
| A28 | W13 | Sanctions screening has not passed when it is about to be sent | Held; not sent | rule 4 |
| A29 | W14 | The member approves it by step-up | The transfer and its loan part posted together; W14 settled once W15 has | rule 2, rule 5 |
| A30 | W19 | It is linked to recover a waiver, not a write-off | Refused | rule 5 |
| A31 | W21 | Its shilling leg is KES 128,000 | Refused: the legs do not sum to what was exchanged | rule 3 |
| A32 | W26 | Its price is changed to 11.0000 | Refused: units times price is not the amount | rule 3 |
| A33 | W20 | The standing order runs a day early | Not sent before the day asked | rule 2 |
| A34 | W27 | Anything tries to send it | Refused: an observed record is never sent | rule 7 |
| A35 | W24 | The card network charges it back | W25 reverses it; W24's position reversed; H1 already captured | rule 5 |
| A36 | H2, a guarantor's pledge | The loan is repaid | The hold reduced, then released; nothing moves for it | §2, dictionary §6 |
| A37 | W28 | Treasury asks without a second approver | Refused: approved like every movement of the institution's own money | rule 2 |

## 12 · Open questions

**For the owner:**

1. **How each operator confirms a number:** the query each offers over
   our connections (a portability or HLR lookup, or its own API), to
   confirm with each.
2. **To confirm:** Daraja's, Fineract's and Odoo's field names against the
   versions we run; the ISO 20022 code sets and CAK's plan once more at
   release.
3. **Exchange rates** (FS-1163): whose rate an institution uses (its
   bank's, the central bank's), and whether a currency other than one with
   two minor digits is ever in scope (the rule assumes two).
4. **Investments** (FS-1163): the fund's administrator and its own
   records, when a fund product is in scope; units here are designed, not
   agreed with one.

**For the customer:** whether its fees are deducted at payout, which
decides each disbursement's amount and amount type (LQ-37).
