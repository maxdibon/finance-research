---
id: mvp-day
name: MVP day — Roan Capital's MVP set up, 30 October 2026
kind: plan
status: living
released: unreleased
owner: Project manager
classification: Internal
review_ids: [FS-925, FS-928, FS-929, FS-930, FS-931, FS-938, FS-950, FS-951, FS-952, FS-953, FS-954, FS-955, FS-956, FS-960, FS-962]
last_reviewed: 2026-10-23
---

# MVP day · Friday 30 October 2026 · 12:00 to 16:00 · in person

**Moved** from Friday 23 October, when it could not be run (FS-962).
The week between is for what can be done before the day: the GitHub
organisation, the Azure subscription and the Odoo Enterprise modules.

**One goal:** Roan Capital's MVP set up on Azure, and one loan walked from
sign-in to repayment, with made-up data, by 15:20 (FS-925, FS-928).

The goals are code/platform/github-project/goals.json, each a register
row and an issue on the GitHub board "MVP" (FS-930); this page copies
them as they stood at the session's end. The one-page brief for the room
is the same plan, laid out for printing.

## The walk-through we finish with

1. **Sign in:** a staff member, through Keycloak, with two-factor:
   Kapu Core and Odoo alike.
2. **Lead:** a made-up lead in Odoo CRM, keyed into Kapu Core as the
   borrower.
3. **Apply:** for Roan Capital's Biashara loan
   ([its product document](products/roan-capital-30-day-loan-v1.md)).
4. **Approve:** by someone else: maker and checker.
5. **Sign:** the agreement and its key facts in Odoo Sign, by borrower
   and guarantor.
6. **Pay out:** by bank; Roan Capital pays by bank only (FS-936).
7. **Repay:** by M-Pesa's sandbox, dated the day paid.
8. **Complaint:** in Odoo Helpdesk, its 30-day clock running.

**Must have:** the cluster, Kapu Core with Biashara configured, staff
sign-in, and Odoo's CRM, Sign and Helpdesk joined in (FS-955). **Stretch:**
the reconciliation view. **Later:** Odoo's books (phase 2).

## The day

| Time | What |
|---|---|
| Before | **Eric and Jimmy only:** the GitHub organisation `dibon-consulting` on Team and its billing; two-factor required; member privileges; this repository moved in; the rules on main; the GitHub Project (FS-953, FS-954). **Jimmy:** the Azure subscription (FS-938). The Odoo Enterprise modules through the partner account |
| 12:00 | Kick-off: the goal, the workstreams, the terms below. **GitHub first:** accounts and two-factor for those without, then invitations, teams and the new address (FS-952). Everyone: `dibon session start` |
| 12:20 | **Checkpoint:** everyone set up (Carol checks the list) |
| 12:20 to 13:10 | Block 1: each person deploys their component in their own resource group |
| 13:10 | **Checkpoint:** is the cluster up? Fineract, Keycloak and Odoo running in sandboxes? Then a stretch |
| 13:15 to 13:45 | Lunch |
| 13:45 to 14:45 | Block 2: build; Biashara configured from its product document |
| 14:45 | **Checkpoint:** into `rg-mvp` through Flux. Then a stretch and a bathroom break |
| 14:55 to 15:35 | Block 3: stitch together; `dibon share`; review each other's work |
| 15:20 | **Checkpoint:** the walk-through, rehearsed |
| 15:35 to 16:00 | Demos, three minutes each; a mock change advisory board on the day's merges (FS-904); a ten-minute retrospective. Everyone: `dibon session end` |

Bathroom any time. Betty runs the checkpoints; Eric settles technical
calls on the spot, and each becomes a register row.

## The critical path

    Azure subscription -> sandbox and cluster -> Flux -> Kapu Core + Biashara -> payout by bank -> WALK-THROUGH
         (Jimmy)              (Allan)             (Max)     (Lillian; FS-934)    + M-Pesa repayment     (15:20)
                                                            Keycloak (Gasine) ->      (Cliff)
                                                              -> Odoo: sign-in, CRM -> Sign, Helpdesk
                                                                   (Gibeon)            (Daniel)

Off the path: test data and the runbook (Abel); templates and marketing
material (Betty, Carol, Chan). Everyone builds in their own resource
group first, then moves into `rg-mvp`.

## Who does what

| Row | Who | Workstream | Goal | Done when | Needs | By | Critical |
|---|---|---|---|---|---|---|---|
| FS-938 | Jimmy | delivery | Azure subscription and budget, ready before noon | The sandbox subscription exists, its spend approved, Eric or Allan signed in as an owner of it | — | before | Yes |
| FS-939 | Allan | platform | The sandbox and the MVP cluster, in OpenTofu | code/platform/azure-sandbox applied (validate, plan read, apply); in rg-mvp, the network and an RKE2 cluster by OpenTofu and cloud-init; torn down and built again once | FS-938 | 13:10 | Yes |
| FS-940 | Max | platform | GitOps: Flux follows the platform repository; the checks run on every pull request | A change merged to platform reaches the cluster untouched; the workflow runs every check but names | FS-939 | 14:45 | Yes |
| FS-941 | Lillian | core | Kapu Core: Fineract with PostgreSQL, Roan Capital's Biashara loan configured from its product document | In her sandbox first, then through Flux into rg-mvp; a test Biashara loan created, approved, disbursed and repaid through Fineract's API | FS-940, FS-934 | 14:45 | Yes |
| FS-942 | Gasine | core | Keycloak: the staff realm, Roan Capital's eight positions as roles, two-factor sign-in | A Loan Officer and a Credit Manager sign in, each seeing only their role's actions; the realm exported to the platform repository | FS-940 | 14:45 | Yes |
| FS-943 | Cliff | money | Money: the payout by bank (Roan Capital pays by bank only), the repayment by M-Pesa's sandbox | An approved loan's bank payout instruction made; a Daraja sandbox repayment posted to the loan, dated the day it was paid | FS-941 | 15:20 | Yes |
| FS-944 | Abel | core | Made-up test data, and the day's runbook | Synthetic borrowers and loans loadable; a runbook anyone can follow tomorrow to the same result | — | 15:20 | — |
| FS-945 | Gibeon | back-office | Roan Capital's Odoo in the walk-through: sign-in, CRM, Documents; as a recipe repeatable per client | Odoo Enterprise in rg-mvp through Flux; staff sign in through Keycloak (OCA's auth_oidc, FS-646); a lead entered in CRM (BS-01) and keyed into Kapu Core as the borrower; Roan Capital's Documents workspace, open only to the project's team (FS-903); the recipe written as a checklist | FS-940, FS-942 | 15:20 | Yes |
| FS-946 | Daniel | back-office | Odoo's Sign, Helpdesk and Employees for Roan Capital | The Biashara agreement and its key facts signed in Sign by a made-up borrower and guarantor (BS-02, JN-05; codes by email today); a complaint in Helpdesk with its 30-day clock; the eight positions in Employees (BS-12). The books (BS-08) stay phase 2 | FS-945 | 15:20 | Yes |
| FS-947 | Betty | delivery | Delivery templates: meeting summary, agenda, Product Understanding Document, follow-up email | Each in the design system's look; the Product Understanding Document trialled on Biashara | — | 15:20 | — |
| FS-948 | Carol | delivery | Admin templates, and everyone set up | NDA intake, a proposal cover letter, the engagement letter's line on contacts' data; every person's handle and GitHub account confirmed by 12:20 | — | 12:20 | — |
| FS-949 | Chan | delivery | Marketing material: product one-pagers and post templates | One-pagers for Collect, SME Recon, Reconciliation and Kapu MFI from the portfolio's copy; three post templates; a case-study template | — | 15:20 | — |
| FS-950 | Eric | platform | The day's authority: decisions, reviews, merges, and a mock change advisory board | Every merge reviewed; every decision a register row; the board run with Allan on the day's merges | — | 15:35 | Yes |
| FS-951 | Lillian | core | The walk-through: sign in, a lead, a borrower, a Biashara loan, approved by another, signed, paid out by bank, repaid by M-Pesa, a complaint | Run end to end in rg-mvp with made-up data, at 15:20, then shown at 15:35 | FS-941, FS-942, FS-943, FS-945, FS-946 | 15:20 | Yes |

## Set up by 12:20

1. A GitHub account with two-factor, then invited to `dibon-consulting`.
2. The repository cloned; Node installed;
   `git config core.hooksPath .githooks`.
3. `git config user.name` set to your team-table name; `dibon role`.
4. `dibon claude` and your handle, if you work with Claude.
5. Signed in to Azure yourself: your `rg-sbx-` group, and your
   workstream's.
6. `dibon session start`, then `dibon join` your row.

## Terms we all use

- **download, new, save, upload, share, join, resume, release:** the
  words ([ways of working](service-management/ways-of-working.md) §7).
- **Planned, Designed, Built, Live:** today moves real capabilities
  towards Built.
- **FS** register rows; **CU** customers; **RC, LF** their requirements;
  **DR** documents.
- A **rule** is ours; a **reg** is the law's (FS-900).
- **MVP**, the pilot and **R1:** Roan Capital's first delivery
  ([delivery plan](delivery-plan.md)).

## What runs where

The components run on the sandbox: Fineract, Keycloak, Odoo and their
databases, each in its owner's group, then in `rg-mvp` through Flux
(code/platform/azure-sandbox, in OpenTofu: FS-932). Not on Azure: GitHub
and its runners; M-Pesa's sandbox, which is Safaricom's; the bank
payout, a stand-in; text-message codes, not connected today; the
templates and material, which live in this repository (FS-956).

## Rules for the day

- **Made-up data only.** Public Azure has no region in Kenya: no real
  customer, borrower or staff data goes in. Production stays in Kenya,
  on Liquid's Azure Stack.
- **No secrets in git, chat or on paper.** Everyone signs in to Azure,
  GitHub and Daraja themselves; only sandbox and test credentials today.
- **Each person's Claude** acts on that person's word, on its own
  branches, and never merges or approves (FS-905). What one Claude
  learns goes into the repository, so the others can read it.
- **At 16:00** the day's sandboxes are torn down; `rg-mvp` stays.
