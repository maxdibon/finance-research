---
id: product-landscape
name: Product landscape — what Kenya's institutions sell, against what we support
kind: register
status: living
released: unreleased
owner: Product lead, lending
classification: Internal
review_ids: [FS-1006, FS-989, FS-991, FS-985, FS-1010, FS-1011, FS-1058]
last_reviewed: 2026-10-30
---

# Product landscape

**What this is** (FS-1006): eighteen institutions, three from each of six
groups, and the products they sell, set against what our design supports
today. It shows where we are strong, which gaps matter most, and which
institutions to approach with what.

**How it was made:** from public sources read on 27 October 2026: the
institutions' pages where found, and the press. Product names and terms
change, and several sources are older or second-hand; a product marked
"(to confirm)" was not found on the institution's own pages. Banks are
grouped by CBK's peer groups in its 2025 supervision report, which ranks
them by a market-size index (assets, deposits, capital, and numbers of
deposit and loan accounts), not by assets alone.

## 1 · The institutions

| Group | Institution | What it sells, in short |
|---|---|---|
| Bank, tier 1 | **KCB** | Savings, current, cards; personal loans with and without check-off, salary advance, education, car loans; KCB M-Pesa (loans and savings with Safaricom); mortgages; SME loans, LPO financing (to 60% of the goods), invoice discounting (to 80%), asset finance, boda boda and tuk-tuk loans; retailer finance and float overdrafts by USSD; Sahl (Sharia) banking; bancassurance. Moving its digital lending to its own platform (FS-1000) |
| Bank, tier 1 | **Equity** | Savings, transactional and digital accounts (the Eazzy app, USSD \*247#, Equitel); Eazzy mobile loans; SME, agriculture and education loans; distributor financing with Unilever; EazzyPay for merchants |
| Bank, tier 1 | **NCBA** | M-Shwari (savings and 30-day loans in M-Pesa) and Fuliza (an overdraft on M-Pesa), Loop (a digital bank for the young and salaried); SME working capital; asset finance (vehicles, machinery, logbook); trade finance (letters of credit, guarantees) |
| Bank, tier 2 | **SBM Bank** | Platinum Saver and fixed deposits (in shillings and foreign currency); Jijenge Biashara (an SME borrows twice its savings); salary advances through workplace banking; the Mfukoni app; a FLEXCUBE core, iCust for loan origination (CP-21) |
| Bank, tier 2 | **Family Bank** | Savings, deposits; salary loans, Biashara Boost for micro-businesses; asset finance (to 95%, 60 months); trade finance; bancassurance; PesaPap digital banking; agency banking |
| Bank, tier 2 | **Sidian Bank** | SME banking: working capital, LPO financing, invoice discounting, trade finance, asset finance (to 95% of the asset); Chama Biashara loans for groups; the Sidian app and USSD |
| Bank, tier 3 | **Victoria Commercial Bank** | Corporate and high-net-worth banking; SME lending funded by development lenders, part for women-led firms |
| Bank, tier 3 | **Gulf African Bank** | Fully Sharia-compliant: musharakah home, vehicle and asset finance; SME finance from micro to commercial; trade finance; Halal Pesa (a 30-day commodity murabaha by M-Pesa, with Safaricom) |
| Bank, tier 3 | **Bank of Africa Kenya** | SME bid bonds without collateral, vehicle loans, invoice finance; corporate, SME and retail banking |
| Microfinance bank | **Faulu** | Group loans with members guaranteeing each other; SME LPO and LSO financing, invoice discounting, supply-chain finance, bonds and guarantees; school-bus and school-fees finance (to confirm); property improvement loans |
| Microfinance bank | **KWFT** | Loans and savings for women: group loans, MSME, agriculture, education, water and sanitation, salaried workers; microinsurance; mobile banking |
| Microfinance bank | **Onit Bank** (formerly Maisha) | M-Fanisi (savings, fixed deposits and 7 to 30-day loans in Airtel Money, FS-991); digital sub-accounts for partner companies (FS-999); SME loans |
| Deposit-taking Sacco | **Mwalimu National** | BOSA development loans (12 to 84 months), emergency loans, Wezesha for new members; FOSA salary advances and instant credit; check-off through the teachers' payroll; the GoMobile app |
| Deposit-taking Sacco | **Kenya Police Sacco** | Fifteen loan products: FOSA instant loans (Q-Cash, M-Sasa and others), dividend advances; business, land, transport and agriculture loans; asset finance by logbook (to confirm); loans as a multiple of savings; the M-Tawi app and USSD; a debit card through Sacco Link |
| Deposit-taking Sacco | **Stima Sacco** | Its own pages were not found; Saccos of its kind sell BOSA development, emergency and school-fees loans, FOSA salary advances and instant loans, and mobile banking (to confirm) |
| Non-deposit lender | **Tala** | Digital loans by app, about KES 1,000 to 50,000, up to 120 days, priced by the day (to confirm); licensed as a digital credit provider |
| Non-deposit lender | **Watu Credit** | Asset finance: motorbikes, tuk-tuks and electric bikes paid daily; smartphones (Watu Simu, with a device lock); cars and logbook loans (Watu Gari); GPS trackers |
| Non-deposit lender | **Branch** | Digital loans for gig and salaried workers; owns a microfinance bank (Century) to add savings and payments |

## 2 · Product kinds, who sells them, and our support

**An institution with no website** gets one as part of the business suite
(BS-24, FS-1011), which also meets the lender regulations' duty to publish
product terms (regs 47, 48).

**Our support:** **R1** in Roan Capital's delivery; **designed** in a spec
or the vocabulary, built later; **phase 2** a capability planned after R1;
**not yet** described nowhere; **out of scope** what we leave to the
institution's core or a partner by design.

| Kind | Who sells it, among the eighteen | Our support | Where |
|---|---|---|---|
| Savings and current accounts | Every bank, microfinance bank and Sacco here; Branch, through its microfinance bank | Designed; in the institution's core when it has one | deposits-service; integrated mode |
| Fixed and lock deposits | NCBA (lock savings), SBM, Family, Onit; most banks besides | Designed | deposits-service §4 |
| SME term loans and working capital | KCB, Equity, NCBA, SBM, Family, Sidian, Victoria, Gulf African, Bank of Africa, Faulu, KWFT, Onit, Kenya Police Sacco | **R1** | mfi; lending-service |
| Unsecured personal and salary loans | KCB, Family, SBM, KWFT, Mwalimu, Kenya Police Sacco, Branch, Tala | **R1**; check-off phase 2 | mfi; MF-36, BS-17 |
| Mobile and app loans (instant, short) | KCB, Equity, NCBA, Onit, Gulf African (Halal Pesa), Mwalimu, Kenya Police Sacco, Tala, Branch | Loans phase 2; wallet savings once their schema exists | loan-kinds; FS-991 to FS-993 |
| Overdrafts and credit lines (Fuliza, float overdrafts) | NCBA (Fuliza), KCB (float and MSME overdrafts) | Designed (Facility) | product-versions §4; MF-40 |
| Vehicle and asset finance, logbook loans | KCB, NCBA, Family, Sidian, Gulf African, Bank of Africa, Faulu, Kenya Police Sacco (to confirm), Watu | **R1** (Roan Capital's Motor Vehicle); paid to a dealer, phase 2 | MF-03; MF-40 |
| Smartphone and device financing with a lock | Watu | **Not yet:** a device lock is a service of its own | loan-kinds |
| Land-secured loans and mortgages | KCB, Gulf African, Faulu (property improvement), Kenya Police Sacco (land) | **R1** for Title Deed; long mortgages not yet tried against the vocabulary | MF-18; LR-47 |
| LPO financing and invoice discounting | KCB, Sidian, Bank of Africa, Faulu | Phase 2 | MF-32 |
| Supplier, distributor and retailer finance | KCB, Equity (with Unilever), Faulu | Designed, phase 2 | MF-40 to MF-42; JN-21 |
| Trade finance: letters of credit, guarantees, bid bonds | NCBA, Family, Sidian, Gulf African, Bank of Africa, Faulu | **Out of scope:** the bank's own instruments, in its core | — |
| Agriculture loans | KCB, Equity, KWFT, Kenya Police Sacco | Phase 2 (paid to an agro-dealer, repaid at harvest) | MF-40 |
| Education and school-fees loans | KCB, Equity, KWFT, Faulu and Saccos (to confirm) | Phase 2 (paid to the school) | MF-40 |
| Group and chama loans | Sidian, Faulu, KWFT | Phase 2 | MF-17 |
| Sacco loans against deposits (BOSA), salary advances (FOSA) | Mwalimu, Kenya Police Sacco, Stima | R4, with Kapu Sacco | lending-service; deposits-service; sacco |
| Sharia-compliant finance (murabaha, musharakah, ijara) | KCB (Sahl), Gulf African (with Halal Pesa) | **Not yet:** a vocabulary without interest | loan-kinds |
| Cards | KCB, SBM, KWFT, Kenya Police Sacco (through Sacco Link) | **Virtual cards through partners, designed** (a sponsor bank's BIN and an issuer processor; FS-1010); physical cards and card processing stay with them | OC-25 |
| Bancassurance and microinsurance | KCB, Family, KWFT | **Out of scope** as insurance; premium financing paid to an insurer, phase 2 | MF-40 |
| Mobile, USSD and agency channels | Nearly all; agency banking at Family and the large banks | Designed; USSD built (OC-03) | omni-channel |

## 3 · What it tells us

1. **Our R1 covers the most common kinds:** SME and working-capital loans,
   unsecured and salary loans, vehicle and land-secured loans, which most
   of the eighteen sell.
2. **The biggest gaps by reach** are mobile and app loans with savings,
   credit lines, and LPO and invoice finance: all designed or in phase 2,
   so the order to build them is the question, not the design.
3. **Sharia-compliant finance** is sold by two of the eighteen (KCB's
   Sahl; Gulf African Bank, with Halal Pesa on M-Pesa), and we have
   run its channel before (FS-1000). It needs a vocabulary of its own: a
   profit rate and the bank's purchase of the goods in place of interest.
4. **Device financing with a lock** (Watu) is a niche of its own; we
   leave it until a customer asks.
5. **Trade finance stays out of scope,** in a bank's core. **Cards** come
   in only as virtual cards through a sponsor bank and an issuer processor
   (OC-25, FS-1010); card processing stays theirs.

## 4 · Whom to approach with what

| Group | What they already have | What we would bring |
|---|---|---|
| Tier 1 banks | Their own platforms, some built in-house | Integrated-mode services around them: reconciliation, Collect, supplier finance with partners, approvals; rarely a platform |
| Tier 2 banks (SBM, Family, Sidian) | Good SME books, digital apps, LPO and asset finance | Supplier and retailer finance, credit lines, wallet loans, the bank channel for SMEs (SME Recon), without building them |
| Tier 3 banks | Narrow niches: corporate, Sharia, SME bonds | For Gulf African Bank, Sharia products once the vocabulary exists; for the others, SME lending and invoice finance |
| Microfinance banks | Group lending, SME finance, some wallet products | Group loans, LPO finance, wallet savings and loans, a modern core (native mode) |
| Saccos | BOSA and FOSA, check-off, mobile apps; not every one has a website | Kapu Sacco (R4): lending against deposits, check-off, members' pages and apps; a website for those without one (BS-24, FS-1011) |
| Non-deposit lenders | Digital and asset loans at scale | Kapu MFI for smaller lenders such as Roan Capital; for large digital lenders, our rules (the lender regulations) and reconciliation |

## Sources

- CBK peer groups, 2025: [biznakenya.com](https://biznakenya.com/full-list-of-tier-1-2-and-3-banks-in-kenya/); [List of banks in Kenya](https://en.wikipedia.org/wiki/List_of_banks_in_Kenya)
- KCB: [SME borrowing](https://ke.kcbgroup.com/sme-solutions-borrow); [KCB M-Pesa](https://ke.kcbgroup.com/faqs/faqscategory/kcb-mpesa); [The Kenya Times](https://thekenyatimes.com/business/kcb-bank-owners-branches-and-loans-offered/)
- Equity: [Wikipedia](https://www.wikipedia.org/wiki/Equity_Bank_Kenya); [Equity and Unilever](https://equitygroupholdings-ke.azurewebsites.net/ke/newsroom/press-releases/unilever-and-equity-bank-launch-kes-24b-sme-financing-drive-to-strengthen-supply-chains-and-fuel-inclusive-growth)
- NCBA: [TechMoran on NCBA and SMEs](https://techmoran.com/?p=226821)
- SBM: [The Kenya Times](https://thekenyatimes.com/business/sbm-bank-owners-branches-loans-offered/); [The Star](https://www.the-star.co.ke/business/2026-03-11-sbm-bank-returns-to-profitability-with-sh4442m-net-earnings-for-2025)
- Family Bank: [Wikipedia](https://en.wikipedia.org/wiki/Family_Bank); [Money254](https://www.money254.co.ke/business-loans-details/family-bank-limited-biashara-boost-loan)
- Sidian: [Khusoko](https://khusoko.com/2026/07/13/sidian-bank-sme-lending-kenya/)
- Victoria Commercial Bank: [Swedfund](https://swedfund.se/en/investments-and-projects/victoria-commercial-bank)
- Gulf African Bank: [Euromoney](https://www.euromoney.com/article/928toe46ji80kw00wc4kcs80w/banking/islamic-finance-awards-national-winners-2026-kenya/)
- Bank of Africa Kenya: [BTW Media](https://btw.media/fintech/bank-of-africa-kenya-supports-small-firms-beyond-big-bank-reach)
- Faulu: [Capital FM](https://www.capitalfm.co.ke/business/2021/02/faulu-bank-to-lend-sh3-billion-to-smes-to-boost-growth)
- KWFT: [Oikocredit](https://www.oikocredit.coop/what-we-do/partners/partner-detail/10797/kenya-women-microfinance-bank)
- Mwalimu National Sacco: [Kenyans.co.ke](https://www.kenyans.co.ke/news/42544-mwalimu-sacco-loans-services-offered)
- Kenya Police Sacco: [National Police Service handbook, 2025](https://www.nationalpolice.go.ke/sites/default/files/2025-12/NPS%20Handbook_2025.pdf)
- Saccos generally: [Waumini Sacco](https://www.wauminisacco.com/products-and-services/)
- Tala: [Business Radar](https://businessradar.co.ke/?p=2925)
- Watu: [Business Today](https://businesstoday.co.ke/asset-finance-company-funds-purchase-of-500000-motorbikes/)
- Branch: [Money254](https://money254.co.ke/post/digital-lender-branch-buys-kenyan-microfinance-bank)
