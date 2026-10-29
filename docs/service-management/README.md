---
id: service-management
name: Service management — the ITIL 4 practices we adopt, at our size
kind: plan
status: living
law: LR-03
released: 2026.10.16
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-365, FS-633, FS-639, FS-640, FS-641, FS-645, FS-688, FS-695, FS-701, FS-703, FS-747, FS-750, FS-753, FS-756, FS-757, FS-780, FS-896, FS-1046, FS-1050]
last_reviewed: 2026-10-29
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

Each practice has an owner, a role from
[ways of working](ways-of-working.md) §1: as ITIL 4 has it, the role
answerable for how well the practice works (FS-756).

**Adopted in R1:**

| Practice | Where | Practice owner |
|---|---|---|
| Incident management | [incident-management.md](incident-management.md): severities, the notification plan, what a notice says, the record and its closure | Operations lead |
| Roles, pull requests, architecture review and change authority | [ways-of-working.md](ways-of-working.md): who approves what, how a change is made, the rules that stand in for review boards | Team lead |
| Problem management | [§4 Problems and known errors](#4--problems-and-known-errors) | Operations lead |
| Change enablement | [§2 Change enablement](#2--change-enablement) | Operations lead, the change authority |
| Release management | Folded into [§2 Change enablement](#2--change-enablement) | Engineering lead |
| Service configuration management | [§3 The configuration record](#3--the-configuration-record); [platform-security](../modules/platform-security.md) SE-23 | Operations lead |
| Service level management | [§5 Service levels](#5--service-levels); targets to agree per contract | Product owners |
| Service request management | [§6 Service requests](#6--service-requests) | Operations lead |

**Already covered elsewhere:**

| Practice | Where | Practice owner |
|---|---|---|
| Service desk | [The operating model](../operating-model.md): the AI-first desk on Odoo Helpdesk ([business-suite](../modules/business-suite.md) BS-01) | Operations lead |
| Monitoring and event management | [Observability on Grafana](../specs/observability-grafana.md) (RO-16 to RO-18) | Operations lead |
| Service continuity management | [Business continuity](../business-continuity.md); [platform-security](../modules/platform-security.md) SE-20 to SE-25 | Operations lead, with the security lead |
| Information security management | [Platform security](../modules/platform-security.md); ISO 27001 ([compliance](../compliance.md) LC-04) | Security lead |
| Supplier management | [Partners](../partners.md); suppliers in [business continuity](../business-continuity.md) | Commercial lead |
| Service catalogue management | The modules, from [the overview](../overview.md) | Product owners |
| Service validation and testing | [Testing](../testing.md); each [spec](../specs/README.md)'s acceptance tests | Engineering lead |
| Service design, business analysis | [Specs](../specs/README.md); [journeys](../journeys/README.md) | Solution architect |
| Knowledge management | This repository; the desk's knowledge base ([§4](#4--problems-and-known-errors)) | Team lead |
| Continual improvement | [REVIEW.md](../../REVIEW.md): every point raised, recorded and closed, is the improvement register | Team lead |
| Measurement and reporting | Grafana for the platform; [insights](../modules/insights.md) for customers | Operations lead |
| Relationship management | [Customers](../customers.md); the service reviews each support tier promises | Delivery lead for customers; commercial lead for partners |
| Architecture management | [Architecture](../architecture/README.md) | Solution architect |
| Deployment management | GitOps and signed images ([platform-security](../modules/platform-security.md) SE-06, SE-12, SE-23) | Operations lead |
| Infrastructure and platform management | [Architecture](../architecture/README.md) §9; [platform-security](../modules/platform-security.md) | Operations lead |
| Software development and management | The code repository; [testing](../testing.md) | Engineering lead |
| Risk management | [Compliance](../compliance.md); [regulation](../regulation.md); threat models ([platform-security](../modules/platform-security.md) SE-16) | Compliance and risk officer |
| Workforce and talent management | [The operating model](../operating-model.md) | Team lead |
| Project, portfolio and strategy management | [The delivery plan](../delivery-plan.md) | Team lead |

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
| Normal | Everything else: a reviewed pull request | The operations lead, after a peer's review; with the security lead for a security control (ways-of-working §4) | Told before it reaches them, when they can see its effect: these are the release notes the support offer promises |
| Emergency | Restoring service, or closing a security hole | The on-call engineer with the operations lead, or the security lead for a security hole (ways-of-working §4) | Told with the incident; the change reviewed within two working days |

**The change record is the pull request** on GitHub (FS-896), with a template: what changes,
why, the risk, how it was tested, how it is undone, which institutions
it reaches, and a label for its kind. Release notes are generated from
the merged pull requests.

**When no change runs** (the change calendar):

- during the night's close, 21:00 to 03:00 Africa/Nairobi
  ([end-of-day runner](../specs/end-of-day-runner.md));
- in the last and first working days of a month;
- in the freeze before a customer's go-live;
- outside the windows agreed with each customer.

Flux pauses in those windows, and a check refuses a deploy pull request
inside one unless it is labelled emergency (docs/specs/github.md §4.5); Odoo Calendar shows the windows to people.

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
  [kapu-core-fineract](../specs/kapu-core-fineract.md) §4), and until it
  is generated, each deployment's page, §3 (deployments, FS-1046);
- its integrations: rails, banks, the core where it keeps its own;
- its certificates and their expiry dates;
- the ids of its secrets in OpenBao, never their values.

**What each setting should be** is each component's baseline, in
[settings](../settings/README.md), and each deployment's file beside its
page (FS-1050): the record says what runs, the baseline what should, and
the nightly comparison the difference. How the components relate is [the specs map](../specs/README.md). The
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
report, a setting within its tested bounds, and **access for a Dibon
engineer**: against a ticket, scoped and expiring, approved by the
institution where it runs its own operations, and entered in the access
register ([architecture](../architecture/README.md) §9, SE-26). The access cases follow the
runbooks in [the operating model](../operating-model.md) (FS-505).

**An institution's customers' complaints are the institution's** (FS-688):
it decides them, and it speaks to its customer. Under the Data Protection
Act it is the controller and we its processor. What we give it:

| Support | What it is |
|---|---|
| Tooling, in R1 | The complaints register in Odoo Helpdesk with the lender regulations' clocks (48 hours, 7 days, 30 days, reg 40), warnings before each, the acknowledgement and resolution messages (messaging T16, T17), and the record CBK requires ([lender-rules](../specs/lender-rules.md) §2.8, mfi MF-28) |
| Evidence on request | Within the time the support tier sets: the transaction's verifiable journey (recon RO-25), statements, approvals, message delivery logs, who did what and when |
| Procedure and training | A complaint-handling procedure for the institution's runbook, and a module in [training](../training/README.md) |
| Second line | A complaint that turns on how the platform behaved becomes a ticket to us at its severity; we investigate and give the institution the findings for its answer |
| Never | We never decide a complaint, and never contact the customer for the institution |
| An option, under Operated | Dibon runs the first line: logs, acknowledges, gathers the evidence; the institution decides. The lender regulations allow it but not the determination of compliance (reg 31): 30 days' notice to CBK, and the institution stays liable |

## 7 · Tools

| Need | Tool |
|---|---|
| Incidents, problems, requests | Odoo Helpdesk, a ticket type for each |
| Response and restore targets | Odoo Helpdesk's SLA policies, per tier and severity |
| Known errors, the desk's knowledge base | Odoo Knowledge |
| Paging and escalation | GoAlert, proposed ([observability-grafana](../specs/observability-grafana.md) §5) |
| Monitoring, availability, SLOs | Grafana and its stack |
| Code, change records, release notes, stories | GitHub Team, runners in Kenya: pull requests with a template and labels, issues and Projects (FS-896) |
| The change calendar | The pipeline's deployment rule; Odoo Calendar for people |
| The configuration record | Generated from GitOps (Flux, pulling from GitHub); a Grafana dashboard and a reader page |
| Notices to customers | Odoo email templates |
| A status page for customers (optional) | Gatus (Apache-2.0) or Uptime Kuma (MIT), self-hosted |

### Whose record each is, and the link between them

Two sets of records: Dibon's, for the platform and for institutions'
requests to us; and each institution's own, in its own Odoo, for its
customers and staff (FS-780). Neither copies the other; each names the
other's reference.

| Practice | Dibon's record | The institution's record | The link |
|---|---|---|---|
| Incidents | Dibon's Odoo Helpdesk, one ticket per incident ([incident management](incident-management.md)); paging in GoAlert; Grafana | Its outage log and fallback runbook (handbook HB-70 to HB-78) | Our notices by phone and email; the incident's reference on both sides |
| Requests and questions | Dibon's Helpdesk, a ticket type each (§6) | Its own Helpdesk for its customers; the morning's ticket (JN-17) | Its staff raise a ticket to us, carrying its own ticket's reference, never its customers' data (rules for institutions 4) |
| Problems and known errors | A problem ticket in Dibon's Helpdesk (§4); the fix a GitHub issue and pull request, each naming the other; known errors in Dibon's Odoo Knowledge | — | Release notes name the problems fixed; the service review goes through them |
| Changes and releases | GitHub: pull requests, approvals, the deploy repository, the change calendar's check, release notes (§2) | Its own changes (positions, approval chains, products) through the approval engine, by maker-checker | Release notes to each institution; its handbook reviewed with each release (handbook rule 4) |
| Knowledge | Design: this repository and its reader. Engineering runbooks: GitHub, beside the code. The desk: Dibon's Odoo Knowledge | Its handbook, in its Knowledge or the reader (FS-772); training | One source each, published, never copied by hand |
| Configuration | Generated from GitOps (§3) | Its settings, with their history in the approval engine | The configuration record lists both |
| Access | Dibon's access register; the central Keycloak as code (FS-777) | Its Keycloak realm, Odoo's Employees app, the quarterly review (HB-27) | Compared each month (SE-26) |
| Complaints | None: we never decide one | Its complaints register (JN-08) | One about how the platform behaved becomes a ticket to us (§6) |

**The bridge, in R1:** the institution's staff are portal users of
Dibon's Odoo, which needs no licence (FS-026), and raise tickets there,
with email to our desk as the fallback. Each ticket carries the
institution's own reference, and ours goes back into its ticket. The two
Odoos are not connected by API in R1; a connection that mirrors status
both ways can come later.

**Not bought:** a separate service-management suite (ServiceNow, Jira
Service Management, Freshservice), which would split the record of every
request across two systems and hold customer data outside Kenya. Of the
open-source suites, GLPI is GPL-3.0, which the licence rule allows only
as part of the operating system ([architecture](../architecture/README.md)
§6.1); iTop and Zammad are allowed but repeat Odoo Helpdesk.

## 8 · Gaps and open items

| Item | Today | Next |
|---|---|---|
| Odoo Enterprise for Dibon's own use: does the agreement cover Helpdesk, Knowledge and Calendar for us, not only customers' instances? | Assumed ([architecture](../architecture/README.md) §8) | Confirm with Odoo (FS-640) |
| The on-call tool | GoAlert proposed | The owner's choice ([observability-grafana](../specs/observability-grafana.md) §12) |
| A status page | None; customers learn of an incident from our notices | Optional; offered first to the Complete tier |
| The pull-request template and the pipeline's change-window rule | Not built | Build with SE-23 |
| Helpdesk ticket types, SLA policies, request types | Not configured | Configure before R1 go-live |
| The bridge from an institution's Helpdesk to ours | Portal and email in R1 (§7) | Its staff's portal accounts set up at onboarding; an API connection later (FS-780) |
| Service-level targets | Proposed defaults ([§5](#5--service-levels)) | Agree in Roan Capital's contract |
| The bastion that records engineers' sessions where Dibon runs the instance | Warpgate to evaluate; Teleport's community edition is no longer open source ([technology](../architecture/technology.md)) | Evaluate before R1 go-live (FS-645, FS-695) |
| An ISO/IEC 20000-1 certification body | No KENAS-accredited body found; SGS advertises it ([compliance](../compliance.md) LC-10) | Stay "in line with" until a route is confirmed |

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](../law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 31 | reg 31 | Material services may be outsourced, but never the final decision to lend, management and control, the board's decisions, determining compliance with the law (31(1)(d)), or managing the loan book; the lender stays liable for its provider; the Central Bank told thirty days before, with the provider's background, owners and directors (31(3)); the contract gives the Central Bank oversight of, and access to, the provider's premises, books, records, systems and staff (31(5)) |
| reg 40 | reg 40 | A complaints mechanism made known to customers; acknowledgement within seven days where a complaint cannot be dealt with promptly; an oral complaint unresolved after forty-eight hours confirmed in writing; resolution within thirty days |
