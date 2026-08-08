import { AtlasShell } from "@/components/atlas/atlas-shell";
import { getAtlasRepository } from "@/lib/repositories/atlas";
import { getCurrentAccount } from "@/lib/supabase/auth-session";

export default async function Home() {
  const [world, account] = await Promise.all([
    getAtlasRepository().getWorld(),
    getCurrentAccount(),
  ]);
  const accountLabel = account?.email?.slice(0, 2).toUpperCase() ?? "ME";
  return <AtlasShell {...world} account={{ signedIn: Boolean(account), label: accountLabel }} />;
}
