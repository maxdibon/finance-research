---
id: jn-11-transfer-out
name: JN-11 · A transfer out through a larger bank, by EFT or RTGS
kind: journey
release: R2
status: draft
law: LR-14
released: 2026.10.16
validated_with: not yet
owner: Solution architect
classification: Internal
review_ids: [FS-548, FS-585, FS-586, FS-668, FS-783, FS-1171]
last_reviewed: 2026-11-11
---

# JN-11 · A transfer out through a larger bank, by EFT or RTGS

A customer of a microfinance bank sends money to an account at another
bank: a supplier, a landlord, school fees. The microfinance bank is not a
direct member of every payment system, so the transfer goes out through
a larger bank where it holds a settlement account (rails RL-27, FS-585).
That account is modelled as an account of its own; the larger bank's
cut-offs are rules on the calendar; nothing is released unless the
settlement account covers it; and a transfer that comes back reverses
the customer's posting, on its original date.

In R2 the customer gives the instruction at a branch, or in writing to
the bank; self-service transfers from the app are phase 2 (OC-07).
PesaLink and SWIFT follow the same steps and are phase 2 (§4).

## 1 · Who and where

- **Who:** the customer; the bank's officer who enters the instruction
  (the maker); its approver (the checker); its treasury or finance team,
  for the settlement account; its compliance officer, for a hold; the
  larger bank, which carries the transfer.
- **Channel:** the branch counter or a signed instruction; the bank's
  back office; the larger bank's API, host-to-host files, or internet
  banking released by the bank's signatories (RL-07); SMS to the
  customer.
- **Starts when:** the customer gives the instruction.
- **Ends when:** the larger bank's statement shows the transfer, matched
  to its instruction, and the customer has been told it was sent; or it
  came back, the customer's account was credited back on the original
  date, and they were told why.
- **Target:** an instruction approved and released before the larger
  bank's cut-off for its rail, the same business day if given before the
  bank's own cut-off; the customer told within a minute of release
  (owner, FS-783).
- **Moments that matter:** handing over the instruction, when the
  customer needs to know when the money will arrive; the money leaving,
  with a reference they can give the recipient; a return, which must say
  plainly that their money is back.
- **Data:** the customer's identity and account; the recipient's name,
  bank and account, which the anti-money-laundering regulations require
  to travel with the transfer (reg 32); the purpose (privacy PR-02,
  PR-05).

## 2 · Steps

```
  1 The customer gives the instruction; the officer enters it
        |-- not given in person ......................... called back first (3n)
        v
  2 The checks: balance and holds, limits and cut-offs, the recipient's name
        |-- not enough in the account .................. refused (3a)
        |-- the recipient's name does not match ........ held (3b)
        |-- a match on a sanctions list, or a pattern .. to compliance (3i)
        v
  3 A second person approves, re-authenticated
        |-- not approved today ......................... reminded, then lapses (3m)
        v
  4 The customer's account is debited, with the fee
        v
  5 The settlement account at the larger bank covers it
        |-- it does not ................................ held until funded (3d)
        v
  6 Released before the larger bank's cut-off, with the details reg 32 requires
        |-- after the cut-off .......................... the next window (3c)
        |-- the customer cancels before release ........ cancelled (3h)
        v
  7 The larger bank accepts it; the customer is told it was sent
        |-- rejected ................................... the posting reversed (3e)
        |-- no answer .................................. pending, never resent (3g)
        v
  8 Its statement shows the transfer, matched to the instruction
        |-- returned later by the recipient's bank ..... reversed, told (3f)
        v
  9 Chained and kept seven years
        :
    The platform down ............................... the bank's own fallback (3l)
    A transfer abroad ............................... phase 2 (3j)
    An instant transfer ............................. phase 2 (3k)
    Stops partway ................................... reminded, then lapses (3m)
```

| # | Step | Who | Messages | Capabilities |
|---|---|---|---|---|
| 1 | The customer gives the instruction at a branch, or signed in writing; the officer checks their identity and enters it: amount, the recipient's name, bank, branch and account, the purpose. The rail follows the amount and urgency: EFT, or RTGS above the bank's threshold or when it must arrive the same day | Customer; officer | — | RL-01, RL-27 |
| 2 | The platform checks the instruction: the available balance and any holds; the customer's limits and the bank's transaction rules; the rail's cut-off on the business calendar; and the recipient's name, through the larger bank's account-validation service where it offers one | Platform | — | FC-16, KC-15, RL-29 |
| 3 | A second person approves it, never the one who entered it, re-authenticated at the act, by the amount tier the bank's chain sets | Approver | T26 | MD-01, MD-06, MD-10 |
| 4 | The customer's account is debited with the amount and the bank's fee, the instruction keeping one id from here to settlement | Platform | — | RL-01, RL-27 |
| 5 | The settlement account at the larger bank must cover this transfer and every other queued for release; the balance comes from that bank's API or its latest statement | Platform | — | RL-27, TR-01 |
| 6 | Released before the larger bank's cut-off for the rail, carrying the sender's name, account and identity and the recipient's name and account, as reg 32 requires; by the larger bank's API or host-to-host, signed with the bank's key inside OpenBao, or as a file its signatories release in internet banking | Platform; signatories | — | RL-27, RL-07, RL-12, RL-14 |
| 7 | The larger bank accepts the instruction; the customer is told it was sent, with the reference to give the recipient and the day it should arrive | Platform | T45 | RL-01, RL-10, MS-12 |
| 8 | The larger bank's statement shows the transfer leaving the settlement account; it is matched to its instruction, and the instruction closes as settled | Platform | — | RO-01, RO-02, RL-27 |
| 9 | Every event is chained; the instruction, its approval and the details reg 32 requires are kept for at least seven years | Platform | — | RO-24, FC-12 |

## 3 · When it goes wrong

| # | At step | What happens | Capabilities |
|---|---|---|---|
| a | 2 | **Not enough in the account,** or a hold on it. Refused at entry; the officer tells the customer what is available | FC-16 |
| b | 2 | **The recipient's name does not match** the account. Held, never sent on a mismatch; the customer confirms the details, or the instruction is cancelled | RL-29 |
| c | 6 | **After the larger bank's cut-off** for the rail. The transfer waits for its next window, the next business day, and the customer is told the day it will go | FC-16, KC-15 |
| d | 5 | **The settlement account does not cover it.** Held, with every transfer behind it; the treasury team is alerted with the shortfall and funds the account, and the transfers go in order once covered | TR-01, RL-27 |
| e | 7 | **The larger bank rejects it:** a format, a closed account, a rail refusing it. The customer's posting is reversed on its original date, the fee by the bank's rule, and they are told why in plain words (T46) | RL-01, RL-27 |
| f | 8 | **The recipient's bank returns it later.** The return is matched to its instruction; the customer's account is credited back, dated as the original debit, so nothing runs on money they never parted with; they are told (T46) | RL-01, RO-02 |
| g | 7 | **No answer from the larger bank.** Pending, not failed: a status query or the statement settles it; it is never resent blind | RL-10, RL-14 |
| h | 6 | **The customer cancels.** Before release, cancelled and the posting reversed; after release, a recall asked of the larger bank, which the recipient's bank may refuse; the customer is told which | RL-01 |
| i | 2 | **A sanctions match on the recipient, or a pattern the rules flag.** Held for the compliance officer, in the restricted team; the customer is not told why, since tipping off is an offence | FC-05, FC-16 |
| j | 1 | **A transfer abroad.** SWIFT through the larger bank, with its charges and exchange rate: phase 2 | RL-28 |
| k | 1 | **An instant transfer** by PesaLink: phase 2 | RL-06 |
| l | 1 to 8 | **The platform is down.** The bank's own staff send urgent transfers from the larger bank's internet banking under its two-person control, recorded as manual acts and approved afterwards; anything queued is checked against the statement before release, so nothing goes twice (JN-19) | RL-14, MD-01 |
| m | 3 | **The instruction stops partway:** entered and not approved. The approver is reminded, then the request escalates; an instruction not released by the end of its business day lapses and the reserved amount returns to the customer, who is told (owner, FS-783) | MD-08 |
| n | 1 | **An instruction not given in person,** by letter or email, above the bank's threshold or to a recipient the customer has not paid before: the officer calls the customer back on the number on record before entering it, and notes the call | — |

## 4 · Gaps

| Gap | Release or phase today | In its absence | Proposed |
|---|---|---|---|
| OC-07, transfers from the customer's app (step 1) | phase 2 | At the branch, or in writing | Accept for R2 |
| RL-28, SWIFT through the larger bank (3j) | phase 2 | Cross-border transfers by the bank's existing process, outside the platform | Accept for R2 |
| RL-06, PesaLink (3k) | phase 2 | EFT or RTGS | Accept for R2 |
| RO-26, the larger bank's charges checked against its tariff | phase 2 | The treasury team checks the monthly charges by hand | Accept for R2 |
| FC-08, case management for a hold (3i) | phase 2 | A ticket for the compliance officer in the bank's helpdesk, restricted | Accept for R2 |
| A call-back before an instruction not given in person (step n) | Not specified | The bank's own procedure | A handbook procedure for the bank; a capability if a bank asks for it |

## 5 · Open questions

- **For the first bank and its larger bank:** the cut-off for each rail;
  the channel for instructions (API, host-to-host, or internet banking);
  the account-validation service; how a rejection and a return are
  reported; the RTGS threshold; whether the microfinance bank is itself a
  direct member of any rail (FS-585).
- **For the first bank:** its fees, its approval tiers, and its rule for
  the fee on a rejected transfer.

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-14](../law/LR-14.md) The Proceeds of Crime and Anti-Money Laundering Regulations, 2023, Legal Notice No. 153 of 2023.** Regulator: The Financial Reporting Centre, with each institution's supervisor. Made under: The Proceeds of Crime and Anti-Money Laundering Act (Cap. 59A). In force: Yes. Version read: as at 2023-11-17, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2023/153/eng@2023-11-17).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 32 | reg 32 | Every wire transfer carries the originator's name, account or reference and address or ID, and the beneficiary's name and account or reference; intermediary and receiving institutions have risk-based rules for a transfer lacking them, to execute, reject or suspend it (32(6)); no transfer to or from a person designated under the UN Security Council's terrorism resolutions (32(8)) |
