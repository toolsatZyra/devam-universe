import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { buildRamayanaNarrativeSnapshot } from "./ramayana-narrative-snapshot";
import { gateways, worldNodes } from "../../data/atlas";

type Lane = {
  priority: number;
  lane_id: string;
  status: string;
  required_outcome: string;
  current: Record<string, boolean | number | string>;
  next_boundary: string;
};

const inventory = JSON.parse(readFileSync(
  resolve(process.cwd(), "..", "..", "knowledge_packs", "inventories", "consumer-content-mvp-v1.json"),
  "utf8",
)) as {
  contract: string;
  snapshot_date: string;
  audience: string;
  default_experience: string;
  boundary: string;
  consumer_record_contract: {
    languages: string[];
    story_fields: string[];
    navigation_fields: string[];
    default_hidden_internal_fields: string[];
    disclosure_boundary: string;
  };
  lanes: Lane[];
};

const livingConnections = JSON.parse(readFileSync(
  resolve(process.cwd(), "..", "..", "knowledge_packs", "inventories", "ramayana-living-connections-v1.json"),
  "utf8",
)) as {
  contract: string;
  series_slug: string;
  boundary: string;
  connections: Array<{
    moment_slug: string;
    atlas_node_slug: string;
    relation_kind: string;
    label: { en: string; hi: string };
  }>;
};

describe("consumer-content MVP inventory", () => {
  it("keeps one ordered, bounded consumer backlog", () => {
    expect(inventory.contract).toBe("DEVAM_CONSUMER_CONTENT_MVP_V1");
    expect(inventory.boundary).toContain("not a census or completeness percentage");
    expect(inventory.lanes.map((lane) => lane.priority)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(new Set(inventory.lanes.map((lane) => lane.lane_id)).size).toBe(inventory.lanes.length);
  });

  it("makes bilingual story continuity primary and source apparatus non-default", () => {
    expect(inventory.snapshot_date).toBe("2026-08-13");
    expect(inventory.audience).toContain("Ordinary Hindi- or English-speaking Indian adults");
    expect(inventory.consumer_record_contract.languages).toEqual(["hi", "en"]);
    expect(inventory.consumer_record_contract.story_fields).toEqual([
      "title", "synopsis", "narrative", "action", "motivation", "consequence",
    ]);
    expect(inventory.consumer_record_contract.navigation_fields).toEqual([
      "characters", "places", "precedes", "follows", "living_connections",
    ]);
    expect(inventory.consumer_record_contract.default_hidden_internal_fields).toEqual([
      "source_hashes", "edition_comparison", "verse_counts", "citations", "scholarly_disputes",
    ]);
    expect(inventory.consumer_record_contract.disclosure_boundary).toContain("not default story chrome");
  });

  it("records the honest Ramayana and Ramcharitmanas starting denominators", () => {
    const ramayana = inventory.lanes.find((lane) => lane.lane_id === "ramayana-consumer-story")!;
    expect(ramayana.current).toMatchObject({
      selected_expression_source_units: 652,
      expected_story_checklist: "knowledge_packs/inventories/ramayana-expected-story-checklist-v1.json",
      expected_story_rows: 71,
      selected_expression_rows_complete_en_hi: 49,
      supplemental_expected_story_rows_complete_en_hi: 17,
      supplemental_expected_story_rows_open: 5,
      whole_story_turns: 49,
      playable_turns: 49,
      outlined_turns: 0,
      orientation_only_turns: 0,
      playable_scenes: 517,
      draft_scene_outlines: 0,
      bilingual_beats: 2340,
      supplemental_bilingual_episode_beats: 175,
      total_selected_and_supplemental_bilingual_narrative_units: 2515,
      scenes_with_place_paths: 517,
      story_order_links: 516,
      character_path_links: 94,
      place_echo_links: 50,
      parallel_thread_links: 22,
      living_atlas_connections: 6,
      public_rpc_returns_multidimensional_connections: true,
      database_projection_migration_prepared: true,
      hosted_database_projection_applied: false,
    });
    const manas = inventory.lanes.find((lane) => lane.lane_id === "ramcharitmanas-daily-reading")!;
    expect(manas.current).toMatchObject({
      reading_contract: "knowledge_packs/devotional/ramcharitmanas-reading-contract-v1.json",
      fixed_narrative_pages: 1172,
      text_bearing_pages: 1158,
      prepared_narrative_pages: 813,
      held_text_bearing_pages: 345,
      structural_blank_scan_pages: 14,
      q1_pages_dual_witness_screened: 345,
      q1_pages_promoted: 0,
      defined_reading_modes: 5,
      complete_end_to_end_reading_available: false,
      daily_reading_available: false,
      resume_persistence_available: false,
    });
    const chalisa = inventory.lanes.find((lane) => lane.lane_id === "hanuman-chalisa")!;
    expect(chalisa.current).toMatchObject({
      reading_contract: "knowledge_packs/devotional/hanuman-chalisa-consumer-v1.json",
      reading_units: 43,
      complete_recitation_mode_available: true,
      one_reading_unit_daily_mode_available: true,
      defined_reading_modes: 3,
      persistent_saved_progress_available: false,
    });
  });

  it("connects selected Ramayana turns to real, separately governed living Atlas worlds", () => {
    expect(livingConnections.contract).toBe("DEVAM_RAMAYANA_LIVING_CONNECTIONS_V1");
    expect(livingConnections.series_slug).toBe("ramayana-dutt-consumer-v1");
    expect(livingConnections.boundary).toContain("do not make");
    expect(livingConnections.connections).toHaveLength(6);
    const snapshotMomentSlugs = new Set(buildRamayanaNarrativeSnapshot().turns.flatMap((turn) => [
      `turn-${turn.id}`,
      ...turn.scenes.map((scene) => `scene-${scene.id}`),
    ]));
    const atlasNodeSlugs = new Set([...gateways, ...worldNodes].map((node) => node.id));
    expect(new Set(livingConnections.connections.map((connection) => `${connection.moment_slug}:${connection.atlas_node_slug}:${connection.relation_kind}`)).size).toBe(6);
    for (const connection of livingConnections.connections) {
      expect(snapshotMomentSlugs.has(connection.moment_slug), connection.moment_slug).toBe(true);
      expect(atlasNodeSlugs.has(connection.atlas_node_slug), connection.atlas_node_slug).toBe(true);
      expect(connection.label.en.length).toBeGreaterThan(20);
      expect(connection.label.hi.length).toBeGreaterThan(20);
    }
    expect(livingConnections.connections.map((connection) => connection.atlas_node_slug)).toEqual(expect.arrayContaining([
      "diwali", "vivaha-panchami", "ramlila-performance", "kishkindha-living-landscape", "hanuman-chalisa", "anjanadri-hill-tradition",
    ]));
  });

  it("keeps the Ramayana inventory counters synchronized with the compiled narrative", () => {
    const current = inventory.lanes.find((lane) => lane.lane_id === "ramayana-consumer-story")!.current;
    const counters = buildRamayanaNarrativeSnapshot().counters;
    expect(current).toMatchObject({
      whole_story_turns: counters.backboneTurns,
      playable_turns: counters.playableTurns,
      outlined_turns: counters.outlinedTurns,
      orientation_only_turns: counters.orientationOnlyTurns,
      playable_scenes: counters.playableScenes,
      draft_scene_outlines: counters.draftSceneOutlines,
      bilingual_beats: counters.bilingualBeats,
    });
  });

  it("does not report any major story lane as complete", () => {
    for (const lane of inventory.lanes) {
      expect(lane.status).not.toMatch(/complete$/);
      expect(lane.required_outcome.length).toBeGreaterThan(40);
      expect(lane.next_boundary.length).toBeGreaterThan(40);
    }
  });
});
