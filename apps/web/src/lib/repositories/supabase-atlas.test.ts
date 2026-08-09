import { describe, expect, it } from "vitest";
import type { Tables } from "@/lib/supabase/database.types";
import { mapAtlasRows } from "./atlas-row-mapper";

type NodeRow = Pick<Tables<"atlas_nodes">, "id" | "slug" | "title" | "subtitle" | "node_kind" | "is_gateway" | "position" | "visual" | "reveal_at">;
type EdgeRow = Pick<Tables<"atlas_edges">, "id" | "source_node_id" | "target_node_id" | "label" | "visual">;

const gatewayRows: NodeRow[] = [
  ["1", "ramayana", "Ramayana", "रामायण", "gateway", "saffron"],
  ["2", "ganesha", "Ganesha", "गणेश", "gateway", "moon"],
  ["3", "durga", "Durga", "दुर्गा", "gateway", "rose"],
  ["4", "diwali", "Diwali", "दीपावली", "gateway", "gold"],
  ["5", "sacred-time", "Sacred Time", "कालचक्र", "gateway", "violet"],
].map(([id, slug, title, subtitle, kind, tone], index) => ({
  id,
  slug,
  title,
  subtitle,
  node_kind: kind,
  is_gateway: true,
  position: { x: 20 + index * 20, y: 30 },
  visual: { sourceId: slug, tone, invitation: `Enter ${title}`, threads: [title] },
  reveal_at: 1,
})) as NodeRow[];

describe("Supabase Atlas mapping", () => {
  it("requires the five reviewed gateways including Sacred Time", () => {
    const world = mapAtlasRows(gatewayRows, [] as EdgeRow[]);
    expect(world.gateways.map((item) => item.id).sort()).toEqual(["diwali", "durga", "ganesha", "ramayana", "sacred-time"]);
    expect(world.gateways.find((item) => item.id === "diwali")).toMatchObject({ tone: "gold", devanagari: "दीपावली" });
    expect(world.gateways.find((item) => item.id === "sacred-time")).toMatchObject({ tone: "violet", devanagari: "कालचक्र" });
  });

  it("fails closed when the database has not received the Sacred Time gateway", () => {
    expect(() => mapAtlasRows(gatewayRows.slice(0, 4), [] as EdgeRow[])).toThrow("Expected five unique MVP gateways");
  });

  it("rejects a structurally valid but stale hosted projection as a whole", () => {
    expect(() => mapAtlasRows(gatewayRows, [] as EdgeRow[], { requireCompleteReviewedProjection: true }))
      .toThrow("Expected 136 reviewed Atlas nodes, received 5");
  });

  it("uses the reviewed Unicode presentation when a restored database subtitle is corrupted", () => {
    const restored = mapAtlasRows(
      gatewayRows.map((row) => row.slug === "ramayana" ? { ...row, subtitle: "à¤°à¤¾à¤®à¤¾à¤¯à¤£" } : row),
      [],
    );
    expect(restored.gateways.find((item) => item.id === "ramayana")?.devanagari).toBe("रामायण");
  });

  it("maps explorable node metadata and safely enriches legacy decorative rows", () => {
    const explorableNode = {
      id: "5",
      slug: "ayodhya",
      title: "Ayodhya",
      subtitle: null,
      node_kind: "Place",
      is_gateway: false,
      position: { x: 38, y: 24 },
      visual: {
        sourceId: "ayodhya",
        size: "major",
        eras: ["Origins", "Epics", "Living"],
        gatewayId: "ramayana",
        summary: "Enter the Ramayana through Ayodhya.",
        searchQuery: "Ayodhya Ramayana",
        evidenceBoundary: "Navigation is not a completeness claim.",
      },
      reveal_at: 1,
    } as NodeRow;
    const world = mapAtlasRows([...gatewayRows, explorableNode], [{ id: "e1", source_node_id: "1", target_node_id: "5", label: "begins in", visual: { sourceId: "ramayana-ayodhya" } }] as EdgeRow[]);
    expect(world.worldNodes).toEqual([expect.objectContaining({ id: "ayodhya", eras: ["Origins", "Epics", "Living"], gatewayId: "ramayana", searchQuery: "Ayodhya Ramayana", geography: { position: { x: 54, y: 35 }, region: "Uttar Pradesh" } })]);
    expect(world.worldEdges).toEqual([{ id: "e1", from: "ramayana", to: "ayodhya", relation: "begins in", relationKind: "association" }]);
    const fallbackWorld = mapAtlasRows([...gatewayRows, { ...explorableNode, visual: { sourceId: "ayodhya", size: "major" } }], []);
    expect(fallbackWorld.worldNodes[0]).toMatchObject({ id: "ayodhya", gatewayId: "ramayana", eras: ["Origins", "Epics", "Living"] });
    expect(() => mapAtlasRows([...gatewayRows, { ...explorableNode, visual: { sourceId: "ayodhya", size: "major", eras: ["Epics"] } }], [])).toThrow("partially migrated exploration metadata");
  });

  it("ignores independently managed nodes and edges outside the reviewed Devam universe", () => {
    const externalNode = {
      id: "external-1",
      slug: "ganesha-purana",
      title: "Ganesha Purana",
      subtitle: null,
      node_kind: "Source",
      is_gateway: false,
      position: { x: 50, y: 50 },
      visual: { size: "major" },
      reveal_at: 1,
    } as NodeRow;
    const world = mapAtlasRows(
      [...gatewayRows, externalNode],
      [{ id: "external-edge", source_node_id: "2", target_node_id: "external-1", label: "mentions", visual: {} }] as EdgeRow[],
    );
    expect(world.worldNodes).toEqual([]);
    expect(world.worldEdges).toEqual([]);
  });
});
