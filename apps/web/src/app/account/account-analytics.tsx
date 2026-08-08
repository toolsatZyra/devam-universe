"use client";

import { useEffect } from "react";
import { trackProductEvent } from "@/lib/analytics/client";

export function SignedInAccountAnalytics() {
  useEffect(() => {
    trackProductEvent("account_signed_in", undefined, { oncePerSession: true });
  }, []);
  return null;
}
