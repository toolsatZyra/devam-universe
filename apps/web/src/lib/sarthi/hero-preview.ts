import { getHeroJourney } from "../../data/hero-experiences";
import type { EvidenceCitation, GroundedSarthiAnswer, SarthiRequest, SarthiUnavailable } from "./contracts";
import type { HeroSlug } from "../domain/experience";

function isHindi(request: SarthiRequest) {
  return request.context?.languageCode?.toLowerCase().startsWith("hi") === true || /[\u0900-\u097f]/.test(request.message);
}

function journeyCitations(slug: HeroSlug): EvidenceCitation[] {
  const journey = getHeroJourney(slug);
  if (!journey) return [];
  return journey.stops.map((stop) => ({
    passageId: `sha256:${stop.citation.sourceSha256}:span:${stop.citation.spanSha256}`,
    sourceObjectId: stop.citation.sourceSha256,
    sourceOrdinal: stop.citation.sourceOrdinal,
    workTitle: stop.citation.workTitle,
    editionTitle: stop.citation.editionTitle,
    locator: { ...stop.citation.locator, span_sha256: stop.citation.spanSha256 },
    rightsLane: stop.citation.rightsLane === "derivative_allowed" ? "derivative_allowed" : "citation_only",
  }));
}

export function answerHeroPreview(slug: "ramayana" | "durga", request: SarthiRequest): GroundedSarthiAnswer | SarthiUnavailable {
  const journey = getHeroJourney(slug);
  if (!journey) return { ok: false, code: "GROUNDING_NOT_CONFIGURED", message: "This hero source path is not connected yet." };
  const hindi = isHindi(request);

  if (slug === "ramayana") {
    return {
      ok: true,
      mode: "deterministic_source_bounded_preview",
      answer: hindi
        ? "Devam के वर्तमान स्रोत-सम्बद्ध मानचित्र में वाल्मीकि रामायण के एक संस्कृत इलेक्ट्रॉनिक पाठ के सात काण्ड अलग रखे गए हैं—बाल, अयोध्या, अरण्य, किष्किन्धा, सुन्दर, युद्ध और उत्तर। यह उस एक पाठ की संरचना है; सभी रामायणों, पाठ-परम्पराओं या जीवन-समस्या पर पूर्ण सलाह का दावा नहीं।"
        : "In Devam's current source-bounded map, one Sanskrit electronic Vālmīki Rāmāyaṇa carrier preserves seven distinct books: Bāla, Ayodhyā, Araṇya, Kiṣkindhā, Sundara, Yuddha, and Uttara. That is the structure of this one carrier—not every Ramayana, recension, retelling, or enough evidence yet for complete personal guidance from the epic.",
      citations: journeyCitations("ramayana"),
      alternativesAvailable: true,
      sourceBoundary: journey.sourceBoundary,
    };
  }

  return {
    ok: true,
    mode: "deterministic_source_bounded_preview",
    answer: hindi
      ? "Devam के वर्तमान स्रोत-सम्बद्ध मानचित्र में देवीमाहात्म्य एक GRETIL मार्कण्डेयपुराण-पाठ के अध्याय 81–93 के भीतर सुरक्षित है। अलग Pargiter संस्करण के विषय-सूची प्रमाण के अनुसार कविता का मुख्य भाग अध्याय 82–92 है; 81 आरम्भिक और 93 समापन-कथा का प्रसंग रखते हैं। यह सम्पूर्ण दुर्गा-परम्परा या सभी नवरात्रि-विधियाँ नहीं है।"
      : "In Devam's current source-bounded map, the Devīmāhātmya is preserved within chapters 81–93 of one GRETIL Mārkaṇḍeyapurāṇa carrier. Separate Pargiter contents evidence identifies chapters 82–92 as the poem proper, with 81 as opening context and 93 as the closing frame. This is not the complete Durga tradition or every Navaratri practice.",
    citations: journeyCitations("durga"),
    alternativesAvailable: true,
    sourceBoundary: journey.sourceBoundary,
  };
}
