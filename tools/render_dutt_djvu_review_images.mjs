import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { createRequire } from "node:module";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PROFILE_PATH = join(ROOT, "ingestion", "reports", "ramayana-manmatha-nath-dutt-commons-structure-v1.json");
const RUNTIME_ROOT = join(ROOT, "tmp", "djvujs-runtime", "node_modules", "djvujs-dist", "library");
const BUNDLE_PATH = join(RUNTIME_ROOT, "dist", "djvu.js");
const OUTPUT = join(ROOT, "tmp", "ramayana-dutt-visual-review");
const require = createRequire(import.meta.url);
const { PNG } = require(join(RUNTIME_ROOT, "node_modules", "pngjs"));

const pages = [
  { volume: 1, title: 7, terminal: 192, trailing_library: 196 },
  { volume: 2, title: 7, terminal: 335 },
  { volume: 3, title: 9, terminal: 194 },
  { volume: 4, title: 6, terminal: 189 },
  { volume: 5, title: 6, terminal: 232 },
  { volume: 6, title: 7, terminal: 453 },
  { volume: 7, title: 7, terminal: 310 },
];

class ImageDataPolyfill {
  constructor(dataOrWidth, widthOrHeight, maybeHeight) {
    if (typeof dataOrWidth === "number") {
      this.width = dataOrWidth;
      this.height = widthOrHeight;
      this.data = new Uint8ClampedArray(this.width * this.height * 4);
    } else {
      this.data = dataOrWidth;
      this.width = widthOrHeight;
      this.height = maybeHeight;
      if (this.data.length !== this.width * this.height * 4) {
        throw new Error("Invalid ImageData buffer length");
      }
    }
  }
}

globalThis.ImageData = ImageDataPolyfill;
globalThis.self = globalThis;
globalThis.document = {};
const bundle = await readFile(BUNDLE_PATH, "utf8");
vm.runInThisContext(`${bundle}\n;globalThis.__DEVAM_DJVU = DjVu;`, { filename: BUNDLE_PATH });
const DjVu = globalThis.__DEVAM_DJVU;
if (!DjVu?.Document) throw new Error("DjVu.js runtime did not expose Document");

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const profile = JSON.parse(await readFile(PROFILE_PATH, "utf8"));
const records = [];

for (const request of pages) {
  const volume = profile.volumes.find((entry) => entry.volume_ordinal === request.volume);
  if (!volume) throw new Error(`Missing volume ${request.volume}`);
  const objectPath = join(ROOT, "source_vault", ...volume.object_path.split("/"));
  const carrier = await readFile(objectPath);
  if (carrier.length !== volume.bytes || sha256(carrier) !== volume.sha256) {
    throw new Error(`Carrier drift for volume ${request.volume}`);
  }
  const arrayBuffer = carrier.buffer.slice(carrier.byteOffset, carrier.byteOffset + carrier.byteLength);
  const document = new DjVu.Document(arrayBuffer);
  if (document.getPagesQuantity() !== volume.page_count) {
    throw new Error(`Page count drift for volume ${request.volume}`);
  }

  for (const role of Object.keys(request).filter((key) => key !== "volume")) {
    const pageNumber = request[role];
    const page = await document.getPage(pageNumber);
    const image = page.getImageData();
    const png = PNG.sync.write({
      width: image.width,
      height: image.height,
      data: Buffer.from(image.data.buffer, image.data.byteOffset, image.data.byteLength),
    });
    const outputPath = join(OUTPUT, `volume-${request.volume}-${role}-page-${pageNumber}-local.png`);
    const existing = await readFile(outputPath).catch(() => null);
    if (existing && !existing.equals(png)) throw new Error(`Existing render drift: ${outputPath}`);
    if (!existing) await writeFile(outputPath, png, { flag: "wx" });
    records.push({
      volume: request.volume,
      role,
      carrier_page_1_based: pageNumber,
      carrier_sha256: volume.sha256,
      output_path: outputPath.slice(ROOT.length + 1).replaceAll("\\", "/"),
      width: image.width,
      height: image.height,
      bytes: png.length,
      sha256: sha256(png),
      renderer: "djvujs-dist@0.5.4/pngjs@5.0.0",
    });
  }
}

const manifest = {
  contract: "DEVAM_DUTT_DJVU_LOCAL_VISUAL_RENDER_V1",
  source_profile: PROFILE_PATH.slice(ROOT.length + 1).replaceAll("\\", "/"),
  source_profile_sha256: sha256(await readFile(PROFILE_PATH)),
  renderer_bundle_sha256: sha256(await readFile(BUNDLE_PATH)),
  records,
};
const manifestBytes = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`);
const manifestPath = join(OUTPUT, "local-render-manifest-v3.json");
const existingManifest = await readFile(manifestPath).catch(() => null);
if (existingManifest && !existingManifest.equals(manifestBytes)) throw new Error("Existing render manifest drift");
if (!existingManifest) await writeFile(manifestPath, manifestBytes, { flag: "wx" });
console.log(JSON.stringify({ result: "PASS", records: records.length, manifest: manifestPath.slice(ROOT.length + 1).replaceAll("\\", "/"), manifest_sha256: sha256(manifestBytes) }));
