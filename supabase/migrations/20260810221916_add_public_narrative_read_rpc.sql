-- One public, language-bounded story projection for Atlas, Search, and Sarthi.
-- The function is SECURITY INVOKER: table grants and RLS remain authoritative.
-- Source/evidence coordinates are deliberately omitted from the consumer
-- payload and remain available only through explicit evidence routes.

create or replace function public.get_public_narrative_series(
  series_slug text,
  language_filter text default 'en'
)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'series', jsonb_build_object(
      'slug', series.slug,
      'title', series.canonical_title,
      'kind', series.narrative_kind,
      'totalSourceUnits', series.total_source_units,
      'coverageState', series.coverage_state
    ),
    'arcs', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'slug', arc.slug,
          'ordinal', arc.arc_ordinal,
          'title', arc_copy.title,
          'invitation', arc_copy.invitation,
          'moments', coalesce((
            select jsonb_agg(
              jsonb_build_object(
                'slug', moment.slug,
                'kind', moment.moment_kind,
                'backboneOrdinal', moment.backbone_ordinal,
                'turnOrdinalInArc', moment.turn_ordinal_in_arc,
                'detailOrdinal', moment.detail_ordinal,
                'parentSlug', parent.slug,
                'title', moment_copy.title,
                'synopsis', moment_copy.synopsis,
                'narrative', moment_copy.narrative,
                'visualDirection', moment.visual_direction,
                'beats', coalesce((
                  select jsonb_agg(
                    jsonb_build_object(
                      'slug', beat.slug,
                      'ordinal', beat.beat_ordinal,
                      'title', beat_copy.title,
                      'narration', beat_copy.narration,
                      'visualDirection', beat.visual_direction
                    ) order by beat.beat_ordinal
                  )
                  from public.narrative_beats beat
                  join public.narrative_beat_texts beat_copy
                    on beat_copy.beat_id = beat.id
                   and beat_copy.language_code = language_filter
                   and beat_copy.publication_state = 'published'
                   and beat_copy.rights_lane in ('product_allowed', 'derivative_allowed')
                  where beat.moment_id = moment.id
                    and beat.publication_state = 'published'
                    and beat.rights_lane in ('product_allowed', 'derivative_allowed')
                ), '[]'::jsonb)
              ) order by moment.backbone_ordinal, moment.detail_ordinal
            )
            from public.narrative_moments moment
            join public.narrative_moment_texts moment_copy
              on moment_copy.moment_id = moment.id
             and moment_copy.language_code = language_filter
             and moment_copy.publication_state = 'published'
             and moment_copy.rights_lane in ('product_allowed', 'derivative_allowed')
            left join public.narrative_moments parent on parent.id = moment.parent_moment_id
            where moment.arc_id = arc.id
              and moment.publication_state = 'published'
              and moment.rights_lane in ('product_allowed', 'derivative_allowed')
          ), '[]'::jsonb)
        ) order by arc.arc_ordinal
      )
      from public.narrative_arcs arc
      join public.narrative_arc_texts arc_copy
        on arc_copy.arc_id = arc.id
       and arc_copy.language_code = language_filter
       and arc_copy.publication_state = 'published'
       and arc_copy.rights_lane in ('product_allowed', 'derivative_allowed')
      where arc.series_id = series.id
        and arc.publication_state = 'published'
        and arc.rights_lane in ('product_allowed', 'derivative_allowed')
        and exists (
          select 1
          from public.narrative_moments visible_moment
          join public.narrative_moment_texts visible_copy
            on visible_copy.moment_id = visible_moment.id
           and visible_copy.language_code = language_filter
           and visible_copy.publication_state = 'published'
           and visible_copy.rights_lane in ('product_allowed', 'derivative_allowed')
          where visible_moment.arc_id = arc.id
            and visible_moment.publication_state = 'published'
            and visible_moment.rights_lane in ('product_allowed', 'derivative_allowed')
        )
    ), '[]'::jsonb)
  )
  from public.narrative_series series
  where series.slug = btrim(series_slug)
    and language_filter in ('en', 'hi')
    and series.publication_state = 'published'
    and series.rights_lane in ('product_allowed', 'derivative_allowed');
$$;

revoke all on function public.get_public_narrative_series(text, text) from public;
grant execute on function public.get_public_narrative_series(text, text) to anon, authenticated;

comment on function public.get_public_narrative_series(text, text) is
  'Returns one RLS-filtered English or Hindi consumer narrative projection without source/evidence apparatus.';

do $$
declare
  function_is_security_definer boolean;
begin
  select p.prosecdef into function_is_security_definer
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = 'get_public_narrative_series'
    and pg_get_function_identity_arguments(p.oid) = 'series_slug text, language_filter text';

  if function_is_security_definer is distinct from false then
    raise exception 'get_public_narrative_series must remain SECURITY INVOKER';
  end if;
  if not has_function_privilege('anon', 'public.get_public_narrative_series(text,text)', 'EXECUTE') then
    raise exception 'anon must execute get_public_narrative_series';
  end if;
  if not has_function_privilege('authenticated', 'public.get_public_narrative_series(text,text)', 'EXECUTE') then
    raise exception 'authenticated must execute get_public_narrative_series';
  end if;
end
$$;
