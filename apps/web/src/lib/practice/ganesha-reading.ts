import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, PracticeGuidanceResult, PracticeGuideStep } from "../domain/practice";

const PACK_FILE_SHA256 = "492bafe94124f81de32acee6329b798fe09970eace160bdd1a9db646d5959d2d";
const PACK_CANONICAL_SHA256 = "18c7aa230668b2d8062ebc31c9b366eb43f000d2210a39d84a2761843e7e0596";

type PackClaim = { stable_key: string; evidence: { marker: number }[] };
type PackPractice = {
  procedure_slug: string;
  title: string;
  language_code: "en" | "hi";
  observance_summary: string;
  family_practice_note: string;
  steps: {
    ordinal: number;
    instruction: string;
    rationale: string;
    optional: boolean;
    claim_key: string | null;
  }[];
};

type Pack = {
  pack_id: string;
  source: { canonical_tei_sha256: string; rights_lane: "derivative_allowed" };
  claims: PackClaim[];
  reading_practices: PackPractice[];
};

function loadPinnedPack(): Pack {
  const path = resolve(process.cwd(), "../..", "knowledge_packs/ganesha/shriganapatimantraksharavali-v1.json");
  const bytes = readFileSync(path);
  const actualSha256 = createHash("sha256").update(bytes).digest("hex");
  if (actualSha256 !== PACK_FILE_SHA256) throw new Error(`Ganesha knowledge-pack drift: ${actualSha256}`);
  return JSON.parse(bytes.toString("utf8")) as Pack;
}

const pack = loadPinnedPack();

function sourceOrdinals(claimKey: string | null): number[] {
  if (!claimKey) return [];
  const claim = pack.claims.find((candidate) => candidate.stable_key === claimKey);
  if (!claim) throw new Error(`Knowledge-pack claim not found: ${claimKey}`);
  return [...new Set(claim.evidence.map((evidence) => evidence.marker))].sort((left, right) => left - right);
}

function steps(practice: PackPractice): PracticeGuideStep[] {
  return practice.steps.map((step) => ({
    ordinal: step.ordinal,
    instruction: step.instruction,
    rationale: step.rationale,
    optional: step.optional,
    sourceClaimKey: step.claim_key,
    sourceOrdinals: sourceOrdinals(step.claim_key),
  }));
}

export function resolveGaneshaReading(request: PracticeGuidanceRequest): PracticeGuidanceResult {
  const supportedObservance = request.observanceSlug === "ganesh-chaturthi"
    || /^sankashti-chaturthi-2026-(09|10|11|12)$/.test(request.observanceSlug);
  const supported = supportedObservance
    && request.regionCode === "west-india"
    && request.traditionCode === "smarta-west-india";
  const practice = pack.reading_practices.find((candidate) => candidate.language_code === request.languageCode);
  if (!supported || !practice) return { ok: true, status: "no_supported_guide_for_context", request, guide: null };

  return {
    ok: true,
    status: "source_bounded_companion_available",
    request,
    guide: {
      guideId: practice.procedure_slug,
      companionToObservanceSlug: request.observanceSlug,
      title: practice.title,
      languageCode: practice.language_code,
      kind: "optional_source_bounded_devotional_reading",
      summary: practice.observance_summary,
      familyPracticeNote: practice.family_practice_note,
      steps: steps(practice),
      evidence: {
        packId: pack.pack_id,
        packFileSha256: PACK_FILE_SHA256,
        packCanonicalSha256: PACK_CANONICAL_SHA256,
        sourceObjectSha256: pack.source.canonical_tei_sha256,
        rightsLane: pack.source.rights_lane,
        sourceTextReturnedByApi: false,
      },
      boundaries: {
        formalPujaVidhiIncluded: false,
        minimumStandardElaborateProcedureIncluded: false,
        completeRitualGuidance: false,
        universalPracticeClaim: false,
      },
    },
  };
}
