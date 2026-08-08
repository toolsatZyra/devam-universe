# Sarthi Practical Artificial Wisdom research charter

**Programme date:** 2026-08-07  
**Workspace:** `research/sarthi-artificial-wisdom/`  
**Status:** active research; no application or database implementation is authorized

## Mission

Design the smallest inspectable architecture that makes Sarthi measurably better than a strong source-grounded retrieval-and-generation baseline at context-sensitive, compassionate, tradition-faithful, actionable judgment. Sarthi is a companion, not a guru, oracle, divine authority, therapist, lawyer, doctor, or substitute for family, sampradaya, temple, or qualified professional authority.

The programme serves Devam's library-first mission. It does not turn derived patterns into source originals, use a knowledge graph as a substitute for source acquisition, or claim that a model is inherently wise.

## Research questions

1. What observable and measurable definition of wisdom is useful for Sarthi?
2. What operationally separates data, information, knowledge, intelligence, judgment, insight, and wisdom?
3. Which source, case, interpretation, living-practice, and context evidence must Devam acquire, with what rights and provenance?
4. How should claims, procedures, narratives, relations, conflicts, cases, patterns, values, trade-offs, uncertainty, and derived insights be represented without flattening traditions?
5. Which middle-layer techniques materially outperform strong grounded RAG, and for which query classes?
6. What should exact-fact, ritual, contextual, exploratory, comparative, ambiguous-guidance, and reflective queries retrieve?
7. How should a retrieval planner acquire context, route evidence, handle conflict, value clarification, and fail gracefully?
8. What bounded deliberation may happen at inference time without persisting or exposing hidden chain-of-thought?
9. Which syntheses should be reviewed and versioned offline, and which should remain ephemeral?
10. How should judgment, relevance, humility, fidelity, anti-sycophancy, non-fatalism, analogy, actionability, uncertainty, and consequences be evaluated?
11. What can current models demonstrably do, and where do they remain unreliable?
12. What is the fastest defensible MVP and the reversible path to a scalable architecture?

## Non-negotiable boundaries

- Write only in this research directory.
- Do not modify application code, product-authority documents, `source_vault`, Supabase, external services, or Git state.
- Do not spend money, contact institutions, accept licences, publish material, or weaken TLS.
- Preserve source identity, edition, language, tradition, geography, period, rights lane, uncertainty, and claim-level evidence.
- Treat scripture, commentary, translation, scholarship, official/current material, and living practice as different evidence roles.
- Treat every wisdom pattern as a revisable Devam synthesis with scope, derivation, counterevidence, reviewers, and version.
- Do not expose or persist hidden chain-of-thought. Store only selected evidence, decision-relevant context, outcome, uncertainty, and a concise inspectable rationale when consent permits.
- Use Postgres-first, reversible structures until evaluation demonstrates a need for a more complex component.

## Evidence standard

Each evidence-register entry records:

- stable ID, title, authors or institution, date, evidence date, URL and DOI when available;
- source class: primary research, systematic or strong peer-reviewed review, standard or official documentation, primary tradition source, scholarly interpretation, living-practice authority, practitioner convention, or programme inference;
- concrete finding relevant to a research question;
- limitations, population/domain boundary, and replication or validity concerns;
- direct architecture or evaluation implication;
- confidence: high, medium, or low, based on source quality and directness rather than model confidence.

Claims will be labelled as **established evidence**, **promising method**, **convention/design choice**, or **programme inference**. A citation count is not a quality measure.

## Baselines and falsification

The default baseline is a strong hybrid grounded-RAG system: query classification, full-text plus vector retrieval, metadata filtering, reranking, source/claim/procedure routing, explicit context prompts, conflicting evidence, response constraints, and claim-level citations.

An added layer is retained only if blinded scenario evaluation shows a meaningful improvement on its claimed target without unacceptable regressions in factuality, tradition fidelity, latency, inspectability, or editorial burden. Initial decision thresholds are hypotheses to validate:

- at least +0.30 standard deviations or +8 percentage points on the layer's primary rubric dimensions over the strong baseline;
- no more than 2 percentage points worse on material factual/procedural errors or scope violations;
- no increase in severe false-authority, fatalism, harmful prescription, fabricated-source, or universalization failures;
- evidence links and scope can be reconstructed without hidden reasoning;
- recurring editorial cost is proportionate to the measured user benefit.

If evidence is underpowered, mixed, or scenario-dependent, the result is `UNPROVEN`, not success. Native graph, causal, argument, rule, cognitive, and neuro-symbolic components start rejected-by-default and must earn inclusion.

## Research method

1. Build a dated, primary-source-oriented evidence registry.
2. Define observable capabilities and failure modes before choosing architecture.
3. Produce alternative architectures and explicit testable predictions.
4. Construct representative and adversarial scenarios across exact retrieval, ritual, festival context, story, comparison, personal guidance, ambiguity, and reflection.
5. Run reproducible local thought experiments and lightweight retrieval/planning comparisons without paid calls or external mutation.
6. Red-team cultural flattening, unverifiable synthesis, overconfidence, preachiness, irrelevance, sycophancy, fatalism, and complexity.
7. Freeze an MVP recommendation only after a strong-RAG comparison and schema/API review.
8. Record rejected alternatives and the evidence that would justify revisiting them.

## Decision gates

- **G1 — Definition:** measurable wisdom-supporting behaviours and disqualifying failures are explicit.
- **G2 — Evidence:** every material architecture claim is supported or labelled inference.
- **G3 — Baseline:** the strong grounded-RAG comparator is credible, not a straw man.
- **G4 — Representation:** source claims cannot be overwritten by synthesis; scope/conflict/counterevidence are representable.
- **G5 — Retrieval:** each query class has a justified target and graceful-failure policy.
- **G6 — Deliberation:** competing views, affected perspectives, timescales, and uncertainty are considered without storing hidden reasoning.
- **G7 — Evaluation:** blinded scenarios can distinguish relevance, judgment, humility, fidelity, analogy quality, and actionability.
- **G8 — Simplicity:** every non-baseline component has evidence, a testable prediction, an owner, and a removal path.
- **G9 — Handoff:** the main MVP task receives self-contained schema/API sketches, decision table, experiments, open questions, and an integration sequence.

## Deliverable truth language

- **Recommended:** evidence and programme tests justify implementation.
- **Promising:** plausible and testable, but not yet demonstrated for Devam.
- **Deferred:** potentially useful after a named benchmark or scale trigger.
- **Rejected for MVP:** complexity or risk exceeds demonstrated benefit.
- **Open:** missing evidence or a material design uncertainty remains.

