-- Product-owned Atlas navigation only. These records expose no source text and
-- do not assert completion of Diwali, Ramayana, or any religious tradition.

insert into public.atlas_nodes (
  slug, title, subtitle, node_kind, is_gateway, position, visual,
  reveal_at, rights_lane, publication_state
)
values
  ('diwali', 'Diwali', 'दीपावली', 'gateway', true, '{"x":76,"y":66}', '{"tone":"gold","invitation":"Follow the festival of many lights","threads":["Lakshmi Puja","Regional Deepavali","Jain and Sikh traditions"]}', 1, 'product_allowed', 'published'),
  ('pavapuri', 'Pavapuri', null, 'Jain sacred place', false, '{"x":88,"y":79}', '{"size":"major"}', 1, 'product_allowed', 'published'),
  ('amritsar', 'Amritsar', null, 'Sikh sacred city', false, '{"x":59,"y":15}', '{"size":"connected"}', 1.18, 'product_allowed', 'published'),
  ('nathdwara', 'Nathdwara', null, 'Vaishnava tradition', false, '{"x":58,"y":79}', '{"size":"connected"}', 1.18, 'product_allowed', 'published')
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
select source.id, target.id, edge.label, '{}'::jsonb, 'product_allowed', 'published'
from (values
  ('diwali', 'kolkata', 'Kali Puja'),
  ('diwali', 'pavapuri', 'Jain Diwali'),
  ('diwali', 'amritsar', 'Bandi Chhor Divas'),
  ('diwali', 'nathdwara', 'Annakut tradition')
) as edge(source_slug, target_slug, label)
join public.atlas_nodes source on source.slug = edge.source_slug
join public.atlas_nodes target on target.slug = edge.target_slug
on conflict (source_node_id, target_node_id, label) do update set
  visual = excluded.visual,
  rights_lane = excluded.rights_lane,
  publication_state = excluded.publication_state;
