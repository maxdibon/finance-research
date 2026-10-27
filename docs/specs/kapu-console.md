---
id: kapu-console
name: The Kapu Console — build specification
kind: spec
type: build
status: draft
released: unreleased
release: R1
implements: [mandates]
depends_on: [access-keycloak, approval-engine, lending-service]
used_by: []
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-976, FS-980, FS-987, FS-988]
last_reviewed: 2026-10-27
---

# The Kapu Console — build specification

Our own web application for an institution's staff, outside Odoo
(FS-987). It holds the approval console, the read-only fallback for when
Odoo is down, and products read-only. Staff normally work in the staff
workspace inside Odoo; the Console is the way that never depends on
Odoo. Its approvals are the approval engine's own decision page, which
email approval already needs (MD-18), with a list of a person's open
steps (FS-988): one engine, two screens, not two capabilities. Nothing is
built: every behaviour here is **designed**.

## 1 · Purpose and scope

What it answers: where do staff decide, and look things up, whatever
state Odoo is in?

| Id | Capability | In R1 |
|---|---|---|
| MD-21 | The Kapu Console: the approval engine's decision page and each person's open steps; read-only fallback views of clients, loans, payouts and arrears for named staff; products read-only; outside Odoo, signed in through Keycloak | Yes |

**Out of R1:** deposits views (with the deposits service); other
products' tasks as they come.

**Where it sits.**

```
  +----------------------+  decisions,       +----------------------+
  | KAPU CONSOLE         |  with step-up     | APPROVAL ENGINE      |
  | decides, looks up    |------------------>| decides              |
  | [kapu_service]       |                   | [kapu_service]       |
  +----------------------+                   +----------------------+
         |          |  reads, as the person  +----------------------+
         |          +----------------------->| LENDING SERVICE      |
         |  sign-in, the person's token      | lends                |
         v                                   | [kapu_service]       |
  +----------------------+                   +----------------------+
  | ACCESS               |
  | signs in, steps up   |
  | [keycloak]           |
  +----------------------+
```

**Related:** implements [mandates](../modules/mandates.md); depends on
[access-keycloak](access-keycloak.md),
[approval-engine](approval-engine.md) and
[lending-service](lending-service.md); used by none yet; the daily
screens are [staff-workspace](staff-workspace.md).

## 2 · Rules

1. **Approvals are the engine's decision page:** the same page email
   approval opens (MD-18), with a list of the person's open steps; step-up
   at each decision (MD-10).
2. **Fallback views are read-only,** for staff the institution names
   (staff-workspace rule 8), and live reads with when they were fetched.
3. **Products are read-only here:** versions, their status, their
   approvals; drafting is in the staff workspace (FS-978).
4. **Never depends on Odoo:** its own application, its own Keycloak
   client, deployed beside the approval engine.
5. **No product role for Dibon** (AC-09); the `ops` realm cannot reach it.

## 3 · Interfaces

The approval engine's REST (approval-engine §6); the lending service's
reads (lending-service §5); lender rules' product reads (lender-rules
§3); access's `kapu-console` client, code flow with PKCE.

## 4 · Security and audit

Staff realm only; every decision with step-up; every view logged by
person and screen, never with a client's details.

## 5 · Data

Stores nothing of its own beyond sessions; what it shows is read live.

## 6 · Quality and metrics

The approval engine's tier, so it is up whenever the engine is; a page
within two seconds at the 95th percentile.

## 7 · Threats

| Threat | For example | The answer |
|---|---|---|
| Spoofing | A forwarded email link | The page signs the approver in as themselves (MD-18) |
| Tampering | A payout's account changed after approval | The approved content's hash (RL-01) |
| Repudiation | A decision disputed | The engine's record, with step-up |
| Information disclosure | Fallback views opened by anyone | Named staff only (rule 2) |
| Denial of service | Odoo down | Rule 4 |
| Elevation of privilege | A Dibon engineer deciding | Rule 5 |

## 8 · Acceptance tests

| # | Given | When | Then | Id, source |
|---|---|---|---|---|
| A1 | Odoo stopped | An approver opens the Console | Their open steps show and they decide, with step-up | MD-21, rule 4 |
| A2 | A member of staff not named for the fallback | They open a fallback view | It is refused | MD-21, rule 2 |
| A3 | A product version | It is opened in the Console | It shows read-only; no edit is offered | MD-21, rule 3 |

## 9 · Open questions

**For Roan Capital:** which staff are named for the fallback (open
answer 38).
