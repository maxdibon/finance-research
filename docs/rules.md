---
id: rules
name: Rules — what we hold ourselves, our customers and our partners to
kind: policy
status: agreed
released: 2026.10.15.1
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-645, FS-710, FS-711, FS-713, FS-714, FS-762, FS-769, FS-805, FS-806, FS-834, FS-845]
last_reviewed: 2026-10-15
---

# Rules

The few rules that keep customers' data and money safe, for the three
parties who handle them: Dibon, the institutions we serve, and our
partners (FS-713). Each rule says where it is enforced. A rule here that
no control enforces is a gap, and goes in [REVIEW.md](../REVIEW.md).

The first rule holds for everyone: **no institution's customer data is
kept on a laptop, a desktop or a phone**, except where a journey needs it
for minutes and says so ([endpoints](specs/endpoints.md) §2).

## 1 · Dibon

| # | Rule | Enforced by |
|---|---|---|
| 1 | **No real customer data in testing, training, demos or AI tools.** Tests and training use the identity simulator and generated data; production data is never copied to another environment | Identity ID-20; insights IN-10 (Restricted never in a prompt); [testing](testing.md) |
| 2 | **Secrets only in OpenBao**, never in code, chat, email or on a laptop | Gitleaks in the pipeline (SE-12); [flows](architecture/flows.md) §3 |
| 3 | **Production only by ticket, through the bastion, for a set time, recorded.** No standing access to data; no shared accounts | Architecture §9 (FS-645); service management §6; [endpoints](specs/endpoints.md) |
| 4 | **Hardware keys for anything that reaches production or signs**, each with a registered backup | SE-26; access AC-16 |
| 5 | **A leaver loses every access the same day;** access is reviewed every quarter | Access, one switch for Dibon's engineers (architecture §9); JN-18 for institutions' staff, JN-20 for ours |
| 6 | **A new tool that touches personal data needs a technology register row and a processing agreement first** | [Technology](architecture/technology.md) rule 1; [privacy](privacy.md) |
| 7 | **Report a suspected incident or a lost device within the hour,** without blame | [Incident management](service-management/incident-management.md); [endpoints](specs/endpoints.md) §5 |
| 8 | **Every change is reviewed by a second person** before it reaches a customer | Service management §2 (merge requests) |
| 9 | **Security and privacy training every year,** and for key holders before they hold a share | [Training](training/README.md) |
| 10 | **Client material lives in Dibon's Odoo Documents, in Kenya,** one workspace per customer, read by role, every access logged: requirement documents, agreements, certificates, product drafts. **Never in a repository or on one laptop;** documents link to it, and those without access see only the link. **Exception, until the workspaces exist** (owner, 2026-10-14, FS-806): product version drafts, which hold no personal data, are kept in [products/](products/README.md) | business-suite BS-01; [gitlab](specs/gitlab.md) §2; FS-805, FS-806 |
| 11 | **A third party's document is kept as received, never edited** (owner, 2026-10-15, FS-834): in the party's `originals/`, read-only, its SHA-256, size, date and sender (by role) in the folder's manifest; what we send outside is kept the same way, as a record. **Once discussion begins, we work on a derived document:** in our format (design system), named `<Party> · <Document> · v<n> (<status>)`; version 0.1 a faithful copy citing the original's hash; every later change tracked, with a comment giving why and any regulation; each version a new file, with a version log; 0.x drafts, 1.0 agreed with the party | `node tools/originals.js verify <party-folder>`; Odoo Documents' locked folders once they exist (rule 10) |
| 12 | **Releases, not a log of every commit** (owner, 2026-10-15, FS-838, FS-839, FS-845, FS-852): the documentation set, and each customer's delivery, are released and named by date (`2026.10.15`; a patch or a second release that day adds `.1`), each release marked **major** (a reader must re-read or re-agree: a settled principle, a release's scope, a product added or retired, an edition issued; for a customer, its requirements and scope agreed, the contract, a go-live), **minor** (a batch worth telling) or **patch** (a correction). **Every merge request carries a change note** (changes/), for the team, for everyone or for a customer; a release, on the owner's word, gathers them into the internal changelog, the external release notes and the customer's §8, stamped and tagged. Wording, tooling and housekeeping take no release and no note. **Every document has a status from its kind's lifecycle**, so a release shows its drafts (every status, with what it means, is in [Start here](start-here.md), "Statuses you will meet"); `version:` stays only on documents that go outside on their own. **Every document says the release its content was last released in** (`released: 2026.10.15` in its front matter; `unreleased` before its first release, and in every template), so a copy read anywhere names its release: a release moves it on the documents that changed in it, never by hand, and the reader adds "changed since" when a document was edited after | CHANGELOG.md; docs/marketing/release-notes.md; each delivery map's §8; changes/; `node tools/cut.js`; the status, versions and changes checks |

## 2 · Institutions

Agreed at onboarding ([onboarding](onboarding.md) OB-COM-24) and in the
contract.

| # | Rule | Enforced by |
|---|---|---|
| 1 | **Named users only, never shared;** staff and approvers with two authenticators | Access AC-16; the `staff` realm (access-keycloak) |
| 2 | **Any device that reaches the platform meets our minimum:** a supported system, updated, encrypted, locked, protected; bank files only on the designated machine | [Endpoints](specs/endpoints.md) §3; JN-13 |
| 3 | **Its administrators remove a leaver the same day,** and it signs a quarterly access review we prepare | Access; the review in its service review (service management §5) |
| 4 | **No customer data sent to our service desk** by email or WhatsApp: the desk's own links and masked views only | [Operating model](operating-model.md); architecture §7 |
| 5 | **Training and testing on test data,** never production | Identity ID-20; [training](training/README.md) |
| 6 | **Data it exports is its to protect;** we log what left, and how | Identity ID-17 |
| 7 | **It names who approves Dibon's access to its instance, and who can switch it off at any hour** | Onboarding OB-COM-22; architecture §9 |
| 8 | **Its duties to its regulators stay its own** (breach notices, returns, customers' complaints); we support with evidence on request | Privacy (s.43); service management §6; incident management |
| 9 | **Its lawful basis and its notices to customers cover every check run for it,** our verification and bureau vendors' included; it keeps the consents, and uses the results for its own KYC and credit decisions only, never resold or passed on | The services agreement and DPA, to be written (FS-748); privacy; identity ID-10 |

## 3 · Partners

Vendors, providers and integrators: Liquid, Safaricom, banks, identity
vendors, Twilio, GitLab and the rest. Checked before selection
([partners](partners.md) C17) and written into the contract.

| # | Rule | Enforced by |
|---|---|---|
| 1 | **A processing agreement before any personal data flows** | [Privacy](privacy.md); the contract |
| 2 | **Data stays in Kenya,** or the transfer is named, with its safeguards shown to the Data Commissioner first | Privacy (s.48); the technology register's "Governed by" |
| 3 | **Only what each call needs:** a hash to the transparency log, a phone number to a messaging route, never more | The interface contracts ([interfaces](architecture/interfaces.md)) |
| 4 | **No standing access to our systems;** where a partner must reach in, through the bastion, against a ticket | Architecture §9 |
| 5 | **A breach told to us within 24 hours,** so we can meet our own 48 and 72 | The contract; privacy (s.43) |
| 6 | **Evidence of security every year:** a certificate or a questionnaire; **sub-processors named** | Partner register; technology register checks each quarter |
| 7 | **Data returned or deleted when we part,** with a certificate | The contract |
| 8 | **Its software runs unmodified and separately** where its licence requires | Architecture §6.1 |
| 9 | **Whatever it needs an institution to accept is known before we sign:** its product terms attached, changed only with notice, and carried into our agreements with institutions; its results usable in the institution's own records and credit models | The contract; partners C17 (FS-762) |
