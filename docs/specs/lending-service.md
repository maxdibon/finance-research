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
depends_on: [kapu-core-fineract, approval-engine, lender-rules, back-office, deposits-service, product-versions, vault, transactions, rails]
used_by: [staff-workspace, kapu-console, lending-partners]
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-629, FS-965, FS-970, FS-983, FS-984, FS-985, FS-995, FS-996, FS-1000, FS-1002, FS-1004, FS-1005, FS-1057, FS-1058, FS-1054, FS-581, FS-619, FS-1069, FS-1070, FS-1071, FS-1073, FS-1140, FS-1148, FS-1154, FS-1155]
last_reviewed: 2026-11-09
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

These three stand for the whole of Kapu MFI's R1 list (delivery plan, "R1
in detail"); §3 says, capability by capability, which system does each.

**Out of R1:** Kapu Sacco (R4); group lending (MF-17); the split ledger
mode (FS-066).

**Where it sits** (FS-984; deposits beside it, FS-985): its neighbours;
the whole instance, in layers, is architecture/instance.md.

```
  +--------------------+  +--------------------+  +--------------------+  +--------------------+
  | STAFF WORKSPACE    |  | KAPU CONSOLE       |  | CUSTOMER PAGES     |  | DEPOSITS SERVICE   |
  | shows, asks        |  | decides, looks up  |  | consents, signs    |  | keeps accounts     |
  | [odoo]             |  | [kapu_service]     |  | [kapu_service]     |  | [kapu_service]     |
  +--------------------+  +--------------------+  +--------------------+  +--------------------+
            | commands              | reads                 | consents              | deposits
            v                       v                       v                       v
  +----------------------------------------------------------------------------------------------+
  | LENDING SERVICE                                                                              |
  | lends: loans, collateral, guarantors; lender rules or Sacco rules beside it, by the          |
  | product's rule set (rule 7); acts as the person, on the approval engine's yes                |
  | [kapu_service]                                                                               |
  +----------------------------------------------------------------------------------------------+
          | requests         | payouts          | messages          | signatures,         | postings
          |                  |                  |                   | tickets             |
          v                  v                  v                   v                     v
  +----------------+ +----------------+ +----------------+ +--------------------+ +----------------+
  | APPROVAL ENGINE| | RAILS          | | MESSAGING      | | BACK-OFFICE GATEWAY| | CORE ADAPTER   |
  | decides        | | pays           | | sends          | | translates         | | posts          |
  | [kapu_service] | | [kapu_service] | | [kapu_service] | | [kapu_service]     | | [kapu_service] |
  +----------------+ +----------------+ +----------------+ +--------------------+ +----------------+
```

**Related:** implements [mfi](../modules/mfi.md) and
[sacco](../modules/sacco.md); depends on
[kapu-core-fineract](kapu-core-fineract.md),
[approval-engine](approval-engine.md), [lender-rules](lender-rules.md),
[back-office](back-office.md), [deposits-service](deposits-service.md), [vault](vault.md) and
[transactions](transactions.md), the model of every money movement it starts, and [rails](rails.md), through which it pays out;
used by [staff-workspace](staff-workspace.md) and
[kapu-console](kapu-console.md); journeys
[JN-04](../journeys/loan-to-disbursement.md),
[JN-05](../journeys/guarantor.md) and
[JN-06](../journeys/restructuring.md); its product terms come from [product-versions](product-versions.md); partners, inside it, are [lending-partners](lending-partners.md).

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
  them (product-versions).

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
9. **It says when a customer relationship ends** (FS-1073). A person or
   business with no live loan, deposit account, share or guarantee at
   the institution, and no application open, is no longer its customer once
   any period the institution added at onboarding has passed (OB-COM-26;
   none by default, FS-1140): this service
   publishes `relationship.ended` with their reference, and the vault
   starts the seven-year clock on their identity and KYC documents
   (vault §3). Anything new before then resets the count; anything new
   after it publishes `relationship.resumed`, which stops the clock
   until the next end. Checked each night, after the close.
10. **Every money movement it starts is a transaction** on the one model
    (transactions; FS-1154): it mints the txid for a payout, a refund, a
    write-off and the parts of a repayment split across loans (transactions
    rule 7); a payout names its source before approval and is approved by
    its body's hash, one approval for a payout from or to several accounts
    (rule 5); its charges, the excise duty on them and the amount type
    follow the product version (rule 3, rule 8). The rails mint a
    repayment that arrives from outside.

## 5 · Partners and collateral

### 5.1 · Partners

FS-995, FS-996. The third parties a product works with: their record,
relationships, lifecycle, data feeds and people are
[lending-partners](lending-partners.md) (phase 2; FS-1058). In R1 the lending service
keeps nothing of theirs.

### 5.2 · Collateral: the register

FS-1069. What secures a loan, in one place: each item's record, the
steps that make it security and later release it, where its originals
are, and the register that lists them all. It brings together mfi MF-03
and MF-04 (R1), MF-15's collateral report, and MF-30 and MF-18 (R2);
what each journey does with it stays in the journey (loan-to-disbursement
step 2, loan-settled), and recovery's dates stay in lender-rules §2.11.

**The rules:**

1. **The platform records and tracks; named officers act.** In R1 the
   registry search and registration, NTSA, the land registry and the
   strong room are done by people, on the registries' portals and in
   person; each act is a step here with its owner, due date, evidence
   and outcome (FS-619). Automation later replaces a step, never the
   checklist (NTSA MF-05, land MF-18).
2. **One record per item, here.** Fineract's own collateral records are
   not used (kapu-core-fineract §3), so there is one answer to what
   secures a loan (architecture §2, "reference by id").
3. **Documents in the vault, links here.** Every scan, search
   certificate, valuation, notice and signed agreement is filed in the
   document vault (identity ID-15, FS-527); the record keeps the link and
   the registry's numbers, never the file (FS-1070).
4. **A product version says what it accepts:** the types, the
   loan-to-value, and which steps hold approval or disbursement
   (product-versions, "Collateral"; MF-04). Roan Capital chooses its own
   (roan-capital, open answer 15).
5. **Nothing is released by one person.** Releasing an original, or the
   security itself, needs a second person's approval through the approval
   engine, after the final payment is reconciled and the hold has passed
   (MD-06; loan-settled step 6).
6. **A failed check blocks,** unless the override authority records why
   (MF-04); the override is kept with the record.

**Types in R1** (MF-03, FS-581; RC-08):

| Type | Security | What R1 does | Later |
|---|---|---|---|
| A vehicle, by its logbook | A security right registered in the collateral registry (MPSR Act), and the vehicle jointly registered with NTSA | The whole lifecycle below | NTSA by API (MF-05); revaluation and lapse reminders (MF-30) |
| Land, by its title deed | A charge in the prescribed form, registered against the title (Land Act s.79); holding the deed alone is only a lien | The record, the title in the vault, the charge's reference; the land registry search and the charge's registration tracked as manual steps | Searches and registration by API (MF-18) |

Other types a product version may name (chattels, equipment, deposits,
the goods financed, receivables) come with MF-18.

**The record:**

| Part | What it holds |
|---|---|
| The item | Its type; what identifies it (a vehicle's registration and chassis number; land's title number); its description |
| Its owners | Each owner by reference to their party; for land that is a matrimonial home, the spouse's assent (Land Act s.79(3)) |
| What it secures | The loan or loans, by the core's id |
| Its value | The valuation: amount, valuer, date, and the report in the vault; the loan-to-value at approval against the product version's maximum |
| Its registrations | The collateral registry's notice: number, time, expiry, and the date the borrower's copy was sent; NTSA's joint registration; for land, the charge's number |
| Its cover | Insurance: insurer, policy, expiry, and whether the institution is named on it; a tracking device: provider, device, certificate |
| Its custody | Where each original is now, from the custody log |
| Its steps | The checklist, below, with each step's state |
| Its state | One of the states below |

**States,** each move an event on the bus:

| State | Means | Moves on when |
|---|---|---|
| Proposed | Captured on an application | The checks before approval pass, or are overridden |
| Verified | Fit to approve against | The steps before disbursement are done: signed, registered, the original in custody |
| Secured | Holding a live loan | The loan is settled, or recovery starts |
| In recovery | A recovery case is open (lender-rules §2.11 for a vehicle) | Paid in full before the sale, back to Secured or on to Released; or sold |
| Released | Settled, the release checklist done, the originals handed back | Final |
| Sold | Sold in recovery, the proceeds applied, the registry cleared | Final |

**The checklists,** a step per row, per type and stage; each with an
owner, a due date, evidence in the vault and an outcome. Which steps hold
approval or disbursement is the product version's (rule 4).

| Stage | A vehicle | Land |
|---|---|---|
| Before approval | The logbook attached (the committee cannot open the application without it, RC-09); NTSA's ownership search; the collateral registry searched by the chassis number or the borrower's identifier, its certificate filed, so an earlier lender's right is found first; the valuation | The title deed attached; the official search; the valuation; for a matrimonial home, whose assent is needed |
| Before disbursement | The security agreement signed (Odoo Sign); the notice registered, its number, time and expiry recorded; NTSA's joint registration; the original logbook into custody; insurance, and the tracker fitted where the product needs them | The charge signed in the prescribed form, with the spouse's assent where needed; the charge registered against the title, its number recorded; the original title deed into custody |
| During the loan | The borrower's copy of the notice sent through their own link within ten working days (MPSR Act s.31(2), an offence if missed); insurance expiry; a warning six months before the notice expires if the loan is still live (MPSR Act s.30); the tracker's alerts logged, a recovery opened from them | Insurance expiry, where the product needs cover |
| At settlement | The cancellation notice registered within ten working days, unasked (MPSR Act s.33); NTSA's joint registration removed; the insurer and the tracker told; the originals released (rule 5) | The discharge registered and the title documents delivered (Land Act s.102); the originals released (rule 5) |

Overdue steps are reminded and escalated (mandates MD-08).

**The custody log** (MF-03): every movement of an original, appended,
never edited. Received, and where it is kept; out and back (to a
registry, a court, an auctioneer), with who took it and why; handed back
to the borrower, their identity checked against the record and the
handover signed, or to someone they authorised in Odoo Sign (T39), with
a code to the borrower's phone at the handover (T40). The officer who
keeps it is named by the institution.

**The vehicle's whereabouts** (FS-1071), in two stages, treated apart:

- **While the loan is live, and up to repossession: where it is.** No
  live location is held, by us or the institution: the tracker's stream
  stays with its provider, as a borrower's movements are personal data
  and holding them is monitoring the loan does not need (privacy PR-22).
  The tracker's alerts (a red zone, the vehicle untraceable) are logged
  as now, and may open a recovery (MF-04). **A location is looked up only
  once a recovery case is open,** through the provider's portal, or its
  API once there is one (MF-31); each lookup recorded against the loan,
  with who, when and why. The tracker, and when its location is used,
  are named in the security agreement and the privacy notice. Whether
  this is the right basis, and whether a lookup before default could
  ever be allowed, is LQ-34; until it is answered, this is the design.
- **From repossession: where it is kept.** A **possession log** for the
  vehicle, beside the custody log for its papers: appended, never
  edited, from the day it is taken to its sale or its return.

| Entry | What is recorded |
|---|---|
| Taken | When, and where from; the auctioneer and their licence; the basis: the agreement's consent, no objection, or a court order for hire purchase past two-thirds (lender-rules §2.11 step 3) |
| Inventory and condition | The auctioneer's inventory; photos, mileage, keys and damage, filed in the vault |
| Personal effects | What was in the vehicle, and when and to whom it was returned; never the borrower's essential effects (reg 30(1)(k)) |
| Where it is kept | The yard and its address, who holds it, its reference there, and whether it is insured while stored |
| Each move | Yard to yard, or to the sale's venue: when, who moved it, and why |
| Costs | Towing, storage and the auctioneer's charges, each with its evidence: recovery costs, within the arrears cap (lender-rules §2.1) |
| Out | Back to the borrower on redemption (MPSR Act s.69), or to the buyer on the sale, against their signature; the record then Released or Sold |

The yard's address is the institution's business record; the borrower's
whereabouts are the sensitive part, and are never kept on the record.

**The register** (MF-15): every item, by state, with its loans, value
and loan-to-value now, registrations and their expiry, insurance expiry,
where its originals are, and its overdue steps; filtered by what expires
in 30 or 180 days, what is overdue and what is in recovery; exported to
CSV. In the staff workspace for credit roles, read-only in the Kapu
Console when Odoo is down; ID numbers masked (SE-27).

**Recovery.** For a vehicle, lender-rules §2.11 holds the case and its
dates; this record keeps the evidence and moves to In recovery, then
Sold or Released. For land, the Land Act's own steps (Land Act s.90: a notice and three months;
Land Act s.96: forty days; Land Act s.97: a forced sale valuation) are in
the Title Deed product's ladder; lender-rules does not yet specify them
(§12).

## 6 · Interfaces

- **Reads and commands** for the staff workspace and the Kapu Console:
  clients, applications, loans, collateral, guarantors, payouts,
  repayments, arrears, tasks; each command accepted, refused with a
  reason, or sent to the approval engine.
- **Collateral** (§5.2): the record and its checklist; a step completed
  with its evidence's vault link; a custody movement; a possession log
  entry; a location lookup, with its reason, allowed only in recovery; a release, sent to
  the approval engine; the register, filtered and exported.
- **Products:** lender rules' endpoints, including the
  draft, validate, preview, adopt and submit calls the Products screen
  uses (FS-978, FS-981; lender-rules §3).
- **Events:** in the domain of the product's rule set: `kapu.mfi`, and
  `kapu.sacco` from R4 (event-bus-kafka §5, FS-1057); the collateral
  register's among them (§5.2), and the relationship's end (rule 9).

## 7 · Security and audit

Staff realm only; service accounts for the engine and rails; every act
against the person; no Dibon identity holds a product role (AC-09).

## 8 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| Applications, collateral records and their evidence, overrides | Confidential | Seven years after the loan ends | Borrowers', guarantors' |
| The custody log | Confidential | Seven years after release; twelve from default if the loan went to recovery (DT-21) | Borrowers', and whoever collected for them |
| The possession log, and each location lookup with its reason | Confidential | As the custody log | Borrowers'; the lookups name who made them |
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
| A5 | A secured application without its logbook or title | The committee is asked to open it | It is held until the document is attached | RC-09, MF-04 |
| A6 | A registry notice registered on day 0 | The borrower's copy is not marked sent by the eighth working day | The step is reminded, then escalated, before the tenth | MF-03, MPSR Act s.31(2) |
| A7 | A loan settled and reconciled, the hold passed | One person releases the original logbook | It is refused until a second person approves | §5.2 rule 5, MD-06 |
| A8 | A collateral item in Fineract and in this service | The design is checked | Only this service holds it | §5.2 rule 2 |
| A9 | A notice expiring in six months on a live loan | The night's checks run | A warning is raised to its owner | MF-03, MPSR Act s.30 |
| A10 | A secured loan with no recovery case open | An officer asks for the vehicle's location | It is refused, and the attempt recorded | §5.2, LQ-34 |
| A11 | A repossessed vehicle | It is moved from the yard to the sale's venue | The move is recorded, with who and why, before the sale can be marked done | §5.2 |
| A12 | A borrower whose last loan closed today, with no account, share, guarantee or open application, at an institution that added no period | The night's check runs | `relationship.ended` is published with their reference, once | rule 9, OB-COM-26 |
| A13 | The same borrower takes a new loan two years later | The loan is opened | `relationship.resumed` is published, and the vault stops their documents' clock | rule 9, vault §3 |

## 12 · Open questions

**For the owner:**

1. Sacco rules: SASRA's regulations read and specified before Kapu Sacco
   (R4).
2. The split mode (FS-066), owed before its first customer.
3. Collateral (§5.2, FS-1069): whether one item may secure more than one
   loan, and how its value is then shared; the land's recovery steps
   under the Land Act, in lender-rules beside §2.11; and which of Roan
   Capital's positions keeps the custody log (roan-capital, open answer
   15).

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](../law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 30 | reg 30(1)(k) | No harassing, shaming or threatening collection: nothing posted to shame a borrower (30(1)(d)), no messages to their contacts (30(1)(e)), no calls outside working hours, no taking of essential personal effects (30(1)(k)); no charges not disclosed in the contract (30(2)); land security recovered under the Land Act (30(3)); thirty days' notice before selling movable security (30(4)) |

**[LR-23](../law/LR-23.md) The Movable Property Security Rights Act (Cap. 499A).** Regulator: The Registrar of security rights, who keeps the collateral registry. Made under: An Act of Parliament. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2017/13/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 30 | s. 30 | A registered notice is effective for the period the registrant states, at most ten years; it can be extended only within the six months before it expires, by an amendment notice |
| s. 31 | s. 31(2) | The Registrar sends the registrant a copy of each registered notice; the registrant sends it to the grantor within ten working days (31(2)), and failing to is an offence (31(3)) |
| s. 33 | s. 33 | The secured creditor registers an amendment or cancellation notice where a notice exceeds what the grantor authorised, collateral is released, or the security right is extinguished; free of charge, and within ten working days of the grantor's request, or the grantor may go to the Registrar |
| s. 69 | s. 69 | Anyone affected may redeem the collateral by paying the secured obligation in full with the reasonable cost of enforcement, until it is sold or otherwise disposed of |

**[LR-47](../law/LR-47.md) The Land Act (Cap. 280), formerly No. 6 of 2012.** Regulator: None: the courts apply it; the National Land Commission for public land. Made under: An Act of Parliament. In force: Yes. Version read: as at 2025-11-04, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2012/6/eng@2025-11-04).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 79 | s. 79, s. 79(3) | A charge is made by an instrument in the prescribed form (79(1)); a charge of a matrimonial home is valid only if the spouse living there also signs or assents (79(3)); a formal charge takes effect only once registered, and gives no remedy until it is (79(5)); holding the title deed alone is an informal charge, a lien by deposit of documents, enforced only by a court's order (79(6), (7)) |
| s. 90 | s. 90 | After one month in default, a written notice to the chargor (90(1)) stating the default, the amount to pay and a time of at least three months to pay it, or two months for any other default, what follows, and the right to apply to court (90(2)); if not met within ninety days of service, the chargee may sue, appoint a receiver, lease, take possession or sell (90(3)) |
| s. 96 | s. 96 | A sale only once the time in the s. 90 notice has passed in default (96(1)); then a notice to sell, and no contract of sale completed until forty days after it is served (96(2)); copies to the spouse who consented, co-owners, lessees, other chargees and guarantors, and posted at the land (96(3)) |
| s. 97 | s. 97 | The chargee owes the chargor, guarantors and later chargees a duty to get the best price reasonably obtainable (97(1)); a forced sale valuation by a valuer before selling (97(2)); a sale 25% or more below market value is presumed a breach, and the chargor may ask a court to void it (97(3)); none of this can be contracted out of (97(7)) |
| s. 102 | s. 102 | Until the land is sold, the chargor may discharge the charge by paying all it secures, and the chargee then delivers the discharge and the title documents |
