---
id: cbk-ict-pack-2026-11-05
name: The ICT pack for the Central Bank, for Kapu MFI and Roan Capital · Max's research, 5 November 2026
kind: review
status: draft
released: unreleased
owner: Solution architect
classification: Internal
review_ids: [FS-1204, FS-1203, FS-1194]
last_reviewed: 2026-11-13
---

# The ICT pack for the Central Bank · 5 November 2026

**Research by Max (CI/CD engineer, the operations lead's deputy),**
drafted with his Claude (FS-1204). Max asked for "two separate
documents in dibon colors brand that we can share with CBK", one for
the MFI platform and one for Roan Capital, answering item c(iv) of
CBK's list of policies and documents to be submitted (Bank Supervision
Department, September 2026); then for a check of an AI-written list of
"what CBK evaluates", and for what it showed missing to be added.

**What was read:** CBK's list (Max's screenshot); LR-03; architecture
README §2, §3, §7, §9; deployment §1 and §2; flows §1; platform-security
SE-01 to SE-27; settings for Keycloak and PostgreSQL; observability;
the documents register; deployments/roan-capital-production; mfi.

**Not read:** any CBK cybersecurity guidance (none is in the law
register; web search was not available); Roan Capital's own policies.
Nothing here is legal advice.

**The short answer:** two packs, Word and PDF in Dibon's brand, 22 pages
each, in Max's Roan_Capital folder: *Kapu MFI: ICT Policy and System
Description* (the lender's name a placeholder) and *Roan Capital: ICT
Policy and System Description*. Each answers c(iv) in full; c(i) to
c(iii) are the lender's to attach. The system is described as
designed, and says so: most controls are Planned (platform-security
§3), so the pack commits to them before go-live and the independent
assurance confirms them.

---

## 1 · What each pack holds

| § | Section | Drawn from |
|---|---|---|
| 1 | Where each CBK item is answered; the pack's status | CBK's list |
| 2 | Governance: who is responsible; review, exceptions, outsourcing (reg 31) | LR-03; architecture README §3, §9 |
| 3 | The ICT system: components, hosting and tenancy, users and sign-in, outside parties, data classes, recovery objectives | architecture; deployment; the Roan Capital deployment |
| 4 | Systems architecture diagram: front-end apps, support systems, back-end infrastructure | instance; deployment §1 |
| 5 | Data flow diagram, eleven numbered steps from the apps to the databases | flows; the Roan Capital deployment §2 |
| 6 | ICT Policy: CBK's fourteen areas, 6.1 to 6.14, each a table of numbered requirements with how the platform meets them | platform-security; settings; github spec |
| 7 | Independent assurance: scope, a blank Annex 1 | SE-17 |
| A | Open items before submission | — |
| B | Sources | — |

## 2 · Choices the pack makes that the design does not

Each is a commitment; Eric or the institution confirms it before the
pack is sent.

| # | Choice | Where |
|---|---|---|
| 1 | Vulnerabilities fixed in 7, 30 and 90 days by severity (SE-11 says only "within set times") | IS-07 |
| 2 | Accounts unused for 90 days disabled | NA-05 |
| 3 | TLS 1.2 or higher | EN-01 |
| 4 | Emergency changes reviewed within two business days | CC-05 |
| 5 | The services agreement provides a full data export and an orderly exit | 6.14 |

## 3 · The AI-written list, checked

Max brought a list from another assistant of "what CBK evaluates" in
each area, with "specific policy language your team must document".
Checked against CBK's list and LR-03:

- **Not CBK's.** CBK's list names topics only; it sets no standards,
  timelines or wording. The list says twelve areas; CBK lists fourteen.
- **Not found:** the "CBK Cybersecurity Guidelines/Framework" it cites.
  CBK's cybersecurity guidance notes are, as far as known, for banks
  (2017) and payment service providers (2019); none is in the law
  register. To check if the list names a document.
- **Our own figures echoed back:** its 7, 30 and 90 days are §2's choice 1.
- **Wrong:** ISO/IEC 27001 is a management-system standard, not a
  hardening baseline; CIS Benchmarks are.
- **Beyond the design, not adopted:** AES-256 named, and phone and
  account numbers encrypted or hashed field by field. SE-27 encrypts
  Restricted fields; phone and account numbers are Confidential.
- **Already in the pack:** separate environments, hardening, data
  classes, round-the-clock monitoring, zones denied by default, the
  firewall and flood protection, callback allowlists, no schema rights,
  just-in-time access, the ledger written by one path, synchronous
  standbys, TLS everywhere.

## 4 · Added to both packs from the check

| Id | Added | Why |
|---|---|---|
| SD-07 | Developers have no standing access to deploy to or change production; changes only through 6.12 | True of the design (Flux pulls; README §9), unsaid in 6.1 |
| IS-08 | A register of IT assets, generated from the infrastructure code and the deployment record, reviewed quarterly | The pack kept none |
| §2.2 | Outsourcing the platform to Dibon is material (reg 31): CBK told thirty days before; the decision to lend, management, the board, compliance and the loan book stay with the lender | Missed by both the pack and the list; LR-03 reg 31 |
| A | "CBK told thirty days before the platform is outsourced to Dibon (reg 31)" | An open item before go-live |
