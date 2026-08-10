import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { buildRamayanaStoryWorldPack, getRamayanaDistrictMoments } from "../../data/ramayana-story-world";
import { getRamayanaBeatStage, RAMAYANA_BEAT_STAGE_COUNT } from "./ramayana-beat-stage";
import {
  getJourneyEncounterNode,
  getJourneyEncounterRoutes,
  getStorySceneEncounterNodes,
} from "./ramayana-world-encounters";

describe("Ramayana return-world encounters", () => {
  const pack = buildRamayanaStoryWorldPack();
  const moments = Object.fromEntries(pack.districts.flatMap((district) => Object.entries(getRamayanaDistrictMoments(district.id)!)));

  it("turns all forty-seven scenes in six districts into resolvable in-world constellations", () => {
    expect(pack.districts.map((district) => district.momentIds.length)).toEqual([8, 8, 8, 8, 8, 7]);
    expect(new Set(pack.districts.flatMap((district) => district.momentIds)).size).toBe(47);
    expect(Object.keys(pack.sceneNodeIds)).toHaveLength(47);
    for (const [sceneId, nodeIds] of Object.entries(pack.sceneNodeIds)) {
      expect(getStorySceneEncounterNodes(pack, sceneId), sceneId).toHaveLength(nodeIds.length);
      expect(nodeIds.length, sceneId).toBeGreaterThanOrEqual(4);
      expect(new Set(nodeIds).size, sceneId).toBe(nodeIds.length);
    }
  });

  it("keeps every visible cast doorway attached to a reviewed Atlas node", () => {
    for (const [label, nodeId] of Object.entries(pack.castNodeIds)) {
      expect(getJourneyEncounterNode(pack, nodeId), label).toMatchObject({ id: nodeId });
      expect(getJourneyEncounterNode(pack, nodeId)?.gateway, label).toBeFalsy();
    }
  });

  it("gives every playable scene a complete bilingual beat sequence", () => {
    expect(Object.keys(moments).sort()).toEqual(Object.keys(pack.sceneNodeIds).sort());
    expect(Object.keys(pack.momentPreviews).sort()).toEqual(Object.keys(pack.sceneNodeIds).sort());
    expect(pack.moments).toEqual({});
    for (const moment of Object.values(moments)) {
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
    const beats = Object.values(moments).flatMap((moment) => moment.beats);
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

  it("keeps one lazy Diwali doorway and the distinct living graph routes inside the story world", () => {
    expect(pack.livingPortalNodeIds).toEqual(["diwali"]);
    expect(pack.sceneNodeIds["kingdom-returned"]).toContain("diwali");
    expect(pack.routes["lakshmi-puja"]?.length).toBeGreaterThan(0);
    expect(pack.routes["kali-puja"]?.map((route) => route.destinationId)).toContain("kalighat-kali-temple");
    expect(pack.routes["tamil-deepavali"]?.length).toBeGreaterThan(0);
    expect(pack.routes["kalighat-kali-temple"]?.map((route) => route.destinationId)).toContain("durga-puja");
  });

  it("indexes character and place encounters back into every playable story moment", () => {
    expect(pack.nodeMomentIds.rama).toEqual(["coronation-dawn", "rama-crosses-celebration", "rama-accepts-exile", "sita-chooses-road", "lakshmana-joins", "city-follows-car", "tamasa-night", "roads-beyond-kosala", "guha-night-watch", "ganga-crossing", "first-forest-night", "prayaga-to-yamuna", "chitrakoot-home", "empty-chariot-return", "bharata-rejects-boons", "guha-shows-first-night", "chitrakoot-hears-army", "brothers-meet-death-news", "family-asks-rama-home", "sandals-hold-kingdom", "nandigrama-trust", "chitrakoot-grows-unsafe", "sita-tells-her-beginning", "dandaka-receives-them", "viradha-breaks-the-road", "forest-asks-protection", "sita-questions-the-bow", "ten-years-become-map", "agastya-points-south", "leave-lanka", "sky-road", "bharadvaja-hermitage", "kingdom-returned"]);
    expect(pack.nodeMomentIds.bharata).toEqual(["bharata-urgent-return", "bharata-rejects-boons", "funeral-and-trust", "crown-refused-road", "expedition-reaches-ganga", "guha-shows-first-night", "bharadvaja-tests-hosts", "chitrakoot-hears-army", "brothers-meet-death-news", "family-asks-rama-home", "sandals-hold-kingdom", "nandigrama-trust", "hanuman-goes-ahead", "bharata-hears", "ayodhya-prepares", "kingdom-returned"]);
    expect(pack.nodeMomentIds.ayodhya).toEqual(["coronation-dawn", "manthara-sees-city", "fear-becomes-demands", "king-trapped-by-word", "rama-crosses-celebration", "rama-accepts-exile", "sita-chooses-road", "lakshmana-joins", "city-follows-car", "nandigrama-trust", "bharadvaja-hermitage", "ayodhya-prepares", "kingdom-returned"]);
    for (const [nodeId, momentIds] of Object.entries(pack.nodeMomentIds)) {
      expect(pack.nodes[nodeId], nodeId).toBeDefined();
      expect(momentIds.every((momentId) => Boolean(pack.momentPreviews[momentId] && moments[momentId])), nodeId).toBe(true);
    }
  });

  it("ships a bounded story pack instead of the global Atlas to the client", () => {
    const serialized = JSON.stringify(pack);
    expect(Buffer.byteLength(serialized)).toBeLessThan(300_000);
    expect(gzipSync(serialized).byteLength).toBeLessThan(48_000);
    for (const district of pack.districts) {
      const payload = JSON.stringify(getRamayanaDistrictMoments(district.id));
      expect(Buffer.byteLength(payload), district.id).toBeLessThan(75_000);
      expect(gzipSync(payload).byteLength, district.id).toBeLessThan(18_000);
    }
    const helper = readFileSync(new URL("./ramayana-world-encounters.ts", import.meta.url), "utf8");
    const player = readFileSync(new URL("./journey-player.tsx", import.meta.url), "utf8");
    expect(helper).not.toContain("data/atlas");
    expect(player).not.toContain("data/atlas");
  });
});
