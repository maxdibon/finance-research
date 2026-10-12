---
id: handbook
name: Handbook — what an institution does on the platform, who does it, and when
kind: handbook
version: 0.1.0
owner: Delivery lead
classification: Internal
review_ids: [FS-771]
last_reviewed: 2026-10-12
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

1. **One procedure per entry,** with an id (HB-01): who does it, when,
   the steps, the record kept, the rule or regulation behind it, and the
   journey it comes from. A procedure says nothing a journey contradicts;
   when a journey changes, its procedures change in the same commit.
2. **The template stays generic:** roles by function, never names; an
   institution's values (its positions, approvers, hours, tolerances) are
   blanks in square brackets, filled from its delivery file.
3. **Each institution's copy is its own:** filled from its delivery
   file's answers, adopted at onboarding (OB-COM-25), kept by the
   institution, and never committed here (customers.md rule 4).
4. **Reviewed with each release,** and whenever the institution changes a
   position, an approver or a procedure.

## Sections

| Section | Procedures | Comes from | Status |
|---|---|---|---|
| [1 · Roles and positions](roles-and-positions.md) | HB-01 to HB-03: the position-to-roles table, roles never held together, changing the table | FS-770; access-keycloak §6 | Drafted |
| [2 · People and access](people-and-access.md) | HB-10 to HB-17: joiners, moves, leavers, a hostile exit, a lost authenticator, administrators, the access review | JN-18 | Drafted |
| [3 · The calendar](calendar.md) | Every duty by day, month, quarter and year | All the journeys | Drafted |
| 4 · Every day | The accountant's morning; unplaced payments; the end-of-day window | JN-17, JN-16 | When those journeys are agreed |
| 5 · Lending | Application to disbursement; bank payouts; restructures; settlement | JN-04, JN-13, JN-06, JN-14 | When those journeys are agreed |
| 6 · Customers | Complaints; documents and data requests | JN-08, JN-07 | When those journeys are agreed |
| 7 · When things go wrong | The fallback runbook; incidents; who to call at Dibon | JN-19; OB-COM-23 | With JN-19 |
