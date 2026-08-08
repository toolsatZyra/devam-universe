# MVP data foundation — implemented checkpoint

## Isolated Supabase project

- Project: `devam-universe`
- Project reference: `bucgdaunsuzithfigtmr`
- Organization: `Zyra`
- Region: `ap-south-1` (Mumbai)
- Created: 2026-08-06
- Cost approved by the product owner: USD 10/month

This is a new database. No pre-existing Supabase project, table, user, storage
object, credential, or application database was reused or mutated.

## Applied migrations

The repository's `supabase/migrations/` directory is the schema source of truth.
The hosted project has sixteen applied migrations:

1. `initial_devam_mvp_foundation` — 22 rights-aware, RLS-enabled tables;
2. `seed_living_atlas_preview` — the initial 11 product-owned preview nodes and 7 edges;
3. `harden_server_only_tables_and_fk_indexes` — explicit browser denials and
   complete foreign-key index coverage;
4. `add_source_storage_boundary` — private source-object storage contract;
5. `add_stable_knowledge_keys` — stable publication/upsert identities;
6. `add_public_knowledge_search_rpc` — narrowly bounded public exact retrieval;
7. `add_diwali_hero_gateway` — the fourth gateway, three connected places, and
   four product navigation edges; and
8. `adjust_diwali_mobile_atlas_position` — a presentation-only mobile placement
   correction for Pavapuri;
9. `add_devam_one_subscription_entitlements` — provider-neutral, owner-readable
   Devam One entitlement state behind RLS;
10. `make_living_atlas_nodes_explorable` — the first evidence-bound summaries,
    search routes, eras, and scope boundaries for the original preview nodes;
11. `sync_mvp_atlas_and_harden_public_search_owner` — the complete current
    40-row Atlas projection (four gateways plus 36 world nodes), 44 relationships,
    stable edge source IDs, and a least-privilege execution owner for public
    evidence retrieval; and
12. `restrict_public_search_to_anon_and_service_role` — removes unnecessary
    direct authenticated-role execution while retaining the server-rendered
    public route and maintenance access;
13. `add_public_source_passage_search_rpc` — adds edition-bounded exact passage
    retrieval for published product-compatible source text only; and
14. `grant_public_passage_search_document` — supplies the low-privilege search
    owner only the generated full-text column needed for ranking;
15. `correct_ganesha_tei_note_anchor_text` — replaces five published pilot
    passage rows with deterministic TEI text that excludes note-anchor labels
    from the quoted source text while leaving the immutable source untouched;
    and
16. `add_public_passage_completeness_context` — adds the source object's
    explicit structural-completeness status to every public exact-passage
    result without widening table or function access.

The hosted Atlas now matches the reviewed app graph: four gateways, 36
progressively revealed world nodes, and 44 relationships. Every world node has
eras, gateway, summary, reviewed search query, evidence boundary, visual size,
and product/publication state.

Supabase's security advisor now reports two intentional warnings for the
anon-facing `search_public_knowledge` and `search_public_passages`
`SECURITY DEFINER` RPCs. Both are owned by the same no-login, no-inherit,
no-`BYPASSRLS` role with column-limited grants and product-row RLS policies.
`anon` can execute only the two static bounded projections and cannot select
source objects, passages, or claim-evidence rows directly; `authenticated`
direct execution is denied. Exact-passage projection excludes `citation_only`
and every unpublished state across the passage and its work-expression-edition-
source hierarchy. The remaining performance notices are unused-index notices
expected before production traffic, plus an Auth connection-allocation
recommendation relevant only when the database instance is scaled.

## Data boundary

The canonical chain is `work -> expression -> edition -> source_object -> passage
-> claim_evidence -> claim`. Source objects retain SHA-256, byte count, provider,
provenance, completeness assessment, and a lane-specific rights basis. Generated
translations must use a separate expression and set `ai_generated=true`; they
never replace a source original.

Entities and evidence-bound relationships form the initial queryable graph inside
Postgres. Atlas nodes and edges are a product projection of that graph. A native
graph database is deliberately deferred until real traversal benchmarks show a
need Postgres cannot meet.

## Security boundary

- All 22 public-schema tables have RLS enabled.
- Grants and RLS policies are both explicit.
- Canonical source objects, passages, claim evidence, and Panchang calculation
  cache have explicit deny policies and no browser SELECT grant.
- Published product rows require a `product_allowed` or `derivative_allowed`
  rights lane.
- Profiles, conversations, memories, and saved items use `auth.uid()` ownership.
- Only a publishable key is configured locally. No service-role key is stored in
  the web application. Public search is verified through the Data API with that
  key while the underlying evidence tables remain browser-denied.

## Runtime seams

The Atlas page loads through an `AtlasRepository`. With Supabase environment
variables it reads the complete hosted 40-node/44-edge MVP projection; without
them it falls back to the same reviewed composition so UI development remains
available offline. A deterministic compiler keeps the hosted SQL seed
byte-derived from `apps/web/src/data/atlas.ts`.

`POST /api/panchang` validates the full deterministic input tuple (date,
coordinates, timezone, and tradition) and returns versioned sunrise/sunset,
vara, tithi, nakshatra, yoga, karana, transition, and daily-window calculations.
The implementation is validated against independently published September 2026
fixtures and fails closed when a calculation cannot be resolved. Festival
assignment and ritual guidance remain explicitly false until the separate,
tradition-aware evidence rules are implemented. See `PANCHANG_ENGINE.md`.

Search and Sarthi use published, rights-filtered hosted evidence RPCs when
Supabase is configured, while retaining reviewed local product lanes for
offline development. Claim retrieval suppresses exact text for citation-only
evidence. The separate exact-passage RPC returns only published
product/derivative passages from a fully published product-compatible source
hierarchy. Every passage result carries work, edition, locator, source and span
fixity, rights, text-status, and source-completeness context. A readable passage
therefore cannot be mistaken for proof that its edition or wider textual
tradition is complete. No route generates an ungrounded placeholder answer.

Generated Supabase TypeScript types are committed at
`apps/web/src/lib/supabase/database.types.ts`. The local `.env.local` is ignored;
`.env.example` documents the publishable configuration and the separately scoped,
server-only secret required for private evidence work.

## First ingestion pilot

The first source-ingestion pilot is complete for the CC0 Ambuda
*Śrīgaṇapatimantrākṣarāvaliḥ* transcription. It registers two local-vault source
objects and 32 exact TEI byte-span passages while retaining unresolved edition
completeness and `review` publication state. See `INGESTION_PILOT_GANESHA.md`.
