# Lean MVP architecture

The Living Atlas semantic and interaction contract is defined in
`docs/LIVING_ATLAS_WORLD_MODEL.md`. It treats the visible universe as a reviewed
projection of source → passage → claim → relationship evidence, with typed
story, festival, practice, text, place, kinship, identity, time, history,
teaching, and association routes rather than a generic `related_to` graph.
Every visible destination is also normalized into one of ten orthogonal node
families: being/person, event/story, place/polity, time/observance,
practice/material, source/expression, institution/community, idea/wisdom,
art/culture, or historical process. Human-facing kinds remain specific; the
normalized family drives visual grammar, validation, traversal diversity, and
future graph retrieval without flattening the underlying identity.

The interaction layer is a reversible spatial camera rather than page
navigation disguised as a map. Pan, wheel, pinch, keyboard movement, path
travel, bounded trail backtracking, progressive reveal, and zoom-compensated
landmarks operate at every depth. A node focus opens a compact encounter over
the continuing universe; evidence, exact Search, and optional Sarthi remain
connected doors. The current reviewed projection has 192 nodes including five
gateways and 301 typed edges. Those are projection integrity counters, never a
claim of cultural or civilizational completeness.

## Principle

Use the smallest architecture that supports a real vertical slice and preserves an upgrade path. The knowledge graph is a model, not necessarily a separate database product.

## Data plane

- Supabase/Postgres: users, profiles, entities, relationships, claims, claim evidence, source metadata, passages, ritual procedures, Panchang facts, journeys, challenges, subscriptions, and analytics events.
- Product analytics is first-party and content-free: a 90-day pseudonymous session
  funnel records only allow-listed surface events and bounded categorical targets.
  Search text, Sarthi messages, location and ritual selections, email, user ids,
  IP addresses, user agents, source content, and arbitrary properties are excluded.
  Browser roles may insert RLS-checked rows but cannot read them; only the service
  role may read the security-invoker daily aggregate. Telemetry is best-effort:
  a missing/unavailable analytics table returns an accepted no-op and cannot
  degrade any Atlas, Search, Sarthi, Today, or account experience.
- `/api/health` is a no-store configuration-readiness surface. In production it
  fails closed unless the exact HTTPS site origin, publishable-only Supabase
  configuration, disabled subscription/generation flags, absent forbidden
  secrets, and Vercel Git commit identity are present. It returns no environment
  values or credentials and explicitly does not claim database connectivity,
  SMTP delivery, deployed browser acceptance, or source-vault access.
- PostGIS: sacred geography, historical places, routes, and map queries.
- pgvector + Postgres full-text: multilingual hybrid retrieval.
- Object storage: immutable source objects, images, and derived media. One object per hash.
- Relational graph tables plus recursive SQL for MVP. Benchmark before adding a native graph engine.
- Narrative geography, living place-belief, physical geography, archaeology,
  attested polity/history, living worship, and current visitor information use
  separate claim scopes even when the Atlas connects them into one journey.
- Living-temple identity, institutional history, festival context, patronage,
  art history, maker-community history, and source-text comparison also remain
  separate claim scopes. The Kolkata Shakta projection demonstrates this by
  connecting Kalighat and Dakshineswar without equating their forms, temples,
  rituals, histories, communities, or authority.
- Sacred-city geography, living temple identity, river and ghat systems,
  literary memory, performance, Buddhist sacred and archaeological place,
  music transmission, craft communities, GI governance, and historical
  patronage remain separate claim scopes even when the Kashi projection makes
  them part of one continuous journey.
- The Living Atlas projection and its evidence-scoped relationship vocabulary
  follow `docs/LIVING_ATLAS_OPEN_WORLD_CONTRACT.md`. Progressive visual levels
  of detail never weaken the underlying claim, applicability, rights or
  uncertainty boundary.

Core evidence classes: scripture/primary source; commentary/translation; academic/archaeological; official/current; living/oral/regional/family practice; and Devam synthesis.

Every claim can carry source, passage, edition, language, geography, time, tradition, confidence, conflict, and rights lane. Generated translations and syntheses remain explicitly attributable.

Public exact retrieval uses two narrow Postgres RPCs rather than a browser or
app secret. One projects published product-compatible claims and suppresses
exact text for citation-only evidence. The other projects exact source passages
only when the passage and its complete work-expression-edition-source hierarchy
are published and product-compatible; each result includes the source object's
explicit completeness status so product readability is not confused with
edition or tradition completeness. Both clamp result counts, run static SQL
under a no-login/no-bypass-RLS owner, and leave the underlying evidence tables
browser-denied.

## Intelligence plane

Sarthi retrieval combines passages, researched dossiers, graph relationships, deterministic Panchang output, current/live information when necessary, user context, and the active Atlas node. Models are routed by capability and cost; no product dependency is tied to a future model release.

The completed artificial-wisdom research treats governance, epistemic,
experiential, abstraction, cognitive, metacognitive, and interaction concerns
as audit planes for a general human-AI system. They are not separate MVP
services. Sarthi is one domain instantiation with a specific role, evidence
ecology, terminology, applicability model, authority boundary, and evaluation
population. Devam retains the lean Postgres architecture below unless a
same-model, same-evidence experiment proves that another component materially
improves a named task family.

The approved understanding and intellectual-apprenticeship design calls the
target capability **disciplined synthesis under provenance**. It operationally
separates exact retrieval, source-grounded explanation, cross-source synthesis,
scoped interpretation, and practical or existential reflection. It also keeps
four epistemic layers distinct: primary evidence, attributable interpretation,
explicit Devam synthesis, and contested or non-consensus reception. This is a
testable capability contract, not a claim that an LLM literally understands in
an unqualified philosophical sense.

For higher-level questions, the experimental planner may select among six
reasoning lenses: textual discipline; narrative-moral close reading; place,
practice and embodiment; scoped theological reasoning; staged pedagogy; and
institutions, power and margins. Each lens carries a required countercheck, and
only question-relevant lenses run. They are inspectable operations studied
through attributable intellectual lineages, not six services, six answer
sections, six personas, or a consensus engine. Material disagreement remains
visible.

An `attributed_interpretive_viewpoint` is therefore a proposed compact research
projection over existing source, claim, evidence, relationship and
applicability records, not a new database requirement. It preserves who argued
what, in which scope, through which evidence and inference bridge, with which
counterpositions, exclusions, rights and review state. It is distinct from a
cross-case `reviewed_pattern_hypothesis` and subordinate to primary evidence.

The normal answer contract remains natural: crystallized answer, decisive
distinction, two or three supporting connections, a material limit or
alternative, and an agency-preserving implication where supported. Evidence is
expandable, while materially contested, lineage-specific, historical or
consequential claims remain visibly attributed. No hidden chain-of-thought is
stored or required.

No runtime or schema change follows from this design alone. Production adoption
requires a strong grounded-RAG baseline and a held-out, blinded, same-model,
same-evidence ablation. Public-intellectual corpora, recognizable styles,
signature analogies and copyrighted long-form material are prohibited learning
targets; only rights-cleared evidence, attributable research notes, abstract
operations and fresh neutral Devam examples are eligible.

The model never invents Panchang calculations. A deterministic calendar service produces location/tradition-aware facts; Sarthi explains them.

Sarthi uses a thin, inspectable request planner ahead of the existing exact,
deterministic, procedure, and grounded-retrieval routes. The planner declares the
task, decision impact, authority ceiling, explicit and materially missing
context, required evidence types, validators, answer mode, and stop condition.
It is a control function, not an oracle or a second autonomous agent.

The conversational surface may ask for the smallest piece of context that can
change a consequential answer before retrieving a wisdom lens. This opening is
useful conversation, not a sourced recommendation: it carries no scripture,
analogy, or moral verdict. Immediate-danger language bypasses spiritual
interpretation and points the user toward present human and emergency support.
Reviewed narrative reflection remains episode- and expression-specific. The
first Ramayana example aligns GRETIL Sundarakanda 5.28 with Griffith Canto XXX
through ordered content and adjacent-unit evidence while preserving the
different literal numbering. Sarthi may use its deliberative sequence as a
bounded lens, but it does not quote citation-only carriers, convert a sacred
story into binding precedent, or represent one episode as every Ramayana
tradition. Search, Sarthi, and the Atlas journey share this same evidence
boundary.
For a consenting account, an owner-checked conversation ID may load only the
last eight user/assistant turns through RLS; client-supplied history is ignored.
The first reviewed second-turn lane addresses career-family tension in English
and Hindi. It joins exact Gita verse coordinates to a Devam-authored reflective
synthesis, exposes no private commentary quotation, checks financial and care
constraints, favours reversible tests, and leaves the decision with the user.

Sources, claims, procedures, interpretations, cases, pattern hypotheses, and
runtime decision summaries are distinct record families rather than ascending
layers of truth or wisdom. The first implementation uses the existing Postgres
source, claim, evidence, relationship, applicability, and ritual records. It
adds no case, pattern, argument, causal, or native-graph infrastructure until a
held-out same-model, same-evidence comparison proves that the simpler grounded
route is insufficient. Any experimental stored pattern is called a
`reviewed_pattern_hypothesis` and remains a defeasible Devam synthesis.

Retrieval filters rights, publication/review state, and applicability before
generation, then reports required, present, missing, and conflicting evidence.
A citation alone does not prove that the cited source is applicable. Exact and
low-impact requests remain fast; bounded comparison or deliberation is used only
when the route requires it. The user receives a concise answer with sources and
alternatives available on demand. Model self-confidence and hidden
chain-of-thought are not trust signals. See `SARTHI_WISDOM_ARCHITECTURE.md`.

The first generation boundary is deliberately optional and server-only. After
the planner and typed coverage check accept a generic low-impact retrieval
route, a Responses API call may compose at most four published,
product-compatible claim statements into natural prose. Citation-only passage
text is not sent to the model; source identities and application-verified
citations remain outside the generated prose. Structured output, a bounded
timeout, and deterministic fallback keep provider failure from widening the
answer's authority. Deterministic Panchang, ritual procedures, and exact-source
routes retain precedence. This is an implementation of a narrow generation
contract, not evidence that Sarthi is wise or that its answer quality has
improved; that claim requires the frozen same-model answer pilot and review.

Generation, validation, selection, and rendering remain distinct contracts even
when a low-impact request uses one physical model call. Consequential routes may
add independent checks or a separately evaluated critic, but fluent
self-rationalisation is never accepted as validation. Capability claims are
versioned by task, evidence snapshot, model/tool, population, evaluation, and
expiry; warmth or perceived profundity is not a capability metric.

## Ritual content plane

Calendar resolution, descriptive practice evidence, and actionable procedure
are separate objects. A product-complete observance lane joins:

- deterministic local date/timing and precedence;
- applicability by geography, tradition, institution, household, and family;
- significance and source-labelled origin narratives;
- typical practice distinguished from instruction;
- ordered vidhi, materials, substitutions, closing, and safety context;
- regional and sampradaya variants; and
- claim- or step-level evidence.

A generic schema, validator, compiler, and renderer should replace the growing
pattern of bespoke integration code. Existing bounded companions remain valid
inputs but are not promoted to full ritual completion unless they satisfy
`RITUAL_AND_OBSERVANCE_PRODUCT_CONTRACT.md`.

## Experience plane

A responsive web/PWA renders the Living Atlas as the full viewport rather than
inside a dashboard shell. Its procedural/vector cosmic field, layered star
planes, perspective camera rig, graph edges, master-star gateways, and
progressively revealed discovery nodes remain resolution-independent under
zoom. Pointer, wheel, keyboard, pinch, double-tap, and reduced-motion paths share
one bounded camera state. The initial scene exposes all four hero universes;
selecting one flies the camera into its local constellation without a hard cut.

Hero journeys reuse the same spatial language: scene nodes, a moving 2.5D path,
atmosphere, and short story beats replace article-first pages. Hindi and English
story copy are the primary presentation contract. Citation, edition, variant,
rights, and uncertainty data remain attached to the same scene records and open
only through progressive disclosure. Sarthi is an overlay conversation bound to
the active node. Search, account, Today/Panchang, ritual procedures, and deeper
library views are destinations, not permanent Atlas rails or bars.

Scenes are data-driven so content teams can publish places, stories, rituals,
missions, and future visual layers without bespoke navigation code for every
node. Multi-resolution assets, prefetching, caching, and graceful bandwidth
adaptation preserve a premium experience. The MVP may simulate depth with CSS
3D, transforms, vector geometry, and layered motion; a native 3D engine is added
only when measured interaction or rendering needs justify its cost.

## Security and privacy

Use Supabase Auth, row-level security, server-only service credentials, explicit consent for conversation improvement, and user controls to inspect/export/delete memory. Never sell devotional or sensitive profile data.

The browser MVP uses passwordless Supabase Auth with cookie-backed PKCE sessions.
The request proxy validates identity with `getClaims()` and refreshes cookies;
profile, conversation, memory, and saved-item tables are owner-scoped by RLS.
Guest sampling is a soft product-conversion rule rather than an authorization
boundary. A fixed production site origin and custom SMTP are deployment gates.

Sarthi persistence is consent-gated and fail-soft: guests and non-consenting
accounts remain ephemeral; consenting accounts receive owner-scoped threads and
messages through RLS. Saved language, practice region, and tradition fill only
missing request context, never override the current conversation, and never
serve as authorization claims. Dedicated conversational memory extraction is a
later explicit-confirmation layer rather than an automatic side effect of chat.
Recent conversation turns are transient request context, not durable extracted
memory. A requested thread must belong to the current account before any of its
messages are read.
