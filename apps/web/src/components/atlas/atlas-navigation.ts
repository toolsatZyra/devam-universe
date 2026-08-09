export type AtlasDepth = "cosmos" | "world" | "constellation" | "encounter";

export const atlasDepthLabels: Record<AtlasDepth, string> = {
  cosmos: "Cosmos",
  world: "World",
  constellation: "Constellation",
  encounter: "Encounter",
};

export function resolveAtlasDepth(selected: boolean, scale: number): AtlasDepth {
  if (!selected) return "cosmos";
  if (scale < 1.58) return "world";
  if (scale < 2.48) return "constellation";
  return "encounter";
}

export function atlasNodeZoomCompensation(scale: number) {
  const safeScale = Math.max(.72, Math.min(3.8, scale));
  return Math.max(.62, Math.min(1.12, safeScale ** -.46));
}

export function advanceAtlasTrail(trail: string[], destinationId: string, maximum = 7) {
  if (!destinationId || trail.at(-1) === destinationId) return trail;
  const previousIndex = trail.lastIndexOf(destinationId);
  if (previousIndex >= 0) return trail.slice(0, previousIndex + 1);
  return [...trail, destinationId].slice(-maximum);
}
