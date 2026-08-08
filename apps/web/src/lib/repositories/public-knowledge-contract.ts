import {
  isRetrievableRightsLane,
  type GroundedClaim,
  type GroundedClaimEvidence,
  type PublicEvidencePassage,
} from "../evidence/contracts";

function record(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} is not an object.`);
  return value as Record<string, unknown>;
}

function text(value: unknown, label: string): string {
  if (typeof value !== "string" || !value) throw new Error(`${label} is not a non-empty string.`);
  return value;
}

function nullableText(value: unknown, label: string): string | null {
  if (value === null) return null;
  return text(value, label);
}

function finiteNumber(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`${label} is not finite.`);
  return value;
}

function evidence(value: unknown): GroundedClaimEvidence {
  const item = record(value, "public evidence");
  const rightsLane = text(item.rightsLane, "public evidence rights lane");
  if (!isRetrievableRightsLane(rightsLane)) throw new Error("Public evidence has an invalid rights lane.");
  if (item.publicationState !== "published") throw new Error("Public evidence is not published.");
  const exactText = nullableText(item.exactText, "public evidence exact text");
  if (rightsLane === "citation_only" && exactText !== null) throw new Error("Citation-only evidence exposed exact text.");
  if (rightsLane !== "citation_only" && exactText === null) throw new Error("Product-readable evidence omitted exact text.");
  const evidenceRole = text(item.evidenceRole, "public evidence role");
  if (!["supports", "contradicts", "qualifies", "context"].includes(evidenceRole)) throw new Error("Public evidence has an invalid role.");
  return {
    passageId: text(item.passageId, "public passage id"),
    sourceObjectId: text(item.sourceObjectId, "public source object id"),
    sourceOrdinal: finiteNumber(item.sourceOrdinal, "public source ordinal"),
    locator: record(item.locator, "public locator"),
    exactText,
    languageCode: text(item.languageCode, "public evidence language"),
    spanSha256: nullableText(item.spanSha256, "public span hash"),
    sourceSha256: text(item.sourceSha256, "public source hash"),
    workSlug: text(item.workSlug, "public work slug"),
    workTitle: text(item.workTitle, "public work title"),
    editionTitle: text(item.editionTitle, "public edition title"),
    rightsLane,
    publicationState: "published",
    evidenceRole: evidenceRole as GroundedClaimEvidence["evidenceRole"],
    note: nullableText(item.note, "public evidence note"),
  };
}

function claim(value: unknown): GroundedClaim {
  const item = record(value, "public claim");
  if (item.publicationState !== "published") throw new Error("Public claim is not published.");
  const rightsLane = text(item.rightsLane, "public claim rights lane");
  if (rightsLane !== "product_allowed" && rightsLane !== "derivative_allowed") throw new Error("Public claim is outside the product rights lanes.");
  const evidenceItems = Array.isArray(item.evidence) ? item.evidence.map(evidence) : [];
  if (!evidenceItems.length) throw new Error("Public claim has no evidence.");
  const subjectValue = item.subject === null ? null : record(item.subject, "public claim subject");
  const confidence = item.confidence === null ? null : finiteNumber(item.confidence, "public claim confidence");
  return {
    id: text(item.id, "public claim id"),
    stableKey: text(item.stableKey, "public claim stable key"),
    subject: subjectValue ? {
      slug: text(subjectValue.slug, "public subject slug"),
      canonicalName: text(subjectValue.canonicalName, "public subject name"),
    } : null,
    statement: text(item.statement, "public claim statement"),
    languageCode: text(item.languageCode, "public claim language"),
    claimKind: text(item.claimKind, "public claim kind"),
    evidenceClass: text(item.evidenceClass, "public evidence class"),
    confidence,
    applicability: record(item.applicability, "public claim applicability"),
    uncertaintyNote: nullableText(item.uncertaintyNote, "public uncertainty note"),
    rightsLane,
    publicationState: "published",
    evidence: evidenceItems,
  };
}

function sha256(value: unknown, label: string): string {
  const hash = text(value, label);
  if (!/^[0-9a-f]{64}$/.test(hash)) throw new Error(`${label} is not a lowercase SHA-256 hash.`);
  return hash;
}

function publicPassage(value: unknown): PublicEvidencePassage {
  const item = record(value, "public passage");
  if (item.publicationState !== "published") throw new Error("Public passage is not published.");
  if (item.rightsLane !== "product_allowed" && item.rightsLane !== "derivative_allowed") {
    throw new Error("Public passage is outside the exact-text product rights lanes.");
  }
  const spanSha256 = item.spanSha256 === null ? null : sha256(item.spanSha256, "public passage span hash");
  return {
    id: text(item.id, "public passage id"),
    sourceObjectId: text(item.sourceObjectId, "public passage source object id"),
    sourceOrdinal: finiteNumber(item.sourceOrdinal, "public passage source ordinal"),
    locator: record(item.locator, "public passage locator"),
    text: text(item.text, "public passage text"),
    textStatus: text(item.textStatus, "public passage text status"),
    languageCode: text(item.languageCode, "public passage language"),
    spanSha256,
    sourceSha256: sha256(item.sourceSha256, "public passage source hash"),
    sourceCompletenessStatus: text(item.sourceCompletenessStatus, "public passage source completeness status"),
    workSlug: text(item.workSlug, "public passage work slug"),
    workTitle: text(item.workTitle, "public passage work title"),
    editionTitle: text(item.editionTitle, "public passage edition title"),
    rightsLane: item.rightsLane,
    publicationState: "published",
  };
}

export function parsePublicKnowledgeClaims(value: unknown): GroundedClaim[] {
  if (!Array.isArray(value)) throw new Error("Public knowledge RPC did not return an array.");
  return value.map(claim);
}

export function parsePublicPassages(value: unknown): PublicEvidencePassage[] {
  if (!Array.isArray(value)) throw new Error("Public passage RPC did not return an array.");
  return value.map(publicPassage);
}
