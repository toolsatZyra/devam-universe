import { evaluateRuntimeReadiness } from "../../../lib/operations/runtime-readiness";

export const dynamic = "force-dynamic";

export async function GET() {
  const readiness = evaluateRuntimeReadiness(process.env, process.env.NODE_ENV);
  return Response.json(readiness, {
    status: readiness.ok ? 200 : 503,
    headers: { "cache-control": "no-store" },
  });
}
