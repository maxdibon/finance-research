---
id: customer-template
name: <Customer> — delivery map
kind: delivery
status: living
released: unreleased
owner: Delivery lead
classification: Internal
review_ids: [FS-837, FS-838, FS-845]
last_reviewed: 2026-10-15
---

# <Customer> · delivery map

What we are delivering to one customer, against what it asked for, and
where it stands. Every customer page has these eight sections, in this
order; the check holds the headings (FS-837). Customers.md links each
page from its row (CU id).

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

| # | Question | Raised | Status |
|---|---|---|---|

### Answered

| # | Question | Raised | Status |
|---|---|---|---|

## 5 · Its products

Its product version documents (docs/products/), by status.

## 6 · Documents

Its documents by DR id, grouped: the engagement, requirements, products,
working documents, meetings.

## 7 · People and roles

Its roles in ITIL's terms (sponsor, customer, users) and its positions,
by role, never by name.

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
