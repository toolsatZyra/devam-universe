import { describe, expect, it } from "vitest";
import { worldEdges } from "../../data/atlas";
import {
  RAMAYANA_CAST_NODE_IDS,
  RAMAYANA_SCENE_WORLD_NODE_IDS,
  getJourneyEncounterNode,
  getJourneyEncounterRoutes,
  getRamayanaSceneEncounterNodes,
} from "./ramayana-world-encounters";

describe("Ramayana return-world encounters", () => {
  it("turns all seven scenes into resolvable in-world constellations", () => {
    expect(Object.keys(RAMAYANA_SCENE_WORLD_NODE_IDS)).toHaveLength(7);
    for (const [sceneId, nodeIds] of Object.entries(RAMAYANA_SCENE_WORLD_NODE_IDS)) {
      expect(getRamayanaSceneEncounterNodes(sceneId), sceneId).toHaveLength(nodeIds.length);
      expect(nodeIds.length, sceneId).toBeGreaterThanOrEqual(4);
      expect(new Set(nodeIds).size, sceneId).toBe(nodeIds.length);
    }
  });

  it("keeps every visible cast doorway attached to a reviewed Atlas node", () => {
    for (const [label, nodeId] of Object.entries(RAMAYANA_CAST_NODE_IDS)) {
      expect(getJourneyEncounterNode(nodeId), label).toMatchObject({ id: nodeId, gateway: false });
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
      const edge = worldEdges.find((candidate) => candidate.from === chain[index] && candidate.to === chain[index + 1]);
      expect(edge, `${chain[index]} must open ${chain[index + 1]}`).toBeDefined();
      expect(edge?.sourceRef).toMatch(/^sha256:[a-f0-9]{64}\/ordinal\/\d+#span=[a-f0-9]{64}$/);
      expect(edge?.evidenceBoundary?.length ?? 0).toBeGreaterThan(120);
    }
  });

  it("lets a player move outward from an encounter without leaving the world", () => {
    const bharataRoutes = getJourneyEncounterRoutes("bharata", 20);
    expect(bharataRoutes.map((route) => route.destination.id)).toEqual(expect.arrayContaining([
      "hanuman-carries-homecoming-message",
      "bharata-hears-return",
      "ayodhya-prepares-homecoming",
      "rama-coronation-return",
    ]));
    expect(getJourneyEncounterRoutes("return-to-ayodhya", 20).map((route) => route.destination.id)).toContain("diwali");
  });
});
