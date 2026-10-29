---
id: settings-edge
name: The edge — baseline settings for EDGE in every deployment
kind: guide
status: living
law: LR-17
released: unreleased
owner: Security lead
classification: Internal
review_ids: [FS-1050]
last_reviewed: 2026-10-29
---

# The edge · baseline settings

## 1 · What this covers

**EDGE:** the only way in for traffic: the edge proxy (Envoy, configured
by Envoy Gateway), the web application firewall (Coraza with the OWASP
Core Rule Set, called by the proxy) and the shared rate limits (Envoy's
rate-limit service, with Valkey). What happens to a request, and in what
order, is [flows §1](../architecture/flows.md); the gateway is the
default while its trial against APISIX runs (FS-698). **Owner:** the
security lead. People never come in this way: they reach servers only
through the bastion.

## 2 · Settings

| Id | Setting | Value | Class | Why | Enforced by | Checked by |
|---|---|---|---|---|---|---|
| S01 | Gateway and version | Envoy Gateway and Envoy, on the Kubernetes Gateway API, one version across the fleet, upgraded after its checks pass | Mandatory | One edge to test and harden (FS-698) | The images in git; Kyverno | Configuration record |
| S02 | Configuration | Routes and policies from git, turned into Envoy's settings by Envoy Gateway; never changed by hand | Mandatory | Every route reviewed; no forgotten opening | Git; Envoy Gateway | Configuration record |
| S03 | Listeners | Three, apart: the web (staff, borrowers, approvers, Keycloak's login pages), partners' systems, and the rails' callbacks | Mandatory | Each audience checked its own way | Gateway resources, from git | Configuration record |
| S04 | TLS | Ended at the edge; TLS 1.2 or later (proposed); certificates from cert-manager; on the web, browsers told to use HTTPS only | Mandatory | SE-09 | Gateway resources, from git | Certificate expiry alerts at 30 days |
| S05 | Partners | Mutual TLS: the client certificate must be the one the partner registered; FAPI 2.0 through access | Mandatory | AC-04 | Gateway resources; Keycloak | Partner onboarding test |
| S06 | Callbacks | Accepted only from each rail's published addresses, then confirmed by a status query before they count | Mandatory | A forged callback is no payment (RL-11) | Gateway policy, from git; the rails service | A callback from another address dropped |
| S07 | Order of checks | TLS, then the source, then the firewall, then the token, then the rate, then the route | Mandatory | Cheap checks first: a flood or an unknown caller dropped before the firewall's rules run | Gateway resources, from git | Configuration record |
| S08 | Firewall | Coraza, called by the proxy as an external processor, with the OWASP Core Rule Set v4, blocking | Mandatory | SE-01 | The firewall's configuration, from git | A known attack blocked and logged |
| S09 | Firewall's strictness | The rule set's paranoia level 1, raised route by route as rules are tuned (proposed) | Default: level 1 or higher | Fewer false blocks at first, tightened with evidence | The firewall's configuration, from git | Blocks and false positives on a dashboard |
| S10 | Firewall exceptions | Only for one route, with the reason, in git, reviewed by the security lead | Mandatory | An exception is a hole: each must be known | Git; code owners | Review |
| S11 | Tokens | Signed with the realm's key, in date, meant for this API; the realm each API trusts (Keycloak baseline S10) | Mandatory | No token from the wrong realm, or for another API, gets through | Gateway policy; Keycloak's published keys | K8 |
| S12 | Rate limits | Every route limited per client, the counts shared across the proxy's replicas | Mandatory | One client cannot take the service from the rest (SE-02) | Envoy's rate-limit service; Valkey | A client over its limit refused |
| S13 | The limits | Per route, sized to the institution's volumes | Per deployment | Its volumes are its own | Gateway policy, from git | Grafana: requests limited per route |
| S14 | Routing | Each route to the one service it names; no route that is not written down; nothing else reachable | Mandatory | Default deny (SE-05) | Gateway resources; Cilium's policies | Configuration record |
| S15 | No administration from outside | No administration console or management endpoint on any listener: Keycloak's administration, Grafana's administration, the cluster's | Mandatory | Administration only through the bastion (rules, Dibon 3) | Gateway resources, from git | An attempt from outside refused |
| S16 | Secrets | None of its own: certificates from cert-manager, the realms' public keys from Keycloak | Mandatory | Nothing to steal at the edge | Gateway resources | Configuration record |
| S17 | Logging | Every decision (allowed, blocked, limited) logged and counted; no token, password or body in a log | Mandatory | An attack shows on a dashboard first (SE-18) | Gateway and firewall configuration, from git | Logs reach Loki without secrets |
| S18 | Replicas | 2 at each active site | Default: 2 or more | A restart drops no traffic | Gateway resources; Kyverno | Configuration record |
| S19 | Upstream protection | The hosting provider absorbs floods before they reach us | Per deployment | Its provider's service (SE-03) | The provider's contract | The provider's report |
| S20 | Host names | The institution's own names on the web listener | Per deployment | Its customers see its name | Gateway resources, from git | Certificates for each name |

## 3 · How it is applied

All from git: the Gateway API's resources (gateways, listeners, routes)
and Envoy Gateway's policies (security, rate limits, the firewall as an
external processor) in `platform`, applied by Flux; the firewall's rule
set and exceptions as files beside them. Nothing changed in Envoy
directly.

## 4 · How it is checked

The configuration record each night; certificates' expiry; the firewall's
and the limits' dashboards; and, before each release, a known attack, a
callback from a wrong address, an `ops` token and an administration path
tried from outside, each refused.

## 5 · Changing this baseline

A normal change, approved by the operations lead and the security lead;
a firewall exception (S10) by the security lead.

## 6 · Open questions

1. The gateway: Envoy Gateway is the default until its trial against
   APISIX, with Coraza measured both ways (FS-698).
2. The minimum TLS version, and the rule set's paranoia level, as
   proposed here: to confirm in the trial.

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
