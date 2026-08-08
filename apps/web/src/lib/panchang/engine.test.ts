import { describe, expect, it } from "vitest";
import { calculatePanchang, calculateTithiAtInstant, lahiriAyanamshaDegrees } from "./engine";

const minute = 60_000;

function expectWithin(actualIso: string, expectedIso: string, toleranceMinutes: number) {
  expect(Math.abs(Date.parse(actualIso) - Date.parse(expectedIso))).toBeLessThanOrEqual(toleranceMinutes * minute);
}

describe("deterministic Panchang engine", () => {
  it("matches the independently published Mumbai Ganesh Chaturthi boundary", () => {
    const fact = calculatePanchang({
      civilDate: "2026-09-14",
      latitude: 19.076,
      longitude: 72.8777,
      timezone: "Asia/Kolkata",
      traditionCode: "smarta-west-india",
    });
    expect(fact).not.toBeNull();
    expect(fact?.vara).toEqual({ index: 2, name: "Somavara" });
    expect(fact?.tithi).toMatchObject({ index: 3, name: "Tritiya", paksha: "shukla", nextIndex: 4, nextName: "Chaturthi" });
    expectWithin(fact!.tithi.endsAtUtc, "2026-09-14T01:36:00.000Z", 4);
    expect(fact?.nakshatra).toMatchObject({ index: 14, name: "Chitra", nextIndex: 15, nextName: "Swati" });
    expectWithin(fact!.nakshatra.endsAtUtc, "2026-09-14T08:25:00.000Z", 4);
    expect(fact?.yoga).toMatchObject({ index: 25, name: "Brahma", nextIndex: 26, nextName: "Indra" });
    expectWithin(fact!.yoga.endsAtUtc, "2026-09-14T07:16:00.000Z", 4);
  });

  it("is deterministic, location-aware, and keeps observance logic separate", () => {
    const request = {
      civilDate: "2026-09-14",
      latitude: 17.385,
      longitude: 78.4867,
      timezone: "Asia/Kolkata",
      traditionCode: "smarta-south-india",
    } as const;
    const first = calculatePanchang(request);
    const second = calculatePanchang(request);
    expect(first).toEqual(second);
    expectWithin(first!.sunriseUtc, "2026-09-14T00:37:00.000Z", 5);
    expectWithin(first!.sunsetUtc, "2026-09-14T12:45:00.000Z", 5);
    expect(first?.tithi.index).toBe(3);
    expect(first?.nakshatra.name).toBe("Chitra");
    expect(first?.yoga.name).toBe("Brahma");
    expect(first?.boundaries).toEqual({
      calculationOnly: true,
      observanceRulesResolved: false,
      ritualGuidanceIncluded: false,
      note: "Astronomical Panchanga facts only. Festival assignment and ritual guidance require separately versioned tradition, region, and evidence rules.",
    });
  });

  it("keeps the versioned Lahiri approximation stable", () => {
    expect(lahiriAyanamshaDegrees(new Date("2000-01-01T12:00:00.000Z"))).toBe(23.85675);
    expect(lahiriAyanamshaDegrees(new Date("2026-09-14T00:55:54.450Z"))).toBeCloseTo(24.229763, 5);
  });

  it("names the thirtieth tithi Amavasya rather than reusing the Purnima label", () => {
    const fact = calculatePanchang({
      civilDate: "2026-11-09",
      latitude: 28.6139,
      longitude: 77.209,
      timezone: "Asia/Kolkata",
      traditionCode: "smarta-north-india",
    });
    expect(fact?.tithi).toMatchObject({ index: 30, name: "Amavasya", paksha: "krishna", nextIndex: 1, nextName: "Pratipada" });
  });

  it("calculates an exact tithi identity at an arbitrary rule-decision instant", () => {
    expect(calculateTithiAtInstant("2026-11-20T01:00:00.000Z")).toMatchObject({ index: 10, name: "Dashami", paksha: "shukla" });
    expect(calculateTithiAtInstant("2026-11-20T02:00:00.000Z")).toMatchObject({ index: 11, name: "Ekadashi", paksha: "shukla" });
    expect(() => calculateTithiAtInstant("not-an-instant")).toThrow("valid instant");
  });

  it("matches the independently observed Delhi Karwa Chauth moonrise fixture", () => {
    const fact = calculatePanchang({
      civilDate: "2026-10-29",
      latitude: 28.6139,
      longitude: 77.209,
      timezone: "Asia/Kolkata",
      traditionCode: "smarta-north-india",
    });
    expect(fact?.moonriseUtc).not.toBeNull();
    expectWithin(fact!.moonriseUtc!, "2026-10-29T14:47:00.000Z", 7);
    expect(fact?.moonsetUtc).not.toBeNull();
  });

  it("matches all four launch-window sidereal solar ingresses", () => {
    const fixtures = [
      ["2026-09-17", "Simha", "Kanya", "2026-09-17T02:28:00.000Z"],
      ["2026-10-17", "Kanya", "Tula", "2026-10-17T14:27:00.000Z"],
      ["2026-11-16", "Tula", "Vrishchika", "2026-11-16T14:18:00.000Z"],
      ["2026-12-16", "Vrishchika", "Dhanu", "2026-12-16T04:59:00.000Z"],
    ];
    for (const [civilDate, currentName, nextName, expectedIngressUtc] of fixtures) {
      const fact = calculatePanchang({ civilDate, latitude: 28.6139, longitude: 77.209, timezone: "Asia/Kolkata", traditionCode: "smarta-north-india" });
      expect(fact?.solarRashi).toMatchObject({ name: currentName, nextName });
      expectWithin(fact!.solarRashi.endsAtUtc, expectedIngressUtc, 10);
    }
  });

  it("has no astronomical calculation gaps across the complete September-December launch window", () => {
    const start = Date.UTC(2026, 8, 1);
    const end = Date.UTC(2026, 11, 31);
    let count = 0;
    let datesWithoutMoonrise = 0;
    let datesWithoutMoonset = 0;
    const localDate = (iso: string) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso));

    for (let cursor = start; cursor <= end; cursor += 24 * 60 * minute) {
      const civilDate = new Date(cursor).toISOString().slice(0, 10);
      const fact = calculatePanchang({
        civilDate,
        latitude: 22.5726,
        longitude: 88.3639,
        timezone: "Asia/Kolkata",
        traditionCode: "smarta-east-india",
      });

      expect(fact?.request.civilDate).toBe(civilDate);
      expect(Date.parse(fact!.sunsetUtc)).toBeGreaterThan(Date.parse(fact!.sunriseUtc));
      if (fact!.moonriseUtc) expect(localDate(fact!.moonriseUtc)).toBe(civilDate);
      else datesWithoutMoonrise += 1;
      if (fact!.moonsetUtc) expect(localDate(fact!.moonsetUtc)).toBe(civilDate);
      else datesWithoutMoonset += 1;
      expect(Date.parse(fact!.tithi.endsAtUtc)).toBeGreaterThan(Date.parse(fact!.sunriseUtc));
      expect(Date.parse(fact!.nakshatra.endsAtUtc)).toBeGreaterThan(Date.parse(fact!.sunriseUtc));
      expect(Date.parse(fact!.yoga.endsAtUtc)).toBeGreaterThan(Date.parse(fact!.sunriseUtc));
      expect(Date.parse(fact!.karana.endsAtUtc)).toBeGreaterThan(Date.parse(fact!.sunriseUtc));
      expect(Date.parse(fact!.solarRashi.endsAtUtc)).toBeGreaterThan(Date.parse(fact!.sunriseUtc));
      count += 1;
    }

    expect(count).toBe(122);
    expect(datesWithoutMoonrise).toBeLessThanOrEqual(5);
    expect(datesWithoutMoonset).toBeLessThanOrEqual(5);
  });
});
