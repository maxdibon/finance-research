---
id: jn-01-electronic-identity-check
name: JN-01 · An individual borrower, verified electronically
kind: journey
release: R1
owner: Solution architect
classification: Internal
review_ids: [FS-202, FS-340, FS-548, FS-551, FS-555, FS-556, FS-562]
last_reviewed: 2026-10-06
---

# JN-01 · An individual borrower, verified electronically

The usual way an individual becomes a borrower at Roan Capital in R1: at
a branch, with the national register (directly, or through the
verification vendor still to be chosen, FS-202, FS-340) confirming who
the person is. JN-02, the manual route, branches from step 2 when no
electronic check covers the document.

## 1 · Who and where

- **Who:** an individual applying for a loan; Roan Capital's Credit
  Officer.
- **Channel:** the branch console, with the borrower present. The
  borrower may send documents later through a single-use upload link.
- **Starts when:** the borrower asks for a loan and the Credit Officer
  opens an application.
- **Ends when:** the borrower is verified, with a tier set from the
  evidence, and every identity item on the product's checklist is
  complete; the application goes on to JN-04. Or the application is held
  at identity.

## 2 · Steps

```
  1 Officer opens the application: document type, number, name
        |-- no connection at the branch ..... waits (3i)
        v
  2 Register check, directly or through the vendor
        |-- mismatch, or not found ........ held; ticket (3a)
        |-- deceased ...................... held; ticket (3c)
        |-- register down ................. queued; JN-02 later (3b)
        |-- no electronic check ........... JN-02
        v
  3 Officer compares the register's photo with the borrower
        |-- does not look like them ....... held; ticket (3d)
        v
  4 Sanctions screening -- match ......... frozen (3e)
        v
  5 Documents: at the console, or by a single-use upload link
        |-- one missing ................... gate holds (3f)
        |-- link expired or used .......... new link (3g)
        |-- fails type or malware check ... refused (3h)
        v
  6 Tier set from the evidence; checklist complete; core updated
        v
  7 Chained, logged, kept seven years
        v
  8 On to JN-04, within the tier's limit
        :
    Later: a document expires ........... re-check (3j)
```

| # | Step | Who | Capabilities |
|---|---|---|---|
| 1 | The Credit Officer opens the application and enters the document type, its number and the borrower's name and date of birth; the product's document checklist appears | Credit Officer | MF-01, KC-01, ID-02, MF-02 |
| 2 | The platform checks the national register, directly or through the vendor, and compares the name and date of birth. The result is kept with the register's reference and the fields compared, never a copy of the register's record, and the cost of the query is logged (Roan Capital RC-02) | Platform | ID-01, ID-10 |
| 3 | Where the register returns a photo, the officer compares it with the borrower in front of them and confirms it in the console | Credit Officer | ID-01 |
| 4 | Sanctions screening runs against the UN and domestic lists | Platform | FC-05 |
| 5 | The documents on the checklist (the ID, the KRA PIN certificate, a photo, others per product) are captured at the console, or sent by the borrower through a single-use, short-lived upload link by email. Each file is type-checked, scanned for malware and filed in the vault against the application | Credit Officer; borrower | ID-15, ID-02, MS-19 |
| 6 | The tier is set from the evidence held: the register's match, the photo compared in person, and the documents. The identity items on the checklist pass the completeness gate, and the verified identity is written to the borrower's record in Kapu Core | Platform | ID-19, MF-02, KC-01 |
| 7 | Every event from step 2 is chained, access to the documents is logged, and the records are kept for at least seven years | Platform | RO-24, RO-19, FC-12 |
| 8 | The application goes on to JN-04, where the amount offered cannot exceed the tier's limit | Credit Officer | ID-19 |

## 3 · When it goes wrong

| # | At step | What happens | Capabilities |
|---|---|---|---|
| a | 2 | **The name or date of birth does not match, or the number is not found.** The application is held and a ticket opens for the compliance officer in the restricted helpdesk team, with a link and never documents. The officer sees only that it is held (tipping off, POCAMLA s.8). Never the manual route | ID-01, BS-01 |
| b | 2 | **The register or the vendor does not answer.** The check is queued and retried; after the institution's set wait, and if its policy allows, the officer may take JN-02 | ID-01 |
| c | 2 | **The register says the person is deceased.** Held and ticketed as §3 a: someone is using a dead person's identity | ID-01, BS-01 |
| d | 3 | **The photo does not look like the borrower.** The officer cannot override it: the officer marks it, and it is held and ticketed as §3 a | ID-01, BS-01 |
| e | 4 | **A screening match.** Frozen within 24 hours; nothing in this journey clears it | FC-05 |
| f | 5 | **A document is missing.** The completeness gate holds the application; it cannot be overridden | MF-02, ID-02 |
| g | 5 | **The upload link has expired or been used.** The officer sends a new one; the old one stays dead | ID-15, MS-19 |
| h | 5 | **A file fails the type check or the malware scan.** It is refused and the borrower or the officer sends it again | ID-15 |
| i | 1 to 5 | **The branch has no connection.** As JN-02 §3 i: nothing is verified offline, and the application waits | ID-15 |
| j | 6, later | **A document expires,** or the borrower returns after it has. The check is re-run before a new loan; on a mismatch §3 a applies | ID-03, ID-19 |

## 4 · Gaps

| Gap | Release or phase today | In its absence | Proposed |
|---|---|---|---|
| ID-10, the result kept with its source reference, never a copy of the register's record; with it, the cost of each query (RC-02, which no capability names yet) | phase 1, not in R1 | Nothing says what is kept from a check. The easy build stores the register's whole answer, which is more personal data than the check needs | Bring ID-10 into R1, and add the cost per query to it: the R1 count moves, not the cap (FS-562) |
| ID-04, liveness and face match | phase 2 | The officer compares the register's photo by eye, with the borrower present | Accept for R1: the borrower is in front of the officer |
| ID-06, the KRA PIN checked with KRA | phase 2 | The officer checks the PIN certificate in the checklist by eye | Accept for R1 |
| ID-05 and ID-11, the borrower's phone number confirmed with the operator or by a one-time code | phase 1, not in R1 | The phone number is typed in and never confirmed, yet reminders, receipts and upload links go to it | Bring ID-11 into R1, a code sent through Roan Capital's own SMS gateway (its assumption 5): the R1 count moves, not the cap (FS-562) |
| FC-06, PEP screening with enhanced due diligence | phase 2 | Recorded in Roan Capital RC-36. The application form asks the borrower whether they hold or held a public office, and the compliance officer reviews any yes | Roan Capital's compliance officer to agree |

## 5 · Open questions

- The national register directly, or through a vendor (FS-202, FS-340):
  step 2 is the same either way, but the reference kept and the cost
  logged differ.
- Does the register return a photo for every document? Smile ID's
  documentation says it does for the national ID, the alien card and the
  passport, and not for the photo-less ID check (partners PT-30); NPDM's
  own answer is to confirm.
- Which tier this evidence reaches, and its limits: Roan Capital sets
  them (RC-43).
