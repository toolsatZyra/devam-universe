export type GatewayTone = "saffron" | "rose" | "moon" | "gold" | "violet";

export type Gateway = {
  id: "ramayana" | "ganesha" | "durga" | "diwali" | "sacred-time";
  title: string;
  devanagari: string;
  invitation: string;
  tone: GatewayTone;
  position: { x: number; y: number };
  threads: string[];
};

export type WorldNode = {
  id: string;
  label: string;
  kind: string;
  eras: string[];
  gatewayId: Gateway["id"];
  summary: string;
  searchQuery: string;
  evidenceBoundary: string;
  revealAt: number;
  size: "major" | "connected";
  position: { x: number; y: number };
  geography?: {
    position: { x: number; y: number };
    region: string;
  };
};

export type WorldEdge = {
  id: string;
  from: string;
  to: string;
  relation: string;
  relationKind: WorldRelationKind;
  evidenceBoundary?: string;
  sourceRef?: string;
};

export const worldRelationKinds = [
  "story",
  "festival",
  "practice",
  "text",
  "place",
  "kinship",
  "identity",
  "time",
  "history",
  "teaching",
  "association",
] as const;

export type WorldRelationKind = typeof worldRelationKinds[number];

export const worldRelationLabels: Record<WorldRelationKind, string> = {
  story: "Story path",
  festival: "Festival bridge",
  practice: "Living practice",
  text: "Source trail",
  place: "Place route",
  kinship: "Family bond",
  identity: "Form & identity",
  time: "Time path",
  history: "History route",
  teaching: "Idea path",
  association: "Connected world",
};

export function isWorldRelationKind(value: unknown): value is WorldRelationKind {
  return typeof value === "string" && worldRelationKinds.includes(value as WorldRelationKind);
}

export function inferWorldRelationKind(relation: string): WorldRelationKind {
  const value = relation.toLocaleLowerCase("en-IN");
  if (/history|historical|1893|movement|populari[sz]ed|public ganeshotsav/.test(value)) return "history";
  if (/father|mother|son of|daughter|sibling|family bond|family of/.test(value)) return "kinship";
  if (/story|narrative|episode|battle|abduct|alliance|journey|crossing|return|homeward|birth|awakening|boon|dialogue/.test(value)) return "story";
  if (/source|scriptur|text|edition|chapter|kanda|kāṇḍa|reading|translation|hymn|purana|upanishad/.test(value)) return "text";
  if (/place|city|kingdom|pilgrimage|route|lands in|arrives|kashi|kolkata|bengal context|mithila|ayodhya|lanka/.test(value)) return "place";
  if (/same night|date|calendar|season|cycle|window|lunar|solar|rhythm|month|annual|september|december/.test(value)) return "time";
  if (/festival|puja|pūjā|chaturthi|ganeshotsav|navaratri|deepavali|diwali|visarjan|pandal|jayanti|observance/.test(value)) return "festival";
  if (/practice|worship|recitation|offering|arati|ritual|meditat|devotion|remembrance|vrata|household/.test(value)) return "practice";
  if (/form|identity|goddess|deity|named|manifest|bridge|avatar|aspect|one-tusked/.test(value)) return "identity";
  if (/wisdom|teaching|dharma|principle|meaning|idea|counsel/.test(value)) return "teaching";
  return "association";
}

export type PlaceThread = {
  gatewayId: Gateway["id"];
  title: string;
  invitation: string;
  evidenceBoundary: string;
  nodeIds: string[];
};

export type AtlasWorld = {
  eras: readonly string[];
  gateways: Gateway[];
  placeThreads: PlaceThread[];
  worldNodes: WorldNode[];
  worldEdges: WorldEdge[];
};
