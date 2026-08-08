import type { GroundedSarthiAnswer, SarthiRequest } from "./contracts";
import { searchGaneshaPuranaStructure } from "../search/ganesha-purana-structure-search";

const ATLAS_SLUG = "ganesha-purana";

export function answerGaneshaPuranaPreview(request: SarthiRequest): GroundedSarthiAnswer | null {
  const inExactContext = request.context?.atlasNodeSlug === ATLAS_SLUG;
  const hindi = request.context?.languageCode?.toLowerCase().startsWith("hi") === true || /[\u0900-\u097f]/.test(request.message);
  const directResults = searchGaneshaPuranaStructure(request.message, hindi ? "hi" : "en");
  const results = directResults.length > 0
    ? directResults
    : inExactContext
      ? searchGaneshaPuranaStructure("Ganesha Purana two khandas 247 chapters", hindi ? "hi" : "en")
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
