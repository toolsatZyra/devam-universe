# Decision Record V2

**Date:** 2026-08-07  
**Scope:** independent artificial-wisdom research and Sārthi instantiation  
**Decision status:** research recommendation; implementation requires experimental validation

## D-01 — Separate the general solution from Sārthi

**Decision:** Define constructs, theory, architecture, and evaluation independently. Treat Sārthi as one domain pack governed by the Domain Instantiation Contract.

**Reason:** Starting from the current product architecture imported existing storage and delivery assumptions into the definition of wisdom.

**Rejected:** Derive the general architecture from Devam's current six-layer Sārthi design.

## D-02 — Replace the strict DIKW ladder with a capability lattice

**Decision:** Data, information, evidence, knowledge, understanding, intelligence, expertise, insight, rationality, metacognition, common sense, morality, prudence, judgment, charisma, compassion, and wisdom receive separate operational definitions and dissociation tests.

**Reason:** These constructs are partially independent. High intelligence need not imply morality, expertise, or wise judgment; charisma can counterfeit all of them.

**Rejected:** Wisdom as simply the next storage layer above knowledge or as meta-pattern detection alone.

## D-03 — Define wisdom as context-sensitive meta-competence

**Decision:** Use the provisional definition in `CONSTRUCT_TAXONOMY.md`: wisdom coordinates framing, relevant relationships and meta-patterns, evidence, expertise, insight, rationality, common sense, moral concern, and prudence toward proportionate, corrigible action or restraint under uncertainty.

**Reason:** It captures what major psychological and philosophical theories share without equating wisdom with a single trait, factual knowledge, virtue, or utility function.

**Rejected:** One universal scalar score; purely epistemic wisdom; purely moral wisdom; success or wealth as a proxy; eloquence as a proxy.

## D-04 — Adopt a claim ladder

**Decision:** Distinguish attributed wisdom, wisdom-related performance, a validated wise system in a bounded domain, and lived/agential wisdom.

**Reason:** Current evidence can test behaviors but does not establish consciousness, character, or human-equivalent sagehood.

**Rejected:** Marketing a model as wise based on dialogue impressions or benchmark averages.

## D-05 — Use GAWA as an experimental framework, not a monolith

**Decision:** Organize governance, epistemic, experiential, abstraction, cognitive, metacognitive, and interaction functions, but allow the simplest implementation to omit planes that fail ablation.

**Reason:** No single existing architecture solves wisdom; a modular hypothesis permits independent tests and deletion.

**Rejected:** Immediate construction of a comprehensive cognitive architecture, native graph platform, autonomous multi-agent society, or self-learning agent.

## D-06 — Make the Wisdom Governor a bounded control mechanism

**Decision:** The Governor classifies stakes, authority, missing context, uncertainty, reversibility, affected parties, and capability needs; it chooses a direct, clarification, deliberation, deference, or escalation route.

**Reason:** The distinctive engineering problem is coordination and restraint, not just generation.

**Qualification:** The Governor does not solve the value problem and cannot govern itself infallibly. It remains policy-bound, inspectable, challengeable, and empirically tested.

## D-07 — Separate generation, validation, selection, and rendering

**Decision:** Candidate generation must not also serve as its sole factual, analogical, normative, or safety validator.

**Reason:** Fluent rationalization and correlated model failure create false confidence.

**Rejected:** Exposed or stored hidden chain-of-thought. Persist only concise operational decision summaries and provenance.

## D-08 — Use typed, provenance-bearing memory

**Decision:** Keep source/evidence, semantic claims, procedures, cases/outcomes, patterns, normative commitments, capabilities, and deliberation summaries as distinct record types.

**Reason:** Their authorities, uncertainty, update rules, privacy, and failure modes differ.

**Rejected:** One undifferentiated vector store; automatic promotion of generated syntheses or user conversations into knowledge.

## D-09 — Demote “wisdom patterns” to hypotheses

**Decision:** Internally treat each pattern as a `reviewed_pattern_hypothesis` until it demonstrates held-out transfer beyond grounded RAG.

**Reason:** Naming a recurring abstraction “wisdom” risks canonizing editorial preference and unverifiable synthesis.

**Required evidence:** independent cases, mechanism or structural relation, scope, counterexamples, predictions, version, review, and retirement condition.

## D-10 — Make cases relational and outcome-aware

**Decision:** Store roles, relationships, constraints, actions, consequences, interpretations, and disanalogies—not merely narrative summaries or embeddings.

**Reason:** Surface similarity is a major source of persuasive but invalid advice.

**Rejected:** A memorable story as direct precedent; synthetic case outcomes as observed evidence.

## D-11 — Represent values and authority explicitly

**Decision:** Domain packs declare product commitments, represented traditions, legitimacy sources, stakeholders, and deference boundaries. Normative conflicts remain visible.

**Reason:** Artificial wisdom cannot be value-neutral; hidden value choice is less defensible than contestable value choice.

**Rejected:** One universal moral constitution presented as discovered truth; probability arithmetic that fabricates precision across moral theories.

## D-12 — Treat common sense and charisma as hazards as well as capabilities

**Decision:** Scope common-practice evidence by culture and population, audit it for exclusion, and test charisma through style-controlled evaluation, trust calibration, and dependency measures.

**Reason:** Social common sense can reproduce prejudice, while eloquence and warmth can counterfeit wisdom.

## D-13 — Keep the strongest grounded RAG baseline first

**Decision:** Exact facts and low-risk questions route directly to sources, deterministic services, and strong grounded generation. Add context, cases, patterns, arguments, causal tools, or deliberation only when task/risk and evaluation justify them.

**Reason:** Artificial-wisdom research fails if it rewards architectural ceremony.

**Removal rule:** Any layer that does not improve held-out outcomes or hard gates enough to justify its cost is removed.

## D-14 — Evaluate vectors, gates, and outcomes—not one score

**Decision:** Measure grounding, applicability, context, perspective, analogy, uncertainty, rationality, morality, proportionality, actionability, humility, agency, consequence quality, correction, tradition fidelity, and charisma susceptibility. Maintain severe-failure gates and report disagreement.

**Reason:** Aggregates conceal catastrophic trade-offs and embed arbitrary weights.

**Rejected:** LLM judge alone; satisfaction alone; citation rate alone; model self-confidence.

## D-15 — Make the sociotechnical system the primary long-term unit

**Decision:** The scalable target is a human–AI cognitive institution with explicit accountability, review, community challenge, and outcome learning.

**Reason:** High-impact wisdom claims require legitimacy, experience, and responsibility that a model invocation does not possess.

**Qualification:** Institutional structure can also create bureaucracy and power concentration; it must be evaluated and governed.

## D-16 — Sārthi is a companion domain pack

**Decision:** Sārthi inherits the general architecture and supplies a culturally specific epistemic constitution, ontology mappings, expertise, cases, pattern hypotheses, values/legitimacy charter, risk map, and evaluation constitution.

**Reason:** This preserves generality and makes domain-specific authority visible.

**Hard boundaries:** no guru/divine authority, deterministic Panchāṅga ownership, reviewed ritual procedures, no karma blame or fate certainty, no silent canon formation, and no automatic learning from private conversations.

## D-17 — Claim only what has been demonstrated

**Decision:** Near-term claims use “validated wisdom-support capability for [task/population/version].” “Artificial wisdom” remains the programme hypothesis.

**Reason:** The architecture has not established lived, general, or autonomous wisdom.

## D-18 — Preserve decisive open questions

No architectural decision closes these questions:

- whether wisdom is distinct from general intelligence plus legitimate values;
- whether embodiment and lived concern are constitutive;
- how to measure plural flourishing over long horizons;
- how cultural representation earns legitimacy at scale;
- how to prevent relational dependence on persuasive companions; and
- whether cases, patterns, and simulated consequences provide causal value beyond good prompting and retrieval.

They remain explicit research tracks and falsification targets.
