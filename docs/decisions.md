---
id: decisions
name: Decisions — what each cost, and what was argued against it
kind: register
version: 0.1.0
owner: Solution architect
classification: Internal
last_reviewed: 2026-10-05
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
  docs/architecture.md §2 and every module's §4.
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

- **Chose:** ASCII in plain fences, at most 78 columns.
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
  code (docs/architecture.md §6.1).
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
