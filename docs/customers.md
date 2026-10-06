---
id: customers
name: Customers — who we deliver to, and what each depends on
kind: register
version: 0.1.0
owner: Delivery lead
classification: Internal
review_ids: [FS-390, FS-395, FS-413, FS-414, FS-416, FS-419, FS-420, FS-443]
last_reviewed: 2026-10-06
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

**Stages:** Proposal, In delivery, Live, Past.

| Id | Customer | Type | Products | Stage | Last event | Next step | Owner | Depends on | Delivery file | Refs |
|---|---|---|---|---|---|---|---|---|---|---|
| CU-01 | Roan Capital | Microfinance lender | Kapu MFI on Kapu Core | In delivery | 2026-10-03: requirement document (v1.0, 20 Aug 2026) reviewed; prototype back office on Vercel; approval chain and loan products confirmed as configuration | Agree the open answers in the delivery file; remove the prototype's public demo panel | Delivery lead | MF-01, MF-02, MF-03, MF-04, MF-05, MF-06, MF-07, MF-09, MF-10, MF-11, MF-12, MF-13, MF-14, MF-15, MF-18, MF-21, MF-22, MF-23, MF-24, MF-25, MF-26, MF-28, MF-34, MF-35, MF-37, MF-38, MD-01, MD-02, MD-05, MD-06, MD-09, MD-10, MD-18, ID-01, ID-02, ID-07, ID-15, KC-01, KC-04, KC-07, KC-08, RL-07, RO-02, RO-05, RO-16, RO-17, RO-19, RO-24, AC-05, AC-09, BS-01, BS-02, FC-05, FC-12 | [customers/roan-capital.md](customers/roan-capital.md) | FS-395, FS-397 to FS-403, FS-414, FS-431, FS-435, FS-453 |
| CU-02 | Onit Bank | Bank | Kapu Collect and Kapu Pay Gateway, with W-Harambee as the partner | Past | 2026-06: production ended after Feb 2025 to Jun 2026; the bank chose more traditional banking services | None. The production record is named with the owner's permission (FS-391) | Commercial lead | CO-01, CO-02, CO-03, CO-05, CO-06, CO-11, GW-01, ID-05, RL-03, RL-19 | — | FS-384, FS-390, FS-391, FS-392; partners PT-39 |
| CU-03 | KCB | Bank | Since 2021: MobiReg (Meliora's CRM) and its maintenance; the Tiara SMS gateway (Meliora's), its upgrade and migration; USSD and digital lending (retailer finance, KOPA float, term loans, SAHL) on Dibon's menu platform; the Sopra loan engine; an account mandate API (tested, not live). Ongoing in 2026: Tiara enhancements, CVM integration, migration from Sopra to GDP APIs, MobiReg Project X and e-mobility | Live | 2026-10-05: project list read: 20 engagements since 2021, 5 of them active or ongoing (FS-443). KCB moved USSD to a platform of its own; the lending and SMS work continued | Confirm that the contract lets us name KCB (FS-420); owner compiling the details of the supply | Commercial lead | OC-03, OC-14, MD-11 | — | FS-416, FS-418, FS-419, FS-420; partners PT-19, PT-20, FS-443 |
| CU-04 | National Bank of Kenya (NBK) | Bank | Since 2021: an SMS gateway system, supplied, installed and upgraded (with international SMS termination), with support and maintenance; transactional and promotional SMS (SDP and SMPP); SMS and email templates; shortcodes and a USSD code in 2026 | Live | 2026-10-05: project list read: 6 engagements since 2021, 5 of them active or ongoing (FS-443) | Confirm that the contract lets us name NBK (FS-420) | Commercial lead | OC-03 | — | FS-417, FS-419, FS-420; partners PT-20, FS-443 |
