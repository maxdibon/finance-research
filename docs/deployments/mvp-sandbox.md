---
id: deployment-mvp-sandbox
name: The MVP sandbox — public Azure, made-up data only
kind: register
status: living
law: LR-17
released: unreleased
owner: Solution architect
classification: Internal
review_ids: [FS-1037]
last_reviewed: 2026-10-27
---

# The MVP sandbox

Where the team builds the MVP (FS-929, FS-932; the MVP day). Its code is
code/platform/azure-sandbox; what it makes is in that README.

## 1 · The deployment

| | |
|---|---|
| Institution | None: Roan Capital's products configured with made-up data only |
| Environment | Sandbox |
| Sites | One: public Azure, South Africa North; Azure has no region in Kenya, so nothing real goes here |
| Who runs it | Dibon's platform workstream; each person their own group |
| Availability | None: rebuilt from code; personal and workstream groups removed at the end of the day |
| Release | The MVP day, Friday 30 October (FS-962) |
| Go-live | Not applicable |

## 2 · Components

| Component | Deployed | Version | Namespace | Database (cluster) | Replicas | Spec or module |
|---|---|---|---|---|---|---|
| EDGE | No: the cluster's own ingress only | — | — | — | — | platform-security |
| KAPU CONSOLE | No: after the MVP | — | — | — | — | kapu-console |
| STAFF WORKSPACE | No: after the MVP | — | — | — | — | staff-workspace |
| CUSTOMER PAGES | No: the borrower signs in Odoo Sign | — | — | — | — | to write |
| LENDING SERVICE | No: the walk-through keys into Kapu Core | — | — | — | — | lending-service |
| DEPOSITS SERVICE | No | — | — | — | — | deposits-service |
| CORE ADAPTER | No | — | — | — | — | lending-service |
| BACK-OFFICE GATEWAY | No | — | — | — | — | back-office |
| VAULT | No | — | — | — | — | identity ID-15 |
| APPROVAL ENGINE | No | — | — | — | — | approval-engine |
| LENDER RULES | No | — | — | — | — | lender-rules |
| END-OF-DAY RUNNER | No | — | — | — | — | end-of-day-runner |
| RAILS | Yes, a stand-in: the bank payout instruction and M-Pesa's sandbox (FS-943) | MVP | services | — | 1 | rails |
| RECONCILIATION | No: a stretch | — | — | — | — | recon |
| FLOWZA | No | — | — | — | — | messaging §5 |
| MESSAGING | No | — | — | — | — | messaging |
| IDENTITY | No | — | — | — | — | identity |
| KAPU CORE | Yes, with Biashara configured (FS-941) | Apache Fineract 1.15.x | services | Ledger: fineract | 1 | kapu-core-fineract |
| ODOO | Yes: CRM, Sign, Helpdesk, Employees (FS-945, FS-946) | Enterprise | services | Back office: odoo | 1 | business-suite |
| ACCESS | Yes: the staff realm, Roan Capital's positions as roles (FS-942) | Keycloak 26.x | services | Access: keycloak | 1 | access-keycloak |
| EVENT BUS | No | — | — | — | — | event-bus-kafka |
| DATABASE | Yes: one each for Fineract, Keycloak and Odoo | PostgreSQL | data | Ledger, Access, Back office | 1 | architecture instance |
| OBJECT STORAGE | Yes, Azure Blob, for Odoo's files | Azure | data | — | 1 | identity ID-15 |
| OPENBAO | No: sandbox credentials in the cluster's own store | — | — | — | — | architecture README §6 |
| OBSERVABILITY | No | — | — | — | — | observability-grafana |

## 3 · Diagrams

The MVP day's own (docs/mvp-day.md): GitHub, then the sandbox and its
cluster, Flux, Kapu Core and Biashara, the payout by bank, the
walk-through, with Keycloak and Odoo beside.

## 4 · Integrations

| Integration | What for | Whose agreement | Credentials | Status |
|---|---|---|---|---|
| M-Pesa, Daraja sandbox | The repayment in the walk-through | Dibon's developer account | Sandbox only, in the cluster | To set up on the day |
| GitHub | The code, and Flux following the platform repository | Dibon's organisation (FS-952) | Dibon's | Before the day |

## 5 · Continuity

| | |
|---|---|
| Recovery objectives | None: rebuilt from code |
| Backups | None; the OpenTofu state is versioned (rg-tfstate) |
| Restore tested | Not applicable |
| Failover tested | Not applicable |
| Runbooks | None; the sandbox README |
| The institution's fallback | Not applicable |
| Who is called | The platform workstream |

## 6 · Access

Every member reads every group; each changes their own; the platform
workstream changes the MVP environment (the sandbox README). Sign-in
through Entra; Claude never signs in for anyone.

## 7 · Data

Made-up data only: no customer, borrower or staff data (rules, Dibon 1;
privacy, "In Kenya"). Nothing in the privacy register applies.

## 8 · Licences and suppliers

| Licence or supplier | What for | Count or terms | Whose | Status |
|---|---|---|---|---|
| Azure | The sandbox | A budget per group, alerting at 50%, 80% and 100% | Dibon's subscription (FS-938) | To set up |
| Odoo Enterprise | Sign, Helpdesk, Employees in the walk-through | Through the partner account | Dibon's | Before the day |

## 9 · Size

One small cluster, sized for the day; each group's budget caps it.

## 10 · Exit

Nothing to return: `tofu destroy` removes everything.

## 11 · Changes

| Date | What changed | Row |
|---|---|---|
| 2026-10-27 | The page written from the design | FS-1037 |

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
