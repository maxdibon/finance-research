---
id: jn-03-business-borrower
name: JN-03 · A business borrower, its people and its owners
kind: journey
release: R1
owner: Solution architect
classification: Internal
review_ids: [FS-090, FS-205, FS-415, FS-536, FS-548, FS-551, FS-562, FS-564]
last_reviewed: 2026-10-06
---

# JN-03 · A business borrower, its people and its owners

A company borrowing from Roan Capital in R1 (RC-01, RC-03, RC-04). The
company is checked against the business registry; the people behind it
are each verified as individuals, as JN-01 does for one person. The AML
regulations require both: the natural persons behind a legal person
identified and verified (reg 22), and the person acting for it shown to
be authorised and verified (reg 23).

## 1 · Who and where

- **Who:** a company; the person applying for it (a director, or someone
  the board has authorised); its directors, shareholders and beneficial
  owners; Roan Capital's Credit Officer.
- **Channel:** the branch console, with the applicant present; the
  others' documents by single-use upload links.
- **Starts when:** a company asks for a loan and the Credit Officer opens
  a business application.
- **Ends when:** the company, the applicant and every person behind it
  are verified, the business tier is set, and the checklist is complete;
  the application goes on to JN-04, with directors' guarantees through
  JN-05. Or the application is held.

## 2 · Steps

```
  1 Officer opens a business application: registration number
        |-- no connection at the branch ...... waits (3i)
        v
  2 The applicant verified as an individual (JN-01)
        |-- not a director, no resolution .... cannot go on (3c)
        v
  3 Registry fetch: status, directors, shareholders
        |-- not found, or not active ......... held (3a)
        |-- registry down .................... waits (3b)
        v
  4 Beneficial owners declared; each person verified (JN-01)
        |-- declared and fetched disagree .... held; ticket (3d)
        |-- a person fails their check ....... held; ticket (3e)
        |-- owned through another company .... followed (3g)
        v
  5 Screening: the company and every person -- match .. frozen (3f)
        v
  6 Documents the registry cannot give, filed in the vault
        v
  7 Business tier set; checklist complete; core updated
        v
  8 Chained, logged, kept seven years
        v
  9 On to JN-04; directors' guarantees through JN-05
        :
    Later: directors or owners change ...... re-check (3h)
```

| # | Step | Who | Capabilities |
|---|---|---|---|
| 1 | The Credit Officer opens a business application with the company's registration number; the business product's checklist appears | Credit Officer | MF-01, KC-01, ID-02, MF-02 |
| 2 | The applicant is verified as an individual, as in JN-01, and their authority to act for the company is shown: a director on the registry's record, or a board resolution on the checklist (reg 23) | Credit Officer; applicant | ID-01, ID-11, ID-02 |
| 3 | The platform fetches the company's record from the business registry: its status, directors and shareholders, the content of a CR12. The company is never asked for what the registry can give, and its eCitizen login is never held. The result is kept with the registry's reference and the cost of the query | Platform | ID-07, ID-10 |
| 4 | The company declares its beneficial owners on the form. The platform sets them beside the shareholders fetched, and each director, shareholder and beneficial owner the institution's policy names is verified as an individual: in person as in JN-01, or by a single-use upload link to their documents | Credit Officer; platform | ID-07, ID-01, ID-15, MS-19 |
| 5 | Sanctions screening runs on the company and on every person named in steps 2 to 4 | Platform | FC-05 |
| 6 | The documents the registry cannot give (the KRA PIN certificate, the board resolution to borrow, bank and M-Pesa statements, others per product) are captured or uploaded, type-checked, scanned and filed in the vault | Credit Officer; applicant | ID-15, ID-02 |
| 7 | The business tier is set from the evidence held. The checklist passes the completeness gate, and the company is written to Kapu Core as a business client with its people linked | Platform | ID-19, MF-02, KC-01 |
| 8 | Every event from step 2 is chained, access to the documents is logged, and the records are kept for at least seven years | Platform | RO-24, RO-19, FC-12 |
| 9 | The application goes on to JN-04, within the business tier's limit; directors' guarantees go through JN-05 | Credit Officer | ID-19, MF-37 |

## 3 · When it goes wrong

| # | At step | What happens | Capabilities |
|---|---|---|---|
| a | 3 | **The registry has no such company, or its status is not active** (deregistered, struck off, in liquidation). The application is held and the officer tells the applicant why | ID-07 |
| b | 3 | **The registry does not answer.** The fetch is queued and retried. A CR12 the company uploads instead is not accepted as the check: a file can be edited, and the point of the fetch is that it cannot | ID-07 |
| c | 2 | **The applicant is not a director and has no board resolution.** The application cannot go on until an authorised person applies or a resolution is filed (reg 23) | ID-02, MF-02 |
| d | 4 | **The declared beneficial owners and the shareholders fetched disagree** in a way the declaration does not explain. Held, and a ticket opens for the compliance officer in the restricted helpdesk team | ID-07, BS-01 |
| e | 4 | **A director, shareholder or beneficial owner fails their individual check.** As JN-01 §3 a, for that person; the company's application is held with it | ID-01, BS-01 |
| f | 5 | **A screening match on the company or any person.** Frozen within 24 hours; nothing in this journey clears it | FC-05 |
| g | 4 | **A shareholder is itself a company.** Its record is fetched in turn, until the chain reaches natural persons. Where it is a foreign company, no register is connected: its documents are taken certified, and the compliance officer reviews the chain (§4) | ID-07, ID-09 |
| h | 7, later | **The directors or owners change,** or the company returns for another loan. The registry is fetched again and any new person verified before a new loan | ID-03, ID-07 |
| i | 1 to 6 | **The branch has no connection.** As JN-02 §3 i: nothing is verified offline | ID-15 |

## 4 · Gaps

| Gap | Release or phase today | In its absence | Proposed |
|---|---|---|---|
| ID-09, registers in other countries, for a foreign company in the ownership chain (§3 g) | later | Certified documents, reviewed by the compliance officer | Accept for R1 |
| ID-06, the company's KRA PIN and tax compliance certificate checked with KRA | phase 2 | The officer checks both by eye | Accept for R1 |
| ID-18, statements fetched from source with the company's consent; Roan Capital's statement gap (RC-05) | phase 2 | Statements arrive as files that can be edited, and appraisal reads them by hand (JN-04) | Decide with JN-04, where appraisal needs them (FS-564) |
| FC-06, PEP screening of directors and beneficial owners | phase 2 | The form's public-office question for each person, reviewed by the compliance officer (delivery map, open answer 11) | As for JN-01 |
| Access to the business registry by API (FS-205) | Open: unconfirmed | Step 3 cannot run. **This blocks R1's business borrowers** | Settle with the vendor choice: Smile ID, MetaMap and Prembly each document a Kenyan business registry check (partners PT-30, PT-33, PT-53) |

## 5 · Open questions

- Whom the institution verifies in step 4: every director, every
  shareholder, or those above a holding threshold. The beneficial
  ownership threshold under the Companies Act is to confirm: that law is
  not in the law register, and has not been read (FS-564).
- The board resolution: Roan Capital's template, and whether a director's
  signature alone suffices for a sole director.
- Whether the registry returns beneficial owners, or only shareholders;
  each vendor's documentation names shareholders and directors
  (partners PT-30, PT-53).
