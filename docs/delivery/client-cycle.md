---
id: client-cycle
name: Each client's cycle — from a first conversation to production, and running it after
kind: plan
status: living
released: unreleased
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-1192, FS-1193]
last_reviewed: 2026-11-12
---

# Each client's cycle

How the team takes a client from a first conversation to production, and
then runs what it built (FS-1193). The hackathons exist to teach the
team this cycle until the team runs it without us: it builds, maintains
and operates the platform, and the team lead and commercial lead sit on
the change advisory board (ways-of-working §4).

**The rule:** a client is configured, never forked. Everything that
differs between clients is in its configuration pack (§2). If a client
needs a branch of the code, the pack is missing a field: add the field,
not the branch.

## 1 · The cycle

Six stages, each with an owner, what it leaves in git, and the gate it
must pass before the next begins.

| Stage | Owner | What it leaves in git | Gate |
|---|---|---|---|
| 1 · Conversation | The delivery lead, with the product owner | The customer page (docs/customers/), its journeys chosen, the capabilities it needs by id, register rows for what was asked | Scope agreed with the client |
| 2 · Demo instance | Ops | A pull request to the deploy repository that builds the client an instance from the template, with made-up data shaped like its products | Up within a working day; torn down when its time is up (§3) |
| 3 · Product intake | The delivery lead, with backend and Odoo | The client's configuration pack (§2), filled from its meetings, documents, extracts and answers | The pack passes its check |
| 4 · Test period | The engineering lead, with the client | The pack on the client's test instance; user acceptance as testing §4 has it; each journey's status | The client signs off |
| 5 · CI/CD and release | Ops, and the change advisory board | A code pull request, its tests and signed image; a deploy pull request, approved, applied by Flux (ways-of-working §2, §4) | The change approved |
| 6 · Operate | The squad that owns each service | Its dashboards, alerts, runbooks and on-call (§5) | Handed over: the squad's, not ours |

A second product for the same client starts again at stage 1, on the
same instance.

## 2 · The client's configuration pack

What makes one client's platform different from another's, kept as data
in the deploy repository beside the client's instance, one folder each,
and checked on every commit against a schema in `code/`, as the lender
rules and the transaction model are (rules as data).

| In the pack | Read by | Ids |
|---|---|---|
| Products, prices, fees and penalties | The lending and deposits services | `code/lender-rules/`; mfi, sacco |
| Approval chains and limits | The approval engine | approval-engine; FC-16 |
| Calendars: holidays, peak and slow days, cut-offs | Kapu Core | core KC-15 |
| Rulebooks: the regulator's ratios and returns | Treasury | treasury TR-14 to TR-16 |
| Rails and banks, their settings | The rails | rails rule 13 (`rail.setting`) |
| The back office: chart of accounts, staff, roles | Odoo, through the back-office gateway | business-suite |
| Its name, colours and channels | The channels | gateway GW-15 |

**Where each kind of input goes:**

- **Meetings:** notes become rows in the register and answers in the
  pack; the customer page records what was decided.
- **Documents** the client gives us (policies, product sheets, forms):
  the originals in `clients/`, never committed, with their fingerprints
  (tools/originals.js); what they say, summarised into the pack.
- **Extracts from the client's current platform:** real records, so they
  stay in `clients/` on Dibon's machines and on the site in Kenya, never on
  public Azure (privacy, "In Kenya"; LQ-46). Demo and test instances get
  made-up records generated to each extract's shape, so the migration is
  rehearsed without the data.
- **Configuration the client chooses:** asked as the pack's own
  questions, so nothing is chosen in a meeting and left there.

## 3 · Environments

| Environment | Where | Data | Lives | Changed by |
|---|---|---|---|---|
| Each person's | Public Azure, `rg-sbx-` and a handle | Made up | Until its owner removes it | Its owner |
| A squad's | Public Azure, `rg-ws-` and a squad | Made up | Rebuilt from code at will | The squad |
| A client's demo | Public Azure, a group per client | Made up, shaped like the client's | Its demo period, then torn down | Ops, by pull request |
| A client's test | Public Azure while hosting in Kenya is settled; then Kenya | Made up on Azure; real only in Kenya | The test period | Ops, by pull request |
| Production | Kenya: site A and site B (deployment) | Real | Until the service ends | The change authority (ways-of-working §4) |

**Build only on what Liquid's Azure Stack will also run** (FS-1192):
Kubernetes, Flux, CloudNativePG, Kafka, OpenBao and Keycloak in the
cluster, storage the cluster mounts; no Azure platform service that Azure
Stack lacks. Otherwise the move to Kenya is a rebuild, not a redeploy.

## 4 · Release

Every change reaches a client the same way, so what was approved is what
runs (FS-896): a pull request to the code repository, reviewed and
tested (testing §1); an image built and signed; a pull request to the
deploy repository naming it; approved by the change authority, and by
the board for a release it advises on (ways-of-working §4); applied by
Flux outside the change calendar's blackouts. A rollback is the same
road, backwards.

## 5 · Operate: done means running

A piece of work is done when it runs and someone answers for it, not
when it is merged:

- tested, each acceptance item it covers passing (testing);
- deployed through the chain of §4, not by hand;
- a dashboard, and an alert that wakes someone when it matters;
- a runbook for each alert (docs/runbooks/);
- its squad named in `CODEOWNERS`, and on that squad's on-call.

Each squad (ways-of-working §1, "Squads") owns its services end to end:
it builds them, is woken by them, and fixes them.

## 6 · The hackathons

Four, in order, each ending with something running that the team runs
itself:

| | The hackathon | Done when |
|---|---|---|
| 1 | **Walking skeleton** | Each squad ships a small service through the whole chain of §4, with an alert and a runbook |
| 2 | **A client's demo from its pack** | Roan Capital's products, made-up data, one loan journey end to end, from a channel to Fineract and back |
| 3 | **Game day** | Things broken on purpose and put right: a rollback, an emergency change, a rail's key rotated (rail-credentials), a peak day carried (peak-and-slow-days) |
| 4 | **A second client from configuration alone** | Flex Money's or Lofty Corban's demo from its own pack, with no change to the code |

The MVP day of 6 November (mvp-day) was the first rehearsal of the
first. A hackathon that ends with only a demo has taught a demo.

## 7 · Before the first

- Everyone can sign in to Azure, GitHub and OpenBao themselves.
- The code and deploy repositories, with branch protection and
  `CODEOWNERS` naming each squad's team (github).
- The instance template: one pull request builds a client's instance.
- The configuration pack's schema, and Roan Capital's pack begun from its
  customer page.
- The squads confirmed by their members (ways-of-working §1), and the
  sandbox's workstreams renamed to them.
- The planning board split by squad, each hackathon a milestone.

## 8 · Open

- The hackathons' dates.
- The configuration pack's schema: written in `code/` beside the lender
  rules, by backend.
- How long a demo instance lives before it is torn down.
- The site in Kenya (FS-032, FS-775), and until then LQ-46 for any real
  data.
