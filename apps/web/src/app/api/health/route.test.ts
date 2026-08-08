import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("GET /api/health", () => {
  it("returns a non-cached, non-claiming development liveness result", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const response = await GET();
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(result).toMatchObject({ contract: "DEVAM_RUNTIME_READINESS_V1", ok: true, status: "development" });
    expect(result.boundaries).toEqual({ databaseConnectivityProven: false, authEmailDeliveryProven: false, deployedBrowserAcceptanceProven: false, sourceVaultReadOrCopied: false });
  });
});
