# Devam workspace instructions

## Start here

1. Read `docs/PRODUCT_BRIEF.md`.
2. Read `docs/ARCHITECTURE.md` and `docs/IMPLEMENTATION_PLAN.md`.
3. Read `docs/CLEANUP_REPORT.md` when source-vault integrity or legacy provenance matters.
4. Treat `source_vault/summary.json`, `objects.jsonl`, `provenance-map.jsonl`, and `catalogs/` as the retained source-data baseline.

The former Track A/Track B release system, G0-G9 gates, immutable rejected lineages, duplicate readers, release tuples, clean rebuilds, generated databases, and old checklist statuses were intentionally retired on 2026-08-06. Do not recreate or treat them as authorities.

## Product priorities

1. Devam is the umbrella product: an exhaustive library and knowledge universe for Sanatana Dharma, Indian culture, and Indian wisdom.
2. Sarthi is the conversational guide. The Living Atlas is the explorable 2.5D world. Search/exact retrieval is the third door.
3. The primary user is an ordinary Hindi- or English-speaking Indian consumer, not a scholar. Complete, engaging stories and useful living-practice guidance are the default product and acquisition priority.
4. The consumer MVP requires a beginning-to-end Ramayana and Mahabharata narrative backbone; Ramcharitmanas daily reading; Hanuman Chalisa; the Ganesha, Durga/Navaratri/Durga Puja, and Diwali/Deepavali hero worlds; and the complete September-December Panchang and ritual layer.
5. Sanskrit originals, editions, verse counts, citations, textual variants, rights, provenance, and uncertainty remain essential internal grounding. They do not dominate the normal interface and appear only when deliberately requested or materially necessary.
6. Build a useful end-to-end MVP quickly while wider story, scripture, place, history, yoga, meditation, temple, festival, and ritual expansion continues under one explicit coverage inventory.

## Lean engineering rules

- Keep one immutable copy per unique source hash. Never duplicate source payloads into builds, tests, readers, or releases.
- Store large source bytes outside the app code path; `source_vault` is a local restored baseline pending object-storage migration.
- App repositories contain code, schemas, compact manifests, migrations, and tests—not copied corpora or generated indexes.
- Prefer simple, reversible implementations. Add validation in proportion to product risk; do not rebuild the retired proof bureaucracy.
- Use Supabase/Postgres first: relational entities, relationships, claims, evidence, PostGIS, pgvector, and full-text. Add a native graph database only after benchmarks prove the need.
- Panchang outputs must be deterministic, location-aware, and tradition-aware; never guessed by an LLM.
- Sarthi is concise and natural by default, grounded in Devam evidence, and reveals citations/alternatives on demand or when materially necessary.
- A retained or indexed source is not a consumer story. Story completion requires a beginning-to-end sequence of meaningful story moments in approachable English and Hindi, with enough narrative detail to preserve action, motivation, consequence, character and place continuity.
- Acquire one lawful, suitable language expression when both English and Hindi are unavailable; create and label the missing Devam translation later rather than blocking acquisition or pretending the translation is a source original.
- A date card or remembrance-only companion is not a completed ritual lane. Use
  `docs/RITUAL_AND_OBSERVANCE_PRODUCT_CONTRACT.md`: applicability, meaning and
  source-labelled stories, typical practice and timing, actionable vidhi,
  materials/substitutions, variants, and evidence are the completion boundary.
- Wisdom patterns are derived, evidence-linked, scoped, counterexample-aware,
  versioned Devam syntheses. They never replace sources or justify unsupported
  certainty. Follow `docs/SARTHI_WISDOM_ARCHITECTURE.md`.
- Rights are lane-specific: product-cleared, internal-only, or catalogued lead. Restricted possession is not product clearance.
- Use AI research and source-aligned translations for internal/beta scale, with citations, labels, and automated contradiction/omission checks.
- Optimize the responsive browser/PWA for high-quality smartphones and desktop, adapting assets to variable bandwidth without reducing the premium experience to a low-end baseline.
- Do not contact institutions, spend money, accept licences, publish restricted material, or mutate external services without explicit authorization.
- Use `apply_patch` for manual code/config/document edits. Never weaken TLS.

## Source-vault maintenance

- Run `python tools/lean_cleanup.py verify` before source migration or destructive source maintenance.
- `source_vault/catalogs/source-leads.csv` is a non-authoritative discovery catalog derived from the old 6,545-row checklist. Its legacy IDs are retained only for traceability.
- `source_vault/provenance-map.jsonl` maps retained bytes to their former paths. Old paths and statuses do not imply current product readiness.
- New acquisitions should enter a content-addressed object store with source, edition, language, representation, provenance, rights, and fixity metadata.
