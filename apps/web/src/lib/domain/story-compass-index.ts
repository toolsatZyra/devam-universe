import type {
  StoryCompass,
  StoryCompassIndexes,
  StoryCompassPath,
  StoryCompassPathKind,
  StoryCompassTurn,
} from "./story-world";

const valuesByKind: Record<StoryCompassPathKind, (turn: StoryCompassTurn) => string[]> = {
  place: (turn) => turn.places,
  character: (turn) => turn.characters,
  thread: (turn) => turn.threads,
};

function pathSlug(value: string) {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "path";
}

function orderedTurnIds(compass: StoryCompass) {
  return compass.arcs.flatMap((arc) => arc.turnIds);
}

/**
 * Builds lightweight traversal indexes from the canonical story turns. Object
 * insertion order follows first narrative appearance; every path follows the
 * global story order. No second hand-maintained story graph is introduced.
 */
export function buildStoryCompassIndexes(compass: StoryCompass): StoryCompassIndexes {
  const indexes: StoryCompassIndexes = { place: {}, character: {}, thread: {} };

  for (const turnId of orderedTurnIds(compass)) {
    const turn = compass.turns[turnId];
    if (!turn) throw new Error(`Story compass references missing turn: ${turnId}`);

    for (const kind of Object.keys(valuesByKind) as StoryCompassPathKind[]) {
      const seenInTurn = new Set<string>();
      for (const rawValue of valuesByKind[kind](turn)) {
        const label = rawValue.trim();
        const canonicalLabel = label.toLocaleLowerCase("en");
        if (!label || seenInTurn.has(canonicalLabel)) continue;
        seenInTurn.add(canonicalLabel);

        const id = `${kind}:${pathSlug(label)}`;
        const existing = indexes[kind][id];
        if (existing && existing.label.toLocaleLowerCase("en") !== canonicalLabel) {
          throw new Error(`Story compass path id collision: ${id}`);
        }
        if (existing) existing.turnIds.push(turnId);
        else indexes[kind][id] = { id, kind, label, turnIds: [turnId] };
      }
    }
  }

  return indexes;
}

export function getStoryCompassPath(
  indexes: StoryCompassIndexes,
  kind: StoryCompassPathKind,
  label: string,
) {
  const canonicalLabel = label.trim().toLocaleLowerCase("en");
  return Object.values(indexes[kind]).find(
    (path) => path.label.toLocaleLowerCase("en") === canonicalLabel,
  );
}

export function getStoryCompassPathById(
  indexes: StoryCompassIndexes,
  pathId: string | undefined,
): StoryCompassPath | undefined {
  if (!pathId) return undefined;
  const kind = pathId.split(":", 1)[0] as StoryCompassPathKind;
  return indexes[kind]?.[pathId];
}
