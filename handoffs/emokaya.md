# Eric · personal handover

Eric (CTIO), the owner: team lead, architect, security lead, product
owner for Kapu MFI. Read after the team's handover, HANDOFF.md, by
Eric's Claude; written by it at the end of each session (FS-931). What
another person's Claude would need belongs in the team's handover, not
here.

## Preferences

- **Recommend, then wait for "go".** A direct instruction is done at once.
  When a message could mean two things, answer every reading and ask which.
- **"Go" is not "push".** Push only when he says "push". "Merge and push":
  a merge commit under his name, then main to GitHub. "Upload": Claude's
  branch to GitHub, still Claude's.
- **Record first.** Every point he raises becomes the next register row
  before it is answered.
- **Options with one recommended first,** said plainly; he picks quickly.
- **Disagree openly;** say when an earlier claim was wrong, and say what was
  not done. Correct the record at once when he corrects a reading (the
  M-Shwari example, FS-920).
- **His words:** short sentences; the team's words where they fit
  (download, save, upload, share, release).
- **Customer-safe, even inside:** frame what a customer is working towards;
  never judge its systems.
- **Documents share a look** (docs/design-system.md), consistent, not
  identical, a little whimsy in the margins only.
- **Attribution matters:** his work is his, Claude's is Claude's (FS-886,
  FS-905).
- **Downloads need his word;** never sign in, or enter a password, for him.
- **Visibility:** he prefers the team's work in the cloud and on a shared
  board (FS-929, FS-930); meetings are in person, no chat tool yet.
- **Document, don't build** (FS-1016): design and write it down; frame
  choices as design decisions, never as steps "before building".
- **Track legal concerns** (FS-1023): every legal uncertainty becomes an
  LQ row in docs/legal-questions.md in the same pass; name the new LQ ids
  in the reply.
- **Show where it landed:** after a batch of work, say where each piece is
  in the reader, with its links.

## Where I left off

As at 28 October 2026. Main pushed with FS-962 to FS-1048; `origin` is
still github.com/eric-mokaya/finance until the move to dibon-consulting.

- **Roan Capital's pack for 29 October** (FS-1039 to FS-1044): five Word
  files in clients/roan-capital/working/: the Biashara questionnaire
  v0.5, Motor Vehicle v0.2, Title Deed v0.2 (one file each, parts A to
  C, each with its regulations page and what we already know); Roles,
  approvals and going live v0.2; the fallback template v0.1; and the
  covering email v0.5. **Next:** his Drive checklist v0.3: upload to
  Roan Capital / Meetings / 2026-10-29 / Team review (internal), send the
  team's email v0.8 (review by 15:00; Lillian with Max on the
  questionnaires and worksheet, Betty the pack, Jimmy the regulations,
  Allan the fallback), then Claude carries the accepted changes into the
  sources and rebuilds clean copies for "For Roan Capital"; tell Claude
  when it goes, for the distribution log.
- **Waiting on his word:** FS-1036 (a Kubernetes cluster per institution,
  five database clusters), FS-1038 (how each site's OpenBao unseals),
  FS-1034 and FS-1035 (Dibon's books from QuickBooks to Odoo; Dibon's
  Odoo off odoo.sh to OLP in Kenya, LQ-30).
- **Done since 27 October:** the briefs' template (FS-1031); the
  architecture reviewed, 16 databases an instance (FS-1032); Zoho and
  QuickBooks for a business's own books (FS-1033, LQ-29); deployments and
  runbooks (FS-1037), with diagrams and settings (FS-1045, FS-1046);
  Google Workspace for reviews (FS-1041, FS-1042).
- **MVP day, Friday 30 October, 12:00 to 16:00** (FS-962; the hackathon
  moved to it). GitHub first, he and Jimmy alone before the day
  (FS-952 to FS-954): the organisation `dibon-consulting`, two-factor,
  the repository moved in, rules on main, the Project and its issues
  (create-issues.js, a dry run first). Odoo in the delivery (FS-955); the
  sandbox runs the components only (FS-956); Azure still his or Allan's,
  after Jimmy's subscription (FS-938). At the move, Betty fills the
  document register's distribution log (FS-1027).
- **Roan Capital, 29 October:** the Motor Vehicle sale window against the
  law (FS-935, Critical); open answers 33 to 41; the three product drafts
  (30-day loan, Motor Vehicle, Title Deed; the last two "proposed", for
  Roan Capital to adopt) and the Product Understanding Document (FS-947).
  Roan Capital's own staff manage products in Odoo, ours marked proposed
  until they approve (FS-978, FS-981); three or four staff, roles folded
  (FS-982).
- **The design around Fineract** (FS-970 to FS-988): the back-office
  gateway, so the ERP can be changed and upgraded (Odoo Enterprise now;
  ERPNext and Tryton to evaluate); the lending service the only writer to
  the core, for MFI and Sacco; the deposits service; the Kapu Console for
  our operators, with the admin fallback; the staff workspace's roles and
  screens; OLP's spec and its review, hosted in Kenya (FS-975, FS-986).
- **Partners and loan kinds** (FS-989 to FS-1005): loans paid to a third
  party and credit lines in the vocabulary; retailer finance, the lesson
  of per-distributor limits held above the core (FS-1000); wallet savings
  and loans (FS-991; FS-992 scale and FS-993 the operator's agreement
  open); the partners design in lending-service §5, consent per
  distributor by default (FS-1004).
- **Landscape, KYC, competitors, cards, websites** (FS-1006 to FS-1011):
  18 institutions' products against ours; KYC and KYB tiers (ID-21 to
  ID-24); CP-21 to CP-28 and "How we compare"; virtual cards through a
  sponsor bank (OC-25, LQ-23); websites as part of the business suite.
- **Channels and identity** (FS-1012 to FS-1018, FS-1028): docs/channels.md,
  two apps and three websites, internet banking among them; one identity
  per person per institution, roles as profiles, staff apart; ID-26 in R1
  (FS-1020). The model with four diagrams is in identity §5. Still to
  decide (channels §5): the apps' framework, whose name is in the app
  store, the channel API's backend (OC-15).
- **Documents** (FS-1019 to FS-1027): the onboarding pack (DC-FS-TM-001),
  documents kept in the vault and seen in every channel, one look per kind
  and whose brand, document numbers and the distribution log; LQ-20 to
  LQ-28 for counsel.
- **Product briefs** (FS-1029): retailer finance, wallet savings and
  loans, virtual cards, asset finance with title; internal first, a
  version for prospects to decide.
- **Still waiting on his word:** FS-963, FS-964, FS-966, FS-967 (answered
  in the design; to close), FS-1015 (how to build omni-channel), FS-893
  and FS-898 (permissions, delegation), FS-185 (Fineract's deposit
  fit-gap), FS-906 (iManage's agreement); FS-999 (Onit Bank's files,
  lessons taken in FS-1002, to close).
- **Customers and partners:** SBM Bank's NDA and pack (FS-911 to FS-913,
  FS-920); Lofty Corban's follow-up (CU-05, FS-918); Onit Bank, wallet
  and cards interest (CU-02).
- **Older:** the Data Commissioner registration (FS-367, Critical); which
  outreach letters went (FS-839); whether KCB and NBK may be named
  (FS-420).
- **On his machine:** Poppler for scanned PDFs, unpacked outside the
  repository and not on PATH; confidential scans rendered inside their
  folder and deleted after. No LibreOffice: Word files are rendered to PDF
  through Word itself, closing only the Word it started. The docx package
  for the builders: DOCX_MODULE pointing at another local project's copy
  (E:/Agents/Claude/DialysisWater/node_modules/docx).

## Generated

*Made by dibon session start and end, from the register and the branches: never edit it by hand.*

### Rows with Eric (173)

| Row | Point | Criticality |
|---|---|---|
| FS-202 | IPRS access: does each institution hold its own agreement, or Dibon on their behalf? | Critical |
| FS-205 | Whether the tax authority's PIN check, the business registration service, and operators' name lookups are avai | Critical |
| FS-340 | Identity: consider verification partners such as Smile ID and MetaMap | Critical |
| FS-367 | Dibon should also register with the ODPC as a data controller, for its own staff and customer data. Registrati | Critical |
| FS-735 | Roan Capital's contracted phase 1 is narrower than our R1: origination, KYC capture and digital onboarding, ap | Critical |
| FS-736 | The emails speak of a platform shell and foundational setup under way, and the 3 Oct review found a prototype  | Critical |
| FS-935 | Roan Capital's vehicle recovery ladder (a reminder on day 25, recovery or sale between days 31 and 47) against | Critical |
| FS-016 | Compliance one-pager pricing: "Kshs 500,000 / USD 386.97" is off by 10×. At the rate the same sheet uses for O | High |
| FS-049 | Odoo Sign is a simple electronic signature. Confirm which financial documents Kenyan law requires an advanced  | High |
| FS-127 | Ask Safaricom whether a third party may operate on a client's shortcode with the client's consent (delegated a | High |
| FS-208 | The rail adapter interface needs a specification: operations, the normalised event, error and pending semantic | High |
| FS-209 | How each rail authenticates its callbacks: signatures, fixed source addresses, mutual TLS, or nothing. Where n | High |
| FS-279 | The undated compliance one-pager with the 10× pricing error (FS-016) should be withdrawn before this portfolio | High |
| FS-329 | Onboarding: IPRS covers Kenyan citizens only. How do Collect, Sacco and MFI onboard foreigners, refugees and c | High |
| FS-363 | Start the certification and licence applications as soon as possible | High |
| FS-564 | JN-03 findings: business-registry access (FS-205) blocks R1's business borrowers; statements from source (ID-1 | High |
| FS-690 | R1 binds each customer to their SIM (ID-12) and sends codes, signing links and M-Pesa disbursements to that nu | High |
| FS-737 | Roan Capital has agreed WhatsApp for remote loan processing, linked to the application system; our R1 left Wha | High |
| FS-748 | Which internal, client and third-party policies do we still need? | High |
| FS-786 | Is the virtual-accounts question an opportunity for us to run our core, for institutions without a capable pla | High |
| FS-796 | Continue with the companion design for Roan Capital | High |
| FS-812 | FS-807: agreed. Back to the draft product document: if it does not sit in the documentation, how will the deve | High |
| FS-893 | Permissions: who can join what, see what and do what, and who decides that: the PM, CTIO and CEO, or the team? | High |
| FS-898 | Delegation: how do we cover someone on leave (approvals, rows, merges, Claude's word)? | High |
| FS-899 | What do the regulations allow, at least and at most, between default or non-performance and selling collateral | High |
| FS-908 | How do we test all of this on GitHub: the words, the board, join, conflicts, and the GitHub settings? | High |
| FS-912 | For the meeting in person: what Dibon needs from SBM, and pricing and feasibility | High |
| FS-915 | A new customer, Lofty Corban: a fund manager (investments and retirement benefits; insurance a new line), regu | High |
| FS-916 | Lofty Corban's regulators are CMA, RBA and IRA, none of whose laws our law register holds: which to read first | High |
| FS-920 | SBM: what we promised in the meeting. A diagram of how data is handled (asked for), the documentation on how w | High |
| FS-925 | A team hackathon on 23 October, noon to 16:00 with breaks: what to practise, build and close, how to involve e | High |
| FS-928 | Coordinating the MVP day and after: dependencies, the critical path, everyone with their own Claude and GitHub | High |
| FS-929 | Work in the cloud, for visibility: each person deploys their components on Azure to test and check configurati | High |
| FS-930 | Use GitHub's board (Projects) as part of the set-up, for the MVP day and after | High |
| FS-934 | Roan Capital's three products, as locked on 21 October: Biashara (unsecured, KES 3,000 to 100,000, 14 or 30 da | High |
| FS-950 | MVP day (30 October), Eric: The day's authority: decisions, reviews, merges, and a mock change advisory board | High |
| FS-964 | What is our UI? How do customers reach the different platforms and services? | High |
| FS-966 | Customers who prefer Zoho, or a free and open-source ERP to cut cost: how we address them, and what to conside | High |
| FS-967 | Assume Roan Capital wants to minimise cost, which probably means an open-source ERP in place of Odoo Enterpris | High |
| FS-992 | A wallet product brings millions of accounts, tiny loans and savings round the clock: Fineract and the lending | High |
| FS-993 | A wallet product needs the mobile operator's agreement: the product in its menu, the customer's data for limit | High |
| FS-1015 | How do we actually go about the omni-channel implementation? | High |
| FS-1035 | Dibon's own Odoo is hosted on odoo.sh: how do we reconcile that with our design (rule 10: client material in D | High |
| FS-1036 | Decide: each institution's production instance on a Kubernetes cluster of its own, a namespace per zone inside | High |
| FS-1038 | Decide how each site's OpenBao unseals: a key held at the site, as deployment §2 says for site B, or automatic | High |
| FS-1040 | Roan Capital's pack for 29 October (FS-1039), the email and its attachments, goes to the team for review befor | High |
| FS-1042 | Add Roan Capital to the Google Drive folder, so its people update the documents themselves | High |
| FS-036 | Check the Odoo Enterprise Agreement for limits on serving internal work through portal users or API accounts | Medium |
| FS-161 | WhatsApp route: Meta's Cloud API directly, or through a business solution provider. Either way Meta approves t | Medium |
| FS-162 | Quiet hours and rate limits per recipient: what the Communications Authority requires, and what we set as poli | Medium |
| FS-163 | An opt-out arrives at the gateway before Odoo knows. The gateway keeps a suppression list that may only be str | Medium |
| FS-165 | WhatsApp's business policies restrict some financial services. Whether lenders' messages (reminders, offers) a | Medium |
| FS-188 | Borrowers' rights under the CRB regulations: pre-listing notice period, dispute deadlines, any minimum amount  | Medium |
| FS-203 | Liveness and face match process biometric data, which is sensitive personal data under the Data Protection Act | Medium |
| FS-204 | Which liveness and face-match vendor | Medium |
| FS-219 | Microcks as the base for the per-rail simulators (FS-211): API mocks and contract tests, including asynchronou | Medium |
| FS-243 | Branding: products are named "Kapu" where the sources say so (Collect, Gateway, MFI, Sacco; Escrow by extensio | Medium |
| FS-252 | After the force-push, GitHub still serves the removed commit by its exact id, until GitHub's own clean-up. The | Medium |
| FS-275 | Product branding is still open (FS-243): Reconciliation, SME Reconciliation and Omni-channel carry no Kapu nam | Medium |
| FS-290 | For institutions with a core, the core's daily totals post to Odoo's general ledger as summarised journal entr | Medium |
| FS-291 | Odoo customisation policy: keep custom code small and documented, because every module is carried through ever | Medium |
| FS-294 | OPA's public site names the company "Dibon Solutions"; the portfolio uses "Dibon Consulting" (FS-247). One nam | Medium |
| FS-295 | OPA's public site makes claims the portfolio avoids: "Trusted by Enterprise Leaders Globally", "Global Odoo Im | Medium |
| FS-296 | OPA's public site offers a Community-edition package; the portfolio and architecture assume Enterprise (FS-026 | Medium |
| FS-331 | KYC/KYB checks: does Dibon carry the cost and build it into the system price? Raised earlier by a team member; | Medium |
| FS-341 | What the new national ID system (Maisha Namba, Maisha Card) holds and verifies, against IPRS, and how institut | Medium |
| FS-423 | Work only with licensed entities, and be loud about it as part of our credibility? | Medium |
| FS-434 | Dibon's own tax from 1 Jul 2026 (Finance Act 2026): gateway, processing and aggregation fees charged by a PSP  | Medium |
| FS-529 | Odoo Enterprise: once the number of users is confirmed, add it to the commercials | Medium |
| FS-664 | Flowza: hosted in Kenya, one per institution (or isolated per institution), before institutions' customers' da | Medium |
| FS-665 | Flowza's privacy policy: "data may be transferred to and processed in countries other than your own; by using  | Medium |
| FS-666 | Flowza offers "Open WhatsApp (QR)" conversations: WhatsApp Web automation outside WhatsApp's terms. Never for  | Medium |
| FS-691 | deployment.md: draw the warm standby availability model: which modules run where, how replication works, the S | Medium |
| FS-760 | A recommendation: one code repository per service, or one for everything? | Medium |
| FS-784 | Continue with JN-12 | Medium |
| FS-785 | Virtual account numbers at the larger bank: many institutions will not have a capable enough platform, would r | Medium |
| FS-819 | Do we store, for instance, all M-Pesa transactions in the companion? In the same database as Fineract? | Medium |
| FS-820 | FS-791 is answered by FS-792, unless something is missing. FS-819's one copy of the M-Pesa records: is the gen | Medium |
| FS-821 | Seven years at the scale target is large: how do we store it, like AWS S3's storage classes, to keep costs dow | Medium |
| FS-840 | The document register (FS-835) marks provenance not yet checked: who wrote the MMC specification and manual an | Medium |
| FS-869 | Two cites that may not say what the regulation says: lender-rules cites reg 54(7) for restructuring, where 54( | Medium |
| FS-883 | Keeping each other updated: a word, dibon news (what changed since my last download, the reviews waiting for m | Medium |
| FS-884 | Who sees what: a short section in ways-of-working (the repository, each customer's Odoo workspace, public docu | Medium |
| FS-894 | Without GitLab or a third-party tool, what planning capabilities do our register and board give us, against Gi | Medium |
| FS-914 | Escrow with SBM: it would hold a pool account where it has no contractual obligation to the end parties, and p | Medium |
| FS-919 | Lofty Corban's open question: following a customer's international transfer that has not yet arrived (an SLA,  | Medium |
| FS-926 | Credit limits: one across all of a borrower's loans, one for a group of products, one per product | Medium |
| FS-927 | Duplicate transactions: two the same within a few seconds, as when a customer retries believing the first fail | Medium |
| FS-963 | Which pending items to tackle next | Medium |
| FS-1034 | Dibon keeps its own books in QuickBooks: port them to Odoo, and keep both for a time to learn what each can do | Medium |
| FS-013 | Recon PDF: "Complaint" for "Compliant" ×6 on the functional-spec page; "Maintaince" ×1; timeline column headed | Low |
| FS-035 | Sacco needs its own regulatory line: SASRA for DT-Saccos, the co-operatives regime for credit-only | Low |
| FS-037 | Executing payments from an ERP approval: attribute the approval at the act (STANDARDS.md §6.2 — "move money"), | Low |
| FS-046 | Debit mandates: rails to establish — bank direct debit through the clearing house, and M-Pesa standing orders. | Low |
| FS-048 | A self-hosted model on Azure Stack needs GPU capacity from Liquid. Ask Liquid what GPU SKUs, and whether any h | Low |
| FS-051 | Collect one-pager: "multi-billion shilling liquidity pool" has no source in this folder | Low |
| FS-053 | The one-pager and the technical documentation both say real-time monitoring and automated fraud detection "ope | Low |
| FS-054 | Technical documentation, withdrawal: the sequence diagram debits the core then disburses, but the data-flow te | Low |
| FS-056 | Whose mobile-money shortcodes and trust account does Collect use? If Kapu's or Dibon's, funds rest under our c | Low |
| FS-057 | One-pager says banks "extend" their CBK-regulated status and collectors "operate under the bank's authority".  | Low |
| FS-058 | Technical documentation's account-opening sample contains a tax PIN in a real-looking format | Low |
| FS-059 | Technical documentation commits to 99.99% API uptime (≈52.6 min/yr) while depending on mobile-money rails and  | Low |
| FS-060 | Smaller defects in the technical documentation: the statement sample's event "BET"; a tax-details sample with  | Low |
| FS-061 | Gateway has two custody patterns: pass-through when merchants use their own shortcodes, aggregation when we co | Low |
| FS-066 | A likely third model: a core that holds deposits but has no loan module, so loans go to Fineract. The funds le | Low |
| FS-070 | sources/gatekeepr/ is git-ignored as well, which the approved proposal did not say. The files are snapshots of | Low |
| FS-077 | README.md "How to work here" is this project's operative layer (the STANDARDS.md role). It has no version, and | Low |
| FS-084 | PDFs are not scanned for protected names. The tracked PDFs carry staff names in their metadata and on team pag | Low |
| FS-088 | The MFI PRD calls the Daraja, Airtel Money, PesaLink and IPRS integrations "existing". The 8 Jun meeting lists | Low |
| FS-089 | Are payouts (refunds, disbursements to a merchant's customers) part of the Gateway? No source says | Low |
| FS-090 | Merchant onboarding and KYB checks are specified nowhere. An aggregator needs them before its first merchant | Low |
| FS-091 | No card acquirer is chosen. Whichever is chosen, card numbers must not touch our systems (hosted page or token | Low |
| FS-092 | Gateway deployment is not stated. Inferred: a multi-tenant service we operate on Liquid's Azure Stack, unlike  | Low |
| FS-094 | The commercially attractive mode (aggregation, for merchants with no shortcode of their own) is the regulated  | Low |
| FS-099 | A clickable prototype counted as Designed evidence. Is that the right grade, or should a prototype rank below  | Low |
| FS-103 | The protected-names list includes the 8 Jun gateway provider, from the anonymisation. The owner now names it o | Low |
| FS-106 | Which payment partners should we work with, given the regional footprint? | Low |
| FS-108 | The legal basis for escrow in each country: who may act as escrow agent, and whether the partner bank will | Low |
| FS-109 | Country becomes a configuration dimension, like ledger mode: licence and regulator, data residency, identity r | Low |
| FS-110 | Which of the seven countries Liquid offers Azure Stack in | Low |
| FS-111 | Data-localisation rules differ by country; some require payment data to stay in-country. They decide where eac | Low |
| FS-112 | Proposed partner strategy: direct integrations with mobile-money operators where volume justifies it, plus one | Low |
| FS-113 | Paystack's footprint covers Kenya and Nigeria of the seven, from memory. Strong for those two; weak as the reg | Low |
| FS-114 | Escrow has no native mode: it needs an institution that may hold third parties' funds in trust. A Sacco or MFI | Low |
| FS-115 | Escrow: who earns interest on held funds, and how unclaimed funds are handled | Low |
| FS-130 | Odoo wrapper form: an installed module, or Odoo's external API. Hosted Odoo Online may not allow custom module | Low |
| FS-131 | SME Recon native mode (no ERP): do we implement Odoo for the business, as integration partners? It turns a rec | Low |
| FS-133 | SME Recon writes into the ERP, unlike GateKeepr's read-only integrated mode. An edit made afterwards in the ER | Low |
| FS-134 | Which ERPs after Odoo and Zoho? A market question: no source here says what Kenyan SMEs use | Low |
| FS-135 | Odoo Enterprise has its own bank synchronisation. Where it already covers a Kenyan bank, SME Recon must not du | Low |
| FS-141 | Integrated mode for MFIs is not offered at launch. Moving up-market to registered lenders with a core would ne | Low |
| FS-143 | The consent rules for bank direct debits and mobile-money standing orders: what must be captured, and how canc | Low |
| FS-149 | API and MCP access, for our platform and for institutions' general needs | Low |
| FS-156 | Odoo 20 MCP acts as the user who created a static API key, with that user's access rights. Five read-only tool | Low |
| FS-159 | Our own platform MCP server: read tools first; anything that moves money goes through the mandate engine with  | Low |
| FS-164 | Marketing consent and opt-out rules: Data Protection Act direct-marketing provisions and the Communications Au | Low |
| FS-167 | Can we adopt Appwrite, the open-source backend platform? | Low |
| FS-168 | Where Appwrite could fit: the backend for omni-channel apps — app sessions, realtime, file storage, and app pu | Low |
| FS-169 | Appwrite keeps its own users and database. Unless it references parties by id, it becomes a fourth authority w | Low |
| FS-173 | Which core vendors do the target Saccos use, and what access do they offer? One adapter is needed per vendor | Low |
| FS-174 | Check-off reconciliation (employer remittances against members' expected deductions) may be the Sacco wedge: a | Low |
| FS-175 | Sacco regulation: SASRA licenses deposit-taking Saccos; the regime for credit-only Saccos depends on size and  | Low |
| FS-176 | Dividend and deposit-interest rules come from each Sacco's bylaws and AGM. The engine needs them as configurat | Low |
| FS-177 | The line between Sacco and Circle: registered Saccos here; chamas and informal groups in Circle, which is park | Low |
| FS-181 | SASRA may limit how many Saccos a single vendor serves. A ceiling on growth to understand before planning the  | Low |
| FS-183 | Collect the primary documents before building to them: the 6 Jun 2023 letter, SASRA's risk-management and ICT  | Low |
| FS-184 | As a core vendor, SASRA's prudential returns, loan classification and provisioning, and liquidity reporting mo | Low |
| FS-185 | A fit-gap of Fineract against a deposit-taking Sacco's needs (withdrawable savings, BOSA and FOSA, dividends,  | Low |
| FS-189 | What we keep of a retrieved credit report. Proposed: a reference, the score, the date and the summary used in  | Low |
| FS-191 | Submission frequency and form: monthly full-file, incremental, or real-time — whatever each bureau and the reg | Low |
| FS-210 | SASRA's 2023 letter, as reported, says Saccos and vendors integrating with M-Pesa operate under an umbrella fr | Low |
| FS-216 | The July recon proposal's "Application Runtime" for actors (state, timers, reminders, SDKs in C#, Java, Python | Low |
| FS-221 | SASRA's vendor requirements (FS-179) map onto specific projects: Falco for 24/7 runtime detection, Kubescape f | Low |
| FS-222 | Seven countries mean several clusters: Karmada for multi-cluster management, k8gb for failover between sites.  | Low |
| FS-225 | Semantic layer: Cube or dbt's semantic layer. Licences to confirm; Cube Core is Apache-2.0 from memory | Low |
| FS-227 | Which open-weight model, sized to the GPUs Liquid can provide | Low |
| FS-228 | The analytical store for the copies: a Postgres replica, or a column store such as ClickHouse (Apache-2.0) | Low |
| FS-229 | The insights evaluation set: questions with known answers, per product, run on every change and broken on purp | Low |
| FS-235 | App framework. Flutter is a candidate: one codebase for Android, iOS and web, and Dibon's GateKeepr work alrea | Low |
| FS-236 | Google Play's rules for lending apps in Kenya may require proof of the lender's licence. Sacco and MFI apps ar | Low |
| FS-237 | Omni-channel is the first module with screens, so it is where a drawn screen reference starts (FS-075): no scr | Low |
| FS-238 | The app backend: Appwrite behind Keycloak, or our own channel API service. Decided after the spike in FS-168 | Low |
| FS-254 | On images: diagrams and icons over stock photography. Stock photos read as filler to a bank. Photos worth havi | Low |
| FS-292 | Silver tier has requirements of its own (certified staff, sales volumes); what they are and when Dibon expects | Low |
| FS-312 | Zoho partner tier, and data residency: Zoho is software-as-a-service hosted outside Kenya, unlike Odoo on OPA | Low |
| FS-313 | Page 17's start-with and add pairings should be tested against real buyers before they become a sales playbook | Low |
| FS-376 | Draft Dibon's comments on the draft National Payment System Bill 2026 (comments close 9 Oct 2026) | Low |
| FS-393 | Airtel Money: the API integration was probably built for Onit Bank but never launched. T-Kash and PesaLink unk | Low |
| FS-424 | Should we consider SWIFT? Which other rails should we look at? | Low |
| FS-512 | The 2024 deck carries a second phone number beside the office line; the office line is the only number in outb | Low |
| FS-513 | The Apr 2025 RFP notes asked for network devices (firewalls, switches) watched through SNMP and syslog, and fo | Low |
| FS-542 | Consider 3, 4, 7, 8 and 9.svg as logo candidates; close the browser when done with downloads | Low |
| FS-897 | Is there a GitHub MCP tool we can use? | Low |

### Work started

None.

### Eric's Claude's work waiting

- `claude/emokaya/FS-1044-known-answers`: 2 saves, last 11 hours ago, not uploaded
- `claude/emokaya/FS-1045-deployment-diagrams`: 6 saves, last 47 seconds ago, not uploaded
- `claude/emokaya/FS-1048-handover`: 6 saves, last 47 seconds ago, not uploaded; here now, 3 files unsaved
