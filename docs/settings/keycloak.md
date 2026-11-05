---
id: settings-keycloak
name: Keycloak — baseline settings for ACCESS in every deployment
kind: guide
status: living
law: LR-17
released: unreleased
owner: Security lead
classification: Internal
review_ids: [FS-1050, FS-1055, FS-1056, FS-1094, FS-1101]
last_reviewed: 2026-11-05
---

# Keycloak · baseline settings

## 1 · What this covers

**ACCESS:** Keycloak 26.x, one in each institution's instance, on
Kubernetes through Keycloak's operator. Why it is built as it is, its
realms, roles and contracts, are [access-keycloak](../specs/access-keycloak.md);
its settings are here, once (FS-1050). **Owner:** the security lead, as
nearly every setting is a security control. Each deployment's own values
are its file, `deployments/<deployment>/keycloak.md`.

## 2 · Settings

| Id | Setting | Value | Class | Why | Enforced by | Checked by |
|---|---|---|---|---|---|---|
| S01 | Version | Keycloak 26.x, the latest minor that passes the checks before the build (26.8.0 at writing), the same across the fleet; upgraded one minor at a time, rolling | Mandatory | One version to test and support; upgrades without signing anyone out | The operator's resource in git; Kyverno (our registry's signed image) | K12 |
| S02 | One per instance | One Keycloak in each institution's instance, never shared | Mandatory | Isolation per institution (FS-491) | The instance's folder in git | Configuration record |
| S03 | Replicas | 2 | Default: 2 or more | A restart or a node's loss signs no one out | The operator's resource; Kyverno | Configuration record |
| S04 | Database | PostgreSQL, the Access cluster, Keycloak's database alone, encrypted at rest; sessions kept in it | Mandatory | Restricted data as a whole (passwords, authenticator secrets, sessions); sessions survive restarts | The operator's resource; the cluster's settings | K12; configuration record |
| S05 | Extensions | Only ours: the SMS code authenticator, through our messaging service | Mandatory | Nothing else in Keycloak changed, so upgrades stay clean | The image we build | Configuration record |
| S06 | Realms | `staff`, `customers`, `ops` and `master`; no other | Mandatory | Where an identity lives decides what it may reach (access-keycloak §3) | Realm configuration from git | Nightly read-back |
| S07 | `master` realm | No day-to-day user; break-glass accounts only, sealed and split as the backup keys; every use alerted | Mandatory | Whoever administers Keycloak could map a role | Realm configuration from git; the alert rule | Nightly read-back; the alert |
| S08 | `ops` realm | Dibon's engineers brokered from Dibon's central Keycloak, never local accounts; hardware security keys with attestation; or the institution's own identity provider for its operators | Mandatory | One identity per engineer, removed everywhere at once; no password to steal | Realm configuration from git | Nightly read-back |
| S09 | Dibon's broker into `ops` | On, for platform tooling, where Dibon runs the instance; off until the institution's approver grants a ticket's access, where it runs it | Per deployment | Who operates the instance decides (architecture README §9) | Realm configuration from git | Nightly read-back; the access register |
| S10 | Who product APIs trust | Tokens from `staff` only, addressed to the API (`customers` for the customer pages); an `ops` token refused | Mandatory | No Dibon identity can carry an institution's payment role, by construction | Our services' code; realm configuration | K8 |
| S11 | Levels of authentication (`staff`) | `loa1` password, 10 hours; `loa2` password and a second factor, 10 hours; `loa3` the second factor again, maximum age 0 | Mandatory | Step-up for acts that move money (AC-05) | Realm configuration from git | K1 |
| S12 | Level asked | Every staff sign-in at `loa2`; anything that moves money, approves, releases or grants a role at `loa3` | Mandatory | AC-05; the approval engine asks it at each decision | Our services' code; client settings | K1 |
| S13 | Staff authenticators | Both registered before first use: an authenticator app (6 digits, 30 seconds, SHA-1, as Google and Microsoft Authenticator need) and a security key or passkey; a lost one revoked at once | Mandatory | Two factors always (AC-16) | Required actions, from git | K2, K3 |
| S14 | Staff passwords | 12 characters or more; not the username; not one of the last five | Default: 12 or more characters, never fewer; history of five or more | A floor; an institution may ask for more | Password policy, from git | Nightly read-back |
| S15 | Staff sessions | 30 minutes idle; 10 hours at most | Default: idle 30 minutes or less, 10 hours or less | A working day, and no unattended session | Realm configuration from git | Nightly read-back |
| S16 | Approver sessions | One per approver per client | Mandatory | An approval comes from one place at a time | Client settings, from git | Nightly read-back |
| S17 | Brute force | Five wrong attempts lock for 15 minutes and raise a security event; twenty in a day lock until an administrator, with a second, unlocks after an identity check | Mandatory | Guessing stopped, and seen (AC-15) | Realm configuration from git | K4 |
| S18 | Customer codes | A code from an authenticator app, offered at the first sign-in once an SMS code has proved the bound phone, and the default once registered (6 digits, 30 seconds, as S13); for those without one, 6 digits by SMS to the phone bound at enrolment, valid 5 minutes; three wrong attempts either way, then 15 minutes locked; a lost app removed only after the customer is verified again, never by recovery codes (FS-1094) | Mandatory | AC-13; the SIM binding (ID-12) | Our authenticator's configuration, from git | K5 |
| S19 | Customer sessions | 15 minutes idle; 1 hour at most | Default: idle 15 minutes or less, 1 hour or less | A shared or lost phone | Realm configuration from git | Nightly read-back |
| S20 | A changed SIM | Holds sign-in until the customer is verified again | Mandatory | SIM-swap fraud (ID-13) | Our authenticator | K5 |
| S21 | Engineer sessions (`ops`) | 8 hours | Default: 8 hours or less | A shift, not a week | Realm configuration from git | Nightly read-back |
| S22 | Tokens | Access tokens 5 minutes; refresh tokens rotated, revoked on sign-out; service accounts take a new token rather than refresh | Mandatory | A stolen token is short-lived | Realm and client settings, from git | Nightly read-back |
| S23 | Service accounts | Client credentials with a signed client assertion, its key in OpenBao; one account per service, its own roles only | Mandatory | No shared secret in a file; least privilege | Client settings, from git; OpenBao | K7, K9 |
| S24 | Clients | Only those the deployed components need, each of the kind access-keycloak §5 lists (the approval engine, the lending service, the end-of-day runner, provisioning, Fineract, Odoo, Grafana, the customer pages, the on-call tool) | Mandatory | No client left over for someone to use | Client settings, from git | Nightly read-back |
| S25 | Administration | Fine-grained admin permissions (v2) on: an institution's administrator manages its users, never approval roles; only the provisioning service maps approval roles | Mandatory | Separation of duties (AC-09) | Realm configuration from git | K7 |
| S26 | Role watch | Every admin event touching roles alerted; role mappings compared each night with approved requests | Mandatory | A role mapped outside a request is found the same night | The alert rule; the nightly comparison | K14 |
| S27 | Events | User and admin events on, to Loki and the audit trail; no code, password or token in any log | Mandatory | AC-11, SE-18 | Realm configuration from git | K13 |
| S28 | Secrets | Client keys, SMTP and messaging credentials from OpenBao, never from a configuration file | Mandatory | Rules, Dibon 2 | The operator's resource; OpenBao | Gitleaks; configuration record |
| S29 | Never on | Recovery codes; the password grant and the implicit flow; social login; Kerberos | Mandatory | A way in without the second factor, or credentials and tokens in the wrong place | Realm and client settings, from git | Nightly read-back |
| S30 | Organisations | Off in R1; on when businesses' and partners' people arrive, each person's profiles as memberships (FS-1018) | Default: off until ID-25 | The identity model's next step | Realm configuration from git | Nightly read-back |
| S31 | Login theme | The institution's: its logo and colours, in English and Swahili; the plain look until it has a theme (design-system §6) | Per deployment | The institution's customers see its brand (OC-14) | The theme, from git | A look at each release |
| S32 | Staff roles | The positions, folded to the institution's staff; which roles each position holds | Per deployment | Its own organisation, within the separations the approval engine enforces (FS-982) | Realm configuration from git (the roles); the people and their grants stay in Keycloak, by the provisioning service | K7, K14 |
| S33 | The institution's administrators | Two, named by role, who manage its users | Per deployment | No one administrator alone (JN-18) | Its decision, recorded; the grants by the provisioning service | K7 |
| S34 | SMS sender | The institution's sender ID, through our messaging service | Per deployment | Customers know who is writing | Messaging's configuration, from git | K5 |
| S35 | Temporary accounts | Each temporary person's account carries its sponsor and an end date, set when it is made; a daily job disables every account past its end date and raises an event; an extension is a new approval (access-keycloak §6, FS-1101) | Mandatory | No outsider keeps access past their work | The account's attributes; the daily job, from git | The disabled accounts' events |

## 3 · How it is applied

- **The server** (S01 to S05, S28) by Keycloak's operator, from its
  resource in `platform`: version, replicas, database, image, secrets'
  references.
- **The realms** (S06 to S27, S29 to S34) as configuration from git,
  applied by a job after each change and never by hand in Keycloak's
  screens. Proposed tool: keycloak-config-cli (Apache-2.0), which updates
  existing realms, where the operator's realm import only creates them;
  to evaluate and enter in the technology register.
- **Not in git:** the institution's people, their grants and their
  authenticators. Those are its business configuration (settings
  README): people come from its HR, grants through the provisioning
  service on approved requests.

## 4 · How it is checked

- **Before the build relies on it:** checks K1 to K15 on a running
  instance (access-keycloak §12), on the version in S01.
- **Each night:** the realms exported and compared with git, and role
  mappings with approved requests (S26); a difference is drift, alerted
  as the configuration record's is (service management §3).
- **Each deployment's file** (`deployments/<deployment>/keycloak.md`)
  says when it was last checked, and how.

## 5 · Changing this baseline

A normal change, approved by the operations lead and the security lead
(service management §2). A new or tighter **mandatory** setting reaches
every deployment at its next window, its institution told when they can
see it; a **default** changed reaches only deployments that have not
chosen otherwise; a new **per deployment** setting is set in each
deployment's file before the change goes out.

## 6 · Open questions

1. keycloak-config-cli, or another way to apply realms from git: to
   evaluate (FS-1050).
2. Whether the nightly read-back is the configuration record's job or
   its own (service management §3).

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
