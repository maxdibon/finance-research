---
id: brief-asset-finance
name: Asset finance with title — loans secured on a vehicle or land, or paid to a dealer
kind: guide
status: living
law: LR-23
released: unreleased
owner: Product lead, lending
classification: Internal
review_ids: [FS-1029, FS-1031, FS-1058]
last_reviewed: 2026-10-30
---

# Asset finance with title

**What it is:** loans secured on something with a title: a vehicle, by
its logbook, or land, by its title deed. The lender's interest is
registered, and the asset is recovered and sold if the loan is not
repaid. A close relative pays a dealer for the asset (a motorbike, a
car, equipment) and keeps title until the loan is paid. KCB, NCBA,
Family, Sidian, Faulu and Watu all offer some form (product-landscape);
Roan Capital's Motor Vehicle and Title Deed products are the first we
run (roan-capital-motor-vehicle-v1, roan-capital-title-deed-v1).

**Why it is interesting:** it lends larger amounts, for longer, to people
and businesses whose main wealth is a vehicle or land; and recovery,
the hardest part, is where the law is strictest.

## 1 · How it works

```
   application  -->  valuation of the asset  -->  limit: a share of
                                                  its value (Roan: 50%)
                                                         |
                                                         v
   the security registered:                       approved, then paid
     a vehicle: joint registration at NTSA,         to the borrower, or
       and the collateral registry (MPSR Act)        to the dealer
     land: a charge at the land registry
       (Land Act)
   scans, searches and the registry's number
   filed in the vault (ID-15)
                                                         |
                                                         v
   repaid on schedule  -------------------->  security released,
                                              the logbook or deed returned
          |
          | missed payments
          v
   reminders and a cure period
          |
          v
   default notice, then thirty days' notice before
   a sale (reg 30(4)); the Auctioneers Rules where
   they apply (LQ-18); a hire purchase two-thirds
   paid recovered only through court (s.15)
          |
          v
   recovery and sale, the proceeds applied
   to the loan
```

## 2 · Why it is hard for an institution to do alone

- **Registering the security.** Each kind of asset has its own registry
  and steps (NTSA, the collateral registry, the land registry), each
  with searches before and a release after.
- **Custody.** Logbooks, deeds and their copies must be tracked: who has
  the original, where, since when.
- **Recovery within the law.** The lender regulations, the MPSR Act, the
  Auctioneers Rules, the Hire-Purchase Act and the Land Act each set
  notices and waiting periods, and they overlap (LQ-17, LQ-18, LQ-19,
  LQ-21). A recovery ladder that moves too fast breaks them; Roan
  Capital names this its first compliance priority (FS-935).
- **Paying a dealer.** Where the loan buys the asset, the money goes to
  the dealer, against its invoice, from an approved list.
- **Valuation and tracking.** A valuation before lending, and for a
  vehicle often a tracker, each with its own provider and charge.

## 3 · What we bring

| Need | How it is met | Ids |
|---|---|---|
| A collateral model: coverage, custody, recovery, sale, release | Vehicles first, then title deeds, chattels and equipment | MF-03, MF-18 |
| Registrations and documents kept | Scans, the NTSA record and the collateral-registry search in the vault; the registry's number on the record | MF-03; ID-15 |
| Recovery that keeps to the law | The rules for selling security, the notices counted, a hire purchase two-thirds paid refused without a recorded court order | lender-rules §2.11 |
| The product described as data | The terms we have; Payee and Collateral (financed goods) for dealer-paid loans | loan-kinds; product-versions §4 |
| Paying a dealer | Against its invoice, from an approved list, tied by the approval engine | MF-40 |

**Where it stands:** in R1 for Roan Capital's Motor Vehicle and Title
Deed; paid to a dealer, phase 2 (product-landscape).

## 4 · What we have run or learnt

Roan Capital's Motor Vehicle and Title Deed are the first we run, in R1
(FS-934, FS-957). Learnt in drafting them: a recovery ladder set by
business practice has to be checked against the notices the law
requires before a sale (FS-899, FS-935); and the Land Act puts a sale of
charged land no earlier than about day 160 after a missed payment
(LR-47, FS-959).

## 5 · What is still open

- **The sale window:** Roan Capital's ladder against the notices the law
  requires (FS-935, Critical).
- **Counting the thirty days,** and how it sits with the MPSR Act's own
  notices (LQ-17).
- **Whether the Auctioneers Rules apply** to a repossession under the
  MPSR Act (LQ-18).
- **Security right or hire purchase:** for a logbook loan and for goods
  financed as their own security (LQ-19, LQ-21).
- **Long mortgages:** not yet tried against the vocabulary
  (product-landscape).

## 6 · Who might want it

Lenders and banks with vehicle, logbook and equipment books; Saccos
lending against land; dealers' finance partners (product-landscape).

## Regulations cited

*Generated from the instrument cards in docs/law/ by tools/citations.js: edit the cards, never this section.*

No provisions cited.
