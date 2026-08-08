import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";
import { resolveUserCompleteRitualContent } from "./ritual-content";

/** Compatibility entry point; the current contract registry is the sole runtime reader. */
export function resolveKojagaraProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  return resolveUserCompleteRitualContent(request);
}
