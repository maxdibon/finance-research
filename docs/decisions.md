---
id: decisions
name: Decisions — what each cost, and what was argued against it
kind: register
version: 0.1.0
owner: Solution architect
classification: Internal
last_reviewed: 2026-10-01
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
