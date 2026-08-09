import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { gateways, worldEdges, worldNodes } from "./atlas";
import { ritualAtlasCoverage } from "./ritual-atlas-coverage";

const ROOT = resolve(process.cwd(), "../..");
const RITUAL_DIR = resolve(ROOT, "knowledge_packs/rituals");
const CURRENT_CONTRACT = "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1";

function currentContractFiles() {
  return readdirSync(RITUAL_DIR)
    .filter((name) => name.endsWith(".json"))
    .filter((name) => {
      const document = JSON.parse(readFileSync(resolve(RITUAL_DIR, name), "utf8")) as { contract?: string };
      return document.contract === CURRENT_CONTRACT;
    })
    .sort();
}

describe("current ritual Atlas projection", () => {
  it("covers the complete current-contract denominator without inferring legacy coverage", () => {
    expect(ritualAtlasCoverage).toHaveLength(47);
    expect(ritualAtlasCoverage.filter((record) => record.classification === "user_complete_lane")).toHaveLength(46);
    expect(ritualAtlasCoverage.filter((record) => record.classification === "participation_companion")).toHaveLength(1);
    expect(new Set(ritualAtlasCoverage.map((record) => record.packId)).size).toBe(47);
    expect(ritualAtlasCoverage.map((record) => basename(record.path)).sort()).toEqual(currentContractFiles());
  });

  it("binds every record to its actual bytes, reviewed node, and source-addressed edge", () => {
    const nodeIds = new Set([...gateways.map((gateway) => gateway.id), ...worldNodes.map((node) => node.id)]);
    const edgeById = new Map(worldEdges.map((edge) => [edge.id, edge]));

    for (const record of ritualAtlasCoverage) {
      const bytes = readFileSync(resolve(ROOT, record.path));
      const document = JSON.parse(bytes.toString("utf8")) as {
        contract?: string;
        product_status?: { classification?: string };
      };
      expect(document.contract, record.packId).toBe(CURRENT_CONTRACT);
      expect(document.product_status?.classification, record.packId).toBe(record.classification);
      expect(createHash("sha256").update(bytes).digest("hex"), record.packId).toBe(record.sha256);
      expect(nodeIds.has(record.nodeId), record.nodeId).toBe(true);
      expect(edgeById.get(record.edgeId)?.sourceRef, record.edgeId).toBe(`sha256:${record.sha256}#ritual-pack`);
    }
  });
});
