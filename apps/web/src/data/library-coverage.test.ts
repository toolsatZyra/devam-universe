import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { LAUNCH_REGIONAL_ACCEPTANCE_PROFILES } from "./launch-regional-acceptance";
import { LIBRARY_COVERAGE_SNAPSHOT, formatLibraryBytes } from "./library-coverage";

const root = resolve(process.cwd(), "../..");

describe("honest library coverage snapshot", () => {
  it("matches the retained source-vault summary exactly", () => {
    const path = resolve(root, "source_vault/summary.json");
    const bytes = readFileSync(path);
    const summary = JSON.parse(bytes.toString("utf8")) as {
      object_count: number;
      object_bytes: number;
      catalogs: { source_leads: number };
    };
    expect(createHash("sha256").update(bytes).digest("hex")).toBe("bec4dee70e83360e51f569c411c6e690df371338068acef7209e40fea41339c1");
    expect(LIBRARY_COVERAGE_SNAPSHOT.sourceLibrary).toMatchObject({
      uniqueObjects: summary.object_count,
      objectBytes: summary.object_bytes,
      discoveryLeads: summary.catalogs.source_leads,
    });
    expect(formatLibraryBytes(summary.object_bytes)).toBe("6.17 GB");
  });

  it("reconstructs the current ritual classifications rather than counting legacy inputs", () => {
    const packs = readdirSync(resolve(root, "knowledge_packs/rituals"), { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
      .map((entry) => JSON.parse(readFileSync(resolve(root, "knowledge_packs/rituals", entry.name), "utf8")) as {
        contract?: string;
        product_status?: { classification?: string };
      });
    const current = packs.filter((pack) => pack.contract === "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1");
    expect(current).toHaveLength(LIBRARY_COVERAGE_SNAPSHOT.launchLayer.currentRitualRecords);
    expect(current.filter((pack) => pack.product_status?.classification === "user_complete_lane")).toHaveLength(LIBRARY_COVERAGE_SNAPSHOT.launchLayer.userCompleteScopedLanes);
    expect(current.filter((pack) => pack.product_status?.classification === "participation_companion")).toHaveLength(LIBRARY_COVERAGE_SNAPSHOT.launchLayer.participationCompanions);
  });

  it("keeps all four hero universes visibly partial", () => {
    expect(LIBRARY_COVERAGE_SNAPSHOT.heroes.map((hero) => hero.slug)).toEqual(["ganesha", "durga", "ramayana", "diwali"]);
    expect(LIBRARY_COVERAGE_SNAPSHOT.heroes.every((hero) => hero.connected.length > 100 && hero.open.length > 90)).toBe(true);
    expect(LIBRARY_COVERAGE_SNAPSHOT.launchLayer.deterministicDates).toBe(122);
    expect(LIBRARY_COVERAGE_SNAPSHOT.launchLayer.deterministicDateTotal).toBe(122);
    expect(LIBRARY_COVERAGE_SNAPSHOT.launchLayer.regionalAcceptanceProfiles).toBe(LAUNCH_REGIONAL_ACCEPTANCE_PROFILES.length);
    expect(LIBRARY_COVERAGE_SNAPSHOT.launchLayer.regionalAcceptanceCities).toBe(new Set(LAUNCH_REGIONAL_ACCEPTANCE_PROFILES.map((profile) => profile.city)).size);
    expect(LIBRARY_COVERAGE_SNAPSHOT.knowledgeLayer).toMatchObject({
      sourceReferences: 102,
      passages: 9_091,
      publishedPassages: 3_298,
      reviewOrPrivatePassages: 5_793,
      sourceAlignedBetaTranslations: 1_176,
      civilizationallyCompleteHeroWorlds: 0,
      heroWorldTotal: 4,
    });
    expect(LIBRARY_COVERAGE_SNAPSHOT.knowledgeLayer.publishedPassages + LIBRARY_COVERAGE_SNAPSHOT.knowledgeLayer.reviewOrPrivatePassages).toBe(LIBRARY_COVERAGE_SNAPSHOT.knowledgeLayer.passages);
    expect(LIBRARY_COVERAGE_SNAPSHOT.heroes.find((hero) => hero.slug === "durga")?.connected).toContain("588 English and 588 Hindi");
    expect(LIBRARY_COVERAGE_SNAPSHOT.knowledgeLayer.sourceAlignedBetaTranslations).toBe(588 + 588);
    expect(LIBRARY_COVERAGE_SNAPSHOT.knowledgeLayer.boundary).toContain("not percentages");
  });
});
