-- Keep the first-view Pavapuri label inside the premium mobile Atlas viewport.
-- This changes product-owned navigation placement only, not a geographic claim.

update public.atlas_nodes
set position = '{"x":60,"y":81}'::jsonb,
    updated_at = now()
where slug = 'pavapuri'
  and node_kind = 'Jain sacred place'
  and is_gateway = false;
