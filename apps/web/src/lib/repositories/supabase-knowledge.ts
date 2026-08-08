import "server-only";
import { createAdminSupabaseClient } from "../supabase/admin";
import {
  isRetrievableRightsLane,
  normalizeEvidenceQuery,
  normalizeLanguageCode,
  type GroundedClaim,
  type GroundedClaimEvidence,
  type KnowledgeGroundingRepository,
} from "../evidence/contracts";

const RETRIEVABLE_RIGHTS = ["citation_only", "product_allowed", "derivative_allowed"] as const;
const RETRIEVABLE_STATES = ["review", "published"] as const;
const PRODUCT_RIGHTS = ["product_allowed", "derivative_allowed"] as const;

type RetrievalVisibility = "internal_review" | "public_product";

function objectValue(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} is not an object.`);
  return value as Record<string, unknown>;
}

function stringValue(value: unknown, label: string): string {
  if (typeof value !== "string" || !value) throw new Error(`${label} is not a string.`);
  return value;
}

function numberValue(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`${label} is not a finite number.`);
  return value;
}

function singleRelation(value: unknown, label: string): Record<string, unknown> {
  const candidate = Array.isArray(value) ? value[0] : value;
  return objectValue(candidate, label);
}

function isProductRightsLane(value: string): value is (typeof PRODUCT_RIGHTS)[number] {
  return value === "product_allowed" || value === "derivative_allowed";
}

function mapEvidence(row: unknown, visibility: RetrievalVisibility): GroundedClaimEvidence {
  const evidence = objectValue(row, "claim evidence");
  const passage = singleRelation(evidence.passage, "claim evidence passage");
  const source = singleRelation(passage.source, "claim evidence source");
  const edition = singleRelation(source.edition, "claim evidence edition");
  const expression = singleRelation(edition.expression, "claim evidence expression");
  const work = singleRelation(expression.work, "claim evidence work");
  const rightsLane = stringValue(passage.rights_lane, "passage rights lane");
  if (!isRetrievableRightsLane(rightsLane)) throw new Error("Evidence passage is outside a retrievable rights lane.");
  const role = stringValue(evidence.evidence_role, "evidence role");
  if (!["supports", "contradicts", "qualifies", "context"].includes(role)) throw new Error("Invalid evidence role.");
  const publicationState = stringValue(passage.publication_state, "passage publication state");
  if (publicationState !== "review" && publicationState !== "published") throw new Error("Invalid passage publication state.");
  if (visibility === "public_product") {
    if (publicationState !== "published") throw new Error("Public evidence passage is not published.");
    for (const [record, label] of [[edition, "edition"], [expression, "expression"], [work, "work"]] as const) {
      if (record.publication_state !== "published" || typeof record.rights_lane !== "string" || !isProductRightsLane(record.rights_lane)) {
        throw new Error(`Public evidence ${label} is outside the published product boundary.`);
      }
    }
  }
  return {
    passageId: stringValue(passage.id, "passage id"),
    sourceObjectId: stringValue(source.id, "source object id"),
    sourceOrdinal: numberValue(passage.source_ordinal, "source ordinal"),
    locator: objectValue(passage.locator, "passage locator"),
    exactText: stringValue(passage.exact_text, "passage exact text"),
    languageCode: stringValue(passage.language_code, "passage language"),
    spanSha256: passage.span_sha256 === null ? null : stringValue(passage.span_sha256, "passage span hash"),
    sourceSha256: stringValue(source.sha256, "source hash"),
    workSlug: stringValue(work.slug, "work slug"),
    workTitle: stringValue(work.canonical_title, "work title"),
    editionTitle: stringValue(edition.edition_title, "edition title"),
    rightsLane,
    publicationState,
    evidenceRole: role as GroundedClaimEvidence["evidenceRole"],
    note: evidence.note === null ? null : stringValue(evidence.note, "evidence note"),
  };
}

export class SupabaseKnowledgeRepository implements KnowledgeGroundingRepository {
  constructor(private readonly visibility: RetrievalVisibility = "internal_review") {}

  async searchClaims(query: string, languageCode?: string, limit = 6): Promise<GroundedClaim[]> {
    const normalized = normalizeEvidenceQuery(query);
    const language = normalizeLanguageCode(languageCode);
    const boundedLimit = Math.max(1, Math.min(12, Math.trunc(limit)));
    const client = createAdminSupabaseClient();
    const claimRights = this.visibility === "public_product" ? PRODUCT_RIGHTS : RETRIEVABLE_RIGHTS;
    const claimStates = this.visibility === "public_product" ? ["published"] as const : RETRIEVABLE_STATES;
    let request = client
      .from("claims")
      .select("id,stable_key,statement,language_code,claim_kind,evidence_class,confidence,applicability,uncertainty_note,rights_lane,publication_state,subject:entities(slug,canonical_name,rights_lane,publication_state)")
      .in("rights_lane", [...claimRights])
      .in("publication_state", [...claimStates])
      .textSearch("search_document", normalized, { type: "websearch", config: "simple" })
      .order("confidence", { ascending: false, nullsFirst: false })
      .limit(boundedLimit);
    if (language) request = request.eq("language_code", language);
    const { data: claimRows, error: claimError } = await request;
    if (claimError) throw new Error(`Claim retrieval failed: ${claimError.message}`);
    if (!claimRows.length) return [];

    const claimIds = claimRows.map((row) => row.id);
    const { data: evidenceRows, error: evidenceError } = await client
      .from("claim_evidence")
      .select("claim_id,evidence_role,note,passage:passages(id,source_ordinal,locator,exact_text,language_code,span_sha256,rights_lane,publication_state,source:source_objects(id,sha256,rights_lane,edition:editions(edition_title,rights_lane,publication_state,expression:expressions(rights_lane,publication_state,work:works(slug,canonical_title,rights_lane,publication_state)))))")
      .in("claim_id", claimIds)
      .order("passage_id");
    if (evidenceError) throw new Error(`Claim-evidence retrieval failed: ${evidenceError.message}`);

    const evidenceByClaim = new Map<string, GroundedClaimEvidence[]>();
    for (const row of evidenceRows as unknown[]) {
      const record = objectValue(row, "claim evidence row");
      const claimId = stringValue(record.claim_id, "claim evidence claim id");
      const mapped = mapEvidence(record, this.visibility);
      const existing = evidenceByClaim.get(claimId) ?? [];
      existing.push(mapped);
      evidenceByClaim.set(claimId, existing);
    }

    return claimRows.map((row) => {
      if (!isRetrievableRightsLane(row.rights_lane) || (row.publication_state !== "review" && row.publication_state !== "published")) {
        throw new Error(`Claim ${row.id} violated the retrieval boundary.`);
      }
      const publicationState = row.publication_state;
      const applicability = objectValue(row.applicability, `claim ${row.id} applicability`);
      const subject = row.subject ? singleRelation(row.subject, `claim ${row.id} subject`) : null;
      if (this.visibility === "public_product" && subject && (subject.publication_state !== "published" || typeof subject.rights_lane !== "string" || !isProductRightsLane(subject.rights_lane))) {
        throw new Error(`Claim ${row.id} subject is outside the published product boundary.`);
      }
      const evidence = evidenceByClaim.get(row.id) ?? [];
      if (!evidence.length) throw new Error(`Claim ${row.id} has no source evidence.`);
      return {
        id: row.id,
        stableKey: row.stable_key,
        subject: subject ? { slug: stringValue(subject.slug, "subject slug"), canonicalName: stringValue(subject.canonical_name, "subject canonical name") } : null,
        statement: row.statement,
        languageCode: row.language_code,
        claimKind: row.claim_kind,
        evidenceClass: row.evidence_class,
        confidence: row.confidence,
        applicability,
        uncertaintyNote: row.uncertainty_note,
        rightsLane: row.rights_lane,
        publicationState,
        evidence,
      } satisfies GroundedClaim;
    });
  }
}
