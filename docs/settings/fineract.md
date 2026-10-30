---
id: settings-fineract
name: Fineract — baseline settings for KAPU CORE in every deployment
kind: guide
status: living
law: LR-03
released: unreleased
owner: Solution architect
classification: Internal
review_ids: [FS-1050, FS-1056, FS-1058]
last_reviewed: 2026-10-30
---

# Fineract · baseline settings

## 1 · What this covers

**KAPU CORE:** Apache Fineract 1.15.x, the ledger, one in each
institution's instance where the platform keeps the books (native mode).
Why it is used as it is, its contracts, restructuring and close of
business are [kapu-core-fineract](../specs/kapu-core-fineract.md); its
settings are here, once (FS-1050). Its database's settings are the
[PostgreSQL baseline](postgresql.md). **Owner:** the solution architect.

**What is not here:** each loan product's settings. Products are the
institution's own configuration (settings README): the lending service
sets them in Fineract from each signed product version, and S12 says how.

## 2 · Settings

| Id | Setting | Value | Class | Why | Enforced by | Checked by |
|---|---|---|---|---|---|---|
| S01 | Version | Apache Fineract 1.15.x, the same across the fleet; a minor taken only after the checks before the build pass on it | Mandatory | One ledger version to test; the lender regulations' behaviour proven on it | The image in git; Kyverno | F1 to F15 |
| S02 | No fork | Anything Fineract lacks added through its documented custom modules (services, business steps, transaction processors), never by changing its code | Mandatory | Upgrades stay possible | The image we build | Code review |
| S03 | One per instance | One Fineract in each institution's instance, on the Ledger cluster, its database Fineract's alone | Mandatory | Isolation; nothing else reads or writes the ledger's tables | The instance's folder in git; the database's roles | F14; configuration record |
| S04 | Tenant time zone | Africa/Nairobi | Default: Africa/Nairobi; another only for an institution outside Kenya | Business dates and value dates in the institution's time (architecture README §10) | Configuration from git | Nightly read-back |
| S05 | Sign-in | OAuth against Keycloak's `staff` realm; basic authentication off | Mandatory | No Fineract passwords (AC-02) | Configuration from git | K9 |
| S06 | Maker-checker | Off | Mandatory | The approval engine decides; two approval records could disagree (KC-08) | Global configuration, from git | Nightly read-back |
| S07 | Transactions on holidays and non-working days | Allowed | Mandatory | Repayments land every day; M-Pesa never closes | Global configuration, from git | F10 |
| S08 | A due date on a holiday | Moves to the next working day, or stays, as the institution's credit policy says | Per deployment | The institution's policy (onboarding OB-COM-20) | Global configuration, from git | F7 |
| S09 | Business date | On; moved only by the end-of-day runner | Mandatory | One owner of the ledger's day (kapu-core-fineract §7) | Global configuration; the runner | F12 |
| S10 | Loan schedule | Progressive, with advanced payment allocation, for every product | Mandatory | Restructuring and a rate change on a live loan need it; the repayment order is a setting | Product settings, by the lending service | F1, F3 |
| S11 | Repayment order | Past-due principal, fees, penalties, interest; then due, in the same order; then in advance, in the same order | Mandatory | Lender regulations reg 56: principal, then fees and charges, then interest | Product settings, by the lending service | F3 |
| S12 | Product settings | Set only from the signed product version document, through the API, never by hand; compared each night with the document | Mandatory | The product a borrower agreed to is the product that runs (product-versions) | The lending service | F15 |
| S13 | Non-performing | The product's overdue days matched to reg 57 where its tenors sit wholly on one side of 30 days; out of non-performing only when arrears are cleared | Mandatory | Lender regulations reg 57 | Product settings, by the lending service | F6 |
| S14 | Overdue penalties | None on capped products: Fineract's overdue-penalty step off; default interest posted by the lender rules, within the cap | Mandatory | The cap on what can be recovered (reg 29) | Product settings; the jobs' configuration | F5 |
| S15 | Future instalments | Next instalment first, unless the product says otherwise | Default: as here, or as the product version says | The common case | Product settings | F3 |
| S16 | Staff permissions | No staff role holds any of `APPROVE_LOAN`, `REJECT_LOAN`, `WITHDRAW_LOAN`, `DISBURSE_LOAN`, `DISBURSETOSAVINGS_LOAN`, `APPROVALUNDO_LOAN`, `DISBURSALUNDO_LOAN`, `CREATE_RESCHEDULELOAN`, `APPROVE_RESCHEDULELOAN`, `REJECT_RESCHEDULELOAN`, `REAGE_LOAN`, `REAMORTIZE_LOAN`, `WAIVEINTERESTPORTION_LOAN`, `WAIVE_LOANCHARGE`, `WRITEOFF_LOAN`, `FORECLOSURE_LOAN` | Mandatory | Only an approved request moves a loan (KC-08) | Roles from git | K9; the nightly comparison |
| S17 | The one writer | The lending service's account alone, its credentials in OpenBao and rotated; each command carrying the approval request it acts on | Mandatory | One writer to the ledger | Roles from git; OpenBao | The nightly comparison (approval-engine §9) |
| S18 | Staff in Fineract's own screens | None: staff work in the staff workspace (FS-965); the read-only fallback for named staff is the Kapu Console, not Fineract (FS-987) | Mandatory | No second way into the ledger | Roles from git | Nightly read-back |
| S19 | Reason codes | Reschedule and re-amortization reasons matching those Kapu MFI records (MF-09) | Mandatory | One list of reasons | Codes from git | Nightly read-back |
| S20 | Accounting | Accrual accounting; accruals stop on a non-performing loan | Mandatory | The books the lender regulations expect | Configuration from git | F6 |
| S21 | Chart of accounts | The institution's own (onboarding OB-KC-02) | Per deployment | Its books | Configuration from git | Trial balance at go-live |
| S22 | Working days and holidays | The institution's working days, and Kenya's public holidays from the business calendar (KC-15) | Per deployment | Due dates, close of business | Configuration from git; the calendar | F7 |
| S23 | External events | On, to the event bus in Avro, through the adapter | Mandatory | Recon's three ledgers (recon §3) | Configuration from git | F13 |
| S24 | External ids | Every loan and transaction carries ours | Mandatory | Every record traceable to its request | The lending service | F9 |
| S25 | Jobs left off | Fineract's SMS and email jobs; its report mailing | Mandatory | Messages through messaging; reports from insights and Odoo | Jobs' configuration, from git | Nightly read-back |
| S26 | Savings, shares, tellers | Off | Default: off; on only where the deposits service uses them (deposits-service) | Not used by lenders | Configuration from git | Nightly read-back |

## 3 · How it is applied

- **The server** (S01 to S03) from its resource in `platform`: the image
  we build on Fineract's release, its replicas, its database.
- **Global configuration, roles, codes, accounting, calendar** (S04 to
  S09, S16 to S26) as configuration from git, applied through Fineract's
  API by a job after each change, never by hand.
- **Product settings** (S10 to S15) by the lending service from each
  signed product version, as the institution's own configuration.

## 4 · How it is checked

- **Before the build relies on it:** checks F1 to F15 on a running 1.15
  instance (kapu-core-fineract §12).
- **Each night:** global configuration, roles and codes read back through
  the API and compared with git; products with their documents (S12);
  loans moved without an approved request (S16, S17).

## 5 · Changing this baseline

A normal change, approved by the operations lead after the solution
architect's review; with the compliance and risk officer for a setting
the lender regulations set (S11, S13, S14).

## 6 · Open questions

1. The Mifos web app's version, if any deployment keeps it (FS-136).
2. Fineract as a deposit core, which would change S26 (FS-185).

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](../law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 29 | reg 29 | What can be recovered on a non-performing loan is capped at the principal then owing, interest up to that principal, and reasonable recovery costs; the cap is measured from the last time the loan became non-performing (29(3)); interest under a court order after the order is outside it (29(4)) |
| reg 56 | reg 56 | A repayment credited on the day it is paid, applied to due principal, then fees and charges, then interest; early repayment, in whole or part, without notice or penalty (56(3)), and no interest for the remaining term on full early repayment (56(4)) |
| reg 57 | reg 57 | A loan is non-performing when principal or interest is outstanding thirty days past due, for a loan of thirty days or less, or ninety days, for a longer one (57(1)); the credit policy (57(2)) and each loan agreement (57(3)) state the default period |
