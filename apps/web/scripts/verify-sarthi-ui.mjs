import { chromium } from "playwright";
import { spawn, execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("../", import.meta.url));
const outputPath = fileURLToPath(new URL("../../tmp/runtime-sarthi-retrieval-mobile.png", import.meta.url));
const baseUrl = "http://localhost:3102";
const existing = await fetch(baseUrl).then(() => true).catch(() => false);
if (existing) throw new Error("Port 3102 already has a server; refusing to claim or terminate it.");

const server = spawn(process.env.ComSpec ?? "C:\\Windows\\System32\\cmd.exe", ["/d", "/s", "/c", "pnpm.cmd dev --port 3102"], {
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

  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    const consoleErrors = [];
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
    page.on("pageerror", (error) => consoleErrors.push(error.message));
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Ask Sarthi" }).click();
    await page.getByLabel("Ask Sarthi anything").fill("What is described as the sacrificial person?");
    await page.getByRole("button", { name: "Send message" }).click();
    await page.getByText(/Unit 29 presents Gaṇapati/).waitFor();
    await page.getByText("Why Sarthi says this · 1 passage").click();
    await page.getByText(/यजमानतनुं यागरूपिणं/).waitFor();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const response = await page.evaluate(async () => {
      const result = await fetch("/api/sarthi", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: "What is described as the sacrificial person?", context: { atlasNodeSlug: "ramayana", languageCode: "en" } }),
      });
      return { status: result.status, body: await result.json() };
    });
    const atharvashirshaResponse = await page.evaluate(async () => {
      const result = await fetch("/api/sarthi", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: "What does numbered unit 9 say about one tusk and four hands?", context: { atlasNodeSlug: "ramayana", languageCode: "en" } }),
      });
      return { status: result.status, body: await result.json() };
    });
    await page.screenshot({ path: outputPath, fullPage: true });
    if (response.status !== 200 || response.body.mode !== "retrieval_grounded_answer" || response.body.citations?.[0]?.sourceOrdinal !== 29) {
      throw new Error(`Unexpected grounded Sarthi response: ${JSON.stringify(response)}`);
    }
    if (
      atharvashirshaResponse.status !== 200
      || atharvashirshaResponse.body.mode !== "retrieval_grounded_answer"
      || atharvashirshaResponse.body.citations?.[0]?.workTitle !== "Gaṇapatyatharvaśīrṣa"
      || atharvashirshaResponse.body.citations?.[0]?.sourceOrdinal !== 9
    ) {
      throw new Error(`Unexpected Atharvashirsha Sarthi response: ${JSON.stringify(atharvashirshaResponse)}`);
    }
    if (overflow !== 0 || consoleErrors.length) throw new Error(`Sarthi runtime verification failed: ${JSON.stringify({ overflow, consoleErrors })}`);
    console.log(JSON.stringify({ result: "PASS", mode: response.body.mode, sourceOrdinal: 29, atharvashirshaSourceOrdinal: 9, conversation: response.body.conversation, overflow, consoleErrors, screenshot: outputPath }));
  } finally {
    await browser.close();
  }
} finally {
  stopServer();
}
