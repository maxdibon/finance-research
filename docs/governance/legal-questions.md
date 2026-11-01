---
id: legal-questions
name: Legal questions — what we need counsel to answer, and what each answer changes
kind: register
status: living
law: LR-03
released: 2026.10.16
owner: Compliance and risk officer
classification: Internal
review_ids: [FS-400, FS-624, FS-673, FS-740, FS-742, FS-744, FS-762, FS-807, FS-814, FS-830, FS-899, FS-989, FS-1004, FS-1010, FS-1023, FS-1029, FS-1035, FS-1033, FS-1042, FS-1052, FS-1058, FS-1061, FS-1066]
last_reviewed: 2026-11-01
---

# Legal questions

**What this tracks:** every question we need a lawyer to answer, where it
came from, whose it is, and, once answered, what the answer changed in the
design (FS-742). A document that raises a question cites its LQ id here
instead of holding the question itself, so nothing is asked twice or
lost.

**Rules for this file:**

1. **Whose question it is** decides who pays for the answer: *Dibon* for
   our own position and our design; *Institutions* where the answer
   binds every lender we serve, which Dibon asks once and shares; *an
   institution* by name only where it is that institution's alone, and
   then it goes to its own counsel through its delivery map.
2. **Questions for an institution, not a lawyer,** stay in its delivery
   map's open answers (docs/customers/).
3. **Status:** *Open* (not yet asked), *With counsel* (asked, with the
   date), *Answered* (with the date and the answer's source).
4. **An answer is applied before the row closes:** the design changed,
   or confirmed, with the register row that did it.

**Counsel:** none engaged yet. Bowmans Kenya is the first choice
(partners PT-43, decision SD-12); the approach is drafted
(outreach/legal-partner-request.md).

## The register

| Id | Question | Raised in | Whose | Law | Status | Designed meanwhile | Refs |
|---|---|---|---|---|---|---|---|
| LQ-01 | Do fees and penalties count within the cap on interest owed on a non-performing loan, and does "outstanding principal amount" mean principal when the loan became non-performing, or principal now? | lender-rules §9 | Institutions | CBK lender regulations reg 29 (LR-03) | Open | Yes, they count; principal at non-performance | FS-400 |
| LQ-02 | On a rollover or restructure of a non-performing loan, does the cap carry over? | lender-rules §9 | Institutions | Reg 29 (LR-03) | Open | Yes, it carries over | FS-400 |
| LQ-03 | Is the effective annual rate acceptable to CBK as the APR, and is mandatory insurance a third-party cost? | lender-rules §9 | Institutions | Reg 59 (LR-03) | Open | The effective annual rate; insurance as a third-party cost | FS-400 |
| LQ-04 | Is a loan non-performing "after thirty days" counted from the due date? | lender-rules §9 | Institutions | Reg 57 (LR-03) | Open | Counted from the due date | FS-400 |
| LQ-05 | Are 08:00 to 18:00, Monday to Saturday, the "working hours" within which a borrower may be contacted about collection? | lender-rules §9 | Institutions | Reg 30 (LR-03) | Open | Those hours, held by quiet hours (MS-15) | FS-400 |
| LQ-06 | Does reg 54(7)'s thirty days' notice apply when the borrower asks for the restructure, delaying relief to a borrower in distress? And is the restructure itself governed by reg 28(3), which allows it on the borrower's request or with prior notice, rather than by reg 54(7), which governs any variation of a loan agreement? | JN-06 §4; lender-rules (FS-869) | Institutions | Regs 28(3), 54(7) (LR-03) | Open | The design waits the thirty days; Roan Capital told the reading is being confirmed, its counsel's view invited (FS-876) | FS-624, FS-869, FS-876 |
| LQ-07 | Must a guarantor consent to a restructure that raises or extends their exposure, and what happens to the guarantee if they will not? | JN-06 §4 | Institutions | Reg 42 (LR-03); the law of guarantees | Open | Consent asked; the restructure held without it | FS-624 |
| LQ-08 | Is an unplaced payment that cannot be returned held "in a fiduciary capacity" (abandoned after two years) or as a "credit memo" (five years)? Do the Act's regulations add anything? | JN-16 §5 | Institutions | Unclaimed Financial Assets Act ss.13, 14 (LR-38) | Open | Kept in suspense, reported in the morning report; the payer written to before any report | FS-673 |
| LQ-09 | Which of Dibon's services need CBK authorisation as a payment service provider today, and which would under the 2026 Bill? | compliance LC-06 | Dibon | National Payment System Act s.2; the NPS Bill, 2026 | Open | Money never passes through Dibon; we apply for our own authorisation (FS-031) | FS-031, FS-376 |
| LQ-10 | May a lender send borrowers reminders and offers on WhatsApp, under Meta's commerce rules for financial services and the lender regulations' contact rules? | FS-165 | Institutions | Reg 30 (LR-03); Meta's business policy | Open | WhatsApp left out of R1 until answered (FS-674); notices and links only | FS-165, FS-737 |
| LQ-11 | In the NDA with an institution: should the indemnity be capped, and should disputes go to arbitration rather than the courts? | The NDA's internal note (clients/, out of git) | Dibon | Contract | Open | Uncapped; the courts of Kenya | FS-740 |
| LQ-12 | May an identity vendor supply credit-bureau reports, under its own bureau subscription, to a lender through our platform; and may it resell national-register lookups under its own access agreement? | partners PT-53 (FS-762) | Institutions | CRB Regulations 2020 reg 2 (LR-06); the register's access terms; Data Protection Act s.25 | Open | Bureau reports only through the institution's own subscription (crb CR-01); register lookups through our own connection (PT-29), or a vendor that shows its access agreement (FS-202) | FS-202, FS-447, FS-762 |
| LQ-13 | May a lender charge a minimum number of days' interest when a loan is repaid early (the prototype's 14 days), given reg 56(3) and (4): early repayment without penalty, and no interest for the remaining term? | FS-807 | Institutions | CBK lender regulations reg 56 (LR-03) | Open | No: the vocabulary cannot express it, and interest is charged only to the repayment date | FS-807 |
| LQ-14 | Do a non-deposit-taking lender's fees attract excise duty at 20%, as fees of a digital lender or of a financial institution under the Excise Duty Act; and must the duty be shown on top of each fee in the key information document? | product-versions (FS-814) | Institutions | Excise Duty Act, First Schedule, Part II, paragraphs 4 and 6 | Open | Yes: 20% on every fee, never on interest or insurance premiums, shown with each fee and in the total cost of credit | FS-814 |
| LQ-15 | What is the "cooling off period" a credit policy must state (reg 25(2)(f)): a time after signing in which a borrower may withdraw without charge, a wait before a new loan, or either as the lender defines it; and does the Consumer Protection Act, which reg 25(1) names, set one? | product-versions (FS-830) | Institutions | CBK NDTCP Regulations 2026 reg 25(2)(f) (LR-03); Consumer Protection Act (not yet in the law register) | Open | The lender defines it in its credit policy; we ask each institution which it means and how long | FS-830 |
| LQ-16 | Which regulation sets how often a guarantor receives statements: reg 47(2), as Roan Capital's product document cites, when reg 47 has no paragraph (2); or reg 39(3), which requires a guarantor to be kept informed through periodic statements, without saying how often? | Roan Capital's product (FS-869) | Institutions | Regs 39(3), 47 (LR-03) | Open | Periodic statements to each guarantor, at the frequency the product states; Roan Capital told the reading is being confirmed, its counsel's view invited (FS-876) | FS-869, FS-876 |
| LQ-17 | Reg 30(4)'s "notice of thirty days" before selling movable security: calendar or working days, counted from the notice's delivery; and does it replace the Act's five working days (MPSR Act s.73) or come on top of the default notice's time to pay (MPSR Act s.67)? | lender-rules §2.11 | Institutions | Reg 30(4) (LR-03); MPSR Act s.67, s.73 (LR-23) | Open | Thirty calendar days from delivery of the sale notice, given only after the default notice's time to pay has run | FS-899 |
| LQ-18 | When a lender repossesses a vehicle under the MPSR Act, do the Auctioneers Rules' steps apply (their r.5 yields where another law provides otherwise), and must a licensed auctioneer act? If they apply, how do they sit with reg 30(4) (LR-03): may its thirty days run alongside the Rules' seven-day redemption notice, given a sale must fall seven to fourteen days after the advertisement (Auctioneers Rules r.12(1)(f))? | lender-rules §2.11 | Institutions | Reg 30(1)(l), 30(4) (LR-03); Auctioneers Act s.9, s.23 (LR-41); Auctioneers Rules r.5, r.12 (LR-43); MPSR Act s.72 (LR-23) | Open | A licensed auctioneer acts and follows the Rules; the sale date is set first, at least thirty days after the sale notice, and the Rules' steps scheduled back from it | FS-899 |
| LQ-19 | Is a logbook loan, the vehicle jointly registered with the lender, a security right under the MPSR Act, or a hire-purchase agreement; and if hire purchase, may the lender repossess without a court once two-thirds is paid? | lender-rules §2.11; Roan Capital RC-08 | Institutions | MPSR Act s.65(4) (LR-23); Hire-Purchase Act s.15 (LR-42) | Open | A security right; a product marked hire purchase refuses repossession without a recorded court order once two-thirds of its price is paid | FS-899 |
| LQ-20 | When a loan is paid to a supplier for goods, and the goods are faulty or never arrive, may the borrower withhold repayment, and must the lender pursue the supplier? What must the agreement and the key information document say about it? | docs/products/loan-kinds.md | Institutions | Reg 54 (LR-03) | Open | The partner's agreement refunds returned or undelivered goods to the loan; the borrower's agreement says so, and a complaint about the goods pauses collection on that draw (JN-08) | FS-989 |
| LQ-21 | For goods financed as their own security (a motorbike, equipment), is the lender's title a hire-purchase agreement or a security right under the MPSR Act, and which steps then apply to repossession? (with LQ-19) | docs/products/loan-kinds.md | Institutions | Hire-Purchase Act s.15 (LR-42); MPSR Act s.65(4) (LR-23) | Open | As LQ-19: a product marked hire purchase refuses repossession without a recorded court order once two-thirds is paid | FS-989 |
| LQ-22 | On what lawful basis may a distributor share a retailer's purchase history with a lender to set its limit: the retailer's consent, or another ground? | docs/products/loan-kinds.md | Institutions; Dibon | Data Protection Act s.30, s.32 (LR-17) | Open | The retailer's recorded consent, before any data is shared, withdrawable, given for each distributor apart by default (FS-1004); without it, no limit from the partner's data | FS-989, FS-1004 |
| LQ-23 | May a microfinance bank, or a lender, issue virtual cards under a sponsor bank's BIN, and with what approvals from CBK and the card scheme; and how does PCI DSS fall on a platform that never stores or sees card numbers? | omni-channel OC-25 | Institutions; Dibon | Microfinance Act (LR-07); National Payment System Act (LR-11) | Open | Card numbers held only by the issuer processor; our systems never store or see them, so our scope is the authorisation call alone | FS-1010 |
| LQ-24 | Is an electronic signature through Odoo Sign, with a code to each signer's bound phone, enough for a board resolution, an account mandate and a director's guarantee, or does any of them need an advanced signature, a witness or a wet signature? (with FS-049) | templates/onboarding-pack.md | Institutions | Kenya Information and Communications Act (LR-21); Companies Act (LR-34) | Open | Signed in Odoo Sign with the evidence filed in the vault; a paper route kept for any template counsel says needs it | FS-1023 |
| LQ-25 | Must a company's board resolution or mandate still bear its common seal, or is the seal optional for companies under the Companies Act; and may an institution still ask for it? | templates/onboarding-pack.md | Institutions | Companies Act (LR-34) | Open | The seal optional in the starter templates; an institution that asks for it adds it | FS-1023 |
| LQ-26 | On what lawful basis are a business's directors checked against the registry, the credit bureau and sanctions lists: their consent, the institution's legal obligation to know its customer, or both, and what must they be told? | templates/onboarding-pack.md | Institutions | Data Protection Act s.30 (LR-17); POCAML Act (LR-13); Credit Reference Bureau Regulations (LR-06) | Open | The checks told to each director in B4, with consent asked where it is the basis | FS-1023 |
| LQ-27 | May a director's personal guarantee be signed electronically, and do the lender regulations' protections for guarantors apply to a director guaranteeing their own company's loan? | templates/onboarding-pack.md | Institutions | CBK lender regulations (LR-03); Kenya Information and Communications Act (LR-21) | Open | Treated as a guarantor: consent before appointment, statements, notice before demand (MF-37) | FS-1023 |
| LQ-28 | When a wallet loan is not repaid, may the lender recover it automatically from the customer's savings or wallet balance: on what consent and notice, and how do the lender regulations' limits on collection, and a deposit-taker's duties to its depositors, apply? | products/briefs/wallet-lending.md | Institutions | CBK lender regulations (LR-03); Microfinance Act (LR-07) | Open | Recovery from savings or the wallet only where the agreement says so and the customer agreed to it when borrowing; the customer told before and after each recovery | FS-1029 |
| LQ-29 | When SME Recon writes a business's bank and mobile-money transactions into books it keeps on a service hosted outside Kenya (Zoho Books, QuickBooks Online), who is transferring the personal data in them out of Kenya, the business or Dibon, and on what basis? | modules/sme-recon §7 | Dibon; businesses | Data Protection Act (LR-17) | Open | The business chooses its books and instructs the transfer; Dibon acts as its processor under an agreement that says so; nothing written abroad beyond what the books need | FS-1033 |
| LQ-30 | May Dibon keep client material and its own records in a cloud service outside Kenya (its Odoo on odoo.sh; its books on QuickBooks Online; its files in Google Workspace, and a client editing documents there with us): on what basis for the personal data in them, what its clients' agreements and NDAs allow, and must a company's accounting records be kept in Kenya? | rules, Dibon 10; FS-1035 | Dibon | Data Protection Act (LR-17); Companies Act (LR-34); Tax Procedures Act (LR-31) | Open | Recorded as an exception until Dibon's Odoo moves to OLP in Kenya (FS-1035) | FS-1035, FS-1042 |
| LQ-31 | May an Odoo Enterprise database run beside production under the same subscription, as an upgrade's target or a staging copy, and may an old Enterprise database be kept running read-only, for look-ups through its retention period, once the subscription has ended after a port to another edition? | specs/back-office §9.4; FS-1052 | Dibon | Contract (the Odoo Enterprise Subscription Agreement) | Open | Assumed not: a target and a staging copy counted under the subscription until confirmed; an old Enterprise back office retired to its export and a database archive at sign-off, not kept running unlicensed | FS-1052, FS-036, FS-967 |
| LQ-32 | May a lender screen its borrowers against PEP and sanctions lists through a provider that processes their names and identity numbers outside Kenya: on what lawful basis, and with what safeguards or proof to the Data Commissioner for the transfer; and does a screening provider abroad need registering as the lender's processor? | FS-1066 (a screening API suggested for Roan Capital) | Institutions | Data Protection Act s.48 (LR-17) | Open | Not chosen: until answered, screening by the interim question on the application form and the compliance officer's review; any provider preferred where it processes in Kenya | FS-1066, FS-340 |
| LQ-33 | When a lender builds its administrative and processing fees into a monthly interest rate (Roan Capital's 15%: 5% base, 2% cost of funds, 3% risk premium, 3% administrative, 2% processing), are those parts interest or fees: for the cap on what a non-performing loan may recover (reg 29), the pricing model CBK approves (reg 59), the agreement's disclosure and the APR (reg 54(4)), and excise duty on fees under the Excise Duty Act? | FS-1061; Roan Capital's Motor Vehicle and Title Deed drafts, A6 | Institutions | Reg 29, reg 54(4), reg 59 (LR-03); the Excise Duty Act | Open | Each part disclosed on its own in the agreement and the APR whichever way it falls; the fees taxed as fees until counsel says otherwise; Roan Capital asked how it charges them (A6) | FS-1061, LQ-01, LQ-14 |
| LQ-34 | May a lender use a vehicle tracker's location to find and repossess a borrower's vehicle, and on what basis: consent in the security agreement, the contract, or legitimate interest? May it read the location before default, or only once recovery has begun; does reading it count as systematic monitoring needing an impact assessment; and does reg 30's conduct (no intimidation, no shaming) limit how the location is used? | FS-1071; lending-service §5.2 | Institutions | Data Protection Act s.30, s.31 (LR-17); reg 30 (LR-03); MPSR Act s.71 (LR-23) | Open | No live location held by Dibon or the institution; a location lookup only through the tracking provider, only once a recovery case is open, each recorded with who, when and why; the tracker and its use named in the security agreement and the privacy notice | FS-1071 |

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](../law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 25 | reg 25(1), reg 25(2)(f) | A written credit policy, consistent with the law, stating among other things the cooling-off period (25(2)(f)) and how the borrower's ability to repay is determined (25(2)(s)) |
| reg 28 | reg 28(3) | Applications considered under the credit policy, ability to repay assessed and no reckless lending (28(1)); a refusal given at once, with reasons (28(2)); a loan may be restructured on the borrower's request or with prior notice (28(3)) |
| reg 29 | reg 29 | What can be recovered on a non-performing loan is capped at the principal then owing, interest up to that principal, and reasonable recovery costs; the cap is measured from the last time the loan became non-performing (29(3)); interest under a court order after the order is outside it (29(4)) |
| reg 30 | reg 30, reg 30(1)(l), reg 30(4) | No harassing, shaming or threatening collection: nothing posted to shame a borrower (30(1)(d)), no messages to their contacts (30(1)(e)), no calls outside working hours, no taking of essential personal effects (30(1)(k)); no charges not disclosed in the contract (30(2)); land security recovered under the Land Act (30(3)); thirty days' notice before selling movable security (30(4)) |
| reg 39 | reg 39(3) | A receipt for every transaction, a free loan statement on request and a way to see it at any time (39(1)); errors corrected promptly (39(2)); a guarantor kept informed through periodic statements (39(3)) |
| reg 42 | reg 42 | A guarantor's consent sought and obtained before the appointment; recourse to a guarantor only after non-judicial recovery from the borrower is exhausted, and after fourteen days' notice of the default |
| reg 47 | reg 47, reg 47(2) | Product information fair, clear and current, and easily available at branches, websites and every channel (47(1)(d)); the lender says it is regulated by the Central Bank, and shows its company name |
| reg 54 | reg 54, reg 54(4), reg 54(7) | At signing, the customer receives the agreement, the repayment schedule and the total cost of credit; the agreement states the loan, charges, rates, the APR, early repayment without charge (54(4)(h)) and more (54(4)); a variation needs thirty days' notice and the borrower's acceptance (54(7)) |
| reg 56 | reg 56, reg 56(3), reg 56(4) | A repayment credited on the day it is paid, applied to due principal, then fees and charges, then interest; early repayment, in whole or part, without notice or penalty (56(3)), and no interest for the remaining term on full early repayment (56(4)) |
| reg 57 | reg 57 | A loan is non-performing when principal or interest is outstanding thirty days past due, for a loan of thirty days or less, or ninety days, for a longer one (57(1)); the credit policy (57(2)) and each loan agreement (57(3)) state the default period |
| reg 59 | reg 59 | A pricing model with clear parameters: its components and costs justified, rates that may vary with the borrower's creditworthiness (59(2)(c)), the criteria for non-performance, credit bureau scores, all-inclusive pricing except third-party costs (59(2)(f)), and the APR disclosed |

**[LR-06](../law/LR-06.md) The Banking (Credit Reference Bureau) Regulations, 2020, Legal Notice No. 55 of 2020.** Regulator: Central Bank of Kenya. Made under: The Banking Act (Cap. 488), with the Microfinance Act and the Central Bank of Kenya Act. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2020/55/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 2 | reg 2 | Its definitions; a "subscriber" is an institution licensed under the Banking Act, the Microfinance Act or the Sacco Societies Act that has subscribed to receive customer information from a bureau |

**[LR-11](../law/LR-11.md) The National Payment System Act (Cap. 491A).** Regulator: Central Bank of Kenya. Made under: An Act of Parliament. In force: Yes. Version read: as at 2025-11-04, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2011/39/eng@2025-11-04).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 2 | s. 2 | Its definitions; a "payment service provider" includes whoever provides services for sending, receiving, storing or processing payments electronically, and any person that processes or stores data on behalf of such a provider or its users |

**[LR-17](../law/LR-17.md) The Data Protection Act (Cap. 411C).** Regulator: Office of the Data Protection Commissioner. Made under: An Act of Parliament. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2019/24/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 25 | s. 25 | The principles of data protection: personal data processed lawfully, fairly and transparently, for explicit purposes, limited to what is necessary, accurate, kept no longer than needed, secure, and not transferred out of Kenya without safeguards |
| s. 30 | s. 30 | No processing without a lawful basis: the person's consent for a stated purpose, or necessity for a contract, a legal obligation, vital interests, a public task or another ground the section lists |
| s. 31 | s. 31 | An impact assessment before processing likely to put people's rights at high risk, describing the processing, its necessity, the risks and the safeguards |
| s. 32 | s. 32 | Whoever relies on consent proves it was given for the purpose; consent can be withdrawn at any time; it is not freely given where a service is made to depend on consent to processing it does not need |
| s. 48 | s. 48 | Personal data transferred out of Kenya only with proof of appropriate safeguards given to the Data Commissioner, or where the transfer is necessary on a ground the section lists |

**[LR-23](../law/LR-23.md) The Movable Property Security Rights Act (Cap. 499A).** Regulator: The Registrar of security rights, who keeps the collateral registry. Made under: An Act of Parliament. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2017/13/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 65 | s. 65(4) | After the debtor fails to pay or perform, the secured creditor may use the rights in this Part, the security agreement or any other law (65(1)); the grantor's rights in this Part cannot be waived or varied before default (65(3)); under a hire-purchase agreement, only as the Hire-Purchase Act allows (65(4)) |
| s. 67 | s. 67 | On default, a written notice to the grantor to pay or perform, stating the default, the amount and the time by which to pay, what follows if not, and the right to apply to court (67(1), (2)); if not met in that time, the secured creditor may sue, appoint a receiver, lease, take possession or sell (67(3)) |
| s. 71 | s. 71 | Possession without a court where the security agreement consents to it, or where whoever holds the collateral does not object when it is taken (71(1)); the collateral may be made unusable and sold where it is (71(2)) |
| s. 72 | s. 72 | After default, the secured creditor may sell, lease or license the collateral as it is or after commercially reasonable preparation, choosing the method, time and place (72(1), (2)) |
| s. 73 | s. 73 | A notice of the intended disposition to the grantor, the debtor and any other secured creditor with a registered notice (73(1)), at least five working days before the sale, describing the collateral, the amount owing with an estimate of enforcement costs, the manner and the date (73(2)); not needed where the collateral may perish within ten working days (73(5)) |

**[LR-38](../law/LR-38.md) The Unclaimed Financial Assets Act (Cap. 494; No. 40 of 2011).** Regulator: The Unclaimed Financial Assets Authority. Made under: An Act of Parliament. In force: Yes. Version read: as at 2023-07-01, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2011/40/eng@2023-07-01).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 13 | s. 13 | Assets held in a fiduciary capacity are presumed abandoned if the owner has shown no interest in them for two years after they became payable |
| s. 14 | s. 14 | A gift certificate, gift card or credit memo is presumed abandoned after five years unclaimed or unused |

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
| r. 12 | r. 12, r. 12(1)(f) | For movables other than perishables and livestock: the instruction recorded (12(1)(a)); a proclamation listing each item's value and condition, signed by the owner or an adult at the premises (12(1)(b)); seven days' written notice in Sale Form 3 to redeem by paying the amount (12(1)(c)); only then removal to safe premises (12(1)(d), (g)); an advertisement within seven days of removal, and the sale at least seven and at most fourteen days after the first newspaper advertisement (12(1)(f)) |
