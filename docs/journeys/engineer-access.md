---
id: jn-20-engineer-access
name: JN-20 · One of Dibon's engineers joins, moves and leaves
kind: journey
release: R1
status: draft
released: 2026.10.15
validated_with: not yet
owner: Solution architect
classification: Internal
review_ids: [FS-503, FS-548, FS-645, FS-668, FS-769, FS-776, FS-777, FS-896]
last_reviewed: 2026-10-22
---

# JN-20 · One of Dibon's engineers joins, moves and leaves

An engineer joins Dibon, later joins the on-call rota and becomes a
recovery key holder, and one day leaves. Engineers run the platform for
every institution, so this is where Dibon's own access is decided: one
identity per engineer, in Dibon's central Keycloak, with hardware security
keys only, brokered into each instance and never copied there; no
standing access to any institution's data, only access against a ticket,
scoped and expiring; never a product role, and never an institution's
money (architecture §9, SE-26). When an engineer leaves, one switch ends
their access everywhere.

An institution's own staff follow JN-18.

## 1 · Who and where

- **Who:** the engineer; the team lead, who records the joiner or leaver;
  the engineering lead, who asks for their access; the security lead, who
  approves it, registers their keys and runs any ceremony; the operations
  lead, for the on-call rota; for an institution that runs its own
  operations, its named approver for each grant.
- **Channel:** Dibon's Odoo for the employee record; Dibon's central
  Keycloak; GitHub; the bastion; the on-call tool; the security lead in
  person for keys and devices.
- **Starts when:** the team lead records a joiner, a move or an exit in
  Dibon's Odoo.
- **Ends when:** the engineer holds exactly the access their role needs,
  or, for a leaver, none, with their keys, devices and any key share
  recovered, and every grant in the access register.
- **Target:** a joiner able to work on their first day; a leaver's access
  ended everywhere within the hour of the exit being recorded, the same
  day at the latest (rules for Dibon 5); a key share re-split within a
  week (owner, FS-777).
- **Moments that matter:** the first day, with keys, a laptop and the
  training done before any production access; the first ticket that
  needs an institution's data, where the engineer learns that access is
  asked for, scoped and recorded every time; the exit, when every
  institution must be certain the leaver can reach nothing.
- **Data:** the engineer's name, work email and phone, groups, keys and
  devices, and every grant and session (privacy PR-20, PR-12, PR-13).

## 2 · Steps

```
  Joins
  1 Recorded in Dibon's Odoo; contract, confidentiality and checks first
        v
  2 A central identity with no access; two hardware keys registered
        |-- a key lost later ........................ revoked; the backup works (3b)
        v
  3 A laptop enrolled before first use
        v
  4 Groups by role, approved by the security lead; training done
        v
  5 The first access to production: against a ticket, scoped, expiring
        |-- an institution that runs its own ........ its approver grants (3c)
        |-- an incident at night .................... its own ticket; break-glass rarely (3e)
  Moves
  6 New groups approved, old removed the same day
        v
  7 A recovery key holder: the ceremony, then the drills
  Leaves
  8 The exit recorded: the central identity disabled, every instance at once
        |-- a hostile exit .......................... disabled at once, sessions reviewed (3a)
        |-- the last of a critical role ............. the deputy steps in (3d)
        v
  9 Keys, tokens and SSH keys revoked; secrets they could read rotated
        v
 10 A key share or break-glass half re-split
        v
 11 Devices wiped and returned
        v
 12 Recorded; compared with each institution's records that month
        :
    A grant on one side only ...................... an incident (3f)
    A contractor .................................. ends on its date (3g)
    Stops partway ................................. no access until done (3h)
```

| # | Step | Who | Messages | Capabilities |
|---|---|---|---|---|
| 1 | The team lead records the joiner in Dibon's Odoo: role, manager, start date. Before any access: the contract with its confidentiality clause, and the checks Dibon's staff security policy sets | Team lead | — | BS-12 |
| 2 | From that record, the joiner's identity is created in Dibon's central Keycloak with no access. In person, the security lead registers two hardware security keys, one carried and one kept apart as the backup | Security lead | — | SE-26 |
| 3 | Their laptop is enrolled before first use: disk encryption, endpoint protection, device management. No institution's data ever lives on it (endpoints §2) | Security lead | — | SE-14 |
| 4 | The engineering lead asks for the groups their role needs (GitHub teams by role, the `ops` realms' tooling, OpenBao's policies) by a pull request to Dibon's group memberships, kept as code; the security lead approves it as code owner, never the person asking; the pipeline applies it. Security and privacy training, and the ways of working, are done before any production access. The engineer is told by email what changed | Engineering lead; security lead | T42 | SE-26, AC-11 |
| 5 | Their first access to an institution's data or production is just in time: a ticket, a named scope (read-only logs, one maintenance action), 4 hours by default, through the bastion, the session recorded. They never see Restricted data, and never hold a product role | Engineer; operations lead | — | SE-26, SE-18, SE-27 |
| 6 | **A move** (into the on-call rota after shadowing, or into the security lead's role): the new groups approved as in step 4, the old removed by the same approval on the day, never accumulated | Engineering lead; security lead | T42 | SE-26 |
| 7 | **Becoming a recovery key holder:** the setup ceremony, with the CTIO and two witnesses; the share encrypted to their keys; then the quarterly drills (the key holder's manual) | Security lead; CTIO | — | SE-21 |
| 8 | **An exit:** the team lead records it in Dibon's Odoo the day it happens, or ahead with its date. From that record the central identity is disabled and signed out everywhere, which ends their access to every instance, the on-call tool and OpenBao at once; GitHub, until single sign-on, by the security lead removing them from the organisation the same day | Team lead; security lead | T42 | SE-26, AC-10 |
| 9 | Their hardware keys are revoked and returned; any personal access token and SSH key removed; their open pull requests reassigned; any secret they could read in production rotated | Security lead; engineering lead | — | SE-26, SE-12 |
| 10 | If they held a recovery key share or half of a break-glass account, a new holder is chosen and the share re-split in a new ceremony; the old share becomes useless | Security lead; CTIO | — | SE-21, SE-26 |
| 11 | Their laptop and any phone with work access are wiped and returned, as the lost-laptop runbook's last two steps (endpoints §5) | Security lead | — | SE-14 |
| 12 | Every grant and exit is in Dibon's access register; each month it is compared with every institution's own records, and the leaver shows no access anywhere | Security lead | — | SE-26, AC-11 |

## 3 · When it goes wrong

| # | At step | What happens | Capabilities |
|---|---|---|---|
| a | 8 | **A hostile exit.** The security lead or the team lead disables the central identity at once, at any hour; every session ends; the leaver's recent sessions and grants are reviewed from the recordings; secrets they could read are rotated that day; each institution where they held a grant is told | SE-26, AC-10, SE-18 |
| b | 2 | **A hardware key is lost.** It is revoked at once; the backup key keeps the engineer working; a new one is registered in person with the security lead | SE-26 |
| c | 5 | **The institution runs its own operations.** The broker is off: the engineer reaches its instance only when its named approver grants the ticket's access through its own approval chain, through its own VPN or bastion; it can switch Dibon off at any time | SE-26 |
| d | 8 | **The leaver was the last of a critical role,** or the rota or key holders fall below what is needed: the deputy named in business continuity steps in; a new holder is trained and appointed before the gap matters | SE-21 |
| e | 5 | **An incident at night needs access.** The incident's ticket is the ticket: a grant scoped to the incident, recorded like any other. Break-glass accounts are opened only if sign-in itself is down, by two people, every use alerted and reviewed | SE-26, AC-11 |
| f | 12 | **A grant on one side only:** in Dibon's register but not in the institution's records, or the reverse. It is an incident, investigated by the security lead | SE-26 |
| g | 1 | **A contractor.** The same path, with an end date recorded at joining; access ends on that date unless renewed through step 4 | SE-26, BS-12 |
| h | 2 to 4, 9 to 11 | **Stops partway.** A joiner whose keys, laptop or training are not ready has no production access until they are. A leaver whose keys or devices are not yet returned, or whose share is not yet re-split, stays on the security lead's list, escalated to the team lead after a week | SE-26 |

## 4 · Gaps

| Gap | Release or phase today | In its absence | Proposed |
|---|---|---|---|
| Dibon's staff security policy: screening and confidentiality (step 1) | Missing (FS-748) | The contract's confidentiality clause | Write it with the policy register |

## 5 · Open questions

- **For the security lead:** which secrets count as "could read" for a
  leaver, so their rotation is a list, not a judgement.
