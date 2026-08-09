import type { ExperienceCitation, HeroChallenge, HeroJourney } from "@/lib/domain/experience";

const DUTT_YUDDHA_SOURCE = "8d1b8901823f5b5bd8b3207370991ddf95e5c76cb30ad5271aef835c9708464b";
const DUTT_AYODHYA_SOURCE = "7d3b9e1613d60dfacea39f2564243e943cf38703eadb7245d92337b238082034";
const RAMAYANA_SOURCE = "a569551e8a972935d540bc53e57effa919868367234ab3b5334d07a1e7f84901";
const DURGA_SOURCE = "7f2db461e724c675317130c653258a4b277e647e938b946b40687decd535111e";
const GANESHA_SOURCE = "21e5909392249ecca6677410c30d70323402d886975df807df2b865697fd9e6d";
const DIWALI_RESEARCH_PACK = "c73343da9b873400ed7bcc307b30aedb7de751c38c6e672ac41f98de05b389c1";

function duttYuddhaCitation(sourceOrdinal: number, marker: string, literalSection: number, byteStart: number, byteEnd: number, lineStart: number, lineEnd: number, spanSha256: string): ExperienceCitation {
  return {
    sourceSha256: DUTT_YUDDHA_SOURCE,
    sourceOrdinal,
    spanSha256,
    workTitle: "The Rāmāyana",
    editionTitle: "Manmatha Nath Dutt English prose translation, Project Gutenberg volume 3",
    languageCode: "en",
    rightsLane: "product_allowed",
    locator: { contract: "DEVAM_DUTT_PG_SECTION_BYTE_SPAN_V1", provider: "Project Gutenberg", ebook_id: 60188, volume: 3, kanda_ordinal: 6, kanda_slug: "yuddha", kanda_title: "Yuddhakāṇḍa", literal_marker: marker, literal_section_number: literalSection, source_relative_ordinal: sourceOrdinal, byte_start: byteStart, byte_end_exclusive: byteEnd, line_start: lineStart, line_end: lineEnd, printed_number_not_unique_key: true },
  };
}

function duttAyodhyaRangeCitation(
  sourceOrdinalStart: number,
  sourceOrdinalEnd: number,
  kandaOrdinalStart: number,
  kandaOrdinalEnd: number,
  markerStart: string,
  markerEnd: string,
  byteStart: number,
  byteEnd: number,
  lineStart: number,
  lineEnd: number,
  spanSha256: string,
): ExperienceCitation {
  return {
    sourceSha256: DUTT_AYODHYA_SOURCE,
    sourceOrdinal: sourceOrdinalStart,
    spanSha256,
    workTitle: "The Rāmāyana",
    editionTitle: "Manmatha Nath Dutt English prose translation, Project Gutenberg volume 1",
    languageCode: "en",
    rightsLane: "product_allowed",
    locator: {
      contract: "DEVAM_DUTT_PG_SECTION_RANGE_V1",
      provider: "Project Gutenberg",
      ebook_id: 57265,
      volume: 1,
      kanda_ordinal: 2,
      kanda_slug: "ayodhya",
      kanda_title: "Ayodhyākāṇḍa",
      literal_marker_start: markerStart,
      literal_marker_end: markerEnd,
      source_relative_ordinal_start: sourceOrdinalStart,
      source_relative_ordinal_end: sourceOrdinalEnd,
      kanda_relative_ordinal_start: kandaOrdinalStart,
      kanda_relative_ordinal_end: kandaOrdinalEnd,
      section_count: kandaOrdinalEnd - kandaOrdinalStart + 1,
      byte_start: byteStart,
      byte_end_exclusive: byteEnd,
      line_start: lineStart,
      line_end: lineEnd,
      printed_number_not_unique_key: true,
    },
  };
}

function ramayanaCitation(sourceOrdinal: number, book: number, byteStart: number, byteEnd: number, lineStart: number, lineEnd: number, lastVerseId: string, verseCount: number, spanSha256: string): ExperienceCitation {
  return {
    sourceSha256: RAMAYANA_SOURCE,
    sourceOrdinal,
    spanSha256,
    workTitle: "Vālmīki Rāmāyaṇa",
    editionTitle: "Tokunaga/Smith GRETIL Sanskrit electronic transcription",
    languageCode: "sa-Latn",
    rightsLane: "private_evidence",
    locator: { contract: "DEVAM_GRETIL_TEI_SARGA_BYTE_SPAN_V1", book, sarga: 1, literal_locator: `${book}.1`, first_verse_id: `R_${book}.001.001`, last_verse_id: lastVerseId, verse_group_count: verseCount, byte_start: byteStart, byte_end_exclusive: byteEnd, line_start: lineStart, line_end: lineEnd },
  };
}

const ramayanaLibraryJourney: HeroJourney = {
  slug: "ramayana",
  hero: "Ramayana",
  devanagari: "रामायण",
  title: "Across the seven kāṇḍas",
  invitation: "Trace one exact Sanskrit carrier from its opening book to its terminal seventh book.",
  durationMinutes: 18,
  tone: "saffron",
  sourceBoundary: "This library structure follows the seven-book boundary of one GRETIL Sanskrit electronic transcription. It is not a critical edition, every recension, every Ramayana tradition, or a product-rights clearance.",
  completeHeroUniverse: false,
  stops: [
    { id: "bala-kanda", ordinal: 1, title: "Bālakāṇḍa", eyebrow: "Book one", summary: "Enter the epic through its first book and the carrier's opening sarga.", citation: ramayanaCitation(1, 1, 10776, 28298, 329, 648, "R_1.001.079", 79, "9ea76e943c2c75d1297ea6fafad77cc4e00694d2b933553c2a6bf5049923930d") },
    { id: "ayodhya-kanda", ordinal: 2, title: "Ayodhyākāṇḍa", eyebrow: "Book two", summary: "Move into the Ayodhya book through its first source-addressed sarga.", citation: ramayanaCitation(77, 2, 435464, 443637, 8158, 8306, "R_2.001.037", 37, "428f6d6455bf4003d8b2c56737a9aa65191462b7ee4b5781b0f5769cdb419f45") },
    { id: "aranya-kanda", ordinal: 3, title: "Araṇyakāṇḍa", eyebrow: "Book three", summary: "Continue into the forest book while preserving its separate book and sarga identity.", citation: ramayanaCitation(188, 3, 1148091, 1152962, 20890, 20977, "R_3.001.022", 22, "6c3f0d7de015dfd4f6035dcafd58f26afaf30d5bb94fa7053727c1cfbe28cf65") },
    { id: "kishkindha-kanda", ordinal: 4, title: "Kiṣkindhākāṇḍa", eyebrow: "Book four", summary: "Open the fourth book as its own textual region rather than flattening the epic into one story blob.", citation: ramayanaCitation(259, 4, 1612894, 1623904, 29221, 29417, "R_4.001.049", 49, "c214ef02f9aa9da085b0d73314aee0dde3235c74bf583b03ed81e6d3d69f8483") },
    { id: "sundara-kanda", ordinal: 5, title: "Sundarakāṇḍa", eyebrow: "Book five", summary: "Reach the fifth book through its unusually long opening sarga of 190 verse groups.", citation: ramayanaCitation(325, 5, 2058023, 2099523, 37214, 37978, "R_5.001.190", 190, "8b61504a3b00cd8991410789af8a8d4b6b34828252b664eddcc100ce4abc81bd") },
    { id: "yuddha-kanda", ordinal: 6, title: "Yuddhakāṇḍa", eyebrow: "Book six", summary: "Enter the sixth book with its source boundary intact.", citation: ramayanaCitation(391, 6, 2637433, 2640955, 47232, 47296, "R_6.001.016", 16, "3fbb01e48ed1d787e6388f9eb4d4dbf8fbea3368208af53cc410885ff9a4d824") },
    { id: "uttara-kanda", ordinal: 7, title: "Uttarakāṇḍa", eyebrow: "Book seven", summary: "Complete this carrier-level route at the seventh book without claiming completion of the wider tradition.", citation: ramayanaCitation(507, 7, 3653378, 3659387, 65085, 65193, "R_7.001.027", 27, "9b6df97e6dd5e2090e27188d2b9e79f0291bbcdbdd4eee1a1f5786439e78d173") },
  ],
};

function durgaCitation(sourceOrdinal: number, chapter: number, byteStart: number, byteEnd: number, lineStart: number, lineEnd: number, spanSha256: string): ExperienceCitation {
  return {
    sourceSha256: DURGA_SOURCE,
    sourceOrdinal,
    spanSha256,
    workTitle: "Devīmāhātmya within the Mārkaṇḍeyapurāṇa",
    editionTitle: "Mārkaṇḍeyapurāṇa chapters 1–93 — GRETIL electronic text",
    languageCode: "sa-Latn",
    rightsLane: "private_evidence",
    locator: { contract: "DEVAM_TEI_CHAPTER_BYTE_SPAN_V1", element: "div", literal_marker: `MarkP_${chapter}`, source_chapter: chapter, byte_start: byteStart, byte_end_exclusive: byteEnd, line_start: lineStart, line_end: lineEnd },
  };
}

function ganeshaCitation(sourceOrdinal: number, byteStart: number, byteEnd: number, lineStart: number, lineEnd: number, spanSha256: string, quotation: string): ExperienceCitation {
  return {
    sourceSha256: GANESHA_SOURCE,
    sourceOrdinal,
    spanSha256,
    workTitle: "Śrīgaṇapatimantrākṣarāvaliḥ",
    editionTitle: "Ambuda electronic text based on Stotrārṇavaḥ (Madras, 1961)",
    languageCode: "sa-Deva",
    rightsLane: "derivative_allowed",
    locator: { contract: "DEVAM_TEI_BYTE_SPAN_V1", element: "lg", literal_marker: String(sourceOrdinal), byte_start: byteStart, byte_end_exclusive: byteEnd, line_start: lineStart, line_end: lineEnd },
    quotation,
  };
}

function diwaliCitation(sourceOrdinal: number, byteStart: number, byteEnd: number, line: number, spanSha256: string, calendarStatus: string): ExperienceCitation {
  return {
    sourceSha256: DIWALI_RESEARCH_PACK,
    sourceOrdinal,
    spanSha256,
    workTitle: "Devam Diwali/Deepavali evidence synthesis",
    editionTitle: "West India six-part festival path v1",
    languageCode: "en",
    rightsLane: "derivative_allowed",
    locator: { contract: "DEVAM_DERIVED_RESEARCH_PACK_JSON_BYTE_SPAN_V1", pack_id: "devam-diwali-lakshmi-puja-west-india-v1", day_ordinal: sourceOrdinal, calendar_status: calendarStatus, byte_start: byteStart, byte_end_exclusive: byteEnd, line_start: line, line_end: line, generated_evidence_pack: true },
  };
}

export const heroJourneys: HeroJourney[] = [
  {
    slug: "ramayana",
    hero: "Ramayana",
    devanagari: "रामायण",
    title: "The promise and the return",
    invitation: "Choose an illustrated district: watch coronation night become exile, cross the first rivers toward Chitrakoot, or travel with the returning party from Lanka to Ayodhya.",
    durationMinutes: 48,
    tone: "saffron",
    sourceBoundary: "These three playable districts follow Ayodhyā Kāṇḍa source units I–LVI in Project Gutenberg volume 1 and Yuddha Kāṇḍa source units CXXIV–CXXX in volume 3 of Manmatha Nath Dutt's product-allowed English prose translation. They are selected-expression retellings, not every Ramayana, a historical route, a universal ethical judgment or Diwali origin, or a complete account of any character, place, festival, or theology.",
    completeHeroUniverse: false,
    stops: [
      {
        id: "coronation-dawn", ordinal: 1, title: "A coronation dawns", eyebrow: "Ayodhyā Kāṇḍa · I–VI", summary: "Dasharatha names Rama as heir; Ayodhya prepares through the night while Rama and Sita keep a quiet vigil inside the celebration.",
        citation: duttAyodhyaRangeCitation(76, 81, 1, 6, "I", "VI", 367897, 409010, 5936, 6588, "d9eeda282af4a60ad4b0a3ef71de3a7f428b2a33b8985b0766b113b3694dc5da"),
        visual: { asset: "/journeys/ramayana-exile-coronation-dawn-v1.webp", location: "Ayodhya · coronation night", cast: ["Dasharatha", "Rama", "Sita", "Vasishta"], connections: [{ label: "Ayodhya", kind: "place", href: "/search?q=Ayodhya%20Ramayana" }, { label: "Dasharatha", kind: "character", href: "/search?q=Dasharatha%20Ramayana" }, { label: "The selected Dutt edition", kind: "source", href: "/search?q=Manmatha%20Nath%20Dutt%20Ramayana" }] },
      },
      {
        id: "manthara-sees-city", ordinal: 2, title: "Manthara sees the city", eyebrow: "Ayodhyā Kāṇḍa · VII", summary: "The celebration reaches Manthara as alarming news. Kaikeyi first rejoices—before an argument begins to reshape what the coronation means.",
        citation: duttAyodhyaRangeCitation(82, 82, 7, 7, "VII", "VII", 409010, 414268, 6589, 6670, "0cf2b8d1615c1fed76c0643ee9c7ac8ccba6b2128f07f6212376885f3b445b8c"),
        visual: { asset: "/journeys/ramayana-exile-manthara-v1.webp", location: "Ayodhya palace · high terrace", cast: ["Manthara", "Kaikeyi"], connections: [{ label: "Manthara", kind: "character", href: "/search?q=Manthara%20Ramayana" }, { label: "Kaikeyi", kind: "character", href: "/search?q=Kaikeyi%20Ramayana" }, { label: "Ayodhya", kind: "place", href: "/search?q=Ayodhya" }] },
      },
      {
        id: "fear-becomes-demands", ordinal: 3, title: "Fear becomes two demands", eyebrow: "Ayodhyā Kāṇḍa · VIII–XI", summary: "Manthara turns affection into fear. Kaikeyi enters the chamber of anger and calls in two promises: Bharata's installation and Rama's exile.",
        citation: duttAyodhyaRangeCitation(83, 86, 8, 11, "VIII", "XI", 414268, 440065, 6671, 7071, "1acee52458af87783396f897bed370249cfcf1bdb8e39331e6bfa3b0a537ab6f"),
        visual: { asset: "/journeys/ramayana-exile-two-demands-v1.webp", location: "Kaikeyi's chamber · narrative world", cast: ["Manthara", "Kaikeyi", "Dasharatha"], connections: [{ label: "Kaikeyi's chamber", kind: "place", href: "/search?q=Kaikeyi%20two%20boons" }, { label: "Bharata", kind: "character", href: "/search?q=Bharata%20Ramayana" }, { label: "The forest exile", kind: "source", href: "/search?q=Ramayana%20forest%20exile" }] },
      },
      {
        id: "king-trapped-by-word", ordinal: 4, title: "The king is trapped by his word", eyebrow: "Ayodhyā Kāṇḍa · XII–XIV", summary: "Dasharatha pleads through the night, but the promise he freely renewed becomes the lock on the room while morning waits outside.",
        citation: duttAyodhyaRangeCitation(87, 89, 12, 14, "XII", "XIV", 440065, 471582, 7072, 7552, "0f99781e88e5d4348b253a9b851f150f8db1544768743ccf7977df03e4926280"),
        visual: { asset: "/journeys/ramayana-exile-dasharatha-v1.webp", location: "Kaikeyi's chamber · the long night", cast: ["Dasharatha", "Kaikeyi"], connections: [{ label: "Dasharatha", kind: "character", href: "/search?q=Dasharatha%20Ramayana" }, { label: "Kaikeyi", kind: "character", href: "/search?q=Kaikeyi%20Ramayana" }, { label: "Promise and consequence", kind: "source", href: "/search?q=Ramayana%20two%20boons" }] },
      },
      {
        id: "rama-crosses-celebration", ordinal: 5, title: "Rama crosses the celebration", eyebrow: "Ayodhyā Kāṇḍa · XV–XVIII", summary: "Summoned through streets still prepared for his coronation, Rama reaches a silent father and hears the changed future from Kaikeyi.",
        citation: duttAyodhyaRangeCitation(90, 93, 15, 18, "XV", "XVIII", 471582, 494066, 7553, 7902, "999301eabc9cbb10df9d794539ac49a8c97f9de64859e77aa9a8298e4a5127c9"),
        visual: { asset: "/journeys/ramayana-exile-summons-v1.webp", location: "Ayodhya · decorated streets", cast: ["Rama", "Dasharatha", "Kaikeyi", "Vasishta"], connections: [{ label: "Rama", kind: "character", href: "/search?q=Rama%20Ramayana" }, { label: "Ayodhya", kind: "place", href: "/search?q=Ayodhya" }, { label: "Ayodhyā Kāṇḍa", kind: "source", href: "/search?q=Dutt%20Ayodhya%20Kanda" }] },
      },
      {
        id: "rama-accepts-exile", ordinal: 6, title: "Rama accepts the exile", eyebrow: "Ayodhyā Kāṇḍa · XIX–XXV", summary: "Rama chooses immediate departure, tells Kausalya, and redirects Lakshmana's furious resistance toward dismantling the ceremony and preparing the road.",
        citation: duttAyodhyaRangeCitation(94, 100, 19, 25, "XIX", "XXV", 494066, 545838, 7903, 8697, "dd4163555b80007f83f9bbe8a8cf906ac1c9110bae1766e8b47e6076ee457e8b"),
        visual: { asset: "/journeys/ramayana-exile-accepted-v1.webp", location: "Kausalya's apartments · narrative world", cast: ["Rama", "Kausalya", "Lakshmana"], connections: [{ label: "Kausalya", kind: "character", href: "/search?q=Kausalya%20Ramayana" }, { label: "Lakshmana", kind: "character", href: "/search?q=Lakshmana%20Ramayana" }, { label: "The forest exile", kind: "source", href: "/search?q=Ramayana%20forest%20exile" }] },
      },
      {
        id: "sita-chooses-road", ordinal: 7, title: "Sita chooses the road", eyebrow: "Ayodhyā Kāṇḍa · XXVI–XXX", summary: "Rama asks Sita to remain in Ayodhya. She names the forest dangers with him and insists that sharing the road is her own decision.",
        citation: duttAyodhyaRangeCitation(101, 105, 26, 30, "XXVI", "XXX", 545838, 569387, 8698, 9072, "2dcc14dee5b5d763cd5682d81f2446b8074e44c5e9222153abad4627a3eb3a8a"),
        visual: { asset: "/journeys/ramayana-exile-sita-chooses-v1.webp", location: "Ayodhya palace · threshold to the road", cast: ["Sita", "Rama"], connections: [{ label: "Sita", kind: "character", href: "/search?q=Sita%20Ramayana" }, { label: "Rama", kind: "character", href: "/search?q=Rama%20Ramayana" }, { label: "The forest road", kind: "place", href: "/search?q=Ramayana%20forest%20journey" }] },
      },
      {
        id: "lakshmana-joins", ordinal: 8, title: "Three turn toward the gate", eyebrow: "Ayodhyā Kāṇḍa · XXXI–XL", summary: "Lakshmana joins the journey. Gifts, travel gear, bark garments, blessings, and farewells replace the coronation as the three prepare to leave together.",
        citation: duttAyodhyaRangeCitation(106, 115, 31, 40, "XXXI", "XL", 569387, 625489, 9073, 9947, "599b54a25c1c46d5351b5adbf067140329b70bf0c4fdf834350d87b62ee9f762"),
        visual: { asset: "/journeys/ramayana-exile-three-depart-v1.webp", location: "Ayodhya palace gate · departure", cast: ["Rama", "Sita", "Lakshmana", "Kausalya", "Dasharatha"], connections: [{ label: "Rama, Sita, and Lakshmana", kind: "character", href: "/search?q=Rama%20Sita%20Lakshmana%20exile" }, { label: "Ayodhya", kind: "place", href: "/search?q=Ayodhya" }, { label: "Continue into the forest", kind: "source", href: "/search?q=Ramayana%20forest%20exile" }] },
      },
      {
        id: "city-follows-car", ordinal: 9, title: "The city follows", eyebrow: "Ayodhyā Kāṇḍa · XLI–XLV", summary: "Palace grief becomes public movement: Dasharatha watches the dust vanish, the mothers face the rupture, and citizens follow the departing car into darkness.",
        citation: duttAyodhyaRangeCitation(116, 120, 41, 45, "XLI", "XLV", 625489, 645749, 9948, 10268, "4c151393fe14bbc2b8f4f4d55b6762a908f18ca4ee8a00923511eeb35600e32b"),
        visual: { asset: "/journeys/ramayana-rivers-city-follows-v1.webp", location: "Ayodhya to the open road · narrative world", cast: ["Rama", "Sita", "Lakshmana", "Sumantra", "Dasharatha", "Kausalya"], connections: [{ label: "Ayodhya", kind: "place", href: "/search?q=Ayodhya%20Ramayana" }, { label: "Sumantra", kind: "character", href: "/search?q=Sumantra%20Ramayana" }, { label: "The selected Dutt edition", kind: "source", href: "/search?q=Manmatha%20Nath%20Dutt%20Ramayana" }] },
      },
      {
        id: "tamasa-night", ordinal: 10, title: "The first night at the Tamasa", eyebrow: "Ayodhyā Kāṇḍa · XLVI–XLVIII", summary: "Citizens sleep beneath the trees while the travellers leave before dawn; by morning the lost trail sends an entire grieving city home.",
        citation: duttAyodhyaRangeCitation(121, 123, 46, 48, "XLVI", "XLVIII", 645749, 658759, 10269, 10474, "8b635f501058224395a640378b025f341a5a50b2709c31f9ed7d831567e3a3e8"),
        visual: { asset: "/journeys/ramayana-rivers-tamasa-night-v1.webp", location: "Tamasa riverbank · narrative world", cast: ["Rama", "Sita", "Lakshmana", "Sumantra"], connections: [{ label: "The Tamasa riverbank", kind: "place", href: "/search?q=Tamasa%20Ramayana" }, { label: "Ayodhya's citizens", kind: "character", href: "/search?q=Ayodhya%20citizens%20follow%20Rama" }, { label: "Ayodhyā Kāṇḍa", kind: "source", href: "/search?q=Dutt%20Ayodhya%20Kanda" }] },
      },
      {
        id: "roads-beyond-kosala", ordinal: 11, title: "Beyond Kosala", eyebrow: "Ayodhyā Kāṇḍa · XLIX–L", summary: "Fields, villages, and smaller rivers carry the car beyond Kosala. Rama turns once toward Ayodhya before the Ganga fills the horizon and Guha arrives.",
        citation: duttAyodhyaRangeCitation(124, 125, 49, 50, "XLIX", "L", 658759, 668761, 10475, 10631, "34f1afaab4a3dab6f5c0d459b7690bfc9d85dfa9996f965228844654f2729097"),
        visual: { asset: "/journeys/ramayana-rivers-kosala-road-v1.webp", location: "Kosala to Shringaverapura · narrative route", cast: ["Rama", "Sita", "Lakshmana", "Sumantra", "Guha"], connections: [{ label: "The road beyond Kosala", kind: "place", href: "/search?q=Rama%20leaves%20Kosala" }, { label: "Guha", kind: "character", href: "/search?q=Guha%20Ramayana" }, { label: "Ganga", kind: "place", href: "/search?q=Ganga%20Ramayana" }] },
      },
      {
        id: "guha-night-watch", ordinal: 12, title: "Guha keeps watch", eyebrow: "Ayodhyā Kāṇḍa · LI", summary: "Guha offers protection and rest, but Lakshmana cannot sleep while Rama and Sita lie on the ground. The two keep a grieving vigil together.",
        citation: duttAyodhyaRangeCitation(126, 126, 51, 51, "LI", "LI", 668761, 672436, 10632, 10688, "1e77741ee583950f2af1ce332179dd7e591a5c971f3a8012aa59da57221ae7e2"),
        visual: { asset: "/journeys/ramayana-rivers-guha-watch-v1.webp", location: "Shringaverapura · Ganga riverbank", cast: ["Guha", "Lakshmana", "Rama", "Sita", "Sumantra"], connections: [{ label: "Guha", kind: "character", href: "/search?q=Guha%20Ramayana" }, { label: "Shringaverapura", kind: "place", href: "/search?q=Shringaverapura%20Ramayana" }, { label: "Lakshmana", kind: "character", href: "/search?q=Lakshmana%20Ramayana" }] },
      },
      {
        id: "ganga-crossing", ordinal: 13, title: "The Ganga divides two lives", eyebrow: "Ayodhyā Kāṇḍa · LII", summary: "Sumantra must take the empty car home. Guha readies the boat, the forest vow becomes visible, and Sita speaks hope of return in midstream.",
        citation: duttAyodhyaRangeCitation(127, 127, 52, 52, "LII", "LII", 672436, 686965, 10689, 10901, "ccba871d5695115fe4fc1960be35c6525385c25ec379f457e2c7a834fb6756f0"),
        visual: { asset: "/journeys/ramayana-rivers-ganga-crossing-v1.webp", location: "Ganga crossing · narrative world", cast: ["Rama", "Sita", "Lakshmana", "Guha", "Sumantra"], connections: [{ label: "The Ganga crossing", kind: "place", href: "/search?q=Rama%20Ganga%20crossing" }, { label: "Sumantra", kind: "character", href: "/search?q=Sumantra%20empty%20chariot" }, { label: "Sita's source-story prayer", kind: "source", href: "/search?q=Sita%20Ganga%20prayer%20Ramayana" }] },
      },
      {
        id: "first-forest-night", ordinal: 14, title: "The first forest night", eyebrow: "Ayodhyā Kāṇḍa · LIII", summary: "Without car or inhabited road, Rama voices fear and anger about the family behind them. Lakshmana answers by making companionship present.",
        citation: duttAyodhyaRangeCitation(128, 128, 53, 53, "LIII", "LIII", 686965, 692084, 10902, 10981, "ff8718108103e45af831d7815116b6fcf4e1f05c0988079e8151ff1b4d57c6ac"),
        visual: { asset: "/journeys/ramayana-rivers-forest-night-v1.webp", location: "Beyond the Ganga · first forest night", cast: ["Rama", "Sita", "Lakshmana"], connections: [{ label: "Rama", kind: "character", href: "/search?q=Rama%20Ramayana" }, { label: "Lakshmana", kind: "character", href: "/search?q=Lakshmana%20Ramayana" }, { label: "The first forest night", kind: "place", href: "/search?q=Ramayana%20first%20forest%20night" }] },
      },
      {
        id: "prayaga-to-yamuna", ordinal: 15, title: "From the confluence to the Yamuna", eyebrow: "Ayodhyā Kāṇḍa · LIV–LV", summary: "Bharadvaja turns an unknown forest into a road toward Chitrakoot. The travellers cross the Yamuna on a hand-built raft and enter a flowering world.",
        citation: duttAyodhyaRangeCitation(129, 130, 54, 55, "LIV", "LV", 692084, 702741, 10982, 11146, "4eac8102cf00157b6951ca2224239bc310c033c0cba648f0d3c6cb5f2e2a070d"),
        visual: { asset: "/journeys/ramayana-rivers-yamuna-road-v1.webp", location: "Prayaga to the Yamuna · narrative route", cast: ["Rama", "Sita", "Lakshmana", "Bharadvaja"], connections: [{ label: "Bharadvaja", kind: "character", href: "/search?q=Bharadvaja%20Ramayana" }, { label: "The Yamuna crossing", kind: "place", href: "/search?q=Sita%20Yamuna%20Ramayana" }, { label: "Chitrakoot", kind: "place", href: "/search?q=Chitrakoot%20Ramayana" }] },
      },
      {
        id: "chitrakoot-home", ordinal: 16, title: "A home at Chitrakoot", eyebrow: "Ayodhyā Kāṇḍa · LVI", summary: "Birdsong and mountain water lead to a chosen dwelling. Lakshmana builds the cottage, and the three enter a home made by their own work.",
        citation: duttAyodhyaRangeCitation(131, 131, 56, 56, "LVI", "LVI", 702741, 708335, 11147, 11234, "933dd313f53b1a9c0a6fa2bf4644e970cc7e3bf8e4bd0f13fe01d44348866931"),
        visual: { asset: "/journeys/ramayana-rivers-chitrakoot-home-v1.webp", location: "Chitrakoot cottage · narrative world", cast: ["Rama", "Sita", "Lakshmana"], connections: [{ label: "Chitrakoot", kind: "place", href: "/search?q=Chitrakoot%20Ramayana" }, { label: "Lakshmana", kind: "character", href: "/search?q=Lakshmana%20Chitrakoot%20cottage" }, { label: "Source-story household rites", kind: "source", href: "/search?q=Ayodhya%20Kanda%20LVI" }] },
      },
      {
        id: "leave-lanka", ordinal: 17, title: "Leave Lanka", eyebrow: "Yuddha Kāṇḍa · CXXIV", summary: "With the war behind them, the companions gather and the Pushpaka rises. Home is no longer an idea; it becomes a direction.",
        citation: duttYuddhaCitation(122, "CXXIV", 124, 810878, 814570, 12968, 13025, "07276778cf5e60d8a52e33c18477bdf3537636243f4b7bc620250c38ff72af96"),
        visual: { asset: "/journeys/ramayana-return-lanka-v1.webp", location: "Lanka · narrative world", cast: ["Rama", "Sita", "Lakshmana", "Hanuman", "Sugriva", "Vibhishana"], connections: [{ label: "Lanka", kind: "place", href: "/search?q=Lanka%20Ramayana" }, { label: "Vibhishana", kind: "character", href: "/search?q=Vibhishana%20Ramayana" }, { label: "The selected Dutt edition", kind: "source", href: "/search?q=Manmatha%20Nath%20Dutt%20Ramayana" }] },
      },
      {
        id: "sky-road", ordinal: 18, title: "The sky road remembers", eyebrow: "Yuddha Kāṇḍa · CXXV", summary: "As the journey turns north, places from loss, alliance, and battle pass below. The route becomes a memory of everyone who made return possible.",
        citation: duttYuddhaCitation(123, "CXXV", 125, 814570, 821805, 13026, 13135, "ac4a5d9e558ad6f19bb7e8558f899971321a5f810116030fcd0843f5a0872010"),
        visual: { asset: "/journeys/ramayana-return-sky-road-v1.webp", location: "The homeward sky · narrative route", cast: ["Rama", "Sita", "Lakshmana", "Hanuman"], connections: [{ label: "Sita", kind: "character", href: "/search?q=Sita%20Ramayana" }, { label: "Kishkindha", kind: "place", href: "/search?q=Kishkindha%20Ramayana" }, { label: "The wider seven-kāṇḍa library", kind: "source", href: "/search?q=seven%20books%20Ramayana" }] },
      },
      {
        id: "bharadvaja-hermitage", ordinal: 19, title: "Home is near", eyebrow: "Yuddha Kāṇḍa · CXXVI", summary: "At Bharadvaja's hermitage, Rama's first questions are about Ayodhya, Bharata, and the mothers he has not seen through fourteen years of exile.",
        citation: duttYuddhaCitation(124, "CXXVI", 126, 821805, 825278, 13136, 13193, "2b5f780068a77fe5465ff61956b5355b78afdfeb1c872c4e4dff768cb20dabe4"),
        visual: { asset: "/journeys/ramayana-return-hermitage-v1.webp", location: "Bharadvaja's hermitage · narrative world", cast: ["Rama", "Sita", "Lakshmana", "Bharadvaja", "Hanuman"], connections: [{ label: "Bharadvaja", kind: "character", href: "/search?q=Bharadvaja%20Ramayana" }, { label: "Ayodhya", kind: "place", href: "/search?q=Ayodhya%20Ramayana" }, { label: "Shringverpur living place context", kind: "place", href: "/search?q=Shringverpur%20Ramayana" }] },
      },
      {
        id: "hanuman-goes-ahead", ordinal: 20, title: "Hanuman goes ahead", eyebrow: "Yuddha Kāṇḍa · CXXVII", summary: "Before the returning party arrives, Hanuman carries the news to Guha and Bharata. The last distance home is crossed first by trust and a message.",
        citation: duttYuddhaCitation(125, "CXXVII", 127, 825278, 832093, 13194, 13299, "4d3da830889d7d0c551c2cabb152f6dcb0695b7a5a2d50dc8854713699f14fb6"),
        visual: { asset: "/journeys/ramayana-return-hanuman-ahead-v1.webp", location: "The road to Nandigrama · narrative world", cast: ["Hanuman", "Bharata", "Guha"], connections: [{ label: "Hanuman", kind: "character", href: "/search?q=Hanuman%20Ramayana" }, { label: "Bharata", kind: "character", href: "/search?q=Bharata%20Ramayana" }, { label: "Ramlila", kind: "performance", href: "/search?q=Ramlila%20UNESCO" }] },
      },
      {
        id: "bharata-hears", ordinal: 21, title: "Bharata hears the news", eyebrow: "Yuddha Kāṇḍa · CXXVIII", summary: "Bharata asks how the exile became alliance and victory. Hanuman tells the road behind them, turning a distant return into something real.",
        citation: duttYuddhaCitation(126, "CXXVIII", 128, 832093, 839471, 13300, 13413, "2db463f691012175d4ba4583da53837c3576158a88b2d78d4606e51117b37c31"),
        visual: { asset: "/journeys/ramayana-return-bharata-hears-v1.webp", location: "Nandigrama · narrative world", cast: ["Hanuman", "Bharata", "Shatrughna"], connections: [{ label: "Bharata", kind: "character", href: "/search?q=Bharata%20Ramayana" }, { label: "The forest exile", kind: "place", href: "/search?q=Ramayana%20forest%20exile" }, { label: "Hanuman in Lanka", kind: "source", href: "/search?q=Hanuman%20Lanka%20Sundara%20Kanda" }] },
      },
      {
        id: "ayodhya-prepares", ordinal: 22, title: "Ayodhya prepares", eyebrow: "Yuddha Kāṇḍa · CXXIX", summary: "The city moves as one: roads, music, standards, families, and companions all turn toward the approaching reunion.",
        citation: duttYuddhaCitation(127, "CXXIX", 129, 839471, 847239, 13414, 13530, "097c1dc22e4d379c367cf61a656856ea2f26face1092709ada5a1d75345c1837"),
        visual: { asset: "/journeys/ramayana-return-ayodhya-v1.webp", location: "Ayodhya · narrative world", cast: ["Rama", "Sita", "Lakshmana", "Bharata", "Shatrughna", "Hanuman"], connections: [{ label: "Ayodhya", kind: "place", href: "/search?q=Ayodhya" }, { label: "Rama's homecoming and Diwali", kind: "festival", href: "/search?q=Ramayana%20Diwali%20homecoming" }, { label: "Ramlila performance worlds", kind: "performance", href: "/search?q=Ramlila" }] },
      },
      {
        id: "kingdom-returned", ordinal: 23, title: "The kingdom is returned", eyebrow: "Yuddha Kāṇḍa · CXXX", summary: "Bharata returns the kingdom he held in trust. The road closes not at a palace gate, but in responsibility accepted again before the people.",
        citation: duttYuddhaCitation(128, "CXXX", 130, 847239, 863655, 13531, 13777, "0eab6905146d65e1f905b5e974d473712234c86fa12bf1902fcf9f1f435e9405"),
        visual: { asset: "/journeys/ramayana-return-coronation-v1.webp", location: "Ayodhya · coronation world", cast: ["Rama", "Sita", "Lakshmana", "Bharata", "Shatrughna", "Vasishta", "Hanuman", "Sugriva", "Vibhishana"], connections: [{ label: "North Indian Diwali homecoming tradition", kind: "festival", href: "/search?q=Diwali%20Rama%20Ayodhya" }, { label: "Ramlila", kind: "performance", href: "/search?q=Ramlila%20traditional%20performance" }, { label: "Continue through the Ramayana universe", kind: "source", href: "/search?q=Ramayana" }] },
      },
    ],
  },
  {
    slug: "ganesha",
    hero: "Ganesha",
    devanagari: "गणेश",
    title: "Inside one hymn to Gaṇapati",
    invitation: "Follow the opening question, devotional lens, yajña image, and closing prayer.",
    durationMinutes: 9,
    tone: "moon",
    sourceBoundary: "This is one CC0 hymn transcription with 32 observed units and unresolved wider structural authority. It is not a complete Ganesha corpus or universal puja procedure.",
    completeHeroUniverse: false,
    stops: [
      { id: "the-question", ordinal: 1, title: "The question", eyebrow: "Unit 1", summary: "The Goddess asks Maheshvara for an effortless way to please Vighneśa.", citation: ganeshaCitation(1, 1882, 2213, 51, 55, "7d77eb179acf58fe9034fcf632c494be8db40bcfdcdd0cd238fe939deeceb857", "श्रीदेव्युवाच---\nविना तपो विना ध्यानं विना होमं विना जपम् ।\nअनायासेन विघ्नेशप्रीणनं वद मे प्रभो ॥ १ ॥") },
      { id: "the-devotional-lens", ordinal: 2, title: "The devotional lens", eyebrow: "Unit 12", summary: "The hymn praises Gaṇapati as the destroyer of devotees’ impediments.", citation: ganeshaCitation(12, 5875, 6153, 104, 107, "a01ab2eb043de5be3e93bc42cb6052f443a367b1d0511cf07b6eb1ad2704660d", "परानन्दमयं भक्तप्रत्यूहव्यूहनाशनम् ।\nपरमार्थप्रबोधाब्धिं पश्यामि गणनायकम् ॥ १२ ॥") },
      { id: "yajna-form", ordinal: 3, title: "Yajña-form", eyebrow: "Unit 29", summary: "One unit presents Gaṇapati as sacrificer, form of yajña, and sacrificial person.", citation: ganeshaCitation(29, 11698, 11959, 179, 182, "d5d285bf953108336b6a7475a78c58c75af78c913fff78ede2a5e767fe96c7d3", "यजमानतनुं यागरूपिणं यज्ञपूरुषम् ।\nयमं यमवतामर्च्यं यत्नभाजामदुर्लभम् ॥ २९ ॥") },
      { id: "closing-prayer", ordinal: 4, title: "The closing prayer", eyebrow: "Unit 32", summary: "The final numbered unit names the hymn and closes with a prayer for auspicious good.", citation: ganeshaCitation(32, 12595, 12964, 191, 194, "1f7bc86f5d61422e4fa41413a4b095fe2a9771a80ce83baa25a5df77c60e0841", "इति6मन्त्रावलिस्तोत्रं कथितं तव सुन्दरि ।\nसमस्तमीप्सितं तेन सम्पादय शिवे7शिवम् ॥ ३२ ॥") },
    ],
  },
  {
    slug: "durga",
    hero: "Durga",
    devanagari: "दुर्गा",
    title: "The Devīmāhātmya boundary",
    invitation: "Enter the contextual opening, follow the thirteen-chapter sequence, and preserve its exact close.",
    durationMinutes: 12,
    tone: "rose",
    sourceBoundary: "This route follows chapters 81–93 inside one GRETIL Mārkaṇḍeyapurāṇa carrier. The carrier lacks chapters 94 onward and is internal noncommercial review evidence, not complete Durga or Navaratri coverage.",
    completeHeroUniverse: false,
    stops: [
      { id: "context-opening", ordinal: 1, title: "Enter the frame", eyebrow: "Chapter 81", summary: "Begin at the contextual chapter retained with the embedded Devīmāhātmya sequence.", citation: durgaCitation(1, 81, 652098, 664763, 21541, 21966, "0e079ab0b848666fb186d22e925db56f79b0bcb043b8b37aa5a96b43acc91860") },
      { id: "proper-opening", ordinal: 2, title: "Begin the poem", eyebrow: "Chapter 82", summary: "Move into the first chapter identified as the Devīmāhātmya proper in the separately retained Pargiter contents evidence.", citation: durgaCitation(2, 82, 664764, 675861, 21967, 22326, "be6940cce9e9bbab96329dc9cb56a51d41e1ed06223aeff1872310bff0bc64b3") },
      { id: "last-proper-canto", ordinal: 3, title: "Reach the last proper canto", eyebrow: "Chapter 92", summary: "Arrive at the final chapter of the poem proper while retaining its source coordinates.", citation: durgaCitation(12, 92, 741339, 747516, 24474, 24671, "d99e78041f205bc10fc03354c49bd98977a87ed9d9e2f949e749c1e70fc4fcd3") },
      { id: "context-close", ordinal: 4, title: "Return to the frame", eyebrow: "Chapter 93", summary: "Close with the contextual conclusion and the carrier’s terminal Devīmāhātmya formula.", citation: durgaCitation(13, 93, 747517, 750543, 24672, 24776, "788f1df4de5cb40cfd9039bf7ea261af5e075dcbd199d529e5d36bc45398fa01") },
    ],
  },
  {
    slug: "diwali",
    hero: "Diwali",
    devanagari: "दीपावली",
    title: "Six lights, many traditions",
    invitation: "Follow a bounded Diwali path while keeping each regional and religious tradition distinct.",
    durationMinutes: 12,
    tone: "gold",
    sourceBoundary: "The six-stop journey structure comes from one Devam-authored West India evidence synthesis. Separate current-contract packs now complete bounded Vasu Baras, Dhantrayodashi, Yama Deepam, Maharashtra Naraka Chaturdashi, Tamil Deepavali, BAPS Kali Chaudash, West India Lakshmi Puja, Bengal Kali Puja participation, Maharashtra Bali Pratipada, ISKCON Bangalore Govardhana Puja, BAPS Gujarati New Year, Karnataka Balipadyami, North India Bhai Dooj, and SGPC-context Bandi Chhor participation lanes. Jain Diwali remains an explicitly incomplete umbrella companion pending sect- and sangh-specific vidhi; neither the journey nor these lanes are every Diwali tradition, every regional calendar, or universal ritual authority.",
    completeHeroUniverse: false,
    stops: [
      { id: "vasubaras", ordinal: 1, title: "Vasubaras", eyebrow: "Lane one · bounded", summary: "Begin with the Maharashtra family lane for care, nourishment, Govatsa remembrance, and a safe no-contact practice.", citation: diwaliCitation(1, 11333, 11839, 112, "b74c2ef9a6ae87aa4f7d6f93ccdb815a189143b444cdc2ef7e80b257dbe3ab39", "resolved_for_bounded_2026_context") },
      { id: "dhantrayodashi", ordinal: 2, title: "Dhantrayodashi", eyebrow: "Lane two · two bounded paths", summary: "Explore Dhantrayodashi and Yama Deepam as separate complete-in-scope household paths rather than reducing the day to shopping.", citation: diwaliCitation(2, 11848, 12319, 113, "d4af31278056bda319be674cf78c0e5bb0053980aa375aea64bcf7d9525214a4", "resolved_for_bounded_2026_context") },
      { id: "naraka-chaturdashi", ordinal: 3, title: "Naraka Chaturdashi", eyebrow: "Lane three · three bounded paths", summary: "Explore Maharashtra Abhyanga Snan, Tamil Deepavali, and BAPS Kali Chaudash as separate complete-in-scope paths without flattening their dates, stories, or living authorities.", citation: diwaliCitation(3, 12328, 12824, 114, "5f2ddec12b68c6dde2ccc0c7b2132990f106bdfcbfd4890744b6f3be759512ec", "partially_resolved_distinct_lanes") },
      { id: "lakshmi-pujan", ordinal: 4, title: "Lakshmi Pujan", eyebrow: "Lane four · two bounded paths", summary: "Explore West India Lakshmi Puja and Bengal Kali Puja participation as separate complete-in-scope paths without merging their deities, settings, or authorities.", citation: diwaliCitation(4, 12833, 13358, 115, "dc2a11fc4e20669500edb56d31a0ce22ddf2b6db77138e8235f0388b1f069de5", "resolved_for_bounded_2026_context") },
      { id: "bali-govardhan", ordinal: 5, title: "Bali and Govardhan", eyebrow: "Lane five · four bounded paths", summary: "Explore Maharashtra Padwa/Bali, ISKCON Bangalore Govardhana/Annakut, BAPS Gujarati New Year, and Karnataka Balipadyami as separate complete-in-scope paths even when dates coincide.", citation: diwaliCitation(5, 13367, 13863, 116, "c4533b305c4bb1ef34a220e09adf38be8b69d0ef1dcd5eb21b1f3925f28f5dc0", "resolved_for_bounded_2026_context") },
      { id: "bhau-beej", ordinal: 6, title: "Bhau Beej", eyebrow: "Lane six · one bounded path", summary: "Use the North India Bhai Dooj household path while leaving Bhau Beej, Bhai Phota, Bhai Tika, Yama Dvitiya, and other sibling-festival forms attributable to their families and regions.", citation: diwaliCitation(6, 13872, 14344, 117, "eb7934caff2896a310bc9313d073e533f62816ad756f2834ea544f4cd7805878", "partially_resolved_distinct_lanes") },
    ],
  },
];

export const heroChallenges: HeroChallenge[] = heroJourneys.map((journey) => ({
  slug: `${journey.slug}-source-path`,
  journeySlug: journey.slug,
  title: `Complete the ${journey.hero} source path`,
  mission: `Explore all ${journey.stops.length} source-addressed stops in “${journey.title}”.`,
  requiredStopIds: journey.stops.map((stop) => stop.id),
  rewardLabel: "Source thread discovered",
  spiritualScore: false,
}));

export function getHeroJourney(slug: string): HeroJourney | undefined {
  return heroJourneys.find((journey) => journey.slug === slug);
}

export function getHeroLibraryJourney(slug: string): HeroJourney | undefined {
  return slug === "ramayana" ? ramayanaLibraryJourney : getHeroJourney(slug);
}
