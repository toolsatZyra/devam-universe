import Image from "next/image";
import Link from "next/link";
import type { StoryWorldNode } from "@/lib/domain/story-world";
import { journeyEncounterHref, type JourneyEncounterRoute } from "./ramayana-world-encounters";
import styles from "./journey-player.module.css";

export function JourneyEncounter({
  node,
  routes,
  storyMoments,
  trailDepth,
  language,
  onBack,
  onOpenMoment,
  onTravel,
}: {
  node: StoryWorldNode;
  routes: JourneyEncounterRoute[];
  storyMoments: { id: string; ordinal: number; title: string; decisiveChange: string; asset?: string; active: boolean }[];
  trailDepth: number;
  language: "en" | "hi";
  onBack: () => void;
  onOpenMoment: (momentId: string) => void;
  onTravel: (nodeId: string) => void;
}) {
  return <aside className={styles.encounter} aria-live="polite" aria-label={`${node.label} encounter`}>
    <button className={styles.encounterBack} type="button" onClick={onBack}>← {trailDepth > 1 ? (language === "hi" ? "पिछली खोज" : "Previous discovery") : (language === "hi" ? "दृश्य पर लौटें" : "Back to the scene")}</button>
    <div className={styles.encounterIdentity} data-family={node.family}><span aria-hidden="true"/><p><small>{node.kind}</small><strong>{node.label}</strong></p></div>
    <p className={styles.encounterSummary}>{node.summary}</p>
    {storyMoments.length > 0 && <div className={styles.encounterMoments} aria-label={`Story moments involving ${node.label}`}>
      <small>{language === "hi" ? `कथा में ${node.label} से मिलें` : `Meet ${node.label} in the story`}</small>
      <div className={styles.encounterMomentRail}>{storyMoments.map((moment) => <button type="button" aria-current={moment.active ? "step" : undefined} onClick={() => onOpenMoment(moment.id)} key={moment.id}>
          {moment.asset && <span className={styles.encounterMomentArt}><Image alt="" fill sizes="96px" src={moment.asset}/></span>}
          <span className={styles.encounterMomentCopy}><small>{language === "hi" ? `दृश्य ${String(moment.ordinal).padStart(2, "0")}` : `Scene ${String(moment.ordinal).padStart(2, "0")}`}</small><strong>{moment.title}</strong><span>{moment.decisiveChange}</span><i>{moment.active ? (language === "hi" ? "आप यहाँ हैं" : "You are here") : (language === "hi" ? "यह दृश्य देखें →" : "Enter this scene →")}</i></span>
        </button>)}</div>
    </div>}
    {routes.length > 0 && <div className={styles.encounterRoutes} aria-label={`Paths from ${node.label}`}>
      <small>{language === "hi" ? "किसी संबंध के साथ आगे बढ़ें" : "Travel along a relationship"}</small>
      {routes.map((route) => <button type="button" onClick={() => onTravel(route.destination.id)} key={route.id}>
        <span>{route.relation}</span><strong>{route.destination.label}</strong><small>{route.relationKind}{route.sourceRef ? " · source-linked" : ""}</small>
      </button>)}
    </div>}
    <details className={styles.encounterBoundary}>
      <summary>{language === "hi" ? "यह संबंध यहाँ क्यों है" : "Why this connection is here"}</summary>
      <p>{node.evidenceBoundary}</p>
    </details>
    <Link className={styles.encounterLibrary} href={journeyEncounterHref(node)}>{node.gateway ? (language === "hi" ? `${node.label} संसार में प्रवेश करें` : `Enter the ${node.label} world`) : (language === "hi" ? "इसकी सटीक लाइब्रेरी राह खोलें" : "Open its exact library trail")} →</Link>
  </aside>;
}
