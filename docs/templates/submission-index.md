---
id: submission-index
name: Submission index — template listing what a lender gives CBK, enclosed now or to follow with its application
kind: guide
status: living
law: LR-03
released: unreleased
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-1095, FS-1097, FS-1100]
last_reviewed: 2026-11-05
---

# Submission index · template DC-FS-TM-CBK-008

A one-page index that goes on top of what a lender sends the Central
Bank before its application: everything the regulations will ask for,
each marked enclosed now or to follow with the application, so the Bank
sees the lender knows the whole of it (the [licence pack](cbk-licence-pack.md);
FS-1095). Each status is a value; a status left out comes out "[To
confirm]". Built with `tools/policies/build.js`.

| Value | What it is |
|---|---|
| `institution`, `institution_legal`, `number`, `version`, `date`, `owner` | As in the ICT policy template |
| `route` | A licence (reg 6) or a registration (reg 9) |
| `s_` keys | Each item's status, as the table's last column names them |
| A table's widths | `<!-- widths: 46, 22, 32 -->` on the line before a table sets its columns' shares, in percent |

<!-- document -->
# Submission Index

| Document control | |
|---|---|
| Document number | {{number}} |
| Version | {{version}}, {{date}} |
| Owner | {{owner}}, {{institution_legal}} |

{{institution_legal}} submits the documents marked enclosed, as the Central Bank of Kenya asked, ahead of its application for {{route}} under the Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026. The rest follow with the application.

<!-- widths: 46, 22, 32 -->
| Item | Document | Status |
|---|---|---|
| ICT policy, with the description of the ICT system, the systems architecture and data flow diagrams, and the plan for independent assurance | {{n_ict}} | {{s_ict}} |
| Data protection policy | {{n_dp}} | {{s_dp}} |
| Certificate of registration with the Data Commissioner | — | {{s_certificate}} |
| Credit policy, with the code of ethics and market conduct | {{n_credit}} | {{s_credit}} |
| Agreement with the provider of the delivery channel and platform | — | {{s_agreement}} |
| Statements on the Consumer Protection Act and the Competition Act | {{n_statements}} | {{s_statements}} |
| Delivery channels and platforms | {{n_channels}} | {{s_channels}} |
| Products, their terms, the operations and the pricing parameters | — | {{s_products}} |
| Consumer protection policy and complaints redress | — | {{s_consumer}} |
| Anti-money laundering and counter-terrorist financing policy | — | {{s_aml}} |
| Corporate governance policy | — | {{s_governance}} |
| Business continuity plan | — | {{s_bcp}} |
| Capital: evidence, source, funding and a sworn declaration on the source of funds | — | {{s_capital}} |
| Company documents, and fit and proper forms with certificates of good conduct, tax compliance certificates and credit reports | — | {{s_fitproper}} |
<!-- end -->

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](../law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 6 | reg 6 | A licence, for a lender with initial capital of at least twenty million shillings, applied for in Form 1 with: its incorporation documents and registered address; its certificate of registration with the Data Commissioner; statements on complying with Part VII of the Consumer Protection Act and Part VI of the Competition Act; evidence and source of capital; its ICT system and delivery channels described; its products and their terms; the draft agreement with a delivery-channel provider; its consumer protection measures and complaints redress; its operations (loan sizes, interest rates, classification, the non-performing period); its funding and debt-to-equity ratio; its credit policy, code of conduct, consumer protection, anti-money laundering, data protection, ICT security and corporate governance policies; a sworn declaration on the source of funds; the fees; fit and proper forms for directors, the CEO, senior officers and significant shareholders, with certificates of good conduct, tax compliance certificates and credit reports; and its pricing parameters (6(2)(a) to (dd)) |
| reg 9 | reg 9 | Registration, for a lender that does not meet the conditions for a licence, applied for in Form 2 with much the same as reg 6, the policies as briefs, and its business continuity plans (9(3)(v)) |
