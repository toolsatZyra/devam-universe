export type PanchangRequest = {
  civilDate: string;
  latitude: number;
  longitude: number;
  timezone: string;
  traditionCode: string;
};

export type PanchangValidation =
  | { ok: true; value: PanchangRequest }
  | { ok: false; code: "NEEDS_CONTEXT" | "INVALID_CONTEXT"; issues: string[] };

export type PanchangEngineError = {
  ok: false;
  code: "ENGINE_CALCULATION_FAILED" | "NO_SUNRISE_FOR_CIVIL_DATE";
  message: string;
  request: PanchangRequest;
};

export type PanchangTransition = {
  index: number;
  name: string;
  paksha?: "shukla" | "krishna";
  endsAtUtc: string;
  nextIndex: number;
  nextName: string;
  nextPaksha?: "shukla" | "krishna";
};

export type PanchangWindow = {
  startUtc: string;
  endUtc: string;
};

export type PanchangFact = {
  ok: true;
  request: PanchangRequest;
  engine: {
    id: "devam-panchang";
    version: "astronomy-engine-2.1.19-lahiri-v3";
    astronomyModel: "Astronomy Engine VSOP87/NOVAS-validated model";
    ayanamsha: "lahiri_mean_linear_v1";
    ayanamshaDegreesAtSunrise: number;
    rulesetVersion: "panchanga-five-limbs-sunrise-v1";
    evidenceStatus: "astronomy_reference_fixture_validated";
  };
  sunriseUtc: string;
  sunsetUtc: string;
  moonriseUtc: string | null;
  moonsetUtc: string | null;
  vara: { index: number; name: string };
  tithi: PanchangTransition;
  nakshatra: PanchangTransition;
  yoga: PanchangTransition;
  karana: PanchangTransition;
  solarRashi: PanchangTransition;
  windows: {
    rahuKalam: PanchangWindow;
    yamaganda: PanchangWindow;
    gulika: PanchangWindow;
    brahmaMuhurta: PanchangWindow;
    abhijitMuhurta: PanchangWindow;
  };
  boundaries: {
    calculationOnly: true;
    observanceRulesResolved: false;
    ritualGuidanceIncluded: false;
    note: string;
  };
};

function isRealIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function isTimezone(value: string): boolean {
  try {
    new Intl.DateTimeFormat("en", { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

export function validatePanchangRequest(input: unknown): PanchangValidation {
  if (!input || typeof input !== "object") {
    return { ok: false, code: "NEEDS_CONTEXT", issues: ["Request body is required."] };
  }

  const body = input as Record<string, unknown>;
  const required = ["civilDate", "latitude", "longitude", "timezone", "traditionCode"];
  const missing = required.filter((key) => body[key] === undefined || body[key] === null || body[key] === "");
  if (missing.length) {
    return {
      ok: false,
      code: "NEEDS_CONTEXT",
      issues: missing.map((field) => `${field} is required.`),
    };
  }

  const issues: string[] = [];
  if (typeof body.civilDate !== "string" || !isRealIsoDate(body.civilDate)) issues.push("civilDate must be a real YYYY-MM-DD date.");
  if (typeof body.latitude !== "number" || !Number.isFinite(body.latitude) || body.latitude < -90 || body.latitude > 90) issues.push("latitude must be between -90 and 90.");
  if (typeof body.longitude !== "number" || !Number.isFinite(body.longitude) || body.longitude < -180 || body.longitude > 180) issues.push("longitude must be between -180 and 180.");
  if (typeof body.timezone !== "string" || !isTimezone(body.timezone)) issues.push("timezone must be a valid IANA timezone.");
  if (typeof body.traditionCode !== "string" || !/^[a-z0-9][a-z0-9_-]{1,63}$/i.test(body.traditionCode)) issues.push("traditionCode must be a stable 2-64 character code.");

  if (issues.length) return { ok: false, code: "INVALID_CONTEXT", issues };
  return { ok: true, value: body as PanchangRequest };
}
