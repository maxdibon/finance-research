# Financial Services — review register

    for:     the consolidated financial-services documents
    started: 2026-10-01
    rule:    every point gets an id here before it is answered (working-with-eric.md §5)

Status is one of `OPEN`, `DECIDED`, `ANSWERED`, `DECLINED` (with reason).
A row does not change status silently.

| Id | Raised by | Point | Status | Notes |
|---|---|---|---|---|
| FS-001 | Eric | What "consolidated documents" means | DECIDED | One portfolio overview, built from modular sections so a sales pack for a given buyer can be assembled from the same parts |
| FS-002 | Eric | Use Odoo for helpdesk, CRM and accounting, even though it is not a financial platform | DECIDED | Edition: FS-026. Seam: FS-025 |
| FS-003 | Eric | Which other platforms should we consider? | OPEN | |
| FS-004 | Eric | Credit scoring | OPEN | |
| FS-005 | Eric | Automated integration with existing CRBs | OPEN | Regulatory access question comes before the technical one — FS-019 |
| FS-006 | Eric | Natural-language business intelligence driven by the user | OPEN | Scope answered by FS-033; design open, FS-040 |
| FS-007 | Eric | Likes the style of the Automated Channels Reconciliation PDF | OPEN | Seen so far: cover, table of contents, thumbnails of pp. 1–4 only. Viewer would not page further |
| FS-008 | Eric | Do we design in Canva? | OPEN | Both pitch PDFs are Canva exports (PDF Creator field); both Kapu documents are Google Docs exports |
| FS-009 | Eric | No PDFs until the designs are settled in Markdown or another cheap format ("design before build") | DECIDED | |
| FS-010 | Claude | Product names disagree between sources: meeting has Collect / Gateway / Circle, the MFI PRD has Collect / Sacco / MFI as sub-products | OPEN | Circle parked (FS-021), Sacco defined (FS-023). Map still to agree — FS-034 |
| FS-011 | Claude | Reconciliation is a standalone proposal, a Gateway feature (meeting notes) and a FlexMoney product. The overview needs one position | OPEN | |
| FS-012 | Eric | Latest FlexMoney dashboard from the team to be shared | OPEN | Waiting |
| FS-013 | Claude | Recon PDF: "Complaint" for "Compliant" ×6 on the functional-spec page; "Maintaince" ×1; timeline column headed "Man-Days" holds weeks | OPEN | Counts from `pdftotext` output |
| FS-014 | Claude | `odoo-reconciliation.md` is GateKeepr material; its register ids (RV-, B-) and estate names must not reach client documents | OPEN | The recon principles carry over; the references do not |
| FS-015 | Claude | Kapu Pay Technical Documentation is marked Confidential and prepared for a specific partner bank. A generic reference must be derived, not copied | OPEN | |
| FS-016 | Claude | **Compliance one-pager pricing: "Kshs 500,000 / USD 386.97" is off by 10×.** At the rate the same sheet uses for Option A (129.21), KES 500,000 is USD 3,869.70. Appears in Options B and C | OPEN | Rates computed from the sheet's own figures. Every other conversion on the sheet is at ≈129.2 |
| FS-017 | Claude | Odoo Community vs Enterprise decides which of helpdesk / accounting are available without Enterprise seats | ANSWERED | By FS-026 | Same unknown as GateKeepr B-4.4. To verify against Odoo's current edition comparison, not memory |
| FS-018 | Claude | Odoo's place in the client-facing stack: system of record for parties and obligations, not the ledger of funds (Fineract / bank core) and not the matching engine | DECIDED | By FS-025. Carries the GateKeepr Backend §13 seam over |
| FS-019 | Claude | Can the target MFIs (unregistered, non-deposit-taking) submit to or query a CRB at all? | OPEN | Regulatory, not technical. The MFI PRD already puts CRB out of Phase 1 scope |
| FS-020 | Claude | Automated scoring vs Data Protection Act 2019 on decisions made solely by automated processing | OPEN | Supports the PRD's "the system records and enforces, it does not decide" |
| FS-021 | Eric | Park Kapu Circle | DECIDED | Consistent with the 8 Jun meeting |
| FS-022 | Eric | Portfolio focus: Kapu Collect, Gateway, MFI/Sacco, Recon & Observability, omni-channel banking (mobile apps, internet banking, USSD), batch CRB management, individual CRB management from the ERP, bank mandates | DECIDED | Draft product map in FS-034 |
| FS-023 | Eric | "Sacco" means deposit-taking and credit-only SACCOs | DECIDED | DT-Saccos hold deposits, so unlike MFI there is a regulated deposit ledger and a SASRA reporting line — FS-035 |
| FS-024 | Eric | Park pricing; return to business models later | DECIDED | FS-016 stays open as a defect in a live document, not as pricing work |
| FS-025 | Eric | GateKeepr division of labour agreed; document it, including in the architecture designs | DECIDED | Odoo: parties, obligations, tickets. Bank core / Fineract: funds. Recon engine: matches and exceptions |
| FS-026 | Eric | Assume Odoo Enterprise (we are integration partners); minimise customer cost through portal users, APIs and similar | DECIDED | Supersedes FS-017's open question. Licence-terms check in FS-036 |
| FS-027 | Eric | SME recon is a standalone product with an Odoo / Zoho / … wrapper | DECIDED | One interface, one implementation per ERP — the GateKeepr Backend §20 pattern |
| FS-028 | Eric | SME recon connects to banks, mobile money and cards for real-time notifications, batch statements, balances; executes transactions once approved in the ERP; matches incoming funds to invoices, investments etc.; matches outgoing funds to ERP expenses | OPEN | Execution is the part with regulatory and security weight — FS-037 |
| FS-029 | Eric | Serve all tiers of banks, Saccos, MFIs, IMTs and PSPs; start with the smaller institutions to build product and brand | DECIDED | Smaller institutions mean less API maturity — statement files rather than webhooks, FS-038 |
| FS-030 | Eric | Bring unlicensed fintechs into a regulated framework through our financial-institution relationships | OPEN | Works for collections and deposits; target narrowed by FS-045 |
| FS-031 | Eric | Apply for our own PSP licence | DECIDED | Moves the custody line: Flow C-type splitting becomes possible once held |
| FS-032 | Eric | Host on-prem or on Azure Stack provided by Liquid | DECIDED | Conflicts with an externally hosted language model for FS-033 — FS-040 |
| FS-033 | Eric | Natural-language BI is both a product and an internal tool; Dibon is the first customer | DECIDED | Answers FS-006's open question. Mirrors the 8 Jun decision that Kapu consumes its own Gateway first |
| FS-034 | Claude | Eight offerings read as fewer products plus shared services: bank mandates may be the MFI PRD's approval mandate engine; batch and individual CRB are one CRB service with two consumers | OPEN | Proposed in reply; needs "bank mandates" defined |
| FS-035 | Claude | Sacco needs its own regulatory line: SASRA for DT-Saccos, the co-operatives regime for credit-only | OPEN | To verify; not from a source in this folder |
| FS-036 | Claude | Check the Odoo Enterprise Agreement for limits on serving internal work through portal users or API accounts | OPEN | The definition of a counted User is the clause; read it off the agreement, not memory |
| FS-037 | Claude | Executing payments from an ERP approval: attribute the approval at the act (STANDARDS.md §6.2 — "move money"), hold bank API credentials as Restricted, and confirm the NPS Act position on initiating payments without custody | OPEN | |
| FS-038 | Claude | Real-time notifications depend on each bank's API. Smaller banks may only offer statement files, so the design is multi-feed from day one | OPEN | |
| FS-039 | Claude | Digital lenders need their own CBK licence (Digital Credit Providers regulations); a bank partnership may not cover lending | DECLINED | Misdirected: credit-only institutions are not the onboarding target — FS-045 |
| FS-040 | Claude | Natural-language BI with Claude means data leaves the on-prem / Liquid boundary unless a self-hosted model is used | ANSWERED | Premise wrong: Claude was never chosen — FS-043. Claude assumed it in the FS-006 reply |
| FS-041 | Claude | Omni-channel banking, the CRB services and bank mandates have no source material in this folder | OPEN | Ask what exists |
| FS-042 | Eric | "Bank mandates" means both signing mandates and debit mandates | DECIDED | Signing → the shared mandate engine (MFI PRD FR-6, generalised). Debit → a new capability: recurring pulls under a recorded customer consent — FS-046 |
| FS-043 | Eric | Claude is not decided for natural-language BI. Candidates: self-hosted Metabase; a model hosted on Azure Stack (availability to confirm); a self-hosted model on Stack | OPEN | FS-047, FS-048 |
| FS-044 | Eric | Use Odoo Sign; financial transactions carry a lot of paperwork today | OPEN | FS-049 |
| FS-045 | Eric | Correction to FS-030: credit-only institutions manage their own CBK relationship. The target is unlicensed **deposit-taking and funds-holding** entities (e.g. prepaid-card operators) brought on board via a partner bank or CBK-regulated entity | DECIDED | This is Kapu Collect's model — funds held in accounts at the licensed institution |
| FS-046 | Claude | Debit mandates: rails to establish — bank direct debit through the clearing house, and M-Pesa standing orders. Whether either is exposed by API to a third party | OPEN | Not known; to verify, not from memory |
| FS-047 | Claude | Metabase gives self-hosted BI; its natural-language feature may sit in a paid tier and still needs a model somewhere | OPEN | To verify against Metabase's current editions |
| FS-048 | Claude | A self-hosted model on Azure Stack needs GPU capacity from Liquid. Ask Liquid what GPU SKUs, and whether any hosted model service runs on their Stack | OPEN | Question for Liquid |
| FS-049 | Claude | Odoo Sign is a simple electronic signature. Confirm which financial documents Kenyan law requires an advanced or certified signature for (e.g. charges, security instruments) | OPEN | Signers need no Odoo licence — fits FS-026 |
| FS-050 | Claude | Mark every capability in the documents by status — live, built, designed, planned — so nothing unbuilt is described in the present tense | DECIDED | Adopted in docs/modules/_template.md §3 with the template's approval |
| FS-051 | Claude | Collect one-pager: "multi-billion shilling liquidity pool" has no source in this folder | OPEN | Not repeated in docs/modules/collect.md until sourced |
| FS-052 | Claude | Which Collect capabilities are built, and which are live? No source says | OPEN | Every CO- row held at Designed or below until answered |
| FS-053 | Claude | The one-pager and the technical documentation both say real-time monitoring and automated fraud detection "operate continuously". Neither specifies them, and 8 Jun says fraud must be designed in. Automated compliance reporting is in the same position | OPEN | Present-tense claims about unbuilt capabilities, in documents that have gone to a bank |
| FS-054 | Claude | Technical documentation, withdrawal: the sequence diagram debits the core then disburses, but the data-flow text says both happen "simultaneously". The Transfer data-flow text is a copy of the Withdrawal text. The withdrawal request table and sample disagree on which side is source and which is destination | OPEN | Simultaneous debit and disbursement is the exact break recon exists to catch |
| FS-055 | Claude | Technical documentation overview lists "loan management" among Collect operations; there is no API for it | OPEN | Placed in mfi / sacco |
| FS-056 | Claude | **Whose mobile-money shortcodes and trust account does Collect use?** If Kapu's or Dibon's, funds rest under our control before they reach the bank — the custody line | OPEN | Decides Collect's whole regulatory position. Covers the Safaricom go-live and the PesaLink trust accounts (8 Jun) |
| FS-057 | Claude | One-pager says banks "extend" their CBK-regulated status and collectors "operate under the bank's authority". Legal accuracy, and what CBK approval the bank needs | OPEN | |
| FS-058 | Claude | Technical documentation's account-opening sample contains a tax PIN in a real-looking format | OPEN | Not reproduced here. Replace with an obviously fake value in the next revision |
| FS-059 | Claude | Technical documentation commits to 99.99% API uptime (≈52.6 min/yr) while depending on mobile-money rails and the bank's core | OPEN | Computed: 0.0001 × 525,600 min |
| FS-060 | Claude | Smaller defects in the technical documentation: the statement sample's event "BET"; a tax-details sample with both "PIN" and "pin"; employmentType example "KE"; error 5113 text missing a word; query-by-request-id shows only a not-found sample | OPEN | Batch for the next revision |
| FS-061 | Claude | Gateway has two custody patterns: pass-through when merchants use their own shortcodes, aggregation when we collect and settle to them. Aggregation needs the PSP licence or a licensed partner. Whether the payment-facilitator route through a gateway provider (8 Jun) covers it until then | OPEN | docs/architecture.md §3 |
| FS-062 | Claude | A deposit-taking Sacco in native mode means members' deposits held in Fineract. What SASRA requires of a DT-Sacco's core system and its vendor | OPEN | To verify; docs/architecture.md §4 |
| FS-063 | Claude | Retention periods per record type (rail events, matched records, KYC, signed documents) are not set. They come from the AML and CBK record-keeping rules, not from us | OPEN | To verify; docs/architecture.md §2 reason 3 |
| FS-064 | Eric | ASCII diagrams, not Mermaid | DECIDED | Applied to docs/modules/_template.md §5, collect.md §5, architecture.md §1. Width ≤ 78 |
| FS-065 | Eric | Assume at least two models: the customer has a core banking system, or it does not | DECIDED | architecture.md §4; template §4 now requires a per-mode table; collect.md §4 filled |
| FS-066 | Claude | A likely third model: a core that holds deposits but has no loan module, so loans go to Fineract. The funds ledger is then split across two systems | OPEN | Not assumed; architecture.md §4 |
| FS-067 | Eric | Propose a folder structure for the project | DECIDED | Applied 2026-10-01; see README.md |
| FS-068 | Claude | The folder is not under version control | DECIDED | git init with a baseline commit, 2026-10-01. working-with-eric.md §7: commit as you go |
| FS-069 | Claude | FlexMoney material is shaped to a named prospect's real conversations and data; the bank-specific technical documentation is Confidential. Both need a home kept out of anything shared | DECIDED | Proposed: clients/ and sources/confidential/, both git-ignored |
| FS-070 | Claude | sources/gatekeepr/ is git-ignored as well, which the approved proposal did not say. The files are snapshots of another repository and name a real estate and its correspondence | OPEN | A deviation, stated so it can be reversed: delete the line in .gitignore |
| FS-071 | Claude | Kapu Pay Technical Documentation.pdf could not be moved — locked, probably open in a viewer. It stays at the root, git-ignored by name, until moved to sources/confidential/ | OPEN | |
