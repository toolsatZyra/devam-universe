import { describe, expect, it } from "vitest";

import { resolveHeroCampaignDay } from "../lib/campaigns/hero-calendar";
import { resolveBoundedObservances } from "../lib/panchang/observance-rules";
import { resolvePracticeGuidance } from "../lib/practice/practice-guidance";
import { LAUNCH_REGIONAL_ACCEPTANCE_PROFILES } from "./launch-regional-acceptance";

describe("bounded launch regional acceptance matrix", () => {
  it("covers all four hero worlds across the named launch comparison cities", () => {
    expect(LAUNCH_REGIONAL_ACCEPTANCE_PROFILES).toHaveLength(18);
    expect(new Set(LAUNCH_REGIONAL_ACCEPTANCE_PROFILES.map((profile) => profile.id)).size).toBe(18);
    expect(new Set(LAUNCH_REGIONAL_ACCEPTANCE_PROFILES.map((profile) => profile.city))).toEqual(new Set([
      "Ahmedabad", "Amritsar", "Bengaluru", "Chennai", "Delhi", "Kolkata", "Mumbai", "Patna",
    ]));
    expect(new Set(LAUNCH_REGIONAL_ACCEPTANCE_PROFILES.map((profile) => profile.hero))).toEqual(new Set([
      "ganesha", "durga", "ramayana", "diwali",
    ]));
  });

  it("binds every exact city/date/tradition profile to its deterministic calendar lane", () => {
    for (const profile of LAUNCH_REGIONAL_ACCEPTANCE_PROFILES) {
      if (profile.calendar.kind === "hero_campaign") {
        expect(resolveHeroCampaignDay({ civilDate: profile.civilDate, traditionCode: profile.traditionCode })).toMatchObject({
          civilDate: profile.civilDate,
          commonName: profile.calendar.commonName,
          practiceGuideObservanceSlug: profile.practiceObservanceSlug,
        });
        continue;
      }

      const result = resolveBoundedObservances({
        civilDate: profile.civilDate,
        latitude: profile.latitude,
        longitude: profile.longitude,
        timezone: profile.timezone,
        traditionCode: profile.traditionCode,
      });
      const observanceSlug = profile.calendar.observanceSlug;
      expect(result.matchedRules.find((rule) => rule.observanceSlug === observanceSlug)).toMatchObject({
        selectedCivilDate: profile.civilDate,
        appliesToRequestedDate: true,
      });
    }
  });

  it("serves English and Hindi user-complete guidance for every accepted regional profile", () => {
    for (const profile of LAUNCH_REGIONAL_ACCEPTANCE_PROFILES) {
      for (const languageCode of ["en", "hi"] as const) {
        expect(resolvePracticeGuidance({
          observanceSlug: profile.practiceObservanceSlug,
          languageCode,
          regionCode: profile.regionCode,
          traditionCode: profile.traditionCode,
        })).toMatchObject({
          ok: true,
          status: "ritual_procedure_available",
          guide: {
            kind: "user_complete_observance_lane",
            companionToObservanceSlug: profile.practiceObservanceSlug,
            languageCode,
          },
        });
      }
    }
  });

  it("fails closed when an accepted row is requested under an unsupported tradition", () => {
    for (const profile of LAUNCH_REGIONAL_ACCEPTANCE_PROFILES) {
      if (profile.calendar.kind === "hero_campaign") {
        expect(resolveHeroCampaignDay({ civilDate: profile.civilDate, traditionCode: "unsupported-comparison-profile" })).toBeNull();
      } else {
        const result = resolveBoundedObservances({
          civilDate: profile.civilDate,
          latitude: profile.latitude,
          longitude: profile.longitude,
          timezone: profile.timezone,
          traditionCode: "unsupported-comparison-profile",
        });
        const observanceSlug = profile.calendar.observanceSlug;
        expect(result.matchedRules.some((rule) => rule.observanceSlug === observanceSlug)).toBe(false);
      }

      expect(resolvePracticeGuidance({
        observanceSlug: profile.practiceObservanceSlug,
        languageCode: "en",
        regionCode: "unsupported-comparison-region",
        traditionCode: "unsupported-comparison-profile",
      })).toMatchObject({ ok: true, status: "no_supported_guide_for_context", guide: null });
    }
  });
});
