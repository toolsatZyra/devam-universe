import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { LibrarySearchResult } from "./library-search";

const PACK_PATH = "knowledge_packs/ramayana/dutt-project-gutenberg-structure-search-v1.json";
const PACK_FILE_SHA256 = "2de6aeb926124f8e134c66c1d29bfd422fda38bc808931573f553943ff19c197";
const PACKET_SHA256 = "edc6d858017a4788a65feac404583374b007b1084749925381abd47ca1a79d13";
const PASSAGE_ROOT_SHA256 = "1efc394e9fd07b394d74158344120d3cd247b63c8a362759266687c23c5307d8";
const HOSTED_ROOT_SHA256 = "3226377be38be511463e8c09d56898a6b9f658d649cb376e51e3ac7c94a81c42";
const WORK_TITLE = "Vālmīki Rāmāyaṇa";
const SOURCE_BOUNDARY = "Complete narrative-body coverage of Manmatha Nath Dutt's four-volume Project Gutenberg English electronic edition: seven kāṇḍas and 652 byte-addressed sections. Literal section-number defects are preserved, not corrected. The electronic text is not yet reconciled page by page to all seven retained print scans; it is not Sanskrit, Hindi, a critical edition, every recension or translation, or the complete Ramayana tradition.";

type Endpoint = {
  source_sha256: string;
  source_ordinal: number;
  span_sha256: string;
  locator: Record<string, unknown>;
};

type Kanda = {
  volume: number;
  kanda_ordinal: number;
  kanda_slug: string;
  kanda_title: string;
  section_count: number;
  first_literal_number: number;
  last_literal_number: number;
  missing_literal_numbers: number[];
  duplicate_literal_numbers: number[];
  nonincreasing_transitions: unknown[];
  terminal_literal: string | null;
  terminal_evidence?: string;
  opening: Endpoint;
  closing: Endpoint;
};

type Pack = {
  contract: string;
  pack_id: string;
  packet_sha256: string;
  passage_content_root_sha256: string;
  hosted_text_span_root_sha256: string;
  edition_title: string;
  kanda_count: number;
  passage_count: number;
  source_object_count: number;
  source_object_bytes: number;
  kandas: Kanda[];
  completion_denials: Record<string, boolean>;
  source_payloads_copied: boolean;
};

let cachedPack: Pack | undefined;

function loadPack(): Pack {
  if (cachedPack) return cachedPack;
  const bytes = readFileSync(resolve(process.cwd(), "../..", PACK_PATH));
  if (createHash("sha256").update(bytes).digest("hex") !== PACK_FILE_SHA256) throw new Error("Dutt Ramayana structure-search pack drift");
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  const sectionCount = pack.kandas.reduce((total, kanda) => total + kanda.section_count, 0);
  if (
    pack.contract !== "DEVAM_DUTT_STRUCTURE_SEARCH_PACK_V1"
    || pack.pack_id !== "dutt-project-gutenberg-structure-search-v1"
    || pack.packet_sha256 !== PACKET_SHA256
    || pack.passage_content_root_sha256 !== PASSAGE_ROOT_SHA256
    || pack.hosted_text_span_root_sha256 !== HOSTED_ROOT_SHA256
    || pack.kanda_count !== 7
    || pack.passage_count !== 652
    || pack.source_object_count !== 4
    || sectionCount !== 652
    || pack.kandas.map((kanda) => kanda.kanda_ordinal).join(",") !== "1,2,3,4,5,6,7"
    || pack.kandas.some((kanda) => !kanda.opening.locator || !kanda.closing.locator)
    || Object.values(pack.completion_denials).some((value) => value !== false)
    || pack.source_payloads_copied !== false
  ) throw new Error("Dutt Ramayana structure-search contract drift");
  cachedPack = pack;
  return pack;
}

function normalize(value: string): string {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("en");
}

function namesDuttEdition(value: string): boolean {
  return [
    "manmatha nath dutt", "manmatha dutt", "m n dutt", "dutt ramayana", "dutt's ramayana",
    "project gutenberg four volume ramayana", "project gutenberg ramayana 57265", "दत्त रामायण", "मन्मथ नाथ दत्त",
  ].some((term) => value.includes(normalize(term)));
}

function selectedKanda(value: string, kandas: Kanda[]): Kanda | undefined {
  const aliases: Record<string, string[]> = {
    bala: ["bala kanda", "balakanda", "balakandam", "बाल कांड", "बालकाण्ड"],
    ayodhya: ["ayodhya kanda", "ayodhyakanda", "ayodhyakandam", "अयोध्या कांड", "अयोध्याकाण्ड"],
    aranya: ["aranya kanda", "aranyakanda", "aranyakandam", "अरण्य कांड", "अरण्यकाण्ड"],
    kishkindha: ["kishkindha kanda", "kishkindhakanda", "kishkindha kandam", "किष्किन्धा कांड", "किष्किन्धाकाण्ड"],
    sundara: ["sundara kanda", "sundarakanda", "sundara kandam", "सुन्दर कांड", "सुन्दरकाण्ड"],
    yuddha: ["yuddha kanda", "yuddhakanda", "yuddha kandam", "युद्ध कांड", "युद्धकाण्ड"],
    uttara: ["uttara kanda", "uttarakanda", "uttara kandam", "उत्तर कांड", "उत्तरकाण्ड"],
  };
  return kandas.find((kanda) => aliases[kanda.kanda_slug].some((alias) => value.includes(normalize(alias))));
}

function citation(endpoint: Endpoint, editionTitle: string): LibrarySearchResult["citations"][number] {
  return {
    passageId: `sha256:${endpoint.source_sha256}:span:${endpoint.span_sha256}`,
    sourceObjectId: endpoint.source_sha256,
    sourceOrdinal: endpoint.source_ordinal,
    locator: endpoint.locator,
    workTitle: WORK_TITLE,
    editionTitle,
    rightsLane: "product_allowed",
  };
}

function kandaStatement(kanda: Kanda, hindi: boolean): string {
  const defects = kanda.missing_literal_numbers.length + kanda.duplicate_literal_numbers.length + kanda.nonincreasing_transitions.length;
  if (hindi) {
    return `दत्त के अंग्रेज़ी इलेक्ट्रॉनिक संस्करण में ${kanda.kanda_title} खण्ड ${kanda.kanda_ordinal} है और इसमें ${kanda.section_count} स्रोत-क्रमित खण्ड हैं। मुद्रित SECTION संख्याएँ ${kanda.first_literal_number} से ${kanda.last_literal_number} तक जाती हैं; ${defects} दर्ज संख्या-विसंगतियाँ ज्यों की त्यों सुरक्षित हैं।`;
  }
  return `${kanda.kanda_title} is kāṇḍa ${kanda.kanda_ordinal} in Dutt's English electronic edition and contains ${kanda.section_count} source-ordered sections. Its printed SECTION labels run from ${kanda.first_literal_number} to ${kanda.last_literal_number}; ${defects} recorded numbering anomalies remain preserved rather than corrected.`;
}

export function searchDuttRamayanaStructure(query: string, languageCode?: string): LibrarySearchResult[] {
  const normalized = normalize(query.trim());
  if (normalized.length < 2 || normalized.length > 512 || !namesDuttEdition(normalized)) return [];
  const pack = loadPack();
  const hindi = languageCode?.toLowerCase().startsWith("hi") === true || /[\u0900-\u097f]/.test(query);
  const kanda = selectedKanda(normalized, pack.kandas);
  if (kanda) {
    return [{
      id: `dutt-ramayana-${kanda.kanda_slug}-structure-${hindi ? "hi" : "en"}`,
      title: `${kanda.kanda_title} — Manmatha Nath Dutt`,
      statement: kandaStatement(kanda, hindi),
      languageCode: hindi ? "hi" : "en",
      claimKind: "source_bounded_edition_structure",
      citations: [citation(kanda.opening, pack.edition_title), citation(kanda.closing, pack.edition_title)],
      sourceBoundary: SOURCE_BOUNDARY,
    }];
  }

  return [{
    id: `dutt-ramayana-seven-kanda-structure-${hindi ? "hi" : "en"}`,
    title: hindi ? "मन्मथ नाथ दत्त रामायण — सात काण्ड" : "Manmatha Nath Dutt Ramayana — seven kāṇḍas",
    statement: hindi
      ? "देवम् में दत्त के चार Project Gutenberg इलेक्ट्रॉनिक खण्डों का पूरा कथात्मक भाग उपलब्ध है: सातों काण्डों में 652 स्रोत-क्रमित अंग्रेज़ी खण्ड। मूल मुद्रित SECTION संख्या की विसंगतियाँ सुधारी नहीं गई हैं।"
      : "Devam preserves the complete narrative body of Dutt's four Project Gutenberg electronic volumes: 652 source-ordered English sections across all seven kāṇḍas. Literal SECTION-numbering defects remain visible rather than silently corrected.",
    languageCode: hindi ? "hi" : "en",
    claimKind: "source_bounded_edition_structure",
    citations: pack.kandas.flatMap((item) => [citation(item.opening, pack.edition_title), citation(item.closing, pack.edition_title)]),
    sourceBoundary: SOURCE_BOUNDARY,
  }];
}

export function isDuttRamayanaQuery(query: string): boolean {
  return namesDuttEdition(normalize(query));
}

export const DUTT_RAMAYANA_STRUCTURE_SEARCH_FIXITY = {
  packFileSha256: PACK_FILE_SHA256,
  packetSha256: PACKET_SHA256,
  passageRootSha256: PASSAGE_ROOT_SHA256,
  hostedRootSha256: HOSTED_ROOT_SHA256,
  sourceObjectCount: 4,
  kandaCount: 7,
  passageCount: 652,
  sourcePayloadsCopied: false,
} as const;
