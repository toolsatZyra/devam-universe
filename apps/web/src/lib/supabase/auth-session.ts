import "server-only";

import { createServerAuthClient, hasSupabaseAuthConfiguration } from "./auth-server";

export type CurrentAccount = {
  id: string;
  email: string | null;
};

export async function getCurrentAccount(): Promise<CurrentAccount | null> {
  if (!hasSupabaseAuthConfiguration()) return null;

  const supabase = await createServerAuthClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) return null;

  return {
    id: data.claims.sub,
    email: typeof data.claims.email === "string" ? data.claims.email : null,
  };
}

export async function requireCurrentAccount(): Promise<CurrentAccount> {
  const account = await getCurrentAccount();
  if (!account) throw new Error("AUTHENTICATION_REQUIRED");
  return account;
}
