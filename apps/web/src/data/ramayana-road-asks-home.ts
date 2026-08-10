import type {
  StoryDistrict,
  StoryMoment,
  StoryWorldNode,
  StoryWorldRoute,
} from "@/lib/domain/story-world";

const SOURCE_REF = "sha256:7d3b9e1613d60dfacea39f2564243e943cf38703eadb7245d92337b238082034";

export const RAMAYANA_ROAD_ASKS_HOME_SCENE_NODE_IDS: Record<string, string[]> = {
  "expedition-reaches-ganga": ["expedition-reaches-ganga-event", "ganga-expedition-camp-story-world", "bharata", "shatrughna", "kausalya", "sumitra", "kaikeyi", "guha"],
  "guha-shows-first-night": ["guha-shows-first-night-event", "ingudi-bed-story-world", "guha", "bharata", "shatrughna", "kausalya", "rama", "sita", "lakshmana"],
  "bharadvaja-tests-hosts": ["bharadvaja-tests-hosts-event", "bharadvaja-wonder-camp-story-world", "bharadvaja", "bharata", "vasishta", "kausalya", "sumitra", "kaikeyi"],
  "chitrakoot-hears-army": ["chitrakoot-hears-army-event", "chitrakoot-approach-story-world", "rama", "sita", "lakshmana", "bharata", "shatrughna", "guha"],
  "brothers-meet-death-news": ["brothers-meet-death-news-event", "chitrakoot-reunion-cottage-story-world", "rama", "bharata", "shatrughna", "lakshmana", "sita", "sumantra"],
  "family-asks-rama-home": ["family-asks-rama-home-event", "mandakini-family-council-story-world", "rama", "bharata", "sita", "lakshmana", "kausalya", "sumitra", "vasishta"],
  "sandals-hold-kingdom": ["sandals-hold-kingdom-event", "sandals-council-story-world", "rama", "bharata", "shatrughna", "vasishta", "javali", "kaikeyi"],
  "nandigrama-trust": ["nandigrama-trust-event", "nandigrama-trust-story-world", "bharata", "shatrughna", "vasishta", "rama", "ayodhya"],
};

export const RAMAYANA_ROAD_ASKS_HOME_CAST_NODE_IDS: Record<string, string> = {
  Javali: "javali",
};

const eventNodes: StoryWorldNode[] = [
  ["expedition-reaches-ganga-event", "A kingdom travels to ask", "Bharata, the royal household, citizens, workers, and an immense force reach the Ganga, where their scale makes Guha fear for Rama."],
  ["guha-shows-first-night-event", "The first night is found again", "Guha recognizes Bharata's purpose, recounts Lakshmana's vigil, and shows the marks left by Rama and Sita before ferrying the expedition onward."],
  ["bharadvaja-tests-hosts-event", "Bharadvaja tests and receives the road", "Bharadvaja tests Bharata's intention, protects the hermitage boundary, receives the entire company, and points them toward Chitrakoot."],
  ["chitrakoot-hears-army-event", "Chitrakoot hears an army", "The expedition disturbs the forest; Lakshmana sees threat where Rama expects love, while Bharata stops the force and searches on foot."],
  ["brothers-meet-death-news-event", "The brothers meet, then hear the loss", "Bharata reaches the cottage, the brothers embrace, and a reunion becomes mourning when Dasharatha's death is finally spoken."],
  ["family-asks-rama-home-event", "A family asks Rama home", "The mothers and advisers gather at the Mandakini while Bharata argues that the eldest must return and Rama holds to Dasharatha's command."],
  ["sandals-hold-kingdom-event", "The sandals hold what the brothers cannot resolve", "Javali, Vasishta, Bharata, and Rama press different arguments until a pair of sandals becomes the bounded sign of a fourteen-year trust."],
  ["nandigrama-trust-event", "The trust moves to Nandigrama", "Bharata carries the sandals back through Prayaga and Ayodhya, then governs from Nandigrama in subordination to Rama's promised return."],
].map(([id, label, summary]) => ({
  id,
  label,
  kind: "Story event",
  family: "event_story",
  summary,
  searchQuery: `${label} Ramayana Ayodhya Kanda`,
  evidenceBoundary: "This event is a Devam retelling bounded to Ayodhyā Kāṇḍa sections LXXXIII–CXV in the selected Manmatha Nath Dutt Project Gutenberg electronic edition. It is not every Ramayana telling, a historical reconstruction, an ethical verdict, or modern geographic evidence.",
}));

const placeAndCharacterNodes: StoryWorldNode[] = [
  {
    id: "javali",
    label: "Javali",
    kind: "Narrative counsellor",
    family: "being_person",
    summary: "Meet Javali inside the Chitrakoot debate, where he deliberately advances a materialist argument in an effort to persuade Rama to return.",
    searchQuery: "Javali Rama Chitrakoot Ayodhya Kanda",
    evidenceBoundary: "This doorway represents Javali's role in one selected English edition. It is not a complete philosophical treatment, biography, or neutral endorsement of any speech in the debate.",
  },
  {
    id: "ganga-expedition-camp-story-world",
    label: "The expedition at the Ganga",
    kind: "Narrative river camp",
    family: "place_polity",
    summary: "Enter the riverbank where a city-sized journey pauses and Guha must decide whether the approaching royal force is rescue or threat.",
    searchQuery: "Bharata army Guha Ganga Shringaverapura Ramayana",
    evidenceBoundary: "This is schematic narrative geography in the selected edition, not a modern route, force estimate, archaeological reconstruction, or visitor map.",
  },
  {
    id: "ingudi-bed-story-world",
    label: "The grass beneath the Ingudi tree",
    kind: "Remembered narrative place",
    family: "place_polity",
    summary: "Stand where Guha points out the grass bed, scattered fibres, and guarded night that make the exile physically real to Bharata.",
    searchQuery: "Bharata sees Rama grass bed Ingudi Guha Ramayana",
    evidenceBoundary: "This place follows a source-story scene and does not identify a verified surviving tree, archaeological bed, or exact modern coordinate.",
  },
  {
    id: "bharadvaja-wonder-camp-story-world",
    label: "Bharadvaja's impossible welcome",
    kind: "Narrative hermitage world",
    family: "place_polity",
    summary: "Enter the hermitage encounter where intention is tested, environmental restraint is voiced, and the whole exhausted expedition receives wondrous hospitality.",
    searchQuery: "Bharadvaja hospitality Bharata army Prayaga Ayodhya Kanda",
    evidenceBoundary: "This is the selected edition's wondrous narrative hospitality, not a recoverable historical event, current institution, travel claim, or universal ascetic practice.",
  },
  {
    id: "chitrakoot-approach-story-world",
    label: "The smoke above Chitrakoot",
    kind: "Narrative mountain approach",
    family: "place_polity",
    summary: "Move between the forest disturbed by the expedition and the distant column of smoke that turns Bharata's search into a final approach on foot.",
    searchQuery: "Bharata searches Chitrakoot smoke Lakshmana army Ramayana",
    evidenceBoundary: "This is a narrative approach in the selected edition, not a historical troop route, ecological baseline, or modern trekking direction.",
  },
  {
    id: "chitrakoot-reunion-cottage-story-world",
    label: "The cottage of reunion",
    kind: "Narrative forest home",
    family: "place_polity",
    summary: "Reach the leaf cottage where Bharata falls at Rama's feet, Rama asks after the kingdom and family, and news of Dasharatha transforms reunion into mourning.",
    searchQuery: "Bharata Rama reunion Chitrakoot Dasharatha death",
    evidenceBoundary: "This is a source-story dwelling and encounter, not an architectural reconstruction, historical identification, or claim about a present shrine.",
  },
  {
    id: "mandakini-family-council-story-world",
    label: "The family council by the Mandakini",
    kind: "Narrative river council",
    family: "place_polity",
    summary: "Stay with mothers, brothers, advisers, and citizens as private grief becomes a public argument over promise, succession, and responsibility.",
    searchQuery: "Bharata asks Rama return Mandakini Vasishta Ayodhya Kanda",
    evidenceBoundary: "This is a selected-edition narrative debate. It is not modern constitutional, legal, ritual, or family guidance and does not settle every interpretive tradition.",
  },
  {
    id: "sandals-council-story-world",
    label: "The council of the sandals",
    kind: "Narrative decision place",
    family: "place_polity",
    summary: "Enter the final Chitrakoot decision where competing arguments fail to move Rama and the sandals carry a bounded responsibility back toward Ayodhya.",
    searchQuery: "Rama sandals Bharata Chitrakoot fourteen years",
    evidenceBoundary: "The sandals are represented as a narrative sign in the selected edition, not a universal political theology, relic-identification claim, or authority for present governance.",
  },
  {
    id: "nandigrama-trust-story-world",
    label: "Nandigrama",
    kind: "Narrative governing place",
    family: "place_polity",
    summary: "Arrive where Bharata remains outside Ayodhya, places the sandals before the work of government, and waits for the fourteen-year promise to close.",
    searchQuery: "Bharata Nandigrama sandals govern Ramayana",
    evidenceBoundary: "This is narrative geography in the selected edition. Modern place identity, archaeology, pilgrimage, institutions, and other Ramayana tellings require separate evidence.",
  },
];

export const RAMAYANA_ROAD_ASKS_HOME_LOCAL_NODES: Record<string, StoryWorldNode> = Object.fromEntries(
  [...eventNodes, ...placeAndCharacterNodes].map((node) => [node.id, node]),
);

const route = (id: string, relation: string, relationKind: StoryWorldRoute["relationKind"], destinationId: string): StoryWorldRoute => ({
  id,
  relation,
  relationKind,
  destinationId,
  sourceRef: SOURCE_REF,
});

export const RAMAYANA_ROAD_ASKS_HOME_LOCAL_ROUTES: Record<string, StoryWorldRoute[]> = Object.fromEntries(
  Object.entries(RAMAYANA_ROAD_ASKS_HOME_SCENE_NODE_IDS).map(([, nodeIds]) => {
    const [eventId, placeId, ...characterIds] = nodeIds;
    return [eventId, [
      route(`${eventId}-to-${placeId}`, "unfolds at", "place", placeId),
      ...characterIds.slice(0, 7).map((nodeId) => route(`${eventId}-to-${nodeId}`, "changes the path of", "story", nodeId)),
    ] satisfies StoryWorldRoute[]];
  }),
);

RAMAYANA_ROAD_ASKS_HOME_LOCAL_ROUTES["ganga-expedition-camp-story-world"] = [route("ganga-camp-to-guha", "is watched by", "story", "guha"), route("ganga-camp-to-bharata", "is entered by", "story", "bharata")];
RAMAYANA_ROAD_ASKS_HOME_LOCAL_ROUTES["ingudi-bed-story-world"] = [route("ingudi-bed-to-guha", "is shown by", "story", "guha"), route("ingudi-bed-to-rama", "remembers the night of", "story", "rama")];
RAMAYANA_ROAD_ASKS_HOME_LOCAL_ROUTES["bharadvaja-wonder-camp-story-world"] = [route("wonder-camp-to-bharadvaja", "is received by", "story", "bharadvaja"), route("wonder-camp-to-chitrakoot", "points toward", "place", "chitrakoot")];
RAMAYANA_ROAD_ASKS_HOME_LOCAL_ROUTES["chitrakoot-approach-story-world"] = [route("chitrakoot-approach-to-lakshmana", "is first read as danger by", "story", "lakshmana"), route("chitrakoot-approach-to-chitrakoot", "enters the narrative world of", "place", "chitrakoot")];
RAMAYANA_ROAD_ASKS_HOME_LOCAL_ROUTES["chitrakoot-reunion-cottage-story-world"] = [route("reunion-cottage-to-rama", "holds the embrace of", "story", "rama"), route("reunion-cottage-to-bharata", "is reached by", "story", "bharata")];
RAMAYANA_ROAD_ASKS_HOME_LOCAL_ROUTES["mandakini-family-council-story-world"] = [route("family-council-to-kausalya", "gathers the grief of", "story", "kausalya"), route("family-council-to-vasishta", "hears counsel from", "association", "vasishta")];
RAMAYANA_ROAD_ASKS_HOME_LOCAL_ROUTES["sandals-council-story-world"] = [route("sandals-council-to-javali", "hears a disputed argument from", "teaching", "javali"), route("sandals-council-to-bharata", "entrusts the sandals to", "story", "bharata")];
RAMAYANA_ROAD_ASKS_HOME_LOCAL_ROUTES["nandigrama-trust-story-world"] = [route("nandigrama-trust-to-bharata", "is held by", "story", "bharata"), route("nandigrama-trust-to-ayodhya", "governs on behalf of", "place", "ayodhya"), route("nandigrama-trust-to-rama", "waits for", "story", "rama")];

export const RAMAYANA_ROAD_ASKS_HOME_MOMENTS: Record<string, StoryMoment> = {
  "expedition-reaches-ganga": {
    id: "expedition-reaches-ganga",
    decisiveChange: { en: "A refused crown becomes a journey large enough to alarm the river world ahead.", hi: "अस्वीकार किया गया मुकुट इतनी विशाल यात्रा बनता है कि आगे का नदी-संसार सतर्क हो उठता है।" },
    beats: [
      { id: "whole-city-sets-out", title: { en: "A kingdom leaves its throne behind", hi: "एक राज्य सिंहासन पीछे छोड़कर निकलता है" }, narration: { en: "At dawn Bharata sets out with Shatrughna, the mothers, priests, counsellors, citizens, craftspeople, and an immense royal force. This is not a prince's private visit; Ayodhya itself travels to ask Rama home.", hi: "भोर में भरत शत्रुघ्न, माताओं, पुरोहितों, मंत्रियों, नागरिकों, कारीगरों और विशाल राजकीय दल के साथ निकलते हैं। यह किसी राजकुमार की निजी भेंट नहीं—अयोध्या स्वयं राम को घर बुलाने चलती है।" }, visualCue: "A many-layered procession pours from a distant city into a broad dawn road, with families and trades visible between royal columns.", characterIds: ["bharata", "shatrughna", "kausalya", "sumitra", "kaikeyi"] },
      { id: "hope-moves-through-crowd", title: { en: "People imagine the return before it happens", hi: "लोग वापसी को होने से पहले देख लेते हैं" }, narration: { en: "Along the road people ask when they will see Rama again and speak as though his face will end the city's darkness. Hope spreads through embraces, carts, animals, and ordinary working households moving together.", hi: "राह में लोग पूछते हैं कि राम फिर कब दिखाई देंगे और मानते हैं कि उनका दर्शन नगर का अँधेरा दूर कर देगा। आलिंगनों, गाड़ियों, पशुओं और साथ चलते परिवारों में आशा फैलती है।" }, visualCue: "Small conversations and embraces ripple through the moving crowd while a warm horizon draws everyone forward.", characterIds: ["bharata", "rama"] },
      { id: "ganga-stops-the-road", title: { en: "The Ganga stops an army-sized road", hi: "गंगा सेना-जितनी राह रोकती है" }, narration: { en: "The expedition reaches Shringaverapura and must become a camp. Bharata plans the crossing and offers water for Dasharatha; the river is both physical boundary and the place where grief returns.", hi: "यात्रा शृंगवेरपुर पहुँचकर शिविर बन जाती है। भरत पार जाने की व्यवस्था और दशरथ के लिए जल अर्पण की सोचते हैं; नदी भौतिक सीमा भी है और लौटता हुआ शोक भी।" }, visualCue: "The immense procession terraces down toward a wide indigo river as evening lamps mark the temporary camp.", characterIds: ["bharata", "kausalya"] },
      { id: "guha-sees-war", title: { en: "Guha sees banners before intentions", hi: "गुह इरादों से पहले ध्वज देखते हैं" }, narration: { en: "Across the river, Guha sees a force without visible end and fears Bharata has come to secure the kingdom by harming Rama. He arms the riverbank and readies hundreds of boats to deny passage if necessary.", hi: "नदी के पार गुह ऐसा दल देखते हैं जिसका अंत नहीं दिखता और आशंका करते हैं कि भरत राम को हानि पहुँचाकर राज्य पक्का करने आए हैं। वे तट और सैकड़ों नावें रक्षा के लिए तैयार करते हैं।" }, visualCue: "Guha watches banners multiply through river mist while boat crews quietly take defensive positions.", characterIds: ["guha", "bharata", "rama"] },
      { id: "gifts-cross-before-trust", title: { en: "A host approaches with gifts and caution", hi: "आतिथ्य और सावधानी साथ आगे बढ़ते हैं" }, narration: { en: "Guha carries forest food and hospitality toward Bharata while keeping his people ready. Sumantra identifies him as Rama's friend and the person most likely to know the road ahead.", hi: "गुह वन का भोजन और आतिथ्य लेकर भरत के पास जाते हैं, जबकि उनके लोग सतर्क रहते हैं। सुमंत्र उन्हें राम का मित्र और आगे की राह जानने वाला व्यक्ति बताते हैं।" }, visualCue: "A small delegation with baskets walks between the armed riverbank and the royal camp, watched by both sides.", characterIds: ["guha", "sumantra", "bharata"] },
      { id: "bharata-names-purpose", title: { en: "Bharata names the only purpose", hi: "भरत अपना एकमात्र उद्देश्य बताते हैं" }, narration: { en: "When Guha asks directly whether the army means harm, Bharata answers without court language: Rama is dear as a father, and he has come only to persuade his elder brother to return.", hi: "जब गुह सीधे पूछते हैं कि क्या यह सेना हानि पहुँचाने आई है, भरत दरबारी भाषा छोड़कर कहते हैं—राम पिता समान प्रिय हैं और वे केवल उन्हें लौटाने आए हैं।" }, visualCue: "Bharata steps away from the royal formation and speaks to Guha at equal height beside the river fire.", characterIds: ["bharata", "guha", "rama"] },
    ],
  },
  "guha-shows-first-night": {
    id: "guha-shows-first-night",
    decisiveChange: { en: "Bharata stops imagining exile and touches the traces of its first night.", hi: "भरत वनवास की कल्पना से आगे बढ़कर उसकी पहली रात के निशान छूते हैं।" },
    beats: [
      { id: "guha-recognizes-bharata", title: { en: "Suspicion becomes recognition", hi: "संदेह पहचान में बदलता है" }, narration: { en: "Bharata's answer transforms Guha's stance. He praises a man willing to surrender an unasked-for kingdom, offers guidance to Bharadvaja, and stays near while grief keeps Bharata awake.", hi: "भरत का उत्तर गुह का रुख बदल देता है। वे अनचाहा राज्य छोड़ने वाले भाई की प्रशंसा करते, भरद्वाज तक मार्गदर्शन देते और शोक में जागते भरत के पास रहते हैं।" }, visualCue: "Weapons lower around the camp as Guha and Bharata sit beside one river fire after sunset.", characterIds: ["guha", "bharata"] },
      { id: "lakshmana-vigil-retold", title: { en: "Guha retells Lakshmana's vigil", hi: "गुह लक्ष्मण की जागी रात सुनाते हैं" }, narration: { en: "Guha recounts offering Lakshmana a bed and guard. Lakshmana refused sleep while Rama and Sita lay on grass, fearing already that Dasharatha and the mothers might not survive the separation.", hi: "गुह बताते हैं कि उन्होंने लक्ष्मण को विश्राम और पहरा देने का प्रस्ताव दिया था। राम-सीता को घास पर सोता देखकर लक्ष्मण जागते रहे और दशरथ व माताओं के जीवन के लिए भय जताते रहे।" }, visualCue: "A memory layer reveals Lakshmana and Guha standing watch while two resting figures remain beneath the tree.", characterIds: ["guha", "lakshmana", "rama", "sita"] },
      { id: "bharata-collapses-at-news", title: { en: "The details strike harder than the headline", hi: "विवरण समाचार से अधिक चोट करते हैं" }, narration: { en: "Hearing how the first night passed, Bharata collapses. Shatrughna and the mothers gather around him; when he recovers, he asks where each person slept, what they ate, and who guarded them.", hi: "पहली रात का विवरण सुनकर भरत मूर्छित हो जाते हैं। शत्रुघ्न और माताएँ उन्हें घेर लेती हैं; सँभलकर वे पूछते हैं—कौन कहाँ सोया, क्या खाया और पहरा किसने दिया।" }, visualCue: "The family closes around Bharata while Guha points toward the dark outline of an old tree.", characterIds: ["bharata", "shatrughna", "kausalya", "guha"] },
      { id: "grass-bed-remains", title: { en: "The grass still carries a shape", hi: "घास में अब भी आकृति बची है" }, narration: { en: "At the Ingudi tree, Guha shows the pressed grass, fragments of silk and gold, and the place of Lakshmana's watch. Bharata reads a whole vanished night from what the ground retained.", hi: "इंगुदी वृक्ष के नीचे गुह दबा हुआ तृण, रेशम और सोने के छोटे अंश तथा लक्ष्मण की चौकसी का स्थान दिखाते हैं। भरत धरती पर बचे निशानों से पूरी बीती रात पढ़ते हैं।" }, visualCue: "Bharata kneels over pressed grass and a few glinting fibres while the first exile night appears faintly beyond him.", characterIds: ["bharata", "guha", "rama", "sita", "lakshmana"] },
      { id: "bharata-chooses-exile-exchange", title: { en: "Bharata offers to exchange lives", hi: "भरत जीवन बदलने का संकल्प लेते हैं" }, narration: { en: "He vows to sleep on the ground, wear bark and matted hair, and remain in the forest if Rama will not return. The plan is no longer only persuasion; Bharata is prepared to take the exile himself.", hi: "वे भूमि पर सोने, वल्कल और जटा धारण करने तथा राम के न लौटने पर स्वयं वन में रहने का वचन देते हैं। अब योजना केवल विनती नहीं—भरत वनवास अपने ऊपर लेने को तैयार हैं।" }, visualCue: "The royal ornaments dim as Bharata's reflection appears in bark beside the remembered grass bed.", characterIds: ["bharata", "rama", "shatrughna"] },
      { id: "five-hundred-boats-move", title: { en: "A city crosses by many kinds of courage", hi: "एक नगर अनेक साहसों से नदी पार करता है" }, narration: { en: "At dawn Guha's crews move people, mothers, priests, cars, animals, and supplies across the Ganga in boats and rafts; some swim. By the third watch, the expedition rests in Prayaga's woods.", hi: "भोर में गुह के नाविक लोगों, माताओं, पुरोहितों, रथों, पशुओं और सामग्री को नावों व बेड़ों से गंगा पार कराते हैं; कुछ तैरते हैं। तीसरे प्रहर तक यात्रा प्रयाग के वन में ठहरती है।" }, visualCue: "Boats, rafts, swimming figures, elephants, and wheeled cargo cross at different depths beneath the brightening sky.", characterIds: ["guha", "bharata", "shatrughna", "kausalya"] },
    ],
  },
  "bharadvaja-tests-hosts": {
    id: "bharadvaja-tests-hosts",
    decisiveChange: { en: "The road earns both scrutiny and a night of impossible abundance.", hi: "यात्रा परीक्षा भी पार करती है और असंभव समृद्धि की एक रात भी पाती है।" },
    beats: [
      { id: "bharata-leaves-army-behind", title: { en: "Bharata approaches without force", hi: "भरत सेना के बिना आगे बढ़ते हैं" }, narration: { en: "A krosha from the hermitage, Bharata leaves the army, weapons, and courtly display behind. He follows Vasishta on foot so a royal expedition does not trample the ascetic world it seeks help from.", hi: "आश्रम से एक क्रोश पहले भरत सेना, अस्त्र और राजकीय प्रदर्शन छोड़ देते हैं। वे वसिष्ठ के पीछे पैदल जाते हैं ताकि सहायता माँगती यात्रा तपोवन को रौंद न दे।" }, visualCue: "A small unarmed group walks from a distant sea of tents toward a quiet fire clearing.", characterIds: ["bharata", "vasishta", "bharadvaja"] },
      { id: "bharadvaja-tests-intention", title: { en: "A second guardian asks the same hard question", hi: "दूसरे संरक्षक का वही कठिन प्रश्न" }, narration: { en: "Bharadvaja asks whether Bharata came to harm Rama and secure the kingdom. Bharata weeps at being suspected again, rejects his mother's act, and asks only for the way to Rama's feet.", hi: "भरद्वाज पूछते हैं कि क्या भरत राम को हानि पहुँचाकर राज्य सुरक्षित करने आए हैं। फिर संदेह सुनकर भरत रो पड़ते, माँ के कर्म को अस्वीकार करते और केवल राम तक की राह माँगते हैं।" }, visualCue: "Bharadvaja's steady gaze meets Bharata's folded hands while Vasishta waits between them.", characterIds: ["bharadvaja", "bharata", "vasishta", "rama"] },
      { id: "test-becomes-direction", title: { en: "The test becomes a direction", hi: "परीक्षा दिशा बन जाती है" }, narration: { en: "Satisfied, Bharadvaja says Rama, Sita, and Lakshmana are at Chitrakoot and asks Bharata to stay the night. The unknown forest contracts into a place that can be reached tomorrow.", hi: "संतुष्ट होकर भरद्वाज बताते हैं कि राम, सीता और लक्ष्मण चित्रकूट में हैं और भरत से रात रुकने को कहते हैं। अनजान वन अब कल पहुँची जा सकने वाली जगह बन जाता है।" }, visualCue: "A distant mountain line glows beyond the hermitage as Bharadvaja traces the route in the earth.", characterIds: ["bharadvaja", "bharata", "rama", "sita", "lakshmana"] },
      { id: "army-invited-carefully", title: { en: "Hospitality expands without erasing restraint", hi: "संयम बनाए रखते हुए आतिथ्य फैलता है" }, narration: { en: "Bharadvaja asks for the whole force. Bharata explains he kept it away to protect trees, water, animals, and cottages. Only after the host insists does the city-sized company approach.", hi: "भरद्वाज पूरे दल को बुलाते हैं। भरत बताते हैं कि वृक्ष, जल, पशु और कुटियों की रक्षा के लिए सेना दूर रखी थी। मेज़बान के आग्रह के बाद ही विशाल दल आगे आता है।" }, visualCue: "The hermitage remains intact in the foreground as disciplined columns curve around its water and trees.", characterIds: ["bharadvaja", "bharata"] },
      { id: "hermitage-becomes-wonder", title: { en: "The exhausted road enters a wonder", hi: "थकी हुई यात्रा एक अद्भुत संसार में प्रवेश करती है" }, narration: { en: "Bharadvaja invokes an extraordinary welcome: wind, blossom rain, music, dwellings, food, water, care for animals, and rest appear around the force. For one night, dust and grief give way to abundance.", hi: "भरद्वाज अद्भुत स्वागत रचते हैं—सुगंधित वायु, पुष्पवर्षा, संगीत, आवास, भोजन, जल, पशुओं की देखभाल और विश्राम। एक रात के लिए धूल और शोक समृद्धि को स्थान देते हैं।" }, visualCue: "A quiet forest opens into layered luminous pavilions, orchards, water, music, and resting animals without losing the hermitage heart.", characterIds: ["bharadvaja", "bharata", "vasishta"] },
      { id: "route-through-mandakini", title: { en: "Morning restores the purpose", hi: "सुबह उद्देश्य फिर सामने आता है" }, narration: { en: "At dawn Bharadvaja directs them south toward the Mandakini and Chitrakoot. The mothers appear together; Bharata names their grief, and the sage interrupts his hatred of Kaikeyi before the army moves on.", hi: "भोर में भरद्वाज उन्हें मंदाकिनी और चित्रकूट की दक्षिणी राह बताते हैं। माताएँ साथ आती हैं; भरत उनका शोक बताते हैं और ऋषि कैकेयी के प्रति उनके घृणा-वचन को रोकते हैं।" }, visualCue: "The bright night-world recedes as three grieving queens and the road toward a blue mountain come into focus.", characterIds: ["bharadvaja", "bharata", "kausalya", "sumitra", "kaikeyi"] },
    ],
  },
  "chitrakoot-hears-army": {
    id: "chitrakoot-hears-army",
    decisiveChange: { en: "The same approaching army becomes threat from one viewpoint and reunion from another.", hi: "एक ही आती सेना एक दृष्टि से संकट और दूसरी से मिलन बन जाती है।" },
    beats: [
      { id: "forest-flees-before-force", title: { en: "The forest hears the expedition first", hi: "वन सबसे पहले यात्रा सुनता है" }, narration: { en: "Elephants, deer, birds, and other forest life scatter before the dust and sound of Bharata's force. The road to a loving reunion still carries the disruptive weight of a kingdom.", hi: "भरत के दल की धूल और गर्जना से हाथी, हिरन, पक्षी और अन्य वन्य जीव भागते हैं। प्रेमपूर्ण मिलन की राह भी एक राज्य का विघटनकारी भार साथ लाती है।" }, visualCue: "Wildlife moves across the foreground while banners and dust advance far behind through the trees.", characterIds: ["bharata"] },
      { id: "smoke-becomes-clue", title: { en: "A line of smoke narrows the world", hi: "धुएँ की रेखा संसार को एक दिशा देती है" }, narration: { en: "Searchers see smoke that must belong to a dwelling or hermitage. Bharata stops the army from advancing, keeps the forest from being overrun, and follows the clue with only a small company.", hi: "खोजी ऐसा धुआँ देखते हैं जो किसी निवास या आश्रम का हो सकता है। भरत सेना रोकते हैं, वन को रौंदने से बचाते हैं और छोटे दल के साथ उस संकेत की ओर बढ़ते हैं।" }, visualCue: "A single pale smoke column rises above the canopy while the massive force halts at a clear boundary.", characterIds: ["bharata", "shatrughna", "sumantra"] },
      { id: "chitrakoot-before-alarm", title: { en: "Inside the cottage world, life is briefly whole", hi: "कुटिया-संसार में जीवन क्षण भर पूरा है" }, narration: { en: "Before the noise arrives, Rama shows Sita Chitrakoot's coloured rock, flowering forest, birds, cascades, and the Mandakini. Exile has become a place where the three can still make a life.", hi: "शोर आने से पहले राम सीता को चित्रकूट की रंगीन शिलाएँ, पुष्पित वन, पक्षी, झरने और मंदाकिनी दिखाते हैं। वनवास ऐसी जगह बन गया है जहाँ तीनों जीवन रच सकते हैं।" }, visualCue: "Rama and Sita move through luminous rock, water, and foliage while the smallest dust cloud forms beyond the ridge.", characterIds: ["rama", "sita", "lakshmana"] },
      { id: "lakshmana-climbs-to-see", title: { en: "Lakshmana climbs into fear", hi: "लक्ष्मण भय की ओर चढ़ते हैं" }, narration: { en: "The ground trembles and animals run. From a tree Lakshmana sees elephants, horses, chariots, infantry, and Bharata's standard; he asks Rama to hide Sita, string the bow, and prepare for attack.", hi: "भूमि काँपती है और पशु भागते हैं। वृक्ष से लक्ष्मण हाथी, घोड़े, रथ, पैदल दल और भरत का ध्वज देखते हैं; वे सीता को सुरक्षित करने और धनुष तैयार करने को कहते हैं।" }, visualCue: "Lakshmana stands high against the sky while the calm cottage below contrasts with the dark advancing formation.", characterIds: ["lakshmana", "rama", "sita", "bharata"] },
      { id: "rama-refuses-suspicion", title: { en: "Rama refuses to make a brother an enemy", hi: "राम भाई को शत्रु मानने से इंकार करते हैं" }, narration: { en: "Rama says a kingdom gained by killing Bharata would be poison. He trusts that Bharata came from grief and love, and reminds Lakshmana that harm to his brother would be harm to Rama himself.", hi: "राम कहते हैं कि भरत को मारकर मिला राज्य विष होगा। उन्हें विश्वास है कि भरत शोक और प्रेम से आए हैं; वे याद दिलाते हैं कि भाई को चोट पहुँचाना राम को चोट पहुँचाना होगा।" }, visualCue: "Rama lowers the bow between Lakshmana's tense silhouette and the approaching banner.", characterIds: ["rama", "lakshmana", "bharata"] },
      { id: "bharata-walks-last-distance", title: { en: "The last distance is taken on foot", hi: "अंतिम दूरी पैदल तय होती है" }, narration: { en: "Bharata stations the force away from the hill, searches with Shatrughna, Guha, advisers, and citizens, then sees the smoke himself. Rank and spectacle fall behind as he climbs toward Rama's cottage.", hi: "भरत सेना को पर्वत से दूर रोककर शत्रुघ्न, गुह, सलाहकारों और नागरिकों के साथ खोजते हैं, फिर स्वयं धुआँ देखते हैं। पद और प्रदर्शन पीछे छूटते हैं; वे कुटिया की ओर चढ़ते हैं।" }, visualCue: "A small group climbs through marked bark and blossom while the army remains a distant band below.", characterIds: ["bharata", "shatrughna", "guha", "rama"] },
    ],
  },
  "brothers-meet-death-news": {
    id: "brothers-meet-death-news",
    decisiveChange: { en: "The reunion opens, then Dasharatha's death changes every reason for the meeting.", hi: "मिलन खुलता है, फिर दशरथ की मृत्यु उसके हर कारण को बदल देती है।" },
    beats: [
      { id: "cottage-signs-lead-in", title: { en: "Bharata reads the life around the cottage", hi: "भरत कुटिया के आसपास का जीवन पढ़ते हैं" }, narration: { en: "Bark signs, gathered fuel, flowers, a maintained fire, and the path to the Mandakini confirm the dwelling before anyone appears. Bharata sees the practical life Lakshmana built around the exile.", hi: "वल्कल के संकेत, इकट्ठी लकड़ी, फूल, जीवित अग्नि और मंदाकिनी की राह किसी के दिखने से पहले निवास की पुष्टि करते हैं। भरत लक्ष्मण द्वारा रचा व्यावहारिक वन-जीवन देखते हैं।" }, visualCue: "Hands pass bark markers, stacked fuel, flowers, bows, and the doorway as the cottage slowly reveals itself.", characterIds: ["bharata", "lakshmana"] },
      { id: "bharata-sees-rama", title: { en: "The person sought is finally visible", hi: "जिसे खोजा गया वह अंततः सामने है" }, narration: { en: "Inside, Bharata sees Rama in bark and matted hair beside Sita and Lakshmana. The contrast with the court he remembers overwhelms him before he can complete more than a cry of recognition.", hi: "भीतर भरत राम को वल्कल और जटा में सीता व लक्ष्मण के साथ देखते हैं। स्मृति के राजदरबार और सामने के वन-जीवन का अंतर उन्हें केवल पुकार भर कहने देता है।" }, visualCue: "The cottage doorway frames Rama, Sita, and Lakshmana while Bharata breaks from the bright exterior into shadow.", characterIds: ["bharata", "rama", "sita", "lakshmana"] },
      { id: "brothers-fall-and-embrace", title: { en: "Words fail; the brothers meet", hi: "शब्द चूकते हैं; भाई मिलते हैं" }, narration: { en: "Bharata falls at Rama's feet; Shatrughna follows. Rama raises and embraces them, then receives Sumantra and Guha. The forest community watches four royal brothers meet in tears rather than ceremony.", hi: "भरत राम के चरणों में गिरते हैं; शत्रुघ्न भी आते हैं। राम दोनों को उठाकर गले लगाते, फिर सुमंत्र और गुह से मिलते हैं। वनवासी समुदाय चार भाइयों को समारोह नहीं, आँसुओं में मिलता देखता है।" }, visualCue: "The brothers form the luminous centre while Guha, Sumantra, Sita, Lakshmana, and forest witnesses gather in depth.", characterIds: ["rama", "bharata", "shatrughna", "lakshmana", "sumantra", "guha"] },
      { id: "rama-asks-as-if-king", title: { en: "Rama asks questions meant for a ruler", hi: "राम शासक से पूछे जाने वाले प्रश्न करते हैं" }, narration: { en: "Not knowing Dasharatha is dead, Rama asks after father, mothers, priests, advisers, soldiers, farmers, justice, treasury, secrecy, and public welfare. He assumes Bharata carries responsibility and examines how he bears it.", hi: "दशरथ की मृत्यु न जानकर राम पिता, माताओं, पुरोहितों, मंत्रियों, सैनिकों, किसानों, न्याय, कोष, गोपनीयता और लोककल्याण का समाचार पूछते हैं। वे मानते हैं कि भरत उत्तरदायित्व संभाल रहे हैं।" }, visualCue: "Around the seated brothers, brief civic images—fields, court, gates, soldiers, water, and petitioners—appear as Rama asks.", characterIds: ["rama", "bharata"] },
      { id: "bharata-asks-return", title: { en: "Bharata answers with the empty centre", hi: "भरत खाली केंद्र से उत्तर देते हैं" }, narration: { en: "Bharata says the kingdom is not his, names himself servant and brother, and asks Rama to return before the mothers, ministers, and subjects who travelled to his feet. Then he tells why Dasharatha cannot come.", hi: "भरत कहते हैं कि राज्य उनका नहीं, वे सेवक और भाई हैं, और उन माताओं, मंत्रियों व प्रजाजनों के सामने राम से लौटने को कहते हैं जो उनके चरणों तक आए हैं। फिर वे बताते हैं कि दशरथ क्यों नहीं आए।" }, visualCue: "The civic visions darken into an empty royal seat as Bharata gestures toward the family approaching behind him.", characterIds: ["bharata", "rama", "kausalya", "vasishta"] },
      { id: "death-news-breaks-reunion", title: { en: "The news fells Rama", hi: "समाचार राम को गिरा देता है" }, narration: { en: "Hearing that Dasharatha died grieving after the exile, Rama collapses. The brothers and Sita carry their mourning to the Mandakini, offer water and the food of their own forest life, then return together to the cottage.", hi: "यह सुनकर कि वनवास के बाद शोक में दशरथ की मृत्यु हुई, राम गिर पड़ते हैं। भाई और सीता शोक लेकर मंदाकिनी जाते, जल और अपने वन-जीवन का अन्न अर्पित करते, फिर साथ कुटिया लौटते हैं।" }, visualCue: "The embrace dissolves into a river procession, joined hands over water, and a quiet return beneath the mountain.", characterIds: ["rama", "bharata", "shatrughna", "lakshmana", "sita"] },
    ],
  },
  "family-asks-rama-home": {
    id: "family-asks-rama-home",
    decisiveChange: { en: "Private grief becomes a public argument that no one can end by love alone.", hi: "निजी शोक सार्वजनिक तर्क बनता है जिसे केवल प्रेम समाप्त नहीं कर सकता।" },
    beats: [
      { id: "mothers-follow-river-path", title: { en: "The mothers see how exile lives", hi: "माताएँ वनवास का जीवन देखती हैं" }, narration: { en: "Kausalya, Sumitra, Kaikeyi, and the other queens follow the Mandakini path used for water. Kausalya sees Dasharatha's simple offering and the work Lakshmana performs, reading the family's changed life in ordinary objects.", hi: "कौसल्या, सुमित्रा, कैकेयी और अन्य रानियाँ मंदाकिनी की जल-राह पर चलती हैं। कौसल्या दशरथ का साधारण अर्पण और लक्ष्मण का श्रम देखकर सामान्य वस्तुओं में बदला पारिवारिक जीवन पढ़ती हैं।" }, visualCue: "The queens move slowly along the water path past a clay vessel, footprints, and the small offering on grass.", characterIds: ["kausalya", "sumitra", "kaikeyi", "lakshmana"] },
      { id: "family-embraces-dust", title: { en: "The palace family meets the forest family", hi: "महल का परिवार वन के परिवार से मिलता है" }, narration: { en: "Rama and Lakshmana bow; the mothers wipe dust from their backs. Sita takes their feet and Kausalya embraces her. The reunion is tactile and domestic before it becomes political again.", hi: "राम और लक्ष्मण प्रणाम करते हैं; माताएँ उनकी पीठ की धूल पोंछती हैं। सीता उनके चरण पकड़ती हैं और कौसल्या उन्हें गले लगाती हैं। राजनीति से पहले मिलन स्पर्श और परिवार का है।" }, visualCue: "Mothers' hands, bowed sons, and Sita's embrace fill the foreground while advisers wait beyond the cottage.", characterIds: ["rama", "lakshmana", "sita", "kausalya", "sumitra"] },
      { id: "silence-before-argument", title: { en: "Everyone waits for the first claim", hi: "सब पहले तर्क की प्रतीक्षा करते हैं" }, narration: { en: "After a night of mourning and morning rites, brothers, mothers, citizens, and advisers sit in silence. The entire expedition has reached its purpose, but affection alone has not decided who must return.", hi: "शोक की रात और प्रातःकर्म के बाद भाई, माताएँ, नागरिक और सलाहकार मौन बैठते हैं। पूरी यात्रा अपने उद्देश्य तक पहुँच गई है, पर स्नेह ने अभी तय नहीं किया कि कौन लौटेगा।" }, visualCue: "A broad council settles in concentric layers around two silent brothers beside the river.", characterIds: ["rama", "bharata", "vasishta", "kausalya"] },
      { id: "bharata-grants-kingdom-back", title: { en: "Bharata returns what he never accepted", hi: "भरत वह लौटाते हैं जिसे कभी स्वीकार नहीं किया" }, narration: { en: "Bharata says the kingdom produced by Kaikeyi's demand is legally in his hands, and he gives it to Rama. He compares himself to someone unable to sustain the great tree another person raised.", hi: "भरत कहते हैं कि कैकेयी की माँग से मिला राज्य विधि के अनुसार उनके हाथ में है और वे उसे राम को देते हैं। वे स्वयं को उस व्यक्ति जैसा बताते हैं जो दूसरे के उगाए विशाल वृक्ष को सँभाल नहीं सकता।" }, visualCue: "Bharata places the royal seal and umbrella on the ground between himself and Rama rather than wearing them.", characterIds: ["bharata", "rama"] },
      { id: "rama-holds-fathers-word", title: { en: "Rama will not turn grief into broken truth", hi: "राम शोक को टूटे वचन में नहीं बदलते" }, narration: { en: "Rama answers that time separates every family and Dasharatha's command still binds both sons. Bharata must protect Ayodhya; Rama must complete fourteen years. Mourning cannot make the promise disappear.", hi: "राम कहते हैं कि समय हर परिवार को अलग करता है और दशरथ की आज्ञा दोनों पुत्रों को अब भी बाँधती है। भरत अयोध्या सँभालें, राम चौदह वर्ष पूरे करें; शोक वचन मिटा नहीं सकता।" }, visualCue: "The river moves between a fading image of Dasharatha and the two paths held by the brothers.", characterIds: ["rama", "bharata"] },
      { id: "bharata-argues-duty-to-living", title: { en: "Bharata argues that duty must repair harm", hi: "भरत कहते हैं कि धर्म को हानि सुधारनी चाहिए" }, narration: { en: "Bharata answers that an eldest living son should rule, a son may repair a father's harmful act, and government is itself Rama's responsibility. If Rama still chooses the forest, Bharata will remain there with him.", hi: "भरत उत्तर देते हैं कि जीवित ज्येष्ठ पुत्र को शासन करना चाहिए, पुत्र पिता के हानिकारक कर्म को सुधार सकता है और राजकार्य स्वयं राम का दायित्व है। फिर भी राम वन चुनें तो भरत भी वहीं रहेंगे।" }, visualCue: "Bharata gestures from the waiting citizens to the forest path, making both futures visible at once.", characterIds: ["bharata", "rama", "vasishta"] },
    ],
  },
  "sandals-hold-kingdom": {
    id: "sandals-hold-kingdom",
    decisiveChange: { en: "When every argument reaches its limit, a pair of sandals carries a temporary answer.", hi: "जब हर तर्क अपनी सीमा तक पहुँचता है, पादुकाएँ अस्थायी उत्तर सँभालती हैं।" },
    beats: [
      { id: "rama-restates-division", title: { en: "Rama names the divided obligation", hi: "राम बँटे हुए दायित्व को नाम देते हैं" }, narration: { en: "Rama restates the boons and says each brother preserves Dasharatha's truth by carrying his assigned part: Bharata the kingdom, Rama the forest. The four brothers must protect one promise through different work.", hi: "राम वरों को दोहराकर कहते हैं कि हर भाई अपना भाग निभाकर दशरथ का सत्य बचाए—भरत राज्य, राम वन। चारों भाइयों को अलग कार्य से एक वचन की रक्षा करनी है।" }, visualCue: "Four brothers occupy distinct paths around one fading royal promise at the centre.", characterIds: ["rama", "bharata", "shatrughna", "lakshmana"] },
      { id: "javali-offers-radical-exit", title: { en: "Javali attacks the premise", hi: "जावालि आधार पर ही प्रश्न उठाते हैं" }, narration: { en: "Trying to make Rama return, Javali argues that relationships end, death ends obligation, and visible welfare should outweigh rites and promises. His speech is a position inside the debate, not the narrator's settled conclusion.", hi: "राम को लौटाने के लिए जावालि कहते हैं कि संबंध समाप्त होते हैं, मृत्यु दायित्व खत्म करती है और दृश्य लोककल्याण को संस्कार व वचन से ऊपर होना चाहिए। यह बहस का पक्ष है, अंतिम निष्कर्ष नहीं।" }, visualCue: "Javali steps into the open council as ancestral symbols and the waiting city recede into opposing halves.", characterIds: ["javali", "rama", "bharata"] },
      { id: "rama-answers-with-public-trust", title: { en: "Rama answers that conduct becomes public trust", hi: "राम कहते हैं कि आचरण सार्वजनिक विश्वास बनता है" }, narration: { en: "Rama rejects Javali's reasoning: a ruler's conduct teaches others, and truth sustains public confidence. Javali then says he used the argument strategically, revealing the exchange as persuasion rather than simple doctrine.", hi: "राम जावालि का तर्क अस्वीकार करते हैं—शासक का आचरण दूसरों को दिशा देता है और सत्य सार्वजनिक भरोसा सँभालता है। जावालि बताते हैं कि उन्होंने यह पक्ष रणनीतिक रूप से रखा था।" }, visualCue: "A web of citizens and promises brightens behind Rama as Javali's shadowed argument folds back into the council.", characterIds: ["rama", "javali"] },
      { id: "vasishta-adds-lineage-and-care", title: { en: "Vasishta adds lineage, mother, and teacher", hi: "वसिष्ठ वंश, माता और गुरु का पक्ष जोड़ते हैं" }, narration: { en: "Vasishta invokes the eldest-son tradition and his authority as teacher; he asks Rama to heed mother, brother, and people. Rama answers that parental care creates a debt he can honour only by keeping Dasharatha's command.", hi: "वसिष्ठ ज्येष्ठ-पुत्र परंपरा और गुरु-अधिकार रखते हुए राम से माता, भाई और प्रजा की सुनने को कहते हैं। राम कहते हैं कि माता-पिता की सेवा का ऋण दशरथ की आज्ञा निभाकर ही चुक सकता है।" }, visualCue: "Vasishta stands between the mothers, the ancestral line, and the brothers while Rama remains beside the forest fire.", characterIds: ["vasishta", "rama", "bharata", "kausalya"] },
      { id: "bharata-lies-at-door", title: { en: "Bharata refuses food and movement", hi: "भरत अन्न और गति दोनों रोक देते हैं" }, narration: { en: "With persuasion exhausted, Bharata spreads grass at the cottage door and vows to lie there until Rama yields. When that too fails, he offers to serve the fourteen-year exile as Rama's substitute.", hi: "तर्क समाप्त होने पर भरत कुटिया के द्वार पर कुश बिछाकर राम के मानने तक पड़े रहने का व्रत लेते हैं। यह भी विफल होने पर वे चौदह वर्ष का वनवास स्वयं लेने की बात रखते हैं।" }, visualCue: "Bharata lies across the cottage threshold while citizens, Sumantra, and Rama form a tense still circle.", characterIds: ["bharata", "rama", "sumantra"] },
      { id: "sandals-become-trust", title: { en: "The sandals become a bounded trust", hi: "पादुकाएँ सीमित धरोहर बनती हैं" }, narration: { en: "Rama will not accept a substitute, but gives Bharata his sandals. Bharata promises to govern outside Ayodhya in their name, live austerely, and return the kingdom when Rama comes back at fourteen years.", hi: "राम प्रतिनिधि वनवास स्वीकार नहीं करते, पर भरत को अपनी पादुकाएँ देते हैं। भरत उनके नाम पर अयोध्या के बाहर रहकर संयम से शासन और चौदह वर्ष बाद राज्य लौटाने का वचन देते हैं।" }, visualCue: "The sandals pass from Rama's feet into Bharata's raised hands as every competing path dims around them.", characterIds: ["rama", "bharata", "shatrughna", "vasishta"] },
    ],
  },
  "nandigrama-trust": {
    id: "nandigrama-trust",
    decisiveChange: { en: "The journey fails to bring Rama home, but builds a visible trust that can wait for him.", hi: "यात्रा राम को घर नहीं ला पाती, पर उनके लिए प्रतीक्षा कर सकने वाली दृश्य धरोहर रचती है।" },
    beats: [
      { id: "sandals-leave-chitrakoot", title: { en: "Bharata carries the answer above himself", hi: "भरत उत्तर को अपने ऊपर रखते हैं" }, narration: { en: "Bharata places the sandals on his head and leaves Chitrakoot with Shatrughna, Vasishta, Javali, ministers, mothers, and citizens. Rama returns weeping to the cottage; neither road feels like victory.", hi: "भरत पादुकाएँ सिर पर रखकर शत्रुघ्न, वसिष्ठ, जावालि, मंत्रियों, माताओं और नागरिकों के साथ चित्रकूट से लौटते हैं। राम रोते हुए कुटिया जाते हैं; कोई भी राह विजय जैसी नहीं लगती।" }, visualCue: "The returning procession curves away while Rama's small cottage remains lit on the far mountain behind.", characterIds: ["bharata", "shatrughna", "vasishta", "javali", "rama"] },
      { id: "bharadvaja-hears-outcome", title: { en: "The road reports back", hi: "राह अपना परिणाम बताती है" }, narration: { en: "At Prayaga, Bharata tells Bharadvaja that Rama would not break the fourteen-year promise and that the sandals now carry the work of government. The sage recognizes the resolution without pretending the brothers agreed.", hi: "प्रयाग में भरत भरद्वाज को बताते हैं कि राम चौदह वर्ष का वचन नहीं तोड़ेंगे और पादुकाएँ अब शासन का कार्य सँभालेंगी। ऋषि समाधान स्वीकारते हैं, भाइयों की असहमति मिटाते नहीं।" }, visualCue: "Bharata presents the sandals before Bharadvaja as the remembered Chitrakoot council hovers behind them.", characterIds: ["bharata", "bharadvaja", "rama"] },
      { id: "rivers-reverse-direction", title: { en: "Every crossing now points away from Rama", hi: "हर नदी अब राम से दूर ले जाती है" }, narration: { en: "The expedition crosses Yamuna and Ganga again, passes Shringaverapura, and approaches Ayodhya. The same geography that carried hope outward now carries a difficult responsibility back.", hi: "यात्रा फिर यमुना और गंगा पार कर शृंगवेरपुर से अयोध्या की ओर बढ़ती है। जो भू-दृश्य आशा को बाहर ले गया था, वही अब कठिन उत्तरदायित्व वापस ला रहा है।" }, visualCue: "Two river crossings flow in reverse beneath the procession, with the sandals remaining the fixed foreground point.", characterIds: ["bharata", "shatrughna"] },
      { id: "ayodhya-still-without-rama", title: { en: "The city is still waiting", hi: "नगर अब भी प्रतीक्षा में है" }, narration: { en: "Ayodhya's closed doors, silent music, empty markets, and dark palace show that the journey did not restore ordinary life. Bharata sees a city that cannot yet celebrate and refuses to occupy its centre.", hi: "अयोध्या के बंद द्वार, मौन संगीत, खाली बाज़ार और अँधेरा महल बताते हैं कि यात्रा ने सामान्य जीवन नहीं लौटाया। भरत उस नगर का केंद्र लेने से इंकार करते हैं जो अभी उत्सव नहीं मना सकता।" }, visualCue: "The returning column enters a dim city while the bright sandals remain untouched by the empty palace beyond.", characterIds: ["bharata", "rama"] },
      { id: "bharata-chooses-nandigrama", title: { en: "Bharata chooses to govern from outside", hi: "भरत बाहर से शासन चुनते हैं" }, narration: { en: "After settling the mothers in Ayodhya, Bharata tells Vasishta and the counsellors he will live at Nandigrama. Rama is king; Bharata will carry the reins only while waiting for him.", hi: "माताओं को अयोध्या में ठहराकर भरत वसिष्ठ और मंत्रियों से कहते हैं कि वे नंदिग्राम में रहेंगे। राजा राम हैं; भरत केवल उनकी प्रतीक्षा में कार्यभार सँभालेंगे।" }, visualCue: "The palace recedes as Bharata's car turns toward a smaller settlement on the open horizon.", characterIds: ["bharata", "vasishta", "shatrughna", "rama"] },
      { id: "trust-installed-not-king", title: { en: "A trust is installed, not another king", hi: "राजा नहीं, धरोहर स्थापित होती है" }, narration: { en: "At Nandigrama the sandals receive the umbrella and ceremonial place. Bharata wears bark and matted hair, reports decisions in subordination to them, and defines his rule by the moment it must end: Rama's return.", hi: "नंदिग्राम में पादुकाओं को छत्र और राजकीय स्थान मिलता है। भरत वल्कल-जटा धारण कर उनके अधीन निर्णय लेते हैं और अपने शासन को उस क्षण से परिभाषित करते हैं जब वह समाप्त होगा—राम की वापसी।" }, visualCue: "The sandals sit beneath a white umbrella in a spare open court while Bharata stands below them and citizens gather around.", characterIds: ["bharata", "shatrughna", "vasishta", "rama"] },
    ],
  },
};

export const RAMAYANA_ROAD_ASKS_HOME_DISTRICT: StoryDistrict = {
  id: "road-asks-home-v1",
  title: { en: "The road that asks Rama home", hi: "वह राह जो राम को घर बुलाती है" },
  invitation: { en: "Travel with Bharata from the Ganga to Chitrakoot, enter the brothers' unresolved debate, carry the sandals back, and build the waiting trust at Nandigrama.", hi: "भरत के साथ गंगा से चित्रकूट जाएँ, भाइयों की अनसुलझी बहस में प्रवेश करें, पादुकाएँ वापस लाएँ और नंदिग्राम में प्रतीक्षा की धरोहर रचें।" },
  entryMomentId: "expedition-reaches-ganga",
  momentIds: ["expedition-reaches-ganga", "guha-shows-first-night", "bharadvaja-tests-hosts", "chitrakoot-hears-army", "brothers-meet-death-news", "family-asks-rama-home", "sandals-hold-kingdom", "nandigrama-trust"],
  compassTurnIds: ["bharata-follows", "sandals-and-promise"],
};
