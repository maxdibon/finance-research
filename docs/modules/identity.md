---
id: identity
name: Identity — verifying who a person is
kind: shared-service
version: 0.1.0
owner: Solution architect
classification: Internal
audience: [bank, sacco, mfi, psp, imt, fintech]
depends_on: [access]
consumed_by: [collect, gateway, mfi, sacco, escrow, crb]
review_ids: [FS-088, FS-090, FS-098, FS-109, FS-193, FS-202, FS-203, FS-204, FS-205, FS-329, FS-340, FS-341]
last_reviewed: 2026-10-01
---

# Identity — verifying who a person is

## 1 · In one paragraph

Identity verifies that a person or a business is who they claim to be,
before an account opens, a loan is approved or an escrow is funded. In
Kenya it starts with IPRS, the national population register, for national
IDs, passports and alien IDs. It adds document checks, liveness and face
match, phone-number ownership, tax PIN and business registration checks.
Each product decides which checks it needs. **It keeps the result and the
evidence, never a copy of the register.** The result is stored on the
person in their authority — the core, Fineract or Odoo (docs/architecture.md
§2, §6). Each country brings its own registers (FS-109).

## 2 · Who it is for

**Segments:** every product that onboards a person or a business: collect,
gateway (merchants), mfi, sacco, escrow, crb (matching a person to their
bureau record).

**The problem, concretely:** KYC is collected on paper, checked by eye, and
filed where nobody can confirm it happened. The MFI PRD's discovery found
no digital record, no completeness check and no per-product document
requirements (MFI PRD §2, problem 5).

**People who use it:**

| Role | What they need from it |
|---|---|
| Loan officer or onboarding agent | The check, inline, during the conversation; what is missing |
| Compliance officer | What was checked, against which source, when, with what result |
| The person being verified | A short process on their phone, and to be told why if it fails |
| Partner institution | Evidence it can rely on for its own KYC obligations |

## 3 · What it does

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| ID-01 | National register lookup (NPDM, formerly IPRS): national ID, passport, alien ID | Designed | Kapu technical documentation (account opening); MFI PRD FR-2.1. Coverage of passports, alien and refugee IDs disputed by a reviewer; to confirm against IPRS and Maisha (FS-329, FS-341). Integration not final at 8 Jun — FS-088. Direct access open to private firms: KES 50,000 to connect, KES 20 a check (partners PT-29, FS-382) | 1 |
| ID-02 | Document checklist per product, with a completeness gate | Designed | MFI PRD FR-2.2 to FR-2.4 | 1 |
| ID-03 | Re-verification when documents expire, for repeat customers | Designed | MFI PRD FR-1.4 | 1 |
| ID-04 | Liveness and face match against the ID photo | Planned | FS-204 — vendor not chosen; candidates Smile ID (PT-30) and MetaMap (PT-33), FS-340 | 2 |
| ID-05 | Phone-number ownership: a one-time code, and the name the operator holds for the number | Planned | FS-205. For M-Pesa numbers, Safaricom's Hakikisha returns the registered name (rails RL-21, FS-387) | 1 |
| ID-06 | Tax PIN validation | Planned | FS-205 | 2 |
| ID-07 | Business verification: registration, directors, beneficial owners | Planned | FS-090 | 2 |
| ID-08 | Sanctions and politically-exposed-person screening | Planned | FS-098. May sit in a compliance service instead | 2 |
| ID-09 | Registers in other countries, per country | Planned | FS-109 | later |
| ID-10 | The result, its source reference and the evidence kept; never a copy of the register's record | Planned | docs/architecture.md §6 | 1 |

## 4 · Where it sits

**Depends on:** access (who ran the check).
**Used by:** collect, gateway, mfi, sacco, escrow, crb.

**Who holds which record** (docs/architecture.md §2):

| Record | System of record | This module |
|---|---|---|
| The person and their KYC status | Their authority: the core, Fineract, Odoo | Writes the result there; holds no party record of its own |
| National register data | IPRS and the other registers | Queries; keeps the reference and the fields the check compared |
| Verification log: who checked whom, when, why, against what, result | **Identity service** | Holds. Append-only |
| Evidence: document images, liveness captures | The institution's document store | References by id. Biometric data handled as sensitive (FS-203) |

**What this module never stores:** a copy of the register's record, or a
biometric template beyond what the check and its evidence require.

**Under each ledger mode:** verification does not touch the ledger. In
integrated mode the result is written to the institution's core; in native
mode, to Fineract.

## 5 · How it works

```
  product: "open account" / "new borrower" / "new merchant"
                       |
                       v
         checks the product requires (configured per product)
                       |
     +-----------+-----+------+------------+------------+
     |           |            |            |            |
   IPRS      documents    liveness +    phone        tax PIN /
   lookup    checklist    face match    ownership    business reg.
     |           |            |            |            |
     +-----------+-----+------+------------+------------+
                       |
            every result logged: source, time, operator
                       |
          all mandatory checks passed? ---- no --> blocked, with
                       |                           what is missing
                      yes
                       v
       result written to the person's authority (core / Fineract /
       Odoo); the register's data is not copied
```

## 6 · Rails and integrations

| Rail / system | Direction | Feed | Status |
|---|---|---|---|
| NPDM, formerly IPRS (Kenya) | read | API | Designed (ID-01). Direct access by MOU — partners PT-29, FS-202 |
| Liveness and face-match vendor | read | API or SDK | Planned (ID-04) — partners.md SD-11 |
| Mobile-network operators | read | Hakikisha name lookup (Safaricom); one-time code | Planned (ID-05) — rails RL-21 |
| Tax authority PIN check | read | KRA GavaConnect API | Planned (ID-06) — partners PT-35 |
| Business registration service | read | API, if available | Planned (ID-07) — FS-205 |
| Other countries' registers | read | per country | Planned (ID-09) |

## 7 · Regulatory position

- **Custody:** none.
- **Access to the national register (NPDM, formerly IPRS)** needs an agreement: an MOU, open to private firms (FS-382). Whether it is held by each
  institution or by Dibon on their behalf is open — FS-202.
- **Biometric data is sensitive personal data** under the Data Protection
  Act. Liveness and face match need a lawful basis, a data protection
  impact assessment, and strict retention — FS-203.
- **KYC obligations stay with the institution.** We perform and evidence
  checks; the institution remains responsible for its customers.
- **Data:** ID numbers, register results and biometric captures are
  Restricted.

## 8 · Controls

- **Gates cannot be overridden** where the product says so (MFI PRD
  FR-2.4).
- **Every check is attributed** to the person who ran it, with the purpose
  recorded first.
- **A failed or unavailable check says so.** An IPRS outage is a pending
  check, never a pass.
- **Minimum retention.** Evidence is kept as long as the KYC obligation
  requires, and no longer.

## 9 · Deployment

Part of the shared platform, on Liquid's Azure Stack (FS-032). Register
connections come from in-country deployments.

## 10 · What it does not do

- Log anyone in. That is access.
- Decide whether to accept a customer. It reports; the institution
  decides.
- Hold the register of customers or members.

## 11 · Open questions

FS-088, FS-090, FS-098, FS-109, FS-202, FS-203, FS-204, FS-205.

## 12 · Sources

- Kapu Pay Technical Documentation, v1.0, Apr 2026 — account opening.
  *Derived, not reproduced.*
- Kapu Pay MFI PRD section, Draft v0.2, Jun 2026 — FR-1.4, FR-2, §2.
- Kapu Pay strategy discussion, 8 Jun 2026 (anonymised) — IPRS dependency.
- docs/architecture.md §2, §6.
