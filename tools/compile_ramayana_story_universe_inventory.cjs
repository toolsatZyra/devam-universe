const fs = require("node:fs");
const path = require("node:path");
const ts = require(path.resolve(__dirname, "../apps/web/node_modules/typescript"));

const ROOT = path.resolve(__dirname, "..");
const OUTPUT = path.join(ROOT, "knowledge_packs/inventories/ramayana-story-universe-v1.json");
const SNAPSHOT_SOURCE = path.join(ROOT, "apps/web/src/lib/content/ramayana-narrative-snapshot.ts");
const LIVING_CONNECTIONS_SOURCE = path.join(ROOT, "knowledge_packs/inventories/ramayana-living-connections-v1.json");
const FESTIVAL_CONTENT_SOURCE = path.join(ROOT, "knowledge_packs/library_lanes/ramayana/festivals-and-performances-v1.json");
const PLACE_CONTENT_SOURCE = path.join(ROOT, "knowledge_packs/library_lanes/ramayana/living-places-v1.json");
const TEMPLE_CONTENT_SOURCE = path.join(ROOT, "knowledge_packs/library_lanes/ramayana/temples-v1.json");
const SOURCE_TERM_RECONCILIATION_SOURCE = path.join(ROOT, "knowledge_packs/inventories/ramayana-source-term-reconciliation-v1.json");
const moduleCache = new Map();

function loadTypescriptModule(filename) {
  const resolved = path.resolve(filename);
  if (moduleCache.has(resolved)) return moduleCache.get(resolved).exports;
  const source = fs.readFileSync(resolved, "utf8");
  const javascript = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
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

const evidenceSources = [
  ["india-tourism-ramayana-circuit", "Ministry of Tourism, Government of India", "Ramayana Circuit planning and named pilgrimage destinations", "https://sd2.tourism.gov.in/DocumentRepoFiles/MasterPlan/MPadf89d7d-01d2-4163-9a0e-44de62c400af.pdf"],
  ["incredible-india-ayodhya", "Incredible India, Ministry of Tourism", "Ayodhya, its Rama-associated temples, ghats, and Deepotsav", "https://www.incredibleindia.gov.in/en/uttar-pradesh/ayodhya/72-hours-in-ayodhya"],
  ["incredible-india-chitrakoot", "Incredible India, Ministry of Tourism", "Chitrakoot living place traditions, temples, ghats, and festivals", "https://www.incredibleindia.gov.in/en/uttar-pradesh/chitrakoot"],
  ["incredible-india-nashik", "Incredible India, Ministry of Tourism", "Nashik and Panchavati living Ramayana geography", "https://www.incredibleindia.gov.in/en/maharashtra/nashik"],
  ["incredible-india-kalaram", "Incredible India, Ministry of Tourism", "Kalaram Temple and its Ram Navami connection", "https://www.incredibleindia.gov.in/en/maharashtra/nashik/kalaram-temple"],
  ["telangana-tourism-bhadrachalam", "Telangana Tourism", "Bhadrachalam, Sri Sita Ramachandra Swamy Temple, and Parnasala", "https://tourism.telangana.gov.in/destinations/bhadradri-kothagudem-districtbhadradri-kothagudem-district"],
  ["incredible-india-rameswaram", "Incredible India, Ministry of Tourism", "Rameswaram and living Rama-associated sites", "https://www.incredibleindia.gov.in/en/tamil-nadu/rameswaram/rameswaram-tracing-the-footsteps-of-lord-ram"],
  ["incredible-india-ramanathaswamy", "Incredible India, Ministry of Tourism", "Ramanathaswamy Temple's Rama-Shiva story tradition", "https://www.incredibleindia.gov.in/en/tamil-nadu/rameswaram/sri-ramanathaswamy-temple"],
  ["kerala-tourism-triprayar", "Kerala Tourism", "Triprayar Sree Rama Temple and its festivals", "https://www.keralatourism.org/campaigns/kerala365/triprayar-pooram-purappadu-uthram-vilakku"],
  ["kerala-tourism-nalambala", "Kerala Tourism", "Koodalmanikyam Bharata Temple and the four-sibling Nalambala pilgrimage", "https://www.keralatourism.org/destination/irinjalakuda-koodal-manikyam-temple/76/"],
  ["unesco-ramlila", "UNESCO Intangible Cultural Heritage", "Ramlila performance form, duration, participation, and representative centres", "https://ich.unesco.org/en/RL/ramlila-the-traditional-performance-of-the-ramayana-00110"],
  ["unesco-ramman", "UNESCO Intangible Cultural Heritage", "Ramman ritual theatre and its Rama-story component", "https://ich.unesco.org/en/RL/ramman-religious-festival-and-ritual-theatre-of-the-garhwal-himalayas-india-00281"],
  ["utsav-ram-navami", "Utsav, Ministry of Tourism", "Ram Navami significance and broad contemporary observance context", "https://www.utsav.gov.in/major-festival/ram-navami"],
  ["incredible-india-dussehra", "Incredible India, Ministry of Tourism", "Dussehra's Rama-story and Ramlila connection alongside distinct regional meanings", "https://www.incredibleindia.gov.in/en/festivals-and-events/dussehra"],
  ["incredible-india-diwali", "Incredible India, Ministry of Tourism", "Diwali as a multi-day, multi-regional festival including the Ayodhya homecoming association", "https://www.incredibleindia.gov.in/en/festivals-and-events/diwali"],
  ["mp-tourism-orchha", "Madhya Pradesh Tourism", "Ram Raja Temple's Orchha history and living kingship tradition", "https://www.mptourism.com/ram-raja-temple-in-orchha-where-lord-rama-is-worshipped-as-a-king.html"],
  ["maharashtra-tourism-ramtek", "Department of Tourism Maharashtra", "Ramtek's Rama association, temple, and festivals", "https://maharashtratourism.gov.in/temple/ramtek-khindsi/"],
  ["tn-hrce-ramaswamy-kumbakonam", "Hindu Religious and Charitable Endowments Department, Government of Tamil Nadu", "Official temple history for Arulmigu Ramaswamy Temple in Kumbakonam", "https://hrce.tn.gov.in/hrcehome/history.php?tid=18048"],
  ["nepal-tourism-vivaha-panchami", "Nepal Tourism Board", "Janakpur's Vivaha Panchami wedding remembrance, processions, reenactments, music, and Mithila setting", "https://ntb.gov.np/en/janakpur-and-vivah-panchami"],
  ["bihar-tourism-sita-navami", "Bihar State Tourism Development Corporation", "Sita Navami or Janaki Navami identity and the Sitamarhi observance", "https://bstdc.bihar.gov.in/festivals.htm"],
  ["utsav-hanuman-jayanti-changapur", "Utsav, Ministry of Tourism", "One documented Maharashtra Hanuman Jayanti expression with collective Chalisa reading, offerings, fasting, and food service", "https://www.utsav.gov.in/view-event/changapur-hanuman-jayanti-utsav-1"],
  ["telangana-bhadrachalam-kalyanam", "Telangana State Portal", "Bhadrachalam Sita-Rama Kalyana Mahotsavam and current state-supported temple celebration", "https://www.telangana.gov.in/news/press-releases/2026/03/honble-cm-sri-a-revanth-reddy-participated-in-sri-sita-rama-kalyana-mahotsavam-at-bhadrachalam-bhoomi-puja-for-temple-development-works/"],
  ["bihar-tourism-punaura-dham", "Bihar Tourism", "Punaura Dham as a current Sita-birthplace pilgrimage tradition near Sitamarhi", "https://tourism.bihar.gov.in/in/en/home/destinations/sitamarhi/punaura-dham"],
  ["nepal-tourism-janakpur", "Nepal Tourism Board", "Janakpur's living Mithila identity, temples, ponds, art, and pilgrimage life", "https://ntb.gov.np/en/janakpur"],
  ["nepal-tourism-janaki-mandir", "Nepal Tourism Board", "Janaki Mandir, Vivah Mandap, and nearby Rama-world temples", "https://ntb.gov.np/janaki-mandir--janakpur--dhanusha"],
  ["karnataka-tourism-anegundi", "Karnataka Tourism", "Anegundi's living Kishkindha association, Pampa Sarovara, and layered Vijayanagara landscape", "https://karnatakatourism.org/en/destinations/anegundi"],
  ["karnataka-tourism-anjanadri", "Karnataka Tourism", "Anjanadri Hill's current Hanuman-birth tradition and Tungabhadra landscape", "https://karnatakatourism.org/en/attractions/anjanadri-hill"],
].map(([source_id, publisher, evidence_role, url]) => ({ source_id, publisher, evidence_role, url, observed_at: "2026-08-13", rights_lane: "reference_only", source_text_retained: false }));

const livingPlaces = [
  ["ayodhya-living", "Ayodhya", "अयोध्या", "Uttar Pradesh, India", ["incredible-india-ayodhya", "india-tourism-ramayana-circuit"], ["princes-enter-world", "road-out-of-ayodhya", "road-home"]],
  ["chitrakoot-living", "Chitrakoot", "चित्रकूट", "Uttar Pradesh and Madhya Pradesh, India", ["incredible-india-chitrakoot", "india-tourism-ramayana-circuit"], ["deeper-into-forest", "bharata-follows", "sandals-and-promise"]],
  ["shringverpur-living", "Shringverpur", "श्रृंगवेरपुर", "Uttar Pradesh, India", ["india-tourism-ramayana-circuit"], ["road-out-of-ayodhya"]],
  ["prayagraj-living", "Prayagraj", "प्रयागराज", "Uttar Pradesh, India", ["india-tourism-ramayana-circuit"], ["road-out-of-ayodhya", "road-home"]],
  ["buxar-living", "Buxar", "बक्सर", "Bihar, India", ["india-tourism-ramayana-circuit"], ["princes-enter-world"]],
  ["ahilya-asthan-living", "Ahilya Asthan near Darbhanga", "दरभंगा के पास अहिल्या स्थान", "Bihar, India", ["india-tourism-ramayana-circuit"], ["road-to-mithila"]],
  ["sitamarhi-living", "Sitamarhi and Punaura Dham", "सीतामढ़ी और पुनौरा धाम", "Bihar, India", ["india-tourism-ramayana-circuit"], ["sita-and-the-bow"]],
  ["janakpur-living", "Janakpur", "जनकपुर", "Madhesh Province, Nepal", ["india-tourism-ramayana-circuit"], ["sita-and-the-bow", "weddings-and-challenge"]],
  ["nashik-panchavati-living", "Nashik and Panchavati", "नाशिक और पंचवटी", "Maharashtra, India", ["incredible-india-nashik", "incredible-india-kalaram"], ["panchavati-surpanakha", "golden-deer-plot", "sita-is-taken"]],
  ["ramtek-living", "Ramtek", "रामटेक", "Maharashtra, India", ["maharashtra-tourism-ramtek"], ["dandaka-vows"]],
  ["dandakaranya-living", "Dandakaranya living landscape", "दण्डकारण्य का जीवित भू-दृश्य", "Central India", ["telangana-tourism-bhadrachalam", "india-tourism-ramayana-circuit"], ["dandaka-vows"]],
  ["bhadrachalam-living", "Bhadrachalam", "भद्राचलम", "Telangana, India", ["telangana-tourism-bhadrachalam"], ["dandaka-vows", "golden-deer-plot"]],
  ["parnasala-living", "Parnasala", "पर्णशाला", "Telangana, India", ["telangana-tourism-bhadrachalam"], ["golden-deer-plot", "sita-is-taken"]],
  ["kishkindha-hampi-living", "Hampi and Anegundi Kishkindha traditions", "हम्पी और आनेगुंडी की किष्किंधा परंपराएँ", "Karnataka, India", ["india-tourism-ramayana-circuit"], ["hanuman-meets-rama", "two-losses-one-alliance", "vali-falls"]],
  ["rameswaram-living", "Rameswaram", "रामेश्वरम", "Tamil Nadu, India", ["incredible-india-rameswaram", "incredible-india-ramanathaswamy"], ["ocean-and-bridge", "road-home"]],
  ["dhanushkodi-living", "Dhanushkodi", "धनुषकोडी", "Tamil Nadu, India", ["incredible-india-rameswaram"], ["ocean-and-bridge", "road-home"]],
  ["ramnagar-varanasi-living", "Ramnagar and Varanasi Ramlila world", "रामनगर और वाराणसी की रामलीला दुनिया", "Uttar Pradesh, India", ["unesco-ramlila"], ["story-finds-a-voice"]],
  ["saloor-dungra-ramman-living", "Saloor-Dungra Ramman world", "सलूर-डुंग्रा की रम्माण दुनिया", "Uttarakhand, India", ["unesco-ramman"], ["story-finds-a-voice"]],
].map(([place_id, name_en, name_hi, modern_location, evidence_source_ids, connected_turn_ids]) => ({ place_id, name: { en: name_en, hi: name_hi }, modern_location, relation_state: "living_belief_or_performance_geography_not_epic_history", evidence_source_ids, connected_turn_ids, content_state: "research_record_ready_for_bilingual_authoring" }));

const temples = [
  ["ram-janmabhoomi-temple", "Shri Ram Janmabhoomi Mandir", "श्री राम जन्मभूमि मंदिर", "Ayodhya, Uttar Pradesh", "Rama", ["india-tourism-ramayana-circuit"]],
  ["hanuman-garhi-ayodhya", "Hanuman Garhi", "हनुमान गढ़ी", "Ayodhya, Uttar Pradesh", "Hanuman", ["india-tourism-ramayana-circuit", "incredible-india-ayodhya"]],
  ["kanak-bhawan-ayodhya", "Kanak Bhawan", "कनक भवन", "Ayodhya, Uttar Pradesh", "Rama and Sita", ["incredible-india-ayodhya"]],
  ["bharat-milap-temple-chitrakoot", "Bharat Milap Temple", "भरत मिलाप मंदिर", "Chitrakoot", "Rama and Bharata", ["incredible-india-chitrakoot"]],
  ["sati-anusuya-temple-chitrakoot", "Sati Anusuya Temple", "सती अनुसूया मंदिर", "Chitrakoot", "Anasuya", ["india-tourism-ramayana-circuit"]],
  ["hanuman-dhara-chitrakoot", "Hanuman Dhara", "हनुमान धारा", "Chitrakoot", "Hanuman", ["incredible-india-chitrakoot", "india-tourism-ramayana-circuit"]],
  ["janaki-mandir-sitamarhi", "Janaki Mandir / Punaura Dham", "जानकी मंदिर / पुनौरा धाम", "Sitamarhi, Bihar", "Sita", ["india-tourism-ramayana-circuit"]],
  ["janaki-mandir-janakpur", "Janaki Mandir", "जानकी मंदिर", "Janakpur, Nepal", "Sita", ["india-tourism-ramayana-circuit"]],
  ["kalaram-temple", "Kalaram Temple", "कालाराम मंदिर", "Nashik, Maharashtra", "Rama, Sita, Lakshmana, and Hanuman", ["incredible-india-kalaram"]],
  ["sita-ramachandra-swamy-bhadrachalam", "Sri Sita Ramachandra Swamy Temple", "श्री सीता रामचंद्र स्वामी मंदिर", "Bhadrachalam, Telangana", "Rama and Sita", ["telangana-tourism-bhadrachalam"]],
  ["ramanathaswamy-temple", "Sri Ramanathaswamy Temple", "श्री रामनाथस्वामी मंदिर", "Rameswaram, Tamil Nadu", "Shiva with a living Rama-Hanuman story connection", ["incredible-india-ramanathaswamy"]],
  ["triprayar-sree-rama-temple", "Triprayar Sree Rama Temple", "त्रिप्रयार श्री राम मंदिर", "Thrissur, Kerala", "Rama", ["kerala-tourism-triprayar", "kerala-tourism-nalambala"]],
  ["koodalmanikyam-bharata-temple", "Koodalmanikyam Temple", "कूडलमाणिक्यम मंदिर", "Irinjalakuda, Kerala", "Bharata", ["kerala-tourism-nalambala"]],
  ["moozhikkulam-lakshmana-temple", "Moozhikkulam Lakshmana Temple", "मूझिक्कुलम लक्ष्मण मंदिर", "Kerala", "Lakshmana", ["kerala-tourism-nalambala"]],
  ["payammal-shatrughna-temple", "Payammal Shatrughna Temple", "पयम्मल शत्रुघ्न मंदिर", "Kerala", "Shatrughna", ["kerala-tourism-nalambala"]],
  ["ramaswamy-temple-kumbakonam", "Ramaswamy Temple", "रामस्वामी मंदिर", "Kumbakonam, Tamil Nadu", "Rama and its enthronement image tradition", ["tn-hrce-ramaswamy-kumbakonam"]],
  ["ram-raja-temple-orchha", "Shri Ram Raja Temple", "श्री राम राजा मंदिर", "Orchha, Madhya Pradesh", "Rama as king in a distinct living temple tradition", ["mp-tourism-orchha"]],
  ["ramtek-ram-mandir", "Ramtek Ram Mandir", "रामटेक राम मंदिर", "Ramtek, Maharashtra", "Rama", ["maharashtra-tourism-ramtek"]],
].map(([temple_id, name_en, name_hi, location, principal_connection, evidence_source_ids]) => ({ temple_id, name: { en: name_en, hi: name_hi }, location, principal_connection, evidence_source_ids, claim_boundary: "Current institution and living association must remain separate from epic historicity and from other temples' traditions.", content_state: "research_record_ready_for_bilingual_authoring" }));

const festivalsAndPerformances = [
  ["ram-navami", "Ram Navami", "राम नवमी", "festival", "Rama's birth remembrance", ["utsav-ram-navami", "incredible-india-kalaram"], "research_verified_outline"],
  ["dussehra-vijayadashami-rama", "Dussehra / Vijayadashami Rama-story lane", "दशहरा / विजयादशमी की राम-कथा", "festival", "Rama-Ravana victory story in some major regional expressions", ["incredible-india-dussehra", "unesco-ramlila"], "research_verified_outline"],
  ["ramlila-performance", "Ramlila", "रामलीला", "performance", "Multi-scene public performance of the Ramayana, often through Ramcharitmanas", ["unesco-ramlila"], "research_verified_outline"],
  ["diwali-rama-homecoming", "Diwali / Deepotsav Rama-homecoming lane", "दीवाली / दीपोत्सव की राम-वापसी कथा", "festival", "Major Ayodhya and North Indian association inside a multi-tradition festival", ["incredible-india-ayodhya", "incredible-india-diwali"], "research_verified_outline"],
  ["vivaha-panchami", "Vivaha Panchami", "विवाह पंचमी", "festival", "Rama and Sita wedding remembrance", ["nepal-tourism-vivaha-panchami"], "research_verified_outline"],
  ["sita-navami", "Sita Navami / Janaki Navami", "सीता नवमी / जानकी नवमी", "festival", "Sita birth remembrance", ["bihar-tourism-sita-navami"], "research_verified_outline"],
  ["hanuman-jayanti-rama-world", "Hanuman Jayanti Rama-world connection", "हनुमान जयंती का राम-कथा संबंध", "festival", "Hanuman devotion and Rama-story remembrance with regional calendar variation", ["utsav-hanuman-jayanti-changapur"], "research_verified_outline"],
  ["bharat-milap-performance", "Bharat Milap performance and remembrance", "भरत मिलाप मंचन और स्मृति", "performance", "Rama-Bharata reunion within Ramlila and local festival worlds", ["unesco-ramlila", "incredible-india-chitrakoot"], "research_verified_outline"],
  ["ramman-ritual-theatre", "Ramman", "रम्माण", "ritual_theatre", "Community ritual theatre containing a local Rama-epic recitation", ["unesco-ramman"], "research_verified_outline"],
  ["nalambala-darshana", "Nalambala Darshana", "नालम्बल दर्शन", "pilgrimage", "Karkidakam pilgrimage through temples of Rama and his three brothers", ["kerala-tourism-nalambala"], "research_verified_outline"],
  ["bhadrachalam-sita-rama-kalyanam", "Bhadrachalam Sita-Rama Kalyanam", "भद्राचलम सीता-राम कल्याणम्", "temple_festival", "Temple wedding celebration connected to Rama and Sita", ["telangana-tourism-bhadrachalam", "telangana-bhadrachalam-kalyanam"], "research_verified_outline"],
  ["triprayar-pooram-ekadasi", "Triprayar Pooram and Ekadasi", "त्रिप्रयार पूरम और एकादशी", "temple_festival", "Distinct Kerala festivals of Triprayar Sree Rama Temple", ["kerala-tourism-triprayar"], "research_verified_outline"],
].map(([item_id, name_en, name_hi, kind, relationship, evidence_source_ids, content_state]) => ({ item_id, name: { en: name_en, hi: name_hi }, kind, relationship, evidence_source_ids, content_state, scope_boundary: "This is one named living lane; dates, procedures, regional reach, and claims require their own evidence and must not be universalized." }));

function buildInventory() {
  const snapshot = loadTypescriptModule(SNAPSHOT_SOURCE).buildRamayanaNarrativeSnapshot();
  const livingConnections = JSON.parse(fs.readFileSync(LIVING_CONNECTIONS_SOURCE, "utf8"));
  const festivalContent = JSON.parse(fs.readFileSync(FESTIVAL_CONTENT_SOURCE, "utf8"));
  const placeContent = JSON.parse(fs.readFileSync(PLACE_CONTENT_SOURCE, "utf8"));
  const templeContent = JSON.parse(fs.readFileSync(TEMPLE_CONTENT_SOURCE, "utf8"));
  const sourceTermReconciliation = JSON.parse(fs.readFileSync(SOURCE_TERM_RECONCILIATION_SOURCE, "utf8"));
  if (sourceTermReconciliation.source_expression.source_unit_count !== 652) throw new Error("Ramayana source-term denominator drift");
  const festivalContentById = new Map(festivalContent.records.map((item) => [item.item_id, item]));
  const registeredFestivalIds = new Set(festivalsAndPerformances.map((item) => item.item_id));
  if (festivalContentById.size !== festivalsAndPerformances.length
    || [...registeredFestivalIds].some((itemId) => !festivalContentById.has(itemId))
    || [...festivalContentById].some(([itemId]) => !registeredFestivalIds.has(itemId))) {
    throw new Error("Ramayana festival content must exactly match the registered denominator");
  }
  const festivalsWithContent = festivalsAndPerformances.map((item) => ({
    ...item,
    content_state: festivalContentById.get(item.item_id).completion_state,
    consumer_content_pack: "knowledge_packs/library_lanes/ramayana/festivals-and-performances-v1.json",
    consumer_content_item_id: item.item_id,
  }));
  const placeContentById = new Map(placeContent.records.map((item) => [item.place_id, item]));
  const registeredPlaceIds = new Set(livingPlaces.map((item) => item.place_id));
  if (placeContentById.size !== livingPlaces.length
    || [...registeredPlaceIds].some((placeId) => !placeContentById.has(placeId))
    || [...placeContentById].some(([placeId]) => !registeredPlaceIds.has(placeId))) {
    throw new Error("Ramayana place content must exactly match the registered denominator");
  }
  const placesWithContent = livingPlaces.map((item) => ({
    ...item,
    content_state: placeContentById.get(item.place_id).completion_state,
    consumer_content_pack: "knowledge_packs/library_lanes/ramayana/living-places-v1.json",
    consumer_content_item_id: item.place_id,
  }));
  const templeContentById = new Map(templeContent.records.map((item) => [item.temple_id, item]));
  const registeredTempleIds = new Set(temples.map((item) => item.temple_id));
  if (templeContentById.size !== temples.length
    || [...registeredTempleIds].some((templeId) => !templeContentById.has(templeId))
    || [...templeContentById].some(([templeId]) => !registeredTempleIds.has(templeId))) {
    throw new Error("Ramayana temple content must exactly match the registered denominator");
  }
  const templesWithContent = temples.map((item) => ({
    ...item,
    content_state: templeContentById.get(item.temple_id).completion_state,
    consumer_content_pack: "knowledge_packs/library_lanes/ramayana/temples-v1.json",
    consumer_content_item_id: item.temple_id,
  }));
  const episodes = snapshot.turns.flatMap((turn) => turn.scenes.map((scene) => {
    const sourceUnitCount = scene.source.sourceEndOrdinal - scene.source.sourceOrdinal + 1;
    const narrativeWordCountEn = scene.narrative.en.trim().split(/\s+/).filter(Boolean).length;
    const narrativeWordsPerSourceUnitEn = Number((narrativeWordCountEn / sourceUnitCount).toFixed(1));
    return {
      episode_id: scene.id,
      arc_id: turn.arcId,
      story_cycle_id: turn.id,
      title: scene.title,
      source: scene.source,
      source_unit_count: sourceUnitCount,
      beat_count: scene.beats.length,
      narrative_word_count_en: narrativeWordCountEn,
      narrative_words_per_source_unit_en: narrativeWordsPerSourceUnitEn,
      entity_ids: [...new Set(scene.characters)].sort(),
      narrative_places: [...new Set(scene.places)].sort(),
      consumer_language_state: scene.readiness === "playable" ? "authored_en_hi" : scene.readiness,
      depth_review_state: sourceUnitCount >= 2 && narrativeWordsPerSourceUnitEn < 40
        ? "compression_candidate"
        : "no_material_compression_signal",
    };
  }));
  const aggregate = (field, idName) => {
    const map = new Map();
    for (const episode of episodes) for (const value of episode[field]) {
      const row = map.get(value) ?? { [idName]: value, episode_ids: [], story_cycle_ids: new Set() };
      row.episode_ids.push(episode.episode_id);
      row.story_cycle_ids.add(episode.story_cycle_id);
      map.set(value, row);
    }
    return [...map.values()].sort((a, b) => a[idName].localeCompare(b[idName])).map((row) => ({ ...row, story_cycle_ids: [...row.story_cycle_ids].sort(), episode_count: row.episode_ids.length }));
  };
  const storyCycles = snapshot.turns.map((turn) => ({
    story_cycle_id: turn.id,
    arc_id: turn.arcId,
    title: turn.title,
    invitation: turn.invitation,
    source_range: turn.sourceRange,
    episode_count: turn.scenes.length,
    bilingual_beat_count: turn.scenes.reduce((sum, scene) => sum + scene.beats.length, 0),
    episode_ids: turn.scenes.map((scene) => scene.id),
    consumer_state: turn.coverage === "playable" ? "authored_en_hi_depth_audit_active" : turn.coverage,
  }));
  const compressionCandidates = episodes.filter((episode) => episode.depth_review_state === "compression_candidate").map((episode) => episode.episode_id);
  if (snapshot.series.totalSourceUnits !== 652 || snapshot.turns.length !== 49) throw new Error("Ramayana selected-expression denominator drift");
  if (episodes.length !== snapshot.counters.playableScenes) throw new Error("Ramayana episode count drift");
  if (episodes.reduce((sum, episode) => sum + episode.beat_count, 0) !== snapshot.counters.bilingualBeats) throw new Error("Ramayana beat count drift");
  return {
    contract: "DEVAM_RAMAYANA_STORY_UNIVERSE_INVENTORY_V1",
    version: 1,
    generated_at: "2026-08-13",
    audience: "Ordinary Hindi- or English-speaking Indian adults seeking complete stories and clear living connections.",
    boundary: "This inventory is the selected Ramayana MVP denominator, not every Ramayana tradition, temple, performance, place claim, or civilizational expression. Narrative geography, living belief, institutional fact, and verified history remain distinct.",
    completion_rule: "The selected narrative is complete only after every compression candidate is resolved and continuity is adversarially reviewed. Every living item additionally requires approachable Hindi and English information plus its own evidence and practice boundaries.",
    selected_narrative: {
      source_expression_id: snapshot.series.id,
      source_units: snapshot.series.totalSourceUnits,
      story_cycles: storyCycles,
      episodes,
      authored_story_entities: aggregate("entity_ids", "entity_id"),
      narrative_places: aggregate("narrative_places", "place_label"),
      compression_candidates: compressionCandidates,
      counters: snapshot.counters,
      completion_state: compressionCandidates.length === 0 ? "continuity_review_pending" : "depth_repair",
      source_term_reconciliation: {
        inventory: "knowledge_packs/inventories/ramayana-source-term-reconciliation-v1.json",
        completion_state: sourceTermReconciliation.completion_state,
        counters: sourceTermReconciliation.counters,
      },
    },
    living_world: {
      places: placesWithContent,
      temples: templesWithContent,
      festivals_and_performances: festivalsWithContent,
      existing_runtime_bridges: livingConnections.connections,
      counters: {
        places: placesWithContent.length,
        places_complete_en_hi: placesWithContent.filter((item) => item.content_state === "consumer_complete_en_hi").length,
        temples: templesWithContent.length,
        temples_complete_en_hi: templesWithContent.filter((item) => item.content_state === "consumer_complete_en_hi").length,
        festivals_and_performances: festivalsWithContent.length,
        festivals_and_performances_complete_en_hi: festivalsWithContent.filter((item) => item.content_state === "consumer_complete_en_hi").length,
      },
      completion_state: "registered_living_denominator_complete_en_hi",
    },
    wider_story_expressions: [
      {
        expression_id: "ramcharitmanas",
        role: "Complete Hindi devotional reading with optional daily pacing",
        state: "twelve_expected_stories_consumer_complete_en_hi_source_aligned",
        consumer_story_packs: [
          "knowledge_packs/library_lanes/ramayana/expected-stories-beginnings-exile-v1.json",
          "knowledge_packs/library_lanes/ramayana/expected-stories-war-messengers-v1.json",
          "knowledge_packs/library_lanes/ramayana/expected-stories-uttarkanda-frames-v1.json",
        ],
        complete_expected_story_rows: 12,
        bilingual_episode_beats: 140,
        boundary: "This completes three bounded expectation batches, not the complete 1,158-page Ramcharitmanas reading work or every story in its seven kandas. Continuous, page-daily, passage-daily, kanda and exact-resume reading remain a separate denominator.",
      },
      {
        expression_id: "popular-and-living-bridges-v1",
        role: "Separately labelled popular reception, regional story, living temple tradition, and festival memory",
        state: "five_expected_stories_consumer_complete_en_hi_source_bounded",
        consumer_story_packs: ["knowledge_packs/library_lanes/ramayana/expected-stories-popular-living-bridges-v1.json"],
        complete_expected_story_rows: 5,
        bilingual_episode_beats: 35,
        boundary: "This completes Lakshman Rekha, tasted berries, the bridge squirrel, one living Rameswaram linga tradition, and the Rama-homecoming Diwali lane. It does not insert later motifs into Dutt, establish sacred geography as history, universalize temple or festival practice, or complete every Rama tradition.",
      },
      {
        expression_id: "later-regional-and-devotional-reception-v1",
        role: "Separately labelled later performance, regional underworld rescue, Lava-Kusha popular battle reception, and modern Hanuman devotional stories",
        state: "five_expected_stories_consumer_complete_en_hi_source_bounded",
        consumer_story_packs: ["knowledge_packs/library_lanes/ramayana/expected-stories-later-devotional-v1.json"],
        complete_expected_story_rows: 5,
        bilingual_episode_beats: 45,
        boundary: "This completes the version-one Sulochana, Ahiravana/Mahiravana, Lava-Kusha horse, Hanuman chest, and Hanuman sindoor expectations. It does not normalize sati, merge variant branches, copy adaptation dialogue, insert modern devotion into the selected epic, prescribe sindoor use, or complete every Rama and Hanuman tradition.",
      },
      { expression_id: "kamba-ramayanam", role: "Tamil Ramayana story world", state: "future_denominator" },
      { expression_id: "adhyatma-ramayana", role: "Devotional and theological Ramayana expression", state: "future_denominator" },
      { expression_id: "krittivasi-ramayana", role: "Bengali Ramayana story world", state: "future_denominator" },
      { expression_id: "ramlila-performance-cycles", role: "Living performed Ramayana worlds", state: "denominator_seeded" },
    ],
    evidence_sources: evidenceSources,
    next_authoring_queue: {
      selected_narrative_compression_candidates: compressionCandidates,
      living_items_needing_bilingual_content: [...placesWithContent.filter((item) => item.content_state !== "consumer_complete_en_hi").map((item) => item.place_id), ...templesWithContent.filter((item) => item.content_state !== "consumer_complete_en_hi").map((item) => item.temple_id), ...festivalsWithContent.filter((item) => item.content_state !== "consumer_complete_en_hi").map((item) => item.item_id)],
      entity_and_place_reconciliation: {
        inventory: "knowledge_packs/inventories/ramayana-source-term-reconciliation-v1.json",
        state: "supplementary_nonblocking_diagnostic",
        boundary: "The lexical queue is not a consumer-story completion denominator. Use its resolved high-signal gaps during continuity review; do not classify every capitalized token before authoring stories.",
        source_terms_needing_classification: sourceTermReconciliation.counters.source_term_review_needed,
        resolved_terms_missing_from_some_covering_episodes: sourceTermReconciliation.counters.resolved_terms_missing_from_some_covering_episodes,
      },
    },
  };
}

const output = `${JSON.stringify(buildInventory(), null, 2)}\n`;
if (process.argv.includes("--check")) {
  if (!fs.existsSync(OUTPUT) || fs.readFileSync(OUTPUT, "utf8") !== output) throw new Error("Ramayana story-universe inventory is stale; run the compiler");
  console.log("Ramayana story-universe inventory is current");
} else {
  fs.writeFileSync(OUTPUT, output, "utf8");
  console.log(`Wrote ${path.relative(ROOT, OUTPUT)}`);
}
