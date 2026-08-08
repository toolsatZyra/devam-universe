import { describe, expect, it } from "vitest";
import { resolveDevamEntitlement } from "./subscription-entitlement";

describe("Devam One entitlement", () => {
  it("keeps an absent billing connection in the free beta lane", () => {
    expect(resolveDevamEntitlement(null)).toEqual({ tier: "free_beta", premiumAccess: false, status: "billing_not_connected", renewsOrEndsAt: null, cancelAtPeriodEnd: false });
  });

  it.each(["active", "trialing", "beta_access"] as const)("grants access for %s", (status) => {
    expect(resolveDevamEntitlement({ plan_code: "devam_one", status, current_period_end: null, cancel_at_period_end: false }).premiumAccess).toBe(true);
  });

  it.each(["past_due", "canceled", "incomplete", "paused"] as const)("fails closed for %s", (status) => {
    expect(resolveDevamEntitlement({ plan_code: "devam_one", status, current_period_end: null, cancel_at_period_end: false })).toMatchObject({ tier: "free_beta", premiumAccess: false, status });
  });

  it("rejects an unexpected plan as an entitlement", () => {
    expect(resolveDevamEntitlement({ plan_code: "forged_plan", status: "active", current_period_end: null, cancel_at_period_end: false })).toMatchObject({ premiumAccess: false, status: "invalid_subscription" });
  });

  it("rejects an unexpected provider status as an entitlement", () => {
    expect(resolveDevamEntitlement({ plan_code: "devam_one", status: "forged_status", current_period_end: null, cancel_at_period_end: false })).toMatchObject({ premiumAccess: false, status: "invalid_subscription" });
  });
});
