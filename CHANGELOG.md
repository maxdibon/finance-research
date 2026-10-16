# Changelog

Releases of Dibon's financial-services documentation, newest first: the
internal changelog (FS-838, FS-845; rules, Dibon 12). For readers outside
Dibon, the same releases are in
[docs/marketing/release-notes.md](docs/marketing/release-notes.md),
customer-safe. Each customer's delivery has its own releases, in its
delivery map's §8.

**A release is named by its date:** `2026.10.15`. A second release the
same day, or a patch to one, adds `.1`, `.2`. Each release also says its
kind:

- **major:** a reader must re-read, or re-agree. A settled principle
  changes; a release's scope changes (R1's contents or its cap); a product
  or module is added or retired; the portfolio issues an edition.
- **minor:** a batch worth telling: decisions made; a spec, journey or
  rule agreed or substantially revised; documents exchanged.
- **patch:** a correction, nothing new.
- Wording, formatting, tooling and housekeeping take no release; they
  stay in git and REVIEW.md.

**How.** Each merge request carries a change note in `changes/` (its
README says how to write one); the reader lists those not yet released.
A release, on the owner's word, is `node tools/cut.js docs` (or
`<customer-id>`): it gathers the notes into the entry, stamps the status
(each document's status counted, and what changed status since the last
release), moves README.md's release line, and gives the tag to make,
`docs-<version>`, annotated. Each document's own status follows its
kind's lifecycle (the status check).

## 2026.10.16 · minor

- The Advocates Act joins the law register, read for what our legal partnerships rest on: an advocate shares no profits with a non-advocate, and paid referrals of legal work are touting. The partners register now ends with its "Regulations cited". (FS-873; Chief Technology and Innovation Officer)
- The review register had grown past what a Markdown preview will show (it appeared as raw text in the desktop app). REVIEW.md now holds the open rows; closed rows move to review/, a file for each hundred ids, and the reader's Review page still shows them all. dibon save keeps the files in order by itself. (FS-866; Chief Technology and Innovation Officer)
- Every document that cites the law now ends with "Regulations cited": 48 in all, from the lending journeys to the records schedule. Cites are placed by the law's name as well as its id, so the text reads as it always did; twenty-two instrument cards say what each cited provision requires. (FS-870; Chief Technology and Innovation Officer)
- Every law whose provisions we cite has a card in docs/law/: its citation, regulator, what it was made under, whether it is in force, and what each cited provision requires, read from the law's text. Documents that cite provisions end with a "Regulations cited" section made from the cards, and can print the same for a Word or PDF document read outside Dibon. The lender rules, Roan Capital's product, the microfinance module and the privacy register carry it first. (FS-868; Chief Technology and Innovation Officer)
- The loan application form (now version 0.3), its schedule of changes and the three 30-day loan questionnaires each end with a page listing every regulation they cite: who oversees it, the version read, and what each provision requires. Two readings still being confirmed are marked as such. (FS-874; Chief Technology and Innovation Officer; for roan-capital)
- Two readings of the lender regulations are being confirmed, and we have said so openly: whether a restructure a borrower asks for must wait the thirty days' notice for a change to a loan agreement, and which regulation sets how often guarantors receive statements. Nothing is built on either until both are confirmed; your counsel's view is welcome. (FS-876, FS-869; Chief Technology and Innovation Officer; for roan-capital)
- The guide to the team's words is now part of ways of working, as its sections 7 to 10, so how we work and the words that do it are in one place. A note at the top says who reads which sections. The earlier sections keep their numbers. (FS-865; Chief Technology and Innovation Officer)
- The practices in ways of working's "Working together" are adopted, no longer proposed: write it down first, async by default, small changes, reviews within a working day, a definition of done, a weekly rhythm, and the rest. (FS-867; Chief Technology and Innovation Officer)

**Status:** Specs: 11 draft. Journeys: 19 draft. Other documents: 20 draft, 2 agreed. Outreach: 1 withdrawn, 7 draft. Living documents: 75 living. Since docs-2026.10.15.1: no status changed; 24 documents added, 1 removed. Documents changed in it, now saying "released: 2026.10.16": 80.

## 2026.10.15.1 · patch

- The document register has a one-line summary for every document, and each customer's page lists its own documents in a table made from the register: title, summary, kind, status, date and who it came from. Registering a received document or a meeting updates the customer's table by itself. (FS-857; Chief Technology and Innovation Officer)
- Every document now names the release its content was last released in, at the top of the file and as a badge in the reader, so a copy read anywhere says which release it belongs to, and whether it has changed since. (FS-852; Chief Technology and Innovation Officer; for everyone)
- Every page in the reader ends with the document's history, from git: each change to its content, newest first, under the release it went into, with the register row that asked for it. `dibon history <file>` says the same outside the reader. (FS-853; Chief Technology and Innovation Officer)
- In the reader, every path written as plain text is now a link: short names in a list ("docs/regulation.md, compliance.md"), relative paths ("modules/access.md") and folders ("docs/customers/", which opens a page listing what the folder holds). Folders outside the documents, such as tools/, read as code. The checks fail a path that names no document, or a short name two documents share with nothing to say which. (FS-856; Chief Technology and Innovation Officer)
- Start here now explains every status we use, from a living register to a product version awaiting the Central Bank, in one section, "Statuses you will meet"; the checks fail if it and the rules they enforce ever differ. (FS-855; Chief Technology and Innovation Officer)
- Start here's statuses are now one table, a row for each kind of thing, with its statuses in order and real examples to open. (FS-858; Chief Technology and Innovation Officer)

**Status:** Specs: 11 draft. Journeys: 19 draft. Other documents: 20 draft, 2 agreed. Outreach: 1 withdrawn, 7 draft. Living documents: 52 living. Since docs-2026.10.15: no status changed; 0 documents added, 0 removed. Documents changed in it, now saying "released: 2026.10.15.1": 6.

## 2026.10.15 · major

**The first dated release:** the documentation as it stands when versions
begin. The portfolio (v1.1, issued); the modules and their capabilities;
R1, Roan Capital's pilot, and the delivery plan; the architecture; the
specifications and the user journeys; the handbook; service management;
the registers (law, privacy, documents, partners, competitors, customers,
legal questions, decisions, rules, and the document register); the git
conventions, change notes and dated releases; and the checks that hold
them together. Its history before this is in git and REVIEW.md, FS-001
onwards; it was first cut as 1.0 the same day, a number this release
replaces.
- Contents lists where a reader needs them: long pages with few sections now have one, short pages none, and the register's page jumps by criticality and by the hundred. (FS-844; Chief Technology and Innovation Officer)
- Releases are named by date and marked major, minor or patch; each change carries a change note, and a release gathers the notes into the internal changelog, the external release notes and a customer's changelog. (FS-845; Chief Technology and Innovation Officer)
- The decisions log gains fifteen entries for settled decisions that were written only in the documents they shaped, each with what it requires, checked. (FS-843; Chief Technology and Innovation Officer)
- Git conventions agreed: short branches named by their register row, subjects that start with it (a hook holds them), rebase to keep current, squash on merge, dated annotated tags, LF line endings, and the register merged by union. (FS-846; Chief Technology and Innovation Officer)
- Every page of the reader shows the release it was built from, what has moved since, and which pages changed; the Master and the handover name their release; the Master shows each document's status. (FS-842; Chief Technology and Innovation Officer)
- The team's words: one small vocabulary for every update, from the desktop app or the command line, with a guide, a cheat sheet and a practice copy. (FS-847, FS-848, FS-849; Chief Technology and Innovation Officer)

**Status:** Specs: 11 draft. Journeys: 19 draft. Other documents: 20 draft, 2 agreed. Outreach: 1 withdrawn, 7 draft. Living documents: 52 living. The first dated release: nothing earlier to compare.
