import { describe, expect, it } from "vitest";
import { POST } from "./route";

function request(body: unknown) {
  return new Request("http://localhost/api/observances", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/observances", () => {
  it("returns one bounded Ganesh Chaturthi resolution while keeping full-day and ritual claims false", async () => {
    const response = await POST(request({
      civilDate: "2026-09-14",
      latitude: 19.076,
      longitude: 72.8777,
      timezone: "Asia/Kolkata",
      traditionCode: "smarta-west-india",
    }));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.status).toBe("resolved_supported_subset");
    expect(result.matchedRules.find((rule: { observanceSlug: string }) => rule.observanceSlug === "ganesh-chaturthi")).toMatchObject({
      observanceSlug: "ganesh-chaturthi",
      selectedCivilDate: "2026-09-14",
      appliesToRequestedDate: true,
    });
    expect(result.boundaries).toMatchObject({
      completeDayCoverage: false,
      completeSeptemberDecemberCoverage: false,
      ritualGuidanceIncluded: false,
    });
  });

  it("returns no assignment for an unsupported tradition", async () => {
    const response = await POST(request({
      civilDate: "2026-09-14",
      latitude: 19.076,
      longitude: 72.8777,
      timezone: "Asia/Kolkata",
      traditionCode: "smarta-south-india",
    }));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.status).toBe("no_supported_rule_for_context");
    expect(result.matchedRules).toEqual([]);
  });

  it("returns the bounded Delhi Smarta Devutthana date while keeping Smarta parana unresolved", async () => {
    const response = await POST(request({
      civilDate: "2026-11-20",
      latitude: 28.6139,
      longitude: 77.209,
      timezone: "Asia/Kolkata",
      traditionCode: "smarta-north-india",
    }));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result).toMatchObject({ status: "resolved_supported_subset", unresolvedCandidates: [] });
    expect(result.matchedRules.find((rule: { observanceSlug: string }) => rule.observanceSlug === "devutthana-ekadashi")).toMatchObject({
      observanceSlug: "devutthana-ekadashi",
      selectedCivilDate: "2026-11-20",
      appliesToRequestedDate: true,
      lane: "smarta",
      parana: { status: "unresolved_smarta_location_specific_hari_vasara_evidence_required", startUtc: null, endUtc: null },
      boundaries: { smartaDateResolved: true, vaishnavaDateResolved: false, paranaResolved: false, ritualGuidanceIncluded: false },
    });
  });

  it("returns the shifted Chennai ISKCON Utpanna date and validated parana window", async () => {
    const response = await POST(request({
      civilDate: "2026-12-05",
      latitude: 13.0827,
      longitude: 80.2707,
      timezone: "Asia/Kolkata",
      traditionCode: "vaishnava-iskcon",
    }));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result).toMatchObject({
      status: "resolved_supported_subset",
      matchedRules: [{
        observanceSlug: "utpanna-ekadashi",
        selectedCivilDate: "2026-12-05",
        appliesToRequestedDate: true,
        profileId: "chennai",
        classification: "paksha_vardhini_mahadwadashi",
        parana: {
          status: "resolved_for_exact_iskcon_reference_profile",
          providerObservedStartLocal: "2026-12-06T06:18:00+05:30",
          providerObservedEndLocal: "2026-12-06T10:06:00+05:30",
        },
      }],
      unresolvedCandidates: [],
    });
  });

  it.each([
    ["2026-12-01", "kalabhairava-jayanti"],
    ["2026-12-14", "vivaha-panchami"],
    ["2026-10-11", "shardiya-navaratri-begins"],
    ["2026-10-20", "vijayadashami"],
    ["2026-10-29", "karwa-chauth"],
    ["2026-10-29", "sankashti-chaturthi-2026-10"],
    ["2026-10-25", "kojagara-puja-sharad-purnima"],
    ["2026-09-19", "masika-durgashtami-2026-09"],
    ["2026-09-14", "hartalika-teej"],
    ["2026-09-15", "rishi-panchami"],
    ["2026-09-04", "krishna-janmashtami-smarta"],
    ["2026-10-19", "masika-durgashtami-2026-10"],
    ["2026-11-17", "masika-durgashtami-2026-11"],
    ["2026-12-17", "masika-durgashtami-2026-12"],
    ["2026-09-26", "bhadrapada-purnima"],
    ["2026-10-26", "ashwina-purnima"],
    ["2026-11-24", "kartika-purnima"],
    ["2026-09-11", "bhadrapada-amavasya"],
    ["2026-10-10", "ashwina-amavasya"],
    ["2026-11-09", "kartika-amavasya"],
    ["2026-12-08", "margashirsha-amavasya"],
    ["2026-11-05", "govatsa-dwadashi"],
    ["2026-11-06", "yama-deepam"],
    ["2026-11-06", "dhantrayodashi"],
    ["2026-11-08", "diwali-lakshmi-puja"],
    ["2026-11-10", "govardhan-puja"],
    ["2026-11-11", "bhai-dooj"],
    ["2026-09-08", "pradosha-2026-09-krishna"],
    ["2026-09-24", "pradosha-2026-09-shukla"],
    ["2026-10-08", "pradosha-2026-10-krishna"],
    ["2026-10-23", "pradosha-2026-10-shukla"],
    ["2026-11-06", "pradosha-2026-11-krishna"],
    ["2026-11-22", "pradosha-2026-11-shukla"],
    ["2026-12-06", "pradosha-2026-12-krishna"],
    ["2026-12-21", "pradosha-2026-12-shukla"],
    ["2026-09-25", "ananta-chaturdashi"],
    ["2026-10-17", "tula-sankranti"],
    ["2026-11-16", "vrishchika-sankranti"],
    ["2026-12-16", "dhanu-sankranti"],
  ])("resolves the bounded North India fixture on %s", async (civilDate, observanceSlug) => {
    const response = await POST(request({
      civilDate,
      latitude: 28.6139,
      longitude: 77.209,
      timezone: "Asia/Kolkata",
      traditionCode: "smarta-north-india",
    }));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.status).toBe("resolved_supported_subset");
    const match = result.matchedRules.find((rule: { observanceSlug: string }) => rule.observanceSlug === observanceSlug);
    expect(match).toMatchObject({ observanceSlug, selectedCivilDate: civilDate, appliesToRequestedDate: true });
    expect(match.boundaries).toMatchObject({
      completeSeptemberDecemberCoverage: false,
      modernPracticeResolved: false,
      ritualGuidanceIncluded: false,
      universalTraditionClaim: false,
    });
  });

  it("returns the bounded Maharashtra Naraka Chaturdashi window without merging Kali Chaudas or Tamil Deepavali", async () => {
    const response = await POST(request({ civilDate: "2026-11-08", latitude: 19.076, longitude: 72.8777, timezone: "Asia/Kolkata", traditionCode: "smarta-west-india" }));
    const result = await response.json();
    expect(response.status).toBe(200);
    const naraka = result.matchedRules.find((rule: { observanceSlug: string }) => rule.observanceSlug === "naraka-chaturdashi");
    expect(naraka).toMatchObject({ canonicalName: "Naraka Chaturdashi / Abhyanga Snan", selectedCivilDate: "2026-11-08", precedence: { kind: "unique_full_kartika_krishna_chaturdashi_overlap_with_local_moonrise_to_sunrise_fail_closed" }, boundaries: { modernPracticeResolved: false, ritualGuidanceIncluded: false } });
    expect(naraka.evidence.modernReference.semanticFixtureSha256).toBe("adf5c3d43e6f2fb19ef3ecc75fc92d2cfc671105c2eed87edda11872d34a33a5");
    expect(result.matchedRules.some((rule: { observanceSlug: string }) => rule.observanceSlug === "tamil-deepavali-naraka-chaturdashi")).toBe(false);
  });

  it("returns BAPS Kali Chaudash only for the explicit Ahmedabad sampradaya context", async () => {
    const response = await POST(request({ civilDate: "2026-11-07", latitude: 23.0225, longitude: 72.5714, timezone: "Asia/Kolkata", traditionCode: "swaminarayan-baps" }));
    const result = await response.json();
    expect(response.status).toBe(200);
    const applying = result.matchedRules.filter((rule: { appliesToRequestedDate: boolean }) => rule.appliesToRequestedDate);
    expect(applying).toHaveLength(1);
    expect(applying[0]).toMatchObject({ observanceSlug: "kali-chaudas-baps", canonicalName: "Kali Chaudash / Hanuman Puja", selectedCivilDate: "2026-11-07", boundaries: { modernPracticeResolved: false, ritualGuidanceIncluded: false } });
  });

  it("returns BAPS Gujarati New Year only for the exact Ahmedabad sampradaya context", async () => {
    const response = await POST(request({ civilDate: "2026-11-10", latitude: 23.0225, longitude: 72.5714, timezone: "Asia/Kolkata", traditionCode: "swaminarayan-baps" }));
    const result = await response.json();
    expect(response.status).toBe(200);
    const applying = result.matchedRules.filter((rule: { appliesToRequestedDate: boolean }) => rule.appliesToRequestedDate);
    expect(applying).toHaveLength(1);
    expect(applying[0]).toMatchObject({ observanceSlug: "gujarati-new-year-baps", canonicalName: "Gujarati New Year / Bestu Varash / Annakut", selectedCivilDate: "2026-11-10", boundaries: { modernPracticeResolved: false, ritualGuidanceIncluded: false } });
  });

  it("returns Karnataka Balipadyami only for the bounded Bengaluru South India context", async () => {
    const response = await POST(request({ civilDate: "2026-11-10", latitude: 12.9716, longitude: 77.5946, timezone: "Asia/Kolkata", traditionCode: "smarta-south-india" }));
    const result = await response.json();
    expect(response.status).toBe(200);
    const applying = result.matchedRules.filter((rule: { appliesToRequestedDate: boolean }) => rule.appliesToRequestedDate);
    expect(applying).toHaveLength(1);
    expect(applying[0]).toMatchObject({ observanceSlug: "karnataka-balipadyami", canonicalName: "Bali Padyami / Balipadyami", selectedCivilDate: "2026-11-10", boundaries: { modernPracticeResolved: false, ritualGuidanceIncluded: false } });
  });

  it("returns the umbrella Jain Diwali record without importing Hindu Diwali lanes", async () => {
    const response = await POST(request({ civilDate: "2026-11-08", latitude: 28.6139, longitude: 77.209, timezone: "Asia/Kolkata", traditionCode: "jain-umbrella" }));
    const result = await response.json();
    expect(response.status).toBe(200);
    const applying = result.matchedRules.filter((rule: { appliesToRequestedDate: boolean }) => rule.appliesToRequestedDate);
    expect(applying).toHaveLength(1);
    expect(applying[0]).toMatchObject({ observanceSlug: "jain-diwali-umbrella", canonicalName: "Jain Diwali / Mahavira's Liberation", selectedCivilDate: "2026-11-08", evidence: { citationArtifactSha256: "1b72b1eb9710d35e90618e02e840e4cb6129e0aa726df667fa637e42e62f117d" }, boundaries: { modernPracticeResolved: false, ritualGuidanceIncluded: false } });
  });

  it("returns Bandi Chhor only for the exact Amritsar SGPC lane", async () => {
    const response = await POST(request({ civilDate: "2026-11-08", latitude: 31.634, longitude: 74.8723, timezone: "Asia/Kolkata", traditionCode: "sikh-sgpc" }));
    const result = await response.json();
    expect(response.status).toBe(200);
    const applying = result.matchedRules.filter((rule: { appliesToRequestedDate: boolean }) => rule.appliesToRequestedDate);
    expect(applying).toHaveLength(1);
    expect(applying[0]).toMatchObject({ observanceSlug: "bandi-chhor-divas-sgpc", canonicalName: "Bandi Chhor Divas", selectedCivilDate: "2026-11-08", evidence: { citationArtifactSha256: "01536637248ca6fe97b426ffc1bc6e42f7e33e611c0d461e59f40a46b6573a7b" }, boundaries: { modernPracticeResolved: false, ritualGuidanceIncluded: false } });
  });

  it("returns Ahoi Ashtami only for the bounded Delhi North India lane", async () => {
    const response = await POST(request({ civilDate: "2026-11-01", latitude: 28.6139, longitude: 77.209, timezone: "Asia/Kolkata", traditionCode: "smarta-north-india" }));
    const result = await response.json();
    expect(response.status).toBe(200);
    const applying = result.matchedRules.filter((rule: { appliesToRequestedDate: boolean }) => rule.appliesToRequestedDate);
    expect(applying).toHaveLength(1);
    expect(applying[0]).toMatchObject({ observanceSlug: "ahoi-ashtami-north-india", canonicalName: "Ahoi Ashtami / Ahoi Aathe", selectedCivilDate: "2026-11-01", evidence: { citationArtifactSha256: "f35053c40b788f82da8264ae8d7675e706ea5152b925f6ee86fd6c87d9a3831c" }, boundaries: { modernPracticeResolved: false, ritualGuidanceIncluded: false } });
  });

  it("returns Bengal Kali Puja as a separate Shakta record on the coincident Diwali date", async () => {
    const response = await POST(request({
      civilDate: "2026-11-08",
      latitude: 22.5726,
      longitude: 88.3639,
      timezone: "Asia/Kolkata",
      traditionCode: "shakta-bengal",
    }));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.status).toBe("resolved_supported_subset");
    expect(result.matchedRules.filter((rule: { appliesToRequestedDate: boolean }) => rule.appliesToRequestedDate)).toHaveLength(1);
    expect(result.matchedRules[0]).toMatchObject({
      observanceSlug: "bengal-kali-puja",
      canonicalName: "Kali Puja / Shyama Puja",
      selectedCivilDate: "2026-11-08",
      appliesToRequestedDate: true,
      boundaries: { modernPracticeResolved: false, ritualGuidanceIncluded: false },
    });
  });

  it("returns Tamil Deepavali as a separate South India record without importing North/West Lakshmi Puja", async () => {
    const response = await POST(request({
      civilDate: "2026-11-08",
      latitude: 13.0827,
      longitude: 80.2707,
      timezone: "Asia/Kolkata",
      traditionCode: "smarta-south-india",
    }));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.status).toBe("resolved_supported_subset");
    expect(result.matchedRules.filter((rule: { appliesToRequestedDate: boolean }) => rule.appliesToRequestedDate)).toHaveLength(1);
    expect(result.matchedRules[0]).toMatchObject({
      observanceSlug: "tamil-deepavali-naraka-chaturdashi",
      canonicalName: "Tamil Deepavali / Naraka Chaturdashi",
      selectedCivilDate: "2026-11-08",
      appliesToRequestedDate: true,
      boundaries: { modernPracticeResolved: false, ritualGuidanceIncluded: false },
    });
    expect(result.matchedRules.some((rule: { observanceSlug: string }) => rule.observanceSlug === "diwali-lakshmi-puja")).toBe(false);
  });

  it("keeps Bali Pratipada separate from Govardhan Puja in the West India context", async () => {
    const response = await POST(request({
      civilDate: "2026-11-10",
      latitude: 19.076,
      longitude: 72.8777,
      timezone: "Asia/Kolkata",
      traditionCode: "smarta-west-india",
    }));
    const result = await response.json();
    expect(result.matchedRules.filter((rule: { appliesToRequestedDate: boolean }) => rule.appliesToRequestedDate).map((rule: { observanceSlug: string }) => rule.observanceSlug)).toEqual(["bali-pratipada", "govardhan-puja"]);
  });

  it("serves the bounded ISKCON Radha Ashtami lane without importing the Smarta Masika Durgashtami record", async () => {
    const response = await POST(request({
      civilDate: "2026-09-19",
      latitude: 28.6139,
      longitude: 77.209,
      timezone: "Asia/Kolkata",
      traditionCode: "vaishnava-iskcon",
    }));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.matchedRules).toHaveLength(1);
    expect(result.matchedRules[0]).toMatchObject({ observanceSlug: "radha-ashtami-iskcon", selectedCivilDate: "2026-09-19", appliesToRequestedDate: true });
  });

  it("serves the bounded ISKCON Krishna Janmashtami lane without importing the Smarta rule", async () => {
    const response = await POST(request({
      civilDate: "2026-09-04",
      latitude: 28.6139,
      longitude: 77.209,
      timezone: "Asia/Kolkata",
      traditionCode: "vaishnava-iskcon",
    }));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.matchedRules).toHaveLength(1);
    expect(result.matchedRules[0]).toMatchObject({ observanceSlug: "krishna-janmashtami-iskcon", selectedCivilDate: "2026-09-04", appliesToRequestedDate: true });
  });

  it("does not promote the rejected September 16 Balarama attribution", async () => {
    const response = await POST(request({
      civilDate: "2026-09-16",
      latitude: 28.6139,
      longitude: 77.209,
      timezone: "Asia/Kolkata",
      traditionCode: "vaishnava-iskcon",
    }));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.matchedRules.some((rule: { observanceSlug: string }) => rule.observanceSlug === "hala-shashthi-hal-chhath")).toBe(false);
    expect(result.unresolvedCandidates.some((candidate: { observanceSlug: string }) => candidate.observanceSlug.includes("balarama"))).toBe(false);
  });

  it("returns the exact Agastya Arghya fixture beside the resolved Smarta Janmashtami lane", async () => {
    const response = await POST(request({
      civilDate: "2026-09-04",
      latitude: 28.6139,
      longitude: 77.209,
      timezone: "Asia/Kolkata",
      traditionCode: "smarta-north-india",
    }));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.status).toBe("resolved_supported_subset");
    expect(result.matchedRules).toEqual(expect.arrayContaining([expect.objectContaining({ observanceSlug: "krishna-janmashtami-smarta", selectedCivilDate: "2026-09-04" })]));
    expect(result.matchedRules).toEqual(expect.arrayContaining([expect.objectContaining({ observanceSlug: "agastya-arghya-delhi", selectedCivilDate: "2026-09-04", status: "resolved_exact_provider_fixture" })]));
    expect(result.unresolvedCandidates).toEqual([]);
    expect(result.boundaries.ritualGuidanceIncluded).toBe(false);
  });

  it("returns separate Kanya Sankranti and Bengal Vishwakarma Puja records without ritual guidance", async () => {
    const response = await POST(request({
      civilDate: "2026-09-17",
      latitude: 22.5726,
      longitude: 88.3639,
      timezone: "Asia/Kolkata",
      traditionCode: "regional-bengal",
    }));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.matchedRules.map((rule: { observanceSlug: string }) => rule.observanceSlug)).toEqual(["kanya-sankranti", "vishwakarma-puja-bengal"]);
    expect(result.matchedRules).toEqual(expect.arrayContaining([
      expect.objectContaining({ observanceSlug: "kanya-sankranti", selectedCivilDate: "2026-09-17" }),
      expect.objectContaining({ observanceSlug: "vishwakarma-puja-bengal", selectedCivilDate: "2026-09-17" }),
    ]));
    expect(result.matchedRules.every((rule: { boundaries: { ritualGuidanceIncluded: boolean } }) => rule.boundaries.ritualGuidanceIncluded === false)).toBe(true);
  });

  it("returns Margashirsha Purnima as unresolved when the modern lead differs from the sunrise-only result", async () => {
    const response = await POST(request({
      civilDate: "2026-12-23",
      latitude: 28.6139,
      longitude: 77.209,
      timezone: "Asia/Kolkata",
      traditionCode: "smarta-north-india",
    }));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      status: "unresolved_candidate_requires_adjudication",
      unresolvedCandidates: [{ observanceSlug: "margashirsha-purnima", selectedCivilDate: null }],
    });
  });

  it("serves the exact Patna Chhath four-day lane and preserves the family-vrata boundary", async () => {
    const response = await POST(request({
      civilDate: "2026-11-15",
      latitude: 25.5941,
      longitude: 85.1376,
      timezone: "Asia/Kolkata",
      traditionCode: "surya-chhath-bihar-purvanchal",
    }));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.matchedRules).toHaveLength(1);
    expect(result.matchedRules[0]).toMatchObject({
      observanceSlug: "chhath-puja-sandhya-arghya",
      selectedCivilDate: "2026-11-15",
      sequenceDay: { ordinal: 3, nameEn: "Chhath Puja and Sandhya Arghya" },
      boundaries: { completeFamilyVrataProcedureClaimed: false, fastingOrNirjalaRegimenPrescribed: false },
    });
  });

  it("serves Varanasi Dev Deepawali beside generic Kartika Purnima without importing the BAPS lane", async () => {
    const response = await POST(request({
      civilDate: "2026-11-24",
      latitude: 25.3176,
      longitude: 82.9739,
      timezone: "Asia/Kolkata",
      traditionCode: "regional-kashi-varanasi",
    }));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.matchedRules.filter((rule: { appliesToRequestedDate: boolean }) => rule.appliesToRequestedDate)).toEqual(expect.arrayContaining([
      expect.objectContaining({ observanceSlug: "kartika-purnima", selectedCivilDate: "2026-11-24" }),
      expect.objectContaining({ observanceSlug: "dev-deepawali-varanasi", selectedCivilDate: "2026-11-24" }),
    ]));
    expect(result.matchedRules.some((rule: { observanceSlug: string }) => rule.observanceSlug.includes("baps"))).toBe(false);
  });

  it("rejects invalid context", async () => {
    const response = await POST(request({ civilDate: "2026-09-14" }));
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ ok: false, code: "NEEDS_CONTEXT" });
  });
});
