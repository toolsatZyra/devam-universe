# Parallel library authoring contract

## Purpose

Devam expands its consumer library through several isolated authoring lanes
without creating duplicate stories, competing entity identities, contradictory
ritual instructions, or direct edits to the shared product graph.

This contract governs the first five lanes:

1. epics and integration;
2. Ganesha;
3. Devi;
4. Diwali/Deepavali; and
5. the ritual calendar.

It is a lean coordination layer, not a replacement for the source vault, the
consumer-content contract, the ritual contract, or the Postgres knowledge
model. It does not recreate retired Track A/Track B proof machinery.

## One brief serial checkpoint, then parallel work

All authoring lanes start from the same accepted coordination commit in
isolated Git worktrees. A lane may read the whole repository but writes only to
its exclusive paths in
`knowledge_packs/inventories/parallel-library-work-v1.json`.

The epics-and-integration lane is the sole owner of:

- the central consumer coverage inventory;
- the canonical consumer-anchor registry;
- accepted cross-lane relationship resolution;
- shared Atlas or application projection data;
- Supabase migrations; and
- combined release counters.

The four content lanes submit complete lane-owned packs and cross-link
proposals. They do not edit shared projections or another lane's records.

## Consumer unit and completeness

The story moment is the canonical consumer unit. Sequence, character, place,
timeline, Search, Sarthi and Atlas views derive from the same moment rather than
receiving separately authored retellings.

Before prose is written, every lane freezes a denominator:

- a long source expression is structurally reconciled from beginning to end;
- every source unit maps to a story moment or an explicitly reviewed
  compression range;
- a story family without one finite source gets an explicit selected-scope
  inventory;
- a festival or ritual is divided into named applicability lanes; and
- a temple or modern place record separates current fact, history, sacred
  narrative, archaeology and living belief.

`complete` is permitted only inside that named denominator. A selected
expression, festival lane or story family never stands for civilizational
completeness.

Consumer stories must be approachable in English and Hindi and substantial
enough to preserve action, motivation, consequence, character and place
continuity. One-line summaries, source counts and graph nodes are not story
coverage.

## Source and research policy

Model knowledge may accelerate discovery, initial inventories, alias finding,
draft structure and omission checks. It is not final evidence.

- Use fixed beginning-to-end source expressions for epics and long works.
- Use bounded primary-source expressions for Puranic stories when lawful and
  suitable; otherwise create an explicitly labelled multi-source Devam
  synthesis.
- Use current authoritative web research for living temples, visitor facts,
  institutions and schedules, with a freshness boundary.
- Use multiple appropriately scoped sources for living festival and ritual
  practice. A popular blog or one institution does not establish what all
  Indians do.
- Keep generated English or Hindi as a labelled Devam translation rather than
  a source original.
- Keep source identity, rights, provenance, uncertainty and material variants
  internally attached while leaving them out of normal consumer chrome.

## Canonical anchors and lane-local identities

`knowledge_packs/inventories/canonical-consumer-anchors-v1.json` reserves the
small set of shared identities needed by two or more lanes. It is deliberately
not a complete civilizational entity registry.

A content lane may create any number of lane-local IDs beneath its exclusive
directory. When another lane needs one of those identities, it refers to a
canonical anchor or submits an unresolved cross-link target. It must not create
a competing copy.

Aliases do not establish identity. In particular:

- an observance is not the deity it honours;
- textual manifestations, divine names and living traditions are not silently
  collapsed into `same_as`;
- one regional festival association is not a universal origin; and
- narrative geography, living belief, current geography and attested history
  remain different claim scopes.

## Cross-link proposals

Every lane writes its proposed relationships to a lane-owned JSON pack that
conforms to `schemas/cross-lane-link-proposal-v1.schema.json`.

Each proposal names:

- a stable proposal ID;
- a canonical or lane-local source and target;
- a typed predicate and relationship family;
- directionality;
- a plain-English and Hindi consumer label;
- the exact geographic, traditional, temporal or expression scope;
- one or more evidence references;
- confidence and target-resolution state; and
- `proposed` integration status.

The predicates `related_to`, `same_as`, `is_form_of` and `origin_of` are
prohibited in authoring-lane proposals because they erase the distinctions most
likely to corrupt this library. A lane must state the narrower relationship it
can actually support. The integration lane may later resolve identity only
through an independently reviewed canonical decision.

Unresolved targets are valid. Invented placeholder entities are not.

## Ritual boundary

There is no finite, universal list of "all Hindu rituals" and no safe default
called "what the majority of India does." The ritual-calendar lane builds an
explicit inventory and completes one applicability lane at a time.

Every complete lane follows
`docs/RITUAL_AND_OBSERVANCE_PRODUCT_CONTRACT.md`: applicability, deterministic
timing dependency, meaning, source-labelled origin narratives, typical
practice, ordered actionable guidance, materials and substitutions, closing,
safety, variants and evidence. Family practice takes precedence over generic
guidance where the answer materially differs.

Hero-owned observances remain owned by their hero lane. The ritual-calendar
lane may discover gaps and submit cross-links, but it does not create a second
Ganesh Chaturthi, Durga Puja, Kali Puja or Diwali record.

## Batch workflow

Each lane repeats the following reversible cycle:

1. audit existing holdings and classify reusable, partial, duplicate,
   misleading and missing material;
2. freeze a bounded batch denominator;
3. research and author substantial bilingual records;
4. write typed cross-link proposals;
5. run lane-specific structural, bilingual, coverage and cultural-boundary
   validation;
6. commit and push only lane-owned files;
7. report exact completed, remaining and blocked counts; and
8. hand the checkpoint to the integration lane.

The integration lane then checks canonical IDs, aliases, relationship scope,
duplicate coverage, source and rights compatibility, and combined regression
tests before merging. Hosted Supabase, Vercel and production state remain
unchanged without explicit authorization.

## Write safety

- Never use `git add .` in a parallel lane.
- Never edit or delete untracked work from another task.
- Never copy source payloads into Git.
- Never update shared counters from an unmerged lane.
- Never create a database migration or app projection merely to demonstrate
  authored content.
- Never describe an authored pack as playable, projected, hosted or reviewed
  unless that separate state is actually established.

The formal lane goals and exact write globs are machine-checked in
`knowledge_packs/inventories/parallel-library-work-v1.json`.
