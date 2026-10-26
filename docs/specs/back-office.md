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
used_by: [messaging, recon]
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-644, FS-965, FS-966, FS-967, FS-968, FS-969, FS-970, FS-971]
last_reviewed: 2026-10-26
---

# The back office behind one interface — build specification

How the ERP inside each institution's instance stays replaceable (FS-970).
Today that ERP is Odoo Enterprise (FS-644), and it stays so for now. Odoo
Community with OCA's modules (FS-967), ERPNext and Tryton (FS-969) are
candidates to evaluate. Our services reach whichever it is through one
**back-office gateway**, in our own words, with one adapter per ERP; so
porting an institution from Odoo, or supporting a second ERP, is a new
adapter that passes the same tests, not a rewrite of every service that
touches the back office. Nothing is built: every behaviour here is
**designed**.

## 1 · Purpose and scope

What it answers: how do our services use the back office without
depending on which ERP it is?

| Id | Capability | In R1 |
|---|---|---|
| BS-21 | The back office behind one interface: our services reach the ERP inside an institution's instance only through the back-office gateway, one adapter per ERP, with one contract test suite every adapter passes; Odoo Enterprise first | Yes: the interface, and the Odoo Enterprise adapter for the jobs R1 uses (tickets, signatures, consents, staff records) |
| BS-22 | Porting an institution's back office from one ERP to another: export, mapping, a rehearsal, cut-over by switching the adapter, counts reconciled and signed off | No: designed here (§9), built when a second adapter is |

**Out of R1:** adapters other than Odoo Enterprise's; documents and
leads through the gateway (in R1, staff use Odoo's own Documents and CRM
directly, and nothing of ours depends on them); ledger postings (BS-08,
phase 2).

**Where it sits.**

```
  +----------------------+
  | RECONCILIATION       |  tickets
  | matches              |-----------+
  | [kapu_service]       |           |
  +----------------------+           v
                              +----------------------+  one adapter  +----------------------+
                              | BACK-OFFICE GATEWAY  |  per ERP      | ODOO                 |
                              | translates           |-------------->| keeps the back office|
                              | [kapu_service]       |<--------------| [odoo]               |
                              +----------------------+  changes,     +----------------------+
  +----------------------+           ^          |       as events
  | MESSAGING            |           |          |  our events
  | sends                |-----------+          v
  | [kapu_service]       |  signatures,   +----------------------+
  +----------------------+  consents      | EVENT BUS            |
                                          | carries              |
                                          | [kafka]              |
                                          +----------------------+
```

**Related:** implements [business-suite](../modules/business-suite.md);
depends on [access-keycloak](access-keycloak.md) and
[event-bus-kafka](event-bus-kafka.md); used by
[messaging](messaging.md) and [recon](recon.md); journeys
[JN-04](../journeys/loan-to-disbursement.md),
[JN-05](../journeys/guarantor.md) and
[the complaint](../journeys/complaint.md).

## 2 · Concepts

- **The back office:** the ERP inside an institution's instance. It holds
  parties no core holds, obligations, tickets, documents and signatures
  (architecture §2); never balances, loans or rail events.
- **A job:** one thing we ask of the back office, named in our words:
  *parties and consent*, *tickets*, *signatures*, *documents*, *staff
  records*; later *leads* and *ledger postings*. The contract is jobs,
  never an ERP's models.
- **The gateway:** our service that offers the jobs to our other
  services, and calls the ERP through an adapter.
- **An adapter:** the code that does each job on one ERP. An adapter
  declares which jobs it supports; a job its ERP cannot do goes to
  another product's adapter (a **composite** back office: Tryton's
  parties with a separate helpdesk, for example).
- **Our reference:** the id we give every record we create in the back
  office (`ref`). Our services keep our reference, never the ERP's own
  id; the gateway keeps the map between them.
- **An edition:** one ERP, or one combination of products, configured for
  an institution, with its adapters.
- **A port:** moving an institution's back office from one edition to
  another (§9).

## 3 · Rules

1. **No business rule lives in the ERP** (FS-970). What decides money,
   loans, approvals, conduct or eligibility lives in our services: the
   approval engine, Kapu MFI, lender rules, recon. The ERP is configured,
   not programmed; what moves to a new ERP is configuration and data.
2. **One way in.** Our services call the gateway, never an ERP's API; the
   network allows only the gateway to reach the ERP's API (A1).
3. **Our references are the keys.** Every record we create carries our
   reference; the ERP's id never leaves the gateway.
4. **The contract is ours.** Requests and events name jobs and our
   fields; an ERP's model names, states and quirks stay inside its
   adapter.
5. **Changes come back as our events.** What happens in the ERP that our
   services need (a ticket closed, a signature completed, a consent
   withdrawn, a person leaving) is published by the gateway as an event
   in the bus's catalogue, however the adapter learns of it (a webhook, or
   polling where the ERP has none).
6. **What we build inside an ERP is thin.** Screens we add, such as the
   staff workspace over Kapu MFI (FS-965), only show our APIs and send
   commands to them; they hold no rule. Our Odoo modules depend on Odoo
   Community's base only, so they run on either edition.
7. **Signed documents live in the vault too.** A completed signature's
   document and its evidence are filed in the document vault (ID-15) as
   well as the ERP, so a port never risks the signed record (messaging
   §3).
8. **Everything is exportable.** Every record the back office holds for
   an institution exports in open formats (CSV or JSON, and the files),
   with our references, and the export is tested each quarter (A6).
9. **Sign-in through access.** Staff sign in to any back office through
   Keycloak (AC-02); an ERP that cannot is not a candidate.
10. **Inside the instance.** The back office runs in the institution's
    own instance, in Kenya; an ERP offered only as someone else's cloud
    service cannot be the back office (it can still be a business's own
    books, through sme-recon's wrappers).
11. **One contract test suite.** Every adapter passes the same suite
    (§11); a new ERP is supported when its adapter passes, and not before.
12. **Nothing on the money path waits for it.** Payments, postings and
    approvals never call the back office in their path; the gateway
    queues what it cannot deliver and delivers it in order when the ERP
    is back (architecture §2, availability).

**Each job, by edition** (to confirm for every edition but the first):

| Job | Odoo Enterprise, today | Odoo Community with OCA (FS-967) | ERPNext | Tryton |
|---|---|---|---|---|
| Parties and consent | Contacts | Contacts | Customer and Contact | Party |
| Tickets | Helpdesk | OCA's helpdesk module | Its Helpdesk app | None of its own: a separate desk |
| Signatures | Sign | OCA's signing module | None of its own: a separate signing tool | None of its own: a separate signing tool |
| Documents | Documents | OCA's document management | Its file manager | Attachments |
| Staff records | Employees | Employees | Frappe HR | Its employee module |
| Sign-in through Keycloak | OCA's auth_oidc (FS-646) | The same | Its OpenID Connect login | To confirm |
| Status | In use | Candidate | Candidate | Candidate |

**Choosing a candidate** (FS-966): hosting inside the instance; KRA
eTIMS; its API and export; sign-in through Keycloak; its licence against
architecture §6.1; total cost, not only the licence; a paying customer's
demand; our skills and partner standing; the legal sufficiency of its
signatures (FS-049). Its adapter then passes §8.

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
| Any | `GET /capabilities`: the jobs this instance's edition supports |

A call for a job the edition does not support is refused with a stated
reason, never half done.

**Events** (catalogue: event-bus-kafka §5): `kapu.backoffice.ticket.opened`,
`.ticket.updated`, `.ticket.closed`, `.signature.completed`,
`.signature.declined`, `.signature.expired`, `.consent.changed`,
`.staff.joined`, `.staff.changed`, `.staff.left`.

**The adapter's side:** the same jobs as functions, one implementation
per ERP, each declaring its jobs; the gateway chooses the adapter for a
job from the instance's edition, set in its configuration.

## 5 · Security and audit

- Callers sign in as service accounts in the `staff` realm (access §5);
  each service may call only its jobs (messaging: signatures and
  consents; recon: tickets).
- The gateway reaches each ERP with one service account per institution,
  holding only the rights its jobs need; its secret is in OpenBao.
- Every call is logged with the caller, the job, our reference and the
  outcome; never a document's content, a consent's text or a person's
  details.
- An ERP's administrators are Dibon's engineers through the `ops` realm
  and the bastion (SE-26); no one administers it from a product.

## 6 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| The reference map: our reference, the ERP's id, the edition | Confidential | As long as the record in the ERP, then a year | Identifiers only |
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
- **Metrics and alerts:** calls by job and outcome, queue depth and age,
  events published; an alert when the queue is older than fifteen
  minutes, or an adapter fails its nightly contract smoke test
  (observability-grafana §4).

## 8 · Threats

| Threat | For example | The answer |
|---|---|---|
| Spoofing | A service, or a person, calls the ERP directly | Only the gateway reaches the ERP's API (rule 2); service accounts per caller |
| Tampering | A record edited in the ERP breaks what a service relies on | Changes return as events (rule 5); a nightly check of the reference map against the ERP |
| Repudiation | A signature disputed | The signed document and its evidence in the vault (rule 7) |
| Information disclosure | A breach of the ERP | It holds no balances or rail events (architecture §2); the gateway logs no content |
| Denial of service | The ERP down for an upgrade | The queue; nothing on the money path waits (rule 12) |
| Elevation of privilege | An ERP administrator acting on an institution's money | The ERP moves no money; administrators come through `ops`, which no product accepts |
| Linkability (LINDDUN) | Our references joined across systems to profile a person | References are opaque and per institution; no reference crosses instances |

## 9 · Porting an institution's back office

1. **The target edition passes §11's suite** in a test instance.
2. **Map** each job's records from the old ERP to the new, by our
   references.
3. **Rehearse:** export from a copy of the live back office, import into
   the target, run the suite and reconcile counts by job.
4. **Cut over** in a change window: freeze the old ERP's writes, export,
   import, switch the instance's edition, run the suite on live.
5. **Sign off** with counts by job reconciled and the institution's
   approval, as a migration is (mfi MF-16); the old ERP kept read-only
   for its retention period.

Signed documents need no migration of their own: they are already in the
vault (rule 7).

## 10 · Upgrading the ERP

FS-971. An upgrade is a port between two versions of the same ERP, so it
follows §9, with these rules besides:

1. **Each major version is an edition,** with its own adapter version;
   the old and the new run side by side until cut-over, and the switch
   is the instance's edition setting.
2. **On a copy first.** Production is copied to staging, the copy is
   upgraded, then §11's contract tests, our modules' tests and a staff
   check run on it; promotion waits for all three, and a failure keeps
   production as it was (OLP's procedure, its review §2.1; olp N3).
3. **The right migration for the edition.** Odoo Enterprise through
   Odoo's own upgrade service, which carries Sign, Helpdesk and
   Documents; Odoo Community through OCA's OpenUpgrade; any other ERP by
   its own route, named in its edition.
4. **Ready before we move.** Our modules ported, and every OCA module we
   depend on (auth_oidc first, FS-646) released for the target version.
5. **Configuration as code.** Each institution's set-up is data files in
   our module, in git, re-applied and checked after the upgrade, never
   clicks remembered by one person.
6. **Once a year,** within the versions the ERP's maker supports, one
   major version at a time unless the maker's own service skips safely;
   in a change window, through change enablement.
7. **Watch the footprint.** We count our customisations and record how
   long each upgrade took, so a back office growing harder to upgrade is
   seen before it is a problem.

## 11 · Acceptance tests

| # | Given | When | Then | Id, source |
|---|---|---|---|---|
| A1 | Any service but the gateway | It calls the ERP's API | The network refuses it | BS-21, rule 2 |
| A2 | The Odoo Enterprise adapter | The contract suite runs | Every job it declares passes | BS-21, rule 11 |
| A3 | The ERP down | Recon raises a ticket | It is queued, then delivered once, in order, when the ERP returns; the payment path is untouched | BS-21, rule 12 |
| A4 | A signature completed in the ERP | The adapter learns of it | `kapu.backoffice.signature.completed` is published once, with our reference; the document is in the vault | BS-21, rules 5, 7 |
| A5 | An edition without a desk of its own | Recon raises a ticket | The ticket goes to the desk's adapter, or is refused with a reason; never lost | BS-21, §2 |
| A6 | An institution's back office | The quarterly export runs | Every record exports with our references, and the counts match the ERP | BS-21, rule 8 |
| A7 | Our Odoo module | It is installed on Odoo Community | It installs and its screens work | BS-21, rule 6 |
| A8 | A consent withdrawn in the ERP | The adapter learns of it | `kapu.backoffice.consent.changed` is published, and messaging stops that channel within five minutes | BS-21, MS-11 |
| A9 | A second edition's adapter | A port is rehearsed (§9) | Counts reconcile by job and the suite passes on the target | BS-22 |
| A10 | An Enterprise instance and the next Odoo version | The upgrade is rehearsed on a staging copy (§10) | Sign, Helpdesk and Documents work after it, the contract suite passes, counts reconcile, and production is untouched until promotion | BS-21, FS-971 |

## 12 · Open questions

**For the owner:**

1. Which candidate to evaluate first, Odoo Community, ERPNext or Tryton,
   and when (FS-970)?
2. Whether the staff workspace (FS-965) waits for the gateway, or is
   built beside it from the start.
3. Whether documents and leads join the gateway in R2, or stay in the
   ERP's own screens.

**For Roan Capital:** whether licence cost would lead it to a lower-cost
edition (FS-967), put on 29 October.
