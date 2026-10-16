---
id: products
name: Products — product version documents, while drafts have nowhere restricted to live
kind: index
status: living
law: LR-03
released: 2026.10.15
owner: Delivery lead
classification: Internal
review_ids: [FS-802, FS-805, FS-806, FS-816, FS-817, FS-823, FS-825]
last_reviewed: 2026-10-16
---

# Products

Each product an institution offers on the platform is a product version
document (lender-rules §2.4). Its home is the institution's own instance
once approved, and before that its workspace in Dibon's Odoo Documents
(rules, Dibon 10). **This folder is the exception** (FS-806): drafts are
kept here, visible to the whole team and in the reader, until the
workspaces exist. They hold product terms and no personal data; anything
with personal data stays out.

**Each draft is data** (FS-816, FS-817): tables headed `| Id | Term | Value
| Source | Ask |` (Rule for group B, Setting for C), every ask one of
Confirm, Choose (its options split by " / "), Provide, Decide, or "—"
for nothing to answer. The check holds them to that form.

**And the product as data** (FS-823): below the tables, a fenced code block
labelled `json product-version`, one entry per term of the
vocabulary, keyed by its name in lower case with underscores
(`amount_limits`): `item`, the row's id; `proposed`, what we have;
`options`, a Choose's options typed, in the same order; `value`, what
the institution settled; `null` for a blank. The check fails an entry
that is not a vocabulary term or names no row, typed options that do not
match the row's, a value on a row still asked, a value with a blank, and
**a row the institution settled with no typed value**. **And it checks
every value** (FS-825): what we propose, each typed option and each
settled value against the vocabulary's schema, and the product as it
stands against the rules across terms (a minimum below its maximum, a
default period within reg 57, no early-repayment charge, and the rest),
both in [code/lender-rules/](../../code/lender-rules/README.md). The
read-back checks a typed value before writing it, and reports any rule
the answers would break.

| Step | Run | Notes |
|---|---|---|
| Build the questionnaires | `node tools/products/questionnaires.js docs/products/<draft>.md` | Needs the docx package (`npm install docx` anywhere; DOCX_MODULE points at it). Writes build/products/, one Word document per group, a form field per item still to answer. Render one and look at every page before sending |
| Send them | To the institution's product owner, credit lead and operations lead | The file itself comes back, not an email of answers |
| Keep what comes back | In `clients/<institution>/` | Client material: never in git |
| Read one back | `node tools/products/read-back.js clients/<institution>/<file>.docx` | Reports what was answered, what changed a value we had, what needs a person, and what is still open by kind. Add `--write` to merge the answers into the draft, each with the source `<institution>, <date>` |

The read-back never overwrites: an answer with a comment, a "not right"
with no correction, an option that wants detail and has none, or a new
answer to an item already answered all wait for a person. Reading the
same file twice changes nothing.

With `--write` it also writes the typed value where the answer carries
one: a confirmation takes the entry's `proposed`, a choice the matching
entry of `options`. A correction, an answer typed in, or a choice with a
blank is listed "to encode", and the check fails until a person writes
its `value` in the block. So the encoding happens in the same change as
the answers, never later.

| Institution | Product | Version | Status | Document |
|---|---|---|---|---|
| Roan Capital | 30-day loan | 1 | Draft | [roan-capital-30-day-loan-v1.md](roan-capital-30-day-loan-v1.md) |

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](../law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 57 | reg 57 | A loan is non-performing when principal or interest is outstanding thirty days past due, for a loan of thirty days or less, or ninety days, for a longer one (57(1)); the credit policy (57(2)) and each loan agreement (57(3)) state the default period |
