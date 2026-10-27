---
id: staff-workspace
name: The staff workspace in Odoo, over the lending service — build specification
kind: spec
type: build
status: draft
released: unreleased
release: R1
implements: [business-suite]
depends_on: [access-keycloak, approval-engine, lending-service]
used_by: []
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-136, FS-964, FS-965, FS-970, FS-978, FS-979, FS-982, FS-983, FS-987, FS-996]
last_reviewed: 2026-10-27
---

# The staff workspace in Odoo, over the lending service — build specification

Roan Capital's staff found the Mifos web app hard to use (FS-965). In R1
they do their daily lending in screens of our own inside Odoo, the back
office they already sign in to for leads, the desk and signing. **Odoo is
only the interface:** Fineract stays the core, the lending service
(lending-service; Kapu MFI is its configuration for lenders) stays its
only writer, and the approval engine stays where decisions are made.
Roan Capital's product owner also manages its products here (FS-978). Nothing
is built: every behaviour here is **designed**, and the screens are
confirmed with Roan Capital's staff before they are drawn (open answer
33; FS-237).

## 1 · Purpose and scope

What it answers: where do an institution's staff do their daily lending,
in their words, without a second core?

| Id | Capability | In R1 |
|---|---|---|
| BS-23 | The staff workspace: an institution's staff do their daily lending, and manage their products, in screens of ours inside Odoo, over the lending service's API; reads live and never stored, every write a command to Kapu MFI, every decision in the approval engine | Yes |

**Out of R1:** reports beyond the arrears list (insights); product set-up,
which is Dibon's through the product version documents (lender-rules
§2.4); deposits and savings (Sacco, R4).

**Where it sits.**

```
  +----------------------+ reads,     +----------------------+ the only   +----------------------+
  | STAFF WORKSPACE      | commands   | LENDING SERVICE      | writer     | KAPU CORE            |
  | shows, asks          |----------->| lends                |----------->| records              |
  | [odoo]               |            | [kapu_service]       |            | [apache_fineract]    |
  +----------------------+            +----------------------+            +----------------------+
       |           |  decisions, with step-up
       |           v
       |    +----------------------+
       |    | APPROVAL ENGINE      |
       |    | decides              |
       |    | [kapu_service]       |
       |    +----------------------+
       |  sign-in, the user's token
       v
  +----------------------+
  | ACCESS               |
  | signs in, steps up   |
  | [keycloak]           |
  +----------------------+
```

**Related:** implements [business-suite](../modules/business-suite.md);
depends on [access-keycloak](access-keycloak.md),
[approval-engine](approval-engine.md) and
[lending-service](lending-service.md); used by none yet; the back office
it lives in is behind [back-office](back-office.md); journeys
[JN-04](../journeys/loan-to-disbursement.md) and
[JN-05](../journeys/guarantor.md).

## 2 · Concepts

- **The workspace:** our Odoo module, its menus and screens; it holds no
  rule and no copy of the core's records.
- **A live read:** a figure fetched from Kapu MFI when the screen opens,
  shown with when it was fetched (OC-11).
- **A command:** a request to Kapu MFI to do something (create a client,
  submit an application, record a payment received), made as the signed-
  in person, which Kapu MFI accepts, refuses with a reason, or sends to
  the approval engine.
- **A task:** something waiting for a person: an approval, a document to
  check, a payout to confirm, a borrower in arrears to call.

## 3 · Rules

1. **Reads are live, never stored** (FS-965). The workspace keeps only
   Kapu MFI's references to a client, a loan or a task; balances,
   schedules and loans are fetched each time (architecture §2: Odoo
   never holds balances).
2. **Every write is a command to Kapu MFI,** which stays Fineract's only
   writer (kapu-core-fineract §8; FS-626). The workspace never calls
   Fineract.
3. **Every decision is the approval engine's.** Approve, decline and
   return open the engine's step for that request; the person steps up
   at each decision (`loa3`, approval-engine; access §5). The workspace
   never approves on its own.
4. **As the person, not as a service.** The workspace calls Kapu MFI and
   the engine with the signed-in person's token (token exchange in
   Keycloak), so every act is recorded against the person who did it.
5. **One copy of a borrower.** A lead lives in Odoo's CRM (BS-01) until a
   credit officer converts it; from then the client is Kapu MFI's, and
   the workspace shows it, linking the lead, never duplicating it.
6. **Roles decide what shows.** Each screen and action follows the
   person's roles from Keycloak (Roan Capital's eight positions, FS-942);
   an action a role may not take is not offered.
7. **Thin and portable.** The module depends on Odoo Community's base
   only, and holds no rule (back-office rule 6), so it runs on either
   Odoo edition and its logic survives a move to another ERP.
8. **When Odoo is down,** nothing on the money path stops (payments never
   pass through Odoo); named staff keep a read-only way in through the
   Kapu Console (kapu-console), where approvers also decide, as they can
   from email.
9. **Products: Odoo is only the form** (FS-978). Every value is checked,
   every preview computed, and every version stored, approved and
   activated by lender rules and the approval engine (lender-rules §2.4);
   a version Dibon drafts arrives as *proposed*, and only the
   institution's product owner adopts it (FS-981).
10. **In Roan Capital's words, English and Swahili** (OC-14), to the
   experience principles (docs/experience.md): the right thing is the
   easy thing.

## 4 · Screens in R1

To confirm with Roan Capital's staff on 29 October (open answer 33):

| Screen | What staff do | Kapu MFI and the engine |
|---|---|---|
| Client | See a client: details, loans, guarantors, documents, history | Reads |
| New application | Convert a lead, capture an application, attach documents, submit | Commands: create client, submit application |
| My tasks | Approvals and checks waiting for me, oldest first | The engine's open steps for my roles |
| Payouts | Approved loans to pay out, and each payout's state at the bank | Reads; payout confirmed by rails' events |
| Repayments | A borrower's payments, and those not yet placed (JN-16) | Reads |
| Arrears | Loans past due, by days, with the next contact due under the collection ladder | Reads (lender rules) |
| Partners | See and manage partners: the record, relationships and their limits, feeds and their quality, events sent, freezes; propose, ask to change an account, refresh limits in bulk (lending-service §5) | Partners' reads and commands; the approval engine |
| Products | Draft a version from a template, see its previews, adopt a version Dibon proposed, submit it; approvers decide in My tasks; record CBK's letter; retire a version | Lender rules: draft, validate, preview, adopt, submit; the approval engine |

**Roles and their screens** (FS-979), Roan Capital's eight positions;
"act" means the role can do things on the screen, "read" view only; a
person holding several roles sees each role's screens (FS-982):

| Screen | Loan Officer | Credit Manager | Head Office | CEO | Finance | Collections | Auditor | Super Admin |
|---|---|---|---|---|---|---|---|---|
| Leads (Odoo CRM) | Act | Act | — | Read | — | — | Read | — |
| Client | Act (contact details) | Read | Read | Read | Read | Read (own cases) | Read | — |
| New application | Act | Act (may originate) | — | — | — | — | Read | — |
| My tasks | — | Stage 1 | Stage 2 | Stage 3; overrides | Payout preparation | — | Read | — |
| Payouts | — | Read | Read | Read | Prepare | — | Read | — |
| Repayments | Read | Read | Read | Read | Act (match to loan) | Read | Read | — |
| Arrears | Read (own clients) | Read | Read | Read | Read | Act | Read | — |
| Products | Read active | Draft (product owner)* | Approve* | Approve* | Approve* | — | Read | Never alone |
| Helpdesk: complaints | — | Complaints, compliance* | — | Read | — | — | Read | — |
| Morning sign-off | — | — | — | Deputy | Act | — | Read | — |
| Partners | — | Manage (partner manager)* | Approve* | Approve* | Read | — | Read | — |
| Users and roles | — | — | — | Approves role changes* | — | — | Read | Users only |

\* A duty held within the position (roan-capital, "Its roles"); the two
product approvers are two of those marked, never the drafter. With three
or four staff, roles fold as roan-capital says; the approval engine still
refuses anyone deciding their own request or two steps in a row.

## 5 · Interfaces

- **Kapu MFI's API:** its reads and commands, as Kapu MFI's spec will
  state them (to write); the workspace is its first client.
- **The approval engine:** its REST for a person's open steps and their
  decisions (approval-engine §6), with step-up.
- **Access:** the `odoo` client, code flow with PKCE (access §5), and
  token exchange for the calls the workspace makes as the person.

## 6 · Security and audit

- Sign-in through Keycloak only (AC-02); no local Odoo passwords for
  staff.
- Kapu MFI and the engine record each act against the person (rule 4);
  the workspace logs which screen called what, never a client's details.
- Tokens live in the person's session only, never in Odoo's database.

## 7 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| References to clients, loans and tasks | Confidential | While the lead or record is open, then as the lead | Identifiers only |
| A person's screen preferences | Internal | While they are a user | Theirs |
| The call log | Internal | 13 months, with observability's logs | References only |

## 8 · Quality and metrics

- A screen opens within two seconds at the 95th percentile.
- Metrics: screens opened, commands by outcome, Kapu MFI's and the
  engine's response times as the workspace sees them; an alert when
  commands fail above 2% in fifteen minutes (observability-grafana §4).

## 9 · Threats

| Threat | For example | The answer |
|---|---|---|
| Spoofing | Acting as another member of staff | Keycloak sign-in; the person's own token (rule 4) |
| Tampering | Changing a loan from the screen | No write but a command; Kapu MFI and the engine decide (rules 2, 3) |
| Repudiation | "I did not approve that" | The engine's decision record, with step-up |
| Information disclosure | A screen cached, or a list exported | Nothing stored (rule 1); exports by role only |
| Denial of service | Odoo down for an upgrade | Rule 8 |
| Elevation of privilege | An Odoo administrator approving a loan | Odoo holds no approval right; the engine takes roles from Keycloak |
| Linkability (LINDDUN) | Odoo's contacts joined with loans | One copy of a borrower (rule 5); loans never stored in Odoo |

## 10 · Acceptance tests

| # | Given | When | Then | Id, source |
|---|---|---|---|---|
| A1 | A client with a loan | A credit officer opens the client | Loans and balances show, each with when it was fetched; none is in Odoo's database | BS-23, rule 1 |
| A2 | A converted lead | The application is submitted | Kapu MFI holds the client and application; Odoo keeps the lead, linked | BS-23, rules 2, 5 |
| A3 | An application awaiting approval | The credit manager approves in My tasks | The engine asks for step-up and records the decision as that person; Kapu MFI acts on the engine's yes | BS-23, rules 3, 4 |
| A4 | A loan officer | They open My tasks | No approval they may not give is offered | BS-23, rule 6 |
| A5 | Odoo stopped | A repayment arrives | It is posted and placed; the engine's console takes a decision | BS-23, rule 8 |
| A6 | The module | It is installed on Odoo Community | It installs and every screen works | BS-23, rule 7 |
| A7 | A screen in Swahili | Staff switch language | Every label and message is in Swahili | BS-23, rule 9 |

## 11 · Open questions

**For the owner:**

1. Answered: the lending service (lending-service §6) gives its reads
   and commands.
2. Answered (FS-976, FS-987): the Kapu Console, read-only, for named
   staff.

**For Roan Capital:** which tasks were hard in Mifos, watched at the
desk (open answer 33).
