-- Generated from apps/web/src/data/atlas.ts by
-- tools/compile_living_atlas_supabase_migration.cjs.
-- Product-owned navigation metadata never substitutes for source evidence.

-- The RPC must remain browser-callable so the server-rendered public product can
-- use a publishable key. Its owner is deliberately reduced from postgres to a
-- no-login, no-bypass-RLS role with only the exact columns and product rows the
-- static SQL function needs. Supabase's SECURITY DEFINER lint remains an
-- intentional low-privilege-owner exception; the function has no dynamic SQL.
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'devam_public_search_executor') then
    execute 'create role devam_public_search_executor nologin noinherit nosuperuser nocreatedb nocreaterole noreplication nobypassrls';
  end if;
  if exists (
    select 1 from pg_roles
    where rolname = 'devam_public_search_executor'
      and (rolsuper or rolinherit or rolcreaterole or rolcreatedb or rolcanlogin or rolreplication or rolbypassrls)
  ) then
    raise exception 'devam_public_search_executor has unsafe role attributes';
  end if;
end
$$;

grant usage on schema public to devam_public_search_executor;
revoke all privileges on all tables in schema public from devam_public_search_executor;

grant select (id, stable_key, statement, language_code, claim_kind, evidence_class,
  confidence, applicability, uncertainty_note, rights_lane, publication_state,
  subject_entity_id, search_document)
  on public.claims to devam_public_search_executor;
grant select (id, slug, canonical_name, rights_lane, publication_state)
  on public.entities to devam_public_search_executor;
grant select (claim_id, passage_id, evidence_role, note)
  on public.claim_evidence to devam_public_search_executor;
grant select (id, source_object_id, source_ordinal, locator, exact_text,
  language_code, span_sha256, rights_lane, publication_state)
  on public.passages to devam_public_search_executor;
grant select (id, edition_id, sha256, rights_lane)
  on public.source_objects to devam_public_search_executor;
grant select (id, expression_id, edition_title, rights_lane, publication_state)
  on public.editions to devam_public_search_executor;
grant select (id, work_id, rights_lane, publication_state)
  on public.expressions to devam_public_search_executor;
grant select (id, slug, canonical_title, rights_lane, publication_state)
  on public.works to devam_public_search_executor;

drop policy if exists claims_public_search_executor_read on public.claims;
create policy claims_public_search_executor_read on public.claims
  for select to devam_public_search_executor
  using (publication_state = 'published' and rights_lane in ('product_allowed', 'derivative_allowed'));

drop policy if exists entities_public_search_executor_read on public.entities;
create policy entities_public_search_executor_read on public.entities
  for select to devam_public_search_executor
  using (publication_state = 'published' and rights_lane in ('product_allowed', 'derivative_allowed'));

drop policy if exists works_public_search_executor_read on public.works;
create policy works_public_search_executor_read on public.works
  for select to devam_public_search_executor
  using (publication_state = 'published' and rights_lane in ('product_allowed', 'derivative_allowed'));

drop policy if exists expressions_public_search_executor_read on public.expressions;
create policy expressions_public_search_executor_read on public.expressions
  for select to devam_public_search_executor
  using (publication_state = 'published' and rights_lane in ('product_allowed', 'derivative_allowed'));

drop policy if exists editions_public_search_executor_read on public.editions;
create policy editions_public_search_executor_read on public.editions
  for select to devam_public_search_executor
  using (publication_state = 'published' and rights_lane in ('product_allowed', 'derivative_allowed'));

drop policy if exists source_objects_public_search_executor_read on public.source_objects;
create policy source_objects_public_search_executor_read on public.source_objects
  for select to devam_public_search_executor
  using (
    rights_lane in ('citation_only', 'product_allowed', 'derivative_allowed')
    and exists (
      select 1
      from public.editions ed
      join public.expressions ex on ex.id = ed.expression_id
      join public.works w on w.id = ex.work_id
      where ed.id = source_objects.edition_id
        and ed.publication_state = 'published'
        and ed.rights_lane in ('product_allowed', 'derivative_allowed')
        and ex.publication_state = 'published'
        and ex.rights_lane in ('product_allowed', 'derivative_allowed')
        and w.publication_state = 'published'
        and w.rights_lane in ('product_allowed', 'derivative_allowed')
    )
  );

drop policy if exists passages_public_search_executor_read on public.passages;
create policy passages_public_search_executor_read on public.passages
  for select to devam_public_search_executor
  using (
    publication_state = 'published'
    and rights_lane in ('citation_only', 'product_allowed', 'derivative_allowed')
    and exists (
      select 1 from public.source_objects s
      where s.id = passages.source_object_id
        and s.rights_lane in ('citation_only', 'product_allowed', 'derivative_allowed')
    )
  );

drop policy if exists claim_evidence_public_search_executor_read on public.claim_evidence;
create policy claim_evidence_public_search_executor_read on public.claim_evidence
  for select to devam_public_search_executor
  using (
    exists (
      select 1 from public.claims c
      where c.id = claim_evidence.claim_id
        and c.publication_state = 'published'
        and c.rights_lane in ('product_allowed', 'derivative_allowed')
    )
    and exists (
      select 1 from public.passages p
      where p.id = claim_evidence.passage_id
        and p.publication_state = 'published'
        and p.rights_lane in ('citation_only', 'product_allowed', 'derivative_allowed')
    )
  );

grant devam_public_search_executor to postgres;
grant create on schema public to devam_public_search_executor;
alter function public.search_public_knowledge(text, text, integer)
  owner to devam_public_search_executor;
revoke create on schema public from devam_public_search_executor;
revoke all on function public.search_public_knowledge(text, text, integer) from public;
grant execute on function public.search_public_knowledge(text, text, integer)
  to anon, authenticated, service_role;

comment on function public.search_public_knowledge(text, text, integer) is
  'Static public projection over published product-compatible claims and evidence. Owned by a no-login, no-bypass-RLS role with column-limited grants.';
revoke devam_public_search_executor from postgres;

insert into public.atlas_nodes (
  slug, title, subtitle, node_kind, is_gateway, position, visual, reveal_at,
  rights_lane, publication_state
)
values
  ('ramayana', 'Ramayana', 'रामायण', 'gateway', true, '{"x":27,"y":34}'::jsonb, '{"tone":"saffron","threads":["Ayodhya","Chitrakoot","Dharma in action"],"invitation":"Begin at Ayodhya"}'::jsonb, 1.00, 'product_allowed', 'published'),
  ('ganesha', 'Ganesha', 'गणेश', 'gateway', true, '{"x":48,"y":63}'::jsonb, '{"tone":"moon","threads":["Ganesh Chaturthi","Ashtavinayak","Meaning & symbolism"],"invitation":"Enter the Ganesha world"}'::jsonb, 1.00, 'product_allowed', 'published'),
  ('durga', 'Durga', 'दुर्गा', 'gateway', true, '{"x":72,"y":31}'::jsonb, '{"tone":"rose","threads":["Navaratri","Devi Mahatmya","Durga Puja"],"invitation":"Follow the path of Shakti"}'::jsonb, 1.00, 'product_allowed', 'published'),
  ('diwali', 'Diwali', 'दीपावली', 'gateway', true, '{"x":76,"y":66}'::jsonb, '{"tone":"gold","threads":["Lakshmi Puja","Regional Deepavali","Jain and Sikh traditions"],"invitation":"Follow the festival of many lights"}'::jsonb, 1.00, 'product_allowed', 'published'),
  ('ayodhya', 'Ayodhya', null, 'Place', false, '{"x":38,"y":24}'::jsonb, '{"size":"major","eras":["Origins","Epics","Living"],"gatewayId":"ramayana","summary":"Enter the Ramayana through Ayodhya, then follow the source-bounded seven-kanda journey without treating one telling as the whole tradition.","searchQuery":"Ayodhya Ramayana","evidenceBoundary":"Origins is a story-world lens, not an archaeological date. Historical, archaeological, textual, and living Ayodhya claims remain separately sourced."}'::jsonb, 1.00, 'product_allowed', 'published'),
  ('chitrakoot', 'Chitrakoot', null, 'Place', false, '{"x":18,"y":48}'::jsonb, '{"size":"connected","eras":["Epics","Living"],"gatewayId":"ramayana","summary":"Explore Chitrakoot as a Ramayana place-thread and continue into the epic''s forest journey and its living sacred geography.","searchQuery":"Chitrakoot Ramayana","evidenceBoundary":"The Atlas connection does not collapse different Ramayana tellings, place traditions, or historical claims."}'::jsonb, 1.18, 'product_allowed', 'published'),
  ('ashtavinayak', 'Ashtavinayak', null, 'Pilgrimage', false, '{"x":24,"y":73}'::jsonb, '{"size":"major","eras":["Medieval","Living"],"gatewayId":"ganesha","summary":"Open the Maharashtra pilgrimage thread connecting eight distinct Ganesha sites, their stories, places, and living practice.","searchQuery":"Ashtavinayak temples pilgrimage","evidenceBoundary":"This doorway is not a complete temple guide, route plan, origin history, or ritual authority for all eight sites."}'::jsonb, 1.00, 'product_allowed', 'published'),
  ('ujjain', 'Ujjain', null, 'Place', false, '{"x":57,"y":77}'::jsonb, '{"size":"connected","eras":["Classical","Living"],"gatewayId":"ganesha","summary":"Follow a living Ganesha thread through Ujjain while keeping temple, city, textual, and historical evidence distinct.","searchQuery":"Ujjain Ganesha temples","evidenceBoundary":"This preview signals a research path; it does not yet establish a complete Ujjain Ganesha corpus or visitor guide."}'::jsonb, 1.18, 'product_allowed', 'published'),
  ('kamakhya', 'Kamakhya', null, 'Shakti Peetha', false, '{"x":84,"y":47}'::jsonb, '{"size":"major","eras":["Medieval","Living"],"gatewayId":"durga","summary":"Enter a major Shakti place-thread through Kamakhya, with textual traditions, regional histories, and present practice kept attributable.","searchQuery":"Kamakhya Shakti Peetha","evidenceBoundary":"The Atlas does not treat every Shakti Peetha list, origin account, or ritual lineage as interchangeable."}'::jsonb, 1.00, 'product_allowed', 'published'),
  ('kolkata', 'Kolkata', null, 'Living tradition', false, '{"x":68,"y":18}'::jsonb, '{"size":"connected","eras":["Living"],"gatewayId":"durga","summary":"Explore Bengal''s living Durga Puja and Kali Puja worlds through their distinct calendars, stories, public forms, and household contexts.","searchQuery":"Kolkata Durga Puja Kali Puja","evidenceBoundary":"Bengal Durga Puja and Kali Puja are connected here but remain different observances with different applicability and authority."}'::jsonb, 1.18, 'product_allowed', 'published'),
  ('kashi', 'Kashi', null, 'Sacred city', false, '{"x":53,"y":35}'::jsonb, '{"size":"connected","eras":["Classical","Medieval","Living"],"gatewayId":"diwali","summary":"Open Kashi as a sacred-city thread connecting Dev Deepawali, Shiva and Bhairava traditions, texts, places, and living observance.","searchQuery":"Kashi Dev Deepawali Shiva Bhairava","evidenceBoundary":"This preview does not substitute one city story or modern festival programme for Kashi''s full historical and religious universe."}'::jsonb, 1.42, 'product_allowed', 'published'),
  ('kanchipuram', 'Kanchipuram', null, 'Sacred city', false, '{"x":72,"y":69}'::jsonb, '{"size":"connected","eras":["Classical","Medieval","Living"],"gatewayId":"durga","summary":"Explore Kanchipuram through a South Indian Shakti and sacred-city thread while preserving temple and lineage distinctions.","searchQuery":"Kanchipuram Shakti temples","evidenceBoundary":"This doorway is not a universal account of Kanchipuram''s temples, history, theology, or ritual practice."}'::jsonb, 1.42, 'product_allowed', 'published'),
  ('pavapuri', 'Pavapuri', null, 'Jain sacred place', false, '{"x":60,"y":81}'::jsonb, '{"size":"major","eras":["Classical","Living"],"gatewayId":"diwali","summary":"Follow Diwali into the Jain remembrance of Mahavira''s nirvana while keeping sect, sangh, calendar, and practice variants visible.","searchQuery":"Pavapuri Mahavira Jain Diwali","evidenceBoundary":"The current Jain Diwali lane is a participation companion, not complete sect-specific ritual guidance."}'::jsonb, 1.00, 'product_allowed', 'published'),
  ('amritsar', 'Amritsar', null, 'Sikh sacred city', false, '{"x":59,"y":15}'::jsonb, '{"size":"connected","eras":["Medieval","Living"],"gatewayId":"diwali","summary":"Follow the Bandi Chhor Divas thread through Guru Hargobind Sahib, collective freedom, seva, and the living Amritsar context.","searchQuery":"Amritsar Bandi Chhor Divas Guru Hargobind","evidenceBoundary":"Bandi Chhor Divas is connected to the season without being merged into a Hindu or Jain Diwali ritual."}'::jsonb, 1.18, 'product_allowed', 'published'),
  ('nathdwara', 'Nathdwara', null, 'Vaishnava tradition', false, '{"x":58,"y":79}'::jsonb, '{"size":"connected","eras":["Medieval","Living"],"gatewayId":"diwali","summary":"Explore a Vaishnava Annakut and Govardhan thread through Nathdwara while keeping regional and sampradaya practices distinct.","searchQuery":"Nathdwara Annakut Govardhan Puja","evidenceBoundary":"The current actionable Govardhana lane is ISKCON Bangalore-specific; it is not presented as Nathdwara ritual authority."}'::jsonb, 1.18, 'product_allowed', 'published'),
  ('bala-kanda', 'Balakanda', null, 'Epic book', false, '{"x":12,"y":23}'::jsonb, '{"size":"connected","eras":["Epics"],"gatewayId":"ramayana","summary":"Open the first book through the exact first-sarga boundary of the retained seven-book Sanskrit carrier.","searchQuery":"Ramayana Bala Kanda","evidenceBoundary":"This is one electronic Sanskrit carrier''s book boundary, not every recension, translation, or Ramayana tradition."}'::jsonb, 1.55, 'product_allowed', 'published'),
  ('ayodhya-kanda', 'Ayodhyakanda', null, 'Epic book', false, '{"x":29,"y":15}'::jsonb, '{"size":"connected","eras":["Epics"],"gatewayId":"ramayana","summary":"Follow the second source-bounded book while keeping the textual region distinct from the living city of Ayodhya.","searchQuery":"Ramayana Ayodhya Kanda","evidenceBoundary":"The source book and the Atlas place node are related but not interchangeable historical, geographic, or textual claims."}'::jsonb, 1.72, 'product_allowed', 'published'),
  ('aranya-kanda', 'Aranyakanda', null, 'Epic book', false, '{"x":8,"y":39}'::jsonb, '{"size":"connected","eras":["Epics"],"gatewayId":"ramayana","summary":"Enter the forest book through its independently addressable opening sarga and preserved book identity.","searchQuery":"Ramayana Aranya Kanda","evidenceBoundary":"This node proves one carrier-level book boundary; it does not settle geography, chronology, or every telling."}'::jsonb, 1.72, 'product_allowed', 'published'),
  ('kishkindha-kanda', 'Kishkindhakanda', null, 'Epic book', false, '{"x":17,"y":59}'::jsonb, '{"size":"connected","eras":["Epics"],"gatewayId":"ramayana","summary":"Continue into the fourth book without flattening its sarga structure into an unsourced story summary.","searchQuery":"Ramayana Kishkindha Kanda","evidenceBoundary":"The exact structure belongs to the retained GRETIL Sanskrit transcription and is not a universal edition claim."}'::jsonb, 1.88, 'product_allowed', 'published'),
  ('sundara-kanda', 'Sundarakanda', null, 'Epic book', false, '{"x":34,"y":49}'::jsonb, '{"size":"connected","eras":["Epics","Living"],"gatewayId":"ramayana","summary":"Reach the fifth book and its unusually long 190-group opening sarga before entering a reviewed Hanuman episode.","searchQuery":"Ramayana Sundara Kanda","evidenceBoundary":"Book and sarga coordinates remain edition-specific; devotional use and other textual traditions remain separate."}'::jsonb, 1.72, 'product_allowed', 'published'),
  ('hanuman-deliberation', 'Hanuman''s deliberation', null, 'Reviewed episode', false, '{"x":37,"y":59}'::jsonb, '{"size":"connected","eras":["Epics"],"gatewayId":"ramayana","summary":"Explore how Hanuman weighs Sita''s fear, his language, the guards, and the wider mission before speaking.","searchQuery":"Hanuman''s deliberation before speaking to Sita","evidenceBoundary":"This is a three-witness, episode-bounded Devam reflection, not binding precedent or every Ramayana telling."}'::jsonb, 2.05, 'product_allowed', 'published'),
  ('yuddha-kanda', 'Yuddhakanda', null, 'Epic book', false, '{"x":43,"y":40}'::jsonb, '{"size":"connected","eras":["Epics"],"gatewayId":"ramayana","summary":"Open the sixth book as a separate source region with its first sarga and carrier identity intact.","searchQuery":"Ramayana Yuddha Kanda","evidenceBoundary":"The Atlas preserves one source structure and makes no universal recension, translation, or historical claim."}'::jsonb, 1.88, 'product_allowed', 'published'),
  ('uttara-kanda', 'Uttarakanda', null, 'Epic book', false, '{"x":43,"y":14}'::jsonb, '{"size":"connected","eras":["Epics"],"gatewayId":"ramayana","summary":"Arrive at the seventh book that closes this carrier-level route while the wider tradition remains open.","searchQuery":"Ramayana Uttara Kanda","evidenceBoundary":"Terminal carrier coverage is not proof that every Ramayana work, recension, interpretation, or tradition is complete."}'::jsonb, 1.72, 'product_allowed', 'published'),
  ('ganesh-chaturthi', 'Ganesh Chaturthi', null, 'Festival', false, '{"x":40,"y":78}'::jsonb, '{"size":"major","eras":["Living"],"gatewayId":"ganesha","summary":"Open the reviewed West India household lane for welcome, daily care, closing, and chosen immersion timing.","searchQuery":"What should I do for Ganesh Chaturthi?","evidenceBoundary":"The lane is West India Smarta household guidance, not priest-led liturgy, every stay duration, or all regional practice."}'::jsonb, 1.45, 'product_allowed', 'published'),
  ('sankashti-chaturthi', 'Sankashti Chaturthi', null, 'Recurring observance', false, '{"x":49,"y":90}'::jsonb, '{"size":"connected","eras":["Living"],"gatewayId":"ganesha","summary":"Follow the four resolved September-December 2026 West India Sankashti dates and their bounded family practice.","searchQuery":"Sankashti Chaturthi","evidenceBoundary":"Each month keeps its own moonrise and identity; fasting, katha, food, arghya, and every tradition are not universalized."}'::jsonb, 1.72, 'product_allowed', 'published'),
  ('ananta-chaturdashi', 'Ananta Chaturdashi', null, 'Observance', false, '{"x":33,"y":91}'::jsonb, '{"size":"connected","eras":["Living"],"gatewayId":"ganesha","summary":"Explore the separate Ananta devotional lane while seeing its calendrical connection to some Ganeshotsav closings.","searchQuery":"Ananta Chaturdashi","evidenceBoundary":"Ananta worship is not reduced to Ganesh Visarjan, and the current guide is not a formal Ananta vrata procedure."}'::jsonb, 1.88, 'product_allowed', 'published'),
  ('devi-mahatmya', 'Devi Mahatmya', null, 'Scriptural work', false, '{"x":82,"y":26}'::jsonb, '{"size":"major","eras":["Classical","Medieval","Living"],"gatewayId":"durga","summary":"Enter the thirteen-chapter source sequence through exact chapter boundaries, with source-aligned English and Hindi beta translations for every preserved passage.","searchQuery":"Devimahatmya chapter 82","evidenceBoundary":"The exact Sanskrit provider revisions and AI-assisted beta translations are bounded evidence, not an identified recension, independently reviewed translation, every commentary, or ritual authority."}'::jsonb, 1.45, 'product_allowed', 'published'),
  ('shardiya-navaratri', 'Shardiya Navaratri', null, 'Festival sequence', false, '{"x":90,"y":14}'::jsonb, '{"size":"major","eras":["Living"],"gatewayId":"durga","summary":"Open a nine-night North and West India household lane with deterministic 2026 boundaries and daily context.","searchQuery":"What should I do for Shardiya Navaratri?","evidenceBoundary":"Bengal Durga Puja, South Indian Golu and Saraswati forms, family kuladevi practice, and priest-led rites stay separate."}'::jsonb, 1.55, 'product_allowed', 'published'),
  ('maha-ashtami', 'Maha Ashtami', null, 'Festival day', false, '{"x":95,"y":32}'::jsonb, '{"size":"connected","eras":["Living"],"gatewayId":"durga","summary":"Enter the Kolkata participant lane for Maha Ashtami while keeping community and priestly roles distinct.","searchQuery":"Maha Ashtami in Kolkata","evidenceBoundary":"This is a Bengal Shakta community-participant scope, not household consecration or universal Ashtami liturgy."}'::jsonb, 1.72, 'product_allowed', 'published'),
  ('saraswati-ayudha-puja', 'Saraswati and Ayudha Puja', null, 'Regional Navami', false, '{"x":88,"y":62}'::jsonb, '{"size":"connected","eras":["Living"],"gatewayId":"durga","summary":"Explore the Bengaluru Karnataka Navami lane for books, instruments, tools, Gombe Habba context, and safe participation.","searchQuery":"Karnataka Saraswati Puja","evidenceBoundary":"Formal mantra, homa, consecration, machinery operation, temple procedure, and other regional Navami forms remain separate."}'::jsonb, 1.88, 'product_allowed', 'published'),
  ('vasu-baras', 'Vasu Baras', null, 'Festival opening', false, '{"x":69,"y":91}'::jsonb, '{"size":"connected","eras":["Living"],"gatewayId":"diwali","summary":"Begin a Maharashtra Diwali path with the separate Govatsa Dwadashi family lane where it applies.","searchQuery":"Vasu Baras","evidenceBoundary":"This Maharashtra family form is not a universal opening day, cattle rite, or substitute for local household practice."}'::jsonb, 1.55, 'product_allowed', 'published'),
  ('dhantrayodashi', 'Dhanteras', null, 'Festival day', false, '{"x":78,"y":85}'::jsonb, '{"size":"connected","eras":["Living"],"gatewayId":"diwali","summary":"Explore Dhantrayodashi through a North and West India household lane without collapsing Dhanvantari and Yama practices.","searchQuery":"Dhanteras","evidenceBoundary":"Purchases, health claims, wealth promises, Dhanvantari worship, and Yama Deepam are not treated as one compulsory rite."}'::jsonb, 1.55, 'product_allowed', 'published'),
  ('yama-deepam', 'Yama Deepam', null, 'Festival practice', false, '{"x":87,"y":84}'::jsonb, '{"size":"connected","eras":["Living"],"gatewayId":"diwali","summary":"Follow the separately attributable lamp practice and its local timing rather than hiding it inside a generic Dhanteras card.","searchQuery":"Yama Deepam","evidenceBoundary":"This bounded North and West India household lane does not guarantee outcomes or universalize direction, count, or mantra."}'::jsonb, 1.88, 'product_allowed', 'published'),
  ('naraka-chaturdashi', 'Naraka Chaturdashi', null, 'Festival day', false, '{"x":94,"y":75}'::jsonb, '{"size":"connected","eras":["Living"],"gatewayId":"diwali","summary":"Open the Maharashtra Abhyanga Snan lane while retaining Kali Chaudas and Tamil Deepavali as different traditions.","searchQuery":"Maharashtra Naraka Chaturdashi","evidenceBoundary":"The guide is not a universal Naraka Chaturdashi form and does not merge Gujarati, Tamil, or other regional observances."}'::jsonb, 1.55, 'product_allowed', 'published'),
  ('lakshmi-puja', 'Lakshmi Puja', null, 'Festival practice', false, '{"x":94,"y":58}'::jsonb, '{"size":"major","eras":["Living"],"gatewayId":"diwali","summary":"Enter the reviewed West India household Lakshmi Puja lane with materials, timing, sequence, closing, and substitutions.","searchQuery":"Lakshmi Puja at home","evidenceBoundary":"Bengal Kali Puja, institutional rites, priest-led paddhati, business-book rites, and every regional form remain separate."}'::jsonb, 1.45, 'product_allowed', 'published'),
  ('kali-puja', 'Kali Puja', null, 'Regional festival', false, '{"x":82,"y":47}'::jsonb, '{"size":"connected","eras":["Living"],"gatewayId":"diwali","summary":"Connect Diwali''s night to the distinct Bengal Kali Puja participant world without relabelling it as Lakshmi Puja.","searchQuery":"Bengal Kali Puja","evidenceBoundary":"The current lane supports a Bengal participant context, not priest-led Mahanisha Puja or all Shakta traditions."}'::jsonb, 1.72, 'product_allowed', 'published'),
  ('bali-pratipada', 'Bali Pratipada', null, 'Festival day', false, '{"x":83,"y":96}'::jsonb, '{"size":"connected","eras":["Living"],"gatewayId":"diwali","summary":"Explore the Maharashtra family Padwa lane while preserving Karnataka Balipadyami and Govardhan paths separately.","searchQuery":"Maharashtra Bali Pratipada","evidenceBoundary":"This Maharashtra family scope does not universalize marriage customs, royal-Bali narratives, or other Pratipada traditions."}'::jsonb, 1.72, 'product_allowed', 'published'),
  ('govardhana-puja', 'Govardhana Puja', null, 'Vaishnava festival', false, '{"x":69,"y":74}'::jsonb, '{"size":"connected","eras":["Living"],"gatewayId":"diwali","summary":"Open the ISKCON Bengaluru participant lane and continue toward Annakut traditions without merging their authorities.","searchQuery":"ISKCON Govardhan Puja","evidenceBoundary":"The reviewed participant lane is ISKCON-specific and is not a Nathdwara, BAPS, temple-wide, or universal household procedure."}'::jsonb, 1.88, 'product_allowed', 'published'),
  ('bhai-dooj', 'Bhai Dooj', null, 'Festival day', false, '{"x":96,"y":92}'::jsonb, '{"size":"connected","eras":["Living"],"gatewayId":"diwali","summary":"Close the North India sequence through a household sibling lane while keeping Bhau Beej and Bhai Phota distinct.","searchQuery":"North India Bhai Dooj","evidenceBoundary":"This lane does not universalize gender roles, travel expectations, gifts, food, or regional sibling observances."}'::jsonb, 1.72, 'product_allowed', 'published'),
  ('tamil-deepavali', 'Tamil Deepavali', null, 'Regional festival', false, '{"x":95,"y":46}'::jsonb, '{"size":"connected","eras":["Living"],"gatewayId":"diwali","summary":"Explore the Tamil early-morning household lane as its own Deepavali world rather than a variant footnote.","searchQuery":"Tamil Deepavali","evidenceBoundary":"The Tamil household lane does not become North Indian Lakshmi Puja, Maharashtra Abhyanga Snan, or all South Indian practice."}'::jsonb, 1.88, 'product_allowed', 'published')
on conflict (slug) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  node_kind = excluded.node_kind,
  is_gateway = excluded.is_gateway,
  position = excluded.position,
  visual = excluded.visual,
  reveal_at = excluded.reveal_at,
  rights_lane = excluded.rights_lane,
  publication_state = excluded.publication_state,
  updated_at = now();

insert into public.atlas_edges (
  source_node_id, target_node_id, label, visual, rights_lane, publication_state
)
select source.id, target.id, edge.label,
  jsonb_build_object('sourceId', edge.source_id),
  'product_allowed', 'published'
from (values
  ('ramayana-ayodhya', 'ramayana', 'ayodhya', 'begins in'),
  ('ramayana-chitrakoot', 'ramayana', 'chitrakoot', 'journey through'),
  ('ganesha-ashtavinayak', 'ganesha', 'ashtavinayak', 'pilgrimage tradition'),
  ('ganesha-ujjain', 'ganesha', 'ujjain', 'living worship'),
  ('durga-kamakhya', 'durga', 'kamakhya', 'Shakti tradition'),
  ('durga-kolkata', 'durga', 'kolkata', 'Durga Puja'),
  ('durga-kanchipuram', 'durga', 'kanchipuram', 'Shakti tradition'),
  ('diwali-kolkata', 'diwali', 'kolkata', 'Kali Puja'),
  ('diwali-pavapuri', 'diwali', 'pavapuri', 'Jain Diwali'),
  ('diwali-amritsar', 'diwali', 'amritsar', 'Bandi Chhor Divas'),
  ('diwali-nathdwara', 'diwali', 'nathdwara', 'Annakut tradition'),
  ('diwali-kashi', 'diwali', 'kashi', 'Dev Deepawali'),
  ('ramayana-bala-kanda', 'ramayana', 'bala-kanda', 'opens with'),
  ('bala-to-ayodhya-kanda', 'bala-kanda', 'ayodhya-kanda', 'continues into'),
  ('ayodhya-kanda-to-ayodhya', 'ayodhya-kanda', 'ayodhya', 'text and place thread'),
  ('ayodhya-to-chitrakoot', 'ayodhya', 'chitrakoot', 'journey toward'),
  ('chitrakoot-to-aranya', 'chitrakoot', 'aranya-kanda', 'forest journey'),
  ('aranya-to-kishkindha', 'aranya-kanda', 'kishkindha-kanda', 'continues into'),
  ('kishkindha-to-sundara', 'kishkindha-kanda', 'sundara-kanda', 'mission continues'),
  ('sundara-to-hanuman-deliberation', 'sundara-kanda', 'hanuman-deliberation', 'contains episode'),
  ('sundara-to-yuddha', 'sundara-kanda', 'yuddha-kanda', 'continues into'),
  ('yuddha-to-uttara', 'yuddha-kanda', 'uttara-kanda', 'continues into'),
  ('ganesha-ganesh-chaturthi', 'ganesha', 'ganesh-chaturthi', 'annual festival'),
  ('ganesha-sankashti', 'ganesha', 'sankashti-chaturthi', 'recurring observance'),
  ('ganesh-chaturthi-to-ananta', 'ganesh-chaturthi', 'ananta-chaturdashi', 'some festival closings'),
  ('ganesh-chaturthi-to-ashtavinayak', 'ganesh-chaturthi', 'ashtavinayak', 'Maharashtra Ganesha world'),
  ('durga-devi-mahatmya', 'durga', 'devi-mahatmya', 'scriptural source'),
  ('durga-navaratri', 'durga', 'shardiya-navaratri', 'nine-night sequence'),
  ('navaratri-to-maha-ashtami', 'shardiya-navaratri', 'maha-ashtami', 'regional day path'),
  ('navaratri-to-saraswati-ayudha', 'shardiya-navaratri', 'saraswati-ayudha-puja', 'Karnataka Navami path'),
  ('maha-ashtami-to-kolkata', 'maha-ashtami', 'kolkata', 'Bengal participant context'),
  ('saraswati-ayudha-to-kanchipuram', 'saraswati-ayudha-puja', 'kanchipuram', 'South India exploration'),
  ('diwali-vasu-baras', 'diwali', 'vasu-baras', 'Maharashtra opening'),
  ('vasu-to-dhanteras', 'vasu-baras', 'dhantrayodashi', 'festival sequence'),
  ('dhanteras-to-yama', 'dhantrayodashi', 'yama-deepam', 'separate lamp practice'),
  ('dhanteras-to-naraka', 'dhantrayodashi', 'naraka-chaturdashi', 'festival sequence'),
  ('naraka-to-lakshmi', 'naraka-chaturdashi', 'lakshmi-puja', 'West India sequence'),
  ('naraka-to-tamil', 'naraka-chaturdashi', 'tamil-deepavali', 'distinct regional world'),
  ('lakshmi-to-kali', 'lakshmi-puja', 'kali-puja', 'same night, distinct practice'),
  ('kali-to-kolkata', 'kali-puja', 'kolkata', 'Bengal context'),
  ('lakshmi-to-bali', 'lakshmi-puja', 'bali-pratipada', 'Maharashtra sequence'),
  ('lakshmi-to-govardhana', 'lakshmi-puja', 'govardhana-puja', 'Vaishnava sequence'),
  ('govardhana-to-nathdwara', 'govardhana-puja', 'nathdwara', 'Annakut exploration'),
  ('bali-to-bhai-dooj', 'bali-pratipada', 'bhai-dooj', 'festival sequence')
) as edge(source_id, source_slug, target_slug, label)
join public.atlas_nodes source on source.slug = edge.source_slug
join public.atlas_nodes target on target.slug = edge.target_slug
on conflict (source_node_id, target_node_id, label) do update set
  visual = excluded.visual,
  rights_lane = excluded.rights_lane,
  publication_state = excluded.publication_state;

do $$
declare
  expected_node_count integer;
  expected_edge_count integer;
begin
  select count(*) into expected_node_count
  from public.atlas_nodes
  where slug = any (array['ramayana', 'ganesha', 'durga', 'diwali', 'ayodhya', 'chitrakoot', 'ashtavinayak', 'ujjain', 'kamakhya', 'kolkata', 'kashi', 'kanchipuram', 'pavapuri', 'amritsar', 'nathdwara', 'bala-kanda', 'ayodhya-kanda', 'aranya-kanda', 'kishkindha-kanda', 'sundara-kanda', 'hanuman-deliberation', 'yuddha-kanda', 'uttara-kanda', 'ganesh-chaturthi', 'sankashti-chaturthi', 'ananta-chaturdashi', 'devi-mahatmya', 'shardiya-navaratri', 'maha-ashtami', 'saraswati-ayudha-puja', 'vasu-baras', 'dhantrayodashi', 'yama-deepam', 'naraka-chaturdashi', 'lakshmi-puja', 'kali-puja', 'bali-pratipada', 'govardhana-puja', 'bhai-dooj', 'tamil-deepavali']);

  select count(*) into expected_edge_count
  from public.atlas_edges e
  join public.atlas_nodes source on source.id = e.source_node_id
  join public.atlas_nodes target on target.id = e.target_node_id
  where e.visual->>'sourceId' = any (array['ramayana-ayodhya', 'ramayana-chitrakoot', 'ganesha-ashtavinayak', 'ganesha-ujjain', 'durga-kamakhya', 'durga-kolkata', 'durga-kanchipuram', 'diwali-kolkata', 'diwali-pavapuri', 'diwali-amritsar', 'diwali-nathdwara', 'diwali-kashi', 'ramayana-bala-kanda', 'bala-to-ayodhya-kanda', 'ayodhya-kanda-to-ayodhya', 'ayodhya-to-chitrakoot', 'chitrakoot-to-aranya', 'aranya-to-kishkindha', 'kishkindha-to-sundara', 'sundara-to-hanuman-deliberation', 'sundara-to-yuddha', 'yuddha-to-uttara', 'ganesha-ganesh-chaturthi', 'ganesha-sankashti', 'ganesh-chaturthi-to-ananta', 'ganesh-chaturthi-to-ashtavinayak', 'durga-devi-mahatmya', 'durga-navaratri', 'navaratri-to-maha-ashtami', 'navaratri-to-saraswati-ayudha', 'maha-ashtami-to-kolkata', 'saraswati-ayudha-to-kanchipuram', 'diwali-vasu-baras', 'vasu-to-dhanteras', 'dhanteras-to-yama', 'dhanteras-to-naraka', 'naraka-to-lakshmi', 'naraka-to-tamil', 'lakshmi-to-kali', 'kali-to-kolkata', 'lakshmi-to-bali', 'lakshmi-to-govardhana', 'govardhana-to-nathdwara', 'bali-to-bhai-dooj'])
    and e.publication_state = 'published'
    and e.rights_lane = 'product_allowed';

  if expected_node_count <> 40 then
    raise exception 'Expected 40 current Living Atlas nodes, found %', expected_node_count;
  end if;
  if expected_edge_count <> 44 then
    raise exception 'Expected 44 current Living Atlas edges, found %', expected_edge_count;
  end if;
  if exists (
    select 1 from public.atlas_nodes
    where slug = any (array['ramayana', 'ganesha', 'durga', 'diwali', 'ayodhya', 'chitrakoot', 'ashtavinayak', 'ujjain', 'kamakhya', 'kolkata', 'kashi', 'kanchipuram', 'pavapuri', 'amritsar', 'nathdwara', 'bala-kanda', 'ayodhya-kanda', 'aranya-kanda', 'kishkindha-kanda', 'sundara-kanda', 'hanuman-deliberation', 'yuddha-kanda', 'uttara-kanda', 'ganesh-chaturthi', 'sankashti-chaturthi', 'ananta-chaturdashi', 'devi-mahatmya', 'shardiya-navaratri', 'maha-ashtami', 'saraswati-ayudha-puja', 'vasu-baras', 'dhantrayodashi', 'yama-deepam', 'naraka-chaturdashi', 'lakshmi-puja', 'kali-puja', 'bali-pratipada', 'govardhana-puja', 'bhai-dooj', 'tamil-deepavali'])
      and (publication_state <> 'published' or rights_lane <> 'product_allowed')
  ) then
    raise exception 'Current Living Atlas contains a non-published or non-product node';
  end if;
end
$$;
