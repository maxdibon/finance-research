---
id: omni-channel
name: Omni-channel — apps, internet banking and USSD
kind: channel
version: 0.1.0
owner: Product lead, channels
classification: Internal
audience: [bank, sacco, mfi, fintech]
depends_on: [access, identity, messaging, rails, mandates, collect, mfi, sacco]
consumed_by: []
review_ids: [FS-075, FS-160, FS-167, FS-168, FS-169, FS-170, FS-171, FS-232, FS-233, FS-234, FS-235, FS-236, FS-237, FS-238, FS-320, FS-386, FS-416]
last_reviewed: 2026-10-05
---

# Omni-channel — apps, internet banking and USSD

## 1 · In one paragraph

Omni-channel is how an institution's members and customers reach their
money: a **mobile app**, **internet banking** in a browser, and **USSD**
for any phone without data. All three sit on **one channel API** over the
products, so a balance, a loan or a payment behaves the same on every
channel. Login and step-up come from access (Keycloak); KYC from identity;
payments from rails, approved through mandates where needed. A balance
shown on a phone is a read from its authority, **labelled with when it was
fetched**. The channels are white-labelled per institution. **Nothing is
drawn yet**, and no screen is built before it is drawn (FS-237).

## 2 · Who it is for

**Segments:** Saccos and MFIs first; most have no app of their own, or an
app they want replaced. Banks where they want USSD or a white-label app.
Dibon's own products where they need a member-facing surface.

**The problem, concretely:** a member walks in or phones to ask a balance,
a loan limit or whether a contribution arrived. Smaller institutions
cannot afford an app, and members on feature phones cannot use one.
Channels built separately disagree: the USSD balance is not the app
balance.

**People who use it:**

| Role | What they need from it |
|---|---|
| Member or customer, smartphone | Balances, statements, loans, contributions, payments, guarantor requests, KYC on their own |
| Member, feature phone | The essentials on USSD: balance, mini-statement, contribution, loan status |
| Guarantor | Requests to accept or decline, and their exposure |
| Institution | Its own brand on every channel; what members can do on each, set per channel |
| Our support team | What the member saw, when, and why it differs from what they expected |

## 3 · What it does

**USSD ran in production at KCB** (FS-416): Dibon's menu platform (the
Menu Management Centre) carried KCB's digital lending on USSD, with
releases from December 2022 to March 2024, until KCB moved to a platform
of its own. Rows with that evidence are **Built**; the rest are
**Planned**, because no specification or drawing exists for them.

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| OC-01 | Member mobile app, Android and iOS, white-labelled per institution | Planned | FS-022 — FS-232 | 2 |
| OC-02 | Internet banking in the browser | Planned | FS-022 | 2 |
| OC-03 | USSD menus per institution | Built | KCB release notes 3.2.3 (Dec 2022) and 3.2.34 (Mar 2024) and the MMC API specification v2.7 (Jan 2024), held in clients/kcb/ outside git: USSD menus configured per product (retailer finance, float and business overdrafts, term loans, merchant financing), with session state, routing and input validation; ran in production at KCB, 2022 to 2025 (FS-416). FS-022 — FS-233 | 1 |
| OC-04 | One channel API over the products: balances, statements, loans, contributions, payments, guarantor requests | Planned | FS-022 | 1 |
| OC-05 | Login through access: passkeys or device biometrics, one-time codes; step-up for anything that moves money | Planned | access AC-03, AC-05. At KCB, USSD used its own PIN and one-time-code lifecycle (set, reset, lock), hashed (FS-416), not the access service | 1 |
| OC-06 | Device binding, and a SIM-swap check before money moves | Planned | FS-234. Safaricom offers the check through Daraja (rails RL-22, FS-386) | 1 |
| OC-07 | Payments: deposit by mobile-money prompt, withdrawal, transfer, bill payment — through rails, with mandates where the product requires | Planned | rails RL-01; mandates | 2 |
| OC-08 | Loan applications and guarantor flows | Planned | mfi, sacco. KCB's USSD took loan requests, repayments, limits and balances against the bank's loan engine (FS-416); guarantor flows have no record | 2 |
| OC-09 | Self-service KYC: document capture, liveness | Planned | identity ID-02, ID-04 | 2 |
| OC-10 | App push, through messaging | Planned | messaging MS-08 | 2 |
| OC-11 | Every figure shown with when it was fetched; no stale balance presented as live | Planned | GateKeepr Backend §20 (a cache with a fetched-at stamp), carried over | 1 |
| OC-12 | USSD limits: lower transaction limits than the app, and step-up through a one-time code for anything above them | Planned | FS-233 | 1 |
| OC-13 | Accessibility: WCAG 2.1 AA, large text, low-end Android, light on data | Planned | GateKeepr STANDARDS.md §5, carried over | 2 |
| OC-14 | English and Swahili | Built | KCB release notes 3.2.3 (Dec 2022) and 3.2.34 (Mar 2024) and the MMC API specification v2.7 (Jan 2024), held in clients/kcb/ outside git: menus and messages in English and Swahili (FS-416) | 2 |
| OC-15 | The app backend: Appwrite behind Keycloak, or our own channel API service | Planned | FS-167 to FS-171 — FS-238 | 1 |
| OC-16 | Banking by chat, on WhatsApp or Telegram | Planned | messaging MS-06, MS-07. The KCB menu platform is specified for WhatsApp, Telegram and web as well as USSD; only USSD is shown in production (FS-416) | later |

## 4 · Where it sits

**Depends on:** access (login, step-up), identity (self-service KYC),
messaging (push, one-time codes), rails (payments), mandates (approvals,
guarantor consents), and the products it shows: collect, mfi, sacco.
**Used by:** members and customers.

**Who holds which record** (docs/architecture.md §2):

| Record | System of record | This module |
|---|---|---|
| Balances, loans, transactions | The core or Fineract | **Reads; never holds.** Shown with a fetched-at time |
| The member and their KYC | The core or Fineract | References by id |
| Logins, devices, sessions | Access | References |
| Channel preferences and consents | Odoo | References |
| Channel configuration: menus, limits, branding per institution | **Omni-channel** | Holds |
| On the device | — | Only what the next screen needs. **No Restricted data, and no credentials beyond the device-bound key** |

**What this module never stores:** a balance as an authority, a PIN, or a
government ID number on a device.

**Under each ledger mode:**

| | Integrated — the institution has a core | Native — no core; Fineract is the ledger |
|---|---|---|
| Where funds are posted | The core, through the products' adapters | Fineract |
| What differs in this module | Some banks have their own app; we may provide only USSD or a white-label | We provide every channel |
| What the customer must provide | Core access through the products; its brand; its channel limits | Its brand; its channel limits |
| Who it suits | Banks, larger Saccos | Saccos and MFIs |

## 5 · How it works

```
   MOBILE APP            INTERNET BANKING          USSD (any phone)
   Android . iOS         browser                   operator gateway
        |                      |                          |
        +----------------------+--------------------------+
                               |
                 +---------------------------+
                 |  CHANNEL API              |  one behaviour on every
                 |  per institution: brand,  |  channel; limits per
                 |  menus, limits            |  channel
                 +---------------------------+
                   |      |       |       |
                access  identity  rails  mandates
                   |                      |
       login, step-up,          approvals, guarantor
       device binding,          consents
       SIM-swap check
                               |
                  products: collect . mfi . sacco
                               |
                  core or Fineract (the authority)
                               |
           every figure returned with its fetched-at time
```

## 6 · Rails and integrations

| Rail / system | Direction | Feed | Status |
|---|---|---|---|
| Operators' USSD gateways (Safaricom, Airtel, Telkom) | in / out | USSD sessions | Planned (OC-03) — FS-233 |
| Operators' SIM-swap checks | read | API: Safaricom through Daraja; other operators to confirm | Planned (OC-06) — rails RL-22, FS-234, FS-386 |
| Google Play, Apple App Store | out | app distribution | Planned (OC-01) — FS-236 |
| Access, identity, messaging, rails, mandates | in / out | platform APIs | Planned |
| Appwrite (if chosen) | in / out | app backend | Planned (OC-15) |

## 7 · Regulatory position

- **Custody:** none. Payments run through the products' own patterns.
- **USSD:** a USSD code needs the Communications Authority and each
  operator. Whether Dibon's PRSP licence covers it — FS-233, with FS-160.
- **App stores:** Google Play has specific rules for lending apps, which
  may require proof of the lender's licence in Kenya — FS-236. Saccos'
  and MFIs' apps are lending apps.
- **Permissions:** the app asks for nothing it does not need. In
  particular, no contact-list or call-log access. Harvesting contacts to
  pressure borrowers is a known abuse, and the Data Protection Act
  forbids it.
- **Vendor rules:** for SASRA-regulated Saccos, the app is part of what
  SASRA's vendor requirements cover (FS-179).
- **Data:** what is shown is Confidential. Nothing Restricted reaches a
  device.

## 8 · Controls

- **Draw before building.** No screen is built that has no drawing, and
  the drawing changes in the same commit as the code (FS-237).
- **Step-up for money.** Login is not an approval (access AC-05).
- **SIM-swap check before money moves,** where the operator offers one
  (FS-234). Safaricom does, through Daraja (rails RL-22). A recent swap
  blocks the act and routes the member to support.
- **Fetched-at on every figure** (OC-11). A cached balance says so.
- **USSD stays low-risk** (OC-12): lower limits, and step-up above them.
- **The same answer on every channel.** All three use one channel API.

## 9 · Deployment

The channel API runs on the shared platform, on Liquid's Azure Stack
(FS-032). Apps are published to the stores under each institution's name,
or Dibon's, depending on FS-232. USSD connects through the operators from
the in-country deployment.

## 10 · What it does not do

- Hold balances, or decide anything a product decides.
- Field-officer or agent apps, and offline collection. Excluded at launch
  (MFI PRD §6); the field-officer app follows in phase 2 (core KC-14,
  FS-320).
- Staff back-office screens. Those are each product's portals.

## 11 · Open questions

FS-167 to FS-171, FS-232, FS-233, FS-234, FS-235, FS-236, FS-237,
FS-238.

## 12 · Sources

- REVIEW.md FS-022 (the owner's scope), FS-167 to FS-171.
- KCB: MMC API specification v2.7, MMC operations manual v1.1, merchant
  financing menus, release notes 3.2.3 and 3.2.34 (clients/kcb/, outside
  git; FS-416).
- docs/modules/access.md, identity.md, messaging.md, rails.md, mandates.md.
- GateKeepr STANDARDS.md §5 and Backend §20 — principles carried over:
  accessibility; a cache labelled with when it was fetched.
