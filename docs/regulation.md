---
id: regulation
name: Law register — the legislation that applies to us and our customers
kind: register
version: 0.1.0
owner: Compliance lead
classification: Internal
review_ids: [FS-400, FS-423, FS-425, FS-426, FS-427, FS-428, FS-429, FS-431]
last_reviewed: 2026-10-05
---

# Law register — the legislation that applies to us and our customers

**What this tracks:** every Kenyan law and regulation that applies to the
financial services we build, which version we hold, and what in the
platform it drives (FS-429). Dibon's own licences and certifications are in
docs/compliance.md; this register is the law behind them and behind our
customers' obligations.

## How a law gets in

**A law is in scope only if it passes at least one test:**

| Test | The law… |
|---|---|
| **Institution** | licenses or supervises a customer type we sell to: banks, microfinance banks, Saccos, non-deposit-taking lenders, payment service providers |
| **Payments** | governs the money movement or rails we touch |
| **Obligation** | puts a duty on those institutions that our software carries: AML/CFT, sanctions, credit reporting, data protection, cybercrime, records, tax on financial services |
| **Source** | governs a register or verification source our products call |
| **Dibon** | binds Dibon directly |

Everything else stays out unless a capability cites it.

**Following Kenya Law's related documents.** From an in-scope law we take
three things only: its latest consolidated text; the subsidiary legislation
under it that passes a test; and amending Acts from the last three years,
read only for the sections they amend in an in-scope law.

**Depth:** *Deep* for laws binding the customers we have now; *Targeted*
for the sections a capability cites; *Line* for laws in scope with nothing
for us yet; *Unread* for a law found but not yet read. A Deep or Targeted
row must drive at least one id, or it does not belong here.

**The texts:** sources/regulation/ke/, named `<name>@<as at date>.pdf`,
fetched from Kenya Law. They are kept out of git (anyone can fetch them
again from the links below); the check matches local copies to this
register when the folder exists. Superseded copies are in `superseded/`.

## The register

| Id | Instrument | Kenya Law | As at | Tests | Binds | Drives | Depth | Last checked | Note |
|---|---|---|---|---|---|---|---|---|---|
| LR-01 | Central Bank of Kenya Act (Cap. 491) | [central-bank-of-kenya-act@2026-07-24](https://new.kenyalaw.org/akn/ke/act/1966/15/eng@2026-07-24) | 2026-07-24 | Institution | Non-deposit-taking lenders, microfinance banks, PSPs | OB-COM-03, OB-COM-15 | Deep | 2026-10-05 | Licensing of non-deposit-taking credit business sits here since the Business Laws (Amendment) Act 2024 (LR-05). This version includes the CBK (Amendment) Act 2026 (LR-02) |
| LR-02 | Central Bank of Kenya (Amendment) Act, 2026 (No. 23 of 2026) | [central-bank-of-kenya-amendment-act-2026@2026-07-10](https://new.kenyalaw.org/akn/ke/act/2026/23/eng@2026-07-10) | 2026-07-10 | Institution | Central Bank of Kenya itself | — | Line | 2026-10-05 | Read 2026-10-05 (FS-430). Commenced 24 Jul 2026, so LR-01 as at 24 Jul includes it. It restates CBK's objective as financial stability and the soundness of the banking system; lets CBK lend to banks and microfinance institutions for monetary policy, and give emergency liquidity assistance (up to 12 months, extendable to five years, against collateral) to solvent, systemically important ones; adds precious metals and loans to the deposit insurer. Nothing for lenders' licensing, payments, AML or vendors |
| LR-03 | Central Bank of Kenya (Non-Deposit Taking Credit Providers) Regulations, 2026 (LN 191) | [cbk-non-deposit-taking-credit-providers-regulations-2026@2026-09-29](https://new.kenyalaw.org/akn/ke/act/ln/2026/191/eng@2026-09-29) | 2026-09-29 | Institution, Obligation | Non-deposit-taking lenders | OB-COM-03, MF-02, MF-21, FC-05, FC-09, MF-22, MF-23, MF-24, MF-25, MF-26, MF-27, MF-28, MF-29, FC-15 | Deep | 2026-10-05 | Every lender licensed or registered; existing lenders apply within six months, by about 29 Mar 2027 (reg 96). AML (reg 64), cybersecurity (reg 61), returns (reg 66) (FS-423). Whether it caps arrears interest decides MF-21 (FS-400). Read 2026-10-05: reg 29 caps interest recoverable on a non-performing loan at the principal owing (in duplum for lenders); reg 31 lets a lender outsource services but not the final loan decision, its management, board decisions, the determination of compliance with the law, or management of the loan portfolio, with 30 days' notice to CBK and the lender liable for its provider; reg 56 applies repayments to principal, then fees, then interest; reg 59 pricing with an APR; reg 48 key information document; reg 30 collection conduct; reg 33 no negative bureau listing at KES 1,000 or less (FS-427, FS-433) |
| LR-04 | Banking Act (Cap. 488) | [banking-act@2024-12-27](https://new.kenyalaw.org/akn/ke/act/1989/9/eng@2024-12-27) | 2024-12-27 | Institution, Obligation | Banks, mortgage finance companies | OB-COM-03, MF-21 | Deep | 2026-10-05 | s.44A, the in duplum rule, applies to an "institution" under this Act: a bank, financial institution or mortgage finance company (FS-400) |
| LR-05 | Business Laws (Amendment) Act, 2024 (No. 20 of 2024) | [business-laws-amendment-act-2024@2024-12-13](https://new.kenyalaw.org/akn/ke/act/2024/20/eng@2024-12-13) | 2024-12-13 | Institution | Banks, non-deposit-taking lenders | LR-01, LR-04 | Targeted | 2026-10-05 | Extends CBK licensing to all non-deposit-taking credit business; raises bank core capital to KSh 10 billion, phased |
| LR-06 | Banking (Credit Reference Bureau) Regulations, 2020 (LN 55) | [banking-credit-reference-bureau-regulations-2020@2022-12-31](https://new.kenyalaw.org/akn/ke/act/ln/2020/55/eng@2022-12-31) | 2022-12-31 | Obligation | Banks, microfinance banks | CR-01, CR-03, MF-19, MF-27 | Targeted | 2026-10-05 | Read 2026-10-05: only banks, microfinance banks and Saccos may subscribe to a bureau (reg 2); anyone else furnishing credit data needs CBK approval as a third-party credit information provider. Lenders share under the CBK lender regulations (LR-03 reg 33) (FS-447) |
| LR-07 | Microfinance Act (Cap. 493C) | [microfinance-act@2024-12-27](https://new.kenyalaw.org/akn/ke/act/2006/19/eng@2024-12-27) | 2024-12-27 | Institution | Microfinance banks | — | Line | 2026-10-05 | Read when a microfinance bank signs. The Microfinance Bill 2026 would replace it |
| LR-08 | Sacco Societies Act (Cap. 490B) | [sacco-societies-act@2025-06-20](https://new.kenyalaw.org/akn/ke/act/2008/14/eng@2025-06-20) | 2025-06-20 | Institution | Saccos | SC-06, SC-16, SC-17, LC-05 | Deep | 2026-10-05 | |
| LR-09 | Sacco Societies (Deposit-taking Sacco Business) Regulations (LN 95 of 2010) | [sacco-societies-deposit-taking-sacco-business-regulations@2022-12-31](https://new.kenyalaw.org/akn/ke/act/ln/2010/95/eng@2022-12-31) | 2022-12-31 | Obligation | Deposit-taking Saccos | SC-06, SC-17, FC-13 | Deep | 2026-10-05 | Monthly returns by the 15th of the following month |
| LR-10 | Sacco Societies (Non-Deposit-Taking Business) Regulations (LN 82 of 2020) | [sacco-societies-non-deposit-taking-business-regulations@2022-12-31](https://new.kenyalaw.org/akn/ke/act/ln/2020/82/eng@2022-12-31) | 2022-12-31 | Obligation | Non-withdrawable-deposit-taking Saccos | SC-03, SC-17 | Targeted | 2026-10-05 | |
| LR-11 | National Payment System Act (Cap. 491A) | [national-payment-system-act@2025-11-04](https://new.kenyalaw.org/akn/ke/act/2011/39/eng@2025-11-04) | 2025-11-04 | Payments, Dibon | PSPs, payment systems; possibly Dibon | LC-06, LC-07, GW-01 | Deep | 2026-10-05 | s.2 defines a payment service provider to include whoever processes or stores data on behalf of one, and s.12 requires authorisation: legal advice needed on whether it reaches the Gateway and Collect (FS-428). A High Court ruling (KENEX v CBK, reported by a law firm, PT-43) read the definition widely: a software firm connecting banks to SWIFT was held to be a PSP. To verify against the judgment |
| LR-12 | National Payment System Regulations, 2014 (LN 109) | [national-payment-system-regulations-2014@2022-12-31](https://new.kenyalaw.org/akn/ke/act/ln/2014/109/eng@2022-12-31) | 2022-12-31 | Payments | PSPs, e-money issuers, agents | LC-06, OC-12 | Deep | 2026-10-05 | E-money, agents and outsourcing sit here, not in the Act. Read 2026-10-05: an electronic retail payment service provider needs KSh 5m core capital (reg 11, First Schedule), an application under reg 4 on Form 1, a KSh 5,000 application fee and a KSh 100,000 authorisation fee; renewal yearly, by gross value processed (FS-444) |
| LR-13 | Proceeds of Crime and Anti-Money Laundering Act (Cap. 59A) | [proceeds-of-crime-and-anti-money-laundering-act@2025-11-04](https://new.kenyalaw.org/akn/ke/act/2009/9/eng@2025-11-04) | 2025-11-04 | Obligation | Every reporting institution: banks, lenders, money transfer, e-money | FC-05, FC-07, FC-09, FC-10, FC-12 | Deep | 2026-10-05 | STRs within two days (s.44); cash reports at USD 15,000; records seven years (s.46) (FS-422) |
| LR-14 | Proceeds of Crime and Anti-Money Laundering Regulations, 2023 (LN 153) | [proceeds-of-crime-and-anti-money-laundering-regulations-2023@2023-11-17](https://new.kenyalaw.org/akn/ke/act/ln/2023/153/eng@2023-11-17) | 2023-11-17 | Obligation | Every reporting institution | ID-01, ID-07, FC-06, FC-07, FC-15 | Deep | 2026-10-05 | Due diligence and enhanced due diligence (regs 20, 26); wire-transfer rules. Reg 12: the institution appoints its Money Laundering Reporting Officer, of management level, with competence, authority and independence; not its internal auditor or chief executive; notified to the FRC within 14 days. Reg 33: reliance for due diligence only on a supervised third party, with responsibility staying with the institution (FS-433) |
| LR-15 | Prevention of Terrorism Act (Cap. 59B) | [prevention-of-terrorism-act@2025-06-20](https://new.kenyalaw.org/akn/ke/act/2012/30/eng@2025-06-20) | 2025-06-20 | Obligation | Every reporting institution | FC-05 | Deep | 2026-10-05 |  |
| LR-16 | Prevention of Terrorism (Implementation of the UN Security Council Resolutions on Suppression of Terrorism) Regulations, 2024 (LN 187) | [prevention-of-terrorism-unsc-resolutions-regulations-2024@2024-12-20](https://new.kenyalaw.org/akn/ke/act/ln/2024/187/eng@2024-12-20) | 2024-12-20 | Obligation | Every reporting institution | FC-05 | Deep | 2026-10-05 | Freezes within 24 hours of a designation (FRC guidance, Jul 2025) |
| LR-17 | Data Protection Act (Cap. 411C) | [data-protection-act@2022-12-31](https://new.kenyalaw.org/akn/ke/act/2019/24/eng@2022-12-31) | 2022-12-31 | Obligation, Dibon | Every customer; Dibon as processor | LC-01, LC-02, OB-COM-04, RO-19 | Deep | 2026-10-05 | |
| LR-18 | Data Protection (General) Regulations, 2021 (LN 263) | [data-protection-general-regulations-2021@2022-12-31](https://new.kenyalaw.org/akn/ke/act/ln/2021/263/eng@2022-12-31) | 2022-12-31 | Obligation | Every customer; Dibon | OB-COM-04, RO-19 | Targeted | 2026-10-05 | |
| LR-19 | Data Protection (Registration of Data Controllers and Data Processors) Regulations, 2021 (LN 265) | [data-protection-registration-regulations-2021@2022-12-31](https://new.kenyalaw.org/akn/ke/act/ln/2021/265/eng@2022-12-31) | 2022-12-31 | Dibon | Dibon | LC-01, LC-02 | Targeted | 2026-10-05 | |
| LR-20 | Computer Misuse and Cybercrimes Act (Cap. 79C) | [computer-misuse-and-cybercrimes-act@2025-11-04](https://new.kenyalaw.org/akn/ke/act/2018/5/eng@2025-11-04) | 2025-11-04 | Obligation | Every customer; Dibon | RO-18 | Targeted | 2026-10-05 | Amended in 2025 (No. 17 of 2025) |
| LR-21 | Kenya Information and Communications Act (Cap. 411A) | [kenya-information-and-communications-act@2022-12-31](https://new.kenyalaw.org/akn/ke/act/1998/2/eng@2022-12-31) | 2022-12-31 | Dibon, Source | Dibon | LC-03, MS-02 | Targeted | 2026-10-05 | Our PRSP licence |
| LR-22 | Kenya Information and Communications (Registration of Telecommunications Service Subscribers) Regulations, 2025 (LN 90) | [kic-registration-of-telecommunications-service-subscribers-regulations-2025@2025-05-30](https://new.kenyalaw.org/akn/ke/act/ln/2025/90/eng@2025-05-30) | 2025-05-30 | Source | Mobile operators | ID-05, LC-13, ID-12, ID-13, ID-14 | Targeted | 2026-10-05 | The subscriber register behind the operators' number-and-name check. Read 2026-10-05: it covers deactivation (reg 17) but says nothing on reassigning or recycling a number; recycling is the operators' own practice (FS-448) |
| LR-23 | Movable Property Security Rights Act (Cap. 499A) | [movable-property-security-rights-act@2022-12-31](https://new.kenyalaw.org/akn/ke/act/2017/13/eng@2022-12-31) | 2022-12-31 | Source | Lenders taking collateral | MF-03, MF-18 | Targeted | 2026-10-05 | The collateral registry |
| LR-24 | Excise Duty Act (Cap. 472) | [excise-duty-act@2025-07-01](https://new.kenyalaw.org/akn/ke/act/2015/23/eng@2025-07-01) | 2025-07-01 | Obligation | Institutions charging fees | KC-04, MF-15 | Targeted | 2026-10-05 | Excise on fees and commissions charged by financial institutions: 20% on financial institutions' and digital lenders' fees, never on interest; 15% on money transfer fees (FS-427) |
| LR-25 | Finance Act, 2026 (No. 19 of 2026) | [finance-act-2026@2026-06-26](https://new.kenyalaw.org/akn/ke/act/2026/19/eng@2026-06-26) | 2026-06-26 | Obligation | Lenders; Gateway merchants taking betting payments | LR-24 | Targeted | 2026-10-05 | A bad debt now includes its interest and charges for money lenders, banks and microfinance banks (Income Tax Act s.15); betting deposits redefined for excise; VASP information returns (FS-427). Also: payment processing, gateway and aggregation fees charged by a PSP carry 16% VAT from 1 Jul 2026; software licence and support fees are royalties for withholding tax; card network fees are royalties (FS-427, FS-434) |
| LR-26 | Co-operative Societies Act (Cap. 490) | [co-operative-societies-act@2023-12-11](https://new.kenyalaw.org/akn/ke/act/1997/12/eng@2023-12-11) | 2023-12-11 | Institution | Co-operatives, including Saccos | — | Line | 2026-10-05 | |
| LR-27 | Kenya Deposit Insurance Act | [kenya-deposit-insurance-act@2022-12-31](https://new.kenyalaw.org/akn/ke/act/2012/10/eng@2022-12-31) | 2022-12-31 | Institution | Banks, microfinance banks | — | Line | 2026-10-05 | |
| LR-28 | Virtual Asset Service Providers Act, 2025 | [virtual-asset-service-providers-act@2025-11-04](https://new.kenyalaw.org/akn/ke/act/2025/20/eng@2025-11-04) | 2025-11-04 | Institution | Virtual asset service providers | — | Line | 2026-10-05 | |
| LR-29 | Virtual Asset Service Providers Regulations, 2026 (LN 134) | [virtual-asset-service-providers-regulations-2026@2026-07-22](https://new.kenyalaw.org/akn/ke/act/ln/2026/134/eng@2026-07-22) | 2026-07-22 | Institution | Virtual asset service providers | — | Line | 2026-10-05 | |

## Reports and strategies

Not law, so not in the register; context for sales and for the
financial-crime work (FS-422, FS-428). In sources/regulation/ke/reports/.

| Document | Date | What it gives us |
|---|---|---|
| ESAAMLG mutual evaluation of Kenya | Sep 2022 | 9 of 11 effectiveness outcomes Low; sanctions took 4 days from UN notice; no local PEP database; Saccos filed 1 STR in five years. A 2022 snapshot: check the follow-up reports before quoting it |
| ML/TF national risk assessment | 2021 (data 2016 to 2020) | Banks high threat; deposit-taking Saccos and remittance medium high |
| National Financial Inclusion Strategy | 2025 to 2028 | A CBK fast payment system with shared fraud detection; e-money and digital wallet compensation guidelines planned; creditworthiness assessment and alternative scoring |

**Superseded copies** (sources/regulation/ke/superseded/): the Banking Act
as at 1 Jan 2013 and the National Payment System Act as at 15 Sep 2023.
