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
  family: WorldNodeFamily;
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

export const worldNodeFamilies = [
  "being_person",
  "event_story",
  "place_polity",
  "time_observance",
  "practice_material",
  "source_expression",
  "institution_community",
  "idea_wisdom",
  "art_culture",
  "historical_process",
] as const;

export type WorldNodeFamily = typeof worldNodeFamilies[number];

export const worldNodeFamilyLabels: Record<WorldNodeFamily, string> = {
  being_person: "Being & person",
  event_story: "Event & story",
  place_polity: "Place & polity",
  time_observance: "Time & observance",
  practice_material: "Practice & material",
  source_expression: "Source & expression",
  institution_community: "Community & institution",
  idea_wisdom: "Idea & wisdom",
  art_culture: "Art & culture",
  historical_process: "History in motion",
};

export function isWorldNodeFamily(value: unknown): value is WorldNodeFamily {
  return typeof value === "string" && worldNodeFamilies.includes(value as WorldNodeFamily);
}

export function inferWorldNodeFamily(kind: string): WorldNodeFamily {
  const value = kind.toLocaleLowerCase("en-IN");
  if (/historical|movement|transmission|reform|campaign/.test(value)) return "historical_process";
  if (/place|city|kingdom|polity|pilgrimage|peetha|hermitage|workshop/.test(value)) return "place_polity";
  if (/practice|material|food|image|symbol|offering|ritual|transition/.test(value)) return "practice_material";
  if (/community|institution|tradition|lineage|dynasty|pandal|sangh|guild/.test(value)) return "institution_community";
  if (/performance|theatre|art|music|dance|drumming|installation|architecture|craft/.test(value)) return "art_culture";
  if (/text|source|epic|edition|scriptur|purana|upanishad|book|work|reading/.test(value)) return "source_expression";
  if (/character|king|queen|figure|deity|goddess|sage|seeker|guide|name|form|pair|connector/.test(value)) return "being_person";
  if (/festival|observance|puja|day|sequence|cycle|rhythm|jayanti|chaturthi|navami|ashtami|purnima|amavasya|season/.test(value)) return "time_observance";
  if (/story|episode|battle|return|turning point|narrative/.test(value)) return "event_story";
  return "idea_wisdom";
}

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
