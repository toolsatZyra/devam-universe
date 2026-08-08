import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveChhathObservance } from "./chhath";

const profiles = [
  { civilDate: "2026-11-15", latitude: 25.5941, longitude: 85.1376, timezone: "Asia/Kolkata", traditionCode: "surya-chhath-bihar-purvanchal" },
  { civilDate: "2026-11-15", latitude: 28.6139, longitude: 77.209, timezone: "Asia/Kolkata", traditionCode: "surya-chhath-bihar-purvanchal" },
] as const;

describe("bounded Chhath date and sequence resolver", () => {
  it.each(profiles)("selects the unique Shashthi-bearing sunset for an exact reference profile", (request) => {
    const [rule] = resolveChhathObservance(request, "test-v1");
    expect(rule).toMatchObject({
      observanceSlug: "chhath-puja-sandhya-arghya",
      selectedCivilDate: "2026-11-15",
      appliesToRequestedDate: true,
      targetTithi: { index: 6, name: "Shashthi", paksha: "shukla" },
      followingUshaArghya: { civilDate: "2026-11-16" },
    });
    expect(rule.candidateDays.map((day) => [day.civilDate, day.tithiAtSunset.index, day.qualifies])).toEqual([
      ["2026-11-14", 5, false],
      ["2026-11-15", 6, true],
    ]);
    expect(rule.boundaries).toMatchObject({ completeFamilyVrataProcedureClaimed: false, fastingOrNirjalaRegimenPrescribed: false, universalTraditionClaim: false });
  });

  it("returns the exact four-day ordinal and fails closed outside profile, tradition, and date", () => {
    const patna = { ...profiles[0] };
    expect(resolveChhathObservance({ ...patna, civilDate: "2026-11-13" }, "test-v1")[0].sequenceDay).toMatchObject({ ordinal: 1, nameEn: "Nahay Khay" });
    expect(resolveChhathObservance({ ...patna, civilDate: "2026-11-16" }, "test-v1")[0].sequenceDay).toMatchObject({ ordinal: 4, nameEn: "Usha Arghya and Parana day" });
    expect(resolveChhathObservance({ ...patna, latitude: 25.7 }, "test-v1")).toEqual([]);
    expect(resolveChhathObservance({ ...patna, traditionCode: "smarta-north-india" }, "test-v1")).toEqual([]);
    expect(resolveChhathObservance({ ...patna, civilDate: "2026-11-12" }, "test-v1")).toEqual([]);
  });

  it("rehashes the exact frozen evidence fixture", () => {
    const path = resolve(process.cwd(), "../..", "knowledge_packs/panchang/chhath-patna-delhi-2026-v1.json");
    expect(createHash("sha256").update(readFileSync(path)).digest("hex")).toBe("b7eaedaf748be5a721b21a663799f56787cff7ded4afd402d638108c62b9b53e");
  });
});
