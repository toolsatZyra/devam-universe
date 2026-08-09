"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { StoryLivingPortal } from "@/lib/domain/story-world";
import styles from "./journey-player.module.css";

type LivingWorldResponse = { ok: true; portal: StoryLivingPortal } | { ok: false; code: string };
type LoadedPortal = { key: string; portal: StoryLivingPortal };
type LaneSelection = { key: string; laneId: string };

export function JourneyLivingPortal({
  language,
  nodeId,
  onTravel,
}: {
  language: "en" | "hi";
  nodeId: string;
  onTravel: (nodeId: string) => void;
}) {
  const [loadedPortal, setLoadedPortal] = useState<LoadedPortal | null>(null);
  const [laneSelection, setLaneSelection] = useState<LaneSelection | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [failedKey, setFailedKey] = useState<string | null>(null);
  const portalRef = useRef<HTMLElement | null>(null);
  const requestKey = `${nodeId}:${language}:${loadAttempt}`;

  function resetEncounterScroll() {
    requestAnimationFrame(() => portalRef.current?.parentElement?.scrollTo({ top: 0, behavior: "smooth" }));
  }

  useEffect(() => {
    const controller = new AbortController();

    void fetch(`/api/living-world?nodeId=${encodeURIComponent(nodeId)}&languageCode=${language}`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json() as LivingWorldResponse;
        if (!response.ok || !result.ok) throw new Error("Living world unavailable");
        setLoadedPortal({ key: requestKey, portal: result.portal });
      })
      .catch((reason: unknown) => {
        if (!(reason instanceof DOMException && reason.name === "AbortError")) setFailedKey(requestKey);
      });

    return () => controller.abort();
  }, [language, nodeId, requestKey]);

  const portalLabel = language === "hi" ? "रामायण से जीवंत दीपावली" : "Ramayana to living Diwali";
  const portal = loadedPortal?.key === requestKey ? loadedPortal.portal : null;
  const error = failedKey === requestKey;
  if (error) return <section ref={portalRef} className={styles.livingPortal} aria-label={portalLabel}>
    <small>{language === "hi" ? "जीवंत भारत" : "Living India"}</small>
    <p className={styles.livingPortalInvitation}>{language === "hi" ? "यह जीवंत मार्ग अभी नहीं खुल सका। आपकी कथा-यात्रा सुरक्षित है।" : "This living path could not open yet. Your place in the story is safe."}</p>
    <button className={styles.livingTravel} type="button" onClick={() => setLoadAttempt((attempt) => attempt + 1)}>{language === "hi" ? "फिर से खोलें" : "Try opening again"}</button>
  </section>;

  if (!portal) return <section ref={portalRef} className={styles.livingPortal} aria-label={portalLabel} aria-busy="true">
    <small>{language === "hi" ? "जीवंत भारत खुल रहा है…" : "Opening living India…"}</small>
  </section>;

  const selectedLane = laneSelection?.key === requestKey
    ? portal.lanes.find((lane) => lane.id === laneSelection.laneId) ?? null
    : null;
  if (selectedLane) {
    return <section ref={portalRef} className={styles.livingPortal} aria-label={`${selectedLane.title} living-practice lane`}>
      <button className={styles.livingPortalBack} type="button" onClick={() => { setLaneSelection(null); resetEncounterScroll(); }}>← {language === "hi" ? "दीपावली के जीवंत मार्ग" : "Living Diwali paths"}</button>
      <div className={styles.livingLaneArt} data-crop={selectedLane.crop}>
        <Image alt="" fill priority sizes="360px" src={portal.asset}/>
      </div>
      <small>{selectedLane.region}</small>
      <h2>{selectedLane.title}</h2>
      <p className={styles.livingLaneSummary}>{selectedLane.summary}</p>

      <div className={styles.livingStoryBlock}>
        <small>{language === "hi" ? "इस मार्ग का अर्थ" : "Why this lane matters"}</small>
        <p>{selectedLane.significance}</p>
      </div>
      <details className={styles.livingDisclosure}>
        <summary>{language === "hi" ? "इस मार्ग की स्रोत-आधारित कथा" : "The source-labelled story in this lane"}</summary>
        <p>{selectedLane.originStory}</p>
      </details>
      <div className={styles.livingPracticeBlock}>
        <small>{language === "hi" ? "आज लोग क्या कर सकते हैं" : "What people may do today"}</small>
        <ul>{selectedLane.typicalPractices.map((practice) => <li key={practice}>{practice}</li>)}</ul>
      </div>
      <details className={styles.livingDisclosure}>
        <summary>{selectedLane.minimumForm.label} · {language === "hi" ? `लगभग ${selectedLane.minimumForm.estimatedMinutes} मिनट` : `about ${selectedLane.minimumForm.estimatedMinutes} minutes`}</summary>
        {selectedLane.minimumForm.materials.length > 0 && <p><strong>{language === "hi" ? "सामग्री या विकल्प:" : "Materials or substitutions:"}</strong> {selectedLane.minimumForm.materials.join(" · ")}</p>}
        <ol>{selectedLane.minimumForm.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        <p>{selectedLane.familyPracticeNote}</p>
      </details>
      <details className={styles.livingDisclosure}>
        <summary>{language === "hi" ? "स्रोत और सीमा" : "Evidence and boundary"}</summary>
        <p>{portal.evidenceBoundary}</p>
        <code>{selectedLane.evidence.packId}</code>
        <small>{selectedLane.evidence.sourceCount} {language === "hi" ? "स्रोत · हैश-बद्ध पैक" : "sources · hash-bound pack"}</small>
      </details>
      <button className={styles.livingTravel} type="button" onClick={() => onTravel(selectedLane.nodeId)}>{language === "hi" ? `${selectedLane.title} से आगे जाएँ` : `Travel onward from ${selectedLane.title}`} →</button>
    </section>;
  }

  return <section ref={portalRef} className={styles.livingPortal} aria-label={portalLabel}>
    <div className={styles.livingPortalHero}>
      <Image alt="" fill priority sizes="360px" src={portal.asset}/>
      <span><small>{language === "hi" ? "जीवंत भारत" : "Living India"}</small><strong>{portal.title}</strong></span>
    </div>
    <p className={styles.livingPortalInvitation}>{portal.invitation}</p>
    <div className={styles.livingConnection}><small>{language === "hi" ? "कथा का संबंध" : "The story connection"}</small><p>{portal.storyConnection}</p></div>
    <div className={styles.livingLaneGrid} aria-label={language === "hi" ? "तीन अलग जीवंत दीपावली मार्ग" : "Three distinct living Diwali paths"}>
      {portal.lanes.map((lane) => <button type="button" onClick={() => { setLaneSelection({ key: requestKey, laneId: lane.id }); resetEncounterScroll(); }} key={lane.id} aria-label={`${lane.region} · ${lane.title} · ${language === "hi" ? "यह जीवंत मार्ग देखें" : "Enter this living path"}`}>
        <span className={styles.livingLaneThumb} data-crop={lane.crop}><Image alt="" fill sizes="150px" src={portal.asset}/></span>
        <span><small>{lane.region}</small><strong>{lane.title}</strong><i>{language === "hi" ? "यह मार्ग देखें →" : "Enter this living path →"}</i></span>
      </button>)}
    </div>
    <p className={styles.livingPortalBoundary}>{portal.evidenceBoundary}</p>
  </section>;
}
