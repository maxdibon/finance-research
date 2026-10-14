---
id: delivery-plan
name: Delivery plan — phase 1 in releases, in the order customers need them
kind: plan
version: 0.1.0
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-453, FS-470, FS-473, FS-477, FS-490, FS-492, FS-495, FS-500, FS-503, FS-516, FS-517, FS-531, FS-532, FS-539, FS-638, FS-674, FS-675, FS-680, FS-767, FS-769, FS-775, FS-777, FS-781, FS-793, FS-808]
last_reviewed: 2026-10-14
---

# Delivery plan — phase 1 in releases

**Why this exists:** phase 1 in the modules is the whole of v1, not a
release (FS-473). On 2026-10-08 it held 249 capability rows: 16 Built, 48
Designed, 185 Planned (computed from the modules' §3 tables). No team
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
| **R1 · Roan Capital's pilot** | Now: Roan Capital is in delivery (customers CU-01) | Everything Roan Capital's delivery map depends on, plus the platform and security minimum for a lender to go live (below) | 103 capabilities from the map (1 Built, 38 Designed, 64 Planned), plus 30 further platform, security and testing capabilities (computed 2026-10-14, FS-808) |
| **R2 · Collect and the Gateway with a partner bank** | A partner bank signs (partners SD-04, PT-34) | Collect and the Gateway re-platformed from what ran at Onit Bank; deposits to the institution's paybill and tills (CO-21); for a microfinance bank, rails through a larger bank and its settlement account's float (RL-27, RO-09; FS-585); Airtel Money and T-Kash; Hakikisha and Pull Transactions; the SIM controls; traceability; the companion ledger for deposits and bank transfers, expected payments (RO-03), duplicate detection (RO-11), matching by leg against the rails' tariffs, change-data capture from the bank's own core, and the load test before a bank of scale (FS-793); Roan Capital's public pages, its website with the "Request a loan" form, the calculator and its published products (BS-20), since it has no website yet (FS-808) | Mostly Built or Designed: the Onit record |
| **R3 · SME Recon and the bank channel** | A bank agrees the referral pilot (docs/bank-channel.md) | SME Recon on Odoo and Zoho with bank statement feeds; the business suite for SMEs | SME Recon's phase-1 rows; bank APIs and files (rails RL-07) |
| **R4 · Saccos and Kapu Core** | The first Sacco or core customer signs | Kapu Sacco, Kapu Core, member apps and USSD, the field-officer app | Sacco, Core and omni-channel phase-1 rows |
| **R5 · The rest of v1** | After R1, in the order sales ask | Escrow, CRB, financial crime beyond R1, insights, the remaining platform services | What is left of phase 1 |

## R1 in detail

**From Roan Capital's delivery map** (docs/customers/roan-capital.md, CU-01;
the check keeps the two in step):

- **Lending:** MF-01 to MF-07, MF-09 (restructuring), MF-10 to MF-15,
  MF-21 to MF-26, MF-28, MF-34 (loan agreements), MF-35 (loan officers), MF-37
  (guarantors), MF-38 (borrower access), MF-39 (the collection ladder); land
  title searches and charge registration (MF-18) and programmatic NTSA
  (MF-05) are phase 2, as the document's exclusions say; land titles are
  stored in R1 under MF-03 (FS-581).
- **Approvals:** MD-01, MD-02, MD-03 (the chain frozen at submission),
  MD-04 (roles resolved to people when needed), MD-05, MD-06, MD-07 (a
  flag ends with its authority), MD-08 (reminders and escalation), MD-09
  (the 3-of-3 committee), MD-10, MD-18 (approval from email).
- **Identity:** ID-01, ID-02, ID-03 (re-verification), ID-07 (business registration), ID-10 (what is kept, and each query's cost), ID-11 (the phone number confirmed), ID-19 (KYC tiers), ID-15 (the
  document vault), ID-17 (sharing documents out), ID-12 (the number bound to its SIM).
- **Messaging:** MS-01, MS-02 (SMS through our own gateway, FS-565),
  MS-03 (Roan Capital's sender ID), MS-09 (delivery status), MS-10
  (replies and STOP), MS-11 (consent, for SMS and email), MS-12 (events
  become messages), MS-14 (templates), MS-15 (quiet hours), MS-19 (email,
  for approvals and links).
- **Core:** KC-01, KC-04, KC-07, KC-08, KC-15 (the business calendar) on Kapu
  Core (Fineract, PostgreSQL); KC-09 (M-Pesa repayments posted as they
  land; Airtel Money and T-Kash later).
- **Money in and out:** RL-07 (bank transfers), with M-Pesa already built
  (RL-03), with RL-12 (signing keys and rail credentials in OpenBao,
  never exported, FS-680), RL-20 (Pull Transactions, so a missed callback is
  found) and CO-21 (an unplaced payment: the payer asked, then placed or
  returned by day 7); before a payout, MF-20 and RL-21 (the registered name
  confirmed), RL-10 (an unanswered payment is a state) and RL-14 (a
  repeat never pays twice) (FS-570); RL-01 (each payout one instruction,
  cancellable, recallable, reversible) and RL-29 (a bank account holder's
  name confirmed) (FS-586).
- **Reconciliation and evidence:** RO-01 (statement files only: NCBA's
  statement email forwarded whole or uploaded, checked before matching;
  its API later, FS-767), RO-02, RO-04 (the end-of-day cycle; intraday
  later), RO-05, RO-07 (items in transit chased automatically, for
  M-Pesa), RO-08 (the shadow ledger at go-live; the companion for Roan
  Capital's product within the first 30 days, before any loan's first
  due date; FS-793), RO-16, RO-17 (98% matched automatically, FS-766), RO-18 (on-call), RO-19, RO-23 (one
  id end to end, every step a signed event), RO-24, RO-25 (evidence
  anyone holding our public keys can verify), RO-27 (one audit trail
  across modules).
- **Access:** AC-03 (borrowers and guarantors by a code to their bound
  phone; passkeys with the app), AC-05, AC-09, AC-13 (codes through our
  messaging).
- **Business suite:** BS-01 (CRM for leads), BS-02 (Odoo Sign, for loan
  agreements), BS-12 (the employee record only, in Odoo's Employees
  app, which provisions staff access; payroll, leave and attendance
  later, FS-769).
- **Decisioning:** DE-01 (the contract and decision records), DE-02
  (statement metrics), DE-03 (the behaviour score), DE-04 (risk classes),
  rules only, evidence for people (FS-582).
- **Financial crime:** FC-05 (sanctions screening), FC-12 (records), FC-16
  (transaction rules: in R1, time windows, types of day and amounts by
  tier).

**Build specifications** for R1 live in docs/specs/: the lender rules
([specs/lender-rules.md](specs/lender-rules.md)) and the approval engine
([specs/approval-engine.md](specs/approval-engine.md)); the sanctions
adapter, the M-Pesa port, the API contracts, decisioning (FS-582) and
the payout instruction path with its security (FS-586, FS-588) are to
follow (FS-492,
FS-495).

**The platform and security minimum for any go-live:**

- **Access:** AC-01 (one identity provider), AC-02 (staff single sign-on),
  AC-08 (a realm per institution), AC-10 (session expiry and sign-out
  everywhere), AC-11 (login and admin events to monitoring), AC-14 (block
  now: in R1 by a call to the institution or from the console), AC-15
  (recovery only after identity checks: in R1 by staff, with the ID),
  AC-16 (two authenticators for staff and approvers).
- **Core:** KC-05 (the general ledger), KC-12 (hosted per institution,
  isolated).
- **Security:** SE-01, SE-02, SE-04, SE-05, SE-08, SE-09, SE-10, SE-11,
  SE-12, SE-14 (Dibon's own devices only; institutions' in R2, FS-777),
  SE-17, SE-18, SE-19, SE-20, SE-21, SE-22, SE-24 (safe mode, decided in
  advance, FS-775), SE-26 (privileged access), SE-27 (ID numbers and other Restricted fields encrypted one by
  one, FS-638).
- **Testing:** ID-20 (the identity simulator), so every R1 journey's
  failures can be tested (docs/testing.md).

The rest of the security baseline (SE-03, SE-06, SE-07, SE-13 managed
detection, our rota watching until then, SE-14 for institutions'
devices, SE-15, SE-16, SE-23, SE-25) follows in R2, before a bank goes
live (FS-777).

## The v1 rule

**The current scope is the target** (FS-490): v1 is everything in phase 1
today, and it does not grow by drift.

**v1 cap:** 249 capabilities in phase 1 (FS-490, FS-500, FS-503, FS-516, FS-531, FS-532, FS-539, FS-551, FS-552, FS-560, FS-574, FS-582, FS-585, FS-586, FS-618, FS-638).

Nothing moves into phase 1 unless something of similar size moves out, or
the team grows to carry it. Raising the cap is a decision: the line above
changes, citing the register row that decided it. The check tool counts
phase 1 across the modules and fails when it exceeds the cap.

## Definition of done, for every release

1. Each capability in scope is **Built**: code complete, every acceptance
   item that covers it passing in the coverage matrix (docs/testing.md),
   its module row updated with the evidence.
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
| The system developer | Kapu Core and Kapu MFI on Fineract: products, schedules, charges, the lender rules (MF-21 to MF-26), restructuring (MF-09), loan agreements (MF-34), loan officers (MF-35), disbursement and repayment on M-Pesa and bank transfer, reusing the M-Pesa code that ran at Onit Bank (rails RL-03) |
| An Odoo engineer | Everything Odoo does for Roan Capital: leads entered by staff (BS-01; the public "Request a loan" page and calculator follow in R2, with its website: RC-28, RC-29, FS-808), documents, the service desk (docs/operating-model.md) |
| A DevSecOps engineer | The platform: Kubernetes, Keycloak (AC-01, AC-02, AC-08), OpenBao, the document vault (ID-15), the build pipeline, backups and the security minimum (SE rows above) |
| The CTIO | Architecture and reviews; the approval engine's design (MD-01 to MD-18); security lead; Roan Capital's acceptance with the project manager |

**Building less is the plan.** Four people cannot build 133 capabilities
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
  with Roan Capital before the next sprint. Messaging's routing across
  providers (MS-05: one route in R1, switched by hand from the runbook)
  and WhatsApp (MS-06: SMS and email only, until FS-165 is answered) are
  phase 1 but not R1 (FS-674).

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
