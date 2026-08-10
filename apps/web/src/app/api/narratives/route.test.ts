import { describe, expect, it } from "vitest";
import { createNarrativeGet, type PublicNarrativeReader } from "./route";
import type { PublicNarrativeSeries } from "../../../lib/narratives/public-narrative-contract";

const narrative: PublicNarrativeSeries = {
  series: { slug: "ramayana-dutt-consumer-v1", title: "Ramayana", kind: "epic", totalSourceUnits: 652, coverageState: "story_mapped" },
  arcs: [{
    slug: "exile",
    ordinal: 2,
    title: "The exile",
    invitation: "A crown lost and a promise carried",
    moments: [{
      slug: "turn-coronation-dawn",
      kind: "backbone_turn",
      backboneOrdinal: 7,
      turnOrdinalInArc: 1,
      detailOrdinal: 0,
      parentSlug: null,
      title: "A coronation dawns",
      synopsis: "Ayodhya prepares.",
      narrative: "Ayodhya prepares.",
      visualDirection: {},
      beats: [],
    }],
  }],
};

describe("GET /api/narratives", () => {
  it("returns one language-bounded public story projection", async () => {
    const calls: unknown[] = [];
    const reader: PublicNarrativeReader = {
      async getSeries(seriesSlug, languageCode) {
        calls.push([seriesSlug, languageCode]);
        return narrative;
      },
    };
    const response = await createNarrativeGet(reader)(new Request("http://localhost/api/narratives?series=ramayana-dutt-consumer-v1&language=hi"));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, narrative });
    expect(calls).toEqual([["ramayana-dutt-consumer-v1", "hi"]]);
    expect(response.headers.get("cache-control")).toContain("stale-while-revalidate");
  });

  it("rejects invalid series and language inputs before retrieval", async () => {
    const reader: PublicNarrativeReader = { async getSeries() { throw new Error("must not run"); } };
    const response = await createNarrativeGet(reader)(new Request("http://localhost/api/narratives?series=../../sources&language=sa"));
    expect(response.status).toBe(422);
  });

  it("fails closed when the data layer is unavailable", async () => {
    const reader: PublicNarrativeReader = { async getSeries() { throw new Error("database unavailable"); } };
    const response = await createNarrativeGet(reader)(new Request("http://localhost/api/narratives?series=ramayana-dutt-consumer-v1&language=en"));
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ ok: false, code: "NARRATIVE_DATA_UNAVAILABLE" });
  });
});
