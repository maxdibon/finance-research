---
id: business-suite
name: Business Suite, on Odoo and Zoho
kind: product
status: living
law: LR-03
released: 2026.10.16
owner: Product lead, business suite
classification: Internal
audience: [bank, sacco, mfi, psp, imt, sme, fintech]
depends_on: [access, messaging, sme-recon, mandates, insights, sacco, mfi, identity]
consumed_by: [insights, mfi]
review_ids: [FS-293, FS-294, FS-295, FS-296, FS-002, FS-025, FS-026, FS-036, FS-131, FS-145, FS-156, FS-172, FS-280, FS-281, FS-282, FS-288, FS-289, FS-290, FS-291, FS-292, FS-336, FS-499, FS-522, FS-518, FS-521, FS-527, FS-532, FS-606, FS-608, FS-618, FS-644, FS-769, FS-770, FS-772, FS-777, FS-805, FS-970, FS-965, FS-996, FS-1011, FS-1021]
last_reviewed: 2026-10-27
---

# Business Suite, on Odoo and Zoho

## 1 · In one paragraph

The Business Suite is Odoo or Zoho, implemented by Dibon and connected to
the Kapu products (FS-306). It will give an institution or a business its
CRM, helpdesk, accounting, HR and payroll, e-signatures, customer portal
and campaigns, with bank and mobile-money feeds reconciled into its books
through SME Recon. It is not software Dibon builds. Dibon implements,
configures and integrates Odoo as an Odoo Ready Partner, working towards
Silver (FS-288), and Zoho as a Zoho partner (tier to confirm, FS-312).
Managed Odoo hosting on Dibon's own platform, OLP, is built (BS-11); the
customer implementations are planned. It completes the portfolio's promise
of one partner rather than five: the ERP is usually the fifth. Dibon will
run on it first, for its own CRM, helpdesk and accounting (FS-002).

## 2 · Who it is for

**Segments:** SMEs and fintechs without an ERP, or outgrowing spreadsheets
and desktop accounting. Saccos, MFIs and smaller banks for their own back
office: corporate customers, member complaints, their own books. Customers
of SME Recon who have no ERP to wrap (FS-131).

**The problem, concretely:** businesses want customers, complaints and
invoices in one place rather than three tools; agreements signed online
rather than on paper and scanned; and bank and mobile-money statements in
the books without keying them in by hand.

**People who use it:**

| Role | What they need from it |
|---|---|
| Sales and relationship staff | One CRM: leads, accounts, pipeline, history |
| Customer service | A helpdesk with SLAs; tickets linked to the customer and the transaction |
| Finance | Accounting with bank and mobile-money statements already reconciled (SME Recon) |
| Customers and members | A portal for invoices, statements and tickets; documents signed online |
| Marketing | Campaigns and templates, delivered through Dibon's messaging |

## 3 · What it does

**No specification exists; Odoo's features are Odoo's.** Rows describe
what Dibon implements and integrates. Every row except BS-11 is
**Planned** until a customer implementation is live. BS-11, managed Odoo
hosting on OLP, is **Built** (FS-293).

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| BS-01 | Odoo implementation: CRM, helpdesk, accounting and invoicing, configured to the customer. The helpdesk includes a restricted compliance team for identity mismatches referred from identity ID-01: visible to the compliance officer and those it names, never to the customer portal or the service desk's AI agent, and holding a link to the application, never its documents | Planned | FS-002, FS-281; owner, 2026-10-06 (FS-555). Tipping off is an offence (POCAMLA s.8) | 1 |
| BS-02 | Odoo Sign for agreements, mandates, consents and onboarding forms; external signers need no licence. A signed document that carries personal data is filed in the document vault, and Odoo keeps the record and a link (architecture §6, FS-527). Completion emails carry a link, never the signed file (to confirm against Odoo; if it cannot be set, signing moves to our own page, FS-532) | Planned | FS-044, FS-049, FS-527 | 1 |
| BS-03 | Customer portal: invoices, statements, tickets, signed documents; portal users need no licence; for an institution's partners (a distributor, a school) the partner portal: data uploaded, deliveries confirmed, payments seen, returns (lending-service §5, FS-996) | Planned | FS-026 | 1 |
| BS-04 | Bank and mobile-money statements reconciled into Odoo accounting, through SME Recon | Planned | sme-recon SR-10 | 1 |
| BS-05 | Campaigns and templates in Odoo, delivered through Dibon's messaging, with honest delivery status written back | Planned | messaging MS-13 | 2 |
| BS-06 | Single sign-on through access (Keycloak) | Planned | access AC-02 | 1 |
| BS-07 | Questions over Odoo data through Odoo 20's MCP server: read-only, one key per person | Planned | insights IN-01; FS-156 | 1 |
| BS-08 | For institutions with a core: the core's daily totals posted to Odoo's general ledger as summarised journal entries; customer accounts stay in the core | Planned | FS-290 | 2 |
| BS-09 | Approvals inside Odoo for workflows that move no money; anything that moves money goes through the mandate engine | Planned | FS-145 | 1 |
| BS-10 | Migration from spreadsheets or a previous accounting system, with a signed-off opening balance | Planned | FS-131 | 1 |
| BS-12 | HR and payroll: contracts, leave, attendance and monthly payroll; for a Sacco or MFI, its own staff. The employee record (Odoo's Employees app: the employee, job position, manager, start and departure dates) provisions staff access: a joiner creates a Keycloak user with no roles and asks for the position's role set (handbook HB-10), a new position asks for the change, a departure disables the user (access-keycloak §6; mfi MF-35; FS-770) | Planned | FS-304. R1: the employee record only, with each job position naming its roles, procedures and training, and the onboarding and offboarding plans that carry handbook HB-20 and HB-23; payroll, leave and attendance later (owner, 2026-10-12, FS-769, FS-772). Dibon's own Odoo does the same for its engineers (FS-777) | 1 |
| BS-13 | Zoho implementations for businesses that prefer it, with SME Recon's Zoho wrapper for statements | Planned | FS-306; sme-recon SR-13 | 2 |
| BS-14 | Check-off in payroll: each Sacco's or lender's schedule becomes deduction lines in payroll (BS-12), only with the employee's written request; total deductions held to two-thirds of wages; each remittance file produced and paid within 7 days through SME Recon (SR-11), in the payroll payment run (BS-19); files go by API, the portal or SFTP, never by email (FS-532) | Planned | Owner, 2026-10-06 (FS-499). Employment Act s.19(1)(g), s.19(3) to (5) (LR-30); Co-operative Societies Act s.35 (LR-26) | 2 |
| BS-15 | Check-off exchange: where the Sacco or lender is on Kapu Sacco or Kapu MFI, schedules arrive by API and remittances return matched, so neither side keys a spreadsheet. Every repayment is tracked: one made directly by M-Pesa, Airtel Money, T-Kash or bank amends the next schedule sent to the employer before the payroll cut-off; one arriving after the cut-off is credited to the next instalment or refunded, never collected twice (early repayment without penalty, reg 56(3)) | Planned | Owner, 2026-10-06 (FS-499, FS-518); sacco SC-04 | 2 |
| BS-16 | Reactivation campaigns: dormant or lapsed customers re-engaged through Odoo campaigns and Dibon's messaging, only with consent; the opt-out after full repayment honoured (CBK lender regulations reg 27(3)); suitability first (reg 38), so credit is never offered to someone the affordability check would refuse | Planned | Owner, 2026-10-06 (FS-522); BS-05 | 2 |
| BS-17 | Employee loans from the employer's Odoo: an employee applies for a term loan or a pay-day limit (mfi MF-36) in the employee portal; the employer confirms employment and that the deduction fits within two-thirds of wages (Employment Act s.19(3)); with the employee's consent the application goes by API to the lender's Kapu MFI, whose own approval chain decides and gives reasons for a refusal (lender regulations reg 28(2)); status and notifications return to Odoo and the employee's phone; the loan is booked once, in the lender's core, and shown in both Odoos | Planned | Owner, 2026-10-06 (FS-518); BS-15 | 2 |
| BS-18 | SME documents and company records: documents in Odoo Documents, by role; board resolutions and minutes from templates, signed by the directors through Odoo Sign (BS-02); the registers of directors and shareholders checked against the business registry (identity verification ID-07); what the SME shares with a lender travels through the SME-to-lender exchange (FS-528) | Planned | Owner, 2026-10-06 (FS-521). Odoo Documents is an Enterprise app | 2 |
| BS-19 | Payroll payment: the month's payroll paid from the employer's own accounts, never through Dibon. Net pay to each employee by bank (a bulk file or the bank's API) or by M-Pesa, Airtel Money or T-Kash, each payee's name confirmed first (rails RL-21, RL-29); statutory remittances (PAYE, NSSF, SHIF, the housing levy) and the check-off remittances to each Sacco and lender (BS-14) in the same run. The run is approved once, as one request (mandates, subject payroll.run); each payment is then an instruction from approval to settlement (rails RL-01), executed through SME Recon (SR-11); a failure is queued and retried, never paid twice; outcomes are written back to Odoo payroll, and each employee is told when they are paid | Planned | Owner, 2026-10-07 (FS-606, FS-608). Whether initiating payments from an employer's account needs authorisation is open: FS-037, compliance LC-06 | 2 |
| BS-20 | The institution's public pages on its Odoo website: a "Request a loan" form that creates the lead in the CRM (BS-01), with consent recorded, and a loan calculator priced from the same product version as live loans through Kapu MFI (mfi MF-23), so a quote matches the loan; a credit officer converts a lead into a draft application (mfi MF-01), never automatically; and, for each active product version, its terms and key information document, published from the signed document and kept current, as the lender regulations require (regs 47(1)(d), 48; lender-rules §2.4; FS-805) | Planned | Owner, 2026-10-08 (FS-618); Roan Capital RC-28, RC-29 | 1 |
| BS-11 | Managed Odoo hosting on OLP (Odoo Launch Pad, formerly OPA), Dibon's own Odoo management platform: instances, backups, staging, upgrades (Community's by OpenUpgrade; Enterprise's own apps need Odoo's upgrade service, OLP review G1); what Financial Services needs from it is docs/specs/olp.md | Built | Owner, 2026-10-01 (FS-293); public site opa.dibon.co.ke, unchanged by the rename (FS-336). Liquid hosting planned | 1 |
| BS-21 | The back office behind one interface: our services reach the ERP inside an institution's instance only through the back-office gateway, one adapter per ERP, one contract test suite every adapter passes; Odoo Enterprise first, Odoo Community, ERPNext and Tryton candidates to evaluate | Designed | FS-970; docs/specs/back-office.md | 1 |
| BS-22 | Porting an institution's back office from one ERP to another: export, mapping, a rehearsal, cut-over by switching the adapter, counts reconciled and signed off | Designed | FS-970; docs/specs/back-office.md §9 | 2 |
| BS-23 | The staff workspace: an institution's staff do their daily lending in screens of ours inside Odoo, over Kapu MFI's API; reads live and never stored, every write a command to Kapu MFI, every decision in the approval engine; in place of the Mifos web app | Designed | FS-965; docs/specs/staff-workspace.md | 1 |
| BS-24 | A website for an institution that has none, as part of the business suite: built by Dibon on Odoo Website and hosted on OLP in Kenya, on the institution's own domain; its pages approved by the institution: who it is, its branches and contacts, its products with their terms and key information documents published from active versions, the calculator and the "Request a loan" form (BS-20), complaints, the privacy notice, and that it is regulated by CBK (reg 47) | Planned | FS-1011; product landscape (an institution without a site) | 2 |
| BS-25 | An onboarding pack for an institution's business customers and partners: starter templates (a board resolution naming the administrators and signatories, the account mandate, a beneficial ownership declaration, directors' consent to checks, directors' guarantees; a partner agreement, a data-sharing agreement, a letter naming a partner's administrators), adopted by each institution with its counsel, filled from the records held, signed in Odoo Sign, filed in the vault | Planned | FS-1019, FS-1021; templates/onboarding-pack.md | 2 |

## 4 · Where it sits

**Depends on:** access (sign-on), messaging (campaigns, SMS), sme-recon
(statement feeds into accounting), mandates (money approvals), insights
(questions over Odoo data), sacco and mfi (check-off schedules, BS-15),
identity (company registers checked against the business registry,
BS-18).
**Used by:** customers directly; insights, for questions and dashboards
over Odoo data; mfi (confirmed purchase orders and invoices, MF-32). In the architecture, Odoo is also one of the three
authorities (docs/architecture/README.md §2).

**Who holds which record** (docs/architecture/README.md §2):

| Record | System of record | This module |
|---|---|---|
| The business's own customers, suppliers, invoices, bills, tickets, documents | **Odoo** | Implements and holds them |
| An institution's members' or customers' accounts and KYC | The core, or Fineract (FS-172) | **Never copied into Odoo.** Odoo holds the institution itself and its corporate relationships |
| The institution's own general ledger | Odoo, where the institution chooses it | Receives summarised daily postings from the core (BS-08) |
| Bank and mobile-money statement lines, matches | Recon engine | Matches written into Odoo through SME Recon |
| Approvals that move money | Mandate engine | Never decided inside Odoo |

**What this module never stores:** a second copy of a core's customer
accounts, or a ledger of funds that a core already holds.

**Under each ledger mode:**

| | Integrated — the customer has a core or an ERP | Native — it has neither |
|---|---|---|
| Where entries are posted | Its core keeps the customer ledger; Odoo takes the summarised totals (BS-08). A business with another ERP keeps it, and SME Recon wraps that ERP instead | Odoo, implemented by Dibon |
| What differs in this module | Odoo is the back office around the core, not a second core | Odoo is the business's whole ERP |
| What the customer must provide | Its chart of accounts and the core's daily totals | Its data for migration (BS-10) |
| Who it suits | Saccos, MFIs, banks | SMEs, fintechs |

## 5 · How it works

```
   bank, M-Pesa, card statements          Kapu products, core
               |                                  |
               v                                  v
   +--------------------+              +--------------------+
   |  SME RECON         |              |  CORE / FINERACT   |
   |  matches           |              |  customer ledger   |
   +--------------------+              +--------------------+
               | matched lines                    | daily totals
               v                                  v
   +-----------------------------------------------------------+
   |  ODOO  (implemented by Dibon)                             |
   |  CRM . helpdesk . accounting . Sign . portal . campaigns  |
   +-----------------------------------------------------------+
        |              |                 |              |
   Keycloak       messaging          mandates       Odoo 20 MCP
   sign-on        campaigns, SMS     money          read-only
                                     approvals      questions
```

## 6 · Rails and integrations

| Rail / system | Direction | Feed | Status |
|---|---|---|---|
| SME Recon | in | matched statement lines | Planned (BS-04) |
| Core or Fineract | in | daily summarised journal entries | Planned (BS-08) |
| Messaging | out / in | campaigns, SMS, delivery status | Planned (BS-05) |
| Access (Keycloak) | in | OpenID Connect sign-on | Planned (BS-06) |
| Odoo 20 MCP server | out | read-only tools | Planned (BS-07) |

## 7 · Regulatory position

- **Custody:** none.
- **Partner status:** Dibon is an Odoo Ready Partner, working towards
  Silver (FS-288). Marketing states the current tier only, and follows
  Odoo's rules for its name and logo (FS-282).
- **Licensing:** Odoo Enterprise, per internal user. Portal users and
  external signers are not counted (FS-026). Sign, Helpdesk, Documents,
  Knowledge, Approvals, full Accounting and Payroll are Enterprise only;
  an SME that stays on Community goes without them (docs/architecture/README.md
  §8, FS-644). Whether the Enterprise
  Agreement limits serving internal work through them is open (FS-036).
- **Hosting:** on OLP, to be hosted on Liquid's Azure Stack so that data
  stays in-country (FS-289, FS-293).
- **Data:** customers, invoices and tickets are Confidential. Signed
  documents may carry ID numbers, which are Restricted.

## 8 · Controls

- **One ledger per kind of money.** A core's customer accounts are never
  rebuilt in Odoo; Odoo receives totals (BS-08).
- **Money approvals leave Odoo** for the mandate engine (BS-09; FS-145).
- **One key per person** for MCP access; generic write tools stay off on
  accounting and payment models (FS-156).
- **Odoo is unmodified where possible.** Customisations are kept small and
  documented, because each one is maintained through every Odoo upgrade
  (FS-291).

## 9 · Deployment

Odoo Enterprise, run and managed on **OLP** (Odoo Launch Pad), Dibon's own Odoo management
platform (BS-11). OLP is to be hosted locally on Liquid's Azure Stack
(FS-289, FS-293). On a customer's premises where it requires. Odoo's own cloud is
not the default: it holds data abroad.

## 10 · What it does not do

- Replace a core banking system, or hold a core's customer accounts.
- Approve anything that moves money.
- Make Odoo Dibon's software. It is Odoo's; Dibon implements, connects and
  supports it.

## 11 · Open questions

FS-036, FS-290, FS-291, FS-292.

## 12 · Sources

- REVIEW.md FS-002, FS-026, FS-131, FS-145, FS-156, FS-172, FS-280,
  FS-281, FS-288.
- docs/architecture/README.md §2, §8.
- docs/modules/sme-recon.md, messaging.md, access.md, insights.md.
- Odoo 20.0 documentation — AI MCP server.

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](../law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 27 | reg 27(3) | Thirty days' notice to the Central Bank before a new delivery channel rolls out, with the mobile money account, apps and bank accounts to be used; a way to opt out of marketing messages; channels that are available, safe, protected from fraud, easy to use and affordable |
| reg 28 | reg 28(2) | Applications considered under the credit policy, ability to repay assessed and no reckless lending (28(1)); a refusal given at once, with reasons (28(2)); a loan may be restructured on the borrower's request or with prior notice (28(3)) |
| reg 38 | reg 38 | Before contracting, the customer is told they are free not to enter a contract that seems onerous or unsuitable, and of any difficulty their financial position may cause in performing it |
| reg 47 | reg 47, reg 47(1)(d) | Product information fair, clear and current, and easily available at branches, websites and every channel (47(1)(d)); the lender says it is regulated by the Central Bank, and shows its company name |
| reg 48 | reg 48 | A key information document for each product: its benefits, risks, terms and conditions, in summary |
| reg 56 | reg 56(3) | A repayment credited on the day it is paid, applied to due principal, then fees and charges, then interest; early repayment, in whole or part, without notice or penalty (56(3)), and no interest for the remaining term on full early repayment (56(4)) |

**[LR-13](../law/LR-13.md) The Proceeds of Crime and Anti-Money Laundering Act (Cap. 59A).** Regulator: The Financial Reporting Centre, with each institution's supervisor. Made under: An Act of Parliament. In force: Yes. Version read: as at 2025-11-04, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2009/9/eng@2025-11-04).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 8 | s. 8 | Tipping off is an offence: telling anyone that a suspicious transaction report is being prepared or has been made |

**[LR-26](../law/LR-26.md) The Co-operative Societies Act (Cap. 490).** Regulator: The Commissioner for Co-operative Development. Made under: An Act of Parliament. In force: Yes. Version read: as at 2023-12-11, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/1997/12/eng@2023-12-11).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 35 | s. 35 | An employer that deducts a member's contribution for a co-operative society must remit it within seven days, or pay it with compound interest of at least five per cent a month; the Commissioner may sue for it |

**[LR-30](../law/LR-30.md) The Employment Act (Cap. 226).** Regulator: The Ministry responsible for labour; disputes go to the Employment and Labour Relations Court. Made under: An Act of Parliament. In force: Yes. Version read: as at 2024-04-26, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2007/11/eng@2024-04-26).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 19 | s. 19(1)(g), s. 19(3), s. 19(5) | Deductions from wages only those the section allows, among them one the employee asks for in writing (19(1)(g)); all deductions together no more than two-thirds of wages (19(3)); a deduction paid over as the law or agreement requires, failing which an offence (19(5)) |
