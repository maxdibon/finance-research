---
id: jn-00-template
name: JN-00 · The journey in a few words
kind: journey
release: R1
status: draft
released: unreleased
validated_with: not yet
owner: Solution architect
classification: Internal
review_ids: [FS-548, FS-668]
last_reviewed: 2026-10-09
---

# JN-00 · The journey in a few words

## 1 · Who and where

- **Who:** the person going through it, by role.
- **Channel:** where it happens.
- **Starts when:** the event that starts it.
- **Ends when:** the outcome, for the person and in the records.
- **Target:** the end-to-end time we hold ourselves to, and any step's own
  SLA.
- **Moments that matter:** the two or three moments where the person is
  anxious or decides whether to trust us, and what we promise there.
- **Data:** what personal data the journey collects, only what each step
  needs, with the privacy rows it falls under.

## 2 · Steps

A flow diagram first: every step by its number at the start of a line,
every §3 row as "(3x)" where it leaves the path, and no capability ids.

```
  1 What happens
        |-- the failure ............. where it ends (3a)
        v
    The outcome
    Stops partway ................ kept, resumed or lapsed (3b)
```

| # | Step | Who | Messages | Capabilities |
|---|---|---|---|---|
| 1 | What happens, in a sentence or two | Role | T01, or — | XX-01 |

## 3 · When it goes wrong

| # | At step | What happens | Capabilities |
|---|---|---|---|
| a | 1 | The failure, and where the person and the record end up | XX-01 |
| b | 1 | **The person stops partway.** What is kept, for how long, how they resume, and when it lapses | XX-01 |

## 4 · Gaps

| Gap | Release or phase today | In its absence | Proposed |
|---|---|---|---|
| XX-02, what it would do here | phase 2 | What people do instead | Accept, or move it, by decision |

## 5 · Open questions

- Questions for the customer, counsel or the owner, with their register
  ids.
