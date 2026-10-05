---
id: compliance
name: Licences, registrations and certifications
kind: register
version: 0.1.0
owner: Compliance lead
classification: Internal
last_reviewed: 2026-10-05
---

# Licences, registrations and certifications

What Dibon holds, what it needs, and the first step for each (FS-363).
Requirements were read from the primary sources on 2026-10-03; each row
names its instrument so it can be checked again. Dibon submits every
application; this file tracks them. The laws behind these rows, and behind
our customers' obligations, are in the law register, docs/regulation.md
(FS-429).

**Status:** Held · Needed · Planned (needed later, when a product needs it)
· Watching (a draft law or rule that may change what is needed).

## The register

| Id | What | Status | Why it matters | Requires | First step | Owner | Refs |
|---|---|---|---|---|---|---|---|
| LC-01 | ODPC registration as a **data processor** | Held | Processing customers' data on their behalf | Certificate valid 24 months; renew at least 30 days before expiry | Record the certificate number and expiry date here | Compliance lead | FS-361 |
| LC-02 | ODPC registration as a **data controller** | Needed | Dibon decides how its own staff and customer data is used; registration is by role, and the small-business exemption does not cover financial services | Application and fee on the ODPC portal; both roles can be held together | Apply on the ODPC portal | Compliance lead | FS-367 |
| LC-03 | PRSP licence, Communications Authority of Kenya | Held | SMS direct to the operators | As licensed | Record the licence number and renewal date here | Compliance lead | FS-160 |
| LC-04 | ISO/IEC 27001:2022 certification | Needed | Banks ask for independent attestation of their providers (CBK cybersecurity guidance, 2017 and 2019); it backs every "designed in line with" claim | An information security management system in operation; Stage 1 and Stage 2 audits, Stage 2 within 6 months of Stage 1; a 3-year certificate with yearly surveillance audits | Gap analysis (internal or a consultant), then quotes from the two KENAS-accredited bodies: KEBS Certification Body and Interdigicert (Cert-Trust). BSI also certifies in Kenya under foreign accreditation | Compliance lead | FS-361 |
| LC-05 | SASRA vendor terms for Saccos (circular SASRA/GG/1/2023) | Needed: working towards (FS-368) | Before any regulated Sacco can contract Kapu Sacco or Collect | NPS Act compliance or membership of a self-regulatory body SASRA recognises; penetration tests twice a year; an annual IT audit; 24/7 monitoring; attacks reported to SASRA within 12 hours; separate environments per Sacco; a bank guarantee of at least 10% of Paybill float, and insurance | Confirm with SASRA which self-regulatory bodies it recognises, and price the bank guarantee | Commercial lead | FS-368 |
| LC-06 | CBK authorisation as a payment service provider | Needed | Needed only if Dibon itself provides payment services: aggregation (FS-031), and possibly the Gateway under the 2026 Bill (LC-07) | National Payment System Regulations 2014: application and authorisation fees and core capital by category (an electronic retail PSP needs KSh 5m); incorporation documents, business plan, governance and AML controls, an outsourcing contract, an IT audit report, and evidence of Data Protection Act compliance | Owner, 2026-10-05: assume we will need it (FS-444). Start now: (1) the legal opinion on the category (SD-12); (2) a pre-application meeting with CBK's payments department; (3) the reg 4 file: incorporation documents, the services and programme of operations, the public interest served, a three-year business plan and budget, evidence of KSh 5m core capital, governance and internal controls, AML controls, structure and outsourcing, settlement arrangements, and directors' and significant shareholders' particulars for fit-and-proper review; (4) Form 1 to the Governor with a sworn affidavit; KSh 5,000 application and KSh 100,000 authorisation fees; renewal yearly by value processed. The same file serves the payment gateway licence under the Bill, which allows a year's transition | Commercial lead | FS-031, FS-061, FS-437, FS-440, FS-444 |
| LC-07 | Draft National Payment System Bill 2026 | Watching | Would create a "Payment Gateway" licence (KSh 10m capital) and require CBK approval for any outsourcing | Comments close **9 Oct 2026** | Comments drafted (docs/outreach/nps-bill-2026-comments.md, FS-376); the owner signs and submits them by 9 Oct 2026 | Owner | FS-369, FS-376 |
| LC-08 | CBK approval of customers' outsourcing | Watching | A bank must get CBK approval before material outsourcing (CBK/PG/16); the draft replacement, due 1 Jan 2027, names cloud and SaaS. PSPs notify CBK 30 days before signing | The customer applies; Dibon supplies the due-diligence pack | Prepare the pack: security controls, continuity and exit plans, audit rights, certifications | Delivery lead | FS-370 |
| LC-09 | ISO 22301 business continuity | Planned | Backs the twice-yearly recovery tests | One KENAS-accredited body (Cert-Trust), for financial intermediation | After LC-04 | Compliance lead | FS-365 |
| LC-10 | ISO/IEC 20000-1 service management | Planned | Backs the support tiers and ITIL practice | No KENAS-accredited body found; SGS advertises it in Kenya | Stay "in line with" until a route is confirmed | Delivery lead | FS-365 |
| LC-11 | PCI DSS | Planned | When cards arrive | Depends on Dibon's role: as a merchant, SAQ A with a processor-hosted page; hosting payment pages for merchants makes Dibon a service provider (SAQ D, if the card brands allow self-assessment) | Ask the chosen acquirer what validation it requires | Architect | FS-091 |
| LC-12 | Direct access to the national register (NPDM, formerly IPRS) | Needed | The authoritative, cheapest national ID check | Letter of intent, signed MOU, KRA tax compliance certificate, business permit, Data Commissioner registration, security policy. KES 50,000 to connect, KES 20 a check | Send the letter of intent | Compliance lead | FS-382 |
| LC-13 | Mobile operator agreements: the phone-number-to-name check (Safaricom, Airtel) and the Daraja security APIs (SIM swap, IMSI) | Needed | Collect's account opening is gated by the operator's check of a phone number against the registered name (collect CO-02). At Onit Bank this ran under Onit's own agreements with Safaricom and Airtel, so each new bank needs its own agreements, or Dibon needs them (FS-392). Also the SIM-swap check the portfolio promises "where the operator offers one" | Name-check agreements with Safaricom and Airtel, held by the bank or by Dibon; authorised-partner approval from Safaricom for the security APIs, which may need to be held per bank or Sacco customer; and, from each operator, notice when a number is recycled or an API showing how long the current subscriber has held it (FS-448, FS-453) | Ask Safaricom (partner-requests draft 3) and Airtel (draft 4) what each requires; draft 3 asks about the security APIs and Hakikisha, not yet the name check at account opening | Architect | FS-386, FS-387, FS-392 |
| LC-14 | ODPC accreditation as a data protection compliance auditor | Planned | Lets us audit data protection compliance for institutions we do not supply (docs/assurance.md) | ODPC registration (held, LC-01); client references; three audit staff, one with an IIA, LSK or ISACA licence; a lead auditor certified in data protection; professional indemnity insurance of KSh 20m; renewed yearly (ODPC prequalification, 2025) | Hire or train the qualified people and price the insurance; then apply | Compliance lead | FS-438, FS-440 |

## What this changes elsewhere

- **In-country hosting is a choice, not a legal duty** for payments data
  (FS-366). The portfolio does not say otherwise.
- **SASRA's terms are stricter than the security page** (FS-368): twice-yearly
  penetration tests against "before go-live".
- **Bank sales wait on CBK approval** for hosted and managed options
  (FS-370), and onboarding now asks about it (docs/onboarding.md OB-COM-15).
