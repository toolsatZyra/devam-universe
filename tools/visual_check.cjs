const { chromium } = require("../apps/web/node_modules/playwright");
const fs = require("node:fs");
const path = require("node:path");

const baseUrl = process.env.DEVAM_PREVIEW_URL || "http://localhost:3100";
const outputDir = path.resolve(__dirname, "..", "docs", "mockups");

async function capture(browser, name, viewport, openSarthi = false, systemReduced = false) {
  const mobile = viewport.width < 500;
  const page = await browser.newPage({
    viewport,
    deviceScaleFactor: 1,
    hasTouch: mobile,
    isMobile: mobile,
    reducedMotion: systemReduced ? "reduce" : "no-preference",
  });
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  const response = await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForTimeout(40);
  if (!response || !response.ok()) throw new Error(`${name}: page returned ${response?.status()}`);
  const bodyText = await page.locator("body").innerText();
  if (bodyText.trim().length < 300) throw new Error(`${name}: rendered content is unexpectedly sparse`);
  if (await page.locator("[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay").count()) {
    throw new Error(`${name}: framework error overlay present`);
  }
  if (openSarthi) {
    await page.getByRole("button", { name: "Ask Sarthi" }).click();
    await page.getByRole("complementary", { name: "Sarthi conversation" }).waitFor({ state: "visible" });
    await page.waitForTimeout(450);
  }
  const screenshot = path.join(outputDir, `${name}.png`);
  await page.screenshot({ path: screenshot, fullPage: true });
  const interactionChecks = {};
  interactionChecks.systemMotionDefault = await page.locator("main[data-motion]").getAttribute("data-motion");
  if (systemReduced && interactionChecks.systemMotionDefault !== "gentle") {
    throw new Error("system reduced-motion preference did not select Gentle mode");
  }
  if (name.includes("desktop")) {
    const atlas = page.getByRole("region", { name: /Interactive Atlas/ });
    const zoomValue = page.getByLabel("Atlas zoom controls").locator("span");
    const logoLoaded = await page.locator("img").first().evaluate(
      (image) => image.complete && image.naturalWidth > 0,
    );
    if (!logoLoaded) throw new Error("actual Devam mark did not load");
    interactionChecks.logoLoaded = true;
    const motionToggle = page.locator('button[aria-haspopup="menu"]').first();
    await motionToggle.click();
    await page.getByRole("menuitemradio", { name: /gentle/i }).click();
    interactionChecks.gentleMode = await page.locator("main[data-motion]").getAttribute("data-motion");
    await motionToggle.click();
    await page.getByRole("menuitemradio", { name: /still/i }).click();
    interactionChecks.stillMode = await page.locator("main[data-motion]").getAttribute("data-motion");
    interactionChecks.savedMode = await page.evaluate(() => window.localStorage.getItem("devam-motion-mode"));
    await motionToggle.click();
    await page.getByRole("menuitemradio", { name: /cinematic/i }).click();
    if (interactionChecks.gentleMode !== "gentle" || interactionChecks.stillMode !== "still" || interactionChecks.savedMode !== "still") {
      throw new Error("motion preference selection or persistence failed");
    }
    interactionChecks.initialZoom = await zoomValue.innerText();
    if (await page.getByRole("button", { name: /Kashi/ }).count()) {
      throw new Error("close-detail node was exposed at overview zoom");
    }
    await page.getByRole("button", { name: "Zoom in" }).click();
    await page.getByRole("button", { name: "Zoom in" }).click();
    interactionChecks.zoomedValue = await zoomValue.innerText();
    interactionChecks.closeDetailRevealed = (await page.getByRole("button", { name: /Kashi/ }).count()) === 1;
    if (!interactionChecks.closeDetailRevealed) throw new Error("closer zoom failed to reveal detail node");
    await page.getByRole("button", { name: "Explore Durga" }).click();
    await page.screenshot({ path: path.join(outputDir, "living-atlas-zoomed-connections-1440x1000.png"), fullPage: true });

    await page.getByRole("button", { name: "Reset map view" }).click();
    const beforePan = await page.getByRole("button", { name: "Explore Ramayana" }).boundingBox();
    const atlasBox = await atlas.boundingBox();
    if (!beforePan || !atlasBox) throw new Error("pan test targets missing");
    await page.mouse.move(atlasBox.x + atlasBox.width * 0.5, atlasBox.y + atlasBox.height * 0.84);
    await page.mouse.down();
    await page.mouse.move(atlasBox.x + atlasBox.width * 0.5 + 55, atlasBox.y + atlasBox.height * 0.84 - 24, { steps: 4 });
    await page.mouse.up();
    const afterPan = await page.getByRole("button", { name: "Explore Ramayana" }).boundingBox();
    interactionChecks.panPixels = afterPan ? Math.round(afterPan.x - beforePan.x) : 0;
    if (!afterPan || Math.abs(afterPan.x - beforePan.x) < 35) throw new Error("drag-to-pan did not move the scene");

    await page.getByRole("button", { name: "Reset map view" }).click();
    await atlas.dblclick({ position: { x: atlasBox.width * 0.5, y: atlasBox.height * 0.45 } });
    interactionChecks.doubleClickZoom = await zoomValue.innerText();
    if (interactionChecks.doubleClickZoom === "100%") throw new Error("double-click zoom did not change scale");
  }
  if (name.includes("mobile") && !openSarthi) {
    const atlas = page.getByRole("region", { name: /Interactive Atlas/ });
    const atlasBox = await atlas.boundingBox();
    const zoomValue = page.getByLabel("Atlas zoom controls").locator("span");
    if (!atlasBox) throw new Error("mobile Atlas bounds unavailable");
    const client = await page.context().newCDPSession(page);
    const center = { x: atlasBox.x + atlasBox.width * 0.5, y: atlasBox.y + atlasBox.height * 0.5 };
    const tap = async () => {
      await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: center.x, y: center.y, id: 1 }] });
      await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    };
    await tap();
    await page.waitForTimeout(90);
    await tap();
    await page.waitForTimeout(90);
    interactionChecks.doubleTapZoom = await zoomValue.innerText();
    if (interactionChecks.doubleTapZoom === "100%") throw new Error("touch double-tap zoom did not change scale");
    await page.getByRole("button", { name: "Reset map view" }).click();

    await client.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [
        { x: center.x - 28, y: center.y, id: 1 },
        { x: center.x + 28, y: center.y, id: 2 },
      ],
    });
    await client.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [
        { x: center.x - 70, y: center.y, id: 1 },
        { x: center.x + 70, y: center.y, id: 2 },
      ],
    });
    await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await page.waitForTimeout(90);
    interactionChecks.pinchZoom = await zoomValue.innerText();
    if (interactionChecks.pinchZoom === "100%") throw new Error("pinch zoom did not change scale");
    await page.getByRole("button", { name: "Reset map view" }).click();
  }
  const result = {
    name,
    viewport,
    screenshot,
    bodyCharacters: bodyText.length,
    buttons: await page.getByRole("button").count(),
    links: await page.getByRole("link").count(),
    consoleErrors,
    pageErrors,
    panelBox: openSarthi
      ? await page.getByRole("complementary", { name: "Sarthi conversation" }).boundingBox()
      : null,
    composerBox: openSarthi ? await page.locator("form").boundingBox() : null,
    interactionChecks,
  };
  await page.close();
  if (consoleErrors.length || pageErrors.length) throw new Error(JSON.stringify(result));
  return result;
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath:
      process.env.DEVAM_CHROMIUM_PATH ||
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  });
  try {
    const results = [];
    results.push(await capture(browser, "living-atlas-desktop-1440x1000", { width: 1440, height: 1000 }));
    results.push(await capture(browser, "living-atlas-mobile-390x844", { width: 390, height: 844 }));
    results.push(await capture(browser, "sarthi-mobile-390x844", { width: 390, height: 844 }, true));
    results.push(await capture(browser, "living-atlas-system-gentle-1280x800", { width: 1280, height: 800 }, false, true));
    process.stdout.write(`${JSON.stringify({ result: "PASS", results }, null, 2)}\n`);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  process.stderr.write(`${error.stack || error}\n`);
  process.exit(1);
});
