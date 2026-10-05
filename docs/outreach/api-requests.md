---
id: api-requests
name: API and statement-feed requests — banks and mobile money
kind: outreach
version: 0.1.0
owner: Solution architect
classification: Internal
last_reviewed: 2026-10-05
---

# API and statement-feed requests — banks and mobile money

**Drafts for the owner to send (FS-125).** Each email can be pasted on its
own. Appendix A is the technical checklist; attach it to every email, so
the detailed questions live in one place.

**Before sending:**

- **Fill in placeholders in the email client, never in this file.**
  Account numbers, shortcodes and contact names stay out of the repository.
  Placeholders are in `[square brackets]`.
- **Ask as a customer, about our own accounts** (FS-126). The partnership
  paragraph in the bank email is optional. Leave it out if the
  relationship manager is the right first contact.
- **For M-Pesa, merge the six GateKeepr clarifications** prepared on 23 Sep
  (FS-128), so one meeting covers both.
- **After sending,** move the partner's stage in docs/partners.md to
  Contacted, with the date.

---

## Email 1 · Banks — NCBA and KCB

Send one per bank. For KCB, address it to the corporate relationship
manager and copy the bank's API or developer-platform team, if you have a
contact there. Leave the optional partnership paragraph out of KCB's
copy: KCB is already a customer (docs/customers.md CU-03), so wider work
goes through that relationship.

**Subject:** API access and automated statements for Dibon's accounts

> Dear [Relationship manager],
>
> Dibon Company Limited banks with [NCBA / KCB] — account(s) [listed in
> the attached form / ending in XXXX]. We would like to connect those
> accounts to our finance systems, so that our receipts and payments are
> reconciled automatically instead of by hand.
>
> We are asking for three things:
>
> 1. **Statement files on a schedule:** end-of-day, and intraday if
>    available, in a standard format such as MT940, CAMT.053 or CSV,
>    delivered by SFTP or host-to-host.
> 2. **API access to our accounts:** balances, transaction history, and
>    real-time notifications of credits and debits.
> 3. **Payment initiation by API:** single and bulk payments from our
>    accounts, with approval under our existing signing mandate.
>
> The attached checklist sets out the technical detail we need. Answers to
> whatever you can share, and a pointer to the right team for the rest,
> would let us start.
>
> Could we meet in the next two weeks to agree the onboarding steps, the
> agreements involved, and any fees?
>
> *[Optional — include only if the relationship manager is also the right
> partnership contact:]* Separately, Dibon builds reconciliation, payments
> and deposit-collection platforms for financial institutions. Once our
> own integration is running, we would welcome a conversation about
> working together more widely.
>
> Kind regards,
> [Name]
> [Title], Dibon Company Limited
> [Phone] · [Email]

---

## Email 2 · Safaricom — M-Pesa

**Superseded** by docs/outreach/partner-requests-2026-10.md, draft 3
(FS-411). Kept as history; send the draft instead.

Address it to the Safaricom business or account manager for Dibon's
shortcode(s), and copy the Daraja or API support team.

**Subject:** Daraja production access and automated statements — Dibon
[paybill / till] [number]

> Dear [Account manager],
>
> Dibon Company Limited operates [paybill / till] [number] for [our own
> collections / our products]. We are integrating M-Pesa directly through
> Daraja, and would like to confirm the production access and statement
> options open to us.
>
> We are asking about four things:
>
> 1. **Production Daraja access for our shortcode(s):** C2B (validation and
>    confirmation), M-Pesa Express (STK Push), B2C, Transaction Status,
>    Account Balance and Reversal.
> 2. **Automated statements:** whether organisation statements can be
>    delivered on a schedule (for example by SFTP) or pulled by API,
>    rather than downloaded from the portal by hand.
> 3. **Acting for our clients:** whether Dibon may integrate with a
>    client's own shortcode, with that client's written consent, so that
>    their M-Pesa receipts reach their own systems. If so, what consent or
>    agreement Safaricom requires.
> 4. **Standing orders (M-Pesa Ratiba):** whether an API is available to
>    third parties, and on what terms.
>
> The attached checklist has the technical detail. [Include the six
> GateKeepr clarifications here, or as a second attachment.]
>
> Could we arrange a call to go through these, and to confirm the
> remaining go-live steps for our production access?
>
> Kind regards,
> [Name]
> [Title], Dibon Company Limited
> [Phone] · [Email]

---

## Email 3 · Airtel Money

**Superseded** by docs/outreach/partner-requests-2026-10.md, draft 4
(FS-394, FS-411). Kept as history; send the draft instead.

Address it to Airtel Money Kenya's merchant or enterprise team, and copy
the Open API team.

**Subject:** Airtel Money API access and statements — Dibon Company
Limited

> Dear [Contact],
>
> Dibon Company Limited is integrating Airtel Money directly into our
> payment and reconciliation systems, starting with our own [merchant
> account / till] [number] in Kenya.
>
> We are asking about four things:
>
> 1. **Production API access:** collections (push payment prompts),
>    disbursements, transaction enquiry, account balance and refunds, with
>    callbacks for each completed transaction.
> 2. **Automated statements:** scheduled delivery or an API for our
>    merchant account's statement, for daily reconciliation.
> 3. **Acting for our clients:** whether Dibon may integrate with a
>    client's own merchant account, with that client's written consent.
> 4. **Other markets:** we plan to serve customers in Uganda, Tanzania,
>    Rwanda, Zambia and Nigeria. Is there a group-level route to
>    the same APIs in those countries?
>
> The attached checklist has the technical detail. Could we arrange a call
> to go through it?
>
> Kind regards,
> [Name]
> [Title], Dibon Company Limited
> [Phone] · [Email]

---

## Email 4 · Telkom — T-Kash

**Superseded** by docs/outreach/partner-requests-2026-10.md, draft 5
(FS-394, FS-411). Kept as history; send the draft instead.

Address it to Telkom Kenya's T-Kash merchant or enterprise team, and copy
the API or developer team, if you have a contact there.

**Subject:** T-Kash API access and statements — Dibon Company Limited

> Dear [Contact],
>
> Dibon Company Limited is integrating mobile money directly into our
> payment and reconciliation systems. We would like to add T-Kash alongside
> M-Pesa and Airtel Money, so that customers can pay us, and our clients,
> on the network they use.
>
> We are asking about four things:
>
> 1. **A merchant account for Dibon,** if we do not already hold one, and
>    the steps to open it.
> 2. **Production API access:** collections (push payment prompts),
>    disbursements, transaction enquiry, account balance and reversals,
>    with callbacks for each completed transaction.
> 3. **Automated statements:** scheduled delivery or an API for our
>    merchant account's statement, for daily reconciliation.
> 4. **Acting for our clients:** whether Dibon may integrate with a
>    client's own T-Kash merchant account, with that client's written
>    consent.
>
> The attached checklist has the technical detail. Could we arrange a call
> to go through it?
>
> Kind regards,
> [Name]
> [Title], Dibon Company Limited
> [Phone] · [Email]

---

## Appendix A · Technical checklist (attach to every email)

**Dibon — integration checklist: accounts, statements and APIs**

Answer what applies. "Not available" is a useful answer too.

**A. Statement files**

1. Formats: MT940, MT942 (intraday), CAMT.053, CAMT.054, CSV, or other.
2. Delivery: SFTP, host-to-host, email or API. Who initiates — you push,
   or we pull?
3. Frequency: end-of-day, intraday (how often), and the cut-off time.
4. History: how far back can a first file go?
5. Corrections: how is a correction or reversal shown — a new entry, or a
   restated file?

**B. Fields on every transaction.** Reconciliation depends on these. Please
confirm which are present:

1. Your own unique transaction reference.
2. Value date and posting date, with time where available.
3. Amount, currency, and debit or credit.
4. Payer or payee name, and their account or phone number.
5. The reference or narrative the payer entered, in full and not
   truncated (state the length limit if there is one).
6. Channel: branch, transfer, PesaLink, RTGS, mobile money, card.
7. Charges and taxes, itemised separately from the principal.
8. Running balance.

**C. APIs**

1. Balance, transaction history and single-transaction lookup.
2. Real-time notifications: webhook or push for credits and debits; retry
   behaviour if our endpoint is down; how we confirm receipt.
3. Payment initiation: single and bulk; how approval works (maker-checker
   on your side, our side, or both); status tracking.
4. Idempotency: how a repeated request is detected.
5. Sandbox: availability, test data, and the path from sandbox to
   production.

**D. Security and onboarding**

1. Authentication: OAuth, certificates, mutual TLS, API keys.
2. IP allow-listing and environment separation.
3. Agreements: API terms, indemnities, data-sharing terms.
4. Fees: set-up, per call, per file or per month.
5. Support: technical contact, hours and escalation route.

**E. Data protection**

We are asking for our own account data and our own transactions, and we
will handle them in line with the Data Protection Act 2019. Credentials
are held only on our servers, never on a device or in a browser. Please
tell us of any condition you attach to how the data is stored or where it
is hosted.
