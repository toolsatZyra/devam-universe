import type { EvidenceCitation, GroundedSarthiAnswer, SarthiRequest } from "./contracts";

const EDITION_TITLE = "Belvedere Press Prayag second edition with Hindi Wikisource page transcriptions (pinned 2026-08-08)";
const PASSAGE_ROOT_SHA256 = "92d01efa89a55cc555944a654f11dd3ccd4a1e1f23ac5c2dca204b49ea8cdf26";
const HOSTED_VERIFICATION_SHA256 = "29746a552a55bf176fb798f6fb39b88a821a48aa808316fc43031d2bd3c90e17";
const SOURCE_BOUNDARY = "One fixed Belvedere Press Ramcharitmanas edition with 802 published proofread/validated beta page projections across seven sopanas. Another 359 low-quality pages and 11 malformed-markup pages remain outside retrieval; this is not every edition, recension, commentary, performance, translation, or living tradition.";

const sopanaStarts = [
  [1, "बालकाण्ड", "4be8a138eea6e49498f6c3a8aff6cb058a0126eecf4441b1dbddb6babc74ad37", 1, "8b7e28f116a1aacdcc4f184ad5569bb907e05e13be25aa9a04f496e3c6ddaa6a", 52, "e6cad89eb3ee35b501b53206ea55c9cb1bdf8a3986bbb86de3a34c5de5a0624a", "पृष्ठ:रामचरितमानस.pdf/५२"],
  [2, "अयोध्याकाण्ड", "959d86ad471e4da9272448ac39c7525c6ff69e3c856654e2ddbd332d539df9d6", 24, "0756d4a9bd56e36900e2848a37d35f4512673aae17ecd8036f9dcfb46470bf9a", 425, "8c0f71e365159d12746aac4d86bb06bca3953880424ae3a2b891584db476b345", "पृष्ठ:रामचरितमानस.pdf/४२५"],
  [3, "अरण्यकाण्ड", "a80da270bba6c0296140ee52c4a7b388c533a9be65e692a586dda311ad20b8b6", 11, "4208af0439e18dde748d1c9029daa0a068ef0385a67ccec3e8482dec65ed838d", 762, "ed9fac5eb856cc9d95df1913ee03fcee18e1ee48f253c81159c57669a38bc35f", "पृष्ठ:रामचरितमानस.pdf/७६२"],
  [4, "किष्किन्धाकाण्ड", "38a7b691876ac93f94c1413ad1099438baf310bfaf4dadd794ad41887c6af739", 20, "7350ed476a415689f575e4a5394c8cb8454b0ee62b50c7657af44a6f383a8f20", 821, "65a223c182fd57f0b78f4fa8a007b3a62a3f5ec587e47c69b6046994701da9bc", "पृष्ठ:रामचरितमानस.pdf/८२१"],
  [5, "सुन्दरकाण्ड", "4c46e5844797e86a320b9589b1ede15db9e1e8c70d17bd34fc47eb01de88726f", 0, "66c88ad00eb25261a301ce32e0d30f3735d93f84de03614b4e52b4c22160c09e", 851, "0713f9932cfc0b0c78d494697192b82a0787b771e2d6ad1cf233f5ed6804e3f3", "पृष्ठ:रामचरितमानस.pdf/८५१"],
  [6, "लङ्काकाण्ड", "88a722f63c43fd57820eba5026f3c25071d774b49b41b4e053bd06cc9b37b12e", 22, "b692bd02f865df9077343b62810b750559c35ca14006df93db8c6903ef13dd65", 923, "053b4fd4b0a2a159d8056faca44ce82ffdce0f9a325b5d092210c56bc0499199", "पृष्ठ:रामचरितमानस.pdf/९२३"],
  [7, "उत्तरकाण्ड", "6d40e809909ee5ea243ec48f37be55480f91983ed3cc2af0a56318fbc34fb61f", 21, "0f7bfc2b03894f3b2cafbfa63473177bb7e72ff0ebdf02a59f62d0644435b9df", 1072, "b38868edf55e86c7b3c1a77f3f8ca4d647eead65a3df078fc032e6528cc054a7", "पृष्ठ:रामचरितमानस.pdf/१०७२"],
] as const;

function citations(): EvidenceCitation[] {
  return sopanaStarts.map(([sopanaOrdinal, sopanaName, sourceSha256, sourceOrdinal, spanSha256, scanPage, projectionSha256, providerPageTitle]) => ({
    passageId: `sha256:${sourceSha256}:ordinal:${sourceOrdinal}`,
    sourceObjectId: sourceSha256,
    sourceOrdinal,
    workTitle: "रामचरितमानस (Ramcharitmanas)",
    editionTitle: EDITION_TITLE,
    locator: {
      provider: "Hindi Wikisource",
      provider_page_title: providerPageTitle,
      scan_page: scanPage,
      sopana_ordinal: sopanaOrdinal,
      sopana_name: sopanaName,
      projection_sha256: projectionSha256,
      span_sha256: spanSha256,
      passage_root_sha256: PASSAGE_ROOT_SHA256,
      hosted_verification_sha256: HOSTED_VERIFICATION_SHA256,
    },
    rightsLane: "derivative_allowed",
  }));
}

function isHindi(request: SarthiRequest): boolean {
  return request.context?.languageCode?.toLowerCase().startsWith("hi") === true || /[\u0900-\u097f]/.test(request.message);
}

function matchesRamcharitmanas(value: string): boolean {
  const normalized = value.toLocaleLowerCase("en");
  return ["ramcharitmanas", "ram charit manas", "tulsidas", "tulsi das", "belvedere", "रामचरितमानस", "तुलसीदास"].some((term) => normalized.includes(term));
}

export function searchRamcharitmanasPreview(query: string, languageCode?: string) {
  if (!matchesRamcharitmanas(query)) return [];
  const hindi = languageCode?.toLowerCase().startsWith("hi") === true || /[\u0900-\u097f]/.test(query);
  return [{
    id: `ramcharitmanas-belvedere-seven-sopana-${hindi ? "hi" : "en"}`,
    title: hindi ? "रामचरितमानस के सात सोपान" : "Ramcharitmanas: seven sopanas",
    statement: hindi
      ? "देवम् में बेलवेडियर प्रेस के एक निश्चित संस्करण के सातों सोपानों से 802 स्रोत-सम्बद्ध बीटा पृष्ठ प्रकाशित हैं। 359 कम-गुणवत्ता वाले पृष्ठ और 11 मार्कअप-विसंगतियाँ अभी खोज से बाहर हैं।"
      : "Devam currently publishes 802 source-addressed beta pages across all seven sopanas of one fixed Belvedere Press Ramcharitmanas edition; 359 low-quality pages and 11 markup anomalies remain outside retrieval.",
    languageCode: hindi ? "hi" as const : "en" as const,
    claimKind: "source_bounded_structure" as const,
    citations: citations(),
    sourceBoundary: SOURCE_BOUNDARY,
  }];
}

export function answerRamcharitmanasPreview(request: SarthiRequest): GroundedSarthiAnswer | null {
  const contextual = request.context?.atlasNodeSlug === "ramcharitmanas"
    && ["this", "here", "tell me", "about", "what is", "why", "यह", "इसके बारे", "क्या है"].some((term) => request.message.toLocaleLowerCase("en").includes(term));
  if (!matchesRamcharitmanas(request.message) && !contextual) return null;
  const hindi = isHindi(request);
  return {
    ok: true,
    mode: "deterministic_source_bounded_preview",
    answer: hindi
      ? "रामचरितमानस तुलसीदास की अवधी राम-कथा है। देवम् में अभी बेलवेडियर प्रेस के एक निश्चित संस्करण के सातों सोपानों—बाल, अयोध्या, अरण्य, किष्किन्धा, सुन्दर, लङ्का और उत्तर—से 802 स्रोत-सम्बद्ध बीटा पृष्ठ उपलब्ध हैं। 359 कम-गुणवत्ता वाले पृष्ठ और 11 मार्कअप-विसंगतियाँ अभी खोज में नहीं हैं, इसलिए इसे सम्पूर्ण रामचरितमानस-परम्परा न समझें।"
      : "Ramcharitmanas is Tulsidas's Awadhi devotional telling of the Rama story. Devam currently has 802 source-addressed beta pages across all seven sopanas—Bala, Ayodhya, Aranya, Kishkindha, Sundara, Lanka, and Uttara—from one fixed Belvedere Press edition. Another 359 low-quality pages and 11 markup anomalies remain outside retrieval, so this is not the complete Ramcharitmanas tradition.",
    citations: citations(),
    alternativesAvailable: true,
    sourceBoundary: SOURCE_BOUNDARY,
  };
}

export const RAMCHARITMANAS_PREVIEW_FIXITY = {
  passageRootSha256: PASSAGE_ROOT_SHA256,
  hostedVerificationSha256: HOSTED_VERIFICATION_SHA256,
  publishedPageCount: 802,
  excludedPageCount: 370,
  completeRamcharitmanasTradition: false,
} as const;
