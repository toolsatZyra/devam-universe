-- Keep the hosted Atlas doorway aligned with the reviewed application graph
-- after complete exact-revision English/Hindi beta translation publication.
update public.atlas_nodes
set visual = jsonb_set(
  jsonb_set(
    visual,
    '{summary}',
    to_jsonb('Enter the thirteen-chapter source sequence through exact chapter boundaries, with source-aligned English and Hindi beta translations for every preserved passage.'::text),
    true
  ),
  '{evidenceBoundary}',
  to_jsonb('The exact Sanskrit provider revisions and AI-assisted beta translations are bounded evidence, not an identified recension, independently reviewed translation, every commentary, or ritual authority.'::text),
  true
)
where slug = 'devi-mahatmya'
  and publication_state = 'published';

do $$
begin
  if not exists (
    select 1
    from public.atlas_nodes
    where slug = 'devi-mahatmya'
      and visual ->> 'summary' = 'Enter the thirteen-chapter source sequence through exact chapter boundaries, with source-aligned English and Hindi beta translations for every preserved passage.'
      and visual ->> 'evidenceBoundary' = 'The exact Sanskrit provider revisions and AI-assisted beta translations are bounded evidence, not an identified recension, independently reviewed translation, every commentary, or ritual authority.'
      and publication_state = 'published'
  ) then
    raise exception 'Devimahatmya Atlas boundary synchronization failed';
  end if;
end
$$;
