---
id: architecture
name: Platform architecture — who holds what
kind: architecture
version: 0.2.0
owner: Solution architect
classification: Internal
review_ids: [FS-025, FS-026, FS-027, FS-031, FS-032, FS-034, FS-036, FS-037, FS-038, FS-043, FS-056, FS-061, FS-062, FS-063, FS-403]
last_reviewed: 2026-10-03
---

# Platform architecture — who holds what

**Status: designed.** This document describes how the portfolio is meant to
divide responsibility. It does not say what is built. Each module's §3
carries that, with evidence.

**This file owns the division of labour (FS-025).** Modules link here and
list only the rows that apply to them. They do not restate the rules. Where
a module and this file disagree, this file is right until it is changed
deliberately.

---

## 1 · The portfolio, by layer

Draft, pending FS-034.

| Layer | Contents |
|---|---|
| **Channels** | omni-channel — mobile apps, internet banking, USSD |
| **Products** | collect · gateway · escrow · core (hosted Fineract) · mfi · sacco (deposit-taking and credit-only) · sme-recon (Odoo / Zoho wrapper) · business-suite (Odoo or Zoho, implemented by Dibon) |
| **Shared services** | recon-observability · mandates (signing and debit) · crb (batch, and individual from the ERP) · access (Keycloak) · identity (verification) · messaging (SMS, WhatsApp, Telegram, app; transactional and campaigns) · rails · insights |
| **Systems of record** | institution core / Fineract · Odoo · recon engine — §2 |

```
 +--------------------------------------------------------------------+
 | CHANNELS       omni-channel: mobile apps . internet banking . USSD |
 +--------------------------------------------------------------------+
                                  |
 +--------------------------------------------------------------------+
 | PRODUCTS     collect . gateway . escrow . mfi . sacco . sme-recon  |
 +--------------------------------------------------------------------+
                                  |
 +--------------------------------------------------------------------+
 | SHARED       recon-observability . mandates . crb . access .       |
 | SERVICES     identity . messaging . rails . insights               |
 +--------------------------------------------------------------------+
          |                       |                        |
 +------------------+   +-------------------+   +--------------------+
 | FUNDS LEDGER     |   | ODOO              |   | RECON ENGINE       |
 | institution core |   | who, and what is  |   | matches and        |
 | or Fineract      |   | owed              |   | exceptions         |
 +------------------+   +-------------------+   +--------------------+
```

---

## 2 · Three authorities

Every record in the platform has exactly one system that is authoritative
for it. There are three. They are separate systems, and policy alone does
not keep them apart.

| Authority | Holds | Never holds |
|---|---|---|
| **Funds ledger** — the institution's core banking system; or Fineract where the institution has none (§4) | Accounts, balances, postings, loan schedules, deposits | Parties' contact details beyond what the core needs; tickets; matching state |
| **Odoo** — who, and what is owed | Parties, memberships, roles, obligations (invoices, fees, charges), payments *as records of obligations met*, tickets, documents, signatures (Odoo Sign) | Balances of funds; transaction-level rail events; matching state |
| **Recon engine** — what happened between them | Ingested rail and bank events, statements, matches, exceptions, the audit of every resolution | Parties; obligations; balances as an authority |

### Whose parties Odoo holds

**Odoo is the authority for parties that no core already holds** (FS-172).
Where an institution has a core banking system, **the core is the
authority for that institution's own customers and members, with their
KYC.** Their accounts and their identity are one regulated record, and
splitting them would put a bank's or a Sacco's customer file in two
systems. In that case Odoo holds the institution itself as *our*
customer: its contract, users, tickets and invoices.

| Who | Authority |
|---|---|
| An institution, as Dibon's customer | Odoo |
| A bank's customers, a Sacco's members, a collector's end users | The institution's core, or Fineract in native mode |
| An SME's customers and suppliers | The SME's ERP |
| Parties in a product with no core — escrow parties, merchants, Dibon's own contacts | Odoo |

Collect, Sacco and MFI already work this way. In native mode, Fineract is
the core and holds the members.

### The rule to defend

**Reference by id; never copy.** A system may refer to another's record by
its id. It may not keep its own copy of the content.

One copy is allowed: **a fact written into an event at the time it
happened.** A matched transaction records the payer name the rail
reported, because that is a fact about the transaction.

> **The test: if correcting a record in its authority would make a row
> elsewhere wrong, that row should not exist.**

**The failure this prevents arrives reasonably.** A recon screen needs a
customer name and the join is slow, so the name gets cached. Then the
phone number, then the account. Six months later there are two answers to
who owns an account.

### Why they are separate

1. **Availability.** A payment callback must be answered while Odoo is down
   for an upgrade. The rails do not wait.
2. **Volume and shape.** Rail events are high-volume and append-only. An
   ERP's ORM is the wrong tool for them, and the recon engine must not run
   inside Odoo (FS-018).
3. **Retention.** Raw rail events, matched records and invoices each have
   their own retention obligation, and the obligations differ.
4. **Blast radius.** A breach of Odoo exposes what people owe. A breach of
   the recon store exposes how money moved. Separate stores keep these two
   separate breaches.

### The institution's reference is a first-class field

Every payment record carries the rail's or the bank's own identifier as a
field of its own, not inside a note. **A reconciliation that cannot name
the institution's identifier for a transaction is one nobody can audit.**
A receipt we generate cites that reference rather than restating it.

---

## 3 · The custody line

**Holding funds is what needs a licence; causing a payment does not.**
The regulated question is whether funds ever rest under our control, not
whether we caused a payment.

| Pattern | What happens | Funds under our control? | Licence needed |
|---|---|---|---|
| **Pass-through** | The payer pays into the institution's or merchant's own account or shortcode. We prompt, read the confirmation, reconcile | No | None of ours |
| **Initiation** | We instruct a payment from the customer's own account, on its approval (sme-recon execution, debit mandates) | No — subject to FS-037 | To confirm (FS-037) |
| **Aggregation** | Funds land in an account we control, then are split or settled onward | **Yes, however briefly** | PSP licence (FS-031) or a licensed partner |

**Where each product sits:**

| Module | Pattern | Open |
|---|---|---|
| collect | Pass-through into the institution's accounts | FS-056 — if the shortcodes or trust account are ours, it becomes aggregation |
| gateway | Pass-through where merchants use their own shortcodes. Aggregation where we settle to merchants | FS-061 |
| mfi | Pass-through: the MFI's own shortcodes and accounts | — |
| sacco | Pass-through: the Sacco's own accounts | — |
| sme-recon | Pass-through for matching; initiation for execution | FS-037 |
| mandates (debit) | Initiation | FS-046 |
| escrow | Initiation: the partner bank holds each escrow in its own sub-account; we instruct release on the agreed approvals | FS-107, FS-108 — if Dibon held the funds, it would be aggregation |

**Rail and bank credentials stay on the server.** Channel apps ask our
server, and our server calls the rail. Daraja keys, bank API credentials
and signing keys are never placed in a mobile app, a USSD gateway
configuration or a browser, because anyone can unpack an app. On the
server they are held in OpenBao (§6, FS-403).

---

## 4 · Ledger modes

**Every module assumes at least these two models** (FS-065): the customer
has a core banking system, or it does not. Each module's §4 states how it
behaves under both. The same interface has two implementations, chosen by
configuration, so the mode is not a fork of the code.

| Mode | When | What we do |
|---|---|---|
| **Integrated** | The institution has a core banking system | **The core stays authoritative.** We read and post through its API. Any copy we keep is a cache with a fetched-at time |
| **Native** | No digital ledger exists — an unregistered MFI, a small credit-only Sacco | **Fineract is the funds ledger.** One authority, so there is no core to reconcile against (MFI PRD §1) |

**Integrated comes first, always.** Integrating with a core is a read.
Replacing one means migrating somebody's history, and that is a separate
decision with a separate agreement. A deposit-taking Sacco in native mode
holds members' deposits in Fineract under SASRA's rules, which makes Dibon
a core-system vendor. That is the intent (FS-178), and its requirements
fall on us before the first such Sacco goes live (FS-179).

**A third mode is likely and is not assumed yet:** a core that holds
deposits but has no loan module, so loans go to Fineract and deposits stay
in the core. That splits the funds ledger across two systems, and recon
then has to tie them together (FS-066).

The same pattern applies to ERPs: sme-recon has **one interface and one
implementation per ERP** — Odoo first, then Zoho and others (FS-027).

---

## 5 · Feeds — never one rail, never one feed type

Every integration states its feed type. **Statement files are supported
from day one, and real-time callbacks are an upgrade** (FS-038). Smaller
institutions often have no webhook to offer.

| Feed | Typical source | Latency |
|---|---|---|
| Real-time callback | M-Pesa, Airtel Money, card acquirers, bank APIs that offer it | Seconds |
| API pull | Bank balance and transaction APIs | Minutes, on our schedule |
| Statement file | Smaller banks and Saccos; end-of-day statements from any rail | Daily |

Matching rules that hold on every rail:

1. **Match on the strongest key first.** For mobile money, that is the
   paying phone number, before the reference the payer typed by hand.
2. **One credit against several obligations is a human allocation
   decision,** and the screen must let somebody make it.
3. **If nothing matches, the credit sits unapplied and visible.** Never
   guessed: a wrongly applied payment produces an arrears figure that is
   confidently false.

---

## 6 · Shared services and the bus

- **Event bus:** Kafka between services.
- **Secrets:** OpenBao holds rail and bank credentials, signing keys and
  service secrets, per customer, in every deployment option. It is the
  Linux Foundation fork of HashiCorp Vault, under MPL-2.0, with the same
  API. Vault itself has been under the Business Source License since
  August 2023, which §6.1 does not allow without a decision (FS-403).
- **Observability:** Prometheus (metrics), Loki (logs), Tempo or Jaeger
  (traces), Grafana (dashboards, alerting, SLOs). Grafana is for
  operations. Business BI is insights, a separate module.
- **Mandates:** one engine for signing mandates (who may approve what,
  maker-checker, committee chains) and for the records behind debit
  mandates. Designed in MFI PRD FR-6 as a platform service; Collect, Sacco,
  Gateway and sme-recon are its consumers.
- **Identity:** national register lookup (NPDM, formerly IPRS) on onboarding. The result is stored on the
  party in its authority, not copied into consumers.
- **Insights:** reads from the three authorities through a semantic layer
  of governed metric definitions. **It never writes.** Every answer shows
  the definition and query behind it. The model is not chosen yet — FS-043.
- **Access and identity:** Keycloak for login, roles and step-up (access);
  the national register (NPDM, formerly IPRS) and verification vendors for
  who a person is (identity).

### 6.1 · Licences

Decided 2026-10-01 (FS-223); MPL-2.0 added 2026-10-03 (FS-403):

| Licence | Allowed | Condition |
|---|---|---|
| Apache-2.0, MIT, BSD-2, BSD-3, ISC | Yes | — |
| AGPL-3.0 | Yes, **for services run unmodified and separately** | We do not change their source, and we do not link them into our code. A change to an AGPL service's source is a decision that triggers publishing that source to its network users, so it is never made in passing |
| MPL-2.0 | Yes, **used unmodified** | MPL's copyleft is per file: a change to one of its files is published with that file. We do not make such changes in passing |
| GPL, LGPL, SSPL, BSL, and anything unlisted | Not without a decision | Recorded in docs/decisions.md |

Today's AGPL services: Grafana, Loki and Tempo (observability). Today's
MPL service: OpenBao (secrets). Insights
uses Superset, which is Apache-2.0 (FS-230). **CNCF projects are Apache-2.0**, so they
are the default where they fit (FS-217).

---

## 7 · Controls that cross every module

- **Attribution at the act.** Anything that moves money, binds somebody,
  approves or reveals a person is authenticated when it happens. Logging
  in at the start of a session is not enough.
- **Nothing resolves an exception by inference.** A break stays open and
  visible until evidence closes it, and the audit keeps every step.
- **Data classes travel with the data.**

| Class | Examples |
|---|---|
| Public | Published product material |
| Internal | Designs, this document, backlogs |
| Confidential | Names, phone numbers, account numbers, balances, statements, KYC documents |
| Restricted | Government ID numbers, credentials, tokens, signing keys, card data |

A pile is not the sum of its rows. A bulk export is a different act from
a lookup and needs its own permission. Restricted values never appear in
logs or samples.

---

## 8 · Odoo, at least cost to the customer

Assume Odoo Enterprise, since we are integration partners (FS-026). The cost
of an Odoo deployment is internal users, so external people stay external:

- **Portal users** for members, borrowers, partners and merchants who view
  statements, invoices and tickets.
- **Odoo Sign** for external signers: mandates, debit consents, account
  opening, loan agreements. Signers do not need user accounts. Legal
  sufficiency is checked per document type (FS-049).
- **API service accounts** for our services writing obligations and
  payments into Odoo.

**Whether the Enterprise Agreement limits any of these is unconfirmed**
(FS-036). This section is a plan until it is read against the agreement.

---

## 9 · Hosting

On-prem in the institution, or on Liquid's Azure Stack (FS-032). **Anything
that would leave that boundary is named in the module that sends it, with
its data class.** Today the known candidate is insights' model (FS-043).
Whether Liquid's Stack offers a hosted model service or GPU capacity is a
question for Liquid (FS-048).

---

## 10 · What this document does not decide

- Product status — each module's §3.
- Pricing and business models (FS-024).
- The legal questions it points at: FS-037, FS-049, FS-056, FS-057, FS-061.
- Whether the portfolio map in §1 is final (FS-034).

## 11 · Sources

- REVIEW.md decisions FS-025 to FS-033, FS-042 to FS-045.
- odoo-reconciliation.md (GateKeepr brief), §2 and §3. The principles
  carry over; the GateKeepr references do not (FS-014).
- Kapu Pay MFI PRD section, Draft v0.2, Jun 2026 — §1, §4, FR-6.
- KapuPay Discussion, meeting notes, 8 Jun 2026.
- Automated Channels Reconciliation proposal — the observability stack.
