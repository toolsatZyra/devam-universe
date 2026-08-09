"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import type { HeroJourney, JourneyStop } from "@/lib/domain/experience";
import { canGuestAskSarthi } from "@/lib/account/guest-preview";
import {
  JOURNEY_CAMERA_DEFAULT,
  JOURNEY_CAMERA_MAX_SCALE,
  JOURNEY_CAMERA_MIN_SCALE,
  constrainJourneyCamera,
  journeyCameraPercent,
  panJourneyCamera,
  pinchJourneyCamera,
  zoomJourneyCamera,
  type JourneyCameraView,
} from "./journey-camera";
import {
  RAMAYANA_CAST_NODE_IDS,
  getJourneyEncounterNode,
  getJourneyEncounterRoutes,
  getRamayanaSceneEncounterNodes,
  journeyEncounterHref,
} from "./ramayana-world-encounters";
import styles from "./journey-player.module.css";

type JourneySarthiReply = {
  ok: boolean;
  answer?: string;
  message?: string;
  sourceBoundary?: string;
  citations?: { passageId: string; workTitle: string; editionTitle: string }[];
};

export function journeyProgressKey(slug: string) {
  return `devam-journey-progress:${slug}`;
}

function readProgress(slug: string): string[] {
  try {
    const value = JSON.parse(window.localStorage.getItem(journeyProgressKey(slug)) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

type SceneCopy = { title?: string; kicker: string; story: string; invitation: string };

type PointerPoint = { x: number; y: number };
const encounterPositions = [
  { x: 13, y: 61, z: 18 },
  { x: 32, y: 27, z: 70 },
  { x: 52, y: 66, z: 34 },
  { x: 72, y: 25, z: 82 },
  { x: 88, y: 57, z: 48 },
  { x: 61, y: 43, z: 98 },
  { x: 25, y: 46, z: 56 },
] as const;
type CameraGesture = {
  pointers: Map<number, PointerPoint>;
  startView: JourneyCameraView;
  startCenter: PointerPoint;
  startDistance: number;
  moved: boolean;
  hadMultiple: boolean;
};

function pointerCenter(points: PointerPoint[]) {
  const total = points.reduce((sum, point) => ({ x: sum.x + point.x, y: sum.y + point.y }), { x: 0, y: 0 });
  return { x: total.x / points.length, y: total.y / points.length };
}

function pointerDistance(points: PointerPoint[]) {
  if (points.length < 2) return 0;
  return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
}

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest("a,button,input,textarea,summary,details"));
}

const storyCopy: Record<string, SceneCopy> = {
  "leave-lanka": { kicker: "The direction changes", story: "The war is behind them. Rama asks that every ally who carried the struggle be honoured, and the returning company rises from Lanka toward home.", invitation: "Rise into the homeward sky" },
  "sky-road": { kicker: "The world below becomes memory", story: "Rama points out the places that shaped the journey. Sita does not receive a list of names, but a moving map of loss, friendship, courage, and return.", invitation: "Follow the remembered road" },
  "bharadvaja-hermitage": { kicker: "Fourteen years narrow to one question", story: "At Bharadvaja's hermitage, Rama asks first about Ayodhya, Bharata, and his mothers. The city is still distant, but home is suddenly close enough to fear and hope for.", invitation: "Send word ahead" },
  "hanuman-goes-ahead": { kicker: "A message crosses the final distance", story: "Hanuman is asked to learn how Bharata and the city have fared, and to announce that Rama, Sita, and Lakshmana are almost home.", invitation: "Carry the news to Nandigrama" },
  "bharata-hears": { kicker: "The waiting ends", story: "Bharata asks Hanuman to tell the whole road: the exile, the search, the allies, and the victory. A story carried faithfully becomes the first form of reunion.", invitation: "Prepare the road" },
  "ayodhya-prepares": { kicker: "A city turns toward homecoming", story: "People, musicians, families, standards, and companions move out to meet the returning party. The world fills with faces because this victory was never Rama's alone.", invitation: "Enter the returning light" },
  "kingdom-returned": { kicker: "The road ends in responsibility", story: "Bharata returns the kingdom he guarded. Rama accepts the work of kingship again, and the homecoming becomes a public promise rather than a private reward.", invitation: "Complete the homeward path" },
  "bala-kanda": { kicker: "A prince, a bow, a beginning", story: "A young Rama leaves the palace with the sage Vishvamitra, protects a sacred rite, and meets Sita at the bow that no ordinary prince can lift.", invitation: "Follow the first light" },
  "ayodhya-kanda": { kicker: "The night the kingdom changed", story: "On the eve of Rama's coronation, an old promise sends him into exile. Sita and Lakshmana choose the forest over life without him.", invitation: "Leave Ayodhya" },
  "aranya-kanda": { kicker: "Deeper into the forest", story: "The forest becomes a place of wonder, danger, and loss. A golden deer draws Rama away—and Ravana carries Sita toward Lanka.", invitation: "Trace the broken trail" },
  "kishkindha-kanda": { kicker: "An alliance among the vanaras", story: "Rama meets Hanuman and Sugriva. A friendship is forged, a kingdom is reclaimed, and search parties set out toward every horizon.", invitation: "Join the search" },
  "sundara-kanda": { kicker: "The leap across the ocean", story: "Hanuman crosses the sea, enters Lanka alone, finds Sita in the ashoka grove, and must decide how to approach without deepening her fear.", invitation: "Leap toward Lanka" },
  "yuddha-kanda": { kicker: "The road to Lanka", story: "A bridge rises over the ocean. Armies meet, loyalties are tested, Ravana falls, and Rama and Sita begin the journey home.", invitation: "Cross the bridge" },
  "uttara-kanda": { kicker: "What came after victory", story: "The return is not the end. The later book carries questions of kingship, separation, memory, and the price of public duty.", invitation: "Enter the aftermath" },
  "the-question": { kicker: "A simple question", story: "The Goddess asks how Ganesha may be approached without elaborate austerity. The answer begins a garland of names and images.", invitation: "Listen for the answer" },
  "the-devotional-lens": { kicker: "The remover of obstacles", story: "Ganesha appears as the presence that clears the inner and outer knots standing between a devotee and a worthy beginning.", invitation: "Move closer" },
  "yajna-form": { kicker: "The sacred act itself", story: "The hymn does not place Ganesha outside the offering: he is praised as the giver, the offering, and the transforming fire of the act.", invitation: "Enter the flame" },
  "closing-prayer": { kicker: "A wish for auspiciousness", story: "The garland closes not with spectacle, but with a quiet prayer that what is genuinely sought may ripen toward well-being.", invitation: "Carry the blessing" },
  "context-opening": { kicker: "A kingdom lost", story: "A defeated king and a merchant, both unable to let go of what hurt them, arrive at a forest hermitage seeking to understand their own attachment.", invitation: "Enter the hermitage" },
  "proper-opening": { kicker: "The Goddess awakens", story: "When the gods are overwhelmed, their radiance gathers into a single immeasurable presence. The Devi takes form and the cosmos remembers its power.", invitation: "Witness her arrival" },
  "last-proper-canto": { kicker: "The final battle", story: "After the great battles, the Goddess faces the remaining force that claims she is not truly one. She gathers every emanation back into herself.", invitation: "Stand at the threshold" },
  "context-close": { kicker: "The boon and the return", story: "The tale returns to its listeners. What they ask of the Goddess reveals what each has learned—and what each still desires.", invitation: "Return to the world" },
  vasubaras: { kicker: "The first lamp", story: "The season of lights begins with gratitude for nourishment, care, and the animals whose lives have long been woven into household well-being.", invitation: "Light the first lamp" },
  dhantrayodashi: { kicker: "Health, wealth, and remembrance", story: "Homes prepare for renewal while lamps remember Yama and stories of Dhanvantari turn attention toward health—not merely buying gold.", invitation: "Follow the evening light" },
  "naraka-chaturdashi": { kicker: "Before dawn", story: "Across regions, the morning carries different stories: liberation from Naraka, ritual bathing, protection, and the fierce clearing of what must not follow us.", invitation: "Enter the blue hour" },
  "lakshmi-pujan": { kicker: "The night of radiance", story: "Lamps gather at thresholds and shrines. Some households welcome Lakshmi; in Bengal, the same night opens toward Kali. The lights do not erase their difference.", invitation: "Cross the luminous threshold" },
  "bali-govardhan": { kicker: "New worlds after the night", story: "The next day branches into stories of Bali, Govardhan, Annakut, the Gujarati new year, and Balipadyami—many worlds sharing one dawn.", invitation: "Choose a path" },
  "bhau-beej": { kicker: "A bond renewed", story: "The constellation closes around siblings and chosen kin: hospitality, blessing, memory, and the promise to remain present for one another.", invitation: "Complete the circle" },
};

const hindiStoryCopy: Record<string, SceneCopy> = {
  "leave-lanka": { title: "लंका से प्रस्थान", kicker: "दिशा बदलती है", story: "युद्ध पीछे छूट चुका है। राम कहते हैं कि संघर्ष में साथ देने वाले हर सहयोगी का सम्मान हो, और सब लंका से घर की ओर उठते हैं।", invitation: "घर लौटते आकाश में बढ़ें" },
  "sky-road": { title: "आकाश की स्मृति-राह", kicker: "नीचे का संसार स्मृति बनता है", story: "राम यात्रा को बदलने वाले स्थान दिखाते हैं। सीता के सामने नामों की सूची नहीं, बल्कि वियोग, मित्रता, साहस और वापसी का चलता हुआ मानचित्र खुलता है।", invitation: "स्मृति की राह पर चलें" },
  "bharadvaja-hermitage": { title: "घर अब निकट है", kicker: "चौदह वर्ष एक प्रश्न में सिमटते हैं", story: "भरद्वाज के आश्रम में राम सबसे पहले अयोध्या, भरत और अपनी माताओं का समाचार पूछते हैं। नगर अभी दूर है, पर घर अब आशा और भय दोनों जितना निकट है।", invitation: "आगे समाचार भेजें" },
  "hanuman-goes-ahead": { title: "हनुमान आगे जाते हैं", kicker: "संदेश अंतिम दूरी पार करता है", story: "हनुमान से कहा जाता है कि वे भरत और नगर का हाल जानें और बताएं कि राम, सीता और लक्ष्मण अब घर के बहुत पास हैं।", invitation: "समाचार नंदिग्राम ले जाएँ" },
  "bharata-hears": { title: "भरत समाचार सुनते हैं", kicker: "प्रतीक्षा समाप्त होती है", story: "भरत हनुमान से वनवास, खोज, मित्रों और विजय की पूरी राह सुनना चाहते हैं। ईमानदारी से सुनाई गई कथा मिलन का पहला रूप बनती है।", invitation: "वापसी की राह सजाएँ" },
  "ayodhya-prepares": { title: "अयोध्या तैयार होती है", kicker: "नगर घर लौटने वालों की ओर बढ़ता है", story: "लोग, संगीतकार, परिवार, ध्वज और साथी लौटते हुए दल से मिलने निकलते हैं। संसार चेहरों से भर जाता है, क्योंकि यह विजय कभी अकेले राम की नहीं थी।", invitation: "लौटती रोशनी में प्रवेश करें" },
  "kingdom-returned": { title: "राज्य लौटाया जाता है", kicker: "राह उत्तरदायित्व पर समाप्त होती है", story: "भरत वह राज्य वापस करते हैं जिसे उन्होंने धरोहर की तरह संभाला। राम फिर राजकार्य स्वीकार करते हैं और घर वापसी निजी पुरस्कार के बजाय सार्वजनिक वचन बन जाती है।", invitation: "घर वापसी की यात्रा पूरी करें" },
  "bala-kanda": { title: "बालकाण्ड", kicker: "एक राजकुमार, एक धनुष, एक आरंभ", story: "युवा राम ऋषि विश्वामित्र के साथ महल से निकलते हैं, उनके यज्ञ की रक्षा करते हैं और उस धनुष के सामने सीता से मिलते हैं जिसे साधारण राजकुमार उठा नहीं सकता।", invitation: "पहली रोशनी के साथ चलें" },
  "ayodhya-kanda": { title: "अयोध्याकाण्ड", kicker: "वह रात जब राज्य बदल गया", story: "राम के राज्याभिषेक से ठीक पहले एक पुराना वचन उन्हें वनवास भेज देता है। सीता और लक्ष्मण उनके बिना महल में रहने के बजाय वन का मार्ग चुनते हैं।", invitation: "अयोध्या से आगे बढ़ें" },
  "aranya-kanda": { title: "अरण्यकाण्ड", kicker: "वन के भीतर और गहरे", story: "वन आश्चर्य, संकट और वियोग का संसार बन जाता है। स्वर्ण मृग राम को दूर ले जाता है और रावण सीता को लंका की ओर ले जाता है।", invitation: "टूटी हुई राह खोजें" },
  "kishkindha-kanda": { title: "किष्किन्धाकाण्ड", kicker: "वानरों के बीच एक मित्रता", story: "राम हनुमान और सुग्रीव से मिलते हैं। मित्रता बनती है, एक राज्य वापस मिलता है और खोज दल हर दिशा में निकलते हैं।", invitation: "खोज में शामिल हों" },
  "sundara-kanda": { title: "सुन्दरकाण्ड", kicker: "समुद्र के पार छलांग", story: "हनुमान समुद्र पार कर अकेले लंका पहुँचते हैं, अशोक वाटिका में सीता को खोजते हैं और सोचते हैं कि बिना भय बढ़ाए उनसे कैसे बात की जाए।", invitation: "लंका की ओर बढ़ें" },
  "yuddha-kanda": { title: "युद्धकाण्ड", kicker: "लंका की राह", story: "समुद्र पर सेतु बनता है। सेनाएँ आमने-सामने आती हैं, निष्ठाएँ परखी जाती हैं, रावण गिरता है और राम-सीता घर लौटने लगते हैं।", invitation: "सेतु पार करें" },
  "uttara-kanda": { title: "उत्तरकाण्ड", kicker: "विजय के बाद", story: "वापसी अंत नहीं है। बाद का यह काण्ड राजधर्म, वियोग, स्मृति और सार्वजनिक कर्तव्य की कीमत जैसे कठिन प्रश्न उठाता है।", invitation: "कथा के बाद का संसार देखें" },
  "the-question": { title: "प्रश्न", kicker: "एक सीधा प्रश्न", story: "देवी पूछती हैं कि कठिन तपस्या के बिना गणेश तक कैसे पहुँचा जाए। उत्तर नामों और रूपकों की एक माला से आरंभ होता है।", invitation: "उत्तर सुनें" },
  "the-devotional-lens": { title: "विघ्नहर्ता", kicker: "अवरोध हटाने वाली उपस्थिति", story: "गणेश उस उपस्थिति के रूप में सामने आते हैं जो शुभ आरंभ के मार्ग में खड़ी भीतरी और बाहरी गाँठों को खोलती है।", invitation: "और निकट जाएँ" },
  "yajna-form": { title: "यज्ञस्वरूप", kicker: "पवित्र कर्म का रूप", story: "स्तुति गणेश को अर्पण से बाहर नहीं रखती; उन्हें दाता, अर्पण और कर्म को बदलने वाली अग्नि के रूप में स्मरण करती है।", invitation: "अग्नि के भीतर देखें" },
  "closing-prayer": { title: "मंगल कामना", kicker: "शुभता की प्रार्थना", story: "यह यात्रा चमत्कार के प्रदर्शन से नहीं, बल्कि इस शांत कामना से समाप्त होती है कि जो सच में चाहा गया है वह कल्याण की ओर पके।", invitation: "कामना साथ लेकर चलें" },
  "context-opening": { title: "वन आश्रम की देहरी", kicker: "एक खोया हुआ राज्य", story: "एक पराजित राजा और एक व्यापारी, दोनों अपने दुख से अलग नहीं हो पाते। वे अपने मोह को समझने के लिए वन के आश्रम में पहुँचते हैं।", invitation: "आश्रम में प्रवेश करें" },
  "proper-opening": { title: "देवी का प्राकट्य", kicker: "शक्ति जागती है", story: "जब देवता असहाय होते हैं, उनका तेज एक अपार उपस्थिति में एकत्र होता है। देवी रूप लेती हैं और जगत अपनी शक्ति को फिर पहचानता है।", invitation: "उनका आगमन देखें" },
  "last-proper-canto": { title: "अंतिम संग्राम", kicker: "अंतिम सीमा", story: "महायुद्धों के बाद देवी उस शक्ति का सामना करती हैं जो उनके एकत्व को चुनौती देती है। वे अपने सभी प्रकट रूपों को फिर अपने भीतर समेट लेती हैं।", invitation: "सीमा पर खड़े हों" },
  "context-close": { title: "वरदान और वापसी", kicker: "कथा से जीवन की ओर", story: "कथा फिर अपने श्रोताओं के पास लौटती है। देवी से वे जो माँगते हैं, उसमें उनकी सीख भी दिखाई देती है और उनकी बची हुई इच्छा भी।", invitation: "जीवन में वापस लौटें" },
  "vasubaras": { title: "वसु बारस", kicker: "पहला दीप", story: "प्रकाश का मौसम पोषण, देखभाल और उन पशुओं के प्रति कृतज्ञता से आरंभ होता है जो लंबे समय से गृहस्थ जीवन का हिस्सा रहे हैं।", invitation: "पहला दीप जलाएँ" },
  "dhantrayodashi": { title: "धनत्रयोदशी", kicker: "स्वास्थ्य, समृद्धि और स्मरण", story: "घर नवआरंभ की तैयारी करते हैं। दीप यम का स्मरण कराते हैं और धन्वंतरि की कथाएँ ध्यान को स्वास्थ्य की ओर ले जाती हैं—केवल खरीदारी की ओर नहीं।", invitation: "संध्या की रोशनी के साथ चलें" },
  "naraka-chaturdashi": { title: "नरक चतुर्दशी", kicker: "भोर से पहले", story: "अलग-अलग क्षेत्रों में यह सुबह अलग कथाएँ लाती है—नरक से मुक्ति, स्नान, रक्षा और उस अंधकार को पीछे छोड़ना जिसे आगे नहीं ले जाना।", invitation: "नीली भोर में प्रवेश करें" },
  "lakshmi-pujan": { title: "लक्ष्मी पूजन", kicker: "प्रकाश की रात", story: "देहरी और पूजा-स्थल पर दीप इकट्ठे होते हैं। कुछ घर लक्ष्मी का स्वागत करते हैं; बंगाल में यही रात काली पूजा की ओर खुलती है। प्रकाश उनके अंतर को मिटाता नहीं।", invitation: "प्रकाश की देहरी पार करें" },
  "bali-govardhan": { title: "बलि और गोवर्धन", kicker: "रात के बाद अनेक संसार", story: "अगला दिन बलि, गोवर्धन, अन्नकूट, गुजराती नववर्ष और बलिपाड्यमी की अलग राहों में खुलता है—एक भोर, अनेक जीवित परंपराएँ।", invitation: "अपनी राह चुनें" },
  "bhau-beej": { title: "भाऊ बीज", kicker: "एक संबंध फिर नया", story: "यह नक्षत्र भाई-बहनों और चुने हुए आत्मीय संबंधों के साथ पूरा होता है—आतिथ्य, आशीष, स्मृति और साथ बने रहने का वचन।", invitation: "वृत्त पूरा करें" },
};

function sceneCopy(stop: JourneyStop, language: "en" | "hi") {
  if (language === "hi" && hindiStoryCopy[stop.id]) return hindiStoryCopy[stop.id];
  return storyCopy[stop.id] ?? { kicker: stop.eyebrow, story: stop.summary, invitation: "Continue the journey" };
}

function locatorLabel(locator: Record<string, unknown>) {
  if (typeof locator.book === "number" && typeof locator.sarga === "number") return `Book ${locator.book} · Sarga ${locator.sarga}`;
  if (typeof locator.source_chapter === "number") return `Chapter ${locator.source_chapter}`;
  if (typeof locator.literal_marker === "string") return `Source unit ${locator.literal_marker}`;
  return "Exact source span";
}

export function JourneyPlayer({ journey, account }: { journey: HeroJourney; account: { signedIn: boolean; label: string } }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [explored, setExplored] = useState<string[]>([]);
  const [showGuide, setShowGuide] = useState(true);
  const [sarthiOpen, setSarthiOpen] = useState(false);
  const [sarthiInput, setSarthiInput] = useState("");
  const [askedQuestion, setAskedQuestion] = useState("");
  const [sarthiReply, setSarthiReply] = useState<JourneySarthiReply | null>(null);
  const [sarthiBusy, setSarthiBusy] = useState(false);
  const [accountPrompt, setAccountPrompt] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [worldLens, setWorldLens] = useState<"story" | "route" | "connections">("story");
  const [camera, setCamera] = useState<JourneyCameraView>({ ...JOURNEY_CAMERA_DEFAULT });
  const [cameraDragging, setCameraDragging] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [encounterTrail, setEncounterTrail] = useState<string[]>([]);
  const guestExchanges = useRef(0);
  const viewportRef = useRef<HTMLElement | null>(null);
  const cameraRef = useRef<JourneyCameraView>({ ...JOURNEY_CAMERA_DEFAULT });
  const lastTapRef = useRef<{ at: number; x: number; y: number } | null>(null);
  const cameraGesture = useRef<CameraGesture>({
    pointers: new Map(),
    startView: { ...JOURNEY_CAMERA_DEFAULT },
    startCenter: { x: 0, y: 0 },
    startDistance: 0,
    moved: false,
    hadMultiple: false,
  });

  useEffect(() => {
    const saved = readProgress(journey.slug);
    const sync = window.setTimeout(() => {
      setExplored(saved);
      const next = journey.stops.findIndex((stop) => !saved.includes(stop.id));
      if (next >= 0) setActiveIndex(next);
    }, 0);
    const guide = window.setTimeout(() => setShowGuide(false), 4500);
    return () => { window.clearTimeout(sync); window.clearTimeout(guide); };
  }, [journey]);

  useEffect(() => {
    if (account.signedIn) return;
    try {
      const value = Number(window.localStorage.getItem("devam-guest-sarthi-exchanges") ?? "0");
      guestExchanges.current = Number.isSafeInteger(value) && value > 0 ? value : 0;
    } catch {
      guestExchanges.current = 0;
    }
  }, [account.signedIn]);

  const active = journey.stops[activeIndex];
  const copy = sceneCopy(active, language);
  const activeTitle = copy.title ?? active.title;
  const exploredSet = useMemo(() => new Set(explored), [explored]);
  const isRamayanaWorld = journey.slug === "ramayana";
  const sceneEncounterNodes = useMemo(
    () => isRamayanaWorld ? getRamayanaSceneEncounterNodes(active.id) : [],
    [active.id, isRamayanaWorld],
  );
  const focusedEncounter = encounterTrail.length ? getJourneyEncounterNode(encounterTrail.at(-1)!) : null;
  const focusedEncounterRoutes = focusedEncounter ? getJourneyEncounterRoutes(focusedEncounter.id) : [];
  const routeLandmarks = [
    { label: "Lanka", index: 0, x: 12, y: 76 },
    { label: "Bharadvaja", index: 2, x: 47, y: 47 },
    { label: "Nandigrama", index: 3, x: 69, y: 35 },
    { label: "Ayodhya", index: 5, x: 88, y: 17 },
  ];

  function cameraViewport() {
    const viewport = viewportRef.current;
    return viewport ? { width: viewport.clientWidth, height: viewport.clientHeight } : undefined;
  }

  function commitCamera(next: JourneyCameraView) {
    const constrained = constrainJourneyCamera(next, cameraViewport());
    cameraRef.current = constrained;
    setCamera(constrained);
  }

  function resetCamera() {
    commitCamera({ ...JOURNEY_CAMERA_DEFAULT });
  }

  function rebaseGesture() {
    const gesture = cameraGesture.current;
    const points = [...gesture.pointers.values()];
    gesture.startView = { ...cameraRef.current };
    gesture.startCenter = points.length ? pointerCenter(points) : { x: 0, y: 0 };
    gesture.startDistance = pointerDistance(points);
    gesture.moved = false;
  }

  function travelTo(index: number) {
    setActiveIndex(index);
    setShowGuide(false);
    setShowCompletion(false);
    setEncounterTrail([]);
    resetCamera();
  }

  function openEncounter(nodeId: string) {
    if (!getJourneyEncounterNode(nodeId)) return;
    setEncounterTrail((trail) => trail.at(-1) === nodeId ? trail : [...trail, nodeId]);
    setShowGuide(false);
  }

  function backFromEncounter() {
    setEncounterTrail((trail) => trail.slice(0, -1));
  }

  function continueJourney() {
    const nextExplored = exploredSet.has(active.id) ? explored : [...explored, active.id];
    setExplored(nextExplored);
    window.localStorage.setItem(journeyProgressKey(journey.slug), JSON.stringify(nextExplored));
    if (activeIndex < journey.stops.length - 1) travelTo(activeIndex + 1);
    else setShowCompletion(true);
  }

  function handleCameraPointerDown(event: ReactPointerEvent<HTMLElement>) {
    if (!isRamayanaWorld || isInteractiveTarget(event.target)) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    if (cameraGesture.current.pointers.size === 0) cameraGesture.current.hadMultiple = false;
    cameraGesture.current.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (cameraGesture.current.pointers.size > 1) cameraGesture.current.hadMultiple = true;
    rebaseGesture();
    setCameraDragging(true);
  }

  function handleCameraPointerMove(event: ReactPointerEvent<HTMLElement>) {
    const gesture = cameraGesture.current;
    const previous = gesture.pointers.get(event.pointerId);
    if (!previous) return;
    const nextPoint = { x: event.clientX, y: event.clientY };
    if (Math.hypot(nextPoint.x - previous.x, nextPoint.y - previous.y) > 2) gesture.moved = true;
    gesture.pointers.set(event.pointerId, nextPoint);
    const points = [...gesture.pointers.values()];
    const center = pointerCenter(points);
    const delta = { x: center.x - gesture.startCenter.x, y: center.y - gesture.startCenter.y };
    if (points.length > 1 && gesture.startDistance > 0) {
      commitCamera(pinchJourneyCamera(
        gesture.startView,
        gesture.startDistance,
        pointerDistance(points),
        delta,
        cameraViewport(),
      ));
      return;
    }
    commitCamera(panJourneyCamera(gesture.startView, delta, cameraViewport()));
  }

  function handleCameraPointerEnd(event: ReactPointerEvent<HTMLElement>) {
    const gesture = cameraGesture.current;
    const wasSinglePointer = gesture.pointers.size === 1;
    const wasTap = event.type === "pointerup" && wasSinglePointer && !gesture.moved && !gesture.hadMultiple;
    gesture.pointers.delete(event.pointerId);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);

    if (event.pointerType === "touch" && wasTap) {
      const now = event.timeStamp;
      const previousTap = lastTapRef.current;
      if (previousTap && now - previousTap.at < 360 && Math.hypot(event.clientX - previousTap.x, event.clientY - previousTap.y) < 48) {
        commitCamera(zoomJourneyCamera(cameraRef.current, cameraRef.current.scale > 1.08 ? 1 : 1.22, cameraViewport()));
        lastTapRef.current = null;
      } else {
        lastTapRef.current = { at: now, x: event.clientX, y: event.clientY };
      }
    }

    if (gesture.pointers.size) rebaseGesture();
    else {
      gesture.hadMultiple = false;
      setCameraDragging(false);
    }
  }

  function handleCameraWheel(event: ReactWheelEvent<HTMLElement>) {
    if (!isRamayanaWorld) return;
    event.preventDefault();
    const scale = cameraRef.current.scale * Math.exp(-event.deltaY * .0012);
    commitCamera(zoomJourneyCamera(cameraRef.current, scale, cameraViewport()));
  }

  function handleCameraKeyboard(event: ReactKeyboardEvent<HTMLElement>) {
    if (!isRamayanaWorld || event.target !== event.currentTarget) return;
    if (event.shiftKey && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
      event.preventDefault();
      const delta = event.key === "ArrowLeft" ? { x: -48, y: 0 }
        : event.key === "ArrowRight" ? { x: 48, y: 0 }
          : event.key === "ArrowUp" ? { x: 0, y: -48 }
            : { x: 0, y: 48 };
      commitCamera(panJourneyCamera(cameraRef.current, delta, cameraViewport()));
      return;
    }
    if (event.key === "ArrowLeft" && activeIndex > 0) {
      event.preventDefault();
      travelTo(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      continueJourney();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      commitCamera(zoomJourneyCamera(cameraRef.current, cameraRef.current.scale + .08, cameraViewport()));
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      commitCamera(zoomJourneyCamera(cameraRef.current, cameraRef.current.scale - .08, cameraViewport()));
    } else if (event.key === "Home" || event.key === "0") {
      event.preventDefault();
      resetCamera();
    }
  }

  async function askSarthi(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = sarthiInput.trim();
    if (question.length < 2 || sarthiBusy) return;
    if (!canGuestAskSarthi(guestExchanges.current, account.signedIn)) {
      setAccountPrompt(true);
      return;
    }
    setAskedQuestion(question);
    setSarthiReply(null);
    setSarthiBusy(true);
    setSarthiInput("");
    try {
      const response = await fetch("/api/sarthi", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: question, context: { atlasNodeSlug: active.id, languageCode: language } }),
      });
      const reply = await response.json() as JourneySarthiReply;
      setSarthiReply(reply);
      if (response.ok && !account.signedIn) {
        guestExchanges.current += 1;
        try { window.localStorage.setItem("devam-guest-sarthi-exchanges", String(guestExchanges.current)); } catch { /* Session state still gates the chat. */ }
      }
    } catch {
      setSarthiReply({ ok: false, message: "I could not reach Devam's evidence service. Please try again." });
    } finally {
      setSarthiBusy(false);
    }
  }

  const sceneStyle = {
    "--path-offset": `${activeIndex * -230 - 115}px`,
    "--path-width": `${journey.stops.length * 230}px`,
    "--backdrop-shift": `${journey.stops.length > 1 ? 4 - (activeIndex / (journey.stops.length - 1)) * 8 : 0}%`,
    "--camera-x": `${camera.x}px`,
    "--camera-y": `${camera.y}px`,
    "--camera-scale": camera.scale,
  } as CSSProperties;

  return (
    <main className={styles.shell} data-tone={journey.tone} style={sceneStyle}>
      <div className={styles.space} aria-hidden="true"><span/><span/><span/></div>
      <div className={`${styles.worldBackdrop} ${cameraDragging ? styles.worldBackdropDragging : ""}`} aria-hidden="true">
        <Image key={active.visual?.asset ?? journey.slug} src={active.visual?.asset ?? `/journeys/${journey.slug}-world-v1.webp`} alt="" fill priority sizes="100vw" />
      </div>
      <header className={styles.hud}>
        <Link className={styles.brand} href="/">
          <Image src="/brand/devam-mark.png" alt="" width={38} height={38} priority />
          <span><strong>Devam</strong><small>Return to the universe</small></span>
        </Link>
        <div className={styles.worldName}><small>{journey.hero} world</small><strong>{journey.title}</strong></div>
        <div className={styles.hudActions}>
          <div className={styles.language} role="group" aria-label="Story language">
            <button type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button>
            <button type="button" aria-pressed={language === "hi"} onClick={() => setLanguage("hi")}>हिं</button>
          </div>
          <button className={styles.sarthi} type="button" onClick={() => { setSarthiOpen(true); setSarthiInput(language === "hi" ? `${activeTitle} की कहानी सरल भाषा में बताइए` : `Tell me the story of ${active.title}`); }}>✦ <span>Ask Sārthi</span></button>
        </div>
      </header>

      {isRamayanaWorld && <nav className={styles.lensSwitcher} aria-label="World lens">
        {(["story", "route", "connections"] as const).map((lens) => <button key={lens} type="button" aria-pressed={worldLens === lens} onClick={() => setWorldLens(lens)}>{lens === "story" ? "Story" : lens === "route" ? "Route" : "Connections"}</button>)}
      </nav>}

      <section
        className={styles.viewport}
        aria-label={`${journey.hero} story world`}
        aria-keyshortcuts={isRamayanaWorld ? "ArrowLeft ArrowRight ArrowUp ArrowDown Shift+ArrowLeft Shift+ArrowRight Shift+ArrowUp Shift+ArrowDown Home 0" : undefined}
        data-camera-scale={camera.scale.toFixed(2)}
        data-camera-x={Math.round(camera.x)}
        data-camera-y={Math.round(camera.y)}
        data-navigable={isRamayanaWorld ? "true" : undefined}
        onDoubleClick={() => isRamayanaWorld && commitCamera(zoomJourneyCamera(cameraRef.current, cameraRef.current.scale > 1.08 ? 1 : 1.22, cameraViewport()))}
        onKeyDown={handleCameraKeyboard}
        onPointerCancel={handleCameraPointerEnd}
        onPointerDown={handleCameraPointerDown}
        onPointerMove={handleCameraPointerMove}
        onPointerUp={handleCameraPointerEnd}
        onWheel={handleCameraWheel}
        ref={viewportRef}
        tabIndex={isRamayanaWorld ? 0 : undefined}
      >
        <div className={styles.horizon} aria-hidden="true" />
        {(!isRamayanaWorld || worldLens === "story") && <div className={styles.storyPath} role="list" aria-label="Story scenes">
          {journey.stops.map((stop, index) => {
            const selected = index === activeIndex;
            const visited = exploredSet.has(stop.id);
            const localizedStop = sceneCopy(stop, language);
            const stopTitle = localizedStop.title ?? stop.title;
            return (
              <button
                type="button"
                role="listitem"
                className={`${styles.storyNode} ${selected ? styles.storyNodeActive : ""} ${visited ? styles.storyNodeVisited : ""}`}
                style={{ "--node-x": `${index * 230}px`, "--node-y": `${95 + (index % 2) * 62}px`, "--z": `${(index % 3) * 34}px` } as CSSProperties}
                onClick={() => travelTo(index)}
                aria-current={selected ? "step" : undefined}
                aria-label={`${stop.ordinal}. ${stopTitle}`}
                key={stop.id}
              >
                <span className={styles.nodeOrbit}/><span className={styles.nodeGlow}/><span className={styles.nodeCore}/>
                <span className={styles.nodeCopy}><small>{String(stop.ordinal).padStart(2, "0")}</small><strong>{stopTitle}</strong></span>
              </button>
            );
          })}
        </div>}
        {isRamayanaWorld && worldLens === "story" && camera.scale >= 1.08 && <div className={styles.sceneDiscoveries} aria-label={`Nearby discoveries in ${activeTitle}`}>
          {sceneEncounterNodes.map((node, index) => {
            const position = encounterPositions[index % encounterPositions.length];
            return <button
              type="button"
              className={styles.sceneDiscovery}
              data-family={node.family}
              style={{ "--portal-x": `${position.x}%`, "--portal-y": `${position.y}%`, "--portal-z": `${position.z}px`, "--portal-delay": `${index * 70}ms` } as CSSProperties}
              onClick={() => openEncounter(node.id)}
              aria-label={`Discover ${node.label}, ${node.kind}`}
              key={node.id}
            ><span/><small>{node.kind}</small><strong>{node.label}</strong></button>;
          })}
        </div>}
        {isRamayanaWorld && worldLens === "route" && <div className={styles.routeWorld} aria-label="Narrative route from Lanka to Ayodhya">
          <div className={styles.routeLine} aria-hidden="true" />
          {routeLandmarks.map((landmark) => <button
            type="button"
            className={`${styles.routeLandmark} ${activeIndex >= landmark.index ? styles.routeLandmarkReached : ""}`}
            style={{ "--map-x": `${landmark.x}%`, "--map-y": `${landmark.y}%` } as CSSProperties}
            onClick={() => travelTo(landmark.index)}
            key={landmark.label}
          ><span/><strong>{landmark.label}</strong><small>{landmark.index === 0 ? "departure" : landmark.index === 5 ? "homecoming" : "story place"}</small></button>)}
          <p className={styles.routeBoundary}>Narrative route · not a historical or archaeological map</p>
        </div>}
        {isRamayanaWorld && worldLens === "connections" && <div className={styles.connectionWorld} aria-label={`Connections from ${activeTitle}`}>
          <p><small>Connections discovered here</small><strong>{activeTitle}</strong></p>
          <div className={styles.connectionConstellation}>
            <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none">
              {sceneEncounterNodes.slice(1).map((node, index) => {
                const origin = encounterPositions[0];
                const destination = encounterPositions[(index + 1) % encounterPositions.length];
                return <line x1={origin.x} y1={origin.y} x2={destination.x} y2={destination.y} key={node.id} />;
              })}
            </svg>
            {sceneEncounterNodes.map((node, index) => {
              const position = encounterPositions[index % encounterPositions.length];
              return <button
                type="button"
                className={`${styles.connectionPortal} ${index === 0 ? styles.connectionPortalHub : ""}`}
                data-family={node.family}
                style={{ "--portal-x": `${position.x}%`, "--portal-y": `${position.y}%`, "--portal-z": `${position.z}px`, "--portal-delay": `${index * 80}ms` } as CSSProperties}
                onClick={() => openEncounter(node.id)}
                aria-label={`Explore ${node.label}, ${node.kind}`}
                key={`${active.id}-${node.id}`}
              ><span aria-hidden="true"/><small>{node.kind}</small><strong>{node.label}</strong></button>;
            })}
          </div>
          <small className={styles.connectionBoundary}>Travel through a light. Every route keeps its own source, place, tradition, and uncertainty boundary.</small>
        </div>}
      </section>

      {isRamayanaWorld && <div className={styles.cameraControls} role="group" aria-label={`Scene camera controls, ${journeyCameraPercent(camera.scale)}%`}>
        <button type="button" aria-label="Zoom scene out" disabled={camera.scale <= JOURNEY_CAMERA_MIN_SCALE} onClick={() => commitCamera(zoomJourneyCamera(cameraRef.current, cameraRef.current.scale - .1, cameraViewport()))}>−</button>
        <button type="button" aria-label="Reset scene view" disabled={camera.scale === 1 && camera.x === 0 && camera.y === 0} onClick={resetCamera}>◎</button>
        <button type="button" aria-label="Zoom scene in" disabled={camera.scale >= JOURNEY_CAMERA_MAX_SCALE} onClick={() => commitCamera(zoomJourneyCamera(cameraRef.current, cameraRef.current.scale + .1, cameraViewport()))}>+</button>
      </div>}

      {!focusedEncounter && (!isRamayanaWorld || worldLens !== "connections") && <section className={styles.storyBeat} aria-live="polite" lang={language === "hi" ? "hi" : "en"}>
        {active.visual && <div className={styles.sceneContext}><span>{active.visual.location}</span><small>Artistic visualization</small></div>}
        <p>{copy.kicker}</p>
        <h1>{activeTitle}</h1>
        <span>{copy.story}</span>
        {active.visual && <div className={styles.cast} aria-label="Characters in this scene">{active.visual.cast.map((character) => {
          const nodeId = RAMAYANA_CAST_NODE_IDS[character];
          return isRamayanaWorld && nodeId
            ? <button type="button" onClick={() => openEncounter(nodeId)} key={character}>{character}</button>
            : <Link href={`/search?q=${encodeURIComponent(`${character} Ramayana`)}`} key={character}>{character}</Link>;
        })}</div>}
        <small className={styles.retellingLabel}>{language === "hi" ? "देवम की स्रोत-आधारित सरल कथा" : "Devam source-grounded story retelling"}</small>
        <div className={styles.actions}>
          <button type="button" onClick={continueJourney}>{activeIndex === journey.stops.length - 1 ? (language === "hi" ? "यह यात्रा पूरी करें" : "Complete this path") : copy.invitation}<span>→</span></button>
          {activeIndex > 0 && <button type="button" onClick={() => travelTo(activeIndex - 1)}>{language === "hi" ? "पीछे" : "Back"}</button>}
        </div>
        <details className={styles.sourceDetails}>
          <summary>{language === "hi" ? "कथा का स्रोत" : "Story source"}</summary>
          <strong>{active.citation.workTitle}</strong>
          <span>{active.citation.editionTitle} · {locatorLabel(active.citation.locator)}</span>
          <small>{journey.sourceBoundary}</small>
        </details>
      </section>}

      {focusedEncounter && <aside className={styles.encounter} aria-live="polite" aria-label={`${focusedEncounter.label} encounter`}>
        <button className={styles.encounterBack} type="button" onClick={backFromEncounter}>← {encounterTrail.length > 1 ? "Previous discovery" : "Back to the scene"}</button>
        <div className={styles.encounterIdentity} data-family={focusedEncounter.family}><span aria-hidden="true"/><p><small>{focusedEncounter.kind}</small><strong>{focusedEncounter.label}</strong></p></div>
        <p className={styles.encounterSummary}>{focusedEncounter.summary}</p>
        {focusedEncounterRoutes.length > 0 && <div className={styles.encounterRoutes} aria-label={`Paths from ${focusedEncounter.label}`}>
          <small>Travel along a relationship</small>
          {focusedEncounterRoutes.map((route) => <button type="button" onClick={() => openEncounter(route.destination.id)} key={route.id}>
            <span>{route.relation}</span><strong>{route.destination.label}</strong><small>{route.relationKind}{route.sourceRef ? " · source-linked" : ""}</small>
          </button>)}
        </div>}
        <details className={styles.encounterBoundary}>
          <summary>Why this connection is here</summary>
          <p>{focusedEncounter.evidenceBoundary}</p>
        </details>
        <Link className={styles.encounterLibrary} href={journeyEncounterHref(focusedEncounter)}>{focusedEncounter.gateway ? `Enter the ${focusedEncounter.label} world` : "Open its exact library trail"} →</Link>
      </aside>}

      <div className={styles.progress} aria-label={`${explored.length} of ${journey.stops.length} scenes explored`}>
        {journey.stops.map((stop, index) => <button type="button" aria-label={`Go to scene ${index + 1}`} onClick={() => travelTo(index)} className={index === activeIndex ? styles.progressActive : exploredSet.has(stop.id) ? styles.progressVisited : ""} key={stop.id} />)}
      </div>

      {showGuide && <p className={styles.guide}>{isRamayanaWorld ? "Drag to look · wheel or pinch for depth · → continues" : "Choose a light to move through the story"}</p>}
      {showCompletion && <div className={styles.complete}><span>Path discovered</span><strong>The universe continues beyond this route.</strong><div><button type="button" onClick={() => { setShowCompletion(false); travelTo(0); }}>Replay from Lanka</button><Link href="/">Return to the stars</Link></div></div>}
      {sarthiOpen && <button className={styles.scrim} type="button" onClick={() => setSarthiOpen(false)} aria-label="Close Sarthi" />}
      <aside className={`${styles.sarthiPanel} ${sarthiOpen ? styles.sarthiPanelOpen : ""}`} aria-hidden={!sarthiOpen} aria-label="Sarthi conversation">
        <header><div><span>✦</span><p><strong>Sārthi</strong><small>Companion inside this story</small></p></div><button type="button" onClick={() => setSarthiOpen(false)} aria-label="Close Sarthi">×</button></header>
        <div className={styles.chatTranscript} aria-live="polite">
          <small>Exploring · {activeTitle}</small>
          <p className={styles.sarthiMessage}>Ask me about this moment, the people in it, or where the story moves next.</p>
          {askedQuestion && <p className={styles.userMessage}>{askedQuestion}</p>}
          {sarthiBusy && <p className={styles.sarthiMessage}>Looking through Devam&apos;s evidence…</p>}
          {sarthiReply && <div className={styles.sarthiMessage}>{sarthiReply.ok ? sarthiReply.answer : sarthiReply.message}{sarthiReply.citations?.length ? <details><summary>Sources</summary>{sarthiReply.citations.map((citation) => <p key={citation.passageId}><strong>{citation.workTitle}</strong><small>{citation.editionTitle}</small></p>)}</details> : null}</div>}
          {accountPrompt && <div className={styles.accountPrompt}><strong>Continue with your account</strong><span>Your guest Sārthi exchange is complete.</span><Link href="/account">Sign in to keep talking</Link></div>}
        </div>
        <form className={styles.chatComposer} onSubmit={askSarthi}><label className="srOnly" htmlFor="journey-sarthi-message">Message Sarthi</label><textarea id="journey-sarthi-message" value={sarthiInput} onChange={(event) => setSarthiInput(event.target.value)} placeholder={`Ask about ${active.title}…`} rows={2} /><button type="submit" disabled={sarthiBusy || sarthiInput.trim().length < 2}>Send</button></form>
      </aside>
    </main>
  );
}
