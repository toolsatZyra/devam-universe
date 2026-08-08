import type { PracticeGuidanceRequest, PracticeGuidanceResult, RitualProcedureGuide, SourceBoundedPracticeGuide } from "../domain/practice";
import { resolveGaneshChaturthiProcedure } from "./ganesha-chaturthi";
import { resolveGaneshaReading } from "./ganesha-reading";
import { resolveNavaratriProcedure } from "./navaratri";
import { resolveWeekdayProcedure } from "./weekday";
import { resolveDiwaliProcedure } from "./diwali";
import { resolveChhathProcedure } from "./chhath";
import { resolveVasuBarasProcedure } from "./vasu-baras";
import { resolveNarakaChaturdashiProcedure } from "./naraka-chaturdashi";
import { resolveKaliChaudasProcedure } from "./kali-chaudas";
import { resolveGujaratiNewYearProcedure } from "./gujarati-new-year";
import { resolveBalipadyamiProcedure } from "./balipadyami";
import { resolveJainDiwaliProcedure } from "./jain-diwali";
import { resolveBandiChhorProcedure } from "./bandi-chhor";
import { resolveAhoiAshtamiProcedure } from "./ahoi-ashtami";
import { resolveKarwaChauthProcedure } from "./karwa-chauth";
import { resolveSankashtiChaturthiProcedure } from "./sankashti-chaturthi";
import { resolveEkadashiProcedure } from "./ekadashi";
import { resolveMasikaShivaratriProcedure } from "./masika-shivaratri";
import { resolveDhantrayodashiProcedure } from "./dhantrayodashi";
import { resolveYamaDeepamProcedure } from "./yama-deepam";
import { resolveTamilDeepavaliProcedure } from "./tamil-deepavali";
import { resolveBengalKaliPujaProcedure } from "./bengal-kali-puja";
import { resolveBaliPratipadaProcedure } from "./bali-pratipada";
import { resolveGovardhanaPujaProcedure } from "./govardhana-puja";
import { resolveBhaiDoojProcedure } from "./bhai-dooj";
import { resolveTulasiVivahProcedure } from "./tulasi-vivah";
import { resolveDevDeepawaliProcedure } from "./dev-deepawali";
import { resolveGitaJayantiProcedure } from "./gita-jayanti";
import { resolveKrishnaJanmashtamiProcedure } from "./krishna-janmashtami";
import { resolveHartalikaTeejProcedure } from "./hartalika-teej";
import { resolveRadhaAshtamiProcedure } from "./radha-ashtami";
import { resolveVivahaPanchamiProcedure } from "./vivaha-panchami";
import { resolveBengalDurgaPujaProcedure } from "./bengal-durga-puja";
import { resolveMasikaDurgashtamiProcedure } from "./masika-durgashtami";
import { resolveUserCompleteRitualContent } from "./ritual-content";

type LegacyProcedureResolver = (request: PracticeGuidanceRequest) => RitualProcedureGuide | null;

// Compatibility only. New ritual lanes belong in the generic
// DEVAM_RITUAL_OBSERVANCE_CONTENT_V1 registry and must not add another branch.
// Ordering preserves the previously shipped resolver precedence.
const LEGACY_PROCEDURE_RESOLVERS = [
  resolveKrishnaJanmashtamiProcedure,
  resolveHartalikaTeejProcedure,
  resolveRadhaAshtamiProcedure,
  resolveVivahaPanchamiProcedure,
  resolveBengalDurgaPujaProcedure,
  resolveMasikaDurgashtamiProcedure,
  resolveWeekdayProcedure,
  resolveDiwaliProcedure,
  resolveChhathProcedure,
  resolveVasuBarasProcedure,
  resolveNarakaChaturdashiProcedure,
  resolveKaliChaudasProcedure,
  resolveGujaratiNewYearProcedure,
  resolveBalipadyamiProcedure,
  resolveJainDiwaliProcedure,
  resolveBandiChhorProcedure,
  resolveAhoiAshtamiProcedure,
  resolveKarwaChauthProcedure,
  resolveSankashtiChaturthiProcedure,
  resolveEkadashiProcedure,
  resolveMasikaShivaratriProcedure,
  resolveDhantrayodashiProcedure,
  resolveYamaDeepamProcedure,
  resolveTamilDeepavaliProcedure,
  resolveBengalKaliPujaProcedure,
  resolveBaliPratipadaProcedure,
  resolveGovardhanaPujaProcedure,
  resolveBhaiDoojProcedure,
  resolveTulasiVivahProcedure,
  resolveDevDeepawaliProcedure,
  resolveGitaJayantiProcedure,
  resolveNavaratriProcedure,
] satisfies LegacyProcedureResolver[];

export function resolvePracticeGuidance(request: PracticeGuidanceRequest): PracticeGuidanceResult {
  const userComplete = resolveUserCompleteRitualContent(request);
  if (userComplete) {
    const companion = resolveGaneshaReading(request);
    const companionReading = companion.status === "source_bounded_companion_available"
      ? companion.guide
      : userComplete.companionReading;
    return { ok: true, status: "ritual_procedure_available", request, guide: { ...userComplete, companionReading } };
  }
  for (const resolveLegacyProcedure of LEGACY_PROCEDURE_RESOLVERS) {
    const guide = resolveLegacyProcedure(request);
    if (guide) return { ok: true, status: "ritual_procedure_available", request, guide };
  }
  const readingResult = resolveGaneshaReading(request);
  const companionReading = readingResult.status === "source_bounded_companion_available"
    ? readingResult.guide as SourceBoundedPracticeGuide
    : null;
  const procedure = resolveGaneshChaturthiProcedure(request, companionReading);
  if (procedure) return { ok: true, status: "ritual_procedure_available", request, guide: procedure };
  return readingResult;
}
