import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { LibrarySearchResult } from "./library-search";

const PACK_PATH = "knowledge_packs/durga/devimahatmya-semantic-graph-v1.json";
const PACK_FILE_SHA256 = "7786f6fea39311c6d4544e72cc8fe72742a8c8fac1172d02a3666de6dc9e0891";
const SOURCE_SHA256 = "c7fe701aedeedffde57a51b21aa4f8fec697a7922939fb59ffa985e22cc9b7ae";
const SOURCE_SHA256S = [
  SOURCE_SHA256,
  "4459b0ca01f9a4173f1a137bf7c64908afbf326565b0b3f2dd2d2f5f830850fe",
  "446fb91efc40b94d7b59aa1d5b3116dd665b79ec68044985a8953483c8721814",
] as const;
const SOURCE_PRESENTATION: Record<string, { editionTitle: string; providerRevisionId: number }> = {
  [SOURCE_SHA256]: { editionTitle: "Sanskrit Wikisource revision 410281, chapters 81–85", providerRevisionId: 410281 },
  "4459b0ca01f9a4173f1a137bf7c64908afbf326565b0b3f2dd2d2f5f830850fe": { editionTitle: "Sanskrit Wikisource revision 363171, chapters 86–90", providerRevisionId: 363171 },
  "446fb91efc40b94d7b59aa1d5b3116dd665b79ec68044985a8953483c8721814": { editionTitle: "Sanskrit Wikisource revision 363170, chapters 91–93", providerRevisionId: 363170 },
};
const WORK_TITLE = "Devī Māhātmya within the Mārkaṇḍeyapurāṇa";
const SOURCE_BOUNDARY = "Source-bounded Devam narrative index over three exact Sanskrit Wikisource provider revisions covering chapters 81–93, with AI-assisted beta translation aids. It is not a source-original translation, identified print edition, critical recension, complete Devī Māhātmya or Śākta tradition, festival origin, ritual authority, historical claim, or label for living people or groups.";

type Pack = {
  contract: string;
  source_boundary: { source_sha256: string; source_sha256s: string[]; scope: string; claim_ceiling: string };
  denials: Record<string, boolean>;
  entities: Array<{ slug: string; canonical_name: string; names: Array<{ name: string }> }>;
  claims: Array<{
    claim_slug: string;
    object_slug: string;
    predicate: string;
    evidence: { source_sha256: string; citation_ordinal: number; chapter: number; verse: number; source_ordinal: number; source_span_sha256: string };
    statements: { en: string; hi: string };
  }>;
};

let cachedPack: Pack | undefined;

function loadPack(): Pack {
  if (cachedPack) return cachedPack;
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, PACK_PATH));
  if (createHash("sha256").update(bytes).digest("hex") !== PACK_FILE_SHA256) throw new Error("Devimahatmya semantic search pack drift");
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (
    pack.contract !== "DEVAM_SOURCE_BOUNDED_SEMANTIC_GRAPH_V1"
    || pack.source_boundary.source_sha256 !== SOURCE_SHA256
    || pack.source_boundary.source_sha256s.join("|") !== SOURCE_SHA256S.join("|")
    || pack.source_boundary.scope !== "this_exact_three_revision_source_universe_only"
    || pack.source_boundary.claim_ceiling !== "source_bounded_narrative_index_not_universal_theology_history_or_ritual_authority"
    || pack.entities.length !== 20
    || pack.claims.length !== 20
    || Object.values(pack.denials).some((value) => value !== false)
  ) throw new Error("Devimahatmya semantic search contract drift");
  cachedPack = pack;
  return pack;
}

function normalize(value: string): string {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("en");
}

function searchableName(value: string): string {
  const words = normalize(value)
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
  return ` ${words} `;
}

export function searchDevimahatmyaSemanticGraph(query: string, languageCode?: string): LibrarySearchResult[] {
  const normalized = normalize(query.trim());
  if (normalized.length < 2 || normalized.length > 512) return [];
  const searchableQuery = searchableName(query);
  const hindi = languageCode?.toLowerCase().startsWith("hi") === true || /[\u0900-\u097f]/.test(query);
  const pack = loadPack();
  const entityBySlug = new Map(pack.entities.map((entity) => [entity.slug, entity]));
  return pack.claims.flatMap((claim) => {
    const entity = entityBySlug.get(claim.object_slug);
    if (!entity) throw new Error(`Missing semantic entity ${claim.object_slug}`);
    const aliases = [entity.slug.replaceAll("-", " "), entity.canonical_name, ...entity.names.map((name) => name.name)].map(searchableName);
    if (!aliases.some((alias) => searchableQuery.includes(alias))) return [];
    const evidence = claim.evidence;
    const sourcePresentation = SOURCE_PRESENTATION[evidence.source_sha256];
    if (!sourcePresentation) throw new Error(`Missing Devimahatmya source presentation ${evidence.source_sha256}`);
    return [{
      id: `durga-devimahatmya-semantic-${claim.claim_slug}-${hindi ? "hi" : "en"}`,
      title: entity.canonical_name,
      statement: claim.statements[hindi ? "hi" : "en"],
      languageCode: hindi ? "hi" : "en",
      claimKind: "source_bounded_narrative_index",
      citations: [{
        passageId: `sha256:${evidence.source_sha256}:span:${evidence.source_span_sha256}`,
        sourceObjectId: evidence.source_sha256,
        sourceOrdinal: evidence.source_ordinal,
        locator: { contract: "DEVAM_SOURCE_ORDINAL_V1", citation_ordinal: evidence.citation_ordinal, chapter: evidence.chapter, verse: evidence.verse, span_sha256: evidence.source_span_sha256, provider_revision_id: sourcePresentation.providerRevisionId },
        workTitle: WORK_TITLE,
        editionTitle: sourcePresentation.editionTitle,
        rightsLane: "derivative_allowed",
      }],
      sourceBoundary: SOURCE_BOUNDARY,
    } satisfies LibrarySearchResult];
  });
}

export const DEVIMAHATMYA_SEMANTIC_SEARCH_FIXITY = {
  packFileSha256: PACK_FILE_SHA256,
  sourceSha256: SOURCE_SHA256,
  sourceSha256s: SOURCE_SHA256S,
  entityCount: 20,
  bilingualClaimCount: 40,
  relationshipCount: 20,
  sourcePayloadsCopied: false,
} as const;
