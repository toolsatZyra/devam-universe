# Architecture options and trade-offs

**Date:** 2026-08-07  
**Decision lens:** measurable improvement over a strong grounded-RAG baseline, not conceptual elegance

## 1. The comparator must be strong

The baseline is not “vector search plus one prompt.” It includes:

- intent/risk classification;
- Postgres full-text plus pgvector hybrid retrieval;
- metadata and rights filtering;
- query rewriting/decomposition where useful;
- source, claim, story, procedure, current-information, and deterministic Panchang routes;
- cross-encoder or model reranking when justified;
- conflict/counterevidence retrieval;
- decision-relevant clarification;
- claim-level citations and refusal on unsupported material claims;
- concise answer templates by query class;
- offline evaluated prompts and human review.

Any proposed “wisdom” component must beat this baseline on held-out scenarios. Foundational RAG research demonstrates benefit on knowledge-intensive tasks ([Lewis et al. 2020](https://papers.nips.cc/paper/2020/hash/6b493230205f780e1bc26945df7481e5-Abstract.html)); later work also shows vulnerability to irrelevant retrieval and long-context use ([NoMIRACL](https://doi.org/10.18653/v1/2024.findings-emnlp.730); [Liu et al. 2024](https://doi.org/10.1162/tacl_a_00638)). The right response is a disciplined baseline, not assuming that a graph or deliberation loop fixes retrieval.

## 2. Option matrix

Scores are programme judgments: 1 low, 5 high. “Benefit” is potential benefit for Sarthi's target tasks, not general technical merit.

| Option | Primary benefit | Inspectability | Editorial burden | Runtime cost | Premature-synthesis risk | MVP decision |
|---|---|---:|---:|---:|---:|---|
| Strong grounded RAG | facts, passages, scoped synthesis | 4 | 3 | 2 | 2 | **Required baseline** |
| Claim/semantic graph in Postgres | scope, conflict, multi-hop relations | 5 | 4 | 2 | 2 | **Core, narrowly typed** |
| Case-based reasoning | analogy on situation structure | 4 | 5 | 3 | 4 | **Pilot one vertical** |
| Reviewed pattern library | reusable lenses, counterexamples | 5 | 5 | 2 | 5 | **Pilot only if cases exist** |
| Argument graph | explicit support/attack and competing interpretations | 5 | 5 | 3 | 3 | **Defer; use light claim edges first** |
| Causal/temporal model | consequences, process, chronology | 4 | 5 | 3 | 5 | **Use typed temporal/causal claims; no universal causal engine** |
| Rule/constraint system | deterministic applicability, safety, eligibility | 5 | 4 | 1 | 2 | **Use for bounded rules only** |
| Cognitive architecture | general control, memory, metacognition | 2 | 5 | 5 | 4 | **Reject for MVP** |
| Neuro-symbolic reasoner | formal constraint checking, defeasible rules | 4 | 5 | 5 | 4 | **Research trigger only** |
| Native graph database | specialised traversals at scale | 4 | 3 | 5 | 2 | **Reject until Postgres benchmark fails** |
| Long-context model over raw library | simple plumbing | 2 | 1 | 4 | 4 | **Reject as primary architecture** |
| Fine-tuned “wise persona” | voice/behaviour consistency | 1 | 1 | 4 | 5 | **Reject without evidence and training governance** |

## 3. Detailed assessment

### A. Strong grounded RAG

**What it is good at**

- exact and explanatory questions whose answer is present in passages, claims, or procedures;
- reversible implementation and clear provenance;
- fresh updates without model retraining;
- a credible comparator for every added layer.

**Where it predictably struggles**

- retrieving a structurally analogous case when vocabulary differs;
- ensuring counterexamples and disanalogies appear;
- representing the scope of derived generalisations;
- distinguishing genuine value conflict from information lookup;
- enforcing a consistent stakeholder/timescale deliberation process.

**Decision:** build this first and keep it as the default route. Many questions need no “wisdom layer.”

### B. Claim and semantic graph

**Meaning here:** relational tables for entities, scoped claims, evidence, interpretation, conflicts, applicability, sequence, and selected typed relations. This is not a separate graph product.

**Benefits**

- contradictions can be scope-aware rather than flattened;
- relations remain attributable;
- SQL filters can enforce product/rights/tradition lanes before model use;
- multi-hop retrieval can be bounded and explainable;
- supports exact facts, comparison, ritual applicability, and cases.

**Risks**

- ontology expansion becomes an end in itself;
- model-extracted edges can acquire false authority;
- relation labels such as `causes` or `is_duty_of` can hide interpretive disputes;
- graph density can be mistaken for library completeness.

**Falsification:** if normalised claim/evidence tables plus JSON metadata retrieve no better than passage metadata for selected tasks, do not expand relation types.

**Decision:** retain as the evidence middle layer, with few relation types and evidence on edges.

### C. Case-based and analogical reasoning

Classical case-based reasoning cycles retrieve, reuse/adapt, revise, and retain ([Aamodt and Plaza 1994](https://doi.org/10.3233/AIC-1994-7104)). Structure-mapping research treats analogy as relational correspondence rather than shared surface features ([Gentner 1983](https://doi.org/10.1207/s15516709cog0702_3)).

**Benefits**

- natural fit for itihasa/story-guided reflection without turning story into rule;
- forces explicit dimensions: actors, relationships, duties, power, constraints, values, action, consequence;
- makes similarity and disanalogy testable;
- enables countercase retrieval.

**Risks**

- editorial coding is expensive and contestable;
- source narratives are compressed into analyst categories;
- memorable or culturally prestigious cases may dominate even when structurally poor;
- adaptation can invent a normative bridge from “similar” to “therefore do X.”

**Falsification:** on held-out analogy scenarios, structured case retrieval must improve expert-rated case fit and disanalogy coverage over strong passage/claim RAG without increasing invalid normative transfer.

**Decision:** pilot with a small, reviewed case set in one vertical. Never auto-retain inference-time cases.

### D. Reviewed pattern library

**Benefits**

- makes recurring synthesis inspectable and versionable;
- can preload counterexamples, scope, trade-offs, and competing readings;
- avoids re-deriving common lenses inconsistently on every request.

**Risks**

- highest cultural-flattening and platitude risk;
- reviewers may encode one social/moral ideology as “wisdom”;
- patterns can drift into unsupported scripture-like authority;
- a good model with good cases may derive the same lens on demand more accurately.

**Falsification:** patterns must improve held-out relevance/judgment or reduce severe failures beyond case+claim RAG. If they merely make answers more articulate or verbose, reject them.

**Decision:** no broad ontology. Author 5–15 patterns only after the first case set, each with countercases and an expiry/review trigger.

### E. Argument graphs

Abstract argumentation represents arguments and attack relations ([Dung 1995](https://doi.org/10.1016/0004-3702(94)00041-X)); richer systems can encode support, premises, schemes, preferences, and exceptions.

**Benefits**

- good fit for competing interpretations and explicit warrants;
- can expose why a claim is supported, limited, or attacked;
- may reduce opaque “the model reconciled it” outcomes.

**Risks**

- interpretation arguments are costly to model and rarely complete;
- attack/support edges do not settle values, source authority, or scope by themselves;
- formal acceptability semantics can create false finality in theological or ethical disagreement;
- ordinary users do not need a visible debate graph.

**Falsification:** only add dedicated argument objects if light `supports/contradicts/qualifies/interpretation_of` edges cannot represent conflicts needed by the first vertical or if formal argument retrieval improves adjudicated conflict answers.

**Decision:** defer full argument graphs; preserve upgrade-compatible claim/argument IDs and relation provenance.

### F. Causal and temporal models

**Benefits**

- temporal sequence is essential for narratives, procedures, ritual timing, and consequences;
- explicit causal-claim roles prevent the model from treating narrative succession as proven causation;
- structural causal models can support interventions and counterfactuals when variables and assumptions are defensible.

**Risks**

- ethical, historical, and personal consequences rarely satisfy stable causal-model assumptions;
- source narratives contain attributed explanations, not automatically empirical causal laws;
- counterfactual simulation may produce unjustified precision or victim blame.

**Falsification:** use a causal model only for a bounded domain with identified variables, data, assumptions, and a decision where it outperforms qualitative consequence enumeration.

**Decision:** store temporal and attributed causal relations now; do not build a general causal “karma” or life-outcome engine.

### G. Rules and constraints

**Benefits**

- correct for deterministic Panchang, applicability, rights, publication, safety, and specialist-practice boundaries;
- testable, debuggable, and independent of model persuasion;
- useful for precedence and fail-closed behaviour.

**Risks**

- defeasible social practices do not fit universal if-then rules;
- proliferating exceptions can become another bespoke bureaucracy;
- rules can silently encode a contested norm.

**Decision:** use rules for deterministic or explicitly authored bounded decisions. Use evidence-scoped recommendations, not rules, for value-laden judgment.

### H. Cognitive architectures

Architectures such as ACT-R, Soar, or a common model of cognition target general cognitive functions. Metacognitive extensions are an active research area, not a Devam requirement.

**Benefits:** potentially coherent control, working/declarative memory, goal management, and metacognitive monitoring.

**Risks:** large conceptual and engineering commitment, weak direct evidence for improved Sarthi guidance, duplication of application orchestration, and difficult cultural/provenance integration.

**Decision:** reject for MVP and medium term. Revisit only if a clearly measured control problem cannot be solved by a small planner/state machine.

### I. Neuro-symbolic and defeasible reasoning

**Benefits**

- external solvers can verify constraints that LLM self-critique misses;
- defeasible formalisms can express defaults and exceptions;
- useful for bounded classification or compliance tasks.

**Risks**

- natural-language-to-logic translation becomes the unverified bottleneck;
- formal validity does not establish sound premises or wise values;
- symbolic vocabularies can flatten interpretive nuance;
- runtime and editorial complexity are high.

**Falsification trigger:** only prototype when at least 50 reviewed rule/exception cases exist and the prompt/SQL implementation has a measured failure pattern that formal checking plausibly addresses.

**Decision:** defer. External deterministic validators remain preferred where possible.

### J. Native graph database

**Benefits:** specialised traversal, graph algorithms, and graph-centric tooling at scale.

**Risks:** duplicate operational data model, new security/backup/deployment burden, and no demonstrated MVP retrieval need.

GraphRAG research suggests graphs can help global corpus summarisation ([Edge et al. 2024](https://arxiv.org/abs/2404.16130)), but that task is not evidence that a native graph store improves Devam's scoped guidance.

**Decision:** Postgres relational edges and recursive SQL first. Revisit only after benchmarks show unacceptable latency, query complexity, or retrieval quality at real scale.

### K. Long-context-only and persona approaches

Putting many documents into a long prompt avoids explicit structure but is fragile to context position, retrieval noise, rights filtering, and correction. A “wise persona” changes style without producing evidence, calibrated uncertainty, or judgment.

**Decision:** reject as architecture. Long context remains a bounded inference tool; companion voice remains a presentation contract.

## 4. Architecture families considered

### Family F0 — Grounded RAG only

`library -> hybrid retrieval -> rerank -> answer`

- Fastest.
- Credible for R0–R2 and much of R1.
- Likely insufficient for controlled analogy and reusable counterexample-aware synthesis.

### Family F1 — Evidence graph + planner

`library -> claims/procedures/relations -> query planner -> routed retrieval -> answer`

- Best MVP foundation.
- Adds scope and conflict without speculative pattern infrastructure.
- Should be implemented before cases/patterns.

### Family F2 — Evidence graph + cases + reviewed patterns + bounded deliberation

`F1 + case dimensions + pattern/counterpattern records -> deliberation scaffold -> answer`

- Recommended research target for one R3/R4 vertical.
- Every added object is optional and ablatable.
- No independent “wisdom engine” service is required.

### Family F3 — Formal argument/causal/neuro-symbolic system

`F2 -> formal models/solvers -> adjudication`

- Potential later value for bounded problems.
- Not justified by current Devam evidence or scale.

### Family F4 — General cognitive architecture

- Conceptually broadest and least product-validated.
- Rejected.

## 5. Red-team decision table

| Proposed layer | Strongest simpler explanation | Test that could justify it | Reject when |
|---|---|---|---|
| claim graph | metadata-filtered passage RAG is enough | multi-hop/scope/conflict accuracy | edges add no held-out gain or cannot be sourced |
| cases | passages and prompt-generated analogies are enough | expert case-fit and disanalogy evaluation | famous-case bias or invalid transfer rises |
| patterns | model can synthesise lenses from cases at runtime | relevance/judgment/actionability ablation | only fluency/verbosity improves |
| argument graph | conflict metadata plus retrieved interpretations is enough | adjudicated complex-conflict set | graph incompleteness creates false resolution |
| causal model | qualitative consequence checklist is enough | bounded intervention/counterfactual task | assumptions are unverifiable or unstable |
| rules | planner prompts are enough | deterministic compliance test | exceptions encode contested practice or maintenance explodes |
| neuro-symbolic | SQL + validators are enough | repeated formal-constraint failures | translation-to-logic dominates error |
| native graph DB | recursive SQL is enough | production-scale latency/quality benchmark | no real workload fails |

## 6. Conclusion

The middle layer should be **typed evidence and applicability first**, not a knowledge-graph product or a simulated mind. Add a small case library and a handful of reviewed patterns only for the first evaluated guidance vertical. Keep argument, causal, rule, and symbolic structures bounded to tasks where their semantics are defensible. This design maximises inspectability and reversibility while giving the hypothesis of wisdom-supporting behaviour a fair test.
