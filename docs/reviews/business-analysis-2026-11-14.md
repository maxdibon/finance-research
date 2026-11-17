---
id: business-analysis-2026-11-14
name: The business, analysed — 14 November 2026
kind: review
status: draft
released: unreleased
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-1194, FS-1195, FS-1196]
last_reviewed: 2026-11-14
---

# The business, analysed · 14 November 2026

**What was reviewed:** the business this repository describes, from what
it records: the customers and partners, the competitors page, the market
and pricing review of 11 November, the risks, the licences, the delivery
plan and the registers (FS-1194); and, added the same day, Dibon's 2026
budget, payroll, CVs and client references, which are kept out of the
repository and whose conclusions are here in aggregate, without figures
(FS-1195). **Not reviewed:** an income statement, a cash balance or a
forecast, which do not exist in what was supplied, so runway cannot be
stated; what any customer would pay; and anything a competitor has not
published. Where a point is a
judgement and not a record, it says so.

**The short answer:** the market is hard in the middle and open at the
edges. Selling a new core against the established ones is the least
attractive place to stand; working beside a bank's own core, serving the
lenders newly brought under the Central Bank, and reconciliation are the
most. Inside, the one advantage that lasts is a record of running in
production for banks and on M-Pesa; the design is a head start that
expires, and it is worth nothing until it runs. So the business turns on
one thing: **Roan Capital live, in Kenya, as the first reference.**
Six gaps stand between here and that, and none of them is design. And
the banks we serve are more than the advantage: their work pays for the
build.

## 1 · Which analyses, and why

| Analysis | Used | Why |
|---|---|---|
| PESTLE | Yes, short | A regulated market: the law makes the demand and sets the limits. The legal part is already the law register and the legal questions, so this only draws out what moves the business |
| Porter's Five Forces | Yes | Shows where in the market to stand, which a list of competitors does not |
| VRIO | Yes | Separates what lasts from what is only early; it is the honest test of "our design is better" |
| SWOT | As the summary | Its four boxes are filled from the three above, not researched again |
| Gap | Yes | The one that ends in actions with rows |
| SOAR | No | It is SWOT without the weaknesses and threats, made for a workshop. It would suit the first hackathon, with the team, to agree what they are aiming at; as analysis it repeats §5 |

## 2 · PESTLE: what outside moves the business

| | What | So |
|---|---|---|
| **Political** | The draft National Payment System Bill would license payment gateways (capital of KES 10 million) and require CBK's approval of outsourcing (LC-07); CBK's replacement outsourcing guideline, due 1 January 2027, names cloud and software as a service (LC-08) | Our customers will need approval to use us, and we may need a licence to serve them: the approval pack is a product, not paperwork |
| **Economic** | Small lenders lend KES 1,000 to 50,000 a loan, and 0.1% of money moved earns little there (market review P4, P5); a bank must hold KES 10 billion of core capital by 2029; much of our cost is in dollars (hosting, identity checks, licences) and our income in shillings | The floor sets most lenders' price; small banks will merge or be bought, so fewer buyers, each needing systems joined; currency is a cost risk to price in |
| **Social** | Money moves on the phone; lenders reach borrowers through field officers and USSD as much as apps; public feeling about lenders' conduct is what the 2026 regulations answer | Channels and conduct rules are part of the product, and where our record is (USSD, SMS, M-Pesa) |
| **Technological** | No large public cloud has a region in Kenya; Fineract is open to anyone; M-Pesa is one operator's interface; SIM-swap fraud; decisions by machine must be explained (LR-03 reg 60) | Hosting in Kenya is scarce and so a dependency; the core is not what sets us apart, what is built around it is |
| **Legal** | The 2026 regulations bring every non-deposit-taking lender under CBK (LR-03): 281 digital credit providers and 66 other microfinance institutions counted, overlapping (market review M5); personal data stays in Kenya (LR-17); 46 legal questions open, among them whether Dibon is itself a payment service provider (LQ-09) | The largest opening we have: lenders who must now meet rules we have already written as data. And the largest unknown: a licence of our own |
| **Environmental** | Little bears on us directly: two sites and their power; lenders to farmers carry the weather in their books | Thin, and said so: not a driver of this business today |

## 3 · Five Forces: where to stand

For the market at the centre, a platform for lenders, Saccos and small
banks. The readings are judgements from the records cited.

| Force | Reading | Why |
|---|---|---|
| Rivalry | High | 28 competitors tracked; established local cores with bases of their own (one with over 120 Saccos, one with over 70); a Mifos-family product already sold here from about EUR 15,000 a year. Saccos are where local, digital-first rivals are strongest (competitors) |
| New entrants | Medium to high | The core is open source. What keeps entrants out is not software: knowing the regulations, the operators' agreements, hosting in Kenya, attestation, and references |
| Substitutes | High | A spreadsheet and M-Pesa statements at the small end; staying on the core already paid for; building in-house at the large end, as one bank we serve has now done for lending we ran (FS-1000) |
| Buyers' power | High | Few buyers in each segment, long decisions with a regulator in the room; small ones buy on price, large ones on attestation and track record. Once in, moving is costly: that is against us arriving and for us staying |
| Suppliers' power | High | One operator for most mobile money, whose security queries are granted, not bought (LC-13); one named host in Kenya, not yet contracted (FS-032); the national register's access (LC-12); a sponsor bank for PesaLink; Odoo's licences |

**What it says:** head-on replacement of a core is the worst seat: every
force is against it. Three seats are better, because each lowers a
force:

- **Beside the core** (integrated mode): the buyer keeps what it has, so
  the cost of moving, the substitute of staying put, and rivalry with the
  core's vendor all fall. The core vendors do not offer it (competitors).
- **The newly regulated lenders:** the regulations remove the substitute
  of doing nothing, and few rivals state that they carry the rules.
- **Reconciliation first:** a small purchase that touches no core, and
  the way in at Lofty Corban and in the conversation with SBM Bank.

Suppliers' power does not fall in any seat. It is managed, not avoided:
a second host, each rail behind one interface (rails rule 1), and the
operators asked early.

## 4 · VRIO: what lasts

| What we have | Valuable | Rare | Costly to copy | Organised to use it | So |
|---|---|---|---|---|---|
| A record in production: M-Pesa collections and payouts at a microfinance bank; USSD lending and SMS for two banks since 2021 | Yes | Yes, among firms our size | Yes: years and trust | Partly: one engagement has ended, and the knowledge sits with few people | **The one that can last**, if it is written into the build and kept current |
| Banks that already buy from us | Yes | Yes | Yes | Not yet for Kapu: the bank channel is a proposal | Unused for Kapu, and today what funds it: the build is paid for from services to a few customers, two banks foremost (FS-1195) |
| The regulations as data: the law register, the lender rules, the rulebooks, the transaction model | Yes | Yes: rivals do not state it | Partly: it is diligence, and a funded rival could do it in a year or two | No: designed, not running | A head start, worth nothing until built |
| The architecture: Fineract unforked, an instance per institution in Kenya, integrated mode | Yes | Integrated mode, yes | No: a choice others can make | No | Early, not lasting |
| Licences held: PRSP, data processor | Yes | Somewhat | No | Yes | Parity |
| The back office on Odoo | Yes | No | No | Yes | Parity |
| How the team works: checks on every commit, each person's Claude | Yes, for a small team | Today | No | Yes | Early, and shrinking |

**What it says:** nothing we have designed is an advantage yet; a
record is. The design buys time, perhaps a year or two, to turn it into
a second record: a regulated lender live on Kapu. Every month spent
designing a further module is a month of that time used.

## 5 · SWOT: the summary

| | Helps | Hurts |
|---|---|---|
| **Inside** | **Strengths:** a production record with banks and M-Pesa; the regulations already written as data; integrated mode; licences held; a first customer in delivery; a team strong in channels, Odoo and running containers (team-skills) | **Weaknesses:** nothing of Kapu in production; no price for any customer and no cost per institution (market review P1, P6); one seller, who is also the CEO (M3); the CTIO holding five roles; a rota of three (risks); hosting not contracted; ten or more products designed for a team of about fourteen; the build paid for from services income that rests on a few customers, with no budget line or forecast of its own (FS-1195); the platform's core (Fineract, Keycloak, Kafka, Flux) still to be learnt (team-skills) |
| **Outside** | **Opportunities:** every lender now under CBK; small banks joining up before 2029; businesses reached through institutions (Kapu Business); reconciliation as the first sale; the banks we already serve; assurance services (market/assurance) | **Threats:** established cores with bases and budgets; a buyer building its own, where that buyer's work also funds the build; a licence of our own, or the Bill's capital (LQ-09, LC-07); two suppliers we cannot replace quickly; real data with nowhere lawful to run (LQ-46); the first delivery slipping, and with it the reference |

## 6 · Gap: from here to a business

| | Today | Needed | The gap | Rows |
|---|---|---|---|---|
| 1 · A place to run | The public Azure sandbox, made-up data only | Two sites in Kenya before real borrowers | A host contracted, or a second named; counsel on running abroad meanwhile | FS-032, FS-775, FS-1192; LQ-46 |
| 2 · Something running | Building began on 11 November; the soft launch is 30 November | Roan Capital's contracted first phase, which is narrower than our R1 (FS-735), built and tested | Sixteen days. A date and a scope to agree with Roan Capital now, on what the team can show | FS-735, FS-1193 |
| 3 · A price | None on record for anyone | Roan Capital's price; a floor per tier | What an institution costs us a month, then the floor (market review §4) | FS-1185, FS-1190 |
| 4 · People | One seller part-time; the CTIO in five roles; a rota of three | Squads that own what they run; a rota of four or five; a seller with time | The hackathons, the first of them teaching the core no CV yet names (team-skills); the hire already decided (FS-474); roles handed on as squads take them | FS-1193, FS-474, FS-1196 |
| 5 · Permission | A data processor and a PRSP | Data controller registration; the answer on being a payment service provider; SASRA's vendor terms before any Sacco; ISO 27001 before banks | Counsel, and a compliance officer in the seat | FS-367, LQ-09, LC-02, LC-04, LC-05 |
| 6 · Money | A monthly record of spending; income from services to a few customers; no line for the build | A budget for the build (hosting, attestation, counsel, the hire, training) and a thirteen-week cash forecast, the same that Kapu Business offers its customers | Both to write; the income's reliance on a few customers to reduce | FS-1195 |
| 7 · Proof | A record in channels and collections | One regulated lender live on Kapu | Gaps 1 to 6 | CU-01 |

## 7 · What follows

Judgements, for the owner to accept or not:

1. **One reference before anything else.** Roan Capital live in Kenya is
   worth more than any further module designed.
2. **Hosting settled this month, or its fallback named.** It is the one
   gap the team cannot close by working harder.
3. **Agree the soft launch's scope and date with Roan Capital now,**
   from the contracted first phase and what the first hackathon shows.
4. **Cost per institution, then the floor, then Roan Capital's price.**
5. **Sell from the better seats:** beside the core and reconciliation to
   the banks already served; the rules to the newly regulated lenders.
   Leave replacing a Sacco's core until there is a reference.
6. **Hold new design** (treasury beyond TR-01, Kapu Business) as
   designed, until R1 is live.
7. **A budget and a cash forecast for the build,** before the next host
   or hire is signed; and the banks' work protected while Kapu is built,
   since it pays for it.
