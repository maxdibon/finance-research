---
id: architecture-2026-11-11
name: The architecture, reviewed — 11 November 2026
kind: review
status: draft
released: unreleased
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-1187]
last_reviewed: 2026-11-11
---

# The architecture, reviewed · 11 November 2026

**What was reviewed:** the architecture's documents (README, constraints,
context, deployment, flows, instance, interfaces, quality, risks,
runtime, technology) against what was decided since the last review on
27 October ([that review](architecture-2026-10-27.md)): the transaction
model and its dictionary (FS-1119 to FS-1166), the rails spec and its
security (FS-1155 to FS-1162, FS-1167), the treasury module, its books
and rulebooks (FS-1164 to FS-1182), corporate treasury and Kapu Business
(FS-1183, FS-1186), and one writer per kind of account (FS-1184).
**Not reviewed:** whether each decision is right; code, of which there is
none; the specs themselves, beyond where the architecture should cite
them.

**The short answer:** the architecture's structure holds: nothing decided
since needs a new layer, a new authority or a change to the custody line.
But it has not caught up. The transaction model, the shape every money
event now carries, appears nowhere in it; treasury is named in §1 and
nowhere else (no store, no place in the instance or on the bus); the
custody line does not place treasury or Kapu Business; the context, the
interfaces, the quality goals and the risks predate the rails spec, the
new outside parties and the new regulators. Sixteen findings follow; all
are corrections or additions, none a redesign.

## 1 · Findings

| Id | Finding | Proposed |
|---|---|---|
| A1 | **The transaction model is not in the architecture.** Every money event now carries a transaction (FS-1142), each field defined once in the dictionary and typed in `code/transactions/`, a header, body and footer, a body hashed at approval; README §6 and the interfaces page say only that events are signed CloudEvents with a txid | §6 a paragraph on the model; the interfaces page a rule: a money event's data is a transaction, validated against the schema its `dataschema` names, every field from the dictionary (transactions rules 1, 10) |
| A2 | **Treasury has no place but a word in §1.** It is a service with its own records (books, positions, forecasts, rulebooks, funding, investments), so it is a store, a database and a box: none of the stores table, the instance's components and stores, or §6's diagram has it | A store row; the instance's components table and its count (seventeen databases per instance, not sixteen; the services cluster); a TREASURY entry in §6's money box |
| A3 | **"The only writer" survives where the rule changed.** The instance page (its diagram and components table) and the quality goals ("one writer, kapu-core-fineract §8") still say the lending service is the only writer; FS-1184 made it one writer per kind of account, enforced by the core adapter's list | The instance and quality pages restated; the R1 deployment diagrams left, as in R1 the lending service is the only writer |
| A4 | **The custody line places neither treasury nor Kapu Business.** Treasury instructs movements between the institution's own accounts; Kapu Business makes a business's payments from its own accounts and reads its banks; a payment to someone else is a customer's instruction from its account at the institution (FS-1152) | Rows in §3's table: treasury, initiation on the institution's own accounts, no custody of ours; Kapu Business, initiation as SME Recon's (FS-037), with LQ-42; payments, the institution's |
| A5 | **Money held for others is a new cross-cutting control.** "We hold no institution's money" is the rule for us; now the institutions we serve hold others' money (customers' money in trust, a fund's assets with its custodian, a vostro), and treasury proves each such book whole each day (TR-13) | §7 a control: a book held for others is never mixed with its holder's and is proved whole each day; a quality goal to measure it |
| A6 | **The context misses new outside parties and regulators.** Not drawn: fund systems and custodians (Lofty Corban's UnitMaster and its custodian), rate sources, a business's own banks (Kapu Business), the operators' confirmation of a number's network (FS-1144), the Communications Authority's numbering plan as a source; the regulators box names CBK, SASRA, ODPC and FRC but not the CMA, RBA or IRA | Rows in the context table, and the regulators box widened |
| A7 | **The interfaces page predates the rails' rules.** Not stated: a callback counts only when proved (rails rule 6) and its address is hardened (rule 12); the rails reach out only through their egress gateway (rule 11); a rail setting changes only through the approval engine (rule 13); every limit has one shape (FC-16) | Rules on the interfaces page, each citing its source |
| A8 | **The rails' egress gateway is not in deployment or technology.** Rails rule 11 sends every call to a rail through one egress gateway, from addresses registered with each rail; deployment names the outbound addresses but no gateway, technology no product for it | Deployment: the gateway, one per site, its addresses registered with Safaricom and each bank; technology: a choice to make (Cilium's egress gateway, or an Envoy egress proxy) |
| A9 | **Quality goals are missing for what was decided.** No goal for: a float that never runs out unseen (rails rule 14); a book held for others proved whole each day; every money event valid against its schema; an unknown settled within its rail's window; a peak day carried at its expected multiple (FS-1161) | Rows in the quality table, each with where it is met and how measured |
| A10 | **The risks page has not moved since 12 October.** Not on it: rulebooks read from CBK's 2013 guidelines that may since have been revised (FS-1173); Kenya Law and the RBA refusing scripts, so texts are fetched by hand (FS-1177); a business's payments needing a licence (LQ-42); investors' pools (LQ-38); Safaricom's SIM-swap access for an authorised partner, now that RL-22 is in R1 (FS-386); no known query for an operator to confirm a number (FS-1144); Daraja's callbacks unsigned (FS-209); the core adapter's writer list a point every posting passes | Rows on the risks page, each with its mitigation and register row |
| A11 | **Time and dates (§10) does not name the new types of day.** Peak and slow days are types of day on each institution's calendar, with their multiples (core KC-15), and the returns calendar sits on it (TR-16) | A line in §10 |
| A12 | **Kapu Business is a bundle §1 does not show.** §1 lists SME Recon and the business suite as products; Kapu Business is sold as one, of SME Recon, treasury's Business package, the gateway and the business suite (FS-1186) | A line under §1's table: what is sold as one, and which modules make it |
| A13 | **Where a hold is kept is not decided.** Holds are a companion record (transactions §2, dictionary §6), but no store owns them: a guarantor's pledge, an escrow's hold, a card's authorisation | Proposed: the service that owns the account keeps its holds, as it writes its postings (FS-1184), to the one hold schema; a line in the stores table |
| A14 | **The index that finds a transaction by any id has no store.** Transactions §6 gives it to reconciliation; the stores table's recon row does not list it | Added to recon's row |
| A15 | **The last review's A5 has moved.** Rails and the vault are written; the customer pages are still to write, and more now waits on them: the investor portal (FS-1170), the position of a reversed payment shown to its customer, a payout waiting for float | The customer pages first among the specs to write |
| A16 | **The rules-as-data pattern is now three.** Lender rules, the transaction model and treasury's rulebooks each keep a schema, rules and worked examples in `code/`, checked on every commit; the architecture does not name the pattern | §6 or §11 a line on the pattern, so a fourth is built the same way |

## 2 · What holds

The three authorities (§2), the custody line's test (§3), the ledger
modes (§4), the feeds (§5), the isolated instance per institution, the
event bus and its signing, the controls of §7 and the hosting (§9) all
carry what was decided without change. Treasury reads every system of
record and holds no money; the rails stay pass-through; Kapu Business
stays on the business's own accounts. Nothing decided since needs a
licence of ours that the custody line does not already raise.

## 3 · Next

The corrections A1 to A16, in the documents each names, once agreed
(FS-1187). A13 is a decision; the rest follow from decisions already
made.
