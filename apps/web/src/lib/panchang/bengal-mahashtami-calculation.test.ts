import { describe, expect, it } from "vitest";
import { calculatePanchang } from "./engine";

describe("Bengal Mahashtami deterministic calculation evidence", () => {
  it("freezes the Kolkata 2026 Ashtami and Navami transition used by the participant lane", () => {
    const fact = calculatePanchang({
      civilDate: "2026-10-19",
      latitude: 22.5726,
      longitude: 88.3639,
      timezone: "Asia/Kolkata",
      traditionCode: "shakta-bengal",
    });
    expect(fact?.tithi).toEqual({
      index: 8,
      name: "Ashtami",
      paksha: "shukla",
      endsAtUtc: "2026-10-19T05:22:53.313Z",
      nextIndex: 9,
      nextName: "Navami",
      nextPaksha: "shukla",
    });
    const transition = Date.parse(fact!.tithi.endsAtUtc);
    expect(new Date(transition - 24 * 60_000).toISOString()).toBe("2026-10-19T04:58:53.313Z");
    expect(new Date(transition + 24 * 60_000).toISOString()).toBe("2026-10-19T05:46:53.313Z");
  });
});
