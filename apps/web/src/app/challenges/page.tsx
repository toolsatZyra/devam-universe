import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChallengeBoard } from "@/components/experiences/challenge-board";
import styles from "../journeys/journeys.module.css";

export const metadata: Metadata = {
  title: "Exploration challenges · Devam",
  description: "Mission-based paths through source-grounded Devam journeys.",
};

export default function ChallengesPage() {
  return (
    <main className={styles.shell}>
      <div className={styles.atmosphere} aria-hidden="true" />
      <header className={styles.header}>
        <Link className={styles.brand} href="/"><Image src="/brand/devam-mark.png" alt="" width={40} height={40} priority /><span>Devam</span></Link>
        <nav><Link href="/">Atlas</Link><Link href="/sarthi">Sarthi</Link><Link href="/journeys">Journeys</Link><Link href="/search">Library</Link></nav>
      </header>
      <section className={styles.hero}>
        <p>Exploration missions</p>
        <h1>Follow the path.<br /><em>Discover the thread.</em></h1>
        <span>Progress records what you explored. It never assigns spiritual merit or turns devotion into a score.</span>
      </section>
      <section className={styles.challengeBoard}><ChallengeBoard /></section>
    </main>
  );
}
