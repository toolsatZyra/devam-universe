# Reasoning architectures evidence memo

**Programme:** Sārthi Practical Artificial Wisdom  
**Workstream:** middle-layer reasoning, retrieval planning, contradiction, provenance, and uncertainty  
**Evidence cut-off:** 2026-08-07  
**Status:** research recommendation; not an implementation authority  
**Scope:** architecture research only. No application, database, source-vault, external-service, or Git mutation was performed.

## Executive decision

The fastest defensible architecture is **strong, scoped, hybrid grounded RAG plus a small typed middle layer in Postgres**. That middle layer should not be a second, AI-generated “truth database.” It should make distinctions that passage retrieval alone cannot reliably enforce:

1. a proposition is not the same as a particular source or curator asserting it;
2. support, challenge, qualification, derivation, and mere topical similarity are different relations;
3. ritual and guidance applicability is conditioned by geography, tradition, institution, household, time, and user intent;
4. a case is useful only through explicit structural similarities and important disanalogies;
5. a reviewed wisdom pattern is a scoped, versioned Devam synthesis, not a source claim; and
6. uncertainty is an evidence and decision state, not a model's self-reported confidence.

For the MVP, this means:

- keep Postgres full-text, pgvector, metadata filtering, reciprocal-rank fusion or reranking, exact source coordinates, and cited generation as the baseline;
- add relational claim/assertion/evidence/conflict edges, not a native graph database;
- add only a narrow case and reviewed-pattern schema for the first wisdom vertical;
- use deterministic rules only for domains that really are rule-governed: Panchang, observance applicability, rights, safety, evidence publication, and retrieval eligibility;
- use a bounded query router that chooses exact, procedure, comparison, conflict, case/pattern, or graceful-failure lanes;
- retrieve competing scoped claims when conflict is possible, then produce a short result plus an inspectable decision summary—not hidden or persisted chain-of-thought; and
- defer full argumentation engines, causal inference, general temporal logic, GraphRAG community summaries, cognitive architectures, and end-to-end neuro-symbolic training until a controlled comparison shows material improvement over the strong RAG baseline.

The core architectural bet is **typed retrieval and inspected synthesis**, not “reasoning by graph database.” A graph is a useful logical view over relational records; it is not evidence that a separate graph store or formal reasoner improves Sārthi.

## What counts as the baseline

Every candidate layer must be compared against the following strong baseline, not against naïve vector search:

1. query normalization without generating new knowledge;
2. mandatory filters for publication status, rights lane, language, geography, tradition, institution, time, and answer type;
3. Postgres full-text plus dense retrieval, fused with RRF or reranked;
4. retrieval of source passages and compact reviewed dossiers/procedures;
5. answer generation constrained to the retrieved evidence;
6. claim-level citation checking and unsupported-assertion detection;
7. an explicit `insufficient`, `conflicting`, or `not_applicable` answer mode; and
8. scenario evaluation of end-user quality, not only retrieval similarity.

This is a demanding baseline. Lewis et al. established the value of non-parametric retrieval for knowledge-intensive generation, while BEIR showed that BM25 is a robust baseline and that no retrieval family dominates every heterogeneous task. PostgreSQL and pgvector already support the required full-text, vector, filter, fusion, and reranking primitives. Therefore, a new reasoning layer must show conditional lift on Sārthi's own queries, not merely cite a benchmark where the baseline was weaker.

## Evidence labels used here

- **Established:** mature formal result, standard, replicated empirical pattern, or peer-reviewed result directly supporting the narrow claim made.
- **Promising:** peer-reviewed or strong primary evidence with limited domains, models, tasks, or external validity.
- **Convention:** useful engineering practice or standard representation whose product benefit still requires local evaluation.
- **Inference:** this workstream's design judgment from the evidence and Devam's contracts. It must be tested.

## Architecture matrix

| Candidate layer | Distinct job beyond strong RAG | Evidence status | MVP posture | Main failure risk | Testable prediction |
|---|---|---|---|---|---|
| Hybrid passage retrieval | Finds exact wording and semantically related evidence | Established | **Adopt baseline** | Retrieval noise, missed scope, approximate-index recall loss | Hybrid filtered retrieval beats either lexical-only or dense-only on Sārthi evidence recall without unacceptable latency |
| Claim/assertion graph | Keeps proposition, assertion, source, scope, and evidence polarity separate | Established representation; local product lift unproven | **Adopt minimal relational form** | LLM extraction errors become false structure; ontology growth | Improves scoped conflict/applicability recall by at least 10 percentage points over baseline while preserving source traceability |
| General semantic ontology / OWL reasoner | Formal class/property entailment and interoperability | Established formalism | **Defer** except small controlled vocabularies | Open-world/entailment surprises, modelling burden, false universality | Add only if recurring queries require entailments that SQL edges/rules cannot answer correctly or cheaply |
| Argument graph | Represents premises, conclusions, support, attack, qualification, and preferences | Established formalism; limited product evidence | **Store light relations; no MVP solver** | Treats plural traditions as a debate with one winner; preference rules encode curator bias | Formal solver must beat parallel scoped retrieval on conflict handling and human appropriateness by a predeclared margin |
| Case-based reasoning | Retrieves contextualized experience and adapts prior solutions | Established paradigm | **Adopt narrow case library; no autonomous adaptation** | Surface analogy, omitted disanalogy, scriptural case universalized | Explicit dimensions plus disanalogy improve analogy-quality judgments without reducing relevance or tradition fidelity |
| Structure-mapped analogy | Compares relational structure rather than shared words | Established cognitive theory and computational models | **Use as schema/evaluation principle** | Hand-authored dimensions are costly; machine mappings can be spurious | Two-stage semantic candidate retrieval plus structural reranking selects expert-approved analogies more often than embeddings alone |
| Pattern library | Reuses reviewed, evidence-linked lessons across cases | Devam design inference, consistent with case/claim research | **Adopt only for first vertical** | Synthetic aphorisms, cultural flattening, stale synthesis | Pattern retrieval adds judgment/actionability lift over case+claim RAG and survives counterexample tests |
| Deterministic rules | Applies calendar, scope, rights, safety, and eligibility constraints | Established | **Adopt narrowly** | Rule explosion and hidden normative choices | Rule fixtures achieve exact expected routing and never invent a moral conclusion from a scope rule |
| Defeasible rule system | Allows exceptions, priorities, and non-monotonic conclusions | Established formalism | **Defer** | Priority ordering silently chooses a theology/value system | Add only if reviewed rule conflicts recur and a solver improves decisions over explicit variant presentation |
| Temporal interval model | Represents before/after/overlap/during and validity intervals | Established | **Adopt minimal timestamps/intervals; defer general solver** | Confuses textual sequence, historical dating, ritual windows, and causal order | Typed intervals reduce temporal-answer errors on a dedicated suite; general relation closure must be needed by real queries |
| Causal model | Supports intervention/counterfactual reasoning under stated assumptions | Established in statistical causal inference | **Reject for general MVP guidance** | Narratives or associations are promoted to causal laws; assumptions are untestable | Permit only in bounded domains with independently reviewed causal assumptions and measurable outcome data |
| GraphRAG communities | Answers corpus-wide theme/sensemaking questions using generated graph summaries | Promising, task-dependent | **Defer** | Expensive/stale LLM extraction and summaries; provenance compression | Must materially improve global-query completeness and diversity while preserving claim support and refreshability |
| Graph traversal / PageRank retrieval | Connects multi-hop entity/claim neighborhoods | Promising for multi-hop QA | **Prototype only after graph data exists** | Popular hubs dominate; noisy edges amplify; benchmark mismatch | Must beat iterative hybrid retrieval on Sārthi multi-hop cases at lower or acceptable total cost |
| Adaptive retrieval planner | Selects no-, single-, or multi-step retrieval by query/evidence complexity | Promising | **Adopt simple rules first; learned router later** | Misrouting is silent; learned classifier shifts by model/domain | Equal-or-better quality with at least 20% lower mean retrieval/model cost and no material rise in high-risk failures |
| Iterative active retrieval | Retrieves again when evidence is incomplete | Promising | **Bounded fallback** | Query drift, cost, hidden loops | Improves answerable multi-hop recall with a hard hop budget and no increase in unsupported assertions |
| Conflict deliberation | Generates competing hypotheses and adjudicates against evidence | Promising, including ACL 2026 DoT | **Optional bounded mode after conflict detection** | Self-debate creates persuasive fiction or false consensus | Must improve conflict-type-appropriate answers over structured parallel evidence, not only raw accuracy |
| Model self-confidence / semantic entropy | Estimates when outputs may be wrong | Promising but task/model dependent | **Evaluation signal only** | Self-confidence is miscalibrated across tasks; sampling cost | Use only after calibration on held-out Sārthi scenarios; never as the sole publication or answer gate |
| Conformal answer back-off | Trades specificity for empirical coverage under calibration assumptions | Promising | **Longer-term experiment** | Guarantees are marginal and distribution-dependent; semantic correctness labels are difficult | Must maintain coverage on shifted tradition/language slices and produce useful rather than vacuous back-offs |
| ACT-R / Soar-style cognitive architecture | General production, memory, and goal architecture | Established as cognitive-modelling traditions | **Reject for product MVP** | Reimplements a general agent architecture without Sārthi evidence of lift | Reconsider only if a narrower architecture cannot support measured task needs and a prototype wins the same suite |
| End-to-end neuro-symbolic system | Trains neural predicates and symbolic/probabilistic reasoning jointly | Promising in bounded tasks | **Reject for MVP** | Training/data/semantics complexity; weak transfer evidence to cultural guidance | Reconsider only with labelled tasks where the symbolic constraints are stable and joint training beats modular retrieval+rules |

## Findings by architecture family

### 1. Claim and semantic graphs

Knowledge graphs are useful because they make identity, relations, context, schema, quality, and provenance queryable. Hogan et al.'s survey also makes clear that a “knowledge graph” spans multiple data models, query languages, schemas, and inductive/deductive methods; it does not imply a particular database product. **Established.**

The most relevant representational lesson for Devam is from claim/evidence modelling, not generic entity triples. The SEE approach distinguishes:

- the proposition or structured subject matter;
- a particular assertion of that proposition by an agent on an occasion;
- the linguistic report in which it appeared;
- other claims used as evidence; and
- provenance and curator interpretation.

This prevents two damaging collapses: “two sources express a similar proposition” does not mean they are the same assertion, and “Devam derived a synthesis from these claims” does not make the synthesis a source original. PROV-O supplies interoperable entity/activity/agent and derivation/quotation/revision concepts. **Established representation.**

**MVP inference:** implement this distinction relationally:

```text
proposition
  id, canonical_form, predicate_key, object_json, language_neutral_key?

assertion
  id, proposition_id, asserting_agent_id, report_or_source_id,
  asserted_at, extracted_by, extraction_method, review_status

assertion_scope
  assertion_id, geography, tradition, institution, household_setting,
  valid_time, historical_period, language, applicability_json

evidence_link
  from_assertion_or_passage_id, to_assertion_id,
  role = supports|challenges|qualifies|illustrates|derives,
  strength_basis, curator_id, reviewed_at

claim_relation
  left_assertion_id, right_assertion_id,
  type = contradicts|scope_differs|variant_of|supersedes|compatible_if|unresolved_with,
  rationale_summary, review_status
```

Do not require universal language-neutral proposition identity in the first vertical. Some Sanskrit, regional, theological, or hermeneutic concepts will not survive premature normalization. Permit multiple proposition records linked by `possible_equivalent`, `translation_of`, `narrower_than`, or `interpretive_rendering_of`, with review status.

**Rejection condition:** reject automatic claim extraction from becoming publishable structure if human adjudication finds more than 2% material scope/polarity errors or if graph-routed answers cite a claim without the source passage that supports it. Extracted nodes may remain review candidates.

### 2. Argument graphs and contradiction handling

Dung's abstract argumentation formalizes attacks between arguments and acceptability semantics. ASPIC+ adds premises, strict and defeasible rules, attacks on premises/inferences/conclusions, and explicit preferences. AIF provides an interchange model for argument data. These are valuable when the product truly needs formal acceptance under explicit rule and preference semantics. **Established formalisms.**

They are not automatically appropriate for plural religious traditions. A Bengali Shakta practice and a North Indian Smarta practice may differ without either attacking the other. A commentary may offer a competing interpretation that should remain visible, not be “defeated.” An argument engine also requires preferences; encoding source, school, period, or reviewer priority as a universal ordering would be a substantive theological/editorial decision.

RAG systems themselves are brittle under conflict. Park and Lee found failures to identify unanswerable, adversarial, and conflicting document sets. Cattan et al. argue that conflict types require different desired behaviours. ACL 2026 Debate-of-Thoughts reports gains from generating competing hypotheses, criticism, and adjudication on conflict benchmarks, but this is evidence for a bounded inference technique—not for storing the generated debate as truth or exposing/persisting hidden reasoning. **Promising.**

**MVP inference:** use an explicit conflict taxonomy before any deliberation:

| Conflict type | Example | Required behaviour |
|---|---|---|
| Scope difference | two regions prescribe different practice | select by context; present the other only if material |
| Temporal update | current institutional schedule differs from older page | prefer valid current official record for live operations; preserve history |
| Source disagreement | two textual witnesses differ | report variants and provenance; do not average |
| Interpretive plurality | commentaries derive different meanings | attribute each reading; do not force a single winner |
| Identity ambiguity | same/similar observance name maps to distinct lanes | clarify or return separate candidates |
| Evidence-quality conflict | practitioner page contradicts primary/official evidence | apply lane-specific source-role policy and explain the unresolved remainder |
| Parametric-versus-retrieved conflict | model “remembers” something else | retrieved, reviewed Devam evidence controls; model memory is not evidence |
| Internal evidence contradiction | retrieved packet contains mutually exclusive same-scope claims | retrieve full conflict bundle and answer `conflicting` unless a reviewed adjudication exists |

Store only reviewed support/challenge/qualify and conflict edges. At inference, the model may construct two or more candidate readings, but persistence should contain selected evidence IDs, the answer mode, a short decision summary, and unresolved questions—not the private scratchpad.

**Rejection condition:** do not add an argument solver if a simpler parallel-evidence template matches or beats it on (a) conflict recognition, (b) non-flattening of traditions, (c) appropriateness, and (d) latency/cost. Reject any solver configuration that converts “scope differs” into “one side defeated.”

### 3. Cases and analogies

Case-based reasoning's classic cycle retrieves a prior case, reuses/adapts it, tests/revises the proposed solution, and retains learning. Its strength is contextualized experience; its central problems are representation, indexing, similarity, adaptation, validation, and case-base maintenance. **Established paradigm.**

Gentner's structure-mapping theory distinguishes relational structure from shared object attributes. MAC/FAC supplies a practical architectural lesson: use a cheap broad first stage, then a costly structural matcher on a small candidate set. **Established cognitive/computational evidence, but not validated for Sārthi guidance.**

**MVP inference:** represent each reviewed case with explicit dimensions:

```text
case
  dilemma, actors, relationships, duties_or_commitments, constraints,
  values_in_tension, power_asymmetries, affected_parties,
  actions, immediate_consequences, longer_term_consequences,
  interpretations, unresolved_questions, source_scope

case_comparison
  target_case_id, candidate_case_id,
  relevant_similarities[], material_disanalogies[],
  prohibited_transfer[], reviewer, version
```

Retrieve in two stages:

1. hybrid text/embedding retrieval plus hard scope and answer-type filters;
2. structured reranking on relations, constraints, affected parties, value tensions, reversibility, and timescale.

Sārthi may say, “This resembles case X in A and B, but differs in C, so the story does not settle your choice.” It must not say, “Character X did this, therefore you should too.”

**Rejection condition:** turn off case retrieval for a scenario class if experts judge more than 10% of surfaced analogies as misleading after seeing the stated disanalogies, or if cases increase moral-authority/preachiness failures relative to strong RAG.

### 4. Rules, temporal models, and causal models

Rules are valuable where Devam has genuine deterministic or reviewed constraints. OWL 2 RL demonstrates that expressive power can be restricted for scalable rule-based reasoning, while SHACL demonstrates validation of graph shapes. These standards do not require Devam to use RDF; they support the broader principle that constrained rule profiles and explicit validation are safer than an unrestricted universal reasoner. **Established.**

Use rules for:

- deterministic Panchang and observance resolution;
- rights/publication eligibility;
- context/applicability filtering;
- procedure preconditions and safety boundaries;
- required evidence fields and schema validation; and
- route eligibility and stop conditions.

Do not use general rules to derive moral duties or theological conclusions in the MVP. Those conclusions are frequently defeasible, perspective-dependent, and tradition-scoped. They belong in attributed claims, cases, and reviewed patterns.

Allen's interval algebra is a mature representation of temporal relationships. Devam needs only a subset initially: validity intervals, occurrence intervals, source/report dates, historical periods, and relations such as before/overlaps/during. Do not infer causation from temporal order. **Established representation; product lift unproven.**

Pearl's causal diagrams and do-calculus support causal effect identification only under explicit assumptions and appropriate observational/interventional structure. Narrative sequence, scriptural interpretation, or a living-practice report does not supply those assumptions. **Established limitation by formal precondition.**

**MVP inference:** store causal language as attributed claim types such as `causal_claim`, `consequence_claim`, `teleological_interpretation`, or `narrative_sequence`. Only a separately reviewed quantitative/empirical domain may carry a causal model. Personal guidance can consider plausible consequences without claiming statistical causal identification.

**Rejection condition:** reject any generated edge labelled `causes` when its evidence is only co-occurrence, temporal succession, a single narrative, or an unattributed synthesis. Downgrade it to the source's own attributed wording.

### 5. GraphRAG and graph-based retrieval

Microsoft's GraphRAG work targets global corpus questions by extracting an entity graph, clustering it, pregenerating community summaries, and using map-reduce answer generation. Its original evidence is strongest for global sensemaking over million-token corpora, not exact passage retrieval, ritual instructions, or culturally scoped personal guidance. **Promising preprint/official implementation.**

HippoRAG combines an LLM-built graph with Personalized PageRank and reported strong multi-hop QA gains at lower inference cost than iterative retrieval on its tested benchmarks. **Promising peer-reviewed result.**

A 2025 systematic RAG-versus-GraphRAG preprint reports complementary strengths: RAG performed better on single-hop/detail questions, while GraphRAG did better on multi-hop questions; it also documents task- and evaluation-dependent summarization results and reliance on LLM graph construction. **Promising, not settled.**

For Devam, the cost and epistemic risks are unusually important:

- the corpus is multilingual and tradition-scoped;
- relation extraction may flatten or mistranslate concepts;
- a community summary is another derived artifact needing version, provenance, contradiction checks, and refresh;
- a global graph can amplify hubs and dominant traditions; and
- exact source identity must remain available after traversal.

**MVP inference:** do not build a generic LLM-extracted GraphRAG index. The relational claim/case/pattern graph can later support targeted neighborhood retrieval without a second store. Prototype graph traversal only on reviewed edges, and prototype community summaries only for explicitly global questions such as “What themes recur across this bounded reviewed dossier?”

**Acceptance gate:** GraphRAG must show at least a 10-point gain in expert-rated global completeness or multi-hop answer correctness on a preregistered Devam suite, with no more than a 2-point decline in claim support/attribution, acceptable refresh cost, and a way to trace every material answer assertion back to reviewed claims/passages.

### 6. Cognitive and neuro-symbolic architectures

ACT-R and Soar are serious, long-running cognitive architectures. ACT-R models modules, buffers, declarative memory, and production selection; Soar proposes a general architecture for tasks, problem solving, representation, and learning. Their evidence concerns cognitive modelling and general architecture, not a demonstrated shortcut to culturally faithful, evidence-accountable companion guidance. **Established research traditions; no direct product evidence.**

Neuro-symbolic research shows that learning and logical/probabilistic reasoning can be integrated. DeepProbLog is a concrete example with neural predicates inside probabilistic logic programming and impressive bounded demonstrations. Reviews still frame general neural-symbolic integration as an open, heterogeneous research programme. **Promising for suitable tasks, not a default product architecture.**

Sārthi's immediate bottleneck is not low-level perception joined to a stable symbolic theory. It is acquiring reliable source and living-practice evidence, preserving scope and plural interpretation, retrieving it correctly, and evaluating judgment. A cognitive or end-to-end neuro-symbolic rewrite would add training, semantics, debugging, and maintenance burdens before the domain representation is stable.

**Rejection condition:** do not adopt either family because it “resembles human cognition” or promises general intelligence. Reconsider only after the narrow Postgres architecture reaches a measured ceiling on a stable labelled task that the proposed architecture directly addresses.

### 7. Uncertainty and calibration

Calibration means predicted confidence corresponds to empirical correctness frequency. Modern neural networks can be miscalibrated; temperature scaling can help in supervised settings. LLM self-evaluation has shown useful signals in some formats but poorer transfer to new tasks. Semantic entropy can detect some hallucinations by grouping semantically equivalent generations, and conformal methods can provide coverage under stated calibration/exchangeability assumptions. **Established concepts; promising LLM methods with important scope limits.**

Devam should not collapse distinct uncertainties:

```text
specification uncertainty
  missing location, tradition, family practice, referent, desired action level

retrieval uncertainty
  relevant evidence may not have been retrieved; approximate search/filter interaction

evidence uncertainty
  missing, weak, dependent, stale, or conflicting sources

scope uncertainty
  evidence exists but applicability to this user is unresolved

interpretive uncertainty
  legitimate competing readings remain

model uncertainty
  generator may not faithfully use the supplied evidence
```

Structured Uncertainty guided Clarification (ACL 2026) is especially relevant because it separates specification uncertainty from model uncertainty and uses expected value of information to decide which question to ask. Its evidence is from tool-parameter tasks, so applying the exact method to personal or ritual context is an inference that requires local testing. **Promising.**

**MVP inference:** compute an inspectable evidence-state vector, not a single confidence number:

```json
{
  "answerability": "sufficient|partial|conflicting|insufficient",
  "applicability": "resolved|material_context_missing|not_applicable",
  "source_roles_present": ["primary", "commentary", "living_practice"],
  "independent_support_count": 2,
  "conflict_types": ["interpretive_plurality"],
  "freshness_state": "current|stale|not_time_sensitive",
  "retrieval_coverage": "measured_recall_proxy_or_unknown",
  "unsupported_material_claims": 0,
  "clarification_candidate": "family_practice",
  "clarification_expected_decision_change": "high"
}
```

Map this state to answer modes with held-out scenario calibration. Model self-confidence or entropy may be logged as an experimental feature, but it may not override missing evidence, a known conflict, or an unresolved applicability gate.

## Recommended Postgres-first middle layer

### Records

Keep the existing source, passage, claim/evidence, entity, relationship, procedure, and Panchang planes. Add only for the first wisdom vertical:

- `propositions` when multiple attributable assertions need shared semantic identity;
- `assertions` or an equivalent extension if current claims do not already distinguish author/source assertion from Devam claim;
- `claim_relations` with typed, reviewed conflict/scope/variant edges;
- `cases` with a JSONB dimension document and normalized fields only for proven filters;
- `case_evidence` and `case_relations`;
- `wisdom_patterns`, `wisdom_pattern_evidence`, and `wisdom_pattern_relations` as already proposed in the Sārthi contract;
- `retrieval_evaluations` or the existing evaluation table for query, expected route, relevant record IDs, and observed failures; and
- versioned `routing_policy`/configuration outside model prompts.

Do not add RDF storage, an OWL reasoner, or a native graph service. Export mappings to PROV-O/RDF can be added later if interoperability becomes a real need.

### Retrieval planner

The initial planner should be explicit and auditable:

```text
classify intent and risk
  exact_fact | exact_passage | calendar | procedure | festival_context |
  story | compare | guidance | moral_ambiguity | reflection | global_synthesis

extract material context slots
  referent, date, location, language, tradition, institution,
  household/family practice, desired action level, affected parties, urgency

estimate clarification value
  ask only if a missing slot can change route, applicability, safety, or answer

select retrieval lanes
  passage, claim, procedure, calendar, entity/relation,
  case, pattern, counterexample, conflict bundle

retrieve and diagnose sufficiency
  mandatory filters -> hybrid candidates -> rerank -> typed expansion ->
  conflict check -> support/coverage check

bounded repair
  at most one query rewrite or one typed expansion for ordinary requests;
  a small fixed hop budget for multi-step questions

answer mode
  answer | clarify | scoped alternatives | conflicting | incomplete | unavailable
```

### Route decision table

| Query class | Primary targets | Typed expansion | Deliberation | Failure mode |
|---|---|---|---|---|
| Exact fact | published claims + exact passage | source identity, date/scope | none | state no supported answer |
| Exact passage | passage index + edition coordinates | translation/commentary only on request | none | do not synthesize missing text |
| Panchang/date | deterministic service + observance rule | local timing/applicability | none beyond explanation | fail closed if rule unresolved |
| Ritual vidhi | procedure lane + step evidence | materials, substitutions, variants, safety | select applicable reviewed lane | classify as calendar/story/participation if vidhi incomplete |
| Festival/story context | narrative claims + source-labelled variants | entity/place/time relations | compare variants only if material | do not universalize one origin |
| Comparison | parallel scoped claim bundles | variant/conflict relations | summarize dimensions and differences | preserve unaligned categories |
| Personal guidance | relevant facts + cases + patterns | counterexamples, affected parties, consequences | bounded competing readings and evidence adjudication | clarify or offer proportional low-risk options |
| Moral ambiguity | claims + cases + patterns + conflicts | argument/support/qualify relations | multiple interpretations, disanalogy, timescales | do not manufacture certainty or authority |
| Reflection | user context + optional reviewed pattern/case | no source claim needed for open question, but label synthesis | gentle, non-prescriptive | do not pretend reflection is ritual vidhi |
| Global corpus synthesis | reviewed dossiers first | later GraphRAG experiment | map-reduce only with assertion-level checks | mark coverage boundary |

## Offline versus inference-time work

### Offline and reviewable

- source segmentation and exact coordinates;
- claim/assertion extraction as review candidates;
- proposition linking, translation alignment, and scope assignment;
- support/challenge/qualify/conflict edges;
- procedure compilation and deterministic applicability rules;
- case dimensions, consequences, interpretations, and disanalogies;
- wisdom pattern derivation, evidence, counterexamples, review, and versioning;
- embeddings and search indexes;
- conflict bundles and answer-mode fixtures; and
- evaluation scenarios with gold route/relevant-record sets.

### Inference-time and ephemeral by default

- intent classification and material context extraction;
- value-of-information estimate for clarification;
- lane selection and bounded retrieval expansion;
- construction of competing candidate readings when warranted;
- analogy/disanalogy matching to the present situation;
- consideration of affected parties and timescales;
- concise answer generation and uncertainty phrasing; and
- a short inspectable decision summary referencing retrieved IDs.

Inference-time model output must not automatically become a case, pattern, conflict edge, causal edge, or durable user memory. Promotion requires an offline/review workflow.

## Small local design probes

These probes were run on 2026-08-07 with inline local code and no retained data. They are **illustrations, not efficacy evidence**.

### Probe A: typed scope before lexical similarity

**Method.** Eight deliberately adversarial toy queries were paired with two candidates each. A token-Jaccard top-1 baseline was compared with the same score after oracle filters for geography, tradition, and record kind. Scenarios covered Bengal/Karnataka ritual scope, Jain/Hindu Diwali, BAPS/Smarta Kali Chaudas, Smarta/ISKCON Janmashtami, calendar-versus-procedure, passage-versus-claim, and guidance-versus-procedure.

**Result.** Lexical top-1 selected the intended item in 6/8 cases. Typed filtering selected it in 8/8.

**Interpretation.** The probe demonstrates representational capacity: explicit context can prevent some predictable category errors before generation. It does not estimate production lift because the examples and “gold” tags were hand-constructed and the structured filter had oracle context.

### Probe B: surface versus structural analogy

**Method.** A toy target involved siblings, care for a dependent parent, livelihood relocation, asymmetry, and long-term low-reversibility consequences. Three candidate cases were ranked by token Jaccard and by a hand-authored structural score over relationships, value tensions, constraints, affected parties, and reversibility.

**Result.** Lexical retrieval chose a surface-similar family/holiday disagreement (`0.471` lexical, `1` structural). Structural scoring chose a lexically dissimilar shared-stewardship/livelihood case (`0.077` lexical, `11` structural).

**Interpretation.** This is the exact failure case predicted by structure-mapping research, but the handcrafted score makes the result tautological. The production test must use independently authored cases, blinded expert relevance labels, and learned or preregistered weights.

## Testable predictions and experiment plan

### Shared evaluation design

Build at least 160 reviewed scenarios across the first wisdom vertical:

- 25 exact fact/passage;
- 25 ritual/calendar/applicability;
- 20 story/variant exploration;
- 20 comparison/conflict;
- 40 personal guidance/moral ambiguity;
- 15 analogy stress tests; and
- 15 unanswerable/adversarial/insufficient-evidence cases.

Every scenario should identify expected route, material context slots, relevant and explicitly irrelevant evidence IDs, known conflicts, acceptable answer modes, prohibited claims, and human-review criteria. Split by scenario family, not paraphrase, so near-duplicates do not leak across development and test.

Compare ablations:

```text
B0  strong scoped hybrid RAG
B1  B0 + claim/assertion/conflict graph
B2  B1 + reviewed cases
B3  B2 + reviewed patterns/counterexamples
B4  B3 + bounded competing-interpretation deliberation
```

Measure retrieval recall/precision, claim support, conflict recall, applicability accuracy, analogy/disanalogy quality, judgment/relevance/actionability, humility, tradition fidelity, unsupported assertions, p50/p95 latency, token/model cost, and reviewer disagreement.

### Predictions and gates

1. **Claim graph prediction.** B1 will improve scoped relevant-set and conflict recall by at least 10 percentage points on comparison/conflict/applicability scenarios, with no more than a 2-point decline in exact factuality and no uncited graph-only material claims. Otherwise keep claims for editorial inspection but do not use graph expansion at runtime.
2. **Case prediction.** B2 will improve analogy-quality and perspective-taking ratings by at least 0.3 on a 5-point anchored human scale on guidance cases, without increasing misleading analogy or authority failures by more than 2 percentage points. Otherwise disable case retrieval for that class.
3. **Pattern prediction.** B3 will improve judgment/actionability by at least 0.3/5 and reduce generic-answer rate by at least 15% relative, while every material recommendation remains traceable to cases/claims and counterexample sensitivity does not worsen. Otherwise patterns are not worth their synthesis risk.
4. **Deliberation prediction.** B4 will improve conflict-appropriate answer rate by at least 8 points and anti-sycophancy tests by at least 8 points, with p95 cost no more than 2x B3 and no rise in invented premises. Otherwise use deterministic parallel evidence templates.
5. **Router prediction.** A rule-based router will match an always-retrieve-rich pipeline within 2 points on answer quality while reducing mean retrieved context/model tokens by at least 20%. A learned router is justified only if it beats the rules on held-out scenario families and fails visibly.
6. **Clarification prediction.** Asking only a question with a preregistered material decision change will improve applicability accuracy by at least 10 points while reducing unnecessary questions by at least 25% versus “ask whenever context is missing.”
7. **GraphRAG prediction.** It will help global theme and some multi-hop queries but not exact/passages/procedures. Accept only for query classes where it clears the gate above; never make it the universal retriever.
8. **Uncertainty prediction.** The evidence-state vector will predict unsupported/incorrect answers better than raw model self-confidence. Compare AUROC/Brier/ECE where meaningful, plus selective-risk curves for answer versus abstain/clarify.

## Layer rejection and red-team conditions

Reject or disable a proposed layer when any of the following holds:

- it cannot beat B0 on the scenario subset it claims to address;
- its “lift” disappears against hybrid retrieval with metadata filters and reranking;
- more than 5% of material answer assertions are supported only by derived nodes rather than source-linked claims/passages;
- it makes scope errors, cultural flattening, or unsupported universalization worse by more than 2 percentage points;
- it converts living-practice description into normative instruction;
- it conflates translation, commentary, model synthesis, and source original;
- it forces a single accepted interpretation where the reviewed record says plurality or unresolved conflict;
- it uses popularity, graph centrality, or model confidence as a proxy for truth or authority;
- it creates causal edges from narrative order, correlation, or model intuition;
- it produces advice from an analogy without a material disanalogy check;
- it increases preachiness, fatalism, karma blame, flattery, or guru-like authority;
- its p95 latency or model cost exceeds the agreed budget without a predeclared quality gain;
- its offline index cannot be refreshed incrementally with provenance and versioning;
- reviewers cannot reconstruct why a record was retrieved and which evidence supported the final answer; or
- it requires a separate database/service before Postgres has failed a representative benchmark.

## Evidence register

All URLs were accessed on **2026-08-07**. “Limitation” records the boundary used in this memo, not a general criticism of the source.

### Grounded retrieval and planning

| ID | Source | Finding used | Limitation | Relevance |
|---|---|---|---|---|
| R1 | Lewis et al. (2020), [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://proceedings.nips.cc/paper/2020/hash/6b493230205f780e1bc26945df7481e5-Abstract.html) | Non-parametric retrieval improved knowledge-intensive generation over parametric-only baselines and supports updatable/provenance-bearing knowledge | Wikipedia/open-domain tasks; not wisdom guidance | Establishes grounded RAG baseline |
| R2 | Thakur et al. (2021), [BEIR](https://openreview.net/forum?id=wCu6T5xFjeJ) | BM25 is robust; late interaction/reranking often strong but costly; heterogeneous tasks have different winners | Retrieval metrics do not guarantee answer quality; Devam is multilingual/domain-specific | Requires local hybrid baseline and task slices |
| R3 | Cormack et al. (2009), [Reciprocal Rank Fusion](https://doi.org/10.1145/1571941.1572114) | Simple rank fusion outperformed individual and other fusion methods in tested TREC/LETOR settings | Short paper; old collections; not universal | Defensible simple fusion baseline |
| R4 | PostgreSQL Global Development Group (current), [Full Text Search](https://www.postgresql.org/docs/current/textsearch.html) | Postgres provides parsing, indexing, ranking, query rewriting, and diagnostics | Language configurations require validation for Sanskrit/Indic languages | Supports Postgres-first lexical retrieval |
| R5 | pgvector (current), [official README](https://github.com/pgvector/pgvector#hybrid-search) | Exact/approximate vector search, metadata filtering, full-text hybrid retrieval, RRF/cross-encoder combination | Approximate filtering can reduce recall; requires tuning/measurement | Supports one-store MVP and recall tests |
| R6 | Jeong et al. (2024), [Adaptive-RAG](https://aclanthology.org/2024.naacl-long.389/), DOI `10.18653/v1/2024.naacl-long.389` | Query-complexity classification can route among no-, single-, and multi-step retrieval for accuracy/efficiency gains | Open-domain QA labels/classifier may not transfer | Supports adaptive planner experiment |
| R7 | Asai et al. (2024), [Self-RAG](https://openreview.net/forum?id=hSyW5go0v8) | Learned reflection tokens can decide retrieval need and critique retrieval/generation | Requires training and model integration; self-critique is not independent verification | Longer-term, not MVP default |
| R8 | Trivedi et al. (2023), [IRCoT](https://aclanthology.org/2023.acl-long.557/), DOI `10.18653/v1/2023.acl-long.557` | Interleaving retrieval and reasoning improved multi-step QA and retrieval on four benchmarks | Uses generated CoT and benchmark QA; query drift/cost and privacy differ in product | Supports bounded multi-hop retrieval, not stored CoT |
| R9 | Jiang et al. (2023), [FLARE](https://aclanthology.org/2023.emnlp-main.495/), DOI `10.18653/v1/2023.emnlp-main.495` | Active retrieval during generation improved/competed on long-form knowledge tasks | Confidence-token trigger and long-form focus; not concise Sārthi guidance | Evidence for retrieval repair only when needed |
| R10 | Ru et al. (2024), [RAGChecker](https://proceedings.neurips.cc/paper_files/paper/2024/hash/27245589131d17368cccdfa990cbf16e-Abstract-Datasets_and_Benchmarks_Track.html), DOI `10.52202/079017-0692` | Separating retrieval and generation diagnostics correlated better with human judgment than compared metrics | Automated metrics still require local human validation | Supports component-level evaluation |

### Claims, graphs, provenance, and argumentation

| ID | Source | Finding used | Limitation | Relevance |
|---|---|---|---|---|
| K1 | Hogan et al. (2021), [Knowledge Graphs](https://doi.org/10.1145/3447772) | KGs involve data models, schema, identity, context, quality, deductive and inductive techniques | Broad survey; not evidence that a graph DB improves this product | Separates graph model from storage choice |
| K2 | W3C (2013), [PROV-O Recommendation](https://www.w3.org/TR/prov-o/) | Standard entity/activity/agent, derivation, attribution, quotation, revision, and primary-source relations | Generic provenance; domain semantics still needed | Basis for compatible provenance semantics |
| K3 | W3C (2012), [OWL 2 Profiles](https://www.w3.org/TR/owl2-profiles/) | OWL 2 RL restricts expressivity for scalable rule-based reasoning and defined computational properties | RDF/OWL adoption adds modelling/operational cost | Supports constrained, not maximal, reasoning |
| K4 | W3C (2017), [SHACL Recommendation](https://www.w3.org/TR/shacl/) | Graph shapes can validate conditions and report violations | RDF-specific and recursion semantics have limits | Supports explicit validation principle |
| K5 | Bölling et al. (2014), [SEE: structured representation of scientific evidence](https://doi.org/10.1186/2041-1480-5-S1-S1) | Separates claims, claim content, source/agent provenance, and argumentative evidence; accommodates nested interpretation | Biomedical case study; ontology overhead need not be copied | Strong analogue for assertion/proposition/evidence separation |
| K6 | Dung (1995), [On the Acceptability of Arguments](https://doi.org/10.1016/0004-3702(94)00041-X) | Formalizes attack and acceptability semantics and links to non-monotonic reasoning | Abstract arguments omit domain content/preferences | Shows what a real argument solver entails |
| K7 | Modgil and Prakken (2014), [ASPIC+ tutorial](https://doi.org/10.1080/19462166.2013.869766) | Structured arguments use premises, strict/defeasible rules, attacks, and preferences | Preferences are substantive; complexity exceeds current need | Grounds defer/reject decision for MVP solver |
| K8 | Chesñevar et al. (2006), [Argument Interchange Format](https://doi.org/10.1017/S0269888906001044) | Provides a shared abstract model for exchanging argument structures | Draft/community consensus model, not product efficacy evidence | Possible future interchange mapping |
| K9 | Park and Lee (2024), [Toward Robust RALMs](https://aclanthology.org/2024.tacl-1.91/), DOI `10.1162/tacl_a_00724` | RALMs often fail on unanswerable, adversarial, and conflicting retrieved sets | Tested models/tasks may differ from Sārthi | Makes conflict detection a baseline requirement |
| K10 | Cattan et al. (2025), [(D)RAGged Into a Conflict](https://research.google/pubs/dragged-into-a-conflict-detecting-and-addressing-conflicting-sources-in-retrieval-augmented-llms/) | Knowledge conflicts have different causes and desired behaviours; explicit conflict-type information helps | Benchmark and desired behaviours require domain adaptation | Supports typed conflict policy |
| K11 | Li et al. (2026), [Debate-of-Thoughts](https://aclanthology.org/2026.acl-long.1651/), DOI `10.18653/v1/2026.acl-long.1651` | Competing hypotheses, critique, and adjudication improved tested conflict benchmarks | Internal debate can invent arguments; no direct tradition/pluralism evidence | Candidate bounded conflict mode only |

### Cases, analogy, time, and causality

| ID | Source | Finding used | Limitation | Relevance |
|---|---|---|---|---|
| C1 | Aamodt and Plaza (1994), [Case-Based Reasoning](https://doi.org/10.3233/AIC-1994-7104) | CBR requires retrieve, reuse, revise/test, and retain; representation and adaptation are central | Predates LLMs; no direct cultural-guidance evidence | Prevents “retrieve a story and copy its action” shortcut |
| C2 | Gentner (1983), [Structure-Mapping](https://doi.org/10.1207/s15516709cog0702_3) | Analogy maps relational structure and systematic relations rather than shared attributes alone | Theory does not supply Devam case dimensions or moral validity | Grounds explicit similarity/disanalogy fields |
| C3 | Forbus, Gentner, and Law (1995), [MAC/FAC](https://doi.org/10.1207/s15516709cog1902_1) | Cheap broad candidate retrieval followed by expensive structural matching models similarity retrieval | Cognitive model and simulations, not product benchmark | Supports two-stage case retrieval |
| C4 | Allen (1983), [Maintaining Knowledge about Temporal Intervals](https://doi.org/10.1145/182.358434) | Formal interval relations and constraint propagation represent temporal knowledge | Full algebra may be unnecessary and expensive | Supports minimal typed time/validity relations |
| C5 | Pearl (1995), [Causal Diagrams for Empirical Research](https://doi.org/10.1093/biomet/82.4.669) | Causal identification requires explicit graphical assumptions and sufficient evidence | Focused on empirical statistical research | Blocks narrative-to-causal-edge overreach |

### GraphRAG and graph retrieval

| ID | Source | Finding used | Limitation | Relevance |
|---|---|---|---|---|
| G1 | Edge et al. (2024), [From Local to Global: GraphRAG](https://arxiv.org/abs/2404.16130) | LLM-extracted graph communities and summaries improved tested global sensemaking versus naïve RAG | Preprint; global questions; costly generated index; weaker baseline than this memo | Future global-synthesis experiment only |
| G2 | Microsoft (current), [GraphRAG documentation](https://microsoft.github.io/graphrag/) | Official implementation separates local neighborhood and global community-summary search | Documentation is not independent efficacy evidence | Clarifies operational components/cost surface |
| G3 | Gutiérrez et al. (2024), [HippoRAG](https://papers.nips.cc/paper/2024/hash/6ddc001d07ca4f319af96a3024f6dbd1-Abstract-Conference.html) | LLM graph + Personalized PageRank reported multi-hop QA gains and lower inference cost than iterative retrieval in tested settings | OpenIE graph quality and benchmark transfer remain risks | Candidate reviewed-edge graph retrieval experiment |
| G4 | Han et al. (2025), [RAG vs. GraphRAG](https://arxiv.org/abs/2502.11371) | RAG and GraphRAG had task-dependent complementary strengths; RAG stronger on tested detail/single-hop, GraphRAG on multi-hop | Preprint; implementations/evaluators affect results | Rejects universal GraphRAG replacement claim |

### Cognitive/neuro-symbolic systems and uncertainty

| ID | Source | Finding used | Limitation | Relevance |
|---|---|---|---|---|
| N1 | Anderson et al. (2004), [An Integrated Theory of the Mind](https://doi.org/10.1037/0033-295X.111.4.1036) | ACT-R integrates specialized modules, buffers, declarative memory, and productions | Cognitive theory/model, not Sārthi product evaluation | Shows scope of adopting a cognitive architecture |
| N2 | Laird, Newell, and Rosenbloom (1987), [Soar](https://doi.org/10.1016/0004-3702(87)90050-6) | Soar proposes task-independent architecture for problem solving, representation, and learning | General architecture; no current domain lift evidence | Supports MVP rejection as over-broad |
| N3 | Manhaeve et al. (2018), [DeepProbLog](https://proceedings.neurips.cc/paper/2018/hash/dc5d637ed5e62c36ecb73b654b05ba2a-Abstract.html) | Neural predicates can be integrated with probabilistic logic and trained end-to-end | Demonstrations are bounded; stable symbolic semantics/training data required | Shows neuro-symbolic feasibility, not necessity |
| N4 | Besold et al. (2022), [Neural-Symbolic Learning and Reasoning survey](https://doi.org/10.3233/FAIA210348) | Reviews heterogeneous integrations of learning, logic, uncertainty, and cognitive models plus open challenges | Broad expert survey; applications differ from Sārthi | Supports research-only status |
| U1 | Guo et al. (2017), [On Calibration of Modern Neural Networks](https://proceedings.mlr.press/v70/guo17a.html) | Accuracy and confidence can diverge; temperature scaling is a useful supervised calibration baseline | Classification setting; not open-ended generation | Establishes need for empirical calibration |
| U2 | Kadavath et al. (2022), [Language Models (Mostly) Know What They Know](https://arxiv.org/abs/2207.05221) | Some self-evaluation signals are useful, but calibration/generalization can degrade on new tasks | Preprint and model family; task transfer limitation is material | Model self-confidence is experimental only |
| U3 | Farquhar et al. (2024), [Detecting hallucinations using semantic entropy](https://doi.org/10.1038/s41586-024-07421-0) | Semantic-equivalence-aware sampling can detect some confabulations, including black-box variants | Sampling cost; not a source/evidence check; domain shift | Optional evaluation feature, not trust root |
| U4 | Mohri and Hashimoto (2024), [Language Models with Conformal Factuality Guarantees](https://openreview.net/forum?id=uYISs2tpwP) | Conformal back-off can trade specificity for empirical correctness coverage | Guarantees depend on calibration data, labels, and distribution assumptions | Longer-term calibrated answer-mode experiment |
| U5 | Suri et al. (2026), [Structured Uncertainty guided Clarification](https://aclanthology.org/2026.findings-acl.2028/), DOI `10.18653/v1/2026.findings-acl.2028` | Separating specification/model uncertainty and using EVPI improved tool-task coverage while reducing questions | Tool parameters are cleaner than human guidance context | Supports material-decision-change clarification test |

## Bottom line for the main programme

The defensible middle layer is not one grand architecture. It is a small set of independently testable capabilities:

```text
sources/passages
    -> attributable assertions and scoped claims
    -> procedures, cases, and reviewed patterns
    -> typed retrieval planner and conflict bundles
    -> bounded inference-time comparison
    -> concise answer + evidence-state + short decision summary
```

Postgres can express every MVP relation and recursive traversal presently justified. The first vertical should prove that claim conflict edges, explicit case dimensions/disanalogies, and reviewed patterns improve Sārthi over strong scoped hybrid RAG. Everything else remains a hypothesis with an acceptance gate.
