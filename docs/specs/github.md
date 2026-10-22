---
id: github
name: GitHub — code, reviews, planning and pipelines — component specification
kind: spec
type: component
status: draft
released: unreleased
release: R1
implements: [platform-security]
depends_on: [access-keycloak]
used_by: []
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-750, FS-805, FS-846, FS-886, FS-894, FS-895, FS-896, FS-897, FS-901, FS-902, FS-904, FS-905]
last_reviewed: 2026-10-22
---

# GitHub — code, reviews, planning and pipelines — component specification

How Dibon uses GitHub for R1: where code and documents live, how a change
is reviewed and approved, how work is planned, and how a release reaches
the clusters. It replaces the GitLab specification (FS-896): GitHub's Team
plan does what R1 needs at a seventh of GitLab Premium's price, and we are
already on it; the GitLab specification is in this repository's history.
It is the tool behind [ways of working](../service-management/ways-of-working.md):
that page says who decides; this one says how GitHub is set to enforce it.
Sources: GitHub's pricing page and its documentation on plans, rulesets,
code owners, Actions, environments, Projects and seats, read on
2026-10-19; each feature's plan as GitHub states it, the uncertain ones
marked "to confirm". Today the repository is private, under the owner's
own account; nothing below is set up yet.

## 1 · Purpose and scope

Where every change is proposed, reviewed, approved and released, with the
record kept.

| Id | Capability | In R1 |
|---|---|---|
| SE-12 | A pipeline that refuses unsafe builds | Yes, in GitHub Actions, with runners in Kenya for anything holding a secret |
| SE-26 | Privileged access for Dibon's engineers, by hardware key | Yes: GitHub's two-factor by security key, and SSH keys of the `-sk` types |
| AC-02 | Staff single sign-on | Yes for the platform's services; GitHub joins it on Enterprise Cloud (§7) |
| SE-06 | Admission rules: only signed images | No: R2; the pipeline signs from R1 |
| SE-23 | A clean rebuild from code | No: R2; the manifests live here from R1 |

**Out of R1:** single sign-on for GitHub itself, an approval held on a
deployment environment, and a private Pages site, all Enterprise Cloud
(§3); GitHub's own secret scanning and code scanning, paid add-ons, done
by our own tools instead.

**Where it sits.**

```
  +--------------------------+      +--------------------------+      +--------------------------+
  | ACCESS                   |      | GITHUB                   |      | RUNNER                   |
  | signs in, steps up       |--1-> | holds code, reviews,     |--2-> | builds, tests, scans,    |
  | [keycloak]               |      | plans, runs workflows    |      | signs                    |
  |                          |      | [github]                 |      | [actions_runner]         |
  | engineers' realm, from   |      |                          |      |                          |
  | Enterprise Cloud on      |      | GitHub Team, one org     |      | in Kenya, ours           |
  +--------------------------+      +--------------------------+      +--------------------------+
                                                  |                                 |
                                                  | 5                               | 3
                                                  v                                 v
  +--------------------------+      +--------------------------+      +--------------------------+
  | OBSERVABILITY            |      | FLUX                     |      | HARBOR                   |
  | keeps the audit trail    | <-6--| follows the manifests    | <-4--| keeps signed images      |
  | [grafana]                |      | [flux]                   |      | [harbor]                 |
  |                          |      |                          |      |                          |
  |                          |      | pulls from GitHub        |      | a copy at each site      |
  +--------------------------+      +--------------------------+      +--------------------------+
```

| # | What crosses |
|---|---|
| 1 | Sign-in by single sign-on, once on Enterprise Cloud; until then each person's own account, with a security key |
| 2 | A workflow job, with a short-lived token |
| 3 | A signed image, by digest |
| 4 | The image each site pulls |
| 5 | The manifests, at the agreed window: Flux pulls, nothing pushes into a cluster |
| 6 | The audit log and Flux's deployment records, exported |

**Related:** implements
[platform-security](../modules/platform-security.md); depends on
[access-keycloak](access-keycloak.md); used by none yet; the rules it
enforces are [ways of working](../service-management/ways-of-working.md) and
[service management](../service-management/README.md) §2; the release
path is [flows](../architecture/flows.md) §4.

## 2 · Plan and hosting

- **GitHub Team,** one organisation for Dibon, at $4 a seat a month
  (GitHub's pricing page, to confirm at purchase). **Enterprise Cloud**,
  at $21, when the engineers' Keycloak is ready for single sign-on, or a
  customer's due diligence asks for it. Even then it costs less than
  GitLab Premium, at $29 (FS-896).
- **Code and documents live outside Kenya,** on GitHub's servers, as they
  would on GitLab.com (FS-864). They hold no customer data, and the rules
  keep it so ([rules](../rules.md) §1): no personal data, no client
  material, no secrets in a repository, an issue or a comment. A
  customer's confidential detail is referred to, not copied: client
  material lives in Dibon's Odoo Documents, in Kenya (rules, Dibon 10;
  FS-805). Git has no read rights per file, so nothing restricted belongs
  in a repository the whole team reads.
- **Runners in Kenya are ours** for any job that holds a secret, signs,
  or touches a customer's environment; GitHub's hosted runners run only
  jobs that hold none, such as this repository's checks.
- **Flux runs in each cluster and pulls** from GitHub; nothing in GitHub
  reaches into a cluster.

## 3 · Features used and not used

| Feature | Plan | Used | Why |
|---|---|---|---|
| Pull requests: drafts, reviewers, threads, suggestions | Free | Yes | Every change (ways-of-working §2) |
| Rulesets on main: a pull request required, approvals, stale approvals dismissed, code owner review, required checks, no force-push | Team, for private repositories | Yes | A peer and the code owners approve; never the author, whom GitHub never lets approve |
| Code owners | Team | Yes | Approval follows the role (ways-of-working §1) |
| Required status checks; auto-merge | Team | Yes | The checks passed, the branch current |
| Push rulesets: file paths, extensions and sizes refused | Team, for private repositories (to confirm) | Yes | A `.env` or key file refused at push |
| Branch and tag name rulesets | Team | Yes | Branch names (ways-of-working §6); release tags only by the team lead and deputy (§4.2) |
| Merge queue | Enterprise Cloud, for private repositories | No | Our merge rate does not need it |
| A pull request waiting on another | None | No | A check of our own: a code pull request names its spec's, merged first (§4.4) |
| Signed commits required | Team | Not yet | Decided when signing comes (FS-905) |
| Environments: deployment branches, environment secrets | Team | Yes | Production's secrets only to its branch |
| Environments: required reviewers, wait timers | Enterprise Cloud, for private repositories | No | The deploy repository's pull request, approved by the change authority, instead (§4.5) |
| Single sign-on by SAML | Enterprise Cloud | No, in R1 | Each person's own account with a security key until then (§7) |
| Two-factor authentication required | Free | Yes | For every member |
| Actions, with self-hosted runners | Free; 3,000 hosted minutes a month on Team | Yes | Hosted for jobs with no secret; ours in Kenya for the rest |
| Reusable workflows and actions, pinned by commit | Free | Yes | The checks, scans and signing shared, each pinned |
| Actions' OIDC token to OpenBao | Free | Yes | Jobs fetch secrets from OpenBao with a short-lived token; none stored in GitHub |
| Secret scanning and push protection, for private repositories | Secret Protection add-on | No | Gitleaks in the workflow, and the push rulesets |
| Code scanning | Code Security add-on | No | Our own tools in the workflow (SE-11, SE-12) |
| Dependabot alerts | Free | Yes | Known-vulnerable dependencies flagged |
| Pages, private | Enterprise Cloud | No | The reader opened locally, later served by our own server behind sign-in (§6) |
| Issues, sub-issues, issue types | Free | Yes | Work and stories (testing.md) |
| Projects: board, table, roadmap, iterations, custom fields | Free | Yes | Planning (§4.6), and the change advisory board's agenda |
| Milestones; labels | Free | Yes | Releases; a few labels such as `emergency` |
| Wiki; Discussions | Free | No | Documents live in this repository; decisions in pull requests and the register |
| Packages, the container registry | Free | No | Harbor is the registry each site pulls from |
| Codespaces | Paid by use | No | Work happens in local clones |
| Audit log | Team | Yes | Exported to our observability; streaming is Enterprise Cloud |
| Copilot | Add-on | No | Not adopted; Claude works through pull requests, each person's own (FS-905) |

## 4 · Settings

### 4.1 Organisation, teams and roles

- **One organisation,** `dibon` if the name is free, holding `finance`
  (this repository), the code repositories, and `platform` (manifests).
- **A team per role** (ways-of-working §1): `team-lead`, `architects`,
  `security`, `compliance`, `product`, `delivery`, `engineering`,
  `operations`, `odoo`, `commercial`, and `cab` for the change advisory
  board (ways-of-working §4). Kept by hand by the security lead, against
  the team table, each month, until single sign-on fills them.
- **Roles by job:**

  | GitHub role | Who | Why |
  |---|---|---|
  | Organisation owner | The team lead and the CEO | Two, so the organisation is never locked out; no more |
  | Maintain, on a repository | The engineering lead and the operations lead | Settings short of deleting or moving it |
  | Write | Everyone who writes or approves: a code owner needs Write to approve | The team, by its role teams |
  | Triage | Anyone who only plans or tidies issues | |
  | Read | Anyone who only reads | |
  | Outside collaborator | An outside reviewer, case by case, on one repository; takes a seat | |

### 4.2 Branches and pull requests

- **main's ruleset:** no direct push, no force-push, no deletion; a pull
  request with one approval and the code owners'; stale approvals
  dismissed by new commits; required checks passed; the branch current.
  No one bypasses it.
- **Merging:** a merge commit between people, so each commit keeps its
  author; a squash only within one person's own branch (FS-886). The
  branch is deleted after the merge.
- **Code owners** by path, from the roles' "Approves" column in
  ways-of-working §1; the `cab` team owns `CHANGELOG.md`, the external
  release notes and each customer's §8, so a release needs the board.
- **Tags:** a ruleset lets only the team lead and their deputy create
  release tags (`docs-*`, and each customer's).
- **Templates:** `.github/pull_request_template.md` (ways-of-working §2)
  and issue templates: a story, a bug, a register point.
- **Git conventions** (branches, commits, tags, line endings, the
  register's union merge): ways-of-working §6.

### 4.3 Push rulesets

Files named like secrets (`.env`, `*.pem`, `*.key`, `id_rsa*`) refused;
files over 50 MB refused; branch names `<kind>/<FS id>-<words>` or
`claude/<handle>/<FS id>-<words>` (FS-905).

### 4.4 Workflows and runners

- **This repository's workflow,** on GitHub's hosted runners, on every
  pull request: `node tools/check.js`, every check but names; the tests
  when `tools/` changed; Gitleaks. The names check needs the
  protected-names list, which never leaves our own computers: each
  person's commit hook runs it instead (FS-896). The reader built as an artifact, kept 30 days.
- **Runners in Kenya:** ours, ephemeral, for jobs that hold a secret,
  sign or deploy; they take jobs only from protected branches;
  containers unprivileged.
- **Shared workflows and actions** (the checks, Gitleaks, Opengrep,
  Trivy, OSV-Scanner, ZAP, cosign) pinned to a commit, never a tag;
  every image by digest (technology rules 4, 5). Workflows read-only by
  default; a job asks for what it needs.
- **Secrets:** fetched from OpenBao with Actions' OIDC token at run
  time; no secret stored in GitHub but the few that cannot be avoided.
- **A pull request waiting on another:** a check reads a "Needs:" line in
  the description and fails until that pull request is merged.

### 4.5 Deploys and the change calendar

- **A deploy is a pull request to `platform`,** the deploy repository,
  which Flux applies once merged. Its code owners are the operations
  lead, and the security lead for a security control: their approval is
  the change authority's (ways-of-working §4).
- **The change calendar's blackouts:** the nightly close (21:00 to 03:00
  Africa/Nairobi), the month-end days, each customer's go-live freeze.
  Flux pauses within them, and a check refuses a deploy pull request
  inside one unless it is labelled `emergency`, its approval recorded.
- **Production's secrets** are environment secrets limited to the deploy
  branch, fetched from OpenBao where they can be.

### 4.6 Planning

- **Issues** for work; a story cites its journey step and capability
  (testing.md); a register point that becomes work cites its FS id
  (FS-894).
- **Sub-issues** for a release's or a journey's work, its epic an issue
  of type Epic.
- **Projects** with fields: Status, Iteration (two weeks), Release, Area,
  Priority. Views: the board, by status; the roadmap, by iteration; and
  "Release", the change advisory board's weekly agenda.
- **Milestones** for releases.

## 5 · Setting up, and being able to leave

**Setting up, in order** (FS-895, FS-896): this repository first, then
the code.

1. **Each person** creates their own GitHub account with their work
   email and turns on two-factor authentication, by security key where
   they have one. They do it themselves.
2. **The team lead creates the organisation** on the Team plan and is
   its first owner; the CEO is the second.
3. **Two-factor authentication required** for every member; members
   invited only once it is on, since GitHub removes members without it.
4. **Member privileges:** base permission none; members cannot create
   public repositories or fork private ones; only owners invite.
5. **This repository transferred** into the organisation (its settings,
   Transfer): its history, each commit's author (FS-886, FS-905), its
   issues and old links carried over; it stays private.
6. **The teams** created (§4.1), and each person added to theirs from the
   team table in ways-of-working §1.
7. **The rulesets** set before anyone else pushes: main (§4.2), tags,
   push (§4.3), branch names.
8. **Dependabot alerts** on.
9. **`CODEOWNERS`, the pull request and issue templates, and the
   workflow** (§4.4) added, by pull request.
10. **Each clone's address** changed to the organisation's:
    `git remote set-url origin https://github.com/dibon/finance.git`.
11. **The words updated** (tools/dibon.js): the single-owner exception
    ends, and each person uploads and shares their own branches.
12. **Each person's Claude** set once with `dibon claude` (FS-905).

**Being able to leave, or to work through an outage** (business
continuity, suppliers):

- **A mirror** of every repository, pushed each night by a workflow on
  our runners to a git server of ours at Dibon central, in Kenya, so the
  code and its history are always held twice.
- **A nightly export** of each repository's issues, pull requests and
  their threads, through GitHub's API, into the backup store (SE-10,
  SE-20).
- **When GitHub is down:** work goes on in local clones; deploys wait,
  which harms nothing running; an urgent fix is an emergency change,
  applied by the operations lead from the mirror and recorded in GitHub
  afterwards.
- **A restore from the mirror and the export** is tested twice a year
  with the other recovery drills.

## 6 · Repositories and releases

- **Documents:** this repository, `finance`, with the law texts it was
  read from (FS-901).
- **Code:** one repository per service that deploys on its own (Kapu
  MFI, the approval engine, the lender rules, rails, messaging,
  reconciliation, identity), so each versions and releases on its own;
  shared libraries in their own; the shared workflows in `ci`.
- **Manifests:** `platform`, a folder per institution and stage, which
  Flux follows.
- **Versions:** this repository's releases are dated (rules, Dibon 12);
  a service's are semantic, a tag `vX.Y.Z` on main; release tags only by
  the team lead and deputy, after the change advisory board (FS-904);
  each published as a GitHub release with its notes.
- **Promotion, never rebuilding:** the same signed image, by digest,
  moves from staging to production.
- **The reader:** built by the workflow; opened locally until our own
  server serves it behind sign-in, with a preview per pull request.

## 7 · Identity and tokens

- **Each person's own account,** with two-factor by security key; SSH
  keys of the `-sk` types, by policy and the access review, since GitHub
  cannot enforce a key's type.
- **Single sign-on** through the engineers' Keycloak once on Enterprise
  Cloud; until then the security lead removes a leaver by hand, the same
  day (§11).
- **Personal access tokens** fine-grained, one repository's worth,
  expiring within thirty days (proposed). Automation uses a GitHub App or
  Actions' own token, never a person's.
- **Claude** is each person's own (FS-905): it commits as "Claude for"
  that person, from that person's clone, on `claude/<handle>/` branches,
  pushed on that person's word with their credential; it never merges,
  approves or holds an owner's or maintainer's role. A GitHub App of its
  own, later, would let it comment and update issues under its own name.
  Until then the GitHub connector, if authorised, is used to read only
  (FS-897). Its writes, when it has its own identity: push its branches,
  open and update its pull requests, comment (never approve) when asked,
  create an issue from a register row, update the cards it has joined,
  re-run its own failed checks. Never: merge, approve, settings, access,
  releases, tags, another's issue or comment, secrets.

## 8 · Integrations and communication

- **Grafana:** every deployment marked on its dashboards, from Flux's
  events, into Loki.
- **Odoo Helpdesk:** a ticket names the issue or pull request that fixes
  it; the pull request template has the ticket's number; nothing of the
  customer's is copied across.
- **Notifications:** each person's own, by email; pull request and
  workflow events to the team's channel once a chat tool is chosen
  (FS-759).
- **Where discussion happens:** decisions in pull request threads and
  register rows; chat for quick coordination, and whatever chat decides
  is written into the pull request or the register.

## 9 · Dependencies and large files

- **Renovate** opens pull requests for dependency and image updates:
  security fixes at once, the rest grouped weekly, each pinned digest
  moved; run unmodified as a scheduled job on our runners (AGPL-3.0, as
  the licence rule allows). Dependabot's alerts besides.
- **Large files:** this repository keeps its law texts in plain git
  (FS-901), each new version adding its own; a code repository's large
  binaries in Git LFS, its free allowance watched (to confirm).
- **Generated files** (`build/`) are never committed: the workflow makes
  them.

## 10 · Seats, storage and limits

- **Seats:** every member and outside collaborator takes one. About
  fifteen today: the team in ways-of-working §1; each person's Claude
  takes none, working through that person's clone.
- **Actions:** 3,000 hosted minutes a month on Team; our own runners use
  none. This repository's checks take about a minute, its tests about
  four.
- **Storage:** artifacts expire after thirty days; the repositories'
  size watched monthly.

## 11 · Customers, joiners and leavers

- **Customers have no access to GitHub.** What they see goes through
  Odoo and what we choose to share from the reader. A customer's
  confidential detail is referred to, never copied into an issue.
- **A joiner** is invited once their two-factor is on, and added to
  their role teams (JN-20).
- **A leaver** is removed from the organisation by the security lead the
  same day, their tokens revoked and their open pull requests
  reassigned. Each month the members are compared with the team table.

## 12 · Evidence for auditors

What GitHub records answers these, exported and kept seven years with
our evidence (§14):

| Asks for | ISO/IEC 27001:2022 | GitHub's record |
|---|---|---|
| Change management | A.8.32 | Pull requests: the approvals, the checks' results, the kind of change; the deploy repository's merges |
| A secure development life cycle; secure coding; security testing | A.8.25, A.8.28, A.8.29 | The workflow's checks and scans on every pull request |
| Access to source code; access rights | A.8.4, A.5.15, A.5.18 | Members, teams and roles; the monthly comparison; the audit log |
| Separate environments | A.8.31 | The deploy repository's folders per institution and stage; environment secrets |
| Regulators' change records | The approval pack's change and security items | A quarterly report of merged changes, their kind, approvers and deployments |

## 13 · Contracts

| With | What | How |
|---|---|---|
| Access (Keycloak) | Sign-in, role teams | SAML, the engineers' realm, once on Enterprise Cloud (access-keycloak §3) |
| OpenBao | Secrets for jobs | Actions' OIDC token, JWT authentication, scoped per repository and branch |
| Harbor | Signed images | Pushed by our runners, by digest |
| Clusters | Manifests | Flux pulls; GitHub never pushes into a cluster |
| Observability | Audit log, deployments | Exported by a scheduled job to Loki; deployments feed the four measures |

## 14 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| Code, documents, pull requests, issues | Internal | For the life of the repositories | Staff names and comments only; never customers' |
| Workflow logs | Internal | 90 days (proposed) | None: secrets and data masked |
| Audit log and deployment records | Internal | Exported and kept 7 years with our evidence | Staff actions |

## 15 · Quality and metrics

- **The four measures** (ways-of-working §4): deployment frequency, lead
  time for changes, change failure rate, time to restore, computed weekly
  from the deploy repository's merges and Flux's records by our own job.
- **Reviews within a working day:** the time from a pull request ready
  for review to its first review, from GitHub's API.
- **Alerts:** a workflow on main failing (3); a deploy pull request in a
  blackout (2); a ruleset changed or an owner added, from the audit log
  (2) (observability-grafana §4).

## 16 · Threats

| Threat | For example | The answer |
|---|---|---|
| Spoofing | A stolen GitHub password | Two-factor by security key, required; single sign-on through Keycloak on Enterprise Cloud |
| Tampering | A change slipped into main, or a moved tag in a workflow | main's ruleset; code owner review; actions and images pinned; the tag ruleset |
| Repudiation | Who approved a deploy is disputed | Approvals on the deploy repository's pull requests; the audit log exported |
| Information disclosure | A secret or customer data committed or pasted | Push rulesets; Gitleaks; the rules; secrets only in OpenBao |
| Denial of service | GitHub unavailable | Deploys pause; running services are unaffected; Harbor and Flux keep the last good state; the mirror in Kenya |
| Elevation of privilege | A member edits a ruleset or merges a deploy unapproved | Two owners only; no one bypasses the rulesets; code owners on `platform` |
| Linkability, identifiability (LINDDUN) | Customer details in an issue | Never: refer to the customer's record, do not copy it |

## 17 · Checks before the build

| # | Check | Pass |
|---|---|---|
| H1 | The author approves their own pull request | Not possible |
| H2 | A pull request touching docs/regulation.md without the compliance team's approval | Cannot merge |
| H3 | A push to main | Refused |
| H4 | A deploy pull request inside a blackout, not labelled `emergency` | Its check fails; cannot merge |
| H5 | A deploy pull request without the operations lead's approval | Cannot merge |
| H6 | A job fetches a secret from OpenBao with Actions' OIDC token | Works; the token is short-lived |
| H7 | A commit adding a file named `.env` | Refused at push (to confirm on Team) |
| H8 | A leaver removed from the organisation | No access; the monthly comparison finds no one left over |
| H9 | A release tag created by anyone but the team lead or deputy | Refused |
| H10 | A release pull request without the `cab` team's approval | Cannot merge |
| H11 | A branch named outside the pattern | Refused |

## 18 · Open questions

1. **For the team lead:** the organisation's name, and the day of the
   move (§5).
2. Whether push rulesets apply to private repositories on Team (H7); if
   not, Gitleaks in the workflow carries the whole check.
3. When to move to Enterprise Cloud: once the engineers' Keycloak is
   ready, or when a customer's due diligence asks for single sign-on.
4. The team's chat tool, for notifications (FS-759).
5. The git server for the mirror at Dibon central: plain git over SSH
   proposed, or Gitea.
6. One repository per service, or one for all the code: the engineering
   lead's call before the first code moves (§6).
7. Signed commits, and who signs Claude's (FS-905).
8. Where the reader is served, behind sign-in (§6).
