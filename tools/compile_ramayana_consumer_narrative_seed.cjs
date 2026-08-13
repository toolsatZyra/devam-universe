const fs = require("node:fs");
const path = require("node:path");
const ts = require(path.resolve(__dirname, "../apps/web/node_modules/typescript"));

const ROOT = path.resolve(__dirname, "..");
const SNAPSHOT_SOURCE = path.join(ROOT, "apps/web/src/lib/content/ramayana-narrative-snapshot.ts");
const ATLAS_SOURCE = path.join(ROOT, "apps/web/src/data/atlas.ts");
const LIVING_CONNECTIONS_SOURCE = path.join(ROOT, "knowledge_packs/inventories/ramayana-living-connections-v1.json");
const OUTPUT = path.join(ROOT, "supabase/migrations/20260810220000_seed_ramayana_consumer_narrative.sql");
const CONTRACT = "DEVAM_RAMAYANA_CONSUMER_NARRATIVE_SNAPSHOT_V1";
const LIVING_CONNECTIONS_CONTRACT = "DEVAM_RAMAYANA_LIVING_CONNECTIONS_V1";

const moduleCache = new Map();

function loadTypescriptModule(filename) {
  const resolved = path.resolve(filename);
  if (moduleCache.has(resolved)) return moduleCache.get(resolved).exports;
  const source = fs.readFileSync(resolved, "utf8");
  const javascript = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const loaded = { exports: {} };
  moduleCache.set(resolved, loaded);
  const localRequire = (specifier) => {
    if (specifier.startsWith("@/")) {
      return loadTypescriptModule(path.join(ROOT, "apps/web/src", `${specifier.slice(2)}.ts`));
    }
    if (specifier.startsWith(".")) {
      return loadTypescriptModule(path.join(path.dirname(resolved), `${specifier}.ts`));
    }
    return require(specifier);
  };
  new Function("exports", "module", "require", javascript)(loaded.exports, loaded, localRequire);
  return loaded.exports;
}

function sqlText(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlJson(value) {
  return `${sqlText(JSON.stringify(value))}::jsonb`;
}

function turnSlug(id) {
  return `turn-${id}`;
}

function sceneSlug(id) {
  return `scene-${id}`;
}

function facetPathLinks(turns, field, kind) {
  const turnsByFacet = new Map();
  for (const turn of turns) {
    for (const facet of new Set(turn[field])) {
      const path = turnsByFacet.get(facet) ?? [];
      path.push(turnSlug(turn.id));
      turnsByFacet.set(facet, path);
    }
  }
  const grouped = new Map();
  for (const [facet, path] of [...turnsByFacet].sort(([left], [right]) => left.localeCompare(right))) {
    for (let index = 0; index < path.length - 1; index += 1) {
      const source = path[index];
      const target = path[index + 1];
      if (source === target) continue;
      const key = `${source}\u0000${target}\u0000${kind}`;
      const row = grouped.get(key) ?? { source, target, kind, labels: [] };
      row.labels.push(facet);
      grouped.set(key, row);
    }
  }
  return [...grouped.values()].map((row) => ({
    ...row,
    label: `generated:${[...new Set(row.labels)].sort().join(" | ")}`,
  }));
}

function validateSnapshot(snapshot) {
  if (snapshot.contract !== CONTRACT) throw new Error("Unexpected Ramayana snapshot contract");
  if (snapshot.counters.arcs !== 7 || snapshot.counters.backboneTurns !== 49) {
    throw new Error("Unexpected Ramayana backbone shape");
  }
  if (snapshot.counters.playableTurns !== 49
    || snapshot.counters.outlinedTurns !== 0
    || snapshot.counters.orientationOnlyTurns !== 0) {
    throw new Error("Unexpected Ramayana playable-turn boundary");
  }
  if (snapshot.counters.playableScenes !== 500
    || snapshot.counters.draftSceneOutlines !== 0
    || snapshot.counters.bilingualBeats !== 2243) {
    throw new Error("Unexpected Ramayana detailed-content shape");
  }
  const momentSlugs = [
    ...snapshot.turns.map((turn) => turnSlug(turn.id)),
    ...snapshot.turns.flatMap((turn) => turn.scenes.map((scene) => sceneSlug(scene.id))),
  ];
  if (new Set(momentSlugs).size !== 549) throw new Error("Narrative moment slugs must be unique");
  for (const turn of snapshot.turns) {
    const expectedReadiness = turn.coverage === "playable"
      ? "playable"
      : turn.coverage === "outlined"
        ? "outlined"
        : undefined;
    if ((expectedReadiness === undefined) !== (turn.scenes.length === 0)
      || (expectedReadiness && turn.scenes.some((scene) => scene.readiness !== expectedReadiness))) {
      throw new Error(`Turn coverage is inconsistent: ${turn.id}`);
    }
    for (const scene of turn.scenes) {
      const exactSpanSet = scene.source.sourceAddressKind === "section_span_set";
      const expectedSpanCount = scene.source.sourceEndOrdinal - scene.source.sourceOrdinal + 1;
      const spanSetIsValid = Array.isArray(scene.source.spanSha256s)
        && scene.source.spanSha256s.length === expectedSpanCount
        && scene.source.spanSha256s.every((hash) => /^[0-9a-f]{64}$/.test(hash));
      const legacySpanIsValid = /^[0-9a-f]{64}$/.test(scene.source.spanSha256);
      if (!/^[0-9a-f]{64}$/.test(scene.source.sourceSha256)
        || (scene.readiness === "playable" && (exactSpanSet ? !spanSetIsValid : !legacySpanIsValid))) {
        throw new Error(`Scene source address is invalid: ${scene.id}`);
      }
      if (!scene.narrative.en.trim() || !scene.narrative.hi.trim()) {
        throw new Error(`Scene narrative is not bilingual: ${scene.id}`);
      }
    }
  }
}

function validateLivingConnections(snapshot, pack, atlasNodeIds) {
  if (pack.contract !== LIVING_CONNECTIONS_CONTRACT || pack.series_slug !== snapshot.series.id) {
    throw new Error("Unexpected Ramayana living-connections contract");
  }
  if (!Array.isArray(pack.connections) || pack.connections.length < 5) {
    throw new Error("Ramayana living-connections pack is too small");
  }
  const narrativeMomentSlugs = new Set(snapshot.turns.flatMap((turn) => [
    turnSlug(turn.id),
    ...turn.scenes.map((scene) => sceneSlug(scene.id)),
  ]));
  const allowedKinds = new Set(["festival", "performance", "devotional_text", "practice", "place", "history"]);
  const keys = new Set();
  for (const connection of pack.connections) {
    const key = `${connection.moment_slug}\u0000${connection.atlas_node_slug}\u0000${connection.relation_kind}`;
    if (keys.has(key)) throw new Error(`Duplicate Ramayana living connection: ${key}`);
    keys.add(key);
    if (!narrativeMomentSlugs.has(connection.moment_slug)) {
      throw new Error(`Unknown Ramayana living-connection moment: ${connection.moment_slug}`);
    }
    if (!atlasNodeIds.has(connection.atlas_node_slug)) {
      throw new Error(`Unknown Ramayana living-connection Atlas node: ${connection.atlas_node_slug}`);
    }
    if (!allowedKinds.has(connection.relation_kind)) {
      throw new Error(`Unknown Ramayana living-connection kind: ${connection.relation_kind}`);
    }
    for (const language of ["en", "hi"]) {
      const label = connection.label?.[language];
      if (typeof label !== "string" || label.trim().length < 20 || label.length > 240) {
        throw new Error(`Invalid ${language} Ramayana living-connection label: ${key}`);
      }
    }
  }
}

function exactDuplicateGroups(items, valueOf) {
  const groups = new Map();
  for (const item of items) {
    const value = valueOf(item);
    const ids = groups.get(value) ?? [];
    ids.push(item.id);
    groups.set(value, ids);
  }
  return [...groups.values()].filter((ids) => ids.length > 1);
}

function lengthSummary(values) {
  const sorted = [...values].sort((left, right) => left - right);
  const percentile = (fraction) => sorted[Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * fraction))];
  return { minimum: sorted[0], p10: percentile(0.1), median: percentile(0.5), maximum: sorted.at(-1) };
}

function buildMigration() {
  const { buildRamayanaNarrativeSnapshot } = loadTypescriptModule(SNAPSHOT_SOURCE);
  const { worldNodes, gateways } = loadTypescriptModule(ATLAS_SOURCE);
  const snapshot = buildRamayanaNarrativeSnapshot();
  const livingConnections = JSON.parse(fs.readFileSync(LIVING_CONNECTIONS_SOURCE, "utf8"));
  validateSnapshot(snapshot);
  validateLivingConnections(
    snapshot,
    livingConnections,
    new Set([...worldNodes, ...gateways].map((node) => node.id)),
  );

  const arcRows = snapshot.arcs.map((arc) => `(${[
    sqlText(arc.id),
    arc.ordinal,
    sqlText(arc.title.en),
    sqlJson({ snapshotContract: CONTRACT, turnIds: arc.turnIds }),
  ].join(", ")})`).join(",\n  ");
  const arcTextRows = snapshot.arcs.flatMap((arc) => ["en", "hi"].map((language) => `(${[
    sqlText(arc.id),
    sqlText(language),
    sqlText(arc.title[language]),
    sqlText(arc.invitation[language]),
  ].join(", ")})`)).join(",\n  ");
  const arcSlugArray = snapshot.arcs.map((arc) => sqlText(arc.id)).join(", ");

  const turnRows = snapshot.turns.map((turn) => `(${[
    sqlText(turnSlug(turn.id)),
    sqlText(turn.arcId),
    turn.backboneOrdinal,
    turn.turnOrdinalInArc,
    sqlJson({ snapshotContract: CONTRACT, ...turn.sourceRange }),
    sqlJson({
      coverage: turn.coverage,
      sceneCount: turn.scenes.length,
      characters: turn.characters,
      places: turn.places,
      threads: turn.threads,
    }),
    sqlText(turn.coverage === "playable" ? "published" : "draft"),
  ].join(", ")})`).join(",\n  ");

  const sceneRows = snapshot.turns.flatMap((turn) => turn.scenes.map((scene) => `(${[
    sqlText(sceneSlug(scene.id)),
    sqlText(turnSlug(turn.id)),
    sqlText(turn.arcId),
    turn.backboneOrdinal,
    turn.turnOrdinalInArc,
    scene.detailOrdinal,
    sqlJson({ snapshotContract: CONTRACT, ...scene.source }),
    sqlJson({ readiness: scene.readiness, nodeIds: scene.nodeIds, characters: scene.characters, places: scene.places }),
    sqlText(scene.readiness === "playable" ? "published" : "draft"),
  ].join(", ")})`)).join(",\n  ");

  const momentTextRows = snapshot.turns.flatMap((turn) => {
    const publication = turn.coverage === "playable" ? "published" : "draft";
    const status = turn.coverage === "playable" ? "source_aligned" : "draft";
    const turnTexts = ["en", "hi"].map((language) => `(${[
      sqlText(turnSlug(turn.id)),
      sqlText(language),
      sqlText(turn.title[language]),
      sqlText(turn.synopsis[language]),
      sqlText(turn.synopsis[language]),
      sqlText(status),
      sqlText(publication),
    ].join(", ")})`);
    const sceneTexts = turn.scenes.flatMap((scene) => {
      const scenePublication = scene.readiness === "playable" ? "published" : "draft";
      const sceneStatus = scene.readiness === "playable" ? "source_aligned" : "draft";
      return ["en", "hi"].map((language) => `(${[
      sqlText(sceneSlug(scene.id)),
      sqlText(language),
      sqlText(scene.title[language]),
      sqlText(scene.synopsis[language]),
      sqlText(scene.narrative[language]),
      sqlText(sceneStatus),
      sqlText(scenePublication),
    ].join(", ")})`);
    });
    return [...turnTexts, ...sceneTexts];
  }).join(",\n  ");

  const beatRows = snapshot.turns.flatMap((turn) => turn.scenes.flatMap((scene) => scene.beats.map((beat) => `(${[
    sqlText(sceneSlug(scene.id)),
    sqlText(beat.id),
    beat.ordinal,
    sqlJson({ snapshotContract: CONTRACT, ...scene.source }),
    sqlJson({ visualCue: beat.visualCue, characterIds: beat.characterIds }),
  ].join(", ")})`))).join(",\n  ");
  const beatKeyRows = snapshot.turns.flatMap((turn) => turn.scenes.flatMap((scene) => scene.beats.map((beat) =>
    `(${sqlText(sceneSlug(scene.id))}, ${sqlText(beat.id)})`,
  ))).join(",\n  ");

  const beatTextRows = snapshot.turns.flatMap((turn) => turn.scenes.flatMap((scene) => scene.beats.flatMap((beat) => ["en", "hi"].map((language) => `(${[
    sqlText(sceneSlug(scene.id)),
    sqlText(beat.id),
    sqlText(language),
    sqlText(beat.title[language]),
    sqlText(beat.narration[language]),
  ].join(", ")})`)))).join(",\n  ");

  const orderLinks = [];
  for (let index = 0; index < snapshot.turns.length - 1; index += 1) {
    orderLinks.push({
      source: turnSlug(snapshot.turns[index].id),
      target: turnSlug(snapshot.turns[index + 1].id),
      kind: "precedes",
      label: "generated:story-order",
    });
  }
  for (const turn of snapshot.turns) {
    for (let index = 0; index < turn.scenes.length - 1; index += 1) {
      orderLinks.push({
        source: sceneSlug(turn.scenes[index].id),
        target: sceneSlug(turn.scenes[index + 1].id),
        kind: "precedes",
        label: "generated:story-order",
      });
    }
  }
  const multidimensionalLinks = [
    ...facetPathLinks(snapshot.turns, "characters", "character_path"),
    ...facetPathLinks(snapshot.turns, "places", "place_echo"),
    ...facetPathLinks(snapshot.turns, "threads", "parallel_thread"),
  ];
  const generatedLinks = [...orderLinks, ...multidimensionalLinks];
  const linkRows = generatedLinks.map((row) => `(${[
    sqlText(row.source),
    sqlText(row.target),
    sqlText(row.kind),
    sqlText(row.label),
  ].join(", ")})`).join(",\n  ");
  const momentSlugArray = snapshot.turns.flatMap((turn) => [
    turnSlug(turn.id),
    ...turn.scenes.map((scene) => sceneSlug(scene.id)),
  ]).map(sqlText).join(", ");
  const displayOrdinalByMoment = new Map();
  const livingConnectionRows = livingConnections.connections.map((connection) => {
    const displayOrdinal = (displayOrdinalByMoment.get(connection.moment_slug) ?? 0) + 1;
    displayOrdinalByMoment.set(connection.moment_slug, displayOrdinal);
    return `(${[
      sqlText(connection.moment_slug),
      sqlText(connection.atlas_node_slug),
      sqlText(connection.relation_kind),
      sqlText(connection.label.en),
      sqlText(connection.label.hi),
      displayOrdinal,
    ].join(", ")})`;
  }).join(",\n  ");

  return `-- Generated from the app-owned Ramayana story world by
-- tools/compile_ramayana_consumer_narrative_seed.cjs.
-- This migration stores compact bilingual consumer narrative data. It does not
-- copy source-vault bytes or claim that the remaining ${snapshot.counters.outlinedTurns + snapshot.counters.orientationOnlyTurns} turns are complete.
-- ${snapshot.counters.draftSceneOutlines} draft scene outlines partition ${snapshot.counters.outlinedTurns} of those unfinished turns, but
-- remain hidden from the public read path until complete bilingual beats exist.

begin;

insert into public.narrative_series (
  slug, canonical_title, narrative_kind, selected_expression_boundary,
  total_source_units, coverage_state, rights_lane, publication_state
)
values (
  ${sqlText(snapshot.series.id)}, 'Ramayana', 'epic', ${sqlText(snapshot.series.sourceBoundary)},
  ${snapshot.series.totalSourceUnits}, 'story_mapped', 'derivative_allowed', 'published'
)
on conflict (slug) do update set
  canonical_title = excluded.canonical_title,
  narrative_kind = excluded.narrative_kind,
  selected_expression_boundary = excluded.selected_expression_boundary,
  total_source_units = excluded.total_source_units,
  coverage_state = excluded.coverage_state,
  rights_lane = excluded.rights_lane,
  publication_state = excluded.publication_state,
  updated_at = now();

delete from public.narrative_arcs arc
using public.narrative_series series
where arc.series_id = series.id
  and series.slug = ${sqlText(snapshot.series.id)}
  and arc.source_range->>'snapshotContract' = ${sqlText(CONTRACT)}
  and not (arc.slug = any (array[${arcSlugArray}]));

insert into public.narrative_arcs (
  series_id, slug, arc_ordinal, canonical_title, source_range, rights_lane, publication_state
)
select series.id, arc.slug, arc.arc_ordinal, arc.canonical_title, arc.source_range,
  'derivative_allowed', 'published'
from (values
  ${arcRows}
) as arc(slug, arc_ordinal, canonical_title, source_range)
join public.narrative_series series on series.slug = ${sqlText(snapshot.series.id)}
on conflict (series_id, slug) do update set
  arc_ordinal = excluded.arc_ordinal,
  canonical_title = excluded.canonical_title,
  source_range = excluded.source_range,
  rights_lane = excluded.rights_lane,
  publication_state = excluded.publication_state,
  updated_at = now();

insert into public.narrative_arc_texts (
  arc_id, language_code, title, invitation, text_status,
  rights_lane, publication_state
)
select arc.id, copy.language_code, copy.title, copy.invitation,
  'source_aligned', 'derivative_allowed', 'published'
from (values
  ${arcTextRows}
) as copy(arc_slug, language_code, title, invitation)
join public.narrative_series series on series.slug = ${sqlText(snapshot.series.id)}
join public.narrative_arcs arc on arc.series_id = series.id and arc.slug = copy.arc_slug
on conflict (arc_id, language_code) do update set
  title = excluded.title,
  invitation = excluded.invitation,
  text_status = excluded.text_status,
  rights_lane = excluded.rights_lane,
  publication_state = excluded.publication_state,
  updated_at = now();

delete from public.narrative_moments moment
using public.narrative_series series
where moment.series_id = series.id
  and series.slug = ${sqlText(snapshot.series.id)}
  and moment.source_range->>'snapshotContract' = ${sqlText(CONTRACT)}
  and not (moment.slug = any (array[${momentSlugArray}]));

insert into public.narrative_moments (
  series_id, arc_id, slug, moment_kind, backbone_ordinal, turn_ordinal_in_arc,
  detail_ordinal, source_range, compression_note, visual_direction,
  rights_lane, publication_state
)
select series.id, arc.id, turn.slug, 'backbone_turn', turn.backbone_ordinal,
  turn.turn_ordinal_in_arc, 0, turn.source_range,
  case when turn.publication_state = 'draft' then 'Orientation only; substantial bilingual story content is not complete.' end,
  turn.visual_direction, 'derivative_allowed', turn.publication_state::public.publication_state
from (values
  ${turnRows}
) as turn(slug, arc_slug, backbone_ordinal, turn_ordinal_in_arc, source_range, visual_direction, publication_state)
join public.narrative_series series on series.slug = ${sqlText(snapshot.series.id)}
join public.narrative_arcs arc on arc.series_id = series.id and arc.slug = turn.arc_slug
on conflict (series_id, slug) do update set
  arc_id = excluded.arc_id,
  moment_kind = excluded.moment_kind,
  backbone_ordinal = excluded.backbone_ordinal,
  turn_ordinal_in_arc = excluded.turn_ordinal_in_arc,
  detail_ordinal = excluded.detail_ordinal,
  source_range = excluded.source_range,
  compression_note = excluded.compression_note,
  visual_direction = excluded.visual_direction,
  rights_lane = excluded.rights_lane,
  publication_state = excluded.publication_state,
  updated_at = now();

insert into public.narrative_moments (
  series_id, arc_id, parent_moment_id, slug, moment_kind, backbone_ordinal,
  turn_ordinal_in_arc, detail_ordinal, source_range, visual_direction,
  rights_lane, publication_state
)
select series.id, arc.id, parent.id, scene.slug, 'playable_scene', scene.backbone_ordinal,
  scene.turn_ordinal_in_arc, scene.detail_ordinal, scene.source_range,
  scene.visual_direction, 'derivative_allowed', scene.publication_state::public.publication_state
from (values
  ${sceneRows}
) as scene(slug, parent_slug, arc_slug, backbone_ordinal, turn_ordinal_in_arc, detail_ordinal, source_range, visual_direction, publication_state)
join public.narrative_series series on series.slug = ${sqlText(snapshot.series.id)}
join public.narrative_arcs arc on arc.series_id = series.id and arc.slug = scene.arc_slug
join public.narrative_moments parent on parent.series_id = series.id and parent.slug = scene.parent_slug
on conflict (series_id, slug) do update set
  arc_id = excluded.arc_id,
  parent_moment_id = excluded.parent_moment_id,
  moment_kind = excluded.moment_kind,
  backbone_ordinal = excluded.backbone_ordinal,
  turn_ordinal_in_arc = excluded.turn_ordinal_in_arc,
  detail_ordinal = excluded.detail_ordinal,
  source_range = excluded.source_range,
  visual_direction = excluded.visual_direction,
  rights_lane = excluded.rights_lane,
  publication_state = excluded.publication_state,
  updated_at = now();

insert into public.narrative_moment_texts (
  moment_id, language_code, title, synopsis, narrative, text_status,
  rights_lane, publication_state
)
select moment.id, copy.language_code, copy.title, copy.synopsis, copy.narrative,
  copy.text_status, 'derivative_allowed', copy.publication_state::public.publication_state
from (values
  ${momentTextRows}
) as copy(moment_slug, language_code, title, synopsis, narrative, text_status, publication_state)
join public.narrative_series series on series.slug = ${sqlText(snapshot.series.id)}
join public.narrative_moments moment on moment.series_id = series.id and moment.slug = copy.moment_slug
on conflict (moment_id, language_code) do update set
  title = excluded.title,
  synopsis = excluded.synopsis,
  narrative = excluded.narrative,
  text_status = excluded.text_status,
  rights_lane = excluded.rights_lane,
  publication_state = excluded.publication_state,
  updated_at = now();

with expected(moment_slug, beat_slug) as (values
  ${beatKeyRows}
)
delete from public.narrative_beats beat
using public.narrative_moments moment, public.narrative_series series
where beat.moment_id = moment.id
  and moment.series_id = series.id
  and series.slug = ${sqlText(snapshot.series.id)}
  and beat.source_range->>'snapshotContract' = ${sqlText(CONTRACT)}
  and not exists (
    select 1 from expected
    where expected.moment_slug = moment.slug and expected.beat_slug = beat.slug
  );

insert into public.narrative_beats (
  moment_id, slug, beat_ordinal, source_range, visual_direction,
  rights_lane, publication_state
)
select moment.id, beat.slug, beat.beat_ordinal, beat.source_range,
  beat.visual_direction, 'derivative_allowed', 'published'
from (values
  ${beatRows}
) as beat(moment_slug, slug, beat_ordinal, source_range, visual_direction)
join public.narrative_series series on series.slug = ${sqlText(snapshot.series.id)}
join public.narrative_moments moment on moment.series_id = series.id and moment.slug = beat.moment_slug
on conflict (moment_id, slug) do update set
  beat_ordinal = excluded.beat_ordinal,
  source_range = excluded.source_range,
  visual_direction = excluded.visual_direction,
  rights_lane = excluded.rights_lane,
  publication_state = excluded.publication_state,
  updated_at = now();

insert into public.narrative_beat_texts (
  beat_id, language_code, title, narration, text_status,
  rights_lane, publication_state
)
select beat.id, copy.language_code, copy.title, copy.narration,
  'source_aligned', 'derivative_allowed', 'published'
from (values
  ${beatTextRows}
) as copy(moment_slug, beat_slug, language_code, title, narration)
join public.narrative_series series on series.slug = ${sqlText(snapshot.series.id)}
join public.narrative_moments moment on moment.series_id = series.id and moment.slug = copy.moment_slug
join public.narrative_beats beat on beat.moment_id = moment.id and beat.slug = copy.beat_slug
on conflict (beat_id, language_code) do update set
  title = excluded.title,
  narration = excluded.narration,
  text_status = excluded.text_status,
  rights_lane = excluded.rights_lane,
  publication_state = excluded.publication_state,
  updated_at = now();

delete from public.narrative_moment_links link
using public.narrative_moments source, public.narrative_series series
where link.source_moment_id = source.id
  and source.series_id = series.id
  and series.slug = ${sqlText(snapshot.series.id)}
  and (link.label = 'generated narrative order' or link.label like 'generated:%');

insert into public.narrative_moment_links (
  source_moment_id, target_moment_id, link_kind, label
)
select source.id, target.id, link.link_kind, link.label
from (values
  ${linkRows}
) as link(source_slug, target_slug, link_kind, label)
join public.narrative_series series on series.slug = ${sqlText(snapshot.series.id)}
join public.narrative_moments source on source.series_id = series.id and source.slug = link.source_slug
join public.narrative_moments target on target.series_id = series.id and target.slug = link.target_slug
on conflict (source_moment_id, target_moment_id, link_kind) do update set
  label = excluded.label;

delete from public.narrative_moment_atlas_links bridge
using public.narrative_moments moment, public.narrative_series series
where bridge.moment_id = moment.id
  and moment.series_id = series.id
  and series.slug = ${sqlText(snapshot.series.id)}
  and bridge.source_key = ${sqlText(LIVING_CONNECTIONS_CONTRACT)};

insert into public.narrative_moment_atlas_links (
  moment_id, atlas_node_id, relation_kind, relation_label_en,
  relation_label_hi, display_ordinal, source_key
)
select moment.id, atlas.id, bridge.relation_kind, bridge.relation_label_en,
  bridge.relation_label_hi, bridge.display_ordinal, ${sqlText(LIVING_CONNECTIONS_CONTRACT)}
from (values
  ${livingConnectionRows}
) as bridge(moment_slug, atlas_node_slug, relation_kind, relation_label_en, relation_label_hi, display_ordinal)
join public.narrative_series series on series.slug = ${sqlText(snapshot.series.id)}
join public.narrative_moments moment on moment.series_id = series.id and moment.slug = bridge.moment_slug
join public.atlas_nodes atlas on atlas.slug = bridge.atlas_node_slug
on conflict (moment_id, atlas_node_id, relation_kind) do update set
  relation_label_en = excluded.relation_label_en,
  relation_label_hi = excluded.relation_label_hi,
  display_ordinal = excluded.display_ordinal,
  source_key = excluded.source_key,
  updated_at = now();

do $$
declare
  series_uuid uuid;
begin
  select id into series_uuid from public.narrative_series where slug = ${sqlText(snapshot.series.id)};
  if series_uuid is null then raise exception 'Ramayana narrative series is missing'; end if;
  if (select count(*) from public.narrative_arcs where series_id = series_uuid) <> 7 then
    raise exception 'Expected 7 Ramayana narrative arcs';
  end if;
  if (select count(*) from public.narrative_arc_texts copy join public.narrative_arcs arc on arc.id = copy.arc_id where arc.series_id = series_uuid) <> 14 then
    raise exception 'Expected 14 bilingual Ramayana arc texts';
  end if;
  if (select count(*) from public.narrative_moments where series_id = series_uuid and moment_kind = 'backbone_turn') <> 49 then
    raise exception 'Expected 49 Ramayana backbone turns';
  end if;
  if (select count(*) from public.narrative_moments where series_id = series_uuid and moment_kind = 'backbone_turn' and publication_state = 'published') <> ${snapshot.counters.playableTurns} then
    raise exception 'Expected ${snapshot.counters.playableTurns} playable Ramayana turns';
  end if;
  if (select count(*) from public.narrative_moments where series_id = series_uuid and moment_kind = 'backbone_turn' and publication_state = 'draft') <> ${snapshot.counters.outlinedTurns + snapshot.counters.orientationOnlyTurns} then
    raise exception 'Expected ${snapshot.counters.outlinedTurns + snapshot.counters.orientationOnlyTurns} unfinished Ramayana turns';
  end if;
  if (select count(*) from public.narrative_moments where series_id = series_uuid and moment_kind = 'backbone_turn' and visual_direction->>'coverage' = 'outlined') <> ${snapshot.counters.outlinedTurns} then
    raise exception 'Expected ${snapshot.counters.outlinedTurns} outlined Ramayana turns';
  end if;
  if (select count(*) from public.narrative_moments where series_id = series_uuid and moment_kind = 'backbone_turn' and visual_direction->>'coverage' = 'orientation') <> ${snapshot.counters.orientationOnlyTurns} then
    raise exception 'Expected ${snapshot.counters.orientationOnlyTurns} orientation-only Ramayana turns';
  end if;
  if (select count(*) from public.narrative_moments where series_id = series_uuid and moment_kind = 'playable_scene' and publication_state = 'published') <> ${snapshot.counters.playableScenes} then
    raise exception 'Expected ${snapshot.counters.playableScenes} Ramayana playable scenes';
  end if;
  if (select count(*) from public.narrative_moments where series_id = series_uuid and moment_kind = 'playable_scene' and publication_state = 'draft') <> ${snapshot.counters.draftSceneOutlines} then
    raise exception 'Expected ${snapshot.counters.draftSceneOutlines} draft Ramayana scene outlines';
  end if;
  if (select count(*) from public.narrative_beats beat join public.narrative_moments moment on moment.id = beat.moment_id where moment.series_id = series_uuid) <> ${snapshot.counters.bilingualBeats} then
    raise exception 'Expected ${snapshot.counters.bilingualBeats} Ramayana narrative beats';
  end if;
  if (select count(*) from public.narrative_moment_texts copy join public.narrative_moments moment on moment.id = copy.moment_id where moment.series_id = series_uuid) <> ${(snapshot.counters.backboneTurns + snapshot.counters.playableScenes + snapshot.counters.draftSceneOutlines) * 2} then
    raise exception 'Expected ${(snapshot.counters.backboneTurns + snapshot.counters.playableScenes + snapshot.counters.draftSceneOutlines) * 2} bilingual Ramayana moment texts';
  end if;
  if (select count(*) from public.narrative_beat_texts copy join public.narrative_beats beat on beat.id = copy.beat_id join public.narrative_moments moment on moment.id = beat.moment_id where moment.series_id = series_uuid) <> ${snapshot.counters.bilingualBeats * 2} then
    raise exception 'Expected ${snapshot.counters.bilingualBeats * 2} bilingual Ramayana beat texts';
  end if;
  if (select count(*) from public.narrative_moment_links link join public.narrative_moments source on source.id = link.source_moment_id where source.series_id = series_uuid and link.label like 'generated:%') <> ${generatedLinks.length} then
    raise exception 'Expected ${generatedLinks.length} Ramayana narrative traversal links';
  end if;
  if (select count(*) from public.narrative_moment_atlas_links bridge join public.narrative_moments moment on moment.id = bridge.moment_id where moment.series_id = series_uuid and bridge.source_key = ${sqlText(LIVING_CONNECTIONS_CONTRACT)}) <> ${livingConnections.connections.length} then
    raise exception 'Expected ${livingConnections.connections.length} Ramayana living Atlas connections';
  end if;
  if exists (
    select 1 from public.narrative_moments
    where series_id = series_uuid and moment_kind = 'playable_scene' and publication_state = 'published'
      and (
        coalesce(source_range->>'sourceSha256', '') !~ '^[0-9a-f]{64}$'
        or not coalesce(
          case when source_range->>'sourceAddressKind' = 'section_span_set' then
            jsonb_typeof(source_range->'spanSha256s') = 'array'
            and jsonb_array_length(source_range->'spanSha256s') =
              (source_range->>'sourceEndOrdinal')::integer - (source_range->>'sourceOrdinal')::integer + 1
            and not exists (
              select 1 from jsonb_array_elements_text(source_range->'spanSha256s') hash(value)
              where hash.value !~ '^[0-9a-f]{64}$'
            )
          else coalesce(source_range->>'spanSha256', '') ~ '^[0-9a-f]{64}$'
          end,
          false
        )
      )
  ) then raise exception 'A playable Ramayana scene lacks an exact source address'; end if;
end
$$;

commit;
`;
}

if (process.argv.includes("--stats")) {
  const { buildRamayanaNarrativeSnapshot } = loadTypescriptModule(SNAPSHOT_SOURCE);
  const snapshot = buildRamayanaNarrativeSnapshot();
  const livingConnections = JSON.parse(fs.readFileSync(LIVING_CONNECTIONS_SOURCE, "utf8"));
  const scenes = snapshot.turns.flatMap((turn) => turn.scenes);
  const beats = scenes.flatMap((scene) => scene.beats);
  console.log(JSON.stringify({
    counters: snapshot.counters,
    traversalLinks: {
      storyOrder: snapshot.turns.length - 1
        + snapshot.turns.reduce((count, turn) => count + Math.max(0, turn.scenes.length - 1), 0),
      characterPaths: facetPathLinks(snapshot.turns, "characters", "character_path").length,
      placePaths: facetPathLinks(snapshot.turns, "places", "place_echo").length,
      parallelThreads: facetPathLinks(snapshot.turns, "threads", "parallel_thread").length,
      livingAtlas: livingConnections.connections.length,
    },
    narrativeQuality: {
      exactDuplicateEnglishTitles: exactDuplicateGroups(scenes, (scene) => scene.title.en),
      exactDuplicateHindiTitles: exactDuplicateGroups(scenes, (scene) => scene.title.hi),
      exactDuplicateEnglishNarratives: exactDuplicateGroups(scenes, (scene) => scene.narrative.en),
      exactDuplicateHindiNarratives: exactDuplicateGroups(scenes, (scene) => scene.narrative.hi),
      englishNarrativeCharacters: lengthSummary(scenes.map((scene) => scene.narrative.en.length)),
      hindiNarrativeCharacters: lengthSummary(scenes.map((scene) => scene.narrative.hi.length)),
      beatsPerScene: lengthSummary(scenes.map((scene) => scene.beats.length)),
      englishBeatCharacters: lengthSummary(beats.map((beat) => beat.narration.en.length)),
      hindiBeatCharacters: lengthSummary(beats.map((beat) => beat.narration.hi.length)),
    },
    scenesWithoutPlaces: scenes.filter((scene) => scene.places.length === 0).map((scene) => scene.id),
    places: [...new Set(scenes.flatMap((scene) => scene.places))].sort(),
    characters: [...new Set(scenes.flatMap((scene) => scene.characters))].sort(),
  }, null, 2));
} else if (process.argv.includes("--check")) {
  const generated = buildMigration();
  if (!fs.existsSync(OUTPUT) || fs.readFileSync(OUTPUT, "utf8") !== generated) {
    throw new Error("Ramayana consumer narrative seed migration is stale or missing");
  }
  console.log("PASS: Ramayana consumer narrative seed migration is current");
} else {
  const generated = buildMigration();
  fs.writeFileSync(OUTPUT, generated, { encoding: "utf8", flag: "w" });
  console.log(path.relative(ROOT, OUTPUT).replaceAll("\\", "/"));
}
