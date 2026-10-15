# Change notes

One short note per merge request, written by its author, so the team sees
what changed as soon as it merges and every release gathers its own notes
(FS-845; rules, Dibon 12). Nobody edits a changelog by hand.

A note is a file here, named `<YYYY-MM-DD>-<a-few-words>.md`:

```
---
kind: minor
for: team
rows: [FS-845]
by: Delivery lead
---
Versions are dated: a release is named by its date, with .1, .2 for a patch.
```

- **kind:** `major` (a reader must re-read or re-agree), `minor` (a batch
  worth telling) or `patch` (a correction, nothing new). A change that
  takes no version (wording, tooling, housekeeping) needs no note.
- **for:** `team` (internal only), `everyone` (also in the external
  release notes, docs/marketing/release-notes.md), or a customer's id
  (`roan-capital`: also in its delivery map's changelog, §8).
- **rows:** the register rows it serves. **by:** a role, never a name.
- **The text:** one or two sentences. A note for everyone or for a
  customer is read outside Dibon: customer-safe, with no register ids in
  its text (the check holds both).

The reader lists the notes not yet released on its "Unreleased" page.
`node tools/cut.js docs` (and `node tools/cut.js <customer-id>`) gathers
them into a release and removes each once every place it belongs to has
released it. A docs release also stamps each document that changed in it,
`released: <version>` in its front matter; a new document says
`released: unreleased` until then.
