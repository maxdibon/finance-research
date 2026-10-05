---
id: operating-model
name: Operating model — the people who keep the commitments
kind: plan
version: 0.1.0
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-467, FS-470, FS-471, FS-472]
last_reviewed: 2026-10-05
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
| DevSecOps | 3 | The on-call rota; one week in three is heavy and is a risk to keep |
| Customer experience | 2, both shared | One is also the project manager, the other the administrator |
| Odoo implementation consultants | 2 | Business suite and SME Recon |
| Compliance and risk officer | 0 (in discussion) | |
| Security lead | The CTIO, until a contract gives the runway to hire | |

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
3. **Two DevSecOps engineers, at the first signed contract,** to make a
   rota of five and move the commitments to 1 hour.
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
