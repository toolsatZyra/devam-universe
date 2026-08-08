import type { GroundedSarthiAnswer, SarthiRequest } from "./contracts";
import { searchDevimahatmyaSemanticGraph } from "../search/devimahatmya-semantic-search";

const ATLAS_QUERIES: Record<string, string> = {
  "madhu-kaitabha": "Madhu and Kaitabha",
  mahishasura: "Mahishasura",
  shumbha: "Shumbha",
  nishumbha: "Nishumbha",
  "king-suratha": "King Suratha",
  "merchant-samadhi": "Merchant Samadhi",
  "sage-medhas": "Sage Medhas",
  "medhas-hermitage-story-world": "Medhas's hermitage",
  mahamaya: "Mahamaya",
  "suratha-samadhi-seek-counsel": "Suratha and Samadhi seek counsel",
  "madhu-kaitabha-awakening": "madhu-kaitabha-awakening",
  "mahishasura-battle": "mahishasura-battle",
  kaushiki: "Kaushiki",
  kalika: "Kalika",
  dhumralochana: "Dhumralochana",
  "chanda-munda": "chanda-munda",
  chamunda: "Chamunda",
  raktabija: "Raktabija",
  "shumbha-nishumbha-battle": "shumbha-nishumbha-battle",
  "granting-of-boons": "granting of boons",
};

export function answerDevimahatmyaSemanticPreview(request: SarthiRequest): GroundedSarthiAnswer | null {
  const hindi = request.context?.languageCode?.toLowerCase().startsWith("hi") === true || /[\u0900-\u097f]/.test(request.message);
  const directResults = searchDevimahatmyaSemanticGraph(request.message, hindi ? "hi" : "en");
  const atlasQuery = request.context?.atlasNodeSlug ? ATLAS_QUERIES[request.context.atlasNodeSlug] : undefined;
  const results = directResults.length > 0
    ? directResults
    : atlasQuery
      ? searchDevimahatmyaSemanticGraph(atlasQuery, hindi ? "hi" : "en")
      : [];
  if (results.length === 0) return null;
  return {
    ok: true,
    mode: "deterministic_source_bounded_preview",
    answer: results.map((result) => result.statement).join("\n\n"),
    citations: results.flatMap((result) => result.citations),
    alternativesAvailable: true,
    sourceBoundary: results[0].sourceBoundary,
  };
}
