import { NextResponse } from "next/server";
import { validateSarthiRequest } from "../../../lib/sarthi/contracts";
import { answerSarthiWithExactSourceFallback } from "../../../lib/sarthi/exact-source-answer";
import { persistSarthiExchange, prepareSarthiRuntime } from "../../../lib/sarthi/persistence";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, issues: ["Body must be valid JSON."] }, { status: 400 });
  }

  const validation = validateSarthiRequest(body);
  if (!validation.ok) return NextResponse.json(validation, { status: 422 });

  const runtime = await prepareSarthiRuntime(validation.value);
  const repository = process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY
    ? new (await import("../../../lib/repositories/supabase-public-knowledge")).SupabasePublicKnowledgeRepository()
    : undefined;
  const answer = await answerSarthiWithExactSourceFallback(runtime.request, repository);
  const conversation = await persistSarthiExchange(runtime, answer);
  return NextResponse.json({ ...answer, conversation });
}
