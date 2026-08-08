-- Content packs need stable, human-reviewable keys so deterministic reruns do
-- not create duplicate claims or procedures. These keys identify authored
-- records; they are not substitutes for source/passage evidence.

alter table public.claims
  add column stable_key text not null;

alter table public.claims
  add constraint claims_stable_key_format
  check (stable_key ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');

alter table public.claims
  add constraint claims_stable_key_key unique (stable_key);

alter table public.claims
  add column search_document tsvector generated always as (
    to_tsvector('simple', coalesce(statement, ''))
  ) stored;

create index claims_search_document_idx
  on public.claims using gin (search_document);

alter table public.ritual_procedures
  add column slug text not null;

alter table public.ritual_procedures
  add constraint ritual_procedures_slug_format
  check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');

alter table public.ritual_procedures
  add constraint ritual_procedures_slug_key unique (slug);
