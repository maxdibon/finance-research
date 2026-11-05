---
id: delivery-channels
name: Delivery channels — template describing a lender's channels for its licence application and its notice to CBK
kind: guide
status: living
law: LR-03
released: unreleased
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-1095, FS-1097, FS-1100]
last_reviewed: 2026-11-05
---

# Delivery channels · template DC-FS-TM-CHN-007

The description of the channels and platforms a lender delivers its
services through, which its licence or registration application carries
(reg 6, reg 9), and which the Central Bank must have thirty days before a
new channel is rolled out (reg 27; the [licence pack](cbk-licence-pack.md);
FS-1095). From the institution's deployment and our
[channels register](../market/channels.md). Built with
`tools/policies/build.js`.

| Value | What it is | Roan Capital's |
|---|---|---|
| `institution`, `institution_legal`, `number`, `version`, `date`, `owner`, `approved_by`, `provider` | As in the ICT policy template | ROAN-DSC-CHN-001 |
| `launch` | When the channels start, and how | A soft launch on 30 November 2026, the current process in parallel for about a month |
| `paybill`, `bank` | Its collection paybill and its payout bank | Its own M-Pesa paybill; NCBA Bank |
| `whatsapp` | Whether WhatsApp is used, and for what | To confirm |

<!-- document -->
# Delivery Channels and Platforms

| Document control | |
|---|---|
| Document number | {{number}} |
| Version | {{version}}, draft for review, {{date}} |
| Owner | {{owner}}, {{institution_legal}} |
| Approved by | {{approved_by}} |

## 1. Summary

{{institution}} delivers its credit through a lending platform operated for it by {{provider}}: its staff work in web applications; borrowers and guarantors reach their own pages by secure links on their phones; repayments come through M-Pesa and payouts go through {{bank}}. The channels start with {{launch}}. This description is given to the Central Bank of Kenya with {{institution}}'s application, and as its notice of the channels thirty days before they are rolled out (reg 27).

## 2. The channels

| Channel | Who uses it | What it is for | How it is secured |
|---|---|---|---|
| Staff workspace (web) | {{institution}}'s staff | Applications, collateral, documents, approvals, disbursements, collections, reports | Through the edge only; a password and an authenticator app or security key; each role sees only its work; every act recorded |
| Kapu Console (web) | Approvers; staff when the back office is unavailable | Approvals, and read-only views | As the staff workspace; every approval re-authenticated |
| Customer pages (web, on the customer's phone) | Borrowers and guarantors | Consent, the key facts and the agreement to read and sign, statements, documents, the amount to settle | Opened from a link, with a code from an authenticator app or by SMS to the phone bound at enrolment; each opening recorded |
| SMS | Borrowers and guarantors | Reminders, receipts, one-time codes, links to their own pages; never a balance, a document or an ID number | Under {{institution}}'s registered sender ID, from approved templates, within quiet hours |
| Email | Borrowers, guarantors and business customers who give an address | Notices and links to their own pages, never documents | From approved templates |
| WhatsApp | {{whatsapp}} | Notifications and links only | Through the official WhatsApp Business service |
| M-Pesa paybill | Borrowers | Repayments | {{paybill}}; each payment confirmed by Safaricom's authenticated callback and matched to the loan |
| Bank transfer | Borrowers, through {{institution}}'s staff | Payouts to the borrower's own account, and bank repayments | Through {{bank}}, under maker-checker: prepared by one person, released by another, only to the approved account for the approved amount |
| The office | Borrowers, guarantors | Applications, collateral originals, collecting released documents | Identity checked against the record; originals kept in a locked cabinet, each movement recorded |

## 3. What is not offered

No mobile app, USSD menu or agent network is used at launch. A new channel is added only after the Central Bank has had thirty days' notice of it.

## 4. Where it runs

The platform runs in Kenya, at two sites, behind the hosting provider's managed firewall; customer data stays in Kenya. Its full description, architecture and data flow are in {{institution}}'s ICT policy.
<!-- end -->

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](../law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 6 | reg 6 | A licence, for a lender with initial capital of at least twenty million shillings, applied for in Form 1 with: its incorporation documents and registered address; its certificate of registration with the Data Commissioner; statements on complying with Part VII of the Consumer Protection Act and Part VI of the Competition Act; evidence and source of capital; its ICT system and delivery channels described; its products and their terms; the draft agreement with a delivery-channel provider; its consumer protection measures and complaints redress; its operations (loan sizes, interest rates, classification, the non-performing period); its funding and debt-to-equity ratio; its credit policy, code of conduct, consumer protection, anti-money laundering, data protection, ICT security and corporate governance policies; a sworn declaration on the source of funds; the fees; fit and proper forms for directors, the CEO, senior officers and significant shareholders, with certificates of good conduct, tax compliance certificates and credit reports; and its pricing parameters (6(2)(a) to (dd)) |
| reg 9 | reg 9 | Registration, for a lender that does not meet the conditions for a licence, applied for in Form 2 with much the same as reg 6, the policies as briefs, and its business continuity plans (9(3)(v)) |
| reg 27 | reg 27 | Thirty days' notice to the Central Bank before a new delivery channel rolls out, with the mobile money account, apps and bank accounts to be used; a way to opt out of marketing messages; channels that are available, safe, protected from fraud, easy to use and affordable |
