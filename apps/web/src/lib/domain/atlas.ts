export type GatewayTone = "saffron" | "rose" | "moon" | "gold";

export type Gateway = {
  id: "ramayana" | "ganesha" | "durga" | "diwali";
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
};

export type WorldEdge = {
  id: string;
  from: string;
  to: string;
  relation: string;
};

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
