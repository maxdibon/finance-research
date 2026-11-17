---
id: messaging-prices
name: Messaging prices — USSD codes, SMS shortcodes, sender IDs and bulk SMS
kind: register
status: living
released: unreleased
owner: Commercial lead
classification: Internal
review_ids: [FS-1195]
last_reviewed: 2026-11-14
---

# Messaging prices

Dibon's price list for USSD and SMS, as it is given to customers today,
copied on 14 November 2026 from the list the owner supplied (FS-1195).
It is the one price list we have in use; the platform's price is still
open (FS-1185). All amounts in Kenya shillings.

**To confirm before it is quoted from here:** the date the list was last
revised; whether each amount includes VAT (the SMS fees are each a round
figure with 16% added, the USSD fees are round as they stand, so the
list may mix the two); and who may change it.

## 1 · USSD on a shared code

One code shared by several services, each reached by its own extension;
it covers Safaricom, Airtel and Telkom. Paid monthly.

| The code's form | Monthly maintenance |
|---|---|
| One digit after the code (`*483*X#`, `*789*X#`) | 60,000 |
| Two digits | 50,000 |
| Three digits | 40,000 |
| Four digits or more | 30,000 |

A deposit of 30,000 is required against session costs.

## 2 · USSD on a dedicated code

A code of the customer's own, reached directly.

| | Safaricom | Airtel | Telkom |
|---|---|---|---|
| Test bed, once | 27,400 | — | 27,400 |
| Set-up, once | 175,000 | 136,000 | 106,500 |
| Monthly maintenance, a three-digit code (`*XXX#`) | 85,000 | 61,400 | 55,600 |
| Monthly maintenance, a code with an extension (`*XXX*X#` and longer) | 68,000 | 10,000 | 10,000 |

The list says elsewhere that dedicated codes are on Safaricom only,
while pricing all three: to confirm.

## 3 · What the person dialling pays

The same on a shared and a dedicated code, for each session, to the
operator:

| Operator | Charged to the person dialling | Infrastructure fee |
|---|---|---|
| Safaricom | 1.00 | 0.30 |
| Airtel | 3.00 | 0.30 |
| Telkom | 1.00 | 0.30 |

## 4 · SMS

| | Amount | Paid |
|---|---|---|
| A sender ID | 11,600 | Once |
| An SMS shortcode | 17,400 | Once |
| The shortcode's maintenance | 17,400 | Monthly |
| Bulk SMS, above a million messages | 0.21 a message | As sent |
| Bulk SMS, below a million messages | 0.30 a message | As sent |

## 5 · Open

- **Which price a platform customer pays.** The platform passes messages
  and rail charges through at cost (FS-331); this list carries a margin,
  for customers who buy messaging alone. One rule is needed for an
  institution that buys both.
- **What each line costs us:** the operators' and the regulator's
  charges beside each price, so the margin is known (market review P6).
- The date, the VAT and the owner of the list, above.
