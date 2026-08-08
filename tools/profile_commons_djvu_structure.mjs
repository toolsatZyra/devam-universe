import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PLAN_PATH = join(ROOT, "ingestion", "plans", "ramayana-manmatha-nath-dutt-commons-source-acquisition-v1.json");
const PROVENANCE_PATH = join(ROOT, "source_vault", "provenance-map.jsonl");
const OUTPUT_PATH = join(ROOT, "ingestion", "reports", "ramayana-manmatha-nath-dutt-commons-structure-v1.json");
const USER_AGENT = "DevamSourceLibrary/0.1 (structural-validation; repository-local)";

function sha256Text(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

async function sha256File(path) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  return hash.digest("hex");
}

function normalizedExcerpt(value, limit = 320) {
  return value.replace(/\s+/g, " ").trim().slice(0, limit);
}

function commonsTitle(sourceUrl) {
  const leaf = decodeURIComponent(new URL(sourceUrl).pathname.split("/").at(-1));
  return `File:${leaf.replaceAll("_", " ")}`;
}

function metadataValue(metadata, name) {
  return metadata.find((record) => record.name === name)?.value;
}

async function fetchImageInfo(title) {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.search = new URLSearchParams({
    action: "query",
    format: "json",
    formatversion: "2",
    prop: "imageinfo",
    titles: title,
    iiprop: "size|sha1|mime|mediatype|metadata|extmetadata",
  });
  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (response.status !== 200) throw new Error(`Commons metadata HTTP ${response.status} for ${title}`);
  const data = await response.json();
  const page = data?.query?.pages?.[0];
  const imageInfo = page?.imageinfo?.[0];
  if (!imageInfo || page.missing) throw new Error(`Missing Commons imageinfo for ${title}`);
  return { apiUrl: url.toString(), finalUrl: response.url, imageInfo };
}

const plan = JSON.parse(await readFile(PLAN_PATH, "utf8"));
const provenanceRecords = (await readFile(PROVENANCE_PATH, "utf8"))
  .trim()
  .split(/\r?\n/)
  .map((line) => JSON.parse(line));

const volumes = [];
for (const [ordinal, file] of plan.files.entries()) {
  const provenance = provenanceRecords.find((record) => record.source_path === file.source_path);
  if (!provenance) throw new Error(`No source-vault provenance row for ${file.source_path}`);
  const objectPath = join(ROOT, "source_vault", provenance.object_path);
  const [localSha256, live] = await Promise.all([
    sha256File(objectPath),
    fetchImageInfo(commonsTitle(file.url)),
  ]);
  if (localSha256 !== provenance.sha256) throw new Error(`Local SHA-256 drift for ${file.name}`);
  const stats = await import("node:fs/promises").then(({ stat }) => stat(objectPath));
  if (stats.size !== file.bytes || live.imageInfo.size !== file.bytes) throw new Error(`Byte mismatch for ${file.name}`);
  if (live.imageInfo.sha1 !== file.provider_sha1) throw new Error(`Provider SHA-1 mismatch for ${file.name}`);
  if (live.imageInfo.mime !== "image/vnd.djvu") throw new Error(`Unexpected MIME for ${file.name}`);

  const textRecords = metadataValue(live.imageInfo.metadata, "text");
  const dimensionRoot = metadataValue(live.imageInfo.metadata, "data");
  const dimensionRecords = Array.isArray(dimensionRoot)
    ? dimensionRoot.find((record) => record.name === "pages")?.value
    : null;
  if (!Array.isArray(textRecords) || !Array.isArray(dimensionRecords)) throw new Error(`Incomplete page metadata for ${file.name}`);
  if (textRecords.length !== live.imageInfo.pagecount || dimensionRecords.length !== live.imageInfo.pagecount) {
    throw new Error(`Page-count mismatch for ${file.name}`);
  }

  const pageRecords = textRecords.map((record, pageIndex) => {
    if (Number(record.name) !== pageIndex || typeof record.value !== "string") throw new Error(`Non-contiguous OCR page map for ${file.name}`);
    const dimensions = Object.fromEntries((dimensionRecords[pageIndex]?.value ?? []).map((entry) => [entry.name, entry.value]));
    return {
      page_index: pageIndex,
      text_chars: record.value.length,
      text_sha256: sha256Text(record.value),
      width: dimensions.width ?? null,
      height: dimensions.height ?? null,
      dpi: dimensions.dpi ?? null,
    };
  });
  const nonEmpty = textRecords.filter((record) => record.value.trim());
  const titleCandidates = textRecords
    .filter((record) => /ramayana|translated into english prose|manmatha\s+nath\s+dutt/i.test(record.value))
    .slice(0, 8)
    .map((record) => ({ page_index: Number(record.name), excerpt: normalizedExcerpt(record.value) }));
  const terminalCandidates = nonEmpty.slice(-8).map((record) => ({
    page_index: Number(record.name),
    excerpt: normalizedExcerpt(record.value),
  }));
  const allText = textRecords.map((record) => record.value).join("\n");
  const license = live.imageInfo.extmetadata?.LicenseShortName?.value ?? null;
  const usageTerms = live.imageInfo.extmetadata?.UsageTerms?.value ?? null;
  const copyrighted = live.imageInfo.extmetadata?.Copyrighted?.value ?? null;
  if (license !== "Public domain" || usageTerms !== "Public domain" || copyrighted !== "False") {
    throw new Error(`Rights metadata changed for ${file.name}`);
  }

  volumes.push({
    volume_ordinal: ordinal + 1,
    name: file.name,
    source_path: file.source_path,
    object_path: provenance.object_path,
    bytes: file.bytes,
    sha256: localSha256,
    provider_sha1: file.provider_sha1,
    commons_file_title: commonsTitle(file.url),
    commons_api_url: live.apiUrl,
    commons_final_url: live.finalUrl,
    page_count: live.imageInfo.pagecount,
    page_map_count: pageRecords.length,
    ocr_nonempty_page_count: nonEmpty.length,
    ocr_empty_page_count: textRecords.length - nonEmpty.length,
    first_nonempty_page_index: nonEmpty.length ? Number(nonEmpty[0].name) : null,
    last_nonempty_page_index: nonEmpty.length ? Number(nonEmpty.at(-1).name) : null,
    literal_section_heading_mentions: (allText.match(/\bSECTION\s+[CLXVI]+\b/gi) ?? []).length,
    title_candidates: titleCandidates,
    terminal_candidates: terminalCandidates,
    page_records: pageRecords,
    rights: { license, usage_terms: usageTerms, copyrighted },
    ocr_lane: "provider_parsed_unverified_quarantined",
  });

  if (ordinal < plan.files.length - 1) await new Promise((resolveDelay) => setTimeout(resolveDelay, 1500));
}

const report = {
  contract: "DEVAM_COMMONS_DJVU_STRUCTURE_PROFILE_V1",
  acquisition_id: plan.acquisition_id,
  source_plan: "ingestion/plans/ramayana-manmatha-nath-dutt-commons-source-acquisition-v1.json",
  source_plan_sha256: sha256Text(await readFile(PLAN_PATH, "utf8")),
  observed_at: new Date().toISOString(),
  volume_count: volumes.length,
  total_bytes: volumes.reduce((total, volume) => total + volume.bytes, 0),
  total_pages: volumes.reduce((total, volume) => total + volume.page_count, 0),
  total_ocr_nonempty_pages: volumes.reduce((total, volume) => total + volume.ocr_nonempty_page_count, 0),
  volumes,
  claims: {
    exact_seven_carriers_acquired: true,
    local_bytes_match_provider_fixity: true,
    all_page_coordinates_profiled: true,
    public_domain_file_metadata_observed: true,
    ocr_verified_for_product_search: false,
    exact_text_product_ready: false,
    translation_structurally_complete: false,
    ramayana_tradition_complete: false,
    all_editions_or_languages_complete: false,
  },
  next_gate: "visual_title_terminal_and_divisional_review_then_ocr_quality_sampling",
};

await mkdir(dirname(OUTPUT_PATH), { recursive: true });
await writeFile(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
console.log(JSON.stringify({
  result: "PASS",
  output: OUTPUT_PATH.slice(ROOT.length + 1).replaceAll("\\", "/"),
  output_sha256: sha256Text(await readFile(OUTPUT_PATH, "utf8")),
  volume_count: report.volume_count,
  total_bytes: report.total_bytes,
  total_pages: report.total_pages,
  total_ocr_nonempty_pages: report.total_ocr_nonempty_pages,
}, null, 2));
