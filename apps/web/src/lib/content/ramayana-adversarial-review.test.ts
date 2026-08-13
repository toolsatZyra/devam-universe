import { describe, expect, it } from "vitest";
import { buildRamayanaNarrativeSnapshot } from "./ramayana-narrative-snapshot";

const SOURCE_APPARATUS = /(?:\b(?:kanda|kāṇḍa|sarga|ordinal|sha-?256|citation|edition|translation)\b|\b(?:this|source|printed) section\b)/i;
const MOJIBAKE = /(?:ï¿½|�|à¤|à¥|â€|Ã)/;

describe("Ramayana selected-expression adversarial review", () => {
  const snapshot = buildRamayanaNarrativeSnapshot();
  const scenes = snapshot.turns.flatMap((turn) => turn.scenes);
  const beats = scenes.flatMap((scene) => scene.beats);
  const sceneById = new Map(scenes.map((scene) => [scene.id, scene]));
  const narrative = (id: string) => {
    const scene = sceneById.get(id);
    expect(scene, id).toBeDefined();
    return scene!.narrative.en;
  };

  it("keeps an exact review queue for scenes above the progressive-disclosure beat target", () => {
    expect(scenes
      .filter((scene) => scene.beats.length < 3 || scene.beats.length > 7)
      .map((scene) => [scene.id, scene.beats.length])).toEqual([
        ["mahendra-launches-the-messenger", 12],
        ["despair-yields-to-ashoka-grove", 8],
        ["trijatas-dream-breaks-the-circle", 9],
        ["the-search-chain-becomes-proof", 8],
        ["sitas-voice-crosses-through-hanuman", 10],
      ]);
  });

  it("keeps normal story copy free of source apparatus", () => {
    const leaks: Array<[string, string]> = [];
    for (const scene of scenes) {
      const consumerCopy = [
        scene.title.en,
        scene.title.hi,
        scene.synopsis.en,
        scene.synopsis.hi,
        ...scene.beats.flatMap((beat) => [
          beat.title.en,
          beat.title.hi,
          beat.narration.en,
          beat.narration.hi,
        ]),
      ];
      for (const copy of consumerCopy) {
        const match = copy.match(SOURCE_APPARATUS);
        if (match) leaks.push([scene.id, match[0]]);
      }
    }
    expect(leaks).toEqual([]);
  });

  it("retains clean Hindi and English Unicode rather than rendered mojibake", () => {
    for (const scene of scenes) {
      const copy = [
        scene.title.en,
        scene.title.hi,
        scene.synopsis.en,
        scene.synopsis.hi,
        ...scene.beats.flatMap((beat) => [beat.title.en, beat.title.hi, beat.narration.en, beat.narration.hi]),
      ];
      for (const value of copy) expect(value, scene.id).not.toMatch(MOJIBAKE);
    }
  });

  it("does not reuse scene narratives or visual directions as filler", () => {
    expect(new Set(scenes.map((scene) => scene.narrative.en)).size).toBe(scenes.length);
    expect(new Set(scenes.map((scene) => scene.narrative.hi)).size).toBe(scenes.length);
    expect(new Set(beats.map((beat) => beat.visualCue)).size).toBe(beats.length);
  });

  it("preserves agency, harm, and contested action in consequential scenes", () => {
    expect(narrative("surpanakha-breaks-quiet")).toMatch(/injur|humiliat|violence/i);
    expect(narrative("vali-puts-rama-on-trial")).toMatch(/hidden|conceal|challenge|jurisdiction/i);
    expect(narrative("reputation-is-placed-above-sita")).toMatch(/innocen|abandon|deceiv|reputation/i);
    expect(narrative("rama-admits-knowledge-and-sita-leaves-the-trial")).toMatch(/proof|oath|assembly|earth/i);
    expect(narrative("despair-yields-to-ashoka-grove")).toMatch(/not a solution|self-destruction|living messenger/i);
  });

  it("keeps an exact review queue for turns below the narrative-depth target", () => {
    expect(snapshot.turns
      .map((turn) => ({
        id: turn.id,
        scenes: turn.scenes.length,
        beats: turn.scenes.reduce((sum, scene) => sum + scene.beats.length, 0),
      }))
      .filter((turn) => turn.scenes < 3 || turn.beats < 12)).toEqual([
        { id: "deeper-into-forest", scenes: 2, beats: 11 },
        { id: "panchavati-surpanakha", scenes: 2, beats: 11 },
        { id: "golden-deer-plot", scenes: 2, beats: 10 },
      ]);
  });

  it("keeps the coronation and Janasthana depth repairs on exact non-overlapping source ranges", () => {
    const repairedScenes = [
      ["dasharatha-chooses-rama", 1, 2, 2],
      ["ayodhya-prepares-the-heir", 3, 4, 2],
      ["rama-and-sita-keep-the-night", 5, 6, 2],
      ["surpanakha-brings-fourteen-fighters", 18, 20, 3],
      ["khara-marches-under-omens", 21, 24, 4],
      ["dushana-and-trishira-fall", 25, 27, 3],
      ["khara-falls-akampana-carries-news", 28, 30, 3],
    ] as const;

    expect(repairedScenes.map(([id]) => {
      const scene = sceneById.get(id);
      expect(scene, id).toBeDefined();
      return [
        scene!.id,
        scene!.source.sourceOrdinal,
        scene!.source.sourceEndOrdinal,
        scene!.source.spanSha256s?.length,
        scene!.source.sourceAddressKind,
      ];
    })).toEqual(repairedScenes.map(([id, start, end, spanCount]) => [
      id,
      start,
      end,
      spanCount,
      "section_span_set",
    ]));
  });
});
