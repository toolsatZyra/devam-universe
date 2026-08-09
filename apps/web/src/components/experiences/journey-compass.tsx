"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  buildStoryCompassIndexes,
  getStoryCompassPath,
  getStoryCompassPathById,
} from "@/lib/domain/story-compass-index";
import type { StoryCompass, StoryCompassPathKind } from "@/lib/domain/story-world";
import styles from "./journey-compass.module.css";

type Props = {
  compass: StoryCompass;
  language: "en" | "hi";
  onEnterMoment: (momentId: string) => void;
};

type TrailFrame = { turnId: string; pathId?: string };

function sourceRangeLabel(kandaSlug: string, start: number, end: number) {
  const name = kandaSlug.charAt(0).toUpperCase() + kandaSlug.slice(1);
  return `${name} · source units ${start}–${end}`;
}

export function JourneyCompass({ compass, language, onEnterMoment }: Props) {
  const [selectedArcId, setSelectedArcId] = useState(compass.arcs[0].id);
  const [selectedTurnId, setSelectedTurnId] = useState(compass.arcs[0].turnIds[0]);
  const [activePathId, setActivePathId] = useState<string>();
  const [trail, setTrail] = useState<TrailFrame[]>([]);
  const selectedNodeRef = useRef<HTMLButtonElement | null>(null);
  const indexes = useMemo(() => buildStoryCompassIndexes(compass), [compass]);
  const activePath = useMemo(() => getStoryCompassPathById(indexes, activePathId), [activePathId, indexes]);
  const selectedArc = compass.arcs.find((arc) => arc.id === selectedArcId) ?? compass.arcs[0];
  const selectedTurn = compass.turns[selectedTurnId] ?? compass.turns[selectedArc.turnIds[0]];
  const allTurnIds = useMemo(() => compass.arcs.flatMap((arc) => arc.turnIds), [compass.arcs]);
  const visibleTurnIds = activePath?.turnIds ?? selectedArc.turnIds;
  const navigationTurnIds = activePath?.turnIds ?? allTurnIds;
  const navigationIndex = navigationTurnIds.indexOf(selectedTurn.id);
  const activePathWorldCount = activePath
    ? new Set(activePath.turnIds.map((turnId) => compass.turns[turnId].arcId)).size
    : 0;

  useEffect(() => {
    selectedNodeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activePathId, selectedTurn.id]);

  function selectArc(arcId: string) {
    const arc = compass.arcs.find((candidate) => candidate.id === arcId);
    if (!arc) return;
    setSelectedArcId(arc.id);
    setSelectedTurnId(arc.turnIds[0]);
    setActivePathId(undefined);
    setTrail([]);
  }

  function selectTurn(turnId: string) {
    const turn = compass.turns[turnId];
    if (!turn) return;
    setSelectedArcId(turn.arcId);
    setSelectedTurnId(turn.id);
  }

  function step(direction: -1 | 1) {
    const nextId = navigationTurnIds[navigationIndex + direction];
    if (nextId) selectTurn(nextId);
  }

  function openPath(kind: StoryCompassPathKind, label: string) {
    const path = getStoryCompassPath(indexes, kind, label);
    if (!path || path.turnIds.length < 2) return;
    setTrail((current) => [...current, { turnId: selectedTurn.id, pathId: activePath?.id }]);
    setActivePathId(path.id);
  }

  function returnFromPath() {
    const frame = trail.at(-1);
    if (!frame) return;
    const turn = compass.turns[frame.turnId];
    if (!turn) return;
    setTrail((current) => current.slice(0, -1));
    setActivePathId(frame.pathId);
    setSelectedArcId(turn.arcId);
    setSelectedTurnId(turn.id);
  }

  function pathKindLabel(kind: StoryCompassPathKind) {
    const labels = {
      place: language === "hi" ? "स्थान" : "place",
      character: language === "hi" ? "पात्र" : "character",
      thread: language === "hi" ? "कथा-सूत्र" : "story thread",
    };
    return labels[kind];
  }

  function pathTag(kind: StoryCompassPathKind, label: string) {
    const path = getStoryCompassPath(indexes, kind, label);
    const displayLabel = kind === "thread" ? `#${label}` : label;
    if (!path || path.turnIds.length < 2 || path.id === activePath?.id) return <span data-kind={kind}>{displayLabel}</span>;
    const ariaLabel = language === "hi"
      ? `${label} का ${pathKindLabel(kind)} पथ देखें`
      : `Follow ${label}'s ${pathKindLabel(kind)} path`;
    return <button type="button" data-kind={kind} aria-label={ariaLabel} onClick={() => openPath(kind, label)}>{displayLabel}<i aria-hidden="true">↗</i></button>;
  }

  return (
    <section className={styles.compass} aria-label={language === "hi" ? "संपूर्ण रामायण कथा-पथ" : "Whole Ramayana story compass"}>
      <header className={styles.heading}>
        <p>{language === "hi" ? "कथा का ब्रह्मांड" : "THE STORY UNIVERSE"}</p>
        <h1>{language === "hi" ? "जहाँ चाहें, वहाँ से कथा खोलें" : "Enter the story from anywhere"}</h1>
        <span>{language === "hi" ? "सात संसार · 49 कथा-मोड़ · एक सतत कथा-पथ" : "Seven worlds · 49 story turns · one continuous story path"}</span>
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

      <div className={styles.turnField} data-path={Boolean(activePath)} aria-label={activePath ? `${activePath.label} ${pathKindLabel(activePath.kind)} path` : `${selectedArc.title[language]} story turns`}>
        <div className={`${styles.arcIdentity} ${activePath ? styles.pathIdentity : ""}`}>
          {activePath ? <>
            <small>{language === "hi" ? `${pathKindLabel(activePath.kind)} के साथ आगे बढ़ें` : `FOLLOWING A ${pathKindLabel(activePath.kind).toUpperCase()}`}</small>
            <strong>{activePath.label}</strong>
            <span>{language === "hi" ? `${activePath.turnIds.length} प्रसंग · ${activePathWorldCount} कथा-संसार` : `${activePath.turnIds.length} moments across ${activePathWorldCount} worlds`}</span>
            <button type="button" className={styles.pathBack} onClick={returnFromPath}>
              <b aria-hidden="true">←</b> {language === "hi" ? "पिछले कथा-मोड़ पर लौटें" : `Back to ${compass.turns[trail.at(-1)!.turnId].title.en}`}
            </button>
          </> : <>
            <small>{language === "hi" ? `संसार ${selectedArc.ordinal} / ${compass.arcs.length}` : `WORLD ${selectedArc.ordinal} / ${compass.arcs.length}`}</small>
            <strong>{selectedArc.title[language]}</strong>
            <span>{selectedArc.invitation[language]}</span>
          </>}
        </div>
        <div className={styles.turnPath} data-path={Boolean(activePath)}>
          <div className={styles.turnCanvas} style={{ "--turn-canvas-width": `${Math.max(560, visibleTurnIds.length * (activePath ? 118 : 94))}px` } as CSSProperties}>
            <span className={styles.turnLine} aria-hidden="true" />
            {visibleTurnIds.map((turnId, index) => {
              const turn = compass.turns[turnId];
              const selected = turn.id === selectedTurn.id;
              const position = visibleTurnIds.length === 1 ? 50 : 7 + (index / (visibleTurnIds.length - 1)) * 86;
              const y = index % 2 === 0 ? 43 : 57;
              const displayOrdinal = activePath ? allTurnIds.indexOf(turn.id) + 1 : turn.ordinal;
              return (
                <button
                  ref={selected ? selectedNodeRef : undefined}
                  type="button"
                  className={`${styles.turnNode} ${selected ? styles.turnActive : ""} ${turn.coverage === "playable" ? styles.turnPlayable : ""}`}
                  style={{ "--turn-x": `${position}%`, "--turn-y": `${y}%`, "--turn-z": `${(index % 3) * 12}px` } as CSSProperties}
                  aria-current={selected ? "step" : undefined}
                  aria-label={`${displayOrdinal}. ${turn.title[language]}`}
                  onClick={() => selectTurn(turn.id)}
                  key={turn.id}
                >
                  <span aria-hidden="true" />
                  <small>{String(displayOrdinal).padStart(2, "0")}</small>
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
            : (language === "hi" ? "कथा-मोड़" : "STORY TURN")}
        </div>
        <small>{language === "hi" ? `कथा-मोड़ ${allTurnIds.indexOf(selectedTurn.id) + 1} / ${allTurnIds.length}` : `Story turn ${allTurnIds.indexOf(selectedTurn.id) + 1} of ${allTurnIds.length}`}</small>
        <h2>{selectedTurn.title[language]}</h2>
        <p>{selectedTurn.hook[language]}</p>
        <div className={styles.tags} aria-label={language === "hi" ? "स्थान, पात्र और कथा-सूत्र" : "Place, characters, and story threads"}>
          {selectedTurn.places.slice(0, 2).map((place) => <span key={`place:${place}`}>{pathTag("place", place)}</span>)}
          {selectedTurn.characters.slice(0, 3).map((character) => <span key={`character:${character}`}>{pathTag("character", character)}</span>)}
          {selectedTurn.threads.slice(0, 2).map((thread) => <span key={`thread:${thread}`}>{pathTag("thread", thread)}</span>)}
        </div>
        <div className={styles.cardActions}>
          {selectedTurn.playableMomentId && <button type="button" className={styles.enter} onClick={() => onEnterMoment(selectedTurn.playableMomentId!)}>{language === "hi" ? "इस संसार में प्रवेश करें" : "Enter this story world"}<span>→</span></button>}
          <button type="button" disabled={navigationIndex === 0} onClick={() => step(-1)} aria-label={language === "hi" ? "पिछला कथा-मोड़" : "Previous story turn"}>←</button>
          <button type="button" disabled={navigationIndex === navigationTurnIds.length - 1} onClick={() => step(1)} aria-label={language === "hi" ? "अगला कथा-मोड़" : "Next story turn"}>→</button>
        </div>
        {selectedTurn.coverage === "orientation" && <p className={styles.coverageNote}>{language === "hi" ? "यह कथा-मोड़ पूरी यात्रा में जुड़ा है; इसका विस्तृत दृश्य-अनुभव अभी निर्माण में है।" : "This story turn belongs to the complete journey; its detailed visual scene is still being built."}</p>}
        <details>
          <summary>{language === "hi" ? "कवरेज और स्रोत सीमा" : "Coverage and source boundary"}</summary>
          <strong>{compass.expressionLabel}</strong>
          <span>{sourceRangeLabel(selectedTurn.sourceRange.kandaSlug, selectedTurn.sourceRange.startOrdinal, selectedTurn.sourceRange.endOrdinal)}</span>
          <span>{compass.sourceBoundary}</span>
          <code>sha256:{selectedTurn.sourceRange.sourceSha256}</code>
        </details>
      </article>
    </section>
  );
}
