---
id: architecture-runtime
name: Architecture runtime — how a payment moves
kind: architecture
status: draft
released: 2026.10.15
owner: Solution architect
classification: Internal
review_ids: [FS-588, FS-649, FS-652, FS-1053]
last_reviewed: 2026-10-29
---

# Runtime: how a payment moves

Sequence diagrams for the two flows that carry money in R1, in the order
a loan meets them: the disbursement going out, then a repayment coming
in (FS-649, FS-652). Each numbered arrow is explained under its diagram.
The lending service is Kapu MFI's service (lending-service), the only
writer to the ledger, always through the core adapter; staff work in the
staff workspace inside Odoo. The night's close is in
[the end-of-day runner](../specs/end-of-day-runner.md) §5; what people
see is in [the journeys](../journeys/README.md).

## 1 · A disbursement, from approval to the ledger

R1 pays out by bank only, as Roan Capital agreed on 21 October: NCBA,
by a payment file Roan Capital's signatories release in its internet
banking, until NCBA grants an API (rails RL-07).

```
    officer   LENDING    APPROVALS  approver    ACCESS      RAILS      NCBA     KAPU CORE
       |          |          |          |          |          |          |          |
       | 1 ask    |          |          |          |          |          |          |
       |--------->|          |          |          |          |          |          |
       |          | 2 ask    |          |          |          |          |          |
       |          |--------->|          |          |          |          |          |
       |          |          | 3 asks   |          |          |          |          |
       |          |          |--------->|          |          |          |          |
       |          |          |          | 4 code   |          |          |          |
       |          |          |          |--------->|          |          |          |
       |          |          | 5 token  |          |          |          |          |
       |          |          |<--------------------|          |          |          |
       |          | 6 yes    |          |          |          |          |          |
       |          |<---------|          |          |          |          |          |
       |          | 7 instruction       |          |          |          |          |
       |          |------------------------------------------>|          |          |
       |          |          |          |          |          | 8 name?  |          |
       |          |          |          |          |          |--------->|          |
       |          |          |          |          |          | 9 file   |          |
       |          |          |          |          |          |--------->|          |
       |          |          |          |          |          | 10 paid  |          |
       |          |          |          |          |          |<---------|          |
       |          | 11 confirmed        |          |          |          |          |
       |          |<------------------------------------------|          |          |
       |          | 12 disburse, through the CORE ADAPTER                |          |
       |          |---------------------------------------------------------------->|
       |          |          |          |          |          |          |          |
```

| # | What happens | Where |
|---|---|---|
| 1 | The officer asks to disburse an approved loan, in the staff workspace | mfi MF-11; [staff-workspace](../specs/staff-workspace.md) |
| 2 | The lending service opens a `loan.disbursement` request, with the amount, payee and a hash of the instruction's content | [approval-engine](../specs/approval-engine.md) |
| 3 | The engine asks the approver: console or email link | MD-18 |
| 4 | The approver gives the second factor again | AC-05 |
| 5 | Keycloak returns a token at level 3, bound to this request and its hash | [access-keycloak](../specs/access-keycloak.md) §7 |
| 6 | The engine approves, after every step in the chain | MD-01 to MD-10 |
| 7 | The lending service sends one instruction; rails refuses it if its hash differs from what was approved | RL-01; FS-588 |
| 8 | The account holder's name is confirmed with the bank first; a mismatch holds the payout | RL-29 |
| 9 | The payment goes to NCBA as a file its signatories release in internet banking (R1), or by its API once granted | RL-07 |
| 10 | NCBA's status and its statement close the instruction; silence is "unknown", settled by a status query, never resent blind | RL-01, RL-10, RL-14 |
| 11 | Rails confirms to the lending service | RL-02 |
| 12 | Only then is the disbursement posted to Fineract, through the core adapter | [lending-service](../specs/lending-service.md); [kapu-core-fineract](../specs/kapu-core-fineract.md) §5 |

**Paying out by M-Pesa instead,** where an institution does: step 8 is
Hakikisha's registered name (RL-21, MF-20) and step 9 the B2C payment
(RL-03). Reconciliation then matches the payout with the posting, and
messaging sends the borrower T05, as §2 shows for a repayment.

## 2 · A repayment, from M-Pesa to the receipt

```
   borrower    M-Pesa      RAILS    LENDING     LENDER    KAPU CORE    RECON    MESSAGING
       |          |          |          |          |          |          |          |
       | 1 pays   |          |          |          |          |          |          |
       |--------->|          |          |          |          |          |          |
       |          | 2 notify |          |          |          |          |          |
       |          |--------->|          |          |          |          |          |
       |          | 3 status |          |          |          |          |          |
       |          |<---------|          |          |          |          |          |
       |          |          | 4 event  |          |          |          |          |
       |          |          |--------->|          |          |          |          |
       |          |          |          |          |          |          |          |
       |          |          |          |- 5 match |          |          |          |
       |          |          |          | 6 check  |          |          |          |
       |          |          |          |--------->|          |          |          |
       |          |          |          | 7 post, through     |          |          |
       |          |          |          | the CORE ADAPTER    |          |          |
       |          |          |          |-------------------->|          |          |
       |          |          |          |          |          | 8 posted |          |
       |          |          |          |          |          |--------->|          |
       |          |          | 9 rail event        |          |          |          |
       |          |          |------------------------------------------>|          |
       |          |          |          | 10 receipt, T06     |          |          |
       |          |          |          |------------------------------------------>|
       | 11 SMS   |          |          |          |          |          |          |
       |<---------------------------------------------------------------------------|
       |          |          |          |          |          |          |          |
```

| # | What happens | Where |
|---|---|---|
| 1 | The borrower pays the institution's paybill, the loan number as the account | mfi MF-10; collect CO-21 |
| 2 | M-Pesa calls back with the confirmation | rails RL-03 |
| 3 | An unsigned callback is confirmed by a status query before it is believed | RL-11 |
| 4 | Rails publishes the payment, the M-Pesa receipt as its reference | RL-02 |
| 5 | The lending service finds the loan: the account number first, then the paying phone; no match goes to the holding queue, never guessed | [README](README.md) §5 |
| 6 | Lender rules check the allocation: principal, then fees, then interest | MF-22 |
| 7 | The repayment is posted to Fineract through the core adapter, dated by the receipt's time, carrying the receipt as its external id; during the night's close Fineract may answer 409, and the lending service retries | [kapu-core-fineract](../specs/kapu-core-fineract.md) §5, §7 |
| 8 | Fineract's posting reaches reconciliation as an event | RO-01 |
| 9 | So does the rail's own event; reconciliation matches the two | RO-02 |
| 10 | The lending service asks messaging for the receipt | [messaging](../specs/messaging.md) T06 |
| 11 | The borrower receives the amount, date and reference, never the balance | MF-38 |

**If the callback never comes,** the night's pull of M-Pesa's transactions
finds the payment (RL-20) and the same steps follow from 4. **A repayment
by bank** arrives in the bank's statement instead (RL-07, RO-01), and
follows from 4.
