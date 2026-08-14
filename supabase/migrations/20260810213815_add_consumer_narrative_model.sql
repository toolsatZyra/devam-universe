-- First-class consumer narrative projection.
--
-- Source bytes remain in the one-copy vault and exact passages remain in the
-- existing evidence tables. These tables hold the compact story structure and
-- bilingual consumer copy shared by Search, Sarthi, and the Living Atlas.

create table public.narrative_series (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  expression_id uuid references public.expressions(id) on delete set null,
  canonical_title text not null,
  narrative_kind text not null check (narrative_kind in (
    'epic', 'purana', 'devotional_work', 'story_collection', 'history', 'living_culture'
  )),
  selected_expression_boundary text not null,
  total_source_units integer check (total_source_units is null or total_source_units > 0),
  coverage_state text not null default 'partial' check (coverage_state in (
    'planned', 'source_ready', 'story_mapped', 'consumer_complete_selected_expression'
  )),
  rights_lane public.rights_lane not null default 'private_evidence',
  publication_state public.publication_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.narrative_arcs (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references public.narrative_series(id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  arc_ordinal integer not null check (arc_ordinal > 0),
  canonical_title text not null,
  source_range jsonb not null default '{}'::jsonb,
  rights_lane public.rights_lane not null default 'private_evidence',
  publication_state public.publication_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (series_id, slug),
  unique (series_id, arc_ordinal)
);

create table public.narrative_arc_texts (
  arc_id uuid not null references public.narrative_arcs(id) on delete cascade,
  language_code text not null check (language_code in ('en', 'hi')),
  title text not null,
  invitation text not null,
  text_status text not null default 'draft' check (text_status in (
    'draft', 'source_aligned', 'reviewed'
  )),
  rights_lane public.rights_lane not null default 'private_evidence',
  publication_state public.publication_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (arc_id, language_code)
);

create table public.narrative_moments (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references public.narrative_series(id) on delete cascade,
  arc_id uuid not null references public.narrative_arcs(id) on delete cascade,
  parent_moment_id uuid references public.narrative_moments(id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  moment_kind text not null check (moment_kind in ('backbone_turn', 'playable_scene')),
  backbone_ordinal integer not null check (backbone_ordinal > 0),
  turn_ordinal_in_arc integer not null check (turn_ordinal_in_arc > 0),
  detail_ordinal integer not null default 0 check (detail_ordinal >= 0),
  source_range jsonb not null default '{}'::jsonb,
  compression_note text,
  visual_direction jsonb not null default '{}'::jsonb,
  rights_lane public.rights_lane not null default 'private_evidence',
  publication_state public.publication_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (moment_kind = 'backbone_turn' and parent_moment_id is null and detail_ordinal = 0)
    or (moment_kind = 'playable_scene' and parent_moment_id is not null and detail_ordinal > 0)
  ),
  unique (series_id, slug),
  unique (series_id, backbone_ordinal, detail_ordinal),
  unique (arc_id, turn_ordinal_in_arc, detail_ordinal)
);

create table public.narrative_moment_texts (
  moment_id uuid not null references public.narrative_moments(id) on delete cascade,
  language_code text not null check (language_code in ('en', 'hi')),
  title text not null,
  synopsis text not null,
  narrative text not null,
  text_status text not null default 'draft' check (text_status in (
    'draft', 'source_aligned', 'reviewed'
  )),
  search_document tsvector generated always as (
    to_tsvector('simple', title || ' ' || synopsis || ' ' || narrative)
  ) stored,
  rights_lane public.rights_lane not null default 'private_evidence',
  publication_state public.publication_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (moment_id, language_code)
);

create table public.narrative_beats (
  id uuid primary key default gen_random_uuid(),
  moment_id uuid not null references public.narrative_moments(id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  beat_ordinal integer not null check (beat_ordinal > 0),
  source_range jsonb not null default '{}'::jsonb,
  visual_direction jsonb not null default '{}'::jsonb,
  rights_lane public.rights_lane not null default 'private_evidence',
  publication_state public.publication_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (moment_id, slug),
  unique (moment_id, beat_ordinal)
);

create table public.narrative_beat_texts (
  beat_id uuid not null references public.narrative_beats(id) on delete cascade,
  language_code text not null check (language_code in ('en', 'hi')),
  title text not null,
  narration text not null,
  text_status text not null default 'draft' check (text_status in (
    'draft', 'source_aligned', 'reviewed'
  )),
  rights_lane public.rights_lane not null default 'private_evidence',
  publication_state public.publication_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (beat_id, language_code)
);

create table public.narrative_moment_entities (
  moment_id uuid not null references public.narrative_moments(id) on delete cascade,
  entity_id uuid not null references public.entities(id) on delete restrict,
  participation_kind text not null check (participation_kind in (
    'principal', 'supporting', 'mentioned', 'narrator', 'subject'
  )),
  display_ordinal integer not null default 1 check (display_ordinal > 0),
  created_at timestamptz not null default now(),
  primary key (moment_id, entity_id, participation_kind)
);

create table public.narrative_moment_places (
  moment_id uuid not null references public.narrative_moments(id) on delete cascade,
  atlas_node_id uuid not null references public.atlas_nodes(id) on delete restrict,
  relation_kind text not null check (relation_kind in (
    'takes_place_at', 'travels_through', 'remembers', 'asks_about', 'connected_living_place'
  )),
  display_ordinal integer not null default 1 check (display_ordinal > 0),
  created_at timestamptz not null default now(),
  primary key (moment_id, atlas_node_id, relation_kind)
);

-- A narrative moment may open a separately governed Atlas world without
-- pretending that the living festival, performance, text, place tradition, or
-- practice is part of the selected source expression. Bilingual labels are
-- consumer navigation copy; evidence remains behind the Atlas node/edge.
create table public.narrative_moment_atlas_links (
  moment_id uuid not null references public.narrative_moments(id) on delete cascade,
  atlas_node_id uuid not null references public.atlas_nodes(id) on delete restrict,
  relation_kind text not null check (relation_kind in (
    'festival', 'performance', 'devotional_text', 'practice', 'place', 'history'
  )),
  relation_label_en text not null,
  relation_label_hi text not null,
  display_ordinal integer not null default 1 check (display_ordinal > 0),
  source_key text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (moment_id, atlas_node_id, relation_kind)
);

create table public.narrative_moment_links (
  source_moment_id uuid not null references public.narrative_moments(id) on delete cascade,
  target_moment_id uuid not null references public.narrative_moments(id) on delete cascade,
  link_kind text not null check (link_kind in (
    'precedes', 'follows', 'parallel_thread', 'character_path', 'place_echo'
  )),
  label text,
  created_at timestamptz not null default now(),
  primary key (source_moment_id, target_moment_id, link_kind),
  check (source_moment_id <> target_moment_id)
);

-- Exact evidence remains browser-denied. Product services may project it only
-- through a deliberate source/why route, never as default story chrome.
create table public.narrative_evidence (
  moment_id uuid references public.narrative_moments(id) on delete cascade,
  beat_id uuid references public.narrative_beats(id) on delete cascade,
  passage_id uuid not null references public.passages(id) on delete restrict,
  evidence_role text not null check (evidence_role in (
    'source_span', 'qualifies', 'living_connection', 'historical_context'
  )),
  note text,
  created_at timestamptz not null default now(),
  check ((moment_id is not null)::integer + (beat_id is not null)::integer = 1),
  unique nulls not distinct (moment_id, beat_id, passage_id, evidence_role)
);

create index narrative_series_expression_id_idx on public.narrative_series(expression_id);
create index narrative_arcs_series_order_idx on public.narrative_arcs(series_id, arc_ordinal);
create index narrative_moments_parent_idx on public.narrative_moments(parent_moment_id);
create index narrative_moments_series_order_idx on public.narrative_moments(series_id, backbone_ordinal, detail_ordinal);
create index narrative_moments_arc_order_idx on public.narrative_moments(arc_id, turn_ordinal_in_arc, detail_ordinal);
create index narrative_moment_texts_search_idx on public.narrative_moment_texts using gin(search_document);
create index narrative_beats_moment_order_idx on public.narrative_beats(moment_id, beat_ordinal);
create index narrative_moment_entities_entity_idx on public.narrative_moment_entities(entity_id, moment_id);
create index narrative_moment_places_atlas_idx on public.narrative_moment_places(atlas_node_id, moment_id);
create index narrative_moment_atlas_links_atlas_idx on public.narrative_moment_atlas_links(atlas_node_id, moment_id);
create index narrative_moment_links_target_idx on public.narrative_moment_links(target_moment_id, link_kind);
create index narrative_evidence_passage_idx on public.narrative_evidence(passage_id);

alter table public.narrative_series enable row level security;
alter table public.narrative_arcs enable row level security;
alter table public.narrative_arc_texts enable row level security;
alter table public.narrative_moments enable row level security;
alter table public.narrative_moment_texts enable row level security;
alter table public.narrative_beats enable row level security;
alter table public.narrative_beat_texts enable row level security;
alter table public.narrative_moment_entities enable row level security;
alter table public.narrative_moment_places enable row level security;
alter table public.narrative_moment_atlas_links enable row level security;
alter table public.narrative_moment_links enable row level security;
alter table public.narrative_evidence enable row level security;

revoke all on public.narrative_series, public.narrative_arcs,
  public.narrative_arc_texts,
  public.narrative_moments, public.narrative_moment_texts,
  public.narrative_beats, public.narrative_beat_texts,
  public.narrative_moment_entities, public.narrative_moment_places,
  public.narrative_moment_atlas_links,
  public.narrative_moment_links, public.narrative_evidence
from anon, authenticated;

grant select on public.narrative_series, public.narrative_arcs,
  public.narrative_arc_texts,
  public.narrative_moments, public.narrative_moment_texts,
  public.narrative_beats, public.narrative_beat_texts,
  public.narrative_moment_entities, public.narrative_moment_places,
  public.narrative_moment_atlas_links,
  public.narrative_moment_links
to anon, authenticated;

create policy narrative_series_product_read on public.narrative_series
  for select to anon, authenticated
  using (publication_state = 'published' and rights_lane in ('product_allowed', 'derivative_allowed'));

create policy narrative_arcs_product_read on public.narrative_arcs
  for select to anon, authenticated
  using (
    publication_state = 'published'
    and rights_lane in ('product_allowed', 'derivative_allowed')
    and exists (
      select 1 from public.narrative_series series
      where series.id = narrative_arcs.series_id
        and series.publication_state = 'published'
        and series.rights_lane in ('product_allowed', 'derivative_allowed')
    )
  );

create policy narrative_arc_texts_product_read on public.narrative_arc_texts
  for select to anon, authenticated
  using (
    publication_state = 'published'
    and rights_lane in ('product_allowed', 'derivative_allowed')
    and exists (
      select 1 from public.narrative_arcs arc
      where arc.id = narrative_arc_texts.arc_id
        and arc.publication_state = 'published'
        and arc.rights_lane in ('product_allowed', 'derivative_allowed')
    )
  );

create policy narrative_moments_product_read on public.narrative_moments
  for select to anon, authenticated
  using (
    publication_state = 'published'
    and rights_lane in ('product_allowed', 'derivative_allowed')
    and exists (
      select 1 from public.narrative_series series
      where series.id = narrative_moments.series_id
        and series.publication_state = 'published'
        and series.rights_lane in ('product_allowed', 'derivative_allowed')
    )
    and exists (
      select 1 from public.narrative_arcs arc
      where arc.id = narrative_moments.arc_id
        and arc.publication_state = 'published'
        and arc.rights_lane in ('product_allowed', 'derivative_allowed')
    )
  );

create policy narrative_moment_texts_product_read on public.narrative_moment_texts
  for select to anon, authenticated
  using (
    publication_state = 'published'
    and rights_lane in ('product_allowed', 'derivative_allowed')
    and exists (
      select 1 from public.narrative_moments moment
      where moment.id = narrative_moment_texts.moment_id
        and moment.publication_state = 'published'
        and moment.rights_lane in ('product_allowed', 'derivative_allowed')
    )
  );

create policy narrative_beats_product_read on public.narrative_beats
  for select to anon, authenticated
  using (
    publication_state = 'published'
    and rights_lane in ('product_allowed', 'derivative_allowed')
    and exists (
      select 1 from public.narrative_moments moment
      where moment.id = narrative_beats.moment_id
        and moment.publication_state = 'published'
        and moment.rights_lane in ('product_allowed', 'derivative_allowed')
    )
  );

create policy narrative_beat_texts_product_read on public.narrative_beat_texts
  for select to anon, authenticated
  using (
    publication_state = 'published'
    and rights_lane in ('product_allowed', 'derivative_allowed')
    and exists (
      select 1 from public.narrative_beats beat
      where beat.id = narrative_beat_texts.beat_id
        and beat.publication_state = 'published'
        and beat.rights_lane in ('product_allowed', 'derivative_allowed')
    )
  );

create policy narrative_moment_entities_product_read on public.narrative_moment_entities
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.narrative_moments moment
      where moment.id = narrative_moment_entities.moment_id
        and moment.publication_state = 'published'
        and moment.rights_lane in ('product_allowed', 'derivative_allowed')
    )
    and exists (
      select 1 from public.entities entity
      where entity.id = narrative_moment_entities.entity_id
        and entity.publication_state = 'published'
        and entity.rights_lane in ('product_allowed', 'derivative_allowed')
    )
  );

create policy narrative_moment_places_product_read on public.narrative_moment_places
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.narrative_moments moment
      where moment.id = narrative_moment_places.moment_id
        and moment.publication_state = 'published'
        and moment.rights_lane in ('product_allowed', 'derivative_allowed')
    )
    and exists (
      select 1 from public.atlas_nodes node
      where node.id = narrative_moment_places.atlas_node_id
        and node.publication_state = 'published'
        and node.rights_lane in ('product_allowed', 'derivative_allowed')
    )
  );

create policy narrative_moment_atlas_links_product_read on public.narrative_moment_atlas_links
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.narrative_moments moment
      where moment.id = narrative_moment_atlas_links.moment_id
        and moment.publication_state = 'published'
        and moment.rights_lane in ('product_allowed', 'derivative_allowed')
    )
    and exists (
      select 1 from public.atlas_nodes node
      where node.id = narrative_moment_atlas_links.atlas_node_id
        and node.publication_state = 'published'
        and node.rights_lane in ('product_allowed', 'derivative_allowed')
    )
  );

create policy narrative_moment_links_product_read on public.narrative_moment_links
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.narrative_moments source_moment
      where source_moment.id = narrative_moment_links.source_moment_id
        and source_moment.publication_state = 'published'
        and source_moment.rights_lane in ('product_allowed', 'derivative_allowed')
    )
    and exists (
      select 1 from public.narrative_moments target_moment
      where target_moment.id = narrative_moment_links.target_moment_id
        and target_moment.publication_state = 'published'
        and target_moment.rights_lane in ('product_allowed', 'derivative_allowed')
    )
  );

-- narrative_evidence intentionally has no browser policy or grant.
