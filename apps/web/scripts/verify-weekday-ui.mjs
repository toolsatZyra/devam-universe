import { chromium } from "playwright";
import { spawn, execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const outputPath = fileURLToPath(new URL("../../tmp/runtime-today-weekday-mobile.png", import.meta.url));
const diwaliOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-diwali-mobile.png", import.meta.url));
const dhantrayodashiOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-dhantrayodashi-mobile.png", import.meta.url));
const kaliPujaOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-kali-puja-mobile.png", import.meta.url));
const tamilDeepavaliOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-tamil-deepavali-mobile.png", import.meta.url));
const govardhanaOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-govardhana-mobile.png", import.meta.url));
const baliPratipadaOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-bali-pratipada-mobile.png", import.meta.url));
const bhaiDoojOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-bhai-dooj-mobile.png", import.meta.url));
const pradoshaOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-pradosha-mobile.png", import.meta.url));
const ganeshotsavOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-ganeshotsav-mobile.png", import.meta.url));
const pitruPakshaOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-pitru-paksha-mobile.png", import.meta.url));
const durgaPujaOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-durga-puja-mobile.png", import.meta.url));
const kojagaraOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-kojagara-mobile.png", import.meta.url));
const durgashtamiBengalOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-bengal-masika-durgashtami-mobile.png", import.meta.url));
const durgashtamiOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-masika-durgashtami-mobile.png", import.meta.url));
const hartalikaOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-hartalika-mobile.png", import.meta.url));
const rishiPanchamiOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-rishi-panchami-mobile.png", import.meta.url));
const radhaAshtamiOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-radha-ashtami-mobile.png", import.meta.url));
const janmashtamiSmartaOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-janmashtami-smarta-mobile.png", import.meta.url));
const janmashtamiIskconOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-janmashtami-iskcon-mobile.png", import.meta.url));
const balaramaUnresolvedOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-balarama-unresolved-mobile.png", import.meta.url));
const vishwakarmaBengalOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-vishwakarma-bengal-mobile.png", import.meta.url));
const ekadashiSmartaOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-ekadashi-smarta-mobile.png", import.meta.url));
const ekadashiIskconOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-ekadashi-iskcon-mobile.png", import.meta.url));
const chhathOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-chhath-mobile.png", import.meta.url));
const vasuBarasOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-vasu-baras-mobile.png", import.meta.url));
const narakaChaturdashiOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-naraka-chaturdashi-mobile.png", import.meta.url));
const kaliChaudasOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-kali-chaudas-baps-mobile.png", import.meta.url));
const gujaratiNewYearOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-gujarati-new-year-baps-mobile.png", import.meta.url));
const balipadyamiOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-balipadyami-karnataka-mobile.png", import.meta.url));
const jainDiwaliOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-jain-diwali-mobile.png", import.meta.url));
const bandiChhorOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-bandi-chhor-mobile.png", import.meta.url));
const ahoiAshtamiOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-ahoi-ashtami-mobile.png", import.meta.url));
const tulasiVivahGeneralOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-tulasi-vivah-general-mobile.png", import.meta.url));
const tulsiVivahBapsOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-tulsi-vivah-baps-mobile.png", import.meta.url));
const devDeepawaliVaranasiOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-dev-deepawali-varanasi-mobile.png", import.meta.url));
const gitaJayantiOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-gita-jayanti-mobile.png", import.meta.url));
const kalabhairavaOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-kalabhairava-mobile.png", import.meta.url));
const vivahaPanchamiOutputPath = fileURLToPath(new URL("../../tmp/runtime-today-vivaha-panchami-mobile.png", import.meta.url));
const existing = await fetch("http://localhost:3100/today").then(() => true).catch(() => false);
if (existing) throw new Error("Port 3100 already has a server; refusing to claim or terminate it.");
const server = spawn(process.env.ComSpec ?? "C:\\Windows\\System32\\cmd.exe", ["/d", "/s", "/c", "pnpm.cmd dev --port 3100"], {
  cwd: fileURLToPath(new URL("../", import.meta.url)),
  windowsHide: true,
  stdio: ["ignore", "pipe", "pipe"],
});
let serverStopped = false;
function stopServer() {
  if (serverStopped || server.pid === undefined) return;
  serverStopped = true;
  try { execFileSync("taskkill.exe", ["/PID", String(server.pid), "/T", "/F"], { stdio: "ignore", windowsHide: true }); } catch { /* The scoped process may already have exited. */ }
}
process.on("exit", stopServer);
let serverOutput = "";
server.stdout.on("data", (chunk) => { serverOutput += chunk.toString(); });
server.stderr.on("data", (chunk) => { serverOutput += chunk.toString(); });
for (let attempt = 0; attempt < 60; attempt += 1) {
  const ready = await fetch("http://localhost:3100/today").then((response) => response.status === 200).catch(() => false);
  if (ready) break;
  if (server.exitCode !== null) throw new Error(`Dev server exited before verification:\n${serverOutput}`);
  if (attempt === 59) throw new Error(`Dev server did not become ready:\n${serverOutput}`);
  await new Promise((resolve) => setTimeout(resolve, 500));
}
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const consoleErrors = [];
page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
page.on("pageerror", (error) => consoleErrors.push(error.message));

await page.goto("http://localhost:3100/today", { waitUntil: "networkidle" });
await page.getByLabel("Date").fill("2026-09-15");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByText("Optional weekly rhythm").waitFor();
await page.getByText("Tuesday / Mangalavara: an optional weekly practice").waitFor();
await page.getByText("Open 5-minute practice").click();
await page.getByText(/Ganapati or Gauri.*Hanuman/).waitFor();
const supportedOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const weekdayGuideCount = await page.getByText("Optional weekly rhythm").count();
await page.screenshot({ path: outputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-11-08");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByText("Diwali Lakshmi Puja at home").waitFor();
await page.getByText("Diwali Lakshmi Puja at home").click();
await page.getByText("Status-labelled festival path").waitFor();
await page.getByText("Status-labelled festival path").click();
await page.getByText("Dhantrayodashi / Yama Deepam").waitFor();
await page.getByText(/Dhantrayodashi and Yama Deepam are separate resolved date records/).waitFor();
const diwaliOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
await page.screenshot({ path: diwaliOutputPath, fullPage: true });

await page.getByLabel("Practice context").selectOption("smarta-north-india");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByText("Diwali Lakshmi Puja at home").waitFor({ state: "detached" });
const unsupportedWeekdayCount = await page.getByText("Optional weekly rhythm").count();
const unsupportedDiwaliGuideCount = await page.getByText("Diwali Lakshmi Puja at home").count();

await page.getByLabel("Date").fill("2026-11-06");
await page.getByLabel("Place").selectOption("delhi");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Dhantrayodashi / Dhanteras" }).waitFor();
await page.getByRole("heading", { name: "Yama Deepam / Yama Deepa Dana" }).waitFor();
await page.getByText(/not the provider's narrower puja muhurta/).waitFor();
await page.getByText("Dhantrayodashi at home").click();
await page.getByText("Gratitude for health and livelihood").waitFor();
await page.getByText(/not a devotional requirement or financial recommendation/).waitFor();
await page.getByText("Yama Deepam at home").click();
await page.getByText("One safe evening light").waitFor();
await page.getByText(/never leave it unattended or burning overnight/).waitFor();
const dhantrayodashiOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const dhantrayodashiCount = await page.getByRole("heading", { name: "Dhantrayodashi / Dhanteras" }).count();
const yamaDeepamCount = await page.getByRole("heading", { name: "Yama Deepam / Yama Deepa Dana" }).count();
const dhantrayodashiGuideCount = await page.getByText("Contextual home practice").count();
await page.screenshot({ path: dhantrayodashiOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-11-08");
await page.getByLabel("Place").selectOption("kolkata");
await page.getByLabel("Practice context").selectOption("shakta-bengal");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Kali Puja / Shyama Puja" }).waitFor();
await page.getByText(/Kolkata practitioner fixture and official West Bengal calendar/).waitFor();
await page.getByText("Kali Puja with home or community").click();
await page.getByText("Simple respectful participation").waitFor();
await page.getByText(/do not assume an all-night vigil is required/).waitFor();
const kaliPujaOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const kaliPujaCount = await page.getByRole("heading", { name: "Kali Puja / Shyama Puja" }).count();
const lakshmiPujaCountInShakta = await page.getByRole("heading", { name: "Diwali Lakshmi Puja" }).count();
const kaliPujaGuideCount = await page.getByText("Contextual home practice").count();
await page.screenshot({ path: kaliPujaOutputPath, fullPage: true });

await page.getByLabel("Place").selectOption("chennai");
await page.getByLabel("Practice context").selectOption("smarta-south-india");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Tamil Deepavali / Naraka Chaturdashi" }).waitFor();
await page.getByText(/Chennai practitioner fixture and Tamil Nadu HRCE temple calendar/).waitFor();
await page.getByText("Tamil Deepavali morning at home").click();
await page.getByText("Safe pre-sunrise family bath").waitFor();
await page.getByText(/Use a normal safe bath when oil or an early bath is unsuitable/).waitFor();
const tamilDeepavaliOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const tamilDeepavaliCount = await page.getByRole("heading", { name: "Tamil Deepavali / Naraka Chaturdashi" }).count();
const northWestNarakaCountInSouth = await page.getByRole("heading", { name: "Naraka Chaturdashi", exact: true }).count();
const lakshmiPujaCountInSouth = await page.getByRole("heading", { name: "Diwali Lakshmi Puja" }).count();
const tamilDeepavaliGuideCount = await page.getByText("Contextual home practice").count();
await page.screenshot({ path: tamilDeepavaliOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-11-10");
await page.getByLabel("Place").selectOption("delhi");
await page.getByLabel("Practice context").selectOption("vaishnava-iskcon");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Govardhan Puja / Annakut" }).waitFor();
await page.getByText("Govardhana Puja and Annakut participation").click();
await page.getByText("Simple gratitude and remembrance").waitFor();
await page.getByText(/otherwise keep the prayer-only form/).waitFor();
const govardhanaOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const govardhanaCount = await page.getByRole("heading", { name: "Govardhan Puja / Annakut" }).count();
const baliCountInIskcon = await page.getByRole("heading", { name: "Bali Pratipada" }).count();
const govardhanaGuideCount = await page.getByText("Contextual home practice").count();
await page.screenshot({ path: govardhanaOutputPath, fullPage: true });

await page.getByLabel("Place").selectOption("mumbai");
await page.getByLabel("Practice context").selectOption("smarta-west-india");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Bali Pratipada" }).waitFor();
await page.getByRole("heading", { name: "Govardhan Puja / Annakut" }).waitFor();
await page.getByText("Bali Pratipada / Padwa with family").click();
await page.getByText("King Bali remembrance and family gratitude").waitFor();
await page.getByText(/without claiming one theology is universal/).waitFor();
const baliPratipadaOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const baliPratipadaCount = await page.getByRole("heading", { name: "Bali Pratipada" }).count();
const govardhanaCountInSmartaWest = await page.getByRole("heading", { name: "Govardhan Puja / Annakut" }).count();
const baliPratipadaGuideCount = await page.getByText("Contextual home practice").count();
const govardhanaGuideCountInSmartaWest = await page.getByText("Govardhana Puja and Annakut participation").count();
await page.screenshot({ path: baliPratipadaOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-11-11");
await page.getByLabel("Practice context").selectOption("smarta-north-india");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Bhai Dooj / Yama Dvitiya" }).waitFor();
await page.getByText("Bhai Dooj with your sibling").click();
await page.getByText("A simple sibling blessing").waitFor();
await page.getByText(/spoken or gesture-only blessing/).waitFor();
const bhaiDoojOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const bhaiDoojCount = await page.getByRole("heading", { name: "Bhai Dooj / Yama Dvitiya" }).count();
const bhaiDoojGuideCount = await page.getByText("Contextual home practice").count();
await page.screenshot({ path: bhaiDoojOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-09-08");
await page.getByLabel("Place").selectOption("delhi");
await page.getByLabel("Practice context").selectOption("smarta-north-india");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Bhauma Pradosha Vrat" }).waitFor();
await page.getByText(/Trayodashi uniquely overlaps the local sunset-to-144-minute pradosha window/).waitFor();
const pradoshaOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const pradoshaGuideCount = await page.getByText(/Pradosha Puja at home/i).count();
const adjacentMasikaCount = await page.getByRole("heading", { name: "Masika Shivaratri" }).count();
await page.screenshot({ path: pradoshaOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-09-04");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Krishna Janmashtami · Smarta" }).waitFor();
await page.getByText(/For this bounded Smarta lane, select only the civil night/i).waitFor();
const janmashtamiSmartaOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const janmashtamiSmartaGuideCount = await page.getByText("Contextual home practice").count();
const janmashtamiIskconCountInSmarta = await page.getByRole("heading", { name: "Krishna Janmashtami · ISKCON" }).count();
await page.getByRole("heading", { name: "Agastya Arghya timing unresolved" }).waitFor();
const agastyaUnresolvedCountInSmarta = await page.getByRole("heading", { name: "Agastya Arghya timing unresolved" }).count();
await page.screenshot({ path: janmashtamiSmartaOutputPath, fullPage: true });

await page.getByLabel("Practice context").selectOption("vaishnava-iskcon");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Krishna Janmashtami · ISKCON" }).waitFor();
await page.getByText(/For this bounded ISKCON lane, select only the civil night/i).waitFor();
const janmashtamiIskconOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const janmashtamiIskconGuideCount = await page.getByText("Contextual home practice").count();
const janmashtamiSmartaCountInIskcon = await page.getByRole("heading", { name: "Krishna Janmashtami · Smarta" }).count();
const agastyaUnresolvedCountInIskcon = await page.getByRole("heading", { name: "Agastya Arghya timing unresolved" }).count();
await page.screenshot({ path: janmashtamiIskconOutputPath, fullPage: true });

await page.getByLabel("Practice context").selectOption("smarta-north-india");

await page.getByLabel("Date").fill("2026-09-14");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Hartalika Teej" }).waitFor();
await page.getByText(/select the later candidate sunrise bearing Bhadrapada Shukla Tritiya/i).waitFor();
const hartalikaOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const hartalikaPracticeGuideCount = await page.getByText("Contextual home practice").count();
await page.screenshot({ path: hartalikaOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-09-15");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Rishi Panchami" }).waitFor();
await page.getByText(/exactly one candidate madhyahna overlaps Bhadrapada Shukla Panchami/i).waitFor();
const rishiPanchamiOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const rishiPanchamiPracticeGuideCount = await page.getByText("Contextual home practice").count();
await page.screenshot({ path: rishiPanchamiOutputPath, fullPage: true });

await page.getByLabel("Practice context").selectOption("vaishnava-iskcon");
await page.getByLabel("Date").fill("2026-09-16");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Balarama observance identity unresolved" }).waitFor();
await page.getByText(/Three distinct Balarama-associated identities occur on different lunar days/i).waitFor();
await page.getByText(/0 evidence-bounded rules are resolved here; 1 candidate remains unassigned/i).waitFor();
const balaramaUnresolvedOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const balaramaUnresolvedGuideCount = await page.getByText("Contextual home practice").count();
await page.screenshot({ path: balaramaUnresolvedOutputPath, fullPage: true });

await page.getByLabel("Practice context").selectOption("regional-bengal");
await page.getByLabel("Place").selectOption("kolkata");
await page.getByLabel("Date").fill("2026-09-17");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Kanya Sankranti" }).waitFor();
await page.getByRole("heading", { name: "Vishwakarma Puja · Bengal" }).waitFor();
await page.getByText(/official West Bengal calendar place Vishwakarma Puja on the validated Kanya Sankranti date/i).waitFor();
const vishwakarmaBengalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const vishwakarmaBengalGuideCount = await page.getByText("Contextual home practice").count();
await page.screenshot({ path: vishwakarmaBengalOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-09-19");
await page.getByLabel("Place").selectOption("delhi");
await page.getByLabel("Practice context").selectOption("vaishnava-iskcon");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Radha Ashtami" }).waitFor();
await page.getByText(/bounded ISKCON Panchang lane/i).waitFor();
const radhaAshtamiOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const radhaAshtamiPracticeGuideCount = await page.getByText("Contextual home practice").count();
const smartaDurgashtamiCountInIskcon = await page.getByRole("heading", { name: "Masika Durgashtami" }).count();
await page.screenshot({ path: radhaAshtamiOutputPath, fullPage: true });

await page.getByLabel("Practice context").selectOption("smarta-west-india");
await page.getByLabel("Place").selectOption("mumbai");
await page.getByLabel("Date").fill("2026-09-20");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Family-chosen Ganeshotsav day" }).waitFor();
await page.getByText(/not a required 12-day murti stay/).waitFor();
await page.getByText("Ganesh Chaturthi at home").waitFor();
await page.getByRole("link", { name: "Explore Ganesha" }).waitFor();
const ganeshotsavOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const ganeshotsavGuideCount = await page.getByText("Ganesh Chaturthi at home").count();
await page.screenshot({ path: ganeshotsavOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-09-25");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Anant Chaturdashi Visarjan lane" }).waitFor();
await page.getByRole("heading", { name: "Ananta Chaturdashi" }).waitFor();
await page.getByText("Ananta Chaturdashi remembrance").waitFor();
await page.getByText("Ganesh Chaturthi at home").waitFor();
const anantaRuleCount = await page.getByRole("heading", { name: "Ananta Chaturdashi" }).count();
const anantaPracticeGuideCount = await page.getByText("Ananta Chaturdashi remembrance").count();
const ganeshVisarjanGuideCount = await page.getByText("Ganesh Chaturthi at home").count();

await page.getByLabel("Practice context").selectOption("smarta-north-india");
await page.getByLabel("Place").selectOption("delhi");
await page.getByLabel("Date").fill("2026-09-29");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Tritiya Shraddha · Maha Bharani" }).waitFor();
await page.getByText(/does not decide which ancestor, death tithi, performer, offering, timing, or family procedure applies/).waitFor();
const pitruPakshaOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const pitruPakshaPracticeGuideCount = await page.getByText("Contextual home practice").count();
await page.screenshot({ path: pitruPakshaOutputPath, fullPage: true });

await page.getByLabel("Practice context").selectOption("shakta-bengal");
await page.getByLabel("Place").selectOption("kolkata");
await page.getByLabel("Date").fill("2026-10-20");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Maha Navami" }).waitFor();
await page.getByText(/separate from the North\/West Navaratri sequence/).waitFor();
await page.getByRole("link", { name: "Explore Durga" }).waitFor();
await page.getByText("Bengal Durga Puja remembrance and participation").click();
await page.getByText("10-minute remembrance").waitFor();
await page.getByText(/Choose one act of courage, care, dignity, respect for women/).waitFor();
const durgaPujaOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const durgaPujaPracticeGuideCount = await page.getByText("Bengal Durga Puja remembrance and participation").count();
await page.screenshot({ path: durgaPujaOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-10-19");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Maha Ashtami" }).waitFor();
await page.getByRole("heading", { name: "Durga Ashtami / Masika Durgashtami" }).waitFor();
await page.getByText(/select the later candidate sunrise bearing Shukla Ashtami/i).waitFor();
const durgashtamiOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const durgaCampaignGuideCountOnMasikaDate = await page.getByText("Bengal Durga Puja remembrance and participation").count();
const durgashtamiPracticeGuideCountInBengal = await page.getByText("Masika Durgashtami remembrance").count();
await page.screenshot({ path: durgashtamiBengalOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-11-17");
await page.getByLabel("Place").selectOption("delhi");
await page.getByLabel("Practice context").selectOption("smarta-north-india");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Masika Durgashtami" }).waitFor();
await page.getByText("Masika Durgashtami remembrance").click();
await page.getByText("10-minute remembrance").waitFor();
await page.getByText(/does not make every regional Ashtami procedure identical/).waitFor();
const durgashtamiSmartaOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const durgashtamiPracticeGuideCount = await page.getByText("Masika Durgashtami remembrance").count();
const bengalCampaignGuideCountInSmarta = await page.getByText("Bengal Durga Puja remembrance and participation").count();
await page.screenshot({ path: durgashtamiOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-10-21");
await page.getByLabel("Place").selectOption("kolkata");
await page.getByLabel("Practice context").selectOption("shakta-bengal");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Vijayadashami and Bengal Durga Visarjan" }).waitFor();
const bengalClosingCount = await page.getByRole("heading", { name: "Vijayadashami and Bengal Durga Visarjan" }).count();

await page.getByLabel("Practice context").selectOption("smarta-north-india");
await page.getByLabel("Place").selectOption("delhi");
await page.getByLabel("Date").fill("2026-10-25");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Kojagara Puja / Sharad Purnima" }).waitFor();
await page.getByText(/Ashvina Purnima overlaps the local Nishita muhurta/).waitFor();
const kojagaraOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const kojagaraGuideCount = await page.getByText("Contextual home practice").count();
const nonApplyingAshwinaPurnimaCount = await page.getByRole("heading", { name: "Ashwina Purnima" }).count();
await page.screenshot({ path: kojagaraOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-11-20");
await page.getByLabel("Place").selectOption("delhi");
await page.getByLabel("Practice context").selectOption("smarta-north-india");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Devutthana Ekadashi" }).waitFor();
await page.getByText(/Pāraṇa:.*not assigned yet for this Smarta context/).waitFor();
const ekadashiSmartaOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const ekadashiSmartaPendingCount = await page.getByText("Date not assigned yet").count();
await page.screenshot({ path: ekadashiSmartaOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-12-05");
await page.getByLabel("Place").selectOption("chennai");
await page.getByLabel("Practice context").selectOption("vaishnava-iskcon");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Utpanna Ekadashi" }).waitFor();
await page.getByText(/provider classification paksha vardhini mahadwadashi/).waitFor();
await page.getByText(/Next-morning pāraṇa:/).waitFor();
const ekadashiIskconOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const ekadashiIskconPendingCount = await page.getByText("Date not assigned yet").count();
await page.screenshot({ path: ekadashiIskconOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-11-15");
await page.getByLabel("Place").selectOption("patna");
await page.getByLabel("Practice context").selectOption("surya-chhath-bihar-purvanchal");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Chhath Puja / Surya Shashthi — Sandhya Arghya" }).waitFor();
await page.getByText(/Day 3: Chhath Puja and Sandhya Arghya/).waitFor();
await page.getByText("Chhath with your family").click();
await page.getByText("First-time or supporting participation").waitFor();
await page.getByText(/Do not independently begin a fast, nirjala regimen/).waitFor();
const chhathOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const chhathGuideCount = await page.getByText("Contextual home practice").count();
await page.screenshot({ path: chhathOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-11-05");
await page.getByLabel("Place").selectOption("mumbai");
await page.getByLabel("Practice context").selectOption("smarta-west-india");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Govatsa Dwadashi / Vasu Baras" }).waitFor();
await page.getByText("Ekadashi devotional companion").waitFor();
await page.getByText("Vasu Baras: gratitude without unsafe animal contact").click();
await page.getByText("No-contact gratitude for care and nourishment").waitFor();
await page.getByText(/without buying, feeding, touching, or approaching an animal/).waitFor();
const vasuBarasOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const vasuBarasCount = await page.getByRole("heading", { name: "Govatsa Dwadashi / Vasu Baras" }).count();
const vasuBarasGuideCount = await page.getByText("Contextual home practice").count();
await page.screenshot({ path: vasuBarasOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-11-08");
await page.getByLabel("Place").selectOption("mumbai");
await page.getByLabel("Practice context").selectOption("smarta-west-india");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Naraka Chaturdashi / Abhyanga Snan" }).waitFor();
await page.getByText("Maharashtra Naraka Chaturdashi morning").click();
await page.getByText("Safe bath and short remembrance").waitFor();
await page.getByText(/use a small amount of familiar oil or ubtan only when customary/).waitFor();
const narakaChaturdashiOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const narakaChaturdashiCount = await page.getByRole("heading", { name: "Naraka Chaturdashi / Abhyanga Snan" }).count();
const narakaChaturdashiGuideCount = await page.getByText("Maharashtra Naraka Chaturdashi morning").count();
await page.screenshot({ path: narakaChaturdashiOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-11-07");
await page.getByLabel("Place").selectOption("ahmedabad");
await page.getByLabel("Practice context").selectOption("swaminarayan-baps");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Kali Chaudash / Hanuman Puja" }).waitFor();
await page.getByText("BAPS Kali Chaudash family participation").click();
await page.getByText("Short prayer and reflection").waitFor();
await page.getByText(/use a short family- or mandir-known prayer/).waitFor();
const kaliChaudasOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const kaliChaudasCount = await page.getByRole("heading", { name: "Kali Chaudash / Hanuman Puja" }).count();
const kaliChaudasGuideCount = await page.getByText("BAPS Kali Chaudash family participation").count();
await page.screenshot({ path: kaliChaudasOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-11-10");
await page.getByLabel("Place").selectOption("ahmedabad");
await page.getByLabel("Practice context").selectOption("swaminarayan-baps");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Gujarati New Year / Bestu Varash / Annakut" }).waitFor();
await page.getByText("BAPS Gujarati New Year family participation").click();
await page.getByText("Prayer, gratitude, and New Year greeting").waitFor();
await page.getByText(/family- or mandir-known prayer and name what you are grateful for/).waitFor();
const gujaratiNewYearOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const gujaratiNewYearCount = await page.getByRole("heading", { name: "Gujarati New Year / Bestu Varash / Annakut" }).count();
const gujaratiNewYearGuideCount = await page.getByText("BAPS Gujarati New Year family participation").count();
await page.screenshot({ path: gujaratiNewYearOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-11-10");
await page.getByLabel("Place").selectOption("bengaluru");
await page.getByLabel("Practice context").selectOption("smarta-south-india");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Bali Padyami / Balipadyami" }).waitFor();
await page.getByText("Karnataka Bali Padyami family participation").click();
await page.getByText("Bali remembrance and one generous act").waitFor();
await page.getByText(/Use the family's known Bali-Vamana story or prayer/).waitFor();
const balipadyamiOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const balipadyamiCount = await page.getByRole("heading", { name: "Bali Padyami / Balipadyami" }).count();
const balipadyamiGuideCount = await page.getByText("Karnataka Bali Padyami family participation").count();
const conflictingGovardhanaCount = await page.getByRole("heading", { name: "Govardhan Puja / Annakut" }).count();
await page.screenshot({ path: balipadyamiOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-11-08");
await page.getByLabel("Place").selectOption("delhi");
await page.getByLabel("Practice context").selectOption("jain-umbrella");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Jain Diwali / Mahavira's Liberation" }).waitFor();
await page.getByText("Jain Diwali reflection").click();
await page.getByText("Inner light and one act of non-harm").waitFor();
await page.getByText(/Remember Mahavira's liberation at Pavapuri/).waitFor();
const jainDiwaliOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const jainDiwaliCount = await page.getByRole("heading", { name: "Jain Diwali / Mahavira's Liberation" }).count();
const jainDiwaliGuideCount = await page.getByText("Jain Diwali reflection").count();
const jainLakshmiCount = await page.getByRole("heading", { name: "Diwali Lakshmi Puja" }).count();
const jainKaliCount = await page.getByRole("heading", { name: "Kali Puja / Shyama Puja" }).count();
await page.screenshot({ path: jainDiwaliOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-11-08");
await page.getByLabel("Place").selectOption("amritsar");
await page.getByLabel("Practice context").selectOption("sikh-sgpc");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Bandi Chhor Divas" }).waitFor();
await page.getByText("Bandi Chhor Divas remembrance and participation").click();
await page.getByText("Freedom with others").waitFor();
await page.getByText(/52 detained rulers rather than accepting freedom only for himself/).waitFor();
const bandiChhorOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const bandiChhorCount = await page.getByRole("heading", { name: "Bandi Chhor Divas" }).count();
const bandiChhorGuideCount = await page.getByText("Bandi Chhor Divas remembrance and participation").count();
const bandiChhorLakshmiCount = await page.getByRole("heading", { name: "Diwali Lakshmi Puja" }).count();
const bandiChhorJainCount = await page.getByRole("heading", { name: "Jain Diwali / Mahavira's Liberation" }).count();
const bandiChhorKaliCount = await page.getByRole("heading", { name: "Kali Puja / Shyama Puja" }).count();
await page.screenshot({ path: bandiChhorOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-11-01");
await page.getByLabel("Place").selectOption("delhi");
await page.getByLabel("Practice context").selectOption("smarta-north-india");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Ahoi Ashtami / Ahoi Aathe" }).waitFor();
await page.getByText("Ahoi Ashtami family reflection").click();
await page.getByText("Wellbeing and one act of care").waitFor();
await page.getByText(/hold the wellbeing of all children in mind/).waitFor();
const ahoiAshtamiOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const ahoiAshtamiCount = await page.getByRole("heading", { name: "Ahoi Ashtami / Ahoi Aathe" }).count();
const ahoiAshtamiGuideCount = await page.getByText("Ahoi Ashtami family reflection").count();
await page.screenshot({ path: ahoiAshtamiOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-11-21");
await page.getByLabel("Place").selectOption("delhi");
await page.getByLabel("Practice context").selectOption("smarta-north-india");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Tulasi Vivah" }).waitFor();
await page.getByText("Tulasi Vivah at home").click();
await page.getByText("Ten-minute remembrance").waitFor();
await page.getByText(/do not pluck or ingest leaves/).waitFor();
const tulasiVivahGeneralOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const tulasiVivahGeneralCount = await page.getByRole("heading", { name: "Tulasi Vivah" }).count();
const tulasiVivahGeneralGuideCount = await page.getByText("Tulasi Vivah at home").count();
const bapsBeginningInGeneralCount = await page.getByRole("heading", { name: "Tulsi Vivah Prarambh" }).count();
await page.screenshot({ path: tulasiVivahGeneralOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-11-21");
await page.getByLabel("Place").selectOption("ahmedabad");
await page.getByLabel("Practice context").selectOption("swaminarayan-baps");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Tulsi Vivah Prarambh" }).waitFor();
await page.getByText("BAPS Tulsi Vivah participation").click();
await page.getByText("Ten-minute BAPS-context reflection").waitFor();
await page.getByText(/official BAPS 2026 sequence begins on November 21 and closes on November 24/).waitFor();
const tulsiVivahBapsOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const tulsiVivahBapsCount = await page.getByRole("heading", { name: "Tulsi Vivah Prarambh" }).count();
const tulsiVivahBapsGuideCount = await page.getByText("BAPS Tulsi Vivah participation").count();
const generalTulasiInBapsCount = await page.getByRole("heading", { name: "Tulasi Vivah" }).count();
await page.screenshot({ path: tulsiVivahBapsOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-11-24");
await page.getByLabel("Place").selectOption("varanasi");
await page.getByLabel("Practice context").selectOption("regional-kashi-varanasi");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Kartika Purnima" }).waitFor();
await page.getByRole("heading", { name: "Dev Deepawali, Varanasi" }).waitFor();
await page.getByText("Varanasi Dev Deepawali reflection and participation").click();
await page.getByText("Ten-minute light and reflection").waitFor();
await page.getByText(/A flame-free form is complete in this scope/).waitFor();
const devDeepawaliVaranasiOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const devDeepawaliVaranasiCount = await page.getByRole("heading", { name: "Dev Deepawali, Varanasi" }).count();
const kartikaPurnimaInVaranasiCount = await page.getByRole("heading", { name: "Kartika Purnima" }).count();
const devDeepawaliVaranasiGuideCount = await page.getByText("Varanasi Dev Deepawali reflection and participation").count();
const bapsTulsiCloseInVaranasiCount = await page.getByRole("heading", { name: "Tulsi Vivah Samapt" }).count();
await page.screenshot({ path: devDeepawaliVaranasiOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-12-20");
await page.getByLabel("Place").selectOption("delhi");
await page.getByLabel("Practice context").selectOption("smarta-north-india");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Mokshada Ekadashi / Vaikuntha Ekadashi" }).waitFor();
await page.getByText("Gita Jayanti reading and reflection").click();
await page.getByText("Ten-minute dialogue and action").waitFor();
await page.getByText(/does not prescribe the Mokshada Ekadashi fast/).waitFor();
const gitaJayantiOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const gitaJayantiCount = await page.getByRole("heading", { name: "Mokshada Ekadashi / Vaikuntha Ekadashi" }).count();
const gitaJayantiGuideCount = await page.getByText("Gita Jayanti reading and reflection").count();
await page.screenshot({ path: gitaJayantiOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-12-01");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Kalabhairava Jayanti / Bhairava Ashtami" }).waitFor();
await page.getByText("Kalabhairava Jayanti remembrance").click();
await page.getByText("10-minute remembrance").waitFor();
await page.getByText(/Name one fear you can face responsibly/).waitFor();
const kalabhairavaOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const kalabhairavaCount = await page.getByRole("heading", { name: "Kalabhairava Jayanti / Bhairava Ashtami" }).count();
const kalabhairavaGuideCount = await page.getByText("Kalabhairava Jayanti remembrance").count();
await page.screenshot({ path: kalabhairavaOutputPath, fullPage: true });

await page.getByLabel("Date").fill("2026-12-14");
await page.getByRole("button", { name: "Show my day" }).click();
await page.getByRole("heading", { name: "Vivaha Panchami" }).waitFor();
await page.getByText("Vivaha Panchami remembrance").click();
await page.getByText("10-minute remembrance").waitFor();
await page.getByText(/Choose one act of listening, honesty, mutual respect/).waitFor();
const vivahaPanchamiOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const vivahaPanchamiCount = await page.getByRole("heading", { name: "Vivaha Panchami" }).count();
const vivahaPanchamiGuideCount = await page.getByText("Vivaha Panchami remembrance").count();
await page.screenshot({ path: vivahaPanchamiOutputPath, fullPage: true });
const overlays = await page.locator("[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay").count();

const result = {
  supportedWestLane: { vara: "Mangalavara", weekdayGuides: weekdayGuideCount, overflowPx: supportedOverflow },
  supportedDiwaliLane: { sequenceEntries: 6, overflowPx: diwaliOverflow },
  boundedDhantrayodashiDateLane: { dhantrayodashiCards: dhantrayodashiCount, yamaDeepamCards: yamaDeepamCount, ritualGuides: dhantrayodashiGuideCount, overflowPx: dhantrayodashiOverflow },
  boundedBengalKaliPujaDateLane: { kaliPujaCards: kaliPujaCount, lakshmiPujaCards: lakshmiPujaCountInShakta, ritualGuides: kaliPujaGuideCount, overflowPx: kaliPujaOverflow },
  boundedTamilDeepavaliDateLane: { tamilDeepavaliCards: tamilDeepavaliCount, northWestNarakaCards: northWestNarakaCountInSouth, lakshmiPujaCards: lakshmiPujaCountInSouth, ritualGuides: tamilDeepavaliGuideCount, overflowPx: tamilDeepavaliOverflow },
  boundedGovardhanaIskconLane: { govardhanaCards: govardhanaCount, baliPratipadaCards: baliCountInIskcon, ritualGuides: govardhanaGuideCount, overflowPx: govardhanaOverflow },
  boundedBaliPratipadaMaharashtraLane: { baliPratipadaCards: baliPratipadaCount, govardhanaCards: govardhanaCountInSmartaWest, ritualGuides: baliPratipadaGuideCount, govardhanaGuides: govardhanaGuideCountInSmartaWest, overflowPx: baliPratipadaOverflow },
  boundedBhaiDoojNorthIndiaLane: { bhaiDoojCards: bhaiDoojCount, ritualGuides: bhaiDoojGuideCount, overflowPx: bhaiDoojOverflow },
  supportedPradoshaCalendarLane: { visibleApplicableRules: 1, adjacentNonApplyingRules: adjacentMasikaCount, ritualGuides: pradoshaGuideCount, overflowPx: pradoshaOverflow },
  boundedHartalikaCalendarLane: { ritualGuides: hartalikaPracticeGuideCount, overflowPx: hartalikaOverflow },
  boundedRishiPanchamiCalendarLane: { ritualGuides: rishiPanchamiPracticeGuideCount, overflowPx: rishiPanchamiOverflow },
  boundedRadhaAshtamiIskconLane: { ritualGuides: radhaAshtamiPracticeGuideCount, smartaDurgashtamiCards: smartaDurgashtamiCountInIskcon, overflowPx: radhaAshtamiOverflow },
  boundedJanmashtamiSmartaLane: { ritualGuides: janmashtamiSmartaGuideCount, iskconCards: janmashtamiIskconCountInSmarta, unresolvedAgastyaCards: agastyaUnresolvedCountInSmarta, overflowPx: janmashtamiSmartaOverflow },
  boundedJanmashtamiIskconLane: { ritualGuides: janmashtamiIskconGuideCount, smartaCards: janmashtamiSmartaCountInIskcon, unresolvedAgastyaCards: agastyaUnresolvedCountInIskcon, overflowPx: janmashtamiIskconOverflow },
  unresolvedBalaramaIdentity: { ritualGuides: balaramaUnresolvedGuideCount, overflowPx: balaramaUnresolvedOverflow },
  boundedKanyaSankrantiVishwakarmaBengalLane: { resolvedCards: 2, ritualGuides: vishwakarmaBengalGuideCount, overflowPx: vishwakarmaBengalOverflow },
  supportedGaneshotsavLane: { interiorPracticeGuides: ganeshotsavGuideCount, closingAnantaRules: anantaRuleCount, closingAnantaGuides: anantaPracticeGuideCount, closingGaneshGuides: ganeshVisarjanGuideCount, overflowPx: ganeshotsavOverflow },
  boundedPitruPakshaContext: { calendarLabels: 2, ritualGuides: pitruPakshaPracticeGuideCount, overflowPx: pitruPakshaOverflow },
  boundedBengalDurgaPujaLane: { participationGuides: durgaPujaPracticeGuideCount, closingCards: bengalClosingCount, overflowPx: durgaPujaOverflow },
  boundedMasikaDurgashtamiLane: { bengalCoincidentCampaignGuides: durgaCampaignGuideCountOnMasikaDate, masikaSpecificGuidesInBengal: durgashtamiPracticeGuideCountInBengal, masikaSpecificGuidesInNorthSmarta: durgashtamiPracticeGuideCount, bengalCampaignGuidesInNorthSmarta: bengalCampaignGuideCountInSmarta, bengalOverflowPx: durgashtamiOverflow, smartaOverflowPx: durgashtamiSmartaOverflow },
  boundedKojagaraNightLane: { ritualGuides: kojagaraGuideCount, nonApplyingAshwinaPurnimaCards: nonApplyingAshwinaPurnimaCount, overflowPx: kojagaraOverflow },
  boundedEkadashiSmartaLane: { unresolvedDateCards: ekadashiSmartaPendingCount, paranaResolved: false, overflowPx: ekadashiSmartaOverflow },
  boundedEkadashiIskconLane: { unresolvedDateCards: ekadashiIskconPendingCount, paranaResolved: true, overflowPx: ekadashiIskconOverflow },
  boundedChhathFamilyLane: { practiceGuides: chhathGuideCount, overflowPx: chhathOverflow },
  boundedVasuBarasMaharashtraLane: { govatsaCards: vasuBarasCount, ritualGuides: vasuBarasGuideCount, overflowPx: vasuBarasOverflow },
  boundedNarakaChaturdashiMaharashtraLane: { narakaCards: narakaChaturdashiCount, ritualGuides: narakaChaturdashiGuideCount, overflowPx: narakaChaturdashiOverflow },
  boundedKaliChaudasBapsLane: { kaliChaudasCards: kaliChaudasCount, ritualGuides: kaliChaudasGuideCount, overflowPx: kaliChaudasOverflow },
  boundedGujaratiNewYearBapsLane: { newYearCards: gujaratiNewYearCount, ritualGuides: gujaratiNewYearGuideCount, overflowPx: gujaratiNewYearOverflow },
  boundedKarnatakaBalipadyamiLane: { balipadyamiCards: balipadyamiCount, govardhanaCards: conflictingGovardhanaCount, ritualGuides: balipadyamiGuideCount, overflowPx: balipadyamiOverflow },
  boundedJainDiwaliUmbrellaLane: { jainDiwaliCards: jainDiwaliCount, lakshmiPujaCards: jainLakshmiCount, kaliPujaCards: jainKaliCount, ritualGuides: jainDiwaliGuideCount, overflowPx: jainDiwaliOverflow },
  boundedBandiChhorSgpcLane: { bandiChhorCards: bandiChhorCount, lakshmiPujaCards: bandiChhorLakshmiCount, jainDiwaliCards: bandiChhorJainCount, kaliPujaCards: bandiChhorKaliCount, ritualGuides: bandiChhorGuideCount, overflowPx: bandiChhorOverflow },
  boundedAhoiAshtamiNorthIndiaLane: { ahoiAshtamiCards: ahoiAshtamiCount, ritualGuides: ahoiAshtamiGuideCount, overflowPx: ahoiAshtamiOverflow },
  boundedTulasiVivahGeneralLane: { tulasiVivahCards: tulasiVivahGeneralCount, bapsBeginningCards: bapsBeginningInGeneralCount, ritualGuides: tulasiVivahGeneralGuideCount, overflowPx: tulasiVivahGeneralOverflow },
  boundedTulsiVivahBapsLane: { bapsBeginningCards: tulsiVivahBapsCount, generalTulasiVivahCards: generalTulasiInBapsCount, ritualGuides: tulsiVivahBapsGuideCount, overflowPx: tulsiVivahBapsOverflow },
  boundedVaranasiDevDeepawaliLane: { devDeepawaliCards: devDeepawaliVaranasiCount, genericKartikaPurnimaCards: kartikaPurnimaInVaranasiCount, bapsTulsiCloseCards: bapsTulsiCloseInVaranasiCount, ritualGuides: devDeepawaliVaranasiGuideCount, overflowPx: devDeepawaliVaranasiOverflow },
  boundedGitaJayantiReadingLane: { mokshadaGitaJayantiCards: gitaJayantiCount, readingGuides: gitaJayantiGuideCount, overflowPx: gitaJayantiOverflow },
  boundedKalabhairavaNorthLane: { kalabhairavaCards: kalabhairavaCount, ritualGuides: kalabhairavaGuideCount, overflowPx: kalabhairavaOverflow },
  boundedVivahaPanchamiNorthLane: { vivahaPanchamiCards: vivahaPanchamiCount, ritualGuides: vivahaPanchamiGuideCount, overflowPx: vivahaPanchamiOverflow },
  unsupportedNorthLane: { weekdayGuides: unsupportedWeekdayCount, diwaliGuides: unsupportedDiwaliGuideCount },
  frameworkErrorOverlays: overlays,
  consoleErrors,
};
console.log(JSON.stringify(result, null, 2));
await browser.close();
stopServer();
if (ahoiAshtamiOverflow > 0 || ahoiAshtamiCount !== 1 || ahoiAshtamiGuideCount !== 1) process.exit(1);
if (tulasiVivahGeneralOverflow > 0 || tulasiVivahGeneralCount !== 1 || tulasiVivahGeneralGuideCount !== 1 || bapsBeginningInGeneralCount !== 0) process.exit(1);
if (tulsiVivahBapsOverflow > 0 || tulsiVivahBapsCount !== 1 || tulsiVivahBapsGuideCount !== 1 || generalTulasiInBapsCount !== 0) process.exit(1);
if (devDeepawaliVaranasiOverflow > 0 || devDeepawaliVaranasiCount !== 1 || kartikaPurnimaInVaranasiCount !== 1 || devDeepawaliVaranasiGuideCount !== 1 || bapsTulsiCloseInVaranasiCount !== 0) process.exit(1);
if (gitaJayantiOverflow > 0 || gitaJayantiCount !== 1 || gitaJayantiGuideCount !== 1) process.exit(1);
if (kalabhairavaOverflow > 0 || kalabhairavaCount !== 1 || kalabhairavaGuideCount !== 1) process.exit(1);
if (vivahaPanchamiOverflow > 0 || vivahaPanchamiCount !== 1 || vivahaPanchamiGuideCount !== 1) process.exit(1);
if (anantaPracticeGuideCount !== 1 || ganeshVisarjanGuideCount !== 1) process.exit(1);
if (weekdayGuideCount !== 1 || supportedOverflow > 0 || diwaliOverflow > 0 || dhantrayodashiOverflow > 0 || kaliPujaOverflow > 0 || tamilDeepavaliOverflow > 0 || govardhanaOverflow > 0 || baliPratipadaOverflow > 0 || bhaiDoojOverflow > 0 || pradoshaOverflow > 0 || janmashtamiSmartaOverflow > 0 || janmashtamiIskconOverflow > 0 || balaramaUnresolvedOverflow > 0 || vishwakarmaBengalOverflow > 0 || hartalikaOverflow > 0 || rishiPanchamiOverflow > 0 || radhaAshtamiOverflow > 0 || ganeshotsavOverflow > 0 || pitruPakshaOverflow > 0 || durgaPujaOverflow > 0 || durgashtamiOverflow > 0 || durgashtamiSmartaOverflow > 0 || kojagaraOverflow > 0 || ekadashiSmartaOverflow > 0 || ekadashiIskconOverflow > 0 || chhathOverflow > 0 || vasuBarasOverflow > 0 || narakaChaturdashiOverflow > 0 || kaliChaudasOverflow > 0 || gujaratiNewYearOverflow > 0 || balipadyamiOverflow > 0 || jainDiwaliOverflow > 0 || bandiChhorOverflow > 0 || dhantrayodashiCount !== 1 || yamaDeepamCount !== 1 || dhantrayodashiGuideCount !== 2 || kaliPujaCount !== 1 || lakshmiPujaCountInShakta || kaliPujaGuideCount !== 1 || tamilDeepavaliCount !== 1 || northWestNarakaCountInSouth || lakshmiPujaCountInSouth || tamilDeepavaliGuideCount !== 1 || govardhanaCount !== 1 || baliCountInIskcon || govardhanaGuideCount !== 1 || baliPratipadaCount !== 1 || govardhanaCountInSmartaWest !== 1 || baliPratipadaGuideCount !== 1 || govardhanaGuideCountInSmartaWest || bhaiDoojCount !== 1 || bhaiDoojGuideCount !== 1 || pradoshaGuideCount || adjacentMasikaCount || janmashtamiSmartaGuideCount !== 1 || janmashtamiIskconGuideCount !== 1 || janmashtamiIskconCountInSmarta || agastyaUnresolvedCountInSmarta !== 1 || agastyaUnresolvedCountInIskcon !== 0 || balaramaUnresolvedGuideCount || vishwakarmaBengalGuideCount || hartalikaPracticeGuideCount !== 1 || rishiPanchamiPracticeGuideCount !== 1 || radhaAshtamiPracticeGuideCount !== 1 || smartaDurgashtamiCountInIskcon || ganeshotsavGuideCount !== 1 || anantaRuleCount !== 1 || pitruPakshaPracticeGuideCount || durgaPujaPracticeGuideCount !== 1 || durgashtamiPracticeGuideCountInBengal !== 0 || durgashtamiPracticeGuideCount !== 1 || durgaCampaignGuideCountOnMasikaDate !== 1 || bengalCampaignGuideCountInSmarta !== 0 || bengalClosingCount !== 1 || kojagaraGuideCount !== 1 || nonApplyingAshwinaPurnimaCount || ekadashiSmartaPendingCount || ekadashiIskconPendingCount || chhathGuideCount !== 1 || vasuBarasCount !== 1 || vasuBarasGuideCount !== 2 || narakaChaturdashiCount !== 1 || narakaChaturdashiGuideCount !== 1 || kaliChaudasCount !== 1 || kaliChaudasGuideCount !== 1 || gujaratiNewYearCount !== 1 || gujaratiNewYearGuideCount !== 1 || balipadyamiCount !== 1 || balipadyamiGuideCount !== 1 || conflictingGovardhanaCount || jainDiwaliCount !== 1 || jainDiwaliGuideCount !== 1 || jainLakshmiCount || jainKaliCount || bandiChhorCount !== 1 || bandiChhorGuideCount !== 1 || bandiChhorLakshmiCount || bandiChhorJainCount || bandiChhorKaliCount || unsupportedWeekdayCount || unsupportedDiwaliGuideCount || overlays || consoleErrors.length) process.exit(1);
