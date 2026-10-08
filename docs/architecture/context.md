---
id: architecture-context
name: Architecture context — who and what the platform connects to
kind: architecture
version: 0.1.0
owner: Solution architect
classification: Internal
review_ids: [FS-649, FS-650]
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
  | Airtel, T-Kash     |      |                                    |      | NPDM, BRS, KRA     |
  +--------------------+      | one isolated instance per          |      +--------------------+
                              | institution, in Kenya              |
  +--------------------+      |                                    |      +--------------------+
  | BANKS              |      | collect . gateway . core . mfi     |      | BUREAUX            |
  | pay out, hold      |<---->| sacco . escrow . sme-recon         |<---->| credit records     |
  | [rail]             |money | business suite                     |credit| [external]         |
  | PesaLink, RTGS,    |      |                                    |      | lookups now;       |
  | SWIFT via a bank   |      | shared services, channels          |      | submissions in R5  |
  +--------------------+      |                                    |      +--------------------+
                              |                                    |
  +--------------------+      |                                    |      +--------------------+
  | MOBILE NETWORKS    |      |                                    |      | PROVIDERS          |
  | SMS, SIM checks    |<---->|                                    |<---->| run what we rely on|
  | [operator]         |SMS,  |                                    |host, | [partner]          |
  | Safaricom, Airtel, |SIMs  |                                    |carry | Liquid, Meta,      |
  | Telkom             |      +------------------------------------+      | Twilio, Odoo       |
  +--------------------+                        |                         +--------------------+
                                                |
                                                v
                              +------------------------------------+
                              | THE INSTITUTION                    |
                              | holds licence, money, records      |
                              | [customer]                         |
                              | its core and identity provider,    |
                              | where it has them                  |
                              +------------------------------------+
                                                |
                                                v
                              +------------------------------------+
  the institution files;      | REGULATORS                         |
  we prepare (FC-13)          | license, supervise                 |
                              | [external]                         |
                              | CBK, SASRA, ODPC, FRC (goAML)      |
                              +------------------------------------+
```

| Outside party | What crosses | Direction | Data class leaving | Where |
|---|---|---|---|---|
| The institution's staff and approvers | Sign-in, decisions, back-office work | Both | — | access, mandates |
| Borrowers, guarantors, members | Codes, links, messages, payments | Both | Confidential, to them only | messaging, omni-channel |
| Safaricom M-Pesa, Airtel Money, T-Kash | Payment prompts, confirmations, payouts, status, statements | Both | Confidential | rails RL-03 to RL-05 |
| Mobile network operators: Safaricom, Airtel, Telkom | SMS by direct connection (SMPP); SIM-swap and IMSI checks; the phone number checked against the registered name | Both | Confidential; a phone number to check | messaging MS-02; rails RL-22; identity ID-12, ID-13; compliance LC-03, LC-13 |
| Banks, PesaLink, RTGS, SWIFT through a larger bank | Instructions, status, statements | Both | Confidential | rails RL-06, RL-07, RL-27, RL-28 |
| The institution's core banking system, where it keeps one | Postings and reads, through its API | Both | Confidential | [README](README.md) §4 |
| The institution's identity provider, where it keeps one | Federated sign-in | In | — | access AC-07 |
| NPDM (formerly IPRS), the business registry, KRA | Identity and business checks | Both | Restricted out (an ID number to check) | identity |
| Licensed credit bureaux | Lookups now; submissions from release R5, "the rest of v1" in the delivery plan | Both | Confidential | crb; mfi MF-19 |
| CBK, SASRA, ODPC, FRC (goAML) | Returns and reports, filed by the institution; we prepare | Out, through the institution | Confidential | financial-crime FC-13 |
| Liquid (hosting), the managed security service | Hosting; security telemetry | Both | Internal telemetry | [deployment](deployment.md) |
| Meta (WhatsApp), Twilio (on-call calls), our email relay | Messages and calls | Out | Notifications and links only | messaging; observability |
| Odoo S.A. | Licences | — | None | business-suite |

**The rule at this boundary:** the institution keeps its licence, its
money and its records; Dibon runs the platform. Nothing leaves Kenya
except what is named in the module that sends it, with its data class
([README](README.md) §9).
