---
kind: minor
for: team
rows: [FS-1069, FS-1070, FS-1071]
by: Claude for Eric (Assistant)
---
The collateral register now has a design of its own, in the lending service spec, §5.2. It covers each item's record and its states, and the checklists for a vehicle and for land at each stage. It also covers the custody log for originals, the register view and its export, and the rule that a second person approves every release. Fineract's own collateral records are not used, so there is one record per item. Its events are added to the bus's catalogue. Where the document vault is written up is recorded too (FS-1070): it has no spec yet.

Where a vehicle is, in two stages (FS-1071). While the loan is live, no location is held: a lookup through the tracker is allowed only once a recovery case is open, and each lookup is recorded with its reason. From repossession, a possession log records where the vehicle is kept, its condition, the borrower's effects, each move and its costs, until it is sold or handed back. The lawful basis is a question for counsel (LQ-34).
