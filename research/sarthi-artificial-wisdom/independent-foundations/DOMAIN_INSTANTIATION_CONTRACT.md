# Domain Instantiation Contract

**Date:** 2026-08-07  
**Purpose:** separate the general Artificial Wisdom architecture from every vertical application  
**Principle:** a domain pack supplies knowledge, practices, values, risks, authorities, and evaluations; it does not redefine intelligence or wisdom to fit its current software

## 1. What the general architecture supplies

GAWA supplies domain-independent functions:

- problem qualification and risk routing;
- typed evidence, claims, cases, patterns, values, and outcomes;
- separation of generation, validation, selection, and rendering;
- metacognitive effort, clarification, deferral, and escalation;
- conflict, uncertainty, reversibility, and consequence handling;
- versioned decision records and outcome learning;
- capability manifests;
- human governance, appeals, and repair hooks;
- evaluation interfaces and charisma controls.

It does **not** supply:

- the domain's truth sources;
- legitimate moral or professional authority;
- local meanings of flourishing, harm, expertise, or correct practice;
- product-clear rights to source or case material;
- a universal ontology;
- an automatic right to give or execute advice;
- evidence that a model is competent in the domain.

## 2. Required domain-pack components

### D1. Purpose and role charter

Specify:

- user need and intended benefit;
- whether the system is librarian, tutor, analyst, coach, companion, professional tool, recommender, or agent;
- tasks explicitly in scope;
- tasks and authority explicitly out of scope;
- claim ceiling: informative, advisory, decision support, or authorized action;
- how the role differs from a licensed professional, teacher, elder, religious authority, fiduciary, or friend;
- unacceptable dependency or authority relationships.

### D2. Epistemic constitution

Specify what counts as evidence and how warrant varies:

- primary sources, observation, experiment, testimony, commentary, professional consensus, living practice, precedent, case report, statistical model;
- source/authority hierarchies if legitimate, including exceptions and dissent;
- reliability and recency policies;
- interpretation and translation rules;
- fact versus norm versus convention versus disputed view;
- conflict resolution and abstention;
- rights, consent, provenance, and representation fidelity.

### D3. Domain ontology and language

Define only the vocabulary needed for tasks:

- entities, processes, roles, relations, procedures, contexts, outcomes;
- source-native concepts that should not be flattened into generic English;
- synonymous-looking terms that must remain distinct;
- contested classifications;
- jurisdiction, tradition, school, practice lineage, population, or institutional scope;
- multilingual terminology and translation status.

### D4. Task and risk map

For each task:

- input and user intent;
- required context;
- evidence and capability route;
- known failure modes;
- risk tier and reversibility;
- authority and escalation;
- output form and required uncertainty;
- follow-up/outcome requirements.

### D5. Expertise map

Specify:

- what demonstrated performance constitutes expertise;
- subdomains and transfer limits;
- valid versus low-validity feedback environments;
- credential, experience, community-recognition, and outcome evidence;
- conflicts of interest;
- when multiple expert traditions must be represented;
- when lay or affected-party experience is indispensable.

### D6. Values and legitimacy charter

Specify:

- protected rights and hard constraints;
- professional, cultural, religious, civic, or organizational commitments;
- affected communities and authority over interpretation/use;
- plural values and known conflicts;
- decision owner;
- appeal and change process;
- what the system must never infer from popularity or user preference;
- how dissent and minority positions are preserved.

### D7. Case and outcome protocol

Specify:

- what makes a case sufficiently thick and representative;
- consent, privacy, de-identification, retention, and access;
- decision/action/outcome separation;
- outcome horizons and stakeholder perspectives;
- causal-identification limits;
- negative cases, near misses, and harms;
- review and correction;
- automatic-retention prohibition or criteria.

### D8. Pattern protocol

Specify:

- minimum cases and comparisons for proposal;
- counterexample and cross-context search;
- mechanism versus correlation label;
- prediction/decision-usefulness test;
- reviewer and affected-party review;
- maturity transitions;
- expiry, retirement, and fork;
- prohibited universalization.

### D9. Capability registry

For each model, tool, engine, or human route:

- exact version;
- competent and excluded tasks;
- evaluation evidence;
- calibration and abstention;
- input/output contract;
- cost/latency/privacy;
- independence from other validators;
- allowed risk tiers;
- rollback.

### D10. Evaluation constitution

Specify:

- scenario families and population/culture slices;
- objective, expert, affected-party, and user outcomes;
- severe failures;
- baselines and matched budgets;
- reviewer composition, blinding, agreement, and preserved disagreement;
- longitudinal endpoints;
- deployment gates and stop conditions;
- monitoring and incident response.

## 3. Machine-readable manifest sketch

```yaml
domain_pack:
  id: example-domain
  version: 0.1.0
  effective_date: YYYY-MM-DD
  owners:
    governance_body: []
    source_custodians: []
    affected_party_representation: []

role:
  description: ""
  in_scope: []
  out_of_scope: []
  claim_ceiling: information_only | advisory | decision_support | bounded_action
  prohibited_authority_claims: []
  dependency_boundaries: []

epistemology:
  evidence_kinds: []
  warrant_profiles: []
  source_priority_rules: []
  interpretation_profiles: []
  conflict_policy: ""
  provenance_contract: ""

ontology:
  schema_version: ""
  protected_native_terms: []
  contested_terms: []
  scopes: []
  languages: []

tasks:
  - id: ""
    risk_tier: 0
    required_context: []
    retrieval_targets: []
    capabilities: []
    hard_constraints: []
    escalation: []
    output_contract: ""
    follow_up: ""

normative_governance:
  commitments: []
  rights: []
  authority_model: ""
  dissent_policy: ""
  appeal_process: ""

experience:
  case_schema: ""
  consent_policy: ""
  outcome_horizons: []
  review_policy: ""
  generalization_policy: ""

patterns:
  proposal_threshold: ""
  required_counterevidence: []
  maturity_states: []
  promotion_authority: []

evaluation:
  baseline_ids: []
  suite_versions: []
  severe_failures: []
  deployment_gates: []
  stop_conditions: []
```

## 4. Domain task contract

Every task gets one row before architecture work.

| Field | Required question |
|---|---|
| `task_id` | What stable task is being solved? |
| user/decision owner | Who asks and who legitimately decides? |
| object of judgment | Fact, explanation, action, interpretation, norm, forecast, or reflection? |
| minimum context | Which missing variables can materially flip the result? |
| evidence route | Which source, claim, procedure, case, pattern, model, or expert is competent? |
| epistemic risks | What can be false, stale, conflicted, or unidentifiable? |
| normative risks | Which values, rights, duties, or authorities conflict? |
| action risks | Stakes, urgency, reversibility, affected parties, and tail harm? |
| response modes | Answer, ask, explore, recommend, stage, defer, abstain, or escalate? |
| inspectability | What must be visible to the user/reviewer? |
| evaluation | What would show improvement over grounded assistance? |
| follow-up | Which outcomes, corrections, or repairs are required? |

## 5. Example portability test

The same general functions should instantiate differently.

| Function | Clinical decision support | Investment decision support | Cultural/religious guide |
|---|---|---|---|
| primary evidence | trials, guidelines, patient data | filings, audited data, market/reference classes | primary texts, commentaries, histories, living practice |
| expertise | validated clinician performance | domain track record with survivorship controls | scholar/practitioner competence by tradition/language/practice |
| values | health, autonomy, justice, consent | fiduciary duty, risk, goals, legality | truth, tradition fidelity, user agency, plural practice, non-authority |
| cases | de-identified clinical trajectories | decisions with ex-ante forecasts and outcomes | context-rich observance/guidance cases with consent and standpoint |
| causal model | treatment effect with population fit | uncertain/reflexive economic mechanisms | often interpretive/historical; avoid false causality |
| authority | licensed professional/patient | investor/fiduciary/regulator | user, community/tradition authorities; companion not guru |
| hard failure | unsafe diagnosis/treatment | unsuitable or undisclosed-risk advice | fabricated citation, flattened tradition, divine/guru claim |
| follow-up | health outcome/adverse event | forecast/portfolio outcome and changed conditions | understanding, practice outcome, correction, dependency risk |

If the general architecture cannot support these differences without redefining itself, it is not domain-general. If a shared module treats these rows identically, it is probably overgeneralizing.

## 6. Instantiation workflow

### Phase 0 — legitimacy and role

Establish domain owners, affected-party participation, claim ceiling, and prohibited uses before collecting intimate cases or giving guidance.

### Phase 1 — strongest simple baseline

Implement exact tools and grounded source retrieval. Evaluate task slices. Do not build patterns for problems that source retrieval solves.

### Phase 2 — context and qualification

Add a domain task classifier, material-context card, risk/authority routing, uncertainty, and auditable response summary.

### Phase 3 — practice and conflict

Add validated procedures, scoped claims, conflicting interpretations, and a small reviewed case/outcome set for tasks that need particulars.

### Phase 4 — insight and patterns

Propose abstractions only from multiple cases plus counter-cases; test prospective transfer and harm before promotion.

### Phase 5 — longitudinal learning

Collect consented outcomes, recalibrate, revise at the correct level, and run repair/appeal processes. Keep online changes bounded and reversible.

### Phase 6 — bounded action if ever appropriate

Only after explicit authority, safety evidence, monitoring, rollback, and accountability. Advice does not imply action permission.

## 7. Acceptance checklist

A domain pack is not ready unless:

- [ ] role and authority are explicit;
- [ ] evidence and interpretation rules are source-grounded;
- [ ] rights and use conditions are known;
- [ ] domain-native terms and disagreements are preserved;
- [ ] expertise criteria measure performance, not prestige alone;
- [ ] case/outcome data have consent, privacy, and causal caveats;
- [ ] patterns require counterexamples and prospective tests;
- [ ] severe failures and escalation are declared;
- [ ] current capabilities are versioned and evaluated;
- [ ] strong grounded assistance is a live baseline;
- [ ] affected-party review and appeal exist where needed;
- [ ] user-facing language respects the claim ceiling;
- [ ] rollback and retirement are possible;
- [ ] “wisdom” is not used as a substitute for validation.

## 8. Architectural independence test

Before accepting any domain-specific addition, ask:

1. Is this a universal function, a reusable optional module, or a domain artifact?
2. Would an unrelated domain need the same semantics?
3. Does the addition solve a measured task failure?
4. Could a simpler source, procedure, case, or policy field solve it?
5. Does the domain's current database or UI make the idea seem more fundamental than it is?
6. Is a tradition-specific concept being stripped of meaning to fit a general ontology?

Universal functions belong in the architecture. Reusable but non-universal functions belong in optional modules. Knowledge, values, and practice semantics belong in the domain pack. Implementation conveniences belong nowhere in the theory.
