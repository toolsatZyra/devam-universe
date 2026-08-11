import { describe, expect, it } from "vitest";
import { parsePublicNarrativeSeries } from "./public-narrative-contract";

const valid = {
  series: { slug: "ramayana-dutt-consumer-v1", title: "Ramayana", kind: "epic", totalSourceUnits: 652, coverageState: "story_mapped" },
  arcs: [{
    slug: "exile",
    ordinal: 2,
    title: "The exile",
    invitation: "A crown lost and a promise carried",
    moments: [
      {
        slug: "turn-coronation-dawn",
        kind: "backbone_turn",
        backboneOrdinal: 7,
        turnOrdinalInArc: 1,
        detailOrdinal: 0,
        parentSlug: null,
        title: "A coronation dawns",
        synopsis: "Ayodhya prepares for Rama.",
        narrative: "Ayodhya prepares for Rama.",
        visualDirection: { coverage: "playable" },
        characters: ["Rama"],
        places: ["Ayodhya"],
        threads: ["succession"],
        connections: [{
          kind: "precedes",
          labels: ["story-order"],
          direction: "forward",
          momentSlug: "scene-coronation-dawn",
          momentKind: "playable_scene",
          backboneOrdinal: 7,
          detailOrdinal: 1,
          title: "A coronation dawns",
        }],
        livingConnections: [{
          kind: "festival",
          label: "Continue from the homecoming into the many living worlds of Diwali",
          nodeSlug: "diwali",
          title: "Diwali",
          nodeKind: "gateway",
          summary: "Follow the festival of many lights through distinct living traditions.",
          gatewayId: "diwali",
        }],
        beats: [],
      },
      {
        slug: "scene-coronation-dawn",
        kind: "playable_scene",
        backboneOrdinal: 7,
        turnOrdinalInArc: 1,
        detailOrdinal: 1,
        parentSlug: "turn-coronation-dawn",
        title: "A coronation dawns",
        synopsis: "A city prepares for a future that will not arrive.",
        narrative: "A substantial consumer narrative unfolds across the city and palace.",
        visualDirection: { nodeIds: ["ayodhya", "rama"] },
        characters: ["Rama"],
        places: ["Ayodhya"],
        threads: [],
        connections: [],
        livingConnections: [],
        beats: [1, 2, 3].map((ordinal) => ({
          slug: `beat-${ordinal}`,
          ordinal,
          title: `Beat ${ordinal}`,
          narration: `Narrative movement ${ordinal} develops the scene for the audience.`,
          visualDirection: { visualCue: `Visual ${ordinal}` },
        })),
      },
    ],
  }],
};

describe("public narrative contract", () => {
  it("accepts the bounded consumer hierarchy", () => {
    const parsed = parsePublicNarrativeSeries(valid);
    expect(parsed?.series.totalSourceUnits).toBe(652);
    expect(parsed?.arcs[0].moments[0].livingConnections[0].nodeSlug).toBe("diwali");
    expect(parsed?.arcs[0].moments[0].connections[0].momentSlug).toBe("scene-coronation-dawn");
  });

  it("rejects evidence/source apparatus in place of consumer structure", () => {
    expect(() => parsePublicNarrativeSeries({ ...valid, arcs: [] })).toThrow("no arcs");
  });

  it("rejects playable scenes without sufficient story beats", () => {
    const broken = structuredClone(valid);
    broken.arcs[0].moments[1].beats = broken.arcs[0].moments[1].beats.slice(0, 2);
    expect(() => parsePublicNarrativeSeries(broken)).toThrow("too few beats");
  });

  it("rejects a scene detached from its backbone turn", () => {
    const broken = structuredClone(valid);
    broken.arcs[0].moments[1].parentSlug = "turn-that-does-not-exist";
    expect(() => parsePublicNarrativeSeries(broken)).toThrow("detached from its backbone");
  });
});
