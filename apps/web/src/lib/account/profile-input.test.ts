import { describe, expect, it } from "vitest";
import { parseProfileForm, validateEmailAddress } from "./profile-input";

describe("account input validation", () => {
  it("normalizes an owner-controlled profile without authorization metadata", () => {
    const form = new FormData();
    form.set("displayName", "  Shiba   Kumar  ");
    form.set("preferredLanguage", "hi");
    form.set("city", " New Delhi ");
    form.set("practiceRegion", "north-india");
    form.set("sampradayaCode", "family practice not specified");
    form.set("familyPractice", " We light a diya in the evening. ");
    form.set("personalizationConsent", "on");

    expect(parseProfileForm(form)).toEqual({
      displayName: "Shiba Kumar",
      preferredLanguage: "hi",
      homeLocation: { city: "New Delhi", countryCode: "IN", practiceRegion: "north-india" },
      sampradayaCode: "family practice not specified",
      familyPractice: { notes: "We light a diya in the evening." },
      personalizationConsent: true,
    });
  });

  it("keeps optional context empty and rejects unsupported language values", () => {
    const empty = new FormData();
    expect(parseProfileForm(empty)).toMatchObject({
      displayName: null,
      preferredLanguage: null,
      homeLocation: null,
      familyPractice: {},
      personalizationConsent: false,
    });

    empty.set("preferredLanguage", "sa");
    expect(() => parseProfileForm(empty)).toThrow("UNSUPPORTED_PROFILE_LANGUAGE");
  });

  it("normalizes valid email and rejects malformed input", () => {
    expect(validateEmailAddress(" Devam@Example.com ")).toBe("devam@example.com");
    expect(() => validateEmailAddress("not-an-email")).toThrow("INVALID_EMAIL");
  });
});
