const fs = require("node:fs");
const path = require("node:path");
const ts = require(path.resolve(__dirname, "../apps/web/node_modules/typescript"));

const ROOT = path.resolve(__dirname, "..");
const ATLAS_SOURCE = path.join(ROOT, "apps/web/src/data/atlas.ts");
const OUTPUT = process.argv[2]
  ? path.resolve(ROOT, process.argv[2])
  : path.join(ROOT, "supabase/migrations/20260809170000_sync_current_living_atlas.sql");

const DEVIMAHATMYA_NARRATIVE_CONSTELLATION_NODE_SLUGS = [
  "king-suratha", "merchant-samadhi", "sage-medhas", "medhas-hermitage-story-world", "mahamaya",
  "suratha-samadhi-seek-counsel", "madhu-kaitabha-awakening", "mahishasura-battle", "kaushiki", "kalika",
  "dhumralochana", "chanda-munda", "chamunda", "raktabija", "shumbha-nishumbha-battle", "granting-of-boons",
];
const DEVIMAHATMYA_SEMANTIC_NODE_SLUGS = [
  "madhu-kaitabha", "mahishasura", "shumbha", "nishumbha",
  ...DEVIMAHATMYA_NARRATIVE_CONSTELLATION_NODE_SLUGS,
];
const ENTITY_BOUND_NODE_SLUGS = [...DEVIMAHATMYA_SEMANTIC_NODE_SLUGS, "ganesha-purana"];
const DEVIMAHATMYA_SEMANTIC_EDGE_IDS = DEVIMAHATMYA_SEMANTIC_NODE_SLUGS.map((slug) => `devi-mahatmya-${slug}`);
const DISTINCT_DIWALI_NODE_SLUGS = ["kali-chaudas-baps", "gujarati-new-year-baps", "balipadyami-karnataka", "jain-diwali", "bandi-chhor-divas"];
const DISTINCT_DIWALI_EDGE_IDS = ["naraka-to-kali-chaudas-baps", "bali-to-gujarati-new-year-baps", "bali-to-balipadyami-karnataka", "diwali-to-jain-diwali", "diwali-to-bandi-chhor-divas"];
const DUTT_NARRATIVE_CONSTELLATION_NODE_SLUGS = [
  "rama", "sita", "lakshmana", "hanuman", "ravana", "sugriva", "king-janaka", "king-dasharatha",
  "mithila-story-world", "panchavati-story-world", "kishkindha-story-world", "lanka-story-world",
  "forest-exile", "sita-abduction", "rama-sugriva-alliance", "hanuman-ocean-crossing", "bridge-to-lanka", "return-to-ayodhya",
  "pushpaka-departure-lanka", "remembered-homeward-route", "bharadvaja-homecoming-counsel",
  "hanuman-carries-homecoming-message", "bharata-hears-return", "ayodhya-prepares-homecoming",
  "rama-coronation-return", "vibhishana", "bharadvaja", "bharadvaja-hermitage-story-world",
  "guha", "bharata", "nandigrama-story-world", "shatrughna", "vasishta",
];
const SACRED_TIME_NODE_SLUGS = [
  "krishna-janmashtami", "radha-ashtami", "vishwakarma-puja", "pitru-paksha", "karwa-chauth", "ahoi-ashtami",
  "chhath-puja", "tulasi-vivah", "dev-deepawali", "kalabhairava-jayanti", "vivaha-panchami", "gita-jayanti",
];
const SACRED_TIME_EDGE_IDS = [
  "sacred-time-to-janmashtami", "janmashtami-to-radha-ashtami", "sacred-time-to-vishwakarma", "vishwakarma-to-kolkata",
  "sacred-time-to-pitru-paksha", "pitru-paksha-to-navaratri", "sacred-time-to-karwa-chauth", "karwa-chauth-to-ahoi",
  "ahoi-to-diwali", "diwali-to-chhath", "diwali-to-tulasi-vivah", "sacred-time-to-dev-deepawali", "dev-deepawali-to-kashi",
  "kashi-to-kalabhairava-jayanti", "sacred-time-to-vivaha-panchami", "vivaha-panchami-to-sita", "vivaha-panchami-to-rama",
  "vivaha-panchami-to-mithila", "sacred-time-to-gita-jayanti",
];
const PRACTICE_CYCLE_NODE_SLUGS = [
  "agastya-arghya", "sage-agastya", "hala-shashthi", "balarama", "hartalika-teej", "parvati", "shiva",
  "ekadashi-cycle", "vishnu", "krishna", "kojagara-sharad-purnima", "lakshmi", "masika-durgashtami",
  "masika-shivaratri", "pradosha-cycle", "purnima-amavasya-cycle", "rishi-panchami", "saptarishi",
  "sankranti-cycle", "surya", "weekday-rhythm", "jain-diwali-lay-remembrance",
];
const PRACTICE_CYCLE_EDGE_IDS = [
  "sacred-time-to-agastya-arghya", "agastya-arghya-to-sage-agastya", "sacred-time-to-hala-shashthi",
  "hala-shashthi-to-balarama", "sacred-time-to-hartalika-teej", "hartalika-teej-to-parvati", "parvati-to-shiva",
  "durga-to-parvati-hartalika", "lakshmi-puja-to-lakshmi",
  "sacred-time-to-ekadashi-cycle", "ekadashi-cycle-to-vishnu", "ekadashi-cycle-to-krishna", "sacred-time-to-kojagara",
  "kojagara-to-lakshmi", "kojagara-to-krishna", "sacred-time-to-masika-durgashtami", "masika-durgashtami-to-durga",
  "sacred-time-to-masika-shivaratri", "masika-shivaratri-to-shiva", "sacred-time-to-pradosha-cycle",
  "pradosha-cycle-to-shiva", "pradosha-to-masika-shivaratri", "sacred-time-to-purnima-amavasya-cycle",
  "purnima-amavasya-to-pitru-paksha", "purnima-amavasya-to-kojagara", "sacred-time-to-rishi-panchami",
  "rishi-panchami-to-saptarishi", "sacred-time-to-sankranti-cycle", "sankranti-cycle-to-surya",
  "sankranti-to-vishwakarma", "sacred-time-to-weekday-rhythm", "weekday-rhythm-to-surya", "weekday-rhythm-to-shiva",
  "weekday-rhythm-to-ganesha", "weekday-rhythm-to-durga", "jain-diwali-to-lay-remembrance", "gita-jayanti-to-krishna",
  "janmashtami-to-krishna", "govardhana-to-krishna", "chhath-to-surya",
];
const GANESHA_CONNECTED_WORLD_NODE_SLUGS = [
  "ganesha-cosmic-world", "ganesha-five-elements", "ganesha-one-tusked-form", "ganesha-mouse-emblem",
  "ganesha-eight-names", "ganesha-ekadanta", "ganesha-lambodara", "ganesha-vighnanashin",
  "public-ganeshotsav-1893", "ganeshotsav-community-pandal", "ganeshotsav-clay-murti",
  "ganeshotsav-modak", "ganeshotsav-visarjan",
];
const GANESHA_CONNECTED_WORLD_EDGE_IDS = [
  "ganesha-to-cosmic-world", "atharvashirsha-to-cosmic-world", "cosmic-world-to-five-elements",
  "atharvashirsha-to-one-tusked-form", "one-tusked-form-to-mouse-emblem", "atharvashirsha-to-eight-names",
  "eight-names-to-ekadanta", "ekadanta-to-one-tusked-form", "eight-names-to-lambodara",
  "eight-names-to-vighnanashin", "ganesha-to-shiva-source-kinship", "ganesh-chaturthi-to-public-ganeshotsav",
  "public-ganeshotsav-to-community-pandal", "ganesh-chaturthi-to-community-pandal", "ganesh-chaturthi-to-clay-murti",
  "ganesh-chaturthi-to-modak", "clay-murti-to-visarjan", "ganesh-chaturthi-to-visarjan",
  "ganeshotsav-visarjan-to-ananta",
];
const LIVING_CULTURE_NODE_SLUGS = [
  "ramlila-performance", "ramlila-community-stage", "ramnagar-ramlila", "dussehra-performance-season",
  "durga-puja-public-art", "kumartuli-artisan-workshops", "durga-puja-clay-image",
  "durga-puja-installations", "durga-puja-dhak", "durga-puja-immersion-return",
];
const LIVING_CULTURE_EDGE_IDS = [
  "ramayana-to-ramlila", "ramcharitmanas-to-ramlila", "ramlila-to-community-stage", "ramlila-to-ramnagar",
  "ramlila-to-dussehra-season", "dussehra-season-to-navaratri", "ramnagar-ramlila-to-kashi",
  "durga-puja-to-public-art", "public-art-to-kolkata", "durga-puja-to-kumartuli", "kumartuli-to-clay-image",
  "public-art-to-installations", "public-art-to-dhak", "clay-image-to-seasonal-return", "installations-to-kolkata",
  "seasonal-return-to-kolkata",
];
const HAMPI_KISHKINDHA_NODE_SLUGS = [
  "kishkindha-living-landscape", "anegundi", "anjanadri-hill-tradition", "tungabhadra-landscape",
  "hampi-world-heritage", "vijayanagara-capital", "vijayanagara-empire", "krishna-deva-raya",
  "virupaksha-temple-hampi", "vitthala-temple-complex", "stone-chariot-hampi",
  "vijayanagara-architecture", "talikota-1565",
];
const HAMPI_KISHKINDHA_EDGE_IDS = [
  "kishkindha-story-to-living-landscape", "living-kishkindha-to-anegundi", "anegundi-to-anjanadri",
  "anjanadri-to-hanuman", "anegundi-to-tungabhadra", "tungabhadra-to-hampi",
  "hampi-to-vijayanagara-capital", "capital-to-vijayanagara-empire", "vijayanagara-empire-to-krishnadevaraya",
  "hampi-to-virupaksha", "virupaksha-to-shiva", "hampi-to-vitthala", "vitthala-to-stone-chariot",
  "vijayanagara-to-architecture", "architecture-to-vitthala", "capital-to-talikota-1565",
  "talikota-to-hampi-horizon", "hampi-to-vijayanagara-architecture",
];
const KOLKATA_SHAKTA_NODE_SLUGS = [
  "kalighat-kali-temple", "kalighat-kali-form", "kalighat-art-transition", "kalighat-pat",
  "kalighat-patua-community", "dakshineswar-kali-temple", "bhavatarini-dakshineswar",
  "rani-rashmoni", "ramakrishna-dakshineswar", "dakshineswar-shiva-temples",
  "dakshineswar-radha-krishna-temple", "dakshineswar-shyama-puja",
];
const KOLKATA_SHAKTA_EDGE_IDS = [
  "kali-puja-to-kalighat-temple", "kalighat-temple-to-kali-form", "kalighat-temple-to-durga-puja",
  "kalighat-temple-to-kolkata", "kalighat-temple-to-art-transition", "art-transition-to-kalighat-pat",
  "kalighat-pat-to-patua-community", "kali-puja-to-dakshineswar-shyama-puja",
  "dakshineswar-shyama-puja-to-temple", "dakshineswar-to-bhavatarini", "dakshineswar-to-rani-rashmoni",
  "dakshineswar-to-ramakrishna", "rani-rashmoni-to-ramakrishna", "dakshineswar-to-shiva-temples",
  "shiva-temples-to-shiva", "dakshineswar-to-radha-krishna-temple", "radha-krishna-temple-to-krishna",
  "dakshineswar-to-kolkata", "kalighat-form-to-kalika-comparison", "kalighat-temple-to-dakshineswar",
];
const KASHI_SACRED_CITY_NODE_SLUGS = [
  "kashi-vishwanath-temple", "vishvanatha-kashi", "ganga-varanasi", "varanasi-ghats",
  "dashashwamedh-ghat", "kalabhairava-kashi-temple", "annapurna-kashi-temple",
  "tulsi-manas-temple", "tulsidas-varanasi", "sankat-mochan-varanasi", "sarnath",
  "buddha-sarnath", "first-sermon-sarnath", "buddhist-sangha-sarnath",
  "varanasi-city-of-music", "varanasi-guru-shishya-music", "banaras-brocades-sarees",
  "banaras-weaver-community", "maratha-ghat-patronage", "kashi-rulers-music-patronage",
  "ganga-mahotsav-varanasi",
];
const KASHI_SACRED_CITY_EDGE_IDS = [
  "diwali-to-dev-deepawali", "kashi-to-vishwanath-temple", "vishwanath-temple-to-vishvanatha",
  "vishvanatha-to-shiva", "vishwanath-temple-to-ganga", "kashi-to-ganga", "ganga-to-varanasi-ghats",
  "varanasi-ghats-to-dashashwamedh", "dev-deepawali-to-varanasi-ghats", "varanasi-ghats-to-maratha-patronage",
  "kashi-to-kalabhairava-temple", "kalabhairava-temple-to-jayanti", "kashi-to-annapurna-temple",
  "kashi-to-tulsi-manas-temple", "tulsi-manas-temple-to-tulsidas", "tulsidas-to-ramcharitmanas",
  "tulsi-manas-temple-to-rama", "kashi-to-sankat-mochan", "sankat-mochan-to-hanuman",
  "tulsidas-to-sankat-mochan", "kashi-to-ramnagar-ramlila", "kashi-to-sarnath", "sarnath-to-buddha",
  "buddha-to-first-sermon", "first-sermon-to-sangha", "kashi-to-city-of-music",
  "city-of-music-to-guru-shishya", "city-of-music-to-kashi-patronage", "city-of-music-to-ramlila",
  "kashi-to-banaras-brocades", "brocades-to-weaver-community", "kashi-to-ganga-mahotsav",
  "ganga-mahotsav-to-music", "ganga-mahotsav-to-brocades",
];
const RETIRED_EDGE_IDS = ["diwali-kolkata", "kali-puja-to-kalika", "kali-puja-to-durga", "diwali-kashi"];
const WORLD_NODE_FAMILIES = new Set([
  "being_person", "event_story", "place_polity", "time_observance", "practice_material",
  "source_expression", "institution_community", "idea_wisdom", "art_culture", "historical_process",
]);
const WORLD_RELATION_KINDS = new Set(["story", "festival", "practice", "text", "place", "kinship", "identity", "time", "history", "teaching", "association"]);

const moduleCache = new Map();

function loadTypescriptModule(filename) {
  const resolved = path.resolve(filename);
  if (moduleCache.has(resolved)) return moduleCache.get(resolved).exports;
  const source = fs.readFileSync(resolved, "utf8");
  const javascript = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const loaded = { exports: {} };
  moduleCache.set(resolved, loaded);
  const localRequire = (specifier) => {
    if (specifier.startsWith("@/")) return loadTypescriptModule(path.join(ROOT, "apps/web/src", `${specifier.slice(2)}.ts`));
    if (specifier.startsWith(".")) return loadTypescriptModule(path.join(path.dirname(resolved), `${specifier}.ts`));
    return require(specifier);
  };
  new Function("exports", "module", "require", javascript)(loaded.exports, loaded, localRequire);
  return loaded.exports;
}

function loadAtlas() {
  return loadTypescriptModule(ATLAS_SOURCE);
}

function sqlText(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlJson(value) {
  return `${sqlText(JSON.stringify(value))}::jsonb`;
}

function sqlNullable(value) {
  return value == null ? "null" : sqlText(value);
}

function nodeRow(node, gateway) {
  const visual = gateway
    ? {
        sourceId: node.id,
        tone: node.tone,
        threads: node.threads,
        invitation: node.invitation,
      }
    : {
        sourceId: node.id,
        size: node.size,
        eras: node.eras,
        gatewayId: node.gatewayId,
        family: node.family,
        summary: node.summary,
        searchQuery: node.searchQuery,
        evidenceBoundary: node.evidenceBoundary,
      };
  return `(${[
    sqlText(node.id),
    sqlText(gateway ? node.title : node.label),
    gateway ? sqlNullable(node.devanagari) : "null",
    sqlText(gateway ? "gateway" : node.kind),
    gateway ? "true" : "false",
    sqlJson(node.position),
    sqlJson(visual),
    gateway ? "1.00" : Number(node.revealAt).toFixed(2),
    sqlText("product_allowed"),
    sqlText("published"),
  ].join(", ")})`;
}

function validateAtlas(gateways, worldNodes, worldEdges) {
  if (gateways.length !== 5 || worldNodes.length !== 203 || worldEdges.length !== 343) {
    throw new Error(`Unexpected Atlas shape: ${gateways.length} gateways, ${worldNodes.length} world nodes, ${worldEdges.length} edges`);
  }
  const nodeIds = [...gateways, ...worldNodes].map((node) => node.id);
  if (new Set(nodeIds).size !== 208) throw new Error("Atlas node IDs must be unique");
  if (new Set(worldEdges.map((edge) => edge.id)).size !== 343) throw new Error("Atlas edge IDs must be unique");
  const edgeKeys = worldEdges.map((edge) => `${edge.from}\u0000${edge.to}\u0000${edge.relation}`);
  if (new Set(edgeKeys).size !== 343) throw new Error("Atlas edge endpoint and label triples must be unique");
  if (worldNodes.some((node) => !WORLD_NODE_FAMILIES.has(node.family))) throw new Error("Atlas nodes must declare a normalized family");
  const ids = new Set(nodeIds);
  for (const edge of worldEdges) {
    if (!ids.has(edge.from) || !ids.has(edge.to) || edge.from === edge.to || edge.relation.length < 3 || !WORLD_RELATION_KINDS.has(edge.relationKind)) {
      throw new Error(`Invalid Atlas edge ${edge.id}`);
    }
  }
  for (const slug of DEVIMAHATMYA_SEMANTIC_NODE_SLUGS) {
    const node = worldNodes.find((candidate) => candidate.id === slug);
    const edge = worldEdges.find((candidate) => candidate.id === `devi-mahatmya-${slug}`);
    if (!node || node.gatewayId !== "durga" || edge?.from !== "devi-mahatmya" || edge.to !== slug || edge.relation !== "contains narrative of") {
      throw new Error(`Source-bounded Devimahatmya Atlas route is missing or invalid for ${slug}`);
    }
  }
  if (DEVIMAHATMYA_NARRATIVE_CONSTELLATION_NODE_SLUGS.some((slug) => !worldNodes.some((node) => node.id === slug && node.gatewayId === "durga"))) {
    throw new Error("Devimahatmya narrative constellation is incomplete");
  }
  const sourceAddressedDevimahatmyaEdges = worldEdges.filter((edge) =>
    DEVIMAHATMYA_NARRATIVE_CONSTELLATION_NODE_SLUGS.includes(edge.from)
    || DEVIMAHATMYA_NARRATIVE_CONSTELLATION_NODE_SLUGS.includes(edge.to)
  ).filter((edge) => edge.id !== "kalighat-form-to-kalika-comparison");
  if (sourceAddressedDevimahatmyaEdges.length !== 37 || sourceAddressedDevimahatmyaEdges.some((edge) => !edge.sourceRef?.includes("sha256:"))) {
    throw new Error("Devimahatmya narrative constellation has missing source addresses");
  }
  const ganeshaPuranaNode = worldNodes.find((candidate) => candidate.id === "ganesha-purana");
  const ganeshaPuranaEdge = worldEdges.find((candidate) => candidate.id === "ganesha-ganesha-purana");
  if (!ganeshaPuranaNode || ganeshaPuranaNode.gatewayId !== "ganesha" || ganeshaPuranaEdge?.from !== "ganesha" || ganeshaPuranaEdge.to !== "ganesha-purana") {
    throw new Error("Source-bounded Ganesha Purana Atlas route is missing or invalid");
  }
  const atharvashirshaNode = worldNodes.find((candidate) => candidate.id === "ganapatyatharvashirsha");
  const atharvashirshaEdge = worldEdges.find((candidate) => candidate.id === "ganesha-ganapatyatharvashirsha");
  if (!atharvashirshaNode || atharvashirshaNode.gatewayId !== "ganesha" || atharvashirshaEdge?.from !== "ganesha" || atharvashirshaEdge.to !== "ganapatyatharvashirsha") {
    throw new Error("Exact-revision Ganapati Atharvashirsha Atlas route is missing or invalid");
  }
  if (GANESHA_CONNECTED_WORLD_NODE_SLUGS.some((slug) => !worldNodes.some((node) => node.id === slug && node.gatewayId === "ganesha" && node.evidenceBoundary.length >= 80))) {
    throw new Error("Ganesha connected-world constellation is incomplete");
  }
  if (GANESHA_CONNECTED_WORLD_EDGE_IDS.some((edgeId) => !worldEdges.some((edge) => edge.id === edgeId && edge.sourceRef?.includes("sha256:")))) {
    throw new Error("Ganesha connected-world constellation has missing source addresses");
  }
  if (LIVING_CULTURE_NODE_SLUGS.some((slug) => !worldNodes.some((node) => node.id === slug && node.evidenceBoundary.length >= 100))) {
    throw new Error("Living-culture travel constellation is incomplete");
  }
  if (LIVING_CULTURE_EDGE_IDS.some((edgeId) => !worldEdges.some((edge) => edge.id === edgeId && edge.sourceRef?.startsWith("citation:https://ich.unesco.org/")))) {
    throw new Error("Living-culture travel routes are missing official citation-only sources");
  }
  if (HAMPI_KISHKINDHA_NODE_SLUGS.some((slug) => !worldNodes.some((node) => node.id === slug && node.gatewayId === "ramayana" && node.evidenceBoundary.length >= 100))) {
    throw new Error("Hampi-Kishkindha-Vijayanagara place-history constellation is incomplete");
  }
  if (HAMPI_KISHKINDHA_EDGE_IDS.some((edgeId) => !worldEdges.some((edge) => edge.id === edgeId
    && /^citation:https:\/\/(?:whc\.unesco\.org|karnatakatourism\.org)\//.test(edge.sourceRef ?? "")
    && edge.evidenceBoundary?.length >= 100))) {
    throw new Error("Hampi-Kishkindha-Vijayanagara routes are missing official citation-only sources or evidence boundaries");
  }
  if (KOLKATA_SHAKTA_NODE_SLUGS.some((slug) => !worldNodes.some((node) => node.id === slug
    && node.gatewayId === (slug === "dakshineswar-shyama-puja" ? "diwali" : "durga")
    && node.evidenceBoundary.length >= 100))) {
    throw new Error("Kolkata-Kalighat-Dakshineswar constellation is incomplete");
  }
  if (KOLKATA_SHAKTA_EDGE_IDS.some((edgeId) => !worldEdges.some((edge) => edge.id === edgeId
    && /^citation:https:\/\/(?:www\.(?:incredibleindia\.gov\.in|wbtourism\.gov\.in|prod\.incredibleindia\.gov\.in|kmcgov\.in)|dakshineswarkalitemple\.org|dakshineshwar\.rkmm\.org)\//.test(edge.sourceRef ?? "")
    && edge.evidenceBoundary?.length >= 100
    && WORLD_RELATION_KINDS.has(edge.relationKind)))) {
    throw new Error("Kolkata-Kalighat-Dakshineswar routes are missing official citation-only sources or evidence boundaries");
  }
  if (KASHI_SACRED_CITY_NODE_SLUGS.some((slug) => !worldNodes.some((node) => node.id === slug
    && node.gatewayId === "diwali"
    && node.evidenceBoundary.length >= 100))) {
    throw new Error("Kashi sacred-city constellation is incomplete");
  }
  if (KASHI_SACRED_CITY_EDGE_IDS.some((edgeId) => !worldEdges.some((edge) => edge.id === edgeId
    && /^citation:https:\/\/(?:varanasi\.nic\.in|www\.(?:incredibleindia\.gov\.in|unesco\.org)|ich\.unesco\.org|search\.ipindia\.gov\.in)\//.test(edge.sourceRef ?? "")
    && edge.evidenceBoundary?.length >= 100
    && WORLD_RELATION_KINDS.has(edge.relationKind)))) {
    throw new Error("Kashi sacred-city routes are missing official citation-only sources or evidence boundaries");
  }
  const duttNode = worldNodes.find((candidate) => candidate.id === "dutt-ramayana");
  const duttEdge = worldEdges.find((candidate) => candidate.id === "ramayana-dutt-ramayana");
  if (!duttNode || duttNode.gatewayId !== "ramayana" || duttEdge?.from !== "ramayana" || duttEdge.to !== "dutt-ramayana") {
    throw new Error("Source-bounded Dutt Ramayana Atlas route is missing or invalid");
  }
  if (DUTT_NARRATIVE_CONSTELLATION_NODE_SLUGS.some((slug) => !worldNodes.some((node) => node.id === slug && node.gatewayId === "ramayana"))) {
    throw new Error("Dutt Ramayana narrative constellation is incomplete");
  }
  const chalisaNode = worldNodes.find((candidate) => candidate.id === "hanuman-chalisa");
  const chalisaEdges = worldEdges.filter((edge) => edge.id === "hanuman-to-hanuman-chalisa" || edge.id === "hanuman-chalisa-to-ramayana");
  if (!chalisaNode || chalisaNode.gatewayId !== "ramayana" || chalisaNode.family !== "source_expression"
    || chalisaEdges.length !== 2
    || chalisaEdges.some((edge) => edge.relationKind !== "text"
      || edge.sourceRef !== "sha256:b39721a0a96f21d659b6b74f32ff5e0469220b5fa2813cc93733702d43ac02d5"
      || (edge.evidenceBoundary?.length ?? 0) < 100)) {
    throw new Error("Hanuman Chalisa Atlas reading world is incomplete or outside its fixed carrier boundary");
  }
  const sourceAddressedAtlasEdges = worldEdges.filter((edge) => edge.sourceRef?.includes("sha256:"));
  if (sourceAddressedAtlasEdges.length !== 219 || sourceAddressedAtlasEdges.some((edge) => !edge.sourceRef?.includes("sha256:"))) {
    throw new Error("Living Atlas source-addressed routes are incomplete");
  }
  for (let index = 0; index < DISTINCT_DIWALI_NODE_SLUGS.length; index += 1) {
    const node = worldNodes.find((candidate) => candidate.id === DISTINCT_DIWALI_NODE_SLUGS[index]);
    const edge = worldEdges.find((candidate) => candidate.id === DISTINCT_DIWALI_EDGE_IDS[index]);
    if (!node || node.gatewayId !== "diwali" || !edge || edge.to !== node.id) {
      throw new Error(`Distinct Diwali Atlas lane is missing or invalid for ${DISTINCT_DIWALI_NODE_SLUGS[index]}`);
    }
  }
  const requiredBridgeIds = ["ramayana-to-diwali", "diwali-to-kali-puja", "kali-puja-to-kalighat-temple", "kalighat-temple-to-durga-puja", "durga-to-durga-puja", "durga-puja-to-kolkata"];
  for (const edgeId of requiredBridgeIds) {
    const edge = worldEdges.find((candidate) => candidate.id === edgeId);
    if (!edge || typeof edge.evidenceBoundary !== "string" || edge.evidenceBoundary.length < 80) {
      throw new Error(`Evidence-bounded cross-world Atlas route is missing or invalid for ${edgeId}`);
    }
  }
  if (!gateways.some((gateway) => gateway.id === "sacred-time" && gateway.tone === "violet")) {
    throw new Error("Sacred Time gateway is missing or invalid");
  }
  for (const slug of SACRED_TIME_NODE_SLUGS) {
    const node = worldNodes.find((candidate) => candidate.id === slug);
    if (!node || node.gatewayId !== "sacred-time" || node.evidenceBoundary.length < 80) {
      throw new Error(`Sacred Time node is missing or insufficiently bounded for ${slug}`);
    }
  }
  for (const edgeId of SACRED_TIME_EDGE_IDS) {
    const edge = worldEdges.find((candidate) => candidate.id === edgeId);
    if (!edge?.sourceRef?.match(/^sha256:[0-9a-f]{64}#ritual-pack$/)) {
      throw new Error(`Sacred Time edge is missing its immutable ritual-pack coordinate for ${edgeId}`);
    }
  }
  for (const slug of PRACTICE_CYCLE_NODE_SLUGS) {
    const node = worldNodes.find((candidate) => candidate.id === slug);
    if (!node || node.evidenceBoundary.length < 80) {
      throw new Error(`Practice-cycle node is missing or insufficiently bounded for ${slug}`);
    }
  }
  for (const edgeId of PRACTICE_CYCLE_EDGE_IDS) {
    const edge = worldEdges.find((candidate) => candidate.id === edgeId);
    if (!edge?.sourceRef?.match(/^sha256:[0-9a-f]{64}#ritual-pack$/)) {
      throw new Error(`Practice-cycle edge is missing its immutable ritual-pack coordinate for ${edgeId}`);
    }
  }
}

function buildMigration() {
  const { gateways, worldNodes, worldEdges } = loadAtlas();
  validateAtlas(gateways, worldNodes, worldEdges);

  const allNodes = [...gateways, ...worldNodes];
  const nodeRows = [
    ...gateways.map((node) => nodeRow(node, true)),
    ...worldNodes.map((node) => nodeRow(node, false)),
  ].join(",\n  ");
  const edgeRows = worldEdges
    .map((edge) => `(${sqlText(edge.id)}, ${sqlText(edge.from)}, ${sqlText(edge.to)}, ${sqlText(edge.relation)}, ${sqlText(edge.relationKind)}, ${sqlNullable(edge.evidenceBoundary)}, ${sqlNullable(edge.sourceRef)})`)
    .join(",\n  ");
  const nodeSlugArray = allNodes.map((node) => sqlText(node.id)).join(", ");
  const edgeIdArray = worldEdges.map((edge) => sqlText(edge.id)).join(", ");
  const edgeDeleteIdArray = [...worldEdges.map((edge) => edge.id), ...RETIRED_EDGE_IDS].map(sqlText).join(", ");
  const semanticNodeRows = ENTITY_BOUND_NODE_SLUGS.map((slug) => `(${sqlText(slug)}, ${sqlText(slug)})`).join(",\n  ");
  const semanticEdgeRows = DEVIMAHATMYA_SEMANTIC_NODE_SLUGS.map((slug, index) => `(${sqlText(DEVIMAHATMYA_SEMANTIC_EDGE_IDS[index])}, ${sqlText(slug)})`).join(",\n  ");
  const sourceAddressedAtlasEdgeIds = worldEdges.filter((edge) => edge.sourceRef?.includes("sha256:")).map((edge) => edge.id);

  return `-- Generated from apps/web/src/data/atlas.ts by
-- tools/compile_current_living_atlas_seed.cjs.
-- This migration upserts app-owned nodes and replaces app-owned edge metadata only. It does not alter
-- RLS, functions, grants, source evidence, or independently managed Atlas rows.

begin;

insert into public.atlas_nodes (
  slug, title, subtitle, node_kind, is_gateway, position, visual, reveal_at,
  rights_lane, publication_state
)
values
  ${nodeRows}
on conflict (slug) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  node_kind = excluded.node_kind,
  is_gateway = excluded.is_gateway,
  position = excluded.position,
  visual = excluded.visual,
  reveal_at = excluded.reveal_at,
  rights_lane = excluded.rights_lane,
  publication_state = excluded.publication_state,
  updated_at = now();

-- Edge identity in Postgres is the endpoint-and-label triple. Remove only the
-- exact reviewed app-owned source IDs before reinserting so a formerly
-- misrouted or relabelled app edge cannot survive beside its current version.
-- Independently managed edges have no reviewed source ID and remain untouched.
delete from public.atlas_edges
where visual->>'sourceId' = any (array[${edgeDeleteIdArray}]);

insert into public.atlas_edges (
  source_node_id, target_node_id, label, visual, rights_lane, publication_state
)
select source.id, target.id, edge.label,
  jsonb_strip_nulls(jsonb_build_object('sourceId', edge.source_id, 'relationKind', edge.relation_kind, 'evidenceBoundary', edge.evidence_boundary, 'sourceRef', edge.source_ref)),
  'product_allowed', 'published'
from (values
  ${edgeRows}
) as edge(source_id, source_slug, target_slug, label, relation_kind, evidence_boundary, source_ref)
join public.atlas_nodes source on source.slug = edge.source_slug
join public.atlas_nodes target on target.slug = edge.target_slug
on conflict (source_node_id, target_node_id, label) do update set
  visual = excluded.visual,
  rights_lane = excluded.rights_lane,
  publication_state = excluded.publication_state;

with mapping(atlas_slug, entity_slug) as (values
  ${semanticNodeRows}
)
update public.atlas_nodes atlas
set entity_id = entity.id,
    updated_at = now()
from mapping
join public.entities entity on entity.slug = mapping.entity_slug
  and entity.publication_state = 'published'
where atlas.slug = mapping.atlas_slug;

with mapping(edge_source_id, object_slug) as (values
  ${semanticEdgeRows}
)
update public.atlas_edges atlas_edge
set relationship_id = relationship.id
from mapping
join public.atlas_nodes source_node on source_node.slug = 'devi-mahatmya'
join public.atlas_nodes target_node on target_node.slug = mapping.object_slug
join public.entities subject_entity on subject_entity.slug = 'devi-mahatmya'
join public.entities object_entity on object_entity.slug = mapping.object_slug
join public.relationships relationship
  on relationship.subject_entity_id = subject_entity.id
  and relationship.object_entity_id = object_entity.id
  and relationship.predicate = 'contains_narrative_of'
  and relationship.publication_state = 'published'
where atlas_edge.source_node_id = source_node.id
  and atlas_edge.target_node_id = target_node.id
  and atlas_edge.label = 'contains narrative of'
  and atlas_edge.visual->>'sourceId' = mapping.edge_source_id;

do $$
declare
  app_node_count integer;
  app_edge_count integer;
begin
  select count(*) into app_node_count
  from public.atlas_nodes
  where slug = any (array[${nodeSlugArray}])
    and visual->>'sourceId' = slug
    and publication_state = 'published'
    and rights_lane = 'product_allowed';

  select count(*) into app_edge_count
  from public.atlas_edges
  where visual->>'sourceId' = any (array[${edgeIdArray}])
    and publication_state = 'published'
    and rights_lane = 'product_allowed';

  if app_node_count <> ${allNodes.length} then
    raise exception 'Expected ${allNodes.length} app-owned Living Atlas nodes, found %', app_node_count;
  end if;
  if app_edge_count <> ${worldEdges.length} then
    raise exception 'Expected ${worldEdges.length} app-owned Living Atlas edges, found %', app_edge_count;
  end if;
  if (
    select count(*)
    from public.atlas_nodes atlas
    where atlas.slug = any (array[${worldNodes.map((node) => sqlText(node.id)).join(", ")}])
      and atlas.visual->>'family' = any (array[${[...WORLD_NODE_FAMILIES].map(sqlText).join(", ")}])
  ) <> ${worldNodes.length} then
    raise exception 'Living Atlas nodes are missing normalized semantic families';
  end if;
  if not exists (
    select 1
    from public.atlas_nodes
    where slug = 'ramcharitmanas'
      and visual->>'sourceId' = 'ramcharitmanas'
      and visual->>'gatewayId' = 'ramayana'
      and visual->>'searchQuery' = 'Ramcharitmanas seven sopanas Belvedere Press'
      and visual->>'evidenceBoundary' like '%359 low-quality pages%'
      and visual->>'evidenceBoundary' like '%11 markup anomalies%'
  ) then
    raise exception 'Ramcharitmanas Atlas node is missing its exact reviewed boundary';
  end if;
  if not exists (
    select 1
    from public.atlas_edges edge
    join public.atlas_nodes source on source.id = edge.source_node_id
    join public.atlas_nodes target on target.id = edge.target_node_id
    where edge.visual->>'sourceId' = 'ramayana-ramcharitmanas'
      and source.slug = 'ramayana'
      and target.slug = 'ramcharitmanas'
      and edge.label = 'Awadhi devotional telling'
  ) then
    raise exception 'Ramcharitmanas Atlas relationship is missing or misrouted';
  end if;
  if (
    select count(*)
    from public.atlas_nodes atlas
    join public.entities entity on entity.id = atlas.entity_id and entity.slug = atlas.slug
    where atlas.slug = any (array[${DEVIMAHATMYA_SEMANTIC_NODE_SLUGS.map(sqlText).join(", ")}])
      and atlas.visual->>'gatewayId' = 'durga'
      and atlas.visual->>'evidenceBoundary' like '%Wikisource revision%'
  ) <> ${DEVIMAHATMYA_SEMANTIC_NODE_SLUGS.length} then
    raise exception 'Devimahatmya semantic Atlas nodes are not bound to their entities and source boundary';
  end if;
  if (
    select count(*)
    from public.atlas_edges edge
    join public.relationships relationship on relationship.id = edge.relationship_id
    join public.entities subject on subject.id = relationship.subject_entity_id
    join public.entities object on object.id = relationship.object_entity_id
    where edge.visual->>'sourceId' = any (array[${DEVIMAHATMYA_SEMANTIC_EDGE_IDS.map(sqlText).join(", ")}])
      and subject.slug = 'devi-mahatmya'
      and object.slug = any (array[${DEVIMAHATMYA_SEMANTIC_NODE_SLUGS.map(sqlText).join(", ")}])
      and relationship.predicate = 'contains_narrative_of'
  ) <> ${DEVIMAHATMYA_SEMANTIC_NODE_SLUGS.length} then
    raise exception 'Devimahatmya semantic Atlas edges are not bound to their evidence-linked relationships';
  end if;
  if not exists (
    select 1
    from public.atlas_nodes atlas
    join public.entities entity on entity.id = atlas.entity_id
    where atlas.slug = 'ganesha-purana'
      and entity.slug = 'ganesha-purana'
      and atlas.visual->>'gatewayId' = 'ganesha'
      and atlas.visual->>'searchQuery' = 'Ganesha Purana two khandas 247 chapters'
      and atlas.visual->>'evidenceBoundary' like '%65 pinned Wikisource revisions%'
  ) then
    raise exception 'Ganesha Purana Atlas node is not bound to its exact source entity and boundary';
  end if;
  if not exists (
    select 1
    from public.atlas_nodes atlas
    where atlas.slug = 'ganapatyatharvashirsha'
      and atlas.entity_id is null
      and atlas.visual->>'gatewayId' = 'ganesha'
      and atlas.visual->>'searchQuery' = 'Ganapati Atharvashirsha exact revision 415703'
      and atlas.visual->>'evidenceBoundary' like '%revision 415703%'
      and atlas.visual->>'evidenceBoundary' like '%pronunciation%'
      and atlas.visual->>'evidenceBoundary' like '%formal ritual authority%'
  ) then
    raise exception 'Ganapati Atharvashirsha Atlas node is missing its exact revision or authority boundary';
  end if;
  if (
    select count(*)
    from public.atlas_nodes atlas
    where atlas.slug = any (array[${GANESHA_CONNECTED_WORLD_NODE_SLUGS.map(sqlText).join(", ")}])
      and atlas.visual->>'gatewayId' = 'ganesha'
      and atlas.visual->>'evidenceBoundary' is not null
  ) <> ${GANESHA_CONNECTED_WORLD_NODE_SLUGS.length} then
    raise exception 'Ganesha connected-world nodes are missing or outside their evidence boundaries';
  end if;
  if (
    select count(*)
    from public.atlas_edges edge
    where edge.visual->>'sourceId' = any (array[${GANESHA_CONNECTED_WORLD_EDGE_IDS.map(sqlText).join(", ")}])
      and edge.visual->>'sourceRef' like '%sha256:%'
      and edge.visual->>'relationKind' is not null
  ) <> ${GANESHA_CONNECTED_WORLD_EDGE_IDS.length} then
    raise exception 'Ganesha connected-world routes are missing or not source-addressed';
  end if;
  if (
    select count(*)
    from public.atlas_nodes atlas
    where atlas.slug = any (array[${LIVING_CULTURE_NODE_SLUGS.map(sqlText).join(", ")}])
      and atlas.visual->>'family' is not null
      and atlas.visual->>'evidenceBoundary' is not null
  ) <> ${LIVING_CULTURE_NODE_SLUGS.length} then
    raise exception 'Living-culture travel nodes are missing or outside their evidence boundaries';
  end if;
  if (
    select count(*)
    from public.atlas_edges edge
    where edge.visual->>'sourceId' = any (array[${LIVING_CULTURE_EDGE_IDS.map(sqlText).join(", ")}])
      and edge.visual->>'sourceRef' like 'citation:https://ich.unesco.org/%'
      and edge.visual->>'relationKind' is not null
  ) <> ${LIVING_CULTURE_EDGE_IDS.length} then
    raise exception 'Living-culture travel routes are missing official citation-only sources';
  end if;
  if (
    select count(*)
    from public.atlas_nodes atlas
    where atlas.slug = any (array[${HAMPI_KISHKINDHA_NODE_SLUGS.map(sqlText).join(", ")}])
      and atlas.visual->>'gatewayId' = 'ramayana'
      and atlas.visual->>'family' is not null
      and atlas.visual->>'evidenceBoundary' is not null
  ) <> ${HAMPI_KISHKINDHA_NODE_SLUGS.length} then
    raise exception 'Hampi-Kishkindha-Vijayanagara nodes are missing or outside their evidence boundaries';
  end if;
  if (
    select count(*)
    from public.atlas_edges edge
    where edge.visual->>'sourceId' = any (array[${HAMPI_KISHKINDHA_EDGE_IDS.map(sqlText).join(", ")}])
      and (
        edge.visual->>'sourceRef' like 'citation:https://whc.unesco.org/%'
        or edge.visual->>'sourceRef' like 'citation:https://karnatakatourism.org/%'
      )
      and edge.visual->>'relationKind' is not null
      and edge.visual->>'evidenceBoundary' is not null
  ) <> ${HAMPI_KISHKINDHA_EDGE_IDS.length} then
    raise exception 'Hampi-Kishkindha-Vijayanagara routes are missing official citation-only sources';
  end if;
  if (
    select count(*)
    from public.atlas_nodes atlas
    where atlas.slug = any (array[${KOLKATA_SHAKTA_NODE_SLUGS.map(sqlText).join(", ")}])
      and atlas.visual->>'gatewayId' = case when atlas.slug = 'dakshineswar-shyama-puja' then 'diwali' else 'durga' end
      and atlas.visual->>'family' is not null
      and atlas.visual->>'evidenceBoundary' is not null
  ) <> ${KOLKATA_SHAKTA_NODE_SLUGS.length} then
    raise exception 'Kolkata-Kalighat-Dakshineswar nodes are missing or outside their evidence boundaries';
  end if;
  if (
    select count(*)
    from public.atlas_edges edge
    where edge.visual->>'sourceId' = any (array[${KOLKATA_SHAKTA_EDGE_IDS.map(sqlText).join(", ")}])
      and edge.visual->>'sourceRef' like 'citation:https://%'
      and edge.visual->>'relationKind' is not null
      and edge.visual->>'evidenceBoundary' is not null
  ) <> ${KOLKATA_SHAKTA_EDGE_IDS.length} then
    raise exception 'Kolkata-Kalighat-Dakshineswar routes are missing official citation-only sources';
  end if;
  if (
    select count(*)
    from public.atlas_nodes atlas
    where atlas.slug = any (array[${KASHI_SACRED_CITY_NODE_SLUGS.map(sqlText).join(", ")}])
      and atlas.visual->>'gatewayId' = 'diwali'
      and atlas.visual->>'family' is not null
      and atlas.visual->>'evidenceBoundary' is not null
  ) <> ${KASHI_SACRED_CITY_NODE_SLUGS.length} then
    raise exception 'Kashi sacred-city nodes are missing or outside their evidence boundaries';
  end if;
  if (
    select count(*)
    from public.atlas_edges edge
    where edge.visual->>'sourceId' = any (array[${KASHI_SACRED_CITY_EDGE_IDS.map(sqlText).join(", ")}])
      and edge.visual->>'sourceRef' like 'citation:https://%'
      and edge.visual->>'relationKind' is not null
      and edge.visual->>'evidenceBoundary' is not null
  ) <> ${KASHI_SACRED_CITY_EDGE_IDS.length} then
    raise exception 'Kashi sacred-city routes are missing official citation-only sources';
  end if;
  if exists (
    select 1 from public.atlas_edges edge
    where edge.visual->>'sourceId' = any (array[${RETIRED_EDGE_IDS.map(sqlText).join(", ")}])
  ) then
    raise exception 'Retired unsourced bridge edges survived synchronization';
  end if;
  if not exists (
    select 1
    from public.atlas_nodes atlas
    where atlas.slug = 'dutt-ramayana'
      and atlas.entity_id is null
      and atlas.visual->>'gatewayId' = 'ramayana'
      and atlas.visual->>'searchQuery' = 'Manmatha Nath Dutt Ramayana seven kandas'
      and atlas.visual->>'evidenceBoundary' like '%literal SECTION defects remain%'
      and atlas.visual->>'evidenceBoundary' like '%print-scan reconciliation is incomplete%'
  ) then
    raise exception 'Dutt Ramayana Atlas node is missing its selected-edition boundary';
  end if;
  if (
    select count(*)
    from public.atlas_nodes atlas
    where atlas.slug = any (array[${DUTT_NARRATIVE_CONSTELLATION_NODE_SLUGS.map(sqlText).join(", ")}])
      and atlas.visual->>'gatewayId' = 'ramayana'
      and atlas.visual->>'evidenceBoundary' is not null
  ) <> ${DUTT_NARRATIVE_CONSTELLATION_NODE_SLUGS.length} then
    raise exception 'Dutt Ramayana narrative constellation nodes are missing or outside their selected-edition boundaries';
  end if;
  if (
    select count(*)
    from public.atlas_edges edge
    where edge.visual->>'sourceId' = any (array[${sourceAddressedAtlasEdgeIds.map(sqlText).join(", ")}])
      and edge.visual->>'sourceRef' like '%sha256:%'
  ) <> ${sourceAddressedAtlasEdgeIds.length} then
    raise exception 'Source-addressed Living Atlas edges are missing exact source addresses';
  end if;
  if (
    select count(*)
    from public.atlas_nodes atlas
    where atlas.slug = any (array[${DISTINCT_DIWALI_NODE_SLUGS.map(sqlText).join(", ")}])
      and atlas.entity_id is null
      and atlas.visual->>'gatewayId' = 'diwali'
      and atlas.visual->>'evidenceBoundary' is not null
  ) <> 5 or (
    select count(*)
    from public.atlas_edges edge
    where edge.visual->>'sourceId' = any (array[${DISTINCT_DIWALI_EDGE_IDS.map(sqlText).join(", ")}])
  ) <> 5 then
    raise exception 'Distinct Diwali Atlas lanes are missing or misrouted';
  end if;
  if (
    select count(*)
    from public.atlas_nodes atlas
    where atlas.slug = any (array[${SACRED_TIME_NODE_SLUGS.map(sqlText).join(", ")}])
      and atlas.visual->>'gatewayId' = 'sacred-time'
      and atlas.visual->>'evidenceBoundary' is not null
  ) <> ${SACRED_TIME_NODE_SLUGS.length} or (
    select count(*)
    from public.atlas_edges edge
    where edge.visual->>'sourceId' = any (array[${SACRED_TIME_EDGE_IDS.map(sqlText).join(", ")}])
      and edge.visual->>'sourceRef' ~ '^sha256:[0-9a-f]{64}#ritual-pack$'
  ) <> ${SACRED_TIME_EDGE_IDS.length} then
    raise exception 'Sacred Time Atlas lanes are missing, unbounded, or not source-addressed';
  end if;
  if (
    select count(*)
    from public.atlas_nodes atlas
    where atlas.slug = any (array[${PRACTICE_CYCLE_NODE_SLUGS.map(sqlText).join(", ")}])
      and atlas.visual->>'evidenceBoundary' is not null
  ) <> ${PRACTICE_CYCLE_NODE_SLUGS.length} then
    raise exception 'Sacred Time practice-cycle nodes are missing or outside their evidence boundaries';
  end if;
  if (
    select count(*)
    from public.atlas_edges edge
    where edge.visual->>'sourceId' = any (array[${PRACTICE_CYCLE_EDGE_IDS.map(sqlText).join(", ")}])
      and edge.visual->>'sourceRef' ~ '^sha256:[0-9a-f]{64}#ritual-pack$'
  ) <> ${PRACTICE_CYCLE_EDGE_IDS.length} then
    raise exception 'Sacred Time practice-cycle routes are missing or not source-addressed';
  end if;
end
$$;

commit;
`;
}

const outputDirectory = path.dirname(OUTPUT);
if (!fs.existsSync(outputDirectory)) throw new Error(`Output directory does not exist: ${outputDirectory}`);
fs.writeFileSync(OUTPUT, buildMigration(), { encoding: "utf8", flag: "w" });
console.log(path.relative(ROOT, OUTPUT).replaceAll("\\", "/"));
