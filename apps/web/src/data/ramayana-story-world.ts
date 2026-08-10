import { gateways, worldEdges, worldNodes } from "./atlas";
import {
  RAMAYANA_AYODHYA_CAST_NODE_IDS,
  RAMAYANA_AYODHYA_LOCAL_NODES,
  RAMAYANA_AYODHYA_LOCAL_ROUTES,
  RAMAYANA_AYODHYA_MOMENTS,
  RAMAYANA_AYODHYA_SCENE_NODE_IDS,
  RAMAYANA_STORY_DISTRICTS,
} from "./ramayana-ayodhya-exile";
import {
  RAMAYANA_FIRST_RIVERS_CAST_NODE_IDS,
  RAMAYANA_FIRST_RIVERS_DISTRICT,
  RAMAYANA_FIRST_RIVERS_LOCAL_NODES,
  RAMAYANA_FIRST_RIVERS_LOCAL_ROUTES,
  RAMAYANA_FIRST_RIVERS_MOMENTS,
  RAMAYANA_FIRST_RIVERS_SCENE_NODE_IDS,
} from "./ramayana-first-rivers";
import {
  RAMAYANA_EMPTY_THRONE_CAST_NODE_IDS,
  RAMAYANA_EMPTY_THRONE_DISTRICT,
  RAMAYANA_EMPTY_THRONE_LOCAL_NODES,
  RAMAYANA_EMPTY_THRONE_LOCAL_ROUTES,
  RAMAYANA_EMPTY_THRONE_MOMENTS,
  RAMAYANA_EMPTY_THRONE_SCENE_NODE_IDS,
} from "./ramayana-empty-throne";
import {
  RAMAYANA_ROAD_ASKS_HOME_CAST_NODE_IDS,
  RAMAYANA_ROAD_ASKS_HOME_DISTRICT,
  RAMAYANA_ROAD_ASKS_HOME_LOCAL_NODES,
  RAMAYANA_ROAD_ASKS_HOME_LOCAL_ROUTES,
  RAMAYANA_ROAD_ASKS_HOME_MOMENTS,
  RAMAYANA_ROAD_ASKS_HOME_SCENE_NODE_IDS,
} from "./ramayana-road-asks-home";
import {
  RAMAYANA_DEEPER_DANDAKA_CAST_NODE_IDS,
  RAMAYANA_DEEPER_DANDAKA_DISTRICT,
  RAMAYANA_DEEPER_DANDAKA_LOCAL_NODES,
  RAMAYANA_DEEPER_DANDAKA_LOCAL_ROUTES,
  RAMAYANA_DEEPER_DANDAKA_MOMENTS,
  RAMAYANA_DEEPER_DANDAKA_SCENE_NODE_IDS,
} from "./ramayana-deeper-dandaka";
import {
  RAMAYANA_PANCHAVATI_CAST_NODE_IDS,
  RAMAYANA_PANCHAVATI_DISTRICT,
  RAMAYANA_PANCHAVATI_LOCAL_NODES,
  RAMAYANA_PANCHAVATI_LOCAL_ROUTES,
  RAMAYANA_PANCHAVATI_MOMENTS,
  RAMAYANA_PANCHAVATI_SCENE_NODE_IDS,
} from "./ramayana-panchavati-abduction";
import { buildRamayanaCompass } from "./ramayana-compass";
import { RAMAYANA_LIVING_PORTAL_NODE_IDS, RAMAYANA_LIVING_ROUTE_EDGE_IDS_BY_NODE, RAMAYANA_LIVING_ROUTE_ROOT_IDS } from "./ramayana-living-portal-contract";
import type { WorldNodeFamily } from "@/lib/domain/atlas";
import type { StoryMoment, StoryWorldNode, StoryWorldPack, StoryWorldRoute } from "@/lib/domain/story-world";

const sceneNodeIds: StoryWorldPack["sceneNodeIds"] = {
  ...RAMAYANA_AYODHYA_SCENE_NODE_IDS,
  ...RAMAYANA_FIRST_RIVERS_SCENE_NODE_IDS,
  ...RAMAYANA_EMPTY_THRONE_SCENE_NODE_IDS,
  ...RAMAYANA_ROAD_ASKS_HOME_SCENE_NODE_IDS,
  ...RAMAYANA_DEEPER_DANDAKA_SCENE_NODE_IDS,
  ...RAMAYANA_PANCHAVATI_SCENE_NODE_IDS,
  "leave-lanka": ["pushpaka-departure-lanka", "lanka-story-world", "vibhishana", "rama", "sita"],
  "sky-road": ["remembered-homeward-route", "rama", "sita", "kishkindha-story-world", "bridge-to-lanka"],
  "bharadvaja-hermitage": ["bharadvaja-homecoming-counsel", "bharadvaja", "bharadvaja-hermitage-story-world", "rama", "ayodhya"],
  "hanuman-goes-ahead": ["hanuman-carries-homecoming-message", "hanuman", "guha", "bharata", "nandigrama-story-world"],
  "bharata-hears": ["bharata-hears-return", "bharata", "hanuman", "shatrughna", "nandigrama-story-world"],
  "ayodhya-prepares": ["ayodhya-prepares-homecoming", "ayodhya", "bharata", "shatrughna"],
  "kingdom-returned": ["rama-coronation-return", "rama", "sita", "bharata", "vasishta", "ayodhya", "diwali"],
};

const castNodeIds: StoryWorldPack["castNodeIds"] = {
  ...RAMAYANA_AYODHYA_CAST_NODE_IDS,
  ...RAMAYANA_FIRST_RIVERS_CAST_NODE_IDS,
  ...RAMAYANA_EMPTY_THRONE_CAST_NODE_IDS,
  ...RAMAYANA_ROAD_ASKS_HOME_CAST_NODE_IDS,
  ...RAMAYANA_DEEPER_DANDAKA_CAST_NODE_IDS,
  ...RAMAYANA_PANCHAVATI_CAST_NODE_IDS,
  Rama: "rama",
  Sita: "sita",
  Lakshmana: "lakshmana",
  Hanuman: "hanuman",
  Sugriva: "sugriva",
  Vibhishana: "vibhishana",
  Bharadvaja: "bharadvaja",
  Guha: "guha",
  Bharata: "bharata",
  Shatrughna: "shatrughna",
  Vasishta: "vasishta",
};

const moments: Record<string, StoryMoment> = {
  ...RAMAYANA_AYODHYA_MOMENTS,
  ...RAMAYANA_FIRST_RIVERS_MOMENTS,
  ...RAMAYANA_EMPTY_THRONE_MOMENTS,
  ...RAMAYANA_ROAD_ASKS_HOME_MOMENTS,
  ...RAMAYANA_DEEPER_DANDAKA_MOMENTS,
  ...RAMAYANA_PANCHAVATI_MOMENTS,
  "leave-lanka": {
    id: "leave-lanka",
    decisiveChange: { en: "Victory becomes a shared journey home.", hi: "विजय अब सबकी साझा घर-वापसी बनती है।" },
    beats: [
      { id: "honour-the-allies", title: { en: "Before anyone leaves", hi: "प्रस्थान से पहले" }, narration: { en: "Vibhishana asks what remains to be done. Rama's first answer is not about himself: honour the vanaras and bears who risked their lives in the war.", hi: "विभीषण पूछते हैं कि अब क्या करना बाकी है। राम का पहला उत्तर अपने लिए नहीं है—उन वानरों और भालुओं का सम्मान हो जिन्होंने युद्ध में अपना जीवन दाँव पर लगाया।" }, visualCue: "Jewels and gifts pass through the gathered allied camp at dawn.", characterIds: ["rama", "vibhishana", "sugriva"] },
      { id: "friends-ask-to-come", title: { en: "One more request", hi: "एक और आग्रह" }, narration: { en: "Rama releases his allies to their own homes. They ask instead to travel with him, see Ayodhya, witness the coronation, and only then depart.", hi: "राम अपने साथियों को उनके घर लौटने की अनुमति देते हैं। वे आग्रह करते हैं कि पहले उनके साथ अयोध्या चलें, राज्याभिषेक देखें, फिर विदा हों।" }, visualCue: "The company closes around the waiting Pushpaka instead of dispersing.", characterIds: ["rama", "sugriva", "vibhishana"] },
      { id: "sita-and-lakshmana-board", title: { en: "The returning company gathers", hi: "वापसी का दल जुटता है" }, narration: { en: "Sita and Lakshmana board with Rama. Sugriva, Vibhishana, vanaras, bears, and rakshasa companions fill the extraordinary craft without being left behind.", hi: "सीता और लक्ष्मण राम के साथ चढ़ते हैं। सुग्रीव, विभीषण, वानर, भालू और राक्षस साथी भी उस अद्भुत विमान में स्थान पाते हैं।" }, visualCue: "Layered silhouettes gather inside a vast flower-decked airborne hall.", characterIds: ["rama", "sita", "lakshmana", "sugriva", "vibhishana"] },
      { id: "pushpaka-rises", title: { en: "Lanka falls away", hi: "लंका पीछे छूटती है" }, narration: { en: "At Rama's command, the Pushpaka rises into the sky. For the first time since the exile began, home is not only a hope—it is the direction of travel.", hi: "राम के आदेश पर पुष्पक आकाश में उठता है। वनवास शुरू होने के बाद पहली बार घर केवल आशा नहीं, यात्रा की दिशा बन जाता है।" }, visualCue: "The Lanka skyline recedes beneath a rising field of warm cloud and light.", characterIds: ["rama", "sita", "lakshmana"] },
    ],
  },
  "sky-road": {
    id: "sky-road",
    decisiveChange: { en: "The route home becomes a map of everything the travellers survived.", hi: "घर की राह उनके पूरे संघर्ष का जीवित मानचित्र बन जाती है।" },
    beats: [
      { id: "battlefield-and-bridge", title: { en: "The cost below", hi: "नीचे छूटी कीमत" }, narration: { en: "Rama shows Sita Lanka, the battlefield, the ocean, and the bridge. Each place carries the memory of companions, losses, choices, and the effort made to find her.", hi: "राम सीता को लंका, युद्धभूमि, समुद्र और सेतु दिखाते हैं। हर स्थान साथियों, हानि, निर्णय और उन्हें खोजने के प्रयास की स्मृति लिए है।" }, visualCue: "The viewpoint glides from the dim battlefield to the bright line of the bridge.", characterIds: ["rama", "sita", "lakshmana", "hanuman"] },
      { id: "kishkindha-companions", title: { en: "The journey grows", hi: "यात्रा का दल बढ़ता है" }, narration: { en: "At Kishkindha, Sita asks that Tara and the other vanara women join them. The homecoming expands again: it will be witnessed by the families behind the alliance.", hi: "किष्किंधा में सीता चाहती हैं कि तारा और अन्य वानर स्त्रियाँ भी साथ चलें। घर-वापसी फिर बड़ी हो जाती है—अब गठबंधन के पीछे खड़े परिवार भी उसके साक्षी होंगे।" }, visualCue: "A pause over green Kishkindha as a new group boards amid movement and colour.", characterIds: ["sita", "sugriva"] },
      { id: "places-become-memories", title: { en: "A story written across the land", hi: "धरती पर लिखी कथा" }, narration: { en: "Rishyamuka, Pampa, Panchavati, the Godavari, Chitrakuta, Yamuna, Ganga, and Shringavera appear below. The names are not a list: friendship, grief, abduction, searching, and endurance return with them.", hi: "ऋष्यमूक, पम्पा, पंचवटी, गोदावरी, चित्रकूट, यमुना, गंगा और शृंगवेरपुर नीचे उभरते हैं। ये केवल नाम नहीं—मित्रता, शोक, हरण, खोज और धैर्य फिर जीवित होते हैं।" }, visualCue: "Landmarks ignite one by one along a flowing aerial route, each with a brief story echo.", characterIds: ["rama", "sita", "lakshmana"] },
      { id: "ayodhya-in-sight", title: { en: "Home appears", hi: "घर दिखाई देता है" }, narration: { en: "Ayodhya finally comes into view. Rama asks Sita to bow toward it, and the whole company rises to look at the city they have crossed an epic to reach.", hi: "अंततः अयोध्या दिखाई देती है। राम सीता से उसे प्रणाम करने को कहते हैं, और पूरा दल उस नगरी को देखने उठ खड़ा होता है जहाँ पहुँचने के लिए उन्होंने एक महाकाव्य पार किया है।" }, visualCue: "A distant luminous city emerges through cloud while the travellers rise together.", characterIds: ["rama", "sita", "lakshmana"] },
    ],
  },
  "bharadvaja-hermitage": {
    id: "bharadvaja-hermitage",
    decisiveChange: { en: "After fourteen years, Rama learns that Bharata is still waiting.", hi: "चौदह वर्ष बाद राम जान पाते हैं कि भरत अब भी प्रतीक्षा कर रहे हैं।" },
    beats: [
      { id: "fourteen-years-complete", title: { en: "The vow reaches its edge", hi: "प्रतिज्ञा की अवधि पूरी" }, narration: { en: "With the fourteen years complete, Rama reaches Bharadvaja's hermitage and bows. Before asking about celebration or power, he asks whether Ayodhya is well, Bharata still protects it, and his mothers live.", hi: "चौदह वर्ष पूरे होने पर राम भरद्वाज के आश्रम पहुँचकर प्रणाम करते हैं। उत्सव या सत्ता से पहले वे पूछते हैं—क्या अयोध्या कुशल है, क्या भरत अब भी उसकी रक्षा कर रहे हैं, क्या उनकी माताएँ जीवित हैं।" }, visualCue: "The bright craft settles beyond a quiet hermitage at the end of a long road.", characterIds: ["rama", "bharadvaja"] },
      { id: "bharata-waits", title: { en: "The sandals still lead", hi: "पादुकाएँ अब भी आगे हैं" }, narration: { en: "Bharadvaja answers that Bharata waits with matted hair, honouring Rama's sandals and ruling in obedience to his command. The household is safe.", hi: "भरद्वाज बताते हैं कि भरत जटाएँ धारण किए राम की पादुकाओं का सम्मान करते हुए उनकी आज्ञा के अनुसार राज्य संभाल रहे हैं। राजपरिवार सुरक्षित है।" }, visualCue: "A vision of Nandigrama appears: sandals before a waiting figure in bark cloth.", characterIds: ["bharadvaja", "bharata", "rama"] },
      { id: "the-journey-is-known", title: { en: "Nothing was unseen", hi: "कुछ भी अनदेखा नहीं रहा" }, narration: { en: "The sage recounts the exile's great turns—Sita's abduction, Sugriva's alliance, Hanuman's search, the bridge, and Ravana's defeat. Rama arrives not as a rumour but as someone whose ordeal is understood.", hi: "ऋषि वनवास के बड़े मोड़ गिनाते हैं—सीता का हरण, सुग्रीव से मैत्री, हनुमान की खोज, सेतु और रावण की पराजय। राम किसी अफवाह की तरह नहीं, समझे गए संघर्ष के साथ लौटते हैं।" }, visualCue: "Brief layered echoes of forest, ocean, bridge, and battle orbit the listeners.", characterIds: ["bharadvaja", "rama", "sita", "hanuman", "sugriva"] },
      { id: "road-of-fruit", title: { en: "Hospitality for the whole company", hi: "पूरे दल के लिए आतिथ्य" }, narration: { en: "Rama asks for one boon: let the road ahead bear fruit and honey for his companions. The trees flower out of season, and the weary vanaras find abundance on the final approach.", hi: "राम एक वर माँगते हैं—आगे की राह पर उनके साथियों के लिए फल और मधु उपलब्ध हों। वृक्ष असमय फूल-फल उठते हैं और अंतिम पड़ाव पर थके वानरों को भरपूर आहार मिलता है।" }, visualCue: "Dry branches transform into a luminous orchard as the company moves beneath them.", characterIds: ["rama", "bharadvaja"] },
    ],
  },
  "hanuman-goes-ahead": {
    id: "hanuman-goes-ahead",
    decisiveChange: { en: "The last distance is crossed first by a trusted messenger.", hi: "अंतिम दूरी सबसे पहले एक विश्वस्त संदेशवाहक पार करता है।" },
    beats: [
      { id: "read-bharatas-heart", title: { en: "A delicate mission", hi: "एक संवेदनशील दायित्व" }, narration: { en: "Rama sends Hanuman ahead not only to announce the return, but to observe Bharata's face, words, and wishes. Fourteen years with a kingdom could have changed anyone.", hi: "राम हनुमान को केवल वापसी का समाचार देने नहीं, भरत के चेहरे, शब्द और इच्छा को समझने भी भेजते हैं। चौदह वर्ष और एक राज्य किसी को भी बदल सकते थे।" }, visualCue: "Rama gives quiet instructions while Ayodhya glows beyond the horizon.", characterIds: ["rama", "hanuman", "bharata"] },
      { id: "news-for-guha", title: { en: "An old friendship is remembered", hi: "पुरानी मित्रता याद रहती है" }, narration: { en: "Hanuman first reaches Guha at Shringavera and tells him that his friend Rama is safe and near. The return follows the same human bonds that once helped the exiles leave.", hi: "हनुमान पहले शृंगवेरपुर में गुह के पास पहुँचकर बताते हैं कि उनके मित्र राम सुरक्षित और निकट हैं। वापसी उन्हीं मानवीय संबंधों से होकर गुजरती है जिन्होंने वनवास के आरंभ में सहारा दिया था।" }, visualCue: "A swift figure lands beside the river settlement as recognition spreads.", characterIds: ["hanuman", "guha", "rama"] },
      { id: "nandigrama-waiting", title: { en: "The ruler who never took the throne", hi: "जिसने सिंहासन नहीं लिया" }, narration: { en: "At Nandigrama, Hanuman finds Bharata thin from restraint, dressed like an ascetic, ruling with Rama's sandals before him. The years of waiting are visible before a word is spoken.", hi: "नंदिग्राम में हनुमान भरत को संयम से क्षीण, तपस्वी वेश में और सामने राम की पादुकाएँ रखकर शासन करते देखते हैं। एक शब्द बोले जाने से पहले ही वर्षों की प्रतीक्षा दिखाई देती है।" }, visualCue: "The sandals hold the foreground; the waiting prince sits beyond them in a spare hermitage court.", characterIds: ["hanuman", "bharata"] },
      { id: "the-message-lands", title: { en: "Grief breaks into joy", hi: "शोक आनंद में टूटता है" }, narration: { en: "Hanuman says that Rama has defeated Ravana, recovered Sita, and returned with Lakshmana and his allies. Bharata collapses in sudden joy, then rises to hear everything.", hi: "हनुमान बताते हैं कि राम ने रावण को पराजित किया, सीता को वापस पाया और लक्ष्मण व साथियों के साथ लौट आए हैं। भरत अचानक आनंद से मूर्छित हो जाते हैं, फिर उठकर पूरी कथा सुनना चाहते हैं।" }, visualCue: "The austere stillness breaks as attendants rush forward and hope floods the scene.", characterIds: ["hanuman", "bharata", "rama", "sita", "lakshmana"] },
    ],
  },
  "bharata-hears": {
    id: "bharata-hears",
    decisiveChange: { en: "A distant victory becomes a story Bharata can finally hold.", hi: "दूर की विजय अब भरत के सामने पूरी कथा बनकर आती है।" },
    beats: [
      { id: "tell-me-how", title: { en: "How did this become possible?", hi: "यह सब कैसे संभव हुआ?" }, narration: { en: "Bharata does not stop at the headline that Rama lives. He asks Hanuman how Rama met the vanaras and how the years after Chitrakuta unfolded.", hi: "भरत केवल यह सुनकर नहीं रुकते कि राम जीवित हैं। वे हनुमान से पूछते हैं कि राम वानरों से कैसे मिले और चित्रकूट के बाद के वर्ष कैसे बीते।" }, visualCue: "Bharata and Hanuman sit close while the waiting court falls silent.", characterIds: ["bharata", "hanuman"] },
      { id: "forest-turns", title: { en: "The road through loss", hi: "हानि से गुजरती राह" }, narration: { en: "Hanuman tells of the forest dangers, Surpanakha, the golden deer, Sita's abduction, and Jatayu's fall. The reunion ahead is measured against what was taken away.", hi: "हनुमान वन के संकट, शूर्पणखा, स्वर्ण-मृग, सीता के हरण और जटायु के पतन की कथा कहते हैं। आने वाला मिलन अब उस सबके सामने दिखाई देता है जो छिन गया था।" }, visualCue: "Story shadows move across the ground: deer, empty hut, wing, and southward trail.", characterIds: ["hanuman", "rama", "sita", "lakshmana"] },
      { id: "alliance-and-search", title: { en: "Strangers become the search", hi: "अजनबी खोज के साथी बनते हैं" }, narration: { en: "He recounts the meeting with Sugriva, the vanara search, Sampati's clue, his own leap to Lanka, Sita in the ashoka grove, and the ring that proved Rama had found a path to her.", hi: "वे सुग्रीव से भेंट, वानर दलों की खोज, संपाती के संकेत, अपनी लंका-छलाँग, अशोक-वाटिका में सीता और राम की मुद्रिका की कथा सुनाते हैं।" }, visualCue: "The spoken story opens into a moving arc from Kishkindha across the ocean to the ashoka grove.", characterIds: ["hanuman", "sugriva", "sita", "rama"] },
      { id: "bridge-battle-return", title: { en: "The whole road closes", hi: "पूरी राह एक साथ जुड़ती है" }, narration: { en: "The bridge, the battle, Ravana's defeat, and the Pushpaka return bring the account to the present. Bharata folds his hands: after so long, the desire to see Rama can finally be fulfilled.", hi: "सेतु, युद्ध, रावण की पराजय और पुष्पक से वापसी कथा को वर्तमान तक ले आते हैं। भरत हाथ जोड़ते हैं—इतने लंबे समय बाद राम को देखने की इच्छा अब पूरी होगी।" }, visualCue: "The story's moving images resolve into the real dust of the approaching company.", characterIds: ["bharata", "hanuman", "rama"] },
    ],
  },
  "ayodhya-prepares": {
    id: "ayodhya-prepares",
    decisiveChange: { en: "Private waiting becomes a public homecoming.", hi: "निजी प्रतीक्षा अब पूरे नगर की घर-वापसी बनती है।" },
    beats: [
      { id: "city-awakens", title: { en: "Tell everyone", hi: "सबको समाचार दो" }, narration: { en: "Bharata orders worship, music, and a welcome open to the royal household, soldiers, families, artists, and citizens. Rama's return belongs to the city, not only the palace.", hi: "भरत पूजा, संगीत और ऐसा स्वागत तैयार करने का आदेश देते हैं जिसमें राजपरिवार, सैनिक, परिवार, कलाकार और नागरिक सब शामिल हों। राम की वापसी केवल महल की नहीं, पूरे नगर की है।" }, visualCue: "Courtyards ignite with preparation as messengers fan across Ayodhya.", characterIds: ["bharata", "shatrughna"] },
      { id: "prepare-the-road", title: { en: "A road made ready", hi: "राह सजती है" }, narration: { en: "Shatrughna has the route from Nandigrama levelled, watered, strewn with flowers, and lined with flags. The landscape itself becomes part of the welcome.", hi: "शत्रुघ्न नंदिग्राम से आने वाली राह समतल और जल-सिंचित करवाते हैं; फूल बिखरते हैं और ध्वज लगते हैं। भू-दृश्य स्वयं स्वागत का हिस्सा बन जाता है।" }, visualCue: "Workers, water, flowers, and standards transform the road in layered motion.", characterIds: ["shatrughna", "bharata"] },
      { id: "sandals-lead-procession", title: { en: "The promise goes first", hi: "प्रतिज्ञा सबसे आगे" }, narration: { en: "Still dressed in bark, Bharata carries Rama's sandals on his head as the queens, ministers, citizens, horses, chariots, and elephants move toward Nandigrama.", hi: "अब भी वल्कल पहने भरत राम की पादुकाएँ सिर पर रखते हैं। रानियाँ, मंत्री, नागरिक, घोड़े, रथ और हाथी नंदिग्राम की ओर बढ़ते हैं।" }, visualCue: "The sandals form the luminous centre of a vast procession moving through dust and music.", characterIds: ["bharata", "shatrughna"] },
      { id: "brothers-meet", title: { en: "The distance ends", hi: "दूरी समाप्त होती है" }, narration: { en: "The Pushpaka descends. Rama lifts Bharata into an embrace; Bharata greets Sita, Lakshmana, and the allies, then places the sandals back at Rama's feet and returns the kingdom held in trust.", hi: "पुष्पक उतरता है। राम भरत को उठाकर गले लगाते हैं; भरत सीता, लक्ष्मण और साथियों का स्वागत करते हैं, फिर पादुकाएँ राम के चरणों में रखकर धरोहर की तरह संभाला राज्य लौटा देते हैं।" }, visualCue: "The two moving worlds meet around an embrace, then settle around the returned sandals.", characterIds: ["rama", "bharata", "sita", "lakshmana", "sugriva", "vibhishana"] },
    ],
  },
  "kingdom-returned": {
    id: "kingdom-returned",
    decisiveChange: { en: "Homecoming becomes the acceptance of public responsibility.", hi: "घर-वापसी सार्वजनिक उत्तरदायित्व स्वीकार करने में बदलती है।" },
    beats: [
      { id: "bharata-returns-burden", title: { en: "Take back what I guarded", hi: "जिसे संभाला, उसे वापस लो" }, narration: { en: "Bharata tells Rama that the kingdom was never his possession and that he cannot carry its burden in Rama's place. Rama answers, 'So be it.'", hi: "भरत राम से कहते हैं कि राज्य कभी उनकी संपत्ति नहीं था और वे राम के स्थान पर उसका भार नहीं उठा सकते। राम स्वीकार करते हैं।" }, visualCue: "Bharata speaks before the gathered household while Rama listens from a low seat.", characterIds: ["bharata", "rama"] },
      { id: "exile-clothes-fall-away", title: { en: "The signs of exile are removed", hi: "वनवास के चिह्न उतरते हैं" }, narration: { en: "Rama, Lakshmana, Bharata, Sugriva, and Vibhishana bathe; the matted hair is cut and ceremonial clothes are prepared. Sita and the vanara women are adorned for the entry.", hi: "राम, लक्ष्मण, भरत, सुग्रीव और विभीषण स्नान करते हैं; जटाएँ काटी जाती हैं और राजकीय वस्त्र तैयार होते हैं। सीता और वानर स्त्रियाँ नगर-प्रवेश के लिए सजती हैं।" }, visualCue: "Bark, dust, water, cloth, and ornaments mark a visible transition between lives.", characterIds: ["rama", "sita", "lakshmana", "bharata", "sugriva", "vibhishana"] },
      { id: "city-entry", title: { en: "Ayodhya receives the whole story", hi: "अयोध्या पूरी कथा का स्वागत करती है" }, narration: { en: "Music and crowds accompany the entry. Rama publicly tells Ayodhya about Sugriva's friendship, Hanuman's prowess, and the work of the allies, so the victory is not reduced to one hero.", hi: "संगीत और जनसमूह नगर-प्रवेश के साथ चलते हैं। राम अयोध्या को सुग्रीव की मित्रता, हनुमान के पराक्रम और सभी साथियों के कार्य बताते हैं, ताकि विजय केवल एक नायक की न रह जाए।" }, visualCue: "The procession enters beneath flags while brief visions of the allies' deeds rise over the crowd.", characterIds: ["rama", "hanuman", "sugriva", "vibhishana"] },
      { id: "coronation-and-gifts", title: { en: "A crown, then gratitude", hi: "मुकुट, फिर कृतज्ञता" }, narration: { en: "Vasishta and the gathered officiants install Rama with Sita beside him. Honours move outward to the allies; Sita gives Hanuman the pearl necklace, remembering his service.", hi: "वसिष्ठ और अन्य आचार्य सीता के साथ राम का राज्याभिषेक करते हैं। सम्मान साथियों तक पहुँचता है; सीता हनुमान की सेवा याद कर उन्हें मोतियों का हार देती हैं।" }, visualCue: "Water, crown, white umbrellas, and the pearl necklace form four bright visual beats.", characterIds: ["rama", "sita", "vasishta", "hanuman", "sugriva", "vibhishana"] },
      { id: "rule-begins", title: { en: "The ending opens into duty", hi: "अंत से कर्तव्य शुरू होता है" }, narration: { en: "The companions eventually return to their own worlds, and governance begins. The selected telling closes with an idealized vision of Rama's reign; Devam presents that as this source's sacred narrative, not a modern historical statistic.", hi: "साथी अंततः अपने-अपने लोक लौटते हैं और शासन आरंभ होता है। चुना हुआ पाठ राम-राज्य की आदर्श छवि के साथ समाप्त होता है; देवम इसे इसी स्रोत की पवित्र कथा मानता है, आधुनिक ऐतिहासिक आँकड़ा नहीं।" }, visualCue: "Departing paths spread from Ayodhya as the city settles into a dawn panorama.", characterIds: ["rama", "bharata", "lakshmana", "sugriva", "vibhishana"] },
    ],
  },
};

const storyDistricts = [
  RAMAYANA_STORY_DISTRICTS[0],
  RAMAYANA_FIRST_RIVERS_DISTRICT,
  RAMAYANA_EMPTY_THRONE_DISTRICT,
  RAMAYANA_ROAD_ASKS_HOME_DISTRICT,
  RAMAYANA_DEEPER_DANDAKA_DISTRICT,
  RAMAYANA_PANCHAVATI_DISTRICT,
  RAMAYANA_STORY_DISTRICTS[1],
];

const gatewayFamily: WorldNodeFamily = "event_story";
const routeLimit = 8;
const routeRootIds = ["return-to-ayodhya"];

function resolveNode(id: string): StoryWorldNode | null {
  const localNode = RAMAYANA_AYODHYA_LOCAL_NODES[id]
    ?? RAMAYANA_FIRST_RIVERS_LOCAL_NODES[id]
    ?? RAMAYANA_EMPTY_THRONE_LOCAL_NODES[id]
    ?? RAMAYANA_ROAD_ASKS_HOME_LOCAL_NODES[id]
    ?? RAMAYANA_DEEPER_DANDAKA_LOCAL_NODES[id]
    ?? RAMAYANA_PANCHAVATI_LOCAL_NODES[id];
  if (localNode) return localNode;
  const node = worldNodes.find((candidate) => candidate.id === id);
  if (node) return node;
  const gateway = gateways.find((candidate) => candidate.id === id);
  if (!gateway) return null;
  return {
    id: gateway.id,
    label: gateway.title,
    kind: "Master world",
    family: gatewayFamily,
    summary: gateway.invitation,
    searchQuery: gateway.title,
    evidenceBoundary: "This is a master exploration doorway. Every story, place, practice, source, and cross-world route inside it retains its own evidence and scope boundary.",
    gateway: true,
  };
}

function compileRoutes(nodeId: string, allowedEdgeIds?: string[]): StoryWorldRoute[] {
  const seen = new Set<string>();
  const routes: StoryWorldRoute[] = [];
  for (const edge of worldEdges) {
    if (allowedEdgeIds && !allowedEdgeIds.includes(edge.id)) continue;
    if (edge.from !== nodeId && edge.to !== nodeId) continue;
    const destinationId = edge.from === nodeId ? edge.to : edge.from;
    if (seen.has(destinationId)) continue;
    const destination = resolveNode(destinationId);
    if (!destination) continue;
    seen.add(destinationId);
    routes.push({
      id: edge.id,
      relation: edge.relation,
      relationKind: edge.relationKind,
      sourceRef: edge.sourceRef,
      destinationId,
    });
    if (routes.length >= routeLimit) break;
  }
  return routes;
}

export function buildRamayanaStoryWorldPack(): StoryWorldPack {
  const nodes: StoryWorldPack["nodes"] = {};
  const routes: StoryWorldPack["routes"] = {};
  const nodeMomentIds: StoryWorldPack["nodeMomentIds"] = {};
  const routeRoots = new Set([
    ...Object.values(sceneNodeIds).flat(),
    ...Object.values(castNodeIds),
    ...RAMAYANA_LIVING_ROUTE_ROOT_IDS,
    ...routeRootIds,
  ]);

  for (const nodeId of routeRoots) {
    const node = resolveNode(nodeId);
    if (!node) continue;
    nodes[nodeId] = node;
    const nodeRoutes = [
      ...(RAMAYANA_AYODHYA_LOCAL_ROUTES[nodeId] ?? []),
      ...(RAMAYANA_FIRST_RIVERS_LOCAL_ROUTES[nodeId] ?? []),
      ...(RAMAYANA_EMPTY_THRONE_LOCAL_ROUTES[nodeId] ?? []),
      ...(RAMAYANA_ROAD_ASKS_HOME_LOCAL_ROUTES[nodeId] ?? []),
      ...(RAMAYANA_DEEPER_DANDAKA_LOCAL_ROUTES[nodeId] ?? []),
      ...(RAMAYANA_PANCHAVATI_LOCAL_ROUTES[nodeId] ?? []),
      ...compileRoutes(nodeId, RAMAYANA_LIVING_ROUTE_EDGE_IDS_BY_NODE[nodeId]),
    ].slice(0, routeLimit);
    routes[nodeId] = nodeRoutes;
    for (const route of nodeRoutes) {
      const destination = resolveNode(route.destinationId);
      if (destination) nodes[destination.id] = destination;
    }
  }

  for (const [momentId, nodeIds] of Object.entries(sceneNodeIds)) {
    for (const nodeId of nodeIds) {
      nodeMomentIds[nodeId] = [...(nodeMomentIds[nodeId] ?? []), momentId];
    }
  }

  return {
    id: "ramayana-story-world-v5",
    compass: buildRamayanaCompass(),
    districts: storyDistricts,
    sceneNodeIds,
    nodeMomentIds,
    castNodeIds,
    momentPreviews: Object.fromEntries(Object.entries(moments).map(([momentId, moment]) => [momentId, moment.decisiveChange])),
    moments: {},
    livingPortalNodeIds: [...RAMAYANA_LIVING_PORTAL_NODE_IDS],
    nodes,
    routes,
  };
}

export function getRamayanaDistrictMoments(districtId: string): Record<string, StoryMoment> | null {
  const district = storyDistricts.find((candidate) => candidate.id === districtId);
  if (!district) return null;
  return Object.fromEntries(district.momentIds.map((momentId) => [momentId, moments[momentId]]));
}
