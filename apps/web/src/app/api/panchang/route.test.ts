import { describe, expect, it } from "vitest";
import { POST } from "./route";

function request(body: unknown) {
  return new Request("http://localhost/api/panchang", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/panchang", () => {
  it("returns a deterministic, calculation-only Panchang fact", async () => {
    const response = await POST(
      request({
        civilDate: "2026-09-14",
        latitude: 19.076,
        longitude: 72.8777,
        timezone: "Asia/Kolkata",
        traditionCode: "smarta-west-india",
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("private, max-age=0, must-revalidate");
    expect(body).toMatchObject({
      ok: true,
      engine: {
        version: "astronomy-engine-2.1.19-lahiri-v3",
        ayanamsha: "lahiri_mean_linear_v1",
      },
      tithi: { index: 3, name: "Tritiya", nextIndex: 4, nextName: "Chaturthi" },
      solarRashi: { name: "Simha", nextName: "Kanya" },
      boundaries: {
        calculationOnly: true,
        observanceRulesResolved: false,
        ritualGuidanceIncluded: false,
      },
    });
    expect(body.moonriseUtc).toMatch(/^2026-09-14T/);
    expect(body.moonsetUtc).toMatch(/^2026-09-14T/);
  });

  it("rejects an incomplete calculation context", async () => {
    const response = await POST(request({ civilDate: "2026-09-14" }));
    const body = await response.json();

    expect(response.status).toBe(422);
    expect(body.ok).toBe(false);
    expect(body.code).toBe("NEEDS_CONTEXT");
  });
});
