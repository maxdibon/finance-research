---
id: specs
name: Specifications — how each component is built or run
kind: index
version: 0.1.0
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-627, FS-628, FS-632, FS-642, FS-648]
last_reviewed: 2026-10-08
---

# Specifications

**What this is:** one file per component, saying how it is built or run
(FS-627). A module says what a product does for a customer; a journey
walks what a person goes through; a spec says how one component does its
part, precisely enough to build and test it.

**Two kinds:**

- **Build specs** design a service we write: its rules, states,
  interfaces and acceptance tests.
- **Component specs** say how we run a product we configure: the version,
  the features we use and do not, the settings, the contracts with the
  services around it, and the checks to run on a working instance before
  the build relies on it.

**Rules for these files** (the check tool enforces them): the front matter
and sections of [the template](_template.md); `depends_on` and `used_by`
agree both ways; §1 ends with a "Where it sits" diagram and a Related line
linking every module and spec it names; every box in a diagram is named
as the components table below names it.

## The specs

| Spec | Type | What it covers | Implements | Release |
|---|---|---|---|---|
| [approval-engine](approval-engine.md) | Build | Approval chains, decisions, step-up, and the hand-off to Fineract | mandates | R1 |
| [lender-rules](lender-rules.md) | Build | The CBK lender regulations applied to each loan: the arrears cap, repayment order, pricing, classification, conduct | mfi | R1 |
| [kapu-core-fineract](kapu-core-fineract.md) | Component | Apache Fineract as Kapu Core: version, features, settings, contracts, restructuring, end of day | core | R1 |
| [end-of-day-runner](end-of-day-runner.md) | Build | The nightly close: checks first, then Fineract's close of business, then ours, watched and escalated | core, recon-observability | R1 |
| [observability-grafana](observability-grafana.md) | Component | Grafana and its stack: metrics, logs, dashboards, alerts, and the on-call rota that takes a phone call | recon-observability | R1 |
| [messaging](messaging.md) | Build | The messaging service and the R1 template catalogue: what each event sends, to whom, with which fields, and who approves the words | messaging | R1 |
| [access-keycloak](access-keycloak.md) | Component | Keycloak as access: four realms, levels of authentication and step-up, roles granted by mandate, sign-in for every service | access | R1 |

**To write, in the order R1 needs them:** event-bus-kafka (the envelope, signing and one catalogue of event names);
odoo (Sign, HR, Helpdesk, Project, the general-ledger summaries);
rails (M-Pesa and bank instructions, their lifecycle and signing).

## How they connect

RAILS and EVENT BUS have specs still to write; the table below
says what crosses each line.

```
                   +-------------------+
                   | ACCESS            |
                   | signs in, steps up|
                   | [keycloak]        |
                   +-------------------+
    roles, step-up  ^                 ^ OAuth
                    |                 |
  +-------------------+             +-------------------+             +-------------------+
  | APPROVAL ENGINE   |------------>| KAPU CORE         |<------------| LENDER RULES      |
  | decides           | approve,    | records           | waivers,    | corrects          |
  | [kapu_service]    | reject      | [apache_fineract] | settings    | [kapu_service]    |
  +-------------------+             +-------------------+             +-------------------+
      |                                 |           ^                       ^ classification,
      | approved, hashed                | events    | close of business,    | cap, sweep
      |                                 |           +-------------------+   |
      v                                 v             business date     |   |
  +-------------------+             +-------------------+             +-------------------+
  | RAILS             |------------>| EVENT BUS         |             | END-OF-DAY RUNNER |
  | pays              | events      | carries events    |             | closes the day    |
  | [kapu_service]    |             | [kafka]           |             | [kapu_service]    |
  +-------------------+             +-------------------+             +-------------------+
                                                                          | run status, failures
                                                                          v
                                                                      +-------------------+
                                                                      | OBSERVABILITY     |
                                                                      | watches, alerts   |
                                                                      | [grafana]         |
                                                                      +-------------------+
```

| From | To | What crosses |
|---|---|---|
| approval-engine | kapu-core-fineract | Approve, reject and withdraw commands; staff lose those permissions in Fineract (approval-engine §9) |
| lender-rules | kapu-core-fineract | The repayment order as a product setting, waivers, the non-performing setting, restructuring (kapu-core-fineract §6) |
| end-of-day-runner | kapu-core-fineract | The business date moved, close of business started and watched |
| end-of-day-runner | lender-rules | Classification, the cap and the sweep, run after Fineract's close |
| end-of-day-runner | observability-grafana | The run's metrics and failures, routed by severity |
| approval-engine | access-keycloak | Roles resolved to people (MD-04); step-up at each decision (MD-10) |
| kapu-core-fineract | access-keycloak | Sign-in by OAuth, the service account, read-only staff roles |
| approval-engine | rails (to write) | An approved payment's content hash; nothing is sent without it (RL-01) |
| every spec | event-bus-kafka (to write) | Event names, the envelope and signing (RO-23) |

## Components

Every box in a spec's diagram is named as this table names it (FS-632).

| Name in diagrams | What it is | Runs on | Spec |
|---|---|---|---|
| APPROVAL ENGINE | Decides whether an act may happen | `[kapu_service]` | [approval-engine](approval-engine.md) |
| LENDER RULES | Applies the lender regulations to each loan, inside Kapu MFI (FS-629) | `[kapu_service]` | [lender-rules](lender-rules.md) |
| KAPU MFI | The lending product's own service: applications, collateral, vetting | `[kapu_service]` | — |
| KAPU CORE | The ledger: clients, loans, the general ledger, close of business | `[apache_fineract]` | [kapu-core-fineract](kapu-core-fineract.md) |
| END-OF-DAY RUNNER | Closes the business day: checks, runs, watches, escalates | `[kapu_service]` | [end-of-day-runner](end-of-day-runner.md) |
| OBSERVABILITY | Metrics, logs, traces, dashboards and alert rules | `[grafana]` | [observability-grafana](observability-grafana.md) |
| ON-CALL | Rotas, escalation, phone calls and acknowledgement | `[goalert]` | [observability-grafana](observability-grafana.md) |
| ACCESS | Sign-in, roles, step-up | `[keycloak]` | [access-keycloak](access-keycloak.md) |
| EVENT BUS | Carries signed events between services | `[kafka]` | to write |
| RAILS | Sends and receives money on M-Pesa and banks | `[kapu_service]` | to write |
| MESSAGING | SMS, WhatsApp and email to people | `[kapu_service]` | [messaging](messaging.md) |
| RECONCILIATION | Matches the ledger with the rails | `[kapu_service]` | — (recon-observability) |
| ODOO | Back office: signing, HR, helpdesk, general-ledger summaries | `[odoo]` | to write |
| DATABASE | PostgreSQL, one per service | `[postgresql]` | — |
| M-PESA | Safaricom's mobile money | `[rail]` | — |
| BANKS | The institution's banks | `[rail]` | — |
| TWILIO | Places the on-call phone calls and SMS | `[partner]` | — |
