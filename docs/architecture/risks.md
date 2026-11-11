---
id: architecture-risks
name: Architecture — risks and technical debt
kind: architecture
status: draft
released: 2026.10.15
owner: Solution architect
classification: Internal
review_ids: [FS-649, FS-695, FS-744, FS-1187]
last_reviewed: 2026-11-11
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
| Counsel's answers on restructuring | Relief delayed thirty days | Ask counsel: LQ-06, LQ-07 (docs/governance/legal-questions.md) | FS-624 |
| Rulebooks read from CBK's 2013 guidelines | A ratio computed on rules since revised | Check for a revision before tier 2 is specified; every value cited, so a change is found | FS-1173 |
| Kenya Law and the RBA refuse scripts | Texts fetched late, or by hand only | The regulators' own copies where they allow it; the browser, with the owner, for the rest | FS-1177, FS-1180 |
| A business's payments through us may need a licence | Kapu Business's payments held back | Offered through institutions first, under their names; counsel on LQ-42 | FS-1183 |
| Investors' pools at a lender | An investor portal promised that may not be lawful | Counsel on LQ-38 before it is offered | FS-1084 |
| Safaricom's SIM-swap check for an authorised partner, now in R1 | Payouts to a swapped SIM | Ask Safaricom early; the identity binding (ID-12) meanwhile | FS-386, FS-1167 |
| No known query for an operator to confirm a number's network | A ported number paid on the wrong network | Ask each operator; the payout held when unconfirmed | FS-1144 |
| Daraja's callbacks may be unsigned | A forged callback counted | Every callback confirmed by status query first (rails rule 6) | FS-209 |
| The core adapter's list of writers | Every posting waits on it | Kept small, replicated, and its list changed only by approval | FS-1184 |
