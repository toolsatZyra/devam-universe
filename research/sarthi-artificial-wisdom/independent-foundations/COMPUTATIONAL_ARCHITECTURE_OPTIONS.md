# Computational architecture options for Artificial Wisdom

**Date:** 2026-08-07  
**Scope:** domain-independent comparison; no current Devam or Sārthi implementation is assumed  
**Decision rule:** an architecture earns complexity only when a defined wisdom function and measurable evaluation gain require it

## 1. Evaluation criteria

Candidate architectures are compared on functions derived from the construct theory, not on fashion or product fit.

| Criterion | Question |
|---|---|
| Representational adequacy | Can it distinguish evidence, claims, cases, procedures, models, values, outcomes, and uncertainty? |
| Relational abstraction | Can it discover and test structures and meta-patterns rather than match surface form? |
| Contextual judgment | Can it combine particulars with general knowledge and recognize exceptions? |
| Metacognitive control | Can it monitor competence, allocate effort, seek information, defer, or stop? |
| Normative legibility | Are values, rights, duties, authority, and conflicts visible and contestable? |
| Consequence reasoning | Can it model horizons, indirect effects, irreversibility, and counterfactuals with uncertainty? |
| Development over time | Can it learn safely from cases and outcomes without overwriting provenance or repeating failures? |
| Inspectability | Can an auditor reconstruct evidence, alternatives, assumptions, decision, and updates? |
| Epistemic diversity | Can competing models and dissent remain genuinely independent? |
| Rhetorical separation | Can persuasive expression be prevented from certifying judgment quality? |
| Legitimate governance | Can affected humans define authority, consent, constraints, appeals, and repair? |
| Current feasibility | Can a meaningful bounded version be built and evaluated with present methods? |

No architecture gets credit for claiming a capability in prose. It needs a mechanism and a test.

## 2. Option A: one monolithic learned model

### Form

A large multimodal/foundation model internalizes facts, patterns, cases, social norms, reasoning routines, and response style in its parameters. It may be prompted or fine-tuned to act wisely.

### Strengths

- broad statistical knowledge and flexible natural-language interpretation;
- powerful pattern completion, synthesis, analogy, explanation, and candidate generation;
- simple inference interface;
- shared representations can integrate signals that hand-built modules separate poorly;
- scale and general learning avoid brittle domain engineering.

### Limits

- parametric memory blurs source, version, rights, and epistemic status;
- values and conflicts are hidden in training and preference optimization;
- model confidence and verbal confidence are unreliable;
- same substrate generates, criticizes, and judges, creating correlated error;
- no intrinsic persistent record of actions and consequences;
- updating one belief or norm is difficult to scope;
- fluent response style is inseparable from perceived judgment;
- no legitimate authority follows from predictive training.

### Verdict

Necessary as a strong candidate substrate and baseline; insufficient as the whole architecture. “Fine-tune for wisdom” is not falsifiable until the construct and data-generation process are specified.

## 3. Option B: strong grounded generation or tool-using RAG

### Form

A model retrieves sources or queries tools, then answers with citations and explicit instructions.

### Strengths

- current, inspectable evidence;
- source/version updates without retraining;
- effective for exact facts, explanation, comparison, and many bounded procedures;
- simpler and cheaper than a large cognitive architecture;
- defines the correct null baseline for any extra layer.

### Limits

- retrieval relevance is not evidence sufficiency;
- passages do not encode applicability, cases, conflicts, outcomes, or disanalogies by default;
- synthesis can create unsupported bridging claims;
- no persistent outcome learning or value governance;
- context windows do not guarantee integration;
- retrieved popularity can reinforce majority/common-sense bias;
- it can produce a wise-looking answer from unrelated quotations.

### Verdict

Best baseline and likely sufficient for simple tasks. It supports wisdom but does not implement the proposed meta-competence.

## 4. Option C: prompt protocols, self-critique, and multi-agent debate

### Form

Prompts request perspectives, consequences, confidence, critique, reflection, debate, or a final judge. Multiple model calls may play roles.

### Strengths

- fastest way to test decomposition hypotheses;
- can improve coverage, surface alternatives, and reduce first-response errors;
- useful for generating candidate models and adversarial cases;
- low architectural commitment.

### Limits

- roles often share the same parameters, training data, and failure modes;
- intrinsic self-correction may not add information;
- a judge may prefer verbosity, position, or its own style;
- role-played perspectives can fabricate or stereotype stakeholders;
- hidden state and learning remain absent;
- prompt compliance can be mistaken for metacognition.

### Verdict

Use as experimental scaffolding and a baseline. Do not call it a wisdom architecture or treat repeated text generations as independent deliberators.

## 5. Option D: semantic, claim, or provenance graph

### Form

Nodes/records distinguish sources, passages, claims, entities, interpretations, warrants, scopes, conflicts, derivations, and versions; edges make relations explicit.

### Strengths

- inspectable provenance and contradiction;
- fine-grained retrieval of support, opposition, scope, and attribution;
- supports multiple interpretations without overwriting;
- useful bridge between documents and reasoning;
- can preserve derived insights separately from sources.

### Limits

- expensive and error-prone extraction/curation;
- ontology can encode one worldview or false precision;
- graph connectivity is not understanding or causation;
- inferred edges can become unearned authority;
- graph database technology is unrelated to whether the semantics help;
- does not decide values or actions.

### Verdict

A strong evidence/meaning substrate where query failures justify it. Use ordinary typed records first; benchmark semantics before specialized graph infrastructure.

## 6. Option E: case-based reasoning

### Form

Store structured situations, actions, rationales, outcomes, adaptations, and reviews. Retrieve related cases, adapt, test, and retain under governance.

### Strengths

- matches how practical judgment often reasons from precedent and experience;
- preserves particulars and outcome trajectories;
- supports “what happened in similar situations?”;
- naturally exposes exceptions and contextual difference;
- can accumulate domain expertise over time.

### Limits

- retrieval often follows surface similarity;
- cases are selected, narrated, and causally ambiguous;
- outcomes reflect luck and unobserved factors;
- past practice can reproduce injustice;
- automatic adaptation and retention can amplify model error;
- novel cases may have no responsible analogue.

### Verdict

High value for practical wisdom if cases include disanalogies, provenance, alternative explanations, and reviewed outcomes. It should never be the only reasoner.

## 7. Option F: analogical and structural mapping system

### Form

Represent relational structure explicitly, retrieve candidate source domains, align relations, score systematicity, project inferences, and test disanalogies.

### Strengths

- directly targets structural rather than surface transfer;
- offers a plausible mechanism for meta-pattern discovery;
- produces inspectable mappings and projected inferences;
- can explain why an analogy applies.

### Limits

- requires quality structured representations;
- retrieval of distant analogies remains difficult;
- structural fit does not establish causal or normative validity;
- high-order mappings can omit morally material attributes;
- combinatorics and representation choices are substantial.

### Verdict

One of the most distinctive long-term modules for insight and transfer. Start with structured comparison records and human-reviewed mappings before a full analogy engine.

## 8. Option G: pattern and counter-pattern library

### Form

Versioned abstractions link multiple cases, mechanism hypotheses, scope, counterexamples, predictions, and application notes.

### Strengths

- makes founder/investor/elder-style insights reusable and inspectable;
- supports retrieval at an explanatory level above isolated cases;
- can accumulate negative knowledge and boundary conditions;
- cheap compared with full causal or cognitive systems.

### Limits

- seductive slogans can be canonized;
- review authority and cultural scope are difficult;
- patterns can correlate without explaining;
- maintenance and retirement are necessary;
- retrieval may force every problem into a familiar template.

### Verdict

Promising middle layer if a pattern is a hypothesis bundle, not an aphorism. Must be tested against direct case retrieval and grounded RAG.

## 9. Option H: argument graphs and defeasible reasoning

### Form

Represent claims, premises, warrants, objections, rebuttals, undercutters, priorities, and competing acceptable sets.

### Strengths

- preserves disagreement and defeasibility;
- exposes why a conclusion holds and what defeats it;
- useful for normative, legal, interpretive, and contested evidence;
- separates argument acceptability from speaker charisma.

### Limits

- formal acceptability is not factual truth or moral legitimacy;
- natural-language argument extraction is lossy;
- weights, priorities, and semantics are themselves contestable;
- computational complexity can be high;
- users may not need a formal solver to benefit from explicit objections.

### Verdict

Use structured argument records early; defer automated acceptance semantics until tasks show a measurable need.

## 10. Option I: rule, policy, and constitutional systems

### Form

Explicit rules, priorities, permissions, prohibitions, exceptions, and escalation policies constrain generation or action.

### Strengths

- transparent, testable hard boundaries;
- deterministic enforcement for clear cases;
- legitimate policy can be versioned and audited;
- valuable for rights, authority, privacy, and safety gates.

### Limits

- rules conflict, under-specify particulars, and go stale;
- exceptions can swallow principles;
- learned classifiers may hide interpretation under apparent rules;
- compliance is not morality or wisdom;
- a constitution can encode the preferences of its authors without legitimacy.

### Verdict

Essential for selected hard constraints and escalation, dangerous as a complete moral reasoner.

## 11. Option J: causal, temporal, and counterfactual models

### Form

Structural causal models, event/temporal graphs, simulations, or identified statistical models represent mechanisms, interventions, trajectories, and counterfactuals.

### Strengths

- distinguishes observation from intervention;
- supports consequence and policy reasoning;
- makes assumptions explicit;
- can identify when effects are not estimable;
- vital for learning from outcomes rather than anecdotes.

### Limits

- life domains rarely offer known causal graphs or randomized evidence;
- human behavior changes under intervention;
- moral consequences may be unmeasured or incommensurable;
- simulations can create false confidence;
- many “causal narratives” are only hypotheses.

### Verdict

Use only where a scoped model is defensible. Else store causal hypotheses and uncertainty, not causal edges presented as fact.

## 12. Option K: world-model and model-based agent

### Form

A learned environment model predicts future states under actions; a planner evaluates rollouts and acts, often with memory and online feedback.

### Strengths

- integrates perception, prediction, planning, and consequence learning;
- supports long horizons and hypothetical action;
- can adapt to an environment rather than answer isolated prompts;
- provides a basis for agency over time.

### Limits

- model error compounds through rollouts;
- objective specification remains the core problem;
- social/moral worlds are partially observed and reflexive;
- exploration can harm;
- learned state representations may omit dignity, rights, or meaning.

### Verdict

Important for autonomous domains with feedback. For human guidance, constrain to decision support and explicit hypotheses until model validity and authority are established.

## 13. Option L: classical integrated cognitive architecture

### Form

Architectures such as Soar, ACT-R, LIDA, or related systems integrate memories, perception, goals, rules, learning, attention, and action selection.

### Strengths

- explicit theory of component interaction and timescales;
- inspectable state and learning mechanisms;
- avoids treating text generation as all cognition;
- decades of lessons about memory, attention, skill, and control.

### Limits

- architectures model or pursue intelligence, not legitimate values or wisdom;
- knowledge engineering and integration are difficult;
- no architecture has demonstrated general human cognition, much less wisdom;
- biological plausibility does not guarantee ethical adequacy;
- replacing each component with an LLM can turn it into theatrical modularity.

### Verdict

Use their functional decomposition and experimental discipline; do not adopt an entire architecture by analogy alone.

## 14. Option M: neuro-symbolic hybrid

### Form

Neural models handle perception, language, retrieval, and flexible pattern learning; symbolic/structured components handle provenance, constraints, arguments, causal models, or planning.

### Strengths

- matches the mixture of fuzzy interpretation and exact governance;
- makes selected knowledge and decisions inspectable;
- permits component-level updates and tests;
- can use foundation models without granting them sole authority.

### Limits

- interface semantics are hard;
- errors can be laundered from neural extraction into symbolic certainty;
- hybrid systems are operationally complex;
- symbolic parts may be decorative while the model makes real decisions;
- no general proof that hybrids outperform end-to-end learning.

### Verdict

The most plausible technical family, but only if each boundary has an independently tested purpose and uncertainty is preserved across it.

## 15. Option N: continual- and meta-learning architecture

### Form

The system adapts its learning rules, representations, policies, or memory from distributions of tasks and sequential experience.

### Strengths

- targets transfer and learning-to-learn;
- can develop fast adaptation and select strategies;
- necessary for longitudinal improvement rather than static answers;
- potentially relevant to meta-pattern discovery.

### Limits

- meta-objectives encode the designer's task distribution and values;
- catastrophic forgetting and interference persist;
- feedback can be delayed, manipulated, or normatively wrong;
- online value learning can drift or reward dependence;
- provenance and rollback are not native to many approaches.

### Verdict

Long-term requirement for genuine developmental performance. Near term, reviewed external memory and versioned offline learning are safer substitutes.

## 16. Option O: metacognitive controller or “wisdom governor”

### Form

A controller monitors uncertainty, novelty, stakes, conflicts, authority, irreversibility, and capability limits; it selects reasoning modes, tools, perspectives, clarification, deferral, escalation, or action.

### Strengths

- directly realizes the proposed causal core;
- separates object-task capability from regulation;
- can route simple cases cheaply and complex cases carefully;
- supports explicit stop and non-action options;
- makes capability boundaries and escalation testable.

### Limits

- risks merely renaming the intelligence that solves the whole task;
- monitoring signals may be generated by the same fallible substrate;
- it needs normative rules to judge stakes and admissibility;
- routing errors can prevent the right evidence or expert from being consulted;
- a checklist controller can create slow, verbose pseudo-wisdom.

### Verdict

Core hypothesis, not a solved component. It must beat fixed prompting and strong RAG specifically on routing, calibration, severe errors, and proportionality.

## 17. Option P: multi-objective decision and robust control

### Form

Options are evaluated across multiple values, stakeholders, horizons, uncertainty sets, hard constraints, regret, and reversibility rather than one reward.

### Strengths

- makes trade-offs explicit;
- supports Pareto screening, robust satisficing, option value, and tail-risk controls;
- resists accidental collapse into one utility score;
- well suited to consequence-sensitive prudence.

### Limits

- choosing objectives, metrics, constraints, and weights is normative governance;
- incommensurable values cannot always be calculated;
- model uncertainty may dwarf optimization precision;
- conservative robustness can block justified action;
- quantitative display can create false legitimacy.

### Verdict

Useful decision discipline within the governor. It cannot determine the good or replace deliberation and authority.

## 18. Option Q: multi-agent or collective-intelligence institution

### Form

Different agents or people contribute evidence, expertise, perspectives, forecasts, critique, and decisions through debate, voting, markets, panels, or adjudication.

### Strengths

- can pool distributed knowledge and surface dissent;
- permits specialization and independent validation;
- supports affected-party participation and legitimacy;
- no single model must be trusted globally.

### Limits

- herding, groupthink, polarization, strategic behavior, and power;
- aggregation answers prediction better than moral legitimacy;
- identical agents are correlated, not diverse;
- responsibility can diffuse;
- costly and slow.

### Verdict

Necessary for high-stakes legitimacy and broad expertise, but use structured independence, dissent, and accountable adjudication—not “more agents” by default.

## 19. Option R: human–AI joint wisdom system

### Form

AI retrieves, organizes, compares, simulates, checks, and explains; humans provide lived context, values, consent, responsibility, and final judgment under defined authority.

### Strengths

- combines machine scale/consistency with human legitimacy and experience;
- supports decision augmentation without metaphysical machine-wisdom claims;
- enables participatory domain instantiation;
- allows human correction and repair.

### Limits

- automation bias and synthetic charisma can displace human judgment;
- humans may rubber-stamp or strategically misuse the system;
- responsibility can be falsely attributed back to “the AI”;
- expert/affected-party access may be unequal;
- joint performance needs evaluation, not separate component scores.

### Verdict

The most defensible near-term system boundary. It requires interface and governance designed to preserve agency, disagreement, and accountability.

## 20. Comparative decision table

Ratings are qualitative research priors: **H** strong fit, **M** partial/conditional, **L** weak/not native. They are not empirical scores.

| Option | Insight/meta-pattern | Judgment | Values/legitimacy | Outcome learning | Inspectability | Current feasibility | Principal danger |
|---|---:|---:|---:|---:|---:|---:|---|
| Monolithic model | H | M | L | L | L | H | fluent hidden synthesis |
| Grounded RAG | M | M | L | L | M/H | H | retrieval mistaken for judgment |
| Prompt/debate | M | M | L | L | M | H | correlated theatre |
| Claim/provenance graph | L/M | M | M | M | H | M/H | ontology as truth |
| Case-based reasoning | M | H | M | H | H | M | precedent bias |
| Structural analogy | H | M | L | M | H | L/M | elegant false analogy |
| Pattern library | H | M | M | M/H | H | M/H | aphorism canonization |
| Argument graph | M | H | M/H | L/M | H | M | formal acceptability ≠ truth |
| Rules/constitution | L | M | M/H if legitimate | L | H | H | rigid or author-biased norms |
| Causal/temporal model | M | H where valid | L | H | H | L/M | causal overclaim |
| Learned world model | H | H | L | H | L/M | M | objective/model error |
| Cognitive architecture | M/H | M/H | L | M/H | H | L/M | complexity without wisdom |
| Neuro-symbolic hybrid | H | H | M | H | M/H | M | interface laundering |
| Continual/meta-learning | H | H | L | H | L/M | L/M | drift and reward corruption |
| Wisdom governor | M | H | M/H | M/H | H | M | renamed unexplained competence |
| Robust multi-objective | L | H | M | M | H | M | quantified normativity |
| Collective institution | H | H | H if governed | H | M/H | M | power, conformity, diffusion |
| Human–AI joint system | H | H | H potential | H | H potential | H | automation bias |

## 21. Architectural conclusions

### No single option is sufficient

- Learned models provide flexible intelligence and generativity.
- Retrieval and structured evidence provide grounded knowledge.
- cases and structural comparison provide experiential and analogical reasoning;
- patterns provide reviewed abstraction;
- causal/temporal models provide bounded consequence reasoning;
- rules and argument structures provide explicit constraints and conflict;
- a metacognitive controller provides proportional orchestration;
- outcome memory provides development;
- humans and institutions provide legitimacy and responsibility.

This does **not** imply building every module. It defines a functional menu.

### The simplest defensible sequence

1. Start with a strong model plus grounded evidence and explicit uncertainty.
2. Add a small metacognitive routing/decision record and charisma-separated renderer.
3. Add reviewed cases/outcomes where the task genuinely depends on particulars.
4. Add versioned patterns only after multiple cases and counter-cases justify abstraction.
5. Add argument or causal formalism only for tasks where ordinary structured records fail.
6. Add online learning or autonomous action only after authority, rollback, and outcome evaluation exist.

### The long-term family

The best-supported direction is a **governed neuro-symbolic, case- and outcome-learning, human–AI cognitive institution**. Its center is not a “wisdom model,” but a metacognitive governance loop that can recruit different representations and agents while preserving provenance, normative legitimacy, and responsibility.

This recommendation remains a hypothesis until it outperforms the monolithic-model and grounded-RAG baselines under the same evidence, model, time, and token budgets.
