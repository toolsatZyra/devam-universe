"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { heroChallenges, heroJourneys } from "@/data/hero-experiences";
import { journeyProgressKey } from "./journey-progress";
import styles from "./journey-player.module.css";

export function ChallengeBoard() {
  const [progress, setProgress] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const sync = window.setTimeout(() => {
      const next: Record<string, string[]> = {};
      for (const journey of heroJourneys) {
        try {
          const parsed = JSON.parse(window.localStorage.getItem(journeyProgressKey(journey.slug)) ?? "[]");
          next[journey.slug] = Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
        } catch {
          next[journey.slug] = [];
        }
      }
      setProgress(next);
    }, 0);
    return () => window.clearTimeout(sync);
  }, []);

  return (
    <div className={styles.challengeGrid}>
      {heroChallenges.map((challenge) => {
        const completeCount = challenge.requiredStopIds.filter((id) => progress[challenge.journeySlug]?.includes(id)).length;
        const complete = completeCount === challenge.requiredStopIds.length;
        const percent = Math.round((completeCount / challenge.requiredStopIds.length) * 100);
        return (
          <article key={challenge.slug}>
            <div className={styles.challengeTop}><span>{complete ? "Complete" : "Active mission"}</span><strong>{completeCount}/{challenge.requiredStopIds.length}</strong></div>
            <h2>{challenge.title}</h2>
            <p>{challenge.mission}</p>
            <div className={styles.challengeProgress}><i style={{ width: `${percent}%` }} /></div>
            <small>{complete ? challenge.rewardLabel : "Exploration progress is stored on this device."}</small>
            <Link href={`/journeys/${challenge.journeySlug}`}>{completeCount ? "Continue exploring" : "Begin challenge"}</Link>
          </article>
        );
      })}
    </div>
  );
}
