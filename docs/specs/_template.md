---
id: file-name-without-md
name: Component name — build specification
kind: spec
type: build
status: draft
released: unreleased
release: R1
implements: [module-id]
depends_on: [spec-id]
used_by: []
owner: Role, never a name
classification: Internal
review_ids: [FS-627, FS-667]
last_reviewed: 2026-10-15
---

<!--
  A spec says how one component is built (type: build, a service we write)
  or how one product is run (type: component, a product we configure, such
  as Fineract, Keycloak or Grafana). Copy this file; the check tool holds
  every spec to these rules (FS-627):

  - Front matter: every key above. `implements` names modules in
    docs/modules/; `depends_on` and `used_by` name other specs, and agree
    both ways. A spec not yet written is named in the prose, not here.
  - §1 is "Purpose and scope". It ends with a "Where it sits" diagram and a
    "**Related:**" line linking every module and spec in the front matter.
  - The middle sections are the spec's own. Build specs usually have
    Concepts, Rules, States, Interfaces, Security and audit. Component specs
    usually have Version and hosting, Features used and not used, Settings,
    Contracts, Security.
  - Every spec has a "Data" section (what it stores, its class, how long,
    whose personal data), a "Quality and metrics" section (its targets,
    tied to docs/architecture/quality.md, its metrics and alerts), and a
    "Threats" section (STRIDE, and LINDDUN for personal data; SE-16).
  - The last two sections are "Acceptance tests" (build) or "Checks before
    the build" (component), then "Open questions". Every test is a table
    row with an id (A1, K12), so the code can be tagged with it.
  - `status` is draft, agreed, building or built (what each means: Start
    here, "Statuses you will meet"). Once
    agreed, a spec changes only through change enablement
    (docs/service-management/README.md §2), and its version moves:
    patch for wording, minor for behaviour, major for a restructure.
  - Contracts: each build spec's endpoints and events become an OpenAPI
    3.1 and an AsyncAPI 3.0 file with the code; event names come from the
    event bus catalogue (event-bus-kafka.md).
  - Listed in docs/specs/README.md, with a link.

  Diagrams (FS-632): a fence with no language, at most 100 columns. In each
  box, the first line is the component's name in capitals, exactly as the
  components table in docs/specs/README.md names it; the second line is
  what it does, in lower case, a verb; an optional third line says what it
  runs on, in square brackets, in snake case ([kapu_service],
  [apache_fineract]). An arrow's label says what crosses it, as a noun.
-->

# Component name — build specification

One paragraph: what this spec designs, for which release, and from which
sources. While nothing is built, say so: every behaviour here is
**designed**.

## 1 · Purpose and scope

What the component answers, in a sentence.

| Id | Capability | In R1 |
|---|---|---|
| XX-01 | The capability, as its module states it | Yes |

**Out of R1:** what is left out, and where it goes.

**Where it sits.**

```
  +----------------------+              +----------------------+
  | APPROVAL ENGINE      |  approve     | KAPU CORE            |
  | decides              |------------->| records              |
  | [kapu_service]       |  command     | [apache_fineract]    |
  +----------------------+              +----------------------+
```

**Related:** implements [module-id](../modules/module-id.md); depends on
[spec-id](spec-id.md); used by none yet; journeys none yet.

## 2 · Concepts

The terms the rest of the spec uses.

## 3 · Rules

What the component does, rule by rule, each with its capability id and
its source (a regulation, a decision, a customer's requirement).

## 4 · Interfaces

Endpoints, commands and events. Event names follow the event bus spec
once it is written.

## 5 · Security and audit

Who may call it, what is logged, what is never logged.

## 6 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| A record it holds | Confidential | How long, and by which rule | Whose, if any |

## 7 · Quality and metrics

Its targets (availability tier, latency, throughput), its metrics, and
its alerts in observability-grafana §4.

## 8 · Threats

| Threat | For example | The answer |
|---|---|---|
| Spoofing | Someone acts as another | The control that stops it |

## 9 · Acceptance tests

| # | Given | When | Then | Id, source |
|---|---|---|---|---|
| A1 | A starting state | An act | The outcome | XX-01 |

## 10 · Open questions

**For the owner:** questions only Dibon can answer.

**For the customer:** questions for the institution.
