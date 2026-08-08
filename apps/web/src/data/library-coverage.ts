export type HeroCoverage = {
  slug: "ganesha" | "durga" | "ramayana" | "diwali";
  name: string;
  devanagari: string;
  connected: string;
  open: string;
};

export const LIBRARY_COVERAGE_SNAPSHOT = {
  asOf: "2026-08-08",
  sourceLibrary: {
    uniqueObjects: 8_491,
    objectBytes: 6_167_702_553,
    discoveryLeads: 6_545,
    boundary: "Preserved source objects are not automatically reviewed, rights-cleared, translated, or published in the product. Discovery leads are a research queue, not holdings.",
  },
  launchLayer: {
    deterministicDates: 122,
    deterministicDateTotal: 122,
    currentRitualRecords: 47,
    userCompleteScopedLanes: 46,
    participationCompanions: 1,
    boundary: "All 79 resolved September-December calendar slugs have a current ritual lane. The prior Agastya, Balarama, and two Diwali preflights have exact bounded successors and remain only as provenance. A completed lane is complete only for its named location, tradition, role, language, and practice boundary—not for every Indian or Hindu tradition.",
  },
  knowledgeLayer: {
    works: 21,
    expressions: 27,
    editions: 27,
    sourceReferences: 102,
    passages: 9_091,
    publishedPassages: 3_298,
    reviewOrPrivatePassages: 5_793,
    publishedClaims: 1_228,
    claimEvidenceLinks: 1_233,
    sourceAlignedBetaTranslations: 1_176,
    civilizationallyCompleteHeroWorlds: 0,
    heroWorldTotal: 4,
    boundary: "Hosted and published counts describe the current selected product slice. They are not percentages of the retained vault or of Sanatana Dharma, Indian culture, and Indian wisdom as a whole.",
  },
  heroes: [
    {
      slug: "ganesha",
      name: "Ganesha",
      devanagari: "गणेश",
      connected: "A source-bounded Sanskrit hymn path; the exact pinned Sanskrit Wikisource Ganesha Purana universe with 247 chapters in two khandas; Ganesh Chaturthi household guidance; Ashtavinayak places; journey, challenge, Search, and Sarthi.",
      open: "An identified Ganesha Purana print edition and recension, Hindi and English translations, a reusable Mudgala Purana text lane from the retained internal 1976 scan, broader regional forms, more temples, histories, commentary, stories, and living-practice lanes.",
    },
    {
      slug: "durga",
      name: "Durga",
      devanagari: "दुर्गा",
      connected: "A complete exact-revision Sanskrit Wikisource Devimahatmya sequence with 13 chapters and 588 byte-addressed published passages; 588 English and 588 Hindi source-aligned AI-assisted beta translations; a complete fixed Pargiter edition with seven page-addressed English passages; North/West Navaratri, Bengal Durga Puja participation, journey, challenge, Search, and Sarthi.",
      open: "An identified underlying print edition and recension for the Sanskrit transcription; independent Sanskrit review of the beta translations; wider Devi sources, Shakti Peethas, and distinct regional practice traditions.",
    },
    {
      slug: "ramayana",
      name: "Ramayana",
      devanagari: "रामायण",
      connected: "A published product-usable seven-kanda, 606-sarga Ambuda/DCS Sanskrit electronic corpus with 46 literal record gaps and three source-order anomalies exposed; a published source-addressed Griffith English layer with six books and explicit omissions; complete narrative-body coverage of the four-volume Dutt English electronic edition across all seven kandas and 652 byte-addressed sections, with literal numbering defects preserved; all seven edition-matched Dutt scans; one structurally complete public-domain seven-sopana Belvedere Ramcharitmanas scan; and all 1,240 edition-matched Hindi Wikisource page revisions, including 802 source-addressed beta passages now published to Search and Sarthi, 11 held markup anomalies, and an explicit 359-page correction queue; journey, challenge, Search, and Sarthi orientation.",
      open: "An edition-identified gap-free Sanskrit base, page-by-page reconciliation of the Dutt electronic text to all seven print scans, correction of the remaining 359 Belvedere Ramcharitmanas narrative pages before a complete searchable-text claim, a strong modern-Hindi aid layer, commentary, and major Indian and Asian variants.",
    },
    {
      slug: "diwali",
      name: "Diwali",
      devanagari: "दीपावली",
      connected: "A multi-day, multi-tradition path with separately bounded North, West, South, Bengal, Jain, Sikh, BAPS, and Vaishnava lanes.",
      open: "Deeper regional and living-tradition coverage, Nepal Tihar, full sect-specific Jain procedures, more stories, places, sources, and local variants.",
    },
  ] satisfies HeroCoverage[],
} as const;

export function formatLibraryBytes(bytes: number) {
  return `${(bytes / 1_000_000_000).toFixed(2)} GB`;
}
