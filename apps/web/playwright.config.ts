import { defineConfig, devices } from "playwright/test";

const port = 3100;
const localBaseURL = `http://127.0.0.1:${port}`;
const deployedBaseURL = process.env.DEVAM_PREVIEW_URL?.trim();

if (deployedBaseURL) {
  const parsed = new URL(deployedBaseURL);
  if (parsed.protocol !== "https:" || parsed.username || parsed.password
    || parsed.pathname !== "/" || parsed.search || parsed.hash) {
    throw new Error("DEVAM_PREVIEW_URL must be a credential-free HTTPS origin.");
  }
}

const baseURL = deployedBaseURL ?? localBaseURL;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  expect: { timeout: 12_000 },
  reporter: process.env.CI
    ? [["line"], ["html", { open: "never", outputFolder: "playwright-report" }]]
    : "list",
  outputDir: "test-results",
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: deployedBaseURL
    ? undefined
    : {
        command: `pnpm dev --hostname 127.0.0.1 --port ${port}`,
        url: localBaseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        stdout: "pipe",
        stderr: "pipe",
        env: { DEVAM_ATLAS_FIXTURE: "1" },
      },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
  ],
});
