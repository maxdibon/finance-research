---
id: jn-06-restructuring
name: JN-06 · A loan restructured
kind: journey
release: R1
status: draft
validated_with: not yet
owner: Solution architect
classification: Internal
review_ids: [FS-139, FS-516, FS-548, FS-623, FS-624, FS-625, FS-668]
last_reviewed: 2026-10-09
---

# JN-06 · A loan restructured

A live loan's terms changed at Roan Capital in R1: a reschedule (the same
loan, a new schedule), a refinance (a new loan pays off the old, chained
to it) or a top-up (more money on the loan). The CBK lender regulations
set the rules, read in full: a restructure within the credit policy, on
the borrower's request or after prior notice to them (reg 28(3)); any
variation agreed as the original agreement was (reg 54(6)), and not
without at least thirty days' notice and the borrower's acceptance
(reg 54(7)); the arrears cap counted from when the loan last became
non-performing, so a restructure never resets it (reg 29(3)); the loan
classified by its schedule (reg 57).

## 1 · Who and where

- **Who:** a borrower with a live loan; Roan Capital's Credit Officer;
  the approvers; any guarantors.
- **Channel:** the branch or a call for the request; the borrower and
  guarantors on their own phones for notices and signing; the back
  office for staff.
- **Starts when:** the borrower asks for relief or more money, or Roan
  Capital proposes a restructure.
- **Ends when:** the new terms are in force and everyone holds their
  copy; or the restructure is declined, or lapses, and the loan keeps its
  terms.
- **Target:** the offer made within 2 working days of the request; the new terms in force after the 30 days' notice (reg 54(7); counsel, FS-624) (proposed).
- **Moments that matter:** asking for relief, treated with dignity; the notice period, knowing exactly when relief starts.
- **Data:** the request and its reason, the refreshed appraisal and the signed variation (privacy PR-03, PR-18).

## 2 · Steps

```
  1 Request recorded: the type, the reason, the policy's limits
        |-- too many restructures already ..... refused (3a)
        v
  2 Appraisal refreshed: statements, behaviour score, tier
        |-- top-up above the tier's limit ..... refused (3g)
        v
  3 New terms priced; a new key information document
        |-- arrears interest into principal ... refused (3b)
        v
  4 Approved as its own request
        |-- declined, or returned ............. (3e)
        v
  5 Guarantors told, and asked where their exposure grows
        |-- a guarantor declines .............. held (3d)
        v
  6 Notice to the borrower; the variation accepted and signed
        |-- not accepted in time .............. lapses (3c)
        v
  7 Applied: reschedule, refinance or top-up
        |-- the loan is non-performing ........ cap carried (3f)
        |-- refinance with interest overdue ... refused (3i)
        v
  8 Confirmed to borrower and guarantors; flagged as restructured
        v
  9 Chained, logged, kept seven years
        :
    No connection at any step ............. waits (3h)
    Stops partway .................... kept, resumed or lapsed (3j)
```

| # | Step | Who | Messages | Capabilities |
|---|---|---|---|---|
| 1 | The Credit Officer records the request: reschedule, refinance or top-up, the reason, and whether it came from the borrower or is proposed by Roan Capital. The credit policy's limits apply, among them how often one loan may be restructured | Credit Officer | — | MF-09, MF-01 |
| 2 | The appraisal is refreshed: decisioning recomputes the statement metrics and the behaviour score, and the borrower's tier sets the most a top-up may add | Platform; Credit Officer | — | DE-01, DE-02, DE-03, ID-19, MF-06 |
| 3 | The new terms are priced from the product version: the schedule, the APR, the total cost of credit and a new key information document. Arrears interest is never capitalised into new principal | Platform | — | MF-09, MF-23, MF-21, KC-04 |
| 4 | The restructure goes up its own approval chain (approval subject `loan.restructure`), each decision re-authenticated, no one deciding twice | Approvers | T26, T27 | MD-01, MD-05, MD-06, MD-10 |
| 5 | Each guarantor is told of the restructure, and asked to consent where it raises or extends their exposure, before it goes ahead | Guarantors; platform | T34 | MF-37, ID-11, ID-17 |
| 6 | The borrower is given notice of the new terms, at least thirty days before they take effect, and accepts them by signing the variation as they signed the original agreement, with a code to their phone | Borrower | T11, T04 | MF-34, BS-02, ID-11, MF-24 |
| 7 | The restructure is applied in Kapu Core: the same loan re-aged or rescheduled, or a top-up loan that closes the old one, with a chain back to it, its net disbursed as in JN-04 steps 7 and 8 (docs/specs/kapu-core-fineract.md §6). Where the collateral or the amount secured changes, the collateral registry notice is amended | Platform; Credit Officer | — | KC-04, MF-09, MF-11, MF-03 |
| 8 | The borrower and the guarantors receive the new terms by link; the loan is flagged as restructured and tracked as a cohort | Platform | T12 | MF-38, MF-14, MF-09 |
| 9 | Every event is chained and the records kept for at least seven years | Platform | — | RO-24, FC-12 |

## 3 · When it goes wrong

| # | At step | What happens | Capabilities |
|---|---|---|---|
| a | 1 | **The loan has been restructured as often as the policy allows.** Refused, unless the override authority approves it, on the record | MF-09, MF-07 |
| b | 3 | **The new terms would fold arrears interest into principal.** Refused: that would evade the arrears cap (reg 29) | MF-21 |
| c | 6 | **The borrower does not accept the variation in time.** It lapses and the loan keeps its terms (reg 54(7)) | MF-24, MF-34 |
| d | 5 | **A guarantor will not consent** to a restructure that extends their exposure. It is held: Roan Capital decides whether to go on with the guarantee unchanged, find another guarantor, or not restructure (§5) | MF-37 |
| e | 4 | **An approver declines, or returns it.** Declined with the reasons kept, or back to step 2 | MD-05 |
| f | 7 | **The loan is non-performing when restructured.** The cap's episode carries over, and the classification follows payment on the new schedule, never reset by the restructure alone (regs 29(3), 57) | MF-21, MF-25 |
| g | 2 | **A top-up would take the borrower above their tier's limit.** Refused; more evidence and a higher tier first | ID-19 |
| h | 1 to 8 | **No connection.** As JN-02 §3 i: nothing moves offline | ID-15 |
| i | 7 | **A refinance or top-up while interest is overdue.** Fineract's top-up would pay that interest off out of the new loan's principal, capitalising it (reg 29). Refused until the overdue interest is paid or waived | MF-09, MF-21 |
| j | 1 to 6 | **The borrower stops partway.** As c: an offer not accepted in time lapses, and the loan keeps its terms | MF-24, MF-09 |

## 4 · Gaps

| Gap | Release or phase today | In its absence | Proposed |
|---|---|---|---|
| Whether reg 54(7)'s thirty days' notice applies when the borrower asks for the restructure, which can delay relief to a borrower in distress | A question for counsel | The design waits the thirty days | Ask counsel (FS-624) |
| Whether a guarantor must consent to a restructure that raises or extends their exposure, and what happens to the guarantee if they will not | A question for counsel | The design asks for consent and holds without it (§3 d) | Ask counsel (FS-624) |

## 5 · Open questions

- Roan Capital's restructuring policy: which kinds it offers, how often
  per loan, and who approves (delivery map, open answer 10).
- Counsel, as in §4: the notice period on a borrower's own request, and a
  guarantor's consent to a variation (FS-624).
