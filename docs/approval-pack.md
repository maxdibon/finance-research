---
id: approval-pack
name: Outsourcing approval pack — what customers file with their regulator about us
kind: checklist
version: 0.1.0
owner: Compliance lead
classification: Internal
review_ids: [FS-368, FS-370, FS-420, FS-437, FS-440, FS-443, FS-444]
last_reviewed: 2026-10-05
---

# Outsourcing approval pack

**What this is:** the documents an institution files with its regulator
before it uses us, assembled once so each customer does not start from
nothing (FS-437, FS-440). The institution files it and stays responsible
for the arrangement; we supply what is ours. Onboarding item OB-COM-15
asks for the regulator's approval; this is what goes into it.

**Status:** *Ready* (exists and can be sent) · *To prepare* (we must
produce it) · *To confirm* (a commitment the owner has not yet made).
Nothing here is sent as a commitment until it is Ready.

## What each regulator asks

| Customer | What it must do before using us | Source |
|---|---|---|
| Non-deposit-taking lender | Notify CBK at least 30 days before; send our details, background on our shareholders, directors and senior officers, our business record, and what is outsourced. The contract must give CBK access to our premises, books, records, systems and staff. The lender stays liable for us, and may not outsource its final loan decisions, its management, board decisions, the determination of compliance, or management of its loan portfolio | CBK lender regulations 2026, reg 31 (law register LR-03) |
| Bank or microfinance bank | CBK approval for a material outsourcing, which the draft guideline extends to software as a service, cloud, software development and cyber security services; 14 days' notice for one that is not material; a register of all its providers to CBK by 5 January; annual independent testing, including penetration tests | Draft CBK Prudential Guideline 16 and Guidance Note on third-party providers (Sep and Aug 2026; drafts, to verify against the final texts); docs/compliance.md LC-08 |
| Payment service provider | 30 days' notice to CBK today; prior written approval under the draft Bill | NPS Regulations 2014 (LR-12); draft NPS Bill 2026, cl.30 (LC-07) |
| Sacco | SASRA's minimum terms for system vendors: IT audits twice a year by a reputable audit firm, penetration tests, unrestricted SASRA access, 24/7 monitoring, incident reports within 12 hours, a bank guarantee of 10% of float | SASRA circular SASRA/GG/1/2023 (LC-05; the circular's text still to read) |

## The pack

| # | Item | Asked by | What we supply | Status |
|---|---|---|---|---|
| 1 | Company details: registration, address, tax compliance certificate | Lenders, banks, PSPs, Saccos | Certificates, held by the commercial lead | To prepare |
| 2 | Shareholders, directors and senior officers, with background | Lenders (reg 31(3)(b)), banks | A one-page profile each, held outside git (names never in this repository) | To prepare |
| 3 | Business record | Lenders, banks | The production record: Onit Bank (Collect and the Gateway, 2025 to 2026); KCB since 2021 (CRM, SMS gateway, the USSD platform for digital lending 2022 to 2025, loan-engine integration; work ongoing); National Bank of Kenya since 2021 (SMS gateway and operator connections; shortcodes and USSD in 2026) (docs/customers.md) | Ready, once the contracts confirm the banks may be named (FS-420) |
| 4 | Description of the services outsourced | Every regulator | Each product's own paragraph (its module, §1) and what it never holds | Ready |
| 5 | Licences and registrations | Every regulator | ODPC data processor (LC-01) and PRSP licence (LC-03); ISO 27001 not yet held (LC-04); PSP authorisation needed and being prepared, after a legal opinion on the category (LC-06) | Ready, with the gaps stated |
| 6 | Where data is held, and who else touches it | Banks, lenders, Saccos | Deployment options and hosting (docs/architecture.md §9); subprocessors: hosting partner (candidate, PT-01), SMS route, mobile operators | To prepare: a subprocessor list |
| 7 | Security controls | Every regulator | Architecture §3, §6 and §7: credentials only on the server, in OpenBao; encryption; attribution; audit | To prepare: one security summary |
| 8 | Independent penetration test report | Banks, Saccos, PSPs | An annual test by an independent tester | To prepare: none commissioned yet |
| 9 | Business continuity: tested recovery time and recovery point | Banks, Saccos | Recovery objectives and the last test | To confirm: objectives not yet set |
| 10 | Incident reporting | Saccos (12 hours), PSPs (CBK within 24 hours) | A commitment in the contract | To confirm |
| 11 | Regulator's access to our premises, books, records, systems and staff | Lenders (reg 31(5)), banks, Saccos | A standard contract clause | To prepare, with the legal partner (SD-12) |
| 12 | No use of the institution's data for our own purposes | Banks (draft guideline) | A standard contract clause | To prepare, with the legal partner |
| 13 | Subcontracting only with the institution's approval | Banks (draft guideline) | A standard contract clause | To prepare, with the legal partner |
| 14 | Exit plan: data returned and purged, and support through a handover | Banks (draft guideline), Saccos | A standard exit schedule | To prepare |
| 15 | Financial statements and insurance (professional indemnity, cyber) | Banks, Saccos | Latest audited statements; insurance certificates | To confirm: insurance cover not recorded |
| 16 | SASRA bank guarantee of 10% of float | Saccos | Priced and arranged per Sacco | To confirm (LC-05) |

## Open

- Read the final texts of PG 16 and the Guidance Note when CBK issues them,
  and SASRA/GG/1/2023 itself; until then items marked "draft" may move.
- Items 9, 10, 15 and 16 are commitments for the owner.
