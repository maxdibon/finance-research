---
id: cbk-licence-pack
name: CBK licence pack — the policies and documents a lender submits, and the template for each
kind: guide
status: living
law: LR-03
released: unreleased
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-1080, FS-1087, FS-1091, FS-1095, FS-1097]
last_reviewed: 2026-11-05
---

# CBK licence pack

What the Central Bank of Kenya asks a lender to submit with its licence
application (its Bank Supervision Department's list, September 2026),
and how we prepare each for an institution we serve (FS-1080, FS-1087).
Roan Capital is the first (due 6 November 2026). Every lender we serve
that applies will be asked the same, so each document has a template;
an institution's values and its theme make its own.

| # | CBK asks for | Whose | Made from |
|---|---|---|---|
| i | An agreement with a telecommunication or other service provider for the digital credit channel or platform | The institution and us | Our services agreement, with the clauses the [approval pack](../governance/approval-pack.md) lists (items 11 to 14); its paybill agreement with Safaricom may also count |
| ii | A data protection policy, and the certificate of registration from the Office of the Data Protection Commissioner | The institution | [Data protection policy](data-protection-policy.md), template DC-FS-TM-004; **the certificate is its own registration** |
| iii | A credit, code of ethics and market conduct policy | The institution | [Credit, code of ethics and market conduct policy](credit-conduct-policy.md), template DC-FS-TM-005 |
| iv | An ICT policy covering fourteen areas, with a description of the ICT system, independent assurance on it, a systems architecture diagram and a data flow diagram | The institution, on the platform we run | [ICT policy](ict-policy.md), template DC-FS-TM-003, with the two diagrams as images and the plan for assurance in its Annex D |

**What the licence application adds** (FS-1095). CBK's first list is a
start; the application itself carries what the regulations list: reg 6
for a licence (initial capital of twenty million shillings or more), reg
9 for a registration. Beyond the four above:

| Asked for | Licence (reg 6(2)) | Registration (reg 9(3)) | Whose | Made from |
|---|---|---|---|---|
| Statements on complying with Part VII of the Consumer Protection Act and Part VI of the Competition Act | (f), (g) | (f), (g) | The institution | [Statements](compliance-statements.md), template DC-FS-TM-006 |
| The delivery channels described | (l) | (q) | The institution, with us | [Delivery channels](delivery-channels.md), template DC-FS-TM-007, which is also the notice reg 27 asks for |
| Its products and their terms; its operations (loan sizes, rate ranges, classification, the non-performing period); its pricing parameters | (m), (p), (cc) | (j), (u) | The institution | Its product versions (docs/products/) |
| Consumer protection policies, with the complaints redress | (o), (t) | (o) | The institution | Part C of the credit, ethics and conduct policy, to grow into its own template |
| A code of conduct | (s) | (t) | The institution | Part B of the same policy |
| Anti-money laundering and counter-terrorist financing policies | (u) | (k) | The institution | To write: a template, from financial-crime |
| Corporate governance policies | (x) | (n) | The institution | To write: a template |
| Business continuity plans | — | (v) | The institution, with us | Its fallback runbook; the ICT policy's 5.13, 5.14 |
| Capital: evidence, source, funding and debt-to-equity, a sworn declaration | (h), (i), (q), (y) | (h), (i) | The institution | — |
| Company documents; fit and proper forms, with good conduct, tax and credit reports | (a) to (d), (j), (aa), (bb), (dd) | (a) to (d), (r), (w) | The institution | — |

Around the application, the Central Bank is told thirty days ahead of
any third party investing in or financing the lender (reg 22(4)), of an
outsourcing (reg 31), and of a new delivery channel (reg 27).

**On top of what goes:** a [submission index](submission-index.md),
template DC-FS-TM-008: every item above, enclosed now or to follow with
the application.

**Building one:**

```
node tools/policies/build.js docs/templates/<template>.md <values.json> <out.docx>
```

- **The values** are a JSON file kept with the institution's client folder,
  outside git (`clients/<institution>/working/cbk/values.json`), each
  template's table naming the keys it takes. A key left out, or written
  as "[To confirm: …]", comes out highlighted.
- **The look** is the institution's theme, named in the values
  (`"theme": "design/system/themes/<institution>.json"`), or the plain
  theme until it has one (design-system, "Whose look a document takes";
  `design/system/institution-docx.js`).
- **Its numbers:** each policy carries the institution's own document
  number (`numbers` in the values, by template), never ours: its own
  scheme, or its document code, POL and a serial, such as ROAN-POL-001
  (design-system §7; OB-COM-28).
- **The diagrams** are images beside the values, `architecture.png` and
  `dataflow.png`, drawn for the institution from its deployment.
- **Each built document** is registered in the document register as our
  working draft for the institution, and reviewed by the team before it
  goes.

**What no template can supply:** the certificate of registration with
the Data Commissioner; the board's approval of each policy; and, before
go-live, the independent assurance itself (ICT policy, Annex D).

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](../law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 6 | reg 6, reg 6(2) | A licence, for a lender with initial capital of at least twenty million shillings, applied for in Form 1 with: its incorporation documents and registered address; its certificate of registration with the Data Commissioner; statements on complying with Part VII of the Consumer Protection Act and Part VI of the Competition Act; evidence and source of capital; its ICT system and delivery channels described; its products and their terms; the draft agreement with a delivery-channel provider; its consumer protection measures and complaints redress; its operations (loan sizes, interest rates, classification, the non-performing period); its funding and debt-to-equity ratio; its credit policy, code of conduct, consumer protection, anti-money laundering, data protection, ICT security and corporate governance policies; a sworn declaration on the source of funds; the fees; fit and proper forms for directors, the CEO, senior officers and significant shareholders, with certificates of good conduct, tax compliance certificates and credit reports; and its pricing parameters (6(2)(a) to (dd)) |
| reg 9 | reg 9, reg 9(3) | Registration, for a lender that does not meet the conditions for a licence, applied for in Form 2 with much the same as reg 6, the policies as briefs, and its business continuity plans (9(3)(v)) |
| reg 22 | reg 22(4) | The Central Bank told at least thirty days before any agreement or arrangement with a third party to invest in the lender or finance its activities (22(4)); ten percent or more of its shares transferred only with the Central Bank's prior approval (22(5)) |
| reg 27 | reg 27 | Thirty days' notice to the Central Bank before a new delivery channel rolls out, with the mobile money account, apps and bank accounts to be used; a way to opt out of marketing messages; channels that are available, safe, protected from fraud, easy to use and affordable |
| reg 31 | reg 31 | Material services may be outsourced, but never the final decision to lend, management and control, the board's decisions, determining compliance with the law (31(1)(d)), or managing the loan book; the lender stays liable for its provider; the Central Bank told thirty days before, with the provider's background, owners and directors (31(3)); the contract gives the Central Bank oversight of, and access to, the provider's premises, books, records, systems and staff (31(5)) |
