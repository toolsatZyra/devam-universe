import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import * as authSession from "../../../lib/supabase/auth-session";
import * as authServer from "../../../lib/supabase/auth-server";
import * as supabaseServer from "../../../lib/supabase/server";

vi.mock("server-only", () => ({}));

const VALID_SESSION = "8f5ac8b4-9b87-4df3-9ee8-e46f7cfbad7d";

function request(body: unknown) {
  return new Request("http://localhost/api/analytics", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_PUBLISHABLE_KEY;
});

describe("POST /api/analytics", () => {
  it("accepts an allow-listed event without requiring local Supabase", async () => {
    const response = await POST(request({ eventName: "atlas_gateway_opened", sessionId: VALID_SESSION, target: "durga" }));
    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ ok: true, recorded: false, status: "not_configured" });
  });

  it.each([
    { eventName: "search_submitted", sessionId: VALID_SESSION, target: "the user's query" },
    { eventName: "sarthi_question_submitted", sessionId: VALID_SESSION, target: "the user's message" },
    { eventName: "unknown_event", sessionId: VALID_SESSION },
    { eventName: "atlas_opened", sessionId: "not-a-uuid" },
    { eventName: "atlas_opened", sessionId: VALID_SESSION, email: "person@example.com" },
  ])("rejects content-bearing or invalid event payload %#", async (body) => {
    const response = await POST(request(body));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ ok: false, code: "INVALID_EVENT" });
  });

  it("accepts a no-op when analytics storage is temporarily unavailable", async () => {
    vi.spyOn(supabaseServer, "hasSupabaseConfiguration").mockReturnValue(true);
    vi.spyOn(authSession, "getCurrentAccount").mockResolvedValue(null);
    vi.spyOn(supabaseServer, "createServerSupabaseClient").mockReturnValue({
      from: () => ({ insert: async () => ({ error: { code: "PGRST205" } }) }),
    } as never);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const response = await POST(request({ eventName: "search_submitted", sessionId: VALID_SESSION }));
    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ ok: true, recorded: false, status: "temporarily_unavailable" });
  });

  it("uses the authenticated cookie client for a real signed-in account without storing its identity", async () => {
    vi.spyOn(supabaseServer, "hasSupabaseConfiguration").mockReturnValue(true);
    vi.spyOn(authSession, "getCurrentAccount").mockResolvedValue({ id: "private-user-id", email: "private@example.com" });
    const insert = vi.fn(async () => ({ error: null }));
    vi.spyOn(authServer, "createServerAuthClient").mockResolvedValue({ from: () => ({ insert }) } as never);
    const anonymousClient = vi.spyOn(supabaseServer, "createServerSupabaseClient");
    const response = await POST(request({ eventName: "account_signed_in", sessionId: VALID_SESSION }));
    expect(response.status).toBe(202);
    expect(anonymousClient).not.toHaveBeenCalled();
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ account_state: "signed_in" }));
    expect(JSON.stringify(insert.mock.calls)).not.toContain("private-user-id");
    expect(JSON.stringify(insert.mock.calls)).not.toContain("private@example.com");
  });
});
