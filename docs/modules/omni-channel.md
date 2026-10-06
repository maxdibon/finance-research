---
id: omni-channel
name: Omni-channel — apps, internet banking and USSD
kind: channel
version: 0.1.0
owner: Product lead, channels
classification: Internal
audience: [bank, sacco, mfi, fintech]
depends_on: [access, identity, messaging, rails, mandates, collect, mfi, sacco, financial-crime, core]
consumed_by: [insights]
review_ids: [FS-075, FS-160, FS-167, FS-168, FS-169, FS-170, FS-171, FS-232, FS-233, FS-234, FS-235, FS-236, FS-237, FS-238, FS-320, FS-386, FS-416, FS-431, FS-443, FS-450, FS-452, FS-453, FS-487, FS-488, FS-532, FS-580]
last_reviewed: 2026-10-06
---

# Omni-channel — apps, internet banking and USSD

## 1 · In one paragraph

Omni-channel is how an institution's members and customers will reach
their money: a **mobile app**, **internet banking** in a browser, and
**USSD** for any phone without data. USSD is the part with a production
record: Dibon's menu platform ran KCB's digital lending on USSD from 2022
to 2025 (OC-03). All three will sit on **one channel API** over the
products, so a balance, a loan or a payment behaves the same on every
channel. Login and step-up will come from access (Keycloak); KYC from
identity; payments from rails, approved through mandates where needed. A
balance shown on a phone will be a read from its authority, **labelled
with when it was fetched**, and the channels will be white-labelled per
institution. In phase 1, a **field-officer app** will take onboarding,
appraisal and collections on M-Pesa, Airtel Money and T-Kash to the
customer (OC-17 to OC-19). **Nothing is drawn yet**, and no screen is
built before it is drawn (FS-237).

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
| Field officer | Onboarding, appraisal visits and collections at the customer's door, working offline (OC-17 to OC-19) |
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
| OC-03 | USSD menus per institution | Built | KCB release notes 3.2.3 (Dec 2022) and 3.2.34 (Mar 2024) and the MMC API specification v2.7 (Jan 2024), held in clients/kcb/ outside git: USSD menus configured per product (retailer finance, float and business overdrafts, term loans, merchant financing), with session state, routing and input validation; ran in production at KCB, 2022 to 2025 (FS-416). FS-022 — FS-233. Also National Bank of Kenya: shortcodes and a USSD code, active in 2026 (Dibon's project list for KCB and NBK (clients/kcb-nbk-projects.xlsx, outside git; FS-443)) | 1 |
| OC-04 | One channel API over the products: balances, statements, loans, contributions, payments, guarantor requests | Planned | FS-022 | 1 |
| OC-05 | Login through access: passkeys or device biometrics, one-time codes; step-up for anything that moves money | Planned | access AC-03, AC-05. At KCB, USSD used its own PIN and one-time-code lifecycle (set, reset, lock), hashed (FS-416), not the access service | 1 |
| OC-06 | Device binding, and a SIM-swap check before money moves | Planned | FS-234. Safaricom offers the check through Daraja (rails RL-22, FS-386). The hold after a swap is financial-crime FC-02 (FS-431) | 1 |
| OC-07 | Payments: deposit by mobile-money prompt, withdrawal, transfer, bill payment — through rails, with mandates where the product requires | Planned | rails RL-01; mandates | 2 |
| OC-08 | Loan applications and guarantor flows | Planned | mfi, sacco. KCB's USSD took loan requests, repayments, limits and balances against the bank's loan engine (FS-416); guarantor flows have no record | 2 |
| OC-09 | Self-service KYC: document capture, liveness | Planned | identity ID-02, ID-04 | 2 |
| OC-10 | App push, through messaging | Planned | messaging MS-08 | 2 |
| OC-11 | Every figure shown with when it was fetched; no stale balance presented as live | Planned | GateKeepr Backend §20 (a cache with a fetched-at stamp), carried over | 1 |
| OC-12 | USSD limits: lower transaction limits than the app, and step-up through a one-time code for anything above them | Planned | FS-233 | 1 |
| OC-13 | Accessibility: WCAG 2.1 AA, large text, low-end Android, light on data | Planned | GateKeepr STANDARDS.md §5, carried over | 2 |
| OC-14 | English and Swahili | Built | KCB release notes 3.2.3 (Dec 2022) and 3.2.34 (Mar 2024) and the MMC API specification v2.7 (Jan 2024), held in clients/kcb/ outside git: menus and messages in English and Swahili (FS-416) | 2 |
| OC-15 | The app backend: Appwrite behind Keycloak, or our own channel API service | Planned | FS-167 to FS-171 — FS-238 | 1 |
| OC-16 | WhatsApp for notifications and links: receipts, reminders and changes of status, each with a link into our own pages for anything more; no balances, statements or documents in the chat (architecture §7) | Planned | messaging MS-06. The KCB menu platform is specified for WhatsApp, Telegram and web as well as USSD; only USSD is shown in production (FS-416). Owner, 2026-10-05: in v1 (FS-487); narrowed to notifications, 2026-10-06 (FS-532); Telegram follows as OC-21 | 1 |
| OC-17 | Field-officer app, offline first, for low-end Android: onboarding and KYC capture, loan applications and appraisal visits, collateral photos with location and time, visit logs and arrears tasks; synced when a connection returns | Planned | FS-450. The app behind Kapu Core KC-14; used by MFI, Sacco and Core. Owner, 2026-10-05: in v1 (FS-453) | 1 |
| OC-18 | Collections in the field: the officer sends a payment prompt to the customer's own phone on M-Pesa, Airtel Money or T-Kash, and the receipt goes by SMS; no cash in the officer's hands where it can be avoided | Planned | FS-450, FS-452. All three wallets from the start, as in v1 (FS-407); rails RL-03, RL-04, RL-05. Owner, 2026-10-05: in v1 (FS-453) | 1 |
| OC-19 | Field controls: the device bound to the officer, remote wipe, every capture attributed and timestamped, and SMS or USSD as a fallback where there is no data | Planned | FS-450. Owner, 2026-10-05: in v1 (FS-453) | 1 |
| OC-20 | A chatbot on WhatsApp, the app and the web: how-to answers from the service desk's knowledge base and the status of a person's own requests; balances, statements and loans open our own pages after sign-in; hands over to a person when asked or unsure; never sees Restricted data | Planned | Owner, 2026-10-05 (FS-487); narrowed 2026-10-06 (FS-532). Shares the AI-first desk's knowledge and rules (docs/operating-model.md) | 1 |
| OC-21 | Banking by chat on Telegram, for people who have started a chat with the institution's bot | Planned | FS-487; messaging MS-07 | later |
| OC-22 | Voice: a phone line in English and Swahili for balances, loan status and payment reminders, with a person on request; anything that moves money needs a PIN | Planned | Owner, 2026-10-05 (FS-488). For members who prefer to call or do not read easily | 2 |
| OC-23 | Agent banking: cash in and out, and account opening, through an institution's agents, on Kapu Core's tellers (KC-06) | Planned | Owner, 2026-10-05 (FS-488). CBK and SASRA set rules for agents; to read and add to the law register before design | 2 |
| OC-24 | Alerts a customer sets for themselves, on the same criteria as the transaction rules (financial-crime FC-16): any payment over an amount, a payment to a new destination, money in, a balance below a level; set in the app, on USSD or at a branch, and delivered on the channels the customer chose (messaging MS-12). They notify only: a customer's alert never holds or blocks a payment | Planned | Owner, 2026-10-06 (FS-580) | 2 |

## 4 · Where it sits

**Depends on:** access (login, step-up), identity (self-service KYC),
messaging (push, one-time codes), rails (payments), mandates (approvals,
guarantor consents), financial-crime (the hold after a SIM swap, FC-02),
core (KC-14, the back end of the field-officer app), and the products it
shows: collect, mfi, sacco.
**Used by:** members, customers and field officers; insights reads its
metrics.

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

The field-officer app (OC-17) will use the same channel API, with an
offline store that syncs when a connection returns, behind Kapu Core
KC-14. Its collections (OC-18) will be payment prompts to the customer's
own phone through rails, never cash.

## 6 · Rails and integrations

| Rail / system | Direction | Feed | Status |
|---|---|---|---|
| Operators' USSD gateways (Safaricom, Airtel, Telkom) | in / out | USSD sessions | Built (OC-03): Dibon's menu platform behind KCB's USSD code, 2022 to 2025; each new institution's code — FS-233 |
| M-Pesa, Airtel Money, T-Kash — field collections | out / in | payment prompt; callback | Planned (OC-18) — rails RL-03 Built, RL-04 and RL-05 Designed |
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
- **Permissions:** the apps will ask for nothing they do not need. In
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
  will block the act and route the member to support; the account is
  bound to ID, phone number and IMSI, with a hold on an IMSI change
  (identity ID-12 to ID-14, financial-crime FC-02; FS-453).
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
- Agent apps. The field-officer app and offline collection, excluded at
  launch by MFI PRD §6 and then moved to phase 2 (FS-320), are now
  phase 1 (OC-17 to OC-19, core KC-14; FS-453).
- Staff back-office screens. Those are each product's portals.

## 11 · Open questions

FS-167 to FS-171, FS-235, FS-236, FS-237, FS-238.

## 12 · Sources

- REVIEW.md FS-022 (the owner's scope), FS-167 to FS-171, FS-450,
  FS-452, FS-453.
- KCB: MMC API specification v2.7, MMC operations manual v1.1, merchant
  financing menus, release notes 3.2.3 and 3.2.34 (clients/kcb/, outside
  git; FS-416).
- docs/modules/access.md, identity.md, messaging.md, rails.md, mandates.md.
- GateKeepr STANDARDS.md §5 and Backend §20 — principles carried over:
  accessibility; a cache labelled with when it was fetched.
