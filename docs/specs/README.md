---
id: specs
name: Specifications — how each component is built or run
kind: index
status: living
released: 2026.10.15
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-627, FS-628, FS-632, FS-642, FS-648, FS-667, FS-711, FS-750, FS-792, FS-896, FS-970, FS-973, FS-965, FS-983, FS-985, FS-987, FS-1052, FS-1054, FS-1056, FS-1058, FS-1053, FS-1070, FS-1131, FS-1155, FS-1178, FS-1184, FS-1187]
last_reviewed: 2026-11-11
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

**How they are written** (FS-1054; the template's "Succinct and
complete", back-office the worked example): each thing said once, and
cited elsewhere; one diagram, extended before another is drawn, with a
key when its arrows differ; a rule is one thing that always holds; a
process is one table. How each spec measures up:
[the specs, reviewed](../reviews/specs-2026-10-29.md).

**Names** (FS-1056). One name per component, written in the form each
place allows; the components table below gives each its id:

| Where | Form | For example |
|---|---|---|
| Prose | Plain words | the lending service |
| A diagram's box | Capitals, as the components table names it (FS-632) | LENDING SERVICE |
| What a box runs on | snake_case, in brackets (FS-632) | `[kapu_service]` |
| Identifiers: spec files, Keycloak clients, repositories, images, Kubernetes names | kebab-case, the component's id | `lending-service` |
| Where a hyphen is not allowed: PostgreSQL databases and roles, Odoo modules, metric names | snake_case | `lending_service` |
| Events | `kapu.{domain}.{entity}.{what happened}`, the domain by product (event-bus-kafka §5) | `kapu.mfi.loan.disbursed` |

A product we sell (Kapu MFI, Kapu Sacco) is named in words only: it is a
configuration, never an identifier. A product we run keeps its own name
as its id (`fineract`, `keycloak`). A spec's file may add the product to
the component (`access-keycloak`); the component's id does not.

## The specs

By layer, as [the instance](../architecture/instance.md) is drawn (FS-1053).

**Lending:** what a loan is and how it is decided.

| Spec | Type | What it covers | Implements | Release |
|---|---|---|---|---|
| [lending-service](lending-service.md) | Build | The Kapu lending service: one thin service for MFI and Sacco; what Fineract, Odoo and this service each do; the only writer to the core, through the core adapter; each regulator's rules beside it; the collateral register (§5.2) | mfi, sacco | R1 |
| [product-versions](product-versions.md) | Build | The product version: every term of a product in one signed document, in a vocabulary; drafted by the institution, approved by two, applied to the core; what every system prices from | mfi, sacco | R1 |
| [lender-rules](lender-rules.md) | Build | The CBK lender regulations applied to each loan: the arrears cap, repayment order, pricing, classification, conduct | mfi | R1 |
| [approval-engine](approval-engine.md) | Build | Approval chains, decisions, step-up, and the hand-off to Fineract | mandates | R1 |
| [lending-partners](lending-partners.md) | Build | Partners: the record in two places, relationships with their own limits, the lifecycle, one intake for their data with a consent gate, signed events back; inside the lending service | mfi | phase 2 |
| [deposits-service](deposits-service.md) | Build | The Kapu deposits service: deposit accounts in native mode, each deposit regulator's rules beside it; designed now, built for the first native deposit-taker | core, sacco | R4 |
| [kapu-console](kapu-console.md) | Build | The Kapu Console: approvals, the read-only fallback and products read-only, outside Odoo | mandates | R1 |
| [staff-workspace](staff-workspace.md) | Build | The staff workspace: an institution's staff do their daily lending in our screens inside Odoo, over the lending service; Fineract stays the core, the approval engine decides | business-suite | R1 |

**The ledger and the night:** what is recorded, closed and proved.

| Spec | Type | What it covers | Implements | Release |
|---|---|---|---|---|
| [kapu-core-fineract](kapu-core-fineract.md) | Component | Apache Fineract as Kapu Core: version, features, settings, contracts, restructuring, end of day | core | R1 |
| [end-of-day-runner](end-of-day-runner.md) | Build | The nightly close: checks first, then Fineract's close of business, then ours, watched and escalated | core, recon-observability | R1 |
| [recon](recon.md) | Build | The reconciliation platform: every movement accounted for by count and amount, tracing, auto-correction, and three ledgers that must agree (the master, a shadow, an independent companion) | recon-observability | R1 |

**The back office:** the ERP behind its gateway.

| Spec | Type | What it covers | Implements | Release |
|---|---|---|---|---|
| [back-office](back-office.md) | Build | The back office behind one interface: the jobs our services ask of the ERP, one adapter per ERP, the contract tests, how an institution is ported from one ERP to another, and how more than one edition or version runs | business-suite | R1 |
| [olp](olp.md) | Component | OLP, Dibon's Odoo platform, as Financial Services uses it: which sites run on it, and what Financial Services needs from it (N1 to N14); OLP's own design is OLP's | business-suite | R2 |

**The platform:** what every service stands on.

| Spec | Type | What it covers | Implements | Release |
|---|---|---|---|---|
| [access-keycloak](access-keycloak.md) | Component | Keycloak as access: four realms, levels of authentication and step-up, roles granted by mandate, sign-in for every service | access | R1 |
| [event-bus-kafka](event-bus-kafka.md) | Component | Kafka as the event bus: the CloudEvents envelope, signing and the audit chain, one catalogue of event names, delivery rules | recon-observability | R1 |
| [messaging](messaging.md) | Build | The messaging service and the R1 template catalogue: what each event sends, to whom, with which fields, and who approves the words | messaging | R1 |
| [transactions](transactions.md) | Build | The transaction model: one money movement as every component means it; a header fixed at creation, a body fixed at approval, a footer only appended to; kinds, links, ids, aliases, versions and the standards they follow; its field dictionary and schema | rails, recon-observability, core | R1 |
| [rails](rails.md) | Build | The rails: one interface for every payment rail and bank, an adapter per rail behind it; what is approved is what is sent, unknown a state, callbacks proved, money arriving minted; written on the transaction model | rails | R1 |
| [observability-grafana](observability-grafana.md) | Component | Grafana and its stack: metrics, logs, dashboards, alerts, and the on-call rota that takes a phone call | recon-observability | R1 |
| [vault](vault.md) | Build | The document vault: every document carrying personal data, one vault per institution; checked and scanned on arrival, never changed, encrypted under the institution's keys, every read logged, out only by link, deleted when its retention ends | identity | R1 |

**Our own tools:** how we work.

| Spec | Type | What it covers | Implements | Release |
|---|---|---|---|---|
| [github](github.md) | Component | GitHub: the organisation, teams and roles, rulesets on main, code owners, push rulesets, Actions with runners in Kenya, secrets from OpenBao, deploys by pull request and the change calendar, planning in Projects; plans checked | platform-security | R1 |
| [endpoints](endpoints.md) | Component | Devices and their protection: the rule that no customer data lives on a device, baselines by class, two tiers (Sophos and Intune through Liquid, or our own on Wazuh), a lost laptop | platform-security | R1 |

**To write, in the order R1 needs them:** customer pages (more now waits on them: the investor portal, a reversed payment's position shown to its customer, a payout waiting for float; FS-1187) (consents, signing, statements, without the app); odoo (Sign, HR, Helpdesk, Project, the general-ledger summaries).

**To write before an institution moves onto Dibon's device-management
service** (endpoints §4, FS-1178): device-management, a component spec of
what this project needs from that service, as olp is for OLP: a tenant
per institution, its data in Kenya; enrolment and wipe driven by our
people records and access; a compliance signal for sign-in and step-up;
work profiles for staff's own phones, and iPhones covered too; no
location tracking on institutions' staff phones; the console protected
as endpoints §4 says; and the checks to run before an institution
relies on it.

## How they connect

The table below
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
| approval-engine | rails | An approved payment's content hash; nothing is sent without it (RL-01) |
| every spec | event-bus-kafka | Event names, the envelope and signing (RO-23) |
| kapu-core-fineract | recon | Postings and signed checkpoints, as events; balances read by API; recon never writes back |
| recon | end-of-day-runner | The intake and break checks (C3 to C6, P5) and the morning's breaks and match rate |
| recon | approval-engine | Reads approvals, to compare them with the ledger; reversals go back through the engine |
| messaging | back-office | Signature requests and consents, by our references; signatures completed and consents changed come back as events |
| recon | back-office | Tickets for breaks and exceptions, by our references (recon's extensions) |
| back-office | access-keycloak | Service accounts for its callers; staff sign in to the ERP through access |
| staff-workspace | approval-engine | A person's open steps and their decisions, with step-up |
| staff-workspace | access-keycloak | Staff sign-in, and the person's token for each call (token exchange) |
| staff-workspace | lending-service | Reads and commands, as the person |
| kapu-console | lending-service | Read-only views, as the person |
| kapu-console | approval-engine | Decisions, with step-up |
| lending-service | kapu-core-fineract | Postings and settings, through the core adapter, as the writer of loans (one writer per kind of account, lending-service rule 2) |
| lending-service | approval-engine | Requests to decide; acts only on the engine's yes |
| lending-service | lender-rules | Every rule a loan or product is checked against |
| lending-service | back-office | Leads, signatures, tickets |
| lending-service | deposits-service | Members' deposits and shares, read live |
| deposits-service | kapu-core-fineract | Deposit postings, through the core adapter |
| deposits-service | approval-engine | Money out, where the product asks |

## Components

Every box in a spec's diagram is named as this table names it (FS-632);
its id is how the component is named wherever a name is an identifier
("Names", above).

| Name in diagrams | What it is | Runs on | Id | Spec |
|---|---|---|---|---|
| APPROVAL ENGINE | Decides whether an act may happen | `[kapu_service]` | `approval-engine` | [approval-engine](approval-engine.md) |
| LENDER RULES | Applies the lender regulations to each loan, inside the lending service (FS-629) | `[kapu_service]` | `lender-rules` | [lender-rules](lender-rules.md) |
| LENDING SERVICE | Lends for MFI and Sacco: applications, collateral, vetting, product versions; the writer of loans to the core | `[kapu_service]` | `lending-service` | [lending-service](lending-service.md) |
| KAPU MFI | The lending service configured for lenders, with lender rules beside it | `[kapu_service]` | — (a configuration of `lending-service`) | [lending-service](lending-service.md) |
| DEPOSITS SERVICE | Keeps deposit accounts in native mode | `[kapu_service]` | `deposits-service` | [deposits-service](deposits-service.md) |
| CORE ADAPTER | One interface to the core: Kapu Core, or the institution's own | `[kapu_service]` | `core-adapter` | [lending-service](lending-service.md) |
| KAPU CONSOLE | Approvals, the read-only fallback, products read-only, outside Odoo | `[kapu_service]` | `kapu-console` | [kapu-console](kapu-console.md) |
| CUSTOMER PAGES | Borrowers' and members' own pages: consents, signing, statements | `[kapu_service]` | `customer-pages` | to write |
| VAULT | Keeps every document carrying personal data: signed documents and their evidence | `[kapu_service]` | `vault` | [vault](vault.md) |
| KAPU CORE | The ledger: clients, loans, the general ledger, close of business | `[apache_fineract]` | `fineract` | [kapu-core-fineract](kapu-core-fineract.md) |
| END-OF-DAY RUNNER | Closes the business day: checks, runs, watches, escalates | `[kapu_service]` | `end-of-day-runner` | [end-of-day-runner](end-of-day-runner.md) |
| OBSERVABILITY | Metrics, logs, traces, dashboards and alert rules | `[grafana]` | `grafana` | [observability-grafana](observability-grafana.md) |
| ON-CALL | Rotas, escalation, phone calls and acknowledgement | `[goalert]` | `goalert` | [observability-grafana](observability-grafana.md) |
| ACCESS | Sign-in, roles, step-up | `[keycloak]` | `keycloak` | [access-keycloak](access-keycloak.md) |
| EVENT BUS | Carries signed events between services | `[kafka]` | `kafka` | [event-bus-kafka](event-bus-kafka.md) |
| RAILS | Sends and receives money on M-Pesa and banks | `[kapu_service]` | `rails` | [rails](rails.md) |
| MESSAGING | SMS, WhatsApp and email to people | `[kapu_service]` | `messaging` | [messaging](messaging.md) |
| TREASURY | Each book's positions, forecast, float, funding and investments, and its regulator's rulebook | `[kapu_service]` | `treasury` | to write (treasury module) |
| RECONCILIATION | Matches the ledger with the rails, proves completeness, compares the three ledgers | `[kapu_service]` | `recon` | [recon](recon.md) |
| SHADOW LEDGER | Rebuilds the master's ledger from its postings, near real time, in memory | `[kapu_service]` | `shadow-ledger` | [recon](recon.md) |
| COMPANION LEDGER | Computes, on its own, what every account should hold, from the source events and the product's terms | `[kapu_service]` | `companion-ledger` | [recon](recon.md) |
| BACK-OFFICE GATEWAY | Offers the back office's jobs to our services, through one adapter per ERP | `[kapu_service]` | `back-office-gateway` | [back-office](back-office.md) |
| STAFF WORKSPACE | Staff's screens for daily lending, inside Odoo, over the lending service | `[odoo]` | `staff-workspace` | [staff-workspace](staff-workspace.md) |
| ODOO | Back office: signing, HR, helpdesk, general-ledger summaries; the first ERP behind the gateway | `[odoo]` | `odoo` | [back-office](back-office.md) |
| OTHER BACK OFFICE | Any ERP or tool behind the gateway but Odoo: a candidate edition, or a second product in a composite one | `[erp]` | — (each edition its product's) | [back-office](back-office.md) |
| OLP | Runs Odoo sites: provisioning, add-ons, staging, backups, upgrades; Dibon's, with its own roadmap | `[olp]` | `olp` | [olp](olp.md) |
| DATABASE | PostgreSQL, one per service | `[postgresql]` | `postgresql` | — |
| OBJECT STORAGE | Keeps the vault's files and Odoo's filestore, versioned, locked and replicated | `[ceph_or_blob]` | `object-storage` | [vault](vault.md) §9 |
| OPENBAO | Keeps every key and secret; signs and wraps inside it | `[openbao]` | `openbao` | — |
| SCANNER | Scans every upload for malware, a separate service | `[clamav]` | `clamav` | [vault](vault.md) |
| M-PESA | Safaricom's mobile money | `[rail]` | — (not ours) | — |
| BANKS | The institution's banks | `[rail]` | — (not ours) | — |
| TWILIO | Places the on-call phone calls and SMS | `[partner]` | — (not ours) | — |
| DEVICE | A staff laptop or phone | `[endpoint]` | — | [endpoints](endpoints.md) |
| DEVICE MANAGEMENT | Enrols devices, sets and checks their policy | `[intune_or_fleet]` | — (bought) | [endpoints](endpoints.md) |
| ENDPOINT PROTECTION | Blocks malware and reports what happens on a device | `[sophos_or_wazuh]` | — (bought) | [endpoints](endpoints.md) |
| MANAGED DETECTION | Watches devices and servers, isolates a threat | `[sophos_mdr_or_wazuh]` | — (bought) | [endpoints](endpoints.md) |
| BASTION | People's only way in to servers and databases, sessions recorded | `[warpgate]` | `warpgate` | [endpoints](endpoints.md) |
| GITHUB | Code, documents, reviews, planning and pipelines | `[github]` | — (not ours) | [github](github.md) |
| RUNNER | Runs workflow jobs that hold a secret, in Kenya | `[actions_runner]` | `actions-runner` | [github](github.md) |
| HARBOR | Keeps signed images, a copy at each site | `[harbor]` | `harbor` | [github](github.md) |
| FLUX | Applies the manifests to each cluster | `[flux]` | `flux` | [github](github.md) |
