---
id: testing
name: Testing — what must be true, how it is proven, and where the proof is kept
kind: plan
status: living
released: 2026.10.15
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-074, FS-548, FS-558, FS-560, FS-627, FS-668, FS-669, FS-701, FS-896]
last_reviewed: 2026-10-22
---

# Testing

**The rule:** a capability is Built when every acceptance item that
covers it has a passing automated test, and not before (FS-560). Status
is evidence; a test is the evidence for Built.

## 1 · One chain, each link in one place

```
  law (LR, reg) -> requirement (RC) -> capability (ID-01, MF-22 ...)
       -> acceptance item: a spec's row, or a journey's step or §3 row
       -> automated test, tagged with the item and the capability
       -> the result, from CI, per commit
```

| Link | Where it is kept | Who writes it |
|---|---|---|
| The law and the requirement | docs/regulation.md; the customer's delivery map | Here |
| The capability | Its module's §3 | Here |
| **Acceptance items** | The build specs' "Acceptance tests" tables (`lender-rules A5`) and the component specs' "Checks before the build" (`kapu-core-fineract F3`), run on a working instance before the build relies on them; every step and §3 row of a journey (`JN-02 2.4`, `JN-02 3a`) | Here, with the spec or the journey |
| **The tests** | The code repository, beside the code they test | The person who builds the code |
| **The results** | CI, on every commit, as a JUnit report | CI |
| **The coverage matrix** | Generated in the code repository from the tags and the results | A script, not a person |

An acceptance item says what must be true in the words of the business.
A test proves it in code. Neither is copied into the other's repository:
the test names the item, and the item never names the test.

**Journeys become executable scenarios** (FS-668): each step and §3 row
of a journey is written in the code repository as a Given/When/Then
scenario (Gherkin, run by Cucumber, as Fineract's own end-to-end tests
are), tagged with the item: `@JN-04-3c`. A journey reaches status
"tested" when every one of its scenarios passes.

**From journeys to stories** (FS-669). A journey is the whole path one
person takes; a story is one piece of work small enough to build and
test in a few days. The journey's steps are the backbone of a story map:
the stories for each step sit beneath it, and the release line is drawn
across them.

- **Stories live in the code repository's issue tracker** (GitHub
  issues, FS-896), beside the
  code they change. Odoo Project keeps what the customer sees:
  onboarding, user acceptance, sign-off (§4).
- **Each story cites** the journey step or §3 row it serves
  (`JN-04 7`), the capability (`MF-11`), and the acceptance items that
  prove it done (`JN-04 3e`, `approval-engine A15`).
- **No story without a journey step or a spec item behind it,** so nothing
  is built that no one goes through.
- **The form:** "As a *role*, I want *something*, so that *benefit*",
  with its acceptance items; small, independent and testable.

## 2 · Tagging and the coverage matrix

- **Every automated test names what it proves** in its title, in square
  brackets: the acceptance item and the capability.
  `[lender-rules A5][MF-22] a part payment goes to principal first`
  `[JN-02 3a][ID-01] a mismatch is held and never offered the manual route`
- **A script in the code repository**, like tools/check.js here, reads the
  acceptance items from this repository, the tags from the tests and the
  latest CI report, and prints, per capability, each item with a passing
  test, a failing test or none. It fails when an item named in a test does
  not exist here: a renamed item cannot leave a test proving nothing.
- **Built** in a module's §3 changes only when the matrix shows every
  item for that capability passing, and the evidence column cites the
  matrix and the commit.

## 3 · Kinds of test for R1

| Kind | What it covers in R1 | Runs |
|---|---|---|
| Unit | The rules that decide money and rights: the arrears cap, repayment order, APR (docs/specs/lender-rules.md); tier assignment and limits (identity ID-19); approver resolution and no self-approval (docs/specs/approval-engine.md) | Every commit, in seconds |
| Integration | Each service against the real component in a container: Fineract, Keycloak, Odoo, PostgreSQL, the vault's object storage and OpenBao | Every commit |
| Contract | The APIs between the approval engine, Odoo and Fineract, so one side cannot change what the other relies on | Every commit |
| Simulated outside parties | The national register and the verification vendors (identity ID-20); M-Pesa through Safaricom's sandbox | Every commit; the sandbox nightly |
| End to end | The journeys: each step and each §3 row of every R1 journey, against a full staging instance | Nightly, and before every release |
| Security | The penetration test (definition of done, item 2) | Before go-live |
| Recovery | Restore and failover against the recovery objectives (item 6) | Before go-live, then on the schedule in platform-security |

**Test data is synthetic, always.** No real borrower's data enters a test,
a fixture, a sandbox or a demo (FS-058, FS-398). The identity simulator
makes up the people it answers for.

## 4 · User acceptance with the customer

1. **The scripts are the journeys.** For R1, Roan Capital's people run
   each R1 journey, its steps and its §3 rows, in a staging instance with
   synthetic data.
2. **Tracked in Odoo Project,** where the customer's onboarding progress
   is already tracked (docs/onboarding.md): one task per journey row,
   passed or failed, with the date and who ran it. A failure is a ticket
   in the helpdesk, linked to the task.
3. **Sign-off** is the customer's written acceptance against that list:
   item 5 of the definition of done.

## 5 · Who tests

There is no test engineer yet (docs/delivery-plan.md, the team). Each
person writes the tests for what they build, a second person reviews
them with the code, and the definition of done refuses work without
them. The journeys are written here, before the build, so the end-to-end
tests have something to prove from the first sprint.

## 6 · Open

- Rail simulators (rails RL-17) are phase 1 but not in R1; R1 tests
  M-Pesa against Safaricom's sandbox, which cannot produce every outcome
  (a confirmation that never arrives, for one).
- The test framework and CI service are the code repository's choices,
  recorded there.
