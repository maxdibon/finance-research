---
id: jn-04-loan-to-disbursement
name: JN-04 · A loan from application to disbursement
kind: journey
release: R1
owner: Solution architect
classification: Internal
review_ids: [FS-399, FS-400, FS-402, FS-516, FS-548, FS-551, FS-561, FS-564, FS-565, FS-569, FS-570, FS-571, FS-574, FS-582, FS-602, FS-619]
last_reviewed: 2026-10-08
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
        |-- the registry shows another lender ... held (3n)
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
        |-- a blocking collateral step open ..... held (3o)
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
| 2 | For a secured product, the vehicle's logbook and the NTSA search are captured; the collateral registry is searched by the vehicle's serial number and the certificate filed; once the security agreement is signed, the notice is registered and its number, time and expiry recorded, and the borrower is sent their copy within ten working days. The committee cannot open the application until the logbook is attached (RC-09) | Credit Officer | MF-03, MF-04, ID-15 |
| 3 | Decisioning computes the statement metrics, and for a repeat borrower the behaviour score and risk class, into a decision record; the officer reads it, appraises, and records an assessed limit with reasons | Credit Officer; platform | MF-06, ID-15, DE-01, DE-02, DE-03, DE-04 |
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
| i | 8 | **The payment fails, or no answer comes.** It goes to the retry and exception queue the accountant sees. An unanswered payment is not retried blind: its status is asked first, so it is never paid twice | MF-12, RL-03, RL-10, RL-14 |
| j | 8 | **The M-Pesa number is registered to someone else.** The payment is held before it is sent | MF-20, RL-21 |
| k | 7 | **The person approving the disbursement prepared it.** Refused | KC-08, MD-06 |
| l | 1 to 9 | **No connection.** As JN-02 §3 i: nothing moves offline | ID-15 |
| m | 7 | **It is between 11 pm and 4 am,** Roan Capital's end-of-day window (RC-21). Staff release nothing in the window, by Roan Capital's procedure; a transaction rule holds what the system sends by itself, a queued payout or a retry, until the window closes | FC-16, KC-15 |
| n | 2 | **The registry search shows an earlier lender's security right on the vehicle.** The application is held and the committee sees the certificate; it goes on only if that right is discharged, or if the committee accepts ranking behind it | MF-03, MF-07 |
| o | 7 | **A collateral step the institution made blocking is still open,** such as joint registration with NTSA. The disbursement is held until the step's evidence is filed; the step's owner is reminded and, past its due date, escalated | MF-04, MD-08 |

## 4 · Gaps

| Gap | Release or phase today | In its absence | Proposed |
|---|---|---|---|
| CR-02, a credit bureau report at appraisal | phase 1, not in R1 | Appraisal (step 3) has no bureau history | Asked of Roan Capital (delivery map, open answer 12); if it does, CR-02 comes into R1 (FS-570) |
| ID-18, statements fetched from source with the borrower's consent (RC-05) | phase 2 | Statements are uploaded files; each is checked to reconcile before it is scored (DE-02), and the officer sees any that does not | Accepted for R1 (FS-570, FS-582) |

## 5 · Open questions

- How long an offer stays open before it lapses (§3 g): Roan Capital's
  policy.
- The Head Office Committee's threshold, and the override authority's
  role: configuration, from Roan Capital's role list (open answer 7).
- Disbursement banks: NCBA only, or NCBA and Access Bank (open answer 6).
- Whether Roan Capital checks a credit bureau before lending today
  (delivery map, open answer 12).
