import { createServerAuthClient } from "@/lib/supabase/auth-server";
import { getCurrentAccount } from "@/lib/supabase/auth-session";

export const dynamic = "force-dynamic";

export async function GET() {
  const account = await getCurrentAccount();
  if (!account) return Response.json({ ok: false, error: "authentication_required" }, { status: 401 });

  const supabase = await createServerAuthClient();
  const [profileResult, memoriesResult, threadsResult] = await Promise.all([
    supabase.from("profiles").select("display_name, preferred_language, home_location, sampradaya_code, family_practice, personalization_consent, created_at, updated_at").eq("id", account.id).maybeSingle(),
    supabase.from("user_memories").select("id, memory_kind, value, source_thread_id, user_confirmed, created_at, updated_at").eq("user_id", account.id).order("created_at"),
    supabase.from("conversation_threads").select("id, title, created_at, updated_at").eq("user_id", account.id).order("created_at"),
  ]);
  if (profileResult.error || memoriesResult.error || threadsResult.error) {
    return Response.json({ ok: false, error: "export_unavailable" }, { status: 503 });
  }

  const threadIds = (threadsResult.data ?? []).map((thread) => thread.id);
  const messagesResult = threadIds.length
    ? await supabase.from("conversation_messages").select("id, thread_id, role, content, grounding, created_at").in("thread_id", threadIds).order("created_at")
    : { data: [], error: null };
  if (messagesResult.error) return Response.json({ ok: false, error: "export_unavailable" }, { status: 503 });

  return Response.json({
    schemaVersion: "devam-user-export-v1",
    exportedAt: new Date().toISOString(),
    account: { id: account.id, email: account.email },
    profile: profileResult.data,
    memories: memoriesResult.data ?? [],
    conversations: { threads: threadsResult.data ?? [], messages: messagesResult.data ?? [] },
  }, {
    headers: {
      "cache-control": "private, no-store",
      "content-disposition": `attachment; filename="devam-account-${account.id}.json"`,
    },
  });
}

