import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { getCurrentAccount, createServerAuthClient } = vi.hoisted(() => ({
  getCurrentAccount: vi.fn(),
  createServerAuthClient: vi.fn(),
}));
vi.mock("../supabase/auth-session", () => ({ getCurrentAccount }));
vi.mock("../supabase/auth-server", () => ({ createServerAuthClient }));

import { prepareSarthiRuntime } from "./persistence";

function profileQuery() {
  return {
    select() { return this; },
    eq() { return this; },
    async maybeSingle() {
      return { data: { preferred_language: "en", home_location: { practiceRegion: "west-india" }, sampradaya_code: null, personalization_consent: true }, error: null };
    },
  };
}

function threadQuery() {
  return {
    select() { return this; },
    eq() { return this; },
    async maybeSingle() { return { data: { id: "11111111-1111-4111-8111-111111111111" }, error: null }; },
  };
}

function messageQuery() {
  return {
    select() { return this; },
    eq() { return this; },
    order() { return this; },
    async limit() {
      return {
        data: [
          { role: "assistant", content: "What is the constraint?", created_at: "2026-08-07T00:02:00Z" },
          { role: "user", content: "My parents and I disagree about my career.", created_at: "2026-08-07T00:01:00Z" },
        ],
        error: null,
      };
    },
  };
}

describe("Sarthi conversation preparation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getCurrentAccount.mockResolvedValue({ id: "account-id" });
    createServerAuthClient.mockResolvedValue({
      from(table: string) {
        if (table === "profiles") return profileQuery();
        if (table === "conversation_threads") return threadQuery();
        if (table === "conversation_messages") return messageQuery();
        throw new Error(`Unexpected table ${table}`);
      },
    });
  });

  it("loads only the owner's recent saved turns and restores chronological order", async () => {
    const result = await prepareSarthiRuntime({
      message: "Money is the main worry.",
      context: { conversationId: "11111111-1111-4111-8111-111111111111" },
    });
    expect(result.persistence).toEqual({ status: "saved", conversationId: "11111111-1111-4111-8111-111111111111" });
    expect(result.request.context?.regionCode).toBe("west-india");
    expect(result.request.recentTurns).toEqual([
      { role: "user", content: "My parents and I disagree about my career." },
      { role: "assistant", content: "What is the constraint?" },
    ]);
  });
});
