---
id: rails
name: Rails — payment and bank integrations
kind: shared-service
version: 0.1.0
owner: Solution architect
classification: Internal
audience: [bank, sacco, mfi, psp, imt, sme, fintech]
depends_on: [access, recon-observability]
consumed_by: [collect, gateway, mfi, sacco, sme-recon, escrow, mandates, recon-observability, core, omni-channel, financial-crime, identity]
review_ids: [FS-038, FS-056, FS-088, FS-093, FS-102, FS-124, FS-125, FS-127, FS-179, FS-208, FS-209, FS-210, FS-211, FS-212, FS-384, FS-386, FS-387, FS-390, FS-391, FS-393, FS-403, FS-407, FS-408, FS-448, FS-453, FS-523, FS-585, FS-586, FS-587, FS-588, FS-594, FS-611, FS-661]
last_reviewed: 2026-10-08
---

# Rails — payment and bank integrations

## 1 · In one paragraph

Rails is where every connection to a payment rail or a bank lives, written
once and used by every product (FS-093). M-Pesa is built: it ran in
production at Onit Bank, Feb 2025 to Jun 2026 (RL-03, RL-19). Airtel
Money and T-Kash, integrated directly (FS-124), are designed and part of
v1 with it (FS-407); PesaLink, banks' APIs and statement files, card
acquiring and payment processors are coming soon (FS-408). All of them
will sit behind **one interface**: collect, pay out, query status, check
a balance, fetch a statement, reverse. Each call is designed to produce
**one normalised event**, which always carries the rail's own reference.
Three rules will hold on every rail. **An unconfirmed outcome is
unknown, never failed or succeeded.** Credentials never leave the
server. A rail that cannot prove a callback came from it gets the
callback confirmed before it counts.

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

**Status:** RL-03 and RL-19 are **Built**. They ran in production at Onit
Bank, Feb 2025 to Jun 2026, in Collect and the Gateway; the evidence is
the Onit API technical documentation (FS-384, FS-390). Where the Kapu
technical documentation describes another rail's flows, the row is
**Designed**. Airtel Money was probably built for Onit Bank but never
launched; its row stays Designed until that is confirmed (FS-393).

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| RL-01 | One adapter interface: collect, pay out, status, balance, statement, cancel, recall, reversal. Every payout is an instruction with one id from approval to settlement, carried to the rail as its reference: approved, released, sent, accepted or rejected, debited, settled; held by a rule until it may go; pending when no answer comes, settled by a status query, never resent blind. Cancelled before the rail processes it; recalled after, where the rail allows, with the outcome recorded; returned by the receiving side (account closed, name mismatch) with the funds back. A reversal is a new instruction linked to the original, never an edit of it: requested under maker-checker, through the rail's own reversal where it has one (M-Pesa's, RL-03) or a recall request, reversed in full, in part, or refused, each within the rail's time limit; the customer's posting is reversed by an entry, never deleted, and only when the money is back. A reversal or recall returns money only to where it came from, never to a new destination. What is approved is what is sent: the approval records a hash of the amount, currency, payee name, account or number, rail and reference, and the adapter refuses to send an instruction whose hash differs; any change re-opens approval (FS-588). A payout queued during an outage is released only after the rail's statement shows no manual payment of it (FS-661) | Planned | FS-093 — FS-208. Owner, 2026-10-06: in R1, with the lifecycle, cancellation, recall and reversals (FS-586, FS-587) | 1 |
| RL-02 | One normalised event per call, carrying the rail's own reference as a field, never in a note | Designed | docs/architecture/README.md §2 | 1 |
| RL-03 | M-Pesa (Daraja): M-Pesa Express push prompt, C2B validation and confirmation, B2C, transaction status, account balance, reversal | Built | Ran in production at Onit Bank, Feb 2025 to Jun 2026, in Collect and the Gateway (owner, 2026-10-03, FS-384, FS-387, FS-391) | 1 |
| RL-04 | Airtel Money: collections, disbursements, enquiry, balance, refunds | Designed | Kapu technical documentation lists the channel; MFI PRD §4. Outreach Email 3. Owner, 2026-10-03: the Airtel API integration was probably built for Onit Bank but never launched; to confirm with the technical lead (FS-393) | 1 |
| RL-05 | T-Kash | Designed | Kapu technical documentation lists the channel. Outreach Email 4 | 1 |
| RL-06 | PesaLink, through the sponsor bank's API | Planned | 8 Jun: trust accounts outstanding | 2 |
| RL-07 | Bank APIs and statement files (MT940, CAMT.053, CSV), per bank; Dibon's own banks first. Instructions reach each bank by the channel it offers: its API; host-to-host files over SFTP (ISO 20022 payment initiation out, status reports back); or a bulk-payment file uploaded to internet banking and released there by the institution's signatories, R1's fallback until a bank grants more. Whichever channel, the bank's status and its statement close the instruction (RL-01), and the bank-side release is linked to the approval that preceded it. Tiered (FS-594): within limits a bank agrees by mandate letter, a signed instruction from the institution's chain is released straight through; above them, or by the internet-banking stopgap, the institution's signatories also release it at the bank, checking the file's totals and hash, so the second approval is not a formality. Both paths are built once; which applies is configuration, per institution and bank account: the limit from that bank's mandate letter, effective-dated and changed under maker-checker (FS-611). Each instruction or file is signed with the institution's key, or the certificate its bank issues, used inside OpenBao and never exported (RL-12), over mutual TLS to each bank. The internet-banking file carries its line count, total and hash on the approval record; it is downloaded only to a managed device, never emailed, and deleted after upload; the signatories check the totals in the bank's portal before release; when the statement arrives, every line is compared with what was approved, and an extra or altered line is an incident (FS-588) | Planned | FS-125; outreach Email 1; a customer's own request to its banks (docs/outreach/bank-access-request.md, FS-586) | 1 |
| RL-08 | Card acquiring through an aggregator or acquirer; card numbers never reach us | Planned | partners.md SD-01, SD-03 | 3 |
| RL-09 | Processor settlement reports, gross to net of fees | Planned | FS-102; recon-observability RO-20 | 2 |
| RL-10 | **Unknown is a state.** A timeout is pending until a status query or a statement settles it | Designed | Prospect prototype, Transaction Trace; docs/architecture/README.md §5 | 1 |
| RL-11 | A callback the rail does not sign is confirmed by status query, or by source checks, before it is final | Planned | FS-209 | 1 |
| RL-12 | Credentials per customer, held server-side in OpenBao; never on a device, in an app or in a browser. Signing keys for instructions to banks are used inside OpenBao's transit engine and never exported (FS-588) | Designed | docs/architecture/README.md §3 and §6; OpenBao, not HashiCorp Vault, for licence reasons (FS-403). The Onit Bank deployment used Vault; OpenBao keeps its API | 1 |
| RL-13 | Delegated access to a customer's own shortcode or bank account, under its written consent | Planned | FS-127 | 1 |
| RL-14 | Idempotency: our request id carried to the rail's own idempotency key where it has one; a repeat never pays twice | Planned | collect §8 (code 5001) | 1 |
| RL-15 | Rail health, latency and failure rates to observability; a degraded rail is paused, not hammered | Planned | recon-observability RO-16, RO-17 | 1 |
| RL-16 | Debit-mandate registration, where a rail supports it | Planned | mandates MD-14; FS-046 | 2 |
| RL-17 | A simulator per rail, for tests and demos, that can produce every outcome including silence | Planned | FS-211 | 1 |
| RL-18 | Rails in other countries: MTN MoMo, Vodacom M-Pesa, EcoCash, the Airtel group | Planned | partners.md PT-11 to PT-13, PT-03 | later |
| RL-19 | M-Pesa (Daraja) B2B: payments to another paybill or till | Built | Onit API technical documentation (Feb 2025, held outside git); in production at Onit Bank, Feb 2025 to Jun 2026 (FS-384, FS-390): the B2C service also carried B2B | 1 |
| RL-20 | M-Pesa Pull Transactions: fetch a shortcode's transactions, so a missed callback is found and matched, not lost | Planned | Daraja API list (FS-387); recon-observability | 1 |
| RL-21 | M-Pesa Hakikisha (B2C and B2B): the recipient's registered name before a payout is sent | Planned | Daraja API list (FS-387); identity ID-05 | 1 |
| RL-22 | Safaricom SIM-swap query and IMSI check before money moves | Planned | Daraja security APIs for authorised partners (FS-386, FS-387); omni-channel step-up. Feeds the SIM controls: identity ID-12 to ID-14 and the hold on an IMSI change, financial-crime FC-02 (FS-448, FS-453) | 1 |
| RL-23 | M-Pesa Ratiba: standing orders the customer authorises on M-Pesa, for loan repayments and contributions | Planned | Daraja API list (FS-387); mandates MD-14, RL-16 | 2 |
| RL-24 | M-Pesa Dynamic QR, B2B Express Checkout and Business to Pochi, for merchant and small-trader payments | Planned | Daraja API list (FS-387); gateway | 2 |
| RL-25 | M-Pesa Bill Manager and Tax Remittance: invoices with reminders, and KRA payments from a shortcode | Planned | Daraja API list (FS-387); sme-recon, business-suite | 2 |
| RL-26 | Virtual cards for an institution's customers, issued through a licensed issuer-processor; card numbers never reach us. An opportunity we track, not a commitment | Planned | Owner, 2026-10-06 (FS-523). Candidates CP-16, CP-17; PCI DSS is compliance LC-11 | later |
| RL-27 | Rails reached through another bank: for an institution that sends and receives RTGS, EFT, PesaLink or SWIFT transfers through a larger bank, its settlement account there is modelled as an account of its own; that bank's cut-offs per rail are held as transaction rules on the business calendar (financial-crime FC-16, core KC-15); a transfer out is released only after a prefunding check on the settlement account; status comes from that bank's API or its statements; a return or rejection reverses the customer's posting; every wire carries the sender's and recipient's details the AML regulations require (reg 32) | Planned | Owner, 2026-10-06 (FS-585); first for the R2 partner, a microfinance bank (partners PT-34) | 1 |
| RL-28 | SWIFT through the larger bank: ISO 20022 messages (FS-424), the transfer's status tracked through that bank, incoming payment messages parsed for the beneficiary, charges and exchange rates captured for matching | Planned | Owner, 2026-10-06 (FS-585) | 2 |
| RL-29 | The account holder's name confirmed before a bank payout, through the bank's account-validation service or PesaLink's name lookup where offered; a mismatch holds the payout, as M-Pesa's Hakikisha does for mobile money (RL-21) | Planned | Owner, 2026-10-06 (FS-586); Roan Capital RC-18 | 1 |

## 4 · Where it sits

**Depends on:** access (whose credentials, on whose behalf),
recon-observability (events in; health out).
**Used by:** collect, gateway, mfi, sacco, sme-recon, escrow, mandates (debit
registration), recon-observability (status queries and statement pulls for
remediation), core (mobile-money deposits and repayments, KC-09),
omni-channel (payments and field collections, OC-18)
and financial-crime (the SIM-swap check, RL-22). Also identity.

**Who holds which record** (docs/architecture/README.md §2):

| Record | System of record | This module |
|---|---|---|
| Funds | The rail or bank, in the account of whoever owns the shortcode or account | **Never holds.** Instructs on the owner's credentials |
| Rail events, normalised | Recon engine | Emits them, once each |
| Every call to a rail: request, response, timing | **Rails** | Holds. Append-only; no secrets in it |
| Credentials per customer and rail | **Rails, in OpenBao** | Holds. Restricted |
| Which customer owns which shortcode or account | Odoo (the contract) and access (the delegation) | References by id |

**What this module never stores:** a balance as an authority, or a
credential outside OpenBao.

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
                credentials from OpenBao, per customer
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
| M-Pesa (Daraja) | in / out | callback; status query; statement | Built (RL-03, RL-19) |
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
  (docs/architecture/README.md §3). **The shortcode owner decides it** (FS-056).
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

FS-056, FS-088, FS-127, FS-208, FS-209, FS-210.

## 12 · Sources

- Kapu Pay Technical Documentation, v1.0, Apr 2026 — channels, deposit and
  withdrawal flows. *Derived, not reproduced.*
- Onit API technical documentation, Feb 2025 — what ran at Onit Bank,
  Feb 2025 to Jun 2026 (FS-390). *Held outside git; derived, not
  reproduced.*
- Kapu Pay MFI PRD section, Draft v0.2, Jun 2026 — §4.
- Prospect reconciliation prototype, Aug 2026 — Transaction Trace.
  *Derived, not reproduced.*
- docs/outreach/api-requests.md; docs/partners.md.
- docs/architecture/README.md §2, §3, §5.
