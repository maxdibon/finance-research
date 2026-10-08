---
id: messaging
name: Messaging
kind: shared-service
version: 0.1.0
owner: Solution architect
classification: Internal
audience: [bank, sacco, mfi, psp, imt, sme, fintech]
depends_on: [access]
consumed_by: [mfi, sacco, gateway, escrow, mandates, recon-observability, sme-recon, collect, core, crb, financial-crime, omni-channel, access, business-suite, identity]
review_ids: [FS-147, FS-148, FS-149, FS-150, FS-152, FS-153, FS-155, FS-156, FS-158, FS-159, FS-160, FS-161, FS-162, FS-163, FS-164, FS-165, FS-166, FS-416, FS-419, FS-487, FS-532, FS-533, FS-648]
last_reviewed: 2026-10-08
---

# Messaging

## 1 · In one paragraph

Messaging will send and receive messages to people on SMS, WhatsApp,
Telegram and our apps, for every Kapu product and for institutions' own
needs. It will have two paths. **Transactional** messages — reminders,
receipts, alerts, approval nudges — will be triggered by product events.
**Campaigns** will be defined in Odoo: audience, template, schedule.
Messaging will deliver both. In Kenya, SMS will go **directly to the
operators** under Dibon's PRSP licence from the Communications Authority
(FS-160); elsewhere, through partners such as Meliora and Africa's
Talking. **Every message's status will say only what its channel
reported** (FS-153). Institutions will reach it by API and by MCP. Dibon
has run bank SMS since 2021, supplying Meliora's Tiara gateway to KCB
and National Bank of Kenya (CU-03, CU-04); this service is Dibon's own,
and is not yet built.

## 2 · Who it is for

**Segments:** every Kapu product, as the platform's messaging service.
Institutions and SMEs directly, for their own transactional messages and
campaigns. Dibon first, through our own Odoo.

**The problem, concretely:** each product would otherwise integrate its own
SMS provider, register its own sender IDs and invent its own delivery
semantics. Campaigns would live in one tool and reminders in another, with
no shared consent record. A message that silently failed would look sent.
Dibon's bank SMS work since 2021 — Meliora's Tiara gateway for KCB and
National Bank of Kenya, transactional and promotional, over SMPP and SDP
(docs/customers.md CU-03, CU-04; partners PT-20) — is where these needs
were learned. It is Meliora's platform, so it is evidence of experience,
not of the rows below.

**People who use it:**

| Role | What they need from it |
|---|---|
| Product (system) | One API: send from a template, get a truthful status, receive replies |
| Marketing or operations, in Odoo | Define campaigns, templates and schedules; see what was delivered |
| Institution developer | API and MCP access for its own messages, under its own sender ID |
| Recipient | Messages on a channel they agreed to, at sensible hours, with an easy way to stop |
| Our operations team | Route health per operator and partner; cost and delivery rates |

## 3 · What it does

**No specification exists.** Sources are the owner's requests (FS-147 to
FS-150, FS-160) and the MFI PRD's SMS requirements (FR-10). Every row is
**Planned**.

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| MS-01 | One messaging API: send from a template, query status, receive inbound messages | Planned | FS-147, FS-149 | 1 |
| MS-02 | SMS in Kenya directly to Safaricom, Airtel and Telkom (SMPP), under Dibon's PRSP licence | Planned | FS-160 | 1 |
| MS-03 | A sender ID per institution, registered with each operator | Planned | MFI PRD §7 | 1 |
| MS-04 | SMS through partners outside Kenya (Meliora, Africa's Talking, others), and as a fallback route in Kenya | Planned | FS-148, FS-160 | 2 |
| MS-05 | Routing and failover across routes, with cost and delivery-report quality tracked per route | Planned | FS-154 (a) | 1 |
| MS-06 | WhatsApp through the WhatsApp Business Platform: Meta-approved templates outside the service window, free-form replies inside it | Planned | FS-147. Route — FS-161. Phase 1 for banking by chat (omni-channel OC-16, FS-487) | 1 |
| MS-07 | Telegram bot, for people who have started a chat with it | Planned | FS-147 | 2 |
| MS-08 | Push notifications to our apps | Planned | FS-147. Depends on omni-channel | 2 |
| MS-09 | A truthful status per message: accepted, handed to the operator or platform, delivered and read only where the channel reports them, failed | Planned | FS-153 | 1 |
| MS-10 | Inbound and two-way: replies, keywords, STOP opt-outs | Planned | FS-155 | 1 |
| MS-11 | Consent per person, per channel and per purpose (transactional or marketing), held in Odoo | Planned | FS-155 | 1 |
| MS-12 | Transactional path: product events become messages from templates, on the channels the person chose, one or more for each kind of message (transactions, statements and notices, marketing), set at onboarding (SMS by default), by self-service or by staff on request, every change logged. Three things override the choice: security alerts go to every channel the person has; regulatory notices (receipts, guarantors' statements, the 14-day notice, collection notices) always include a channel with delivery reports, SMS at the least; marketing needs its own opt-in (MS-11). WhatsApp needs explicit consent and email a verified address; the institution decides which channels it offers | Planned | MFI PRD FR-10; FS-155; owner, 2026-10-06 (FS-533) | 1 |
| MS-13 | Campaign path: Odoo defines the audience, template and schedule; messaging delivers and writes the status back to Odoo | Planned | FS-150 | 2 |
| MS-14 | Templates with merge fields; SMS length counted in the right alphabet (160 characters in GSM-7, 70 otherwise) | Planned | GateKeepr STANDARDS.md §3 (SMS is GSM 03.38) | 1 |
| MS-15 | Quiet hours and rate limits per recipient | Planned | FS-162 | 1 |
| MS-16 | When an important message cannot be delivered, try the next permitted channel, then tell the sender. Never assume it arrived | Planned | GateKeepr STANDARDS.md §6.3 rule 4 | 2 |
| MS-17 | API and MCP access for institutions: send, templates, status; campaigns only as drafts for a person to approve | Planned | FS-149, FS-156, FS-159 | 2 |
| MS-18 | Delivery and cost reporting per institution | Planned | FS-147 | 2 |
| MS-19 | Email through our own relay, with SPF, DKIM and DMARC on each institution's domain; notifications and links only (architecture §7) | Planned | Owner, 2026-10-06 (FS-533). Approval emails (mandates MD-18) and upload links (identity ID-15) need it in R1 | 1 |

**Excluded:** Signal. It has no business messaging API, and unofficial
clients break its terms (FS-152).

## 4 · Where it sits

**Depends on:** access (institutions' API and MCP clients).
**Used by:** mfi (reminders), sacco, gateway (payment links), escrow (state
changes), mandates (approval nudges, pre-debit notices),
recon-observability (alerts to people), sme-recon, collect, core, crb,
financial-crime, omni-channel, access (one-time codes) and
business-suite (campaigns).
**Not covered here:** machine-to-machine callbacks to partners and
merchants. Those belong to each product's API (collect, gateway). Also identity.

**Who holds which record** (docs/architecture/README.md §2):

| Record | System of record | This module |
|---|---|---|
| People, their channels and their consent | Odoo | References by id |
| Campaigns, campaign templates, audiences, schedules | Odoo | Executes |
| Transactional templates | Messaging | Holds, versioned |
| Every message and its status events | **Messaging** | Holds. Append-only, high volume |
| Opt-outs received by reply (STOP) | Odoo, once written | **Writes to Odoo, and keeps a suppression list that may only be stricter than Odoo** — FS-163 |
| Operator binds, partner credentials, sender IDs | Messaging | Holds. Credentials Restricted |

**What this module never stores:** message bodies beyond their retention
period (FS-063), or a person's contact details other than the address a
message went to.

**Under each ledger mode:** messaging does not touch the funds ledger. The
two modes do not change it.

## 5 · How it works

```
  PRODUCT EVENTS (Kafka)              ODOO
  reminder due, payment received,     campaigns, audiences, templates,
  approval waiting, break raised      schedules, consent
          |                               |
          v                               v
  +-----------------------------------------------------+
  |  MESSAGING                                          |
  |  template + merge  -->  consent and quiet-hours     |
  |  check  -->  channel choice  -->  route choice      |
  +-----------------------------------------------------+
     |            |              |              |
     v            v              v              v
  SMS, KE      SMS, other     WhatsApp       Telegram / app push
  Safaricom    countries      Business       bot / FCM, APNs
  Airtel       partners       Platform
  Telkom       (Meliora,
  (SMPP)       Africa's
               Talking ...)
     |            |              |              |
     +------------+--------------+--------------+
                       |
          status events, inbound replies, STOP
                       |
                       v
     message log (append-only)  -->  status to the product or to Odoo
                                -->  opt-outs written to Odoo
```

**What "delivered" means differs by channel**, and the status never says
more than the channel did:

| Channel | Reports back |
|---|---|
| SMS, direct to operator | Handed to the operator; a delivery report, whose reliability varies by operator |
| SMS, through a partner | Whatever the partner passes on, which may be less than the operator gave |
| WhatsApp | Sent, delivered, read (read only if the recipient allows it) |
| Telegram bot | Sent. No delivery or read receipt |
| App push | Accepted by the push service. Display is not confirmed |

## 6 · Rails and integrations

| Rail / system | Direction | Feed | Status |
|---|---|---|---|
| Safaricom, Airtel, Telkom — SMS (KE) | out / in | SMPP; delivery reports | Planned (MS-02) |
| SMS partners — Meliora, Africa's Talking, others | out / in | HTTP API; delivery callbacks | Planned (MS-04) |
| WhatsApp Business Platform | out / in | API; webhooks | Planned (MS-06) — FS-161 |
| Telegram Bot API | out / in | API; webhooks | Planned (MS-07) |
| Firebase Cloud Messaging, Apple Push | out | API | Planned (MS-08) |
| Odoo — consent, campaigns, templates, status | in / out | API; MCP for drafts | Planned (MS-11, MS-13, MS-17) |
| Kafka — product events | in | events | Planned (MS-12) |

## 7 · Regulatory position

- **Custody:** none. No money moves.
- **Licence relied on:** in Kenya, Dibon's PRSP licence from the
  Communications Authority, for direct operator connections. Whether it
  covers application-to-person bulk SMS, sender IDs and two-way messaging
  needs confirming against the licence itself — FS-160. Outside Kenya, the
  partner's licence.
- **Consent and marketing:** marketing needs the recipient's consent and a
  working opt-out, under the Data Protection Act and the Communications
  Authority's consumer rules — FS-164. Transactional messages do not need
  marketing consent, but must stay transactional.
- **Platform rules:** WhatsApp's business policies restrict some financial
  services. Whether digital lenders' messages are allowed needs checking —
  FS-165.
- **Data leaving the boundary:** WhatsApp, Telegram and app push are
  hosted by their platforms abroad. Only direct SMS stays inside our and
  the operators' systems. The channel choice is also a data choice —
  FS-166.
- **Data:** phone numbers and message content are Confidential. Messages
  about money must not carry Restricted data, such as government ID
  numbers or full account numbers.

## 8 · Controls

- **Never claim delivery** beyond what the channel reported (MS-09).
- **Fewer messages, each load-bearing.** A message exists to let somebody
  act, or to discharge somebody's burden. One that does neither is noise
  (GateKeepr STANDARDS.md §6.3.1).
- **State changes are pushed; details are pulled.** "Your repayment was
  received" goes out; the amount and balance sit behind the
  recipient's login, where possible (§6.3).
- **Campaigns are drafted by AI or people and sent by people.** Over MCP,
  a campaign can only be created as a draft (MS-17).
- **Opt-outs win.** A STOP takes effect immediately, even if Odoo is
  unreachable (FS-163).
- **Safety alerts skip approval** (mandates.md §8).

## 9 · Deployment

Part of the shared platform, on Liquid's Azure Stack (FS-032). SMPP
connections to the Kenyan operators come from our in-country deployment.
Each other country uses its partners until volume justifies direct
connections and the licence that requires.

## 10 · What it does not do

- Deliver machine-to-machine callbacks. Those belong to the product APIs.
- Signal (FS-152).
- Email. Odoo already sends it; whether messaging should route email too
  is not decided.
- Decide what to say. Products and campaigns own content; messaging owns
  delivery and the truth about it.

## 11 · Open questions

FS-156, FS-161, FS-162, FS-163, FS-164, FS-165. How the service is built,
the R1 template catalogue and who owns the words: docs/specs/messaging.md
(FS-648).

## 12 · Sources

- REVIEW.md FS-147 to FS-160 (the owner's requests, and the responses).
- Kapu Pay MFI PRD section, Draft v0.2, Jun 2026 — FR-10, §7 (SMS).
- Odoo 20.0 documentation — AI MCP server.
- GateKeepr STANDARDS.md §3 (GSM 03.38), §6, §6.3, §6.3.1 — principles
  carried over, not references.
