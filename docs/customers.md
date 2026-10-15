---
id: customers
name: Customers — who we deliver to, and what each depends on
kind: register
status: living
released: 2026.10.15
owner: Delivery lead
classification: Internal
review_ids: [FS-390, FS-395, FS-413, FS-414, FS-416, FS-419, FS-420, FS-443, FS-612, FS-674, FS-680, FS-720, FS-721, FS-835, FS-837, FS-838]
last_reviewed: 2026-10-15
---

# Customers — who we deliver to, and what each depends on

**What this tracks:** every institution we have delivered to or are
delivering to, its stage, and the capabilities its delivery depends on
(FS-413). Partners are in docs/partners.md; prospects are not tracked yet.

**Rules for this file:**

1. **A stage changes on an event, with a date** in "Last event".
2. **Every capability id listed must exist** in a module; the check tool
   fails if one does not. A customer's delivery file maps its requirements
   to those ids, row by row.
3. **Customers are named only with the owner's release** (FS-414), and
   never in the portfolio or outreach until they agree to be a reference
   (FS-401) or their contract allows it. KCB's and NBK's contracts are
   believed to allow it, to be confirmed (FS-420). People are never named.
4. **Material from clients/ is written about, never copied.** The
   requirement documents themselves stay there.

**A delivery map** (docs/customers/, one per customer in delivery, linked
from its row) takes the customer's own requirements, row by row, and sets
each against the capabilities that meet it. Every map has the same eight
sections (docs/customers/_template.md, FS-837): the engagement;
requirements against capabilities, each *Covered*, or *Partial* with its
gap stated, citing the document it came from; what is out of scope; the
open answers, open and answered; its products; its documents, by DR id in
the [document register](document-register.md); its people and roles; and
its changelog. **Each delivery has its own version** (rules, Dibon 12):
1.0 when the customer agrees its requirements and scope, minor versions
between, cut on the owner's word; the latest is the first entry of its
§8. **To add one** when a customer reaches "In delivery": copy the
template, link it from the row, and keep its capabilities and the row's
"Depends on" the same; the checks hold the template and the two lists
together.

**Stages:** Proposal, In delivery, Live, Past.

| Id | Customer | Type | Products | Stage | Last event | Next step | Owner | Delivery file | Refs |
|---|---|---|---|---|---|---|---|---|---|
| CU-01 | Roan Capital | Microfinance lender | Kapu MFI on Kapu Core | In delivery | 2026-10-15: product and operations meeting; delivery 0.5 (the 30-day loan drafted and checked, its application form in versions 0.1 and 0.2, documents registered) | Answers from the meeting into the delivery map and the product draft; the licence, CBK's approval of pricing and consent to processors at a senior management meeting | Delivery lead | [customers/roan-capital.md](customers/roan-capital.md) | FS-395, FS-397 to FS-403, FS-414, FS-431, FS-435, FS-453 |
| CU-02 | Onit Bank | Bank | Kapu Collect and Kapu Pay Gateway, with W-Harambee as the partner; the bank's core is Craft Silicon's Bankers' Realm (FS-612) | Past | 2026-06: production ended after Feb 2025 to Jun 2026; the bank chose more traditional banking services | None. The production record is named with the owner's permission (FS-391) | Commercial lead | — | FS-384, FS-390, FS-391, FS-392; partners PT-39 |
| CU-03 | KCB | Bank | Since 2021: MobiReg (Meliora's CRM) and its maintenance; the Tiara SMS gateway (Meliora's), its upgrade and migration; USSD and digital lending (retailer finance, KOPA float, term loans, SAHL) on Dibon's menu platform; the Sopra loan engine; the bank's cores, Temenos T24 and Sopra Banking, worked with (FS-612); an account mandate API (tested, not live). Ongoing in 2026: Tiara enhancements, CVM integration, migration from Sopra to GDP APIs, MobiReg Project X and e-mobility | Live | 2026-10-05: project list read: 20 engagements since 2021, 5 of them active or ongoing (FS-443). KCB moved USSD to a platform of its own; the lending and SMS work continued | Confirm that the contract lets us name KCB (FS-420); owner compiling the details of the supply | Commercial lead | — | FS-416, FS-418, FS-419, FS-420; partners PT-19, PT-20, FS-443 |
| CU-04 | National Bank of Kenya (NBK) | Bank | Since 2021: an SMS gateway system, supplied, installed and upgraded (with international SMS termination), with support and maintenance; transactional and promotional SMS (SDP and SMPP); SMS and email templates; shortcodes and a USSD code in 2026 | Live | 2026-10-05: project list read: 6 engagements since 2021, 5 of them active or ongoing (FS-443) | Confirm that the contract lets us name NBK (FS-420) | Commercial lead | — | FS-417, FS-419, FS-420; partners PT-20, FS-443 |

## What each customer depends on

Each customer's capabilities, by module. For a customer with a delivery
map, the list is exactly what its map maps its requirements to; the check
holds the two together. Statuses are never typed here: the reader shows
each capability's status beside it, read from its module.

### CU-01 · Roan Capital

| Module | Capabilities |
|---|---|
| [access](modules/access.md) | AC-03, AC-05, AC-09, AC-13, AC-16 |
| [business-suite](modules/business-suite.md) | BS-01, BS-02, BS-20, BS-12 |
| [collect](modules/collect.md) | CO-21 |
| [core](modules/core.md) | KC-01, KC-04, KC-07, KC-08, KC-09, KC-15 |
| [decisioning](modules/decisioning.md) | DE-01, DE-02, DE-03, DE-04 |
| [financial-crime](modules/financial-crime.md) | FC-05, FC-12, FC-16 |
| [identity](modules/identity.md) | ID-01, ID-02, ID-03, ID-07, ID-10, ID-11, ID-12, ID-15, ID-17, ID-19 |
| [mandates](modules/mandates.md) | MD-01, MD-02, MD-03, MD-04, MD-05, MD-06, MD-07, MD-08, MD-09, MD-10, MD-18 |
| [messaging](modules/messaging.md) | MS-01, MS-02, MS-03, MS-09, MS-10, MS-11, MS-12, MS-14, MS-15, MS-19 |
| [mfi](modules/mfi.md) | MF-01, MF-02, MF-03, MF-04, MF-05, MF-06, MF-07, MF-09, MF-10, MF-11, MF-12, MF-13, MF-14, MF-15, MF-18, MF-20, MF-21, MF-22, MF-23, MF-24, MF-25, MF-26, MF-28, MF-34, MF-35, MF-37, MF-38, MF-39 |
| [rails](modules/rails.md) | RL-01, RL-07, RL-10, RL-12, RL-14, RL-20, RL-21, RL-29 |
| [recon-observability](modules/recon-observability.md) | RO-01, RO-02, RO-04, RO-05, RO-07, RO-08, RO-16, RO-17, RO-18, RO-19, RO-23, RO-24, RO-25, RO-27 |

### CU-02 · Onit Bank

| Module | Capabilities |
|---|---|
| [collect](modules/collect.md) | CO-01, CO-02, CO-03, CO-05, CO-06, CO-11 |
| [gateway](modules/gateway.md) | GW-01 |
| [identity](modules/identity.md) | ID-05 |
| [rails](modules/rails.md) | RL-03, RL-19 |

### CU-03 · KCB

| Module | Capabilities |
|---|---|
| [mandates](modules/mandates.md) | MD-11 |
| [omni-channel](modules/omni-channel.md) | OC-03, OC-14 |

### CU-04 · National Bank of Kenya (NBK)

| Module | Capabilities |
|---|---|
| [omni-channel](modules/omni-channel.md) | OC-03 |
