import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const outputDir = fileURLToPath(new URL("../../tmp/", import.meta.url));
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const consoleErrors = [];
page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});
page.on("pageerror", (error) => consoleErrors.push(error.message));

await page.goto("http://localhost:3100/account", { waitUntil: "networkidle" });
await page.getByRole("heading", { name: /Explore freely/ }).waitFor();
const accountOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const accountOverlay = await page.locator("[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay").count();
await page.screenshot({ path: `${outputDir}runtime-account-mobile.png`, fullPage: true });

const exportResponse = await page.request.get("http://localhost:3100/api/account/export");

await page.goto("http://localhost:3100/", { waitUntil: "networkidle" });
await page.evaluate(() => window.localStorage.removeItem("devam-guest-gateways"));
await page.reload({ waitUntil: "networkidle" });
await page.getByRole("button", { name: "Explore Durga" }).evaluate((element) => (element).click());
await page.getByRole("button", { name: "Explore Ganesha" }).evaluate((element) => (element).click());
await page.waitForTimeout(300);
const previewState = await page.evaluate(() => ({
  savedGateways: window.localStorage.getItem("devam-guest-gateways"),
  dialogCount: document.querySelectorAll('[role="dialog"]').length,
  pressedGateways: [...document.querySelectorAll('button[aria-label^="Explore "][aria-pressed="true"]')].map((element) => element.getAttribute("aria-label")),
}));
if (!previewState.dialogCount) console.error(`PREVIEW_DIAGNOSTIC ${JSON.stringify(previewState)}`);
await page.getByRole("dialog").waitFor();
const atlasOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const atlasOverlay = await page.locator("[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay").count();
await page.screenshot({ path: `${outputDir}runtime-guest-preview-mobile.png`, fullPage: true });

const result = {
  account: { overflowPx: accountOverflow, frameworkErrorOverlays: accountOverlay },
  guestPreview: { overflowPx: atlasOverflow, frameworkErrorOverlays: atlasOverlay },
  exportStatusForGuest: exportResponse.status(),
  consoleErrors,
};
console.log(JSON.stringify(result, null, 2));

await browser.close();
if (accountOverflow > 0 || atlasOverflow > 0 || accountOverlay || atlasOverlay || exportResponse.status() !== 401 || consoleErrors.length) process.exit(1);
