---
id: financial-crime
name: Financial Crime and Compliance
kind: shared-service
version: 0.1.0
owner: Compliance lead
classification: Internal
audience: [bank, sacco, mfi, psp, imt, fintech]
depends_on: [identity, recon-observability, rails, mandates, messaging, access, core]
consumed_by: [collect, gateway, mfi, sacco, core, omni-channel, identity]
review_ids: [FS-098, FS-418, FS-422, FS-428, FS-431, FS-433, FS-435, FS-448, FS-453, FS-574, FS-577, FS-580, FS-588]
last_reviewed: 2026-10-08
---

# Financial Crime and Compliance

## 1 · In one paragraph

Financial Crime and Compliance will be the one service behind every
product for fraud prevention, AML/CFT screening, case management and
regulatory reporting (FS-422, FS-431). It will score payments before money
moves, screen customers against sanctions and politically-exposed-person
lists, turn alerts into cases, and prepare the reports an institution must
file: suspicious transaction reports, cash transaction reports and its
regulatory returns. **We detect and prepare; the institution decides and
files.** The bank, Sacco or lender is the reporting institution under the
law; its money laundering reporting officer makes every decision, and
every filing is the institution's own.

## 2 · Who it is for

**Segments:** every institution we serve is a reporting institution under
the Proceeds of Crime and Anti-Money Laundering Act (law register LR-13):
banks, microfinance banks, Saccos, non-deposit-taking lenders (which must
comply under the CBK regulations of 2026, LR-03, reg 64) and payment
service providers. Saccos and smaller lenders first, because they are
building these controls largely from scratch.

**The problem, concretely:** Kenya has been on the FATF grey list since
February 2024, with more and better suspicious transaction reporting among
the actions outstanding (FATF, June 2026; FS-422). The 2022 mutual
evaluation found sanctions took four days to reach institutions from a UN
designation, no local PEP database, small non-bank institutions screening
by hand, and Saccos filing one STR in five years (sources/regulation/ke/
reports/; FS-428). Mobile-money fraud in Kenya runs through SIM swaps,
social engineering, agent fraud, account takeover and mule accounts
(youverify, Apr 2026; FS-422). Reversals of misdirected M-Pesa payments
took banks 24 to 48 hours through staff and emails (FS-418).

**People who use it:**

| Role | What they need from it |
|---|---|
| Money laundering reporting officer | Every alert and case in one queue; an STR drafted, complete and ready to file; the reasons for every decision kept |
| Compliance analyst | Screening hits to clear or escalate, with the evidence beside them |
| Fraud and operations staff | Payments held before they leave, with the reason; the customer contacted through a second channel |
| Head of risk, board, regulator | What was screened, flagged, decided and filed, by period, from the record |

## 3 · What it does

**Every row is Planned.** No specification exists yet; rows moved here from
other modules keep their history in the evidence (FS-431).

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| FC-01 | Payment risk scoring before money moves: behaviour, device, SIM-swap status, account age and velocity, with hold, step-up or block as the outcome | Planned | Moved from Gateway GW-09 ("must not be retrofitted", 8 Jun). Controls from the youverify guide (FS-422) | 2 |
| FC-02 | Transfers above a limit held for a set period after a SIM swap, using the operator's SIM-swap check (rails RL-22) | Planned | FS-422; omni-channel OC-06. Owner, 2026-10-05: in v1 (FS-453), with identity's IMSI binding and holds (ID-12 to ID-14, FS-448) | 1 |
| FC-03 | Integration with an institution's existing fraud system | Planned | Moved from recon RO-12 (the reconciliation proposal: one line, no specification) | 2 |
| FC-04 | Agent and merchant monitoring: velocity and ratio checks, fake-reversal patterns, networks of mule accounts | Planned | FS-422; the mutual evaluation found agents not adequately risk-assessed (R.14; FS-428) | 2 |
| FC-05 | Sanctions screening against UN and domestic designations, at onboarding and whenever a list changes, with matches frozen within 24 hours | Planned | Moved from identity ID-08 and recon RO-15 (FS-098). Law register LR-13 to LR-16; lenders under LR-03 reg 64, including Roan Capital. Phase 1 (FS-431) | 1 |
| FC-06 | PEP and adverse-media screening, with enhanced due diligence and senior-management approval for a match | Planned | Moved from identity ID-08. POCAML Regulations 2023, reg 26 (LR-14); no local PEP database (FS-428) | 2 |
| FC-07 | Monitoring rules: payments split below the cash-report threshold, unusual volumes, high-risk countries | Planned | Moved from recon RO-15 ("structuring"). The mutual evaluation found few controls on split cash (FS-428) | 2 |
| FC-08 | Case management: alerts become cases with an owner, a deadline and the evidence; every decision attributed; the reporting officer decides | Planned | FS-422 | 2 |
| FC-09 | Suspicious transaction reports drafted in goAML format and checked complete before the reporting officer files them, within two days of the suspicion | Planned | Moved from recon RO-14. POCAMLA s.44 (LR-13). goAML returns incomplete reports (FS-428) | 2 |
| FC-10 | Cash transaction reports for amounts of USD 15,000 or more, prepared for filing by Friday each week | Planned | POCAMLA (LR-13); FRC (FS-422) | 2 |
| FC-11 | The annual list of customers from higher-risk countries, prepared for 31 January | Planned | FRC (FS-422) | 2 |
| FC-12 | Records kept at least seven years and retrievable for a regulator | Planned | POCAMLA s.46 (LR-13); NPS Act s.26 (LR-11). Retention otherwise open (FS-063). Phase 1: set at go-live | 1 |
| FC-13 | Regulatory returns assembled from the ledger: CBK returns for banks, microfinance banks and lenders; SASRA forms for Saccos, monthly by the 15th | Planned | Moved from recon RO-14 (returns). Used by Kapu Core KC-10 and Kapu Sacco SC-17. Sacco regulations (LR-09) | 2 |
| FC-14 | A misdirected M-Pesa payment reported by the customer becomes a case, linked to the self-service reversal | Planned | Recon RO-22 (FS-421); the KCB proposal's needs (FS-418) | 2 |
| FC-15 | Compliance operations by Dibon's analysts, under the institution's policy and at its reporting officer's direction: first-level review of alerts, case preparation, STR drafting and list management. Never the decisions the law keeps with the institution | Planned | FS-433, FS-435. The reporting officer is the institution's own (POCAML Regulations reg 12, LR-14); a lender may not outsource the determination of compliance (LR-03 reg 31(1)(d)); the institution notifies CBK or seeks approval first (LR-03 reg 31(3); onboarding OB-COM-15). Needs AML-qualified analysts | 2 |
| FC-16 | Transaction rules, checked before any money moves, for every product and rail. Criteria: transaction type; amount per transaction and as a running total per cycle (day, week, month, year); source and destination (accounts, M-Pesa numbers, shortcodes, banks), with allow- and deny-lists, each entry with a reason and an expiry; currency; a time window; days of the week; the type of day from the business calendar (core KC-15: weekday, weekend, public holiday, the institution's own closures); the channel, an automated job among them; the customer's KYC tier (identity ID-19); how recently a destination was added or its details changed, where a recent change adds an approver and a waiting period, and the person who changed the details may not approve the payment (FS-588). Outcomes: allow; deny, with the reason shown; hold until a time; route to an approval chain (mandates); step-up (access AC-05); and, beside any of these, notify: the customer, the officer or the compliance officer, told that a rule fired and what happens next, delivered by messaging on the person's chosen channels (MS-12) (FS-580). The strictest outcome wins, and an allow-list relaxes only the institution's own rules, never a legal limit, a sanctions match (FC-05) or a hold after a SIM swap (FC-02). Rules are configuration under maker-checker, effective-dated and audited; every payment records the rules that fired. In R1: time windows, types of day and amounts by tier | Planned | Owner, 2026-10-06 (FS-574, FS-577); first for Roan Capital's end-of-day lockout (RC-21) | 1 |

## 4 · Where it sits

**Depends on:** identity (who the person or business is; the ID, phone
number and IMSI bound to an account, ID-12 to ID-14), recon-observability
(transaction events, and RO-11's duplicate and anomaly detection as a
feed), rails (the SIM-swap check, RL-22), mandates (decisions that need a
second person), messaging (contacting the customer on a second channel),
access (attribution), core (the business calendar, KC-15, for the
transaction rules, FC-16).
**Used by:** collect, gateway, mfi, sacco, core, omni-channel; identity,
whose IMSI-change holds (ID-13) run through FC-02.

**Who holds which record** (docs/architecture/README.md §2):

| Record | System of record | This module |
|---|---|---|
| Funds and balances | The institution's core, or Kapu Core | Reads; can ask for a hold, never moves money |
| Customers and their KYC | The institution's core, or Kapu Core (FS-172) | Reads; writes screening results back as references |
| Transaction events | Recon engine | Reads |
| Alerts, cases, screening results and decisions | **Financial Crime and Compliance** | Holds. Append-only |
| Reports filed with the FRC, CBK or SASRA | The institution | Prepares drafts; never files |

**What this module never stores:** money, and a copy of a sanctions or
PEP list beyond the version screened against, with its date.

**Under each ledger mode** (docs/architecture/README.md §4):

| | Integrated — customer has a core | Native — no core; Fineract is the ledger |
|---|---|---|
| Where funds are posted | The institution's core; this module posts nothing | Kapu Core; this module posts nothing |
| What differs in this module | Customers and transactions read from the core and the recon engine | Customers and transactions read from Kapu Core and the recon engine |
| What the customer must provide | Its reporting officer, its goAML registration, its risk appetite and thresholds (onboarding OB-COM-16) | The same |

## 5 · How it works

```
  onboarding         payment            list update        period end
      |                  |                   |                  |
      v                  v                   v                  v
 +-----------+     +-----------+      +-------------+    +------------+
 | screening |     |  scoring  |      | re-screen   |    |  reports   |
 | FC-05/06  |     |  FC-01/02 |      | all, FC-05  |    | FC-10/11/13|
 +-----------+     +-----------+      +-------------+    +------------+
      |                  |                   |                  |
      +---------+--------+-------------------+                  |
                v                                               |
          +-----------+     decision by the     +-----------+   |
          |   cases   | ----------------------> | STR draft |   |
          |   FC-08   |  reporting officer      |   FC-09   |   |
          +-----------+                         +-----------+   |
                                                      |         |
                                                      v         v
                                           the institution files: goAML,
                                           CBK and SASRA portals
```

A payment that scores above the institution's threshold is held, not
refused, until a person decides; the customer is told through a second
channel. A sanctions match freezes at once and becomes a case.

## 6 · Rails and integrations

| Rail / system | Direction | Feed | Status |
|---|---|---|---|
| UN and domestic sanctions lists (FRC) | in | list file or feed, on each change | Planned (FC-05) |
| PEP and adverse-media data | in | vendor API | Planned (FC-06); no local database exists |
| Safaricom SIM-swap check (Daraja) | in | API, before money moves | Planned (FC-02; rails RL-22) |
| FRC goAML | out, by the institution | report files the reporting officer uploads | Planned (FC-09 to FC-11) |
| CBK and SASRA returns portals | out, by the institution | return files | Planned (FC-13) |
| An institution's existing fraud system | in / out | API | Planned (FC-03) |

## 7 · Regulatory position

- **Custody:** none. It can ask the core to hold a payment; it moves
  nothing.
- **Licence relied on:** the institution's own. It is the reporting
  institution; Dibon is its vendor and processor.
- **Regulators:** the FRC, CBK and SASRA as AML supervisors of the
  institution; ODPC for the personal data screened.
- **Data:** screening results, alerts and cases are Restricted: they reveal
  suspicion about a person. Tipping off a customer is an offence, so a case
  is visible only to the roles that need it.
- **Open legal checks:** FS-098, FS-431.

## 8 · Controls

- **Attribution:** every clearance, escalation and decision to file is
  attributed at the moment it is made.
- **Mandates:** releasing a held payment above a threshold, and clearing a
  sanctions match, need a second person through the mandate engine.
- **Audit:** append-only; a closed case is never rewritten, and every
  report keeps the version of the data and the lists it was made from.
- **Exceptions:** a list that fails to load, or a screening that cannot
  run, says so and blocks the onboarding or payment it guards; it never
  passes by default.

## 9 · Deployment

On the customer's premises or in-country cloud, with the rest of the
platform (FS-032, FS-359). A PEP or adverse-media vendor outside Kenya
would receive names and identifiers: named here once chosen, with its data
class.

## 10 · What it does not do

- File anything. The institution files; we prepare.
- Decide. The reporting officer decides; the module recommends.
- Learn fraud patterns statistically, at first. Rules come first.
- Replace the institution's own risk assessment or policies.

## 11 · Open questions

None open in the register.

## 12 · Sources

- REVIEW.md FS-098, FS-418, FS-421, FS-422, FS-428, FS-431.
- docs/regulation.md: LR-03, LR-09, LR-11, LR-13 to LR-16.
- ESAAMLG mutual evaluation of Kenya, Sep 2022; ML/TF national risk
  assessment, 2021 (sources/regulation/ke/reports/).
- youverify, mobile-money fraud prevention in Kenya, Apr 2026 (controls
  only; its regulatory claims are unverified, FS-422).
- Dibon's M-Pesa reversal technical proposal for KCB, Dec 2022
  (clients/kcb/, *derived, not reproduced*).
