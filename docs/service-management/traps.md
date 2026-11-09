---
id: traps
name: Traps — what has cost a session real time, and what to do instead
kind: guide
status: living
released: unreleased
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-1053, FS-1118, FS-1122, FS-1151]
last_reviewed: 2026-11-09
---

# Traps

What has cost a session real time in this repository, each with what to
do instead. Every session's Claude reads this before its first edit;
`dibon session start` hands it over with the handover. It was the
handoff's own section until it grew past the rest (FS-1053). **When
something costs you time, add it here in the same pass,** in a line or
two: the trap, then what to do.

- **Heredocs and `node -e` eat backslashes, backticks and quotes**: a lost
  `\d` once made the check report every problem at line 0. Write any
  script holding them with the file tool and run it.
- **Count every anchor and stop unless it matches once**; a replacement
  that matches nothing can still write somewhere (FS-779). **Load a file
  once per script**: two edits from the same original overwrite each
  other. **Normalise CRLF and LF** before matching.
- **A guard for a table's header can swallow a real row of the same
  name**, and **a blank line inside a Markdown table splits it**: compare
  row counts before and after.
- **PowerShell variable names ignore case** (`$w` is `$W`), and
  PowerShell 5.1 garbles non-ASCII in file names: find them by wildcard.
- **PowerShell 5.1 splits a here-string at its double quotes** when it
  passes it to git: a commit message quoting "a phrase" becomes stray
  pathspecs and nothing is committed. Write the message to a file and
  `git commit -F` it (FS-1111).
- **A register row tagged [decision] needs its entry in docs/decisions/,**
  in the file for its hundred; the first id of a new hundred needs the
  file and its row in docs/decisions.md's index (FS-1109).
- **An environment variable set for a builder** (DOCX_MODULE) must be set
  in the same PowerShell call as the build; a call chained after a
  failure never sets it, and the build fails on the missing package.
- **PowerShell 5.1's `Set-Content -Encoding utf8` writes a byte-order
  mark,** and the file tool keeps it when it rewrites the file: a commit
  message so written fails the commit-msg hook, its subject no longer
  starting "FS-". Write message files with the file tool from the start
  (FS-1122).
- **The phase-1 cap is full**; adding a capability trips scope,
  references, dependencies, customers and obligations at once.
- **A break test goes stale** when the design catches up with it: run the
  whole suite after any change to ids or relations. **A new spec touches
  six others** (used_by, Related lines, the end-of-day runner).
- **The portfolio overflows silently:** build with `--html-only` and run
  `design/portfolio-pdf/measure.js`; look at the printed pages, do not
  only measure them. It is public copy: no register ids, not even in
  notes.
- **Word over COM** can crash on closing: note the WINWORD processes
  before starting one, and close only your own. A document open in Word
  is locked: copy beside it, never over it.
- **The docx package cannot make Word form fields**: the builder swaps
  marker paragraphs for content controls after packing.
- **Nested backticks break the reader**: describe a fence marker in words.
- **A settled answer must be encoded in the same commit**, or the
  products check blocks it.
- **A protected name can hide in a folder name**: the names check reads
  every committed word, paths in tables included.
- **A script can match nothing and still print "ok":** a mangled pattern
  once marked no register rows at all. Check the result (count the rows
  changed), never the script's own word.
- **Writing the marker `[decision]` in a row's notes marks the row as a
  decision**, and the decisions check then wants an entry for it: say "as
  a decision" in prose.
- **Every commit subject starts with its register row** ("FS-123: …"), or
  Merge, Revert or Release: the commit-msg hook refuses others.
- **A register row has seven cells** (FS-882): Id, Raised by, Point,
  Status, Criticality, With (a first name from the team in
  ways-of-working §1, or "—" once closed), Notes. A script that adds or
  closes rows writes all seven.
- **Take the next FS id from the real register**,
  `node -e "console.log(require('./tools/register').nextId('.'))"`: the
  newest row may already be closed and in review/. Never from a sandbox
  or a practice copy, whose ids go nowhere.
- **After closing or reopening a row, run `node tools/register.js tidy`**,
  or the register check fails: closed rows live in review/, open rows in
  REVIEW.md. A closed row's later edits are in its review/ file.
- **Windows cannot rename across drives** (Downloads on C:, the
  repository on E:): copy, check the copy, then remove the source, as
  `tools/originals.js` does.
- **Never type a release into a document's `released:` line**: a new
  document says `unreleased` and the release stamps it. A diff that moves
  only that line is no change, to the reader's "changed since", to the
  history and to the reviewed check alike. The rule is written twice, in
  `tools/release.js` and in the reviewed check: change both together.
- **A throwaway clone for testing a tool gets no confidential files:**
  copying `sources/confidential/protected-names.txt` into one was refused,
  rightly. `tools/cut.js` and the history need none of it.
- **Run the full tests after a release,** not only the checks: a test
  that rebuilt the changelog from scratch failed from the release on,
  as the documents then named a release the fixture lacked (FS-861).
- **A throwaway clone tests what is committed in it, not your edits:**
  `git diff` leaves out new files (copy them in), and `dibon start`
  branches from the repository, which for a clone is the real
  repository; remove the clone's `origin` first.
- **The reader cannot italicise around a code span:** a line in
  asterisks holding a code span shows its asterisks. Write the path
  plainly inside emphasis.
- **The browser pane may not draw when it is hidden**, and a click or
  screenshot then times out: read the page with `find`, `get_page_text` or
  `javascript_tool` instead.
- **Subagents claim more than they did.** Check their work.
- **Headless Chrome will not overwrite a PDF,** nor one that is open: print
  to a fresh name, then move it into place (the portfolio's build and the
  SBM deck's print both do).
- **A pretend repository tests what is committed in it:** copy the guide
  and any new tool in, and `git add -A` them before the commit, or the
  words check or a missing module fails the test.
- **The register's ids are checked in tools/ too:** a test that invents
  an FS id fails review-ids; use a real one.
- **Angle brackets in a register row** are read as HTML: a branch
  pattern goes in backticks.
- **A reader tab opened from a file is a snapshot:** in the browser pane, a
  `file://` page never refreshes when the site is rebuilt, and looks as
  if today's work is missing. Use `preview_start` name `site` and its
  localhost address, and reload.
- **A merge does not rebuild the reader:** the hook runs on a commit, not
  on a merge, so after "merge and push" the reader may still be built from
  the last branch committed on. Run `node tools/site.js` on main.
- **Run the tests on a still tree:** a run that overlaps edits, commits or
  a branch switch reported 50 failures that a quiet rerun did not
  (FS-1028). The suite takes several minutes: start it, then leave the
  files alone.
- **Register ids have four digits past FS-999** (FS-1000): every tool reads
  `FS-\d{3,4}` and sorts by number; a new pattern must too.
- **A change to a product draft can break a products test** that finds
  its row by the old text: the test then edits nothing and fails. Run
  the products tests after changing a draft (FS-1044).
- **A product draft's notes do not reach its questionnaire:** only its
  items do. Fold anything agreed into the items, or the customer is
  asked again what they already told us (FS-1044).
- **The SBM deck is an artifact on claude.ai,** not a file here; its PDF
  is rebuilt locally into build/proposals/.
- **The repository's git user is the owner's:** a plain `git commit` puts
  Claude's work under his name. Commit as `git config --get dibon.claude`
  names, with `-c user.name=... -c user.email=...` on every commit, and
  check `git log --format=%an main..HEAD` before any merge. On 9 November
  six commits made after a context summary went in under his name and were
  rewritten before the push (FS-1151).
- **Two sessions on one register:** the register check fails on any gap in
  the FS, LQ or DR ids, so a session cannot hold an id in reserve. Agree
  each id by message before writing it, commit in id order, and
  fast-forward to the other session's commit before writing the next row;
  never merge a branch built on history that has since been rewritten
  (FS-1151).
