---
id: jn-01-electronic-identity-check
name: JN-01 · An individual borrower, verified electronically
kind: journey
release: R1
status: draft
law: LR-13
released: 2026.10.16
validated_with: not yet
owner: Solution architect
classification: Internal
review_ids: [FS-202, FS-340, FS-548, FS-551, FS-555, FS-556, FS-562, FS-668]
last_reviewed: 2026-10-16
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
- **Target:** verified within 15 minutes, with the borrower present (proposed).
- **Moments that matter:** being asked for documents, and knowing why each is needed; the result, said plainly: verified, or exactly what is missing.
- **Data:** name, date of birth, phone, the ID number (Restricted, encrypted, SE-27), a photo and the checklist's documents; only what the product's checklist names (privacy PR-01, PR-05, PR-06).

## 2 · Steps

```
  1 Officer opens the application: document, name, phone
        |-- no connection at the branch ..... waits (3i)
        |-- the phone's code never arrives . resend; holds (3k)
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
    Stops partway .................... kept, resumed or lapsed (3l)
```

| # | Step | Who | Messages | Capabilities |
|---|---|---|---|---|
| 1 | The Credit Officer opens the application and enters the document type, its number and the borrower's name, date of birth and phone number; a one-time code sent to that phone confirms the number before anything else is sent to it; the product's document checklist appears | Credit Officer; borrower | T31 | MF-01, KC-01, ID-02, MF-02, ID-11 |
| 2 | The platform checks the national register, directly or through the vendor, and compares the name and date of birth. The result is kept with the register's reference and the fields compared, never a copy of the register's record, and the cost of the query is logged (Roan Capital RC-02) | Platform | — | ID-01, ID-10 |
| 3 | Where the register returns a photo, the officer compares it with the borrower in front of them and confirms it in the console | Credit Officer | — | ID-01 |
| 4 | Sanctions screening runs against the UN and domestic lists | Platform | — | FC-05 |
| 5 | The documents on the checklist (the ID, the KRA PIN certificate, a photo, others per product) are captured at the console, or sent by the borrower through a single-use, short-lived upload link by email. Each file is type-checked, scanned for malware and filed in the vault against the application | Credit Officer; borrower | T32 | ID-15, ID-02, MS-19 |
| 6 | The tier is set from the evidence held: the register's match, the photo compared in person, and the documents. The identity items on the checklist pass the completeness gate, and the verified identity is written to the borrower's record in Kapu Core | Platform | — | ID-19, MF-02, KC-01 |
| 7 | Every event from step 2 is chained, access to the documents is logged, and the records are kept for at least seven years | Platform | — | RO-24, RO-19, FC-12 |
| 8 | The application goes on to JN-04, where the amount offered cannot exceed the tier's limit | Credit Officer | — | ID-19 |

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
| k | 1 | **The code does not arrive, or the borrower cannot give it.** The officer resends it or corrects the number; the application holds until the number is confirmed, because reminders, receipts and upload links will go to it | ID-11 |
| l | 1 to 6 | **The borrower stops partway.** The application is kept as a draft for 30 days (proposed); checks already passed stand until they expire, and the officer resumes where it stopped; after 30 days it lapses and its documents follow their retention | MF-01, ID-15 |

## 4 · Gaps

| Gap | Release or phase today | In its absence | Proposed |
|---|---|---|---|
| ID-04, liveness and face match | phase 2 | The officer compares the register's photo by eye, with the borrower present | Accept for R1: the borrower is in front of the officer |
| ID-06, the KRA PIN checked with KRA | phase 2 | The officer checks the PIN certificate in the checklist by eye | Accept for R1 |
| ID-05, the phone number checked against the name the operator holds | phase 1, R2 | The one-time code (ID-11, step 1) proves the borrower holds the phone, not that it is registered in their name | Accept for R1 |
| FC-06, PEP screening with enhanced due diligence | phase 2 | Recorded in Roan Capital RC-36. The application form asks the borrower whether they hold or held a public office, and the compliance officer reviews any yes | Roan Capital's compliance officer to agree (delivery map, open answer 11) |

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

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-13](../law/LR-13.md) The Proceeds of Crime and Anti-Money Laundering Act (Cap. 59A).** Regulator: The Financial Reporting Centre, with each institution's supervisor. Made under: An Act of Parliament. In force: Yes. Version read: as at 2025-11-04, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2009/9/eng@2025-11-04).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 8 | s. 8 | Tipping off is an offence: telling anyone that a suspicious transaction report is being prepared or has been made |
