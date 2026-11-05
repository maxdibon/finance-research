---
id: data-protection-policy
name: Data protection policy — template for an institution's licence application to CBK
kind: guide
status: living
law: LR-03
released: unreleased
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-1080, FS-1087, FS-1092, FS-1100, FS-1103, FS-1108]
last_reviewed: 2026-11-05
---

# Data protection policy · template DC-FS-TM-DPR-004

The data protection policy CBK asks of a lender applying for its
licence, to go with its certificate of registration from the Office of
the Data Protection Commissioner (the [licence pack](cbk-licence-pack.md),
item ii; FS-1080). The institution is the data controller for its
customers' data; we are its processor for the platform. The policy is the
institution's own, in its look; what the platform does for it comes from
our [privacy register](../governance/privacy.md), the
[document catalogue](../governance/documents.md) and the
[vault](../specs/vault.md). Built with `tools/policies/build.js`.

**The certificate is the institution's own:** it registers as a data
controller with the Data Commissioner; no template stands in for it.

| Value | What it is | Roan Capital's, for example |
|---|---|---|
| `institution`, `institution_legal`, `version`, `date`, `classification`, `owner`, `approved_by`, `provider` | As in the ICT policy template | |
| `privacy_lead` | The person or position responsible for data protection | To confirm |
| `registration` | Its registration with the Data Commissioner: number and date | To confirm |
| `relationship_end` | When a customer stops being its customer, for retention (OB-COM-26) | One year with nothing live, proposed |
| `contact` | Where customers write about their data | To confirm |
| `processors` | Its processors, beyond the provider | To confirm |

<!-- document -->
# Data Protection Policy

| Document control | |
|---|---|
| Document number | {{number}} |
| Version | {{version}}, draft for review, {{date}} |
| Classification | {{classification}} |
| Owner | {{owner}}, {{institution_legal}} |
| Approved by | {{approved_by}} |
| Prepared with | {{provider_legal}}, the provider of the lending platform |
| Registration with the Data Commissioner | {{registration}} |
| Responsible for data protection | {{privacy_lead}} |
| Review | At least once a year, and after any material change in how personal data is processed |

## 1. Purpose and scope

This policy sets how {{institution}} collects, uses, keeps, shares and deletes personal data, so that it is processed lawfully, fairly and transparently, as the Data Protection Act and the Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026 require. It covers the personal data of applicants, borrowers, guarantors, staff, and the people who act for business customers, in every system and on paper, and applies to every member of staff, contractor and processor.

## 2. Roles

| Who | Their part |
|---|---|
| {{institution}} | The data controller: decides why and how personal data is processed, and answers for it |
| {{privacy_lead}} | Oversees this policy; advises staff; answers data subjects; keeps the records; the contact for the Data Commissioner |
| {{provider}} | The processor that runs the lending platform: processes personal data only on {{institution}}'s instructions, under a written agreement |
| Every member of staff | Handles personal data only as their work needs and this policy allows; reports a suspected breach at once |

## 3. Principles

Personal data is processed lawfully, fairly and transparently; collected for explicit, specified and legitimate purposes and not used for others; adequate, relevant and limited to what is needed; accurate and kept up to date; kept no longer than needed; and kept secure (Data Protection Act s.25).

## 4. What is collected, and why

| Data | Whose | Why | Lawful basis |
|---|---|---|---|
| Identity: name, ID number, date of birth, photo; phone number and SIM checks | Applicants, borrowers, guarantors | To know who the customer is, and to prevent fraud and money laundering | Legal obligation; the contract |
| Financial: bank and mobile money statements, income, business records | Applicants, borrowers | To assess the ability to repay | The contract; legal obligation |
| Collateral: vehicle and land records, valuations, insurance, tracker details | Borrowers | To secure and later release the loan | The contract |
| Loans and payments | Borrowers, guarantors | To lend, collect, reconcile and report | The contract; legal obligation |
| Credit information shared with credit reference bureaus | Borrowers | As the regulations require | Legal obligation (reg 33) |
| Communications and complaints | Customers | To serve customers and resolve complaints | The contract; legal obligation |
| Marketing preferences | Customers who agree | To send offers | Consent, given separately |
| Staff records and sign-in events | Staff | To employ, and to secure the systems | The contract; legitimate interest |

Personal data is collected from the person directly where possible, and from another source only where the law allows (Data Protection Act s.28). Before collecting it, the person is told what is collected, why, who receives it, how long it is kept and their rights (Data Protection Act s.29). No personal data is processed without a lawful basis (Data Protection Act s.30).

## 5. Consent

Where {{institution}} relies on consent, it is express, specific, asked for separately on its own form, recorded, and as easy to withdraw as to give; a privacy notice is never taken as consent (reg 58; Data Protection Act s.32). Consent to marketing is separate from the loan, and refusing it never affects a loan.

## 6. Sensitive data and automated decisions

- Biometric data (a selfie or liveness check matched to an ID photo) is sensitive personal data: collected only for identity verification, kept in the encrypted document vault, and seen only by the roles that verify.
- A credit decision is not made by automated processing alone: a person reviews it, the customer is told the main reasons for a refusal, and may ask for it to be reconsidered (Data Protection Act s.35; reg 28; reg 60).
- An impact assessment is carried out before any processing likely to put people's rights at high risk, such as identity checks with biometrics, or tracking a vehicle's location (Data Protection Act s.31).

## 7. Data subjects' rights

Every person may be told how their data is used, see it, object to its processing, and have false or misleading data corrected or deleted (Data Protection Act s.26). Requests go to {{contact}}, are answered within the time the law sets, and are recorded. A customer may see their own documents and statements on their own pages, and keep their records up to date (reg 45).

## 8. Sharing

- Personal data is shared only with those who need it for the purposes in section 4: licensed credit reference bureaus (reg 33), the Central Bank of Kenya and the Financial Reporting Centre as the law requires, the mobile money operators (Safaricom, Airtel, Telkom) and {{institution}}'s banks to move money, identity verification providers, and the processors named in {{institution}}'s register.
- No personal data is shared with a borrower's contacts, employer or family to collect a debt, and nothing is posted to shame a borrower (reg 30).
- Every processor works under a written agreement: only on {{institution}}'s instructions, data kept in Kenya, sub-processors only with approval, breaches reported within 48 hours, and data returned or erased when the agreement ends. Processors: {{provider}}; {{processors}}.

## 9. Transfers outside Kenya

Personal data is kept in Kenya. It is transferred out of Kenya only where appropriate safeguards are proved (Data Protection Act s.48); notifications and links sent by SMS, WhatsApp and email carry no documents, balances or ID numbers.

## 10. Retention and deletion

Personal data is kept only as long as its purpose and the law require (Data Protection Act s.39): transaction and customer due diligence records seven years from the end of the relationship or the transaction, and twelve years from default for a secured loan written off or sent to recovery. A customer relationship ends when the person has had no live loan or guarantee for {{relationship_end}}. At the end of the period the data is deleted, with its copies and backups, by the system itself; a legal hold stops the clock while a dispute or investigation lasts.

## 11. Security

Personal data is protected as {{institution}}'s ICT policy sets: in Kenya, in {{institution}}'s own instance; encrypted in transit and at rest, government ID numbers field by field; access only by named accounts with two factors, by role, each opening of a document recorded; tested before go-live and every year. Customer data is printed only when a task needs it; every print job waits at the printer for its owner's PIN, printed pages are locked away and shredded when no longer needed, and original documents held as security are kept locked, each movement recorded.

## 12. Breaches

A suspected breach is reported at once to {{privacy_lead}}. The processor tells {{institution}} within 48 hours (within 24 hours by its agreement); {{institution}} notifies the Data Commissioner within seventy-two hours of becoming aware of a breach with a real risk of harm, and tells the people affected, with what happened and what they can do (Data Protection Act s.43). Every breach is recorded, with its cause and what was done.

## 13. Training, compliance and review

Staff are trained in data protection when they join and every year. Compliance is checked by the quarterly access review and a yearly review of this policy; a breach of the policy may lead to disciplinary action. The policy is reviewed at least once a year and approved by the board.
<!-- end -->

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](../law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 28 | reg 28 | Applications considered under the credit policy, ability to repay assessed and no reckless lending (28(1)); a refusal given at once, with reasons (28(2)); a loan may be restructured on the borrower's request or with prior notice (28(3)) |
| reg 30 | reg 30 | No harassing, shaming or threatening collection: nothing posted to shame a borrower (30(1)(d)), no messages to their contacts (30(1)(e)), no calls outside working hours, no taking of essential personal effects (30(1)(k)); no charges not disclosed in the contract (30(2)); land security recovered under the Land Act (30(3)); thirty days' notice before selling movable security (30(4)) |
| reg 33 | reg 33 | Customers' credit information shared with licensed credit reference bureaus, timely, complete and accurate; no negative listing for an amount of one thousand shillings or less (33(3)) |
| reg 45 | reg 45 | Customers' personal and contact records updated from time to time, and at least every two years (45(a)); reliable services, channels and customer-facing staff |
| reg 58 | reg 58 | Personal data processed lawfully, fairly and transparently; consent express, specific, separately obtained on its own form, withdrawable and recorded; a privacy notice is not consent |
| reg 60 | reg 60 | Where artificial intelligence makes lending decisions: decisions explained, customers told they are dealing with a machine, human oversight kept, bias assessed, models robust and explainable, data protected |

**[LR-17](../law/LR-17.md) The Data Protection Act (Cap. 411C).** Regulator: Office of the Data Protection Commissioner. Made under: An Act of Parliament. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2019/24/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 25 | s. 25 | The principles of data protection: personal data processed lawfully, fairly and transparently, for explicit purposes, limited to what is necessary, accurate, kept no longer than needed, secure, and not transferred out of Kenya without safeguards |
| s. 26 | s. 26 | A data subject's rights: to be told how their data is used, to see it, to object to its processing, and to have false or misleading data corrected or deleted |
| s. 28 | s. 28 | Personal data collected directly from the person (28(1)), or from another source only where the section allows (a public record, their consent, crime prevention and others); and only for a lawful, specific and explicit purpose |
| s. 29 | s. 29 | Before collecting personal data, as far as practicable, the person is told their rights, that data is being collected and why, who else will receive it and with what safeguards, the holder's contacts, the security measures, whether giving it is voluntary or required by law, and what follows if they do not |
| s. 30 | s. 30 | No processing without a lawful basis: the person's consent for a stated purpose, or necessity for a contract, a legal obligation, vital interests, a public task or another ground the section lists |
| s. 31 | s. 31 | An impact assessment before processing likely to put people's rights at high risk, describing the processing, its necessity, the risks and the safeguards |
| s. 32 | s. 32 | Whoever relies on consent proves it was given for the purpose; consent can be withdrawn at any time; it is not freely given where a service is made to depend on consent to processing it does not need |
| s. 35 | s. 35 | A person may refuse a decision based solely on automated processing, profiling included, that has legal effects on them or significantly affects them, unless it is needed for a contract, authorised by law with safeguards, or consented to; then they are told, and may ask for a person to reconsider it |
| s. 39 | s. 39 | Personal data kept only as long as needed for its purpose, unless the law, a lawful purpose or the person's consent requires longer; then deleted, erased, anonymised or pseudonymised |
| s. 43 | s. 43 | A breach with a real risk of harm notified to the Data Commissioner within seventy-two hours, and to the person affected; a processor tells the controller within forty-eight hours where practicable (43(3)) |
| s. 48 | s. 48 | Personal data transferred out of Kenya only with proof of appropriate safeguards given to the Data Commissioner, or where the transfer is necessary on a ground the section lists |
