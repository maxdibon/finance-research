---
id: law
name: Instrument cards — what each law we cite says, once
kind: index
status: living
released: 2026.10.16
owner: Compliance and risk officer
classification: Internal
review_ids: [FS-868, FS-870, FS-899, FS-900, FS-959]
last_reviewed: 2026-10-23
---

# Instrument cards

One card for each law whose provisions our documents cite (FS-868): its
full citation, the regulator, what it was made under, whether it is in
force, what it is, and a row for every provision we cite, saying in plain
words what it requires. Each is read from the text the
[law register](../governance/regulation.md) names; the register keeps the version
and the Kenya Law link, the card what a reader needs.

**Citing.** A document that cites provisions names its main instrument
once, in its front matter (`law: LR-03`); a cite of any other instrument
carries its name or id where it is made ("Banking Act s.44A", "s. 44A
(LR-04)"): a card's "Also called" lists the short names it answers to,
besides the register's own title. Each provision is cited as its law names it: "s." for
a section of an Act, "reg" for a regulation, "r." for a rule of a set of
Rules (Auctioneers Rules r.12). The word "rule" alone is ours: our
application of the law, which cites the provision it applies (FS-900). A document citing many laws says
`law: mixed`, and then every cite names its law. The check fails a cite
it cannot place, and a provision with no row on its card.

**Regulations cited.** Such a document ends with a section generated
from the cards by `node tools/citations.js`: each instrument, its
regulator, the version read, and each provision cited with what it
requires. For a document read outside Dibon,
`node tools/citations.js --external <file>` prints the same table
without register ids, linking to Kenya Law, and each provision spelled
out (section 73, regulation 30(4), rule 12), for a Word or PDF
document's last section (FS-900). Write them out in the text of such a
document too.

| Card | Instrument | Regulator |
|---|---|---|
| [LR-03](LR-03.md) | Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026 | Central Bank of Kenya |
| [LR-04](LR-04.md) | Banking Act (Cap. 488) | Central Bank of Kenya |
| [LR-06](LR-06.md) | Banking (Credit Reference Bureau) Regulations, 2020 | Central Bank of Kenya |
| [LR-11](LR-11.md) | National Payment System Act (Cap. 491A) | Central Bank of Kenya |
| [LR-12](LR-12.md) | National Payment System Regulations, 2014 | Central Bank of Kenya |
| [LR-13](LR-13.md) | Proceeds of Crime and Anti-Money Laundering Act (Cap. 59A) | The Financial Reporting Centre, with each institution's supervisor |
| [LR-14](LR-14.md) | Proceeds of Crime and Anti-Money Laundering Regulations, 2023 | The Financial Reporting Centre, with each institution's supervisor |
| [LR-17](LR-17.md) | Data Protection Act (Cap. 411C) | Office of the Data Protection Commissioner |
| [LR-18](LR-18.md) | Data Protection (General) Regulations, 2021 | Office of the Data Protection Commissioner |
| [LR-20](LR-20.md) | Computer Misuse and Cybercrimes Act (Cap. 79C) | The National Computer and Cybercrimes Co-ordination Committee; offences go to the courts |
| [LR-21](LR-21.md) | Kenya Information and Communications Act (Cap. 411A) | Communications Authority of Kenya |
| [LR-23](LR-23.md) | Movable Property Security Rights Act (Cap. 499A) | The Registrar of security rights, who keeps the collateral registry |
| [LR-26](LR-26.md) | Co-operative Societies Act (Cap. 490) | The Commissioner for Co-operative Development |
| [LR-30](LR-30.md) | Employment Act (Cap. 226) | The Ministry responsible for labour; disputes go to the Employment and Labour Relations Court |
| [LR-31](LR-31.md) | Tax Procedures Act (Cap. 469B) | Kenya Revenue Authority |
| [LR-32](LR-32.md) | Limitation of Actions Act (Cap. 22) | None: the courts apply it |
| [LR-33](LR-33.md) | Microfinance (Deposit-Taking Microfinance Institutions) Regulations | Central Bank of Kenya |
| [LR-34](LR-34.md) | Companies Act (Cap. 486) | The Registrar of Companies |
| [LR-35](LR-35.md) | Companies (Beneficial Ownership Information) Regulations | The Registrar of Companies |
| [LR-36](LR-36.md) | Public Holidays Act (Cap. 110) | The Cabinet Secretary, who may declare further holidays |
| [LR-38](LR-38.md) | Unclaimed Financial Assets Act (Cap. 494) | The Unclaimed Financial Assets Authority |
| [LR-39](LR-39.md) | Law of Succession Act (Cap. 160) | None: the courts grant representation and supervise estates |
| [LR-40](LR-40.md) | Advocates Act (Cap. 16) | The Law Society of Kenya and the Advocates Disciplinary Tribunal; offences go to the courts |
| [LR-41](LR-41.md) | Auctioneers Act (Cap. 526) | The Auctioneers Licensing Board, which licenses auctioneers and hears complaints against them |
| [LR-42](LR-42.md) | Hire-Purchase Act (Cap. 507) | None: the courts apply it |
| [LR-43](LR-43.md) | Auctioneers Rules (LN 120 of 1997) | The Auctioneers Licensing Board; a court where it directs otherwise |
| [LR-47](LR-47.md) | Land Act (Cap. 280) | None: the courts apply it; the National Land Commission for public land |
