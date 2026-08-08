# MVP and long-term roadmap

**Date:** 2026-08-07  
**Purpose:** concrete integration sequence for the main MVP task  
**Boundary:** research recommendation only; no application, Supabase, source-vault, external-service, or Git mutation is authorized here

## 1. Fastest defensible MVP

The MVP is **not** a separate wisdom engine. It is the existing Devam evidence/retrieval path plus four bounded controls:

1. **Material-context/applicability gate** — identify only fields that can change evidence, timing, safety, or action; ask a question only when the answer has positive decision value.
2. **Typed evidence and conflict** — distinguish source, claim, procedure, interpretation, synthesis, and conflict; preserve rather than silently resolve genuine variants.
3. **Coverage and verification gate** — require the object types a route needs, validate material claims/citations, and fail conditionally when evidence is insufficient.
4. **Bounded decision record** — for personal guidance/moral ambiguity only, record affected parties, up to three feasible actions, top consequences/reversibility, uncertainty/stop condition, evidence IDs, and a short reason code. Do not store or expose hidden chain of thought.

Cases, patterns, and school-specific interpretive relations are small pilots behind evaluation flags. A native graph, autonomous pattern mining, formal argument solver, causal modeller, multi-agent debate, or universal Indic ontology is outside the MVP.

## 2. Provisional first vertical

Run the first end-to-end experiment on **one bounded, rights-cleared ritual/festival vertical with real applicability and interpretive variation**. A Navarātri home-practice slice is provisionally attractive because it intersects a hero experience and the September–December Panchāṅga/ritual layer. It should be chosen only if the evidence audit confirms:

- a product-cleared primary/procedural evidence packet;
- deterministic date/location inputs;
- at least two genuine, documented variants or lineages;
- an actionable sequence, applicability, materials/substitutions, meaning/stories, timing, variants, and evidence meeting the ritual contract;
- reviewers competent for the exact traditions and languages;
- no need for unauthorized living-practice contact.

If those conditions fail, choose the best-evidenced bounded Ganesha or Dīpāvalī procedure instead. Do not force Navarātri for roadmap symmetry.

## 3. Phase plan

### Phase 0 — decision and evidence readiness

**Goal:** make one valid test possible without changing production behaviour.

Work:

- select the bounded vertical using rights, completeness, variant, and reviewer gates;
- create a compact evidence manifest and gold scenario packets;
- freeze the A0 strong-RAG baseline definition;
- agree hard failures, rubric anchors, promotion thresholds, latency/cost envelope, and reviewer scopes;
- register missing evidence explicitly; do not fill gaps with model synthesis;
- approve data minimization and trace-retention policy.

Exit:

- 30 pilot scenario families with at least four controlled variants each;
- each family has evidence IDs, required object types, acceptable alternatives, conflicts, prohibited inferences, and reviewer scope;
- no rights/sensitivity ambiguity in the test packet;
- evaluation protocol signed off before outputs are compared.

### Phase 1 — strong baseline and evaluation harness

**Goal:** establish A0 and discover whether current failures are actually architectural.

Work:

- implement/simulate hybrid lexical/vector retrieval with metadata filters and reranking;
- add citation/claim entailment and required deterministic tools;
- record exact model, prompt, evidence manifest, tokens, latency, and errors;
- build family-aware test splits, blinding, randomized pairwise review, and hard-gate reporting;
- run A0 on the 30-family pilot and perform error taxonomy review.

Exit:

- reproducible A0 results and evidence packet hashes;
- failure distribution shows which errors are retrieval, applicability, conflict, generation, safety, or evaluation failures;
- no “wisdom layer” is built for a failure the baseline does not exhibit.

### Phase 2 — minimal context and conflict scaffold

**Goal:** test A1/A2 with the smallest reversible schema.

Work:

- add/request-level context slots only for task-changing fields;
- add compact assertion, evidence/support, applicability, interpretation-attribution, and conflict records or equivalent manifests;
- declare route-specific required object types;
- implement conflict-preserving response modes: exact, conditional, plural, clarify, unable-to-ground, escalate;
- run same-evidence A0/A1/A2 comparisons.

Exit:

- A1/A2 meet the preregistered context/conflict thresholds;
- no severe-failure or exact/ritual regression;
- unneeded fields/features are removed;
- the enriched record can always be traced to source spans or an explicit product rule.

If thresholds fail, keep A0 and repair the evidence collection or router rather than promoting ontology.

### Phase 3 — bounded guidance deliberation

**Goal:** test whether the typed decision record improves personal-guidance and moral-ambiguity answers.

Work:

- route only eligible guidance/ambiguity requests to A3;
- generate an inspectable record with conflict, parties, options, consequences, reversibility, uncertainty, and stop condition;
- validate IDs/fields against retrieved evidence and scenario facts;
- compare A2/A3 at equal response length and evidence budget;
- red-team sycophancy, fatalism, authority, coercion, caste/gender/disability blame, professional boundaries, and unnecessary personalization.

Exit:

- ≥8-point reduction in predefined guidance failures with p95 latency ≤2× A2;
- no increase in rationalization, unsupported consequence claims, or privacy burden;
- trace retention is privacy-reviewed and excludes hidden chain of thought.

### Phase 4 — small case and pattern pilot

**Goal:** find out whether reviewed synthesis earns its editorial cost.

Work:

- curate 12–20 thick cases with original loci, multiple readings, roles, power, consequences, structural dimensions, disanalogies, and anti-precedents;
- curate at most 6–10 patterns with exact evidence, scope, counter-patterns, counterexamples, reviewer, and version;
- retrieve candidates semantically, then rank structurally;
- compare A3 with cases only, patterns only, and both;
- prohibit auto-retention of model-generated cases/patterns.

Exit:

- case/pattern promotion thresholds met on held-out guidance/ambiguity families;
- reviewer agreement adequate or legitimate disagreement represented;
- no story laundering, generic morals, tradition flattening, or one-lineage dominance;
- editorial time per accepted object is measured and sustainable.

Otherwise leave cases/patterns as internal research artifacts or remove them.

### Phase 5 — expand scenarios before ontology

**Goal:** validate generality across doors, hero areas, languages, and traditions.

Work:

- grow to the 160-family suite with 640–960 variants;
- add expert-authored Hindi/English/code-switched pairs and other priority languages as review capacity permits;
- validate all ritual-contract fields across selected hero lanes;
- audit collection/reviewer coverage and missing lanes;
- evaluate user comprehension of concise answers and progressive disclosure;
- monitor correction propagation and version reproducibility.

Exit:

- per-slice and per-language evidence of gain, not a pooled headline;
- stable hard-failure rate within release tolerance;
- documented null/negative slices and route-specific fallback to the simpler arm.

### Phase 6 — long-term capabilities, one benchmark at a time

Candidates and their gates:

| Candidate | Only consider when | Evidence required |
|---|---|---|
| Global corpus/relationship exploration summaries | exact user queries fail due to distributed evidence | GraphRAG vs SQL/hybrid-RAG benchmark, ≥10-point gain |
| Formal argument graph | users need inspectable support/attack debate beyond conflict labels | correct reconstruction, reviewer time reduction, no false resolution |
| Causal/temporal model | repeated decision domain has identified variables and credible data | causal assumptions, sensitivity, calibration, expert validation |
| Native graph database | Postgres traversal/latency/operations fail measured SLOs | representative benchmark and migration/operations case |
| Model fine-tuning | stable, rights-cleared, high-quality task data and prompt/RAG ceiling | held-out gain, regression/safety tests, reproducibility |
| Authorized living-practice programme | published evidence cannot answer a defined product need | ethics/rights approval, consent protocol, community governance, revocation propagation |
| Longitudinal companion evaluation | bounded response safety is stable | consented study of comprehension, action, correction, dependency, regret |

## 4. Concrete integration work packages for the main MVP task

These are interfaces and artifacts the main task can implement in its own sequence. This programme does not modify them.

### WP1 — request envelope

Add a versioned request object containing:

- `request_class`, `risk_class`, `user_goal`;
- explicitly stated `tradition`, `lineage`, `location`, `date`, `role`, constraints;
- field source (`user_stated`, `deterministic_tool`, `account_preference`, `unknown`);
- consent/persistence flag for optional user context;
- maximum one high-value clarification at a time.

### WP2 — evidence envelope

Return typed retrieval items with:

- object type and stable version ID;
- source span/edition/translation identity;
- provenance, rights lane, review state;
- tradition/lineage/region/time/role/applicability scope;
- support/opposition relation and conflict group;
- score components (lexical, semantic, graph/typed expansion, scope, authority-by-competence, recency where relevant);
- excluded-item reason for audit.

### WP3 — coverage contract

Each route declares required and optional object types. Examples:

- exact fact: source span + assertion + edition/translation;
- ritual: procedure + applicability + timing + materials/substitutions + variants + evidence;
- story: narrative + version/source + context + interpretations when material;
- guidance: claims + relevant cases/patterns if promoted + conflicts + safety/modern expertise where needed.

The generator receives an explicit `coverage_status` and must not silently compensate for missing types.

### WP4 — decision record

Use the schema/API sketch in [DATA_MODEL_AND_PROVENANCE.md](DATA_MODEL_AND_PROVENANCE.md) and [RETRIEVAL_AND_DELIBERATION_DESIGN.md](RETRIEVAL_AND_DELIBERATION_DESIGN.md). Validate evidence IDs, allowed conflict types, party-basis labels, action count, consequence evidence level, and stop condition. Retention should be minimal and configurable.

### WP5 — renderer

Implement response contracts, not a monolithic persona prompt:

- useful answer first;
- source/lineage attribution only when material or requested;
- no guru/divine authority voice;
- concise conditional branches;
- explicit limitation plus useful next step on failure;
- citations, variants, and alternatives progressively disclosed without hiding decision-changing conflict.

### WP6 — evaluation hooks

Log versioned trace IDs and metric fields without storing free-form hidden reasoning. The harness should be able to replay a fixed evidence packet and compare A0–A4 under the fairness controls.

## 5. Data and governance dependencies

| Dependency | MVP handling | Long-term handling |
|---|---|---|
| Complete source identity and provenance | mandatory; no surrogate metadata as content | expand collection independently |
| Rights | product-cleared only for product answers; internal-only isolated | rights review and revocation propagation |
| Translation | identify source/translator/Devam/model draft | multi-translation comparison and reviewer workflow |
| Interpretation | attribute exact interpreter/lineage | broader commentary graph with coverage audit |
| Living practice | published, rights-cleared evidence only; label as account | separately authorized consent-governed programme |
| User context | minimal, explicit, task-changing | consented preferences with deletion and provenance |
| Review | exact lane competence and dissent | reviewer calibration, coverage, and succession |
| Syntheses | draft → reviewed → active with evidence/version | scheduled contradiction/staleness review |

## 6. Operations and rollback

- Every optional layer is feature-flagged by route/slice.
- A simple-arm fallback remains available.
- Versions of evidence, syntheses, router, prompts, and response policy are independently identifiable.
- A correction or rights change invalidates affected derived objects and cached answers through explicit dependency edges.
- Quality monitors track severe failures, unsupported claims, route errors, conflict misses, clarification burden, latency, and cost by slice.
- Roll back a layer—not the source evidence—if its acceptance or live safety threshold fails.

## 7. Staffing/competence, not headcount assumptions

Required functions include:

- source/provenance and rights stewardship;
- ritual/tradition review scoped to each lane;
- Sanskrit and relevant vernacular philology/translation;
- retrieval/evaluation engineering;
- safety, privacy, and safeguarding review;
- product/UX research for comprehension and agency;
- statistical evaluation and disagreement analysis.

One person may cover several functions, but no generic “Indic expert” should approve all traditions, procedures, languages, and harms.

## 8. Roadmap success condition

The programme succeeds if Sārthi becomes measurably better at helping users reach sound, context-appropriate, source-grounded next actions while remaining modest about authority and uncertainty. It also succeeds when an attractive layer is rejected because strong grounded RAG performs as well. Complexity avoided is a valid research result.
