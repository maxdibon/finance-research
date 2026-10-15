---
id: escrow
name: Kapu Escrow
kind: product
status: living
released: 2026.10.15
owner: Product lead, Kapu
classification: Internal
audience: [bank, sme, fintech]
depends_on: [collect, mandates, recon-observability, messaging, rails, identity, access]
consumed_by: [insights, mfi]
review_ids: [FS-042, FS-104, FS-107, FS-108, FS-114, FS-115, FS-116, FS-117, FS-328, FS-407, FS-408, FS-522]
last_reviewed: 2026-10-08
---

# Kapu Escrow

## 1 · In one paragraph

Kapu Escrow will hold a buyer's money until the conditions the buyer and
seller agreed are met, then release it to the seller. **A partner bank
will hold the money, not us.** Each escrow is designed as its own
sub-account at the bank. We will run everything around it: the agreement,
both parties' signatures, the milestones and their evidence, the approvals
that release funds, and the reconciliation that ties the account to the
agreement. The release rule is designed to be enforced twice: by our
mandate engine, and by the signing mandate registered on the bank account
itself. If the bank supports that, Dibon could not move escrowed funds on
its own, by design rather than by policy (FS-122).

## 2 · Who it is for

**Segments:** property (deposits, off-plan purchases), vehicle sales,
construction paid by milestone, B2B trade between parties who have not
dealt before, and marketplaces. Cross-border trade comes later, with the
regional rollout (FS-105). Partner banks offer it to their customers;
SMEs and fintechs use it directly.

**The problem, concretely:** today, a buyer either pays first and trusts
the seller, or uses a lawyer's or agent's client account. That is slow,
paper-heavy and opaque to the buyer. A tenant who has paid in good faith
cannot see whether the deposit is still where it should be. This is the
same gap as the GateKeepr brief's second-leg problem.

**People who use it:**

| Role | What they need from it |
|---|---|
| Buyer | Proof that the money is held at a bank in their escrow; the state of each milestone; a refund if the deal falls through |
| Seller | Proof that the money is there before they deliver; release when the conditions are met |
| Arbiter (agreed in the contract) | The evidence for a disputed milestone, and the authority to decide it |
| Partner bank | Sub-accounts opened and run under its own rules; release instructions it can check against the account's mandate |
| Our operations team | Escrows by state, ageing, and any account that does not tie to its agreement |

## 3 · What it does

**There is no specification yet.** The only source is the owner's request
(FS-104) and the placement agreed from it (FS-107). Every row is
**Planned**.

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| ES-01 | Escrow agreement: parties, amount, currency, conditions and milestones, arbiter, signed by both parties in Odoo Sign | Planned | FS-104, FS-107 | 1 |
| ES-02 | One sub-account per escrow at the partner bank, opened through Collect's sub-account design | Planned | FS-107. Collect CO-03 is Built (FS-390) | 1 |
| ES-03 | Funding by the buyer on any rail, into the escrow's own sub-account | Planned | FS-107; collect CO-05 | 1 |
| ES-04 | Milestones tracked with evidence uploads, attributed to whoever uploaded them | Planned | FS-107 | 1 |
| ES-05 | Release on the agreed approvals through the mandate engine, mirrored in the signing mandate on the bank account | Planned | FS-042 (signing mandates), FS-107 | 1 |
| ES-06 | Partial release per milestone | Planned | FS-107 | 1 |
| ES-07 | Refund to the buyer on cancellation, under the agreement's terms | Planned | FS-107 | 1 |
| ES-08 | Dispute: funds frozen, decided by the named arbiter. Never resolved by the system | Planned | FS-107 | 1 |
| ES-09 | Both parties told when the escrow's state changes; detail fetched by whoever is entitled to it | Planned | Notification rule carried over from GateKeepr STANDARDS.md §6.3 | 1 |
| ES-10 | Daily tie-out: the sub-account balance against the agreement's state | Planned | recon-observability RO-02 | 1 |
| ES-11 | Cross-border escrow, in two currencies | Planned | FS-105 | later |

## 4 · Where it sits

**Depends on:** collect (sub-accounts, deposits), mandates (release
approvals), recon-observability (ES-10), messaging (ES-09), rails
(funding and release), identity (KYC on both parties). Also access (login, roles and step-up).
**Used by:** insights, which reads its states for reporting, and mfi,
which pays suppliers on delivery for LPO financing (MF-32); GateKeepr's deposit and service-charge flows are a
possible consumer.

**Who holds which record** (docs/architecture/README.md §2):

| Record | System of record | This module |
|---|---|---|
| The escrowed funds | **The partner bank's core**, in the escrow's sub-account | **Never holds.** Instructs release; the bank executes |
| The signing mandate on the account | The partner bank | Registers it when the escrow opens; never changes it alone |
| Parties, the agreement, signatures, evidence documents | Odoo | References by id |
| Milestone states and approvals | Mandate engine | Feeds |
| The daily tie-out and any break | Recon engine | Feeds |

**What this module never stores:** a balance of its own, or any credential
that would let Dibon release funds without the agreed approvers.

**Under each ledger mode:**

| | Integrated — the partner bank has a core | Native — no core |
|---|---|---|
| Where funds are posted | An escrow sub-account in the bank's core | **Not offered.** Escrow needs an institution that may hold third parties' funds in trust — FS-114 |
| What differs in this module | Sub-accounts and mandates through the bank's API | — |
| What the customer must provide | Sub-account and mandate APIs, a trust or escrow product, and its legal sign-off | — |
| Who it suits | Banks offering escrow to their customers | — |

## 5 · How it works

```
  Buyer      Odoo / Escrow       Partner bank        Mandates      Seller
    |              |                   |                 |            |
    | agree + sign |                   |                 |            |
    |------------->|<------------------------------------------------|
    |              | open sub-account  |                 |            |
    |              | + signing mandate |                 |            |
    |              |------------------>|                 |            |
    | pay in       |                   |                 |            |
    |--------------------------------->| funds held      |            |
    |              |                   |                 |            |
    |              |  milestone evidence uploaded        |            |
    |              |<-------------------------------------------------|
    |              | approvals         |                 |            |
    |              |-------------------------------------->|          |
    | approve      |                   |                 |            |
    |----------------------------------------------------->|          |
    |              |  release instruction, checked       |            |
    |              |  against the account's own mandate  |            |
    |              |------------------>|                 |            |
    |              |                   | pay seller      |            |
    |              |                   |--------------------------->  |
    |              | recon ties the account to the agreement (daily)  |
```

## 6 · Rails and integrations

| Rail / system | Direction | Feed | Status |
|---|---|---|---|
| Partner bank: sub-accounts, mandates, statements | in / out | API; statement file for the daily tie-out | Planned |
| M-Pesa, Airtel Money, T-Kash | in (funding) | through collect and gateway | Planned; the v1 rails (FS-407) |
| PesaLink, cards | in (funding) | through collect and gateway | Planned; coming soon (FS-408) |
| Bank transfer, PesaLink | out (release, refund) | through the partner bank | Planned |
| Odoo and Odoo Sign | in / out | API | Planned |

## 7 · Regulatory position

- **Custody:** the partner bank's. **Pattern: initiation.** We instruct a
  release from an account we do not control, and only with the agreed
  approvals (docs/architecture/README.md §3). If Dibon held escrowed funds it
  would be aggregation, which needs a licence. A PSP licence might not
  cover escrow even then.
- **Licence relied on:** the partner bank's. Who may act as escrow agent,
  and whether the bank will, is checked per country — FS-108.
- **Interest:** who earns interest on escrowed funds, and how unclaimed
  funds are handled — FS-115.
- **AML:** escrow is a known laundering route. Both parties will be
  identified before an escrow opens, and the bank's own screening applies
  — FS-116.
- **Signatures:** whether Odoo Sign is legally sufficient for an escrow
  agreement, per document type — FS-049.
- **Data:** parties, amounts and agreements are Confidential.

## 8 · Controls

- **Nobody releases alone, including Dibon.** Release will need the
  approvers the agreement names. The bank account's own signing mandate is
  designed to encode the same rule, so that a defect in our software could
  not release funds the bank would refuse (FS-122).
- **Attribution at the act:** signing, approving a milestone, releasing
  and refunding will each be authenticated when they happen.
- **Disputes will freeze funds.** Only the arbiter, or both parties
  together, will be able to unfreeze them. Nothing will auto-resolve on a
  deadline — FS-117.
- **In a dispute the arbiter decides alone, and the bank still checks.**
  The arbiter will be able to direct a release without either party, but
  only within the agreement: to the named parties' accounts, up to the
  disputed amount. The account's signing mandate is designed to name the
  arbiter as one valid release path, so the bank checks the instruction as
  it checks any other (FS-328). The arbiter is never Dibon.
- **The tie-out never adjusts.** A balance that differs from the
  agreement is a recon exception, not a correction.

## 9 · Deployment

Alongside collect, in the partner bank's environment or on Liquid's Azure
Stack (FS-032). Kenya first (FS-105).

## 10 · What it does not do

- Hold funds, or let Dibon release them.
- Decide disputes. The arbiter does.
- Give legal advice on the agreement. A template agreement is the partner
  bank's and its lawyers' to approve.
- Run without a licensed institution (§4, native mode).

## 11 · Open questions

FS-108, FS-114, FS-115.

## 12 · Sources

- REVIEW.md FS-042, FS-104, FS-107.
- docs/architecture/README.md §2, §3.
- docs/modules/collect.md CO-03, CO-05 (sub-accounts, deposits).
- GateKeepr brief (odoo-reconciliation.md §2): escrow sits on the
  regulated side of the custody line.
