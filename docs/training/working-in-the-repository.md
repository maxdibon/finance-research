---
id: working-in-the-repository
name: Working in the repository — the team's words, for everyone
kind: guide
status: living
released: 2026.10.15
owner: Delivery lead
classification: Internal
review_ids: [FS-846, FS-847, FS-848, FS-849, FS-853]
last_reviewed: 2026-10-15
---

# Working in the repository

How everyone, technical or not, makes their updates and stays in step
with the rest of the team (FS-847 to FS-849). There is one small set of
words. **A project manager says them to Claude in the desktop app**, in
plain sentences: "update, then mark Roan Capital's answer 24 as
answered". **A developer types them:** `dibon update`. Either way the
same thing happens underneath: the git, the checks and the records, done
the way [ways-of-working §6](../service-management/ways-of-working.md)
says. Developers may also use git directly, by those conventions.

## The cheat sheet

| Say | What it does |
|---|---|
| **update** | Bring my copy up to date with the shared one (shared to mine) |
| **start** "…" | Begin a piece of work on its own branch, with its register row |
| **note** "…" | Write the change note: what changed, and for whom |
| **meeting** customer date | Open a meeting record, registered as a document |
| **answered** customer number "…" | Move a customer's open answer to Answered, dated |
| **received** file `--from` customer | Keep a document from outside as an original, and register it |
| **check** | Run the checks and say, in plain words, what to fix |
| **save** "…" | Save my work on my branch; the checks run first |
| **undo** | Take back my last save |
| **discard** file | Throw away unsaved changes to one file, after showing them |
| **share** | Send my branch for review (mine to shared); the checks run first |
| **ready** | Mark my shared work ready for review |
| **status** | Where am I, and what is waiting |
| **history** file | What changed in one document, by release |
| **help** | Every word, with examples |
| **release** | The owner only: release the documentation or a customer's delivery |
| **practice** | A private sandbox to try every word safely |
| **role** "…" | Tell the words your role, once |

**Three rules.** Update first, every day. A stop protects you: nothing is
lost, and the message says what to do. Nothing is guessed: say what you
mean, and a word that cannot tell asks.

**Once, before the first time:** `dibon role "Project manager"` (your
role, never your name), and, for developers,
`git config core.hooksPath .githooks`. On Windows, `dibon` runs from the
repository's folder (`dibon.cmd`); elsewhere `./dibon`.

## The words

### update

Brings the team's latest into your copy: shared to mine, never the other
way. Example: `dibon update`. **If it stops** because you have unsaved
edits: save or discard them first. **If it stops** because your change
and a teammate's touch the same lines: nothing is lost; ask Claude or an
engineer to bring the two together. Never edit conflict markers by hand.

### start

Begins a piece of work on its own branch, named after its register row;
without `--row`, it opens a new row. Examples:
`dibon start "Roan Capital meeting, 22 October"`;
`dibon start "Fix the agenda" --row FS-826`.

### note

Writes the change note for your work, so the team sees it and the next
release carries it. `--for team` (the default), `--for everyone`, or a
customer's id; `--kind` major, minor (the default) or patch. Examples:
`dibon note "Two open answers settled" --for roan-capital`. **It stops**
if a note read outside Dibon holds a register id: say it in plain words.

### meeting

Opens a meeting record for a customer, outside git, and registers it.
Example: `dibon meeting roan-capital 2026-10-22`.

### answered

Moves a customer's open answer from Open to Answered in its delivery map,
dated, with the answer. Example:
`dibon answered roan-capital 24 "The accountant and the finance lead receive it"`.

### received

Keeps a document that came from outside as an original: moved into the
customer's `originals/`, read-only, its fingerprint recorded, and a row
in the document register, with a one-line summary of what it is and why
we hold it (without `--summary` it says "to confirm": add one later in
the register). The customer's own table of documents, on its page,
follows. Nothing from it goes into git. Example:
`dibon received "C:\Users\me\Downloads\Signed agreement.pdf" --from roan-capital --summary "The services agreement as signed"`.
**It stops** if the same document is already kept, and names it.

### check

Runs every check and lists what to fix, by file and line. The checks
also run by themselves before save and share. Example: `dibon check`.

### save

Saves your work on your branch, its subject starting with your register
row. Never on main. Examples: `dibon save "Open answer 26: two administrators"`;
`dibon save docs/customers/roan-capital.md` (that file only; it then asks
what you changed). **It stops** when you give no description, when the
checks fail, and when you give it a document from outside: that is
`received`.

### undo

Takes back your last save. Before you share it, the save is undone and
your edits stay in the files; after, nothing is rewritten: a correcting
change reverses it. Example: `dibon undo`.

### discard

Throws away unsaved changes to one file, after showing exactly what would
be lost. Example: `dibon discard docs/customers/roan-capital.md`.

### share

Sends your branch for review, mine to shared, as a draft. The checks run
first, and the tests too when tools or code changed. Example:
`dibon share`. **Until the move to GitLab**, only the owner pushes: if
the shared copy refuses, your work is saved on your branch; tell the
owner it is ready to merge.

### ready

Marks your shared work ready for review, so the reviewers are asked.
Example: `dibon ready`.

### status

Says where you are: your branch and its register row, the release,
anything unsaved or unshared, and the change notes waiting. Example:
`dibon status`.

### history

Says what changed in one document, newest first, under the release each
change went into, with the register row that asked for it. A change to
its status or dates alone is left out. The reader shows the same at the
foot of every page (click its "released" badge). Example:
`dibon history docs/customers/roan-capital.md`.

### help

Lists every word, or one word with its examples. Examples: `dibon help`;
`dibon help save`.

### release

The owner only, on main: releases the documentation or a customer's
delivery (rules, Dibon 12), commits it and tags it. Examples:
`dibon release docs`; `dibon release roan-capital`.

### practice

Makes a private practice copy, with its own pretend shared copy, and
lists the exercises. Nothing done there reaches the real documents.
Example: `dibon practice`.

### role

Records your role once, for your notes and records: never your name.
Example: `dibon role "Project manager"`.

## Nine situations

1. **The start of the day.** "Update." Your copy takes in the team's
   changes, and says which files moved. If it stops on a conflict, ask
   for help.
2. **After a meeting with a customer.** "Start: Roan Capital's 22 October
   meeting. Mark answers 24 and 25 as answered. Note for Roan Capital:
   two open answers settled. Save. Share." Each answer moves, dated; the
   note waits for the customer's next release.
3. **A signed document arrives.** "Received: the signed services
   agreement from Roan Capital, in my Downloads." It is kept, read-only,
   registered with a DR id; the file leaves your Downloads.
4. **A correction that fails a check.** "Fix open answer 26's wording.
   Save." If a check fails, it says the file, the line and what is wrong:
   fix it and save again.
5. **A save that cannot be read two ways.** `save` alone asks what you
   changed; `save <a file in the repository>` saves only it; `save
   "Loan form.docx"` from outside points you to `received`.
6. **Oops.** "Undo my last save", or "discard my changes to the agenda".
   Each shows what it does before doing it.
7. **A developer's change to the tools.** `dibon start "…" --kind tool`,
   `dibon save "…"`, `dibon share`: the tests run because tools changed.
8. **What is waiting, and what has changed.** "Status." Your branch,
   what is unsaved and unshared, and the notes waiting for the next
   release. "History of Roan Capital's page": every change to it, by
   release, each with its register row.
9. **A release (the owner).** "Release the documentation." The notes go
   into the changelogs, the release is stamped, committed and tagged.

## Practice first

`dibon practice` (or "start practice" to Claude) makes the sandbox and
lists the exercises to try in order. A failing check and a conflict are
worth meeting there first: break a table row and save (situation 4), or
clone the practice copy's shared copy a second time and change the same
line in both (situation 1). A 30-minute walkthrough for the team: each
person runs situations 1 to 4 and 6 in their own practice copy.
