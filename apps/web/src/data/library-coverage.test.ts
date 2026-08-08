import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
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
    expect(createHash("sha256").update(bytes).digest("hex")).toBe("d19c50c87daac8e3be40e10b72556c8e58646c8bd74bda80ca0727d9dba55757");
    expect(LIBRARY_COVERAGE_SNAPSHOT.sourceLibrary).toMatchObject({
      uniqueObjects: summary.object_count,
      objectBytes: summary.object_bytes,
      discoveryLeads: summary.catalogs.source_leads,
    });
    expect(formatLibraryBytes(summary.object_bytes)).toBe("5.97 GB");
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
  });
});
