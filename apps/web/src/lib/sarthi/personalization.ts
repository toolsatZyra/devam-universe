import type { Json } from "@/lib/supabase/database.types";
import type { SarthiRequest } from "./contracts";

export type SarthiProfileContext = {
  preferred_language: string | null;
  home_location: Json | null;
  sampradaya_code: string | null;
  personalization_consent: boolean;
};

function objectValue(value: Json | null): Record<string, Json | undefined> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, Json | undefined> : {};
}

export function applyConsentedProfileContext(request: SarthiRequest, profile: SarthiProfileContext): SarthiRequest {
  if (!profile.personalization_consent) return request;
  const home = objectValue(profile.home_location);
  const preferredLanguage = profile.preferred_language && /^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/i.test(profile.preferred_language)
    ? profile.preferred_language : undefined;
  const regionCode = typeof home.practiceRegion === "string" && /^[a-z0-9-]{1,100}$/.test(home.practiceRegion)
    ? home.practiceRegion : undefined;
  const traditionCode = profile.sampradaya_code && /^[a-z0-9-]{1,100}$/.test(profile.sampradaya_code)
    ? profile.sampradaya_code : undefined;

  return {
    ...request,
    context: {
      languageCode: preferredLanguage,
      regionCode,
      traditionCode,
      ...request.context,
    },
  };
}

