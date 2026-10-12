---
id: ways-of-working
name: Ways of working — roles, merge requests, architecture review and change advisory
kind: plan
version: 0.1.0
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-701, FS-743, FS-745, FS-746, FS-747, FS-749, FS-750]
last_reviewed: 2026-10-12
---

# Ways of working

How the team changes what we design and what we run: who approves what,
how a merge request goes, and the rules that stand in for an architecture
review board and a change advisory board at our size (FS-743 to FS-749).
It applies to this repository and to the code repository alike, both on
GitLab (FS-701).

## 1 · Roles, not people

A role is a responsibility; one person may hold several, and today the
CTIO holds many. Approvals go to roles, so they stay right as people
change. **No one approves their own work:** where the author is the only
holder of a role, the role's deputy approves.

| Role | Accountable for | Approves | Held today by |
|---|---|---|---|
| **Owner** | Direction, money, what we promise customers | Decisions that cost something (docs/decisions.md); scope and releases (docs/delivery-plan.md) | The CTIO |
| **Solution architect** | How the platform fits together | docs/architecture/, docs/specs/, the technology register, interfaces | The CTIO |
| **Security lead** | Security controls, keys, access, the edge | docs/modules/platform-security.md, the endpoints and access specs; every spec's Threats section; any change to a security control | The CTIO |
| **Compliance and risk officer** | The law, privacy, our duties to regulators; data protection officer if the Act requires one | docs/regulation.md, compliance.md, privacy.md, rules.md, legal-questions.md, documents.md | Vacant: the CTIO until hired |
| **Product owner**, one per product | What a product does, and in which phase | Its module in docs/modules/, its journeys | Kapu MFI: the CTIO until named |
| **Delivery lead** | Each customer's delivery | docs/customers/, customers.md, onboarding.md, the delivery plan's dates, training | The project manager |
| **Engineering lead** | How code is built and tested | The code repository; docs/testing.md; each build spec's tests | The CTIO |
| **Service owner** | Running the platform | docs/service-management/, operating-model.md, deployment and runbooks; normal changes (§4) | A DevSecOps engineer, to name |
| **Commercial lead** | What we sell, and to whom | docs/marketing/, partners.md, competitors.md | To name |

**Deputies:** each role names one in GitLab, never the role holder;
until there are more people, a second engineer deputises for the
architect, the security lead and the engineering lead, and the owner for
the compliance and risk officer.

**In GitLab,** each role is a group (`@dibon/architects`,
`@dibon/security`, …), filled from Keycloak by single sign-on, and a
person joins every group whose role they hold. Code owners name groups,
so the approval follows the role. **GitLab only lets a Developer or
above approve as a code owner,** so every role holder who approves needs
that role, and a seat, the compliance and risk officer and the
commercial lead included; the delivery lead plans as a Planner. The
settings are in [the GitLab spec](specs/gitlab.md) §4.

## 2 · A merge request, step by step

Every change, to a document or to code, is a merge request into a
protected main branch. Nobody pushes to main.

1. **Open it early, as a draft,** on a short-lived branch: others see the
   work and can comment before it is finished.
2. **Fill in the template:** the FS ids; what changes and why; which
   documents; the kind of change (standard, normal or emergency, §4);
   for code, how it was tested and how it is undone; whether it changes
   scope, a decision or a customer's commitment.
3. **The assignee owns it** and moves it along; **reviewers** are the
   code owners of what it touches, added automatically, and one peer.
4. **The checks run** in the pipeline: `tools/check.js` and its tests
   here, the build and its tests in the code; the reader is built as a
   preview of the change, so a reviewer sees the page, not the diff.
5. **Approval:** one peer, and a code owner for each section touched.
   The author cannot approve; a new commit resets approvals; approval
   rules cannot be edited inside a merge request.
6. **Merge checks:** the pipeline passes, every thread is resolved, and
   the branch is current with main. Then it merges itself (auto-merge),
   squashed, with the merge request's description as the commit message,
   so the reasoning stays in history.
7. **A change that needs another first** names it as a dependency: code
   that implements a spec waits for the spec's merge request.

**Code owners**, by section:

| Section | Paths | Approves |
|---|---|---|
| Architecture | docs/architecture/, docs/specs/, docs/decisions.md | Solution architect |
| Security | docs/modules/platform-security.md, docs/specs/endpoints.md, docs/specs/access-keycloak.md | Security lead |
| Compliance | docs/regulation.md, compliance.md, privacy.md, rules.md, legal-questions.md, documents.md | Compliance and risk officer |
| Products | docs/modules/, docs/journeys/ | Product owner |
| Delivery | docs/customers/, customers.md, onboarding.md, delivery-plan.md, docs/training/ | Delivery lead |
| Operations | docs/service-management/, operating-model.md, business-continuity.md | Service owner |
| Commercial | docs/marketing/, partners.md, competitors.md | Commercial lead |
| Tools | tools/, design/ | Engineering lead |

**Labels** say what a merge request is: `kind::standard`, `kind::normal`,
`kind::emergency`; `release::R1a`, `release::R1b`; `architecture` (§3).

**Claude works the same way:** on a branch, opening merge requests that
a person approves; never with a secret or a client's material.

## 3 · Architecture review: the rules

1. **An architecture decision** is any of: a new component or a change of
   one (a technology register row); a change to a spec's interfaces,
   data or security; a flow across modules; where things run and how
   they fail over; a licence decision; anything costly to undo.
2. **It is made in a merge request labelled `architecture`,** carrying a
   register row (FS id), an entry in docs/decisions.md (what was chosen,
   what it requires, what was argued against, what it costs) and, for a
   component, its technology register row.
3. **It is approved by** the solution architect; and the security lead
   when it touches a security control; and the owner when it costs money
   or changes what a customer was promised. The service owner and the
   compliance and risk officer are consulted when it changes how we run
   or what the law requires.
4. **It is decided within five working days,** or brought to the weekly
   meeting's architecture slot (twenty minutes), where open architecture
   questions are heard.
5. **A disagreement** goes to the owner, who decides; the decision and
   what was argued against are recorded.
6. **A decision is reopened** only by a new register row, never by
   editing the old entry.
7. **The technology register is checked every quarter** (technology §1).
8. **A board meets monthly** once there are two build teams, or a second
   architect.

## 4 · Change advisory: the rules

The kinds of change, what the customer is told, and the change calendar
are in [service management](service-management/README.md) §2. These rules
say who decides.

1. **Standard changes** run without approval each time. The service owner
   keeps their list; a change joins it only after it has run as a normal
   change without incident at least three times.
2. **A normal change** is approved in its merge request by the service
   owner, after a peer's review; also by the security lead when it
   changes a security control, and by the product owner when customers
   will see it. Its deployment to production then waits for the service
   owner's approval in GitLab (protected environments with deployment
   approvals), so what was approved is what is deployed.
3. **An emergency change** is made by the on-call engineer with the
   service owner, or the security lead when it closes a security hole,
   and is reviewed in a merge request within two working days.
4. **GitLab's deploy freezes hold the change calendar's blackouts:**
   the deploy job refuses inside them unless the change is labelled
   `kind::emergency`, its approval recorded.
5. **The weekly meeting reviews** the coming week's normal changes, last
   week's emergencies, and any change that failed; and watches four
   measures: how often we deploy, how long a change takes to reach
   production, how many changes fail, and how fast we recover. Our own
   job computes them from GitLab's deployment records, since GitLab's
   dashboards for them are Ultimate (gitlab spec §7).
6. **Where a customer runs its own change board,** we attend it, and its
   approval is added to ours.
7. **A board meets weekly** once more than one customer's windows have to
   be balanced against each other, or normal changes outgrow a meeting's
   slot.

## 5 · Working together (proposed)

What lets people work on their own and still in step (FS-749):

| Practice | What it means here |
|---|---|
| **Write it down first** | A point raised is a register row; a decision is a decision entry; a question for counsel is an LQ row. Nobody has to have been in the meeting |
| **Async by default** | Merge requests, threads and issues before meetings; a meeting is for what writing could not settle |
| **Small, short-lived changes** | Branches live a day or two; a merge request a reviewer can read in twenty minutes |
| **Reviews within a working day** | Reviewers answer within one working day; a suggested change can be applied in one click |
| **Ownership is visible** | The code owners table answers "whom do I ask?" |
| **Specs before code** | A capability is built from its spec and journey; a story cites both (testing.md) |
| **Released by a switch, not a deploy** | New behaviour ships off, behind a flag, and is turned on when ready |
| **Definition of done** | Merged with its tests, its documents and its runbook current; the register row closed |
| **A weekly rhythm** | Our weekly meeting (decisions, architecture slot, changes); a short demo of what shipped; a retrospective every second week |
| **Blameless reviews** | After an incident or a failed change: what happened and what we change, never who |
| **Focus time** | Core hours for meetings; protected blocks without them |
| **Hand-overs in writing** | On-call hand-over notes; a new joiner starts at start-here.md |
