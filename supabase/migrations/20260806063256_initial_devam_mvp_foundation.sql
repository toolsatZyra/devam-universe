-- Devam MVP data foundation.
-- Canonical library evidence remains server-managed. The browser receives only
-- explicitly published, product-cleared rows or rows owned by the signed-in user.

create type public.rights_lane as enum (
  'private_evidence',
  'citation_only',
  'product_allowed',
  'derivative_allowed'
);

create type public.publication_state as enum (
  'draft',
  'review',
  'published',
  'retired'
);

create table public.works (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  canonical_title text not null,
  work_kind text not null,
  tradition_scope text[] not null default '{}',
  summary text,
  rights_lane public.rights_lane not null default 'private_evidence',
  publication_state public.publication_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.expressions (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.works(id) on delete cascade,
  language_code text not null,
  script_code text,
  expression_kind text not null,
  attribution text,
  is_source_original boolean not null default false,
  ai_generated boolean not null default false,
  rights_lane public.rights_lane not null default 'private_evidence',
  publication_state public.publication_state not null default 'draft',
  created_at timestamptz not null default now(),
  unique (work_id, language_code, expression_kind, attribution)
);

create table public.editions (
  id uuid primary key default gen_random_uuid(),
  expression_id uuid not null references public.expressions(id) on delete cascade,
  edition_title text not null,
  publisher text,
  publication_place text,
  publication_year integer check (publication_year between 1 and 2200),
  edition_statement text,
  identifiers jsonb not null default '{}'::jsonb,
  rights_lane public.rights_lane not null default 'private_evidence',
  publication_state public.publication_state not null default 'draft',
  created_at timestamptz not null default now()
);

create table public.source_objects (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid references public.editions(id) on delete set null,
  sha256 text not null unique check (sha256 ~ '^[0-9a-f]{64}$'),
  byte_count bigint not null check (byte_count >= 0),
  media_type text not null,
  storage_key text not null unique,
  provider text,
  provider_identifier text,
  source_url text,
  acquired_at timestamptz,
  provenance jsonb not null default '{}'::jsonb,
  completeness_status text not null default 'not_assessed',
  rights_lane public.rights_lane not null default 'private_evidence',
  rights_basis jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique nulls not distinct (provider, provider_identifier, sha256)
);

create table public.passages (
  id uuid primary key default gen_random_uuid(),
  source_object_id uuid not null references public.source_objects(id) on delete cascade,
  parent_passage_id uuid references public.passages(id) on delete set null,
  source_ordinal bigint not null check (source_ordinal >= 0),
  locator jsonb not null,
  language_code text not null,
  script_code text,
  exact_text text,
  text_status text not null default 'unverified',
  span_sha256 text check (span_sha256 is null or span_sha256 ~ '^[0-9a-f]{64}$'),
  rights_lane public.rights_lane not null default 'private_evidence',
  publication_state public.publication_state not null default 'draft',
  search_document tsvector generated always as (
    to_tsvector('simple', coalesce(exact_text, ''))
  ) stored,
  created_at timestamptz not null default now(),
  unique (source_object_id, source_ordinal)
);

create table public.entities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  entity_kind text not null,
  canonical_name text not null,
  description text,
  temporal_scope jsonb not null default '{}'::jsonb,
  geographic_scope jsonb not null default '{}'::jsonb,
  rights_lane public.rights_lane not null default 'private_evidence',
  publication_state public.publication_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.entity_names (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities(id) on delete cascade,
  name text not null,
  language_code text not null,
  script_code text,
  name_kind text not null default 'alternate',
  is_preferred boolean not null default false,
  created_at timestamptz not null default now(),
  unique (entity_id, name, language_code, name_kind)
);

create table public.claims (
  id uuid primary key default gen_random_uuid(),
  subject_entity_id uuid references public.entities(id) on delete set null,
  statement text not null,
  language_code text not null,
  claim_kind text not null,
  evidence_class text not null,
  confidence numeric(4,3) check (confidence is null or confidence between 0 and 1),
  applicability jsonb not null default '{}'::jsonb,
  uncertainty_note text,
  rights_lane public.rights_lane not null default 'private_evidence',
  publication_state public.publication_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.claim_evidence (
  claim_id uuid not null references public.claims(id) on delete cascade,
  passage_id uuid not null references public.passages(id) on delete restrict,
  evidence_role text not null check (evidence_role in ('supports', 'contradicts', 'qualifies', 'context')),
  note text,
  created_at timestamptz not null default now(),
  primary key (claim_id, passage_id, evidence_role)
);

create table public.relationships (
  id uuid primary key default gen_random_uuid(),
  subject_entity_id uuid not null references public.entities(id) on delete cascade,
  predicate text not null,
  object_entity_id uuid not null references public.entities(id) on delete cascade,
  claim_id uuid references public.claims(id) on delete set null,
  applicability jsonb not null default '{}'::jsonb,
  rights_lane public.rights_lane not null default 'private_evidence',
  publication_state public.publication_state not null default 'draft',
  created_at timestamptz not null default now(),
  check (subject_entity_id <> object_entity_id),
  unique nulls not distinct (subject_entity_id, predicate, object_entity_id, claim_id)
);

create table public.atlas_nodes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  entity_id uuid references public.entities(id) on delete set null,
  title text not null,
  subtitle text,
  node_kind text not null,
  is_gateway boolean not null default false,
  position jsonb not null,
  visual jsonb not null default '{}'::jsonb,
  reveal_at numeric(5,2) not null default 1 check (reveal_at > 0),
  rights_lane public.rights_lane not null default 'private_evidence',
  publication_state public.publication_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.atlas_edges (
  id uuid primary key default gen_random_uuid(),
  source_node_id uuid not null references public.atlas_nodes(id) on delete cascade,
  target_node_id uuid not null references public.atlas_nodes(id) on delete cascade,
  relationship_id uuid references public.relationships(id) on delete set null,
  label text not null,
  visual jsonb not null default '{}'::jsonb,
  rights_lane public.rights_lane not null default 'private_evidence',
  publication_state public.publication_state not null default 'draft',
  created_at timestamptz not null default now(),
  check (source_node_id <> target_node_id),
  unique (source_node_id, target_node_id, label)
);

create table public.observances (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  entity_id uuid references public.entities(id) on delete set null,
  canonical_name text not null,
  observance_kind text not null,
  summary text,
  rights_lane public.rights_lane not null default 'private_evidence',
  publication_state public.publication_state not null default 'draft',
  created_at timestamptz not null default now()
);

create table public.ritual_procedures (
  id uuid primary key default gen_random_uuid(),
  observance_id uuid references public.observances(id) on delete set null,
  title text not null,
  language_code text not null,
  region_codes text[] not null default '{}',
  sampradaya_codes text[] not null default '{}',
  family_practice_note text,
  applicability jsonb not null default '{}'::jsonb,
  evidence_status text not null default 'draft_research',
  rights_lane public.rights_lane not null default 'private_evidence',
  publication_state public.publication_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ritual_steps (
  id uuid primary key default gen_random_uuid(),
  procedure_id uuid not null references public.ritual_procedures(id) on delete cascade,
  step_ordinal integer not null check (step_ordinal > 0),
  instruction text not null,
  rationale text,
  is_optional boolean not null default false,
  variation_note text,
  claim_id uuid references public.claims(id) on delete set null,
  rights_lane public.rights_lane not null default 'private_evidence',
  publication_state public.publication_state not null default 'draft',
  created_at timestamptz not null default now(),
  unique (procedure_id, step_ordinal)
);

create table public.observance_rules (
  id uuid primary key default gen_random_uuid(),
  observance_id uuid not null references public.observances(id) on delete cascade,
  ruleset_version text not null,
  tradition_code text not null,
  region_codes text[] not null default '{}',
  rule_expression jsonb not null,
  explanation text not null,
  claim_id uuid references public.claims(id) on delete set null,
  rights_lane public.rights_lane not null default 'private_evidence',
  publication_state public.publication_state not null default 'draft',
  created_at timestamptz not null default now(),
  unique (observance_id, ruleset_version, tradition_code, region_codes)
);

create table public.panchang_calculations (
  id uuid primary key default gen_random_uuid(),
  input_hash text not null unique check (input_hash ~ '^[0-9a-f]{64}$'),
  civil_date date not null,
  latitude numeric(9,6) not null check (latitude between -90 and 90),
  longitude numeric(9,6) not null check (longitude between -180 and 180),
  timezone text not null,
  tradition_code text not null,
  engine_name text not null,
  engine_version text not null,
  ruleset_version text not null,
  result jsonb not null,
  calculated_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  preferred_language text,
  home_location jsonb,
  sampradaya_code text,
  family_practice jsonb not null default '{}'::jsonb,
  personalization_consent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.conversation_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.conversation_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.conversation_threads(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  grounding jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.user_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  memory_kind text not null,
  value jsonb not null,
  source_thread_id uuid references public.conversation_threads(id) on delete set null,
  user_confirmed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.saved_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  atlas_node_id uuid not null references public.atlas_nodes(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, atlas_node_id)
);

-- Foreign-key, search, policy, and common product-query indexes.
create index expressions_work_id_idx on public.expressions(work_id);
create index editions_expression_id_idx on public.editions(expression_id);
create index source_objects_edition_id_idx on public.source_objects(edition_id);
create index passages_source_object_id_idx on public.passages(source_object_id);
create index passages_parent_passage_id_idx on public.passages(parent_passage_id);
create index passages_search_document_idx on public.passages using gin(search_document);
create index entity_names_entity_id_idx on public.entity_names(entity_id);
create index claims_subject_entity_id_idx on public.claims(subject_entity_id);
create index claim_evidence_passage_id_idx on public.claim_evidence(passage_id);
create index relationships_subject_idx on public.relationships(subject_entity_id, predicate);
create index relationships_object_idx on public.relationships(object_entity_id, predicate);
create index atlas_nodes_entity_id_idx on public.atlas_nodes(entity_id);
create index atlas_nodes_published_idx on public.atlas_nodes(publication_state, rights_lane);
create index atlas_edges_source_idx on public.atlas_edges(source_node_id);
create index atlas_edges_target_idx on public.atlas_edges(target_node_id);
create index atlas_edges_published_idx on public.atlas_edges(publication_state, rights_lane);
create index ritual_procedures_observance_id_idx on public.ritual_procedures(observance_id);
create index ritual_steps_procedure_id_idx on public.ritual_steps(procedure_id);
create index observance_rules_observance_id_idx on public.observance_rules(observance_id);
create index panchang_lookup_idx on public.panchang_calculations(civil_date, timezone, tradition_code);
create index conversation_threads_user_id_idx on public.conversation_threads(user_id);
create index conversation_messages_thread_id_idx on public.conversation_messages(thread_id, created_at);
create index user_memories_user_id_idx on public.user_memories(user_id);

-- RLS is enabled on every table exposed by the Data API schema.
alter table public.works enable row level security;
alter table public.expressions enable row level security;
alter table public.editions enable row level security;
alter table public.source_objects enable row level security;
alter table public.passages enable row level security;
alter table public.entities enable row level security;
alter table public.entity_names enable row level security;
alter table public.claims enable row level security;
alter table public.claim_evidence enable row level security;
alter table public.relationships enable row level security;
alter table public.atlas_nodes enable row level security;
alter table public.atlas_edges enable row level security;
alter table public.observances enable row level security;
alter table public.ritual_procedures enable row level security;
alter table public.ritual_steps enable row level security;
alter table public.observance_rules enable row level security;
alter table public.panchang_calculations enable row level security;
alter table public.profiles enable row level security;
alter table public.conversation_threads enable row level security;
alter table public.conversation_messages enable row level security;
alter table public.user_memories enable row level security;
alter table public.saved_items enable row level security;

-- Explicit grants: canonical evidence stays backend-only. Only reviewed product
-- records and user-owned rows are available through browser roles.
revoke all on all tables in schema public from anon, authenticated;

grant select on public.works, public.expressions, public.editions,
  public.entities, public.entity_names, public.claims, public.relationships,
  public.atlas_nodes, public.atlas_edges, public.observances,
  public.ritual_procedures, public.ritual_steps, public.observance_rules
to anon, authenticated;

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.conversation_threads,
  public.conversation_messages, public.user_memories, public.saved_items
to authenticated;

-- Product-readable content requires both editorial publication and a compatible
-- rights lane. Source objects, passages, claim evidence, and Panchang cache have
-- no browser policy or grant and are read only by the server-side data layer.
create policy works_product_read on public.works
  for select to anon, authenticated
  using (publication_state = 'published' and rights_lane in ('product_allowed', 'derivative_allowed'));
create policy expressions_product_read on public.expressions
  for select to anon, authenticated
  using (publication_state = 'published' and rights_lane in ('product_allowed', 'derivative_allowed'));
create policy editions_product_read on public.editions
  for select to anon, authenticated
  using (publication_state = 'published' and rights_lane in ('product_allowed', 'derivative_allowed'));
create policy entities_product_read on public.entities
  for select to anon, authenticated
  using (publication_state = 'published' and rights_lane in ('product_allowed', 'derivative_allowed'));
create policy entity_names_product_read on public.entity_names
  for select to anon, authenticated
  using (exists (
    select 1 from public.entities e
    where e.id = entity_names.entity_id
      and e.publication_state = 'published'
      and e.rights_lane in ('product_allowed', 'derivative_allowed')
  ));
create policy claims_product_read on public.claims
  for select to anon, authenticated
  using (publication_state = 'published' and rights_lane in ('product_allowed', 'derivative_allowed'));
create policy relationships_product_read on public.relationships
  for select to anon, authenticated
  using (publication_state = 'published' and rights_lane in ('product_allowed', 'derivative_allowed'));
create policy atlas_nodes_product_read on public.atlas_nodes
  for select to anon, authenticated
  using (publication_state = 'published' and rights_lane in ('product_allowed', 'derivative_allowed'));
create policy atlas_edges_product_read on public.atlas_edges
  for select to anon, authenticated
  using (publication_state = 'published' and rights_lane in ('product_allowed', 'derivative_allowed'));
create policy observances_product_read on public.observances
  for select to anon, authenticated
  using (publication_state = 'published' and rights_lane in ('product_allowed', 'derivative_allowed'));
create policy ritual_procedures_product_read on public.ritual_procedures
  for select to anon, authenticated
  using (publication_state = 'published' and rights_lane in ('product_allowed', 'derivative_allowed'));
create policy ritual_steps_product_read on public.ritual_steps
  for select to anon, authenticated
  using (publication_state = 'published' and rights_lane in ('product_allowed', 'derivative_allowed'));
create policy observance_rules_product_read on public.observance_rules
  for select to anon, authenticated
  using (publication_state = 'published' and rights_lane in ('product_allowed', 'derivative_allowed'));

-- User data is isolated by auth.uid(). Wrapping auth.uid() in SELECT allows
-- PostgreSQL to cache the value per statement.
create policy profiles_own_select on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy profiles_own_insert on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);
create policy profiles_own_update on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy threads_own_select on public.conversation_threads
  for select to authenticated using ((select auth.uid()) = user_id);
create policy threads_own_insert on public.conversation_threads
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy threads_own_update on public.conversation_threads
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy threads_own_delete on public.conversation_threads
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy messages_own_select on public.conversation_messages
  for select to authenticated using (exists (
    select 1 from public.conversation_threads t
    where t.id = conversation_messages.thread_id
      and t.user_id = (select auth.uid())
  ));
create policy messages_own_insert on public.conversation_messages
  for insert to authenticated with check (exists (
    select 1 from public.conversation_threads t
    where t.id = conversation_messages.thread_id
      and t.user_id = (select auth.uid())
  ));
create policy messages_own_update on public.conversation_messages
  for update to authenticated
  using (exists (
    select 1 from public.conversation_threads t
    where t.id = conversation_messages.thread_id
      and t.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.conversation_threads t
    where t.id = conversation_messages.thread_id
      and t.user_id = (select auth.uid())
  ));
create policy messages_own_delete on public.conversation_messages
  for delete to authenticated using (exists (
    select 1 from public.conversation_threads t
    where t.id = conversation_messages.thread_id
      and t.user_id = (select auth.uid())
  ));

create policy memories_own_select on public.user_memories
  for select to authenticated using ((select auth.uid()) = user_id);
create policy memories_own_insert on public.user_memories
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy memories_own_update on public.user_memories
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy memories_own_delete on public.user_memories
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy saved_items_own_select on public.saved_items
  for select to authenticated using ((select auth.uid()) = user_id);
create policy saved_items_own_insert on public.saved_items
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy saved_items_own_delete on public.saved_items
  for delete to authenticated using ((select auth.uid()) = user_id);
