"use client";

import { useMemo, useState, type CSSProperties } from "react";
import type { StoryCompass } from "@/lib/domain/story-world";
import styles from "./journey-compass.module.css";

type Props = {
  compass: StoryCompass;
  language: "en" | "hi";
  onEnterMoment: (momentId: string) => void;
};

function sourceRangeLabel(kandaSlug: string, start: number, end: number) {
  const name = kandaSlug.charAt(0).toUpperCase() + kandaSlug.slice(1);
  return `${name} · source units ${start}–${end}`;
}

export function JourneyCompass({ compass, language, onEnterMoment }: Props) {
  const [selectedArcId, setSelectedArcId] = useState(compass.arcs[0].id);
  const [selectedTurnId, setSelectedTurnId] = useState(compass.arcs[0].turnIds[0]);
  const selectedArc = compass.arcs.find((arc) => arc.id === selectedArcId) ?? compass.arcs[0];
  const selectedTurn = compass.turns[selectedTurnId] ?? compass.turns[selectedArc.turnIds[0]];
  const allTurnIds = useMemo(() => compass.arcs.flatMap((arc) => arc.turnIds), [compass.arcs]);
  const globalIndex = allTurnIds.indexOf(selectedTurn.id);

  function selectArc(arcId: string) {
    const arc = compass.arcs.find((candidate) => candidate.id === arcId);
    if (!arc) return;
    setSelectedArcId(arc.id);
    setSelectedTurnId(arc.turnIds[0]);
  }

  function selectTurn(turnId: string) {
    const turn = compass.turns[turnId];
    if (!turn) return;
    setSelectedArcId(turn.arcId);
    setSelectedTurnId(turn.id);
  }

  function step(direction: -1 | 1) {
    const nextId = allTurnIds[globalIndex + direction];
    if (nextId) selectTurn(nextId);
  }

  return (
    <section className={styles.compass} aria-label={language === "hi" ? "संपूर्ण रामायण कथा-पथ" : "Whole Ramayana story compass"}>
      <header className={styles.heading}>
        <p>{language === "hi" ? "कथा का ब्रह्मांड" : "THE STORY UNIVERSE"}</p>
        <h1>{language === "hi" ? "जहाँ चाहें, वहाँ से कथा खोलें" : "Enter the story from anywhere"}</h1>
        <span>{language === "hi" ? "सात संसार · 49 कथा-मोड़ · हर स्रोत-अंश का स्थान सुरक्षित" : "Seven worlds · 49 story turns · every source unit accounted for"}</span>
      </header>

      <nav className={styles.arcRail} aria-label={language === "hi" ? "रामायण के सात कथा-संसार" : "Seven Ramayana story worlds"}>
        <svg aria-hidden="true" viewBox="0 0 100 12" preserveAspectRatio="none"><path d="M2 8 C 20 1, 34 11, 50 5 S 78 2, 98 7" /></svg>
        {compass.arcs.map((arc) => (
          <button
            type="button"
            className={arc.id === selectedArc.id ? styles.arcActive : ""}
            aria-pressed={arc.id === selectedArc.id}
            onClick={() => selectArc(arc.id)}
            key={arc.id}
          >
            <span aria-hidden="true" />
            <small>{String(arc.ordinal).padStart(2, "0")}</small>
            <strong>{arc.title[language]}</strong>
          </button>
        ))}
      </nav>

      <div className={styles.turnField} aria-label={`${selectedArc.title[language]} story turns`}>
        <div className={styles.arcIdentity}>
          <small>{language === "hi" ? `संसार ${selectedArc.ordinal} / ${compass.arcs.length}` : `WORLD ${selectedArc.ordinal} / ${compass.arcs.length}`}</small>
          <strong>{selectedArc.title[language]}</strong>
          <span>{selectedArc.invitation[language]}</span>
        </div>
        <div className={styles.turnPath}>
          <div className={styles.turnCanvas} style={{ "--turn-canvas-width": `${Math.max(560, selectedArc.turnIds.length * 94)}px` } as CSSProperties}>
            <span className={styles.turnLine} aria-hidden="true" />
            {selectedArc.turnIds.map((turnId, index) => {
              const turn = compass.turns[turnId];
              const selected = turn.id === selectedTurn.id;
              const position = selectedArc.turnIds.length === 1 ? 50 : 7 + (index / (selectedArc.turnIds.length - 1)) * 86;
              const y = index % 2 === 0 ? 43 : 57;
              return (
                <button
                  type="button"
                  className={`${styles.turnNode} ${selected ? styles.turnActive : ""} ${turn.coverage === "playable" ? styles.turnPlayable : ""}`}
                  style={{ "--turn-x": `${position}%`, "--turn-y": `${y}%`, "--turn-z": `${(index % 3) * 12}px` } as CSSProperties}
                  aria-current={selected ? "step" : undefined}
                  aria-label={`${turn.ordinal}. ${turn.title[language]}`}
                  onClick={() => selectTurn(turn.id)}
                  key={turn.id}
                >
                  <span aria-hidden="true" />
                  <small>{String(turn.ordinal).padStart(2, "0")}</small>
                  <strong>{turn.title[language]}</strong>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <article className={styles.turnCard} aria-live="polite">
        <div className={styles.turnStatus} data-coverage={selectedTurn.coverage}>
          <span />
          {selectedTurn.coverage === "playable"
            ? (language === "hi" ? "अभी खेलकर देखें" : "PLAYABLE NOW")
            : (language === "hi" ? "कथा-पथ तैयार" : "STORY PATH MAPPED")}
        </div>
        <small>{sourceRangeLabel(selectedTurn.sourceRange.kandaSlug, selectedTurn.sourceRange.startOrdinal, selectedTurn.sourceRange.endOrdinal)}</small>
        <h2>{selectedTurn.title[language]}</h2>
        <p>{selectedTurn.hook[language]}</p>
        <div className={styles.tags} aria-label={language === "hi" ? "स्थान, पात्र और कथा-सूत्र" : "Place, characters, and story threads"}>
          <span>{selectedTurn.place}</span>
          {selectedTurn.characters.slice(0, 4).map((character) => <span key={character}>{character}</span>)}
          {selectedTurn.threads.map((thread) => <span key={thread}>#{thread}</span>)}
        </div>
        <div className={styles.cardActions}>
          {selectedTurn.playableMomentId && <button type="button" className={styles.enter} onClick={() => onEnterMoment(selectedTurn.playableMomentId!)}>{language === "hi" ? "इस संसार में प्रवेश करें" : "Enter this story world"}<span>→</span></button>}
          <button type="button" disabled={globalIndex === 0} onClick={() => step(-1)} aria-label={language === "hi" ? "पिछला कथा-मोड़" : "Previous story turn"}>←</button>
          <button type="button" disabled={globalIndex === allTurnIds.length - 1} onClick={() => step(1)} aria-label={language === "hi" ? "अगला कथा-मोड़" : "Next story turn"}>→</button>
        </div>
        {selectedTurn.coverage === "orientation" && <p className={styles.coverageNote}>{language === "hi" ? "यह पूरा स्रोत-अंश कथा-क्रम में जोड़ा जा चुका है; इसका विस्तृत दृश्य-अनुभव अभी निर्माण में है।" : "This complete source range has a place in the story order; its detailed visual journey is still being built."}</p>}
        <details>
          <summary>{language === "hi" ? "कवरेज और स्रोत सीमा" : "Coverage and source boundary"}</summary>
          <strong>{compass.expressionLabel}</strong>
          <span>{compass.sourceBoundary}</span>
          <code>sha256:{selectedTurn.sourceRange.sourceSha256}</code>
        </details>
      </article>
    </section>
  );
}
