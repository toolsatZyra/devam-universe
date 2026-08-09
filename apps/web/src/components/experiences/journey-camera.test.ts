import { describe, expect, it } from "vitest";
import {
  JOURNEY_CAMERA_DEFAULT,
  JOURNEY_CAMERA_MAX_SCALE,
  JOURNEY_CAMERA_MIN_SCALE,
  constrainJourneyCamera,
  journeyCameraPercent,
  panJourneyCamera,
  pinchJourneyCamera,
  zoomJourneyCamera,
} from "./journey-camera";

const viewport = { width: 1000, height: 600 };

describe("Ramayana scene camera", () => {
  it("keeps zoom inside the intentional 2.5D depth range", () => {
    expect(zoomJourneyCamera(JOURNEY_CAMERA_DEFAULT, 0, viewport).scale).toBe(JOURNEY_CAMERA_MIN_SCALE);
    expect(zoomJourneyCamera(JOURNEY_CAMERA_DEFAULT, 8, viewport).scale).toBe(JOURNEY_CAMERA_MAX_SCALE);
    expect(journeyCameraPercent(1.236)).toBe(124);
  });

  it("constrains every edge symmetrically so a drag can always be reversed", () => {
    const positive = constrainJourneyCamera({ x: 10_000, y: 10_000, scale: 1.2 }, viewport);
    const negative = constrainJourneyCamera({ x: -10_000, y: -10_000, scale: 1.2 }, viewport);
    expect(positive.x).toBe(-negative.x);
    expect(positive.y).toBe(-negative.y);
    expect(positive.x).toBeGreaterThan(0);
    expect(positive.y).toBeGreaterThan(0);
  });

  it("allows keyboard-sized recovery after reaching either pan boundary", () => {
    const lowerRight = constrainJourneyCamera({ x: 10_000, y: 10_000, scale: 1.3 }, viewport);
    const recovered = panJourneyCamera(lowerRight, { x: -48, y: -48 }, viewport);
    expect(recovered.x).toBeLessThan(lowerRight.x);
    expect(recovered.y).toBeLessThan(lowerRight.y);
  });

  it("reconstrains an offset when zooming back out", () => {
    const deep = constrainJourneyCamera({ x: 180, y: -120, scale: 1.35 }, viewport);
    const resetDepth = zoomJourneyCamera(deep, 1, viewport);
    expect(Math.abs(resetDepth.x)).toBeLessThanOrEqual(50);
    expect(Math.abs(resetDepth.y)).toBeLessThanOrEqual(30);
  });

  it("turns a two-pointer distance and centroid change into bounded depth and pan", () => {
    const pinched = pinchJourneyCamera(JOURNEY_CAMERA_DEFAULT, 100, 125, { x: 30, y: -20 }, viewport);
    expect(pinched).toEqual({ x: 30, y: -20, scale: 1.25 });
    expect(pinchJourneyCamera(JOURNEY_CAMERA_DEFAULT, 0, 200, { x: 0, y: 0 }, viewport).scale).toBe(1);
  });
});
