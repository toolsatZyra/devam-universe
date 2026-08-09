import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { searchLibrary } from "../lib/search/library-search";
import { answerSarthi } from "../lib/sarthi/answer";
import { eras, gateways, placeThreads, worldEdges, worldNodes } from "./atlas";

const reviewedDetailNodeIds = [
  "ramcharitmanas",
  "dutt-ramayana",
  "rama",
  "sita",
  "lakshmana",
  "hanuman",
  "ravana",
  "sugriva",
  "king-janaka",
  "king-dasharatha",
  "mithila-story-world",
  "panchavati-story-world",
  "kishkindha-story-world",
  "lanka-story-world",
  "forest-exile",
  "sita-abduction",
  "rama-sugriva-alliance",
  "hanuman-ocean-crossing",
  "bridge-to-lanka",
  "return-to-ayodhya",
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
  "ganesha-purana",
  "ganapatyatharvashirsha",
  "devi-mahatmya",
  "madhu-kaitabha",
  "mahishasura",
  "shumbha",
  "nishumbha",
  "king-suratha",
  "merchant-samadhi",
  "sage-medhas",
  "medhas-hermitage-story-world",
  "mahamaya",
  "suratha-samadhi-seek-counsel",
  "madhu-kaitabha-awakening",
  "mahishasura-battle",
  "kaushiki",
  "kalika",
  "dhumralochana",
  "chanda-munda",
  "chamunda",
  "raktabija",
  "shumbha-nishumbha-battle",
  "granting-of-boons",
  "shardiya-navaratri",
  "maha-ashtami",
  "saraswati-ayudha-puja",
  "durga-puja",
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
  "kali-chaudas-baps",
  "gujarati-new-year-baps",
  "balipadyami-karnataka",
  "jain-diwali",
  "bandi-chhor-divas",
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
    expect(worldNodes).toHaveLength(118);
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

  it("supports an evidence-bounded cross-world path from Ramayana to Durga Puja", () => {
    const requiredPath = [
      ["ramayana", "diwali"],
      ["diwali", "kali-puja"],
      ["kali-puja", "durga"],
      ["durga", "durga-puja"],
    ] as const;
    for (const [from, to] of requiredPath) {
      const edge = worldEdges.find((candidate) => candidate.from === from && candidate.to === to);
      expect(edge, `${from} must connect to ${to}`).toBeDefined();
      if (edge?.id !== "diwali-kolkata" && edge?.id !== "lakshmi-to-kali") {
        expect(edge?.evidenceBoundary?.length ?? 0, `${edge?.id} needs a visible scope boundary`).toBeGreaterThan(80);
      }
    }
    const bridgeEdges = worldEdges.filter((edge) => edge.evidenceBoundary);
    expect(bridgeEdges.map((edge) => edge.id)).toEqual(expect.arrayContaining([
      "ramayana-to-diwali",
      "diwali-to-kali-puja",
      "kali-puja-to-durga",
      "durga-to-durga-puja",
      "durga-puja-to-kolkata",
    ]));
  });

  it("turns the Dutt edition into a source-addressed character, place, and event constellation", () => {
    const constellationIds = [
      "rama", "sita", "lakshmana", "hanuman", "ravana", "sugriva", "king-janaka", "king-dasharatha",
      "mithila-story-world", "panchavati-story-world", "kishkindha-story-world", "lanka-story-world",
      "forest-exile", "sita-abduction", "rama-sugriva-alliance", "hanuman-ocean-crossing", "bridge-to-lanka", "return-to-ayodhya",
    ];
    expect(worldNodes.filter((node) => constellationIds.includes(node.id))).toHaveLength(constellationIds.length);

    const sourceAddressedEdges = worldEdges.filter((edge) => edge.id.startsWith("dutt-ramayana-to-") || edge.sourceRef?.includes("sha256:"));
    expect(sourceAddressedEdges.length).toBeGreaterThanOrEqual(35);
    expect(sourceAddressedEdges.every((edge) => edge.sourceRef?.includes("sha256:"))).toBe(true);

    const eventPath = [
      ["ayodhya-kanda", "forest-exile"],
      ["panchavati-story-world", "sita-abduction"],
      ["kishkindha-kanda", "rama-sugriva-alliance"],
      ["sundara-kanda", "hanuman-ocean-crossing"],
      ["yuddha-kanda", "bridge-to-lanka"],
      ["yuddha-kanda", "return-to-ayodhya"],
      ["return-to-ayodhya", "diwali"],
    ];
    for (const [from, to] of eventPath) {
      const edge = worldEdges.find((candidate) => candidate.from === from && candidate.to === to);
      expect(edge, `${from} must connect to ${to}`).toBeDefined();
      expect(edge?.evidenceBoundary?.length ?? 0).toBeGreaterThan(100);
      expect(edge?.sourceRef?.length ?? 0).toBeGreaterThan(100);
    }
  });

  it("turns the Devimahatmya into a source-addressed frame, manifestation, figure, and episode constellation", () => {
    const constellationIds = [
      "king-suratha", "merchant-samadhi", "sage-medhas", "medhas-hermitage-story-world", "mahamaya",
      "suratha-samadhi-seek-counsel", "madhu-kaitabha-awakening", "mahishasura-battle", "kaushiki", "kalika",
      "dhumralochana", "chanda-munda", "chamunda", "raktabija", "shumbha-nishumbha-battle", "granting-of-boons",
    ];
    expect(worldNodes.filter((node) => constellationIds.includes(node.id))).toHaveLength(constellationIds.length);

    const constellationEdges = worldEdges
      .filter((edge) => constellationIds.includes(edge.from) || constellationIds.includes(edge.to))
      .filter((edge) => edge.id !== "kali-puja-to-kalika");
    expect(constellationEdges).toHaveLength(37);
    expect(constellationEdges.every((edge) => edge.sourceRef?.includes("sha256:"))).toBe(true);

    const storyLoop = [
      ["king-suratha", "suratha-samadhi-seek-counsel"],
      ["merchant-samadhi", "suratha-samadhi-seek-counsel"],
      ["suratha-samadhi-seek-counsel", "mahamaya"],
      ["mahamaya", "madhu-kaitabha-awakening"],
      ["chanda-munda", "chamunda"],
      ["chamunda", "raktabija"],
      ["raktabija", "shumbha-nishumbha-battle"],
      ["shumbha-nishumbha-battle", "granting-of-boons"],
      ["granting-of-boons", "king-suratha"],
      ["granting-of-boons", "merchant-samadhi"],
    ];
    for (const [from, to] of storyLoop) {
      const edge = worldEdges.find((candidate) => candidate.from === from && candidate.to === to);
      expect(edge, `${from} must connect to ${to}`).toBeDefined();
      expect(edge?.sourceRef).toContain("sha256:");
    }

    const kaliBridge = worldEdges.find((edge) => edge.id === "kali-puja-to-kalika");
    expect(kaliBridge?.evidenceBoundary).toContain("does not claim festival origin");
  });

  it("turns every current ritual contract into a traversable practice-cycle doorway", () => {
    const cyclePaths = [
      ["sacred-time", "ekadashi-cycle", "vishnu"],
      ["sacred-time", "hartalika-teej", "parvati", "shiva"],
      ["sacred-time", "sankranti-cycle", "surya"],
      ["sacred-time", "masika-durgashtami", "durga"],
      ["sacred-time", "rishi-panchami", "saptarishi"],
    ];
    for (const path of cyclePaths) {
      for (let index = 0; index < path.length - 1; index += 1) {
        expect(
          worldEdges.some((edge) => edge.from === path[index] && edge.to === path[index + 1]),
          `${path[index]} must connect to ${path[index + 1]}`,
        ).toBe(true);
      }
    }

    expect(worldEdges.filter((edge) => edge.sourceRef?.includes("sha256:"))).toHaveLength(156);
  });

  it("gives every era a visible exploration path", () => {
    for (const era of eras) expect(worldNodes.some((node) => node.eras.includes(era))).toBe(true);
  });

  it("offers one evidence-bounded place thread for every reviewed world", () => {
    expect(placeThreads.map((thread) => thread.gatewayId).sort()).toEqual(["diwali", "durga", "ganesha", "ramayana", "sacred-time"]);
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

  it("continues every newly explicit Diwali lane through its exact Sarthi context", () => {
    const cases = [
      ["kali-chaudas-baps", "kali-chaudas-baps"],
      ["gujarati-new-year-baps", "gujarati-new-year-baps"],
      ["balipadyami-karnataka", "karnataka-balipadyami"],
      ["jain-diwali", "jain-diwali-umbrella"],
      ["bandi-chhor-divas", "bandi-chhor-divas-sgpc"],
    ] as const;
    for (const [atlasNodeSlug, companionToObservanceSlug] of cases) {
      const result = answerSarthi({ message: "Tell me about this", context: { atlasNodeSlug } });
      expect(result, atlasNodeSlug).toMatchObject({
        ok: true,
        mode: "contextual_ritual_guidance",
        practiceGuide: { companionToObservanceSlug },
      });
    }
  });

  it("does not let an Atlas doorway silently override an incompatible saved tradition", () => {
    const result = answerSarthi({
      message: "Tell me about this",
      context: { atlasNodeSlug: "jain-diwali", regionCode: "west-india", traditionCode: "smarta-west-india" },
    });
    expect(result).toMatchObject({ ok: true, mode: "context_clarification" });
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
      expect(sql).toContain("Expected 123 app-owned Living Atlas nodes");
      expect(sql).toContain("Expected 198 app-owned Living Atlas edges");
      expect(sql).toContain("Rama homecoming tradition");
      expect(sql).toContain("connected Shakta goddess traditions");
      expect(sql).toContain("Devimahatmya semantic Atlas nodes are not bound to their entities and source boundary");
      expect(sql).toContain("Devimahatmya semantic Atlas edges are not bound to their evidence-linked relationships");
      expect(sql).toContain("Ganesha Purana Atlas node is not bound to its exact source entity and boundary");
      expect(sql).toContain("Dutt Ramayana Atlas node is missing its selected-edition boundary");
      expect(sql).toContain("Dutt Ramayana narrative constellation nodes are missing or outside their selected-edition boundaries");
      expect(sql).toContain("Source-addressed Living Atlas edges are missing exact source addresses");
      expect(sql).toContain("Distinct Diwali Atlas lanes are missing or misrouted");
      expect(sql).toContain("Sacred Time Atlas lanes are missing, unbounded, or not source-addressed");
      expect(sql).toContain("Sacred Time practice-cycle nodes are missing or outside their evidence boundaries");
      expect(sql).toContain("Sacred Time practice-cycle routes are missing or not source-addressed");
      expect(sql).not.toContain("alter function");
      expect(sql).not.toContain("grant execute");
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
