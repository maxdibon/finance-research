---
id: architecture-flows
name: Architecture flows — how the components work together, one question at a time
kind: architecture
version: 0.1.0
owner: Solution architect
classification: Internal
review_ids: [FS-695, FS-698, FS-699, FS-704, FS-706]
last_reviewed: 2026-10-10
---

# Flows: how the components work together

One diagram for everything would show every line and explain none
(FS-706). Each flow here answers one question, follows one thing through
the platform, and keeps to the few boxes that question needs. Together
with the other views they cover the platform:

| Question | Where |
|---|---|
| What runs in an instance, and what each box is | [instance](instance.md) |
| Where instances run, and how a site's loss is survived | [deployment](deployment.md) |
| How a payment moves, step by step | [runtime](runtime.md), as sequence diagrams |
| What each component is, its class and why we chose it | [technology](technology.md) |
| How a request gets in | §1 below |

**Flows still to draw,** each on the same pattern: a change going out
(service, outbox, relay, Kafka, consumers, the audit chain, Rekor); a
secret reaching a service (OpenBao, SPIRE); a release reaching
production (GitLab, runner, Harbor, Flux, Kyverno); a signal reaching a
person (OpenTelemetry, Prometheus, Loki, Tempo, Grafana, GoAlert); a
backup leaving the site (Barman, Velero, the offline copy).

## 1 · A request coming in: the edge

What happens between the internet and a service (FS-704). The edge is
the only way in for traffic; people reach servers only through the
bastion.

```
   staff . borrowers . approvers     partners' systems            the rails' callbacks
              |  HTTPS                  |  HTTPS, client certificate    |  HTTPS
              v                         v                               v
  +----------------------------------------------------------------------------------------------+
  | PROVIDER PROTECTION                                                                          |
  | absorbs floods before they reach us (SE-03)                                                  |
  | [liquid]                                                                                     |
  +----------------------------------------------------------------------------------------------+
                            |
                            v   one listener for each: web . partner API . callbacks
  +--------------------------------------------------------+    +--------------------------------+
  | EDGE PROXY                                             |    | EDGE CONTROL                   |
  | checks every request, in this order                    |<---| turns routes into settings     |
  | [envoy]                                                |    | [envoy_gateway]                |
  |                                                        |    | from GitOps, never by hand     |
  | 1 TLS ended. A partner's client certificate must be    |    +--------------------------------+
  |   the one it registered (FAPI 2.0)                     |
  |                                                        |
  | 2 A rail's callback must come from the rail's          |
  |   published addresses, or it is dropped                |
  |                                                        |    +--------------------------------+
  |                                                        |    | WAF                            |
  | 3 Inspected against the OWASP rules; a match is        |--->| the OWASP Core Rule Set        |
  |   blocked, and logged                                  |    | [coraza]                       |
  |                                                        |    +--------------------------------+
  |                                                        |    +--------------------------------+
  |                                                        |    | ACCESS                         |
  | 4 Its token must be signed with the realm's key,       |--->| publishes each realm's keys    |
  |   in date, and meant for this API                      |    | [keycloak]                     |
  |                                                        |    +--------------------------------+
  |                                                        |    +--------------------------------+
  |                                                        |    | RATE LIMITS                    |
  | 5 The client must be within its rate                   |--->| counts per client, shared      |
  |                                                        |    | [envoy_ratelimit, valkey]      |
  |                                                        |    +--------------------------------+
  |                                                        |
  |                                                        |
  | 6 Sent to the one service its route names;             |
  |   nothing else can be reached                          |
  +--------------------------------------------------------+
                            |
                            v   only where a route and the network policy allow (SE-05)
  +----------------------------------------------------------------------------------------------+
  | SERVICES                                                                                     |
  | each in this institution's own namespace                                                     |
  | [kapu_service, keycloak, odoo]                                                               |
  | KAPU MFI . APPROVAL ENGINE . RAILS . MESSAGING . the login pages . ODOO                      |
  +----------------------------------------------------------------------------------------------+

  every decision (allowed, blocked, limited) is logged and counted for OBSERVABILITY
  never through the edge: people reach servers and databases only through the BASTION
```

- **Three audiences, three listeners:** the web (staff, borrowers,
  approvers, and Keycloak's own login pages), partners' systems (with
  their client certificates, FAPI 2.0, access AC-04) and the rails'
  callbacks (accepted only from the addresses each rail publishes, then
  confirmed by a status query before they count, rails RL-11).
- **The order matters:** cheap checks first, so a flood or an unknown
  caller is dropped before the firewall's rules run.
- **The proxy holds no secrets of its own:** its certificates come from
  cert-manager, the realms' public keys from Keycloak, its settings from
  GitOps through the control.
- **A blocked request never reaches a service.** Each decision is logged
  and counted, so an attack shows on a dashboard before it shows anywhere
  else.
- **Being decided:** Envoy Gateway against APISIX, with Coraza called as
  an external processor (FS-698, FS-699).
