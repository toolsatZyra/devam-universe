# Decision record

**Programme:** Sārthi practical artificial wisdom  
**Decision date:** 2026-08-07  
**Status:** research recommendation for main-MVP integration and testing  
**Authority boundary:** this record does not authorize production changes, source acquisition, external contact, spend, publication, or external-service mutation

## DR-001 — product target

**Decision:** Build and evaluate **wisdom-supporting response behaviour**, not an entity claimed to be wise.

**Why:** Wisdom research is multidimensional, situated, and measurement-dependent. Current LLM evidence does not establish stable wisdom, lived compassion, spiritual insight, or reliable metacognition.

**Consequences:** Use hard failure gates and a capability vector on scenario families. Prohibit scalar “wisdom scores,” guru/oracle framing, and model self-certification.

**Confidence:** high.

## DR-002 — baseline and burden of proof

**Decision:** Strong grounded hybrid RAG is the null baseline. Every additional layer must beat the immediately simpler arm under same-model, same-evidence, same-budget controls.

**Why:** Many proposed benefits may come from better evidence, metadata, routing, or prompting rather than a novel reasoning architecture.

**Consequences:** Null results remove or narrow features. Curated content advantages must be separated from representational advantages.

**Confidence:** high.

## DR-003 — architecture shape

**Decision:** Use a six-layer logical architecture: source objects; atomic information/assertions; contextual knowledge/procedures; reviewed patterns; reviewed cases; inference-time deliberation. Deploy only the minimum layers each request needs.

**Why:** It preserves source identity and separates reviewed offline synthesis from runtime judgment. It matches the authoritative Sārthi wisdom architecture without requiring every layer at MVP scale.

**Consequences:** Patterns and cases are optional pilots; inference cannot convert a draft into reviewed knowledge.

**Confidence:** high for separation, moderate for case/pattern utility.

## DR-004 — minimum middle layer

**Decision:** The MVP candidate middle layer contains:

- assertion/evidence provenance;
- source versus interpretation versus Devam-synthesis attribution;
- applicability/scope;
- required evidence-object types;
- typed conflict and alternative groups.

**Why:** These fields target observable errors: source/commentator confusion, false universalization, incomplete procedure bundles, and silent conflict resolution.

**Consequences:** Implement as compact Postgres records/manifests and test A1/A2. Do not create an all-domain ontology.

**Confidence:** moderate-high pending product experiment.

## DR-005 — storage technology

**Decision:** Use Postgres/Supabase-first relational tables, JSONB where a pilot needs flexible dimensions, full-text, pgvector, recursive SQL, and PostGIS where spatial data is relevant. Do not add a native graph database for conceptual neatness.

**Why:** The MVP graph is small, typed, and provenance-heavy; operational simplicity and existing product direction dominate. GraphRAG evidence concerns selected global corpus questions, not all Sārthi tasks.

**Revisit when:** a representative query benchmark shows a ≥10-point gain or material SLO/operational advantage after optimized Postgres and hybrid retrieval.

**Confidence:** high for MVP.

## DR-006 — cases and patterns

**Decision:** Pilot a small reviewed case set and pattern set only on personal-guidance and moral-ambiguity routes. Require cases to include structural dimensions, affected parties, consequences, disanalogies, and anti-precedents; require patterns to include scope, evidence, counter-patterns, counterexamples, reviewer, and version.

**Why:** Case/analogy research supports relational structure over surface similarity, and Indic narratives offer thick cases. No evidence yet shows a stored layer beats same-evidence grounded RAG for Sārthi.

**Consequences:** Never auto-retain model outputs. Remove the layer if analogy errors, unsupported synthesis, or editorial cost outweigh gain.

**Confidence:** moderate that a pilot is worthwhile; low that scale is justified now.

## DR-007 — Indic intellectual traditions

**Decision:** Adopt tradition-qualified epistemic disciplines—warrant, interpreter attribution, standpoint/scope, discourse purpose, conflict preservation, disanalogy, and living-practice provenance—using plain operational schema names. Reject a universal “Indic wisdom ontology” or automated dharma solver.

**Why:** Nyāya, Mīmāṃsā, Jain, Buddhist, Dharmaśāstra, epic, commentarial, and living traditions are internally diverse and often disagree. Their methods cannot be flattened into one product authority.

**Consequences:** School-specific terms appear only with exact provenance, domain, period, and reviewer. Historical doctrine is not automatically a current community norm.

**Confidence:** high.

## DR-008 — living practice

**Decision:** Treat living practice as dated, located, role- and consent-scoped evidence. Do not infer normativity from prevalence or scrape public practice as ethnographic ground truth. No fieldwork is authorized.

**Why:** Texts omit embodiment and current variation, but collection raises consent, sensitivity, rights, representation, and power risks.

**Consequences:** MVP uses only lawfully available, rights-cleared published accounts and labels them accurately. A future acquisition programme requires separate authorization and governance.

**Confidence:** high.

## DR-009 — retrieval planner

**Decision:** Classify request and risk, collect only material context, estimate clarification value counterfactually, declare required evidence types, apply scope/rights filters, retrieve/rerank typed objects, diagnose conflict and coverage, then choose an answer mode.

**Why:** Different doors need different evidence. Ritual vidhi is a procedure/applicability problem; moral ambiguity is not solved by the same retrieval target as an exact quotation.

**Consequences:** One generic semantic search call is insufficient. Clarification questions need answer-change reason codes.

**Confidence:** high for design logic, moderate pending route-accuracy tests.

## DR-010 — inference-time deliberation and transparency

**Decision:** For eligible guidance routes, produce a bounded typed decision record, not a persisted or exposed hidden chain of thought.

**Required record:** request/risk class; material context; clarification; evidence IDs; conflict types; affected parties with basis; up to three actions; top consequences/reversibility; uncertainty/stop condition; response strategy; short reason code.

**Why:** Current evidence does not establish that free-form self-reasoning is faithful or self-correcting. A typed record is externally inspectable and privacy-minimizable.

**Consequences:** The user receives a concise conclusion, rationale, options, material alternatives/uncertainty, and citations—not token-by-token reasoning.

**Confidence:** moderate-high for safety/inspectability; product lift still needs A2/A3 ablation.

## DR-011 — offline versus inference-time synthesis

**Decision:** Perform stable, evidence-heavy, reviewable work offline; do user-specific, current-context, reversible comparison at inference time.

**Offline:** source parsing; assertions; procedures; applicability; interpretation relations; conflict groups; reviewed case/pattern versions; evidence coverage; contradiction checks.

**Inference time:** request classification; material context; deterministic tool use; retrieval; applicable variants; affected parties; feasible options; bounded consequences; answer mode.

**Never promote automatically:** model drafts, generated cases, inferred community positions, or runtime advice.

**Confidence:** high.

## DR-012 — evaluation and release evidence

**Decision:** Use 160 held-out scenario families with controlled variants, blind multi-role review, hard failure gates, capability vectors, behavioural metrics, multilingual slices, and cost/latency. LLM judges assist but never accept.

**Why:** Isolated prompts, self-ratings, preference alone, and pooled averages are easy to game and hide severe slice failures.

**Consequences:** Report disagreement, null results, exact model/evidence/prompt identities, and per-slice outcomes. There is no release claim until a candidate meets preregistered gates.

**Confidence:** high for method; reviewer reliability remains open.

## DR-013 — explicit rejections and deferrals

| Alternative | Decision | Rationale | Revisit trigger |
|---|---|---|---|
| Pure passage RAG as permanent architecture | baseline, not rejected | simplest serious comparator | retain wherever enriched arms do not win |
| Universal wisdom/values ontology | rejected | false universality and normative authority | none; only scoped domain vocabularies |
| Scalar wisdom score | rejected | invalid precision; masks hard failures | none for product claims |
| Mīmāṃsā automatic conflict resolver | rejected | unjustified domain/authority transfer | narrow specialist-authored relation pilot only |
| Seven-valued syādvāda engine | rejected for MVP | contested formalization; no product benchmark | specialist-backed use case and measured gain |
| Argumentation solver | deferred | conflict labels are simpler; semantics/authority omitted | unresolved repeated argument task with benchmark |
| Causal model | deferred/rejected for personal advice | no identified data/model for moral outcomes | bounded causal domain with validated assumptions |
| Cognitive architecture | rejected for MVP | complexity without identified failure | no broad trigger; decompose into testable mechanisms |
| Neuro-symbolic end-to-end system | deferred | representation/training/validation burden | narrow task where simple hybrid fails |
| Multi-agent debate | rejected as default | correlated errors and persuasive rationalization | independent evidence/tool roles with calibrated gain |
| Automatic commentary harmonization | rejected | fabricates consensus | none; synthesis remains attributed/reviewed |
| Authority/prestige score | rejected | competence is topic-specific | evidence-specific reliability model only |
| Autonomous case/pattern mining into active store | rejected | feedback loop and unverifiable synthesis | human-reviewed drafts may be proposed, never auto-active |
| Native graph database | deferred | Postgres is sufficient until benchmark | measured query/SLO/operations case |

## DR-014 — roadmap gate

**Decision:** Integrate by experiments A0 → A1 → A2 → A3 → A4, promoting only the simplest arm that meets the task slice's threshold.

**Why:** This distinguishes evidence improvements from architecture and makes rollback straightforward.

**Consequences:** Sārthi may use A0 for exact facts, A2 for variant-rich ritual questions, A3 for guidance, and no A4 at all if cases/patterns fail. One global “wisdom mode” is not required.

**Confidence:** high.

## Confidence summary

| Claim | Confidence |
|---|---:|
| The product must not claim model wisdom/divine authority | High |
| Provenance, scope, attribution, and conflict separation are necessary for safe Devam synthesis | High |
| Material-context and typed-conflict controls will reduce identifiable retrieval/generation failures | Moderate-high, not yet product-tested |
| A bounded decision record will improve guidance | Moderate |
| Thick cases will improve analogy and actionability | Moderate-low pending review and ablation |
| Pattern libraries will add value beyond same-evidence RAG | Low-moderate |
| School-specific formal logic will add MVP value | Low |
| A native graph or cognitive architecture is necessary | Low |

## Open decisions for the main MVP task

1. Which bounded hero vertical is complete and rights-cleared enough for the 30-family pilot?
2. Which exact current model(s), cost ceiling, and latency envelope should be tested? Record this at execution time; do not rely on this dated research snapshot.
3. Which reviewers can competently cover the chosen source, procedure, lineages, languages, safety, and affected perspectives?
4. What trace fields can be retained under the product privacy policy, and for how long?
5. What constitutes a release-blocking hard-failure rate for each route and risk class?
6. Can the first experiments be run entirely on existing product-cleared evidence, or is the evidence packet the actual blocker?
