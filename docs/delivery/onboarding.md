---
id: onboarding
name: Customer onboarding checklists
kind: checklist
status: living
law: LR-03
released: 2026.10.16
owner: Delivery lead
classification: Internal
review_ids: [FS-339, FS-343, FS-435, FS-448, FS-449, FS-450, FS-453, FS-591, FS-620, FS-630, FS-633, FS-635, FS-645, FS-661, FS-714, FS-771, FS-775, FS-794, FS-802, FS-808, FS-1058, FS-1073, FS-1077, FS-1091]
last_reviewed: 2026-11-05
---

# Customer onboarding checklists

What we need from a customer before each product goes live. The common part
applies to every customer; each product adds its own. Items come from each
module's "What the customer must provide" row, so a change there belongs
here too. Every product the portfolio sells must have a section here; the
check tool fails if one is missing (FS-353).

This file is the template. A customer's progress against it is tracked in
Odoo, as a project created from this list when the deal is won. This
template names no customer; customers and their delivery maps are in
docs/customers.md.

**Partner onboarding** (banks, registries, bureaus) is tracked separately,
in docs/market/partners.md, under each partner's next step.

## Common to every customer

| Id | What we need | From | Why |
|---|---|---|---|
| OB-COM-01 | Signed agreement and order form | Customer's signatory | Odoo Sign (business-suite) |
| OB-COM-02 | The customer's own company documents: registration, directors, beneficial owners | Customer's company secretary | Our KYB of the customer |
| OB-COM-03 | Its licence and regulator (CBK, SASRA, or none), and whether it works through a partner bank | Customer's compliance lead | Decides the custody pattern (docs/architecture/README.md) |
| OB-COM-04 | A data processing agreement; both parties' registration with the Data Commissioner | Both compliance leads | Kenya Data Protection Act; Dibon is a processor |
| OB-COM-05 | Ledger mode: its own core (name, API or extracts) or Kapu Core | Customer's IT lead | Integrated or native mode |
| OB-COM-06 | Deployment: where it runs (its own premises or in-country cloud), who runs it (the institution or Dibon), and if Dibon, the managed level: Hosted, Managed or Operated | Customer's IT lead | Hosting (FS-032, FS-359, FS-360) |
| OB-COM-07 | User list, role structure, and single sign-on details if it federates | Customer's IT lead | access |
| OB-COM-08 | Approval chains and mandate rules, by product and amount, including quorum (N of M) steps where a committee approves | Customer's operations lead | mandates MD-09; FS-402 |
| OB-COM-09 | Sender ID, channels and message templates | Customer's operations lead | messaging |
| OB-COM-10 | **Payment channels: its own paybill or till, or its bank's collection account ("Lipa na Bank")?** Plus each bank account and access to its statements | Customer's finance lead | rails; FS-339. A bank's paybill confirms to the bank, so matching on it waits for that bank's feed |
| OB-COM-11 | Who pays for identity and business checks | Commercial lead | Open: FS-331 |
| OB-COM-12 | Data for migration, and opening balances it will sign off | Customer's finance lead | Every product that holds records |
| OB-COM-13 | Named contacts for operations, finance, IT, compliance, security and incidents, an escalation path, and the channel we use for incident notices (platform-security §3) | Customer's sponsor | Support; FS-478 |
| OB-COM-14 | Go-live sign-off after a first full cycle reconciles | Customer's sponsor | recon-observability |
| OB-COM-15 | The regulator's approval of the arrangement, where one applies: CBK approval for a bank's material outsourcing, 30 days' notice to CBK for a PSP, SASRA's vendor terms for a Sacco. Dibon supplies the due-diligence pack. What goes in it: docs/governance/approval-pack.md | Customer's compliance lead | docs/governance/compliance.md LC-05, LC-08; FS-368, FS-370; FS-440 |
| OB-COM-16 | Its money laundering reporting officer, its goAML registration with the FRC, and its risk appetite: screening lists, thresholds for holds and alerts | Customer's reporting officer | financial-crime FC-05 to FC-11; FS-431 |
| OB-COM-17 | Approvers' work email addresses, and which approvals may be acted on from Outlook or Gmail | Customer's operations lead | mandates MD-18; FS-449 |
| OB-COM-18 | The operator agreements for the SIM-change, IMSI and name checks with Safaricom, Airtel and Telkom: the institution's own, or Dibon's; and the limit and holding period after a SIM change | Customer's compliance lead | identity ID-12 to ID-14, financial-crime FC-02; compliance LC-13; FS-448 |
| OB-COM-19 | Access to each bank it pays out through: the bank access request sent (docs/outreach/bank-access-request.md), the channel each bank grants (API, host-to-host files, or internet banking), its cut-offs, and the signing certificates it requires | Customer's finance lead | rails RL-01, RL-07; FS-586, FS-588 |
| OB-COM-20 | Its business calendar (working hours, its own closures) and its transaction rules: windows, limits per tier and per cycle, allow- and deny-lists | Customer's operations lead | core KC-15; financial-crime FC-16; FS-574 |
| OB-COM-21 | For each core banking system we integrate with and each rail: its end-of-day window, what happens to postings during it, its cut-off and value dating, its statement day, and the status and statement interfaces it offers (a status query, intraday reports such as MT942 or CAMT.052, transaction enquiry, end-of-day statements), so reconciliation knows what is in transit and how to chase it (docs/architecture/README.md §10) | Customer's IT lead | recon-observability RO-04, RO-07; FS-630, FS-635 |
| OB-COM-22 | Dibon engineers' access: who approves a grant for the institution, its VPN or bastion, the contact who can switch Dibon's access off at any hour; it receives the list of Dibon engineers who may ask for access, with their vetting (docs/architecture/README.md §9) | Customer's IT lead and security contact | platform-security SE-26; FS-645 |
| OB-COM-23 | Its fallback runbook for when the platform is down (docs/architecture/README.md §3; handbook HB-70 to HB-78): who operates its M-Pesa business portal and internet banking, under its own two-person control; its manual approval form; its counter procedure; who decides to enter and leave safe mode; M-Pesa's validation fallback set to complete | Customer's operations lead | platform-security SE-24; FS-661 |
| OB-COM-24 | It agrees our rules for institutions (docs/governance/rules.md §2): named users with two authenticators, our device minimum, leavers removed the same day and a quarterly access review it signs, no customer data sent to our desk, test data in training, its regulator duties its own | Customer's operations lead and its compliance lead | FS-713, FS-714 |
| OB-COM-25 | Its handbook: the template (docs/handbook/) filled from its delivery file, starting with its position-to-roles table (HB-10), and adopted | Customer's operations lead | FS-770, FS-771 |
| OB-COM-26 | **When does a customer stop being its customer?** The period with no live loan, deposit account, share or guarantee after which the relationship has ended (proposed: one year). Identity and KYC documents are kept seven years from that end, then deleted | Customer's compliance lead | lending-service rule 9; vault §3; docs/governance/documents.md, clock R; Data Protection Act s.39; FS-1073 |
| OB-COM-27 | **Which providers its identity checks go through:** its own agreement with NPDM, KRA or the business registry, or ours; which aggregators (Prembly, Smile ID or others) for the rest and as fallback; its written consent to each as a processor | Customer's compliance lead | identity §5, "Providers"; FS-202, FS-1077 |
| OB-COM-28 | **How its own documents are numbered:** its own scheme, if it has one; otherwise a document code of three to eight letters, unique across our customers, by which the policies and documents we prepare for it are numbered (code, kind, serial: ROAN-POL-001) | Customer's operations lead | design-system §7; templates/cbk-licence-pack; FS-1091 |

## Kapu Collect

Module: [collect](../modules/collect.md)

| Id | What we need | From | Why |
|---|---|---|---|
| OB-CO-01 | Its licence to take deposits, or the partner bank that holds the accounts | Compliance lead | collect §7 |
| OB-CO-02 | Core API access, a sandbox and its product codes (integrated mode) | IT lead | collect §4 |
| OB-CO-03 | Account-opening rules: documents per customer type, including foreigners, refugees and companies | Compliance lead | identity; FS-329 |
| OB-CO-04 | Deposit notification wording and channels | Operations lead | collect CO-18 |
| OB-CO-05 | The operator agreements for the phone-number-to-name check with Safaricom and Airtel: the institution's own, or Dibon's | Compliance lead | compliance LC-13; collect CO-02; FS-392 |

## Kapu Pay Gateway

Module: [gateway](../modules/gateway.md)

| Id | What we need | From | Why |
|---|---|---|---|
| OB-GW-01 | **Its own paybill or till, its bank's, or a new collection account with our partner bank?** Shortcodes; or the bank's paybill and its account number; or the account opened with the partner bank. A merchant that wants none of these goes through the licensed aggregator | Finance lead | gateway §4; FS-339, FS-385 |
| OB-GW-02 | Rail credentials, or delegated access to them | IT lead | gateway §6 |
| OB-GW-03 | Callback URLs and its own reference format | IT lead | Idempotent requests |
| OB-GW-04 | ERP access, if payments post to its ERP | IT lead | sme-recon |

## Kapu Escrow

Module: [escrow](../modules/escrow.md)

| Id | What we need | From | Why |
|---|---|---|---|
| OB-ES-01 | The partner bank's escrow product, with sub-account and mandate APIs | Partner bank | escrow §4 |
| OB-ES-02 | The bank's legal sign-off on the agreement template | Partner bank's legal team | escrow §7 |
| OB-ES-03 | An account mandate that names the arbiter as one release path | Partner bank | FS-328 |
| OB-ES-04 | The arbiters it accepts, per agreement type | Customer's legal lead | escrow ES-08 |

## Kapu Core

Module: [core](../modules/core.md)

| Id | What we need | From | Why |
|---|---|---|---|
| OB-KC-01 | Products: savings, loans and shares, with interest, fee and charge rules, each written as a product version document from Dibon's starter templates, approved by two people, CBK's letter recorded where reg 55 requires it (product-versions) | Operations lead, with the product owner | core KC-02 to KC-04; FS-802 |
| OB-KC-02 | Chart of accounts | Finance lead | core KC-05 |
| OB-KC-03 | Branches, tellers and tills | Operations lead | core KC-06 |
| OB-KC-04 | End-of-day cycle: the runner's times; each check's class, agreed against the criteria in docs/specs/end-of-day-runner.md §4; the tolerance for unapplied money; who is told of what (docs/service-management/incident-management.md §3); and the returns it files | Finance lead, with our operations | core KC-07, KC-10 |
| OB-KC-05 | Data from its current system, and a signed-off migration reconciliation | Finance lead | core KC-11 |

## Kapu MFI

Module: [mfi](../modules/mfi.md)

| Id | What we need | From | Why |
|---|---|---|---|
| OB-MF-01 | Its shortcode and bank access | Finance lead | mfi §4 |
| OB-MF-02 | Loan products and fee structures, including repayment frequency and overdue charges, within the cap on interest recoverable on a non-performing loan (CBK lender regulations, reg 29); and its collection ladder: the stages by days past due, their messages and actions (mfi MF-39) | Credit lead | mfi §3, MF-21; FS-400 |
| OB-MF-03 | Approval chains, vetting limits and the override authority | Credit lead | mfi MF-06, MF-07 |
| OB-MF-04 | Collateral types it accepts; for each, its manual steps by stage, which of them hold approval or disbursement, and its vehicle tracking provider | Credit lead | mfi MF-03, MF-04; FS-619 |
| OB-MF-05 | Its CBK licence or registration as a lender, or its application (due by about 29 Mar 2027), which decides the conduct and disclosure rules the product applies | Compliance lead | mfi MF-22 to MF-29; law register LR-03; FS-435 |
| OB-MF-06 | Its appraisal and scoring definitions: the statement formulas, the behaviour score's weights, its risk classes and their thresholds; and the risk assessment behind its lightest KYC tier | Credit lead; compliance lead | decisioning DE-02 to DE-04; identity ID-19; FS-551, FS-582 |
| OB-MF-07 | Its collateral registry access: the officers who will search and register on the registry's portal, each with their own eCitizen account, never a shared one | Credit lead | mfi MF-03; FS-602 |
| OB-MF-08 | Its public pages: the website and domain for the "Request a loan" form and the calculator, the consent wording, and who receives new leads (for Roan Capital, in R2: it has no website yet, FS-808) | Customer's marketing or operations lead | business-suite BS-20; FS-618 |
| OB-MF-09 | Its standing waiver for charges a borrower did not cause: during a declared disruption window, or because a payment was processed late (lender-rules §2.10); approved by two people, reviewed yearly | Credit lead, with the compliance officer | MF-22, MF-39; FS-799, FS-802 |

## Kapu Sacco

Module: [sacco](../modules/sacco.md)

| Id | What we need | From | Why |
|---|---|---|---|
| OB-SC-01 | Bylaws, products, and fee and dividend rules | Sacco's management | sacco §4 |
| OB-SC-02 | Member data for migration | Operations lead | sacco §4 |
| OB-SC-03 | Check-off employers and their remittance files | Finance lead | Reconciliation (check-off) |
| OB-SC-04 | Core API access, or extracts and a posting route (integrated mode) | IT lead | sacco §4 |

## Reconciliation & Observability

Module: [recon-observability](../modules/recon-observability.md)

| Id | What we need | From | Why |
|---|---|---|---|
| OB-RO-01 | A posting-event feed, or a ledger extract on its cycle | IT lead | recon-observability §4 |
| OB-RO-02 | Chart-of-accounts mapping | Finance lead | recon-observability §4 |
| OB-RO-03 | Rail credentials or statements, for every channel | Finance lead | recon-observability §6 |
| OB-RO-04 | Its rules for recon's actions and deadlines, against the model in docs/specs/recon.md §4.7: its amount threshold, who looks first, and any channel deadline it tightens; maker-checker, effective-dated | Operations lead, with the finance lead | Break queues by SLA (FS-794) |
| OB-RO-05 | The opening position at recon's cut-off: every account's balance and, for loans, schedule, accruals, classification and cap episode, signed by its finance lead and Dibon; what it already knows is unreconciled listed as open items (recon §3 rule 8) | Finance lead | FS-798, FS-802 |

## SME Reconciliation

Module: [sme-recon](../modules/sme-recon.md)

| Id | What we need | From | Why |
|---|---|---|---|
| OB-SR-01 | ERP API access, or an Odoo subscription | IT lead | sme-recon §4 |
| OB-SR-02 | Bank and shortcode credentials, or delegated access | Finance lead | sme-recon §4 |

## Omni-channel banking

Module: [omni-channel](../modules/omni-channel.md)

| Id | What we need | From | Why |
|---|---|---|---|
| OB-OC-01 | Its brand: name, logo, colours | Marketing lead | White-labelled per institution (FS-232) |
| OB-OC-02 | Channel limits by transaction type | Operations lead | omni-channel §4 |
| OB-OC-03 | Its app store accounts, or consent to publish under Dibon's | Marketing lead | FS-232 |
| OB-OC-04 | A USSD code, from the operators | Operations lead | FS-233 |
| OB-OC-05 | Field officers: who they are, the Android devices they will use, and who may wipe a lost device | Operations lead | omni-channel OC-17 to OC-19, core KC-14; FS-450 |

## Business suite

Module: [business-suite](../modules/business-suite.md)

| Id | What we need | From | Why |
|---|---|---|---|
| OB-BS-01 | Which apps: CRM, helpdesk, accounting, HR and payroll, Sign, portal | Customer's sponsor | business-suite §3 |
| OB-BS-02 | Odoo or Zoho, and the subscription | Commercial lead | business-suite BS-13 |
| OB-BS-03 | Chart of accounts, and the core's daily totals if it has a core | Finance lead | business-suite §4 |
| OB-BS-04 | Data for migration | Finance lead | business-suite BS-10 |

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](../law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 29 | reg 29 | What can be recovered on a non-performing loan is capped at the principal then owing, interest up to that principal, and reasonable recovery costs; the cap is measured from the last time the loan became non-performing (29(3)); interest under a court order after the order is outside it (29(4)) |
| reg 55 | reg 55 | Pricing parameters and credit terms change only with the Central Bank's prior written approval, after thirty days' notice to the customer and the customer's acceptance |

**[LR-17](../law/LR-17.md) The Data Protection Act (Cap. 411C).** Regulator: Office of the Data Protection Commissioner. Made under: An Act of Parliament. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2019/24/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 39 | s. 39 | Personal data kept only as long as needed for its purpose, unless the law, a lawful purpose or the person's consent requires longer; then deleted, erased, anonymised or pseudonymised |
