# The MVP day's board on GitHub

The goals of the MVP day (3 November 2026, moved from 23 and then 30 October: FS-962, FS-1074) as GitHub issues on a
Project (FS-930). `goals.json` is the one list: the register's rows
FS-938 to FS-951 were made from it, and so are the issues, so the two
cannot disagree.

## Before running it (the board's owner, in GitHub)

1. **A practice repository** with the team added as collaborators.
2. **A Project**, "MVP", with these fields: Status (To do, Doing, In
   review, Done), Owner (a person), Workstream (platform, core, money,
   back-office, delivery), Critical path (yes or no), Checkpoint (before,
   12:20, 13:10, 14:45, 15:20, 15:35).
3. **Views:** a board by Status; a table grouped by Workstream; a
   roadmap of the critical path.

## Running it

```
node create-issues.js --repo owner/practice
node create-issues.js --repo owner/practice --project 3 --owner owner-login --apply
```

The first only prints what it would do. The second makes the labels and
the issues, links each to what blocks it, and adds them to the Project.
It runs as whoever `gh` is signed in as, so the issues are theirs: the
board's owner runs it, never Claude on their behalf (FS-897). It writes
build/mvp-issues.json, each row's issue.

Then, on the board, set each issue's Owner, Workstream, Critical path and
Checkpoint from its body (GitHub's command line cannot set a Project's
own fields without their ids), and assign each person once their GitHub
account is in the repository.

## If "blocked by" is refused

The script lists the links to set by hand, in the issue's Relationships
panel.

The organisation is `dibon-consulting` (FS-953): run it with
`--repo dibon-consulting/finance --owner dibon-consulting`, once the
repository is moved in and the Project made there.
