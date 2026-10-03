---
id: rails
name: Rails — payment and bank integrations
kind: shared-service
version: 0.1.0
owner: Solution architect
classification: Internal
audience: [bank, sacco, mfi, psp, imt, sme, fintech]
depends_on: [access, recon-observability]
consumed_by: [collect, gateway, mfi, sacco, sme-recon, escrow, mandates, recon-observability]
review_ids: [FS-038, FS-056, FS-088, FS-093, FS-102, FS-124, FS-125, FS-127, FS-179, FS-208, FS-209, FS-210, FS-211, FS-212, FS-384]
last_reviewed: 2026-10-01
---

# Rails — payment and bank integrations

## 1 · In one paragraph

Rails is where every connection to a payment rail or a bank lives, written
once and used by every product (FS-093). Mobile money (M-Pesa, Airtel
Money, T-Kash, by direct integration — FS-124), PesaLink, banks' APIs and
statement files, card acquiring, and payment processors all sit behind
**one interface**: collect, pay out, query status, check a balance, fetch
a statement, reverse. Each call produces **one normalised event**, which
always carries the rail's own reference. Three rules hold on every rail.
**An unconfirmed outcome is unknown, never failed or succeeded.**
Credentials never leave the server. A rail that cannot prove a callback
came from it gets the callback confirmed before it counts.

## 2 · Who it is for

**Segments:** every product. Customers never see rails directly; they see
the products that use them.

**The problem, concretely:** each product would otherwise integrate M-Pesa
in its own way, with its own idea of what a timeout means. The FlexMoney
prototype's central break is exactly this. A payout was accepted by the
rail, the callback never came, and the money sat in suspense until someone
asked the rail directly.

**People who use it:**

| Role | What they need from it |
|---|---|
| Product (system) | One interface across rails; truthful outcomes; the rail's reference on everything |
| Our operations team | Rail health, latency and failure rates; which rail is degraded right now |
| Institution (indirectly) | Its own shortcodes and accounts, used under its own credentials |
| Recon engine | Every event, normalised, with both our id and the rail's |

## 3 · What it does

**Status:** where the Kapu technical documentation describes a rail's
flows, the row is **Designed**. Whether those integrations are built is
disputed between sources (FS-088), so nothing is higher than Designed.

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| RL-01 | One adapter interface: collect, pay out, status, balance, statement, reversal | Planned | FS-093 — FS-208 | 1 |
| RL-02 | One normalised event per call, carrying the rail's own reference as a field, never in a note | Designed | docs/architecture.md §2 | 1 |
| RL-03 | M-Pesa (Daraja) collections: push prompt, C2B validation and confirmation | Built | Ran in production at a Kenyan bank, Feb 2025 to Jun 2026, in Collect and the Gateway (owner, 2026-10-03, FS-384) | 1 |
| RL-04 | Airtel Money: collections, disbursements, enquiry, balance, refunds | Designed | Kapu technical documentation lists the channel; MFI PRD §4. Outreach Email 3 | 1 |
| RL-05 | T-Kash | Designed | Kapu technical documentation lists the channel. Outreach Email 4 | 1 |
| RL-06 | PesaLink, through the sponsor bank's API | Planned | 8 Jun: trust accounts outstanding | 2 |
| RL-07 | Bank APIs and statement files (MT940, CAMT.053, CSV), per bank; Dibon's own banks first | Planned | FS-125; outreach Email 1 | 1 |
| RL-08 | Card acquiring through an aggregator or acquirer; card numbers never reach us | Planned | partners.md SD-01, SD-03 | 3 |
| RL-09 | Processor settlement reports, gross to net of fees | Planned | FS-102; recon-observability RO-20 | 2 |
| RL-10 | **Unknown is a state.** A timeout is pending until a status query or a statement settles it | Designed | Prospect prototype, Transaction Trace; docs/architecture.md §5 | 1 |
| RL-11 | A callback the rail does not sign is confirmed by status query, or by source checks, before it is final | Planned | FS-209 | 1 |
| RL-12 | Credentials per customer, held server-side in a vault; never on a device, in an app or in a browser | Designed | docs/architecture.md §3 | 1 |
| RL-13 | Delegated access to a customer's own shortcode or bank account, under its written consent | Planned | FS-127 | 1 |
| RL-14 | Idempotency: our request id carried to the rail's own idempotency key where it has one; a repeat never pays twice | Planned | collect §8 (code 5001) | 1 |
| RL-15 | Rail health, latency and failure rates to observability; a degraded rail is paused, not hammered | Planned | recon-observability RO-16, RO-17 | 1 |
| RL-16 | Debit-mandate registration, where a rail supports it | Planned | mandates MD-14; FS-046 | 2 |
| RL-17 | A simulator per rail, for tests and demos, that can produce every outcome including silence | Planned | FS-211 | 1 |
| RL-18 | Rails in other countries: MTN MoMo, Vodacom M-Pesa, EcoCash, the Airtel group | Planned | partners.md PT-11 to PT-13, PT-03 | later |
| RL-19 | M-Pesa (Daraja) payouts and operations: B2C, B2B, transaction status, balance, reversal | Designed | Kapu technical documentation: deposit and withdrawal flows; collect CO-05, CO-06. Outreach Email 2 | 1 |

## 4 · Where it sits

**Depends on:** access (whose credentials, on whose behalf),
recon-observability (events in; health out).
**Used by:** collect, gateway, mfi, sacco, sme-recon, escrow, mandates (debit
registration), recon-observability (status queries and statement pulls for
remediation).

**Who holds which record** (docs/architecture.md §2):

| Record | System of record | This module |
|---|---|---|
| Funds | The rail or bank, in the account of whoever owns the shortcode or account | **Never holds.** Instructs on the owner's credentials |
| Rail events, normalised | Recon engine | Emits them, once each |
| Every call to a rail: request, response, timing | **Rails** | Holds. Append-only; no secrets in it |
| Credentials per customer and rail | **Rails, in a vault** | Holds. Restricted |
| Which customer owns which shortcode or account | Odoo (the contract) and access (the delegation) | References by id |

**What this module never stores:** a balance as an authority, or a
credential outside the vault.

**Under each ledger mode:** rails never post to a ledger. The product that
called it posts to the core in integrated mode, or to Fineract in native
mode.

## 5 · How it works

```
  collect . gateway . mfi . sacco . sme-recon . escrow . mandates
                              |
                   one interface (RL-01)
                              |
     +----------+----------+--+-------+-----------+-------------+
     |          |          |          |           |             |
   M-Pesa    Airtel     T-Kash    PesaLink     banks:        cards and
   Daraja    Money                (sponsor     API +         processors
                                   bank)       statements    (partners)
     |          |          |          |           |             |
     +----------+----------+----------+-----------+-------------+
                              |
                credentials from the vault, per customer
                              |
      outcome:  confirmed ---------> normalised event --> recon
                rejected  ---------> normalised event --> recon
                no answer ---------> PENDING --> status query
                                        --> confirmed / rejected
                                        --> still unknown: exception
```

## 6 · Rails and integrations

| Rail / system | Direction | Feed | Status |
|---|---|---|---|
| M-Pesa (Daraja) | in / out | callback; status query; statement | Designed (RL-03) |
| Airtel Money | in / out | callback; enquiry; statement | Designed (RL-04) |
| T-Kash | in / out | callback; statement | Designed (RL-05) |
| PesaLink | in / out | sponsor bank's API | Planned (RL-06) |
| Banks (NCBA, KCB first) | in / out | API; MT940, CAMT.053 or CSV files | Planned (RL-07) |
| Card acquirer or aggregator | in | callback; settlement file | Planned (RL-08) |
| Payment processors | in | settlement report | Planned (RL-09) |
| Other countries' rails | in / out | per rail | Planned (RL-18) |

## 7 · Regulatory position

- **Custody:** none of ours. Each call uses the credentials of the owner of
  the shortcode or account. The custody pattern is the calling product's
  (docs/architecture.md §3). **The shortcode owner decides it** (FS-056).
- **Operator agreements:** each shortcode carries the owner's agreement
  with the operator. Acting on a customer's shortcode needs the operator's
  terms for third parties and the customer's consent — FS-127.
- **Saccos:** SASRA's 2023 letter, as reported, requires Saccos and their
  vendors integrating with M-Pesa to operate under an umbrella fraud
  detection provider — FS-210.
- **Data:** payer names and numbers are Confidential. Credentials are
  Restricted.

## 8 · Controls

- **Unknown stays unknown** (RL-10). Nothing downstream treats a timeout as
  a result.
- **Nothing pays twice** (RL-14).
- **Callbacks are verified** (RL-11).
- **Credentials never leave the server** (RL-12): "anyone can unpack an
  app" (GateKeepr brief, carried over).
- **A degraded rail is paused** (RL-15), and the products that depend on it
  are told, rather than piling up retries.

## 9 · Deployment

Part of the shared platform, in-country, on Liquid's Azure Stack (FS-032).
Some rails require fixed source addresses or private links; those come from
the in-country deployment.

## 10 · What it does not do

- Hold funds, or decide whether a payment should happen. Products and
  mandates decide.
- Run campaigns or messages. That is messaging.
- Connect to RTGS or the clearing house directly. Dibon is not a bank; bank
  transfers go through banks' APIs — FS-212.

## 11 · Open questions

FS-056, FS-088, FS-127, FS-208, FS-209, FS-210, FS-211, FS-212.

## 12 · Sources

- Kapu Pay Technical Documentation, v1.0, Apr 2026 — channels, deposit and
  withdrawal flows. *Derived, not reproduced.*
- Kapu Pay MFI PRD section, Draft v0.2, Jun 2026 — §4.
- Prospect reconciliation prototype, Aug 2026 — Transaction Trace.
  *Derived, not reproduced.*
- docs/outreach/api-requests.md; docs/partners.md.
- docs/architecture.md §2, §3, §5.
