import { describe, expect, it } from "vitest";
import { evaluateRuntimeReadiness } from "./runtime-readiness";

const READY_PRODUCTION = {
  VERCEL: "1",
  VERCEL_ENV: "production",
  VERCEL_GIT_COMMIT_SHA: "8996ea6d47c006632cce10ef107ef2bad2a6b3f1",
  DEVAM_SITE_URL: "https://devam-universe.vercel.app",
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
  DEVAM_SUBSCRIPTIONS_ENABLED: "false",
  SARTHI_GENERATION_ENABLED: "false",
};

describe("runtime readiness", () => {
  it("is non-blocking in local development without claiming production dependencies", () => {
    expect(evaluateRuntimeReadiness({}, "development")).toMatchObject({
      ok: true,
      status: "development",
      deployedCommit: null,
      checks: { siteOrigin: "not_required", deploymentIdentity: "not_required" },
      boundaries: { databaseConnectivityProven: false, authEmailDeliveryProven: false, deployedBrowserAcceptanceProven: false, sourceVaultReadOrCopied: false },
    });
  });

  it("accepts only the explicit safe production configuration", () => {
    expect(evaluateRuntimeReadiness(READY_PRODUCTION, "production")).toMatchObject({
      ok: true,
      status: "ready",
      environment: "production",
      deployedCommit: READY_PRODUCTION.VERCEL_GIT_COMMIT_SHA,
      checks: {
        siteOrigin: "pass",
        supabasePublicConfiguration: "pass",
        subscriptionsDisabled: "pass",
        sarthiGenerationDisabled: "pass",
        forbiddenServerSecretsAbsent: "pass",
        deploymentIdentity: "pass",
      },
    });
  });

  it.each([
    ["site origin", { DEVAM_SITE_URL: "http://devam.example" }, "siteOrigin"],
    ["site path", { DEVAM_SITE_URL: "https://devam.example/app" }, "siteOrigin"],
    ["secret-shaped publishable key", { SUPABASE_PUBLISHABLE_KEY: "sb_secret_forbidden" }, "supabasePublicConfiguration"],
    ["subscriptions enabled", { DEVAM_SUBSCRIPTIONS_ENABLED: "true" }, "subscriptionsDisabled"],
    ["generation enabled", { SARTHI_GENERATION_ENABLED: "true" }, "sarthiGenerationDisabled"],
    ["server secret", { SUPABASE_SECRET_KEY: "never-return-this" }, "forbiddenServerSecretsAbsent"],
    ["OpenAI key", { OPENAI_API_KEY: "never-return-this" }, "forbiddenServerSecretsAbsent"],
    ["missing deployment SHA", { VERCEL_GIT_COMMIT_SHA: "" }, "deploymentIdentity"],
  ])("fails closed for %s without returning its value", (_label, override, failedCheck) => {
    const result = evaluateRuntimeReadiness({ ...READY_PRODUCTION, ...override }, "production");
    expect(result.ok).toBe(false);
    expect(result.status).toBe("not_ready");
    expect(result.checks[failedCheck as keyof typeof result.checks]).toBe("fail");
    expect(JSON.stringify(result)).not.toContain("never-return-this");
  });
});
