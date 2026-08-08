import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveHeroCampaignDay } from "./hero-calendar";

describe("bounded hero campaign calendar", () => {
  it("maps the exact ten-day North/West Smarta Navaratri lane", () => {
    const dates = Array.from({ length: 10 }, (_, index) => `2026-10-${String(11 + index).padStart(2, "0")}`);
    const days = dates.map((civilDate) => resolveHeroCampaignDay({ civilDate, traditionCode: "smarta-north-india" }));
    expect(days.map((day) => day?.ordinal)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(days[0]).toMatchObject({ heroSlug: "durga", commonName: "Shailaputri", evidence: { observanceRulesetVersion: "devam-observance-rules-2026-v21" } });
    expect(days[9]).toMatchObject({ commonName: "Vijayadashami", boundaries: { allNavaratriTraditionsComplete: false } });
  });

  it("maps all 12 civil dates in the bounded West India Ganeshotsav crosswalk", () => {
    const dates = Array.from({ length: 12 }, (_, index) => `2026-09-${String(14 + index).padStart(2, "0")}`);
    const days = dates.map((civilDate) => resolveHeroCampaignDay({ civilDate, traditionCode: "smarta-west-india" }));
    expect(days.map((day) => day?.ordinal)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(days[0]).toMatchObject({
      heroSlug: "ganesha",
      commonName: "Ganesh Chaturthi",
      evidence: {
        practicePackId: "ganesh-chaturthi-west-india-content-v1",
        practicePackSha256: "eaa9f4576ecd9587ea205039ca633c569ad61d4f79637e8eb7774182a86163dd",
      },
    });
    expect(days[6]).toMatchObject({ commonName: "Family-chosen Ganeshotsav day", boundaries: { mandatoryFestivalDurationClaim: false } });
    expect(days[11]).toMatchObject({ commonName: "Anant Chaturdashi Visarjan lane", boundaries: { anantaVrataAndGaneshVisarjanSameRitual: false } });
    expect(days.every((day) => day?.evidence.observanceRulesetVersion === "devam-observance-rules-2026-v21")).toBe(true);
  });

  it("binds the compact Ganeshotsav campaign fixture by exact bytes", () => {
    const path = resolve(process.cwd(), "../..", "knowledge_packs/campaigns/ganeshotsav-mumbai-2026-v1.json");
    const sha256 = createHash("sha256").update(readFileSync(path)).digest("hex");
    const day = resolveHeroCampaignDay({ civilDate: "2026-09-20", traditionCode: "smarta-west-india" });
    expect(sha256).toBe("bcf8ae5898adadec8ab3d0544f46945fb666567e7b95bd6e3fa374764b25a504");
    expect(day?.evidence.campaignFixtureSha256).toBe(sha256);
  });

  it("maps the separate six-day Kolkata/Bengal Durga Puja lane", () => {
    const dates = Array.from({ length: 6 }, (_, index) => `2026-10-${String(16 + index).padStart(2, "0")}`);
    const days = dates.map((civilDate) => resolveHeroCampaignDay({ civilDate, traditionCode: "shakta-bengal" }));
    expect(days.map((day) => day?.ordinal)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(days[0]).toMatchObject({ commonName: "Bilva Nimantran", practiceGuideObservanceSlug: "bengal-durga-puja-campaign", evidence: { practicePackId: "bengal-durga-puja-participant-content-v1", practicePackSha256: "ef0727519e45314eefbdfcfd83f2ffc750b9ba5ea6399ab4cdbed64cf05afa59" } });
    expect(days[3]).toMatchObject({
      commonName: "Maha Ashtami",
      practiceGuideObservanceSlug: "bengal-mahashtami-community-participant-2026",
      evidence: {
        practicePackId: "bengal-mahashtami-community-participant-2026-v1",
        practicePackSha256: "8f4437ecb12e0c1cf6cd803312162f2b616f291b60dd24de309a6ee00f38625b",
      },
      boundaries: {
        exactMahashtamiParticipantLaneComplete: true,
        completeHouseholdPujaVidhi: false,
        priestLedVidhiResolved: false,
      },
    });
    expect(days[5]).toMatchObject({ commonName: "Vijayadashami and Bengal Durga Visarjan", boundaries: { allDurgaPujaTraditionsComplete: false } });
    expect(resolveHeroCampaignDay({ civilDate: "2026-10-20", traditionCode: "smarta-north-india" })).toMatchObject({ campaignId: "shardiya-navaratri-2026-north-west-smarta", commonName: "Vijayadashami" });
    expect(resolveHeroCampaignDay({ civilDate: "2026-10-20", traditionCode: "shakta-bengal" })).toMatchObject({ campaignId: "durga-puja-2026-bengal-shakta", commonName: "Maha Navami" });
  });

  it("binds the compact Kolkata Durga Puja fixture by exact bytes", () => {
    const path = resolve(process.cwd(), "../..", "knowledge_packs/campaigns/durga-puja-kolkata-2026-v1.json");
    const sha256 = createHash("sha256").update(readFileSync(path)).digest("hex");
    const day = resolveHeroCampaignDay({ civilDate: "2026-10-19", traditionCode: "shakta-bengal" });
    expect(sha256).toBe("c8bec184a2de4f245b1354e386daaa0fbdb9113dbc3b35e53fc335dd99b7204a");
    expect(day?.evidence.campaignFixtureSha256).toBe(sha256);
  });

  it("fails closed outside fixed intervals and supported traditions", () => {
    expect(resolveHeroCampaignDay({ civilDate: "2026-09-13", traditionCode: "smarta-west-india" })).toBeNull();
    expect(resolveHeroCampaignDay({ civilDate: "2026-09-26", traditionCode: "smarta-west-india" })).toBeNull();
    expect(resolveHeroCampaignDay({ civilDate: "2026-09-20", traditionCode: "smarta-north-india" })).toBeNull();
    expect(resolveHeroCampaignDay({ civilDate: "2026-10-10", traditionCode: "smarta-north-india" })).toBeNull();
    expect(resolveHeroCampaignDay({ civilDate: "2026-10-21", traditionCode: "smarta-west-india" })).toBeNull();
    expect(resolveHeroCampaignDay({ civilDate: "2026-10-15", traditionCode: "shakta-bengal" })).toBeNull();
    expect(resolveHeroCampaignDay({ civilDate: "2026-10-22", traditionCode: "shakta-bengal" })).toBeNull();
    expect(resolveHeroCampaignDay({ civilDate: "2026-10-15", traditionCode: "smarta-south-india" })).toBeNull();
  });
});
