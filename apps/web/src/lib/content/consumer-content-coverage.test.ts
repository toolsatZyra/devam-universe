import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

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
)) as { contract: string; boundary: string; lanes: Lane[] };

describe("consumer-content MVP inventory", () => {
  it("keeps one ordered, bounded consumer backlog", () => {
    expect(inventory.contract).toBe("DEVAM_CONSUMER_CONTENT_MVP_V1");
    expect(inventory.boundary).toContain("not a census or completeness percentage");
    expect(inventory.lanes.map((lane) => lane.priority)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(new Set(inventory.lanes.map((lane) => lane.lane_id)).size).toBe(inventory.lanes.length);
  });

  it("records the honest Ramayana and Ramcharitmanas starting denominators", () => {
    const ramayana = inventory.lanes.find((lane) => lane.lane_id === "ramayana-consumer-story")!;
    expect(ramayana.current).toMatchObject({
      selected_expression_source_units: 652,
      whole_story_turns: 49,
      playable_turns: 16,
      outlined_turns: 4,
      orientation_only_turns: 29,
      playable_scenes: 67,
      draft_scene_outlines: 30,
      bilingual_beats: 335,
      database_projection_migration_prepared: true,
      hosted_database_projection_applied: false,
    });
    const manas = inventory.lanes.find((lane) => lane.lane_id === "ramcharitmanas-daily-reading")!;
    expect(manas.current).toMatchObject({
      fixed_narrative_pages: 1172,
      published_narrative_pages: 802,
      unpublished_narrative_pages: 370,
      daily_reading_available: false,
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
