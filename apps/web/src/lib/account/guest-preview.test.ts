import { describe, expect, it } from "vitest";
import { canGuestAskSarthi, canGuestOpenGateway, GUEST_GATEWAY_LIMIT, GUEST_SARTHI_EXCHANGE_LIMIT } from "./guest-preview";

describe("guest Atlas preview", () => {
  it("lets a guest sample two gateways and revisit them", () => {
    expect(GUEST_GATEWAY_LIMIT).toBe(2);
    const visited = new Set(["ramayana", "durga"]);
    expect(canGuestOpenGateway(visited, "ramayana", false)).toBe(true);
    expect(canGuestOpenGateway(visited, "ganesha", false)).toBe(false);
  });

  it("never gates a signed-in explorer", () => {
    expect(canGuestOpenGateway(new Set(["ramayana", "durga"]), "ganesha", true)).toBe(true);
  });

  it("offers one completed Sarthi exchange to a guest", () => {
    expect(GUEST_SARTHI_EXCHANGE_LIMIT).toBe(1);
    expect(canGuestAskSarthi(0, false)).toBe(true);
    expect(canGuestAskSarthi(1, false)).toBe(false);
    expect(canGuestAskSarthi(12, true)).toBe(true);
  });
});
