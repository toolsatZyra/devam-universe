-- Product-owned preview composition only. These are navigation records, not
-- scholarly source claims, and they do not assert corpus completeness.

insert into public.atlas_nodes (
  slug, title, subtitle, node_kind, is_gateway, position, visual,
  reveal_at, rights_lane, publication_state
)
values
  ('ramayana', 'Ramayana', 'रामायण', 'gateway', true, '{"x":27,"y":34}', '{"tone":"saffron","invitation":"Begin at Ayodhya","threads":["Ayodhya","Chitrakoot","Dharma in action"]}', 1, 'product_allowed', 'published'),
  ('ganesha', 'Ganesha', 'गणेश', 'gateway', true, '{"x":48,"y":63}', '{"tone":"moon","invitation":"Enter the Ganesha world","threads":["Ganesh Chaturthi","Ashtavinayak","Meaning & symbolism"]}', 1, 'product_allowed', 'published'),
  ('durga', 'Durga', 'दुर्गा', 'gateway', true, '{"x":72,"y":31}', '{"tone":"rose","invitation":"Follow the path of Shakti","threads":["Navaratri","Devi Mahatmya","Durga Puja"]}', 1, 'product_allowed', 'published'),
  ('ayodhya', 'Ayodhya', null, 'Place', false, '{"x":38,"y":24}', '{"size":"major"}', 1, 'product_allowed', 'published'),
  ('chitrakoot', 'Chitrakoot', null, 'Place', false, '{"x":18,"y":48}', '{"size":"connected"}', 1.18, 'product_allowed', 'published'),
  ('ashtavinayak', 'Ashtavinayak', null, 'Pilgrimage', false, '{"x":24,"y":73}', '{"size":"major"}', 1, 'product_allowed', 'published'),
  ('ujjain', 'Ujjain', null, 'Place', false, '{"x":57,"y":77}', '{"size":"connected"}', 1.18, 'product_allowed', 'published'),
  ('kamakhya', 'Kamakhya', null, 'Shakti Peetha', false, '{"x":84,"y":47}', '{"size":"major"}', 1, 'product_allowed', 'published'),
  ('kolkata', 'Kolkata', null, 'Living tradition', false, '{"x":68,"y":18}', '{"size":"connected"}', 1.18, 'product_allowed', 'published'),
  ('kashi', 'Kashi', null, 'Sacred city', false, '{"x":53,"y":35}', '{"size":"connected"}', 1.42, 'product_allowed', 'published'),
  ('kanchipuram', 'Kanchipuram', null, 'Sacred city', false, '{"x":72,"y":69}', '{"size":"connected"}', 1.42, 'product_allowed', 'published');

insert into public.atlas_edges (
  source_node_id, target_node_id, label, rights_lane, publication_state
)
select source.id, target.id, edge.label, 'product_allowed', 'published'
from (values
  ('ramayana', 'ayodhya', 'begins in'),
  ('ramayana', 'chitrakoot', 'journey through'),
  ('ganesha', 'ashtavinayak', 'pilgrimage tradition'),
  ('ganesha', 'ujjain', 'living worship'),
  ('durga', 'kamakhya', 'Shakti tradition'),
  ('durga', 'kolkata', 'Durga Puja'),
  ('durga', 'kanchipuram', 'Shakti tradition')
) as edge(source_slug, target_slug, label)
join public.atlas_nodes source on source.slug = edge.source_slug
join public.atlas_nodes target on target.slug = edge.target_slug;
