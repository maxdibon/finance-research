---
id: cbk-licence-pack
name: CBK licence pack — the policies and documents a lender submits, and the template for each
kind: guide
status: living
law: LR-03
released: unreleased
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-1080, FS-1087, FS-1091]
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

No provisions cited.
