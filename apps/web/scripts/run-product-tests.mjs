import { spawnSync } from "node:child_process";

const result = spawnSync(
  process.execPath,
  ["node_modules/vitest/vitest.mjs", "run", "--exclude", "e2e/**"],
  {
    cwd: process.cwd(),
    env: { ...process.env, DEVAM_SOURCE_VAULT_MODE: "absent" },
    stdio: "inherit",
  },
);

if (result.error) throw result.error;
process.exit(result.status ?? 1);
