export type ProfileInput = {
  displayName: string | null;
  preferredLanguage: "en" | "hi" | null;
  homeLocation: { city: string | null; countryCode: "IN"; practiceRegion: "north-india" | "west-india" | "bengal" | "south-india" | null } | null;
  sampradayaCode: string | null;
  familyPractice: { notes: string } | Record<string, never>;
  personalizationConsent: boolean;
};

const MAX_NAME_LENGTH = 80;
const MAX_CITY_LENGTH = 100;
const MAX_CONTEXT_LENGTH = 600;

function optionalText(value: FormDataEntryValue | null, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/\s+/g, " ");
  if (!normalized) return null;
  if (normalized.length > maxLength) throw new Error("PROFILE_FIELD_TOO_LONG");
  return normalized;
}

export function parseProfileForm(formData: FormData): ProfileInput {
  const language = optionalText(formData.get("preferredLanguage"), 8);
  if (language !== null && language !== "en" && language !== "hi") {
    throw new Error("UNSUPPORTED_PROFILE_LANGUAGE");
  }

  const city = optionalText(formData.get("city"), MAX_CITY_LENGTH);
  const practiceRegion = optionalText(formData.get("practiceRegion"), 40);
  const supportedRegions = ["north-india", "west-india", "bengal", "south-india"] as const;
  if (practiceRegion !== null && !supportedRegions.includes(practiceRegion as typeof supportedRegions[number])) {
    throw new Error("UNSUPPORTED_PRACTICE_REGION");
  }
  const familyNotes = optionalText(formData.get("familyPractice"), MAX_CONTEXT_LENGTH);

  return {
    displayName: optionalText(formData.get("displayName"), MAX_NAME_LENGTH),
    preferredLanguage: language,
    homeLocation: city || practiceRegion ? {
      city,
      countryCode: "IN",
      practiceRegion: practiceRegion as typeof supportedRegions[number] | null,
    } : null,
    sampradayaCode: optionalText(formData.get("sampradayaCode"), MAX_NAME_LENGTH),
    familyPractice: familyNotes ? { notes: familyNotes } : {},
    personalizationConsent: formData.get("personalizationConsent") === "on",
  };
}

export function validateEmailAddress(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") throw new Error("INVALID_EMAIL");
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("INVALID_EMAIL");
  }
  return email;
}
