---
id: jn-04-loan-to-disbursement
name: JN-04 · A loan from application to disbursement
kind: journey
release: R1
owner: Solution architect
classification: Internal
review_ids: [FS-399, FS-400, FS-402, FS-516, FS-548, FS-551, FS-561, FS-564, FS-565, FS-569, FS-570]
last_reviewed: 2026-10-06
---

# JN-04 · A loan from application to disbursement

How a verified borrower's loan moves at Roan Capital in R1: application,
collateral, appraisal, the approval chain with its 3-of-3 committee
(RC-12), the offer with its key information document, signing, and the
money paid out under maker-checker. The borrower arrives from JN-01 or
JN-03; guarantors sign through JN-05. The lender rules are in
docs/specs/lender-rules.md; the approval engine in
docs/specs/approval-engine.md.

## 1 · Who and where

- **Who:** a verified borrower; Roan Capital's Credit Officer; the
  Business Credit Committee (three members, unanimous); the Head Office
  Committee above a set amount; the person who prepares a disbursement
  and the person who approves it.
- **Channel:** the back office for staff; committee members also from
  their email; the borrower signs on their own phone.
- **Starts when:** a verified borrower asks for a loan.
- **Ends when:** the money reaches the borrower, the loan is live in
  Kapu Core with its schedule, and the borrower has a receipt; or the
  application is declined, or the offer lapses.

## 2 · Steps

```
  1 Application: product, amount, tenor, purpose
        |-- above the tier's limit .............. refused (3a)
        v
  2 Collateral: logbook, searches, filed
        |-- logbook missing ..................... cannot go on (3b)
        |-- a search fails ...................... blocked (3c)
        v
  3 Appraisal: statements, the assessed limit
        |-- above the assessed limit ............ an override (3d)
        v
  4 Price: APR and key information document, from the product
        v
  5 Approval chain: officer, committee 3 of 3, head office
        |-- a member declines, or returns ....... (3e)
        |-- no one acts ......................... reminded (3f)
        v
  6 Offer signed: borrower and guarantors, code to their phone
        |-- not signed in time .................. lapses (3g)
        |-- product changed since approval ...... approved version (3h)
        v
  7 Disbursement prepared, and approved by a second person
        |-- same person ......................... refused (3k)
        |-- inside the end-of-day window ........ waits (3m)
        v
  8 Paid by M-Pesa or bank transfer; the loan posted with its schedule
        |-- payment fails or times out .......... queued; never twice (3i)
        |-- registered name differs ............. held (3j)
        v
  9 Receipt to the borrower
        v
 10 Chained, logged, kept; on the officer's book
        :
    No connection at any step ................. waits (3l)
```

| # | Step | Who | Capabilities |
|---|---|---|---|
| 1 | The Credit Officer opens the loan for a verified borrower: product, amount, tenor and purpose. The amount cannot exceed the borrower's tier limit | Credit Officer | MF-01, ID-19, KC-04 |
| 2 | For a secured product, the vehicle's logbook, the NTSA search and the collateral-registry search are captured and filed; the registry number is kept on the record. The committee cannot open the application until the logbook is attached (RC-09) | Credit Officer | MF-03, MF-04, ID-15 |
| 3 | The officer appraises the borrower from the statements on file and records an assessed limit with reasons | Credit Officer | MF-06, ID-15 |
| 4 | The platform prices the loan from the product version: the schedule, the APR and the total cost of credit, and generates the key information document | Platform | MF-23, KC-04, MF-34 |
| 5 | The application goes up its chain by product and amount: the Credit Officer, then the Business Credit Committee (three of three), then the Head Office Committee above the set amount. Each decision is recorded with identity, comment and time, re-authenticated at the act, and may be made from email; no one decides two steps in a row; an override always ends with the override authority | Approvers | MD-01, MD-02, MF-07, MD-09, MD-05, MD-06, MD-10, MD-18, MD-08 |
| 6 | The borrower, and any guarantors (JN-05), receive the agreement and the key information document as a link; they read the key information document and accept it before signing; they sign in Odoo Sign with a one-time code to their confirmed phone; the offered and signed versions are filed in the vault, and the email carries only a link | Borrower; guarantors | MF-34, BS-02, ID-11, ID-15, MS-19, MF-37 |
| 7 | A disbursement is prepared from the approved and signed loan only, and a second person approves it | Finance; approver | MF-11, KC-08 |
| 8 | The money is paid by M-Pesa B2C from Roan Capital's own shortcode, or by bank transfer through its bank; the loan is posted in Kapu Core with its schedule | Platform | RL-03, RL-07, MF-11, KC-04 |
| 9 | The borrower receives a receipt by SMS with a link to their own page | Platform | MF-38, MS-02 |
| 10 | Every event is chained and kept for at least seven years, and the loan counts on the Credit Officer's book | Platform | RO-24, FC-12, MF-35 |

## 3 · When it goes wrong

| # | At step | What happens | Capabilities |
|---|---|---|---|
| a | 1 | **The amount is above the borrower's tier limit.** Refused, and no override: a larger loan needs more evidence and a higher tier | ID-19 |
| b | 2 | **The logbook is not attached.** The committee cannot open the application | MF-04 |
| c | 2 | **An NTSA or registry search fails.** Acceptance is blocked unless the override authority justifies it, on the record | MF-04, MF-07 |
| d | 3 | **The amount is above the assessed limit.** It can go on only as an override: flagged, justified, immutable, ending with the override authority, and tracked as a cohort | MF-06, MF-07 |
| e | 5 | **A committee member declines,** or returns it. The committee is unanimous, so one decline declines the application, with the reasons kept; a return goes back to step 3 | MD-05, MD-09 |
| f | 5 | **No one acts.** Reminders after the set time, then escalation to another holder of the role | MD-08 |
| g | 6 | **The borrower does not sign before the offer expires.** The offer lapses; a new one is generated from the product version then in force | MF-34 |
| h | 6 | **The product changed after approval.** The loan keeps the terms it was approved and offered on; changes apply only to new loans (RC-30) | KC-04, MF-24 |
| i | 8 | **The payment fails, or no answer comes.** It goes to the retry and exception queue the accountant sees. An unanswered payment is not retried blind: its status is asked first, so it is never paid twice (§4) | MF-12, RL-03, RL-10, RL-14 |
| j | 8 | **The M-Pesa number is registered to someone else.** The payment is held before it is sent (§4) | MF-20, RL-21 |
| k | 7 | **The person approving the disbursement prepared it.** Refused | KC-08, MD-06 |
| l | 1 to 9 | **No connection.** As JN-02 §3 i: nothing moves offline | ID-15 |
| m | 7 | **It is between 11 pm and 4 am,** Roan Capital's end-of-day window (RC-21). No disbursement goes out; it waits for the window to close (§4) | KC-07 |

## 4 · Gaps

| Gap | Release or phase today | In its absence | Proposed |
|---|---|---|---|
| MF-20 and RL-21, the M-Pesa registered name confirmed before a disbursement (§3 j) | phase 1, not in R1 | Money goes to whatever number was typed. A wrong digit pays a stranger | Bring both into R1: the R1 count moves, not the cap (FS-570) |
| RL-10 and RL-14: an unanswered payment is a state, settled by a status query; a repeat never pays twice (§3 i) | phase 1, not in R1 | A timeout invites a second payment by hand | Bring both into R1 (FS-570) |
| KC-07 in Roan Capital's map carries end of day, not a lockout: RC-21 is a gap in the delivery map (§3 m, step 7) | phase 1, in R1, without the window | Disbursements could go out during end of day | Write the window into MF-11: no disbursement inside the institution's end-of-day window (FS-570) |
| CR-02, a credit bureau report at appraisal | phase 1, not in R1 | Appraisal (step 3) has no bureau history | Ask Roan Capital whether it pulls bureau reports today; if so, bring CR-02 into R1 (FS-570) |
| Appraisal from statements: ratios computed (RC-11), statements from source (ID-18, phase 2, RC-05) | RC-05 a gap; ID-18 phase 2 | Statements arrive as files that can be edited, and the officer computes the ratios by hand | Accept for R1. In phase 2, statements from source (ID-18); Prembly's M-Pesa statement analysis (partners PT-53) is a candidate (FS-570) |
| MF-33, a behaviour score for repeat borrowers (RC-14, RC-15) | phase 2 | The officer judges repayment history by eye | As decided (FS-522) |

## 5 · Open questions

- How long an offer stays open before it lapses (§3 g): Roan Capital's
  policy.
- The Head Office Committee's threshold, and the override authority's
  role: configuration, from Roan Capital's role list (open answer 7).
- Disbursement banks: NCBA only, or NCBA and Access Bank (open answer 6).
- Whether Roan Capital checks a credit bureau before lending today.
