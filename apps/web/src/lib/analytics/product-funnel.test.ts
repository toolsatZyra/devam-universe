import { describe, expect, it } from "vitest";
import { parseProductFunnelInput } from "./product-funnel";

const SESSION = "8f5ac8b4-9b87-4df3-9ee8-e46f7cfbad7d";
const EVENT = "2a737feb-326b-43c5-8ee6-fba289687d20";

describe("privacy-minimal product funnel", () => {
  it("derives the surface and permits only a bounded target", () => {
    expect(parseProductFunnelInput({ eventName: "atlas_gateway_opened", sessionId: SESSION, target: "ganesha" }, EVENT)).toEqual({
      id: EVENT,
      eventName: "atlas_gateway_opened",
      sessionId: SESSION,
      surface: "atlas",
      target: "ganesha",
    });
  });

  it("rejects arbitrary properties and content-like targets", () => {
    expect(parseProductFunnelInput({ eventName: "search_submitted", sessionId: SESSION, query: "private text" }, EVENT)).toBeNull();
    expect(parseProductFunnelInput({ eventName: "sarthi_question_submitted", sessionId: SESSION, target: "private text" }, EVENT)).toBeNull();
  });
});
