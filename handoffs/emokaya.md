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
- **Documents share a look** (docs/company/design-system.md), consistent, not
  identical, a little whimsy in the margins only.
- **Attribution matters:** his work is his, Claude's is Claude's (FS-886,
  FS-905).
- **Downloads need his word;** never sign in, or enter a password, for him.
- **Visibility:** he prefers the team's work in the cloud and on a shared
  board (FS-929, FS-930); meetings are in person, no chat tool yet.
- **Document, don't build** (FS-1016): design and write it down; frame
  choices as design decisions, never as steps "before building".
- **Track legal concerns** (FS-1023): every legal uncertainty becomes an
  LQ row in docs/governance/legal-questions.md in the same pass; name the new LQ ids
  in the reply.
- **Show where it landed:** after a batch of work, say where each piece is
  in the reader, with its links.

## Where I left off

As at 5 November 2026. Main pushed with FS-1079 to FS-1117; `origin` is
still github.com/eric-mokaya/finance.

- **Roan Capital's CBK resubmission, due Friday 6 November at 14:00**
  (FS-1079 to FS-1117). Its first DCP submission was rejected; it is
  going for a licence under Part II (FS-1098, FS-1107). Six documents and
  two diagrams, built in its look from docs/templates/ and its values
  (clients/roan-capital/working/cbk/values.json) by tools/policies/build.js;
  the current versions in clients/roan-capital/working/, and copies in
  its folder "For Roan Capital, CBK pack" to share. The cover note to its
  CEO is v0.4 there; the Cc is still to fill.
  **Next:** its answers to the note's eight questions, the M-Pesa payout
  proposal (FS-1113, open answer 42: a B2C shortcode and its float, and
  its products' payout terms) and the four proposals (cooling-off,
  grace, cure, end of relationship); then the final rebuild that clears
  every yellow "[To confirm]", and the folder refreshed. Ours, shown "to
  follow, before launch": the hosting contract (Liquid), the identity
  providers, the penetration test, the website's domain (FS-1105), the
  Airtel Money and T-Kash dates.
- **Decided on 5 November:** every rail and every bank, both ways
  (FS-1108, FS-1109); WhatsApp out of R1 (FS-1110); Dibon the SMS
  provider under its PRSP licence (FS-1111); M-Pesa payouts proposed to
  Roan Capital (FS-1113); Tende Pay not for now, perhaps a competitor
  (FS-1115).
- **The services agreement** (being finalised; CBK receives it, reg
  6(2)): it should carry the exit schedule (Roan Capital's deployment
  §11), approval pack items 11 to 14 (CBK's access, reg 31(5)), the
  processor terms the policies promise, and that a site's loss sits
  outside the 99.9% (FS-1112, FS-1114, FS-1116). Roan Capital also owes
  CBK thirty days' notice of the outsourcing (reg 31(3)).
- **Soft launch 30 November,** Roan Capital's current process run beside
  it for about a month; field visits by the browser route (FS-1106);
  its first website, built by Dibon (FS-1105).
- **The hackathon (MVP day) moved to Friday 6 November.** Its outcomes
  then close FS-928 to FS-930 and FS-938 to FS-951, and the MVP day page
  is archived; **the release waits for that** (FS-1053, his word).
- **Prembly:** production tests this week, on the test plan (FS-1076);
  several identity providers, chained (FS-1077, FS-1078). Lillian's
  branch and row left as they are (his word).
- **From before:** the architecture README's item 5 (FS-1068); the
  settings baselines (FS-1037, FS-1050, FS-1060); waiting on his word,
  FS-935 and FS-367 (Critical), FS-1036, FS-1038, FS-1051, FS-1034,
  FS-1035, FS-1059; SBM Bank (FS-911 to FS-913, FS-920) and Lofty Corban
  (CU-05, FS-918).
- **On his machine:** Poppler for scanned PDFs, unpacked outside the
  repository and not on PATH; confidential scans rendered inside their
  folder and deleted after. No LibreOffice: Word files are rendered to PDF
  through Word itself, closing only the Word it started. The docx package
  for the builders: DOCX_MODULE pointing at another local project's copy
  (E:/Agents/Claude/DialysisWater/node_modules/docx), set in the same
  call as the build. Roan Capital's diagrams are SVG, drawn by a script
  and shot to PNG with headless Edge.

## Generated

*Made by dibon session start and end, from the register and the branches: never edit it by hand.*

### Rows with Eric: Critical, High, and waiting on Eric's word (74 of 198)

| Row | Point | Criticality |
|---|---|---|
| FS-202 | IPRS access: does each institution hold its own agreement, or Dibon on their behalf? | Critical |
| FS-205 | Whether the tax authority's PIN check, the business registration service, and operators' name lookups are avai | Critical |
| FS-340 | Identity: consider verification partners such as Smile ID and MetaMap | Critical |
| FS-367 | Dibon should also register with the ODPC as a data controller, for its own staff and customer data. Registrati | Critical |
| FS-735 | Roan Capital's contracted phase 1 is narrower than our R1: origination, KYC capture and digital onboarding, ap | Critical, waiting |
| FS-736 | The emails speak of a platform shell and foundational setup under way, and the 3 Oct review found a prototype  | Critical |
| FS-935 | Roan Capital's vehicle recovery ladder (a reminder on day 25, recovery or sale between days 31 and 47) against | Critical |
| FS-1080 | CBK has asked Roan Capital to prepare and submit its policies and documents (CBK Bank Supervision Department's | Critical |
| FS-016 | Compliance one-pager pricing: "Kshs 500,000 / USD 386.97" is off by 10×. At the rate the same sheet uses for O | High |
| FS-049 | Odoo Sign is a simple electronic signature. Confirm which financial documents Kenyan law requires an advanced  | High |
| FS-127 | Ask Safaricom whether a third party may operate on a client's shortcode with the client's consent (delegated a | High |
| FS-208 | The rail adapter interface needs a specification: operations, the normalised event, error and pending semantic | High |
| FS-209 | How each rail authenticates its callbacks: signatures, fixed source addresses, mutual TLS, or nothing. Where n | High |
| FS-279 | The undated compliance one-pager with the 10× pricing error (FS-016) should be withdrawn before this portfolio | High |
| FS-329 | Onboarding: IPRS covers Kenyan citizens only. How do Collect, Sacco and MFI onboard foreigners, refugees and c | High |
| FS-363 | Start the certification and licence applications as soon as possible | High |
| FS-564 | JN-03 findings: business-registry access (FS-205) blocks R1's business borrowers; statements from source (ID-1 | High, waiting |
| FS-690 | R1 binds each customer to their SIM (ID-12) and sends codes, signing links and M-Pesa disbursements to that nu | High, waiting |
| FS-748 | Which internal, client and third-party policies do we still need? | High |
| FS-786 | Is the virtual-accounts question an opportunity for us to run our core, for institutions without a capable pla | High, waiting |
| FS-796 | Continue with the companion design for Roan Capital | High |
| FS-812 | FS-807: agreed. Back to the draft product document: if it does not sit in the documentation, how will the deve | High, waiting |
| FS-893 | Permissions: who can join what, see what and do what, and who decides that: the PM, CTIO and CEO, or the team? | High |
| FS-898 | Delegation: how do we cover someone on leave (approvals, rows, merges, Claude's word)? | High |
| FS-899 | What do the regulations allow, at least and at most, between default or non-performance and selling collateral | High |
| FS-908 | How do we test all of this on GitHub: the words, the board, join, conflicts, and the GitHub settings? | High, waiting |
| FS-912 | For the meeting in person: what Dibon needs from SBM, and pricing and feasibility | High, waiting |
| FS-915 | A new customer, Lofty Corban: a fund manager (investments and retirement benefits; insurance a new line), regu | High |
| FS-916 | Lofty Corban's regulators are CMA, RBA and IRA, none of whose laws our law register holds: which to read first | High |
| FS-920 | SBM: what we promised in the meeting. A diagram of how data is handled (asked for), the documentation on how w | High |
| FS-928 | Coordinating the MVP day and after: dependencies, the critical path, everyone with their own Claude and GitHub | High |
| FS-929 | Work in the cloud, for visibility: each person deploys their components on Azure to test and check configurati | High |
| FS-930 | Use GitHub's board (Projects) as part of the set-up, for the MVP day and after | High, waiting |
| FS-934 | Roan Capital's three products, as locked on 21 October: Biashara (unsecured, KES 3,000 to 100,000, 14 or 30 da | High |
| FS-950 | MVP day (Friday 6 November), Eric: The day's authority: decisions, reviews, merges, and a mock change advisory | High |
| FS-992 | A wallet product brings millions of accounts, tiny loans and savings round the clock: Fineract and the lending | High |
| FS-993 | A wallet product needs the mobile operator's agreement: the product in its menu, the customer's data for limit | High |
| FS-1035 | Dibon's own Odoo is hosted on odoo.sh: how do we reconcile that with our design (rule 10: client material in D | High, waiting |
| FS-1036 | Decide: each institution's production instance on a Kubernetes cluster of its own, a namespace per zone inside | High, waiting |
| FS-1038 | Decide how each site's OpenBao unseals: a key held at the site, as deployment §2 says for site B, or automatic | High, waiting |
| FS-1042 | Add Roan Capital to the Google Drive folder, so its people update the documents themselves | High |
| FS-1049 | Set apart the questions Roan Capital answered at the 21 October meeting from those still needing its answer, s | High |
| FS-1051 | platform-security SE-08 says the databases are encrypted at rest by "PostgreSQL with transparent data encrypti | High |
| FS-1059 | Decide how the apps are built: their framework, whose name is in the app store, and the channel API's backend | High, waiting |
| FS-1063 | Roan Capital's people: three staff, its CEO and two loan officers, the CEO the platform's administrator; and t | High, waiting |
| FS-1065 | After an outage, hold every payout that was waiting until the institution has entered its hand payouts and the | High |
| FS-1069 | "I can't find info on the collateral register" | High |
| FS-1070 | "Where's the document vault?" | High |
| FS-1071 | How do we capture the physical location of the vehicle, particularly once we have claimed it for unpaid dues? | High |
| FS-1075 | Prembly: a Postman collection from Lillian, and Prembly's Kenya brochure, added to sources/confidential/prembl | High |
| FS-1076 | A test plan for Prembly in production this week; and Smile ID's online documentation reviewed, to compare with | High |
| FS-1081 | The notes of our meeting with Roan Capital on 3 November (emailed 4 November): what they settle, and what they | High |
| FS-1082 | Research CBK's rules on cooling-off periods and share them with Roan Capital (meeting of 3 November) | High |
| FS-1083 | Give Roan Capital CBK-aligned definitions of default, non-performing loan, grace period and moratorium (meetin | High |
| FS-1084 | Investor funds and a read-only investor portal for Roan Capital: capital locked for set periods (24 months, sa | High |
| FS-1087 | Create templates and design systems for the documents (CBK's licence pack) | High |
| FS-1089 | A standard for how fast security issues are fixed, and how long logs are kept, to include in the ICT policy | High |
| FS-1090 | The security fix times in plain words, with examples; does the architecture already include Azure Firewall; do | High |
| FS-1095 | What has CBK not asked for that we should include? We will soon begin the licence application, and this reques | High |
| FS-1096 | 30 November is Roan Capital's soft launch, with the current process continuing in parallel for about a month:  | High |
| FS-1097 | Go ahead with the recommendations for the soft introduction: an index of everything the application will carry | High |
| FS-1099 | How do we protect other devices, such as phones? | High |
| FS-1101 | A mixed case, the CEO's and CFO's phones issued by the company and the staff's their own; and how we handle co | High |
| FS-1105 | Include delivering Roan Capital's website | High |
| FS-1107 | Roan Capital is applying as a digital credit provider: its first submission was rejected, and what we are prep | High |
| FS-1108 | The delivery channels document is too narrow, repayments by M-Pesa and payouts by NCBA: how do we include the  | High |
| FS-819 | Do we store, for instance, all M-Pesa transactions in the companion? In the same database as Fineract? | Medium, waiting |
| FS-820 | FS-791 is answered by FS-792, unless something is missing. FS-819's one copy of the M-Pesa records: is the gen | Medium, waiting |
| FS-821 | Seven years at the scale target is large: how do we store it, like AWS S3's storage classes, to keep costs dow | Medium, waiting |
| FS-919 | Lofty Corban's open question: following a customer's international transfer that has not yet arrived (an SLA,  | Medium, waiting |
| FS-927 | Duplicate transactions: two the same within a few seconds, as when a customer retries believing the first fail | Medium, waiting |
| FS-1034 | Dibon keeps its own books in QuickBooks: port them to Odoo, and keep both for a time to learn what each can do | Medium, waiting |
| FS-424 | Should we consider SWIFT? Which other rails should we look at? | Low, waiting |
| FS-513 | The Apr 2025 RFP notes asked for network devices (firewalls, switches) watched through SNMP and syslog, and fo | Low, waiting |

And 124 more, Medium or Low: the Board, filtered by name, or the Review page.

### Work started

None.

### Eric's Claude's work waiting

- `claude/emokaya/FS-1117-cover-note`: 1 save, last 16 minutes ago, not uploaded; here now, 4 files unsaved
