import { describe, expect, it } from "vitest";
import { validatePanchangRequest } from "./contracts";

describe("validatePanchangRequest", () => {
  it("requires location, timezone, date, and tradition", () => {
    expect(validatePanchangRequest({})).toEqual({
      ok: false,
      code: "NEEDS_CONTEXT",
      issues: [
        "civilDate is required.",
        "latitude is required.",
        "longitude is required.",
        "timezone is required.",
        "traditionCode is required.",
      ],
    });
  });

  it("accepts a complete deterministic input", () => {
    const result = validatePanchangRequest({
      civilDate: "2026-09-14",
      latitude: 19.076,
      longitude: 72.8777,
      timezone: "Asia/Kolkata",
      traditionCode: "smarta-west-india",
    });
    expect(result.ok).toBe(true);
  });

  it("rejects rollover dates and invalid coordinates", () => {
    const result = validatePanchangRequest({
      civilDate: "2026-02-30",
      latitude: 91,
      longitude: 181,
      timezone: "Mars/Olympus",
      traditionCode: "x",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("INVALID_CONTEXT");
  });
});
