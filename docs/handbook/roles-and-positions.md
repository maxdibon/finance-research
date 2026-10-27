---
id: handbook-roles
name: Handbook 1 — roles and positions
kind: handbook
status: draft
released: 2026.10.15
owner: Delivery lead
classification: Internal
review_ids: [FS-770, FS-771, FS-772, FS-996]
last_reviewed: 2026-10-27
---

# 1 · Roles and positions

What a member of staff may do on the platform follows their job
position, never the person. Each position in Odoo carries a set of
roles; recording someone in a position asks for those roles, and a
second person approves them before they take effect (access-keycloak §6,
approval-engine §3).

## HB-10 · The position-to-roles table

**From:** FS-770; access-keycloak §6.

**Who keeps it:** the institution's operations lead. **Changed by:**
HB-12.

The institution's own table replaces this example, filled from its role
list (for Roan Capital, its delivery map's open answer 7):

| Position (in Odoo) | Roles | What the roles allow | Never with |
|---|---|---|---|
| Credit officer | `credit-officer` | Applications, documents, guarantors; the first step of a loan's chain, never on their own applications | — |
| Credit committee member | `committee` | A vote in the committee step (a quorum, or unanimous) | — |
| Head office committee member | `head-office-committee` | The step above the amount threshold | — |
| Accountant | `finance` | The exception queue, placing payments, the morning sign-off, preparing disbursements | Approving a correction they proposed |
| Finance lead | `finance-lead` | Approving corrections and returns; with Dibon's on-call engineer, overriding a held close; the business calendar | — |
| Collections officer | `collections` | The collection ladder's actions and calls | — |
| Complaints handler | `complaints` | The complaints register | — |
| Compliance officer | `compliance` | The restricted team in the helpdesk: identity mismatches, suspected fraud, complaints about staff | — |
| Partner manager | `partner-manager` | Proposing and managing the institution's partners: their records, agreements, feeds and monitoring (lending-service §5); never activating one alone | Approving its own partner's activation or account change |
| Auditor | `auditor` | Reading the audit trail and reports; nothing else | Any role that acts |
| Administrator | `administrator` | Creating and disabling users, resets after an identity check; never an approval role | `access-approver` |
| [The approver of access changes] | `access-approver` | Deciding role requests (HB-21) | `administrator` |

**Rules for the table:**

- A position's roles are the least the job needs. Anything extra is asked
  for one person at a time (HB-21), with a reason.
- At least two people hold every role a chain names, and at least two are
  administrators, so no approval waits on one person (approval-engine §4,
  rule 8).
- No Dibon role appears in the table: Dibon's engineers hold no product
  role and can never approve or release the institution's money (AC-09).

## HB-11 · Roles never held together

**From:** approval-engine §4 (MD-06).

The pairs in the table's last column are refused when requested, so one
person cannot both create a user and grant them a role, or propose a
correction and approve it. The approval engine also refuses anyone
deciding two consecutive steps of the same request, whatever roles they
hold (MD-06).

## HB-12 · Changing the table

**From:** approval-engine §4, rule 11.

1. The operations lead proposes the change: a new position, a role added
   to or taken from a position.
2. A second person approves it, re-authenticated, as for any change to
   the institution's approval chains (approval-engine §4, rule 11).
3. From then on, recording someone in the position asks for its new set;
   people already in the position get the change as a role request each,
   approved as in HB-21.

**Record:** the table's versions, each with who proposed and approved
it, kept in the approval engine's history.
