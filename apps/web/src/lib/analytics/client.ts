"use client";

import { PRODUCT_FUNNEL_TARGETS, type ProductFunnelEventName } from "./product-funnel";

const SESSION_KEY = "devam.product-funnel.session.v1";
const ONCE_KEY = "devam.product-funnel.once.v1";

function sessionId(): string | null {
  try {
    const stored = window.sessionStorage.getItem(SESSION_KEY);
    if (stored) return stored;
    const created = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_KEY, created);
    return created;
  } catch {
    return null;
  }
}

function reserveOnce(eventName: ProductFunnelEventName, target?: string): boolean {
  try {
    const key = `${eventName}:${target ?? ""}`;
    const previous = JSON.parse(window.sessionStorage.getItem(ONCE_KEY) ?? "[]") as unknown;
    const reserved = new Set(Array.isArray(previous) ? previous.filter((value): value is string => typeof value === "string") : []);
    if (reserved.has(key)) return false;
    reserved.add(key);
    window.sessionStorage.setItem(ONCE_KEY, JSON.stringify([...reserved]));
    return true;
  } catch {
    return true;
  }
}

export function trackProductEvent(
  eventName: ProductFunnelEventName,
  target?: string,
  options: { oncePerSession?: boolean } = {},
) {
  if (typeof window === "undefined") return;
  const allowedTargets = PRODUCT_FUNNEL_TARGETS[eventName] as readonly string[];
  if ((allowedTargets.length === 0 && target !== undefined) || (allowedTargets.length > 0 && (!target || !allowedTargets.includes(target)))) return;
  if (options.oncePerSession && !reserveOnce(eventName, target)) return;
  const currentSessionId = sessionId();
  if (!currentSessionId) return;
  void fetch("/api/analytics", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ eventName, sessionId: currentSessionId, ...(target ? { target } : {}) }),
    keepalive: true,
  }).catch(() => { /* Analytics never blocks the product experience. */ });
}
