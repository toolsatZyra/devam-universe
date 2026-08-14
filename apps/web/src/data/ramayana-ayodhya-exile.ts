import type {
  StoryDistrict,
  StoryMoment,
  StoryWorldNode,
  StoryWorldRoute,
} from "@/lib/domain/story-world";

export const RAMAYANA_AYODHYA_SCENE_NODE_IDS: Record<string, string[]> = {
  "coronation-dawn": ["coronation-dawn-event", "ayodhya", "king-dasharatha", "rama", "sita", "vasishta"],
  "manthara-sees-city": ["manthara-sees-city-event", "ayodhya", "manthara", "kaikeyi"],
  "fear-becomes-demands": ["fear-becomes-demands-event", "ayodhya", "kaikeyi-chamber", "manthara", "kaikeyi", "king-dasharatha"],
  "king-trapped-by-word": ["king-trapped-by-word-event", "ayodhya", "kaikeyi-chamber", "king-dasharatha", "kaikeyi"],
  "rama-crosses-celebration": ["rama-crosses-celebration-event", "ayodhya", "rama", "king-dasharatha", "kaikeyi"],
  "rama-accepts-exile": ["rama-accepts-exile-event", "ayodhya", "forest-exile", "rama", "kausalya", "lakshmana"],
  "sita-chooses-road": ["sita-chooses-road-event", "ayodhya", "forest-exile", "sita", "rama"],
  "lakshmana-joins": ["lakshmana-joins-event", "ayodhya", "forest-exile", "lakshmana", "rama", "sita", "kausalya"],
};

export const RAMAYANA_AYODHYA_CAST_NODE_IDS: Record<string, string> = {
  Dasharatha: "king-dasharatha",
  Kaikeyi: "kaikeyi",
  Kausalya: "kausalya",
  Manthara: "manthara",
};

const eventNodes: StoryWorldNode[] = [
  ["coronation-dawn-event", "A coronation dawns", "Ayodhya prepares for Rama's installation while the household completes a night of restraint and prayer."],
  ["manthara-sees-city-event", "Manthara sees the celebration", "A decorated city becomes alarming news inside Kaikeyi's apartments."],
  ["fear-becomes-demands-event", "Fear becomes two demands", "Manthara's argument reshapes Kaikeyi's joy into two demands built on an old promise."],
  ["king-trapped-by-word-event", "The king is trapped by his word", "Dasharatha's promise collides with the demand to install Bharata and exile Rama."],
  ["rama-crosses-celebration-event", "Rama crosses a city still celebrating", "Rama walks through coronation preparations toward a chamber where the future has already changed."],
  ["rama-accepts-exile-event", "Rama accepts exile", "Rama chooses immediate departure rather than contesting the command, then carries the news to Kausalya."],
  ["sita-chooses-road-event", "Sita chooses the road", "Sita refuses the passive safety of remaining behind and argues for sharing the forest journey."],
  ["lakshmana-joins-event", "Lakshmana joins the departing family", "Lakshmana chooses to accompany Rama and Sita as coronation garments give way to travel preparations."],
].map(([id, label, summary]) => ({
  id,
  label,
  kind: "Story event",
  family: "event_story",
  summary,
  searchQuery: `${label} Ramayana Ayodhya Kanda`,
  evidenceBoundary: "This event is a Devam retelling bounded to the selected Manmatha Nath Dutt Project Gutenberg electronic edition. It is not every Ramayana telling, a historical reconstruction, or a universal ethical judgment.",
}));

const characterNodes: StoryWorldNode[] = [
  {
    id: "manthara",
    label: "Manthara",
    kind: "Narrative character",
    family: "being_person",
    summary: "Follow the attendant whose interpretation of the coming coronation turns celebration into political fear.",
    searchQuery: "Manthara Ramayana Ayodhya Kanda",
    evidenceBoundary: "This character path follows one selected English edition and does not collapse performance traditions, later retellings, or interpretive judgments into a universal biography.",
  },
  {
    id: "kaikeyi",
    label: "Kaikeyi",
    kind: "Narrative queen",
    family: "being_person",
    summary: "Meet Kaikeyi first rejoicing at Rama's coronation, then follow the argument and old promise that reshape her decision.",
    searchQuery: "Kaikeyi Ramayana Ayodhya Kanda",
    evidenceBoundary: "This route preserves the selected edition's sequence and does not reduce Kaikeyi to a single motive or claim one reading for every Ramayana tradition.",
  },
  {
    id: "kausalya",
    label: "Kausalya",
    kind: "Narrative queen",
    family: "being_person",
    summary: "Enter the family rupture through Kausalya as expected coronation becomes farewell and blessing.",
    searchQuery: "Kausalya Rama exile Ayodhya Kanda",
    evidenceBoundary: "This is an edition-scoped narrative path, not a complete account of Kausalya across texts, regions, performance, or theology.",
  },
  {
    id: "kaikeyi-chamber",
    label: "Kaikeyi's chamber",
    kind: "Narrative place",
    family: "place_polity",
    summary: "A private palace room where an old promise changes the public future of Ayodhya.",
    searchQuery: "Kaikeyi chamber two boons Ramayana",
    evidenceBoundary: "This is a narrative-space doorway in the selected edition, not an archaeological location or historical floor plan.",
  },
];

export const RAMAYANA_AYODHYA_LOCAL_NODES: Record<string, StoryWorldNode> = Object.fromEntries(
  [...eventNodes, ...characterNodes].map((node) => [node.id, node]),
);

const route = (id: string, relation: string, relationKind: StoryWorldRoute["relationKind"], destinationId: string): StoryWorldRoute => ({
  id,
  relation,
  relationKind,
  destinationId,
  sourceRef: "sha256:7d3b9e1613d60dfacea39f2564243e943cf38703eadb7245d92337b238082034",
});

export const RAMAYANA_AYODHYA_LOCAL_ROUTES: Record<string, StoryWorldRoute[]> = Object.fromEntries(
  Object.entries(RAMAYANA_AYODHYA_SCENE_NODE_IDS).map(([, nodeIds]) => {
    const eventId = nodeIds[0];
    const characterIds = nodeIds.slice(2).filter((nodeId) => nodeId !== "forest-exile" && nodeId !== "kaikeyi-chamber");
    return [eventId, [
      route(`${eventId}-to-ayodhya`, "unfolds in the Ayodhya story world", "place", "ayodhya"),
      ...characterIds.slice(0, 6).map((nodeId) => route(`${eventId}-to-${nodeId}`, "changes the road of", "story", nodeId)),
      ...(nodeIds.includes("kaikeyi-chamber") ? [route(`${eventId}-to-kaikeyi-chamber`, "unfolds inside", "story", "kaikeyi-chamber")] : []),
      ...(nodeIds.includes("forest-exile") ? [route(`${eventId}-to-forest-exile`, "opens the road into", "story", "forest-exile")] : []),
    ] satisfies StoryWorldRoute[]];
  }),
);

RAMAYANA_AYODHYA_LOCAL_ROUTES.manthara = [route("manthara-to-kaikeyi", "counsels", "association", "kaikeyi")];
RAMAYANA_AYODHYA_LOCAL_ROUTES.kaikeyi = [
  route("kaikeyi-to-manthara", "is counselled by", "association", "manthara"),
  route("kaikeyi-to-dasharatha", "claims two promised boons from", "story", "king-dasharatha"),
];
RAMAYANA_AYODHYA_LOCAL_ROUTES.kausalya = [route("kausalya-to-rama", "receives the exile news from", "kinship", "rama")];
RAMAYANA_AYODHYA_LOCAL_ROUTES["kaikeyi-chamber"] = [route("kaikeyi-chamber-to-ayodhya", "lies within the narrative city of", "place", "ayodhya")];

export const RAMAYANA_AYODHYA_MOMENTS: Record<string, StoryMoment> = {
  "coronation-dawn": {
    id: "coronation-dawn",
    decisiveChange: { en: "A whole city begins preparing for a future that will not arrive.", hi: "पूरा नगर ऐसे भविष्य की तैयारी करता है जो अब आने वाला नहीं है।" },
    beats: [
      { id: "dasharatha-names-heir", title: { en: "Dasharatha names the future", hi: "दशरथ भविष्य की घोषणा करते हैं" }, narration: { en: "Dasharatha tells the gathered rulers and elders that age weighs on him and proposes Rama as heir. The assembly answers with unmistakable approval.", hi: "दशरथ राजाओं और सभासदों से कहते हैं कि आयु का भार बढ़ रहा है और राम को युवराज बनाने का प्रस्ताव रखते हैं। सभा स्पष्ट सहमति देती है।" }, visualCue: "A royal assembly opens toward a sunlit city as hands rise in agreement.", characterIds: ["king-dasharatha", "rama", "vasishta"] },
      { id: "city-prepares-coronation", title: { en: "Ayodhya moves at once", hi: "अयोध्या तुरंत जुट जाती है" }, narration: { en: "Orders spread through streets, storehouses, kitchens, gateways, and shrines. Water, garlands, music, banners, food, and ceremonial objects gather for the morning.", hi: "आदेश गलियों, भंडारों, रसोइयों, द्वारों और पूजा-स्थलों तक फैलते हैं। जल, मालाएँ, संगीत, ध्वज, भोजन और अभिषेक-सामग्री भोर के लिए जुटती है।" }, visualCue: "Preparations ripple through layered streets beneath banners and lamps.", characterIds: ["king-dasharatha", "vasishta"] },
      { id: "rama-sita-keep-vigil", title: { en: "Rama and Sita keep vigil", hi: "राम और सीता रात्रि-व्रत रखते हैं" }, narration: { en: "Rama receives the instructions without triumph. He and Sita fast, pray, and lie on a simple bed of kusa grass while the palace stays awake around them.", hi: "राम आदेश को विजय-भाव से नहीं लेते। वे और सीता उपवास, प्रार्थना और कुश की साधारण शय्या पर रात्रि बिताते हैं, जबकि महल जागता रहता है।" }, visualCue: "The couple sit in quiet lamplight while distant preparation continues.", characterIds: ["rama", "sita"] },
      { id: "city-waits-for-dawn", title: { en: "The city waits for dawn", hi: "नगर भोर की प्रतीक्षा करता है" }, narration: { en: "People speak of Rama's expected rule and wait for morning. The celebration feels settled; that confidence is what the coming turn will break.", hi: "लोग राम के भावी शासन की चर्चा करते हुए सुबह की प्रतीक्षा करते हैं। उत्सव निश्चित लगता है—अगला मोड़ इसी विश्वास को तोड़ेगा।" }, visualCue: "A vast moonlit Ayodhya glows while one palace window remains dark.", characterIds: ["rama", "sita", "king-dasharatha"] },
    ],
  },
  "manthara-sees-city": {
    id: "manthara-sees-city",
    decisiveChange: { en: "Celebration enters Kaikeyi's room as a warning.", hi: "उत्सव कैकेयी के कक्ष में चेतावनी बनकर प्रवेश करता है।" },
    beats: [
      { id: "manthara-sees-rooftops", title: { en: "A decorated city below", hi: "नीचे सजा हुआ नगर" }, narration: { en: "From the palace height, Manthara sees watered streets, banners, garlands, and crowds in festive dress. She asks what has made Ayodhya radiant.", hi: "महल की ऊँचाई से मंथरा धुली सड़कें, ध्वज, मालाएँ और उत्सव-वस्त्रों में भीड़ देखती है। वह पूछती है कि अयोध्या किस कारण चमक रही है।" }, visualCue: "A high balcony looks across a layered city alive with preparation.", characterIds: ["manthara"] },
      { id: "news-reaches-manthara", title: { en: "The answer changes her face", hi: "उत्तर सुनते ही भाव बदलते हैं" }, narration: { en: "She learns that Rama will be installed the next morning. What others receive as good news, she immediately reads as a threat to Kaikeyi and Bharata.", hi: "उसे पता चलता है कि अगली सुबह राम का राज्याभिषेक होगा। जिसे सब शुभ समाचार मानते हैं, वह उसे कैकेयी और भरत के लिए संकट समझती है।" }, visualCue: "Warm city light meets a suddenly shadowed expression.", characterIds: ["manthara", "rama"] },
      { id: "kaikeyi-first-rejoices", title: { en: "Kaikeyi first rejoices", hi: "कैकेयी पहले प्रसन्न होती हैं" }, narration: { en: "Kaikeyi asks what evil has occurred and, once the coronation is named, rises in delight rather than anger. Her first response matters because the hostility that follows is not timeless or automatic.", hi: "कैकेयी पूछती हैं कि कौन-सा अनिष्ट हुआ है और राज्याभिषेक का नाम सुनते ही क्रोध के बजाय आनंद से उठ बैठती हैं। उनका पहला उत्तर महत्वपूर्ण है, क्योंकि आगे बनने वाली शत्रुता पुरानी या स्वाभाविक नहीं है।" }, visualCue: "Kaikeyi rises into warm light while Manthara remains fixed on the danger she believes she sees.", characterIds: ["kaikeyi", "manthara", "rama"] },
      { id: "kaikeyi-offers-the-celebratory-gift", title: { en: "Kaikeyi offers a celebratory gift", hi: "कैकेयी उत्सव का उपहार देती हैं" }, narration: { en: "Kaikeyi gives Manthara an ornament, says she finds no difference between Rama and Bharata, and invites her to choose another reward. Their exchange pauses with Kaikeyi's trust intact; only the next response will turn the offered gift into a sign of conflict.", hi: "कैकेयी मंथरा को आभूषण देती, राम और भरत में कोई भेद न मानने की बात कहती और दूसरा पुरस्कार चुनने को कहती हैं। बातचीत यहाँ कैकेयी के अटूट भरोसे पर ठहरती है; अगला उत्तर ही दिए गए उपहार को संघर्ष का संकेत बनाएगा।" }, visualCue: "Kaikeyi holds out the ornament in an open chamber before the next movement turns it into conflict.", characterIds: ["kaikeyi", "manthara", "rama", "bharata"] },
    ],
  },
  "fear-becomes-demands": {
    id: "fear-becomes-demands",
    decisiveChange: { en: "A planted fear becomes a plan built around two old boons.", hi: "जगाया गया भय दो पुराने वरदानों की योजना बन जाता है।" },
    beats: [
      { id: "manthara-reframes-future", title: { en: "The future is reframed as danger", hi: "भविष्य को संकट की तरह दिखाया जाता है" }, narration: { en: "Manthara argues that Rama's rise will diminish Bharata and Kaikeyi. She turns affection, succession, and household rank into a chain of imagined danger.", hi: "मंथरा तर्क देती है कि राम का उदय भरत और कैकेयी को पीछे कर देगा। वह स्नेह, उत्तराधिकार और परिवार की स्थिति को आशंकाओं की शृंखला बना देती है।" }, visualCue: "Projected shadows of crown and distance stretch across the chamber walls.", characterIds: ["manthara", "kaikeyi", "rama"] },
      { id: "kaikeyi-enters-anger-room", title: { en: "Kaikeyi enters the chamber of anger", hi: "कैकेयी कोपभवन में जाती हैं" }, narration: { en: "Persuaded, Kaikeyi removes her ornaments, puts on soiled clothing, and lies on the floor so Dasharatha will find a visible crisis.", hi: "प्रभावित होकर कैकेयी आभूषण उतारती हैं, मलिन वस्त्र पहनती हैं और भूमि पर लेट जाती हैं ताकि दशरथ के सामने संकट स्पष्ट दिखाई दे।" }, visualCue: "Jewels lie abandoned as the chamber's warm light recedes.", characterIds: ["kaikeyi", "manthara"] },
      { id: "dasharatha-renews-promise", title: { en: "Dasharatha promises before hearing", hi: "दशरथ सुनने से पहले वचन देते हैं" }, narration: { en: "Alarmed by her condition, Dasharatha asks what she wants and repeatedly promises to fulfil it. Kaikeyi makes the promise public in the presence of invoked witnesses.", hi: "कैकेयी की दशा देखकर दशरथ पूछते हैं कि वे क्या चाहती हैं और बार-बार उसे पूरा करने का वचन देते हैं। कैकेयी साक्षियों का आह्वान करके उस वचन को सार्वजनिक बनाती हैं।" }, visualCue: "The king kneels beside her while unseen witnesses are evoked through light.", characterIds: ["king-dasharatha", "kaikeyi"] },
      { id: "first-demand-bharata", title: { en: "The first demand: Bharata", hi: "पहली माँग: भरत" }, narration: { en: "Kaikeyi calls in the boons Dasharatha once granted and demands that the prepared coronation install Bharata instead of Rama.", hi: "कैकेयी दशरथ द्वारा दिए पुराने वरदान माँगती हैं और तैयार राज्याभिषेक में राम के स्थान पर भरत को स्थापित करने की माँग रखती हैं।" }, visualCue: "A ceremonial crown shifts from one pool of light toward another.", characterIds: ["kaikeyi", "king-dasharatha", "bharata"] },
      { id: "second-demand-fourteen-years", title: { en: "The second demand: fourteen years", hi: "दूसरी माँग: चौदह वर्ष" }, narration: { en: "The second demand removes Rama from the kingdom for fourteen years in forest dress. It is not merely a changed ceremony; it is the beginning of the epic road.", hi: "दूसरी माँग राम को वन-वस्त्र में चौदह वर्ष के लिए राज्य से दूर भेजती है। यह केवल बदला हुआ समारोह नहीं, महाकाव्य की यात्रा का आरंभ है।" }, visualCue: "Beyond the palace doorway, a long forest road appears under a darkening sky.", characterIds: ["kaikeyi", "rama", "king-dasharatha"] },
    ],
  },
  "king-trapped-by-word": {
    id: "king-trapped-by-word",
    decisiveChange: { en: "Dasharatha discovers that the promise he offered cannot coexist with the future he planned.", hi: "दशरथ देखते हैं कि दिया हुआ वचन और उनकी बनाई भविष्य-योजना साथ नहीं रह सकते।" },
    beats: [
      { id: "dasharatha-collapses", title: { en: "The demand lands", hi: "माँग का आघात" }, narration: { en: "Dasharatha falls senseless, wakes, and wonders whether he has heard a nightmare or lost command of his mind. The room, the promise, and Kaikeyi's unchanged demand remain. When denial fails, grief becomes physical and he collapses again.", hi: "दशरथ मूर्छित होकर गिरते हैं, जागते हैं और सोचते हैं कि क्या उन्होंने दुःस्वप्न सुना है या उनका मन साथ छोड़ रहा है। कक्ष, वचन और कैकेयी की अडिग माँग सामने ही रहते हैं। इनकार टूटते ही शोक देह पर छा जाता है और वे फिर गिर पड़ते हैं।" }, visualCue: "The king collapses beside coronation vessels that now seem impossibly distant.", characterIds: ["king-dasharatha", "kaikeyi"] },
      { id: "dasharatha-names-ramas-life-in-the-palace", title: { en: "Dasharatha names the son he is being asked to send away", hi: "दशरथ उस पुत्र का जीवन गिनाते हैं जिसे दूर भेजना है" }, narration: { en: "He asks what wrong Rama has done and recalls the ways Rama serves Kaikeyi, elders, citizens, teachers, and dependants. He says Rama has not earned banishment through misconduct. His praise is also a desperate argument: a political demand is about to fall on a person who was not present when it was made.", hi: "वे पूछते हैं कि राम ने कौन-सा अपराध किया और याद दिलाते हैं कि राम कैकेयी, बड़ों, नागरिकों, गुरुओं और आश्रितों की सेवा कैसे करते हैं। वे कहते हैं कि राम ने किसी दुराचार से वनवास नहीं कमाया। उनकी प्रशंसा एक व्याकुल तर्क भी है—राजनीतिक माँग उस व्यक्ति पर गिरने वाली है जो बनते समय वहाँ उपस्थित ही नहीं था।" }, visualCue: "Memories of Rama moving through the household surround the two figures without entering the locked chamber.", characterIds: ["king-dasharatha", "kaikeyi", "rama"] },
      { id: "dasharatha-offers-everything-else", title: { en: "The king offers everything except Rama", hi: "राजा राम को छोड़कर सब कुछ देने को तैयार हैं" }, narration: { en: "Dasharatha offers wealth, territory, power, and even his own comfort if Kaikeyi will withdraw the exile. He kneels and asks her to protect both Rama and the king from the consequence of his reckless promise. None of these substitutions answers the exact two boons she has chosen.", hi: "दशरथ धन, भूमि, सत्ता और अपना सुख तक देने को तैयार हैं, यदि कैकेयी वनवास वापस ले लें। वे झुककर उनसे राम और राजा—दोनों को उनके उतावले वचन के परिणाम से बचाने की विनती करते हैं। पर इनमें से कोई विकल्प कैकेयी के चुने हुए दो वरों को पूरा नहीं करता।" }, visualCue: "Maps, jewels, and royal seals spread uselessly across the floor between Dasharatha and the two fixed demands.", characterIds: ["king-dasharatha", "kaikeyi", "rama"] },
      { id: "kaikeyi-turns-honour-into-pressure", title: { en: "Kaikeyi turns royal honour into pressure", hi: "कैकेयी राजकीय सम्मान को दबाव बनाती हैं" }, narration: { en: "Kaikeyi answers that a ruler known for truth cannot retreat when keeping his word becomes painful. She invokes older exemplars of costly promises and says that refusal will expose Dasharatha before other kings. She also threatens to end her life if Rama is installed; the story presents this as coercive pressure, not a model of devotion or conduct.", hi: "कैकेयी उत्तर देती हैं कि सत्य के लिए प्रसिद्ध शासक कठिन मूल्य देखकर पीछे नहीं हट सकता। वे पुराने कठिन वचनों के उदाहरण देती हैं और कहती हैं कि इनकार अन्य राजाओं के सामने दशरथ को कलंकित करेगा। वे राम का अभिषेक होने पर जीवन त्यागने की धमकी भी देती हैं; कथा इसे दबाव के रूप में रखती है, भक्ति या आचरण के आदर्श के रूप में नहीं।" }, visualCue: "Ancient promise-stories appear as hard silhouettes around the chamber while the life threat remains only spoken and visibly coercive.", characterIds: ["kaikeyi", "king-dasharatha"] },
      { id: "dasharatha-sees-the-damage-spreading", title: { en: "Dasharatha sees the damage spreading through the family", hi: "दशरथ पूरे परिवार में फैलती क्षति देखते हैं" }, narration: { en: "He imagines Kausalya and Sumitra losing their sons, Sita hearing that coronation has become exile, citizens judging the throne, and Rama exchanging royal care for forest hardship. He insists that Bharata, absent from the plan, is too principled to welcome a kingdom obtained this way. The future now branches into many losses, not one changed succession.", hi: "वे कौसल्या और सुमित्रा को पुत्रों से दूर, सीता को राज्याभिषेक के स्थान पर वनवास सुनते, नागरिकों को सिंहासन पर प्रश्न उठाते और राम को राजकीय सुविधा छोड़ वन-कष्ट सहते देखते हैं। वे कहते हैं कि योजना से अनुपस्थित भरत इतने धर्मनिष्ठ हैं कि इस तरह मिला राज्य स्वीकार नहीं करेंगे। भविष्य अब केवल बदला उत्तराधिकार नहीं, अनेक हानियों में बँटता है।" }, visualCue: "Lines from the chamber spread toward the queens, Sita, Bharata, the citizens, and the distant forest.", characterIds: ["king-dasharatha", "kaikeyi", "rama", "bharata", "sita", "kausalya", "sumitra"] },
      { id: "night-refuses-to-stop", title: { en: "Dasharatha asks the night not to end", hi: "दशरथ रात से समाप्त न होने की विनती करते हैं" }, narration: { en: "Night deepens while Dasharatha alternates between anger, pleading, fainting, and silence. He asks the starry darkness to delay morning because daylight will bring priests, citizens, and the ceremony he can no longer authorize. Kaikeyi does not release the demand, and time becomes another force moving the choice toward action.", hi: "रात गहराती है और दशरथ क्रोध, विनती, मूर्छा तथा मौन के बीच डोलते हैं। वे तारों भरे अँधेरे से भोर रोकने को कहते हैं, क्योंकि दिन के साथ पुरोहित, नागरिक और वह समारोह आएगा जिसकी आज्ञा अब वे नहीं दे सकते। कैकेयी माँग नहीं छोड़तीं और समय स्वयं निर्णय को कर्म की ओर धकेलने लगता है।" }, visualCue: "Stars cross the window while the prepared city brightens beyond a chamber where no agreement is possible.", characterIds: ["king-dasharatha", "kaikeyi"] },
      { id: "promise-becomes-a-noose", title: { en: "The promise becomes a noose", hi: "वचन फंदा बन जाता है" }, narration: { en: "At dawn Kaikeyi repeats that the boons must bear fruit. Dasharatha says he is bound by the very principle he meant to display when he promised before listening. He cannot endorse the demand, yet he no longer sees a path to deny it; he asks only to see Rama.", hi: "भोर में कैकेयी दोहराती हैं कि वर पूरे होने ही चाहिए। दशरथ कहते हैं कि सुनने से पहले वचन देते समय जिस सत्यनिष्ठा का प्रदर्शन करना चाहते थे, उसी ने उन्हें बाँध लिया है। वे माँग को उचित नहीं मानते, फिर भी उसे रोकने का मार्ग नहीं देखते; अब वे केवल राम को देखना चाहते हैं।" }, visualCue: "A luminous oath-thread closes around the royal seal as dawn reaches the floor.", characterIds: ["kaikeyi", "king-dasharatha", "rama"] },
      { id: "morning-waits-outside", title: { en: "Morning waits outside", hi: "सुबह बाहर प्रतीक्षा करती है" }, narration: { en: "Vasishta arrives with sacred water, the throne, attendants, musicians, and everything required for installation. Sumantra enters believing he is waking a joyful king, then finds Dasharatha unable to answer. Kaikeyi first explains the silence and orders Rama summoned; the king finally gives the same command because he wants to see his son.", hi: "वसिष्ठ पवित्र जल, सिंहासन, सेवकों, संगीत और अभिषेक की पूरी सामग्री के साथ आते हैं। सुमंत्र प्रसन्न राजा को जगाने की आशा में प्रवेश करते हैं, पर दशरथ उत्तर देने में असमर्थ मिलते हैं। पहले कैकेयी मौन का कारण बताकर राम को बुलाने का आदेश देती हैं; अंततः राजा भी वही आदेश देते हैं, क्योंकि वे पुत्र को देखना चाहते हैं।" }, visualCue: "Golden morning and a complete coronation procession press against the sealed, shadowed royal chamber.", characterIds: ["king-dasharatha", "kaikeyi", "vasishta", "sumantra", "rama"] },
    ],
  },
  "rama-crosses-celebration": {
    id: "rama-crosses-celebration",
    decisiveChange: { en: "Rama walks through his own celebration to learn that it has become an exile.", hi: "राम अपने ही उत्सव के बीच से चलकर जानते हैं कि वही वनवास बन चुका है।" },
    beats: [
      { id: "vasishta-finds-delay", title: { en: "The ceremony is ready; the king is absent", hi: "समारोह तैयार है, राजा नहीं" }, narration: { en: "Vasishta sends Sumantra to bring the king. The messenger finds Dasharatha broken and Kaikeyi directing what happens next.", hi: "वसिष्ठ सुमंत्र को राजा बुलाने भेजते हैं। वे दशरथ को टूटा हुआ और आगे की दिशा तय करती कैकेयी को पाते हैं।" }, visualCue: "Ceremonial vessels wait in sunlight while a messenger crosses into shadow.", characterIds: ["vasishta", "king-dasharatha", "kaikeyi"] },
      { id: "sumantra-summons-rama", title: { en: "Rama is summoned", hi: "राम को बुलाया जाता है" }, narration: { en: "Kaikeyi tells Sumantra to bring Rama. Nothing in the public streets reveals that the summons is no longer for installation.", hi: "कैकेयी सुमंत्र से राम को बुलाने कहती हैं। सार्वजनिक गलियों में कुछ भी नहीं बताता कि बुलावा अब राज्याभिषेक के लिए नहीं है।" }, visualCue: "A chariot turns through crowded streets toward the waiting prince.", characterIds: ["kaikeyi", "rama"] },
      { id: "rama-crosses-festival-city", title: { en: "Through a city saying his name", hi: "नाम पुकारते नगर के बीच" }, narration: { en: "Rama crosses watered roads, raised standards, musicians, and citizens expecting to see him crowned. He answers their affection without knowing how soon he will leave them.", hi: "राम धुली सड़कों, ध्वजों, संगीत और राज्याभिषेक की प्रतीक्षा करती जनता के बीच से गुजरते हैं। वे स्नेह का उत्तर देते हैं, बिना जाने कि शीघ्र ही विदा होंगे।" }, visualCue: "Rama moves through a cheering city while the palace ahead remains dark.", characterIds: ["rama"] },
      { id: "kaikeyi-speaks-demand", title: { en: "The silent father; the spoken demand", hi: "मौन पिता, बोली गई माँग" }, narration: { en: "Rama finds Dasharatha unable to answer him. Kaikeyi says the king is bound by shame and then tells Rama the two demands directly.", hi: "राम दशरथ को उत्तर देने में असमर्थ पाते हैं। कैकेयी कहती हैं कि राजा संकोच से बँधे हैं और फिर दोनों माँगें सीधे राम को बताती हैं।" }, visualCue: "Rama stands between a speechless father and Kaikeyi's unwavering gaze.", characterIds: ["rama", "king-dasharatha", "kaikeyi"] },
    ],
  },
  "rama-accepts-exile": {
    id: "rama-accepts-exile",
    decisiveChange: { en: "Rama chooses departure before anyone around him has absorbed the loss.", hi: "आसपास के लोग आघात समझ भी नहीं पाते और राम प्रस्थान चुन लेते हैं।" },
    beats: [
      { id: "rama-says-he-will-go", title: { en: "Rama answers without bargaining", hi: "राम बिना सौदे के उत्तर देते हैं" }, narration: { en: "Rama says Bharata may receive the kingdom and that he will enter the forest that very day. He asks only why his father could not tell him himself.", hi: "राम कहते हैं कि भरत राज्य लें और वे उसी दिन वन चले जाएँगे। वे केवल पूछते हैं कि पिता स्वयं यह बात क्यों नहीं कह सके।" }, visualCue: "Rama's calm silhouette steadies a chamber in collapse.", characterIds: ["rama", "king-dasharatha", "kaikeyi"] },
      { id: "rama-goes-to-kausalya", title: { en: "Celebration still surrounds Kausalya", hi: "कौसल्या के चारों ओर अभी भी उत्सव है" }, narration: { en: "Rama reaches Kausalya while attendants and ritual preparations still anticipate his installation. He tells her that the seat prepared for him must be exchanged for forest ground.", hi: "राम कौसल्या के पास पहुँचते हैं, जहाँ सेवक और अनुष्ठान अभी भी राज्याभिषेक की प्रतीक्षा में हैं। वे बताते हैं कि उनके लिए तैयार आसन अब वन-भूमि से बदल जाएगा।" }, visualCue: "A coronation seat and forest mat occupy opposite pools of light.", characterIds: ["rama", "kausalya"] },
      { id: "kausalya-grief-and-choice", title: { en: "Kausalya's grief is not hurried past", hi: "कौसल्या के शोक को जल्दी नहीं टाला जाता" }, narration: { en: "Kausalya collapses, mourns the years of waiting, and says she would follow him. The story stays with the human cost before it turns to argument about duty.", hi: "कौसल्या गिर पड़ती हैं, वर्षों की प्रतीक्षा का शोक करती हैं और साथ चलने की बात कहती हैं। कथा कर्तव्य की बहस से पहले मानवीय पीड़ा पर ठहरती है।" }, visualCue: "Mother and son meet at floor level as celebration blurs behind them.", characterIds: ["kausalya", "rama"] },
      { id: "lakshmana-urges-resistance", title: { en: "Lakshmana urges resistance", hi: "लक्ष्मण प्रतिरोध की बात करते हैं" }, narration: { en: "Lakshmana calls the command unjust and offers force, defence, and the support of those loyal to Rama. His anger gives voice to the refusal others cannot articulate.", hi: "लक्ष्मण आदेश को अन्यायपूर्ण कहते हैं और बल, रक्षा तथा राम-समर्थकों का सहारा देने की बात करते हैं। उनका क्रोध उस अस्वीकार को स्वर देता है जिसे दूसरे कह नहीं पाते।" }, visualCue: "Lakshmana rises sharply while Rama remains seated and attentive.", characterIds: ["lakshmana", "rama", "kausalya"] },
      { id: "rama-turns-anger-to-preparation", title: { en: "Rama turns anger toward preparation", hi: "राम क्रोध को तैयारी में बदलते हैं" }, narration: { en: "Rama refuses to seize the kingdom or make his father's word the cause of civil conflict. He asks Lakshmana to help dismantle the ceremony and prepare for departure.", hi: "राम राज्य छीनने या पिता के वचन को गृह-संघर्ष का कारण बनाने से इंकार करते हैं। वे लक्ष्मण से समारोह समेटकर प्रस्थान की तैयारी में सहायता माँगते हैं।" }, visualCue: "Ceremonial objects are quietly set aside as a travel bundle takes shape.", characterIds: ["rama", "lakshmana"] },
    ],
  },
  "sita-chooses-road": {
    id: "sita-chooses-road",
    decisiveChange: { en: "The exile becomes a shared journey because Sita insists on choosing it.", hi: "सीता के अपने निर्णय से वनवास साझा यात्रा बन जाता है।" },
    beats: [
      { id: "sita-sees-changed-face", title: { en: "Sita sees what the city cannot", hi: "सीता वह देखती हैं जो नगर नहीं देखता" }, narration: { en: "Sita has prepared for coronation and asks why Rama returns without royal signs, music, or attendants. His face tells her the public celebration is already false.", hi: "सीता राज्याभिषेक की तैयारी में हैं और पूछती हैं कि राम राजचिह्न, संगीत और सेवकों के बिना क्यों लौटे। उनका चेहरा बता देता है कि बाहर का उत्सव अब सच नहीं रहा।" }, visualCue: "Festive ornaments frame Rama's subdued arrival at the chamber threshold.", characterIds: ["sita", "rama"] },
      { id: "rama-asks-sita-stay", title: { en: "Rama asks her to remain", hi: "राम उन्हें रुकने को कहते हैं" }, narration: { en: "Rama explains the command and initially asks Sita to stay in Ayodhya, honour the elders, and live carefully while he is away.", hi: "राम आदेश बताते हैं और पहले सीता से अयोध्या में रहकर बड़ों का सम्मान करने तथा उनके लौटने तक सावधानी से जीवन बिताने को कहते हैं।" }, visualCue: "Rama gestures toward the protected palace while the road glows beyond.", characterIds: ["rama", "sita"] },
      { id: "sita-claims-shared-fortune", title: { en: "Sita claims a shared fortune", hi: "सीता साझा भाग्य का दावा करती हैं" }, narration: { en: "Sita answers that marriage does not divide hardship into his and hers. She rejects the idea that the palace can be her proper world while his road lies elsewhere.", hi: "सीता कहती हैं कि विवाह कठिनाई को तुम्हारी और मेरी हिस्सेदारी में नहीं बाँटता। वे इस विचार को अस्वीकार करती हैं कि उनका संसार महल हो और राम की राह कहीं और।" }, visualCue: "Sita steps from the palace light toward the open threshold.", characterIds: ["sita", "rama"] },
      { id: "forest-fears-are-named", title: { en: "The forest fears are named", hi: "वन के भय स्पष्ट किए जाते हैं" }, narration: { en: "Rama names rough ground, hunger, animals, weather, and hardship. Sita answers each warning not with ignorance, but with a repeated, deliberate choice to accompany him.", hi: "राम कठिन भूमि, भूख, वन्य जीव, मौसम और कष्ट गिनाते हैं। सीता अज्ञान से नहीं, हर चेतावनी के बाद सोच-समझकर साथ चलने का निर्णय दोहराती हैं।" }, visualCue: "Images of forest hardship appear beyond the doorway while Sita does not step back.", characterIds: ["rama", "sita"] },
      { id: "rama-accepts-sita-choice", title: { en: "Rama accepts her choice", hi: "राम सीता का निर्णय स्वीकार करते हैं" }, narration: { en: "After the long exchange, Rama stops trying to leave her behind. They begin giving possessions away and preparing to enter the forest together.", hi: "लंबे संवाद के बाद राम उन्हें पीछे छोड़ने का प्रयास रोकते हैं। दोनों वस्तुएँ दान देकर साथ वन जाने की तैयारी करते हैं।" }, visualCue: "Two travel bundles rest beside an open road as palace objects recede.", characterIds: ["rama", "sita"] },
    ],
  },
  "lakshmana-joins": {
    id: "lakshmana-joins",
    decisiveChange: { en: "Three travellers emerge from the coronation that was meant for one king.", hi: "एक राजा के राज्याभिषेक की जगह तीन यात्रियों का प्रस्थान सामने आता है।" },
    beats: [
      { id: "lakshmana-asks-to-come", title: { en: "Lakshmana asks for the road", hi: "लक्ष्मण साथ चलने की अनुमति माँगते हैं" }, narration: { en: "Lakshmana says he will walk before Rama and Sita, gather food, guard the path, and make the forest journey his own duty.", hi: "लक्ष्मण कहते हैं कि वे राम और सीता के आगे चलेंगे, भोजन जुटाएँगे, मार्ग की रक्षा करेंगे और वन-यात्रा को अपना दायित्व बनाएँगे।" }, visualCue: "Lakshmana places his travel gear beside the couple's bundles.", characterIds: ["lakshmana", "rama", "sita"] },
      { id: "weapons-and-gifts-prepared", title: { en: "Preparation replaces ceremony", hi: "समारोह की जगह यात्रा-तैयारी" }, narration: { en: "Rama sends Lakshmana for the bows and protective equipment entrusted to the household. At the same time, wealth and belongings are distributed rather than carried into exile.", hi: "राम लक्ष्मण को परिवार के पास सुरक्षित धनुष और रक्षा-सामग्री लाने भेजते हैं। साथ ही धन और वस्तुएँ वन ले जाने के बजाय बाँटी जाती हैं।" }, visualCue: "Ceremonial trays move outward as compact travel gear is gathered.", characterIds: ["rama", "lakshmana", "sita"] },
      { id: "bark-garments-arrive", title: { en: "Bark garments replace royal dress", hi: "राजवस्त्रों की जगह वल्कल आते हैं" }, narration: { en: "Kaikeyi brings forest garments. Rama and Lakshmana change; Sita's discomfort and the elders' protest are not treated as a ritual instruction or a triumphant spectacle.", hi: "कैकेयी वन-वस्त्र लाती हैं। राम और लक्ष्मण बदलते हैं; सीता की असुविधा और बड़ों के विरोध को न अनुष्ठान-निर्देश बनाया जाता है, न विजय-दृश्य।" }, visualCue: "Folded bark cloth lies beside abandoned coronation fabric in a restrained chamber.", characterIds: ["kaikeyi", "rama", "sita", "lakshmana"] },
      { id: "farewell-to-mothers", title: { en: "Farewell moves through the family", hi: "विदाई पूरे परिवार से गुजरती है" }, narration: { en: "The three seek blessings from parents and mothers amid grief, counsel, argument, and embraces. Departure is a household rupture before it becomes adventure.", hi: "तीनों शोक, सलाह, तर्क और आलिंगन के बीच माता-पिता और माताओं से आशीर्वाद लेते हैं। प्रस्थान रोमांच बनने से पहले परिवार का टूटना है।" }, visualCue: "The travellers bow while elders and family form a grieving semicircle.", characterIds: ["rama", "sita", "lakshmana", "kausalya", "king-dasharatha"] },
      { id: "three-turn-toward-gate", title: { en: "Three turn toward the gate", hi: "तीनों द्वार की ओर मुड़ते हैं" }, narration: { en: "Rama, Sita, and Lakshmana stand ready together. The city is still dressed for coronation, but the next movement is toward the gate and the forest beyond.", hi: "राम, सीता और लक्ष्मण साथ खड़े हैं। नगर अभी भी राज्याभिषेक के लिए सजा है, पर अगला कदम द्वार और उसके पार वन की ओर है।" }, visualCue: "Three figures face a sunlit gate while the decorated city recedes behind them.", characterIds: ["rama", "sita", "lakshmana"] },
    ],
  },
};

export const RAMAYANA_STORY_DISTRICTS: StoryDistrict[] = [
  {
    id: "ayodhya-exile-v1",
    title: { en: "The night the road changed", hi: "वह रात जब राह बदल गई" },
    invitation: { en: "Enter coronation night, follow the two demands, and leave the palace with Rama, Sita, and Lakshmana.", hi: "राज्याभिषेक की रात में प्रवेश करें, दो माँगों को देखें और राम, सीता तथा लक्ष्मण के साथ महल से निकलें।" },
    entryMomentId: "coronation-dawn",
    momentIds: ["coronation-dawn", "manthara-sees-city", "fear-becomes-demands", "king-trapped-by-word", "rama-crosses-celebration", "rama-accepts-exile", "sita-chooses-road", "lakshmana-joins"],
    compassTurnIds: ["coronation-dawn", "two-boons", "exile-accepted"],
  },
  {
    id: "road-home-v1",
    title: { en: "The road home", hi: "घर वापसी की राह" },
    invitation: { en: "Leave Lanka, retrace the remembered world, and return the kingdom in Ayodhya.", hi: "लंका से चलें, स्मृतियों से भरे संसार को पार करें और अयोध्या में राज्य लौटते देखें।" },
    entryMomentId: "leave-lanka",
    momentIds: ["leave-lanka", "sky-road", "bharadvaja-hermitage", "hanuman-goes-ahead", "bharata-hears", "ayodhya-prepares", "kingdom-returned"],
    compassTurnIds: ["road-home"],
  },
];
