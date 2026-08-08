export type HeroSlug = "ramayana" | "ganesha" | "durga" | "diwali";
export type ExperienceRightsLane = "private_evidence" | "derivative_allowed";

export type ExperienceCitation = {
  sourceSha256: string;
  sourceOrdinal: number;
  spanSha256: string;
  workTitle: string;
  editionTitle: string;
  languageCode: string;
  rightsLane: ExperienceRightsLane;
  locator: Record<string, unknown>;
  quotation?: string;
};

export type JourneyStop = {
  id: string;
  ordinal: number;
  title: string;
  eyebrow: string;
  summary: string;
  citation: ExperienceCitation;
  feature?: {
    id: string;
    eyebrow: string;
    title: string;
    summary: string;
    reflection: string;
    citations: ExperienceCitation[];
    sourceBoundary: string;
    searchQuery: string;
  };
};

export type HeroJourney = {
  slug: HeroSlug;
  hero: string;
  devanagari: string;
  title: string;
  invitation: string;
  durationMinutes: number;
  tone: "saffron" | "moon" | "rose" | "gold";
  sourceBoundary: string;
  completeHeroUniverse: false;
  stops: JourneyStop[];
};

export type HeroChallenge = {
  slug: string;
  journeySlug: HeroSlug;
  title: string;
  mission: string;
  requiredStopIds: string[];
  rewardLabel: string;
  spiritualScore: false;
};
