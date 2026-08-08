import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveDiwaliProcedure } from "./diwali";

const supported = { observanceSlug: "diwali-lakshmi-puja", languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" } as const;

describe("Diwali Lakshmi Puja practice pack", () => {
  it("returns the three-tier West India household guide and a status-labelled six-day sequence", () => {
    const guide = resolveDiwaliProcedure(supported);
    expect(guide?.tiers.map((tier) => [tier.tier, tier.estimatedMinutes])).toEqual([["minimum", 12], ["standard", 35], ["elaborate", 75]]);
    expect(guide?.dailySequence).toHaveLength(6);
    expect(guide?.dailySequence?.filter((day) => day.calendarStatus === "resolved_for_bounded_2026_context").map((day) => day.ordinal)).toEqual([4]);
    expect(guide?.dailySequence?.[1]).toMatchObject({
      commonName: "Dhantrayodashi / Yama Deepam",
      calendarStatus: "partially_resolved_distinct_lanes",
      calendarNote: "Dhantrayodashi and Yama Deepam are separate resolved date records with separate bounded North/West household guides; wider Dhanvantari, regional, family, and formal practices remain open.",
    });
    expect(guide?.boundaries).toMatchObject({
      statusLabelledDiwaliSequenceIncluded: true,
      fastingOrMedicalRegimenPrescribed: false,
      fireworksRequiredOrRecommended: false,
      preciseMuhurtaCalculated: false,
      oneUniversalProcedureClaimed: false,
    });
  });

  it("returns a separately authored Hindi guide and keeps regional lanes distinct", () => {
    const guide = resolveDiwaliProcedure({ ...supported, languageCode: "hi" });
    expect(guide?.title).toContain("लक्ष्मी-पूजन");
    expect(guide?.tiers[0].steps[0].instruction).toContain("सटीक मुहूर्त");
    expect(guide?.boundaries).toMatchObject({ bengaliKaliPujaIncluded: false, southIndianDeepavaliIncluded: false, jainDiwaliIncluded: false });
  });

  it("fails closed for another region or tradition and rehashes the exact pack", () => {
    expect(resolveDiwaliProcedure({ ...supported, regionCode: "north-india" })).toBeNull();
    expect(resolveDiwaliProcedure({ ...supported, traditionCode: "shakta-bengal" })).toBeNull();
    const path = resolve(process.cwd(), "../..", "knowledge_packs/rituals/diwali-lakshmi-puja-west-india-v1.json");
    expect(createHash("sha256").update(readFileSync(path)).digest("hex")).toBe(resolveDiwaliProcedure(supported)?.evidence.packFileSha256);
  });
});
