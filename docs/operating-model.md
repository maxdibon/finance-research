---
id: operating-model
name: Operating model — the people who keep the commitments
kind: plan
status: living
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-467, FS-470, FS-471, FS-472, FS-473, FS-474, FS-475, FS-476, FS-477, FS-505, FS-532, FS-686, FS-711]
last_reviewed: 2026-10-12
---

# Operating model — the people who keep the commitments

**What this is:** who keeps our service and security commitments, who we
have today, and whom we hire as customers sign (FS-467, FS-472). Roles
only; names stay out of this repository. People who build the products
are counted separately.

**What sets the size:** a round-the-clock rota, more than the number of
customers. One person on call needs at least five in the rota to be
sustainable. That is why the commitments start at 4 hours (FS-471) and
move to 1 hour as the rota grows (platform-security §3).

## Today (2026-10-05)

| Role | People | Notes |
|---|---|---|
| DevSecOps | 3, a fourth being hired (FS-474); one of the three also builds (FS-477) | The on-call rota; one week in three is heavy, one in four is workable. They run the platform; they are not the build team (docs/delivery-plan.md) |
| Customer experience | 2, both shared | One is also the project manager, the other the administrator |
| Odoo implementation consultants | 2; one also builds R1 (FS-477) | Business suite and SME Recon |
| Compliance and risk officer | 0 (in discussion) | |
| Security lead | The CTIO, until a contract gives the runway to hire | Also architect and build lead (FS-477) |

## What the commitments need

| Role | At 2 institutions | At 5 | At 5 and 25 SMEs | Today |
|---|---|---|---|---|
| DevSecOps on the rota | 4–5 | 6–7 (a second person on call) | 7–8 | 3 |
| Security lead and engineers | 1 | 2 | 2 | The CTIO, part-time |
| Customer experience | 1–2 dedicated | 3–4 | 5–6 | About one, shared |
| Implementation for financial products | 1–2 | 2 | 2 | Covered by the project manager |
| Odoo consultants | — | — | 2 | 2 |
| Compliance and risk, with the data protection officer role | 1 | 2 | 2 | 0 |

Assumes managed detection and response (SE-13) and the AI-first service
desk. Analysts for compliance operations as a service (financial-crime
FC-15) are extra, sized by those contracts.

## Order of hiring

1. **Compliance and risk officer, now.** The PSP application (LC-06), the
   approval packs, ODPC, ISO 27001, the data protection officer role, and
   Roan Capital's lender obligations all wait on this person.
2. **Managed detection and response, before the first go-live.** Bought,
   not hired (SE-13, Liquid enquiry); it covers nights and weekends the
   rota cannot.
3. **DevSecOps:** a fourth engineer now (FS-474), and a fifth at the first
   signed contract, to make a rota of five and move the commitments to 1
   hour.
4. **A security engineer,** so security is not one more job for the CTIO.
5. **A dedicated customer success lead,** so service no longer rests on the
   project manager and the administrator.
6. **An implementation lead for financial products,** before the third
   institution goes live.

## Until the runway exists

- Keep commitments to what three people can keep: 4 hours (FS-471).
- Automate recovery first: automatic failover, runbooks, the safe mode
  (SE-24), so the rota acts rather than improvises.
- Pay on-call fairly and give time back after a night call; a rota of
  three burns out first.
- Cross-train the Odoo consultants as second line for SME Recon, and the
  service desk's AI agent as first line for everyone.
- Use the legal partner (SD-12) rather than hire legal.

## Managed detection and response

It is the managed Sophos service, bought through Liquid (platform-security
SE-13; FS-458, FS-475). A Sophos security operations centre watches our
servers, laptops and logs around the clock, hunts for threats, and acts on
them: it can isolate a machine or stop a process on its own, then tells
us. It covers the nights and weekends a rota of three cannot.

**What it does not do:** run our platform, fix an outage, or decide for us
in an incident. A failed database or a stuck payment queue is our rota's;
an attack is both, the centre first.

**To settle with Liquid before signing:** which machines it covers
(servers, laptops, our Kubernetes nodes), what it may do without asking,
where its telemetry is processed (our customers' data must stay in Kenya,
or be named in the contract), how fast it calls us, and the price per
machine (docs/outreach/liquid-partner-request.md).

## The AI-first service desk: where we start

The support page promises a desk open 24/7 where an AI agent answers
first, logs every request and hands it to a person (FS-476). Start small,
on the customers we serve today, and let the agent earn each step:

1. **One record of every request.** Odoo Helpdesk, which we implement
   anyway (business-suite BS-01): email and WhatsApp in for requests,
   never for documents: an attachment is removed from the ticket and the
   person is sent an upload link (FS-532); the support
   page's severities, and a severity-1 request paging the on-call rota.
2. **A knowledge base from what we already write:** each product's own
   paragraph, the onboarding checklists, runbooks and answers to the
   questions customers ask most; reviewed by customer experience before
   the agent may use it.
3. **The agent drafts, a person sends.** It classifies each request,
   proposes the severity and drafts the reply; customer experience
   approves. Measure how often the draft is right.
4. **The agent answers first** on low-risk requests (how to, status,
   where to find something), and always hands over when asked, when unsure
   or when money is involved. It never moves money and never sees
   Restricted data (insights IN-10).
5. **24/7:** out of hours the agent acknowledges, gathers the details and
   pages the rota for severity 1; everything else waits for the morning
   with the customer told when.

**Runbooks to write first** (FS-505): the access cases a desk meets most,
each with who may act, what is checked, and what the agent may and may not
do. In rough order of frequency: a forgotten PIN or password; a lockout; a
new phone with the old one in hand; a lost or stolen phone; a SIM replaced
or swapped; a changed number; a customer tricked into giving away a PIN or
code; a recycled number; a lost authenticator for staff or approvers; a
leaver or a change of role; a field device lost; a laptop lost, stolen or
damaged (report within the hour; cut off; assess; replace; record:
docs/specs/endpoints.md §5); a phone shared by several
customers; a customer abroad; a deceased customer (only the personal representative
under a grant acts for the estate: JN-14 §3 i, law register LR-39); an account-takeover
attempt. **The agent may block (AC-14); it never unblocks or resets** (AC-15
needs identity verification).

**Pilot with:** KCB and National Bank of Kenya, whose SMS and USSD support
we already provide, and Dibon's own staff.

**Measure:** time to first response, the share resolved without a person,
how often the agent's severity was right, and customer satisfaction.

**Open:** which model the agent uses. A hosted model may only see data its
class allows (architecture §7); customer requests can hold Confidential
data, so the contract, or a model we run ourselves, must say where it is
processed (FS-043, FS-476).
