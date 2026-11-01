---
id: the-words
name: The team's words — how everyone, technical or not, makes their updates and stays in step
kind: plan
status: living
released: unreleased
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-847, FS-848, FS-849, FS-865, FS-888, FS-889, FS-890, FS-891, FS-922, FS-931, FS-1053]
last_reviewed: 2026-11-01
---

# The team's words

How everyone, technical or not, makes their updates in the repository
and stays in step, from the desktop app or the command line, with the
words `tools/dibon.js` knows (FS-847 to FS-849, FS-865). The rules they
follow for you are [ways-of-working](ways-of-working.md): roles in §1, a
pull request in §2, git in §6. This page was ways-of-working §7 to §10
(FS-1053).

## 1 · The team's words

How everyone, technical or not, makes their updates and stays in step
with the rest of the team (FS-847 to FS-849). There is one small set of
words. **A project manager says them to Claude in the desktop app**, in
plain sentences: "download, then mark Roan Capital's answer 24 as
answered". **A developer types them:** `dibon download`. Either way the
same thing happens underneath: the git, the checks and the records, done
the way ways-of-working §6 says. Developers may also use git directly, by those
conventions.

**The words are said from your side** (FS-879 to FS-881). There is your
copy, on your computer, and the repository ("the repo" when speaking),
which everyone shares, on GitHub. Your work moves
outwards in four steps, each reaching further:

| Word | Your work goes | Who sees it |
|---|---|---|
| **save** | into your copy, on your branch | you |
| **upload** | onto your own branch in the repository | you, kept safe; not yet for review |
| **share** | before the team, as a review | the team |
| **release** | out to the public: the documents' readers, or a customer | everyone it is for (the owner's word) |

And one inwards: you **download** the repository's latest into your
copy. "Update" is not a word: it could mean download or upload, so the
tool, and Claude in the desktop app, ask which you mean.

### The cheat sheet

| Say | What it does |
|---|---|
| **download** | Bring the latest from the repository into my copy (the repository to me) |
| **start** "…", or **new** | Begin a piece of work on its own branch, with its register row; **new spec** "…" (or journey, module, customer) makes the document too |
| **resume**, or **continue** | Go back to something I started; my unsaved edits are parked, not lost |
| **join** row | Take part in a row someone has: my name after its lead, my own branch for it |
| **leave** row | Step off a row; the next name leads |
| **note** "…" | Write the change note: what changed, and for whom |
| **meeting** customer date | Open a meeting record, registered as a document |
| **answered** customer number "…" | Move a customer's open answer to Answered, dated |
| **received** file `--from` customer | Keep a document from outside as an original, and register it |
| **check** | Run the checks and say, in plain words, what to fix |
| **save** "…" | Save my work on my branch; the checks run first |
| **undo** | Take back my last save |
| **discard** file | Throw away unsaved changes to one file, after showing them |
| **upload** | Put my saved work on my own branch in the repository: still mine, not yet for review |
| **share** | Put my uploaded work before the team, for review; the checks run first |
| **status** | Where am I, and what is waiting |
| **history** file | What changed in one document, by release |
| **help** | Every word, with examples |
| **release** | The owner only: release to the public, the documentation or a customer's delivery |
| **practice** | A private sandbox to try every word safely |
| **role** "…" | Tell the words your role, once |
| **claude** handle | Set, once, the name my Claude commits under |
| **session start**, **session end** | Begin my day with the team's handover and mine; end it with mine brought up to date |

### What each word does for you

Each word does its git and its records the same way every time, so you
need not remember them (FS-922). What happens on its own, beyond what
you asked:

| Word | What it does for you, on its own | When it stops (nothing is lost) |
|---|---|---|
| **download** | Fetches the team's latest and puts it under your work; brings the register's rows together (a row of yours whose id the team took meanwhile is renumbered, everywhere your branch cites it; a row you both edited is merged, both notes kept); makes the generated sections again; saves that as one change of yours; notes which reviews are open, for the Board | You have unsaved edits; your change and a teammate's touch the same lines |
| **start**, **new** | Fetches; parks your unsaved edits with the work you were on; makes your branch from the team's latest, named by its kind, row and words; opens the register row, with you as its raiser and its holder; with a kind, makes the document from its template, a spec or journey listed in its index; offers to take you back to a title you started already; notes when you have three things started | Unsaved edits on main |
| **resume**, **continue** | Lists your work not yet merged, and your Claude's; parks the edits you leave and brings back the ones parked where you arrive | The name matches nothing, or more than one; it is your Claude's work |
| **join**, **leave** | Join: your name on the row after its lead, your own branch for it, your edits parked. Leave: your name off, the next name leading | The row is closed; you are the last one on it (say who takes it) |
| **note** | Writes the change note, signed by your name and role, its rows from your branch | A note read outside Dibon that carries a register id |
| **save** | Files the register's rows by their status; notes a file someone's uploaded branch changes too, and a paragraph rewrapped for a word; keeps the front matter of each document whose content you changed current (today's `last_reviewed`, your row in its `review_ids`); makes the generated sections again; runs the checks; saves with your row in the subject; rebuilds the reader where the commit hook does not; reminds you if your branch has no change note | No description; the checks fail (each said in plain words); a document from outside |
| **upload** | Puts your branch on the repository, safely over an earlier upload of it | The repository refuses (until the team is in the organisation, only the owner uploads) |
| **share** | Runs the checks, and the tests when tools or code changed; uploads; opens your review, or marks it ready; notes it for the Board | Unsaved edits; a check or test failing |
| **undo** | Takes back your last save: kept as edits before upload, a correcting change after | Nothing of yours to undo on main |
| **discard** | Shows what would be lost, then throws away one file's unsaved changes | — |
| **status** | Your branch, the release, what is unsaved and uploaded, the notes waiting, what you started, what your Claude has waiting, and how long since you downloaded | — |
| **meeting**, **answered**, **received** | Each writes its record and registers it: a meeting record and its document row; an answer moved and dated; an original kept read-only, fingerprinted, and registered | The customer or file is not one we know |
| **release** | The owner's: gathers the change notes into the changelogs, stamps each changed document's `released:` line, then the tag | Not the owner; nothing waiting |
| **session** | Start: downloads, then puts the team's handover and yours together for a new session, your generated part fresh, and shows your status. End: your generated part fresh (your rows, your work, your Claude's), and what is unsaved or not uploaded; your Claude then writes where you left off and your preferences | Start does not download over unsaved edits |
| **check**, **history**, **help**, **practice**, **role**, **claude** | Read or set only: the checks explained, a document's history, the words, a practice copy, your role, your Claude's name | — |

**What no word does for you:** write a handover's words (your Claude
writes yours at the end of a session; the team's changes by pull
request); upload, share, merge or
release unless you say so; close a register row or write a decision.

### Three rules, and once before the first time

**Three rules.** Download first, every day. A stop protects you: nothing is
lost, and the message says what to do. Nothing is guessed: say what you
mean, and a word that cannot tell asks.

**Once, before the first time:** `dibon role "Project manager"` (your
role, beside your name), `dibon claude` and your handle if you work with
Claude (ways-of-working §1), and, for developers,
`git config core.hooksPath .githooks`. On Windows, `dibon` runs from the
repository's folder (`dibon.cmd`); elsewhere `./dibon`.

## 2 · The words

### download

Brings the latest from the repository into your copy: from the repository to you,
never the other way. Example: `dibon download`. Daily, at least:
`dibon status` reminds you after a day. **Afterwards** it brings the
register's rows together (a row of yours whose id the team took meanwhile
is renumbered, and says so; a row you both edited is merged, both notes
kept), makes the generated sections again, and saves that as one change
of yours (FS-890). **If it stops** because you have unsaved
edits: save or discard them first. **If it stops** because your change
and a teammate's touch the same lines: nothing is lost; ask Claude or an
engineer to bring the two together. Never edit conflict markers by hand.

### start

Begins a piece of work on its own branch, named after its register row;
without `--row`, it opens a new row. Given only a title, it asks once
what you are starting: changes to documents we have, or a new spec,
journey, module or customer. Started that title already? It offers to
take you back to it instead. Unsaved edits on what you were doing are
parked with it (see resume). Examples:
`dibon start "Roan Capital meeting, 22 October"`;
`dibon start "Fix the agenda" --row FS-826`.

### new

The same word as start (FS-888). Name a kind and it makes the document
too, from its template, its front matter filled in: `spec` (with
`--type component` for a product we configure), `journey` (the next JN
number), `module` or `customer`. A spec and a journey are listed in their
index at once; it says what is still yours to write, and the checks say
what is missing until you save. `dibon new meeting` is the meeting word.
Examples: `dibon new spec "Loan top-up"`;
`dibon new journey "A borrower tops up a loan"`.

### resume

Back to something you started (FS-889). Alone, it lists your work not yet
merged, numbered, with what each has saved, whether it is uploaded, and
where you are now. Say which by its number, its row or a word from its
title, and it takes you there: your unsaved edits are parked with the
work you leave, and come back when you return to it. Your own Claude's
work waiting for you is listed under yours (FS-907), to see, not to
resume: ask Claude to go on with it. A teammate's branches, and their
Claude's, are theirs and not listed. Examples:
`dibon resume`; `dibon resume 2`; `dibon resume FS-890`;
`dibon resume top-up`.

### join

Takes part in a row someone already has (FS-892): your name goes in its
With, after its lead's, and a branch of your own starts for it,
`docs/<row>-<your handle>-<words>`, so your work stays yours. No one's
leave is needed; the people on it see you on the board once your save is
merged. With three things already started, it notes it. Example:
`dibon join FS-826`.

### leave

Steps off a row: your name comes out of its With, and the next name
leads. The last one on it hands it to someone: `--to` and their name.
Your branch stays yours, to finish or discard. Examples:
`dibon leave FS-826`; `dibon leave FS-826 --to Betty`.

### continue

The same word as resume. Examples: `dibon continue`;
`dibon continue top-up`.

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
`received`. **It notes, without stopping,** a file you changed that
someone's uploaded branch changes too, and a paragraph rewrapped for a
word (FS-890). **Before the checks, it keeps current** the front matter
of each document whose content you changed (today's `last_reviewed`,
your row in its `review_ids`) and the generated sections; **after
saving,** it rebuilds the reader where the commit hook does not, and
reminds you if your branch has no change note (FS-922). `--body-file` adds a body to the saved change from a file:
why it changed, and any trailer such as Co-Authored-By (FS-862).

### undo

Takes back your last save. Before you share it, the save is undone and
your edits stay in the files; after, nothing is rewritten: a correcting
change reverses it. Example: `dibon undo`.

### discard

Throws away unsaved changes to one file, after showing exactly what would
be lost. Example: `dibon discard docs/customers/roan-capital.md`.

### upload

Puts your saved work on your own branch in the repository: safe off
your computer, still yours, not yet in front of the team. Upload as
often as you like. Example: `dibon upload`. **Until the team is in
Dibon's GitHub organisation**, only the owner uploads: if the repository refuses,
your work is saved on your branch; tell the owner it is ready.

### share

Puts your uploaded work before the team, for review: the checks run
first, and the tests too when tools or code changed; anything not yet
uploaded is uploaded; then a review is opened, or yours marked ready, and
the reviewers are asked. Example: `dibon share`. ("Ready", the old word,
points here.)

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

The owner only, on main: releases to the public, the documentation or
a customer's delivery (rules, Dibon 12), commits it and tags it. Examples:
`dibon release docs`; `dibon release roan-capital`. `--body-file` gives the
release's commit a body, as for save.

### practice

Makes a private practice copy, with its own pretend repository, and
lists the exercises. Nothing done there reaches the real documents.
Example: `dibon practice`.

### role

Records your role once, for your notes and records, beside your name
where the team table has none for you.
Example: `dibon role "Project manager"`.

### session

Begins and ends a working session (FS-931). `dibon session start`
downloads, then puts the team's handover (HANDOFF.md) and yours
(handoffs/ and your handle) together in build/session/, for a new
session to read, and shows your status. `dibon session end` brings the
generated part of yours up to date (the rows with you, your work
started, your Claude's work waiting) and says what is unsaved or not
uploaded; your Claude then writes where you left off and any
preferences, and you save. Examples: `dibon session start`;
`dibon session end`.

### claude

Sets, once, the identity your Claude commits under: "Claude for" you,
from your handle in the team table (ways-of-working §1), so the history shows whose
Claude did what. With no handle, says what it is now.
Example: `dibon claude eric`.

## 3 · Nine situations

1. **The start of the day.** "Download." Your copy takes in the team's
   changes, and says which files moved. If it stops on a conflict, ask
   for help.
2. **After a meeting with a customer.** "Start: Roan Capital's 22 October
   meeting. Mark answers 24 and 25 as answered. Note for Roan Capital:
   two open answers settled. Save. Upload. Share." Each answer moves, dated; the
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
   `dibon save "…"`, `dibon upload`, `dibon share`: the tests run, at share, because tools changed.
8. **What is waiting, and what has changed.** "Status." Your branch,
   what is unsaved and unshared, and the notes waiting for the next
   release. "History of Roan Capital's page": every change to it, by
   release, each with its register row.
9. **A release (the owner).** "Release the documentation." The notes go
   into the changelogs, the release is stamped, committed and tagged.

## 4 · Practice first

`dibon practice` (or "start practice" to Claude) makes the sandbox and
lists the exercises to try in order. A failing check and a conflict are
worth meeting there first: break a table row and save (situation 4), or
clone the practice copy's pretend repository a second time and change the same
line in both (situation 1). A 30-minute walkthrough for the team: each
person runs situations 1 to 4 and 6 in their own practice copy.
