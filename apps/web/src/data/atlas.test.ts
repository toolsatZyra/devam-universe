import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { searchLibrary } from "../lib/search/library-search";
import { eras, gateways, placeThreads, worldEdges, worldNodes } from "./atlas";

const reviewedDetailNodeIds = [
  "ramcharitmanas",
  "bala-kanda",
  "ayodhya-kanda",
  "aranya-kanda",
  "kishkindha-kanda",
  "sundara-kanda",
  "hanuman-deliberation",
  "yuddha-kanda",
  "uttara-kanda",
  "ganesh-chaturthi",
  "sankashti-chaturthi",
  "ananta-chaturdashi",
  "devi-mahatmya",
  "madhu-kaitabha",
  "mahishasura",
  "shumbha",
  "nishumbha",
  "shardiya-navaratri",
  "maha-ashtami",
  "saraswati-ayudha-puja",
  "vasu-baras",
  "dhantrayodashi",
  "yama-deepam",
  "naraka-chaturdashi",
  "lakshmi-puja",
  "kali-puja",
  "bali-pratipada",
  "govardhana-puja",
  "bhai-dooj",
  "tamil-deepavali",
] as const;

function reachableFrom(gatewayId: string): Set<string> {
  const reached = new Set([gatewayId]);
  const queue = [gatewayId];
  while (queue.length) {
    const current = queue.shift()!;
    for (const edge of worldEdges.filter((candidate) => candidate.from === current)) {
      if (reached.has(edge.to)) continue;
      reached.add(edge.to);
      queue.push(edge.to);
    }
  }
  return reached;
}

describe("Living Atlas exploration data", () => {
  it("forms one valid, explorable graph rather than a collection of decorative labels", () => {
    expect(worldNodes).toHaveLength(41);
    expect(new Set(worldNodes.map((node) => node.id)).size).toBe(worldNodes.length);
    expect(new Set(worldEdges.map((edge) => edge.id)).size).toBe(worldEdges.length);

    const allIds = new Set([...gateways.map((gateway) => gateway.id), ...worldNodes.map((node) => node.id)]);
    for (const edge of worldEdges) {
      expect(allIds.has(edge.from), `${edge.id} has an unknown source`).toBe(true);
      expect(allIds.has(edge.to), `${edge.id} has an unknown destination`).toBe(true);
      expect(edge.from).not.toBe(edge.to);
      expect(edge.relation.length).toBeGreaterThan(2);
    }

    const reachable = new Map(gateways.map((gateway) => [gateway.id, reachableFrom(gateway.id)]));
    for (const node of worldNodes) {
      expect(node.eras.length).toBeGreaterThan(0);
      expect(node.eras.every((era) => eras.includes(era as typeof eras[number]))).toBe(true);
      expect(gateways.some((gateway) => gateway.id === node.gatewayId)).toBe(true);
      expect(node.summary.length).toBeGreaterThan(50);
      expect(node.searchQuery.length).toBeGreaterThan(3);
      expect(node.evidenceBoundary.length).toBeGreaterThan(50);
      expect(reachable.get(node.gatewayId)?.has(node.id), `${node.id} is disconnected from ${node.gatewayId}`).toBe(true);
    }
  });

  it("gives every era a visible exploration path", () => {
    for (const era of eras) expect(worldNodes.some((node) => node.eras.includes(era))).toBe(true);
  });

  it("offers one evidence-bounded place thread for every hero world", () => {
    expect(placeThreads.map((thread) => thread.gatewayId).sort()).toEqual(["diwali", "durga", "ganesha", "ramayana"]);
    for (const thread of placeThreads) {
      expect(thread.invitation.length).toBeGreaterThan(40);
      expect(thread.evidenceBoundary.length).toBeGreaterThan(90);
      expect(thread.nodeIds.length).toBeGreaterThanOrEqual(2);
      expect(new Set(thread.nodeIds).size).toBe(thread.nodeIds.length);
      for (const nodeId of thread.nodeIds) {
        const node = worldNodes.find((candidate) => candidate.id === nodeId);
        expect(node, `${thread.gatewayId} place thread references ${nodeId}`).toBeDefined();
        expect(node?.gatewayId).toBe(thread.gatewayId);
        expect(node?.eras).toContain("Living");
        expect(node?.geography?.region.length).toBeGreaterThan(2);
        expect(node?.geography?.position.x).toBeGreaterThanOrEqual(0);
        expect(node?.geography?.position.x).toBeLessThanOrEqual(100);
        expect(node?.geography?.position.y).toBeGreaterThanOrEqual(0);
        expect(node?.geography?.position.y).toBeLessThanOrEqual(100);
      }
    }
    expect(new Set(placeThreads.flatMap((thread) => thread.nodeIds.map((nodeId) => {
      const node = worldNodes.find((candidate) => candidate.id === nodeId)!;
      return `${node.geography!.position.x},${node.geography!.position.y}`;
    }))).size).toBe(placeThreads.flatMap((thread) => thread.nodeIds).length);
  });

  it("opens every new detail doorway into reviewed retrieval rather than an empty search", async () => {
    for (const nodeId of reviewedDetailNodeIds) {
      const node = worldNodes.find((candidate) => candidate.id === nodeId);
      expect(node).toBeDefined();
      const result = await searchLibrary(node!.searchQuery, "en");
      expect(result.results.length, `${nodeId} produced an empty reviewed search`).toBeGreaterThan(0);
      expect(result.results.every((item) => item.citations.length > 0), `${nodeId} returned uncited knowledge`).toBe(true);
    }
  });

  it("keeps the hosted Atlas migration byte-derived from the reviewed app graph", () => {
    const root = resolve(process.cwd(), "..", "..");
    const migrations = resolve(root, "supabase", "migrations");
    const migrationName = readdirSync(migrations)
      .filter((name) => name.endsWith("_sync_current_living_atlas.sql"))
      .sort()
      .at(-1);
    expect(migrationName).toBeDefined();

    const directory = mkdtempSync(join(tmpdir(), "devam-atlas-migration-"));
    const generated = resolve(directory, "migration.sql");
    try {
      execFileSync(process.execPath, [resolve(root, "tools", "compile_current_living_atlas_seed.cjs"), generated], {
        cwd: root,
        stdio: "pipe",
      });
      expect(readFileSync(generated)).toEqual(readFileSync(resolve(migrations, migrationName!)));
      const sql = readFileSync(generated, "utf8");
      expect(sql).toContain("Expected 45 app-owned Living Atlas nodes");
      expect(sql).toContain("Expected 49 app-owned Living Atlas edges");
      expect(sql).toContain("Devimahatmya semantic Atlas nodes are not bound to their entities and source boundary");
      expect(sql).toContain("Devimahatmya semantic Atlas edges are not bound to their evidence-linked relationships");
      expect(sql).not.toContain("alter function");
      expect(sql).not.toContain("grant execute");
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
