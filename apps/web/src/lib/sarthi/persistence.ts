import "server-only";

import type { GroundedSarthiAnswer, SarthiRequest, SarthiUnavailable } from "./contracts";
import { applyConsentedProfileContext } from "./personalization";
import { createServerAuthClient } from "../supabase/auth-server";
import { getCurrentAccount } from "../supabase/auth-session";

export type ConversationPersistence = {
  status: "guest_ephemeral" | "consent_required" | "saved" | "save_failed";
  conversationId: string | null;
};

export type SarthiRuntime = {
  request: SarthiRequest;
  accountId: string | null;
  persistence: ConversationPersistence;
};

export async function prepareSarthiRuntime(request: SarthiRequest): Promise<SarthiRuntime> {
  const account = await getCurrentAccount();
  if (!account) return { request, accountId: null, persistence: { status: "guest_ephemeral", conversationId: null } };

  try {
    const supabase = await createServerAuthClient();
    const { data: profile, error } = await supabase.from("profiles")
      .select("preferred_language, home_location, sampradaya_code, personalization_consent")
      .eq("id", account.id)
      .maybeSingle();
    if (error || !profile?.personalization_consent) {
      return { request, accountId: account.id, persistence: { status: "consent_required", conversationId: null } };
    }
    let recentTurns = request.recentTurns;
    const conversationId = request.context?.conversationId;
    if (conversationId) {
      const { data: ownedThread, error: threadError } = await supabase.from("conversation_threads")
        .select("id")
        .eq("id", conversationId)
        .eq("user_id", account.id)
        .maybeSingle();
      if (threadError || !ownedThread) {
        return { request, accountId: account.id, persistence: { status: "save_failed", conversationId: null } };
      }
      const { data: messages, error: messagesError } = await supabase.from("conversation_messages")
        .select("role, content, created_at")
        .eq("thread_id", conversationId)
        .order("created_at", { ascending: false })
        .limit(8);
      if (messagesError || !messages) {
        return { request, accountId: account.id, persistence: { status: "save_failed", conversationId: null } };
      }
      recentTurns = messages
        .slice()
        .reverse()
        .filter((message) => (message.role === "user" || message.role === "assistant") && typeof message.content === "string")
        .map((message) => ({ role: message.role as "user" | "assistant", content: message.content.slice(0, 8000) }));
    }
    return {
      request: { ...applyConsentedProfileContext(request, profile), ...(recentTurns ? { recentTurns } : {}) },
      accountId: account.id,
      persistence: { status: "saved", conversationId: conversationId ?? null },
    };
  } catch {
    return { request, accountId: account.id, persistence: { status: "save_failed", conversationId: null } };
  }
}

function answerText(answer: GroundedSarthiAnswer | SarthiUnavailable): string {
  return answer.ok ? answer.answer : answer.message;
}

function titleFromMessage(message: string): string {
  const compact = message.replace(/\s+/g, " ").trim();
  return compact.length <= 80 ? compact : `${compact.slice(0, 77)}…`;
}

export async function persistSarthiExchange(
  runtime: SarthiRuntime,
  answer: GroundedSarthiAnswer | SarthiUnavailable,
): Promise<ConversationPersistence> {
  if (!runtime.accountId || runtime.persistence.status !== "saved") return runtime.persistence;

  try {
    const supabase = await createServerAuthClient();
    let conversationId = runtime.request.context?.conversationId ?? null;
    if (conversationId) {
      const { data: ownedThread, error } = await supabase.from("conversation_threads")
        .select("id")
        .eq("id", conversationId)
        .eq("user_id", runtime.accountId)
        .maybeSingle();
      if (error || !ownedThread) return { status: "save_failed", conversationId: null };
    } else {
      const { data: created, error } = await supabase.from("conversation_threads")
        .insert({ user_id: runtime.accountId, title: titleFromMessage(runtime.request.message) })
        .select("id")
        .single();
      if (error || !created) return { status: "save_failed", conversationId: null };
      conversationId = created.id;
    }

    const grounding = answer.ok ? {
      mode: answer.mode,
      citationPassageIds: answer.citations.map((citation) => citation.passageId),
      sourceBoundary: answer.sourceBoundary,
      alternativesAvailable: answer.alternativesAvailable,
    } : { mode: "unavailable", code: answer.code };
    const { error: messageError } = await supabase.from("conversation_messages").insert([
      { thread_id: conversationId, role: "user", content: runtime.request.message, grounding: {} },
      { thread_id: conversationId, role: "assistant", content: answerText(answer), grounding },
    ]);
    if (messageError) return { status: "save_failed", conversationId: null };
    await supabase.from("conversation_threads").update({ updated_at: new Date().toISOString() }).eq("id", conversationId);
    return { status: "saved", conversationId };
  } catch {
    return { status: "save_failed", conversationId: null };
  }
}
