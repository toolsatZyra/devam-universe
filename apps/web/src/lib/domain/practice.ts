export type PracticeGuidanceRequest = {
  observanceSlug: string;
  languageCode: "en" | "hi";
  regionCode: string;
  traditionCode: string;
};

export type PracticeGuideStep = {
  ordinal: number;
  instruction: string;
  rationale: string;
  optional: boolean;
  sourceClaimKey: string | null;
  sourceOrdinals: number[];
};

export type SourceBoundedPracticeGuide = {
  guideId: string;
  companionToObservanceSlug: string;
  title: string;
  languageCode: "en" | "hi";
  kind: "optional_source_bounded_devotional_reading";
  summary: string;
  familyPracticeNote: string;
  steps: PracticeGuideStep[];
  evidence: {
    packId: string;
    packFileSha256: string;
    packCanonicalSha256: string;
    sourceObjectSha256: string;
    rightsLane: "derivative_allowed";
    sourceTextReturnedByApi: false;
  };
  boundaries: {
    formalPujaVidhiIncluded: false;
    minimumStandardElaborateProcedureIncluded: false;
    completeRitualGuidance: false;
    universalPracticeClaim: false;
  };
};

export type RitualProcedureMaterial = {
  item: string;
  substitutions: string[];
  optional: boolean;
};

export type RitualProcedureStep = {
  ordinal: number;
  instruction: string;
  why: string;
  optional: boolean;
  sourceIds: string[];
};

export type RitualProcedureTier = {
  tier: "minimum" | "standard" | "elaborate";
  label: string;
  estimatedMinutes: number;
  materials: RitualProcedureMaterial[];
  steps: RitualProcedureStep[];
};

export type RitualDailySequenceEntry = {
  ordinal: number;
  commonName: string;
  reflection: string;
  ritualRequirement: false;
  sourceIds: string[];
  calendarStatus?: "resolved_for_bounded_2026_context" | "partially_resolved_distinct_lanes" | "editorial_sequence_only";
  calendarNote?: string;
};

export type RitualProcedureGuide = {
  guideId: string;
  companionToObservanceSlug: string;
  title: string;
  languageCode: "en" | "hi";
  kind: "contextual_minimum_standard_elaborate_ritual_procedure" | "user_complete_observance_lane";
  summary: string;
  familyPracticeNote: string;
  contextPrompts: string[];
  tiers: RitualProcedureTier[];
  dailySequence?: RitualDailySequenceEntry[];
  userCompleteContext?: {
    classification: "user_complete_lane";
    shortAnswer: string;
    applicability: {
      regionCodes: string[];
      traditionCodes: string[];
      settings: string[];
    };
    timing: {
      kind: string;
      liveScheduleRequired: boolean;
      freshnessNote: string | null;
      decisionRuleId: string | null;
    };
    significance: {
      text: string;
      sourceIds: string[];
      scopeNote: string;
    };
    originNarratives: {
      narrativeId: string;
      title: string;
      summary: string;
      traditionScope: string;
      sourceIds: string[];
    }[];
    typicalPractices: {
      practiceId: string;
      populationScope: string;
      description: string;
      sourceIds: string[];
    }[];
    variants: {
      variantId: string;
      dimension: string;
      description: string;
      userDecision: string;
      sourceIds: string[];
    }[];
    safetyAndBoundaries: string[];
  };
  companionReading: SourceBoundedPracticeGuide | null;
  evidence: {
    packId: string;
    packFileSha256: string;
    editorialStatus: "internal_beta_research_synthesis";
    sourceTextReturnedByApi: false;
    sources: {
      sourceId: string;
      title: string;
      publisher: string;
      url: string | null;
      sourceClass: string;
      rightsLane: "reference_only" | "private_evidence" | "product_cleared" | "derivative_allowed" | "citation_only" | "internal_only" | "catalogued_lead";
    }[];
  };
  boundaries: {
    minimumStandardElaborateFormsIncluded: true;
    hindiAndEnglishIncluded: true;
    substitutionsIncluded: true;
    familyContextPromptsIncluded: true;
    formalPriestMantrasIncluded: false;
    historicalPrescriptionsPromotedAsModernNorms: false;
    oneUniversalProcedureClaimed: false;
    allRegionalVariantsComplete: false;
    allGaneshotsavDaysComplete: false;
    [key: string]: boolean;
  };
};

export type PracticeGuidanceResult =
  | { ok: true; status: "ritual_procedure_available"; request: PracticeGuidanceRequest; guide: RitualProcedureGuide }
  | { ok: true; status: "source_bounded_companion_available"; request: PracticeGuidanceRequest; guide: SourceBoundedPracticeGuide }
  | { ok: true; status: "no_supported_guide_for_context"; request: PracticeGuidanceRequest; guide: null };
