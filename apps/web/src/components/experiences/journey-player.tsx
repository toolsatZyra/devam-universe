"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { HeroJourney } from "@/lib/domain/experience";
import styles from "./journey-player.module.css";

export function journeyProgressKey(slug: string) {
  return `devam-journey-progress:${slug}`;
}

function readProgress(slug: string): string[] {
  try {
    const value = JSON.parse(window.localStorage.getItem(journeyProgressKey(slug)) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function locatorLabel(locator: Record<string, unknown>) {
  if (typeof locator.book === "number" && typeof locator.sarga === "number") return `Kāṇḍa ${locator.book} · sarga ${locator.sarga}`;
  if (typeof locator.book === "number" && typeof locator.literal_canto_marker === "string") return `Book ${locator.book} · Canto ${locator.literal_canto_marker}`;
  if (typeof locator.source_chapter === "number") return `Mārkaṇḍeyapurāṇa chapter ${locator.source_chapter}`;
  if (typeof locator.literal_marker === "string") return `Source unit ${locator.literal_marker}`;
  return "Exact source span";
}

export function JourneyPlayer({ journey }: { journey: HeroJourney }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [explored, setExplored] = useState<string[]>([]);

  useEffect(() => {
    const saved = readProgress(journey.slug);
    const sync = window.setTimeout(() => {
      setExplored(saved);
      const next = journey.stops.findIndex((stop) => !saved.includes(stop.id));
      if (next >= 0) setActiveIndex(next);
    }, 0);
    return () => window.clearTimeout(sync);
  }, [journey]);

  const active = journey.stops[activeIndex];
  const complete = explored.length === journey.stops.length;
  const percent = Math.round((explored.length / journey.stops.length) * 100);
  const sourceIsPrivate = active.citation.rightsLane === "private_evidence";
  const exploredSet = useMemo(() => new Set(explored), [explored]);

  function markExplored() {
    const next = exploredSet.has(active.id) ? explored : [...explored, active.id];
    setExplored(next);
    window.localStorage.setItem(journeyProgressKey(journey.slug), JSON.stringify(next));
    if (activeIndex < journey.stops.length - 1) setActiveIndex(activeIndex + 1);
  }

  return (
    <main className={styles.shell} data-tone={journey.tone}>
      <div className={styles.atmosphere} aria-hidden="true" />
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          <Image src="/brand/devam-mark.png" alt="" width={40} height={40} priority />
          <span>Devam</span>
        </Link>
        <nav><Link href="/journeys">All journeys</Link><Link href="/sarthi">Ask Sarthi</Link><Link href="/challenges">Challenges</Link></nav>
      </header>

      <section className={styles.intro}>
        <div>
          <p>{journey.hero} · Source journey</p>
          <h1>{journey.title}</h1>
          <span className={styles.devanagari}>{journey.devanagari}</span>
        </div>
        <div className={styles.progressCard}>
          <strong>{explored.length}/{journey.stops.length}</strong>
          <span>stops explored</span>
          <div><i style={{ width: `${percent}%` }} /></div>
        </div>
      </section>

      <section className={styles.player}>
        <div className={styles.path} aria-label="Journey stops">
          {journey.stops.map((stop, index) => (
            <button
              className={index === activeIndex ? styles.activeStop : exploredSet.has(stop.id) ? styles.exploredStop : ""}
              key={stop.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-current={index === activeIndex ? "step" : undefined}
            >
              <span>{exploredSet.has(stop.id) ? "✓" : String(index + 1).padStart(2, "0")}</span>
              <div><small>{stop.eyebrow}</small><strong>{stop.title}</strong></div>
            </button>
          ))}
        </div>

        <article className={styles.stopCard}>
          <div className={styles.stopOrdinal}>{String(active.ordinal).padStart(2, "0")}</div>
          <p className={styles.eyebrow}>{active.eyebrow}</p>
          <h2>{active.title}</h2>
          <p className={styles.summary}>{active.summary}</p>
          {active.citation.quotation && <blockquote>{active.citation.quotation}</blockquote>}
          {active.feature && (
            <aside className={styles.feature}>
              <small>{active.feature.eyebrow}</small>
              <h3>{active.feature.title}</h3>
              <p>{active.feature.summary}</p>
              <strong>{active.feature.reflection}</strong>
              <details>
                <summary>Open the two-source crosswalk</summary>
                {active.feature.citations.map((citation) => (
                  <div key={`${citation.sourceSha256}:${citation.sourceOrdinal}`}>
                    <span>{citation.workTitle} · {locatorLabel(citation.locator)} · source ordinal {citation.sourceOrdinal}</span>
                    <code>Span SHA-256 {citation.spanSha256}</code>
                  </div>
                ))}
                <p>{active.feature.sourceBoundary}</p>
              </details>
              <Link href={{ pathname: "/search", query: { query: active.feature.searchQuery } }}>Explore this episode</Link>
            </aside>
          )}
          <details className={styles.sourceDetails}>
            <summary>Open source identity</summary>
            <div>
              <strong>{active.citation.workTitle}</strong>
              <span>{active.citation.editionTitle}</span>
              <span>{locatorLabel(active.citation.locator)} · source ordinal {active.citation.sourceOrdinal}</span>
              <code>SHA-256 {active.citation.sourceSha256}</code>
              <small>{sourceIsPrivate ? "Internal evidence only · no source quotation exposed" : "Derivative-allowed source passage"}</small>
            </div>
          </details>
          <button className={styles.continueButton} type="button" onClick={markExplored}>
            {exploredSet.has(active.id) ? activeIndex === journey.stops.length - 1 ? "Keep this stop explored" : "Continue to the next stop" : "Mark explored and continue"}
          </button>
        </article>
      </section>

      {complete && (
        <section className={styles.completion} aria-live="polite">
          <span>Source thread discovered</span>
          <h2>You completed this bounded path.</h2>
          <p>That records exploration—not spiritual merit and not completion of the {journey.hero} universe.</p>
          <Link href="/challenges">View your challenges</Link>
        </section>
      )}

      <aside className={styles.boundary}><strong>Journey boundary</strong><p>{journey.sourceBoundary}</p></aside>
    </main>
  );
}
