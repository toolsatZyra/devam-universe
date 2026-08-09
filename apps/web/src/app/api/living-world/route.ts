import { buildRamayanaLivingPortal } from "../../../data/ramayana-living-portals";

const CACHE_CONTROL = "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const nodeId = url.searchParams.get("nodeId")?.trim() ?? "";
  const languageCode = url.searchParams.get("languageCode")?.trim() ?? "";

  if (!nodeId || (languageCode !== "en" && languageCode !== "hi")) {
    return Response.json({ ok: false, code: "INVALID_LIVING_WORLD_CONTEXT" }, { status: 422 });
  }

  const portal = buildRamayanaLivingPortal(nodeId, languageCode);
  if (!portal) return Response.json({ ok: false, code: "LIVING_WORLD_NOT_FOUND" }, { status: 404 });

  return Response.json({ ok: true, portal }, { headers: { "Cache-Control": CACHE_CONTROL } });
}
