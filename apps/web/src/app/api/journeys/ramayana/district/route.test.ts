import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("Ramayana district payload", () => {
  it("loads only the requested illustrated district with immutable deployment caching", async () => {
    const response = await GET(new Request("http://localhost/api/journeys/ramayana/district?district=ayodhya-exile-v1"));
    const payload = await response.json() as { ok: boolean; districtId: string; moments: Record<string, { beats: unknown[] }> };
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("immutable");
    expect(payload).toMatchObject({ ok: true, districtId: "ayodhya-exile-v1" });
    expect(Object.keys(payload.moments)).toEqual(["coronation-dawn", "manthara-sees-city", "fear-becomes-demands", "king-trapped-by-word", "rama-crosses-celebration", "rama-accepts-exile", "sita-chooses-road", "lakshmana-joins"]);
    expect(Object.values(payload.moments).flatMap((moment) => moment.beats)).toHaveLength(36);
  });

  it("fails closed for an unknown district", async () => {
    const response = await GET(new Request("http://localhost/api/journeys/ramayana/district?district=whole-epic"));
    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toMatchObject({ ok: false });
  });
});
