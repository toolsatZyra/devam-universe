const PITRU_PAKSHA_2026_DAYS = [
  ["2026-09-26", [{ en: "Purnima Shraddha", hi: "पूर्णिमा श्राद्ध" }]],
  ["2026-09-27", [{ en: "Pratipada Shraddha", hi: "प्रतिपदा श्राद्ध" }]],
  ["2026-09-28", [{ en: "Dwitiya Shraddha", hi: "द्वितीया श्राद्ध" }]],
  ["2026-09-29", [{ en: "Tritiya Shraddha", hi: "तृतीया श्राद्ध" }, { en: "Maha Bharani", hi: "महा भरणी" }]],
  ["2026-09-30", [{ en: "Chaturthi Shraddha", hi: "चतुर्थी श्राद्ध" }, { en: "Panchami Shraddha", hi: "पञ्चमी श्राद्ध" }]],
  ["2026-10-01", [{ en: "Shashthi Shraddha", hi: "षष्ठी श्राद्ध" }]],
  ["2026-10-02", [{ en: "Saptami Shraddha", hi: "सप्तमी श्राद्ध" }]],
  ["2026-10-03", [{ en: "Ashtami Shraddha", hi: "अष्टमी श्राद्ध" }]],
  ["2026-10-04", [{ en: "Navami Shraddha", hi: "नवमी श्राद्ध" }]],
  ["2026-10-05", [{ en: "Dashami Shraddha", hi: "दशमी श्राद्ध" }]],
  ["2026-10-06", [{ en: "Ekadashi Shraddha", hi: "एकादशी श्राद्ध" }]],
  ["2026-10-07", [{ en: "Dwadashi Shraddha", hi: "द्वादशी श्राद्ध" }, { en: "Magha Shraddha", hi: "मघा श्राद्ध" }]],
  ["2026-10-08", [{ en: "Trayodashi Shraddha", hi: "त्रयोदशी श्राद्ध" }]],
  ["2026-10-09", [{ en: "Chaturdashi Shraddha", hi: "चतुर्दशी श्राद्ध" }]],
  ["2026-10-10", [{ en: "Sarva Pitru Amavasya", hi: "सर्वपितृ अमावस्या" }]],
] as const;

export type RitualSeasonDay = {
  contextId: "devam-pitru-paksha-delhi-2026-v1";
  title: "Mahalaya / Pitru Paksha";
  civilDate: string;
  ordinal: number;
  totalDays: 15;
  labels: readonly { en: string; hi: string }[];
  status: "calendar_context_only";
  displayNote: string;
  boundarySummary: string;
  evidence: {
    fixtureSha256: "d88a379b5bec6f73801d486e0133767593b19dd882b530ebad43ef33bfe86f22";
    fixedSourceSha256: "a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b";
    fixedSourcePdfPages: readonly [163, 164, 165, 166, 167, 168, 169, 170];
  };
  denials: {
    personalAncestorApplicabilityResolved: false;
    ritualProcedureResolved: false;
    universalIndiaCalendarClaim: false;
  };
};

export function resolveRitualSeasonDay(input: {
  civilDate: string;
  traditionCode: string;
}): RitualSeasonDay | null {
  if (input.traditionCode !== "smarta-north-india") return null;
  const index = PITRU_PAKSHA_2026_DAYS.findIndex(([civilDate]) => civilDate === input.civilDate);
  if (index < 0) return null;

  return {
    contextId: "devam-pitru-paksha-delhi-2026-v1",
    title: "Mahalaya / Pitru Paksha",
    civilDate: input.civilDate,
    ordinal: index + 1,
    totalDays: 15,
    labels: PITRU_PAKSHA_2026_DAYS[index][1],
    status: "calendar_context_only",
    displayNote: "This is the Delhi 2026 calendar context only. It does not decide which ancestor, death tithi, performer, offering, timing, or family procedure applies to you.",
    boundarySummary: "This date is inside the bounded Delhi Mahalaya/Pitru Paksha calendar lane. Personal applicability and ritual procedure remain unresolved and should follow your family or sampradaya practice.",
    evidence: {
      fixtureSha256: "d88a379b5bec6f73801d486e0133767593b19dd882b530ebad43ef33bfe86f22",
      fixedSourceSha256: "a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b",
      fixedSourcePdfPages: [163, 164, 165, 166, 167, 168, 169, 170],
    },
    denials: {
      personalAncestorApplicabilityResolved: false,
      ritualProcedureResolved: false,
      universalIndiaCalendarClaim: false,
    },
  };
}
