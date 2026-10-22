---
id: ways-of-working
name: Ways of working — roles, pull requests, reviews, git, and the team's words
kind: plan
status: living
released: 2026.10.16
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-701, FS-743, FS-745, FS-746, FS-747, FS-749, FS-750, FS-751, FS-753, FS-755, FS-756, FS-757, FS-846, FS-847, FS-848, FS-849, FS-853, FS-865, FS-902, FS-903, FS-904, FS-905, FS-896, FS-888, FS-889, FS-890, FS-891, FS-892, FS-922, FS-931]
last_reviewed: 2026-10-22
---

# Ways of working

How the team changes what we design and what we run: who approves what,
how a pull request goes, and the rules that stand in for an architecture
review board and a change advisory board at our size (FS-743 to FS-749).
It applies to this repository and to the code repository alike, both on
GitHub (FS-896). And how everyone, technical or not, makes their updates
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

| Role | Accountable for | Approves | Held today by | Deputy |
|---|---|---|---|---|
| **Team lead** | Direction, money, what we promise customers; chairs the weekly meeting | Decisions that cost something (docs/decisions.md); scope and releases (docs/delivery-plan.md) | The CTIO | The CEO |
| **Solution architect** | How the platform fits together | docs/architecture/, docs/specs/, the technology register, interfaces | The CTIO | The dev lead |
| **Security lead** | Security controls, keys, access, the edge | docs/modules/platform-security.md, the endpoints and access specs; every spec's Threats section; any change to a security control | The CTIO | The ops lead |
| **Compliance and risk officer** | The law, privacy, our duties to regulators; data protection officer if the Act requires one | docs/regulation.md, compliance.md, privacy.md, rules.md, legal-questions.md, documents.md | Vacant: the CTIO until Cage joins | The CEO while the CTIO holds it; then the CTIO |
| **Product owner**, one per product | What a product does, and in which phase; as ITIL's service owner, that it meets what was agreed | Its module in docs/modules/, its journeys | Kapu MFI: the CTIO until named | The dev lead |
| **Delivery lead** | Each customer's delivery | docs/customers/, customers.md, onboarding.md, the delivery plan's dates, training | The project manager | The admin |
| **Engineering lead** | How code is built and tested | The code repository; docs/testing.md; each build spec's tests | The dev lead | An engineer (Gasine) |
| **Operations lead** | Running the platform; the change authority for normal changes | docs/service-management/, operating-model.md, deployment and runbooks; normal changes (§4) | The ops lead | The CI/CD engineer |
| **Odoo lead** | The Odoo platform and its set-up, for Dibon and for each customer (FS-902) | docs/modules/business-suite.md; each customer's Odoo configuration and its data migration | The Odoo lead | An Odoo engineer (Daniel) |
| **Commercial lead** | What we sell, and to whom | docs/marketing/, partners.md, competitors.md | The CEO | The CTIO |

**The team today** (FS-882). We are a small team, so who is doing what
goes by name as well as by role: each open row of the review register
says who has it, by name (its *With*), and the reader adds the
role. Approvals still go to roles, and the documents still name roles.
Names are our own team's only: never a customer's or a partner's people.
Each person confirms their own row; until then it says "To confirm",
and the owner marks it as they do (FS-885). More context is to come.

| Name | Handle | Team | Role | Holds today | Confirmed |
|---|---|---|---|---|---|
| Eric | emokaya | Leadership | CTIO | Team lead, solution architect, security lead, product owner for Kapu MFI; compliance and risk officer until Cage joins | Yes, 2026-10-17 |
| Jimmy | jbett | Leadership | Partner and CEO | Commercial lead; the team lead's deputy, and compliance's until Cage joins | To confirm |
| Cage | cage | Leadership | Legal and compliance (joining soon) | Compliance and risk officer, once joined | To confirm |
| Lillian | lillian | DevOps | Dev lead | Engineering lead; the architect's deputy, and the product owner's for Kapu MFI | To confirm |
| Allan | allan | DevOps | Ops lead | Operations lead, chairing the change advisory board (§4); the security lead's deputy | To confirm |
| Gasine | dmwangi | DevOps | Engineer | The engineering lead's deputy | To confirm |
| Cliff | cliff | DevOps | Mobile engineer | — | To confirm |
| Max | max | DevOps | CI/CD engineer | The operations lead's deputy | To confirm |
| Abel | abel.ryan | DevOps | Intern | Approves nothing; mentored by the dev lead | To confirm |
| Gibeon | gibeon | Odoo | Odoo lead | Odoo lead (FS-902): one of the two Odoo consultants FS-640 planned for | To confirm |
| Daniel | daniel | Odoo | Odoo engineer | The Odoo lead's deputy | To confirm |
| Betty | bflorah | PM | Project manager | Delivery lead | To confirm |
| Carol | cwanjiru | Admin | Admin | The delivery lead's deputy | To confirm |
| Chan | chan | Social media | Social media | Marketing, with the commercial lead | To confirm |
| Claude for Eric | claude-emokaya | Assistant | Assistant to Eric | Drafts, builds and checks on Eric's word; holds no role and approves nothing | Yes, by Eric |

**A name is one person, and so is a handle** (FS-905). Where two people
share a first name, each takes an initial ("Eric M.", "Eric K."); the
check refuses a name or a handle listed twice. The handle is the local
part of the person's work email, to confirm as each confirms their row;
it never changes when a display name does. Confirmed from work emails on 22 October for those whose address we hold (FS-937); the rest are to confirm. Lillian's and Max's wait, their surnames being on the protected-names list. A role mailbox is not a handle: the project manager's is an alias, bflorah.

**Each person's Claude is its own** (FS-905): listed as "Claude for" that
person, acting only on that person's word, committing as
`Claude for <name> <claude-<handle>@noreply.dibon.co.ke>` (dibon claude,
§8) on its own branches, `claude/<handle>/…`; never under one identity
for everyone's Claude, nor under the person's own.

**Outside the team:** HR is outsourced to iManage, a supplier: its people
are never named here, and since it holds staff records it works under a
data processing agreement (FS-906).

**Who sees what about a project** (FS-903). Our own people are open to
the whole team; a customer's people are named only where their project's
team can see them:

| What | Who sees it | Where it lives |
|---|---|---|
| Who on our team works on what, who leads it, who has joined | The whole team | This repository: the register's With, each customer's §7 |
| That a customer has a tech lead, a marketing lead, a finance lead, and what each decides | The whole team | This repository, by role only ("Roan Capital's tech lead approves the test plan") |
| A customer contact's name, work email and work phone | That customer's project team; the delivery lead, the commercial lead and the team lead | Dibon's Odoo: Contacts and CRM, linked to the customer's Project; joining a project makes you a follower and opens them, leaving closes them |
| Anything more about a person (identity numbers, home address, personal phone) | No one beyond what the work needs | Never kept, or in the vault; never here |

Business contacts are personal data (LR-17): held to deliver the
engagement, no more than name, role and work contacts, archived when the
engagement ends, and the contacts told so in the engagement letter or its
privacy notice.

**Deputies** are named in the roles table (FS-898, FS-902), never the role
holder. A deputy approves under their own name while the holder is away,
or where the holder wrote what is to be approved.

**On GitHub** (FS-896), each role is a team (`@dibon/architects`,
`@dibon/security`, …) and a person joins every team whose role they hold;
code owners name teams, so the approval follows the role, and a code owner
needs Write on the repository to approve. Until single sign-on (GitHub
Enterprise Cloud) fills the teams from Keycloak, the security lead keeps
them by hand, against this table, each month.

## 2 · A pull request, step by step

Every change, to a document or to code, is a pull request into a
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
   rules cannot be edited inside a pull request.
6. **Merge checks:** the pipeline passes, every thread is resolved, and
   the branch is current with main. Then it merges itself (auto-merge),
   squashed, with the pull request's description as the commit message,
   so the reasoning stays in history.
7. **A change that needs another first** names it as a dependency: code
   that implements a spec waits for the spec's pull request.

**Code owners**, by section:

| Section | Paths | Approves |
|---|---|---|
| Architecture | docs/architecture/, docs/specs/, docs/decisions.md | Solution architect |
| Security | docs/modules/platform-security.md, docs/specs/endpoints.md, docs/specs/access-keycloak.md | Security lead |
| Compliance | docs/regulation.md, compliance.md, privacy.md, rules.md, legal-questions.md, documents.md | Compliance and risk officer |
| Products | docs/modules/, docs/journeys/ | Product owner |
| Delivery | docs/customers/, customers.md, onboarding.md, delivery-plan.md, docs/training/; this file, with the operations lead, for §7 to §10 (GitHub names owners by file, so the delivery lead approves any change to it) | Delivery lead |
| Operations | docs/service-management/, operating-model.md, business-continuity.md | Operations lead |
| Commercial | docs/marketing/, partners.md, competitors.md | Commercial lead |
| Tools | tools/, design/ | Engineering lead |

**Labels** say what a pull request is: `kind::standard`, `kind::normal`,
`kind::emergency`; `release::R1a`, `release::R1b`; `architecture` (§3).

**Claude works the same way:** on a branch, opening pull requests that
a person approves; never with a secret or a client's material.

## 3 · Architecture review: the rules

1. **An architecture decision** is any of: a new component or a change of
   one (a technology register row); a change to a spec's interfaces,
   data or security; a flow across modules; where things run and how
   they fail over; a licence decision; anything costly to undo.
2. **It is made in a pull request labelled `architecture`,** carrying a
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
are in [service management](README.md) §2. These rules say who decides,
ITIL's *change authority*, and how the change advisory board advises on
releases (FS-904).

1. **Standard changes** run without approval each time. The operations lead
   keeps their list; a change joins it only after it has run as a normal
   change without incident at least three times.
2. **A normal change** is approved in its pull request by the operations
   lead, after a peer's review; also by the security lead when it
   changes a security control, and by the product owner when customers
   will see it. Its deployment to production is a pull request to the
   deploy repository, which Flux applies once the operations lead has
   approved it, so what was approved is what is deployed (FS-896).
3. **An emergency change** is made by the on-call engineer with the
   operations lead, or the security lead when it closes a security hole,
   and is reviewed in a pull request within two working days.
4. **The change calendar's blackouts hold deploys:** Flux pauses within
   them, and a check refuses a deploy pull request inside one unless it
   is labelled `emergency`, its approval recorded.
5. **The weekly meeting reviews** the coming week's normal changes, last
   week's emergencies, and any change that failed; and watches four
   measures: how often we deploy, how long a change takes to reach
   production, how many changes fail, and how fast we recover, computed
   from the deploy repository's merges and Flux's records.
6. **Where a customer runs its own change board,** we attend it, and its
   approval is added to ours.

**The change advisory board** (FS-904) advises on every release; the
change authority above still decides. The operations lead chairs it, in a
weekly slot of the weekly meeting.

| Release | The board | How |
|---|---|---|
| A documentation patch | No | The team lead releases it |
| A documentation minor | In writing | The chair and one other member approve the release pull request |
| A documentation major; a customer's delivery; a platform release to production; an Odoo release for a customer; a go-live | In the weekly slot | Its quorum, and the seats its areas touch |
| An emergency | The operations lead and the security lead, within hours | Reviewed in the next slot |

| Seat | Held by | Looks at |
|---|---|---|
| Chair | The operations lead | The change calendar, the rollback plan, deployment readiness |
| Architecture and security | The solution architect and security lead | Design fit, security controls, threats |
| Engineering | The engineering lead | Tests passed, acceptance met |
| Odoo | The Odoo lead, for an Odoo release | Configuration and data migration |
| Delivery | The delivery lead | The customer ready: notices, training, support |
| Compliance | The compliance and risk officer | Regulatory notice and approval: a price change's (LR-03 reg 55), a new channel's (LR-03 reg 27) |
| Commercial | The commercial lead, for a major release or a go-live | What we have promised customers |
| Secretary, no vote | Claude | Prepares the release pack; records the decision |

**Quorum:** the chair, engineering and delivery; security and compliance
whenever their area is touched. No one approves their own release: their
deputy takes the seat.

**The release pack,** two working days before the slot: the notes
waiting and the documents changed; the checks and tests; the risks and
the rollback; what each customer sees, and the notice it is owed; the
change calendar's windows; the criteria for go or no-go. The board
decides **approve, approve with conditions, defer or reject**; the
approvals stand on the release pull request, and the decision gets a line
in the decisions log. The team lead, or their deputy, then cuts the
release and its tag (FS-886). The next slot looks back at it.

**On GitHub:** a `cab` team owns, in `CODEOWNERS`, CHANGELOG.md, the
external release notes and each customer's §8, so a release pull request
needs the board; it needs two approvals, a code owner's among them, reset
by new commits. A tag ruleset lets only the team lead and their deputy
create release tags. A "Release" view in the planning board is the slot's
agenda.
## 5 · Working together

What lets people work on their own and still in step (FS-749; adopted
by the owner on 2026-10-16, FS-867):

| Practice | What it means here |
|---|---|
| **Write it down first** | A point raised is a register row; a decision is a decision entry; a question for counsel is an LQ row. Nobody has to have been in the meeting |
| **Async by default** | Pull requests, threads and issues before meetings; a meeting is for what writing could not settle |
| **Small, short-lived changes** | Branches live a day or two; a pull request a reviewer can read in twenty minutes |
| **Reviews within a working day** | Reviewers answer within one working day; a suggested change can be applied in one click |
| **Ownership is visible** | The code owners table answers "whom do I ask?" |
| **One board, from the register** | The reader's Board (FS-891): every open row as a card, to pick up, being done, in review, done in the last fortnight, each with who is on it and since when; built from the register and the branches, so there is no second list to keep. Until the team is in Dibon's GitHub organisation, a card moves only once its save is merged |
| **Join, don't claim** | Anyone joins a row with `dibon join` (FS-892): their name goes on it after its lead, and they work on their own branch. The first name leads: answers for the row and says when it is done. `dibon leave` steps off; the next name leads, and the last one hands it to someone. Claude joins only on its person's word |
| **About three at once** | More than three things started at once and nothing finishes: `dibon new` and `dibon join` note it, and `dibon resume` lists them (FS-891) |
| **Specs before code** | A capability is built from its spec and journey; a story cites both (testing.md) |
| **Released by a switch, not a deploy** | New behaviour ships off, behind a flag, and is turned on when ready |
| **Definition of done** | Merged with its tests, its documents and its runbook current; the register row closed |
| **A weekly rhythm** | Our weekly meeting (decisions, architecture slot, changes); a short demo of what shipped; a retrospective every second week |
| **Blameless reviews** | After an incident or a failed change: what happened and what we change, never who |
| **Focus time** | Core hours for meetings; protected blocks without them |
| **Hand-overs in writing** | On-call hand-over notes; a new joiner starts at start-here.md |

## 6 · Git conventions

How everyone uses git, so that history stays readable and nobody
overwrites anyone (FS-846). On GitHub, the rulesets and code owners of
[github.md](../specs/github.md) §4.2 and §4.3 enforce
most of it; the rest is habit. People who do not use git directly use the
team's words (§7 to §10, FS-847), which follow these rules for them.

| Practice | The convention |
|---|---|
| **One long-lived branch** | `main`, protected. Work happens on short-lived branches, one register row or a tight group of rows each, merged within two or three days |
| **Branch names** | `<kind>/<FS id>-<a-few-words>`, the kind one of `docs`, `spec`, `code`, `fix`, `tool`, `release`: `docs/FS-845-dated-versions`. Claude's branches are `claude/<handle>/<FS id>-<a-few-words>`, the handle the person's whose Claude it is (FS-886, FS-905) |
| **Who did what** | Each commit is authored by whoever wrote it, under their own name: Claude's as `Claude for <name> <claude-<handle>@noreply.dibon.co.ke>`, whose Claude it is (FS-905), never under a person's identity nor one shared by everyone's Claude. A merge and a release are the act of the person who takes the work in, under their own name (FS-886) |
| **Releases are dated tags on main** | `docs-2026.10.15`, `roan-capital-2026.10.15` (rules, Dibon 12). A release branch, `release/<series>-<date>`, only to fix an old release a customer still runs: the fix lands on main first, then is cherry-picked back |
| **Commit subject** | `FS-123: what changed`, at most 72 characters; the hook refuses a subject without its register row (Merge, Revert and Release excepted) |
| **Commit body** | Why, not what; wrapped at 72 columns; trailers last (`Co-Authored-By:`) |
| **Mechanical changes apart** | A sweep across many files (a status for every document, renumbered ids) is its own commit, never mixed with a change a reviewer must read |
| **Who settles a conflict** | Its author, by downloading: the repository's latest under their own work, settled on their own branch. The person who merges takes in only what is already clean, so a merge never rewrites anyone's lines (FS-886, FS-890) |
| **Generated sections are made again** | "Regulations cited", each customer's documents table: never merged by hand; `dibon download` makes them again after the team's changes arrive (FS-890) |
| **Rewrap only what you change** | A word changed is one line changed: rewrapping a whole paragraph for it makes every line of it collide with anyone else's change there. `dibon save` notes a paragraph rewrapped for a word (FS-890) |
| **Say when you share a file** | `dibon save` notes a file you changed that someone's uploaded branch changes too, naming the branch and its author: talk before you both change the same lines (FS-890) |
| **Keep current by rebasing** | `git fetch`, then `git rebase origin/main`; never merge main into a branch. Force-push only your own branch, and only `--force-with-lease`; never main |
| **Undo with a new commit** | `git revert` on main; history on main is never rewritten |
| **Merge, keeping who did what** | Squash only within one person's own branch; between people, a merge commit, so each commit keeps its author and the merge records who took it in. One person's pull request may still be squashed to one commit under their name (FS-886) |
| **Tags are annotated, and signed once keys exist** | `git tag -a docs-2026.10.15 -m "…"`; a published tag is never moved or deleted |
| **Line endings** | LF everywhere (`.gitattributes`); a clone sets nothing by hand |
| **The register** | REVIEW.md, its open rows, and review/, its closed rows by the hundred (FS-866), merge by union, so two branches' new rows both survive; the register check fails a skipped or repeated FS id. Rows two people touched come back twice; `dibon download` brings them together (FS-890): a row new on both sides keeps the repository's id and mine is renumbered, everywhere my branch cites it; a row both edited is merged cell by cell, notes from both kept, and a cell both changed keeps the repository's, said aloud |
| **Changelogs** | Never edited by hand: each pull request carries a change note, and a release gathers them (rules, Dibon 12) |
| **Hooks** | `git config core.hooksPath .githooks` once per clone: pre-commit runs the checks, commit-msg holds the subject |
| **Size** | A pull request a reviewer reads in one sitting, about 400 changed lines for code; the reader's preview shows documents as pages |

**Until the team is in Dibon's GitHub organisation** (github spec §5),
the owner is the only one who pushes to main, on their word ("push"):
the single-owner exception. The
team works on branches and shares them; the owner merges.

**Claude's work is a conversation, private until the owner says
otherwise** (FS-886). Claude works only on its own branch, its commits
under its own name, and the owner's merge is the owner's:

| Conversation | Claude's work | Who can see it |
|---|---|---|
| **Just us** | On Claude's branch on the owner's computer, not uploaded | The owner and Claude |
| **Private** | Uploaded to Claude's own branch, not shared | Anyone who looks; addressed to no one but the owner |
| **Public, with the team** | Shared: a review opened, the team asked | The team, asked to respond |

Private is the default. Work becomes public only on the owner's word
("share"), or where the owner has said a piece of work is for the team;
anything sensitive and undecided, a draft decision about a customer or a
reading of the law, stays "just us" until the owner chooses. Replies in
a shared review are each under their writer's name.

## 7 · The team's words

How everyone, technical or not, makes their updates and stays in step
with the rest of the team (FS-847 to FS-849). There is one small set of
words. **A project manager says them to Claude in the desktop app**, in
plain sentences: "download, then mark Roan Capital's answer 24 as
answered". **A developer types them:** `dibon download`. Either way the
same thing happens underneath: the git, the checks and the records, done
the way §6 says. Developers may also use git directly, by those
conventions.

**The words are said from your side** (FS-879 to FS-881). There is your
copy, on your computer, and the repository ("the repo" when speaking),
which everyone shares, on GitHub. Your work moves
outwards in four steps, each reaching further:

| Word | Your work goes | Who sees it |
|---|---|---|
| **save** | into your copy, on your branch | you |
| **upload** | onto your own branch in the repository | you, kept safe; not yet for review |
| **share** | before the team, as a review | the team |
| **release** | out to the public: the documents' readers, or a customer | everyone it is for (the owner's word) |

And one inwards: you **download** the repository's latest into your
copy. "Update" is not a word: it could mean download or upload, so the
tool, and Claude in the desktop app, ask which you mean.

### The cheat sheet

| Say | What it does |
|---|---|
| **download** | Bring the latest from the repository into my copy (the repository to me) |
| **start** "…", or **new** | Begin a piece of work on its own branch, with its register row; **new spec** "…" (or journey, module, customer) makes the document too |
| **resume**, or **continue** | Go back to something I started; my unsaved edits are parked, not lost |
| **join** row | Take part in a row someone has: my name after its lead, my own branch for it |
| **leave** row | Step off a row; the next name leads |
| **note** "…" | Write the change note: what changed, and for whom |
| **meeting** customer date | Open a meeting record, registered as a document |
| **answered** customer number "…" | Move a customer's open answer to Answered, dated |
| **received** file `--from` customer | Keep a document from outside as an original, and register it |
| **check** | Run the checks and say, in plain words, what to fix |
| **save** "…" | Save my work on my branch; the checks run first |
| **undo** | Take back my last save |
| **discard** file | Throw away unsaved changes to one file, after showing them |
| **upload** | Put my saved work on my own branch in the repository: still mine, not yet for review |
| **share** | Put my uploaded work before the team, for review; the checks run first |
| **status** | Where am I, and what is waiting |
| **history** file | What changed in one document, by release |
| **help** | Every word, with examples |
| **release** | The owner only: release to the public, the documentation or a customer's delivery |
| **practice** | A private sandbox to try every word safely |
| **role** "…" | Tell the words your role, once |
| **claude** handle | Set, once, the name my Claude commits under |
| **session start**, **session end** | Begin my day with the team's handover and mine; end it with mine brought up to date |

### What each word does for you

Each word does its git and its records the same way every time, so you
need not remember them (FS-922). What happens on its own, beyond what
you asked:

| Word | What it does for you, on its own | When it stops (nothing is lost) |
|---|---|---|
| **download** | Fetches the team's latest and puts it under your work; brings the register's rows together (a row of yours whose id the team took meanwhile is renumbered, everywhere your branch cites it; a row you both edited is merged, both notes kept); makes the generated sections again; saves that as one change of yours; notes which reviews are open, for the Board | You have unsaved edits; your change and a teammate's touch the same lines |
| **start**, **new** | Fetches; parks your unsaved edits with the work you were on; makes your branch from the team's latest, named by its kind, row and words; opens the register row, with you as its raiser and its holder; with a kind, makes the document from its template, a spec or journey listed in its index; offers to take you back to a title you started already; notes when you have three things started | Unsaved edits on main |
| **resume**, **continue** | Lists your work not yet merged, and your Claude's; parks the edits you leave and brings back the ones parked where you arrive | The name matches nothing, or more than one; it is your Claude's work |
| **join**, **leave** | Join: your name on the row after its lead, your own branch for it, your edits parked. Leave: your name off, the next name leading | The row is closed; you are the last one on it (say who takes it) |
| **note** | Writes the change note, signed by your name and role, its rows from your branch | A note read outside Dibon that carries a register id |
| **save** | Files the register's rows by their status; notes a file someone's uploaded branch changes too, and a paragraph rewrapped for a word; keeps the front matter of each document whose content you changed current (today's `last_reviewed`, your row in its `review_ids`); makes the generated sections again; runs the checks; saves with your row in the subject; rebuilds the reader where the commit hook does not; reminds you if your branch has no change note | No description; the checks fail (each said in plain words); a document from outside |
| **upload** | Puts your branch on the repository, safely over an earlier upload of it | The repository refuses (until the team is in the organisation, only the owner uploads) |
| **share** | Runs the checks, and the tests when tools or code changed; uploads; opens your review, or marks it ready; notes it for the Board | Unsaved edits; a check or test failing |
| **undo** | Takes back your last save: kept as edits before upload, a correcting change after | Nothing of yours to undo on main |
| **discard** | Shows what would be lost, then throws away one file's unsaved changes | — |
| **status** | Your branch, the release, what is unsaved and uploaded, the notes waiting, what you started, what your Claude has waiting, and how long since you downloaded | — |
| **meeting**, **answered**, **received** | Each writes its record and registers it: a meeting record and its document row; an answer moved and dated; an original kept read-only, fingerprinted, and registered | The customer or file is not one we know |
| **release** | The owner's: gathers the change notes into the changelogs, stamps each changed document's `released:` line, then the tag | Not the owner; nothing waiting |
| **session** | Start: downloads, then puts the team's handover and yours together for a new session, your generated part fresh, and shows your status. End: your generated part fresh (your rows, your work, your Claude's), and what is unsaved or not uploaded; your Claude then writes where you left off and your preferences | Start does not download over unsaved edits |
| **check**, **history**, **help**, **practice**, **role**, **claude** | Read or set only: the checks explained, a document's history, the words, a practice copy, your role, your Claude's name | — |

**What no word does for you:** write a handover's words (your Claude
writes yours at the end of a session; the team's changes by pull
request); upload, share, merge or
release unless you say so; close a register row or write a decision.

### Three rules, and once before the first time

**Three rules.** Download first, every day. A stop protects you: nothing is
lost, and the message says what to do. Nothing is guessed: say what you
mean, and a word that cannot tell asks.

**Once, before the first time:** `dibon role "Project manager"` (your
role, beside your name), `dibon claude` and your handle if you work with
Claude (§1), and, for developers,
`git config core.hooksPath .githooks`. On Windows, `dibon` runs from the
repository's folder (`dibon.cmd`); elsewhere `./dibon`.

## 8 · The words

### download

Brings the latest from the repository into your copy: from the repository to you,
never the other way. Example: `dibon download`. Daily, at least:
`dibon status` reminds you after a day. **Afterwards** it brings the
register's rows together (a row of yours whose id the team took meanwhile
is renumbered, and says so; a row you both edited is merged, both notes
kept), makes the generated sections again, and saves that as one change
of yours (FS-890). **If it stops** because you have unsaved
edits: save or discard them first. **If it stops** because your change
and a teammate's touch the same lines: nothing is lost; ask Claude or an
engineer to bring the two together. Never edit conflict markers by hand.

### start

Begins a piece of work on its own branch, named after its register row;
without `--row`, it opens a new row. Given only a title, it asks once
what you are starting: changes to documents we have, or a new spec,
journey, module or customer. Started that title already? It offers to
take you back to it instead. Unsaved edits on what you were doing are
parked with it (see resume). Examples:
`dibon start "Roan Capital meeting, 22 October"`;
`dibon start "Fix the agenda" --row FS-826`.

### new

The same word as start (FS-888). Name a kind and it makes the document
too, from its template, its front matter filled in: `spec` (with
`--type component` for a product we configure), `journey` (the next JN
number), `module` or `customer`. A spec and a journey are listed in their
index at once; it says what is still yours to write, and the checks say
what is missing until you save. `dibon new meeting` is the meeting word.
Examples: `dibon new spec "Loan top-up"`;
`dibon new journey "A borrower tops up a loan"`.

### resume

Back to something you started (FS-889). Alone, it lists your work not yet
merged, numbered, with what each has saved, whether it is uploaded, and
where you are now. Say which by its number, its row or a word from its
title, and it takes you there: your unsaved edits are parked with the
work you leave, and come back when you return to it. Your own Claude's
work waiting for you is listed under yours (FS-907), to see, not to
resume: ask Claude to go on with it. A teammate's branches, and their
Claude's, are theirs and not listed. Examples:
`dibon resume`; `dibon resume 2`; `dibon resume FS-890`;
`dibon resume top-up`.

### join

Takes part in a row someone already has (FS-892): your name goes in its
With, after its lead's, and a branch of your own starts for it,
`docs/<row>-<your handle>-<words>`, so your work stays yours. No one's
leave is needed; the people on it see you on the board once your save is
merged. With three things already started, it notes it. Example:
`dibon join FS-826`.

### leave

Steps off a row: your name comes out of its With, and the next name
leads. The last one on it hands it to someone: `--to` and their name.
Your branch stays yours, to finish or discard. Examples:
`dibon leave FS-826`; `dibon leave FS-826 --to Betty`.

### continue

The same word as resume. Examples: `dibon continue`;
`dibon continue top-up`.

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
`received`. **It notes, without stopping,** a file you changed that
someone's uploaded branch changes too, and a paragraph rewrapped for a
word (FS-890). **Before the checks, it keeps current** the front matter
of each document whose content you changed (today's `last_reviewed`,
your row in its `review_ids`) and the generated sections; **after
saving,** it rebuilds the reader where the commit hook does not, and
reminds you if your branch has no change note (FS-922). `--body-file` adds a body to the saved change from a file:
why it changed, and any trailer such as Co-Authored-By (FS-862).

### undo

Takes back your last save. Before you share it, the save is undone and
your edits stay in the files; after, nothing is rewritten: a correcting
change reverses it. Example: `dibon undo`.

### discard

Throws away unsaved changes to one file, after showing exactly what would
be lost. Example: `dibon discard docs/customers/roan-capital.md`.

### upload

Puts your saved work on your own branch in the repository: safe off
your computer, still yours, not yet in front of the team. Upload as
often as you like. Example: `dibon upload`. **Until the team is in
Dibon's GitHub organisation**, only the owner uploads: if the repository refuses,
your work is saved on your branch; tell the owner it is ready.

### share

Puts your uploaded work before the team, for review: the checks run
first, and the tests too when tools or code changed; anything not yet
uploaded is uploaded; then a review is opened, or yours marked ready, and
the reviewers are asked. Example: `dibon share`. ("Ready", the old word,
points here.)

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

The owner only, on main: releases to the public, the documentation or
a customer's delivery (rules, Dibon 12), commits it and tags it. Examples:
`dibon release docs`; `dibon release roan-capital`. `--body-file` gives the
release's commit a body, as for save.

### practice

Makes a private practice copy, with its own pretend repository, and
lists the exercises. Nothing done there reaches the real documents.
Example: `dibon practice`.

### role

Records your role once, for your notes and records, beside your name
where the team table has none for you.
Example: `dibon role "Project manager"`.

### session

Begins and ends a working session (FS-931). `dibon session start`
downloads, then puts the team's handover (HANDOFF.md) and yours
(handoffs/ and your handle) together in build/session/, for a new
session to read, and shows your status. `dibon session end` brings the
generated part of yours up to date (the rows with you, your work
started, your Claude's work waiting) and says what is unsaved or not
uploaded; your Claude then writes where you left off and any
preferences, and you save. Examples: `dibon session start`;
`dibon session end`.

### claude

Sets, once, the identity your Claude commits under: "Claude for" you,
from your handle in the team table (§1), so the history shows whose
Claude did what. With no handle, says what it is now.
Example: `dibon claude eric`.

## 9 · Nine situations

1. **The start of the day.** "Download." Your copy takes in the team's
   changes, and says which files moved. If it stops on a conflict, ask
   for help.
2. **After a meeting with a customer.** "Start: Roan Capital's 22 October
   meeting. Mark answers 24 and 25 as answered. Note for Roan Capital:
   two open answers settled. Save. Upload. Share." Each answer moves, dated; the
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
   `dibon save "…"`, `dibon upload`, `dibon share`: the tests run, at share, because tools changed.
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
clone the practice copy's pretend repository a second time and change the same
line in both (situation 1). A 30-minute walkthrough for the team: each
person runs situations 1 to 4 and 6 in their own practice copy.
