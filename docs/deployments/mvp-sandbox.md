---
id: deployment-mvp-sandbox
name: The MVP sandbox — public Azure, made-up data only
kind: register
status: living
law: LR-17
released: unreleased
owner: Solution architect
classification: Internal
review_ids: [FS-1037, FS-1045, FS-1046, FS-1074, FS-1079, FS-1093, FS-1115, FS-1192, MX-010]
last_reviewed: 2026-11-17
---

# The MVP sandbox

Where the team builds the MVP (FS-929, FS-932; the MVP day). Its code is
code/platform/azure-sandbox; what it makes is in that README.

**Built on until production is in Kenya** (FS-1192): from 11 November
the team builds the MVP here, while hosting in Kenya with Liquid is
settled. Made-up data only still holds; a real customer's data waits for
a site in Kenya (LQ-46).

## 1 · The deployment

| | |
|---|---|
| Institution | None: Roan Capital's products configured with made-up data only |
| Environment | Sandbox |
| Sites | One: public Azure, South Africa North; Azure has no region in Kenya, so nothing real goes here |
| Who runs it | Dibon's platform workstream; each person their own group |
| Availability | None: rebuilt from code; personal and workstream groups removed at the end of the day |
| Release | The MVP day, Friday 6 November (FS-962, FS-1074, FS-1079); built on from 11 November until production is in Kenya (FS-1192) |
| Go-live | Not applicable |

## 2 · Components

| Component | Deployed | Version | Namespace | Database (cluster) | Replicas | Spec or module |
|---|---|---|---|---|---|---|
| PROVIDER | No: public Azure's basic network protection only; made-up data | — | — | — | — | platform-security SE-03 |
| EDGE | No: the cluster's own ingress only | — | — | — | — | platform-security |
| KAPU CONSOLE | No: after the MVP | — | — | — | — | kapu-console |
| STAFF WORKSPACE | No: after the MVP | — | — | — | — | staff-workspace |
| CUSTOMER PAGES | No: the borrower signs in Odoo Sign | — | — | — | — | to write |
| LENDING SERVICE | No: the walk-through keys into Kapu Core | — | — | — | — | lending-service |
| DEPOSITS SERVICE | No | — | — | — | — | deposits-service |
| TREASURY | No: designed for R2 | — | — | — | — | treasury |
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
| DATABASE | Yes: one each for Fineract, Keycloak and Odoo; and Secrets, OpenBao's storage (MX-010) | PostgreSQL | data | Ledger, Access, Back office, Secrets | 1 | architecture instance |
| OBJECT STORAGE | Yes, Azure Blob, for Odoo's files | Azure | data | — | 1 | identity ID-15 |
| OPENBAO | Yes, since 12 November: three pods, internal only (no ingress, no public name); unsealed by hand, 3 of 5 shares; the audit device declared in its configuration; Kubernetes auth and a KV store; the root token revoked (MX-010) | OpenBao 2.7.2 | data | Secrets | 3 | architecture README §6; settings/openbao |
| OBSERVABILITY | No | — | — | — | — | observability-grafana |

### How the components interact

FS-1045. Two diagrams, the second adding to the first: what is built
for the day, then the day's walk-through across it. Made-up data only.

**1 · What is built.** GitHub holds the code; Flux puts it on the
cluster; each component has its own database.

```
  GitHub: the platform repository --- Flux follows it ---> the cluster in rg-mvp
                                                                  |
          +---------------------------+---------------------------+
          v                           v                           v
  +----------------+          +----------------+          +----------------+
  | ACCESS         |          | KAPU CORE      |          | ODOO           |
  | staff realm,   |          | Fineract,      |          | CRM, Sign,     |
  | Roan Capital's |          | Biashara       |          | Helpdesk,      |
  | positions      |          | configured     |          | Employees      |
  +-------+--------+          +-------+--------+          +-------+--------+
          v                           v                           v
  DATABASE: keycloak          DATABASE: fineract          DATABASE: odoo, its files
                                                          in OBJECT STORAGE
```

**2 · The walk-through.** A made-up loan from lead to complaint, across
what is built; the RAILS stand-in plays the bank and M-Pesa's sandbox.

```
  a staff member signs in at ACCESS (two-factor) ---> ODOO and KAPU CORE alike
         |
         v
  ODOO CRM: a lead ---> keyed into KAPU CORE as a client and a Biashara loan
         |
         v
  ODOO Sign: the agreement and key facts, signed by a made-up borrower
         |
         v
  KAPU CORE: approved ---> RAILS stand-in: the payout instruction by bank
                                 |
         M-Pesa's sandbox -------+---> a repayment ---> KAPU CORE: posted
         |
         v
  ODOO Helpdesk: a complaint, its 30-day clock running
```

## 3 · Settings

FS-1046. What the sandbox sets; made-up data only, nothing secret here.

| Component | Setting | This deployment | Defined in | Decided by | Status |
|---|---|---|---|---|---|
| KAPU CORE | Tenant time zone | Africa/Nairobi | kapu-core-fineract §2 | The spec | Set |
| KAPU CORE | Biashara | Configured from its product document, with made-up values where Roan Capital has not answered | FS-941 | The core workstream | Set |
| ACCESS | Staff realm | Roan Capital's eight positions as roles; two-factor sign-in | FS-942; access-keycloak §5 | The core workstream | Set |
| ODOO | Edition and apps | Enterprise, through the partner account: CRM, Sign, Helpdesk, Employees | FS-945, FS-946 | The back-office workstream | Set |
| RAILS | Stand-in | A bank payout instruction; M-Pesa's sandbox for a repayment | FS-943 | The money workstream | Set |
| — | Azure | South Africa North only; a budget per group, alerts at 50%, 80% and 100% | code/platform/azure-sandbox | The platform workstream | Set |

## 4 · Diagrams

The MVP day's own (docs/delivery/mvp-day.md): GitHub, then the sandbox and its
cluster, Flux, Kapu Core and Biashara, the payout by bank, the
walk-through, with Keycloak and Odoo beside.

## 5 · Integrations

| Integration | What for | Whose agreement | Credentials | Status |
|---|---|---|---|---|
| M-Pesa, Daraja sandbox | The repayment in the walk-through | Dibon's developer account | Sandbox only, in the cluster | To set up on the day |
| GitHub | The code, and Flux following the platform repository | Dibon's organisation (FS-952) | Dibon's | Before the day |

## 6 · Continuity

| | |
|---|---|
| Recovery objectives | None: rebuilt from code |
| Backups | None; the OpenTofu state is versioned (rg-tfstate) |
| Restore tested | Not applicable |
| Failover tested | Not applicable |
| Runbooks | None; the sandbox README |
| The institution's fallback | Not applicable |
| Who is called | The platform workstream |

## 7 · Access

Every member reads every group; each changes their own; the platform
workstream changes the MVP environment (the sandbox README). Sign-in
through Entra; Claude never signs in for anyone.

## 8 · Data

Made-up data only: no customer, borrower or staff data (rules, Dibon 1;
privacy, "In Kenya"). Nothing in the privacy register applies.

## 9 · Licences and suppliers

| Licence or supplier | What for | Count or terms | Whose | Status |
|---|---|---|---|---|
| Azure | The sandbox | A budget per group, alerting at 50%, 80% and 100% | Dibon's subscription (FS-938) | To set up |
| Odoo Enterprise | Sign, Helpdesk, Employees in the walk-through | Through the partner account | Dibon's | Before the day |

## 10 · Size

One small cluster, sized for the day; each group's budget caps it.

## 11 · Exit: when the service ends

Nothing to return: `tofu destroy` removes everything.

## 12 · Changes

| Date | What changed | Row |
|---|---|---|
| 2026-10-27 | The page written from the design | FS-1037 |
| 2026-10-28 | How the components interact, in two diagrams (§2) | FS-1045 |
| 2026-10-28 | Its settings (§3) | FS-1046 |
| 2026-11-11 | Built on from 11 November, until production is in Kenya | FS-1192 |
| 2026-11-12 | OpenBao installed on the sandbox, with the Secrets cluster for its storage (§2); platform #7, #8 | MX-010 |

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
