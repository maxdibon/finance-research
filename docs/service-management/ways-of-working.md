---
id: ways-of-working
name: Ways of working — roles, merge requests, reviews, git, and the team's words
kind: plan
status: living
released: 2026.10.16
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-701, FS-743, FS-745, FS-746, FS-747, FS-749, FS-750, FS-751, FS-753, FS-755, FS-756, FS-757, FS-846, FS-847, FS-848, FS-849, FS-853, FS-865]
last_reviewed: 2026-10-16
---

# Ways of working

How the team changes what we design and what we run: who approves what,
how a merge request goes, and the rules that stand in for an architecture
review board and a change advisory board at our size (FS-743 to FS-749).
It applies to this repository and to the code repository alike, both on
GitLab (FS-701). And how everyone, technical or not, makes their updates
in the repository and stays in step: the team's words (FS-847 to FS-849,
joined here by FS-865).

**Who reads what.** Everyone: §1 and §5. A project manager, or anyone
who updates documents without using git: §7 to §10, the team's words.
Anyone who approves: §2 to §4. A developer: §6 as well.

## 1 · Roles, not people

A role is a responsibility; one person may hold several, and today the
CTIO holds many. The names avoid ITIL's own: in ITIL 4 a *sponsor*
sits at the customer and pays for using a service, and a *service owner*
answers for one service; so the team lead directs the team, the
operations lead runs the platform, and each product owner is also the
ITIL service owner of its product (FS-751, FS-755 to FS-757). Approvals go to roles, so they stay right as people
change. **No one approves their own work:** where the author is the only
holder of a role, the role's deputy approves.

| Role | Accountable for | Approves | Held today by |
|---|---|---|---|
| **Team lead** | Direction, money, what we promise customers; chairs the weekly meeting | Decisions that cost something (docs/decisions.md); scope and releases (docs/delivery-plan.md) | The CTIO |
| **Solution architect** | How the platform fits together | docs/architecture/, docs/specs/, the technology register, interfaces | The CTIO |
| **Security lead** | Security controls, keys, access, the edge | docs/modules/platform-security.md, the endpoints and access specs; every spec's Threats section; any change to a security control | The CTIO |
| **Compliance and risk officer** | The law, privacy, our duties to regulators; data protection officer if the Act requires one | docs/regulation.md, compliance.md, privacy.md, rules.md, legal-questions.md, documents.md | Vacant: the CTIO until hired |
| **Product owner**, one per product | What a product does, and in which phase; as ITIL's service owner, that it meets what was agreed | Its module in docs/modules/, its journeys | Kapu MFI: the CTIO until named |
| **Delivery lead** | Each customer's delivery | docs/customers/, customers.md, onboarding.md, the delivery plan's dates, training | The project manager |
| **Engineering lead** | How code is built and tested | The code repository; docs/testing.md; each build spec's tests | The CTIO |
| **Operations lead** | Running the platform; the change authority for normal changes | docs/service-management/, operating-model.md, deployment and runbooks; normal changes (§4) | A DevSecOps engineer, to name |
| **Commercial lead** | What we sell, and to whom | docs/marketing/, partners.md, competitors.md | To name |

**Deputies:** each role names one in GitLab, never the role holder;
until there are more people, a second engineer deputises for the
architect, the security lead and the engineering lead, and the team lead
for the compliance and risk officer.

**In GitLab,** each role is a group (`@dibon/architects`,
`@dibon/security`, …), filled from Keycloak by single sign-on, and a
person joins every group whose role they hold. Code owners name groups,
so the approval follows the role. **GitLab only lets a Developer or
above approve as a code owner,** so every role holder who approves needs
that role, and a seat, the compliance and risk officer and the
commercial lead included; the delivery lead plans as a Planner. The
settings are in [the GitLab spec](../specs/gitlab.md) §4.

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
| Delivery | docs/customers/, customers.md, onboarding.md, delivery-plan.md, docs/training/; this file, with the operations lead, for §7 to §10 (GitLab names owners by file, so the delivery lead approves any change to it) | Delivery lead |
| Operations | docs/service-management/, operating-model.md, business-continuity.md | Operations lead |
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
   when it touches a security control; and the team lead when it
   costs money
   or changes what a customer was promised. The operations lead and the
   compliance and risk officer are consulted when it changes how we run
   or what the law requires.
4. **It is decided within five working days,** or brought to the weekly
   meeting's architecture slot (twenty minutes), where open architecture
   questions are heard.
5. **A disagreement** goes to the team lead, who decides; the decision and
   what was argued against are recorded.
6. **A decision is reopened** only by a new register row, never by
   editing the old entry.
7. **The technology register is checked every quarter** (technology §1).
8. **A board meets monthly** once there are two build teams, or a second
   architect.

## 4 · Change advisory: the rules

The kinds of change, what the customer is told, and the change calendar
are in [service management](README.md) §2. These rules
say who decides: ITIL's *change authority*.

1. **Standard changes** run without approval each time. The operations lead
   keeps their list; a change joins it only after it has run as a normal
   change without incident at least three times.
2. **A normal change** is approved in its merge request by the operations
   lead, after a peer's review; also by the security lead when it
   changes a security control, and by the product owner when customers
   will see it. Its deployment to production then waits for the operations
   lead's approval in GitLab (protected environments with deployment
   approvals), so what was approved is what is deployed.
3. **An emergency change** is made by the on-call engineer with the
   operations lead, or the security lead when it closes a security hole,
   and is reviewed in a merge request within two working days.
4. **GitLab's deploy freezes hold the change calendar's blackouts:**
   the deploy job refuses inside them unless the change is labelled
   `kind::emergency`, its approval recorded.
5. **The weekly meeting reviews** the coming week's normal changes, last
   week's emergencies, and any change that failed; and watches four
   measures: how often we deploy, how long a change takes to reach
   production, how many changes fail, and how fast we recover. Our own
   job computes them from GitLab's deployment records, since GitLab's
   dashboards for them are Ultimate (gitlab spec §15).
6. **Where a customer runs its own change board,** we attend it, and its
   approval is added to ours.
7. **A board meets weekly** once more than one customer's windows have to
   be balanced against each other, or normal changes outgrow a meeting's
   slot.

## 5 · Working together

What lets people work on their own and still in step (FS-749; adopted
by the owner on 2026-10-16, FS-867):

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

## 6 · Git conventions

How everyone uses git, so that history stays readable and nobody
overwrites anyone (FS-846). In GitLab, the push rules, approval rules and
protected main of [gitlab.md](../specs/gitlab.md) §4.2 and §4.3 enforce
most of it; the rest is habit. People who do not use git directly use the
team's words (§7 to §10, FS-847), which follow these rules for them.

| Practice | The convention |
|---|---|
| **One long-lived branch** | `main`, protected. Work happens on short-lived branches, one register row or a tight group of rows each, merged within two or three days |
| **Branch names** | `<kind>/<FS id>-<a-few-words>`, the kind one of `docs`, `spec`, `code`, `fix`, `tool`, `release`: `docs/FS-845-dated-versions` |
| **Releases are dated tags on main** | `docs-2026.10.15`, `roan-capital-2026.10.15` (rules, Dibon 12). A release branch, `release/<series>-<date>`, only to fix an old release a customer still runs: the fix lands on main first, then is cherry-picked back |
| **Commit subject** | `FS-123: what changed`, at most 72 characters; the hook refuses a subject without its register row (Merge, Revert and Release excepted) |
| **Commit body** | Why, not what; wrapped at 72 columns; trailers last (`Co-Authored-By:`) |
| **Mechanical changes apart** | A sweep across many files (a status for every document, renumbered ids) is its own commit, never mixed with a change a reviewer must read |
| **Keep current by rebasing** | `git fetch`, then `git rebase origin/main`; never merge main into a branch. Force-push only your own branch, and only `--force-with-lease`; never main |
| **Undo with a new commit** | `git revert` on main; history on main is never rewritten |
| **Squash on merge** | One commit per merge request on main, its description as the message; the branch's own commits may be untidy |
| **Tags are annotated, and signed once keys exist** | `git tag -a docs-2026.10.15 -m "…"`; a published tag is never moved or deleted |
| **Line endings** | LF everywhere (`.gitattributes`); a clone sets nothing by hand |
| **The register** | REVIEW.md, its open rows, and review/, its closed rows by the hundred (FS-866), merge by union, so two branches' new rows both survive; the register check fails a skipped or repeated FS id. In GitLab an FS id comes from its issue, so two people never take the same one |
| **Changelogs** | Never edited by hand: each merge request carries a change note, and a release gathers them (rules, Dibon 12) |
| **Hooks** | `git config core.hooksPath .githooks` once per clone: pre-commit runs the checks, commit-msg holds the subject |
| **Size** | A merge request a reviewer reads in one sitting, about 400 changed lines for code; the reader's preview shows documents as pages |

**Until the move to GitLab,** the owner is the only one who pushes, to
GitHub's main, on their word ("push"): the single-owner exception. The
team works on branches and shares them; the owner merges.

## 7 · The team's words

How everyone, technical or not, makes their updates and stays in step
with the rest of the team (FS-847 to FS-849). There is one small set of
words. **A project manager says them to Claude in the desktop app**, in
plain sentences: "update, then mark Roan Capital's answer 24 as
answered". **A developer types them:** `dibon update`. Either way the
same thing happens underneath: the git, the checks and the records, done
the way §6 says. Developers may also use git directly, by those
conventions.

### The cheat sheet

| Say | What it does |
|---|---|
| **update** | Bring my copy up to date with the shared one (shared to mine) |
| **start** "…" | Begin a piece of work on its own branch, with its register row |
| **note** "…" | Write the change note: what changed, and for whom |
| **meeting** customer date | Open a meeting record, registered as a document |
| **answered** customer number "…" | Move a customer's open answer to Answered, dated |
| **received** file `--from` customer | Keep a document from outside as an original, and register it |
| **check** | Run the checks and say, in plain words, what to fix |
| **save** "…" | Save my work on my branch; the checks run first |
| **undo** | Take back my last save |
| **discard** file | Throw away unsaved changes to one file, after showing them |
| **share** | Send my branch for review (mine to shared); the checks run first |
| **ready** | Mark my shared work ready for review |
| **status** | Where am I, and what is waiting |
| **history** file | What changed in one document, by release |
| **help** | Every word, with examples |
| **release** | The owner only: release the documentation or a customer's delivery |
| **practice** | A private sandbox to try every word safely |
| **role** "…" | Tell the words your role, once |

### Three rules, and once before the first time

**Three rules.** Update first, every day. A stop protects you: nothing is
lost, and the message says what to do. Nothing is guessed: say what you
mean, and a word that cannot tell asks.

**Once, before the first time:** `dibon role "Project manager"` (your
role, never your name), and, for developers,
`git config core.hooksPath .githooks`. On Windows, `dibon` runs from the
repository's folder (`dibon.cmd`); elsewhere `./dibon`.

## 8 · The words

### update

Brings the team's latest into your copy: shared to mine, never the other
way. Example: `dibon update`. **If it stops** because you have unsaved
edits: save or discard them first. **If it stops** because your change
and a teammate's touch the same lines: nothing is lost; ask Claude or an
engineer to bring the two together. Never edit conflict markers by hand.

### start

Begins a piece of work on its own branch, named after its register row;
without `--row`, it opens a new row. Examples:
`dibon start "Roan Capital meeting, 22 October"`;
`dibon start "Fix the agenda" --row FS-826`.

### note

Writes the change note for your work, so the team sees it and the next
release carries it. `--for team` (the default), `--for everyone`, or a
customer's id; `--kind` major, minor (the default) or patch. Examples:
`dibon note "Two open answers settled" --for roan-capital`. **It stops**
if a note read outside Dibon holds a register id: say it in plain words.

### meeting

Opens a meeting record for a customer, outside git, and registers it.
Example: `dibon meeting roan-capital 2026-10-22`.

### answered

Moves a customer's open answer from Open to Answered in its delivery map,
dated, with the answer. Example:
`dibon answered roan-capital 24 "The accountant and the finance lead receive it"`.

### received

Keeps a document that came from outside as an original: moved into the
customer's `originals/`, read-only, its fingerprint recorded, and a row
in the document register, with a one-line summary of what it is and why
we hold it (without `--summary` it says "to confirm": add one later in
the register). The customer's own table of documents, on its page,
follows. Nothing from it goes into git. Example:
`dibon received "C:\Users\me\Downloads\Signed agreement.pdf" --from roan-capital --summary "The services agreement as signed"`.
**It stops** if the same document is already kept, and names it.

### check

Runs every check and lists what to fix, by file and line. The checks
also run by themselves before save and share. Example: `dibon check`.

### save

Saves your work on your branch, its subject starting with your register
row. Never on main. Examples: `dibon save "Open answer 26: two administrators"`;
`dibon save docs/customers/roan-capital.md` (that file only; it then asks
what you changed). **It stops** when you give no description, when the
checks fail, and when you give it a document from outside: that is
`received`. `--body-file` adds a body to the saved change from a file:
why it changed, and any trailer such as Co-Authored-By (FS-862).

### undo

Takes back your last save. Before you share it, the save is undone and
your edits stay in the files; after, nothing is rewritten: a correcting
change reverses it. Example: `dibon undo`.

### discard

Throws away unsaved changes to one file, after showing exactly what would
be lost. Example: `dibon discard docs/customers/roan-capital.md`.

### share

Sends your branch for review, mine to shared, as a draft. The checks run
first, and the tests too when tools or code changed. Example:
`dibon share`. **Until the move to GitLab**, only the owner pushes: if
the shared copy refuses, your work is saved on your branch; tell the
owner it is ready to merge.

### ready

Marks your shared work ready for review, so the reviewers are asked.
Example: `dibon ready`.

### status

Says where you are: your branch and its register row, the release,
anything unsaved or unshared, and the change notes waiting. Example:
`dibon status`.

### history

Says what changed in one document, newest first, under the release each
change went into, with the register row that asked for it. A change to
its status or dates alone is left out. The reader shows the same at the
foot of every page (click its "released" badge). Example:
`dibon history docs/customers/roan-capital.md`.

### help

Lists every word, or one word with its examples. Examples: `dibon help`;
`dibon help save`.

### release

The owner only, on main: releases the documentation or a customer's
delivery (rules, Dibon 12), commits it and tags it. Examples:
`dibon release docs`; `dibon release roan-capital`. `--body-file` gives the
release's commit a body, as for save.

### practice

Makes a private practice copy, with its own pretend shared copy, and
lists the exercises. Nothing done there reaches the real documents.
Example: `dibon practice`.

### role

Records your role once, for your notes and records: never your name.
Example: `dibon role "Project manager"`.

## 9 · Nine situations

1. **The start of the day.** "Update." Your copy takes in the team's
   changes, and says which files moved. If it stops on a conflict, ask
   for help.
2. **After a meeting with a customer.** "Start: Roan Capital's 22 October
   meeting. Mark answers 24 and 25 as answered. Note for Roan Capital:
   two open answers settled. Save. Share." Each answer moves, dated; the
   note waits for the customer's next release.
3. **A signed document arrives.** "Received: the signed services
   agreement from Roan Capital, in my Downloads." It is kept, read-only,
   registered with a DR id; the file leaves your Downloads.
4. **A correction that fails a check.** "Fix open answer 26's wording.
   Save." If a check fails, it says the file, the line and what is wrong:
   fix it and save again.
5. **A save that cannot be read two ways.** `save` alone asks what you
   changed; `save <a file in the repository>` saves only it; `save
   "Loan form.docx"` from outside points you to `received`.
6. **Oops.** "Undo my last save", or "discard my changes to the agenda".
   Each shows what it does before doing it.
7. **A developer's change to the tools.** `dibon start "…" --kind tool`,
   `dibon save "…"`, `dibon share`: the tests run because tools changed.
8. **What is waiting, and what has changed.** "Status." Your branch,
   what is unsaved and unshared, and the notes waiting for the next
   release. "History of Roan Capital's page": every change to it, by
   release, each with its register row.
9. **A release (the owner).** "Release the documentation." The notes go
   into the changelogs, the release is stamped, committed and tagged.

## 10 · Practice first

`dibon practice` (or "start practice" to Claude) makes the sandbox and
lists the exercises to try in order. A failing check and a conflict are
worth meeting there first: break a table row and save (situation 4), or
clone the practice copy's shared copy a second time and change the same
line in both (situation 1). A 30-minute walkthrough for the team: each
person runs situations 1 to 4 and 6 in their own practice copy.
