---
id: architecture-constraints
name: Architecture — constraints we design within
kind: architecture
status: draft
law: LR-11
released: 2026.10.16
owner: Solution architect
classification: Internal
review_ids: [FS-649]
last_reviewed: 2026-10-16
---

# Constraints we design within

What the architecture may not change, and where each comes from
(FS-649).

| Constraint | Source | What it shapes |
|---|---|---|
| We hold no institution's money | [README](README.md) §3; FS-031 | Pass-through on every product; escrow at a partner bank |
| We may still need payment-service authorisation, even in pass-through | National Payment System Act s.2, read widely (FS-428); compliance LC-06 | A legal opinion first (FS-444) |
| Personal data stays in Kenya unless a transfer is lawful | Data Protection Act (law register LR-17) | Hosting; channels; the insights model |
| A bank's material outsourcing needs CBK's approval; Saccos' vendors meet SASRA's terms | compliance LC-08, LC-05 | The approval pack; the access register (SE-26) |
| Lenders' conduct and pricing rules | CBK lender regulations 2026 (law register LR-03) | Lender rules; messaging; the collection ladder |
| In-country hosting on Liquid's Azure Stack, for now | FS-032; partners PT-01 | [Deployment](deployment.md) |
| Licences we may use | [README](README.md) §6.1 | Every component chosen |
| Odoo Enterprise, priced per internal user | README §8; FS-036, FS-644 | Portal users, Sign, API accounts |
| An institution's core stays authoritative | README §4 | Integrated mode first |
| A team of four; a rota of three | docs/operating-model.md | Use what exists; build less (delivery plan) |

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-11](../law/LR-11.md) The National Payment System Act (Cap. 491A).** Regulator: Central Bank of Kenya. Made under: An Act of Parliament. In force: Yes. Version read: as at 2025-11-04, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2011/39/eng@2025-11-04).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 2 | s. 2 | Its definitions; a "payment service provider" includes whoever provides services for sending, receiving, storing or processing payments electronically, and any person that processes or stores data on behalf of such a provider or its users |
