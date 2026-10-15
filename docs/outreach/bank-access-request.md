---
id: bank-access-request
name: A customer's request to its own banks — payment instructions, status and statements
kind: outreach
status: draft
released: 2026.10.15
version: 0.1.0
owner: Solution architect
classification: Internal
review_ids: [FS-586, FS-587, FS-733, FS-767]
last_reviewed: 2026-10-12
---

# A customer's request to its own banks

**What this is:** a letter an institution we serve sends to each bank it
pays out through, asking for the access our rails need to send, confirm,
cancel and reverse its payment instructions (FS-586, FS-587). The
institution sends it on its own letterhead, under its own relationship;
we do not write to its banks for it. It names no customer here: fill in
the brackets per institution and per bank.

Send one letter per bank, to the institution's relationship manager,
copying the bank's cash-management or API team where there is one.

**Subject:** Payment instructions, status and statements for our accounts

> Dear [Relationship manager],
>
> [Institution] holds account(s) [ending in XXXX] with [Bank], from which
> we disburse loans and make other payments. We are moving these payments
> onto our lending platform, run for us by Dibon Company Limited, so that
> each payment is approved in our system, sent to you, and confirmed back
> without retyping.
>
> We would like to agree the following, in whichever form [Bank] offers:
>
> 1. **Sending payment instructions:** by API; or by host-to-host files
>    over SFTP (ISO 20022 payment initiation, or your own format); or, as
>    a start, a bulk-payment file uploaded to internet banking and released
>    there by our authorised signatories.
> 2. **Status of each instruction:** accepted, rejected with a reason,
>    processed, and returned, by API, webhook or status file, carrying our
>    own reference on every message.
> 3. **Statements:** end-of-day, and intraday if available, as MT940,
>    CAMT.053 or CSV, by SFTP or API; and, until then, a daily statement
>    by email as CSV, Excel or MT940 rather than PDF.
> 4. **Account-name validation:** confirming the account holder's name
>    for a destination account before we pay it, where you offer it.
> 5. **Cancelling, recalling and reversing:** how we cancel an instruction
>    before you process it, recall one after, and how returns and
>    reversals reach us, with their time limits and charges.
> 6. **Cut-off times** for each payment type (internal transfer, EFT,
>    RTGS, PesaLink, SWIFT), and your holiday calendar.
> 7. **Our signing mandate:** how approvals in our system relate to the
>    signatories on our account, and whether payments within agreed limits
>    may go straight through.
> 8. **Security:** the authentication you require (certificates, IP
>    allow-listing, signed files), and a test environment.
>
> Could we meet in the next two weeks with your cash-management team, and
> Dibon's, to agree the steps, the agreements and any fees?
>
> Kind regards,\
> [Name]\
> [Title], [Institution]\
> [Phone] · [Email]

**After the reply:** each bank's answers go into the partners register
(docs/partners.md) under that bank, and the channel chosen per bank into
rails RL-07.
