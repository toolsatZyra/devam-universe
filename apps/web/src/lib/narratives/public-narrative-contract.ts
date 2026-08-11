export type PublicNarrativeBeat = {
  slug: string;
  ordinal: number;
  title: string;
  narration: string;
  visualDirection: Record<string, unknown>;
};

export type PublicNarrativeConnection = {
  kind: "precedes" | "character_path" | "place_echo" | "parallel_thread";
  labels: string[];
  direction: "forward" | "backward";
  momentSlug: string;
  momentKind: "backbone_turn" | "playable_scene";
  backboneOrdinal: number;
  detailOrdinal: number;
  title: string;
};

export type PublicNarrativeLivingConnection = {
  kind: "festival" | "performance" | "devotional_text" | "practice" | "place" | "history";
  label: string;
  nodeSlug: string;
  title: string;
  nodeKind: string;
  summary: string;
  gatewayId: string;
};

export type PublicNarrativeMoment = {
  slug: string;
  kind: "backbone_turn" | "playable_scene";
  backboneOrdinal: number;
  turnOrdinalInArc: number;
  detailOrdinal: number;
  parentSlug: string | null;
  title: string;
  synopsis: string;
  narrative: string;
  visualDirection: Record<string, unknown>;
  characters: string[];
  places: string[];
  threads: string[];
  connections: PublicNarrativeConnection[];
  livingConnections: PublicNarrativeLivingConnection[];
  beats: PublicNarrativeBeat[];
};

export type PublicNarrativeArc = {
  slug: string;
  ordinal: number;
  title: string;
  invitation: string;
  moments: PublicNarrativeMoment[];
};

export type PublicNarrativeSeries = {
  series: {
    slug: string;
    title: string;
    kind: string;
    totalSourceUnits: number | null;
    coverageState: string;
  };
  arcs: PublicNarrativeArc[];
};

function record(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} is not an object.`);
  return value as Record<string, unknown>;
}

function text(value: unknown, label: string, maximum = 20_000): string {
  if (typeof value !== "string" || !value.trim() || value.length > maximum) {
    throw new Error(`${label} is not a bounded non-empty string.`);
  }
  return value;
}

function slug(value: unknown, label: string): string {
  const parsed = text(value, label, 120);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(parsed)) throw new Error(`${label} is not a slug.`);
  return parsed;
}

function positiveInteger(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) throw new Error(`${label} is not positive.`);
  return value;
}

function nonnegativeInteger(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) throw new Error(`${label} is negative.`);
  return value;
}

function array(value: unknown, label: string, maximum: number): unknown[] {
  if (!Array.isArray(value) || value.length > maximum) throw new Error(`${label} is not a bounded array.`);
  return value;
}

function textArray(value: unknown, label: string, maximum: number): string[] {
  return array(value, label, maximum).map((entry) => text(entry, `${label} entry`, 200));
}

function narrativeConnection(value: unknown): PublicNarrativeConnection {
  const item = record(value, "narrative connection");
  if (!"precedes character_path place_echo parallel_thread".split(" ").some((kind) => kind === item.kind)) {
    throw new Error("Narrative connection kind is invalid.");
  }
  if (item.direction !== "forward" && item.direction !== "backward") {
    throw new Error("Narrative connection direction is invalid.");
  }
  if (item.momentKind !== "backbone_turn" && item.momentKind !== "playable_scene") {
    throw new Error("Narrative connection moment kind is invalid.");
  }
  return {
    kind: item.kind as PublicNarrativeConnection["kind"],
    labels: textArray(item.labels, "narrative connection labels", 12),
    direction: item.direction,
    momentSlug: slug(item.momentSlug, "narrative connection moment slug"),
    momentKind: item.momentKind,
    backboneOrdinal: positiveInteger(item.backboneOrdinal, "narrative connection backbone ordinal"),
    detailOrdinal: nonnegativeInteger(item.detailOrdinal, "narrative connection detail ordinal"),
    title: text(item.title, "narrative connection title", 300),
  };
}

function livingConnection(value: unknown): PublicNarrativeLivingConnection {
  const item = record(value, "living Atlas connection");
  if (!"festival performance devotional_text practice place history".split(" ").some((kind) => kind === item.kind)) {
    throw new Error("Living Atlas connection kind is invalid.");
  }
  return {
    kind: item.kind as PublicNarrativeLivingConnection["kind"],
    label: text(item.label, "living Atlas connection label", 300),
    nodeSlug: slug(item.nodeSlug, "living Atlas connection node slug"),
    title: text(item.title, "living Atlas connection title", 300),
    nodeKind: text(item.nodeKind, "living Atlas connection node kind", 120),
    summary: text(item.summary, "living Atlas connection summary", 2_000),
    gatewayId: slug(item.gatewayId, "living Atlas connection gateway"),
  };
}

function beat(value: unknown): PublicNarrativeBeat {
  const item = record(value, "narrative beat");
  return {
    slug: slug(item.slug, "narrative beat slug"),
    ordinal: positiveInteger(item.ordinal, "narrative beat ordinal"),
    title: text(item.title, "narrative beat title", 300),
    narration: text(item.narration, "narrative beat narration"),
    visualDirection: record(item.visualDirection, "narrative beat visual direction"),
  };
}

function moment(value: unknown): PublicNarrativeMoment {
  const item = record(value, "narrative moment");
  if (item.kind !== "backbone_turn" && item.kind !== "playable_scene") {
    throw new Error("Narrative moment kind is invalid.");
  }
  const parentSlug = item.parentSlug === null ? null : slug(item.parentSlug, "narrative parent slug");
  const detailOrdinal = nonnegativeInteger(item.detailOrdinal, "narrative detail ordinal");
  if (
    (item.kind === "backbone_turn" && (parentSlug !== null || detailOrdinal !== 0))
    || (item.kind === "playable_scene" && (parentSlug === null || detailOrdinal < 1))
  ) {
    throw new Error("Narrative moment hierarchy is inconsistent.");
  }
  const beats = array(item.beats, "narrative beats", 24).map(beat);
  const connections = array(item.connections, "narrative connections", 80).map(narrativeConnection);
  const livingConnections = array(item.livingConnections, "living Atlas connections", 12).map(livingConnection);
  if (item.kind === "playable_scene" && beats.length < 3) throw new Error("Playable narrative scene has too few beats.");
  if (item.kind === "backbone_turn" && beats.length !== 0) throw new Error("Backbone narrative turn unexpectedly contains beats.");
  return {
    slug: slug(item.slug, "narrative moment slug"),
    kind: item.kind,
    backboneOrdinal: positiveInteger(item.backboneOrdinal, "narrative backbone ordinal"),
    turnOrdinalInArc: positiveInteger(item.turnOrdinalInArc, "narrative turn ordinal"),
    detailOrdinal,
    parentSlug,
    title: text(item.title, "narrative moment title", 300),
    synopsis: text(item.synopsis, "narrative moment synopsis", 2_000),
    narrative: text(item.narrative, "narrative moment copy"),
    visualDirection: record(item.visualDirection, "narrative moment visual direction"),
    characters: textArray(item.characters, "narrative characters", 80),
    places: textArray(item.places, "narrative places", 80),
    threads: textArray(item.threads, "narrative threads", 40),
    connections,
    livingConnections,
    beats,
  };
}

function arc(value: unknown): PublicNarrativeArc {
  const item = record(value, "narrative arc");
  const moments = array(item.moments, "narrative moments", 400).map(moment);
  if (!moments.length) throw new Error("Narrative arc has no published moments.");
  const momentBySlug = new Map(moments.map((candidate) => [candidate.slug, candidate]));
  if (momentBySlug.size !== moments.length) throw new Error("Narrative arc contains duplicate moment slugs.");
  for (const candidate of moments.filter((entry) => entry.kind === "playable_scene")) {
    const parent = candidate.parentSlug ? momentBySlug.get(candidate.parentSlug) : undefined;
    if (!parent
      || parent.kind !== "backbone_turn"
      || parent.backboneOrdinal !== candidate.backboneOrdinal
      || parent.turnOrdinalInArc !== candidate.turnOrdinalInArc) {
      throw new Error("Playable narrative scene is detached from its backbone turn.");
    }
  }
  return {
    slug: slug(item.slug, "narrative arc slug"),
    ordinal: positiveInteger(item.ordinal, "narrative arc ordinal"),
    title: text(item.title, "narrative arc title", 300),
    invitation: text(item.invitation, "narrative arc invitation", 1_000),
    moments,
  };
}

export function parsePublicNarrativeSeries(value: unknown): PublicNarrativeSeries | null {
  if (value === null) return null;
  const root = record(value, "public narrative response");
  const series = record(root.series, "public narrative series");
  const totalSourceUnits = series.totalSourceUnits;
  if (totalSourceUnits !== null && (typeof totalSourceUnits !== "number" || !Number.isInteger(totalSourceUnits) || totalSourceUnits < 1)) {
    throw new Error("Narrative source-unit count is invalid.");
  }
  const arcs = array(root.arcs, "public narrative arcs", 20).map(arc);
  if (!arcs.length) throw new Error("Public narrative has no arcs.");
  if (new Set(arcs.map((entry) => entry.slug)).size !== arcs.length) {
    throw new Error("Public narrative contains duplicate arc slugs.");
  }
  return {
    series: {
      slug: slug(series.slug, "public narrative series slug"),
      title: text(series.title, "public narrative series title", 300),
      kind: text(series.kind, "public narrative kind", 80),
      totalSourceUnits,
      coverageState: text(series.coverageState, "public narrative coverage state", 120),
    },
    arcs,
  };
}
