# Data model and provenance

**Date:** 2026-08-07  
**Status:** logical/API sketch only; not a migration

## 1. Design rules

1. Existing source, work/expression/edition, passage, claim, evidence, procedure, Panchang, entity, relationship, rights, publication, and user tables remain authoritative.
2. Source assertions are immutable in identity. Correction creates a superseding record or status change; it never rewrites source bytes or citation coordinates.
3. Derived cases and patterns are versioned objects with reconstructable derivation, review, counterevidence, and publication state.
4. Every relation with interpretive content can carry evidence, scope, and source role.
5. User-specific inference never becomes shared knowledge automatically.
6. JSONB is permitted for evolving dimensions, but high-value filters and integrity fields are typed columns.
7. A native graph database is not assumed.

## 2. Identity and version model

Use stable logical IDs plus immutable version IDs:

- `case_id` identifies the evolving case abstraction;
- `case_version_id` identifies one immutable version;
- `pattern_id` identifies an evolving pattern;
- `pattern_version_id` identifies one immutable version;
- relations and evidence links attach to version IDs;
- a published pointer identifies the current eligible version without deleting history.

Content digests cover canonical serialisation of the material fields and referenced-ID sets. A digest proves identity, not truth or acceptance.

## 3. Logical schema

Names and referenced core-table names are illustrative and must be reconciled with the actual Supabase schema before implementation.

### 3.1 Cases

```sql
create table wisdom_cases (
  case_id uuid primary key,
  stable_key text not null unique,
  case_kind text not null check (case_kind in (
    'textual','commentarial','historical','legal_social',
    'living_practice','synthetic_evaluation'
  )),
  created_at timestamptz not null,
  retired_at timestamptz,
  current_published_version_id uuid
);

create table wisdom_case_versions (
  case_version_id uuid primary key,
  case_id uuid not null references wisdom_cases,
  version integer not null,
  title jsonb not null,                 -- language -> title
  summary jsonb not null,               -- language -> bounded summary
  observed_dimensions jsonb not null,   -- source-supported event facts
  attributed_dimensions jsonb not null, -- named interpretations
  editorial_dimensions jsonb not null,  -- analyst coding, explicitly labelled
  uncertainties jsonb not null,
  do_not_analogise_when jsonb not null,
  scope jsonb not null,
  content_digest text not null,
  derivation_activity_id uuid not null,
  status text not null check (status in (
    'candidate','reviewed_internal','published','deprecated','rejected'
  )),
  valid_from timestamptz not null,
  valid_to timestamptz,
  supersedes_version_id uuid,
  unique (case_id, version)
);

create table wisdom_case_evidence (
  case_version_id uuid not null references wisdom_case_versions,
  evidence_kind text not null check (evidence_kind in (
    'supports_observation','supports_interpretation','contradicts',
    'qualifies','context','later_consequence','rights_limit'
  )),
  claim_id uuid,
  passage_id uuid,
  source_id uuid,
  interpretation_id uuid,
  case_role text,
  scope jsonb not null,
  note text,
  primary key (case_version_id, evidence_kind,
               claim_id, passage_id, source_id, interpretation_id)
);
```

Integrity rule: every non-synthetic case needs at least one exact source/passage or claim/evidence link. Synthetic evaluation cases must have `case_kind='synthetic_evaluation'` and are excluded from user evidence retrieval.

### 3.2 Case dimensions and similarity

Keep the dimension vocabulary compact and versioned:

```sql
create table wisdom_dimension_definitions (
  dimension_key text not null,
  schema_version integer not null,
  label jsonb not null,
  value_schema jsonb not null,
  retrieval_weight numeric,
  risk_notes text,
  status text not null,
  primary key (dimension_key, schema_version)
);
```

First-vertical dimensions:

- dilemma/question type;
- actors and affected parties;
- relationship/duty roles;
- power and consent;
- information available and hidden;
- constraints and reversibility;
- values/interests in tension;
- options/action;
- immediate and later consequences;
- named interpretations;
- material similarity features;
- disanalogy/transfer blockers.

Do not encode caste, gender, community, or spiritual status as a ranking feature. Sensitive attributes can be applicability facts only when evidence and product need justify them.

### 3.3 Patterns

```sql
create table wisdom_patterns (
  pattern_id uuid primary key,
  stable_key text not null unique,
  created_at timestamptz not null,
  retired_at timestamptz,
  current_published_version_id uuid
);

create table wisdom_pattern_versions (
  pattern_version_id uuid primary key,
  pattern_id uuid not null references wisdom_patterns,
  version integer not null,
  insight jsonb not null,               -- language -> concise lens
  mechanism_hypothesis jsonb,
  preconditions jsonb not null,
  exclusions jsonb not null,
  scope jsonb not null,
  interests_and_values jsonb not null,
  short_long_term jsonb not null,
  possible_actions jsonb not null,
  tradeoffs_and_cautions jsonb not null,
  competing_readings jsonb not null,
  unresolved_questions jsonb not null,
  derivation_method jsonb not null,
  content_digest text not null,
  derivation_activity_id uuid not null,
  status text not null check (status in (
    'candidate','reviewed_internal','published','deprecated','rejected'
  )),
  review_due_at timestamptz,
  valid_from timestamptz not null,
  valid_to timestamptz,
  supersedes_version_id uuid,
  unique (pattern_id, version)
);

create table wisdom_pattern_evidence (
  pattern_version_id uuid not null references wisdom_pattern_versions,
  evidence_role text not null check (evidence_role in (
    'supports','counterexample','limits','competing_interpretation',
    'background','safety_boundary'
  )),
  claim_id uuid,
  case_version_id uuid,
  passage_id uuid,
  interpretation_id uuid,
  relevance_note text not null,
  scope jsonb not null,
  primary key (pattern_version_id, evidence_role,
               claim_id, case_version_id, passage_id, interpretation_id)
);

create table wisdom_pattern_relations (
  from_pattern_version_id uuid not null,
  relation text not null check (relation in (
    'reinforces','limits','conflicts_with','specialises','applies_before',
    'applies_after','counterpattern_of'
  )),
  to_pattern_version_id uuid not null,
  evidence_claim_ids uuid[] not null default '{}',
  scope jsonb not null,
  note text,
  primary key (from_pattern_version_id, relation, to_pattern_version_id)
);
```

Publication constraint hypotheses:

- at least two supporting evidence objects if the record claims recurrence;
- at least one counterexample/limitation, or an explicit reviewer-approved reason none is known;
- non-empty scope, exclusions, competing readings, derivation, and review record;
- a passing evaluation-suite version;
- no unresolved critical review issue.

### 3.4 Interpretations and conflicts

Prefer existing claims/relationships if expressive enough. The minimum logical object is:

```json
{
  "interpretation_id": "int_...",
  "interprets": ["passage_...", "claim_...", "case_version_..."],
  "position": "bounded paraphrase",
  "attributed_to": "person/institution/text/tradition identifier",
  "source_role": "commentary|scholarship|living_practice|devam_synthesis",
  "scope": {
    "tradition": [], "place": [], "period": [], "language": []
  },
  "evidence_ids": ["..."],
  "status": "review|published",
  "uncertainty": []
}
```

Conflicts are n-ary when needed:

```sql
create table knowledge_conflicts (
  conflict_id uuid primary key,
  conflict_kind text not null check (conflict_kind in (
    'logical_conflict','scope_difference','source_variant',
    'interpretive_difference','practice_variation','freshness_conflict',
    'evidence_quality_difference','unresolved'
  )),
  proposition_refs jsonb not null,
  shared_scope jsonb not null,
  differing_scope jsonb not null,
  adjudication_status text not null,
  response_policy text not null check (response_policy in (
    'select_by_scope','present_variants','ask','defer','report_unresolved'
  )),
  evidence_ids jsonb not null,
  review_activity_id uuid not null,
  version integer not null
);
```

`adjudication_status` means editorial handling, not declaration that a theology is true.

### 3.5 Evaluations

```sql
create table wisdom_scenario_suites (
  suite_id uuid primary key,
  stable_key text not null,
  version integer not null,
  scope jsonb not null,
  rubric_version text not null,
  content_digest text not null,
  status text not null,
  unique (stable_key, version)
);

create table wisdom_scenarios (
  scenario_id uuid primary key,
  suite_id uuid not null references wisdom_scenario_suites,
  scenario_kind text not null,
  language text not null,
  user_turns jsonb not null,
  hidden_facts jsonb not null,
  required_context jsonb not null,
  expected_evidence_ids jsonb not null,
  acceptable_directions jsonb not null,
  unacceptable_behaviours jsonb not null,
  adversarial_variants jsonb not null,
  source_kind text not null check (source_kind in (
    'synthetic','consented_deidentified','expert_authored'
  ))
);

create table wisdom_evaluation_runs (
  run_id uuid primary key,
  suite_id uuid not null,
  system_variant text not null,
  model_config_digest text not null,
  retrieval_config_digest text not null,
  prompt_contract_digest text not null,
  started_at timestamptz not null,
  completed_at timestamptz,
  status text not null
);

create table wisdom_evaluation_results (
  run_id uuid not null references wisdom_evaluation_runs,
  scenario_id uuid not null references wisdom_scenarios,
  response_artifact_ref text not null,
  retrieved_evidence_ids jsonb not null,
  deterministic_checks jsonb not null,
  human_scores jsonb,
  llm_assist_scores jsonb,
  severe_failures jsonb not null,
  reviewer_disagreement jsonb,
  primary key (run_id, scenario_id)
);
```

Synthetic scenarios never enter retrieval indexes used to answer users.

### 3.6 Runtime trace

Persist only the minimum operational trace, subject to consent and retention:

```json
{
  "trace_id": "uuid",
  "thread_id": "owner-scoped-or-null",
  "query_class": ["personal_guidance"],
  "risk": "R4",
  "context_fields_used": ["language", "practice_region"],
  "clarification": {"asked": false, "reason_code": "stable_reversible_step"},
  "retrieval_plan_digest": "sha256:...",
  "selected_evidence_ids": ["..."],
  "gate_outcome": "answer_with_scope",
  "uncertainty_types": ["normative_underdetermination"],
  "model_config_id": "...",
  "verifier_results": {"citations": "pass", "scope": "pass"},
  "answer_ref": "owner-scoped-message-id",
  "short_decision_summary": "optional, consent-gated",
  "hidden_chain_of_thought": null
}
```

## 4. Provenance activity model

Use a lightweight W3C PROV-inspired entity/activity/agent model ([W3C PROV-O](https://www.w3.org/TR/prov-o/)) without requiring RDF storage.

### Entities

- source object/version;
- passage/claim/procedure;
- case version;
- pattern version;
- translation;
- evaluation suite/result;
- published retrieval configuration.

### Activities

- acquisition;
- transcription/OCR;
- segmentation;
- translation;
- claim extraction;
- editorial coding;
- case abstraction;
- pattern induction;
- adversarial review;
- evaluation;
- publication/deprecation.

### Agents

- named human or role-based reviewer;
- institution/source authority;
- software/tool version;
- model/provider/version plus prompt digest;
- automated validator.

Activity sketch:

```json
{
  "activity_id": "uuid",
  "activity_type": "pattern_induction",
  "started_at": "...",
  "ended_at": "...",
  "used_entity_ids": ["casev_1", "claim_2"],
  "generated_entity_ids": ["patternv_3"],
  "human_agent_ids": ["review_role_editor"],
  "software_agent_ids": ["tool_name@version"],
  "model_config": {
    "provider": "...",
    "model": "verified-current-model-id",
    "parameters": {},
    "prompt_digest": "sha256:...",
    "output_digest": "sha256:..."
  },
  "method": "documented bounded description",
  "limitations": ["..."]
}
```

Do not treat the presence of a human reviewer as proof that the content is correct; record review result and unresolved objections.

## 5. Scope object

Use one versioned schema across claims, cases, patterns, conflicts, and procedures:

```json
{
  "traditions": [],
  "sampradayas": [],
  "institutions": [],
  "geographies": [],
  "period": {"from": null, "to": null, "precision": "unknown"},
  "settings": ["household"],
  "family_practice_required": false,
  "life_stage": [],
  "languages": ["sa", "hi", "en"],
  "audience": ["general"],
  "exclusions": [],
  "scope_basis_evidence_ids": []
}
```

Empty does not mean universal. It means unknown unless an explicit `universal_claim_status` field has evidence and review. This single rule prevents a major class of flattening errors.

## 6. Evidence and confidence

Confidence is a property of a scoped assertion/evidence assessment, not a model feeling. Store components rather than one opaque score:

- source identity certainty;
- citation entailment status;
- edition/representation completeness;
- attribution certainty;
- translation review status;
- independent corroboration;
- conflict status;
- applicability evidence;
- freshness;
- reviewer status.

The product may derive a display label such as `strongly_supported`, `supported_with_scope`, `contested`, `incomplete`, or `unresolved`. Keep the derivation rule versioned.

## 7. Rights and access

Every retrieval path intersects:

- object possession right;
- internal processing right;
- product display right;
- quotation allowance;
- generated-translation allowance;
- living-practice consent/access terms;
- user ownership/RLS.

Citation-only evidence can return identity and coordinates but not exact text. A derived pattern supported partly by restricted evidence does not acquire the right to reveal that evidence or paraphrase it beyond allowed use.

Living-practice records need access policies that can express public, registered-user, internal-research, community-restricted, embargoed, withdrawn, and sacred/sensitive non-retrievable states.

## 8. Review and supersession

Every published case/pattern version records:

- author/editor roles;
- independent reviewer roles;
- objections and resolutions;
- evaluation-suite result;
- publication decision;
- `valid_from`, review due date, and triggers;
- superseded/deprecated reason;
- rollback target.

Triggers include new source acquisition, corrected translation, changed living practice/current guidance, material user complaint, evaluation regression, or discovered flattening/harm.

## 9. API sketches

### Internal planning request

`POST /internal/sarthi/plan`

```json
{
  "query": "...",
  "language": "en",
  "active_atlas_node": null,
  "session_context": {},
  "saved_context": {},
  "consent": {"personalisation": false, "persistence": false}
}
```

Response contains risk, classes, context used, clarification decision, typed retrieval plan, and gate prerequisites. It contains no answer or hidden reasoning.

### Internal evidence bundle

`POST /internal/sarthi/retrieve`

```json
{
  "plan_id": "...",
  "targets": ["claims", "cases", "patterns", "counterevidence"],
  "filters": {},
  "limits": {"claims": 8, "cases": 3, "patterns": 2}
}
```

Response groups objects by type and includes eligibility, scope, evidence, conflict, rights-projected text, and missing-required-targets.

### Product answer

`POST /api/sarthi`

```json
{
  "message": "...",
  "threadId": null,
  "language": "en",
  "context": {}
}
```

```json
{
  "answer": "concise response",
  "nextStep": "optional concrete action",
  "coverage": "grounded|grounded_with_scope|partial|unsupported",
  "uncertainty": [{"type": "...", "message": "..."}],
  "sources": [{"id": "...", "label": "...", "coordinate": "..."}],
  "alternativesAvailable": true,
  "whyAvailable": true,
  "followUp": "Would you like the other interpretation or the source passages?"
}
```

No raw case/pattern editorial JSON or restricted evidence is exposed by default.

## 10. Deliberate omissions

The MVP schema does not include:

- a universal value hierarchy;
- spiritual merit or karma score;
- user “wisdom score”;
- model self-confidence as trust;
- persisted hidden reasoning;
- automatic pattern induction/publication;
- general argumentation semantics;
- structural causal models for life outcomes;
- a native graph database;
- a vector embedding as the canonical identity of a claim or case.

