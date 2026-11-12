---
id: decisions
name: Decisions — what each cost, and what was argued against it
kind: register
status: living
released: 2026.10.16
owner: Solution architect
classification: Internal
last_reviewed: 2026-11-12
---

# Decisions — what each cost, and what was argued against it

REVIEW.md records **that** something was decided. This file records **what
the decision gave up**, so it can be argued with later (FS-076). An entry
exists for every decision that changed the design. A decision that only
confirmed something gets no entry.

**Two kinds of statement, marked separately.** *Argued* means it was said
in the conversation that produced the decision. *Inferred* means Claude
wrote it down afterwards and nobody has confirmed it yet. An inferred cost
that turns out to be wrong is corrected here, and the correction is kept.

**Every decision names what it requires to exist** (FS-515), from
FS-490 on: a `Requires:` line listing capability ids, files under docs/,
a file's § section, or "quoted text" the file must contain. The check
fails when any of them is missing, so a decision cannot stay a paragraph.
"nothing" stands alone for a decision that only confirmed something.

**Nothing is superseded quietly.** A reversed decision keeps its entry,
gains a line saying what replaced it and why, and the new decision gets
its own entry.

---

## Where the entries are

FS-1053. **A file for each hundred ids,** in id order, as the register's
closed rows are in review/: the entries had grown past what one page
reads well. An entry is added to the file for its row's hundred, and the
check reads them all.

| Ids | Entries | First and last |
|---|---|---|
| [001 to 099](decisions/000-099.md) | 15 | FS-001 to FS-081 |
| [100 to 199](decisions/100-199.md) | 5 | FS-124 to FS-193 |
| [200 to 299](decisions/200-299.md) | 6 | FS-223 to FS-288 |
| [300 to 399](decisions/300-399.md) | 12 | FS-311 to FS-388 |
| [400 to 499](decisions/400-499.md) | 13 | FS-402 to FS-498 |
| [500 to 599](decisions/500-599.md) | 21 | FS-500 to FS-594 |
| [600 to 699](decisions/600-699.md) | 20 | FS-606 to FS-674 |
| [700 to 799](decisions/700-799.md) | 8 | FS-703 to FS-799 |
| [800 to 899](decisions/800-899.md) | 6 | FS-803 to FS-896 |
| [900 to 999](decisions/900-999.md) | 15 | FS-900 to FS-996 |
| [1000 to 1099](decisions/1000-1099.md) | 15 | FS-1004 to FS-1103 |
| [1100 to 1199](decisions/1100-1199.md) | 26 | FS-1109 to FS-1193 |
