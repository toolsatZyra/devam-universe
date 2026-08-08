import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = join(ROOT, "tmp", "ramayana-dutt-visual-review");
const USER_AGENT = "DevamSourceLibrary/0.1 (visual-review; repository-local)";
const pages = [
  { volume: 1, title: 7, terminal: 192 },
  { volume: 2, title: 7, terminal: 335 },
  { volume: 3, title: 9, terminal: 194 },
  { volume: 4, title: 6, terminal: 189 },
  { volume: 5, title: 6, terminal: 232 },
  { volume: 6, title: 7, terminal: 453 },
  { volume: 7, title: 7, terminal: 310 },
];

async function thumbnailUrl(volume, page) {
  const title = `File:The Ramayana (Manmatha Nath Dutt) Canto ${volume}.djvu`;
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.search = new URLSearchParams({
    action: "query",
    format: "json",
    formatversion: "2",
    prop: "imageinfo",
    titles: title,
    iiprop: "url",
    iiurlwidth: "1200",
    iiurlparam: `page${page}-1200px`,
  });
  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (response.status !== 200) throw new Error(`Thumbnail metadata HTTP ${response.status}`);
  const data = await response.json();
  const thumb = data?.query?.pages?.[0]?.imageinfo?.[0]?.thumburl;
  if (!thumb) throw new Error(`No thumbnail for volume ${volume}, page ${page}`);
  return thumb;
}

await mkdir(OUTPUT, { recursive: true });
const manifest = [];
for (const entry of pages) {
  for (const role of ["title", "terminal"]) {
    const page = entry[role];
    const path = join(OUTPUT, `volume-${entry.volume}-${role}-page-${page}.jpg`);
    let bytes = await readFile(path).catch(() => null);
    let url = null;
    if (!bytes) {
      url = await thumbnailUrl(entry.volume, page);
      const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
      if (response.status !== 200) throw new Error(`Thumbnail HTTP ${response.status}`);
      bytes = Buffer.from(await response.arrayBuffer());
      await writeFile(path, bytes, { flag: "wx" });
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 750));
    }
    manifest.push({
      volume: entry.volume,
      role,
      carrier_page_1_based: page,
      path: path.slice(ROOT.length + 1).replaceAll("\\", "/"),
      bytes: bytes.length,
      sha256: createHash("sha256").update(bytes).digest("hex"),
      source_url: url,
      reused_current_run_partial: url === null,
    });
  }
}
await writeFile(join(OUTPUT, "manifest.json"), `${JSON.stringify({ records: manifest }, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ result: "PASS", records: manifest.length, output: "tmp/ramayana-dutt-visual-review/manifest.json" }, null, 2));
