import { expect, test, type Page } from "playwright/test";

const browserErrors = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  browserErrors.set(page, errors);
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
});

test.afterEach(async ({ page }) => {
  expect(browserErrors.get(page) ?? [], "browser console and page errors").toEqual([]);
});

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport + 1);
}

test("the Living Atlas exposes all four launch worlds and working map controls", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Where will your curiosity take you?" })).toBeVisible();
  for (const hero of ["Ganesha", "Durga", "Ramayana", "Diwali"]) {
    await expect(page.getByRole("button", { name: `Explore ${hero}` })).toBeVisible();
  }

  const scene = page.getByTestId("atlas-scene");
  await expect(scene).toHaveAttribute("data-view-scale", "1");
  await page.getByRole("button", { name: "Zoom in" }).click();
  await expect(page.getByRole("group", { name: "Atlas zoom controls, 122%" })).toBeVisible();
  await expect(scene).toHaveAttribute("data-view-scale", "1.22");
  await page.getByRole("button", { name: "Reset map view" }).click();
  await expect(scene).toHaveAttribute("data-view-scale", "1");
  await expect(scene).toHaveAttribute("data-view-x", "0");

  await page.getByRole("button", { name: /Sacred geography/ }).click();
  await expect(scene).toHaveAttribute("data-atlas-layer", "geography");
  await expect(page.getByRole("button", { name: /Ayodhya, Place/ })).toBeVisible();
  await expect(page.getByText("Illustrative positions · not a navigation map")).toBeVisible();
  await page.getByRole("button", { name: "Durga", exact: true }).click();
  await expect(page.getByRole("button", { name: /Kamakhya, Shakti Peetha/ })).toBeVisible();
  await page.getByRole("button", { name: "Ramayana", exact: true }).click();
  await page.getByRole("button", { name: "Knowledge universe" }).click();
  await expect(scene).toHaveAttribute("data-atlas-layer", "universe");

  await page.getByRole("button", { name: "Place thread" }).click();
  const placeThread = page.getByRole("dialog", { name: "Ramayana place thread" });
  await expect(placeThread.getByRole("heading", { name: "Ayodhya to Chitrakoot" })).toBeVisible();
  await expect(placeThread).toContainText("not a literal route");
  await placeThread.getByRole("button", { name: /Chitrakoot/ }).click();
  await expect(scene).toHaveAttribute("data-atlas-layer", "geography");
  await expect(scene).toHaveAttribute("data-view-scale", "1.45");
  await expect(page.getByRole("heading", { name: "Chitrakoot", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Place thread" }).click();
  await page.getByRole("button", { name: "Reset map view" }).click();
  await page.getByRole("button", { name: "Knowledge universe" }).click();

  const atlas = page.getByRole("region", { name: /Interactive Atlas/ });
  const box = await atlas.boundingBox();
  expect(box).not.toBeNull();
  if (box) {
    const start = await atlas.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      for (const yRatio of [0.15, 0.5, 0.85]) {
        for (const xRatio of [0.15, 0.5, 0.85]) {
          const x = rect.left + rect.width * xRatio;
          const y = rect.top + rect.height * yRatio;
          if (!document.elementFromPoint(x, y)?.closest("button")) return { x, y };
        }
      }
      return { x: rect.left + 8, y: rect.top + 8 };
    });
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(start.x + 40, start.y + 24, { steps: 3 });
    await page.mouse.up();
  }
  await expect(scene).not.toHaveAttribute("data-view-x", "0");
  await page.getByRole("button", { name: "Epics", exact: true }).click();
  await expect(page.getByRole("button", { name: "Epics", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Explore Ramayana" }).click();
  await expect(page.getByRole("button", { name: "Explore Ramayana" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("link", { name: "Begin at Ayodhya" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("the four curated journeys and mission board are reachable", async ({ page }) => {
  await page.goto("/journeys");
  await expect(page.getByRole("heading", { name: /Choose a thread/ })).toBeVisible();
  for (const title of [
    "Across the seven kāṇḍas",
    "Inside one hymn to Gaṇapati",
    "The Devīmāhātmya boundary",
    "Six lights, many traditions",
  ]) {
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
  }
  await page.getByRole("link", { name: "Open challenges" }).click();
  await expect(page.getByRole("heading", { name: /Follow the path/ })).toBeVisible();
  await expect(page.getByText("It never assigns spiritual merit", { exact: false })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("exact Search keeps all four hero lanes source-bounded", async ({ page }) => {
  const cases = [
    ["What should I do for Ganesh Chaturthi?", "ganesh-chaturthi-west-india-content-v1-en-exact-guidance"],
    ["What should I do for Shardiya Navaratri?", "shardiya-navaratri-north-west-india-content-v1-en-exact-guidance"],
    ["Ramcharitmanas seven sopanas Belvedere Press", "ramcharitmanas-belvedere-seven-sopana-en"],
    ["How should I do Lakshmi Puja at home?", "diwali-lakshmi-puja-west-india-content-v1-en-exact-guidance"],
  ] as const;

  await page.goto("/search");
  const input = page.getByLabel("Search Devam");
  for (const [query, resultId] of cases) {
    await input.fill(query);
    await page.getByRole("button", { name: "Search", exact: true }).click();
    const result = page.locator(`[data-result-id="${resultId}"]`);
    await expect(result).toBeVisible();
    await expect(result.getByText(/source|evidence/i).first()).toBeVisible();
  }
  await expectNoHorizontalOverflow(page);
});

test("Sarthi answers from the bounded Ramcharitmanas edition and enforces the guest preview", async ({ page }) => {
  await page.goto("/sarthi");
  await page.getByLabel("Message Sarthi").fill("Tell me about Ramcharitmanas");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByText(/802 source-addressed beta pages/)).toBeVisible();
  await expect(page.getByText(/not the complete Ramcharitmanas tradition/)).toBeVisible();
  const sources = page.getByText("Open 7 sources", { exact: true });
  await expect(sources).toBeVisible();
  await sources.click();
  await expect(page.getByText(/Another 359 low-quality pages and 11 markup anomalies remain outside retrieval/)).toBeVisible();

  await page.getByLabel("Message Sarthi").fill("What else should I explore?");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByText("Continue your conversation", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Continue with an account" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("Today resolves a location-aware Diwali practice without flattening traditions", async ({ page }) => {
  await page.goto("/today");
  await page.getByLabel("Date").fill("2026-11-08");
  await page.getByLabel("Place").selectOption("mumbai");
  await page.getByLabel("Practice context").selectOption("smarta-west-india");
  await page.getByRole("button", { name: "Show my day" }).click();

  await expect(page.getByRole("heading", { name: "Sunday, 8 November 2026" })).toBeVisible();
  await expect(page.getByText("Diwali Lakshmi Puja", { exact: false }).first()).toBeVisible();
  await expect(page.getByText("Observed in this bounded context", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Sunrise", { exact: true })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("the guest account surface explains personalization and passwordless continuation", async ({ page }) => {
  await page.goto("/account");
  await expect(page.getByRole("heading", { name: /Explore freely/ })).toBeVisible();
  await expect(page.getByText(/An account saves journeys, language, location, family practice/)).toBeVisible();
  await expect(page.getByLabel("Email address")).toBeVisible();
  await expect(page.getByRole("button", { name: "Send sign-in link" })).toBeVisible();
  await expect(page.getByText(/No password/)).toBeVisible();
  await expectNoHorizontalOverflow(page);
});
