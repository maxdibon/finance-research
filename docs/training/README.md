---
id: training
name: Training — manuals and sessions, by role
kind: plan
status: living
owner: Solution architect
classification: Internal
review_ids: [FS-660, FS-771]
last_reviewed: 2026-10-15
---

# Training

**What this covers:** who is trained, on what, how and when (FS-660).
Manuals are short, task-based and built from the journeys: each step a
person takes becomes a task card. They say *how* on the screen; the
institution's [handbook](../handbook/README.md) says *what and when*, and
each task card links to the procedure it serves (FS-771). What the design can make obvious needs
no manual (docs/experience.md).

## The manuals

| Who | Manual | Status |
|---|---|---|
| Everyone on the team | [working-in-the-repository.md](working-in-the-repository.md): the team's words, from the desktop app or the command line (FS-847) | Written |
| Recovery key holders | [key-holder.md](key-holder.md): the vault, the unlock, the drills | Written |
| The institution's approvers | Approving at the console and from email, with step-up | After the console is drawn |
| Credit officers | Applications, documents, guarantors, restructuring | After the screens are drawn |
| Accountants | Repayments, exceptions, the night's close and the morning report | After the screens are drawn |
| The institution's administrators | Users, roles by request, blocking and recovery | After the screens are drawn |
| Dibon engineers | Runbooks: incidents, changes, restores, on-call | With each runbook (service management) |
| The service desk | Request types, the access runbooks (FS-505) | With the desk's configuration |

Borrowers, guarantors and members get no manual: their pages, messages
and the voice line explain themselves (docs/experience.md §1).

## How a manual is written

- **One task per page:** what it is for, before you start, the steps,
  what you should see, if it goes wrong.
- **Pictures of the real screen,** and a short video for anything over
  five steps.
- **Plain words,** English first; Swahili where an institution's staff
  prefer it.
- **In the reader, and as a printable page.**
- **Versioned with releases:** release notes name the tasks that changed,
  and their pages change in the same release.

## When

| When | What |
|---|---|
| Before go-live | User acceptance with the institution's people doubles as their training (docs/testing.md §4) |
| Each release | The tasks that changed |
| Twice a year | A session for each institution, as every support tier promises |
| A new joiner | Their role's manual, assigned when they join in Odoo (handbook HB-20) |
| Every quarter | The key holders' restore test, as a drill |

**Measured:** tasks completed unaided after training; questions to the
desk about trained tasks; for key holders, the time from request to an
unsealed vault in each drill.
