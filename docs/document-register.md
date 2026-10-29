---
id: document-register
name: Document register — every document with a party, as received, sent or worked on
kind: register
status: living
released: 2026.10.16
owner: Delivery lead
classification: Internal
review_ids: [FS-834, FS-835, FS-857, FS-874, FS-1026, FS-1039, FS-1043, FS-1044, FS-1049]
last_reviewed: 2026-10-29
---

# Document register

Every document Dibon holds with a client, partner or prospect (FS-835):
received, sent, or worked on. **The register holds metadata, never the
documents:** they live in `clients/` and `sources/confidential/`, outside
git, and in Odoo Documents once it is set up (rules, Dibon 10). Other
documents cite a document by its DR id. **Each customer's delivery map
shows its own documents** in its §6, a table generated from this one by
`node tools/docregister.js` (FS-857): register a document here, never
there. **The summary** says in one line what a document is and why we
hold it; "to confirm" marks one we have not yet read for it.

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

| Id | Party | Title | Summary | Kind | Version | Status | Date | From | Where | Fingerprint | Rows |
|---|---|---|---|---|---|---|---|---|---|---|---|
| DR-001 | Roan Capital | Business requirement document | The requirements for Roan Capital's lending platform, as we sent them with the executed NDA; every RC id on its delivery map comes from it | Record | 1.0 | kept | 2026-08-20 | Dibon, sent with the executed NDA | `clients/roan-capital/originals/` | `1c108b8e1add` | FS-395 |
| DR-002 | Roan Capital | Non-disclosure agreement, as sent for signature | The mutual NDA as we sent it for signature | Record | — | kept | 2026-07-31 | Dibon | `clients/roan-capital/originals/` | `150fba3c46a8` | FS-738, FS-827 |
| DR-003 | Roan Capital | Non-disclosure agreement, executed (dated 4 August 2026, three years) | The NDA as signed, dated 4 August 2026 for three years: the one in force | Original | — | kept | 2026-08-04 | Roan Capital, signed | `clients/roan-capital/originals/` | `5d73bc08e859` | FS-827 |
| DR-004 | Roan Capital | Certificate of incorporation, certified copy | A certified copy of Roan Capital's certificate of incorporation, for our customer records | Original | — | kept | 2025-11-04 | Roan Capital | `clients/roan-capital/originals/` | `b538d1997ccb` | FS-834 |
| DR-005 | Roan Capital | Sender ID authorisation letter, template | The letter template Roan Capital supplied for authorising its SMS sender ID | Original | — | kept | 2026-10-12 | Roan Capital | `clients/roan-capital/originals/` | `b005f0b7fb9a` | FS-739 |
| DR-006 | Roan Capital | Sender ID whitelisting request, signed (dated 9 October 2026) | Roan Capital's signed request to whitelist its SMS sender ID, dated 9 October 2026 | Original | — | kept | 2026-10-12 | Roan Capital, its director | `clients/roan-capital/originals/` | `51c90e29729f` | FS-739, FS-834 |
| DR-007 | Roan Capital | Loan application form | Roan Capital's loan application form, exactly as received; our versions 0.1 and 0.2 start from it | Original | — | kept | 2026-10-15 | Roan Capital | `clients/roan-capital/originals/` | `4d7cabb20b13` | FS-831 |
| DR-008 | Roan Capital | Kickoff summary and next steps, the email as sent (7 September 2026) | Our email after the kickoff: what was agreed, and the next steps | Record | — | to keep | 2026-09-07 | Dibon | `clients/roan-capital/` | `7289aa579202` | FS-835 |
| DR-009 | Roan Capital | Review of the requirement document and the back office | Our own reading of the requirement document, and what the back office needs | Working | — | internal | 2026-10-03 | Dibon | `clients/roan-capital/` | — | FS-395 |
| DR-010 | Roan Capital | Mutual NDA, corrected draft | A corrected NDA we drafted; withdrawn, as the executed NDA stands | Working | — | withdrawn | 2026-10-12 | Dibon | `clients/roan-capital/` | — | FS-740, FS-827 |
| DR-011 | Roan Capital | NDA changes, internal note | Our note on the changes the NDA would have needed | Working | — | internal | 2026-10-12 | Dibon | `clients/roan-capital/` | — | FS-740 |
| DR-012 | Roan Capital | 30-day loan questionnaire A, product terms | Questions for Roan Capital on the 30-day loan's terms: amounts, term, pricing | Working | — | superseded | 2026-10-15 | Dibon | `clients/roan-capital/meeting-2026-10-15/` | — | FS-815, FS-831 |
| DR-013 | Roan Capital | 30-day loan questionnaire B, eligibility and limits | Questions for Roan Capital on who may borrow, and how much | Working | — | superseded | 2026-10-15 | Dibon | `clients/roan-capital/meeting-2026-10-15/` | — | FS-815, FS-830 |
| DR-014 | Roan Capital | 30-day loan questionnaire C, how it runs | Questions for Roan Capital on how the loan runs from day to day | Working | — | superseded | 2026-10-15 | Dibon | `clients/roan-capital/meeting-2026-10-15/` | — | FS-815, FS-831 |
| DR-015 | Roan Capital | Product and operations meeting, agenda (15 October 2026) | The agenda for the product and operations meeting of 15 October | Working | — | draft | 2026-10-15 | Dibon | `clients/roan-capital/meeting-2026-10-15/` | — | FS-826 |
| DR-016 | Roan Capital | Product and operations meeting, our record (15 October 2026) | What was said and agreed at the 15 October meeting, kept for us | Working | — | internal | 2026-10-15 | Dibon | `clients/roan-capital/meeting-2026-10-15/` | — | FS-826 |
| DR-017 | Roan Capital | Loan application form, in our format, from DR-007 | The application form in our format, word for word as received | Working | 0.1 | draft | 2026-10-15 | Dibon | `clients/roan-capital/working/` | — | FS-834 |
| DR-018 | Roan Capital | Loan application form, suggested changes tracked, from DR-017 | The form with our 28 suggested changes tracked, each with its reason and the regulation behind it | Working | 0.2 | superseded | 2026-10-15 | Dibon | `clients/roan-capital/working/` | — | FS-833 |
| DR-019 | Roan Capital | Loan application form, schedule of v0.2's changes | The 28 changes in version 0.2 in one table, for Roan Capital to accept or decline | Working | 0.2 | superseded | 2026-10-15 | Dibon | `clients/roan-capital/working/` | — | FS-833 |
| DR-020 | Prembly | Reseller agreement | Prembly's reseller agreement, as received: the terms on which we would resell its identity checks | Original | — | to keep | 2026-10-12 | Prembly | `sources/confidential/prembly/` | `2d4cc9ba5308` | FS-762 |
| DR-021 | Prembly | Standard data processing agreement (Kenya) | Prembly's standard data processing agreement for Kenya, as received | Original | — | to keep | 2026-10-12 | Prembly | `sources/confidential/prembly/` | `2426cab18d5e` | FS-762 |
| DR-022 | Prembly | Our proposed changes, letter (Word and PDF) | Our letter proposing changes to Prembly's agreements | Working | — | draft | 2026-10-12 | Dibon | `sources/confidential/prembly/` | — | FS-762 |
| DR-023 | KCB | Account mandate API specification, v1.1 | The account mandate API we specified for KCB | Record | 1.1 | to keep | file dated 2022-11-15 | Dibon, supplied to KCB | `clients/kcb/` | `117577d010c8` | FS-416 |
| DR-024 | KCB | USSD platform, deployment notes, release 3.2.3 | Deployment notes for the USSD platform we supplied to KCB, release 3.2.3 | Record | 3.2.3 | to keep | file dated 2023-01-23 | Dibon, supplied to KCB | `clients/kcb/` | `fbdcbfe63ba8` | FS-416 |
| DR-025 | KCB | USSD platform, deployment notes, release 3.2.34 | Deployment notes for the USSD platform we supplied to KCB, release 3.2.34 | Record | 3.2.34 | to keep | file dated 2024-03-14 | Dibon, supplied to KCB | `clients/kcb/` | `b20413a17693` | FS-416 |
| DR-026 | KCB | M-Pesa B2C, C2B and reversal, technical proposal, v1.0 | Our technical proposal to KCB for M-Pesa payouts, collections and reversals | Record | 1.0 | to keep | file dated 2022-12-15 | Dibon, a proposal to KCB | `clients/kcb/` | `124c4cf06a9f` | FS-418 |
| DR-027 | KCB | MMC API specification, v2.7 | The MMC API specification; that we supplied it is to confirm | Record | 2.7 | to keep | file dated 2024-01-29 | Dibon, supplied to KCB (to confirm) | `clients/kcb/` | `2bdd068ebf83` | FS-416 |
| DR-028 | KCB | MMC operations manual, v1.1 | The MMC operations manual; that we supplied it is to confirm | Record | 1.1 | to keep | file dated 2023-02-14 | Dibon, supplied to KCB (to confirm) | `clients/kcb/` | `0547cd500f56` | FS-416 |
| DR-029 | KCB | Merchant financing menus | The menus for merchant financing; that we supplied them is to confirm | Record | — | to keep | file dated 2023-01-25 | Dibon, supplied to KCB (to confirm) | `clients/kcb/` | `b09e7c9dcd5a` | FS-416 |
| DR-030 | KCB and NBK | Our project list for KCB and NBK | Our own list of the projects for KCB and NBK | Working | — | internal | 2026-10-05 | Dibon | `clients/` | — | FS-443 |
| DR-031 | Onit Bank | API technical documentation (February 2025), what ran at Onit Bank | The API documentation of February 2025, describing what ran at Onit Bank; its author is to confirm | Record | — | to keep | 2026-10-03 | Dibon (to confirm) | `clients/onit/` | `93f8b16117ee` | FS-390, FS-396 |
| DR-032 | A microfinance bank (a prospect) | Digital banking proposal (23 February 2024) | Our digital banking proposal to a microfinance bank, a prospect | Record | — | to keep | file dated 2024-03-15 | Dibon (to confirm) | `clients/` | `f91deb48f2f7` | FS-835 |
| DR-033 | NBK | Automated channels reconciliation and exception handling system | A system for reconciling automated channels and handling their exceptions, described for NBK | Record | — | to keep | 2026-10-01 | Dibon (to confirm) | `sources/confidential/` | `a699525cd256` | FS-007 |
| DR-034 | A partner bank | Kapu Pay technical documentation, prepared for a partner bank | Technical documentation of Kapu Pay, prepared for a partner bank | Record | — | to keep | 2026-10-01 | Dibon | `sources/confidential/` | `796204fb9fd0` | FS-015, FS-071 |
| DR-035 | Dibon | KapuPay discussion, notes and the role mapping (8 June 2026) | Our notes from the 8 June 2026 Kapu Pay discussion, with the mapping of roles | Working | — | internal | 2026-06-08 | Dibon | `sources/confidential/` | — | FS-079 |
| DR-036 | Flex Money | Reconciliation dashboard demonstration and its script | A demonstration of the reconciliation dashboard, with the script it follows | Working | — | draft | 2026-08-04 | Dibon | `clients/flexmoney/` | — | FS-835 |
| DR-037 | Roan Capital | Loan application form, v0.2 with a page of the regulations cited, tracked, from DR-018 | The form with our 28 suggested changes, and a last page listing each regulation cited with what each provision requires; two readings marked as being confirmed | Working | 0.3 | draft | 2026-10-16 | Dibon | `clients/roan-capital/working/` | — | FS-874 |
| DR-038 | Roan Capital | Loan application form, schedule of v0.3's changes | The 28 changes in one table, for Roan Capital to accept or decline, and the page of regulations cited | Working | 0.3 | draft | 2026-10-16 | Dibon | `clients/roan-capital/working/` | — | FS-874 |
| DR-039 | Roan Capital | 30-day loan questionnaire A, product terms, with the regulations cited | Questions on the 30-day loan's terms, and a last page listing the regulations they rest on, two readings marked as being confirmed | Working | 0.2 | superseded | 2026-10-16 | Dibon | `clients/roan-capital/working/` | — | FS-874 |
| DR-040 | Roan Capital | 30-day loan questionnaire B, eligibility and limits, with the regulations cited | Questions on who may borrow and how much, and a last page listing the regulations they rest on | Working | 0.2 | superseded | 2026-10-16 | Dibon | `clients/roan-capital/working/` | — | FS-874 |
| DR-041 | Roan Capital | 30-day loan questionnaire C, how it runs, with the regulations cited | Questions on how the loan runs from day to day, and a last page listing the regulation it rests on | Working | 0.2 | superseded | 2026-10-16 | Dibon | `clients/roan-capital/working/` | — | FS-874 |
| DR-042 | Roan Capital | 30-day loan (Biashara) questionnaire A, product terms (DC-FS-QN-001) | Questions on the product's terms, for its product owner, a form field for each answer, built from the product's draft, and a last page of the regulations cited | Working | 0.3 | superseded | 2026-10-27 | Dibon | `clients/roan-capital/working/` | — | FS-1039, FS-1040, FS-1043 |
| DR-043 | Roan Capital | 30-day loan (Biashara) questionnaire B, eligibility and limits (DC-FS-QN-001) | Questions on who may borrow and how much, for its credit lead, a form field for each answer, built from the product's draft, and a last page of the regulations cited | Working | 0.3 | superseded | 2026-10-27 | Dibon | `clients/roan-capital/working/` | — | FS-1039, FS-1040, FS-1043 |
| DR-044 | Roan Capital | 30-day loan (Biashara) questionnaire C, how it runs (DC-FS-QN-001) | Questions on how the loan runs day to day, for its operations lead, a form field for each answer, built from the product's draft, and a last page of the regulations cited | Working | 0.3 | superseded | 2026-10-27 | Dibon | `clients/roan-capital/working/` | — | FS-1039, FS-1040, FS-1043 |
| DR-045 | Roan Capital | Motor Vehicle questionnaire A, product terms (DC-FS-QN-002) | Questions on the product's terms, for its product owner, a form field for each answer, built from the product's draft, and a last page of the regulations cited | Working | 0.1 | superseded | 2026-10-27 | Dibon | `clients/roan-capital/working/` | — | FS-1039, FS-1040, FS-1043 |
| DR-046 | Roan Capital | Motor Vehicle questionnaire B, eligibility and limits (DC-FS-QN-002) | Questions on who may borrow and how much, for its credit lead, a form field for each answer, built from the product's draft, and a last page of the regulations cited | Working | 0.1 | superseded | 2026-10-27 | Dibon | `clients/roan-capital/working/` | — | FS-1039, FS-1040, FS-1043 |
| DR-047 | Roan Capital | Motor Vehicle questionnaire C, how it runs (DC-FS-QN-002) | Questions on how the loan runs day to day, for its operations lead, a form field for each answer, built from the product's draft, and a last page of the regulations cited | Working | 0.1 | superseded | 2026-10-27 | Dibon | `clients/roan-capital/working/` | — | FS-1039, FS-1040, FS-1043 |
| DR-048 | Roan Capital | Title Deed questionnaire A, product terms (DC-FS-QN-003) | Questions on the product's terms, for its product owner, a form field for each answer, built from the product's draft, and a last page of the regulations cited | Working | 0.1 | superseded | 2026-10-27 | Dibon | `clients/roan-capital/working/` | — | FS-1039, FS-1040, FS-1043 |
| DR-049 | Roan Capital | Title Deed questionnaire B, eligibility and limits (DC-FS-QN-003) | Questions on who may borrow and how much, for its credit lead, a form field for each answer, built from the product's draft, and a last page of the regulations cited | Working | 0.1 | superseded | 2026-10-27 | Dibon | `clients/roan-capital/working/` | — | FS-1039, FS-1040, FS-1043 |
| DR-050 | Roan Capital | Title Deed questionnaire C, how it runs (DC-FS-QN-003) | Questions on how the loan runs day to day, for its operations lead, a form field for each answer, built from the product's draft, and a last page of the regulations cited | Working | 0.1 | superseded | 2026-10-27 | Dibon | `clients/roan-capital/working/` | — | FS-1039, FS-1040, FS-1043 |
| DR-051 | Roan Capital | Roles, approvals and going live (DC-FS-QN-004) | The open questions on who does what, who approves, outages, and what CBK needs before go-live, in six sections by who answers, and a last page of the regulations cited; v0.2 with what we already have under each question it applies to | Working | 0.2 | draft | 2026-10-28 | Dibon | `clients/roan-capital/working/` | — | FS-1039, FS-1040, FS-1044 |
| DR-052 | Roan Capital | Fallback for a platform outage, template (DC-FS-TM-002) | A starter for Roan Capital's own procedure in an outage, in the plain look, for it to adopt | Working | 0.1 | draft | 2026-10-27 | Dibon | `clients/roan-capital/working/` | — | FS-1039, FS-1040 |
| DR-053 | Roan Capital | Email, documents for 29 October | Our draft covering email for the pack above; not sent. v0.2 counts five documents; v0.3 shares them in a Google Drive folder Roan Capital edits (FS-1042); v0.4 without the set-up note, ready to paste; v0.5 for five files, a questionnaire per product; v0.5 also as a Word file, for the team to comment on in Drive; v0.6 for after the meeting of 29 October | Working | 0.6 | draft | 2026-10-29 | Dibon | `clients/roan-capital/working/` | — | FS-1039, FS-1040, FS-1042, FS-1043, FS-1049 |
| DR-054 | Roan Capital | Team review request, the pack for 29 October | Our internal request to the team to review the pack before it goes to Roan Capital, the pack in a restricted Google Drive folder; v0.4 without the set-up note, the team already able to open the folder, Suggesting mode: the delivery lead the whole pack; the dev lead, with the CI/CD engineer shadowing, the worksheet and the questionnaires; the CEO the regulations pages; the ops lead the fallback template; by Wednesday 28 October at noon; not sent; v0.5 for five files; v0.6 with every file a Word file; v0.7 in plain text for pasting into Gmail, six files listed, due 15:00 on the day; v0.8 with who reviews what as a table; v0.9 retimed: review by 14:00 on 29 October, the pack to go after the meeting | Working | 0.9 | internal | 2026-10-29 | Dibon | `clients/roan-capital/working/` | — | FS-1040, FS-1041, FS-1043, FS-1049 |
| DR-055 | Roan Capital | Drive set-up for 29 October, Eric's checklist | The steps to set up, run and close the two Drive folders: before the team's review, after it, and after Roan Capital answers; v0.2 for five files; v0.3 with every file uploaded as Word, and Roan Capital's clean copies rebuilt from their sources; v0.4 retimed to 29 October | Working | 0.4 | internal | 2026-10-29 | Dibon | `clients/roan-capital/working/` | — | FS-1041, FS-1042, FS-1043, FS-1049 |
| DR-056 | Roan Capital | 30-day loan (Biashara) questionnaire, parts A to C in one (DC-FS-QN-001) | The questions on the product's terms, eligibility and limits, and how it runs, a part and a page each, a form field for each answer, built from the product's draft, and a last page of the regulations cited; v0.5 with what Roan Capital agreed on 21 October shown as what we have | Working | 0.5 | draft | 2026-10-28 | Dibon | `clients/roan-capital/working/` | — | FS-1043, FS-1044 |
| DR-057 | Roan Capital | Motor Vehicle questionnaire, parts A to C in one (DC-FS-QN-002) | As DR-056, for Motor Vehicle | Working | 0.2 | draft | 2026-10-28 | Dibon | `clients/roan-capital/working/` | — | FS-1043 |
| DR-058 | Roan Capital | Title Deed questionnaire, parts A to C in one (DC-FS-QN-003) | As DR-056, for Title Deed | Working | 0.2 | draft | 2026-10-28 | Dibon | `clients/roan-capital/working/` | — | FS-1043 |
| DR-059 | Roan Capital | 30-day loan (Biashara) questionnaire, what needs an answer set apart from what 21 October told us (DC-FS-QN-001) | Each part opens with what needs an answer; what Roan Capital told us on 21 October follows, confirmed with one answer, a correction beside each item; settled last; a count of each on the first page; a last page of the regulations cited. For Eric's review | Working | 0.6 | draft | 2026-10-29 | Dibon | `clients/roan-capital/working/` | — | FS-1049 |

## Our documents, numbered, and who received them

FS-1026. Documents Dibon produces for someone outside, by their number
(design-system §7). A copy kept of one we sent is also a DR row above, a
Record, under its party.

**Numbered documents:**

| Number | Title | Kind | Version | Status | Issued | Made by |
|---|---|---|---|---|---|---|
| DC-FS-PF-001 | Dibon Financial Services Portfolio (the full edition) | PF | 1.2 | issued | 2026-10-22 | design/portfolio-pdf/ |
| DC-FS-PF-002 | Dibon Financial Services Overview (the short edition) | PF | 1.2 | issued | 2026-10-22 | design/portfolio-pdf/ |
| DC-FS-PR-001 | Bank channel proposal | PR | 1.0 | issued | 2026-10-05 | design/bank-channel-proposal/ |
| DC-FS-DK-001 | Dibon for SBM Bank, the deck for the meeting of 22 October | DK | 1.0 | issued | 2026-10-22 | build/proposals/ |
| DC-FS-LT-001 | Requests to banks for statements, alerts and balances, one copy per bank | LT | 0.1 | draft | — | design/outreach-pdf/ |
| DC-FS-QN-001 | Roan Capital: the 30-day loan (Biashara), its questionnaire, parts A to C in one file | QN | 0.6 | draft | — | tools/products/questionnaires.js |
| DC-FS-QN-002 | Roan Capital: Motor Vehicle, its questionnaire, parts A to C in one file | QN | 0.2 | draft | — | tools/products/questionnaires.js |
| DC-FS-QN-003 | Roan Capital: Title Deed, its questionnaire, parts A to C in one file | QN | 0.2 | draft | — | tools/products/questionnaires.js |
| DC-FS-QN-004 | Roan Capital: roles, approvals and going live | QN | 0.2 | draft | — | design/system/docx.js |
| DC-FS-TM-001 | Onboarding pack for an institution's business customers and partners | TM | 0.1 | draft | — | docs/templates/onboarding-pack.md |
| DC-FS-TM-002 | An institution's fallback for a platform outage, starter template (from runbooks/institution-fallback) | TM | 0.1 | draft | — | design/system/docx.js |

**Distribution log:** each sending of a numbered document. The
organisation, the recipient's role, never their name (it stays on the
CRM opportunity).

| Number | Version | To | Recipient's role | Date | How | Named copy | Record |
|---|---|---|---|---|---|---|---|
| DC-FS-DK-001 | 1.0 | SBM Bank | Its team at the meeting of 22 October (to confirm: shown, or also sent) | 2026-10-22 | Presented; sending to confirm | No | — |
| DC-FS-PF-001 | 1.2 | SBM Bank | To confirm | To confirm | To confirm | To confirm | — |
