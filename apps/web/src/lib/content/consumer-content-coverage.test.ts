import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { buildRamayanaNarrativeSnapshot } from "./ramayana-narrative-snapshot";

type Lane = {
  priority: number;
  lane_id: string;
  status: string;
  required_outcome: string;
  current: Record<string, boolean | number>;
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

describe("consumer-content MVP inventory", () => {
  it("keeps one ordered, bounded consumer backlog", () => {
    expect(inventory.contract).toBe("DEVAM_CONSUMER_CONTENT_MVP_V1");
    expect(inventory.boundary).toContain("not a census or completeness percentage");
    expect(inventory.lanes.map((lane) => lane.priority)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(new Set(inventory.lanes.map((lane) => lane.lane_id)).size).toBe(inventory.lanes.length);
  });

  it("makes bilingual story continuity primary and source apparatus non-default", () => {
    expect(inventory.snapshot_date).toBe("2026-08-12");
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
      whole_story_turns: 49,
      playable_turns: 49,
      outlined_turns: 0,
      orientation_only_turns: 0,
      playable_scenes: 402,
      draft_scene_outlines: 0,
      bilingual_beats: 1746,
      database_projection_migration_prepared: true,
      hosted_database_projection_applied: false,
    });
    const manas = inventory.lanes.find((lane) => lane.lane_id === "ramcharitmanas-daily-reading")!;
    expect(manas.current).toMatchObject({
      fixed_narrative_pages: 1172,
      prepared_narrative_pages: 813,
      held_text_bearing_pages: 345,
      structural_blank_scan_pages: 14,
      q1_pages_dual_witness_screened: 345,
      q1_pages_promoted: 0,
      daily_reading_available: false,
    });
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
