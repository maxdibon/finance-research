---
id: privacy
name: Privacy register — what personal data we process, why, and for how long
kind: register
status: living
law: LR-17
released: 2026.10.16
owner: Compliance and risk officer
classification: Internal
review_ids: [FS-063, FS-480, FS-485, FS-497, FS-532, FS-582, FS-591, FS-620, FS-689, FS-763, FS-768, FS-769, FS-995, FS-1004, FS-1018, FS-1071]
last_reviewed: 2026-11-01
---

# Privacy register — what personal data we process, why, and for how long

**What this is:** one row per processing activity across the platform, so
privacy is designed in, not added later (FS-480, FS-485; the fourth idea,
FS-484). It is the record a controller keeps and a regulator asks for,
built from the modules. The law: the Data Protection Act and its
regulations (law register LR-17 to LR-19).

**Who is who:** for its own customers' and members' data, **the
institution is the controller and Dibon its processor**. Dibon is the
controller only for its own data: its staff, its leads and its customers'
contacts (PR-12). A processor still answers for security, breach notice
within 48 hours (s.43(3)), impact assessments for high-risk processing
(s.31) and transfers out of Kenya (s.48).

## The rules we hold ourselves to

- **Lawful basis first** (s.30): every row names one: consent, contract,
  legal obligation, vital interest, public interest or legitimate
  interest. Consent is separate, specific and withdrawable, never bundled
  (and for lenders, CBK lender regulations reg 58, law register LR-03).
- **An impact assessment before high-risk processing** (s.31): national ID
  numbers and biometrics, financial behaviour at scale, automated credit
  decisions, location, and screening against watch lists. The column below
  says which rows need one.
- **No longer than needed** (s.39): each row has a retention period, or
  says it is open (FS-063). Where the law sets a minimum, such as seven
  years for transaction and due-diligence records (POCAMLA s.46, LR-13),
  that period and no more, unless the institution's own policy is longer.
- **Rights** (s.26): to be informed, to access, to object, and to have false
  or misleading data corrected or deleted. Requests go to the controller;
  we help the institution answer within the regulations' times (LR-18,
  read for FS-689): access within seven days, free, in a common
  electronic form where asked electronically (reg 9, LR-18); a correction within
  fourteen days, a refusal in writing with reasons within seven (reg 10, LR-18);
  data moved to another provider within thirty days, for a reasonable fee
  (reg 11, LR-18). A borrower's path is JN-07.
- **In Kenya** (s.48): personal data stays in Kenya. A transfer out, such
  as to a vendor or a managed-detection service abroad, is named in its row
  and needs proof of safeguards to the Data Commissioner before it starts.
- **Restricted data never in logs, samples or prompts** (architecture §7;
  insights IN-10).

## The register

**Impact assessment:** *Needed* (high risk, not yet done) · *Done* · *Not
needed*. **Retention:** where open, it is set with the compliance and risk
officer and the institution (FS-063).

| Id | Processing | Where | Data subjects | Data classes | Lawful basis | Retention | Impact assessment | Leaves Kenya? |
|---|---|---|---|---|---|---|---|---|
| PR-01 | Onboarding and KYC: ID and passport checks, documents, business registration | identity ID-01 to ID-07; collect CO-02; mfi MF-02; sacco SC-01 | Customers, members, borrowers, directors | Restricted (ID numbers, documents); Confidential | Legal obligation (due diligence, POCAMLA) | 7 years after the relationship ends (POCAMLA s.46, LR-13) | Needed | Only if an identity vendor processes abroad: named when chosen (SD-11) |
| PR-02 | Payments and the ledger: collections, payouts, balances, statements | rails; collect; gateway; core; escrow | Customers, members, payers and payees | Confidential | Contract; legal obligation (records) | 7 years (POCAMLA s.46, LR-13; NPS Act s.26, LR-11) | Needed (financial behaviour at scale) | No |
| PR-03 | Credit decisions: applications, appraisal, approvals, arrears, collections | mfi; core; mandates; crb | Borrowers, guarantors | Confidential; Restricted where ID numbers | Contract; legal obligation (lender rules, credit reporting) | 7 years after the loan closes | Needed (automated decisions, mfi MF-29) | No |
| PR-04 | Credit bureau submissions and lookups | crb; mfi MF-19 | Borrowers | Confidential | Legal obligation (CRB regulations, LR-06; LR-03 reg 33) | As the bureau regulations set | Needed | No |
| PR-05 | Sanctions and PEP screening, monitoring, cases and reports | financial-crime FC-01 to FC-15 | Customers, members, counterparties | Restricted (suspicion about a person) | Legal obligation (POCAMLA; Prevention of Terrorism Act) | 7 years (POCAMLA s.46, LR-13) | Needed (watch lists) | Only if a PEP data vendor processes abroad: named when chosen |
| PR-06 | Phone-number and SIM checks: operator name match, IMSI binding | identity ID-05, ID-12 to ID-14; rails RL-22 | Customers, members | Confidential | Legal obligation and legitimate interest (fraud prevention) | Open (FS-063) | Needed | No |
| PR-07 | Messages: one-time codes, reminders, receipts, campaigns | messaging | Customers, members | Confidential (phone numbers, message content) | Contract; consent for marketing (messaging MS-11) | Open (FS-063) | Not needed | No |
| PR-08 | Field captures: visits, photos of collateral, location | omni-channel OC-17 to OC-19 | Borrowers, members, field officers | Confidential (location, photos) | Contract; legitimate interest (verifying collateral) | Open (FS-063) | Needed (location) | No |
| PR-09 | Bank channel: a business's reconciled cash flow shared with its bank | sme-recon; docs/market/bank-channel.md | SME owners and their counterparties | Confidential | Consent, separate and per purpose | Until consent is withdrawn | Needed | No |
| PR-10 | Analysis and AI questions over governed metrics | insights | Customers, members, staff | As the source; Restricted never reaches a model (IN-10) | Legitimate interest (running the institution) | As the source | Needed (models) | Only a hosted model, for data classes allowed to leave (IN-08) |
| PR-11 | Service desk requests and the AI agent | docs/company/operating-model.md; business-suite BS-01 | Customers' staff, members | Confidential | Contract | Open (FS-063) | Needed (AI agent) | Depends on the model chosen (FS-476) |
| PR-12 | Dibon's own data: staff and payroll, leads, customers' contacts | business-suite BS-01, BS-12 (for Dibon) | Staff, prospects, contacts | Confidential | Contract; legitimate interest (sales) | Open (FS-063) | Not needed | No |
| PR-13 | Security events, access logs and endpoint telemetry | access AC-11; platform-security SE-13, SE-18 | Staff, customers' users | Confidential | Legitimate interest and legal obligation (security) | Open (FS-063) | Not needed | Telemetry to the managed-detection service: where it is processed is to confirm (Liquid list, item 9) |
| PR-14 | Signed transaction events for traceability, and the audit trail across modules built from them, actions outside transactions included (sign-ins, role changes, document views) | recon-observability RO-23 to RO-25, RO-27 | Payers and payees; staff, whose actions it records | Confidential; never Restricted values in an event | Legal obligation (records) | 7 years, as PR-02 | Covered by PR-02 | No |
| PR-15 | Backups of all the above | platform-security SE-10, SE-20 to SE-22 | All of the above | As the source | As the source | Expire with the source's retention; nothing restored beyond it | Covered by its source | No: two Kenyan sites |
| PR-16 | Notifications, links and the chatbot on WhatsApp | omni-channel OC-16, OC-20; messaging MS-06 | Customers, members | Confidential only as far as a phone number and a reference; never balances, statements, documents or Restricted data (architecture §7, FS-532) | Contract; consent to use WhatsApp for banking | Open (FS-063) | Needed (a transfer out of Kenya, and an AI agent) | **Yes:** the WhatsApp Business Platform is Meta's and processes outside Kenya; proof of safeguards to the Data Commissioner before it starts (s.48), and the member told (FS-487) |
| PR-17 | Investor loan tapes: pseudonymised loan-level data an institution shares with its funders | insights IN-17 | Borrowers | Confidential | The institution's legitimate interest or contract with its funder, to confirm per institution | As the data-sharing agreement sets, no longer than the funding | Needed | Only if a funder is abroad: the institution's transfer, under s.48 |
| PR-18 | Credit decisioning: statement metrics, behaviour scores and internal risk classes, which is profiling | decisioning DE-01 to DE-04; DE-06 in phase 2 | Borrowers and applicants | Confidential; forbidden inputs never read (social media, the characteristics the Act names in its definition of profiling) | Contract (assessing the loan asked for); the institution's legitimate interest for risk classes, to confirm per institution | With the loan file: 7 years, as PR-02 | Needed (profiling; whether the Act's impact-assessment duty applies is to confirm) | No |
| PR-19 | Complaints: the register, its clocks, the evidence gathered and the outcome | mfi MF-28; business-suite BS-01; JN-08 | Borrowers, guarantors, payers, anyone who complains; staff complained about | Confidential; Restricted where it alleges fraud or concerns a member of staff (the helpdesk's restricted team) | Legal obligation (lender regulations reg 40, LR-03) | 7 years after closing (documents DT-26, proposed) | Not needed | No |
| PR-20 | Staff accounts: identity, roles, authenticators and the history of every grant and exit, for an institution's staff and Dibon's engineers; a staff member's link, by ID number, to their own customer identity, used only to stop them deciding their own requests (FS-1018) | access AC-01, AC-02, AC-09, AC-16; business-suite BS-12; platform-security SE-26; JN-18 | Institutions' staff; Dibon's staff | Confidential | Contract (employment); legitimate interest (security); legal obligation (who approved what, kept with the records it touched) | The account while employed; its grants and exits 7 years after leaving, with the audit trail (proposed) | Not needed | No |
| PR-21 | Partner data: what a partner holds about a borrower and shares, with the borrower's consent, for a credit decision: a distributor's record of a retailer's purchases, a mobile operator's scores | lending-service §5; mfi MF-42 | Borrowers and applicants who buy from or subscribe to a partner | Confidential; raw files never past the intake | The person's consent, recorded before any of their data is used, given for each partner apart unless the institution sets it once for partners named then, never future ones (FS-1004; LQ-22), and the data-sharing agreement with the partner | Raw files as the data-sharing agreement says, at most 90 days; the metrics with the loan file, as PR-18 | Needed with PR-18 (profiling on data from a third party) | No |
| PR-22 | A vehicle's location from its tracker, and where a repossessed vehicle is kept | lending-service §5.2; lender-rules §2.11 | Borrowers, and whoever drives the vehicle | Confidential (location) | Open: the security agreement's consent, the contract or legitimate interest (LQ-34) | No live location held; each lookup, made only in recovery, kept with the possession log | Needed (location; LQ-34) | No |

## Open

- Retention periods per document are now proposed in docs/governance/documents.md
  (FS-537); rows here still marked open follow it once confirmed.
- Retention periods marked open (FS-063), with the compliance and risk
  officer.
- An impact-assessment template, and the assessments marked Needed, before
  each goes live: PR-01, PR-02 and PR-05 first, because Roan Capital's
  release depends on them (docs/delivery/delivery-plan.md R1).
- The time to answer a rights request, from the regulations (LR-18).

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](../law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 33 | reg 33 | Customers' credit information shared with licensed credit reference bureaus, timely, complete and accurate; no negative listing for an amount of one thousand shillings or less (33(3)) |
| reg 40 | reg 40 | A complaints mechanism made known to customers; acknowledgement within seven days where a complaint cannot be dealt with promptly; an oral complaint unresolved after forty-eight hours confirmed in writing; resolution within thirty days |
| reg 58 | reg 58 | Personal data processed lawfully, fairly and transparently; consent express, specific, separately obtained on its own form, withdrawable and recorded; a privacy notice is not consent |

**[LR-11](../law/LR-11.md) The National Payment System Act (Cap. 491A).** Regulator: Central Bank of Kenya. Made under: An Act of Parliament. In force: Yes. Version read: as at 2025-11-04, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2011/39/eng@2025-11-04).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 26 | s. 26 | The Central Bank, settlement system participants and the operators of payment systems keep every record from operating a payment system or issuing a payment instrument for seven years from the record's date; electronic records suffice |

**[LR-13](../law/LR-13.md) The Proceeds of Crime and Anti-Money Laundering Act (Cap. 59A).** Regulator: The Financial Reporting Centre, with each institution's supervisor. Made under: An Act of Parliament. In force: Yes. Version read: as at 2025-11-04, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2009/9/eng@2025-11-04).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 46 | s. 46 | A reporting institution keeps records of every transaction and of the evidence of each customer's identity, in the account holder's correct name, for at least seven years from the transaction or the end of the relationship, or longer where the Centre asks (46(4)) |

**[LR-17](../law/LR-17.md) The Data Protection Act (Cap. 411C).** Regulator: Office of the Data Protection Commissioner. Made under: An Act of Parliament. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2019/24/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 26 | s. 26 | A data subject's rights: to be told how their data is used, to see it, to object to its processing, and to have false or misleading data corrected or deleted |
| s. 30 | s. 30 | No processing without a lawful basis: the person's consent for a stated purpose, or necessity for a contract, a legal obligation, vital interests, a public task or another ground the section lists |
| s. 31 | s. 31 | An impact assessment before processing likely to put people's rights at high risk, describing the processing, its necessity, the risks and the safeguards |
| s. 39 | s. 39 | Personal data kept only as long as needed for its purpose, unless the law, a lawful purpose or the person's consent requires longer; then deleted, erased, anonymised or pseudonymised |
| s. 43 | s. 43(3) | A breach with a real risk of harm notified to the Data Commissioner within seventy-two hours, and to the person affected; a processor tells the controller within forty-eight hours where practicable (43(3)) |
| s. 48 | s. 48 | Personal data transferred out of Kenya only with proof of appropriate safeguards given to the Data Commissioner, or where the transfer is necessary on a ground the section lists |

**[LR-18](../law/LR-18.md) The Data Protection (General) Regulations, 2021, Legal Notice No. 263 of 2021.** Regulator: Office of the Data Protection Commissioner. Made under: The Data Protection Act (Cap. 411C). In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2021/263/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 9 | reg 9 | A data subject may ask whether their data is processed and see it, with its purposes, recipients, retention and source; access given within seven days, in a common electronic form where asked electronically |
| reg 10 | reg 10 | Untrue, inaccurate, outdated, incomplete or misleading data corrected within fourteen days, free of charge; a refusal given in writing, with reasons, within seven days |
| reg 11 | reg 11 | A data subject's data moved, on request, to another holder of their choosing within thirty days, for a reasonable fee no more than the cost; a refusal given in writing, with reasons, within seven days |
