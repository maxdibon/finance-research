---
id: architecture
name: Platform architecture — who holds what
kind: architecture
status: draft
released: 2026.10.15
owner: Solution architect
classification: Internal
review_ids: [FS-025, FS-026, FS-027, FS-031, FS-032, FS-034, FS-036, FS-037, FS-038, FS-043, FS-056, FS-061, FS-062, FS-063, FS-403, FS-410, FS-428, FS-431, FS-444, FS-446, FS-448, FS-449, FS-453, FS-464, FS-490, FS-491, FS-500, FS-525, FS-527, FS-532, FS-584, FS-588, FS-590, FS-612, FS-630, FS-634, FS-635, FS-636, FS-644, FS-645, FS-646, FS-649, FS-661, FS-662, FS-699, FS-700, FS-703, FS-712, FS-793]
last_reviewed: 2026-10-13
---

# Platform architecture — who holds what

**Status: designed.** This document describes how the portfolio is meant to
divide responsibility. It does not say what is built. Each module's §3
carries that, with evidence.

**This file owns the division of labour (FS-025).** Modules link here and
list only the rows that apply to them. They do not restate the rules. Where
a module and this file disagree, this file is right until it is changed
deliberately.

**This folder** (FS-649) holds the principles here, §1 to §10, and the
views beside them:

| View | What it shows |
|---|---|
| [context.md](context.md) | Who and what the platform connects to |
| [instance.md](instance.md) | What runs in one institution's instance, as R1 deploys it; the environments |
| [deployment.md](deployment.md) | The sites, the fleet, and what Dibon runs centrally |
| [runtime.md](runtime.md) | How a payment moves: a disbursement out, then a repayment in, as sequence diagrams |
| [interfaces.md](interfaces.md) | The rules every service's contract follows |
| [quality.md](quality.md) | Quality goals, measurable, and where each is met |
| [constraints.md](constraints.md) | What we design within, and where it comes from |
| [risks.md](risks.md) | What could undo the design, and what we do about it |
| [technology.md](technology.md) | Every component we run, by class: its licence, who governs it, the alternatives, our verdict |
| [flows.md](flows.md) | How the components work together, one question at a time: first, a request coming in through the edge |

**Who reads it, for what:**

| Reader | Start with |
|---|---|
| A regulator, an auditor or an institution's risk team | §3, §2, §7, [constraints](constraints.md), [deployment](deployment.md), [risks](risks.md) |
| An institution's IT team | [Context](context.md), §4, §5, [instance](instance.md), [deployment](deployment.md), §9 |
| A builder | §2, §6, [interfaces](interfaces.md), [runtime](runtime.md), then the [specs](../specs/README.md) |
| Security | §7, §9, [deployment](deployment.md), platform-security |
| Operations | [Deployment](deployment.md), [quality](quality.md), [service management](../service-management/README.md) |

The rationale behind each rule is in [decisions.md](../decisions.md), the
record of architecture decisions.

---

## 1 · The portfolio, by layer

| Layer | Contents |
|---|---|
| **Channels** | omni-channel — mobile apps, internet banking, USSD, the field-officer app |
| **Products** | collect · gateway · escrow · core (Kapu Core: hosted core banking on Apache Fineract) · mfi · sacco (deposit-taking and credit-only) · sme-recon (Odoo / Zoho wrapper) · business-suite (Odoo or Zoho, implemented by Dibon) |
| **Shared services** | recon-observability · mandates (signing and debit) · crb (batch, and individual from the ERP) · access (Keycloak) · identity (verification) · messaging (SMS, WhatsApp, Telegram, app; transactional and campaigns) · rails · insights · financial-crime (fraud, AML/CFT, transaction rules, reporting) · decisioning (appraisal, scores, risk classes) · platform-security |
| **Systems of record** | the institution's core, or Kapu Core · Odoo · recon engine — §2 |

```
 +--------------------------------------------------------------------+
 | CHANNELS     omni-channel: mobile apps . internet banking . USSD . |
 |              field-officer app                                     |
 +--------------------------------------------------------------------+
                                  |
 +--------------------------------------------------------------------+
 | PRODUCTS     collect . gateway . escrow . mfi . sacco .            |
 |              sme-recon . core . business-suite                     |
 +--------------------------------------------------------------------+
                                  |
 +--------------------------------------------------------------------+
 | SHARED       recon-observability . mandates . crb . access .       |
 | SERVICES     identity . messaging . rails . insights .             |
 |              financial-crime . decisioning . platform-security     |
 +--------------------------------------------------------------------+
          |                       |                        |
 +------------------+   +-------------------+   +--------------------+
 | FUNDS LEDGER     |   | ODOO              |   | RECON ENGINE       |
 | institution core |   | who, and what is  |   | matches and        |
 | or Kapu Core     |   | owed              |   | exceptions         |
 | (Fineract)       |   |                   |   |                    |
 +------------------+   +-------------------+   +--------------------+
```

---

## 2 · Three authorities

Every record in the platform has exactly one system that is authoritative
for it. There are three. They are separate systems, and policy alone does
not keep them apart.

| Authority | Holds | Never holds |
|---|---|---|
| **Funds ledger** — the institution's core banking system; or Kapu Core, on Apache Fineract, where the institution has none or is replacing it (§4) | Accounts, balances, postings, loan schedules, deposits | Parties' contact details beyond what the core needs; tickets; matching state |
| **Odoo** — who, and what is owed | Parties, memberships, roles, obligations (invoices, fees, charges), payments *as records of obligations met*, tickets, documents, signatures (Odoo Sign) | Balances of funds; transaction-level rail events; matching state |
| **Recon engine** — what happened between them | Ingested rail and bank events, statements, matches, exceptions, the audit of every resolution | Parties; obligations; balances as an authority |

**And one verifier.** Recon is also the platform's verifier (FS-793,
docs/specs/recon.md): it holds a shadow of the funds ledger, rebuilt
from its postings, and a companion that computes on its own what every
account should hold, and raises any disagreement among the three. It
never writes to an authority; a correction goes back through the
authority that owns the record.

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
| A bank's customers, a Sacco's members, a collector's end users | The institution's core, or Kapu Core in native mode |
| An SME's customers and suppliers | The SME's ERP |
| Parties in a product with no core — escrow parties, merchants, Dibon's own contacts | Odoo |

Collect, Sacco and MFI already work this way. In native mode, Kapu Core is
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

### Every store: what it holds, and how it is protected

The three authorities above, and every other store, in one place
(FS-636). **The baseline for every store:** inside the institution's own
instance (FS-491); reached only through its service's API; encrypted at
rest (platform-security SE-08) and in transit (SE-05, SE-09); backed up
to two Kenyan sites (SE-10); retention set by docs/documents.md and
docs/privacy.md. The last column adds what goes beyond it.

| Store | Holds | Never holds | Class | Beyond the baseline |
|---|---|---|---|---|
| Funds ledger (the core, or Kapu Core) | Accounts, balances, postings, loans; in native mode, the institution's customers and their KYC | Contact details beyond its need, tickets, matching state | Confidential; ID numbers Restricted | One writer, the product's service account (docs/specs/kapu-core-fineract.md §8); ID numbers encrypted field by field (SE-27, in R1) |
| Odoo | Parties no core holds, obligations, tickets, contract records, HR | Balances, rail events, documents with personal data | Confidential | Staff sign in through Keycloak (AC-02) |
| Recon engine | Rail and bank events, statements, matches, exceptions | Parties, obligations | Confidential | Append-only; each role sees only its fields (RO-19) |
| Keycloak (access) | Logins, hashed credentials, roles, devices, step-ups | KYC, balances | Restricted | Security events kept (SE-18); engineers on hardware keys (SE-26) |
| Document vault (identity) | Every document carrying personal data; verification evidence | Balances | Confidential; ID images Restricted | Reached only by links on our own network (§7); a bulk export needs its own permission |
| Approval engine | Requests, decisions, mandate rules | The subject's record, which it refers to by id | Confidential | Every decision re-authenticated (mandates MD-10); append-only |
| Decisioning | The decision record: inputs, version and score at the time | The customer file | Confidential | Profiling under privacy PR-18 |
| Messaging | What was sent, to which number, delivery, preferences, quiet hours | Documents, balances, ID numbers (§7) | Confidential | Templates approved before use |
| Financial crime | Screening results, cases, draft reports | The decision to file, which is the institution's | Confidential | Cases seen only by the institution's reporting roles |
| Rails | Instructions and normalised rail events | Credentials | Confidential | Instructions signed, with their content hash (RL-01); credentials in OpenBao (RL-12) |
| Event bus | Events in transit, kept for replay | Anything not in an event | Confidential | Every event signed (RO-23) |
| Audit chain | Signed event hashes and their anchors | Content beyond the event | Internal | Hash-chained, anchored in an append-only log (RO-24, RO-25) |
| OpenBao | Keys and secrets | Data | Restricted | Signing keys never leave it; backup keys split between two people (SE-21) |
| Observability | Metrics, logs and traces, by id | Personal data | Internal | Restricted values never in a log (SE-18) |
| Insights | Nothing of its own: it reads | — | As read | Never writes; a bulk export needs its own permission (§7) |

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

**Custody is not the only test.** The National Payment System Act defines
a payment service provider to include whoever processes or stores data on
behalf of one (s.2), and a reported High Court ruling read that widely
(FS-428). Dibon may therefore need authorisation even in pass-through.
Compliance LC-06 now prepares for it, with a legal opinion on the category
first (FS-444). The custody line still decides who holds money; on its own
it no longer settles whether Dibon needs a licence.

**Rail and bank credentials stay on the server.** Channel apps ask our
server, and our server calls the rail. Daraja keys, bank API credentials
and signing keys are never placed in a mobile app, a USSD gateway
configuration or a browser, because anyone can unpack an app. On the
server they are held in OpenBao (§6, FS-403).

**Dibon's staff never move an institution's money.** No Dibon role may
initiate, approve or release a payment from an institution's account,
break-glass access included; the roles that can are the institution's
own, in its realm (access AC-09). Dibon engineers run the platform; they
are never in a payment's approval chain (FS-588).

**If we stop, the money does not** (FS-661). Because the money sits in
the institution's own paybills, tills and accounts, the rails work
without us: **we are the preferred channel, never the only one.** What
still works if the platform is down:

| Service | Without us | How | What waits |
|---|---|---|---|
| Collections: repayments, deposits, contributions | Works | The customer pays the institution's paybill or till from the M-Pesa menu, or deposits at its bank; Safaricom's own SMS confirms it to the payer | Posting, caught up from M-Pesa's records (rails RL-20) and bank statements |
| M-Pesa payment prompts | Stops | Customers pay the paybill directly; every message and page carries it (messaging T07; gateway GW-16) | — |
| Disbursements and payouts | Works, by hand | The institution's own staff, from its M-Pesa business portal or its bank's internet banking, under its own two-person control | Recording; queued payouts checked before release |
| Bank transfers, PesaLink, RTGS | Works, by hand | The institution's internet banking | As above |
| Cards (phase 3) | Partly | The acquirer's own terminal or hosted page, where the merchant keeps one | Matching |
| Gateway checkout | Mostly stops | The merchant's own paybill or till, given by default (GW-16) | Matching |
| Escrow | Held | Funds stay at the partner bank; a release by its documented manual procedure | Releases |
| Approvals | Stops | The institution's documented manual procedure | Approved again afterwards |
| The ledger, native mode | Balances unavailable | Money still arrives; counters follow the institution's offline procedure | Postings, on recovery |
| The ledger, integrated mode | Works | The institution's own core | Our postings |
| USSD, app, onboarding, receipts | Stop | Field officers capture offline (omni-channel OC-17) | Sent or verified on recovery |

**Three rules make it dependable** (platform-security SE-24): M-Pesa's
fallback for a paybill with validation is set to *complete*, so payments
go through while our check does not answer; queued payouts are checked
against the rail's statement before release, so nothing paid by hand
meanwhile is paid twice; and every manual act during an outage comes
back in, approved afterwards by the institution's approvers
(`manual.act`, approval-engine). Each institution's fallback runbook is
agreed at onboarding (OB-COM-23); Dibon never operates it (FS-588).

---

## 4 · Ledger modes

**Every module assumes at least these two models** (FS-065): the customer
has a core banking system, or it does not. Each module's §4 states how it
behaves under both. The same interface has two implementations, chosen by
configuration, so the mode is not a fork of the code.

| Mode | When | What we do |
|---|---|---|
| **Integrated** | The institution has a core banking system | **The core stays authoritative.** We read and post through its API. Any copy we keep is a cache with a fetched-at time. At Onit Bank, Collect posted to the bank's own core through its stored procedures (FS-390). Cores we have worked with: Craft Silicon's Bankers' Realm at Onit Bank, and Temenos T24 and Sopra Banking at KCB (FS-612) |
| **Native** | No digital ledger exists, or the institution is replacing its core — a lender moving off spreadsheets as it is licensed or registered with CBK, a small credit-only Sacco, a tier-3 bank upgrading | **Kapu Core is the funds ledger**: Apache Fineract, hosted and sold as a product (docs/modules/core.md, FS-311). One authority, so there is no core to reconcile against (MFI PRD §1) |

**Integrated comes first, always.** Integrating with a core is a read.
Replacing one means migrating somebody's history, and that is a separate
decision with a separate agreement. A deposit-taking Sacco in native mode
holds members' deposits in Fineract under SASRA's rules, which makes Dibon
a core-system vendor. That is the intent (FS-178), and its requirements
fall on us before the first such Sacco goes live (FS-179).

**A third mode is likely and is not assumed yet:** a core that holds
deposits but has no loan module, so loans go to Kapu Core and deposits
stay in the core. That splits the funds ledger across two systems, and
recon then has to tie them together (FS-066). Kapu Core already offers
this to lenders (docs/modules/core.md §2), so the design is owed before
the first such customer signs.

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

```
  PRODUCTS AND CHANNELS
  collect . gateway . escrow . core . mfi . sacco . sme-recon . business-suite . omni-channel
        |  requests (API, synchronous)               ^  every state change, a signed event
        v                                            |  (traceability)
  +------------------------------------------------------------------------------------------------+
  |                             EVENT BUS: Kafka, CloudEvents envelopes                            |
  +------------------------------------------------------------------------------------------------+
             |                        |                        |                        |
  +---------------------+  +---------------------+  +---------------------+  +---------------------+
  | MANDATES            |  | IDENTITY            |  | MESSAGING           |  | RAILS               |
  | approvals, quorum,  |  | KYC, NPDM, BRS,     |  | SMS, WhatsApp,      |  | M-Pesa, Airtel,     |
  | approval by email,  |  | SIM binding, tiers, |  | email, one-time     |  | T-Kash, banks;      |
  | debit mandates      |  | the document vault  |  | codes, quiet hours  |  | one instruction     |
  |                     |  |                     |  |                     |  | per payout          |
  +---------------------+  +---------------------+  +---------------------+  +---------------------+
             |                        |                        |                        |
  +---------------------+  +---------------------+  +---------------------+  +---------------------+
  | FINANCIAL CRIME     |  | RECON-OBSERVABILITY |  | DECISIONING         |  | CRB                 |
  | screening, the      |  | matching, traces,   |  | appraisal, scores,  |  | bureau lookups and  |
  | transaction rules,  |  | float, monitoring   |  | risk classes; rules |  | submissions         |
  | cases, reports      |  |                     |  | now, models later   |  |                     |
  +---------------------+  +---------------------+  +---------------------+  +---------------------+
             |                        |                        |                        |
  +------------------------------------------------------------------------------------------------+
  | access (Keycloak): every login, role and step-up                                               |
  | OpenBao: every key and secret; signing keys used inside it, never exported                     |
  | platform security: every layer, from the perimeter to the database                             |
  | insights: reads the three authorities and the bus; never writes                                |
  +------------------------------------------------------------------------------------------------+
```

Products ask shared services to act by API, and every state change is
published once on the bus as a signed event, so reconciliation, financial
crime and insights read the same facts without asking each product.

**Every component is replaceable behind a stable contract** (FS-584). A
service exposes a versioned contract and owns its own records; what sits
behind the contract (rules, a vendor, a learned model) can change without
its consumers changing. Every record says which version produced it.
Work that computes scales by adding instances; work that holds state has
one owner. Each institution's data stays in its own instance (FS-491).
A change is tried beside the one in force (in shadow, or on a share of
the traffic) before it takes over. Rails (one adapter interface, RL-01),
identity (vendors behind one check) and decisioning (rules now, models
later, DE-01) are the cases written so far; every module's §5 is read
against this paragraph.

- **Event bus:** Kafka between services.
- **Security baseline:** perimeter, cluster, data, backup, vulnerability
  management, the build pipeline, round-the-clock detection and endpoints
  (docs/modules/platform-security.md, SE-01 to SE-27, FS-464, FS-470).
- **Traceability:** every transaction carries one identifier end to end;
  each processing step is a signed event (CloudEvents, signed with the
  service's SPIFFE identity, keys in OpenBao), hash-chained and anchored in
  an append-only transparency log (Rekor v2, witnessed; FS-700), so its journey can
  be verified by anyone holding our public keys (recon RO-23 to RO-25,
  FS-453). OpenTelemetry and Tempo carry operational traces; they are not
  the evidence.
- **Financial crime and compliance:** one service for fraud scoring,
  sanctions and PEP screening, cases and the reports institutions file
  (docs/modules/financial-crime.md, FS-431). **We detect and prepare; the
  institution decides and files.** It is the reporting institution, and
  its reporting officer makes every decision.
- **Secrets:** OpenBao holds rail and bank credentials, signing keys and
  service secrets, per customer, in every deployment option. It is the
  Linux Foundation fork of HashiCorp Vault, under MPL-2.0, with the same
  API. Vault itself has been under the Business Source License since
  August 2023, which §6.1 does not allow without a decision (FS-403).
- **Observability:** Prometheus (metrics), Loki (logs), Tempo
  (traces), Grafana (dashboards, alerting, SLOs). Grafana is for
  operations. Business BI is insights, a separate module.
- **Mandates:** one engine for signing and debit mandates, every
  consumer's approvals in one place (docs/modules/mandates.md;
  docs/specs/approval-engine.md); never approval by reply (MD-18, FS-449).
- **Identity verification:** national register lookup (NPDM, formerly IPRS) on
  onboarding, or the mobile operator's check of the phone number against
  the registered name, as at Onit Bank (FS-392). The result is stored on
  the party in its authority, not copied into consumers. **The phone
  number is never the identity:** each account will be bound to the ID
  number, the phone number and the SIM's IMSI, and a SIM change, from a
  swap or a recycled number, will hold money movement until the customer
  is re-verified (identity ID-12 to ID-14, financial-crime FC-02, FS-448).
- **Insights reads the three authorities and never writes;** every answer
  shows its definition and query (docs/modules/insights.md; FS-446,
  FS-043).
- **Access:** Keycloak for sign-in, roles and step-up
  (docs/specs/access-keycloak.md).
- **Documents:** one document vault per institution (identity ID-15,
  FS-500). **Where a document lives** (FS-527):
  - **The vault:** every document that carries personal data. KYC and
    KYB evidence, collateral documents, loan and guarantee agreements and
    key information documents, signed consents and mandates, employee
    loan applications, and any contract with or about a person, staff
    employment contracts included.
  - **Odoo:** documents with no personal data beyond business contacts'
    names and roles: supplier and partner agreements, the institution's
    service contract with Dibon, non-disclosure agreements, policies.
  - **The contract record always stays in Odoo:** parties, dates,
    renewal, status and who signed, with a link to the file when the file
    is in the vault. A file never sits in both.
  - **SMEs on the business suite** have no vault: their documents stay in
    their own Odoo (business-suite BS-18), and what they share with a
    lender lands in the lender's vault.
  - **When in doubt, the vault.** A document type moves out only by
    decision.

### 6.1 · Licences

Decided 2026-10-01 (FS-223); MPL-2.0 added 2026-10-03 (FS-403):

| Licence | Allowed | Condition |
|---|---|---|
| Apache-2.0, MIT, BSD-2, BSD-3, ISC | Yes | — |
| AGPL-3.0 | Yes, **for services run unmodified and separately** | We do not change their source, and we do not link them into our code. A change to an AGPL service's source is a decision that triggers publishing that source to its network users, so it is never made in passing. **One exception, by decision:** OCA's `auth_oidc` module, installed unmodified inside Odoo for sign-in through Keycloak by the code flow, because Odoo's own sign-in module uses the implicit flow (FS-646) |
| MPL-2.0 | Yes, **used unmodified** | MPL's copyleft is per file: a change to one of its files is published with that file. We do not make such changes in passing |
| LGPL-2.1, LGPL-3.0 | Yes, **used unmodified as separate programs**: Odoo Community, Opengrep, Ceph (object storage on-premises, FS-500) | We do not change or statically link them; a change is a decision (FS-464) |
| GPL-2.0, GPL-3.0 in the operating system | Yes, **as part of the operating system**: the Linux kernel, disk encryption (LUKS), distribution packages | Run as shipped by the distribution (FS-464) |
| GPL-2.0 services run unmodified and separately | Yes, **two named services: ClamAV**, which scans uploads to the document vault (FS-525), **and Wazuh**, in our own security tier, where a client chooses it (FS-712) | Reached over its network socket, never linked or modified; a change to its source is a decision |
| GPL tools used only to build and test | Yes, **never shipped or linked**: MobSF | A tool in our pipeline, not part of what customers run (FS-464) |
| GPL, LGPL, SSPL, BSL, and anything unlisted | Not without a decision | Recorded in docs/decisions.md |

Today's AGPL services: Grafana, Loki and Tempo (observability). Today's
MPL service: OpenBao (secrets). **Databases are PostgreSQL**, Fineract's
included, not MySQL or MariaDB (GPL-2.0) (FS-464). Wazuh (GPL-2.0) is not
adopted: round-the-clock detection is bought as a managed service
(platform-security SE-13). **Commercial licences** (Odoo Enterprise,
required, §8, FS-644; Sophos; Microsoft Intune) are bought, not open source, and are named
in the module that uses them. Insights
uses Superset, which is Apache-2.0 (FS-230). **CNCF projects are Apache-2.0**, so they
are the default where they fit (FS-217).

---

## 7 · Controls that cross every module

- **Attribution at the act.** Anything that moves money, binds somebody,
  approves or reveals a person is authenticated when it happens. Logging
  in at the start of a session is not enough.
- **Nothing resolves an exception by inference.** A break stays open and
  visible until evidence closes it, and the audit keeps every step.
- **Documents and sensitive data travel only on our network or a trusted
  partner's** (FS-532): by a link to our own pages, the portal, an API or
  SFTP. WhatsApp, SMS, email and push carry notifications and links only,
  never a document, a statement, a balance or an ID number. **Once signed
  in, a customer may download their own documents and share them as they
  choose:** the rule binds what we send, not what a customer does with
  their own copy.
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

**Enterprise is required, not only assumed** (FS-644). The apps R1 and the
business suite use, by edition, from Odoo's editions page (read
2026-10-08):

| App | We use it for | Edition |
|---|---|---|
| Sign | Loan agreements, guarantees, consents (business-suite BS-02, mfi MF-34) | Enterprise only |
| Helpdesk | The service desk; incidents, problems, requests (BS-01, docs/service-management/README.md) | Enterprise only |
| Knowledge | Known errors and the desk's knowledge base | Enterprise only |
| Documents | SME company records (BS-18) | Enterprise only |
| Approvals | Workflows that move no money (BS-09) | Enterprise only |
| Accounting | Reconciliation into the ledger (BS-04); a core's daily totals (BS-08) | Enterprise only; Community has Invoicing |
| Payroll | Employers' payroll (BS-19) | Enterprise only |
| CRM, Project, Calendar, Employees, Website | Leads, user acceptance, change windows, HR records, public pages | Both |

Dibon's own Odoo and every institution's Odoo run Enterprise. Community
appears in two places only: an SME on the business suite that will not
pay for Enterprise gets Community without the Enterprise-only apps, or
Zoho; and the licence rule (§6.1) lists it as LGPL software used
unmodified.

---

## 9 · Hosting

Four deployment options: where it runs (the institution's premises, or
in-country cloud) by who runs it (the institution, or Dibon) (FS-359).
When Dibon runs it, the managed level is Hosted, Managed or Operated,
kept separate from the support tiers (FS-360). In-country cloud means
Liquid's Azure Stack for now (FS-032); Liquid is still a candidate
partner, not contracted (partners PT-01). **Anything
that would leave that boundary is named in the module that sends it, with
its data class.** Today the known candidate is insights' model (FS-043).
Whether Liquid's Stack offers a hosted model service or GPU capacity is a
question for Liquid (FS-048).

---

**Tenancy: an isolated instance per institution** (FS-491). Each
institution runs in its own instance: its own namespace and cluster
workloads, its own databases, its own keys in OpenBao and its own backups.
No institution's data is reachable from another's, and a compromise of one
does not reach the rest (the lesson of shared platforms, FS-469). The cost
is operating many instances, met by building every instance from the same
code and configuration (GitOps), upgrading the fleet together, and
watching all of them in one place (platform-security SE-23; recon RO-16).

**Who holds access, by who runs the instance** (FS-645). Each Dibon
engineer has one identity, in a central Dibon Keycloak with hardware keys
only, brokered into each instance's `ops` realm and never copied there
(docs/specs/access-keycloak.md §3); when an engineer leaves Dibon, one
switch removes them from every institution.

| | Dibon runs the instance | The institution runs it |
|---|---|---|
| Who operates | Dibon's on-call rota | The institution's own operators, in its `ops` realm or through its own identity provider |
| Dibon's standing access | Platform tooling only: monitoring, on-call, deployments through change enablement | None: the broker link is off |
| Access to data or production | Just in time, against a ticket | Just in time, against a ticket, approved by the institution's named approver through its own approval chain |
| How long, how much | Until the ticket closes, 4 hours by default; a named scope (read-only logs, one maintenance action) | The same, and only through the institution's own VPN or bastion |
| Switching Dibon off | The institution may disable Dibon's broker at any time, by contract | Off unless granted |

**Tracked on both sides:** the institution's Keycloak events and bastion
sessions; Dibon's access register of every grant (engineer, institution,
ticket, approver, scope, start, end, what was done); the two compared at
each monthly service review, and a grant on one side only is an
incident (platform-security SE-26). Engineers never see Restricted data:
it is encrypted field by field (SE-27), and support works on masked
views.

## 10 · Time and dates

One set of rules for every service, so that dates in the ledger, times in
the audit trail and matches in reconciliation agree (FS-634).

- **Three dates on every money record.** The *value date*: when it
  happened, from the source (an M-Pesa receipt's time, a bank's value
  date). The *business date*: the ledger day it belongs to, Africa/Nairobi,
  moved only by the end-of-day runner (docs/specs/end-of-day-runner.md).
  The *created time*: our clock, for audit.
- **Times are stored in UTC,** as ISO 8601 with the zone; business dates
  and anything shown to people are Africa/Nairobi, which has no daylight
  saving (UTC+3 all year). Fineract's tenant time zone is Africa/Nairobi.
- **A time from outside is kept as received,** beside our own receipt
  time: M-Pesa's local time carries no zone; bank statements carry a
  booking date and a value date, sometimes no time at all.
- **Every host keeps time by NTP** (chrony) against one primary source,
  Liquid's (to confirm), with a Kenyan public pool as fallback. Drift over
  500 ms is an alert, and blocks the night's close (end-of-day-runner C9):
  one-time codes (30-second windows), signed events and the order of the
  audit trail all depend on it.
- **Matching never relies on time alone.** Reconciliation matches on the
  reference first (the M-Pesa receipt, the bank's reference, our
  instruction id), then the amount, then the time within a window.
- **Cut-offs make timing items, not breaks.** A payment at 23:59:58 in
  M-Pesa's day may reach us at 00:00:03; a bank may book after its own end
  of day with the next value date; a core like Bankers' Realm holds
  deposits until its end of day (FS-630). Each is *in transit*, with the
  day it should clear, and becomes a break only if it does not clear in
  the next cycle (recon-observability RO-04). Each source's statement day,
  cut-off and end-of-day window is recorded at onboarding (OB-COM-21),
  and each item is chased through the source's status query or statement
  until it clears (recon-observability RO-07, FS-635).

**Where time matters most:**

| Component | What time does to it |
|---|---|
| Access (Keycloak) | One-time code windows, token expiry, how fresh a step-up must be |
| Approval engine | Time in each step, reminders, escalation; how old a step-up may be |
| Rails | How long an instruction stays valid; bank cut-offs (RTGS, EFT, PesaLink); reversal windows |
| Lender rules | Day counts: non-performing status, the arrears cap, 30-day notices, complaint clocks, on the business calendar (core KC-15) |
| Transaction rules (financial-crime FC-16) | Time windows, such as a lockout overnight |
| Messaging | The hours collection messages may be sent (reg 30) |
| Event bus, audit chain (recon RO-24) | Event times, order, how long a signature stays valid |
| Odoo | General-ledger summaries by business date; signing times as evidence |
| Decisioning, reports, returns | The "as at" date of statements and returns |
| Documents, complaints | Retention and complaint clocks |

## 11 · What this document does not decide

- Product status — each module's §3.
- Pricing and business models (FS-024).
- The legal questions it points at: FS-037, FS-049, FS-056, FS-057, FS-061,
  FS-428.
- How each service is built or run: the specs (docs/specs/README.md).

## 12 · Sources

- REVIEW.md decisions FS-025 to FS-033, FS-042 to FS-045.
- odoo-reconciliation.md (GateKeepr brief), §2 and §3. The principles
  carry over; the GateKeepr references do not (FS-014).
- Kapu Pay MFI PRD section, Draft v0.2, Jun 2026 — §1, §4, FR-6.
- KapuPay Discussion, meeting notes, 8 Jun 2026.
- Automated Channels Reconciliation proposal — the observability stack.
- The specs (docs/specs/), the journeys (docs/journeys/) and the decisions
  of October 2026, FS-584 to FS-649.
- ISO/IEC/IEEE 42010, arc42 and the C4 model, for the views beside this
  file (FS-649).
