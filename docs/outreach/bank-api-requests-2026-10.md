---
id: bank-api-requests-2026-10
name: Bank requests, October 2026 — statements, real-time alerts and balances for Dibon's accounts
kind: outreach
version: 0.1.0
owner: Solution architect
classification: Internal
review_ids: [FS-033, FS-125, FS-126, FS-344, FS-691, FS-715]
last_reviewed: 2026-10-12
---

# Bank requests, October 2026

**Three letters for the owner to send (FS-715),** to NCBA, KCB and SBM
Bank, about Dibon's own accounts: statements without downloading them,
an alert the moment money moves, and balances on demand. They replace
Email 1 in [api-requests.md](api-requests.md), which was drafted on 5
October and not sent. Appendix A, the technical checklist, goes with
every letter.

**Before sending:**

- **Fill in names, account numbers and contacts in the email client,
  never in this file.** Placeholders are in `[square brackets]`.
- **Ask as a customer, about our own accounts** (FS-126). Our own
  accounts come first (rails RL-07): what we learn here is what we offer
  institutions later.
- **To the relationship manager,** copying the bank's cash-management or
  API team where we have a contact.
- **KCB is also a customer of ours** (customers CU-03): its letter leaves
  out the partnership paragraph, and goes through that relationship.
- **NCBA is also the disbursement bank of an institution we serve,**
  which writes to NCBA separately under its own relationship
  ([bank-access-request.md](bank-access-request.md)). The letter does not
  name it.
- **After sending:** each bank's stage in [partners](../partners.md) moves
  to Contacted, with the date; each answer goes under that bank, and the
  channel chosen into rails RL-07.

---

## Letter 1 · NCBA

**To:** [Relationship manager], NCBA Bank Kenya; copy [cash management
or API team]

**Subject:** Automated statements, real-time alerts and balances for
Dibon's accounts

> Dear [Relationship manager],
>
> Dibon Company Limited banks with NCBA: account(s) [ending in XXXX]. We
> would like to connect these accounts to our finance systems, so that
> our receipts and payments are recorded and reconciled as they happen,
> instead of from statements downloaded by hand.
>
> We are asking for four things, in whichever form NCBA offers:
>
> 1. **Statements without downloading them:** end-of-day, and intraday
>    where available, as MT940, CAMT.053 or CSV, by API or host-to-host
>    SFTP.
> 2. **An alert the moment money moves:** a notification of each credit
>    and debit as it posts, by webhook or push, or as intraday files
>    (MT942 or CAMT.054), carrying the payer's reference in full.
> 3. **Balances on demand:** the current and available balance of each
>    account, by API.
> 4. **A transaction found by its reference,** so a payment can be
>    confirmed without waiting for the statement.
>
> So that we can plan further, we would also like to know what NCBA
> offers for sending payments by API or host-to-host, for status reports
> on each payment, and for confirming an account holder's name before we
> pay.
>
> The attached checklist sets out the detail we need. Answers to what you
> can share now, and the right team for the rest, would let us start.
> Could we meet in the next two weeks with your cash-management team to
> agree the steps, the agreements and any fees?
>
> Separately, Dibon builds lending, payment and reconciliation platforms
> for financial institutions in Kenya. Once our own connection is
> running, we would welcome a conversation about working together more
> widely.
>
> Kind regards,
> [Name]
> [Title], Dibon Company Limited
> [Phone] · [Email]

---

## Letter 2 · KCB

**To:** [Corporate relationship manager], KCB Bank Kenya; copy [API or
developer platform team]

**Subject:** Automated statements, real-time alerts and balances for
Dibon's accounts

> Dear [Relationship manager],
>
> Dibon Company Limited banks with KCB: account(s) [ending in XXXX]. We
> would like to connect these accounts to our finance systems, so that
> our receipts and payments are recorded and reconciled as they happen,
> instead of from statements downloaded by hand.
>
> We are asking for four things, in whichever form KCB offers:
>
> 1. **Statements without downloading them:** end-of-day, and intraday
>    where available, as MT940, CAMT.053 or CSV, by API or host-to-host
>    SFTP.
> 2. **An alert the moment money moves:** a notification of each credit
>    and debit as it posts, by webhook or push, or as intraday files
>    (MT942 or CAMT.054), carrying the payer's reference in full.
> 3. **Balances on demand:** the current and available balance of each
>    account, by API.
> 4. **A transaction found by its reference,** so a payment can be
>    confirmed without waiting for the statement.
>
> So that we can plan further, we would also like to know what KCB offers
> for sending payments by API or host-to-host, for status reports on each
> payment, and for confirming an account holder's name before we pay.
>
> The attached checklist sets out the detail we need. Answers to what you
> can share now, and the right team for the rest, would let us start.
> Could we meet in the next two weeks to agree the steps, the agreements
> and any fees?
>
> Kind regards,
> [Name]
> [Title], Dibon Company Limited
> [Phone] · [Email]

---

## Letter 3 · SBM Bank

**To:** [Relationship manager], SBM Bank (Kenya); copy [cash management
or digital banking team]

**Subject:** Automated statements, real-time alerts and balances for
Dibon's accounts

> Dear [Relationship manager],
>
> Dibon Company Limited banks with SBM Bank: account(s) [ending in XXXX].
> We would like to connect these accounts to our finance systems, so that
> our receipts and payments are recorded and reconciled as they happen,
> instead of from statements downloaded by hand.
>
> We are asking for four things, in whichever form SBM Bank offers:
>
> 1. **Statements without downloading them:** end-of-day, and intraday
>    where available, as MT940, CAMT.053 or CSV, by API or host-to-host
>    SFTP.
> 2. **An alert the moment money moves:** a notification of each credit
>    and debit as it posts, by webhook or push, or as intraday files
>    (MT942 or CAMT.054), carrying the payer's reference in full.
> 3. **Balances on demand:** the current and available balance of each
>    account, by API.
> 4. **A transaction found by its reference,** so a payment can be
>    confirmed without waiting for the statement.
>
> So that we can plan further, we would also like to know what SBM Bank
> offers for sending payments by API or host-to-host, for status reports
> on each payment, and for confirming an account holder's name before we
> pay.
>
> The attached checklist sets out the detail we need. Answers to what you
> can share now, and the right team for the rest, would let us start.
> Could we meet in the next two weeks to agree the steps, the agreements
> and any fees?
>
> Separately, Dibon builds lending, payment and reconciliation platforms
> for financial institutions in Kenya. Once our own connection is
> running, we would welcome a conversation about working together more
> widely.
>
> Kind regards,
> [Name]
> [Title], Dibon Company Limited
> [Phone] · [Email]

---

## Appendix A · Technical checklist (attach to every letter)

**Dibon — connecting our accounts: statements, alerts, balances**

Answer what applies; "not available" is a useful answer too.

**A. Statements**

1. Formats: MT940, MT942 (intraday), CAMT.052 (intraday report),
   CAMT.053 (end of day), CAMT.054 (each credit or debit), CSV, other.
2. Delivery: API, host-to-host SFTP, or email; whether you push or we
   pull.
3. Timing: end-of-day cut-off; how often intraday reports come.
4. History: how far back the first file can go.
5. Corrections: how a correction or reversal appears: a new entry, or a
   restated file.

**B. Real-time alerts**

1. How we are told of each credit and debit: webhook, push, or a file
   per transaction.
2. How soon after posting the alert arrives.
3. If our endpoint does not answer: how often you retry, and for how
   long; how we acknowledge.
4. Whether alerts are signed, and with what.
5. Whether we can ask for any alert again, by its reference, if we
   missed it.

**C. Fields on every transaction.** Reconciliation depends on these:

1. Your own unique reference.
2. Value date and posting date, with the time.
3. Amount, currency, debit or credit.
4. The payer's or payee's name, and their account or phone number.
5. The reference the payer entered, in full; its length limit, if any.
6. Channel: branch, internal transfer, EFT, RTGS, PesaLink, mobile
   money, card.
7. Charges and taxes, apart from the principal.
8. The balance after the transaction.

**D. Balances and lookups**

1. Current and available balance by API, and how fresh it is.
2. A single transaction found by your reference, or by ours.
3. Limits on how often we may call.

**E. For later: payments**

1. Sending single and bulk payments by API or host-to-host (ISO 20022
   pain.001, or your format), and how approval works: on your side, ours,
   or both, and whether payments within agreed limits may go straight
   through.
2. Status reports on each payment (pain.002), carrying our reference.
3. Confirming an account holder's name before paying.
4. Cancelling, recalling and returns, with their time limits.
5. Cut-off times for each payment type, and your holiday calendar.

**F. Security and onboarding**

1. Authentication: OAuth, certificates, mutual TLS, API keys.
2. **Allow-listing: we run from two sites in Kenya, so both sites'
   addresses must be allowed, and your alerts sent to a name, not one
   address.**
3. A test environment, its test data, and the path to production.
4. Agreements, fees (set-up, per call, per file, per month), and the
   time each step takes.
5. Support: a technical contact, hours, how to escalate; maintenance
   windows, and how you tell us of them.

**G. How we handle the data**

We are asking for our own accounts' data and will handle it under the
Data Protection Act, 2019, in Kenya. Credentials and certificates are
held only on our servers, in a key store they never leave; never on a
laptop or in a browser. Please tell us of any condition you attach to
how the data is stored or where it is hosted.
