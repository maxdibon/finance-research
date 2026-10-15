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
**Status:** to stamp
