---
id: gitlab
name: GitLab — code, reviews, planning and pipelines — component specification
kind: spec
type: component
status: draft
release: R1
implements: [platform-security]
depends_on: [access-keycloak]
used_by: []
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-699, FS-701, FS-703, FS-745, FS-746, FS-747, FS-750, FS-751, FS-753, FS-757, FS-758, FS-769, FS-805, FS-846]
last_reviewed: 2026-10-15
---

# GitLab — code, reviews, planning and pipelines — component specification

How Dibon uses GitLab for R1: where code and documents live, how a change
is reviewed and approved, how work is planned, and how a release reaches
the clusters (FS-701, FS-750). It is the tool behind
[ways of working](../service-management/ways-of-working.md): that page says who decides;
this one says how GitLab is set to enforce it. Sources: GitLab's
documentation on merge requests, approvals, code owners, protected
environments, deployment approvals, deploy freezes, push rules, SAML
single sign-on, CI/CD secrets, runners, components, Pages, epics,
iterations, labels, audit events and roles, read on 2026-10-12, with each
feature's tier as GitLab states it. Nothing here is set up yet.

## 1 · Purpose and scope

Where every change is proposed, reviewed, approved and released, with the
record kept.

| Id | Capability | In R1 |
|---|---|---|
| SE-12 | A pipeline that refuses unsafe builds | Yes, on GitLab with runners in Kenya |
| SE-26 | Privileged access for Dibon's engineers, by hardware key | Yes, for GitLab through the engineers' Keycloak |
| AC-02 | Staff single sign-on | Yes, GitLab included |
| SE-06 | Admission rules: only signed images | No: R2; the pipeline signs from R1 |
| SE-23 | A clean rebuild from code | No: R2; the manifests live here from R1 |

**Out of R1:** merge trains, until the code repository's merge rate needs
them; GitLab's own security scanners and DORA dashboards, which are
Ultimate (§3).

**Where it sits.**

```
  +--------------------------+      +--------------------------+      +--------------------------+
  | ACCESS                   |      | GITLAB                   |      | RUNNER                   |
  | signs in, steps up       |--1-> | holds code, reviews,     |--2-> | builds, tests, scans,    |
  | [keycloak]               |      | plans, runs pipelines    |      | signs                    |
  |                          |      | [gitlab]                 |      | [gitlab_runner]          |
  | engineers' realm,        |      |                          |      |                          |
  | hardware keys            |      | GitLab.com, Premium      |      | in Kenya, ours           |
  +--------------------------+      +--------------------------+      +--------------------------+
                                                  |                                 |
                                                  | 5                               | 3
                                                  v                                 v
  +--------------------------+      +--------------------------+      +--------------------------+
  | OBSERVABILITY            |      | FLUX                     |      | HARBOR                   |
  | keeps the audit trail    | <-6--| follows the manifests    | <-4--| keeps signed images      |
  | [grafana]                |      | [flux]                   |      | [harbor]                 |
  |                          |      |                          |      |                          |
  |                          |      | through GitLab's agent   |      | a copy at each site      |
  +--------------------------+      +--------------------------+      +--------------------------+
```

| # | What crosses |
|---|---|
| 1 | Sign-in by single sign-on; the person's role groups |
| 2 | A pipeline job, with a short-lived token |
| 3 | A signed image, by digest |
| 4 | The image each site pulls |
| 5 | The manifests, at the agreed window |
| 6 | Audit events and deployment records, exported |

**Related:** implements
[platform-security](../modules/platform-security.md); depends on
[access-keycloak](access-keycloak.md); used by none yet; the rules it
enforces are [ways of working](../service-management/ways-of-working.md) and
[service management](../service-management/README.md) §2; the release
path is [flows](../architecture/flows.md) §4.

## 2 · Version and hosting

- **GitLab.com, Premium,** one top-level group for Dibon. GitLab updates
  it; we run nothing of GitLab's but the runners and the agent.
- **Code and documents live outside Kenya** on GitLab.com. They hold no
  customer data, and the rules keep it so ([rules](../rules.md) §1):
  no personal data, no client material, no secrets in a repository, an
  issue or a comment. A customer's confidential detail is referred to,
  not copied: client material lives in Dibon's Odoo Documents, in Kenya,
  and a document links to it (rules, Dibon 10; FS-805). Git has no read
  rights per file or section, so nothing restricted belongs in a project
  the whole team reads. Should code have to stay in Kenya, GitLab self-managed is
  the alternative, at the cost of running it; GitLab Dedicated, the
  hosted single-tenant option, is Ultimate and offers no African region.
- **Runners are ours,** self-managed in Kenya at Dibon central: GitLab's
  hosted runners never run a job that holds a secret or touches a
  customer's environment.
- **The agent for Kubernetes** runs in each cluster and pulls; nothing
  in GitLab reaches into a cluster.

## 3 · Features used and not used

| Feature | Tier | Used | Why |
|---|---|---|---|
| Merge requests: drafts, assignee and reviewers, threads, suggestions | Free | Yes | Every change (ways-of-working §2) |
| Approval rules; prevent the author approving; reset on new commits | Premium | Yes | A peer and the code owners approve; never the author |
| Code owners, in sections; code owner approval on main | Premium | Yes | Approval follows the role (ways-of-working §1, §2) |
| Merge checks and auto-merge | Free | Yes | Pipeline passed, threads resolved, branch current |
| Merge request dependencies | Premium | Yes | Code waits for its spec |
| Merge trains | Premium | No, in R1 | Our merge rate does not need them yet |
| Push rules: reject unsigned commits, refuse secret files, branch names | Premium | Yes | Commits signed; a .env or key file refused at push |
| Signed commits, by SSH key | Free | Yes | Each commit attributable |
| Protected environments, with deployment approvals | Premium | Yes | The change authority approves a production deploy (§4.5) |
| Deploy freezes | Free | Yes | The change calendar's blackouts, enforced |
| SAML single sign-on for the group, with group sync | Premium | Yes | Sign-in through the engineers' Keycloak; role groups from it (to confirm group sync's tier) |
| SCIM provisioning | Premium | No | Keycloak does not provision by SCIM; leavers are removed by single sign-on and the monthly access review |
| Two-factor authentication enforced | Free | Yes | For anyone signing in without single sign-on, such as the break-glass owner |
| Custom roles | Ultimate | No | The standard roles suffice (§4.1) |
| CI/CD components, pinned by version | Free | Yes | The checks, scans and signing shared across repositories, each pinned |
| ID tokens to OpenBao | Free | Yes | Jobs fetch secrets from OpenBao with a short-lived token; no long-lived secret in GitLab |
| The `secrets` keyword for external secret stores | Premium | To test | Built for HashiCorp Vault; whether it works with OpenBao, whose API is the same, is check G6 |
| GitLab Secrets Manager | — | No | Secrets stay in OpenBao |
| Secret push protection | Ultimate | No | Gitleaks in the pipeline and the push rules instead |
| Security scanners and dashboards | Ultimate | No | Our own tools in the pipeline (SE-11, SE-12) |
| Review apps and Pages parallel deployments | Free | Yes | A preview of the reader for each merge request |
| Pages with access control | Free | Yes | The reader, for project members only |
| Issues, boards, milestones | Free | Yes | Work and stories (testing.md) |
| Scoped labels | Premium | Yes | `kind::`, `release::`, `area::`: one value each |
| Epics | Premium | Yes | A release or a journey's work |
| Iterations | Premium | Yes | Two-week cycles |
| Wiki | Free | No | Documents live in this repository |
| Service Desk | Free | No | Odoo Helpdesk is the service desk |
| Container registry; dependency proxy | Free | No | Harbor is the registry each site pulls from |
| Value stream analytics | Free | Yes | Lead time per stage |
| DORA metrics | Ultimate | No | The four measures computed by our own job from deployments (§15) |
| Audit events | Free and above | Yes | Exported to our observability; streaming is Ultimate |
| Compliance center and frameworks | Premium | Yes | The regulated projects labelled, their settings checked |
| GitLab Duo (AI) | Add-on | No | Not adopted; Claude works through merge requests (ways-of-working §2) |

## 4 · Settings

### 4.1 Groups and roles

- **One top-level group,** with a subgroup per area: `docs`, `code`,
  `platform` (manifests, runners).
- **A GitLab group per role** (ways-of-working §1): `@dibon/team-lead`,
  `@dibon/architects`, `@dibon/security`, `@dibon/compliance`,
  `@dibon/product`, `@dibon/delivery`, `@dibon/engineering`,
  `@dibon/operations`, `@dibon/commercial`; filled from the engineers'
  Keycloak groups by single sign-on.
- **GitLab roles by job:**

  | GitLab role | Who | Why |
  |---|---|---|
  | Owner | The team lead and one deputy | GitLab's own role, not ours: two, so the group is never locked out; no more |
  | Maintainer | The engineering lead and the operations lead | Settings, protected branches and environments, deploy freezes |
  | Developer | Engineers, and **every role holder who approves**: the compliance and risk officer and the commercial lead included | Code owner approval needs Developer or above |
  | Planner | The delivery lead and the project manager | Plans issues and epics without changing code |
  | Reporter | Anyone who only reads and comments | |
  | Guest | Outside reviewers, case by case | |

### 4.2 Branches and merge requests

- **main is protected:** no one pushes to it; merge only by a merge
  request; code owner approval required.
- **Approval rules:** one approval from anyone eligible, and the code
  owners' sections; the author and committers cannot approve; approvals
  reset when commits are added; approval rules cannot be edited in a
  merge request.
- **Merge checks:** the pipeline must succeed; every thread resolved;
  the branch rebased on main. Squash on merge, with the description as
  the message; the source branch deleted.
- **Templates** in `.gitlab/merge_request_templates/` (ways-of-working
  §2) and `.gitlab/issue_templates/` (a story, a bug, a register point).
- **Git conventions** (branches, commits, rebasing, tags, line endings,
  the register's union merge): ways-of-working §6 (FS-846).

### 4.3 Push rules

Reject unsigned commits; refuse files named like secrets (`.env`,
`*.pem`, `*.key`, `id_rsa*`); branch names `<kind>/<FS id>-<words>`;
commits only from verified addresses.

### 4.4 Pipelines and runners

- **Runners:** ours, in Kenya, as group runners; a separate, protected
  runner for jobs that deploy or sign, which runs only on protected
  branches; containers unprivileged.
- **Components:** the shared jobs (checks, Gitleaks, Opengrep, Trivy,
  OSV-Scanner, ZAP, cosign) as CI/CD components, each pinned to a
  version; every image by digest (technology rules 4, 5).
- **Secrets:** fetched from OpenBao with an ID token at run time; no
  secret stored as a CI/CD variable except the masked, protected tokens
  that cannot be avoided.
- **This repository's pipeline:** `node tools/check.js`, its tests, the
  reader and the Master built; the reader published to Pages from main
  and previewed for each merge request.

### 4.5 Environments and the change calendar

- **Protected environments:** `production` and `staging` per
  institution; only the operations and security groups may deploy.
- **Deployment approvals:** a production deployment waits for the change
  authority's approval in GitLab (ways-of-working §4): the operations lead,
  and the security lead for a security control.
- **Deploy freezes:** the nightly close (21:00 to 03:00 Africa/Nairobi),
  the month-end days, and each customer's go-live freeze, as freeze
  periods; the deploy job refuses inside them unless the merge request is
  labelled `kind::emergency`, with its approval recorded.

### 4.6 Planning

- **Issues** for work; a story cites its journey step and capability
  (testing.md); a register point that becomes work cites its FS id.
- **Epics** for a release (R1a, R1b) and for a journey's build.
- **Iterations** of two weeks; **milestones** for releases.
- **Scoped labels:** `kind::`, `release::`, `area::`, `priority::`.
- **Boards** by iteration and by release.

## 5 · Moving in, and being able to leave

**Moving in, this repository first,** then the code:

1. Create the group, its subgroups and the role groups; turn on single
   sign-on and two-factor authentication.
2. Set main's protection, the approval rules, the push rules and the
   protected environments **before anyone pushes**.
3. Import each repository from GitHub with GitLab's importer, keeping
   its history; switch every clone's remote.
4. Point the reader's address at GitLab Pages; the GitHub repository is
   archived, read-only, and kept for ninety days, then deleted.

**Being able to leave, or to work through an outage** (business
continuity, suppliers):

- **Push mirroring** from every project to a git server of ours at Dibon
  central, in Kenya, so the code and its history are always held twice.
- **A nightly export** of each project's issues, merge requests and
  their threads, through GitLab's API, into the backup store (SE-10,
  SE-20).
- **When GitLab.com is down:** work goes on in local clones; deploys
  wait, which harms nothing running; an urgent fix is an emergency
  change, deployed by the operations lead from the mirror and recorded
  in GitLab afterwards.
- **A restore from the mirror and the export** is tested twice a year
  with the other recovery drills.

## 6 · Repositories and releases

- **Documents:** this repository, in `docs`.
- **Code:** one repository per service that deploys on its own (Kapu MFI,
  the approval engine, the lender rules, rails, messaging,
  reconciliation, identity), so each versions and releases on its own;
  shared libraries in their own; the shared CI components in
  `ci-components`.
- **Manifests:** one `platform` repository, a folder per institution
  and stage, which Flux follows.
- **Versions:** semantic versions per service; a tag `vX.Y.Z` on main,
  protected; release notes drawn from the merge requests' changelog
  lines.
- **Environments:** named `<institution>/<stage>`, such as
  `roan-capital/staging` and `roan-capital/production`; each production
  protected (§4.5).
- **Promotion, never rebuilding:** the same signed image, by digest,
  moves from staging to production.

## 7 · Identity and tokens

- **Single sign-on** through the engineers' Keycloak, for the web and
  for git; two-factor authentication for the few accounts outside it,
  such as the break-glass Owner.
- **SSH keys** backed by hardware security keys (the `-sk` key types),
  by policy and the access review, where GitLab.com cannot enforce the
  type for a group.
- **Personal access tokens** avoided; where one is needed, scoped and
  expiring within thirty days (proposed). Automation uses service
  accounts and project or group access tokens, never a person's token.
- **Claude** works as a service account with the Developer role, in the
  projects agreed: it pushes branches and opens merge requests, never
  merges, never holds Maintainer; its token sits in OpenBao and is
  rotated monthly.
- **Restricting the group to known networks** (Premium) is not used in
  R1: people work from anywhere, behind single sign-on and hardware keys.

## 8 · Integrations and communication

- **Grafana:** every deployment marked on its dashboards, from GitLab's
  deployment events, through a webhook into Loki.
- **Odoo Helpdesk:** a ticket names the issue or merge request that fixes
  it; the merge request template has the ticket's number; nothing of the
  customer's is copied across.
- **Notifications:** each person's own, by email; merge-request and
  pipeline events to the team's channel once a chat tool is chosen
  (open, §18).
- **Where discussion happens:** decisions in merge-request threads and
  register rows; chat for quick coordination, and whatever chat
  decides is written into the merge request or the register.

## 9 · Dependencies and large files

- **Renovate** opens merge requests for dependency and image updates:
  security fixes at once, the rest grouped weekly, each pinned digest
  moved. It is AGPL-3.0, run unmodified as a scheduled job on our
  runners, as the licence rule allows (architecture §6.1); GitLab's own
  dependency scanning is Ultimate.
- **Git LFS** for binary files: images, PDFs, spreadsheets, Word files,
  fonts; repository sizes watched.
- **Generated files** (`build/`) are never committed: the pipeline makes
  them.

## 10 · Seats, storage and limits

- **Seats:** every person in the group takes a Premium seat; every
  approver needs the Developer role (§4.1). About ten today: the
  engineers, the customer experience pair, the Odoo consultants, and the
  compliance and commercial roles as they are filled.
- **Storage:** GitLab.com sets a quota per group; repositories, LFS,
  artifacts and Pages count against it. Artifacts expire after thirty
  days (proposed); usage is checked monthly.
- **Compute:** our own runners use none of GitLab's compute minutes.

## 11 · Customers, joiners and leavers

- **Customers have no access to GitLab.** What they see goes through
  Odoo (Project, Helpdesk) and what we choose to share from the reader.
  A customer's confidential detail is referred to, never copied into an
  issue.
- **A joiner** is added to their role groups in Keycloak, and so to
  GitLab, with the GitLab role §4.1 gives them (JN-20).
- **A leaver** is removed from Keycloak the same day, which ends their
  GitLab access; their tokens are revoked and their open merge requests
  reassigned. Each month the members are compared with the roles.

## 12 · Evidence for auditors

What GitLab records answers these, exported and kept seven years with
our evidence (§14):

| Asks for | ISO/IEC 27001:2022 | GitLab's record |
|---|---|---|
| Change management | A.8.32 | Merge requests: the approvals, the pipeline's result, the kind of change; deployment approvals |
| A secure development life cycle; secure coding; security testing | A.8.25, A.8.28, A.8.29 | The pipeline's checks and scans on every merge request |
| Access to source code; access rights | A.8.4, A.5.15, A.5.18 | Members and roles, single sign-on, the monthly comparison |
| Separate environments | A.8.31 | Protected environments, per institution and stage |
| Regulators' change records | The approval pack's change and security items | A quarterly report of merged changes, their kind, approvers and deployments |

## 13 · Contracts

| With | What | How |
|---|---|---|
| Access (Keycloak) | Sign-in, role groups | SAML, the engineers' realm (access-keycloak §3) |
| OpenBao | Secrets for jobs | ID tokens, JWT authentication, scoped per project and branch |
| Harbor | Signed images | Pushed by the protected runner, by digest |
| Clusters | Manifests | The agent and Flux pull; GitLab never pushes into a cluster |
| Observability | Audit events, deployments | Exported by a scheduled job to Loki; deployments feed the four measures |

## 14 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| Code, documents, merge requests, issues | Internal | For the life of the projects | Staff names and comments only; never customers' |
| Pipeline logs | Internal | 90 days (proposed) | None: secrets and data masked |
| Audit events and deployment records | Internal | Exported and kept 7 years with our evidence | Staff actions |

## 15 · Quality and metrics

- **The four measures** (ways-of-working §4): deployment frequency, lead
  time for changes, change failure rate, time to restore, computed weekly
  from GitLab's deployment records by our own job, since GitLab's DORA
  dashboards are Ultimate.
- **Reviews within a working day:** the time from a merge request ready
  for review to its first review, from value stream analytics.
- **Alerts:** a pipeline on main failing (3); a deploy attempted in a
  freeze (2); a change to a protected setting or an Owner added (2)
  (observability-grafana §4).

## 16 · Threats

| Threat | For example | The answer |
|---|---|---|
| Spoofing | A stolen GitLab password | Single sign-on through Keycloak with hardware keys; two-factor enforced for the rest |
| Tampering | A change slipped into main, or a moved tag in a pipeline | Protected main; code owner approval; signed commits; components and images pinned |
| Repudiation | Who approved a deploy is disputed | Approvals and deployments recorded, exported to our evidence |
| Information disclosure | A secret or customer data committed or pasted | Push rules; Gitleaks; the rules; secrets only in OpenBao |
| Denial of service | GitLab.com unavailable | Deploys pause; running services are unaffected; Harbor and Flux keep the last good state |
| Elevation of privilege | A developer edits approval rules or deploys to production | Approval rules locked; protected environments; two Owners only |
| Linkability, identifiability (LINDDUN) | Customer details in an issue | Never: refer to the customer's record, do not copy it |

## 17 · Checks before the build

| # | Check | Pass |
|---|---|---|
| G1 | The author approves their own merge request | Refused |
| G2 | A merge request touching docs/regulation.md without the compliance officer's approval | Cannot merge |
| G3 | A push to main | Refused |
| G4 | A deploy to production during the nightly close, not labelled emergency | Refused by the deploy freeze |
| G5 | A production deploy without the operations lead's approval | Waits |
| G6 | A job fetches a secret from OpenBao by ID token, and by the `secrets` keyword | The first works; the second is recorded as works or not |
| G7 | A commit adding a file named .env | Refused at push |
| G8 | A leaver removed from the engineers' Keycloak | Cannot sign in to GitLab |
| G9 | A merge request's reader preview, visible only to project members | Opens for a member; refused to a stranger |

## 18 · Open questions

1. **For the owner:** when to move this repository and the code from
   GitHub to GitLab (FS-701).
2. Whether SAML group sync is in Premium on GitLab.com, so role groups
   come from Keycloak (G8 depends on it).
3. Whether GitLab's `secrets` keyword works with OpenBao (G6).
4. The number of Premium seats: every role holder who approves needs
   Developer, so a seat.
5. **For the team lead:** the team's chat tool, for notifications and
   quick coordination (§8): Zulip or Mattermost, tracked in the
   technology register's Collaboration class (FS-759).
6. The git server for the mirror at Dibon central (§5): plain git over
   SSH proposed, or Gitea; Forgejo is GPL-3.0 now (technology register).
7. One repository per service, or one for all the code: the engineering
   lead's call before the first code moves (§6).
