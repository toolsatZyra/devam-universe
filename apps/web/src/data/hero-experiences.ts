import type { ExperienceCitation, HeroChallenge, HeroJourney } from "@/lib/domain/experience";

const DUTT_YUDDHA_SOURCE = "8d1b8901823f5b5bd8b3207370991ddf95e5c76cb30ad5271aef835c9708464b";
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
    title: "The road home to Ayodhya",
    invitation: "Travel with the returning party from Lanka to Ayodhya, then discover how the story opens into living festival worlds.",
    durationMinutes: 14,
    tone: "saffron",
    sourceBoundary: "This playable retelling follows Yuddha Kāṇḍa sections CXXIV–CXXX in the product-allowed Project Gutenberg electronic text of Manmatha Nath Dutt's English prose translation. It is not every Ramayana, a historical route, a universal Diwali origin, or a complete account of any character, place, festival, or theology.",
    completeHeroUniverse: false,
    stops: [
      {
        id: "leave-lanka", ordinal: 1, title: "Leave Lanka", eyebrow: "Yuddha Kāṇḍa · CXXIV", summary: "With the war behind them, the companions gather and the Pushpaka rises. Home is no longer an idea; it becomes a direction.",
        citation: duttYuddhaCitation(122, "CXXIV", 124, 810878, 814570, 12968, 13025, "07276778cf5e60d8a52e33c18477bdf3537636243f4b7bc620250c38ff72af96"),
        visual: { asset: "/journeys/ramayana-return-lanka-v1.webp", location: "Lanka · narrative world", cast: ["Rama", "Sita", "Lakshmana", "Hanuman", "Sugriva", "Vibhishana"], connections: [{ label: "Lanka", kind: "place", href: "/search?q=Lanka%20Ramayana" }, { label: "Vibhishana", kind: "character", href: "/search?q=Vibhishana%20Ramayana" }, { label: "The selected Dutt edition", kind: "source", href: "/search?q=Manmatha%20Nath%20Dutt%20Ramayana" }] },
      },
      {
        id: "sky-road", ordinal: 2, title: "The sky road remembers", eyebrow: "Yuddha Kāṇḍa · CXXV", summary: "As the journey turns north, places from loss, alliance, and battle pass below. The route becomes a memory of everyone who made return possible.",
        citation: duttYuddhaCitation(123, "CXXV", 125, 814570, 821805, 13026, 13135, "ac4a5d9e558ad6f19bb7e8558f899971321a5f810116030fcd0843f5a0872010"),
        visual: { asset: "/journeys/ramayana-return-lanka-v1.webp", location: "The homeward sky · narrative route", cast: ["Rama", "Sita", "Lakshmana", "Hanuman"], connections: [{ label: "Sita", kind: "character", href: "/search?q=Sita%20Ramayana" }, { label: "Kishkindha", kind: "place", href: "/search?q=Kishkindha%20Ramayana" }, { label: "The wider seven-kāṇḍa library", kind: "source", href: "/search?q=seven%20books%20Ramayana" }] },
      },
      {
        id: "bharadvaja-hermitage", ordinal: 3, title: "Home is near", eyebrow: "Yuddha Kāṇḍa · CXXVI", summary: "At Bharadvaja's hermitage, Rama's first questions are about Ayodhya, Bharata, and the mothers he has not seen through fourteen years of exile.",
        citation: duttYuddhaCitation(124, "CXXVI", 126, 821805, 825278, 13136, 13193, "2b5f780068a77fe5465ff61956b5355b78afdfeb1c872c4e4dff768cb20dabe4"),
        visual: { asset: "/journeys/ramayana-return-hermitage-v1.webp", location: "Bharadvaja's hermitage · narrative world", cast: ["Rama", "Sita", "Lakshmana", "Bharadvaja", "Hanuman"], connections: [{ label: "Bharadvaja", kind: "character", href: "/search?q=Bharadvaja%20Ramayana" }, { label: "Ayodhya", kind: "place", href: "/search?q=Ayodhya%20Ramayana" }, { label: "Shringverpur living place context", kind: "place", href: "/search?q=Shringverpur%20Ramayana" }] },
      },
      {
        id: "hanuman-goes-ahead", ordinal: 4, title: "Hanuman goes ahead", eyebrow: "Yuddha Kāṇḍa · CXXVII", summary: "Before the returning party arrives, Hanuman carries the news to Guha and Bharata. The last distance home is crossed first by trust and a message.",
        citation: duttYuddhaCitation(125, "CXXVII", 127, 825278, 832093, 13194, 13299, "4d3da830889d7d0c551c2cabb152f6dcb0695b7a5a2d50dc8854713699f14fb6"),
        visual: { asset: "/journeys/ramayana-return-nandigrama-v1.webp", location: "Nandigrama · narrative world", cast: ["Hanuman", "Bharata", "Guha"], connections: [{ label: "Hanuman", kind: "character", href: "/search?q=Hanuman%20Ramayana" }, { label: "Bharata", kind: "character", href: "/search?q=Bharata%20Ramayana" }, { label: "Ramlila", kind: "performance", href: "/search?q=Ramlila%20UNESCO" }] },
      },
      {
        id: "bharata-hears", ordinal: 5, title: "Bharata hears the news", eyebrow: "Yuddha Kāṇḍa · CXXVIII", summary: "Bharata asks how the exile became alliance and victory. Hanuman tells the road behind them, turning a distant return into something real.",
        citation: duttYuddhaCitation(126, "CXXVIII", 128, 832093, 839471, 13300, 13413, "2db463f691012175d4ba4583da53837c3576158a88b2d78d4606e51117b37c31"),
        visual: { asset: "/journeys/ramayana-return-nandigrama-v1.webp", location: "Nandigrama · narrative world", cast: ["Hanuman", "Bharata", "Shatrughna"], connections: [{ label: "Bharata", kind: "character", href: "/search?q=Bharata%20Ramayana" }, { label: "The forest exile", kind: "place", href: "/search?q=Ramayana%20forest%20exile" }, { label: "Hanuman in Lanka", kind: "source", href: "/search?q=Hanuman%20Lanka%20Sundara%20Kanda" }] },
      },
      {
        id: "ayodhya-prepares", ordinal: 6, title: "Ayodhya prepares", eyebrow: "Yuddha Kāṇḍa · CXXIX", summary: "The city moves as one: roads, music, standards, families, and companions all turn toward the approaching reunion.",
        citation: duttYuddhaCitation(127, "CXXIX", 129, 839471, 847239, 13414, 13530, "097c1dc22e4d379c367cf61a656856ea2f26face1092709ada5a1d75345c1837"),
        visual: { asset: "/journeys/ramayana-return-ayodhya-v1.webp", location: "Ayodhya · narrative world", cast: ["Rama", "Sita", "Lakshmana", "Bharata", "Shatrughna", "Hanuman"], connections: [{ label: "Ayodhya", kind: "place", href: "/search?q=Ayodhya" }, { label: "Rama's homecoming and Diwali", kind: "festival", href: "/search?q=Ramayana%20Diwali%20homecoming" }, { label: "Ramlila performance worlds", kind: "performance", href: "/search?q=Ramlila" }] },
      },
      {
        id: "kingdom-returned", ordinal: 7, title: "The kingdom is returned", eyebrow: "Yuddha Kāṇḍa · CXXX", summary: "Bharata returns the kingdom he held in trust. The road closes not at a palace gate, but in responsibility accepted again before the people.",
        citation: duttYuddhaCitation(128, "CXXX", 130, 847239, 863655, 13531, 13777, "0eab6905146d65e1f905b5e974d473712234c86fa12bf1902fcf9f1f435e9405"),
        visual: { asset: "/journeys/ramayana-return-ayodhya-v1.webp", location: "Ayodhya · coronation world", cast: ["Rama", "Sita", "Lakshmana", "Bharata", "Shatrughna", "Vasishta", "Hanuman", "Sugriva", "Vibhishana"], connections: [{ label: "North Indian Diwali homecoming tradition", kind: "festival", href: "/search?q=Diwali%20Rama%20Ayodhya" }, { label: "Ramlila", kind: "performance", href: "/search?q=Ramlila%20traditional%20performance" }, { label: "Continue through the Ramayana universe", kind: "source", href: "/search?q=Ramayana" }] },
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
