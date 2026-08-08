const fs = require("node:fs");
const path = require("node:path");
const ts = require(path.resolve(__dirname, "../apps/web/node_modules/typescript"));

const ROOT = path.resolve(__dirname, "..");
const ATLAS_SOURCE = path.join(ROOT, "apps/web/src/data/atlas.ts");
const OUTPUT = process.argv[2]
  ? path.resolve(ROOT, process.argv[2])
  : path.join(ROOT, "supabase/migrations/20260809150000_sync_current_living_atlas.sql");

const DEVIMAHATMYA_NARRATIVE_CONSTELLATION_NODE_SLUGS = [
  "king-suratha", "merchant-samadhi", "sage-medhas", "medhas-hermitage-story-world", "mahamaya",
  "suratha-samadhi-seek-counsel", "madhu-kaitabha-awakening", "mahishasura-battle", "kaushiki", "kalika",
  "dhumralochana", "chanda-munda", "chamunda", "raktabija", "shumbha-nishumbha-battle", "granting-of-boons",
];
const DEVIMAHATMYA_SEMANTIC_NODE_SLUGS = [
  "madhu-kaitabha", "mahishasura", "shumbha", "nishumbha",
  ...DEVIMAHATMYA_NARRATIVE_CONSTELLATION_NODE_SLUGS,
];
const ENTITY_BOUND_NODE_SLUGS = [...DEVIMAHATMYA_SEMANTIC_NODE_SLUGS, "ganesha-purana"];
const DEVIMAHATMYA_SEMANTIC_EDGE_IDS = DEVIMAHATMYA_SEMANTIC_NODE_SLUGS.map((slug) => `devi-mahatmya-${slug}`);
const DISTINCT_DIWALI_NODE_SLUGS = ["kali-chaudas-baps", "gujarati-new-year-baps", "balipadyami-karnataka", "jain-diwali", "bandi-chhor-divas"];
const DISTINCT_DIWALI_EDGE_IDS = ["naraka-to-kali-chaudas-baps", "bali-to-gujarati-new-year-baps", "bali-to-balipadyami-karnataka", "diwali-to-jain-diwali", "diwali-to-bandi-chhor-divas"];
const DUTT_NARRATIVE_CONSTELLATION_NODE_SLUGS = [
  "rama", "sita", "lakshmana", "hanuman", "ravana", "sugriva", "king-janaka", "king-dasharatha",
  "mithila-story-world", "panchavati-story-world", "kishkindha-story-world", "lanka-story-world",
  "forest-exile", "sita-abduction", "rama-sugriva-alliance", "hanuman-ocean-crossing", "bridge-to-lanka", "return-to-ayodhya",
];
const SACRED_TIME_NODE_SLUGS = [
  "krishna-janmashtami", "radha-ashtami", "vishwakarma-puja", "pitru-paksha", "karwa-chauth", "ahoi-ashtami",
  "chhath-puja", "tulasi-vivah", "dev-deepawali", "kalabhairava-jayanti", "vivaha-panchami", "gita-jayanti",
];
const SACRED_TIME_EDGE_IDS = [
  "sacred-time-to-janmashtami", "janmashtami-to-radha-ashtami", "sacred-time-to-vishwakarma", "vishwakarma-to-kolkata",
  "sacred-time-to-pitru-paksha", "pitru-paksha-to-navaratri", "sacred-time-to-karwa-chauth", "karwa-chauth-to-ahoi",
  "ahoi-to-diwali", "diwali-to-chhath", "diwali-to-tulasi-vivah", "sacred-time-to-dev-deepawali", "dev-deepawali-to-kashi",
  "kashi-to-kalabhairava-jayanti", "sacred-time-to-vivaha-panchami", "vivaha-panchami-to-sita", "vivaha-panchami-to-rama",
  "vivaha-panchami-to-mithila", "sacred-time-to-gita-jayanti",
];

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
  if (gateways.length !== 5 || worldNodes.length !== 96 || worldEdges.length !== 158) {
    throw new Error(`Unexpected Atlas shape: ${gateways.length} gateways, ${worldNodes.length} world nodes, ${worldEdges.length} edges`);
  }
  const nodeIds = [...gateways, ...worldNodes].map((node) => node.id);
  if (new Set(nodeIds).size !== 101) throw new Error("Atlas node IDs must be unique");
  if (new Set(worldEdges.map((edge) => edge.id)).size !== 158) throw new Error("Atlas edge IDs must be unique");
  const edgeKeys = worldEdges.map((edge) => `${edge.from}\u0000${edge.to}\u0000${edge.relation}`);
  if (new Set(edgeKeys).size !== 158) throw new Error("Atlas edge endpoint and label triples must be unique");
  const ids = new Set(nodeIds);
  for (const edge of worldEdges) {
    if (!ids.has(edge.from) || !ids.has(edge.to) || edge.from === edge.to || edge.relation.length < 3) {
      throw new Error(`Invalid Atlas edge ${edge.id}`);
    }
  }
  for (const slug of DEVIMAHATMYA_SEMANTIC_NODE_SLUGS) {
    const node = worldNodes.find((candidate) => candidate.id === slug);
    const edge = worldEdges.find((candidate) => candidate.id === `devi-mahatmya-${slug}`);
    if (!node || node.gatewayId !== "durga" || edge?.from !== "devi-mahatmya" || edge.to !== slug || edge.relation !== "contains narrative of") {
      throw new Error(`Source-bounded Devimahatmya Atlas route is missing or invalid for ${slug}`);
    }
  }
  if (DEVIMAHATMYA_NARRATIVE_CONSTELLATION_NODE_SLUGS.some((slug) => !worldNodes.some((node) => node.id === slug && node.gatewayId === "durga"))) {
    throw new Error("Devimahatmya narrative constellation is incomplete");
  }
  const sourceAddressedDevimahatmyaEdges = worldEdges.filter((edge) =>
    DEVIMAHATMYA_NARRATIVE_CONSTELLATION_NODE_SLUGS.includes(edge.from)
    || DEVIMAHATMYA_NARRATIVE_CONSTELLATION_NODE_SLUGS.includes(edge.to)
  ).filter((edge) => edge.id !== "kali-puja-to-kalika");
  if (sourceAddressedDevimahatmyaEdges.length !== 37 || sourceAddressedDevimahatmyaEdges.some((edge) => !edge.sourceRef?.includes("sha256:"))) {
    throw new Error("Devimahatmya narrative constellation has missing source addresses");
  }
  const ganeshaPuranaNode = worldNodes.find((candidate) => candidate.id === "ganesha-purana");
  const ganeshaPuranaEdge = worldEdges.find((candidate) => candidate.id === "ganesha-ganesha-purana");
  if (!ganeshaPuranaNode || ganeshaPuranaNode.gatewayId !== "ganesha" || ganeshaPuranaEdge?.from !== "ganesha" || ganeshaPuranaEdge.to !== "ganesha-purana") {
    throw new Error("Source-bounded Ganesha Purana Atlas route is missing or invalid");
  }
  const atharvashirshaNode = worldNodes.find((candidate) => candidate.id === "ganapatyatharvashirsha");
  const atharvashirshaEdge = worldEdges.find((candidate) => candidate.id === "ganesha-ganapatyatharvashirsha");
  if (!atharvashirshaNode || atharvashirshaNode.gatewayId !== "ganesha" || atharvashirshaEdge?.from !== "ganesha" || atharvashirshaEdge.to !== "ganapatyatharvashirsha") {
    throw new Error("Exact-revision Ganapati Atharvashirsha Atlas route is missing or invalid");
  }
  const duttNode = worldNodes.find((candidate) => candidate.id === "dutt-ramayana");
  const duttEdge = worldEdges.find((candidate) => candidate.id === "ramayana-dutt-ramayana");
  if (!duttNode || duttNode.gatewayId !== "ramayana" || duttEdge?.from !== "ramayana" || duttEdge.to !== "dutt-ramayana") {
    throw new Error("Source-bounded Dutt Ramayana Atlas route is missing or invalid");
  }
  if (DUTT_NARRATIVE_CONSTELLATION_NODE_SLUGS.some((slug) => !worldNodes.some((node) => node.id === slug && node.gatewayId === "ramayana"))) {
    throw new Error("Dutt Ramayana narrative constellation is incomplete");
  }
  const sourceAddressedAtlasEdges = worldEdges.filter((edge) => edge.sourceRef?.includes("sha256:"));
  if (sourceAddressedAtlasEdges.length < 75 || sourceAddressedAtlasEdges.some((edge) => !edge.sourceRef?.includes("sha256:"))) {
    throw new Error("Living Atlas source-addressed routes are incomplete");
  }
  for (let index = 0; index < DISTINCT_DIWALI_NODE_SLUGS.length; index += 1) {
    const node = worldNodes.find((candidate) => candidate.id === DISTINCT_DIWALI_NODE_SLUGS[index]);
    const edge = worldEdges.find((candidate) => candidate.id === DISTINCT_DIWALI_EDGE_IDS[index]);
    if (!node || node.gatewayId !== "diwali" || !edge || edge.to !== node.id) {
      throw new Error(`Distinct Diwali Atlas lane is missing or invalid for ${DISTINCT_DIWALI_NODE_SLUGS[index]}`);
    }
  }
  const requiredBridgeIds = ["ramayana-to-diwali", "diwali-to-kali-puja", "kali-puja-to-durga", "durga-to-durga-puja", "durga-puja-to-kolkata"];
  for (const edgeId of requiredBridgeIds) {
    const edge = worldEdges.find((candidate) => candidate.id === edgeId);
    if (!edge || typeof edge.evidenceBoundary !== "string" || edge.evidenceBoundary.length < 80) {
      throw new Error(`Evidence-bounded cross-world Atlas route is missing or invalid for ${edgeId}`);
    }
  }
  if (!gateways.some((gateway) => gateway.id === "sacred-time" && gateway.tone === "violet")) {
    throw new Error("Sacred Time gateway is missing or invalid");
  }
  for (const slug of SACRED_TIME_NODE_SLUGS) {
    const node = worldNodes.find((candidate) => candidate.id === slug);
    if (!node || node.gatewayId !== "sacred-time" || node.evidenceBoundary.length < 80) {
      throw new Error(`Sacred Time node is missing or insufficiently bounded for ${slug}`);
    }
  }
  for (const edgeId of SACRED_TIME_EDGE_IDS) {
    const edge = worldEdges.find((candidate) => candidate.id === edgeId);
    if (!edge?.sourceRef?.match(/^sha256:[0-9a-f]{64}#ritual-pack$/)) {
      throw new Error(`Sacred Time edge is missing its immutable ritual-pack coordinate for ${edgeId}`);
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
    .map((edge) => `(${sqlText(edge.id)}, ${sqlText(edge.from)}, ${sqlText(edge.to)}, ${sqlText(edge.relation)}, ${sqlNullable(edge.evidenceBoundary)}, ${sqlNullable(edge.sourceRef)})`)
    .join(",\n  ");
  const nodeSlugArray = allNodes.map((node) => sqlText(node.id)).join(", ");
  const edgeIdArray = worldEdges.map((edge) => sqlText(edge.id)).join(", ");
  const semanticNodeRows = ENTITY_BOUND_NODE_SLUGS.map((slug) => `(${sqlText(slug)}, ${sqlText(slug)})`).join(",\n  ");
  const semanticEdgeRows = DEVIMAHATMYA_SEMANTIC_NODE_SLUGS.map((slug, index) => `(${sqlText(DEVIMAHATMYA_SEMANTIC_EDGE_IDS[index])}, ${sqlText(slug)})`).join(",\n  ");
  const sourceAddressedAtlasEdgeIds = worldEdges.filter((edge) => edge.sourceRef?.includes("sha256:")).map((edge) => edge.id);

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
  jsonb_strip_nulls(jsonb_build_object('sourceId', edge.source_id, 'evidenceBoundary', edge.evidence_boundary, 'sourceRef', edge.source_ref)),
  'product_allowed', 'published'
from (values
  ${edgeRows}
) as edge(source_id, source_slug, target_slug, label, evidence_boundary, source_ref)
join public.atlas_nodes source on source.slug = edge.source_slug
join public.atlas_nodes target on target.slug = edge.target_slug
on conflict (source_node_id, target_node_id, label) do update set
  visual = excluded.visual,
  rights_lane = excluded.rights_lane,
  publication_state = excluded.publication_state;

with mapping(atlas_slug, entity_slug) as (values
  ${semanticNodeRows}
)
update public.atlas_nodes atlas
set entity_id = entity.id,
    updated_at = now()
from mapping
join public.entities entity on entity.slug = mapping.entity_slug
  and entity.publication_state = 'published'
where atlas.slug = mapping.atlas_slug;

with mapping(edge_source_id, object_slug) as (values
  ${semanticEdgeRows}
)
update public.atlas_edges atlas_edge
set relationship_id = relationship.id
from mapping
join public.atlas_nodes source_node on source_node.slug = 'devi-mahatmya'
join public.atlas_nodes target_node on target_node.slug = mapping.object_slug
join public.entities subject_entity on subject_entity.slug = 'devi-mahatmya'
join public.entities object_entity on object_entity.slug = mapping.object_slug
join public.relationships relationship
  on relationship.subject_entity_id = subject_entity.id
  and relationship.object_entity_id = object_entity.id
  and relationship.predicate = 'contains_narrative_of'
  and relationship.publication_state = 'published'
where atlas_edge.source_node_id = source_node.id
  and atlas_edge.target_node_id = target_node.id
  and atlas_edge.label = 'contains narrative of'
  and atlas_edge.visual->>'sourceId' = mapping.edge_source_id;

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

  if app_node_count <> ${allNodes.length} then
    raise exception 'Expected ${allNodes.length} app-owned Living Atlas nodes, found %', app_node_count;
  end if;
  if app_edge_count <> ${worldEdges.length} then
    raise exception 'Expected ${worldEdges.length} app-owned Living Atlas edges, found %', app_edge_count;
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
  if (
    select count(*)
    from public.atlas_nodes atlas
    join public.entities entity on entity.id = atlas.entity_id and entity.slug = atlas.slug
    where atlas.slug = any (array[${DEVIMAHATMYA_SEMANTIC_NODE_SLUGS.map(sqlText).join(", ")}])
      and atlas.visual->>'gatewayId' = 'durga'
      and atlas.visual->>'evidenceBoundary' like '%Wikisource revision%'
  ) <> ${DEVIMAHATMYA_SEMANTIC_NODE_SLUGS.length} then
    raise exception 'Devimahatmya semantic Atlas nodes are not bound to their entities and source boundary';
  end if;
  if (
    select count(*)
    from public.atlas_edges edge
    join public.relationships relationship on relationship.id = edge.relationship_id
    join public.entities subject on subject.id = relationship.subject_entity_id
    join public.entities object on object.id = relationship.object_entity_id
    where edge.visual->>'sourceId' = any (array[${DEVIMAHATMYA_SEMANTIC_EDGE_IDS.map(sqlText).join(", ")}])
      and subject.slug = 'devi-mahatmya'
      and object.slug = any (array[${DEVIMAHATMYA_SEMANTIC_NODE_SLUGS.map(sqlText).join(", ")}])
      and relationship.predicate = 'contains_narrative_of'
  ) <> ${DEVIMAHATMYA_SEMANTIC_NODE_SLUGS.length} then
    raise exception 'Devimahatmya semantic Atlas edges are not bound to their evidence-linked relationships';
  end if;
  if not exists (
    select 1
    from public.atlas_nodes atlas
    join public.entities entity on entity.id = atlas.entity_id
    where atlas.slug = 'ganesha-purana'
      and entity.slug = 'ganesha-purana'
      and atlas.visual->>'gatewayId' = 'ganesha'
      and atlas.visual->>'searchQuery' = 'Ganesha Purana two khandas 247 chapters'
      and atlas.visual->>'evidenceBoundary' like '%65 pinned Wikisource revisions%'
  ) then
    raise exception 'Ganesha Purana Atlas node is not bound to its exact source entity and boundary';
  end if;
  if not exists (
    select 1
    from public.atlas_nodes atlas
    where atlas.slug = 'ganapatyatharvashirsha'
      and atlas.entity_id is null
      and atlas.visual->>'gatewayId' = 'ganesha'
      and atlas.visual->>'searchQuery' = 'Ganapati Atharvashirsha exact revision 415703'
      and atlas.visual->>'evidenceBoundary' like '%revision 415703%'
      and atlas.visual->>'evidenceBoundary' like '%pronunciation%'
      and atlas.visual->>'evidenceBoundary' like '%formal ritual authority%'
  ) then
    raise exception 'Ganapati Atharvashirsha Atlas node is missing its exact revision or authority boundary';
  end if;
  if not exists (
    select 1
    from public.atlas_nodes atlas
    where atlas.slug = 'dutt-ramayana'
      and atlas.entity_id is null
      and atlas.visual->>'gatewayId' = 'ramayana'
      and atlas.visual->>'searchQuery' = 'Manmatha Nath Dutt Ramayana seven kandas'
      and atlas.visual->>'evidenceBoundary' like '%literal SECTION defects remain%'
      and atlas.visual->>'evidenceBoundary' like '%print-scan reconciliation is incomplete%'
  ) then
    raise exception 'Dutt Ramayana Atlas node is missing its selected-edition boundary';
  end if;
  if (
    select count(*)
    from public.atlas_nodes atlas
    where atlas.slug = any (array[${DUTT_NARRATIVE_CONSTELLATION_NODE_SLUGS.map(sqlText).join(", ")}])
      and atlas.visual->>'gatewayId' = 'ramayana'
      and atlas.visual->>'evidenceBoundary' is not null
  ) <> ${DUTT_NARRATIVE_CONSTELLATION_NODE_SLUGS.length} then
    raise exception 'Dutt Ramayana narrative constellation nodes are missing or outside their selected-edition boundaries';
  end if;
  if (
    select count(*)
    from public.atlas_edges edge
    where edge.visual->>'sourceId' = any (array[${sourceAddressedAtlasEdgeIds.map(sqlText).join(", ")}])
      and edge.visual->>'sourceRef' like '%sha256:%'
  ) <> ${sourceAddressedAtlasEdgeIds.length} then
    raise exception 'Source-addressed Living Atlas edges are missing exact source addresses';
  end if;
  if (
    select count(*)
    from public.atlas_nodes atlas
    where atlas.slug = any (array[${DISTINCT_DIWALI_NODE_SLUGS.map(sqlText).join(", ")}])
      and atlas.entity_id is null
      and atlas.visual->>'gatewayId' = 'diwali'
      and atlas.visual->>'evidenceBoundary' is not null
  ) <> 5 or (
    select count(*)
    from public.atlas_edges edge
    where edge.visual->>'sourceId' = any (array[${DISTINCT_DIWALI_EDGE_IDS.map(sqlText).join(", ")}])
  ) <> 5 then
    raise exception 'Distinct Diwali Atlas lanes are missing or misrouted';
  end if;
  if (
    select count(*)
    from public.atlas_nodes atlas
    where atlas.slug = any (array[${SACRED_TIME_NODE_SLUGS.map(sqlText).join(", ")}])
      and atlas.visual->>'gatewayId' = 'sacred-time'
      and atlas.visual->>'evidenceBoundary' is not null
  ) <> ${SACRED_TIME_NODE_SLUGS.length} or (
    select count(*)
    from public.atlas_edges edge
    where edge.visual->>'sourceId' = any (array[${SACRED_TIME_EDGE_IDS.map(sqlText).join(", ")}])
      and edge.visual->>'sourceRef' ~ '^sha256:[0-9a-f]{64}#ritual-pack$'
  ) <> ${SACRED_TIME_EDGE_IDS.length} then
    raise exception 'Sacred Time Atlas lanes are missing, unbounded, or not source-addressed';
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
