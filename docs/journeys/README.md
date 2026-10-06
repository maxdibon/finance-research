---
id: journeys
name: User journeys — what a person goes through, step by step
kind: index
version: 0.1.0
owner: Solution architect
classification: Internal
review_ids: [FS-548, FS-558]
last_reviewed: 2026-10-06
---

# User journeys

**What this is:** one file per journey, walking what a person goes
through from start to finish, step by step, with the capabilities each
step relies on (FS-548). The modules say what each capability does; a
journey shows whether they meet. A step that needs something outside the
journey's release is a gap, and a gap is written down, not discovered
in the build.

**Rules for these files** (the check tool enforces them):

1. **Every step cites the capabilities it relies on**, by id, or says
   "—" and is named in §4 Gaps.
2. **Statuses are never typed.** A journey does not say Built or Planned;
   each capability's status is in its module and changes there.
   `node tools/check.js --counts` prints each journey's statuses, computed.
3. **A journey has a release.** For R1, every capability cited in §2 or §3
   must be in R1 (docs/delivery-plan.md, "R1 in detail") and in phase 1;
   for R2 to R5, in phase 1. Anything else must be cited in §4 Gaps, with
   what happens in its absence. A journey in `phase 2` has no release
   rule.
4. **Roles, never names.** The institution's own role names where it has
   given them; otherwise the role's function.
5. **§2 opens with a flow diagram** in plain text: every step by its
   number at the start of a line, every §3 row as "(3x)", and no
   capability ids, so the table stays their one place (FS-558).
6. **Every journey is listed below.**

Copy [_template.md](_template.md) and keep every heading.

| Id | Journey | Release | File |
|---|---|---|---|
| JN-01 | An individual borrower, verified electronically | R1 | [electronic-identity-check.md](electronic-identity-check.md) |
| JN-02 | A borrower verified by hand: the manual route | R1 | [manual-identity-check.md](manual-identity-check.md) |
| JN-03 | A business borrower: registry, directors, beneficial owners | R1 | to write |
| JN-04 | A loan from application through approval, signing and disbursement | R1 | to write |
| JN-05 | A guarantor: consent, statements and notice | R1 | to write |
| JN-06 | A loan restructured | R1 | to write |
| JN-07 | A borrower viewing and sharing their own documents | R1 | to write |
| JN-08 | A complaint, against the 30-day clock | R1 | to write |
| JN-09 | Self-sign-up by USSD into the lightest KYC tier | phase 2 | to write |
| JN-10 | A deposit paid to the institution's paybill or till | R2 | to write |
