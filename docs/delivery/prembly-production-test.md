---
id: prembly-production-test
name: Prembly in production — the test plan, week of 2 November 2026, and how Smile ID compares
kind: plan
status: living
law: LR-17
released: unreleased
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-1075, FS-1076, FS-340, FS-204, FS-205, FS-202, FS-1066, FS-570, FS-331, FS-762, FS-1077]
last_reviewed: 2026-11-01
---

# Prembly in production · test plan · week of 2 November 2026

What we test against Prembly's production service this week, with whose
details, what we record, and which open items each result settles
(FS-1075, FS-1076). Lillian's Postman collection, built against
Prembly's sandbox, is the starting point. §5 compares Smile ID, from its
documentation, so the order of providers for each check (FS-340,
FS-1077) rests on both.

**Led by** Lillian, with Eric; testers are team members who volunteer
their own details.

## 1 · Before the first call

1. **Only our own details.** Each tester uses their own ID, KRA PIN,
   phone number and M-Pesa statement, and signs a one-paragraph consent
   first: what is sent, to Prembly, why, and that the responses are
   deleted once recorded. **No customer's data** until Prembly's data
   processing agreement meets our partner rules: as drafted it says
   nothing of where data is held, allows transfers abroad and gives 72
   hours for a breach (partners PT-53, FS-762, LQ-32).
2. **The production key in the password manager,** never in a
   collection, a file or a chat; the collection reads it from an
   environment variable. The sandbox key leaves the collection too.
3. **A bureau check is a credit enquiry.** A CRB lookup on a tester may
   be recorded on their credit file; a tester agrees to it separately,
   or the CRB tests wait.
4. **Spend capped** at KES 10,000 in prepaid credit (proposed): at the
   brochure's list prices, a tester's full set costs under KES 1,000.
5. **Nothing personal in the record.** §6 records whether each check
   worked, which fields came back (by name, never their values), how
   long it took and what it cost. Responses, which carry the tester's
   name, date of birth and ID photo, are deleted once recorded.

## 2 · The tests

| # | Check | With | We record | It passes when | Settles |
|---|---|---|---|---|---|
| P1 | National ID | A tester's ID number | Fields returned; whether a photo comes back; time | The record matches the tester | FS-340; identity ID-01 |
| P2 | Alien ID | A tester holding an alien card, if any | As P1 | As P1; skipped and noted if no tester has one | FS-340; ID-01 |
| P3 | Passport | A tester's passport number | As P1 | As P1 | FS-340; ID-01 |
| P4 | KRA PIN | A tester's PIN, and the PIN from their ID number | What comes back, and whether the name is checked | The PIN validates and belongs to the tester | FS-205; ID-06 |
| P5 | Business registry search | Dibon's own registration number | Status, directors and owners returned | Dibon's record comes back as the registry holds it | FS-205; ID-07 |
| P6 | Phone status | A tester's number | What comes back | Recorded either way: the carrier and line type are expected, not the registered name | FS-205; ID-05 still needs the operators' own checks (FS-392) |
| P7 | Credit bureau, basic and advanced | A tester who agreed to it (§1, 3) | The report's sections and score; which bureau; whose subscription it ran on | A report comes back for the tester | FS-570; crb CR-02; LQ-12 |
| P8 | M-Pesa statement analysis | A tester's own statement file | The metrics returned, against those decisioning computes (DE-01) | Metrics come back that we can map to DE-01's | FS-570; decisioning DE-01 |
| P9 | PEP and sanctions | Testers' own names (a clear result expected), and a public figure's name from a published list (a match expected) | Lists searched; whether Kenyan PEPs are included; result format | Both results as expected | FS-1066; financial-crime FC-05, FC-06. Needs Prembly's endpoint first: not in the collection |
| P10 | Document with face (liveness and face match) | A tester's ID card photo and a selfie | The match result; the liveness check's result | The tester matches and a printed photo does not | FS-204; ID-04 |
| P11 | Errors and limits | A wrong ID number, a malformed one, a burst of calls | Error codes and messages; rate limits; timeouts | Each failure is clear and machine-readable | How identity handles a failed check (ID-01's manual route) |

## 3 · What we ask Prembly in the same week

- Where Kenyan requests and responses are stored and processed, for how
  long, and its sub-processors (LQ-32).
- Whether it holds its own agreement with the national register
  (FS-202), and its route to the credit bureaus (LQ-12).
- The PEP and sanctions endpoint, its lists, and whether Kenyan PEPs
  are in them (FS-1066).
- Refugee IDs and Maisha; its certifications; an uptime commitment.
- Its full price list against the reseller agreement's discounts
  (FS-331), and how sandbox and production are told apart on
  api.prembly.com.

## 4 · What the results decide

| Item | Settled by the tests | Still needed |
|---|---|---|
| FS-340, FS-204 | Whether Prembly's checks work on real records | The choice, after §5's Smile ID run; a signed agreement |
| FS-205 | KRA PIN and the business registry (P4, P5) | The operators' name check is not offered (P6) |
| FS-202 | The vendor route on Dibon's account | Prembly's register agreement; Roan Capital's RC-02 |
| FS-1066 | P9, once Prembly gives the endpoint | — |
| FS-570, in part | P7, P8 | LQ-12 |
| FS-331 | The real price per check | The pricing decision |

## 5 · How Smile ID compares

From Smile ID's documentation, read 1 November 2026
(docs.usesmileid.com, its Kenya coverage, products, security and API
pages), against Prembly's API reference (2026-10-06), its Kenya
brochure and Lillian's collection. Neither publishes Kenyan data
residency; Smile ID publishes no prices.

| | Prembly | Smile ID |
|---|---|---|
| National ID | Yes; the ID serial number check returns the photo | Yes, with photo, address, place of birth, deceased flag; also without photo |
| Alien card | Yes | Yes |
| Passport | Yes | Yes |
| Refugee ID, Maisha | Not documented | Refugee ID checked as an alien card (PT-30); Maisha not documented |
| KRA PIN | PIN check, and the PIN from an ID number; tax compliance certificate | The PIN from an ID number only, no personal details; tax information |
| Driving licence | Yes | Not in its Kenyan list |
| Phone | Carrier and line type, not the owner | Matches a phone number against a national ID number |
| Business registry | Registration with directors | Registration with directors and beneficial owners (needs the postal code and address in Kenya); its newer documentation does not yet confirm Kenya |
| PEP and sanctions | In the brochure; no endpoint in the collection | Documented: sanctions, PEPs, enforcement and adverse media, once or monitored; Kenyan PEPs not confirmed |
| Liveness and face match | Yes; not on its price list as drafted | Yes, with selfie and liveness against the register's photo |
| Credit bureau | Yes, on its own subscription | No |
| M-Pesa statement analysis | Yes | No |
| Certifications | Not stated | ISO 27001; SOC 2 Type II; ISO 30107-3 Level 2 for liveness |
| Data location | Not stated | Not stated; its examples show storage in Ireland, processing in Ireland and South Africa, five years' retention |
| Prices | Published in KES (national ID 60) | Not published |
| Terms in hand | Reseller agreement and DPA, our changes prepared (FS-762) | None |
| Sandbox | api.prembly.com with a sandbox key | testapi.smileidentity.com, separate from api.smileidentity.com; keys per environment |

**Reading it.** Prembly covers more of what a Kenyan lender needs in one
place (the bureaus, M-Pesa statements, tax certificates, driving
licences) and has prices and terms on the table. Smile ID is the
stronger identity specialist: certified, with documented AML screening
and a phone check that binds a number to an ID. Neither yet shows where
Kenyan data stays, which our partner rules require.

**Both, by design** (FS-1077): identity supports several aggregators
and direct sources such as NPDM behind each check (identity §5,
"Providers"), so the question is which goes first for each check, and
which is the fallback, not which one we choose. **Proposed:** run this
week's Prembly tests as planned; ask Smile ID for sandbox access and run
P1, P3, P4, P6, P9 and P10 against it the same way; then set each
check's primary and fallback (FS-340) on both results and both answers
on data location.

## 6 · Results

Filled during the week; no personal data (§1, 5).

| # | Date | Tester | Result | Fields returned | Time | Cost (KES) | Notes |
|---|---|---|---|---|---|---|---|
| P1 | | | | | | | |

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
