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
  // This is intentionally one continuous open-world journey across the Atlas,
  // Hampi constellation, camera recovery, and bilingual story handoff. Clean
  // CI runners need a wider budget than the product's individual interactions.
  test.setTimeout(300_000);
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
  await page.getByRole("button", { name: "Follow Rama homecoming story tradition to Diwali in another world" }).click();
  await expect(page.getByRole("button", { name: "Explore Diwali" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Follow same new-moon night, distinct Bengal festival to Kali Puja" }).click();
  await expect(page.getByRole("heading", { name: "Kali Puja" })).toBeVisible();
  await page.getByRole("button", { name: "Follow opens a living Kalighat temple world to Kalighat Kali Temple in another world" }).click();
  await expect(page.getByRole("heading", { name: "Kalighat Kali Temple" })).toBeVisible();
  await page.getByRole("button", { name: "Follow centres a living Kali form to The Kali form at Kalighat" }).click();
  await expect(page.getByRole("heading", { name: "The Kali form at Kalighat" })).toBeVisible();
  await page.getByRole("button", { name: "Follow invites a living-form and textual-form comparison to Kālikā" }).click();
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
  await page.getByRole("button", { name: "Follow opens a living Kalighat temple world to Kalighat Kali Temple in another world" }).click();
  await page.getByRole("button", { name: "Follow also opens a distinct Kalighat festival context to Durga Puja" }).click();
  await expect(page.getByRole("heading", { name: "Durga Puja" })).toBeVisible();
  await page.getByRole("button", { name: "Follow public performance of worship and art to Worship becomes public art" }).click();
  await expect(page.getByRole("heading", { name: "Worship becomes public art" })).toBeVisible();
  await page.getByRole("button", { name: "Follow unfolds through temporary installations to A city of temporary installations" }).click();
  await expect(page.getByRole("heading", { name: "A city of temporary installations" })).toBeVisible();
  await page.getByRole("button", { name: "Follow spreads through the living city to Kolkata" }).click();
  await expect(page.getByRole("heading", { name: "Kolkata" })).toBeVisible();

  await page.getByRole("button", { name: "Reset map view" }).click();
  await page.getByRole("button", { name: "Explore Diwali" }).click();
  await page.getByRole("button", { name: "Follow same new-moon night, distinct Bengal festival to Kali Puja" }).click();
  await page.getByRole("button", { name: "Follow opens Dakshineswar's Shyama Puja to Shyama Puja at Dakshineswar" }).click();
  await page.getByRole("button", { name: "Follow takes place in a living temple world to Dakshineswar Kali Temple in another world" }).click();
  await expect(page.getByRole("heading", { name: "Dakshineswar Kali Temple" })).toBeVisible();
  await page.getByRole("button", { name: "Follow opens its patronage history to Rani Rashmoni" }).click();
  await expect(page.getByRole("heading", { name: "Rani Rashmoni" })).toBeVisible();
  await page.getByRole("button", { name: "Follow opens its patronage history to Dakshineswar Kali Temple" }).click();
  await page.getByRole("button", { name: "Follow includes a row of Shiva temples to Dakshineswar's Shiva temples" }).click();
  await page.getByRole("button", { name: "Follow opens the wider Shiva universe to Shiva in another world" }).click();
  await expect(page.getByRole("heading", { name: "Shiva" })).toBeVisible();

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
  await page.getByRole("button", { name: "Follow opens a nearby Buddhist sacred world to Sarnath" }).click();
  await expect(page.getByRole("heading", { name: "Sarnath" })).toBeVisible();
  await page.getByRole("button", { name: "Follow remembers the Buddha's first teaching to The Buddha at Sarnath" }).click();
  await page.getByRole("button", { name: "Follow teaches Dhamma here to The first teaching at Sarnath" }).click();
  await page.getByRole("button", { name: "Follow opens the remembered early Sangha to The early Sangha at Sarnath" }).click();
  await expect(page.getByRole("heading", { name: "The early Sangha at Sarnath" })).toBeVisible();

  await page.getByRole("button", { name: "Reset map view" }).click();
  await page.getByRole("button", { name: "Explore Sacred Time" }).click();
  await page.getByRole("button", { name: "Follow Varanasi Kartika Purnima world to Dev Deepawali" }).click();
  await page.getByRole("button", { name: "Follow living Varanasi context to Kashi in another world" }).click();
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
  await expect(page.getByRole("link", { name: "Choose an illustrated story world" })).toBeVisible();
  await page.getByRole("link", { name: "Choose an illustrated story world" }).click();
  const ramayanaWorld = page.getByRole("region", { name: "Ramayana story world" });
  await expect(ramayanaWorld).toBeVisible();
  await expect(page.getByRole("heading", { name: "Choose the visual world you want to enter" })).toBeVisible();
  await expect(page.getByLabel("Illustrated story worlds ready to enter").getByRole("button")).toHaveCount(6);
  await page.getByRole("button", { name: /Browse the 49-turn story atlas instead/ }).click();
  await expect(page.getByRole("heading", { name: "Enter the story from anywhere" })).toBeVisible();
  const storyWorlds = page.getByRole("navigation", { name: "Seven Ramayana story worlds" });
  await expect(storyWorlds.getByRole("button")).toHaveCount(7);
  await expect(page.getByRole("button", { name: "1. A coronation dawns", exact: true })).toBeVisible();
  await storyWorlds.getByRole("button", { name: /Beginnings/ }).click();
  await expect(page.getByRole("button", { name: /A story finds its voice/ })).toBeVisible();
  await page.getByRole("button", { name: /The princes enter the wider world/ }).click();
  await page.getByRole("button", { name: "Follow Rama's character path" }).click();
  await expect(page.getByText("FOLLOWING A CHARACTER", { exact: true })).toBeVisible();
  await expect(page.getByRole("region", { name: "Whole Ramayana story compass" }).getByText(/moments across .* worlds/)).toBeVisible();
  await page.getByRole("button", { name: "Next story turn" }).click();
  await expect(page.getByRole("heading", { name: "The road to Mithila" })).toBeVisible();
  await page.getByRole("button", { name: "Back to The princes enter the wider world" }).click();
  await expect(page.getByRole("heading", { name: "The princes enter the wider world" })).toBeVisible();
  await page.getByRole("button", { name: "Follow Ayodhya's place path" }).click();
  await expect(page.getByText("FOLLOWING A PLACE", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Back to The princes enter the wider world" }).click();
  await page.getByRole("button", { name: "Map", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Travel through the story by place" })).toBeVisible();
  await page.getByRole("button", { name: "Whole story", exact: true }).click();
  await page.getByRole("button", { name: /War and return/ }).click();
  await expect(page.getByRole("button", { name: "7. The road home", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "7. The road home", exact: true }).click();
  await expect(page.getByText("PLAYABLE NOW", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Enter this story world" }).click();
  await expect(page.getByRole("heading", { name: "Leave Lanka" })).toBeVisible();
  await expect(page.getByTestId("journey-beat-stage")).toHaveAttribute("data-motif", "gather");
  await expect(page.getByRole("listitem", { name: /2\. The sky road remembers/ })).toBeVisible();
  await expect(page.getByRole("group", { name: "Scene camera controls, 100%" })).toBeVisible();
  await page.getByRole("button", { name: "Zoom scene in" }).click();
  await expect(ramayanaWorld).toHaveAttribute("data-camera-scale", "1.10");
  await page.getByRole("button", { name: "Reset scene view" }).click();
  await expect(ramayanaWorld).toHaveAttribute("data-camera-scale", "1.00");

  const lookPoint = await ramayanaWorld.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    for (const yRatio of [.2, .45, .7]) {
      for (const xRatio of [.82, .65, .5]) {
        const x = rect.left + rect.width * xRatio;
        const y = rect.top + rect.height * yRatio;
        const target = document.elementFromPoint(x, y);
        if (target?.closest('[aria-label="Ramayana story world"]') === element && !target.closest("a,button")) return { x, y };
      }
    }
    return { x: rect.left + rect.width * .82, y: rect.top + rect.height * .7 };
  });
  await page.mouse.move(lookPoint.x, lookPoint.y);
  await page.mouse.down();
  await page.mouse.move(lookPoint.x - 38, lookPoint.y + 24, { steps: 4 });
  await page.mouse.up();
  await expect(ramayanaWorld).not.toHaveAttribute("data-camera-x", "0");
  await page.getByRole("button", { name: "Reset scene view" }).click();

  await ramayanaWorld.focus();
  await page.keyboard.press("Shift+ArrowRight");
  await expect(ramayanaWorld).not.toHaveAttribute("data-camera-x", "0");
  await page.keyboard.press("Home");
  await expect(ramayanaWorld).toHaveAttribute("data-camera-x", "0");
  await page.keyboard.press("ArrowRight");
  await expect(page.getByText("One more request", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Leave Lanka" })).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("heading", { name: "The sky road remembers" })).toBeVisible();
  const skyRoadBackdrop = page.locator('[data-scene-asset="/journeys/ramayana-return-sky-road-v1.webp"]');
  await expect(skyRoadBackdrop).toBeVisible();
  await expect(skyRoadBackdrop.locator("img")).toHaveJSProperty("complete", true);
  await expect(page.getByTestId("journey-beat-stage")).toHaveAttribute("data-motif", "memory");
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("heading", { name: "Leave Lanka" })).toBeVisible();

  await page.getByRole("button", { name: "Map" }).click();
  await expect(page.getByRole("button", { name: "Nandigrama, 2 story moments", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Connections" }).click();
  await expect(page.getByRole("button", { name: "Explore Departure from Lanka, Story event" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Explore Vibhishana, Narrative character" })).toBeVisible();
  await page.getByRole("button", { name: "Explore Departure from Lanka, Story event" }).click();
  await expect(page.getByRole("complementary", { name: "Departure from Lanka encounter" })).toBeVisible();
  await expect(page.getByText(/returning company gathers, boards the Pushpaka/)).toBeVisible();
  await page.getByRole("button", { name: /travels with Rama/ }).click();
  await expect(page.getByRole("complementary", { name: "Rama encounter" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open its exact library trail" })).toBeVisible();
  await page.getByRole("button", { name: "← Previous discovery" }).click();
  await page.getByRole("button", { name: "← Back to the scene" }).click();
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await page.getByRole("button", { name: "Rama", exact: true }).click();
  await expect(page.getByText("Meet Rama in the story", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /The sky road remembers.*Enter this scene/ }).click();
  await expect(page.getByRole("heading", { name: "The sky road remembers" })).toBeVisible();
  await page.getByRole("button", { name: "Go to scene 1" }).click();
  await page.getByRole("button", { name: "Zoom scene in" }).click();
  await expect(page.getByRole("button", { name: "Discover Vibhishana, Narrative character" })).toBeVisible();
  await page.getByRole("button", { name: "Reset scene view" }).click();
  await page.getByRole("button", { name: "हिं" }).click();
  await expect(page.getByRole("heading", { name: "लंका से प्रस्थान" })).toBeVisible();
  await expect(page.getByText("देवम की स्रोत-आधारित सरल कथा")).toBeVisible();
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page.getByText("Story source", { exact: true })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("the Ramayana narrative map pans, zooms, and returns to exact story context", async ({ page }) => {
  await page.goto("/search");
  await page.evaluate(() => window.localStorage.setItem("devam-guest-gateways", JSON.stringify(["ramayana"])));
  await page.goto("/");
  await page.getByRole("button", { name: "Explore Ramayana" }).click();
  await page.getByRole("link", { name: "Choose an illustrated story world" }).click();
  await page.getByRole("button", { name: "Map", exact: true }).click();

  const narrativeMap = page.getByLabel("Pannable Ramayana story map");
  const ramayanaWorld = page.getByRole("region", { name: "Ramayana story world" });
  await expect(narrativeMap).toBeVisible();
  expect(await ramayanaWorld.evaluate((element) => ({ left: element.scrollLeft, top: element.scrollTop }))).toEqual({ left: 0, top: 0 });
  await page.getByRole("button", { name: "Mithila, 3 story moments" }).click();
  await expect(page.getByRole("heading", { name: "Mithila", exact: true })).toBeVisible();
  await expect(page.getByRole("list", { name: "Mithila story moments" }).getByRole("button")).toHaveCount(3);

  const mapBox = await narrativeMap.boundingBox();
  expect(mapBox).not.toBeNull();
  await page.waitForTimeout(450);
  const panStart = await narrativeMap.evaluate((element) => element.scrollLeft);
  await page.mouse.move(mapBox!.x + mapBox!.width * .76, mapBox!.y + mapBox!.height * .77);
  await page.mouse.down();
  await page.mouse.move(mapBox!.x + mapBox!.width * .32, mapBox!.y + mapBox!.height * .77, { steps: 5 });
  await page.mouse.up();
  const panForward = await narrativeMap.evaluate((element) => element.scrollLeft);
  expect(panForward).toBeGreaterThan(panStart + 30);
  await page.mouse.move(mapBox!.x + mapBox!.width * .32, mapBox!.y + mapBox!.height * .77);
  await page.mouse.down();
  await page.mouse.move(mapBox!.x + mapBox!.width * .7, mapBox!.y + mapBox!.height * .77, { steps: 5 });
  await page.mouse.up();
  expect(await narrativeMap.evaluate((element) => element.scrollLeft)).toBeLessThan(panForward - 20);

  await expect(page.getByRole("button", { name: "Ahalya's hermitage, 1 story moment" })).toHaveCSS("opacity", "0");
  await page.getByRole("button", { name: "Zoom narrative map in" }).click();
  await expect(page.getByRole("button", { name: "Ahalya's hermitage, 1 story moment" })).toHaveCSS("opacity", "1");
  await page.getByRole("button", { name: /Ayodhya, \d+ story moments/ }).click();
  await page.getByRole("button", { name: "Back to Mithila" }).click();
  await page.getByRole("button", { name: /Sita and the impossible bow/ }).click();
  await page.getByRole("button", { name: "Open in the whole story" }).click();
  await expect(page.getByRole("heading", { name: "Sita and the impossible bow" })).toBeVisible();
  await page.getByRole("button", { name: "Map", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Mithila", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Nandigrama, 2 story moments", exact: true }).click();
  const nandigramaScenes = page.getByLabel("Nandigrama playable story connections");
  await expect(nandigramaScenes.getByRole("button")).toHaveCount(3);
  await expect(nandigramaScenes.getByText("arrives in", { exact: false })).toBeVisible();
  await expect(nandigramaScenes.getByText("unfolds at", { exact: false })).toHaveCount(2);
  await nandigramaScenes.getByRole("button", { name: /Bharata hears the news.*Enter playable scene/ }).click();
  await expect(page.getByRole("heading", { name: "Bharata hears the news" })).toBeVisible();
  await page.getByRole("button", { name: "Map", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Nandigrama", exact: true })).toBeVisible();
  await expect(page.getByLabel("Nandigrama playable story connections").getByRole("button")).toHaveCount(3);

  await page.getByRole("button", { name: /Ayodhya, \d+ story moments/ }).click();
  const ayodhyaScenes = page.getByLabel("Ayodhya playable story connections");
  await expect(ayodhyaScenes.getByRole("button")).toHaveCount(12);
  await expect(ayodhyaScenes.getByText("asks for news of", { exact: false })).toBeVisible();
  await ayodhyaScenes.getByRole("button", { name: /The kingdom is returned.*Enter playable scene/ }).click();
  await expect(page.getByRole("heading", { name: "The kingdom is returned" })).toBeVisible();
  await page.getByRole("button", { name: "Map", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Ayodhya", exact: true })).toBeVisible();
  expect(await ramayanaWorld.evaluate((element) => ({ left: element.scrollLeft, top: element.scrollTop }))).toEqual({ left: 0, top: 0 });
  await expectNoHorizontalOverflow(page);
});

test("a Ramayana character path opens illustrated scenes and returns without losing context", async ({ page }) => {
  await page.goto("/journeys/ramayana");
  await page.getByRole("button", { name: /Browse the 49-turn story atlas instead/ }).click();
  await page.getByRole("button", { name: /War and return/ }).click();
  await page.getByRole("button", { name: "7. The road home", exact: true }).click();
  await page.getByRole("button", { name: "Enter this story world" }).click();

  await page.getByRole("button", { name: "Rama", exact: true }).click();
  const ramaPath = page.getByRole("complementary", { name: "Rama encounter" });
  const moments = ramaPath.getByLabel("Story moments involving Rama").getByRole("button");
  await expect(moments).toHaveCount(33);
  for (let index = 0; index < 33; index += 1) {
    const moment = moments.nth(index);
    await moment.scrollIntoViewIfNeeded();
    await expect.poll(() => moment.locator("img").evaluate((element) => {
      const image = element as HTMLImageElement;
      return image.complete && image.naturalWidth > 0 && image.naturalHeight > 0;
    })).toBe(true);
  }
  await ramaPath.getByRole("button", { name: /Scene 47.*The kingdom is returned.*Enter this scene/ }).click();

  await expect(page.getByRole("heading", { name: "The kingdom is returned" })).toBeVisible();
  const returnPortal = page.getByRole("button", { name: "Back to Rama's story path" });
  await expect(returnPortal).toBeVisible();
  await returnPortal.click();
  await expect(page.getByRole("complementary", { name: "Rama encounter" })).toBeVisible();
  await expect(page.getByLabel("Story moments involving Rama").getByRole("button", { name: /Scene 47.*You are here/ })).toHaveAttribute("aria-current", "step");
  await page.getByRole("button", { name: /Back to the scene/ }).click();
  await expect(page.getByRole("heading", { name: "The kingdom is returned" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("the Ramayana homecoming opens distinct living Diwali lanes and returns through the graph", async ({ page }) => {
  await page.goto("/journeys/ramayana");
  await page.getByRole("button", { name: "Enter illustrated world: The road home" }).click();
  await page.getByRole("button", { name: "Go to scene 7" }).click();
  await page.getByRole("button", { name: "Connections", exact: true }).click();
  await page.getByRole("button", { name: "Explore Diwali, Master world" }).click();

  const livingBridge = page.getByRole("region", { name: "Ramayana to living Diwali" });
  await expect(livingBridge).toBeVisible();
  await expect(livingBridge.getByText("The story connection", { exact: true })).toBeVisible();
  const livingPaths = livingBridge.getByLabel("Three distinct living Diwali paths").getByRole("button");
  await expect(livingPaths).toHaveCount(3);
  await expect.poll(() => livingBridge.locator("img").evaluateAll((images) => images.every((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);

  await livingBridge.getByRole("button", { name: /Bengal.*Enter this living path/ }).click();
  const kaliLane = page.getByRole("region", { name: /living-practice lane/ });
  await expect(kaliLane.getByText("What people may do today", { exact: true })).toBeVisible();
  await expect(kaliLane.getByText("Why this lane matters", { exact: true })).toBeVisible();
  await kaliLane.getByRole("button", { name: /Travel onward from/ }).click();

  await expect(page.getByRole("complementary", { name: "Kali Puja encounter" })).toBeVisible();
  await page.getByRole("button", { name: /opens a living Kalighat temple world/ }).click();
  await expect(page.getByRole("complementary", { name: "Kalighat Kali Temple encounter" })).toBeVisible();
  await page.getByRole("button", { name: /also opens a distinct Kalighat festival context/ }).click();
  await expect(page.getByRole("complementary", { name: "Durga Puja encounter" })).toBeVisible();

  await page.getByRole("button", { name: /Previous discovery/ }).click();
  await page.getByRole("button", { name: /Previous discovery/ }).click();
  await page.getByRole("button", { name: /Previous discovery/ }).click();
  await expect(page.getByRole("region", { name: "Ramayana to living Diwali" })).toBeVisible();
  await page.getByRole("button", { name: /Back to the scene/ }).click();
  await expect(page.getByRole("heading", { name: "The kingdom is returned" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("the Ramayana road home loads a distinct tableau for every scene", async ({ page }) => {
  await page.goto("/journeys/ramayana");
  await page.getByRole("button", { name: /Browse the 49-turn story atlas instead/ }).click();
  await page.getByRole("button", { name: /War and return/ }).click();
  await page.getByRole("button", { name: "7. The road home", exact: true }).click();
  await page.getByRole("button", { name: "Enter this story world" }).click();

  const sceneAssets = [
    "/journeys/ramayana-return-lanka-v1.webp",
    "/journeys/ramayana-return-sky-road-v1.webp",
    "/journeys/ramayana-return-hermitage-v1.webp",
    "/journeys/ramayana-return-hanuman-ahead-v1.webp",
    "/journeys/ramayana-return-bharata-hears-v1.webp",
    "/journeys/ramayana-return-ayodhya-v1.webp",
    "/journeys/ramayana-return-coronation-v1.webp",
  ];

  for (const [index, asset] of sceneAssets.entries()) {
    await page.getByRole("button", { name: `Go to scene ${index + 1}` }).click();
    const backdrop = page.locator(`[data-scene-asset="${asset}"]`);
    await expect(backdrop).toBeVisible();
    await expect.poll(() => backdrop.locator("img").evaluate((element) => {
      const image = element as HTMLImageElement;
      return image.complete && image.naturalWidth > 0 && image.naturalHeight > 0;
    })).toBe(true);
  }

  await expectNoHorizontalOverflow(page);
});

test("the Ayodhya exile district unfolds across eight illustrated scenes and returns to the district selector", async ({ page }) => {
  await page.goto("/journeys/ramayana");
  const illustratedWorlds = page.getByLabel("Illustrated story worlds ready to enter").getByRole("button");
  await expect(illustratedWorlds).toHaveCount(6);
  await page.getByRole("button", { name: "Enter illustrated world: The night the road changed" }).click();
  await expect(page.getByRole("heading", { name: "A coronation dawns" })).toBeVisible();
  await expect(page.getByText("Dasharatha names the future", { exact: true })).toBeVisible();
  await expect(page.getByRole("list", { name: "Story scenes" }).getByRole("listitem")).toHaveCount(8);

  const sceneAssets = [
    "/journeys/ramayana-exile-coronation-dawn-v1.webp",
    "/journeys/ramayana-exile-manthara-v1.webp",
    "/journeys/ramayana-exile-two-demands-v1.webp",
    "/journeys/ramayana-exile-dasharatha-v1.webp",
    "/journeys/ramayana-exile-summons-v1.webp",
    "/journeys/ramayana-exile-accepted-v1.webp",
    "/journeys/ramayana-exile-sita-chooses-v1.webp",
    "/journeys/ramayana-exile-three-depart-v1.webp",
  ];
  for (const [index, asset] of sceneAssets.entries()) {
    await page.getByRole("button", { name: `Go to scene ${index + 1}` }).click();
    const backdrop = page.locator(`[data-scene-asset="${asset}"]`);
    await expect(backdrop).toBeVisible();
    await expect.poll(() => backdrop.locator("img").evaluate((element) => {
      const image = element as HTMLImageElement;
      return image.complete && image.naturalWidth > 0 && image.naturalHeight > 0;
    })).toBe(true);
  }

  await expect(page.getByRole("heading", { name: "Three turn toward the gate" })).toBeVisible();
  await expect(page.getByText("Lakshmana asks for the road", { exact: true })).toBeVisible();
  for (let beat = 0; beat < 4; beat += 1) await page.getByRole("button", { name: "Next story beat" }).click();
  await page.getByRole("button", { name: "Complete this path" }).click();
  await expect(page.getByText("Illustrated district discovered", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Explore another visual district" }).click();
  await expect(page.getByRole("heading", { name: "Choose the visual world you want to enter" })).toBeVisible();
  await expect(page.getByLabel("Illustrated story worlds ready to enter").getByRole("button")).toHaveCount(6);
  await expectNoHorizontalOverflow(page);
});

test("the first-rivers district carries the exile through eight distinct illustrated worlds", async ({ page }) => {
  await page.goto("/journeys/ramayana");
  const illustratedWorlds = page.getByLabel("Illustrated story worlds ready to enter");
  await expect(illustratedWorlds.getByRole("button", { name: "Enter illustrated world: Across the first rivers" })).toBeVisible();
  await illustratedWorlds.getByRole("button", { name: "Enter illustrated world: Across the first rivers" }).click();

  await expect(page.getByRole("heading", { name: "The city follows" })).toBeVisible();
  await expect(page.getByText("The inner rooms erupt", { exact: true })).toBeVisible();
  await expect(page.getByRole("list", { name: "Story scenes" }).getByRole("listitem")).toHaveCount(8);

  const sceneAssets = [
    "/journeys/ramayana-rivers-city-follows-v1.webp",
    "/journeys/ramayana-rivers-tamasa-night-v1.webp",
    "/journeys/ramayana-rivers-kosala-road-v1.webp",
    "/journeys/ramayana-rivers-guha-watch-v1.webp",
    "/journeys/ramayana-rivers-ganga-crossing-v1.webp",
    "/journeys/ramayana-rivers-forest-night-v1.webp",
    "/journeys/ramayana-rivers-yamuna-road-v1.webp",
    "/journeys/ramayana-rivers-chitrakoot-home-v1.webp",
  ];
  for (const [index, asset] of sceneAssets.entries()) {
    await page.getByRole("button", { name: `Go to scene ${index + 1}` }).click();
    const backdrop = page.locator(`[data-scene-asset="${asset}"]`);
    await expect(backdrop).toBeVisible();
    await expect.poll(() => backdrop.locator("img").evaluate((element) => {
      const image = element as HTMLImageElement;
      return image.complete && image.naturalWidth > 0 && image.naturalHeight > 0;
    })).toBe(true);
  }

  await expect(page.getByRole("heading", { name: "A home at Chitrakoot" })).toBeVisible();
  await expect(page.getByText("Birdsong begins the final walk", { exact: true })).toBeVisible();
  for (let beat = 0; beat < 4; beat += 1) await page.getByRole("button", { name: "Next story beat" }).click();
  await expect(page.getByText("The three enter their home", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Complete this path" }).click();
  await expect(page.getByText("Illustrated district discovered", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Explore another visual district" }).click();
  await expect(page.getByLabel("Illustrated story worlds ready to enter").getByRole("button")).toHaveCount(6);
  await expectNoHorizontalOverflow(page);
});

test("the empty-throne district turns Bharata's return into eight detailed illustrated scenes", async ({ page }) => {
  await page.goto("/journeys/ramayana");
  const illustratedWorlds = page.getByLabel("Illustrated story worlds ready to enter");
  await expect(illustratedWorlds.getByRole("button", { name: "Enter illustrated world: The empty throne" })).toBeVisible();
  await illustratedWorlds.getByRole("button", { name: "Enter illustrated world: The empty throne" }).click();

  await expect(page.getByRole("heading", { name: "The empty chariot returns" })).toBeVisible();
  await expect(page.getByText("Sumantra finally turns home", { exact: true })).toBeVisible();
  await expect(page.getByRole("list", { name: "Story scenes" }).getByRole("listitem")).toHaveCount(8);

  const sceneAssets = [
    "/journeys/ramayana-throne-empty-chariot-v1.webp",
    "/journeys/ramayana-throne-palace-grief-v1.webp",
    "/journeys/ramayana-throne-river-memory-v1.webp",
    "/journeys/ramayana-throne-city-without-king-v1.webp",
    "/journeys/ramayana-throne-bharata-return-v1.webp",
    "/journeys/ramayana-throne-boons-rejected-v1.webp",
    "/journeys/ramayana-throne-funeral-trust-v1.webp",
    "/journeys/ramayana-throne-road-to-rama-v1.webp",
  ];
  for (const [index, asset] of sceneAssets.entries()) {
    await page.getByRole("button", { name: `Go to scene ${index + 1}` }).click();
    const backdrop = page.locator(`[data-scene-asset="${asset}"]`);
    await expect(backdrop).toBeVisible();
    await expect.poll(() => backdrop.locator("img").evaluate((element) => {
      const image = element as HTMLImageElement;
      return image.complete && image.naturalWidth > 0 && image.naturalHeight > 0;
    })).toBe(true);
  }

  await expect(page.getByRole("heading", { name: "The crown becomes a road" })).toBeVisible();
  await expect(page.getByText("Bharata stops the punishment Rama would reject", { exact: true })).toBeVisible();
  for (let beat = 0; beat < 5; beat += 1) await page.getByRole("button", { name: "Next story beat" }).click();
  await expect(page.getByText("The whole city turns toward Rama", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Complete this path" }).click();
  await expect(page.getByText("Illustrated district discovered", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Explore another visual district" }).click();
  await expect(page.getByLabel("Illustrated story worlds ready to enter").getByRole("button")).toHaveCount(6);
  await expectNoHorizontalOverflow(page);
});

test("the road that asks Rama home traverses eight visual worlds from the Ganga to Nandigrama", async ({ page }) => {
  await page.goto("/journeys/ramayana");
  const illustratedWorlds = page.getByLabel("Illustrated story worlds ready to enter");
  const entry = illustratedWorlds.getByRole("button", { name: "Enter illustrated world: The road that asks Rama home" });
  await expect(entry).toBeVisible();
  await entry.click();

  await expect(page.getByRole("heading", { name: "A kingdom reaches the Ganga" })).toBeVisible();
  await expect(page.getByText("A kingdom leaves its throne behind", { exact: true })).toBeVisible();
  await expect(page.getByRole("list", { name: "Story scenes" }).getByRole("listitem")).toHaveCount(8);

  const sceneAssets = [
    "/journeys/ramayana-bharata-expedition-ganga-v1.webp",
    "/journeys/ramayana-bharata-ingudi-crossing-v1.webp",
    "/journeys/ramayana-bharata-bharadvaja-wonder-v1.webp",
    "/journeys/ramayana-bharata-chitrakoot-alarm-v1.webp",
    "/journeys/ramayana-bharata-brothers-meet-v1.webp",
    "/journeys/ramayana-bharata-family-council-v1.webp",
    "/journeys/ramayana-bharata-sandals-vow-v1.webp",
    "/journeys/ramayana-bharata-nandigrama-v1.webp",
  ];
  for (const [index, asset] of sceneAssets.entries()) {
    await page.getByRole("button", { name: `Go to scene ${index + 1}` }).click();
    const backdrop = page.locator(`[data-scene-asset="${asset}"]`);
    await expect(backdrop).toBeVisible();
    await expect.poll(() => backdrop.locator("img").evaluate((element) => {
      const image = element as HTMLImageElement;
      return image.complete && image.naturalWidth > 0 && image.naturalHeight > 0;
    })).toBe(true);
  }

  await expect(page.getByRole("heading", { name: "The trust moves to Nandigrama" })).toBeVisible();
  await expect(page.getByText("Bharata carries the answer above himself", { exact: true })).toBeVisible();
  for (let beat = 0; beat < 5; beat += 1) await page.getByRole("button", { name: "Next story beat" }).click();
  await expect(page.getByText("A trust is installed, not another king", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Complete this path" }).click();
  await expect(page.getByText("Illustrated district discovered", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Explore another visual district" }).click();
  await expect(page.getByLabel("Illustrated story worlds ready to enter").getByRole("button")).toHaveCount(6);
  await expectNoHorizontalOverflow(page);
});

test("the deeper-Dandaka district traverses eight visual worlds from Chitrakoot toward Panchavati", async ({ page }) => {
  await page.goto("/journeys/ramayana");
  const illustratedWorlds = page.getByLabel("Illustrated story worlds ready to enter");
  await expect(illustratedWorlds.getByRole("button")).toHaveCount(6);
  const entry = illustratedWorlds.getByRole("button", { name: "Enter illustrated world: Deeper into Dandaka" });
  await expect(entry).toBeVisible();
  await entry.click();

  await expect(page.getByRole("heading", { name: "Chitrakoot can no longer hold them" })).toBeVisible();
  await expect(page.getByText("Fear appears before its name", { exact: true })).toBeVisible();
  await expect(page.getByRole("list", { name: "Story scenes" }).getByRole("listitem")).toHaveCount(8);

  const sceneAssets = [
    "/journeys/ramayana-dandaka-chitrakoot-departure-v1.webp",
    "/journeys/ramayana-dandaka-sita-anasuya-v1.webp",
    "/journeys/ramayana-dandaka-hermitages-v1.webp",
    "/journeys/ramayana-dandaka-viradha-v1.webp",
    "/journeys/ramayana-dandaka-sarabhanga-v1.webp",
    "/journeys/ramayana-dandaka-sita-dialogue-v1.webp",
    "/journeys/ramayana-dandaka-panchapsara-v1.webp",
    "/journeys/ramayana-dandaka-agastya-v1.webp",
  ];
  for (const [index, asset] of sceneAssets.entries()) {
    await page.getByRole("button", { name: `Go to scene ${index + 1}` }).click();
    const backdrop = page.locator(`[data-scene-asset="${asset}"]`);
    await expect(backdrop).toBeVisible();
    await expect.poll(() => backdrop.locator("img").evaluate((element) => {
      const image = element as HTMLImageElement;
      return image.complete && image.naturalWidth > 0 && image.naturalHeight > 0;
    })).toBe(true);
  }

  await expect(page.getByRole("heading", { name: "Agastya points toward Panchavati" })).toBeVisible();
  await expect(page.getByText("The road already carries remembered stories", { exact: true })).toBeVisible();
  for (let beat = 0; beat < 5; beat += 1) await page.getByRole("button", { name: "Next story beat" }).click();
  await expect(page.getByText("Panchavati becomes the next home", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Complete this path" }).click();
  await expect(page.getByText("Illustrated district discovered", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Explore another visual district" }).click();
  await expect(page.getByLabel("Illustrated story worlds ready to enter").getByRole("button")).toHaveCount(6);
  await expectNoHorizontalOverflow(page);
});

test("the four curated journeys and mission board are reachable", async ({ page }) => {
  await page.goto("/journeys");
  await expect(page.getByRole("heading", { name: /Choose a thread/ })).toBeVisible();
  for (const title of [
    "The promise, the forest, the sandals, and the return",
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
  await page.waitForLoadState("networkidle");
  const dateInput = page.getByLabel("Date");
  await dateInput.fill("2026-11-08");
  await expect(dateInput).toHaveValue("2026-11-08");
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
