---
id: mandates
name: Mandates — signing and debit
kind: shared-service
version: 0.1.0
owner: Solution architect
classification: Internal
audience: [bank, sacco, mfi, psp, sme, fintech]
depends_on: [access, messaging, rails]
consumed_by: [mfi, sacco, collect, gateway, sme-recon, escrow, recon-observability]
review_ids: [FS-042, FS-046, FS-097, FS-122, FS-132, FS-138, FS-142, FS-143, FS-144, FS-145, FS-146]
last_reviewed: 2026-10-01
---

# Mandates — signing and debit

## 1 · In one paragraph

Two kinds of mandate, one service (FS-042). **A signing mandate** says who
must approve an act before it happens: a loan, a disbursement, a payment,
an escrow release, a reversal. It is an ordered chain of roles, chosen by
product, amount and flags, with no self-approval. Every decision is
attributed to the person at the moment they make it. **A debit mandate**
is a payer's recorded consent to recurring pulls from their own account:
how much, how often, until when, on which rail, cancellable by the payer
at any time. The signing engine is specified in the MFI PRD as a platform
service (FR-6) and lives here so that every product uses one engine
(FS-138). The debit side has no specification, and its rails are
unconfirmed (FS-046).

## 2 · Who it is for

**Segments:** every product that moves money or binds somebody. MFIs and
Saccos for loan approvals and committee chains. Banks and partners for
maker-checker. SMEs for payment approvals. Escrow parties for releases.
Lenders, Saccos and merchants for recurring collection.

**The problem, concretely:** approvals happen in conversation, with no
record of who approved what and when (MFI PRD §2, problem 6). In a team of
three, one person can hold every role. Recurring collections rely on the
payer remembering, or on a standing instruction nobody can see or audit.

**People who use it:**

| Role | What they need from it |
|---|---|
| Institution admin | Define chains per product and amount tier; see every change to them |
| Approver | A queue of what waits on them, with the evidence; a nudge when it is overdue |
| Auditor | Who approved what, when, under which version of the mandate |
| Payer (debit mandate) | What they agreed to, a notice before each pull, and cancellation at any time |
| Collector (debit mandate) | Scheduled pulls under a valid consent; failures as exceptions, not silent retries |

## 3 · What it does

**Signing:** Designed, from MFI PRD FR-6. **Debit:** Planned, from the
owner's request (FS-042).

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| MD-01 | Chains of approval steps by role, per product and per amount tier, from one approver to any length; tiers checked as contiguous and non-overlapping on save | Designed | MFI PRD FR-6.1, FR-6.2 | 1 |
| MD-02 | Mandate configuration effective-dated and audited, before and after | Designed | MFI PRD FR-6.3 | 1 |
| MD-03 | The applicable chain resolved at submission and frozen onto the request; later changes never alter it | Designed | MFI PRD FR-6.4 | 1 |
| MD-04 | Steps named by role and resolved to people at runtime, so staff changes do not strand requests | Designed | MFI PRD FR-6.5 | 1 |
| MD-05 | Decisions: approve, decline, or return for revision, each with identity, comment and time | Designed | MFI PRD FR-6.6 | 1 |
| MD-06 | No self-approval: one person cannot complete two consecutive steps, even holding both roles | Designed | MFI PRD FR-6.7 | 1 |
| MD-07 | Flags route to an authority: a flagged request always ends with the named role, whatever tier it fell in | Designed | MFI PRD FR-6.8 | 1 |
| MD-08 | Time-in-step SLAs, reminders and escalation | Designed | MFI PRD FR-6.9 | 1 |
| MD-09 | Quorum steps (N of M) | Planned | MFI PRD FR-6.10: designed as an additive change; launch is sequential only | 2 |
| MD-10 | Each decision re-authenticated at the moment it is made (PIN or one-time code) | Planned | docs/architecture.md §7; FS-132 | 1 |
| MD-11 | Bank-side mirror: the signing mandate registered on the bank account, and our instruction checked against it | Planned | FS-122. Depends on the bank's mandate API (partners.md C10) | 2 |
| MD-12 | Consumers beyond MFI: Sacco committees, Collect and Gateway maker-checker, SME Recon payments, Escrow releases, recon reversals | Planned | MFI PRD FR-6 platform note; FS-097, FS-107 | 1–2 |
| MD-13 | Debit mandate record: payer, payee, amount (fixed or capped), frequency, start and end, rail; consent captured and signed | Planned | FS-042 | 2 |
| MD-14 | Debit mandate registered with the rail: bank direct debit, M-Pesa standing orders, card tokens | Planned | FS-046 — rails unconfirmed | 2 |
| MD-15 | Scheduled pulls, each preceded by a notice to the payer | Planned | FS-042 | 2 |
| MD-16 | Cancellation by the payer at any time; any change re-consented | Planned | FS-042 | 2 |
| MD-17 | Failed pulls: a fixed retry limit, then an exception. Never a retry outside the mandate's terms | Planned | FS-042; recon-observability §8 | 2 |

## 4 · Where it sits

**Depends on:** access (who the approver is, and step-up), messaging (reminders,
pre-debit notices), rails (debit registration and pulls).
**Used by:** mfi, sacco, collect, gateway, sme-recon, escrow,
recon-observability (reversals and reposts).

**Who holds which record** (docs/architecture.md §2):

| Record | System of record | This module |
|---|---|---|
| Mandate configuration and its history | **Mandate engine** | Holds. Effective-dated, audited |
| Requests' frozen chains, decisions, re-authentication evidence | **Mandate engine** | Holds. Append-only |
| People and their roles | Odoo, or the product's own user directory — FS-142 | References by id; resolves at runtime |
| Debit consents, signed | Odoo (the signed document) and the mandate engine (the terms) | Holds the terms; references the document |
| The act being approved (the loan, the payment) | The consuming product | Never holds. Answers yes or no |
| A mandate registered at a bank or rail | That bank or rail | Registers; never changes it alone |

**What this module never stores:** a credential that would let it act
without the approvers, or the money it approves moving.

**Under each ledger mode:** the signing engine does not touch the ledger,
so the two modes do not change it. Debit pulls land wherever the
consuming product posts: the institution's core when integrated, Fineract
when native.

## 5 · How it works

**Signing:**

```
  request submitted (product, amount, flags)
          |
          v
  +-------------------------+
  | RESOLVE mandate         |  tier by product + amount; flags add
  | FREEZE chain on request |  the authority as the last step
  +-------------------------+
          |
          v
  step 1 --> step 2 --> ... --> authority (if flagged)
    |          |
    |  each decision: re-authenticated, attributed, timed
    |  no person completes two consecutive steps
    |  overdue: remind, then escalate
    |
    +-- decline: chain ends
    +-- return: back to originator; chain resets from that step
          |
          v
  approved --> product acts --> where the bank mirrors the mandate,
                                the bank checks the instruction too
```

**Debit:**

```
  consent (terms + signature) --> registered with the rail
          |
          v
  schedule --> notice to payer --> pull --> success: posted
                                       \--> failure: retry within the
                                            limit, then an exception
  payer cancels --> no further pulls; the rail registration is withdrawn
```

## 6 · Rails and integrations

| Rail / system | Direction | Feed | Status |
|---|---|---|---|
| Partner banks — signing-mandate APIs | out | API | Planned (MD-11) |
| Bank direct debit (clearing house) | out | file or API | Planned — FS-046 |
| M-Pesa standing orders | out | API, if offered to third parties | Planned — asked in the Safaricom email |
| Card tokens (recurring) | out | through the acquirer | Planned — partners.md SD-03 |
| Odoo — roles, signed consents | in | API | Planned — FS-142 |

## 7 · Regulatory position

- **Custody:** none. The engine decides whether an act may happen; the
  product and the rail execute it.
- **Debit pulls are initiation** (docs/architecture.md §3): we instruct a
  pull from the payer's account under their consent — FS-037.
- **Consent:** each pull needs clear, recorded consent that the payer can
  withdraw. The rules for direct debits, and for standing orders on mobile
  money, are the rail's and the regulator's — FS-143.
- **Data:** decisions and approvers are Internal to the customer. Payers'
  account details are Confidential. Re-authentication secrets are
  Restricted.
- **Open legal checks:** FS-037, FS-143.

## 8 · Controls

- **Attribution at the act** (MD-10). A session login is not an approval.
- **Frozen chains** (MD-03). Changing a mandate never changes a request
  already in flight.
- **No self-approval** (MD-06), including in teams of two or three.
- **Approval routes never gate a safety alert.** An approval step is a
  wait; a message that must not wait does not go through one (carried
  over from GateKeepr STANDARDS.md §6.2).
- **Debit pulls stay inside the consent.** Amount, frequency and end date
  are hard limits. A failed pull is retried only within the stated limit.

## 9 · Deployment

Part of the shared platform, inside each deployment (docs/architecture.md
§6). On-prem or on Liquid's Azure Stack (FS-032).

## 10 · What it does not do

- Execute the act. It answers whether the act may happen.
- Decide credit. Vetting stays human (MFI PRD §6).
- Hold funds, or pull money beyond what the payer consented to.
- Replace the bank's own mandate. Where the bank holds one, both apply.

## 11 · Open questions

FS-037, FS-046, FS-122, FS-132, FS-142, FS-143, FS-144, FS-145, FS-146.

## 12 · Sources

- Kapu Pay MFI PRD section, Draft v0.2, Jun 2026 — FR-6, and §2
  problem 6.
- REVIEW.md FS-042, FS-097, FS-107, FS-122, FS-132, FS-138.
- docs/architecture.md §3, §7.
- GateKeepr STANDARDS.md §6.2 (attribution at the act; approvals never
  gate a safety alert) — principles carried over, not references.
