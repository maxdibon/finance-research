---
id: onboarding-pack
name: Onboarding pack — starter templates for an institution's business customers and partners
kind: guide
status: living
released: unreleased
owner: Product lead, business suite
classification: Internal
review_ids: [FS-1019, FS-1021, FS-1022, FS-1024, FS-1025, FS-1026, FS-1058, FS-1100]
last_reviewed: 2026-11-05
---

# Onboarding pack

**What this is** (FS-1019, FS-1021): the starter templates Dibon gives each
institution for onboarding its business customers and its partners. Each
institution adopts them and edits them with its own counsel: **the
wording below is starter wording, for counsel to finalise;** the
institution's adopted version is its own, kept in its instance, never
here. Business suite BS-25.

**Its look and its ids** (FS-1024, FS-1025): the pack is DC-FS-TM-ONB-001
(design-system §7). Each template, once the institution adopts it, is
**the institution's document, in its look** (design-system §6, its
theme), made in Word through the design system's agreement builder, no
whimsy; numbered by the institution's own scheme. Each is a kind in the
documents catalogue, which sets how long it is kept: B1 and B2 are
DT-09, B3 DT-10, B4 DT-15 and DT-40, B5 DT-18, P1 to P3 DT-41 to DT-43.

**How a template is used:**

1. **Filled, not retyped:** every field comes from a record already
   held: the business's KYB record (ID-22), its people (ID-25), the
   mandate's rules (mandates), the partner's record (lending-partners §3).
2. **Signed electronically** in Odoo Sign, each signer with a code to
   their bound phone (BS-02); whether that is enough for each template
   is LQ-24, and whether a seal is wanted LQ-25.
3. **Filed in the vault** (ID-15) with its evidence (who signed, when,
   from which phone), the contract record kept in Odoo (back-office rule
   7).
4. **Seen afterwards** in the Documents section of each channel (§3).
5. **A blank, for paper:** where an institution still takes paper, the
   blank is downloadable from the institution's website and the onboarding
   flow; a paper copy is scanned in through the vault's intake (ID-15),
   never kept as the only copy.

## 1 · For a business customer

| Template | Signed by | Fields, and where they come from |
|---|---|---|
| **B1 · Board resolution** | The directors, as the business's articles require; its secretary where it has one | The business's name, registration number and tax PIN (registry record, ID-07); the meeting's date; the facility or account resolved on; the administrators and signatories named, each with ID number and phone (ID-25); the mandate adopted (B2) |
| **B2 · Account mandate** | The administrators named in B1 | Who may start a payment or a request, who must approve, how many at each level and above what amount, how long an instruction waits before it lapses; the users' profiles granted from it (ID-25; approval engine, MD-01, MD-09) |
| **B3 · Beneficial ownership declaration** | A director | Each beneficial owner, with their ID, nationality, the share or control held and how; checked against the company's own register where the law requires one (LR-35) |
| **B4 · Directors' consent to checks** | Each director | Consent, or acknowledgement where the law gives another basis (LQ-26), to the registry, the credit bureau and sanctions screening being checked for them |
| **B5 · Director's personal guarantee** | Each guaranteeing director | The facility guaranteed, the limit, the guarantor's rights (statements, notice before demand; lender-rules; MF-37), the guarantor's consent recorded before appointment (LQ-27) |

**B1 · Board resolution, starter wording** (for counsel to finalise):

> Resolutions of the directors of **[Company name]**, registration
> number **[number]**, passed at a meeting held on **[date]** [or: in
> writing, signed by all the directors].
>
> 1. That the Company **[opens accounts with / applies for a facility of
>    KES [amount] from]** **[Institution]**, on the terms the Institution
>    offers from time to time.
> 2. That **[name, ID number]** and **[name, ID number]** are appointed
>    the Company's administrators for its dealings with the Institution,
>    with authority to grant and withdraw the access of the Company's
>    other users within the mandate below.
> 3. That the account mandate attached is adopted, and that the
>    Institution may act on instructions given under it until it
>    receives written notice of a change signed under a further
>    resolution.
> 4. That any **[one / two]** director(s) may sign the documents needed
>    to give effect to these resolutions.
>
> Signed by the directors: **[names, signatures, dates]**.

**B2 · Account mandate, starter wording** (for counsel to finalise):

> **Account mandate of [Company name] with [Institution]**
>
> | Act | Who may start it | Who must approve | Up to |
> |---|---|---|---|
> | Payments | **[users]** | **[one administrator]** | KES **[amount]** |
> | Payments above that | **[users]** | **[two administrators]** | No limit |
> | Loan requests | **[administrators]** | **[a director not the requester]** | **[facility limit]** |
> | Users and their rights | **[administrators]** | **[a second administrator]** | — |
>
> An instruction not approved within **[hours]** lapses.

## 2 · For a partner

| Template | Signed by | Fields, and where they come from |
|---|---|---|
| **P1 · Partner agreement** | The partner's authorised signatories; the institution | The partner's record (lending-service §5): the products it takes part in, its settlement accounts, its exposure cap, its first-loss share, what it pays towards the price |
| **P2 · Data-sharing agreement** | As P1 | What it shares, why, how often, for how long (raw files at most 90 days, PR-21), the borrowers' consent (each partner apart, FS-1004), security, a breach told within 48 hours, deletion at exit, no transfer outside Kenya |
| **P3 · Letter naming the partner's administrators** | A director of the partner | Its administrators and field agents' supervisors, each with ID number and phone (ID-25), and the limits the institution approved for them |

**P1 · Partner agreement, the clauses to cover** (counsel drafts):
the products and roles; the partner's warranty that its data and invoices
are accurate; goods returned or never delivered refunded to the loan, not
the borrower (LQ-20); the first-loss share and how it is called; fraud
and what follows; signed events to its system (lending-partners §6);
audit rights; data protection by P2; exposure caps and freezes; fees;
term, exit and the run-off of open loans.

## 3 · Where documents are kept, and how people get them

FS-1022. **They are kept in one place, the vault** (ID-15), for every
institution in its own instance; every channel is a window onto it,
reading through one documents interface (ID-17, ID-27), each person
seeing only what their profile allows:

| Who | Where they see their documents | What |
|---|---|---|
| A customer, for themselves | The **Documents** section of the customer app and the internet banking website, in their "Me" profile; or their own page, from a link, without the app | **To sign**, **Signed** (agreements and key facts as signed, guarantees), **Statements and receipts**, **Notices** |
| A business's people | The same section, in the business's profile, by their rights: an administrator sees all; a user with fewer rights, statements only | The business's signed resolutions (B1), mandate (B2), declarations (B3), agreements, statements |
| A partner's office | The **Documents** section of the partner portal | Its agreements (P1 to P3), statements of what it was paid, its data's acknowledgements |
| The institution's staff | The client's record in the staff workspace | Everything for that client, as their role allows |

**Why not the portal itself:** Odoo's portal is a window, not a store.
Documents with a person's details live only in the vault (architecture
§2: Odoo holds no documents with personal data beyond business
contacts), so the portal shows them through the documents interface,
like every other channel. **Downloads** are PDFs, logged, and shared as
the person chooses (ID-17); **blanks** for the paper route are on the
institution's website.
