import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const STRUCTURE_PATH = join(ROOT, "ingestion", "reports", "ramayana-manmatha-nath-dutt-commons-structure-v1.json");
const OUTPUT_PATH = join(ROOT, "ingestion", "reports", "ramayana-manmatha-nath-dutt-wikisource-proofread-status-v1.json");
const USER_AGENT = "DevamSourceLibrary/0.1 (bounded Dutt transcription audit; repository-local)";
const EXPECTED_KANDAS = [
  "Bāla Kanda",
  "Ayodhya Kanda",
  "Āranya Kanda",
  "Kishkindhā Kanda",
  "Sundara Kanda",
  "Yuddha Kanda",
  "Uttara Kanda",
];
const EXPECTED_AUTHORS = [
  "[[Author:Valmiki|Valmiki]]",
  "[[Author:Valmiki|Valmiki]]",
  "[[Author:Valmiki|Valmiki]]",
  "[[Author:Valmiki|Valmiki]]",
  "",
  "[[Author:Valmiki|Valmiki]]",
  "[[Author:Valmiki|Valmiki]]",
];
const EXPECTED_TRANSLATORS = [
  "[[Author:Manmatha Nath Dutt|Manmatha Nath Dutt]]",
  "[[Author:Manmatha Nath Dutt|Manmatha Nath Dutt]]",
  "[[Author:Manmatha Nath Dutt|Manmatha Nath Dutt]]",
  "[[Author:Manmatha Nath Dutt|Manmatha Nath Dutt]]",
  "",
  "[[Author:Manmatha Nath Dutt|Manmatha Nath Dutt]]",
  "[[Author:Manmatha Nath Dutt|Manmatha Nath Dutt]]",
];

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function field(text, name) {
  return new RegExp(`^\\|${name}=([^\\r\\n]*)$`, "m").exec(text)?.[1]?.trim() ?? null;
}

function strictUtf8(buffer) {
  const decoded = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  return { decoded, roundtrip: Buffer.from(decoded, "utf8").equals(buffer) };
}

async function fetchIndex(volumeOrdinal) {
  const title = `Index:The Ramayana (Manmatha Nath Dutt) Canto ${volumeOrdinal}.djvu`;
  const url = new URL("https://en.wikisource.org/w/index.php");
  url.search = new URLSearchParams({ title, action: "raw" });
  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT }, redirect: "follow" });
  if (response.status !== 200) throw new Error(`Wikisource raw index HTTP ${response.status} for volume ${volumeOrdinal}`);
  const body = Buffer.from(await response.arrayBuffer());
  const { decoded, roundtrip } = strictUtf8(body);
  if (!roundtrip) throw new Error(`Wikisource raw index is not strict round-trip UTF-8 for volume ${volumeOrdinal}`);
  const record = {
    volume_ordinal: volumeOrdinal,
    index_title: title,
    request_url: url.href,
    final_url: response.url,
    http_status: response.status,
    observed_at: new Date().toISOString(),
    last_modified: response.headers.get("last-modified"),
    raw_bytes: body.length,
    raw_sha256: sha256(body),
    strict_utf8_roundtrip: true,
    title_literal: field(decoded, "Title"),
    volume_literal: field(decoded, "Volume"),
    author_literal: field(decoded, "Author"),
    translator_literal: field(decoded, "Translator"),
    publisher_literal: field(decoded, "Publisher"),
    location_literal: field(decoded, "Address"),
    year_literal: field(decoded, "Year"),
    source_literal: field(decoded, "Source"),
    progress_literal: field(decoded, "Progress"),
    transclusion_literal: field(decoded, "Transclusion"),
  };
  if (record.final_url !== url.href) throw new Error(`Unexpected Wikisource redirect for volume ${volumeOrdinal}: ${record.final_url}`);
  return record;
}

const structureRaw = await readFile(STRUCTURE_PATH);
const structure = JSON.parse(structureRaw.toString("utf8"));
if (structure.volume_count !== 7 || structure.total_pages !== 1942 || structure.volumes.length !== 7) {
  throw new Error("Frozen Dutt structure profile drifted");
}

const volumes = [];
for (const sourceVolume of structure.volumes) {
  const record = await fetchIndex(sourceVolume.volume_ordinal);
  const expectedVolume = EXPECTED_KANDAS[sourceVolume.volume_ordinal - 1];
  if (
    record.title_literal !== "The Ramayana"
    || record.volume_literal !== expectedVolume
    || record.author_literal !== EXPECTED_AUTHORS[sourceVolume.volume_ordinal - 1]
    || record.translator_literal !== EXPECTED_TRANSLATORS[sourceVolume.volume_ordinal - 1]
    || record.location_literal !== "Calcutta"
    || record.source_literal !== "djvu"
    || record.progress_literal !== "C"
    || record.transclusion_literal !== "no"
  ) {
    throw new Error(`Unexpected Wikisource index semantics for volume ${sourceVolume.volume_ordinal}`);
  }
  volumes.push({
    ...record,
    carrier_page_count: sourceVolume.page_count,
    carrier_sha256: sourceVolume.sha256,
  });
  if (sourceVolume.volume_ordinal < 7) await new Promise((resolveDelay) => setTimeout(resolveDelay, 750));
}

const report = {
  contract: "DEVAM_WIKISOURCE_DUTT_INDEX_STATUS_PROFILE_V1",
  structure_profile: "ingestion/reports/ramayana-manmatha-nath-dutt-commons-structure-v1.json",
  structure_profile_sha256: sha256(structureRaw),
  observed_at: new Date().toISOString(),
  observation_boundary: "Seven current English Wikisource Index-namespace records only. Raw index metadata was observed through normal TLS; no Page-namespace transcription text or source carrier was acquired.",
  volume_count: 7,
  total_carrier_pages: structure.total_pages,
  volumes,
  claims: {
    all_seven_index_records_observed: true,
    all_indexes_marked_to_be_proofread: true,
    all_indexes_untranscluded: true,
    complete_proofread_transcription_available: false,
    exact_text_product_ready: false,
    page_namespace_text_acquired: false,
    provider_ocr_may_be_served_as_exact_text: false,
  },
  product_decision: "retain_seven_scans_as_complete_edition_evidence_and_curate_verified_passages_only",
  decision_reason: "All seven exact Wikisource indexes remain Progress=C (To be proofread) and Transclusion=no; they do not supply a complete proofread, transcluded English edition.",
};

await mkdir(dirname(OUTPUT_PATH), { recursive: true });
await writeFile(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
const outputRaw = await readFile(OUTPUT_PATH);
console.log(JSON.stringify({
  result: "PASS",
  output: OUTPUT_PATH.slice(ROOT.length + 1).replaceAll("\\", "/"),
  output_sha256: sha256(outputRaw),
  volume_count: report.volume_count,
  total_carrier_pages: report.total_carrier_pages,
  progress_literals: [...new Set(volumes.map((volume) => volume.progress_literal))],
  transclusion_literals: [...new Set(volumes.map((volume) => volume.transclusion_literal))],
  product_decision: report.product_decision,
}, null, 2));
