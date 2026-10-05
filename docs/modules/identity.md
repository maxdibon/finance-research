---
id: identity
name: Identity — verifying who a person is
kind: shared-service
version: 0.1.0
owner: Solution architect
classification: Internal
audience: [bank, sacco, mfi, psp, imt, fintech]
depends_on: [access, rails, messaging, financial-crime]
consumed_by: [collect, gateway, mfi, sacco, escrow, crb, core, omni-channel, financial-crime]
review_ids: [FS-088, FS-090, FS-098, FS-109, FS-193, FS-202, FS-203, FS-204, FS-205, FS-329, FS-340, FS-341, FS-382, FS-392, FS-415, FS-431, FS-448, FS-453]
last_reviewed: 2026-10-05
---

# Identity — verifying who a person is

## 1 · In one paragraph

Identity is designed to verify that a person or a business is who they
claim to be, before an account opens, a loan is approved or an escrow is
funded. In Kenya it will start with the national population register,
NPDM (formerly IPRS), for national IDs, passports and alien IDs, and
business registration (BRS) in v1 (FS-415). Document checks, liveness and
face match and tax PIN checks will follow. Phone-number ownership, checked
against the name the operator holds, is built: it gated account opening
at Onit Bank (ID-05, FS-392). In v1 each account will also be bound to its
ID, phone number and SIM, so a swapped or recycled number cannot take it
over (ID-12 to ID-14, FS-453). Each product decides which checks it needs.
**It will keep the result and the evidence, never a copy of the
register,** stored on the person in their authority — the core, Fineract
or Odoo (docs/architecture.md §2, §6). Each country brings its own
registers (FS-109).

## 2 · Who it is for

**Segments:** every product that onboards a person or a business: collect,
gateway (merchants), mfi, sacco, escrow, crb (matching a person to their
bureau record).

**The problem, concretely:** institutions want KYC captured and checked
digitally, with a record that shows each check happened. The MFI PRD's
discovery found lenders working towards a digital record, a completeness
check and per-product document requirements (MFI PRD §2, problem 5).

**People who use it:**

| Role | What they need from it |
|---|---|
| Loan officer or onboarding agent | The check, inline, during the conversation; what is missing |
| Compliance officer | What was checked, against which source, when, with what result |
| The person being verified | A short process on their phone, and to be told why if it fails |
| Partner institution | Evidence it can rely on for its own KYC obligations |

## 3 · What it does

ID-05 is **Built**; the rest are Designed or Planned. Sanctions and PEP
screening, once ID-08, moved to financial-crime FC-05 and FC-06 (FS-431).

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| ID-01 | National register lookup (NPDM, formerly IPRS): national ID, passport, alien ID | Designed | Kapu technical documentation (account opening); MFI PRD FR-2.1. Coverage of passports, alien and refugee IDs disputed by a reviewer; to confirm against NPDM and Maisha (FS-329, FS-341). Integration not final at 8 Jun — FS-088. Direct access open to private firms: KES 50,000 to connect, KES 20 a check (partners PT-29, FS-382) | 1 |
| ID-02 | Document checklist per product, with a completeness gate | Designed | MFI PRD FR-2.2 to FR-2.4 | 1 |
| ID-03 | Re-verification when documents expire, for repeat customers | Designed | MFI PRD FR-1.4 | 1 |
| ID-04 | Liveness and face match against the ID photo | Planned | FS-204 — vendor not chosen; candidates Smile ID (PT-30), MetaMap (PT-33, owned by Incode since June 2024), Spin Mobile (PT-36) and Sumsub (PT-37); FS-340, FS-382 | 2 |
| ID-05 | Phone-number ownership: the number checked against the name the operator holds for it | Built | Ran in production at Onit Bank, Feb 2025 to Jun 2026, as the gate on collect CO-02's account opening, under the bank's own agreements with Safaricom and Airtel (FS-390, FS-392). A new customer needs its own agreements, or Dibon's (compliance LC-13). For M-Pesa numbers, Safaricom's Hakikisha also returns the registered name (rails RL-21, Planned; FS-387) | 1 |
| ID-06 | Tax PIN validation | Planned | FS-205 | 2 |
| ID-07 | Business verification: registration, directors, beneficial owners | Planned | FS-090. Owner, 2026-10-05: business registration (BRS) moves to v1 (FS-415) | 1 |
| ID-09 | Registers in other countries, per country | Planned | FS-109 | later |
| ID-10 | The result, its source reference and the evidence kept; never a copy of the register's record | Planned | docs/architecture.md §6 | 1 |
| ID-11 | Phone-number ownership by a one-time code sent to the number | Planned | FS-205. Split from ID-05; no record shows it ran | 1 |
| ID-12 | Each account bound at enrolment to the ID number, the phone number and the SIM's IMSI; the phone number alone is never the identity | Planned | FS-448, FS-453 | 1 |
| ID-13 | An IMSI changed since enrolment, from a swap or a recycled number, holds money movement and credential resets until the customer is re-verified (financial-crime FC-02; rails RL-22) | Planned | FS-448, FS-453. The subscriber regulations do not address recycling (law register LR-22): it is each operator's practice | 1 |
| ID-14 | The operator's name check (ID-05) re-run on a schedule and whenever a dormant account wakes; a mismatch freezes the mobile channel until the customer is re-verified | Planned | FS-448, FS-453 | 1 |

**Retired ids:** ID-08, moved to financial-crime FC-05 and FC-06 (FS-431). A retired id is never reused.

## 4 · Where it sits

**Depends on:** access (who ran the check), rails (Hakikisha, RL-21; the
SIM-swap check, RL-22), messaging (one-time codes, ID-11),
financial-crime (holds on an IMSI change, FC-02).
**Used by:** collect, gateway, mfi, sacco, escrow, crb, core,
omni-channel, financial-crime.

**Who holds which record** (docs/architecture.md §2):

| Record | System of record | This module |
|---|---|---|
| The person and their KYC status | Their authority: the core, Fineract, Odoo | Writes the result there; holds no party record of its own |
| National register data | NPDM (formerly IPRS) and the other registers | Queries; keeps the reference and the fields the check compared |
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
   NPDM      documents    liveness +    phone        tax PIN /
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
| Mobile-network operators (Safaricom, Airtel) | read | the operator's name for the number | Built (ID-05) at Onit Bank, under its agreements; a new customer needs its own or Dibon's — compliance LC-13 |
| Safaricom Hakikisha | read | Daraja API | Planned (ID-05) — rails RL-21 |
| Operators' SIM-swap and IMSI checks | read | operator API | Planned (ID-12, ID-13) — rails RL-22; compliance LC-13 |
| One-time code by SMS | out | messaging | Planned (ID-11) |
| Tax authority PIN check | read | KRA GavaConnect API | Planned (ID-06) — partners PT-35 |
| Business registration service (BRS) | read | API, if available | Planned (ID-07), phase 1 — FS-205, FS-415 |
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
- **A failed or unavailable check says so.** A register (NPDM) outage is a
  pending check, never a pass.
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
- Kapu Pay strategy discussion, 8 Jun 2026 (anonymised) — the national register dependency (NPDM, formerly IPRS).
- docs/architecture.md §2, §6.
