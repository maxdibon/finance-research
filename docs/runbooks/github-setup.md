---
id: runbook-github-setup
name: Setting up GitHub — the organisation, once
kind: manual
status: draft
law: LR-17
released: unreleased
owner: Solution architect
classification: Internal
review_ids: [FS-895, FS-896, FS-954, FS-1058]
last_reviewed: 2026-10-30
---

# Setting up GitHub

The steps for [GitHub](../specs/github.md)'s settings (§4), done once,
in order: this repository first, then the code (FS-895, FS-896). It was
github §5 (FS-1058).

## 1 · When to use it

Once, to create Dibon's organisation and move this repository into it.
**Not** for a joiner or a leaver, which github §11 covers.

## 2 · Before you start

- The team lead and the CEO, the organisation's two owners, available
  together for steps 2 to 5 and 7, which are theirs alone, before anyone
  else is invited (FS-954).
- Every person with a work email and, where they have one, a security
  key.

## 3 · Steps

| # | Step | Who |
|---|---|---|
| 1 | **Create your own GitHub account** with your work email and turn on two-factor authentication, by security key where you have one | Each person, themselves |
| 2 | **Create the organisation** on the Team plan; the team lead is its first owner, the CEO the second. The GitHub Project is made in the organisation, not under a person's own account | The team lead |
| 3 | **Require two-factor authentication** for every member; invite members only once theirs is on, since GitHub removes members without it | The team lead |
| 4 | **Set member privileges:** base permission none; members cannot create public repositories or fork private ones; only owners invite | The team lead |
| 5 | **Transfer this repository** into the organisation (its settings, Transfer): its history, each commit's author (FS-886, FS-905), its issues and old links carried over; it stays private | The team lead |
| 6 | **Create the teams** (github §4.1) and add each person to theirs from the team table in ways-of-working §1 | The team lead, with everyone |
| 7 | **Set the rulesets** before anyone else pushes: main (github §4.2), tags, push (§4.3), branch names | The team lead |
| 8 | **Turn on Dependabot alerts** | The team lead |
| 9 | **Add `CODEOWNERS`, the pull request and issue templates, and the workflow** (github §4.4), by pull request | The engineering lead |
| 10 | **Change your clone's address** to the organisation's: `git remote set-url origin https://github.com/dibon-consulting/finance.git` | Each person |
| 11 | **Update the words** (tools/dibon.js): the single-owner exception ends, and each person uploads and shares their own branches | The team lead |
| 12 | **Set your Claude** once with `dibon claude` (FS-905) | Each person |

## 4 · Check it worked

- Every member has two-factor authentication on; no one outside the
  organisation has access to this repository.
- A direct push to main is refused; a pull request needs its approvals
  and passes the workflow.
- Each clone pulls from the organisation's address.

## 5 · If it goes wrong

- **A member is removed for lacking two-factor:** they turn it on and are
  invited again; nothing of theirs is lost.
- **The transfer fails or loses links:** stop before step 6; the
  repository stays under its owner's account until it is put right.

## 6 · Rehearsals

Done once; there is nothing to rehearse.

| Date | Deployment | Who | How long | What we changed |
|---|---|---|---|---|

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
