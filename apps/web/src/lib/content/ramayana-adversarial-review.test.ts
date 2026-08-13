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
      .filter((turn) => turn.scenes < 3 || turn.beats < 12)).toEqual([]);
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

  it("keeps the remaining thin-turn repairs in story order on exact source ranges", () => {
    const repairedTurns = [
      ["deeper-into-forest", [
        ["chitrakoot-grows-unsafe", 116, 116],
        ["anasuya-receives-sita", 117, 117],
        ["sita-tells-her-own-beginning", 118, 118],
      ]],
      ["panchavati-surpanakha", [
        ["jatayu-promises-protection", 13, 13],
        ["lakshmana-builds-panchavati-home", 14, 14],
        ["winter-at-panchavati-remembers-bharata", 15, 15],
        ["surpanakha-breaks-quiet", 16, 17],
      ]],
      ["golden-deer-plot", [
        ["surpanakha-carries-janasthana-to-lanka", 31, 33],
        ["ravana-seeks-marichas-help", 34, 35],
        ["maricha-warns-ravana-twice", 36, 38],
        ["ravana-coerces-maricha", 39, 41],
        ["golden-deer-reaches-panchavati", 42, 42],
      ]],
    ] as const;

    expect(repairedTurns.map(([turnId]) => {
      const turn = snapshot.turns.find((candidate) => candidate.id === turnId);
      expect(turn, turnId).toBeDefined();
      return [turnId, turn!.scenes.map((scene) => [
        scene.id,
        scene.source.sourceOrdinal,
        scene.source.sourceEndOrdinal,
      ])];
    })).toEqual(repairedTurns);
  });

  it("keeps the Ayodhya departure repair source-exact and in story order", () => {
    const repairedScenes = [
      ["lakshmana-chooses-exile", 31, 31],
      ["wealth-and-weapons-leave-the-palace", 32, 33],
      ["rama-faces-dasharatha-again", 34, 35],
      ["retinue-is-refused-bark-is-demanded", 36, 38],
      ["three-take-the-last-blessings", 39, 40],
    ] as const;
    const turn = snapshot.turns.find((candidate) => candidate.id === "exile-accepted");
    expect(turn).toBeDefined();
    expect(turn!.scenes
      .filter((scene) => repairedScenes.some(([id]) => id === scene.id))
      .map((scene) => [
        scene.id,
        scene.source.sourceOrdinal,
        scene.source.sourceEndOrdinal,
        scene.source.spanSha256s?.length,
        scene.source.sourceAddressKind,
      ])).toEqual(repairedScenes.map(([id, start, end]) => [
      id,
      start,
      end,
      end - start + 1,
      "section_span_set",
    ]));
  });
});
