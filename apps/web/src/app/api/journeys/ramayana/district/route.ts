import { NextResponse } from "next/server";
import { getRamayanaDistrictMoments } from "../../../../../data/ramayana-story-world";

export async function GET(request: Request) {
  const districtId = new URL(request.url).searchParams.get("district") ?? "";
  const moments = getRamayanaDistrictMoments(districtId);
  if (!moments) return NextResponse.json({ ok: false, message: "Unknown Ramayana story district." }, { status: 404 });
  return NextResponse.json(
    { ok: true, districtId, moments },
    { headers: { "cache-control": "public, max-age=300, s-maxage=31536000, immutable" } },
  );
}
