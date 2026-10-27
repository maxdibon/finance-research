---
id: runbook-site-failover
name: Site failover — moving an instance from site A to site B
kind: manual
status: draft
law: LR-17
released: unreleased
owner: Solution architect
classification: Internal
review_ids: [FS-1037]
last_reviewed: 2026-10-27
---

# Site failover

The steps for deployment §2's "Recovering from the loss of site A", under
warm standby. Why each is there is in deployment §2.

## 1 · When to use it

Site A is down or unsafe and will not be back within an hour. **Not** for
one server lost (that fails over inside the site, automatically), nor for
a single service down: that is an incident at site A.

## 2 · Before you start

- **A severity 1 incident open,** an incident manager named, the
  institution's incident contact told (incident management §3).
- **The decision recorded with its time:** fail over if site A will not
  be back within an hour. The incident manager decides, with the
  institution's contact.
- **At hand:** bastion access to site B by ticket; GitOps rights to switch
  the active site; site B's OpenBao unseal key (held at site B).
- **Safe mode is on:** payouts paused; collections still land in the
  institution's paybills (SE-24).

## 3 · Steps

| # | Step | Who |
|---|---|---|
| 1 | **Fence site A:** withdraw its traffic at DNS and at the provider's network; stop its workers if they can be reached. Confirm nothing at site A can write | On-call engineer |
| 2 | **Promote the databases at site B,** every cluster; record the last applied point of each: that is the loss window | On-call engineer |
| 3 | **Start OpenBao at site B** against the promoted database, and unseal it ([OpenBao unseal](openbao-unseal.md)) | On-call engineer |
| 4 | **Switch the active site in GitOps:** a fresh event bus first, then the services at full size; the relays refill the bus from the outboxes | On-call engineer |
| 5 | **Leave off** the rails' senders, the end-of-day runner and the event consumers until step 7 is done | On-call engineer |
| 6 | **Switch DNS to site B;** callbacks follow the name | On-call engineer |
| 7 | **Check the loss window:** pull M-Pesa's transactions for it (RL-20), match the banks' statements, check every queued payout against the rail's statement (FS-661); run the day's close if the failover crossed it ([close of business](close-of-business.md)) | On-call engineer; the institution's accountant |
| 8 | **Start the rails' senders, the runner and the consumers** | On-call engineer |
| 9 | **Reopen:** lift safe mode; tell the institution; staff sign in again | Incident manager |
| 10 | **Afterwards:** site A rebuilt from code as the new standby (SE-23); fail back at a planned window by the same steps; the incident's review | Engineering; incident manager |

## 4 · Check it worked

- Smoke tests pass at site B: sign-in, a balance, a draft payout held.
- Every database is the writer at site B and none at site A.
- The outboxes' age falls below 5 minutes; consumers report no gaps.
- Recon shows the loss window matched, or each difference an exception
  with an owner.

## 5 · If it goes wrong

- **Site A cannot be fenced:** do not promote. Two writers are worse than
  an outage; keep safe mode and escalate to the CTIO.
- **A database will not promote:** restore it at site B from its archive
  ([restore from backup](restore-from-backup.md)); the others wait.
- **OpenBao will not unseal:** see [OpenBao unseal](openbao-unseal.md),
  §5.
- **Payouts in the loss window cannot be matched:** they stay held until
  the rail's statement settles each one; none is sent again on a guess.
- **Past 4 hours for tier 1:** the incident manager tells the institution
  and the regulator's clock starts as incident management §3 says.

## 6 · Rehearsals

Once before each deployment's go-live, then twice a year with each
institution (deployment §2).

| Date | Deployment | Who | How long | What we changed |
|---|---|---|---|---|

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
