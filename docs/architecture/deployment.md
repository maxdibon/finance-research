---
id: architecture-deployment
name: Architecture deployment — sites, the fleet, and what is central
kind: architecture
version: 0.1.0
owner: Solution architect
classification: Internal
review_ids: [FS-032, FS-359, FS-466, FS-491, FS-645, FS-649, FS-651]
last_reviewed: 2026-10-08
---

# Deployment: sites, the fleet, and what is central

Where instances run, what Dibon runs centrally, and how a site's loss is
survived (FS-649). The four deployment options and who holds access are
in [the README](README.md) §9; recovery objectives in platform-security
§3.

## 1 · Sites and the fleet

```
  +------------------------------------------+      +------------------------------------------+
  | SITE A                                   |      | SITE B                                   |
  | runs production                          |      | a second Kenyan site                     |
  | [liquid_azure_stack]                     |      | [liquid_or_second_provider]              |
  |                                          |----->|                                          |
  | per institution, isolated:               | copy | database replicas, a few minutes behind  |
  |   edge  |  services  |  data  |  bastion |      | backups: immutable and write-once        |
  |                                          |      | a clean rebuild from code (SE-23)        |
  | institution 1 . institution 2 . ...      |      |                                          |
  +------------------------------------------+      +------------------------------------------+
                        |                                                 |
                        |                                                 |
                        v                                                 v
  +------------------------------------------+      +------------------------------------------+
  | DIBON CENTRAL                            |      | OFFLINE                                  |
  | runs the fleet, never a ledger           |      | the last copy                            |
  | [kapu_service]                           |      | [offline_media]                          |
  |                                          |      |                                          |
  | engineers' Keycloak (hardware keys)      |      | one backup copy offline (SE-20)          |
  | fleet Grafana . GoAlert                  |      | backup keys split between two            |
  | GitOps . pipeline . signed registry      |      | people, sealed (SE-21)                   |
  +------------------------------------------+      +------------------------------------------+

  out of the country only by name: detection telemetry to the managed security service
  (SE-13); WhatsApp, Twilio and email platforms carry notifications and links only (§7)

  on an institution's premises: the same layout in its data centre, with its own second site
```

- **Site A** runs each institution's instance in its own namespace,
  divided into four zones: the edge (firewall and gateway), services,
  data, and the bastion through which people reach anything inside.
  Traffic between zones and services is denied unless allowed (SE-05).
- **Site B** is a second Kenyan site: database replicas a few minutes
  behind, immutable backups, and enough to rebuild an instance from code
  (SE-10, SE-22, SE-23). Losing site A loses at most 5 minutes of tier-1
  data and takes up to 4 hours to recover (platform-security §3).
- **Dibon central** runs the fleet, never a ledger: engineers' Keycloak,
  the fleet's Grafana and on-call, GitOps, the pipeline and the signed
  image registry. It holds no institution's data; its loss stops changes
  and fleet views, not any institution's service.
- **Offline:** one backup copy offline; the backup keys split between two
  people and sealed (SE-20, SE-21).
- **On an institution's premises:** the same layout, in its data centre
  and its second site, run by it or by Dibon (README §9).

**Open:** whether site B is Liquid's or a second provider's; Liquid is
not yet contracted (partners PT-01, FS-032).
