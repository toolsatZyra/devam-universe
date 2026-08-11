import { describe, expect, it } from "vitest";
import { buildRamayanaNarrativeSnapshot } from "./ramayana-narrative-snapshot";

describe("Ramayana consumer narrative snapshot", () => {
  const snapshot = buildRamayanaNarrativeSnapshot();

  it("maps the complete selected-expression backbone without inflating playability", () => {
    expect(snapshot.series.totalSourceUnits).toBe(652);
    expect(snapshot.counters).toEqual({
      arcs: 7,
      backboneTurns: 49,
      playableTurns: 21,
      outlinedTurns: 0,
      orientationOnlyTurns: 28,
      playableScenes: 103,
      draftSceneOutlines: 0,
      bilingualBeats: 490,
    });
    expect(snapshot.boundary).toContain("does not claim a complete consumer Ramayana");
  });

  it("keeps every playable scene under exactly one source-bounded backbone turn", () => {
    const scenes = snapshot.turns.flatMap((turn) => turn.scenes
      .filter((scene) => scene.readiness === "playable")
      .map((scene) => ({ turn, scene })));
    expect(new Set(scenes.map(({ scene }) => scene.id)).size).toBe(103);
    for (const { turn, scene } of scenes) {
      expect(scene.source.sourceSha256).toBe(turn.sourceRange.sourceSha256);
      expect(scene.source.sourceOrdinal).toBeGreaterThanOrEqual(turn.sourceRange.startOrdinal);
      expect(scene.source.sourceOrdinal).toBeLessThanOrEqual(turn.sourceRange.endOrdinal);
      expect(scene.source.sourceEndOrdinal).toBeGreaterThanOrEqual(scene.source.sourceOrdinal);
      expect(scene.source.sourceGlobalOrdinal).toBeGreaterThan(0);
      expect(scene.detailOrdinal).toBeGreaterThan(0);
    }
  });

  it("retains complete bilingual narrative copy and visual staging inputs", () => {
    for (const turn of snapshot.turns.filter((candidate) => candidate.coverage === "playable")) {
      for (const scene of turn.scenes) {
        expect(scene.title.en.length).toBeGreaterThan(4);
        expect(scene.title.hi.length).toBeGreaterThan(4);
        expect(scene.narrative.en.length).toBeGreaterThan(250);
        expect(scene.narrative.hi.length).toBeGreaterThan(200);
        expect(scene.nodeIds.length).toBeGreaterThanOrEqual(4);
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
    expect(orientationOnly).toHaveLength(28);
    expect(orientationOnly.every((turn) => turn.scenes.length === 0)).toBe(true);
    expect(outlined).toHaveLength(0);
    expect(outlined.flatMap((turn) => turn.scenes)).toHaveLength(0);
    expect(outlined.every((turn) => turn.scenes.every((scene) =>
      scene.readiness === "outlined" && scene.beats.length === 0 && !scene.source.spanSha256
    ))).toBe(true);
  });
});
