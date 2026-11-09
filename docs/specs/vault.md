---
id: vault
name: The document vault — build specification
kind: spec
type: build
status: draft
law: LR-17
released: unreleased
release: R1
implements: [identity]
depends_on: [access-keycloak, event-bus-kafka]
used_by: [lending-service, back-office, lending-partners]
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-491, FS-500, FS-525, FS-527, FS-532, FS-537, FS-1022, FS-1069, FS-1070, FS-1071, FS-1072, FS-1073, FS-1140, FS-1148]
last_reviewed: 2026-11-09
---

# The document vault — build specification

Where every document that carries personal data is kept, one vault per
institution in its own instance (FS-500, FS-527): identity documents and
KYC and KYB evidence, collateral papers, signed agreements and
guarantees, statements, notices, staff contracts. Each file arrives
checked and scanned, is kept unchanged, encrypted under the
institution's keys, read only through the vault with every read logged,
sent out only as a link on our own network, and deleted when its type's
retention ends, with its replicas and backups. Every other system keeps a
link and our reference, never the file. R1 needs it for Roan Capital's
onboarding and collateral. Nothing is built: every behaviour here is
**designed**.

## 1 · Purpose and scope

Where does a document with someone's personal data live, who may see it,
and how is it gone when the law says it must be?

| Id | Capability | In R1 |
|---|---|---|
| ID-15 | The document vault: one per institution, object storage, each file encrypted under keys in OpenBao, checksummed, locked for its retention then deleted, every view logged; uploads type-checked, scanned and images re-encoded | Yes |
| ID-17 | Sharing documents out: a single-use link to our own page for a person; the portal, the API or SFTP for an organisation; every share and download logged | Yes, the person's link and SFTP for regulator and audit exports |
| ID-27 | Documents in every channel through one interface: To sign, Signed, Statements and receipts, Notices, by profile | No: the borrower's own pages in R1 (customer pages, to write); the rest with each channel |

**Out of R1:** uploads from the field app (omni-channel OC-17); partners'
files by API (lending-partners); documents with no personal data, which
stay in Odoo (architecture §6, "Where a document lives").

**Where it sits.**

```
  +---------------------+  +---------------------+  +---------------------+  +---------------------+
  | STAFF WORKSPACE     |  | CUSTOMER PAGES      |  | LENDING SERVICE     |  | BACK-OFFICE GATEWAY |
  | uploads, views      |  | uploads, downloads  |  | files evidence      |  | files signatures    |
  | [odoo]              |  | [kapu_service]      |  | [kapu_service]      |  | [kapu_service]      |
  +---------------------+  +---------------------+  +---------------------+  +---------------------+
        | as the person          | as the person          | its types only         | signed copies
        v                        v                        v                        v
  +------------------------------------------------------------------------------------------------+
  | VAULT                                                                                          |
  | keeps documents: checks, scans, encrypts, logs every read, deletes on time                     |
  | [kapu_service]                                                                                 |
  +------------------------------------------------------------------------------------------------+
        | each upload            | encrypted files        | wrapped keys           | our events
        v                        v                        v                        v
  +---------------------+  +---------------------+  +---------------------+  +---------------------+
  | SCANNER             |  | OBJECT STORAGE      |  | OPENBAO             |  | EVENT BUS           |
  | scans for malware   |  | keeps files         |  | keeps keys          |  | carries events      |
  | [clamav]            |  | [ceph_or_blob]      |  | [openbao]           |  | [kafka]             |
  +---------------------+  +---------------------+  +---------------------+  +---------------------+
```

**Reading it.** People reach the vault only through a screen, which
calls it with their token; services call it with their own service
account, each for its own document types (rule 6). Nothing reaches
object storage but the vault, and object storage holds only what it
cannot read (rule 5).

**Related:** implements [identity](../modules/identity.md); depends on
[access-keycloak](access-keycloak.md) and
[event-bus-kafka](event-bus-kafka.md); used by
[lending-service](lending-service.md) (collateral evidence, §5.2),
[back-office](back-office.md) (signed documents, rule 6) and
[lending-partners](lending-partners.md) (due diligence); what each
document type is, how long it is kept and where it lives:
[documents](../governance/documents.md); journeys
[JN-04](../journeys/loan-to-disbursement.md) and
[JN-14](../journeys/loan-settled.md).

## 2 · Concepts

- **A document:** one file and its record: its type, whose it is, the
  records it belongs to, its checksum, when it arrived and from where.
- **A document type:** a row of the catalogue (docs/governance/documents.md, DT-01
  onwards): its class, its retention, and so who may see it and when it
  goes.
- **Whose it is:** the person or business it is about, by reference to
  their party in its authority (architecture §2); never a copy of them.
- **The records it belongs to:** our references for a loan, an
  application, a collateral item, a contract record in Odoo; a document
  may belong to several.
- **A version:** a document never changes. A corrected or re-signed one
  is a new document that names the one it supersedes.
- **The retention clock:** starts at the event its type names (the
  relationship ends, the loan closes, the item is released); a **legal
  hold** stops it until lifted.
- **A link:** a single-use, short-lived address on our own pages that
  opens one document for one person after a one-time code (ID-17).
- Not to be confused with **the recovery vault**, OpenBao kept sealed
  for the backup keys (platform-security SE-21, deployment §4).

## 3 · Rules

1. **Every document carrying personal data is here;** when in doubt,
   here. A type moves out only by decision (architecture §6, FS-527).
2. **One file, here; elsewhere a link.** Other systems keep our
   reference and the vault's id, never the file. The one exception, by
   decision: a signed document is kept in both, as the signing tool keeps
   its signed copy and certificate as the signature's own evidence;
   everyone else reads the vault's (architecture §6, back-office rule 6,
   FS-1072).
3. **Nothing in unchecked.** Each upload's type is checked against what
   it claims to be, scanned for malware (ClamAV, run unmodified as a
   separate service, FS-525), and images are re-encoded, which strips
   what they hide, a photo's location included. A failure is quarantined
   and the uploader told why; nothing quarantined is ever read.
4. **Never changed.** Written once; checksummed (SHA-256) on arrival and
   checked on every read and in a nightly sample. A correction is a new
   version (§2); the old one keeps its own retention.
5. **Encrypted under the institution's keys.** Each file under a key of
   its own, that key wrapped by the institution's key in OpenBao's
   transit engine; object storage holds only ciphertext, so its disks, a
   replica or a backup show nothing (SE-08).
6. **Read only through the vault, every read logged.** Who, which
   document, from which record, why, when. People by their token and
   their role's types; services by their service account, only for the
   types they file. No one reaches object storage directly, Dibon's
   engineers included (SE-26); support works on the record, never the
   file.
7. **Out only by link, on our own network** (architecture §7, FS-532):
   a person by a link (§2); an organisation by the portal, the API or
   SFTP. WhatsApp, SMS and email carry the link, never the file. Once
   signed in, people may download and share their own documents as they
   choose. A bulk export is its own act, approved by a second person
   through the approval engine (architecture §7).
8. **Kept for its type's retention, then gone.** Locked against deletion
   until the clock ends; then deleted with its versions, its replica at
   site B and its backups, by the vault itself, no one having to
   remember (docs/governance/documents.md; Data Protection Act s.39; privacy PR-15).
   A legal hold stops the clock. Each deletion is logged: what type,
   whose reference, when, under which rule; never the content.
9. **One vault per institution, in its own instance** (FS-491, FS-500):
   its own buckets, keys and database; no document crosses institutions.

**What starts each clock.** A type's retention runs from an event
(docs/governance/documents.md, the catalogue's clock letter). The vault can delete
on time only if it hears that event; until then the clock has not
started, and the document is kept.

| Clock | Runs from | How the vault hears it |
|---|---|---|
| D | The document's own date | It knows: the date is on the record |
| T | The transaction, or the loan's closing | `kapu.core.loan.closed` on the bus |
| E | The end of employment | `kapu.backoffice.staff.left`, from the staff records in the back office |
| R | The end of the customer relationship: nothing live and no application open, after any period the institution added at onboarding (OB-COM-26, FS-1140) | `kapu.mfi.relationship.ended` (or `kapu.sacco`), from the lending service; `.relationship.resumed` stops the clock if they return (lending-service rule 9, FS-1073) |
| Twelve years from default | A secured loan written off or sent to recovery (docs/governance/documents.md) | `kapu.mfi.collateral.recovery.opened`, or `kapu.core.loan.written_off` |

## 4 · States

| State | Means | Moves on when |
|---|---|---|
| Received | Uploaded, in quarantine, unread by anyone | The checks pass: Stored; or fail: Rejected |
| Rejected | Failed a check; the uploader told why | Deleted from quarantine after 7 days (proposed) |
| Stored | Kept, readable by those its type allows | A new version arrives: Superseded; a hold is placed: Held; the clock ends: Deleted |
| Superseded | A later version names it; still readable, marked as replaced | As Stored, on its own clock |
| Held | A legal hold: the clock stopped | The hold is lifted: back to Stored or Superseded |
| Deleted | Gone, with its replica and backups; the deletion log keeps that it was | Final |

## 5 · How documents arrive

| From | How | In R1 |
|---|---|---|
| Staff, at the branch | Uploaded in the staff workspace against a record (an application, a collateral item, a party) | Yes |
| A customer, from their phone | A single-use upload link sent by SMS or email, opened with a one-time code; never by WhatsApp's own attachments (privacy PR-16) | Yes |
| A signature completed | Odoo Sign's signed copy and its evidence, through the back-office gateway's `signature.completed` (back-office rule 6) | Yes |
| Our services | Documents they generate: agreements and key information documents before signing, statements, notices, settlement letters | Yes |
| The field app | Captures of documents and collateral (OC-17) | No |
| Partners, regulators, auditors | Files by SFTP or API, each into its own types (lending-partners) | No; SFTP out for regulator and audit exports is in R1 |
| Migration | An institution's existing files, checked as any upload (mfi MF-16) | As each institution needs |

## 6 · Interfaces

**REST** (internal to the instance; callers by token or service account,
rule 6):

| What | Calls |
|---|---|
| Upload | `POST /uploads` (type, whose, records): a short-lived upload address; `POST /uploads/{id}/complete`: the checks begin |
| Upload links | `POST /upload-links` (type, whose, records, phone or email): the link sent through messaging |
| Read | `GET /documents/{id}`: the record; `POST /documents/{id}/links`: a link to open it, after the access check, logged with its reason |
| Find | `GET /documents?record={ref}`, `?whose={ref}`, `?type=` |
| Versions | `POST /documents/{id}/versions` |
| Holds | `POST /holds` (documents or a whose, a reason, who asked), `DELETE /holds/{id}`; both approved by a second person |
| Exports | `POST /exports` (a set, a recipient, SFTP or portal): sent to the approval engine; runs only on its yes |

There is no call that deletes: the vault deletes on its clock (rule 8).

**Events** (catalogue: event-bus-kafka §5): `kapu.vault.document.stored`,
`.document.rejected`, `.document.superseded`, `.hold.placed`,
`.hold.lifted`, `.document.deleted`, `.export.sent`. Reads are not
events: they go to the access log (§7).

## 7 · Security and audit

- **Who sees which types:** by role, from the catalogue's class and the
  institution's roles (access-keycloak §6): credit roles see a loan's
  documents; compliance sees KYC and screening evidence; HR sees staff
  contracts; ID images are Restricted and seen only by the roles that
  verify them. A customer sees their own, through customer pages.
- **Step-up** before opening a Restricted document (AC-05).
- **The access log:** every read, link, share, download, export, hold
  and deletion, with who, what, from which record and why; append-only,
  shipped to write-once storage in another domain (SE-18); never a
  document's content.
- **Its database** (metadata, logs) is reached only by the vault's role;
  pgAudit records any other write (SE-18).
- **Keys:** the institution's key in OpenBao, rotated on a schedule; a
  file's key re-wrapped on rotation, never the file re-encrypted. Backup
  keys as SE-21.

## 8 · Data

| What | Class | Kept | Personal data |
|---|---|---|---|
| The files, in object storage | As their type: Confidential; ID images and biometric captures Restricted | Their type's retention (docs/governance/documents.md), then deleted | Whoever each is about |
| Each document's record: type, whose, records, checksum, versions, the clock, holds | Confidential | With its document, then the deletion log | References only |
| The access log | Confidential | Seven years | Who read what |
| The deletion log | Internal | For the life of the institution | References only |
| The quarantine | Confidential | 7 days (proposed) | As uploaded |

## 9 · Storage and recovery

- **Object storage:** Ceph through Rook on premises, Azure Blob on Azure
  Stack in the cloud (technology register), a bucket per institution,
  versioned and locked per file until its clock ends (rule 8).
- **Site B:** each bucket replicated, versioned and locked; at most 15
  minutes behind (deployment §2, row 4). A file deleted at its clock is
  deleted at both sites.
- **Backups:** an immutable copy in Kenya (SE-10), expiring with each
  file's retention, nothing restored beyond it (privacy PR-15); restored
  by [restore from backup](../runbooks/restore-from-backup.md).
- **Its database** with the services' cluster (instance, "Stores and
  namespaces"), replicated as every database is (deployment §2, row 1).

## 10 · Quality and metrics

- **Tier:** tier 1 for reading, as signing and disbursement wait on it;
  uploads may queue (architecture quality).
- **Targets:** an upload checked and stored within 30 seconds at the
  95th percentile; a link issued within a second; site B within 15
  minutes; no deletion overdue by more than a day.
- **Metrics and alerts:** uploads by channel and outcome, quarantine
  depth, checksum failures (any is an alert), replication backlog,
  deletions due and done, scanner signature age (an alert past 24 hours),
  links issued and opened, exports (observability-grafana §4).

## 11 · Threats

| Threat | For example | The answer |
|---|---|---|
| Spoofing | Someone opens another person's document by guessing its address | Links are single-use, short-lived and opened with a one-time code to the bound phone (§2) |
| Tampering | A file altered in storage, or a signed agreement replaced | Write once, checksummed on every read (rule 4); versions name what they supersede; storage locked (rule 8) |
| Repudiation | A borrower denies signing, or a staff member denies opening a file | The signed copy and its evidence (§5); the access log (§7) |
| Information disclosure | A stolen disk, bucket or backup; a curious engineer | Ciphertext only (rule 5); no direct access to storage (rule 6); Restricted documents behind step-up (§7) |
| Denial of service | A flood of uploads, or a large file | Upload addresses issued per record and short-lived; size limits per type; the scanner queues |
| Elevation of privilege | A malicious file run by whoever opens it | Type checks, scanning and re-encoding before anyone reads it (rule 3) |
| Linkability (LINDDUN) | Documents joined across institutions to profile a person | One vault per institution (rule 9); references opaque and per institution |
| Unawareness (LINDDUN) | A person not knowing what is kept, or for how long | The privacy notice names the types and periods (docs/governance/documents.md); a person sees their own documents (ID-27) |
| Non-compliance (LINDDUN) | A document kept past its period | Deletion by the vault on its clock, logged (rule 8); "no deletion overdue" watched (§10) |

## 12 · Acceptance tests

| # | Given | When | Then | Id, source |
|---|---|---|---|---|
| A1 | An upload claiming to be a PDF that is not one | Its checks run | It is rejected, the uploader told why, and nobody can read it | rule 3, ID-15 |
| A2 | A photo of a logbook with a location in its metadata | It is stored | The stored image carries no location | rule 3 |
| A3 | A stored document whose file is altered in storage | It is read | The checksum fails, the read is refused, and an alert is raised | rule 4 |
| A4 | Object storage read directly with its own credentials | A file is fetched | It is ciphertext | rule 5, SE-08 |
| A5 | A loan officer | They open a document | The read is logged with who, which, from which record and why | rule 6, ID-15 |
| A6 | A borrower's agreement | It is sent to them | They receive a link, never the file; the link works once, after a one-time code | rule 7, ID-17 |
| A7 | A document whose retention ended yesterday, with no hold | The nightly run | It is deleted at both sites and from the backups' index, and the deletion logged | rule 8, PR-15 |
| A8 | The same document under a legal hold | The nightly run | It is kept, and the clock stays stopped until the hold is lifted | rule 8 |
| A9 | A bulk export asked for by one person | It is submitted | It waits for a second person's approval in the approval engine | rule 7 |
| A10 | A signature completed in Odoo Sign | The gateway publishes it | The signed copy and its evidence are stored, with our reference | §5, back-office A4 |

## 13 · Open questions

**For the owner:**

1. **Object lock on Azure Stack Hub:** whether its Blob storage locks a
   file for a retention set per file, as rule 8 needs; if not, the lock
   is the vault's own, and weaker (a question for Liquid, FS-048).
2. **How long a link lives:** proposed 15 minutes and one use; the
   quarantine's 7 days likewise proposed.

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-17](../law/LR-17.md) The Data Protection Act (Cap. 411C).** Regulator: Office of the Data Protection Commissioner. Made under: An Act of Parliament. In force: Yes. Version read: as at 2022-12-31, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/2019/24/eng@2022-12-31).

| Provision | Cited here as | What it requires |
|---|---|---|
| s. 39 | s. 39 | Personal data kept only as long as needed for its purpose, unless the law, a lawful purpose or the person's consent requires longer; then deleted, erased, anonymised or pseudonymised |
