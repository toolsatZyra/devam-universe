import "server-only";
import { parsePublicNarrativeSeries } from "../narratives/public-narrative-contract";
import { createServerSupabaseClient } from "../supabase/server";

export class SupabasePublicNarrativeRepository {
  async getSeries(seriesSlug: string, languageCode: "en" | "hi") {
    const { data, error } = await createServerSupabaseClient().rpc("get_public_narrative_series", {
      series_slug: seriesSlug,
      language_filter: languageCode,
    });
    if (error) throw new Error(`Public narrative retrieval failed: ${error.message}`);
    return parsePublicNarrativeSeries(data);
  }
}
