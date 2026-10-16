---
id: jn-14-loan-settled
name: JN-14 · A loan settled, its guarantors and collateral released
kind: journey
release: R1
status: draft
law: LR-39
released: 2026.10.16
validated_with: not yet
owner: Solution architect
classification: Internal
review_ids: [FS-519, FS-548, FS-602, FS-619, FS-668, FS-684, FS-687, FS-685, FS-686]
last_reviewed: 2026-10-16
---

# JN-14 · A loan settled, its guarantors and collateral released

A borrower pays off a Roan Capital loan in R1, on its last due date or
early, and gets back everything the loan held: the guarantors' promises,
the collateral registry's notice, the vehicle's joint registration with
NTSA, and the original logbook or title in Roan Capital's custody.
Early settlement is a right: without notice or penalty, and with no
interest for the time left to maturity (CBK lender regulations reg
56(3) and (4)). The registry notice must be cancelled once the debt is
extinguished (Movable Property Security Rights Act s.33); here it is
cancelled unasked, as part of the release.

The platform does not perform the registry, NTSA or custody steps in R1:
named officers do, on the registry's portal, NTSA's and in the strong
room, and the platform tracks each step with its owner, due date and
evidence (mfi MF-04, FS-619).

## 1 · Who and where

- **Who:** the borrower; their guarantors; Roan Capital's Credit Officer,
  who owns the release; the officer who holds the custody log; a second
  person who approves releasing the originals.
- **Channel:** the borrower's own page and SMS; the back office for
  staff; the registry's portal (eCitizen) and NTSA's for the officers;
  Roan Capital's office, in person, for the originals.
- **Starts when:** the borrower asks what it takes to settle, or the last
  instalment falls due.
- **Ends when:** the loan is closed at zero, the guarantors released, the
  registry notice cancelled, the joint registration removed, and the
  originals handed back against the borrower's signature; or the release
  is held, with the reason the borrower has been told.
- **Target:** "settled" sent within minutes of the last payment; every
  release step lodged, and the originals ready, within ten working days
  (proposed; the law's ten days for the registry, MPSR Act s.33).
- **Moments that matter:** the last payment, confirmed at once as
  "settled", with nothing that can follow it as a surprise charge; the
  logbook or title back, with a date and what to bring; for a guarantor,
  being told they are free.
- **Data:** the payoff amount and payments; the collateral's records,
  registry and NTSA references; the borrower's identity checked at
  collection, and their signature on the custody log; where someone
  else collects, their name and ID number (Restricted, encrypted one by
  one, SE-27) and the authority; for an estate, the grant and the death
  certificate (privacy PR-02, PR-03).

## 2 · Steps

```
  1 The borrower asks for the amount to settle, or the last
    instalment falls due
        v
  2 The payment lands and is applied
        |-- more than the amount owed ............... the rest returned (3b)
        |-- less than the amount owed ............... stays open (3c)
        |-- the amount disputed ..................... a complaint (3d)
        v
  3 The loan closed at zero; the borrower told "settled"
        v
  4 Guarantors released and told
        v
  5 The release checklist opens: registry, NTSA, insurer, tracker
        |-- the collateral secures another loan ..... kept (3e)
        |-- the registry or NTSA does not answer .... tracked, escalated (3f)
        v
  6 The hold passes; the originals approved for release
        |-- the payment reversed in the hold ........ reopened (3a)
        v
  7 The borrower collects, identity checked, signs
        |-- someone else comes ...................... only with authority (3g)
        |-- the originals cannot be found ........... incident (3h)
        |-- the borrower has died ................... the estate (3i)
        v
  8 Chained, logged, kept seven years after closure
        :
    The platform down ........................... payment still lands (3j)
    Stops partway ............................... reminded, kept (3k)
```

| # | Step | Who | Messages | Capabilities |
|---|---|---|---|---|
| 1 | The borrower asks for the amount to settle, on their page or through the officer; it is calculated to a date, with no interest after the day it is paid and no penalty for paying early, and sent valid to that date | Borrower; platform | T37 | MF-22, MF-38, KC-04 |
| 2 | The payment lands on Roan Capital's paybill or bank account, is matched to the loan, and applied in the regulated order | Platform | T06 | MF-10, MF-22, RO-02 |
| 3 | At zero, Kapu Core closes the loan. The borrower is told it is settled, what happens to the collateral and when, and that they may stop marketing messages from Roan Capital (lender regulations reg 27(3)); the settlement letter is on their page | Platform | T14 | KC-04, MF-38, MS-11 |
| 4 | Each guarantor's guarantee is released and the guarantor told; a guarantor who also guarantees another live loan stays bound to that one only | Platform | T21 | MF-37 |
| 5 | The release checklist opens for the collateral type, each step with an owner and a due date: the registry's cancellation notice registered on its portal and its number recorded, with the borrower's copy; NTSA's joint registration removed; the insurer and the tracking provider told that Roan Capital's interest has ended. Each step's evidence is filed in the vault | Credit Officer; platform | — | MF-03, MF-04, ID-15 |
| 6 | Once the final payment is reconciled and a short hold has passed (proposed: three business days, against a reversal of the payment), a second person approves releasing the originals from custody | Approver | T38 | MF-03, MD-06, RO-02 |
| 7 | The borrower collects the originals in person: their ID checked against the record, the handover signed on the custody log with the date and who handed over | Borrower; custody officer | — | MF-03, ID-02 |
| 8 | Every event is chained; the loan, the release evidence and the custody log kept for at least seven years after closure | Platform | — | RO-24, RO-19, FC-12 |

## 3 · When it goes wrong

| # | At step | What happens | Capabilities |
|---|---|---|---|
| a | 6 | **The final payment is reversed during the hold** (the payer asks Safaricom to reverse it, or a bank deposit is returned). The loan reopens with the amount owed; nothing has left custody; the borrower is told, and the release waits | MF-10, RO-02, KC-04 |
| b | 2 | **The payment is more than the amount owed.** The loan is settled; the excess is returned to where it came from, as an unplaced payment's return (JN-16 §3 d) | RL-01, CO-21 |
| c | 2 | **The payment is less than the amount owed,** by a small amount or a charge the borrower did not expect. The loan stays open; the borrower is told the exact balance and why. A small balance is never written off silently: only under Roan Capital's policy, with a second person's approval (§5) | MF-38, MD-06 |
| d | 2, 3 | **The borrower disputes the final amount.** A complaint is logged with its clock and acknowledged; the loan is not closed while it runs, and no arrears action is taken on the disputed amount | MF-28 |
| e | 5 | **The collateral also secures another of the borrower's live loans.** It is not released, and the borrower is told which loan still holds it; the settled loan's guarantors are released all the same | MF-03 |
| f | 5 | **The registry's portal or NTSA does not answer,** or a step is late. The step is retried and stays open; its owner is reminded, then it is escalated; the registry's ten working days are tracked as a deadline | MF-04, MD-08 |
| g | 7 | **Someone other than the borrower comes for the originals.** Only on the borrower's authority (FS-685). The borrower asks for it on their page; it is generated from Roan Capital's template, naming the collector and their ID number, what is released and the date it is valid to, and signed in Odoo Sign with a code to the borrower's bound phone. It is single-use, and the borrower can revoke it until it is used. At the counter, the collector's ID is checked against the authority, and a code goes to the borrower's phone that the collector must give, so a stolen or forged authority is not enough. The authority, the check, the code and the collector's signature are filed in the vault and linked to the custody log entry. A borrower who cannot use their phone signs a paper authority, confirmed by a call to their registered number before release | MF-03, MF-34, BS-02, AC-13, ID-15 |
| h | 7 | **The originals cannot be found in custody.** An incident: the custody log shows who last held them; Roan Capital replaces the document at its own cost (a duplicate logbook from NTSA), and the borrower is told the date | MF-03, BS-01 |
| i | 7 | **The borrower has died.** The originals go only to the personal representative: the executor or administrator named in a grant of representation (Law of Succession Act s.3, s.79). Anyone else taking them intermeddles with the estate, an offence (s.45); a chief's letter is not a grant. Checked: the court's certified copy of the grant, confirmed with the registry that issued it; any limit on the grant (s.54); the representative's ID against the name on the grant; the death certificate. Reviewed by the compliance officer before release; Roan Capital is protected when it acts in good faith on the grant (s.92). Moving the vehicle to an heir is the representative's act, after the grant is confirmed (s.55, s.71) | MF-03, ID-15, BS-01 |
| j | 2 | **The platform is down.** The payment still lands in Roan Capital's own paybill or account (architecture §3) and is applied when the platform returns; "settled" follows then | MF-10, RL-20 |
| k | 1, 7 | **The borrower stops partway:** asks for the amount and does not pay, or does not come for the originals. The figure lapses on its date and the loan runs on as agreed; uncollected originals stay in custody, and the borrower is reminded after 30 days and then every 90 (proposed) | MF-38, MF-03 |

## 4 · Gaps

| Gap | Release or phase today | In its absence | Proposed |
|---|---|---|---|
| MF-05, NTSA by API | phase 2 | An officer removes the joint registration on NTSA's portal, and the step is tracked | Accept for R1 (FS-619) |
| An API to the collateral registry | None documented (partners PT-55) | An officer registers the cancellation on the registry's portal, and the step is tracked | Accept for R1 |
| MF-18, land titles: charge discharged at the land registry | phase 2 | A land title is stored only in R1; its discharge is done by Roan Capital's advocate and tracked as a manual step | Accept for R1 |
| MF-30, the collateral's lifecycle (insurance, discharge status, reminders) | phase 1, not in R1 | MF-04's checklist tracks the release steps; insurance and tracker notices are steps on it | Accept for R1 |
| CR-03, the settled status reported to credit bureaus | phase 1, not in R1 | Roan Capital reports as it does today, if it does | Decide with open answer 12 |

## 5 · Open questions

- **For Roan Capital:** the settlement letter's template; its policy on
  small balances left after the last payment; the hold before releasing
  originals; who holds the custody log and who approves a release; how
  it removes a joint registration with NTSA today, and how long it takes;
  the wording of the authority to collect (3g).
- **Decided** (FS-687): "settled" is sent at once, since the loan is paid;
  only the originals wait for the hold.

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](../law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 27 | reg 27(3) | Thirty days' notice to the Central Bank before a new delivery channel rolls out, with the mobile money account, apps and bank accounts to be used; a way to opt out of marketing messages; channels that are available, safe, protected from fraud, easy to use and affordable |
| reg 56 | reg 56(3), reg 56(4) | A repayment credited on the day it is paid, applied to due principal, then fees and charges, then interest; early repayment, in whole or part, without notice or penalty (56(3)), and no interest for the remaining term on full early repayment (56(4)) |

**[LR-23](../law/LR-23.md) The Movable Property Security Rights Act (Cap. 499A).** Regulator: The Registrar of security rights, who keeps the collateral registry. Made under: An Act of Parliament. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2017/13/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 33 | s. 33 | The secured creditor registers an amendment or cancellation notice where a notice exceeds what the grantor authorised, collateral is released, or the security right is extinguished; free of charge, and within ten working days of the grantor's request, or the grantor may go to the Registrar |

**[LR-39](../law/LR-39.md) The Law of Succession Act (Cap. 160).** Regulator: None: the courts grant representation and supervise estates. Made under: An Act of Parliament. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/1972/14/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 3 | s. 3 | Its definitions: a personal representative is the executor or administrator of a deceased person; the estate is their free property; a child includes one conceived but not yet born |
| s. 45 | s. 45 | No one may take possession of, dispose of, or otherwise intermeddle with a deceased person's free property except as the Act, another law or a grant of representation allows: an offence, and answerable to the rightful representative |
| s. 54 | s. 54 | The court may limit a grant of representation, in the forms the Fifth Schedule lists |
| s. 55 | s. 55 | No grant, limited or not, allows capital assets to be distributed until it is confirmed under s. 71 |
| s. 71 | s. 71 | After six months, or less if the court directs, the holder of a grant applies to the court to confirm it, so the capital can be distributed |
| s. 79 | s. 79 | The executor or administrator granted representation is the deceased's personal representative, and the estate's property vests in them, subject to any limit on the grant |
| s. 92 | s. 92 | A person who pays or transfers in good faith under a grant of representation is protected, even if the grant is later found defective or revoked |
