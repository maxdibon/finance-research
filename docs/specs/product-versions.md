---
id: product-versions
name: Product versions — build specification
kind: spec
type: build
status: draft
law: LR-03
released: unreleased
release: R1
implements: [mfi, sacco]
depends_on: [approval-engine, kapu-core-fineract]
used_by: [lender-rules, lending-service, recon, staff-workspace]
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-800, FS-801, FS-802, FS-803, FS-805, FS-808, FS-813, FS-814, FS-816, FS-817, FS-823, FS-825, FS-978, FS-981, FS-991, FS-1058, FS-1054]
last_reviewed: 2026-10-30
---

# Product versions — build specification

How every term of a lending product is held in one signed document, the
**product version**, from which Fineract, the lender rules, the key
information document, the calculator and recon's companion all take
their terms (FS-800 to FS-802). It was part of lender-rules §2.4 and is
a spec of its own (FS-1058) because five specs rest on it; the rule on
changing a price, CBK's approval and notice to the borrower, stays
lender-rules'. In R1 it runs inside the lender-rules service, not as a
service of its own, as the lender rules run inside the lending service
(FS-629); savings products take the same form in R4
(deposits-service §4). Nothing is built: every behaviour here is
**designed**.

## 1 · Purpose and scope

What it answers: where does a product's every term live, who writes it,
and how does each system that prices or checks a loan read the same one?

| Id | Capability | In R1 |
|---|---|---|
| MF-23 | The pricing model, the APR and the key information document, generated from the version | Yes, as their one source of terms |
| MF-24 | Price changes: a change is a new version, approved and held for CBK's letter (lender-rules §2.4) | Yes |
| MF-34 | The agreement and key information document generated from the version and the loan's terms | Yes |

**Out of R1:** savings products (KC-02, R4), in the same form; the
Products screen's form replacing the drafts in docs/products/ (FS-816).

**Where it sits.**

```
  +--------------------+          +--------------------+          +--------------------+
  | STAFF WORKSPACE    | a draft  | LENDER RULES       | two      | APPROVAL ENGINE    |
  | shows, asks        |--------->| keeps the versions |--------->| decides            |
  | [odoo]             | adopted  | [kapu_service]     | approvers| [kapu_service]     |
  +--------------------+          +--------------------+          +--------------------+
                                            | on activation, and each night
            .-------------------------------+-------------------------------.
            | settings, by API              | the version, computed         | terms, once active
            v                               v                               v
  +--------------------+          +--------------------+
  | KAPU CORE          |          | COMPANION LEDGER   |          the product page, the
  | records            |          | recomputes         |          calculator, every
  | [apache_fineract]  |          | [kapu_service]     |          channel (BS-20)
  +--------------------+          +--------------------+
```

**Related:** implements [mfi](../modules/mfi.md) and
[sacco](../modules/sacco.md); depends on
[approval-engine](approval-engine.md) and
[kapu-core-fineract](kapu-core-fineract.md); used by
[lender-rules](lender-rules.md), [lending-service](lending-service.md),
[recon](recon.md) and [staff-workspace](staff-workspace.md); the drafts
until the form exists are [docs/products/](../products/README.md).

## 2 · Concepts

- **A product version:** one product's every term, in the vocabulary
  (§4), signed, with its approvals; never changed once stored.
- **Proposed, and adopted:** a version Dibon drafts is *proposed*; it
  becomes the institution's draft only when its product owner adopts it.
- **The vocabulary:** the fields a product is described in, each with
  its allowed values, in three groups (§4); its schema is code.
- **A never-term:** a term no institution may put in a version, whatever
  it wants (§4).

## 3 · Rules

1. **The product version document is the one authority** (FS-800,
   FS-801, FS-802). Every term of a product lives in one signed document;
   Fineract, the lender rules, the key information document, the
   calculator and recon's companion all take the terms from it, and
   none keeps terms of its own.
2. **Written in a vocabulary,** not free text (§4). The schema is code,
   in the code repository, changed only by pull request; adding a term
   means the lender-rules service, the Fineract mapping and the companion support it
   together.
3. **Drafted by the institution itself** (FS-978): its product owner, in
   the staff workspace's Products screen inside Odoo, on a form bound to
   the vocabulary, usually from one of Dibon's starter templates. Odoo is
   only the form: the lender-rules service checks every value as it is entered,
   computes every preview, and stores the version (staff-workspace rule
   9). **A version Dibon drafts is *proposed*** (FS-981): during
   onboarding, or as a change we suggest. Dibon never submits, approves or
   activates one; the institution's product owner reviews it, edits it,
   and **adopts** it as its own draft, or rejects it. Every version records
   who drafted it and who adopted it. Before it can be submitted, the form previews sample
   schedules, the APR and total cost of credit, the draft key information
   document, and the companion's own figures for the same samples; if
   the lender-rules service's preview and the companion's disagree, it cannot be
   submitted. **Until the form exists** (FS-816, FS-817), drafts are kept and answered as
   docs/products/ says. **The schema is defined in the code
   repository and applied wherever a value enters** (FS-823, FS-825):
   when we draft, when an institution's answers are read back, when a
   person encodes them, and later in the form, at approval and at
   activation. Its first files, the schema and the rules across terms
   with their worked examples, are written in code/lender-rules/ until
   the code repository exists, and move there when it does.
4. **Approved** as a `product.version` request (approval engine), by two
   people, each re-authenticated; then held until CBK's letter is recorded
   (lender-rules §2.4); then activated from its effective date, for new loans.
5. **On activation** the lender-rules service applies it to Fineract through the API,
   never by hand (kapu-core-fineract §4); generates the key information
   document and the calculator from it; and publishes
   `kapu.mfi.product.version.activated` with its id and hash.
6. **Stored once, never changed:** in the lender-rules service's append-only store in
   the institution's instance, signed, with its approvals and CBK's letter;
   its hash anchored in the audit chain; the key information document in
   the vault. A change is a new version. The institution's documents are
   its records, never in Dibon's repositories.
7. **Each loan names its version:** the approved request carries the
   version's id and hash, so every calculation uses the terms the loan was
   approved and signed under.
8. **A version recon's companion cannot compute cannot be activated.**
9. **Who sees it, by stage** (FS-803, FS-805): a draft, or a version
   approved and awaiting CBK, is the institution's and Dibon's alone; an
   **active** version is public, as regs 47(1)(d) and 48 require: its terms
   and key information document are published from the signed document on
   the institution's product page, its calculator and every channel,
   always the current version, older versions kept for the loans made
   under them (business-suite BS-20). An institution with no website yet
   (Roan Capital, until R2) publishes at its offices and in the channels it
   uses, and gives the key information document before every agreement
   (MF-34; FS-808). Where rates vary by the borrower's
   creditworthiness (reg 59(2)(c)), the page shows the range, and each
   borrower's rate is in their own key information document.
10. **The pricing model is not in the document.** Reg 59(2)(a) to (e)'s
   components (cost of funds, cost of capital, operations, return to
   shareholders, the risk premium) are the institution's commercial
   reasoning: they go to CBK with the version, and are never published.

## 4 · The vocabulary

**The vocabulary** (FS-813, FS-814): what describes a product, in three
groups, because they are not all published. Each is a field with its
allowed values; the schema in the code repository enforces it
(code/lender-rules/ until that repository exists, FS-825). Why each
matters is shown beside it wherever an institution is asked about it, in
the form and in the questionnaires (FS-816).

**A · The product's terms:** in the document, published once active.

| Term | Values | Why it matters |
|---|---|---|
| Amount limits | Minimum and maximum, KES | The smallest and largest loan the product offers |
| Term | Length and unit (days, weeks, months); minimum and maximum, or a list of allowed terms (14 or 30 days) | How long the borrower has; it sets the due dates |
| Repayment frequency | Once at maturity, daily, weekly, monthly, or chosen by the borrower to fit their pay cycle within set bounds; when the first instalment falls (the day after disbursement) | When each instalment falls: it sets the repayment schedule |
| Facility | A term loan; or a credit line: when its limit renews (monthly, from new purchases, for example), what sets it (assessed, a partner's purchases, salary, a multiple of deposits, a mobile operator's data on the customer), and how long each draw runs (FS-989, FS-991) | Whether the borrower takes one loan, or draws on a limit again and again |
| Repayment source | Who repays: the borrower; the employer, by check-off; the buyer of an invoice; a share of the borrower's till takings, and what share; automatic recovery on the due date from the borrower's savings or wallet, with their consent, and from which (FS-989, FS-991) | Where repayments come from, which the borrower must know before signing |
| Interest method | Flat; or reducing balance, with equal instalments or equal principal | How interest is worked out; it changes the total cost of credit |
| Interest rate and its unit | A number, with its period: for the term, a day, a month or a year | The loan's price; published, and pricing needs CBK's approval (reg 55) |
| Rate type | Fixed; or variable: a benchmark (KESONIA, the Central Bank Rate) plus a margin, and when it resets | Whether the price can change during the loan, and how |
| Rate by risk class | One rate, or a rate per risk class (decisioning DE-04): the page shows the range, each borrower's key information document their own (reg 59(2)(c)) | Lets the price follow the borrower's risk; the page shows the range (reg 59(2)(c)) |
| Interest basis | The day count (actual days over 365, or 30 over 360) and when interest accrues | Decides interest to the shilling, so every system agrees |
| Fees | Each fee: a fixed amount, a percentage of principal, or tiers by amount; once per loan or once per client (a membership fee); taken at disbursement, added to the schedule, or paid upfront before the application, and whether it is refundable | Part of the total cost of credit and the APR, each shown in the key information document |
| Tax on fees | Excise duty on each fee as the law sets it: 20% of fees charged by financial institutions and by digital lenders, not on interest or insurance premiums (Excise Duty Act, First Schedule, Part II; LQ-14) | What the law adds to fees, shown in the total cost of credit |
| Who pays the rail's charges | The borrower or the institution, for M-Pesa's and the bank's own charges on repayments and payouts | Whether M-Pesa's and the bank's charges add to what the borrower pays |
| Third-party costs | Each: valuation, registration at the collateral registry, a tracking device, insurance premiums; passed on at cost and outside the APR (reg 59(2)(f); LQ-03) | Costs passed on at cost, shown apart from the APR |
| Insurance | As a fee, or a third party's premium; credit life, and what happens to the loan on a death (JN-14) | What protects the loan, and what happens to it on a death |
| Grace | Days after a due date before default interest starts | When default interest starts after a missed instalment |
| Default interest | Rate, period (a day), base (principal outstanding, or the overdue amount), from which day past due | The charge on a late payment; it counts within the cap (reg 29) |
| Default period | The days past due at which a loan becomes non-performing: at most 30 for a loan contracted for 30 days or less, 90 for a longer one (reg 57(1)); stated in the credit policy and the agreement (57(2), (3)) | When a late loan becomes non-performing, which starts the cap (reg 57) |
| Collateral | Unsecured; or the types accepted (a vehicle, chattels, land, deposits; the goods financed, their title kept until paid; receivables; salary, by check-off), the loan-to-value, and the steps each needs (MF-03, FS-989) | What secures the loan, and the steps each type needs |
| Guarantors | How many; each guarantee's limit; for a Sacco, deposits pledged (reg 42; MF-37) | Who else answers for the loan, and for how much (reg 42) |
| Restructuring | Allowed or not; how often; any fee, inside the cap (reg 54(7); MF-09) | Whether a borrower in difficulty can have new terms (reg 54(7)) |
| Statements | How often the borrower and each guarantor receive one (reg 47(2); MF-37, MF-38) | How often borrower and guarantor are told where the loan stands (reg 47(2)) |
| Collection ladder | Its stages by day (MF-39) | What happens on each day a loan is late, and who acts |
| Holiday rule | Whether a due date on a holiday moves, and which way (KC-15) | Whether a due date on a holiday moves |
| Rounding | Precision and rule | Keeps every system's figures identical |
| Languages | Of the key information document and the agreement: English, Swahili | The languages a borrower reads the terms in |

**B · Eligibility and limits:** the institution's credit policy for the
product. Who may borrow is published; the thresholds behind a decision
stay internal, as decisioning's risk classes do.

| Rule | Values | Why it matters |
|---|---|---|
| Who may borrow | Individuals, businesses, or both; employed or self-employed; age; for a Sacco, members of at least so many months | Who the product is for; published |
| Affordability | The limit on instalments against income or turnover, from the statement metrics: what share, over how many months, and whose inflows count (the person's, the business's, or both); stated in the credit policy (reg 25(2)(s); DE-02) | The duty to assess ability to repay and never to lend recklessly (reg 28(1)(b), (c)) |
| Cooling-off period | Its length in days, and what it is: a time after signing to withdraw without charge, or a wait before a new loan (LQ-15) | The credit policy must state one (reg 25(2)(f)) |
| Limits by KYC tier | The largest loan for each tier (identity ID-19) | The largest loan for each level of identity checks |
| First loan and limit growth | The first loan's cap; how the limit grows with repayment history; any wait before borrowing again | How a new borrower starts, and how the limit grows |
| Exposure | Loans a borrower may hold at once; top-ups; for a Sacco, a multiple of deposits; each guarantor's total exposure (Roan Capital RC-41) | How much one borrower or guarantor may owe at once |
| Bureau | Whether a lookup is required before lending (crb CR-02) | Whether a credit report is checked before lending |

**C · How it runs:** configuration the product links to, never published.

| Setting | Values | Why it matters |
|---|---|---|
| Approval chain | By amount tier (mandates MD-01) | Who must approve each loan, by amount |
| Documents | The checklist (identity ID-02) | What a borrower must provide |
| Disbursement | The channels: M-Pesa or a bank, and which account | How the money is paid out, and from where |
| Payee | Who receives the money: the borrower; or a third party (a supplier, dealer, school, hospital, insurer, agro-dealer, merchant), only from an approved list and against a proof (an invoice, a proforma, a quotation, a fee structure, a premium notice); whether any part goes to the borrower (FS-989) | Whether the money reaches the borrower, or pays for what the loan was for |
| Partner | The third party (a distributor, dealer, school, hospital, insurer, employer, produce buyer, merchant, or a mobile operator whose wallet carries the product) and its part: whether it shares data, and how the borrower consents to it (each partner apart, the default; once for partners named at the time, never future ones; or off, only where another lawful basis is recorded by decision: FS-1004) (with the borrower's consent), what it pays towards the price, any first loss it takes, whether returned goods are refunded to the loan (FS-989) | What the partner owes the lender, and the borrower |
| Cut-off | When payments stop being released (Roan Capital: 23:00 to 04:00, RC-21) | When payouts stop being released |
| Purposes | The list a borrower chooses from | The reasons a borrower can choose from |
| Bureau reporting | When the product's loans are reported (crb, phase 2) | When the product's loans are reported to the bureaus |

**Never terms, whatever an institution wants:** a minimum interest period
or any charge on early repayment (reg 56(3), (4); FS-807, LQ-13); default
interest beyond the cap (reg 29); contact with anyone but the borrower and
the guarantor (reg 30). The repayment order and the cap are the
regulations', not terms; a reading not yet settled is the interpretation
record's (recon §3.1.3).

## 5 · Interfaces

**Endpoints** (the lender-rules service, internal):

| Endpoint | Purpose |
|---|---|
| `POST /product-versions` (draft or proposed), `.../{id}:validate`, `.../{id}:preview`, `.../{id}:adopt`, `.../{id}:submit` | The Products screen: draft, check, preview, adopt a proposed version, submit (FS-978, FS-981) |
| `GET /products/{id}/versions/{v}` | A version, with its status, approvals and hash |

The APR, the key information document and CBK's approval are the lender
rules' endpoints (lender-rules §3).

**Events** (event-bus-kafka §5): `kapu.mfi.product.version.activated`,
with the version's id and hash.

## 6 · Security and audit

- Drafting by the institution's product owner only; Dibon proposes and
  never submits, approves or activates (rule 3).
- Approval by two people, each re-authenticated, never the drafter;
  activation only with CBK's letter recorded (rule 4).
- Every version, its approvals and its letter append-only, its hash in
  the audit chain (rule 6).

## 7 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| Product versions, their approvals and CBK's letters | Confidential until active, then public in part (rule 9) | Seven years after the product's last loan ends | The drafter's and approvers' identities |

## 8 · Quality and metrics

- **A preview within two seconds** at the 95th percentile, with the
  companion's figures beside it (proposed).
- **Metrics:** versions by status; refusals at submission, by term;
  nightly differences between Fineract's settings and the active version.
- **Alerts** (observability-grafana §4): a setting in Fineract that
  differs from the active version (2; kapu-core-fineract F15).

## 9 · Threats

| Threat | For example | The answer |
|---|---|---|
| Tampering | A term changed in Fineract by hand | Applied only by API from the version (rule 5); the nightly comparison |
| Tampering | A stored version altered | Append-only, signed, its hash in the audit chain (rule 6) |
| Repudiation | Which terms a borrower signed under | Each loan names its version and hash (rule 7) |
| Elevation of privilege | Dibon activating an institution's product | Dibon only proposes (rule 3); approval by two of the institution's people |
| Information disclosure | A draft's pricing published early | Visible to the institution and Dibon alone until active (rule 9); the pricing model never published (rule 10) |

## 10 · Acceptance tests

| # | Given | When | Then | Id, source |
|---|---|---|---|---|
| P1 | A version whose rate unit is missing | Submitted | Refused: the vocabulary requires it | §4 |
| P2 | A version the companion cannot compute | Activation | Refused | §4; recon §3.1 |
| P3 | A version with a minimum interest period, or any charge, on early repayment | Submitted | Refused as a never-term, naming it | §4; 56(3), (4) |
| P4 | A version with a KES 500 fee | Its key information document is generated | The fee shown with its excise duty of KES 100, inside the total cost of credit; no excise on interest or insurance premiums | §4; MF-23 |
| P5 | A version with rates by risk class | Published | The page shows the range; each borrower's key information document shows their own rate | §4; 59(2)(c) |

## 11 · Open questions

None of its own: the questions on what a term may be are lender-rules'
and counsel's (lender-rules §9), and each institution's answers are in
its drafts (docs/products/).

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](../law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 25 | reg 25(2)(f), reg 25(2)(s) | A written credit policy, consistent with the law, stating among other things the cooling-off period (25(2)(f)) and how the borrower's ability to repay is determined (25(2)(s)) |
| reg 28 | reg 28(1)(b), reg 28(1)(c) | Applications considered under the credit policy, ability to repay assessed and no reckless lending (28(1)); a refusal given at once, with reasons (28(2)); a loan may be restructured on the borrower's request or with prior notice (28(3)) |
| reg 29 | reg 29 | What can be recovered on a non-performing loan is capped at the principal then owing, interest up to that principal, and reasonable recovery costs; the cap is measured from the last time the loan became non-performing (29(3)); interest under a court order after the order is outside it (29(4)) |
| reg 30 | reg 30 | No harassing, shaming or threatening collection: nothing posted to shame a borrower (30(1)(d)), no messages to their contacts (30(1)(e)), no calls outside working hours, no taking of essential personal effects (30(1)(k)); no charges not disclosed in the contract (30(2)); land security recovered under the Land Act (30(3)); thirty days' notice before selling movable security (30(4)) |
| reg 42 | reg 42 | A guarantor's consent sought and obtained before the appointment; recourse to a guarantor only after non-judicial recovery from the borrower is exhausted, and after fourteen days' notice of the default |
| reg 47 | reg 47(1)(d), reg 47(2) | Product information fair, clear and current, and easily available at branches, websites and every channel (47(1)(d)); the lender says it is regulated by the Central Bank, and shows its company name |
| reg 48 | reg 48 | A key information document for each product: its benefits, risks, terms and conditions, in summary |
| reg 54 | reg 54(7) | At signing, the customer receives the agreement, the repayment schedule and the total cost of credit; the agreement states the loan, charges, rates, the APR, early repayment without charge (54(4)(h)) and more (54(4)); a variation needs thirty days' notice and the borrower's acceptance (54(7)) |
| reg 55 | reg 55 | Pricing parameters and credit terms change only with the Central Bank's prior written approval, after thirty days' notice to the customer and the customer's acceptance |
| reg 56 | reg 56(3), reg 56(4) | A repayment credited on the day it is paid, applied to due principal, then fees and charges, then interest; early repayment, in whole or part, without notice or penalty (56(3)), and no interest for the remaining term on full early repayment (56(4)) |
| reg 57 | reg 57, reg 57(1) | A loan is non-performing when principal or interest is outstanding thirty days past due, for a loan of thirty days or less, or ninety days, for a longer one (57(1)); the credit policy (57(2)) and each loan agreement (57(3)) state the default period |
| reg 59 | reg 59(2)(a), reg 59(2)(c), reg 59(2)(e), reg 59(2)(f) | A pricing model with clear parameters: its components and costs justified, rates that may vary with the borrower's creditworthiness (59(2)(c)), the criteria for non-performance, credit bureau scores, all-inclusive pricing except third-party costs (59(2)(f)), and the APR disclosed |
