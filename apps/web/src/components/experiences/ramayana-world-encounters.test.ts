import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { buildRamayanaStoryWorldPack } from "../../data/ramayana-story-world";
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

  it("ships a bounded story pack instead of the global Atlas to the client", () => {
    expect(Buffer.byteLength(JSON.stringify(pack))).toBeLessThan(100_000);
    const helper = readFileSync(new URL("./ramayana-world-encounters.ts", import.meta.url), "utf8");
    const player = readFileSync(new URL("./journey-player.tsx", import.meta.url), "utf8");
    expect(helper).not.toContain("data/atlas");
    expect(player).not.toContain("data/atlas");
  });
});
