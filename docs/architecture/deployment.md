---
id: architecture-deployment
name: Architecture deployment — sites, the fleet, and what is central
kind: architecture
version: 0.1.0
owner: Solution architect
classification: Internal
review_ids: [FS-032, FS-359, FS-466, FS-491, FS-645, FS-649, FS-651, FS-655, FS-656, FS-657, FS-658, FS-659, FS-660]
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

## 2 · Availability models

**Within a site, every tier-1 component fails over by itself, in
seconds:** PostgreSQL through CloudNativePG (Apache-2.0) with a
synchronous standby, so a server's loss loses nothing; Kafka on three
brokers, each message held by three of them; OpenBao on three nodes;
Keycloak and our services on two replicas or more (FS-655).

**Across sites, each institution chooses** (FS-651, FS-655):

| Model | The second site | If the first is lost: data | Back in | Who decides to fail over | Suits |
|---|---|---|---|---|---|
| Cold standby | Backups and the code to rebuild; nothing running | Minutes, from continuous archiving (SE-22) | About a day | People | Small Saccos and lenders that can wait a day |
| **Warm standby (the default)** | Databases replicating; services at minimum size, grown on failover | At most 5 minutes | 4 hours | People | Most institutions; what the recovery objectives in platform-security §3 assume |
| Hot standby | Everything at full size | At most 5 minutes | About 30 minutes | The on-call engineer, from the runbook | Larger Saccos, banks |
| Hot, automatic | Everything at full size, and a small witness at a third location | At most 5 minutes; none if the sites are near enough to replicate synchronously | About 5 minutes | Automatic: the witness keeps both sites from believing they are live | Banks that need it |

**Active-active only where it is safe.** Multi-writer PostgreSQL (pgEdge's
Spock, EDB Postgres Distributed) settles conflicting writes after the
fact, which a ledger cannot allow: two sites could accept the same money
twice. Consensus databases (YugabyteDB, CockroachDB) avoid conflicts but
need three sites, add a round trip between sites to every write, and are
not supported by Fineract or Keycloak. Kafka stretched across sites needs
three locations; MirrorMaker 2 copies asynchronously and suits recovery.
So:

| Runs in both sites at once | Has one writer, and fails over |
|---|---|
| The edge, DNS, stateless services, read-only copies for reports and insights, observability (each site watches the other); later, Keycloak, which supports multi-site where the database replicates synchronously between nearby sites | The ledger (Fineract), the approval engine's records, Kafka's writes, OpenBao |

**Why not a 5-minute recovery for everyone:** money does not stop when we
do. Collections land in the institution's own paybill whatever our state,
and are caught up from M-Pesa's records; payouts queue (safe mode,
SE-24). A server's loss, the common case, already recovers in seconds; a
site's loss is rare, and a team of four should not run the hardest kind
of database where its failure is a wrong balance.

**Commercially, availability is its own choice,** beside the deployment
option, the managed level and the support tier, as managed levels were
kept apart from support tiers (FS-360); each support tier may suggest a
default. Each model's recovery objectives go into the contract.

## 3 · The offline copy

How the last copy is kept safe (FS-651; platform-security SE-20):

- **Encrypted before it leaves** the backup domain, with keys production
  never holds (§4); without three key holders the media is unreadable.
- **Written by the backup domain, never by production,** and connected
  only to be written or restored.
- **Kept in a third place,** away from both sites: a bank safe-deposit box
  or a secure storage provider.
- **Moved by two people,** in sealed, numbered bags, with a custody log
  both sign, and an entry in the access register (SE-26).
- **Each copy's hash** recorded in the audit chain when it is made
  (recon RO-24), and checked on restore.
- **A weekly copy,** keeping four weekly and twelve monthly copies
  (proposed); media past retention wiped and destroyed, with a
  certificate.
- **Separate for each institution,** with its own keys. On an
  institution's premises, the institution keeps its own offline copy.

## 4 · Unlocking a backup

**The recovery vault** (platform-security SE-21, FS-656 to FS-659): a
separate OpenBao, kept switched off and sealed, holding only the key that
wraps every backup's encryption key. It opens with **any three of five
shares** (Shamir's secret sharing), each share encrypted, as it is made,
to one holder's hardware security key and to their backup key. The
wrapping key never leaves the vault.

**The five holders:** the CTIO; two senior engineers; the compliance and
risk officer (until hired, the administrator); and one outside Dibon,
proposed to be the legal partner under a custody agreement, so the
company can still open its own backups if its people cannot. Each holds
their encrypted share as a file in the share register and as a printed
QR code in a sealed, numbered envelope in the safe; either is useless
without their hardware key and its PIN.

**The process:**

1. **A reason, recorded:** an incident, the quarterly restore test or the
   drill, as a ticket.
2. **The request:** the initiator, usually the on-call engineer, names the
   institution, the backup, the point in time and why.
3. **Approval:** two approvers other than the initiator, each signing with
   a hardware key or an authenticator code (FS-659). For an incident, the
   CTIO or deputy; if the restore replaces the institution's live data,
   also its named contact. For a test or drill, Dibon's approval, and the
   institution told.
4. **A clean environment,** built from code (SE-23); never production.
5. **The vault started there,** still sealed.
6. **Three holders, none of them the initiator,** each decrypt their own
   share on their own machine (hardware key in, PIN, touch) and enter it:
   in person at the station for tests and drills; through the bastion
   (SE-26) on a recorded call in an incident.
7. **The vault unseals on the third share,** unwraps that one backup's key
   for the restore, and nothing else.
8. **The restore checked:** the backup's hash against the audit chain;
   the trial balance; reconciliation against the rails.
9. **Promoted or destroyed:** live in an incident; destroyed after a test.
10. **The vault sealed and switched off** (one command).
11. **Recorded:** the vault's audit log (every share entered, the unseal,
    every key unwrapped, the seal) on write-once storage; the request
    record (initiator, approvers, the three holders, from where); the
    institution told.

| If | Then |
|---|---|
| A holder loses their hardware key | Their backup key opens the same share; the lost key is revoked |
| A holder leaves, or a share may be exposed | Three holders re-key the vault: five new shares for the new list; the old stop working |
| Our systems are down | The envelope, the holder's hardware key and an offline laptop suffice |
| Fewer than three holders reachable | No unlock; hence five holders and one outside Dibon |

**Not TOTP for shares** (FS-659): a time-based code proves possession to
a server that holds the same secret; it cannot decrypt anything, so the
shares would have to sit in one service that whoever controls it could
empty. TOTP may sign approvals; shares stay on hardware keys, with a
passphrase-encrypted share as the only fallback.

The unlock is practised as training: docs/training/key-holder.md.

## 5 · Who carries a hardware security key

| Who | Carries | Why |
|---|---|---|
| Every Dibon engineer with access to production or the `ops` realm | Two hardware keys: one in use, one registered backup | SE-26; the `ops` realm signs in by hardware key only (access-keycloak §3) |
| The five recovery key holders | Two hardware keys each, with OpenPGP, since their shares are encrypted to them | §4 |
| The institution's approvers and administrators | An authenticator app (R1), and a security key or a passkey on their phone | AC-16; step-up at the act (AC-05) |
| The institution's other staff | An authenticator app or a security key | Staff sign in at level 2 (access-keycloak §5) |
| Borrowers, guarantors, members | Nothing: a code to their bound phone | access-keycloak §3 |

**Which devices** (research on 2026-10-08; prices as listed that day):

| Device | What it does | In Kenya | Recommended for |
|---|---|---|---|
| **YubiKey 5C NFC** (Yubico) | FIDO2 and passkeys, OpenPGP, PIV, one-time codes; USB-C and NFC for phones | Stocked by Nairobi resellers; Twixt Technologies listed it at KSh 12,000, and the 5 NFC (USB-A) at KSh 9,500; others out of stock or dearer | **Engineers and key holders: the standard.** OpenPGP for the shares; NFC for phones |
| YubiKey 5 NFC | The same, USB-A | As above | Where machines have USB-A only |
| Nitrokey 3C NFC | FIDO2, OpenPGP; open-source firmware that can be updated | Imported from Germany | The alternative if YubiKey stock fails |
| YubiKey Security Key C NFC; Feitian ePass FIDO; Token2 PIN+ | FIDO2 and passkeys only, no OpenPGP | Yubico's from local resellers; the others imported | **Approvers and administrators** without a passkey-capable phone: cheaper, and they hold no shares |
| A passkey on the person's own phone | FIDO2, in the phone's secure hardware | Any recent Android or iPhone | **Approvers by default:** no device to buy |
| Biometric keys (YubiKey Bio) | FIDO2 by fingerprint, no OpenPGP | Listed by some resellers | Not for key holders |

Buy from an authorised reseller, keep each device's serial number in the
asset register, and register two per person before the first is needed.
