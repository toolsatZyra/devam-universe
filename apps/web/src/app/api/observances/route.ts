import { validatePanchangRequest, type PanchangEngineError } from "../../../lib/panchang/contracts";
import { resolveBoundedObservances } from "../../../lib/panchang/observance-rules";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, code: "INVALID_CONTEXT", issues: ["Request body must be valid JSON."] }, { status: 400 });
  }

  const validation = validatePanchangRequest(body);
  if (!validation.ok) return Response.json(validation, { status: 400 });

  try {
    return Response.json(resolveBoundedObservances(validation.value));
  } catch {
    const failure: PanchangEngineError = {
      ok: false,
      code: "ENGINE_CALCULATION_FAILED",
      message: "The deterministic observance calculation failed closed.",
      request: validation.value,
    };
    return Response.json(failure, { status: 503 });
  }
}
