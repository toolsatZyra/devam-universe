import type { PublicNarrativeSeries } from "../../../lib/narratives/public-narrative-contract";

const CACHE_CONTROL = "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800";

export type PublicNarrativeReader = {
  getSeries(seriesSlug: string, languageCode: "en" | "hi"): Promise<PublicNarrativeSeries | null>;
};

function validSeriesSlug(value: string) {
  return value.length <= 120 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function createNarrativeGet(reader: PublicNarrativeReader) {
  return async function GET(request: Request) {
    const url = new URL(request.url);
    const seriesSlug = url.searchParams.get("series")?.trim() ?? "";
    const languageCode = url.searchParams.get("language")?.trim() ?? "";
    if (!validSeriesSlug(seriesSlug) || (languageCode !== "en" && languageCode !== "hi")) {
      return Response.json({ ok: false, code: "INVALID_NARRATIVE_CONTEXT" }, { status: 422 });
    }
    try {
      const narrative = await reader.getSeries(seriesSlug, languageCode);
      if (!narrative) return Response.json({ ok: false, code: "NARRATIVE_NOT_FOUND" }, { status: 404 });
      return Response.json({ ok: true, narrative }, { headers: { "Cache-Control": CACHE_CONTROL } });
    } catch {
      return Response.json({ ok: false, code: "NARRATIVE_DATA_UNAVAILABLE" }, { status: 503 });
    }
  };
}

async function defaultReader(): Promise<PublicNarrativeReader | null> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PUBLISHABLE_KEY) return null;
  const { SupabasePublicNarrativeRepository } = await import("../../../lib/repositories/supabase-public-narrative");
  return new SupabasePublicNarrativeRepository();
}

export async function GET(request: Request) {
  const reader = await defaultReader();
  if (!reader) return Response.json({ ok: false, code: "NARRATIVE_DATA_UNAVAILABLE" }, { status: 503 });
  return createNarrativeGet(reader)(request);
}
