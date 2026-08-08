# Adversarial objective review — 2026-08-07

## Objective tested

Build the world's most exhaustive useful library and knowledge universe for
Sanatana Dharma, Indian culture, and Indian wisdom; make it explorable through
the Living Atlas, exactly retrievable through Search/API, and actionable through
Sarthi. Optimize for a fast, credible end-to-end MVP without shrinking the
long-term “all under one roof” ambition.

## Verdict

The lean reset, one-copy source vault, evidence model, deterministic Panchang,
Supabase-first architecture, and working product vertical are aligned with the
objective. The current implementation has nevertheless drifted in two material
ways:

1. ritual coverage often measures the presence of a date and a safe devotional
   companion rather than whether a user can understand and perform the relevant
   practice; and
2. Sarthi is largely retrieval plus bounded response routing, while the product
   promise requires a separately modelled and evaluated layer of contextual
   judgment, patterns, counterexamples, and actionable insight.

These are product-completeness gaps, not reasons to restore the retired proof
bureaucracy or add a native graph database.

## Evidence of drift

A static audit of the pre-correction `knowledge_packs/rituals` directory found 39 JSON
packs, 80 guides, 240 duration tiers, 836 steps, and 338 material entries. Yet
there is no common top-level schema for applicability, significance, origin
story, typical practice, timing, procedure, variants, and user-facing FAQs.
Those ideas sometimes appear in bespoke nested prose, but their presence and
quality cannot be evaluated consistently.

Many bounded guides deliberately exclude fasting, formal puja, mantra,
offerings, materials, closing actions, and local variants. Those exclusions can
be correct for a specific evidence packet, but a remembrance-only alternative
must not count as completion of the underlying ritual question.

The code also uses growing per-observance resolvers and hard-coded Sarthi
branches. This made the first vertical slice fast, but duplicating that pattern
for an exhaustive library would increase code, tests, and drift with every
festival.

## What remains valuable

- one immutable source object per unique hash and compact provenance;
- rights lanes and clear separation of source, translation, and synthesis;
- deterministic location-aware Panchang calculations;
- explicit regional and sampradaya boundaries;
- claim/evidence/relationship storage in Postgres;
- the responsive Living Atlas, Today, Search, and Sarthi vertical slice;
- concise answers with expandable sources and alternatives; and
- honest incomplete status.

None of these should be deleted or rebuilt.

## What to stop or retire

- Stop calling a date card, three duration tiers, or a safe reflection companion
  a completed ritual lane.
- Stop creating one bespoke TypeScript integration path per new observance once
  the common content contract and renderer exist.
- Stop treating a long list of denials as a substitute for positive, sourced,
  useful content.
- Do not build an ontology of every conceivable wisdom concept before one
  evaluated Sarthi wisdom vertical proves the schema.
- Do not add a native graph database, duplicate source bytes, or recreate
  immutable release/clean-rebuild bureaucracy without a demonstrated product
  need.

## Corrective sequence

1. Adopt `RITUAL_AND_OBSERVANCE_PRODUCT_CONTRACT.md` as the completion boundary.
2. Classify every existing ritual pack as calendar-only, story-only,
   participation companion, bounded vidhi, or user-complete lane. Existing files
   remain useful evidence; their status changes rather than being discarded.
3. Replace bespoke pack shapes with one versioned schema and a generic
   validator/compiler/renderer. Migrate the most important launch lanes first.
4. Make one launch observance genuinely user-complete: applicability, timing,
   significance, source-labelled stories, typical practice, materials,
   actionable vidhi appropriate to the named lane, accessible variant, regional alternatives, and
   citations.
5. Apply that pattern to the complete September-December inventory and the four
   hero universes, prioritizing user demand and launch relevance.
6. Implement the first Sarthi wisdom vertical described in
   `SARTHI_WISDOM_ARCHITECTURE.md`; benchmark it against ordinary grounded RAG.
7. Continue the exhaustive library acquisition stream independently, using the
   same source, edition, language, rights, and completeness principles.

## First corrective closure

The first four corrections are now implemented for one exact lane. The audit
classifies 40 packs without inferring completion from the 39 legacy shapes. The
new `DEVAM_RITUAL_OBSERVANCE_CONTENT_V1` schema and validator accept exactly one
user-complete lane: Bengal Shakta Maha Ashtami on 19 October 2026 for a
community/temple/family-puja participant or accessible remote participant. A
generic fixity-checked compiler serves it in Today, Sarthi, Search, and the
practice API. Its positive completion claim is restricted to that participant
scope; priest-led rites, household consecration, universal Bengali practice,
live venue schedules, and the wider Durga universe remain open.

## Success test

For a representative user in Bengal asking about Ashtami, or a user in
Karnataka asking about Saraswati Puja, Devam should select the relevant lane,
state the applicable date and timing, explain the meaning and attributable
stories, describe what the community typically does, provide a coherent
household or participation procedure, respect family and institutional
authority, and reveal sources or other variants only when useful.

For a personal-life question, Sarthi should identify the real dilemma, retrieve
relevant sources and cases, distinguish analogy from difference, consider the
people and timescales affected, expose uncertainty, and give concise practical
guidance. A fluent generic answer or an isolated quotation is not enough.

This review supersedes completion interpretations that counted bounded
companions as full ritual coverage. It does not invalidate their source research
or code where those remain useful inputs to the corrected product contract.
