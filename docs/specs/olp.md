---
id: olp
name: OLP, as Financial Services uses it — component specification
kind: spec
type: component
status: draft
released: unreleased
release: R2
implements: [business-suite]
depends_on: []
used_by: []
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-293, FS-970, FS-971, FS-972, FS-973]
last_reviewed: 2026-10-26
---

# OLP, as Financial Services uses it — component specification

OLP (Odoo Launch Pad) is Dibon's own platform for running Odoo sites:
provisioning, add-ons, domains, staging, backups and version upgrades
(business-suite BS-11). For Financial Services it is an **independent
component with its own roadmap and owners**, as Keycloak or Grafana is;
the two projects influence each other (FS-973). This spec says what
Financial Services uses OLP for, and what it needs and wants from OLP,
each need with an id OLP's roadmap can answer. **How OLP is today, and
its gaps, are in a separate review:**
[OLP, reviewed, 26 October 2026](../reviews/olp-2026-10-26.md). OLP's
own design is OLP's: its handbook is kept at
sources/olp/olp-handbook.html.

## 1 · Purpose and scope

What it answers: which Odoo sites does Financial Services run on OLP, and
what must OLP do for them?

| Id | Capability | In R1 |
|---|---|---|
| BS-11 | Managed Odoo hosting on OLP: instances, backups, staging, upgrades | No: R1's back office runs in Roan Capital's instance (§2); OLP serves SMEs and Dibon's own Odoo from R2 |

**Out of scope:** OLP's own design, code, pricing and roadmap; how it
serves customers other than Financial Services'.

**Where it sits.**

```
  +----------------------+  sites, add-ons,   +----------------------+
  | OLP                  |  backups,          | ODOO                 |
  | runs odoo sites      |------------------->| keeps the back office|
  | [olp]                |  upgrades          | [odoo]               |
  +----------------------+                    +----------------------+
             ^
             |  needs (N1 to N14), raised as register rows
  +----------------------+
  | GITHUB               |
  | holds code           |
  | [github]             |
  +----------------------+
```

**Related:** implements [business-suite](../modules/business-suite.md);
depends on none; used by none yet; the back office's interface is
[back-office](back-office.md), whichever platform runs the ERP.

## 2 · What Financial Services runs on OLP

| Odoo sites | On OLP? | Why |
|---|---|---|
| SMEs on the business suite (BS-01 to BS-20 for SMEs) | **Yes** | What OLP is for: one Odoo per business, run without servers of their own |
| Dibon's own Odoo (CRM, Documents, the client vault's workspaces) | **Yes** | Dibon's own back office |
| The back office inside an institution's instance (Roan Capital's Odoo, R1) | **Not yet: to decide** (open question 1) | The instance runs Odoo on Kubernetes through Flux, with a synchronous database standby and replicated object storage (architecture deployment); OLP runs Odoo in Docker on a machine. Until OLP can target an instance, or the instance adopts OLP's model, OLP's upgrade steps are borrowed, not its runtime |

## 3 · Version and hosting

- **Odoo versions:** OLP installs 17.0 to 20.0 and accepts imports from
  15.0 (its handbook). Financial Services' sites follow back-office §3's
  upgrade rules once written (FS-971).
- **Where OLP runs:** to be hosted on Liquid's Azure Stack in Kenya
  (business-suite). Until it is, no Financial Services document says
  OLP is "hosted in Kenya" (N12).

## 4 · What Financial Services needs and wants from OLP

**Must** before a regulated institution's data is on OLP; **Should**
before SMEs' financial data is; **Could**, welcome. The status is the
review's reading of the handbook, not of OLP's code.

| Id | Need | Priority | For | Status (review) |
|---|---|---|---|---|
| N1 | Enterprise upgrades through Odoo's own upgrade service, beside OpenUpgrade for Community, so Sign, Helpdesk and Documents move too | Must | Every Enterprise site | Gap (G1) |
| N2 | A target inside an institution's instance: Odoo on Kubernetes through Flux, with CloudNativePG and object storage; or an agreed boundary where OLP's steps run against it | Must, if institutions' back offices are to be on OLP | Institutions | Gap (G2) |
| N3 | A hook before promoting an upgraded or staged copy, so back-office §10's contract tests run on it, and promotion waits for them | Must | Every site the back-office gateway serves | Gap (G3) |
| N4 | Sign-in to OLP through Keycloak; hardware keys for anyone with server or restore rights (SE-26) | Must | Dibon's engineers | Gap (G4) |
| N5 | SSH keys held in OpenBao, used through the bastion, every session recorded | Must | Every managed server | Not stated (G5) |
| N6 | Backups encrypted, held in Kenya at two sites, never over FTP, kept as docs/documents.md says | Must | Institutions; Should for SMEs | Not stated (G6) |
| N7 | Infrastructure code that runs on OpenTofu (FS-932) | Should | Every server OLP builds | Gap (G7) |
| N8 | Alerts on by default for Financial Services' sites, and sent to our observability by webhook | Should | Every site | Partly: alerts are opt-in; webhooks exist |
| N9 | Add-ons deployed from main after review, to staging first, never from any push | Should | Every site with our modules | Partly: a webhook syncs a branch |
| N10 | Generated passwords and subscription codes written to OpenBao, not shown once to be copied | Should | Every site | Gap (G8) |
| N11 | An export of a site's records in open formats, with our references, beside Odoo's own dumps (back-office rule 8) | Should | Every site the gateway serves | Gap: dumps load only into their own Odoo version |
| N12 | OLP itself hosted in Kenya, on Liquid's Azure Stack, before we say so | Must, for what we publish | Our marketing (portfolio) | Planned |
| N13 | Switching a site between Enterprise and Community | Could, and present | A cost-led customer (FS-967) | Met |
| N14 | Access tokens signed with keys, not one secret shared by every service | Should | OLP's own services | Gap (G9) |

## 5 · Contracts between the two projects

- **Needs travel as register rows,** one per need, with OLP's owner in
  "With"; OLP's answer, and the release that meets it, are recorded
  there.
- **A change in OLP that a Financial Services site would feel** (a new
  Odoo version default, an upgrade path, a backup format) is a change
  for change enablement (docs/service-management/README.md §2) before it
  reaches our sites.
- **Financial Services pins the OLP release** its sites run on, as it
  pins Fineract and Keycloak, and moves only after §9's checks.

## 6 · Security

As N4 to N6, N10 and N14. Until they are met, OLP holds no regulated
institution's data, and SMEs' sites on it are classed by what they hold.

## 7 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| Each site's Odoo database and files | As the site's owner classes them | As docs/documents.md says, for Financial Services' sites | The SME's staff, customers and contacts |
| Backups | As the site | By policy (N6) | As the site |
| OLP's own records: members, roles, audit | Confidential | OLP's own policy | Dibon's and customers' users |

## 8 · Quality and metrics

The site's own tier; OLP's alerts for Financial Services' sites routed
to observability (N8): a site down, a backup missed, a certificate near
expiry, a subscription near its end.

## 9 · Threats

| Threat | For example | The answer |
|---|---|---|
| Spoofing | A forged token reaching every OLP service | N14; N4 |
| Tampering | A push deploys an unreviewed module to production | N9 |
| Repudiation | A restore over a live site, disputed | OLP's audit of removals and restores, kept (review: a strength) |
| Information disclosure | A backup read where it is stored | N6 |
| Denial of service | A failed upgrade | Staging copy and rollback (review: a strength); N3 |
| Elevation of privilege | OLP's SSH keys reach every server | N5 |

## 10 · Checks before the build

| # | Check | Id, source |
|---|---|---|
| K1 | An Enterprise site upgraded one major version on a staging copy, with Sign, Helpdesk and Documents working after | N1 |
| K2 | Back-office contract tests run on the staging copy before promotion, and a failure stops it | N3 |
| K3 | A backup restored from its stored copy; the copy shown to be encrypted and in Kenya | N6 |
| K4 | Sign-in to OLP through Keycloak, a restore refused without a hardware key | N4 |

## 11 · Open questions

**For the owner:**

1. Does OLP run institutions' back offices (N2), or only SMEs' and
   Dibon's own, with institutions' Odoo in their instance through Flux?
2. Who owns OLP's roadmap, to answer N1 to N14?

**For OLP's owners:** N1 to N14, each as its row.
