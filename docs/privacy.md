---
id: privacy
name: Privacy register — what personal data we process, why, and for how long
kind: register
version: 0.1.0
owner: Compliance and risk officer
classification: Internal
review_ids: [FS-063, FS-480, FS-485, FS-497]
last_reviewed: 2026-10-06
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
  we help the institution answer within the time the regulations set (to
  read in LR-18 and set here).
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
| PR-01 | Onboarding and KYC: ID and passport checks, documents, business registration | identity ID-01 to ID-07; collect CO-02; mfi MF-02; sacco SC-01 | Customers, members, borrowers, directors | Restricted (ID numbers, documents); Confidential | Legal obligation (due diligence, POCAMLA) | 7 years after the relationship ends (POCAMLA s.46) | Needed | Only if an identity vendor processes abroad: named when chosen (SD-11) |
| PR-02 | Payments and the ledger: collections, payouts, balances, statements | rails; collect; gateway; core; escrow | Customers, members, payers and payees | Confidential | Contract; legal obligation (records) | 7 years (POCAMLA s.46; NPS Act s.26) | Needed (financial behaviour at scale) | No |
| PR-03 | Credit decisions: applications, appraisal, approvals, arrears, collections | mfi; core; mandates; crb | Borrowers, guarantors | Confidential; Restricted where ID numbers | Contract; legal obligation (lender rules, credit reporting) | 7 years after the loan closes | Needed (automated decisions, mfi MF-29) | No |
| PR-04 | Credit bureau submissions and lookups | crb; mfi MF-19 | Borrowers | Confidential | Legal obligation (CRB regulations, LR-06; LR-03 reg 33) | As the bureau regulations set | Needed | No |
| PR-05 | Sanctions and PEP screening, monitoring, cases and reports | financial-crime FC-01 to FC-15 | Customers, members, counterparties | Restricted (suspicion about a person) | Legal obligation (POCAMLA; Prevention of Terrorism Act) | 7 years (POCAMLA s.46) | Needed (watch lists) | Only if a PEP data vendor processes abroad: named when chosen |
| PR-06 | Phone-number and SIM checks: operator name match, IMSI binding | identity ID-05, ID-12 to ID-14; rails RL-22 | Customers, members | Confidential | Legal obligation and legitimate interest (fraud prevention) | Open (FS-063) | Needed | No |
| PR-07 | Messages: one-time codes, reminders, receipts, campaigns | messaging | Customers, members | Confidential (phone numbers, message content) | Contract; consent for marketing (messaging MS-11) | Open (FS-063) | Not needed | No |
| PR-08 | Field captures: visits, photos of collateral, location | omni-channel OC-17 to OC-19 | Borrowers, members, field officers | Confidential (location, photos) | Contract; legitimate interest (verifying collateral) | Open (FS-063) | Needed (location) | No |
| PR-09 | Bank channel: a business's reconciled cash flow shared with its bank | sme-recon; docs/bank-channel.md | SME owners and their counterparties | Confidential | Consent, separate and per purpose | Until consent is withdrawn | Needed | No |
| PR-10 | Analysis and AI questions over governed metrics | insights | Customers, members, staff | As the source; Restricted never reaches a model (IN-10) | Legitimate interest (running the institution) | As the source | Needed (models) | Only a hosted model, for data classes allowed to leave (IN-08) |
| PR-11 | Service desk requests and the AI agent | docs/operating-model.md; business-suite BS-01 | Customers' staff, members | Confidential | Contract | Open (FS-063) | Needed (AI agent) | Depends on the model chosen (FS-476) |
| PR-12 | Dibon's own data: staff and payroll, leads, customers' contacts | business-suite BS-01, BS-12 (for Dibon) | Staff, prospects, contacts | Confidential | Contract; legitimate interest (sales) | Open (FS-063) | Not needed | No |
| PR-13 | Security events, access logs and endpoint telemetry | access AC-11; platform-security SE-13, SE-18 | Staff, customers' users | Confidential | Legitimate interest and legal obligation (security) | Open (FS-063) | Not needed | Telemetry to the managed-detection service: where it is processed is to confirm (Liquid list, item 9) |
| PR-14 | Signed transaction events for traceability | recon-observability RO-23 to RO-25 | Payers and payees | Confidential; never Restricted values in an event | Legal obligation (records) | 7 years, as PR-02 | Covered by PR-02 | No |
| PR-15 | Backups of all the above | platform-security SE-10, SE-20 to SE-22 | All of the above | As the source | As the source | Expire with the source's retention; nothing restored beyond it | Covered by its source | No: two Kenyan sites |
| PR-16 | Banking by chat and the chatbot on WhatsApp | omni-channel OC-16, OC-20; messaging MS-06 | Customers, members | Confidential (balances, statements, loan status); never Restricted | Contract; consent to use WhatsApp for banking | Open (FS-063) | Needed (a transfer out of Kenya, and an AI agent) | **Yes:** the WhatsApp Business Platform is Meta's and processes outside Kenya; proof of safeguards to the Data Commissioner before it starts (s.48), and the member told (FS-487) |
| PR-17 | Investor loan tapes: pseudonymised loan-level data an institution shares with its funders | insights IN-17 | Borrowers | Confidential | The institution's legitimate interest or contract with its funder, to confirm per institution | As the data-sharing agreement sets, no longer than the funding | Needed | Only if a funder is abroad: the institution's transfer, under s.48 |

## Open

- Retention periods marked open (FS-063), with the compliance and risk
  officer.
- An impact-assessment template, and the assessments marked Needed, before
  each goes live: PR-01, PR-02 and PR-05 first, because Roan Capital's
  release depends on them (docs/delivery-plan.md R1).
- The time to answer a rights request, from the regulations (LR-18).
