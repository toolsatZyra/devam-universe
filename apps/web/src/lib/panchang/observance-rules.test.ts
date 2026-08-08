import { describe, expect, it } from "vitest";
import { resolveBoundedObservances, type ObservanceRuleResolution } from "./observance-rules";
import type { EkadashiResolution } from "./ekadashi";

const mumbaiRequest = {
  civilDate: "2026-09-14",
  latitude: 19.076,
  longitude: 72.8777,
  timezone: "Asia/Kolkata",
  traditionCode: "smarta-west-india",
} as const;

const delhiRequest = {
  latitude: 28.6139,
  longitude: 77.209,
  timezone: "Asia/Kolkata",
  traditionCode: "smarta-north-india",
} as const;

function expectWithinMoonrise(actualIso: string, expectedIso: string, toleranceMinutes: number) {
  expect(Math.abs(Date.parse(actualIso) - Date.parse(expectedIso))).toBeLessThanOrEqual(toleranceMinutes * 60_000);
}

describe("bounded observance rule engine", () => {
  function ruleFor(result: ReturnType<typeof resolveBoundedObservances>, observanceSlug: string): ObservanceRuleResolution {
    const rule = result.matchedRules.find((candidate) => candidate.observanceSlug === observanceSlug);
    expect(rule, `missing ${observanceSlug}`).toBeDefined();
    if (!rule || !("candidateDays" in rule) || rule.status !== "resolved_for_bounded_2026_candidate_window") throw new Error(`${observanceSlug} is not a standard lunar observance rule`);
    return rule;
  }

  function ekadashiFor(result: ReturnType<typeof resolveBoundedObservances>, observanceSlug: string): EkadashiResolution {
    const rule = result.matchedRules.find((candidate) => candidate.observanceSlug === observanceSlug);
    expect(rule, `missing ${observanceSlug}`).toBeDefined();
    if (!rule || !("lane" in rule) || rule.status !== "resolved_for_exact_2026_city_tradition_profile") throw new Error(`${observanceSlug} is not an Ekadashi profile resolution`);
    return rule;
  }

  it("resolves Kalabhairava Jayanti only from a unique candidate night with one ghati of Krishna Ashtami", () => {
    const result = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-12-01" });
    const rule = ruleFor(result, "kalabhairava-jayanti");
    expect(rule).toMatchObject({
      canonicalName: "Kalabhairava Jayanti / Bhairava Ashtami",
      selectedCivilDate: "2026-12-01",
      appliesToRequestedDate: true,
      targetTithi: { index: 23, name: "Ashtami", paksha: "krishna" },
      precedence: { kind: "unique_candidate_night_with_at_least_one_ghati_krishna_ashtami_overlap_otherwise_fail_closed" },
      evidence: { citationArtifactSha256: "df5444680f998850f9115ce71e65da251b9afd70f77031098c9dd7b06afff229", evidenceStatus: "current_practitioner_rule_and_official_regional_identity_fixture", rightsLane: "reference_only", sourceTextReturnedByApi: false, modernReference: { semanticFixtureSha256: "df5444680f998850f9115ce71e65da251b9afd70f77031098c9dd7b06afff229" } },
    });
    expect(rule.candidateDays.map((day) => [day.civilDate, day.decisionWindow.kind, day.targetTithiOverlapSeconds >= 1440])).toEqual([
      ["2026-12-01", "night", true],
      ["2026-12-02", "night", false],
    ]);
    expect(rule.boundaries).toEqual({ completeDayCoverage: false, completeSeptemberDecemberCoverage: false, modernPracticeResolved: false, ritualGuidanceIncluded: false, universalTraditionClaim: false });
  });

  it("resolves Vivaha Panchami only from the unique Margashirsha Shukla Panchami sunrise", () => {
    const result = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-12-14" });
    const rule = ruleFor(result, "vivaha-panchami");
    expect(rule).toMatchObject({
      canonicalName: "Vivaha Panchami",
      selectedCivilDate: "2026-12-14",
      appliesToRequestedDate: true,
      targetTithi: { index: 5, name: "Panchami", paksha: "shukla" },
      precedence: { kind: "unique_margashirsha_shukla_panchami_at_local_sunrise_otherwise_fail_closed" },
      evidence: {
        citationArtifactSha256: "5ac334e9efa8fe548b572ef6ce5d4d982206cc774a4a2672735c75b665a7770c",
        evidenceStatus: "current_practitioner_rule_and_official_regional_identity_fixture",
        rightsLane: "reference_only",
        sourceTextReturnedByApi: false,
        modernReference: { semanticFixtureSha256: "5ac334e9efa8fe548b572ef6ce5d4d982206cc774a4a2672735c75b665a7770c" },
      },
    });
    expect(rule.candidateDays.map((day) => [day.civilDate, day.decisionWindow.kind, day.targetTithiOverlapSeconds])).toEqual([
      ["2026-12-13", "sunrise_presence", 0],
      ["2026-12-14", "sunrise_presence", 60],
    ]);
    expect(rule.evidence.sourceScopeNote).toContain("Janakpur, Ayodhya, and Orchha practices remain distinct");
    expect(resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-12-14", traditionCode: "smarta-west-india" }).matchedRules.some((candidate) => candidate.observanceSlug === "vivaha-panchami")).toBe(false);
  });

  it("selects 2026 Ganesh Chaturthi by the source-bounded madhyahna precedence rule", () => {
    const result = resolveBoundedObservances(mumbaiRequest);
    expect(result.status).toBe("resolved_supported_subset");
    expect(result.matchedRules).toHaveLength(2);
    const rule = ruleFor(result, "ganesh-chaturthi");
    expect(rule.selectedCivilDate).toBe("2026-09-14");
    expect(rule.appliesToRequestedDate).toBe(true);
    expect(rule.candidateDays.map((day) => day.civilDate)).toEqual(["2026-09-14", "2026-09-15"]);
    expect(rule.candidateDays[0].decisionWindow.kind).toBe("madhyahna");
    expect(rule.candidateDays[0].targetTithiOverlapSeconds).toBeGreaterThan(0);
    expect(rule.candidateDays[1].targetTithiOverlapSeconds).toBe(0);
    expect(rule.evidence).toMatchObject({
      internetArchiveIdentifier: "in.ernet.dli.2015.365977",
      citationImageSha256: "a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b",
      pdfPages: [50, 51],
      rightsLane: "private_evidence",
      sourceTextReturnedByApi: false,
    });
    expect(rule.boundaries).toEqual({ completeDayCoverage: false, completeSeptemberDecemberCoverage: false, modernPracticeResolved: false, ritualGuidanceIncluded: false, universalTraditionClaim: false });
  });

  it("resolves Hartalika Teej on the later sunrise-bearing Tritiya without merging Ganesh Chaturthi or Gowri Habba", () => {
    const result = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-09-14" });
    const hartalika = ruleFor(result, "hartalika-teej");
    expect(hartalika).toMatchObject({
      canonicalName: "Hartalika Teej",
      selectedCivilDate: "2026-09-14",
      appliesToRequestedDate: true,
      targetTithi: { index: 3, name: "Tritiya", paksha: "shukla" },
      precedence: { kind: "bhadrapada_shukla_tritiya_at_sunrise_later_day" },
      evidence: {
        pdfPages: [150],
        rightsLane: "private_evidence",
        sourceTextReturnedByApi: false,
        modernReference: {
          observedCivilDate: "2026-09-14",
          semanticFixtureSha256: "bef1772cbb368da2fa712740598d1881b98ffc1b6d8c4a99cfc93e02fa3420a3",
          responseBytes: 66646,
          responseSha256: "90f7b062dcd887fb0eb0c2922bef3ae281e4cf378ec5f680c4f3bc0c69a915ae",
        },
      },
      boundaries: { modernPracticeResolved: false, ritualGuidanceIncluded: false, universalTraditionClaim: false },
    });
    expect(hartalika.candidateDays.map((day) => [day.civilDate, day.decisionWindow.kind, day.targetTithiOverlapSeconds])).toEqual([
      ["2026-09-13", "sunrise_presence", 0],
      ["2026-09-14", "sunrise_presence", 60],
    ]);
    expect(hartalika.evidence.sourceScopeNote).toContain("not a complete ritual procedure");
    expect(ruleFor(resolveBoundedObservances(mumbaiRequest), "ganesh-chaturthi").selectedCivilDate).toBe("2026-09-14");
  });

  it("does not generalize the bounded Hartalika lane into the unresolved South Indian Gowri Habba context", () => {
    const result = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-09-14", traditionCode: "smarta-south-india" });
    expect(result).toMatchObject({ status: "no_supported_rule_for_context", matchedRules: [] });
  });

  it("resolves Rishi Panchami only when one candidate madhyahna bears Panchami", () => {
    const result = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-09-15" });
    const rishiPanchami = ruleFor(result, "rishi-panchami");
    expect(rishiPanchami).toMatchObject({
      canonicalName: "Rishi Panchami",
      selectedCivilDate: "2026-09-15",
      appliesToRequestedDate: true,
      targetTithi: { index: 5, name: "Panchami", paksha: "shukla" },
      precedence: { kind: "unique_bhadrapada_shukla_panchami_overlap_with_local_madhyahna_otherwise_fail_closed" },
      evidence: {
        pdfPages: [151],
        rightsLane: "private_evidence",
        sourceTextReturnedByApi: false,
        modernReference: {
          observedCivilDate: "2026-09-15",
          semanticFixtureSha256: "ddc41a55a00b9755949f4a175a0edb05fc546b6a624acdd0992ffbf8e9b731e1",
          responseBytes: 62659,
          responseSha256: "20ecae009600fb8f4b58d03a1a510752db7bf18183205122460120d9399aa59a",
        },
      },
      boundaries: { modernPracticeResolved: false, ritualGuidanceIncluded: false, universalTraditionClaim: false },
    });
    expect(rishiPanchami.candidateDays.map((day) => [day.civilDate, day.decisionWindow.kind, day.targetTithiOverlapSeconds > 0])).toEqual([
      ["2026-09-15", "madhyahna", true],
      ["2026-09-16", "madhyahna", false],
    ]);
    expect(rishiPanchami.evidence.sourceScopeNote).toContain("conflicting two-day precedence");
  });

  it("keeps the ISKCON Radha Ashtami lane distinct from Masika Durgashtami on the same civil date", () => {
    const result = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-09-19", traditionCode: "vaishnava-iskcon" });
    const radhaAshtami = ruleFor(result, "radha-ashtami-iskcon");
    expect(radhaAshtami).toMatchObject({
      canonicalName: "Radha Ashtami",
      selectedCivilDate: "2026-09-19",
      appliesToRequestedDate: true,
      targetTithi: { index: 8, name: "Ashtami", paksha: "shukla" },
      precedence: { kind: "greater_bhadrapada_shukla_ashtami_overlap_during_local_madhyahna_later_tie" },
      evidence: {
        pdfPages: [51, 52],
        evidenceStatus: "historical_general_tithi_context_plus_current_practitioner_rule_and_location_fixture",
        rightsLane: "private_evidence",
        sourceTextReturnedByApi: false,
        modernReference: {
          observedCivilDate: "2026-09-19",
          semanticFixtureSha256: "93f9fc2539ff87495012d31d9c87115c68b317eab679dbfc1725877ed9455867",
          responseBytes: 67159,
          responseSha256: "fae89430859fb45d5f1f00fa9969477fd197646f2453e9e7befffad6546452b1",
        },
      },
      boundaries: { modernPracticeResolved: false, ritualGuidanceIncluded: false, universalTraditionClaim: false },
    });
    expect(radhaAshtami.candidateDays[1].targetTithiOverlapSeconds).toBeGreaterThan(radhaAshtami.candidateDays[0].targetTithiOverlapSeconds);
    expect(result.matchedRules.some((rule) => rule.observanceSlug === "masika-durgashtami-2026-09")).toBe(false);
    expect(resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-09-19" }).matchedRules.some((rule) => rule.observanceSlug === "radha-ashtami-iskcon")).toBe(false);
  });

  it("resolves separate Smarta and ISKCON Krishna Janmashtami lanes without pretending their rules are equivalent", () => {
    const smartaResult = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-09-04" });
    const iskconResult = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-09-04", traditionCode: "vaishnava-iskcon" });
    expect(smartaResult.status).toBe("resolved_supported_subset");
    expect(iskconResult.status).toBe("resolved_supported_subset");
    const smarta = ruleFor(smartaResult, "krishna-janmashtami-smarta");
    const iskcon = ruleFor(iskconResult, "krishna-janmashtami-iskcon");

    for (const rule of [smarta, iskcon]) {
      expect(rule).toMatchObject({
        selectedCivilDate: "2026-09-04",
        appliesToRequestedDate: true,
        targetTithi: { index: 23, name: "Ashtami", paksha: "krishna" },
        targetNakshatra: { index: 4, name: "Rohini" },
        evidence: {
          pdfPages: [140, 141, 142, 143, 144, 145, 146, 147, 148, 149],
          rightsLane: "private_evidence",
          sourceTextReturnedByApi: false,
          modernReference: {
            observedCivilDate: "2026-09-04",
            semanticFixtureSha256: "a05f45a558061686e16fbe739b4d78dc5e86f9cf0c809c7f8eec28063123bdf1",
          },
        },
        boundaries: { modernPracticeResolved: false, ritualGuidanceIncluded: false, universalTraditionClaim: false },
      });
      expect(rule.candidateDays.map((day) => [day.civilDate, day.decisionWindow.kind, day.targetTithiOverlapSeconds > 0])).toEqual([
        ["2026-09-03", "nishita", false],
        ["2026-09-04", "nishita", true],
      ]);
      expect(rule.candidateDays[0].targetNakshatraOverlapSeconds).toBeGreaterThan(0);
      expect(rule.candidateDays[1].targetNakshatraOverlapSeconds).toBe(0);
    }

    expect(smarta.evidence.modernReference).toMatchObject({ responseBytes: 88987, responseSha256: "9f4e450ca60b167289584cdc200a5d2599572756d48dba4bc49819cfe2119b3c" });
    expect(iskcon.evidence.modernReference).toMatchObject({ responseBytes: 83943, responseSha256: "d683b0823e1bdcc708910485f4d04ba8211452d06d35163fb9797fd7f33e62fd" });
    expect(smarta.ruleId).not.toBe(iskcon.ruleId);
    expect(smartaResult.matchedRules.some((rule) => rule.observanceSlug === "krishna-janmashtami-iskcon")).toBe(false);
    expect(iskconResult.matchedRules.some((rule) => rule.observanceSlug === "krishna-janmashtami-smarta")).toBe(false);
  });

  it("resolves Agastya Arghya only as the exact New Delhi 2026 provider fixture", () => {
    const result = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-09-04" });
    const rule = result.matchedRules.find((item) => item.observanceSlug === "agastya-arghya-delhi");
    expect(rule).toMatchObject({
      canonicalName: "Agastya Arghya",
      status: "resolved_exact_provider_fixture",
      selectedCivilDate: "2026-09-04",
      displayedLocalWindow: "04:58-06:00",
      evidence: {
        citationArtifactSha256: "0d0413830f7accb290d27a94ffd72f73262a857aea20e90f5f3353d17856a744",
        authorityKind: "location_specific_practitioner_calendar_fixture",
      },
      boundaries: { generalAlgorithmProved: false, providerMethodReproduced: false, visibilityGuaranteed: false, ritualGuidanceIncluded: false, universalTraditionClaim: false },
    });
    expect(result.unresolvedCandidates).toEqual([]);
    expect(resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-09-04", latitude: 28.62 }).matchedRules.some((item) => item.observanceSlug === "agastya-arghya-delhi")).toBe(false);
    expect(resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-09-04", traditionCode: "vaishnava-iskcon" }).matchedRules.some((item) => item.observanceSlug === "agastya-arghya-delhi")).toBe(false);
  });

  it("resolves Hala Shashthi on September 2 while rejecting the conflicting September 16 Balarama lead", () => {
    const september2 = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-09-02" });
    expect(september2.matchedRules.find((rule) => rule.observanceSlug === "hala-shashthi-hal-chhath")).toMatchObject({
      canonicalName: "Hala Shashthi / Hal Chhath",
      selectedCivilDate: "2026-09-02",
      appliesToRequestedDate: true,
      evidence: { citationArtifactSha256: "4f67365d3f8198fcf4f50ca5ceb39879d24c672f3be7157b8f9e68cffa1ef6c9" },
    });
    expect(september2.unresolvedCandidates).toEqual([]);
    const september16 = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-09-16" });
    expect(september16.matchedRules.some((rule) => rule.observanceSlug === "hala-shashthi-hal-chhath")).toBe(false);
    expect(september16.unresolvedCandidates.some((candidate) => candidate.observanceSlug.includes("balarama"))).toBe(false);
    expect(resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-09-02", traditionCode: "vaishnava-iskcon" }).matchedRules.some((rule) => rule.observanceSlug === "hala-shashthi-hal-chhath")).toBe(false);
    expect(resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-09-02", longitude: 77.21 }).matchedRules.some((rule) => rule.observanceSlug === "hala-shashthi-hal-chhath")).toBe(false);
  });

  it("keeps Kanya Sankranti and Bengal Vishwakarma Puja as connected but separate resolved identities", () => {
    const result = resolveBoundedObservances({
      civilDate: "2026-09-17",
      latitude: 22.5726,
      longitude: 88.3639,
      timezone: "Asia/Kolkata",
      traditionCode: "regional-bengal",
    });
    expect(result.engine).toMatchObject({ version: "devam-observance-rules-2026-v35", evidenceStatus: "bounded_source_rules_with_location_specific_fixture_validation" });
    expect(result.status).toBe("resolved_supported_subset");
    expect(result.matchedRules.map((rule) => rule.observanceSlug)).toEqual(["kanya-sankranti", "vishwakarma-puja-bengal"]);
    for (const rule of result.matchedRules) {
      expect(rule).toMatchObject({
        selectedCivilDate: "2026-09-17",
        appliesToRequestedDate: true,
        solarIngress: { fromRashi: "Simha", toRashi: "Kanya", occursOnLocalCivilDate: "2026-09-17" },
        evidence: {
          evidenceStatus: "deterministic_astronomy_plus_current_practitioner_and_official_regional_calendar",
          semanticFixtureSha256: "01efb771174a8053d36420de060d673013eb081b4cb149ee4c7299e0878e7fe1",
          rightsLane: "reference_only",
          sourceTextReturnedByApi: false,
        },
        boundaries: { modernPracticeResolved: false, ritualGuidanceIncluded: false, universalTraditionClaim: false },
      });
      if (!("solarIngress" in rule)) throw new Error("expected solar observance resolution");
      expectWithinMoonrise(rule.solarIngress.occursAtUtc, "2026-09-17T02:28:00.000Z", 10);
      expect(rule.evidence.references).toHaveLength(2);
    }

    const north = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-09-17" });
    expect(north.matchedRules.map((rule) => rule.observanceSlug)).toEqual(["kanya-sankranti"]);
    expect(resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-09-16", traditionCode: "regional-bengal" }).matchedRules).toEqual([]);
  });

  it("resolves Tula, Vrishchika, and Dhanu Sankranti as India Standard Time date identities only", () => {
    const fixtures = [
      ["2026-10-17", "tula-sankranti", "Tula Sankranti", "Kanya", "Tula", "2026-10-17T14:27:00.000Z"],
      ["2026-11-16", "vrishchika-sankranti", "Vrishchika Sankranti", "Tula", "Vrishchika", "2026-11-16T14:18:00.000Z"],
      ["2026-12-16", "dhanu-sankranti", "Dhanu Sankranti", "Vrishchika", "Dhanu", "2026-12-16T04:59:00.000Z"],
    ];
    for (const [civilDate, observanceSlug, canonicalName, fromRashi, toRashi, expectedUtc] of fixtures) {
      const result = resolveBoundedObservances({ ...delhiRequest, civilDate });
      const rule = result.matchedRules.find((candidate) => candidate.observanceSlug === observanceSlug);
      expect(rule).toMatchObject({
        canonicalName,
        selectedCivilDate: civilDate,
        appliesToRequestedDate: true,
        solarIngress: { fromRashi, toRashi, occursOnLocalCivilDate: civilDate },
        evidence: {
          evidenceStatus: "deterministic_astronomy_plus_current_practitioner_calendar",
          semanticFixtureSha256: "61f14143db751cafc99375871d2304994d7661c433f37bb8e847ae8cef01ca0f",
          sourceTextReturnedByApi: false,
        },
        boundaries: { modernPracticeResolved: false, ritualGuidanceIncluded: false, universalTraditionClaim: false },
      });
      if (!rule || !("solarIngress" in rule)) throw new Error(`missing ${observanceSlug}`);
      expectWithinMoonrise(rule.solarIngress.occursAtUtc, expectedUtc, 10);
      expect(rule.precedence.explanation).toContain("not punya-kala");
    }
    expect(resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-10-17", timezone: "Asia/Dhaka" }).matchedRules).toEqual([]);
  });

  it("resolves all four launch-window Sankashti dates by the source moonrise rule", () => {
    const fixtures = [
      ["2026-09-29", "sankashti-chaturthi-2026-09"],
      ["2026-10-29", "sankashti-chaturthi-2026-10"],
      ["2026-11-27", "sankashti-chaturthi-2026-11"],
      ["2026-12-26", "sankashti-chaturthi-2026-12"],
    ];
    for (const [civilDate, observanceSlug] of fixtures) {
      const result = resolveBoundedObservances({ ...delhiRequest, civilDate });
      const rule = ruleFor(result, observanceSlug);
      expect(rule).toMatchObject({ canonicalName: "Sankashti Chaturthi", selectedCivilDate: civilDate, appliesToRequestedDate: true, targetTithi: { index: 19, name: "Chaturthi", paksha: "krishna" } });
      expect(rule.candidateDays[1].decisionWindow.kind).toBe("moonrise_presence");
      expect(rule.evidence).toMatchObject({ pdfPages: [50], citationArtifactSha256: "d14c3552f4ff41bae44bc4cabf4c0f24265d5e099bcfe707f28349f248701944", rightsLane: "reference_only", sourceTextReturnedByApi: false, modernReference: { responseBytes: 103423, responseSha256: "e71fe295af2f9205eced859519f9061aebb1bca5e24800c864adaf3e02c90f49" } });
      expect(rule.evidence.sourceScopeNote).toContain("official Siddhivinayak Trust page");
      expect(rule.precedence.kind).toBe("sankashti_chaturthi_at_moonrise_tie_unresolved_neither_later");
    }
  });

  it("resolves the four named Purnima and four named Amavasya calendar-day lanes without flattening vrata or Darsha variants", () => {
    const fixtures = [
      ["2026-09-26", "bhadrapada-purnima", 15, "Purnima"],
      ["2026-10-26", "ashwina-purnima", 15, "Purnima"],
      ["2026-11-24", "kartika-purnima", 15, "Purnima"],
      ["2026-09-11", "bhadrapada-amavasya", 30, "Amavasya"],
      ["2026-10-10", "ashwina-amavasya", 30, "Amavasya"],
      ["2026-11-09", "kartika-amavasya", 30, "Amavasya"],
      ["2026-12-08", "margashirsha-amavasya", 30, "Amavasya"],
    ];
    for (const [civilDate, observanceSlug, index, name] of fixtures) {
      const result = resolveBoundedObservances({ ...delhiRequest, civilDate: civilDate as string });
      const rule = ruleFor(result, observanceSlug as string);
      expect(rule).toMatchObject({ selectedCivilDate: civilDate, appliesToRequestedDate: true, targetTithi: { index, name } });
      expect(rule.candidateDays[1].decisionWindow.kind).toBe("sunrise_presence");
      expect(rule.evidence.pdfPages).toContain(66);
      expect(rule.boundaries.ritualGuidanceIncluded).toBe(false);
    }
  });

  it("keeps Varanasi Dev Deepawali separate from generic Kartika Purnima and BAPS Dev Diwali", () => {
    const request = { civilDate: "2026-11-24", latitude: 25.3176, longitude: 82.9739, timezone: "Asia/Kolkata", traditionCode: "regional-kashi-varanasi" } as const;
    const result = resolveBoundedObservances(request);
    const devDeepawali = ruleFor(result, "dev-deepawali-varanasi");
    expect(devDeepawali).toMatchObject({ canonicalName: "Dev Deepawali, Varanasi", selectedCivilDate: "2026-11-24", appliesToRequestedDate: true, precedence: { kind: "unique_kartika_purnima_overlap_with_local_pradosha_fail_closed" }, evidence: { citationArtifactSha256: "84fb6f87eedb403c354312a414f6073b24b8a378c979e9da1a9b02f13921f1e8", rightsLane: "reference_only" } });
    expect(devDeepawali.candidateDays.filter((day) => day.targetTithiOverlapSeconds > 0).map((day) => day.civilDate)).toEqual(["2026-11-24"]);
    expect(ruleFor(result, "kartika-purnima")).toMatchObject({ selectedCivilDate: "2026-11-24", appliesToRequestedDate: true });
    expect(result.matchedRules.some((rule) => rule.observanceSlug === "tulsi-vivah-baps-samapt")).toBe(false);
    expect(resolveBoundedObservances({ ...request, traditionCode: "smarta-north-india" }).matchedRules.some((rule) => rule.observanceSlug === "dev-deepawali-varanasi")).toBe(false);
  });

  it("keeps the Ashwina Purnima Vrat lead separate from the named Purnima calendar day", () => {
    const result = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-10-25" });
    expect(ruleFor(result, "ashwina-purnima")).toMatchObject({ selectedCivilDate: "2026-10-26", appliesToRequestedDate: false });
    expect(ruleFor(result, "ashwina-purnima").precedence.explanation).toContain("October 25 Purnima Vrat");
  });

  it("resolves the Kojagara night by Purnima at local Nishita without merging the Ashwina Purnima calendar day", () => {
    const result = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-10-25" });
    const kojagara = ruleFor(result, "kojagara-puja-sharad-purnima");
    expect(kojagara).toMatchObject({
      canonicalName: "Kojagara Puja / Sharad Purnima",
      selectedCivilDate: "2026-10-25",
      appliesToRequestedDate: true,
      targetTithi: { index: 15, name: "Purnima", paksha: "shukla" },
      precedence: { kind: "unique_purnima_overlap_with_local_nishita_otherwise_fail_closed" },
      evidence: {
        pdfPages: [208, 209],
        rightsLane: "private_evidence",
        sourceTextReturnedByApi: false,
        modernReference: {
          observedCivilDate: "2026-10-25",
          semanticFixtureSha256: "477309b994fffd5f89eed2d810248b823a650d738964c8f7f4aff8c32698e5f2",
          responseBytes: 78509,
          responseSha256: "d0d9099a4b419a4544080ec6b652398bc37eb461f9f79ffce1782a960ddb7fac",
        },
      },
      boundaries: { modernPracticeResolved: false, ritualGuidanceIncluded: false, universalTraditionClaim: false },
    });
    expect(kojagara.candidateDays.map((day) => [day.civilDate, day.decisionWindow.kind, day.targetTithiOverlapSeconds > 0])).toEqual([
      ["2026-10-25", "nishita", true],
      ["2026-10-26", "nishita", false],
    ]);
    expect(Math.abs(Date.parse(kojagara.candidateDays[0].decisionWindow.startUtc) - Date.parse("2026-10-25T18:10:00.000Z"))).toBeLessThanOrEqual(3 * 60_000);
    expect(Math.abs(Date.parse(kojagara.candidateDays[0].decisionWindow.endUtc) - Date.parse("2026-10-25T19:01:00.000Z"))).toBeLessThanOrEqual(3 * 60_000);
    expect(ruleFor(result, "ashwina-purnima")).toMatchObject({ selectedCivilDate: "2026-10-26", appliesToRequestedDate: false });
  });

  it("keeps the Kojagara date rule available for the bounded Bengal lane but not an unrelated southern context", () => {
    const bengal = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-10-25", traditionCode: "shakta-bengal" });
    expect(ruleFor(bengal, "kojagara-puja-sharad-purnima")).toMatchObject({ selectedCivilDate: "2026-10-25", appliesToRequestedDate: true });
    const south = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-10-25", traditionCode: "smarta-south-india" });
    expect(south).toMatchObject({ status: "no_supported_rule_for_context", matchedRules: [] });
  });

  it("resolves all four launch-window Masika Durgashtami dates by the Shukla Ashtami later-day rule", () => {
    const fixtures = [
      ["2026-09-19", "masika-durgashtami-2026-09", "Masika Durgashtami"],
      ["2026-10-19", "masika-durgashtami-2026-10", "Durga Ashtami / Masika Durgashtami"],
      ["2026-11-17", "masika-durgashtami-2026-11", "Masika Durgashtami"],
      ["2026-12-17", "masika-durgashtami-2026-12", "Masika Durgashtami"],
    ] as const;
    for (const [civilDate, observanceSlug, canonicalName] of fixtures) {
      const result = resolveBoundedObservances({ ...delhiRequest, civilDate });
      const rule = ruleFor(result, observanceSlug);
      expect(rule).toMatchObject({
        canonicalName,
        selectedCivilDate: civilDate,
        appliesToRequestedDate: true,
        targetTithi: { index: 8, name: "Ashtami", paksha: "shukla" },
        precedence: { kind: "shukla_ashtami_at_sunrise_later_day" },
        evidence: {
          pdfPages: [51, 52],
          sourceTextReturnedByApi: false,
          modernReference: {
            observedCivilDate: civilDate,
            semanticFixtureSha256: "68130406f9cff8b5f2c12cff08b5b75d8d06cdef02e2d35653f34f2dbf8edcae",
            responseBytes: 82080,
            responseSha256: "c4dd71aeb98c5bc76f76878428820ae41158f6d1f4a57096d6abd5982659b47d",
          },
        },
        boundaries: { modernPracticeResolved: false, ritualGuidanceIncluded: false, universalTraditionClaim: false },
      });
      expect(rule.candidateDays).toHaveLength(2);
      expect(rule.candidateDays.every((candidate) => candidate.decisionWindow.kind === "sunrise_presence")).toBe(true);
      expect(rule.candidateDays.find((candidate) => candidate.civilDate === civilDate)?.targetTithiOverlapSeconds).toBe(60);
    }
  });

  it("keeps the bounded Masika Durgashtami date in the Bengal context without importing a Bengal puja procedure", () => {
    const result = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-10-19", traditionCode: "shakta-bengal" });
    const rule = ruleFor(result, "masika-durgashtami-2026-10");
    expect(rule).toMatchObject({ selectedCivilDate: "2026-10-19", boundaries: { modernPracticeResolved: false, ritualGuidanceIncluded: false, universalTraditionClaim: false } });
    expect(rule.evidence.sourceScopeNote).toContain("not a complete procedure");
  });

  it("fails closed on the Margashirsha Purnima sunrise-versus-moonrise divergence", () => {
    const result = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-12-23" });
    expect(result).toMatchObject({
      status: "unresolved_candidate_requires_adjudication",
      matchedRules: [],
      unresolvedCandidates: [{ observanceSlug: "margashirsha-purnima", selectedCivilDate: null, modernDateLead: "2026-12-23" }],
    });
    const pending = result.unresolvedCandidates[0];
    expect(pending.status).toBe("source_rule_and_modern_fixture_require_adjudication");
    if (pending.status !== "source_rule_and_modern_fixture_require_adjudication") throw new Error("wrong unresolved candidate type");
    expect(pending.candidateDays).toHaveLength(3);
    expect(pending.candidateDays[1]).toMatchObject({ civilDate: "2026-12-23", tithiAtSunrise: { index: 14, name: "Chaturdashi" }, tithiAtMoonrise: { index: 15, name: "Purnima" } });
    expect(pending.candidateDays[2]).toMatchObject({ civilDate: "2026-12-24", tithiAtSunrise: { index: 16, name: "Pratipada" } });
    expect(pending.evidence.modernReference).toMatchObject({ responseBytes: 102831, responseSha256: "bdda6985a696f51edc5663ceccc91fc8ac3f8091b94df0d41444da7aa5171b3b" });
  });

  it("resolves all four launch-window Masika Shivaratri dates from separate pradosha and nishita evidence", () => {
    const fixtures = [
      ["2026-09-09", "masika-shivaratri-2026-09"],
      ["2026-10-08", "masika-shivaratri-2026-10"],
      ["2026-11-07", "masika-shivaratri-2026-11"],
      ["2026-12-07", "masika-shivaratri-2026-12"],
    ];
    for (const [civilDate, observanceSlug] of fixtures) {
      const result = resolveBoundedObservances({ ...delhiRequest, civilDate });
      const rule = ruleFor(result, observanceSlug);
      expect(rule).toMatchObject({
        canonicalName: "Masika Shivaratri",
        selectedCivilDate: civilDate,
        appliesToRequestedDate: true,
        targetTithi: { index: 29, name: "Chaturdashi", paksha: "krishna" },
        precedence: { kind: "masika_shivaratri_pradosha_nishita_matrix_fail_closed" },
        evidence: {
          pdfPages: [239, 240, 241, 242],
          sourceTextReturnedByApi: false,
          modernReference: { semanticFixtureSha256: "f686ae462f8d90d81ec6b8cfa801bc399d3677ec28e660ef8b17748eb02f125c" },
        },
        boundaries: { modernPracticeResolved: false, ritualGuidanceIncluded: false, universalTraditionClaim: false },
      });
      expect(rule.candidateDays).toHaveLength(2);
      for (const candidate of rule.candidateDays) {
        expect(candidate.decisionWindow.kind).toBe("nishita");
        expect(candidate.diagnosticWindows).toBeDefined();
        expect(candidate.diagnosticWindows?.night.window.kind).toBe("night");
        expect(candidate.diagnosticWindows?.pradosha.window.kind).toBe("pradosha");
        expect(candidate.diagnosticWindows?.nishita.window.kind).toBe("nishita");
        expect(Date.parse(candidate.diagnosticWindows!.night.window.endUtc)).toBeGreaterThan(Date.parse(candidate.diagnosticWindows!.night.window.startUtc));
        expect((Date.parse(candidate.diagnosticWindows!.nishita.window.endUtc) - Date.parse(candidate.diagnosticWindows!.nishita.window.startUtc)) / 1000).toBe(48 * 60);
      }
      const selected = rule.candidateDays.find((candidate) => candidate.civilDate === civilDate)!;
      expect(selected.diagnosticWindows!.nishita.targetTithiOverlapSeconds).toBeGreaterThan(0);
    }
  });

  it("resolves all eight Delhi launch-window Pradosha dates only from a unique Trayodashi overlap", () => {
    const fixtures = [
      ["2026-09-08", "pradosha-2026-09-krishna", 28, "krishna", "Bhauma Pradosha Vrat"],
      ["2026-09-24", "pradosha-2026-09-shukla", 13, "shukla", "Guru Pradosha Vrat"],
      ["2026-10-08", "pradosha-2026-10-krishna", 28, "krishna", "Guru Pradosha Vrat"],
      ["2026-10-23", "pradosha-2026-10-shukla", 13, "shukla", "Shukra Pradosha Vrat"],
      ["2026-11-06", "pradosha-2026-11-krishna", 28, "krishna", "Shukra Pradosha Vrat"],
      ["2026-11-22", "pradosha-2026-11-shukla", 13, "shukla", "Ravi Pradosha Vrat"],
      ["2026-12-06", "pradosha-2026-12-krishna", 28, "krishna", "Ravi Pradosha Vrat"],
      ["2026-12-21", "pradosha-2026-12-shukla", 13, "shukla", "Soma Pradosha Vrat"],
    ] as const;
    for (const [civilDate, observanceSlug, index, paksha, canonicalName] of fixtures) {
      const result = resolveBoundedObservances({ ...delhiRequest, civilDate });
      const rule = ruleFor(result, observanceSlug);
      expect(rule).toMatchObject({
        canonicalName,
        selectedCivilDate: civilDate,
        appliesToRequestedDate: true,
        targetTithi: { index, name: "Trayodashi", paksha },
        precedence: { kind: "unique_trayodashi_overlap_with_bounded_pradosha_window_otherwise_fail_closed" },
        evidence: {
          pdfPages: [37, 38, 48],
          evidenceStatus: "historical_general_naktavrata_context_plus_current_practitioner_rule_and_location_fixture",
          rightsLane: "private_evidence",
          sourceTextReturnedByApi: false,
          modernReference: {
            referenceLocation: "Delhi, India",
            observedCivilDate: civilDate,
            observationRole: "current_practitioner_rule_and_location_specific_date_fixture",
            semanticFixtureSha256: "ecda097f1233723c1e03f49149e12fb48670e88279ea04e49329aa8f931166c0",
            responseBytes: 126821,
            responseSha256: "94ab318ba1acfb84daa160fb161062420985fc07919c7a76de61b7ad439a9ac1",
          },
        },
        boundaries: { modernPracticeResolved: false, ritualGuidanceIncluded: false, universalTraditionClaim: false },
      });
      expect(rule.evidence.sourceScopeNote).toContain("does not prove the fortnightly observance-specific selection rule");
      expect(rule.candidateDays).toHaveLength(2);
      expect(rule.candidateDays.filter((candidate) => candidate.targetTithiOverlapSeconds > 0)).toHaveLength(1);
      for (const candidate of rule.candidateDays) {
        expect(candidate.decisionWindow.kind).toBe("pradosha");
        expect((Date.parse(candidate.decisionWindow.endUtc) - Date.parse(candidate.decisionWindow.startUtc)) / 1000).toBe(144 * 60);
      }
    }
  });

  it("recalculates Pradosha windows for the requested location instead of copying Delhi timings", () => {
    const delhi = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-12-21" });
    const delhiRule = ruleFor(delhi, "pradosha-2026-12-shukla");
    expect(delhiRule).toMatchObject({ selectedCivilDate: "2026-12-21", appliesToRequestedDate: true });
    const kolkata = resolveBoundedObservances({
      civilDate: "2026-12-21",
      latitude: 22.5726,
      longitude: 88.3639,
      timezone: "Asia/Kolkata",
      traditionCode: "smarta-north-india",
    });
    const kolkataRule = ruleFor(kolkata, "pradosha-2026-12-shukla");
    expect(kolkataRule).toMatchObject({ selectedCivilDate: "2026-12-21", appliesToRequestedDate: true });
    expect(kolkataRule.candidateDays[0].decisionWindow.startUtc).not.toBe(delhiRule.candidateDays[0].decisionWindow.startUtc);
    expect(kolkataRule.candidateDays[0].targetTithiOverlapSeconds).not.toBe(delhiRule.candidateDays[0].targetTithiOverlapSeconds);
  });

  it("reports the non-selected Ganesh Chaturthi candidate without pretending it is the observance date", () => {
    const result = resolveBoundedObservances({ ...mumbaiRequest, civilDate: "2026-09-15" });
    expect(ruleFor(result, "ganesh-chaturthi")).toMatchObject({ selectedCivilDate: "2026-09-14", appliesToRequestedDate: false });
  });

  it("resolves Ananta Chaturdashi by the source-specific madhyahna rule without merging its ritual identity into Ganesh Visarjan", () => {
    const result = resolveBoundedObservances({ ...mumbaiRequest, civilDate: "2026-09-25" });
    const rule = ruleFor(result, "ananta-chaturdashi");
    expect(rule).toMatchObject({
      canonicalName: "Ananta Chaturdashi",
      selectedCivilDate: "2026-09-25",
      appliesToRequestedDate: true,
      targetTithi: { index: 14, name: "Chaturdashi", paksha: "shukla" },
      precedence: { kind: "greater_madhyahna_chaturdashi_coverage_earlier_tie" },
      evidence: {
        pdfPages: [159],
        sourceTextReturnedByApi: false,
        modernReference: {
          referenceLocation: "Mumbai, India",
          observedCivilDate: "2026-09-25",
          responseBytes: 69549,
          responseSha256: "2e438afe3667e8347b1ec58b585fa48fb72c77ba26e5caad4164a38653d4ac7e",
        },
      },
      boundaries: { modernPracticeResolved: false, ritualGuidanceIncluded: false, universalTraditionClaim: false },
    });
    expect(rule.candidateDays.map((day) => [day.civilDate, day.decisionWindow.kind, day.targetTithiOverlapSeconds > 0])).toEqual([
      ["2026-09-25", "madhyahna", true],
      ["2026-09-26", "madhyahna", false],
    ]);
    expect(rule.precedence.explanation).toContain("remain distinct ritual identities");
  });

  it("selects the Shardiya Navaratri opening by Pratipada at sunrise", () => {
    const result = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-10-11" });
    const rule = ruleFor(result, "shardiya-navaratri-begins");
    expect(rule).toMatchObject({ observanceSlug: "shardiya-navaratri-begins", selectedCivilDate: "2026-10-11", targetTithi: { index: 1, name: "Pratipada", paksha: "shukla" } });
    expect(rule.candidateDays.map((day) => [day.civilDate, day.decisionWindow.kind, day.targetTithiOverlapSeconds])).toEqual([
      ["2026-10-10", "sunrise_presence", 0],
      ["2026-10-11", "sunrise_presence", 60],
    ]);
  });

  it("selects Vijayadashami by greater Dashami coverage in aparahna and leaves the Bengal lane unresolved", () => {
    const north = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-10-20" });
    const vijayadashami = ruleFor(north, "vijayadashami");
    expect(vijayadashami).toMatchObject({ observanceSlug: "vijayadashami", selectedCivilDate: "2026-10-20" });
    expect(vijayadashami.candidateDays[0].targetTithiOverlapSeconds).toBeGreaterThan(vijayadashami.candidateDays[1].targetTithiOverlapSeconds);
    const east = resolveBoundedObservances({ civilDate: "2026-10-21", latitude: 22.5726, longitude: 88.3639, timezone: "Asia/Kolkata", traditionCode: "smarta-east-india" });
    expect(east).toMatchObject({ status: "no_supported_rule_for_context", matchedRules: [] });
  });

  it("selects Karwa Chauth by Krishna Chaturthi at local moonrise", () => {
    const result = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-10-29" });
    const rule = ruleFor(result, "karwa-chauth");
    expect(rule).toMatchObject({ selectedCivilDate: "2026-10-29", appliesToRequestedDate: true, targetTithi: { index: 19, name: "Chaturthi", paksha: "krishna" } });
    expect(rule.candidateDays.map((day) => [day.civilDate, day.decisionWindow.kind, day.targetTithiOverlapSeconds])).toEqual([
      ["2026-10-28", "moonrise_presence", 0],
      ["2026-10-29", "moonrise_presence", 60],
    ]);
    expectWithinMoonrise(rule.candidateDays[1].decisionWindow.startUtc, "2026-10-29T14:47:00.000Z", 7);
    expect(rule.evidence).toMatchObject({ pdfPages: [213], citationArtifactSha256: "c04a1d84ce766c312bb7e40c60025ceb01eb5cb5da7a3f6ccdb03e293ab53591", rightsLane: "reference_only", sourceTextReturnedByApi: false, modernReference: { responseBytes: 69852, responseSha256: "7582d6071c0f630231b4adadc38dd7ceb8ff3911b2b186d622f35ce495431a68" } });
    expect(rule.evidence.sourceScopeNote).toContain("does not serve provider muhurta");
    expect(ruleFor(result, "sankashti-chaturthi-2026-10").selectedCivilDate).toBe("2026-10-29");
  });

  it("resolves the bounded North India Ahoi Ashtami evening without prescribing a fast or universal family procedure", () => {
    const request = { ...delhiRequest, civilDate: "2026-11-01" } as const;
    const result = resolveBoundedObservances(request);
    const rule = ruleFor(result, "ahoi-ashtami-north-india");
    expect(rule).toMatchObject({ canonicalName: "Ahoi Ashtami / Ahoi Aathe", selectedCivilDate: "2026-11-01", appliesToRequestedDate: true, precedence: { kind: "unique_kartika_krishna_ashtami_overlap_with_local_pradosha_fail_closed" }, evidence: { citationArtifactSha256: "f35053c40b788f82da8264ae8d7675e706ea5152b925f6ee86fd6c87d9a3831c", evidenceStatus: "current_practitioner_rule_and_location_fixture_plus_historical_adjacent_context", rightsLane: "reference_only" } });
    expect(rule.candidateDays.filter((day) => day.targetTithiOverlapSeconds > 0).map((day) => day.civilDate)).toEqual(["2026-11-01"]);
    expect(rule.evidence.sourceScopeNote).toContain("does not serve the provider's muhurta, prescribe fasting");
    expect(resolveBoundedObservances({ ...request, traditionCode: "smarta-west-india" }).matchedRules.some((candidate) => candidate.observanceSlug === "ahoi-ashtami-north-india")).toBe(false);
  });

  it("keeps general Tulasi Vivah and the BAPS beginning and close as three separate bounded rules", () => {
    const generalResult = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-11-21" });
    const general = ruleFor(generalResult, "tulasi-vivah-dwadashi");
    expect(general).toMatchObject({ canonicalName: "Tulasi Vivah", selectedCivilDate: "2026-11-21", appliesToRequestedDate: true, precedence: { kind: "unique_kartika_shukla_dwadashi_overlap_with_local_pradosha_fail_closed" }, evidence: { citationArtifactSha256: "fa33540adba85a7e4e79b454d98c80677c0b7c92b0e557a26ea6168b7f038257", rightsLane: "reference_only" } });
    expect(general.candidateDays.filter((day) => day.targetTithiOverlapSeconds > 0).map((day) => day.civilDate)).toEqual(["2026-11-21"]);
    expect(resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-11-21", traditionCode: "swaminarayan-baps" }).matchedRules.filter((rule) => rule.appliesToRequestedDate).map((rule) => rule.observanceSlug)).toContain("tulsi-vivah-baps-begins");
    expect(resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-11-24", traditionCode: "swaminarayan-baps" }).matchedRules.filter((rule) => rule.appliesToRequestedDate).map((rule) => rule.observanceSlug)).toContain("tulsi-vivah-baps-samapt");
    expect(resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-11-21", traditionCode: "swaminarayan-baps" }).matchedRules.some((rule) => rule.observanceSlug === "tulasi-vivah-dwadashi")).toBe(false);
  });

  it("keeps Govatsa Dwadashi, Dhantrayodashi, and Yama Deepam as distinct pradosha rules", () => {
    const govatsaResult = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-11-05" });
    const govatsa = ruleFor(govatsaResult, "govatsa-dwadashi");
    expect(govatsa).toMatchObject({
      canonicalName: "Govatsa Dwadashi / Vasu Baras",
      selectedCivilDate: "2026-11-05",
      appliesToRequestedDate: true,
      targetTithi: { index: 27, name: "Dvadashi", paksha: "krishna" },
    });
    expect(govatsa.candidateDays[1].decisionWindow.kind).toBe("pradosha");
    expect(govatsa.precedence.explanation).toContain("separate Maharashtra no-contact family guide");
    expect(govatsa.evidence).toMatchObject({ pdfPages: [213], sourceTextReturnedByApi: false });

    const yamaResult = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-11-06" });
    const dhantrayodashi = ruleFor(yamaResult, "dhantrayodashi");
    const yama = ruleFor(yamaResult, "yama-deepam");
    expect(dhantrayodashi).toMatchObject({
      canonicalName: "Dhantrayodashi / Dhanteras",
      selectedCivilDate: "2026-11-06",
      appliesToRequestedDate: true,
      targetTithi: { index: 28, name: "Trayodashi", paksha: "krishna" },
      precedence: { kind: "unique_pradosha_trayodashi_overlap_fail_closed" },
      evidence: {
        pdfPages: [213],
        evidenceStatus: "current_practitioner_rule_and_location_fixture_plus_historical_adjacent_context",
        modernReference: {
          observedCivilDate: "2026-11-06",
          semanticFixtureSha256: "c88547ab6e858c28ed6b60f209ff26ca1194d1e6820e3c5c6fce958b72d7347a",
          responseBytes: 81810,
          responseSha256: "121255bba72fc486def14da6042e5dfb94556cac9b8b8ff92b489e36573e9471",
        },
      },
    });
    expect(dhantrayodashi.precedence.explanation).toContain("not the provider's narrower puja muhurta");
    expect(dhantrayodashi.evidence.sourceScopeNote).toContain("not Dhanteras identity or Sthir-Lagna authority");
    expect(dhantrayodashi.boundaries).toMatchObject({ modernPracticeResolved: false, ritualGuidanceIncluded: false, universalTraditionClaim: false });
    expect(yama).toMatchObject({
      canonicalName: "Yama Deepam / Yama Deepa Dana",
      selectedCivilDate: "2026-11-06",
      appliesToRequestedDate: true,
      targetTithi: { index: 28, name: "Trayodashi", paksha: "krishna" },
    });
    expect(yama.precedence.explanation).toContain("not treated as proof of a complete Dhanteras ritual lane");
    expect(yama.boundaries.ritualGuidanceIncluded).toBe(false);
    expect(yamaResult.matchedRules.filter((rule) => rule.appliesToRequestedDate).map((rule) => rule.observanceSlug)).toEqual([
      "pradosha-2026-11-krishna",
      "dhantrayodashi",
      "yama-deepam",
    ]);
    expect(dhantrayodashi.ruleId).not.toBe(yama.ruleId);
    expect(resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-11-06", traditionCode: "smarta-south-india" }).matchedRules).toEqual([]);
  });

  it("selects Diwali Lakshmi Puja on the Amavasya pradosha evening without claiming a muhurta", () => {
    const result = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-11-08" });
    const rule = ruleFor(result, "diwali-lakshmi-puja");
    expect(rule).toMatchObject({ observanceSlug: "diwali-lakshmi-puja", selectedCivilDate: "2026-11-08", targetTithi: { index: 30, name: "Amavasya" } });
    expect(rule.candidateDays[0].decisionWindow.kind).toBe("pradosha");
    expect(rule.candidateDays[0].targetTithiOverlapSeconds).toBe(144 * 60);
    expect(rule.candidateDays[1].targetTithiOverlapSeconds).toBe(0);
    expect(rule.boundaries.ritualGuidanceIncluded).toBe(false);
    expect(rule.precedence.explanation).toContain("does not calculate a puja muhurta");
  });

  it("keeps coincident Naraka Chaturdashi and Lakshmi Puja as separate rules", () => {
    const result = resolveBoundedObservances({ ...mumbaiRequest, civilDate: "2026-11-08" });
    const naraka = ruleFor(result, "naraka-chaturdashi");
    const lakshmi = ruleFor(result, "diwali-lakshmi-puja");
    expect(naraka).toMatchObject({
      canonicalName: "Naraka Chaturdashi / Abhyanga Snan",
      selectedCivilDate: "2026-11-08",
      targetTithi: { index: 29, name: "Chaturdashi" },
      precedence: { kind: "unique_full_kartika_krishna_chaturdashi_overlap_with_local_moonrise_to_sunrise_fail_closed" },
      evidence: { modernReference: { referenceLocation: "Mumbai, Maharashtra, India", semanticFixtureSha256: "adf5c3d43e6f2fb19ef3ecc75fc92d2cfc671105c2eed87edda11872d34a33a5" } },
    });
    expect(naraka.candidateDays.map((day) => [day.civilDate, day.decisionWindow.kind, day.targetTithiOverlapSeconds])).toEqual([
      ["2026-11-07", "moonrise_to_sunrise", 0],
      ["2026-11-08", "moonrise_to_sunrise", 3662],
    ]);
    expectWithinMoonrise(naraka.candidateDays[1].decisionWindow.startUtc, "2026-11-08T00:15:00.000Z", 7);
    expect(naraka.precedence.explanation).toContain("Kali Chaudas and Tamil Deepavali remain separate records");
    expect(lakshmi.targetTithi).toMatchObject({ index: 30, name: "Amavasya" });
    expect(result.matchedRules.filter((rule) => rule.appliesToRequestedDate)).toHaveLength(2);
    expect(ruleFor(result, "kartika-amavasya")).toMatchObject({ selectedCivilDate: "2026-11-09", appliesToRequestedDate: false });
    expect(resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-11-08" }).matchedRules.some((rule) => rule.observanceSlug === "naraka-chaturdashi")).toBe(false);
  });

  it("resolves BAPS Kali Chaudash on November 7 by full Chaturdashi coverage at Ahmedabad Nishita", () => {
    const result = resolveBoundedObservances({ civilDate: "2026-11-07", latitude: 23.0225, longitude: 72.5714, timezone: "Asia/Kolkata", traditionCode: "swaminarayan-baps" });
    const rule = ruleFor(result, "kali-chaudas-baps");
    expect(rule).toMatchObject({ canonicalName: "Kali Chaudash / Hanuman Puja", selectedCivilDate: "2026-11-07", appliesToRequestedDate: true, precedence: { kind: "unique_full_krishna_chaturdashi_overlap_with_local_nishita_fail_closed" }, evidence: { work: "BAPS Nirnay 2026, BAPS Festival List 2026, and Ahmedabad Gujarati Calendar", internetArchiveIdentifier: null, citationImageSha256: null, citationArtifactSha256: "31e02af522ad6de07346e27330c6a6709b3f20eb93f12f14885ac6b53c4ba769", rightsLane: "reference_only", modernReference: { provider: "BAPS Swaminarayan Sanstha", referenceLocation: "Ahmedabad, Gujarat, India", semanticFixtureSha256: "31e02af522ad6de07346e27330c6a6709b3f20eb93f12f14885ac6b53c4ba769" } } });
    expect(rule.candidateDays.map((day) => [day.civilDate, day.decisionWindow.kind, day.targetTithiOverlapSeconds])).toEqual([["2026-11-07", "nishita", 3080], ["2026-11-08", "nishita", 0]]);
    expect(rule.precedence.explanation).toContain("supplies no Hanuman puja or protection procedure");
    expect(result.matchedRules.filter((candidate) => candidate.appliesToRequestedDate).map((candidate) => candidate.observanceSlug)).toEqual(["kali-chaudas-baps"]);
    expect(resolveBoundedObservances({ civilDate: "2026-11-07", latitude: 23.0225, longitude: 72.5714, timezone: "Asia/Kolkata", traditionCode: "smarta-west-india" }).matchedRules.some((candidate) => candidate.observanceSlug === "kali-chaudas-baps")).toBe(false);
  });

  it("resolves BAPS Gujarati New Year on November 10 at Ahmedabad without merging the other Pratipada lanes", () => {
    const result = resolveBoundedObservances({ civilDate: "2026-11-10", latitude: 23.0225, longitude: 72.5714, timezone: "Asia/Kolkata", traditionCode: "swaminarayan-baps" });
    const rule = ruleFor(result, "gujarati-new-year-baps");
    expect(rule).toMatchObject({
      canonicalName: "Gujarati New Year / Bestu Varash / Annakut",
      selectedCivilDate: "2026-11-10",
      appliesToRequestedDate: true,
      precedence: { kind: "kartika_shukla_pratipada_present_at_local_sunrise_for_exact_baps_context" },
      evidence: {
        work: "BAPS November Calendar 2026, BAPS Festival List 2026, BAPS Nutan Varsh/New Year Annakut, and Akashvani Gujarati New Year context",
        internetArchiveIdentifier: null,
        citationImageSha256: null,
        citationArtifactSha256: "afa7230ef7879b18a6dac1653e416db978946cc0c03c40ba7f0cefc0f54603f5",
        pdfPages: [],
        evidenceStatus: "current_sampradaya_rule_and_official_public_context",
        rightsLane: "reference_only",
        modernReference: {
          provider: "BAPS Swaminarayan Sanstha",
          referenceLocation: "Ahmedabad, Gujarat, India",
          observedCivilDate: "2026-11-10",
          semanticFixtureSha256: "afa7230ef7879b18a6dac1653e416db978946cc0c03c40ba7f0cefc0f54603f5",
        },
      },
    });
    expect(result.matchedRules.filter((candidate) => candidate.appliesToRequestedDate).map((candidate) => candidate.observanceSlug)).toEqual(["gujarati-new-year-baps"]);
    expect(resolveBoundedObservances({ civilDate: "2026-11-10", latitude: 23.0225, longitude: 72.5714, timezone: "Asia/Kolkata", traditionCode: "smarta-west-india" }).matchedRules.some((candidate) => candidate.observanceSlug === "gujarati-new-year-baps")).toBe(false);
  });

  it("resolves Karnataka Balipadyami on November 10 at Bengaluru as a separate South India lane", () => {
    const result = resolveBoundedObservances({ civilDate: "2026-11-10", latitude: 12.9716, longitude: 77.5946, timezone: "Asia/Kolkata", traditionCode: "smarta-south-india" });
    const rule = ruleFor(result, "karnataka-balipadyami");
    expect(rule).toMatchObject({ canonicalName: "Bali Padyami / Balipadyami", selectedCivilDate: "2026-11-10", appliesToRequestedDate: true, precedence: { kind: "kartika_shukla_pratipada_present_at_local_sunrise_for_bounded_karnataka_context" }, evidence: { internetArchiveIdentifier: null, citationImageSha256: null, citationArtifactSha256: "2378195e40a1cd93e0a0f700e1903ecf8bedea665a711b95eaa9a27fcdb09fcc", pdfPages: [], evidenceStatus: "official_regional_date_and_context_fixture", rightsLane: "reference_only", modernReference: { provider: "ISKCON Bangalore", referenceLocation: "Bengaluru, Karnataka, India", observedCivilDate: "2026-11-10", semanticFixtureSha256: "2378195e40a1cd93e0a0f700e1903ecf8bedea665a711b95eaa9a27fcdb09fcc" } } });
    expect(result.matchedRules.filter((candidate) => candidate.appliesToRequestedDate).map((candidate) => candidate.observanceSlug)).toEqual(["karnataka-balipadyami"]);
    expect(resolveBoundedObservances({ civilDate: "2026-11-10", latitude: 12.9716, longitude: 77.5946, timezone: "Asia/Kolkata", traditionCode: "smarta-west-india" }).matchedRules.some((candidate) => candidate.observanceSlug === "karnataka-balipadyami")).toBe(false);
  });

  it("resolves Karnataka Saraswati/Ayudha Puja on the official Mahanavami date only at Bengaluru", () => {
    const request = { civilDate: "2026-10-20", latitude: 12.9716, longitude: 77.5946, timezone: "Asia/Kolkata", traditionCode: "smarta-south-india" } as const;
    const result = resolveBoundedObservances(request);
    const rule = ruleFor(result, "karnataka-saraswati-ayudha-puja");
    expect(rule).toMatchObject({
      canonicalName: "Karnataka Saraswati Puja / Ayudha Puja",
      selectedCivilDate: "2026-10-20",
      appliesToRequestedDate: true,
      targetTithi: { index: 9, name: "Navami", paksha: "shukla" },
      precedence: { kind: "official_karnataka_mahanavami_date_with_unique_local_sunrise_navami_overlap" },
      evidence: {
        internetArchiveIdentifier: null,
        citationImageSha256: null,
        citationArtifactSha256: "c2a6bc7cfe0fa0f12fa12af694cd2f4918fa63892ebd0f614eb04811219df26b",
        evidenceStatus: "official_regional_date_and_context_fixture",
        rightsLane: "reference_only",
        modernReference: { provider: "CGST Karnataka", referenceLocation: "Bengaluru, Karnataka, India", observedCivilDate: "2026-10-20", semanticFixtureSha256: "c2a6bc7cfe0fa0f12fa12af694cd2f4918fa63892ebd0f614eb04811219df26b" },
      },
    });
    expect(rule.candidateDays.filter((day) => day.targetTithiOverlapSeconds > 0)).toHaveLength(1);
    expect(resolveBoundedObservances({ ...request, latitude: 13.0827, longitude: 80.2707 }).matchedRules.some((candidate) => candidate.observanceSlug === "karnataka-saraswati-ayudha-puja")).toBe(false);
    expect(resolveBoundedObservances({ ...request, traditionCode: "smarta-north-india" }).matchedRules.some((candidate) => candidate.observanceSlug === "karnataka-saraswati-ayudha-puja")).toBe(false);
  });

  it("resolves the umbrella Jain Diwali evening on November 8 without flattening community variants", () => {
    const request = { civilDate: "2026-11-08", latitude: 28.6139, longitude: 77.209, timezone: "Asia/Kolkata", traditionCode: "jain-umbrella" } as const;
    const result = resolveBoundedObservances(request);
    const rule = ruleFor(result, "jain-diwali-umbrella");
    expect(rule).toMatchObject({
      canonicalName: "Jain Diwali / Mahavira's Liberation",
      selectedCivilDate: "2026-11-08",
      appliesToRequestedDate: true,
      precedence: { kind: "greater_pradosha_amavasya_coverage_for_umbrella_jain_diwali_evening" },
      evidence: {
        internetArchiveIdentifier: null,
        citationImageSha256: null,
        citationArtifactSha256: "1b72b1eb9710d35e90618e02e840e4cb6129e0aa726df667fa637e42e62f117d",
        pdfPages: [],
        evidenceStatus: "official_jain_umbrella_and_community_variant_fixture",
        rightsLane: "reference_only",
        modernReference: {
          provider: "Jain Center of New Jersey",
          referenceLocation: "Delhi, India",
          observedCivilDate: "2026-11-08",
          semanticFixtureSha256: "1b72b1eb9710d35e90618e02e840e4cb6129e0aa726df667fa637e42e62f117d",
          responseBytes: 40278,
          responseSha256: "e14f78cff1de994c6a619dae89532413bb3eea706eee0d942ca8bdfe8b068135",
        },
      },
    });
    expect(rule.evidence.sourceScopeNote).toContain("November 9");
    expect(rule.evidence.sourceScopeNote).toContain("November 10");
    expect(result.matchedRules.filter((candidate) => candidate.appliesToRequestedDate).map((candidate) => candidate.observanceSlug)).toEqual(["jain-diwali-umbrella"]);
    expect(resolveBoundedObservances({ ...request, traditionCode: "smarta-north-india" }).matchedRules.some((candidate) => candidate.observanceSlug === "jain-diwali-umbrella")).toBe(false);
  });

  it("resolves Bandi Chhor Divas from the official SGPC calendar without deriving Sikh authority from tithi", () => {
    const request = { civilDate: "2026-11-08", latitude: 31.634, longitude: 74.8723, timezone: "Asia/Kolkata", traditionCode: "sikh-sgpc" } as const;
    const result = resolveBoundedObservances(request);
    const rule = ruleFor(result, "bandi-chhor-divas-sgpc");
    expect(rule).toMatchObject({ canonicalName: "Bandi Chhor Divas", selectedCivilDate: "2026-11-08", appliesToRequestedDate: true, precedence: { kind: "official_sgpc_nanakshahi_calendar_23_kattak_maps_to_2026_11_08" }, evidence: { internetArchiveIdentifier: null, citationImageSha256: null, citationArtifactSha256: "01536637248ca6fe97b426ffc1bc6e42f7e33e611c0d461e59f40a46b6573a7b", pdfPages: [], evidenceStatus: "official_sgpc_calendar_and_sikh_history_fixture", rightsLane: "reference_only", modernReference: { provider: "Shiromani Gurdwara Parbandhak Committee", referenceLocation: "Amritsar, Punjab, India", observedCivilDate: "2026-11-08", semanticFixtureSha256: "01536637248ca6fe97b426ffc1bc6e42f7e33e611c0d461e59f40a46b6573a7b", responseBytes: 14760383, responseSha256: "ad9ff9ad7f558a585003095aa6ee383b8cf03374b53e2abde5cea7be7d7929d5" } } });
    expect(rule.precedence.explanation).toContain("contextual astronomical metadata only");
    expect(result.matchedRules.filter((candidate) => candidate.appliesToRequestedDate).map((candidate) => candidate.observanceSlug)).toEqual(["bandi-chhor-divas-sgpc"]);
    expect(resolveBoundedObservances({ ...request, traditionCode: "smarta-north-india" }).matchedRules.some((candidate) => candidate.observanceSlug === "bandi-chhor-divas-sgpc")).toBe(false);
  });

  it("resolves Tamil Deepavali in the South India lane by Chaturdashi during local Brahma Muhurta", () => {
    const result = resolveBoundedObservances({
      civilDate: "2026-11-08",
      latitude: 13.0827,
      longitude: 80.2707,
      timezone: "Asia/Kolkata",
      traditionCode: "smarta-south-india",
    });
    const tamilDeepavali = ruleFor(result, "tamil-deepavali-naraka-chaturdashi");
    expect(result.status).toBe("resolved_supported_subset");
    expect(tamilDeepavali).toMatchObject({
      canonicalName: "Tamil Deepavali / Naraka Chaturdashi",
      selectedCivilDate: "2026-11-08",
      appliesToRequestedDate: true,
      targetTithi: { index: 29, name: "Chaturdashi", paksha: "krishna" },
      precedence: { kind: "unique_kartika_krishna_chaturdashi_overlap_with_local_brahma_muhurta_fail_closed" },
      evidence: {
        pdfPages: [214, 215],
        evidenceStatus: "current_practitioner_rule_and_official_regional_calendar_plus_historical_adjacent_context",
        modernReference: {
          referenceLocation: "Chennai, Tamil Nadu, India",
          observedCivilDate: "2026-11-08",
          semanticFixtureSha256: "97319c8fc4f1e6bb157c7540f6bcfc3379c0bccabdabb22b57493e085feac7de",
          responseBytes: 81500,
          responseSha256: "c6b5c90589e9ac0c0be44044ffd93b35f69e8a5865bd42974d3bfb42e5816b53",
        },
      },
      boundaries: { modernPracticeResolved: false, ritualGuidanceIncluded: false, universalTraditionClaim: false },
    });
    expect(tamilDeepavali.candidateDays.map((day) => [day.civilDate, day.decisionWindow.kind, day.targetTithiOverlapSeconds > 0])).toEqual([
      ["2026-11-07", "brahma_muhurta", false],
      ["2026-11-08", "brahma_muhurta", true],
    ]);
    expect(tamilDeepavali.precedence.explanation).toContain("does not copy the provider's narrower pre-sunrise muhurta");
    expect(tamilDeepavali.evidence.sourceScopeNote).toContain("No oil-bath");
    expect(result.matchedRules.filter((rule) => rule.appliesToRequestedDate).map((rule) => rule.observanceSlug)).toEqual(["tamil-deepavali-naraka-chaturdashi"]);
    expect(result.matchedRules.some((rule) => rule.observanceSlug === "diwali-lakshmi-puja")).toBe(false);
    expect(resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-11-08" }).matchedRules.some((rule) => rule.observanceSlug === "tamil-deepavali-naraka-chaturdashi")).toBe(false);
  });

  it("resolves Bengal Kali Puja at Amavasya-bearing Nishita without merging the North/West Lakshmi Puja lane", () => {
    const result = resolveBoundedObservances({
      civilDate: "2026-11-08",
      latitude: 22.5726,
      longitude: 88.3639,
      timezone: "Asia/Kolkata",
      traditionCode: "shakta-bengal",
    });
    const kaliPuja = ruleFor(result, "bengal-kali-puja");
    expect(result.status).toBe("resolved_supported_subset");
    expect(kaliPuja).toMatchObject({
      canonicalName: "Kali Puja / Shyama Puja",
      selectedCivilDate: "2026-11-08",
      appliesToRequestedDate: true,
      targetTithi: { index: 30, name: "Amavasya", paksha: "krishna" },
      precedence: { kind: "unique_kartika_amavasya_overlap_with_local_nishita_fail_closed" },
      evidence: {
        pdfPages: [216, 217],
        evidenceStatus: "current_practitioner_rule_and_official_regional_calendar_plus_historical_adjacent_context",
        modernReference: {
          observedCivilDate: "2026-11-08",
          semanticFixtureSha256: "faa675ee7ece5ed1513f75b49fef6db2ab0f9b0ea324f58a40990864c46c165c",
          responseBytes: 78534,
          responseSha256: "f1bc47ed5e1948244babe7f8d86e82f0acf4a6353c44dc3368564f758ff44775",
        },
      },
      boundaries: { modernPracticeResolved: false, ritualGuidanceIncluded: false, universalTraditionClaim: false },
    });
    expect(kaliPuja.candidateDays.map((day) => [day.civilDate, day.decisionWindow.kind, day.targetTithiOverlapSeconds > 0])).toEqual([
      ["2026-11-08", "nishita", true],
      ["2026-11-09", "nishita", false],
    ]);
    expect(kaliPuja.precedence.explanation).toContain("not a Kali Puja procedure");
    expect(kaliPuja.evidence.sourceScopeNote).toContain("historical pages are adjacent Kartika Amavasya/Diwali context");
    expect(result.matchedRules.filter((rule) => rule.appliesToRequestedDate).map((rule) => rule.observanceSlug)).toEqual(["bengal-kali-puja"]);
    expect(result.matchedRules.some((rule) => rule.observanceSlug === "diwali-lakshmi-puja")).toBe(false);
    expect(resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-11-08" }).matchedRules.some((rule) => rule.observanceSlug === "bengal-kali-puja")).toBe(false);
  });

  it("keeps Bali Pratipada and Govardhan Puja distinct when both apply", () => {
    const result = resolveBoundedObservances({ ...mumbaiRequest, civilDate: "2026-11-10" });
    const applyingRules = result.matchedRules.filter((rule) => rule.appliesToRequestedDate);
    expect(applyingRules.map((rule) => rule.observanceSlug)).toEqual(["bali-pratipada", "govardhan-puja"]);
    for (const rule of applyingRules) {
      if (!("candidateDays" in rule)) throw new Error("unexpected solar rule in the Bali/Govardhan fixture");
      expect(rule).toMatchObject({ selectedCivilDate: "2026-11-10", targetTithi: { index: 1, name: "Pratipada" } });
    }
    expect(ruleFor(result, "bali-pratipada")).toMatchObject({ evidence: { sourceTextReturnedByApi: false } });
    expect(ruleFor(result, "bali-pratipada").precedence.explanation).toContain("separate Maharashtra family-participation guide");
    expect(ruleFor(result, "bhai-dooj")).toMatchObject({ selectedCivilDate: "2026-11-11", appliesToRequestedDate: false });
  });

  it("resolves the same Govardhan date independently for the exact ISKCON lane without importing Bali Pratipada", () => {
    const result = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-11-10", traditionCode: "vaishnava-iskcon" });
    const applying = result.matchedRules.filter((rule) => rule.appliesToRequestedDate);
    expect(applying.map((rule) => rule.observanceSlug)).toEqual(["govardhan-puja"]);
    expect(ruleFor(result, "govardhan-puja")).toMatchObject({ selectedCivilDate: "2026-11-10", targetTithi: { index: 1, name: "Pratipada" } });
  });

  it("selects Bhai Dooj by greater Shukla Dvitiya coverage in aparahna", () => {
    const result = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-11-11" });
    const rule = ruleFor(result, "bhai-dooj");
    expect(rule).toMatchObject({ observanceSlug: "bhai-dooj", selectedCivilDate: "2026-11-11", targetTithi: { index: 2, name: "Dvitiya" } });
    expect(rule.candidateDays[1].targetTithiOverlapSeconds).toBeGreaterThan(rule.candidateDays[0].targetTithiOverlapSeconds);
  });

  it("fails closed outside each exact tradition and candidate-date boundary", () => {
    const wrongTradition = resolveBoundedObservances({ ...mumbaiRequest, traditionCode: "smarta-south-india" });
    const wrongDate = resolveBoundedObservances({ ...mumbaiRequest, civilDate: "2026-09-20" });
    expect(wrongTradition).toMatchObject({ status: "no_supported_rule_for_context", matchedRules: [] });
    expect(wrongDate).toMatchObject({ status: "no_supported_rule_for_context", matchedRules: [] });
  });

  it("resolves all eight Delhi Smarta dates while keeping Smarta parana unresolved", () => {
    const leads = [
      ["2026-09-07", "aja-ekadashi"],
      ["2026-09-22", "parsva-ekadashi"],
      ["2026-10-06", "indira-ekadashi"],
      ["2026-10-22", "papankusha-ekadashi"],
      ["2026-11-05", "rama-ekadashi"],
      ["2026-11-20", "devutthana-ekadashi"],
      ["2026-12-04", "utpanna-ekadashi"],
      ["2026-12-20", "mokshada-ekadashi"],
    ];
    for (const [civilDate, observanceSlug] of leads) {
      const result = resolveBoundedObservances({ ...delhiRequest, civilDate });
      const rule = ekadashiFor(result, observanceSlug);
      expect(rule).toMatchObject({
        selectedCivilDate: civilDate,
        appliesToRequestedDate: true,
        lane: "smarta",
        profileId: "delhi",
        classification: "smarta_current_practitioner_selected_date",
        parana: { status: "unresolved_smarta_location_specific_hari_vasara_evidence_required", startUtc: null, endUtc: null },
        boundaries: { smartaDateResolved: true, vaishnavaDateResolved: false, paranaResolved: false, ritualGuidanceIncluded: false },
      });
      expect(rule.evidence).toMatchObject({ fixtureSha256: "6c860d6f2d778739c4a25b4b281b03a16975e8d43021baee24c55b1e1b72433d", sourceTextReturnedByApi: false });
      expect(result.unresolvedCandidates.some((candidate) => candidate.observanceSlug === observanceSlug)).toBe(false);
    }
  });

  it("keeps the Devutthana Smarta and ISKCON dates separate and preserves the sunrise edge", () => {
    const result = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-11-20" });
    const smarta = ekadashiFor(result, "devutthana-ekadashi");
    expect(smarta).toMatchObject({ selectedCivilDate: "2026-11-20", appliesToRequestedDate: true, lane: "smarta" });
    expect(smarta.candidateDays[0]).toMatchObject({
      civilDate: "2026-11-20",
      tithiAtArunodaya: { index: 10, name: "Dashami" },
      tithiAtSunrise: { index: 10, name: "Dashami" },
    });
    expect(smarta.candidateDays[1]).toMatchObject({ civilDate: "2026-11-21", tithiAtSunrise: { index: 12, name: "Dvadashi" } });

    const iskconResult = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-11-21", traditionCode: "vaishnava-iskcon" });
    const iskcon = ekadashiFor(iskconResult, "devutthana-ekadashi");
    expect(iskcon).toMatchObject({
      canonicalName: "Utthana Ekadashi",
      selectedCivilDate: "2026-11-21",
      appliesToRequestedDate: true,
      lane: "vaishnava-iskcon",
      classification: "gauna_vaishnava_shift",
      parana: { status: "resolved_for_exact_iskcon_reference_profile", providerObservedStartLocal: "2026-11-22T06:49:00+05:30", providerObservedEndLocal: "2026-11-22T10:21:00+05:30" },
      boundaries: { smartaDateResolved: false, vaishnavaDateResolved: true, paranaResolved: true, ritualGuidanceIncluded: false },
    });
    if (iskcon.parana.status !== "resolved_for_exact_iskcon_reference_profile") throw new Error("missing ISKCON parana");
    expect(iskcon.parana.validation.startDifferenceSeconds).toBeLessThanOrEqual(180);
    expect(iskcon.parana.validation.endDifferenceSeconds).toBeLessThanOrEqual(180);
  });

  it("preserves the Chennai Paksha Vardhini shift instead of applying the Delhi date nationally", () => {
    const chennai = {
      civilDate: "2026-12-05",
      latitude: 13.0827,
      longitude: 80.2707,
      timezone: "Asia/Kolkata",
      traditionCode: "vaishnava-iskcon",
    } as const;
    const chennaiRule = ekadashiFor(resolveBoundedObservances(chennai), "utpanna-ekadashi");
    expect(chennaiRule).toMatchObject({
      selectedCivilDate: "2026-12-05",
      appliesToRequestedDate: true,
      profileId: "chennai",
      classification: "paksha_vardhini_mahadwadashi",
      parana: { providerObservedStartLocal: "2026-12-06T06:18:00+05:30", providerObservedEndLocal: "2026-12-06T10:06:00+05:30" },
    });
    const delhiRule = ekadashiFor(resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-12-04", traditionCode: "vaishnava-iskcon" }), "utpanna-ekadashi");
    expect(delhiRule).toMatchObject({ selectedCivilDate: "2026-12-04", profileId: "delhi", classification: "ordinary_iskcon_ekadashi" });
  });

  it("fails closed outside an exact city/tradition profile and retains the unresolved candidate", () => {
    const result = resolveBoundedObservances({ ...delhiRequest, civilDate: "2026-09-07", latitude: 28.62 });
    expect(result.matchedRules.some((rule) => rule.observanceSlug === "aja-ekadashi")).toBe(false);
    expect(result.unresolvedCandidates).toContainEqual(expect.objectContaining({
      observanceSlug: "aja-ekadashi",
      selectedCivilDate: null,
      boundaries: { smartaDateResolved: false, vaishnavaDateResolved: false, paranaResolved: false, ritualGuidanceIncluded: false },
    }));
  });

  it("is deterministic and never returns private source text", () => {
    const first = resolveBoundedObservances(mumbaiRequest);
    expect(first).toEqual(resolveBoundedObservances(mumbaiRequest));
    expect(JSON.stringify(first)).not.toContain("गणेशव्रतविषयीं");
  });
});
