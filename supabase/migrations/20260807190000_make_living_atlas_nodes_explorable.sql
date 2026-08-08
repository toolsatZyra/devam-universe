-- Product-owned exploration metadata. These records drive navigation and do
-- not substitute for separately evidenced historical, textual, or ritual claims.

update public.atlas_nodes as node
set visual = node.visual || patch.visual::jsonb,
    updated_at = now()
from (values
  ('ayodhya', '{"eras":["Origins","Epics","Living"],"gatewayId":"ramayana","summary":"Enter the Ramayana through Ayodhya, then follow the source-bounded seven-kanda journey without treating one telling as the whole tradition.","searchQuery":"Ayodhya Ramayana","evidenceBoundary":"Origins is a story-world lens, not an archaeological date. Historical, archaeological, textual, and living Ayodhya claims remain separately sourced."}'),
  ('chitrakoot', '{"eras":["Epics","Living"],"gatewayId":"ramayana","summary":"Explore Chitrakoot as a Ramayana place-thread and continue into the epic''s forest journey and its living sacred geography.","searchQuery":"Chitrakoot Ramayana","evidenceBoundary":"The Atlas connection does not collapse different Ramayana tellings, place traditions, or historical claims."}'),
  ('ashtavinayak', '{"eras":["Medieval","Living"],"gatewayId":"ganesha","summary":"Open the Maharashtra pilgrimage thread connecting eight distinct Ganesha sites, their stories, places, and living practice.","searchQuery":"Ashtavinayak temples pilgrimage","evidenceBoundary":"This doorway is not a complete temple guide, route plan, origin history, or ritual authority for all eight sites."}'),
  ('ujjain', '{"eras":["Classical","Living"],"gatewayId":"ganesha","summary":"Follow a living Ganesha thread through Ujjain while keeping temple, city, textual, and historical evidence distinct.","searchQuery":"Ujjain Ganesha temples","evidenceBoundary":"This preview signals a research path; it does not yet establish a complete Ujjain Ganesha corpus or visitor guide."}'),
  ('kamakhya', '{"eras":["Medieval","Living"],"gatewayId":"durga","summary":"Enter a major Shakti place-thread through Kamakhya, with textual traditions, regional histories, and present practice kept attributable.","searchQuery":"Kamakhya Shakti Peetha","evidenceBoundary":"The Atlas does not treat every Shakti Peetha list, origin account, or ritual lineage as interchangeable."}'),
  ('kolkata', '{"eras":["Living"],"gatewayId":"durga","summary":"Explore Bengal''s living Durga Puja and Kali Puja worlds through their distinct calendars, stories, public forms, and household contexts.","searchQuery":"Kolkata Durga Puja Kali Puja","evidenceBoundary":"Bengal Durga Puja and Kali Puja are connected here but remain different observances with different applicability and authority."}'),
  ('kashi', '{"eras":["Classical","Medieval","Living"],"gatewayId":"diwali","summary":"Open Kashi as a sacred-city thread connecting Dev Deepawali, Shiva and Bhairava traditions, texts, places, and living observance.","searchQuery":"Kashi Dev Deepawali Shiva Bhairava","evidenceBoundary":"This preview does not substitute one city story or modern festival programme for Kashi''s full historical and religious universe."}'),
  ('kanchipuram', '{"eras":["Classical","Medieval","Living"],"gatewayId":"durga","summary":"Explore Kanchipuram through a South Indian Shakti and sacred-city thread while preserving temple and lineage distinctions.","searchQuery":"Kanchipuram Shakti temples","evidenceBoundary":"This doorway is not a universal account of Kanchipuram''s temples, history, theology, or ritual practice."}'),
  ('pavapuri', '{"eras":["Classical","Living"],"gatewayId":"diwali","summary":"Follow Diwali into the Jain remembrance of Mahavira''s nirvana while keeping sect, sangh, calendar, and practice variants visible.","searchQuery":"Pavapuri Mahavira Jain Diwali","evidenceBoundary":"The current Jain Diwali lane is a participation companion, not complete sect-specific ritual guidance."}'),
  ('amritsar', '{"eras":["Medieval","Living"],"gatewayId":"diwali","summary":"Follow the Bandi Chhor Divas thread through Guru Hargobind Sahib, collective freedom, seva, and the living Amritsar context.","searchQuery":"Amritsar Bandi Chhor Divas Guru Hargobind","evidenceBoundary":"Bandi Chhor Divas is connected to the season without being merged into a Hindu or Jain Diwali ritual."}'),
  ('nathdwara', '{"eras":["Medieval","Living"],"gatewayId":"diwali","summary":"Explore a Vaishnava Annakut and Govardhan thread through Nathdwara while keeping regional and sampradaya practices distinct.","searchQuery":"Nathdwara Annakut Govardhan Puja","evidenceBoundary":"The current actionable Govardhana lane is ISKCON Bangalore-specific; it is not presented as Nathdwara ritual authority."}')
) as patch(slug, visual)
where node.slug = patch.slug;

insert into public.atlas_edges (
  source_node_id, target_node_id, label, rights_lane, publication_state
)
select source.id, target.id, 'Dev Deepawali', 'product_allowed', 'published'
from public.atlas_nodes source
cross join public.atlas_nodes target
where source.slug = 'diwali' and target.slug = 'kashi'
on conflict (source_node_id, target_node_id, label) do nothing;

do $$
begin
  if (select count(*) from public.atlas_nodes where not is_gateway and visual ? 'eras' and visual ? 'gatewayId' and visual ? 'summary' and visual ? 'searchQuery' and visual ? 'evidenceBoundary') <> 11 then
    raise exception 'Expected all 11 Living Atlas preview nodes to have explorable metadata';
  end if;
end $$;
