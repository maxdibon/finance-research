---
id: architecture-technology
name: Architecture technology — the register of components we run
kind: architecture
status: draft
released: 2026.10.15
owner: Solution architect
classification: Internal
review_ids: [FS-217, FS-403, FS-464, FS-693, FS-694, FS-695, FS-697, FS-698, FS-699, FS-700, FS-701, FS-703, FS-705, FS-712, FS-750, FS-759, FS-792, FS-896, FS-932, FS-970]
last_reviewed: 2026-10-26
---

# Technology: the register of components we run

Every third-party component the platform runs or builds with, what it is
for, why we chose it over its alternatives, and when we last checked it
(FS-699, FS-703). Our own services and their contracts are in [the
specs](../specs/README.md); how the components work together is in
[flows](flows.md).

## 1 · The rules

1. **A component is named in a spec only after it has a row here,** with
   the alternatives considered and why it won.
2. **Licences follow [the README](README.md) §6.1;** a CNCF project is the
   default where one fits (FS-217).
3. **Each row is checked every quarter:** its licence, who governs it,
   whether it is maintained, and any security incident. A change in any of
   them reopens the row. In one year, Kong's open-source edition froze
   (March 2025), Bitnami's free images ended (August 2025), pgBackRest was
   archived and revived (April 2026), and Trivy's releases were hijacked
   (March 2026).
4. **Images come from the project's own builds or ours,** pinned by digest
   and mirrored in Harbor; nothing from Bitnami's catalogue, which moved
   to a paid subscription on 28 August 2025 and froze the rest.
5. **Every pipeline step is pinned to a commit or a digest, never a tag,**
   since a tag can be moved under us, as Trivy's were.

## 2 · Classes

Each component has one class, by the job it does in the platform:

| Class | What it covers |
|---|---|
| **Edge** | Everything between the internet and our services: protection, the proxy, the firewall, rate limits |
| **Application** | What the institution's people use: our services, the ledger, the back office, insights |
| **Data** | Where facts are kept and carried: databases, object storage, the event bus, their backups |
| **Security** | Who and what may act, and the evidence of it: identity, secrets, policy, detection, the transparency log |
| **Platform** | What everything runs on: Kubernetes, the network, certificates, cluster backups |
| **Operations** | How we see and answer: telemetry, dashboards, on-call, the service desk |
| **Delivery** | How code becomes a running, signed release: the repository, pipelines, scanners, the registry, GitOps |
| **Collaboration** | How the team talks, meets and keeps what it shares: chat, meetings, shared credentials, the code's mirror |

## 3 · The register

**Verdict:** *Keep* · *Change* (replaces what was named before) · *Trial*
(decided by a test against a named rival) · *Evaluate* (a candidate, not
yet tried) · *Bought* (commercial, chosen with its supplier). All checked
2026-10-10.

### Edge

| Component | Role | Licence | Governed by | Verdict | Alternatives | Why |
|---|---|---|---|---|---|---|
| Provider protection | Absorbs floods upstream (SE-03) | Commercial | Liquid | Bought; to confirm with Liquid | — | Only the provider can absorb a flood before it reaches us |
| Envoy Gateway and Envoy | The edge proxy and its control (SE-02) | Apache-2.0 | CNCF (Envoy, graduated) | Trial, the default | APISIX; Kong, out (its open-source edition stopped at 3.9.1 in March 2025) | The Kubernetes Gateway API; the same Envoy that Cilium runs; the CNCF default (FS-698) |
| Coraza | Web application firewall, OWASP Core Rule Set v4 (SE-01) | Apache-2.0 | OWASP | Keep; called by Envoy as an external processor, measured in the trial | ModSecurity (OWASP, not built for Envoy); a provider's WAF in front, as an extra layer | The rule set is the asset; Coraza's own WASM filter warns of memory and speed issues (FS-699) |
| Envoy's rate-limit service, with Valkey | Shared counts per client | Apache-2.0; BSD-3 | Envoy; Linux Foundation | Trial, with the gateway | Redis, now under AGPL, SSPL or its own licence | Valkey keeps a permissive licence |

### Application

| Component | Role | Licence | Governed by | Verdict | Alternatives | Why |
|---|---|---|---|---|---|---|
| Apache Fineract | The ledger (kapu-core-fineract) | Apache-2.0 | Apache Software Foundation | Keep | A bought core | Open, proven in microfinance, ours to host (FS-136) |
| Odoo | Back office: Sign, Helpdesk, HR, CRM | LGPL-3.0 core; Enterprise bought | Odoo SA | Keep; Enterprise for institutions (FS-644), behind the back-office gateway (FS-970) | Odoo Community with OCA, ERPNext (GPL) and Tryton (GPL), to evaluate (FS-970); Zoho for a business's own books | Dibon is a partner; one back office for every product |
| Apache Superset | Insights | Apache-2.0 | Apache Software Foundation | Keep | Metabase (AGPL) | Permissive, and governed (FS-230) |
| Flowza | The team inbox for conversations | Dibon's own | Dibon | Keep, once FS-664 to FS-666 close | — | Ours; messaging stays the only sender (FS-663) |

### Data

| Component | Role | Licence | Governed by | Verdict | Alternatives | Why |
|---|---|---|---|---|---|---|
| PostgreSQL, run by CloudNativePG | Every database, Fineract's and OpenBao's included | PostgreSQL; Apache-2.0 | PostgreSQL community; CNCF (sandbox) | Keep | Other operators | One engine for everything; synchronous standby in a site, replica clusters across sites (deployment §2) |
| CloudNativePG's Barman Cloud plugin | Database backups and the continuous archive (SE-10, SE-22) | Apache-2.0 | CloudNativePG | Change: replaces pgBackRest | pgBackRest, archived in April 2026 when its sponsor was sold, then revived; its plugin for CloudNativePG at 0.0.3 | The operator's own, supported path (FS-699) |
| Apache Kafka, run by Strimzi | The event bus | Apache-2.0 | Apache Software Foundation; CNCF (Strimzi) | Keep; no cluster at site B under cold or warm standby (FS-694) | NATS JetStream; RabbitMQ | Ordered, replayable, the outbox in front of it |
| Event schemas in the code repository | JSON Schema and AsyncAPI files, checked in the pipeline | — | Dibon | Change: no runtime registry in R1 | Apicurio, on PostgreSQL, when outside parties consume our events; Karapace; Confluent's registry (its licence fails §6.1) | The same protection with nothing to run (FS-697) |
| Ceph through Rook; Azure Blob | Object storage: the document vault, Odoo's files | LGPL (Ceph), Apache-2.0 (Rook); commercial (Blob) | Ceph Foundation; CNCF (graduated); Microsoft | Keep | MinIO (AGPL) | On premises and on Liquid's Azure Stack (FS-500) |
| Debezium | Change-data capture from an institution's own core into recon, in integrated mode (recon §3) | Apache-2.0 | The Debezium project; its governance to confirm at evaluation | Evaluate, with the first integrated-mode institution (FS-792) | The core's own extracts, nightly; a vendor's replication tool | Reads the core's log, so no load on its tables and nothing missed between extracts |
| Valkey | The shadow ledger's balances in memory (recon §12) | BSD-3 | Linux Foundation | Keep (also the gateway's rate limits) | Redis, now AGPL | One in-memory store for the platform, under a permissive licence |

### Security

| Component | Role | Licence | Governed by | Verdict | Alternatives | Why |
|---|---|---|---|---|---|---|
| Keycloak | Sign-in, roles, step-up (access-keycloak) | Apache-2.0 | CNCF (incubating) | Keep | Authentik; Zitadel | Realms, step-up and FAPI support (FS-198) |
| OpenBao | Keys and secrets; signing inside it | MPL-2.0 | Linux Foundation | Keep; its data in PostgreSQL, so it crosses sites with the databases (FS-693) | HashiCorp Vault (BSL) | Vault's API under an allowed licence (FS-403) |
| SPIFFE and SPIRE | Each service's identity (SE-05) | Apache-2.0 | CNCF (graduated) | Keep | — | Signs events and mutual TLS (RO-23) |
| Kyverno | Admission rules: signed images only (SE-06) | Apache-2.0 | CNCF | Keep | OPA Gatekeeper | Rules written as Kubernetes objects |
| Falco | Runtime detection (SE-07) | Apache-2.0 | CNCF (graduated) | Keep | Tetragon | The standard |
| Rekor v2 | The transparency log for chain heads and image signatures (RO-24, SE-12) | Apache-2.0 | Sigstore (OpenSSF) | Keep (FS-700) | Trillian v1, which needs MySQL (GPL); the public Sigstore instance, without a service level and outside Kenya | Built on Trillian Tessera, files only, checked with standard tools; its checkpoints witnessed |
| Warpgate | The bastion: people's way in, sessions recorded | Apache-2.0 | Warp Tech | Evaluate (FS-695) | Teleport (its community edition is no longer open source); Apache Guacamole; HashiCorp Boundary (BSL) | One gateway for SSH, Kubernetes and PostgreSQL, sign-in through Keycloak |
| ClamAV | Scans uploads to the vault | GPL-2.0, a separate service | Cisco | Keep (FS-525) | A commercial engine where a customer pays | Allowed as a named service |
| Sophos MDR and endpoint; Microsoft Intune | Managed detection round the clock; endpoint protection; device management (SE-13, SE-14) | Commercial | Sophos; Microsoft | Bought through Liquid: the default tier, for Dibon and for institutions (FS-712) | Our own tier, below | People watching round the clock, able to isolate a machine; the managed tier while the customer base grows |
| Wazuh | Detection in our own tier: file changes, vulnerabilities, configuration checks, logs, automatic blocking | GPL-2.0 core, unmodified and separate, by decision; indexer and dashboard Apache-2.0 | Wazuh Inc. | Keep, for a client who prefers it or cannot pay for Sophos (FS-712) | Sophos MDR; Elastic Security | Open, broad; about 4 vCPU and 8 GiB per 25 devices; needs people to watch it |
| Microsoft Defender Antivirus | Malware protection in our own tier, Windows | Comes with Windows | Microsoft | Keep, in our own tier | Sophos | Already on every Windows device |
| Fleet | Device management in our own tier | MIT core; some features paid | Fleet Device Management | Evaluate (FS-712) | Intune | Windows, macOS, Linux and phones, policies in git |
| pgAudit | Every schema change and every write not made by the service's own role, logged from each money database, shipped at once off the instance (FS-789; recon §10) | PostgreSQL licence | pgAudit project | Proposed, in R1 for the ledger database | The database's own statement log, which logs too much and proves less | The audit a manipulator cannot reach |
| Database activity monitoring | Alerts on unusual database activity, from pgAudit's log | Open | — | Open (FS-790): an open-source rule set on our logs, or a proprietary tool where a bank requires one | Guardium-class products; rules in Grafana | Detection of what pgAudit records |

### Platform

| Component | Role | Licence | Governed by | Verdict | Alternatives | Why |
|---|---|---|---|---|---|---|
| RKE2 | Kubernetes (SE-04) | Apache-2.0 | SUSE | Keep | Talos Linux (MPL-2.0); kubeadm | Hardened to the CIS Benchmarks by default |
| OpenTofu, with cloud-init | Infrastructure as code: networks, machines, clusters, permissions and budgets, on Azure and Azure Stack; cloud-init installs RKE2 on the machines | MPL-2.0 (OpenTofu); Apache-2.0 or GPL-3.0 (cloud-init) | Linux Foundation; Canonical | Keep (FS-932) | Terraform (Business Source License since 2023, as Vault); Bicep (Azure only); Pulumi | Terraform's language and providers, under an open licence; its state never in git, kept in Azure storage signed into with Entra |
| Cilium | Network, policy, encryption between services (SE-05) | Apache-2.0 | CNCF (graduated) | Keep | Calico | Default deny, with Envoy inside |
| cert-manager | Certificates, issued and renewed (SE-09) | Apache-2.0 | CNCF (graduated) | Keep | — | The standard |
| Velero | Cluster objects and volumes (SE-10) | Apache-2.0 | CNCF (sandbox, since 2026) | Keep | — | Databases go through Barman instead |

### Operations

| Component | Role | Licence | Governed by | Verdict | Alternatives | Why |
|---|---|---|---|---|---|---|
| OpenTelemetry | Telemetry from every service | Apache-2.0 | CNCF (graduated) | Keep | — | Vendor-neutral |
| Prometheus | Metrics, SLO recording rules (RO-17) | Apache-2.0 | CNCF (graduated) | Keep | — | The standard |
| Grafana, Loki, Tempo | Dashboards and alerting; logs; traces | AGPL-3.0, unmodified and separate | Grafana Labs | Keep; Tempo for traces, not Jaeger (FS-699) | Jaeger v2 (CNCF) | One stack, one screen |
| GoAlert | On-call: rotas, escalation, phone calls | Apache-2.0 | Target | Keep, proposed (observability-grafana §12) | Grafana OnCall (its open-source edition archived); PagerDuty | Active (v0.35.0, September 2026), self-hosted |
| Twilio | Voice and SMS for paging | Commercial | Twilio | Bought | — | Reaches phones anywhere |
| Odoo Helpdesk | The service desk | As Odoo | Odoo SA | Keep | A separate suite | One record of every request (service management §7) |

### Delivery

| Component | Role | Licence | Governed by | Verdict | Alternatives | Why |
|---|---|---|---|---|---|---|
| GitHub, Team plan | Code, pull requests, issues and Projects, Actions; settings in specs/github.md | Proprietary; Team bought, Enterprise Cloud when single sign-on is needed | GitHub (Microsoft) | Keep (FS-896; GitLab Premium replaced) | GitLab Premium, at $29 a seat against $4; GitLab self-managed, if code must stay in Kenya | One place for code, change records and stories |
| GitHub Actions runners, self-hosted | Run every job that holds a secret, signs or deploys, in Kenya | MIT | GitHub (Microsoft) | Keep (FS-896) | Hosted runners, for jobs with no secret only | Secrets and test data never leave Kenya |
| Flux | GitOps: the clusters follow the deploy repository, pulling from GitHub | Apache-2.0 | CNCF (graduated) | Keep (FS-701, FS-896) | Argo CD | Pulls; nothing pushes into a cluster |
| Harbor | The image registry each site pulls from | Apache-2.0 | CNCF (graduated) | Keep | GitHub's container registry | Replicated to each site, so a failover does not wait on Dibon central |
| cosign | Signs images and their provenance (SE-12) | Apache-2.0 | Sigstore | Keep | — | Recorded in Rekor |
| Gitleaks | Secrets in code | MIT | Community | Keep | TruffleHog (AGPL) | Permissive |
| Opengrep | Static analysis | LGPL-2.1, unmodified | Community fork of Semgrep | Keep | Semgrep (its rules' licence changed) | Open rules |
| Trivy | Image and dependency scanning (SE-11) | Apache-2.0 | Aqua Security | Keep: pinned by digest and mirrored in Harbor | Grype | The standard; its March 2026 compromise is why rule 5 exists |
| OSV-Scanner | A second dependency scanner | Apache-2.0 | Google | Keep | — | A second opinion |
| ZAP | Dynamic testing | Apache-2.0 | Checkmarx-sponsored | Keep | — | The standard |
| MobSF | Mobile app testing | GPL-3.0, a test tool only | Community | Keep (§6.1) | — | Never shipped |

### Collaboration

All open (FS-759): chosen with the team, each against the licence rule
and the rule that no customer data leaves our own systems.

| Component | Role | Licence | Governed by | Verdict | Alternatives | Why |
|---|---|---|---|---|---|---|
| Team chat: Zulip or Mattermost | Notifications from GitHub and Grafana; quick coordination, written into a pull request or the register when it decides anything | Zulip: Apache-2.0, every feature in the free self-hosted edition. Mattermost: the compiled Team Edition MIT, its source AGPL-3.0 | Kandra Labs; Mattermost Inc. | Evaluate: a week's trial of each with the team | Rocket.Chat (MIT community edition); Slack or Microsoft Teams, hosted outside Kenya | Self-hosted in Kenya, with GitHub integrations. Zulip's topics suit writing things down; Mattermost feels like Slack. What Mattermost's free edition includes in 2026 is to confirm |
| Video meetings | The weekly meeting, customers' reviews | Jitsi Meet: Apache-2.0 | 8x8 and its community | Evaluate | Google Meet, Microsoft Teams, Zoom | Self-hosted if we want recordings kept in Kenya; otherwise whatever the customer uses |
| Shared credentials | The few logins that cannot use single sign-on: providers' portals, and GitHub's until single sign-on | Vaultwarden: AGPL-3.0, run unmodified; Bitwarden's clients | Its community | Evaluate | Bitwarden or 1Password, hosted | Never for secrets the platform uses, which stay in OpenBao |
| The code's mirror | A second copy of every repository, in Kenya (github spec §5) | Plain git over SSH; or Gitea: MIT | — ; Gitea Ltd | Evaluate: plain git proposed | Forgejo, GPL-3.0 since v9, which the licence rule would need a decision for | A mirror only has to receive and hold; a browsing interface is a nicety |
| Email, calendar and files | The company's own mail, calendar and shared files | — | — | Open: not written down (FS-710) | Microsoft 365; Google Workspace; Odoo's own | Decides where client material is backed up |

## 4 · Open

- The gateway trial: Envoy Gateway against APISIX, with Coraza both ways
  (FS-698).
- Warpgate's evaluation, against the licence rule and our availability
  needs: it runs as a single instance (FS-695).
- Rekor v2 on its files backend: where the log's files live, so a
  checkpoint reaches its witnesses only once the files are at the second
  site (FS-700).
- The provider protection's terms with Liquid (SE-03).
- The collaboration tools above: chat, meetings, shared credentials, the
  mirror, and where email and files live (FS-759).
