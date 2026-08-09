import { describe, expect, it } from "vitest";
import { journeyProgressKey, shouldApplyRestoredJourneyPosition } from "./journey-progress";

describe("journey progress restoration", () => {
  it("uses a stable per-journey storage key", () => {
    expect(journeyProgressKey("ramayana")).toBe("devam-journey-progress:ramayana");
  });

  it("never overwrites a world the visitor entered while restoration was pending", () => {
    expect(shouldApplyRestoredJourneyPosition(false, 8)).toBe(true);
    expect(shouldApplyRestoredJourneyPosition(true, 8)).toBe(false);
    expect(shouldApplyRestoredJourneyPosition(false, -1)).toBe(false);
  });
});
