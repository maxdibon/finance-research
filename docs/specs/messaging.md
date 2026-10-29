---
id: messaging
name: Messaging and its templates — build specification
kind: spec
type: build
status: draft
law: LR-03
released: 2026.10.16
release: R1
implements: [messaging]
depends_on: [access-keycloak, event-bus-kafka, back-office]
used_by: [access-keycloak, lender-rules, observability-grafana]
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-147, FS-153, FS-160, FS-163, FS-532, FS-565, FS-648, FS-663, FS-662, FS-667, FS-668, FS-674, FS-680, FS-684, FS-685, FS-763, FS-768, FS-782, FS-783, FS-784, FS-802, FS-970, FS-1053]
last_reviewed: 2026-10-29
---

# Messaging and its templates — build specification

How the messaging service (docs/modules/messaging.md) is designed to be
built for R1, Roan Capital's pilot, and the catalogue of templates R1
sends: which event sends what, to whom, on which channel, carrying which
fields, on what legal basis, and who owns and approves the words
(FS-648). Nothing here is built; every behaviour is **designed**.

## 1 · Purpose and scope

Messaging answers one question: *may this message go to this person, in
these words, now, and by which route?* It sends what a product's event
asks for, from an approved template, and never claims more delivery than
the channel reported.

| Id | Capability | In R1 |
|---|---|---|
| MS-01 | One messaging API: send from a template, status, inbound | Yes |
| MS-02 | SMS in Kenya directly to the operators, under Dibon's PRSP licence | Yes |
| MS-03 | A sender ID per institution | Yes |
| MS-05 | Routing and failover across routes | No: one route in R1, switched by hand from the runbook (FS-674) |
| MS-06 | WhatsApp with Meta-approved templates | No: SMS and email in R1; WhatsApp once FS-165 is answered (FS-674) |
| MS-09 | A truthful status per message | Yes |
| MS-10 | Replies, keywords, STOP | Yes, replies and STOP |
| MS-11 | Consent per person, channel and purpose, held in the back office (Odoo today), reached through the back-office gateway (back-office §4) | Yes, for SMS and email |
| MS-12 | Events become messages from templates, on each person's channels, with the regulatory overrides | Yes |
| MS-14 | Templates with merge fields; SMS length in the right alphabet | Yes |
| MS-15 | Quiet hours and rate limits | Yes |
| MS-19 | Email through our own relay, notifications and links only | Yes |
| AC-13 | One-time codes for access | Yes, as access's dependency |
| MF-13, MF-26, MF-38, MF-37, MF-39 | Reminders, collection conduct, borrowers' and guarantors' notices, the collection ladder | Yes, as the catalogue below |

**Out of R1:** campaigns (MS-13, phase 2), Telegram and app push (MS-07,
MS-08), the next channel when one fails (MS-16), institutions' own API
and MCP access (MS-17), partners' routes outside Kenya (MS-04).

**Where it sits.**

```
  +------------------+    +------------------+    +------------------+    +------------------+
  | LENDING SERVICE  |    | APPROVAL ENGINE  |    | ACCESS           |    | LENDER RULES     |
  | asks, then acts  |    | decides          |    | signs in         |    | corrects         |
  | [kapu_service]   |    | [kapu_service]   |    | [keycloak]       |    | [kapu_service]   |
  +------------------+    +------------------+    +------------------+    +------------------+
          | loan events           | approval              | one-time              | collection
          | (Kafka)               | emails                | codes                 | policy
          v                       v                       v                       v
  +------------------------------------------------------------------------------------------+
  | MESSAGING                                                                                |
  | sends to people                                                                          |
  | [kapu_service]                                                                           |
  |                                                                                          |
  | template version in force --> merge (no balance, no ID) --> consent and quiet hours      |
  | --> channel the person chose, or the regulatory override --> route --> message log       |
  +------------------------------------------------------------------------------------------+
          |                       |                       |                         ^ consent, opt-
          |                       |                       |                         | outs, by the
          |                       |                       |                         | gateway
          v                       v                       v                         v
   SMS: Safaricom,          WhatsApp                email, our own        +------------------+
   Airtel, Telkom           (with consent)          relay (MS-19)         | ODOO             |
                                                                          | back office      |
                                                                          | [odoo]           |
                                                                          +------------------+
```

**Related:** implements [messaging](../modules/messaging.md); depends on
[access-keycloak](access-keycloak.md), [event-bus-kafka](event-bus-kafka.md) and
[back-office](back-office.md); used by
[access-keycloak](access-keycloak.md),
[lender-rules](lender-rules.md) and
[observability-grafana](observability-grafana.md); journeys
[JN-04](../journeys/loan-to-disbursement.md),
[JN-05](../journeys/guarantor.md),
[JN-06](../journeys/restructuring.md) and
[JN-15](../journeys/micro-trader.md).

## 2 · Concepts

- **Template:** the words for one kind of message, in one language, for
  one channel, with named merge fields. Versioned and effective-dated; a
  message uses the version in force when its event happened.
- **Category:** *transactional* (a state change the person should know),
  *notice* (a message a regulation requires, with proof of delivery),
  *collection* (about money overdue: reg 30 applies), *security* (a
  change to how someone signs in or moves money), *code* (a one-time
  code), *marketing* (phase 2, with its own consent).
- **Owner and approver:** who writes the words and who signs them off
  (§3.3).
- **Event:** what makes a message: a product's event on the bus, or a
  direct request (codes, approval emails). Names follow the event bus
  spec once written; the ones here are proposed.

## 3 · Rules

### 3.1 What a message may carry

Notifications and links only (architecture §7, FS-532):

| May carry | Never carries |
|---|---|
| The amount just paid, received or disbursed | **The outstanding balance** (owner, 2026-10-08, FS-648) |
| **The amount due now:** the instalment due, or the amount overdue that would cure it | A statement, or any document |
| A date; a receipt or transaction reference | A national ID number or other Restricted value |
| The last four characters of a loan or account number | A full account number |
| The paybill and account to pay to | A third party's name: a guarantor's SMS does not name the borrower |
| A single-use link to our own page, where the details sit behind sign-in | An attachment |

The amount due now is what a reminder or notice must state to be of use;
the outstanding balance, the total owed, sits behind the link. A template
whose merge fields include a field marked `balance` or Restricted is
refused at approval, not at sending.

### 3.2 Delivery

- **The person's channels**, chosen at onboarding (SMS by default), by
  self-service, or by staff on request, every change logged (MS-12).
- **Overrides:** security messages go to every channel the person has;
  notices and collection messages always include a channel with delivery
  reports, SMS at least; marketing needs its own opt-in (MS-11).
- **Quiet hours:** collection messages only 08:00 to 18:00, Monday to
  Saturday, not public holidays, Africa/Nairobi (lender-rules §2.6, open
  question 5); held until the window opens, never dropped. Codes and
  security messages are never held.
- **Language:** English or Swahili, as the person chose; English by
  default.
- **Sender:** the institution's own sender ID (MS-03); the institution's
  name opens every SMS.
- **A missing field stops the message.** A template is never sent with a
  placeholder or an empty field; the product is told, and it is an
  exception, not a silent skip.
- **Length:** counted in GSM-7 (160 characters a part) or UCS-2 (70) as
  the text requires; each template's longest likely merge is checked at
  approval, and a template over two parts is refused.

### 3.3 Who owns and approves the words

| Kind | Words owned by | Held in | Approved by |
|---|---|---|---|
| Transactional messages and notices | The institution: its words, its brand; Dibon supplies the defaults in §4 | Messaging, versioned, effective-dated | The institution, maker-checker |
| Collection messages | The institution | Messaging | The institution's compliance role, maker-checker; linted against the banned terms and recipient rules (lender-rules §2.6) |
| WhatsApp templates | The institution | Messaging | The institution, then Meta |
| Marketing (phase 2) | The institution | Odoo | Odoo's approval, with marketing consent |
| One-time codes and security messages | Dibon: the security wording is fixed | Messaging | Dibon, through change enablement (service-management §2) |
| Agreements, key information documents, guarantees | The institution | Odoo Sign templates; signed copies in the vault | The institution, maker-checker (MF-34) |
| Staff notices: approvals, reminders, incidents | Dibon | The approval engine; Odoo email templates | Dibon, through change enablement |

## 4 · The R1 catalogue

`{institution}` is the institution's short name; every SMS opens with it.
Event names are in the event bus catalogue (event-bus-kafka §5).

**Borrowers**

| # | Template | Event | Category | Channels | Fields | Basis |
|---|---|---|---|---|---|---|
| T01 | Application received | `kapu.mfi.application.submitted` | Transactional | SMS | reference | MF-01 |
| T02 | Approved, agreement to sign | `kapu.mfi.loan.approved` | Notice | SMS, email | amount, link | MF-34, MF-38 |
| T03 | Declined | `kapu.mfi.loan.declined` | Transactional | SMS | reference, how to ask why | MF-38 |
| T04 | Signing code | Odoo Sign, through access | Code | SMS | code, minutes valid | MF-34, AC-13 |
| T05 | Disbursed | `kapu.mfi.loan.disbursed` | Transactional | SMS | amount, rail reference, date | MF-38 |
| T06 | Payment received (the receipt) | `kapu.mfi.repayment.allocated` | Notice | SMS | amount, date, receipt reference, loan ending, link | MF-38, reg 39(1) |
| T07 | Due reminder (Roan Capital: day 25 of 30) | `kapu.mfi.loan.ladder.changed` | Transactional | SMS or WhatsApp | amount due now, due date, paybill, account | MF-13, MF-39; RC-20 |
| T08 | Overdue: the default run (day 30) | `kapu.mfi.loan.ladder.changed` | Collection | SMS | amount due now, paybill, account, help line | MF-39, MF-26; reg 30 |
| T09 | Final warning (day 40) | `kapu.mfi.loan.ladder.changed` | Collection | SMS | amount due now, the next step under the agreement and its date, link | MF-39, MF-26; reg 30 |
| T10 | Closure (day 47) | `kapu.mfi.loan.ladder.changed` | Collection | SMS | what happens next, link | MF-39, MF-26; reg 30 |
| T11 | A variation or restructure offered | `kapu.mfi.loan.variation.issued` | Notice | SMS, email | effective date (30 days on), how to accept, link | MF-24, MF-09; reg 54(7) |
| T12 | A variation accepted | `kapu.mfi.loan.variation.accepted` | Transactional | SMS | effective date, link | MF-24 |
| T13 | A product price change | `kapu.mfi.product.version.activated` | Notice | SMS, email | effective date, link | MF-24; reg 55 |
| T14 | Settled | `kapu.mfi.loan.settled` | Transactional | SMS | loan ending, date, what happens to the collateral, link | MF-38, MF-03 |
| T15 | Statement link | On request | Notice | SMS | single-use link, hours valid | MF-38, ID-17 |
| T16 | Complaint acknowledged | `kapu.mfi.complaint.logged` | Notice | SMS, email | complaint reference, the date it will be answered by | MF-28; reg 40 |
| T17 | Complaint resolved | `kapu.mfi.complaint.resolved` | Notice | SMS, email | complaint reference, single-use link to the written answer: what was found, what was done, and that the customer may go to CBK, or to the Data Commissioner for personal data | MF-28; reg 40; JN-08 |
| T41 | Complaint still being dealt with | `kapu.mfi.complaint.pending` | Notice | SMS, email | complaint reference, the date it will be answered by | MF-28; reg 40(4); JN-08 |
| T35 | Disbursement on its way, later than expected | `kapu.mfi.disbursement.delayed` | Transactional | SMS | amount, the bank, when they will hear next | MF-38; rails RL-10 |
| T37 | The amount to settle | On request | Transactional | SMS | amount, the date it is valid to, how to pay, link | MF-22, MF-38; reg 56(3), (4) |
| T38 | Collateral released: originals ready to collect | `kapu.mfi.collateral.released` | Transactional | SMS | what is ready, where, from when, what to bring | MF-03, MF-38 |
| T39 | Sign your authority for someone to collect | Odoo Sign, through access | Transactional | SMS | the collector's name, what is released, valid to, link | MF-03, MF-34 |
| T40 | Handover code: someone is collecting for you | Custody, at handover | Code | SMS | the collector's name, what is being collected, code, minutes valid; "if this is not you, call" | MF-03, AC-13 |
| T36 | Disbursement returned by your bank | `kapu.mfi.disbursement.returned` | Transactional | SMS | amount, the bank, nothing owed on it, how to give another account | MF-38; rails RL-01 |

**Guarantors**

| # | Template | Event | Category | Channels | Fields | Basis |
|---|---|---|---|---|---|---|
| T18 | Consent asked | `kapu.mfi.guarantor.named` | Notice | SMS | link; never the borrower's name | MF-37; reg 42(1) |
| T19 | Periodic statement | `kapu.mfi.guarantor.statement.due` | Notice | SMS, email | link | MF-37; reg 47(2) |
| T20 | Fourteen days' notice of default | `kapu.mfi.guarantor.notice.issued` | Notice | SMS, email | the date the notice runs to, link | MF-37; reg 42(4) |
| T21 | Guarantee released | `kapu.mfi.guarantee.released` | Transactional | SMS | loan ending, date | MF-37 |
| T33 | A demand to the guarantor, after the notice and the recovery from the borrower | `kapu.mandates.request.approved` (subject `guarantee.demand`) | Notice | SMS, email | link to the demand, its itemised amounts | MF-37; reg 42(3), 43 |
| T34 | A restructure: asked to consent where their exposure grows | `kapu.mfi.loan.variation.issued` | Notice | SMS, email | link; never the borrower's name | MF-37, MF-09 |

**Everyone: codes and security**

| # | Template | Event | Category | Channels | Fields | Basis |
|---|---|---|---|---|---|---|
| T22 | Sign-in code | Access, realm `customers` | Code | SMS | code, minutes valid | AC-03, AC-13 |
| T23 | Access blocked, at the person's request | `kapu.access.blocked` | Security | Every channel | how to recover | AC-14 |
| T24 | SIM changed: money movement held | `kapu.identity.sim.changed` | Security | Every channel but the changed SIM | how to re-verify | ID-13 |
| T25 | Recovered: new device, number or PIN | `kapu.access.recovered` | Security | Every channel | what changed, lower limits until when | AC-15 |
| T42 | Your access changed | `kapu.access.role.changed`, `kapu.access.user.disabled` | Security | Email, to the staff member's work address | the role granted or removed, or the account disabled; who approved it; when; "if you did not expect this, tell your administrator" | AC-09; JN-18 |
| T31 | Phone confirmation code | Identity, on enrolment | Code | SMS | code, minutes valid | ID-11, AC-13 |
| T32 | Document upload link | Identity, from the checklist | Transactional | Email, or SMS | single-use link, hours valid | ID-15 |

**Staff** (email, through our relay; no names, ID numbers or documents)

| # | Template | Event | Category | Fields | Basis |
|---|---|---|---|---|---|
| T26 | Approval waiting | `kapu.mandates.step.opened` | Transactional | request reference, product, amount, step, due time, signed link | MD-18 |
| T27 | Approval reminder, then escalation | `kapu.mandates.sla.breached`, `kapu.mandates.step.escalated` | Transactional | the same, and who it escalated to | MD-08 |

**Payers whose payment could not be placed** (collect CO-21, FS-663)

| # | Template | Event | Category | Channels | Fields | Basis |
|---|---|---|---|---|---|---|
| T28 | A payment we could not place | `kapu.collect.payment.unplaced` | Transactional | SMS, and WhatsApp where the payer has consented | amount, date, M-Pesa reference, how to reply, link | CO-21 |
| T29 | Reminder, at 24 hours | `kapu.collect.payment.still_unplaced` | Transactional | SMS | the same | CO-21 |
| T30 | Returned to you | `kapu.collect.payment.returned` | Transactional | SMS | amount, date, the return's reference | CO-21; rails RL-01 |
| T43 | Deposit received | `kapu.collect.deposit.posted` | Transactional | SMS | amount, account ending, date, M-Pesa receipt, link; never the balance | CO-18; JN-10 |
| T44 | Deposit not accepted | `kapu.collect.deposit.refused` | Transactional | SMS | amount, that no money left their wallet, the reason in plain words (number not recognised; contact the bank; above the limit, and how to raise it); never an account holder's name | CO-21; JN-10 |
| T45 | Transfer sent | `kapu.rails.payout.sent` (a customer's transfer) | Transactional | SMS | amount, the recipient's bank and account ending, the reference to give the recipient, the day it should arrive | RL-27; JN-11 |
| T46 | Transfer not completed | `kapu.rails.payout.failed`, `kapu.rails.payout.returned` (a customer's transfer) | Transactional | SMS | amount, the reason in plain words, that it is back in their account and from which date | RL-27, RL-01; JN-11 |
| T47 | Transfer received | `kapu.rails.payment.received` (a bank transfer applied to a customer's account) | Transactional | SMS | amount, the sender's name, the reference, account ending, date; never the balance | RL-27; JN-12 |
| T48 | A charge corrected | `kapu.mfi.loan.charge.waived` (a late posting or a disruption window) | Transactional | SMS | what was corrected, the amount, why in plain words ("your payment of {date} was counted on that date"), link | MF-22; lender-rules §2.10 |

The payer may not be a customer: T28 to T30 name no account holder and
no other person, and carry nothing but the payer's own payment. Replies
are handled in Flowza's inbox and recorded on the ticket (§5).

Incident and end-of-day notices follow the incident plan's own templates
(docs/service-management/incident-management.md §4).

**Default wording, four examples** (Swahili drafted here, to be reviewed
by a native speaker before use):

| # | English | Swahili (draft) |
|---|---|---|
| T06 | {institution}: KES {amount} received for loan ending {loan_last4} on {date}, ref {receipt}. Details: {link} | {institution}: KES {amount} imepokelewa kwa mkopo unaoishia {loan_last4} tarehe {date}, kumbukumbu {receipt}. Maelezo: {link} |
| T07 | {institution}: KES {amount_due} is due on {due_date} for loan ending {loan_last4}. Pay to paybill {paybill}, account {account}. | {institution}: KES {amount_due} inadaiwa tarehe {due_date} kwa mkopo unaoishia {loan_last4}. Lipa kwa paybill {paybill}, akaunti {account}. |
| T18 | {institution}: you have been named as a guarantor for a loan. See whose loan and for how much, and decide: {link} | {institution}: umetajwa kuwa mdhamini wa mkopo. Angalia ni wa nani na kiasi gani, kisha uamue: {link} |
| T20 | {institution}: the loan you guarantee is in default. No demand can be made of you before {date}. Details: {link} | {institution}: mkopo unaoudhamini haujalipwa. Hakuna madai yatakayotolewa kwako kabla ya {date}. Maelezo: {link} |

## 5 · Interfaces

**Endpoints** (messaging service, internal; MS-01):

| Endpoint | Purpose |
|---|---|
| `POST /v1/messages` | Send: template, recipient's party id, fields, idempotency key |
| `GET /v1/messages/{id}` | Status, as the channel reported it (MS-09) |
| `POST /v1/templates`, `.../{id}/versions` | Draft a template or a new version |
| `POST /v1/templates/{id}/versions/{v}/approve` | Maker-checker; refused if a rule in §3 fails |
| `GET /v1/templates/{id}/versions/{v}/preview` | The text with its longest likely merge, and its part count |

**The conversation layer:** Flowza, Dibon's own engagement platform,
is the team inbox and automation for two-way conversations: the payers
of T28 to T30, and WhatsApp support for the service desk. It sends
through this service, so templates, consent, quiet hours, sender IDs and
the message log stay in one place; each conversation is linked to its
Odoo Helpdesk ticket (FS-663). Before an institution's customers' data
passes through it, it is hosted in Kenya per institution, its privacy
terms carry no transfer abroad, and it uses only the official WhatsApp
Business API (FS-664 to FS-666).

**Events in:** each institution's mapping from product events to
templates (§4), configured, effective-dated and approved like a
template.

**Events out** (proposed names): `kapu.messaging.message.sent`,
`.delivered`, `.failed`, `.held` (quiet hours), `.blocked` (a rule
refused it), `.opted_out`.

## 6 · Security and audit

- **No Restricted data in any message**, by the template rule in §3.1,
  checked at approval.
- **Every template version and its approval are kept**, append-only;
  every message records the version it used.
- **The message log** is append-only; message bodies are kept only for
  their retention period (FS-063); the log of who was sent what, when,
  and its status, for the institution's record period.
- **Codes are never logged**, only their hashes (SE-18).
- **Operator binds and partner credentials** in OpenBao.

## 7 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| Templates, versions and their approvals | Internal | Always | — |
| The message log: to whom, which template and version, when, status | Confidential | The institution's record period | Phone numbers, email addresses |
| Message bodies | Confidential | Their retention period only (FS-063) | As the template's fields |
| Consent and channel choices | Confidential | In Odoo (MS-11) | The person's |
| One-time codes | Restricted | Never: only their hashes | — |

## 8 · Quality and metrics

- **Codes delivered within 30 seconds** at the 95th percentile; a receipt
  within a minute of its posting (proposed).
- **Metrics:** sent, delivered and failed by route and template; held;
  blocked; opt-outs; code latency.
- **Alerts** (observability-grafana §4): failures on a route; codes slow.

## 9 · Threats

| Threat | For example | The answer |
|---|---|---|
| Spoofing | An SMS pretending to be the institution | Registered sender IDs (MS-03); our messages never ask for a PIN or code |
| Tampering | A merge field carrying injected text | Fields typed and escaped; only approved templates sent |
| Information disclosure | A balance or an ID number in an SMS | Refused at the template's approval (§3.1) |
| Information disclosure | A code intercepted after a SIM swap | Codes short-lived; an IMSI change holds sign-in (ID-13) |
| Repudiation | "I was never told" | The message log, with the channel's own status |
| Denial of service | Floods, or cost run up | Rate limits per recipient and institution (MS-15) |
| Identifiability (privacy) | A guarantor or payer told about someone else | Their templates name no one else (T18, T28) |

## 10 · Acceptance tests

| # | Given | When | Then | Id, source |
|---|---|---|---|---|
| M1 | A template with no approved version | An event asks for it | Not sent; exception to the product | MS-12 |
| M2 | A template draft with a `balance` field | Approval | Refused | §3.1, FS-648 |
| M3 | A repayment of KES 5,000 | Allocated | T06 by SMS: amount, date, reference, loan ending, link; no balance | MF-38 |
| M4 | A borrower who chose WhatsApp only | A receipt | WhatsApp, and SMS as well (regulatory override) | MS-12 |
| M5 | T08 due at 19:30 on a Saturday | Sent | Held to 08:00 on Monday; `held` event | MF-26, MS-15 |
| M6 | A collection template addressed to an alternative contact | Send | Refused; `blocked` event | MF-26; lender-rules A15 |
| M7 | A collection template with a banned term | Approval | Refused | MF-26; lender-rules A16 |
| M8 | A borrower who chose Swahili | T07 | Swahili version | §3.2 |
| M9 | A template whose longest merge runs to three SMS parts | Approval | Refused | MS-14 |
| M10 | A merge field missing at sending | Send | Not sent; exception | §3.2 |
| M11 | A new T07 version effective tomorrow | An event today | Today's version used | §2 |
| M12 | STOP received | A marketing message and a T06 | Marketing blocked; T06 sent | MS-10, MS-11 |
| M13 | A guarantor named | T18 | No borrower's name in the SMS | MF-37 |
| M14 | The operator reports nothing | Status asked | "Handed to the operator", never "delivered" | MS-09 |
| M15 | A payment from a number that is no customer's | Unplaced | T28 to the paying number; no account holder named | CO-21 |
| M16 | Unclaimed at day 7 | Returned | T30 with the return's reference | CO-21 |

## 11 · Open questions

**For the owner:**

1. The amount due now on reminders and notices (§3.1): the instalment or
   the overdue amount, never the outstanding balance. Designed so;
   confirm.
2. Whether Dibon's PRSP licence covers application-to-person SMS,
   sender IDs and two-way messages (FS-160).
3. Whether WhatsApp's policies allow lenders' messages (FS-165).

**For Roan Capital:**

1. Its sender ID, and its help line for the templates.
2. The wording of its collection messages, from the defaults, approved by
   its compliance role.
3. Working hours for collection messages (lender-rules open question 5).

**For the gateway** (phase 2): its payment templates carry the merchant's
paybill or till and the reference in their text (gateway GW-16, FS-662).

**Before use:** a native speaker reviews every Swahili template.

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](../law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 30 | reg 30 | No harassing, shaming or threatening collection: nothing posted to shame a borrower (30(1)(d)), no messages to their contacts (30(1)(e)), no calls outside working hours, no taking of essential personal effects (30(1)(k)); no charges not disclosed in the contract (30(2)); land security recovered under the Land Act (30(3)); thirty days' notice before selling movable security (30(4)) |
| reg 39 | reg 39(1) | A receipt for every transaction, a free loan statement on request and a way to see it at any time (39(1)); errors corrected promptly (39(2)); a guarantor kept informed through periodic statements (39(3)) |
| reg 40 | reg 40, reg 40(4) | A complaints mechanism made known to customers; acknowledgement within seven days where a complaint cannot be dealt with promptly; an oral complaint unresolved after forty-eight hours confirmed in writing; resolution within thirty days |
| reg 42 | reg 42(1), reg 42(3), reg 42(4) | A guarantor's consent sought and obtained before the appointment; recourse to a guarantor only after non-judicial recovery from the borrower is exhausted, and after fourteen days' notice of the default |
| reg 43 | reg 43 | Recovery expenses only those absolutely necessary, each itemised and justified to the borrower; a sale of a customer's or guarantor's property done transparently |
| reg 47 | reg 47(2) | Product information fair, clear and current, and easily available at branches, websites and every channel (47(1)(d)); the lender says it is regulated by the Central Bank, and shows its company name |
| reg 54 | reg 54(7) | At signing, the customer receives the agreement, the repayment schedule and the total cost of credit; the agreement states the loan, charges, rates, the APR, early repayment without charge (54(4)(h)) and more (54(4)); a variation needs thirty days' notice and the borrower's acceptance (54(7)) |
| reg 55 | reg 55 | Pricing parameters and credit terms change only with the Central Bank's prior written approval, after thirty days' notice to the customer and the customer's acceptance |
| reg 56 | reg 56(3), reg 56(4) | A repayment credited on the day it is paid, applied to due principal, then fees and charges, then interest; early repayment, in whole or part, without notice or penalty (56(3)), and no interest for the remaining term on full early repayment (56(4)) |
