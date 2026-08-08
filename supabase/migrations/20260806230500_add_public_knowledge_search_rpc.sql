-- Safe public projection over server-managed evidence tables. The function is
-- intentionally narrower than the administrative repository: only published,
-- product-compatible claims and published evidence can leave the database.

create or replace function public.search_public_knowledge(
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
      c.id,
      c.stable_key,
      c.statement,
      c.language_code,
      c.claim_kind,
      c.evidence_class,
      c.confidence,
      c.applicability,
      c.uncertainty_note,
      c.rights_lane,
      c.publication_state,
      case
        when subject.id is null then null
        else jsonb_build_object(
          'slug', subject.slug,
          'canonicalName', subject.canonical_name
        )
      end as subject,
      ts_rank_cd(c.search_document, websearch_to_tsquery('simple', trim(search_query))) as rank
    from public.claims c
    left join public.entities subject
      on subject.id = c.subject_entity_id
      and subject.publication_state = 'published'
      and subject.rights_lane in ('product_allowed', 'derivative_allowed')
    where length(trim(search_query)) between 2 and 512
      and c.publication_state = 'published'
      and c.rights_lane in ('product_allowed', 'derivative_allowed')
      and (language_filter is null or c.language_code = lower(trim(language_filter)))
      and c.search_document @@ websearch_to_tsquery('simple', trim(search_query))
    order by rank desc, c.stable_key
    limit greatest(1, least(coalesce(result_limit, 12), 12))
  ), shaped as (
    select
      m.rank,
      m.stable_key,
      jsonb_build_object(
        'id', m.id,
        'stableKey', m.stable_key,
        'subject', m.subject,
        'statement', m.statement,
        'languageCode', m.language_code,
        'claimKind', m.claim_kind,
        'evidenceClass', m.evidence_class,
        'confidence', m.confidence,
        'applicability', m.applicability,
        'uncertaintyNote', m.uncertainty_note,
        'rightsLane', m.rights_lane,
        'publicationState', m.publication_state,
        'evidence', evidence.items
      ) as payload
    from matched m
    cross join lateral (
      select jsonb_agg(
        jsonb_build_object(
          'passageId', p.id,
          'sourceObjectId', s.id,
          'sourceOrdinal', p.source_ordinal,
          'locator', p.locator,
          'exactText', case
            when p.rights_lane in ('product_allowed', 'derivative_allowed') then p.exact_text
            else null
          end,
          'languageCode', p.language_code,
          'spanSha256', p.span_sha256,
          'sourceSha256', s.sha256,
          'workSlug', w.slug,
          'workTitle', w.canonical_title,
          'editionTitle', ed.edition_title,
          'rightsLane', p.rights_lane,
          'publicationState', p.publication_state,
          'evidenceRole', ce.evidence_role,
          'note', ce.note
        ) order by p.source_ordinal, ce.evidence_role
      ) as items
      from public.claim_evidence ce
      join public.passages p on p.id = ce.passage_id
      join public.source_objects s on s.id = p.source_object_id
      join public.editions ed on ed.id = s.edition_id
      join public.expressions ex on ex.id = ed.expression_id
      join public.works w on w.id = ex.work_id
      where ce.claim_id = m.id
        and p.publication_state = 'published'
        and p.rights_lane in ('citation_only', 'product_allowed', 'derivative_allowed')
        and s.rights_lane in ('citation_only', 'product_allowed', 'derivative_allowed')
        and ed.publication_state = 'published'
        and ed.rights_lane in ('product_allowed', 'derivative_allowed')
        and ex.publication_state = 'published'
        and ex.rights_lane in ('product_allowed', 'derivative_allowed')
        and w.publication_state = 'published'
        and w.rights_lane in ('product_allowed', 'derivative_allowed')
    ) evidence
    where evidence.items is not null
  )
  select coalesce(jsonb_agg(payload order by rank desc, stable_key), '[]'::jsonb)
  from shaped;
$$;

revoke all on function public.search_public_knowledge(text, text, integer) from public;
grant execute on function public.search_public_knowledge(text, text, integer) to anon, authenticated, service_role;

comment on function public.search_public_knowledge(text, text, integer) is
  'Returns only published, product-compatible Devam claims and rights-filtered published evidence.';
