---
id: partners
name: Partners — candidates, conversations and selection decisions
kind: register
version: 0.1.0
owner: Commercial lead
classification: Internal
last_reviewed: 2026-10-01
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
| PT-02 | Safaricom — M-Pesa (Daraja) | Mobile money, direct | Collections, payouts, status queries in KE | KE | KE (operator) | Onboarding | 2026-06-08: go-live outstanding | Send the API and statement request (docs/outreach/api-requests.md, Email 2); confirm the go-live date and whose shortcodes are used | Architect | FS-056, FS-088, FS-125, FS-127 |
| PT-03 | Airtel Money | Mobile money, direct; possible group-level agreement | Collections and payouts; one agreement across most of the footprint | KE UG TZ RW ZM NG | None | Unconfirmed | MFI PRD calls the integration "existing"; no other source | Send the API and statement request (Email 3); confirm what is integrated in KE; ask about a group agreement | Architect | FS-088, FS-125 |
| PT-04 | Telkom — T-Kash | Mobile money, direct | Collections and payouts in KE | KE | KE (operator) | Unconfirmed | Listed as a channel in the Collect API | Confirm integration status | Product lead | FS-088 |
| PT-05 | PesaLink sponsor bank (named in sources/confidential/) | Bank | PesaLink access; trust accounts | KE (and its regional subsidiaries) | None | Onboarding | 2026-06-08: trust accounts outstanding; terms discussion assigned | Agree terms; open the trust accounts | Product lead | FS-056 |
| PT-06 | Gateway provider from 8 Jun (named in sources/confidential/) | Aggregator; payment facilitator | Interim aggregation for merchants without shortcodes; cards | Most of the footprint | None | Candidate | 2026-06-08: payment-facilitator agreement to investigate | Report on the investigation | Product lead | FS-061, FS-096, FS-103 |
| PT-07 | Paystack | Aggregator | Cards and mobile money; sub-merchants | KE NG | None | Candidate | 2026-10-01: named by the owner | Verify licence and coverage | Commercial lead | FS-096, FS-113 |
| PT-08 | Cellulant | Aggregator | Regional aggregation across the footprint | KE UG TZ RW ZM ZW NG | None | Candidate | 2026-10-01: shortlisted by Claude | Verify licences per country | Commercial lead | FS-112 |
| PT-09 | Flutterwave | Aggregator | Regional aggregation | KE UG TZ RW ZM NG | None | Candidate | 2026-10-01: shortlisted by Claude | Verify licences and current standing in KE | Commercial lead | FS-112 |
| PT-10 | Pesapal | Aggregator | East African aggregation | KE UG TZ RW | None | Candidate | 2026-10-01: shortlisted by Claude | Verify coverage | Commercial lead | FS-112 |
| PT-11 | MTN MoMo | Mobile money, open API | Collections and payouts | UG RW ZM NG | None | Candidate | 2026-10-01: shortlisted by Claude | After Kenya | Commercial lead | FS-112 |
| PT-12 | Vodacom — M-Pesa Tanzania | Mobile money, direct | Collections and payouts in TZ | TZ | None | Candidate | 2026-10-01: shortlisted by Claude | After Kenya | Commercial lead | FS-112 |
| PT-13 | EcoCash | Mobile money, direct | Collections and payouts in ZW | ZW | None | Candidate | 2026-10-01: shortlisted by Claude | After Kenya | Commercial lead | FS-112 |
| PT-14 | Onafriq | Cross-border mobile-money hub | International transfers and payouts | Pan-African | None | Candidate | 2026-10-01: shortlisted by Claude | Assess with SD-06 | Architect | FS-112 |
| PT-15 | International transfer gateway from 8 Jun (named in sources/confidential/) | Cross-border gateway | International transfers in and out of KE | Not known | None | Candidate | 2026-06-08: being explored | Assess with SD-06 | Architect | FS-112 |
| PT-16 | Stanbic / Standard Bank group | Bank, regional | Escrow, trust and settlement accounts across the footprint | KE UG TZ ZM ZW NG | None | Candidate | 2026-10-01: shortlisted by Claude | Assess with SD-04 | Commercial lead | FS-107, FS-112 |
| PT-17 | Ecobank | Bank, regional | Escrow, trust and settlement accounts across the footprint | KE UG TZ RW ZM ZW NG | None | Candidate | 2026-10-01: shortlisted by Claude | Assess with SD-04 | Commercial lead | FS-107, FS-112 |
| PT-18 | NCBA | Bank — holds Dibon's own accounts | APIs and statement feeds for Dibon's accounts (Dibon as first customer); a possible partner bank later | KE | KE (Dibon is a customer) | Candidate | 2026-10-01: owner to request APIs and statement feeds | Send the request (Email 1) | Architect | FS-033, FS-125, FS-126 |
| PT-19 | KCB | Bank — holds Dibon's own accounts | As PT-18 | KE (and its regional subsidiaries) | KE (Dibon is a customer) | Candidate | 2026-10-01: owner to request APIs and statement feeds | Send the request (Email 1) | Architect | FS-033, FS-125, FS-126 |

---

## 2 · Selection decisions

Statuses: **OPEN** · **DECIDED** (recorded in docs/decisions.md) ·
**PARKED**.

| Id | Decision | Candidates | Criteria | Depends on | Status | Notes |
|---|---|---|---|---|---|---|
| SD-01 | The regional aggregator: cards, and merchants without shortcodes | PT-06, PT-07, PT-08, PT-09, PT-10 | C1 C2 C3 C4 C5 C6 C7 C8 | — | OPEN | Recommendation: one aggregator whose licensed footprint matches the seven countries, so the Kenya integration carries forward (FS-112) |
| SD-02 | Kenya's interim route to aggregation, before our PSP licence | PT-06, and whichever SD-01 picks | C1 C3 C4 C6 | SD-01 | OPEN | FS-061, FS-094. A payment-facilitator agreement, or a partner settling under its own licence |
| SD-03 | Card acquiring: through the SD-01 aggregator, or a direct acquirer | PT-06, PT-07, PT-08, PT-09 | C1 C2 C4 C9 | SD-01 | OPEN | FS-091. Card numbers never touch our systems either way |
| SD-04 | The bank for escrow, trust and settlement accounts | PT-05, PT-16, PT-17 | C1 C5 C10 | — | OPEN | FS-107, FS-108. One regional group would mean one escrow design across countries |
| SD-05 | Mobile money: direct or through the aggregator, per country | PT-02, PT-03, PT-04, PT-11, PT-12, PT-13 | C2 C4 C8 | — | DECIDED | **Direct API integration** (FS-124). The aggregator (SD-01) covers cards and merchants without shortcodes, not mobile money. T-Kash is not yet in the outreach (FS-129) |
| SD-06 | Cross-border and international transfer | PT-14, PT-15 | C1 C2 C4 C5 | — | OPEN | Includes the stablecoin research assigned 8 Jun |
| SD-07 | Hosting partner | PT-01 | C5 C11 | — | OPEN | FS-048, FS-110 |

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
