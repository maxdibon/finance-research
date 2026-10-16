---
id: partners
name: Partners — candidates, conversations and selection decisions
kind: register
status: living
law: LR-40
released: 2026.10.16
owner: Commercial lead
classification: Internal
last_reviewed: 2026-10-16
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
| PT-01 | Liquid Intelligent Technologies, with Microsoft Azure Stack | Hosting, strategic | Host deployments in-country; route to market | KE UG TZ RW ZM ZW NG (owner) | None | Candidate | 2026-10-01: named as the target strategic partner. 2026-10-05: research: its Nairobi Azure Stack Hub dates from 2020, current catalogue unconfirmed; a partner programme with reseller terms; a Sophos Platinum Partner selling managed detection (FS-457, FS-458). 2026-10-14: Microsoft's documentation read: Azure Stack Hub's Blob storage is general-purpose v1, locally redundant, immutable blobs from release 2008, no tiers or lifecycle rules yet (FS-822) | Send the partner enquiry (docs/outreach/liquid-partner-request.md): services on the Stack today, a second Kenyan site, DDoS protection, storage in detail (S1 to S10), partner terms, Sophos MDR and endpoint, GPUs | Architect | FS-048, FS-105, FS-110, FS-457, FS-458, FS-464, FS-822 |
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
| PT-18 | NCBA | Bank — holds Dibon's operational accounts | APIs and statement feeds for Dibon's accounts (Dibon as first customer); a possible partner bank later; also Roan Capital's disbursement bank, through Roan Capital's own relationship (RC-18, FS-586) | KE | KE (Dibon is a customer) | Candidate | 2026-10-01: owner to request APIs and statement feeds | Send letter 1 (docs/outreach/bank-api-requests-2026-10.md) | Architect | FS-033, FS-125, FS-126, FS-715 |
| PT-19 | KCB | Bank — holds Dibon's operational accounts | As PT-18 | KE (and its regional subsidiaries) | KE (Dibon is a customer) | Candidate | 2026-10-01: owner to request APIs and statement feeds. 2026-10-05: also a customer since 2021, with work ongoing: CRM, the Tiara SMS gateway, the USSD platform for digital lending 2022 to 2025, loan-engine and API integration, an account mandate API tested (customers CU-03, FS-416, FS-443) | Send letter 2 (docs/outreach/bank-api-requests-2026-10.md), without a partnership paragraph | Architect | FS-033, FS-125, FS-126, FS-416, FS-443, FS-715 |
| PT-20 | Meliora — Tiara gateway | Messaging partner; SMS gateway product | SMS outside Kenya; fallback route in Kenya; possibly a product to deploy rather than build. Dibon supplies Meliora's SMS platform and its lightweight CRM (mobi_reg) to banks: KCB, for about four years, and National Bank of Kenya, both current (FS-416, FS-419) | Not known | KE (current partner) | Live | 2026-10-01: product page read — enterprise SMS gateway, multi-operator routing, 14 deployments, SMS only. 2026-10-05: owner: Dibon has supplied Meliora's SMS platform to KCB for about four years, and to National Bank of Kenya; both supplies are current (FS-419). Dibon's project list shows the Tiara gateway's upgrade, migration and 2026 enhancements at KCB, and NBK's SMS gateway with SDP and SMPP connections (customers CU-03, CU-04, FS-443) | Confirm countries; ask whether Tiara can be licensed for our own deployment | Architect | FS-148, FS-160, FS-207, FS-416, FS-417, FS-419, FS-443 |
| PT-21 | Africa's Talking | Messaging partner | SMS, and possibly USSD, outside Kenya | KE UG TZ RW ZM NG | None | Candidate | 2026-10-01: named by the owner | Verify coverage and sender-ID support per country | Architect | FS-160 |
| PT-22 | Safaricom — SMS (SMPP) | Operator, messaging | Direct A2P SMS in Kenya under our PRSP licence | KE | KE (operator) | Candidate | 2026-10-01: direct connection decided | Request an SMPP bind and sender-ID registration | Architect | FS-160 |
| PT-23 | Airtel — SMS (SMPP) | Operator, messaging | As PT-22 | KE | KE (operator) | Candidate | 2026-10-01: direct connection decided | As PT-22 | Architect | FS-160 |
| PT-24 | Telkom — SMS (SMPP) | Operator, messaging | As PT-22 | KE | KE (operator) | Candidate | 2026-10-01: direct connection decided | As PT-22 | Architect | FS-160 |
| PT-25 | Meta — WhatsApp Business Platform | Messaging platform | WhatsApp templates and replies | Global | None | Candidate | 2026-10-01: WhatsApp named as a channel | Decide the route (SD-09); business verification | Architect | FS-147, FS-161, FS-165 |
| PT-26 | Metropol | Credit reference bureau | Submission and lookups | KE | None | Candidate | 2026-10-01: CRB module written | Obtain formats, API and subscriber terms (FS-187) | Architect | FS-186, FS-187 |
| PT-27 | TransUnion Kenya | Credit reference bureau | As PT-26 | KE | None | Candidate | 2026-10-01: CRB module written | As PT-26 | Architect | FS-186, FS-187 |
| PT-28 | Creditinfo Kenya | Credit reference bureau | As PT-26 | KE | None | Candidate | 2026-10-01: CRB module written | As PT-26 | Architect | FS-186, FS-187 |
| PT-29 | NPDM, National Population Data Management (formerly IPRS) | Government register | Identity lookups in Kenya | KE | KE (government) | Candidate | 2026-10-03: research. Private firms connect directly: KES 50,000 connection, KES 20 per check, about 7 days to integrate | Send the letter of intent (partner-requests draft 2); then the signed MOU, KRA tax compliance, business permit, Data Commissioner registration, security policy (compliance LC-12). Confirm who holds the access agreement (FS-202) | Product lead | FS-088, FS-202, FS-382 |
| PT-30 | Smile ID | Identity verification vendor | Register checks, liveness, face match, document checks, business checks | Pan-African | Documented in its API reference (2026-10-06), not yet in a contract: Kenyan national ID (with or without photo), alien card, refugee ID (checked as an alien card), passport, KRA PIN from an ID number, tax information; each ID with liveness and face match (Biometric KYC) except the photo-less ID. Business registration returns company details, directors and beneficial owners; asynchronous with a callback. ISO 27001, SOC 2 Type II, ISO 30107-3 Level 2 for liveness. Maisha and Kenyan phone checks not documented | Candidate | 2026-10-06: API docs read (FS-545). No public pricing. Where Kenyan data is processed is not stated: a sample payload shows storage in Ireland and processing in Ireland and South Africa, an example only | Ask for pricing, where Kenyan data is stored and processed, the retention it applies, whether it holds its own NPDM agreement (FS-202), and Maisha | Architect | FS-204, FS-340, FS-382, FS-545 |
| PT-31 | Odoo | Software vendor; partner programme | Business Suite implementations; Dibon's own ERP | Global | Ready tier (owner) | Live | 2026-10-01: Dibon is an Odoo Ready Partner, working towards Silver | Confirm Silver requirements and timeline (FS-292) | Commercial lead | FS-026, FS-288, FS-292 |
| PT-32 | Zoho | Software vendor; partner programme | Business Suite implementations; SME Recon's Zoho wrapper | Global | Partner (owner); tier not recorded | Live | 2026-10-02: owner confirms Dibon partners with Zoho | Record the tier; check where Zoho hosts Kenyan customers' data (FS-312) | Commercial lead | FS-306, FS-312 |
| PT-33 | MetaMap | Identity verification vendor | Document checks, liveness, face match, as an alternative to PT-30 | Global; Kenya IPRS and BRS checks documented | Documented in its API reference (2026-10-06): two Kenyan checks only. IPRS takes a national ID number with first and last name and returns names, gender and date of birth, no photo; BRS returns company details, KRA PIN, share capital and shareholders, no directors listed. No register check for passports, alien or refugee IDs. Both need a webhook; OAuth client credentials | Candidate | 2026-10-06: API docs read (FS-545). Acquired by Incode, 11 Jun 2024. No public pricing | Weakest on Kenyan register coverage; keep only as a liveness and document-check candidate (SD-11) | Architect | FS-340, FS-331, FS-382, FS-545 |
| PT-34 | Banking-as-a-service microfinance bank (named in sources/confidential/) | Bank: nationwide microfinance bank with a banking-as-a-service offer | Partner bank for Collect and Escrow: accounts opened by API in the customer's name, virtual accounts, Paybill and PesaLink inflows, escrow-style controls | KE | KE: CBK microfinance bank, nationwide since 4 Nov 2024 (directory, Feb 2026) | Candidate | 2026-10-03: research. Partner process: conversation, agreement, sandbox within 48 hours, review, go-live. Also a possible competitor: it offers fintechs accounts directly | Open a conversation, ideally bringing a partner with volume | Commercial lead | FS-380 |
| PT-35 | KRA GavaConnect | Government API platform | KRA PIN checks | KE | KE (government) | Candidate | 2026-10-03: research. Free for approved developers | Register as a developer | Architect | FS-382 |
| PT-36 | Spin Mobile | Identity verification vendor | IPRS ID, KRA PIN, alien ID and passport checks; Safaricom phone-number name check; bank-account validation | KE | None | Candidate | 2026-10-03: research. Kenyan entity unconfirmed | Ask for pricing and data-processing location; its phone-name check may meet identity ID-05 | Architect | FS-382 |
| PT-37 | Sumsub | Identity verification vendor | Kenyan government database checks (national ID, passport) with liveness and selfie match | Global | None | Candidate | 2026-10-03: research. Published pricing: USD 1.35 a check, USD 149 a month minimum | Compare with PT-30 on coverage and data location | Architect | FS-382 |
| PT-38 | NetAPI Telecom | Aggregator of operator network APIs (GSMA Open Gateway channel partner) | SIM-swap and device checks across operators, through one interface | KE | None | Candidate | 2026-10-03: research. Kenya-based; five GSMA-certified APIs, including SIM Swap | Ask which Kenyan operators it reaches, and whether it offers number verification or name matching | Architect | FS-386 |
| PT-39 | Onit Bank | Bank: former partner bank | Ran Kapu Collect and the Gateway in production, Feb 2025 to Jun 2026 | KE | KE (CBK-licensed) | Declined | 2026-10-03: owner. The bank chose more traditional banking services and ended the arrangement in Jun 2026. 2026-10-09: the portfolio, v1.1, shared with a contact there (FS-679) | Follow up the portfolio: what the bank might use now, and whether it will be a reference | Commercial lead | FS-384, FS-390, FS-679, FS-726 |
| PT-40 | W-Harambee | Fintech partner: fundraising platform | Contributors' money held in accounts at the partner bank; withdrawals only to the fundraiser's set payout details. Collect's use case | KE | None | Unconfirmed | 2026-10-03: owner. Partner at Onit Bank until Jun 2026; its site still names Onit Bank as where funds sit | Approach together with a new partner bank (PT-34) | Commercial lead | FS-384, FS-380 |
| PT-41 | Tier-3 bank approached for Collect (named in sources/confidential/) | Bank | Partner bank for Collect and Escrow | KE | None | In discussion | 2026-10-03: owner. Slow; research shows the bank below its capital minimum | Pause until its capital is resolved | Commercial lead | FS-380 |
| PT-42 | Two further banks approached (named in sources/confidential/) | Bank | Partner bank for Collect and Escrow | KE | None | In discussion | 2026-10-03: owner. Slow going | Bring the due-diligence pack and a partner with volume (FS-370) | Commercial lead | FS-380 |
| PT-43 | Bowmans Kenya | Law firm | Dibon's own advice: NPS Act s.2 and the Gateway, VAT on gateway fees, the NPS Bill 2026; licence applications | KE | KE (Chambers banking and fintech Band 1; Legal 500 Tier 1) | Candidate | 2026-10-05: research: alerts on the NPS Bill 2026, the lender regulations, the Business Laws (Amendment) Act 2024 and VAT on gateways; reported the KENEX ruling that a SWIFT-connection software firm was a PSP | Conflict check against payments and core-banking competitors, then a first meeting on our own questions | Commercial lead | FS-428, FS-432, FS-435 |
| PT-44 | Cliffe Dekker Hofmeyr Kenya | Law firm | Customer referrals: lender licence applications, outsourcing approvals, AML programmes | KE | KE (Chambers fintech Band 2; Legal 500 Tier 2) | Candidate | 2026-10-05: research: three alerts on the 2024 Act and lender licensing; wrote the Kenya chapter of the Chambers Fintech 2026 guide | Ask about unpaid two-way referrals, and how its work for Safaricom's parent affects Safaricom matters | Commercial lead | FS-432, FS-435 |
| PT-45 | Anjarwalla & Khanna | Law firm | Dibon's own advice or customer referrals | KE | KE (Chambers banking and fintech Band 1; Legal 500 Tier 1) | Candidate | 2026-10-05: research: ranked top for banking and fintech; few public alerts found for 2024 to 2026 | Reserve | Commercial lead | FS-432, FS-435 |
| PT-46 | Dentons Hamilton Harrison & Mathews | Law firm | Customer referrals | KE | KE (Chambers banking Band 2, fintech Band 3; Legal 500 Tier 1) | Candidate | 2026-10-05: research: alert on the draft lender regulations (Sep 2025) | Reserve | Commercial lead | FS-432, FS-435 |
| PT-47 | Kaplan & Stratton | Law firm | Customer referrals | KE | KE (Chambers fintech Band 2; Legal 500 Tier 2) | Candidate | 2026-10-05: research: ranked for fintech; acts for payment providers, unnamed | Reserve; ask which payment providers it acts for | Commercial lead | FS-432, FS-435 |
| PT-48 | DLA Piper Africa Kenya (IKM) | Law firm | Customer referrals | KE | KE (Chambers banking Band 1; Legal 500 Tier 1) | Candidate | 2026-10-05: research: alerts on loan pricing and lending (2025, 2026); has advised a payments company that competes with the Gateway | Reserve | Commercial lead | FS-432, FS-435 |
| PT-49 | Mboya Wangong'u & Waiyaki | Law firm | Customer referrals for smaller lenders and Saccos | KE | KE (Legal 500 Tier 3) | Candidate | 2026-10-05: research: fintech and digital-lending practice; alerts on the credit market (Jul 2025) | A second referral channel at lower fees | Commercial lead | FS-432, FS-435 |
| PT-50 | KN Law | Law firm (boutique) | Customer referrals for smaller lenders and Saccos | KE | None | Candidate | 2026-10-05: research: practical alerts on the lender regulations and the Finance Bill 2026 | A second referral channel at lower fees | Commercial lead | FS-432, FS-435 |
| PT-51 | Association of Fintechs in Kenya (AFIK) | Industry association | A voice in policy (the NPS Bill, the lender regulations) and a directory listing; no regulatory status | KE | None | Candidate | 2026-10-05: research: membership is open to fintech service providers, paid (FS-437) | Apply for membership | Commercial lead | FS-437, FS-440 |
| PT-52 | Microsoft AI Cloud Partner Program | Software vendor; partner programme | Partner benefits and Azure credits; Marketplace listing through ISV Success; designations later | Global | None | Candidate | 2026-10-05: research: free to enrol; benefits packages from USD 350 a year; designations need 70 points; co-sell needs USD 100,000 in 12 months (FS-457) | Owner enrols in Partner Center, then the Success Core package and ISV Success | Commercial lead | FS-457, FS-464 |
| PT-53 | Prembly | Identity verification vendor | Register checks, business checks, liveness, document checks, AML screening; also Kenyan credit-bureau lookups and M-Pesa statement analysis | Pan-African and global | Documented in its API reference (2026-10-06), not yet in a contract. Kenyan endpoints: national ID, ID serial number (returns the photo), alien ID, passport, driving licence, KRA PIN checker and PIN from an ID number, tax compliance certificate (TCC) and withholding-tax checks, business registration with directors, credit bureau (person and business), M-Pesa statement analysis, phone number (carrier and line type, not the registered name), bank account, vehicle plate and collateral. Liveness, face comparison and document verification with face are global endpoints. Refugee IDs and Maisha not documented; certifications and where data is processed not stated. **Its draft terms (2026-10-12):** a reseller agreement (prepaid credit tokens, partner discounts of 15 to 25%, a sub-account per customer not stated) and a standard DPA (Kenya). Against our partner rules (C17), as drafted: rule 1 partly, since the DPA makes Dibon the controller where we act for the institution; rule 2 not met, where data is held unstated and transfers allowed; rule 5 not met, 72 hours; rule 6 partly, sub-processors unnamed; rule 7 partly, deletion at exit only on request. No uptime target; liveness and face match not on its price list; its bureau lookups would use its own subscription, not the institution's (LQ-12) | In discussion | 2026-10-12: its reseller agreement and DPA received and reviewed (FS-762); the drafts are kept out of git, in sources/confidential/prembly/. 2026-10-06: we had reached out (FS-546); API docs read | Send our changes letter (prepared, FS-762); then confirm where Kenyan data is held and processed, its certifications, its sub-processors, whether it holds its own NPDM agreement (FS-202), its route to the bureaus (LQ-12), refugee IDs and Maisha, and the full price list | Commercial lead | FS-340, FS-546, FS-762 |
| PT-54 | Access Bank Kenya | Bank — a customer's disbursement bank | Payment instructions, status, statements and account-name validation for Roan Capital's accounts (RC-18), through Roan Capital's own relationship | KE | None | Candidate | 2026-10-06: named by Roan Capital's requirement document (FS-586) | Roan Capital sends the bank access request (docs/outreach/bank-access-request.md) | Architect | FS-586 |
| PT-55 | The collateral registry (MPSR), operated by the Business Registration Service | Government register | Searches before lending; registering, extending and cancelling notices of security rights over movable collateral | KE | KE (government) | Candidate | 2026-10-07: research. Online through eCitizen, each user signing in with a one-time code; no API documented on BRS's pages or in its user guide. KSh 500 a search; notices free (BRS fee schedule; regulations LR-37) | Ask BRS (mpsr@brs.go.ke) whether lenders or their providers can reach the registry system to system, and whether an institution can hold an organisation account | Architect | FS-602 |
| PT-56 | SBM Bank (Kenya) | Bank — issues Dibon's corporate credit card | The card's statements, an alert for each transaction, and the credit available, for Dibon's own books (business suite: expenses); never a full card number | KE | KE (Dibon is a customer) | Candidate | 2026-10-12: owner to request the card's statements, alerts and balance (FS-715, FS-716) | Send letter 3 (docs/outreach/bank-api-requests-2026-10.md) | Architect | FS-715 |

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
| SD-11 | Liveness and face-match vendor | PT-30, PT-33, PT-37, PT-53 | C4 C5 C7 | — | OPEN | Biometric data: residency and retention weigh most (FS-203). Four candidates offer liveness and face match: PT-30, PT-33, PT-37 and PT-53 (FS-546). PT-36 offers ID and phone-name checks, not liveness (FS-382, FS-409) |
| SD-12 | Legal partner: Dibon's own counsel, and a firm for customer referrals, unpaid both ways | PT-43, PT-44, PT-45, PT-46, PT-47, PT-48, PT-49, PT-50 | C6 C14 C15 C16 | — | OPEN | FS-432, FS-435. Proposed: PT-43 for our own questions, PT-44 for referrals, PT-49 or PT-50 for smaller customers. The Advocates Act bars fee sharing (s.37) and paid referrals (s.38), so no money changes hands for a referral |

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
| C14 | Current, published work on CBK, payments and lending regulation | The questions are new (lender regulations, NPS Bill 2026); a firm that is already writing on them is already reading them |
| C15 | Conflicts: acts for a competitor, or for Safaricom or a bank on the other side | A conflict surfaces when we most need the advice |
| C17 | Accepts our partner rules (docs/rules.md §3): a processing agreement first, data in Kenya or a named transfer, only what each call needs, no standing access, a breach told within 24 hours, yearly evidence, sub-processors named, data returned or deleted at exit, terms an institution must accept known before we sign | Their failure becomes ours: the institution and its regulator hold us to account (FS-713) |
| C16 | Fees suited to the matter | A small lender's licence application cannot carry a top-tier rate |

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-11](law/LR-11.md) The National Payment System Act (Cap. 491A).** Regulator: Central Bank of Kenya. Made under: An Act of Parliament. In force: Yes. Version read: as at 2025-11-04, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2011/39/eng@2025-11-04).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 2 | s. 2 | Its definitions; a "payment service provider" includes whoever provides services for sending, receiving, storing or processing payments electronically, and any person that processes or stores data on behalf of such a provider or its users |

**[LR-40](law/LR-40.md) The Advocates Act (Cap. 16).** Regulator: The Law Society of Kenya and the Advocates Disciplinary Tribunal; offences go to the courts. Made under: An Act of Parliament. In force: Yes. Version read: as at 2024-04-26, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/1989/18/eng@2024-04-26).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 37 | s. 37 | An advocate who agrees to share the profits of professional business with anyone who is not an advocate commits an offence; a bonus to the advocate's own staff is not caught |
| s. 38 | s. 38 | Whoever, not being qualified, procures or tries to procure an advocate's employment for payment or any advantage, or asks an advocate for one, is a tout; the Chief Justice may bar a tout from employment by advocates |
