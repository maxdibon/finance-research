---
id: architecture-constraints
name: Architecture — constraints we design within
kind: architecture
status: draft
owner: Solution architect
classification: Internal
review_ids: [FS-649]
last_reviewed: 2026-10-08
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
