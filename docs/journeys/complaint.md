---
id: jn-08-complaint
name: JN-08 · A complaint, from the moment it is made to its answer, within 30 days
kind: journey
release: R1
status: draft
law: LR-03
released: 2026.10.15
validated_with: not yet
owner: Solution architect
classification: Internal
review_ids: [FS-548, FS-668, FS-688, FS-763, FS-764]
last_reviewed: 2026-10-16
---

# JN-08 · A complaint, from the moment it is made to its answer, within 30 days

A borrower, a guarantor or a payer tells Roan Capital that something is
wrong: a figure on a statement, a charge, a payment not credited, how a
credit officer or a collector spoke to them, a loan they say they never
took. The lender regulations set the clock (reg 40, lender-rules §2.8):
resolved at once where possible; otherwise acknowledged within seven
days, an oral complaint confirmed in writing if open after 48 hours, and
resolved within 30 days of the customer reporting it; a record kept with
the regulation's fields, and a report to CBK in the form it sets.

**The complaint is Roan Capital's** (service management §6, FS-688): it
decides it and speaks to its customer. Dibon gives it the register, the
clocks, the messages and the evidence, investigates when the platform's
behaviour is in question, and never decides a complaint or contacts the
customer for it.

## 1 · Who and where

- **Who:** the complainant: a borrower, a guarantor, a payer, or someone
  acting for them; whoever at Roan Capital first hears it, usually a
  credit officer; its complaints handler, who owns the complaint; the
  handler's manager, for escalation and for a complaint about staff; two
  approvers for any remedy that moves money.
- **Channel:** in person or by phone (oral); by SMS reply to Roan
  Capital's sender ID, email, letter, or the "something looks wrong" link
  on the borrower's statement page (written). The outcome by SMS and
  email, with a link to the written answer.
- **Starts when:** the customer reports a complaint, through any of
  these, to anyone at Roan Capital, or to Dibon on its behalf.
- **Ends when:** the customer has the outcome in writing, with its
  reasons and where to go if not satisfied; any remedy is posted; the
  record is closed with the regulation's fields.
- **Target:** acknowledged on logging; resolved within 14 days; never
  beyond 30 days from the customer's report (reg 40(5)). Both agreed by
  the owner (FS-764).
- **Moments that matter:** the first contact, where the customer must
  feel heard once, with a reference, and never have to tell the story
  twice; the wait, where they know the date they will be answered by and
  are told if it moves; the answer, which says what was found, what was
  done, and that they may go to CBK if not satisfied.
- **Data:** the complainant's name and phone number, what the complaint
  is about, the loan or payment it concerns, the evidence gathered and the
  outcome; nothing beyond what the complaint needs (privacy PR-19, with
  PR-03 and PR-07).

## 2 · Steps

```
  1 A complaint is made: by phone, in person, SMS, email, letter
    or the statement page
        |-- made to Dibon ............................ passed on the same day (3b)
        |-- about personal data ...................... a rights request too (3c)
        |-- "a loan I never took" .................... fraud first (3d)
        |-- "I never agreed to guarantee" ............ the consent is the evidence (3f)
        |-- a customer who cannot read or write ...... by phone throughout (3l)
        v
  2 Logged the same day, at the time it was reported; the clocks start
        v
  3 Resolved there and then where it can be ......... the outcome sent, closed
        v
  4 Otherwise acknowledged at once, with a reference and a date
        v
  5 Assigned to the complaints handler
        |-- about a member of staff .................. to the manager (3e)
        v
  6 An amount in dispute: collection on it paused
        v
  7 Oral, still open at 48 hours: confirmed in writing
        v
  8 The evidence gathered
        v
  9 The platform's behaviour in question: Dibon investigates
        |-- many customers, one cause ................ an incident (3g)
        v
 10 Decided; any remedy approved by two people and posted
        v
 11 The outcome sent in writing, with where to go next
        |-- not satisfied ............................ CBK, with the file (3h)
        v
 12 Closed with the regulation's fields, kept seven years
        :
    Day 25 with no outcome, or day 30 passed ....... warned, escalated (3a)
    The same matter raised again .................... a new complaint, linked (3i)
    The platform down ............................... logged by hand (3j)
    Stops partway ................................... kept, decided on day 30 (3k)
```

| # | Step | Who | Messages | Capabilities |
|---|---|---|---|---|
| 1 | The customer complains: in person or by phone to a credit officer (oral); by SMS reply to the sender ID, email, letter, or the link on their statement page (written) | Complainant | — | MS-10, MF-38 |
| 2 | Whoever received it logs it in the complaints register the same day: the time the customer reported it (not the time logged), oral or written, what it is about, the loan or payment concerned. The clocks start: 48 hours for an oral complaint, 7 days, 30 days, counted in calendar days, each warning moved to the working day before if it falls on a closure | Whoever received it | — | MF-28, BS-01, KC-15 |
| 3 | Where it can be resolved at once (a figure explained, a receipt resent), it is: the outcome recorded and sent, and the complaint closed (reg 40(2), (5)) | Credit officer | T17 | MF-28 |
| 4 | Otherwise the customer is acknowledged at once, with the complaint's reference and the date they will be answered by; the regulation allows seven days, we send it on logging (reg 40(3)) | Platform | T16 | MF-28, MS-12 |
| 5 | The complaint is assigned to the complaints handler, never to the person it is about | Complaints handler | — | BS-01 |
| 6 | Where it disputes an amount, collection steps on that amount pause while it runs: no reminders or ladder actions on it, the pause recorded on the loan. The rest of the loan carries on | Complaints handler; platform | — | MF-39 |
| 7 | An oral complaint still open at 48 hours is confirmed to the customer in writing: it exists, and it is still being dealt with (reg 40(4)) | Platform | T41 | MF-28, MS-12 |
| 8 | The handler gathers the evidence: the loan, its schedule and statement; the approvals and who made them; the messages sent and their delivery status; the payment's verified journey; the documents; the audit trail | Complaints handler | — | MF-38, MD-05, MS-09, RO-25, RO-27, ID-15 |
| 9 | Where it turns on how the platform behaved, the handler raises a ticket to Dibon at its severity; Dibon investigates and gives its findings for Roan Capital's answer | Complaints handler; Dibon | — | BS-01, RO-25 |
| 10 | Roan Capital decides: upheld, upheld in part, or not upheld. A remedy that moves money (a charge reversed, an overpayment refunded, a repayment re-applied) is approved by two people, neither the one who proposed it, and posted as a correcting entry, never an edit; a new statement follows | Complaints handler; approvers | T15 | MD-01, MD-06, KC-04, MF-22, RL-01 |
| 11 | The customer gets the outcome: a message with a single-use link to the written answer, which gives what was found, what was done, and that they may take it to CBK if not satisfied, or to the Data Commissioner where it concerns their personal data | Platform | T17 | MF-28, ID-17 |
| 12 | The complaint closes with the regulation's record: date received, nature, status, reason if pending, time taken, outcome (reg 40(6)); every action is in the audit trail; the record is kept seven years (proposed) and counted in the report to CBK (reg 40(7)) | Platform | — | MF-28, RO-27, FC-12 |

## 3 · When it goes wrong

| # | At step | What happens | Capabilities |
|---|---|---|---|
| a | 2 to 11 | **The clock runs short.** At day 12 the handler is warned of the 14-day target; at day 25 with no outcome, the handler and the manager are warned; at day 30 the overdue event fires, the manager takes it over, and the breach is recorded with its reason. The customer is told the new date (T41); the complaint is still answered | MF-28, KC-15 |
| b | 1 | **The complaint is made to Dibon,** by email or to our desk. We pass it to Roan Capital the same working day and do not answer it; its clock runs from when we received it, since the customer reported it then | BS-01 |
| c | 1 | **It concerns the customer's personal data:** access, a correction, an objection. It is a rights request with its own, shorter clock (seven days for access, fourteen for a correction; JN-07), and a complaint as well where they complain; the answer names the Data Commissioner | MF-28, ID-17 |
| d | 1 | **"A loan I never took," or a payment the customer did not make.** It goes to the restricted compliance team in the helpdesk; the account is blocked at once; collection on the loan pauses; the evidence (the identity checks, the signing, the phone that confirmed it) is gathered; Roan Capital decides whether to report to the police. The customer still gets the acknowledgement and the answer | BS-01, AC-14, FC-12, ID-15 |
| e | 5 | **The complaint is about a member of staff:** a collector's language, a credit officer's conduct. It goes to the manager, in the restricted team, and the staff member does not see it; the messages and call notes are the evidence (collection conduct, reg 30) | BS-01, MF-26 |
| f | 1 | **A guarantor says they never agreed.** The recorded consent and the signed guarantee are the evidence; without them the guarantor is not liable (reg 42(2); JN-05) | MF-37, ID-15 |
| g | 9 | **Many customers, one cause:** a fault in a statement or a posting. It becomes an incident (incident management); each complaint is still answered on its own clock, linked to the incident | RO-18, MF-28 |
| h | 11 | **The customer is not satisfied** and goes to CBK. Roan Capital answers CBK from the complaint's file; the evidence is exported in a form anyone holding our public keys can verify | RO-25, MF-28 |
| i | 1 | **The same matter is raised again after closing.** It is a new complaint, with new clocks, linked to the first so the handler sees what was said | MF-28 |
| j | 1 to 12 | **The platform is down.** Complaints are taken by phone and written in the fallback log with the time received (JN-19); entered when it returns, with that time, so the clocks are not reset | MF-28 |
| k | 8 to 10 | **The customer stops partway:** asked for a document or a detail, they do not reply. Kept on the complaint; the clock runs on; the handler asks once more, then decides on the evidence held, by day 30. They can resume by replying with the reference before it closes, or after, as in (i) | MF-28 |
| l | 1 to 11 | **The customer cannot read or write,** or prefers to talk. The oral route is always open; the acknowledgement and the outcome are also given by phone, and the call recorded on the complaint (reg 37) | MF-28 |

## 4 · Gaps

| Gap | Release or phase today | In its absence | Proposed |
|---|---|---|---|
| IN-18, the governance view with the complaints clock, and the report to CBK (step 12) | phase 2 | A monthly export from the complaints register with reg 40(6)'s fields, in whatever form CBK sets | Accept for R1 |
| WhatsApp as a channel to complain (MS-06) | Not in R1 (LQ-10) | SMS, phone, email and letter | Accept for R1 |
| Replies in Flowza's inbox (step 1) | Not yet fit for institutions' customers (FS-664 to FS-666) | SMS replies reach messaging's inbound path and are added to the complaint | As JN-16 |

## 5 · Open questions

- **For Roan Capital:** who handles complaints, who is the manager
  above them, and through which channels customers complain today
  (delivery map, open answer 22); whether interest keeps accruing on an
  amount in dispute while the complaint runs, corrected if it is upheld
  (open answer 23).
- **For the Odoo engineer:** whether Helpdesk's service-level policies
  can carry the three clocks, or the lender rules service computes them
  from desk events (lender-rules §2.8).
- **For CBK, through Roan Capital:** the form and frequency of the
  complaints report (reg 40(7)).

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

**[LR-03](../law/LR-03.md) The Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026, Legal Notice No. 191 of 2026.** Regulator: Central Bank of Kenya. Made under: The Central Bank of Kenya Act (Cap. 491), sections 33R, 57(3)(a), (aa) and 57(4); made by the Central Bank of Kenya on 4 September 2026. In force: Yes. A lender already in business applies for a licence or registration within six months of publication (reg 96). Version read: as at 2026-09-29, [Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29).

| Provision | Cited here as | What it requires |
|---|---|---|
| reg 30 | reg 30 | No harassing, shaming or threatening collection: nothing posted to shame a borrower (30(1)(d)), no messages to their contacts (30(1)(e)), no calls outside working hours, no taking of essential personal effects (30(1)(k)); no charges not disclosed in the contract (30(2)); land security recovered under the Land Act (30(3)); thirty days' notice before selling movable security (30(4)) |
| reg 37 | reg 37 | Branches, websites, apps and digital platforms accessible to people with physical, visual, auditory and cognitive impairments, and staff trained to serve them |
| reg 40 | reg 40, reg 40(2), reg 40(3), reg 40(4), reg 40(5), reg 40(6), reg 40(7) | A complaints mechanism made known to customers; acknowledgement within seven days where a complaint cannot be dealt with promptly; an oral complaint unresolved after forty-eight hours confirmed in writing; resolution within thirty days |
| reg 42 | reg 42(2) | A guarantor's consent sought and obtained before the appointment; recourse to a guarantor only after non-judicial recovery from the borrower is exhausted, and after fourteen days' notice of the default |
