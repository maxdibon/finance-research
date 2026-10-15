---
id: journeys
name: User journeys — what a person goes through, step by step
kind: index
status: living
released: 2026.10.15
owner: Solution architect
classification: Internal
review_ids: [FS-548, FS-558, FS-637, FS-668, FS-680, FS-684, FS-689, FS-763, FS-765, FS-768, FS-769, FS-773, FS-776, FS-782, FS-783, FS-784]
last_reviewed: 2026-10-13
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
6. **A status and its evidence** (FS-668): `status` is draft, agreed (the
   owner's go), validated (walked through with real users, named in
   `validated_with`) or tested (its acceptance items pass).
7. **§1 states a target, the moments that matter, and the data:** the
   end-to-end time we hold ourselves to; the two or three moments where
   the person is anxious or decides whether to trust us; and what
   personal data the journey collects, with its privacy rows.
8. **Every step names the messages it sends,** by template id from the
   messaging catalogue (docs/specs/messaging.md §4), or "—".
9. **§3 says what happens when someone stops partway:** what is kept, for
   how long, how they resume, and when it lapses.
10. **Every journey is listed below.**

**Checked against the GOV.UK Service Standard's questions, in our words**
(not enforced by the tool): does it solve the whole problem, not one
screen? Is it joined up across the channels the person uses? Is it as
simple as it can be? Can everyone use it, including those who do not
read easily (docs/experience.md)? Has it been tried with real people? Is
it tested end to end?

Copy [_template.md](_template.md) and keep every heading.

| Id | Journey | Release | File |
|---|---|---|---|
| JN-01 | An individual borrower, verified electronically | R1 | [electronic-identity-check.md](electronic-identity-check.md) |
| JN-02 | A borrower verified by hand: the manual route | R1 | [manual-identity-check.md](manual-identity-check.md) |
| JN-03 | A business borrower: registry, directors, beneficial owners | R1 | [business-borrower.md](business-borrower.md) |
| JN-04 | A loan from application through approval, signing and disbursement | R1 | [loan-to-disbursement.md](loan-to-disbursement.md) |
| JN-05 | A guarantor: consent, statements and notice | R1 | [guarantor.md](guarantor.md) |
| JN-06 | A loan restructured | R1 | [restructuring.md](restructuring.md) |
| JN-07 | A borrower viewing and sharing their own documents | R1 | [own-documents.md](own-documents.md) |
| JN-08 | A complaint, against the 30-day clock | R1 | [complaint.md](complaint.md) |
| JN-09 | Self-sign-up by USSD into the lightest KYC tier | phase 2 | to write |
| JN-10 | A deposit paid to the institution's paybill or till | R2 | [deposit.md](deposit.md) |
| JN-11 | A transfer out through a larger bank: RTGS, EFT or SWIFT | R2 | [transfer-out.md](transfer-out.md) |
| JN-12 | A transfer in through a larger bank, identified and applied or returned | R2 | [transfer-in.md](transfer-in.md) |
| JN-13 | A bank disbursement, from release to settlement, return or recall | R1 | [bank-disbursement.md](bank-disbursement.md) |
| JN-14 | A loan settled: guarantors released, the registry notice cancelled, NTSA's joint registration removed, the originals handed back | R1 | [loan-settled.md](loan-settled.md) |
| JN-16 | An unplaced payment: the payer asked, escalated, returned at day 7 | R1 | [unplaced-payment.md](unplaced-payment.md) |
| JN-17 | The accountant's morning: the report, exceptions, reconciliation breaks, a held close | R1 | [accountant-morning.md](accountant-morning.md) |
| JN-18 | A member of staff joins, moves and leaves: roles by mandate, hardware keys | R1 | [staff-access.md](staff-access.md) |
| JN-19 | An outage: the institution on its fallback runbook, then everything brought back in | R1 | [outage.md](outage.md) |
| JN-20 | One of Dibon's engineers joins, moves and leaves: one central identity, hardware keys, access by ticket, GitLab and devices | R1 | [engineer-access.md](engineer-access.md) |
| JN-15 | A trader who does not read, paid to his own till, told by voice, saving and borrowing for stock | phase 2 | [micro-trader.md](micro-trader.md) |
