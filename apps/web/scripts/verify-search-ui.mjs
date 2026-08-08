import { chromium } from "playwright";
import { spawn, execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("../", import.meta.url));
const ganeshaOutputPath = fileURLToPath(new URL("../../tmp/runtime-search-mobile.png", import.meta.url));
const diwaliOutputPath = fileURLToPath(new URL("../../tmp/runtime-search-diwali-mobile.png", import.meta.url));
const baseUrl = "http://localhost:3101";
const existing = await fetch(`${baseUrl}/search`).then(() => true).catch(() => false);
if (existing) throw new Error("Port 3101 already has a server; refusing to claim or terminate it.");

const server = spawn(process.env.ComSpec ?? "C:\\Windows\\System32\\cmd.exe", ["/d", "/s", "/c", "pnpm.cmd dev --port 3101"], {
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
    const ready = await fetch(`${baseUrl}/search`).then((response) => response.status === 200).catch(() => false);
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
    await page.goto(`${baseUrl}/search`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Ganesha and obstacles" }).click();
    await page.getByRole("heading", { name: "Gaṇapati and impediments" }).waitFor();
    await page.getByText("1 grounded result").waitFor();
    await page.getByText("Open 2 exact passages").click();
    await page.getByText(/Śrīgaṇapatimantrākṣarāvaliḥ/).first().waitFor();
    const ganeshaOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    await page.screenshot({ path: ganeshaOutputPath, fullPage: true });

    await page.getByRole("button", { name: "Diwali festival path" }).click();
    await page.getByRole("heading", { name: "Lakshmi Pujan" }).waitFor();
    await page.getByText("6 grounded results").waitFor();
    if (await page.getByText("Evidence-bounded synthesis").count() !== 6) {
      throw new Error("Every Diwali lane must be visibly identified as evidence-bounded synthesis.");
    }
    const lakshmiCard = page.getByRole("heading", { name: "Lakshmi Pujan" }).locator("..");
    await lakshmiCard.getByText("Open 1 evidence coordinate").click();
    await lakshmiCard.getByText(/Devam-authored West India evidence synthesis/).waitFor();
    if (await lakshmiCard.locator("blockquote").count() !== 0) {
      throw new Error("The Diwali synthesis must not expose a fabricated primary-source quotation.");
    }
    const diwaliOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    await page.screenshot({ path: diwaliOutputPath, fullPage: true });

    const emptyResponse = await page.evaluate(async () => {
      const response = await fetch("/api/search?query=Mahabharata");
      return { status: response.status, body: await response.json() };
    });
    if (emptyResponse.status !== 200 || emptyResponse.body.total !== 0 || emptyResponse.body.retrievalStatus !== "connected") {
      throw new Error(`Unexpected local-only Search boundary: ${JSON.stringify(emptyResponse)}`);
    }
    const atharvashirshaResponse = await page.evaluate(async () => {
      const response = await fetch("/api/search?query=one%20tusk%20four%20hands");
      return { status: response.status, body: await response.json() };
    });
    const atharvashirshaResult = atharvashirshaResponse.body.results?.find(
      (result) => result.id === "ganapatyatharvashirsha-unit9-form-en",
    );
    if (
      atharvashirshaResponse.status !== 200
      || atharvashirshaResponse.body.retrievalStatus !== "connected"
      || atharvashirshaResult?.citations?.[0]?.workTitle !== "Gaṇapatyatharvaśīrṣa"
      || atharvashirshaResult?.citations?.[0]?.sourceOrdinal !== 9
    ) {
      throw new Error(`Unexpected Atharvashirsha Search result: ${JSON.stringify(atharvashirshaResponse)}`);
    }
    if (ganeshaOverflow !== 0 || diwaliOverflow !== 0 || consoleErrors.length) {
      throw new Error(`Search runtime verification failed: ${JSON.stringify({ ganeshaOverflow, diwaliOverflow, consoleErrors })}`);
    }
    console.log(JSON.stringify({
      result: "PASS",
      ganeshaOverflow,
      diwaliOverflow,
      consoleErrors,
      retrievalStatus: emptyResponse.body.retrievalStatus,
      atharvashirshaSourceOrdinal: 9,
      screenshots: [ganeshaOutputPath, diwaliOutputPath],
    }));
  } finally {
    await browser.close();
  }
} finally {
  stopServer();
}
