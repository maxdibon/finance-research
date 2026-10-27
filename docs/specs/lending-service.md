---
id: lending-service
name: The Kapu lending service — build specification
kind: spec
type: build
status: draft
law: LR-03
released: unreleased
release: R1
implements: [mfi, sacco]
depends_on: [kapu-core-fineract, approval-engine, lender-rules, back-office, deposits-service]
used_by: [staff-workspace, kapu-console]
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-629, FS-965, FS-970, FS-983, FS-984, FS-985, FS-995, FS-996, FS-1000, FS-1002]
last_reviewed: 2026-10-27
---

# The Kapu lending service — build specification

One thin service lends for every kind of institution we serve: Kapu MFI
for lenders such as Roan Capital, Kapu Sacco for Saccos (FS-983). It does
what neither Fineract nor Odoo can, and what must not live in Odoo: the
regulators' rules, and the orchestration of a loan across the core, the
approval engine, the rails, messaging and the back office. Everything
Fineract does natively is configured, not rebuilt; everything Odoo does
well is used through the back-office gateway. "Kapu MFI" and "Kapu Sacco"
stay the products we sell, each a configuration of this service with its
own rules and screens. Nothing is built: every behaviour here is
**designed**.

## 1 · Purpose and scope

What it answers: who runs a loan from application to closure, and keeps
every system that touches it in step?

| Id | Capability | In R1 |
|---|---|---|
| MF-01 | Digital loan application with a timestamped, attributed lifecycle | Yes |
| MF-07 | Approval chains by product and amount tier, through the approval engine | Yes |
| MF-11 | Disbursement only from an approved application, with maker-checker on the payout | Yes |
| MF-41 | Partners onboarded and managed: the record, its relationships and their limits, the lifecycle, signed events back | No: phase 2, with MF-40 (§5) |
| MF-42 | Partner data feeds: a contract per feed, a consent gate, checks and quarantine, only metrics forward | No: phase 2 (§5) |

These three stand for the whole of Kapu MFI's R1 list (delivery plan, "R1
in detail"); §3 says, capability by capability, which system does each.

**Out of R1:** Kapu Sacco (R4); group lending (MF-17); the split ledger
mode (FS-066).

**Where it sits** (the new design, FS-984; deposits beside it, FS-985):

```
  PEOPLE      Institution staff        Borrowers, guarantors, members         Dibon engineers
                     |                              |                                 |
            +--------v------------------------------v---------------------------------v----------+
  SIGN-IN   | ACCESS                                                                             |
            | signs in, steps up: staff by password and key; customers by a code to              |
            | their phone; Dibon's engineers by hardware keys, never into a product              |
            | [keycloak]                                                                         |
            +------------------------------------------------------------------------------------+
                    |                  |                   |                          |
            +-------v--------+ +-------v--------+ +--------v--------+        +--------v--------+
  SCREENS   | STAFF WORKSPACE| | KAPU CONSOLE   | | CUSTOMER PAGES  |        | OBSERVABILITY   |
            | daily lending, | | approvals,     | | consents, sign, |        | dashboards,     |
            | tasks, products| | fallback views | | statements      |        | on-call         |
            | [odoo]         | | [kapu_service] | | [kapu_service]  |        | [grafana]       |
            +-------+--------+ +-------+--------+ +--------+--------+        +--------+--------+
                    | as the person    |                   | as the person     never a product
                    +------------------+-------------------+
                                       v
            +--------------------------v--------------------------------+   +----------------------+
  CORE      | LENDING SERVICE                                           |   | DEPOSITS SERVICE     |
  SERVICES  | lends: loans, collateral, guarantors, product versions;   |<--| keeps accounts;      |
            | LENDER RULES and SACCO RULES beside it                    |   | regulators' rules    |
            | [kapu_service]                                            |   | [kapu_service]       |
            +-----------------------------------------------------------+   +------------+---------+
                     | decisions    | payouts   | messages         |  |                  |
                     |              |           |                  |  +--- postings -----+
                     v              v           v                  v signatures          v
            +-----------------+ +-------+ +-----------+ +---------------------+ +------------------+
  SERVICES  | APPROVAL ENGINE | | RAILS | | MESSAGING | | BACK-OFFICE GATEWAY | | CORE ADAPTER     |
            | decides         | | pays  | | sends     | | translates, to ODOO | | posts, to KAPU   |
            | [kapu_service]  | |       | |           | | [kapu_service]      | | CORE or theirs   |
            +-----------------+ +-------+ +-----------+ +---------------------+ +------------------+
  EVENTS    ===== EVENT BUS [kafka]: every change, signed, in order ==============================
                 |                          |                             |
            +----v-------------+  +---------v----------+  +---------------v--+
  CHECKS    | RECONCILIATION   |  | OBSERVABILITY      |  | VAULT            |
            | three ledgers    |  | metrics, alerts    |  | signed records   |
            +------------------+  +--------------------+  +------------------+
```

**Related:** implements [mfi](../modules/mfi.md) and
[sacco](../modules/sacco.md); depends on
[kapu-core-fineract](kapu-core-fineract.md),
[approval-engine](approval-engine.md), [lender-rules](lender-rules.md),
[back-office](back-office.md) and [deposits-service](deposits-service.md);
used by [staff-workspace](staff-workspace.md) and
[kapu-console](kapu-console.md); journeys
[JN-04](../journeys/loan-to-disbursement.md),
[JN-05](../journeys/guarantor.md) and
[JN-06](../journeys/restructuring.md).

## 2 · Concepts

- **The core:** the funds ledger, Kapu Core (Fineract) natively, or the
  institution's own core in integrated mode (architecture §4).
- **The core adapter:** one interface to the core, one implementation per
  core, chosen by configuration; the only way this service and the
  deposits service post to a ledger.
- **A rule set:** one regulator's rules, beside the service: lender rules
  (CBK's lender regulations, lender-rules) for lenders; Sacco rules
  (SASRA, the Sacco Societies Act) for Saccos, to be specified.
- **A product version:** a product's terms as data, the one authority for
  them (lender-rules §2.4).

## 3 · Who does what, capability by capability

| Done by | Kapu MFI's capabilities | How |
|---|---|---|
| **Fineract, configured** | MF-08 (repayment split and order), MF-09 (reschedule, re-age, top-up), MF-15 (reports), MF-16 (migration), MF-17 (groups), MF-22 (repayment order), MF-25 (non-performing settings), MF-35 (loan officers and reassignment) | Settings applied by this service through the core adapter, from the product version; never by hand (kapu-core-fineract §4) |
| **Odoo, through the gateway** | MF-01 in part (a lead before an application), MF-28 (the complaints desk and its clock), MF-34 and MF-37 (agreements and guarantees signed), document checklists | The back office's jobs (back-office §4); the staff workspace for screens |
| **This service** | MF-01 (applications), MF-02 (KYC, with identity), MF-03, MF-04, MF-30 (collateral and its evidence), MF-06 (limits and overrides), MF-07 (chains, with the approval engine), MF-10 to MF-12 and MF-20 (repayments and payouts, with rails), MF-14 (dashboards, with insights), MF-36 (pay-day limits), MF-38 (borrower access, with messaging) | Its own records and orchestration |
| **The rule set beside it** | MF-21 (the arrears cap), MF-23 (APR and key facts), MF-24 (CBK's approval of prices), MF-26 (conduct), MF-27 (bureau), MF-29 (automated decisions), MF-39 (the collection ladder) | lender-rules |

For Saccos the same split holds: Fineract does shares, dividends,
savings and guarantor holds; the deposits service owns members' deposits
and shares (FS-985); this service lends against them, under Sacco rules.

## 4 · Rules

1. **Thin by design.** What Fineract does is configured; what Odoo does is
   used through the gateway; this service builds only what neither does.
2. **The only writer to the core,** through the core adapter; no screen,
   service or person writes to the core directly (FS-626).
3. **No rule in Odoo** (back-office rule 1): every rule that decides
   money, eligibility or conduct is here or in its rule set.
4. **Decisions are the approval engine's;** this service acts only on the
   engine's yes, and the payout carries the approved content's hash
   (RL-01).
5. **As the person.** Screens call it with the person's token; every act
   is recorded against them (staff-workspace rule 4).
6. **Every change an event,** from an outbox, in the bus's catalogue
   (event-bus-kafka §5).
7. **One rule set per regulator,** chosen by the institution's licence;
   a product's version names the rule set it is checked against.
8. **Deposits are the deposits service's;** this service reads a member's
   deposits and shares there, never from the core directly.

## 5 · Partners

FS-995, FS-996. The third parties a product works with: distributors,
dealers, schools, hospitals, insurers, employers, produce buyers,
merchants, mobile operators (lender-rules §2.4, Partner). Each
institution keeps its own; Dibon helps, and never approves. Learned from
what we built for a bank's retailer finance and from a microfinance
bank's own agreements (FS-997, FS-999, FS-1000, FS-1002).

**One partner, in two places,** joined by our reference:

| Part | Where | Why |
|---|---|---|
| The company: registration, directors and owners, contacts, documents, signed agreements | Odoo, through the back-office gateway | Odoo holds the parties no core holds (architecture §2) |
| What touches money: its verified settlement accounts, its exposure cap, its first-loss share, what it pays towards the price, its status | This service | Each change a request to the approval engine, decided by a second person, a new payee adding an approver (MD-19) |

**Relationships are records** (FS-1000). A borrower's tie to a partner (a
retailer to its distributor) is a record of its own, with its own limit,
balance, status and the partner's codes for it (a sales route, a
territory). A borrower may have several. **Limits nest:** a draw is
checked against the relationship's limit, the product's, the borrower's
overall limit and whatever the core holds (FS-926); where the core holds
only one limit per borrower, as a bank's did, the others live here.

**The lifecycle:**

1. **Proposed** by the institution's partner manager, in Odoo.
2. **Due diligence** by compliance: the business registry (ID-07), the
   tax PIN, the directors and beneficial owners, sanctions (FC-05); the
   documents by kind of partner, as a bank asks of a company (its
   incorporation, its directors and shareholders, a board resolution,
   signatories, tax compliance, a year's accounts, a beneficial ownership
   form; FS-999).
3. **Agreements signed** in Odoo Sign: the partner agreement (its data
   accurate, returned goods refunded to the loan, its first loss, fraud)
   and a data-sharing agreement (what, why, for how long).
4. **Settlement accounts verified:** the bank account's or paybill's name
   checked before it may be paid (RL-01).
5. **A feed contract and a test feed** (below), passed.
6. **Approved** by two people; then **live**.
7. **Monitored:** each partner's feed freshness, exposure, its borrowers'
   arrears, returns and disputes, and fraud signals, on a dashboard.
8. **Frozen or exited:** new draws stop, its settlement accounts are
   frozen, a relationship or the whole partner; open loans run off.

**Its data comes in through one intake** (MF-42), built on recon's
(RO-01): a file through the portal or by SFTP first, an API from its ERP
later (Odoo's through sme-recon's wrapper):

- **A contract per feed:** its fields, format, frequency and version.
- **A consent gate:** no person's data is used without their recorded
  consent (LQ-22, privacy PR-21).
- **Checks and quarantine:** completeness, duplicates, freshness, and
  odd jumps (purchases inflated before a limit renews) held for a person.
- **Only metrics go forward** to decisioning (DE-01), never the raw file;
  a mobile operator's scores are taken as scores, never rebuilt into
  what the operator withholds (FS-1002).
- **Cross-checked** against what the institution actually paid the
  partner, by recon.

**It hears back, signed** (FS-997): each draw, payment, freeze and
change is sent to the partner's own system as an event, signed, over an
encrypted connection, retried until delivered, and logged; never a plain
call to a fixed address.

**Its people take part:** a distributor's or a school's staff use a
partner portal in Odoo (portal users need no licence; BS-03) to upload
data, confirm deliveries, see what they were paid and handle returns,
each act that touches money a command to this service; a sales
representative may help a borrower in the field (a call back, the route's
borrowers) and nothing more. Larger partners use the API instead.

**Bulk limits:** the institution's risk team refreshes limits in bulk, by
an upload and a download, approved by two people.

**Mobile operators are integrations, not portal users:** API credentials
in OpenBao, a test and a live environment, rate limits and monitoring,
under the institution's agreement with the operator (FS-993), which must
also allow Dibon to host and process for it (FS-1002). Recovery from a
wallet is the operator's to grant and withdraw; a payment prompt the
customer approves is the fallback.

## 6 · Interfaces

- **Reads and commands** for the staff workspace and the Kapu Console:
  clients, applications, loans, collateral, guarantors, payouts,
  repayments, arrears, tasks; each command accepted, refused with a
  reason, or sent to the approval engine.
- **Products:** lender rules' endpoints, including the
  draft, validate, preview, adopt and submit calls the Products screen
  uses (FS-978, FS-981; lender-rules §3).
- **Events:** the `kapu.mfi` domain (event-bus-kafka §5).

## 7 · Security and audit

Staff realm only; service accounts for the engine and rails; every act
against the person; no Dibon identity holds a product role (AC-09).

## 8 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| Applications, collateral records and their evidence, overrides | Confidential | Seven years after the loan ends | Borrowers', guarantors' |
| The outbox | Confidential | Until published, then 30 days | As the change |

The loan itself, its schedule and balances are the core's; this service
keeps no copy of them.

## 9 · Quality and metrics

Staff-facing tier; a command answered within a second at the 95th
percentile; alerts on refused commands above 2% in fifteen minutes and
on any write the core received that this service did not make (F15).

## 10 · Threats

| Threat | For example | The answer |
|---|---|---|
| Spoofing | A screen acting as another person | The person's own token (rule 5) |
| Tampering | A loan's terms changed in the core | Only writer (rule 2); the nightly check finds any other write |
| Repudiation | An approval disputed | The engine's record, with step-up |
| Information disclosure | Loans copied into Odoo | Never stored there (rule 3; staff-workspace rule 1) |
| Denial of service | Odoo down | Nothing on the money path passes through Odoo |
| Elevation of privilege | A Dibon engineer approving | No product role for Dibon (AC-09) |

## 11 · Acceptance tests

| # | Given | When | Then | Id, source |
|---|---|---|---|---|
| A1 | An approved application | The payout is prepared | The rails send only the approved amount to the approved account, by its hash | MF-11, RL-01 |
| A2 | A product version activated | The core is checked | Its settings match the version, applied through the adapter | MF-07, rule 2 |
| A3 | A write made directly in Fineract | The nightly check runs | It is found and alerted | rule 2 |
| A4 | An institution in integrated mode | A loan is disbursed | It is posted to the institution's core through its adapter | rule 2 |
| A5 | A retailer with two distributors | It draws from one | The draw is checked against that relationship's limit, the product's, its overall limit and the core's; the other relationship is untouched | MF-41, §5 |
| A6 | A partner's feed with a retailer who has not consented | The feed arrives | That retailer's rows are held, never used, and the partner told | MF-42, §5 |
| A7 | A partner's settlement account changed | The change is asked for | It waits for a second person and an added approver; until then payouts go to the old account or stop | MF-41, MD-19 |
| A8 | A draw paid to a partner | The partner's system is told | The event is signed, retried until delivered, and logged | MF-41, §5 |

## 12 · Open questions

**For the owner:**

1. Sacco rules: SASRA's regulations read and specified before Kapu Sacco
   (R4).
2. The split mode (FS-066), owed before its first customer.

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
