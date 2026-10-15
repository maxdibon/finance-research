---
id: experience
name: Experience — how what we build should feel to use
kind: plan
status: living
owner: Solution architect
classification: Internal
review_ids: [FS-237, FS-637, FS-660, FS-668]
last_reviewed: 2026-10-09
---

# Experience

**What this covers:** the principles every screen, message and manual
follows, and how we make them intuitive rather than hope they are
(FS-660). Delightful experiences are a principle we hold: an institution's
staff, its customers and our own engineers should find the right thing
the easy thing.

## 1 · Principles

1. **Delightful: the right thing is the easy thing.** Fast, calm and
   forgiving. A control we need (step-up, maker-checker) is designed to
   feel like care, not friction: it asks once, at the moment it matters,
   and says why.
2. **Nothing needs reading** (FS-637). Anything a person must confirm or
   be told is also available by voice or as numbers.
3. **Show what is being approved.** The approval screen shows exactly what
   will be sent: the amount, the payee, the account, the product. What is
   approved is what is sent (FS-588).
4. **Say what happens next, and what happened.** Every action ends with
   its result and the next step; every status says only what is known
   (messaging MS-09).
5. **One way to do each thing, the same everywhere.** The same words, the
   same patterns, on the console, the customer pages and the reader.
6. **Ask once.** A fact held in its authority is never asked again
   (architecture §2); sensible defaults; fewer fields.
7. **Prevent, explain, recover.** Prevent the mistake where we can; where
   we cannot, say what went wrong and what to do, in plain words; never a
   code alone. Undo where the money has not moved.
8. **Plain words, in English or Swahili.** KES 5,000, 8 Oct 2026, a loan
   ending 1234: written the way people say them.
9. **On the phones and connections people have:** small screens, slow
   networks, feature phones by USSD and SMS (omni-channel).
10. **Accessible:** WCAG 2.2 at level AA for every web page.

## 2 · How we make it intuitive

| Step | What we do | When |
|---|---|---|
| Understand | The journeys: what each person goes through, step by step, with the moments that matter and a target time for each (docs/journeys/) | Before design |
| Draw before building | Every screen drawn, and the drawing updated with the screen (FS-237) | Before build |
| Try it on people | Five users of each role, on the drawing or a prototype, doing real tasks; what they stumble on is changed. A journey walked through this way becomes "validated", naming who it was tried with | Each round of design, before build and before release |
| One design system | One set of components and words, shared by every screen we build; Odoo's own patterns for the back office | Throughout |
| Write the words | Microcopy written and reviewed like code; Swahili reviewed by a native speaker | Each screen and template |
| Check accessibility | Automated checks in the pipeline, and a person with a screen reader each release | Each release |
| Measure | Task success, time on task, errors, a usability score (SUS) per role; support tickets per task | After each release |
| Listen | Help desk requests tagged by task (service management); a request repeated three times is a design change | Continuously |

**Measures we hold ourselves to** (proposed): nine in ten people complete
each core task unaided on first try; a usability score of 80 or more for
staff; no task in the top ten of help desk requests for two releases
running.

## 3 · Moments that matter

Each journey names the two or three moments where a person is anxious, or
decides whether to trust us (docs/journeys/README.md, rule 7). At each,
we promise the same things:

- **They know where they stand:** what is happening, who has it, and when
  they will hear next; never left guessing.
- **They know what it costs before they commit:** the full cost, in plain
  words, before any signature.
- **Bad news is plain and calm:** what happened, what they can do, and
  nothing that shames or threatens (CBK lender regulations reg 30).
- **The money's arrival is confirmed at once,** with a reference they can
  quote.

## 4 · Standards we follow

| Standard | For |
|---|---|
| ISO 9241-210, human-centred design | The process in §2: understand, design, evaluate with users, repeat |
| Journey mapping and service blueprints (Nielsen Norman Group) | The journeys: what people do, think and feel, and what happens behind each step (docs/architecture/runtime.md) |
| GOV.UK Service Standard | The questions each journey is checked against (docs/journeys/README.md) |
| ISO 24495-1, plain language | Every word on a screen, in a template, in a manual |
| WCAG 2.2, level AA | Every web page |
| Kenya's draft Financial Consumer Protection Framework (docs/regulation.md) | Fair treatment: disclosure, complaints, statements |
| Data Protection Act: privacy by design | Each journey collects only what each step needs (its "Data" line) |
| Behaviour-driven tests (Gherkin) | Journeys as executable scenarios (docs/testing.md §1) |

## 5 · Training

What we cannot make obvious, we teach: docs/training/README.md. Training
also tests the design: a task that needs a long manual is a task to
redesign.

## 6 · Open

- **No designer on the team today** (docs/operating-model.md). Proposed:
  contract a product designer before the first screens are drawn
  (omni-channel, the approval console, the customer pages).
- The design system's base: proposed, a small set of our own components
  for our pages, and Odoo's for the back office.
