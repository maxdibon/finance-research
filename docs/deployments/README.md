---
id: deployments
name: Deployments — every deployment, and what runs in each
kind: register
status: living
law: LR-17
released: unreleased
owner: Solution architect
classification: Internal
review_ids: [FS-1037, FS-1045, FS-1046, FS-1050]
last_reviewed: 2026-10-29
---

# Deployments

FS-1037. **Every deployment of the platform, one row each,** and a page
for each from [the template](_template.md): what runs in it, its
settings, diagrams, integrations, continuity, access, data, licences
and suppliers, size, exit, and changes. A deployment is one institution's
instance in one environment, across its sites; a sandbox counts.

**The register:**

| Deployment | Institution | Environment | Sites | Who runs it | Availability | Release | Status | Page |
|---|---|---|---|---|---|---|---|---|
| Roan Capital, production | Roan Capital (CU-01) | Production | Site A and site B, in Kenya; the provider to decide (FS-032, FS-775) | Dibon | Warm standby (RC-35) | R1 | Designed | [roan-capital-production.md](roan-capital-production.md) |
| The MVP sandbox | None: made-up data only | Sandbox | Public Azure, South Africa North | Dibon's platform workstream | None: rebuilt from code | The MVP day (30 October) | Designed | [mvp-sandbox.md](mvp-sandbox.md) |

**How a page is kept:**

- **Written now, generated later.** Until there is code, each page is
  written from the design. Once the configuration record is generated
  from the code (service management §3; platform-security SE-23), its
  components, versions, integrations and certificates come from there,
  and the page keeps only what code cannot know: who decided, what was
  agreed, what was tested.
- **Its settings** are its §3: each component's, with the value this
  deployment takes and who decided it; never a secret, host or address
  (FS-1046).
- **How they interact** is drawn below §2's table, in diagrams that
  build on each other (FS-1045).
- **Every component of an instance** (architecture instance, the table
  of boxes) is listed in §2, deployed or not and why; its namespace and
  database cluster are among the instance page's. The check holds every
  page to this and to the template's headings.
- **No addresses, no secrets, no names.** Things by name and role: hosts,
  addresses and endpoints stay in the generated record inside the
  instance; secrets by their OpenBao id only; people by role (rules,
  Dibon 1 and 2).
- **Settings in two layers** (FS-1050): each component's baseline is in
  [settings](../settings/README.md); a deployment's own values for a
  component are a file in a folder named as its page,
  `deployments/<deployment>/<component>.md`, from
  [its template](_settings-template.md), and its page's §3 summarises them.
- **Continuity in two layers:** the company's plan is
  [business-continuity](../business-continuity.md); each deployment's own
  is its §6, and the steps are [the runbooks](../runbooks/README.md).
- **A deployment changes** by pull request, its §12 noting what and why;
  a change to production also goes through change enablement (service
  management §2).

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
