import { getHeroJourney } from "../../data/hero-experiences";
import type { EvidenceCitation } from "../sarthi/contracts";
import type { ExperienceCitation, HeroSlug } from "../domain/experience";

type HeroSearchResult = {
  id: string;
  title: string;
  statement: string;
  languageCode: "en" | "hi";
  claimKind: "source_bounded_structure" | "evidence_bounded_synthesis";
  citations: EvidenceCitation[];
  sourceBoundary: string;
};

const hindiStatements: Record<string, string> = {
  "bala-kanda": "इस एक संस्कृत इलेक्ट्रॉनिक पाठ का पहला स्रोत-सम्बद्ध काण्ड और उसका आरम्भिक सर्ग।",
  "ayodhya-kanda": "इस पाठ में अयोध्याकाण्ड अपनी अलग पुस्तक और स्रोत-सीमा के साथ सुरक्षित है।",
  "aranya-kanda": "अरण्यकाण्ड को इस पाठ में एक अलग पुस्तक और सर्ग-क्षेत्र के रूप में रखा गया है।",
  "kishkindha-kanda": "किष्किन्धाकाण्ड इस पाठ की चौथी अलग पुस्तक है; इसे पूरी कथा में मिलाया नहीं गया।",
  "sundara-kanda": "सुन्दरकाण्ड की आरम्भिक स्रोत-सीमा इस पाठ में 190 पद्य-समूहों वाला पहला सर्ग रखती है।",
  "yuddha-kanda": "युद्धकाण्ड इस पाठ की छठी अलग स्रोत-सम्बद्ध पुस्तक है।",
  "uttara-kanda": "उत्तरकाण्ड इस एक पाठ के सात-काण्ड मार्ग का समापन करता है; यह व्यापक रामायण-परम्परा की पूर्णता नहीं।",
  "context-opening": "अध्याय 81 उस प्रसंग का आरम्भ रखता है जिसमें देवीमाहात्म्य का क्रम सुरक्षित है।",
  "proper-opening": "अलग Pargiter विषय-सूची प्रमाण के अनुसार अध्याय 82 देवीमाहात्म्य के मुख्य काव्य का आरम्भ है।",
  "last-proper-canto": "अध्याय 92 मुख्य काव्य के अंतिम अध्याय की स्रोत-सीमा रखता है।",
  "context-close": "अध्याय 93 समापन-कथा और इस पाठ का अंतिम देवीमाहात्म्य सूत्र रखता है।",
  "vasubaras": "यह सीमित पश्चिम भारत दीपावली पथ गोवत्स द्वादशी या वसुबारस से आरम्भ होता है; इसकी घरेलू विधि अभी पूर्ण नहीं है।",
  "dhantrayodashi": "यह पथ धनत्रयोदशी, धन्वन्तरि परम्परा और यम दीपम को एक ही अनिवार्य विधि मानने के बजाय अलग रखता है।",
  "naraka-chaturdashi": "नरक चतुर्दशी, काली चौदस और दक्षिण भारतीय दीपावली को इस पथ में अलग क्षेत्रीय परम्पराओं के रूप में रखा गया है।",
  "lakshmi-pujan": "इस सीमित पथ में लक्ष्मी पूजन ही अभी पूर्ण-सीमा वाली घरेलू विधि है; यह सभी दीपावली परम्पराओं की सार्वभौमिक विधि नहीं है।",
  "bali-govardhan": "महाराष्ट्र का बली प्रतिपदा या पाडवा और वैष्णव गोवर्धन या अन्नकूट एक ही तिथि पर हो सकते हैं, पर वे एक ही परम्परा नहीं हैं।",
  "bhau-beej": "यह पथ भाई दूज, भाऊ बीज और यम द्वितीया के पारिवारिक तथा क्षेत्रीय रूपों को अलग और उत्तरदायी रखता है।",
};

const keywords: Record<string, string[]> = {
  "bala-kanda": ["bala", "bāla", "बाल"],
  "ayodhya-kanda": ["ayodhya", "ayodhyā", "अयोध्या"],
  "aranya-kanda": ["aranya", "araṇya", "अरण्य"],
  "kishkindha-kanda": ["kishkindha", "kiṣkindhā", "किष्किन्धा", "किष्किंधा"],
  "sundara-kanda": ["sundara", "सुन्दर", "सुंदर"],
  "yuddha-kanda": ["yuddha", "युद्ध"],
  "uttara-kanda": ["uttara", "उत्तर"],
  "context-opening": ["chapter 81", "canto 81", "अध्याय 81"],
  "proper-opening": ["chapter 82", "canto 82", "अध्याय 82", "proper opening"],
  "last-proper-canto": ["chapter 92", "canto 92", "अध्याय 92"],
  "context-close": ["chapter 93", "canto 93", "अध्याय 93", "closing frame"],
  "vasubaras": ["vasubaras", "vasu baras", "govatsa", "गोवत्स", "वसुबारस"],
  "dhantrayodashi": ["dhanteras", "dhantrayodashi", "dhanatrayodashi", "yama deepam", "धनतेरस", "धनत्रयोदशी", "यम दीप"],
  "naraka-chaturdashi": ["naraka chaturdashi", "kali chaudas", "south indian deepavali", "नरक चतुर्दशी", "काली चौदस"],
  "lakshmi-pujan": ["lakshmi puja", "lakshmi pujan", "लक्ष्मी पूजा", "लक्ष्मी पूजन"],
  "bali-govardhan": ["bali pratipada", "padwa", "govardhan", "annakut", "बली प्रतिपदा", "पाडवा", "गोवर्धन", "अन्नकूट"],
  "bhau-beej": ["bhai dooj", "bhau beej", "yama dvitiya", "भाई दूज", "भाऊ बीज", "यम द्वितीया"],
};

function citation(value: ExperienceCitation): EvidenceCitation {
  return {
    passageId: `sha256:${value.sourceSha256}:span:${value.spanSha256}`,
    sourceObjectId: value.sourceSha256,
    sourceOrdinal: value.sourceOrdinal,
    workTitle: value.workTitle,
    editionTitle: value.editionTitle,
    locator: { ...value.locator, span_sha256: value.spanSha256 },
    rightsLane: value.rightsLane === "derivative_allowed" ? "derivative_allowed" : "citation_only",
  };
}

function includesAny(value: string, needles: string[]) {
  return needles.some((needle) => value.includes(needle));
}

export function searchHeroStructures(query: string, languageCode?: string): HeroSearchResult[] {
  const normalized = query.trim().toLocaleLowerCase("en");
  if (normalized.length < 2 || normalized.length > 512) return [];
  const hindi = languageCode?.toLowerCase().startsWith("hi") === true || /[\u0900-\u097f]/.test(query);
  const hero: Exclude<HeroSlug, "ganesha"> | null = includesAny(normalized, ["ramayana", "rāmāyaṇa", "valmiki", "vālmīki", "रामायण", "वाल्मीकि"])
    ? "ramayana"
    : includesAny(normalized, ["durga", "devi", "devīmāhātmya", "devimahatmya", "markandeya", "दुर्गा", "देवी", "देवीमाहात्म्य", "मार्कण्डेय"])
      ? "durga"
      : includesAny(normalized, ["diwali", "deepavali", "dipavali", "dhanteras", "dhantrayodashi", "naraka chaturdashi", "kali chaudas", "lakshmi puja", "lakshmi pujan", "bali pratipada", "govardhan", "annakut", "bhai dooj", "bhau beej", "yama dvitiya", "दीवाली", "दिवाली", "दीपावली", "धनतेरस", "धनत्रयोदशी", "नरक चतुर्दशी", "काली चौदस", "लक्ष्मी पूजा", "गोवर्धन", "अन्नकूट", "भाई दूज", "भाऊ बीज"])
        ? "diwali" : null;
  if (!hero) return [];
  if (hero === "ramayana" && includesAny(normalized, [
    "manmatha", "dutt", "griffith", "tulsidas", "ramcharitmanas", "kamba",
    "kampan", "krittivasi", "adhyatma ramayana", "jain ramayana", "buddhist ramayana",
  ])) return [];
  const journey = getHeroJourney(hero);
  if (!journey) return [];
  const specific = journey.stops.filter((stop) => includesAny(normalized, keywords[stop.id] ?? []));
  const stops = specific.length ? specific : journey.stops;
  return stops.map((stop) => ({
    id: `${hero}-${stop.id}-source-structure-${hindi ? "hi" : "en"}`,
    title: stop.title,
    statement: hindi ? hindiStatements[stop.id] : stop.summary,
    languageCode: hindi ? "hi" : "en",
    claimKind: hero === "diwali" ? "evidence_bounded_synthesis" : "source_bounded_structure",
    citations: [citation(stop.citation)],
    sourceBoundary: journey.sourceBoundary,
  }));
}
