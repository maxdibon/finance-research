---
id: architecture-context
name: Architecture context — who and what the platform connects to
kind: architecture
status: draft
released: 2026.10.15
owner: Solution architect
classification: Internal
review_ids: [FS-649, FS-650, FS-1053, FS-1187, FS-1188]
last_reviewed: 2026-11-11
---

# Context: who and what the platform connects to

The platform from the outside: the people who use it, the institutions it
serves, and every outside system it exchanges data with (FS-649). Read
with [the README](README.md) §2 (who holds which record) and §3 (where
the licence line is).

```
  institutions' staff and approvers . borrowers . guarantors . members . businesses' and
  partners' people . Dibon engineers
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
  | BANKS              |      | the lending and deposits services, |      | BUREAUX            |
  | pay out, hold      |<---->| the ledger, the back office (Odoo) |<---->| credit records     |
  | [rail]             |money | behind its gateway, the Kapu       |credit| [external]         |
  | PesaLink, RTGS,    |      | Console; collect . gateway . core  |      | lookups now;       |
  | SWIFT via a bank   |      | mfi . sacco . escrow . sme-recon . |      | submissions in R5  |
  +--------------------+      | treasury                           |      +--------------------+
                              | shared services, channels: the     |
  +--------------------+      | customer app, internet banking,    |      +--------------------+
  | MOBILE NETWORKS    |      | USSD, WhatsApp, the partner portal |      | PROVIDERS          |
  | SMS, SIM checks    |<---->|                                    |<---->| run what we rely on|
  | [operator]         |SMS,  |                                    |host, | [partner]          |
  | Safaricom, Airtel, |SIMs  |                                    |carry | Liquid, Meta,      |
  | Telkom             |      |                                    |      | Twilio, Odoo, OLP  |
  +--------------------+      |                                    |      +--------------------+
                              |                                    |
  +--------------------+      |                                    |      +--------------------+
  | PARTNERS           |      |                                    |      | CARDS, BOOKS, FUNDS|
  | distributors,      |<---->|                                    |<---->| sponsor bank and   |
  | dealers, schools;  |data, |                                    |cards,| issuer processor   |
  | operators, for     |pay-  |                                    |books | (later); a busi-   |
  | wallets [partner]  |outs  |                                    |funds,| ness's own Zoho or |
  +--------------------+      +------------------------------------+      | QuickBooks         |
                                                |                         | and its banks; a   |
                                                v                         | fund's system, its |
                              +------------------------------------+      | custodian; rates   |
                              | THE INSTITUTION                    |      +--------------------+
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
                              | CBK, SASRA, CMA, RBA, IRA, ODPC,   |
                              | FRC (goAML)                        |
                              +------------------------------------+
```

| Outside party | What crosses | Direction | Data class leaving | Where |
|---|---|---|---|---|
| The institution's staff and approvers | Sign-in, decisions, back-office work | Both | — | access, mandates |
| Borrowers, guarantors, members | Codes, links, messages, payments | Both | Confidential, to them only | messaging, omni-channel |
| Safaricom M-Pesa, Airtel Money, T-Kash | Payment prompts, confirmations, payouts, status, statements | Both | Confidential | rails RL-03 to RL-05 |
| Mobile network operators: Safaricom, Airtel, Telkom | SMS by direct connection (SMPP); SIM-swap and IMSI checks; the phone number checked against the registered name; whether a number is on its network now, before a payout (FS-1144) | Both | Confidential; a phone number to check | messaging MS-02; rails RL-22; identity ID-12, ID-13; compliance LC-03, LC-13 |
| Banks, PesaLink, RTGS, SWIFT through a larger bank | Instructions, status, statements | Both | Confidential | rails RL-06, RL-07, RL-27, RL-28 |
| The institution's core banking system, where it keeps one | Postings and reads, through its API | Both | Confidential | [README](README.md) §4 |
| The institution's identity provider, where it keeps one | Federated sign-in | In | — | access AC-07 |
| NPDM (formerly IPRS), the business registry, KRA | Identity and business checks | Both | Restricted out (an ID number to check) | identity |
| Licensed credit bureaux | Lookups now; submissions from release R5, "the rest of v1" in the delivery plan | Both | Confidential | crb; mfi MF-19 |
| CBK, SASRA, the CMA, the RBA, the IRA, ODPC, FRC (goAML) | Returns and reports, filed by the institution; we prepare, from treasury's rulebooks where they are prudential | Out, through the institution | Confidential | financial-crime FC-13; treasury TR-16 |
| A fund's system and its custodian (a fund manager's, such as UnitMaster) | Units and prices at the dealing cut-off; the custodian's holdings and cash | In | — | treasury TR-33, TR-34 |
| Rate sources: the institution's banks, the Central Bank's indicative rates | Exchange rates, with their source and time | In | — | treasury TR-09 |
| A business's own banks (Kapu Business) | Its balances and statements, with its consent; its payments, on its approval | Both | Confidential | treasury TR-36, TR-37; LQ-42 |
| The Communications Authority | Its numbering plan: which network each code was assigned to, read at each release | In | — | transaction-fields §3 |
| Liquid (hosting), the managed security service | Hosting; security telemetry | Both | Internal telemetry | [deployment](deployment.md) |
| Meta (WhatsApp), Twilio (on-call calls), our email relay | Messages and calls | Out | Notifications and links only | messaging; observability |
| Odoo S.A. | Licences | — | None | business-suite |
| Partners: distributors, dealers, schools; mobile operators, for wallet products | A borrower's data from the partner, with the borrower's consent, for each partner apart; payouts to the partner for goods; signed events to its system | Both | Confidential: only what the partner's agreement and the consent allow | lending-service §5; mfi MF-40 to MF-42; privacy PR-21 |
| A sponsor bank and an issuer processor, later | Card authorisations, asked of us in real time, and the scheme's settlement files; card numbers stay with the processor | Both | Confidential; never a card number | omni-channel OC-25 |
| A business's own books: Zoho Books, QuickBooks Online | Its matched bank and mobile-money transactions, on its instruction | Out | Confidential; outside Kenya, as the business chose (LQ-29) | sme-recon SR-13, SR-15 |

**The rule at this boundary:** the institution keeps its licence, its
money and its records; Dibon runs the platform. Nothing leaves Kenya
except what is named in the module that sends it, with its data class
([README](README.md) §9).
