# Lender rules: the first files of its code repository

**These files move to lender rules' code repository when it is created**
(FS-825), and from then on live only there: this folder is deleted in
the same change, and this repository's pipeline reads them from the code
repository at a pinned version. Until then this is the only copy. Edit
them here, through a merge request, as you would there.

| File | What it is |
|---|---|
| [product-vocabulary.schema.json](product-vocabulary.schema.json) | The typed form of every term of the product vocabulary (product-versions §4): each value's fields and allowed values, in JSON Schema |
| [rules.js](rules.js) | The rules across terms that a schema cannot express (minimum below maximum, a default period within reg 57, no early-repayment charge), each citing its source |
| [rules.examples.json](rules.examples.json) | Worked examples for every rule, one that breaks it and one that does not; any implementation must pass them all |

**Who reads them.** The docs' check (`node tools/check.js`, "products")
validates every product draft's typed block against them on each commit:
what we propose, the options we offer, and every value an institution
settles. The read-back (`tools/products/read-back.js`) validates an
answer before writing it. In the code: the back office's product form,
the `product.version` approval and activation (product-versions §3).

**The schema's subset.** The docs' validator
(`tools/products/validate.js`, written because this repository installs
no packages) reads `type`, `enum`, `const`, `properties`, `required`,
`additionalProperties`, `items`, `minItems`, `uniqueItems`, `minimum`,
`maximum`, `exclusiveMinimum`, `pattern`, `anyOf`, `$ref` and `$defs`,
and refuses any other keyword, so it and the code's full validator can
never read the schema differently.

**The rules' language.** They are JavaScript because the check runs
them. If lender rules is written in another language, its own
implementation must pass rules.examples.json, which is the shared truth,
as lender-rules §2.9's worked examples are.

**Changing a term** changes three things together: its row in
product-versions §4, its definition in the schema, and any product draft
that uses it. The check fails a term in one and not the other.
