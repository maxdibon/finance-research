---
kind: minor
for: team
rows: [FS-1077]
by: Claude for Eric (Assistant)
---
Identity supports several providers behind each check: direct sources such as NPDM (formerly IPRS), KRA GavaConnect and the business registry, and aggregators such as Prembly and Smile ID. Each institution's checks are routed per check, with a primary and a fallback; every result names its provider; a provider joins once its tests and our partner rules pass. A second provider is asked only when the first fails, never just to compare (a question for counsel, LQ-35). Onboarding asks each institution its route and its consent to each provider (OB-COM-27). The Prembly test plan now compares providers to set which goes first for each check, not to choose one.
