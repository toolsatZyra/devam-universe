import type { PracticeGuidanceRequest } from "../lib/domain/practice";
import type { StoryLivingPracticeLane } from "../lib/domain/story-world";

export type RamayanaLivingLaneSpec = {
  id: string;
  nodeId: string;
  crop: StoryLivingPracticeLane["crop"];
  region: { en: string; hi: string };
  request: Omit<PracticeGuidanceRequest, "languageCode">;
};

export const RAMAYANA_LIVING_LANE_SPECS: RamayanaLivingLaneSpec[] = [
  {
    id: "west-india-lakshmi-puja",
    nodeId: "lakshmi-puja",
    crop: "left",
    region: { en: "West India · household lane", hi: "पश्चिम भारत · पारिवारिक मार्ग" },
    request: { observanceSlug: "diwali-lakshmi-puja", regionCode: "west-india", traditionCode: "smarta-west-india" },
  },
  {
    id: "bengal-kali-puja",
    nodeId: "kali-puja",
    crop: "centre",
    region: { en: "Bengal · participant lane", hi: "बंगाल · सहभागी मार्ग" },
    request: { observanceSlug: "bengal-kali-puja", regionCode: "bengal", traditionCode: "shakta-bengal" },
  },
  {
    id: "tamil-deepavali",
    nodeId: "tamil-deepavali",
    crop: "right",
    region: { en: "Tamil Nadu · family dawn lane", hi: "तमिलनाडु · पारिवारिक प्रभात मार्ग" },
    request: { observanceSlug: "tamil-deepavali-naraka-chaturdashi", regionCode: "south-india", traditionCode: "smarta-south-india" },
  },
];

export const RAMAYANA_LIVING_PORTAL_NODE_IDS = ["diwali"];
export const RAMAYANA_LIVING_ROUTE_ROOT_IDS = [
  ...RAMAYANA_LIVING_LANE_SPECS.map((lane) => lane.nodeId),
  "kalighat-kali-temple",
];

/**
 * One authored onward route per living lane keeps this story slice navigable
 * without copying each node's full global-Atlas neighborhood into the client.
 */
export const RAMAYANA_LIVING_ROUTE_EDGE_IDS_BY_NODE: Record<string, string[]> = {
  "lakshmi-puja": ["lakshmi-to-kali"],
  "kali-puja": ["kali-puja-to-kalighat-temple"],
  "tamil-deepavali": ["naraka-to-tamil"],
  "kalighat-kali-temple": ["kalighat-temple-to-durga-puja"],
};
