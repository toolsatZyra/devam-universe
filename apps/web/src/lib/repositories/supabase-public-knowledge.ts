import "server-only";
import type { KnowledgeGroundingRepository } from "../evidence/contracts";
import { normalizeEvidenceQuery, normalizeLanguageCode } from "../evidence/contracts";
import { createServerSupabaseClient } from "../supabase/server";
import { parsePublicKnowledgeClaims, parsePublicPassages } from "./public-knowledge-contract";

export class SupabasePublicKnowledgeRepository implements KnowledgeGroundingRepository {
  async searchClaims(query: string, languageCode?: string, limit = 6) {
    const normalized = normalizeEvidenceQuery(query);
    const language = normalizeLanguageCode(languageCode);
    const boundedLimit = Math.max(1, Math.min(12, Math.trunc(limit)));
    const { data, error } = await createServerSupabaseClient().rpc("search_public_knowledge", {
      search_query: normalized,
      language_filter: language,
      result_limit: boundedLimit,
    });
    if (error) throw new Error(`Public knowledge retrieval failed: ${error.message}`);
    return parsePublicKnowledgeClaims(data);
  }

  async searchPublishedPassages(query: string, languageCode?: string, limit = 12) {
    const normalized = normalizeEvidenceQuery(query);
    const language = normalizeLanguageCode(languageCode);
    const boundedLimit = Math.max(1, Math.min(20, Math.trunc(limit)));
    const { data, error } = await createServerSupabaseClient().rpc("search_public_passages", {
      search_query: normalized,
      language_filter: language,
      result_limit: boundedLimit,
    });
    if (error) throw new Error(`Public passage retrieval failed: ${error.message}`);
    return parsePublicPassages(data);
  }
}
