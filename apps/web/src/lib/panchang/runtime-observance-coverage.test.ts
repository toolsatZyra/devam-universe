import { describe, expect, it } from "vitest";

import type { PanchangRequest } from "./contracts";
import { resolveBoundedObservances } from "./observance-rules";

const PROFILES = [
  ["delhi-north-smarta", 28.6139, 77.209, "smarta-north-india"],
  ["mumbai-west-smarta", 19.076, 72.8777, "smarta-west-india"],
  ["chennai-south-smarta", 13.0827, 80.2707, "smarta-south-india"],
  ["bengaluru-south-smarta", 12.9716, 77.5946, "smarta-south-india"],
  ["kolkata-bengal-shakta", 22.5726, 88.3639, "shakta-bengal"],
  ["kolkata-east-smarta", 22.5726, 88.3639, "smarta-east-india"],
  ["delhi-iskcon", 28.6139, 77.209, "vaishnava-iskcon"],
  ["ahmedabad-baps", 23.0225, 72.5714, "swaminarayan-baps"],
  ["delhi-jain", 28.6139, 77.209, "jain-umbrella"],
  ["amritsar-sgpc", 31.634, 74.8723, "sikh-sgpc"],
  ["varanasi-regional", 25.3176, 82.9739, "regional-kashi-varanasi"],
  ["patna-chhath", 25.5941, 85.1376, "surya-chhath-bihar-purvanchal"],
  ["delhi-chhath", 28.6139, 77.209, "surya-chhath-bihar-purvanchal"],
] as const;

const EXPECTED_RUNTIME_SLUGS = [
  "agastya-arghya-delhi", "ahoi-ashtami-north-india", "aja-ekadashi", "ananta-chaturdashi",
  "ashwina-amavasya", "ashwina-purnima", "bali-pratipada", "bandi-chhor-divas-sgpc",
  "bengal-kali-puja", "bhadrapada-amavasya", "bhadrapada-purnima", "bhai-dooj",
  "chhath-puja-sandhya-arghya", "dev-deepawali-varanasi", "devutthana-ekadashi",
  "dhantrayodashi", "dhanu-sankranti", "diwali-lakshmi-puja", "ganesh-chaturthi",
  "govardhan-puja", "govatsa-dwadashi", "gujarati-new-year-baps", "hala-shashthi-hal-chhath",
  "hartalika-teej", "indira-ekadashi", "jain-diwali-umbrella", "kalabhairava-jayanti",
  "kali-chaudas-baps", "kanya-sankranti", "karnataka-balipadyami",
  "karnataka-saraswati-ayudha-puja", "kartika-amavasya", "kartika-purnima", "karwa-chauth",
  "kojagara-puja-sharad-purnima", "krishna-janmashtami-iskcon", "krishna-janmashtami-smarta",
  "margashirsha-amavasya", "masika-durgashtami-2026-09", "masika-durgashtami-2026-10",
  "masika-durgashtami-2026-11", "masika-durgashtami-2026-12", "masika-shivaratri-2026-09",
  "masika-shivaratri-2026-10", "masika-shivaratri-2026-11", "masika-shivaratri-2026-12",
  "mokshada-ekadashi", "naraka-chaturdashi", "papankusha-ekadashi", "parsva-ekadashi",
  "pradosha-2026-09-krishna", "pradosha-2026-09-shukla", "pradosha-2026-10-krishna",
  "pradosha-2026-10-shukla", "pradosha-2026-11-krishna", "pradosha-2026-11-shukla",
  "pradosha-2026-12-krishna", "pradosha-2026-12-shukla", "radha-ashtami-iskcon",
  "rama-ekadashi", "rishi-panchami", "sankashti-chaturthi-2026-09",
  "sankashti-chaturthi-2026-10", "sankashti-chaturthi-2026-11",
  "sankashti-chaturthi-2026-12", "shardiya-navaratri-begins",
  "tamil-deepavali-naraka-chaturdashi", "tula-sankranti", "tulasi-vivah-dwadashi",
  "tulsi-vivah-baps-begins", "tulsi-vivah-baps-samapt", "utpanna-ekadashi", "vijayadashami",
  "vivaha-panchami", "vrishchika-sankranti", "yama-deepam",
] as const;

const TRADITION_INDEPENDENT_ASTRONOMICAL_IDENTITIES = new Set([
  "kanya-sankranti", "tula-sankranti", "vrishchika-sankranti", "dhanu-sankranti",
]);

function launchDates(): string[] {
  const dates: string[] = [];
  for (let current = new Date("2026-09-01T00:00:00Z"); current <= new Date("2026-12-31T00:00:00Z"); current.setUTCDate(current.getUTCDate() + 1)) {
    dates.push(current.toISOString().slice(0, 10));
  }
  return dates;
}

describe("runtime launch observance coverage", () => {
  it("enumerates every executable named lane across the bounded launch profiles", () => {
    const observations = new Map<string, { profileId: string; request: PanchangRequest; rule: ReturnType<typeof resolveBoundedObservances>["matchedRules"][number] }>();
    for (const [profileId, latitude, longitude, traditionCode] of PROFILES) {
      for (const civilDate of launchDates()) {
        const request = { civilDate, latitude, longitude, timezone: "Asia/Kolkata", traditionCode };
        const result = resolveBoundedObservances(request);
        for (const rule of result.matchedRules.filter((candidate) => candidate.appliesToRequestedDate)) {
          observations.set(`${profileId}|${rule.observanceSlug}`, { profileId, request, rule });
        }
      }
    }

    const firstBySlug = new Map<string, (typeof observations extends Map<string, infer V> ? V : never)>();
    for (const observation of observations.values()) firstBySlug.set(observation.rule.observanceSlug, observation);
    const slugs = [...firstBySlug.keys()].sort();
    expect(launchDates()).toHaveLength(122);
    expect(PROFILES).toHaveLength(13);
    expect(slugs).toEqual(EXPECTED_RUNTIME_SLUGS);

    for (const [slug, observation] of firstBySlug) {
      const serializedEvidence = JSON.stringify(observation.rule.evidence);
      expect(observation.rule, slug).toMatchObject({
        observanceSlug: slug,
        appliesToRequestedDate: true,
        precedence: { kind: expect.any(String), explanation: expect.any(String) },
        evidence: expect.any(Object),
      });
      expect(observation.rule.selectedCivilDate, `${slug} has no selected 2026 civil date`).toMatch(/^2026-(09|10|11|12)-\d{2}$/);
      expect(serializedEvidence.length, `${slug} has no substantive evidence`).toBeGreaterThan(80);
      expect(serializedEvidence, `${slug} has no hash-bound evidence coordinate`).toMatch(/sha256/i);

      const unsupported = resolveBoundedObservances({
        ...observation.request,
        traditionCode: "unsupported-runtime-profile",
      });
      expect(
        unsupported.matchedRules.some((rule) => rule.observanceSlug === slug),
        `${slug} widened beyond its declared applicability`,
      ).toBe(TRADITION_INDEPENDENT_ASTRONOMICAL_IDENTITIES.has(slug));
    }
  }, 20_000);
});
