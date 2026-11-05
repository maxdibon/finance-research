---
id: delivery-channels
name: Delivery channels — template describing a lender's channels for its licence application and its notice to CBK
kind: guide
status: living
law: LR-03
released: unreleased
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-1095, FS-1097, FS-1100, FS-1102, FS-1103, FS-1105, FS-1106, FS-1108, FS-1109]
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
| `mpesa`, `airtel`, `tkash`, `banks` | What is live at launch on each rail, both ways, and what follows | M-Pesa live both ways; Airtel Money and T-Kash both ways once integrated; NCBA Bank both ways, and further banks as accounts open |
| `whatsapp` | Whether WhatsApp is used, and for what | To confirm |
| `field_visits` | How officers record a visit | On a work-profile phone, in the browser; photos through the secure upload link, into the vault |
| `website` | Its website's address, and who builds and hosts it | Built by Dibon on Odoo Website, hosted in Kenya; the address to confirm |

<!-- document -->
# Delivery Channels and Platforms

| Document control | |
|---|---|
| Document number | {{number}} |
| Version | {{version}}, draft for review, {{date}} |
| Owner | {{owner}}, {{institution_legal}} |
| Approved by | {{approved_by}} |

## 1. Summary

{{institution}} delivers its credit through a lending platform operated for it by {{provider}}: its staff work in web applications; borrowers and guarantors reach their own pages by secure links on their phones; repayments come in, and payouts go out, by mobile money and by bank transfer, through the rails section 3 lists; every screen works in the common browsers (Chrome, Edge, Firefox, Safari) on computers and phones. The channels start with {{launch}}. This description is given to the Central Bank of Kenya with {{institution}}'s application, and as its notice of the channels thirty days before they are rolled out (reg 27).

## 2. The channels

| Channel | Who uses it | What it is for | How it is secured |
|---|---|---|---|
| Website | Anyone | Who {{institution}} is and how to reach it; its products with their terms and key information documents; a loan calculator priced from the same product versions as live loans; a request form, with consent, that a credit officer follows up; complaints; the privacy notice; that it is regulated by the Central Bank of Kenya | {{website}}; behind the hosting provider's managed firewall, over HTTPS; the request form collects only what a first contact needs |
| Staff workspace (web) | {{institution}}'s staff | Applications, collateral, documents, approvals, disbursements, collections, reports | Through the edge only; a password and an authenticator app or security key; each role sees only its work; every act recorded |
| Kapu Console (web) | Approvers; staff when the back office is unavailable | Approvals, and read-only views | As the staff workspace; every approval re-authenticated |
| Customer pages (web, on the customer's phone) | Borrowers and guarantors | Consent, the key facts and the agreement to read and sign, statements, documents, the amount to settle | Opened from a link, with a code from an authenticator app or by SMS to the phone bound at enrolment; each opening recorded |
| SMS | Borrowers and guarantors, on Safaricom, Airtel and Telkom | Reminders, receipts, one-time codes, links to their own pages; never a balance, a document or an ID number | Under {{institution}}'s registered sender ID, from approved templates, within quiet hours |
| Email | Borrowers, guarantors and business customers who give an address | Notices and links to their own pages, never documents | From approved templates |
| WhatsApp | {{whatsapp}} | Notifications and links only | Through the official WhatsApp Business service |
| Mobile money | Borrowers | Both ways: repayments into {{institution}}'s own paybill or till; disbursements to the borrower's own wallet | Each payment confirmed by the operator's authenticated callback, or by a status query, and matched to the loan; each payout only to the approved number, for the approved amount, released by a second person |
| Bank transfer | Borrowers and business borrowers | Both ways: disbursements to the borrower's own account; repayments by transfer into {{institution}}'s accounts | Through {{institution}}'s own banks, under maker-checker: prepared by one person, released by another, only to the approved account for the approved amount; every bank's statement reconciled |
| Field visits | Loan officers, at borrowers' business premises and homes | Seeing the business and the collateral; notes of the visit; photos of the premises, the collateral and documents | {{field_visits}} |
| The office | Borrowers, guarantors | Applications, collateral originals, collecting released documents | Identity checked against the record; originals kept in a locked cabinet, each movement recorded |

## 3. Payment rails, live and to come

The platform reaches every payment rail through one interface, with an adapter for each operator and each bank, so a new rail or a new bank is added without changing how {{institution}}'s staff or customers work. Every rail carries money both ways: a borrower may repay through any live rail, and be disbursed to through any live rail, to the wallet or account they nominated and {{institution}} approved.

| Rail | What it carries | At launch |
|---|---|---|
| M-Pesa (Safaricom) | Repayments to {{institution}}'s paybill or till; disbursements to wallets | {{mpesa}} |
| Airtel Money (Airtel) | The same | {{airtel}} |
| T-Kash (Telkom) | The same | {{tkash}} |
| Bank transfers: EFT, RTGS and PesaLink | Disbursements to bank accounts; repayments by transfer | {{banks}} |

**Adding a rail or a bank.** Its integration is tested end to end and its first payments reconciled before customers see it; {{institution}} approves it; its credentials are held in the key management system; and the Central Bank of Kenya is told thirty days ahead where it counts as a new delivery channel (reg 27). {{institution}} may bank with several banks: each is connected the same way, its statements reconciled daily, and payouts sent through whichever the staff choose for each.

## 4. What is not offered

No mobile app, USSD menu or agent network is used at launch. A new channel is added only after the Central Bank has had thirty days' notice of it.

## 5. Where it runs

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
