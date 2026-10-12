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
version: 0.1.0
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-699, FS-701, FS-703, FS-745, FS-746, FS-747, FS-750]
last_reviewed: 2026-10-12
---

# GitLab — code, reviews, planning and pipelines — component specification

How Dibon uses GitLab for R1: where code and documents live, how a change
is reviewed and approved, how work is planned, and how a release reaches
the clusters (FS-701, FS-750). It is the tool behind
[ways of working](../ways-of-working.md): that page says who decides;
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
enforces are [ways of working](../ways-of-working.md) and
[service management](../service-management/README.md) §2; the release
path is [flows](../architecture/flows.md) §4.

## 2 · Version and hosting

- **GitLab.com, Premium,** one top-level group for Dibon. GitLab updates
  it; we run nothing of GitLab's but the runners and the agent.
- **Code and documents live outside Kenya** on GitLab.com. They hold no
  customer data, and the rules keep it so ([rules](../rules.md) §1):
  no personal data, no client material, no secrets in a repository, an
  issue or a comment. A customer's confidential detail is referred to,
  not copied. Should code have to stay in Kenya, GitLab self-managed is
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
| DORA metrics | Ultimate | No | The four measures computed by our own job from deployments (§6) |
| Audit events | Free and above | Yes | Exported to our observability; streaming is Ultimate |
| Compliance center and frameworks | Premium | Yes | The regulated projects labelled, their settings checked |
| GitLab Duo (AI) | Add-on | No | Not adopted; Claude works through merge requests (ways-of-working §2) |

## 4 · Settings

### 4.1 Groups and roles

- **One top-level group,** with a subgroup per area: `docs`, `code`,
  `platform` (manifests, runners).
- **A GitLab group per role** (ways-of-working §1): `@dibon/owners`,
  `@dibon/architects`, `@dibon/security`, `@dibon/compliance`,
  `@dibon/product`, `@dibon/delivery`, `@dibon/engineering`,
  `@dibon/service`, `@dibon/commercial`; filled from the engineers'
  Keycloak groups by single sign-on.
- **GitLab roles by job:**

  | GitLab role | Who | Why |
  |---|---|---|
  | Owner | The owner and one deputy | Two, so the group is never locked out; no more |
  | Maintainer | The engineering lead and the service owner | Settings, protected branches and environments, deploy freezes |
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
  institution; only the service and security groups may deploy.
- **Deployment approvals:** a production deployment waits for the change
  authority's approval in GitLab (ways-of-working §4): the service owner,
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

## 5 · Contracts

| With | What | How |
|---|---|---|
| Access (Keycloak) | Sign-in, role groups | SAML, the engineers' realm (access-keycloak §3) |
| OpenBao | Secrets for jobs | ID tokens, JWT authentication, scoped per project and branch |
| Harbor | Signed images | Pushed by the protected runner, by digest |
| Clusters | Manifests | The agent and Flux pull; GitLab never pushes into a cluster |
| Observability | Audit events, deployments | Exported by a scheduled job to Loki; deployments feed the four measures |

## 6 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| Code, documents, merge requests, issues | Internal | For the life of the projects | Staff names and comments only; never customers' |
| Pipeline logs | Internal | 90 days (proposed) | None: secrets and data masked |
| Audit events and deployment records | Internal | Exported and kept 7 years with our evidence | Staff actions |

## 7 · Quality and metrics

- **The four measures** (ways-of-working §4): deployment frequency, lead
  time for changes, change failure rate, time to restore, computed weekly
  from GitLab's deployment records by our own job, since GitLab's DORA
  dashboards are Ultimate.
- **Reviews within a working day:** the time from a merge request ready
  for review to its first review, from value stream analytics.
- **Alerts:** a pipeline on main failing (3); a deploy attempted in a
  freeze (2); a change to a protected setting or an Owner added (2)
  (observability-grafana §4).

## 8 · Threats

| Threat | For example | The answer |
|---|---|---|
| Spoofing | A stolen GitLab password | Single sign-on through Keycloak with hardware keys; two-factor enforced for the rest |
| Tampering | A change slipped into main, or a moved tag in a pipeline | Protected main; code owner approval; signed commits; components and images pinned |
| Repudiation | Who approved a deploy is disputed | Approvals and deployments recorded, exported to our evidence |
| Information disclosure | A secret or customer data committed or pasted | Push rules; Gitleaks; the rules; secrets only in OpenBao |
| Denial of service | GitLab.com unavailable | Deploys pause; running services are unaffected; Harbor and Flux keep the last good state |
| Elevation of privilege | A developer edits approval rules or deploys to production | Approval rules locked; protected environments; two Owners only |
| Linkability, identifiability (LINDDUN) | Customer details in an issue | Never: refer to the customer's record, do not copy it |

## 9 · Checks before the build

| # | Check | Pass |
|---|---|---|
| G1 | The author approves their own merge request | Refused |
| G2 | A merge request touching docs/regulation.md without the compliance officer's approval | Cannot merge |
| G3 | A push to main | Refused |
| G4 | A deploy to production during the nightly close, not labelled emergency | Refused by the deploy freeze |
| G5 | A production deploy without the service owner's approval | Waits |
| G6 | A job fetches a secret from OpenBao by ID token, and by the `secrets` keyword | The first works; the second is recorded as works or not |
| G7 | A commit adding a file named .env | Refused at push |
| G8 | A leaver removed from the engineers' Keycloak | Cannot sign in to GitLab |
| G9 | A merge request's reader preview, visible only to project members | Opens for a member; refused to a stranger |

## 10 · Open questions

1. **For the owner:** when to move this repository and the code from
   GitHub to GitLab (FS-701).
2. Whether SAML group sync is in Premium on GitLab.com, so role groups
   come from Keycloak (G8 depends on it).
3. Whether GitLab's `secrets` keyword works with OpenBao (G6).
4. The number of Premium seats: every role holder who approves needs
   Developer, so a seat.
