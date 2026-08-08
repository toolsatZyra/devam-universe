import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SignInForm, ProfileForm } from "./account-forms";
import { deleteAllMemories, signOut } from "./actions";
import { createServerAuthClient } from "@/lib/supabase/auth-server";
import { getCurrentAccount } from "@/lib/supabase/auth-session";
import type { Json } from "@/lib/supabase/database.types";
import { resolveDevamEntitlement } from "@/lib/account/subscription-entitlement";
import styles from "./account.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Devam · Account",
  description: "Control the context and memories that personalize Sarthi.",
};

function jsonObject(value: Json | null): Record<string, Json | undefined> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, Json | undefined> : {};
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const account = await getCurrentAccount();
  const params = await searchParams;

  if (!account) {
    return (
      <main className={styles.shell}>
        <div className={styles.cosmos} aria-hidden="true" />
        <header className={styles.header}><Link href="/"><Image src="/brand/devam-mark.png" alt="" width={42} height={42} priority /><span>Devam</span></Link><Link href="/">Return to Atlas</Link></header>
        <section className={styles.signInCard}>
          <p>Your place in the universe</p>
          <h1>Explore freely.<br /><em>Return without losing your path.</em></h1>
          <span>An account saves journeys, language, location, family practice, and—only with your consent—the context that helps Sarthi know you better.</span>
          <SignInForm />
          <Link className={styles.guestLink} href="/">Continue the guest preview</Link>
        </section>
      </main>
    );
  }

  const supabase = await createServerAuthClient();
  const subscriptionQuery = process.env.DEVAM_SUBSCRIPTIONS_ENABLED === "true"
    ? supabase.from("subscriptions").select("plan_code, status, current_period_end, cancel_at_period_end").eq("user_id", account.id).maybeSingle()
    : Promise.resolve({ data: null });
  const [{ data: profile }, { data: memories }, { data: subscription }] = await Promise.all([
    supabase.from("profiles").select("display_name, preferred_language, home_location, sampradaya_code, family_practice, personalization_consent").eq("id", account.id).maybeSingle(),
    supabase.from("user_memories").select("id, memory_kind, value, user_confirmed, created_at").eq("user_id", account.id).order("created_at", { ascending: false }),
    subscriptionQuery,
  ]);
  const entitlement = resolveDevamEntitlement(subscription);

  const homeLocation = jsonObject(profile?.home_location ?? null);
  const familyPractice = jsonObject(profile?.family_practice ?? null);
  const memoryDeleted = params.memory === "deleted";

  return (
    <main className={styles.shell}>
      <div className={styles.cosmos} aria-hidden="true" />
      <header className={styles.header}><Link href="/"><Image src="/brand/devam-mark.png" alt="" width={42} height={42} priority /><span>Devam</span></Link><nav><Link href="/">Atlas</Link><Link href="/today">Today</Link><Link href="/search">Library</Link></nav></header>
      <section className={styles.accountHero}>
        <p>Your Devam</p>
        <h1>{profile?.display_name ? `Namaste, ${profile.display_name}.` : "Namaste."}</h1>
        <span>{account.email}</span>
      </section>
      <section className={styles.subscriptionPanel}>
        <div>
          <p>Your access</p>
          <h2>{entitlement.premiumAccess ? "Devam One" : "Free beta"}</h2>
          <span>{entitlement.premiumAccess ? "Your single Devam subscription unlocks the sustained Sarthi and full-universe experience." : "The beta remains open while secure checkout and the single Devam One subscription are being connected."}</span>
        </div>
        <strong>{entitlement.premiumAccess ? "Active" : "No charge"}</strong>
      </section>
      <div className={styles.accountGrid}>
        <section className={styles.panel}>
          <div className={styles.panelHeading}><div><p>Personal context</p><h2>Help Sarthi understand you</h2></div><span>Private to your account</span></div>
          <ProfileForm defaults={{
            displayName: profile?.display_name ?? "",
            preferredLanguage: profile?.preferred_language ?? "",
            city: typeof homeLocation.city === "string" ? homeLocation.city : "",
            practiceRegion: typeof homeLocation.practiceRegion === "string" ? homeLocation.practiceRegion : "",
            sampradayaCode: profile?.sampradaya_code ?? "",
            familyPractice: typeof familyPractice.notes === "string" ? familyPractice.notes : "",
            personalizationConsent: profile?.personalization_consent ?? false,
          }} />
        </section>
        <section className={styles.panel}>
          <div className={styles.panelHeading}><div><p>Memory controls</p><h2>What Sarthi remembers</h2></div><span>{memories?.length ?? 0} saved</span></div>
          {memoryDeleted ? <p className={styles.success}>Saved memories were deleted.</p> : null}
          {memories?.length ? (
            <div className={styles.memoryList}>{memories.map((memory) => <article key={memory.id}><strong>{memory.memory_kind.replaceAll("_", " ")}</strong><p>{JSON.stringify(memory.value)}</p><small>{memory.user_confirmed ? "Confirmed by you" : "Not yet confirmed"}</small></article>)}</div>
          ) : <div className={styles.emptyState}><strong>Nothing saved yet.</strong><p>Sarthi will not build persistent memory unless you enable personalization and a conversation explicitly creates a memory.</p></div>}
          <div className={styles.controlRow}>
            <a className={styles.secondaryButton} href="/api/account/export" download>Export my data</a>
            <form action={deleteAllMemories}><button className={styles.dangerButton} type="submit" disabled={!memories?.length}>Delete memories</button></form>
          </div>
        </section>
      </div>
      <section className={styles.sessionBar}><div><strong>Signed in securely</strong><span>Your source-library access is unchanged by account personalization.</span></div><form action={signOut}><button type="submit">Sign out</button></form></section>
    </main>
  );
}
