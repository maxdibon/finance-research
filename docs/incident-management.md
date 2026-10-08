---
id: incident-management
name: Incident management — severities, who is told, how and with what
kind: plan
version: 0.1.0
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-466, FS-471, FS-633, FS-639]
last_reviewed: 2026-10-08
---

# Incident management

**What this covers:** how an incident is ranked, who is told, on which
channel, how fast, and what the notice says (FS-633). Every alert the
platform raises, the end-of-day runner's included, is routed by this
plan (docs/specs/end-of-day-runner.md, docs/specs/observability-grafana.md).
Security incidents add the commitments in platform-security §3; telling
customers, regulators and staff in a wider disruption is in
docs/business-continuity.md. This is the runbook SE-19 asks for, at its
start; recon-observability RO-18 runs it.

## 1 · Severities

The four the support offer names, with what they mean for the platform:

| Severity | Meaning | Examples |
|---|---|---|
| 1 | Money cannot move, or a balance is wrong | The end-of-day run fails or overruns; the general ledger does not balance; payouts stop on a rail; a confirmed compromise |
| 2 | A product or channel is degraded, but money still moves | A blocking end-of-day check holds the run; one rail slow; one customer's integration failing |
| 3 | One user or one function is affected | A warning from the end-of-day checks; one loan locked after its close; one report late |
| 4 | A question or a change request | A request to change a rule's threshold |

An alert carries its severity as a label from the rule that raised it;
the on-call engineer may raise or lower it, and says why in the record.

## 2 · Roles

| Role | Does |
|---|---|
| On-call engineer (DevSecOps rota) | Acknowledges, leads the incident until they hand it over, keeps the timeline |
| Incident lead | The on-call engineer, or the CTIO for a severity 1 lasting over an hour |
| Security lead | Any security incident; the customer notices in platform-security §3 |
| Customer experience | Updates to customers after the first notice; the ticket |
| The institution's contacts | Named at onboarding (OB-COM-13): operations, finance, IT, security, incidents |

**The record** (FS-639): one Odoo Helpdesk ticket per incident, holding
its severity and any change to it with the reason; the service and the
institutions affected; when it was raised, acknowledged and resolved;
who led it; the timeline, which GoAlert keeps for every page; who was
told, when and how; and the problem it opened (docs/service-management.md
§4).

**Closed** when the service is restored and the institution confirms it,
or two working days pass after we tell it with no reply. A severity 1
closes only after its preliminary report is sent, and always opens a
problem.

## 3 · The notification plan

Who is told, how, and how fast. Times are from the alert, around the
clock unless the row says working hours. The numbers are proposed until
agreed with the rota and each customer (§6).

| Severity | Who | Channel | When | Content |
|---|---|---|---|---|
| 1 | On-call engineer | **Phone call**, then SMS (ON-CALL) | At once | §4, the short form |
| 1 | Next in the rota, then the CTIO | Phone call | No acknowledgement in 5 minutes, then 15 | The same |
| 1 | The institution's operations and incident contacts | Phone and email | Within 30 minutes of acknowledgement; then every hour until money moves and balances are right | §4, the full form |
| 2 | On-call engineer | SMS and app notification | At once; a phone call if not acknowledged in 15 minutes | §4, the short form |
| 2 | The institution's operations contact (for end of day, its accountant) | Email, and a ticket | Within one hour, or before its working day starts | §4, the full form |
| 3 | The owning team; the institution's operations contact | A ticket; email in working hours | Next working day, and in the morning report | What, which records, what to do |
| 4 | The owning team | A ticket | As the support tier says | — |
| Any | Dibon staff | A channel that does not depend on our own systems (business-continuity) | When a severity 1 is declared | That it is, and who leads |

## 4 · What a notice says

**Short form** (a phone call or SMS to an engineer): the severity, the
service, what failed, since when, and where the runbook is.

**Full form** (to an institution):

1. What happened, in plain words, and since when.
2. What it means for them: can money move, are balances right, which
   products and channels.
3. What they should do or not do (for example: "release no payouts until
   we confirm").
4. What we are doing, and who leads it.
5. When the next update comes.
6. The incident's reference.

**Never in a notice:** personal data, account numbers, credentials, or
any Restricted field. An SMS carries no customer names at all.

Templates for each form are written before they are needed, and checked
in the twice-yearly tabletop (business-continuity).

## 5 · After

- Every severity 1 has a written report: preliminary within 12 hours,
  root cause within 5 working days (as platform-security §3 sets for
  security incidents), sent to the institution.
- Every alert's timeline stays in the record: raised, acknowledged,
  escalated, resolved. Nothing is rewritten.
- A rule that paged without need is tuned; a failure no rule caught gets
  one.

## 6 · Open

- The acknowledgement and escalation times above, with the rota (three
  engineers today, docs/operating-model.md).
- Each customer's contacts and hours, by support tier, at onboarding
  (OB-COM-13).
- The on-call tool and its phone route (observability-grafana §6).
