# Changelog

Versions of Dibon's financial-services documentation, newest first. Not
every commit: git and REVIEW.md hold those. A version is a snapshot of
the whole set, cut when a batch is worth telling, on the owner's word;
each document's own status says where it stands in it, drafts included
(FS-838, FS-839; rules, Dibon 12).

**When a version moves.**

- **Major (x.0): a reader must re-read, or re-agree.** A settled
  principle changes; a release's scope changes (R1's contents or its
  cap); a product or module is added or retired; the portfolio issues
  an edition to readers.
- **Minor (x.y): a batch worth telling.** Decisions made; a spec,
  journey or rule agreed or substantially revised; a register extended
  in substance; documents exchanged.
- **No version:** wording, formatting, tooling and checks, register
  housekeeping. They stay in git and REVIEW.md.

**How.** The entry is written under its heading (Decided, Changed,
Exchanged), its status line reading "to stamp"; `node tools/cut.js docs
<version>` stamps the status (each document's status counted, and what
changed status since the last version); the commit is tagged
`docs-<version>`. A customer's delivery keeps its own versions in its
delivery map's §8, cut the same way (`node tools/cut.js <customer-id>
<version>`). Each document's status follows its kind's lifecycle (the
status check).

## 1.0 · 2026-10-15

**The baseline:** the documentation as it stands when versions begin.
The portfolio (v1.1, issued); the modules and their capabilities; R1,
Roan Capital's pilot, and the delivery plan; the architecture; the
specifications and the user journeys; the handbook; service management;
the registers (law, privacy, documents, partners, competitors,
customers, legal questions, decisions, rules, and the document
register); and the checks that hold them together. Its history before
this is in git and REVIEW.md, FS-001 to FS-840.
**Status:** to stamp
