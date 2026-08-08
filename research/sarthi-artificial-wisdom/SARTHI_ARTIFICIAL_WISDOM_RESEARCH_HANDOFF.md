# Sārthi practical artificial wisdom — research handoff

**Research date:** 2026-08-07  
**Audience:** Devam/Sārthi main MVP task  
**Status:** adversarially reviewed research recommendation; architecture efficacy is not yet proven  
**Scope of work completed:** psychology/philosophy of wisdom, decision and cognitive science, case/analogy, knowledge representation, argument/causal reasoning, IR/RAG, uncertainty/calibration, multi-perspective deliberation, selected Indic epistemic/hermeneutic traditions, living-practice ethics, local representational probes, evaluation design, and integration sequencing

## 1. Executive recommendation

Do **not** build a standalone “wisdom engine.” Build Sārthi as an evidence-grounded companion whose observable responses can support wiser human judgment.

The fastest defensible candidate is:

1. a strong hybrid grounded-RAG baseline over Devam sources, assertions, and procedures;
2. a small material-context and clarification-value gate;
3. typed source/claim/interpretation/applicability/conflict records and required-evidence coverage;
4. deterministic tools for Panchāṅga and other computable facts;
5. a bounded, inspectable decision record only for personal-guidance and moral-ambiguity routes;
6. concise response contracts with source/lineage attribution and alternatives when material;
7. cases, patterns, and tradition-specific interpretive relations only as small reviewed pilots that must beat the same-evidence baseline.

Use Postgres/Supabase-first relational storage, full-text, pgvector, recursive SQL, and PostGIS where relevant. Do not add a native graph, argument solver, causal engine, cognitive architecture, multi-agent debate, or autonomous pattern miner without a task-specific benchmark showing a material gain.

The central design principle is:

> Preserve source identity, applicability, difference, and uncertainty offline; make only the user-specific comparison needed at inference time; expose a concise recommendation and evidence, not hidden chain of thought or artificial authority.

## 2. What “wisdom” means operationally

Sārthi should be evaluated for **wisdom-supporting performance**, defined as:

> Evidence-accountable, context-sensitive judgment under material uncertainty that identifies the real need; retrieves and distinguishes relevant sources, claims, procedures, cases, interpretations, and values; represents materially affected perspectives without inventing consensus or false equivalence; compares feasible actions and near- and longer-term consequences; recognizes what is unknown and asks only clarifications that can change the answer; and offers proportionate, compassionate, revisable action without sycophancy, fatalism, or false authority.

This is a product synthesis, not a scientific claim that one latent property has been found.

### Functional distinctions

| Construct | Operational meaning | Validation |
|---|---|---|
| Data | recorded symbols, observations, media, measurements, event traces | fixity, identity, provenance, rights, parse/measurement quality |
| Information | data organized into a bounded assertion or description | correct transformation, scope, traceability |
| Knowledge | reusable supported claims, relationships, procedures, cases, and interpretations with applicability | evidence, conflict, scope, review, version |
| Intelligence | ability to retrieve, compare, infer, plan, and solve | task performance and robustness |
| Judgment | selection among interpretations/actions under constraints, uncertainty, stakes, and values | ex-ante process, calibration, proportionality, consequences |
| Insight | a useful, evidence-fitting relationship or reframing | novelty, evidence fit, utility, falsifiability |
| Wisdom-supporting performance | contextual, evidence-accountable, compassionate judgment yielding proportionate revisable action | scenario vector plus hard gates and counterfactual tests |

This is not a DIKW pyramid. More bytes, graph edges, or intelligence do not automatically produce judgment or wisdom.

## 3. Evidence-backed capability and limitation boundary

As of the research cut-off, current LLMs can:

- synthesize and compress retrieved text;
- produce fluent, often highly perceived compassionate language;
- perform strongly on some language-based perspective tasks;
- benefit on bounded tasks from retrieval, typed prompting, perspective scaffolds, and uncertainty detectors;
- classify, extract, and draft structured candidate records for human/tool validation.

They cannot be assumed to:

- know when their answer is correct from prose confidence or token likelihood;
- reliably self-correct by “thinking again” without new evidence or feedback;
- generate independent perspectives merely by sampling/debate;
- preserve cultural/tradition fidelity across languages and underrepresented contexts;
- infer a user's caste, lineage, values, spiritual status, or community practice safely;
- experience compassion, humility, spirituality, or lived consequences;
- provide faithful causal explanations through hidden chain of thought;
- resolve normative conflict by eloquence, majority, or a single sacred story;
- speak as guru, oracle, divine authority, doctor, therapist, lawyer, or universally authorized ritual teacher.

Therefore the system's authority comes only from inspectable evidence, deterministic computation, explicit product rules, scoped reviewers, and calibrated evaluation—not model rhetoric.

## 4. Recommended architecture

```mermaid
flowchart LR
    subgraph Offline["Offline evidence and review plane"]
      S["Immutable source objects"] --> X["Extraction and translation records"]
      X --> A["Assertions, warrants, procedures"]
      A --> I["Applicability, interpretations, conflicts"]
      I --> P["Reviewed patterns - optional"]
      I --> C["Reviewed cases - optional"]
      A --> V["Contradiction, rights, review, version checks"]
      P --> V
      C --> V
    end

    subgraph Online["Inference plane"]
      Q["User request"] --> R["Classify request and risk"]
      R --> K["Material context and clarification value"]
      K --> T["Typed retrieval plan"]
      T --> H["Hybrid retrieval and deterministic tools"]
      H --> G["Coverage, conflict, citation checks"]
      G --> D["Bounded decision record when needed"]
      D --> O["Concise response contract"]
      G --> O
    end

    V --> H
```

### Six logical evidence layers

| Layer | Contents | Promotion rule | Primary use |
|---|---|---|---|
| 1. Sources | exact witnesses, editions, media, original-language spans | lawfully held, fixed, provenance/rights known | exact fact, quotation, source exploration |
| 2. Information | atomic assertions, translations, descriptions | traceable extraction/translation | factual retrieval and citation |
| 3. Contextual knowledge | entities, relations, procedures, applicability, conflicts, interpretations | validated/reviewed by risk | ritual, comparison, contextual retrieval |
| 4. Patterns | scoped reviewed Devam syntheses, counter-patterns, counterexamples | evidence + named review + version + pilot win | practical guidance only if proven |
| 5. Cases | thick source/lived situations, actions, consequences, readings, disanalogies | rights + review + structural fields + pilot win | analogy and moral ambiguity |
| 6. Deliberation | request-specific decision record and response | runtime only; never promoted automatically | contextual judgment and action |

The layers are not epistemic ranks. A source can be uncertain; a reviewed synthesis can be useful but remains Devam-derived; an inference response is not knowledge merely because it was generated.

## 5. Minimum data model

Keep source bytes content-addressed outside application code. The middle layer contains compact identities and relations. This pseudo-DDL is a logical contract, not a migration:

```sql
source_span(
  id, source_object_hash, edition_id, witness_id, locator,
  original_language, text_hash, rights_lane, provenance_id
);

assertion(
  id, proposition, assertion_type, source_span_id,
  source_or_synthesis, discourse_level, status, version
);

scope(
  id, tradition, lineage, region, place, valid_time,
  participant_role, life_stage, occasion, genre, purpose,
  explicit_unknowns
);

warrant(
  id, assertion_id, warrant_kind, asserted_by,
  competence_scope, transmission_kind, support_summary,
  defeater_summary, review_id
);

evidence_link(
  id, assertion_id, source_span_id, relation,
  scope_id, extraction_activity_id, confidence_components,
  reviewer_id, review_status
);

interpretation(
  id, interpreter_id, lineage_id, source_span_id,
  operation_type, target_assertion_id, rationale,
  scope_id, dissent_status, review_id, version
);

procedure(
  id, title, purpose, applicability_scope_id,
  deterministic_timing_rule_id, ordered_steps,
  materials, substitutions, safety_notes,
  variant_group_id, evidence_set_id, review_id, version
);

conflict_group(
  id, conflict_type, summary, member_assertion_ids,
  scope_relation, resolution_status, resolution_basis,
  unresolved_reason, review_id, version
);

case_record(
  id, source_id, narrative_frame, actors_roles,
  rule_or_value_at_issue, context_trigger, actions_intentions,
  affected_parties, consequences, interpretations,
  structural_dimensions, disanalogies, anti_precedent,
  scope_id, rights_lane, review_id, version
);

pattern_version(
  id, pattern_id, statement, applicability_scope_id,
  mechanism_or_rationale, evidence_links, counter_pattern_ids,
  counterexamples, uncertainty, reviewer_id, status, version
);

decision_trace(
  id, request_class, risk_class, context_snapshot,
  clarification_record, evidence_ids, coverage_status,
  conflict_types, affected_parties, candidate_actions,
  consequence_summary, uncertainty, stop_condition,
  response_strategy, short_reason_code,
  model_policy_versions, retention_class
);
```

### Invariants

1. Source original, translation, commentary, living account, scholarship, Devam synthesis, and model draft have different identities.
2. Every derived assertion links to an activity, exact input versions, and the agent/tool/reviewer responsible.
3. `rights_lane` and sensitivity filter before retrieval, not after generation.
4. Scope can be unknown; the system does not guess a lineage.
5. Conflicting assertions can coexist and remain unresolved.
6. Confidence is decomposed—source quality, extraction certainty, corroboration, conflict, scope fit—not one prestige score.
7. Model-generated cases/patterns never become active without review.
8. Corrections, embargoes, or rights changes invalidate dependent embeddings, syntheses, traces, and caches through explicit derivation edges.

## 6. API sketches

### Planner request

```json
POST /v1/sarthi/plan
{
  "request_id": "...",
  "text": "Tell me the correct Navaratri puja for tomorrow",
  "explicit_context": {
    "location": null,
    "tradition": null,
    "role": "home_practitioner",
    "language": "en"
  },
  "context_persistence": "this_request_only"
}
```

### Planner response

```json
{
  "request_class": "ritual_vidhi",
  "risk_class": "R3_procedure",
  "required_types": [
    "procedure", "applicability", "deterministic_timing",
    "materials_substitutions", "variant", "evidence"
  ],
  "clarification": {
    "ask": true,
    "field": "location",
    "reason_code": "changes_deterministic_date_and_timing"
  },
  "routes": ["panchanga_tool", "procedure_retrieval"],
  "answer_mode_if_unanswered": "conditional_overview"
}
```

### Retrieval response envelope

```json
{
  "request_id": "...",
  "items": [
    {
      "object_id": "procedure-version-id",
      "object_type": "procedure",
      "source_span_ids": ["..."],
      "scope": {"tradition": "...", "region": "..."},
      "rights_lane": "product_cleared",
      "review_status": "active",
      "support_or_conflict": "supports",
      "score": {
        "lexical": 0.0, "semantic": 0.0,
        "scope_fit": 1.0, "review": 1.0
      }
    }
  ],
  "coverage": {
    "required": ["..."],
    "present": ["..."],
    "missing": [],
    "sufficient": true
  },
  "conflicts": [{"type": "tradition_applicability", "member_ids": ["..."]}],
  "excluded": [{"object_id": "...", "reason": "scope_mismatch"}]
}
```

### Bounded guidance decision record

```json
{
  "request_class": "personal_guidance",
  "risk_class": "R4_contextual_guidance",
  "material_context_present": ["goal", "family_role"],
  "material_context_missing": ["immediate_safety"],
  "clarification": {
    "ask": true,
    "field": "immediate_safety",
    "reason_code": "changes_escalation_and_action"
  },
  "evidence_used": ["assertion-id", "case-version-id"],
  "conflict_types": ["interpretive", "value_priority"],
  "affected_parties": [
    {"party": "user", "basis": "stated"},
    {"party": "other", "basis": "scenario_fact"}
  ],
  "candidate_actions": [
    {
      "action_code": "reversible_low_risk_step",
      "reversible": true,
      "key_tradeoff": "...",
      "evidence_level": "scenario_and_general_safety"
    }
  ],
  "material_disanalogy": "...",
  "uncertainty": {
    "source_conflict": true,
    "missing_context": true,
    "model_instability_checked": false
  },
  "stop_condition": "clarify_before_specific_recommendation",
  "response_strategy": "conditional_options_then_clarify",
  "short_reason_code": "one_missing_fact_changes_safe_next_step"
}
```

## 7. Retrieval planner

### Planner sequence

1. **Classify request and risk** with multi-label output and confidence/unknown.
2. **Extract only explicit context** and record its source. Never infer sensitive identity from demographic cues.
3. **Estimate clarification value:** enumerate plausible field values; ask only if at least two values change evidence, applicability, safety, or action enough to matter.
4. **Declare required object types** before retrieval.
5. **Filter by rights, sensitivity, review, scope, and deterministic applicability.**
6. **Retrieve broadly but typed:** lexical + semantic + metadata; expand along reviewed support/conflict/interpretation/case links only as route needs.
7. **Rerank** by relevance, scope fit, evidence quality, review, diversity/variant coverage, and contradiction usefulness. Do not use prestige as truth probability.
8. **Build the smallest sufficient evidence set**; avoid long-context dumping.
9. **Diagnose coverage and conflict.** If required types are missing, clarify, answer conditionally, refuse, or escalate.
10. **Deliberate only when route warrants it, validate claims, and render concisely.**

### Retrieval decision table

| User need | Primary targets | Required adjacent evidence | Clarify when | Normal response mode | Graceful failure |
|---|---|---|---|---|---|
| Exact fact/quote | source span + assertion | edition/witness, translation, provenance | wording/edition materially changes answer | exact | quote narrowly; state edition/coverage gap |
| Panchāṅga/date | deterministic tool output | location, tradition rule, calculation version, source explanation | location/tradition/timezone changes output | exact/conditional | never guess; request location or state inability |
| Ritual vidhi | procedure | applicability, deterministic timing, ordered steps, materials/substitutions, variants, evidence | tradition/place/role/date/strictness/material changes action | conditional/plural | common safe core only if evidenced; name missing authority |
| Festival context | source/narrative/entity | historical context, source-labelled stories, variants, living-practice account if cleared | devotional/historical/comparative frame changes selection | exact/plural | present labelled versions; do not harmonize |
| Story exploration | narrative span/variant | characters, chronology, commentary, cross-links | user asks for one tradition/retelling | exact/plural | disclose version and missing corpus lanes |
| Personal guidance | claims + scoped cases/patterns if promoted | constraints, affected parties, countercase, safety/current expertise | missing fact can reverse a consequential recommendation | conditional/clarify | offer reversible low-risk option and boundaries |
| Moral ambiguity | multiple cases and competing assertions | interpretations, disanalogies, values, consequences, counterexamples | stakes/power/safety/relationship fact changes advice | plural/conditional | preserve conflict; state what cannot be grounded |
| Comparison | standpoint-qualified assertions | symmetric sources/interpretations for each side | terms are non-equivalent or criteria are unstated | plural/exact | explain non-equivalence; do not prestige-rank |
| Reflection | source passages + cases | multiple lineages, explicit user values, non-fatalism/safety | crisis, authority request, or decisive context missing | conditional | companionable prompt/next step; escalate when needed |

## 8. Deliberation without hidden chain of thought

The runtime may compare interpretations and actions, but the inspectable artifact is a typed decision summary. It should cover only what can be externally checked:

- competing interpretations and their evidence/scope;
- stated/evidenced/unknown affected perspectives;
- analogy dimensions and decisive disanalogy;
- self, others, vulnerable parties, community, and institutional interests where material;
- immediate/longer-term, reversible/irreversible consequences with evidence level;
- factual, interpretive, applicability, value-priority, and missing-context uncertainty;
- clear stop/clarify/escalate conditions;
- no more than three feasible actions;
- selected response mode and one short rationale.

Do not store free-form scratch reasoning. Do not cite self-debate as evidence. A new reasoning pass is useful only when it obtains new evidence, invokes a deterministic validator/tool, or uses genuinely independent review.

### Response contracts

- **Exact:** answer first, exact source identity/citation, scoped caveat only if material.
- **Conditional:** “If X, do A; if Y, do B,” with the one missing fact that selects the branch.
- **Plural:** attributed alternatives and the practical difference between them; no synthetic consensus.
- **Clarify:** one high-value question plus a useful conditional core where safe.
- **Unable to ground:** say which evidence type is absent and what would resolve it; do not fill with generic wisdom.
- **Escalate:** preserve user agency and give the appropriate immediate resource/qualified-human boundary.

Sārthi is concise and natural by default. Attribution is included when it changes the answer, prevents false authority, or the user asks for it.

## 9. Offline versus inference-time work

| Offline/reviewed | Inference time |
|---|---|
| source acquisition, fixity, provenance, rights | request/risk classification |
| parsing and translation with exact spans | material-context extraction and clarification value |
| atomic assertions and evidence relations | deterministic Panchāṅga/tool calls |
| procedures and applicability | typed retrieval/reranking and coverage |
| interpretation attribution and conflict groups | user-specific applicable variants |
| reviewed pattern/case versions and counterexamples | bounded affected-party/action/consequence comparison |
| contradiction, omission, rights, and coverage audits | concise response and citations |

### Never promote automatically

- model-generated translation as source original;
- a runtime answer as a reviewed assertion;
- a generated case, perspective, pattern, or counterexample as living/community evidence;
- a retrieved majority practice as normative authority;
- a catalogued lead as possessed content or product clearance.

## 10. Knowledge acquisition priorities

### For the first pilot

Choose one bounded rights-cleared ritual/festival vertical. Provisional preference is a Navarātri home-practice slice only if it has deterministic timing, complete ritual-contract coverage, at least two genuine variants/lineages, source/procedure evidence, and competent reviewers. Otherwise select the best-evidenced Ganesha or Dīpāvalī slice.

Acquire/prepare:

- exact source/edition/translation identities and rights;
- complete procedure and applicability, not a date/remembrance card;
- multiple interpretations/variants where genuinely present;
- source-labelled meaning and stories;
- counterevidence and known limits;
- a 30-family evaluation packet before building a large ontology.

### Later

- linked commentarial verticals with root text, multiple commentaries, vernacular/performance reception, and scholarship;
- small reviewed Mahābhārata/Rāmāyaṇa case corpora with original loci, multiple translations/readings, social/power counterreadings, and anti-precedents;
- modern safety/legal/medical evidence appropriate to high-stakes boundaries;
- multilingual evidence and expert-authored scenarios;
- living-practice records only through a separately authorized, consent-governed programme.

Living practice records must distinguish observation, participant report, normative claim, and hearsay; community/role/date/place/occasion; consent scope; sensitivity; rights; variation; authority claim; and review/withdrawal terms. Public visibility is not consent or product clearance.

## 11. Evaluation suite

### Dataset

Build 160 held-out base scenario families:

- 20 exact fact/retrieval;
- 30 ritual vidhi/observance;
- 20 festival/story context;
- 30 personal guidance;
- 30 moral ambiguity;
- 15 comparison;
- 15 reflection.

Each family receives 4–6 controlled variants: material-context flip, irrelevant perturbation, narrator/opinion flip, evidence conflict/ablation, Hindi/English pair, analogy lure, outcome reveal, clarification pair, warmth trap, or authority trap as applicable. Hold out whole families.

### Arms

- **A0:** strong grounded RAG.
- **A1:** A0 + material-context/clarification gate.
- **A2:** A1 + typed evidence/conflict/coverage.
- **A3:** A2 + bounded decision record for eligible routes.
- **A4:** A3 + separately ablated reviewed cases and patterns.

Same model, evidence bytes, safety policy, output length, and primary retrieval budget. Run a second operational comparison if structure adds curated evidence.

### Hard failures

Any of the following fails a response independently of average quality:

- unsupported material claim or quotation;
- unsafe/inapplicable ritual procedure;
- fabricated authority/source/consensus/lived experience;
- fatalism, karma-blame, caste/gender/disability/purity blame, or agency removal;
- sycophantic harm;
- material tradition flattening;
- medical/legal/mental-health/safeguarding/emergency boundary breach;
- unnecessary sensitive context;
- rights/sensitivity leak;
- model synthesis represented as source/reviewed knowledge.

### Capability vector

Score 0–4, with `not_applicable`, for:

1. grounding/source fidelity;
2. procedural correctness/applicability;
3. context/problem framing;
4. perspectives/affected interests;
5. conflict/value/trade-off legibility;
6. consequences/time horizon/reversibility;
7. calibration/revisability;
8. analogy/disanalogy;
9. compassion with candor/anti-sycophancy;
10. actionability/proportion;
11. tradition fidelity/non-flattening;
12. concise companion voice.

Do not publish a pooled wisdom score.

### Review

Use blind, randomized, length-normalized comparisons with independently recorded ratings. Reviewer functions include source/tradition, exact ritual lane, safety/product, target language, user clarity, and affected/dissenting perspective when material. Store reviewer scope; no one represents all Hindu traditions. Report ordinal Krippendorff alpha and preserve factual, interpretive, rubric, scope, and value disagreements.

LLM judges can pre-screen and propose failure hypotheses; they are not acceptance authorities.

### Promotion thresholds

| Layer | Initial threshold versus simpler arm |
|---|---|
| A1 context gate | ≥10-point reduction in applicability/context errors; ≥25% fewer unnecessary questions |
| A2 typed evidence/conflict | ≥10-point reduction in source/commentator confusion or false harmonization; conflict recall ≥0.90, precision ≥0.85 |
| A3 decision record | ≥8-point reduction in predefined guidance failures; p95 latency ≤2× A2 |
| Cases | ≥0.30 improvement on 0–4 analogy/disanalogy; ≥15% less generic/one-story guidance; no harmful analogy increase |
| Patterns | ≥0.30 improvement on 0–4 judgment/actionability; no grounding/flattening regression |
| Router optimization | ≥20% token/latency reduction at equal quality |
| Graph/native graph | ≥10-point gain on a defined global-relational benchmark after SQL/hybrid baseline |

All require no severe-failure increase and no regression in exact retrieval or ritual correctness. Freeze thresholds after a 30-family rubric pilot and before held-out evaluation.

## 12. Local experiments completed

One dependency-free synthetic fixture probe was run on 2026-08-07. It tested representation, not Sārthi or an LLM:

| Probe | Baseline | Typed/structured | Observation |
|---|---:|---:|---|
| Scope retrieval, top-1 | 5/6 (0.8333) | 6/6 (1.0000) | unfiltered baseline chose a Smarta record for an ISKCON request |
| Required-type coverage | 0.875 mean | 1.000 mean | route declaration covered the encoded evidence types |
| Analogy retrieval | lexical ranked wrong case first | structural score 13.0 vs 2.5 | relations/disanalogies beat surface overlap in constructed fixtures |
| Clarification | n/a | route-changing fields found | region/tradition/sampradāya/location changed routes; style fields did not |

Limitations: tiny author-constructed fixtures; no human blind review; no real embeddings/model; no efficacy, culture, latency, or cost inference. Full record: [RESULTS_2026-08-07.md](experiments/RESULTS_2026-08-07.md).

## 13. Rejected and deferred alternatives

| Alternative | Decision | Why |
|---|---|---|
| Universal artificial/Indic wisdom ontology | Rejected | unfalsifiable, homogenizing, unnecessary |
| Scalar wisdom score | Rejected | false precision; severe failures can hide in an average |
| Automatic dharma or Mīmāṃsā resolver | Rejected | unjustified domain and authority transfer |
| Seven-valued syādvāda truth engine | Rejected for MVP | contested historical formalization; no measured product benefit |
| Prestige/authority score for gurus, texts, institutions | Rejected | competence is topic-specific and defeasible |
| Automatic commentary harmonization | Rejected | creates synthetic consensus |
| Web-scraped living practice as truth | Rejected | no consent, representativeness, normativity, or rights guarantee |
| Epic nearest-neighbour adviser | Rejected | surface similarity, cherry-picking, and sacred precedent laundering |
| Stored/exposed hidden chain of thought | Rejected | unreliable as explanation, sensitive, and misleading provenance |
| Same-model debate as default | Rejected | correlated errors and persuasive rationalization |
| Personal moral causal forecasting | Rejected | no identified causal model/reference class |
| Cognitive architecture / end-to-end neuro-symbolic system | Rejected for MVP | complexity without an identified winning task |
| Native graph database | Deferred | Postgres-first is adequate until benchmark/SLO evidence |
| Large pattern library | Deferred | high synthesis/editorial debt; same-evidence gain unproven |
| Thick cases | Small pilot | plausible benefit, but analogy harm and cost must be measured |
| Strong grounded RAG | Retained baseline | it may remain best for many slices |

## 14. Indic and cultural safeguards

- Treat Nyāya, Mīmāṃsā, Jain, Buddhist, Dharmaśāstra, epic, commentarial, vernacular, and living traditions as situated and internally diverse.
- Classical warrant labels apply only with tradition-qualified definitions; a warrant does not guarantee truth.
- Mīmāṃsā relations are interpreter-attributed and ritual/text-domain scoped; no universal priority engine.
- Anekāntavāda is not “all views are equally valid”; evidence and harm controls stay independent.
- Buddhist two truths never convert an empirical error into an unfalsifiable claim.
- A narrative is a thick case, not binding precedent or divine authorization for the user's act.
- Root text, commentary, translation, scholarship, living practice, and Devam synthesis never collapse into “the text says.”
- Do not classify Jain, Buddhist, Sikh, tribal, Dalit, regional, or other materials under a generic Hindu category against source self-identification.
- Audit collection/reviewer coverage by language, region, lineage, genre, medium, social location, and dissent. Missing lanes remain visible.
- Historical or common practice can be harmful or exclusionary; prevalence is not ethical correctness.

## 15. Integration plan for the main MVP task

### Immediate sequence

1. **Select one bounded pilot vertical** by evidence completeness, rights, real variation, deterministic requirements, and reviewer availability.
2. **Create 30 scenario families and gold packets** before adding architecture.
3. **Freeze A0** with hybrid retrieval, metadata filters, reranking, deterministic tools, citation checks, concise policy, and telemetry.
4. **Run A0 and classify failures.** Do not solve non-existent failures.
5. **Add A1** request envelope and clarification-value logic.
6. **Add A2** compact typed manifests/tables for attribution, scope, conflicts, and coverage.
7. **Compare A0/A1/A2 under same evidence.** Remove fields/features that do not contribute.
8. **Add A3 behind route flags** for guidance/ambiguity only; validate record fields and privacy retention.
9. **Red-team and compare A2/A3** with equal output length and evidence.
10. **Pilot A4** with 12–20 cases and at most 6–10 patterns only if A3 leaves measurable analogy/action gaps.
11. **Scale evaluation to 160 families**, languages, and hero lanes before scaling ontology.
12. **Promote route by route.** Exact facts may use A0; variant-rich ritual may use A2; guidance may use A3; A4 may never be needed.

### Concrete work packages

- versioned request/risk/context envelope;
- typed retrieval envelope with score components and exclusion reasons;
- route-specific coverage contracts;
- deterministic Panchāṅga integration and provenance;
- conflict-preserving response modes;
- bounded decision record and retention policy;
- concise renderer with progressive citations/alternatives;
- family-aware evaluation harness and review workflow;
- correction/rights invalidation propagation;
- feature flags and simple-arm rollback per route.

### Cheapest sufficient model/effort for the next step

For evidence-packet construction, schema implementation, and test-harness work, a strong balanced coding/reasoning model at **high** effort is sufficient; use **xhigh** for rubric adjudication design, cross-tradition synthesis, and final adversarial acceptance. Cheaper/lower-effort settings create material risk mainly in omitted scope, false conflict resolution, and superficial evaluation—not routine mechanical schema/test work. Because model offerings drift, record and revalidate the actual dated model at execution time.

## 16. Evidence base

The core [Evidence register](EVIDENCE_REGISTER.md) contains 63 decision entries; the three workstream annexes contain 130 domain entries in total before overlap. Selected anchors:

- Baltes & Staudinger, wisdom performance criteria, [DOI](https://doi.org/10.1037/0003-066X.55.1.122).
- Grossmann, contextual wisdom, [DOI](https://doi.org/10.1177/1745691616672066).
- Dong et al., wisdom meta-analysis, [DOI](https://doi.org/10.1177/17456916221114096).
- Leary et al., intellectual humility, [DOI](https://doi.org/10.1177/0146167217697695).
- Lewis et al., retrieval-augmented generation, [NeurIPS](https://papers.nips.cc/paper/2020/hash/6b493230205f780e1bc26945df7481e5-Abstract.html).
- Liu et al., lost-in-the-middle limits, [DOI](https://doi.org/10.1162/tacl_a_00638).
- Oh et al., insufficient-evidence RAG behaviour, [DOI](https://doi.org/10.18653/v1/2024.findings-emnlp.730).
- Aamodt & Plaza, case-based reasoning, [DOI](https://doi.org/10.3233/AIC-1994-7104).
- Gentner, structure mapping, [DOI](https://doi.org/10.1207/s15516709cog0702_3).
- Dung, abstract argumentation, [DOI](https://doi.org/10.1016/0004-3702(94)00041-X).
- W3C, [PROV-O Recommendation](https://www.w3.org/TR/prov-o/).
- Stanford Encyclopedia, [Classical Indian epistemology](https://plato.stanford.edu/archives/fall2022/entries/epistemology-india/).
- Freschi & Pascucci, Mīmāṃsā deontic conflict, [DOI](https://doi.org/10.1111/theo.12307).
- Stanford Encyclopedia, [Jaina philosophy](https://plato.stanford.edu/archives/sum2024/entries/jaina-philosophy/).
- Black, subtle dharma cases, [DOI](https://doi.org/10.1007/s11407-022-09313-2).
- Davis, ācāra and authority, [DOI](https://doi.org/10.1007/s10781-004-8651-4).
- UNESCO, [Ethics and intangible cultural heritage](https://ich.unesco.org/en/ethics-and-ich-00866).
- Huang et al., intrinsic self-correction limits, [ICLR](https://proceedings.iclr.cc/paper_files/paper/2024/file/8b4add8b0aa8749d80a34ca5d941c355-Paper-Conference.pdf).
- Sharma et al., sycophancy, [ICLR](https://proceedings.iclr.cc/paper_files/paper/2024/hash/0105f7972202c1d4fb817da9f21a9663-Abstract-Conference.html).
- Kuhn et al., semantic entropy, [DOI](https://doi.org/10.1038/s41586-024-07421-0).
- Shen et al., cultural commonsense limitations, [DOI](https://doi.org/10.18653/v1/2024.naacl-long.316).
- Khandelwal et al., language variation in moral-reasoning benchmarks, [DOI](https://doi.org/10.18653/v1/2024.eacl-long.176).
- Zheng et al., LLM-judge bias, [NeurIPS](https://proceedings.neurips.cc/paper_files/paper/2023/file/91f18a1287b398d378ef22505bf41832-Paper-Conference.pdf).

## 17. Confidence and open questions

### High confidence

- Sārthi must not claim wisdom, guru/divine authority, lived compassion, or stable metacognition.
- Source, interpretation, synthesis, scope, rights, and conflict must remain inspectably separate.
- Ritual answers require the full ritual/observance product contract and deterministic timing.
- Same-evidence strong grounded RAG is the correct burden-of-proof baseline.
- A universal Indic ontology, automatic dharma resolver, scalar wisdom score, prestige authority score, scraped living-practice truth, and hidden-CoT provenance are indefensible.

### Moderate confidence

- Material-context, clarification-value, required-type coverage, and conflict typing will reduce identifiable applicability/flattening failures.
- A bounded decision record can improve inspectability and guidance if it is validated rather than used as rhetoric.
- Small structurally represented cases can improve analogy when disanalogies and power are first-class.

### Low or unknown

- Whether a stored pattern layer beats same-evidence RAG.
- Reviewer reliability across traditions and languages.
- The size of any real-world gain, latency/cost trade-off, and user comprehension effect.
- Longitudinal user benefit, correction uptake, dependency risk, or regret.
- Whether future model improvements reduce or increase the value of these scaffolds; this must be re-tested, not predicted.

### Blocking questions before implementation/promotion

1. Which pilot vertical is complete and product-cleared?
2. Which exact reviewers cover its source, procedure, lineages, languages, safety, and affected perspectives?
3. What current model/version, token budget, cost ceiling, and p95 latency envelope are acceptable?
4. Which trace fields may be retained, for how long, under the product privacy policy?
5. What hard-failure tolerance applies by route and risk class?
6. Can the test use existing cleared evidence, or is evidence completion—not architecture—the true blocker?

## 18. Handoff state

No application code, authoritative product document, source vault, Supabase resource, external service, or Git state was intentionally modified by this programme. All research artifacts are confined to `research/sarthi-artificial-wisdom/`.

The recommendation is ready for the main MVP task to use as a **testable integration specification**. It is not a release certificate. The correct next action is to select the evidence-complete pilot vertical and instantiate the 30-family A0–A2 comparison before building cases, patterns, graphs, or a branded wisdom layer.
