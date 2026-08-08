# Artificial-Wisdom MVP and Long-Term Roadmap V2

**Date:** 2026-08-07  
**Principle:** validate the smallest independent capability before building the platform

## 1. What the MVP is

The MVP is an experiment demonstrating whether an inspectable, context-sensitive Governor improves consequential decision support beyond strong grounded RAG on one bounded domain task family.

It is not:

- a general wise agent;
- a new foundation model;
- a comprehensive knowledge or causal graph;
- autonomous advice delivery;
- continual self-learning from users;
- a public claim that Sārthi or Devam has solved artificial wisdom; or
- the implementation of every component in GAWA.

## 2. MVP success statement

On a preregistered, held-out set of 60–100 contextual guidance scenarios, the thin Governor must:

- produce no more severe failures than the strongest grounded-RAG baseline;
- win at least 60% of non-tied blinded pairwise judgments on the preregistered primary measure, with a confidence interval excluding 50%;
- improve at least two target deficits such as material-context use, analogy/disanalogy, consequence awareness, or calibrated restraint;
- remain within defined latency, cost, response-length, and abstention budgets;
- retain gains under plain-style rendering and confidence perturbation; and
- provide evidence-linked operational summaries without exposing hidden chain-of-thought.

These are research thresholds, not universal standards. They should be finalized before running the evaluation.

## 3. Phase 0 — preregistration and independent baseline

**Objective:** prevent the architecture from defining its own success.

Deliver:

- task and population boundary;
- independent scenario-authoring protocol;
- strong RAG, prompt-only, and qualified-human comparison conditions;
- construct-level rubric and severe-failure gates;
- blinded review protocol and disagreement reporting;
- latency/cost/verbosity budgets;
- privacy and data-retention protocol; and
- signed or hash-fixed test-set version before system tuning.

**Exit gate:** reviewers can distinguish the target constructs with acceptable agreement, or disagreement is structured enough to report. If not, refine the constructs before system development.

## 4. Phase 1 — thin Governor, no new knowledge layer

**Build:**

- situation card;
- task/risk/authority classifier;
- expected-value-of-clarification rule;
- direct versus deliberate route selector;
- evidence and capability manifest;
- answer-mode selector; and
- concise operational decision summary.

Use the same retriever and generative model as the strong baseline. This isolates governance value.

**Experiment:** baseline RAG versus prompt-only versus thin Governor.

**Exit gate:** hard-gate non-inferiority plus meaningful pairwise improvement. Otherwise stop or retain only context/routing components that independently help.

## 5. Phase 2 — cases and analogy

**Build only if Phase 1 passes:**

- 25–40 reviewed cases;
- relational case representation;
- source/target structural mapping;
- mandatory disanalogy report;
- case authority and outcome-status labels; and
- target-blind case retrieval tests.

**Experiment:** Governor versus Governor plus cases; relational retrieval versus embedding-only retrieval; real versus shuffled cases.

**Exit gate:** better held-out transfer and fewer false analogies, not just higher reviewer enjoyment.

## 6. Phase 3 — patterns, arguments, and consequences

**Build:**

- a small reviewed pattern-hypothesis library;
- independent supporting and counter-cases;
- competing explanations and retirement conditions;
- argument graphs only where actual disagreements warrant them; and
- bounded consequence models with explicit evidence status.

**Experiment:** factorial ablation of cases, patterns, counterexamples, argument routing, and consequence tools.

**Exit gate:** each promoted layer demonstrates incremental value after token-count and latency controls. Delete ornamental layers.

## 7. Phase 4 — Sārthi domain pilot

**Domain-specific work:**

- ratify the Sārthi role, epistemic, normative, and evaluation constitutions;
- recruit or define independent review panels across relevant traditions, languages, practice, scholarship, and decision quality;
- validate deterministic and ritual authority boundaries;
- test source-appropriate interpretation and non-equivalence;
- audit karma blame, fatalism, sectarian ranking, unsafe ritual guidance, and relational dependence; and
- compare user outcomes and agency, not merely response preference.

**Exit gate:** capability claim is narrow, reproducible, culturally reviewed, and bounded to the tested scenario family.

## 8. Phase 5 — second-domain portability test

Before calling the architecture general, instantiate it in a structurally different domain. A regulated or high-impact deployment is inappropriate as the first test. A safer candidate could be founder decision reflection, educational mentoring, or civic deliberation using retrospective cases.

The test should preserve general interfaces while replacing:

- ontology and terminology;
- expertise and authority map;
- normative and legitimacy charter;
- case and outcome corpus;
- task risks and escalation; and
- evaluation panels.

**Exit gate:** the general architecture needs no Sārthi-specific primitive and adds value in both domains.

## 9. Phase 6 — longitudinal learning

Only after cross-sectional success:

- obtain explicit consent for follow-up;
- record decisions, confidence, expectations, and subsequent outcomes;
- distinguish observation from self-report and attribution;
- update cases without rewriting history;
- recalibrate patterns and capabilities;
- measure correction quality, regret, agency, trust calibration, and unintended consequences; and
- establish independent incident and challenge review.

No automatic online learning from raw conversations is permitted at this stage.

## 10. Phase 7 — human–AI cognitive institution

The long-term scalable target combines:

- models and deterministic tools;
- evidence, claims, cases, patterns, arguments, and causal models;
- domain experts and affected-community review;
- explicit governance and appeals;
- capability evaluation and expiry;
- incident/outcome learning; and
- public or user-facing transparency proportionate to risk.

This institution should expose who is responsible for evidence promotion, value-policy changes, reviewer selection, incidents, and correction. More components do not make it wiser; stronger accountability and observed learning might.

## 11. Research workstreams

### W1. Construct validity

Test the capability lattice, discriminant validity, behavioral signatures, and relation to established wisdom measures.

### W2. Meta-pattern discovery

Compare LLM induction, program induction, structural analogy, human discovery, and hybrid validation on held-out transfer and false insight.

### W3. Situated judgment

Study framing, clarification value, role and power representation, reversibility, uncertainty, and action proportionality.

### W4. Normative legitimacy

Develop contestable plural-value protocols, authority mapping, moral uncertainty handling, and stakeholder challenge.

### W5. Experience and learning

Define how outcome-bearing cases can be collected ethically and how systems distinguish luck, attribution, and causal learning.

### W6. Embodiment and relationality

Test what is lost without bodily, affective, social, and longitudinal participation, and which losses can be supported by humans or sensors without anthropomorphic claims.

### W7. Rhetoric and dependence

Measure charisma confounds, perceived wisdom, appropriate trust, emotional reliance, and agency over repeated interactions.

### W8. Cross-cultural validity

Use domain-owned concepts, multilingual evaluation, non-equivalence, and diverse review to test whether thin general functions travel without flattening traditions.

## 12. Architecture evolution rules

Add a component only when:

1. a named failure recurs;
2. the component has a causal hypothesis for fixing it;
3. a cheaper prompt, retrieval, policy, or workflow alternative is included;
4. independent evaluation can isolate its contribution; and
5. there is an owner for provenance, review, privacy, and retirement.

Remove or demote a component when:

- the gain disappears under ablation;
- it only lengthens or beautifies answers;
- it increases severe failure or unjustified confidence;
- reviewers cannot understand its authority;
- its evidence cannot be maintained; or
- organizational incentives make its controls fictional.

## 13. Indicative implementation order

| Order | Capability | Why now | Avoid for now |
|---:|---|---|---|
| 1 | evaluation set and baseline | without it no architecture claim is meaningful | benchmark built from system outputs |
| 2 | context/risk/authority card | cheapest test of the coordination thesis | exhaustive user profile |
| 3 | routing and clarification value | can improve both accuracy and restraint | full planner DSL |
| 4 | critic validators and decision summary | inspectability and correlated-error controls | hidden-rationale storage |
| 5 | small relational case library | tests experience/analogy hypothesis | bulk synthetic cases |
| 6 | counterexamples and pattern hypotheses | tests meta-pattern value | canon-sized pattern graph |
| 7 | argument/consequence tools | only for demonstrated conflict and decision needs | universal causal world model |
| 8 | second domain | tests generality | claiming portability from one instance |
| 9 | consented outcomes | tests learning and longitudinal wisdom | automatic conversation learning |
| 10 | institutional governance | needed before high-impact scale | autonomous deployment |

## 14. Resource discipline

For experimentation:

- use a strong model for construct synthesis, scenario adjudication, and difficult candidate generation;
- use cheaper capable models or deterministic code for classification, extraction, formatting, and repeatable validators once benchmarked;
- cache immutable retrieval and evaluation inputs;
- do not spend on architecture components before baseline failure warrants them; and
- measure cost per accepted decision improvement, not tokens or responses alone.

## 15. Long-term claim ladder

1. **Prototype:** demonstrates inspectable routing and deliberate response construction.
2. **Validated capability:** beats baselines on a bounded held-out task family.
3. **Domain system:** retains gains across multiple task families, populations, and time.
4. **Portable architecture:** retains gains across at least two structurally distinct domains.
5. **Wisdom-supporting institution:** shows accountable longitudinal learning and beneficial human–AI outcomes.
6. **Artificial wisdom:** remains a philosophical and scientific claim requiring evidence well beyond this roadmap.

Skipping levels is prohibited by the research logic, even if marketing language would reward it.
