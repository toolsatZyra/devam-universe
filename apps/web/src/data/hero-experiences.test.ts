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

  sourceVaultIt("pins the five canonical source objects currently used by the source journeys and nested feature", () => {
    const root = resolve(process.cwd(), "../..");
    const hashes = [
      "a569551e8a972935d540bc53e57effa919868367234ab3b5334d07a1e7f84901",
      "1fa8d3e9da23d83abd334661db3a95574bfd6290943441c374d9bce4ef142ed9",
      "6f9e92eeb176b097b5e36a68676748c49152c07fea365da450bc54052d2f7062",
      "21e5909392249ecca6677410c30d70323402d886975df807df2b865697fd9e6d",
      "7f2db461e724c675317130c653258a4b277e647e938b946b40687decd535111e",
    ];
    for (const hash of hashes) expect(sha256(resolve(root, `source_vault/objects/sha256/${hash.slice(0, 2)}/${hash}`))).toBe(hash);
  });

  it("keeps the reviewed Hanuman deliberation episode nested inside Sundarakanda and preserves all three edition coordinates", () => {
    const ramayana = heroJourneys.find((journey) => journey.slug === "ramayana");
    const feature = ramayana?.stops.find((stop) => stop.id === "sundara-kanda")?.feature;
    expect(feature).toMatchObject({ id: "hanuman-deliberation", title: "Before Hanuman speaks to Sita" });
    expect(feature?.citations.map((citation) => [citation.sourceOrdinal, citation.locator.sarga, citation.locator.literal_canto_number])).toEqual([
      [352, 28, undefined],
      [367, undefined, 30],
      [30, undefined, undefined],
    ]);
    expect(feature?.citations.every((citation) => citation.rightsLane === "private_evidence" && citation.quotation === undefined)).toBe(true);
    expect(feature?.sourceBoundary).toContain("visually reviewed Dutt Section XXX");
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
