import { describe, expect, it, vi } from "vitest";
import type { AtlasWorld } from "@/lib/domain/atlas";
import { ResilientAtlasRepository } from "./atlas-resilience";

const hostedWorld = { gateways: [{ id: "hosted" }] } as unknown as AtlasWorld;
const reviewedWorld = { gateways: [{ id: "reviewed" }] } as unknown as AtlasWorld;

describe("Resilient Atlas repository", () => {
  it("uses the hosted projection when it passes validation", async () => {
    const fallback = { getWorld: vi.fn(async () => reviewedWorld) };
    const repository = new ResilientAtlasRepository(
      { getWorld: vi.fn(async () => hostedWorld) },
      fallback,
    );

    await expect(repository.getWorld()).resolves.toBe(hostedWorld);
    expect(fallback.getWorld).not.toHaveBeenCalled();
  });

  it("keeps the Atlas available from reviewed local data when the hosted projection is stale", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const repository = new ResilientAtlasRepository(
      { getWorld: vi.fn(async () => { throw new Error("Expected five unique MVP gateways, received 4."); }) },
      { getWorld: vi.fn(async () => reviewedWorld) },
    );

    await expect(repository.getWorld()).resolves.toBe(reviewedWorld);
    expect(warning).toHaveBeenCalledWith(
      "[atlas] Hosted projection rejected; using the reviewed local universe.",
      { error: "Expected five unique MVP gateways, received 4." },
    );
    warning.mockRestore();
  });
});
