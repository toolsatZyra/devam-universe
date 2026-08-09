import { describe, expect, it } from "vitest";
import { advanceAtlasTrail, atlasNodeZoomCompensation, preferAtlasEdgeForAnchor, resolveAtlasDepth } from "./atlas-navigation";

describe("Living Atlas game navigation", () => {
  it("exposes progressive depth without calling an unselected view an encounter", () => {
    expect(resolveAtlasDepth(false, 3.8)).toBe("cosmos");
    expect(resolveAtlasDepth(true, 1.34)).toBe("world");
    expect(resolveAtlasDepth(true, 1.9)).toBe("constellation");
    expect(resolveAtlasDepth(true, 2.8)).toBe("encounter");
  });

  it("keeps landmarks legible without scaling them linearly with the whole scene", () => {
    expect(atlasNodeZoomCompensation(.72)).toBeGreaterThan(1);
    expect(atlasNodeZoomCompensation(1)).toBe(1);
    expect(atlasNodeZoomCompensation(3.8)).toBeGreaterThanOrEqual(.62);
    expect(atlasNodeZoomCompensation(3.8)).toBeLessThan(.7);
  });

  it("keeps a bounded travel trail and naturally backtracks to an earlier discovery", () => {
    let trail: string[] = [];
    for (const id of ["ramayana", "kishkindha-story-world", "kishkindha-living-landscape", "anegundi", "hampi-world-heritage"]) {
      trail = advanceAtlasTrail(trail, id, 4);
    }
    expect(trail).toEqual(["kishkindha-story-world", "kishkindha-living-landscape", "anegundi", "hampi-world-heritage"]);
    expect(advanceAtlasTrail(trail, "anegundi", 4)).toEqual(["kishkindha-story-world", "kishkindha-living-landscape", "anegundi"]);
  });

  it("prefers the relation that originates at the current node when both directions exist", () => {
    const incoming = { from: "kashi", to: "ramnagar-ramlila" };
    const outgoing = { from: "ramnagar-ramlila", to: "kashi" };

    expect(preferAtlasEdgeForAnchor(incoming, outgoing, "ramnagar-ramlila")).toBe(true);
    expect(preferAtlasEdgeForAnchor(outgoing, incoming, "ramnagar-ramlila")).toBe(false);
  });
});
