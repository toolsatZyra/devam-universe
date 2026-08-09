import { describe, expect, it } from "vitest";
import { ATLAS_MAX_SCALE, ATLAS_MIN_SCALE, constrainAtlasView, focusAtlasPosition } from "./atlas-camera";

const desktop = { width: 1440, height: 900, sceneWidth: 1757, sceneHeight: 1080 };

describe("Atlas camera bounds", () => {
  it("clamps scale and both pan axes instead of allowing the world to become lost", () => {
    expect(constrainAtlasView({ x: 99_000, y: 99_000, scale: 99 }, desktop)).toEqual({
      x: desktop.width * 0.38,
      y: desktop.height * 0.38,
      scale: ATLAS_MAX_SCALE,
    });
    const far = constrainAtlasView({ x: -99_000, y: -99_000, scale: 0.01 }, desktop);
    expect(far.scale).toBe(ATLAS_MIN_SCALE);
    expect(far.x).toBeGreaterThan(-desktop.sceneWidth);
    expect(far.y).toBeGreaterThan(-desktop.sceneHeight);
  });

  it("can centre nodes at every edge without escaping the reversible world bounds", () => {
    for (const position of [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 0, y: 100 }, { x: 100, y: 100 }]) {
      const focused = focusAtlasPosition(position, 2.2, desktop);
      expect(focused).toEqual(constrainAtlasView(focused, desktop));
      expect(focused.scale).toBe(2.2);
    }
  });

  it("can stage a focused node in the upper third to preserve mobile encounter space", () => {
    const mobile = { width: 390, height: 844, sceneWidth: 780, sceneHeight: 1_688 };
    const focused = focusAtlasPosition({ x: 50, y: 50 }, 1.34, mobile, { x: 0.5, y: 0.32 });
    expect(focused).toEqual(constrainAtlasView(focused, mobile));
    expect(focused.y).toBeLessThan(844 / 2 - 1_688 * 0.5 * 1.34);
  });
});
