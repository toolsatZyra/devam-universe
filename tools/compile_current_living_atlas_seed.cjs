const fs = require("node:fs");
const path = require("node:path");
const ts = require(path.resolve(__dirname, "../apps/web/node_modules/typescript"));

const ROOT = path.resolve(__dirname, "..");
const ATLAS_SOURCE = path.join(ROOT, "apps/web/src/data/atlas.ts");
const OUTPUT = process.argv[2]
  ? path.resolve(ROOT, process.argv[2])
  : path.join(ROOT, "supabase/migrations/20260808070531_sync_current_living_atlas.sql");

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
  const visual = gateway
    ? {
        sourceId: node.id,
        tone: node.tone,
        threads: node.threads,
        invitation: node.invitation,
      }
    : {
        sourceId: node.id,
        size: node.size,
        eras: node.eras,
        gatewayId: node.gatewayId,
        summary: node.summary,
        searchQuery: node.searchQuery,
        evidenceBoundary: node.evidenceBoundary,
      };
  return `(${[
    sqlText(node.id),
    sqlText(gateway ? node.title : node.label),
    gateway ? sqlNullable(node.devanagari) : "null",
    sqlText(gateway ? "gateway" : node.kind),
    gateway ? "true" : "false",
    sqlJson(node.position),
    sqlJson(visual),
    gateway ? "1.00" : Number(node.revealAt).toFixed(2),
    sqlText("product_allowed"),
    sqlText("published"),
  ].join(", ")})`;
}

function validateAtlas(gateways, worldNodes, worldEdges) {
  if (gateways.length !== 4 || worldNodes.length !== 37 || worldEdges.length !== 45) {
    throw new Error(`Unexpected Atlas shape: ${gateways.length} gateways, ${worldNodes.length} world nodes, ${worldEdges.length} edges`);
  }
  const nodeIds = [...gateways, ...worldNodes].map((node) => node.id);
  if (new Set(nodeIds).size !== 41) throw new Error("Atlas node IDs must be unique");
  if (new Set(worldEdges.map((edge) => edge.id)).size !== 45) throw new Error("Atlas edge IDs must be unique");
  const edgeKeys = worldEdges.map((edge) => `${edge.from}\u0000${edge.to}\u0000${edge.relation}`);
  if (new Set(edgeKeys).size !== 45) throw new Error("Atlas edge endpoint and label triples must be unique");
  const ids = new Set(nodeIds);
  for (const edge of worldEdges) {
    if (!ids.has(edge.from) || !ids.has(edge.to) || edge.from === edge.to || edge.relation.length < 3) {
      throw new Error(`Invalid Atlas edge ${edge.id}`);
    }
  }
}

function buildMigration() {
  const { gateways, worldNodes, worldEdges } = loadAtlas();
  validateAtlas(gateways, worldNodes, worldEdges);

  const allNodes = [...gateways, ...worldNodes];
  const nodeRows = [
    ...gateways.map((node) => nodeRow(node, true)),
    ...worldNodes.map((node) => nodeRow(node, false)),
  ].join(",\n  ");
  const edgeRows = worldEdges
    .map((edge) => `(${sqlText(edge.id)}, ${sqlText(edge.from)}, ${sqlText(edge.to)}, ${sqlText(edge.relation)})`)
    .join(",\n  ");
  const nodeSlugArray = allNodes.map((node) => sqlText(node.id)).join(", ");
  const edgeIdArray = worldEdges.map((edge) => sqlText(edge.id)).join(", ");

  return `-- Generated from apps/web/src/data/atlas.ts by
-- tools/compile_current_living_atlas_seed.cjs.
-- This migration upserts app-owned navigation metadata only. It does not alter
-- RLS, functions, grants, source evidence, or independently managed Atlas rows.

begin;

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
  app_node_count integer;
  app_edge_count integer;
begin
  select count(*) into app_node_count
  from public.atlas_nodes
  where slug = any (array[${nodeSlugArray}])
    and visual->>'sourceId' = slug
    and publication_state = 'published'
    and rights_lane = 'product_allowed';

  select count(*) into app_edge_count
  from public.atlas_edges
  where visual->>'sourceId' = any (array[${edgeIdArray}])
    and publication_state = 'published'
    and rights_lane = 'product_allowed';

  if app_node_count <> 41 then
    raise exception 'Expected 41 app-owned Living Atlas nodes, found %', app_node_count;
  end if;
  if app_edge_count <> 45 then
    raise exception 'Expected 45 app-owned Living Atlas edges, found %', app_edge_count;
  end if;
  if not exists (
    select 1
    from public.atlas_nodes
    where slug = 'ramcharitmanas'
      and visual->>'sourceId' = 'ramcharitmanas'
      and visual->>'gatewayId' = 'ramayana'
      and visual->>'searchQuery' = 'Ramcharitmanas seven sopanas Belvedere Press'
      and visual->>'evidenceBoundary' like '%359 low-quality pages%'
      and visual->>'evidenceBoundary' like '%11 markup anomalies%'
  ) then
    raise exception 'Ramcharitmanas Atlas node is missing its exact reviewed boundary';
  end if;
  if not exists (
    select 1
    from public.atlas_edges edge
    join public.atlas_nodes source on source.id = edge.source_node_id
    join public.atlas_nodes target on target.id = edge.target_node_id
    where edge.visual->>'sourceId' = 'ramayana-ramcharitmanas'
      and source.slug = 'ramayana'
      and target.slug = 'ramcharitmanas'
      and edge.label = 'Awadhi devotional telling'
  ) then
    raise exception 'Ramcharitmanas Atlas relationship is missing or misrouted';
  end if;
end
$$;

commit;
`;
}

const outputDirectory = path.dirname(OUTPUT);
if (!fs.existsSync(outputDirectory)) throw new Error(`Output directory does not exist: ${outputDirectory}`);
fs.writeFileSync(OUTPUT, buildMigration(), { encoding: "utf8", flag: "w" });
console.log(path.relative(ROOT, OUTPUT).replaceAll("\\", "/"));
