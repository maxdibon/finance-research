---
id: ids
name: Ids — every numbering scheme, what it numbers and where it lives
kind: register
status: living
released: unreleased
owner: Solution architect
classification: Internal
review_ids: [FS-1053, FS-1100, FS-1131]
last_reviewed: 2026-11-09
---

# Ids

FS-1053. **Every id in these documents, by its prefix:** what it numbers,
where its rows live, its form, and how the next one is taken. In the
reader every id is a link to its row. **An id is never reused,** even
when its row is retired; a retired id says where it went.

## The register and decisions

| Prefix | Numbers | Its rows | Form | The next one |
|---|---|---|---|---|
| FS | Every point raised: a question, a finding, a decision to make | REVIEW.md (open); review/, a file per hundred (closed) | FS-123, FS-1053 | `node -e "console.log(require('./tools/register').nextId('.'))"`, from the real register; never skipped |
| FS, again | A decision's entry: what was chosen and what it cost | decisions.md, under the row's own id | FS-970 | The row it decides |

## What the products do: capabilities

Each module's §3 table, one prefix per module. Form: two letters and two
digits (MF-01). The next one is the module's next number; a retired one
is listed under its table with where it went.

| Prefix | Module | | Prefix | Module |
|---|---|---|---|---|
| AC | access | | MD | mandates |
| BS | business-suite | | MF | mfi |
| CO | collect | | MS | messaging |
| CR | crb | | OC | omni-channel |
| DE | decisioning | | RL | rails |
| ES | escrow | | RO | recon-observability |
| FC | financial-crime | | SC | sacco |
| GW | gateway | | SE | platform-security |
| ID | identity | | SR | sme-recon |
| IN | insights | | KC | core (Kapu Core) |

## Customers, partners and the market

| Prefix | Numbers | Its rows | Form |
|---|---|---|---|
| CU | Customers | customers.md | CU-01 |
| RC | Roan Capital's requirements, from its requirement document | customers/roan-capital.md §2 | RC-01 |
| LF | Lofty Corban's requirements | customers/lofty-corban.md | LF-01 |
| PT | Partners and candidates | partners.md | PT-01 |
| SD | Decisions about partners | partners.md | SD-01 |
| C | Criteria for choosing a partner | partners.md | C1 |
| CP | Competitors | competitors.md | CP-01 |
| JN | Journeys | journeys/README.md, a file each | JN-01 |
| OB | What onboarding needs, by area: OB-COM for every customer, then OB-MF, OB-SC, OB-KC, OB-CO, OB-GW, OB-ES, OB-BS, OB-OC, OB-RO, OB-SR by product | onboarding.md | OB-COM-01 |

## Law, privacy and documents

| Prefix | Numbers | Its rows | Form |
|---|---|---|---|
| LR | Laws and regulations, each with an instrument card | regulation.md; a card each in law/ | LR-03 |
| LQ | Questions for counsel | legal-questions.md | LQ-01 |
| LC | Licences, registrations and certifications | compliance.md | LC-01 |
| PR | Processing of personal data | privacy.md | PR-01 |
| DT | Kinds of document an institution keeps, and for how long | documents.md | DT-01 |
| DR | Documents held with a party: received, sent, worked on | document-register.md | DR-001 |
| TF | Transaction fields: every building block and field of a money movement | transaction-fields.md | TF-01 |
| DC-FS | Our own documents sent outside: DC-FS, then the kind (PF, PR, DK, LT, AG, QN, RP, TM), the type (design-system §7) and a serial; an institution's own documents its code, the kind, the type and a serial (ROAN-POL-ICT-001) | document-register.md, "Our documents"; design-system §7 | DC-FS-QN-ROL-004 |

## Ids that live inside one document

| Form | Numbers | Where |
|---|---|---|
| A1, K1, F1 | A spec's tests, so the code can be tagged with them | The spec's acceptance tests or checks before the build |
| S01 | A component's settings | Its baseline in settings/; a deployment's file uses the same ids |
| T01 | Messages: each template | specs/messaging, the catalogue |
| A1, B1, C1 in a product | A product version's items, by group | Each product draft in products/ |
| B1, P1 | The onboarding pack's templates | templates/onboarding-pack.md |
| G1, N1 | OLP's gaps and our needs of it | reviews/olp-2026-10-26.md; specs/olp.md |
| A1, S1 | A review's findings | Each review in reviews/ |

EX and XX appear only in templates, as placeholders: never a real id.
