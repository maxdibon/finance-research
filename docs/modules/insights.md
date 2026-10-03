---
id: insights
name: Insights — governed metrics and natural-language questions
kind: shared-service
version: 0.1.0
owner: Solution architect
classification: Internal
audience: [bank, sacco, mfi, psp, imt, sme, fintech]
depends_on: [access, recon-observability, collect, gateway, escrow, mfi, sacco, sme-recon, omni-channel, business-suite, core]
consumed_by: []
review_ids: [FS-006, FS-033, FS-043, FS-048, FS-151, FS-156, FS-157, FS-159, FS-220, FS-223, FS-224, FS-225, FS-226, FS-227, FS-228, FS-229]
last_reviewed: 2026-10-03
---

# Insights — governed metrics and natural-language questions

## 1 · In one paragraph

Insights answers business questions — in dashboards and in plain language
— from **metrics defined once**. A semantic layer holds every metric's
definition, owner and source authority: PAR30, match rate, float hours
left, SLA breaches, collections by channel. Dashboards and AI clients both
ask through it, so a number means the same thing everywhere. Every
natural-language answer shows the definition, the query and how fresh the
data is. Where governed metrics cannot answer, it says so rather than
improvising. **It never writes.** It is both a product and a tool for
Dibon (FS-033). **Dibon is the first customer**, starting with Odoo 20's
MCP server on our own data (FS-220).

## 2 · Who it is for

**Segments:** every customer, as the reporting layer of the products they
run. Dibon first.

**The problem, concretely:** each report computes its numbers its own way,
so the board pack and the operations dashboard disagree. Asking a question
means asking an analyst. Asking an AI tool over raw tables produces fluent,
confident and unchecked numbers. That breaks the rule a figure must have
a source, and it breaks the FlexMoney demo's promise: one definition per
number, traceable to a transaction.

**People who use it:**

| Role | What they need from it |
|---|---|
| CEO, board | A few numbers they can trust, the same every time they ask |
| Finance, operations | Dashboards per product; questions answered without an analyst |
| Analyst | Metrics defined once, reused everywhere, with an owner for each |
| Institution's AI client | MCP tools over governed metrics, never raw tables |
| Auditor | What was asked, what was answered, from which definition |

## 3 · What it does

**No specification exists.** Every row is **Planned**.

| Id | Capability | Status | Evidence | Phase |
|---|---|---|---|---|
| IN-01 | Dibon first: Odoo 20's MCP server, read-only, for our own CRM, helpdesk and sales data, one API key per person | Planned | FS-151, FS-156, FS-220 | 1 |
| IN-02 | Semantic layer: every metric defined once, with its owner, its source authority and its grain | Planned | FS-006, FS-220 — FS-225 | 2 |
| IN-03 | Analytical copies of the three authorities, read-only and stamped with how fresh they are | Planned | docs/architecture.md §2 — FS-228 | 2 |
| IN-04 | Dashboards per product in Apache Superset, built only on semantic-layer metrics | Planned | FS-220, FS-230 | 2 |
| IN-05 | Natural-language questions answered only through the semantic layer; each answer shows the definition, the query and the freshness | Planned | FS-006 | 2 |
| IN-06 | "Cannot answer from governed metrics" as an answer, with the nearest metric that exists | Planned | GateKeepr STANDARDS.md §6, carried over | 2 |
| IN-07 | An MCP server over the semantic layer, for institutions' AI clients | Planned | FS-159 | 2 |
| IN-08 | A self-hosted model served by KServe on Liquid's GPUs; a hosted model only for data classes allowed to leave | Planned | FS-043, FS-048, FS-220 — FS-227 | 2 |
| IN-09 | Row-level security per institution and role, from access | Planned | access AC-09 | 2 |
| IN-10 | A data-class gate: Restricted data never reaches a model; Confidential data only a self-hosted one | Planned | docs/architecture.md §7; FS-157 | 2 |
| IN-11 | A log of every question and answer: who asked, what was returned, from which definitions | Planned | FS-006 | 2 |
| IN-12 | The product metric catalogue: the metrics each module's dashboards publish, defined here once | Planned | FS-220 | 2 |
| IN-13 | An evaluation set of questions with known answers, run on every change, broken on purpose to prove it fails | Planned | FS-229; building-a-master §4 | 2 |
| IN-14 | Exports as a separate permission | Planned | docs/architecture.md §7 | 2 |

## 4 · Where it sits

**Depends on:** access (who is asking, and what they may see),
recon-observability (data feeds; platform health), and every product it
reads from: collect, gateway, escrow, mfi, sacco, sme-recon, omni-channel
and business-suite (FS-301), and core, the funds ledger in native mode.
**Used by:** customers and their AI clients directly. Each product's
dashboards are built on its metrics.

**Who holds which record** (docs/architecture.md §2):

| Record | System of record | This module |
|---|---|---|
| Funds, parties, obligations, matches | The three authorities | **Reads analytical copies; never writes.** Each copy carries its freshness |
| Metric definitions, owners, grains | **Insights (semantic layer)** | Holds. Versioned; every change attributed |
| Questions, answers, queries run | **Insights** | Holds. Append-only |
| Dashboards | **Insights** | Holds |

**The analytical copy is a deliberate exception** to "reference, never
copy", stated as one. It is read-only, labelled as a copy, and stamped
with when it was taken. A number from it is never presented as the
authority's live value.

**What this module never stores:** Restricted data, or anything an
authority would need to correct here as well as at home.

**Under each ledger mode:**

| | Integrated — the customer has a core | Native — no core; Fineract is the ledger |
|---|---|---|
| Where funds data comes from | Extracts or a replica from the core, on its cycle | Fineract, directly |
| What differs in this module | Freshness is the core's extract cycle | Near-live |
| What the customer must provide | An extract or replica feed | Nothing extra |
| Who it suits | Banks, larger Saccos | MFIs, smaller Saccos |

## 5 · How it works

```
  FUNDS LEDGER          ODOO                 RECON ENGINE
  core / Fineract       parties, invoices    matches, exceptions
       |                     |                     |
       +---------------------+---------------------+
                             |
               analytical copies (read-only, stamped)
                             |
                 +------------------------+
                 |  SEMANTIC LAYER        |  every metric defined once:
                 |  owner . source .      |  definition, owner, grain
                 |  grain . version       |
                 +------------------------+
                  |          |           |
           dashboards   MCP server   natural-language questions
                             |           |
                     institutions'    model (self-hosted, KServe)
                     AI clients          |
                                  answer + definition + query
                                  + freshness, or "cannot answer"

  Dibon, phase 1: Odoo 20 MCP server, read-only, per-person keys,
  straight to an AI client. No semantic layer yet; Odoo's data only.
```

## 6 · Rails and integrations

| Rail / system | Direction | Feed | Status |
|---|---|---|---|
| Odoo 20 MCP server | in | MCP, read-only tools | Planned (IN-01) |
| Core banking systems | in | extracts or replica | Planned |
| Fineract | in | database replica or API | Planned |
| Recon engine | in | event store | Planned |
| KServe-hosted model | out / in | inference API | Planned (IN-08) |
| Institutions' AI clients | in | MCP | Planned (IN-07) |

## 7 · Regulatory position

- **Custody:** none.
- **Data leaving the boundary:** only to a hosted model, and only for data
  classes allowed to leave (IN-10). The default is a self-hosted model.
- **Profiling:** questions about named individuals, such as a member's
  history, are personal data processing. They run under the asker's
  access and are logged.
- **Licences:** Superset is Apache-2.0 (FS-230). No AGPL component in
  insights today (docs/architecture.md §6.1).
- **Data:** answers inherit the class of the data behind them.

## 8 · Controls

- **No figure without a definition.** A number insights shows names its
  metric and source.
- **"Cannot answer" is an answer** (IN-06). It is better than a fluent
  guess.
- **Freshness is shown.** An analytical copy is labelled with when it was
  taken.
- **Checked by breaking.** The evaluation set (IN-13) must fail when a
  metric definition is perturbed. A test that only passes on correct data
  proves nothing.
- **Read only.** No MCP tool insights exposes can write.

## 9 · Deployment

Part of the shared platform, on Liquid's Azure Stack (FS-032). The model
runs on KServe where Liquid provides GPUs (FS-048). Without them, phase 2
waits, or runs only on data classes allowed to leave.

## 10 · What it does not do

- Write to any authority.
- Answer outside governed metrics without saying so.
- Replace operational screens. The exception queue stays in recon; the
  loan pipeline stays in mfi.
- Operational monitoring. That is Grafana, in recon-observability.

## 11 · Open questions

FS-043, FS-048, FS-224, FS-225, FS-226, FS-227, FS-228, FS-229.

## 12 · Sources

- REVIEW.md FS-006, FS-033, FS-043, FS-151, FS-156, FS-159, FS-220,
  FS-223.
- Odoo 20.0 documentation — AI MCP server.
- docs/architecture.md §2, §6, §6.1, §7.
- GateKeepr building-a-master.md §4 (verify a check by breaking it);
  STANDARDS.md §6 — principles carried over.
