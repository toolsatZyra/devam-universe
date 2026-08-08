import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";
import { resolveGaneshaReading } from "./ganesha-reading";

const CONTRACT = "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1";

const REGISTRY = [
  {
    fileName: "agastya-arghya-delhi-content-v1.json",
    sha256: "fd0e1631e921c3f7ccb9cdc2ea42d552be27c11de1fa423d53aa6264383ebc64",
    laneId: "agastya-arghya-delhi-content-v1",
  },
  {
    fileName: "hala-shashthi-north-india-content-v1.json",
    sha256: "b043f436d54b39a55a9b48c351bfbb726b1a8a1fbafebc39149c84f2a0f4d8c0",
    laneId: "hala-shashthi-north-india-content-v1",
  },
  {
    fileName: "bengal-mahashtami-community-participant-2026-v1.json",
    sha256: "8f4437ecb12e0c1cf6cd803312162f2b616f291b60dd24de309a6ee00f38625b",
    laneId: "bengal-mahashtami-community-participant-2026-v1",
  },
  {
    fileName: "bengal-durga-puja-participant-content-v1.json",
    sha256: "ef0727519e45314eefbdfcfd83f2ffc750b9ba5ea6399ab4cdbed64cf05afa59",
    laneId: "bengal-durga-puja-participant-content-v1",
  },
  {
    fileName: "vishwakarma-puja-bengal-workplace-content-v1.json",
    sha256: "1d57c055654685481e90f4e8dc190385adfa06486313f8a844bfcfd6840b4b39",
    laneId: "vishwakarma-puja-bengal-workplace-content-v1",
  },
  {
    fileName: "sankranti-september-december-general-content-v1.json",
    sha256: "7f76eaabbf5b5cf31f5bd5d612e4a08521a7adc46d6bf462e2b4c5f16640b9fa",
    laneId: "sankranti-september-december-general-content-v1",
  },
  {
    fileName: "pitru-paksha-delhi-remembrance-content-v1.json",
    sha256: "044c4ff8163a6203628425db1bdafc1d6b7b372a74882885fbb1efb987a032e0",
    laneId: "pitru-paksha-delhi-remembrance-content-v1",
  },
  {
    fileName: "diwali-lakshmi-puja-west-india-content-v1.json",
    sha256: "f084c0355b1706831058e54586b8b2c782b0c24ae3f724de9494ff3c0f5d6f4f",
    laneId: "diwali-lakshmi-puja-west-india-content-v1",
  },
  {
    fileName: "ganesh-chaturthi-west-india-content-v1.json",
    sha256: "eaa9f4576ecd9587ea205039ca633c569ad61d4f79637e8eb7774182a86163dd",
    laneId: "ganesh-chaturthi-west-india-content-v1",
  },
  {
    fileName: "sankashti-chaturthi-west-india-content-v1.json",
    sha256: "4515a475d9fcfcfb6435e2dc9a2a5425e5c54d2d9ee30e8dd61329daed661375",
    laneId: "sankashti-chaturthi-west-india-content-v1",
  },
  {
    fileName: "shardiya-navaratri-north-west-india-content-v1.json",
    sha256: "320b79891597460b33a0ee031411d805afce56b8c9b64c35a18fc2f02df250b1",
    laneId: "shardiya-navaratri-north-west-india-content-v1",
  },
  {
    fileName: "masika-durgashtami-north-west-content-v1.json",
    sha256: "e8c24d5732f2a8371ccc2c08e2643920e3ca8af3313ff722eaba19989ea95d83",
    laneId: "masika-durgashtami-north-west-content-v1",
  },
  {
    fileName: "masika-shivaratri-north-west-india-content-v1.json",
    sha256: "dfe960d608286e8381bef72db95d1f75c86dfc395acdd8cda2ff8a25bf78dab2",
    laneId: "masika-shivaratri-north-west-india-content-v1",
  },
  {
    fileName: "pradosha-north-west-content-v1.json",
    sha256: "fc8c08624c3b7048de089462e9aef23decad1773d831358d783fc4651fb24eb0",
    laneId: "pradosha-north-west-content-v1",
  },
  {
    fileName: "purnima-amavasya-north-west-india-content-v1.json",
    sha256: "dc4cf0acfb4d49c901ae023cd9ae05e6ba6b9e2b3b09839049cda75fb0ea27d2",
    laneId: "purnima-amavasya-north-west-india-content-v1",
  },
  {
    fileName: "ananta-chaturdashi-north-west-content-v1.json",
    sha256: "84627e57e6cac73a8825afd7cbf972a101e24f9476749a42901300f059b7cc47",
    laneId: "ananta-chaturdashi-north-west-content-v1",
  },
  {
    fileName: "kalabhairava-jayanti-north-kashi-content-v1.json",
    sha256: "97f7c1b0851467f1ef456fa14d306b5987653ed4df11fd934cea5c919a47a15a",
    laneId: "kalabhairava-jayanti-north-kashi-content-v1",
  },
  {
    fileName: "kojagara-sharad-purnima-north-west-content-v1.json",
    sha256: "f199e5d116d3931db9453a56c16b093e35651e6a88dabc9eaefe2d35542f2719",
    laneId: "kojagara-sharad-purnima-north-west-content-v1",
  },
  {
    fileName: "rishi-panchami-saptarishi-reflection-content-v1.json",
    sha256: "b5a463b6a93045ef442c449b723de738bd9ea2976ec69b826b4863a7b3202de3",
    laneId: "rishi-panchami-saptarishi-reflection-content-v1",
  },
  {
    fileName: "vasu-baras-maharashtra-family-content-v1.json",
    sha256: "fc71846211e23905cf4d2a3449b393e999d55638a91d27ba44f88063dc1e46dc",
    laneId: "vasu-baras-maharashtra-family-content-v1",
  },
  {
    fileName: "dhantrayodashi-north-west-india-content-v1.json",
    sha256: "ccf9a0f6b2c754e0ae41f6e3e0efb54bbee8c29101f3b00ae4e1bc1fab4a0bb6",
    laneId: "dhantrayodashi-north-west-india-content-v1",
  },
  {
    fileName: "yama-deepam-north-west-india-content-v1.json",
    sha256: "6464a3ffb480ed52806f7e5b2dd612edc8050a5280e19b0846875a526dc4c6e3",
    laneId: "yama-deepam-north-west-india-content-v1",
  },
  {
    fileName: "naraka-chaturdashi-maharashtra-content-v1.json",
    sha256: "b91fc42a80de654e23608db3d6ca3c03dab4726ca317ea3c678a1946baaffd33",
    laneId: "naraka-chaturdashi-maharashtra-content-v1",
  },
  {
    fileName: "tamil-deepavali-household-content-v1.json",
    sha256: "ec0df3a2f4ae3817d1db145618e3500f202011303534bd3cc3a7a928a4476323",
    laneId: "tamil-deepavali-household-content-v1",
  },
  {
    fileName: "kali-chaudas-baps-gujarat-content-v1.json",
    sha256: "3664aca83a774c9a1c5cde8fa23a0a8404de10512a3db46c7a9c83276999fd67",
    laneId: "kali-chaudas-baps-gujarat-content-v1",
  },
  {
    fileName: "bali-pratipada-maharashtra-content-v1.json",
    sha256: "b88f9a4ff1405af249214168ac6a42f05a0bb2d16df3f8651bf4769f94eb69c6",
    laneId: "bali-pratipada-maharashtra-content-v1",
  },
  {
    fileName: "govardhana-puja-iskcon-content-v1.json",
    sha256: "68277ffa142a607e50218670e942efdaea87264d550b0490b0dc583b2177a950",
    laneId: "govardhana-puja-iskcon-content-v1",
  },
  {
    fileName: "bhai-dooj-north-india-content-v1.json",
    sha256: "330951e8a98bd38c3eb04dac43d2e232b18891f8bfc54e4536b6fb7bd849bff2",
    laneId: "bhai-dooj-north-india-content-v1",
  },
  {
    fileName: "bengal-kali-puja-participant-content-v1.json",
    sha256: "11cc811ae40c803ac8b3816b156fdc957f87fafcd59fc428119a8f1a7e02ac67",
    laneId: "bengal-kali-puja-participant-content-v1",
  },
  {
    fileName: "gujarati-new-year-baps-content-v1.json",
    sha256: "55b4c95d6b615984edc1afe19c166661b07115a5093d81b53ea3cf10dc0e7240",
    laneId: "gujarati-new-year-baps-content-v1",
  },
  {
    fileName: "karnataka-saraswati-ayudha-puja-content-v1.json",
    sha256: "f574fac7744f47c3d712426f243526c6de0dcaeb4edb5e64fe4174fa31061c7b",
    laneId: "karnataka-saraswati-ayudha-puja-content-v1",
  },
  {
    fileName: "balipadyami-karnataka-content-v1.json",
    sha256: "2233bac7e6580f1fdb637d5a15a1f61ac371455aa11de27945853a830eb84b91",
    laneId: "balipadyami-karnataka-content-v1",
  },
  {
    fileName: "bandi-chhor-sgpc-participant-content-v1.json",
    sha256: "2b8781a980a7e8aceb57a1e25a8ec2b6cf08a3d9a06cb6a2963d6d693c98e085",
    laneId: "bandi-chhor-sgpc-participant-content-v1",
  },
  {
    fileName: "jain-diwali-lay-remembrance-content-v1.json",
    sha256: "1b7224350413e7a7cf5938dfeabe7d2a7f246ec2043a726bf1ea24404a4b14a9",
    laneId: "jain-diwali-lay-remembrance-content-v1",
  },
  {
    fileName: "ahoi-ashtami-north-india-household-content-v1.json",
    sha256: "8b3b66c32ff3bd05e32c3cb42573a7ededd23abbc08b8b24d7836dad75ee4ec7",
    laneId: "ahoi-ashtami-north-india-household-content-v1",
  },
  {
    fileName: "karwa-chauth-north-india-household-content-v1.json",
    sha256: "639350ff57d30ca4f57092844202208b7a62d81e906c0d503fa724dd94dfd53d",
    laneId: "karwa-chauth-north-india-household-content-v1",
  },
  {
    fileName: "chhath-bihar-purvanchal-participant-content-v1.json",
    sha256: "4b2a048f462ee42bdf9b06eab5948904d9963a347a3b25f136bc3f5ef936b38a",
    laneId: "chhath-bihar-purvanchal-participant-content-v1",
  },
  {
    fileName: "dev-deepawali-varanasi-participant-content-v1.json",
    sha256: "a7c036de4811cdcc02e7bcc324eebe36d605471d2b2f8ec0a4c5e103e632a92f",
    laneId: "dev-deepawali-varanasi-participant-content-v1",
  },
  {
    fileName: "hartalika-teej-north-west-india-participant-content-v1.json",
    sha256: "da872bebfcfb81a09ecd05eaaaf67454b1de88dfeee0bd2ca7018b77ada19503",
    laneId: "hartalika-teej-north-west-india-participant-content-v1",
  },
  {
    fileName: "radha-ashtami-iskcon-participant-content-v1.json",
    sha256: "2a5351b8aab4b0346299d2104b506fd58d243011322f5f1712db00c23d06d455",
    laneId: "radha-ashtami-iskcon-participant-content-v1",
  },
  {
    fileName: "gita-jayanti-reading-reflection-content-v1.json",
    sha256: "896b5bd64f7c947832d970188ba1eb6b1e82f11523047cf1b021bf2dc7bb625b",
    laneId: "gita-jayanti-reading-reflection-content-v1",
  },
  {
    fileName: "vivaha-panchami-north-india-content-v1.json",
    sha256: "6f2a7c281c31d395fd394e9e7b31ec812355343c75a46fae783285c7e325abac",
    laneId: "vivaha-panchami-north-india-content-v1",
  },
  {
    fileName: "ekadashi-recurring-devotional-content-v1.json",
    sha256: "5aa329200dab91dd2623064ce585dc53ae4cbba110a6fd4a739b7c745d77caf8",
    laneId: "ekadashi-recurring-devotional-content-v1",
  },
  {
    fileName: "krishna-janmashtami-smarta-iskcon-content-v1.json",
    sha256: "bbc353da9c309fb851ecc704f83e1dbc758a73a487337603c8adbfe2aadf3126",
    laneId: "krishna-janmashtami-smarta-iskcon-content-v1",
  },
  {
    fileName: "tulasi-vivah-general-baps-content-v1.json",
    sha256: "8702467cf911baa47decaebe8614bfcf52e208b1d1c2062f486512bed2914f17",
    laneId: "tulasi-vivah-general-baps-content-v1",
  },
  {
    fileName: "weekday-practice-west-india-content-v1.json",
    sha256: "4f6dafa494f30709f928a10a5f5109cd72dd889d803ef6245d30dbe1342c090f",
    laneId: "weekday-practice-west-india-content-v1",
  },
] as const;

type Source = {
  source_id: string;
  title: string;
  publisher: string;
  source_role: string;
  rights_lane: RitualProcedureGuide["evidence"]["sources"][number]["rightsLane"];
  url: string | null;
};

type Material = {
  item: string;
  required: boolean;
  substitutions: string[];
  source_ids: string[];
};

type Step = {
  ordinal: number;
  instruction: string;
  why: string;
  optional: boolean;
  source_ids: string[];
};

type Procedure = {
  tier: "minimum" | "standard" | "elaborate";
  label: string;
  estimated_minutes: number;
  materials: Material[];
  steps: Step[];
};

type LocalizedContent = {
  language_code: "en" | "hi";
  observance_slugs?: string[];
  title: string;
  short_answer: string;
  significance: { text: string; source_ids: string[]; scope_note: string };
  origin_narratives: {
    narrative_id: string;
    title: string;
    summary: string;
    tradition_scope: string;
    source_ids: string[];
  }[];
  typical_practices: {
    practice_id: string;
    population_scope: string;
    description: string;
    source_ids: string[];
  }[];
  procedures: Procedure[];
  variants: {
    variant_id: string;
    scope: string;
    difference: string;
    source_ids: string[];
  }[];
  daily_sequence?: {
    ordinal: number;
    common_name: string;
    reflection: string;
    ritual_requirement: false;
    source_ids: string[];
    calendar_status?: "resolved_for_bounded_2026_context" | "partially_resolved_distinct_lanes" | "editorial_sequence_only";
    calendar_note?: string;
  }[];
  safety_and_boundaries: string[];
};

type RitualContentPack = {
  contract: typeof CONTRACT;
  lane_id: string;
  observance_slugs: string[];
  applicability: {
    region_codes: string[];
    tradition_codes: string[];
    settings: string[];
    context_pairs?: { region_code: string; tradition_code: string; observance_slug?: string }[];
    observance_context_notes?: { observance_slug: string; language_code: "en" | "hi"; note: string }[];
    family_practice_overrides_generic_guidance: true;
    material_context_questions: string[];
  };
  calendar: {
    timing_kind: string;
    decision_rule_id: string | null;
    live_schedule_required: boolean;
    freshness_note: string | null;
  };
  sources: Source[];
  localized_content: LocalizedContent[];
  product_status: {
    classification: "user_complete_lane";
    completed_dimensions: Record<string, boolean>;
    open_gaps: string[];
    review_status: string;
  };
};

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === "string" && item.length > 0);
}

function assertPack(pack: RitualContentPack, expectedLaneId: string): void {
  if (pack.contract !== CONTRACT || pack.lane_id !== expectedLaneId) throw new Error("Ritual content identity drift");
  if (!isStringArray(pack.observance_slugs)) throw new Error("Ritual content observance universe is empty");
  if (!isStringArray(pack.applicability.region_codes) || !isStringArray(pack.applicability.tradition_codes) || !isStringArray(pack.applicability.settings)) {
    throw new Error("Ritual content applicability is incomplete");
  }
  if (pack.applicability.family_practice_overrides_generic_guidance !== true || !isStringArray(pack.applicability.material_context_questions)) {
    throw new Error("Ritual content family-practice boundary is incomplete");
  }
  if (pack.applicability.context_pairs) {
    const pairs = pack.applicability.context_pairs.map((pair) => `${pair.observance_slug ?? "*"}|${pair.region_code}|${pair.tradition_code}`);
    if (pairs.length === 0 || new Set(pairs).size !== pairs.length) throw new Error("Ritual content context pairs are empty or duplicated");
    if (pack.applicability.context_pairs.some((pair) => !pack.applicability.region_codes.includes(pair.region_code) || !pack.applicability.tradition_codes.includes(pair.tradition_code))) {
      throw new Error("Ritual content context pair falls outside the declared applicability universe");
    }
    if (pack.applicability.context_pairs.some((pair) => pair.observance_slug && !pack.observance_slugs.includes(pair.observance_slug))) {
      throw new Error("Ritual content context pair references an undeclared observance");
    }
  }
  if (pack.applicability.observance_context_notes) {
    const notes = pack.applicability.observance_context_notes.map((note) => `${note.observance_slug}|${note.language_code}`);
    if (notes.length === 0 || new Set(notes).size !== notes.length) throw new Error("Ritual content observance context notes are empty or duplicated");
    if (pack.applicability.observance_context_notes.some((note) => !pack.observance_slugs.includes(note.observance_slug) || !note.note)) {
      throw new Error("Ritual content observance context note is invalid");
    }
  }
  if (pack.product_status.classification !== "user_complete_lane" || pack.product_status.review_status !== "internal_beta_reviewed") {
    throw new Error("Ritual content is not an internally reviewed user-complete lane");
  }
  if (pack.product_status.open_gaps.length !== 0 || !Object.values(pack.product_status.completed_dimensions).every(Boolean)) {
    throw new Error("Ritual content has an open completion dimension");
  }

  const sourceIds = pack.sources.map((source) => source.source_id);
  if (new Set(sourceIds).size !== sourceIds.length || !sourceIds.length) throw new Error("Ritual content source identity is invalid");
  const knownSourceIds = new Set(sourceIds);
  const assertRefs = (refs: string[]) => {
    if (!isStringArray(refs) || refs.some((sourceId) => !knownSourceIds.has(sourceId))) throw new Error("Ritual content contains an unknown source reference");
  };

  const scopedContent = pack.localized_content.some((content) => content.observance_slugs);
  if (scopedContent && pack.localized_content.some((content) => !content.observance_slugs)) throw new Error("Ritual content cannot mix scoped and unscoped localized lanes");
  if (scopedContent) {
    const coverage = pack.localized_content.flatMap((content) => (content.observance_slugs ?? []).map((slug) => `${slug}|${content.language_code}`));
    const expected = pack.observance_slugs.flatMap((slug) => ["en", "hi"].map((language) => `${slug}|${language}`));
    if (new Set(coverage).size !== coverage.length || JSON.stringify([...coverage].sort()) !== JSON.stringify(expected.sort())) {
      throw new Error("Ritual content scoped language coverage is incomplete or duplicated");
    }
    if (pack.localized_content.some((content) => content.observance_slugs?.some((slug) => !pack.observance_slugs.includes(slug)))) {
      throw new Error("Ritual content localized lane references an undeclared observance");
    }
  } else {
    const languageCodes = pack.localized_content.map((content) => content.language_code);
    if (JSON.stringify([...languageCodes].sort()) !== JSON.stringify(["en", "hi"])) throw new Error("Ritual content must contain exact English and Hindi lanes");
  }
  for (const content of pack.localized_content) {
    assertRefs(content.significance.source_ids);
    if (!content.origin_narratives.length || !content.typical_practices.length || !content.variants.length || !content.safety_and_boundaries.length) {
      throw new Error("Ritual content lacks a user-complete explanatory dimension");
    }
    content.origin_narratives.forEach((item) => assertRefs(item.source_ids));
    content.typical_practices.forEach((item) => assertRefs(item.source_ids));
    content.variants.forEach((item) => assertRefs(item.source_ids));
    if (content.daily_sequence) {
      if (content.daily_sequence.map((entry) => entry.ordinal).join("|") !== content.daily_sequence.map((_, index) => index + 1).join("|")) {
        throw new Error("Ritual content daily sequence ordinals are not contiguous");
      }
      content.daily_sequence.forEach((entry) => {
        if (entry.ritual_requirement !== false) throw new Error("Ritual content daily sequence became a mandatory ritual claim");
        assertRefs(entry.source_ids);
      });
    }
    const tiers = content.procedures.map((procedure) => procedure.tier);
    if (JSON.stringify(tiers) !== JSON.stringify(["minimum", "standard", "elaborate"])) throw new Error("Ritual content procedure tiers drifted");
    for (const procedure of content.procedures) {
      if (!procedure.materials.length || !procedure.steps.length) throw new Error("Ritual content procedure is empty");
      procedure.materials.forEach((material) => assertRefs(material.source_ids));
      procedure.steps.forEach((step, index) => {
        if (step.ordinal !== index + 1) throw new Error("Ritual content step ordinals are not contiguous");
        assertRefs(step.source_ids);
      });
    }
  }
}

function loadPack(entry: (typeof REGISTRY)[number]): { pack: RitualContentPack; sha256: string } {
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, "knowledge_packs", "rituals", entry.fileName));
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  if (sha256 !== entry.sha256) throw new Error(`Ritual content fixity drift: ${entry.laneId}`);
  const pack = JSON.parse(bytes.toString("utf8")) as RitualContentPack;
  assertPack(pack, entry.laneId);
  return { pack, sha256 };
}

export function resolveUserCompleteRitualContent(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  for (const entry of REGISTRY) {
    const { pack, sha256 } = loadPack(entry);
    if (!pack.observance_slugs.includes(request.observanceSlug)) continue;
    if (!pack.applicability.region_codes.includes(request.regionCode) || !pack.applicability.tradition_codes.includes(request.traditionCode)) return null;
    if (pack.applicability.context_pairs && !pack.applicability.context_pairs.some((pair) => pair.region_code === request.regionCode && pair.tradition_code === request.traditionCode && (!pair.observance_slug || pair.observance_slug === request.observanceSlug))) return null;
    const content = pack.localized_content.find((candidate) => candidate.language_code === request.languageCode && candidate.observance_slugs?.includes(request.observanceSlug))
      ?? pack.localized_content.find((candidate) => candidate.language_code === request.languageCode && !candidate.observance_slugs);
    if (!content) return null;
    const observanceContextNote = pack.applicability.observance_context_notes?.find((note) => note.observance_slug === request.observanceSlug && note.language_code === request.languageCode);
    const ganeshaReading = pack.lane_id === "sankashti-chaturthi-west-india-content-v1"
      ? resolveGaneshaReading(request)
      : null;

    return {
      guideId: `${pack.lane_id}-${content.language_code}`,
      companionToObservanceSlug: request.observanceSlug,
      title: content.title,
      languageCode: content.language_code,
      kind: "user_complete_observance_lane",
      summary: content.short_answer,
      familyPracticeNote: observanceContextNote?.note ?? pack.calendar.freshness_note ?? "Follow the responsible family, temple, or community authority for live practice details.",
      contextPrompts: pack.applicability.material_context_questions,
      tiers: content.procedures.map((procedure) => ({
        tier: procedure.tier,
        label: procedure.label,
        estimatedMinutes: procedure.estimated_minutes,
        materials: procedure.materials.map((material) => ({
          item: material.item,
          substitutions: material.substitutions,
          optional: !material.required,
        })),
        steps: procedure.steps.map((step) => ({
          ordinal: step.ordinal,
          instruction: step.instruction,
          why: step.why,
          optional: step.optional,
          sourceIds: step.source_ids,
        })),
      })),
      dailySequence: content.daily_sequence?.map((entry) => ({
        ordinal: entry.ordinal,
        commonName: entry.common_name,
        reflection: entry.reflection,
        ritualRequirement: entry.ritual_requirement,
        sourceIds: entry.source_ids,
        calendarStatus: entry.calendar_status,
        calendarNote: entry.calendar_note,
      })),
      companionReading: ganeshaReading?.status === "source_bounded_companion_available" ? ganeshaReading.guide : null,
      evidence: {
        packId: pack.lane_id,
        packFileSha256: sha256,
        editorialStatus: "internal_beta_research_synthesis",
        sourceTextReturnedByApi: false,
        sources: pack.sources.map((source) => ({
          sourceId: source.source_id,
          title: source.title,
          publisher: source.publisher,
          url: source.url,
          sourceClass: source.source_role,
          rightsLane: source.rights_lane,
        })),
      },
      userCompleteContext: {
        classification: "user_complete_lane",
        shortAnswer: content.short_answer,
        applicability: {
          regionCodes: pack.applicability.region_codes,
          traditionCodes: pack.applicability.tradition_codes,
          settings: pack.applicability.settings,
        },
        timing: {
          kind: pack.calendar.timing_kind,
          liveScheduleRequired: pack.calendar.live_schedule_required,
          freshnessNote: pack.calendar.freshness_note,
          decisionRuleId: pack.calendar.decision_rule_id,
        },
        significance: {
          text: content.significance.text,
          sourceIds: content.significance.source_ids,
          scopeNote: content.significance.scope_note,
        },
        originNarratives: content.origin_narratives.map((item) => ({
          narrativeId: item.narrative_id,
          title: item.title,
          summary: item.summary,
          traditionScope: item.tradition_scope,
          sourceIds: item.source_ids,
        })),
        typicalPractices: content.typical_practices.map((item) => ({
          practiceId: item.practice_id,
          populationScope: item.population_scope,
          description: item.description,
          sourceIds: item.source_ids,
        })),
        variants: content.variants.map((item) => ({
          variantId: item.variant_id,
          dimension: item.scope,
          description: item.difference,
          userDecision: item.difference,
          sourceIds: item.source_ids,
        })),
        safetyAndBoundaries: content.safety_and_boundaries,
      },
      boundaries: {
        minimumStandardElaborateFormsIncluded: true,
        hindiAndEnglishIncluded: true,
        substitutionsIncluded: true,
        familyContextPromptsIncluded: true,
        formalPriestMantrasIncluded: false,
        historicalPrescriptionsPromotedAsModernNorms: false,
        oneUniversalProcedureClaimed: false,
        allRegionalVariantsComplete: false,
        allGaneshotsavDaysComplete: false,
        exactNamedParticipantLaneComplete: true,
        priestLedVidhiIncluded: false,
        householdConsecrationProcedureIncluded: false,
        liveVenueScheduleEmbedded: false,
        bengaliDurgaPujaIncluded: false,
        southIndianGoluIncluded: false,
        gujaratiGarbaIncluded: false,
        nepalDashainIncluded: false,
        continuousFlamePrescribedWithoutSupervision: false,
        sixDayCampaignParticipationAndSourceLabelledDurgaRemembranceSupported: pack.lane_id === "bengal-durga-puja-participant-content-v1",
        bodhanAdhivasNavapatrikaPranapratisthaShodashopacharaAnjaliBhogOrFormalPujaPrescribed: false,
        kumariPujaOrUseOfAChildAsRitualSubjectPrescribed: false,
        animalOrSymbolicBaliHomaOrHarmInstructed: false,
        immersionProcessionWaterEntryOrEnvironmentalOperationInstructed: false,
        shoppingOrPurchaseRequired: false,
        fastingOrMedicalRegimenPrescribed: false,
        financialAdviceIncluded: false,
        preciseMuhurtaCalculated: false,
        yamaDeepamMergedOrCompleted: false,
        noContactFamilyFormSupported: pack.lane_id === "vasu-baras-maharashtra-family-content-v1",
        animalContactFeedingWashingRestrainingOrDecorationInstructed: false,
        flameNearAnimalsInstructed: false,
        cowPurchaseSaleOrGiftRequired: false,
        fastOrDairyWheatAbstentionPrescribed: false,
        medicalVeterinaryOrDietaryAdviceGiven: false,
        giftDonationOrSpendingRequired: false,
        guaranteedProsperityMeritOrFamilyOutcomeClaimed: false,
        outsideHomeEveningLightSupported: pack.lane_id === "yama-deepam-north-west-india-content-v1",
        southFacingDirectionRequired: false,
        fixedLampCountRequired: false,
        lampLeftUnattendedOrBurningOvernight: false,
        guaranteedProtectionOrLongevityOutcomeClaimed: false,
        dhantrayodashiMergedOrCompleted: false,
        maharashtraEarlyBathAndNarakasuraRemembranceSupported: pack.lane_id === "naraka-chaturdashi-maharashtra-content-v1",
        normalSafeBathFallbackSupported: pack.lane_id === "naraka-chaturdashi-maharashtra-content-v1"
          || pack.lane_id === "tamil-deepavali-household-content-v1",
        sesameOilOrUbtanRequiredForEveryone: false,
        karitaCrushingRequired: false,
        fireworksRequiredOrRecommended: false,
        newClothesOrPurchaseRequired: false,
        newPurchaseOrNewClothesRequired: false,
        medicalOrDermatologicalAdviceGiven: false,
        guaranteedAvoidanceOfNarakaOrOtherOutcomeClaimed: false,
        kaliChaudasMergedOrCompleted: false,
        tamilDeepavaliMergedOrCompleted: false,
        preSunriseFamilyBathCoreSupported: pack.lane_id === "tamil-deepavali-household-content-v1",
        sesameOilRequiredForEveryone: false,
        medicalTreatmentOrSuitabilityClaimed: false,
        specificHotWaterOrHerbalFormulaPrescribed: false,
        guaranteedOutcomeClaimed: false,
        northWestNarakaOrLakshmiPujaMerged: false,
        bapsFamilyOrMandirPrayerAndHanumanRemembranceSupported: pack.lane_id === "kali-chaudas-baps-gujarat-content-v1",
        quietReflectionFallbackSupported: pack.lane_id === "kali-chaudas-baps-gujarat-content-v1",
        formalHanumanPujaOrMantrasIncluded: false,
        tantricOccultOrExorcisticInstructionIncluded: false,
        chilliLemonSmokeOrHarmRitualIncluded: false,
        fastOrFixedOfferingPrescribed: false,
        evilForceRemovalOrProtectionGuaranteed: false,
        maharashtraNarakaChaturdashiMerged: false,
        tamilDeepavaliMerged: false,
        bengalKaliPujaMerged: false,
        kingBaliRemembranceAndFamilyTimeSupported: pack.lane_id === "bali-pratipada-maharashtra-content-v1",
        kingBaliRemembranceAndFamilyTimeCoreSupported: pack.lane_id === "bali-pratipada-maharashtra-content-v1",
        wifeToHusbandOrSpouseRiteRequired: false,
        commercialNewYearAccountRitualRequired: false,
        giftOrSpendingRequired: false,
        fastingPrescribed: false,
        oneVamanaBaliTheologyClaimedAsUniversal: false,
        govardhanaOrAnnakutMerged: false,
        gujaratiOrBapsNewYearMerged: false,
        southIndiaBalipadyamiCompleted: false,
        prayerKirtanSimpleVegetarianOfferingSupported: pack.lane_id === "govardhana-puja-iskcon-content-v1",
        goPujaOrCowContactInstructionIncluded: false,
        longOrBarefootParikramaInstructed: false,
        largeFoodArrayRequired: false,
        baliPratipadaMerged: false,
        bapsNewYearSequenceMerged: false,
        siblingTikaPrayerAndSharedFoodSupported: pack.lane_id === "bhai-dooj-north-india-content-v1",
        fixedTilakRecipeRequired: false,
        aratiOrRealFlameRequired: false,
        curseOrTonguePrickingInstructionIncluded: false,
        guaranteedLongevityProtectionOrProsperityClaimed: false,
        genderedProtectionPromiseRequired: false,
        bhauBeejBhaiPhotaBhaiTikaOrBiharYamaDvitiyaCompleted: false,
        bengalKaliPujaHomeTempleAndPublicParticipationSupported: pack.lane_id === "bengal-kali-puja-participant-content-v1",
        homeTempleAndPublicParticipationSupported: pack.lane_id === "bengal-kali-puja-participant-content-v1",
        formalKaliPujaMantrasConsecrationTantricOrInitiatoryPracticeIncluded: false,
        tantricOrInitiatoryInstructionIncluded: false,
        baliInstructionIncluded: false,
        animalOrSymbolicBaliHomaOrHarmInstructedForKaliPuja: false,
        fastingOrAllNightVigilRequiredForKaliPuja: false,
        fastingOrAllNightVigilPrescribed: false,
        liveVenueScheduleCrowdImmersionOrFoodOperationsClaimed: false,
        westIndiaLakshmiPujaMerged: false,
        lakshmiPujaMergedOrCompleted: false,
        bapsPrayerGratitudeGreetingsAndSevaSupported: pack.lane_id === "gujarati-new-year-baps-content-v1",
        oneSimpleHomeOfferingWhenAlreadyEstablishedSupported: pack.lane_id === "gujarati-new-year-baps-content-v1",
        formalAnnakutThalAartiOrMantrasIncluded: false,
        businessAccountBookPujaRequired: false,
        newClothesPurchaseSweetsOrGiftRequired: false,
        wealthSuccessOrProsperityGuaranteed: false,
        baliVamanaRemembranceGenerosityAndFamilyServiceSupported: pack.lane_id === "balipadyami-karnataka-content-v1",
        materialFreeAndFlameFreeFallbackSupported: pack.lane_id === "balipadyami-karnataka-content-v1",
        formalTempleAbhishekaOrMantrasIncluded: false,
        clayOrCowDungBaliRepresentationRequired: false,
        realLampsOrLargeLightDisplayRequired: false,
        fastFoodGiftPurchaseOrSpecialClothingPrescribed: false,
        prosperityOrWelfareGuaranteed: false,
        maharashtraBaliPratipadaMerged: false,
        bapsGujaratiNewYearMerged: false,
        govardhanaPujaMerged: false,
        southIndianBalipadyamiMerged: false,
        guruHargobind52RulersAndCollectiveFreedomSupported: pack.lane_id === "bandi-chhor-sgpc-participant-content-v1",
        formalPaathKirtanArdasHukamnamaOrGurdwaraProgrammeIncluded: false,
        langarPreparationOrFoodHandlingPrescribed: false,
        realLightsCandlesOrFireworksRequired: false,
        hinduDiwaliMerged: false,
        jainDiwaliMerged: false,
        jainLayRemembranceActionable: pack.lane_id === "jain-diwali-lay-remembrance-content-v1",
        mahaviraLiberationAndJainValuesReflectionSupported: pack.lane_id === "jain-diwali-lay-remembrance-content-v1",
        formalPujaMantraStotraScriptureOrPratikramanIncluded: false,
        fastAusterityNirvanLadooOrTempleProcedurePrescribed: false,
        mokshaMeritOrSpiritualOutcomeGuaranteed: false,
        jainSectLanesEquated: false,
        novemberNineAndTenVariantsMerged: false,
        sikhBandiChhorMerged: false,
        allChildrenInclusiveWordingUsed: pack.lane_id === "ahoi-ashtami-north-india-household-content-v1",
        boundedAhoiHouseholdSequenceSupported: pack.lane_id === "ahoi-ashtami-north-india-household-content-v1",
        fastOrNirjalaRegimenPrescribed: false,
        medicalOrDietaryAdviceGiven: false,
        mothersOrWomenOnlyUniversalized: false,
        sonsOnlyWordingAdopted: false,
        oneImageStoryStarOrMoonRuleRequired: false,
        childLongevityProtectionMeritOrSuccessGuaranteed: false,
        ordinaryKarwaChauthHouseholdSequenceSupported: pack.lane_id === "karwa-chauth-north-india-household-content-v1",
        reciprocalAndWiderFamilyParticipationSupported: pack.lane_id === "karwa-chauth-north-india-household-content-v1",
        punjabAndUttarPradeshVariantsRemainDistinct: pack.lane_id === "karwa-chauth-north-india-household-content-v1",
        womenOnlyParticipationUniversalized: false,
        marriedHouseholdOnlyParticipationRequired: false,
        sargiBayaaThaliSieveArghyaOrSpouseFedCloseRequired: false,
        spouseLongevityHealthMarriageProtectionMeritOrSuccessGuaranteed: false,
        fourDayChhathSequenceIncluded: pack.lane_id === "chhath-bihar-purvanchal-participant-content-v1",
        fastingOrNirjalaRegimenPrescribed: false,
        medicalSuitabilityClaimed: false,
        newcomerMinimumFormClaimedEquivalentToFullVrata: false,
        directSunGazingInstructed: false,
        unsafeWaterEntryInstructed: false,
        flameFreeHomeFormSupported: pack.lane_id === "dev-deepawali-varanasi-participant-content-v1",
        varanasiFullMoonGhatLightAndStoryVariantSupported: pack.lane_id === "dev-deepawali-varanasi-participant-content-v1",
        genericKartikaPurnimaOrBapsDevDiwaliMerged: false,
        ritualBathingOrWaterEntryInstructed: false,
        floatingLampsOrRiverOfferingsInstructed: false,
        unattendedFlameOrFireworksRecommended: false,
        boatBookingCrowdRouteAccessOrTravelAdviceGiven: false,
        formalGangaAartiPujaMantraOrPriestLiturgyIncluded: false,
        fastOrDietaryRegimenPrescribed: false,
        sinRemovalPurificationMeritProtectionOrOutcomeGuaranteed: false,
        parvatiShivaRemembranceStorySongPrayerAndServiceSupported: pack.lane_id === "hartalika-teej-north-west-india-participant-content-v1",
        materialFreeAndNonFastingFormSupported: pack.lane_id === "hartalika-teej-north-west-india-participant-content-v1",
        regionalAndFamilyAttributionPreserved: pack.lane_id === "hartalika-teej-north-west-india-participant-content-v1",
        foodDietaryOrMedicalGuidanceGiven: false,
        formalSankalpaKathaPujaMantraOfferingOrClosePrescribed: false,
        womenOnlyOrMarriedHouseholdOnlyParticipationUniversalized: false,
        clothingJewelleryMehendiSwingGiftSweetFlowerOrPurchaseRequired: false,
        marriageSpouseLongevityProgenyFamilyProsperityOrOtherOutcomeGuaranteed: false,
        gowriHabbaOrOtherTeejFestivalsMerged: false,
        allNorthWestNepalAndDiasporaVariantsComplete: false,
        radharaniAppearanceAttributableTeachingSongPrayerKirtanAndSevaSupported: pack.lane_id === "radha-ashtami-iskcon-participant-content-v1",
        officialIskconTempleProgrammeParticipationSupported: pack.lane_id === "radha-ashtami-iskcon-participant-content-v1",
        materialFreeAndNonFastingHomeFormSupported: pack.lane_id === "radha-ashtami-iskcon-participant-content-v1",
        fastFoodDietaryOrMedicalGuidanceGiven: false,
        abhishekaAratiHomaDeityDressingOfferingKalashaFlowerOrFormalPujaPrescribed: false,
        bangaloreProgrammeTimeReusedForAnotherLocation: false,
        sponsorshipDonationPurchaseNewDressOrChappanBhogRequired: false,
        mercyPerfectionProgressProtectionMeritOrOtherOutcomeGuaranteed: false,
        allGaudiyaVaishnavaVaishnavaSmartaAndRegionalTraditionsEquated: false,
        allRadhaAshtamiTraditionsComplete: false,
        attributableGitaReadingReflectionAndActionSupported: pack.lane_id === "gita-jayanti-reading-reflection-content-v1",
        sourceVerseTranslationCommentaryAndApplicationSeparated: pack.lane_id === "gita-jayanti-reading-reflection-content-v1",
        officialGitaJayantiProgrammeParticipationSupported: pack.lane_id === "gita-jayanti-reading-reflection-content-v1",
        materialFreeAndNonFastingGitaStudySupported: pack.lane_id === "gita-jayanti-reading-reflection-content-v1",
        mokshadaEkadashiFastParanaOrTempleVidhiIncluded: false,
        oneTranslationCommentaryOrApplicationUniversalized: false,
        completeGitaRecitationRequired: false,
        sourceTextReturnedOrRepublished: false,
        kurukshetraTravelEventOrCrowdOperationsServed: false,
        mokshaMeritSuccessClarityOrOtherOutcomeGuaranteed: false,
        allGitaTextualRecensionsTranslationsCommentariesAndTraditionsComplete: false,
        sourceBoundedRamaSitaMarriageRemembranceAndPracticalReflectionSupported: pack.lane_id === "vivaha-panchami-north-india-content-v1",
        janakpurAyodhyaAndOrchhaContextsKeptDistinct: pack.lane_id === "vivaha-panchami-north-india-content-v1",
        formalWeddingReenactmentPujaMantraOfferingProcessionOrVowPrescribed: false,
        marriageSpouseFertilityProgenyProsperityMeritOrOtherOutcomeGuaranteed: false,
        oneRamayanaEditionStoryInterpretationOrPracticeClaimedUniversal: false,
        publicEventOperationsOrTravelSafetyClaimedCurrent: false,
        nineteenPitruPakshaCalendarLabelsSupported: pack.lane_id === "pitru-paksha-delhi-remembrance-content-v1",
        personalRemembranceAndFormalPracticePreparationSupported: pack.lane_id === "pitru-paksha-delhi-remembrance-content-v1",
        personalDeathTithiPerformerOrFormalShraddhaProcedureResolved: false,
        formalShraddhaTarpanaPindaMantraFoodDonationOrTimingPrescribed: false,
        tamilMahalayaAmavasaiTharpanamMerged: false,
        pitruDoshaCurseLiberationProsperityOrAncestorSatisfactionGuaranteed: false,
        recurringSevenNamedEkadashisSupported: pack.lane_id === "ekadashi-recurring-devotional-content-v1",
        smartaAndIskconCalendarLanesKeptSeparate: pack.lane_id === "ekadashi-recurring-devotional-content-v1",
        materialFreeAndNonFastingEkadashiFormSupported: pack.lane_id === "ekadashi-recurring-devotional-content-v1",
        foodOrDietaryRulesGiven: false,
        smartaParanaServed: false,
        iskconParanaRepeatedByPracticeGuide: false,
        smartaAndVaishnavaPracticesEquated: false,
        namedEkadashiMeaningsStoriesOrOutcomesUniversalized: false,
        sinRemovalMeritLiberationHealthProsperityOrOtherOutcomeGuaranteed: false,
        mokshadaGitaJayantiGuideMergedOrReplaced: false,
        smartaAndIskconLaneNotesSeparate: pack.lane_id === "krishna-janmashtami-smarta-iskcon-content-v1",
        sharedJanmashtamiDevotionalCoreSupported: pack.lane_id === "krishna-janmashtami-smarta-iskcon-content-v1",
        materialFlameFoodAndNonFastingFormSupported: pack.lane_id === "krishna-janmashtami-smarta-iskcon-content-v1",
        attributableReadingBhajanKirtanAndOfficialStreamSupported: pack.lane_id === "krishna-janmashtami-smarta-iskcon-content-v1",
        midnightVigilOrExactMuhurtaRequired: false,
        abhishekaAartiOfferingCradleMurtiDressingOrFootprintsRequired: false,
        dahiHandiParticipationOrHumanPyramidInstructed: false,
        paranaOrNextDayCloseServed: false,
        smartaAndIskconRulesEquated: false,
        blessingProtectionMeritProsperityOrOtherOutcomeGuaranteed: false,
        generalAndBapsLanesSeparate: pack.lane_id === "tulasi-vivah-general-baps-content-v1",
        plantFreeAndFlameFreeFallbackSupported: pack.lane_id === "tulasi-vivah-general-baps-content-v1",
        formalPriestMantraSankalpaKanyadanOrWeddingLiturgyIncluded: false,
        medicalHerbalFertilityMarriageOrProsperityAdviceGiven: false,
        plantPluckingPruningIngestionOverwateringOrChemicalDecorationInstructed: false,
        purchaseGiftDowryNewPlantOrNewImageRequired: false,
        realWorldMarriageOrGenderRolePrescribed: false,
        outcomeGuaranteed: false,
        allSevenVarasIncluded: pack.lane_id === "weekday-practice-west-india-content-v1",
        astrologicalRemediesPrescribed: false,
        planetaryAppeasementPrescribed: false,
        directSunGazingSuggested: false,
        oneUniversalWeekdayMappingClaimed: false,
        northIndiaWeekdayLaneComplete: false,
        southIndiaWeekdayLaneComplete: false,
        eastIndiaWeekdayLaneComplete: false,
        fourLaunchMonthSankashtiLanesSupported: pack.lane_id === "sankashti-chaturthi-west-india-content-v1",
        sourceBoundedGaneshaCompanionReadingIncluded: pack.lane_id === "sankashti-chaturthi-west-india-content-v1",
        materialFreeAndFlameFreeSankashtiFormSupported: pack.lane_id === "sankashti-chaturthi-west-india-content-v1",
        runtimeLocationSpecificMoonriseRequired: pack.lane_id === "sankashti-chaturthi-west-india-content-v1",
        providerCityMoonriseReusedForUserLocation: false,
        oneMonthlyNameKathaOrPujaSequenceUniversalized: false,
        moonSightingTempleVisitOfferingMantraArghyaOrFoodRequired: false,
        obstacleRemovalSuccessProtectionMeritOrOtherOutcomeGuaranteed: false,
        ganeshChaturthiOrKarwaChauthMerged: false,
        fourMonthCalendarLaneAndSourceLabelledDurgaRemembranceSupported: pack.lane_id === "masika-durgashtami-north-west-content-v1",
        materialFreeAndNonFastingMonthlyDurgaFormSupported: pack.lane_id === "masika-durgashtami-north-west-content-v1",
        formalPujaMantraImageOfferingAartiChandiRecitationOrHomaPrescribed: false,
        kumariPujaBaliOrHarmInstructed: false,
        shardiyaMahashtamiEquatedWithEveryMonthlyAshtami: false,
        bengalDurgaPujaOrOtherRegionalAshtamiImported: false,
        victoryProtectionMeritProsperityOrOtherOutcomeGuaranteed: false,
        oneDeviStoryTheologyOrPracticeClaimedUniversal: false,
        fourLaunchMonthMasikaShivaratriLanesSupported: pack.lane_id === "masika-shivaratri-north-west-india-content-v1",
        northAndWestSmartaMasikaShivaratriPairsSupported: pack.lane_id === "masika-shivaratri-north-west-india-content-v1",
        materialFlameAndNonFastingShivaFormSupported: pack.lane_id === "masika-shivaratri-north-west-india-content-v1",
        templeLedMonthlyShivaratriPreservedAsAttributable: pack.lane_id === "masika-shivaratri-north-west-india-content-v1",
        abhishekaIngredientsOrHomeLingamProcedurePrescribed: false,
        formalMantraCountAartiOrPriestlySequenceIncluded: false,
        nightVigilRequired: false,
        paranaServed: false,
        annualMahashivaratriPracticeUniversalizedMonthly: false,
        peacePurificationProtectionMeritMarriageProsperityOrOtherOutcomeGuaranteed: false,
        eightLaunchWindowPradoshaLanesSupported: pack.lane_id === "pradosha-north-west-content-v1",
        krishnaAndShuklaPakshaPradoshaKeptDistinct: pack.lane_id === "pradosha-north-west-content-v1",
        materialFreeAndNonFastingPradoshaFormSupported: pack.lane_id === "pradosha-north-west-content-v1",
        regionalAndInstitutionalPradoshaContextsPreservedAsAttributable: pack.lane_id === "pradosha-north-west-content-v1",
        weekdayPlanetaryRemedyOrSpecialOutcomePrescribed: false,
        rudrabhishekamLingamNandiMantraOfferingAartiOrPradakshinaPrescribed: false,
        pujaMuhurtaOrParanaServed: false,
        sevenResolvedCalendarDaySlugsSupported: pack.lane_id === "purnima-amavasya-north-west-india-content-v1",
        purnimaAndAmavasyaGuidesDistinct: pack.lane_id === "purnima-amavasya-north-west-india-content-v1",
        materialFreeAndNonFastingFormsSupported: pack.lane_id === "purnima-amavasya-north-west-india-content-v1",
        coincidentSpecialObservancesRemainSeparate: pack.lane_id === "purnima-amavasya-north-west-india-content-v1",
        shraddhaTarpanDarshaOrAncestorRitePrescribed: false,
        ritualBathingMoonWorshipOfferingMantraOrTempleProcedurePrescribed: false,
        kojagaraDevDeepawaliDiwaliOrOtherSpecialFestivalMerged: false,
        margashirshaPurnimaPromoted: false,
        purificationProtectionMeritAncestorBenefitProsperityOrOtherOutcomeGuaranteed: false,
        attributableAnantaVishnuRemembranceReflectionAndResponsibleCommitmentSupported: pack.lane_id === "ananta-chaturdashi-north-west-content-v1",
        anantaVrataAndGaneshVisarjanKeptSeparate: pack.lane_id === "ananta-chaturdashi-north-west-content-v1",
        priorAndFreshProviderHashesWithSemanticDeltaRetained: pack.lane_id === "ananta-chaturdashi-north-west-content-v1",
        formalAnantaPujaKalashaSerpentImageMantraOfferingOrHomaPrescribed: false,
        fourteenKnotThreadTyingRemovalOrRetentionPrescribed: false,
        ganeshImmersionImportedIntoAnantaGuide: false,
        wealthProsperityRecoveryLostKingdomMeritProtectionOrOtherOutcomeGuaranteed: false,
        attributableShivaBhairavaRemembranceCourageDisciplineResponsibilityAndSafeTempleParticipationSupported: pack.lane_id === "kalabhairava-jayanti-north-kashi-content-v1",
        northMargashirshaAndSouthKartikaMonthNamesPreserved: pack.lane_id === "kalabhairava-jayanti-north-kashi-content-v1",
        formalPujaMantraTantraOfferingThreadOilOrClosePrescribed: false,
        alcoholMeatAnimalOfferingOrHarmInstructed: false,
        fearOccultExorcismOrProtectionRitePrescribed: false,
        nightVigilOrUnsafeTravelRequired: false,
        kashiTemplePracticeUniversalized: false,
        fearProtectionLiberationMeritProsperityOrOtherOutcomeGuaranteed: false,
        attributableLakshmiKrishnaRaasHarvestMusicPrayerAndCommunityContextSupported: pack.lane_id === "kojagara-sharad-purnima-north-west-content-v1",
        foodIfFamilyEstablishedTreatedAsOptionalAndNotMedicine: pack.lane_id === "kojagara-sharad-purnima-north-west-content-v1",
        formalLakshmiPujaAratiDeepdaanOfferingOrMoonWorshipPrescribed: false,
        medicinalCurativeOrHealthBenefitFromMoonlightOrFoodClaimed: false,
        gamblingDiceCardsOrBettingRecommended: false,
        unattendedFlameUnsafeOutdoorFoodOrUnsafeMoonViewingRecommended: false,
        wealthProsperityHealthProtectionMeritOrOtherOutcomeGuaranteed: false,
        bengalKojagariLakshmiPujaMerged: false,
        nextDayAshwinaPurnimaCalendarLaneMerged: false,
        saptarishiRemembranceAttributableStudyTeacherGratitudeAndServiceSupported: pack.lane_id === "rishi-panchami-saptarishi-reflection-content-v1",
        multipleSaptarishiListsAndSourceLayersAcknowledged: pack.lane_id === "rishi-panchami-saptarishi-reflection-content-v1",
        formalPujaMantraOfferingBathIngestionOrClosePrescribed: false,
        menstruationOrPersonDescribedAsImpure: false,
        rajaswalaDoshaAtonementOrGuiltPromoted: false,
        bhaiPanchamiMerged: false,
        purificationForgivenessMeritHealthProtectionOrOtherOutcomeGuaranteed: false,
      },
    };
  }
  return null;
}
