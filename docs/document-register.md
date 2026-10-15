---
id: document-register
name: Document register — every document with a party, as received, sent or worked on
kind: register
status: living
owner: Delivery lead
classification: Internal
review_ids: [FS-834, FS-835]
last_reviewed: 2026-10-15
---

# Document register

Every document Dibon holds with a client, partner or prospect (FS-835):
received, sent, or worked on. **The register holds metadata, never the
documents:** they live in `clients/` and `sources/confidential/`, outside
git, and in Odoo Documents once it is set up (rules, Dibon 10). Other
documents cite a document by its DR id: Roan Capital's delivery map does,
for its requirements and plans.

**Kinds and their statuses** (the check holds both):

| Kind | What it is | Statuses |
|---|---|---|
| Original | A third party's document, as received | kept (in the party's `originals/`, read-only, hashed: rules, Dibon 11) · to keep (registered, not yet moved there) |
| Record | Ours, as sent outside | kept · to keep |
| Working | Ours, being worked on | draft · shared · agreed · superseded · withdrawn · internal (never shared) |

**Fingerprint:** the first twelve characters of an original's or a
record's SHA-256, so anyone holding the file can match it.
`node tools/originals.js verify <party-folder>` checks a party's kept
originals against their manifest and against this register. **Dates**
are when it was received, sent or written; "file dated" where only the
file's own date is known. **"To confirm"** marks provenance not yet
checked with the owner (FS-840).

| Id | Party | Title | Kind | Version | Status | Date | From | Where | Fingerprint | Rows |
|---|---|---|---|---|---|---|---|---|---|---|
| DR-001 | Roan Capital | Business requirement document | Record | 1.0 | kept | 2026-08-20 | Dibon, sent with the executed NDA | `clients/roan-capital/originals/` | `1c108b8e1add` | FS-395 |
| DR-002 | Roan Capital | Non-disclosure agreement, as sent for signature | Record | — | kept | 2026-07-31 | Dibon | `clients/roan-capital/originals/` | `150fba3c46a8` | FS-738, FS-827 |
| DR-003 | Roan Capital | Non-disclosure agreement, executed (dated 4 August 2026, three years) | Original | — | kept | 2026-08-04 | Roan Capital, signed | `clients/roan-capital/originals/` | `5d73bc08e859` | FS-827 |
| DR-004 | Roan Capital | Certificate of incorporation, certified copy | Original | — | kept | 2025-11-04 | Roan Capital | `clients/roan-capital/originals/` | `b538d1997ccb` | FS-834 |
| DR-005 | Roan Capital | Sender ID authorisation letter, template | Original | — | kept | 2026-10-12 | Roan Capital | `clients/roan-capital/originals/` | `b005f0b7fb9a` | FS-739 |
| DR-006 | Roan Capital | Sender ID whitelisting request, signed (dated 9 October 2026) | Original | — | kept | 2026-10-12 | Roan Capital, its director | `clients/roan-capital/originals/` | `51c90e29729f` | FS-739, FS-834 |
| DR-007 | Roan Capital | Loan application form | Original | — | kept | 2026-10-15 | Roan Capital | `clients/roan-capital/originals/` | `4d7cabb20b13` | FS-831 |
| DR-008 | Roan Capital | Kickoff summary and next steps, the email as sent (7 September 2026) | Record | — | to keep | 2026-09-07 | Dibon | `clients/roan-capital/` | `7289aa579202` | FS-835 |
| DR-009 | Roan Capital | Review of the requirement document and the back office | Working | — | internal | 2026-10-03 | Dibon | `clients/roan-capital/` | — | FS-395 |
| DR-010 | Roan Capital | Mutual NDA, corrected draft | Working | — | withdrawn | 2026-10-12 | Dibon | `clients/roan-capital/` | — | FS-740, FS-827 |
| DR-011 | Roan Capital | NDA changes, internal note | Working | — | internal | 2026-10-12 | Dibon | `clients/roan-capital/` | — | FS-740 |
| DR-012 | Roan Capital | 30-day loan questionnaire A, product terms | Working | — | draft | 2026-10-15 | Dibon | `clients/roan-capital/meeting-2026-10-15/` | — | FS-815, FS-831 |
| DR-013 | Roan Capital | 30-day loan questionnaire B, eligibility and limits | Working | — | draft | 2026-10-15 | Dibon | `clients/roan-capital/meeting-2026-10-15/` | — | FS-815, FS-830 |
| DR-014 | Roan Capital | 30-day loan questionnaire C, how it runs | Working | — | draft | 2026-10-15 | Dibon | `clients/roan-capital/meeting-2026-10-15/` | — | FS-815, FS-831 |
| DR-015 | Roan Capital | Product and operations meeting, agenda (15 October 2026) | Working | — | draft | 2026-10-15 | Dibon | `clients/roan-capital/meeting-2026-10-15/` | — | FS-826 |
| DR-016 | Roan Capital | Product and operations meeting, our record (15 October 2026) | Working | — | internal | 2026-10-15 | Dibon | `clients/roan-capital/meeting-2026-10-15/` | — | FS-826 |
| DR-017 | Roan Capital | Loan application form, in our format, from DR-007 | Working | 0.1 | draft | 2026-10-15 | Dibon | `clients/roan-capital/working/` | — | FS-834 |
| DR-018 | Roan Capital | Loan application form, suggested changes tracked, from DR-017 | Working | 0.2 | draft | 2026-10-15 | Dibon | `clients/roan-capital/working/` | — | FS-833 |
| DR-019 | Roan Capital | Loan application form, schedule of v0.2's changes | Working | 0.2 | draft | 2026-10-15 | Dibon | `clients/roan-capital/working/` | — | FS-833 |
| DR-020 | Prembly | Reseller agreement | Original | — | to keep | 2026-10-12 | Prembly | `sources/confidential/prembly/` | `2d4cc9ba5308` | FS-762 |
| DR-021 | Prembly | Standard data processing agreement (Kenya) | Original | — | to keep | 2026-10-12 | Prembly | `sources/confidential/prembly/` | `2426cab18d5e` | FS-762 |
| DR-022 | Prembly | Our proposed changes, letter (Word and PDF) | Working | — | draft | 2026-10-12 | Dibon | `sources/confidential/prembly/` | — | FS-762 |
| DR-023 | KCB | Account mandate API specification, v1.1 | Record | 1.1 | to keep | file dated 2022-11-15 | Dibon, supplied to KCB | `clients/kcb/` | `117577d010c8` | FS-416 |
| DR-024 | KCB | USSD platform, deployment notes, release 3.2.3 | Record | 3.2.3 | to keep | file dated 2023-01-23 | Dibon, supplied to KCB | `clients/kcb/` | `fbdcbfe63ba8` | FS-416 |
| DR-025 | KCB | USSD platform, deployment notes, release 3.2.34 | Record | 3.2.34 | to keep | file dated 2024-03-14 | Dibon, supplied to KCB | `clients/kcb/` | `b20413a17693` | FS-416 |
| DR-026 | KCB | M-Pesa B2C, C2B and reversal, technical proposal, v1.0 | Record | 1.0 | to keep | file dated 2022-12-15 | Dibon, a proposal to KCB | `clients/kcb/` | `124c4cf06a9f` | FS-418 |
| DR-027 | KCB | MMC API specification, v2.7 | Record | 2.7 | to keep | file dated 2024-01-29 | Dibon, supplied to KCB (to confirm) | `clients/kcb/` | `2bdd068ebf83` | FS-416 |
| DR-028 | KCB | MMC operations manual, v1.1 | Record | 1.1 | to keep | file dated 2023-02-14 | Dibon, supplied to KCB (to confirm) | `clients/kcb/` | `0547cd500f56` | FS-416 |
| DR-029 | KCB | Merchant financing menus | Record | — | to keep | file dated 2023-01-25 | Dibon, supplied to KCB (to confirm) | `clients/kcb/` | `b09e7c9dcd5a` | FS-416 |
| DR-030 | KCB and NBK | Our project list for KCB and NBK | Working | — | internal | 2026-10-05 | Dibon | `clients/` | — | FS-443 |
| DR-031 | Onit Bank | API technical documentation (February 2025), what ran at Onit Bank | Record | — | to keep | 2026-10-03 | Dibon (to confirm) | `clients/onit/` | `93f8b16117ee` | FS-390, FS-396 |
| DR-032 | A microfinance bank (a prospect) | Digital banking proposal (23 February 2024) | Record | — | to keep | file dated 2024-03-15 | Dibon (to confirm) | `clients/` | `f91deb48f2f7` | FS-835 |
| DR-033 | NBK | Automated channels reconciliation and exception handling system | Record | — | to keep | 2026-10-01 | Dibon (to confirm) | `sources/confidential/` | `a699525cd256` | FS-007 |
| DR-034 | A partner bank | Kapu Pay technical documentation, prepared for a partner bank | Record | — | to keep | 2026-10-01 | Dibon | `sources/confidential/` | `796204fb9fd0` | FS-015, FS-071 |
| DR-035 | Dibon | KapuPay discussion, notes and the role mapping (8 June 2026) | Working | — | internal | 2026-06-08 | Dibon | `sources/confidential/` | — | FS-079 |
| DR-036 | Flex Money | Reconciliation dashboard demonstration and its script | Working | — | draft | 2026-08-04 | Dibon | `clients/flexmoney/` | — | FS-835 |
