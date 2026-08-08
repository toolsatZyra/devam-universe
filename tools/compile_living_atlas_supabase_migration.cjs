const fs = require("node:fs");
const path = require("node:path");
const ts = require(path.resolve(__dirname, "../apps/web/node_modules/typescript"));

const ROOT = path.resolve(__dirname, "..");
const ATLAS_SOURCE = path.join(ROOT, "apps/web/src/data/atlas.ts");
const OUTPUT = process.argv[2]
  ? path.resolve(ROOT, process.argv[2])
  : path.join(ROOT, "supabase/migrations/20260807190713_sync_mvp_atlas_and_harden_public_search_owner.sql");

function loadAtlas() {
  const source = fs.readFileSync(ATLAS_SOURCE, "utf8");
  const javascript = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const loaded = { exports: {} };
  new Function("exports", "module", "require", javascript)(loaded.exports, loaded, require);
  return loaded.exports;
}

function sqlText(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlJson(value) {
  return `${sqlText(JSON.stringify(value))}::jsonb`;
}

function sqlNullable(value) {
  return value == null ? "null" : sqlText(value);
}

function nodeRow(node, gateway) {
  if (gateway) {
    return `(${[
      sqlText(node.id),
      sqlText(node.title),
      sqlNullable(node.devanagari),
      sqlText("gateway"),
      "true",
      sqlJson(node.position),
      sqlJson({ tone: node.tone, threads: node.threads, invitation: node.invitation }),
      "1.00",
      sqlText("product_allowed"),
      sqlText("published"),
    ].join(", ")})`;
  }
  return `(${[
    sqlText(node.id),
    sqlText(node.label),
    "null",
    sqlText(node.kind),
    "false",
    sqlJson(node.position),
    sqlJson({
      size: node.size,
      eras: node.eras,
      gatewayId: node.gatewayId,
      summary: node.summary,
      searchQuery: node.searchQuery,
      evidenceBoundary: node.evidenceBoundary,
    }),
    Number(node.revealAt).toFixed(2),
    sqlText("product_allowed"),
    sqlText("published"),
  ].join(", ")})`;
}

function buildMigration() {
  const { gateways, worldNodes, worldEdges } = loadAtlas();
  if (gateways.length !== 4 || worldNodes.length !== 36 || worldEdges.length !== 44) {
    throw new Error(`Unexpected Atlas shape: ${gateways.length} gateways, ${worldNodes.length} world nodes, ${worldEdges.length} edges`);
  }
  const ids = new Set([...gateways, ...worldNodes].map((node) => node.id));
  if (ids.size !== 40) throw new Error("Atlas node IDs must be unique");
  for (const edge of worldEdges) {
    if (!ids.has(edge.from) || !ids.has(edge.to) || edge.from === edge.to) {
      throw new Error(`Invalid Atlas edge ${edge.id}`);
    }
  }

  const nodeRows = [
    ...gateways.map((node) => nodeRow(node, true)),
    ...worldNodes.map((node) => nodeRow(node, false)),
  ].join(",\n  ");
  const edgeRows = worldEdges.map((edge) => `(${sqlText(edge.id)}, ${sqlText(edge.from)}, ${sqlText(edge.to)}, ${sqlText(edge.relation)})`).join(",\n  ");
  const nodeSlugArray = [...ids].map(sqlText).join(", ");
  const edgeIdArray = worldEdges.map((edge) => sqlText(edge.id)).join(", ");

  return `-- Generated from apps/web/src/data/atlas.ts by
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
  ${nodeRows}
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
  ${edgeRows}
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
  where slug = any (array[${nodeSlugArray}]);

  select count(*) into expected_edge_count
  from public.atlas_edges e
  join public.atlas_nodes source on source.id = e.source_node_id
  join public.atlas_nodes target on target.id = e.target_node_id
  where e.visual->>'sourceId' = any (array[${edgeIdArray}])
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
    where slug = any (array[${nodeSlugArray}])
      and (publication_state <> 'published' or rights_lane <> 'product_allowed')
  ) then
    raise exception 'Current Living Atlas contains a non-published or non-product node';
  end if;
end
$$;
`;
}

const outputDirectory = path.dirname(OUTPUT);
if (!fs.existsSync(outputDirectory)) throw new Error(`Output directory does not exist: ${outputDirectory}`);
fs.writeFileSync(OUTPUT, buildMigration(), { encoding: "utf8", flag: "w" });
console.log(path.relative(ROOT, OUTPUT).replaceAll("\\", "/"));
