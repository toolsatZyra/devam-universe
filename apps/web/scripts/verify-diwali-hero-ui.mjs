import { chromium } from "playwright";
import { spawn, execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("../", import.meta.url));
const atlasOutputPath = fileURLToPath(new URL("../../tmp/runtime-atlas-diwali-mobile.png", import.meta.url));
const journeyOutputPath = fileURLToPath(new URL("../../tmp/runtime-journey-diwali-mobile.png", import.meta.url));
const baseUrl = "http://localhost:3104";
const existing = await fetch(baseUrl).then(() => true).catch(() => false);
if (existing) throw new Error("Port 3104 already has a server; refusing to claim or terminate it.");

const server = spawn(process.env.ComSpec ?? "C:\\Windows\\System32\\cmd.exe", ["/d", "/s", "/c", "pnpm.cmd dev --port 3104"], {
  cwd: appRoot,
  windowsHide: true,
  stdio: ["ignore", "pipe", "pipe"],
});
let stopped = false;
function stopServer() {
  if (stopped || server.pid === undefined) return;
  stopped = true;
  try { execFileSync("taskkill.exe", ["/PID", String(server.pid), "/T", "/F"], { stdio: "ignore", windowsHide: true }); } catch { /* Scoped process may already have exited. */ }
}
process.on("exit", stopServer);
let serverOutput = "";
server.stdout.on("data", (chunk) => { serverOutput += chunk.toString(); });
server.stderr.on("data", (chunk) => { serverOutput += chunk.toString(); });

try {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const ready = await fetch(baseUrl).then((response) => response.status === 200).catch(() => false);
    if (ready) break;
    if (server.exitCode !== null) throw new Error(`Dev server exited before verification:\n${serverOutput}`);
    if (attempt === 59) throw new Error(`Dev server did not become ready:\n${serverOutput}`);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const browser = await chromium.launch({ headless: true, executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    const consoleErrors = [];
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
    page.on("pageerror", (error) => consoleErrors.push(error.message));
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.evaluate(() => window.localStorage.removeItem("devam-guest-gateways"));
    await page.reload({ waitUntil: "networkidle" });
    const gatewayCount = await page.getByRole("button", { name: /^Explore / }).count();
    const diwaliGateway = page.getByRole("button", { name: "Explore Diwali" });
    await diwaliGateway.click();
    await page.getByRole("link", { name: /Follow the festival of many lights/ }).waitFor();
    const diwaliSelected = await diwaliGateway.getAttribute("aria-pressed");
    const atlasOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    await page.screenshot({ path: atlasOutputPath, fullPage: true });

    await page.goto(`${baseUrl}/journeys/diwali`, { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "Six lights, many traditions" }).waitFor();
    await page.getByText(/Only its Lakshmi Puja household lane is complete in scope/).waitFor();
    const stopButtons = page.getByLabel("Journey stops").getByRole("button");
    const stopCount = await stopButtons.count();
    const journeyOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    await page.screenshot({ path: journeyOutputPath, fullPage: true });

    console.log(JSON.stringify({ gatewayCount, diwaliSelected, atlasOverflow, stopCount, journeyOverflow, consoleErrors }, null, 2));
    if (gatewayCount !== 4 || diwaliSelected !== "true" || atlasOverflow > 0 || stopCount !== 6 || journeyOverflow > 0 || consoleErrors.length) process.exitCode = 1;
  } finally {
    await browser.close();
  }
} finally {
  stopServer();
}
