---
id: sacco
name: Kapu Sacco
kind: product
version: 0.1.0
owner: Product lead, Kapu
classification: Internal
audience: [sacco]
depends_on: [mandates, identity, rails, messaging, recon-observability, collect, crb, financial-crime, access, core, gateway, mfi, decisioning]
consumed_by: [omni-channel, insights, business-suite]
review_ids: [FS-023, FS-062, FS-066, FS-146, FS-172, FS-173, FS-174, FS-175, FS-176, FS-177, FS-402, FS-407, FS-431, FS-453, FS-499, FS-522, FS-539, FS-554, FS-582]
last_reviewed: 2026-10-08
---

# Kapu Sacco

## 1 · In one paragraph

Kapu Sacco will run a Sacco's member book: membership, share capital,
contributions, deposits, loans backed by guarantors, dividends and member
exit. It will serve **credit-only** Saccos, which hold members'
non-withdrawable deposits and lend against them, and **deposit-taking**
Saccos, which also run withdrawable savings accounts (FS-023). It will
reuse most of Kapu MFI: the loan engine, KYC, reminders and migration.
It will add what makes a Sacco a Sacco: members' own money as the basis
of lending, guarantors, committee approval, check-off from employers,
and an annual dividend. **No specification exists**, so every capability
is Planned, including those that reuse MFI's Designed ones.

## 2 · Who it is for

**Segments:** credit-only Saccos first, then deposit-taking Saccos. Smaller
ones first, as for the portfolio (FS-029). Informal groups and chamas are
Kapu Circle, which is parked (FS-021, FS-177).

**The problem, concretely:** contributions arrive by M-Pesa, by bank and
by employer check-off. Each lands in a different place, and the treasurer
matches them to members by hand. Loan limits depend on each member's
deposits, which are only as current as the last reconciliation. Guarantors
pledge their own deposits on paper and cannot see their exposure. The
dividend is computed in a spreadsheet once a year. *This is the general
shape of the segment, not discovery evidence from a named Sacco* — FS-174.

**People who use it:**

| Role | What they need from it |
|---|---|
| Member | Their shares, deposits, loans and guarantees; eligibility before applying; statements |
| Guarantor | What they have pledged, for whom, and when it is released |
| Treasurer or accountant | Contributions matched to members from every channel; check-off reconciled to the employer's file |
| Credit committee | A queue of applications with the evidence; a recorded decision |
| Board and CEO | Portfolio, liquidity, arrears; the dividend computation for the AGM |
| Employer (check-off) | Who to deduct, how much, and confirmation of what was received |

## 3 · What it does

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| SC-01 | Member onboarding with KYC against the national register (NPDM, formerly IPRS) and membership approval | Planned | FS-023. Reuses mfi MF-02 (Designed) | 1 |
| SC-02 | Share capital accounts, non-withdrawable, transferable as the bylaws allow | Planned | FS-023 | 1 |
| SC-03 | Member deposits, non-withdrawable, as the basis of loan limits | Planned | FS-023 | 1 |
| SC-04 | Contributions by M-Pesa, bank transfer or check-off, matched to members | Planned | FS-023; recon-observability RO-02. M-Pesa to the Sacco's paybill or tills through collect CO-21 (FS-554) | 1 |
| SC-05 | Check-off: the employer's remittance reconciled against each member's expected deduction; differences as exceptions | Planned | FS-174 | 1 |
| SC-06 | Withdrawable savings accounts, for deposit-taking Saccos only | Planned | FS-023 | 2 |
| SC-07 | Loan products with limits set as a multiple of deposits | Planned | FS-023 | 1 |
| SC-08 | Guarantors: deposits pledged per loan, exposure visible to the guarantor, released on repayment, recovered on default | Planned | FS-023 | 1 |
| SC-09 | Credit-committee approval through the mandate engine | Planned | MFI PRD FR-6 platform note; quorum steps are mandates MD-09, phase 1 (FS-146, FS-402) | 1 |
| SC-10 | Repayments split by component | Planned | Reuses mfi MF-08 (Designed) | 1 |
| SC-11 | Annual dividend on shares and interest on deposits: computed by the bylaws' rules, approved at the AGM, then paid or capitalised | Planned | FS-176 | 2 |
| SC-12 | Member exit: notice, loans offset against deposits, refund of the balance | Planned | FS-023 | 2 |
| SC-13 | Member self-service: balances, statements, eligibility, guarantor requests | Planned | Depends on omni-channel | 2 |
| SC-14 | Contribution and repayment reminders | Planned | Reuses mfi MF-13 (Designed) | 1 |
| SC-15 | Migration from the Sacco's current system, with a signed-off reconciliation | Planned | Reuses mfi MF-16 (Designed) | 1 |
| SC-16 | Third-party collection into members' accounts, for deposit-taking Saccos | Planned | Reuses collect CO-05 (Built) | 2 |
| SC-17 | Regulatory returns to SASRA, for deposit-taking Saccos | Planned | FS-175. Assembled by financial-crime FC-13 (FS-431) | later |
| SC-18 | CRB sharing | Planned | Depends on crb | later |
| SC-19 | Chama management: contributions, savings and loans for chamas and investment groups, withdrawals approved by the group's own signatories (quorum steps, mandates MD-09), the money in the group's bank or Sacco account and never ours; sold through banks (docs/bank-channel.md) | Planned | Owner, 2026-10-06 (FS-522). Reuses contributions (SC-04), group lending (mfi MF-17) and collect | 2 |
| SC-20 | Complaints clock for Saccos: acknowledged within three working days, resolved within 21 calendar days, and the member told before a deadline is missed, with SASRA's complaints register and quarterly return | Planned | SASRA Model Complaints Handling Policy (SASRA/MC/1/2025); owner, 2026-10-06 (FS-539). Lenders' clock is mfi MF-28 | 1 |

## 4 · Where it sits

**Depends on:** mandates (committee approval, disbursement maker-checker),
identity (NPDM, formerly IPRS), rails, messaging (reminders,
statements), recon-observability (contributions, check-off), collect
(SC-16), crb (SC-18), financial-crime (SASRA returns, SC-17; FC-13), mfi (group
lending, for chamas, SC-19), decisioning (scores and risk classes for
loan limits and repeat members; FS-582). Also access (login, roles and step-up); core (Kapu Core, where the institution has no core of its own); gateway (collections from customers' wallets).
**Used by:** omni-channel (member self-service, SC-13, and the
field-officer app), insights (its metrics) and business-suite (check-off
schedules to employers, BS-15). Otherwise it is the product a Sacco buys.

**Who holds which record** (docs/architecture/README.md §2):

| Record | System of record | This module |
|---|---|---|
| Shares, deposits, savings, loans, guarantees, balances | **The Sacco's core**, or Fineract in native mode | Integrated: reads and posts through the core. Native: holds, in Fineract |
| The member register and KYC | The Sacco's core, or Fineract in native mode | Same as above — FS-172 |
| The Sacco as our customer: contract, users, tickets | Odoo | Ops provisioning |
| Contribution matches, check-off differences | Recon engine | Feeds |
| Committee decisions | Mandate engine | Feeds |

**What this module never stores:** members' money, or a copy of the member
register outside its system of record.

**Under each ledger mode:**

| | Integrated — the Sacco has a core | Native — no core; Fineract is the ledger |
|---|---|---|
| Where funds are posted | The Sacco's core, through an adapter per core vendor | Fineract, hosted for the Sacco |
| What differs in this module | We add matching, check-off, guarantors and self-service around the core | We are the core: every capability runs on Fineract |
| What the customer must provide | Core API access, or at least extracts and a posting route | Its bylaws, products, fee and dividend rules; its member data for migration |
| Who it suits | Larger Saccos, most deposit-taking ones | Small credit-only Saccos |

**For a deposit-taking Sacco, native mode makes Dibon a core-system
vendor, and that is now the intent (FS-178).** Members' withdrawable
savings would sit on a core we host, under SASRA's requirements for
third-party system vendors (FS-179 to FS-185). Those requirements apply to
the vendor before its first deposit-taking Sacco goes live, not after.
**A third mode is likely here:** deposits stay in the Sacco's core while
loans move to Fineract (FS-066).

## 5 · How it works

```
  CONTRIBUTIONS                       LOANS
  M-Pesa . bank . check-off           member applies
       |                                   |
       v                                   v
  +----------------+            +---------------------+
  | RECON          |            | ELIGIBILITY         |
  | match to       |            | deposits x multiple |
  | members;       |            | guarantors pledge   |
  | check-off vs   |            | (exposure shown)    |
  | expected       |            +---------------------+
  +----------------+                       |
       |                                   v
       v                        +---------------------+
  +--------------------------+  | COMMITTEE           |
  | MEMBER ACCOUNTS          |  | mandate engine      |
  | shares . deposits .      |  +---------------------+
  | savings (DT only)        |             |
  | core or Fineract         |<------------+ disburse (maker-checker)
  +--------------------------+             repay, split by component
       |
       v
  year end: dividend and interest by the bylaws --> AGM approves
            --> paid out, or capitalised into shares or deposits
```

## 6 · Rails and integrations

| Rail / system | Direction | Feed | Status |
|---|---|---|---|
| M-Pesa paybill, Airtel Money, T-Kash | in / out | real-time callback | Planned (rails RL-03 Built; RL-04, RL-05 Designed, v1) |
| Bank transfer | in / out | statement file; API | Planned |
| Employer check-off | in | remittance file and schedule, per employer | Planned (SC-05) |
| Sacco core (integrated) | read / post | API or extracts, per vendor | Planned |
| NPDM, formerly IPRS | read | API | Planned (SC-01) |
| SASRA returns | out | as prescribed | Planned (SC-17) |

## 7 · Regulatory position

- **Custody:** none. Members' money is the Sacco's to hold, in its own
  accounts and its own ledger. **Pattern: pass-through.**
- **Licence relied on:** the Sacco's. Deposit-taking Saccos are licensed
  by SASRA. The regime for credit-only Saccos depends on their size and
  type, and the cooperatives law is under review — FS-175.
- **Native mode for a deposit-taking Sacco** makes us a core-system
  vendor under SASRA's rules for third-party system vendors. This is the
  intent (FS-178). What it requires of us — audits, SASRA's access, a bank
  guarantee per Sacco, incident reporting — is FS-179 to FS-185.
- **Regulators:** SASRA; the Commissioner for Cooperative Development;
  ODPC for members' data.
- **Data:** members' records, balances and guarantees are Confidential.
  National ID numbers are Restricted. Check-off files carry employees'
  payroll data, so the data-sharing terms with each employer need
  agreeing.

## 8 · Controls

- **Members' own money sets the limits.** Loan eligibility is computed
  from deposits as reconciled, not as last typed.
- **Guarantors are told.** A guarantor is a party exposed to someone
  else's loan, so they hear when their pledge changes state
  (GateKeepr STANDARDS.md §6.3: notify along the obligation).
- **Committee decisions are attributed** to each member who decided, at
  the moment they decided (mandates MD-10).
- **The dividend is computed, not typed.** It is a reproducible
  calculation from the bylaws' rules and the year's balances, kept with
  its inputs for the AGM and the auditor.
- **Check-off differences stay open** until the employer or the member
  explains them. They are never written off to make the month balance.

## 9 · Deployment

Native: hosted by us, one tenant per Sacco, on Liquid's Azure Stack
(FS-032). Integrated: beside the Sacco's core, on its premises or on
Liquid's Azure Stack.

## 10 · What it does not do

- Hold members' money.
- Run chamas or informal groups. That is Kapu Circle, parked (FS-021).
- Replace a deposit-taking Sacco's core without a separate decision and
  agreement (docs/architecture/README.md §4: integrated first, always).
- Decide credit. The committee decides.

## 11 · Open questions

FS-066, FS-173, FS-174, FS-175, FS-176, FS-177. FS-146 is decided: quorum
steps (mandates MD-09) are phase 1 (FS-402).

## 12 · Sources

- REVIEW.md FS-021, FS-023, FS-029, FS-062, FS-066.
- docs/modules/mfi.md (reused capabilities), docs/modules/collect.md,
  docs/modules/mandates.md.
- Kapu Pay MFI PRD section, Draft v0.2, Jun 2026 — FR-6 platform note
  (Sacco loan committees as a consumer).
- docs/architecture/README.md §2, §4.
