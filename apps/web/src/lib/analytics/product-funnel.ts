export const PRODUCT_FUNNEL_TARGETS = {
  atlas_opened: [],
  atlas_gateway_opened: ["ganesha", "durga", "ramayana", "diwali"],
  search_submitted: [],
  search_results_rendered: ["grounded", "catalog", "mixed", "empty", "unavailable"],
  sarthi_question_submitted: ["standalone", "atlas"],
  sarthi_answer_rendered: ["answer", "clarification", "unavailable"],
  today_resolved: ["observance", "calendar_only"],
  account_sign_in_requested: [],
  account_signed_in: [],
} as const;

export type ProductFunnelEventName = keyof typeof PRODUCT_FUNNEL_TARGETS;
export type ProductFunnelSurface = "atlas" | "search" | "sarthi" | "today" | "account";

export type ProductFunnelInput = {
  eventName: ProductFunnelEventName;
  sessionId: string;
  target?: string;
};

export type ProductFunnelEvent = Omit<ProductFunnelInput, "target"> & {
  id: string;
  surface: ProductFunnelSurface;
  target: string | null;
};

const EVENT_SURFACES: Record<ProductFunnelEventName, ProductFunnelSurface> = {
  atlas_opened: "atlas",
  atlas_gateway_opened: "atlas",
  search_submitted: "search",
  search_results_rendered: "search",
  sarthi_question_submitted: "sarthi",
  sarthi_answer_rendered: "sarthi",
  today_resolved: "today",
  account_sign_in_requested: "account",
  account_signed_in: "account",
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseProductFunnelInput(value: unknown, eventId = crypto.randomUUID()): ProductFunnelEvent | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  if (Object.keys(record).some((key) => !["eventName", "sessionId", "target"].includes(key))) return null;
  if (typeof record.eventName !== "string" || !(record.eventName in PRODUCT_FUNNEL_TARGETS)) return null;
  if (typeof record.sessionId !== "string" || !UUID_PATTERN.test(record.sessionId)) return null;
  const eventName = record.eventName as ProductFunnelEventName;
  const allowedTargets = PRODUCT_FUNNEL_TARGETS[eventName] as readonly string[];
  const target = record.target;
  if (allowedTargets.length === 0 && target !== undefined) return null;
  if (allowedTargets.length > 0 && (typeof target !== "string" || !allowedTargets.includes(target))) return null;
  if (!UUID_PATTERN.test(eventId)) return null;
  return {
    id: eventId,
    eventName,
    sessionId: record.sessionId,
    surface: EVENT_SURFACES[eventName],
    target: typeof target === "string" ? target : null,
  };
}
