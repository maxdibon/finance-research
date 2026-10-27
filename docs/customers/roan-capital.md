---
id: roan-capital
name: Roan Capital — delivery map
kind: delivery
status: living
law: LR-03
released: 2026.10.16
owner: Delivery lead
classification: Internal
review_ids: [FS-395, FS-397, FS-398, FS-399, FS-400, FS-401, FS-402, FS-403, FS-413, FS-414, FS-415, FS-423, FS-431, FS-435, FS-449, FS-453, FS-500, FS-516, FS-517, FS-531, FS-532, FS-533, FS-551, FS-556, FS-561, FS-562, FS-565, FS-570, FS-571, FS-574, FS-581, FS-582, FS-583, FS-586, FS-618, FS-619, FS-620, FS-622, FS-674, FS-680, FS-681, FS-755, FS-763, FS-765, FS-767, FS-768, FS-769, FS-773, FS-775, FS-793, FS-805, FS-806, FS-808, FS-811, FS-807, FS-812, FS-827, FS-831, FS-830, FS-835, FS-837, FS-838, FS-845, FS-903, FS-957, FS-965, FS-978, FS-979, FS-981, FS-982]
last_reviewed: 2026-10-28
---

# Roan Capital — delivery map

Customer CU-01 in docs/customers.md. What we are building for Roan Capital,
mapped requirement by requirement to the platform's capabilities. The
source is Roan Capital's *Business Requirement Document*, v1.0, 20 Aug
2026, held in clients/roan-capital/ outside git; section numbers below are
that document's. Statuses are not repeated here: each capability's status
is in its module, so it changes in one place.

## 1 · The engagement

A digital lending back office for Roan Capital's microfinance operations,
replacing Excel and paper: onboarding and KYC, collateral documents, a
committee approval chain with maker-checker, disbursement, repayment
reconciliation, arrears and collections, and management reports. It is
Kapu MFI on Kapu Core (Apache Fineract), delivered as an MVP pilot, with
the NTSA and land registry steps done by hand and tracked in the system
(FS-619).

- **Products:** Kapu MFI (docs/modules/mfi.md) on Kapu Core
  (docs/modules/core.md), with mandates, identity, access, messaging and
  reconciliation as shared services.
- **Hosting:** Dibon's cloud (the document's assumption 4). The prototype
  runs on Vercel; real borrower data stays off it (FS-398).
- **Secrets:** OpenBao, not HashiCorp Vault as the document says (FS-403).
- **Database:** PostgreSQL, not MySQL as the document says (FS-464).
- **Confidentiality:** the NDA, signed by both parties and dated 4 August
  2026, for three years (DR-003; as sent, DR-002). It is the text FS-738
  reviewed, so its points are terms in force; the corrections drafted in
  FS-740 belong in the services agreement and the data processing terms.
  Processors under it need Roan Capital's written consent (its 8.2(vi),
  18.2), and the Data Protection Act's 48 hours apply to a breach notice
  whatever its 72 say (FS-827).
- **Requirements:** the business requirement document, v1.0, sent on 20
  August with the executed NDA (DR-001); confirmed by Roan Capital at
  kickoff on 7 September (DR-008).
- **Reference:** Roan Capital is to be asked to be named once live
  (FS-401). Until it agrees, its name stays out of the portfolio and
  outreach.

**What we take from the prototype** (FS-807, agreed FS-812): masked
personal data revealed on request, each reveal logged (RO-19); the
collections workbench (MF-39); the cost of credit shown as the application
is entered, and charges itemised to the net payout (MF-01, MF-23); PAR 1,
7 and 30 and money collected against due (MF-14); its CSV reports (MF-15);
the application in its paper form's sections (MF-01); its session limits
(AC-10). **What we do not:** the public demo panel (open answer 1: remove
it now); an all-powerful Super Admin; product settings saved by one
person; repayments recorded by hand and payouts started by a typed
reference (the rails' own records instead); Google sign-in (Keycloak; a
Google broker later if wanted); recovery codes for staff (a second
administrator and an identity check, AC-16); the minimum interest on
early repayment (LQ-13).

## 2 · Requirements against capabilities

Each RC id is a requirement from the business requirement document,
DR-001, by its section (§2.2 and so on, below).

**Fit:** *Covered* means the capabilities listed do what the requirement
asks. *Partial* means they cover part of it, and the note says what is
missing. *Gap* means no capability does it yet.

### KYC and onboarding (§2.2)

| Ref | Requirement | Capabilities | Fit | Note |
|---|---|---|---|---|
| RC-01 | Borrowers as individuals, businesses and statement-based entities | KC-01, MF-01, ID-01, ID-07, ID-15, DE-02 | Covered | Covered (FS-681). Roan Capital's answer: a "statement-based entity" is not a third kind of borrower but the evidence a borrower gives: individual KYC, KYB, and bank and mobile-money statements for both the individual and the business where applicable. Kapu Core holds individuals and businesses with their people linked; each product's checklist (MF-02) asks for a set per party, and appraisal reads each (DE-02). Which borrower needs which set: open answers 17 to 21 |
| RC-02 | National ID and passport checked against IPRS in real time, with the cost of each query logged | ID-01, MF-02, ID-10 | Partial | The cost of each query is logged by ID-10 (FS-562). The document logs KES 5 a query; direct access is KES 20 a check plus KES 50,000 to connect (partners PT-29, compliance LC-12). Passport coverage unconfirmed (FS-329). Roan Capital provides the credentials (assumption 1) |
| RC-03 | Company status and directors checked with the Business Registration Service | ID-07 | Covered | ID-07 moved to phase 1, so it is in the MVP (FS-415) |
| RC-04 | Documents uploaded and stored: ID, KRA PIN, photo, certificate of incorporation, directors' guarantees; status per document | ID-02, MF-02, ID-15 | Covered | Stored in the document vault (ID-15, FS-500) |
| RC-05 | Bank and M-Pesa statements (3 to 12 months) ingested for appraisal | DE-02, ID-15 | Covered | Covered (FS-618): uploaded statements parsed and checked to reconcile; from source is a later improvement, not the requirement. Uploaded to the vault and parsed with recon's parsers for appraisal (decisioning DE-02, FS-582); each checked to reconcile. Statements fetched from source are phase 2 (identity ID-18) |
| RC-06 | No loan account until verification is complete | MF-02 | Covered | The completeness gate cannot be overridden |
| RC-07 | Onboarding wizard with separate individual and business flows | MF-01, MF-02 | Covered | Covered (FS-618): separate wizards are screen design. The flows exist; separate wizards per borrower type are screen design |

### Collateral (§2.2)

| Ref | Requirement | Capabilities | Fit | Note |
|---|---|---|---|---|
| RC-08 | Collateral record for a vehicle or land, linked to the loan | MF-03, MF-18, ID-15 | Covered | Vehicle and land title both in R1 under MF-03: the land title stored, as the document's scope asks, with its record and registry reference (FS-581). Land Registry searches and charge registration stay manual, as the document excludes them; MF-18 automates them in phase 2 |
| RC-09 | The committee cannot open or approve an application until the logbook or title is attached; status "Logbook Pending" or "Logbook Attached" | MF-04, ID-02, MF-02 | Covered | Configuration, nothing built for it (FS-571): the logbook or title is an item on the secured product's checklist, its status shown per document (Pending, Attached), and the completeness gate holds the approval request until it is there. MF-04 blocks acceptance on a failed verification |
| RC-10 | NTSA search, joint registration and discharge stay manual, outside the system | MF-04, MF-05, MF-03 | Covered | Manual, as the document says, but tracked in the system (FS-619): each step a task with an owner, a due date and evidence, on a checklist per collateral type, with the steps Roan Capital chooses holding approval or disbursement (MF-04); discharge sits beside the registry cancellation and the release of originals (MF-03). Tracking-provider alerts logged as events. Programmatic NTSA (MF-05) stays phase 2 |

### Credit lifecycle and governance (§2.2)

| Ref | Requirement | Capabilities | Fit | Note |
|---|---|---|---|---|
| RC-11 | Appraisal from statements: turnover, liquidity, retainer ratio | MF-06, DE-01, DE-02, MD-07 | Covered | Covered (FS-618): the formulas are configuration, given by Roan Capital in open answer 13. Computed by decisioning (DE-02) into a decision record (DE-01) the officer and committee read; the officer's assessed limit stays MF-06 (FS-582). The formulas are Roan Capital's to give (open answer 13) |
| RC-12 | Chain: Credit Officer, then the Business Credit Committee (3 of 3, unanimous), then the Head Office Committee above a configurable threshold | MD-01, MF-07, MD-09 | Covered | Chains per product and amount tier are configuration. The unanimous committee needs quorum steps, moved to phase 1 for this delivery (FS-399, FS-402) |
| RC-13 | Maker-checker throughout: the decider is never the requester | MD-06 | Covered | |
| RC-14 | Behaviour score for repeat borrowers, from repayment timing | DE-03 | Covered | Covered (FS-618): the scale and weights are configuration, open answer 13. Decisioning DE-03, in R1 (FS-582): from instalment timing in Kapu Core, the statement assessment weighing less as repaid loans accumulate. The scale and weights are Roan Capital's to give (open answer 13) |
| RC-15 | A Class A borrower downgraded automatically on a pattern of late payment | DE-04 | Covered | Covered (FS-618): the classes and thresholds are configuration, open answer 13. Decisioning DE-04, in R1 (FS-583): Roan Capital's classes and downgrade rules, applied automatically and recorded; never the regulatory classification (MF-25). The classes and thresholds are Roan Capital's to give (open answer 13) |
| RC-16 | Committee composition and the escalation threshold configurable | MD-01, MD-02, MD-03, MD-04 | Covered | Effective-dated and audited |
| RC-17 | Review dashboards; a committee screen with per-member comments and a vote tracker; an escalation banner | MD-05, MD-09, MD-18, MS-19, MD-08 | Covered | Covered (FS-618): the dashboards are screen design over these. Reminders and escalation when a step waits too long: MD-08 (FS-561). Decisions carry identity, comment and time (MD-05); the vote tracker comes with quorum steps. Committee members can act from Outlook or Gmail, with step-up at the act (MD-18) |

### Disbursement and repayment (§2.2)

| Ref | Requirement | Capabilities | Fit | Note |
|---|---|---|---|---|
| RC-18 | Disbursement under maker-checker, through NCBA and Access Bank internet banking | MF-11, RL-07, MF-20, RL-21, RL-10, RL-14, RL-01, RL-29, RL-12 | Covered | Covered (FS-618): bank access is Roan Capital's request to send, not a missing capability. Each payout is one instruction from approval to settlement, cancellable, recallable and reversible (RL-01); bank payouts by API, host-to-host files, or an internet-banking file Roan Capital's signatories release, until NCBA and Access Bank grant more (RL-07); the account holder's name confirmed first (RL-29); Roan Capital sends each bank the access request (FS-586, FS-587). Before an M-Pesa disbursement the registered name is confirmed (MF-20, RL-21); an unanswered payment is settled by a status query and a repeat never pays twice (RL-10, RL-14) (FS-570). Maker-checker is MF-11. Bank APIs are RL-07, Planned; Roan Capital opens the NCBA API talks (assumption 2). The document names Access Bank in §2.1 only. M-Pesa B2C ran in production at Onit Bank (RL-03), with the name confirmed by Hakikisha (MF-20) |
| RC-19 | Repayments reconciled by parsing M-Pesa and bank statement narrations | MF-10, RO-02, RO-05, CO-21, KC-09, RL-20, RO-04, RO-01, RO-07 | Covered | Covered (FS-618): paybill repayments, Pull Transactions and statement parsing, matched many to many (RO-02). In R1, NCBA's statement arrives by its email forwarded whole, or uploaded, and is checked before matching (RO-01); M-Pesa items in transit are chased automatically (RO-07) (FS-767). Better with M-Pesa C2B on Roan Capital's paybill (RL-03, Built at Onit Bank): each repayment arrives with its account reference, and Pull Transactions (RL-20) finds any missed confirmation. Statement parsing becomes the fallback |
| RC-20 | SMS or WhatsApp reminder on day 25 of a 30-day loan | MF-13, MS-01, MS-02, MS-03, MS-09, MS-10, MS-11, MS-12, MS-14, MS-15 | Covered | Owner, 2026-10-06: the demo and the platform run on Dibon's messaging service, not Roan Capital's own gateway, superseding the document's assumption 5 (FS-565): SMS direct to the operators under our PRSP licence (compliance LC-03), a sender ID for Roan Capital registered with each operator (onboarding OB-COM-09), and a truthful delivery status. WhatsApp (MS-06) stays outside R1 |
| RC-21 | End-of-day lockout, 11 pm to 4 am: no fund movements, while leads and interest calculation continue | KC-07, FC-16, KC-15 | Covered | Covered (FS-618). Roan Capital's procedure: staff release nothing in the window. A transaction rule holds what the system sends by itself, a queued payout or a retry, until 04:00 (FC-16), on the business calendar (KC-15) (FS-571, FS-574) |
| RC-22 | Reconciliation dashboard: matched and unmatched, with a manual-match tool | RO-02, RO-05, MF-12, RO-08 | Covered | The shadow ledger from go-live, and the companion recomputing each loan within the first 30 days, so the three ledgers are checked before any loan falls due (FS-793) |

### Operational risk, compliance and oversight (§2.2)

| Ref | Requirement | Capabilities | Fit | Note |
|---|---|---|---|---|
| RC-23 | Ageing report, buckets from 1 to 360+ days, with export | MF-14 | Covered | |
| RC-24 | Loan classification and a risk portfolio view | MF-14, MF-15, DE-04 | Covered | Covered (FS-618): classification reported (MF-14, MF-15) and changed by rule (DE-04). Reported; the rule that changes a classification is RC-15 |
| RC-25 | Internal management P&L: interest, fees, penalties | MF-15 | Covered | Income by component |
| RC-26 | Loan calculator (rates 1% to 50%), with penalty interest after day 30 | KC-04, MF-21 | Covered | Covered (FS-618): the rate's unit is configuration, open answer 4. The rate's unit is not stated (a month, a year, flat?). Penalty interest must stay within the arrears cap: for lenders, interest recoverable on a non-performing loan stops at the principal owing (CBK lender regulations reg 29; MF-21, phase 1, FS-400) |
| RC-27 | Delinquency ladder: reminder day 25, default run days 30 to 40, final warning days 40 to 47, hard closure day 47 | MF-13, MF-14, MF-39 | Covered | Reminders and arrears buckets exist; the collection ladder that moves a loan between stages by day is MF-39, in R1 (FS-618). The ladder itself must fit the conduct rules and the arrears cap (RC-37, open answer 3) |

### Public lead capture, calculator and administration (§2.2)

| Ref | Requirement | Capabilities | Fit | Note |
|---|---|---|---|---|
| RC-28 | A public "Request a Loan" page and lead capture, with lead status from New to Converted or Dropped | BS-01, BS-20 | Covered | The public page, the lead and its conversion into a draft application are BS-20, in R1 (FS-618)  R2: Roan Capital has no website yet (owner, 2026-10-14, FS-808); until then leads are entered by staff in the CRM (BS-01) |
| RC-29 | Loan calculator service and a public calculator page, from the same product configuration as live loans | KC-04, BS-20 | Covered | The public calculator, priced from the same product version as live loans, is BS-20, in R1 (FS-618)  The public page is R2 with the website (FS-808); the back office's calculator, from the same product version, stays in R1 |
| RC-30 | Loan products: rates, fees, insurance, penalties, amount and tenor limits; changes apply only to new loans | KC-04 | Covered | Fineract copies the product's terms onto each loan when it is created |
| RC-31 | Product changes approved under maker-checker, and audited | MD-01, MD-02, KC-08 | Covered | |

### Security and audit (§2.2, annex I)

| Ref | Requirement | Capabilities | Fit | Note |
|---|---|---|---|---|
| RC-32 | Time-based one-time codes (Google Authenticator) for every approver | AC-05, MD-10, AC-16 | Covered | Covered (FS-618): an authenticator app with time-based one-time codes is one of every approver's two authenticators, in R1 (AC-16). The prototype's fixed code is open answer 1. Step-up at the act is Planned. The prototype accepts a fixed code (123456): production must never |
| RC-33 | An immutable audit trail of every action, searchable by user, account, date and action | RO-19, MD-05, RO-24, RO-27, RO-23, RO-25 | Covered | Access audit and decision records exist, and every step of a transaction is signed and chained (RO-24). One trail across modules, actions outside transactions included, searchable by user, account, date and action, is RO-27, in R1 (FS-618) |
| RC-34 | Roles: Credit Officer, committee members, Head Office Committee, administrator | AC-09, BS-12 | Covered | The prototype's eight roles, agreed by the owner (FS-811); their design is §1, "Its roles" |
| RC-35 | Monitoring: Prometheus, Grafana, Loki; 99.9% uptime | RO-16, RO-17, RO-18 | Covered | Ran for Collect at Onit Bank (collect CO-11). Uptime sits with the support tier. Availability: warm standby (owner, 2026-10-12, FS-775): back within 4 hours if a site is lost, at most 5 minutes of data recovered from the rails; the second site's provider to settle before go-live (deployment §1) |
| RC-36 | AML/CFT duties as a licensed or registered lender: sanctions screening at onboarding and on every list change, records for seven years. Not in the document; required by the CBK lender regulations, reg 64 (law register LR-03) | FC-05, FC-12 | Partial | Added by Dibon (FS-431). Both are phase 1; PEP screening, cases and STR drafting (FC-06, FC-08, FC-09) are phase 2 |
| RC-37 | Conduct and disclosure rules for a licensed or registered lender: repayment order, APR and key information document, price changes, non-performing classification, collection conduct, complaints. Not in the document; required by the CBK lender regulations (law register LR-03) | MF-22, MF-23, MF-24, MF-25, MF-26, MF-28 | Covered | Covered (FS-618): the rules are designed; fitting the document's penalty and ladder within them is open answers 3 and 4. Added by Dibon (FS-435). The document's day-30 penalty interest and day-47 closure ladder (RC-26, RC-27) must fit within these and the arrears cap (MF-21) |
| RC-38 | Loan agreements and key information documents, generated, signed by the borrower and guarantors, and kept. Not in the document; a lender cannot disburse without them | MF-34, BS-02, ID-17 | Covered | Covered (FS-618): templates and the signing route are open answer 10. Added by Dibon (FS-516). Templates and the signing route to agree with Roan Capital (open answer 10) |
| RC-39 | Restructuring: reschedule, refinance or top-up, approved and disclosed, without resetting the arrears cap. Not in the document | MF-09 | Covered | Covered (FS-618): the policy is open answer 10. Added by Dibon (FS-516). Roan Capital's restructuring policy to agree (open answer 10) |
| RC-40 | Loan officers: each borrower and loan assigned to a Credit Officer, reassigned with approval, performance per officer. Not in the document; Roan Capital's Credit Officers (RC-12, RC-34) hold the portfolios | MF-35 | Covered | Covered (FS-618). Added by Dibon (FS-517); owner, 2026-10-06: in R1 |
| RC-41 | Guarantors' rights: consent before appointment, periodic statements, 14 days' notice before any demand, recourse only after recovery from the borrower. Not in the document; required by the CBK lender regulations, regs 39(3) and 42, and Roan Capital takes directors' guarantees (RC-04) | MF-37 | Covered | Covered (FS-618). Added by Dibon (FS-531) |
| RC-42 | Borrowers' access: receipts, status messages and a free statement on request. Not in the document; required by reg 39(1) | MF-38, ID-17, ID-11, AC-03, AC-13, ID-12 | Covered | Covered (FS-618). Added by Dibon (FS-531). The borrower's phone number is confirmed by a one-time code before anything is sent to it (ID-11, FS-562) |
| RC-43 | KYC tiers: each borrower's tier set from the checks done, and loan limits and rules per tier, so a borrower verified manually or with fewer checks cannot reach the larger loans. Not in the document; reg 63 of the CBK lender regulations requires a lender to guard against impersonation, and the AML regulations allow lighter checks only for lower risk (reg 21) | ID-19, ID-03 | Covered | Covered (FS-618): the limits per tier are configuration (onboarding OB-MF-06). Added by Dibon (FS-551); owner, 2026-10-06: in R1. Roan Capital sets the limits per tier and writes the risk assessment behind them. Re-verification (ID-03) re-checks an expiring document and upgrades a manual record once an electronic check exists (FS-556) |

## 3 · Out of scope for the MVP (§2.3)

NTSA automation, vehicle tracking, land registry search, WhatsApp-based
reconciliation and tax portals. Each is a later scoping exercise
(assumption 6). Programmatic NTSA is already designed as a drop-in
replacement (MF-05). Until then the manual steps are tracked: each a task
with an owner, a due date and evidence, the blocking ones Roan Capital's
choice (MF-04, FS-619).

## 4 · Open answers

### Open

| # | Question | Raised | Status |
|---|---|---|---|
| 1 | Remove the prototype's public demo panel (accounts, a shared password, a fixed 2FA code) before anyone outside the team sees it | FS-395 | Open |
| 2 | Under which licence does Roan Capital lend? It decides the interest and disclosure rules. Every non-deposit-taking lender must now be licensed or registered with CBK, applying by about 29 Mar 2027 (NDTCP Regulations 2026, FS-423) | FS-400, FS-423, FS-827 | Open, for a senior management meeting, not an operational one (owner, 2026-10-14). The owner understands Roan Capital has applied and has not yet been licensed: to confirm there |
| 3 | 1% a day default interest: within the in duplum rule? | FS-400 | Answered for the cap: reg 29 of the lender regulations stops recoverable interest at the principal owing, enforced by MF-21. Whether the rate itself fits the pricing and disclosure rules (RC-37) is open |
| 4 | The interest rate's unit | FS-395 | Open |
| 6 | Disbursement banks: NCBA only, or NCBA and Access Bank? (RC-18) | FS-395 | Open |
| 9 | Will Roan Capital be named as a reference once live? | FS-401 | Open |
| 10 | Loan agreement and guarantee templates, how borrowers sign, and the restructuring policy (RC-38, RC-39) | FS-516 | Open: the owner is asking. Partly (2026-10-15, FS-831): Roan Capital's application form holds a loan agreement, a chattels mortgage and a guarantor's charge; the platform issues its own (lender-rules §2.3), so the restructuring policy and how borrowers sign remain |
| 11 | Until PEP screening (FC-06, phase 2): a question on the application form, whether the borrower holds or held a public office, and the compliance officer's review of any yes. Agree? | FS-562 | Open |
| 12 | Do you pull credit bureau reports before lending today? If so, the bureau lookup (CR-02) comes into R1 | FS-570 | Open |
| 13 | The definitions behind the appraisal and scoring (RC-05, RC-11, RC-14, RC-15): the formulas for turnover, the liquidity metric and the retainer ratio; the behaviour score's scale and weights, and how statement scoring is weighted down over time; the risk classes and the downgrade thresholds; and synthetic or anonymised sample statements from each bank | FS-582 | Open |
| 15 | The manual collateral steps (RC-10): the list per collateral type, which steps hold approval or disbursement, and the vehicle tracking provider | FS-619 | Open |
| 16 | Does Roan Capital limit how much one person may guarantee across loans? If so, the limit and how it is counted (RC-41) | FS-622 | Open |
| 17 | Which borrowers give which set (RC-01): an employed individual, an individual with a business, a sole trader, a company? | FS-681 | Open |
| 18 | A sole trader under a registered business name, which is not a company: is the borrower the person, with the business-name search as the KYB? | FS-681 | Open |
| 19 | For a company, whose personal statements: every director, or the directors who guarantee? | FS-681 | Open |
| 20 | Does appraisal combine the individual's and the business's statements into one figure, or assess each and then decide? (with open answer 13) | FS-681 | Open |
| 21 | How many months of each statement: bank and mobile money, individual and business (RC-05 says 3 to 12)? | FS-681 | Open. Partly (2026-10-15, FS-831): the application form asks six months of M-Pesa and bank cash flows; individual and business, open |
| 22 | Complaints (JN-08): who handles them, the manager above them, and through which channels customers complain today, including a phone line | FS-763 | Open |
| 23 | While a complaint about an amount is open, collection on that amount pauses (JN-08 step 6). Does interest keep accruing on it, corrected if the complaint is upheld? | FS-763 | Open |
| 24 | The accountant's morning (JN-17): who receives the morning report besides the accountant, and who deputises; the accountant's hours; and where Roan Capital keeps its books today (Odoo, another package, spreadsheets), which decides whether the core's daily totals need posting to Odoo (BS-08, phase 2) | FS-765 | Open |
| 25 | Do you collect any repayments through Airtel Money (or T-Kash)? If so, its rail (RL-04) and its automatic chase come into R1 with M-Pesa | FS-767 | Open |
| 26 | Staff access (JN-18): who approves a staff member's role changes; who your two administrators are; who tells the administrator of joiners, moves and leavers; and whether staff use Roan Capital's own devices. The role list itself is open answer 7 | FS-768 | Open |
| 27 | Its fallback runbook for an outage (JN-19; onboarding OB-COM-23): who decides to enter and leave safe mode; who may pay out by hand, and within what limit; its manual approval form; whom we call first and second; the names and limits in handbook §7 | FS-773, FS-775 | Open. Its availability model is settled: warm standby (owner, 2026-10-12, FS-775) |
| 28 | The approval chain: the requirement document has the Credit Officer, then the Business Credit Committee (three of three, unanimous), then the Head Office Committee above a threshold (RC-12); the prototype has the Credit Manager, then Head Office, then the CEO, for every loan. Which is Roan Capital's? Both are configuration | FS-807, FS-811 | Open. The application form's approval block has the Credit Manager, Head Office and the CEO (FS-831); to confirm, with the order and any thresholds |
| 29 | The product's terms as the prototype sets them (1% a day flat interest, 14- and 30-day terms, daily instalments, default interest on overdue instalments, the fees by amount): are they Roan Capital's, and has CBK approved this pricing (reg 55)? And its "minimum 14 days' interest on prepayment", which the regulations appear to forbid (reg 56(3), (4); LQ-13) | FS-807 | Open. Partly (2026-10-15, FS-831): the application form states 1% a day, two weeks or one month, daily instalments, default interest until arrears clear, and the fees; its note on prepayments within two weeks meets reg 54(4)(h) and LQ-13 (product draft); CBK's approval of the pricing is for senior management (FS-827) |
| 30 | CBK must be told thirty days before a new delivery channel rolls out (reg 27(1)), with the mobile-money number used for payouts and repayments, any app, and the bank accounts (27(2)). The platform is that channel: who notifies CBK, and by when before go-live? | FS-830 | Open, for senior management (FS-827) |
| 31 | A reading we are confirming: whether a restructure the borrower asks for must still wait the thirty days' notice that reg 54(7) gives for any change to a loan agreement (the power to restructure is reg 28(3)). We will confirm it before anything is built on it; does your counsel have a view? | FS-876 (LQ-06) | Open |
| 32 | A reading we are confirming: which regulation sets how often guarantors receive statements. We cite reg 47(2); reg 39(3) may be the right one. We will confirm it before anything is built on it; does your counsel have a view? | FS-876 (LQ-16) | Open |
| 33 | Your staff found the Mifos screens hard to use. We propose screens of our own in Odoo for daily lending (FS-965): which tasks were hardest? May we watch two or three staff at their desks, on 29 October or soon after? | FS-965 | Open, for 29 October |
| 34 | Would licence cost lead you to a lower-cost edition of Odoo (Community, supported by us rather than Odoo), knowing the trade-offs? | FS-967 | Open, for 29 October |
| 35 | Your staff, by job title, and how many; we fold the eight positions to fit (FS-982) | FS-982 | Open, for 29 October |
| 36 | The approval threshold: up to it, one approval by someone other than the originator; above it, two. And the committee of three, or this shorter chain (with open answer 28)? | FS-982 | Open, for 29 October |
| 37 | Who releases a payout once Finance has prepared it, or is preparation enough, the payout going only to the verified account for the computed amount? | FS-979 | Open, for 29 October |
| 38 | Which staff may use the Kapu Console's read-only views when Odoo is down? | FS-976, FS-987 | Open, for 29 October |
| 39 | Your product owner, and the two people who approve a product version; and your agreement that you are accountable for your products and for CBK's approval of them, our rules stopping only what the law forbids (FS-978) | FS-978, FS-981 | Open, for 29 October |
| 40 | Who approves when the CEO is away? | FS-982, FS-898 | Open, for 29 October |
| 41 | Who is your external auditor, for a read-only account? | FS-982 | Open, for 29 October |

### Answered

| # | Question | Raised | Status |
|---|---|---|---|
| 5 | BRS and land titles in the MVP, or phase 2? (RC-03, RC-08) | FS-413, FS-415, FS-581 | Answered: BRS in v1; land titles stored in the MVP, searches manual |
| 7 | The role list (RC-34) | FS-395, FS-811 | Answered (2026-10-14): the prototype's eight, agreed by the owner; to confirm with Roan Capital, with the approval chain (answer 28) |
| 8 | Approval chain and loan products | FS-399, FS-400 | Answered: both are configuration |
| 14 | Borrowers that are "statement-based entities" (RC-01): what are they, and how are they verified? | FS-618 | Answered (2026-10-10, FS-681): not a third kind of borrower; borrowers give a mix of individual KYC, KYB, and bank and mobile-money statements for both the individual and the business where applicable |

The document also needs editing: two sections numbered 2.2.2, no section
1.3, exclusions referred to as §2.4 but numbered 2.3, assumption 4's text
inside the table of contents, and misaligned rows in the quality table.

## 5 · Its products

Each product is a product version document (lender-rules §2.4): a draft
or one awaiting approval is Roan Capital's and Dibon's alone; an active
one is public, as the lender regulations require (regs 47(1)(d), 48), and
its link goes to Roan Capital's own product page.

| Product | Version | Status | Where |
|---|---|---|---|
| Biashara, the 30-day loan | 1 | Proposed by Dibon (FS-981): seven blanks, among them open answers 3 (the default interest's base) and 4 (the rate's unit), and the amount limits, fees, insurance, default period and holiday rule | [The draft](../products/roan-capital-30-day-loan-v1.md), in git by exception until Roan Capital's workspace in Dibon's Odoo Documents exists (rules, Dibon 10; FS-806) |
| Motor Vehicle, the logbook loan | 1 | Proposed by Dibon, from 21 October's definition: amount limits, fees, insurance, default interest and the third-party charges to provide; the sale window to change first (FS-935) | [The draft](../products/roan-capital-motor-vehicle-v1.md), in git by exception as above |
| Title Deed, the land-secured loan | 1 | Proposed by Dibon, from 21 October's definition: amount limits, term, fees, insurance, collateral and charges to provide; the Land Act to add to the law register | [The draft](../products/roan-capital-title-deed-v1.md), in git by exception as above |

Statuses: proposed (by Dibon, for Roan Capital to adopt), draft, awaiting approval, awaiting CBK, active, retired.

## 6 · Documents

**Its documents** are held in clients/roan-capital/, outside git, until
Roan Capital's workspace in Dibon's Odoo Documents exists (FS-805); the
product drafts themselves are in docs/products/ by exception (FS-806).

*Generated from the [document register](../document-register.md) by tools/docregister.js: edit the register, never this table.*

| Id | Title | Summary | Kind | Status | Date | From |
|---|---|---|---|---|---|---|
| DR-001 | Business requirement document | The requirements for Roan Capital's lending platform, as we sent them with the executed NDA; every RC id on its delivery map comes from it | Record | kept | 2026-08-20 | Dibon, sent with the executed NDA |
| DR-002 | Non-disclosure agreement, as sent for signature | The mutual NDA as we sent it for signature | Record | kept | 2026-07-31 | Dibon |
| DR-003 | Non-disclosure agreement, executed (dated 4 August 2026, three years) | The NDA as signed, dated 4 August 2026 for three years: the one in force | Original | kept | 2026-08-04 | Roan Capital, signed |
| DR-004 | Certificate of incorporation, certified copy | A certified copy of Roan Capital's certificate of incorporation, for our customer records | Original | kept | 2025-11-04 | Roan Capital |
| DR-005 | Sender ID authorisation letter, template | The letter template Roan Capital supplied for authorising its SMS sender ID | Original | kept | 2026-10-12 | Roan Capital |
| DR-006 | Sender ID whitelisting request, signed (dated 9 October 2026) | Roan Capital's signed request to whitelist its SMS sender ID, dated 9 October 2026 | Original | kept | 2026-10-12 | Roan Capital, its director |
| DR-007 | Loan application form | Roan Capital's loan application form, exactly as received; our versions 0.1 and 0.2 start from it | Original | kept | 2026-10-15 | Roan Capital |
| DR-008 | Kickoff summary and next steps, the email as sent (7 September 2026) | Our email after the kickoff: what was agreed, and the next steps | Record | to keep | 2026-09-07 | Dibon |
| DR-009 | Review of the requirement document and the back office | Our own reading of the requirement document, and what the back office needs | Working | internal | 2026-10-03 | Dibon |
| DR-010 | Mutual NDA, corrected draft | A corrected NDA we drafted; withdrawn, as the executed NDA stands | Working | withdrawn | 2026-10-12 | Dibon |
| DR-011 | NDA changes, internal note | Our note on the changes the NDA would have needed | Working | internal | 2026-10-12 | Dibon |
| DR-012 | 30-day loan questionnaire A, product terms | Questions for Roan Capital on the 30-day loan's terms: amounts, term, pricing | Working | superseded | 2026-10-15 | Dibon |
| DR-013 | 30-day loan questionnaire B, eligibility and limits | Questions for Roan Capital on who may borrow, and how much | Working | superseded | 2026-10-15 | Dibon |
| DR-014 | 30-day loan questionnaire C, how it runs | Questions for Roan Capital on how the loan runs from day to day | Working | superseded | 2026-10-15 | Dibon |
| DR-015 | Product and operations meeting, agenda (15 October 2026) | The agenda for the product and operations meeting of 15 October | Working | draft | 2026-10-15 | Dibon |
| DR-016 | Product and operations meeting, our record (15 October 2026) | What was said and agreed at the 15 October meeting, kept for us | Working | internal | 2026-10-15 | Dibon |
| DR-017 | Loan application form, in our format, from DR-007 | The application form in our format, word for word as received | Working | draft | 2026-10-15 | Dibon |
| DR-018 | Loan application form, suggested changes tracked, from DR-017 | The form with our 28 suggested changes tracked, each with its reason and the regulation behind it | Working | superseded | 2026-10-15 | Dibon |
| DR-019 | Loan application form, schedule of v0.2's changes | The 28 changes in version 0.2 in one table, for Roan Capital to accept or decline | Working | superseded | 2026-10-15 | Dibon |
| DR-037 | Loan application form, v0.2 with a page of the regulations cited, tracked, from DR-018 | The form with our 28 suggested changes, and a last page listing each regulation cited with what each provision requires; two readings marked as being confirmed | Working | draft | 2026-10-16 | Dibon |
| DR-038 | Loan application form, schedule of v0.3's changes | The 28 changes in one table, for Roan Capital to accept or decline, and the page of regulations cited | Working | draft | 2026-10-16 | Dibon |
| DR-039 | 30-day loan questionnaire A, product terms, with the regulations cited | Questions on the 30-day loan's terms, and a last page listing the regulations they rest on, two readings marked as being confirmed | Working | superseded | 2026-10-16 | Dibon |
| DR-040 | 30-day loan questionnaire B, eligibility and limits, with the regulations cited | Questions on who may borrow and how much, and a last page listing the regulations they rest on | Working | superseded | 2026-10-16 | Dibon |
| DR-041 | 30-day loan questionnaire C, how it runs, with the regulations cited | Questions on how the loan runs from day to day, and a last page listing the regulation it rests on | Working | superseded | 2026-10-16 | Dibon |
| DR-042 | 30-day loan (Biashara) questionnaire A, product terms (DC-FS-QN-001) | Questions on the product's terms, for its product owner, a form field for each answer, built from the product's draft, and a last page of the regulations cited | Working | superseded | 2026-10-27 | Dibon |
| DR-043 | 30-day loan (Biashara) questionnaire B, eligibility and limits (DC-FS-QN-001) | Questions on who may borrow and how much, for its credit lead, a form field for each answer, built from the product's draft, and a last page of the regulations cited | Working | superseded | 2026-10-27 | Dibon |
| DR-044 | 30-day loan (Biashara) questionnaire C, how it runs (DC-FS-QN-001) | Questions on how the loan runs day to day, for its operations lead, a form field for each answer, built from the product's draft, and a last page of the regulations cited | Working | superseded | 2026-10-27 | Dibon |
| DR-045 | Motor Vehicle questionnaire A, product terms (DC-FS-QN-002) | Questions on the product's terms, for its product owner, a form field for each answer, built from the product's draft, and a last page of the regulations cited | Working | superseded | 2026-10-27 | Dibon |
| DR-046 | Motor Vehicle questionnaire B, eligibility and limits (DC-FS-QN-002) | Questions on who may borrow and how much, for its credit lead, a form field for each answer, built from the product's draft, and a last page of the regulations cited | Working | superseded | 2026-10-27 | Dibon |
| DR-047 | Motor Vehicle questionnaire C, how it runs (DC-FS-QN-002) | Questions on how the loan runs day to day, for its operations lead, a form field for each answer, built from the product's draft, and a last page of the regulations cited | Working | superseded | 2026-10-27 | Dibon |
| DR-048 | Title Deed questionnaire A, product terms (DC-FS-QN-003) | Questions on the product's terms, for its product owner, a form field for each answer, built from the product's draft, and a last page of the regulations cited | Working | superseded | 2026-10-27 | Dibon |
| DR-049 | Title Deed questionnaire B, eligibility and limits (DC-FS-QN-003) | Questions on who may borrow and how much, for its credit lead, a form field for each answer, built from the product's draft, and a last page of the regulations cited | Working | superseded | 2026-10-27 | Dibon |
| DR-050 | Title Deed questionnaire C, how it runs (DC-FS-QN-003) | Questions on how the loan runs day to day, for its operations lead, a form field for each answer, built from the product's draft, and a last page of the regulations cited | Working | superseded | 2026-10-27 | Dibon |
| DR-051 | Roles, approvals and going live (DC-FS-QN-004) | The open questions on who does what, who approves, outages, and what CBK needs before go-live, in six sections by who answers, and a last page of the regulations cited | Working | draft | 2026-10-27 | Dibon |
| DR-052 | Fallback for a platform outage, template (DC-FS-TM-002) | A starter for Roan Capital's own procedure in an outage, in the plain look, for it to adopt | Working | draft | 2026-10-27 | Dibon |
| DR-053 | Email, documents for 29 October | Our draft covering email for the pack above; not sent. v0.2 counts five documents; v0.3 shares them in a Google Drive folder Roan Capital edits (FS-1042); v0.4 without the set-up note, ready to paste; v0.5 for five files, a questionnaire per product; v0.5 also as a Word file, for the team to comment on in Drive | Working | draft | 2026-10-28 | Dibon |
| DR-054 | Team review request, the pack for 29 October | Our internal request to the team to review the pack before it goes to Roan Capital, the pack in a restricted Google Drive folder; v0.4 without the set-up note, the team already able to open the folder, Suggesting mode: the delivery lead the whole pack; the dev lead, with the CI/CD engineer shadowing, the worksheet and the questionnaires; the CEO the regulations pages; the ops lead the fallback template; by Wednesday 28 October at noon; not sent; v0.5 for five files; v0.6 with every file a Word file; v0.7 in plain text for pasting into Gmail, six files listed, due 15:00 on the day | Working | internal | 2026-10-28 | Dibon |
| DR-055 | Drive set-up for 29 October, Eric's checklist | The steps to set up, run and close the two Drive folders: before the team's review, after it, and after Roan Capital answers; v0.2 for five files; v0.3 with every file uploaded as Word, and Roan Capital's clean copies rebuilt from their sources | Working | internal | 2026-10-28 | Dibon |
| DR-056 | 30-day loan (Biashara) questionnaire, parts A to C in one (DC-FS-QN-001) | The questions on the product's terms, eligibility and limits, and how it runs, a part and a page each, a form field for each answer, built from the product's draft, and a last page of the regulations cited | Working | draft | 2026-10-28 | Dibon |
| DR-057 | Motor Vehicle questionnaire, parts A to C in one (DC-FS-QN-002) | As DR-056, for Motor Vehicle | Working | draft | 2026-10-28 | Dibon |
| DR-058 | Title Deed questionnaire, parts A to C in one (DC-FS-QN-003) | As DR-056, for Title Deed | Working | draft | 2026-10-28 | Dibon |

- Capability statuses: the modules named in §2.
- Decisions: FS-399 to FS-403, FS-414, FS-431, FS-435 and FS-453 in
  docs/decisions.md and REVIEW.md.

## 7 · People and roles

**Who is on it at Dibon** (FS-903): the delivery lead, Betty (Project
manager), whom Roan Capital's people reach first; Eric (CTIO) for the
architecture, security and the product; Lillian (Dev lead) for
engineering, and the product owner's deputy. Operations and Odoo are
named as each joins its rows, from Allan's and Gibeon's teams. Roan Capital's own people are named here by role only; their names
and work contacts are in Dibon's Odoo, open to this project's team.

**Its roles, in ITIL's terms** (FS-755): the *sponsor*, who pays for
the service, a director of Roan Capital; the *customer*, who sets the
requirements and owns the outcomes, Roan Capital's project lead, who
confirmed the requirement document; the *users*, its credit officers,
committees, finance staff and accountant (RC-34). People are named only
in its own records.

**Its roles** (FS-811): the eight positions in the prototype, agreed by
the owner, designed against our controls. Every position is a role set in
its position-to-roles table (handbook HB-10); a function a few people
also hold is a role added to their position, never a position of its own.

| Position | What it does | What it never does |
|---|---|---|
| Loan Officer | Onboards clients, drafts and submits applications, house visits, follow-ups | Approves anything |
| Credit Manager | Approves a loan's first stage; may originate | Approves an application it originated, or two stages of one (MD-06) |
| Head Office | Approves the second stage | Releases the payout of a loan it approved (MF-11, MD-06) |
| Chief Executive Officer | Approves the third stage; flags' override (MD-07); write-offs and payment reversals, each as a request a second person decides | Acts alone on money |
| Finance / Cashier | Prepares payouts (the maker); matches an unidentified payment to its loan on the rail's record; the morning's sign-off (JN-17) | Records a repayment without a rail record behind it; releases a payout it prepared |
| Collections Officer | Works the collection ladder: calls, visits, promises to pay, logged | Records repayments; contacts anyone but the borrower and guarantor (reg 30) |
| Auditor | Reads everything, the audit log included | Changes anything |
| Super Admin | Creates and disables users; settings that move no money | Approves, grants an approval role, changes a product alone (a product version needs two people, lender-rules §2.4) |

**With three or four staff** (FS-982), each person holds several
positions; the approval engine still refuses anyone deciding their own
request or two steps in a row, and a chain it cannot fill with distinct
people is refused at submission (approval-engine §4). Proposed, to
confirm (open answers 35 to 41):

| Person, with four staff | Holds | Never |
|---|---|---|
| CEO | Final approval above the threshold; overrides; a product approver; approves role changes; deputy for the morning sign-off | Originates; prepares payouts |
| Credit Manager | First approval; originates up to the threshold only; product owner; collections; complaints, except on loans it decided | Approves what it originated; approves a product it drafted |
| Loan Officer | Originates; collections; creates and disables users | Approves anything; grants roles |
| Finance / Cashier | Prepares payouts; matches payments; the morning sign-off; a product approver | Approves loans; records a repayment without a rail record |

**Never folded:** the originator never approves; whoever prepares a
payout never approved the loan; the user administrator never grants
roles; the drafter of a product never approves it; Dibon holds no role.
**With three staff,** the Loan Officer's work is the Credit Manager's,
and above the threshold Finance gives the second approval as a recorded
exception. **Compensating controls:** a payout goes only to the
borrower's verified account, for the net amount the system computes;
the CEO receives the day's payouts and overrides; recon computes every
loan on its own. **The auditor** is outside the staff: the external
auditor or a board member, read-only. **Absence** is the real risk:
each approval role needs a named second holder (FS-898).

**Functions to assign within the positions** (proposed, to confirm): the
access approver (HB-11) and the finance lead, the Chief Executive
Officer; the complaints handler (JN-08) and the compliance officer, the
Credit Manager, never for a loan it decided. The prototype's "everything"
for the Super Admin, and its repayments recorded by hand, are not carried
over (FS-807).

## 8 · Changelog

Releases of this delivery, newest first, each named by its date
(FS-838, FS-845; rules, Dibon 12): major when something is agreed or
re-agreed (its requirements and scope, the contract, a go-live), minor
for a batch worth telling, patch for a correction. Its first major
release comes when Roan Capital agrees the requirements and the scope.
Releases before 2026.10.15 were set down afterwards, from the
documents; they were first numbered 0.1 to 0.5.

### 2026.10.15 · minor

**Decided:** the eight roles to design on (FS-811); the product
vocabulary, and the 30-day loan drafted, typed and checked against the
regulations (FS-813 to FS-830); the NDA in force, and the licence
questions held for a senior management meeting (FS-827).

**Changed:** this map takes the customer template: open answers split
into open and answered, documents by DR id, people and roles in §7, this
changelog; open answers 28 to 30 added, and 10, 21, 28 and 29 partly
answered from the application form (FS-831).

**Exchanged:** the signed sender ID request (DR-006); the loan
application form received (DR-007); for the product and operations
meeting of 15 October, the questionnaires and the agenda (DR-012 to
DR-015); our versions 0.1 and 0.2 of the application form, with a
schedule of the changes (DR-017 to DR-019).

**Status:** Documents 19 (2 record kept, 5 original kept, 1 record to keep, 3 working internal, 1 working withdrawn, 7 working draft); open answers 26 open, 4 answered. The first dated release: nothing earlier to compare.

### 2026.10.03 · minor

**Changed:** this delivery map begun: the requirement document read
against our capabilities, the MVP's exclusions, and the open answers
(FS-395 onward; our review, DR-009).

**Status:** before versions were tracked.

### 2026.09.07 · minor

**Decided:** at kickoff, the requirement document confirmed; collateral
handled by hand at first, with maker-checker approvals; a KYC
verification provider to choose; weekly reviews.

**Exchanged:** the kickoff summary and next steps (DR-008).

**Status:** before versions were tracked.

### 2026.08.20 · minor

**Exchanged:** the business requirement document, v1.0, with the
executed NDA (DR-001).

**Status:** before versions were tracked.

### 2026.08.04 · minor

**Exchanged:** the NDA, sent on 31 July and returned signed on 4 August
(DR-002, DR-003).

**Status:** before versions were tracked.

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](../law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 27 | reg 27(1) | Thirty days' notice to the Central Bank before a new delivery channel rolls out, with the mobile money account, apps and bank accounts to be used; a way to opt out of marketing messages; channels that are available, safe, protected from fraud, easy to use and affordable |
| reg 28 | reg 28(3) | Applications considered under the credit policy, ability to repay assessed and no reckless lending (28(1)); a refusal given at once, with reasons (28(2)); a loan may be restructured on the borrower's request or with prior notice (28(3)) |
| reg 29 | reg 29 | What can be recovered on a non-performing loan is capped at the principal then owing, interest up to that principal, and reasonable recovery costs; the cap is measured from the last time the loan became non-performing (29(3)); interest under a court order after the order is outside it (29(4)) |
| reg 30 | reg 30 | No harassing, shaming or threatening collection: nothing posted to shame a borrower (30(1)(d)), no messages to their contacts (30(1)(e)), no calls outside working hours, no taking of essential personal effects (30(1)(k)); no charges not disclosed in the contract (30(2)); land security recovered under the Land Act (30(3)); thirty days' notice before selling movable security (30(4)) |
| reg 39 | reg 39(1), reg 39(3) | A receipt for every transaction, a free loan statement on request and a way to see it at any time (39(1)); errors corrected promptly (39(2)); a guarantor kept informed through periodic statements (39(3)) |
| reg 42 | reg 42 | A guarantor's consent sought and obtained before the appointment; recourse to a guarantor only after non-judicial recovery from the borrower is exhausted, and after fourteen days' notice of the default |
| reg 47 | reg 47(1)(d), reg 47(2) | Product information fair, clear and current, and easily available at branches, websites and every channel (47(1)(d)); the lender says it is regulated by the Central Bank, and shows its company name |
| reg 48 | reg 48 | A key information document for each product: its benefits, risks, terms and conditions, in summary |
| reg 54 | reg 54(4)(h), reg 54(7) | At signing, the customer receives the agreement, the repayment schedule and the total cost of credit; the agreement states the loan, charges, rates, the APR, early repayment without charge (54(4)(h)) and more (54(4)); a variation needs thirty days' notice and the borrower's acceptance (54(7)) |
| reg 55 | reg 55 | Pricing parameters and credit terms change only with the Central Bank's prior written approval, after thirty days' notice to the customer and the customer's acceptance |
| reg 56 | reg 56(3), reg 56(4) | A repayment credited on the day it is paid, applied to due principal, then fees and charges, then interest; early repayment, in whole or part, without notice or penalty (56(3)), and no interest for the remaining term on full early repayment (56(4)) |
| reg 63 | reg 63 | Customer due diligence, identity verified from independent source documents; for a transaction not face to face, the identity document is that of the person actually transacting (63(2)); a guard against impersonation (63(3)) |
| reg 64 | reg 64 | Compliance with the Proceeds of Crime and Anti-Money Laundering Act and the Prevention of Terrorism Act, on pain of the Central Bank's penalties |

**[LR-14](../law/LR-14.md) The Proceeds of Crime and Anti-Money Laundering Regulations, 2023, Legal Notice No. 153 of 2023.** Regulator: The Financial Reporting Centre, with each institution's supervisor. Made under: The Proceeds of Crime and Anti-Money Laundering Act (Cap. 59A). In force: Yes. Version read: as at 2023-11-17, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2023/153/eng@2023-11-17).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 21 | reg 21 | Simplified customer due diligence only where lower risk has been identified by an adequate risk analysis, and never where money laundering or financing of terrorism is suspected, or in a higher-risk scenario |
