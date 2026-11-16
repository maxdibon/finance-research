---
id: gatekeepr-standards-2026-11-14
name: GateKeepr's standards, read for our build — 14 November 2026
kind: review
status: draft
released: unreleased
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-1204]
last_reviewed: 2026-11-16
---

# GateKeepr's standards, read for our build · 14 November 2026

**What was reviewed:** four documents from GateKeepr, Dibon's own access
product: its operative standards (version 1.27.0, 3 October), the two
frozen rationales behind them (its design standard and its Flutter
engineering standard, both 15 September), and its obligations register
(28 September). They are snapshots, now in sources/gatekeepr/, outside
git; nothing is copied from them here.

**Why now:** building has started (FS-1192), and this repository has no
engineering standard. The rules a builder needs are spread across the
architecture, the specs, the traps and the handover, and none says how
code is written, checked or allowed to change the design.

**The short answer:** GateKeepr's standards are worth more to us for
their method than for their content. Six things should be adopted as
they stand, eight adapted, and the rest left with GateKeepr. Much of the
method is already ours: it came across in October (the register, counts
computed and never typed, checks proved by breaking them, the light
obligations, the data classes). What is new is everything about code.

## 1 · Adopt as it stands

| # | What | Where it is in GateKeepr | What it gives the build |
|---|---|---|---|
| A1 | **A rule with no check is a paragraph.** Every engineering rule names what enforces it: a test, a lint, the pipeline, or "review", said plainly and treated as weaker | Standards, rules about the rules; engineering standard, opening | A standard a tired builder cannot quietly skip. Our documents already work this way; our code has no such rule yet |
| A2 | **An enforcement register:** every rule classed as enforced, ratcheted, tracked or review-only, the counts published and checked; the number left to review is the one to watch | Standards, enforcement register | Shows at a glance how much of the standard a machine holds |
| A3 | **Two-sided ratchets:** a count of known debt fails when it rises, and when it falls without the baseline being lowered on purpose | Standards, rules about the rules | Lets us start with debt (the prototype's code, for one) without pretending it is clean, and stops it growing |
| A4 | **No direct clock.** Code never asks the system for the time; it asks an injected clock that tests can freeze | Standards, usage | Interest, arrears days, the cap on a non-performing loan and the end-of-day run all turn on dates. A lender rule that cannot be tested on a chosen date cannot be trusted |
| A5 | **An audit needs its own test:** each check is pointed at a deliberately broken case and must fire, and at a sound one and must stay quiet | Engineering standard, testing | Our "verify by breaking", carried from the documents' checks into the code's |
| A6 | **The phone book is never read.** A contact is chosen through the phone's own picker, one at a time; the app declares no permission to read contacts, and a check on the app's manifest holds that | Design standard, non-negotiables | The Central Bank forbids a lender to reach into a borrower's contacts (the lender regulations' collection conduct rule, LR-03). This makes it impossible rather than forbidden |

## 2 · Adapt

| # | What GateKeepr has | What ours would be | Why it needs changing |
|---|---|---|---|
| B1 | **An ordering of laws**, seven rungs read strictly in order (safety at the gate, Kenyan law, honesty, security, the occupant, the customer, velocity), which breaks the tie when two rules disagree | The same shape with our subject: (1) an institution's money and records are never lost, moved or changed by our fault; (2) Kenyan law; (3) honesty: never claim what we cannot see; (4) security; (5) the borrower, member or sender, where their interest and the institution's part; (6) the institution; (7) speed | We have one deciding line (the institution holds its licence, money and records) and a list of standing rules, but nothing that says which wins. With a soft launch on 30 November, putting speed last, in writing, is the point |
| B2 | **Design is not decided in a code file.** In design the document answers; in build the code answers and the document is consulted; the reference is never edited to match what was built: the build stops and goes back | The same, between this repository and the code: a spec changes by pull request here before the code that needs it merges | The rule that keeps the specs true once a team is writing code against them |
| B3 | **Who may read a name:** four tiers. The job (the person in front of you: no reason asked); the question (a case opened first, the reason before the lookup, the person told); another organisation (consent in advance); an emergency (never delayed, always recorded) | For the vault, the Kapu Console and support: a teller or officer sees the customer they are serving; a manager or Dibon's support opens a case first; an employer, funder or bureau only on recorded consent; break-glass as it is | We log every view today but ask for no reason before it. The review of Flex Money's roles draft found exactly this gap (FS-1200) |
| B4 | **Hold the verdict, not the evidence:** record who checked what, against which source, when and what they found; keep the document only when we must act on it unattended, re-check it on a clock, or need it in our own dispute. A new kind of held document is a change to what we claim, written into the privacy register first | The same test for every document the law does not make an institution keep. The law does make it keep copies of identity documents and due-diligence records for seven years (documents.md), and that comes first | We already keep a register's result and never its record (identity verification). This widens it, and adds the gate: a new document type needs its privacy row before it is built |
| B5 | **Notify along the obligation:** a party is told the state of an obligation it is exposed to, and nothing else; recipients are derived, never ticked on a list; a message carries a change of state, the detail is fetched; fewer messages, each one letting somebody act | The notifier's rule for guarantors, employers, funders and chama members: who hears follows from the loan or the deduction, never from a configured list | We decided what each party may see (FS-531) and that channels carry links only (FS-532), but not how the list of recipients is made. A ticked list is the leak |
| B6 | **Dependencies:** a new one is a decision; security fixes on a clock from the advisory's date; licences by allow-list; no dependency touches restricted data without being named | Our licence rules stand (architecture, licences), with one addition for anything shipped to a phone store: no copyleft. The fix clock is the one platform security already sets | A phone app is distributed, which our server-side licence rules never had to consider |
| B7 | **A registry of outside standards with its drift:** each standard held, at which version, where it bites, and where we knowingly fall short | One table for the platform: accessibility (WCAG 2.2 AA), OWASP's application and mobile standards, ISO 20022, ISO 8601, E.164, the SMS alphabet, CloudEvents, OpenAPI, semantic versions, each with its stated drift | Our standards are named in a dozen places and their gaps in none. A standard listed without its drift is one nobody has checked |
| B8 | **Proof tokens for obligations:** a decision's requirement is met by a path, a test or a table existing | Our "Requires" line (FS-515) extended to name a test or a path under code/ | Decisions will now require code to exist, not only documents |

## 3 · Adopt for the apps, if they are built in Flutter

The engineering and design standards are written for a Flutter app. How
our apps are built is still open (FS-1059). If Flutter is chosen, these
come across as they are, each with its test:

- **Layout:** every row with text gives one child room to flex; nothing
  holding text has a fixed height; every screen is rendered at 100, 130,
  175 and 200 percent text and may not overflow sideways.
- **Accessibility:** a control that announces itself as a button must
  act as one (GateKeepr once shipped a home screen where 19 of 23
  controls did nothing for a screen reader, with every test passing);
  targets of 48dp; a badge's count is in the control's name; contrast of
  4.5 to 1, measured on the real background; no state by colour alone;
  reduced motion honoured.
- **Navigation:** the route table is data; an unknown route fails loudly;
  a screen nothing links to is a defect.
- **Data on the device:** all queries in one place; a change of two facts
  is one transaction; migrations only add.
- **Copy:** no user-facing words in a screen (they live where a test can
  reach them, which is also what Swahili needs); a control says what
  happens; times in 24 hours; facts, never consequences ("Was due 5
  September, 3 days ago"), which is also what the Central Bank's conduct
  rule asks of a lender's messages.
- **Errors:** what happened, why, and the way out; after a failed
  payment, "Nothing has been taken from your account" comes first.
- **Offline is the normal condition,** not an error: the field app
  already assumes it.

If another framework is chosen, the rules hold and the tests are
rewritten.

## 4 · Leave with GateKeepr

- Its first law (a barrier never traps anyone) and everything built on
  it; its rule that access never depends on payment.
- Its visual identity: our institutions' apps carry each institution's
  own look, and our documents have their own design system.
- Dart's formatting and style rules, unless Flutter is chosen.
- Its Master, a single hand-written reference: our reader is generated.

## 5 · Already ours

Record before answering, with nothing filtered at intake; counts
computed, never typed; no count in a handover; attribution at the act;
never claim delivery; nothing closed by inference; the four data classes
and "a pile is not the sum of its rows"; the SMS alphabet; documents
others write, registered; the light form of obligations.

## 6 · Proposed

1. **Write an engineering standard,** a document of its own, from A1 to A6, B2, B6 and B8,
   with its enforcement register, before the second hackathon.
2. **Add the ordering (B1) to the standing rules,** as the owner words
   it: it is his to set.
3. **Put B3, B4 and B5 into the specs they change:** the vault and the
   Kapu Console (B3), the document catalogue and privacy register (B4),
   messaging (B5).
4. **Start the standards registry (B7)** in platform security.
5. **Decide the apps' framework** (FS-1059); section 3 then applies or is
   rewritten.
