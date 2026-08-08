import { parseProductFunnelInput } from "../../../lib/analytics/product-funnel";
import { getCurrentAccount } from "../../../lib/supabase/auth-session";
import { createServerAuthClient } from "../../../lib/supabase/auth-server";
import { createServerSupabaseClient, hasSupabaseConfiguration } from "../../../lib/supabase/server";

let analyticsStorageWarningEmitted = false;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, code: "INVALID_EVENT" }, { status: 400 });
  }
  const event = parseProductFunnelInput(body);
  if (!event) return Response.json({ ok: false, code: "INVALID_EVENT" }, { status: 400 });

  if (!hasSupabaseConfiguration()) {
    return Response.json({ ok: true, recorded: false, status: "not_configured" }, { status: 202 });
  }

  const account = await getCurrentAccount();
  const supabase = account ? await createServerAuthClient() : createServerSupabaseClient();
  const { error } = await supabase.from("product_events").insert({
    id: event.id,
    session_id: event.sessionId,
    event_name: event.eventName,
    surface: event.surface,
    target: event.target,
    account_state: account ? "signed_in" : "guest",
  });
  if (error) {
    if (!analyticsStorageWarningEmitted) {
      analyticsStorageWarningEmitted = true;
      console.warn("Product funnel event was not recorded", { code: error.code });
    }
    return Response.json({ ok: true, recorded: false, status: "temporarily_unavailable" }, { status: 202 });
  }
  return Response.json({ ok: true, recorded: true }, { status: 202 });
}
