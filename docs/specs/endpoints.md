---
id: endpoints
name: Endpoints — devices, their protection, and a lost device
kind: spec
type: component
status: draft
release: R1
implements: [platform-security]
depends_on: [access-keycloak, observability-grafana]
used_by: []
version: 0.1.0
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-458, FS-459, FS-464, FS-708, FS-709, FS-710, FS-711, FS-712, FS-769]
last_reviewed: 2026-10-12
---

# Endpoints — devices, their protection, and a lost device

How the devices people work on are protected, watched and recovered,
for Dibon and for the institutions we serve (FS-708 to FS-712). Two
tiers: managed security through Liquid, Sophos with Microsoft Intune, by
default; our own, on Wazuh, for a client who prefers it or cannot pay for
Sophos. Nothing here is built or bought yet: every behaviour is
**designed**.

## 1 · Purpose and scope

What protects a device, what may be on it, and what happens when one is
lost.

| Id | Capability | In R1 |
|---|---|---|
| SE-14 | Endpoints: protection, disk encryption, device management | Proposed for Dibon's own devices before R1 go-live (FS-708); institutions' in R2 |
| SE-13 | Managed detection and response, round the clock | No: R2, bought through Liquid; our rota watches until then |
| SE-18 | Security events collected and kept | Yes |
| AC-16 | Two authenticators for staff and approvers | Yes |
| OC-19 | Field devices bound, wiped remotely | No: R4, with the field app |

**Out of R1:** field officers' phones (R4); our own security offering on
Wazuh, until a client asks for it (FS-712).

**Where it sits.**

```
  +--------------------------+      +--------------------------+      +--------------------------+
  | DEVICE MANAGEMENT        |      | DEVICE                   |      | ENDPOINT PROTECTION      |
  | sets and checks policy   |--1-> | a staff laptop or phone  |--2-> | blocks and reports       |
  | [intune_or_fleet]        |      | [endpoint]               |      | [sophos_or_wazuh]        |
  +--------------------------+      +--------------------------+      +--------------------------+
                                                  |                                 |
                                                  | 3                               | 4
                                                  v                                 v
  +--------------------------+      +--------------------------+      +--------------------------+
  | ACCESS                   |      | BASTION                  |      | MANAGED DETECTION        |
  | signs in, steps up       | <-5--| lets people in,          |      | watches, isolates        |
  | [keycloak]               |      | records them             |      | [sophos_mdr_or_wazuh]    |
  |                          |      | [warpgate]               |      |                          |
  +--------------------------+      +--------------------------+      +--------------------------+
                                                                                    |
                                                                                    | 6
                                                                                    v
                                                                      +--------------------------+
                                                                      | ON-CALL                  |
                                                                      | pages the rota           |
                                                                      | [goalert]                |
                                                                      +--------------------------+
```

| # | What crosses |
|---|---|
| 1 | Policy (encryption, updates, screen lock, no local administrators), and the device's compliance |
| 2 | Events and verdicts: a file blocked, a process stopped, a change to a watched file |
| 3 | A session to production, only from an enrolled, compliant device, with a hardware key |
| 4 | Events, for detection |
| 5 | Sign-in and step-up |
| 6 | A confirmed threat, and what was done: a machine isolated, a process stopped |

**Related:** implements [platform-security](../modules/platform-security.md);
depends on [access-keycloak](access-keycloak.md) and
[observability-grafana](observability-grafana.md); used by none yet;
technology register [Security](../architecture/technology.md); the
lost-laptop runbook in [the operating model](../operating-model.md).

## 2 · The rule: no customer data on a device

**No institution's customer data is kept on a laptop, a desktop or a
phone**, ours or theirs, except where a journey needs it for minutes and
says so (FS-710):

- Institutions' data stays in their own instance; staff work in the
  browser, engineers through the bastion on masked views (architecture
  §9), and Restricted fields are encrypted one by one (SE-27).
- Documents travel as links to our own pages, never as attachments
  (architecture §7); a bulk export goes to the institution through the
  portal or SFTP (identity ID-17), never to a laptop.
- **The two exceptions, both bounded:** a field officer's offline
  captures, encrypted in the app until they sync (OC-17); and the bank
  file on the institution's designated machine, deleted after upload
  (JN-13).
- **Real data never in testing or training:** test and training use the
  identity simulator and generated data (ID-20).

A lost device is then a device to cut off, not data to recover.

## 3 · Devices, by class

| Class | Whose | Baseline | Watched by |
|---|---|---|---|
| Staff and engineers' laptops | Dibon | Enrolled in device management; disk encryption; updates within the times SE-11 sets; screen lock; no local administrators; endpoint protection; hardware keys for anything that reaches production (SE-26) | Managed detection; our rota until it starts |
| Servers and Kubernetes nodes | Dibon, or the institution on its premises | Endpoint protection beside Falco: Falco for containers, the endpoint agent for the host; hardened to the CIS Benchmarks (SE-04) | Managed detection |
| The key holders' offline laptop | Dibon | Never networked; kept in the safe; holds tools, never keys (deployment §4) | Its custody log |
| The designated bank-file machine | The institution | Bank work only; encryption, updates, protection; no email or browsing (JN-13) | The institution, with our minimum agreed at onboarding |
| Field officers' phones | The institution, enrolled by us | Android Enterprise; bound to the officer; wiped remotely (OC-19) | Device management |
| The institution's other staff devices | The institution | Its own policy, with our minimum for any device that reaches the platform: a supported system, updated, encrypted, locked, protected | The institution |

## 4 · Two tiers

| | Managed, through Liquid: the default | Our own: for a client who prefers it or cannot pay for Sophos |
|---|---|---|
| Endpoint protection | Sophos | Microsoft Defender Antivirus on Windows; ClamAV on Linux |
| Detection | Sophos MDR: people watching round the clock, able to isolate a machine on their own | Wazuh, one per institution's instance: file-change monitoring, vulnerability detection, configuration checks, log analysis, automatic blocking for well-understood attacks |
| Device management | Microsoft Intune | Fleet, to evaluate: its core is MIT; some features are in its paid edition |
| Who watches | Sophos's operations centre, then our rota | Our rota in business hours; a severity 1 pages on-call (flows §5) |
| Licence | Bought | Wazuh's core is GPL-2.0, run unmodified and separately, by decision (FS-712); Defender comes with Windows |

We start with the managed tier while the customer base grows, for Dibon's
own estate and as the default for institutions (FS-712). The own tier is
offered only when a client asks or cannot pay, and stated plainly:
outside business hours it depends on someone answering a page, not on
someone already watching.

## 5 · A lost, stolen or damaged laptop

1. **Reported within the hour,** to the service desk or on-call, without
   blame.
2. **Cut off:** the person signed out everywhere (AC-10); the device
   revoked in device management, locked and wiped; its GitLab tokens
   revoked; if its hardware key went with it, the key revoked and its
   registered backup used (SE-26).
3. **Assessed:** device management shows whether it was encrypted and
   locked. Encrypted and locked is not a breach. Unencrypted with personal
   data is: as a controller we tell the Data Commissioner within 72 hours;
   as a processor, the institution within 48 (Data Protection Act s.43;
   privacy.md).
4. **Replaced:** a new device enrolled before it is used; the person
   signs in, pulls the code, and restores any private folder from its
   backup (§10).
5. **Recorded:** the incident in the desk, the device in the asset
   register, the lesson in the review.

A damaged laptop follows steps 4 and 5. A leaver's devices go through
JN-20.

## 6 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| Device inventory and compliance state | Internal | While the device is in use, and a year after | Staff names, device owners |
| Endpoint and detection events | Confidential | 12 months (proposed) | Staff activity on their devices |
| The lost-device record | Internal | 7 years, with the incident | The person who reported it |

Staff are told what is monitored on their devices, and why (privacy
PR-13).

## 7 · Quality and metrics

- **Every device that reaches production is enrolled, encrypted and
  compliant:** 100%, shown on a dashboard.
- **Updates:** critical fixes within the times SE-11 sets.
- **A lost device cut off within an hour** of the report.
- **Alerts:** a device out of compliance (3); protection switched off or
  silent for a day (2); a confirmed threat (1) (observability-grafana §4).

## 8 · Threats

| Threat | For example | The answer |
|---|---|---|
| Spoofing | A stolen laptop used to reach production | Production only through the bastion, with a hardware key the laptop does not hold (§1, 3) |
| Tampering | Malware changes a bank file before upload | The designated machine; the line-by-line check before release (JN-13) |
| Repudiation | Who did what on a device is disputed | Device events kept; sessions recorded at the bastion |
| Information disclosure | A laptop lost with customer data on it | The rule in §2; disk encryption; remote wipe |
| Denial of service | Protection blocks work, so people turn it off | Exclusions reviewed and recorded; protection silenced raises an alert |
| Elevation of privilege | A user installs tools as administrator | No local administrators; software from a managed list |
| Linkability, identifiability (LINDDUN) | Monitoring reveals more about staff than security needs | Only security events collected; staff told; access to them logged |

## 9 · Checks before the build

| # | Check | Pass |
|---|---|---|
| E1 | A lost-laptop drill: report to wipe | Cut off within an hour; every step in the record |
| E2 | A device without encryption tries the bastion | Refused |
| E3 | With Liquid: Sophos isolates a test machine and calls us | Within the time agreed |
| E4 | Own tier: a Wazuh rule fires on a test attack | On-call paged at severity 1 |
| E5 | A replacement laptop restores a person's work | From GitLab and the private folders' backup, within a day |
| E6 | The monitoring notice is shown to staff | In the staff handbook, acknowledged |

## 10 · Open questions

1. **For Liquid:** which machines Sophos covers, what it may do without
   asking, where its telemetry is processed, how fast it calls us, and
   the price per machine (docs/outreach/liquid-partner-request.md).
2. **For the owner:** Dibon's own devices under SE-14 before R1 go-live,
   though SE-14 is otherwise R2 (FS-708).
3. **For the owner:** where Dibon's own email and files live, and how
   they are recovered (FS-710).
4. **For the owner:** a backup for this repository's private folders,
   encrypted and in Kenya, never in git (FS-710).
5. Fleet's free edition: whether disk-encryption enforcement and the
   other policies we need are in it.
6. How the bastion learns that a device is enrolled and compliant: a
   device certificate issued by device management, checked at the
   bastion, is the design to test (E2).
