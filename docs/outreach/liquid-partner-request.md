---
id: liquid-partner-request
name: Partner enquiry to Liquid
kind: outreach
status: draft
released: 2026.10.15
version: 0.2.0
owner: Commercial lead
classification: Internal
review_ids: [FS-457, FS-464, FS-481, FS-821, FS-822]
last_reviewed: 2026-10-14
---

# Partner enquiry to Liquid

To Liquid Intelligent Technologies (partners PT-01), through its partner
enquiry form or account team (FS-457, FS-464). It asks what its Nairobi
Azure Stack offers today, since the design uses only compute and Blob
storage there (platform-security §9), and about Sophos managed detection
for our own estate (SE-13, SE-14). Send from your own address; the name of
the person you write to stays out of this file.

## What to confirm with Liquid

One list, from everything that waits on Liquid (FS-481). The email below
opens the conversation; the meeting closes these.

| # | To confirm | Why it matters to us |
|---|---|---|
| 1 | Its Nairobi Azure Stack is current: services offered (virtual machine sizes, Blob storage, Key Vault), update cadence, who operates it and from where | The design uses only compute and Blob storage (platform-security §9, FS-461) |
| 2 | A second Kenyan site, and write-once (immutable) storage | Backups in two places, one immutable (SE-10, SE-20); the detail is "Storage, in detail" below |
| 3 | Protection from denial-of-service attacks, firewalls, private networking | SE-03 depends on Liquid |
| 4 | Availability commitments and support response times | Our tier objectives sit on top of theirs (platform-security §3) |
| 5 | Every copy of customer data stays in Kenya; Liquid's own subcontractors | Customers' regulators and data protection |
| 6 | That CBK and SASRA may audit and inspect Liquid as our subcontractor, and that it will sign that clause | Lenders' regulations (reg 31(5)) and banks' outsourcing rules flow down to it (approval pack item 11) |
| 7 | Its certifications (ISO 27001 and others) and audit reports for the data centre | Evidence for our approval pack |
| 8 | Exit: data returned and purged, and help to move | Approval pack item 14 |
| 9 | Sophos managed detection and response: machines covered (servers, laptops, Kubernetes nodes), what it may do without asking, how fast it calls us, where telemetry is processed, price per machine, whether we may resell it | SE-13, SE-14; the incident commitments (FS-466, FS-471) |
| 10 | Partner terms: hosting as an independent software vendor, reselling to financial institutions, in-country billing in shillings, any start-up credits | Runway before the first contract (docs/operating-model.md) |
| 11 | Its Azure Stack in Uganda, Tanzania, Rwanda, Zambia, Zimbabwe and Nigeria | The ready markets (FS-105, FS-371) |
| 12 | GPU capacity in Kenya | Self-hosted models (insights IN-08) |
| 13 | Whether consumption on Liquid's Stack counts towards Microsoft's partner programme | Microsoft partner designations (PT-52); unverified |
| 14 | Sophos scanning of files uploaded to our document vault, priced per institution, so customers who want a commercial engine can buy it through Liquid | Identity verification ID-15; ClamAV is the default (FS-525) |

## Storage, in detail (FS-821, FS-822)

Records of money are kept seven years, twelve for some loans, so storage
is most of an instance's long-run cost. Microsoft's documentation for
Azure Stack Hub (read 2026-10-14) gives its Blob storage general-purpose
v1 accounts, locally redundant, with immutable blobs through the API from
release 2008, and access tiers and soft delete not yet supported; Azure
proper has tiers, lifecycle rules and locked retention. So we plan the
tiers ourselves (recon §11): what Liquid offers decides how. Ask these at
the meeting, or send them as a list once it is booked.

| # | To confirm | Why it matters to us |
|---|---|---|
| S1 | The Azure Stack Hub release in Nairobi, and how often it is updated | Immutable blobs need release 2008 or later; features follow the release |
| S2 | Immutable blobs offered to tenants: a time-based retention policy that can be locked, legal holds, and protection per version | Records that no one may change or delete before their retention ends (SE-20; recon §10) |
| S3 | Whether Liquid, as the operator, can remove or shorten a locked retention policy, and under what procedure | A lock that holds against everyone, the host included, is what regulators expect of such records |
| S4 | Storage tiers or lifecycle rules: on the roadmap, or in another Liquid storage service hosted in Kenya (S3-compatible or otherwise) | Older records moved to cheaper storage automatically |
| S5 | Prices: Blob storage per GB a month; virtual disks by class (standard hard disk, premium SSD); transactions; traffic between Kenyan sites | Whether we use Blob storage for older records, or run our own object storage (Ceph) on Liquid's disks |
| S6 | Durability: how many copies local redundancy keeps, across how many failure domains; replication to a second Kenyan site | Our site B (deployment §1) |
| S7 | An offline or tape service for a last copy | SE-20's offline copy |
| S8 | How storage endpoints are kept off the internet, since the Stack's storage has no firewall or virtual-network rules | Storage reachable only from an institution's own instance (SE-05) |
| S9 | Encryption at rest, and whether we may hold the keys | Data encrypted under keys we control, as our backups are before they leave (SE-20); Restricted fields are already encrypted by us (SE-27) |
| S10 | Dense hard-disk capacity for our own object storage: about 6 TB per site for each large institution at our scale target, more for the largest | The scale target (quality.md) |

**Subject:** Partnership: Azure Stack hosting and Sophos MDR for a Kenyan
financial-software company

> Dear Liquid partner team,
>
> Dibon Consulting builds software for banks, Saccos, microfinance
> institutions and payment providers in Kenya: collections, a payments
> gateway, lending and Sacco systems, core banking, reconciliation and
> messaging. Our customers need their data held in Kenya, and we would
> like Liquid to host our platform and to work with us as a partner.
>
> Could you tell us:
>
> 1. **Azure Stack in Nairobi today:** the services available (virtual
>    machine sizes, Blob storage, Key Vault, and anything else), a second
>    Kenyan site for backups and recovery, availability commitments, and
>    protection from denial-of-service attacks.
> 2. **Storage for records kept seven years or more:** immutable
>    (write-once) storage, storage tiers, and prices by class. We have a
>    short list of questions to bring to the meeting.
> 3. **The partner programme:** the terms for an independent software
>    vendor hosting on Liquid and reselling to financial institutions,
>    and in-country billing.
> 4. **Sophos managed detection and response,** and Sophos endpoint
>    protection, for our own servers and staff laptops: what is included,
>    where the telemetry is processed, and whether we may offer it to our
>    customers, including Sophos scanning of the files our customers upload.
> 5. **GPU capacity** in Kenya, for models we would run ourselves.
> 6. **Regulators' access:** our customers' regulators require audit and
>    inspection rights over us and our subcontractors. Would Liquid accept
>    such a clause, and can you share your certifications and audit
>    reports?
>
> Could we meet in the next two weeks? I'm flexible Tuesday to Thursday,
> between 10am and 6pm.
>
> With thanks,
>
> [Your name]\
> Technology Lead, Dibon Consulting\
> +254 792 745 509 · [your email]
