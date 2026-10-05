---
id: partners
name: Partners — candidates, conversations and selection decisions
kind: register
version: 0.1.0
owner: Commercial lead
classification: Internal
last_reviewed: 2026-10-05
---

# Partners — candidates, conversations and selection decisions

**What this tracks:** every organisation we may depend on to move, hold or
host money, and every decision about which ones to choose (FS-118). It is
a register: rows with states, owned by whoever runs the conversation, and
changing on its own schedule. Prospects and customers are not tracked here.

**Rules for this file:**

1. **Coverage is a claim until verified.** "Countries (claimed)" comes from
   memory or marketing. A country moves to "Verified" only with a source
   named in the row: the regulator's register, or the partner in writing.
2. **A stage changes on an event, not an impression.** The event goes in
   "Last event", with a date.
3. **Protected names are described, not named.** The name sits in
   sources/confidential/ until the owner releases it (FS-103).
4. **A selection decision lists its candidates by id, and its criteria.**
   A decision is made in this file and recorded in docs/decisions.md.

Countries use ISO codes: KE Kenya, UG Uganda, TZ Tanzania, RW Rwanda,
ZM Zambia, ZW Zimbabwe, NG Nigeria.

---

## 1 · Candidates

Stages: **Candidate** (named, not contacted) · **Contacted** · **In
discussion** · **Onboarding** (terms agreed, integration or paperwork
under way) · **Live** · **Unconfirmed** (sources disagree on the stage) ·
**Parked** · **Declined**.

| Id | Partner | Type | What we would use it for | Countries (claimed) | Verified | Stage | Last event | Next step | Owner | Refs |
|---|---|---|---|---|---|---|---|---|---|---|
| PT-01 | Liquid Intelligent Technologies, with Microsoft Azure Stack | Hosting, strategic | Host deployments in-country; route to market | KE UG TZ RW ZM ZW NG (owner) | None | Candidate | 2026-10-01: named as the target strategic partner | Ask for Azure Stack availability per country, and GPU and hosted-model options | Architect | FS-048, FS-105, FS-110 |
| PT-02 | Safaricom — M-Pesa (Daraja) | Mobile money, direct | Collections, payouts, status queries in KE; Daraja security APIs (SIM-swap query, IMSI) for authorised partners | KE | KE (operator) | Live | 2026-10-03: owner. M-Pesa Express, C2B, B2C, B2B, status, balance and reversals ran in production at Onit Bank, Feb 2025 to Jun 2026 | Send partner-requests draft 3 (docs/outreach/partner-requests-2026-10.md); confirm the go-live date and whose shortcodes are used | Architect | FS-056, FS-088, FS-125, FS-127, FS-386 |
| PT-03 | Airtel Money | Mobile money, direct; possible group-level agreement | Collections and payouts; one agreement across most of the footprint | KE UG TZ RW ZM NG | None | Unconfirmed | 2026-10-03: owner. The API integration was probably built for Onit Bank but never launched; to confirm with the technical lead. The phone-number name check ran at Onit under Onit's own agreement | Send partner-requests draft 4 (docs/outreach/partner-requests-2026-10.md); ask about a group agreement | Architect | FS-088, FS-125, FS-392, FS-393, FS-394 |
| PT-04 | Telkom — T-Kash | Mobile money, direct | Collections and payouts in KE | KE | KE (operator) | Unconfirmed | Listed as a channel in the Collect API | Send partner-requests draft 5 (docs/outreach/partner-requests-2026-10.md); confirm integration status | Architect | FS-088, FS-125, FS-129, FS-393, FS-394 |
| PT-05 | PesaLink sponsor bank (named in sources/confidential/) | Bank | PesaLink access; trust accounts | KE (and its regional subsidiaries) | None | Onboarding | 2026-06-08: trust accounts outstanding; terms discussion assigned | Agree terms; open the trust accounts | Product lead | FS-056 |
| PT-06 | Gateway provider from 8 Jun (named in sources/confidential/) | Aggregator; payment facilitator | Interim aggregation for merchants without shortcodes; cards | Most of the footprint | None | Candidate | 2026-06-08: payment-facilitator agreement to investigate | Report on the investigation | Product lead | FS-061, FS-096, FS-103 |
| PT-07 | Paystack | Aggregator | Cards and mobile money; sub-merchants | KE NG | KE: CBK payment service provider since 8 Nov 2022, incl. payments for Saccos and informal groups (directory, 15 May 2026) | Candidate | 2026-10-03: research. M-Pesa 1.5%, local cards 2.9%; T+2 settlement; sub-accounts and split payments documented; not taking new service partners | Use as a merchant platform for cards, and as the licensed route for merchants without their own channel (FS-094); confirm how splits work for KES sub-accounts | Commercial lead | FS-096, FS-113, FS-381 |
| PT-08 | Cellulant | Aggregator | Regional aggregation across the footprint | KE UG TZ RW ZM ZW NG | None | Candidate | 2026-10-01: shortlisted by Claude | Verify licences per country | Commercial lead | FS-112 |
| PT-09 | Flutterwave | Aggregator | Regional aggregation | KE UG TZ RW ZM NG | Not in CBK's payment service provider (May 2026) or money remittance (Feb 2026) directories | Parked | 2026-10-03: research. Not authorised in Kenya on CBK's published lists | Do not use in Kenya unless it is authorised | Commercial lead | FS-112, FS-381 |
| PT-10 | Pesapal | Aggregator | East African aggregation | KE UG TZ RW | None | Candidate | 2026-10-01: shortlisted by Claude | Verify coverage | Commercial lead | FS-112 |
| PT-11 | MTN MoMo | Mobile money, open API | Collections and payouts | UG RW ZM NG | None | Candidate | 2026-10-01: shortlisted by Claude | After Kenya | Commercial lead | FS-112 |
| PT-12 | Vodacom — M-Pesa Tanzania | Mobile money, direct | Collections and payouts in TZ | TZ | None | Candidate | 2026-10-01: shortlisted by Claude | After Kenya | Commercial lead | FS-112 |
| PT-13 | EcoCash | Mobile money, direct | Collections and payouts in ZW | ZW | None | Candidate | 2026-10-01: shortlisted by Claude | After Kenya | Commercial lead | FS-112 |
| PT-14 | Onafriq | Cross-border mobile-money hub | International transfers and payouts | Pan-African | None | Candidate | 2026-10-01: shortlisted by Claude | Assess with SD-06 | Architect | FS-112 |
| PT-15 | International transfer gateway from 8 Jun (named in sources/confidential/) | Cross-border gateway | International transfers in and out of KE | Not known | None | Candidate | 2026-06-08: being explored | Assess with SD-06 | Architect | FS-112 |
| PT-16 | Stanbic / Standard Bank group | Bank, regional | Escrow, trust and settlement accounts across the footprint | KE UG TZ ZM ZW NG | None | Candidate | 2026-10-01: shortlisted by Claude | Assess with SD-04 | Commercial lead | FS-107, FS-112 |
| PT-17 | Ecobank | Bank, regional | Escrow, trust and settlement accounts across the footprint | KE UG TZ RW ZM ZW NG | None | Candidate | 2026-10-01: shortlisted by Claude | Assess with SD-04 | Commercial lead | FS-107, FS-112 |
| PT-18 | NCBA | Bank — holds Dibon's own accounts | APIs and statement feeds for Dibon's accounts (Dibon as first customer); a possible partner bank later | KE | KE (Dibon is a customer) | Candidate | 2026-10-01: owner to request APIs and statement feeds | Send the request (Email 1) | Architect | FS-033, FS-125, FS-126 |
| PT-19 | KCB | Bank — holds Dibon's own accounts | As PT-18 | KE (and its regional subsidiaries) | KE (Dibon is a customer) | Candidate | 2026-10-01: owner to request APIs and statement feeds. 2026-10-05: also a past customer: USSD platform 2022 to 2025, account mandate API, Meliora SMS (customers CU-03, FS-416) | Send the request (Email 1) | Architect | FS-033, FS-125, FS-126, FS-416 |
| PT-20 | Meliora — Tiara gateway | Messaging partner; SMS gateway product | SMS outside Kenya; fallback route in Kenya; possibly a product to deploy rather than build. Dibon supplies Meliora's SMS platform and its lightweight CRM (mobi_reg) to banks: KCB, for about four years, and National Bank of Kenya, both current (FS-416, FS-419) | Not known | KE (current partner) | Live | 2026-10-01: product page read — enterprise SMS gateway, multi-operator routing, 14 deployments, SMS only. 2026-10-05: owner: Dibon has supplied Meliora's SMS platform to KCB for about four years, and to a second bank; both supplies are current (FS-419) | Confirm countries; ask whether Tiara can be licensed for our own deployment | Architect | FS-148, FS-160, FS-207, FS-416, FS-417, FS-419 |
| PT-21 | Africa's Talking | Messaging partner | SMS, and possibly USSD, outside Kenya | KE UG TZ RW ZM NG | None | Candidate | 2026-10-01: named by the owner | Verify coverage and sender-ID support per country | Architect | FS-160 |
| PT-22 | Safaricom — SMS (SMPP) | Operator, messaging | Direct A2P SMS in Kenya under our PRSP licence | KE | KE (operator) | Candidate | 2026-10-01: direct connection decided | Request an SMPP bind and sender-ID registration | Architect | FS-160 |
| PT-23 | Airtel — SMS (SMPP) | Operator, messaging | As PT-22 | KE | KE (operator) | Candidate | 2026-10-01: direct connection decided | As PT-22 | Architect | FS-160 |
| PT-24 | Telkom — SMS (SMPP) | Operator, messaging | As PT-22 | KE | KE (operator) | Candidate | 2026-10-01: direct connection decided | As PT-22 | Architect | FS-160 |
| PT-25 | Meta — WhatsApp Business Platform | Messaging platform | WhatsApp templates and replies | Global | None | Candidate | 2026-10-01: WhatsApp named as a channel | Decide the route (SD-09); business verification | Architect | FS-147, FS-161, FS-165 |
| PT-26 | Metropol | Credit reference bureau | Submission and lookups | KE | None | Candidate | 2026-10-01: CRB module written | Obtain formats, API and subscriber terms (FS-187) | Architect | FS-186, FS-187 |
| PT-27 | TransUnion Kenya | Credit reference bureau | As PT-26 | KE | None | Candidate | 2026-10-01: CRB module written | As PT-26 | Architect | FS-186, FS-187 |
| PT-28 | Creditinfo Kenya | Credit reference bureau | As PT-26 | KE | None | Candidate | 2026-10-01: CRB module written | As PT-26 | Architect | FS-186, FS-187 |
| PT-29 | NPDM, National Population Data Management (formerly IPRS) | Government register | Identity lookups in Kenya | KE | KE (government) | Candidate | 2026-10-03: research. Private firms connect directly: KES 50,000 connection, KES 20 per check, about 7 days to integrate | Send the letter of intent (partner-requests draft 2); then the signed MOU, KRA tax compliance, business permit, Data Commissioner registration, security policy (compliance LC-12). Confirm who holds the access agreement (FS-202) | Product lead | FS-088, FS-202, FS-382 |
| PT-30 | Smile ID | Identity verification vendor | Liveness, face match, document checks | Pan-African | None. Claims IPRS, eCitizen and BRS access: national ID, alien card, KRA PIN, passport; business checks via BRS; liveness. Maisha, refugee ID and phone checks unconfirmed | Candidate | 2026-10-03: research. No public pricing; where Kenyan data is processed not stated | Ask for pricing, data-processing location and refugee/Maisha coverage | Architect | FS-204, FS-340, FS-382 |
| PT-31 | Odoo | Software vendor; partner programme | Business Suite implementations; Dibon's own ERP | Global | Ready tier (owner) | Live | 2026-10-01: Dibon is an Odoo Ready Partner, working towards Silver | Confirm Silver requirements and timeline (FS-292) | Commercial lead | FS-026, FS-288, FS-292 |
| PT-32 | Zoho | Software vendor; partner programme | Business Suite implementations; SME Recon's Zoho wrapper | Global | Partner (owner); tier not recorded | Live | 2026-10-02: owner confirms Dibon partners with Zoho | Record the tier; check where Zoho hosts Kenyan customers' data (FS-312) | Commercial lead | FS-306, FS-312 |
| PT-33 | MetaMap | Identity verification vendor | Document checks, liveness, face match, as an alternative to PT-30 | Global; Kenya IPRS and BRS checks documented | None | Candidate | 2026-10-03: research. Acquired by Incode, 11 Jun 2024. No public pricing | Compare with PT-30: Kenyan documents covered (national ID, Maisha, alien, refugee, passport), business checks, where Kenyan data is processed, per-check price | Architect | FS-340, FS-331, FS-382 |
| PT-34 | Banking-as-a-service microfinance bank (named in sources/confidential/) | Bank: nationwide microfinance bank with a banking-as-a-service offer | Partner bank for Collect and Escrow: accounts opened by API in the customer's name, virtual accounts, Paybill and PesaLink inflows, escrow-style controls | KE | KE: CBK microfinance bank, nationwide since 4 Nov 2024 (directory, Feb 2026) | Candidate | 2026-10-03: research. Partner process: conversation, agreement, sandbox within 48 hours, review, go-live. Also a possible competitor: it offers fintechs accounts directly | Open a conversation, ideally bringing a partner with volume | Commercial lead | FS-380 |
| PT-35 | KRA GavaConnect | Government API platform | KRA PIN checks | KE | KE (government) | Candidate | 2026-10-03: research. Free for approved developers | Register as a developer | Architect | FS-382 |
| PT-36 | Spin Mobile | Identity verification vendor | IPRS ID, KRA PIN, alien ID and passport checks; Safaricom phone-number name check; bank-account validation | KE | None | Candidate | 2026-10-03: research. Kenyan entity unconfirmed | Ask for pricing and data-processing location; its phone-name check may meet identity ID-05 | Architect | FS-382 |
| PT-37 | Sumsub | Identity verification vendor | Kenyan government database checks (national ID, passport) with liveness and selfie match | Global | None | Candidate | 2026-10-03: research. Published pricing: USD 1.35 a check, USD 149 a month minimum | Compare with PT-30 on coverage and data location | Architect | FS-382 |
| PT-38 | NetAPI Telecom | Aggregator of operator network APIs (GSMA Open Gateway channel partner) | SIM-swap and device checks across operators, through one interface | KE | None | Candidate | 2026-10-03: research. Kenya-based; five GSMA-certified APIs, including SIM Swap | Ask which Kenyan operators it reaches, and whether it offers number verification or name matching | Architect | FS-386 |
| PT-39 | Onit Bank | Bank: former partner bank | Ran Kapu Collect and the Gateway in production, Feb 2025 to Jun 2026 | KE | KE (CBK-licensed) | Declined | 2026-10-03: owner. The bank chose more traditional banking services and ended the arrangement in Jun 2026 | None; keep as a reference if the bank agrees | Commercial lead | FS-384, FS-390 |
| PT-40 | W-Harambee | Fintech partner: fundraising platform | Contributors' money held in accounts at the partner bank; withdrawals only to the fundraiser's set payout details. Collect's use case | KE | None | Unconfirmed | 2026-10-03: owner. Partner at Onit Bank until Jun 2026; its site still names Onit Bank as where funds sit | Approach together with a new partner bank (PT-34) | Commercial lead | FS-384, FS-380 |
| PT-41 | Tier-3 bank approached for Collect (named in sources/confidential/) | Bank | Partner bank for Collect and Escrow | KE | None | In discussion | 2026-10-03: owner. Slow; research shows the bank below its capital minimum | Pause until its capital is resolved | Commercial lead | FS-380 |
| PT-42 | Two further banks approached (named in sources/confidential/) | Bank | Partner bank for Collect and Escrow | KE | None | In discussion | 2026-10-03: owner. Slow going | Bring the due-diligence pack and a partner with volume (FS-370) | Commercial lead | FS-380 |

---

## 2 · Selection decisions

Statuses: **OPEN** · **DECIDED** (recorded in docs/decisions.md) ·
**PARKED**.

| Id | Decision | Candidates | Criteria | Depends on | Status | Notes |
|---|---|---|---|---|---|---|
| SD-01 | The regional aggregator: cards, and merchants without shortcodes | PT-06, PT-07, PT-08, PT-09, PT-10 | C1 C2 C3 C4 C5 C6 C7 C8 | — | OPEN | Recommendation: one aggregator whose licensed footprint matches the seven countries, so the Kenya integration carries forward (FS-112) |
| SD-02 | Kenya's interim route to aggregation, before our PSP licence | PT-06, and whichever SD-01 picks | C1 C3 C4 C6 | SD-01 | OPEN | FS-061, FS-094. A payment-facilitator agreement, or a partner settling under its own licence |
| SD-03 | Card acquiring: through the SD-01 aggregator, or a direct acquirer | PT-06, PT-07, PT-08, PT-09 | C1 C2 C4 C9 | SD-01 | OPEN | FS-091. Card numbers never touch our systems either way |
| SD-04 | The bank for escrow, trust and settlement accounts | PT-05, PT-16, PT-17, PT-34 | C1 C5 C10 | — | OPEN | FS-107, FS-108. One regional group would mean one escrow design across countries |
| SD-05 | Mobile money: direct or through the aggregator, per country | PT-02, PT-03, PT-04, PT-11, PT-12, PT-13 | C2 C4 C8 | — | DECIDED | **Direct API integration** (FS-124). The aggregator (SD-01) covers cards and merchants without shortcodes, not mobile money. Outreach to all three Kenyan operators drafted (FS-125, FS-129) |
| SD-06 | Cross-border and international transfer | PT-14, PT-15 | C1 C2 C4 C5 | — | OPEN | Includes the stablecoin research assigned 8 Jun |
| SD-07 | Hosting partner | PT-01 | C5 C11 | — | OPEN | FS-048, FS-110 |
| SD-08 | SMS route per country | PT-20, PT-21, PT-22, PT-23, PT-24 | C4 C5 C12 C13 | — | OPEN | Kenya: direct to the operators (FS-160), with a partner as fallback. Elsewhere: a partner until volume justifies a licence and direct binds |
| SD-09 | WhatsApp route: Meta directly, or a business solution provider | PT-25, PT-20, PT-21 | C4 C5 C7 | — | OPEN | FS-161 |
| SD-10 | CRB connections | PT-26, PT-27, PT-28 | C1 C2 C4 C5 C7 | — | OPEN | Proposed: connect to every licensed bureau, not one. Lenders may be required to share with all of them |
| SD-11 | Liveness and face-match vendor | PT-30, PT-33, PT-37 | C4 C5 C7 | — | OPEN | Biometric data: residency and retention weigh most (FS-203). Three candidates offer liveness and face match: PT-30, PT-33 and PT-37. PT-36 offers ID and phone-name checks, not liveness (FS-382, FS-409) |

## 3 · Criteria

| Id | Criterion | Why it matters here |
|---|---|---|
| C1 | Licensed in each country where it would settle | Custody passes to the partner; an unlicensed partner moves the regulated act back onto us |
| C2 | Settlement report quality: per-transaction, machine-readable, fees itemised | It is what recon matches against (recon-observability RO-20) |
| C3 | Sub-merchant support | Serves merchants with no shortcode of their own (FS-094) |
| C4 | Fees | They stack on ours |
| C5 | Where data is held | Data residency per country (FS-111) |
| C6 | Whether it competes for our merchants | A partner that sells to the same merchants is also a rival |
| C7 | API quality and sandbox | Integration cost |
| C8 | Settlement timing, and who controls it | Merchants feel it as cash flow |
| C9 | Card scope stays with the partner: hosted page or tokenisation | Keeps us out of the cardholder-data environment |
| C10 | Sub-account and mandate APIs | Escrow depends on both (escrow ES-02, ES-05) |
| C11 | In-country presence of the hosting stack, and model or GPU options | Hosting and insights (FS-043) |
| C12 | Delivery-report quality: per message, timely, passed on unaltered | A status is only as truthful as the report behind it (messaging MS-09) |
| C13 | Sender ID per institution | Each institution messages under its own name (messaging MS-03) |
