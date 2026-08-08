"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from "react";
import type { HeroJourney, JourneyStop } from "@/lib/domain/experience";
import { canGuestAskSarthi } from "@/lib/account/guest-preview";
import styles from "./journey-player.module.css";

type JourneySarthiReply = {
  ok: boolean;
  answer?: string;
  message?: string;
  sourceBoundary?: string;
  citations?: { passageId: string; workTitle: string; editionTitle: string }[];
};

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

const storyCopy: Record<string, { kicker: string; story: string; invitation: string }> = {
  "bala-kanda": { kicker: "A prince, a bow, a beginning", story: "A young Rama leaves the palace with the sage Vishvamitra, protects a sacred rite, and meets Sita at the bow that no ordinary prince can lift.", invitation: "Follow the first light" },
  "ayodhya-kanda": { kicker: "The night the kingdom changed", story: "On the eve of Rama's coronation, an old promise sends him into exile. Sita and Lakshmana choose the forest over life without him.", invitation: "Leave Ayodhya" },
  "aranya-kanda": { kicker: "Deeper into the forest", story: "The forest becomes a place of wonder, danger, and loss. A golden deer draws Rama away—and Ravana carries Sita toward Lanka.", invitation: "Trace the broken trail" },
  "kishkindha-kanda": { kicker: "An alliance among the vanaras", story: "Rama meets Hanuman and Sugriva. A friendship is forged, a kingdom is reclaimed, and search parties set out toward every horizon.", invitation: "Join the search" },
  "sundara-kanda": { kicker: "The leap across the ocean", story: "Hanuman crosses the sea, enters Lanka alone, finds Sita in the ashoka grove, and must decide how to approach without deepening her fear.", invitation: "Leap toward Lanka" },
  "yuddha-kanda": { kicker: "The road to Lanka", story: "A bridge rises over the ocean. Armies meet, loyalties are tested, Ravana falls, and Rama and Sita begin the journey home.", invitation: "Cross the bridge" },
  "uttara-kanda": { kicker: "What came after victory", story: "The return is not the end. The later book carries questions of kingship, separation, memory, and the price of public duty.", invitation: "Enter the aftermath" },
  "the-question": { kicker: "A simple question", story: "The Goddess asks how Ganesha may be approached without elaborate austerity. The answer begins a garland of names and images.", invitation: "Listen for the answer" },
  "the-devotional-lens": { kicker: "The remover of obstacles", story: "Ganesha appears as the presence that clears the inner and outer knots standing between a devotee and a worthy beginning.", invitation: "Move closer" },
  "yajna-form": { kicker: "The sacred act itself", story: "The hymn does not place Ganesha outside the offering: he is praised as the giver, the offering, and the transforming fire of the act.", invitation: "Enter the flame" },
  "closing-prayer": { kicker: "A wish for auspiciousness", story: "The garland closes not with spectacle, but with a quiet prayer that what is genuinely sought may ripen toward well-being.", invitation: "Carry the blessing" },
  "context-opening": { kicker: "A kingdom lost", story: "A defeated king and a merchant, both unable to let go of what hurt them, arrive at a forest hermitage seeking to understand their own attachment.", invitation: "Enter the hermitage" },
  "proper-opening": { kicker: "The Goddess awakens", story: "When the gods are overwhelmed, their radiance gathers into a single immeasurable presence. The Devi takes form and the cosmos remembers its power.", invitation: "Witness her arrival" },
  "last-proper-canto": { kicker: "The final battle", story: "After the great battles, the Goddess faces the remaining force that claims she is not truly one. She gathers every emanation back into herself.", invitation: "Stand at the threshold" },
  "context-close": { kicker: "The boon and the return", story: "The tale returns to its listeners. What they ask of the Goddess reveals what each has learned—and what each still desires.", invitation: "Return to the world" },
  vasubaras: { kicker: "The first lamp", story: "The season of lights begins with gratitude for nourishment, care, and the animals whose lives have long been woven into household well-being.", invitation: "Light the first lamp" },
  dhantrayodashi: { kicker: "Health, wealth, and remembrance", story: "Homes prepare for renewal while lamps remember Yama and stories of Dhanvantari turn attention toward health—not merely buying gold.", invitation: "Follow the evening light" },
  "naraka-chaturdashi": { kicker: "Before dawn", story: "Across regions, the morning carries different stories: liberation from Naraka, ritual bathing, protection, and the fierce clearing of what must not follow us.", invitation: "Enter the blue hour" },
  "lakshmi-pujan": { kicker: "The night of radiance", story: "Lamps gather at thresholds and shrines. Some households welcome Lakshmi; in Bengal, the same night opens toward Kali. The lights do not erase their difference.", invitation: "Cross the luminous threshold" },
  "bali-govardhan": { kicker: "New worlds after the night", story: "The next day branches into stories of Bali, Govardhan, Annakut, the Gujarati new year, and Balipadyami—many worlds sharing one dawn.", invitation: "Choose a path" },
  "bhau-beej": { kicker: "A bond renewed", story: "The constellation closes around siblings and chosen kin: hospitality, blessing, memory, and the promise to remain present for one another.", invitation: "Complete the circle" },
};

function sceneCopy(stop: JourneyStop) {
  return storyCopy[stop.id] ?? { kicker: stop.eyebrow, story: stop.summary, invitation: "Continue the journey" };
}

function locatorLabel(locator: Record<string, unknown>) {
  if (typeof locator.book === "number" && typeof locator.sarga === "number") return `Book ${locator.book} · Sarga ${locator.sarga}`;
  if (typeof locator.source_chapter === "number") return `Chapter ${locator.source_chapter}`;
  if (typeof locator.literal_marker === "string") return `Source unit ${locator.literal_marker}`;
  return "Exact source span";
}

export function JourneyPlayer({ journey, account }: { journey: HeroJourney; account: { signedIn: boolean; label: string } }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [explored, setExplored] = useState<string[]>([]);
  const [showGuide, setShowGuide] = useState(true);
  const [sarthiOpen, setSarthiOpen] = useState(false);
  const [sarthiInput, setSarthiInput] = useState("");
  const [askedQuestion, setAskedQuestion] = useState("");
  const [sarthiReply, setSarthiReply] = useState<JourneySarthiReply | null>(null);
  const [sarthiBusy, setSarthiBusy] = useState(false);
  const [accountPrompt, setAccountPrompt] = useState(false);
  const guestExchanges = useRef(0);

  useEffect(() => {
    const saved = readProgress(journey.slug);
    const sync = window.setTimeout(() => {
      setExplored(saved);
      const next = journey.stops.findIndex((stop) => !saved.includes(stop.id));
      if (next >= 0) setActiveIndex(next);
    }, 0);
    const guide = window.setTimeout(() => setShowGuide(false), 4500);
    return () => { window.clearTimeout(sync); window.clearTimeout(guide); };
  }, [journey]);

  useEffect(() => {
    if (account.signedIn) return;
    try {
      const value = Number(window.localStorage.getItem("devam-guest-sarthi-exchanges") ?? "0");
      guestExchanges.current = Number.isSafeInteger(value) && value > 0 ? value : 0;
    } catch {
      guestExchanges.current = 0;
    }
  }, [account.signedIn]);

  const active = journey.stops[activeIndex];
  const copy = sceneCopy(active);
  const exploredSet = useMemo(() => new Set(explored), [explored]);
  const complete = explored.length === journey.stops.length;

  function travelTo(index: number) {
    setActiveIndex(index);
    setShowGuide(false);
  }

  function continueJourney() {
    const nextExplored = exploredSet.has(active.id) ? explored : [...explored, active.id];
    setExplored(nextExplored);
    window.localStorage.setItem(journeyProgressKey(journey.slug), JSON.stringify(nextExplored));
    if (activeIndex < journey.stops.length - 1) travelTo(activeIndex + 1);
  }

  async function askSarthi(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = sarthiInput.trim();
    if (question.length < 2 || sarthiBusy) return;
    if (!canGuestAskSarthi(guestExchanges.current, account.signedIn)) {
      setAccountPrompt(true);
      return;
    }
    setAskedQuestion(question);
    setSarthiReply(null);
    setSarthiBusy(true);
    setSarthiInput("");
    try {
      const response = await fetch("/api/sarthi", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: question, context: { atlasNodeSlug: active.id } }),
      });
      const reply = await response.json() as JourneySarthiReply;
      setSarthiReply(reply);
      if (response.ok && !account.signedIn) {
        guestExchanges.current += 1;
        try { window.localStorage.setItem("devam-guest-sarthi-exchanges", String(guestExchanges.current)); } catch { /* Session state still gates the chat. */ }
      }
    } catch {
      setSarthiReply({ ok: false, message: "I could not reach Devam's evidence service. Please try again." });
    } finally {
      setSarthiBusy(false);
    }
  }

  const sceneStyle = {
    "--path-offset": `${activeIndex * -230 - 115}px`,
    "--path-width": `${journey.stops.length * 230}px`,
  } as CSSProperties;

  return (
    <main className={styles.shell} data-tone={journey.tone} style={sceneStyle}>
      <div className={styles.space} aria-hidden="true"><span/><span/><span/></div>
      <header className={styles.hud}>
        <Link className={styles.brand} href="/">
          <Image src="/brand/devam-mark.png" alt="" width={38} height={38} priority />
          <span><strong>Devam</strong><small>Return to the universe</small></span>
        </Link>
        <div className={styles.worldName}><small>{journey.hero} world</small><strong>{journey.title}</strong></div>
        <button className={styles.sarthi} type="button" onClick={() => { setSarthiOpen(true); setSarthiInput(`Tell me the story of ${active.title}`); }}>✦ <span>Ask Sārthi</span></button>
      </header>

      <section className={styles.viewport} aria-label={`${journey.hero} story world`}>
        <div className={styles.horizon} aria-hidden="true" />
        <div className={styles.storyPath} role="list" aria-label="Story scenes">
          {journey.stops.map((stop, index) => {
            const selected = index === activeIndex;
            const visited = exploredSet.has(stop.id);
            return (
              <button
                type="button"
                role="listitem"
                className={`${styles.storyNode} ${selected ? styles.storyNodeActive : ""} ${visited ? styles.storyNodeVisited : ""}`}
                style={{ "--node-x": `${index * 230}px`, "--node-y": `${95 + (index % 2) * 62}px`, "--z": `${(index % 3) * 34}px` } as CSSProperties}
                onClick={() => travelTo(index)}
                aria-current={selected ? "step" : undefined}
                aria-label={`${stop.ordinal}. ${stop.title}`}
                key={stop.id}
              >
                <span className={styles.nodeOrbit}/><span className={styles.nodeGlow}/><span className={styles.nodeCore}/>
                <span className={styles.nodeCopy}><small>{String(stop.ordinal).padStart(2, "0")}</small><strong>{stop.title}</strong></span>
              </button>
            );
          })}
        </div>
      </section>

      <section className={styles.storyBeat} aria-live="polite">
        <p>{copy.kicker}</p>
        <h1>{active.title}</h1>
        <span>{copy.story}</span>
        <div className={styles.actions}>
          <button type="button" onClick={continueJourney}>{activeIndex === journey.stops.length - 1 ? "Complete this path" : copy.invitation}<span>→</span></button>
          {activeIndex > 0 && <button type="button" onClick={() => travelTo(activeIndex - 1)}>Back</button>}
        </div>
        <details className={styles.sourceDetails}>
          <summary>Story source</summary>
          <strong>{active.citation.workTitle}</strong>
          <span>{active.citation.editionTitle} · {locatorLabel(active.citation.locator)}</span>
          <small>{journey.sourceBoundary}</small>
        </details>
      </section>

      <div className={styles.progress} aria-label={`${explored.length} of ${journey.stops.length} scenes explored`}>
        {journey.stops.map((stop, index) => <button type="button" aria-label={`Go to scene ${index + 1}`} onClick={() => travelTo(index)} className={index === activeIndex ? styles.progressActive : exploredSet.has(stop.id) ? styles.progressVisited : ""} key={stop.id} />)}
      </div>

      {showGuide && <p className={styles.guide}>Choose a light to move through the story</p>}
      {complete && <div className={styles.complete}><span>Path discovered</span><strong>The universe continues beyond this route.</strong><Link href="/">Return to the stars</Link></div>}
      {sarthiOpen && <button className={styles.scrim} type="button" onClick={() => setSarthiOpen(false)} aria-label="Close Sarthi" />}
      <aside className={`${styles.sarthiPanel} ${sarthiOpen ? styles.sarthiPanelOpen : ""}`} aria-hidden={!sarthiOpen} aria-label="Sarthi conversation">
        <header><div><span>✦</span><p><strong>Sārthi</strong><small>Companion inside this story</small></p></div><button type="button" onClick={() => setSarthiOpen(false)} aria-label="Close Sarthi">×</button></header>
        <div className={styles.chatTranscript} aria-live="polite">
          <small>Exploring · {active.title}</small>
          <p className={styles.sarthiMessage}>Ask me about this moment, the people in it, or where the story moves next.</p>
          {askedQuestion && <p className={styles.userMessage}>{askedQuestion}</p>}
          {sarthiBusy && <p className={styles.sarthiMessage}>Looking through Devam&apos;s evidence…</p>}
          {sarthiReply && <div className={styles.sarthiMessage}>{sarthiReply.ok ? sarthiReply.answer : sarthiReply.message}{sarthiReply.citations?.length ? <details><summary>Sources</summary>{sarthiReply.citations.map((citation) => <p key={citation.passageId}><strong>{citation.workTitle}</strong><small>{citation.editionTitle}</small></p>)}</details> : null}</div>}
          {accountPrompt && <div className={styles.accountPrompt}><strong>Continue with your account</strong><span>Your guest Sārthi exchange is complete.</span><Link href="/account">Sign in to keep talking</Link></div>}
        </div>
        <form className={styles.chatComposer} onSubmit={askSarthi}><label className="srOnly" htmlFor="journey-sarthi-message">Message Sarthi</label><textarea id="journey-sarthi-message" value={sarthiInput} onChange={(event) => setSarthiInput(event.target.value)} placeholder={`Ask about ${active.title}…`} rows={2} /><button type="submit" disabled={sarthiBusy || sarthiInput.trim().length < 2}>Send</button></form>
      </aside>
    </main>
  );
}
