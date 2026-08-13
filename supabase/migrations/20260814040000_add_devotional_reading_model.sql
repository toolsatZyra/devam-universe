-- First-class ordered reading model for complete devotional works.
-- This is separate from narrative adaptations: a story scene can never satisfy
-- an omitted source-text interval in a beginning-to-end reading sequence.

create table if not exists public.reading_sequences (
  stable_key text primary key,
  work_id uuid not null references public.works(id) on delete cascade,
  expression_key text not null,
  title jsonb not null check (jsonb_typeof(title) = 'object'),
  sequence_scope jsonb not null default '{}'::jsonb check (jsonb_typeof(sequence_scope) = 'object'),
  source_text_language_code text not null,
  source_text_script_code text not null,
  total_source_units bigint check (total_source_units is null or total_source_units > 0),
  total_passages bigint check (total_passages is null or total_passages > 0),
  completion_state text not null default 'authoring',
  rights_lane text not null check (rights_lane in ('product_allowed', 'internal_only', 'catalogued_lead')),
  publication_state text not null default 'draft' check (publication_state in ('draft', 'review', 'published', 'retired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (work_id, expression_key)
);

create table if not exists public.reading_passages (
  stable_key text primary key,
  sequence_key text not null references public.reading_sequences(stable_key) on delete cascade,
  source_order_key text not null,
  division_key text not null,
  passage_label text not null,
  source_locator jsonb not null check (jsonb_typeof(source_locator) = 'object'),
  source_unit_count integer not null check (source_unit_count > 0),
  previous_passage_key text references public.reading_passages(stable_key) on delete set null,
  next_passage_key text,
  rights_lane text not null check (rights_lane in ('product_allowed', 'internal_only', 'catalogued_lead')),
  publication_state text not null default 'draft' check (publication_state in ('draft', 'review', 'published', 'retired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (sequence_key, source_order_key)
);

create table if not exists public.reading_passage_texts (
  passage_key text not null references public.reading_passages(stable_key) on delete cascade,
  language_code text not null,
  title text not null,
  meaning text not null,
  context_note text,
  text_status text not null default 'devam_authored_beta',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (passage_key, language_code)
);

create table if not exists public.reading_units (
  stable_key text primary key,
  sequence_key text not null references public.reading_sequences(stable_key) on delete cascade,
  passage_key text not null references public.reading_passages(stable_key) on delete cascade,
  source_order_key text not null,
  ordinal_in_passage integer not null check (ordinal_in_passage > 0),
  unit_kind text not null check (unit_kind in ('chaupai', 'doha', 'soratha', 'chhand', 'shloka', 'other')),
  unit_label text not null,
  exact_text text not null check (length(btrim(exact_text)) > 0),
  locator jsonb not null check (jsonb_typeof(locator) = 'object'),
  text_status text not null,
  rights_lane text not null check (rights_lane in ('product_allowed', 'internal_only', 'catalogued_lead')),
  publication_state text not null default 'draft' check (publication_state in ('draft', 'review', 'published', 'retired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (sequence_key, source_order_key),
  unique (passage_key, ordinal_in_passage)
);

alter table public.reading_passages
  add constraint reading_passages_next_passage_key_fkey
  foreign key (next_passage_key) references public.reading_passages(stable_key) on delete set null;

create table if not exists public.user_reading_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  sequence_key text not null references public.reading_sequences(stable_key) on delete cascade,
  reading_mode text not null check (reading_mode in ('continuous', 'page', 'passage', 'division', 'source_unit')),
  last_completed_passage_key text references public.reading_passages(stable_key) on delete set null,
  last_completed_unit_key text references public.reading_units(stable_key) on delete set null,
  saved_position jsonb not null default '{}'::jsonb check (jsonb_typeof(saved_position) = 'object'),
  updated_at timestamptz not null default now(),
  primary key (user_id, sequence_key, reading_mode)
);

create index if not exists reading_passages_sequence_order_idx
  on public.reading_passages(sequence_key, source_order_key);
create index if not exists reading_units_sequence_order_idx
  on public.reading_units(sequence_key, source_order_key);
create index if not exists reading_units_passage_order_idx
  on public.reading_units(passage_key, ordinal_in_passage);

alter table public.reading_sequences enable row level security;
alter table public.reading_passages enable row level security;
alter table public.reading_passage_texts enable row level security;
alter table public.reading_units enable row level security;
alter table public.user_reading_progress enable row level security;

create policy "published reading sequences are public"
  on public.reading_sequences for select
  using (publication_state = 'published' and rights_lane = 'product_allowed');
create policy "published reading passages are public"
  on public.reading_passages for select
  using (publication_state = 'published' and rights_lane = 'product_allowed');
create policy "published reading passage texts are public"
  on public.reading_passage_texts for select
  using (exists (
    select 1 from public.reading_passages passage
    where passage.stable_key = reading_passage_texts.passage_key
      and passage.publication_state = 'published'
      and passage.rights_lane = 'product_allowed'
  ));
create policy "published reading units are public"
  on public.reading_units for select
  using (publication_state = 'published' and rights_lane = 'product_allowed');

create policy "users read their reading progress"
  on public.user_reading_progress for select
  using (auth.uid() = user_id);
create policy "users insert their reading progress"
  on public.user_reading_progress for insert
  with check (auth.uid() = user_id);
create policy "users update their reading progress"
  on public.user_reading_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
create policy "users delete their reading progress"
  on public.user_reading_progress for delete
  using (auth.uid() = user_id);

grant select on public.reading_sequences, public.reading_passages,
  public.reading_passage_texts, public.reading_units to anon, authenticated;
grant select, insert, update, delete on public.user_reading_progress to authenticated;

comment on table public.reading_sequences is
  'Complete ordered source expressions. Daily reading is a pacing view over the same sequence, never an excerpt denominator.';
comment on table public.reading_units is
  'The smallest independently resumable source-text units. Narrative adaptations do not substitute for missing rows.';
comment on table public.user_reading_progress is
  'User-controlled exact reading position; it is not inferred from Panchang, ritual obligation, or engagement analytics.';
