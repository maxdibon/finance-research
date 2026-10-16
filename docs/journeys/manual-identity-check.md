---
id: jn-02-manual-identity-check
name: JN-02 · A borrower verified by hand
kind: journey
release: R1
status: draft
law: LR-14
released: 2026.10.15
validated_with: not yet
owner: Solution architect
classification: Internal
review_ids: [FS-329, FS-544, FS-547, FS-548, FS-551, FS-555, FS-556, FS-557, FS-558, FS-559, FS-561, FS-668]
last_reviewed: 2026-10-16
---

# JN-02 · A borrower verified by hand

The manual route in identity ID-01 (FS-544, FS-547), as Roan Capital
would run it in R1. It is the exception to JN-01, the electronic check:
it opens only where no register or vendor can check the person's
document, and it never clears a check that failed.

## 1 · Who and where

- **Who:** a borrower whose document no electronic check covers (a
  refugee ID where the chosen vendor cannot check it, a Maisha card, a
  foreign national's passport); Roan Capital's Credit Officer; a second
  person holding the approving role.
- **Channel:** the branch console, with the borrower present. Field
  capture waits for the field-officer app (§4).
- **Starts when:** the platform finds no electronic check for the
  document, or the register has been unavailable for longer than the
  institution allows.
- **Ends when:** the borrower is recorded as **verified manually**, at a
  tier no higher than the institution allows for it, and the application
  goes on to the loan journey (JN-04); or the verification is declined and
  the application stops at identity.
- **Target:** the manual verification decided within 4 working hours of submission (proposed).
- **Moments that matter:** hearing that the electronic check is unavailable without feeling suspected; waiting for the second approval, told when they will hear.
- **Data:** as JN-01, plus images of the original document and a live photo, kept in the vault (privacy PR-01, PR-05).

## 2 · Steps

```
  1 Officer starts the application, enters the document
        |-- no connection at the branch ... waits; no capture (3i)
        |
  2 Electronic check for this document?
        |-- yes, match ............... JN-01 (electronic)
        |-- yes, mismatch ............ held; ticket to compliance (3a)
        |-- register down ............ queued and retried (3b)
        |-- none, or down past the wait
        v
    Manual route offered; officer picks the reason
        |
  3 Screening ------ match ........... frozen; route stops (3c)
        |
  4 Officer sees the original: photos, live photo, attestation
    Vault: type check, malware scan -- fails ... capture again (3d)
        |
  5 Approval request, found by role
        |
  6 Second person decides, re-authenticated
        |-- not reachable ............ waits; reminders (3j)
        |-- same person as step 4 .... refused (3f)
        |-- declines ................. application stops (3e)
        |-- returns .................. back to 4
        v
  7 Verified manually; tier set and capped (3g)
        |
  8 Chained, logged, kept seven years
        |
  9 On to JN-04, within the tier's limit
        :
    Later: document expires, or a check appears -> re-check (3h)
    Stops partway .................... kept, resumed or lapsed (3k)
```

| # | Step | Who | Messages | Capabilities |
|---|---|---|---|---|
| 1 | The Credit Officer starts the borrower's application and enters the document type and number; the product's document checklist appears | Credit Officer | — | MF-01, KC-01, ID-02, MF-02 |
| 2 | The platform looks for an electronic check for that document. It finds none, or the register has been down for longer than the institution's set wait, and only then offers the manual route. The officer picks the reason from a fixed list; the officer cannot choose the route otherwise | Platform; Credit Officer | — | ID-01 |
| 3 | Sanctions screening runs as it does for every borrower; the manual route does not skip it | Platform | — | FC-05 |
| 4 | The officer examines the original document with the borrower present, photographs its front and back and takes a live photo of the borrower, and records a short attestation. The images are type-checked, scanned for malware and filed in the vault against the application | Credit Officer | — | ID-15 |
| 5 | The verification goes for a second approval, as an approval request of its own (subject type `kyc.manual_verification` in docs/specs/approval-engine.md: configuration, not a new capability); the approver is found by role | Platform | — | MD-01, MD-02, AC-09 |
| 6 | The approver opens the images, the reason and the attestation, and approves, declines or returns it, re-authenticating at the moment of the decision. The approver cannot be the officer who captured it | Approver | — | MD-05, MD-06, MD-10, AC-05 |
| 7 | On approval, the borrower is recorded as verified manually, with the reason, both people, the time and the evidence references. The tier is set from that evidence and capped for a manual check, and the identity item on the checklist passes | Platform | — | ID-01, ID-19, MF-02, KC-01 |
| 8 | Every event in steps 2 to 7 is chained, access to the images is logged, and the record is kept for at least seven years | Platform | — | RO-24, RO-19, FC-12 |
| 9 | The application goes on to JN-04, where the amount offered cannot exceed the tier's limit | Credit Officer | — | ID-19 |

## 3 · When it goes wrong

| # | At step | What happens | Capabilities |
|---|---|---|---|
| a | 2 | **The register answers, and the name or number does not match, or the number is not found.** This is not the manual route: a mismatch is a possible impersonation. The application is held, and the platform opens a ticket for the compliance officer in a restricted helpdesk team, with a link to the application and never its documents. The officer who captured it sees only that it is held: telling the borrower more could be tipping off (POCAMLA s.8) | ID-01, BS-01 |
| b | 2 | **The register is down.** The check is queued and retried. The manual route opens only after the institution's set wait, and only if its policy allows it | ID-01 |
| c | 3 | **A screening match.** The borrower's assets are frozen within 24 hours. No manual approval clears a match | FC-05 |
| d | 4 | **An image fails the type check or the malware scan.** It is refused, and the officer captures it again | ID-15 |
| e | 6 | **The approver declines.** The application stops at identity, with the reason kept; the officer tells the borrower. A return for revision goes back to step 4 | MD-05 |
| f | 6 | **The approver is the officer who captured it, or decided the step before.** The decision is refused | MD-06 |
| g | 7 | **The borrower asks for more than the tier allows.** The tier's limit holds. A larger loan needs more evidence and a higher tier, not an override | ID-19 |
| h | 7, later | **The document expires, or an electronic check becomes available for it.** The check is re-run; on a match the record becomes verified electronically and the tier may rise, on a mismatch §3 a applies | ID-03, ID-19 |
| i | 1 to 4 | **The branch has no connection.** Nothing can be verified offline: the register, screening, the vault and the approver all need the platform. The console says so and the application waits. Photos taken on a phone and uploaded later are not accepted, because nothing would show the officer saw the original. A mobile-data fallback at the branch is Roan Capital's to arrange | ID-15 |
| j | 6 | **The approver cannot be reached.** The request waits in the approver's queue; approval from email reaches them away from the desk. After the set time it is sent a reminder, then escalated to another holder of the role | MD-18, MD-08 |
| k | 1 to 6 | **The borrower stops partway.** The draft is kept for 30 days (proposed); a verification awaiting approval stays in the approver's queue; after 30 days the application lapses | MF-01, ID-15 |

## 4 · Gaps

| Gap | Release or phase today | In its absence | Proposed |
|---|---|---|---|
| ID-04, liveness and face match of the live photo against the document's photo | phase 2 | Two people judge the photo by eye. This is the main weakness of the route in R1 | Accept for R1, with the tier cap carrying the risk; or move ID-04 into v1, a decision against the cap (FS-547) |
| A vendor's check that the document itself is genuine (security features, MRZ) | No capability | The officer's examination of the original only | To come with the vendor choice (FS-340, partners PT-30, PT-53) |
| FC-08, case management for a mismatch (§3 a) | phase 2 | A ticket in a restricted helpdesk team (BS-01): an owner, a deadline and a history, but no alerts, evidence bundle or report drafting | Accepted for R1 (FS-555) |
| IN-18, the governance view: manual verifications per officer and per branch | phase 2 | A plain report from the verification log, in ID-01 | Accepted for R1 (FS-557) |
| OC-17, the field-officer app, for capture away from the branch | phase 1, R4 | Manual verification happens at the branch only. In R4 the app captures offline on the officer's bound device, encrypted and stamped with time and place (OC-19); screening, verification and approval happen only after it syncs, and a capture older than the institution's set age is taken again | Accept for R1; Roan Capital's officers meet borrowers at branches |

## 5 · Open questions

- Does Roan Capital accept manual verification at all, and for which
  documents? Its compliance policy decides; we supply the route.
- Who approves? Roan Capital's role list is open (delivery map, open
  answer 7).
- The fixed list of reasons, and how long the register may be down
  before the manual route opens (§3 b).
- The tier a manual verification may reach, and that tier's limits:
  Roan Capital sets them (RC-43).
- The AML regulations define "official documents" as originals or
  certified copies of documents, or official records (reg 2): a manual
  check of the original fits that definition. The conditions are Roan
  Capital's risk-based policy (reg 21); its compliance officer to
  confirm.

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-13](../law/LR-13.md) The Proceeds of Crime and Anti-Money Laundering Act (Cap. 59A).** Regulator: The Financial Reporting Centre, with each institution's supervisor. Made under: An Act of Parliament. In force: Yes. Version read: as at 2025-11-04, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2009/9/eng@2025-11-04).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 8 | s. 8 | Tipping off is an offence: telling anyone that a suspicious transaction report is being prepared or has been made |

**[LR-14](../law/LR-14.md) The Proceeds of Crime and Anti-Money Laundering Regulations, 2023, Legal Notice No. 153 of 2023.** Regulator: The Financial Reporting Centre, with each institution's supervisor. Made under: The Proceeds of Crime and Anti-Money Laundering Act (Cap. 59A). In force: Yes. Version read: as at 2023-11-17, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2023/153/eng@2023-11-17).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 2 | reg 2 | Its definitions; "official documents" are the originals or certified copies of documents, or the official records the Act lists |
| reg 21 | reg 21 | Simplified customer due diligence only where lower risk has been identified by an adequate risk analysis, and never where money laundering or financing of terrorism is suspected, or in a higher-risk scenario |
