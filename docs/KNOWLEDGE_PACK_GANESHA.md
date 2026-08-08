# First Ganesha knowledge pack

## Product boundary

This checkpoint converts one verified Sanskrit source into reusable knowledge
for the Devam library, its relational graph, internal retrieval, and eventually
Sarthi. It is intentionally a source-bounded pilot. It is not complete Ganesha
coverage and it is not evidence that the Ganesha hero universe is launch-ready.

The combined Ganesha packs explicitly keep these priority gaps open:

- Ganapati Atharvashirsha edition/recension identity, variants,
  pronunciation/recitation context, and independent Sanskrit review (the exact
  Wikisource revision now has complete source-aligned English and Hindi Devam
  translations);
- an edition-identified Ganesha Purana recension with Hindi and English
  translations (the exact pinned Sanskrit Wikisource universe is now
  separately connected);
- Mudgala Purana;
- Ganesha narratives in major Puranas;
- Ganesh Chaturthi rules and regional procedures;
- Ashtavinayak temples and traditions;
- public Ganeshotsav history; and
- regional forms, family practices, and living traditions.

## Source and authored data

The source remains the already registered, content-addressed Ambuda TEI for
*Śrīgaṇapatimantrākṣarāvaliḥ*:

- 13,176 bytes;
- SHA-256 `21e5909392249ecca6677410c30d70323402d886975df807df2b865697fd9e6d`;
- ingestion packet SHA-256
  `11a92e0c6421adc8a73104d4e8c2c22b86e28b02f24e0dc5888e8df8f8f2e97c`;
- rights lane `derivative_allowed`;
- structure status `observed_32_units_structure_authority_unresolved`.

The authored pack is
`knowledge_packs/ganesha/shriganapatimantraksharavali-v1.json`:

- file SHA-256
  `492bafe94124f81de32acee6329b798fe09970eace160bdd1a9db646d5959d2d`;
- canonical pack SHA-256
  `18c7aa230668b2d8062ebc31c9b366eb43f000d2210a39d84a2761843e7e0596`;
- 3 entities and 12 multilingual names;
- 8 bilingual English/Hindi claims;
- 10 exact links to Sanskrit passage evidence;
- 2 claim-backed relationships; and
- 2 review-only, four-step reading guides in English and Hindi.

Every claim is labelled `this_source_only`, carries an uncertainty note, and is
compiled for beta publication. The reading guides remain bounded Devam
synthesis; their stored applicability explicitly sets
`formal_puja_vidhi=false`. Publication does not assert source-structure,
Ganesha-universe, or universal-practice completeness.

## Complete exact-revision Atharvashirsha translation layer

`knowledge_packs/ganesha/ganapatyatharvashirsha-devam-translations-v1.json`
adds a separate translation expression without copying or relabelling the
fixed Sanskrit source:

- 26,943 bytes; file SHA-256
  `92f2ed67e3b3ab48d2abf06cbbd44404c0c87fe22ed02d5731f8e0d5b236b4da`;
- semantic pack SHA-256
  `b6308ffbcc8898f9ee28c4db69a619f9fd83a486826651d5784545c2b88dbc6e`;
- translation content root
  `f1b0dfe955482c23ac80637cf2ac49a9e1cc83116a6e2162963cd87b321f9b5e`;
- all 16 fixed Sanskrit units aligned to English and Hindi, producing 32
  independently searchable translation claims and 32 exact passage links;
- explicit Devam attribution, CC BY-SA 4.0 derivative obligations, AI-assisted
  internal-beta review status, and `is_source_original=false`; and
- a low-confidence preserved variant boundary at unit 12
  (`ब्रह्माद्याचरणं` in the fixed source versus the circulated
  `ब्रह्माद्यावरणं` reading).

`tools/compile_ganapatyatharvashirsha_devam_translations_v1.py` rederives the
fixed source packet, all 16 source-span hashes, the bilingual unit universe,
rights and review fields, the variant boundary, and every completion denial.
Its five idempotent batches have SQL SHA-256
`c176c308b2615e8812668d0f1a8169a7857413511b51d830bfb9ddd5480c5335`.
Seven deterministic tests pass. Hosted exact-field verification passes with
32 distinct claims, 16 per language, all 16 ordinals, exact statement and
uncertainty roots, and zero applicability or evidence-contract violations.
The public RPC retrieves both English and Hindi translations with the exact
Sanskrit unit and revision coordinates.

This positive boundary is intentionally narrow: translation coverage is
complete only for Wikisource revision 415703. Independent Sanskrit human
review, the underlying print edition, recension identity, all textual variants,
pronunciation, ritual authority, promised outcomes, and the wider Ganesha hero
universe remain false.

## Deterministic compiler and schema

`tools/compile_source_bounded_knowledge_pack.py` independently revalidates the
original source-ingestion packet, source hash, 32 passage units, rights lane,
structure status, cited Sanskrit substrings, stable IDs, language coverage,
uncertainty boundaries, procedure steps, and the non-exhaustive coverage list.
It emits idempotent SQL and never inserts source objects or passages.

Compiler result:

- complete SQL SHA-256
  `1895b8fddd34c379ede7e0b78df8c51f07c40786d60e651d9928fddde1673658`;
- 6 bounded SQL batches;
- compiler tests: 4/4 pass, including a tampered-evidence failure test;
- combined source-ingestion, seven-work batch, and knowledge-pack Python tests:
  14/14 pass.

Migration `20260806072137_add_stable_knowledge_keys.sql` adds only:

- a required unique `claims.stable_key`;
- a generated/indexed claim search vector; and
- a required unique `ritual_procedures.slug`.

These are scale primitives for idempotent library expansion, not a new proof or
release bureaucracy.

## Hosted verification and current promotion boundary

The knowledge-pack SQL was applied twice. Counts remained exactly:

- 3 entities;
- 12 entity names;
- 8 claims;
- 10 claim-evidence links;
- 2 relationships;
- 2 procedures; and
- 8 procedure steps.

English full-text search for `obstacles` returns only the bounded English claim;
Hindi search for `विघ्न` returns only the bounded Hindi claim. Every evidence
link resolves to the pinned TEI source and contains its required Sanskrit text.
Those two hosted applications were the earlier review-state import. On
2026-08-06 the current six-batch compiler promoted the eight bounded claims,
their five cited passages, and the necessary product-readable metadata path in
the isolated `devam-universe` project. Post-apply counts are exactly 8 claims,
10 evidence links, 5 cited passages, 3 entities, 2 relationships, 2 reading
procedures, and 8 steps in their intended published lanes. The safe public RPC
returns the English obstacle claim with passage ordinals 12 and 31. The private
source bucket remains unnecessary for this pilot because source identity stays
anchored to the content-addressed vault and the database stores only indexed
passage rows.

The adjacent retained-source batch now adds seven more separately identified
Ganesha works, 14 source representations, and 80 exact Sanskrit passages. It is
documented in `GANESHA_COVERAGE_QUEUE.md`; it adds source coverage, not new
claims or a broad Ganesha-completeness assertion.

The Supabase security advisor reports no findings. The performance advisor only
reports expected informational unused-index notices for the new, nearly empty
database plus the Auth connection-allocation recommendation.

## Retrieval boundary

`apps/web/src/lib/repositories/supabase-knowledge.ts` is a server-only adapter
that searches the claim vector and reconstructs exact claim → passage → source →
edition → work evidence. It rejects non-retrievable rights lanes, non-review or
non-published rows, malformed locators, and evidence-free claims.

Sarthi now exposes a deterministic, source-bounded preview for this pack without
a paid generation dependency. The Atlas conversation panel can answer a narrow
set of English and Hindi Ganesha questions, disclose the exact retained passages
on demand, and fail closed outside the pack boundary. The implementation pins
the source and pack hashes and does not publish a complete corpus or claim a
universal Ganesh Puja vidhi. A secure model runtime and broader hybrid retrieval
remain later expansion steps, not prerequisites for testing the grounded product
loop.
