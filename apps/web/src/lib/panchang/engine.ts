import {
  Body,
  EclipticGeoMoon,
  MoonPhase,
  Observer,
  SearchMoonPhase,
  SearchRiseSet,
  SunPosition,
} from "astronomy-engine";
import type { PanchangFact, PanchangRequest, PanchangTransition, PanchangWindow } from "./contracts";

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
const NAKSHATRA_ARC = 360 / 27;
const ENGINE_VERSION = "astronomy-engine-2.1.19-lahiri-v3" as const;

const TITHI_NAMES = [
  "Pratipada", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami",
  "Navami", "Dashami", "Ekadashi", "Dvadashi", "Trayodashi", "Chaturdashi", "Purnima",
] as const;

const NAKSHATRA_NAMES = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra", "Punarvasu", "Pushya",
  "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha",
  "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha",
  "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
] as const;

const YOGA_NAMES = [
  "Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti",
  "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata",
  "Variyana", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti",
] as const;

const VARA_NAMES = ["Ravivara", "Somavara", "Mangalavara", "Budhavara", "Guruvara", "Shukravara", "Shanivara"] as const;
const RASHI_NAMES = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"] as const;
const MOVABLE_KARANAS = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti"] as const;

function normalizeDegrees(value: number): number {
  return ((value % 360) + 360) % 360;
}

function iso(value: Date): string {
  return value.toISOString();
}

function localCivilDate(date: Date, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function findSunrise(request: PanchangRequest): Date | null {
  const observer = new Observer(request.latitude, request.longitude, 0);
  let cursor = new Date(`${request.civilDate}T00:00:00.000Z`).getTime() - DAY_MS;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const event = SearchRiseSet(Body.Sun, observer, +1, new Date(cursor), 2);
    if (!event) return null;
    if (localCivilDate(event.date, request.timezone) === request.civilDate) return event.date;
    cursor = event.date.getTime() + 60_000;
  }
  return null;
}

function findSunset(request: PanchangRequest, sunrise: Date): Date | null {
  const observer = new Observer(request.latitude, request.longitude, 0);
  return SearchRiseSet(Body.Sun, observer, -1, new Date(sunrise.getTime() + 60_000), 1)?.date ?? null;
}

function findLocalMoonEvent(request: PanchangRequest, direction: 1 | -1): Date | null {
  const observer = new Observer(request.latitude, request.longitude, 0);
  let cursor = new Date(`${request.civilDate}T00:00:00.000Z`).getTime() - DAY_MS;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const event = SearchRiseSet(Body.Moon, observer, direction, new Date(cursor), 2);
    if (!event) return null;
    if (localCivilDate(event.date, request.timezone) === request.civilDate) return event.date;
    cursor = event.date.getTime() + 60_000;
  }
  return null;
}

// Mean Lahiri/Chitrapaksha approximation, anchored at J2000 and advanced by
// the standard annual precession rate. Versioned independently so a future
// authoritative ephemeris implementation can replace it without silent drift.
export function lahiriAyanamshaDegrees(date: Date): number {
  const yearsFromJ2000 = (date.getTime() - Date.UTC(2000, 0, 1, 12)) / DAY_MS / 365.2425;
  return 23.85675 + yearsFromJ2000 * (50.290966 / 3600);
}

function tithiName(index: number): string {
  if (index === 30) return "Amavasya";
  return TITHI_NAMES[(index - 1) % 15];
}

function paksha(index: number): "shukla" | "krishna" {
  return index <= 15 ? "shukla" : "krishna";
}

function karanaName(index: number): string {
  if (index === 1) return "Kimstughna";
  if (index === 58) return "Shakuni";
  if (index === 59) return "Chatushpada";
  if (index === 60) return "Naga";
  return MOVABLE_KARANAS[(index - 2) % MOVABLE_KARANAS.length];
}

function tithiAt(date: Date): { index: number; phase: number } {
  const phase = MoonPhase(date);
  return { index: Math.floor(phase / 12) + 1, phase };
}

export type TithiInstantFact = {
  instantUtc: string;
  index: number;
  name: string;
  paksha: "shukla" | "krishna";
};

export function calculateTithiAtInstant(value: Date | string): TithiInstantFact {
  const instant = value instanceof Date ? new Date(value) : new Date(value);
  if (Number.isNaN(instant.getTime())) throw new Error("A valid instant is required for tithi calculation.");
  const current = tithiAt(instant);
  return { instantUtc: instant.toISOString(), index: current.index, name: tithiName(current.index), paksha: paksha(current.index) };
}

function nakshatraValue(date: Date): number {
  return normalizeDegrees(EclipticGeoMoon(date).lon - lahiriAyanamshaDegrees(date));
}

function yogaValue(date: Date): number {
  return normalizeDegrees(EclipticGeoMoon(date).lon + SunPosition(date).elon - 2 * lahiriAyanamshaDegrees(date));
}

function solarRashiValue(date: Date): number {
  return normalizeDegrees(SunPosition(date).elon - lahiriAyanamshaDegrees(date));
}

function nextIndexedBoundary(start: Date, valueAt: (date: Date) => number, segment: number, limitDays = 3, stepMillis = HOUR_MS): Date {
  const initial = Math.floor(valueAt(start) / segment);
  let low = start.getTime();
  let high = low + stepMillis;
  while (Math.floor(valueAt(new Date(high)) / segment) === initial && high - low <= limitDays * DAY_MS) high += stepMillis;
  if (high - low > limitDays * DAY_MS) throw new Error(`No indexed transition found within ${limitDays} days.`);
  for (let iteration = 0; iteration < 48; iteration += 1) {
    const midpoint = (low + high) / 2;
    if (Math.floor(valueAt(new Date(midpoint)) / segment) === initial) low = midpoint;
    else high = midpoint;
  }
  return new Date(Math.ceil(high));
}

function tithiTransition(sunrise: Date): PanchangTransition {
  const current = tithiAt(sunrise);
  const target = ((Math.floor(current.phase / 12) + 1) * 12) % 360;
  const end = SearchMoonPhase(target, new Date(sunrise.getTime() + 1_000), 3)?.date;
  if (!end) throw new Error("No tithi transition found within three days.");
  const next = tithiAt(new Date(end.getTime() + 60_000));
  return {
    index: current.index,
    name: tithiName(current.index),
    paksha: paksha(current.index),
    endsAtUtc: iso(end),
    nextIndex: next.index,
    nextName: tithiName(next.index),
    nextPaksha: paksha(next.index),
  };
}

function karanaTransition(sunrise: Date): PanchangTransition {
  const phase = MoonPhase(sunrise);
  const index = Math.floor(phase / 6) + 1;
  const target = ((Math.floor(phase / 6) + 1) * 6) % 360;
  const end = SearchMoonPhase(target, new Date(sunrise.getTime() + 1_000), 2)?.date;
  if (!end) throw new Error("No karana transition found within two days.");
  const nextIndex = Math.floor(MoonPhase(new Date(end.getTime() + 60_000)) / 6) + 1;
  return { index, name: karanaName(index), endsAtUtc: iso(end), nextIndex, nextName: karanaName(nextIndex) };
}

function indexedTransition(
  sunrise: Date,
  valueAt: (date: Date) => number,
  names: readonly string[],
): PanchangTransition {
  const index = Math.floor(valueAt(sunrise) / NAKSHATRA_ARC) + 1;
  const end = nextIndexedBoundary(sunrise, valueAt, NAKSHATRA_ARC);
  const nextIndex = Math.floor(valueAt(new Date(end.getTime() + 60_000)) / NAKSHATRA_ARC) + 1;
  return { index, name: names[index - 1], endsAtUtc: iso(end), nextIndex, nextName: names[nextIndex - 1] };
}

function solarRashiTransition(sunrise: Date): PanchangTransition {
  const segment = 30;
  const index = Math.floor(solarRashiValue(sunrise) / segment) + 1;
  const end = nextIndexedBoundary(sunrise, solarRashiValue, segment, 35, 12 * HOUR_MS);
  const nextIndex = Math.floor(solarRashiValue(new Date(end.getTime() + 60_000)) / segment) + 1;
  return { index, name: RASHI_NAMES[index - 1], endsAtUtc: iso(end), nextIndex, nextName: RASHI_NAMES[nextIndex - 1] };
}

function daylightPart(sunrise: Date, sunset: Date, ordinal: number): PanchangWindow {
  const part = (sunset.getTime() - sunrise.getTime()) / 8;
  return { startUtc: iso(new Date(sunrise.getTime() + (ordinal - 1) * part)), endUtc: iso(new Date(sunrise.getTime() + ordinal * part)) };
}

function windows(sunrise: Date, sunset: Date, weekday: number): PanchangFact["windows"] {
  const rahuOrdinals = [8, 2, 7, 5, 6, 4, 3];
  const yamagandaOrdinals = [5, 4, 3, 2, 1, 7, 6];
  const gulikaOrdinals = [7, 6, 5, 4, 3, 2, 1];
  const daylight = sunset.getTime() - sunrise.getTime();
  const noon = sunrise.getTime() + daylight / 2;
  const abhijitHalf = daylight / 30;
  return {
    rahuKalam: daylightPart(sunrise, sunset, rahuOrdinals[weekday]),
    yamaganda: daylightPart(sunrise, sunset, yamagandaOrdinals[weekday]),
    gulika: daylightPart(sunrise, sunset, gulikaOrdinals[weekday]),
    brahmaMuhurta: { startUtc: iso(new Date(sunrise.getTime() - 96 * 60_000)), endUtc: iso(new Date(sunrise.getTime() - 48 * 60_000)) },
    abhijitMuhurta: { startUtc: iso(new Date(noon - abhijitHalf)), endUtc: iso(new Date(noon + abhijitHalf)) },
  };
}

export function calculatePanchang(request: PanchangRequest): PanchangFact | null {
  const sunrise = findSunrise(request);
  if (!sunrise) return null;
  const sunset = findSunset(request, sunrise);
  if (!sunset) return null;
  const moonrise = findLocalMoonEvent(request, +1);
  const moonset = findLocalMoonEvent(request, -1);
  const weekday = new Date(`${request.civilDate}T12:00:00.000Z`).getUTCDay();
  return {
    ok: true,
    request,
    engine: {
      id: "devam-panchang",
      version: ENGINE_VERSION,
      astronomyModel: "Astronomy Engine VSOP87/NOVAS-validated model",
      ayanamsha: "lahiri_mean_linear_v1",
      ayanamshaDegreesAtSunrise: Number(lahiriAyanamshaDegrees(sunrise).toFixed(9)),
      rulesetVersion: "panchanga-five-limbs-sunrise-v1",
      evidenceStatus: "astronomy_reference_fixture_validated",
    },
    sunriseUtc: iso(sunrise),
    sunsetUtc: iso(sunset),
    moonriseUtc: moonrise ? iso(moonrise) : null,
    moonsetUtc: moonset ? iso(moonset) : null,
    vara: { index: weekday + 1, name: VARA_NAMES[weekday] },
    tithi: tithiTransition(sunrise),
    nakshatra: indexedTransition(sunrise, nakshatraValue, NAKSHATRA_NAMES),
    yoga: indexedTransition(sunrise, yogaValue, YOGA_NAMES),
    karana: karanaTransition(sunrise),
    solarRashi: solarRashiTransition(sunrise),
    windows: windows(sunrise, sunset, weekday),
    boundaries: {
      calculationOnly: true,
      observanceRulesResolved: false,
      ritualGuidanceIncluded: false,
      note: "Astronomical Panchanga facts only. Festival assignment and ritual guidance require separately versioned tradition, region, and evidence rules.",
    },
  };
}
