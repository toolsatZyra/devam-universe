import { chromium } from "playwright";
import { spawn, execFileSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("../", import.meta.url));
const outputRoot = fileURLToPath(new URL("../../../tmp/sarthi-conversation-browser-audit-2026-08-07/", import.meta.url));
const baseUrl = "http://localhost:3104";
if (await fetch(`${baseUrl}/sarthi`).then(() => true).catch(() => false)) {
  throw new Error("Port 3104 already has a server; refusing to claim or terminate it.");
}

await mkdir(outputRoot, { recursive: true });
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

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (await fetch(`${baseUrl}/sarthi`).then((response) => response.status === 200).catch(() => false)) return;
    if (server.exitCode !== null) throw new Error(`Dev server exited before verification:\n${serverOutput}`);
    if (attempt === 59) throw new Error(`Dev server did not become ready:\n${serverOutput}`);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

async function assertHealthy(page, errors) {
  const state = await page.evaluate(() => ({
    bodyLength: document.body.innerText.trim().length,
    overlay: Boolean(document.querySelector("[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay")),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  if (state.bodyLength === 0 || state.overlay || state.overflow !== 0 || errors.length) {
    throw new Error(`Browser health check failed: ${JSON.stringify({ state, errors })}`);
  }
  return state;
}

try {
  await waitForServer();
  const browser = await chromium.launch({ headless: true, executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });
  try {
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    const mobile = await mobileContext.newPage();
    const mobileErrors = [];
    mobile.on("console", (message) => { if (message.type() === "error") mobileErrors.push(message.text()); });
    mobile.on("pageerror", (error) => mobileErrors.push(error.message));
    await mobile.goto(`${baseUrl}/sarthi`, { waitUntil: "networkidle" });
    await mobile.getByLabel("Message Sarthi").fill("I am in conflict with my parents about my career. What should I do?");
    await mobile.getByRole("button", { name: "Send" }).click();
    await mobile.getByText(/respect for your family and responsibility for the life/).waitFor();
    await mobile.getByText("Why Sarthi paused here").click();
    await mobile.getByText(/No scripture, analogy, moral verdict/).waitFor();
    await mobile.getByLabel("Message Sarthi").fill("They are worried about money.");
    await mobile.getByRole("button", { name: "Send" }).click();
    await mobile.getByText("Continue your conversation").waitFor();
    const mobileState = await assertHealthy(mobile, mobileErrors);
    await mobile.screenshot({ path: `${outputRoot}mobile.png`, fullPage: true });
    await mobileContext.close();

    const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 950 }, deviceScaleFactor: 1 });
    const desktop = await desktopContext.newPage();
    const desktopErrors = [];
    desktop.on("console", (message) => { if (message.type() === "error") desktopErrors.push(message.text()); });
    desktop.on("pageerror", (error) => desktopErrors.push(error.message));
    await desktop.goto(baseUrl, { waitUntil: "networkidle" });
    await desktop.getByRole("link", { name: "Sarthi" }).click();
    await desktop.getByRole("heading", { name: /Talk to someone who can/ }).waitFor();
    const desktopState = await assertHealthy(desktop, desktopErrors);
    await desktop.screenshot({ path: `${outputRoot}desktop.png`, fullPage: true });
    await desktopContext.close();

    console.log(JSON.stringify({
      result: "PASS",
      mobile: mobileState,
      desktop: desktopState,
      guestBoundaryShown: true,
      personalGuidanceMode: "context_clarification",
      screenshots: [`${outputRoot}mobile.png`, `${outputRoot}desktop.png`],
    }));
  } finally {
    await browser.close();
  }
} finally {
  stopServer();
}
