export const DEVAM_ONE_PLAN_CODE = "devam_one" as const;

export const SUBSCRIPTION_ACCESS_STATUSES = ["active", "trialing", "beta_access"] as const;
export const SUBSCRIPTION_NON_ACCESS_STATUSES = ["past_due", "canceled", "incomplete", "paused"] as const;
export type SubscriptionStatus = typeof SUBSCRIPTION_ACCESS_STATUSES[number] | typeof SUBSCRIPTION_NON_ACCESS_STATUSES[number];

export type SubscriptionRow = {
  plan_code: string;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
};

export type DevamEntitlement = {
  tier: "free_beta" | "devam_one";
  premiumAccess: boolean;
  status: "billing_not_connected" | "invalid_subscription" | SubscriptionStatus;
  renewsOrEndsAt: string | null;
  cancelAtPeriodEnd: boolean;
};

export function resolveDevamEntitlement(row: SubscriptionRow | null): DevamEntitlement {
  if (!row) {
    return { tier: "free_beta", premiumAccess: false, status: "billing_not_connected", renewsOrEndsAt: null, cancelAtPeriodEnd: false };
  }
  const knownStatuses: readonly string[] = [...SUBSCRIPTION_ACCESS_STATUSES, ...SUBSCRIPTION_NON_ACCESS_STATUSES];
  if (row.plan_code !== DEVAM_ONE_PLAN_CODE || !knownStatuses.includes(row.status)) {
    return { tier: "free_beta", premiumAccess: false, status: "invalid_subscription", renewsOrEndsAt: null, cancelAtPeriodEnd: false };
  }
  const status = row.status as SubscriptionStatus;
  const premiumAccess = (SUBSCRIPTION_ACCESS_STATUSES as readonly string[]).includes(status);
  return {
    tier: premiumAccess ? "devam_one" : "free_beta",
    premiumAccess,
    status,
    renewsOrEndsAt: row.current_period_end,
    cancelAtPeriodEnd: row.cancel_at_period_end,
  };
}
