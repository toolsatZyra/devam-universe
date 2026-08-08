import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { it } from "vitest";

const sourceVaultObjects = resolve(process.cwd(), "../..", "source_vault", "objects", "sha256");

export const sourceVaultAvailable = process.env.DEVAM_SOURCE_VAULT_MODE !== "absent" && existsSync(sourceVaultObjects);

if (process.env.DEVAM_REQUIRE_SOURCE_VAULT === "true" && !sourceVaultAvailable) {
  throw new Error(`DEVAM_REQUIRE_SOURCE_VAULT=true but the canonical object directory is unavailable: ${sourceVaultObjects}`);
}

/**
 * Canonical-source byte checks run when the local one-copy vault is mounted.
 * Clean clones skip only these offline checks; product and compact-evidence
 * tests continue to run normally.
 */
export const sourceVaultIt = sourceVaultAvailable ? it : it.skip;
