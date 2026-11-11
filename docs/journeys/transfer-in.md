---
id: jn-12-transfer-in
name: JN-12 · A transfer in through a larger bank, identified and applied or returned
kind: journey
release: R2
status: draft
law: LR-14
released: 2026.10.16
validated_with: not yet
owner: Solution architect
classification: Internal
review_ids: [FS-548, FS-585, FS-668, FS-784, FS-1171]
last_reviewed: 2026-11-11
---

# JN-12 · A transfer in through a larger bank, identified and applied or returned

Someone sends money by EFT or RTGS to a customer of a microfinance bank:
an employer's salary, a client's invoice payment, a relative. The
microfinance bank receives it in its settlement account at a larger bank
(rails RL-27, FS-585), so the transfer arrives addressed to the
microfinance bank, with the customer named only in the beneficiary
details or the reference. It is applied to the customer's account only
when it is identified on evidence, never guessed; anything that cannot be
identified is held, worked, and returned to the sender, never kept.

The sender is usually not the bank's customer, so there is no phone to
ask, as there is for an unplaced M-Pesa payment (JN-16): the bank works
through the larger bank, and through its own customer.

## 1 · Who and where

- **Who:** the recipient, the bank's customer; the sender and their
  bank, reached through the larger bank; the bank's accountant, who owns
  the exceptions; its compliance officer, for a hold; two approvers for a
  return.
- **Channel:** the larger bank's API or its statement (by API,
  host-to-host, or the statement email forwarded or uploaded, RO-01);
  the bank's back office; SMS to the customer.
- **Starts when:** a credit appears on the settlement account at the
  larger bank.
- **Ends when:** the money is in the customer's account, dated by the
  larger bank's credit, and the customer has been told; or it is back
  with the sender through the larger bank, with the return's reference,
  and the record says why.
- **Target:** applied within an hour of the larger bank's confirmation
  where its API reports credits, or by 10:00 the morning after where only
  its statement does (proposed); an unidentified credit returned within
  the return window the larger bank confirms (§5), five business days
  proposed.
- **Moments that matter:** the customer expecting money (a salary, a
  client's payment), who needs it to show on the day it arrived; a
  credit that cannot be placed, which must never sit unexplained; a
  return, which the sender's bank must be able to trace.
- **Data:** the sender's name, account and bank and the recipient's
  details that the anti-money-laundering regulations require to travel
  with the transfer (reg 32); the reference (privacy PR-02, PR-05).

## 2 · Steps

```
  1 The sender's bank sends EFT or RTGS to the settlement account,
    with the customer's account number for further credit
        |-- a transfer abroad, or instant ............... phase 2 (3k)
        v
  2 The larger bank's API or statement shows the credit
        |-- only a statement, the morning after ......... applied then (3i)
        |-- the same credit twice ....................... applied once (3g)
        v
  3 The checks: the details reg 32 requires, sanctions, the rules
        |-- the sender's details missing ............... the bank's policy decides (3d)
        |-- a sanctions match .......................... held, reported (3e)
        |-- above the customer's tier .................. held (3f)
        |-- a pattern the rules flag ................... applied; an alert (3h)
        v
  4 Identified: the account number exists and the name agrees
        |-- no account number, or none that exists ..... held, worked, returned (3a)
        |-- the name disagrees ......................... confirmed first (3b)
        |-- the account closed, frozen or dormant ...... returned, held or woken (3c)
        v
  5 Applied to the customer's account, dated by the larger bank's credit
        |-- the sender's bank asks for it back ........ recall (3j)
        v
  6 The customer is told it arrived
        v
  7 Matched: the settlement account's credit and the customer's posting
        :
    The platform down ............................... credits still land (3l)
    Stops partway ................................... aged, escalated, returned (3m)
```

| # | Step | Who | Messages | Capabilities |
|---|---|---|---|---|
| 1 | The sender's bank sends an EFT or RTGS transfer to the microfinance bank's settlement account at the larger bank, naming the customer's account number "for further credit" and the customer's name | Sender | — | RL-27 |
| 2 | The credit is read from the larger bank: from its API where it reports credits, otherwise from its statement, loaded and checked before any line is matched | Platform | — | RL-07, RO-01, RL-27 |
| 3 | The checks before anything is applied: the sender's and recipient's details the regulations require are present; the sender is screened against the sanctions lists; the bank's transaction rules run | Platform | — | FC-05, FC-16 |
| 4 | Identified on evidence: the account number in the beneficiary details exists, is open, and its holder's name agrees with the beneficiary name within the matching rule's tolerance. Anything less is an exception, never a guess | Platform | — | RO-02, RL-27 |
| 5 | Applied to the customer's account in the bank's core, dated by the larger bank's credit, once only for each credit | Platform | — | RL-27, RL-14 |
| 6 | The customer is told: the amount, the sender's name, the reference, the account's last four digits; never the balance | Platform | T47 | MS-12 |
| 7 | The reconciliation cycle matches the settlement account's credit to the customer's posting; the settlement account and the customers' accounts tie out | Platform; accountant | — | RO-02, RO-04, TR-01 |

## 3 · When it goes wrong

| # | At step | What happens | Capabilities |
|---|---|---|---|
| a | 4 | **No account number, or one that exists nowhere.** Held in suspense, never income, and an exception with an owner. The accountant asks the larger bank to query the sender's bank for the beneficiary, and checks with a customer who says they are expecting it; it is applied only once the evidence names one account. Unidentified within the return window, it is returned to the sender through the larger bank, approved by two people, with the return's reference | RO-05, RO-08, RL-01, MD-01, MD-06 |
| b | 4 | **The account number exists but the name disagrees.** Held; the accountant confirms with the customer and, through the larger bank, the sender's bank; applied once both agree, otherwise returned as in (a) | RO-05, RO-02 |
| c | 4 | **The account is closed, frozen or dormant.** Closed: returned to the sender. Frozen: held for the compliance officer, the customer not told why. Dormant: applied, and the account wakes under the bank's rules, the operator's name check run again before it can pay anything out | ID-14, RL-01 |
| d | 3 | **The sender's details are missing** (reg 32(6)). The bank's own risk-based policy decides: suspend and ask for them through the larger bank, or reject and return; the compliance officer owns the decision and its follow-up | FC-16, RL-01 |
| e | 3 | **A sanctions match on the sender.** Held for the compliance officer, who reports it as the law requires; a transfer from a designated person is never applied (reg 32(8)); the customer is not told why, since tipping off is an offence | FC-05, FC-12 |
| f | 3 | **The credit would take the account above its customer's KYC tier.** Held; the customer is asked to complete their identity checks to raise the tier; if they do not within the return window, it is returned | ID-19, RL-01 |
| g | 2 | **The same credit appears twice,** from the API and on the statement. Matched and applied once | RO-02, RL-14 |
| h | 3 | **A pattern the rules flag:** many credits from unrelated senders, or round sums just below a threshold. Applied; an alert to the compliance officer, who decides whether to report it | FC-16 |
| i | 2 | **Only the statement reports credits** (no API yet, as with NCBA in R1). Credits are identified and applied the morning after, when the statement is loaded; a customer expecting money is told it shows the next morning | RO-01 |
| j | 5 | **The sender's bank asks for it back** (a mistake, or fraud). Not yet applied: returned. Already applied: held on the customer's account while the bank decides with the customer's consent, or on a lawful order; never reversed by an edit | RL-01, MD-01 |
| k | 1 | **A transfer from abroad by SWIFT,** or an instant one by PesaLink: phase 2 | RL-28, RL-06 |
| l | 1 to 7 | **The platform is down.** Credits still land on the settlement account; they are read from the larger bank's statement when we return and applied through these same steps, each dated by its credit (JN-19) | RO-01, RL-27 |
| m | 4 | **An exception stops partway:** held and not worked. It ages in the queue by the time left to its return deadline; the day before the deadline it escalates to the finance lead, with a return proposed for two people to approve | RO-05, MD-08 |

## 4 · Gaps

| Gap | Release or phase today | In its absence | Proposed |
|---|---|---|---|
| RL-28 and RL-06, transfers in by SWIFT or PesaLink (3k) | phase 2 | EFT and RTGS only | Accept for R2 |
| FC-08, case management for a hold (3d, 3e) | phase 2 | A ticket for the compliance officer in the bank's helpdesk, restricted | Accept for R2 |
| A virtual account number per customer at the larger bank, so every credit names exactly one account | Not specified | Identification from the beneficiary details and the name, with exceptions worked by hand | Ask the first bank and its larger bank whether they offer it; a capability if they do |
| A query to the sender's bank through the larger bank (3a, 3b) | Not specified: by the larger bank's own process | The accountant asks the larger bank by its channel and notes the answer on the exception | Accept for R2 |

## 5 · Open questions

- **For the first bank's larger bank:** whether its API reports credits
  as they land, and with which details; the return window for EFT and
  RTGS, and how a return and a recall are made; whether it offers
  virtual account numbers.
- **For the first bank:** its risk-based policy for a transfer missing
  the sender's details (reg 32(6)); its rule for a credit above a
  customer's tier.
- **For the owner:** the targets (applied within the hour where the API
  reports credits, by 10:00 the next morning where only the statement
  does; an unidentified credit returned within five business days,
  subject to the larger bank's window).

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-14](../law/LR-14.md) The Proceeds of Crime and Anti-Money Laundering Regulations, 2023, Legal Notice No. 153 of 2023.** Regulator: The Financial Reporting Centre, with each institution's supervisor. Made under: The Proceeds of Crime and Anti-Money Laundering Act (Cap. 59A). In force: Yes. Version read: as at 2023-11-17, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2023/153/eng@2023-11-17).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 32 | reg 32, reg 32(6), reg 32(8) | Every wire transfer carries the originator's name, account or reference and address or ID, and the beneficiary's name and account or reference; intermediary and receiving institutions have risk-based rules for a transfer lacking them, to execute, reject or suspend it (32(6)); no transfer to or from a person designated under the UN Security Council's terrorism resolutions (32(8)) |
