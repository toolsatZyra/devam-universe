import type { GroundedSarthiAnswer, SarthiRequest } from "../sarthi/contracts";
import type { LibrarySearchResult } from "./library-search";

type LivingCultureSource = {
  id: string;
  title: string;
  url: string;
};

type LivingCultureRecord = {
  slug: string;
  title: string;
  statement: string;
  aliases: string[];
  source: LivingCultureSource;
  boundary: string;
};

const RAMLILA_SOURCE: LivingCultureSource = {
  id: "unesco-ich-ramlila-00110",
  title: "Ramlila, the traditional performance of the Ramayana",
  url: "https://ich.unesco.org/en/RL/ramlila-the-traditional-performance-of-the-ramayana-00110",
};

const DURGA_PUJA_SOURCE: LivingCultureSource = {
  id: "unesco-ich-durga-puja-00703",
  title: "Durga Puja in Kolkata",
  url: "https://ich.unesco.org/en/RL/durga-puja-in-kolkata-00703",
};

const KUMARTULI_SOURCE: LivingCultureSource = {
  id: "unesco-news-durga-puja-kolkata-13423",
  title: "UNESCO visits India ahead of the Durga Puja in Kolkata",
  url: "https://ich.unesco.org/en/news/unesco-visits-india-ahead-of-the-durga-puja-in-kolkata-13423",
};

const COMMON_BOUNDARY = "Citation-only Devam synthesis from an official UNESCO cultural-heritage page observed 2026-08-09. The source page is not retained or quoted as a Devam source object; this result is a concise navigation context, not a complete history, ritual authority, live visitor guide, or claim that one regional form represents every tradition.";

const records: LivingCultureRecord[] = [
  {
    slug: "ramlila-performance",
    title: "Ramlila — the Ramayana in performance",
    statement: "Ramlila turns the Ramayana into a sequence of performed scenes using song, narration, recitation, and dialogue. UNESCO places it across northern India in the autumn Dussehra season and names several representative local traditions.",
    aliases: ["ramlila", "traditional performance ramayana", "ramayana performance", "rama play"],
    source: RAMLILA_SOURCE,
    boundary: COMMON_BOUNDARY,
  },
  {
    slug: "ramlila-community-stage",
    title: "The community becomes the stage",
    statement: "The Ramlila world extends beyond performers: UNESCO describes audiences joining the narration and communities contributing roles, masks, costumes, make-up, effigies, and lights. Each local organization and craft tradition remains distinct.",
    aliases: ["ramlila community", "ramlila masks costumes", "ramlila effigies lights", "community stage"],
    source: RAMLILA_SOURCE,
    boundary: COMMON_BOUNDARY,
  },
  {
    slug: "ramnagar-ramlila",
    title: "Ramnagar Ramlila",
    statement: "UNESCO names Ramnagar and Benares among representative Ramlila places and notes that Ramnagar's performance cycle may extend for a month. Devam treats this as a living place doorway rather than a universal model or live itinerary.",
    aliases: ["ramnagar ramlila", "benaras ramlila", "benares ramlila", "varanasi ramlila"],
    source: RAMLILA_SOURCE,
    boundary: COMMON_BOUNDARY,
  },
  {
    slug: "dussehra-performance-season",
    title: "The Dussehra performance season",
    statement: "UNESCO situates Ramlila in the annual autumn Dussehra season. This provides a travel route from epic scenes into living festival time while keeping Dussehra, Vijayadashami, Navaratri, calendars, and regional practices separate.",
    aliases: ["ramlila dussehra", "dussehra performance season", "autumn ramlila", "dussehra ramayana"],
    source: RAMLILA_SOURCE,
    boundary: COMMON_BOUNDARY,
  },
  {
    slug: "durga-puja-public-art",
    title: "Durga Puja as worship and public art",
    statement: "UNESCO describes Kolkata Durga Puja as a major public meeting of religion and art, supported by collaborative artists and designers and experienced through large installations, pavilions, music, worship, and crowds moving through the city.",
    aliases: ["durga puja public art", "kolkata durga puja art", "worship public art", "durga puja artists designers"],
    source: DURGA_PUJA_SOURCE,
    boundary: COMMON_BOUNDARY,
  },
  {
    slug: "kumartuli-artisan-workshops",
    title: "Kumartuli's artisan workshops",
    statement: "UNESCO reporting identifies Kumartuli as an image-making workshop world in Kolkata, where artisans demonstrate the knowledge used to shape Durga images. This opens a maker route without claiming a complete social or labor history.",
    aliases: ["kumartuli", "durga puja artisan workshops", "durga image makers", "kolkata idol making"],
    source: KUMARTULI_SOURCE,
    boundary: COMMON_BOUNDARY,
  },
  {
    slug: "durga-puja-clay-image",
    title: "Clay, image, and seasonal return",
    statement: "UNESCO's heritage summary follows Durga images from small artisan workshops using unfired river clay into the festival and toward immersion at its close. Devam presents this as a material lifecycle, never as making or immersion instruction.",
    aliases: ["durga puja clay image", "unfired clay durga", "durga image immersion", "clay image lifecycle"],
    source: DURGA_PUJA_SOURCE,
    boundary: COMMON_BOUNDARY,
  },
  {
    slug: "durga-puja-installations",
    title: "A city of temporary installations",
    statement: "Large-scale installations and pavilions are part of the Kolkata Durga Puja world described by UNESCO. Each installation remains attributable to its own artists, organizers, neighborhood, year, and rights holders.",
    aliases: ["durga puja installations", "durga puja pavilions", "kolkata pandal art", "temporary installations"],
    source: DURGA_PUJA_SOURCE,
    boundary: COMMON_BOUNDARY,
  },
  {
    slug: "durga-puja-dhak",
    title: "Dhak in the festival soundscape",
    statement: "UNESCO includes traditional Bengali drumming in its Durga Puja description. Devam uses that cue to open a sound-world route while leaving instruments, rhythms, musician communities, ritual roles, and regional forms for separately sourced expansion.",
    aliases: ["durga puja dhak", "bengali drumming", "durga puja music", "festival soundscape"],
    source: DURGA_PUJA_SOURCE,
    boundary: COMMON_BOUNDARY,
  },
  {
    slug: "durga-puja-immersion-return",
    title: "The seasonal return",
    statement: "The UNESCO summary closes the temporary clay-image arc with immersion and describes the festival as a seasonal homecoming or return to roots. Devam preserves this as meaning and memory, not as operational or ritual guidance.",
    aliases: ["durga puja immersion return", "durga puja seasonal return", "durga image immersion", "homecoming roots"],
    source: DURGA_PUJA_SOURCE,
    boundary: COMMON_BOUNDARY,
  },
];

function citation(record: LivingCultureRecord) {
  return {
    passageId: `citation-only:${record.source.id}:${record.slug}`,
    sourceObjectId: `citation-only:${record.source.id}`,
    sourceOrdinal: 0,
    workTitle: record.source.title,
    editionTitle: "UNESCO Intangible Cultural Heritage — page observed 2026-08-09",
    locator: { url: record.source.url, observedAt: "2026-08-09", sourceTextReturned: false },
    rightsLane: "citation_only" as const,
  };
}

function normalize(value: string) {
  return value.toLocaleLowerCase("en-IN").replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function matchesAlias(query: string, alias: string) {
  return query.includes(alias) || alias.includes(query) || alias.split(" ").every((token) => query.includes(token));
}

export function searchLivingCultureWorld(query: string, languageCode?: string): LibrarySearchResult[] {
  if (languageCode && !languageCode.toLowerCase().startsWith("en")) return [];
  const normalized = normalize(query);
  if (normalized.length < 3) return [];
  return records
    .filter((record) => record.aliases.some((alias) => matchesAlias(normalized, alias)))
    .map((record) => ({
      id: `living-culture:${record.slug}`,
      title: record.title,
      statement: record.statement,
      languageCode: "en",
      claimKind: "citation_only_living_culture_context",
      citations: [citation(record)],
      sourceBoundary: record.boundary,
    }));
}

export function answerLivingCultureWorld(request: SarthiRequest): GroundedSarthiAnswer | null {
  const record = records.find((candidate) => candidate.slug === request.context?.atlasNodeSlug);
  if (!record) return null;
  const query = normalize(request.message);
  const contextualReference = /\b(this|here|it|looking|simply|relevant)\b/.test(query);
  const explicitRecordReference = record.aliases.some((alias) => matchesAlias(query, alias));
  if (!contextualReference && !explicitRecordReference) return null;
  return {
    ok: true,
    mode: "deterministic_source_bounded_preview",
    answer: record.statement,
    citations: [citation(record)],
    alternativesAvailable: true,
    sourceBoundary: record.boundary,
  };
}

export const LIVING_CULTURE_WORLD_FIXITY = {
  nodeCount: records.length,
  sourceIds: [...new Set(records.map((record) => record.source.id))],
  citationOnly: true,
} as const;
