import type { ExperienceCitation, HeroChallenge, HeroJourney } from "@/lib/domain/experience";

const DUTT_YUDDHA_SOURCE = "8d1b8901823f5b5bd8b3207370991ddf95e5c76cb30ad5271aef835c9708464b";
const DUTT_AYODHYA_SOURCE = "7d3b9e1613d60dfacea39f2564243e943cf38703eadb7245d92337b238082034";
const DUTT_ARANYA_SOURCE = "c3ef74a07ef0cf016eb0428deb76d6036d13be343c65225946471113a2da475b";
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

function duttAranyaRangeCitation(
  sourceOrdinalStart: number,
  sourceOrdinalEnd: number,
  markerStart: string,
  markerEnd: string,
  byteStart: number,
  byteEnd: number,
  lineStart: number,
  lineEnd: number,
  spanSha256: string,
): ExperienceCitation {
  return {
    sourceSha256: DUTT_ARANYA_SOURCE,
    sourceOrdinal: sourceOrdinalStart,
    spanSha256,
    workTitle: "The Ramayana",
    editionTitle: "Manmatha Nath Dutt English prose translation, Project Gutenberg volume 2",
    languageCode: "en",
    rightsLane: "product_allowed",
    locator: {
      contract: "DEVAM_DUTT_PG_SECTION_RANGE_V1",
      provider: "Project Gutenberg",
      ebook_id: 57826,
      volume: 2,
      kanda_ordinal: 3,
      kanda_slug: "aranya",
      kanda_title: "Aranyakanda",
      literal_marker_start: markerStart,
      literal_marker_end: markerEnd,
      source_relative_ordinal_start: sourceOrdinalStart,
      source_relative_ordinal_end: sourceOrdinalEnd,
      kanda_relative_ordinal_start: sourceOrdinalStart,
      kanda_relative_ordinal_end: sourceOrdinalEnd,
      source_ordered_count: sourceOrdinalEnd - sourceOrdinalStart + 1,
      byte_start: byteStart,
      byte_end_exclusive: byteEnd,
      line_start: lineStart,
      line_end: lineEnd,
      printed_number_not_unique_key: true,
      printed_marker_defect: "The source prints SECTI0N VI with a zero; source order and byte spans remain authoritative.",
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
    title: "The promise, the forest, the sandals, and the return",
    invitation: "Choose an illustrated district: watch coronation night become exile, cross the first rivers, return to an empty throne, ask Rama home at Chitrakoot, travel through Dandaka, enter the breaking world of Panchavati, or join the homecoming party from Lanka.",
    durationMinutes: 150,
    tone: "saffron",
    sourceBoundary: "These seven playable districts follow Ayodhyā Kāṇḍa source units I–CXVIII in Project Gutenberg volume 1, the first fifty-three source-ordered Araṇya Kāṇḍa passages in volume 2, and Yuddha Kāṇḍa source units CXXIV–CXXX in volume 3 of Manmatha Nath Dutt's product-allowed English prose translation. The Araṇya source prints SECTI0N VI with a zero; byte spans and source order remain authoritative. These are selected-expression retellings, not every Ramayana, a historical route, a universal ethical judgment or Diwali origin, or a complete account of any character, place, festival, or theology.",
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
        id: "empty-chariot-return", ordinal: 17, title: "The empty chariot returns", eyebrow: "Ayodhyā Kāṇḍa · LVII–LIX", summary: "Sumantra returns through a city that runs toward the absent travellers, then carries Rama, Sita, and Lakshmana's distinct responses into Dasharatha's chamber.",
        citation: duttAyodhyaRangeCitation(132, 134, 57, 59, "LVII", "LIX", 708336, 723058, 11236, 11460, "aaf79e58ff071a750764e592cad909cf22d527f0e6c42989a719a6b7eadf2937"),
        visual: { asset: "/journeys/ramayana-throne-empty-chariot-v1.webp", location: "Ayodhya · the returning road", cast: ["Sumantra", "Dasharatha", "Kausalya", "Rama", "Sita", "Lakshmana"], connections: [{ label: "Sumantra", kind: "character", href: "/search?q=Sumantra%20empty%20chariot" }, { label: "Ayodhya", kind: "place", href: "/search?q=Ayodhya%20Ramayana" }, { label: "The selected Dutt edition", kind: "source", href: "/search?q=Ayodhya%20Kanda%20LVII" }] },
      },
      {
        id: "palace-grief-dialogue", ordinal: 18, title: "Grief speaks in the palace", eyebrow: "Ayodhyā Kāṇḍa · LX–LXII", summary: "Kausalya asks to follow the travellers, Sumantra offers the evidence he has, and the royal couple confronts the command's human cost through the fifth night.",
        citation: duttAyodhyaRangeCitation(135, 137, 60, 62, "LX", "LXII", 723058, 733340, 11461, 11623, "841f0040bb194d34f854d52cbb1f1934995fa090f553bee5df0d17185223a502"),
        visual: { asset: "/journeys/ramayana-throne-palace-grief-v1.webp", location: "Ayodhya palace · fifth night", cast: ["Kausalya", "Dasharatha", "Sumantra", "Sumitra"], connections: [{ label: "Kausalya", kind: "character", href: "/search?q=Kausalya%20Ramayana" }, { label: "Dasharatha", kind: "character", href: "/search?q=Dasharatha%20Ramayana" }, { label: "The travellers' road", kind: "place", href: "/search?q=Rama%20Sita%20Lakshmana%20exile" }] },
      },
      {
        id: "river-sound-confession", ordinal: 19, title: "The sound by the river", eyebrow: "Ayodhyā Kāṇḍa · LXIII–LXIV", summary: "Dasharatha recounts the arrow he released toward an unseen sound, the ascetic youth and parents it destroyed, and the curse he now feels reaching its end.",
        citation: duttAyodhyaRangeCitation(138, 139, 63, 64, "LXIII", "LXIV", 733340, 752213, 11624, 11905, "d752383691a5c047d64ebb34699474c8fb984e0eb574c44d595f5029f88c3d95"),
        visual: { asset: "/journeys/ramayana-throne-river-memory-v1.webp", location: "Sarayu · remembered rainy night", cast: ["Dasharatha", "Kausalya"], connections: [{ label: "Dasharatha", kind: "character", href: "/search?q=Dasharatha%20sound%20arrow" }, { label: "Sarayu", kind: "place", href: "/search?q=Sarayu%20Ramayana" }, { label: "Ayodhyā Kāṇḍa LXIII–LXIV", kind: "source", href: "/search?q=Ayodhya%20Kanda%20LXIII" }] },
      },
      {
        id: "city-without-king", ordinal: 20, title: "Ayodhya wakes without a king", eyebrow: "Ayodhyā Kāṇḍa · LXV–LXVIII", summary: "Morning service discovers Dasharatha's death, the farewell is suspended until a son returns, and Vasishta sends guarded messengers toward Bharata.",
        citation: duttAyodhyaRangeCitation(140, 143, 65, 68, "LXV", "LXVIII", 752213, 769147, 11906, 12170, "94494c276525af3456b72adc4d6d019ab658341c76c4e58a977bd7bda873232d"),
        visual: { asset: "/journeys/ramayana-throne-city-without-king-v1.webp", location: "Ayodhya · palace and council", cast: ["Dasharatha", "Kausalya", "Kaikeyi", "Vasishta"], connections: [{ label: "The empty throne", kind: "place", href: "/search?q=Dasharatha%20death%20Ayodhya" }, { label: "Vasishta", kind: "character", href: "/search?q=Vasishta%20Ramayana" }, { label: "Bharata", kind: "character", href: "/search?q=Bharata%20Ramayana" }] },
      },
      {
        id: "bharata-urgent-return", ordinal: 21, title: "Bharata races toward the silence", eyebrow: "Ayodhyā Kāṇḍa · LXIX–LXXI", summary: "A dark dream and evasive messengers send Bharata and Shatrughna across seven nights into an Ayodhya whose empty streets disclose the loss first.",
        citation: duttAyodhyaRangeCitation(144, 146, 69, 71, "LXIX", "LXXI", 769147, 783362, 12171, 12404, "22c1e9072d8b6b414d42d1625b73cef27c22e434af7fa550400797dab31301a0"),
        visual: { asset: "/journeys/ramayana-throne-bharata-return-v1.webp", location: "Kekaya to Ayodhya · seven-night road", cast: ["Bharata", "Shatrughna", "Dasharatha"], connections: [{ label: "Bharata", kind: "character", href: "/search?q=Bharata%20Ramayana" }, { label: "Shatrughna", kind: "character", href: "/search?q=Shatrughna%20Ramayana" }, { label: "The silent city", kind: "place", href: "/search?q=Ayodhya%20Bharata%20return" }] },
      },
      {
        id: "bharata-rejects-boons", ordinal: 22, title: "Bharata rejects the boons", eyebrow: "Ayodhyā Kāṇḍa · LXXII–LXXIV", summary: "Kaikeyi presents death, exile, and the throne as a successful plan; Bharata rejects the result and promises to bring Rama home.",
        citation: duttAyodhyaRangeCitation(147, 149, 72, 74, "LXXII", "LXXIV", 783362, 801041, 12405, 12679, "c882b50ec704e8fb5f7448abac2303aaa73253538e5eaafd65bc9a3a3302090b"),
        visual: { asset: "/journeys/ramayana-throne-boons-rejected-v1.webp", location: "Kaikeyi's chamber · revelation", cast: ["Bharata", "Kaikeyi", "Dasharatha", "Rama"], connections: [{ label: "Kaikeyi", kind: "character", href: "/search?q=Kaikeyi%20Bharata" }, { label: "Bharata's vow", kind: "source", href: "/search?q=Bharata%20bring%20Rama%20back" }, { label: "The two boons", kind: "source", href: "/search?q=Ramayana%20two%20boons" }] },
      },
      {
        id: "funeral-and-trust", ordinal: 23, title: "Mourning becomes trust", eyebrow: "Ayodhyā Kāṇḍa · LXXV–LXXVII", summary: "Kausalya tests Bharata's innocence, embraces another grieving son, and the family finally carries Dasharatha from the suspended palace to the Sarayu rites.",
        citation: duttAyodhyaRangeCitation(150, 152, 75, 77, "LXXV", "LXXVII", 801041, 818242, 12680, 12942, "278d658264d752ea0fcb270e13de590085340c08d9648831ffee9a3c60ddfd53"),
        visual: { asset: "/journeys/ramayana-throne-funeral-trust-v1.webp", location: "Ayodhya to the Sarayu · mourning world", cast: ["Bharata", "Shatrughna", "Kausalya", "Vasishta", "Dasharatha"], connections: [{ label: "Kausalya and Bharata", kind: "character", href: "/search?q=Kausalya%20Bharata" }, { label: "Sarayu", kind: "place", href: "/search?q=Sarayu%20Ayodhya" }, { label: "Source-story funeral", kind: "source", href: "/search?q=Dasharatha%20funeral%20Ramayana" }] },
      },
      {
        id: "crown-refused-road", ordinal: 24, title: "The crown becomes a road", eyebrow: "Ayodhyā Kāṇḍa · LXXVIII–LXXXII", summary: "Bharata stops vengeance, refuses installation, and redirects ministers, workers, Sumantra, and the gathered city toward an expedition to bring Rama back.",
        citation: duttAyodhyaRangeCitation(153, 157, 78, 82, "LXXVIII", "LXXXII", 818242, 834303, 12943, 13201, "e8d794d4eb7defdc272c90bc719e505b36529a13f809e71800d96a6439aa8fd1"),
        visual: { asset: "/journeys/ramayana-throne-road-to-rama-v1.webp", location: "Ayodhya · assembly and forest road", cast: ["Bharata", "Shatrughna", "Manthara", "Vasishta", "Sumantra"], connections: [{ label: "Bharata", kind: "character", href: "/search?q=Bharata%20refuses%20kingdom" }, { label: "The road to Rama", kind: "place", href: "/search?q=Bharata%20Chitrakoot%20journey" }, { label: "Continue to Chitrakoot", kind: "place", href: "/search?q=Bharata%20meets%20Rama%20Chitrakoot" }] },
      },
      {
        id: "expedition-reaches-ganga", ordinal: 25, title: "A kingdom reaches the Ganga", eyebrow: "Ayodhyā Kāṇḍa · LXXXIII–LXXXV", summary: "Bharata leads a city-sized expedition to Shringaverapura, where Guha sees the scale of the force before he can know its purpose.",
        citation: duttAyodhyaRangeCitation(158, 160, 83, 85, "LXXXIII", "LXXXV", 834303, 843167, 13202, 13344, "1ff5fd6ca5c0c6e7341df5da7302096b69d30120a90a6c6361a10f390cacbd5d"),
        visual: { asset: "/journeys/ramayana-bharata-expedition-ganga-v1.webp", location: "Shringaverapura · expedition river camp", cast: ["Bharata", "Shatrughna", "Kausalya", "Sumitra", "Kaikeyi", "Guha"], connections: [{ label: "Guha", kind: "character", href: "/search?q=Guha%20Bharata%20Ramayana" }, { label: "The Ganga camp", kind: "place", href: "/search?q=Bharata%20Ganga%20Shringaverapura" }, { label: "Ayodhyā Kāṇḍa LXXXIII–LXXXV", kind: "source", href: "/search?q=Ayodhya%20Kanda%20LXXXIII" }] },
      },
      {
        id: "guha-shows-first-night", ordinal: 26, title: "Guha shows the first night", eyebrow: "Ayodhyā Kāṇḍa · LXXXVI–LXXXIX", summary: "Guha retells Lakshmana's vigil, shows Bharata the grass bed beneath the Ingudi tree, and ferries the expedition across the Ganga.",
        citation: duttAyodhyaRangeCitation(161, 164, 86, 89, "LXXXVI", "LXXXIX", 843167, 857190, 13345, 13568, "9c244b0acff25a81453e9c20087209ef25c81da826e8fb27d47e5657d62fac6c"),
        visual: { asset: "/journeys/ramayana-bharata-ingudi-crossing-v1.webp", location: "Ingudi tree and Ganga crossing · narrative world", cast: ["Guha", "Bharata", "Shatrughna", "Kausalya", "Rama", "Sita", "Lakshmana"], connections: [{ label: "The first night", kind: "place", href: "/search?q=Rama%20grass%20bed%20Guha" }, { label: "Lakshmana's vigil", kind: "source", href: "/search?q=Lakshmana%20Guha%20night%20watch" }, { label: "The Ganga crossing", kind: "place", href: "/search?q=Bharata%20crosses%20Ganga" }] },
      },
      {
        id: "bharadvaja-tests-hosts", ordinal: 27, title: "Bharadvaja tests and receives", eyebrow: "Ayodhyā Kāṇḍa · LXXXX–LXXXXII", summary: "Bharadvaja tests Bharata's intention, welcomes the entire expedition without erasing the hermitage boundary, and points toward Chitrakoot.",
        citation: duttAyodhyaRangeCitation(165, 167, 90, 92, "LXXXX", "LXXXXII", 857190, 877001, 13569, 13868, "aa15406169c65ffad98dc7dc183fcc9d675bef9e1474b6ad5795dd9986958445"),
        visual: { asset: "/journeys/ramayana-bharata-bharadvaja-wonder-v1.webp", location: "Bharadvaja's hermitage · wondrous camp", cast: ["Bharadvaja", "Bharata", "Vasishta", "Kausalya", "Sumitra", "Kaikeyi"], connections: [{ label: "Bharadvaja", kind: "character", href: "/search?q=Bharadvaja%20Bharata" }, { label: "Prayaga", kind: "place", href: "/search?q=Prayaga%20Ramayana" }, { label: "The route to Chitrakoot", kind: "place", href: "/search?q=Bharadvaja%20route%20Chitrakoot" }] },
      },
      {
        id: "chitrakoot-hears-army", ordinal: 28, title: "Chitrakoot hears an army", eyebrow: "Ayodhyā Kāṇḍa · LXXXXIII–LXXXXVIII", summary: "The forest scatters before the expedition, Lakshmana reads danger in Bharata's standard, and Bharata stops the force before walking the last distance.",
        citation: duttAyodhyaRangeCitation(168, 173, 93, 98, "LXXXXIII", "LXXXXVIII", 877001, 898522, 13869, 14211, "b7af7bbdb0da637b2bb97ef5ad1b058e7276c477913ed1a1c94b6249dbf51b47"),
        visual: { asset: "/journeys/ramayana-bharata-chitrakoot-alarm-v1.webp", location: "Chitrakoot · forest approach", cast: ["Rama", "Sita", "Lakshmana", "Bharata", "Shatrughna", "Guha"], connections: [{ label: "Chitrakoot", kind: "place", href: "/search?q=Chitrakoot%20Ramayana" }, { label: "Lakshmana", kind: "character", href: "/search?q=Lakshmana%20sees%20Bharata%20army" }, { label: "The column of smoke", kind: "place", href: "/search?q=Bharata%20Chitrakoot%20smoke" }] },
      },
      {
        id: "brothers-meet-death-news", ordinal: 29, title: "The brothers meet, then hear the loss", eyebrow: "Ayodhyā Kāṇḍa · LXXXXIX–CIII", summary: "Bharata reaches the cottage, the brothers embrace, Rama asks after an entire kingdom, and Dasharatha's death transforms reunion into river mourning.",
        citation: duttAyodhyaRangeCitation(174, 178, 99, 103, "LXXXXIX", "CIII", 898522, 929639, 14212, 14699, "398706e018e821c10115a62ffaae202a49ee9233d8404addd5842fc7bf04fb82"),
        visual: { asset: "/journeys/ramayana-bharata-brothers-meet-v1.webp", location: "Chitrakoot cottage and Mandakini · reunion world", cast: ["Rama", "Bharata", "Shatrughna", "Lakshmana", "Sita", "Sumantra", "Guha"], connections: [{ label: "The four brothers", kind: "character", href: "/search?q=Rama%20Bharata%20Shatrughna%20Lakshmana%20Chitrakoot" }, { label: "Dasharatha's death", kind: "source", href: "/search?q=Rama%20learns%20Dasharatha%20death" }, { label: "Mandakini", kind: "place", href: "/search?q=Mandakini%20Chitrakoot%20Ramayana" }] },
      },
      {
        id: "family-asks-rama-home", ordinal: 30, title: "The family asks Rama home", eyebrow: "Ayodhyā Kāṇḍa · CIV–CVII", summary: "The mothers and advisers gather beside the Mandakini while Bharata and Rama argue whether repairing harm or keeping Dasharatha's promise must govern the next act.",
        citation: duttAyodhyaRangeCitation(179, 182, 104, 107, "CIV", "CVII", 929639, 949752, 14700, 15010, "529ab3e0d92ca7fddbe436d4c0e43f4c2a0cd2d24aace212a3c163232d66c120"),
        visual: { asset: "/journeys/ramayana-bharata-family-council-v1.webp", location: "Mandakini · family council", cast: ["Rama", "Bharata", "Sita", "Lakshmana", "Kausalya", "Sumitra", "Vasishta"], connections: [{ label: "Kausalya", kind: "character", href: "/search?q=Kausalya%20Chitrakoot" }, { label: "Bharata's argument", kind: "source", href: "/search?q=Bharata%20asks%20Rama%20return" }, { label: "Rama's promise", kind: "source", href: "/search?q=Rama%20fourteen%20years%20promise" }] },
      },
      {
        id: "sandals-hold-kingdom", ordinal: 31, title: "The sandals hold the kingdom", eyebrow: "Ayodhyā Kāṇḍa · CVIII–CXII", summary: "Javali, Vasishta, Bharata, and Rama press competing arguments until the sandals become the bounded sign of a fourteen-year trust.",
        citation: duttAyodhyaRangeCitation(183, 187, 108, 112, "CVIII", "CXII", 949752, 974360, 15011, 15392, "c1dd5da558278a4bfacdbc4fea3b6794e5b97a7a4655911b2c23e65251f4f973"),
        visual: { asset: "/journeys/ramayana-bharata-sandals-vow-v1.webp", location: "Chitrakoot · council of the sandals", cast: ["Rama", "Bharata", "Shatrughna", "Vasishta", "Javali", "Kaikeyi"], connections: [{ label: "Javali", kind: "character", href: "/search?q=Javali%20Rama" }, { label: "Vasishta", kind: "character", href: "/search?q=Vasishta%20Bharata%20sandals" }, { label: "The fourteen-year trust", kind: "source", href: "/search?q=Bharata%20sandals%20fourteen%20years" }] },
      },
      {
        id: "nandigrama-trust", ordinal: 32, title: "The trust moves to Nandigrama", eyebrow: "Ayodhyā Kāṇḍa · CXIII–CXV", summary: "Bharata carries the sandals back through the rivers and silent Ayodhya, then governs from Nandigrama under a trust defined by Rama's return.",
        citation: duttAyodhyaRangeCitation(188, 190, 113, 115, "CXIII", "CXV", 974360, 984977, 15393, 15564, "fddea12aaee5d778376bfa8445172bdfdd4e6ebe159186ead4a07e7ebfdd68ea"),
        visual: { asset: "/journeys/ramayana-bharata-nandigrama-v1.webp", location: "Nandigrama · narrative governing world", cast: ["Bharata", "Shatrughna", "Vasishta", "Rama"], connections: [{ label: "Nandigrama", kind: "place", href: "/search?q=Nandigrama%20Bharata" }, { label: "Ayodhya", kind: "place", href: "/search?q=Ayodhya%20Ramayana" }, { label: "The waiting sandals", kind: "source", href: "/search?q=Rama%20sandals%20Nandigrama" }] },
      },
      {
        id: "chitrakoot-grows-unsafe", ordinal: 33, title: "Chitrakoot can no longer hold them", eyebrow: "Ayodhyā Kāṇḍa · CXVI", summary: "Neighbouring hermitages empty under threat, and the traces of Bharata's visit make the forest home too crowded with danger and memory to remain unchanged.",
        citation: duttAyodhyaRangeCitation(191, 191, 116, 116, "CXVI", "CXVI", 984977, 988643, 15565, 15623, "d3562d466eab2efc956a7a88174d5ba24af550fec2632b92b2af92b9333fbf4d"),
        visual: { asset: "/journeys/ramayana-dandaka-chitrakoot-departure-v1.webp", location: "Chitrakoot · an emptying forest home", cast: ["Rama", "Sita", "Lakshmana", "Khara"], connections: [{ label: "Chitrakoot", kind: "place", href: "/search?q=Chitrakoot%20Ramayana" }, { label: "Khara", kind: "character", href: "/search?q=Khara%20Ramayana" }, { label: "The road into Dandaka", kind: "place", href: "/search?q=Dandaka%20Ramayana" }] },
      },
      {
        id: "sita-tells-her-beginning", ordinal: 34, title: "Sita tells her own beginning", eyebrow: "Ayodhyā Kāṇḍa · CXVII–CXVIII", summary: "Welcomed by Atri and Anasuya, Sita recalls being found by Janaka, the bow assembly, and the choices that joined her road to Rama's.",
        citation: duttAyodhyaRangeCitation(192, 193, 117, 118, "CXVII", "CXVIII", 988643, 1003002, 15624, 15841, "397975355ba33de0c75b4ad64b2c4981d5fa421929e8547e840e31a3b075a088"),
        visual: { asset: "/journeys/ramayana-dandaka-sita-anasuya-v1.webp", location: "Atri and Anasuya's hermitage · story within story", cast: ["Sita", "Rama", "Lakshmana", "Atri", "Anasuya", "Janaka"], connections: [{ label: "Sita", kind: "character", href: "/search?q=Sita%20Ramayana" }, { label: "Anasuya", kind: "character", href: "/search?q=Anasuya%20Sita%20Ramayana" }, { label: "Janaka and the bow", kind: "source", href: "/search?q=Janaka%20Sita%20bow%20Ramayana" }] },
      },
      {
        id: "dandaka-receives-them", ordinal: 35, title: "Dandaka receives three travellers", eyebrow: "Araṇya Kāṇḍa · I", summary: "The forest opens as a constellation of lived-in hermitages—water, fire, animals, study, gardens, and households—rather than as an empty wilderness.",
        citation: duttAranyaRangeCitation(1, 1, "I", "I", 17794, 21564, 299, 364, "56f1d18dbb1565bad627d916314535c2e34fb99653747c029bf8e58f6b7a8618"),
        visual: { asset: "/journeys/ramayana-dandaka-hermitages-v1.webp", location: "Dandaka · hermitage constellation", cast: ["Rama", "Sita", "Lakshmana"], connections: [{ label: "Dandaka", kind: "place", href: "/search?q=Dandaka%20Ramayana" }, { label: "Forest hermitages", kind: "place", href: "/search?q=Ramayana%20forest%20hermitages" }, { label: "Araṇya Kāṇḍa", kind: "source", href: "/search?q=Dutt%20Aranya%20Kanda" }] },
      },
      {
        id: "viradha-breaks-the-road", ordinal: 36, title: "Viradha breaks the road", eyebrow: "Araṇya Kāṇḍa · II–IV", summary: "Viradha seizes Sita and survives arrows, forcing Rama and Lakshmana to change their method before the encounter reveals another story beneath the threat.",
        citation: duttAranyaRangeCitation(2, 4, "II", "IV", 21564, 35032, 365, 580, "efae6b63330c73e7f58590878c909d3e187bf9e851446b4b7fcaa230e101bb01"),
        visual: { asset: "/journeys/ramayana-dandaka-viradha-v1.webp", location: "Dandaka · Viradha's broken road", cast: ["Viradha", "Rama", "Sita", "Lakshmana"], connections: [{ label: "Viradha", kind: "character", href: "/search?q=Viradha%20Ramayana" }, { label: "Sita", kind: "character", href: "/search?q=Sita%20Viradha" }, { label: "The forest road", kind: "place", href: "/search?q=Viradha%20Dandaka" }] },
      },
      {
        id: "forest-asks-protection", ordinal: 37, title: "The forest makes its case", eyebrow: "Araṇya Kāṇḍa · V–VII", summary: "Sarabhanga waits to meet Rama; gathered ascetics show the human cost of repeated attacks, and protection becomes a promise with consequences.",
        citation: duttAranyaRangeCitation(5, 6, "V", "VII", 35032, 47927, 581, 782, "f9471acca0284054ce5be03b30fe3e4e7cbae930cdfa134f29022b4461f7a716"),
        visual: { asset: "/journeys/ramayana-dandaka-sarabhanga-v1.webp", location: "Sarabhanga to Sutikshna · forest community", cast: ["Rama", "Sita", "Lakshmana", "Sarabhanga", "Sutikshna"], connections: [{ label: "Sarabhanga", kind: "character", href: "/search?q=Sarabhanga%20Ramayana" }, { label: "Sutikshna", kind: "character", href: "/search?q=Sutikshna%20Ramayana" }, { label: "Protection in Dandaka", kind: "source", href: "/search?q=Rama%20protects%20ascetics%20Dandaka" }] },
      },
      {
        id: "sita-questions-the-bow", ordinal: 38, title: "Sita questions the bow", eyebrow: "Araṇya Kāṇḍa · VIII–X", summary: "On the road, Sita asks whether carrying weapons can reshape intention. Rama answers from his promise to the forest; the argument remains alive rather than becoming a slogan.",
        citation: duttAranyaRangeCitation(7, 9, "VIII", "X", 47927, 58647, 783, 952, "86f56b21011fa005f2bc13ffc17c28ec95b36a5987f636717257e838c360fc03"),
        visual: { asset: "/journeys/ramayana-dandaka-sita-dialogue-v1.webp", location: "Dandaka · an ethical threshold on the road", cast: ["Sita", "Rama", "Lakshmana", "Sutikshna"], connections: [{ label: "Sita and Rama's dialogue", kind: "source", href: "/search?q=Sita%20questions%20Rama%20weapons" }, { label: "Dandaka", kind: "place", href: "/search?q=Dandaka%20forest" }, { label: "Promise and protection", kind: "source", href: "/search?q=Rama%20Dandaka%20promise" }] },
      },
      {
        id: "ten-years-become-map", ordinal: 39, title: "Ten years become a living map", eyebrow: "Araṇya Kāṇḍa · XI", summary: "Panchapsara's unseen music opens one story, then years flow across many hermitages until the wish to meet Agastya gives the wandering a new direction.",
        citation: duttAranyaRangeCitation(10, 10, "XI", "XI", 58647, 70718, 953, 1129, "8299c725eaab0f85fdc649519e94bad1726f55b357c92200f72a75d5e480ec10"),
        visual: { asset: "/journeys/ramayana-dandaka-panchapsara-v1.webp", location: "Panchapsara and the ten-year forest · time-place world", cast: ["Rama", "Sita", "Lakshmana", "Mandakarni"], connections: [{ label: "Panchapsara", kind: "place", href: "/search?q=Panchapsara%20Ramayana" }, { label: "Mandakarni", kind: "character", href: "/search?q=Mandakarni%20Ramayana" }, { label: "Agastya", kind: "character", href: "/search?q=Agastya%20Ramayana" }] },
      },
      {
        id: "agastya-points-south", ordinal: 40, title: "Agastya points toward Panchavati", eyebrow: "Araṇya Kāṇḍa · XII–XIII", summary: "Hospitality, storied weapons, and concern for Sita converge as Agastya gives the travellers a route to a river-fed home near the Godavari.",
        citation: duttAranyaRangeCitation(11, 12, "XII", "XIII", 70718, 79231, 1130, 1264, "e34294b2654d9d1ad989417f26f7bc8d993f79522b7d03eca67583c1b15369e0"),
        visual: { asset: "/journeys/ramayana-dandaka-agastya-v1.webp", location: "Agastya's hermitage · road to Panchavati", cast: ["Agastya", "Rama", "Sita", "Lakshmana"], connections: [{ label: "Agastya", kind: "character", href: "/search?q=Agastya%20Ramayana" }, { label: "Panchavati", kind: "place", href: "/search?q=Panchavati%20Ramayana" }, { label: "Godavari", kind: "place", href: "/search?q=Godavari%20Ramayana" }] },
      },
      {
        id: "jatayu-welcomes-panchavati", ordinal: 41, title: "Jatayu welcomes them to Panchavati", eyebrow: "Araṇya Kāṇḍa · XIV–XVI", summary: "A feared silhouette becomes Dasharatha's old friend; Lakshmana builds beside the Godavari, and Panchavati becomes a guarded home.",
        citation: duttAranyaRangeCitation(13, 15, "XIV", "XVI", 79231, 94420, 1265, 1508, "7d5d6c6f8a71ff62395e7a51c79dbf381cc45cf06165059b465000a8a7e8ae59"),
        visual: { asset: "/journeys/ramayana-panchavati-jatayu-home-v1.webp", location: "Jatayu's Panchavati threshold · Godavari forest", cast: ["Jatayu", "Rama", "Sita", "Lakshmana"], connections: [{ label: "Jatayu", kind: "character", href: "/search?q=Jatayu%20Ramayana" }, { label: "Panchavati", kind: "place", href: "/search?q=Panchavati%20Ramayana" }, { label: "Godavari", kind: "place", href: "/search?q=Godavari%20Ramayana" }] },
      },
      {
        id: "surpanakha-breaks-quiet", ordinal: 42, title: "Surpanakha breaks Panchavati's quiet", eyebrow: "Araṇya Kāṇḍa · XVII–XVIII", summary: "Desire, jest, rivalry, and violent humiliation turn one charged encounter at the cottage into a road toward Khara.",
        citation: duttAranyaRangeCitation(16, 17, "XVII", "XVIII", 94420, 102788, 1509, 1643, "26564b4c575a2a21031ba248a20fbf059e6e3b981a823487b285580fc5fe114f"),
        visual: { asset: "/journeys/ramayana-panchavati-surpanakha-v1.webp", location: "The cottage at Panchavati · broken clearing", cast: ["Surpanakha", "Rama", "Sita", "Lakshmana", "Khara"], connections: [{ label: "Surpanakha", kind: "character", href: "/search?q=Surpanakha%20Ramayana" }, { label: "The Panchavati cottage", kind: "place", href: "/search?q=Panchavati%20cottage%20Ramayana" }, { label: "Khara", kind: "character", href: "/search?q=Khara%20Ramayana" }] },
      },
      {
        id: "janasthana-falls", ordinal: 43, title: "Janasthana falls", eyebrow: "Araṇya Kāṇḍa · XIX–XXXI", summary: "Surpanakha's appeal expands through successive forces until Khara falls and Akampana carries the first account of Rama to Ravana.",
        citation: duttAranyaRangeCitation(18, 30, "XIX", "XXXI", 102788, 162718, 1644, 2600, "e816e955726a629f96f6b562a7c2437de4859e9c4fd6f4f223484b2e23a341d7"),
        visual: { asset: "/journeys/ramayana-panchavati-janasthana-v1.webp", location: "The Janasthana battlefield · narrative world", cast: ["Rama", "Surpanakha", "Khara", "Dushana", "Akampana", "Lakshmana", "Sita"], connections: [{ label: "Janasthana", kind: "place", href: "/search?q=Janasthana%20Ramayana" }, { label: "Khara and Dushana", kind: "character", href: "/search?q=Khara%20Dushana%20Ramayana" }, { label: "Akampana's report", kind: "source", href: "/search?q=Akampana%20Ravana%20Ramayana" }] },
      },
      {
        id: "ravana-chooses-deception", ordinal: 44, title: "Ravana chooses deception", eyebrow: "Araṇya Kāṇḍa · XXXII–XXXVIII", summary: "Surpanakha carries Janasthana into Ravana's court; Maricha answers with remembered fear, but warning is bent toward coercion.",
        citation: duttAranyaRangeCitation(31, 37, "XXXII", "XXXVIII", 162718, 190897, 2601, 3048, "cf00f811746a46e0fb36d9b6078362997921068beef5a9cc219fd0a3d9dd15cb"),
        visual: { asset: "/journeys/ramayana-panchavati-ravana-maricha-v1.webp", location: "Ravana's road to Maricha · conspiracy world", cast: ["Ravana", "Surpanakha", "Akampana", "Maricha", "Sita", "Rama"], connections: [{ label: "Ravana", kind: "character", href: "/search?q=Ravana%20Ramayana" }, { label: "Maricha", kind: "character", href: "/search?q=Maricha%20Ramayana" }, { label: "Lanka", kind: "place", href: "/search?q=Lanka%20Ramayana" }] },
      },
      {
        id: "golden-deer-separates-house", ordinal: 45, title: "The golden deer separates the house", eyebrow: "Araṇya Kāṇḍa · XXXIX–XLIII", summary: "Maricha's impossible form draws delight, suspicion, and pursuit together until a borrowed cry travels back toward Panchavati.",
        citation: duttAranyaRangeCitation(38, 42, "XXXIX", "XLIII", 190897, 213088, 3049, 3397, "9a1dca9b3f44f228680d45a2723c344a1583545227e8e60e0593ca229eac7367"),
        visual: { asset: "/journeys/ramayana-panchavati-golden-deer-v1.webp", location: "The golden deer path · Panchavati forest", cast: ["Maricha", "Sita", "Rama", "Lakshmana", "Ravana"], connections: [{ label: "The golden deer", kind: "source", href: "/search?q=golden%20deer%20Ramayana" }, { label: "Maricha", kind: "character", href: "/search?q=Maricha%20golden%20deer" }, { label: "Panchavati", kind: "place", href: "/search?q=Panchavati%20Ramayana" }] },
      },
      {
        id: "mendicant-at-empty-cottage", ordinal: 46, title: "A mendicant reaches the empty cottage", eyebrow: "Araṇya Kāṇḍa · XLIV–XLVI", summary: "Maricha's cry divides Sita and Lakshmana; when Lakshmana finally leaves, Ravana arrives beneath the expectations of hospitality.",
        citation: duttAranyaRangeCitation(43, 45, "XLIV", "XLVI", 213088, 228130, 3398, 3628, "eeedfc8e3c5a858dc778cb8bb38c773b53bebc4946bbe8a33e86b723686acc40"),
        visual: { asset: "/journeys/ramayana-panchavati-empty-cottage-v1.webp", location: "The emptied Panchavati cottage · danger threshold", cast: ["Sita", "Lakshmana", "Rama", "Ravana", "Maricha"], connections: [{ label: "Sita and Lakshmana's argument", kind: "source", href: "/search?q=Sita%20Lakshmana%20Maricha%20cry" }, { label: "The empty cottage", kind: "place", href: "/search?q=Ravana%20Panchavati%20cottage" }, { label: "Ravana's disguise", kind: "source", href: "/search?q=Ravana%20mendicant%20Ramayana" }] },
      },
      {
        id: "sita-carried-south", ordinal: 47, title: "Sita calls the forest to witness", eyebrow: "Araṇya Kāṇḍa · XLVII–XLIX", summary: "Ravana reveals himself and seizes Sita, but her refusal and calls to river, mountain, trees, birds, and animals keep the world active around her.",
        citation: duttAranyaRangeCitation(46, 48, "XLVII", "XLIX", 228130, 243752, 3629, 3866, "8e61ec4a194c505b5e64654025c34468aec4e54eb88491bebe995fae642ab2f9"),
        visual: { asset: "/journeys/ramayana-panchavati-abduction-sky-v1.webp", location: "The southward sky-road · forest witnesses", cast: ["Sita", "Ravana", "Rama", "Lakshmana"], connections: [{ label: "Sita", kind: "character", href: "/search?q=Sita%20Ramayana" }, { label: "The witnessing forest", kind: "place", href: "/search?q=Sita%20calls%20forest%20witness" }, { label: "The southward route", kind: "place", href: "/search?q=Sita%20abduction%20south%20Ramayana" }] },
      },
      {
        id: "jatayu-rises-sky-road", ordinal: 48, title: "Jatayu rises against Ravana", eyebrow: "Araṇya Kāṇḍa · L–LIV", summary: "Jatayu turns an unequal pursuit into resistance; after he falls, Sita drops cloth and ornaments so the world below can preserve a trail.",
        citation: duttAranyaRangeCitation(49, 53, "L", "LIV", 243752, 268418, 3867, 4252, "8b1520d489aecc27f3f8b137541e2c331a80fb3f09cfe769086f8e435ba1a819"),
        visual: { asset: "/journeys/ramayana-panchavati-jatayu-resistance-v1.webp", location: "Jatayu's last resistance · southward sky-road", cast: ["Jatayu", "Sita", "Ravana", "Rama", "Lakshmana"], connections: [{ label: "Jatayu", kind: "character", href: "/search?q=Jatayu%20Ravana%20Ramayana" }, { label: "The fallen ornaments", kind: "source", href: "/search?q=Sita%20drops%20ornaments%20Ramayana" }, { label: "The future search", kind: "source", href: "/search?q=Ramayana%20search%20for%20Sita" }] },
      },
      {
        id: "leave-lanka", ordinal: 49, title: "Leave Lanka", eyebrow: "Yuddha Kāṇḍa · CXXIV", summary: "With the war behind them, the companions gather and the Pushpaka rises. Home is no longer an idea; it becomes a direction.",
        citation: duttYuddhaCitation(122, "CXXIV", 124, 810878, 814570, 12968, 13025, "07276778cf5e60d8a52e33c18477bdf3537636243f4b7bc620250c38ff72af96"),
        visual: { asset: "/journeys/ramayana-return-lanka-v1.webp", location: "Lanka · narrative world", cast: ["Rama", "Sita", "Lakshmana", "Hanuman", "Sugriva", "Vibhishana"], connections: [{ label: "Lanka", kind: "place", href: "/search?q=Lanka%20Ramayana" }, { label: "Vibhishana", kind: "character", href: "/search?q=Vibhishana%20Ramayana" }, { label: "The selected Dutt edition", kind: "source", href: "/search?q=Manmatha%20Nath%20Dutt%20Ramayana" }] },
      },
      {
        id: "sky-road", ordinal: 50, title: "The sky road remembers", eyebrow: "Yuddha Kāṇḍa · CXXV", summary: "As the journey turns north, places from loss, alliance, and battle pass below. The route becomes a memory of everyone who made return possible.",
        citation: duttYuddhaCitation(123, "CXXV", 125, 814570, 821805, 13026, 13135, "ac4a5d9e558ad6f19bb7e8558f899971321a5f810116030fcd0843f5a0872010"),
        visual: { asset: "/journeys/ramayana-return-sky-road-v1.webp", location: "The homeward sky · narrative route", cast: ["Rama", "Sita", "Lakshmana", "Hanuman"], connections: [{ label: "Sita", kind: "character", href: "/search?q=Sita%20Ramayana" }, { label: "Kishkindha", kind: "place", href: "/search?q=Kishkindha%20Ramayana" }, { label: "The wider seven-kāṇḍa library", kind: "source", href: "/search?q=seven%20books%20Ramayana" }] },
      },
      {
        id: "bharadvaja-hermitage", ordinal: 51, title: "Home is near", eyebrow: "Yuddha Kāṇḍa · CXXVI", summary: "At Bharadvaja's hermitage, Rama's first questions are about Ayodhya, Bharata, and the mothers he has not seen through fourteen years of exile.",
        citation: duttYuddhaCitation(124, "CXXVI", 126, 821805, 825278, 13136, 13193, "2b5f780068a77fe5465ff61956b5355b78afdfeb1c872c4e4dff768cb20dabe4"),
        visual: { asset: "/journeys/ramayana-return-hermitage-v1.webp", location: "Bharadvaja's hermitage · narrative world", cast: ["Rama", "Sita", "Lakshmana", "Bharadvaja", "Hanuman"], connections: [{ label: "Bharadvaja", kind: "character", href: "/search?q=Bharadvaja%20Ramayana" }, { label: "Ayodhya", kind: "place", href: "/search?q=Ayodhya%20Ramayana" }, { label: "Shringverpur living place context", kind: "place", href: "/search?q=Shringverpur%20Ramayana" }] },
      },
      {
        id: "hanuman-goes-ahead", ordinal: 52, title: "Hanuman goes ahead", eyebrow: "Yuddha Kāṇḍa · CXXVII", summary: "Before the returning party arrives, Hanuman carries the news to Guha and Bharata. The last distance home is crossed first by trust and a message.",
        citation: duttYuddhaCitation(125, "CXXVII", 127, 825278, 832093, 13194, 13299, "4d3da830889d7d0c551c2cabb152f6dcb0695b7a5a2d50dc8854713699f14fb6"),
        visual: { asset: "/journeys/ramayana-return-hanuman-ahead-v1.webp", location: "The road to Nandigrama · narrative world", cast: ["Hanuman", "Bharata", "Guha"], connections: [{ label: "Hanuman", kind: "character", href: "/search?q=Hanuman%20Ramayana" }, { label: "Bharata", kind: "character", href: "/search?q=Bharata%20Ramayana" }, { label: "Ramlila", kind: "performance", href: "/search?q=Ramlila%20UNESCO" }] },
      },
      {
        id: "bharata-hears", ordinal: 53, title: "Bharata hears the news", eyebrow: "Yuddha Kāṇḍa · CXXVIII", summary: "Bharata asks how the exile became alliance and victory. Hanuman tells the road behind them, turning a distant return into something real.",
        citation: duttYuddhaCitation(126, "CXXVIII", 128, 832093, 839471, 13300, 13413, "2db463f691012175d4ba4583da53837c3576158a88b2d78d4606e51117b37c31"),
        visual: { asset: "/journeys/ramayana-return-bharata-hears-v1.webp", location: "Nandigrama · narrative world", cast: ["Hanuman", "Bharata", "Shatrughna"], connections: [{ label: "Bharata", kind: "character", href: "/search?q=Bharata%20Ramayana" }, { label: "The forest exile", kind: "place", href: "/search?q=Ramayana%20forest%20exile" }, { label: "Hanuman in Lanka", kind: "source", href: "/search?q=Hanuman%20Lanka%20Sundara%20Kanda" }] },
      },
      {
        id: "ayodhya-prepares", ordinal: 54, title: "Ayodhya prepares", eyebrow: "Yuddha Kāṇḍa · CXXIX", summary: "The city moves as one: roads, music, standards, families, and companions all turn toward the approaching reunion.",
        citation: duttYuddhaCitation(127, "CXXIX", 129, 839471, 847239, 13414, 13530, "097c1dc22e4d379c367cf61a656856ea2f26face1092709ada5a1d75345c1837"),
        visual: { asset: "/journeys/ramayana-return-ayodhya-v1.webp", location: "Ayodhya · narrative world", cast: ["Rama", "Sita", "Lakshmana", "Bharata", "Shatrughna", "Hanuman"], connections: [{ label: "Ayodhya", kind: "place", href: "/search?q=Ayodhya" }, { label: "Rama's homecoming and Diwali", kind: "festival", href: "/search?q=Ramayana%20Diwali%20homecoming" }, { label: "Ramlila performance worlds", kind: "performance", href: "/search?q=Ramlila" }] },
      },
      {
        id: "kingdom-returned", ordinal: 55, title: "The kingdom is returned", eyebrow: "Yuddha Kāṇḍa · CXXX", summary: "Bharata returns the kingdom he held in trust. The road closes not at a palace gate, but in responsibility accepted again before the people.",
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
