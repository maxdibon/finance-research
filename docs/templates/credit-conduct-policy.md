---
id: credit-conduct-policy
name: Credit, code of ethics and market conduct policy — template for an institution's licence application to CBK
kind: guide
status: living
law: LR-03
released: unreleased
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-1080, FS-1082, FS-1083, FS-1087, FS-1100]
last_reviewed: 2026-11-05
---

# Credit, code of ethics and market conduct policy · template DC-FS-TM-CRD-005

The credit, code of ethics and market conduct policy CBK asks of a
lender applying for its licence (the [licence pack](cbk-licence-pack.md),
item iii; FS-1080). The lender regulations require a written credit
policy, with among other things its cooling-off period and how a
borrower's ability to repay is determined (reg 25), and its default
period (reg 57). What the platform enforces comes from
[lender-rules](../specs/lender-rules.md). The policy is the
institution's own, in its look. Built with `tools/policies/build.js`.

**Its definitions** of default, non-performing, grace period and
moratorium are proposed here (FS-1083), and its cooling-off period is
the institution's choice once CBK's rules are confirmed (FS-1082).

| Value | What it is | Roan Capital's, for example |
|---|---|---|
| `institution`, `institution_legal`, `version`, `date`, `classification`, `owner`, `approved_by` | As in the ICT policy template | |
| `products` | Its products, in a sentence | A 30-day business loan, a logbook loan, a land-secured loan |
| `who_may_borrow` | Who it lends to | Individuals and businesses in Kenya with the documents each product lists |
| `ability_to_repay` | How it assesses it | Statements, cash flow, history |
| `collateral` | What secures its loans | Up to 50% of a vehicle's sale value, its logbook jointly registered |
| `committee`, `threshold` | Who approves, and above what the chief executive signs | Three members; KES 500,000 |
| `turnaround` | Its service standard | Within 6 hours for a new borrower |
| `cooling_off` | Its cooling-off period | To confirm (FS-1082) |
| `cure_period`, `grace_period` | Days before default, and before late charges | To confirm |
| `complaints` | How customers complain | To confirm |

<!-- document -->
# Credit, Code of Ethics and Market Conduct Policy

| Document control | |
|---|---|
| Document number | {{number}} |
| Version | {{version}}, draft for review, {{date}} |
| Classification | {{classification}} |
| Owner | {{owner}}, {{institution_legal}} |
| Approved by | {{approved_by}} |
| Review | At least once a year, and whenever the law or a product changes |

## 1. Purpose and scope

This policy sets how {{institution}} lends, how its people behave, and how it treats its customers, as the Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026 require (reg 25). It applies to every product, channel, member of staff, agent and service provider acting for {{institution}}. {{institution}} offers {{products}}.

## Part A. Credit policy

### A.1 Who may borrow

{{who_may_borrow}}. {{institution}} does not discriminate on any ground the law forbids (reg 41).

### A.2 Ability to repay

Every application is considered under this policy, and the borrower's ability to repay is assessed before any loan is made; {{institution}} does not lend recklessly (reg 28). The assessment: {{ability_to_repay}}. A refusal is given at once, with its reasons.

### A.3 Security and limits

{{collateral}}. Limits are set per borrower and per product, and grow only with the borrower's repayment record and the security held. Every manual step on a security (searches, registration, valuation, insurance, release) is recorded with its evidence.

### A.4 Approval

No one approves a loan they originated, or completes the checks on their own file. Applications are approved by the authority their product and amount require: a committee of {{committee}}, and above {{threshold}} the chief executive as well. Every decision is recorded with who decided, when and why, and approvers authenticate again at each decision. When an approver is away, the request is escalated to their named deputy, never decided by the originator.

### A.5 Pricing and disclosure

- Every product's price follows a pricing model with clear parameters, approved by the Central Bank of Kenya before use; prices and terms change only with its approval (reg 59, reg 55).
- Before contracting, the customer is told they are free not to take the loan, and receives the key information document for the product: its benefits, risks, charges and the total cost of credit, with the annual percentage rate (reg 38, reg 48). At signing, the customer receives the agreement and its repayment schedule (reg 54).
- Every charge is disclosed and itemised; no charge not in the agreement is ever made; recovery expenses only those absolutely necessary, each itemised (reg 43).

### A.6 Cooling-off period

{{cooling_off}}

### A.7 Repayment, early settlement and restructuring

- A repayment is credited on the day it is paid and applied in the order the regulations set (reg 56); a receipt for every transaction, and a free statement on request (reg 39).
- A borrower may settle early at any time, without penalty and without interest for the time left to run.
- A loan may be restructured at the borrower's request, or with prior notice to them (reg 28); every restructuring is recorded with its reason and approved like a new loan.
- Guarantors give their consent before they are appointed, are told what they guarantee, and receive statements (reg 42).

### A.8 Definitions

| Term | Meaning in this policy |
|---|---|
| Due date | The date an instalment falls due under the agreement |
| Grace period | {{grace_period}} after a due date, during which a payment is treated as made on time and no late charge accrues |
| Default | An instalment not paid in full by the end of the grace period, which remains unpaid at the end of {{cure_period}} after a written notice stating the amount, the date by which to pay and what follows |
| Non-performing loan | A loan whose principal or interest is outstanding thirty days past due, for a loan of thirty days or less, or ninety days past due, for a longer one (reg 57) |
| Moratorium | A period, agreed in writing at the borrower's request or offered by {{institution}}, during which repayments are suspended or reduced; recorded as a restructuring, its terms and cost disclosed before it starts |
| Arrears cap | What can be recovered on a non-performing loan: no more than the principal owing at the time it became non-performing, interest and charges included (reg 29) |

### A.9 Arrears and collection

- Arrears are managed by a ladder of reminders, calls and notices, each step dated and recorded, within working hours.
- Collection is never harassing, shaming or threatening: nothing posted to shame a borrower, no messages to their contacts, no calls outside working hours, no taking of essential personal effects (reg 30).
- Security is recovered only as the law allows: movable property under the Movable Property Security Rights Act, after the notices it and the regulations require, through a licensed auctioneer; land under the Land Act.
- What is recovered on a non-performing loan never exceeds the arrears cap (reg 29).

### A.10 Credit information and write-off

Credit information on every borrower is shared with licensed credit reference bureaus as the regulations require, and the borrower is told before adverse information is shared (reg 33). A loan is written off only on the authority set by the board, recorded with its reason; recovery continues where the law allows.

## Part B. Code of ethics

- **Integrity:** staff act honestly, never misleading or misadvising a customer, and never offering or taking a bribe (reg 41).
- **Fair treatment:** no unfair, deceptive, oppressive or aggressive practice; no threatening, intimidating, abusing, ignoring or humiliating a customer; no product a customer must buy to get the one they want (reg 41).
- **Conflicts of interest:** a member of staff declares any interest in a loan, and takes no part in deciding a loan for themselves, a relative or a business in which they have an interest. The platform refuses a decision by a staff member who is the borrower, a guarantor or an officer of the borrowing business.
- **Confidentiality:** customers' information is used only for their business with {{institution}}, as its data protection policy sets.
- **Gifts:** none accepted that could influence a decision; any offered is declared.
- **Speaking up:** a member of staff who sees a breach of this code reports it to the chief executive or the board, and is protected from retaliation.

## Part C. Market conduct

- **Product information** is fair, clear and current, easily available before a customer applies, in English and Kiswahili where needed (reg 47).
- **Channels:** branches, websites, apps and digital platforms accessible to customers, with the Central Bank of Kenya given thirty days' notice before a new delivery channel (reg 37, reg 27); a business or trade name used only with the company name beside it (reg 49).
- **Marketing** only with the customer's separate consent, which they may withdraw at any time (reg 58).
- **Service:** applications decided {{turnaround}}; every customer may see their loan and its documents on their own pages.
- **Complaints:** a complaints mechanism made known to every customer: {{complaints}}. Complaints are acknowledged and resolved within the times the regulations set, and the customer told they may escalate to the Central Bank of Kenya (reg 40).
- **Records:** customers' personal and contact records are kept up to date (reg 45); customer due diligence is done before lending (reg 63), and the law on money laundering followed (reg 64).
- **Outsourcing:** services may be outsourced, but never the final decision to lend (reg 31).

## Part D. Compliance and review

The chief executive answers to the board for this policy. Breaches are recorded and reported to the board, and may lead to disciplinary action. The policy is reviewed at least once a year, and whenever the law or a product changes, and each version approved by the board.
<!-- end -->

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](../law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 25 | reg 25 | A written credit policy, consistent with the law, stating among other things the cooling-off period (25(2)(f)) and how the borrower's ability to repay is determined (25(2)(s)) |
| reg 27 | reg 27 | Thirty days' notice to the Central Bank before a new delivery channel rolls out, with the mobile money account, apps and bank accounts to be used; a way to opt out of marketing messages; channels that are available, safe, protected from fraud, easy to use and affordable |
| reg 28 | reg 28 | Applications considered under the credit policy, ability to repay assessed and no reckless lending (28(1)); a refusal given at once, with reasons (28(2)); a loan may be restructured on the borrower's request or with prior notice (28(3)) |
| reg 29 | reg 29 | What can be recovered on a non-performing loan is capped at the principal then owing, interest up to that principal, and reasonable recovery costs; the cap is measured from the last time the loan became non-performing (29(3)); interest under a court order after the order is outside it (29(4)) |
| reg 30 | reg 30 | No harassing, shaming or threatening collection: nothing posted to shame a borrower (30(1)(d)), no messages to their contacts (30(1)(e)), no calls outside working hours, no taking of essential personal effects (30(1)(k)); no charges not disclosed in the contract (30(2)); land security recovered under the Land Act (30(3)); thirty days' notice before selling movable security (30(4)) |
| reg 31 | reg 31 | Material services may be outsourced, but never the final decision to lend, management and control, the board's decisions, determining compliance with the law (31(1)(d)), or managing the loan book; the lender stays liable for its provider; the Central Bank told thirty days before, with the provider's background, owners and directors (31(3)); the contract gives the Central Bank oversight of, and access to, the provider's premises, books, records, systems and staff (31(5)) |
| reg 33 | reg 33 | Customers' credit information shared with licensed credit reference bureaus, timely, complete and accurate; no negative listing for an amount of one thousand shillings or less (33(3)) |
| reg 37 | reg 37 | Branches, websites, apps and digital platforms accessible to people with physical, visual, auditory and cognitive impairments, and staff trained to serve them |
| reg 38 | reg 38 | Before contracting, the customer is told they are free not to enter a contract that seems onerous or unsuitable, and of any difficulty their financial position may cause in performing it |
| reg 39 | reg 39 | A receipt for every transaction, a free loan statement on request and a way to see it at any time (39(1)); errors corrected promptly (39(2)); a guarantor kept informed through periodic statements (39(3)) |
| reg 40 | reg 40 | A complaints mechanism made known to customers; acknowledgement within seven days where a complaint cannot be dealt with promptly; an oral complaint unresolved after forty-eight hours confirmed in writing; resolution within thirty days |
| reg 41 | reg 41 | No unfair, deceptive, oppressive or aggressive practices, among them threatening, intimidating, abusing, ignoring or humiliating a customer (41(1)(a)); no bribes (41(1)(b)); no recruiting other borrowers to earn a benefit (41(1)(c)); no discrimination (41(1)(d)); no misleading or misadvising (41(1)(e)); no reckless or negligent lending (41(1)(f)); no product a customer must buy to get the one they want (41(2)) |
| reg 42 | reg 42 | A guarantor's consent sought and obtained before the appointment; recourse to a guarantor only after non-judicial recovery from the borrower is exhausted, and after fourteen days' notice of the default |
| reg 43 | reg 43 | Recovery expenses only those absolutely necessary, each itemised and justified to the borrower; a sale of a customer's or guarantor's property done transparently |
| reg 45 | reg 45 | Customers' personal and contact records updated from time to time, and at least every two years (45(a)); reliable services, channels and customer-facing staff |
| reg 47 | reg 47 | Product information fair, clear and current, and easily available at branches, websites and every channel (47(1)(d)); the lender says it is regulated by the Central Bank, and shows its company name |
| reg 48 | reg 48 | A key information document for each product: its benefits, risks, terms and conditions, in summary |
| reg 49 | reg 49 | A business or trade name used in place of the company name is accompanied, conspicuously, by the company name |
| reg 54 | reg 54 | At signing, the customer receives the agreement, the repayment schedule and the total cost of credit; the agreement states the loan, charges, rates, the APR, early repayment without charge (54(4)(h)) and more (54(4)); a variation needs thirty days' notice and the borrower's acceptance (54(7)) |
| reg 55 | reg 55 | Pricing parameters and credit terms change only with the Central Bank's prior written approval, after thirty days' notice to the customer and the customer's acceptance |
| reg 56 | reg 56 | A repayment credited on the day it is paid, applied to due principal, then fees and charges, then interest; early repayment, in whole or part, without notice or penalty (56(3)), and no interest for the remaining term on full early repayment (56(4)) |
| reg 57 | reg 57 | A loan is non-performing when principal or interest is outstanding thirty days past due, for a loan of thirty days or less, or ninety days, for a longer one (57(1)); the credit policy (57(2)) and each loan agreement (57(3)) state the default period |
| reg 58 | reg 58 | Personal data processed lawfully, fairly and transparently; consent express, specific, separately obtained on its own form, withdrawable and recorded; a privacy notice is not consent |
| reg 59 | reg 59 | A pricing model with clear parameters: its components and costs justified, rates that may vary with the borrower's creditworthiness (59(2)(c)), the criteria for non-performance, credit bureau scores, all-inclusive pricing except third-party costs (59(2)(f)), and the APR disclosed |
| reg 63 | reg 63 | Customer due diligence, identity verified from independent source documents; for a transaction not face to face, the identity document is that of the person actually transacting (63(2)); a guard against impersonation (63(3)) |
| reg 64 | reg 64 | Compliance with the Proceeds of Crime and Anti-Money Laundering Act and the Prevention of Terrorism Act, on pain of the Central Bank's penalties |
