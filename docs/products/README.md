---
id: products
name: Products — product version documents, while drafts have nowhere restricted to live
kind: index
version: 0.1.0
owner: Delivery lead
classification: Internal
review_ids: [FS-802, FS-805, FS-806, FS-816, FS-817]
last_reviewed: 2026-10-14
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

| Step | Run | Notes |
|---|---|---|
| Build the questionnaires | `node tools/products/questionnaires.js docs/products/<draft>.md` | Needs the docx package (`npm install docx` anywhere; DOCX_MODULE points at it). Writes build/products/, one Word document per group, a form field per item still to answer. Render one and look at every page before sending |
| Send them | To the institution's product owner, credit lead and operations lead | The file itself comes back, not an email of answers |
| Keep what comes back | In clients/<institution>/ | Client material: never in git |
| Read one back | `node tools/products/read-back.js clients/<institution>/<file>.docx` | Reports what was answered, what changed a value we had, what needs a person, and what is still open by kind. Add `--write` to merge the answers into the draft, each with the source "<institution>, <date>" |

The read-back never overwrites: an answer with a comment, a "not right"
with no correction, an option that wants detail and has none, or a new
answer to an item already answered all wait for a person. Reading the
same file twice changes nothing.

| Institution | Product | Version | Status | Document |
|---|---|---|---|---|
| Roan Capital | 30-day loan | 1 | Draft | [roan-capital-30-day-loan-v1.md](roan-capital-30-day-loan-v1.md) |
