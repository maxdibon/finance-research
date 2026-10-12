---
id: bank-api-requests-2026-10
name: Bank requests, October 2026 — statements, real-time alerts and balances for Dibon's accounts
kind: outreach
version: 0.1.0
owner: Solution architect
classification: Internal
review_ids: [FS-033, FS-125, FS-126, FS-344, FS-691, FS-715, FS-716]
last_reviewed: 2026-10-12
---

# Bank requests, October 2026

**Three letters for the owner to send (FS-715, FS-716):** to NCBA and
KCB, which hold Dibon's operational accounts, and to SBM Bank, which
runs Dibon's corporate credit card. Each asks for statements without
downloading them, an alert the moment money moves, and balances on
demand. They replace
Email 1 in [api-requests.md](api-requests.md), which was drafted on 5
October and not sent. Appendix A, the technical checklist, goes with
every letter.

**Before sending:**

- **Fill in names, account numbers and contacts in the email client,
  never in this file.** Placeholders are in `[square brackets]`.
- **Ask as a customer, about our own accounts** (FS-126). Our own
  accounts come first (rails RL-07): what we learn here is what we offer
  institutions later. The card's feed is for our own books
  (business suite: expenses), not a rail.
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
> Dibon Company Limited holds its operational accounts with NCBA:
> account(s) [ending in XXXX]. We
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
> Dibon Company Limited holds its operational accounts with KCB:
> account(s) [ending in XXXX]. We
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

## Letter 3 · SBM Bank: Dibon's credit card

**To:** [Relationship manager or card services], SBM Bank (Kenya); copy
[card services or digital banking team]

**Subject:** Automated statements and real-time alerts for Dibon's
corporate credit card

> Dear [Relationship manager],
>
> Dibon Company Limited holds a corporate credit card with SBM Bank:
> card(s) [ending in XXXX]. We would like to connect the card to our
> finance systems, so that each purchase is recorded against its receipt
> and its budget as it happens, instead of from the monthly statement.
>
> We are asking for four things, in whichever form SBM Bank offers:
>
> 1. **The card statement without downloading it:** each month, and the
>    transactions so far at any time, as a file (CSV, OFX or similar) or
>    by API.
> 2. **An alert for each transaction:** when a purchase is authorised,
>    and when it settles, by webhook, push or email we can read
>    automatically, with the merchant's name and the amount.
> 3. **The credit available,** the limit and the balance due, on demand.
> 4. **Each transaction's details:** the merchant, its category, the
>    original currency and amount, the exchange rate and any fees,
>    shown apart.
>
> The attached checklist sets out the detail. We ask only for the last
> four digits of a card number, never the full number. Could we meet in
> the next two weeks to agree the steps and any fees?
>
> Kind regards,
> [Name]
> [Title], Dibon Company Limited
> [Phone] · [Email]

**Attach Appendix B, not A.**

---

## Appendix A · Technical checklist (attach to letters 1 and 2)

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

---

## Appendix B · Card checklist (attach to letter 3)

**Dibon — connecting our corporate credit card**

Answer what applies; "not available" is a useful answer too.

**A. Statements and transactions**

1. Formats: CSV, OFX, a bank format, or by API; whether you send it or
   we fetch it.
2. Transactions so far in the cycle, at any time, not only the monthly
   statement.
3. How a refund, a reversal or a disputed charge appears.

**B. Alerts**

1. An alert when a purchase is authorised, and again when it settles.
2. By webhook, push, or an email in a fixed format; how soon after the
   purchase.
3. Declined attempts, and changes to the limit.

**C. Fields on every transaction**

1. Your unique reference, and the authorisation code.
2. Authorisation date and posting date, with the time.
3. The merchant's name, city and category code (MCC).
4. The original currency and amount, the exchange rate, and the amount
   in shillings.
5. Fees and taxes, apart from the purchase.
6. The card's last four digits and its holder, where there is more than
   one card. **Never the full card number:** we do not want it, and will
   not store it.

**D. Balances and limits**

1. The limit, the credit available and the balance due, by API or on
   request.
2. The statement date and the payment due date.

**E. Security and onboarding**

1. Authentication for any API; a test environment.
2. Allow-listing: we run from two sites in Kenya, so both sites'
   addresses must be allowed, and alerts sent to a name, not one address.
3. Agreements, fees, and the time each step takes.

**F. How we handle the data**

Our own card's data, handled under the Data Protection Act, 2019, in
Kenya. We never receive or store a full card number, which keeps us out
of the card-data scope of PCI DSS.
