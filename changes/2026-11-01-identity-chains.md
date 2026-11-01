---
kind: minor
for: team
rows: [FS-1078]
by: Claude for Eric (Assistant)
---
Identity checks are chained, per product: the steps run in order, each with its own providers and passing on only what the next step needs. The first chain confirms the phone number and the ID number it is registered to with the operator, then the person with NPDM, which gives their photo, then liveness against that photo. A step that fails stops the chain. A mismatch goes to compliance, and a step no provider can answer goes to the manual route. Identity's "How it works" diagram is redrawn as the chain. Whether one provider's answer, such as the register's photo, may be handed to the next is a question for counsel (LQ-36).
