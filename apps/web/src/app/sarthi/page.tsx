import type { Metadata } from "next";
import { SarthiConversation } from "@/components/sarthi/sarthi-conversation";
import { getCurrentAccount } from "@/lib/supabase/auth-session";

export const metadata: Metadata = {
  title: "Sarthi · Devam",
  description: "A source-grounded companion for Indian wisdom, practice, and exploration.",
};

export default async function SarthiPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; node?: string }>;
}) {
  const [account, params] = await Promise.all([getCurrentAccount(), searchParams]);
  return (
    <SarthiConversation
      account={{ signedIn: Boolean(account), label: account?.email?.slice(0, 2).toUpperCase() ?? "ME" }}
      initialPrompt={typeof params.q === "string" ? params.q.slice(0, 8000) : ""}
      atlasNodeSlug={typeof params.node === "string" && /^[a-z0-9-]{1,100}$/.test(params.node) ? params.node : undefined}
    />
  );
}
