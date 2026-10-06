---
id: decisioning
name: Decisioning — appraisal, scores and risk classes, rules first
kind: shared-service
version: 0.1.0
owner: Solution architect
classification: Internal
audience: [bank, sacco, mfi, fintech]
depends_on: [core, recon-observability, identity, mandates, access]
consumed_by: [mfi, sacco]
review_ids: [FS-522, FS-581, FS-582, FS-583, FS-584]
last_reviewed: 2026-10-06
---

# Decisioning

## 1 · In one paragraph

Decisioning is where an institution's judgement about a borrower is
computed: the metrics from a borrower's statements, a behaviour score from
how they repay, and the internal risk class they sit in. It will start
with rules, formulas and scorecards a person can read, from the
institution's own definitions, and every result will come with its
inputs and its reasons. Every product that lends reads it (Kapu MFI,
Kapu Sacco), so the step from rules to AI-assisted or automated
decisions is taken once, behind a contract that does not change, with a
person deciding until the institution chooses otherwise and the law's
safeguards are in place (FS-582).

## 2 · Who it is for

**Segments:** every lender on the platform; first Roan Capital, whose
requirement document asks for an appraisal engine, a behaviour score and
automatic downgrades in its MVP (RC-11, RC-14, RC-15).

**The problem, concretely:** a credit officer reads three to twelve
months of statements by hand, computes ratios in a spreadsheet, and
judges a repeat borrower's history by memory. The figures differ from
officer to officer, and nobody can say later why a loan was granted.

**People who use it:**

| Role | What they need from it |
|---|---|
| Credit officer | The metrics and scores for an application, with the transactions and instalments behind each, before appraising |
| Credit committee | The same record the officer saw, so a decision rests on one set of figures |
| Risk or credit manager | To set the formulas, weights, classes and rules, under maker-checker, and to see how each performs |
| Compliance officer | To show any decision's inputs and reasons to a borrower, an auditor or the regulator |
| Borrower | An explanation of a decision that affects them, and a person to reconsider it where it was automated |

## 3 · What it does

All Planned; nothing is designed or built yet. DE-01 to DE-04 are in R1
for Roan Capital; the AI path is phase 2.

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| DE-01 | One contract for every credit decision: a case in (the applicant, the request, references to the evidence), a decision record out (each metric and score with its inputs and reasons, the model and its version, the time), the same whether rules or a learned model produced it. Models (formulas, scorecards, rule sets, later learned models) are versioned, approved under maker-checker and effective-dated, and any past record can be reproduced from its inputs and version. A list of forbidden inputs no model may read: social media (FS-522), and the characteristics the Data Protection Act's definition of profiling names | Planned | Owner, 2026-10-06 (FS-582) | 1 |
| DE-02 | Statement metrics: bank and M-Pesa statements parsed with the parsers recon designs (recon-observability RO-01), each statement checked to reconcile (opening balance plus credits less debits equals closing; one that does not is flagged and never scored silently); turnover, a liquidity metric from average balances, and a retainer ratio from closing balances, each shown with the transactions behind it; a line excluded only with a reason, logged. The formulas are configuration per product, from the institution's definitions | Planned | Owner, 2026-10-06 (FS-582); Roan Capital RC-05, RC-11 | 1 |
| DE-03 | A behaviour score for repeat borrowers from repayment timing in the core: when each instalment was paid against its due date (day 14 against day 30, in Roan Capital's terms), recent loans weighing more. As repaid loans accumulate, the statement-based assessment weighs less, by weights the institution sets. Every component shown; no learned model | Planned | Owner, 2026-10-06 (FS-582); Roan Capital RC-14 | 1 |
| DE-04 | Internal risk classes the institution defines (Class A, B, C and so on), and the rules that move a borrower between them: a pattern of late repayment, the behaviour score, arrears. A downgrade is applied automatically and recorded with the rule and the instalments behind it; an upgrade comes by rule or with a second person's approval. It never changes the regulatory classification (mfi MF-25, reg 57) or an existing loan's terms (MF-24, reg 55), and never reads a forbidden input. Rules are written as the transaction rules are (financial-crime FC-16): criteria, outcome, maker-checker, effective dates | Planned | Owner, 2026-10-06 (FS-583); Roan Capital RC-15 | 1 |
| DE-05 | Shadow mode: a new model runs beside the one in force on the same cases, decides nothing, and is compared; it is promoted only by decision, under maker-checker | Planned | Owner, 2026-10-06 (FS-582) | 2 |
| DE-06 | AI-assisted, then automated decisions: the level is set per product as configuration, evidence for a person, a recommendation, or automated within limits. At the automated level, the Data Protection Act s.35 safeguards: the borrower told in writing that the decision was automated, and able to have it reconsidered or taken again by a person; the decision explained (mfi MF-29). Affordability from statements fetched at source (identity ID-18) and learned scoring come here | Planned | Owner, 2026-10-06 (FS-582); was mfi MF-33 (FS-522) | 2 |
| DE-07 | Monitoring of every model in force: drift in its inputs and outputs, data quality, and outcomes compared across groups the law protects, without those attributes ever being inputs; alerts to the model's owner | Planned | Owner, 2026-10-06 (FS-582) | 2 |

## 4 · Where it sits

**Depends on:** core (repayment history for the behaviour score and the
classes), recon-observability (its statement parsers, RO-01), identity
(statements filed in the vault, ID-15; the KYC tier as context, ID-19),
mandates (maker-checker on every model change), access (who may set and
see models).
**Used by:** mfi (the officer's assessed limit, MF-06, and the committee
read its record) and sacco (loan limits and repeat members).

**Who holds which record** (docs/architecture.md §2):

| Record | System of record | This module |
|---|---|---|
| Loans and repayments | The institution's core, or Fineract | Reads |
| Statement files | The document vault (identity ID-15) | Reads; the parsed lines are held with the case |
| Decision records: metrics, scores, classes, reasons, model versions | **Decisioning** | Holds. Append-only |
| Models: formulas, weights, classes, rules | **Decisioning** | Holds, versioned and effective-dated |
| The loan decision itself | The approval engine (mandates) and the core | Never; it supplies evidence |

**What this module never stores:** a copy of a statement file (the vault
holds it), a bureau report beyond the fields a decision used, or any
forbidden input.

**Under each ledger mode:**

| | Integrated — customer has a core | Native — no core; Fineract is the ledger |
|---|---|---|
| Where funds are posted | Not applicable: decisioning moves no money | Not applicable |
| What differs in this module | Repayment history read through the core adapter | Repayment history read from Fineract |
| What the customer must provide | Read access to repayment history; its definitions, weights and classes | Its definitions, weights and classes |

## 5 · How it works

**One contract, many models.** A product sends a case and receives a
decision record. Behind the contract, the model in force for that
product produces it: today a formula or a rule set, later a learned
model. The product cannot tell which, and does not need to.

```
  mfi / sacco ---- case ----> +------------------------------------------+
                              |  DECISIONING                             |
  core: repayments ---------> |  features, computed once, with lineage   |
  vault: statements --------> |  statement metrics      behaviour score  |
    (parsed by RO-01 parsers) |  risk-class rules       (later) models   |
                              |  model registry: versions, approvals     |
  mfi / sacco <-- record ---- +------------------------------------------+
                                metrics, scores, class, reasons,
                                model and version, time
```

**How far the engine decides is configuration, set per product:**

```
  evidence for a person  -->  a recommendation  -->  automated within limits
  (R1: every loan)            (phase 2)              (phase 2; DPA s.35 safeguards)
```

**How it stays upgradeable, scalable and protected** (FS-582, FS-584):

- **The contract never changes** when the model does; a new model type
  is a registration, not a rewrite of the products.
- **Features are computed once**, recorded with their source, and read
  by every model, so a rule today and a model tomorrow see the same data.
- **Shadow mode** (DE-05) tests a new model on live cases without letting
  it decide.
- **It runs as its own stateless service**, apart from Fineract; statement
  parsing runs in the background. Scoring scales by adding instances.
- **Each institution's models and data stay in its own instance**
  (FS-491); nothing is pooled across institutions without a legal basis
  and each institution's agreement.

## 6 · Rails and integrations

| Rail / system | Direction | Feed | Status |
|---|---|---|---|
| The institution's core, or Fineract | read | API | Planned |
| The document vault (identity ID-15) | read | API | Planned |
| Statement parsers (recon-observability RO-01) | used | library | Designed in recon; Planned here |
| An M-Pesa statement analysis service (partners PT-53), as a source of DE-02's M-Pesa metrics instead of our own parser | read | API | Candidate, not chosen |
| Credit bureaus (crb CR-02), as features | read | API | Planned, when CR-02 joins a release |

## 7 · Regulatory position

- **Custody:** none; decisioning moves no money.
- **Licence relied on:** the institution's, for its lending.
- **Regulators:** CBK (lender regulations: classification, reg 57; price
  changes, reg 55; automated decisions explained, MF-29); SASRA for
  Saccos; ODPC for profiling and automated decisions (Data Protection Act
  s.35, law register LR-17).
- **Data:** statement lines and scores are Confidential; ID numbers
  Restricted. Held in the institution's instance.
- **Open legal checks:** whether a downgrade applied automatically
  (DE-04) is a decision that "significantly affects" the borrower under
  s.35, while a person still decides each loan (FS-582).

## 8 · Controls

- **Attribution:** every model change is made by a named person and
  approved by a second (mandates).
- **Mandates:** model changes, class upgrades by hand, and promotion
  from shadow mode run through the approval engine.
- **Audit:** decision records and model versions are append-only;
  nothing is recomputed in place.
- **Exceptions:** a statement that does not reconcile, a missing input,
  or a model error is shown as such on the record; the engine never fills
  a gap with a guess.

## 9 · Deployment

In the institution's own instance, on-prem or on Liquid's Azure Stack
(FS-032). No data leaves it. A model hosted by a third party, if one is
ever proposed for DE-06, is named here first, with its data class.

## 10 · What it does not do

- Decide a loan in R1: it supplies evidence; people decide.
- Change the regulatory classification, a loan's terms or its price.
- Read social media, or any characteristic the law protects.
- Train a model on one institution's data for another.
- AI-assisted or automated decisions, shadow mode and monitoring are not
  available yet: DE-05 to DE-07 are phase 2.

## 11 · Open questions

FS-581 (Roan Capital's formulas, weights, classes and thresholds),
FS-584.

## 12 · Sources

- Roan Capital's *Business Requirement Document*, v1.0, 20 Aug 2026,
  §2.2. Held in clients/roan-capital/ outside git; *derived, not
  reproduced.*
- Data Protection Act (Cap. 411C), s.2 (profiling) and s.35, read
  2026-10-06.
- REVIEW.md FS-522, FS-581 to FS-583.
