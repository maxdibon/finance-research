---
id: ict-policy
name: ICT policy — template for an institution's licence application to CBK
kind: guide
status: living
law: LR-03
released: unreleased
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-1080, FS-1087, FS-1089, FS-1090, FS-1092, FS-1094, FS-1100, FS-1099, FS-1101, FS-1102, FS-1103, FS-1106, FS-1109, FS-1110, FS-1111]
last_reviewed: 2026-11-05
---

# ICT policy · template DC-FS-TM-ICT-003

The ICT policy CBK asks of a lender applying for its licence, with the
description of the ICT system, the systems architecture diagram, the
data flow diagram and the plan for independent assurance it asks to see
with it (the [licence pack](cbk-licence-pack.md), item iv; FS-1080). It
describes the platform we run for the institution, and is the
institution's own policy, in its look (design-system, "Whose look a
document takes"). Built with `tools/policies/build.js`.

**How to fill it:** copy the values file of an institution that has one,
change what differs, and build. A value it lacks comes out highlighted as
"[To confirm: …]", as does any value written that way: nothing undecided
goes to a regulator unseen. Keep each bullet's continuation lines
indented. The two diagrams are images beside the values:
`architecture.png` and `dataflow.png`.

| Value | What it is | Roan Capital's, for example |
|---|---|---|
| `institution`, `institution_legal` | Its short and registered names | Roan Capital; Roan Capital Limited |
| `number`, `version`, `date`, `classification` | This document's: its number in the institution's own scheme, never ours (design-system §7); `numbers` and `versions` give each template its own | RC-POL-001, to confirm; 0.3; 5 November 2026; Confidential |
| `owner`, `approved_by` | Who owns it, and who approves it | Chief Executive Officer; the board of directors |
| `provider`, `provider_legal` | Dibon's short name, and its registered name as in the services agreement | Dibon; to confirm |
| `security_contact` | The position that holds ICT and security | To confirm |
| `board_report` | How often the board hears of ICT risk | Every quarter |
| `devices`, `endpoint_role` | The devices staff use, and who manages them | Laptops Dibon issues and manages; Dibon secures them |
| `phones` | How staff phones are managed | Enrolled by Dibon: fully managed if issued, a work profile if personal; to confirm which |
| `print_setup` | Who sets printing to wait for a PIN, and on what printer | Dibon's device management; the printer to confirm |
| `sms_provider` | Who carries its SMS to the mobile operators | Dibon itself, licensed by the Communications Authority of Kenya as a premium rate service provider, direct to Safaricom, Airtel and Telkom |
| `message_channels` | The messaging channels it uses with customers | SMS and email |
| `perimeter`, `managed_security` | The hosting provider's firewall; the managed detection service | Azure Firewall; Liquid's managed security |
| `sites`, `hosting`, `hosting_contract` | Where it runs, on whose infrastructure, and under what contract | Nairobi and Mombasa; Africa Data Centres and Liquid; to confirm |
| `staff`, `bank`, `go_live` | Its staff; its payout bank; the go-live date | Three or four; NCBA Bank; to confirm |
| `identity_providers` | Identity suppliers | To confirm |
| `pen_tester`, `pen_test_date`, `it_audit` | The independent assurance | To confirm |

<!-- document -->
# Information and Communication Technology (ICT) Policy

| Document control | |
|---|---|
| Document number | {{number}} |
| Version | {{version}}, draft for review, {{date}} |
| Classification | {{classification}} |
| Owner | {{owner}}, {{institution_legal}} |
| Approved by | {{approved_by}} |
| Prepared with | {{provider_legal}}, the provider of the lending platform |
| Review | At least once a year, and after any material change to the ICT system |

## 1. Purpose

This policy sets how {{institution}} plans, builds, runs and protects the information and communication technology it uses to provide digital credit, so that customers' personal data and money are safe, the service is available when customers and staff need it, and {{institution}} meets the requirements of the Central Bank of Kenya, the Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, and the Data Protection Act.

## 2. Scope

It covers the lending platform {{institution}} uses for digital credit (Annex A), which {{provider}} builds, hosts and operates for it under the services agreement; {{institution}}'s staff, their accounts and the devices they use to reach it; and the third parties connected to it: the mobile operators (Safaricom, Airtel and Telkom) and their mobile money, {{bank}}, messaging providers and identity providers. It applies to every member of {{institution}}'s staff, its contractors, and the provider's staff when they work on {{institution}}'s systems.

## 3. Principles

- **Customer data stays in Kenya,** in {{institution}}'s own instance of the platform, separate from any other institution's.
- **Least privilege:** each person and each system has only the access its work needs, for as long as it needs it.
- **Every act is attributable:** anything that moves money, approves, or reveals a person is authenticated when it is done, and recorded.
- **No money moves without approval:** a payout goes only to the approved account, for the approved amount, after a second person approves.
- **Defence in depth:** controls at every layer, from the network edge to each database and backup.
- **Written down and tested:** every control here is documented, and those that protect money and data are tested before go-live and on a schedule after it.

## 4. Roles and responsibilities

| Role | Responsibility |
|---|---|
| Board of directors | Approves this policy and its changes; receives a report on ICT risk, incidents and the results of tests {{board_report}} |
| {{owner}} | Accountable for this policy; the platform's administrator for {{institution}}; approves exceptions; signs the quarterly access review |
| ICT and security contact ({{security_contact}}) | Day-to-day oversight of the platform; {{institution}}'s contact for incidents; keeps the register of staff access |
| {{provider}}, the platform provider | Designs, builds, hosts, operates, monitors and secures the platform under the services agreement; {{endpoint_role}}; reports incidents; gives the Central Bank of Kenya access to its premises, books, records, systems and staff as the agreement and the law require |
| Every member of staff | Follows this policy; protects their sign-in; reports a suspected incident at once |

## 5. Policy

### 5.1 Systems development

- Every change to the platform is designed, reviewed and tested before it reaches production. Code is reviewed and approved by a second engineer, built by an automated pipeline, and tested against its requirements and acceptance tests.
- Security testing runs in the pipeline on every change: secrets scanning, static and dynamic application testing, and scanning of every image and dependency for known vulnerabilities. A build that fails is refused.
- Four environments: development, test, staging and production. Production data never leaves production; development and testing use made-up data only.
- Every release is built from code, its images signed, with a record of what it contains (a software bill of materials). Only signed images from the provider's own registry may run.
- A threat model for each product, covering security and privacy, is written before it is built and reviewed at each major change; the payment path first.

### 5.2 Information security standards and baselines

- A security baseline applies to every layer: the network edge, the cluster, the data, the backups and the devices that reach the platform. Each component has a written baseline of mandatory settings, applied to {{institution}}'s deployment and checked at every change.
- The cluster is hardened to the CIS Benchmarks, checked on every change; no privileged workloads; runtime threat detection on every server.
- **Security weaknesses are found and closed on a schedule.** A security weakness is a flaw someone could use to break in, take data or disrupt the service; most are found in the software the platform is built on, by scanning every day against public lists of known weaknesses, and some by testers or by {{institution}}'s staff. Each has a public rating of how serious it is, from low to critical, raised when criminals are known to be using it. Once a weakness is confirmed to affect the platform, it is dealt with within the time its seriousness sets:

| How serious | For example | Dealt with within |
|---|---|---|
| Critical, on anything reachable from the internet, or already being used by attackers | A flaw in the sign-in page that would let anyone in without a password | 72 hours |
| Critical, elsewhere | The same kind of flaw in a database reachable only from inside the platform's network | 7 days |
| High | A flaw that could let a signed-in member of staff see more than their role allows | 30 days |
| Medium | A flaw that reveals some technical detail, but no customer data | 90 days |
| Low | A cosmetic weakness, such as a missing security setting in a web page's header | 180 days, or the next planned release |

Dealt with means fixed, usually by installing the software maker's update, or, where no update exists yet, blocked another way within the same time: a feature switched off, a firewall rule added, or access narrowed. The same times apply to what penetration tests and audits find. If a time cannot be met, a temporary protection is put in place that day, the provider's security lead accepts the remaining risk in writing, and {{institution}} is told; the weakness stays on the monthly service review until it is closed. Each month {{institution}} receives a count of the weaknesses found and whether every time was met.

### 5.3 Network management security standards

- One way in: every request from the internet passes {{perimeter}}, then a web application firewall (with the OWASP core rule set) and an API gateway with rate limits. Protection from denial-of-service attacks is provided upstream by the hosting provider.
- The network is divided into zones: the edge, the services, the data, and the bastion through which administrators reach anything inside. Traffic between workloads is denied unless explicitly allowed; each service has its own cryptographic identity, and traffic between services is encrypted.
- Databases and internal services are never reachable from the internet. Outbound connections go only to named parties.

### 5.4 Database security technical implementation standards

- PostgreSQL, with a separate database for each component, reached only by that component's own account. No shared accounts; staff have no direct access to any database.
- Each database runs as a primary with a synchronous standby, so the loss of one server loses no data. Connections are encrypted; data is encrypted at rest.
- Every change to a database's structure, and every write not made by the component's own account, is logged and shipped at once to write-once storage in a separate domain.
- The loan ledger is written only by the lending service; no staff role can change a loan directly, and a nightly check finds and alerts on any write made another way.
- Administrators reach a database only through the bastion, by an approved ticket, for a limited time, read-only unless the ticket says otherwise.

### 5.5 Data encryption standards and guidelines

- **In transit:** TLS everywhere, version 1.2 or above, with certificates issued and renewed automatically; encrypted connections to every third party.
- **At rest:** server disks, databases, document storage and backups are encrypted. Keys are held in a key management system (OpenBao), rotated on a schedule; signing keys never leave it.
- **Field by field:** government ID numbers and other restricted values are encrypted by the service before they reach a database, so neither a query, a replica nor a backup shows them in clear.
- **Backup keys** are held outside production, in a separate vault kept sealed, opened only when three of five named key holders act together; each opening approved and recorded.
- **Data classes** travel with the data: Public; Internal; Confidential (names, phone numbers, account numbers, balances, statements, KYC documents); Restricted (government ID numbers, credentials, signing keys). Restricted values never appear in a log.

### 5.6 Information security guidelines

- Use only your own named account, with your second factor; never share either.
- Reach the platform only from {{devices}}.
- **A phone used for work,** to reach the platform or to hold an authenticator app, is managed by who owns it and recorded in the device register: {{phones}}: a supported system with updates applied, a screen lock with a PIN or fingerprint, encrypted, never rooted or jailbroken. If it is lost or stolen, report it at once: its work apps are wiped remotely and its authenticator revoked, and a new one is registered after an identity check. A leaver's is removed on their last day.
- Keep customer data on the platform. Do not download it to personal devices, or send documents, statements, balances or ID numbers by email, SMS or WhatsApp; the platform sends customers links to their own pages instead.
- Report a suspected incident, a lost device or a suspicious message to the ICT and security contact at once.
- **Staff work only on laptops {{provider}} issues and manages.** A personal laptop is used only by a temporary person on a short stay, in the browser only, its basics (a supported system with updates, disk encryption, antivirus) confirmed by their sponsor; a longer stay, or customer data day to day, needs one of the provider's laptops or a managed browser profile.
- **Print customer data only when a task needs it:** a statement a borrower asks for, or a signed original the law requires. Every print job is held at the printer until its owner enters their PIN there, set on each device by {{print_setup}}; documents printed from the platform carry the name of the person who printed them and the time, and each print is recorded. Anything printed is collected at once, locked away when not in use, never taken home, and shredded when no longer needed.
- **On a visit to a customer,** notes go into the platform in the browser, and photos of premises, collateral or documents go only through the platform's secure upload, straight into the document vault: never kept in the phone's gallery, and never sent by a messaging app.
- **Original documents** held as security (logbooks, title deeds) are kept in a locked cabinet, and every movement in or out is recorded.

{{institution}} removes a leaver's access on their last day, reviews every account's access each quarter, trains staff in security when they join and every year, and uses test data, never customers' data, in training.

### 5.7 Application security

- Every screen works in the current and previous versions of Chrome, Edge, Firefox and Safari, on computers and phones, and is tested in each before release; no control depends on one browser.
- Web applications are tested against the OWASP Top 10 in the build pipeline; mobile applications, when used, are built and tested to OWASP MASVS level 2.
- Every act that moves money, approves a request or reveals a person's details asks the user to authenticate again at that moment.
- Screens show the least personal data needed; masked details are revealed only on request, and each reveal is recorded.
- Uploaded files are checked against their declared type and scanned for malware before anyone can open them; images are re-encoded.
- An independent penetration test of the platform is carried out before go-live and every year, the payment path always in scope (Annex D).

### 5.8 Network access and requirements

- Staff reach the platform only through the edge, over HTTPS, signed in with two factors. Customers reach only their own pages, by a code from an authenticator app or, for those without one, a one-time code by SMS to their phone.
- Administrative access to servers and databases is only through the bastion, against an approved ticket, for a limited time (four hours by default), with every session recorded. The provider's engineers sign in with hardware security keys and hold no standing access to {{institution}}'s data.
- **Temporary people** (an auditor, a consultant, a contractor, temporary staff, an inspector) each have a named account with a sponsor on {{institution}}'s staff, who asks for it, vouches for the person and confirms when it ends, and approval by someone else; an end date on which it turns itself off; the least role (an auditor's is read-only; none may approve, pay out or change a product); an authenticator app; confidentiality signed first; the browser only, with no exports and identity numbers masked; and a place in each quarterly access review.
- {{institution}} may switch off the provider's access at any time. Every grant of access is recorded and compared each month at the service review.
- Connections to third parties use authenticated, encrypted channels; their credentials are held in the key management system, and source addresses are registered with the party where it allows.

### 5.9 Password security for mobile applications and web platforms

| | Staff (web) | Customers (mobile phone, web pages) |
|---|---|---|
| How they sign in | A password and a second factor (an authenticator app, or a security key or passkey), both registered before first use | No password: a 6-digit code from an authenticator app, offered at the first sign-in and the default once registered; for those without a smartphone, a 6-digit one-time code by SMS to the phone number bound at enrolment |
| Strength | At least 12 characters; the last five may not be reused | An app's code changes every 30 seconds and never travels by SMS, so a swapped SIM cannot catch it; an SMS code is valid for 5 minutes, used once |
| Wrong attempts | Five lock the account for 15 minutes and raise an alert; twenty in a day lock it until an administrator, with a second, unlocks it after an identity check | Three lock sign-in for 15 minutes |
| A lost phone or app | A lost authenticator is revoked at once, and a new one registered after an identity check | The app is removed, and a new one registered, only after the customer is verified again; there are no recovery codes |
| Sessions | End after 30 minutes idle, and after 10 hours at most | End after 15 minutes idle, and after 1 hour at most |
| At a decision | The second factor asked again for every approval | A new code to sign an agreement or consent |
| A changed SIM card | — | Sign-in and money movements held until the customer is verified again |

Passwords are stored only as salted hashes by the sign-in service, never in clear and never in a log. Recovery codes, social sign-in and sign-in by password alone are switched off. Access tokens last five minutes.

### 5.10 Audit log management

- Recorded: every sign-in and failed attempt, every step-up, every administrative action and role change, every financial act and decision, every opening of a customer's document, and every database write not made by the component's own account.
- Each change in the platform is a signed event, chained to the one before and anchored in an append-only log, so the trail of any transaction can be verified and cannot be altered unseen.
- Logs are shipped to write-once storage in a separate domain and kept as follows; deleted at the end of their period unless a legal hold stops the clock. Restricted values never enter a log.

| Log | Searchable | Kept |
|---|---|---|
| Security events: sign-ins, failures, step-ups, administrative actions, role changes | 13 months | 7 years, write-once |
| Database audit: structure changes and writes outside a component's own account | 13 months | 7 years, write-once |
| The signed audit trail of every transaction | For its life | At least 7 years |
| Access grants and administrators' sessions | 13 months | 7 years |
| Application and platform logs | 13 months | 13 months |

### 5.11 Application auditing and monitoring

- Every component is monitored around the clock for availability, errors, latency and security events, with alerts routed to the provider's on-call engineer and, for security, to {{managed_security}}.
- Money is reconciled every cycle: each M-Pesa and bank transaction is matched to the ledger, and any difference is an exception that stays open until evidence closes it.
- The business day is closed each night only after its checks pass; a failure is escalated by phone.
- {{institution}} and the provider review service, incidents, changes and access each month.

### 5.12 Software change control procedures

- Every change is classified: **standard** (pre-approved, low risk), **normal** (assessed and approved before it is made) or **emergency** (approved by the operations and security leads within hours, reviewed afterwards).
- Changes reach production only through the deployment pipeline, by a reviewed request with two approvals, in an agreed change window, with a rollback plan; no one deploys by hand.
- {{institution}} is told in advance of any change that affects its staff or customers, and approves changes to its own configuration.
- Product terms (rates, fees, repayment order) change only by a new product version approved by two people at {{institution}}, and by the Central Bank of Kenya where the regulations require it.

### 5.13 Backup policy

- Every database is archived continuously, so it can be restored to any minute; it is also replicated to the second site.
- A weekly offline copy is kept with its own keys: four weekly and twelve monthly copies retained. Backups sit in a separate security domain, with their own administrators, and at least one copy cannot be altered or deleted.
- Restores are tested before go-live and every quarter. Backups expire with the retention period of the data they hold; nothing is restored beyond it.

### 5.14 Disaster recovery plan

| Tier | What it covers | Most data that may be lost | Back within |
|---|---|---|---|
| 1 | Money and sign-in: the ledger, payments, approvals, access | None on a server failure; at most 5 minutes on the loss of a site | 4 hours |
| 2 | Back office, messaging, reporting | 1 hour | 8 hours |
| 3 | Analysis and other supporting services | 24 hours | 72 hours |

- The platform runs at two sites in Kenya, {{sites}}, on {{hosting}} infrastructure ({{hosting_contract}}), the second a warm standby. Failover follows a written runbook, rehearsed before go-live and twice a year with {{institution}}.
- A clean rebuild from code is possible at any time, never from a machine that was compromised; a ransomware recovery drill is held twice a year.
- If the platform is unavailable, {{institution}} follows its own outage procedure: customers keep repaying by mobile money or bank transfer; new disbursements wait, or are made by hand under two-person control within set limits, and are entered and reconciled when the platform returns.
- **Incidents:** the provider tells {{institution}} within 4 hours of confirming a significant incident (aiming for 1 hour), updates it every 4 hours, and sends a root-cause report within 5 working days; a personal data breach within 24 hours, so {{institution}} can notify the Data Commissioner within 72 hours.

## 6. Third parties and outsourcing

- The platform is provided by {{provider}} under a services agreement that keeps {{institution}}'s data in Kenya, forbids its use for any other purpose, allows subcontracting only with {{institution}}'s approval, gives the Central Bank of Kenya access, and sets how data is returned and erased if the agreement ends.
- Every supplier that handles {{institution}}'s data is assessed before use and named in its register of processors: hosting ({{hosting}}), the mobile operators (Safaricom, Airtel, Telkom), {{bank}}, SMS ({{sms_provider}}), identity verification ({{identity_providers}}) and the managed security service ({{managed_security}}).

## 7. Exceptions, compliance and review

- An exception to this policy is approved in writing by the {{owner}}, with its reason, its risk and the date it ends, and recorded.
- A breach of this policy may lead to disciplinary action. Compliance is checked by the quarterly access review, the monthly service review, and the yearly independent test.
- This policy is reviewed at least once a year and after any material change to the ICT system, and each version approved by the board.

## Annex A. Description of the ICT system

{{institution}}'s digital credit is run on a lending platform built and operated for it by {{provider}}: Kapu MFI, a lending service, on Kapu Core, a loan ledger built on Apache Fineract, with Odoo Enterprise as the back office. It covers onboarding and KYC, collateral, approval by committee, disbursement, repayment, reconciliation, arrears and collections, and management reports.

**Status:** the platform is being implemented. It goes live after its acceptance tests, the tests in Annex D, and the Central Bank of Kenya's approval and the notice the regulations require for a new channel: {{go_live}}.

| Component | What it does | Technology |
|---|---|---|
| Staff workspace | Staff's screens for daily lending: applications, collateral, tasks | Odoo Enterprise, over the lending service |
| Kapu Console | Approvals, and read-only views if the back office is unavailable | The provider's web application |
| Customer pages | Borrowers' and guarantors' own pages: consents, signing, statements | The provider's web application, opened by link and one-time code |
| Edge | The only way in: web application firewall and API gateway | Envoy Gateway; Coraza with the OWASP core rule set |
| Access | Sign-in, roles, second factor and step-up | Keycloak |
| Lending service | Applications, collateral, product versions; the CBK lender regulations applied to each loan | The provider's service |
| Approval engine | Approval chains and committee decisions, with step-up at each | The provider's service |
| Kapu Core | The loan ledger: loans, schedules, balances, postings, the end of day | Apache Fineract |
| Rails | Mobile money collections and payouts (M-Pesa, and Airtel Money and T-Kash where used); bank statements | The provider's service, to each operator's interface |
| Messaging | {{message_channels}} from approved templates, with consent and quiet hours | The provider's service; SMS through {{sms_provider}} |
| Identity and document vault | Identity checks; documents with personal data, encrypted | The provider's service; encrypted object storage |
| Reconciliation | Matches M-Pesa and bank transactions with the ledger; exceptions | The provider's service |
| Back office | Electronic signature, helpdesk, staff records | Odoo Enterprise |
| Data | Databases, the event bus, document storage, keys | PostgreSQL, Apache Kafka, object storage, OpenBao |
| Monitoring | Metrics, logs, traces and alerts | Grafana, Prometheus, Loki, Tempo |

**Hosting:** {{institution}}'s own instance of the platform, on a Kubernetes cluster, at two sites in Kenya, {{sites}}, on {{hosting}} infrastructure, with an offline encrypted backup copy in Kenya. Separate development, test and staging environments hold made-up data only.

**Users:** {{institution}}'s staff ({{staff}}), each with their own account and second factor; borrowers and guarantors, on their own pages only; the provider's engineers, for operations only, through the bastion by ticket, never with a role in {{institution}}'s lending.

<!-- landscape -->
## Annex B. Systems architecture

The front-end applications, the support systems and the backend infrastructure, in layers: each layer calls only the one below it. External parties are reached only by the component each names.

<!-- image: architecture -->
<!-- landscape -->
## Annex C. Data flow

How data and requests flow from the front-end applications to the databases, one row for each flow.

<!-- image: dataflow -->
<!-- portrait -->
| # | Flow | Data | Protection |
|---|---|---|---|
| 1 | Sign-in | Credentials; one-time codes | Two factors for staff; an authenticator app's code, or an SMS code to the bound phone, for customers; lockouts; events logged |
| 2 | Application | The applicant's details; collateral | Entered as the signed-in staff member; Confidential; ID numbers encrypted field by field |
| 3 | Identity and documents | ID numbers; documents; photos | Files scanned before storage; documents encrypted; each opening logged; checks through named providers |
| 4 | Decision | The request; each decision | Re-authentication at each decision; no one decides two steps in a row |
| 5 | Agreement signed | The agreement; the key facts | Read before signing; signed with a one-time code; the signed copy kept in the vault |
| 6 | Disbursement | The payout instruction | Only the approved amount to the approved account, checked by its hash; a second person approves |
| 7 | Repayment | The payment and its reference | From the mobile money operator's authenticated callback; matched to the loan; applied in the regulated order |
| 8 | Checks and audit | Every change; statements | Each change signed and chained; money, ledger and statements compared every cycle |

## Annex D. Independent assurance

The platform is being implemented, so no independent assurance report on it exists yet. Before go-live, and then on a schedule:

| Assurance | By | When |
|---|---|---|
| Penetration test of the whole platform, the payment path always in scope | An independent tester that does no other assurance work for the provider: {{pen_tester}} | Before go-live, {{pen_test_date}}; then every year |
| Restore of the databases and documents from backup, against the recovery objectives | The provider, witnessed by {{institution}} | Before go-live; then every quarter |
| Failover to the second site | The provider, with {{institution}} | Before go-live; then twice a year |
| Review of this policy's controls against the platform as built | {{it_audit}} | Before go-live |

Each report goes to {{institution}}'s board, and to the Central Bank of Kenya on request.
<!-- end -->

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
