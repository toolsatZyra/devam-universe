import { chromium } from "playwright";
import { fileURLToPath } from "node:url";

const outputPath = fileURLToPath(new URL("../../tmp/runtime-today-navaratri-day5-mobile.png", import.meta.url));
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const consoleErrors = [];
page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
page.on("pageerror", (error) => consoleErrors.push(error.message));

await page.goto("http://localhost:3100/today", { waitUntil: "networkidle" });
await page.getByLabel("Date").fill("2026-10-15");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Skandamata" }).waitFor();
await page.getByText("Shardiya Navaratri · day 5 of 10").waitFor();
await page.getByText("Contextual home practice").waitFor();
const supportedOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
await page.screenshot({ path: outputPath, fullPage: true });

await page.getByLabel("Practice context").selectOption("shakta-bengal");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByText(/This result does not yet assign a vrata or festival/).waitFor();
const unsupportedCampaignCount = await page.getByRole("heading", { name: "Skandamata" }).count();
const unsupportedPracticeCount = await page.getByText("Contextual home practice").count();
const overlays = await page.locator("[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay").count();

const result = {
  supportedDay: { ordinal: 5, commonName: "Skandamata", overflowPx: supportedOverflow },
  unsupportedBengalLane: { campaignCards: unsupportedCampaignCount, practiceGuides: unsupportedPracticeCount },
  frameworkErrorOverlays: overlays,
  consoleErrors,
};
console.log(JSON.stringify(result, null, 2));
await browser.close();
if (supportedOverflow > 0 || unsupportedCampaignCount || unsupportedPracticeCount || overlays || consoleErrors.length) process.exit(1);
