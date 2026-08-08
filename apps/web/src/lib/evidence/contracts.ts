export type RetrievableRightsLane = "citation_only" | "product_allowed" | "derivative_allowed";

export type EvidencePassage = {
  id: string;
  sourceObjectId: string;
  sourceOrdinal: number;
  locator: Record<string, unknown>;
  text: string;
  languageCode: string;
  rightsLane: RetrievableRightsLane;
  publicationState: "review" | "published";
};

export interface EvidenceRepository {
  searchPassages(query: string, limit?: number): Promise<EvidencePassage[]>;
}

export type PublicEvidencePassage = EvidencePassage & {
  textStatus: string;
  spanSha256: string | null;
  sourceSha256: string;
  sourceCompletenessStatus: string;
  workSlug: string;
  workTitle: string;
  editionTitle: string;
  rightsLane: "product_allowed" | "derivative_allowed";
  publicationState: "published";
};

export type GroundedClaimEvidence = {
  passageId: string;
  sourceObjectId: string;
  sourceOrdinal: number;
  locator: Record<string, unknown>;
  exactText: string | null;
  languageCode: string;
  spanSha256: string | null;
  sourceSha256: string;
  workSlug: string;
  workTitle: string;
  editionTitle: string;
  rightsLane: RetrievableRightsLane;
  publicationState: "review" | "published";
  evidenceRole: "supports" | "contradicts" | "qualifies" | "context";
  note: string | null;
};

export type GroundedClaim = {
  id: string;
  stableKey: string;
  subject: { slug: string; canonicalName: string } | null;
  statement: string;
  languageCode: string;
  claimKind: string;
  evidenceClass: string;
  confidence: number | null;
  applicability: Record<string, unknown>;
  uncertaintyNote: string | null;
  rightsLane: RetrievableRightsLane;
  publicationState: "review" | "published";
  evidence: GroundedClaimEvidence[];
};

export interface KnowledgeGroundingRepository {
  searchClaims(query: string, languageCode?: string, limit?: number): Promise<GroundedClaim[]>;
  searchPublishedPassages?(query: string, languageCode?: string, limit?: number): Promise<PublicEvidencePassage[]>;
}

export function normalizeEvidenceQuery(value: string): string {
  const normalized = value.trim().replace(/\s+/g, " ");
  if (normalized.length < 2) throw new Error("Evidence query must contain at least two characters.");
  if (normalized.length > 512) throw new Error("Evidence query must not exceed 512 characters.");
  return normalized;
}

export function normalizeLanguageCode(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const normalized = value.trim().toLowerCase();
  if (!/^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/.test(normalized)) throw new Error("Invalid language code.");
  return normalized;
}

export function isRetrievableRightsLane(value: string): value is RetrievableRightsLane {
  return value === "citation_only" || value === "product_allowed" || value === "derivative_allowed";
}
