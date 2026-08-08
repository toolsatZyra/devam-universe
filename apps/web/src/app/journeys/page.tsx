import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { heroJourneys } from "@/data/hero-experiences";
import styles from "./journeys.module.css";

export const metadata: Metadata = {
  title: "Source journeys · Devam",
  description: "Curated, source-grounded paths through the growing Devam universe.",
};

export default function JourneysPage() {
  return (
    <main className={styles.shell}>
      <div className={styles.atmosphere} aria-hidden="true" />
      <header className={styles.header}>
        <Link className={styles.brand} href="/"><Image src="/brand/devam-mark.png" alt="" width={40} height={40} priority /><span>Devam</span></Link>
        <nav><Link href="/">Atlas</Link><Link href="/sarthi">Sarthi</Link><Link href="/challenges">Challenges</Link><Link href="/search">Library</Link></nav>
      </header>
      <section className={styles.hero}>
        <p>Curated exploration</p>
        <h1>Choose a thread.<br /><em>Enter the source.</em></h1>
        <span>These are coherent paths through exact retained evidence—not claims that the four hero universes are complete.</span>
      </section>
      <section className={styles.cards}>
        {heroJourneys.map((journey, index) => (
          <article className={styles[journey.tone]} key={journey.slug}>
            <div className={styles.cardNumber}>0{index + 1}</div>
            <p>{journey.hero} · {journey.stops.length} stops · {journey.durationMinutes} min</p>
            <h2>{journey.title}</h2>
            <span className={styles.devanagari}>{journey.devanagari}</span>
            <div className={styles.stopPreview}>{journey.stops.slice(0, 4).map((stop) => <span key={stop.id}>{stop.title}</span>)}</div>
            <p className={styles.invitation}>{journey.invitation}</p>
            <Link href={`/journeys/${journey.slug}`}>Begin journey <span>→</span></Link>
          </article>
        ))}
      </section>
      <section className={styles.challengeInvite}>
        <div><p>Mission-based exploration</p><h2>Turn curiosity into a path you can complete.</h2></div>
        <Link href="/challenges">Open challenges</Link>
      </section>
    </main>
  );
}
