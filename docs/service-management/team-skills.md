---
id: team-skills
name: The team's skills — strong here, skills to acquire
kind: plan
status: living
released: unreleased
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-1196]
last_reviewed: 2026-11-14
---

# The team's skills

What the team is already strong in, and what each of us needs to learn
to build, maintain and operate the platform (FS-1196). It is drawn from
each person's CV as supplied on 14 November 2026, read against what the
platform is built on (architecture, technology). A CV says what someone
has written down, not all they can do: **each person corrects their own
row**, as they confirm their row in ways-of-working §1. It is a plan for
learning, not an appraisal.

## 1 · The team against the platform

How many of the eleven CVs name each thing the platform is built on.

| What the platform needs | CVs naming it | Reading |
|---|---|---|
| USSD, SMS and M-Pesa | 5 | Strong: where our record is |
| Odoo | 5 | Strong |
| PostgreSQL | 7 | Strong |
| Docker, Linux, CI/CD pipelines | 5 | Strong |
| Kubernetes | 4 | Good |
| Python | 5 | Good; the services are in Java |
| Java and Spring | 2, and one in Java and Kotlin for mobile | Thin for the lending and deposits services |
| Infrastructure as code (Terraform, Ansible) | 2 | Thin |
| Monitoring (Prometheus, Grafana) | 1 | One person |
| Automated tests | 2 | Thin |
| Mobile apps, Android and iOS | 1 | One person |
| Kafka and event-driven design | 1 | One person |
| Security testing | 1 | One person |
| Azure | 1 | One person |
| Apache Fineract, or Mifos | 0 | To acquire |
| Keycloak, OpenID Connect | 0; access roles designed in Odoo, 1 | To acquire |
| GitOps with Flux | 0 | To acquire |
| OpenBao, or Vault | 0; secrets management, 1 | To acquire |
| A security or ISO 27001 qualification | 0 | To acquire |

**What it says:** the team is strong at the edges of the platform
(channels, the back office, running containers) and has the core still
to learn: Fineract, Keycloak, Kafka, Flux. Four skills rest on one
person each. The first hackathon (client-cycle §6) is where the core is
learnt together; the people who already hold a thin skill teach it.

## 2 · Each of us

By first name, as in ways-of-working §1. "Strong here" is from the CV;
"skills to acquire" is what that person's squad and role need next.

| Who | Squad or role | Strong here | Skills to acquire |
|---|---|---|---|
| Eric | Team lead, architect, security lead | Banking channels end to end: USSD, SMS, M-Pesa; Java, Python and PHP; databases; running services, ITIL | Azure Stack and Kubernetes at the platform's size; a formal security qualification (ISO 27001 lead implementer), as security lead; handing roles on as the squads take them |
| Jimmy | Commercial lead | Mobile operators' messaging and USSD services from the inside, at scale; consulting with clients from scope to training; ITIL | Selling a platform to regulated lenders: the 2026 regulations as the pitch, pricing by money moved, a pipeline kept in the CRM |
| Lillian | Backend, leads | Java and Spring Boot; APIs for banks; mobile-money and payment integrations; microservices; Docker and Kubernetes; PostgreSQL and Oracle | Fineract from the inside (its data model, where it is extended); Kafka and events; Keycloak; automated tests; leading reviews as engineering lead |
| Gasine | Backend | Integrations and automation in Python: REST, webhooks, OAuth; access roles and user provisioning in Odoo; Linux, Kubernetes, CI/CD | Java and Spring for the services; Keycloak, building on the access work; Kafka; automated tests |
| Cliff | Channels | Android in Kotlin, iOS in Swift, Kotlin Multiplatform; offline-first apps that sync; release pipelines; test baselines | Signing in through Keycloak from a phone; device binding and the endpoints' rules; USSD and the web channel beside the apps; money journeys (a loan, a repayment) end to end |
| Allan | Ops, leads | Kubernetes, Docker and Rancher; Linux; CI/CD with Jenkins; AWS, GCP and Azure; PostgreSQL and MySQL | Flux and OpenTofu; CloudNativePG; OpenBao; alerts and on-call from service levels; chairing the change advisory board; Azure Stack |
| Max | Ops | Python and Flask; SQL; teaching others; an interest in security | The CI/CD seat's own tools: GitHub Actions, containers and Kubernetes, signed images, Flux, OpenTofu. CV to be brought up to date |
| Gibeon | Odoo, leads | Senior Python; Odoo modules and deployments; AWS (certified architect); Kubernetes and Helm; Terraform and Ansible; Kafka; Prometheus and Grafana; penetration testing; M-Pesa's Daraja | Azure; Odoo behind the back-office gateway. Can teach: Kafka, monitoring and security testing |
| Daniel | Odoo | Odoo as consultant and developer: accounting, HR, CRM and inventory configured; modules in Python; training and user manuals | Odoo behind the back-office gateway and its interfaces; a lender's own processes and chart of accounts; data migration; automated tests |
| Betty | Delivery, leads | Agile project management; stakeholders; requirements, procedures and onboarding guides; ERP implementations | The lender regulations and the approval pack; user acceptance for financial products; the release and change process, from the board's delivery seat; planning a data migration |
| Carol | Delivery | Finance operations and bookkeeping; bank and M-Pesa reconciliations; payroll and statutory returns; QuickBooks and Odoo; tenders | A thirteen-week cash forecast from the management accounts; SME Recon and Kapu Business as their first expert user and tester; cost per institution, for pricing |
| Abel, Chan, Cage | Channels (intern); marketing; legal and compliance | CV to come | To set once read |

## 3 · How the skills are acquired

- **Together, at the first hackathon:** Fineract, Keycloak and Flux,
  since no one holds them yet: each squad ships through them (client-cycle
  §6, the walking skeleton).
- **From each other:** the holder of a skill that rests on one person
  teaches a second: Kafka, monitoring and security testing (Gibeon);
  mobile (Cliff); Kubernetes (Allan, Lillian).
- **By doing, with an owner:** each "skills to acquire" becomes that
  person's piece of the first two hackathons, not a course.
- **Outside, where a certificate matters:** a security qualification for
  the security lead and a deputy; ISO 27001 before the banks ask (LC-04).

## 4 · Open

- Each person to correct and confirm their row.
- CVs for Abel, Chan and Cage.
- Who is second in each skill that rests on one person.
- A budget for outside training and certificates.
