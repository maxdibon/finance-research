---
id: customers
name: Customers — who we deliver to, and what each depends on
kind: register
version: 0.1.0
owner: Delivery lead
classification: Internal
review_ids: [FS-390, FS-395, FS-413, FS-414]
last_reviewed: 2026-10-03
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
   (FS-401). People are never named.
4. **Material from clients/ is written about, never copied.** The
   requirement documents themselves stay there.

**Stages:** Proposal, In delivery, Live, Past.

| Id | Customer | Type | Products | Stage | Last event | Next step | Owner | Depends on | Delivery file | Refs |
|---|---|---|---|---|---|---|---|---|---|---|
| CU-01 | Roan Capital | Microfinance lender | Kapu MFI on Kapu Core | In delivery | 2026-10-03: requirement document (v1.0, 20 Aug 2026) reviewed; prototype back office on Vercel; approval chain and loan products confirmed as configuration | Agree the open answers in the delivery file; remove the prototype's public demo panel | Delivery lead | MF-01, MF-02, MF-03, MF-04, MF-05, MF-06, MF-07, MF-10, MF-11, MF-12, MF-13, MF-14, MF-15, MF-18, MF-21, MD-01, MD-02, MD-05, MD-06, MD-09, MD-10, ID-01, ID-02, ID-07, KC-01, KC-04, KC-07, KC-08, RL-07, RO-02, RO-05, RO-16, RO-17, RO-19, AC-05, AC-09, BS-01 | [customers/roan-capital.md](customers/roan-capital.md) | FS-395, FS-397 to FS-403, FS-414 |
| CU-02 | Onit Bank | Bank | Kapu Collect and Kapu Pay Gateway, with W-Harambee as the partner | Past | 2026-06: production ended after Feb 2025 to Jun 2026; the bank chose more traditional banking services | None. The production record is named with the owner's permission (FS-391) | Commercial lead | CO-01, CO-02, CO-03, CO-05, CO-06, CO-11, GW-01, ID-05, RL-03, RL-19 | — | FS-384, FS-390, FS-391, FS-392; partners PT-39 |
