---
id: access-keycloak
name: Access on Keycloak — component specification
kind: spec
type: component
status: draft
released: 2026.10.15
release: R1
implements: [access]
depends_on: [messaging]
used_by: [approval-engine, kapu-core-fineract, end-of-day-runner, observability-grafana, messaging, endpoints, github, recon, back-office, staff-workspace, kapu-console]
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-194, FS-198, FS-498, FS-503, FS-588, FS-618, FS-642, FS-643, FS-645, FS-646, FS-648, FS-667, FS-674, FS-675, FS-695, FS-711, FS-750, FS-769, FS-770, FS-777, FS-792, FS-896, FS-970, FS-965, FS-983, FS-1018]
last_reviewed: 2026-10-27
---

# Access on Keycloak — component specification

How Dibon runs Keycloak as the access service (docs/modules/access.md)
for R1, Roan Capital's pilot: the version, the realms, the features used
and not used, the settings, the contracts with every service that signs
people in or checks who acted, and what must be tried on a running
instance before the build relies on it (FS-642). Sources: Keycloak's
Server Administration Guide and its list of features, for 26.8.0
(released 2026-10-01), read on 2026-10-08; Odoo's and OCA's sign-in
modules' source. Nothing here is built.

## 1 · Purpose and scope

Access answers two questions: *who is this?* at sign-in, and *is the
person acting now the person accountable for this act?* at the moment
money moves or a decision is made. It holds logins, not people: a
person's identity and KYC stay with their authority (architecture §2).

| Id | Capability | In R1 |
|---|---|---|
| AC-01 | One identity provider for the platform | Yes |
| AC-02 | Staff single sign-on for Odoo, Fineract, Grafana and our portals | Yes |
| AC-03 | Customer login: in R1, borrowers and guarantors by a code to their bound phone | Yes, codes only; passkeys with the app (OC-01, phase 2) |
| AC-05 | Step-up at the act, by level of authentication | Yes |
| AC-08 | Realms inside each institution's own instance | Yes |
| AC-09 | Roles and groups, Keycloak their one authority; no Dibon role moves money | Yes |
| AC-10 | Session rules: expiry, revocation, sign-out everywhere | Yes |
| AC-11 | Login, admin and step-up events to observability | Yes |
| AC-13 | One-time codes through our messaging service | Yes |
| AC-14 | Block now, from any channel | Yes: in R1 by a call to the institution or from the console; other channels later |
| AC-15 | Recovery only after identity verification | Yes: in R1 by staff, with the ID |
| AC-16 | Two authenticators for staff and approvers: an authenticator app and a security key or passkey | Yes |

**Out of R1:** partner and merchant API clients with FAPI profiles
(AC-04), approval on a phone for a request started elsewhere (AC-06,
CIBA), federation with an institution's own identity provider or
directory (AC-07; banks, later), tokens for AI clients (AC-12).

**Where it sits.**

```
  institution staff, approvers      borrowers, guarantors           Dibon engineers
          |                                 |                              |
          v                                 v                              v
  +------------------------------------------------------------------------------------------+
  | ACCESS                                                                                   |
  | signs in, steps up                                                                       |
  | [keycloak]                                                                               |
  |                                                                                          |
  | realm "staff"               realm "customers"            realm "ops"                     |
  | password, an authenticator  a code to the bound phone,   hardware security keys          |
  | app and a security key;     by SMS                       only; no product role,          |
  | roles and groups                                         ever                            |
  +------------------------------------------------------------------------------------------+
          | step-up             | tokens              | sign-in             | sign-in
          | (loa3)              | (OAuth)             | (OIDC)              | (OIDC)
          v                     v                     v                     v
  +------------------+  +------------------+  +------------------+  +------------------+
  | APPROVAL ENGINE  |  | KAPU CORE        |  | ODOO             |  | OBSERVABILITY    |
  | decides          |  | records          |  | back office      |  | watches, alerts  |
  | [kapu_service]   |  | [apache_fineract]|  | [odoo]           |  | [grafana]        |
  +------------------+  +------------------+  +------------------+  +------------------+
```

One-time codes to customers go out through our messaging service; every
login, admin change and step-up goes to observability as an event; the
on-call tool signs in through the "ops" realm.

**Related:** implements [access](../modules/access.md); depends on
[messaging](messaging.md) for codes; used by
[kapu-console](kapu-console.md), [approval-engine](approval-engine.md), [messaging](messaging.md),
[kapu-core-fineract](kapu-core-fineract.md),
[end-of-day-runner](end-of-day-runner.md),
[observability-grafana](observability-grafana.md),
[endpoints](endpoints.md), [github](github.md), [recon](recon.md), [back-office](back-office.md) and
[staff-workspace](staff-workspace.md); journeys
[JN-02](../journeys/manual-identity-check.md),
[JN-04](../journeys/loan-to-disbursement.md) and
[JN-05](../journeys/guarantor.md).

## 2 · Version and hosting

- **Keycloak 26.x, pinned** to the latest minor that passes §8's checks
  (26.8.0 at writing). Apache-2.0. Upgrades are rolling, one minor at a
  time, after the checks pass on the new minor.
- **One Keycloak per institution's instance** (FS-491), on Kubernetes
  through Keycloak's operator, two replicas or more, on PostgreSQL.
  Sessions persist in the database, so a restart or upgrade signs no one
  out.
- **One custom extension, ours:** an authenticator that sends a code
  through our messaging service (MS-01), because Keycloak sends no SMS
  itself. Built, tested and versioned with our code; nothing else in
  Keycloak is changed.
- **Branding per institution:** its login theme, in English and Swahili
  (OC-14).

## 3 · Realms

Four realms in each instance, so that who may do what is decided by
where an identity lives, not only by which roles it holds:

| Realm | Who | How they sign in | What it may reach |
|---|---|---|---|
| `staff` | The institution's staff and approvers; the services that act for it | A password, then an authenticator app or a security key; services by signed client assertion | The products, Fineract, Odoo, the approval engine, the institution's Grafana folder |
| `customers` | Borrowers and guarantors in R1, as code-only users (owner, 2026-10-08, FS-643); later every outside person: individuals, businesses' people and partners' people, one identity each with their roles as profiles (FS-1018; ID-25) | A code to their bound phone (ID-12), by SMS; no password | Their own pages: consents, agreements to sign, statements (MF-37, MF-38) |
| `ops` | Whoever operates the instance: Dibon's engineers, brokered from Dibon's central Keycloak, never local accounts; where the institution runs its own operations, its operators too, and Dibon's engineers only when it grants them (FS-645) | Hardware security keys only (SE-26), or the institution's own identity provider for its operators | The platform's tools: Grafana's operations views, the on-call tool, the cluster. **Never a product, never an institution's money** (FS-588) |
| `master` | No one, day to day | Sealed break-glass accounts only (SE-26) | Keycloak's own administration, every use alerted |

**A staff member who is also a customer** has an identity in each realm,
linked by ID number for the approval engine's conflict checks only (ID-26,
FS-1018).

**Why separate realms:** the products and Fineract accept tokens only
from `staff` (and the customer pages only from `customers`). A token from
`ops` is refused by every product API, so no Dibon identity can carry an
institution's payment role, by construction rather than by policy.

**Dibon's engineers, in either model** (FS-645, architecture §9): one
identity each, in Dibon's central Keycloak, brokered into the instance's
`ops` realm. Where Dibon runs the instance, the broker is on for platform
tooling; data or production access is granted just in time against a
ticket, scoped and expiring. Where the institution runs it, the broker is
off until the institution's approver grants a ticket's access, through
its own approval chain, and the institution can switch it off at any
time. Every grant is in Dibon's access register and in the instance's
Keycloak events (SE-26).

## 4 · Features used and not used

| Feature | Used | Why |
|---|---|---|
| OpenID Connect, authorization code with PKCE | Yes, for every person | AC-01, AC-02 |
| Client credentials with a signed client assertion | Yes, for every service account | Kapu MFI, the end-of-day runner, the provisioning service; keys in OpenBao |
| Step-up by level of authentication, ACR mapping, the AMR claim | Yes | AC-05: the act asks for level 3 (§5) |
| Time-based one-time codes (authenticator app) | Yes, staff and approvers | AC-16; Roan Capital's approvers (RC-32) |
| WebAuthn: security keys and passkeys | Yes, staff and approvers; Dibon engineers only by hardware key | AC-16, SE-26 |
| Our SMS code authenticator | Yes, customers | AC-13, AC-03 |
| Brute-force detection | Yes | §5 |
| Fine-grained admin permissions (v2) | Yes | An institution's administrator manages its users, never approval roles (§6) |
| User and admin events | Yes | AC-11, to Loki and the audit trail |
| Session limits, persistent sessions | Yes | AC-10 |
| Organisations | Not in R1 | For businesses and partners: each person's profiles as memberships, granted by the organisation's administrators (FS-1018; ID-25; Collect's partners too) |
| FAPI client policies, DPoP, PAR | Not in R1 | Partner APIs (AC-04) and the app, phase 2 |
| CIBA | Not in R1 | AC-06, phase 2 |
| Identity brokering, LDAP, SCIM | Not in R1 | Banks' own identity providers (AC-07); provisioning in R1 uses the admin API (§6) |
| Standard token exchange | Not in R1 | No service acts as a person in R1 |
| Recovery codes | **No** | A printed code would let someone in without the second factor; recovery needs identity verification (AC-15) |
| Password grant, implicit flow | **Never** | Credentials or tokens in the wrong place |
| Social login, Kerberos | No | Not needed |

## 5 · Settings

**Levels of authentication** (realm `staff`):

| ACR | Level | What it takes | Max age |
|---|---|---|---|
| `loa1` | 1 | Password | 10 hours |
| `loa2` | 2 | Password and an authenticator app code or a security key | 10 hours: the working day |
| `loa3` | 3 | The second factor again, now | 0: asked every time |

Every staff login is `loa2`. Anything that moves money, approves,
releases or grants a role asks for `loa3` (§7).

**Staff and approvers:**

- Both authenticators registered before first use (required actions):
  an authenticator app (time-based, 6 digits, 30 seconds, SHA-1, which
  Google and Microsoft Authenticator need) and a security key or
  passkey. Either signs in; a lost one is revoked at once (AC-16).
- Passwords: at least 12 characters, not the username, not reused from
  the last five.
- Sessions: 30 minutes idle, 10 hours at most; one session per approver
  per client.
- Brute force: five wrong attempts lock the account for 15 minutes and
  raise a security event (as approval-engine §8); twenty in a day lock it
  until an administrator, with a second administrator, unlocks it after
  an identity check.

**Customers:**

- A code of 6 digits by SMS to the phone bound at enrolment, valid 5
  minutes, three attempts, then 15 minutes locked.
- Sessions: 15 minutes idle, 1 hour at most.
- A changed SIM holds sign-in until re-verification (ID-13).

**Engineers (`ops`):** hardware security keys with attestation; 8-hour
sessions; break-glass accounts sealed and split like the backup keys
(SE-21, SE-26).

**Clients** (realm `staff` unless noted):

| Client | Kind | Notes |
|---|---|---|
| `approval-engine` | Confidential; people and step-up | Asks for `loa3` at each decision |
| `kapu-mfi` | Service account | The only writer to Fineract (kapu-core-fineract §8) |
| `end-of-day-runner` | Service account | Runs only its jobs (end-of-day-runner §8) |
| `provisioning` | Service account | The only identity that may map approval roles (§6) |
| `fineract` | Resource server | Accepts `staff` tokens addressed to it |
| `odoo` | Confidential; people | Code flow with PKCE, through OCA's `auth_oidc` module, unmodified (FS-646; K10) |
| `grafana` | Confidential; people | Role from a group: viewer, editor (§7) |
| `customer-pages` | Public with PKCE; realm `customers` | Consents, signing, statements |
| `goalert` | Confidential; realm `ops` | The on-call tool |

**Tokens:** access tokens live 5 minutes; refresh tokens rotate and are
revoked on sign-out; service accounts take a new token rather than
refresh one.

## 6 · Roles, and who grants them

- **Groups carry the roles** each institution names: for Roan Capital,
  Credit Officer, committee members, Head Office Committee, the override
  authority, finance, collections, auditor, administrator (RC-34; the
  list is its open answer 7). The approval engine reads them (AC-09,
  MD-04).
- **Joiners, movers, leavers from Odoo's Employees app** (BS-12, MF-35): a joiner gets a user
  with no roles; a leaver is disabled, signed out everywhere and has
  their authenticators removed, within minutes of the exit being
  recorded. An invitation lapses after 72 hours; an account never
  signed into is disabled after 30 days (FS-769). The provisioning service calls Keycloak's admin API.
- **Roles by position** (FS-770): each job position in Odoo carries a
  set of roles, in the institution's position-to-roles table (handbook
  HB-10), changed only with a second person's approval. Recording a
  joiner or a move asks for the position's set automatically, and for a
  move the removal of the old one in the same request; anything beyond
  the set is asked for one person at a time in the back office, with a
  reason.
- **Granting a role is a mandated act** (access §8): a request to the
  approval engine (subject `access.role.change`), decided by a second
  person at `loa3`; only then does the provisioning service map the role,
  on the request's effective date: approved ahead, a joiner's roles start
  on the start date and a mover's change on the date of the move, never
  before.
- **Dibon's own engineers** (FS-777, JN-20): the same provisioning, from
  Dibon's Odoo to Dibon's central Keycloak: a joiner gets an identity
  with no access, an exit disables it, which ends every instance at once.
  Their group memberships are code, in the platform repository: a grant
  or removal is a pull request, approved by the security lead as code
  owner and never by the person asking; the pipeline applies it to the
  central Keycloak, and the nightly comparison checks the live groups
  against the code.
- **An institution's administrator** manages its users (create, disable,
  reset after identity verification) but cannot map an approval role:
  fine-grained admin permissions withhold it.
- **The nightly comparison:** every role mapping in Keycloak is checked
  against an approved `access.role.change`; a mapping without one is an
  alert, like Fineract's (approval-engine §9). Every enabled staff user is
  also checked against a current employee record in Odoo; a user without
  one, or past its departure date, is an alert (FS-769).

## 7 · Contracts

**Step-up at the act** (with the approval engine, AC-05, MD-10):

1. The engine sends the approver to Keycloak with `acr_values=loa3`,
   `max_age=0`, and a `nonce` bound to the request id and its content
   hash.
2. Keycloak asks for the second factor only; the session already holds
   the first.
3. The engine checks the ID token: the issuer is `staff`, the audience
   is the engine, the subject is the approver the step names, `acr` is
   `loa3`, `auth_time` is after the ask, the nonce matches; and records
   `amr` (which factor), the time and the token's hash with the decision.
4. An approval from an email link (MD-18) opens the engine's page, which
   starts the same step-up.

The end-of-day runner's overrides (end-of-day-runner §8) and every
`access.role.change` use the same contract.

**Service accounts:** client credentials with a signed client assertion
(private key in OpenBao); tokens addressed to one audience.

**Fineract:** validates `staff` tokens and maps the token's user to its
own user (§8, K9); staff hold read-only Fineract roles, if any
(kapu-core-fineract §13).

**Grafana:** generic OAuth; its role taken from a group (viewer or
editor); an institution's users see only its folder (RO-19).

**Events:** user and admin events streamed to Loki (AC-11) and, as
signed events, to the audit trail (RO-27), names following the event
bus spec when written. No code, password or token in any of them
(SE-18).

## 8 · Security

- **Realms decide reach** (§3). Product APIs refuse every token not from
  `staff`, and not addressed to them.
- **Who can change Keycloak itself.** A Keycloak administrator could, in
  principle, map a role. So no person holds `master` day to day;
  break-glass is sealed and alerted (SE-26); every admin event touching
  roles is alerted; and the nightly comparison (§6) catches a role
  mapped outside an approved request.
- **Its database is Restricted as a whole:** password hashes,
  authenticator secrets and sessions live there. Reached only by
  Keycloak; encrypted at rest (SE-08); backed up encrypted (SE-10).
- **Secrets** (client keys, the SMTP and messaging credentials) come from
  OpenBao, never from configuration files.
- **Logs** carry no code, password or token (SE-18).

## 9 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| Password hashes, authenticator secrets, passkeys, sessions | Restricted | While the account exists | Every user's |
| Login, admin and step-up events | Confidential | A year in Keycloak; longer in the audit trail (SE-18) | Who signed in, when, from where |
| Users: username, email, phone (`customers`) | Confidential | While the account exists | Borrowers' and guarantors' contact points |

## 10 · Quality and metrics

- **Tier 1** ("lets people in"). The sign-in page within a second at the
  95th percentile; a step-up round trip within 10 seconds, the person's
  own time excluded (proposed).
- **Against NIST SP 800-63B:** `loa2` meets AAL2; `loa3` is AAL2 with an
  authenticator app and AAL3 with a hardware key.
- **Metrics:** sign-ins, failures, lockouts, step-ups by result, codes
  sent (Keycloak's user-event metrics).
- **Alerts** (observability-grafana §4): lockouts spiking (2); codes slow
  (2); an admin event touching roles (§8).

## 11 · Threats

| Threat | For example | The answer |
|---|---|---|
| Spoofing | A staff password phished | A second factor at sign-in; level 3 at the act; engineers on hardware keys, which phishing cannot replay |
| Spoofing | A customer's code taken by a SIM swap | An IMSI change holds sign-in until re-verification (ID-13) |
| Spoofing | Credential stuffing | Brute-force detection; lockouts alerted |
| Tampering | An administrator maps a role | Only provisioning maps approval roles; the nightly comparison (§6); role changes alerted |
| Repudiation | "That wasn't me" | Events kept, and signed into the audit trail |
| Information disclosure | A token stolen | Five-minute access tokens; refresh tokens rotated; DPoP with the app (phase 2) |
| Elevation of privilege | A Dibon engineer reaches an institution's money | Separate realms; product APIs refuse `ops` tokens (K8) |

## 12 · Checks before the build

On a running 26.8 instance, before the build relies on each (FS-642):

| # | Check | Settles |
|---|---|---|
| K1 | A `loa3` request with `max_age=0` asks only for the second factor; the ID token carries `acr=loa3`, a fresh `auth_time` and `amr` | AC-05, MD-10 |
| K2 | Google and Microsoft Authenticator codes accepted at 6 digits, 30 seconds, SHA-1; a phone clock 40 seconds out | AC-16, RC-32 |
| K3 | A staff user with one authenticator registered cannot finish signing in until the second is | AC-16 |
| K4 | Five wrong codes lock for 15 minutes and raise an event; twenty need two administrators | AC-15 |
| K5 | Our SMS authenticator: the code arrives through messaging, expires at 5 minutes, locks after three attempts | AC-13 |
| K6 | A leaver in Odoo HR: disabled, signed out and authenticators removed within minutes | AC-10, MF-35 |
| K7 | An institution administrator cannot map an approval role; the provisioning service can | AC-09 |
| K8 | An `ops` token is refused by Fineract, the approval engine and Kapu MFI | AC-09, FS-588 |
| K9 | Fineract under OAuth maps the token's user to its own user, and no Fineract approve permission is reachable | KC-08 |
| K10 | Odoo signs in by the code flow through OCA's `auth_oidc`, unmodified, on the Odoo version we deploy | AC-02 |
| K11 | Grafana's role from a group; one institution's users see only its folder | AC-02, RO-19 |
| K12 | A rolling restart and a minor upgrade sign no one out | AC-10 |
| K13 | Events reach Loki with no code, password or token in them | AC-11, SE-18 |
| K14 | The nightly comparison flags a role mapped outside an approved request | AC-09 |

## 13 · Open questions

**For the owner:**

1. Whether staff use Fineract's own screens (kapu-core-fineract §13),
   which decides whether Fineract needs a staff client at all.
2. Which bastion records engineers' sessions where Dibon runs the
   instance: Warpgate to evaluate, signing in through this Keycloak
   (FS-645, FS-695).

**For Roan Capital:**

1. Its role list (open answer 7) and who its administrator is.
2. Session lengths that suit its working day.
