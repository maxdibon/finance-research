---
id: channels
name: Channels — every app and channel, who uses it, and how people with several roles get one way in
kind: register
status: living
released: unreleased
owner: Product lead, channels
classification: Internal
review_ids: [FS-1012, FS-1013, FS-1014, FS-1015, FS-1016, FS-1017, FS-1018]
last_reviewed: 2026-10-27
---

# Channels

**What this tracks** (FS-1012): every app and channel an institution's
customers, its partners and its staff use, who each is for, how they
sign in, and where each stands. The capabilities behind them are in
[omni-channel](modules/omni-channel.md); this register is the view by
person and channel, and the rules for people who hold more than one role.

## 1 · Who uses what

| Who | Their roles ("hats") | Their channels |
|---|---|---|
| **Individuals** | Borrower, depositor, Sacco member, guarantor | The customer app; the internet banking website; USSD; their own pages from a link; SMS and WhatsApp; voice; virtual cards |
| **Businesses** | The business as customer, acting through its people: owners, directors, signatories, staff with set rights (account mandates) | The internet banking website, where most of a business's work is done; the customer app, in the business's profile; USSD for the owner; their own pages; partner data shared through their ERP (SME Recon) |
| **Retailers** (in retailer finance) | A business customer that borrows to buy from its distributors | As a business: the customer app or USSD; a draw against a distributor's invoice |
| **Distributors, dealers, schools, insurers** (partners) | The partner's office: its admin, finance, data uploads, deliveries and returns | The partner portal (Odoo); or the API, for larger partners |
| **Field agents** | A partner's sales representative (a distributor's, along its route) or the institution's own loan officer | The field app (OC-17), with the rights their organisation gives them |
| **Mobile operators** | A partner by integration only | The API; no person signs in |
| **The institution's staff** | Their positions (roan-capital, "Its roles") | The staff workspace in Odoo; the Kapu Console; the field app for loan officers |
| **Dibon's engineers** | Operations only | Observability and the on-call tool; never a product |

## 2 · People with several roles: one way in, many profiles

FS-1013. One person may be a borrower, a guarantor for a friend, a
director of the business that borrows, and a distributor's sales
representative, all at once. **Decided** (FS-1018):

1. **One identity per person, per institution,** in access's realm for
   outside people (`customers`, access §3), bound to their ID, phone and
   SIM (ID-12). One sign-in, one PIN or passkey, whatever roles they hold.
2. **Each role is a profile, not an account:** the person switches
   between them in the app ("Me", "Wanjiku Stores", "Field: Route 12"),
   as in any banking app with personal and business profiles. A profile
   is a membership, granted by whoever owns it:
   - **their own:** "Me", from their onboarding;
   - **a business:** granted by the business's own administrators, under
     its account mandate (mandates; ID-21, ID-22);
   - **a partner:** granted by the partner's administrator, a field
     agent's rights limited to their route (lending-service §5).
   Access's organisations hold businesses and partners and their members
   (access §4, "Organisations").
   **A business's first administrators** are those its board resolution
   names, checked against the directors in the business registry's
   record (ID-22); they then grant its other people their profiles.
   **A partner's field agent** works in a profile of their own identity,
   not a separate work identity.
3. **What a person does is always in one profile,** shown on the screen,
   recorded in the audit trail, and checked by the approval engine: a
   field agent cannot approve a draw for a retailer they own, nor a
   guarantor sign for themselves (MD-06).
4. **Staff are apart.** An institution's staff member who is also its
   customer has two identities, in two realms: `staff` for work,
   `customers` for their own money. No product accepts one for the
   other (access §3), so no one can carry a staff role into their own
   account.
   **The two are linked by ID number, for conflict checks only:** the
   approval engine refuses a staff member deciding a request in which
   they are the borrower, a guarantor or a business's officer; nothing
   else crosses between the identities (ID-26; privacy PR-20).
5. **Step-up follows money, not the profile:** anything that moves money
   asks again, whichever profile it is done from (OC-05, MD-10).

**So, how many apps:** **two mobile apps** and **three websites** for
people outside the institution, each white-labelled per institution:

| | For | Profiles in it |
|---|---|---|
| **The customer app** (OC-01) | Individuals and businesses, retailers among them | Me; each business they act for |
| **The internet banking website** (OC-02) | The same people, in a browser: everything the app does, and what a business needs a desk for: payments in bulk and payroll, approvals by its signatories under its mandate, statements and exports, its users and their rights | Me; each business they act for |
| **The field app** (OC-17) | Loan officers and partners' field agents: offline, on low-end Android | The organisation and route they work for |
| **Their own pages** (from a link, a code to the phone; no app) | Anyone asked to consent, sign or see a statement: guarantors, new borrowers, people without the app | The one task the link is for |
| **The partner portal** (Odoo portal, BS-03) | A partner's office | The partner |

The customer app and the internet banking website are one service in
two forms: the same identity, profiles and rules, and a payment begun on
one can be approved on the other. A person who is both a customer and a
field agent installs both apps,
signed in with the same identity: the field app is a work tool on a
managed device (OC-19), the customer app their own.

## 3 · Every channel, and where it stands

| Channel | For | Signs in by | Status | When | Capabilities |
|---|---|---|---|---|---|
| Their own pages | Customers, guarantors | A code to the bound phone | Designed | R1 | MF-37, MF-38, ID-17 |
| SMS | Everyone outside: codes, receipts, reminders | — | Built (messaging) | R1 | MS-01, MF-13 |
| WhatsApp | Notifications and links, with consent | — | Designed | R1 | OC-16 |
| USSD | Customers on any phone | PIN, one-time code above limits | **Built** (ran a bank's digital lending) | R1 for repayments and balances; more in phase 2 | OC-03, OC-12 |
| Staff workspace | The institution's staff | Staff realm, two factors | Designed | R1 | BS-23 |
| Kapu Console | Approvers; named staff when Odoo is down | Staff realm, step-up | Designed | R1 | MD-21 |
| Field app | Loan officers; partners' field agents | Bound device, PIN or biometrics | Designed | Loan officers phase 1; field agents with MF-41 | OC-17 to OC-19 |
| Customer app | Individuals and businesses | Passkey or biometrics, step-up for money | Planned | Phase 2 | OC-01, OC-05 to OC-11 |
| Internet banking website | Individuals and businesses, in a browser; businesses' bulk payments, payroll, signatories' approvals, statements, users | As the app: passkey, or a code to the bound phone; step-up for money | Planned | Phase 2, with the app | OC-02, OC-07, MD-01 |
| Partner portal | Partners' offices | Customers realm, the partner's organisation | Designed | With MF-41 | BS-03 |
| Partner API | Larger partners; mobile operators | Signed client credentials | Designed | With MF-41, MF-42 | lending-service §5 |
| Chatbot | Customers, on WhatsApp, the app and the web | As the channel | Planned | Phase 1 for how-to answers | OC-20 |
| Voice line | Customers, in English and Swahili | PIN for anything that moves money | Planned | Phase 2 | OC-22 |
| Agent banking | Customers at an institution's agents | The agent's device; the customer's PIN | Planned | Phase 2 | OC-23 |
| Virtual cards | Customers, from the app | The app; the processor's display | Designed | Later | OC-25 |
| Telegram | Customers who start a chat | As the channel | Planned | Later | OC-21 |
| Website | Anyone: products, terms, the calculator, "Request a loan" | — | Planned | With BS-20; for those without one, BS-24 | BS-20, BS-24 |

## 4 · How it would be built

FS-1015. The design's order, for when the build is decided; this
register documents it and builds nothing (FS-1016):

1. **One channel API first** (OC-04, OC-15): every channel calls the
   same API over the lending, deposits and payment services, as the
   person, in a profile. A channel is a screen over it and holds no rule,
   as the staff workspace is over the lending service. Without it, each
   channel grows its own logic, and they disagree.
2. **Identity and profiles next:** the `customers` realm with
   organisations for businesses and partners, profiles as memberships,
   step-up by money (§2). Everything after reuses it.
3. **Then the channels in the order customers need them:**
   - **R1:** their own pages, SMS and WhatsApp, USSD (built; we add the
     products to the menus), the staff workspace and the Kapu Console.
   - **Phase 2, first:** the field app, for loan officers and then
     partners' field agents with retailer finance (MF-41); the partner
     portal.
   - **Phase 2, next:** the customer app and the internet banking
     website, one service in two forms; the voice line; agent banking.
   - **Later:** virtual cards, Telegram.
4. **One design system and one copy,** in English and Swahili, shared by
   every channel (docs/design-system.md; docs/experience.md), so a loan
   reads the same in the app, on USSD and on a page; nothing needs
   reading (omni-channel §1).
5. **White-labelled builds:** one code base per app, each institution's
   name, colours and app-store listing from configuration.
6. **Tested as one:** each journey (docs/journeys) run end to end across
   the channels it uses, with the identity simulator and made-up data
   (ID-20).

**Design decisions still open** (questions 1 to 3).

## 5 · Open questions

1. **The apps' framework:** Flutter or React Native, for the customer
   and the field app alike: one language, offline storage for the field
   app, low-end Android first.
2. **Whose name is in the app store:** each institution publishes its
   own app from its own developer account (its brand, its customers'
   trust; more to manage), or Dibon publishes one app in which a
   customer chooses their institution.
3. **The channel API's backend:** our own service, or Appwrite behind
   Keycloak (OC-15).
