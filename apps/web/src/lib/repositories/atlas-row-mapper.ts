import type { AtlasWorld, Gateway, GatewayTone, WorldEdge, WorldNode } from "@/lib/domain/atlas";
import type { Tables } from "@/lib/supabase/database.types";
import { gateways as fallbackGateways, placeThreads, worldEdges as fallbackWorldEdges, worldNodes as fallbackWorldNodes } from "../../data/atlas";

export type AtlasNodeRow = Pick<Tables<"atlas_nodes">, "id" | "slug" | "title" | "subtitle" | "node_kind" | "is_gateway" | "position" | "visual" | "reveal_at">;
export type AtlasEdgeRow = Pick<Tables<"atlas_edges">, "id" | "source_node_id" | "target_node_id" | "label" | "visual">;

const ERAS = ["Origins", "Epics", "Classical", "Medieval", "Living"] as const;
const FALLBACK_WORLD_NODE_BY_ID = new Map(fallbackWorldNodes.map((node) => [node.id, node]));
const FALLBACK_GATEWAY_BY_ID = new Map(fallbackGateways.map((item) => [item.id, item]));
const REVIEWED_NODE_SLUGS = new Set([...FALLBACK_GATEWAY_BY_ID.keys(), ...FALLBACK_WORLD_NODE_BY_ID.keys()]);
const REVIEWED_EDGE_SOURCE_IDS = new Set(fallbackWorldEdges.map((edge) => edge.id));

interface MapAtlasRowsOptions {
  requireCompleteReviewedProjection?: boolean;
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be a JSON object.`);
  return value as Record<string, unknown>;
}

function sourceId(value: unknown): string | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const candidate = (value as Record<string, unknown>).sourceId;
  return typeof candidate === "string" ? candidate : undefined;
}

function position(value: unknown): { x: number; y: number } {
  const item = record(value, "atlas node position");
  if (typeof item.x !== "number" || typeof item.y !== "number") throw new Error("Atlas node coordinates must be numeric.");
  return { x: item.x, y: item.y };
}

function gateway(row: AtlasNodeRow): Gateway {
  if (row.slug !== "ramayana" && row.slug !== "ganesha" && row.slug !== "durga" && row.slug !== "diwali" && row.slug !== "sacred-time") throw new Error(`Unexpected gateway slug: ${row.slug}`);
  const fallback = FALLBACK_GATEWAY_BY_ID.get(row.slug);
  if (!fallback) throw new Error(`${row.slug} has no reviewed gateway presentation.`);
  const visual = record(row.visual, `${row.slug} visual`);
  const tone = visual.tone;
  const threads = visual.threads;
  if (tone !== "saffron" && tone !== "rose" && tone !== "moon" && tone !== "gold" && tone !== "violet") throw new Error(`${row.slug} has an invalid tone.`);
  if (typeof visual.invitation !== "string" || !Array.isArray(threads) || !threads.every((item) => typeof item === "string")) throw new Error(`${row.slug} has an invalid gateway presentation.`);
  return {
    id: row.slug,
    title: row.title,
    devanagari: fallback.devanagari,
    invitation: visual.invitation,
    tone: tone as GatewayTone,
    position: position(row.position),
    threads: threads as string[],
  };
}

function worldNode(row: AtlasNodeRow): WorldNode {
  const visual = record(row.visual, `${row.slug} visual`);
  const size = visual.size;
  if (size !== "major" && size !== "connected") throw new Error(`${row.slug} has an invalid size.`);
  const fallback = FALLBACK_WORLD_NODE_BY_ID.get(row.slug);
  if (!fallback) throw new Error(`${row.slug} has no reviewed exploration metadata.`);
  const explorationFields = [visual.eras, visual.gatewayId, visual.summary, visual.searchQuery, visual.evidenceBoundary];
  const providedFieldCount = explorationFields.filter((value) => value !== undefined).length;
  if (providedFieldCount !== 0 && providedFieldCount !== explorationFields.length) throw new Error(`${row.slug} has partially migrated exploration metadata.`);
  const eras = providedFieldCount === 0 ? fallback.eras : visual.eras;
  const gatewayId = providedFieldCount === 0 ? fallback.gatewayId : visual.gatewayId;
  const summary = providedFieldCount === 0 ? fallback.summary : visual.summary;
  const searchQuery = providedFieldCount === 0 ? fallback.searchQuery : visual.searchQuery;
  const evidenceBoundary = providedFieldCount === 0 ? fallback.evidenceBoundary : visual.evidenceBoundary;
  if (!Array.isArray(eras) || eras.length === 0 || !eras.every((item) => typeof item === "string" && ERAS.includes(item as typeof ERAS[number]))) throw new Error(`${row.slug} has invalid eras.`);
  if (gatewayId !== "ramayana" && gatewayId !== "ganesha" && gatewayId !== "durga" && gatewayId !== "diwali" && gatewayId !== "sacred-time") throw new Error(`${row.slug} has an invalid gateway.`);
  if (typeof summary !== "string" || typeof searchQuery !== "string" || typeof evidenceBoundary !== "string") throw new Error(`${row.slug} has incomplete exploration copy.`);
  return {
    id: row.slug,
    label: row.title,
    kind: row.node_kind,
    eras: eras as string[],
    gatewayId,
    summary,
    searchQuery,
    evidenceBoundary,
    revealAt: Number(row.reveal_at),
    size,
    position: position(row.position),
    geography: fallback.geography,
  };
}

export function mapAtlasRows(nodes: AtlasNodeRow[], edges: AtlasEdgeRow[], options: MapAtlasRowsOptions = {}): AtlasWorld {
  const reviewedNodes = nodes.filter((node) => REVIEWED_NODE_SLUGS.has(node.slug) && sourceId(node.visual) === node.slug);
  const reviewedNodeIds = new Set(reviewedNodes.map((node) => node.id));
  const reviewedEdges = edges.filter((edge) => {
    const edgeSourceId = sourceId(edge.visual);
    return edgeSourceId !== undefined
      && REVIEWED_EDGE_SOURCE_IDS.has(edgeSourceId)
      && reviewedNodeIds.has(edge.source_node_id)
      && reviewedNodeIds.has(edge.target_node_id);
  });
  if (options.requireCompleteReviewedProjection) {
    const reviewedNodeSlugs = new Set(reviewedNodes.map((node) => node.slug));
    const reviewedEdgeSourceIds = new Set(reviewedEdges.map((edge) => sourceId(edge.visual)));
    if (reviewedNodes.length !== REVIEWED_NODE_SLUGS.size || reviewedNodeSlugs.size !== REVIEWED_NODE_SLUGS.size) {
      throw new Error(`Expected ${REVIEWED_NODE_SLUGS.size} reviewed Atlas nodes, received ${reviewedNodeSlugs.size}.`);
    }
    if (reviewedEdges.length !== REVIEWED_EDGE_SOURCE_IDS.size || reviewedEdgeSourceIds.size !== REVIEWED_EDGE_SOURCE_IDS.size) {
      throw new Error(`Expected ${REVIEWED_EDGE_SOURCE_IDS.size} reviewed Atlas edges, received ${reviewedEdgeSourceIds.size}.`);
    }
  }
  const slugById = new Map(reviewedNodes.map((node) => [node.id, node.slug]));
  const gateways = reviewedNodes.filter((node) => node.is_gateway).map(gateway);
  const worldNodes = reviewedNodes.filter((node) => !node.is_gateway).map(worldNode);
  const worldEdges: WorldEdge[] = reviewedEdges.map((edge) => {
    const from = slugById.get(edge.source_node_id);
    const to = slugById.get(edge.target_node_id);
    if (!from || !to) throw new Error(`Atlas edge ${edge.id} references a missing node.`);
    const visual = record(edge.visual, `${edge.id} visual`);
    const evidenceBoundary = typeof visual.evidenceBoundary === "string" ? visual.evidenceBoundary : undefined;
    const sourceRef = typeof visual.sourceRef === "string" ? visual.sourceRef : undefined;
    return {
      id: edge.id,
      from,
      to,
      relation: edge.label,
      ...(evidenceBoundary ? { evidenceBoundary } : {}),
      ...(sourceRef ? { sourceRef } : {}),
    };
  });
  if (gateways.length !== 5 || new Set(gateways.map((item) => item.id)).size !== 5) throw new Error(`Expected five unique MVP gateways, received ${gateways.length}.`);
  return { eras: ERAS, gateways, placeThreads, worldNodes, worldEdges };
}
