---
id: business-suite
name: Business Suite, on Odoo and Zoho
kind: product
version: 0.1.0
owner: Product lead, business suite
classification: Internal
audience: [bank, sacco, mfi, psp, imt, sme, fintech]
depends_on: [access, messaging, sme-recon, mandates, insights]
consumed_by: []
review_ids: [FS-293, FS-294, FS-295, FS-296, FS-002, FS-025, FS-026, FS-036, FS-131, FS-145, FS-156, FS-172, FS-280, FS-281, FS-282, FS-288, FS-289, FS-290, FS-291, FS-292, FS-336]
last_reviewed: 2026-10-01
---

# Business Suite, on Odoo and Zoho

## 1 · In one paragraph

The Business Suite is Odoo or Zoho, implemented by Dibon and connected to
the Kapu products (FS-306). It gives an institution or a business its CRM, helpdesk,
accounting, HR and payroll, e-signatures, customer portal and campaigns, with bank and
mobile-money feeds already reconciled into its books. It is not software
Dibon builds. Dibon implements, configures and integrates Odoo as an Odoo
Ready Partner, working towards Silver (FS-288), and Zoho as a Zoho partner
(tier to confirm, FS-312). It completes the
portfolio's promise of one partner rather than five: the ERP is usually
the fifth. Dibon runs on it first, for its own CRM, helpdesk and accounting
(FS-002).

## 2 · Who it is for

**Segments:** SMEs and fintechs without an ERP, or outgrowing spreadsheets
and desktop accounting. Saccos, MFIs and smaller banks for their own back
office: corporate customers, member complaints, their own books. Customers
of SME Recon who have no ERP to wrap (FS-131).

**The problem, concretely:** customers live in one tool, complaints in
another, invoices in a third. Paperwork is signed on paper and scanned. The
bank and mobile-money statements still have to be keyed into the books by
hand.

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
what Dibon implements and integrates. Every row is **Planned** until a
customer implementation is live.

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| BS-01 | Odoo implementation: CRM, helpdesk, accounting and invoicing, configured to the customer | Planned | FS-002, FS-281 | 1 |
| BS-02 | Odoo Sign for agreements, mandates, consents and onboarding forms; external signers need no licence | Planned | FS-044, FS-049 | 1 |
| BS-03 | Customer portal: invoices, statements, tickets, signed documents; portal users need no licence | Planned | FS-026 | 1 |
| BS-04 | Bank and mobile-money statements reconciled into Odoo accounting, through SME Recon | Planned | sme-recon SR-10 | 1 |
| BS-05 | Campaigns and templates in Odoo, delivered through Dibon's messaging, with honest delivery status written back | Planned | messaging MS-13 | 2 |
| BS-06 | Single sign-on through access (Keycloak) | Planned | access AC-02 | 1 |
| BS-07 | Questions over Odoo data through Odoo 20's MCP server: read-only, one key per person | Planned | insights IN-01; FS-156 | 1 |
| BS-08 | For institutions with a core: the core's daily totals posted to Odoo's general ledger as summarised journal entries; customer accounts stay in the core | Planned | FS-290 | 2 |
| BS-09 | Approvals inside Odoo for workflows that move no money; anything that moves money goes through the mandate engine | Planned | FS-145 | 1 |
| BS-10 | Migration from spreadsheets or a previous accounting system, with a signed-off opening balance | Planned | FS-131 | 1 |
| BS-12 | HR and payroll: contracts, leave, attendance and monthly payroll; for a Sacco or MFI, its own staff | Planned | FS-304 | 1 |
| BS-13 | Zoho implementations for businesses that prefer it, with SME Recon's Zoho wrapper for statements | Planned | FS-306; sme-recon SR-13 | 2 |
| BS-11 | Managed Odoo hosting on OLP (Odoo Launch Pad, formerly OPA), Dibon's own Odoo management platform: instances, backups, staging, upgrades | Built | Owner, 2026-10-01 (FS-293); public site opa.dibon.co.ke, unchanged by the rename (FS-336). Liquid hosting planned | 1 |

## 4 · Where it sits

**Depends on:** access (sign-on), messaging (campaigns, SMS), sme-recon
(statement feeds into accounting), mandates (money approvals), insights
(questions over Odoo data).
**Used by:** customers directly. In the architecture, Odoo is also one of
the three authorities (docs/architecture.md §2).

**Who holds which record** (docs/architecture.md §2):

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
  external signers are not counted (FS-026). Whether the Enterprise
  Agreement limits serving internal work through them is open (FS-036).
- **Hosting:** on OLP, hosted on Liquid's Azure Stack, so data stays
  in-country (FS-289, FS-293).
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
platform (BS-11), hosted locally on Liquid's Azure Stack (FS-289,
FS-293). On a customer's premises where it requires. Odoo's own cloud is
not the default: it holds data abroad.

## 10 · What it does not do

- Replace a core banking system, or hold a core's customer accounts.
- Approve anything that moves money.
- Make Odoo Dibon's software. It is Odoo's; Dibon implements, connects and
  supports it.

## 11 · Open questions

FS-036, FS-282, FS-289, FS-290, FS-291, FS-292.

## 12 · Sources

- REVIEW.md FS-002, FS-026, FS-131, FS-145, FS-156, FS-172, FS-280,
  FS-281, FS-288.
- docs/architecture.md §2, §8.
- docs/modules/sme-recon.md, messaging.md, access.md, insights.md.
- Odoo 20.0 documentation — AI MCP server.
