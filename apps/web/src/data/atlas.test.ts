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
  "pushpaka-departure-lanka",
  "remembered-homeward-route",
  "bharadvaja-homecoming-counsel",
  "hanuman-carries-homecoming-message",
  "bharata-hears-return",
  "ayodhya-prepares-homecoming",
  "rama-coronation-return",
  "vibhishana",
  "bharadvaja",
  "bharadvaja-hermitage-story-world",
  "guha",
  "bharata",
  "nandigrama-story-world",
  "shatrughna",
  "vasishta",
  "ganesh-chaturthi",
  "sankashti-chaturthi",
  "ananta-chaturdashi",
  "ganesha-purana",
  "ganapatyatharvashirsha",
  "ganesha-cosmic-world",
  "ganesha-five-elements",
  "ganesha-one-tusked-form",
  "ganesha-mouse-emblem",
  "ganesha-eight-names",
  "ganesha-ekadanta",
  "ganesha-lambodara",
  "ganesha-vighnanashin",
  "public-ganeshotsav-1893",
  "ganeshotsav-community-pandal",
  "ganeshotsav-clay-murti",
  "ganeshotsav-modak",
  "ganeshotsav-visarjan",
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
  "ramlila-performance",
  "ramlila-community-stage",
  "ramnagar-ramlila",
  "dussehra-performance-season",
  "durga-puja-public-art",
  "kumartuli-artisan-workshops",
  "durga-puja-clay-image",
  "durga-puja-installations",
  "durga-puja-dhak",
  "durga-puja-immersion-return",
  "kashi-vishwanath-temple",
  "vishvanatha-kashi",
  "ganga-varanasi",
  "varanasi-ghats",
  "dashashwamedh-ghat",
  "kalabhairava-kashi-temple",
  "annapurna-kashi-temple",
  "tulsi-manas-temple",
  "tulsidas-varanasi",
  "sankat-mochan-varanasi",
  "sarnath",
  "buddha-sarnath",
  "first-sermon-sarnath",
  "buddhist-sangha-sarnath",
  "varanasi-city-of-music",
  "varanasi-guru-shishya-music",
  "banaras-brocades-sarees",
  "banaras-weaver-community",
  "maratha-ghat-patronage",
  "kashi-rulers-music-patronage",
  "ganga-mahotsav-varanasi",
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
    expect(worldNodes).toHaveLength(203);
    expect(new Set(worldNodes.map((node) => node.id)).size).toBe(worldNodes.length);
    expect(new Set(worldEdges.map((edge) => edge.id)).size).toBe(worldEdges.length);

    const allIds = new Set([...gateways.map((gateway) => gateway.id), ...worldNodes.map((node) => node.id)]);
    for (const edge of worldEdges) {
      expect(allIds.has(edge.from), `${edge.id} has an unknown source`).toBe(true);
      expect(allIds.has(edge.to), `${edge.id} has an unknown destination`).toBe(true);
      expect(edge.from).not.toBe(edge.to);
      expect(edge.relation.length).toBeGreaterThan(2);
      expect(edge.relationKind.length).toBeGreaterThan(2);
    }

    const reachable = new Map(gateways.map((gateway) => [gateway.id, reachableFrom(gateway.id)]));
    for (const node of worldNodes) {
      expect(node.eras.length).toBeGreaterThan(0);
      expect(node.eras.every((era) => eras.includes(era as typeof eras[number]))).toBe(true);
      expect(gateways.some((gateway) => gateway.id === node.gatewayId)).toBe(true);
      expect(node.summary.length).toBeGreaterThan(50);
      expect(node.searchQuery.length).toBeGreaterThan(3);
      expect(node.evidenceBoundary.length).toBeGreaterThan(50);
      expect(node.family.length).toBeGreaterThan(5);
      expect(reachable.get(node.gatewayId)?.has(node.id), `${node.id} is disconnected from ${node.gatewayId}`).toBe(true);
    }
  });

  it("makes Kishkindha, Hampi, and Vijayanagara a traversable but evidence-separated world", () => {
    const nodeIds = [
      "kishkindha-living-landscape", "anegundi", "anjanadri-hill-tradition", "tungabhadra-landscape",
      "hampi-world-heritage", "vijayanagara-capital", "vijayanagara-empire", "krishna-deva-raya",
      "virupaksha-temple-hampi", "vitthala-temple-complex", "stone-chariot-hampi",
      "vijayanagara-architecture", "talikota-1565",
    ];
    expect(worldNodes.filter((node) => nodeIds.includes(node.id))).toHaveLength(nodeIds.length);
    const route = [
      ["kishkindha-story-world", "kishkindha-living-landscape"],
      ["kishkindha-living-landscape", "anegundi"],
      ["anegundi", "tungabhadra-landscape"],
      ["tungabhadra-landscape", "hampi-world-heritage"],
      ["hampi-world-heritage", "vijayanagara-capital"],
      ["vijayanagara-capital", "vijayanagara-empire"],
      ["vijayanagara-empire", "krishna-deva-raya"],
    ];
    for (const [from, to] of route) {
      const edge = worldEdges.find((candidate) => candidate.from === from && candidate.to === to);
      expect(edge, `${from} must connect to ${to}`).toBeDefined();
      expect(edge?.sourceRef).toMatch(/^citation:https:\/\/(?:whc\.unesco\.org|karnatakatourism\.org)\//);
      expect(edge?.evidenceBoundary?.length ?? 0).toBeGreaterThan(100);
    }
    expect(worldNodes.find((node) => node.id === "kishkindha-living-landscape")?.evidenceBoundary).toContain("living place-belief");
    expect(worldNodes.find((node) => node.id === "hampi-world-heritage")?.evidenceBoundary).toContain("historical and archaeological");
    expect(worldNodes.find((node) => node.id === "vijayanagara-empire")?.evidenceBoundary).toContain("historically attested polity");
  });

  it("supports an evidence-bounded cross-world path from Ramayana to Kolkata's Shakta festival worlds", () => {
    const requiredPath = [
      ["ramayana", "diwali"],
      ["diwali", "kali-puja"],
      ["kali-puja", "kalighat-kali-temple"],
      ["durga-puja", "kalighat-kali-temple"],
    ] as const;
    for (const [from, to] of requiredPath) {
      const edge = worldEdges.find((candidate) => candidate.from === from && candidate.to === to);
      expect(edge, `${from} must connect to ${to}`).toBeDefined();
      expect(edge?.evidenceBoundary?.length ?? 0, `${edge?.id} needs a visible scope boundary`).toBeGreaterThan(80);
    }
    const bridgeEdges = worldEdges.filter((edge) => edge.evidenceBoundary);
    expect(bridgeEdges.map((edge) => edge.id)).toEqual(expect.arrayContaining([
      "ramayana-to-diwali",
      "diwali-to-kali-puja",
      "kali-puja-to-kalighat-temple",
      "kalighat-temple-to-durga-puja",
      "durga-to-durga-puja",
      "durga-puja-to-kolkata",
    ]));
  });

  it("turns Kolkata, Kalighat, and Dakshineswar into a sourced temple, art, maker, patronage, and cross-world constellation", () => {
    const constellationIds = [
      "kalighat-kali-temple", "kalighat-kali-form", "kalighat-art-transition", "kalighat-pat",
      "kalighat-patua-community", "dakshineswar-kali-temple", "bhavatarini-dakshineswar",
      "rani-rashmoni", "ramakrishna-dakshineswar", "dakshineswar-shiva-temples",
      "dakshineswar-radha-krishna-temple", "dakshineswar-shyama-puja",
    ];
    const nodes = worldNodes.filter((node) => constellationIds.includes(node.id));
    expect(nodes).toHaveLength(12);
    expect(new Set(nodes.map((node) => node.family))).toEqual(new Set([
      "art_culture", "being_person", "historical_process", "institution_community", "place_polity", "time_observance",
    ]));

    const routes = [
      ["kali-puja", "kalighat-kali-temple", "kalighat-kali-form", "kalika"],
      ["durga-puja", "kalighat-kali-temple", "kalighat-art-transition", "kalighat-pat", "kalighat-patua-community"],
      ["kalighat-kali-temple", "dakshineswar-kali-temple", "rani-rashmoni", "ramakrishna-dakshineswar"],
      ["dakshineswar-kali-temple", "dakshineswar-shiva-temples", "shiva"],
      ["dakshineswar-kali-temple", "dakshineswar-radha-krishna-temple", "krishna"],
    ];
    for (const route of routes) {
      for (let index = 0; index < route.length - 1; index += 1) {
        const edge = worldEdges.find((candidate) => candidate.from === route[index] && candidate.to === route[index + 1]);
        expect(edge, `${route[index]} must connect to ${route[index + 1]}`).toBeDefined();
        expect(edge?.sourceRef).toMatch(/^citation:https:\/\//);
        expect(edge?.evidenceBoundary?.length ?? 0).toBeGreaterThan(100);
      }
    }
    expect(worldEdges.some((edge) => ["diwali-kolkata", "kali-puja-to-kalika", "kali-puja-to-durga"].includes(edge.id))).toBe(false);
  });

  it("turns Kashi into a cross-civilizational sacred-city world without collapsing evidence lanes", () => {
    const constellationIds = [
      "kashi-vishwanath-temple", "vishvanatha-kashi", "ganga-varanasi", "varanasi-ghats",
      "dashashwamedh-ghat", "kalabhairava-kashi-temple", "annapurna-kashi-temple",
      "tulsi-manas-temple", "tulsidas-varanasi", "sankat-mochan-varanasi", "sarnath",
      "buddha-sarnath", "first-sermon-sarnath", "buddhist-sangha-sarnath",
      "varanasi-city-of-music", "varanasi-guru-shishya-music", "banaras-brocades-sarees",
      "banaras-weaver-community", "maratha-ghat-patronage", "kashi-rulers-music-patronage",
      "ganga-mahotsav-varanasi",
    ];
    const nodes = worldNodes.filter((node) => constellationIds.includes(node.id));
    expect(nodes).toHaveLength(21);
    expect(new Set(nodes.map((node) => node.family))).toEqual(new Set([
      "art_culture", "being_person", "event_story", "historical_process", "institution_community",
      "place_polity", "time_observance",
    ]));

    const routes = [
      ["diwali", "dev-deepawali", "kashi", "kashi-vishwanath-temple", "vishvanatha-kashi", "shiva"],
      ["dev-deepawali", "varanasi-ghats", "dashashwamedh-ghat"],
      ["kashi", "tulsi-manas-temple", "tulsidas-varanasi", "ramcharitmanas"],
      ["kashi", "sankat-mochan-varanasi", "hanuman"],
      ["kashi", "sarnath", "buddha-sarnath", "first-sermon-sarnath", "buddhist-sangha-sarnath"],
      ["kashi", "varanasi-city-of-music", "varanasi-guru-shishya-music"],
      ["kashi", "banaras-brocades-sarees", "banaras-weaver-community"],
      ["kashi", "ganga-mahotsav-varanasi", "varanasi-city-of-music"],
    ];
    for (const route of routes) {
      for (let index = 0; index < route.length - 1; index += 1) {
        const edge = worldEdges.find((candidate) => candidate.from === route[index] && candidate.to === route[index + 1]);
        expect(edge, `${route[index]} must connect to ${route[index + 1]}`).toBeDefined();
        expect(edge?.sourceRef).toMatch(/^(?:citation:https:\/\/|sha256:)/);
        expect(edge?.evidenceBoundary?.length ?? 0).toBeGreaterThan(100);
      }
    }
    expect(worldEdges.some((edge) => edge.id === "diwali-kashi")).toBe(false);
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

  it("makes the complete selected return arc traversable through people, places, and events", () => {
    const returnNodeIds = [
      "pushpaka-departure-lanka", "remembered-homeward-route", "bharadvaja-homecoming-counsel",
      "hanuman-carries-homecoming-message", "bharata-hears-return", "ayodhya-prepares-homecoming",
      "rama-coronation-return", "vibhishana", "bharadvaja", "bharadvaja-hermitage-story-world",
      "guha", "bharata", "nandigrama-story-world", "shatrughna", "vasishta",
    ];
    expect(worldNodes.filter((node) => returnNodeIds.includes(node.id))).toHaveLength(returnNodeIds.length);
    expect(new Set(worldNodes.filter((node) => returnNodeIds.includes(node.id)).map((node) => node.family)))
      .toEqual(new Set(["being_person", "event_story", "place_polity"]));

    const storyChain = [
      "pushpaka-departure-lanka", "remembered-homeward-route", "bharadvaja-homecoming-counsel",
      "hanuman-carries-homecoming-message", "bharata-hears-return", "ayodhya-prepares-homecoming",
      "rama-coronation-return",
    ];
    for (let index = 0; index < storyChain.length - 1; index += 1) {
      const edge = worldEdges.find((candidate) => candidate.from === storyChain[index] && candidate.to === storyChain[index + 1]);
      expect(edge, `${storyChain[index]} must open ${storyChain[index + 1]}`).toBeDefined();
      expect(edge?.sourceRef).toMatch(/^sha256:[a-f0-9]{64}\/ordinal\/\d+#span=[a-f0-9]{64}$/);
      expect(edge?.evidenceBoundary?.length ?? 0).toBeGreaterThan(120);
    }
    expect(worldEdges.filter((edge) => returnNodeIds.includes(edge.from) || returnNodeIds.includes(edge.to)))
      .toHaveLength(40);
  });

  it("turns the Ganesha doorway into source, form, symbol, festival, and history routes", () => {
    const constellationIds = [
      "ganesha-cosmic-world", "ganesha-five-elements", "ganesha-one-tusked-form", "ganesha-mouse-emblem",
      "ganesha-eight-names", "ganesha-ekadanta", "ganesha-lambodara", "ganesha-vighnanashin",
      "public-ganeshotsav-1893", "ganeshotsav-community-pandal", "ganeshotsav-clay-murti",
      "ganeshotsav-modak", "ganeshotsav-visarjan",
    ];
    expect(worldNodes.filter((node) => constellationIds.includes(node.id))).toHaveLength(constellationIds.length);

    const constellationEdges = worldEdges.filter((edge) => constellationIds.includes(edge.from) || constellationIds.includes(edge.to) || edge.id === "ganesha-to-shiva-source-kinship");
    expect(constellationEdges).toHaveLength(19);
    expect(constellationEdges.every((edge) => edge.sourceRef?.includes("sha256:"))).toBe(true);
    expect(new Set(constellationEdges.map((edge) => edge.relationKind))).toEqual(new Set(["festival", "history", "identity", "kinship", "practice", "teaching", "text", "time"]));

    const routes = [
      ["ganesha", "ganesha-cosmic-world", "ganesha-five-elements"],
      ["ganapatyatharvashirsha", "ganesha-one-tusked-form", "ganesha-mouse-emblem"],
      ["ganapatyatharvashirsha", "ganesha-eight-names", "ganesha-ekadanta", "ganesha-one-tusked-form"],
      ["ganesh-chaturthi", "public-ganeshotsav-1893", "ganeshotsav-community-pandal"],
      ["ganesh-chaturthi", "ganeshotsav-clay-murti", "ganeshotsav-visarjan", "ananta-chaturdashi"],
    ];
    for (const route of routes) {
      for (let index = 0; index < route.length - 1; index += 1) {
        expect(worldEdges.some((edge) => edge.from === route[index] && edge.to === route[index + 1]), `${route[index]} must connect to ${route[index + 1]}`).toBe(true);
      }
    }
  });

  it("turns living cultural heritage into playable performance, maker, material, place, and festival routes", () => {
    const constellationIds = [
      "ramlila-performance", "ramlila-community-stage", "ramnagar-ramlila", "dussehra-performance-season",
      "durga-puja-public-art", "kumartuli-artisan-workshops", "durga-puja-clay-image",
      "durga-puja-installations", "durga-puja-dhak", "durga-puja-immersion-return",
    ];
    expect(worldNodes.filter((node) => constellationIds.includes(node.id))).toHaveLength(constellationIds.length);
    expect(new Set(worldNodes.filter((node) => constellationIds.includes(node.id)).map((node) => node.family)))
      .toEqual(new Set(["art_culture", "institution_community", "place_polity", "practice_material", "time_observance"]));

    const routes = [
      ["ramayana", "ramlila-performance", "dussehra-performance-season", "shardiya-navaratri"],
      ["ramcharitmanas", "ramlila-performance", "ramnagar-ramlila", "kashi"],
      ["durga-puja", "durga-puja-public-art", "durga-puja-installations", "kolkata"],
      ["durga-puja", "kumartuli-artisan-workshops", "durga-puja-clay-image", "durga-puja-immersion-return", "kolkata"],
    ];
    for (const route of routes) {
      for (let index = 0; index < route.length - 1; index += 1) {
        const edge = worldEdges.find((candidate) => candidate.from === route[index] && candidate.to === route[index + 1]);
        expect(edge, `${route[index]} must connect to ${route[index + 1]}`).toBeDefined();
        expect(edge?.sourceRef).toMatch(/^citation:https:\/\/ich\.unesco\.org\//);
        expect(edge?.evidenceBoundary?.length ?? 0).toBeGreaterThan(100);
      }
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
      .filter((edge) => edge.id !== "kalighat-form-to-kalika-comparison");
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

    const kaliBridge = worldEdges.find((edge) => edge.id === "kalighat-form-to-kalika-comparison");
    expect(kaliBridge?.evidenceBoundary).toContain("invites comparison");
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

    expect(worldEdges.filter((edge) => edge.sourceRef?.includes("sha256:"))).toHaveLength(219);
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
      expect(sql).toContain("Expected 208 app-owned Living Atlas nodes");
      expect(sql).toContain("Expected 343 app-owned Living Atlas edges");
      expect(sql).toContain("Rama homecoming story tradition");
      expect(sql).toContain("Kolkata-Kalighat-Dakshineswar routes are missing official citation-only sources");
      expect(sql).toContain("Kashi sacred-city nodes are missing or outside their evidence boundaries");
      expect(sql).toContain("Kashi sacred-city routes are missing official citation-only sources");
      expect(sql).toContain("Devimahatmya semantic Atlas nodes are not bound to their entities and source boundary");
      expect(sql).toContain("Devimahatmya semantic Atlas edges are not bound to their evidence-linked relationships");
      expect(sql).toContain("Ganesha Purana Atlas node is not bound to its exact source entity and boundary");
      expect(sql).toContain("Ganesha connected-world nodes are missing or outside their evidence boundaries");
      expect(sql).toContain("Ganesha connected-world routes are missing or not source-addressed");
      expect(sql).toContain("Living Atlas nodes are missing normalized semantic families");
      expect(sql).toContain("Living-culture travel nodes are missing or outside their evidence boundaries");
      expect(sql).toContain("Living-culture travel routes are missing official citation-only sources");
      expect(sql).toContain("Dutt Ramayana Atlas node is missing its selected-edition boundary");
      expect(sql).toContain("Dutt Ramayana narrative constellation nodes are missing or outside their selected-edition boundaries");
      expect(sql).toContain("Source-addressed Living Atlas edges are missing exact source addresses");
      expect(sql).toContain("Distinct Diwali Atlas lanes are missing or misrouted");
      expect(sql).toContain("Sacred Time Atlas lanes are missing, unbounded, or not source-addressed");
      expect(sql).toContain("Sacred Time practice-cycle nodes are missing or outside their evidence boundaries");
      expect(sql).toContain("Sacred Time practice-cycle routes are missing or not source-addressed");
      expect(sql).toContain("delete from public.atlas_edges");
      expect(sql).toContain("where visual->>'sourceId' = any");
      expect(sql).not.toContain("alter function");
      expect(sql).not.toContain("grant execute");
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
