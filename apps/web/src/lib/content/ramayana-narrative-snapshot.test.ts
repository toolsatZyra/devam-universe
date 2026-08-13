import { describe, expect, it } from "vitest";
import { buildRamayanaNarrativeSnapshot } from "./ramayana-narrative-snapshot";

describe("Ramayana consumer narrative snapshot", () => {
  const snapshot = buildRamayanaNarrativeSnapshot();

  it("maps the complete selected-expression backbone without inflating playability", () => {
    expect(snapshot.series.totalSourceUnits).toBe(652);
    expect(snapshot.counters).toEqual({
      arcs: 7,
      backboneTurns: 49,
      playableTurns: 49,
      outlinedTurns: 0,
      orientationOnlyTurns: 0,
      playableScenes: 448,
      draftSceneOutlines: 0,
      bilingualBeats: 1957,
    });
    expect(snapshot.boundary).toContain("does not claim a complete consumer Ramayana");
  });

  it("keeps every playable scene under exactly one source-bounded backbone turn", () => {
    const scenes = snapshot.turns.flatMap((turn) => turn.scenes
      .filter((scene) => scene.readiness === "playable")
      .map((scene) => ({ turn, scene })));
    expect(new Set(scenes.map(({ scene }) => scene.id)).size).toBe(448);
    const beatIds = scenes.flatMap(({ scene }) => scene.beats.map((beat) => beat.id));
    expect(new Set(beatIds).size).toBe(beatIds.length);
    for (const { turn, scene } of scenes) {
      expect(scene.source.sourceSha256).toBe(turn.sourceRange.sourceSha256);
      expect(scene.source.sourceOrdinal).toBeGreaterThanOrEqual(turn.sourceRange.startOrdinal);
      expect(scene.source.sourceOrdinal).toBeLessThanOrEqual(turn.sourceRange.endOrdinal);
      expect(scene.source.sourceEndOrdinal).toBeGreaterThanOrEqual(scene.source.sourceOrdinal);
      expect(scene.source.sourceGlobalOrdinal).toBeGreaterThan(0);
      expect(scene.detailOrdinal).toBeGreaterThan(0);
    }
    for (const turn of snapshot.turns.filter((candidate) => candidate.coverage === "playable")) {
      expect(turn.scenes.map((scene) => scene.detailOrdinal)).toEqual(
        [...turn.scenes.map((scene) => scene.detailOrdinal)].sort((left, right) => left - right),
      );
    }
  });

  it("covers every selected-source unit exactly once inside its backbone turn", () => {
    const mismatches: Array<{ turnId: string; expected: number[]; covered: number[] }> = [];
    for (const turn of snapshot.turns) {
      const covered = turn.scenes.flatMap((scene) => Array.from(
        { length: scene.source.sourceEndOrdinal - scene.source.sourceOrdinal + 1 },
        (_, index) => scene.source.sourceOrdinal + index,
      )).sort((left, right) => left - right);
      const expected = Array.from(
        { length: turn.sourceRange.endOrdinal - turn.sourceRange.startOrdinal + 1 },
        (_, index) => turn.sourceRange.startOrdinal + index,
      );
      if (JSON.stringify(covered) !== JSON.stringify(expected)) {
        mismatches.push({ turnId: turn.id, expected, covered });
      }
    }
    expect(mismatches).toEqual([]);
  });

  it("retains complete bilingual narrative copy and visual staging inputs", () => {
    for (const turn of snapshot.turns.filter((candidate) => candidate.coverage === "playable")) {
      expect(turn.characters.length).toBeGreaterThanOrEqual(1);
      expect(turn.places.length).toBeGreaterThanOrEqual(1);
      expect(turn.threads.length).toBeGreaterThanOrEqual(1);
      for (const scene of turn.scenes) {
        expect(scene.title.en.length).toBeGreaterThan(4);
        expect(scene.title.hi.length).toBeGreaterThan(4);
        expect(scene.narrative.en.length).toBeGreaterThan(250);
        expect(scene.narrative.hi.length).toBeGreaterThan(200);
        expect(scene.nodeIds.length).toBeGreaterThanOrEqual(4);
        expect(scene.characters.length).toBeGreaterThanOrEqual(2);
        expect(scene.places.length).toBeGreaterThanOrEqual(1);
        expect(scene.beats.length).toBeGreaterThanOrEqual(3);
        for (const beat of scene.beats) {
          expect(beat.narration.en.length).toBeGreaterThan(80);
          expect(beat.narration.hi.length).toBeGreaterThan(60);
          expect(beat.visualCue.length).toBeGreaterThan(30);
        }
      }
    }
  });

  it("leaves unfinished turns visibly orientation-only", () => {
    const orientationOnly = snapshot.turns.filter((turn) => turn.coverage === "orientation");
    const outlined = snapshot.turns.filter((turn) => turn.coverage === "outlined");
    expect(orientationOnly).toHaveLength(0);
    expect(orientationOnly.every((turn) => turn.scenes.length === 0)).toBe(true);
    expect(outlined).toHaveLength(0);
    expect(outlined.flatMap((turn) => turn.scenes)).toHaveLength(0);
    expect(outlined.every((turn) => turn.scenes.every((scene) =>
      scene.readiness === "outlined" && scene.beats.length === 0 && !scene.source.spanSha256
    ))).toBe(true);
  });
});
