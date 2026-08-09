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

test("the Living Atlas is a full-screen cosmic world with spatial travel", async ({ page }) => {
  test.setTimeout(120_000);
  const health = await page.request.get("/api/health");
  expect(health.status()).toBe(200);
  expect(await health.json()).toMatchObject({ contract: "DEVAM_RUNTIME_READINESS_V1", ok: true });
  // Mount the Atlas as a returning explorer so the complete five-world navigation
  // can be exercised without changing the product's separate guest-preview limit.
  await page.goto("/search");
  await page.evaluate(() => window.localStorage.setItem(
    "devam-guest-gateways",
    JSON.stringify(["ramayana", "ganesha", "durga", "diwali", "sacred-time"]),
  ));
  await page.getByRole("link", { name: "Back to the Atlas" }).click();
  await expect(page.getByRole("heading", { name: "Choose a star. Enter a world." })).toBeVisible();
  const atlas = page.getByRole("region", { name: /Interactive Atlas cosmic universe/ });
  const initialBox = await atlas.boundingBox();
  expect(initialBox).not.toBeNull();
  expect(initialBox?.width ?? 0).toBeGreaterThan(page.viewportSize()!.width * .98);
  expect(initialBox?.height ?? 0).toBeGreaterThan(page.viewportSize()!.height * .98);
  await expect(page.getByText("Set your location for Panchang")).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Atlas travel trail" })).toBeVisible();
  for (const hero of ["Ganesha", "Durga", "Ramayana", "Diwali", "Sacred Time"]) {
    const gateway = page.getByRole("button", { name: `Explore ${hero}` });
    await expect(gateway).toBeVisible();
    const gatewayBox = await gateway.boundingBox();
    expect(gatewayBox, `${hero} gateway is inside the playable viewport`).not.toBeNull();
    expect((gatewayBox?.x ?? -1) + (gatewayBox?.width ?? 0)).toBeGreaterThan(0);
    expect(gatewayBox?.x ?? page.viewportSize()!.width).toBeLessThan(page.viewportSize()!.width);
    expect((gatewayBox?.y ?? -1) + (gatewayBox?.height ?? 0)).toBeGreaterThan(0);
    expect(gatewayBox?.y ?? page.viewportSize()!.height).toBeLessThan(page.viewportSize()!.height);
  }

  const scene = page.getByTestId("atlas-scene");
  await expect(scene).toHaveAttribute("data-view-scale", "1");
  await page.getByRole("button", { name: "Zoom in" }).evaluate((button: HTMLButtonElement) => button.click());
  await expect(page.getByRole("group", { name: "Atlas zoom controls, 120%" })).toBeVisible();
  await expect(scene).toHaveAttribute("data-view-scale", "1.2");
  await page.getByRole("button", { name: "Reset map view" }).evaluate((button: HTMLButtonElement) => button.click());
  await expect(scene).toHaveAttribute("data-view-scale", "1");
  await expect(scene).toHaveAttribute("data-view-x", "0");

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
    await page.waitForTimeout(20);
  }
  await expect(scene).not.toHaveAttribute("data-view-x", "0");
  await page.getByRole("button", { name: "Reset map view" }).click();

  await page.getByRole("button", { name: "Explore Ganesha" }).click();
  await page.getByRole("button", { name: "Follow cosmic identity in one exact source to The world in Ganesha" }).click();
  await expect(page.getByRole("heading", { name: "The world in Ganesha" })).toBeVisible();
  await page.getByRole("button", { name: /Follow names five elements to Earth.*water.*fire.*air.*space/ }).click();
  await expect(page.getByRole("heading", { name: /Earth.*water.*fire.*air.*space/ })).toBeVisible();
  await page.getByRole("button", { name: "Ask Sarthi" }).click();
  await page.getByRole("button", { name: "Tell me the story" }).click();
  await expect(page.getByRole("complementary", { name: "Sarthi conversation" }).getByText(/You are earth, water, fire, air and space/i)).toBeVisible();
  await page.getByRole("button", { name: "Close Sarthi" }).click();

  await page.getByRole("button", { name: "Reset map view" }).click();
  await page.getByRole("button", { name: "Explore Ganesha" }).click();
  await page.getByRole("button", { name: "Follow annual festival to Ganesh Chaturthi" }).click();
  await page.getByRole("button", { name: /Follow public-festival turn in 1893 to Public Ganeshotsav.*1893/ }).click();
  await expect(page.getByRole("heading", { name: /Public Ganeshotsav.*1893/ })).toBeVisible();
  await page.getByRole("button", { name: "Follow grows into shared public celebration to The community pandal" }).click();
  await expect(page.getByRole("heading", { name: "The community pandal" })).toBeVisible();

  await page.getByRole("button", { name: "Reset map view" }).click();
  await page.getByRole("button", { name: "Explore Ramayana" }).click();
  await expect(page.getByRole("button", { name: "Explore Ramayana" })).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Follow becomes a living performance world to Ramlila" }).click();
  await expect(page.getByRole("heading", { name: "Ramlila" })).toBeVisible();
  await page.getByRole("button", { name: "Follow made through community participation to The community becomes the stage" }).click();
  await expect(page.getByRole("heading", { name: "The community becomes the stage" })).toBeVisible();
  await page.getByRole("button", { name: "Reset map view" }).click();
  await page.getByRole("button", { name: "Explore Ramayana" }).click();
  await page.getByRole("button", { name: "Follow becomes a living performance world to Ramlila" }).click();
  await page.getByRole("button", { name: "Follow representative place tradition to Ramnagar Ramlila" }).click();
  await expect(page.getByRole("heading", { name: "Ramnagar Ramlila" })).toBeVisible();
  await page.getByRole("button", { name: "Follow opens the wider Benares cultural geography to Kashi in another world" }).click();
  await expect(page.getByRole("heading", { name: "Kashi" })).toBeVisible();
  await page.getByRole("button", { name: "Reset map view" }).click();
  await page.getByRole("button", { name: "Explore Ramayana" }).click();

  await page.getByRole("button", { name: "Follow opens with to Balakanda" }).click();
  await page.getByRole("button", { name: "Follow continues into to Ayodhyakanda" }).click();
  await page.getByRole("button", { name: "Follow text and place thread to Ayodhya" }).click();
  await page.getByRole("button", { name: "Follow journey toward to Chitrakoot" }).click();
  await page.getByRole("button", { name: "Follow forest journey to Aranyakanda" }).click();
  await page.getByRole("button", { name: "Follow continues into to Kishkindhakanda" }).click();
  await page.getByRole("button", { name: "Follow opens narrative kingdom to Kishkindha" }).click();
  await page.getByRole("button", { name: "Follow opens into a living place-belief to Living Kishkindha landscape" }).click();
  await page.getByRole("button", { name: "Follow inhabits a present settlement landscape to Anegundi" }).click();
  await page.getByRole("button", { name: "Follow sits within the river landscape to Tungabhadra landscape" }).click();
  await page.getByRole("button", { name: "Follow holds the monumental site to Hampi's monumental world" }).click();
  await page.getByRole("button", { name: "Follow preserves the former capital to Vijayanagara capital" }).click();
  await page.getByRole("button", { name: "Follow centres a wider historical polity to Vijayanagara Empire" }).click();
  await page.getByRole("button", { name: "Follow reaches an attested imperial ruler to Krishna Deva Raya" }).click();
  await expect(page.getByRole("heading", { name: "Krishna Deva Raya" })).toBeVisible();
  await expect(page.getByText(/^\d+ found$/)).toBeVisible();
  await expect(page.getByText("Encounter")).toBeVisible();
  await page.getByRole("button", { name: "Return to the previous discovery" }).click();
  await expect(page.getByRole("heading", { name: "Vijayanagara Empire" })).toBeVisible();

  await page.getByRole("button", { name: "Reset map view" }).click();
  await page.getByRole("button", { name: "Explore Ramayana" }).click();

  await expect(page.getByRole("button", { name: "Dutt's English Ramayana, Complete electronic edition" })).toBeVisible();
  await page.getByRole("button", { name: "Follow English prose edition to Dutt's English Ramayana" }).click();
  await expect(page.getByRole("heading", { name: "Dutt's English Ramayana" })).toBeVisible();
  for (const node of ["Rama, Narrative character", "Sita, Narrative character", "Hanuman, Narrative character", "Ravana, Narrative character"]) {
    await expect(page.getByRole("button", { name: node })).toBeVisible();
  }
  await page.getByRole("button", { name: "Follow follows in this edition to Rama" }).click();
  await expect(page.getByRole("heading", { name: "Rama" })).toBeVisible();
  await expect(page.getByText("Sources and connection boundaries")).toBeVisible();
  await page.getByRole("button", { name: "Follow journeys with to Sita" }).click();
  await expect(page.getByRole("heading", { name: "Sita" })).toBeVisible();
  await page.getByRole("button", { name: "Reset map view" }).click();
  await page.getByRole("button", { name: "Explore Ramayana" }).click();

  const ayodhya = page.getByRole("button", { name: "Ayodhya, Place" });
  await expect(ayodhya).toBeVisible();
  const nodeBox = await ayodhya.boundingBox();
  expect(nodeBox).not.toBeNull();
  if (nodeBox) {
    const before = await scene.evaluate((element) => ({
      x: Number(element.getAttribute("data-view-x")),
      y: Number(element.getAttribute("data-view-y")),
    }));
    await page.mouse.move(nodeBox.x + nodeBox.width / 2, nodeBox.y + nodeBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(nodeBox.x + nodeBox.width / 2 + 96, nodeBox.y + nodeBox.height / 2 + 64, { steps: 5 });
    await page.mouse.up();
    await page.waitForTimeout(20);
    const after = await scene.evaluate((element) => ({
      x: Number(element.getAttribute("data-view-x")),
      y: Number(element.getAttribute("data-view-y")),
    }));
    expect(after.x).not.toBe(before.x);
    expect(after.y).not.toBe(before.y);
  }
  await ayodhya.click();
  await expect(page.getByRole("heading", { name: "Ayodhya" })).toBeVisible();

  await atlas.focus();
  for (let index = 0; index < 12; index += 1) await page.keyboard.press("Shift+ArrowDown");
  const lowerBound = Number(await scene.getAttribute("data-view-y"));
  for (let index = 0; index < 3; index += 1) await page.keyboard.press("Shift+ArrowUp");
  expect(Number(await scene.getAttribute("data-view-y"))).toBeGreaterThan(lowerBound);
  for (let index = 0; index < 12; index += 1) await page.keyboard.press("Shift+ArrowRight");
  const rightBound = Number(await scene.getAttribute("data-view-x"));
  for (let index = 0; index < 3; index += 1) await page.keyboard.press("Shift+ArrowLeft");
  expect(Number(await scene.getAttribute("data-view-x"))).toBeGreaterThan(rightBound);

  await page.getByRole("button", { name: "Reset map view" }).click();
  await page.getByRole("button", { name: "Explore Ramayana" }).click();
  await page.getByRole("button", { name: "Follow Rama homecoming tradition to Diwali in another world" }).click();
  await expect(page.getByRole("button", { name: "Explore Diwali" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Follow same new-moon night, distinct Bengal festival to Kali Puja" }).click();
  await expect(page.getByRole("heading", { name: "Kali Puja" })).toBeVisible();
  await page.getByRole("button", { name: "Follow explore a distinct textual Kālikā world to Kālikā in another world" }).click();
  await expect(page.getByRole("heading", { name: "Kālikā" })).toBeVisible();
  await page.getByRole("button", { name: "Follow adjacent manifestation passage to Kauśikī" }).click();
  await expect(page.getByRole("heading", { name: "Kauśikī" })).toBeVisible();
  await page.getByRole("button", { name: "Follow story continues toward to Dhūmralocana" }).click();
  await expect(page.getByRole("heading", { name: "Dhūmralocana" })).toBeVisible();
  await page.getByRole("button", { name: "Follow defeat triggers next command to Caṇḍa and Muṇḍa" }).click();
  await expect(page.getByRole("heading", { name: "Caṇḍa and Muṇḍa" })).toBeVisible();
  await page.getByRole("button", { name: "Follow defeat gives rise to name to Cāmuṇḍā" }).click();
  await expect(page.getByRole("heading", { name: "Cāmuṇḍā" })).toBeVisible();
  await page.getByRole("button", { name: "Follow acts in next battle to Raktabīja" }).click();
  await expect(page.getByRole("heading", { name: "Raktabīja" })).toBeVisible();
  await page.getByRole("button", { name: "Follow fall leads into to The Śumbha–Niśumbha battle" }).click();
  await expect(page.getByRole("heading", { name: "The Śumbha–Niśumbha battle" })).toBeVisible();
  await page.getByRole("button", { name: "Follow nested story returns to frame to The granting of boons" }).click();
  await expect(page.getByRole("heading", { name: "The granting of boons" })).toBeVisible();
  await page.getByRole("button", { name: "Follow resolves quest of to King Suratha" }).click();
  await expect(page.getByRole("heading", { name: "King Suratha" })).toBeVisible();

  await page.getByRole("button", { name: "Reset map view" }).click();
  await page.getByRole("button", { name: "Explore Diwali" }).click();
  await page.getByRole("button", { name: "Follow same new-moon night, distinct Bengal festival to Kali Puja" }).click();
  await page.getByRole("button", { name: "Follow connected Shakta goddess traditions to Durga in another world" }).click();
  await expect(page.getByRole("button", { name: "Explore Durga" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Follow living festival world to Durga Puja" }).click();
  await expect(page.getByRole("heading", { name: "Durga Puja" })).toBeVisible();
  await page.getByRole("button", { name: "Follow public performance of worship and art to Worship becomes public art" }).click();
  await expect(page.getByRole("heading", { name: "Worship becomes public art" })).toBeVisible();
  await page.getByRole("button", { name: "Follow unfolds through temporary installations to A city of temporary installations" }).click();
  await expect(page.getByRole("heading", { name: "A city of temporary installations" })).toBeVisible();
  await page.getByRole("button", { name: "Follow spreads through the living city to Kolkata" }).click();
  await expect(page.getByRole("heading", { name: "Kolkata" })).toBeVisible();

  await page.getByRole("button", { name: "Reset map view" }).click();
  await page.getByRole("button", { name: "Explore Sacred Time" }).click();
  await page.getByRole("button", { name: "Follow December Rama-Sita remembrance to Vivaha Panchami" }).click();
  await expect(page.getByRole("heading", { name: "Vivaha Panchami" })).toBeVisible();
  await page.getByRole("button", { name: "Follow source-labelled Rama-Sita remembrance to Sita in another world" }).click();
  await expect(page.getByRole("heading", { name: "Sita" })).toBeVisible();

  await page.getByRole("button", { name: "Reset map view" }).click();
  await page.getByRole("button", { name: "Explore Sacred Time" }).click();
  await page.getByRole("button", { name: "Follow Varanasi Kartika Purnima world to Dev Deepawali" }).click();
  await page.getByRole("button", { name: "Follow living Varanasi context to Kashi in another world" }).click();
  await expect(page.getByRole("heading", { name: "Kashi" })).toBeVisible();
  await page.getByRole("button", { name: "Follow distinct Kashi Bhairava lane to Kalabhairava Jayanti in another world" }).click();
  await expect(page.getByRole("heading", { name: "Kalabhairava Jayanti" })).toBeVisible();

  await page.getByRole("button", { name: "Reset map view" }).click();
  await page.getByRole("button", { name: "Explore Sacred Time" }).click();
  await page.getByRole("button", { name: "Follow seven named devotional dates to Ekadashi Cycle" }).click();
  await expect(page.getByRole("heading", { name: "Ekadashi Cycle" })).toBeVisible();
  await page.getByRole("button", { name: "Follow bounded Vishnu remembrance to Vishnu" }).click();
  await expect(page.getByRole("heading", { name: "Vishnu" })).toBeVisible();

  await page.getByRole("button", { name: "Reset map view" }).click();
  await page.getByRole("button", { name: "Explore Durga" }).click();
  await page.getByRole("button", { name: "Follow Hartalika goddess bridge to Parvati" }).click();
  await expect(page.getByRole("heading", { name: "Parvati" })).toBeVisible();
  await page.getByRole("button", { name: "Follow reunion remembered in Hartalika to Shiva" }).click();
  await expect(page.getByRole("heading", { name: "Shiva" })).toBeVisible();

  await page.getByRole("button", { name: "Reset map view" }).click();
  await page.getByRole("button", { name: "Explore Ramayana" }).click();
  await expect(page.getByRole("link", { name: "Begin at Ayodhya" })).toBeVisible();
  await page.getByRole("link", { name: "Begin at Ayodhya" }).click();
  await expect(page.getByRole("region", { name: "Ramayana story world" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Bālakāṇḍa" })).toBeVisible();
  await expect(page.getByRole("listitem", { name: /2\. Ayodhyākāṇḍa/ })).toBeVisible();
  await page.getByRole("button", { name: "हिं" }).click();
  await expect(page.getByRole("heading", { name: "बालकाण्ड" })).toBeVisible();
  await expect(page.getByText("देवम की स्रोत-आधारित सरल कथा")).toBeVisible();
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page.getByText("Story source", { exact: true })).toBeVisible();
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
  await expect(page.getByRole("heading", { name: "One roof. Three honest layers." })).toBeVisible();
  await expect(page.getByText("01 · Preserved")).toBeVisible();
  await expect(page.getByText("04 · Product-usable")).toBeVisible();
  await expect(page.getByText("07 · Civilizationally complete")).toBeVisible();
  await expect(page.getByText("0/4", { exact: true })).toBeVisible();
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
