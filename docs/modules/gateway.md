---
id: gateway
name: Kapu Pay Gateway
kind: product
version: 0.1.0
owner: Product lead, Kapu
classification: Internal
audience: [sme, fintech, mfi, sacco]
depends_on: [rails, recon-observability, messaging, mandates, identity]
consumed_by: [sme-recon, mfi, sacco]
review_ids: [FS-011, FS-031, FS-061, FS-088, FS-089, FS-090, FS-091, FS-092, FS-093, FS-094, FS-102, FS-339]
last_reviewed: 2026-10-01
---

# Kapu Pay Gateway

## 1 · In one paragraph

The Kapu Pay Gateway gives a merchant one API, and one dashboard, for
taking payments on every rail it needs: M-Pesa, Airtel Money, T-Cash,
PesaLink and cards. Every payment is reconciled automatically. Without it,
a merchant integrates each rail separately and reconciles each one by hand.
The Gateway starts in **pass-through** mode: funds go into the merchant's
own accounts and shortcodes, and we hold none of them. Collecting and
settling on a merchant's behalf is regulated, so it waits for a PSP licence
or a licensed partner (FS-031, FS-061). Kapu's own products are meant to be
its first users, so the Gateway is proved on our traffic before a merchant
depends on it.

## 2 · Who it is for

**Segments:** SMEs and fintechs that take payments on more than one rail.
Also MFIs and Saccos taking repayments and contributions. Dibon's own
products come first (8 Jun meeting).

**The problem, concretely:** each rail has its own integration, its own
statement format and its own failure behaviour. A merchant taking M-Pesa
and cards today runs two integrations and two reconciliations. Neither ties
to its invoices without manual work. Smaller merchants often have no
shortcode of their own, and that is the reason aggregation is
commercially attractive (FS-094).

**People who use it:**

| Role | What they need from it |
|---|---|
| Merchant developer | One API, sandbox credentials, signed callbacks, idempotent requests |
| Merchant finance | Every payment matched to what it paid for, and the exceptions listed. A dashboard; an export into their ERP |
| Merchant's customer | A payment prompt or a payment link that works on the rail they have |
| Our operations team | Rail health, failure rates and open exceptions, per merchant and per rail |

## 3 · What it does

**There is no specification for the Gateway in this folder.** Every row
below comes from the 8 Jun meeting, which records intentions. All are
therefore **Planned**. The MFI PRD calls some of the underlying rail
integrations "existing", which conflicts with the meeting's list of
outstanding go-live work — FS-088.

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| GW-01 | One collections API for M-Pesa and Airtel Money | Planned | 8 Jun: Phase 2 starts with M-Pesa and Airtel Money | 2 |
| GW-02 | T-Kash on the same API | Planned | 8 Jun: confirmed it can join the other mobile-money channels | 2 |
| GW-03 | Card payments | Planned | 8 Jun: Phase 3. No acquirer chosen — FS-091 | 3 |
| GW-04 | PesaLink | Planned | 8 Jun: Phase 3; sponsor-bank trust accounts outstanding | 3 |
| GW-05 | Merchant dashboard | Planned | 8 Jun: named as part of the Gateway | 2 |
| GW-06 | Automatic reconciliation of every merchant payment | Planned | 8 Jun: "a reconciliation engine". Delivered by recon-observability | 2 |
| GW-07 | Payment links, e.g. an invoice sent by SMS | Planned | 8 Jun: proposed by the commercial lead | 2 |
| GW-08 | Kapu's own products and Odoo routed through the Gateway first | Planned | 8 Jun: Kapu must be the first consumer of its own Gateway | 2 |
| GW-09 | Fraud detection and monitoring, designed in from the start | Planned | 8 Jun: must not be retrofitted | 2 |
| GW-10 | Settlement to merchants (aggregation) | Planned | 8 Jun: the long-term goal, once a PSP licence is held. Interim route under FS-061 | later |
| GW-11 | Payouts to the merchant's customers (refunds, disbursements) | Planned | **Not stated for the Gateway in any source** — FS-089 | — |

## 4 · Where it sits

**Depends on:** rails (every channel), recon-observability (GW-06, GW-09),
messaging (payment-link SMS; merchant callbacks stay in the Gateway API), mandates (payout
approval, if GW-11 is in scope), identity (merchant onboarding checks —
FS-090).
**Used by:** sme-recon, for incoming funds; mfi and sacco, for repayments
and contributions; Dibon's own products (GW-08).

**Who holds which record** (docs/architecture.md §2):

| Record | System of record | This module |
|---|---|---|
| Funds, in pass-through | The merchant's own accounts and shortcodes, at the rail or bank | **Never holds.** Reads the confirmation |
| Funds, in aggregation | A settlement account at a licensed institution, under a licence | Not built until FS-061 is settled |
| Merchants, as parties | Odoo | References by id |
| Payment requests and their states | Gateway | Holds, keyed on the merchant's request id and the rail's reference |
| Merchant API credentials, callback secrets | Gateway | Holds. Restricted |
| Matches and exceptions | Recon engine | Feeds |

**What this module never stores:** card numbers, and a balance owed to a
merchant while it runs in pass-through.

**Under each ledger mode.** The Gateway's customers are mostly merchants,
not institutions. For a merchant, what matters is **whose account receives
the funds**. The core-or-no-core question applies only when the merchant is
itself an institution.

| | Integrated — the customer has its own ledger | Native — it does not |
|---|---|---|
| Where funds are posted | The merchant's own shortcodes and accounts, including a bank collection account ("Lipa na Bank": the bank's paybill, the merchant's account number, FS-339). For an institution, its core | **Pass-through still**: the merchant's own shortcodes, or its bank's collection account. A merchant with neither cannot be served until aggregation is licensed (FS-094) |
| What differs in this module | Matched payments are pushed into the merchant's ERP or core through sme-recon or a core adapter | The dashboard and exports are the merchant's only record |
| What the customer must provide | Its shortcodes or till numbers, rail credentials or delegated access, ERP access | Its shortcodes or till numbers |
| Who it suits | SMEs on Odoo or Zoho; MFIs and Saccos with a core | Small merchants without an ERP |

## 5 · How it works

A merchant calls one API and names the rail. The Gateway prompts the
payer, waits for the rail's confirmation and calls the merchant back. Every
event goes to the recon engine. A confirmation that never arrives is an
exception; it is not treated as a failure or a success.

**Collection, in pass-through:**

```
  Merchant     Gateway         Rail            Payer          Recon
     |            |              |               |              |
     | collect    |              |               |              |
     |----------->| prompt       |               |              |
     |  accepted  |------------->| PIN prompt    |              |
     |<-----------|              |-------------->|              |
     |            |              |      PIN      |              |
     |            | confirmation |<--------------|              |
     |            |<-------------|                              |
     |            | event --------------------------------------->|
     | callback   |                                             |
     |<-----------|   funds settle to the MERCHANT's account,   |
     |            |   never to ours                             |
     |            |                                             |
     |            |   no confirmation in time: an open          |
     |            |   exception in recon, never a guess         |
```

## 6 · Rails and integrations

| Rail / system | Direction | Feed | Status |
|---|---|---|---|
| M-Pesa | in | real-time callback; organisation statement file for end-of-day | Planned (GW-01) |
| Airtel Money | in | real-time callback; statement file | Planned (GW-01) |
| T-Kash | in | real-time callback | Planned (GW-02) |
| Cards | in | acquirer callback; settlement file | Planned (GW-03) — FS-091 |
| PesaLink | in | through the sponsor bank's API | Planned (GW-04) |
| Merchant ERP | out | through sme-recon | Planned |

Rail integrations are shared with Collect. They belong in the rails module
and are written once there — FS-093.

## 7 · Regulatory position

- **Custody:** none in pass-through. **Aggregation puts funds under our
  control, however briefly, and is regulated** (docs/architecture.md §3).
- **Licence relied on:** in pass-through, none of ours; each merchant uses
  its own shortcodes. For aggregation: the PSP licence (FS-031), or in the
  meantime a payment-facilitator agreement with a licensed gateway
  provider — whether that covers it is FS-061. A processing partner that
  settles to merchants under its own licence is a third route (FS-102).
- **Cards:** card numbers never touch our systems. The acquirer's hosted
  payment page or tokenisation keeps us out of the cardholder-data
  environment. This is a design constraint that holds whichever acquirer
  is chosen (FS-091).
- **Regulators:** CBK (the NPS Act; PSP authorisation for aggregation).
  ODPC for payers' personal data.
- **Data:** payer phone numbers and names are Confidential. Merchant
  credentials and callback secrets are Restricted.
- **Open legal checks:** FS-061, FS-094.

## 8 · Controls

- **Idempotency:** every request carries the merchant's own id. A repeat
  returns the first outcome; it never starts a second payment.
- **Signed callbacks:** the merchant can verify that a callback came from
  us.
- **Attribution:** refunds, payouts (GW-11) and changes to a merchant's
  credentials or callback URL are authenticated at the moment of the act.
- **Mandates:** payouts, if in scope, run through the mandate engine with
  maker-checker.
- **Exceptions:** a prompt with no confirmation, a confirmation with no
  request, or an amount that differs: all three are recon exceptions,
  visible to the merchant and to us.

## 9 · Deployment

**Not stated in any source** — FS-092. Collect runs inside an institution.
The Gateway serves many merchants, so it is more likely a multi-tenant
service we operate on Liquid's Azure Stack (FS-032). That is an inference,
not a decision.

## 10 · What it does not do

- Hold merchant funds, until aggregation is licensed (GW-10).
- See or store card numbers.
- Replace the merchant's ERP. It feeds one, through sme-recon.
- Lend, or take deposits. Those belong to mfi, sacco and collect.
- Onboarding and KYB checks for merchants are not specified — FS-090.

## 11 · Open questions

FS-011, FS-061, FS-088, FS-089, FS-090, FS-091, FS-092, FS-093, FS-094,
FS-102.

## 12 · Sources

- Kapu Pay strategy discussion, 8 Jun 2026 — anonymised notes
  (sources/kapu/meeting-2026-06-08-anonymized.md).
- Kapu Pay MFI PRD section, Draft v0.2, Jun 2026 — §4, the capability
  table.
- docs/architecture.md §2, §3, §5.
