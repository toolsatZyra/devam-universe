# Sarthi wisdom-support architecture

## Status and claim boundary

This document is Devam's application architecture for testing whether Sarthi can
support better human judgment. It is not a claim that an LLM, a database, or the
product possesses general or human-equivalent wisdom.

The accepted product claim is deliberately bounded:

> Sarthi is a source-grounded companion that should help a user understand what
> is relevant, compare attributable perspectives, and choose a proportionate
> next step while preserving uncertainty, context, and agency.

Any stronger claim must be earned for a named task family, evidence snapshot,
model and population through held-out evaluation against strong grounded
retrieval.

## Relationship to the general research architecture

The independent-foundations study defines a General Artificial Wisdom
Architecture (GAWA) as a falsifiable research framework. Sarthi does not define
that general theory; it is one domain instantiation. It supplies a role and
authority charter, evidence and terminology boundaries, task/risk routes,
tradition and regional applicability, legitimate sources of expertise,
affected-party and consent considerations, and an evaluation population.

GAWA's governance, epistemic, experiential, abstraction, cognitive,
metacognitive, and interaction planes are audit questions, not seven deployed
services. The MVP implements only the smallest components that outperform the
same-model, same-evidence grounded baseline. See
`SARTHI_WISDOM_RESEARCH_INTEGRATION_REVIEW_2026-08-07.md`.

## Governing principle

Wisdom is not a storage tier above knowledge. For Sarthi it is a hypothesis about
coordinating distinct capabilities well:

- evidence retrieval and deterministic computation;
- context and applicability;
- expertise and authority boundaries;
- comparison of interpretations, options and consequences;
- uncertainty, correction and restraint; and
- concise, natural communication that preserves user agency.

Sources, claims, procedures, interpretations, cases, pattern hypotheses and
runtime decisions are different record families. They are not ascending levels
of truth. A source can be uncertain; a reviewed synthesis can be useful while
remaining Devam-derived; and a generated response never becomes knowledge merely
because it sounds insightful.

## Lean runtime architecture

```text
request + explicit conversational context
    -> thin request planner
    -> exact retrieval | deterministic tool | reviewed procedure | bounded guidance
    -> evidence coverage, applicability and conflict checks
    -> concise response renderer
    -> sources, alternatives and rationale on demand
```

The thin request planner is an inspectable control function, not a second agent
or an oracle. It records only operational facts:

- task class and decision impact;
- authority ceiling;
- context explicitly supplied by the user or confirmed profile;
- the one or more missing fields that could materially change the answer;
- required evidence types and allowed routes;
- required validators;
- coverage and material conflicts;
- answer mode and stop condition; and
- policy, evidence and capability versions where applicable.

It never stores or exposes private chain-of-thought.

## Route contract

| Request | Primary owner | Minimum evidence | Normal mode | Fail-closed behaviour |
|---|---|---|---|---|
| exact fact, passage or attribution | source/claim retrieval | published product-compatible claim and exact evidence identity | direct | state what is missing; never fill with model memory |
| Panchang date or timing | deterministic calendar service | location, timezone, rule/convention and calculation version | direct or conditional | ask the material parameter; never guess |
| ritual applicability or vidhi | reviewed procedure resolver | applicability, timing, ordered steps, materials/substitutions, variants and evidence | direct, conditional or clarify | provide only a supported bounded lane and name the gap |
| festival or story explanation | source-labelled narrative and claim retrieval | witness/source role, scope and material variants | direct or plural | do not synthesize one universal origin or version |
| comparison | parallel evidence bundles | matched dimensions, asymmetric gaps and non-equivalence | plural or clarify | do not rank by prestige or retrieved volume |
| personal guidance or moral ambiguity | bounded guidance route | present context, evidence, affected parties, alternatives, constraints and uncertainty | conditional, options, clarify or defer | generic first-result retrieval is insufficient |
| reflection | source-grounded lens selected with the user | attributable lens, assumptions and agency-preserving next step | concise reflection | do not become an oracle or manufacture certainty |

Sarthi asks a question only when plausible answers to that question would change
the applicable evidence, date, procedure, material action or important
consequence. It does not turn ordinary conversation into an intake form.

The implemented guidance evidence remains deliberately bounded. The first
bundle covers a second turn in career-family tension; the second covers
recurring anger after immediate danger has been excluded; the third covers
an explicit request for a gentle grief reflection; and the fourth covers an
immediate dependent-care need versus work the user says can safely wait. All are English/Hindi,
reference exact GRETIL Bhagavadgita source units by ordinal, literal marker,
byte/line span and hash, and render no private commentary text. The grief route
also requires an explicit opt-in to a source or religious lens and rejects any
claim that scripture proves grief should stop. The work-care route derives
priority from affected-party urgency and safe deferral rather than assigning
universal or gendered family duty. These syntheses preserve agency and practical
context. They are examples of the accepted thin architecture,
not evidence of general wisdom or broad personal-guidance coverage.

The first moral-ambiguity bundle separately covers a competent adult dependent
who explicitly refuses religious participation under family pressure. It asks
age, capacity, dependency, refusal and safety context before applying the lane,
then requires acknowledgement and non-retaliation. This is Devam's product-level
agency boundary; cited passages remain optional counsel lenses and are not
presented as legal authority or a universal resolution of child, capacity or
family-duty questions.

The second moral-ambiguity bundle covers forgiveness language when harm is
continuing and renewed access or reconciliation is requested. It keeps inner
release, forgiveness, trust, contact, access and reconciliation as separate
decisions; it never makes renewed access the price of virtue. Bhagavadgita 6.5,
12.13-14, 17.15 and 18.63 are exact source-bound optional lenses for one
protective action, compassion without contact, a brief non-humiliating boundary
and considered choice. Reconciliation remains conditional on safety,
accountability, demonstrated change and free consent. The route does not
diagnose abuse or replace emergency, legal, safeguarding, mental-health or
trusted human support.

The truth-versus-protection pilot demonstrates a different architectural rule:
not every wise response should retrieve scripture. An abstract question about
lying to protect family first asks what harm is threatened, how immediate it
is, who is affected and whether safe non-disclosure is possible. A concrete
threat actor requesting a person's location routes directly to immediate human
safety: do not disclose the location, seek local help and do not confront the
threat. This is a thin-Governor product safety policy, not a universal doctrine
of truth, deception, policing or law.

The proportional-giving bundle first asks whether essential household needs,
dependents, near-term commitments and an emergency margin are protected. Only
after genuine surplus is explicit does it use Bhagavadgita 17.20-22 and 18.63
as optional lenses on purpose, recipient, timing, respect, pressure, expected
return and considered choice. It prescribes no percentage, spending beyond
means, caste/status recipient ranking or promised merit. Essentials-first is an
affected-party Devam boundary, not a translation of those verses.

## Evidence and retrieval contract

The existing Postgres source, passage, claim, evidence, relationship and ritual
records are sufficient for the first implementation. Rights, publication state,
review state and applicability filter before generation.

Retrieval must declare its required evidence types before selecting a response.
The result records which types are present, missing or conflicting. A citation is
necessary but not sufficient: the cited material must also be applicable to the
user's question, tradition, place, time and purpose.

The smallest sufficient evidence set is preferred over a long undifferentiated
context dump. Exact and low-impact requests must stay fast.

## Guidance decision summary

Complex guidance may create a short-lived, consent-governed decision summary:

```ts
type SarthiDecisionSummary = {
  taskClass: string;
  decisionImpact: "ordinary" | "consequential" | "urgent";
  authorityCeiling: string;
  explicitContext: Record<string, string>;
  missingMaterialContext: string[];
  routes: string[];
  requiredEvidenceTypes: string[];
  presentEvidenceTypes: string[];
  materialConflicts: string[];
  affectedParties: string[];
  alternativesConsidered: string[];
  decisiveConstraints: string[];
  uncertainty: string[];
  answerMode: "direct" | "conditional" | "plural" | "clarify" | "unable_to_ground" | "escalate";
  stopCondition?: string;
};
```

This is an audit summary of system operations, not a claim to reveal the model's
causal reasoning. It is not persisted without the user's applicable consent.

## Ayurveda and other consequential guidance

Internal beta does not reject a whole topic merely because it is medical,
ritual, personal or consequential. Decision impact controls the required
evidence, context and validators rather than acting as a generic refusal label.

For Ayurveda, Sarthi may provide comprehensive attributable Ayurvedic guidance.
It must distinguish classical or living-practice guidance from modern clinical
evidence, understand whether the user wants a traditional or integrated answer,
ask only material questions, surface contraindications when supported, and name
urgent-care boundaries where they materially apply. It never invents efficacy,
diagnosis, dosage evidence or guaranteed outcomes.

## Cases, patterns and arguments

These are optional experimental capabilities, not MVP prerequisites.

- Use the internal name `reviewed_pattern_hypothesis`, not `wisdom_pattern`.
- A pattern hypothesis requires independent supporting cases, counterexamples,
  scope, a proposed mechanism or relation, review, version and retirement rule.
- A case requires roles, relationships, constraints, actions, consequences,
  interpretations and decisive disanalogies. A memorable sacred story is not a
  binding precedent for a present user.
- Generated cases, outcomes, interpretations and patterns never auto-promote.

Do not add case, pattern, argument, causal or native-graph infrastructure until
a same-model, same-evidence ablation shows a material held-out gain over the
simpler route.

## Evaluation contract

The first pilot freezes a compact scenario set before planner tuning. It compares
the current strong grounded baseline with:

1. material-context and route planning;
2. typed evidence requirements and coverage;
3. bounded guidance validation only where applicable; and
4. optional cases or pattern hypotheses only after a demonstrated residual gap.

Evaluate separately:

- source fidelity and unsupported material claims;
- applicability and procedural completeness;
- context sensitivity and unnecessary questions;
- conflict and variant preservation;
- affected-party and consequence awareness;
- calibration, reversibility and correction;
- agency, anti-sycophancy and anti-dependence;
- cultural and tradition fidelity;
- actionability and proportion; and
- concise companion quality, latency and cost.

Hard failures are never hidden by an aggregate score. LLM judges can help triage
but cannot be the sole promotion authority. Cases and scenarios must control for
verbosity, warmth and confident rhetoric.

The current forty-scenario fixture verifies deterministic route classification
only. Before Sarthi claims improved judgment, a separate 60-100 scenario pilot
must freeze complete evidence bundles and answer-level baselines. It includes
paired context changes, counterexamples, Hindi and English, direct answers,
clarifications, options, deference and abstention. Blinded review compares the
same model and evidence across grounded RAG, prompt-only guidance,
context/coverage routing and the thin Governor. Warmth, fluency and answer length
are controlled so charisma cannot counterfeit wisdom.

## Accepted, pilot, deferred and rejected

### Accepted now

- strong grounded retrieval as the default;
- deterministic ownership for Panchang and other computable facts;
- thin request planning and expected-value clarification;
- typed evidence requirements, applicability, conflict and coverage;
- direct, conditional, plural, clarify, unable-to-ground and escalation modes;
- bounded operational decision summaries; and
- task-specific evaluation against a simpler baseline.

### Pilot only after baseline measurement

- relational cases with explicit disanalogies;
- reviewed pattern hypotheses and counter-patterns;
- candidate-and-critic guidance passes; and
- consented outcome feedback.

### Deferred

- native graph database;
- argument or causal engines;
- full cognitive architecture;
- multi-agent debate as a default route; and
- longitudinal institutional learning.

### Rejected

- one universal artificial or Indic wisdom ontology;
- automatic dharma resolution or commentary harmonization;
- a scalar wisdom score or prestige-based authority score;
- web-scraped living practice treated as normative truth;
- exposed or stored hidden chain-of-thought;
- automatic learning from private conversations; and
- engagement, deference or perceived profundity as the objective.

## Product voice

Sarthi remains a knowledgeable friend rather than an academic paper. The normal
answer gives the useful point or next step first. Sources, alternatives, deeper
reasoning and uncertainty are expandable or introduced when they materially
change the answer. More information is not automatically a better conversation.

## Research basis and status

The completed programme under `research/sarthi-artificial-wisdom/` is accepted
as a falsifiable integration specification, not a release certificate. Its
synthetic probes demonstrate representation and routing mechanisms only. They
do not establish Sarthi efficacy, cultural legitimacy, user benefit or general
artificial wisdom.

The research artifacts and this integration decision are reviewed in
`SARTHI_WISDOM_RESEARCH_INTEGRATION_REVIEW_2026-08-07.md`. The accepted research
status does not promote cases, patterns, outcome learning, argument graphs,
causal models, multi-agent debate or a native graph database. Each remains an
optional experiment with a deletion rule.
