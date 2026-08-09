import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHeroJourney, heroJourneys } from "@/data/hero-experiences";
import { JourneyPlayer } from "@/components/experiences/journey-player";
import { buildRamayanaStoryWorldPack } from "@/data/ramayana-story-world";
import { getCurrentAccount } from "@/lib/supabase/auth-session";

export function generateStaticParams() {
  return heroJourneys.map((journey) => ({ slug: journey.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const journey = getHeroJourney((await params).slug);
  return journey ? { title: `${journey.title} · Devam`, description: journey.invitation } : {};
}

export default async function JourneyPage({ params }: { params: Promise<{ slug: string }> }) {
  const journey = getHeroJourney((await params).slug);
  if (!journey) notFound();
  const account = await getCurrentAccount();
  const storyWorld = journey.slug === "ramayana" ? buildRamayanaStoryWorldPack() : null;
  return <JourneyPlayer journey={journey} storyWorld={storyWorld} account={{ signedIn: Boolean(account), label: account?.email?.slice(0, 2).toUpperCase() ?? "ME" }} />;
}
