# Ganesha source-ingestion pilot

## Selected source boundary

The pilot ingests the existing Ambuda electronic transcription of
*Śrīgaṇapatimantrākṣarāvaliḥ*, based on the 1961 Government Oriental
Manuscripts Library *Stotrārṇavaḥ* edition.

Two already-retained, content-addressed representations are registered by
reference:

- TEI XML: 13,176 bytes, SHA-256
  `21e5909392249ecca6677410c30d70323402d886975df807df2b865697fd9e6d`;
- plain-text derivative: 8,866 bytes, SHA-256
  `0014abc7b9f0d9fcf46f959ee6b604d203a9c822fd0e708064305c25a9f239b8`.

No source payload was copied into the repository, build, database, or Supabase
Storage. `source_objects.storage_backend=local_vault` points to the one retained
object for each hash. The private `devam-source-objects` bucket exists for a
future controlled migration and currently contains zero objects.

## Rights and completeness boundary

The retained TEI header states: “Distributed by Ambuda under a Creative Commons
CC0 1.0 Universal Licence (public domain).” The current official Ambuda item page
repeated that CC0 label on 2026-08-06. Rights are therefore stored as
`derivative_allowed`.

Rights clearance is not a completeness claim. The retained gap says the exact
edition structure has not been independently reconciled. All work, expression,
edition, and passage rows remain in `review`; the precise database status is
`observed_32_units_structure_authority_unresolved`.

## Deterministic citation compilation

The compiler at `tools/compile_source_vault_tei_ingestion.py`:

1. rechecks the vault summary and every selected/evidentiary object hash;
2. validates the TEI and exact license literal;
3. requires exactly 32 `<lg n>` elements with literal markers 1–32;
4. binds each unit to exact source byte and line coordinates;
5. hashes every raw TEI span;
6. extracts searchable Sanskrit text while excluding embedded editorial
   `noteAnchor` labels, without replacing or rewriting the immutable TEI; and
7. emits idempotent SQL in five bounded transactions without writing a duplicate
   corpus artifact.

Fixities:

- ingestion packet SHA-256:
  `11a92e0c6421adc8a73104d4e8c2c22b86e28b02f24e0dc5888e8df8f8f2e97c`;
- complete compiled SQL SHA-256:
  `8078b17cb25895c5408082e00458ed03a7cd08fa2e2e98bc7907feaa3f297a0a`;
- passage content root SHA-256:
  `e06617a3527217c8b50c8da80c2f246a9c1703175e3733f21dd4bb911ad7474e`.

## Hosted verification

Supabase independently returned:

- 1 work, 1 expression, 1 edition;
- 2 exact source-object records;
- 32 passages, ordinals and literal markers 1–32;
- ordered, non-overlapping byte coordinates;
- the exact passage content root above;
- all passage and source rights/status fields exact;
- zero uploaded source payloads.

Publishable-key REST checks returned HTTP 401 for `source_objects` and `passages`
and HTTP 200 for the published Atlas. Supabase's security advisor returned no
findings after ingestion.

## Next boundary

Private source upload requires a server-only Supabase secret key in a controlled
ingestion worker. The app documents this as `SUPABASE_SECRET_KEY`, never exposes
it with a `NEXT_PUBLIC_` prefix, and does not currently possess it. Until that
credential path is deliberately configured, the verified local source vault
remains the authoritative byte store.
