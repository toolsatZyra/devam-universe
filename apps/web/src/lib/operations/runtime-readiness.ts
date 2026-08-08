export type RuntimeEnvironment = Record<string, string | undefined>;

type CheckStatus = "pass" | "fail" | "not_required";

export type RuntimeReadiness = {
  contract: "DEVAM_RUNTIME_READINESS_V1";
  ok: boolean;
  status: "ready" | "not_ready" | "development";
  service: "devam-web";
  environment: "production" | "preview" | "development" | "local_production";
  deployedCommit: string | null;
  checks: {
    siteOrigin: CheckStatus;
    supabasePublicConfiguration: CheckStatus;
    subscriptionsDisabled: CheckStatus;
    sarthiGenerationDisabled: CheckStatus;
    forbiddenServerSecretsAbsent: CheckStatus;
    deploymentIdentity: CheckStatus;
  };
  boundaries: {
    databaseConnectivityProven: false;
    authEmailDeliveryProven: false;
    deployedBrowserAcceptanceProven: false;
    sourceVaultReadOrCopied: false;
  };
};

const COMMIT_SHA = /^[0-9a-f]{40}$/i;

function exactHttpsOrigin(value: string | undefined): boolean {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:"
      && !parsed.username
      && !parsed.password
      && parsed.pathname === "/"
      && !parsed.search
      && !parsed.hash
      && value === parsed.origin;
  } catch {
    return false;
  }
}

function validSupabasePublicConfiguration(environment: RuntimeEnvironment): boolean {
  const url = environment.SUPABASE_URL;
  const key = environment.SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !key || key.startsWith("sb_secret_")) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && !parsed.username && !parsed.password && parsed.pathname === "/" && !parsed.search && !parsed.hash;
  } catch {
    return false;
  }
}

export function evaluateRuntimeReadiness(
  environment: RuntimeEnvironment,
  nodeEnvironment: string | undefined,
): RuntimeReadiness {
  const strict = nodeEnvironment === "production";
  const vercelEnvironment = environment.VERCEL_ENV;
  const runtimeEnvironment: RuntimeReadiness["environment"] = vercelEnvironment === "production" || vercelEnvironment === "preview" || vercelEnvironment === "development"
    ? vercelEnvironment
    : strict ? "local_production" : "development";
  const deployedCommit = COMMIT_SHA.test(environment.VERCEL_GIT_COMMIT_SHA ?? "")
    ? environment.VERCEL_GIT_COMMIT_SHA ?? null
    : null;
  const checks: RuntimeReadiness["checks"] = strict ? {
    siteOrigin: exactHttpsOrigin(environment.DEVAM_SITE_URL) ? "pass" : "fail",
    supabasePublicConfiguration: validSupabasePublicConfiguration(environment) ? "pass" : "fail",
    subscriptionsDisabled: environment.DEVAM_SUBSCRIPTIONS_ENABLED === "false" ? "pass" : "fail",
    sarthiGenerationDisabled: environment.SARTHI_GENERATION_ENABLED === "false" ? "pass" : "fail",
    forbiddenServerSecretsAbsent: !environment.SUPABASE_SECRET_KEY && !environment.OPENAI_API_KEY ? "pass" : "fail",
    deploymentIdentity: environment.VERCEL === "1" ? (deployedCommit ? "pass" : "fail") : "not_required",
  } : {
    siteOrigin: "not_required",
    supabasePublicConfiguration: "not_required",
    subscriptionsDisabled: "not_required",
    sarthiGenerationDisabled: "not_required",
    forbiddenServerSecretsAbsent: "not_required",
    deploymentIdentity: "not_required",
  };
  const ok = !strict || Object.values(checks).every((status) => status !== "fail");
  return {
    contract: "DEVAM_RUNTIME_READINESS_V1",
    ok,
    status: strict ? (ok ? "ready" : "not_ready") : "development",
    service: "devam-web",
    environment: runtimeEnvironment,
    deployedCommit,
    checks,
    boundaries: {
      databaseConnectivityProven: false,
      authEmailDeliveryProven: false,
      deployedBrowserAcceptanceProven: false,
      sourceVaultReadOrCopied: false,
    },
  };
}
