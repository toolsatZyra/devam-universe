import type { GroundedSarthiAnswer, SarthiRequest } from "./contracts";
import { isGanapatiAtharvashirshaQuery, searchGanapatiAtharvashirsha } from "../search/ganapatyatharvashirsha-search";

const ATLAS_SLUG = "ganapatyatharvashirsha";
const PRONUNCIATION_TERMS = ["pronounce", "pronunciation", "accent", "intonation", "chant", "uccarana", "uccāraṇa", "उच्चारण", "स्वर", "कैसे बोल"];
const RITUAL_TERMS = ["ritual", "vidhi", "puja", "pūjā", "recite", "recitation", "initiation", "diksha", "dīkṣā", "विधि", "पूजा", "पाठ कैसे", "दीक्षा"];

function includesAny(value: string, terms: string[]): boolean {
  return terms.some((term) => value.includes(term));
}

function isHindi(request: SarthiRequest): boolean {
  return request.context?.languageCode?.toLowerCase().startsWith("hi") === true || /[\u0900-\u097f]/.test(request.message);
}

export function answerGanapatiAtharvashirsha(request: SarthiRequest): GroundedSarthiAnswer | null {
  const inExactContext = request.context?.atlasNodeSlug === ATLAS_SLUG;
  if (!inExactContext && !isGanapatiAtharvashirshaQuery(request.message)) return null;

  const hindi = isHindi(request);
  const normalized = request.message.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("en");
  const exactQuery = inExactContext && !isGanapatiAtharvashirshaQuery(request.message)
    ? "Ganapati Atharvashirsha"
    : request.message;
  const results = searchGanapatiAtharvashirsha(exactQuery, hindi ? "hi" : "en");
  if (results.length === 0) return null;

  const citations = results.flatMap((result) => result.citations);
  const sourceBoundary = results[0].sourceBoundary;
  if (includesAny(normalized, PRONUNCIATION_TERMS)) {
    return {
      ok: true,
      mode: "deterministic_source_bounded_preview",
      answer: hindi
        ? "Devam इस सटीक संशोधन का स्रोत-पाठ और हिन्दी-अंग्रेज़ी beta अर्थ दिखा सकता है, लेकिन अभी इसका समीक्षा-प्राप्त उच्चारण, वैदिक स्वर, जप-गति या दीक्षा-निर्देश उपलब्ध नहीं है। इसलिए मैं पाठ का उच्चारण गढ़कर नहीं बताऊँगा।"
        : "Devam can show this exact revision and its source-aligned English and Hindi beta meaning, but it does not yet have a reviewed pronunciation, Vedic accent, recitation cadence, or initiation layer. I will not invent one.",
      citations,
      alternativesAvailable: false,
      sourceBoundary,
    };
  }

  if (includesAny(normalized, RITUAL_TERMS)) {
    return {
      ok: true,
      mode: "deterministic_source_bounded_preview",
      answer: hindi
        ? "यहाँ सभी 16 पाठांशों का सटीक-संशोधन, स्रोत-संरेखित beta अर्थ उपलब्ध है; पर यह औपचारिक पूजा-विधि, पाठ-अधिकार, दीक्षा या किसी फल की गारंटी स्थापित नहीं करता। अपने परिवार, सम्प्रदाय या योग्य आचार्य की स्थापित परम्परा को प्राथमिकता दें।"
        : "All 16 passages are available here as an exact-revision, source-aligned beta reading. That does not establish a formal puja procedure, recitation authority, initiation, or a guaranteed result; follow your established family, sampradaya, or qualified teacher for those matters.",
      citations,
      alternativesAvailable: true,
      sourceBoundary,
    };
  }

  return {
    ok: true,
    mode: "deterministic_source_bounded_preview",
    answer: results.map((result) => result.statement).join("\n\n"),
    citations,
    alternativesAvailable: false,
    sourceBoundary,
  };
}
