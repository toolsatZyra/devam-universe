import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { buildRamayanaStoryWorldPack } from "../../data/ramayana-story-world";
import { getRamayanaBeatStage, RAMAYANA_BEAT_STAGE_COUNT } from "./ramayana-beat-stage";
import {
  getJourneyEncounterNode,
  getJourneyEncounterRoutes,
  getStorySceneEncounterNodes,
} from "./ramayana-world-encounters";

describe("Ramayana return-world encounters", () => {
  const pack = buildRamayanaStoryWorldPack();

  it("turns all seven scenes into resolvable in-world constellations", () => {
    expect(Object.keys(pack.sceneNodeIds)).toHaveLength(7);
    for (const [sceneId, nodeIds] of Object.entries(pack.sceneNodeIds)) {
      expect(getStorySceneEncounterNodes(pack, sceneId), sceneId).toHaveLength(nodeIds.length);
      expect(nodeIds.length, sceneId).toBeGreaterThanOrEqual(4);
      expect(new Set(nodeIds).size, sceneId).toBe(nodeIds.length);
    }
  });

  it("keeps every visible cast doorway attached to a reviewed Atlas node", () => {
    for (const [label, nodeId] of Object.entries(pack.castNodeIds)) {
      expect(getJourneyEncounterNode(pack, nodeId), label).toMatchObject({ id: nodeId, gateway: false });
    }
  });

  it("gives every playable scene a complete bilingual beat sequence", () => {
    expect(Object.keys(pack.moments).sort()).toEqual(Object.keys(pack.sceneNodeIds).sort());
    for (const moment of Object.values(pack.moments)) {
      expect(moment.beats.length, moment.id).toBeGreaterThanOrEqual(3);
      expect(moment.beats.length, moment.id).toBeLessThanOrEqual(7);
      expect(new Set(moment.beats.map((beat) => beat.id)).size, moment.id).toBe(moment.beats.length);
      for (const beat of moment.beats) {
        expect(beat.title.en.length, beat.id).toBeGreaterThan(4);
        expect(beat.title.hi.length, beat.id).toBeGreaterThan(4);
        expect(beat.narration.en.length, beat.id).toBeGreaterThan(80);
        expect(beat.narration.hi.length, beat.id).toBeGreaterThan(60);
        expect(beat.visualCue.length, beat.id).toBeGreaterThan(30);
        expect(beat.characterIds.every((id) => Boolean(pack.nodes[id])), beat.id).toBe(true);
      }
    }
  });

  it("gives every story beat a bounded cinematic camera and motion composition", () => {
    const beats = Object.values(pack.moments).flatMap((moment) => moment.beats);
    expect(RAMAYANA_BEAT_STAGE_COUNT).toBe(beats.length);
    for (const beat of beats) {
      const stage = getRamayanaBeatStage(beat.id);
      expect(stage, beat.id).toBeDefined();
      expect(stage?.focusX, beat.id).toBeGreaterThanOrEqual(35);
      expect(stage?.focusX, beat.id).toBeLessThanOrEqual(80);
      expect(stage?.focusY, beat.id).toBeGreaterThanOrEqual(28);
      expect(stage?.focusY, beat.id).toBeLessThanOrEqual(65);
      expect(stage?.zoom, beat.id).toBeGreaterThanOrEqual(1.1);
      expect(stage?.zoom, beat.id).toBeLessThanOrEqual(1.25);
    }
  });

  it("preserves the exact source-addressed story chain from Lanka to coronation", () => {
    const chain = [
      "pushpaka-departure-lanka",
      "remembered-homeward-route",
      "bharadvaja-homecoming-counsel",
      "hanuman-carries-homecoming-message",
      "bharata-hears-return",
      "ayodhya-prepares-homecoming",
      "rama-coronation-return",
    ];
    for (let index = 0; index < chain.length - 1; index += 1) {
      const edge = pack.routes[chain[index]]?.find((candidate) => candidate.destinationId === chain[index + 1]);
      expect(edge, `${chain[index]} must open ${chain[index + 1]}`).toBeDefined();
      expect(edge?.sourceRef).toMatch(/^sha256:[a-f0-9]{64}\/ordinal\/\d+#span=[a-f0-9]{64}$/);
      expect(pack.nodes[chain[index]]?.evidenceBoundary.length ?? 0).toBeGreaterThan(120);
    }
  });

  it("lets a player move outward from an encounter without leaving the world", () => {
    const bharataRoutes = getJourneyEncounterRoutes(pack, "bharata", 20);
    expect(bharataRoutes.map((route) => route.destination.id)).toEqual(expect.arrayContaining([
      "hanuman-carries-homecoming-message",
      "bharata-hears-return",
      "ayodhya-prepares-homecoming",
      "rama-coronation-return",
    ]));
    expect(getJourneyEncounterRoutes(pack, "return-to-ayodhya", 20).map((route) => route.destination.id)).toContain("diwali");
  });

  it("indexes character and place encounters back into every playable story moment", () => {
    expect(pack.nodeMomentIds.rama).toEqual(["leave-lanka", "sky-road", "bharadvaja-hermitage", "kingdom-returned"]);
    expect(pack.nodeMomentIds.bharata).toEqual(["hanuman-goes-ahead", "bharata-hears", "ayodhya-prepares", "kingdom-returned"]);
    expect(pack.nodeMomentIds.ayodhya).toEqual(["bharadvaja-hermitage", "ayodhya-prepares", "kingdom-returned"]);
    for (const [nodeId, momentIds] of Object.entries(pack.nodeMomentIds)) {
      expect(pack.nodes[nodeId], nodeId).toBeDefined();
      expect(momentIds.every((momentId) => Boolean(pack.moments[momentId])), nodeId).toBe(true);
    }
  });

  it("ships a bounded story pack instead of the global Atlas to the client", () => {
    expect(Buffer.byteLength(JSON.stringify(pack))).toBeLessThan(100_000);
    const helper = readFileSync(new URL("./ramayana-world-encounters.ts", import.meta.url), "utf8");
    const player = readFileSync(new URL("./journey-player.tsx", import.meta.url), "utf8");
    expect(helper).not.toContain("data/atlas");
    expect(player).not.toContain("data/atlas");
  });
});
