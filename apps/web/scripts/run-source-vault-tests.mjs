import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const vaultRoot = resolve(process.cwd(), "../..", "source_vault", "objects", "sha256");
if (!existsSync(vaultRoot)) {
  console.error(`Canonical source vault is required for this suite: ${vaultRoot}`);
  process.exit(2);
}

const result = spawnSync(
  process.execPath,
  ["node_modules/vitest/vitest.mjs", "run", "--exclude", "e2e/**"],
  {
    cwd: process.cwd(),
    env: { ...process.env, DEVAM_REQUIRE_SOURCE_VAULT: "true" },
    stdio: "inherit",
  },
);

if (result.error) throw result.error;
process.exit(result.status ?? 1);
