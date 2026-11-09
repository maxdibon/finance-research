# Transactions: the model's typed form

**Model version 1.0** (FS-1131). The typed form of
[the transactions spec](../../docs/specs/transactions.md) and
[its field dictionary](../../docs/transaction-fields.md). As with
[lender rules](../lender-rules/README.md), these files move to the code
repository when it is created, and are read from it at a pinned version;
until then this is the only copy.

| File | What it is |
|---|---|
| [transaction.schema.json](transaction.schema.json) | A transaction's header, body and footer, each's fields in groups one level deep (FS-1149), and the building blocks they are made of, in JSON Schema |
| [rules.js](rules.js) | What a schema cannot say: the body unchanged since approval, the reference's check digits (ISO 7064 MOD 97-10), one txid per idempotency key, links that resolve and point back, forward facts on each target's footer, reversals within the original, parts that sum, charges, settled amounts and allocations that add up, states in order, approval and checks (the operator, the number's binding, the SIM) before money moves; and `position()`, what reversals and refunds leave of a transaction (spec §5) |
| [examples.json](examples.json) | Nine worked transactions, W1 to W9, each with its position, the instances the spec's tables show; and for each rule, a change to them that breaks it. Generated, with hashes and check digits computed; the people, numbers and receipts are fictional |

**Who reads them.** The docs' check (`node tools/check.js`,
"transactions") on every commit: the schema in the validator's subset;
every field and building block a row of the dictionary, and every row in
the schema; every component map's field a field of the dictionary; every
code the examples use listed in the dictionary; the worked set valid and
breaking no rule, each position as computed, and each rule's change breaking it. Recon runs the link rules each night (recon §4.8). In the code: each
service's contract tests, and the producer's check before it publishes.

**The schema's subset** is lender rules' (`tools/products/validate.js`).
`additionalProperties: false` holds a producer to its version; a reader
validates against the version its event names and holds what it does not
know (spec rule 10).

**Changing the model** changes three things together: the dictionary's
row, the schema, and the examples; a minor version adds, a major one runs
beside the old under new event names (spec rule 10).
