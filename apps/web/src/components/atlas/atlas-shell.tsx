"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { canGuestAskSarthi, canGuestOpenGateway } from "@/lib/account/guest-preview";
import { trackProductEvent } from "@/lib/analytics/client";
import { worldNodeFamilyLabels, worldRelationLabels, type Gateway, type PlaceThread, type WorldEdge, type WorldNode } from "../../lib/domain/atlas";
import type { RitualProcedureGuide } from "@/lib/domain/practice";
import {
  ATLAS_MAX_SCALE,
  ATLAS_MIN_SCALE,
  constrainAtlasView,
  focusAtlasPosition,
  type AtlasPoint as Point,
  type AtlasView as ViewTransform,
} from "./atlas-camera";
import { advanceAtlasTrail, atlasDepthLabels, atlasNodeZoomCompensation, preferAtlasEdgeForAnchor, resolveAtlasDepth } from "./atlas-navigation";
import styles from "./atlas-shell.module.css";

type AtlasShellProps = {
  eras: readonly string[];
  gateways: Gateway[];
  placeThreads: PlaceThread[];
  worldEdges: WorldEdge[];
  worldNodes: WorldNode[];
  account: { signedIn: boolean; label: string };
};

type MotionMode = "cinematic" | "still";
type IconName = "arrow" | "close" | "minus" | "plus" | "reset" | "search" | "spark" | "user";
type SarthiCitation = { passageId: string; workTitle: string; editionTitle: string; quotation?: string };
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

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M5 12h14"/><path d="m14 7 5 5-5 5"/></>,
    close: <><path d="m6 6 12 12"/><path d="M18 6 6 18"/></>,
    minus: <path d="M5 12h14"/>,
    plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    reset: <><path d="M4 12a8 8 0 1 0 2.3-5.7L4 8.6"/><path d="M4 4v4.6h4.6"/></>,
    search: <><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></>,
    spark: <><path d="M12 2c.8 5.1 3.3 7.6 8 8-4.7.4-7.2 2.9-8 8-.8-5.1-3.3-7.6-8-8 4.7-.4 7.2-2.9 8-8Z"/><path d="M19 16c.3 1.9 1.2 2.8 3 3-1.8.2-2.7 1.1-3 3-.3-1.9-1.2-2.8-3-3 1.8-.2 2.7-1.1 3-3Z"/></>,
    user: <><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function gatewayStory(id: Gateway["id"]) {
  const copy: Record<Gateway["id"], { eyebrow: string; story: string; action: string }> = {
    ramayana: {
      eyebrow: "Epic world · seven realms",
      story: "Walk from Ayodhya into exile, across forests and oceans, and toward the battle for Lanka.",
      action: "Begin the return journey",
    },
    ganesha: {
      eyebrow: "World of beginnings",
      story: "Discover the remover of obstacles through stories, symbols, devotion, and living celebration.",
      action: "Enter Ganesha's world",
    },
    durga: {
      eyebrow: "The luminous goddess",
      story: "Enter the world where the gods' radiance gathers, the buffalo demon rises, and the Goddess answers.",
      action: "Awaken the Devi world",
    },
    diwali: {
      eyebrow: "A constellation of lights",
      story: "Travel through stories of return, courage, abundance, kinship, and many living traditions of light.",
      action: "Follow the lights",
    },
    "sacred-time": {
      eyebrow: "The living festival year",
      story: "Move through the September-to-December sky by date, region, story, place, and living practice without flattening distinct traditions.",
      action: "Enter sacred time",
    },
  };
  return copy[id];
}

export function AtlasShell({ gateways, worldEdges, worldNodes, account }: AtlasShellProps) {
  const [selectedId, setSelectedId] = useState<Gateway["id"] | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [sarthiOpen, setSarthiOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [askedQuestion, setAskedQuestion] = useState("");
  const [sarthiReply, setSarthiReply] = useState<SarthiReply | null>(null);
  const [sarthiBusy, setSarthiBusy] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [motionMode, setMotionMode] = useState<MotionMode>("cinematic");
  const [signInPrompt, setSignInPrompt] = useState<"gateway" | "sarthi" | null>(null);
  const [view, setView] = useState<ViewTransform>({ x: 0, y: 0, scale: 1 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [traveling, setTraveling] = useState(false);
  const [travelTrail, setTravelTrail] = useState<string[]>([]);
  const [discoveredIds, setDiscoveredIds] = useState<Set<string>>(() => new Set());
  const viewRef = useRef(view);
  const viewportRef = useRef<HTMLDivElement>(null);
  const sceneCanvasRef = useRef<HTMLDivElement>(null);
  const pointersRef = useRef(new Map<number, Point>());
  const panStartRef = useRef<{ pointer: Point; view: ViewTransform } | null>(null);
  const pinchStartRef = useRef<{ distance: number; midpoint: Point; view: ViewTransform } | null>(null);
  const lastTapRef = useRef(0);
  const wasDraggedRef = useRef(false);
  const visitedGatewaysRef = useRef(new Set<string>(["ramayana"]));
  const guestSarthiExchangesRef = useRef(0);
  const travelTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    trackProductEvent("atlas_opened", undefined, { oncePerSession: true });
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motionSync = window.setTimeout(() => {
      if (media.matches) setMotionMode("still");
    }, 0);
    return () => {
      window.clearTimeout(motionSync);
    };
  }, []);

  useEffect(() => () => {
    if (travelTimeoutRef.current !== null) window.clearTimeout(travelTimeoutRef.current);
  }, []);

  useEffect(() => {
    if (account.signedIn) return;
    try {
      const saved = JSON.parse(window.localStorage.getItem("devam-guest-gateways") ?? "[]");
      if (Array.isArray(saved)) visitedGatewaysRef.current = new Set(saved.filter((value): value is string => typeof value === "string"));
      visitedGatewaysRef.current.add("ramayana");
    } catch {
      visitedGatewaysRef.current = new Set(["ramayana"]);
    }
    const completed = Number(window.localStorage.getItem("devam-guest-sarthi-exchanges") ?? "0");
    guestSarthiExchangesRef.current = Number.isSafeInteger(completed) && completed > 0 ? completed : 0;
  }, [account.signedIn]);

  const selected = useMemo(
    () => gateways.find((gateway) => gateway.id === selectedId) ?? null,
    [gateways, selectedId],
  );
  const focusedNode = useMemo(
    () => worldNodes.find((node) => node.id === focusedId) ?? null,
    [focusedId, worldNodes],
  );
  const selectedStory = selected ? gatewayStory(selected.id) : null;
  const conversationSubject = focusedNode?.label ?? selected?.title ?? "the Devam universe";
  const atlasDepth = resolveAtlasDepth(Boolean(selectedId), view.scale);
  const points = useMemo(() => {
    const result: Record<string, Point> = {};
    gateways.forEach((gateway) => { result[gateway.id] = gateway.position; });
    worldNodes.forEach((node) => { result[node.id] = node.position; });
    return result;
  }, [gateways, worldNodes]);

  const connectedPaths = useMemo(() => {
    const anchorId = focusedId ?? selectedId;
    if (!anchorId) return [];
    const gatewayById = new Map<string, (typeof gateways)[number]>(
      gateways.map((gateway) => [gateway.id, gateway]),
    );
    const nodeById = new Map<string, (typeof worldNodes)[number]>(
      worldNodes.map((node) => [node.id, node]),
    );
    const anchorGateway = gatewayById.get(anchorId)?.id ?? nodeById.get(anchorId)?.gatewayId;
    const unique = new Map<string, {
      edge: WorldEdge;
      destinationId: string;
      label: string;
      kind: string;
      crossWorld: boolean;
    }>();
    for (const edge of worldEdges) {
      const destinationId = edge.from === anchorId ? edge.to : edge.to === anchorId ? edge.from : null;
      if (!destinationId) continue;
      const current = unique.get(destinationId);
      if (current && !preferAtlasEdgeForAnchor(current.edge, edge, anchorId)) continue;
      const gateway = gatewayById.get(destinationId);
      const node = nodeById.get(destinationId);
      if (!gateway && !node) continue;
      const destinationGateway = gateway?.id ?? node?.gatewayId;
      unique.set(destinationId, {
        edge,
        destinationId,
        label: gateway?.title ?? node!.label,
        kind: gateway ? "World" : node!.kind,
        crossWorld: Boolean(anchorGateway && destinationGateway && anchorGateway !== destinationGateway),
      });
    }
    return [...unique.values()].sort((left, right) => Number(right.crossWorld) - Number(left.crossWorld));
  }, [focusedId, gateways, selectedId, worldEdges, worldNodes]);

  const connectedNodeIds = useMemo(
    () => new Set(connectedPaths.filter((path) => worldNodes.some((node) => node.id === path.destinationId)).map((path) => path.destinationId)),
    [connectedPaths, worldNodes],
  );

  const trailItems = useMemo(() => {
    const labels = new Map<string, string>([
      ...gateways.map((gateway) => [gateway.id, gateway.title] as const),
      ...worldNodes.map((node) => [node.id, node.label] as const),
    ]);
    return travelTrail.map((id) => ({ id, label: labels.get(id) ?? id }));
  }, [gateways, travelTrail, worldNodes]);

  const registerTravel = useCallback((destinationId: string) => {
    setTravelTrail((current) => advanceAtlasTrail(current, destinationId));
    setDiscoveredIds((current) => {
      if (current.has(destinationId)) return current;
      const next = new Set(current);
      next.add(destinationId);
      return next;
    });
    setTraveling(false);
    window.requestAnimationFrame(() => setTraveling(true));
    if (travelTimeoutRef.current !== null) window.clearTimeout(travelTimeoutRef.current);
    travelTimeoutRef.current = window.setTimeout(() => setTraveling(false), 720);
  }, []);

  const readViewport = useCallback(() => {
    const viewport = viewportRef.current;
    const scene = sceneCanvasRef.current;
    if (!viewport || !scene) return undefined;
    return {
      width: viewport.clientWidth,
      height: viewport.clientHeight,
      sceneWidth: scene.clientWidth,
      sceneHeight: scene.clientHeight,
    };
  }, []);

  const commitView = useCallback((next: ViewTransform) => {
    const bounded = constrainAtlasView(next, readViewport());
    viewRef.current = bounded;
    setView(bounded);
  }, [readViewport]);

  useEffect(() => {
    const reframe = () => commitView(viewRef.current);
    window.addEventListener("resize", reframe);
    return () => window.removeEventListener("resize", reframe);
  }, [commitView]);

  const zoomAt = useCallback((clientX: number, clientY: number, factor: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const rect = viewport.getBoundingClientRect();
    const current = viewRef.current;
    const nextScale = clamp(current.scale * factor, ATLAS_MIN_SCALE, ATLAS_MAX_SCALE);
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

  const resetView = useCallback(() => {
    pointersRef.current.clear();
    panStartRef.current = null;
    pinchStartRef.current = null;
    wasDraggedRef.current = false;
    commitView({ x: 0, y: 0, scale: 1 });
    setTilt({ x: 0, y: 0 });
    setDragging(false);
    setSelectedId(null);
    setFocusedId(null);
    setTravelTrail([]);
  }, [commitView]);

  const focusAt = useCallback((position: Point, scale: number) => {
    const viewport = readViewport();
    if (!viewport) return;
    const focus = viewport.width <= 760 ? { x: 0.5, y: 0.32 } : { x: 0.5, y: 0.46 };
    commitView(focusAtlasPosition(position, scale, viewport, focus));
  }, [commitView, readViewport]);

  const selectGateway = useCallback((gateway: Gateway) => {
    if (wasDraggedRef.current) return;
    const gatewayId = gateway.id;
    const visited = visitedGatewaysRef.current;
    if (!canGuestOpenGateway(visited, gatewayId, account.signedIn)) {
      setSignInPrompt("gateway");
      return;
    }
    visited.add(gatewayId);
    if (!account.signedIn) {
      try { window.localStorage.setItem("devam-guest-gateways", JSON.stringify([...visited])); } catch { /* Session remains usable. */ }
    }
    setIntroVisible(false);
    setSelectedId(gatewayId);
    setFocusedId(gatewayId);
    registerTravel(gatewayId);
    focusAt(gateway.position, 1.34);
    trackProductEvent("atlas_gateway_opened", gatewayId);
  }, [account.signedIn, focusAt, registerTravel]);

  const selectWorldNode = useCallback((node: WorldNode) => {
    if (wasDraggedRef.current) return;
    setIntroVisible(false);
    setSelectedId(node.gatewayId);
    setFocusedId(node.id);
    registerTravel(node.id);
    focusAt(node.position, Math.max(1.72, node.revealAt + .3));
  }, [focusAt, registerTravel]);

  const followConnection = useCallback((destinationId: string) => {
    const gateway = gateways.find((candidate) => candidate.id === destinationId);
    if (gateway) {
      selectGateway(gateway);
      return;
    }
    const node = worldNodes.find((candidate) => candidate.id === destinationId);
    if (node) selectWorldNode(node);
  }, [gateways, selectGateway, selectWorldNode, worldNodes]);

  const followPreviousDiscovery = useCallback(() => {
    const previousId = travelTrail.at(-2);
    if (previousId) followConnection(previousId);
  }, [followConnection, travelTrail]);

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    zoomAt(event.clientX, event.clientY, Math.exp(-event.deltaY * .0012));
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const captureTarget = event.target as Element & { setPointerCapture?: (pointerId: number) => void };
    captureTarget.setPointerCapture?.(event.pointerId);
    wasDraggedRef.current = false;
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointersRef.current.size === 1) {
      panStartRef.current = { pointer: { x: event.clientX, y: event.clientY }, view: { ...viewRef.current } };
      setDragging(true);
      setIntroVisible(false);
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
    const viewport = viewportRef.current;
    if (!pointersRef.current.has(event.pointerId)) {
      if (!viewport || event.pointerType === "touch" || motionMode === "still") return;
      const rect = viewport.getBoundingClientRect();
      setTilt({
        x: clamp(((event.clientY - rect.top) / rect.height - .5) * -5, -2.5, 2.5),
        y: clamp(((event.clientX - rect.left) / rect.width - .5) * 7, -3.5, 3.5),
      });
      return;
    }
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointersRef.current.size === 2 && pinchStartRef.current && viewport) {
      const [a, b] = [...pointersRef.current.values()];
      const start = pinchStartRef.current;
      const distance = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
      const nextScale = clamp(start.view.scale * distance / start.distance, ATLAS_MIN_SCALE, ATLAS_MAX_SCALE);
      const ratio = nextScale / start.view.scale;
      const rect = viewport.getBoundingClientRect();
      const localX = start.midpoint.x - rect.left;
      const localY = start.midpoint.y - rect.top;
      commitView({ x: localX - (localX - start.view.x) * ratio, y: localY - (localY - start.view.y) * ratio, scale: nextScale });
    } else if (pointersRef.current.size === 1 && panStartRef.current) {
      const start = panStartRef.current;
      const deltaX = event.clientX - start.pointer.x;
      const deltaY = event.clientY - start.pointer.y;
      if (Math.hypot(deltaX, deltaY) > 5) wasDraggedRef.current = true;
      commitView({ ...start.view, x: start.view.x + deltaX, y: start.view.y + deltaY });
    }
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const wasSingleTouch = event.pointerType === "touch" && pointersRef.current.size === 1;
    pointersRef.current.delete(event.pointerId);
    if (wasSingleTouch && !wasDraggedRef.current) {
      const now = Date.now();
      if (now - lastTapRef.current < 320) {
        zoomAt(event.clientX, event.clientY, 1.42);
        lastTapRef.current = 0;
      } else lastTapRef.current = now;
    }
    if (pointersRef.current.size < 2) pinchStartRef.current = null;
    if (pointersRef.current.size === 0) {
      panStartRef.current = null;
      setDragging(false);
    }
    window.setTimeout(() => { wasDraggedRef.current = false; }, 0);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const current = viewRef.current;
    const step = event.shiftKey ? 90 : 46;
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") commitView({ ...current, x: current.x + step });
    else if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") commitView({ ...current, x: current.x - step });
    else if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") commitView({ ...current, y: current.y + step });
    else if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") commitView({ ...current, y: current.y - step });
    else return;
    event.preventDefault();
    setIntroVisible(false);
  };

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
    trackProductEvent("sarthi_question_submitted", "atlas");
    try {
      const response = await fetch("/api/sarthi", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: normalized, context: { atlasNodeSlug: focusedNode?.id ?? selected?.id, ...(conversationId ? { conversationId } : {}) } }),
      });
      const reply = await response.json() as SarthiReply;
      setSarthiReply(reply);
      if (reply.conversation?.status === "saved" && reply.conversation.conversationId) setConversationId(reply.conversation.conversationId);
      if (response.ok && !account.signedIn) {
        guestSarthiExchangesRef.current += 1;
        window.localStorage.setItem("devam-guest-sarthi-exchanges", String(guestSarthiExchangesRef.current));
      }
      setQuery("");
    } catch {
      setSarthiReply({ ok: false, message: "I couldn't reach the evidence service. Please try again." });
    } finally {
      setSarthiBusy(false);
    }
  }, [account.signedIn, conversationId, focusedNode, sarthiBusy, selected]);

  const sceneStyle = {
    "--camera-x": `${view.x}px`,
    "--camera-y": `${view.y}px`,
    "--camera-scale": view.scale,
    "--tilt-x": `${tilt.x}deg`,
    "--tilt-y": `${tilt.y}deg`,
    "--star-x": `${view.x * .035}px`,
    "--star-y": `${view.y * .035}px`,
    "--star-x-far": `${view.x * .01575}px`,
    "--star-y-far": `${view.y * .01575}px`,
    "--star-x-soft": `${view.x * .0175}px`,
    "--star-y-soft": `${view.y * .0175}px`,
    "--star-x-reverse": `${view.x * -.028}px`,
    "--star-y-reverse": `${view.y * -.028}px`,
    "--star-x-dust": `${view.x * .0595}px`,
    "--star-y-dust": `${view.y * .0595}px`,
    "--star-x-near": `${view.x * .0805}px`,
    "--star-y-near": `${view.y * .0805}px`,
    "--node-compensation": atlasNodeZoomCompensation(view.scale),
  } as CSSProperties;

  return (
    <main className={`${styles.shell} ${traveling ? styles.traveling : ""}`} data-motion={motionMode} data-depth={atlasDepth} style={sceneStyle}>
      <div className={styles.deepSpace} aria-hidden="true">
        <span className={styles.nebulaA} />
        <span className={styles.nebulaB} />
        <span className={styles.dust} />
        <span className={styles.starsFar} />
        <span className={styles.starsMid} />
        <span className={styles.starsNear} />
        <span className={styles.warpField} />
      </div>

      <header className={styles.hud}>
        <button className={styles.brand} type="button" onClick={resetView} aria-label="Return to the Devam universe">
          <Image src="/brand/devam-mark.png" alt="" width={40} height={40} priority />
          <span><strong>Devam</strong><small>The living universe</small></span>
        </button>
        <div className={styles.hudActions}>
          <Link href="/search" aria-label="Search Devam"><Icon name="search" /></Link>
          <Link href="/account" aria-label={account.signedIn ? "Open your account" : "Sign in"}>{account.signedIn ? account.label : <Icon name="user" />}</Link>
        </div>
      </header>

      <nav className={styles.wayfinder} aria-label="Atlas travel trail">
        <button type="button" onClick={followPreviousDiscovery} disabled={travelTrail.length < 2} aria-label="Return to the previous discovery">
          <span aria-hidden="true">&larr;</span>
        </button>
        <div className={styles.depthReadout}>
          <small>Depth</small>
          <strong>{atlasDepthLabels[atlasDepth]}</strong>
        </div>
        <div className={styles.travelTrail} aria-label="Recent discoveries">
          {trailItems.map((item, index) => (
            <button
              type="button"
              key={item.id}
              onClick={() => followConnection(item.id)}
              aria-current={index === trailItems.length - 1 ? "location" : undefined}
              aria-label={`Travel back to ${item.label}`}
              title={item.label}
            >
              <span />
            </button>
          ))}
        </div>
        <small className={styles.discoveryCount}>{discoveredIds.size} found</small>
      </nav>

      <section
        className={`${styles.viewport} ${dragging ? styles.dragging : ""}`}
        ref={viewportRef}
        role="region"
        aria-label="Interactive Atlas cosmic universe. Drag or use arrow keys to travel; scroll, pinch, or double tap to move through depth."
        tabIndex={0}
        onWheel={handleWheel}
        onDoubleClick={(event) => zoomAt(event.clientX, event.clientY, 1.42)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.cameraRig}>
          <div
            className={styles.sceneCanvas}
            ref={sceneCanvasRef}
            data-testid="atlas-scene"
            data-atlas-layer="universe"
            data-camera-bounded="true"
            data-view-x={Math.round(view.x)}
            data-view-y={Math.round(view.y)}
            data-view-scale={Number(view.scale.toFixed(2))}
          >
            <span className={styles.galacticPlane} aria-hidden="true" />
            <svg className={styles.connections} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {worldEdges.map((edge, index) => {
                const from = points[edge.from];
                const to = points[edge.to];
                if (!from || !to) return null;
                const local = focusedId === edge.from || focusedId === edge.to || selectedId === edge.from || selectedId === edge.to;
                const inWorld = [edge.from, edge.to].some((id) => worldNodes.find((node) => node.id === id)?.gatewayId === selectedId);
                const bridge = Boolean(edge.evidenceBoundary);
                const bend = index % 2 === 0 ? -5 : 5;
                return (
                  <path
                    key={edge.id}
                    className={`${styles.connection} ${styles[`connection_${edge.relationKind}`]} ${local ? styles.connectionActive : ""} ${inWorld ? styles.connectionNearby : ""} ${bridge ? styles.connectionBridge : ""}`}
                    d={`M${from.x} ${from.y} Q${(from.x + to.x) / 2} ${(from.y + to.y) / 2 + bend} ${to.x} ${to.y}`}
                  >
                    <title>{`${worldRelationLabels[edge.relationKind]}: ${edge.relation}`}</title>
                  </path>
                );
              })}
            </svg>

            {worldNodes.map((node, index) => {
              const active = node.id === focusedId;
              const connected = connectedNodeIds.has(node.id);
              const visible = Boolean(selectedId) && (node.gatewayId === selectedId || connected) && (connected || view.scale >= node.revealAt - .18 || active);
              const depth = node.size === "major" ? 58 : 22 + index % 5 * 13;
              return (
                <button
                  className={`${styles.discoveryNode} ${styles[`discovery_${node.family}`]} ${node.size === "major" ? styles.discoveryMajor : ""} ${active ? styles.discoveryActive : ""} ${visible ? styles.discoveryVisible : ""}`}
                  key={node.id}
                  style={{ left: `${node.position.x}%`, top: `${node.position.y}%`, "--node-depth": `${depth}px`, "--delay": `${index * -1.7}s` } as CSSProperties}
                  type="button"
                  onClick={() => selectWorldNode(node)}
                  aria-label={`${node.label}, ${node.kind}`}
                  data-family={node.family}
                  aria-hidden={!visible}
                  tabIndex={visible ? 0 : -1}
                >
                  <span className={styles.discoveryGlow} />
                  <span className={styles.discoveryCore} />
                  <span className={styles.discoveryLabel}><strong>{node.label}</strong><small>{node.kind}</small></span>
                </button>
              );
            })}

            {gateways.map((gateway, index) => {
              const active = gateway.id === selectedId;
              return (
                <button
                  className={`${styles.masterNode} ${styles[gateway.tone]} ${active ? styles.masterActive : ""}`}
                  key={gateway.id}
                  style={{ left: `${gateway.position.x}%`, top: `${gateway.position.y}%`, "--world-depth": `${80 + index * 28}px`, "--orbit-delay": `${index * -4.2}s` } as CSSProperties}
                  type="button"
                  onClick={() => selectGateway(gateway)}
                  aria-pressed={active}
                  aria-label={`Explore ${gateway.title}`}
                >
                  <span className={styles.orbitOuter} />
                  <span className={styles.orbitInner} />
                  <span className={styles.masterGlow} />
                  <span className={styles.masterCore} />
                  <span className={styles.masterLabel}><strong>{gateway.title}</strong><small>{gatewayStory(gateway.id).eyebrow}</small></span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`${styles.arrival} ${introVisible && !selected ? styles.arrivalVisible : ""}`} aria-hidden={!introVisible || Boolean(selected)}>
        <p>THE LIVING UNIVERSE</p>
        <h1>Choose a star.<br />Enter a world.</h1>
        <span>Drag to travel · Scroll or pinch through depth</span>
      </section>

      {(selected || focusedNode) && (
        <section className={styles.discoveryCard} aria-live="polite">
          <button className={styles.cardClose} type="button" onClick={resetView} aria-label="Close discovery"><Icon name="close" size={17} /></button>
          <p>{focusedNode ? `${worldNodeFamilyLabels[focusedNode.family]} · ${focusedNode.kind} · ${selected?.title} world` : selectedStory?.eyebrow}</p>
          <h2>{focusedNode?.label ?? selected?.title}</h2>
          <span>{focusedNode?.summary ?? selectedStory?.story}</span>
          <div className={styles.cardActions}>
            {selected && <Link className={styles.enterWorld} href={`/journeys/${selected.id}`}>{selectedStory?.action}<Icon name="arrow" size={17} /></Link>}
            {focusedNode && <Link href={`/search?q=${encodeURIComponent(focusedNode.searchQuery)}`}>Open evidence</Link>}
          </div>
          {connectedPaths.length ? (
            <div className={styles.connectedPaths}>
              <p>Paths from here</p>
              <div>
                {connectedPaths.map((path) => (
                  <button
                    type="button"
                    onClick={() => followConnection(path.destinationId)}
                    key={path.edge.id}
                    data-relation-kind={path.edge.relationKind}
                    aria-label={`Follow ${path.edge.relation} to ${path.label}${path.crossWorld ? " in another world" : ""}`}
                  >
                    <span>{path.crossWorld ? "Cross-world · " : ""}{worldRelationLabels[path.edge.relationKind]}</span>
                    <strong>{path.label}</strong>
                    <small>{path.kind} · {path.edge.relation}</small>
                  </button>
                ))}
              </div>
              {connectedPaths.find((path) => path.edge.evidenceBoundary || path.edge.sourceRef) ? (
                <details>
                  <summary>Sources and connection boundaries</summary>
                  {connectedPaths.filter((path) => path.edge.evidenceBoundary || path.edge.sourceRef).map((path) => (
                    <small key={path.edge.id}>
                      <strong>{path.label}:</strong> {path.edge.evidenceBoundary ?? "This connection is scoped to the cited edition passage."}
                      {path.edge.sourceRef ? <em>Source: {path.edge.sourceRef}</em> : null}
                    </small>
                  ))}
                </details>
              ) : null}
            </div>
          ) : null}
          {focusedNode && <details><summary>Why this is here</summary><small>{focusedNode.evidenceBoundary}</small></details>}
        </section>
      )}

      <div className={styles.flightControls} role="group" aria-label={`Atlas zoom controls, ${Math.round(view.scale * 100)}%`}>
        <button type="button" onClick={() => zoomFromCenter(1.2)} aria-label="Zoom in"><Icon name="plus" size={16} /></button>
        <button type="button" onClick={() => zoomFromCenter(.83)} aria-label="Zoom out"><Icon name="minus" size={16} /></button>
        <button type="button" onClick={resetView} aria-label="Reset map view"><Icon name="reset" size={15} /></button>
        <button type="button" onClick={() => setMotionMode((mode) => mode === "cinematic" ? "still" : "cinematic")} aria-label={`${motionMode === "cinematic" ? "Pause" : "Resume"} ambient motion`}><span className={styles.motionDot} /></button>
      </div>

      <button className={styles.sarthiOrb} type="button" onClick={() => setSarthiOpen(true)} aria-label="Ask Sarthi">
        <Icon name="spark" size={24} /><span>Sārthi</span>
      </button>

      <aside className={`${styles.sarthiPanel} ${sarthiOpen ? styles.panelOpen : ""}`} aria-hidden={!sarthiOpen} aria-label="Sarthi conversation">
        <header>
          <div><Icon name="spark" /><span><strong>Sārthi</strong><small>Companion, not an oracle</small></span></div>
          <button type="button" onClick={() => setSarthiOpen(false)} aria-label="Close Sarthi"><Icon name="close" /></button>
        </header>
        <div className={styles.conversation}>
          <small>Exploring · {conversationSubject}</small>
          <div className={styles.sarthiMessage}>Where would you like to go next?</div>
          {askedQuestion && <div className={styles.userMessage}>{askedQuestion}</div>}
          {sarthiBusy && <div className={styles.sarthiMessage}>Looking through Devam&apos;s evidence…</div>}
          {sarthiReply && (
            <div className={styles.sarthiMessage} aria-live="polite">
              {sarthiReply.ok ? sarthiReply.answer : sarthiReply.message}
              {sarthiReply.citations?.length ? <details><summary>Sources</summary>{sarthiReply.citations.map((citation) => <p key={citation.passageId}><strong>{citation.workTitle}</strong><small>{citation.editionTitle}</small></p>)}</details> : null}
              {sarthiReply.practiceGuide ? (
                <details>
                  <summary>Open guidance and sources</summary>
                  <p><strong>{sarthiReply.practiceGuide.title}</strong><small>{sarthiReply.practiceGuide.summary}</small></p>
                  {sarthiReply.practiceGuide.tiers.map((tier) => <p key={tier.tier}><strong>{tier.label} · about {tier.estimatedMinutes} min</strong><small>{tier.steps.map((step) => step.instruction).join(" · ")}</small></p>)}
                  {sarthiReply.practiceGuide.userCompleteContext ? (
                    <details>
                      <summary>Variants and boundaries</summary>
                      {sarthiReply.practiceGuide.userCompleteContext.variants.map((variant) => <p key={variant.variantId}><strong>{variant.dimension}</strong><small>{variant.description}</small></p>)}
                    </details>
                  ) : null}
                  <details><summary>Guide sources</summary>{sarthiReply.practiceGuide.evidence.sources.map((source) => <p key={source.sourceId}><strong>{source.title}</strong><small>{source.publisher} · {source.sourceClass}</small></p>)}</details>
                </details>
              ) : null}
            </div>
          )}
          <div className={styles.prompts}>
            <button type="button" onClick={() => void askSarthi(`Tell me the story of ${conversationSubject} simply`)}>Tell me the story</button>
            <button type="button" onClick={() => void askSarthi(`What should I explore next from ${conversationSubject}?`)}>Where next?</button>
          </div>
        </div>
        <form className={styles.composer} onSubmit={(event) => { event.preventDefault(); void askSarthi(query); }}>
          <label className="srOnly" htmlFor="sarthi-query">Ask Sarthi anything</label>
          <textarea id="sarthi-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ask about a story or something in your life…" rows={2} />
          <button type="submit" aria-label="Send message" disabled={sarthiBusy || query.trim().length < 2}><Icon name="arrow" /></button>
        </form>
      </aside>

      {signInPrompt && (
        <section className={styles.signInPrompt} role="dialog" aria-modal="true" aria-labelledby="preview-title">
          <Icon name="spark" size={25} />
          <p>Keep your place in the universe</p>
          <h2 id="preview-title">Continue exploring with a free account.</h2>
          <span>Your discoveries and Sārthi conversations can travel with you.</span>
          <Link href="/account">Continue with email <Icon name="arrow" size={17} /></Link>
          <button type="button" onClick={() => setSignInPrompt(null)}>Not now</button>
        </section>
      )}
      {(sarthiOpen || signInPrompt) && <button className={styles.scrim} onClick={() => { setSarthiOpen(false); setSignInPrompt(null); }} type="button" aria-label="Close overlay" />}
    </main>
  );
}
