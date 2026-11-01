---
id: jn-15-micro-trader
name: JN-15 · A trader who does not read, paid to his own till
kind: journey
release: phase 2
status: draft
released: 2026.10.15
validated_with: not yet
owner: Solution architect
classification: Internal
review_ids: [FS-548, FS-637, FS-668]
last_reviewed: 2026-10-09
---

# JN-15 · A trader who does not read, paid to his own till

A street trader sells small goods on foot. Today buyers pay a phone
number on a card that carries someone else's name, perhaps his
supplier's, and write their name and the amount in a book he carries; he
does not seem to read (FS-637). Dibon sells to institutions and
businesses, not to him, so he is reached through one: a bank, Sacco or
MFI that serves traders, or the supplier whose stock he sells. Without
us, Pochi la Biashara in his own name already helps; this journey is what
an institution can add. Every step must work without reading words.

## 1 · Who and where

- **Who:** the trader; the institution's officer; his supplier, if he
  sells for one; his buyers; later, a lender.
- **Channel:** his own phone, by voice and SMS; the officer in person;
  the buyers' M-Pesa.
- **Starts when:** an institution or a supplier offers him his own till.
- **Ends when:** he is paid in his own name, told without reading,
  saving, and repaying a stock loan from his sales.
- **Target:** each payment confirmed to him within a minute (proposed).
- **Moments that matter:** hearing that he has been paid; the first loan offer, explained by voice before he accepts.
- **Data:** his identity as JN-01, his payments and the voice line's record (privacy PR-01, PR-02, PR-07).

## 2 · Steps

```
  1 Enrolled by an officer: his ID, his own SIM, the lightest tier
        |-- no identity document ........... stays on the supplier's till (3a)
        v
  2 Given his own till, in his own name
        v
  3 A buyer pays; the payment is matched to him
        |-- paid to the wrong number ....... held, never guessed (3b)
        |-- his SIM has changed ............ held until re-verified (3c)
        v
  4 He is told without reading: the amount as numbers, or by voice
        |-- he misses it ................... the total waits on the voice line (3d)
        v
  5 At day's end: his total; his supplier sees his sales
        v
  6 A share of the day saved, in his own account or his chama's
        v
  7 A stock loan offered from his payment history, explained by voice
        |-- declined ....................... reasons by voice (3e)
        v
  8 Repaid in small daily amounts from his sales
        |-- a repayment missed ............. reminders by voice, in hours (3f)
        :
    Phone lost at any step ............... blocked by a call (3g)
    Stops partway .................... kept, resumed or lapsed (3h)
```

| # | Step | Who | Messages | Capabilities |
|---|---|---|---|---|
| 1 | The institution's officer enrols him in person: his national ID checked against the register, his own SIM bound to it, the lightest KYC tier. The officer reads him the terms; he confirms with a code to his own phone, which he reads as numbers | Officer; trader | T31 | ID-01, ID-12, ID-19 |
| 2 | He gets his own till, or an account number under the institution's or supplier's paybill, registered in his own name, so buyers see his name before they pay | Institution | — | CO-21, RL-24 |
| 3 | A buyer pays; the payment is matched to him by his till or account number, with no book to write in | Platform | — | CO-21, RO-02 |
| 4 | He is told at once in a way that needs no reading: the amount as numbers by SMS, and the running total on the voice line in Swahili or English | Platform; trader | — | MS-12, OC-22 |
| 5 | At the end of the day he calls the voice line for his total. If he sells for a supplier, the supplier sees each seller's payments matched against the stock given out | Trader; supplier | — | OC-22, SR-03, SR-06 |
| 6 | A share of each day's takings goes to savings in his own account, or his chama's, by a standing order he agreed to | Trader | — | RL-23, SC-19 |
| 7 | After months of payments, a lender offers a stock loan with a limit from his payment history, explained by voice before he accepts | Lender | — | DE-02, MF-06, OC-22 |
| 8 | He repays in small daily amounts from his sales, matched automatically | Platform | — | MF-10, RO-02 |

## 3 · When it goes wrong

| # | At step | What happens | Capabilities |
|---|---|---|---|
| a | 1 | **He has no identity document.** He cannot be enrolled; he stays paid to the supplier's till as today, and the officer tells him what he needs | ID-01, ID-19 |
| b | 3 | **A buyer pays the wrong number.** The payment sits unapplied and visible, never guessed; it is returned or applied on evidence | CO-21, RO-02 |
| c | 3 | **His SIM has changed**, from a swap or a new phone. Money movement and resets are held until an officer re-verifies him | ID-12, ID-13 |
| d | 4 | **He misses the message.** The total waits on the voice line; nothing depends on reading the SMS | OC-22 |
| e | 7 | **The loan is declined.** The reasons are explained by voice; where the decision was automated he is told so, and can ask for a person | MF-29, OC-22 |
| f | 8 | **A repayment is missed.** Reminders by voice and SMS, only to him, only in working hours, with no shaming words | MF-26 |
| g | 1 to 8 | **His phone is lost or stolen.** He blocks his access by calling from any phone; recovery only after re-verification | AC-14, ID-13 |
| h | 1 | **He stops partway through enrolment.** The officer keeps the draft for 30 days (proposed); nothing is opened until it is complete | ID-19, ID-01 |

## 4 · Gaps

| Gap | Release or phase today | In its absence | Proposed |
|---|---|---|---|
| A spoken confirmation of each payment, sent to him (step 4) | Not a capability; the voice line (OC-22) answers calls only | The amount as numbers by SMS; the total on the voice line | Add outbound voice confirmations to omni-channel beside OC-22, phase 2 (FS-637) |
| Every channel but voice assumes reading: USSD menus (OC-03), the app (OC-01), links | phase 1 and 2, as designed | An officer or family member reads for him | The principle "nothing needs reading" (omni-channel §1, FS-637), applied as each channel is drawn |
| A product sold to a single trader directly | Not offered: Dibon sells to institutions and businesses | Pochi la Biashara in his own name, from Safaricom | Reach traders through banks, Saccos and suppliers (docs/market/bank-channel.md) |

## 5 · Open questions

- Whose name is on the card: his supplier's, a relative's, an agent's?
  Asked of traders, through an institution that serves them, not
  assumed (FS-637).
- Which institution would offer this first: a Sacco, an MFI, or a bank
  through the bank channel.
- Whether enough traders read numbers for SMS to carry the amount, or
  voice must come first.
