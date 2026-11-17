---
id: deployment-plan-2026-11-05
name: From design to running code, how we deploy and how the pipeline works once development starts · Max's research, 5 November 2026
kind: review
status: draft
released: unreleased
owner: Solution architect
classification: Internal
review_ids: [MX-010, MX-001, MX-002, FS-1036, FS-775, FS-032]
last_reviewed: 2026-11-13
---

# From design to running code · 5 November 2026

**Research by Max (CI/CD engineer, the operations lead's deputy),**
drafted with his Claude (MX-010). Max: "what we have in the repo is
just the design, let me know how we approach deployment and how the
ci/cd pipeline will work once dev starts". It answers two questions:
how does a change travel from a developer's branch to production, and
in what order do we build the places it lands?

**What was read:** architecture README §9, deployment §1 and §2, flows
§1 and §4; platform-security SE-04 to SE-12, SE-23; github spec §4;
the deployments, Roan Capital's production deployment above all;
dibon-consulting as it stands on 5 November ([cicd-2026-10-30](cicd-2026-10-30.md)
§7: ci and service-template at v0.1.1, every switch off).

**Not read:** any provider's offer; Liquid is not contracted (FS-032).

**The short answer:** the pipeline already does everything up to a
signed release on GitHub; nothing is deployed because there is nowhere
to deploy to. Build the places in four phases, D1 to D4: a cluster for
development and staging (D1), Dibon central (D2), the Kenyan sites and
Roan Capital's instance (D3), the evidence for go-live (D4). Each turns
on switches already written in ci. Four decisions come first (§4).

---

## 1 · How a change reaches production

Once development starts, every service repository is made from
service-template and calls ci, pinned to a release. Nobody runs
kubectl against production: every change to a cluster is a reviewed
pull request in platform, applied by Flux from inside the cluster.

| # | Step | What happens | Who |
|---|---|---|---|
| 1 | Branch | A branch from main; commits as Conventional Commits, checked before they are made (Husky, Commitizen) | The developer |
| 2 | Pull request | ci's checks: conventions, build and tests, migrations against a real PostgreSQL, secrets, static analysis, dependency and configuration scans; a code owner other than the author approves | The developer, a reviewer |
| 3 | Merge to main | Squash merge; the image built, scanned, signed (cosign) and pushed to Harbor; release-please updates the open release pull request with the next version and its changelog | The pipeline |
| 4 | Release | The cab merges the release pull request: that is the release decision. An annotated tag, the image built at that version, signed and attested (Rekor), the GitHub release published with its SBOM and digest; immutable | The cab |
| 5 | Staging | The pipeline opens a pull request in platform setting staging's manifest to the new digest; Flux applies it; Kyverno admits only images Dibon signed | The pipeline, Flux |
| 6 | Production | Asked for by hand, with the digest that passed staging; the change calendar refuses blackout periods (the nightly close, month-end); approved, merged, applied by Flux | The requester, the approver |
| 7 | Back out | Revert the platform pull request to the previous digest; Flux rolls back. Migrations only go forward: their safety net is the tested restore (SE-10, SE-22) | On-call |

## 2 · Environments

| Environment | Holds | Where | Data |
|---|---|---|---|
| Development | Every service, latest main | The D1 cluster, a namespace | Synthetic only |
| Staging | Each release before production; acceptance by the institution | The D1 cluster, a namespace per institution | Synthetic only |
| Production | One instance per institution (README §9) | Site A, site B at zero (deployment §2) | Real; never leaves Kenya |
| Dibon central | Runners, Harbor, Rekor, engineers' Keycloak, the fleet's Grafana and on-call | In Kenya (deployment §1) | No institution's data |

## 3 · The phases

| Id | Phase | What | Switches turned on | Unblocks |
|---|---|---|---|---|
| D0 | Now | The first service repositories made from service-template, each with its stack set (java, node or python); development starts on the pipeline as it is | None | Work on R1's code |
| D1 | Development and staging | One cluster (RKE2 or k3s): Flux pointed at platform; a registry (Harbor, or the provider's as a stopgap); cert-manager; PostgreSQL through CloudNativePG; Kafka (Strimzi); Keycloak; OpenBao; Grafana | `DIBON_PUBLISH_ENABLED`, `DIBON_PROMOTE_ENABLED` for staging | Integration, demos, the institution's acceptance |
| D2 | Dibon central | Self-hosted GitHub runners in Kenya; Harbor; Rekor; Dibon's Keycloak with hardware keys; the fleet's Grafana and on-call (GoAlert) | `DIBON_SECURE_RUNNER`, `DIBON_HARBOR_REGISTRY`, `DIBON_OPENBAO_ADDR`, `DIBON_REKOR_URL` | Signing and secrets off GitHub's hosted runners before anything reaches production (SE-12) |
| D3 | Production sites | The Kenyan provider contracted for sites A and B (FS-032, FS-775); Roan Capital's instance from platform's templates: its namespaces, its database clusters (FS-1036), the replica at site B, backups, the offline copy | `DIBON_PROMOTE_ENABLED` for production | Roan Capital's go-live |
| D4 | Evidence for go-live | Penetration test (SE-17); a restore test (SE-10); a failover rehearsal (deployment §2); the independent assurance for CBK; the Team plan, then rulesets that make reviews and checks binding (MX-002) | `DIBON_DAST_TARGET` for staging | CBK's pack, Annex 1; the go-live checklist |

D1 can start at once and does not wait for D2 or D3; D3 waits on the
provider's contract.

## 4 · To decide first

| # | Question | Proposed | Why it matters |
|---|---|---|---|
| 1 | Where D1 runs | On a cloud already in use, DigitalOcean, **with synthetic data only, never an institution's** | It lets development integrate while the Kenyan sites are contracted. DigitalOcean has no Kenyan region, so README §9 and the CBK pack rule it out for anything real |
| 2 | Which services come first, and in which language | The lending service and the core adapter first; Java, beside Fineract | The repository's stack sets which checks run (service-template's pipeline) |
| 3 | A cluster per production instance, or namespaces in a shared one | A cluster per instance, as proposed (FS-1032) | Decides D3's size and cost (FS-1036) |
| 4 | Who is on the cab, and who approves production | The operations lead, the dev lead, the CTIO | The release and production steps (§1, steps 4 and 6) need named people |

## 5 · What does not change

- The pipeline's code: D1 to D3 are settings and clusters, not rewrites.
  ci already holds the workflows that publish, sign, promote and run DAST.
- The rules: a reviewed pull request for every change, the cab for every
  release, the same signed digest from staging to production, nothing
  real outside Kenya.
- The old pipelines (odoolaunchpad, kapu-pay: kubectl over SSH on k3s)
  keep running until their services move; moving them is its own row.

## 6 · D2 in detail: GitHub runners in Kenya

Max: "how do we deploy github runners in kenya?" A runner is a machine
that runs workflow jobs. GitHub's hosted runners run outside Kenya;
self-hosted runners run on machines we choose, in Dibon central
(deployment §1), and are what signs images and reaches OpenBao (SE-12).

| # | Step | How |
|---|---|---|
| 1 | Machines in Kenya | A small Kubernetes cluster (RKE2, hardened to CIS, SE-04) in Dibon central, at a Kenyan provider: two or three nodes to start. Its own cluster, never an institution's |
| 2 | A GitHub App for the runners | Separate from dibon-release: organisation permission "Self-hosted runners: read and write" only; installed on dibon-consulting; its private key held in OpenBao, given to the cluster as a secret |
| 3 | The runner controller | GitHub's Actions Runner Controller (Helm: the controller and one runner scale set, `dibon-kenya`, for the organisation); runner image pinned by digest; every runner ephemeral: one job, then destroyed |
| 4 | Building images without privilege | Containers built rootless (BuildKit), not Docker-in-Docker, so no privileged pod runs (SE-06) |
| 5 | Network | Outbound HTTPS only, to GitHub, Harbor, OpenBao, Rekor and the package mirrors; nothing inbound; no credential for any production cluster, since Flux pulls (§1) |
| 6 | Secrets | Jobs sign in to OpenBao with GitHub's OIDC token, so no long-lived secret sits on a runner |
| 7 | Turn it on | Organisation variable `DIBON_SECURE_RUNNER` set to `"dibon-kenya"` (a scale set is named in runs-on, not by labels; ci reads the variable as JSON); a test workflow run and its pod seen to start and end |
| 8 | Who may use them | On the Free plan every private repository may; on the Team plan a runner group limits them to chosen repositories and workflows (MX-002). Workflows from forks never run on them |

Watched like the rest of the fleet: runner pods, queue time and failed
jobs in Grafana; the cluster's nodes under runtime detection (SE-07).
After the October intrusion (MX-003), ephemeral runners and the
closed network matter most: a compromised job dies with its pod and
reaches nothing it was not given.

## 7 · Commit messages: Commitizen, Husky, and the check that decides

Max: "Husky and Commitizen explain". Step 1 of §1 rests on them.
release-please works out each version and changelog from the commits
(§1, steps 3 and 4), so every commit follows Conventional Commits.
service-template carries both tools, so every service made from it
does.

| Starts with | Means | Version, while 0.x |
|---|---|---|
| `feat:` | A feature | Minor: 0.1.0 to 0.2.0 |
| `fix:`, `perf:` | A fix | Patch: 0.1.0 to 0.1.1 |
| `feat!:`, or a `BREAKING CHANGE:` footer | A breaking change | Minor until 1.0.0; major after |
| `docs:`, `chore:`, `ci:`, `test:`, `refactor:`, `build:` | No release of its own | None; most hidden from the changelog |

| Tool | What it does | Where |
|---|---|---|
| Commitizen | Writes the message: `npm run commit` asks the type, scope, description, any breaking change and the issue, and writes it in the right shape | `package.json`: `commitizen`, `cz-conventional-changelog` |
| Husky | Installs git hooks when `npm install` runs; its `commit-msg` hook hands each message to commitlint before the commit is made | `.husky/commit-msg` |
| commitlint | Checks the message: a type from the list above; a title of 72 characters or fewer; footer lines of 100 or fewer. Body lines over 72 and a missing reference (`FS-` or `#`) are warnings | `.commitlintrc.json` |

**How a developer uses them:** clone, run `npm install` once (Node is
needed even in a Java repository, for this tooling only), then commit
with `npm run commit`, or with `git commit` when the shape is known;
the hook checks either.

**They are a convenience, not the gate.** A developer can skip the
hook (`git commit --no-verify`) or never run `npm install`. What
decides is ci's `conventions` job, which runs commitlint over every
commit in a pull request on GitHub; the pull request cannot be merged
until it passes. It stopped two on 5 November: `ci` #8 (a title of 77
characters) and `service-template` #4 (a line of over 100, from
GitHub's web editor, which does not wrap). The local tools only catch
the same mistake earlier, on the developer's own machine.

## Numbering

This review's rows are Max's own, numbered MX-001 upwards in `research/register.md`, apart from
the project's FS register. The `dibon-consulting/platform` pull requests #7 to #19 (OpenBao,
External Secrets, Harbor) cite FS-1177, an earlier number for **MX-010**; in the FS register
FS-1177 is a different row. The register lists every earlier number.
