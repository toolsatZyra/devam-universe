import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { sourceVaultIt } from "../test/source-vault";
import { heroChallenges, heroJourneys } from "./hero-experiences";

function sha256(path: string) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

describe("hero experiences", () => {
  it("covers all four MVP heroes without claiming universe completion", () => {
    expect(heroJourneys.map((journey) => journey.slug)).toEqual(["ramayana", "ganesha", "durga", "diwali"]);
    for (const journey of heroJourneys) {
      expect(journey.completeHeroUniverse).toBe(false);
      expect(journey.sourceBoundary.length).toBeGreaterThan(80);
      expect(journey.stops.map((stop) => stop.ordinal)).toEqual(journey.stops.map((_, index) => index + 1));
      expect(new Set(journey.stops.map((stop) => stop.id)).size).toBe(journey.stops.length);
    }
  });

  it("ships cinematic world art and a complete Hindi story retelling for every current stop", () => {
    const publicRoot = resolve(process.cwd(), "public", "journeys");
    const playerSource = readFileSync(resolve(process.cwd(), "src", "components", "experiences", "journey-player.tsx"), "utf8");
    for (const journey of heroJourneys) {
      expect(statSync(resolve(publicRoot, `${journey.slug}-world-v1.webp`)).size).toBeGreaterThan(150_000);
      for (const stop of journey.stops) {
        expect(playerSource, `${stop.id} has no Hindi story retelling`).toContain(`"${stop.id}": { title:`);
        if (stop.visual) expect(statSync(resolve(process.cwd(), "public", stop.visual.asset.slice(1))).size).toBeGreaterThan(150_000);
      }
    }
  });

  it("binds every stop to an exact source and keeps private quotations out of the product data", () => {
    for (const stop of heroJourneys.flatMap((journey) => journey.stops)) {
      expect(stop.citation.sourceSha256).toMatch(/^[a-f0-9]{64}$/);
      expect(stop.citation.spanSha256).toMatch(/^[a-f0-9]{64}$/);
      expect(stop.citation.sourceOrdinal).toBeGreaterThan(0);
      expect(Object.keys(stop.citation.locator).length).toBeGreaterThan(5);
      if (stop.citation.rightsLane === "private_evidence") expect(stop.citation.quotation).toBeUndefined();
    }
  });

  sourceVaultIt("pins the canonical source objects currently used by the source journeys", () => {
    const root = resolve(process.cwd(), "../..");
    const hashes = [
      "8d1b8901823f5b5bd8b3207370991ddf95e5c76cb30ad5271aef835c9708464b",
      "7d3b9e1613d60dfacea39f2564243e943cf38703eadb7245d92337b238082034",
      "c3ef74a07ef0cf016eb0428deb76d6036d13be343c65225946471113a2da475b",
      "21e5909392249ecca6677410c30d70323402d886975df807df2b865697fd9e6d",
      "7f2db461e724c675317130c653258a4b277e647e938b946b40687decd535111e",
    ];
    for (const hash of hashes) expect(sha256(resolve(root, `source_vault/objects/sha256/${hash.slice(0, 2)}/${hash}`))).toBe(hash);
  });

  it("keeps all seven Ramayana districts on exact Ayodhya, Aranya, and Yuddha source ranges", () => {
    const ramayana = heroJourneys.find((journey) => journey.slug === "ramayana");
    expect(ramayana?.title).toBe("The promise, the forest, the sandals, and the return");
    const ayodhya = ramayana!.stops.slice(0, 8);
    const firstRivers = ramayana!.stops.slice(8, 16);
    const emptyThrone = ramayana!.stops.slice(16, 24);
    const roadAsksHome = ramayana!.stops.slice(24, 32);
    const deeperDandaka = ramayana!.stops.slice(32, 40);
    const panchavatiAbduction = ramayana!.stops.slice(40, 48);
    const roadHome = ramayana!.stops.slice(48);
    expect(ayodhya.map((stop) => stop.citation.sourceOrdinal)).toEqual([76, 82, 83, 87, 90, 94, 101, 106]);
    expect(ayodhya.map((stop) => [stop.citation.locator.kanda_relative_ordinal_start, stop.citation.locator.kanda_relative_ordinal_end])).toEqual([[1, 6], [7, 7], [8, 11], [12, 14], [15, 18], [19, 25], [26, 30], [31, 40]]);
    expect(ayodhya.flatMap((stop) => Array.from({ length: Number(stop.citation.locator.section_count) }, (_, index) => Number(stop.citation.locator.kanda_relative_ordinal_start) + index))).toEqual(Array.from({ length: 40 }, (_, index) => index + 1));
    expect(ayodhya.every((stop) => stop.citation.sourceSha256 === "7d3b9e1613d60dfacea39f2564243e943cf38703eadb7245d92337b238082034" && stop.citation.rightsLane === "product_allowed")).toBe(true);
    expect(firstRivers.map((stop) => stop.citation.sourceOrdinal)).toEqual([116, 121, 124, 126, 127, 128, 129, 131]);
    expect(firstRivers.map((stop) => [stop.citation.locator.kanda_relative_ordinal_start, stop.citation.locator.kanda_relative_ordinal_end])).toEqual([[41, 45], [46, 48], [49, 50], [51, 51], [52, 52], [53, 53], [54, 55], [56, 56]]);
    expect([...ayodhya, ...firstRivers].flatMap((stop) => Array.from({ length: Number(stop.citation.locator.section_count) }, (_, index) => Number(stop.citation.locator.kanda_relative_ordinal_start) + index))).toEqual(Array.from({ length: 56 }, (_, index) => index + 1));
    expect(firstRivers.every((stop) => stop.citation.sourceSha256 === "7d3b9e1613d60dfacea39f2564243e943cf38703eadb7245d92337b238082034" && stop.citation.rightsLane === "product_allowed")).toBe(true);
    expect(emptyThrone.map((stop) => stop.citation.sourceOrdinal)).toEqual([132, 135, 138, 140, 144, 147, 150, 153]);
    expect(emptyThrone.map((stop) => [stop.citation.locator.kanda_relative_ordinal_start, stop.citation.locator.kanda_relative_ordinal_end])).toEqual([[57, 59], [60, 62], [63, 64], [65, 68], [69, 71], [72, 74], [75, 77], [78, 82]]);
    expect([...ayodhya, ...firstRivers, ...emptyThrone].flatMap((stop) => Array.from({ length: Number(stop.citation.locator.section_count) }, (_, index) => Number(stop.citation.locator.kanda_relative_ordinal_start) + index))).toEqual(Array.from({ length: 82 }, (_, index) => index + 1));
    expect(emptyThrone.every((stop) => stop.citation.sourceSha256 === "7d3b9e1613d60dfacea39f2564243e943cf38703eadb7245d92337b238082034" && stop.citation.rightsLane === "product_allowed")).toBe(true);
    expect(roadAsksHome.map((stop) => stop.citation.sourceOrdinal)).toEqual([158, 161, 165, 168, 174, 179, 183, 188]);
    expect(roadAsksHome.map((stop) => [stop.citation.locator.kanda_relative_ordinal_start, stop.citation.locator.kanda_relative_ordinal_end])).toEqual([[83, 85], [86, 89], [90, 92], [93, 98], [99, 103], [104, 107], [108, 112], [113, 115]]);
    expect([...ayodhya, ...firstRivers, ...emptyThrone, ...roadAsksHome].flatMap((stop) => Array.from({ length: Number(stop.citation.locator.section_count) }, (_, index) => Number(stop.citation.locator.kanda_relative_ordinal_start) + index))).toEqual(Array.from({ length: 115 }, (_, index) => index + 1));
    expect(roadAsksHome.every((stop) => stop.citation.sourceSha256 === "7d3b9e1613d60dfacea39f2564243e943cf38703eadb7245d92337b238082034" && stop.citation.rightsLane === "product_allowed")).toBe(true);
    expect(deeperDandaka.map((stop) => stop.citation.sourceOrdinal)).toEqual([191, 192, 1, 2, 5, 7, 10, 11]);
    expect(deeperDandaka.slice(0, 2).map((stop) => [stop.citation.locator.kanda_relative_ordinal_start, stop.citation.locator.kanda_relative_ordinal_end])).toEqual([[116, 116], [117, 118]]);
    expect([...ayodhya, ...firstRivers, ...emptyThrone, ...roadAsksHome, ...deeperDandaka.slice(0, 2)].flatMap((stop) => Array.from({ length: Number(stop.citation.locator.section_count) }, (_, index) => Number(stop.citation.locator.kanda_relative_ordinal_start) + index))).toEqual(Array.from({ length: 118 }, (_, index) => index + 1));
    expect(deeperDandaka.slice(2).map((stop) => [stop.citation.locator.source_relative_ordinal_start, stop.citation.locator.source_relative_ordinal_end])).toEqual([[1, 1], [2, 4], [5, 6], [7, 9], [10, 10], [11, 12]]);
    expect(deeperDandaka.slice(2).flatMap((stop) => Array.from({ length: Number(stop.citation.locator.source_ordered_count) }, (_, index) => Number(stop.citation.locator.source_relative_ordinal_start) + index))).toEqual(Array.from({ length: 12 }, (_, index) => index + 1));
    expect(deeperDandaka.slice(0, 2).every((stop) => stop.citation.sourceSha256 === "7d3b9e1613d60dfacea39f2564243e943cf38703eadb7245d92337b238082034" && stop.citation.rightsLane === "product_allowed")).toBe(true);
    expect(deeperDandaka.slice(2).every((stop) => stop.citation.sourceSha256 === "c3ef74a07ef0cf016eb0428deb76d6036d13be343c65225946471113a2da475b" && stop.citation.rightsLane === "product_allowed")).toBe(true);
    expect(panchavatiAbduction.map((stop) => stop.citation.sourceOrdinal)).toEqual([13, 16, 18, 31, 38, 43, 46, 49]);
    expect(panchavatiAbduction.map((stop) => [stop.citation.locator.source_relative_ordinal_start, stop.citation.locator.source_relative_ordinal_end])).toEqual([[13, 15], [16, 17], [18, 30], [31, 37], [38, 42], [43, 45], [46, 48], [49, 53]]);
    expect([...deeperDandaka.slice(2), ...panchavatiAbduction].flatMap((stop) => Array.from({ length: Number(stop.citation.locator.source_ordered_count) }, (_, index) => Number(stop.citation.locator.source_relative_ordinal_start) + index))).toEqual(Array.from({ length: 53 }, (_, index) => index + 1));
    expect(panchavatiAbduction.every((stop) => stop.citation.sourceSha256 === "c3ef74a07ef0cf016eb0428deb76d6036d13be343c65225946471113a2da475b" && stop.citation.rightsLane === "product_allowed")).toBe(true);
    expect(roadHome.map((stop) => stop.citation.sourceOrdinal)).toEqual([122, 123, 124, 125, 126, 127, 128]);
    expect(roadHome.map((stop) => stop.citation.locator.literal_section_number)).toEqual([124, 125, 126, 127, 128, 129, 130]);
    expect(roadHome.every((stop) => stop.citation.sourceSha256 === "8d1b8901823f5b5bd8b3207370991ddf95e5c76cb30ad5271aef835c9708464b" && stop.citation.rightsLane === "product_allowed")).toBe(true);
    expect(ramayana?.stops.every((stop) => stop.visual && stop.visual.connections.length === 3)).toBe(true);
    expect(emptyThrone.map((stop) => stop.visual?.asset)).toEqual([
      "/journeys/ramayana-throne-empty-chariot-v1.webp",
      "/journeys/ramayana-throne-palace-grief-v1.webp",
      "/journeys/ramayana-throne-river-memory-v1.webp",
      "/journeys/ramayana-throne-city-without-king-v1.webp",
      "/journeys/ramayana-throne-bharata-return-v1.webp",
      "/journeys/ramayana-throne-boons-rejected-v1.webp",
      "/journeys/ramayana-throne-funeral-trust-v1.webp",
      "/journeys/ramayana-throne-road-to-rama-v1.webp",
    ]);
    expect(roadAsksHome.map((stop) => stop.visual?.asset)).toEqual([
      "/journeys/ramayana-bharata-expedition-ganga-v1.webp",
      "/journeys/ramayana-bharata-ingudi-crossing-v1.webp",
      "/journeys/ramayana-bharata-bharadvaja-wonder-v1.webp",
      "/journeys/ramayana-bharata-chitrakoot-alarm-v1.webp",
      "/journeys/ramayana-bharata-brothers-meet-v1.webp",
      "/journeys/ramayana-bharata-family-council-v1.webp",
      "/journeys/ramayana-bharata-sandals-vow-v1.webp",
      "/journeys/ramayana-bharata-nandigrama-v1.webp",
    ]);
    expect(deeperDandaka.map((stop) => stop.visual?.asset)).toEqual([
      "/journeys/ramayana-dandaka-chitrakoot-departure-v1.webp",
      "/journeys/ramayana-dandaka-sita-anasuya-v1.webp",
      "/journeys/ramayana-dandaka-hermitages-v1.webp",
      "/journeys/ramayana-dandaka-viradha-v1.webp",
      "/journeys/ramayana-dandaka-sarabhanga-v1.webp",
      "/journeys/ramayana-dandaka-sita-dialogue-v1.webp",
      "/journeys/ramayana-dandaka-panchapsara-v1.webp",
      "/journeys/ramayana-dandaka-agastya-v1.webp",
    ]);
    expect(panchavatiAbduction.map((stop) => stop.visual?.asset)).toEqual([
      "/journeys/ramayana-panchavati-jatayu-home-v1.webp",
      "/journeys/ramayana-panchavati-surpanakha-v1.webp",
      "/journeys/ramayana-panchavati-janasthana-v1.webp",
      "/journeys/ramayana-panchavati-ravana-maricha-v1.webp",
      "/journeys/ramayana-panchavati-golden-deer-v1.webp",
      "/journeys/ramayana-panchavati-empty-cottage-v1.webp",
      "/journeys/ramayana-panchavati-abduction-sky-v1.webp",
      "/journeys/ramayana-panchavati-jatayu-resistance-v1.webp",
    ]);
    expect(roadHome.map((stop) => stop.visual?.asset)).toEqual([
      "/journeys/ramayana-return-lanka-v1.webp",
      "/journeys/ramayana-return-sky-road-v1.webp",
      "/journeys/ramayana-return-hermitage-v1.webp",
      "/journeys/ramayana-return-hanuman-ahead-v1.webp",
      "/journeys/ramayana-return-bharata-hears-v1.webp",
      "/journeys/ramayana-return-ayodhya-v1.webp",
      "/journeys/ramayana-return-coronation-v1.webp",
    ]);
  });

  sourceVaultIt("reconstructs every Panchavati-abduction stop from its exact Aranya source span", () => {
    const root = resolve(process.cwd(), "../..");
    const sourcePath = resolve(root, "source_vault/objects/sha256/c3/c3ef74a07ef0cf016eb0428deb76d6036d13be343c65225946471113a2da475b");
    const bytes = readFileSync(sourcePath);
    const panchavatiAbduction = heroJourneys.find((journey) => journey.slug === "ramayana")!.stops.slice(40, 48);
    for (const stop of panchavatiAbduction) {
      const start = stop.citation.locator.byte_start;
      const end = stop.citation.locator.byte_end_exclusive;
      expect(typeof start).toBe("number");
      expect(typeof end).toBe("number");
      expect(createHash("sha256").update(bytes.subarray(start as number, end as number)).digest("hex"), stop.id).toBe(stop.citation.spanSha256);
    }
  });

  it("reconstructs every Diwali stop from the exact derived evidence-pack byte span", () => {
    const root = resolve(process.cwd(), "../..");
    const path = resolve(root, "knowledge_packs/rituals/diwali-lakshmi-puja-west-india-v1.json");
    const bytes = readFileSync(path);
    const journey = heroJourneys.find((item) => item.slug === "diwali");
    expect(sha256(path)).toBe("c73343da9b873400ed7bcc307b30aedb7de751c38c6e672ac41f98de05b389c1");
    expect(journey).toBeDefined();
    for (const stop of journey!.stops) {
      const start = stop.citation.locator.byte_start;
      const end = stop.citation.locator.byte_end_exclusive;
      expect(typeof start).toBe("number");
      expect(typeof end).toBe("number");
      expect(createHash("sha256").update(bytes.subarray(start as number, end as number)).digest("hex")).toBe(stop.citation.spanSha256);
      expect(stop.citation.locator.generated_evidence_pack).toBe(true);
    }
  });

  it("derives challenge requirements exactly from the journey stops and never uses spiritual scoring", () => {
    expect(heroChallenges).toHaveLength(4);
    for (const challenge of heroChallenges) {
      const journey = heroJourneys.find((candidate) => candidate.slug === challenge.journeySlug);
      expect(challenge.requiredStopIds).toEqual(journey?.stops.map((stop) => stop.id));
      expect(challenge.spiritualScore).toBe(false);
    }
  });
});
