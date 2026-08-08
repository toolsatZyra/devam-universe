import { NextResponse } from "next/server";
import type { PracticeGuidanceRequest } from "../../../lib/domain/practice";
import { resolvePracticeGuidance } from "../../../lib/practice/practice-guidance";

function validate(input: unknown): input is PracticeGuidanceRequest {
  if (!input || typeof input !== "object") return false;
  const body = input as Record<string, unknown>;
  return typeof body.observanceSlug === "string"
    && (body.languageCode === "en" || body.languageCode === "hi")
    && typeof body.regionCode === "string"
    && typeof body.traditionCode === "string";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, code: "INVALID_JSON" }, { status: 400 });
  }
  if (!validate(body)) return NextResponse.json({ ok: false, code: "NEEDS_PRACTICE_CONTEXT" }, { status: 422 });
  return NextResponse.json(resolvePracticeGuidance(body));
}
