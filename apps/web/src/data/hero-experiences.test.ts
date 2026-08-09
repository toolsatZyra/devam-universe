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
      "21e5909392249ecca6677410c30d70323402d886975df807df2b865697fd9e6d",
      "7f2db461e724c675317130c653258a4b277e647e938b946b40687decd535111e",
    ];
    for (const hash of hashes) expect(sha256(resolve(root, `source_vault/objects/sha256/${hash.slice(0, 2)}/${hash}`))).toBe(hash);
  });

  it("keeps the playable Ramayana return route on seven exact consecutive Yuddha Kanda passages", () => {
    const ramayana = heroJourneys.find((journey) => journey.slug === "ramayana");
    expect(ramayana?.title).toBe("The road home to Ayodhya");
    expect(ramayana?.stops.map((stop) => stop.citation.sourceOrdinal)).toEqual([122, 123, 124, 125, 126, 127, 128]);
    expect(ramayana?.stops.map((stop) => stop.citation.locator.literal_section_number)).toEqual([124, 125, 126, 127, 128, 129, 130]);
    expect(ramayana?.stops.every((stop) => stop.citation.sourceSha256 === "8d1b8901823f5b5bd8b3207370991ddf95e5c76cb30ad5271aef835c9708464b" && stop.citation.rightsLane === "product_allowed")).toBe(true);
    expect(ramayana?.stops.every((stop) => stop.visual && stop.visual.connections.length === 3)).toBe(true);
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
