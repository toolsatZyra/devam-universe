import type {
  GroundedClaim,
  GroundedClaimEvidence,
  KnowledgeGroundingRepository,
  PublicEvidencePassage,
} from "../evidence/contracts";
import type { EvidenceCitation } from "../sarthi/contracts";
import { searchGaneshaPreview } from "../sarthi/ganesha-preview";
import { searchHeroStructures } from "./hero-search";
import { searchUserCompleteRitualContent } from "./ritual-content-search";
import { searchReviewedRamayanaReflection } from "../sarthi/ramayana-reflection";

export type LibrarySearchResult = {
  id: string;
  title: string;
  statement: string;
  languageCode: string;
  claimKind: string;
  citations: EvidenceCitation[];
  sourceBoundary: string;
};

export type LibraryRetrievalStatus = "connected" | "not_configured" | "temporarily_unavailable";

export type LibrarySearchResponse = {
  results: LibrarySearchResult[];
  retrievalStatus: LibraryRetrievalStatus;
  coverage: string;
};

function canQuote(evidence: GroundedClaimEvidence): boolean {
  return typeof evidence.exactText === "string"
    && evidence.publicationState === "published"
    && (evidence.rightsLane === "product_allowed" || evidence.rightsLane === "derivative_allowed");
}

function isPublicProductClaim(claim: GroundedClaim): boolean {
  return claim.publicationState === "published"
    && (claim.rightsLane === "product_allowed" || claim.rightsLane === "derivative_allowed")
    && claim.evidence.length > 0
    && claim.evidence.every((item) => item.publicationState === "published");
}

function citationFromEvidence(evidence: GroundedClaimEvidence): EvidenceCitation {
  return {
    passageId: evidence.passageId,
    sourceObjectId: evidence.sourceObjectId,
    sourceOrdinal: evidence.sourceOrdinal,
    locator: evidence.locator,
    workTitle: evidence.workTitle,
    editionTitle: evidence.editionTitle,
    rightsLane: evidence.rightsLane,
    ...(canQuote(evidence) ? { quotation: evidence.exactText ?? undefined } : {}),
  };
}

function resultFromClaim(claim: GroundedClaim): LibrarySearchResult {
  const firstEvidence = claim.evidence[0];
  const title = claim.subject?.canonicalName ?? firstEvidence.workTitle;
  const scope = typeof claim.applicability.scope === "string" ? claim.applicability.scope.replaceAll("_", " ") : "the cited evidence";
  const uncertainty = claim.uncertaintyNote ? ` ${claim.uncertaintyNote}` : "";
  return {
    id: claim.stableKey,
    title,
    statement: claim.statement,
    languageCode: claim.languageCode,
    claimKind: claim.claimKind,
    citations: claim.evidence.map(citationFromEvidence),
    sourceBoundary: `Published Devam claim bounded to ${scope}; evidence is from ${firstEvidence.workTitle}, ${firstEvidence.editionTitle}.${uncertainty}`,
  };
}

function resultFromPassage(passage: PublicEvidencePassage): LibrarySearchResult {
  return {
    id: `passage:${passage.id}`,
    title: passage.workTitle,
    statement: passage.text,
    languageCode: passage.languageCode,
    claimKind: "source_passage",
    citations: [{
      passageId: passage.id,
      sourceObjectId: passage.sourceObjectId,
      sourceOrdinal: passage.sourceOrdinal,
      locator: passage.locator,
      workTitle: passage.workTitle,
      editionTitle: passage.editionTitle,
      quotation: passage.text,
      rightsLane: passage.rightsLane,
    }],
    sourceBoundary: `Published exact source passage from ${passage.workTitle}, ${passage.editionTitle}; text status: ${passage.textStatus}; source completeness: ${passage.sourceCompletenessStatus}. This is one passage in one edition, not a universal interpretation or a claim of tradition completeness.`,
  };
}

function mergeUnique(primary: LibrarySearchResult[], additional: LibrarySearchResult[]): LibrarySearchResult[] {
  const results = [...primary];
  const ids = new Set(primary.map((item) => item.id));
  for (const item of additional) {
    if (ids.has(item.id)) continue;
    ids.add(item.id);
    results.push(item);
  }
  return results;
}

export async function searchLibrary(
  query: string,
  languageCode?: string,
  repository?: KnowledgeGroundingRepository,
): Promise<LibrarySearchResponse> {
  const ritualResults = searchUserCompleteRitualContent(query, languageCode);
  const ramayanaReflectionResults = searchReviewedRamayanaReflection(query, languageCode);
  const compactResults = ritualResults.length > 0
    ? ritualResults
    : [
        ...searchGaneshaPreview(query, languageCode),
        ...(ramayanaReflectionResults.length > 0 ? ramayanaReflectionResults : searchHeroStructures(query, languageCode)),
      ];
  if (!repository) {
    return {
      results: compactResults,
      retrievalStatus: "not_configured",
      coverage: "Compact reviewed Ganesha, Ramayana, and Durga source slices plus the bounded Diwali evidence synthesis are available; the wider Supabase library connection is not configured in this runtime.",
    };
  }

  const claimRetrieval = repository.searchClaims(query, languageCode, 12);
  const passageRetrieval = repository.searchPublishedPassages
    ? repository.searchPublishedPassages(query, languageCode, 12)
    : undefined;
  const [claimsResult, passagesResult] = await Promise.allSettled([
    claimRetrieval,
    passageRetrieval ?? Promise.resolve<PublicEvidencePassage[]>([]),
  ]);
  const claimsConnected = claimsResult.status === "fulfilled";
  const passagesConnected = passageRetrieval !== undefined && passagesResult.status === "fulfilled";
  if (!claimsConnected && !passagesConnected) {
    return {
      results: compactResults,
      retrievalStatus: "temporarily_unavailable",
      coverage: "The wider library connection is temporarily unavailable; all four compact hero slices remain available, with Diwali explicitly labelled as a bounded evidence synthesis.",
    };
  }

  const claimResults = claimsConnected
    ? claimsResult.value.filter(isPublicProductClaim).map(resultFromClaim)
    : [];
  const passageResults = passagesConnected
    ? passagesResult.value.map(resultFromPassage)
    : [];
  return {
    results: mergeUnique(mergeUnique(compactResults, claimResults), passageResults),
    retrievalStatus: "connected",
    coverage: claimsConnected && passagesConnected
      ? "Published, product-compatible Supabase knowledge claims and exact source passages are connected alongside all four compact hero slices. Each passage remains bounded to its identified edition; Devam's library remains actively expanding."
      : passagesConnected
        ? "Published, product-compatible exact source passages and all four compact hero slices are connected. Knowledge-claim retrieval is temporarily unavailable; each passage remains bounded to its identified edition."
        : "Published, product-compatible Supabase knowledge claims and all four compact hero slices are connected. Exact source-passage retrieval is unavailable in this runtime; Devam's library remains actively expanding.",
  };
}
