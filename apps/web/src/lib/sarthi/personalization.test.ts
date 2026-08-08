import { describe, expect, it } from "vitest";
import { applyConsentedProfileContext } from "./personalization";

describe("Sarthi profile context", () => {
  const request = { message: "What should I do for Navaratri?", context: { atlasNodeSlug: "durga" } };

  it("fills missing context only after explicit consent", () => {
    expect(applyConsentedProfileContext(request, {
      preferred_language: "hi",
      home_location: { city: "Delhi", practiceRegion: "north-india" },
      sampradaya_code: "smarta-north-india",
      personalization_consent: true,
    })).toMatchObject({ context: { atlasNodeSlug: "durga", languageCode: "hi", regionCode: "north-india", traditionCode: "smarta-north-india" } });
  });

  it("never overrides current conversational context", () => {
    const explicit = { ...request, context: { atlasNodeSlug: "durga", languageCode: "en", regionCode: "west-india" } };
    expect(applyConsentedProfileContext(explicit, {
      preferred_language: "hi",
      home_location: { practiceRegion: "north-india" },
      sampradaya_code: "smarta-north-india",
      personalization_consent: true,
    }).context).toMatchObject({ languageCode: "en", regionCode: "west-india" });
  });

  it("keeps non-consenting and malformed profile values out of the request", () => {
    expect(applyConsentedProfileContext(request, {
      preferred_language: "hi",
      home_location: { practiceRegion: "north-india" },
      sampradaya_code: "smarta-north-india",
      personalization_consent: false,
    })).toEqual(request);
  });
});

