# MVP technical design

## Delivery boundary

The first vertical slice is a deployable responsive web/PWA with repository interfaces that work against either the isolated `devam-universe` Supabase project or compact offline fixtures. The Living Atlas preview now reads from Supabase when publishable environment values are configured. One source-bounded Ganesha pack now powers deterministic exact retrieval and a grounded Sarthi preview; broader retrieval remains fail-closed until its evidence is connected.

## Repository layout

```text
apps/web/                 Next.js App Router product
  src/app/                routes and layouts
  src/components/         Atlas, Sarthi, Today, navigation, primitives
  src/features/           vertical feature modules
  src/lib/                contracts, repositories, Supabase clients
  src/data/               small mock fixtures only
supabase/                 reviewed migrations, preview seed, local config
docs/                     binding product and design documents
source_vault/             local content-addressed restored sources; never deployed
```

The Vercel/project root, if used, will be `apps/web`, ensuring the 5.5 GB source vault is not uploaded with the application.

## Rendering and application boundaries

- Next.js App Router with Server Components by default.
- Client Components only for pan/zoom, sheets, conversation interaction, and local motion.
- Node.js runtime by default; Edge only if a measured latency case justifies it.
- Public previews can be statically rendered. Authenticated/profile-aware routes are dynamic and never shared-cache session-bearing responses.
- Responsive images use multiple resolutions and explicit `sizes`; heavy world assets load after the interaction shell.
- Mock and Supabase repositories implement the same typed interfaces.

## Product routes

- `/` — Living Atlas home.
- `/today` — Panchang and observance actions.
- `/explore/[slug]` — entity/place/story/ritual node.
- `/journeys/[slug]` — curated journey.
- `/challenges/[slug]` — mission-based exploration.
- `/library` and `/library/[source]` — exact retrieval and source context.
- `/search` — passages plus grounded synthesis.
- `/sarthi` — dedicated conversation; the same experience can open contextually as a sheet.
- `/account` — profile, memory controls, language, location, subscription.

## Initial domain contracts

- `AtlasNode`: identity, type, localized names, time range, geography, visual treatment, links, rights lane.
- `Relationship`: source node, predicate, target node, claim/evidence binding, tradition/time applicability.
- `SourceObject`: work, edition, language, representation, hash, provenance, rights lane.
- `Passage`: source-relative coordinates, text/language, translation attribution, citation.
- `Claim`: statement, evidence class, confidence, conflicts, geography/time/tradition facets.
- `RitualProcedure`: applicability, prerequisites, materials, ordered steps, timing, substitutions, min/standard/elaborate variants.
- `PanchangFact`: deterministic engine/version, coordinates/timezone, instant/date, tradition configuration, computed values.
- `Journey` and `Challenge`: ordered nodes/tasks, completion rules, reward presentation.
- `ConversationMemory`: user-owned, purpose-limited, inspectable, editable, deletable.

## Supabase boundary

Postgres is the source of truth for metadata, graph relationships, claims, passages, procedures, journeys, and user state. PostGIS handles geography; pgvector and full-text support hybrid retrieval. Source/media bytes live in object storage by content hash.

Every exposed table uses RLS. User-owned rows enforce `auth.uid() = user_id` for SELECT and mutation, with both `USING` and `WITH CHECK` on UPDATE. Authorization never trusts editable user metadata. Service-role credentials never enter the client. Views exposed to the API use `security_invoker = true`.

Because current Supabase projects may not expose new tables automatically, grants and Data API exposure are explicit and separate from RLS. Extension SQL will not pin versions because Supabase ignores explicit extension versions from 2026-08-05.

## Panchang service

The calendar engine is deterministic and versioned. Inputs include date/instant, latitude, longitude, timezone, ayanamsha/calendar configuration, tradition/region options, and observance ruleset. Outputs are stored with engine/ruleset versions and never invented by the language model. Sarthi explains computed facts and retrieves the associated practice content.

The first implemented layer uses Astronomy Engine 2.1.19 for solar/lunar
positions and a separately versioned mean Lahiri approximation. It computes the
five limbs at local sunrise, local-date moonrise/moonset when present, sidereal
solar rashi plus its next ingress, and common
daylight windows. Its response is
calculation-only: the submitted tradition code is retained as context but does
not yet alter observance assignment. Festival dates, regional precedence rules,
and ritual procedures are a separate evidence-backed layer and cannot be inferred
from this response. See `PANCHANG_ENGINE.md`.

## Sarthi request pipeline

1. classify intent and required freshness;
2. collect explicit user context and current Atlas node;
3. obtain deterministic Panchang/live facts when relevant;
4. hybrid-retrieve passages, dossiers, claims, procedures, and relationships;
5. assemble an evidence packet with conflicts and rights filters;
6. generate a concise response in the user’s language;
7. retain citations behind an expandable evidence affordance;
8. record feedback and a user-controlled memory proposal, never silent sensitive memory.

## MVP quality gates

- responsive visual review at representative desktop and good-smartphone sizes;
- keyboard navigation, focus visibility, reduced-motion support, semantic labels, and contrast checks;
- lint, typecheck, unit tests, and production build;
- RLS policy tests before any real user data;
- deterministic Panchang fixtures against an independently chosen reference set;
- grounded-response evaluation for exact citation, unsupported claims, conflicting traditions, concision, and safety;
- bundle/image budgets and variable-bandwidth behavior.
