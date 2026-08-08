"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { parseProfileForm, validateEmailAddress } from "@/lib/account/profile-input";
import { createServerAuthClient, hasSupabaseAuthConfiguration } from "@/lib/supabase/auth-server";
import { requireCurrentAccount } from "@/lib/supabase/auth-session";
import type { AccountActionState } from "./account-state";

async function requestOrigin(): Promise<string> {
  const configured = process.env.DEVAM_SITE_URL?.trim();
  if (configured) return new URL(configured).origin;

  if (process.env.NODE_ENV === "production") throw new Error("SITE_ORIGIN_UNAVAILABLE");

  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  if (!host) throw new Error("SITE_ORIGIN_UNAVAILABLE");
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
  const protocol = forwardedProtocol === "http" || forwardedProtocol === "https"
    ? forwardedProtocol
    : host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
  return new URL(`${protocol}://${host}`).origin;
}

export async function requestMagicLink(
  _previous: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  if (!hasSupabaseAuthConfiguration()) {
    return { status: "error", message: "Account sign-in is not configured in this environment yet." };
  }

  let email: string;
  try {
    email = validateEmailAddress(formData.get("email"));
  } catch {
    return { status: "error", message: "Enter a valid email address." };
  }

  try {
    const supabase = await createServerAuthClient();
    const origin = await requestOrigin();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/account`,
        shouldCreateUser: true,
      },
    });
    if (error) return { status: "error", message: "We could not send the sign-in link. Please try again shortly." };
    return { status: "success", message: "Check your email for a secure Devam sign-in link." };
  } catch {
    return { status: "error", message: "Account sign-in is temporarily unavailable." };
  }
}

export async function saveProfile(
  _previous: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  let input;
  try {
    input = parseProfileForm(formData);
  } catch {
    return { status: "error", message: "One of the profile fields is invalid or too long." };
  }

  try {
    const account = await requireCurrentAccount();
    const supabase = await createServerAuthClient();
    const { error } = await supabase.from("profiles").upsert({
      id: account.id,
      display_name: input.displayName,
      preferred_language: input.preferredLanguage,
      home_location: input.homeLocation,
      sampradaya_code: input.sampradayaCode,
      family_practice: input.familyPractice,
      personalization_consent: input.personalizationConsent,
      updated_at: new Date().toISOString(),
    }, { onConflict: "id" });
    if (error) return { status: "error", message: "Your profile could not be saved. Please try again." };
    revalidatePath("/account");
    return { status: "success", message: "Your Sarthi context has been saved." };
  } catch {
    return { status: "error", message: "Please sign in again before saving your profile." };
  }
}

export async function deleteAllMemories() {
  const account = await requireCurrentAccount();
  const supabase = await createServerAuthClient();
  const { error } = await supabase.from("user_memories").delete().eq("user_id", account.id);
  if (error) redirect("/account?memory=delete-failed");
  revalidatePath("/account");
  redirect("/account?memory=deleted");
}

export async function signOut() {
  if (hasSupabaseAuthConfiguration()) {
    const supabase = await createServerAuthClient();
    await supabase.auth.signOut({ scope: "local" });
  }
  redirect("/");
}
