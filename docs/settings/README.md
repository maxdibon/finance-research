---
id: settings
name: Settings — each component's baseline, which every deployment follows
kind: register
status: living
law: LR-17
released: unreleased
owner: Solution architect
classification: Internal
review_ids: [FS-1050]
last_reviewed: 2026-10-29
---

# Settings

FS-1050. **Each component's baseline:** the settings every deployment
follows, one document per component, from [the template](_template.md).
**Each deployment's own settings** are a file per component beside its
deployment page (`deployments/<deployment>/<component>.md`, from
[its template](../deployments/_settings-template.md)): only its choices,
any departure from a default, and any exception, so a critical setting
can be gone into deeply without overloading the deployment page, whose
§3 summarises them. The specs keep why a component is built as it is;
the settings live here, once.

**Every setting has a class:**

| Class | Means | A deployment may |
|---|---|---|
| **Mandatory** | The same in every deployment: a security control, a regulation, or what the design depends on | Not change it, except by a recorded exception (below) |
| **Default** | Our best practice, applied unless the deployment records another value within the range the baseline allows | Change it within the range, with the reason and who decided, in its file's §3 |
| **Per deployment** | Has no sensible default: each deployment must set it | Set it, in its file's §2; a deployment's file lists every one |

**An exception to a mandatory setting** is recorded in the deployment's
file, §4: the setting, the value it holds instead, why, the risk, who
approved it (the security lead for a security control, the compliance and
risk officer for a regulatory one) and when it expires. An expired
exception is a finding.

**How settings are applied and kept** (proposed with FS-1050):

- **All in git.** In `platform`, each component's baseline is a base
  folder every deployment uses, and each deployment's folder holds only
  its own values on top (github §6). A pipeline check refuses a
  deployment's folder that changes a mandatory setting or sets a default
  outside its range, unless its exception is recorded.
- **Kubernetes-level settings** (versions, replicas, resources, images)
  enforced at admission by Kyverno policies as well (flows §3).
- **Settings inside an application's own database** (Keycloak's realms,
  Fineract's global configuration, Odoo's settings, Grafana's) applied
  from git by a job, never by hand in the application's screens; read
  back each night and compared, so a difference is drift and an alert, as
  the configuration record's is (service management §3).
- **Changing a baseline** is a normal change; the security lead also
  approves any change to a security control (service management §2).

**The boundary with an institution's own configuration:** its products,
approval chains, limits, roles held by its people and the people
themselves are its business configuration, changed by its own staff in
the application under maker-checker and effective-dated, never in git.
Platform settings are ours, changed through git and change enablement.
Where a baseline names a setting the institution decides (its staff
roles, its administrators), the deployment's file records the decision;
the people and grants stay in the application.

| Component | Baseline | Owner | Status |
|---|---|---|---|
| ACCESS (Keycloak) | [keycloak.md](keycloak.md) | Security lead | Written |
| KAPU CORE (Fineract) | [fineract.md](fineract.md) | Solution architect | Written |
| DATABASE (PostgreSQL) | [postgresql.md](postgresql.md) | Operations lead | Written |
| OPENBAO | [openbao.md](openbao.md) | Security lead | Written |
| EDGE | [edge.md](edge.md) | Security lead | Written |
| EVENT BUS, ODOO, OBSERVABILITY and the rest | To write | As each component's owner | Later |

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
