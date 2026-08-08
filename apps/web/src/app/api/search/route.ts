import { searchLibrary } from "../../../lib/search/library-search";
import { searchPreservedSourceCatalog } from "../../../lib/search/source-catalog-search";

async function publicKnowledgeRepository() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PUBLISHABLE_KEY) return undefined;
  const { SupabasePublicKnowledgeRepository } = await import("../../../lib/repositories/supabase-public-knowledge");
  return new SupabasePublicKnowledgeRepository();
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query")?.trim() ?? "";
  const languageCode = url.searchParams.get("language")?.trim() || undefined;
  if (query.length < 2 || query.length > 512) {
    return Response.json({ ok: false, code: "INVALID_QUERY", message: "Search needs between 2 and 512 characters." }, { status: 400 });
  }
  const repository = await publicKnowledgeRepository();
  const [search, sourceCatalog] = await Promise.all([
    searchLibrary(query, languageCode, repository),
    Promise.resolve(searchPreservedSourceCatalog(query)),
  ]);
  return Response.json({
    ok: true,
    query,
    results: search.results,
    total: search.results.length,
    retrievalStatus: search.retrievalStatus,
    coverage: search.coverage,
    sourceCatalogMatches: sourceCatalog.matches,
    sourceCatalogTotal: sourceCatalog.totalMatches,
    sourceCatalogBoundary: sourceCatalog.boundary,
  });
}
