-- Make the browser denial on canonical evidence/cache tables explicit. The
-- backend service role bypasses RLS; anon/authenticated still have no grants.
create policy source_objects_browser_deny on public.source_objects
  for all to anon, authenticated using (false) with check (false);
create policy passages_browser_deny on public.passages
  for all to anon, authenticated using (false) with check (false);
create policy claim_evidence_browser_deny on public.claim_evidence
  for all to anon, authenticated using (false) with check (false);
create policy panchang_calculations_browser_deny on public.panchang_calculations
  for all to anon, authenticated using (false) with check (false);

-- Cover every foreign key used for relationship cleanup and joins.
create index atlas_edges_relationship_id_idx on public.atlas_edges(relationship_id);
create index observance_rules_claim_id_idx on public.observance_rules(claim_id);
create index observances_entity_id_idx on public.observances(entity_id);
create index relationships_claim_id_idx on public.relationships(claim_id);
create index ritual_steps_claim_id_idx on public.ritual_steps(claim_id);
create index saved_items_atlas_node_id_idx on public.saved_items(atlas_node_id);
create index user_memories_source_thread_id_idx on public.user_memories(source_thread_id);
