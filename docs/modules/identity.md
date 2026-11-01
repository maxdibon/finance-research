---
id: identity
name: Identity verification — who a person or business really is
kind: shared-service
status: living
law: mixed
released: 2026.10.16
owner: Solution architect
classification: Internal
audience: [bank, sacco, mfi, psp, imt, fintech]
depends_on: [access, rails, messaging, financial-crime, sme-recon, mandates]
consumed_by: [collect, gateway, mfi, sacco, escrow, crb, core, omni-channel, financial-crime, access, business-suite, decisioning]
review_ids: [FS-088, FS-090, FS-098, FS-109, FS-193, FS-202, FS-203, FS-204, FS-205, FS-329, FS-340, FS-341, FS-382, FS-392, FS-415, FS-431, FS-448, FS-453, FS-500, FS-503, FS-514, FS-525, FS-528, FS-530, FS-532, FS-536, FS-537, FS-544, FS-549, FS-550, FS-551, FS-555, FS-556, FS-557, FS-560, FS-562, FS-565, FS-566, FS-568, FS-582, FS-591, FS-1008, FS-1018, FS-1020, FS-1022, FS-1028, FS-1070, FS-1077]
last_reviewed: 2026-11-01
---

# Identity verification — who a person or business really is

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
or Odoo (docs/architecture/README.md §2, §6). Each country brings its own
registers (FS-109).

**Not access.** Access (Keycloak) decides who is logged in and what they
may do; this module establishes who the person is. They meet at recovery:
access resets nothing until this module has re-verified the person
(access AC-15). Renamed from "Identity" (FS-514).

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
| ID-01 | National register lookup (NPDM, formerly IPRS): national ID, passport, alien ID. Where neither the register nor a vendor covers a document (refugee IDs, likely), a manual route: the officer sees the original, the scan goes to the vault (ID-15), a second person approves through mandates, and the record is marked verified manually, which caps the tier it can reach (ID-19). Manual verifications are reported per officer and per branch from the verification log, until the governance view (insights IN-18, phase 2). A mismatch is never sent down the manual route: it is referred to the compliance officer as a ticket in a restricted team of the institution's Odoo Helpdesk (business-suite BS-01), until case management (financial-crime FC-08, phase 2) | Designed | Kapu technical documentation (account opening); MFI PRD FR-2.1. Coverage of passports, alien and refugee IDs disputed by a reviewer; to confirm against NPDM and Maisha (FS-329, FS-341). Manual route: owner, 2026-10-06 (FS-544). Integration not final at 8 Jun — FS-088. Direct access open to private firms: KES 50,000 to connect, KES 20 a check (partners PT-29, FS-382) | 1 |
| ID-02 | Document checklist per product, with a completeness gate | Designed | MFI PRD FR-2.2 to FR-2.4 | 1 |
| ID-03 | Re-verification when documents expire, for repeat customers | Designed | MFI PRD FR-1.4 | 1 |
| ID-04 | Liveness and face match against the ID photo | Planned | FS-204 — vendor not chosen; candidates Smile ID (PT-30), Prembly (PT-53), MetaMap (PT-33, owned by Incode since June 2024), Spin Mobile (PT-36) and Sumsub (PT-37); FS-340, FS-382 | 2 |
| ID-05 | Phone-number ownership: the number checked against the name the operator holds for it | Built | Ran in production at Onit Bank, Feb 2025 to Jun 2026, as the gate on collect CO-02's account opening, under the bank's own agreements with Safaricom and Airtel (FS-390, FS-392). A new customer needs its own agreements, or Dibon's (compliance LC-13). For M-Pesa numbers, Safaricom's Hakikisha also returns the registered name (rails RL-21, Planned; FS-387) | 1 |
| ID-06 | Tax checks: KRA PIN validation, and whether a tax compliance certificate is valid, through KRA GavaConnect | Planned | FS-205; owner, 2026-10-06: the certificate added (FS-536) | 2 |
| ID-07 | Business verification by registration number: status, directors and shareholders fetched from the business registry (the content of a CR12), beneficial owners as declared and checked; the company uploads only what cannot be fetched, and its eCitizen login is never held | Planned | FS-090; owner, 2026-10-06 (FS-536). Depends on BRS access, FS-205. Owner, 2026-10-05: business registration (BRS) moves to v1 (FS-415). Every company lodges its register of beneficial owners with the Registrar (Companies Act s.93A, law register LR-34), so the registry holds them; whether its API returns them is to confirm (FS-566). Otherwise the Registrar discloses them to a financial institution on Form BOF6 and a fee (Beneficial Ownership Information Regulations reg 14(1)(c), LR-35); a beneficial owner is a natural person with at least ten percent of the shares or votes, the power over the board, or significant influence or control (reg 3(2)) (FS-568) | 1 |
| ID-09 | Registers in other countries, per country | Planned | FS-109 | later |
| ID-10 | The result, its source reference and the evidence kept; never a copy of the register's record. The cost of each query logged against the check, per source | Planned | docs/architecture/README.md §6. Owner, 2026-10-06: in R1, with the cost per query (FS-562; Roan Capital RC-02) | 1 |
| ID-11 | Phone-number ownership by a one-time code sent to the number | Planned | FS-205. Split from ID-05; no record shows it ran. Owner, 2026-10-06: in R1 (FS-562), the code sent through Dibon's messaging service (messaging MS-02, FS-565) | 1 |
| ID-12 | Each account bound at enrolment to the ID number, the phone number and the SIM's IMSI; the phone number alone is never the identity | Planned | FS-448, FS-453 | 1 |
| ID-13 | An IMSI changed since enrolment, from a swap or a recycled number, holds money movement and credential resets until the customer is re-verified (financial-crime FC-02; rails RL-22) | Planned | FS-448, FS-453. The subscriber regulations do not address recycling (law register LR-22): it is each operator's practice | 1 |
| ID-14 | The operator's name check (ID-05) re-run on a schedule and whenever a dormant account wakes; a mismatch freezes the mobile channel until the customer is re-verified | Planned | FS-448, FS-453 | 1 |
| ID-15 | Document vault (the design: [vault](../specs/vault.md), FS-1070) for KYC and KYB evidence and collateral documents, one per institution in its own instance: object storage (Blob on Azure Stack; Ceph through Rook on-premises), each file encrypted under keys in OpenBao, checksummed, locked for its retention and then deleted; every view logged. Received in R1 at the branch console and by a single-use upload link sent by SMS or email; files type-checked, scanned for malware (ClamAV, run unmodified as a separate service; Sophos or another commercial engine where the customer pays for it, possibly through Liquid, FS-525), images re-encoded | Planned | Owner, 2026-10-06 (FS-500). Other channels: field app (omni-channel OC-17), WhatsApp sends the link, never the image (OC-16, privacy PR-16); migration (mfi MF-16). Retention and class per document type: docs/governance/documents.md (FS-537) | 1 |
| ID-16 | Document intake by API, through the same pipeline as ID-15: SMEs from their Odoo through the SME-to-lender exchange; institutions and vendors (a referring bank, another lender, an identity vendor) through the partner API with mutual authentication (access AC-04); each sender authenticated, consent recorded, files checked, scanned, classified, fingerprinted and filed against the application, the checklist (ID-02) updated. Reliance on another institution's checks only where it is itself supervised (POCAML Regulations reg 33), and the lender stays responsible | Planned | Owner, 2026-10-06 (FS-528, FS-530) | 2 |
| ID-17 | Sharing documents out: to a person, a single-use, short-lived link to our own page, opened with a one-time code to the bound phone, after which they may download or share their own document as they choose; to an organisation, the portal, the API, or SFTP for bulk files (check-off and settlement files, regulator and audit exports); every share and download logged | Planned | Owner, 2026-10-06 (FS-532); architecture §7 | 1 |
| ID-19 | KYC tiers: each customer's tier set from the evidence held, never from a request: tier 1 a register match and the operator's match on the customer's own SIM; tier 2 adds a photo check (liveness, a document check, or the manual route, flagged) and the KRA PIN; tier 3 adds source of funds and enhanced due diligence, and business checks for companies. Loan, deposit and transaction limits and rules per tier and product, set by each institution under maker-checker, and read by every limit check. A tier falls on an event (a SIM swap, an expired document, a mismatch when a check is re-run, a screening hit) and rises only with new evidence; screening at every tier. Tier 1 rests on simplified due diligence, which needs the institution's own risk assessment (POCAML Regulations reg 21). Remote self-sign-up into tier 1 by USSD waits for phase 2 (omni-channel OC-08, FS-549) | Planned | Owner, 2026-10-06: in R1 (FS-550, FS-551). CBK lender regulations reg 63(2) and (3) for remote onboarding | 1 |
| ID-20 | An identity simulator for tests and demos: the national register and each verification vendor answering a match, a mismatch, not found, deceased, slow and down, for made-up people only; never a real person's data | Planned | Owner, 2026-10-06 (FS-560); as rails RL-17 does for the rails; docs/delivery/testing.md | 1 |
| ID-21 | KYC requirements by kind of account, set by each institution under maker-checker: an individual's main account, a digital account opened from the phone, a company's main account, a partner company's sub-accounts, each with its evidence and the tier it reaches; the checklist (ID-02) and the tier (ID-19) read from it | Planned | FS-1008; a microfinance bank's own requirements (FS-999) | 2 |
| ID-22 | KYB in tiers, for companies and for partners: tier 1 the registry's record and the tax PIN; tier 2 adds the directors and beneficial owners, each identified and screened; tier 3 adds audited accounts, tax compliance and enhanced due diligence; a company's limits and products by tier, as ID-19 for people | Planned | FS-1008; ID-07; FC-05; lending-service §5 | 2 |
| ID-23 | A mobile operator's KYC, shared with the customer's consent, taken as evidence and labelled with its source: it may confirm tier 1, never stand alone above it | Planned | FS-1008; an operator's agreement shares KYC only after consent (FS-1002) | 2 |
| ID-24 | Moving up a tier: the customer is told what the next tier needs and why (a higher limit, a product), gives the evidence in the app, on USSD with an officer, or at a branch; the tier rises when the evidence is checked, and the customer is told; journey JN-22 | Planned | FS-1008 | 2 |
| ID-25 | One identity per person, per institution, in the realm for outside people, bound to ID number, phone and SIM (ID-12), with one credential; each role a profile (themselves, a business, a partner) held as a membership of an access organisation and granted by its owner: a business's people by its administrators under its mandate, its first administrators those its board resolution names, checked against the registry's directors; a partner's people by its administrator, within limits the institution approved; every act in one profile, shown and audited; the KYC tier the identity's, a business's KYB tier its own | Planned | FS-1013, FS-1018; channels §2 | 2 |
| ID-26 | A staff member's staff identity and their customer identity, if they have one, kept apart and linked by ID number for conflict checks only: the approval engine refuses a staff member deciding a request in which they are the borrower, a guarantor or a business's officer; nothing else crosses | Planned | FS-1018, FS-1020; access §3; privacy PR-20 | 1 |
| ID-27 | Documents in every channel, from the vault through one interface: To sign, Signed, Statements and receipts, Notices, in each profile by its rights (a person's own; a business's for its people; a partner's in its portal); downloads as PDFs, logged; blanks for the paper route on the institution's website | Planned | FS-1022; templates/onboarding-pack.md §3 | 2 |
| ID-18 | Evidence from source, with the business's consent: statements taken from its SME Recon feeds, its bank's API or its M-Pesa shortcode (rails RL-20) instead of files that can be edited; licences checked against the regulators' published lists | Planned | Owner, 2026-10-06 (FS-536). Would close Roan Capital's statement gap (RC-05) and feed credit scoring (decisioning DE-06) | 2 |

**Retired ids:** ID-08, moved to financial-crime FC-05 and FC-06 (FS-431). A retired id is never reused.

## 4 · Where it sits

**Depends on:** access (who ran the check), rails (Hakikisha, RL-21; the
SIM-swap check, RL-22), messaging (one-time codes, ID-11),
financial-crime (holds on an IMSI change, FC-02), sme-recon (statements
from source, ID-18), mandates (the second approval on a manual check,
ID-01).
**Used by:** collect, gateway, mfi, sacco, escrow, crb, core,
omni-channel, financial-crime, access (re-verification before a
reset or a new device, AC-15) and business-suite (company registers
checked against the business registry, BS-18), and decisioning
(statements in the vault, ID-15; the KYC tier, ID-19).

**Who holds which record** (docs/architecture/README.md §2):

| Record | System of record | This module |
|---|---|---|
| The person and their KYC status | Their authority: the core, Fineract, Odoo | Writes the result there; holds no party record of its own |
| National register data | NPDM (formerly IPRS) and the other registers | Queries; keeps the reference and the fields the check compared |
| Verification log: who checked whom, when, why, against what, result | **Identity service** | Holds. Append-only |
| Evidence: document images, liveness captures | **The document vault** (ID-15) | Holds, in each institution's instance. Biometric data handled as sensitive (FS-203) |

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

### Providers: aggregators and direct sources

FS-1077. **Each check is one contract in our words, and each provider an
adapter behind it,** so a provider is added, changed or dropped without
the products noticing (architecture §6, "replaceable behind a stable
contract").

| Check | Direct sources | Aggregators that document it |
|---|---|---|
| National ID, passport, alien ID (ID-01) | NPDM, formerly IPRS (PT-29), by its agreement (FS-202) | Prembly (PT-53), Smile ID (PT-30), MetaMap (PT-33, national ID only) |
| Liveness and face match (ID-04) | None | Prembly, Smile ID, MetaMap |
| Phone number (ID-05) | The operators: the registered name, or Safaricom Hakikisha | Smile ID matches a number to a national ID; Prembly returns the carrier only |
| KRA PIN and tax compliance (ID-06) | KRA GavaConnect (PT-35) | Prembly; Smile ID (the PIN from an ID number only) |
| A business's registration (ID-07) | The business registry, where it offers an API (FS-205) | Prembly, Smile ID |
| PEP and sanctions (financial-crime FC-05, FC-06) | Published lists | Prembly, Smile ID |

1. **Routed per institution and per check,** set at onboarding (OB-COM-27):
   a primary and a fallback. A direct source comes first where the
   institution, or Dibon for it, holds the agreement; an aggregator where
   not, or when the direct source is down.
2. **Every result names its provider,** with the provider's reference,
   the time and the cost, on the record of the check (FS-584).
3. **A fallback is a second request only when the first fails** or the
   provider is down; a person's details are never sent to two providers
   just to compare them (LQ-35). Providers are compared on the simulator
   (ID-20) and with team members' own details, by consent
   (delivery/prembly-production-test).
4. **A provider joins once** its adapter passes the same contract tests
   as the others, against the simulator, and its terms pass our partner
   rules: where data is held, the breach notice, sub-processors
   (partners register). Each is named as a processor in the
   institution's data processing agreement and privacy notice (OB-COM-04).
5. **Its cost is passed through,** per provider and per check, itemised
   (FS-331).

### The identity model

FS-1018, FS-1028. Who someone is, and what they may do, in four parts:

1. **One identity per person, per institution.** A person has one
   identity at each institution they deal with, in the realm for outside
   people (access-keycloak §3), bound to their ID number, phone and SIM
   (ID-12), with one credential. Never one identity across institutions:
   each institution's customers are its own (ID-25).
2. **Each role a profile, granted by its owner.** Themselves, a business
   they act for, a partner they work for: each profile a membership of
   an access organisation, granted by whoever owns it. A business's
   people are granted by its administrators under its mandate, its first
   administrators those its board resolution names (onboarding pack B1),
   checked against the registry's directors; a partner's people by its
   administrator, within the limits the institution approved. Every act
   is done in one profile, shown on screen and audited (ID-25).
3. **A tier belongs to the identity, or to the business.** A person's
   KYC tier (ID-19, ID-21 to ID-24) goes with them into every profile; a
   business's KYB tier (ID-22) is its own, whoever acts for it.
4. **Staff apart.** A staff member signs in to the staff realm, never
   with their customer identity. The two are linked by ID number for
   conflict checks only: the approval engine refuses a staff member
   deciding a request in which they are the borrower, a guarantor or a
   business's officer (ID-26, in R1; approval-engine rule 2; privacy
   PR-20). Nothing else crosses.

**One person, one identity at each institution** (part 1): each
institution runs its own instance, and nothing joins the two.

```
                          one person
                (ID number, phone and SIM)
                  /                      \
                 v                        v
   +---------------------------+  +---------------------------+
   | Institution A             |  | Institution B             |
   | realm for outside people  |  | realm for outside people  |
   |   one identity            |  |   one identity            |
   |   one credential: a code  |  |   one credential: a code  |
   |     to the bound phone    |  |     to the bound phone    |
   |   its own KYC tier        |  |   its own KYC tier        |
   +---------------------------+  +---------------------------+
                  never joined: each institution's
                  customers, and their data, are its own
```

**One identity, several profiles** (parts 2 and 3): the person signs
in once, chooses a profile, and acts in it; the screen shows which, and
the audit records it.

```
                  identity at Institution A
               KYC tier: the person's, in every profile
                              |
          +-------------------+----------------------+
          |                   |                      |
          v                   v                      v
   +-------------+   +--------------------+   +---------------------+
   | Me          |   | A business         |   | A partner           |
   | own loans,  |   | role: maker,       |   | role: field agent,  |
   | savings,    |   |  approver, viewer  |   |  supervisor, admin  |
   | documents   |   | KYB tier: the      |   | limits: those the   |
   |             |   |  business's own    |   |  institution set    |
   +-------------+   +--------------------+   +---------------------+
   always there      granted by the           granted by the
                     business's               partner's
                     administrators           administrator

   every act:  who  +  which profile  +  what  +  when   --> audit
```

**Who grants what** (part 2): authority runs down from a document the
owner signed, never from a request typed into a screen.

```
   A business                              A partner
   ----------                              ---------
   board resolution (onboarding B1)        partner agreement (P1),
     names the first administrators          approved by the institution
               |                             with its limits
               |  checked against the                 |
               |  registry's directors                v
               v                           letter naming its
   administrators                            administrators (P3)
               |                                      |
               |  grant and withdraw,                 |  grant within the
               |  within the mandate (B2)             |  institution's limits
               v                                      v
   the business's people:                  field agents, supervisors:
   makers, approvers, viewers              each a profile of their
   (each a profile of their                own identity
   own identity)
```

**Staff apart** (part 4, ID-26, in R1):

```
   staff realm                               realm for outside people
   +------------------------+                +------------------------+
   | staff identity         |                | customer identity      |
   | a staff member at work |                | the same person, as a  |
   | staff workspace,       |                | borrower, a guarantor  |
   | Kapu Console           |                | or a business officer  |
   +-----------+------------+                +-----------+------------+
               |                                         |
               +----------- linked by ID number ---------+
                         for conflict checks only
                                    |
                                    v
                       approval engine, rule 2:
             is the person deciding this request also its
             borrower, a guarantor, or an officer of the business?
                     |                               |
                    yes                              no
                     v                               v
             refused (RC-13)                  may decide

   nothing else crosses: no sign-in, no balances, no history
```

**Why this shape** (decisions FS-1018): a login per role hides conflicts
between roles; one identity across institutions joins data two
institutions own; one identity for staff and customer weakens the
separation of duties.

**Where each part is set out:** the realms and organisations in
access-keycloak §3; the apps and their profiles in channels §2; each
profile's documents in ID-27.

## 6 · Rails and integrations

| Rail / system | Direction | Feed | Status |
|---|---|---|---|
| NPDM, formerly IPRS (Kenya) | read | API | Designed (ID-01). Direct access by MOU — partners PT-29, FS-202 |
| Identity aggregators: Prembly, Smile ID, MetaMap and others | read | API, or SDK for liveness | Planned (ID-01, ID-04 to ID-07): several behind one check, §5 "Providers" (FS-1077); partners PT-30, PT-33, PT-53; SD-11 |
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

FS-088, FS-090, FS-109, FS-202, FS-203, FS-204, FS-205.

## 12 · Sources

- Kapu Pay Technical Documentation, v1.0, Apr 2026 — account opening.
  *Derived, not reproduced.*
- Kapu Pay MFI PRD section, Draft v0.2, Jun 2026 — FR-1.4, FR-2, §2.
- Kapu Pay strategy discussion, 8 Jun 2026 (anonymised) — the national register dependency (NPDM, formerly IPRS).
- docs/architecture/README.md §2, §6.

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](../law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 63 | reg 63(2), reg 63(3) | Customer due diligence, identity verified from independent source documents; for a transaction not face to face, the identity document is that of the person actually transacting (63(2)); a guard against impersonation (63(3)) |

**[LR-14](../law/LR-14.md) The Proceeds of Crime and Anti-Money Laundering Regulations, 2023, Legal Notice No. 153 of 2023.** Regulator: The Financial Reporting Centre, with each institution's supervisor. Made under: The Proceeds of Crime and Anti-Money Laundering Act (Cap. 59A). In force: Yes. Version read: as at 2023-11-17, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2023/153/eng@2023-11-17).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 21 | reg 21 | Simplified customer due diligence only where lower risk has been identified by an adequate risk analysis, and never where money laundering or financing of terrorism is suspected, or in a higher-risk scenario |
| reg 33 | reg 33 | Elements of due diligence may be relied on from a third party, under a written agreement, but the institution stays responsible for them |

**[LR-34](../law/LR-34.md) The Companies Act (Cap. 486).** Regulator: The Registrar of Companies. Made under: An Act of Parliament. In force: Yes. Version read: as at 2024-12-27, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2015/17/eng@2024-12-27).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 93A | s. 93A | Every company keeps a register of its beneficial owners, with the details the regulations prescribe, and lodges a copy with the Registrar |

**[LR-35](../law/LR-35.md) The Companies (Beneficial Ownership Information) Regulations, Legal Notice No. 12 of 2020.** Regulator: The Registrar of Companies. Made under: The Companies Act (Cap. 486). In force: Yes. Version read: as at 2023-10-19, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2020/12/eng@2023-10-19).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 3 | reg 3(2) | Every company has a beneficial owner: a natural person who, alone or jointly, directly or indirectly, holds at least ten per cent of the shares or votes, can appoint or remove most of the board, or exercises significant influence or control (3(2)) |
| reg 14 | reg 14(1)(c) | The Registrar may disclose beneficial ownership information to authorities and regulators; and, on Form BOF6 and the fee, to financial institutions, without protected personal information (14(1)(c)) |
