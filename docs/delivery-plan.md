---
id: delivery-plan
name: Delivery plan — phase 1 in releases, in the order customers need them
kind: plan
version: 0.1.0
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-453, FS-470, FS-473, FS-477, FS-490, FS-492, FS-495, FS-500]
last_reviewed: 2026-10-06
---

# Delivery plan — phase 1 in releases

**Why this exists:** phase 1 in the modules is the whole of v1, not a
release (FS-473). On 2026-10-05 it held 218 capability rows: 16 Built, 47
Designed, 155 Planned (computed from the modules' §3 tables). No team
builds that at once. This plan cuts it into releases, each started by a
customer event and finished by a definition of done, so the work in hand
is always what a signed customer needs next.

**Phases and releases:** a capability's *phase* says whether it is in v1
(capped, below);
its *release* says when it is built. A capability is in the earliest
release that needs it.

## The releases

| Release | Started by | Scope | Size |
|---|---|---|---|
| **R1 · Roan Capital's pilot** | Now: Roan Capital is in delivery (customers CU-01) | Everything Roan Capital's delivery map depends on, plus the platform and security minimum for a lender to go live (below) | 48 capabilities from the map (25 Designed, 23 Planned), plus 19 platform and security capabilities |
| **R2 · Collect and the Gateway with a partner bank** | A partner bank signs (partners SD-04, PT-34) | Collect and the Gateway re-platformed from what ran at Onit Bank; Airtel Money and T-Kash; Hakikisha and Pull Transactions; the SIM controls; traceability | Mostly Built or Designed: the Onit record |
| **R3 · SME Recon and the bank channel** | A bank agrees the referral pilot (docs/bank-channel.md) | SME Recon on Odoo and Zoho with bank statement feeds; the business suite for SMEs | SME Recon's phase-1 rows; bank APIs and files (rails RL-07) |
| **R4 · Saccos and Kapu Core** | The first Sacco or core customer signs | Kapu Sacco, Kapu Core, member apps and USSD, the field-officer app | Sacco, Core and omni-channel phase-1 rows |
| **R5 · The rest of v1** | After R1, in the order sales ask | Escrow, CRB, financial crime beyond R1, insights, the remaining platform services | What is left of phase 1 |

## R1 in detail

**From Roan Capital's delivery map** (docs/customers/roan-capital.md, CU-01;
the check keeps the two in step):

- **Lending:** MF-01 to MF-07, MF-10 to MF-15, MF-21 to MF-26, MF-28; land
  titles (MF-18) and programmatic NTSA (MF-05) are phase 2 and wait on
  open answer 5 and the document's exclusions.
- **Approvals:** MD-01, MD-02, MD-05, MD-06, MD-09 (the 3-of-3 committee),
  MD-10, MD-18 (approval from email).
- **Identity:** ID-01, ID-02, ID-07 (business registration), ID-15 (the
  document vault).
- **Core:** KC-01, KC-04, KC-07, KC-08 on Kapu Core (Fineract, PostgreSQL).
- **Money in and out:** RL-07 (bank transfers), with M-Pesa already built
  (RL-03).
- **Reconciliation and evidence:** RO-02, RO-05, RO-16, RO-17, RO-19, RO-24.
- **Access:** AC-05, AC-09.
- **Business suite:** BS-01 (CRM for leads).
- **Financial crime:** FC-05 (sanctions screening), FC-12 (records).

**Build specifications** for R1 live in docs/specs/: the lender rules
([specs/lender-rules.md](specs/lender-rules.md)) and the approval engine
([specs/approval-engine.md](specs/approval-engine.md)); the sanctions
adapter, the M-Pesa port and the API contracts are to follow (FS-492,
FS-495).

**The platform and security minimum for any go-live:**

- **Access:** AC-01 (one identity provider), AC-02 (staff single sign-on),
  AC-08 (a realm per institution).
- **Security:** SE-01, SE-02, SE-04, SE-05, SE-08, SE-09, SE-10, SE-11,
  SE-12, SE-13, SE-17, SE-18, SE-19, SE-20, SE-21, SE-22.

The rest of the security baseline (SE-03, SE-06, SE-07, SE-14 to SE-16,
SE-23 to SE-25) follows in R2, before a bank goes live.

## The v1 rule

**The current scope is the target** (FS-490): v1 is everything in phase 1
today, and it does not grow by drift.

**v1 cap:** 222 capabilities in phase 1 (FS-490, FS-500).

Nothing moves into phase 1 unless something of similar size moves out, or
the team grows to carry it. Raising the cap is a decision: the line above
changes, citing the register row that decided it. The check tool counts
phase 1 across the modules and fails when it exceeds the cap.

## Definition of done, for every release

1. Each capability in scope is **Built**: code complete and tested, its
   module row updated with the evidence.
2. The security minimum is in place and a penetration test has passed
   (SE-17).
3. The customer's onboarding checklist is complete (docs/onboarding.md).
4. The approval pack items the customer's regulator needs are Ready
   (docs/approval-pack.md).
5. The customer has signed acceptance (user acceptance testing), and the
   first full cycle reconciles (OB-COM-14).
6. Restore and failover have been tested once against the recovery
   objectives (platform-security §3).

## The team that builds

Four people lead the build (FS-477):

| Who | Owns in R1 |
|---|---|
| The system developer | Kapu Core and Kapu MFI on Fineract: products, schedules, charges, the lender rules (MF-21 to MF-26), disbursement and repayment on M-Pesa and bank transfer, reusing the M-Pesa code that ran at Onit Bank (rails RL-03) |
| An Odoo engineer | Everything Odoo does for Roan Capital: leads and the public "Request a loan" page and calculator (BS-01; Roan RC-28, RC-29), documents, the service desk (docs/operating-model.md) |
| A DevSecOps engineer | The platform: Kubernetes, Keycloak (AC-01, AC-02, AC-08), OpenBao, the build pipeline, backups and the security minimum (SE rows above) |
| The CTIO | Architecture and reviews; the approval engine's design (MD-01 to MD-18); security lead; Roan Capital's acceptance with the project manager |

**Building less is the plan.** Four people cannot build 66 capabilities
from scratch, so R1 uses what already exists and builds only what does
not:

- **Fineract** already does loan products, schedules, charges,
  repayments by component, accounting and standard reports: configure,
  do not build.
- **The Mifos X web app** (its licence to confirm against architecture §6.1
  before use; if MPL-2.0, it is used unmodified) is Fineract's back-office screen:
  use it, with our screens only where a flow is ours (the committee vote,
  the collateral gate).
- **Odoo** does leads, the public page, documents and the desk.
- **Keycloak** does login, single sign-on and step-up: configure.
- **Identity checks** (ID-01, ID-07) through one vendor's API (partners
  SD-11 candidates) rather than direct connections, until volumes justify
  NPDM and BRS directly.
- **Build only:** the approval engine (chains, the 3-of-3 committee,
  approval from email), the lender rules, the collateral gate, sanctions
  screening against the UN and domestic lists (FC-05), and the platform.
- **Not in R1:** statement ingestion and appraisal ratios, the behaviour
  score and automatic downgrades (Roan RC-05, RC-11, RC-14, RC-15, the
  map's gaps) wait for R1's second step or a later release; agree that
  with Roan Capital before the next sprint.

**R1 in three increments**, each accepted by Roan Capital before the next
(its document's agile approach):

1. **Foundation and onboarding:** platform, login, Kapu Core with Roan
   Capital's products configured, borrower onboarding with ID and BRS
   checks, documents, leads.
2. **The credit decision and the money:** collateral gate, the approval
   chain with the 3-of-3 committee and approval from email, disbursement
   and repayment, reminders, the lender rules and the arrears cap.
3. **Reports, screening and go-live:** dashboards and reports, sanctions
   screening and records, the rest of the security minimum, the
   penetration test, a restore test, user acceptance and go-live.

**Where this team is thin** (docs/operating-model.md):

- **Testing:** no test engineer. Each person writes the automated tests
  for what they build, and the definition of done refuses work without
  them; a test engineer is the first build hire after a contract.
- **The on-call rota:** one of three DevSecOps engineers builds, so two
  hold the rota until the fourth arrives (FS-474). The builder stays on
  the rota rather than leave two alone.
- **The Odoo bench:** one of two Odoo consultants builds, leaving one for
  other implementations.
- **The CTIO:** architect, security lead and build lead at once. Reviews
  and acceptance need a deputy for when the CTIO is away; the system
  developer is the natural one.

## Open

- Dates: with this team and building less, R1's increments can be dated
  once each is broken into tasks; do that with the team before the next
  sprint.
- Land titles and BRS in Roan Capital's MVP (open answer 5): land titles
  would move MF-18 into R1.
