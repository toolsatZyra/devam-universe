export type JourneyCameraView = {
  x: number;
  y: number;
  scale: number;
};

export type JourneyCameraViewport = {
  width: number;
  height: number;
};

export const JOURNEY_CAMERA_MIN_SCALE = 1;
export const JOURNEY_CAMERA_MAX_SCALE = 1.35;
export const JOURNEY_CAMERA_DEFAULT: JourneyCameraView = { x: 0, y: 0, scale: 1 };

export function clampJourneyCameraScale(scale: number) {
  return Math.min(JOURNEY_CAMERA_MAX_SCALE, Math.max(JOURNEY_CAMERA_MIN_SCALE, scale));
}

function journeyCameraAllowance(size: number, scale: number) {
  // The backdrop already overscans its viewport by five percent. Additional
  // allowance grows with zoom so every move remains reversible without
  // exposing an empty edge around the world.
  return size * (.05 + (scale - JOURNEY_CAMERA_MIN_SCALE) * .45);
}

export function constrainJourneyCamera(
  next: JourneyCameraView,
  viewport?: JourneyCameraViewport,
): JourneyCameraView {
  const scale = clampJourneyCameraScale(next.scale);
  if (!viewport || viewport.width <= 0 || viewport.height <= 0) {
    return { ...next, scale };
  }

  const allowanceX = journeyCameraAllowance(viewport.width, scale);
  const allowanceY = journeyCameraAllowance(viewport.height, scale);
  return {
    x: Math.min(allowanceX, Math.max(-allowanceX, next.x)),
    y: Math.min(allowanceY, Math.max(-allowanceY, next.y)),
    scale,
  };
}

export function panJourneyCamera(
  current: JourneyCameraView,
  delta: { x: number; y: number },
  viewport?: JourneyCameraViewport,
) {
  return constrainJourneyCamera({ ...current, x: current.x + delta.x, y: current.y + delta.y }, viewport);
}

export function zoomJourneyCamera(
  current: JourneyCameraView,
  scale: number,
  viewport?: JourneyCameraViewport,
) {
  return constrainJourneyCamera({ ...current, scale }, viewport);
}

export function pinchJourneyCamera(
  start: JourneyCameraView,
  startDistance: number,
  currentDistance: number,
  centerDelta: { x: number; y: number },
  viewport?: JourneyCameraViewport,
) {
  const ratio = startDistance > 0 ? currentDistance / startDistance : 1;
  return constrainJourneyCamera({
    x: start.x + centerDelta.x,
    y: start.y + centerDelta.y,
    scale: start.scale * ratio,
  }, viewport);
}

export function journeyCameraPercent(scale: number) {
  return Math.round(clampJourneyCameraScale(scale) * 100);
}
