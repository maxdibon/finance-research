---
id: service-management
name: Service management — the ITIL 4 practices we adopt, at our size
kind: plan
version: 0.1.0
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-365, FS-633, FS-639, FS-640, FS-641]
last_reviewed: 2026-10-08
---

# Service management

**What this covers:** which ITIL 4 practices Dibon adopts for the
services it runs for institutions, how, with which tools, and where each
of the others already lives (FS-639, FS-640). This folder holds the
practices written for us; this page maps all of them (FS-641).

ITIL certifies people, not organisations; what an organisation can hold
is ISO/IEC 20000-1 ([compliance](../compliance.md) LC-10), and these
practices are the route to it, and to what banks, CBK's outsourcing
approvals and SASRA's vendor terms will ask: who approves a change, how
an incident is handled, how a problem is fixed for good. Written in our
own words; ITIL's text is not reproduced.

**At our size.** ITIL 4 is a library of 34 practices, not a process to
install. Four people and a rota of three run a few of them properly and
show where the rest already live. Its guiding principles match how we
already work: start where you are, keep it simple and practical,
optimise and automate.

## 1 · The practices, mapped

**Adopted in R1:**

| Practice | Where |
|---|---|
| Incident management | [incident-management.md](incident-management.md): severities, the notification plan, what a notice says, the record and its closure |
| Problem management | [§4 Problems and known errors](#4--problems-and-known-errors) |
| Change enablement | [§2 Change enablement](#2--change-enablement) |
| Release management | Folded into [§2 Change enablement](#2--change-enablement) |
| Service configuration management | [§3 The configuration record](#3--the-configuration-record); [platform-security](../modules/platform-security.md) SE-23 |
| Service level management | [§5 Service levels](#5--service-levels); targets to agree per contract |
| Service request management | [§6 Service requests](#6--service-requests) |

**Already covered elsewhere:**

| Practice | Where |
|---|---|
| Service desk | [The operating model](../operating-model.md): the AI-first desk on Odoo Helpdesk ([business-suite](../modules/business-suite.md) BS-01) |
| Monitoring and event management | [Observability on Grafana](../specs/observability-grafana.md) (RO-16 to RO-18) |
| Service continuity management | [Business continuity](../business-continuity.md); [platform-security](../modules/platform-security.md) SE-20 to SE-25 |
| Information security management | [Platform security](../modules/platform-security.md); ISO 27001 ([compliance](../compliance.md) LC-04) |
| Supplier management | [Partners](../partners.md); suppliers in [business continuity](../business-continuity.md) |
| Service catalogue management | The modules, from [the overview](../overview.md) |
| Service validation and testing | [Testing](../testing.md); each [spec](../specs/README.md)'s acceptance tests |
| Service design, business analysis | [Specs](../specs/README.md); [journeys](../journeys/README.md) |
| Knowledge management | This repository; the desk's knowledge base ([§4](#4--problems-and-known-errors)) |
| Continual improvement | [REVIEW.md](../../REVIEW.md): every point raised, recorded and closed, is the improvement register |
| Measurement and reporting | Grafana for the platform; [insights](../modules/insights.md) for customers |
| Relationship management | [Customers](../customers.md); the service reviews each support tier promises |
| Architecture management | [Architecture](../architecture.md) |
| Deployment management | GitOps and signed images ([platform-security](../modules/platform-security.md) SE-06, SE-12, SE-23) |
| Infrastructure and platform management | [Architecture](../architecture.md) §9; [platform-security](../modules/platform-security.md) |
| Software development and management | The code repository; [testing](../testing.md) |
| Risk management | [Compliance](../compliance.md); [regulation](../regulation.md); threat models ([platform-security](../modules/platform-security.md) SE-16) |
| Workforce and talent management | [The operating model](../operating-model.md) |
| Project, portfolio and strategy management | [The delivery plan](../delivery-plan.md) |

**Later, when the size calls for them:** availability management and
capacity and performance management (SLOs already exist, RO-17; capacity
is checked each night, [end-of-day runner](../specs/end-of-day-runner.md)
C12), IT asset management (laptops under device management today,
SE-14), service financial management, organisational change management.

## 2 · Change enablement

**Three kinds of change** to what we run for institutions:

| Kind | What | Who approves | The customer |
|---|---|---|---|
| Standard | Pre-approved, low risk, done before: a routine patch, a setting within tested bounds, a certificate renewed | No one each time; the kind itself is approved, and listed | Not told, unless they can see it |
| Normal | Everything else: a reviewed pull request | The CTIO, after a second engineer's review | Told before it reaches them, when they can see its effect: these are the release notes the support offer promises |
| Emergency | Restoring service, or closing a security hole | The on-call engineer and the CTIO | Told with the incident; the change reviewed within two working days |

**The change record is the pull request**, with a template: what changes,
why, the risk, how it was tested, how it is undone, which institutions
it reaches, and a label for its kind. Release notes are generated from
the merged pull requests.

**When no change runs** (the change calendar):

- during the night's close, 21:00 to 03:00 Africa/Nairobi
  ([end-of-day runner](../specs/end-of-day-runner.md));
- in the last and first working days of a month;
- in the freeze before a customer's go-live;
- outside the windows agreed with each customer.

The pipeline refuses a deployment in those windows unless the change is
labelled emergency; Odoo Calendar shows the windows to people.

**An institution's own changes** follow the same idea already: a product
version, an approval chain, a transaction rule or a check's class is
maker-checker and effective-dated, and recorded. One model for its
changes and ours.

## 3 · The configuration record

**Generated from the code, never kept by hand**
([platform-security](../modules/platform-security.md) SE-23). For each
institution's instance:

- each component and its version: Fineract, Keycloak, Grafana, GoAlert,
  our services;
- the settings the specs define (for Fineract,
  [kapu-core-fineract](../specs/kapu-core-fineract.md) §4);
- its integrations: rails, banks, the core where it keeps its own;
- its certificates and their expiry dates;
- the ids of its secrets in OpenBao, never their values.

How the components relate is [the specs map](../specs/README.md). The
record is shown on a Grafana dashboard and as a page in the reader. What
runs is compared with the code each night: a difference is drift, and an
alert; a certificate thirty days from expiry is an alert too.

## 4 · Problems and known errors

- **A problem is opened** for every severity 1, and for any incident that
  recurs. It records the cause when found, the workaround meanwhile, and
  the fix that ends it.
- **A known error** is a problem whose cause is known and whose fix is
  not yet in place. Its workaround goes into the desk's knowledge base,
  so the agent and the people on the desk stop escalating the same thing
  twice.
- **Closed** when the fix is released and no incident of its kind has
  recurred for thirty days.

## 5 · Service levels

Each support tier's targets are agreed in the customer's contract; these
are the defaults we propose, by severity
([incident management](incident-management.md) §1):

| Severity | First response to the customer | Updates | Service restored |
|---|---|---|---|
| 1 | 30 minutes, around the clock | Every hour | 4 hours (the tier-1 recovery time, [business continuity](../business-continuity.md)) |
| 2 | 1 hour, or before the customer's working day | Every 4 hours | 1 working day |
| 3 | Next working day | At each change | 5 working days |
| 4 | As the tier says | — | Planned with the customer |

Also in each contract: availability (99.9% asked by Roan Capital, RC-35),
recovery point and time, and the incident notice times
([platform-security](../modules/platform-security.md) §3). **Each target
says how it is measured:** response and restore times from Odoo
Helpdesk's SLA policies; availability from Grafana; both reported at the
service reviews.

## 6 · Service requests

Standard requests, each a Helpdesk request type with who may ask, what
is checked and what the desk may do: a user added or removed, a role
changed, a password or authenticator reset (after re-verification), a
report, a setting within its tested bounds. The access cases follow the
runbooks in [the operating model](../operating-model.md) (FS-505).

## 7 · Tools

| Need | Tool |
|---|---|
| Incidents, problems, requests | Odoo Helpdesk, a ticket type for each |
| Response and restore targets | Odoo Helpdesk's SLA policies, per tier and severity |
| Known errors, the desk's knowledge base | Odoo Knowledge |
| Paging and escalation | GoAlert, proposed ([observability-grafana](../specs/observability-grafana.md) §5) |
| Monitoring, availability, SLOs | Grafana and its stack |
| Change records, release notes | Pull requests, with a template and labels |
| The change calendar | The pipeline's deployment rule; Odoo Calendar for people |
| The configuration record | Generated from GitOps; a Grafana dashboard and a reader page |
| Notices to customers | Odoo email templates |
| A status page for customers (optional) | Gatus (Apache-2.0) or Uptime Kuma (MIT), self-hosted |

**Not bought:** a separate service-management suite (ServiceNow, Jira
Service Management, Freshservice), which would split the record of every
request across two systems and hold customer data outside Kenya. Of the
open-source suites, GLPI is GPL-3.0, which the licence rule allows only
as part of the operating system ([architecture](../architecture.md)
§6.1); iTop and Zammad are allowed but repeat Odoo Helpdesk.

## 8 · Gaps and open items

| Item | Today | Next |
|---|---|---|
| Odoo Enterprise for Dibon's own use: does the agreement cover Helpdesk, Knowledge and Calendar for us, not only customers' instances? | Assumed ([architecture](../architecture.md) §8) | Confirm with Odoo (FS-640) |
| Which GitOps tool: Argo CD or Flux | Not named anywhere | Choose before the configuration record is built |
| The on-call tool | GoAlert proposed | The owner's choice ([observability-grafana](../specs/observability-grafana.md) §9) |
| A status page | None; customers learn of an incident from our notices | Optional; offered first to the Complete tier |
| The pull-request template and the pipeline's change-window rule | Not built | Build with SE-23 |
| Helpdesk ticket types, SLA policies, request types | Not configured | Configure before R1 go-live |
| Service-level targets | Proposed defaults ([§5](#5--service-levels)) | Agree in Roan Capital's contract |
| An ISO/IEC 20000-1 certification body | No KENAS-accredited body found; SGS advertises it ([compliance](../compliance.md) LC-10) | Stay "in line with" until a route is confirmed |
