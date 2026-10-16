---
id: platform-security
name: Platform Security
kind: shared-service
status: living
law: LR-17
released: 2026.10.15
owner: Security lead
classification: Internal
audience: [bank, sacco, mfi, psp, imt, fintech]
depends_on: [access, recon-observability]
consumed_by: []
review_ids: [FS-459, FS-460, FS-461, FS-462, FS-463, FS-464, FS-466, FS-468, FS-470, FS-471, FS-503, FS-588, FS-633, FS-636, FS-638, FS-639, FS-640, FS-645, FS-651, FS-655, FS-656, FS-661, FS-698, FS-699, FS-701, FS-711, FS-712, FS-775, FS-777, FS-793]
last_reviewed: 2026-10-16
---

# Platform Security

## 1 · In one paragraph

Platform Security will be the security baseline every product runs on,
from the perimeter to the database, and from our servers to our staff's
laptops and field officers' phones (FS-459, FS-464). Today the controls
that touch customers are designed in the modules that use them (access,
OpenBao for secrets, encryption, audit, traceability), but nothing is
built, and the perimeter, the cluster, backup, endpoints, vulnerability
management, the build pipeline and round-the-clock detection were not
designed at all (FS-460). This module designs them, on open source we can
run the same way on Liquid's Azure Stack, on a customer's premises or
self-managed, with managed detection bought in where we cannot staff it.

## 2 · Who it is for

**Segments:** every customer, and every regulator who inspects one. Banks
and payment providers file our security posture with CBK; Saccos file it
against SASRA's vendor terms (docs/approval-pack.md).

**The problem, concretely:** a bank's due diligence asks for a security
summary, a penetration test report, recovery objectives and an incident
commitment (approval pack items 7 to 10). Today we can answer none of them
with something built.

**People who use it:**

| Role | What they need from it |
|---|---|
| Our engineers | A hardened cluster, a pipeline that refuses unsafe builds, and secrets they never see |
| Our operations and security staff | One view of alerts, and a partner watching around the clock |
| A customer's IT and risk teams | Evidence: test reports, recovery tests, incident reports, the standards we follow |
| A regulator or auditor | The same evidence, without asking twice |

## 3 · What it does

**Every row is Planned, and in phase 1** (FS-464, FS-470): a bank should
not go live on less.

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| SE-01 | A web application firewall in front of every public endpoint (Coraza with the OWASP core rule set, called by the edge proxy as an external processor; FS-699) | Planned | FS-459, FS-464 | 1 |
| SE-02 | An API gateway (Envoy Gateway, decided by a trial against Apache APISIX, FS-698; docs/architecture/flows.md §1) with rate limits per client, and financial-grade API profiles through access (FAPI 2.0, AC-04) | Planned | FS-464 | 1 |
| SE-03 | Protection from denial-of-service attacks upstream, from the hosting provider | Planned | FS-464. To confirm with Liquid (PT-01) | 1 |
| SE-04 | Kubernetes built and checked to the CIS Benchmarks (RKE2), the check run on every change | Planned | FS-461, FS-464 | 1 |
| SE-05 | Network traffic denied by default between workloads (Cilium), each service with its own identity (SPIFFE/SPIRE), and encrypted between services | Planned | FS-464; the same identity signs traceability events (recon RO-23) | 1 |
| SE-06 | Admission rules (Kyverno): only signed images from our registry, no privileged workloads | Planned | FS-464 | 1 |
| SE-07 | Runtime detection on every node (Falco) | Planned | FS-464 | 1 |
| SE-08 | Disks encrypted on every node, databases encrypted at rest (PostgreSQL with transparent data encryption), keys in OpenBao and rotated on a schedule | Planned | FS-403, FS-464 | 1 |
| SE-09 | TLS everywhere, with certificates issued and renewed automatically (cert-manager, OpenBao PKI) | Planned | FS-464 | 1 |
| SE-10 | Backups of clusters, databases and the document vault (Velero for the clusters; CloudNativePG's Barman Cloud plugin for the databases, FS-699; identity ID-15) to object storage in Kenya and to a second Kenyan site, with an immutable copy; restores tested every quarter against recovery objectives per service | Planned | FS-464. The portfolio promises recovery tests twice a year; quarterly exceeds it | 1 |
| SE-11 | Vulnerability management: images and dependencies scanned (Trivy, pinned by digest and mirrored in Harbor; OSV-Scanner; FS-699), a software bill of materials per release, fixes prioritised by CISA's known-exploited list, EPSS and CVSS v4 within set times | Planned | FS-462, FS-464 | 1 |
| SE-12 | A pipeline that refuses unsafe builds: secrets scanning (Gitleaks), static and dynamic testing (Opengrep, ZAP), signed images with build provenance (cosign, SLSA, recorded in Rekor), a private registry (Harbor); on GitLab, with runners in Kenya (FS-701); every step pinned to a commit or digest, never a tag, and images only from a project's own builds or ours, never Bitnami's (FS-699) | Planned | FS-462, FS-464 | 1 |
| SE-13 | Round-the-clock detection and response: managed detection and response from a security operations centre (Sophos MDR through Liquid), fed by our logs and endpoint agents | Planned | FS-458, FS-464. To confirm terms with Liquid. R2: our rota watches until then (owner, 2026-10-12, FS-777) | 1 |
| SE-14 | Endpoints: staff laptops and our servers with endpoint protection, disk encryption and device management (through Liquid: Sophos endpoint, Microsoft Intune; or our own tier where a client chooses it: Wazuh, Microsoft Defender Antivirus, Fleet; FS-712; docs/specs/endpoints.md); field devices enrolled with Android Enterprise (omni-channel OC-19) | Planned | FS-459, FS-464. R1 for Dibon's own devices; institutions' in R2 (owner, 2026-10-12, FS-777) | 1 |
| SE-15 | Mobile apps built and tested to OWASP MASVS level 2 (MobSF in the pipeline), with Play Integrity and App Attest | Planned | FS-462, FS-464. The field-officer app (OC-17) and member apps (OC-01) | 1 |
| SE-16 | A threat model per product (STRIDE for security, LINDDUN for privacy), reviewed at each major change; the payment-instruction path first, written before it is built (rails RL-01, RL-07; FS-588) | Planned | FS-462, FS-464 | 1 |
| SE-17 | An independent penetration test every year and before each customer's go-live, by a tester we do not otherwise use for assurance; the payment-instruction path always in scope (FS-588) | Planned | FS-464; approval pack item 8; assurance rule 1 | 1 |
| SE-18 | Security events (logins, admin actions, step-ups) collected and kept; Restricted data never in a log. On every database that holds money or authority, pgAudit logs each schema change and each write not made by the service's own role, shipped at once to write-once storage in another domain (FS-789, FS-793) | Planned | FS-464; access AC-11; architecture §7 | 1 |
| SE-19 | Incident response: severities, a runbook, and the institution told within an agreed time of a confirmed incident, so it can meet its regulator's deadline | Planned | FS-464; recon RO-18; approval pack item 10; the plan: docs/service-management/incident-management.md (FS-633) | 1 |
| SE-20 | Backups in a separate security domain: their own accounts, administrators and multi-factor authentication; write-once copies, one of them offline (three copies, two media, one off-site, one offline, verified). The offline copy encrypted before it leaves, written only by the backup domain, kept at a third place, moved by two people in sealed, numbered bags with a signed custody log, each copy's hash in the audit chain | Planned | FS-468, FS-470; the offline copy: FS-651, docs/architecture/deployment.md §3 | 1 |
| SE-21 | Backup encryption keys held outside production, so backups can be decrypted with OpenBao down or compromised: wrapped by a key in a recovery vault, a separate OpenBao kept switched off and sealed, opened by any three of five holders, each share encrypted to the holder's hardware security key; every unlock requested, approved by two people other than the initiator, and recorded | Planned | FS-468, FS-470; the recovery vault: FS-656 to FS-659, docs/architecture/deployment.md §4 | 1 |
| SE-22 | Point-in-time recovery: databases archived continuously to write-once storage, restorable to the minute before an attack began | Planned | FS-468, FS-470 | 1 |
| SE-23 | A clean rebuild from code: infrastructure as code and signed images bring up a fresh environment from nothing, never from a machine that was compromised. The same code describes each instance: a configuration record generated from it (each component's version, the settings the specs define, integrations, certificates and their expiry, the ids of secrets, never their values), with drift from the code and certificates near expiry alerted | Planned | FS-468, FS-470; the configuration record: FS-639, FS-640, docs/service-management/README.md §3 | 1 |
| SE-24 | Safe mode, decided in advance: collections keep paying into institutions' own paybills and their cores keep running; new outgoing payments queue and reconcile later; named people decide when to enter and leave it. M-Pesa's fallback for a paybill with validation set to complete, so payments go through while our check does not answer; queued payouts checked against the rail's statement before release, so nothing paid by hand meanwhile is paid twice; every manual act during an outage approved afterwards | Planned | FS-468, FS-470; the rails without us: FS-661, docs/architecture/README.md §3. In R1 (owner, 2026-10-12, FS-775): every R1 journey's outage row relies on it; the institution's side is handbook HB-70 to HB-78 | 1 |
| SE-25 | A ransomware drill twice a year: a restore into a clean environment against the clock, with backup keys taken from escrow | Planned | FS-468, FS-470 | 1 |
| SE-26 | Privileged access for Dibon's engineers: hardware security keys, each with a registered backup; break-glass accounts sealed and split between two people like the backup keys (SE-21), every use alerted and reviewed. One identity per engineer in a central Dibon Keycloak, brokered into each instance and never copied; no standing access to an institution's data; access just in time, against a ticket, scoped and expiring, approved by the institution where it runs its own operations; an access register of every grant, compared with the institution's own records each month. No database superuser and no human login to a database that holds money: break-glass only, two people, recorded and alerted; a data fix only as an approved posting (FS-789, FS-793) | Planned | Owner, 2026-10-06 (FS-503); FS-645: docs/architecture/README.md §9 | 1 |
| SE-27 | Restricted fields encrypted one by one: government ID numbers and other Restricted values encrypted by the service with OpenBao's transit engine before they reach a database, and found by a keyed hash, so a database query, a backup or a replica shows none of them in clear | Planned | FS-636. SE-08's encryption at rest protects a stolen disk, not a query by someone with database access. Owner, 2026-10-08: in R1 (FS-638) | 1 |

**Recovery objectives** (agreed 2026-10-05, FS-466; approval pack item 9).
Services are tiered by what they hold, not by product. These objectives
are for warm standby, the default availability model; each institution's
model sets its own in its contract (docs/architecture/deployment.md §2,
FS-655):

| Tier | Services | Data that may be lost | Time to recover |
|---|---|---|---|
| 1 · moves or records money, or lets people in | Ledgers, rails, collections, gateway, escrow, approvals, login and one-time codes, sanctions screening | None if a server fails (a synchronous standby); at most 5 minutes if the site is lost | Minutes for a server, automatically; 4 hours for the site |
| 2 · runs the business | Reconciliation, cases, portals, Odoo, campaign messages | 1 hour | 8 hours |
| 3 · analyses | Insights, dashboards, reports | 24 hours | 72 hours |

- Payments the rails confirmed inside a lost window are recovered from the
  rails' own records (Pull Transactions, rails RL-20) and bank statements,
  and matched again by reconciliation.
- Restores are tested every quarter inside Dibon (SE-10), and a full
  site failover is exercised with each customer twice a year.
- **These objectives are for failures.** Recovery after a compromise is
  set separately (FS-468).
- For a self-managed deployment we commit to the design and the runbook;
  the objectives depend on the customer's infrastructure.

**Incident commitments** (agreed 2026-10-05, FS-466; approval pack item 10):

| Event | First notice | Updates | Written report |
|---|---|---|---|
| Significant security incident: a compromise, or an attack that takes a tier-1 service down | Within 4 hours of confirming it, by phone and email to the institution's named contacts; a strong suspicion counts, labelled "suspected". Target: 1 hour (FS-471) | Every 4 hours until contained | Preliminary within 12 hours; root cause within 5 working days |
| Personal data breach | Within 24 hours at the latest: half the 48 hours a processor has to tell the controller (Data Protection Act s.43(3), law register LR-17), so the institution can meet the Data Commissioner's 72 | With the incident | As above |
| Other security events | In the monthly service review | — | — |

- **We start at 4 hours** (FS-471): a team of three on call can keep it
  with managed detection (SE-13) watching around the clock. The 1-hour
  target is signed once that service is contracted and the rota has at
  least five people (docs/operating-model.md).
- CBK's guideline for payment service providers sets those customers' own
  deadline: read as 24 hours or as 2 hours, to verify against the text
  before a payment provider signs (FS-464). Four hours meets a 24-hour
  deadline; if the text says 2 hours, a payment provider needs the 1-hour
  target first.
- No service credits yet; commercials are parked (FS-024).

**Recovery after a compromise** (agreed 2026-10-05, FS-468, FS-471): a
compromise is not a failure. The systems must be proven clean before they
run again, which takes longer than any failover.

| Kind of compromise | Commitment to start | Target |
|---|---|---|
| Contained to one institution or one service | That institution's services restored in a separate, clean environment within 4 hours | 1 hour |
| Platform-wide | Safe mode within 4 hours, so money keeps moving safely (SE-24); a clean restore of tier 1 within 72 hours (SE-20 to SE-23) | Safe mode in 1 hour; clean restore in 24 hours |


## 4 · Where it sits

**Depends on:** access (identities, step-up and security events) and
recon-observability (metrics, logs and alerting, RO-16 to RO-18).
**Used by:** every module, which is why no module lists it in its own
front matter.

**Each institution has its own instance** (architecture §9, FS-491): its
own namespace, databases, keys and backups, built from the same code.

**Who holds which record** (docs/architecture/README.md §2):

| Record | System of record | This module |
|---|---|---|
| Funds and balances | The institution's core, or Kapu Core | Protects; never holds |
| Keys, certificates and secrets | OpenBao | Holds, through OpenBao |
| Security events, findings, test reports | Platform Security | Holds. Append-only |
| Backups | Object storage in Kenya | Holds copies; restores only under change control |

**What this module never stores:** a secret in code, a log or a ticket.

**Under each ledger mode** (docs/architecture/README.md §4):

| | Integrated — customer has a core | Native — no core; Fineract is the ledger |
|---|---|---|
| Where funds are posted | The institution's core; the core's own security is the institution's | Kapu Core, protected and backed up here |
| What differs in this module | We protect our services and the connection to the core | We also protect and back up the ledger itself |
| What the customer must provide | Its security contacts and incident channel; its own controls on the core | Its security contacts and incident channel |

## 5 · How it works

```
  internet
     |
  [ DDoS scrubbing (provider) ]                        SE-03
     |
  [ WAF: Coraza + OWASP CRS ] -> [ API gateway ]       SE-01, SE-02
     |
  +------------------- Kubernetes (CIS) ---------------------+  SE-04
  |  default-deny network, service identity, mTLS            |  SE-05
  |  signed images only, no privileged pods                  |  SE-06
  |  runtime detection on every node                         |  SE-07
  |  services <-> OpenBao (keys)   databases (encrypted)     |  SE-08/09
  +---------------------------------------------------------+
     |                         |
  backups to Kenya x2      logs and endpoint agents -> 24/7 SOC (MDR)
  SE-10                    SE-13, SE-14, SE-18
```

**Standards we follow:** NIST CSF 2.0 as the frame; CIS Controls v8.1 and
CIS Benchmarks for hardening; ISO/IEC 27001:2022 Annex A for the
certification we are working towards; OWASP ASVS 5.0 (level 2, level 3
for money flows) and the API Security Top 10; FAPI 2.0 for payment APIs;
CVE, CWE, CVSS v4, EPSS and CISA's known-exploited list for vulnerability
priority; STRIDE and LINDDUN for threat models; SLSA and SBOMs
(CycloneDX) for the supply chain; OWASP MASVS and its testing guide, the
Mobile Top 10 and NIST SP 800-163 for mobile. Kenyan: CBK's cybersecurity
guidance note and its draft risk guidelines (September 2026), CBK's
guideline for payment service providers, SASRA's information-system
guidelines, and the Computer Misuse and Cybercrimes Act with the critical
information infrastructure regulations (law register LR-20).

## 6 · Rails and integrations

| Rail / system | Direction | Feed | Status |
|---|---|---|---|
| Hosting provider's DDoS protection | in | network | Planned (SE-03) |
| Managed detection and response (Sophos, through Liquid) | out / in | log and endpoint telemetry; alerts back | Planned (SE-13) |
| Device management (Intune, Android Enterprise) | in / out | device enrolment and policy | Planned (SE-14) |
| Vulnerability feeds (CVE, EPSS, CISA KEV) | in | daily pull | Planned (SE-11) |

## 7 · Regulatory position

- **Custody:** none.
- **Licence relied on:** none; this is how we meet our customers'
  regulators' expectations of a vendor.
- **Regulators:** CBK and SASRA through our customers; ODPC for personal
  data; NC4 if a customer's system is designated critical information
  infrastructure.
- **Data:** security events are Confidential; a finding that describes an
  unfixed weakness is Restricted. Telemetry sent to the managed-detection
  provider leaves our boundary: where it is processed is to be confirmed
  before contract (FS-464).
- **Open legal checks:** FS-464.

## 8 · Controls

- **Attribution:** every administrative act on the platform is
  attributed and re-authenticated; no shared administrator accounts.
- **Mandates:** a production change, a restore and a key rotation each
  need a second person.
- **Audit:** append-only; a finding is closed with evidence, never
  deleted.
- **Exceptions:** a control that cannot run blocks what it guards: an
  unsigned image does not start, a failed scan does not ship.

## 9 · Deployment

The same build on Liquid's Azure Stack, on a customer's premises or
self-managed: on Azure Stack we use only compute and Blob storage, and run
everything else ourselves, because the Stack's database and Kubernetes
services are deprecated or discontinued and its monitoring sends data to
public Azure outside Kenya (FS-461). Managed detection telemetry is the one
flow that may leave; it is named in §7.

## 10 · What it does not do

- Certify. ISO 27001 certification is by an accredited body (LC-04).
- Audit a customer. That is assurance, for non-customers only
  (docs/assurance.md).
- Replace a customer's own security on its own systems.

## 11 · Open questions

None open in the register.

## 12 · Sources

- REVIEW.md FS-458 to FS-464; research of 2026-10-05 (Azure Stack Hub
  service availability, standards and tool licences).
- docs/architecture/README.md §3, §6, §6.1, §7; docs/approval-pack.md.

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-17](../law/LR-17.md) The Data Protection Act (Cap. 411C).** Regulator: Office of the Data Protection Commissioner. Made under: An Act of Parliament. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2019/24/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 43 | s. 43(3) | A breach with a real risk of harm notified to the Data Commissioner within seventy-two hours, and to the person affected; a processor tells the controller within forty-eight hours where practicable (43(3)) |
