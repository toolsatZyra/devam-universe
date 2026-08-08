import { describe, expect, it } from "vitest";

import { answerSarthi } from "../lib/sarthi/answer";
import { gateways, worldNodes } from "./atlas";
import { heroChallenges, heroJourneys } from "./hero-experiences";
import { LAUNCH_REGIONAL_ACCEPTANCE_PROFILES } from "./launch-regional-acceptance";

const HEROES = ["ganesha", "durga", "ramayana", "diwali"] as const;

describe("hero cross-surface acceptance", () => {
  it("connects every priority world to Today context, Atlas, Journey, and Challenge", () => {
    for (const hero of HEROES) {
      const dailyProfiles = LAUNCH_REGIONAL_ACCEPTANCE_PROFILES.filter((profile) => profile.hero === hero);
      const gateway = gateways.find((candidate) => candidate.id === hero);
      const journey = heroJourneys.find((candidate) => candidate.slug === hero);
      const challenge = heroChallenges.find((candidate) => candidate.journeySlug === hero);

      expect(dailyProfiles.length, `${hero} has no bounded Today/date context`).toBeGreaterThan(0);
      expect(gateway, `${hero} has no Atlas gateway`).toBeDefined();
      expect(worldNodes.some((node) => node.gatewayId === hero), `${hero} has no Atlas world node`).toBe(true);
      expect(journey?.stops.length, `${hero} has no source-addressed journey`).toBeGreaterThan(0);
      expect(challenge).toMatchObject({
        journeySlug: hero,
        requiredStopIds: journey?.stops.map((stop) => stop.id),
        spiritualScore: false,
      });
    }
  });

  it("routes each priority world through Sarthi with its bounded product mode", () => {
    const cases = [
      {
        hero: "ganesha",
        request: { message: "How should I perform Ganesh Chaturthi puja at home?", context: { atlasNodeSlug: "ganesha", languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" } },
        expected: { mode: "contextual_ritual_guidance", practiceGuide: { companionToObservanceSlug: "ganesh-chaturthi" } },
      },
      {
        hero: "durga",
        request: { message: "What should I do for Maha Ashtami during Durga Puja in Kolkata?", context: { atlasNodeSlug: "durga", languageCode: "en", regionCode: "bengal", traditionCode: "shakta-bengal" } },
        expected: { mode: "contextual_ritual_guidance", practiceGuide: { companionToObservanceSlug: "bengal-mahashtami-community-participant-2026" } },
      },
      {
        hero: "ramayana",
        request: { message: "How is the Valmiki Ramayana structured?", context: { atlasNodeSlug: "ramayana", languageCode: "en" } },
        expected: { mode: "deterministic_source_bounded_preview", citations: expect.any(Array) },
      },
      {
        hero: "diwali",
        request: { message: "I am in Chennai. What should I do for Tamil Deepavali?", context: { atlasNodeSlug: "diwali", languageCode: "en", regionCode: "south-india", traditionCode: "smarta-south-india" } },
        expected: { mode: "contextual_ritual_guidance", practiceGuide: { companionToObservanceSlug: "tamil-deepavali-naraka-chaturdashi" } },
      },
    ] as const;

    for (const testCase of cases) {
      const result = answerSarthi(testCase.request);
      expect(result, testCase.hero).toMatchObject({ ok: true, ...testCase.expected });
      if (result.ok) {
        expect(result.sourceBoundary.length, `${testCase.hero} has no source boundary`).toBeGreaterThan(40);
        expect(result.alternativesAvailable, `${testCase.hero} hides alternatives`).toBe(true);
      }
    }
  });
});
