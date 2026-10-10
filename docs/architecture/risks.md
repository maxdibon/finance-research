---
id: architecture-risks
name: Architecture — risks and technical debt
kind: architecture
version: 0.1.0
owner: Solution architect
classification: Internal
review_ids: [FS-649, FS-695]
last_reviewed: 2026-10-10
---

# Risks and technical debt

What could undo the design, and what we are doing about each (FS-649).
Each row points to its register row, where its status lives.

| Risk | If it happens | Mitigation or next step | Register |
|---|---|---|---|
| Flat interest on Fineract's progressive loans is recent | Wrong schedules or payoffs | Checks F1 and F2 before the build; a custom processor as fallback | FS-625 |
| The split-ledger mode is not designed | A customer signs before it is | Design it before the first such customer | FS-066 |
| Liquid is not contracted; the second site is unconfirmed | No hosting or recovery site for R1 | The Liquid list; the build portable to another host (platform-security §9) | FS-032 |
| A rota of three engineers | Missed pages, tired people | Managed detection; a fourth and fifth engineer; escalation to the CTIO | FS-474 |
| The PRSP licence may not cover application-to-person SMS | Messages blocked or unlawful | Read the licence; a partner route as fallback | FS-160 |
| WhatsApp may not allow lenders' messages | Templates refused | SMS by default | FS-165 |
| Dibon may need payment-service authorisation even in pass-through | Regulatory action | A legal opinion; LC-06 | FS-428, FS-444 |
| The NPS Bill's gateway licence | A capital requirement | Comments; watch the Bill | FS-376 |
| Identity register access and vendor not settled | R1 onboarding slowed | The manual route (ID-01) | FS-202, FS-205 |
| Business registry access | Business borrowers blocked | The BRS request | FS-564 |
| Odoo's user count unconfirmed | Cost higher than planned | Read the agreement | FS-036 |
| On-call tool and phone route not chosen | A severity 1 not heard | Choose; the fallback SMS | FS-633 |
| The bastion not chosen | Engineers' sessions unrecorded | Evaluate Warpgate (Apache-2.0) before R1 go-live | FS-645, FS-695 |
| One AGPL module inside Odoo | A change to it would have to be published | Never modified | FS-646 |
| Event names drift from the catalogue | Services diverge again | Every name from the event bus catalogue; a name not in it is not published | FS-667 |
| Counsel's answers on restructuring | Relief delayed thirty days | Ask counsel | FS-624 |
