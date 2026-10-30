---
id: back-office
name: The back office behind one interface — build specification
kind: spec
type: build
status: draft
released: unreleased
release: R1
implements: [business-suite]
depends_on: [access-keycloak, event-bus-kafka]
used_by: [messaging, recon, lending-service, lending-partners]
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-644, FS-965, FS-966, FS-967, FS-968, FS-969, FS-970, FS-971, FS-983, FS-1052, FS-1058]
last_reviewed: 2026-10-30
---

# The back office behind one interface — build specification

How the ERP inside each institution's instance stays replaceable (FS-970).
Our services reach it only through the **back-office gateway**, which
offers *jobs* in our words and does each through an adapter for the
product behind it. A new ERP, or a new version of one, is then a new
adapter that passes the same tests, not a change to every service that
touches the back office. Odoo Enterprise is the back office today
(FS-644); Odoo Community with OCA's modules (FS-967), ERPNext and Tryton
(FS-969) are candidates. Nothing is built: every behaviour here is
**designed**.

## 1 · Purpose and scope

How do our services use the back office without depending on which ERP,
or which version of it, is behind it?

| Id | Capability | In R1 |
|---|---|---|
| BS-21 | The back office behind one interface: our services reach the ERP inside an institution's instance only through the back-office gateway, one adapter per ERP, with one contract test suite every adapter passes; Odoo Enterprise first | Yes: the interface, and the Odoo Enterprise adapter for the jobs R1 uses (tickets, signatures, consents, staff records) |
| BS-22 | Changing an institution's back office to another ERP: rehearsed, cut over by switching the edition, counts reconciled and signed off | No: designed here (§9.4), built when a second adapter is |

**Out of R1:** adapters other than Odoo Enterprise's; documents and
leads through the gateway (in R1, staff use Odoo's own Documents and CRM
directly, and nothing of ours depends on them); ledger postings (BS-08,
phase 2).

**Where it sits.**

```
  +--------------------+    +--------------------+    +--------------------+
  | RECONCILIATION     |    | LENDING SERVICE    |    | MESSAGING          |
  | matches            |    | lends              |    | sends              |
  | [kapu_service]     |    | [kapu_service]     |    | [kapu_service]     |
  +--------------------+    +--------------------+    +--------------------+
            | tickets                 | signatures              | signatures, consents
            v                         v                         v
  +------------------------------------------------------------------------+
  | BACK-OFFICE GATEWAY                                                    | our events
  | translates jobs; each job's adapter set by the edition setting (§9.1)  |-----------+
  | [kapu_service]                                                         |           |
  +------------------------------------------------------------------------+           |
            | parties, tickets,       : the contract            | signatures           |
            | documents, staff        : suite only              |                      |
            v                         v                         v                      |
  +--------------------+    +--------------------+    +--------------------+           v
  | ODOO               |copy| ODOO               |    | OTHER BACK OFFICE  |  +--------------------+
  | version 18: live   |--->| version 19: target |    | a signing tool     |  | EVENT BUS          |
  | [odoo]             |    | [odoo]             |    | [erp]              |  | carries            |
  +--------------------+    +--------------------+    +--------------------+  | [kafka]            |
                                                                              +--------------------+
```

**Reading it.** A solid arrow is *live*: each job has one, which takes
our calls and whose changes the gateway publishes as our events (rule 4).
The dotted arrow is a *target* being prepared beside it: only the
contract suite reaches it, and it publishes nothing. The instance drawn
shows every way a second edition runs: a signing tool doing one job
beside Odoo (§9.3), and Odoo 19 prepared from a copy of 18 (§9.4; for a
port, the target is OTHER BACK OFFICE). Every other instance runs the
same gateway with its own edition (§9.2). Today's instances have Odoo
Enterprise alone: one live arrow, for every job.

**Related:** implements [business-suite](../modules/business-suite.md);
depends on [access-keycloak](access-keycloak.md) and
[event-bus-kafka](event-bus-kafka.md); used by
[lending-service](lending-service.md), [messaging](messaging.md) and [recon](recon.md); journeys
[JN-04](../journeys/loan-to-disbursement.md),
[JN-05](../journeys/guarantor.md) and
[the complaint](../journeys/complaint.md); partners keep their company record here ([lending-partners](lending-partners.md)).

## 2 · Concepts

- **The back office:** the ERP inside an institution's instance: parties
  no core holds, obligations, tickets, documents and signatures
  (architecture §2); never balances, loans or rail events.
- **A job:** one thing we ask of it, in our words: *parties and
  consent*, *tickets*, *signatures*, *documents*, *staff records*; later
  *leads* and *ledger postings*.
- **An adapter:** our code that does jobs on one product at one major
  version, declaring which jobs it does.
- **An edition:** what an instance's back office is: one product at one
  version, or a **composite** of products, each doing some of the jobs.
- **Live and target:** the edition taking calls now; and one being
  prepared beside it, to replace it.
- **Our reference:** the id we give every record we create in the back
  office (`ref`); the gateway maps it to each product's own id.
- **A port, an upgrade:** changing the live edition to another product,
  or to another version of the same one (§9.4).

## 3 · Rules

1. **No business rule lives in the ERP** (FS-970). What decides money,
   loans, approvals, conduct or eligibility lives in our services (the
   approval engine, Kapu MFI, lender rules, recon); the ERP is
   configured, not programmed, so what moves to a new one is
   configuration and data. Screens we add inside it, such as the staff
   workspace (FS-965), only show our APIs and send commands to them; our
   Odoo modules depend on Odoo Community's base only, so they run on
   either Odoo edition.
2. **One way in, in our words.** Our services call the gateway, never a
   product's API, and the network lets only the gateway reach it (A1).
   Requests and events name jobs, our fields and our references; a
   product's ids, models and quirks stay inside its adapter.
3. **Changes come back as our events.** What happens in the ERP that our
   services need (a ticket closed, a signature completed, a consent
   withdrawn, a person leaving) the gateway publishes in the bus's
   catalogue, however the adapter learns of it: a webhook, or polling
   where the product has none.
4. **One live edition per job.** At any moment each job has one product
   that takes our calls and whose changes become our events; a target
   being prepared, or an old edition kept for look-ups, takes neither.
   So no record is written in two products, and no event is published
   twice.
5. **Nothing on the money path waits for it.** Payments, postings and
   approvals never call the back office in their path; the gateway
   queues what it cannot deliver and delivers it in order when the ERP
   is back (architecture §2, availability).
6. **Nothing is lost by leaving.** A signed document and its evidence
   are filed in the vault (ID-15) as well as the ERP (messaging §3); and
   every record exports in open formats (CSV or JSON, and the files),
   with our references, tested each quarter (A6).
7. **One contract test suite.** Every adapter passes the same suite
   (§10); a product or version is supported when its adapter passes, and
   not before.

**Each job, by product** (to confirm for every one but the first):

| Job | Odoo Enterprise, today | Odoo Community with OCA (FS-967) | ERPNext | Tryton |
|---|---|---|---|---|
| Parties and consent | Contacts | Contacts | Customer and Contact | Party |
| Tickets | Helpdesk | OCA's helpdesk module | Its Helpdesk app | None of its own: a separate desk |
| Signatures | Sign | OCA's signing module | None of its own: a separate signing tool | None of its own: a separate signing tool |
| Documents | Documents | OCA's document management | Its file manager | Attachments |
| Staff records | Employees | Employees | Frappe HR | Its employee module |
| Sign-in through Keycloak | OCA's auth_oidc (FS-646) | The same | Its OpenID Connect login | To confirm |
| Status | In use | Candidate | Candidate | Candidate |

**Choosing a candidate** (FS-966). It must run inside the institution's
instance, in Kenya (an ERP offered only as someone else's cloud service
can still be a business's own books, through sme-recon's wrappers); sign
staff in through Keycloak (AC-02); and offer an API and a full export.
Then weighed: KRA eTIMS; its licence against architecture §6.1; total
cost, not only the licence; a paying customer's demand; our skills and
partner standing; the legal sufficiency of its signatures (FS-049).

## 4 · Interfaces

**REST** (internal to the instance; called by our services with their
service accounts):

| Job | Calls |
|---|---|
| Parties and consent | `POST /parties`, `GET /parties/{ref}`, `PUT /parties/{ref}/consents` |
| Tickets | `POST /tickets`, `PATCH /tickets/{ref}`, `GET /tickets/{ref}` |
| Signatures | `POST /signature-requests` (template, signers, document), `GET /signature-requests/{ref}`, `POST /signature-requests/{ref}/cancel` |
| Documents | `POST /documents`, `GET /documents/{ref}` |
| Staff records | `GET /staff/{ref}`, `GET /staff?changed_since=` |
| Any | `GET /capabilities`: the jobs this instance's edition does |

A call for a job the edition does not do is refused with a stated
reason, never half done.

**Events** (catalogue: event-bus-kafka §5): `kapu.backoffice.ticket.opened`,
`.ticket.updated`, `.ticket.closed`, `.signature.completed`,
`.signature.declined`, `.signature.expired`, `.consent.changed`,
`.staff.joined`, `.staff.changed`, `.staff.left`.

**The adapters:** the same jobs as functions, one implementation per
product and major version; the edition setting (§9.1) chooses which runs.

## 5 · Security and audit

- Callers sign in as service accounts in the `staff` realm (access §5);
  each service may call only its jobs (messaging: signatures and
  consents; recon: tickets).
- The gateway reaches each product with its own service account per
  institution, holding only the rights its jobs need; its secret is in
  OpenBao. Staff sign in to each product through its own Keycloak client.
- Every call is logged with the caller, the job, our reference and the
  outcome; never a document's content, a consent's text or a person's
  details.
- A product's administrators are Dibon's engineers through the `ops`
  realm and the bastion (SE-26); no one administers it from a product.

## 6 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| The reference map: our reference, the product's id, the edition; a row for each edition while two run (§9.4) | Confidential | As long as the record in the ERP, then a year | Identifiers only |
| The outbox and the delivery queue | Confidential | Until delivered, then 30 days | What the call carries, briefly |
| The call log | Internal | 13 months, with observability's logs | References only |

The gateway keeps no copy of what the ERP holds: the ERP is the
authority for its records, the gateway only the way to them.

## 7 · Quality and metrics

- **Tier:** the back office's own (architecture quality: business
  hours, staff-facing); the gateway is never on the money path.
- **Targets:** a call answered within a second at the 95th percentile
  when the ERP is up; a queued call delivered within five minutes of the
  ERP's return; an ERP change published as an event within five minutes.
- **Metrics and alerts:** calls by job, edition and outcome, queue depth
  and age, events published; an alert when the queue is older than
  fifteen minutes, or an edition in use fails the nightly contract suite
  (observability-grafana §4).

## 8 · Threats

| Threat | For example | The answer |
|---|---|---|
| Spoofing | A service, or a person, calls the ERP directly | Only the gateway reaches a product's API (rule 2); service accounts per caller |
| Tampering | A record edited in the ERP breaks what a service relies on; or, during a port, written in both the old and the new | Changes return as events (rule 3); a nightly check of the reference map against the ERP; one live edition per job, the old frozen before the import (rule 4, §9.4) |
| Repudiation | A signature disputed | The signed document and its evidence in the vault (rule 6) |
| Information disclosure | A breach of the ERP | It holds no balances or rail events (architecture §2); the gateway logs no content |
| Denial of service | The ERP down for an upgrade | The queue; nothing on the money path waits (rule 5) |
| Elevation of privilege | An ERP administrator acting on an institution's money | The ERP moves no money; administrators come through `ops`, which no product accepts |
| Linkability (LINDDUN) | Our references joined across systems to profile a person | References are opaque and per institution; no reference crosses instances |

## 9 · Editions: one live, others beside it

FS-971, FS-1052. The diagram in §1 shows the three ways a second edition
runs; this section says how each works.

### 9.1 The edition setting

One setting per instance (settings README: per deployment), changed only
through change enablement. The example is the instance drawn in §1:

| Part | What it says | In the diagram |
|---|---|---|
| Edition | What is live: product and major version, or a composite named by its parts | Odoo 18 with a signing tool |
| Jobs | Each job's product and adapter version; a job not listed is refused with a reason (§4) | Signatures: the signing tool; every other job: Odoo 18 |
| Target | Only during a port or an upgrade: what is being prepared | Odoo 19 |

`GET /capabilities` answers from it, and the reference map records each
record's edition, so our services never change for a port or an upgrade:
the same jobs, the same references.

### 9.2 Across institutions

1. **One gateway release carries every adapter version in use;** no
   institution has a gateway of its own. An adapter leaves in the release
   after the last instance moves off it, or its maker stops supporting
   that version.
2. **The suite runs nightly against every edition in use;** a release
   ships only when all of them pass.
3. **Our Odoo modules keep a branch per version,** as OCA does (`18.0`,
   `19.0`); a fix goes to every branch in use.
4. **Each deployment names its edition,** on its page and in its
   settings file. The first second edition is close: Roan Capital on
   Odoo Community (FS-967) while the MVP sandbox stays on Enterprise.

### 9.3 Two products in one instance

For a job one product cannot do well enough: in the diagram, signatures,
if OCA's signing module fell short of what a signature must be (FS-049).

1. **The person has one home:** the product doing *parties and consent*.
   Another product gets only what its job needs (the signer, the
   complainant), created by the gateway under the same reference; a
   consent changed at home reaches it through the gateway.
2. **The products never call each other,** so either can be replaced
   alone.

### 9.4 Changing edition: a port or an upgrade

An upgrade is a port between two versions of the same product. Both take
the same phases, inside the institution's instance:

| Phase | What happens | Our calls and events | Staff |
|---|---|---|---|
| Ready | The target's adapter passes the suite in a test instance; for an upgrade, our modules ported, and every OCA module we depend on released for the new version (auth_oidc first, FS-646) | To and from the old | In the old |
| Rehearsal, weeks | The target built from a copy of the old on staging (OLP's procedure; olp N3): mapped by our references for a port, upgraded for an upgrade; then the suite, our modules' tests, counts by job and a staff check, until all pass | To and from the old | In the old; named staff check the target |
| The window opens | Through change enablement: the old frozen, the target built again from it | Queued (rule 5); none published | Look-ups only |
| The switch | The edition setting names the target live; the suite runs on it | Still queued | None yet |
| Confirm, or fall back | Confirmed with counts by job reconciled and the institution's approval, as a migration is (mfi MF-16); otherwise switched back and the old unfrozen | Delivered in order to whichever is live | Let in once confirmed; after that, faults are fixed forward |
| After | The new live; the old read-only until retired | To and from the new | In the new |

1. **Never in place.** The target is a new database beside the old, so
   the old is there to fall back to until staff have worked in the new.
   Each product upgrades by its own route: Odoo Enterprise through Odoo's
   upgrade service, which carries Sign, Helpdesk and Documents; Odoo
   Community through OCA's OpenUpgrade; any other by the route its
   edition names.
2. **Apart, in the same place:** the target's own database and files, in
   the back-office cluster (architecture instance), at the same Kenyan
   site, reached only by the gateway (rule 2); two to size and pay for,
   for the weeks of the rehearsal.
3. **The reference map holds both editions,** our reference the same in
   each; the switch changes which is live, never a reference our services
   hold.
4. **Configuration as code.** Each institution's set-up is data files in
   our module, in git, re-applied and checked on the target, never clicks
   remembered by one person.
5. **Upgrades once a year,** within the versions the maker supports, one
   major version at a time unless the maker's own service skips safely.
6. **The old, after:** read-only for look-ups through its own screens for
   its retention period. Where that needs a licence that has ended (an
   Enterprise subscription, LQ-31), it is retired to its export and an
   archive of its database instead. Signed documents need no migration:
   they are already in the vault (rule 6).
7. **Watch the footprint.** We count our customisations and record how
   long each upgrade took, so a back office growing harder to upgrade is
   seen before it is a problem.

## 10 · Acceptance tests

| # | Given | When | Then | Id, source |
|---|---|---|---|---|
| A1 | Any service but the gateway | It calls a product's API | The network refuses it | BS-21, rule 2 |
| A2 | The Odoo Enterprise adapter | The contract suite runs | Every job it declares passes | BS-21, rule 7 |
| A3 | The ERP down | Recon raises a ticket | It is queued, then delivered once, in order, when the ERP returns; the payment path is untouched | BS-21, rule 5 |
| A4 | A signature completed in the ERP | The adapter learns of it | `kapu.backoffice.signature.completed` is published once, with our reference; the document is in the vault | BS-21, rules 3, 6 |
| A5 | An edition without a desk of its own | Recon raises a ticket | The ticket goes to the desk's adapter, or is refused with a reason; never lost | BS-21, §9.3 |
| A6 | An institution's back office | The quarterly export runs | Every record exports with our references, and the counts match the ERP | BS-21, rule 6 |
| A7 | Our Odoo module | It is installed on Odoo Community | It installs and its screens work | BS-21, rule 1 |
| A8 | A consent withdrawn in the ERP | The adapter learns of it | `kapu.backoffice.consent.changed` is published, and messaging stops that channel within five minutes | BS-21, MS-11 |
| A9 | A second product's adapter | A port is rehearsed (§9.4) | Counts reconcile by job and the suite passes on the target | BS-22 |
| A10 | An Enterprise instance and the next Odoo version | The upgrade is rehearsed on a staging copy (§9.4) | Sign, Helpdesk and Documents work after it, the contract suite passes, counts reconcile, and production is untouched until promotion | BS-21, FS-971 |
| A11 | Two instances on different editions | One gateway release is deployed to both | Each runs its own edition's adapter and passes the contract suite; neither needs a build of its own | BS-21, §9.2 |
| A12 | An edition in use failing the nightly suite | A gateway release is proposed | The release waits until every edition in use passes | BS-21, §9.2 |
| A13 | A composite edition: signatures in a separate tool | A borrower is asked to sign, then withdraws a consent | The signer is created in the tool under the same reference; the consent changes at home, reaches the tool through the gateway, and is published once | BS-21, §9.3 |
| A14 | A target being prepared beside the live edition | Our services call the gateway, and the target is imported | Every call goes to the live edition; nothing is published from the target; no event is published twice | BS-21, BS-22, rule 4 |
| A15 | The switch made, staff not yet let in | The suite fails on the new edition | The setting is switched back, the old unfrozen, and the queued calls delivered to it in order; nothing lost | BS-21, BS-22, §9.4 |

## 11 · Open questions

**For the owner:**

1. Which candidate to evaluate first, Odoo Community, ERPNext or Tryton,
   and when (FS-970)?
2. Whether the staff workspace (FS-965) waits for the gateway, or is
   built beside it from the start.
3. Whether documents and leads join the gateway in R2, or stay in the
   ERP's own screens.
4. After a port, whether the old edition is kept running read-only for
   its retention period, or retired to its export at sign-off: look-ups
   in its own screens, against the cost of running it, and its licence
   (§9.4, LQ-31).

**For counsel:** LQ-31, whether Odoo's Enterprise subscription covers a
target and a staging copy beside production, and an old Enterprise
database kept read-only once the subscription ends.

**For Roan Capital:** whether licence cost would lead it to a lower-cost
edition (FS-967), put on 29 October.
