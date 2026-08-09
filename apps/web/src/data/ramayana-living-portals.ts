import type { RitualProcedureGuide } from "../lib/domain/practice";
import type { StoryLivingPortal, StoryLivingPracticeLane } from "../lib/domain/story-world";
import { resolveUserCompleteRitualContent } from "../lib/practice/ritual-content";
import { RAMAYANA_LIVING_LANE_SPECS, type RamayanaLivingLaneSpec } from "./ramayana-living-portal-contract";

function resolveGuide(spec: RamayanaLivingLaneSpec, languageCode: "en" | "hi"): RitualProcedureGuide {
  const guide = resolveUserCompleteRitualContent({ ...spec.request, languageCode });
  if (!guide?.userCompleteContext) throw new Error(`Missing user-complete ${spec.id}/${languageCode} living-practice lane`);
  return guide;
}

function compileLane(spec: RamayanaLivingLaneSpec, languageCode: "en" | "hi"): StoryLivingPracticeLane {
  const guide = resolveGuide(spec, languageCode);
  const minimum = guide.tiers.find((tier) => tier.tier === "minimum");
  if (!minimum) throw new Error(`Missing minimum ${spec.id}/${languageCode} living-practice form`);
  const context = guide.userCompleteContext!;
  return {
    id: spec.id,
    nodeId: spec.nodeId,
    crop: spec.crop,
    region: spec.region[languageCode],
    title: guide.title,
    summary: guide.summary,
    significance: context.significance.text,
    originStory: context.originNarratives[0]?.summary ?? context.significance.text,
    typicalPractices: context.typicalPractices.map((practice) => practice.description),
    minimumForm: {
      label: minimum.label,
      estimatedMinutes: minimum.estimatedMinutes,
      materials: minimum.materials.map((material) => material.item),
      steps: minimum.steps.map((step) => step.instruction),
    },
    familyPracticeNote: guide.familyPracticeNote,
    evidence: {
      packId: guide.evidence.packId,
      packFileSha256: guide.evidence.packFileSha256,
      sourceCount: guide.evidence.sources.length,
    },
  };
}

export function buildRamayanaLivingPortal(nodeId: string, languageCode: "en" | "hi"): StoryLivingPortal | null {
  if (nodeId !== "diwali") return null;
  return {
    id: "ramayana-diwali-living-bridge-v1",
    nodeId,
    languageCode,
    title: languageCode === "hi" ? "घर-वापसी से जीवंत दीपावली तक" : "From homecoming to living Diwali",
    invitation: languageCode === "hi"
      ? "रामायण की एक घर-वापसी परंपरा से आज परिवारों और समुदायों द्वारा निभाए जाने वाले अलग-अलग दीपावली मार्गों में प्रवेश करें।"
      : "Cross from one Ramayana homecoming tradition into the different ways families and communities live the season today.",
    storyConnection: languageCode === "hi"
      ? "राम, सीता और लक्ष्मण की अयोध्या वापसी उत्तर भारत की दीपावली से जुड़ी एक प्रमुख कथा है। यह इस पर्व-समय का एक प्रवेश-द्वार है—हर दीपावली या डीपावली की सार्वभौमिक उत्पत्ति नहीं।"
      : "Rama, Sita, and Lakshmana's return to Ayodhya is a major North Indian Diwali story association. It is one doorway into the season—not a universal origin for every Diwali or Deepavali.",
    evidenceBoundary: languageCode === "hi"
      ? "नीचे हर जीवंत मार्ग अपना क्षेत्र, परंपरा, स्रोत-पैक, प्रयोज्यता, विकल्प और सुरक्षा-सीमा अलग रखता है। अपने परिवार या समुदाय से मेल खाने वाला मार्ग चुनें; किसी को भी पूरे भारत का मानक नहीं कहा गया है।"
      : "Each living lane below keeps its own region, tradition, source pack, applicability, substitutions, and safety boundary. Choose the lane that fits your family or community; none is presented as the Indian default.",
    asset: "/journeys/diwali-living-worlds-v1.webp",
    lanes: RAMAYANA_LIVING_LANE_SPECS.map((spec) => compileLane(spec, languageCode)),
  };
}
