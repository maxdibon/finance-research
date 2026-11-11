---
id: architecture-quality
name: Architecture — quality goals
kind: architecture
status: draft
released: 2026.10.15
owner: Solution architect
classification: Internal
review_ids: [FS-466, FS-588, FS-649, FS-653, FS-655, FS-660, FS-792, FS-1187]
last_reviewed: 2026-11-11
---

# Quality goals

What the architecture must achieve, measurably, and where each goal is
met (FS-649). A goal without a measure is a wish; each row says how it is
checked.

| Goal | Target | Where it is met | How it is measured |
|---|---|---|---|
| Availability | 99.9% a month for tier-1 services (Roan Capital, RC-35) | Replicas, a synchronous standby, rolling upgrades | Grafana SLOs (RO-17) |
| Recovery | For warm standby (the default; other models in [deployment](deployment.md) §2). Tier 1: no loss on a server's failure, at most 5 minutes on a site's; back in minutes for a server, automatically, or 4 hours for a site. Tier 2: 1 hour and 8. Tier 3: 24 and 72 | platform-security §3; SE-10, SE-20 to SE-25; [deployment](deployment.md) | A restore test each quarter; a ransomware drill twice a year |
| Money moves only as approved | No payout whose content differs from what was approved; no ledger change without an approved request | Content hash (rails RL-01, rails rule 3); one writer per kind of account, enforced by the core adapter (FS-1184); FS-588 | Nightly comparisons (approval-engine §9, access-keycloak §6); none unexplained |
| Every payment accounted for | Each rail event matched, in transit with a clear-by day, or in the exception queue; never silently dropped | RO-02, RO-04, RO-07 | Match rate and exception age (RO-17) |
| The night closes | By 03:00, or someone is phoned | [end-of-day-runner](../specs/end-of-day-runner.md) | Its own metrics and heartbeat |
| A repayment reaches the ledger | Within minutes of the rail's confirmation (5 minutes proposed) | [runtime](runtime.md) §2 | Time from rail event to posting, per payment |
| Callbacks answered | Within each rail's own timeout, set per rail at onboarding | rails | Callback latency per rail; the alert rules in observability-grafana §4 (FS-653) |
| Who acted is proven | Every act that moves money, approves or reveals a person re-authenticated at the act | AC-05, MD-10 | Every decision carries its step-up record |
| Evidence holds | Every state change a signed, hash-chained event | RO-23 to RO-25 | Chain verification |
| Data stays in Kenya | Except flows named in the module that sends them | [README](README.md) §9; [context](context.md) | The flows listed against the egress rules |
| Restricted data protected | Never in a log; encrypted field by field | SE-18, SE-27 | A test alert with an ID number is caught (observability G8) |
| Replaceable parts | Each component behind a versioned contract; upgrades without consumers changing | FS-584; [interfaces](interfaces.md) | A change tried in shadow before it takes over |
| Scale | Per instance: 25 million accounts; 10 million transactions a day, 2,000 a second at peak; the shadow ledger within 5 seconds of the master; the companion's close of every account within 2 hours (FS-791, FS-792) | [recon](../specs/recon.md) §12: Valkey for the shadow, partitioned stores, the close in parallel, files streamed, signing with short-lived keys | A load test before the claim (recon A9) |
| Ledgers agree | The master, the shadow and the companion agree on every account: the shadow at every checkpoint, the companion at every close; a balance grown without money behind it is a severity 1 | [recon](../specs/recon.md) §3 | Disagreements counted and alerted; none unexplained |
| Money held for others is whole | Each book held for others (customers' money in trust, a fund, a vostro) proved whole each day | Treasury TR-13; README §7 | The day's proof, by book; any difference a severity 2 |
| A float never runs out unseen | No payout fails for want of float without a level crossed first | Rails rule 14; treasury TR-02 | Each level's alert before the floor; payouts failed for float, by account |
| Every money event is one shape | No money event published that fails its schema | Transactions rules 1 and 10; the producer's check | Schema failures, per producer: none |
| Unknown is settled | Every unknown payment settled by a status query, Pull Transactions or the statement within its rail's window | Rails rule 5; RL-10, RL-20 | Unknowns older than their window: none |
| Peak days carried | A peak day carried at its expected multiple of the usual, with the margin load-tested before it | Rails rule 15; runbooks, peak and slow days | The load test before each peak; the day's rates against its multiple |
| Delightful to use | Nine in ten people complete each core task unaided on first try (proposed) | [Experience](../company/experience.md) | Usability tests and task measures |
| Nothing needs reading | Anything a person must confirm or be told, also by voice or as numbers | omni-channel; FS-637 | Each channel checked as it is drawn |
