---
id: transaction-fields
name: Transaction fields — every field of a money movement, defined once
kind: register
status: living
released: unreleased
owner: Solution architect
classification: Internal
review_ids: [FS-1119, FS-1120, FS-1121, FS-1122, FS-1123, FS-1124, FS-1125, FS-1126, FS-1127, FS-1128, FS-1129, FS-1131, FS-1137, FS-1143, FS-1144, FS-1145, FS-1146]
last_reviewed: 2026-11-09
---

# Transaction fields

**Model version: 1.0.** FS-1131. Every field of a transaction, defined
once, so `body.amount` means the same thing to the rails, the core, the
back office and reconciliation. The shape, the rules and the kinds are in
[the transactions spec](specs/transactions.md); the typed form is
[the schema](../code/transactions/transaction.schema.json), with
[worked examples](../code/transactions/examples.json). The check holds
the three together: a field in one and not the others fails.

Ids are TF-01 onwards, never reused ([ids](ids.md)). ISO 20022 names are
the closest element in pain.001, pacs.002, pacs.004, pacs.008 and
camt.053/054, a guide for mapping and not a claim of conformance. The
codes in §3 are from its external code sets, each checked on 2026-11-09
against a published copy of them (the npm package
`@taprsvp/iso20022_external_codes` 1.0.1), because iso20022.org's own
download refuses a script; the quarterly release current at go-live is
read once more before release (FS-1146). Kenya's number blocks and
network codes are the Communications Authority's (§3; FS-1145).

## 1 · Building blocks

The types the fields are made of.

| Id | Block | Meaning | Not to be confused with | Form | Standard | ISO 20022 |
|---|---|---|---|---|---|---|
| TF-01 | money | An amount: an integer of the currency's minor units, and the currency | A decimal amount; a balance | `{minor: 250000, currency: "KES"}` is KES 2,500.00 | ISO 4217 (currency and its minor units) | ActiveCurrencyAndAmount |
| TF-02 | txid | Our id for one money movement, end to end | The event's id; a rail's id; ISO 20022's TXID code, a tax number | A UUIDv7, lower case, hyphenated | RFC 9562 | UETR's place, but UETR is a version-4 UUID a bank mints |
| TF-03 | reference | The txid's short form, for people and small rail fields | The payment reference a payer types, which is an alias (TF-12) | 9 Crockford base-32 symbols and 2 check digits, `8YCC826SG20` | Crockford base 32; ISO 7064 MOD 97-10, as in IBANs (ISO 13616) and LEIs (ISO 17442) | RmtInf/Ustrd, where a rail has room |
| TF-04 | code | Our own name for a thing in a closed list | A display name | lower case, digits, hyphens | — | — |
| TF-05 | time | An instant | A business date (TF-06) | RFC 3339 in UTC, ending Z | RFC 3339, ISO 8601 | ISODateTime |
| TF-06 | date | A calendar day in Africa/Nairobi | An instant | YYYY-MM-DD | ISO 8601 | ISODate |
| TF-07 | iso_code | A four-character ISO 20022 external code: a status reason, a return reason, a purpose (§3) | Our own codes (TF-04) | `AC04` | ISO 20022 external code lists | the Cd elements |
| TF-08 | country | A country | A currency | Two capital letters, `KE` | ISO 3166-1 alpha-2 | CountryCode |
| TF-09 | msisdn | A mobile number: in Kenya `+254`, a three-digit national destination code and six more digits, nine in all after 254 (§3) | The identity of its holder (ID-12); its operator, which the NDC suggests but portability can change | `+254700000001` | ITU-T E.164; CAK's numbering plan | MobNb |
| TF-10 | actor | Who did a thing: a person (by user id and role), a service, or a rail | The payer or payee | `{kind, id, role}` | — | InitgPty, in part |
| TF-11 | account | A loan, deposit, share or ledger account of the institution's, by its id | An address outside the institution (TF-14) | `{kind: "loan", id: "L00042"}` | — | DbtrAcct, CdtrAcct (Othr) |
| TF-12 | alias | A pointer to an address: a phone number, a paybill and account reference, a till | The address it resolves to (TF-14); an identifier (TF-13) | `{type, value, sub_id}`, the types in §3 | Mojaloop PartyIdType and PartySubIdOrType | Prxy (Tp, Id) |
| TF-13 | identifier | Who or what a party or instrument is, by a scheme and a value | An alias (TF-12); a government ID number of a person, never held here (spec rule 6) | `{scheme, value, issuer}`, the schemes in §3; issuer an ISO 3166 code for a national scheme | ISO 9362, ISO 17442, ISO 6166; ISO 20022 code lists | GenericIdentification (Id, SchmeNm, Issr) |
| TF-14 | address | Where money lands: a Kenyan bank account (bank code, branch code, account), a wallet (its E.164 number, provider, network), an IBAN abroad, or a book account | An alias (TF-12) | One of four forms | E.164; ITU-T E.212 for a network, Kenya's country code 639 and the network code CAK assigns (`639-02`; §3); ISO 13616 for an IBAN, which Kenya does not use (to confirm) | CdtrAcct, CdtrAgt (BICFI, ClrSysMmbId) |
| TF-15 | resolution | What a directory returned for an alias: the name, how well it matched the payee's, who asked and when | The address itself | `{directory, name_returned, name_match, resolved_by, resolved_at}` | Mojaloop's party lookup | acmt.023/024, in part |
| TF-16 | destination | The address money goes to, with the alias as entered and its resolution | The payee (a party, TF-18) | `{address, alias, resolution}` | — | CdtrAcct with Prxy |
| TF-17 | charge | One line of what is charged: a fee, a tax on a fee, or the rail's charge; whether it is deducted from the amount | The amount; a ledger posting | `{line, kind, code, amount, deducted, on}` | — | ChrgsInf; TaxRmt for a tax |
| TF-18 | party | A payer or payee: a person, an organisation or the institution, by our customer reference, with a name | An account; an address | `{kind, ref, name, identifiers, country}` | — | PartyIdentification |
| TF-19 | link | A link back to an earlier transaction, from a closed list (§3) | A forward fact (TF-20) | `{rel, txid}` | — | OrgnlTxRef, in pacs.004 and pacs.007 |
| TF-20 | linked_by | The forward fact a link leaves on its target: reversed by, refunded by, has part | The link itself (TF-19) | `{rel, txid, at}` | — | — |
| TF-21 | approval | The approval of the body: its reference in the approval engine and the hash of what was approved | A status (TF-22) | `{ref, body_hash, at}`, the hash `sha256:` and hex | SHA-256 over RFC 8785 canonical JSON | — |
| TF-22 | status_entry | One state the transaction entered, when, by whom, with an ISO reason and the rail's own time as reported | A change (TF-29) | `{status, at, by, reason, reported_at}` | ISO 20022 status codes (§3) | TxSts, StsRsnInf |
| TF-23 | check | One check made before money moved: resolved again, name match, the operator behind a number, number binding, SIM swap, limits, sanctions | An approval | `{check, result, at, detail}` | — | — |
| TF-24 | external_id | Another party's id for this transaction: a rail's, a bank's, a component's | Our txid | `{issuer, scheme, value, at}` | — | TxId, InstrId, ClrSysRef, AcctSvcrRef |
| TF-25 | dates | The value date and the business date (architecture §10), and when it was booked | The created time (`header.created_at`) | `{value_date, business_date, booked_at}` | ISO 8601 | ValDt, BookgDt, IntrBkSttlmDt |
| TF-26 | allocation_line | One part of what a payment settled: principal, interest, fee, penalty, tax, deposit, overpayment | A charge (TF-17) | `{part, amount}` | — | RmtInf/Strd, in part |
| TF-27 | ledger_entry | A balanced journal entry the transaction caused, by the ledger's own reference | The transaction | `{ledger, ref, at}` | — | camt.053 Ntry |
| TF-28 | recon_match | Reconciliation's match: its id, what it matched on first, when | A break | `{match, on, at}` | — | — |
| TF-29 | change | A fact entered by a person or service after creation: who, in what role, when, the reason as an ISO code, what, and the approval behind it | A status (TF-22); an edit, which never happens | `{at, by, reason, what, note, approval_ref}` | ISO 20022 reason codes (§3) | CxlRsnInf, in part |

## 2 · Fields

What each part holds. **Changes:** *never* (fixed at creation),
*approval* (fixed when approved, under the hash), *appended* (entries
added, none changed). **Class** is the architecture's (README §7).

| Id | Field | Part | Meaning | Not to be confused with | Type | Unit | Set by | Changes | Class | ISO 20022 | Source |
|---|---|---|---|---|---|---|---|---|---|---|---|
| TF-30 | txid | header | This transaction's id | `reference`; an external id | txid | — | The first of our components to know of it (spec rule 7) | never | Internal | PmtId (UETR's place) | FS-1127, FS-1128; RO-23 |
| TF-31 | reference | header | Its short form, unique in the institution | A payer's typed reference | reference | — | With the txid | never | Internal | RmtInf/Ustrd | FS-1127 |
| TF-32 | model_version | header | The model version it was written under | A component map's version | string | — | With the txid | never | Internal | — | FS-1125 |
| TF-33 | kind | header | What sort of movement it is (spec §4) | Its purpose | code | — | With the txid | never | Internal | — | FS-1123, FS-1128 |
| TF-34 | institution | header | The institution whose books it is in | The payer or payee | code | — | From the caller's realm | never | Internal | — | event-bus-kafka §4 |
| TF-35 | channel | header | Where it was asked for | The rail | code | — | With the txid | never | Internal | — | delivery channels |
| TF-36 | rail | header | How the money moves: a mobile money rail, PesaLink, EFT, RTGS, cash, `book` within the institution, `none` for a write-off | The channel | code | — | With the txid | never | Internal | PmtTpInf/LclInstrm, in part | FS-1109 |
| TF-37 | created_at | header | When we created it, by our clock | The value date | time | UTC | With the txid | never | Internal | CreDtTm | architecture §10 |
| TF-38 | initiated_by | header | Who asked for it | Who approved it; the payer | actor | — | With the txid | never | Internal | InitgPty | FS-1119 |
| TF-39 | idempotency_key | header | The caller's key for the request: a retry with it is the same transaction | The txid | string | — | The caller | never | Internal | — | RL-14 |
| TF-40 | product_version | header | The product version it is priced under, where one applies | The product's name | string | — | The lending or deposits service | never | Internal | — | product-versions |
| TF-41 | account | header | The institution's account it moves money on | Where the money lands | account | — | With the txid | never | Confidential | DbtrAcct or CdtrAcct | FS-1123 |
| TF-42 | links | header | Its links back to earlier transactions | The forward facts | link list | — | With the txid | never | Internal | OrgnlTxRef | FS-1124 |
| TF-43 | amount | body | The amount as instructed or as received | The settled amount; the charges | money | minor units | The requester; for money in, the rail | approval | Confidential | InstdAmt | FS-1123 decision 2 |
| TF-44 | amount_type | body | Which side the amount is fixed on: `send`, what leaves the payer, deducted charges taken out of it; `receive`, what the payee gets, charges on top | Who bears a charge | code | — | The requester, from the product | approval | Internal | ChrgBr, in part | FS-1129; LQ-37 |
| TF-45 | direction | body | `out` of the institution, `in` to it, or `internal` within its books | The kind | code | — | The requester | approval | Internal | CdtDbtInd | FS-1123 |
| TF-46 | payer | body | Who pays | The account debited | party | — | The requester | approval | Confidential | Dbtr | FS-1123 |
| TF-47 | payee | body | Who is paid | The destination | party | — | The requester | approval | Confidential | Cdtr | FS-1123 |
| TF-48 | destination | body | Where the money lands, the alias as entered, and what the directory returned | The payee | destination | — | The requester; the rails resolve the alias before approval | approval | Confidential | CdtrAcct, Prxy | FS-1122 |
| TF-49 | purpose | body | Why the money moves, as an ISO purpose code (§3) | The kind | iso_code | — | The requester | approval | Internal | Purp/Cd | FS-1126 |
| TF-50 | charges | body | The charges known before approval, each its own line, a tax on its own line | The rail's charges as reported (TF-59) | charge list | minor units | The product version; the rail's tariff | approval | Confidential | ChrgsInf, TaxRmt | FS-1126, FS-1129 |
| TF-51 | instrument | body | The security or fund unit traded, by its ISIN; not used in R1 | The party | identifier | — | The requester | approval | Internal | FinInstrmId | FS-1120 |
| TF-52 | expires_at | body | When an unapproved or unsent request lapses | The created time | time | UTC | The requester, from the product | approval | Internal | ReqdExctnDt, in part | FS-1129 |
| TF-53 | approval | footer | The approval of the body, with the hash it approved | Its status | approval | — | The approval engine | appended | Internal | — | FS-588 |
| TF-54 | status_history | footer | Every state it entered, in order | A change | status entry list | — | The service that saw the state | appended | Internal | TxSts | FS-1126; RL-10 |
| TF-55 | checks | footer | The checks made before money moved | The approval | check list | — | The rails | appended | Internal | — | FS-1122; ID-12, RL-22 |
| TF-56 | external_ids | footer | Every other party's id for it, by issuer and scheme | The txid | external id list | — | Whoever receives the id | appended | Internal | TxId, AcctSvcrRef | FS-1127 |
| TF-57 | dates | footer | Its value date, business date and booking time | `created_at` | dates | — | The core adapter, at posting | appended | Internal | ValDt, BookgDt | architecture §10 |
| TF-58 | settled | footer | The amount the rail moved to the payee | The amount | money | minor units | The rails; the core for a book transfer | appended | Confidential | IntrBkSttlmAmt | FS-1123 decision 2 |
| TF-59 | rail_charges | footer | The rail's charges as it reported them | The charges approved (TF-50) | charge list | minor units | The rails | appended | Confidential | ChrgsInf | FS-1126 |
| TF-60 | allocation | footer | How what was settled was split across principal, interest, fees, penalties and the rest | The charges | allocation list | minor units | The core adapter, from the core | appended | Confidential | RmtInf/Strd | FS-1124; MF-22 |
| TF-61 | ledger_entries | footer | The balanced entries it caused | The transaction | ledger entry list | — | The core adapter | appended | Internal | — | FS-1126 |
| TF-62 | recon | footer | Reconciliation's match | A break | recon match | — | Reconciliation | appended | Internal | — | RO-02 |
| TF-63 | linked_by | footer | The forward facts later transactions left on it | Its own links | linked by list | — | The service that creates the linking transaction | appended | Internal | — | FS-1124, FS-1131 |
| TF-64 | changes | footer | Facts entered after creation, with who, role, reason and approval | Statuses; an edit, which never happens | change list | — | Whoever enters it | appended | Internal | — | FS-1119 |

**Computed, never stored** (spec §5; FS-1137): shown wherever the status
is, worked out from the footer's forward facts, so it is never a second
truth to keep in step.

| Position | When |
|---|---|
| The status | Nothing reverses or refunds it, or it has not settled |
| partly_refunded | Settled or returned; refunds total less than its amount |
| refunded | Refunds total its amount |
| partly_reversed | Reversals, with any refunds, total less than its amount |
| reversed | Reversals, with any refunds, total its amount |

## 3 · Codes

**Statuses** (spec §5), each beside its ISO 20022 transaction status
where one exists:

| Status | Meaning | ISO 20022 |
|---|---|---|
| created | Minted, nothing decided | — |
| awaiting_approval | With the approval engine | — |
| approved | Approved; the body is fixed | — |
| held | Stopped before sending: a check held it (spec rule 4) | PDNG |
| sent | Given to the rail | ACSP |
| unknown | The rail has not answered; settled only by a status query or a statement (RL-10) | PDNG |
| settled | The rail or the core confirmed it | ACSC; ACCC once the payee's account is known credited |
| rejected | Refused, before or by the rail | RJCT |
| returned | Settled, then sent back by the receiving side | pacs.004 return |
| cancelled | Withdrawn before sending | CANC |
| expired | Lapsed at `expires_at` | RJCT with a reason |

**Reasons**, for a status, a return or a change: ISO 20022's external
codes, only these until the dictionary adds more. Each is used only where
its code set has it: S, a status reason (ExternalStatusReason1Code); R, a
return (ExternalReturnReason1Code); C, a cancellation
(ExternalCancellationReason1Code). A change cites the code of the status,
return or cancellation it acts on.

| Code | Meaning | Sets |
|---|---|---|
| AB05 | Timed out at the receiving side | S |
| AC01 | Account number invalid, missing or wrongly formed | S, R |
| AC03 | The payee's account number invalid or missing | S, R, C |
| AC04 | Account closed | S, R |
| AC06 | Account blocked | S, R |
| AM04 | Insufficient funds | S, R |
| AM05 | Duplication | S, R |
| AM09 | Not the amount agreed or expected | S, R, C |
| BE01 | The end customer's identification does not match the account: our use, the name returned does not match the payee's | S, R |
| CUST | Requested by the payer | S, R, C |
| DUPL | A duplicate of another payment | S, R, C |
| FOCR | Returned after a cancellation request | S, R |
| FRAD | Originated fraudulently | S, C |
| MS03 | Reason not specified | S, R |
| NARR | Reason given in the note | S, R, C |
| TECH | Technical problem | C |
| UPAY | Payment not justified | S, R, C |

**Purposes:** ISO 20022's external purpose codes.

| Code | Meaning |
|---|---|
| LOAN | A loan paid out to the borrower |
| LOAR | A loan repaid to the lender |
| INTE | Interest |
| FEES | A fee or charge |
| TAXS | Tax |
| WHLD | Withholding tax |
| SAVG | A deposit to or withdrawal from savings |
| ACCT | A transfer between two accounts of the same holder in the institution |

**Alias types:** Mojaloop's party id types.

| Type | What it is for us |
|---|---|
| MSISDN | A wallet's number, or a phone number on PesaLink |
| BUSINESS | A paybill or till; the account reference typed is its `sub_id`, itself an alias for a loan or deposit account (RO-02) |
| ACCOUNT_ID | A bank account number, as typed, before resolution |
| IBAN | An account abroad |
| ALIAS | A name a provider made for an account |
| DEVICE | An agent's or merchant's till device |
| EMAIL | Not used in R1 |
| PERSONAL_ID | Never accepted: a person's government ID number is Restricted (spec rule 6) |

**Identifier schemes:** international first, then ISO 20022's codes for
national schemes, each with its ISO 3166 issuer.

| Scheme | What it identifies | Standard |
|---|---|---|
| BIC | A bank or institution | ISO 9362 |
| LEI | A legal entity | ISO 17442 |
| ISIN | A security or fund | ISO 6166 |
| CINC | A company's registration: in Kenya the Business Registration Service's number | ISO 20022 organisation code |
| TXID | An organisation's tax number: in Kenya its KRA PIN; never a person's | ISO 20022 organisation code |
| CUST | The institution's customer number | ISO 20022 code |
| BANK | A bank's own party id | ISO 20022 code |

**Kenya's mobile numbers** (FS-1145), from the Communications Authority's
*Telecommunication Numbering Plan for Kenya*, October 2025
(CA/SRM/S&N/NNP/OCT/2025), §1.1 and §7.3, read 2026-11-09. A mobile
number is nine digits after 254, the first three its national destination
code. Since number portability the NDC says only who was assigned the
block, so the rails take it as the likely operator and confirm it with the
operators before money moves (spec rule 4; FS-1144). The plan changes as
blocks are assigned: it is read again at each release and at onboarding.

| NDC | Assigned to |
|---|---|
| 100 to 108 | Airtel Networks Kenya |
| 110 to 119 | Safaricom |
| 120 | Jambo Telcoms |
| 124 | Infura |
| 126 | Hidiga Investments |
| 128 | Webtribe |
| 130 | NRG Media |
| 140 | Safaricom |
| 199 | Shared, for network testing and research |
| 700 to 729 | Safaricom |
| 730 to 739 | Airtel Networks Kenya |
| 740 to 743 | Safaricom |
| 744 | Homelands Media |
| 745 to 746 | Safaricom |
| 747 | Jamii Telecoms |
| 748 | Safaricom |
| 749 | The IEBC, for its KIEMS kits |
| 750 to 756 | Airtel Networks Kenya |
| 757 to 759 | Safaricom |
| 760 | Mobile Pay |
| 761 | Eferio Kenya |
| 762 | Airtel Networks Kenya |
| 763 to 766 | Finserve Africa |
| 768 to 769 | Safaricom |
| 770 to 779 | Telkom Kenya |
| 780 to 789 | Airtel Networks Kenya |
| 790 to 799 | Safaricom |

The plan's 300 block is for machine-to-machine services, twelve digits
long: never a person's wallet. Its network codes (MCC 639): 01 and 02
Safaricom; 03 and 05 Airtel Networks Kenya; 04 Mobile Pay Kenya; 06
Finserve Africa; 07 Telkom Kenya; 08 Webtribe; 09 Homeland Media; 10
Jamii Telecommunications; 11 Jambo Telcoms; 12 Infura; 13 Hidiga
Investments; 14 NRG Media.

**Links** and the forward fact each leaves (spec rule 5):

| Link | Forward fact | Meaning |
|---|---|---|
| reverses | reversed_by | Undoes it, in the opposite direction |
| refunds | refunded_by | Pays money back to its payer |
| corrects | corrected_by | An adjustment that puts a ledger entry right |
| part_of | has_part | One of the parts a payment is split into |
| in_batch | (none: a batch is a container) | One of a run's transactions |
| replaces | replaced_by | Sent again, as a new transaction, after a failure |
| fee_for | has_fee | A fee charged for it |

## 4 · Component maps

Each component's own names, by its version (spec rule 10). Field names
are **to confirm** against each component's documentation at the
version we run.

| Component, version | Its field | Our field | Note |
|---|---|---|---|
| M-Pesa B2C (Daraja) | OriginatorConversationID | `header.txid` | Without hyphens, 32 characters |
| M-Pesa B2C (Daraja) | Amount | `body.amount` | Whole shillings, so the minor units divided by 100 |
| M-Pesa B2C (Daraja) | PartyB | `body.destination` | The wallet's number, without the + |
| M-Pesa B2C (Daraja) | Occasion | `header.reference` | |
| M-Pesa B2C (Daraja) | ConversationID | `footer.external_ids` | issuer safaricom, scheme conversation-id |
| M-Pesa B2C (Daraja) | TransactionID | `footer.external_ids` | issuer safaricom, scheme mpesa-receipt |
| M-Pesa B2C (Daraja) | TransactionAmount | `footer.settled` | |
| M-Pesa B2C (Daraja) | ReceiverPartyPublicName | `footer.checks` | name_match, after sending |
| M-Pesa B2C (Daraja) | TransactionCompletedDateTime | `footer.status_history` | `reported_at`, as received |
| M-Pesa B2C (Daraja) | ResultCode | `footer.status_history` | `reason`, mapped to §3 |
| M-Pesa C2B (Daraja) | TransID | `footer.external_ids` | mpesa-receipt; also the idempotency key |
| M-Pesa C2B (Daraja) | TransAmount | `body.amount` | |
| M-Pesa C2B (Daraja) | BusinessShortCode | `body.destination` | alias type BUSINESS |
| M-Pesa C2B (Daraja) | BillRefNumber | `body.destination` | the alias's `sub_id`: the account reference |
| M-Pesa C2B (Daraja) | MSISDN, FirstName | `body.payer` | as Safaricom sends it, which may be masked |
| M-Pesa C2B (Daraja) | TransTime | `footer.status_history` | `reported_at`, local time with no zone |
| Kapu Core (Fineract) | transactionAmount | `body.amount` | A decimal: our minor units divided by 100 |
| Kapu Core (Fineract) | externalId | `header.txid` | |
| Kapu Core (Fineract) | receiptNumber | `header.reference` | |
| Kapu Core (Fineract) | transactionDate | `footer.dates` | value_date |
| Kapu Core (Fineract) | resourceId | `footer.external_ids` | issuer fineract, scheme loan-transaction-id |
| Kapu Core (Fineract) | principalPortion, interestPortion, feeChargesPortion, penaltyChargesPortion | `footer.allocation` | |
| Odoo (account.payment) | amount, currency_id | `body.amount` | |
| Odoo (account.payment) | memo | `header.reference` | |
| Odoo (account.payment) | date | `footer.dates` | value_date |
| Odoo (account.payment) | id | `footer.external_ids` | issuer odoo, scheme payment-id |
| A bank, by ISO 20022 | EndToEndId | `header.txid` | 32 characters without hyphens, within its 35 |
| A bank, by ISO 20022 | UETR | `footer.external_ids` | The bank's, a version-4 UUID |
| A bank, by ISO 20022 | InstdAmt | `body.amount` | |
| A bank, by ISO 20022 | ValDt, BookgDt | `footer.dates` | |
| A bank, by ISO 20022 | AcctSvcrRef | `footer.external_ids` | The institution's reference (architecture §2) |

## 5 · Changing it

A field changes in three places together: its row here, its definition
in the schema, and the worked examples; the check fails one without the
others. A change is a register row and a pull request; a major version
also goes to the change advisory board (spec rule 10). An id is never
reused: a withdrawn field keeps its row, marked withdrawn, with what
replaced it and when.
