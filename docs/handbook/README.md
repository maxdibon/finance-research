---
id: handbook
name: Handbook — what an institution does on the platform, who does it, and when
kind: handbook
status: draft
released: 2026.10.15
owner: Delivery lead
classification: Internal
review_ids: [FS-771, FS-772, FS-775, FS-896]
last_reviewed: 2026-10-22
---

# The institution's handbook

**What this is:** the template for each institution's own procedures on
the platform: who does what, when, and what is kept (FS-771). It says
*what and when*; the training manuals ([training/](../training/README.md))
say *how* on each screen, once the screens are drawn, and each manual
links to the procedure it serves. Dibon's own runbooks stay in
[operating-model.md](../operating-model.md) and
[service-management/](../service-management/README.md).

**Rules for the handbook:**

1. **One procedure per entry,** with an id (HB-10): who does it, when,
   the steps, the record kept, the rule or regulation behind it, and a
   **From:** line naming the journey or spec section it comes from. A
   procedure says nothing a journey contradicts; when a journey changes,
   its procedures change in the same commit. **The check holds it**
   (FS-772): each procedure names an existing journey or spec, every HB id
   cited in docs/ exists, and a journey past draft has its procedures.
2. **The template stays generic:** roles by function, never names; an
   institution's values (its positions, approvers, hours, tolerances) are
   blanks in square brackets, filled from its delivery file.
3. **Each institution's copy is its own:** filled from its delivery
   file's answers, adopted at onboarding (OB-COM-25), kept by the
   institution, and never committed here (customers.md rule 4).
4. **Reviewed with each release,** and whenever the institution changes a
   position, an approver or a procedure.

## Where it lives

**On GitHub, for Dibon:** the template, in this folder, changed by pull
request with the delivery lead as its code owner; Dibon's own runbooks;
and the reader for Dibon's staff, served behind sign-in. Institutions
have no GitHub access (specs/github.md §11).

**In each institution's Odoo, in R1** (FS-772):

| What | Odoo | How it links |
|---|---|---|
| Each procedure | Knowledge, an article per HB id, published from the template with each release, the institution's values filled in; or the reader, per institution, behind its own sign-in (open question below) | Its HB id and version |
| Each job position | Employees: the position names its roles (HB-10), its procedures and its training | From the position to everything the person needs |
| Joining and leaving | Employees: onboarding and offboarding plans, a task for each person in HB-20 and HB-23 | Each task links its procedure; closing it is the record |
| Requests and the morning | Helpdesk: each ticket type, the morning's ticket and the complaints register link their procedure | The procedure opens from the ticket |
| The calendar | Project: each duty a recurring task with an owner | Overdue when missed |

**Later:** training courses in eLearning per role, with completion
recorded as HB-20's evidence; until then, the training plan's sessions
and the reader.

## Open questions

- **For the Odoo consultants:** staff who work in Kapu MFI's back office
  but rarely in Odoo would need an Odoo user to read Knowledge, the
  onboarding plans' tasks and Project: which of them need a paid user,
  and is there a read-only way? The answer decides Knowledge or the
  reader for the procedures' text.

## Sections

| Section | Procedures | Comes from | Status |
|---|---|---|---|
| [1 · Roles and positions](roles-and-positions.md) | HB-10 to HB-12: the position-to-roles table, roles never held together, changing the table | FS-770; access-keycloak §6 | Drafted |
| [2 · People and access](people-and-access.md) | HB-20 to HB-27: joiners, moves, leavers, a hostile exit, a lost authenticator, administrators, the access review | JN-18 | Drafted |
| [3 · The calendar](calendar.md) | Every duty by day, month, quarter and year | All the journeys | Drafted |
| 4 · Every day | The accountant's morning; unplaced payments; the end-of-day window | JN-17, JN-16 | When those journeys are agreed |
| 5 · Lending | Application to disbursement; bank payouts; restructures; settlement | JN-04, JN-13, JN-06, JN-14 | When those journeys are agreed |
| 6 · Customers | Complaints; documents and data requests | JN-08, JN-07 | When those journeys are agreed |
| [7 · When things go wrong](when-things-go-wrong.md) | HB-70 to HB-78: safe mode, payments and payouts by hand, the manual form, the outage log, bringing it back in, M-Pesa down, a suspected attack | JN-19; OB-COM-23 | Drafted |
