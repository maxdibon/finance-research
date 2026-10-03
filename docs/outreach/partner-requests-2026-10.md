---
id: partner-requests-2026-10
name: Partner requests, October 2026
kind: outreach
version: 0.1.0
owner: Commercial lead
classification: Internal
last_reviewed: 2026-10-03
---

# Partner requests, October 2026

Drafts that follow the partner research of 2026-10-03 (FS-380 to
FS-388). Fill the brackets and send from your own address; names of the
people you write to stay out of this file. Log each one in docs/partners.md
under the partner's last event.

## 1 · A banking-as-a-service bank: Collect and Escrow partner

For the nationwide microfinance bank with a published API-banking offer
(partners PT-34; its name is in sources/confidential/). Its process starts
with a conversation, so this asks for one. It goes further if a partner
with volume comes with it (PT-40).

**Subject:** Partnership: Kapu Collect on [Bank]'s API banking

> Dear [name],
>
> I'm the Technology Lead at Dibon Consulting. We build Kapu Collect: the
> software that lets a bank take deposits gathered by partners such as
> collection firms, fundraising platforms and high-volume businesses. Each
> deposit lands in a real account at the bank, in the end customer's name.
> We never hold the money.
>
> Collect ran in production at Onit Bank from February 2025 to June 2026,
> with W-Harambee as the partner, on M-Pesa collections and payouts,
> account opening, statements and operational monitoring. Onit has since moved to
> more traditional banking, and we are looking for a bank that makes
> partnerships like this its business. Your API banking offer is the
> closest match we have found.
>
> What we would bring:
>
> - **Partners with volume**, starting with [W-Harambee, if agreed], whose
>   contributors' funds need a regulated home.
> - **The operations around the account**: partner onboarding, mobile-money
>   collection, statements, daily reconciliation against your core, and
>   partner portals.
> - **The paperwork for your approvals**: a due-diligence pack for the
>   outsourcing approval CBK requires, covering security, continuity, exit
>   and audit rights.
>
> Could we have a first conversation in the next two weeks? I'm flexible
> Tuesday to Thursday, between 10am and 6pm.
>
> With thanks,
>
> [Your name]
> Technology Lead, Dibon Consulting
> +254 792 745 509 · [your email]

## 2 · NPDM: letter of intent for direct register access

To National Population Data Management (formerly IPRS), the first step of
the access process (compliance LC-12, partners PT-29). Send on letterhead,
signed by a director.

> [Date]
>
> The Director
> National Population Data Management
> [Address]
>
> **Letter of intent: access to the Integrated Population Register for
> identity verification**
>
> Dibon Company Limited, trading as Dibon Consulting, builds software that
> banks, Saccos and microfinance institutions use to open accounts and
> verify their customers. We are registered with the Office of the Data
> Protection Commissioner as a data processor [certificate number].
>
> We wish to connect to the register to verify the national identity
> numbers of our customers' customers at account opening, with each
> individual's consent, as part of the customer due diligence our bank and
> Sacco customers carry out under the Proceeds of Crime and Anti-Money
> Laundering Act.
>
> We expect about [number] checks a month in the first year. We understand
> the requirements to include a signed memorandum of understanding, a KRA
> tax compliance certificate, a business permit, our data protection
> registration, evidence of statutory deductions, our registration
> certificate and our security policy, and will provide each on request.
>
> Please let us know the next step.
>
> Yours faithfully,
>
> [Name], [Title], for Dibon Company Limited
> +254 792 745 509 · [email]

## 3 · Safaricom: Daraja security APIs and Hakikisha

To Safaricom's Daraja or M-Pesa business team (compliance LC-13, rails
RL-20, RL-21, RL-22). Asks what authorisation Dibon needs, and whether it
is held by Dibon or by each bank and Sacco customer.

**Subject:** Daraja: SIM swap, IMSI, Hakikisha and Pull Transactions for
Dibon's banking platform

> Dear Daraja team,
>
> Dibon Consulting builds payment and banking software on M-Pesa. Our
> Collect and Gateway products ran in production at Onit Bank from
> February 2025 to June 2026 on M-Pesa Express, C2B, B2C, B2B, transaction
> status, account balance and reversals.
>
> For our next release we would like to add:
>
> 1. **SIM-swap query and IMSI checks**, before our bank and Sacco
>    customers' members move money.
> 2. **Hakikisha (B2C and B2B)**, to confirm the recipient's registered name
>    before every payout.
> 3. **Pull Transactions**, so that a payment whose confirmation never
>    arrives is still found and matched.
>
> Could you tell us:
>
> - what authorisation each API needs, and whether Dibon can hold it as a
>   technology provider or each institution must apply;
> - the commercial terms, including any free quota; and
> - the documents you need from us.
>
> We hold a PRSP licence from the Communications Authority and are
> registered with the Data Commissioner as a data processor.
>
> With thanks,
>
> [Your name]
> Technology Lead, Dibon Consulting
> +254 792 745 509 · [your email]

## 4 · Airtel Money: launch, and the same checks

To Airtel Money Kenya's business or API team (rails RL-04, compliance
LC-13). An Airtel integration was probably built for Onit Bank and never
launched (FS-393); confirm that with the technical lead before sending, and
adjust the second paragraph if it was not.

**Subject:** Airtel Money APIs for Dibon's banking platform

> Dear Airtel Money team,
>
> Dibon Consulting builds payment and banking software for banks, Saccos
> and microfinance institutions. Our Collect and Gateway products ran in
> production at Onit Bank from February 2025 to June 2026 on M-Pesa, and
> through Onit's own agreement with Airtel we checked customers' phone
> numbers against their registered names at account opening.
>
> We built an Airtel Money integration for that deployment but did not
> launch it. We would now like to take it live for our next partner bank
> and our Sacco and MFI customers, and to add:
>
> 1. **Collections and disbursements**, with transaction status, balance
>    and refunds.
> 2. **A check of a phone number against the registered name**, at account
>    opening and before every payout.
> 3. **A SIM-change check**, before money moves, if you offer one.
> 4. **A way to fetch a wallet's or merchant's transactions**, so that a
>    payment whose confirmation never arrives is still found and matched.
>
> Could you tell us what agreement each needs, whether Dibon can hold it
> as a technology provider or each institution must, the commercial terms,
> and the documents you need?
>
> We hold a PRSP licence from the Communications Authority and are
> registered with the Data Commissioner as a data processor.
>
> With thanks,
>
> [Your name]
> Technology Lead, Dibon Consulting
> +254 792 745 509 · [your email]

## 5 · Telkom: T-Kash

To Telkom Kenya's T-Kash business team (rails RL-05). T-Kash appears in
the Collect API's channel list, but no integration is known to have been
built (FS-393).

**Subject:** T-Kash APIs for Dibon's banking platform

> Dear T-Kash team,
>
> Dibon Consulting builds payment and banking software for banks, Saccos
> and microfinance institutions. Our products ran in production at Onit
> Bank from February 2025 to June 2026 on M-Pesa. Our bank, Sacco and
> microfinance customers want their members to pay and be paid on every
> network, including T-Kash.
>
> We would like to integrate T-Kash for:
>
> 1. **Collections and disbursements**, with transaction status, balance
>    and reversals.
> 2. **A check of a phone number against the registered name**, at account
>    opening and before payouts.
> 3. **A SIM-change check** before money moves, if available.
> 4. **Transaction statements by API**, for daily reconciliation.
>
> Could you share your API documentation, the agreement each service
> needs, whether Dibon can hold it as a technology provider, the commercial
> terms, and the documents you need?
>
> We hold a PRSP licence from the Communications Authority and are
> registered with the Data Commissioner as a data processor.
>
> With thanks,
>
> [Your name]
> Technology Lead, Dibon Consulting
> +254 792 745 509 · [your email]
