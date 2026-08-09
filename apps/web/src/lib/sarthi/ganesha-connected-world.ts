import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { EvidenceCitation, GroundedSarthiAnswer, SarthiRequest } from "./contracts";
import { searchGanapatiAtharvashirsha } from "../search/ganapatyatharvashirsha-search";

const CONTENT_PACK_PATH = "knowledge_packs/rituals/ganesh-chaturthi-west-india-content-v1.json";
const CONTENT_PACK_SHA256 = "eaa9f4576ecd9587ea205039ca633c569ad61d4f79637e8eb7774182a86163dd";
const MAHARASHTRA_RESPONSE_SHA256 = "5a962b870d9506479cca7e1c87cb5a44499596d53c624a2af1bdfbb1cec1a287";

type LocalizedContent = {
  language_code: "en" | "hi";
  origin_narratives: { narrative_id: string; summary: string }[];
  typical_practices: { practice_id: string; description: string }[];
  variants: { variant_id: string; difference: string }[];
};

type ContentPack = {
  contract: "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1";
  lane_id: "ganesh-chaturthi-west-india-content-v1";
  localized_content: LocalizedContent[];
};

const exactSourceQueries = new Map<string, string>([
  ["ganesha-cosmic-world", "Ganapati Atharvashirsha unit 5"],
  ["ganesha-five-elements", "Ganapati Atharvashirsha unit 5"],
  ["ganesha-one-tusked-form", "Ganapati Atharvashirsha unit 9"],
  ["ganesha-mouse-emblem", "Ganapati Atharvashirsha unit 9"],
  ["ganesha-eight-names", "Ganapati Atharvashirsha unit 10"],
  ["ganesha-ekadanta", "Ganapati Atharvashirsha unit 10"],
  ["ganesha-lambodara", "Ganapati Atharvashirsha unit 10"],
  ["ganesha-vighnanashin", "Ganapati Atharvashirsha unit 10"],
]);

const modernFestivalSlugs = new Set([
  "public-ganeshotsav-1893",
  "ganeshotsav-community-pandal",
  "ganeshotsav-clay-murti",
  "ganeshotsav-modak",
  "ganeshotsav-visarjan",
]);

let cachedPack: ContentPack | undefined;

function loadPack(): ContentPack {
  if (cachedPack) return cachedPack;
  const bytes = readFileSync(resolve(process.cwd(), "../..", CONTENT_PACK_PATH));
  const actualSha256 = createHash("sha256").update(bytes).digest("hex");
  if (actualSha256 !== CONTENT_PACK_SHA256) throw new Error(`Ganesh Chaturthi content-pack drift: ${actualSha256}`);
  const pack = JSON.parse(bytes.toString("utf8")) as ContentPack;
  if (
    pack.contract !== "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1"
    || pack.lane_id !== "ganesh-chaturthi-west-india-content-v1"
    || pack.localized_content.map((content) => content.language_code).join("|") !== "en|hi"
  ) throw new Error("Ganesh Chaturthi connected-world contract drift");
  cachedPack = pack;
  return pack;
}

function isHindi(request: SarthiRequest): boolean {
  return request.context?.languageCode?.toLowerCase().startsWith("hi") === true || /[\u0900-\u097f]/.test(request.message);
}

function officialCitation(slug: string): EvidenceCitation {
  return {
    passageId: `citation-only:maharashtra-tourism-ganesh-chaturthi-2026:${slug}`,
    sourceObjectId: MAHARASHTRA_RESPONSE_SHA256,
    sourceOrdinal: 0,
    workTitle: "Ganesh Chaturthi",
    editionTitle: "Directorate of Tourism, Government of Maharashtra — page observed 2026-08-07",
    locator: {
      sourceId: "maharashtra-tourism-ganesh-chaturthi-2026",
      url: "https://maharashtratourism.gov.in/festivals/ganesh-chaturthi/",
      observedAt: "2026-08-07",
      observedResponseSha256: MAHARASHTRA_RESPONSE_SHA256,
      derivedContentPackSha256: CONTENT_PACK_SHA256,
      sourceTextReturned: false,
    },
    rightsLane: "citation_only",
  };
}

function modernFestivalAnswer(slug: string, localized: LocalizedContent): string {
  const narrative = localized.origin_narratives.find((item) => item.narrative_id === "tilak-public-ganeshotsav-account")?.summary;
  const community = localized.typical_practices.find((item) => item.practice_id === "maharashtra-home-and-community-ganeshotsav")?.description;
  const image = localized.variants.find((item) => item.variant_id === "permanent-versus-temporary-image")?.difference;
  const duration = localized.variants.find((item) => item.variant_id === "family-chosen-duration")?.difference;
  const answer = slug === "public-ganeshotsav-1893" ? narrative
    : slug === "ganeshotsav-community-pandal" || slug === "ganeshotsav-modak" ? community
      : slug === "ganeshotsav-clay-murti" ? image
        : slug === "ganeshotsav-visarjan" ? [image, duration].filter(Boolean).join(" ")
          : undefined;
  if (!answer) throw new Error(`Missing localized Ganeshotsav connected-world content: ${slug}/${localized.language_code}`);
  return answer;
}

export function answerGaneshaConnectedWorld(request: SarthiRequest): GroundedSarthiAnswer | null {
  const slug = request.context?.atlasNodeSlug;
  if (!slug) return null;
  const languageCode = isHindi(request) ? "hi" : "en";
  const exactQuery = exactSourceQueries.get(slug);
  if (exactQuery) {
    const result = searchGanapatiAtharvashirsha(exactQuery, languageCode)[0];
    if (!result) throw new Error(`Missing Atharvashirsha connected-world result: ${slug}`);
    return {
      ok: true,
      mode: "deterministic_source_bounded_preview",
      answer: result.statement,
      citations: result.citations,
      alternativesAvailable: false,
      sourceBoundary: result.sourceBoundary,
    };
  }

  if (!modernFestivalSlugs.has(slug)) return null;
  const localized = loadPack().localized_content.find((content) => content.language_code === languageCode);
  if (!localized) throw new Error(`Missing Ganeshotsav language: ${languageCode}`);
  return {
    ok: true,
    mode: "deterministic_source_bounded_preview",
    answer: modernFestivalAnswer(slug, localized),
    citations: [officialCitation(slug)],
    alternativesAvailable: true,
    sourceBoundary: "Reviewed West India/Maharashtra festival context. This official current account is citation-only and does not establish a universal Ganesha theology, one ritual sequence, every regional Ganeshotsav, live pandal operations, or permission for immersion or water entry.",
  };
}

export const GANESHA_CONNECTED_WORLD_FIXITY = {
  exactSourceNodeCount: exactSourceQueries.size,
  modernFestivalNodeCount: modernFestivalSlugs.size,
  contentPackSha256: CONTENT_PACK_SHA256,
  officialObservedResponseSha256: MAHARASHTRA_RESPONSE_SHA256,
} as const;
