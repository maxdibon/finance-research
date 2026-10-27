---
id: business-continuity
name: Business continuity plan — keeping the service, the company and the commitments going
kind: plan
status: living
law: LR-17
released: 2026.10.16
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-482, FS-485, FS-657, FS-758, FS-896, FS-1037]
last_reviewed: 2026-10-27
---

# Business continuity plan

**What this covers:** what keeps Dibon's service and Dibon itself going
when something fails, beyond the technology (FS-482, FS-485). The technical
side is in platform security: recovery objectives, backups in two Kenyan
sites, safe mode, drills (platform-security §3, SE-10, SE-20 to SE-25).
This plan adds people, suppliers, the processes that are not IT, and how
we tell customers and regulators. It is the start of ISO 22301 (compliance
LC-09); SASRA expects a recovery plan from Sacco vendors (LC-05) and CBK's
draft risk guidelines expect one from banks' providers.

**Each deployment's own continuity** (FS-1037): its recovery
objectives, backups, tests, runbooks and who is called are its §5 in
[deployments](deployments/README.md); the steps are
[the runbooks](runbooks/README.md). This plan is the company's.

## Business impact

| Process | If it stops, after | Recover within | Owner (role) | Depends on |
|---|---|---|---|---|
| Money movement for customers: collections, payouts, ledgers | 1 hour | Tier 1: 4 hours for a site; safe mode within 4 hours after a compromise (platform-security §3) | DevSecOps on call | Liquid, Safaricom and other rails, OpenBao |
| Login and one-time codes | 1 hour | Tier 1 | DevSecOps on call | Keycloak, SMS routes |
| Incident notices to customers | 4 hours (our commitment) | — | Security lead | Contacts at onboarding (OB-COM-13) |
| Support desk | 1 working day | 1 working day | Customer experience | Odoo Helpdesk |
| Delivery to customers (R1 and on) | 1 week | 1 week | The CTIO | The build team |
| Payroll, payments to suppliers, tax filings | 1 week | Before the deadline | Finance lead | Bank, KRA eTIMS |
| Regulatory filings and licences (ODPC, PSP application, NPS Bill) | Their deadlines | Before the deadline | Compliance and risk officer | — |

## People: a deputy for every critical role

| Role | Deputy | Until |
|---|---|---|
| CTIO (architect, build lead) | The system developer | Permanent |
| Security lead (today the CTIO) | The most senior DevSecOps engineer | A security engineer is hired (docs/operating-model.md) |
| DevSecOps on call | The next person in the rota, then the CTIO | The rota reaches five |
| Project manager | The administrator | Permanent |
| Compliance and risk officer | The CTIO | The officer is hired |
| The recovery key holders | Five holders, any three of whom open the backups, one of them outside Dibon (SE-21, docs/architecture/deployment.md §4) | Permanent |

**No single person** holds the only copy of a password, a key, a
procedure or a customer relationship. Runbooks are written, not
remembered, and anyone in the rota can follow them.

## Suppliers: a fallback for every critical one

| Supplier | If it fails | Fallback |
|---|---|---|
| Liquid (hosting) | The platform | Restore to a second Kenyan site; the build is portable to another host or to customer premises (platform-security §9); an exit clause in the contract (Liquid list, item 8) |
| Safaricom Daraja and other rails | Payments on that rail | Safe mode: collections keep landing in institutions' own paybills; payouts queue; reconciliation catches up from the rail's records (rails RL-20) |
| Managed detection (Sophos through Liquid) | Round-the-clock watch | Our rota watches alerts directly; endpoint protection keeps running without the service |
| Meliora (SMS for KCB and NBK) | Those banks' SMS | Meliora's own redundancy; a second route agreed with each bank |
| Microsoft (Intune), GitHub or other tooling | Device management, code hosting | Code mirrored to a git server of ours in Kenya, issues and pull requests exported nightly (docs/specs/github.md §5); devices keep their last policy |
| The legal partner | Advice | The second firm on the shortlist (partners SD-12) |

## Telling people

| Who | When | Who tells them | How |
|---|---|---|---|
| Affected institutions | Within 4 hours of a confirmed significant incident; updates every 4 hours (platform-security §3) | Security lead, with customer experience | Phone and email to the contacts at onboarding |
| A customer's data subjects | When the institution, as controller, decides | The institution; we prepare | — |
| The Data Commissioner | The institution, within 72 hours; we tell it within 24 (s.43) | The institution | — |
| CBK, SASRA, NC4 | As the institution's or our own obligations require | The institution, or our compliance officer for our own | — |
| Our own staff | As soon as an incident is declared | The CTIO | A channel that does not depend on our own systems |

Templates for each are written before they are needed.

## Workplace

- **Power and internet:** every engineer on call has a second connection
  (mobile data) and a laptop that runs on battery long enough to act.
- **Remote work:** everything needed to run the platform works from
  anywhere with a managed laptop (SE-14); no task needs the office.
- **The office:** if it is unusable, the team works remotely; nothing is
  stored only there.

## Testing

| Exercise | How often |
|---|---|
| Restore test | Every quarter (SE-10) |
| Site failover with each customer | Twice a year |
| Ransomware drill | Twice a year (SE-25) |
| Tabletop: a supplier fails, a key person is away, a regulator calls | Twice a year |
| This plan reviewed | Every year, and after every real incident |

## Open

- Liquid's answers on a second site and exit terms (Liquid list).
- A second SMS route agreed with KCB and NBK.
- The finance lead's own deputy and the bank mandates for payroll.

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-17](law/LR-17.md) The Data Protection Act (Cap. 411C).** Regulator: Office of the Data Protection Commissioner. Made under: An Act of Parliament. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2019/24/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 43 | s. 43 | A breach with a real risk of harm notified to the Data Commissioner within seventy-two hours, and to the person affected; a processor tells the controller within forty-eight hours where practicable (43(3)) |
