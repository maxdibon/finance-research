---
id: deployment-roan-capital-production
name: Roan Capital, production — R1's deployment
kind: register
status: living
law: LR-17
released: unreleased
owner: Solution architect
classification: Internal
review_ids: [FS-1037, FS-1045]
last_reviewed: 2026-10-28
---

# Roan Capital · production

Written from the design (FS-1037); generated from the code once it exists
(deployments README). Roan Capital's delivery is
[its customer page](../customers/roan-capital.md).

## 1 · The deployment

| | |
|---|---|
| Institution | Roan Capital (customers CU-01), a non-deposit-taking lender; three or four staff (FS-982) |
| Environment | Production |
| Sites | Site A and site B, both in Kenya; the provider is to decide: Liquid is not yet contracted (FS-032), and site B is needed before go-live (FS-775) |
| Who runs it | Dibon (architecture README §9) |
| Availability | Warm standby, as its contract takes (RC-35; deployment §2) |
| Release | R1 (delivery plan) |
| Go-live | Waits on R1's build, site B (FS-775), and CBK's thirty days' notice of the channel (open answer 30) |

## 2 · Components

| Component | Deployed | Version | Namespace | Database (cluster) | Replicas | Spec or module |
|---|---|---|---|---|---|---|
| EDGE | Yes | As its spec | edge | — | 2 | platform-security SE-01, SE-02 |
| KAPU CONSOLE | Yes | R1 | services | — | 2 | kapu-console |
| STAFF WORKSPACE | Yes, inside Odoo | R1 | services | Back office: odoo | With Odoo | staff-workspace |
| CUSTOMER PAGES | Yes | R1 | services | — | 2 | to write |
| LENDING SERVICE | Yes, as Kapu MFI | R1 | services | Services: lending | 2 | lending-service |
| DEPOSITS SERVICE | No: Roan Capital takes no deposits | — | — | — | — | deposits-service |
| CORE ADAPTER | Yes, to Kapu Core | R1 | services | — | 2 | lending-service |
| BACK-OFFICE GATEWAY | Yes, Odoo Enterprise's adapter | R1 | services | Services: gateway | 2 | back-office |
| VAULT | Yes | R1 | services | Services: identity | 2 | identity ID-15 |
| APPROVAL ENGINE | Yes | R1 | services | Services: approvals | 2 | approval-engine |
| LENDER RULES | Yes | R1 | services | Services: lender-rules | 2 | lender-rules |
| END-OF-DAY RUNNER | Yes | R1 | services | Services: end-of-day | 1 | end-of-day-runner |
| RAILS | Yes: M-Pesa, and banks by statement | R1 | services | Services: rails | 2 | rails |
| RECONCILIATION | Yes, with the shadow and companion ledgers | R1 | services | Services: recon and companion | 2 | recon |
| FLOWZA | Yes | To pin | services | Services: flowza | 2 | messaging §5 |
| MESSAGING | Yes | R1 | services | Services: messaging | 2 | messaging |
| IDENTITY | Yes | R1 | services | Services: identity | 2 | identity |
| KAPU CORE | Yes | Apache Fineract 1.15.x | services | Ledger: fineract | To size | kapu-core-fineract |
| ODOO | Yes, Enterprise | To pin (back-office §10) | services | Back office: odoo | To size | business-suite |
| ACCESS | Yes | Keycloak 26.x | services | Access: keycloak | 2 | access-keycloak |
| EVENT BUS | Yes | Apache Kafka 4.x, Strimzi 1.2 | data | — | 3 | event-bus-kafka |
| DATABASE | Yes: five clusters, each a primary and a synchronous standby (FS-1036) | PostgreSQL, through CloudNativePG; to pin | data | Ledger, Access, Back office, Secrets, Services | 2 each | architecture instance |
| OBJECT STORAGE | Yes: the vault's files, Odoo's filestore | As the provider | data | — | Replicated to site B | identity ID-15 |
| OPENBAO | Yes | To pin | data | Secrets: openbao | 3 | architecture README §6 |
| OBSERVABILITY | Yes: agents and local stores; the fleet's Grafana central | Grafana 13.x | observability | — | 1 | observability-grafana |

### How the components interact

FS-1045. Seven diagrams, each adding a layer to the one before: the way
in; a loan asked for and decided; money moving; events and checks; a
signed agreement; the night's close; and what everything stands on.
Names as in the table above.

**1 · The way in.** Everyone comes through the edge, and signs in at
access; each kind of person reaches only their own screens.

```
  Roan Capital's staff       borrowers, guarantors          Dibon's engineers
  (browser)                  (links, codes to their phone)  (by ticket)
         |                              |                             |
         v                              v                             v
  +---------------------------------------------------------+  +-----------+
  | EDGE   firewall and gateway: the only way in            |  | BASTION   |
  +---------------------------------------------------------+  +-----------+
         |                              |                     platform tooling
         v                              v                     only; data never
  +---------------------------------------------------------+
  | ACCESS  staff realm: password and two-factor            |
  |         customers realm: a code to the bound phone      |
  +---------------------------------------------------------+
         |                  |                       |
         v                  v                       v
  STAFF WORKSPACE      KAPU CONSOLE            CUSTOMER PAGES
  daily lending,       approvals; read-only    consents, signing,
  inside ODOO          views if Odoo is down   statements
```

**2 · A loan, asked for and decided.** The screens never write to the
ledger: they ask the lending service, which checks, asks for a decision,
and alone writes to the core.

```
  STAFF WORKSPACE --- an application, as the person signed in ---+
                                                                  v
                                                    +---------------------------+
                                                    | LENDING SERVICE           |
                                                    | (Kapu MFI, for lenders)   |
                                                    +---------------------------+
                      checks the borrower              |    |    |
       IDENTITY <--------------------------------------+    |    |
       national ID register, phone and SIM checks           |    |
                                                            |    |
                      the regulations, on each loan         |    |
       LENDER RULES <---------------------------------------+    |
                                                                 |
                      who must approve, by the mandate           |
       APPROVAL ENGINE <-----------------------------------------+
       never the originator, nor anyone who is the borrower,
       a guarantor or an officer (by ID number); step-up at ACCESS
                                                                 |
                      once approved: the only writer             v
                                         CORE ADAPTER ------> KAPU CORE
                                                             the loan, its schedule,
                                                             the general ledger
```

**3 · Money moving.** Payouts go out through the bank by Roan Capital's
own release; repayments come in to its paybill; both come back to the
ledger and are matched.

```
  LENDING SERVICE --- approved payout ---> RAILS --- payout instruction ---+
                                                                           v
                                              NCBA: released by Roan Capital's
                                              staff in its internet banking
                                              (maker-checker); never by us
                                                                           |
  borrower pays by M-Pesa                                                  | statement
         |                                                                 v
         v                                                       +--------------------+
  Roan Capital's paybill --- callback, and transactions pulled --->| RAILS              |
                                                                 +--------------------+
                                                                           |
                                    LENDING SERVICE <--- each payment -----+
                                          |
                                          v
                                    CORE ADAPTER ---> KAPU CORE: posted
```

**4 · Events, and the checks on them.** Every change is written with its
event in one transaction, published in order, and read by whoever needs
it; nothing on the money path waits for a reader.

```
  LENDING SERVICE  APPROVAL ENGINE  RAILS  KAPU CORE  IDENTITY  ...
         |               |            |        |          |
         +---------------+------------+--------+----------+   each from its own outbox
                                   |
                                   v
  ================== EVENT BUS: every change, signed, in order ==================
          |                     |                      |                     |
          v                     v                      v                     v
  RECONCILIATION         MESSAGING              BACK-OFFICE GATEWAY    OBSERVABILITY
  the ledger against     SMS under Roan         to ODOO: contacts,     metrics, logs,
  the rails; SHADOW      Capital's sender ID,   tickets, signing;      alerts, to the
  and COMPANION          WhatsApp, email;       queued if Odoo is      fleet's Grafana
  ledgers beside it      FLOWZA for replies     down
```

**5 · An agreement, signed.** The agreement goes out for signing through
the back office, and comes back to the vault with its evidence.

```
  LENDING SERVICE --- agreement and key facts ---> BACK-OFFICE GATEWAY ---> ODOO: Sign
                                                                               |
                     MESSAGING --- the signing link ---> borrower, guarantor   |
                                                                               |
         a code to each signer's bound phone; who signed, when, from which phone
                                                                               v
                           VAULT (OBJECT STORAGE) <--- signed document and its evidence
                           ODOO keeps the contract record; personal data only in the vault
```

**6 · The night's close.** The runner checks before Fineract closes the
day, applies the regulations after, and tells someone when anything
fails.

```
  21:00   END-OF-DAY RUNNER: first pass of the checks, an early warning
  23:45   final pass (payments posted, rails reconciled, services healthy)
            |   a blocking check failing --> held, the accountant and on-call told
            v
          KAPU CORE closes the business day
            v
          post-checks: the date moved, every loan closed, the trial balance balances
            v
          LENDER RULES for the day (default interest, ladders, notices)
            v
  06:00   the morning report to Roan Capital's accountant and our operations

          anything still held or unfinished at 03:00 --> OBSERVABILITY --> on-call, by phone
```

**7 · What everything stands on.** One instance, its own namespaces,
databases, secrets and copies (the clusters as proposed, FS-1036).

```
  +--------------------------- Roan Capital's instance, site A ---------------------------+
  |  edge         services                                          data         bastion  |
  |  EDGE         every component above                             DATABASE              |
  |                 |  its own database and role, in one of five:   EVENT BUS             |
  |                 |  Ledger, Access, Back office, Secrets,        OPENBAO               |
  |                 |  Services                                     OBJECT STORAGE        |
  |                 |  every secret from OPENBAO, never a file                            |
  |  observability: agents ----------------------------------------> the fleet's Grafana |
  +---------------------------------------------------------------------------------------+
            |  databases streaming; object storage replicated; backups
            v
  site B: the same, at zero, until a failover (runbooks: site failover)
```

## 3 · Diagrams

The sites and what this deployment adds outside the instance; how the
components interact inside it is §2. As the instance's (architecture
instance) and the warm standby's (deployment §2):

```
   borrowers: links, codes, SMS, WhatsApp        Roan Capital's staff: browser
                      |                                     |
                      v                                     v
   +----------------------------------------------------------------------+
   | ROAN CAPITAL'S INSTANCE, site A (site B at zero, copies arriving)    |
   |   EDGE --> services --> data           bastion: Dibon's engineers,  |
   |                                        by ticket only                |
   +-------+-----------------+--------------------+-----------------------+
           |                 |                    |
           v                 v                    v
   M-Pesa: Roan        NCBA: payouts by      SMS: Roan Capital's
   Capital's paybill   internet banking,     sender ID; WhatsApp
   (repayments)        maker-checker;        (FS-737); email
                       statements back
```

## 4 · Integrations

| Integration | What for | Whose agreement | Credentials | Status |
|---|---|---|---|---|
| M-Pesa, Daraja | Repayments into Roan Capital's paybill; callbacks, and transactions pulled for recon (RL-20) | Roan Capital's, with Safaricom | OpenBao, named when set up | To set up; site B's addresses registered too |
| NCBA, internet banking | Payouts under maker-checker (RC-18); statements for recon (RC-19) | Roan Capital's | Roan Capital's own; none held by us | Agreed |
| Access Bank | As NCBA, if used | Roan Capital's | As NCBA | Open answer 6 |
| Airtel Money | Repayments, if Roan Capital collects through it | Roan Capital's | OpenBao | Open answer 25 |
| SMS | Reminders, codes, receipts under Roan Capital's sender ID | Dibon's route; Roan Capital's sender ID (DR-005, DR-006) | OpenBao | Whitelisting requested 9 October |
| WhatsApp | Remote loan processing (FS-737), notifications and links only | Meta, directly or through a provider (FS-161) | OpenBao | To decide |
| Email | Notices and signing links | Dibon's | OpenBao | To set up |
| National ID register | Identity checks | To decide: Roan Capital's or Dibon's on its behalf (FS-202) | OpenBao | Open |
| Business registry | Business borrowers | To confirm what is available (FS-205) | OpenBao | Open |

## 5 · Continuity

| | |
|---|---|
| Recovery objectives | Tier 1, money and sign-in: at most 5 minutes of data, back within 4 hours; tier 2: 1 hour and 8 hours; tier 3: 24 hours and 72 hours (platform-security §3; deployment §2) |
| Backups | Every database's log archived continuously to site B, with its replicas (SE-22); backups as SE-10; a weekly offline copy, its own keys, four weekly and twelve monthly kept (deployment §3) |
| Restore tested | Not yet: before go-live, then every quarter (SE-10) |
| Failover tested | Not yet: rehearsed once before go-live, then twice a year with Roan Capital (deployment §2) |
| Runbooks | [Site failover](../runbooks/site-failover.md), [restore from backup](../runbooks/restore-from-backup.md), [close of business](../runbooks/close-of-business.md), [OpenBao unseal](../runbooks/openbao-unseal.md), [rotating a rail's credentials](../runbooks/rail-credentials.md), [upgrading Odoo](../runbooks/odoo-upgrade.md); Roan Capital's own [fallback](../runbooks/institution-fallback.md) |
| The institution's fallback | Roan Capital's runbook for an outage, open answer 27: who enters and leaves safe mode, who may pay out by hand and within what limit |
| Who is called | Dibon: the on-call engineer, the incident manager, the CTIO (incident management §2). Roan Capital: its incident contact (onboarding OB-COM-13), its accountant for the close, its Super Admin |
| Before go-live | Site B's provider (FS-775); site B's outbound addresses registered with Safaricom and NCBA; site B's OpenBao unseal key held at site B; the failover runbook rehearsed once (deployment §2) |

## 6 · Access

| Who | What | How |
|---|---|---|
| Roan Capital's staff | The staff workspace, the Kapu Console where their role allows, Odoo | The `staff` realm, roles as customers/roan-capital §7, two-factor |
| Borrowers and guarantors | Their own pages | The `customers` realm, a code to their bound phone (access-keycloak §3) |
| Dibon's engineers | Platform tooling only, standing; anything else just in time | The `ops` realm, brokered from Dibon's own Keycloak; a ticket, through the bastion, 4 hours by default (architecture README §9) |
| Roan Capital, over Dibon | May switch Dibon's broker off at any time | By contract (README §9) |

## 7 · Data

- **The privacy register's rows that apply:** PR-01 (onboarding and
  KYC), PR-02 (payments and the ledger), PR-03 (credit decisions), PR-06
  (phone and SIM checks), PR-07 (messages), PR-13 (security events),
  PR-14 (signed events and the audit trail), PR-15 (backups), PR-16
  (WhatsApp), PR-18 (decisioning), PR-19 (complaints), PR-20 (staff
  accounts). Each one's impact assessment as the register marks it; any
  marked "Needed" is done before go-live.
- **Where it lives:** in Kenya, at site A and site B, and the offline copy
  in a third place in Kenya.
- **What leaves Kenya:** only by name: detection telemetry to the managed
  security service (SE-13); notifications and links, never balances or
  documents, through SMS, WhatsApp and email (deployment §1).

## 8 · Licences and suppliers

| Licence or supplier | What for | Count or terms | Whose | Status |
|---|---|---|---|---|
| Odoo Enterprise | The back office and the staff workspace | One user per staff member: three or four (FS-982); count to confirm (FS-529) | To confirm: Roan Capital's subscription or Dibon's (FS-529) | To confirm |
| Site A and site B | Hosting in Kenya | Liquid, or a second provider for site B | Dibon's | To decide (FS-032, FS-775) |
| Safaricom | The paybill and Daraja | Roan Capital's own | Roan Capital's | Existing |
| NCBA | Payouts and statements | Roan Capital's own | Roan Capital's | Existing |
| SMS route | Messages under Roan Capital's sender ID | Per message | Dibon's | To set up |
| WhatsApp | Remote loan processing | Per conversation | To decide (FS-161) | To decide |
| Managed security service | Round-the-clock detection | Per endpoint and server | Dibon's (SE-13) | To contract |

## 9 · Size

To size (architecture review A7), from: three or four staff; borrowers
and loans a month, and messages a day, to ask Roan Capital. Until then,
the replicas in §2 are the minimum each spec sets.

## 10 · Exit

**Proposed, for the contract** (approval pack item 14):

1. **Notice** as the contract says; Dibon confirms in writing what will
   be returned and when.
2. **Returned within 30 days:** the ledger (Fineract's database, and its
   accounts, loans and transactions in open formats); every document in
   the vault with its evidence; Odoo's database and files; the audit
   trail; its configuration (products, mandates, roles) as data files.
3. **Supported through the handover** for up to 90 days, the service
   running until Roan Capital confirms it has moved.
4. **Purged within 30 days of that confirmation:** databases, object
   storage and replicas at both sites; its keys destroyed in OpenBao, so
   any copy left is unreadable; its offline copies wiped as they expire,
   with a certificate.
5. **A certificate of deletion** to Roan Capital. Dibon keeps only what
   the law requires of Dibon itself (its invoices, the access register),
   nothing of borrowers.

## 11 · Changes

| Date | What changed | Row |
|---|---|---|
| 2026-10-27 | The page written from the design | FS-1037 |
| 2026-10-28 | How the components interact, in seven diagrams (§2) | FS-1045 |

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
