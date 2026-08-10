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
import type { StoryMoment, StoryWorldPack } from "@/lib/domain/story-world";
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
  getJourneyEncounterNode,
  getJourneyEncounterRoutes,
  getStorySceneEncounterNodes,
} from "./ramayana-world-encounters";
import { JourneyEncounter } from "./journey-encounter";
import { JourneyBeatStage } from "./journey-beat-stage";
import { JourneyCompass } from "./journey-compass";
import { journeyProgressKey, shouldApplyRestoredJourneyPosition } from "./journey-progress";
import { RamayanaNarrativeMap } from "./ramayana-narrative-map";
import { getRamayanaBeatStage } from "./ramayana-beat-stage";
import styles from "./journey-player.module.css";

type JourneySarthiReply = {
  ok: boolean;
  answer?: string;
  message?: string;
  sourceBoundary?: string;
  citations?: { passageId: string; workTitle: string; editionTitle: string }[];
};

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
  "coronation-dawn": { kicker: "A future gathers before dawn", story: "Ayodhya prepares to install Rama while he and Sita keep a quiet vigil inside the celebration.", invitation: "See what reaches Kaikeyi's chamber" },
  "manthara-sees-city": { kicker: "Celebration becomes a warning", story: "Manthara sees the decorated city; Kaikeyi first rejoices before the news is reframed as danger.", invitation: "Follow the argument" },
  "fear-becomes-demands": { kicker: "Fear acquires a plan", story: "An old promise becomes two demands: Bharata's installation and Rama's fourteen-year exile.", invitation: "Stay through the long night" },
  "king-trapped-by-word": { kicker: "The promise closes around the king", story: "Dasharatha pleads while the coronation morning gathers outside a chamber that cannot resolve its future.", invitation: "Follow the summons" },
  "rama-crosses-celebration": { kicker: "A city celebrates what has already vanished", story: "Rama crosses streets prepared for his coronation and reaches a father unable to speak.", invitation: "Hear Rama's answer" },
  "rama-accepts-exile": { kicker: "Departure replaces resistance", story: "Rama accepts the road, carries the news to Kausalya, and redirects Lakshmana's anger into preparation.", invitation: "Enter Sita's decision" },
  "sita-chooses-road": { kicker: "Sita chooses rather than follows", story: "She hears every warning about the forest and insists that sharing the road is her own decision.", invitation: "Gather the travelling family" },
  "lakshmana-joins": { kicker: "Three travellers face the gate", story: "Lakshmana joins; gifts, travel gear, forest clothing, blessings, and farewell replace coronation.", invitation: "Complete the departure district" },
  "city-follows-car": { kicker: "A private rupture fills the road", story: "Dasharatha watches the dust vanish, the mothers confront the empty palace, and Ayodhya's citizens refuse to let the departing family disappear alone.", invitation: "Follow the city to the Tamasa" },
  "tamasa-night": { kicker: "The first night ends before dawn", story: "Citizens sleep beneath the trees while Rama chooses to leave quietly rather than let their devotion become further harm.", invitation: "Wake to the road beyond Kosala" },
  "roads-beyond-kosala": { kicker: "Ayodhya becomes a promise behind them", story: "Fields, villages, and rivers carry the car beyond the kingdom until the Ganga opens ahead and Guha arrives as a friend.", invitation: "Stay for Guha's night watch" },
  "guha-night-watch": { kicker: "Hospitality becomes shared vigilance", story: "Guha offers every comfort, but Lakshmana cannot sleep while Rama and Sita rest on the ground; two friends keep watch together.", invitation: "Walk to the Ganga at dawn" },
  "ganga-crossing": { kicker: "The chariot road ends at the river", story: "Sumantra must return with the empty car while Sita, Rama, and Lakshmana cross into a life that now continues on foot.", invitation: "Enter the first forest night" },
  "first-forest-night": { kicker: "Grief speaks without ceremony", story: "Beyond the inhabited road, Rama voices fear and anger for the family behind them; Lakshmana answers by making companionship present.", invitation: "Follow the smoke to the confluence" },
  "prayaga-to-yamuna": { kicker: "An unknown forest becomes a chosen road", story: "Bharadvaja points toward Chitrakoot; the travellers build a raft, cross the Yamuna, and enter a flowering landscape.", invitation: "Climb toward the mountain home" },
  "chitrakoot-home": { kicker: "The travellers make a place their own", story: "Birdsong and mountain water lead to a chosen clearing where Lakshmana builds a cottage and the three enter their first forest home.", invitation: "Complete the first-rivers district" },
  "empty-chariot-return": { kicker: "The witness returns without the travellers", story: "Sumantra enters a silent Ayodhya with the empty car and carries three distinct voices into Dasharatha's darkened chamber.", invitation: "Stay inside the grieving palace" },
  "palace-grief-dialogue": { kicker: "The command's cost fills the room", story: "Kausalya asks to follow the road, Sumantra offers what reassurance he can, and the royal couple confronts what exile has done to their family.", invitation: "Enter Dasharatha's oldest memory" },
  "river-sound-confession": { kicker: "One unseen sound returns across a lifetime", story: "Dasharatha recounts the arrow released at the Sarayu, the family it destroyed, and the curse he now recognizes in his own last night.", invitation: "Wake with the city" },
  "city-without-king": { kicker: "Morning finds an empty centre", story: "Ceremony becomes discovery, farewell is suspended, and Vasishta sends guarded messengers while the council faces a kingdom without its king.", invitation: "Ride toward Bharata" },
  "bharata-urgent-return": { kicker: "The road knows before the traveller does", story: "A dark dream and careful messengers send Bharata across seven nights into an Ayodhya whose silence tells him the first truth.", invitation: "Enter Kaikeyi's room" },
  "bharata-rejects-boons": { kicker: "The intended beneficiary refuses the result", story: "Kaikeyi presents the death, exile, and throne as success; Bharata rejects the kingdom and promises to bring Rama home.", invitation: "Mourn with the family" },
  "funeral-and-trust": { kicker: "Suspicion gives way to shared mourning", story: "Kausalya tests Bharata's innocence, embraces another grieving son, and the long-delayed farewell finally moves toward the Sarayu.", invitation: "Return to the empty throne" },
  "crown-refused-road": { kicker: "The crown becomes a direction of travel", story: "Bharata stops vengeance, refuses installation, and turns the institutions of the kingdom toward finding Rama and asking him to return.", invitation: "Complete the empty-throne district" },
  "expedition-reaches-ganga": { kicker: "A kingdom travels to ask", story: "Bharata brings family, citizens, and the royal force to the Ganga, where Guha must decide whether their scale means rescue or danger.", invitation: "Meet Guha at the river camp" },
  "guha-shows-first-night": { kicker: "The ground remembers the first night", story: "Guha retells Lakshmana's vigil and shows Bharata the grass bed whose small traces make Rama and Sita's exile physically real.", invitation: "Cross the Ganga toward Prayaga" },
  "bharadvaja-tests-hosts": { kicker: "The road earns scrutiny and welcome", story: "Bharadvaja tests Bharata's purpose, receives the whole expedition without erasing the hermitage boundary, and points toward Chitrakoot.", invitation: "Follow the smoke above Chitrakoot" },
  "chitrakoot-hears-army": { kicker: "One army, two readings", story: "Lakshmana sees attack where Rama expects love, while Bharata stops the force and takes the last distance toward the cottage on foot.", invitation: "Reach the brothers' reunion" },
  "brothers-meet-death-news": { kicker: "Reunion becomes mourning", story: "The brothers finally embrace; Rama asks after the kingdom and family, then Dasharatha's death carries them together to the Mandakini.", invitation: "Gather the family council" },
  "family-asks-rama-home": { kicker: "Love becomes a public argument", story: "Mothers, citizens, and advisers listen as Bharata argues that duty must repair harm while Rama holds to Dasharatha's command.", invitation: "Stay through the final arguments" },
  "sandals-hold-kingdom": { kicker: "A temporary answer takes form", story: "Javali, Vasishta, Bharata, and Rama reach the limits of persuasion until the sandals become the sign of a fourteen-year trust.", invitation: "Carry the trust toward Nandigrama" },
  "nandigrama-trust": { kicker: "Waiting becomes a form of government", story: "Bharata returns through silent Ayodhya and installs no new king, but a trust at Nandigrama defined by the moment Rama must return.", invitation: "Complete the road that asks Rama home" },
  "chitrakoot-grows-unsafe": { kicker: "The first forest home can no longer hold them", story: "Hermitages empty under threat while the traces of Bharata's visit make Chitrakoot too crowded with danger and memory to remain unchanged.", invitation: "Leave Chitrakoot with the three travellers" },
  "sita-tells-her-beginning": { kicker: "A story opens inside the journey", story: "Welcomed by Atri and Anasuya, Sita tells her own beginning: Janaka, the furrow, the bow, and the choice that joined her road to Rama's.", invitation: "Carry her story into Dandaka" },
  "dandaka-receives-them": { kicker: "The forest is already a living world", story: "Dandaka opens as a constellation of hermitages, water, fire, animals, gardens, learning, and households—not an empty wilderness.", invitation: "Enter the broken road" },
  "viradha-breaks-the-road": { kicker: "The ordinary rules stop working", story: "Viradha seizes Sita and survives arrows, forcing Rama and Lakshmana to change their method before another story appears beneath the danger.", invitation: "Follow the direction Viradha leaves" },
  "forest-asks-protection": { kicker: "A private exile meets a public claim", story: "Sarabhanga waits, forest communities gather, and the cost of repeated attacks turns protection into a promise with consequences.", invitation: "Stay for Sita's question" },
  "sita-questions-the-bow": { kicker: "The journey pauses for an unresolved argument", story: "Sita asks whether weapons can change intention. Rama answers from his promise to protect the forest; the scene preserves the disagreement instead of flattening it.", invitation: "Walk through the years that follow" },
  "ten-years-become-map": { kicker: "Time becomes explorable geography", story: "Panchapsara's unseen music opens one story, then years flow across many hermitages until the wish to meet Agastya gives wandering a new direction.", invitation: "Take the southern road" },
  "agastya-points-south": { kicker: "The next home appears beyond the hill", story: "Hospitality, storied weapons, and concern for Sita converge as Agastya gives the travellers a route toward river-fed Panchavati.", invitation: "Complete the road into Dandaka" },
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
  "coronation-dawn": { title: "राज्याभिषेक की भोर", kicker: "भोर से पहले भविष्य आकार लेता है", story: "अयोध्या राम के राज्याभिषेक की तैयारी करती है, जबकि राम और सीता उत्सव के बीच शांत रात्रि-व्रत रखते हैं।", invitation: "देखें समाचार कैकेयी तक कैसे पहुँचता है" },
  "manthara-sees-city": { title: "मंथरा नगर देखती है", kicker: "उत्सव चेतावनी बनता है", story: "मंथरा सजा हुआ नगर देखती है; कैकेयी पहले प्रसन्न होती हैं, फिर समाचार को संकट की तरह समझाया जाता है।", invitation: "तर्क के साथ आगे बढ़ें" },
  "fear-becomes-demands": { title: "भय दो माँगें बनता है", kicker: "भय को योजना मिलती है", story: "पुराना वचन दो माँगों में बदलता है—भरत का राज्याभिषेक और राम का चौदह वर्ष का वनवास।", invitation: "लंबी रात में ठहरें" },
  "king-trapped-by-word": { title: "राजा अपने वचन में बँधते हैं", kicker: "वचन राजा को घेर लेता है", story: "दशरथ विनती करते हैं, जबकि बाहर राज्याभिषेक की सुबह उस कक्ष की प्रतीक्षा करती है जहाँ भविष्य टूट चुका है।", invitation: "बुलावे के साथ चलें" },
  "rama-crosses-celebration": { title: "राम उत्सव के बीच से गुजरते हैं", kicker: "नगर उस भविष्य का उत्सव मना रहा है जो मिट चुका है", story: "राम अपने राज्याभिषेक के लिए सजी गलियों से चलकर ऐसे पिता तक पहुँचते हैं जो बोल नहीं पा रहे।", invitation: "राम का उत्तर सुनें" },
  "rama-accepts-exile": { title: "राम वनवास स्वीकार करते हैं", kicker: "प्रतिरोध की जगह प्रस्थान", story: "राम वन की राह स्वीकार करते हैं, कौसल्या को समाचार देते हैं और लक्ष्मण के क्रोध को यात्रा-तैयारी में बदलते हैं।", invitation: "सीता के निर्णय में प्रवेश करें" },
  "sita-chooses-road": { title: "सीता राह चुनती हैं", kicker: "सीता केवल साथ नहीं चलतीं, स्वयं चुनती हैं", story: "वे वन के हर संकट को सुनती हैं और स्पष्ट करती हैं कि साझा राह उनका अपना निर्णय है।", invitation: "यात्रा करने वाले परिवार को जुटते देखें" },
  "lakshmana-joins": { title: "तीनों द्वार की ओर मुड़ते हैं", kicker: "तीन यात्री द्वार के सामने", story: "लक्ष्मण साथ आते हैं; राज्याभिषेक की जगह दान, यात्रा-सामग्री, वन-वस्त्र, आशीर्वाद और विदाई लेते हैं।", invitation: "प्रस्थान-संसार पूरा करें" },
  "city-follows-car": { title: "नगर पीछे चलता है", kicker: "निजी टूटन पूरी राह भर देती है", story: "दशरथ ओझल होती धूल देखते हैं, माताएँ खाली महल का सामना करती हैं और अयोध्या के लोग जाते परिवार को अकेले गायब नहीं होने देते।", invitation: "नगर के साथ तमसा तक चलें" },
  "tamasa-night": { title: "तमसा की पहली रात", kicker: "पहली रात भोर से पहले बदल जाती है", story: "नगरवासी वृक्षों के नीचे सोते हैं और राम चुपचाप निकलना चुनते हैं, ताकि उनका स्नेह उनके लिए और कष्ट न बने।", invitation: "कोसल के बाहर की राह पर जागें" },
  "roads-beyond-kosala": { title: "कोसल के पार", kicker: "अयोध्या पीछे छूटा वचन बनती है", story: "खेत, गाँव और नदियाँ रथ को राज्य से बाहर ले जाते हैं, फिर सामने गंगा खुलती है और गुह मित्र बनकर आते हैं।", invitation: "गुह की रात की चौकसी में ठहरें" },
  "guha-night-watch": { title: "गुह रात भर पहरा देते हैं", kicker: "आतिथ्य साझा चौकसी बनता है", story: "गुह हर सुख प्रस्तुत करते हैं, पर राम और सीता को धरती पर देखकर लक्ष्मण सो नहीं सकते; दो मित्र साथ रात काटते हैं।", invitation: "भोर में गंगा तक चलें" },
  "ganga-crossing": { title: "गंगा दो जीवनों को बाँटती है", kicker: "रथ की राह नदी पर समाप्त होती है", story: "सुमंत्र को खाली रथ लेकर लौटना है, जबकि सीता, राम और लक्ष्मण ऐसे जीवन में पार जाते हैं जो अब पैदल चलेगा।", invitation: "पहली वन-रात में प्रवेश करें" },
  "first-forest-night": { title: "पहली वन-रात", kicker: "शोक बिना औपचारिकता बोलता है", story: "बस्ती की राह से बाहर राम पीछे छूटे परिवार के लिए भय और क्रोध कहते हैं; लक्ष्मण साथ होने का उत्तर देते हैं।", invitation: "संगम के धुएँ का अनुसरण करें" },
  "prayaga-to-yamuna": { title: "संगम से यमुना तक", kicker: "अनजान वन चुनी हुई राह बनता है", story: "भरद्वाज चित्रकूट की दिशा बताते हैं; यात्री बेड़ा बनाकर यमुना पार करते और फूलों से भरे भू-दृश्य में प्रवेश करते हैं।", invitation: "पर्वत के घर की ओर चढ़ें" },
  "chitrakoot-home": { title: "चित्रकूट में घर", kicker: "यात्री एक जगह को अपना बनाते हैं", story: "पक्षियों के स्वर और पर्वतीय जल उन्हें चुने हुए स्थान तक ले जाते हैं, जहाँ लक्ष्मण कुटिया बनाते और तीनों पहले वन-घर में प्रवेश करते हैं।", invitation: "पहली नदियों का संसार पूरा करें" },
  "empty-chariot-return": { title: "खाली रथ लौटता है", kicker: "साक्षी लौटता है, यात्री नहीं", story: "सुमंत्र खाली रथ के साथ मौन अयोध्या में प्रवेश करते और वन की तीन अलग आवाज़ें दशरथ के अँधेरे कक्ष तक पहुँचाते हैं।", invitation: "शोकाकुल महल में ठहरें" },
  "palace-grief-dialogue": { title: "महल में शोक बोलता है", kicker: "आदेश की कीमत कमरे को भर देती है", story: "कौसल्या वन की राह पर जाने की बात करती हैं, सुमंत्र जितना संभव है उतना आश्वासन देते हैं और राजपरिवार वनवास की मानवीय कीमत का सामना करता है।", invitation: "दशरथ की पुरानी स्मृति में प्रवेश करें" },
  "river-sound-confession": { title: "नदी की वह ध्वनि लौटती है", kicker: "एक अनदेखी ध्वनि जीवन भर लौटती रही", story: "दशरथ सरयू किनारे छोड़े गए बाण, उससे उजड़े परिवार और उस शाप को याद करते हैं जिसे वे अब अपनी अंतिम रात में पहचानते हैं।", invitation: "राजाविहीन नगर के साथ जागें" },
  "city-without-king": { title: "राजाविहीन अयोध्या", kicker: "सुबह एक खाली केंद्र पाती है", story: "प्रभात का समारोह मृत्यु की खोज बनता है, विदाई रोकनी पड़ती है और वसिष्ठ सुरक्षित संदेश भेजते हुए खाली सिंहासन के सामने सभा बुलाते हैं।", invitation: "भरत की ओर जाने वाली राह पकड़ें" },
  "bharata-urgent-return": { title: "भरत की तत्काल वापसी", kicker: "यात्री से पहले राह सत्य जानती है", story: "अशुभ स्वप्न और सावधान दूत भरत को सात रातों की यात्रा से उस अयोध्या तक लाते हैं जिसका मौन पहली सच्चाई बता देता है।", invitation: "कैकेयी के कक्ष में प्रवेश करें" },
  "bharata-rejects-boons": { title: "भरत वरों का फल अस्वीकार करते हैं", kicker: "जिसके लिए सब हुआ वही परिणाम ठुकराता है", story: "कैकेयी मृत्यु, वनवास और सिंहासन को सफलता की तरह रखती हैं; भरत राज्य अस्वीकार कर राम को लौटाने का संकल्प लेते हैं।", invitation: "परिवार के साथ शोक करें" },
  "funeral-and-trust": { title: "शोक से विश्वास", kicker: "संदेह साझा शोक में बदलता है", story: "कौसल्या भरत की निर्दोषता परखकर उन्हें एक और शोकाकुल पुत्र की तरह गले लगाती हैं और रुकी हुई राजकीय विदाई सरयू की ओर बढ़ती है।", invitation: "खाली सिंहासन की ओर लौटें" },
  "crown-refused-road": { title: "मुकुट अस्वीकार, राह तैयार", kicker: "मुकुट यात्रा की दिशा बन जाता है", story: "भरत प्रतिशोध रोकते, राज्याभिषेक अस्वीकार करते और राज्य की पूरी व्यवस्था को राम को खोजने तथा वापस बुलाने की यात्रा में बदल देते हैं।", invitation: "खाली सिंहासन का संसार पूरा करें" },
  "expedition-reaches-ganga": { title: "एक राज्य गंगा तक पहुँचता है", kicker: "एक राज्य विनती करने चलता है", story: "भरत परिवार, नागरिकों और राजकीय दल को गंगा तक लाते हैं, जहाँ गुह को तय करना है कि यह विशालता सहायता है या संकट।", invitation: "नदी-शिविर में गुह से मिलें" },
  "guha-shows-first-night": { title: "गुह पहली रात दिखाते हैं", kicker: "धरती पहली रात याद रखती है", story: "गुह लक्ष्मण की चौकसी सुनाते और घास का वह बिस्तर दिखाते हैं जिसके छोटे निशान राम-सीता के वनवास को भरत के सामने वास्तविक बना देते हैं।", invitation: "गंगा पार कर प्रयाग चलें" },
  "bharadvaja-tests-hosts": { title: "भरद्वाज परीक्षा और स्वागत करते हैं", kicker: "राह जाँच और आतिथ्य दोनों पाती है", story: "भरद्वाज भरत का उद्देश्य परखते, आश्रम की सीमा बचाते हुए पूरे दल को ठहराते और चित्रकूट की राह बताते हैं।", invitation: "चित्रकूट के धुएँ का अनुसरण करें" },
  "chitrakoot-hears-army": { title: "चित्रकूट सेना सुनता है", kicker: "एक सेना, दो अर्थ", story: "लक्ष्मण आक्रमण देखते हैं जहाँ राम प्रेम की आशा रखते हैं; उधर भरत सेना रोककर कुटिया की अंतिम दूरी पैदल चलते हैं।", invitation: "भाइयों के मिलन तक पहुँचें" },
  "brothers-meet-death-news": { title: "भाई मिलते और मृत्यु सुनते हैं", kicker: "मिलन शोक बन जाता है", story: "भाई अंततः गले मिलते हैं; राम राज्य और परिवार पूछते हैं, फिर दशरथ की मृत्यु सबको साथ मंदाकिनी तक ले जाती है।", invitation: "परिवार की सभा जुटाएँ" },
  "family-asks-rama-home": { title: "परिवार राम को घर बुलाता है", kicker: "प्रेम सार्वजनिक तर्क बनता है", story: "माताएँ, नागरिक और सलाहकार सुनते हैं—भरत कहते हैं धर्म को हानि सुधारनी चाहिए, जबकि राम दशरथ की आज्ञा पर स्थिर रहते हैं।", invitation: "अंतिम तर्कों में ठहरें" },
  "sandals-hold-kingdom": { title: "पादुकाएँ राज्य सँभालती हैं", kicker: "अस्थायी उत्तर आकार लेता है", story: "जावालि, वसिष्ठ, भरत और राम के तर्क सीमा तक पहुँचते हैं, फिर पादुकाएँ चौदह वर्ष की धरोहर का संकेत बनती हैं।", invitation: "धरोहर नंदिग्राम ले जाएँ" },
  "nandigrama-trust": { title: "नंदिग्राम की धरोहर", kicker: "प्रतीक्षा शासन का रूप लेती है", story: "भरत मौन अयोध्या से लौटकर नया राजा स्थापित नहीं करते; वे नंदिग्राम में ऐसी धरोहर रखते हैं जिसका अंत राम की वापसी से तय है।", invitation: "राम को घर बुलाने वाली राह पूरी करें" },
  "chitrakoot-grows-unsafe": { title: "चित्रकूट अब उन्हें रोक नहीं सकता", kicker: "पहला वन-घर बदल चुका है", story: "संकट के कारण आश्रम खाली होने लगते हैं और भरत की यात्रा के निशान चित्रकूट को भय तथा स्मृति से भर देते हैं।", invitation: "तीनों यात्रियों के साथ चित्रकूट छोड़ें" },
  "sita-tells-her-beginning": { title: "सीता अपना आरंभ सुनाती हैं", kicker: "यात्रा के भीतर एक और कथा खुलती है", story: "अत्रि और अनसूया के आश्रम में सीता जनक, धरती से अपने मिलने, धनुष और उस चुनाव को याद करती हैं जिसने उनकी राह राम से जोड़ी।", invitation: "उनकी कथा के साथ दंडक में प्रवेश करें" },
  "dandaka-receives-them": { title: "दंडक तीन यात्रियों का स्वागत करता है", kicker: "वन पहले से एक जीवित संसार है", story: "दंडक खाली जंगल नहीं, बल्कि आश्रमों, जल, अग्नि, पशुओं, बगीचों, अध्ययन और परिवारों का तारामंडल बनकर खुलता है।", invitation: "टूटी हुई राह में आगे बढ़ें" },
  "viradha-breaks-the-road": { title: "विराध राह तोड़ देता है", kicker: "साधारण उपाय काम करना बंद करते हैं", story: "विराध सीता को उठा लेता और बाणों से नहीं रुकता; राम और लक्ष्मण को अपना उपाय बदलना पड़ता है, फिर संकट के नीचे दूसरी कथा खुलती है।", invitation: "विराध द्वारा बताई दिशा पकड़ें" },
  "forest-asks-protection": { title: "वन अपनी बात रखता है", kicker: "निजी वनवास सार्वजनिक माँग से मिलता है", story: "शरभंग प्रतीक्षा करते हैं, वन-समुदाय जुटते हैं और लगातार आक्रमणों की कीमत रक्षा को परिणामों वाली प्रतिज्ञा बना देती है।", invitation: "सीता के प्रश्न में ठहरें" },
  "sita-questions-the-bow": { title: "सीता धनुष पर प्रश्न करती हैं", kicker: "यात्रा एक अधूरे तर्क के लिए रुकती है", story: "सीता पूछती हैं कि क्या शस्त्र मन का उद्देश्य बदल सकते हैं। राम वन-रक्षा के वचन से उत्तर देते हैं; दृश्य मतभेद को मिटाता नहीं है।", invitation: "आगे बीतते वर्षों में चलें" },
  "ten-years-become-map": { title: "दस वर्ष जीवित मानचित्र बनते हैं", kicker: "समय खोजी जा सकने वाली भूगोल बनता है", story: "पंचाप्सरा का अनदेखा संगीत एक कथा खोलता है, फिर अनेक आश्रमों में वर्ष बहते हैं और अगस्त्य से मिलने की इच्छा भटकती राह को दिशा देती है।", invitation: "दक्षिण की राह लें" },
  "agastya-points-south": { title: "अगस्त्य पंचवटी की दिशा बताते हैं", kicker: "पहाड़ी के पार अगला घर दिखाई देता है", story: "आतिथ्य, कथा-सम्पन्न शस्त्र और सीता की थकान की चिंता मिलकर यात्रियों को जल-भरी पंचवटी की ओर भेजते हैं।", invitation: "दंडक के भीतर की राह पूरी करें" },
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
  if (typeof locator.literal_marker_start === "string" && typeof locator.literal_marker_end === "string") return `Source units ${locator.literal_marker_start}–${locator.literal_marker_end}`;
  if (typeof locator.literal_marker === "string") return `Source unit ${locator.literal_marker}`;
  return "Exact source span";
}

export function JourneyPlayer({ journey, storyWorld, account }: { journey: HeroJourney; storyWorld: StoryWorldPack | null; account: { signedIn: boolean; label: string } }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeBeatIndex, setActiveBeatIndex] = useState(0);
  const [explored, setExplored] = useState<string[]>([]);
  const [showGuide, setShowGuide] = useState(true);
  const [sarthiOpen, setSarthiOpen] = useState(false);
  const [sarthiInput, setSarthiInput] = useState("");
  const [askedQuestion, setAskedQuestion] = useState("");
  const [sarthiReply, setSarthiReply] = useState<JourneySarthiReply | null>(null);
  const [sarthiBusy, setSarthiBusy] = useState(false);
  const [accountPrompt, setAccountPrompt] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [worldLens, setWorldLens] = useState<"compass" | "story" | "route" | "connections">("compass");
  const [compassViewRequest, setCompassViewRequest] = useState<{ mode: "selector" | "atlas"; serial: number }>({ mode: "selector", serial: 0 });
  const [storyFocusTurnId, setStoryFocusTurnId] = useState(() => storyWorld?.districts[0]?.compassTurnIds[0] ?? storyWorld?.compass.arcs[0]?.turnIds[0] ?? "");
  const [camera, setCamera] = useState<JourneyCameraView>({ ...JOURNEY_CAMERA_DEFAULT });
  const [cameraDragging, setCameraDragging] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [encounterTrail, setEncounterTrail] = useState<string[]>([]);
  const [encounterReturnTrail, setEncounterReturnTrail] = useState<string[] | null>(null);
  const [loadedMoments, setLoadedMoments] = useState<Record<string, StoryMoment>>(() => storyWorld?.moments ?? {});
  const [districtLoadErrorId, setDistrictLoadErrorId] = useState<string>();
  const guestExchanges = useRef(0);
  const userHasNavigated = useRef(false);
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
      if (shouldApplyRestoredJourneyPosition(userHasNavigated.current, next)) setActiveIndex(next);
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
  const activeMoment = loadedMoments[active.id];
  const activeBeat = activeMoment?.beats[activeBeatIndex];
  const activeBeatStage = getRamayanaBeatStage(activeBeat?.id);
  const sceneBeatStage = worldLens === "story" ? activeBeatStage : undefined;
  const exploredSet = useMemo(() => new Set(explored), [explored]);
  const isRamayanaWorld = Boolean(storyWorld?.districts.length);
  const activeDistrict = storyWorld?.districts.find((district) => district.momentIds.includes(active.id));
  const activeDistrictStops = useMemo(
    () => (activeDistrict?.momentIds ?? journey.stops.map((stop) => stop.id)).flatMap((momentId) => {
      const stop = journey.stops.find((candidate) => candidate.id === momentId);
      return stop ? [stop] : [];
    }),
    [activeDistrict, journey.stops],
  );
  const activeDistrictPosition = Math.max(0, activeDistrictStops.findIndex((stop) => stop.id === active.id));
  const activeDistrictExploredCount = activeDistrictStops.filter((stop) => exploredSet.has(stop.id)).length;
  const activeDistrictLoading = worldLens === "story" && Boolean(activeDistrict) && !activeMoment && districtLoadErrorId !== activeDistrict?.id;
  const cameraEnabled = isRamayanaWorld && worldLens === "story";
  const sceneEncounterNodes = useMemo(
    () => storyWorld ? getStorySceneEncounterNodes(storyWorld, active.id) : [],
    [active.id, storyWorld],
  );
  const focusedEncounter = storyWorld && encounterTrail.length ? getJourneyEncounterNode(storyWorld, encounterTrail.at(-1)!) : null;
  const focusedEncounterRoutes = storyWorld && focusedEncounter ? getJourneyEncounterRoutes(storyWorld, focusedEncounter.id) : [];
  const focusedStoryMoments = storyWorld && focusedEncounter
    ? (storyWorld.nodeMomentIds[focusedEncounter.id] ?? []).flatMap((momentId) => {
      const moment = journey.stops.find((stop) => stop.id === momentId);
      if (!moment) return [];
      const detailedMoment = loadedMoments[moment.id];
      return [{
        id: moment.id,
        ordinal: moment.ordinal,
        title: sceneCopy(moment, language).title ?? moment.title,
        decisiveChange: detailedMoment?.decisiveChange[language] ?? storyWorld.momentPreviews[moment.id]?.[language] ?? moment.summary,
        asset: moment.visual?.asset,
        active: moment.id === active.id,
      }];
    })
    : [];
  const returnEncounter = storyWorld && encounterReturnTrail?.length
    ? getJourneyEncounterNode(storyWorld, encounterReturnTrail.at(-1)!)
    : null;
  const backdropAsset = isRamayanaWorld && (worldLens === "compass" || worldLens === "route")
    ? "/journeys/ramayana-world-v1.webp"
    : active.visual?.asset ?? `/journeys/${journey.slug}-world-v1.webp`;

  useEffect(() => {
    if (!isRamayanaWorld || worldLens !== "story" || !activeDistrict) return;
    if (activeDistrict.momentIds.every((momentId) => loadedMoments[momentId])) return;
    const controller = new AbortController();
    void fetch(`/api/journeys/ramayana/district?district=${encodeURIComponent(activeDistrict.id)}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json() as { ok: boolean; moments?: Record<string, StoryMoment> };
        if (!response.ok || !payload.ok || !payload.moments) throw new Error("Ramayana district payload unavailable");
        setLoadedMoments((current) => ({ ...current, ...payload.moments }));
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setDistrictLoadErrorId(activeDistrict.id);
      });
    return () => controller.abort();
  }, [activeDistrict, isRamayanaWorld, loadedMoments, worldLens]);

  useEffect(() => {
    if (!isRamayanaWorld) return;
    for (const districtPosition of [activeDistrictPosition - 1, activeDistrictPosition + 1]) {
      const asset = activeDistrictStops[districtPosition]?.visual?.asset;
      if (!asset) continue;
      const preload = new window.Image();
      preload.decoding = "async";
      preload.src = asset;
    }
  }, [activeDistrictPosition, activeDistrictStops, isRamayanaWorld]);

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
    userHasNavigated.current = true;
    setActiveIndex(index);
    setActiveBeatIndex(0);
    setShowGuide(false);
    setShowCompletion(false);
    setEncounterTrail([]);
    setEncounterReturnTrail(null);
    resetCamera();
  }

  function openEncounter(nodeId: string) {
    if (!storyWorld || !getJourneyEncounterNode(storyWorld, nodeId)) return;
    setEncounterReturnTrail(null);
    setEncounterTrail((trail) => trail.at(-1) === nodeId ? trail : [...trail, nodeId]);
    setShowGuide(false);
  }

  function backFromEncounter() {
    if (encounterTrail.length <= 1) setWorldLens("story");
    setEncounterTrail((trail) => trail.slice(0, -1));
  }

  function openStoryMoment(momentId: string) {
    const index = journey.stops.findIndex((stop) => stop.id === momentId);
    if (index < 0) return;
    setWorldLens("story");
    travelTo(index);
  }

  function openStoryMomentFromEncounter(momentId: string) {
    const returnTrail = [...encounterTrail];
    const index = journey.stops.findIndex((stop) => stop.id === momentId);
    if (index < 0 || returnTrail.length === 0) return;
    setWorldLens("story");
    travelTo(index);
    setEncounterReturnTrail(returnTrail);
  }

  function returnToEncounterPath() {
    if (!encounterReturnTrail?.length) return;
    setEncounterTrail(encounterReturnTrail);
    setEncounterReturnTrail(null);
  }

  function openWholeStoryTurn(turnId: string) {
    if (!storyWorld?.compass.turns[turnId]) return;
    setStoryFocusTurnId(turnId);
    setEncounterTrail([]);
    setCompassViewRequest((request) => ({ mode: "atlas", serial: request.serial + 1 }));
    setWorldLens("compass");
  }

  function requestCompassView(mode: "selector" | "atlas") {
    setCompassViewRequest((request) => ({ mode, serial: request.serial + 1 }));
  }

  function selectWorldLens(lens: "compass" | "story" | "route" | "connections") {
    setEncounterTrail([]);
    setEncounterReturnTrail(null);
    setShowCompletion(false);
    if (lens === "compass") setCompassViewRequest((request) => ({ mode: "atlas", serial: request.serial + 1 }));
    setWorldLens(lens);
  }

  function openVisualWorldSelector() {
    setEncounterTrail([]);
    setEncounterReturnTrail(null);
    setShowCompletion(false);
    setCompassViewRequest((request) => ({ mode: "selector", serial: request.serial + 1 }));
    setWorldLens("compass");
  }

  function continueJourney() {
    const nextExplored = exploredSet.has(active.id) ? explored : [...explored, active.id];
    setExplored(nextExplored);
    window.localStorage.setItem(journeyProgressKey(journey.slug), JSON.stringify(nextExplored));
    const nextStop = activeDistrictStops[activeDistrictPosition + 1];
    if (nextStop) travelTo(journey.stops.findIndex((stop) => stop.id === nextStop.id));
    else setShowCompletion(true);
  }

  function advanceStory() {
    if (activeMoment && activeBeatIndex < activeMoment.beats.length - 1) {
      setActiveBeatIndex((index) => index + 1);
      setShowGuide(false);
      return;
    }
    continueJourney();
  }

  function rewindStory() {
    if (activeBeatIndex > 0) {
      setActiveBeatIndex((index) => index - 1);
      setShowGuide(false);
      return;
    }
    const previousStop = activeDistrictStops[activeDistrictPosition - 1];
    if (previousStop) travelTo(journey.stops.findIndex((stop) => stop.id === previousStop.id));
  }

  function handleCameraPointerDown(event: ReactPointerEvent<HTMLElement>) {
    if (!cameraEnabled || isInteractiveTarget(event.target)) return;
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
    if (!cameraEnabled) return;
    event.preventDefault();
    const scale = cameraRef.current.scale * Math.exp(-event.deltaY * .0012);
    commitCamera(zoomJourneyCamera(cameraRef.current, scale, cameraViewport()));
  }

  function handleCameraKeyboard(event: ReactKeyboardEvent<HTMLElement>) {
    if (!cameraEnabled || event.target !== event.currentTarget) return;
    if (event.shiftKey && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
      event.preventDefault();
      const delta = event.key === "ArrowLeft" ? { x: -48, y: 0 }
        : event.key === "ArrowRight" ? { x: 48, y: 0 }
          : event.key === "ArrowUp" ? { x: 0, y: -48 }
            : { x: 0, y: 48 };
      commitCamera(panJourneyCamera(cameraRef.current, delta, cameraViewport()));
      return;
    }
    if (event.key === "ArrowLeft" && (activeDistrictPosition > 0 || activeBeatIndex > 0)) {
      event.preventDefault();
      rewindStory();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      advanceStory();
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
    "--path-offset": `${activeDistrictPosition * -230 - 115}px`,
    "--path-width": `${activeDistrictStops.length * 230}px`,
    "--backdrop-shift": `${activeDistrictStops.length > 1 ? 4 - (activeDistrictPosition / (activeDistrictStops.length - 1)) * 8 : 0}%`,
    "--camera-x": `${camera.x}px`,
    "--camera-y": `${camera.y}px`,
    "--camera-scale": camera.scale,
    "--beat-image-x": `${sceneBeatStage?.focusX ?? 50}%`,
    "--beat-image-y": `${sceneBeatStage?.focusY ?? 50}%`,
    "--beat-image-zoom": sceneBeatStage?.zoom ?? 1.13,
  } as CSSProperties;

  return (
    <main className={styles.shell} data-tone={journey.tone} style={sceneStyle}>
      <div className={styles.space} aria-hidden="true"><span/><span/><span/></div>
      <div className={`${styles.worldBackdrop} ${cameraDragging ? styles.worldBackdropDragging : ""}`} aria-hidden="true" data-scene-asset={backdropAsset}>
        <Image key={backdropAsset} src={backdropAsset} alt="" fill priority sizes="100vw" />
      </div>
      <header className={styles.hud}>
        <Link className={styles.brand} href="/">
          <Image src="/brand/devam-mark.png" alt="" width={38} height={38} priority />
          <span><strong>Devam</strong><small>Return to the universe</small></span>
        </Link>
        <div className={styles.worldName}><small>{journey.hero} world</small><strong>{isRamayanaWorld && (worldLens === "compass" || worldLens === "route") ? "The Ramayana story universe" : activeDistrict?.title[language] ?? journey.title}</strong></div>
        <div className={styles.hudActions}>
          <div className={styles.language} role="group" aria-label="Story language">
            <button type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button>
            <button type="button" aria-pressed={language === "hi"} onClick={() => setLanguage("hi")}>हिं</button>
          </div>
          <button className={styles.sarthi} type="button" onClick={() => {
            setSarthiOpen(true);
            setSarthiInput(isRamayanaWorld && worldLens === "compass"
              ? (language === "hi" ? "रामायण की कथा में आगे कहाँ जाऊँ?" : "Where should I explore next in the Ramayana?")
              : (language === "hi" ? `${activeTitle} की कहानी सरल भाषा में बताइए` : `Tell me the story of ${active.title}`));
          }}>✦ <span>Ask Sārthi</span></button>
        </div>
      </header>

      {isRamayanaWorld && <nav className={styles.lensSwitcher} aria-label="World lens">
        {(["compass", "story", "route", "connections"] as const).map((lens) => <button key={lens} type="button" aria-pressed={worldLens === lens} onClick={() => selectWorldLens(lens)}>{lens === "compass" ? "Whole story" : lens === "story" ? "Play" : lens === "route" ? "Map" : "Connections"}</button>)}
      </nav>}

      <section
        className={styles.viewport}
        aria-label={`${journey.hero} story world`}
        aria-keyshortcuts={cameraEnabled ? "ArrowLeft ArrowRight ArrowUp ArrowDown Shift+ArrowLeft Shift+ArrowRight Shift+ArrowUp Shift+ArrowDown Home 0" : undefined}
        data-camera-scale={camera.scale.toFixed(2)}
        data-camera-x={Math.round(camera.x)}
        data-camera-y={Math.round(camera.y)}
        data-navigable={cameraEnabled ? "true" : undefined}
        onDoubleClick={() => cameraEnabled && commitCamera(zoomJourneyCamera(cameraRef.current, cameraRef.current.scale > 1.08 ? 1 : 1.22, cameraViewport()))}
        onKeyDown={handleCameraKeyboard}
        onPointerCancel={handleCameraPointerEnd}
        onPointerDown={handleCameraPointerDown}
        onPointerMove={handleCameraPointerMove}
        onPointerUp={handleCameraPointerEnd}
        onWheel={handleCameraWheel}
        ref={viewportRef}
        tabIndex={cameraEnabled ? 0 : undefined}
      >
        <div className={styles.horizon} aria-hidden="true" />
        <JourneyBeatStage stage={sceneBeatStage} />
        {isRamayanaWorld && storyWorld && <div hidden={worldLens !== "compass"}><JourneyCompass compass={storyWorld.compass} districts={storyWorld.districts} language={language} onEnterMoment={openStoryMoment} onRequestView={requestCompassView} onSelectTurn={setStoryFocusTurnId} selectedTurnId={storyFocusTurnId} viewRequest={compassViewRequest} /></div>}
        {isRamayanaWorld && storyWorld && <div hidden={worldLens !== "route"}><RamayanaNarrativeMap active={worldLens === "route"} focusTurnId={storyFocusTurnId} language={language} onEnterMoment={openStoryMoment} onOpenWholeStory={openWholeStoryTurn} stops={journey.stops} storyWorld={storyWorld} /></div>}
        {(!isRamayanaWorld || worldLens === "story") && <div className={styles.storyPath} role="list" aria-label="Story scenes">
          {activeDistrictStops.map((stop, districtIndex) => {
            const journeyIndex = journey.stops.findIndex((candidate) => candidate.id === stop.id);
            const selected = journeyIndex === activeIndex;
            const visited = exploredSet.has(stop.id);
            const localizedStop = sceneCopy(stop, language);
            const stopTitle = localizedStop.title ?? stop.title;
            return (
              <button
                type="button"
                role="listitem"
                className={`${styles.storyNode} ${selected ? styles.storyNodeActive : ""} ${visited ? styles.storyNodeVisited : ""}`}
                style={{ "--node-x": `${districtIndex * 230}px`, "--node-y": `${95 + (districtIndex % 2) * 62}px`, "--z": `${(districtIndex % 3) * 34}px` } as CSSProperties}
                onClick={() => travelTo(journeyIndex)}
                aria-current={selected ? "step" : undefined}
                aria-label={`${districtIndex + 1}. ${stopTitle}`}
                key={stop.id}
              >
                <span className={styles.nodeOrbit}/><span className={styles.nodeGlow}/><span className={styles.nodeCore}/>
                <span className={styles.nodeCopy}><small>{String(districtIndex + 1).padStart(2, "0")}</small><strong>{stopTitle}</strong></span>
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

      {cameraEnabled && <div className={styles.cameraControls} role="group" aria-label={`Scene camera controls, ${journeyCameraPercent(camera.scale)}%`}>
        <button type="button" aria-label="Zoom scene out" disabled={camera.scale <= JOURNEY_CAMERA_MIN_SCALE} onClick={() => commitCamera(zoomJourneyCamera(cameraRef.current, cameraRef.current.scale - .1, cameraViewport()))}>−</button>
        <button type="button" aria-label="Reset scene view" disabled={camera.scale === 1 && camera.x === 0 && camera.y === 0} onClick={resetCamera}>◎</button>
        <button type="button" aria-label="Zoom scene in" disabled={camera.scale >= JOURNEY_CAMERA_MAX_SCALE} onClick={() => commitCamera(zoomJourneyCamera(cameraRef.current, cameraRef.current.scale + .1, cameraViewport()))}>+</button>
      </div>}

      {!focusedEncounter && returnEncounter && worldLens === "story" && <button type="button" className={styles.encounterReturn} onClick={returnToEncounterPath}>← {language === "hi" ? `${returnEncounter.label} की कथा-राह पर लौटें` : `Back to ${returnEncounter.label}'s story path`}</button>}

      {!focusedEncounter && (!isRamayanaWorld || worldLens === "story") && <section className={styles.storyBeat} aria-live="polite" lang={language === "hi" ? "hi" : "en"}>
        {active.visual && <div className={styles.sceneContext}><span>{active.visual.location}</span><small>Artistic visualization</small></div>}
        <p>{activeMoment ? activeMoment.decisiveChange[language] : copy.kicker}</p>
        <h1>{activeTitle}</h1>
         {activeDistrictLoading && <small className={styles.retellingLabel}>{language === "hi" ? "पूरा चित्रित दृश्य खुल रहा है…" : "Opening the complete illustrated scene…"}</small>}
         {districtLoadErrorId === activeDistrict?.id && !activeMoment && <small className={styles.retellingLabel}>{language === "hi" ? "विस्तृत कथा अभी नहीं खुल सकी; दृश्य-सार उपलब्ध है।" : "The detailed script could not open; the scene summary remains available."}</small>}
         {activeBeat
          ? <div className={styles.beatNarrative}>
            <small>{language === "hi" ? `दृश्य ${activeBeatIndex + 1} / ${activeMoment.beats.length}` : `Beat ${activeBeatIndex + 1} of ${activeMoment.beats.length}`}</small>
            <strong>{activeBeat.title[language]}</strong>
            <span>{activeBeat.narration[language]}</span>
          </div>
          : <span>{copy.story}</span>}
        {activeMoment && <div className={styles.beatRail} role="group" aria-label={language === "hi" ? "इस दृश्य के कथा-बिंदु" : "Story beats in this scene"}>
          {activeMoment.beats.map((beat, index) => <button
            type="button"
            aria-label={language === "hi" ? `कथा-बिंदु ${index + 1}: ${beat.title.hi}` : `Beat ${index + 1}: ${beat.title.en}`}
            aria-pressed={index === activeBeatIndex}
            onClick={() => setActiveBeatIndex(index)}
            key={beat.id}
          />)}
        </div>}
        {active.visual && <div className={styles.cast} aria-label="Characters in this scene">{active.visual.cast.map((character) => {
          const nodeId = storyWorld?.castNodeIds[character];
          return isRamayanaWorld && nodeId
            ? <button type="button" onClick={() => openEncounter(nodeId)} key={character}>{character}</button>
            : <Link href={`/search?q=${encodeURIComponent(`${character} Ramayana`)}`} key={character}>{character}</Link>;
        })}</div>}
        <small className={styles.retellingLabel}>{language === "hi" ? "देवम की स्रोत-आधारित सरल कथा" : "Devam source-grounded story retelling"}</small>
        <div className={styles.actions}>
          <button type="button" onClick={advanceStory}>{activeMoment && activeBeatIndex < activeMoment.beats.length - 1
            ? (language === "hi" ? "अगला कथा-बिंदु" : "Next story beat")
            : activeDistrictPosition === activeDistrictStops.length - 1 ? (language === "hi" ? "यह यात्रा पूरी करें" : "Complete this path") : copy.invitation}<span>→</span></button>
          {(activeDistrictPosition > 0 || activeBeatIndex > 0) && <button type="button" onClick={rewindStory}>{language === "hi" ? "पीछे" : "Back"}</button>}
        </div>
        <details className={styles.sourceDetails}>
          <summary>{language === "hi" ? "कथा का स्रोत" : "Story source"}</summary>
          <strong>{active.citation.workTitle}</strong>
          <span>{active.citation.editionTitle} · {locatorLabel(active.citation.locator)}</span>
          <small>{journey.sourceBoundary}</small>
        </details>
      </section>}

      {focusedEncounter && <JourneyEncounter
        language={language}
        livingPortalNodeId={storyWorld?.livingPortalNodeIds.includes(focusedEncounter.id) ? focusedEncounter.id : undefined}
        node={focusedEncounter}
        routes={focusedEncounterRoutes}
        storyMoments={focusedStoryMoments}
        trailDepth={encounterTrail.length}
        onBack={backFromEncounter}
        onOpenMoment={openStoryMomentFromEncounter}
        onTravel={openEncounter}
      />}

      {(!isRamayanaWorld || worldLens === "story") && <div className={styles.progress} aria-label={`${activeDistrictExploredCount} of ${activeDistrictStops.length} scenes explored`}>
        {activeDistrictStops.map((stop, districtIndex) => {
          const journeyIndex = journey.stops.findIndex((candidate) => candidate.id === stop.id);
          return <button type="button" aria-label={`Go to scene ${districtIndex + 1}`} onClick={() => travelTo(journeyIndex)} className={journeyIndex === activeIndex ? styles.progressActive : exploredSet.has(stop.id) ? styles.progressVisited : ""} key={stop.id} />;
        })}
      </div>}

      {showGuide && (!isRamayanaWorld || worldLens === "story") && <p className={styles.guide}>{isRamayanaWorld ? "Drag to look · wheel or pinch for depth · → continues" : "Choose a light to move through the story"}</p>}
      {showCompletion && <div className={styles.complete}><span>Illustrated district discovered</span><strong>The story universe continues beyond this route.</strong><div><button type="button" onClick={() => {
        const firstMomentId = activeDistrict?.entryMomentId ?? activeDistrictStops[0]?.id;
        const firstIndex = journey.stops.findIndex((stop) => stop.id === firstMomentId);
        if (firstIndex >= 0) travelTo(firstIndex);
      }}>Replay this district</button>{isRamayanaWorld && <button type="button" onClick={openVisualWorldSelector}>Explore another visual district</button>}<Link href="/">Return to the stars</Link></div></div>}
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
