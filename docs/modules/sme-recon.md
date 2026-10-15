---
id: sme-recon
name: SME Recon
kind: product
status: living
released: 2026.10.15
owner: Product lead, recon
classification: Internal
audience: [sme, fintech]
depends_on: [access, recon-observability, rails, mandates, messaging, gateway, crb]
consumed_by: [business-suite, insights, mfi, identity]
review_ids: [FS-026, FS-027, FS-028, FS-033, FS-036, FS-037, FS-038, FS-095, FS-124, FS-125, FS-127, FS-130, FS-131, FS-132, FS-133, FS-134, FS-135, FS-439, FS-441, FS-522]
last_reviewed: 2026-10-08
---

# SME Recon

## 1 · In one paragraph

SME Recon will connect a business's bank accounts, mobile-money accounts
and card settlements to the ERP it already uses. Every shilling coming in
will be matched to an invoice or investment, and every shilling going
out to an expense. Payments the business approves in its ERP will be
executed by bank API or mobile money. It is planned as a standalone
product on the recon engine (FS-095), wrapped for each ERP: Odoo first,
then Zoho and others (FS-027). The accountant will work inside the ERP's
own reconciliation, not in a second tool. **Dibon will be the first
customer** (FS-033): our own accounts at NCBA, KCB, M-Pesa, Airtel Money
and T-Kash, reconciled into our own Odoo (FS-125). Banks may also offer
it to their SME customers (docs/bank-channel.md).

## 2 · Who it is for

**Segments:** SMEs that collect on several rails and reconcile by hand.
Fintechs that need the same for their operating accounts. Dibon first.
SMEs reached through their bank: a bank, microfinance bank or Sacco
offers SME Recon to its business customers, by referral first and as a
bundle once take-up is shown, with the business's books staying its own
(docs/bank-channel.md; FS-439, FS-441). KCB and National Bank of Kenya,
current customers, are the first candidates (CU-03, CU-04).

**The problem, concretely:** the accountant downloads statements from
each bank and each mobile-money portal, then matches them line by line
against invoices and bills. M-Pesa receipts arrive with a reference the
payer typed, often wrong. Bank charges and excise duty are buried in the
statement. Paying a supplier means re-keying the bill into the bank's
portal, so the ERP never knows for certain whether it was paid.

**People who use it:**

| Role | What they need from it |
|---|---|
| Accountant | Statements in the ERP without downloading them; matches proposed, exceptions listed; charges posted without manual work |
| Finance approver | Approve payments in the ERP, and know they were executed |
| Owner or manager | One view of balances across every account; what is unpaid and what is unapplied |
| Auditor | Every match traceable to the bank's own reference; nothing edited after the fact |

## 3 · What it does

**There is no specification beyond the owner's description (FS-028).**
Every row is **Planned**.

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| SR-01 | Bank statements by file (MT940, CAMT.053, CSV) and by API, from the business's own banks | Planned | FS-028, FS-038. Requested from Dibon's own banks (FS-125) | 1 |
| SR-02 | Real-time notifications of credits and debits, where the bank or operator offers them | Planned | FS-028 | 1 |
| SR-03 | Mobile money (M-Pesa, Airtel Money, T-Kash) by direct integration with the business's own shortcode | Planned | FS-124. Depends on delegated access — FS-127 | 1 |
| SR-04 | Card settlements matched gross to net of fees | Planned | recon-observability RO-20 | 2 |
| SR-05 | Balances across every connected account in one view | Planned | FS-028 | 1 |
| SR-06 | Incoming funds matched to customer invoices: partial payments, overpayments, and one payment across several invoices | Planned | FS-028. Matching rules in docs/architecture/README.md §5 | 1 |
| SR-07 | Incoming funds matched to investments: interest, maturities, dividends | Planned | FS-028 | 2 |
| SR-08 | Outgoing funds matched to vendor bills and expenses. Bank charges and taxes, where itemised, posted as expense lines | Planned | FS-028 | 1 |
| SR-09 | Anything unmatched stays unapplied and visible in the ERP | Planned | docs/architecture/README.md §5 | 1 |
| SR-10 | Matches written into the ERP's own bank reconciliation | Planned | FS-027 | 1 |
| SR-11 | Payments approved in the ERP executed by bank API or mobile money (B2C, B2B) | Planned | FS-028. Regulatory and control questions — FS-037, FS-132 | 2 |
| SR-12 | Payment outcome written back to the ERP; a failure becomes an exception | Planned | FS-028 | 2 |
| SR-13 | Zoho wrapper | Planned | FS-027 | 3 |
| SR-14 | Further ERP wrappers | Planned | FS-027. Which ones is a market question — FS-134 | later |

## 4 · Where it sits

**Depends on:** access (sign-on, and the approver's re-authentication,
FS-132), recon-observability (the engine), rails (bank, mobile-money and
card feeds), mandates (approval of payments, SR-11), messaging, gateway
(incoming merchant payments, for businesses that collect through it). Also crb (individual lookups from the ERP).
**Used by:** business-suite (statement feeds into accounting), insights
(its metrics), mfi (confirmed invoices for LPO and invoice financing,
MF-32) and identity (statements from source, with consent, ID-18). Otherwise it is the product an SME buys, directly
or through its bank (docs/bank-channel.md).

**Who holds which record** (docs/architecture/README.md §2):

| Record | System of record | This module |
|---|---|---|
| Funds and balances | The business's own banks and mobile-money accounts | **Never holds.** Reads; instructs payments on approval |
| Invoices, bills, expenses, customers, suppliers | The ERP | References by id |
| Payments and reconciliation entries | The ERP | **Writes** on a confirmed match or executed payment. The ERP's books stay the business's books |
| Raw statement lines, matches, exceptions | Recon engine | Holds. Append-only |
| Bank and mobile-money credentials | SME Recon, server-side | Holds. Restricted |

**What this module never stores:** a balance it treats as authoritative,
or a copy of the ERP's customers and invoices beyond the ids it matched
against.

**The difference from GateKeepr's integrated mode, stated:** there, we read
and write nothing. Here we **do** write into the ERP, because writing the
reconciliation is the product. Every write is a new entry the ERP can
show, and an edit made in the ERP afterwards is an event we read, never
one we overwrite (FS-133).

**Under each ledger mode.** For an SME, the ledger is the ERP's books.

| | Integrated — the business has an ERP | Native — it has none |
|---|---|---|
| Where entries are posted | Its own Odoo or Zoho, through the wrapper | An Odoo we implement for it, as integration partners — FS-131 |
| What differs in this module | Matches land in the ERP's own reconciliation | The same, in an Odoo we set up |
| What the customer must provide | ERP API access; its bank and shortcode credentials, or delegated access | Its accounts' access; an Odoo subscription |
| Who it suits | SMEs already on Odoo or Zoho | SMEs on spreadsheets or desktop accounting |

## 5 · How it works

```
  BANKS              MOBILE MONEY            CARD ACQUIRER
  files + APIs       M-Pesa . Airtel .       settlement
  NCBA . KCB . ...   T-Kash (direct)         files
       |                   |                       |
       +-------------------+-----------------------+
                           |
                 +-------------------+
                 |  RECON ENGINE     |  match against the ERP's
                 |  ingest . match   |  open invoices, bills,
                 |  exceptions       |  investments
                 +-------------------+
                    |             ^
     confirmed match|             | open items, edits made in the ERP
                    v             |
                 +-------------------+
                 |  ERP WRAPPER      |  Odoo first; Zoho next
                 +-------------------+
                    |             ^
                    v             |
                 +-------------------+
                 |  THE ERP          |  reconciled lines; unapplied
                 |  (the books)      |  lines stay visible
                 +-------------------+
                           |
                 bill approved, approver re-authenticated (FS-132)
                           |
                           v
                 payment instruction --> bank API / M-Pesa B2B, B2C
                 outcome --> back to the ERP; a failure is an exception
```

**Matching, in order** (docs/architecture/README.md §5): the strongest key first
— the paying phone number for mobile money, the invoice number where the
payer gave it, then amount and date. One payment against several invoices
is an allocation the accountant makes, not one the engine guesses.

## 6 · Rails and integrations

| Rail / system | Direction | Feed | Status |
|---|---|---|---|
| Business's banks (NCBA, KCB first) | in / out | statement file; API; payment initiation | Planned — requested (FS-125) |
| M-Pesa | in / out | Daraja callbacks; statements; B2C, B2B | Planned — FS-127 |
| Airtel Money, T-Kash | in / out | callbacks; statements; disbursements | Planned — FS-125 |
| Card acquirer | in | settlement file | Planned (SR-04) |
| Odoo | in / out | external API | Planned — FS-130 |
| Zoho Books | in / out | API | Planned (SR-13) |

## 7 · Regulatory position

- **Custody:** none. Funds stay in the business's own accounts.
- **Pattern:** pass-through for matching; **initiation** for SR-11. We
  instruct payments from the business's own account on its approval
  (docs/architecture/README.md §3). The NPS Act position on initiation is open —
  FS-037.
- **Licence relied on:** none of ours, subject to FS-037.
- **Delegated access:** reading a client's shortcode or bank account needs
  the operator's and the bank's terms for third-party access, as well as
  the client's consent — FS-127.
- **Data:** the business's customers, suppliers and transactions are
  Confidential. Credentials are Restricted and never leave our servers.
  The business is the data controller; we are its processor.

## 8 · Controls

- **Attribution at the act** (docs/architecture/README.md §7). Approving a
  payment in the ERP moves money. An ERP login session does not show who
  approved at that moment, so execution waits for the approver to
  re-authenticate with us (a PIN or one-time code), or for the bank's own
  approval — FS-132.
- **Mandates:** payments run through the mandate engine, with tiers by
  amount. Where the bank also enforces the account's signing mandate,
  both apply.
- **Never overwrite the ERP.** A match written into the ERP and later
  undone there is a new event; the engine reopens the item and does not
  re-apply it.
- **Unmatched stays unapplied.** Nothing is posted to a suspense or
  "sundry" account to make a report balance.

## 9 · Deployment

A multi-tenant service we operate on Liquid's Azure Stack (FS-032), with
one connector per ERP. **Whether the Odoo wrapper is an installed module
or uses Odoo's external API decides which Odoo customers we can serve.**
Hosted Odoo Online may not allow custom modules, and its external API may
need a higher plan — FS-130.

## 10 · What it does not do

- Hold funds, or act as the books. The ERP stays the books.
- Replace the ERP's accounting, or the accountant's judgement on
  allocations.
- Approve payments. It executes approvals made in the ERP, once attributed.
- Guess a match, or post differences to suspense.

## 11 · Open questions

FS-037, FS-127, FS-130, FS-131, FS-133, FS-134, FS-135.

## 12 · Sources

- REVIEW.md FS-027, FS-028 (the owner's description), FS-033, FS-095,
  FS-124, FS-125.
- docs/architecture/README.md §2, §3, §5, §7.
- docs/modules/recon-observability.md §4 (institution and SME compared).
- docs/outreach/api-requests.md (feeds requested for Dibon's own
  accounts).
- docs/bank-channel.md (banks offering SME Recon to their SME customers).
