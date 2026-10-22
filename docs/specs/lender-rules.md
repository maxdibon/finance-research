---
id: lender-rules
name: Lender rules — build specification
kind: spec
type: build
status: draft
law: LR-03
released: 2026.10.16
release: R1
implements: [mfi]
depends_on: [kapu-core-fineract, messaging, event-bus-kafka]
used_by: [end-of-day-runner, recon]
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-492, FS-531, FS-565, FS-625, FS-627, FS-629, FS-648, FS-667, FS-744, FS-763, FS-764, FS-792, FS-793, FS-796, FS-802, FS-805, FS-808, FS-807, FS-811, FS-814, FS-815, FS-816, FS-817, FS-823, FS-825, FS-830, FS-899, FS-896]
last_reviewed: 2026-10-22
---

# Lender rules — build specification

How Kapu MFI on Kapu Core (Apache Fineract) is designed to apply the CBK
Non-Deposit Taking Credit Providers Regulations 2026 (law register LR-03)
to Roan Capital's loans in R1. Nothing here is built; every behaviour is
**designed**. Fineract's side is in docs/specs/kapu-core-fineract.md, settled from
its documentation (FS-625); what only a running instance can show is that
spec's §9.

## 1 · Purpose and scope

| Id | Rule | Regulation | In R1 |
|---|---|---|---|
| MF-21 | Arrears cap (in duplum for lenders) | reg 29 | Yes |
| MF-22 | Repayment order, credit on the day paid, early repayment | reg 56 | Yes |
| MF-23 | Pricing model, APR, key information document | regs 48, 59 | Yes |
| MF-24 | Price changes: CBK approval, notice, acceptance | reg 55 | Yes |
| MF-25 | Non-performing classification | reg 57 | Yes |
| MF-26 | Collection conduct in messages | reg 30 | Yes |
| MF-27 | Bureau floor and pre-listing notice | reg 33 | No: phase 2, with CRB submission (MF-19) in R5; R1 keeps the data it needs |
| MF-28 | Complaints clock | reg 40 | Yes |
| MF-37 | Guarantors: consent, statements, notice, recourse last | regs 39(3), 42 | Yes; rules in the module row, design to add here (FS-531) |
| MF-38 | Borrower access: receipts, status, statements by link | reg 39(1) | Yes; rules in the module row, design to add here (FS-531) |
| MF-29 | Automated decisions explained, AI disclosed | reg 60 | No: Roan Capital has no automated lending decisions in R1, vetting stays human (MFI §7). It applies once a score or AI system takes part in a decision |

**Also out of R1:** court-ordered interest (reg 29(4)), handled by a flag and a manual
step; recovery of land security (reg 30(3)), which waits on MF-18.

**One component owns the rules:** the *lender-rules service* in the Kapu
MFI service layer. Fineract stays the system of record for loans,
schedules and balances (KC-04). The service decides what Fineract may
post and corrects what it should not hold. Fineract does not apply the
in duplum rule itself.

**Where it sits** (inside Kapu MFI's service layer, not a product of its
own: FS-629).

```
  +---------------------+
  | END-OF-DAY RUNNER   |
  | closes the day      |
  | [kapu_service]      |
  +---------------------+
        | the day's steps
        v
  +---------------------+  waivers, default interest  +---------------------+
  | LENDER RULES        |---------------------------->| KAPU CORE           |
  | corrects            |<----------------------------| records             |
  | [kapu_service]      |  balances, schedules        | [apache_fineract]   |
  +---------------------+                             +---------------------+
        | templates, hours and recipients checked
        v
  +---------------------+
  | MESSAGING           |
  | sends SMS           |
  | [kapu_service]      |
  +---------------------+
```

**Related:** implements [mfi](../modules/mfi.md); depends on
[kapu-core-fineract](kapu-core-fineract.md),
[messaging](messaging.md) and [event-bus-kafka](event-bus-kafka.md);
used by [end-of-day-runner](end-of-day-runner.md) and [recon](recon.md), whose companion recomputes what the rules produce, independently: written from the regulations and the product's terms, not from this service's code (recon §3, FS-793). Both read one interpretation record for the readings not yet settled, and both are tested on §2.9's worked examples (recon §3.1, FS-796); journeys
[JN-04](../journeys/loan-to-disbursement.md),
[JN-05](../journeys/guarantor.md) and
[JN-06](../journeys/restructuring.md).

## 2 · The rules

Each rule says what the law requires (**Regulation**), then **Our rule**:
what we do, our application and our reading of it, citing the provision
it applies and naming the legal question where our reading is not yet
settled (FS-900). "Rule" on its own is always ours; a law's own rules are
cited as "r." (Auctioneers Rules r.12). Then how the platform does it.

### 2.1 Arrears cap — reg 29, MF-21

**Regulation.** On a non-performing loan the lender recovers at most the
principal owing when it became non-performing, plus contractual interest
not exceeding that principal, plus reasonable recovery expenses (29(2));
if the loan performs and falls back, the limit is set from the last time
it became non-performing (29(3)).

**Our rule.** Once a loan is non-performing, what it accrues beyond the
principal it then owed (interest, fees and penalties together) stops at
that principal; recovery costs with receipts are the only addition (reg
29(2), (3)). Counting fees inside the cap, on that principal, is our
reading (LQ-01), and so is a rollover or restructure keeping it (LQ-02).

**Behaviour.**

1. When a loan becomes non-performing (2.5), the service opens a *cap
   episode*: `P_npl`, the principal outstanding at that moment, and the
   *bucket*, which opens at all interest, fees, penalties and charges
   then unpaid.
2. Every interest accrual, penalty and charge posted during the episode
   adds to the bucket, whether later paid or not. The bucket never
   exceeds `P_npl`.
3. Fees and penalties count in the bucket, not only interest: the
   regulations' definition of "charges" includes interest and fees, and
   29(2) has no separate allowance for them. This is the cautious reading
   (open question 1).
4. Recovery expenses (29(2)(c)) sit outside the bucket, only as a
   `recovery-expense` charge with a receipt, maker-checker approval
   (KC-08) and a contract clause disclosing it (reg 30(2)).
5. Repayments follow reg 56 (2.2). They do not change `P_npl`.
6. **Reset (29(3)).** Returning to performing closes the episode; a new
   one opens if the loan falls back, from the principal and unpaid
   charges at that moment.
7. **Court orders (29(4)).** Interest a court awards after its order is
   not capped; the flag is set manually under maker-checker.

**Where enforced.**

| Concern | Fineract | Service layer |
|---|---|---|
| Interest on non-performing loans | Product's non-performing setting; Fineract stops accruing income on a non-performing loan (kapu-core-fineract §4) | Recomputes the bucket daily regardless |
| Roan's 1% a day default interest | Not set up as a Fineract overdue charge for capped products | Posted daily as a dated charge of `min(daily amount, room)` |
| Anything else over the cap | — | Same-day waiver of the excess (Fineract's waive-interest or waive-charge command, kapu-core-fineract §5) |
| Write-off | Fineract write-off | Only on a credit decision to stop recovery, never as the cap mechanism |

Waiving is preferred to write-off: the statement shows only what may
lawfully be collected, and income reports (MF-15) show the amount waived.

**Data.** Per episode: opened at, `P_npl`, opening bucket, bucket, room,
closed at and why. Per posting: amount, type, capped or waived.

**Edge cases.** A backdated repayment re-ages the schedule: the service
re-runs the cap for that loan on posting. A rollover or restructure
(MF-09) inherits the open episode, and capitalised interest never enters
a new `P_npl` (open question 2).

### 2.2 Repayment order — reg 56, MF-22

**Regulation.** A repayment is credited on the date paid and applied to
due principal, then fees and charges, then interest (56(1), (2)); the
borrower may repay early, in whole or part, without notice or penalty,
and on full early repayment owes no interest for the rest of the term
(56(3), (4)).

**Our rule.** Money counts from the moment it was paid, goes to principal
first, then fees, then interest, and repaying early never costs more than
what has accrued to that day (reg 56(1) to (4)). No minimum interest
period on early repayment, whatever a product says (LQ-13).

**Behaviour.**

- Fineract's transaction date is the date the money was paid (M-Pesa or
  bank value date, Africa/Nairobi), not the posting date.
- Allocation, oldest instalment first: due principal, then fees and
  penalties, then interest. This replaces MF-08's configurable order for
  lenders.
- Money beyond what is due reduces outstanding principal.
- Payoff = outstanding principal + fees due + interest accrued to the
  payment date. No early-repayment fee may exist on a product.

**Where enforced.** Every loan product uses Fineract's progressive
schedule with advanced payment allocation, whose order is a setting:
past-due principal, fees, penalties, interest; then due; then in advance
(kapu-core-fineract §4). A custom transaction processor, Fineract's
documented extension, is the fallback if check F3 fails. The service
compares every posted breakdown with its own allocation and raises a
mismatch event on any difference. Whether Fineract's payoff drops unearned
interest on flat-rate loans is check F2; if not, the service waives it in
the same posting.

**Edge cases.** Payments during the end-of-day run; reversals (re-run
allocation and the cap); a payment below due principal (all to
principal).

### 2.3 APR and key information document — regs 48, 59; MF-23

**Regulation.** A pricing model with clear, all-inclusive parameters
except third-party costs, and full disclosure of the APR (59); a key
information document summarising each product's benefits, risks and
terms (48). Advertising and the agreement also carry the APR and total
cost of credit (51, 54(4)).

**Our rule.** Every product shows one APR, the effective annual rate on
what the borrower actually receives, and one key information document
generated from its terms and accepted before the money moves (regs 48,
59). The method, and third-party costs left out of the APR, are our
reading (LQ-03).

**APR method.** The regulations neither define APR nor prescribe a
method. Proposed: the effective annual rate `i` solving

    sum of advances A_k (1+i)^(-t_k/365)
      = sum of repayments B_j (1+i)^(-s_j/365)

Advances are what the borrower receives, net of fees deducted at
disbursement; repayments are every scheduled principal, interest and
mandatory fee; `t` and `s` are days from disbursement. Default interest
(contingent) and third-party costs passed on at cost (59(2)(f)) are left
out of the APR and shown in the total cost of credit (open question 3).

*Example:* KES 100,000 for 30 days, 10% interest for the term
(illustrative; the rate's unit is Roan open answer 4), a KES 2,000 fee
deducted. Received 98,000, repaid 110,000 on day 30:
APR = (110,000 / 98,000)^(365/30) − 1 ≈ **307.7%** (simple annualised:
149.0%).

**Key information document.** The company name (reg 49); amount and
tenor limits; the periodic rate, monthly or annual, flat or reducing,
fixed or variable (52(3)); APR; total cost of credit with an example;
every fee and when it applies; default interest and the reg 29 cap in
plain words; repayment order and free early repayment; when a loan
becomes non-performing (57(3)); bureau listing and its notice period;
collection conduct; complaint channels and the right to go to CBK
(50(3)).

**Where enforced.** Service layer, from the product version document
(§2.4), so the calculator (RC-29), the key information document and live
loans all come from one source. Generated per product version, stored
with a hash, shown before the agreement is accepted; the acceptance is
recorded on the loan.

### 2.4 Price changes — reg 55, MF-24

**Regulation.** No change to pricing parameters or credit terms without
CBK's prior written approval, then at least 30 days' notice to the
customer, who has accepted (55; also 54(7)).

**Our rule.** A price or term changes only as a new product version,
after CBK's written approval, and for new loans; a live loan changes only
after 30 days' notice and the borrower's recorded acceptance (reg 55; reg
54(7), (8)). Whether a restructure the borrower asks for still waits the
30 days is LQ-06.

**Behaviour.**

1. A change is a new **product version**, approved under maker-checker
   (MD-01, MD-02; Roan RC-31).
2. It stays *Awaiting CBK* until CBK's approval is recorded (reference,
   date, letter attached). No approval, no activation.
3. Once active it applies to new loans only: Fineract copies a product's
   terms onto each loan at creation (Roan RC-30).
4. Changing an existing loan is a *variation*: a notice setting out the
   changes (54(8)), effective no earlier than 30 days after delivery and
   only once the borrower's acceptance is recorded; otherwise the loan
   keeps its terms. A rate change reaches a live loan as a reschedule
   request with the new rate from the day it takes effect, within the
   product's range (kapu-core-fineract §6).

**The product version document is the one authority** (FS-800, FS-801,
FS-802). Every term of a product lives in one signed document; Fineract,
this service, the key information document, the calculator and recon's
companion all take the terms from it, and none keeps terms of its own.

- **Written in a vocabulary,** not free text (below). The schema is code,
  in the code repository, changed only by pull request; adding a term
  means this service, the Fineract mapping and the companion support it
  together.
- **Drafted in the back office** by the institution's product owner, on a
  form bound to the vocabulary, usually from one of Dibon's starter
  templates. Before it can be submitted, the form previews sample
  schedules, the APR and total cost of credit, the draft key information
  document, and the companion's own figures for the same samples; if
  this service's preview and the companion's disagree, it cannot be
  submitted. **Until the form exists** (FS-816, FS-817), Dibon drafts it
  in docs/products/, each item with an id, its source and its ask
  (confirm, choose, provide, decide), and the institution answers in
  Word questionnaires built from the draft, one per group, a form field
  per item; the answers are read back into the draft by script, never
  retyped (tools/products/). Beside its tables each draft holds the
  product as data, a typed block with an entry per term (FS-823): what
  we have, the typed form of each choice's options, and the value once
  settled; the read-back writes a value when the answer carries one, and
  a person encodes the rest. **The schema is defined in the code
  repository and applied wherever a value enters** (FS-823, FS-825):
  when we draft, when an institution's answers are read back, when a
  person encodes them, and later in the form, at approval and at
  activation. Its first files, the schema and the rules across terms
  with their worked examples, are written in code/lender-rules/ until
  the code repository exists, and move there when it does.
- **Approved** as a `product.version` request (approval engine), by two
  people, each re-authenticated; then held until CBK's letter is recorded
  (rule 2 above); then activated from its effective date, for new loans.
- **On activation** the service applies it to Fineract through the API,
  never by hand (kapu-core-fineract §4); generates the key information
  document and the calculator from it; and publishes
  `kapu.mfi.product.version.activated` with its id and hash.
- **Stored once, never changed:** in this service's append-only store in
  the institution's instance, signed, with its approvals and CBK's letter;
  its hash anchored in the audit chain; the key information document in
  the vault. A change is a new version. The institution's documents are
  its records, never in Dibon's repositories.
- **Each loan names its version:** the approved request carries the
  version's id and hash, so every calculation uses the terms the loan was
  approved and signed under.
- **A version recon's companion cannot compute cannot be activated.**
- **Who sees it, by stage** (FS-803, FS-805): a draft, or a version
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
- **The pricing model is not in the document.** Reg 59(2)(a) to (e)'s
  components (cost of funds, cost of capital, operations, return to
  shareholders, the risk premium) are the institution's commercial
  reasoning: they go to CBK with the version, and are never published.

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
| Collateral | Unsecured; or the types accepted (a vehicle, chattels, land, deposits), the loan-to-value, and the steps each needs (MF-03) | What secures the loan, and the steps each type needs |
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
| Cut-off | When payments stop being released (Roan Capital: 23:00 to 04:00, RC-21) | When payouts stop being released |
| Purposes | The list a borrower chooses from | The reasons a borrower can choose from |
| Bureau reporting | When the product's loans are reported (crb, phase 2) | When the product's loans are reported to the bureaus |

**Never terms, whatever an institution wants:** a minimum interest period
or any charge on early repayment (reg 56(3), (4); FS-807, LQ-13); default
interest beyond the cap (reg 29); contact with anyone but the borrower and
the guarantor (reg 30). The repayment order and the cap are the
regulations', not terms; a reading not yet settled is the interpretation
record's (recon §3.1.3).

### 2.5 Non-performing classification — reg 57, MF-25

**Regulation.** A loan with a specific repayment date is non-performing
when principal or interest stays outstanding after 30 days for a loan
contracted for 30 days or less; after 90 days for a longer loan; or when
a payment is unpaid for the period the agreement specifies (57(1)), a
period the credit policy and agreement must state (57(2), (3)).

**Our rule.** A loan is non-performing from the first day it is more than
30 days past due (a loan of 30 days or less) or 90 days (a longer one),
or sooner where its agreement says so (reg 57(1)). We count from the due
date (LQ-04).

**Behaviour.** Daily, per loan: days past due of the oldest unpaid
principal or interest. Non-performing from the first day that exceeds
the threshold: the shorter of the statutory period (30 or 90 days, by
contracted term) and the agreement's default period. Days are counted
from the due date (open question 4). The loan returns to performing when
nothing is past due beyond the threshold, which closes the cap episode.

**Where enforced.** The service is the authority. Fineract's NPA days
are set to match where a product's tenor range sits wholly on one side
of 30 days; a product spanning both is flagged at configuration. Fineract's
flag cannot be set by API: it follows the product's overdue days, and
clears after a re-age, so the service keeps its own (kapu-core-fineract §6).

### 2.6 Collection conduct — reg 30, MF-26

**Regulation.** In collection: no messages to a customer's contacts or
phone book, no shaming or obscene language, no threats, no calls outside
working hours (30(1)); no undisclosed charges (30(2)); 30 days' notice
before selling movable security (30(4)).

**Our rule.** Collection speaks only to the borrower, only from 08:00 to
18:00, Monday to Saturday, only in approved words, and charges only what
the contract disclosed (reg 30(1), (2)). Those hours are our reading of
"working hours" (LQ-05).

**Behaviour.**

- **Recipients.** Collection messages go only to the borrower's verified
  numbers. Guarantors get statements (47(2)), never collection pressure.
  Alternative contacts (50(1)(i)) are excluded from every collection
  template. Phone books are never read.
- **Working hours.** Not defined in the regulations. Proposed default:
  08:00 to 18:00, Monday to Saturday, not public holidays,
  Africa/Nairobi; narrower allowed, never wider (open question 5).
  Messaging's quiet hours (MS-15) hold a collection message until the
  window opens, never dropping it silently. Staff call tasks are hidden
  outside the window; calls are logged.
- **Language.** Collection templates are a separate category, approved
  under maker-checker by a compliance role, linted against a banned-terms
  list (shaming, threats of arrest or publication, telling contacts) and
  versioned. Messaging refuses an unapproved one.
- **Charges and security.** A charge type not in the loan's contract
  snapshot is refused. A vehicle sale is blocked until 30 days after the
  sale notice is delivered.

**Where enforced.** Messaging (MS-15) applies a policy the lender-rules
service supplies. Roan Capital's messages go through Dibon's own
messaging service (RC-20, FS-565), so the checks run in one place.

### 2.7 Bureau floor and notice — reg 33, MF-27 (phase 2)

**Regulation.** No negative listing where KES 1,000 or less is
outstanding (33(3)); notice at least 30 days before listing, or a shorter
contractual period, not under seven days for loans repaid at intervals of
less than 30 days (33(6)); notice within 30 days after listing (33(7)).

**Our rule.** No negative listing of KES 1,000 or less, and no listing
before its notice has run, with proof of delivery (reg 33(3), (6), (7)).

**Design for R5.** Submission (crb CR-03, CR-06) drops negative records
at or below KES 1,000 and holds each until its notice period has run with
proof of delivery. R1 records the non-performing dates and notice
evidence now.

### 2.8 Complaints clock — reg 40, MF-28

**Regulation.** Complaints are dealt with promptly; otherwise
acknowledged within seven days (40(3)); an oral complaint unresolved
after 48 hours is confirmed in writing (40(4)); resolved within 30 days
(40(5)); a record kept (40(6)) and reported to CBK (40(7)).

**Our rule.** Every complaint is acknowledged when it is logged and
resolved within 14 days, well inside the 30 the regulations allow; their
48 hours, 7 days and 30 days stay as the backstop (reg 40(3) to (5)).

**Behaviour.** Each complaint carries received-at, channel (oral or
written) and three clocks: 48 hours, 7 days, 30 days, counted in calendar
days from the customer's report. It is acknowledged on logging (T16), not
by day 7, and worked to a target of 14 days inside the 30 (owner,
2026-10-12, FS-764); warnings at day 12, for the target, and day 25, and
an overdue event on any breach; the 7-day clock stays as the backstop if
the acknowledgement was not delivered. The record holds
40(6)'s fields: date, nature, status, reason pending, time to resolve,
outcome.

**Where enforced.** Complaints live in Odoo's service desk
(docs/operating-model.md); the service computes the clocks from desk
events, unless the desk's own service-level settings can carry them (to
confirm with the Odoo engineer).

### 2.9 Roan Capital's product under the cap — RC-26, RC-27

Roan Capital's 30-day product charges 1% a day default interest after day
30, with a ladder: reminder day 25, default run days 30 to 40, final
warning days 40 to 47, hard closure day 47 (days from disbursement).

**Our rule.** A lender's own collection ladder runs alongside the law,
never instead of it: the cap, the non-performing date and the notices
(§2.1, §2.5, §2.11) hold whatever day the ladder has reached (reg 29,
reg 57, reg 30(4)).

**The ladder** is a collection state the service moves by day, separate
from non-performing status. The day-25 reminder obeys working hours.
**A disputed amount holds it** (MF-39, FS-764): while a complaint about an
amount is open (§2.8), no reminder or ladder action is taken on that
amount; the hold is recorded on the loan and lifts when the complaint
closes. Whether interest accrues on it meanwhile is Roan open answer 23.
Hard closure stops new lending and opens recovery; the cap still runs,
and a vehicle sale still waits for its 30-day notice. Unless the
agreement sets a shorter default period, the loan becomes non-performing
on day 61, more than 30 days past the day-30 due date.

**Worked example** (illustrative: the penalty base, assumed here to be
outstanding principal, and the rate's unit are Roan open answers 3 and 4).
KES 100,000, 10% interest for the term, KES 2,000 fee deducted; nothing
repaid.

| Day | Event | Principal | Bucket | Room |
|---|---|---|---|---|
| 30 | Due: 110,000 unpaid | 100,000 | — | — |
| 31 to 60 | Default interest, 1,000 a day | 100,000 | — | — |
| 61 | Non-performing: `P_npl` 100,000; bucket opens at 10,000 + 30,000 | 100,000 | 40,000 | 60,000 |
| 120 | Bucket reaches the cap | 100,000 | 100,000 | 0 |
| 121 on | Nothing more accrues | 100,000 | 100,000 | 0 |

The most recoverable: 100,000 + 100,000 + reasonable recovery expenses
with receipts (say 7,500 for towing and storage) = **KES 207,500**.
Uncapped, by day 180 it would be KES 260,000 plus expenses. Had the
agreement made the loan non-performing on day 48, the bucket would open
at 27,000 and still reach 100,000 on day 120: with nothing repaid, the
date matters only through the principal.

**With a part payment.** KES 30,000 paid on day 70 goes wholly to
principal (reg 56): principal 70,000, `P_npl` still 100,000. The bucket
is 49,000 at the end of day 69; default interest drops to 700 a day; the
bucket reaches 100,000 on day 142, when 600 is posted instead of 700. If
29(5)'s "outstanding principal amount" means current principal, the limit
is 70,000, reached on day 99 (open question 1).

**Reset.** A longer loan becomes non-performing at principal 100,000
(cap 100,000), clears its arrears, then falls back at principal 60,000:
the new episode's cap is 60,000.

### 2.10 Charges the borrower did not cause — reg 56, MF-22, MF-39

**Regulation.** A repayment is credited on the date it is paid (56(1));
fairness forbids charging a customer for the lender's own failure (41).

**Our rule.** A borrower never pays for a delay they did not cause: a
payment counts from when the money moved, and a charge our outage or a
rail's caused is waived, without changing the days past due (reg 56(1)).
Charging for our own failure would be an unfair practice: our reading of
reg 41(1)(a).

**Behaviour** (FS-799, FS-802):

1. **Paid, but processed late** (our outage, a callback lost, a payment
   held in the paybill or at the bank): posted with the date the money
   arrived, from the rail's own record. The loan is re-run from that date,
   and any default interest, fee or ladder step the gap caused is reversed
   in the same run, automatically, since the evidence is the rail's own
   record (recon §4.7). The borrower is told (messaging T48).
2. **Could not pay, because a rail was down** (M-Pesa or a bank, or
   planned work on one): a **disruption window** is declared with the
   incident: its cause, the channels, the start and end, approved by two
   people (incident management §5). For any loan falling due, or due a
   charge or a ladder step, inside the window, the charges for the window
   are waived under the **standing waiver** the institution approved once
   at onboarding (OB-MF-09), not loan by loan; reminders and the ladder
   hold until the window closes. The borrower is told (T48).
3. **Classification stays honest:** reg 57's days past due are not
   altered by a window; the charges are waived, not the clock.
4. **Charges already paid** are refunded through the institution's
   approval chain, since that moves money.
5. **Recon's companion reads the windows too,** so a charge either rule
   missed is a break.
6. **When the cause was Dibon's,** the institution's lost income is
   settled under the service agreement's service credits (FS-748).

### 2.11 Recovery of movable collateral — reg 30(4), MF-03

**Regulation.** On default, the secured creditor serves a written notice
stating the default, the amount, the time by which to pay, what follows,
and the right to apply to court (MPSR Act s.67(1), (2)); unpaid by then,
it may take possession or sell (MPSR Act s.67(3)). Possession needs no
court where the security agreement consents, or where whoever holds the
vehicle does not object (MPSR Act s.71(1)). A notice of the sale goes to
the grantor, the debtor and every other secured creditor with a
registered notice (MPSR Act s.73(1)): five working days ahead under the
Act (MPSR Act s.73(2)), thirty days for a lender under these regulations
(30(4)). Until the sale, the borrower may redeem by paying in full with
the reasonable cost of enforcement (MPSR Act s.69). Proceeds go to those
costs, then the debt; the borrower stays liable for a shortfall (MPSR Act
s.74). Collection conduct holds throughout: no violence or intimidation,
no essential personal effects, the Auctioneers Act's procedures (30(1)(j)
to (l)), through a licensed auctioneer (Auctioneers Act s.9, s.23). The
Auctioneers Rules apply to a repossession under a letter of instruction
(Auctioneers Rules r.5): seven days' notice to redeem before removal
(Auctioneers Rules r.12(1)(c), (d)); an advertisement in a newspaper
within seven days of removal, and the sale seven to fourteen days after
it (Auctioneers Rules r.12(1)(f), r.16(2)), between 10.00 and 18.00
at a public venue (Auctioneers Rules r.17(1)); before the sale, the
borrower may ask a court for an independent valuation (Auctioneers Rules
r.10); proceeds less charges reach the lender within fifteen days
(Auctioneers Rules r.18(4)). A
vehicle on hire purchase follows the Hire-Purchase Act instead (MPSR Act
s.65(4)): two-thirds paid, possession only by a court (Hire-Purchase Act
s.15).

**Our rule.** A vehicle is sold no sooner than every notice allows, the
latest deciding: the default notice's time to pay, 30 days after the
sale notice, and the auctioneer's own steps; repossessed only through a
licensed auctioneer, on consent or no objection, and never, on hire
purchase past two-thirds, without a court (reg 30(4); MPSR Act s.67,
s.71; Auctioneers Rules r.12; Hire-Purchase Act s.15). We count calendar
days from delivery, and schedule the Rules' steps back from the sale
date (LQ-17, LQ-18).

**No minimum or maximum wait.** The right to recover arises on default
(MPSR Act s.65(1)), not on non-performing classification (§2.5). What
limits waiting is the registry notice's period (MPSR Act s.30), the
arrears cap (§2.1), and twelve years to recover a secured principal
(Limitation of Actions Act s.19).

**Behaviour.** A recovery case per secured loan, its steps in order,
each with its evidence in the collateral record (MF-03, MF-04):

1. **Default notice:** from the agreement, with the amount, the cure
   date (the product's cure period; 14 days proposed) and what MPSR Act
   s.67(2) requires; its delivery recorded.
2. **Sale notice and instruction:** after the cure date passes unpaid,
   the sale notice to the borrower, the debtor and every secured creditor
   the registry search shows, and the letter of instruction to a licensed
   auctioneer. The sale date is set first: no earlier than 30 days after
   the notice's delivery (LQ-17, LQ-18).
3. **Proclamation and possession:** the auctioneer's inventory and the
   seven-day notice to redeem; removal only after it expires; who, where,
   the basis (the agreement's consent, or no objection) and the
   auctioneer recorded. A hire-purchase product with two-thirds paid
   needs a recorded court order.
4. **Advertisement and sale:** the advertisement within seven days of
   removal and seven to fourteen days before the sale date; the auction
   between 10.00 and 18.00. The service schedules back from the sale
   date and refuses a step out of order or out of its window. Payment in
   full with the recorded enforcement costs, at any point before the
   sale, closes the case and releases the vehicle instead.
5. **Proceeds:** applied in MPSR Act s.74's order and within the cap
   (§2.1); the registry notice cancelled within ten working days of
   settlement (MPSR Act s.33).

For a 30-day loan due on day 30 with a 14-day cure: in default on day 31;
the sale notice and the proclamation on day 45; the redemption notice
runs to day 52; the advertisement between day 61 and day 68; removal no
more than seven days before it, so from day 54; the sale on day 75 at the
earliest. The auctioneer's charges are recovery costs, within the
cap (§2.1).

**Where enforced.** The lender-rules service holds the case and its
dates; the collateral record keeps the evidence; messaging sends the
notices under §2.6's checks.

## 3 · Interfaces

**Endpoints** (lender-rules service, internal):

| Endpoint | Purpose |
|---|---|
| `GET /loans/{id}/cap` | Episode: `P_npl`, bucket, room |
| `POST /loans/{id}/charges:check` | Amount of a charge allowed |
| `GET /loans/{id}/payoff?date=` | Early repayment quote |
| `GET /loans/{id}/classification` | Days past due, status, ladder state |
| `GET /products/{id}/versions/{v}/apr` | APR and total cost of credit |
| `GET /products/{id}/versions/{v}/kid` | Key information document |
| `POST /product-changes`, `.../{id}/cbk-approval` | Product version, CBK approval |
| `POST /loans/{id}/variations`, `.../acceptance` | Variation notice, acceptance |
| `GET /policies/collection-messaging` | Working hours, recipients, template rules |
| `POST /complaints/events` | Desk events in, clocks out |

**Kafka events** (CloudEvents, signed per RO-23; names from the event bus
catalogue, event-bus-kafka §5): `kapu.mfi.loan.nonperforming`,
`kapu.mfi.loan.performing`, `kapu.mfi.loan.cap.reached`,
`kapu.mfi.loan.charge.waived`, `kapu.mfi.repayment.allocated`,
`kapu.mfi.repayment.allocation.mismatch`, `kapu.mfi.loan.ladder.changed`,
`kapu.mfi.product.version.activated`, `kapu.mfi.loan.variation.accepted`,
`kapu.messaging.message.blocked` (published by messaging), `kapu.mfi.complaint.pending`, `kapu.mfi.complaint.overdue`.

**End of day** (KC-07), Africa/Nairobi, run by the end-of-day runner after
its checks (end-of-day-runner):

1. Close the day's intake: post repayments dated today; ask M-Pesa Pull
   Transactions (RL-20) for missed confirmations.
2. Fineract's close of business (kapu-core-fineract §7). Its
   overdue-penalty step is not used for capped products.
3. Classification: open or close cap episodes; emit events.
4. Default interest posted by the service, capped at room.
5. Cap sweep: waive any excess over `P_npl` the same day.
6. Ladder states moved; reminders queued for the next working window.
7. Fineract accounting close; snapshots for MF-14 and MF-15;
   reconciliation (RO-02).

A failure stops the later steps for the loans affected and raises an
exception to the accountant's queue (MF-12).

## 4 · Security and audit

- **Its own service account,** which may post only waivers and default
  interest, and read loans (kapu-core-fineract §4).
- **Rule parameters are configuration under maker-checker,**
  effective-dated: rates, the cap's components, working hours, banned
  terms. A pricing change cannot activate without CBK's approval recorded
  (MF-24).
- **Every waiver, default-interest posting and change of classification**
  is a signed event carrying the rule version that produced it (RO-23).
- **No one overrides the cap.** A court-ordered exception is a flag and a
  manual step, approved and recorded.

## 5 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| Cap episodes, classifications, collection stages | Confidential | Seven years after the loan closes (docs/documents.md) | A borrower's repayment conduct (docs/privacy.md) |
| Product versions, CBK approvals, variation notices and acceptances | Confidential | Seven years after the product or loan ends | Acceptances are the borrower's |
| Complaints clocks | Confidential | With the complaint | The complainant's |

## 6 · Quality and metrics

- **Within the night's close:** its steps for 10,000 loans in under 15
  minutes (proposed).
- **The same answer every time:** each result reproducible from the rule
  version and its inputs. The worked examples in §2 and the tests in this
  spec become machine-readable test vectors, kept with the code, that the
  code must pass; allocation and the cap are also tested with generated
  cases (property-based tests).
- **Metrics:** loans by classification and stage; cap episodes open;
  amounts waived; allocation mismatches; messages blocked.
- **Alerts** (observability-grafana §4): an allocation mismatch (2); a
  failed step of the close (end-of-day-runner §6).

## 7 · Threats

| Threat | For example | The answer |
|---|---|---|
| Tampering | A rate or the cap's parameters changed quietly | Maker-checker, effective-dating, CBK's approval recorded; the rule version on every result |
| Repudiation | A borrower disputes a charge | Each posting carries its rule version and inputs; the statement shows what was waived |
| Information disclosure | A collection message reaches a borrower's contact | Recipient rules in messaging; a blocked event (§2.6) |
| Elevation of privilege | Staff waive to favour a borrower | Waivers only by rule, or through an approved request |
| A wrong rule | A defect charges past the cap | Test vectors, generated tests, the same-day sweep, reconciliation |
| Purpose (privacy) | A classification used for something else | Used for the regulation's purposes; decisioning reads it only under its own privacy row (PR-18) |

## 8 · Acceptance tests

| # | Given | When | Then | Id, reg |
|---|---|---|---|---|
| A1 | The worked example in 2.9 | End of day 61 | Episode opens: `P_npl` 100,000, bucket 40,000 before the day's default interest | MF-21, 29(2) |
| A2 | Bucket at 99,500 | Default interest of 1,000 due | 500 posted; cap-reached event | MF-21, 29(2)(b) |
| A3 | Loan at the cap | Recovery expense with receipt and approval | Posted outside the bucket | MF-21, 29(2)(c) |
| A4 | Cured, then non-performing at principal 60,000 | Classification | New episode, cap 60,000 | MF-21, 29(3) |
| A5 | Due: principal 5,000, fees 500, interest 1,000 | 5,200 paid | 5,000 principal, 200 fees, 0 interest | MF-22, 56(2) |
| A6 | Paid 23:40 on day 30 | Posted 06:00 day 31 | Dated day 30; no default interest | MF-22, 56(1) |
| A7 | 30-day flat loan | Repaid in full on day 10 | Interest to day 10 only; no fee | MF-22, 56(3), (4) |
| A8 | The product in 2.3 | APR computed | 307.7% | MF-23, 59(2)(g) |
| A9 | A product version | Document generated | Every item in 2.3; acceptance before disbursement | MF-23, 48 |
| A10 | New version, no CBK approval | Activation | Refused | MF-24, 55(1) |
| A11 | Variation notice delivered day 0 | Accepted day 5 | Effective day 30 | MF-24, 55(2) |
| A12 | 30-day loan due day 30, unpaid | Days 60 and 61 | Performing, then non-performing | MF-25, 57(1)(a) |
| A13 | 6-month loan | 90, then 91 days past due | Performing, then non-performing | MF-25, 57(1)(b) |
| A14 | Collection reminder at 19:30 | Messaging processes it | Held to 08:00 next working day | MF-26, 30(1)(i) |
| A15 | Collection template to an alternative contact | Send | Refused; blocked event | MF-26, 30(1)(c), (e) |
| A16 | Template with a banned term | Approval | Refused | MF-26, 30(1)(b) |
| A17 | Written complaint, unresolved | Day 7 with no acknowledgement | Overdue event | MF-28, 40(3) |
| A18 | Oral complaint | 48 hours unresolved | Pending event; written confirmation sent (messaging T41) | MF-28, 40(4) |
| A19 | Complaint logged | Day 12 with no outcome | Target warning to the handler | MF-28 (FS-764) |
| A20 | KES 5,000 of the day-30 amount disputed in an open complaint | Day 30 default run | No default-run message or action on the KES 5,000; the rest proceeds; the hold recorded | MF-39, MF-28 |
| A21 | Paid at 14:00 on day 30; our platform down until day 31 | Posted on day 31 | Dated day 30; no default interest; the loan re-run; T48 sent | MF-22, 56(1); §2.10 |
| A22 | A disruption window over M-Pesa, days 30 to 31 | A loan due on day 30 is paid on day 32 | Default interest for days 31 and 32 waived under the standing waiver; classification counts from day 30 | §2.10 |
| A23 | A version whose rate unit is missing | Submitted | Refused: the vocabulary requires it | §2.4 |
| A24 | A version the companion cannot compute | Activation | Refused | §2.4; recon §3.1 |
| A25 | A version with a minimum interest period, or any charge, on early repayment | Submitted | Refused as a never-term, naming it | §2.4; 56(3), (4) |
| A26 | A version with a KES 500 fee | Its key information document is generated | The fee shown with its excise duty of KES 100, inside the total cost of credit; no excise on interest or insurance premiums | §2.4; MF-23 |
| A27 | A version with rates by risk class | Published | The page shows the range; each borrower's key information document shows their own rate | §2.4; 59(2)(c) |
| A28 | A 30-day loan due day 30; a 14-day cure | Proclamation recorded on day 40 | Refused: the cure date, day 45, has not passed | §2.11; MPSR Act s.67(3) |
| A29 | Sale notice delivered on day 45 | Sale on day 70 | Refused; allowed from day 75 | §2.11; 30(4) |
| A30 | A second secured creditor in the registry search | Sale notice | Sent to them too; the sale waits for its delivery | §2.11; MPSR Act s.73(1) |
| A31 | Payment in full with enforcement costs on day 74 | Sale | Case closed; vehicle released; no sale | §2.11; MPSR Act s.69 |
| A32 | A hire-purchase product, two-thirds paid | Possession, no court order | Refused | §2.11; Hire-Purchase Act s.15 |
| A33 | Proclamation on day 45 | Removal on day 50 | Refused: the redemption notice runs to day 52 | §2.11; Auctioneers Rules r.12(1)(c) |
| A34 | Sale date day 75 | Removal scheduled for day 52 | Refused: the advertisement must fall within seven days of removal and 7 to 14 days before the sale (day 61 to 68), so removal from day 54 | §2.11; Auctioneers Rules r.12(1)(f) |
| A35 | An auction set for 19:00 | Scheduled | Refused: auctions run 10.00 to 18.00 | §2.11; Auctioneers Rules r.17(1) |

## 9 · Open questions

**For counsel** (docs/legal-questions.md, with what is designed
meanwhile):

1. What counts within reg 29's cap, and on which principal: LQ-01.
2. Whether the cap carries over a rollover or restructure: LQ-02.
3. The effective annual rate as the APR; insurance as a third-party
   cost: LQ-03.
4. Reg 57's thirty days, counted from the due date: LQ-04.
5. Reg 30's working hours: LQ-05.

**For Roan Capital:**

6. The interest rate's unit and the base of the 1% a day (open answers 3
   and 4).
7. The default period its agreement states (reg 57(3)), and what hard
   closure on day 47 does to the loan.
8. Its pricing model and CBK's approval of current pricing (regs 55, 59),
   and the licence it lends under (open answer 2).
9. The recovery expenses it charges, and where its contract discloses
   them.

**Recovering collateral (§2.11, FS-899):**

10. For counsel: reg 30(4)'s thirty days, how counted and against the
    Act's notices: LQ-17.
11. For counsel: whether the Auctioneers Rules apply to a repossession
    under the MPSR Act, and how their windows sit with reg 30(4) (LR-03): LQ-18.
12. For counsel: whether a logbook loan is hire purchase: LQ-19.
13. For Roan Capital: the cure period its default notice gives; whether
    its agreements consent to repossession; and whether any vehicle loan
    is hire purchase.

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](../law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 25 | reg 25(2)(f), reg 25(2)(s) | A written credit policy, consistent with the law, stating among other things the cooling-off period (25(2)(f)) and how the borrower's ability to repay is determined (25(2)(s)) |
| reg 28 | reg 28(1)(b), reg 28(1)(c) | Applications considered under the credit policy, ability to repay assessed and no reckless lending (28(1)); a refusal given at once, with reasons (28(2)); a loan may be restructured on the borrower's request or with prior notice (28(3)) |
| reg 29 | reg 29, reg 29(2), reg 29(3), reg 29(4) | What can be recovered on a non-performing loan is capped at the principal then owing, interest up to that principal, and reasonable recovery costs; the cap is measured from the last time the loan became non-performing (29(3)); interest under a court order after the order is outside it (29(4)) |
| reg 30 | reg 30, reg 30(1), reg 30(2), reg 30(3), reg 30(4) | No harassing, shaming or threatening collection: nothing posted to shame a borrower (30(1)(d)), no messages to their contacts (30(1)(e)), no calls outside working hours, no taking of essential personal effects (30(1)(k)); no charges not disclosed in the contract (30(2)); land security recovered under the Land Act (30(3)); thirty days' notice before selling movable security (30(4)) |
| reg 33 | reg 33, reg 33(3), reg 33(6), reg 33(7) | Customers' credit information shared with licensed credit reference bureaus, timely, complete and accurate; no negative listing for an amount of one thousand shillings or less (33(3)) |
| reg 39 | reg 39(1), reg 39(3) | A receipt for every transaction, a free loan statement on request and a way to see it at any time (39(1)); errors corrected promptly (39(2)); a guarantor kept informed through periodic statements (39(3)) |
| reg 40 | reg 40, reg 40(3), reg 40(5) | A complaints mechanism made known to customers; acknowledgement within seven days where a complaint cannot be dealt with promptly; an oral complaint unresolved after forty-eight hours confirmed in writing; resolution within thirty days |
| reg 41 | reg 41(1)(a) | No unfair, deceptive, oppressive or aggressive practices, among them threatening, intimidating, abusing, ignoring or humiliating a customer (41(1)(a)); no bribes (41(1)(b)); no recruiting other borrowers to earn a benefit (41(1)(c)); no discrimination (41(1)(d)); no misleading or misadvising (41(1)(e)); no reckless or negligent lending (41(1)(f)); no product a customer must buy to get the one they want (41(2)) |
| reg 42 | reg 42 | A guarantor's consent sought and obtained before the appointment; recourse to a guarantor only after non-judicial recovery from the borrower is exhausted, and after fourteen days' notice of the default |
| reg 47 | reg 47(1)(d), reg 47(2) | Product information fair, clear and current, and easily available at branches, websites and every channel (47(1)(d)); the lender says it is regulated by the Central Bank, and shows its company name |
| reg 48 | reg 48 | A key information document for each product: its benefits, risks, terms and conditions, in summary |
| reg 49 | reg 49 | A business or trade name used in place of the company name is accompanied, conspicuously, by the company name |
| reg 54 | reg 54(7), reg 54(8) | At signing, the customer receives the agreement, the repayment schedule and the total cost of credit; the agreement states the loan, charges, rates, the APR, early repayment without charge (54(4)(h)) and more (54(4)); a variation needs thirty days' notice and the borrower's acceptance (54(7)) |
| reg 55 | reg 55 | Pricing parameters and credit terms change only with the Central Bank's prior written approval, after thirty days' notice to the customer and the customer's acceptance |
| reg 56 | reg 56, reg 56(1), reg 56(3), reg 56(4) | A repayment credited on the day it is paid, applied to due principal, then fees and charges, then interest; early repayment, in whole or part, without notice or penalty (56(3)), and no interest for the remaining term on full early repayment (56(4)) |
| reg 57 | reg 57, reg 57(1), reg 57(3) | A loan is non-performing when principal or interest is outstanding thirty days past due, for a loan of thirty days or less, or ninety days, for a longer one (57(1)); the credit policy (57(2)) and each loan agreement (57(3)) state the default period |
| reg 59 | reg 59, reg 59(2)(a), reg 59(2)(c), reg 59(2)(e), reg 59(2)(f) | A pricing model with clear parameters: its components and costs justified, rates that may vary with the borrower's creditworthiness (59(2)(c)), the criteria for non-performance, credit bureau scores, all-inclusive pricing except third-party costs (59(2)(f)), and the APR disclosed |
| reg 60 | reg 60 | Where artificial intelligence makes lending decisions: decisions explained, customers told they are dealing with a machine, human oversight kept, bias assessed, models robust and explainable, data protected |

**[LR-23](../law/LR-23.md) The Movable Property Security Rights Act (Cap. 499A).** Regulator: The Registrar of security rights, who keeps the collateral registry. Made under: An Act of Parliament. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2017/13/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 30 | s. 30 | A registered notice is effective for the period the registrant states, at most ten years; it can be extended only within the six months before it expires, by an amendment notice |
| s. 33 | s. 33 | The secured creditor registers an amendment or cancellation notice where a notice exceeds what the grantor authorised, collateral is released, or the security right is extinguished; free of charge, and within ten working days of the grantor's request, or the grantor may go to the Registrar |
| s. 65 | s. 65(1), s. 65(4) | After the debtor fails to pay or perform, the secured creditor may use the rights in this Part, the security agreement or any other law (65(1)); the grantor's rights in this Part cannot be waived or varied before default (65(3)); under a hire-purchase agreement, only as the Hire-Purchase Act allows (65(4)) |
| s. 67 | s. 67, s. 67(1), s. 67(2), s. 67(3) | On default, a written notice to the grantor to pay or perform, stating the default, the amount and the time by which to pay, what follows if not, and the right to apply to court (67(1), (2)); if not met in that time, the secured creditor may sue, appoint a receiver, lease, take possession or sell (67(3)) |
| s. 69 | s. 69 | Anyone affected may redeem the collateral by paying the secured obligation in full with the reasonable cost of enforcement, until it is sold or otherwise disposed of |
| s. 71 | s. 71, s. 71(1) | Possession without a court where the security agreement consents to it, or where whoever holds the collateral does not object when it is taken (71(1)); the collateral may be made unusable and sold where it is (71(2)) |
| s. 73 | s. 73(1), s. 73(2) | A notice of the intended disposition to the grantor, the debtor and any other secured creditor with a registered notice (73(1)), at least five working days before the sale, describing the collateral, the amount owing with an estimate of enforcement costs, the manner and the date (73(2)); not needed where the collateral may perish within ten working days (73(5)) |
| s. 74 | s. 74 | Proceeds go first to the reasonable cost of repossessing, holding, preparing and selling, then to the secured obligation, then to a subordinate right that has asked (74(1)); the debtor remains liable for any shortfall (74(4)) |

**[LR-32](../law/LR-32.md) The Limitation of Actions Act (Cap. 22).** Regulator: None: the courts apply it. Made under: An Act of Parliament. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/1968/21/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 19 | s. 19 | A claim for a principal sum secured by a mortgage of land or movable property, or for the proceeds of selling land, brought within twelve years of the right accruing (19(1)) |

**[LR-41](../law/LR-41.md) The Auctioneers Act (Cap. 526).** Regulator: The Auctioneers Licensing Board, which licenses auctioneers and hears complaints against them. Made under: An Act of Parliament. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/1996/5/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 9 | s. 9 | No one carries on business as an auctioneer in Kenya without a licence from the Board (9(1)); doing so is an offence (9(2)) |
| s. 23 | s. 23 | An auctioneer acts as an officer of the court (23(a)) and under the prescribed rules when repossessing, attaching, storing or selling property under any law or contract (23(b)) |

**[LR-42](../law/LR-42.md) The Hire-Purchase Act (Cap. 507).** Regulator: None: the courts apply it. Made under: An Act of Parliament. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/1968/42/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 15 | s. 15 | Once two-thirds of the hire-purchase price is paid, the owner may recover the goods only by suit (15(1)); taking them otherwise ends the agreement, releases the hirer and lets the hirer and any guarantor recover all they paid (15(2)) |

**[LR-43](../law/LR-43.md) The Auctioneers Rules, Legal Notice No. 120 of 1997.** Regulator: The Auctioneers Licensing Board; a court where it directs otherwise. Made under: The Auctioneers Act (Cap. 526), s. 30. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/1997/120/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| r. 5 | r. 5 | Part III, on attaching and selling property, applies to repossession under a third party's letter of instruction, unless another written law provides otherwise or a court directs (5(1)); the letter is in Sale Form 1 (5(2)) |
| r. 10 | r. 10 | Before the sale, the debtor may ask a court for an independent valuation |
| r. 12 | r. 12, r. 12(1)(c), r. 12(1)(d), r. 12(1)(f) | For movables other than perishables and livestock: the instruction recorded (12(1)(a)); a proclamation listing each item's value and condition, signed by the owner or an adult at the premises (12(1)(b)); seven days' written notice in Sale Form 3 to redeem by paying the amount (12(1)(c)); only then removal to safe premises (12(1)(d), (g)); an advertisement within seven days of removal, and the sale at least seven and at most fourteen days after the first newspaper advertisement (12(1)(f)) |
| r. 16 | r. 16(2) | The advertisement gives the date, time and place, the conditions of sale, when to view, a description of the goods and whether there is a reserve price (16(1)); in a newspaper, unless a court orders otherwise (16(2)) |
| r. 17 | r. 17(1) | Goods repossessed under a contract or law are auctioned between 10.00 a.m. and 6.00 p.m. (17(1)(a)), at a venue open to the public (17(1)(c)); the highest bidder buys, on the conditions of sale (17(4)) |
| r. 18 | r. 18(4) | The auctioneer pays the proceeds, less charges, to the instructing party with an itemised account within fifteen days of selling movables (18(4)) |
