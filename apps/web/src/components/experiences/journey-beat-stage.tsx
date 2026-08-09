import type { CSSProperties } from "react";
import type { RamayanaBeatStage } from "./ramayana-beat-stage";
import styles from "./journey-player.module.css";

const particleIndexes = Array.from({ length: 12 }, (_, index) => index);

export function JourneyBeatStage({ stage }: { stage?: RamayanaBeatStage }) {
  if (!stage) return null;
  const style = {
    "--beat-focus-x": `${stage.focusX}%`,
    "--beat-focus-y": `${stage.focusY}%`,
    "--beat-color": stage.color,
  } as CSSProperties;

  return <div className={styles.beatStage} data-testid="journey-beat-stage" data-motif={stage.motif} style={style} aria-hidden="true">
    <div className={styles.beatFocus}><span/><span/><span/></div>
    <div className={styles.beatTrail}><span/></div>
    <div className={styles.beatParticles}>{particleIndexes.map((index) => <span style={{
      "--particle-index": index,
      left: `${4 + index * 8.1}%`,
      top: `${72 - (index % 6) * 6.4}%`,
      width: `${2 + (index % 3)}px`,
      height: `${2 + (index % 3)}px`,
      animationDuration: `${5 + index * .32}s`,
      animationDelay: `${index * -.43}s`,
    } as CSSProperties} key={index}/>)}</div>
  </div>;
}
