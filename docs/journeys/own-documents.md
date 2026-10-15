---
id: jn-07-own-documents
name: JN-07 · A borrower viewing and sharing their own documents
kind: journey
release: R1
status: draft
released: 2026.10.15
validated_with: not yet
owner: Solution architect
classification: Internal
review_ids: [FS-531, FS-532, FS-548, FS-668, FS-689, FS-690]
last_reviewed: 2026-10-10
---

# JN-07 · A borrower viewing and sharing their own documents

A Roan Capital borrower in R1 sees their loan, its statement and the
documents they signed, takes a copy, and shares it with whoever they
choose. The lender regulations require it: a receipt for every
transaction, a free loan statement on request, a way to reach it at any
time by a convenient channel, a statement of transactions for any
period, and an error put right promptly (reg 39(1), (2)). The Data
Protection Act adds the person's right to see what is held about them
(s.26), within seven days and free (Data Protection (General)
Regulations reg 9).

Nothing is sent as an attachment. Every document is reached on our own
page, by a single-use link and a code to the borrower's bound phone; once
they have it, it is theirs to keep or share (identity ID-17, FS-532).

## 1 · Who and where

- **Who:** the borrower, or for a business borrower the person
  authorised to act for it (JN-03 step 2); Roan Capital's Credit Officer
  and accountant; its compliance officer for a data request.
- **Channel:** the borrower's own page, reached from a link in any
  message they have had (a receipt, a reminder) or one they ask for;
  the officer, by phone or at the office.
- **Starts when:** the borrower wants their statement, a receipt, their
  agreement or another document, or asks what is held about them.
- **Ends when:** they have the document, current to the minute, in a
  form they can keep and share; or their request is with the institution,
  on its clock.
- **Target:** the link within a minute of asking; a request for all
  their data answered within seven days, free; a correction within
  fourteen (both the regulations').
- **Moments that matter:** seeing exactly what they owe and how it came
  to that; knowing no one else can open their documents; a figure they
  question, looked at and answered, not argued over.
- **Data:** their loans, statements, receipts, signed documents and
  notices, nothing collected anew; every view, download and share
  logged (privacy PR-02, PR-03, PR-07).

## 2 · Steps

```
  1 The borrower asks: from a link in a message, or the officer
        |-- no smartphone, or cannot read .......... the officer (3h)
        v
  2 A single-use link by SMS
        v
  3 The page opens with a code to the bound phone
        |-- the link has expired or been used ...... a new one (3a)
        |-- the phone or number has changed ........ recovery first (3b)
        v
  4 Their loans: balance, the free statement, transactions for a
    period, receipts, the agreement and KID as signed, notices
        |-- a figure looks wrong ................... a complaint, fixed (3d)
        v
  5 Downloaded as a PDF; shared as they choose
        |-- someone else asks for it ............... only through them (3c)
        v
  6 Every view, download and share logged; statements kept
        :
    Asks for everything held about them ........ seven days (3e)
    Asks to correct their details .............. fourteen days (3f)
    A business borrower ........................ its authorised person (3g)
    The platform down .......................... the office, later (3i)
    Stops partway .............................. the link lapses (3j)
```

| # | Step | Who | Messages | Capabilities |
|---|---|---|---|---|
| 1 | The borrower asks for their statement or a document: from the link in a receipt or reminder they already have, or by asking the officer, who sends it | Borrower; Credit Officer | — | MF-38 |
| 2 | A single-use, short-lived link to the borrower's own page is sent by SMS to their bound phone | Platform | T15 | ID-17, MF-38, MS-12 |
| 3 | The page asks for a one-time code sent to the same phone; the link opens once, and only on that code | Borrower; platform | T22 | AC-03, AC-13, ID-12 |
| 4 | The page shows each of their loans, read from the core at that moment: the balance; the free loan statement with the principal advanced and owing, interest charged, paid and owing, the rate from the agreement's date, and every charge; transactions for any period they choose; every receipt; the agreement and key information document as signed; notices sent; the settlement letter once settled. Copies of their ID and photos are not shown on a phone (3e) | Borrower | — | MF-38, KC-04, ID-15 |
| 5 | They download any document as a PDF, dated and referenced, and keep it or share it with whom they choose | Borrower | — | ID-17 |
| 6 | Every view, download and share is logged; each statement issued is kept for seven years | Platform | — | ID-15, RO-19, FC-12 |

## 3 · When it goes wrong

| # | At step | What happens | Capabilities |
|---|---|---|---|
| a | 3 | **The link has expired or has been used.** It is never extended or reopened; the borrower asks for a new one | ID-17 |
| b | 3 | **The borrower's phone or number has changed.** No link or code goes to a new number until the borrower is verified again (recovery by staff, with their ID); a SIM change on the bound number holds sharing as it holds money (T24) | AC-15, ID-13 |
| c | 5 | **Someone else asks for the borrower's documents:** a spouse, an employer, another lender. Not given: the borrower shares their own copy if they choose. A court order or an investigator's lawful demand goes to the compliance officer, under the institution's procedure | ID-17, BS-01 |
| d | 4 | **A figure on the statement looks wrong.** The borrower says so from the page or to the officer; it is logged as a complaint with its clock (T16). An error is put right promptly by a correcting entry, never by editing the record, and a new statement issued (reg 39(2)); the borrower told the outcome (T17) | MF-28, KC-04 |
| e | any | **The borrower asks for everything held about them.** A data request, logged with a seven-day clock, free. The institution compiles it with our help and gives it in a common electronic form through the page, including copies of their ID and photos, which go no other way. A refusal, in part, is in writing with reasons. A request to move their data to another provider is answered within thirty days (reg 11) | BS-01, ID-17 |
| f | any | **The borrower asks to correct their details:** a misspelt name, a new address. Contact details are updated and logged (DT-06); a change to identity data is checked against the register again. Done within fourteen days, or refused in writing with reasons within seven (reg 10) | ID-03, BS-01 |
| g | 3 | **A business borrower.** Only the person authorised to act for the business opens its page, on their own bound phone; another director is added only by the business's authority | ID-02, AC-03 |
| h | 1 | **The borrower has no smartphone, or does not read easily.** The officer reads them their balance and last payment over the phone after confirming who they are, and prints the statement free at the office | MF-38 |
| i | 3, 4 | **The platform is down.** The page is unavailable; the borrower's M-Pesa messages still show what they paid; the statement follows from the office once it is back | MF-38 |
| j | 2, 3 | **The borrower stops partway:** the link is not opened, or the code not entered. The link lapses at its time; nothing is kept but the log; they may ask again | ID-17 |

## 4 · Gaps

| Gap | Release or phase today | In its absence | Proposed |
|---|---|---|---|
| ID-13 and rails RL-22: a SIM changed since enrolment detected with Safaricom, and sign-in, sharing and money held until the borrower is verified again (3b) | phase 1, not in R1 | A SIM swap on the same number is not seen: whoever holds the swapped SIM receives the link and the code. The same gap reaches signing codes and M-Pesa disbursements, which go to that number | Move both into R1, subject to Safaricom granting its SIM-swap API; until then, the residual risk written down and accepted by Roan Capital (FS-690) |
| Keywords by SMS (MS-10 beyond replies and STOP), such as "STATEMENT" | phase 1, narrowed out of R1 (FS-674) | The borrower asks the officer, or uses a link they already have | Accept for R1 |
| Voice, for a borrower who does not read (nothing needs reading, FS-637) | Omni-channel, phase 2 | The officer reads it to them by phone; the statement printed at the office | Accept for R1 |
| Compiling everything held about a person, across the core, Odoo, the vault and messaging (3e) | No capability | By hand, by the institution with our help, as a service request | A standard service request in service management §6, with a tested export, before R1 go-live |
| A recipient checking that a shared statement is genuine | No capability | The recipient asks the borrower, or the institution | Accept for R1; propose a reference on each document, checked on our page, for later |

## 5 · Open questions

- **For Roan Capital:** how long a statement link stays open (proposed:
  24 hours); whether it charges for a comprehensive statement for a
  period, as against the free loan statement (reg 39(1)(b) and (d)); who
  handles a data request, and its form (Form DPG 2).
- **For the owner:** whether the verification reference on shared
  documents is worth a capability.
