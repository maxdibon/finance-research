---
id: access
name: Access — login, roles and step-up
kind: shared-service
version: 0.1.0
owner: Solution architect
classification: Internal
audience: [bank, sacco, mfi, psp, imt, sme, fintech]
depends_on: [messaging]
consumed_by: [mandates, messaging, rails, recon-observability, identity, financial-crime, core, collect, gateway, mfi, sacco, sme-recon, escrow, crb, omni-channel, insights, business-suite]
review_ids: [FS-132, FS-142, FS-144, FS-156, FS-159, FS-170, FS-193, FS-194, FS-195, FS-196, FS-197, FS-198, FS-201, FS-206, FS-449]
last_reviewed: 2026-10-05
---

# Access — login, roles and step-up

## 1 · In one paragraph

Access will decide who may log in, as whom, with which roles, and whether
the person acting right now is the person they claim to be. It will be one
identity provider for the platform, **Keycloak** (FS-194), serving staff,
members and customers, partners' systems and AI clients. Every
application will log in through it, Odoo, Fineract and Grafana included.
It is how re-authentication at the act will be built: a payment, an
approval or a release will ask for **step-up authentication** at that
moment, not at login. An institution with its own identity provider keeps
it; we will federate to it. **Access will hold logins, not people.** A
person's identity and KYC stay with their authority (docs/architecture.md
§2).

## 2 · Who it is for

**Segments:** every product and every customer. Institutions without an
identity provider of their own use ours outright.

**The problem, concretely:** each system has its own users and passwords.
A shared device or a borrowed session means the person approving a payment
may not be the person logged in. Partners' systems call APIs with
long-lived keys. Nobody can say, for one person, every system they can
reach.

**People who use it:**

| Role | What they need from it |
|---|---|
| Staff (institution and Dibon) | One login across Odoo, Fineract, Grafana and the portals |
| Member or customer | Login to the app and internet banking, with passkeys or one-time codes; recovery that works |
| Approver | A quick, certain re-authentication when an act needs it, including on their phone |
| Partner or merchant system | API credentials that are scoped, short-lived and bound to the client |
| Institution admin | Users, roles and groups for their institution only |
| Auditor | Every login, every role change and every step-up, attributed |

## 3 · What it does

**Status:** Keycloak's features are confirmed against its documentation
(FS-198). Nothing is configured for us yet, so every row is **Planned**.

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| AC-01 | One identity provider for the platform: OpenID Connect, OAuth 2, SAML | Planned | FS-194; Keycloak documentation | 1 |
| AC-02 | Staff single sign-on for Odoo, Fineract, Grafana and our portals | Planned | FS-194 | 1 |
| AC-03 | Member and customer login for apps and internet banking: passkeys, one-time codes, recovery codes | Planned | Keycloak: WebAuthn and passkeys, OTP, recovery codes | 1 |
| AC-04 | Partner and merchant API clients: client credentials, mutual TLS, financial-grade API profiles (FAPI 1, FAPI 2, OAuth 2.1) | Planned | Keycloak: built-in FAPI client profiles | 1 |
| AC-05 | Step-up authentication at the act, by level of authentication — the mechanism behind mandates MD-10 | Planned | Keycloak: step-up authentication; FS-132. Also the step-up behind approval from email, mandates MD-18 (FS-449, FS-453) | 1 |
| AC-06 | Approval on a phone for a request started elsewhere (CIBA) | Planned | Keycloak: CIBA policy per realm | 2 |
| AC-07 | Federation with an institution's own identity provider; directory federation (LDAP) | Planned | Keycloak: identity brokering, user federation; FS-195 | 1 |
| AC-08 | Tenancy: a realm per institution, or organisations within a realm | Planned | Keycloak: realms, organisations; FS-197 | 1 |
| AC-09 | Roles and groups per institution, read by the mandate engine to resolve approvers | Planned | FS-142, FS-201 | 1 |
| AC-10 | Session rules: expiry, revocation, and sign-out everywhere | Planned | Keycloak session management | 1 |
| AC-11 | Login, admin and step-up events streamed to observability | Planned | recon-observability RO-16 | 1 |
| AC-12 | Tokens for AI clients over MCP: per person, scoped, expiring; never shared | Planned | FS-156, FS-159 | 2 |
| AC-13 | One-time codes delivered through our messaging service | Planned | messaging MS-02 | 1 |

## 4 · Where it sits

**Depends on:** messaging (one-time codes).
**Used by:** every module. The mandate engine uses it for re-authentication
(AC-05) and role resolution (AC-09).

**Who holds which record** (docs/architecture.md §2):

| Record | System of record | This module |
|---|---|---|
| Login identities, credentials, passkeys, sessions | **Access (Keycloak)** | Holds. Credentials Restricted |
| Roles and groups: who may do what | **Access (Keycloak)** — proposed (FS-201) | Holds |
| The person: name, KYC, contact details | Their authority: the core, Fineract, Odoo or the ERP | References by id. Holds only what login needs |
| An institution's own users, when it has an identity provider | The institution's identity provider | Federates; never copies its directory |
| Step-up and login events | Access, streamed to observability | Holds. Append-only |

**What this module never stores:** a person's KYC, or a password for a
system it federates to.

**Under each access mode** (FS-195), the equivalent of the ledger modes:

| | Integrated — the institution has an identity provider | Native — it does not |
|---|---|---|
| Where logins are held | The institution's identity provider | Keycloak, in the institution's realm or organisation |
| What differs in this module | Keycloak brokers to it; roles may come from its groups | Keycloak holds the logins and roles |
| What the customer must provide | OpenID Connect or SAML federation; group mappings | User list for onboarding; its role structure |
| Who it suits | Banks | Saccos, MFIs, SMEs |

## 5 · How it works

```
  staff . members . partner systems . AI clients
                     |
                     v
          +-----------------------+        institution's own
          |  KEYCLOAK             |<------ identity provider
          |  realm / organisation |        (federated, if any)
          |  per institution      |
          +-----------------------+
            |        |         |
   login (OIDC)   API tokens   step-up at the act
            |     (FAPI, mTLS)       |
            v        v               v
   Odoo . Fineract . Grafana .   mandate engine:
   portals . apps . our APIs     "approve KES 250,000?"
                                 --> re-authenticate now
                                     (passkey, OTP, or CIBA
                                      on the approver's phone)
                                 --> decision attributed to that
                                     authentication, not the session
```

## 6 · Rails and integrations

| Rail / system | Direction | Feed | Status |
|---|---|---|---|
| Odoo | out | OpenID Connect login | Planned |
| Fineract | out | OAuth 2 / OpenID Connect | Planned |
| Grafana | out | OpenID Connect | Planned |
| Institution identity providers | in | OpenID Connect or SAML federation | Planned (AC-07) |
| Messaging | out | one-time codes | Planned (AC-13) |
| Mandate engine | out | step-up results; roles | Planned |

## 7 · Regulatory position

- **Custody:** none.
- **Security baselines:** banks' minimum security standards, SASRA's
  vendor IT-audit requirements (FS-179), and the Data Protection Act's
  security duty all land here first: access management is the first
  thing an IT audit tests.
- **Data:** credentials, passkeys and tokens are Restricted. Login
  identities are Confidential.

## 8 · Controls

- **Attribution at the act** (docs/architecture.md §7). A session says who
  opened the app; step-up says who is accountable for the act.
- **Granting a role is a mandated act.** Changing who may approve money is
  itself approved by a second person (FS-144, FS-206).
- **Least privilege by default.** A new user has no roles until one is
  granted.
- **No shared credentials.** Not for staff, not for partner systems, not
  for AI clients (AC-12).
- **The record never delays a safety opening.** Break-glass access, where
  it exists, is attributed after the fact, never gated (GateKeepr
  rung 1, carried over as a principle).

## 9 · Deployment

Keycloak on Kubernetes through its operator, on Liquid's Azure Stack or on
an institution's premises (FS-032). Highly available; its outage would stop
every login.

## 10 · What it does not do

- Verify who a person is. That is the identity module.
- Hold KYC, or act as the register of customers or members.
- Decide approvals. The mandate engine does; access proves who decided.

## 11 · Open questions

FS-142, FS-144, FS-170, FS-196, FS-197, FS-201, FS-206.

## 12 · Sources

- Keycloak documentation, Server Administration Guide, version 26
  (keycloak.org), checked 2026-10-01: FAPI profiles, CIBA, step-up,
  organisations, passkeys, identity brokering, user federation, operator.
- REVIEW.md FS-132, FS-193 to FS-197.
- docs/architecture.md §2, §7.
