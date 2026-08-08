import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import {
  isRetrievableRightsLane,
  normalizeEvidenceQuery,
  type EvidencePassage,
  type EvidenceRepository,
} from "@/lib/evidence/contracts";

export class SupabaseEvidenceRepository implements EvidenceRepository {
  async searchPassages(query: string, limit = 8): Promise<EvidencePassage[]> {
    const normalized = normalizeEvidenceQuery(query);
    const boundedLimit = Math.max(1, Math.min(20, Math.trunc(limit)));
    const client = createAdminSupabaseClient();
    const { data, error } = await client
      .from("passages")
      .select("id,source_object_id,source_ordinal,locator,exact_text,language_code,rights_lane,publication_state")
      .in("rights_lane", ["citation_only", "product_allowed", "derivative_allowed"])
      .in("publication_state", ["review", "published"])
      .textSearch("search_document", normalized, { type: "websearch", config: "simple" })
      .order("source_ordinal")
      .limit(boundedLimit);

    if (error) throw new Error(`Evidence retrieval failed: ${error.message}`);
    return data.map((row) => {
      if (!row.exact_text || !isRetrievableRightsLane(row.rights_lane) || (row.publication_state !== "review" && row.publication_state !== "published")) {
        throw new Error(`Evidence row ${row.id} violated the retrieval contract.`);
      }
      if (!row.locator || typeof row.locator !== "object" || Array.isArray(row.locator)) {
        throw new Error(`Evidence row ${row.id} has an invalid locator.`);
      }
      return {
        id: row.id,
        sourceObjectId: row.source_object_id,
        sourceOrdinal: row.source_ordinal,
        locator: row.locator as Record<string, unknown>,
        text: row.exact_text,
        languageCode: row.language_code,
        rightsLane: row.rights_lane,
        publicationState: row.publication_state,
      };
    });
  }
}
