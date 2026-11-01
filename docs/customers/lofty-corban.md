---
id: lofty-corban
name: Lofty Corban — delivery map
kind: delivery
status: living
released: unreleased
owner: Delivery lead
classification: Internal
review_ids: [FS-915, FS-916, FS-917, FS-918, FS-919]
last_reviewed: 2026-10-22
---

# Lofty Corban · delivery map

Customer CU-05 in docs/customers.md. A fund manager in investments and
retirement benefits, with insurance as a new line, regulated by the
Capital Markets Authority, the Retirement Benefits Authority and the
Insurance Regulatory Authority. The source so far is the introduction
and reconciliation demo of 14 October 2026; the notes are held in
clients/lofty-corban/ outside git. Statuses are not repeated here: each
capability's status is in its module.

## 1 · The engagement

Reconciliation for an investment manager's collections and payouts:
every receipt matched and credited to the right customer account in its
fund management system, payouts that did not land caught the same day,
and the fees its banks charge checked against what is refunded. Then
approvals for payouts, recorded as the team grows.

- **Products:** Reconciliation & Observability
  (docs/modules/recon-observability.md) first; approval chains (mandates)
  next; messaging for notices to its customers.
- **Its fund management system:** UnitMaster, by WizGlobal. Matches are
  credited there; how (an API, a file) is open answer 1.
- **Its money:** collections and payouts through Equity; M-Pesa,
  swept to the bank each morning; PesaLink, with real-time notices,
  including from KCB; Direct2Bank, with notices for cash deposits.
- **Its customers' channels:** a portal, an app and email.
- **Confidentiality:** Dibon's NDA was sent to its lead on 16 October
  2026; whether it is signed is open answer 2 (FS-918).
- **Its regulators** are outside the CBK rules our documents are built
  on; the law register gains their instruments under FS-916.

## 2 · Requirements against capabilities

From the meeting of 14 October 2026 (no document yet). Each is what Lofty
Corban is working towards.

| Id | Requirement | Capabilities | Fit | Notes |
|---|---|---|---|---|
| LF-01 | Every collection matched and its customer's account in the fund system credited, across its account types (money market, stock market and others) | RO-01, RO-02 | Partial | Matching covered; the credit into UnitMaster depends on its interface (open answer 1) |
| LF-02 | Bank payments whose notice lacks the payer's details (KCB's PesaLink notices omit the narration) matched on amount, time and payer, the rest owned and followed up | RO-02, RO-05 | Covered | The payer asked to confirm, as in the unplaced-payment journey |
| LF-03 | Less left in suspense: anything unmatched visible, owned and aged, never parked | RO-05, RO-06 | Covered | |
| LF-04 | A payout that failed caught the same day: money left on the M-Pesa payout account at the end of the day traced to the payouts that did not land, the sweep back prompted and the customer's account re-credited, the customer told | RO-07, RO-09, MS-01 | Covered | Today found the next day and moved by request to treasury |
| LF-05 | The morning M-Pesa sweep matched as an internal transfer, not as new money | RO-21, RO-04 | Covered | |
| LF-06 | Collection and payout fees at Equity, charged and then refunded under the trustee fee, checked both ways | RO-26 | Covered | Who the trustee is: open answer 3 |
| LF-07 | Payouts approved in three levels, by role and amount, never by the one who prepared them, every step recorded | MD-01, MD-03, MD-05, MD-06 | Partial | Today a file prepared from the fund system and loaded to Equity's internet banking with three approvals there; whether approvals move to us, or are recorded beside the bank's, is open answer 4 |
| LF-08 | A customer's international transfer not yet received held as in transit, with an expected date, a deadline and a notice to follow up | RO-04, RO-05, MS-01 | Partial | Tracking the transfer itself depends on what its bank provides (FS-919) |

## 3 · Out of scope

- **Its fund management system:** UnitMaster stays its system of record
  for investors and funds; we match and credit into it, never replace it.
- **Its website:** an update was noted as an opportunity; Dibon builds
  and runs websites, and would propose it on its own (FS-917).

## 4 · Open answers

### Open

| # | Question | Raised | Status |
|---|---|---|---|
| 1 | How does UnitMaster take a credit to a customer's account: an API, a file, or by hand? And does it give us its ledger (balances and postings) to reconcile against? | 2026-10-22 | Open |
| 2 | Is the NDA, sent on 16 October, signed? | 2026-10-22 | Open |
| 3 | Who is the trustee whose fee covers the bank charges (KCB, as we understood)? | 2026-10-22 | Open |
| 4 | Payout approvals: move them to approval chains with us, or keep Equity's three levels and record ours beside them? | 2026-10-22 | Open |
| 5 | Volumes: collections and payouts a day, by channel; the number of customer accounts; how many items in suspense today | 2026-10-22 | Open |
| 6 | Statement access: Equity, KCB and M-Pesa by API, or files (MT940, CAMT.053, CSV) | 2026-10-22 | Open |
| 7 | Which licences it holds (fund manager, scheme administrator, insurer), so we read the right law first | 2026-10-22 | Open |

### Answered

| # | Question | Raised | Status |
|---|---|---|---|

## 5 · Its products

None: it is not a lender, and its funds are products of its own.

## 6 · Documents

Its documents are held in clients/lofty-corban/ until Dibon's Odoo
Documents holds them (rules, Dibon 10). The table is generated (FS-857).

*Generated from the [document register](../governance/document-register.md) by tools/docregister.js: edit the register, never this table.*

No documents registered yet.

## 7 · People and roles

**Who is on it at Dibon** (FS-903): Eric (CTIO) and Jimmy (Partner and
CEO) lead it; Lillian (Dev lead) and Max (CI/CD engineer) met it on 14
October. The delivery lead is to name.

**Its roles:** its lead, who owns the engagement; its reconciliation
officer, who matches collections today; its IT lead; and treasury, which
funds the payout account. Its people are named only in Dibon's Odoo, open
to this project's team.

## 8 · Changelog

Releases of this delivery, newest first, each named by its date
(FS-845): its first major release comes when Lofty Corban agrees the
requirements and the scope.

### 2026.10.22 · minor

**Decided:** reconciliation first, then approval chains (FS-915).

**Changed:** this map begun, from the meeting of 14 October: eight
requirements, seven open answers.

**Exchanged:** Dibon's NDA, sent 16 October (FS-918).

**Status:** to stamp
