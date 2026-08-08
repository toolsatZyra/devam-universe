import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveRitualSeasonDay } from "./ritual-season";

describe("bounded ritual-season context", () => {
  it("maps all 15 Delhi Mahalaya/Pitru Paksha civil dates without inventing personal applicability", () => {
    const dates = [
      ...Array.from({ length: 5 }, (_, index) => `2026-09-${String(26 + index).padStart(2, "0")}`),
      ...Array.from({ length: 10 }, (_, index) => `2026-10-${String(1 + index).padStart(2, "0")}`),
    ];
    const days = dates.map((civilDate) => resolveRitualSeasonDay({ civilDate, traditionCode: "smarta-north-india" }));
    expect(days.map((day) => day?.ordinal)).toEqual(Array.from({ length: 15 }, (_, index) => index + 1));
    expect(days.every((day) => day?.status === "calendar_context_only")).toBe(true);
    expect(days.every((day) => day?.denials.personalAncestorApplicabilityResolved === false)).toBe(true);
    expect(days.flatMap((day) => day?.labels ?? [])).toHaveLength(18);
  });

  it("retains multiple same-date labels instead of flattening them", () => {
    expect(resolveRitualSeasonDay({ civilDate: "2026-09-29", traditionCode: "smarta-north-india" })?.labels.map((label) => label.en)).toEqual(["Tritiya Shraddha", "Maha Bharani"]);
    expect(resolveRitualSeasonDay({ civilDate: "2026-09-30", traditionCode: "smarta-north-india" })?.labels.map((label) => label.en)).toEqual(["Chaturthi Shraddha", "Panchami Shraddha"]);
    expect(resolveRitualSeasonDay({ civilDate: "2026-10-07", traditionCode: "smarta-north-india" })?.labels.map((label) => label.en)).toEqual(["Dwadashi Shraddha", "Magha Shraddha"]);
  });

  it("binds the compact semantic fixture and fixed historical source", () => {
    const path = resolve(process.cwd(), "../..", "knowledge_packs/panchang/pitru-paksha-delhi-2026-v1.json");
    const fixtureSha256 = createHash("sha256").update(readFileSync(path)).digest("hex");
    const day = resolveRitualSeasonDay({ civilDate: "2026-10-10", traditionCode: "smarta-north-india" });
    expect(fixtureSha256).toBe("d88a379b5bec6f73801d486e0133767593b19dd882b530ebad43ef33bfe86f22");
    expect(day?.evidence).toMatchObject({ fixtureSha256, fixedSourceSha256: "a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b", fixedSourcePdfPages: [163, 164, 165, 166, 167, 168, 169, 170] });
  });

  it("fails closed outside the exact date and tradition scope", () => {
    expect(resolveRitualSeasonDay({ civilDate: "2026-09-25", traditionCode: "smarta-north-india" })).toBeNull();
    expect(resolveRitualSeasonDay({ civilDate: "2026-10-11", traditionCode: "smarta-north-india" })).toBeNull();
    expect(resolveRitualSeasonDay({ civilDate: "2026-10-01", traditionCode: "smarta-west-india" })).toBeNull();
    expect(resolveRitualSeasonDay({ civilDate: "2026-10-01", traditionCode: "shakta-bengal" })).toBeNull();
  });
});
