---
id: architecture-context
name: Architecture — context: who and what the platform connects to
kind: architecture
version: 0.1.0
owner: Solution architect
classification: Internal
review_ids: [FS-649]
last_reviewed: 2026-10-08
---

# Context: who and what the platform connects to

The platform from the outside: the people who use it, the institutions it
serves, and every outside system it exchanges data with (FS-649). Read
with [the README](README.md) §2 (who holds which record) and §3 (where
the licence line is).

```
  institutions' staff and approvers . borrowers . guarantors . members . Dibon engineers
                                                |
                                                v
  +--------------------+      +------------------------------------+      +--------------------+
  | M-PESA             |      | DIBON PLATFORM                     |      | REGISTERS          |
  | mobile money       |<---->| takes in, lends, holds, proves     |<---->| say who is who     |
  | [rail]             |money | [kapu_service]                     |checks| [external]         |
  | Airtel, T-Kash     |      | one isolated instance per          |      | NPDM, BRS, KRA     |
  +--------------------+      | institution, in Kenya              |      +--------------------+
                              +------------------------------------+
  +--------------------+                        |                         +--------------------+
  | BANKS              |                        |                         | BUREAUX            |
  | pay out, hold      |<---->                  v                   <---->| credit records     |
  | [rail]             |money +------------------------------------+R5    | [external]         |
  | PesaLink, RTGS,    |      | THE INSTITUTION                    |      | licensed CRBs      |
  | SWIFT via a bank   |      | holds licence, money, records      |      +--------------------+
  +--------------------+      | [customer]                         |
                              | its core and identity provider,    |
                              | where it has them                  |
                              +------------------------------------+
                                                |
                                                |
                                                v
                              +------------------------------------+      +--------------------+
  the institution files;      | REGULATORS                         |      | PROVIDERS          |
  we prepare (FC-13)          | license, supervise                 |      | run what we rely on|
                              | [external]                         |      | [partner]          |
                              | CBK, SASRA, ODPC, FRC (goAML)      |      | Liquid, operators, |
                              +------------------------------------+      | Meta, Twilio, Odoo |
                                                                          +--------------------+
```

| Outside party | What crosses | Direction | Data class leaving | Where |
|---|---|---|---|---|
| The institution's staff and approvers | Sign-in, decisions, back-office work | Both | — | access, mandates |
| Borrowers, guarantors, members | Codes, links, messages, payments | Both | Confidential, to them only | messaging, omni-channel |
| Safaricom M-Pesa, Airtel Money, T-Kash | Payment prompts, confirmations, payouts, status, statements | Both | Confidential | rails RL-03 to RL-05 |
| Banks, PesaLink, RTGS, SWIFT through a larger bank | Instructions, status, statements | Both | Confidential | rails RL-06, RL-07, RL-27, RL-28 |
| The institution's core banking system, where it keeps one | Postings and reads, through its API | Both | Confidential | [README](README.md) §4 |
| The institution's identity provider, where it keeps one | Federated sign-in | In | — | access AC-07 |
| NPDM (formerly IPRS), the business registry, KRA | Identity and business checks | Both | Restricted out (an ID number to check) | identity |
| Licensed credit bureaux | Lookups now; submissions in R5 | Both | Confidential | crb |
| CBK, SASRA, ODPC, FRC (goAML) | Returns and reports, filed by the institution; we prepare | Out, through the institution | Confidential | financial-crime FC-13 |
| Liquid (hosting), the managed security service | Hosting; security telemetry | Both | Internal telemetry | [deployment](deployment.md) |
| Mobile operators (SMPP), Meta (WhatsApp), Twilio (on-call calls), our email relay | Messages and calls | Out | Notifications and links only | messaging; observability |
| Odoo S.A. | Licences | — | None | business-suite |

**The rule at this boundary:** the institution keeps its licence, its
money and its records; Dibon runs the platform. Nothing leaves Kenya
except what is named in the module that sends it, with its data class
([README](README.md) §9).
