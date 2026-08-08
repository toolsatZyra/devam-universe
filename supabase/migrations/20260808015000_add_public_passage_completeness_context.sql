-- Add the source's explicit structural-completeness status to every public
-- exact-passage result. This prevents a product-readable passage from being
-- mistaken for proof that its edition or wider work has been reconciled.

grant select (completeness_status)
  on public.source_objects to devam_public_search_executor;

grant devam_public_search_executor to postgres;
grant create on schema public to devam_public_search_executor;
set local role devam_public_search_executor;

create or replace function public.search_public_passages(
  search_query text,
  language_filter text default null,
  result_limit integer default 12
)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  with matched as (
    select
      p.id,
      p.source_object_id,
      p.source_ordinal,
      p.locator,
      p.exact_text,
      p.text_status,
      p.language_code,
      p.span_sha256,
      p.rights_lane,
      p.publication_state,
      s.sha256 as source_sha256,
      s.completeness_status as source_completeness_status,
      w.slug as work_slug,
      w.canonical_title as work_title,
      ed.edition_title,
      ts_rank_cd(p.search_document, websearch_to_tsquery('simple', trim(search_query))) as rank
    from public.passages p
    join public.source_objects s on s.id = p.source_object_id
    join public.editions ed on ed.id = s.edition_id
    join public.expressions ex on ex.id = ed.expression_id
    join public.works w on w.id = ex.work_id
    where length(trim(search_query)) between 2 and 512
      and p.exact_text is not null
      and p.publication_state = 'published'
      and p.rights_lane in ('product_allowed', 'derivative_allowed')
      and s.rights_lane in ('product_allowed', 'derivative_allowed')
      and ed.publication_state = 'published'
      and ed.rights_lane in ('product_allowed', 'derivative_allowed')
      and ex.publication_state = 'published'
      and ex.rights_lane in ('product_allowed', 'derivative_allowed')
      and w.publication_state = 'published'
      and w.rights_lane in ('product_allowed', 'derivative_allowed')
      and (language_filter is null or p.language_code = lower(trim(language_filter)))
      and p.search_document @@ websearch_to_tsquery('simple', trim(search_query))
    order by rank desc, w.slug, ed.edition_title, p.source_ordinal
    limit greatest(1, least(coalesce(result_limit, 12), 20))
  )
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', m.id,
        'sourceObjectId', m.source_object_id,
        'sourceOrdinal', m.source_ordinal,
        'locator', m.locator,
        'text', m.exact_text,
        'textStatus', m.text_status,
        'languageCode', m.language_code,
        'spanSha256', m.span_sha256,
        'sourceSha256', m.source_sha256,
        'sourceCompletenessStatus', m.source_completeness_status,
        'workSlug', m.work_slug,
        'workTitle', m.work_title,
        'editionTitle', m.edition_title,
        'rightsLane', m.rights_lane,
        'publicationState', m.publication_state
      )
      order by m.rank desc, m.work_slug, m.edition_title, m.source_ordinal
    ),
    '[]'::jsonb
  )
  from matched m;
$$;

reset role;
revoke create on schema public from devam_public_search_executor;
revoke devam_public_search_executor from postgres;

do $$
declare
  function_owner text;
begin
  select pg_get_userbyid(p.proowner)
    into function_owner
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = 'search_public_passages'
    and pg_get_function_identity_arguments(p.oid) = 'search_query text, language_filter text, result_limit integer';
  if function_owner is distinct from 'devam_public_search_executor' then
    raise exception 'search_public_passages has unsafe owner %', function_owner;
  end if;
  if not has_column_privilege('devam_public_search_executor', 'public.source_objects', 'completeness_status', 'SELECT') then
    raise exception 'public passage search executor lacks completeness context';
  end if;
  if has_function_privilege('authenticated', 'public.search_public_passages(text,text,integer)', 'EXECUTE') then
    raise exception 'authenticated must not execute search_public_passages directly';
  end if;
end
$$;
