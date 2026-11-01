---
id: crb
name: CRB — credit bureau connections
kind: shared-service
status: living
law: LR-06
released: 2026.10.16
owner: Solution architect
classification: Internal
audience: [bank, sacco, mfi, fintech, sme]
depends_on: [mandates, messaging, recon-observability, identity, access]
consumed_by: [mfi, sacco, sme-recon]
review_ids: [FS-004, FS-005, FS-019, FS-020, FS-022, FS-137, FS-186, FS-187, FS-188, FS-189, FS-190, FS-191, FS-447]
last_reviewed: 2026-10-16
---

# CRB — credit bureau connections

## 1 · In one paragraph

The CRB service will connect lenders to Kenya's licensed credit reference
bureaus, in both directions (FS-022). **Batch:** the full monthly
submission of every credit account, generated from the ledger, validated
before it leaves, and reconciled against what the bureau accepted.
**Individual:** a lookup at vetting, an out-of-cycle correction, a
dispute — done for one person from inside the product or the ERP. It will
connect to every licensed bureau, not just one. A score it fetches will be
evidence for a human decision, never the decision itself (FS-020). Who
may subscribe is set by the CRB Regulations 2020: banks, microfinance
banks and Saccos; other lenders share under the CBK lender regulations
(law register LR-06, LR-03; FS-447). Dibon subscribes for no one: it
processes for the subscriber.

## 2 · Who it is for

**Segments:** MFIs and Saccos on Kapu, for submission and lookups. Banks
and lenders with their own core, for lookups and submission quality.
SMEs, for checking a customer before giving trade credit, only through a
route the regulations allow: an SME is not among those who may subscribe
(FS-186, FS-447).

**The problem, concretely:** lenders want the monthly submission produced
from the loan book rather than assembled by hand into each bureau's
template; rejected records worked through and reconciled, so the bureau's
view and the lender's book agree; a settled borrower's listing corrected
when they settle; and every lookup recorded in their own system, with who
looked up whom and why, rather than only in each bureau's portal.

**People who use it:**

| Role | What they need from it |
|---|---|
| Loan officer | A report and score at vetting, without leaving the application |
| Credit or compliance officer | Monthly submission prepared, validated, sent and reconciled; rejections as a work queue |
| Borrower | Notice before an adverse listing; a way to dispute; a correction when they settle |
| Accountant or credit controller (SME) | A check on a customer before extending credit, from the ERP |
| Auditor | Who looked up whom, when, why, and under what consent |

## 3 · What it does

**No specification exists.** Sources are the owner's requests (FS-005,
FS-022) and the MFI PRD's Phase 2 note. Every row is **Planned**.

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| CR-01 | Subscriber connections to every licensed bureau, under the institution's own subscription | Planned | FS-005. Bureaus in partners.md SD-10. Subscribers: banks, microfinance banks and Saccos (LR-06 reg 2; FS-447) | 1 |
| CR-02 | Individual lookup: report and score at vetting, with consent and purpose recorded first | Planned | FS-022; MFI PRD §6 (fast-follow) | 1 |
| CR-03 | Batch submission: every credit account, in each bureau's format, generated from the ledger | Planned | FS-022 | 1 |
| CR-04 | Validation before submission, and the bureau's rejection report parsed into a work queue | Planned | FS-022 | 1 |
| CR-05 | Submission reconciled: accounts and balances submitted against the ledger, and accepted against submitted | Planned | recon-observability RO-02 | 1 |
| CR-06 | Notice to the borrower before an adverse listing, with the evidence kept | Planned | FS-188 | 1 |
| CR-07 | Out-of-cycle updates: settlements and corrections sent when they happen | Planned | FS-022 | 1 |
| CR-08 | Disputes: logged, investigated, answered, and the outcome sent to the bureau within the deadline | Planned | FS-188 | 2 |
| CR-09 | Lookups and updates from inside the ERP: Odoo first | Planned | FS-022 ("individual management of CRB from ERP") | 2 |
| CR-10 | Scores shown as evidence for the decision, never as the decision | Planned | FS-020; MFI PRD §6 | 1 |
| CR-11 | Cost per lookup tracked per institution | Planned | FS-187 | 2 |
| CR-12 | Bureaus in other countries, per country | Planned | FS-109 | later |

## 4 · Where it sits

**Depends on:** mandates (who may look up and submit), messaging
(pre-listing notices, dispute outcomes), recon-observability (CR-05),
identity (matching a person to their bureau record). Also access (login, roles and step-up).
**Used by:** mfi (MF-19), sacco (SC-18), sme-recon (CR-09). Banks with
their own core use it directly.

**Who holds which record** (docs/architecture/README.md §2):

| Record | System of record | This module |
|---|---|---|
| Credit accounts and their balances | The lender's core, or Fineract | Reads, to generate submissions. Never edits |
| The bureau's record of a person | The bureau | Submits to it; never holds a copy of the bureau's file |
| A retrieved credit report | The bureau | **Keeps the minimum: a reference, the score, the date and the summary used in the decision** — FS-189 |
| Consent, purpose, and the lookup log | **CRB service** | Holds. Append-only |
| Submission files, acknowledgements, rejection reports, disputes | **CRB service** | Holds. Append-only |

**What this module never stores:** full credit reports beyond what the
decision used, or a person's bureau history as our own record.

**Under each ledger mode:**

| | Integrated — the lender has a core | Native — no core; Fineract is the ledger |
|---|---|---|
| Where data comes from | Extracts from the lender's core | Fineract, directly |
| What differs in this module | Many banks already submit themselves; the service may only do lookups and submission checks | The service produces the whole submission |
| What the customer must provide | Its own bureau subscription (Dibon holds none, FS-447); core extracts | Its own bureau subscription, or for a lender the sharing route of LR-03 reg 33; its loan data in Fineract |
| Who it suits | Banks and larger Saccos | MFIs and smaller Saccos |

## 5 · How it works

```
  BATCH (monthly, or as the bureau requires)

  ledger (core / Fineract)
        |
        v
  generate --> validate --> submit to each bureau --> acknowledgement
                  |                                         |
           errors fixed                            rejection report
           before sending                                   |
                                                            v
                                        rejections --> work queue
                                        accepted vs submitted vs ledger
                                        --> recon (CR-05)

  INDIVIDUAL (from the product or the ERP)

  consent + purpose recorded --> lookup --> report and score shown as
                                            evidence --> a person decides
  settled / corrected --> out-of-cycle update to every bureau
  adverse listing due --> notice to the borrower --> wait --> submit
  dispute --> logged --> investigated --> answer + bureau update
```

## 6 · Rails and integrations

| Rail / system | Direction | Feed | Status |
|---|---|---|---|
| Licensed CRBs (three in Kenya, partners.md SD-10) | out / in | batch files; lookup and update APIs | Planned — formats and channels to obtain (FS-187) |
| Lender's core | in | extract | Planned |
| Fineract | in | API | Planned |
| Odoo | in / out | lookup action; result summary on the customer | Planned (CR-09) |
| Messaging | out | pre-listing notices; dispute outcomes | Planned |

## 7 · Regulatory position

- **Custody:** none.
- **Who may subscribe and submit:** set by the CRB Regulations 2020 (law
  register LR-06): only banks, microfinance banks and Saccos may
  subscribe (reg 2); anyone else furnishing credit data needs CBK approval
  as a third-party credit information provider. Lenders licensed or
  registered with CBK, or applying, share under the lender regulations
  (LR-03 reg 33). Dibon subscribes for no one; it processes for the
  subscriber (FS-447). Whether SMEs have any route remains FS-186.
- **Borrowers' rights:** notice before an adverse listing, the right to
  dispute, correction on settlement, retention limits on negative
  information. The specifics come from the regulations — FS-188.
- **Data:** credit reports carry national ID numbers and a person's
  borrowing history. **Restricted.** Every lookup needs a lawful basis and
  a recorded purpose under the Data Protection Act.
- **Automated decisions:** a score supports a person's decision; it does
  not replace it (FS-020).
- **Open legal checks:** FS-019, FS-186, FS-188, FS-190.

## 8 · Controls

- **Purpose before lookup.** The reason and the consent are recorded
  before the request leaves. A reason typed afterwards is an excuse, not
  a reason (carried over from GateKeepr STANDARDS.md §6.1).
- **Lookups are attributed** to the person who requested them, at the
  moment they requested them.
- **Bulk is a different act.** A monthly submission or a portfolio-wide
  lookup needs its own permission and approval through the mandate
  engine.
- **The submission ties to the ledger.** A file that does not reconcile
  to the loan book is not sent.
- **Settlement clears promptly.** A borrower who has paid is not left
  listed until the next cycle.

## 9 · Deployment

Part of the shared platform, on Liquid's Azure Stack (FS-032). Bureau
connections come from our in-country deployment.

## 10 · What it does not do

- Decide credit, or build our own credit score. Scorecards are FS-004.
- Keep copies of bureau files.
- Act as a credit reference bureau.
- Submit for an institution that is not permitted to share.

## 11 · Open questions

FS-004, FS-187, FS-188, FS-189, FS-191.

## 12 · Sources

- REVIEW.md FS-004, FS-005, FS-019, FS-020, FS-022, FS-447.
- docs/governance/regulation.md LR-03 (reg 33), LR-06 (reg 2).
- Kapu Pay MFI PRD section, Draft v0.2, Jun 2026 — §6 (CRB as fast-follow).
- docs/modules/mfi.md MF-19, docs/modules/sacco.md SC-18.
- GateKeepr STANDARDS.md §6.1 (the reason exists before the lookup) —
  principle carried over.

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](../law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 33 | reg 33 | Customers' credit information shared with licensed credit reference bureaus, timely, complete and accurate; no negative listing for an amount of one thousand shillings or less (33(3)) |

**[LR-06](../law/LR-06.md) The Banking (Credit Reference Bureau) Regulations, 2020, Legal Notice No. 55 of 2020.** Regulator: Central Bank of Kenya. Made under: The Banking Act (Cap. 488), with the Microfinance Act and the Central Bank of Kenya Act. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2020/55/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 2 | reg 2 | Its definitions; a "subscriber" is an institution licensed under the Banking Act, the Microfinance Act or the Sacco Societies Act that has subscribed to receive customer information from a bureau |
