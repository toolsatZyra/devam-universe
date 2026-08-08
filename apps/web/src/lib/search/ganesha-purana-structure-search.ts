import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { LibrarySearchResult } from "./library-search";

const PACK_PATH = "knowledge_packs/ganesha/ganesha-purana-structure-search-v1.json";
const PACK_FILE_SHA256 = "8db3664a5684bb90ca5d53218157d33e217b3b0e5175abd4eb6b1b934fcd127b";
const INGESTION_PACKET_SHA256 = "668f6c5c46d9897447cfcdbcf969b474fe24bf504d316098ad194b0dbeace27d";
const WORK_TITLE = "Gaṇeśa Purāṇa";
const EDITION_TITLE = "Sanskrit Wikisource transcription at 65 pinned revisions";
const SOURCE_BOUNDARY = "Complete only for Devam's exact pinned Sanskrit Wikisource page universe: 62 chapter-range passages covering Upāsanākhaṇḍa chapters 1–92 and Krīḍākhaṇḍa chapters 1–155. The underlying print edition and textual recension are unidentified; no Hindi or English translation, Mudgala Purana, ritual authority, or wider Ganesha-tradition completeness is claimed.";

type Citation = {
  source_sha256: string;
  source_ordinal: number;
  span_sha256: string;
  provider_page_title: string;
  provider_page_id: number;
  provider_revision_id: number;
  khanda: "upasana" | "krida";
  chapter_start: number;
  chapter_end: number;
};

type Division = {
  slug: "upasana-khanda" | "krida-khanda";
  title: string;
  title_hi: string;
  chapter_start: number;
  chapter_end: number;
  statement_en: string;
  statement_hi: string;
  citations: Citation[];
};

type Pack = {
  contract: string;
  source_boundary: { ingestion_packet_sha256: string; scope: string };
  overview: { title: string; statement_en: string; statement_hi: string };
  divisions: Division[];
  denials: Record<string, boolean>;
};

let cachedPack: Pack | undefined;

function loadPack(): Pack {
  if (cachedPack) return cachedPack;
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, PACK_PATH));
  if (createHash("sha256").update(bytes).digest("hex") !== PACK_FILE_SHA256) throw new Error("Ganesha Purana structure-search pack drift");
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (
    pack.contract !== "DEVAM_GANESHA_PURANA_STRUCTURE_SEARCH_V1"
    || pack.source_boundary.ingestion_packet_sha256 !== INGESTION_PACKET_SHA256
    || pack.source_boundary.scope !== "exact_complete_two_khanda_sanskrit_wikisource_page_universe_at_pinned_revisions"
    || pack.divisions.length !== 2
    || pack.divisions.reduce((count, division) => count + division.chapter_end - division.chapter_start + 1, 0) !== 247
    || pack.divisions.some((division) => division.citations.length !== 2)
    || Object.values(pack.denials).some((value) => value !== false)
  ) throw new Error("Ganesha Purana structure-search contract drift");
  cachedPack = pack;
  return pack;
}

function normalize(value: string): string {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("en");
}

function includesAny(value: string, candidates: string[]): boolean {
  return candidates.some((candidate) => value.includes(candidate));
}

function citationsFor(divisions: Division[]): LibrarySearchResult["citations"] {
  return divisions.flatMap((division) => division.citations.map((citation) => ({
    passageId: `sha256:${citation.source_sha256}:span:${citation.span_sha256}`,
    sourceObjectId: citation.source_sha256,
    sourceOrdinal: citation.source_ordinal,
    locator: {
      contract: "DEVAM_WIKISOURCE_REVISION_CONTENT_UTF8_SPAN_V1",
      provider: "Sanskrit Wikisource",
      provider_page_title: citation.provider_page_title,
      provider_page_id: citation.provider_page_id,
      provider_revision_id: citation.provider_revision_id,
      khanda: citation.khanda,
      chapter_start: citation.chapter_start,
      chapter_end: citation.chapter_end,
      span_sha256: citation.span_sha256,
    },
    workTitle: WORK_TITLE,
    editionTitle: EDITION_TITLE,
    rightsLane: "derivative_allowed" as const,
  })));
}

export function searchGaneshaPuranaStructure(query: string, languageCode?: string): LibrarySearchResult[] {
  const normalized = normalize(query.trim());
  if (normalized.length < 2 || normalized.length > 512) return [];
  const hindi = languageCode?.toLowerCase().startsWith("hi") === true || /[\u0900-\u097f]/.test(query);
  const pack = loadPack();
  const divisionMatches = pack.divisions.filter((division) => division.slug === "upasana-khanda"
    ? includesAny(normalized, ["upasana khanda", "upasanakhanda", "उपासनाखण्ड", "उपासना खण्ड", "उपासनाखंड"])
    : includesAny(normalized, ["krida khanda", "kridakhanda", "क्रीडाखण्ड", "क्रीडा खण्ड", "क्रीडाखंड"]));

  if (divisionMatches.length > 0) {
    return divisionMatches.map((division) => ({
      id: `ganesha-purana-${division.slug}-structure-${hindi ? "hi" : "en"}`,
      title: hindi ? division.title_hi : division.title,
      statement: hindi ? division.statement_hi : division.statement_en,
      languageCode: hindi ? "hi" : "en",
      claimKind: "source_bounded_structure",
      citations: citationsFor([division]),
      sourceBoundary: SOURCE_BOUNDARY,
    }));
  }

  if (!includesAny(normalized, [
    "ganesha purana", "ganesh purana", "ganesapurana", "ganesapuranam", "ganeshapurana",
    "गणेशपुराण", "गणेश पुराण", "two khandas", "247 chapters", "दो खण्ड", "दो खंड",
  ])) return [];

  return [{
    id: `ganesha-purana-two-khanda-structure-${hindi ? "hi" : "en"}`,
    title: pack.overview.title,
    statement: hindi ? pack.overview.statement_hi : pack.overview.statement_en,
    languageCode: hindi ? "hi" : "en",
    claimKind: "source_bounded_structure",
    citations: citationsFor(pack.divisions),
    sourceBoundary: SOURCE_BOUNDARY,
  }];
}

export const GANESHA_PURANA_STRUCTURE_SEARCH_FIXITY = {
  packFileSha256: PACK_FILE_SHA256,
  ingestionPacketSha256: INGESTION_PACKET_SHA256,
  sourcePassageCount: 62,
  divisionCount: 2,
  chapterCount: 247,
  evidenceCitationCount: 4,
  sourcePayloadsCopied: false,
} as const;
