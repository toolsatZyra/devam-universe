import type { GroundedSarthiAnswer, SarthiRequest } from "./contracts";
import { isDuttRamayanaQuery, searchDuttRamayanaStructure } from "../search/dutt-ramayana-structure-search";

const ATLAS_SLUG = "dutt-ramayana";

export function answerDuttRamayanaPreview(request: SarthiRequest): GroundedSarthiAnswer | null {
  const inExactContext = request.context?.atlasNodeSlug === ATLAS_SLUG;
  if (!inExactContext && !isDuttRamayanaQuery(request.message)) return null;
  const hindi = request.context?.languageCode?.toLowerCase().startsWith("hi") === true || /[\u0900-\u097f]/.test(request.message);
  const query = inExactContext && !isDuttRamayanaQuery(request.message) ? "Manmatha Nath Dutt Ramayana" : request.message;
  const results = searchDuttRamayanaStructure(query, hindi ? "hi" : "en");
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
