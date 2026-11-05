---
id: customer-template
name: Customer name — delivery map
kind: delivery
status: living
released: unreleased
owner: Delivery lead
classification: Internal
review_ids: [FS-837, FS-838, FS-845, FS-1053, FS-1091]
last_reviewed: 2026-11-05
---

# Customer name · delivery map

What we are delivering to one customer, against what it asked for, and
where it stands. Every customer page has these eight sections, in this
order, after a short "At a glance"; the check holds the headings
(FS-837). Customers.md links each page from its row (CU id).

**At a glance** (FS-1053)

| | |
|---|---|
| Customer | Its CU id, what it is, and its stage (customers.md) |
| What we deliver | The products, and the release they come in (delivery-plan) |
| Its products | Its product versions and their status (§5) |
| Where it runs | Its deployment, and its availability model (docs/deployments/) |
| Now | What is happening this week, in a line |
| Waiting on it | How many open answers are its to give (§4) |
| Waiting on us | How many are ours, or counsel's |
| Its last release | The newest entry in §8 |
| Document code | The code its own documents are numbered by (code, kind, serial), three to eight letters, unique across our customers; or its own numbering scheme (OB-COM-28, FS-1091) |

## 1 · The engagement

What it is, for whom, on which products; the key facts with their
documents by DR id (the agreement, the NDA, the requirement document).

## 2 · Requirements against capabilities

Each requirement (a customer-prefixed id), the document and section it
comes from (a DR id), the capabilities that meet it, and its fit:
Covered, Partial or Gap.

## 3 · Out of scope

What the customer asked for that this delivery does not include, and
where it goes instead.

## 4 · Open answers

### Open

By who answers (FS-1053): the customer's senior management, the
customer, then us (with counsel where it is a reading of the law). Each
group a table of its own, under its name in bold; the numbers never
change.

**For the customer:**

| # | Question | Raised | Status |
|---|---|---|---|

### Answered

| # | Question | Raised | Status |
|---|---|---|---|

## 5 · Its products

Its product version documents (docs/products/), by status.

## 6 · Documents

Where its documents are held, then the table: every document registered
for it in the document register, generated (FS-857); those in force
first, and those replaced or withdrawn after, under "Earlier versions"
(FS-1053). Register a
document there, or with dibon received or dibon meeting, never here.

*Generated from the [document register](../governance/document-register.md) by tools/docregister.js: edit the register, never this table.*

No documents registered yet.

## 7 · People and roles

Who is on it at Dibon, by name and role (FS-903): the delivery lead
first. Then its roles in ITIL's terms (sponsor, customer, users) and its
positions, by role, never by name: its people's names and contacts are
in Dibon's Odoo, open to the project's team.

## 8 · Changelog

Releases of this delivery, newest first, each named by its date
(FS-845): major when something is agreed or re-agreed (requirements and
scope, the contract, a go-live), minor for a batch worth telling
(decisions, answers, documents exchanged, a meeting's outcomes), patch
for a correction. A release gathers the change notes for this customer,
on the owner's word: `node tools/cut.js <customer-id>`, then tagged.

### YYYY.MM.DD · minor

**Decided:** what was decided.
**Changed:** what changed in this map.
**Exchanged:** documents, by DR id.
**Status:** to stamp
