import Link from "next/link";
import type { StoryWorldNode } from "@/lib/domain/story-world";
import { journeyEncounterHref, type JourneyEncounterRoute } from "./ramayana-world-encounters";
import styles from "./journey-player.module.css";

export function JourneyEncounter({
  node,
  routes,
  trailDepth,
  onBack,
  onTravel,
}: {
  node: StoryWorldNode;
  routes: JourneyEncounterRoute[];
  trailDepth: number;
  onBack: () => void;
  onTravel: (nodeId: string) => void;
}) {
  return <aside className={styles.encounter} aria-live="polite" aria-label={`${node.label} encounter`}>
    <button className={styles.encounterBack} type="button" onClick={onBack}>← {trailDepth > 1 ? "Previous discovery" : "Back to the scene"}</button>
    <div className={styles.encounterIdentity} data-family={node.family}><span aria-hidden="true"/><p><small>{node.kind}</small><strong>{node.label}</strong></p></div>
    <p className={styles.encounterSummary}>{node.summary}</p>
    {routes.length > 0 && <div className={styles.encounterRoutes} aria-label={`Paths from ${node.label}`}>
      <small>Travel along a relationship</small>
      {routes.map((route) => <button type="button" onClick={() => onTravel(route.destination.id)} key={route.id}>
        <span>{route.relation}</span><strong>{route.destination.label}</strong><small>{route.relationKind}{route.sourceRef ? " · source-linked" : ""}</small>
      </button>)}
    </div>}
    <details className={styles.encounterBoundary}>
      <summary>Why this connection is here</summary>
      <p>{node.evidenceBoundary}</p>
    </details>
    <Link className={styles.encounterLibrary} href={journeyEncounterHref(node)}>{node.gateway ? `Enter the ${node.label} world` : "Open its exact library trail"} →</Link>
  </aside>;
}
