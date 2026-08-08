export type AtlasPoint = { x: number; y: number };
export type AtlasView = { x: number; y: number; scale: number };

export const ATLAS_MIN_SCALE = 0.72;
export const ATLAS_MAX_SCALE = 3.8;

export type AtlasViewport = {
  width: number;
  height: number;
  sceneWidth: number;
  sceneHeight: number;
};

export function clampAtlasScale(scale: number) {
  return Math.min(ATLAS_MAX_SCALE, Math.max(ATLAS_MIN_SCALE, scale));
}

export function constrainAtlasView(next: AtlasView, viewport?: AtlasViewport): AtlasView {
  const scale = clampAtlasScale(next.scale);
  if (!viewport || viewport.width <= 0 || viewport.height <= 0 || viewport.sceneWidth <= 0 || viewport.sceneHeight <= 0) {
    return { ...next, scale };
  }

  // A generous edge allowance lets every outer constellation be centred while
  // preventing the navigable world from being thrown completely off-screen.
  const allowanceX = viewport.width * 0.38;
  const allowanceY = viewport.height * 0.38;
  const scaledWidth = viewport.sceneWidth * scale;
  const scaledHeight = viewport.sceneHeight * scale;
  const minimumX = Math.min(allowanceX, viewport.width - scaledWidth - allowanceX);
  const minimumY = Math.min(allowanceY, viewport.height - scaledHeight - allowanceY);

  return {
    x: Math.min(allowanceX, Math.max(minimumX, next.x)),
    y: Math.min(allowanceY, Math.max(minimumY, next.y)),
    scale,
  };
}

export function focusAtlasPosition(position: AtlasPoint, scale: number, viewport: AtlasViewport): AtlasView {
  const boundedScale = clampAtlasScale(scale);
  return constrainAtlasView({
    x: viewport.width / 2 - viewport.sceneWidth * (position.x / 100) * boundedScale,
    y: viewport.height / 2 - viewport.sceneHeight * (position.y / 100) * boundedScale,
    scale: boundedScale,
  }, viewport);
}
