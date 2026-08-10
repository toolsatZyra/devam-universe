const fs = require("node:fs");
const path = require("node:path");
const ts = require(path.resolve(__dirname, "../apps/web/node_modules/typescript"));

const ROOT = path.resolve(__dirname, "..");
const SNAPSHOT_SOURCE = path.join(ROOT, "apps/web/src/lib/content/ramayana-narrative-snapshot.ts");
const OUTPUT = path.join(ROOT, "supabase/migrations/20260810220000_seed_ramayana_consumer_narrative.sql");
const CONTRACT = "DEVAM_RAMAYANA_CONSUMER_NARRATIVE_SNAPSHOT_V1";

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

function validateSnapshot(snapshot) {
  if (snapshot.contract !== CONTRACT) throw new Error("Unexpected Ramayana snapshot contract");
  if (snapshot.counters.arcs !== 7 || snapshot.counters.backboneTurns !== 49) {
    throw new Error("Unexpected Ramayana backbone shape");
  }
  if (snapshot.counters.playableTurns !== 17
    || snapshot.counters.outlinedTurns !== 3
    || snapshot.counters.orientationOnlyTurns !== 29) {
    throw new Error("Unexpected Ramayana playable-turn boundary");
  }
  if (snapshot.counters.playableScenes !== 77
    || snapshot.counters.draftSceneOutlines !== 20
    || snapshot.counters.bilingualBeats !== 375) {
    throw new Error("Unexpected Ramayana detailed-content shape");
  }
  const momentSlugs = [
    ...snapshot.turns.map((turn) => turnSlug(turn.id)),
    ...snapshot.turns.flatMap((turn) => turn.scenes.map((scene) => sceneSlug(scene.id))),
  ];
  if (new Set(momentSlugs).size !== 146) throw new Error("Narrative moment slugs must be unique");
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

function buildMigration() {
  const { buildRamayanaNarrativeSnapshot } = loadTypescriptModule(SNAPSHOT_SOURCE);
  const snapshot = buildRamayanaNarrativeSnapshot();
  validateSnapshot(snapshot);

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
    sqlJson({ coverage: turn.coverage, sceneCount: turn.scenes.length }),
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
    orderLinks.push([turnSlug(snapshot.turns[index].id), turnSlug(snapshot.turns[index + 1].id)]);
  }
  for (const turn of snapshot.turns) {
    for (let index = 0; index < turn.scenes.length - 1; index += 1) {
      orderLinks.push([sceneSlug(turn.scenes[index].id), sceneSlug(turn.scenes[index + 1].id)]);
    }
  }
  const linkRows = orderLinks.map(([source, target]) => `(${sqlText(source)}, ${sqlText(target)})`).join(",\n  ");
  const momentSlugArray = snapshot.turns.flatMap((turn) => [
    turnSlug(turn.id),
    ...turn.scenes.map((scene) => sceneSlug(scene.id)),
  ]).map(sqlText).join(", ");

  return `-- Generated from the app-owned Ramayana story world by
-- tools/compile_ramayana_consumer_narrative_seed.cjs.
-- This migration stores compact bilingual consumer narrative data. It does not
-- copy source-vault bytes or claim that the remaining 32 turns are complete.
-- Twenty draft scene outlines partition three of those unfinished turns, but
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
  and link.label = 'generated narrative order';

insert into public.narrative_moment_links (
  source_moment_id, target_moment_id, link_kind, label
)
select source.id, target.id, 'precedes', 'generated narrative order'
from (values
  ${linkRows}
) as link(source_slug, target_slug)
join public.narrative_series series on series.slug = ${sqlText(snapshot.series.id)}
join public.narrative_moments source on source.series_id = series.id and source.slug = link.source_slug
join public.narrative_moments target on target.series_id = series.id and target.slug = link.target_slug
on conflict (source_moment_id, target_moment_id, link_kind) do update set
  label = excluded.label;

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
  if (select count(*) from public.narrative_moments where series_id = series_uuid and moment_kind = 'backbone_turn' and publication_state = 'published') <> 17 then
    raise exception 'Expected 17 playable Ramayana turns';
  end if;
  if (select count(*) from public.narrative_moments where series_id = series_uuid and moment_kind = 'backbone_turn' and publication_state = 'draft') <> 32 then
    raise exception 'Expected 32 unfinished Ramayana turns';
  end if;
  if (select count(*) from public.narrative_moments where series_id = series_uuid and moment_kind = 'backbone_turn' and visual_direction->>'coverage' = 'outlined') <> 3 then
    raise exception 'Expected 3 outlined Ramayana turns';
  end if;
  if (select count(*) from public.narrative_moments where series_id = series_uuid and moment_kind = 'backbone_turn' and visual_direction->>'coverage' = 'orientation') <> 29 then
    raise exception 'Expected 29 orientation-only Ramayana turns';
  end if;
  if (select count(*) from public.narrative_moments where series_id = series_uuid and moment_kind = 'playable_scene' and publication_state = 'published') <> 77 then
    raise exception 'Expected 77 Ramayana playable scenes';
  end if;
  if (select count(*) from public.narrative_moments where series_id = series_uuid and moment_kind = 'playable_scene' and publication_state = 'draft') <> 20 then
    raise exception 'Expected 20 draft Ramayana scene outlines';
  end if;
  if (select count(*) from public.narrative_beats beat join public.narrative_moments moment on moment.id = beat.moment_id where moment.series_id = series_uuid) <> 375 then
    raise exception 'Expected 375 Ramayana narrative beats';
  end if;
  if (select count(*) from public.narrative_moment_texts copy join public.narrative_moments moment on moment.id = copy.moment_id where moment.series_id = series_uuid) <> 292 then
    raise exception 'Expected 292 bilingual Ramayana moment texts';
  end if;
  if (select count(*) from public.narrative_beat_texts copy join public.narrative_beats beat on beat.id = copy.beat_id join public.narrative_moments moment on moment.id = beat.moment_id where moment.series_id = series_uuid) <> 750 then
    raise exception 'Expected 750 bilingual Ramayana beat texts';
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

const generated = buildMigration();
if (process.argv.includes("--check")) {
  if (!fs.existsSync(OUTPUT) || fs.readFileSync(OUTPUT, "utf8") !== generated) {
    throw new Error("Ramayana consumer narrative seed migration is stale or missing");
  }
  console.log("PASS: Ramayana consumer narrative seed migration is current");
} else {
  fs.writeFileSync(OUTPUT, generated, { encoding: "utf8", flag: "w" });
  console.log(path.relative(ROOT, OUTPUT).replaceAll("\\", "/"));
}
