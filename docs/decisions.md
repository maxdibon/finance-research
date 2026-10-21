---
id: decisions
name: Decisions — what each cost, and what was argued against it
kind: register
status: living
released: 2026.10.16
owner: Solution architect
classification: Internal
last_reviewed: 2026-10-21
---

# Decisions — what each cost, and what was argued against it

REVIEW.md records **that** something was decided. This file records **what
the decision gave up**, so it can be argued with later (FS-076). An entry
exists for every decision that changed the design. A decision that only
confirmed something gets no entry.

**Two kinds of statement, marked separately.** *Argued* means it was said
in the conversation that produced the decision. *Inferred* means Claude
wrote it down afterwards and nobody has confirmed it yet. An inferred cost
that turns out to be wrong is corrected here, and the correction is kept.

**Every decision names what it requires to exist** (FS-515), from
FS-490 on: a `Requires:` line listing capability ids, files under docs/,
a file's § section, or "quoted text" the file must contain. The check
fails when any of them is missing, so a decision cannot stay a paragraph.
"nothing" stands alone for a decision that only confirmed something.

**Nothing is superseded quietly.** A reversed decision keeps its entry,
gains a line saying what replaced it and why, and the new decision gets
its own entry.

---

## FS-001 · One portfolio overview, built from modules

- **Chose:** a module library with a thin overview, and buyer packs as
  manifests (FS-001, approach C).
- **Argued against:** **A**, organise by architecture layer (reads well to
  engineers, but packs cut across chapters). **B**, organise by buyer (sells
  well, but each product is described several times and the copies drift).
- **Costs (inferred):** more files. Packs depend on the discipline of
  listing modules rather than copying from them, and only the check tool
  enforces that.

## FS-009 · No PDFs until the designs are agreed

- **Chose:** Markdown first; HTML and PDF are generated only after approval.
- **Argued against:** none recorded.
- **Costs (inferred):** nothing polished to show prospects in the meantime.
  The existing Canva PDFs stay in circulation, including the pricing error
  in FS-016.
- **Replaced (2026-10-02):** the owner asked for the first PDF pages
  (FS-264), then a full v1.0 (FS-263, FS-333). Designs still go to Markdown
  or a preview first; the PDF follows each agreed round. The Markdown copy
  became the single source of the PDF's words (FS-352).

## FS-021 · Park Kapu Circle

- **Chose:** no Circle work until a paying customer commits (from the
  8 Jun meeting, confirmed here).
- **Argued against (argued, 8 Jun):** the demo is strong enough to pitch,
  and a narrow entry point such as an Odoo-based reconciliation tool could
  open the market.
- **Costs (inferred):** circles stay unaddressed. The 8 Jun suggested entry
  point now overlaps with sme-recon.

## FS-024 · Park pricing

- **Chose:** no pricing work until business models are revisited.
- **Costs (inferred):** the one-pager's 10× USD error (FS-016) stays live
  until someone corrects it as a defect, separately from pricing work.

## FS-025 · Three authorities: the funds ledger, Odoo, the recon engine

- **Chose:** the GateKeepr division of labour, written into
  docs/architecture/README.md §2 and every module's §4.
- **Argued against:** reconciliation inside Odoo. The 8 Jun meeting
  floated an "Odoo-based reconciliation tool" as an entry product.
- **Costs (inferred):** a separate recon service to deploy and run at every
  customer. Integration work between three systems instead of one. A screen
  that wants a name from another authority pays for the join.

## FS-026 · Assume Odoo Enterprise

- **Chose:** Enterprise, because we are integration partners. Keep customer
  cost down with portal users, Odoo Sign and API accounts.
- **Argued against:** Community plus community-maintained modules, raised
  under FS-017.
- **Costs (inferred):** a per-user licence at every customer. The plan for
  keeping it down rests on Enterprise Agreement terms not yet read
  (FS-036).

## FS-027 · SME recon as a standalone product with ERP wrappers

- **Chose:** one recon interface with one implementation per ERP — Odoo
  first, then Zoho and others.
- **Argued against:** none recorded. The obvious alternative is an Odoo
  module only.
- **Costs (inferred):** one wrapper per ERP to build and maintain. In
  return, the market is not limited to Odoo users.

## FS-032 · Host on-prem or on Liquid's Azure Stack

- **Chose:** the institution's premises or Liquid's Azure Stack.
- **Costs (inferred):** rules out hosted model services unless Liquid
  offers one on its Stack (FS-043, FS-048). Every deployment is ours to
  operate.
- **Replaced in part (2026-10-02):** deployments may also be
  self-managed by the institution, on its premises or its own tenancy,
  with tiered support from Dibon (FS-359). Not every deployment is ours to
  operate.

## FS-033 · Natural-language BI is a product and an internal tool; Dibon first

- **Chose:** sell it and use it, with Dibon as the first customer.
- **Costs (inferred):** our own data has to be modelled in the semantic
  layer before any customer's is.

## FS-045 · Onboarding target: unlicensed deposit-taking and funds-holding entities

- **Chose:** bring these on through a partner bank or other CBK-regulated
  entity. Credit-only institutions manage their own CBK relationship.
- **Argued against:** Claude raised lenders under FS-039. Declined as
  misdirected.
- **Costs (inferred):** Collect's regulatory position becomes the whole
  case, so FS-056 and FS-057 decide whether the target is reachable at all.

## FS-050 · Every capability carries a status, with evidence

- **Chose:** Live / Built / Designed / Planned. The tense of the prose
  follows the status.
- **Costs (inferred):** the material reads less impressively than the
  current pitch documents. Collect today has no capability above Designed.
- **Update (2026-10-03):** Collect and the Gateway ran in production at
  Onit Bank, February 2025 to June 2026 (FS-390). Rows with that evidence
  are Built; the rest keep their status.

## FS-064 · ASCII diagrams

- **Chose:** ASCII in plain fences, at most 78 columns; 100 since FS-579,
  which GitHub and the generated reader show without scrolling.
- **Argued against:** Mermaid, which Claude proposed and used first.
- **Costs (inferred):** less visual polish, and alignment is maintained by
  hand. In return it reads in any editor and diffs line by line.

## FS-065 · At least two ledger models, always

- **Chose:** every module states how it behaves with a core banking system
  and without one.
- **Costs (inferred):** each module describes two behaviours. A likely third
  model (FS-066) is noted but not assumed.

## FS-079 · Anonymised meeting notes in git; the original kept out

- **Chose:** a role-based rewrite tracked in git. The original and the role
  mapping are git-ignored, and history was rewritten before the first push
  so the original never left the machine.
- **Costs (inferred):** the tracked notes are a derivative. A question that
  turns on who said something needs the untracked mapping.

## FS-081 · A check tool before the second module

- **Chose:** tools/check.js now, with every check broken on purpose in
  tools/check.test.js, and run before every commit.
- **Argued against:** building-a-master.md advises against tooling first.
  Two of its questions had already been asked twice, so it met that brief's
  own threshold.
- **Costs (inferred):** every commit waits on the checks. A check that is
  wrong blocks honest work until it is fixed.

## FS-124 · Mobile money by direct API integration

- **Chose:** integrate each mobile-money operator directly (partners.md
  SD-05), starting with M-Pesa and Airtel Money in Kenya.
- **Argued against:** reaching mobile money through the aggregator chosen
  in SD-01, which would mean one integration across many operators and
  countries.
- **Costs (inferred):** one integration and one agreement per operator,
  per country, as the footprint grows. In return: lower fees, our own
  callbacks and statements, the best data for recon, and no partner
  between us and the payer.

## FS-160 · SMS direct to the operators in Kenya; partners elsewhere

- **Chose:** SMPP connections to Safaricom, Airtel and Telkom under
  Dibon's PRSP licence in Kenya. Partners such as Meliora and Africa's
  Talking in other countries, and as the fallback route in Kenya.
- **Argued against:** staying on a partner gateway everywhere, which is
  how Dibon works today. Claude also raised (FS-154) that direct
  connection needs a licence. The owner answered that Dibon holds one in
  Kenya.
- **Costs (inferred):** three operator binds to run, monitor and keep
  registered, plus sender-ID registration per institution with each
  operator. In return: lower cost, first-hand delivery reports, and
  messages that stay in-country.

## FS-158 · Notifications becomes messaging

- **Chose:** one messaging service for transactional messages and
  campaigns, on every channel. Machine-to-machine callbacks stay with each
  product's API.
- **Costs (inferred):** campaigns bring marketing-consent rules into a
  service that otherwise sent only transactional messages. The two paths
  must stay separate inside it (FS-155).

## FS-178 · Become a core-system vendor for deposit-taking Saccos

- **Chose:** offer native mode to deposit-taking Saccos, with Fineract as
  their core and Dibon as the core vendor under SASRA's rules.
- **Argued against:** Claude flagged it as the heavier decision (FS-062):
  members' withdrawable savings on a core we host.
- **Costs (inferred, partly from the reported SASRA requirements):**
  twice-yearly contract audits and a full IT audit; SASRA's unfettered
  access to our systems; 24/7 monitoring with 12-hour incident reporting;
  a bank guarantee per Sacco of at least 10% of its mobile-money float;
  possibly a cap on how many Saccos we serve (FS-179 to FS-181). Prudential
  returns move into launch scope (FS-184). In return: Dibon becomes the
  core, not a layer around someone else's.

## FS-193, FS-194 · Access and identity split; Keycloak for access

- **Chose:** two modules — access (who may log in and act) on Keycloak,
  and identity (verifying who a person is). Keycloak subject to a spike on
  tenancy and step-up.
- **Argued against:** Ory, Zitadel (licence unchecked), Appwrite's
  built-in login, and cloud identity services (outside the boundary)
  (FS-196).
- **Costs (inferred):** a Java service to run highly available, since its
  outage stops every login; realm or organisation administration for
  every institution; federation work per bank. In return: one login for
  every system, step-up at the act, and FAPI profiles without building
  them.

## FS-223 · Unmodified AGPL services allowed

- **Chose:** AGPL-3.0 services may run if unmodified and separate from our
  code (docs/architecture/README.md §6.1).
- **Argued against:** the copyleft exclusion carried over from GateKeepr,
  which came from shipping a phone app; and Apache-2.0-only alternatives
  (Jaeger, Thanos or Cortex, Superset).
- **Costs (inferred):** any change to Grafana, Loki, Tempo or Metabase
  source means publishing it to their network users, so patches wait for
  upstream. In return: the Grafana stack the proposal and the Kapu
  documentation already assume.

## FS-230 · Superset for dashboards

- **Chose:** Apache Superset (Apache-2.0, Apache Software Foundation).
- **Argued against:** Metabase. Its open-source edition is AGPL-3.0, which
  FS-223 now allows. Its fuller features, including natural-language
  ones, sit in paid editions (FS-231 — the accurate reason; the owner's
  shorthand was "licensed").
- **Costs (inferred):** Superset is harder for business users to build
  their own questions in. Natural-language questions come from our own
  insights layer, not from the dashboard tool.

## FS-261 · Amber is Dibon's brand accent

- **Chose:** amber (#fbb236) for the brand frame, rules and accents, with
  aubergine, plum and cream. Green is kept only as the meaning "money
  moves" in diagrams, in a shade distinct from the customer green it
  replaced (FS-260).
- **Argued against:** the July deck's green, which turned out to be
  specific to a customer (FS-256 corrected FS-248).
- **Costs (inferred):** amber fails contrast as text on white (1.8:1), so
  text uses a darkened amber; amber itself is for shapes, rules and fills
  only (FS-259).

## FS-281 · Odoo as a business suite, not a shared service

- **Chose:** a product module of its own, "Business Suite, on Odoo",
  presented after the eight Dibon-built products.
- **Argued against:** placing it among the shared services. Those are
  Dibon's own building blocks that products call; Odoo is a third-party
  product Dibon implements.
- **Costs (inferred):** a services line with its own economics (Odoo
  licences, implementation effort, upgrade maintenance), and partner-tier
  obligations. In return: the portfolio covers the ERP, usually the fifth
  partner a customer would otherwise need.

## FS-288 · The portfolio PDF is digital only

- **Chose:** digital distribution only.
- **Costs (inferred):** no professional print run without rework (bleed,
  CMYK). In return: clickable contents, RGB colours as designed, and no
  print constraints on the layout.

## FS-263 · Present the products as a working v1

- **Chose:** the portfolio describes every product as working today.
- **Argued against (argued):** Claude raised that no source in this
  repository shows a capability built or live (FS-242), and that a bank's
  due diligence will test the claim. The owner decided.
- **Costs (inferred):** every claim the PDF makes is exposed to a
  prospect's checking. The integrations claimed on this basis are listed
  in design/portfolio-pdf/claims.json, so the gap stays visible (FS-353).
  In return: a portfolio that sells, not a roadmap.
- **Update (2026-10-03):** Collect and the Gateway ran in production at
  Onit Bank from February 2025 to June 2026 (FS-384, FS-390). M-Pesa now
  rests on that record, not on this decision; the other claims still do.
- **Update (2026-10-03):** the owner keeps Airtel Money and T-Kash in v1
  although only M-Pesa ran in production (FS-393, FS-407), and keeps the
  national register (IPRS) as v1 for account opening, with verification
  vendors shown as coming soon (FS-409). PesaLink is shown as coming soon
  everywhere (FS-408).
- **Update (2026-10-05):** business registration (BRS) joins v1 (FS-415).

## FS-311 · Kapu Core: the native mode becomes a product

- **Chose:** a hosted core on Apache Fineract, sold as a product of its
  own, with every Kapu product on top (FS-316).
- **Argued against:** keeping the native mode as plumbing beneath the
  other products, never sold on its own.
- **Costs (inferred):** Dibon becomes a core vendor, with SASRA's vendor
  rules for deposit-taking Saccos (FS-179) and what CBK expects of a bank's
  core vendor (FS-321). Fineract must be confirmed against each segment
  (FS-185). In return: a door into institutions that cannot integrate
  with what they run today.
- **Update (2026-10-03):** "every Kapu product on top" holds where the
  institution has no core. Where it has one, products run on that core, as
  Collect did at Onit Bank (FS-390, core.md §1).

## FS-323 · The web preview is generated from the PDF

- **Chose:** the build writes the web preview from the same pages as the
  PDF; the hand-built preview was retired.
- **Argued against:** a separate, responsive web page.
- **Costs (inferred):** on a phone the pages are small and need zooming.
  In return: the preview cannot drift from the PDF.

## FS-328 · In an escrow dispute, the arbiter decides and the bank still checks

- **Chose:** the named arbiter can direct a release alone, within the
  agreement; the account's mandate names the arbiter, so the bank checks
  the instruction like any other.
- **Argued against:** the arbiter only advising, with both parties still
  signing; or Dibon acting as arbiter.
- **Costs (inferred):** each partner bank must accept a mandate that names
  a third party, at onboarding. In return: a dispute can always end.

## FS-333 · Document control: an id, a version and a distribution log

- **Chose:** every page carries the document id and version
  (DC-FS-PF-001 · v1.0); the filename reads as words with the version and
  date; v0.x is internal and v1.0 the first external copy; each copy sent
  is logged on the CRM opportunity. Names never enter git.
- **Argued against (argued):** an ISO-style number as the filename. The
  owner wanted a name a person can read.
- **Costs (inferred):** every change after a copy goes out means a new
  version and a new log line. In return: we always know which version
  each recipient holds.

## FS-343 · Onboarding checklists as a template; progress lives in Odoo

- **Chose:** docs/onboarding.md holds what every customer and every
  product needs; each customer's progress is an Odoo project made from it.
- **Argued against:** tracking customers in this repository.
- **Costs (inferred):** two places to look, and the template must be
  copied into Odoo by hand until that is automated. In return: no
  customer names in git, and the checklist is checked against the
  products (FS-353).

## FS-354 · Write every document as if a customer will read it

- **Chose:** internal documents use the same customer-safe framing as the
  marketing: what a customer is working towards, not what is wrong with
  their systems.
- **Argued against (argued):** Claude suggested internal documents could
  describe customers' systems plainly. The owner pointed out that internal
  language ends up in customer meetings.
- **Costs (inferred):** some bluntness is lost where a gap needs naming.
  Gaps are still stated, as the work to be done rather than as a judgement.

## FS-352 · The marketing Markdown is the single source of the copy

- **Chose:** docs/marketing/portfolio.md holds every word of the
  portfolio, in a strict format; the PDF build reads it. Layout, diagrams
  and illustrative screens stay in design/.
- **Argued against (argued):** generating the Markdown from the PDF's own
  text, about half a day cheaper to build.
- **Costs (inferred):** a stricter Markdown format that the build parses,
  and a build that fails when a section is missing. In return: copy edited
  where reviewers can read it, reusable in buyer packs and proposals, and
  no drift between the PDF and the Markdown (FS-251).

## FS-359 · Four deployment options: where it runs, by who runs it

- **Chose:** your premises or an in-country cloud (Liquid's Azure Stack for
  now), each either run by the customer or by Dibon. Dibon-managed service
  comes in three levels (Hosted, Managed, Operated, FS-360); support tiers
  apply to every option.
- **Argued against (argued):** only two on-premises options, both
  self-managed. Claude added Dibon-managed on the customer's premises, for
  institutions that must keep data in their building but lack the staff.
- **Costs (inferred):** remote operations on customers' premises need
  secure access paths into each site and an operations team that can run
  many environments. Every level and tier is a promise that needs staff
  and response times behind it.

## FS-362 · Two editions of the portfolio, from one copy

- **Chose:** a short edition for a 20 to 25 minute meeting and the full
  edition for 45 to 60 minutes, both built from docs/marketing/portfolio.md.
  Neither is narrowed to a segment yet.
- **Argued against:** one long PDF presented page by page; segment packs
  first (FS-001 still allows them later).
- **Costs (inferred):** two documents to version and log. In return: a
  meeting gets a document sized for it, and the two cannot disagree.

## FS-374 · Show the ambition as now, next and later, without dates

- **Chose:** a "Where we are going" page in the full edition, by theme
  (markets, rails, services, assurance), each in Now, Next and Later; the
  messaging card names the direction too.
- **Argued against:** a dated roadmap; leaving the ambition to the
  scattered "coming soon" labels.
- **Costs (inferred):** every "Next" is read as intent, so moving an item
  back is visible. In return: the gaps a prospect sees read as a plan.

## FS-379 · Stay a platform for licensed institutions; do not become a bank

- **Chose:** park becoming a neobank. Explore a neobank-in-a-box offer
  instead: Saccos, microfinance banks and smaller banks launch digital
  banking under their own brand on Dibon's platform.
- **Argued against (argued):** a licence of Dibon's own. A new commercial
  bank needs KSh 10 billion of core capital; a microfinance bank KSh 60
  million today, with KSh 250 million proposed. Holding deposits would
  make Dibon a competitor to the institutions it sells to, and end "we do
  not hold your money".
- **Costs (inferred):** Dibon forgoes the deposit margin and owning the
  end customer. If the idea returns, the staged route is a partner-bank
  neobank first, then a microfinance bank in a separate company.

## FS-403 · Secrets in OpenBao, not HashiCorp Vault

- **Chose:** OpenBao for credentials, signing keys and service secrets in
  every deployment, and MPL-2.0 allowed for components used unmodified
  (architecture §6.1).
- **Argued against:** HashiCorp Vault under its Business Source License,
  with a recorded acceptance. Vault ran in production at Onit Bank and Roan
  Capital's requirement document names it. The licence most likely
  allows our use, since it bars products that compete with HashiCorp's
  rather than embedding, but that is a reading, its owner can change the
  terms for future releases, and every bank's due diligence would ask.
- **Costs (inferred):** moving the Onit-era integration from Vault to
  OpenBao. The API is the same, so the work is configuration and testing,
  not a rewrite; but OpenBao's feature set and release pace are a smaller
  project's, and any enterprise-only Vault feature we later want is not
  there. Roan Capital's document needs its Vault reference changed.

## FS-388 · Pull Transactions and Hakikisha in the next release

- **Chose:** M-Pesa Pull Transactions (rails RL-20) and Hakikisha name
  confirmation (RL-21) in phase 1, used by Collect, the Gateway, MFI and
  reconciliation.
- **Argued against:** leaving both for later, and relying on callbacks
  alone to learn about payments.
- **Costs (inferred):** phase 1 grows by two Daraja integrations and the
  flows that use them, before any partner bank has signed. In return: a
  payment whose callback never arrives is still found, and a payout goes
  only to the name the payer expects.

## FS-402 · Quorum approval steps at launch

- **Chose:** quorum steps (N of M, mandates MD-09) in phase 1, because Roan
  Capital's credit committee approves 3 of 3 (CU-01).
- **Argued against:** launching with sequential steps only, as the MFI PRD
  planned; three sequential steps give the same outcome for a unanimous
  committee, slower.
- **Costs (inferred):** the mandate engine's first release carries a
  second step type, with its tests, before the simple chain has run in
  production.

## FS-414 · Name customers in internal documents

- **Chose:** internal documents name Roan Capital, as they name Onit Bank.
  The names check blocks the name only in material that leaves Dibon: the
  portfolio, its design files and outreach drafts.
- **Argued against:** keeping the name out of git entirely (FS-397), with
  the delivery detail only in clients/, where no check reaches it and the
  register cannot point to it.
- **Costs (inferred):** the repository now holds a customer's name, so its
  access must stay limited to Dibon, and anyone given access later sees
  it. A document copied from docs/ into a meeting must be read for names
  first, because the check only guards the outward folders.

## FS-431 · One financial-crime and compliance service

- **Chose:** a shared service for fraud scoring, AML/CFT screening, cases
  and regulatory reporting, with the rule "we detect and prepare; the
  institution decides and files". Sanctions screening (FC-05) and record
  retention (FC-12) in phase 1; the rest in phase 2. Rows moved in from
  Gateway (GW-09), identity (ID-08) and reconciliation (RO-12, RO-14,
  RO-15); reconciliation keeps duplicate and anomaly detection (RO-11) as
  a feed.
- **Argued against:** leaving the controls in each product, where eight
  rows in six modules would each be built, and audited, separately; and
  filing on the institution's behalf, which would make Dibon answer for
  reports the law puts on the institution and its reporting officer.
- **Costs (inferred):** a new service with its own data (Restricted) before
  any of it has a specification, and sanctions screening in the first
  release for every lender. In return: one place a regulator, an auditor
  or a bank's due diligence can examine, and a product Kenya's grey-list
  position makes urgent.

## FS-435 · Partner for legal advice; sell compliance operations; build the lender rules

- **Chose:** a law-firm partner, with referrals both ways and no fee
  sharing, for legal advice to customers and to Dibon; a joint
  "licence-ready lender" offer ahead of the CBK deadline of about 29 March
  2027 (the firm applies, our platform meets the rules); compliance
  operations as a service (FC-15) inside the limits the law sets; the CBK
  lender regulations as Kapu MFI capabilities (MF-22 to MF-29), with the
  repayment order fixed by law for those lenders.
- **Argued against:** advising customers through Dibon's own lawyers, which
  the Advocates Act appears to rule out (to confirm with counsel) and which
  would compromise a bank's review of its contract with us; running an
  institution's reporting officer role, goAML registration or thresholds,
  which the law keeps with the institution.
- **Costs (inferred):** a partner to choose and manage, and a conflict to
  watch when the same firm advises Dibon and a customer; AML-qualified
  analysts to hire before FC-15 can be sold; and if we run an institution's
  compliance operations, we cannot also audit them.
- **Update (2026-10-05):** the Advocates Act bars an advocate from sharing
  fees with a non-advocate (s.37) and makes a person paid for bringing an
  advocate work a tout (s.38): referrals are unpaid both ways. Shortlist in
  docs/partners.md (SD-12).

## FS-440 · Recognition through licence and approvals; assurance for non-customers

- **Chose:** a legal opinion on Dibon's payment service provider status
  before deciding whether to apply for authorisation (LC-06); a standard
  outsourcing approval pack for customers to file (docs/approval-pack.md);
  penetration tests, IT and cyber assessments and independent AML testing
  for institutions we do not supply, with a conflict register the check
  enforces (docs/assurance.md); ODPC compliance-audit accreditation once
  we have the people and insurance (LC-14); AFIK membership (PT-51).
- **Argued against:** seeking a CBK "fintech registration", which does not
  exist; statutory financial audits, ISO certification and critical
  infrastructure audits, which need licences or accreditation we do not
  hold; and assurance work for our own customers, which would spend the
  independence the service sells.
- **Costs (inferred):** certified testers and AML-qualified staff before
  the service can be sold; insurance; and a market for assurance that
  shrinks as we win customers, because every customer leaves it.

## FS-453 · Traceability, SIM controls, email approvals and the field channel in v1

- **Chose:** in phase 1: signed, hash-chained, verifiable transaction events
  (recon RO-23 to RO-25); accounts bound to ID, phone number and IMSI, with
  holds on an IMSI change and scheduled name checks (identity ID-12 to
  ID-14, financial-crime FC-02); approval from email with step-up at the
  act (mandates MD-18); the field-officer app and collections on all three
  wallets (omni-channel OC-17 to OC-19, Kapu Core KC-14).
- **Argued against:** leaving traceability to logs and operational traces,
  which cannot be verified by a third party; treating the phone number as
  the identity; approving money by email reply; a field app later.
- **Costs (inferred):** phase 1 gains 7 new capabilities and 5 moved up from
  phase 2, and with them a signing service, a transparency log and an
  offline mobile app to build and operate before the first release.

## FS-464 · A security baseline in phase 1; licence rules for LGPL, the operating system and test tools

- **Chose:** a Platform Security module (SE-01 to SE-19, all phase 1) on
  open source that runs alike on Azure Stack, on premises or
  self-managed, using only compute and Blob storage from the Stack;
  managed detection and response bought from Liquid (Sophos) rather than
  run on Wazuh; PostgreSQL for every database, Fineract's included; LGPL
  components allowed unmodified as separate programs (Odoo Community,
  Opengrep), GPL allowed as part of the operating system and for test
  tools never shipped (MobSF); a competitors register; Liquid and
  Microsoft approached as partners.
- **Argued against:** Azure Stack's own Kubernetes, database and monitoring
  services, which are discontinued, deprecated or send data outside Kenya;
  Wazuh, which needs a GPL decision and a team to watch it around the
  clock; MySQL, the default in Roan Capital's document.
- **Costs (inferred):** nineteen capabilities in phase 1, and the people to
  run them; a recurring managed-detection fee and telemetry leaving our
  boundary to the provider, to be confirmed in Kenya; proposed recovery
  objectives and an incident commitment that become contract terms once
  confirmed.

## FS-471 · Start the response commitments at 4 hours

- **Chose:** first notice of a significant incident within 4 hours, and
  recovery after a compromise starting at 4 hours (safe mode, or a
  contained institution restored), with 1 hour as the target once managed
  detection is contracted and the rota has at least five people.
- **Argued against:** the 1-hour commitments from day one, which three
  people on call cannot keep without burning out.
- **Costs (inferred):** a payment provider may need faster notice if CBK's
  guideline sets 2 hours; until the 1-hour target is reached, such a
  customer waits or we staff up first. Recovery objectives for failures
  are unchanged and rely on automatic failover.

## FS-484 · Compliance built in, not bolted on

- **Chose:** a fourth idea that runs through every product: the rules
  customers answer to are capabilities, with ids, statuses, evidence and
  tests, from the law register to the module rows they drive.
- **Argued against:** compliance as a reporting layer added after the
  product, which is how most vendors sell it and how gaps hide.
- **Costs (inferred):** every new law in scope becomes product work, and
  phase 1 carries rules (the lender regulations, sanctions screening) that
  a lighter product would leave to the customer.

## FS-490 · v1 is capped at today's scope

- **Chose:** the current phase 1 (221 capabilities) as the target, and a
  cap the check enforces: nothing moves in unless something of similar
  size moves out or the team grows.
- **Requires:** docs/delivery-plan.md "v1 cap:".
- **Argued against:** redefining v1 as the first two releases only, which
  would have narrowed the promise; and letting phase 1 grow as each good
  idea arrived, which had added a dozen capabilities in two days.
- **Costs (inferred):** v1 stays large for a team of four builders; the
  delivery plan's releases, not a smaller v1, carry the sequencing, and
  dates follow the team.

## FS-491 · Keep the planned stack; an isolated instance per institution

- **Chose:** the full platform stack as designed, and one isolated instance
  per institution: its own namespace, databases, keys and backups.
- **Requires:** docs/architecture/README.md §9 "an isolated instance per institution"; AC-08.
- **Argued against:** a staged, lighter stack for the first release, and a
  shared control plane with per-institution data, both of which cost less
  to run.
- **Costs (inferred):** operating work grows with every institution;
  automation of instances (GitOps, fleet upgrades) becomes a phase-1 need,
  and the DevSecOps rota carries more per customer than a shared model
  would.

## FS-498 · Keycloak is the one authority for roles

- **Chose:** Keycloak groups per institution as the only place that says
  who may approve or act (access AC-09). The mandate engine reads them when
  a step opens. Odoo keeps employment and party records; Fineract and the
  products keep no approval roles of their own. A change to who may
  approve money is itself approved by a second person (access §8).
- **Requires:** AC-09; docs/modules/mandates.md "Access (Keycloak), AC-09".
- **Argued against:** Odoo as the authority (FS-142), which ties every
  approval to the business suite being up and licensed per user; and each
  product's own user list, which lets roles drift apart across products.
- **Costs (inferred):** joiners, movers and leavers in Odoo HR must reach
  Keycloak, by a sync or by hand, and a missed leaver keeps a role until
  someone notices; Keycloak becomes a dependency of every approval, so its
  availability is tier 1.

## FS-500 · A document vault per institution, and the v1 cap raised to 222

- **Chose:** one document vault per institution for KYC and KYB evidence
  and collateral documents (identity ID-15), in phase 1 because R1 needs
  it; and the v1 cap raised by one to count it.
- **Requires:** ID-15; SE-10; docs/architecture/README.md §6 "document vault".
- **Argued against:** storing documents as Fineract or Odoo attachments,
  which scatters Restricted files across systems with different access
  rules; and folding the vault into ID-02's wording, which hides real
  work, the drift the cap exists to stop.
- **Costs (inferred):** one more service to run and back up per
  institution; Ceph on-premises is heavy to operate for a small site; a
  virus scanner is not chosen, since ClamAV is GPL and needs a licence
  decision.

## FS-503 · Block easily, recover only after verification; the v1 cap raised to 226

- **Chose:** four phase-1 rows: block from any channel without the desk
  (access AC-14); recovery only after identity verification, never on a
  one-time code alone, with cooling-off and alerts (AC-15); two
  authenticators for staff and approvers (AC-16); hardware keys and
  sealed break-glass accounts for Dibon's engineers (platform-security
  SE-26). AC-16 and SE-26 join R1. The cap counts them openly.
- **Requires:** AC-14, AC-15, AC-16, SE-26; docs/operating-model.md "Runbooks to write first".
- **Argued against:** folding them into AC-03's wording, which would hide
  work the channels cannot go live without; and recovery by one-time code
  alone, which hands an account to whoever holds a swapped SIM.
- **Costs (inferred):** recovery is slower for honest customers, and some
  will need a branch; branches and field officers carry re-verification
  work; R1 grows by two capabilities for a team of four.

## FS-516 · Loan agreements and restructuring in R1; loan officers in v1; the cap raised to 228

- **Chose:** loan agreements (mfi MF-34, with Odoo Sign, business-suite
  BS-02) and restructuring (MF-09) in R1, added to Roan Capital's map by
  Dibon (RC-38, RC-39) because a lender cannot disburse without an
  agreement; loan officers (MF-35) in phase 1 (FS-517). Two new phase-1
  rows, counted against the cap.
- **Requires:** MF-09; MF-34; MF-35; BS-02; docs/customers/roan-capital.md "RC-38"; docs/delivery-plan.md "MF-34 (loan agreements)".
- **Argued against:** waiting for Roan Capital to ask, which would leave
  R1 unable to disburse lawfully; and leaving officers to Fineract's
  defaults, which have no reassignment approval or performance view.
- **Costs (inferred):** R1 grows again for a team of four; Odoo Sign
  joins R1, so Roan Capital needs Odoo Enterprise for signing, and the
  electronic-signature question goes to counsel before go-live.

## FS-525 · ClamAV scans uploads; commercial engines at the customer's cost

- **Chose:** ClamAV, run unmodified as a separate service and reached
  over its socket, as the scanner in our offering; Sophos or another
  commercial engine where a customer pays for it, possibly bought through
  Liquid. A new licence row allows this one GPL-2.0 service by name.
- **Requires:** ID-15; docs/architecture/README.md §6.1 "which scans uploads to the document vault (FS-525)"; docs/outreach/liquid-partner-request.md "Sophos scanning".
- **Argued against:** no scanning, which leaves an upload path open to
  any customer's phone; and a commercial engine for everyone, which puts a
  licence cost on institutions that do not want it.
- **Costs (inferred):** ClamAV catches less than commercial engines; its
  signatures must be kept current in every instance; the GPL boundary
  holds only while nobody modifies or links it.

## FS-527 · Every document carrying personal data lives in the vault

- **Chose:** the vault for every document that carries personal data,
  contracts included, and Odoo for documents with none beyond business
  contacts; the contract record always in Odoo, with a link; when in
  doubt, the vault. The criteria are written in architecture §6.
- **Requires:** docs/architecture/README.md §6 "Where a document lives"; BS-02.
- **Argued against:** loan and guarantee agreements alone in the vault,
  which left every other personal contract to judgement; and everything
  in Odoo, which spreads personal data to every Odoo user with access.
- **Costs (inferred):** staff employment contracts leave Odoo HR for the
  vault, so HR works through links; two systems take part in every
  contract, and the link between them must not break.

## FS-531 · Guarantors' rights and borrowers' access in R1; the cap raised to 230

- **Chose:** guarantors (mfi MF-37) and borrower access (MF-38) in phase
  1 and in R1, because the CBK lender regulations require them (regs 39
  and 42) and Roan Capital takes directors' guarantees; document intake by
  API (identity ID-16) in phase 2.
- **Requires:** MF-37; MF-38; ID-16; docs/customers/roan-capital.md "RC-41"; docs/specs/lender-rules.md "MF-37".
- **Argued against:** leaving the guarantor rules to Roan Capital's
  procedures, which would put a lender in breach the first time a
  guarantor is pursued without notice.
- **Costs (inferred):** two more capabilities in R1 for a team of four;
  periodic statements to guarantors cost messages every month for every
  guaranteed loan.

## FS-532 · Documents travel only on our network; notification channels carry links

- **Chose:** documents and sensitive data travel only by link to our own
  pages, the portal, an API or SFTP; WhatsApp, SMS, email and push carry
  notifications and links only; once signed in, a customer may download
  and share their own documents as they choose. Sharing out is a phase-1
  capability (identity ID-17), in R1. WhatsApp banking and the chatbot are
  narrowed to notifications, links and how-to answers.
- **Requires:** ID-17; OC-16; OC-20; docs/architecture/README.md §7 "travel only on our network"; docs/specs/approval-engine.md "decided: never"; docs/operating-model.md "never for documents".
- **Argued against:** balances and statements in WhatsApp, which the v1
  design had, and which sends Confidential data through Meta outside
  Kenya; emailing signed agreements and statements, which leaves copies in
  mailboxes we cannot reach.
- **Costs (inferred):** customers who expected banking in WhatsApp must
  open a link and sign in; the portfolio's WhatsApp promise is narrower;
  Odoo Sign may not allow link-only completion emails, which would move
  signing to our own page. USSD keeps balances behind the PIN: it is a
  session, not a stored message.

## FS-533 · People choose their channels, with three overrides

- **Chose:** one or more channels per kind of message, chosen by the
  person; security alerts to every channel, regulatory notices always on
  a channel with delivery reports, marketing only by opt-in. Email joins
  the channels (messaging MS-19), in R1, because approvals and upload links
  already need it.
- **Requires:** MS-12; MS-19; docs/delivery-plan.md "MS-19 (email".
- **Argued against:** one preferred channel per person, which cannot carry
  a security alert to the real owner of a stolen phone; and full freedom,
  which lets a regulatory notice go to a channel that cannot prove
  delivery.
- **Costs (inferred):** every message is sent once per chosen channel, at
  the institution's cost; email delivery depends on each institution's
  domain being set up correctly.

## FS-539 · Saccos get their own complaints clock; the cap raised to 233

- **Chose:** a Sacco complaints clock (sacco SC-20, phase 1): acknowledge
  in three working days, resolve in 21 calendar days, as SASRA's model
  policy sets, beside the lenders' 30-day clock (mfi MF-28).
- **Requires:** SC-20; MF-28; docs/regulation.md "SASRA Model Complaints Handling Policy".
- **Argued against:** one clock for every institution, which would let a
  Sacco run past SASRA's 21 days while the software showed green.
- **Costs (inferred):** two clocks to configure and test; one more
  phase-1 row in a release (R4) that is already large.

## FS-551 · KYC tiers in R1; USSD self-sign-up in phase 2; the cap raised to 234

- **Chose:** KYC tiers (identity ID-19) in phase 1 and in R1: the tier
  comes from the evidence held, each institution sets limits and rules
  per tier, a tier falls on an event and rises only with evidence. Remote
  self-sign-up by USSD, the lightest tier's natural channel, waits for
  phase 2 with loan applications on USSD (omni-channel OC-08).
- **Requires:** ID-19; ID-01; docs/customers/roan-capital.md "RC-43"; docs/delivery-plan.md "ID-19 (KYC tiers)".
- **Argued against:** one level of KYC for every customer, which either
  turns away people with fewer documents or lends to them as if fully
  verified; and the manual route without limits, which would make it the
  way around every failed check.
- **Costs (inferred):** one more capability in R1 for a team of four;
  every limit check reads the tier; each institution must write the risk
  assessment behind its lightest tier before using it.

## FS-552 · Collect takes paybill and till deposits; Collect for deposits, the Gateway for merchants; the cap raised to 235

- **Chose:** deposits paid to the institution's own paybill or tills
  (collect CO-21, phase 1, R2), with a partner optional; money that
  becomes a deposit goes through Collect, money that pays a merchant
  through the Gateway (FS-554); Collect's channels come from
  omni-channel over the same API (FS-553).
- **Requires:** CO-21; SC-04; docs/modules/collect.md "Collect or the Gateway"; docs/modules/gateway.md "Collect or the Gateway"; docs/delivery-plan.md "(CO-21)".
- **Argued against:** deposits into a partner's own paybill, till or
  Pochi la Biashara, which leaves customers' money with an unlicensed
  party until it is swept (FS-045, FS-056); and deposits through the
  Gateway, which has no account to post to.
- **Costs (inferred):** one more phase-1 capability in R2; till payments
  carry no account number, so some land in a holding queue for a person
  to match; validation on tills is unconfirmed with Safaricom.

## FS-560 · Tests trace to acceptance items; an identity simulator in R1; the cap raised to 236

- **Chose:** acceptance items written here (the specs' tables, every
  journey step and §3 row), tests in the code repository tagged with the
  item and the capability, and a coverage matrix generated from the tags
  and CI; Built only when every item for a capability passes. User
  acceptance runs the journeys, tracked in Odoo Project. An identity
  simulator (ID-20) in R1, so the manual route's failures can be tested.
  Each journey opens with a flow diagram the check keeps in step with its
  table (FS-558).
- **Requires:** ID-20; docs/testing.md "coverage matrix"; docs/delivery-plan.md "ID-20 (the identity simulator)"; docs/journeys/_template.md "A flow diagram first".
- **Argued against:** a test management tool, which would be a third
  place for what the specs and the code already hold; and tests written
  here, which would drift from the code that runs them.
- **Costs (inferred):** tagging discipline on every test; a script to
  write in the code repository; one more R1 capability for a team of
  four with no test engineer.

## FS-574 · Transaction rules and a business calendar; the cap raised to 238

- **Chose:** one place where every money movement meets the
  institution's rules before a rail (financial-crime FC-16): criteria of
  type, amount per transaction and per cycle, source and destination
  with allow- and deny-lists, currency, time, day and type of day,
  channel and KYC tier; outcomes of allow, deny, hold until, approval or
  step-up; the strictest wins. One business calendar per institution
  (core KC-15) under every rule that counts days, and under Fineract's
  own holidays. In R1 only time windows, types of day and tier amounts,
  first for Roan Capital's lockout; the rest is configuration later.
- **Requires:** FC-16; KC-15; docs/customers/roan-capital.md "RC-21"; docs/regulation.md "LR-36".
- **Argued against:** a lockout written into the disbursement service,
  which every institution's next rule would need written again; and
  allow-lists that override everything, which would let a list entry
  pass a sanctions match.
- **Costs (inferred):** two more R1 capabilities for a team of four; a
  calendar someone must keep, since the moon-dated days and the
  gazetted ones are announced, not known in advance; messaging's quiet
  hours, approval clocks and the complaints clocks will read the
  calendar once wired, and their dependencies are added then.

## FS-582 · Decisioning: one engine for appraisal, scores and risk classes; the cap raised to 242

- **Chose:** a shared decisioning service, used by every product that
  lends: statement metrics, a behaviour score and internal risk classes
  in R1, as rules a person can read, giving evidence to people who
  decide; one contract and versioned models, so learned models, shadow
  mode and automated decisions arrive in phase 2 without changing a
  product. MF-33 is retired into it. Overrides FS-522's choice of v2
  for the behaviour score and downgrades only, because Roan Capital's
  requirement document, Dibon's own, commits them to the MVP.
- **Requires:** DE-01; DE-02; DE-03; DE-04; docs/customers/roan-capital.md "RC-15"; docs/delivery-plan.md "DE-01 (the contract and decision records)".
- **Argued against:** scoring inside each product, which would take the
  step to AI once per product; and putting it in recon, which matches
  money and shares only the statement parsers.
- **Costs (inferred):** four more R1 capabilities for a team of four, the
  statement parser the heaviest because every bank's format differs;
  nothing can be finished until Roan Capital gives its formulas,
  weights and thresholds (open answer 13).

## FS-585 · Institutions that reach the rails through a larger bank; the cap raised to 244

- **Chose:** model the larger bank as a route (rails RL-27): the
  settlement account as an account of its own, that bank's cut-offs as
  transaction rules on the calendar, a prefunding check before release,
  returns that reverse the customer's posting, and wires carrying the
  details reg 32 requires; treasury and float (RO-09) into phase 1 for
  R2; many-to-many matching and tolerances in RO-02 (FS-509); fee
  verification (RO-26, FS-510) and SWIFT (RL-28) in phase 2. Every
  component replaceable behind a stable contract, written into
  architecture §6 (FS-584).
- **Requires:** RL-27; RO-09; RO-02; docs/architecture/README.md §6 "replaceable behind a stable contract"; docs/journeys/README.md "JN-11".
- **Argued against:** treating the larger bank as just another statement
  feed, which misses the cut-offs, the prefunding and the returns that
  run a microfinance bank's day.
- **Costs (inferred):** two more phase-1 capabilities in R2; each larger
  bank's cut-offs, formats and fees to learn and keep current; whether a
  given microfinance bank is a direct RTGS participant is to confirm.

## FS-586 · One instruction from approval to settlement, reversals included; the cap raised to 245

- **Chose:** approvals decide, the product orchestrates, rails execute,
  reconciliation confirms; the Gateway is never on an institution's
  payout path. Every payout is one instruction (rails RL-01, into R1)
  with a lifecycle that includes cancellation, recall, returns and
  reversals, a reversal being a new instruction linked to the original
  and under maker-checker (FS-587). Banks are reached by API,
  host-to-host files, or an internet-banking file the institution's
  signatories release (RL-07). A bank account holder's name is
  confirmed before a payout (RL-29). The institution asks its own banks
  for access (docs/outreach/bank-access-request.md).
- **Requires:** RL-01; RL-07; RL-29; docs/outreach/bank-access-request.md "Cancelling, recalling and reversing"; docs/specs/approval-engine.md "payment.reversal".
- **Argued against:** routing payouts through the Gateway, which takes
  merchants' collections and has no account to post to; and editing a
  sent instruction to reverse it, which loses what was sent.
- **Costs (inferred):** one more R1 capability, and RL-01 brought in;
  two approvals per bank payout in R1, ours and the signatories' at
  the bank, until a bank allows payments within agreed limits to go
  straight through; each bank's channel, formats and time limits to
  learn.

## FS-588 · What is approved is what is sent; no Dibon role moves an institution's money

- **Chose:** an approval records a hash of the payment's content and
  rails send only what matches (RL-01, the approval-engine spec); a
  recently added or changed destination adds an approver and a wait,
  and whoever changed it may not approve (FC-16); instructions and files
  to banks signed with keys that never leave OpenBao, over mutual TLS
  (RL-07, RL-12); the internet-banking file controlled by its totals and
  hash and checked line by line against the statement; reversals only
  to the source; no Dibon role, break-glass included, in any payment's
  chain (architecture §3, AC-09); the instruction path threat-modelled
  first and always in the penetration test (SE-16, SE-17).
- **Requires:** RL-01; RL-07; RL-12; FC-16; AC-09; SE-16; SE-17; docs/architecture/README.md §3 "never move an institution's money"; docs/specs/approval-engine.md "a hash".
- **Argued against:** trusting the approval of a request without its
  content, which lets a payee be changed after approval; and leaving
  break-glass able to release payments, which makes Dibon's staff a
  path to the institution's money.
- **Costs (inferred):** hashing and checking on every payout; signing
  per bank, whose requirements are still to learn (the bank access
  request, item 8); a wait on payouts to new destinations that
  customers will feel.

## FS-594 · Bank payouts: one approval within agreed limits, two above them

- **Chose:** within limits a bank agrees by mandate letter, a signed
  instruction from the institution's chain goes straight through; above
  them, or by the internet-banking stopgap, the institution's signatories
  also release it at the bank, checking the file's totals and hash
  (rails RL-07).
- **Requires:** RL-07; docs/outreach/bank-access-request.md "Our signing mandate".
- **Argued against:** two approvals on every payout, which slows them,
  invites rubber-stamping by signatories who see only totals, and leaves
  two records that can disagree; and one approval on every payout, which
  takes the bank's own controls out of the large ones.
- **Costs (inferred):** a mandate letter and limits to agree with each
  bank; until a bank agrees, every payout through it is approved twice.

## FS-618 · Roan Capital's map: twenty rows closed, three capabilities added; the cap raised to 248

- **Chose:** twenty Partial rows closed, because their capabilities do
  what the requirement asks and what remains is Roan Capital's input or
  screen design. Three gaps closed by new R1 capabilities: the collection
  ladder (mfi MF-39), the public request page and calculator
  (business-suite BS-20), one audit trail across modules
  (recon-observability RO-27). The authenticator app is named in R1
  (access AC-16).
- **Requires:** MF-39; BS-20; RO-27; AC-16; docs/customers/roan-capital.md "RC-27".
- **Argued against:** leaving the three Partial until Roan Capital
  confirms them, when its requirement document already asks for each.
- **Costs (inferred):** three more R1 capabilities for a team of four;
  the ladder's stages must be fitted to the conduct rules before Roan
  Capital's day 30 and day 47 can be configured (open answer 3).

## FS-626 · Kapu Core: Fineract 1.15, progressive loans, one writer

- **Chose:** Apache Fineract 1.15.x, pinned and never forked; every loan
  product on the progressive schedule with advanced payment allocation,
  so the regulated repayment order is a setting and restructuring has
  Fineract's re-aging, reschedule and top-up; Fineract's own
  maker-checker off, and its approve, disburse and restructure
  permissions held only by Kapu MFI's service account, acting on the
  approval engine's yes. The Mifos web app is left open.
- **Requires:** docs/specs/kapu-core-fineract.md §4; docs/specs/kapu-core-fineract.md §6; KC-08; MF-09.
- **Argued against:** the older cumulative schedule, which keeps the
  classic reschedule but loses re-aging, a rate change on a live loan and
  the configurable order, so reg 56 would need a custom extension; and
  running Fineract's maker-checker beside the engine, two approval
  records that can disagree.
- **Costs (inferred):** flat interest on progressive loans is recent
  (1.13), so thirteen checks run on an instance before the build relies
  on it; each Fineract upgrade waits for them.

## FS-627 · Specs: two kinds, one template, checked; navigation both ways

- **Chose:** a spec template with two kinds, build (a service we write)
  and component (a product we configure), sharing §1 with a "Where it
  sits" diagram and a Related line, and ending in tests and open
  questions; relations in the front matter, checked both ways; an index
  with the map and the components every diagram names; a check that
  every link and path resolves; the reader showing related documents,
  what links to each page, a contents list and links to sections.
- **Requires:** docs/specs/_template.md; docs/specs/README.md "Name in diagrams".
- **Argued against:** leaving specs free-form, as the two existing ones
  had drifted to five and twelve sections; and typed links on every
  section reference, which would end plain Markdown (FS-563).
- **Costs (inferred):** front matter to keep current as specs are added;
  a renamed component means a change to the components table and every
  diagram that draws it.

## FS-633 · The night's close: checks first, a phone call when it fails

- **Chose:** an end-of-day runner per institution: checks at 21:00 and
  23:45, each blocking or a warning by written criteria agreed with the
  institution; the business date moves at midnight whatever they say,
  and only the close waits on a blocking check; two people may override,
  never on a check a regulation drives; every failure routed by the
  incident-management plan, a severity 1 by phone call to the on-call
  engineer. On-call proposed on GoAlert, self-hosted, since Grafana's
  own on-call is now cloud-only.
- **Requires:** KC-07; RO-18; docs/specs/end-of-day-runner.md §4; docs/service-management/incident-management.md §3; docs/specs/observability-grafana.md §5.
- **Argued against:** Fineract's scheduler alone, which runs the close
  with no checks before it and calls no one; holding the business date
  with the close, which would refuse the next day's payments as being in
  the future; and Grafana Cloud IRM, which takes alerts out of Kenya.
- **Costs (inferred):** a service to build and run, and one more,
  GoAlert, for on-call; a Twilio account for calls; and a rota of three
  carrying night pages until it grows.


## FS-638 · ID numbers encrypted field by field, in R1; the cap raised to 249

- **Chose:** government ID numbers and other Restricted fields encrypted
  by the service through OpenBao's transit engine before they reach a
  database, and found by a keyed hash (platform-security SE-27), in R1,
  because Roan Capital's borrowers' and guarantors' ID numbers are among
  the first data the platform holds.
- **Requires:** SE-27; docs/architecture/README.md "ID numbers encrypted field by field".
- **Argued against:** phase 2, which would leave ID numbers readable by
  anyone with database access, in backups and in replicas, for the whole
  pilot.
- **Costs (inferred):** one more R1 capability for a team of four; lookups
  by ID number go through a keyed hash, and a key rotation re-encrypts the
  fields.


## FS-639 · Service management: a few ITIL 4 practices, on tools we already run

- **Chose:** adopt incident, problem, change, release, configuration,
  service-level and request management from ITIL 4, in our own words and
  at our size, and map the other practices to where they already live;
  three kinds of change with no deployment during the night's close or at
  month-end; the configuration record generated from code as part of
  SE-23, not a capability of its own; Odoo Helpdesk, Knowledge and the
  pipeline as the tools, with no separate suite.
- **Requires:** SE-23; docs/service-management/README.md §2; docs/service-management/incident-management.md "The record".
- **Argued against:** a service-management suite, which splits every
  request across two systems and holds customer data outside Kenya; a
  hand-kept configuration database, which drifts from what runs; and
  adopting all 34 practices, which a team of four cannot run.
- **Costs (inferred):** a pipeline rule and a pull-request template to
  build; Helpdesk types and SLA policies to configure before R1; service
  levels to agree in every contract; ISO/IEC 20000-1 still without a
  certification route in Kenya.


## FS-645 · Dibon engineers: one identity, no standing access, every grant recorded on both sides

- **Chose:** each engineer holds one identity in a central Dibon Keycloak,
  brokered into each instance and never copied; no standing access to an
  institution's data in any deployment; access just in time, against a
  ticket, scoped and expiring, approved by the institution where it runs
  its own operations, which may switch Dibon's access off at any time;
  an access register compared with the institution's records each month.
- **Requires:** SE-26; docs/architecture/README.md "Who holds access, by who runs the instance"; docs/onboarding.md "OB-COM-22".
- **Argued against:** local accounts for engineers in each instance,
  which a leaver keeps until someone remembers every instance; and
  standing access for convenience, which an outsourcing approval would
  have to justify and an auditor would question.
- **Costs (inferred):** a central Keycloak for Dibon to run; slower
  support where each access waits for the institution's approval; a
  monthly comparison to do; a bastion still to choose.

## FS-646 · OCA's auth_oidc inside Odoo, unmodified: the one AGPL exception

- **Chose:** sign Odoo users in through Keycloak by the code flow with
  OCA's `auth_oidc` module, installed unmodified, as a stated exception
  to the rule that AGPL software runs only as a separate service.
- **Requires:** docs/architecture/README.md "One exception, by decision"; docs/specs/access-keycloak.md "auth_oidc".
- **Argued against:** Odoo's own module, which uses the implicit flow
  and puts tokens in the browser's address bar; and writing our own
  module, which is code to keep for every Odoo version.
- **Costs (inferred):** the module must keep pace with each Odoo version
  we deploy; a change to it would mean publishing that change, so it is
  never changed in passing.


## FS-648 · Templates: the institution's words, our rules; no balance in a message

- **Chose:** the institution owns and approves the words of its
  transactional messages, notices and collection messages, from Dibon's
  defaults, held and versioned in messaging; Dibon owns the wording of
  codes and security messages. A message carries the amount just paid or
  due now, a date, a reference, the last four characters of a loan and a
  link, and **never the outstanding balance**, a statement, a document or
  an ID number; a template that would is refused at approval. An R1
  catalogue of 27 templates.
- **Requires:** MS-12; MS-14; docs/specs/messaging.md "never the outstanding balance".
- **Argued against:** the balance in a receipt, as many Kenyan lenders
  send it, which puts a figure about a person's debt on any phone that
  can read the SMS; and Dibon owning every template, which would make us
  the author of an institution's words to its own customers.
- **Costs (inferred):** a borrower must open a link to see what is
  still owed; every institution approves its templates before go-live;
  Swahili wording needs a native speaker's review.


## FS-655 · Availability: failover in seconds within a site; a choice of models across sites; no active-active ledger

- **Chose:** automatic failover within a site for every tier-1 component
  (PostgreSQL through CloudNativePG with a synchronous standby, Kafka on
  three brokers, OpenBao on three nodes); across sites, a choice per
  institution of cold, warm (the default), hot or hot automatic with a
  witness; active-active only for the edge, stateless services, read
  copies and observability; availability sold as its own choice.
- **Requires:** docs/architecture/deployment.md §2; docs/modules/platform-security.md "These objectives".
- **Argued against:** active-active PostgreSQL for the ledger, which
  settles conflicting writes after the fact or needs three sites and a
  database Fineract does not support; and a 5-minute recovery time for
  everyone, which a team of four would run for a rare event while money
  keeps landing in institutions' own paybills regardless.
- **Costs (inferred):** hot and automatic models need a second site at
  full size and a third location for the witness; four models to price,
  contract and test.

## FS-657 · Backups opened by three of five, on hardware keys, through a recovery vault

- **Chose:** a recovery vault, a separate OpenBao kept off and sealed,
  holding the key that wraps every backup's key; opened by any three of
  five holders, one outside Dibon, each share encrypted to the holder's
  hardware security key and backup key; an unlock requested, approved by
  two people other than the initiator, done in a clean environment and
  recorded; shares never released by TOTP (FS-659); practised every
  quarter as training.
- **Requires:** SE-21; docs/architecture/deployment.md §4; docs/training/key-holder.md.
- **Argued against:** two holders, where losing one loses the backups;
  TOTP-released shares, which would put every share in one service; and
  rotating the key after each unlock, unneeded once the wrapping key
  never leaves the vault.
- **Costs (inferred):** a vault to keep, a ceremony to run, a custody
  agreement with an outside holder, and hardware keys for two holders who
  do not carry one today.


## FS-663 · Unplaced payments: ask the payer, escalate, return at day 7; Flowza as the conversation layer

- **Chose:** a payment that cannot be placed opens a ticket and the payer
  is asked on the paying number which account it is for; applied
  automatically only when that account belongs to the paying phone;
  reminded at 24 hours; the institution's follow-up team at 48; returned
  to the payer at day 7, never kept. Flowza, Dibon's own engagement
  platform, carries the conversation as the team inbox, sending through
  the messaging service so its rules stay in one place.
- **Requires:** CO-21; docs/specs/messaging.md "The conversation layer".
- **Argued against:** guessing the account from a payer's reply, which
  lets anyone redirect money; keeping unclaimed money, which is not the
  institution's; Flowza as the messaging service itself, before it meets
  that spec; and leaving Flowza out, which would build its inbox again.
- **Costs (inferred):** Flowza must be hosted in Kenya per institution,
  drop its transfer clause and use only the official WhatsApp API before
  institutions' customers use it; a follow-up team at each institution;
  returns approved and sent.


## FS-661 · The preferred channel, never the only one

- **Chose:** say plainly that if the platform stops, the money does not:
  collections keep landing in institutions' own paybills, payouts can be
  made by hand from their own portals and banks, and everything comes
  back in afterwards. Three rules make it dependable: M-Pesa's validation
  fallback set to complete; queued payouts checked against the rail's
  statement before release; manual acts approved afterwards
  (`manual.act`). Each institution's runbook agreed at onboarding.
  Merchants give their direct details by default (GW-16, FS-662).
- **Requires:** SE-24; GW-16; docs/architecture/README.md "If we stop, the money does not"; docs/onboarding.md "OB-COM-23".
- **Argued against:** leaving it implicit, which a regulator's continuity
  and exit questions would expose; and cancelling payments while our
  check is down, which would stop institutions being paid.
- **Costs (inferred):** payments to unknown accounts accepted during an
  outage, then handled as unplaced (CO-21); a runbook per institution;
  manual acts to approve after each outage.

## FS-667 · Specs: a lifecycle, threats, data and quality in each; one catalogue of events

- **Chose:** every spec carries a status (draft, agreed, building,
  built) and, once agreed, changes only through change enablement; every
  spec states its data, its quality targets and metrics, and its threats
  (STRIDE, LINDDUN); every test has an id; contracts become OpenAPI 3.1
  and AsyncAPI 3.0 files with the code; events are CloudEvents 1.0 named
  from one catalogue in the event bus spec, a name not in it not
  published. The standards to build to are listed in FS-667.
- **Requires:** docs/specs/_template.md "Threats"; docs/specs/event-bus-kafka.md §5.
- **Argued against:** leaving specs free to grow sections as they need,
  which let event names drift until approval emails had no event to
  fire on; and capitalised RFC 2119 words, which our plain style already
  makes unnecessary.
- **Costs (inferred):** three more sections in every spec, kept current;
  contract files to generate and test; every new event added to the
  catalogue before it is published.

## FS-674 · R1's scope swept: what the specs rely on is in the plan

- **Chose:** 24 phase-1 capabilities the specs and JN-16 relied on moved
  into R1: the unplaced payment (CO-21), Pull Transactions (RL-20), the
  number bound to its SIM (ID-12), the general ledger and M-Pesa posting
  (KC-05, KC-09), hosting per institution (KC-12), the approval engine's
  frozen chains, roles and flags (MD-03, MD-04, MD-07), messaging's
  events, replies, consent, templates and quiet hours (MS-10 to MS-12,
  MS-14, MS-15), access's codes, sessions, events, block and recovery
  (AC-03, AC-10, AC-11, AC-13 to AC-15), and reconciliation's end-of-day
  cycle, on-call, signed events and verifiable evidence (RO-04, RO-18,
  RO-23, RO-25). Eight narrowed to what R1 needs, as the specs say.
  Routing across SMS providers (MS-05) and WhatsApp (MS-06) stay out. A
  check fails any spec's "Yes" in R1 that the plan leaves out (FS-675).
- **Requires:** CO-21; RL-20; ID-12; RO-25; docs/delivery-plan.md "R1 in detail".
- **Argued against:** leaving the specs ahead of the plan, which would
  have built R1 on capabilities nobody scheduled; and moving the specs
  back to the plan, which would have left R1 without a ledger, replies
  or a way to return an unplaced payment.
- **Costs (inferred):** a larger R1 (the v1 cap is unchanged, since all
  were phase 1); the transparency log chosen before R1's build; a
  follow-up team and a reversal policy at Roan Capital.

## FS-703 · Technology re-evaluated, with a register kept current

- **Chose:** a register of every component we run, by class, with its
  licence, governance, alternatives and verdict, re-checked each quarter;
  pipeline steps pinned to a commit or digest, images only from a
  project's own builds or ours, never Bitnami's. With it: Envoy Gateway as
  the default edge, decided by a trial against APISIX, Coraza called as an
  external processor (FS-698, FS-699); OpenBao's data in PostgreSQL, since
  OpenBao has no cross-site replication (FS-693); no Kafka at site B under
  cold or warm standby, the outboxes keeping 7 days and refilling a fresh
  cluster (FS-694); no runtime schema registry in R1 (FS-697); CloudNativePG's
  Barman Cloud plugin for database backups (FS-699); Tempo for traces;
  Rekor v2 as the transparency log, witnessed (FS-700); GitLab Premium with
  runners in Kenya, and Flux (FS-701); Warpgate to evaluate as the bastion
  (FS-695).
- **Requires:** RO-24; docs/architecture/technology.md "The register"; docs/architecture/flows.md "A request coming in: the edge".
- **Argued against:** keeping choices made in passing (APISIX, pgBackRest)
  without a recorded comparison; copying Kafka between sites, which can
  leave events and data from different moments; a schema registry, a
  service to run for protection the pipeline gives; Trillian v1, which
  needs MySQL; running GitLab ourselves.
- **Costs (inferred):** a gateway trial; a quarterly review of the
  register; outboxes kept 7 days; a slower failover while Kafka is
  rebuilt; GitLab Premium seats.

## FS-712 · Managed security through Liquid first; our own on Wazuh where a client chooses it

- **Chose:** Sophos managed detection and endpoint protection, with
  Microsoft Intune, bought through Liquid, for Dibon's own estate and as
  the default for institutions while the customer base grows. For a client
  who prefers it or cannot pay for Sophos, our own tier: Wazuh, Microsoft
  Defender Antivirus and ClamAV, and Fleet to evaluate for device
  management, watched by our rota. Wazuh's GPL-2.0 core is allowed as a
  second named service, run unmodified and separately, as ClamAV is. No
  customer data on any device (FS-711).
- **Requires:** SE-14; docs/specs/endpoints.md "Two tiers"; docs/architecture/README.md §6.1 "and Wazuh".
- **Argued against:** our own tier as the default now, which would make a
  team of four the night watch before there is revenue to staff it; Sophos
  only, which would price out small lenders and Saccos.
- **Costs (inferred):** a second offering to keep tested; Wazuh's hosting,
  about 4 vCPU and 8 GiB per 25 devices per institution; honest wording on
  night-time response for the own tier.

## FS-544 · Identity: a manual route only where no check covers a document

*Entry written 2026-10-15, from the register row (FS-843).*

- **Chose:** a manual route for documents no register or vendor checks
  (refugee IDs likely): the officer sees the original, the scan goes to
  the vault, a second person approves through mandates, and the record is
  marked verified manually; never for a mismatch. Written into ID-01, not
  a new row.
- **Requires:** ID-01; docs/modules/identity.md "verified manually".
- **Argued against:** a new capability row, which would have moved the v1
  cap; leaving such borrowers out.
- **Costs (inferred):** a slower, staffed path; a record type that audits
  must be able to find and count.

## FS-555 · A mismatch goes to a restricted compliance team in Odoo Helpdesk

*Entry written 2026-10-15, from the register row (FS-843).*

- **Chose:** a ticket in a restricted compliance team of the institution's
  Odoo Helpdesk, never visible to the customer portal or the service
  desk's AI agent, holding a link and never documents, because tipping off
  is an offence (POCAMLA s.8).
- **Requires:** BS-01; ID-01; docs/modules/business-suite.md "restricted compliance team".
- **Argued against:** waiting for case management (FC-08, phase 2), when
  R1 already has ticketing.
- **Costs (inferred):** Helpdesk permissions to keep tight per institution;
  FC-08's alerts, evidence and STRs still phase 2.

## FS-565 · Roan Capital runs on Dibon's own messaging service

*Entry written 2026-10-15, from the register row (FS-843).*

- **Chose:** Roan Capital's SMS and messaging through Dibon's own
  messaging service, superseding its requirement document's assumption 5
  (its own gateway); one-time codes go through it too.
- **Requires:** MS-01; MS-02; MS-03; MS-09.
- **Argued against:** Roan Capital's own SMS gateway, as its requirement
  document assumed.
- **Costs (inferred):** Dibon carries the sender ID's onboarding and the
  messaging service's availability for Roan Capital.

## FS-606 · Payroll is paid from the employer's own accounts, never through Dibon

*Entry written 2026-10-15, from the register rows (FS-843; check-off,
FS-608).*

- **Chose:** net pay, statutory and check-off remittances paid from the
  employer's own accounts as one approved run, each payment an instruction
  through SME Recon; no new rails; never through Dibon. Phase 2.
- **Requires:** BS-19; SR-11; BS-14.
- **Argued against (inferred):** Dibon holding or moving payroll money,
  which would raise the licence question left open (FS-037, compliance
  LC-06).
- **Costs (inferred):** each employer's bank connection must carry the run;
  statutory remittances only partly covered by the rails today.

## FS-634 · Time: UTC stored, Nairobi business dates, three dates per money record

*Entry written 2026-10-15, from the register row (FS-843).*

- **Chose:** UTC stored; Nairobi business dates; three dates per money
  record; NTP with a 500 ms alarm; references before time in matching;
  cut-offs treated as items in transit.
- **Requires:** docs/architecture/README.md §10; RO-04.
- **Argued against (inferred):** local time stored, and one date per
  record, which break at the night's close and across time zones.
- **Costs (inferred):** every component must carry three dates and agree
  on the business date; clock drift becomes an alarm to staff.

## FS-636 · Every store listed, and Restricted fields encrypted one by one

*Entry written 2026-10-15, from the register row (FS-843).*

- **Chose:** architecture §2 "Every store": one row per store, what it
  holds and never holds, its class and its protections beyond a stated
  baseline. The gap it found filled: Restricted fields encrypted one by
  one through OpenBao's transit engine, in R1.
- **Requires:** docs/architecture/README.md "Every store"; SE-27.
- **Argued against (inferred):** relying on disk and database encryption
  alone, which a query, a backup or a replica would read through.
- **Costs (inferred):** a keyed hash for lookups on encrypted fields;
  OpenBao on every write and read of those fields.

## FS-637 · Nothing needs reading

*Entry written 2026-10-15, from the register row (FS-843).*

- **Chose:** anything a person must confirm or be told is also available
  by voice or as numbers; the principle in omni-channel §1 and
  start-here's rules; a micro-trader's journey (JN-15, phase 2) to test it.
- **Requires:** docs/modules/omni-channel.md "Nothing needs reading".
- **Argued against (inferred):** text-first channels, which exclude people
  who cannot read them.
- **Costs (inferred):** spoken confirmations to build and record;
  channels that assume reading to rework.

## FS-644 · Odoo Enterprise is required

*Entry written 2026-10-15, from the register row (FS-843).*

- **Chose:** Odoo Enterprise, required, not only assumed: Sign, Helpdesk,
  Knowledge, Documents, Approvals, full Accounting and Payroll are
  Enterprise only; the business suite says what an SME on Community goes
  without.
- **Requires:** docs/architecture/README.md §8; docs/architecture/README.md "Enterprise".
- **Argued against:** Odoo Community, which lacks those modules.
- **Costs (inferred):** a licence per user for every institution, and a
  question of which read-only staff need a paid user (FS-529).

## FS-771 · Each institution has a handbook

*Entry written 2026-10-15, from the register row (FS-843).*

- **Chose:** a handbook per institution (docs/handbook/): what and when,
  one procedure per HB id, each drawn from a journey; the manuals that say
  how wait for the screens.
- **Requires:** docs/handbook/README.md "One procedure per entry".
- **Argued against (inferred):** waiting for the role manuals, which need
  screens that do not exist yet.
- **Costs (inferred):** an agreed journey cannot be agreed without its
  procedures (the check); each institution's copy kept in its own Odoo.

## FS-792 · Recon is the verifier, with a scale target proven before it is claimed

*Entry written 2026-10-15, from the register rows (FS-843; FS-788 to
FS-791).*

- **Chose:** recon as the platform's verifier: three ledgers (the master,
  a shadow rebuilt from its postings, a companion computing on its own),
  one way and in a separate security domain; and a scale target of 25
  million accounts and 10 million transactions a day per instance, with a
  load test before the claim.
- **Requires:** RO-08; docs/specs/recon.md "opening position"; docs/architecture/quality.md "25 million".
- **Argued against:** comparisons of money spread across each module; a
  target claimed without a test.
- **Costs (inferred):** a second and third ledger to run and keep in step;
  a load test to build before R2.

## FS-793 · Four design changes for recon and the ledger

*Entry written 2026-10-15, from the register row (FS-843).*

- **Chose:** the ledger database without a superuser or human login, with
  pgAudit off the instance; payment references with check digits; events
  signed with short-lived keys from OpenBao rather than a call per event;
  the companion independent by construction; one ticket per root cause.
- **Requires:** SE-18; SE-26; CO-21; RO-02; RO-23; docs/specs/kapu-core-fineract.md §8.
- **Argued against (inferred):** a database administrator's standing
  access, and signing each event through OpenBao, which would not scale.
- **Costs (inferred):** fixes only as approved postings; key rotation to
  run; check digits on every reference issued.

## FS-794 · One model for recon's actions and deadlines; Odoo first

*Entry written 2026-10-15, from the register row (FS-843).*

- **Chose:** four questions decide a break's action (a system fault: an
  alert; would it move money: the approval chain, never automatic; can a
  read settle it: automatic; otherwise a ticket per root cause), with
  floors an institution cannot lower, and three clocks per channel; each
  institution's rules set against it at onboarding. Extensions: Odoo
  first. Database activity monitoring left open.
- **Requires:** docs/specs/recon.md "The model for actions and deadlines"; docs/specs/recon.md "Odoo first".
- **Argued against (inferred):** each institution's own rules from scratch,
  which nothing could check.
- **Costs (inferred):** the model to explain at every onboarding; the
  floors to defend when an institution wants them lower.

## FS-798 · Recon can start from a cut-off

*Entry written 2026-10-15, from the register row (FS-843).*

- **Chose:** an opening position at a cut-off, taken from the master and
  signed by the institution's finance lead and Dibon as the agreed start;
  what is known to be unreconciled carried as open items; inputs archived
  from the cut-off; never presented as proven.
- **Requires:** docs/specs/recon.md "opening position"; docs/onboarding.md "opening position".
- **Argued against:** replaying from go-live, when the event bus keeps
  seven days.
- **Costs (inferred):** reports say "reconciled since" the cut-off, never
  more; a new cut-off needs the same two signatures.

## FS-799 · Charges the borrower did not cause are waived

*Entry written 2026-10-15, from the register row (FS-843).*

- **Chose:** a payment counts on the day the money arrived, so a late
  posting re-runs the loan and reverses any charge the gap caused; when a
  rail was down, a disruption window declared with the incident, approved
  by two people, and a standing waiver the institution approved once.
- **Requires:** docs/specs/lender-rules.md "Charges the borrower did not cause".
- **Argued against (inferred):** handling each case as a complaint, after
  the borrower has paid.
- **Costs (inferred):** disruption windows to declare and approve during
  an incident; refunds through approval for penalties already paid.

## FS-803 · Products published by stage

*Entry written 2026-10-15, from the register rows (FS-843; applied,
FS-805).*

- **Chose:** a draft, and a version awaiting CBK, private; an active
  version public, on the institution's pages, in each key information
  document and calculator; the pricing model kept apart, for CBK only.
- **Requires:** BS-20; docs/specs/lender-rules.md "version is public, as regs 47(1)(d) and 48 require"; docs/specs/lender-rules.md "pricing model".
- **Argued against:** publishing a product before it is approved and
  active.
- **Costs (inferred):** every version's terms generated from the signed
  document; the range shown where rates vary by risk class.

## FS-864 · GitLab.com, not a GitLab we run ourselves

*Entry written 2026-10-16. The choice was made on 2026-10-10 under FS-701
(the owner's go, FS-703), where running GitLab ourselves was argued
against without reasons of its own; this entry gives them.*

- **Chose:** GitLab.com, Premium, one top-level group; our own runners in
  Kenya, at Dibon central, and GitLab's agent pulling into each cluster.
  GitLab upgrades, patches and backs up the service; we run only the
  runners and the agents.
- **Requires:** docs/specs/gitlab.md §2; docs/specs/gitlab.md "hosted runners never run a job that holds a secret".
- **Argued (FS-701):** repositories, issues and comments hold no personal
  data, no client material and no secrets (rules §1; rules, Dibon 10), so
  nothing on GitLab.com needs to stay in Kenya; the work that does,
  secrets and test data, runs on our runners in Kenya. Self-managed only
  if code itself must stay in Kenya, at the cost of running it.
- **Argued against:** GitLab self-managed, which we would install,
  upgrade monthly, patch, back up and keep available, a critical system
  for a small team whose roles one person mostly holds; GitLab Dedicated,
  the hosted single-tenant option, which is Ultimate only and has no
  African region.
- **Costs (inferred):** code and documents live outside Kenya, at GitLab's
  availability (when it is down, work goes on in local clones and deploys
  pause); Premium seats for everyone who approves. The seat price is
  thought to be the same hosted or self-managed, so the saving is our
  time, not the licence: to confirm with GitLab.
- **Revisit when:** a customer's or a regulator's due diligence asks for
  source code held in Kenya, or in escrow; CBK's outsourcing expectations
  are read to cover our code hosting; GitLab.com offers an African region;
  or the team grows to where running GitLab costs little. Any of these
  moves us to self-managed, with the same runners and agents.

## FS-882 · Our own team named, with their roles, for who is doing what

*Entry written 2026-10-17, from the owner's answer in chat.*

- **Chose:** names and roles both, while the team is small: each open
  row of the review register says who has it, by first name, from the
  team listed in ways-of-working §1, and the reader adds the role
  ("Betty (Project manager)"). Roles stay for approvals, for the owner of
  each document, and in what the documents describe.
- **Requires:** docs/service-management/ways-of-working.md "The team today"; docs/start-here.md "except our own team".
- **Argued (owner):** "We're a small team at the moment"; a role alone
  cannot say who is doing a thing when one person holds most roles.
- **Argued against:** roles only, which left 141 open rows with no one
  on them; a customer's or a partner's people named, which stays
  forbidden.
- **Costs (inferred):** the team table kept current as people join and
  leave; every open row handed to someone; names in a register that
  outlives the people in it, so a closed row may keep "—".

## FS-886 · Each person's work under their own name, Claude's included

*Entry written 2026-10-17 by Claude (Assistant), from the owner's words in chat.*

- **Chose:** every commit authored by whoever wrote it, under their own
  name: Claude's as `Claude <noreply@anthropic.com>`, on Claude's own
  branch, `claude/<FS id>-<a-few-words>`. Main changes by the owner's
  merge, a merge commit that keeps each author and records who took the
  work in; a squash only within one person's own branch. Releases are
  the owner's act. Change notes are signed by name and role. Claude's
  work is a conversation: just us, private (the default) or public, with
  the team, the last only on the owner's word.
- **Requires:** docs/service-management/ways-of-working.md "Who did what"; docs/service-management/ways-of-working.md "Claude's work is a conversation".
- **Argued (owner):** "my work is my work, my branch is my branch, my
  contribution is my contribution", and Claude's are Claude's; and that
  Claude may hold a private or a public conversation with the team.
- **Argued against:** Claude committing on main under the owner's name
  with a co-author line (FS-862's way), which made Claude's drafts read
  as the owner's work; squashing between people, which erases who wrote
  what.
- **Costs (inferred):** a merge for every piece of Claude's work before
  it reaches main; a history with merge commits in it. The history
  before FS-886 stays the owner's, with Claude as co-author.

## FS-887 · A version is its date, and nothing more, for now

*Entry written 2026-10-19 by Claude (Assistant), from the owner's words in chat.*

- **Chose:** versions stay all date, `2026.10.16`, with `.1` for a patch
  or a second release that day: no letters in the version, and for now
  no release name beside it either.
- **Requires:** docs/rules.md "named by date".
- **Argued (owner):** "let's stick with the date for now".
- **Argued against:** letters in the version (`2026.10.16b`, `-rc`),
  which would add a second scheme, sit ambiguously beside `.1`, and
  break every tool, check and tag that reads the date; a release name in
  the heading, beside the version, left for later.
- **Costs (inferred):** a version says when, not what; what a release
  holds is read from its notes.

## FS-900 · A rule is ours, and cites the law it applies

*Entry written 2026-10-21 by Claude (Assistant), from the owner's words in chat.*

- **Chose:** "rule" means our application or reading of the law; each of
  our rules says so and cites the provision it applies, naming the legal
  question where the reading is unsettled. Each lender rule carries an
  "Our rule" line between what the law requires and what the platform
  does. A law's own provisions are cited as the law names them: "s." for
  an Act's sections, "reg" for regulations, "r." for a set of Rules; and
  spelled out (section, regulation, rule) for readers outside Dibon.
- **Requires:** docs/specs/lender-rules.md "Our rule"; docs/law/README.md "alone is ours: our".
- **Argued (owner):** "rule, as it's our application/understanding of
  the regs, and then we cite the actual reg"; and the short forms spelled
  out for external documents.
- **Argued against:** citing the Auctioneers Rules as "rule 12", which
  would blur our rules with the law's; leaving our readings inside the
  behaviour, where counsel cannot tell them from the law.
- **Costs (inferred):** every new lender rule written in three parts;
  "r." added to the citation tool, upper-case "R." left to other
  frameworks (a FATF Recommendation).

## FS-902 · The team by group, its roles held, and a deputy for each

*Entry written 2026-10-21 by Claude for Eric (Assistant), from the owner's words in chat.*

- **Chose:** the team table by group (leadership, DevOps, Odoo, PM,
  admin, social media), each person with a handle. The dev lead holds the
  engineering lead's role and the ops lead the operations lead's, both
  taken from the CTIO or vacancy; a new Odoo lead role, held by the Odoo
  lead, the two Odoo consultants being our own; the CEO the commercial
  lead. Every role names a deputy. HR is outsourced, its supplier unnamed
  here beyond its company.
- **Requires:** docs/service-management/ways-of-working.md "The Odoo platform and its set-up"; docs/service-management/ways-of-working.md "| Role | Accountable for | Approves | Held today by | Deputy |".
- **Argued (owner):** the team's structure as given; "gibeon and daniel
  are the two odoo consultants"; Jimmy as commercial lead.
- **Argued against:** the CTIO holding engineering and operations, which
  left nothing approvable while he was away (FS-898).
- **Costs (inferred):** each person to confirm their row and handle;
  rows handed out from the CTIO's 141 to the leads, on his approval.

## FS-903 · Our people open to the team; a customer's people by role, named only to its project

*Entry written 2026-10-21 by Claude for Eric (Assistant), from the owner's words in chat.*

- **Chose:** who on our team works on what is open to the whole team; a
  customer's roles are written here, by role only; its people's names and
  work contacts live in Dibon's Odoo, opened to a project's team by
  joining it, and closed by leaving; nothing more about a person is kept.
- **Requires:** docs/service-management/ways-of-working.md "Who sees what about a project"; docs/customers/roan-capital.md "Who is on it at Dibon".
- **Argued (owner):** the team should see who else is on a project and
  who the client's marketing or tech lead is, by role and with privacy in
  mind.
- **Argued against:** naming a customer's people in the repository,
  which every teammate and every clone would hold; hiding the roles too,
  which leaves people not knowing whom to ask.
- **Costs (inferred):** Odoo's record rules set per project; followers
  kept in step with who has joined; a line in the engagement letter.

## FS-904 · A change advisory board for releases, chaired by the operations lead

*Entry written 2026-10-21 by Claude for Eric (Assistant), from the owner's words in chat.*

- **Chose:** a board that advises on releases, not on every change; the
  change authority still decides. Chaired by the operations lead in a
  weekly slot; seats for architecture and security, engineering, Odoo,
  delivery, compliance and commercial, with a quorum; a release pack two
  working days before; on GitHub, a cab team as code owner of the release
  files and a tag ruleset.
- **Requires:** docs/service-management/ways-of-working.md "The change advisory board"; docs/service-management/ways-of-working.md "The release pack,".
- **Argued (owner):** a board for releases once on GitHub's Team plan;
  "allan chairs, weekly slot".
- **Argued against:** a board for every change, too slow for a team this
  size; a board only when a release needs one, which never forms a habit.
- **Costs (inferred):** half an hour a week; a pack prepared for every
  release beyond a patch.

## FS-905 · Each person's Claude commits as its own

*Entry written 2026-10-21 by Claude for Eric (Assistant), from the owner's words in chat.*

- **Chose:** each person's Claude commits as "Claude for" that person,
  at `claude-eric@noreply.dibon.co.ke` for Eric, set once with dibon claude, on
  branches `claude/<handle>/…`; a name means one person (an initial where
  first names collide) and so does a handle, the work email's local part,
  and the check refuses either twice. The commits so far authored as
  plain "Claude" were all made in the owner's sessions, on his word.
- **Requires:** docs/service-management/ways-of-working.md "A name is one person, and so is a handle"; docs/service-management/ways-of-working.md "Each person's Claude is its own".
- **Argued (owner):** one identity for everyone's Claude "doesn't provide
  the requisite attribution"; and "what happens if we onboard another
  eric?"
- **Argued against:** Anthropic's shared address, everyone's Claude in
  the world; the person's own identity, which credits them with Claude's
  work (FS-886); first names as keys.
- **Costs (inferred):** a setting per clone; handles confirmed with each
  person; signing, when it comes, decided then.
