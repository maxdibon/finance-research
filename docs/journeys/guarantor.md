---
id: jn-05-guarantor
name: JN-05 · A guarantor, from consent to release
kind: journey
release: R1
owner: Solution architect
classification: Internal
review_ids: [FS-531, FS-533, FS-548, FS-621, FS-622]
last_reviewed: 2026-10-08
---

# JN-05 · A guarantor, from consent to release

What a guarantor goes through at Roan Capital in R1, where directors
guarantee their company's loans (RC-04) and individuals may guarantee
each other's. The CBK lender regulations set the rules, read in full: no
one is a guarantor without their own consent (reg 42(1), (2)); the
guarantor is kept informed by periodic statements (regs 39(3), 47(2));
recourse only after all non-judicial recovery from the borrower is
exhausted (reg 42(3)); no demand before fourteen days' notice of the
default (reg 42(4)); recovery expenses only as necessary, itemised
(reg 43). The guarantor's side of a loan from JN-04.

## 1 · Who and where

- **Who:** a guarantor; the borrower who names them; Roan Capital's
  Credit Officer; the people who approve a demand.
- **Channel:** the guarantor on their own phone, by SMS and links to our
  own pages; the back office for staff.
- **Starts when:** a borrower names a guarantor on an application
  (JN-04 step 1, or a director in JN-03).
- **Ends when:** the loan is repaid and the guarantee released, or the
  guarantor has paid what a lawful demand asked; or the guarantor
  declines and is never appointed.

## 2 · Steps

```
  1 Guarantor named; identity checked and screened
        |-- fails the check ................. held; ticket (3b)
        |-- a screening match ............... frozen (3c)
        v
  2 Consent asked of the guarantor directly, on their own phone
        |-- declines, or no answer in time .. not appointed (3a)
        |-- the borrower tries to answer .... refused (3d)
        v
  3 The guarantee signed with the loan agreement
        v
  4 Statements to the guarantor while the loan runs
        |-- a statement not delivered ....... sent again (3e)
        v
  5 The borrower defaults: recovery from the borrower first
        v
  6 Fourteen days' notice to the guarantor
        |-- demand tried too early .......... refused (3f)
        v
  7 A demand, approved, only after the notice and the recovery
        |-- recovery expenses added ......... itemised only (3h)
        |-- "I never consented" ............. a complaint (3g)
        v
  8 Paid and applied, or the loan repaid: the guarantee released
        v
  9 Chained, logged, kept seven years
        :
    No connection at any step ........... waits (3i)
```

| # | Step | Who | Capabilities |
|---|---|---|---|
| 1 | The Credit Officer names the guarantor on the application. The guarantor is verified as an individual, against the national register and with a one-time code to their own phone, and screened against the sanctions lists | Credit Officer; platform | MF-37, ID-01, ID-11, FC-05 |
| 2 | The platform asks the guarantor for consent directly, never through the borrower: a link to our own page shows whose loan, how much, their exposure and their rights, and the guarantor consents with a code to their own confirmed phone. The consent is recorded before they are appointed | Guarantor; platform | MF-37, ID-17, ID-11, MS-02 |
| 3 | The guarantor signs the guarantee with the loan agreement in Odoo Sign, with a code to their phone; the signed guarantee is filed in the vault | Guarantor | MF-34, BS-02, ID-15 |
| 4 | While the loan runs, the guarantor receives periodic loan statements by link, with delivery recorded; information, never collection pressure | Platform | MF-37, MF-38, MS-09, ID-17 |
| 5 | If the borrower defaults, recovery is pursued against the borrower first, through the collection ladder, each step recorded until non-judicial recovery is exhausted | Credit Officer; platform | MF-39, MF-14 |
| 6 | The guarantor is given fourteen days' notice of the borrower's default, on a channel that reports delivery, counted on the business calendar | Platform | MF-37, MS-09, KC-15 |
| 7 | After the notice has run and recovery from the borrower is recorded as exhausted, a demand to the guarantor is approved under maker-checker (approval subject `guarantee.demand`), with any recovery expenses itemised | Approvers | MF-37, MD-01, MD-06, MF-21 |
| 8 | A payment by the guarantor is applied to the loan in the regulated order and matched; when the loan is repaid, by anyone, the guarantee is released and the guarantor told | Platform | MF-22, RO-02, MF-37 |
| 9 | Every event is chained and the records kept for at least seven years | Platform | RO-24, FC-12 |

## 3 · When it goes wrong

| # | At step | What happens | Capabilities |
|---|---|---|---|
| a | 2 | **The guarantor declines, or does not answer in time.** They are not appointed and owe nothing (reg 42(2)); the application needs another guarantor, or goes on without one where the product allows | MF-37 |
| b | 1 | **The guarantor fails the identity check.** As JN-01 §3 a: held, and a ticket for the compliance officer; never appointed on a failed check | ID-01, BS-01 |
| c | 1 | **A screening match on the guarantor.** Frozen within 24 hours, as for a borrower | FC-05 |
| d | 2 | **The borrower tries to consent for the guarantor,** or gives their own phone number for them. The code goes only to the guarantor's own confirmed phone, and a number already bound to the borrower is refused | ID-11, MF-37 |
| e | 4 | **A statement is not delivered.** The delivery report shows it, and it is sent again by email | MS-09, MS-19 |
| f | 6 | **A demand is tried before the fourteen days have run,** or before recovery from the borrower is recorded as exhausted. The platform refuses it (reg 42(3), (4)) | MF-37 |
| g | 7 | **The guarantor says they never consented.** It is a complaint, on the 30-day clock, and the recorded consent and signed guarantee are the evidence; without them the guarantor is not liable (reg 42(2)) | MF-28, ID-15 |
| h | 7 | **Recovery expenses are added to the demand.** Only those necessary, each itemised with its justification (reg 43) | MF-21 |
| i | 1 to 8 | **No connection.** As JN-02 §3 i: nothing moves offline | ID-15 |

## 4 · Gaps

| Gap | Release or phase today | In its absence | Proposed |
|---|---|---|---|
| MS-12, the guarantor choosing their channels for statements and notices | phase 1, not in R1 | Statements and notices go by SMS with a link, and by email where there is one; the guarantor cannot choose | Accepted for R1 (FS-622) |
| A guarantor's total exposure across every loan they guarantee | Sacco only (sacco SC-08) | The officer checks the guarantor's other guarantees by hand | Asked of Roan Capital (delivery map, open answer 16) (FS-622) |

## 5 · Open questions

- Who guarantees at Roan Capital: only directors for business loans, or
  individuals for personal loans too?
- How long the guarantor has to consent before the request lapses.
- How often statements go to guarantors: monthly, or at each change.
