import { NextResponse } from "next/server";
import { validatePanchangRequest, type PanchangEngineError } from "../../../lib/panchang/contracts";
import { calculatePanchang } from "../../../lib/panchang/engine";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, code: "INVALID_CONTEXT", issues: ["Body must be valid JSON."] }, { status: 400 });
  }

  const validation = validatePanchangRequest(body);
  if (!validation.ok) return NextResponse.json(validation, { status: 422 });

  try {
    const fact = calculatePanchang(validation.value);
    if (fact) return NextResponse.json(fact, { headers: { "Cache-Control": "private, max-age=0, must-revalidate" } });
    const unavailable: PanchangEngineError = {
      ok: false,
      code: "NO_SUNRISE_FOR_CIVIL_DATE",
      message: "No sunrise/sunset pair could be resolved for this location and civil date.",
      request: validation.value,
    };
    return NextResponse.json(unavailable, { status: 422 });
  } catch {
    const failure: PanchangEngineError = {
      ok: false,
      code: "ENGINE_CALCULATION_FAILED",
      message: "The deterministic Panchang calculation failed closed.",
      request: validation.value,
    };
    return NextResponse.json(failure, { status: 503 });
  }
}
