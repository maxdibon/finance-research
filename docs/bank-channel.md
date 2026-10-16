---
id: bank-channel
name: Bank channel — banks offering SME Recon and the business suite to their SME customers
kind: partner-model
status: draft
law: LR-03
released: 2026.10.15
owner: Commercial lead
classification: Internal
review_ids: [FS-024, FS-439, FS-441, FS-443]
last_reviewed: 2026-10-16
---

# Bank channel

**What it is:** a bank offers SME Recon, and where the business wants it
the Odoo business suite, to its SME customers (FS-439, FS-441). The
business's bank statements flow straight into its own books; unmatched
money stays visible; the bank gains a stickier account and, with the
business's consent, a truer picture of its cash flow. Dibon delivers,
hosts and supports the software. The same model works for microfinance
banks and Saccos with business members.

**What the business gets:** its books kept against its bank and mobile
money every day, not at month-end (sme-recon SR-01, SR-03, SR-06, SR-09,
SR-10); payments approved in its own system (SR-11); and, if it moves to
Odoo, invoicing, CRM, helpdesk and payroll set up for it (business-suite
BS-01, BS-04, BS-12).

## Why a bank would do it

- **A reason to stay.** A business whose books are wired to one bank's
  statements has a cost to leaving it.
- **Better credit decisions.** With the business's explicit consent, the
  bank sees reconciled cash flow rather than a statement to interpret,
  which supports lending against cash flow (the inclusion strategy's
  creditworthiness and alternative-scoring aims, FS-427).
- **Something to compete on besides rates**, for tier-2 and tier-3 banks
  in particular.
- **No build.** The bank's part is a statement feed and an introduction.

**Why it suits us:** many businesses through one agreement; live bank
statement feeds, which SME Recon needs anyway (SR-01; rails RL-07); and a
second line of work with banks we already serve.

## Two models

A bank may not "engage, alone or with others, in wholesale or retail
trade" (Banking Act s.12(a); law register LR-04), so it should not resell
software licences. Both models below avoid that; the legal partner should
confirm them before the first agreement (SD-12).

| | **Referral** | **Bundle** |
|---|---|---|
| What the bank does | Introduces its business customers to us, in its app, branches and relationship managers | Includes SME Recon in a business-account package it pays for, as a service to its own customers |
| Who contracts with the business | Dibon | The bank (account terms); Dibon contracts with the bank |
| Who pays Dibon | The business | The bank, per active business |
| What the bank earns | A referral commission from Dibon, if the legal partner confirms a bank may take one | Whatever its package earns: fees, deposits, lending |
| Branding | Dibon's, presented by the bank | Co-branded: the bank's package, our product named inside it |
| Odoo licences | Through Dibon as the Odoo partner, billed to the business | Through Dibon, billed to the business or covered by the bank's package |
| Support | Dibon, first line and up | Dibon; the bank's relationship manager knows how to escalate |
| Bank's regulator | Likely nothing to file: no service is outsourced (to confirm) | Possibly an outsourcing notice or approval if CBK sees it as the bank's service (docs/approval-pack.md) |

**Recommendation:** start with **referral**. It needs the least from the
bank and from its regulator, and it tests whether its businesses take the
product up. Move a bank to **bundle** once take-up is shown.

## Data, consent and who holds what

| Data | Who controls it | What the bank sees |
|---|---|---|
| The business's books in SME Recon or Odoo | The business | Nothing, unless the business consents |
| The business's statements, fed from the bank | The bank (its records), shared at the business's request | — |
| Enrolment: which customers took the product, and whether active | Shared, under the agreement | Yes |
| Reconciled cash-flow summaries for a credit decision | The business | Only with a separate, specific consent per purpose, withdrawable, recorded with its date (Data Protection Act, LR-17; for lenders, CBK lender regulations reg 58, LR-03) |

- **Dibon is the business's processor** for its books, and the bank's
  processor only for what the bank asks us to run in the bundle model.
- **Never sold, never mined.** We do not use either party's data for our
  own purposes, and the agreement says so (approval pack item 12).
- **A consent screen we provide**, so every bank asks the same way and
  every consent is recorded the same way.

## What we need from the bank

1. A statement feed for each business that opts in: an API (preferred)
   or daily files in MT940, CAMT.053 or CSV (SR-01; rails RL-07).
2. A product owner on its side, and a way to reach its business customers.
3. Its agreement to the consent screen and the data table above.
4. For the bundle model: its view on whether its regulator needs telling.

## A pilot

- **With:** a bank we already serve or are talking to: KCB or National
  Bank of Kenya, customers since 2021 for SMS, USSD and integration work
  (customers CU-03, CU-04), or
  the banking-as-a-service bank (partners PT-34), where it fits the
  partnership already proposed.
- **Scope:** referral; SME Recon on Odoo or Zoho; a cohort of the bank's
  business customers agreed with it; a fixed period agreed with it.
- **Measured by:** businesses enrolled; active after 90 days; the share of
  statement lines matched without a person; support tickets per
  business; for the bank, accounts retained and lending conversations
  started with consent.
- **Decided after:** whether to widen the referral, move to a bundle, or
  stop.

## Risks

- **The bank builds its own.** KCB moved its USSD to a platform of its own
  (FS-416). An open product the bank can leave, priced to make building
  unattractive, is the answer, not lock-in.
- **Exclusivity.** A bank may ask for it. We should not give it across a
  market; at most for a period, for a segment.
- **Statement feeds.** SME Recon is only as good as the feed (SR-01 is
  Planned). The pilot proves the feed first.
- **Data.** A bank, a business and Dibon each need to trust the consent
  model. One misuse ends the channel.
- **Support.** Many small businesses can mean many tickets; onboarding
  must be self-service where it can be.

## Next steps

1. The legal partner confirms the two models, the referral commission and
   the regulator question (SD-12).
2. Choose the first bank and propose the pilot.
3. Pricing for both models, when commercials are taken up (FS-024).

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 58 | reg 58 | Personal data processed lawfully, fairly and transparently; consent express, specific, separately obtained on its own form, withdrawable and recorded; a privacy notice is not consent |

**[LR-04](law/LR-04.md) The Banking Act (Cap. 488).** Regulator: Central Bank of Kenya. Made under: An Act of Parliament. In force: Yes. Version read: as at 2024-12-27, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/1989/9/eng@2024-12-27).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 12 | s. 12(a) | An institution may not trade, wholesale or retail, import or export, except in recovering debts owed to it (12(a)), and is restricted in the shares and property it may hold |
