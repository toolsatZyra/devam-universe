"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import type { Gateway, PlaceThread, WorldEdge, WorldNode } from "@/lib/domain/atlas";
import type { RitualProcedureGuide } from "@/lib/domain/practice";
import { canGuestAskSarthi, canGuestOpenGateway } from "@/lib/account/guest-preview";
import styles from "./atlas-shell.module.css";

type AtlasShellProps = {
  eras: readonly string[];
  gateways: Gateway[];
  placeThreads: PlaceThread[];
  worldEdges: WorldEdge[];
  worldNodes: WorldNode[];
  account: { signedIn: boolean; label: string };
};

type IconName =
  | "atlas"
  | "today"
  | "journeys"
  | "library"
  | "search"
  | "spark"
  | "close"
  | "arrow"
  | "plus"
  | "minus"
  | "reset"
  | "motion"
  | "place"
  | "user";

type ViewTransform = { x: number; y: number; scale: number };
type Point = { x: number; y: number };
type MotionMode = "cinematic" | "gentle" | "still";
type AtlasLayer = "universe" | "geography";
type SarthiCitation = {
  passageId: string;
  sourceOrdinal: number;
  workTitle: string;
  editionTitle: string;
  quotation?: string;
  locator: Record<string, unknown>;
};
type SarthiReply = {
  ok: boolean;
  answer?: string;
  message?: string;
  citations?: SarthiCitation[];
  sourceBoundary?: string;
  followUpQuestion?: string;
  practiceGuide?: RitualProcedureGuide;
  conversation?: { status: "guest_ephemeral" | "consent_required" | "saved" | "save_failed"; conversationId: string | null };
};

const MIN_SCALE = 0.78;
const MAX_SCALE = 2.4;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    atlas: <><circle cx="12" cy="12" r="8"/><path d="M12 4c2.4 2.1 3.6 4.8 3.6 8s-1.2 5.9-3.6 8c-2.4-2.1-3.6-4.8-3.6-8S9.6 6.1 12 4Z"/><path d="M4.5 9h15M4.5 15h15"/></>,
    today: <><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8 3v4M16 3v4M4 10h16"/><circle cx="12" cy="15" r="2"/></>,
    journeys: <><circle cx="6" cy="17" r="2"/><circle cx="18" cy="7" r="2"/><path d="M8 17h2a3 3 0 0 0 3-3v-4a3 3 0 0 1 3-3"/></>,
    library: <><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z"/><path d="M8 4v16M11 8h5M11 12h5"/></>,
    search: <><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></>,
    spark: <><path d="M12 2c.8 5.1 3.3 7.6 8 8-4.7.4-7.2 2.9-8 8-.8-5.1-3.3-7.6-8-8 4.7-.4 7.2-2.9 8-8Z"/><path d="M19 16c.3 1.9 1.2 2.8 3 3-1.8.2-2.7 1.1-3 3-.3-1.9-1.2-2.8-3-3 1.8-.2 2.7-1.1 3-3Z"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    arrow: <><path d="M5 12h14M14 7l5 5-5 5"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    minus: <path d="M5 12h14"/>,
    reset: <><path d="M4 12a8 8 0 1 0 2.3-5.7L4 8.6"/><path d="M4 4v4.6h4.6"/></>,
    motion: <><circle cx="12" cy="12" r="3"/><path d="M12 2a10 10 0 0 1 10 10M2 12A10 10 0 0 1 12 2M12 22A10 10 0 0 1 2 12M22 12a10 10 0 0 1-10 10"/></>,
    place: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    user: <><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const navigation: { label: string; icon: IconName; href: string }[] = [
  { label: "Atlas", icon: "atlas", href: "/" },
  { label: "Sarthi", icon: "spark", href: "/sarthi" },
  { label: "Today", icon: "today", href: "/today" },
  { label: "Journeys", icon: "journeys", href: "/journeys" },
  { label: "Library", icon: "library", href: "/search" },
];

export function AtlasShell({ eras, gateways, placeThreads, worldEdges, worldNodes, account }: AtlasShellProps) {
  const [selectedId, setSelectedId] = useState<Gateway["id"]>("ramayana");
  const [focusedId, setFocusedId] = useState<string>("ramayana");
  const [activeEra, setActiveEra] = useState("Living");
  const [sarthiOpen, setSarthiOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [askedQuestion, setAskedQuestion] = useState("");
  const [sarthiReply, setSarthiReply] = useState<SarthiReply | null>(null);
  const [sarthiBusy, setSarthiBusy] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [motionMode, setMotionMode] = useState<MotionMode>("gentle");
  const [atlasLayer, setAtlasLayer] = useState<AtlasLayer>("universe");
  const [motionMenuOpen, setMotionMenuOpen] = useState(false);
  const [placeThreadOpen, setPlaceThreadOpen] = useState(false);
  const [signInPrompt, setSignInPrompt] = useState<"gateway" | "sarthi" | null>(null);
  const [view, setView] = useState<ViewTransform>({ x: 0, y: 0, scale: 1 });
  const [dragging, setDragging] = useState(false);
  const viewRef = useRef(view);
  const viewportRef = useRef<HTMLDivElement>(null);
  const pointersRef = useRef(new Map<number, Point>());
  const panStartRef = useRef<{ pointer: Point; view: ViewTransform } | null>(null);
  const pinchStartRef = useRef<{ distance: number; midpoint: Point; view: ViewTransform } | null>(null);
  const lastTapRef = useRef(0);
  const lastPointerTypeRef = useRef<string>("mouse");
  const visitedGatewaysRef = useRef(new Set<string>(["ramayana"]));
  const guestSarthiExchangesRef = useRef(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const readSavedMode = (): MotionMode | null => {
      try {
        const value = window.localStorage.getItem("devam-motion-mode");
        return value === "cinematic" || value === "gentle" || value === "still" ? value : null;
      } catch {
        return null;
      }
    };
    const saved = readSavedMode();
    const initialSync = window.setTimeout(
      () => setMotionMode(saved ?? (media.matches ? "gentle" : "cinematic")),
      0,
    );
    const handleSystemChange = (event: MediaQueryListEvent) => {
      if (!readSavedMode()) setMotionMode(event.matches ? "gentle" : "cinematic");
    };
    media.addEventListener("change", handleSystemChange);
    return () => {
      window.clearTimeout(initialSync);
      media.removeEventListener("change", handleSystemChange);
    };
  }, []);

  useEffect(() => {
    if (account.signedIn) return;
    try {
      const saved = JSON.parse(window.localStorage.getItem("devam-guest-gateways") ?? "[]");
      if (Array.isArray(saved)) {
        visitedGatewaysRef.current = new Set(saved.filter((value): value is string => typeof value === "string"));
        visitedGatewaysRef.current.add("ramayana");
      }
    } catch {
      visitedGatewaysRef.current = new Set(["ramayana"]);
    }
    try {
      const completed = Number(window.localStorage.getItem("devam-guest-sarthi-exchanges") ?? "0");
      guestSarthiExchangesRef.current = Number.isSafeInteger(completed) && completed > 0 ? completed : 0;
    } catch {
      guestSarthiExchangesRef.current = 0;
    }
  }, [account.signedIn]);

  const selectGateway = (gatewayId: Gateway["id"]) => {
    const visited = visitedGatewaysRef.current;
    if (!canGuestOpenGateway(visited, gatewayId, account.signedIn)) {
      setSignInPrompt("gateway");
      return;
    }
    visited.add(gatewayId);
    if (!account.signedIn) {
      try { window.localStorage.setItem("devam-guest-gateways", JSON.stringify([...visited])); } catch { /* Soft preview stays session-local. */ }
    }
    setSelectedId(gatewayId);
    setFocusedId(gatewayId);
  };

  const selected = useMemo(
    () => gateways.find((gateway) => gateway.id === selectedId) ?? gateways[0],
    [gateways, selectedId],
  );
  const focusedNode = useMemo(
    () => worldNodes.find((node) => node.id === focusedId) ?? null,
    [focusedId, worldNodes],
  );
  const focusedConnections = useMemo(
    () => worldEdges
      .filter((edge) => edge.from === focusedId || edge.to === focusedId)
      .map((edge) => edge.relation),
    [focusedId, worldEdges],
  );
  const selectedPlaceThread = useMemo(
    () => placeThreads.find((thread) => thread.gatewayId === selected.id) ?? placeThreads[0],
    [placeThreads, selected.id],
  );
  const conversationSubject = focusedNode?.label ?? selected.title;

  const askSarthi = useCallback(async (question: string) => {
    const normalized = question.trim();
    if (normalized.length < 2 || sarthiBusy) return;
    if (!canGuestAskSarthi(guestSarthiExchangesRef.current, account.signedIn)) {
      setSignInPrompt("sarthi");
      return;
    }
    setAskedQuestion(normalized);
    setSarthiReply(null);
    setSarthiBusy(true);
    try {
      const response = await fetch("/api/sarthi", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: normalized, context: { atlasNodeSlug: focusedNode?.id ?? selected.id, ...(conversationId ? { conversationId } : {}) } }),
      });
      const reply = await response.json() as SarthiReply;
      setSarthiReply(reply);
      if (reply.conversation?.status === "saved" && reply.conversation.conversationId) setConversationId(reply.conversation.conversationId);
      if (response.ok) {
        setQuery("");
        if (!account.signedIn) {
          guestSarthiExchangesRef.current += 1;
          try { window.localStorage.setItem("devam-guest-sarthi-exchanges", String(guestSarthiExchangesRef.current)); } catch { /* Soft preview stays session-local. */ }
        }
      }
    } catch {
      setSarthiReply({ ok: false, message: "I couldn’t reach the evidence service. Please try again." });
    } finally {
      setSarthiBusy(false);
    }
  }, [account.signedIn, conversationId, focusedNode, sarthiBusy, selected.id]);
  const points = useMemo(() => {
    const result: Record<string, Point> = {};
    gateways.forEach((gateway) => { result[gateway.id] = gateway.position; });
    worldNodes.forEach((node) => { result[node.id] = node.position; });
    return result;
  }, [gateways, worldNodes]);
  const geographyPoints = useMemo(() => Object.fromEntries(
    worldNodes.flatMap((node) => node.geography ? [[node.id, node.geography.position]] : []),
  ) as Record<string, Point>, [worldNodes]);

  const commitView = useCallback((next: ViewTransform) => {
    const bounded = { ...next, scale: clamp(next.scale, MIN_SCALE, MAX_SCALE) };
    viewRef.current = bounded;
    setView(bounded);
  }, []);

  const zoomAt = useCallback((clientX: number, clientY: number, factor: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const rect = viewport.getBoundingClientRect();
    const current = viewRef.current;
    const nextScale = clamp(current.scale * factor, MIN_SCALE, MAX_SCALE);
    const ratio = nextScale / current.scale;
    const localX = clientX - rect.left;
    const localY = clientY - rect.top;
    commitView({
      x: localX - (localX - current.x) * ratio,
      y: localY - (localY - current.y) * ratio,
      scale: nextScale,
    });
  }, [commitView]);

  const zoomFromCenter = useCallback((factor: number) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (rect) zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, factor);
  }, [zoomAt]);

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    zoomAt(event.clientX, event.clientY, event.deltaY < 0 ? 1.12 : 0.89);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    lastPointerTypeRef.current = event.pointerType;
    const target = event.target as HTMLElement;
    if (event.pointerType === "mouse" && target.closest("button")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointersRef.current.size === 1) {
      panStartRef.current = {
        pointer: { x: event.clientX, y: event.clientY },
        view: { ...viewRef.current },
      };
      setDragging(true);
    } else if (pointersRef.current.size === 2) {
      const [a, b] = [...pointersRef.current.values()];
      pinchStartRef.current = {
        distance: Math.hypot(b.x - a.x, b.y - a.y),
        midpoint: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
        view: { ...viewRef.current },
      };
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointersRef.current.has(event.pointerId)) return;
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointersRef.current.size === 2 && pinchStartRef.current) {
      const [a, b] = [...pointersRef.current.values()];
      const start = pinchStartRef.current;
      const distance = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
      const nextScale = clamp(start.view.scale * (distance / start.distance), MIN_SCALE, MAX_SCALE);
      const ratio = nextScale / start.view.scale;
      const rect = viewportRef.current?.getBoundingClientRect();
      if (!rect) return;
      const localX = start.midpoint.x - rect.left;
      const localY = start.midpoint.y - rect.top;
      commitView({
        x: localX - (localX - start.view.x) * ratio,
        y: localY - (localY - start.view.y) * ratio,
        scale: nextScale,
      });
    } else if (pointersRef.current.size === 1 && panStartRef.current) {
      const start = panStartRef.current;
      commitView({
        ...start.view,
        x: start.view.x + event.clientX - start.pointer.x,
        y: start.view.y + event.clientY - start.pointer.y,
      });
    }
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const wasSingleTouch = event.pointerType === "touch" && pointersRef.current.size === 1;
    pointersRef.current.delete(event.pointerId);
    if (wasSingleTouch) {
      const now = Date.now();
      if (now - lastTapRef.current < 320) {
        zoomAt(event.clientX, event.clientY, 1.4);
        lastTapRef.current = 0;
      } else {
        lastTapRef.current = now;
      }
    }
    if (pointersRef.current.size < 2) pinchStartRef.current = null;
    if (pointersRef.current.size === 0) {
      panStartRef.current = null;
      setDragging(false);
    }
  };

  const resetView = () => commitView({ x: 0, y: 0, scale: 1 });
  const focusPlaceNode = (nodeId: string) => {
    const node = worldNodes.find((candidate) => candidate.id === nodeId);
    const viewport = viewportRef.current;
    if (!node || !viewport) return;
    const scale = Math.max(1.45, node.revealAt);
    commitView({
      x: viewport.clientWidth / 2 - viewport.clientWidth * (node.position.x / 100) * scale,
      y: viewport.clientHeight / 2 - viewport.clientHeight * (node.position.y / 100) * scale,
      scale,
    });
    setActiveEra("Living");
    setAtlasLayer("geography");
    setFocusedId(node.id);
    setSelectedId(node.gatewayId);
  };
  const chooseAtlasLayer = (layer: AtlasLayer) => {
    setAtlasLayer(layer);
    setPlaceThreadOpen(false);
    resetView();
  };
  const chooseMotion = (mode: MotionMode) => {
    setMotionMode(mode);
    setMotionMenuOpen(false);
    try { window.localStorage.setItem("devam-motion-mode", mode); } catch { /* Preference remains session-local. */ }
  };

  return (
    <main className={styles.shell} data-motion={motionMode}>
      <div className={styles.cosmos} aria-hidden="true">
        <span className={styles.nebulaBand} />
        <span className={styles.starsFar} />
        <span className={styles.starsNear} />
      </div>
      <div className={styles.ambient} aria-hidden="true" />
      <aside className={styles.rail} aria-label="Primary navigation">
        <a className={styles.brand} href="#atlas" aria-label="Devam home">
          <Image className={styles.brandMark} src="/brand/devam-mark.png" alt="" width={46} height={46} priority />
          <span>Devam</span>
        </a>
        <nav className={styles.navList}>
          {navigation.map((item, index) => (
            <Link className={index === 0 ? styles.navActive : styles.navItem} key={item.label} href={item.href}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <Link className={styles.searchButton} href="/search" aria-label="Search Devam"><Icon name="search" /></Link>
        <Link className={styles.avatar} href="/account" aria-label={account.signedIn ? "Open your account" : "Sign in to Devam"}>{account.label}</Link>
      </aside>

      <section className={styles.world} id="atlas" aria-label="The Living Atlas">
        <header className={styles.worldHeader}>
          <div>
            <p className={styles.kicker}>The Living Atlas</p>
            <h1>Where will your curiosity take you?</h1>
          </div>
          <Link className={styles.todayPill} href="/today">
            <span className={styles.sunMark} aria-hidden="true" />
            <span><strong>Today</strong><small>Set your location for Panchang</small></span>
            <Icon name="arrow" size={17} />
          </Link>
        </header>

        <div className={styles.mapStage}>
          <div
            className={`${styles.mapViewport} ${dragging ? styles.dragging : ""}`}
            ref={viewportRef}
            role="region"
            aria-label="Interactive Atlas. Drag to pan; scroll, pinch, or double tap to zoom."
            tabIndex={0}
            onWheel={handleWheel}
            onDoubleClick={(event) => {
              if (lastPointerTypeRef.current !== "touch") zoomAt(event.clientX, event.clientY, 1.4);
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
          >
            <div
              className={styles.sceneCanvas}
              data-testid="atlas-scene"
              data-atlas-layer={atlasLayer}
              data-view-x={Math.round(view.x)}
              data-view-y={Math.round(view.y)}
              data-view-scale={view.scale}
              style={{ transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})` }}
            >
              <div className={`${styles.atlasBackdrop} ${atlasLayer === "geography" ? styles.geographyBackdrop : ""}`} aria-hidden="true">
                <Image
                  src="/atlas/atlas-cosmic-night-v1.png"
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 720px) 100vw, calc(100vw - 92px)"
                />
              </div>
              {atlasLayer === "geography" && (
                <svg className={styles.indiaMap} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="india-land" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="rgba(195, 151, 83, .24)" />
                      <stop offset=".55" stopColor="rgba(39, 92, 88, .26)" />
                      <stop offset="1" stopColor="rgba(12, 32, 43, .14)" />
                    </linearGradient>
                    <filter id="land-glow"><feGaussianBlur stdDeviation="1.5" /></filter>
                  </defs>
                  <path className={styles.indiaGlow} d="M43 8L48 12 52 18 56 25 61 30 63 34 68 35 70 40 66 44 62 46 60 56 57 63 56 71 54 82 52 95 50 87 48 78 46 70 44 64 42 57 40 50 39 42 40 34 41 26 42 17Z" />
                  <path className={styles.indiaLand} d="M43 8L48 12 52 18 56 25 61 30 63 34 68 35 70 40 66 44 62 46 60 56 57 63 56 71 54 82 52 95 50 87 48 78 46 70 44 64 42 57 40 50 39 42 40 34 41 26 42 17Z" />
                  <path className={styles.landContour} d="M41 25Q49 30 58 26M40 42Q51 47 65 39M42 57Q51 61 59 54M46 70Q51 71 56 67" />
                  <path className={styles.riverLine} d="M49 18Q53 29 57 35T61 51" />
                  <text className={styles.seaLabel} x="25" y="68">ARABIAN SEA</text>
                  <text className={styles.seaLabel} x="64" y="70">BAY OF BENGAL</text>
                </svg>
              )}
              <svg className={styles.mapLines} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                {atlasLayer === "universe" && <>
                  <path className={styles.ambientEdge} d="M3 67C24 35 39 14 57 38S78 72 98 21" />
                  <path className={styles.ambientEdge} d="M8 20C29 44 43 72 61 55S83 30 95 68" />
                </>}
                {atlasLayer === "universe" && worldEdges.map((edge, index) => {
                  const from = points[edge.from];
                  const to = points[edge.to];
                  const endpointNodes = [edge.from, edge.to].map((id) => worldNodes.find((candidate) => candidate.id === id));
                  const visible = endpointNodes.every((node) => !node || (view.scale >= node.revealAt && node.eras.includes(activeEra)));
                  const highlighted = focusedId === edge.from || focusedId === edge.to;
                  const bend = index % 2 === 0 ? -7 : 7;
                  const midX = (from.x + to.x) / 2;
                  const midY = (from.y + to.y) / 2 + bend;
                  return (
                    <path
                      className={`${styles.relationshipEdge} ${highlighted ? styles.edgeHighlighted : ""} ${visible ? "" : styles.edgeHidden}`}
                      d={`M${from.x} ${from.y} Q${midX} ${midY} ${to.x} ${to.y}`}
                      key={edge.id}
                    />
                  );
                })}
                {atlasLayer === "geography" && placeThreads.flatMap((thread) => thread.nodeIds.slice(1).map((nodeId, index) => {
                  const from = geographyPoints[thread.nodeIds[index]];
                  const to = geographyPoints[nodeId];
                  if (!from || !to) return null;
                  const active = thread.gatewayId === selected.id;
                  return <path className={`${styles.geographyRoute} ${active ? styles.geographyRouteActive : ""}`} d={`M${from.x} ${from.y} Q${(from.x + to.x) / 2} ${(from.y + to.y) / 2 - 4} ${to.x} ${to.y}`} key={`${thread.gatewayId}-${nodeId}`} />;
                }))}
              </svg>
              {atlasLayer === "universe" && <div className={styles.rangeGlow} aria-hidden="true" />}

              {worldNodes.map((node) => {
                const isGeographic = Boolean(node.geography);
                const visible = node.eras.includes(activeEra) && (atlasLayer === "geography" ? isGeographic : view.scale >= node.revealAt);
                const active = node.id === focusedId;
                const nodePosition = atlasLayer === "geography" && node.geography ? node.geography.position : node.position;
                return (
                  <button
                    className={`${styles.worldNode} ${atlasLayer === "geography" ? styles.geographyNode : ""} ${atlasLayer === "geography" && node.gatewayId !== selected.id ? styles.geographyContextNode : ""} ${node.size === "major" ? styles.majorNode : ""} ${active ? styles.nodeActive : ""} ${visible ? "" : styles.nodeHidden}`}
                    key={node.id}
                    style={{ left: `${nodePosition.x}%`, top: `${nodePosition.y}%` }}
                    type="button"
                    onClick={() => {
                      setFocusedId(node.id);
                      setSelectedId(node.gatewayId);
                    }}
                    aria-label={`${node.label}, ${node.kind}`}
                    title={atlasLayer === "geography" ? `${node.label} · ${node.geography?.region}` : undefined}
                    aria-hidden={!visible}
                    tabIndex={visible ? 0 : -1}
                  >
                    <span className={styles.nodeDot} />
                    <span className={styles.nodeLabel}><strong>{node.label}</strong>{atlasLayer === "geography" && <small>{node.geography?.region}</small>}</span>
                  </button>
                );
              })}

              {atlasLayer === "universe" && gateways.map((gateway) => {
                const active = gateway.id === selected.id;
                return (
                  <button
                    className={`${styles.gateway} ${styles[gateway.tone]} ${active ? styles.gatewayActive : ""}`}
                    key={gateway.id}
                    style={{ left: `${gateway.position.x}%`, top: `${gateway.position.y}%` }}
                    type="button"
                    onClick={() => selectGateway(gateway.id)}
                    aria-pressed={active}
                    aria-label={`Explore ${gateway.title}`}
                  >
                    <span className={styles.gatewayHalo} />
                    <span className={styles.gatewaySymbol} aria-hidden="true">
                      {gateway.id === "ramayana" ? "⌁" : gateway.id === "ganesha" ? "ॐ" : gateway.id === "diwali" ? "✺" : "✦"}
                    </span>
                    <span className={styles.gatewayCopy}>
                      <strong>{gateway.title}</strong>
                      <em>{gateway.devanagari}</em>
                    </span>
                  </button>
                );
              })}

            </div>
          </div>

          <div className={styles.layerControl} role="group" aria-label="Atlas layer">
            <button type="button" aria-pressed={atlasLayer === "universe"} onClick={() => chooseAtlasLayer("universe")}>Knowledge universe</button>
            <button type="button" aria-pressed={atlasLayer === "geography"} onClick={() => chooseAtlasLayer("geography")}><Icon name="place" size={13} /> Sacred geography</button>
            <small>{atlasLayer === "geography" ? "Illustrative positions · not a navigation map" : "Texts, practices, places, and relationships"}</small>
            {atlasLayer === "geography" && (
              <div className={styles.geographyWorlds} aria-label="Choose a hero-world place thread">
                {gateways.map((gateway) => (
                  <button type="button" aria-pressed={selected.id === gateway.id} onClick={() => selectGateway(gateway.id)} key={gateway.id}>{gateway.title}</button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.viewControls}>
            <div className={styles.zoomControls} role="group" aria-label={`Atlas zoom controls, ${Math.round(view.scale * 100)}%`}>
              <button type="button" onClick={() => zoomFromCenter(1.22)} aria-label="Zoom in"><Icon name="plus" size={17} /></button>
              <button type="button" onClick={() => zoomFromCenter(0.82)} aria-label="Zoom out"><Icon name="minus" size={17} /></button>
              <button type="button" onClick={resetView} aria-label="Reset map view"><Icon name="reset" size={15} /></button>
              <span>{Math.round(view.scale * 100)}%</span>
            </div>
            <button
              className={styles.motionToggle}
              type="button"
              aria-expanded={motionMenuOpen}
              aria-haspopup="menu"
              onClick={() => setMotionMenuOpen((open) => !open)}
            >
              <Icon name="motion" size={15} />
              <span>{motionMode}</span>
            </button>
            <button
              className={styles.placeThreadToggle}
              type="button"
              aria-label="Place thread"
              aria-expanded={placeThreadOpen}
              aria-haspopup="dialog"
              onClick={() => setPlaceThreadOpen((open) => !open)}
            >
              <Icon name="place" size={15} />
              <span>Place thread</span>
            </button>
            {motionMenuOpen && (
              <div className={styles.motionMenu} role="menu" aria-label="Motion preference">
                {(["cinematic", "gentle", "still"] as const).map((mode) => (
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={motionMode === mode}
                    key={mode}
                    onClick={() => chooseMotion(mode)}
                  >
                    <strong>{mode}</strong>
                    <small>{mode === "cinematic" ? "Full atmosphere" : mode === "gentle" ? "Fades and direct motion" : "Ambient motion paused"}</small>
                  </button>
                ))}
              </div>
            )}
            {placeThreadOpen && selectedPlaceThread && (
              <div className={styles.placeThreadPanel} role="dialog" aria-label={`${selected.title} place thread`}>
                <p>Guided place thread</p>
                <h2>{selectedPlaceThread.title}</h2>
                <span>{selectedPlaceThread.invitation}</span>
                <ol>
                  {selectedPlaceThread.nodeIds.map((nodeId, index) => {
                    const node = worldNodes.find((candidate) => candidate.id === nodeId);
                    if (!node) return null;
                    return (
                      <li key={nodeId}>
                        <button type="button" onClick={() => focusPlaceNode(nodeId)}>
                          <small>{String(index + 1).padStart(2, "0")}</small>
                          <strong>{node.label}</strong>
                          <span>{node.kind}</span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
                <small>{selectedPlaceThread.evidenceBoundary}</small>
              </div>
            )}
          </div>
          <p className={styles.gestureHint}>{atlasLayer === "geography" ? "Place positions are approximate · boundaries remain evidence-scoped" : "Drag to move · Scroll or pinch to look closer"}</p>

          <div className={styles.eraControl} aria-label="Explore by era">
            <span className={styles.eraTitle}>Across time</span>
            <div className={styles.eraTrack}>
              {eras.map((era) => (
                <button
                  className={activeEra === era ? styles.eraActive : styles.eraButton}
                  key={era}
                  type="button"
                  onClick={() => {
                    setActiveEra(era);
                    if (focusedNode && !focusedNode.eras.includes(era)) setFocusedId(selectedId);
                  }}
                  aria-pressed={activeEra === era}
                >
                  <span />{era}
                </button>
              ))}
            </div>
          </div>
        </div>

        <section className={`${styles.discoveryCard} ${styles[selected.tone]} ${focusedNode ? styles.nodeDiscoveryCard : ""}`} aria-live="polite">
          <div className={styles.cardIndex}>{focusedNode ? "\u00b7" : `0${gateways.findIndex((gateway) => gateway.id === selected.id) + 1}`}</div>
          <div className={styles.cardMain}>
            {focusedNode ? <p className={styles.cardEyebrow}>{focusedNode.kind} \u00b7 {activeEra}</p> : null}
            <h2>{focusedNode?.label ?? selected.title} {!focusedNode && <span>{selected.devanagari}</span>}</h2>
            {focusedNode ? <p className={styles.nodeSummary}>{focusedNode.summary}</p> : null}
          </div>
          <div className={styles.threadList} aria-label="Connected paths">
            {(focusedNode ? focusedConnections : selected.threads).map((thread) => <span key={thread}>{thread}</span>)}
            {focusedNode ? <span>{selected.title} world</span> : null}
          </div>
          {focusedNode ? (
            <div className={styles.nodeActions}>
              <Link href={`/search?q=${encodeURIComponent(focusedNode.searchQuery)}`}>Search this thread</Link>
              <Link className={styles.enterButton} href={`/journeys/${selected.id}`}>Enter {selected.title}<Icon name="arrow" /></Link>
              <Link href={`/sarthi?q=${encodeURIComponent(`Tell me about ${focusedNode.label}`)}&node=${focusedNode.id}`}>Ask Sarthi</Link>
              <small>{focusedNode.evidenceBoundary}</small>
            </div>
          ) : (
            <Link className={styles.enterButton} href={`/journeys/${selected.id}`}>{selected.invitation}<Icon name="arrow" /></Link>
          )}
        </section>
      </section>

      <button className={styles.sarthiOrb} type="button" onClick={() => setSarthiOpen(true)} aria-label="Ask Sarthi">
        <span className={styles.orbLight}><Icon name="spark" size={25} /></span>
        <span><strong>Ask Sarthi</strong><small>Your guide is here</small></span>
      </button>

      <aside className={`${styles.sarthiPanel} ${sarthiOpen ? styles.panelOpen : ""}`} aria-hidden={!sarthiOpen} aria-label="Sarthi conversation">
        <header className={styles.panelHeader}>
          <div className={styles.sarthiIdentity}>
            <span><Icon name="spark" /></span>
            <div><strong>Sarthi</strong><small>Your companion through Devam</small></div>
          </div>
          <button type="button" onClick={() => setSarthiOpen(false)} aria-label="Close Sarthi"><Icon name="close" /></button>
        </header>
        <div className={styles.conversation}>
          <p className={styles.contextLabel}>Exploring · {conversationSubject}</p>
          <div className={styles.sarthiMessage}>
            <p>Namaste. We can explore {conversationSubject}, or you can tell me what is on your mind.</p>
            <span>Grounded preview</span>
          </div>
          {askedQuestion && <div className={styles.userMessage}><p>{askedQuestion}</p></div>}
          {sarthiBusy && <div className={styles.sarthiMessage} aria-live="polite"><p>Looking through the available evidence…</p></div>}
          {sarthiReply && (
            <div className={styles.sarthiMessage} aria-live="polite">
              <p>{sarthiReply.ok ? sarthiReply.answer : sarthiReply.message}</p>
              {sarthiReply.ok && sarthiReply.practiceGuide ? (
                <details className={`${styles.evidenceDetails} ${styles.practiceDetails}`}>
                  <summary>{sarthiReply.practiceGuide.kind === "user_complete_observance_lane" ? "Open the complete guide for this context" : "Open the contextual practice guide"}</summary>
                  <p>{sarthiReply.practiceGuide.summary}</p>
                  {sarthiReply.practiceGuide.userCompleteContext ? (
                    <details>
                      <summary>Meaning, stories and typical practice</summary>
                      <strong>Why it matters</strong>
                      <p>{sarthiReply.practiceGuide.userCompleteContext.significance.text}</p>
                      {sarthiReply.practiceGuide.userCompleteContext.originNarratives.map((narrative) => (
                        <p key={narrative.narrativeId}><strong>{narrative.title}</strong><br />{narrative.summary}</p>
                      ))}
                      {sarthiReply.practiceGuide.userCompleteContext.typicalPractices.map((practice) => (
                        <p key={practice.practiceId}><strong>{practice.populationScope}</strong><br />{practice.description}</p>
                      ))}
                    </details>
                  ) : null}
                  {sarthiReply.practiceGuide.tiers.map((tier, index) => (
                    <details key={tier.tier} open={index === 0}>
                      <summary>{tier.tier} · about {tier.estimatedMinutes} minutes</summary>
                      <strong>{tier.label}</strong>
                      <ol>
                        {tier.steps.map((step) => <li key={step.ordinal}><span>{step.ordinal}</span><p>{step.instruction}</p></li>)}
                      </ol>
                    </details>
                  ))}
                  {sarthiReply.practiceGuide.dailySequence?.length ? (
                    <details>
                      <summary>Ten-day reflection path</summary>
                      <ol>
                        {sarthiReply.practiceGuide.dailySequence.map((day) => (
                          <li key={day.ordinal}><span>{day.ordinal}</span><p><strong>{day.commonName}</strong><br />{day.reflection}</p></li>
                        ))}
                      </ol>
                    </details>
                  ) : null}
                  <small>{sarthiReply.practiceGuide.familyPracticeNote}</small>
                </details>
              ) : null}
              {sarthiReply.ok && sarthiReply.citations?.length ? (
                <details className={styles.evidenceDetails}>
                  <summary>Why Sarthi says this · {sarthiReply.citations.length} passage{sarthiReply.citations.length === 1 ? "" : "s"}</summary>
                  {sarthiReply.citations.map((citation) => (
                    <article key={citation.passageId}>
                      <strong>{citation.workTitle} · unit {citation.sourceOrdinal}</strong>
                      {citation.quotation && <blockquote>{citation.quotation}</blockquote>}
                      <small>{citation.editionTitle}</small>
                    </article>
                  ))}
                  {sarthiReply.sourceBoundary && <p className={styles.sourceBoundary}>{sarthiReply.sourceBoundary}</p>}
                </details>
              ) : null}
              {sarthiReply.ok && !sarthiReply.citations?.length && sarthiReply.sourceBoundary
                ? <p className={styles.sourceBoundary}>{sarthiReply.sourceBoundary}</p>
                : null}
              {sarthiReply.conversation?.status === "saved" ? <small className={styles.memoryStatus}>Saved to your private conversation history</small> : null}
              {sarthiReply.conversation?.status === "consent_required" ? <Link className={styles.memoryStatus} href="/account">Enable memory in your account</Link> : null}
            </div>
          )}
          <div className={styles.prompts}>
            <button type="button" disabled={sarthiBusy} onClick={() => void askSarthi("Why is this relevant when life feels blocked?")}>Why is this relevant today?</button>
            <button type="button" disabled={sarthiBusy} onClick={() => void askSarthi(`Tell me about ${conversationSubject} simply`)}>Tell me simply</button>
            {selected.id === "ganesha" ? (
              <button type="button" disabled={sarthiBusy} onClick={() => void askSarthi("What should I do for Ganesh Chaturthi at home?")}>Ganesh Chaturthi at home</button>
            ) : selected.id === "durga" ? (
              <button type="button" disabled={sarthiBusy} onClick={() => void askSarthi("What should I do for Navaratri at home?")}>Navaratri at home</button>
            ) : (
              <button type="button" disabled={sarthiBusy} onClick={() => void askSarthi("How is the Valmiki Ramayana structured?")}>Explore the seven books</button>
            )}
          </div>
        </div>
        <form className={styles.composer} onSubmit={(event) => { event.preventDefault(); void askSarthi(query); }}>
          <label className="srOnly" htmlFor="sarthi-query">Ask Sarthi anything</label>
          <textarea id="sarthi-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ask about a story, ritual, or something in your life…" rows={2} />
          <button type="submit" aria-label="Send message" disabled={sarthiBusy || query.trim().length < 2}><Icon name="arrow" /></button>
        </form>
        <p className={styles.prototypeNote}>Live source-grounded library retrieval and bounded household-practice guidance · Coverage keeps expanding</p>
      </aside>
      {signInPrompt ? (
        <section className={styles.signInPrompt} role="dialog" aria-modal="true" aria-labelledby="preview-title">
          <span className={styles.promptMark}><Icon name="spark" size={23} /></span>
          <p>Keep your place in Devam</p>
          <h2 id="preview-title">{signInPrompt === "sarthi" ? "Continue your conversation with Sarthi." : "You have opened the guest preview."}</h2>
          <span>{signInPrompt === "sarthi" ? "Create a free account for continued guidance and to choose whether Sarthi may remember useful context." : "Create a free account to continue across the universe and return to your journeys, preferences, and Sarthi context."}</span>
          <Link href="/account">Continue with email <Icon name="arrow" size={17} /></Link>
          <button type="button" onClick={() => setSignInPrompt(null)}>Not now</button>
        </section>
      ) : null}
      {sarthiOpen && <button className={styles.scrim} onClick={() => setSarthiOpen(false)} type="button" aria-label="Close Sarthi panel" />}
      {signInPrompt && <button className={styles.previewScrim} onClick={() => setSignInPrompt(null)} type="button" aria-label="Close account invitation" />}

      <nav className={styles.mobileNav} aria-label="Primary navigation">
        {navigation.map((item, index) => (
          <Link className={index === 0 ? styles.mobileActive : ""} key={item.label} href={item.href}>
            <Icon name={item.icon} size={19} /><span>{item.label}</span>
          </Link>
        ))}
        <Link href="/account"><Icon name="user" size={19} /><span>{account.signedIn ? "You" : "Sign in"}</span></Link>
      </nav>
    </main>
  );
}
