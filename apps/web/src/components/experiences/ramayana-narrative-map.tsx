"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { buildStoryNarrativeMap, storyMapPlaceForTurn } from "@/lib/domain/story-narrative-map";
import type { StoryCompass, StoryMapPlace } from "@/lib/domain/story-world";
import styles from "./ramayana-narrative-map.module.css";

type Props = {
  active: boolean;
  compass: StoryCompass;
  focusTurnId: string;
  language: "en" | "hi";
  onEnterMoment: (momentId: string) => void;
  onOpenWholeStory: (turnId: string) => void;
};

type MapTrailFrame = { placeId: string; turnId: string };
type MouseDrag = { pointerId: number; x: number; y: number; scrollLeft: number; scrollTop: number; moved: boolean };

const ZOOM_LEVELS = [.82, 1, 1.18, 1.38];

const realmLabels = [
  { en: "Beginnings & kingdoms", hi: "आरंभ और राज्य", x: 9, y: 8 },
  { en: "The forest exile", hi: "वनवास", x: 34, y: 88 },
  { en: "Alliance & search", hi: "मैत्री और खोज", x: 53, y: 88 },
  { en: "Ocean & Lanka", hi: "समुद्र और लंका", x: 72, y: 88 },
  { en: "Return & later reign", hi: "वापसी और उत्तरकाल", x: 86, y: 8 },
];

function closestTurn(place: StoryMapPlace, requestedTurnId: string, order: Map<string, number>) {
  if (place.turnIds.includes(requestedTurnId)) return requestedTurnId;
  const requested = order.get(requestedTurnId) ?? 0;
  return place.turnIds.reduce((closest, turnId) =>
    Math.abs((order.get(turnId) ?? 0) - requested) < Math.abs((order.get(closest) ?? 0) - requested) ? turnId : closest,
  place.turnIds[0]);
}

export function RamayanaNarrativeMap({
  active,
  compass,
  focusTurnId,
  language,
  onEnterMoment,
  onOpenWholeStory,
}: Props) {
  const map = useMemo(() => buildStoryNarrativeMap(compass), [compass]);
  const allTurnIds = useMemo(() => compass.arcs.flatMap((arc) => arc.turnIds), [compass.arcs]);
  const order = useMemo(() => new Map(allTurnIds.map((turnId, index) => [turnId, index])), [allTurnIds]);
  const placeById = useMemo(() => new Map(map.places.map((place) => [place.id, place])), [map.places]);
  const placeByLabel = useMemo(() => new Map(map.places.map((place) => [place.label.toLocaleLowerCase("en"), place])), [map.places]);
  const firstPlace = storyMapPlaceForTurn(map, compass, focusTurnId) ?? map.places[0];
  const [selectedPlaceId, setSelectedPlaceId] = useState(firstPlace.id);
  const [selectedTurnId, setSelectedTurnId] = useState(focusTurnId);
  const [trail, setTrail] = useState<MapTrailFrame[]>([]);
  const [zoomIndex, setZoomIndex] = useState(1);
  const lastAppliedFocus = useRef(focusTurnId);
  const selectedNodeRef = useRef<HTMLButtonElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<MouseDrag | null>(null);
  const suppressPlaceClick = useRef(false);
  const selectedPlace = placeById.get(selectedPlaceId) ?? firstPlace;
  const selectedTurn = compass.turns[selectedTurnId] ?? compass.turns[selectedPlace.turnIds[0]];
  const selectedArc = compass.arcs.find((arc) => arc.id === selectedTurn.arcId) ?? compass.arcs[0];
  const selectedStoryOrdinal = (order.get(selectedTurn.id) ?? 0) + 1;
  const zoom = ZOOM_LEVELS[zoomIndex];

  useEffect(() => {
    if (!active || lastAppliedFocus.current === focusTurnId) return;
    lastAppliedFocus.current = focusTurnId;
    if (focusTurnId === selectedTurnId) return;
    const place = storyMapPlaceForTurn(map, compass, focusTurnId);
    if (!place) return;
    const sync = window.setTimeout(() => {
      setSelectedPlaceId(place.id);
      setSelectedTurnId(focusTurnId);
      setTrail([]);
    }, 0);
    return () => window.clearTimeout(sync);
  }, [active, compass, focusTurnId, map, selectedTurnId]);

  useEffect(() => {
    if (!active) return;
    const viewport = viewportRef.current;
    const node = selectedNodeRef.current;
    if (!viewport || !node) return;
    viewport.scrollTo({
      left: node.offsetLeft + node.offsetWidth / 2 - viewport.clientWidth / 2,
      top: node.offsetTop + node.offsetHeight / 2 - viewport.clientHeight / 2,
      behavior: "smooth",
    });
  }, [active, selectedPlace.id, zoom]);

  function travelToPlace(place: StoryMapPlace) {
    if (place.id === selectedPlace.id) return;
    setTrail((current) => [...current, { placeId: selectedPlace.id, turnId: selectedTurn.id }]);
    setSelectedPlaceId(place.id);
    setSelectedTurnId(closestTurn(place, selectedTurn.id, order));
  }

  function back() {
    const frame = trail.at(-1);
    if (!frame) return;
    setTrail((current) => current.slice(0, -1));
    setSelectedPlaceId(frame.placeId);
    setSelectedTurnId(frame.turnId);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const viewport = viewportRef.current;
    if (!viewport) return;
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, scrollLeft: viewport.scrollLeft, scrollTop: viewport.scrollTop, moved: false };
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const viewport = viewportRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !viewport) return;
    if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 4 && !drag.moved) {
      drag.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.dataset.dragging = "true";
    }
    if (!drag.moved) return;
    viewport.scrollLeft = drag.scrollLeft - (event.clientX - drag.x);
    viewport.scrollTop = drag.scrollTop - (event.clientY - drag.y);
  }

  function handlePointerEnd(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    suppressPlaceClick.current = dragRef.current.moved;
    dragRef.current = null;
    delete event.currentTarget.dataset.dragging;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (suppressPlaceClick.current) window.setTimeout(() => { suppressPlaceClick.current = false; }, 0);
  }

  function resetView() {
    setZoomIndex(1);
    window.requestAnimationFrame(() => {
      const viewport = viewportRef.current;
      const node = selectedNodeRef.current;
      if (!viewport || !node) return;
      viewport.scrollTo({
        left: node.offsetLeft + node.offsetWidth / 2 - viewport.clientWidth / 2,
        top: node.offsetTop + node.offsetHeight / 2 - viewport.clientHeight / 2,
        behavior: "smooth",
      });
    });
  }

  const connectedPlaces = selectedTurn.places.flatMap((label) => {
    const place = placeByLabel.get(label.toLocaleLowerCase("en"));
    return place && place.id !== selectedPlace.id ? [place] : [];
  });

  return (
    <section className={styles.map} aria-label={language === "hi" ? "रामायण कथा-मानचित्र" : "Ramayana narrative map"}>
      <header className={styles.heading}>
        <p>{language === "hi" ? "कथा का भू-दृश्य" : "THE STORY AS A WORLD"}</p>
        <h1>{language === "hi" ? "स्थान से कथा में प्रवेश करें" : "Travel through the story by place"}</h1>
        <span>{language === "hi" ? `${map.places.length} कथा-स्थान · ${map.totalStoryTurns} कथा-मोड़` : `${map.places.length} narrative places · ${map.totalStoryTurns} story turns`}</span>
      </header>

      <div className={styles.mapStage}>
        <div className={styles.mapControls} role="group" aria-label={language === "hi" ? "मानचित्र दृश्य नियंत्रण" : `Narrative map controls, ${Math.round(zoom * 100)}%`}>
          <button type="button" disabled={zoomIndex === 0} onClick={() => setZoomIndex((index) => Math.max(0, index - 1))} aria-label="Zoom narrative map out">−</button>
          <button type="button" onClick={resetView} aria-label="Reset narrative map view">◎</button>
          <button type="button" disabled={zoomIndex === ZOOM_LEVELS.length - 1} onClick={() => setZoomIndex((index) => Math.min(ZOOM_LEVELS.length - 1, index + 1))} aria-label="Zoom narrative map in">+</button>
        </div>
        <div
          className={styles.mapViewport}
          aria-label={language === "hi" ? "कथा-मानचित्र को खींचकर देखें" : "Pannable Ramayana story map"}
          onPointerCancel={handlePointerEnd}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          ref={viewportRef}
          tabIndex={0}
        >
          <div className={styles.mapCanvas} data-zoomed={zoomIndex >= 2} style={{ "--map-zoom": zoom } as CSSProperties}>
            <div className={styles.terrain} aria-hidden="true"><span/><span/><span/></div>
            {realmLabels.map((realm) => <small className={styles.realmLabel} style={{ left: `${realm.x}%`, top: `${realm.y}%` }} key={realm.en}>{realm[language]}</small>)}
            <svg className={styles.routes} aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none">
              {map.routes.map((route) => {
                const from = placeById.get(route.fromPlaceId)!;
                const to = placeById.get(route.toPlaceId)!;
                const activeRoute = from.id === selectedPlace.id || to.id === selectedPlace.id;
                const curve = Math.max(2, Math.min(10, Math.abs(to.x - from.x) * .18));
                return <path
                  className={activeRoute ? styles.routeActive : undefined}
                  d={`M ${from.x} ${from.y} C ${from.x + curve} ${from.y - curve}, ${to.x - curve} ${to.y + curve}, ${to.x} ${to.y}`}
                  key={route.id}
                />;
              })}
            </svg>
            {map.places.map((place) => {
              const selected = place.id === selectedPlace.id;
              return <button
                type="button"
                className={styles.placeNode}
                data-selected={selected}
                data-tier={place.tier}
                style={{ "--place-x": `${place.x}%`, "--place-y": `${place.y}%`, "--place-z": `${place.depth}px` } as CSSProperties}
                aria-current={selected ? "location" : undefined}
                aria-label={`${place.label}, ${place.turnIds.length} story ${place.turnIds.length === 1 ? "moment" : "moments"}`}
                onClick={() => { if (!suppressPlaceClick.current) travelToPlace(place); }}
                ref={selected ? selectedNodeRef : undefined}
                key={place.id}
              ><i aria-hidden="true"/><strong>{place.label}</strong><small>{place.turnIds.length} {language === "hi" ? "प्रसंग" : place.turnIds.length === 1 ? "moment" : "moments"}</small></button>;
            })}
          </div>
        </div>
        <p className={styles.panGuide}>{language === "hi" ? "खींचें · ज़ूम करें · किसी स्थान को चुनें" : "Drag to travel · zoom to reveal waypoints · choose a place"}</p>
      </div>

      <article className={styles.placeCard} aria-live="polite">
        <div className={styles.placeIdentity}>
          <small>{language === "hi" ? "कथा-स्थान" : "STORY PLACE"}</small>
          <h2>{selectedPlace.label}</h2>
          <span>{language === "hi" ? `${selectedPlace.turnIds.length} प्रसंग · ${selectedPlace.arcIds.length} कथा-संसार` : `${selectedPlace.turnIds.length} moments across ${selectedPlace.arcIds.length} story worlds`}</span>
        </div>
        {trail.length > 0 && <button type="button" className={styles.back} onClick={back}>← {language === "hi" ? "पिछले स्थान पर लौटें" : `Back to ${placeById.get(trail.at(-1)!.placeId)?.label}`}</button>}
        <ol className={styles.momentRail} aria-label={`${selectedPlace.label} story moments`}>
          {selectedPlace.turnIds.map((turnId) => {
            const turn = compass.turns[turnId];
            const ordinal = (order.get(turnId) ?? 0) + 1;
            return <li key={turn.id}><button type="button" aria-current={turn.id === selectedTurn.id ? "step" : undefined} onClick={() => setSelectedTurnId(turn.id)}>
              <small>{String(ordinal).padStart(2, "0")}</small><span>{turn.title[language]}</span>
            </button></li>;
          })}
        </ol>
        <div className={styles.turnStory}>
          <small>{selectedArc.title[language]} · {language === "hi" ? `कथा-मोड़ ${selectedStoryOrdinal}` : `Story turn ${selectedStoryOrdinal}`}</small>
          <h3>{selectedTurn.title[language]}</h3>
          <p>{selectedTurn.hook[language]}</p>
          {connectedPlaces.length > 0 && <div className={styles.relatedPlaces} aria-label={language === "hi" ? "इस प्रसंग के अन्य स्थान" : "Other places in this moment"}>
            {connectedPlaces.map((place) => <button type="button" onClick={() => travelToPlace(place)} key={place.id}>{place.label} <span aria-hidden="true">→</span></button>)}
          </div>}
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.openStory} onClick={() => onOpenWholeStory(selectedTurn.id)}>{language === "hi" ? "मुख्य कथा में देखें" : "Open in the whole story"}<span aria-hidden="true">→</span></button>
          {selectedTurn.playableMomentId && <button type="button" onClick={() => onEnterMoment(selectedTurn.playableMomentId!)}>{language === "hi" ? "दृश्य कथा में प्रवेश" : "Enter visual story"}</button>}
        </div>
        <details>
          <summary>{language === "hi" ? "मानचित्र और स्रोत सीमा" : "Map and source boundary"}</summary>
          <span>{map.boundary}</span>
          <strong>{compass.expressionLabel}</strong>
        </details>
      </article>
    </section>
  );
}
