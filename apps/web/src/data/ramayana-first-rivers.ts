import type {
  StoryDistrict,
  StoryMoment,
  StoryWorldNode,
  StoryWorldRoute,
} from "@/lib/domain/story-world";

const SOURCE_REF = "sha256:7d3b9e1613d60dfacea39f2564243e943cf38703eadb7245d92337b238082034";

export const RAMAYANA_FIRST_RIVERS_SCENE_NODE_IDS: Record<string, string[]> = {
  "city-follows-car": ["city-follows-car-event", "ayodhya", "rama", "sita", "lakshmana", "sumantra", "king-dasharatha", "kausalya"],
  "tamasa-night": ["tamasa-night-event", "tamasa-bank-story-world", "rama", "sita", "lakshmana", "sumantra"],
  "roads-beyond-kosala": ["roads-beyond-kosala-event", "kosala-road-story-world", "rama", "sita", "lakshmana", "sumantra"],
  "guha-night-watch": ["guha-night-watch-event", "shringaverapura-story-world", "guha", "rama", "sita", "lakshmana", "sumantra"],
  "ganga-crossing": ["ganga-crossing-event", "ganga-crossing-story-world", "rama", "sita", "lakshmana", "guha", "sumantra"],
  "first-forest-night": ["first-forest-night-event", "first-forest-night-story-world", "rama", "sita", "lakshmana"],
  "prayaga-to-yamuna": ["prayaga-to-yamuna-event", "prayaga-confluence-story-world", "bharadvaja", "yamuna-crossing-story-world", "rama", "sita", "lakshmana"],
  "chitrakoot-home": ["chitrakoot-home-event", "chitrakoot-cottage-story-world", "chitrakoot", "rama", "sita", "lakshmana"],
};

export const RAMAYANA_FIRST_RIVERS_CAST_NODE_IDS: Record<string, string> = {
  Sumantra: "sumantra",
};

const eventNodes: StoryWorldNode[] = [
  ["city-follows-car-event", "The city follows the departing car", "Palace grief becomes a public procession as citizens refuse to let the departing travellers vanish alone."],
  ["tamasa-night-event", "The first night at the Tamasa", "The travellers share their first night outside Ayodhya with citizens sleeping nearby, then leave before dawn."],
  ["roads-beyond-kosala-event", "The road passes beyond Kosala", "Villages, fields, and river crossings carry the travellers beyond the kingdom toward the Ganga."],
  ["guha-night-watch-event", "Guha and Lakshmana keep watch", "At Shringaverapura, hospitality and friendship meet a night of grief beside Rama and Sita's ground-bed."],
  ["ganga-crossing-event", "The Ganga divides two lives", "A boat, a final farewell to Sumantra, and Sita's prayer carry the three travellers beyond the chariot road."],
  ["first-forest-night-event", "The first night beyond the chariot", "Without Sumantra or an inhabited road, Rama voices fear for the family left behind and Lakshmana answers him."],
  ["prayaga-to-yamuna-event", "From the confluence to the Yamuna", "Bharadvaja points toward Chitrakoot; the travellers build a raft and continue through an unfamiliar flowering landscape."],
  ["chitrakoot-home-event", "A home rises at Chitrakoot", "The mountain journey ends with a leaf-thatched cottage and the first place the three deliberately make their own."],
].map(([id, label, summary]) => ({
  id,
  label,
  kind: "Story event",
  family: "event_story",
  summary,
  searchQuery: `${label} Ramayana Ayodhya Kanda`,
  evidenceBoundary: "This event is a Devam retelling bounded to Ayodhyā Kāṇḍa sections XLI–LVI in the selected Manmatha Nath Dutt Project Gutenberg electronic edition. It is not every Ramayana telling, historical reconstruction, or modern geographic claim.",
}));

const placeAndCharacterNodes: StoryWorldNode[] = [
  {
    id: "sumantra",
    label: "Sumantra",
    kind: "Narrative charioteer",
    family: "being_person",
    summary: "Follow the charioteer who carries the travellers out of Ayodhya, shares their first nights, and must return with the empty car.",
    searchQuery: "Sumantra Ramayana Ayodhya Kanda exile",
    evidenceBoundary: "This character path follows one selected English edition and does not claim a complete Sumantra tradition or historical biography.",
  },
  {
    id: "tamasa-bank-story-world",
    label: "The Tamasa riverbank",
    kind: "Narrative place",
    family: "place_polity",
    summary: "Enter the first night of exile, where the citizens sleep beneath trees and the travellers leave before dawn.",
    searchQuery: "Tamasa river Ramayana first night exile",
    evidenceBoundary: "This is narrative geography in the selected edition, not a modern coordinate, archaeological identification, or universal route claim.",
  },
  {
    id: "kosala-road-story-world",
    label: "The road beyond Kosala",
    kind: "Narrative route",
    family: "place_polity",
    summary: "Travel through fields, villages, and rivers as the remembered city finally drops beyond sight.",
    searchQuery: "Rama leaves Kosala road Ganga Ayodhya Kanda",
    evidenceBoundary: "This is a story route compiled from the selected edition; it does not assert a recoverable modern itinerary.",
  },
  {
    id: "shringaverapura-story-world",
    label: "Shringaverapura",
    kind: "Narrative place",
    family: "place_polity",
    summary: "Enter Guha's river settlement as a world of friendship, hospitality, horses, and night watch.",
    searchQuery: "Shringaverapura Guha Rama Ayodhya Kanda",
    evidenceBoundary: "This is the narrative settlement in the selected edition. Modern locations, archaeology, living traditions, and other tellings remain separate evidence lanes.",
  },
  {
    id: "ganga-crossing-story-world",
    label: "The Ganga crossing",
    kind: "Narrative crossing",
    family: "place_polity",
    summary: "Stand at the crossing where Sumantra turns back, Sita voices hope of return, and the three travellers leave the chariot world behind.",
    searchQuery: "Rama Sita Lakshmana Ganga crossing Guha Sumantra",
    evidenceBoundary: "This is story geography in Ayodhyā Kāṇḍa section LII, not a modern ferry point or historical-location claim.",
  },
  {
    id: "first-forest-night-story-world",
    label: "The first forest night",
    kind: "Narrative place",
    family: "place_polity",
    summary: "A tree and a bed of leaves become the setting for Rama's fear, anger, grief, and Lakshmana's answer.",
    searchQuery: "Ramayana Ayodhya Kanda LIII first forest night",
    evidenceBoundary: "This is an edition-scoped narrative place without a claimed modern coordinate.",
  },
  {
    id: "prayaga-confluence-story-world",
    label: "The confluence at Prayaga",
    kind: "Narrative place",
    family: "place_polity",
    summary: "Reach Bharadvaja's hermitage where two rivers meet and the road to Chitrakoot is chosen.",
    searchQuery: "Bharadvaja Prayaga Chitrakoot Ramayana Ayodhya Kanda",
    evidenceBoundary: "This is narrative geography in the selected edition; historical, archaeological, pilgrimage, and current-city layers require their own evidence.",
  },
  {
    id: "yamuna-crossing-story-world",
    label: "The Yamuna crossing",
    kind: "Narrative crossing",
    family: "place_polity",
    summary: "Follow a hand-built raft, Sita's prayer, the Syama tree, and the flowering road toward Chitrakoot.",
    searchQuery: "Sita Yamuna crossing Syama tree Chitrakoot Ramayana",
    evidenceBoundary: "This is an edition-scoped story crossing, not modern travel guidance, ritual instruction, or a precise historical coordinate.",
  },
  {
    id: "chitrakoot-cottage-story-world",
    label: "The cottage at Chitrakoot",
    kind: "Narrative home",
    family: "place_polity",
    summary: "Enter the leaf-thatched home Lakshmana builds and the three travellers inhabit at the end of this district.",
    searchQuery: "Chitrakoot cottage Rama Sita Lakshmana Ayodhya Kanda LVI",
    evidenceBoundary: "This is a narrative dwelling in the selected edition. The described house-entry rites are source-story, not modern prescriptive vidhi; modern Chitrakoot sites remain separate.",
  },
];

export const RAMAYANA_FIRST_RIVERS_LOCAL_NODES: Record<string, StoryWorldNode> = Object.fromEntries(
  [...eventNodes, ...placeAndCharacterNodes].map((node) => [node.id, node]),
);

const route = (id: string, relation: string, relationKind: StoryWorldRoute["relationKind"], destinationId: string): StoryWorldRoute => ({
  id,
  relation,
  relationKind,
  destinationId,
  sourceRef: SOURCE_REF,
});

export const RAMAYANA_FIRST_RIVERS_LOCAL_ROUTES: Record<string, StoryWorldRoute[]> = Object.fromEntries(
  Object.entries(RAMAYANA_FIRST_RIVERS_SCENE_NODE_IDS).map(([, nodeIds]) => {
    const [eventId, placeId, ...characterIds] = nodeIds;
    return [eventId, [
      route(`${eventId}-to-${placeId}`, "unfolds at", "place", placeId),
      ...characterIds.slice(0, 6).map((nodeId) => route(`${eventId}-to-${nodeId}`, "changes the road of", "story", nodeId)),
    ] satisfies StoryWorldRoute[]];
  }),
);

RAMAYANA_FIRST_RIVERS_LOCAL_ROUTES.sumantra = [
  route("sumantra-to-rama", "drives and serves", "association", "rama"),
  route("sumantra-to-ganga-crossing", "turns back at", "story", "ganga-crossing-story-world"),
];
RAMAYANA_FIRST_RIVERS_LOCAL_ROUTES["tamasa-bank-story-world"] = [route("tamasa-to-ayodhya", "holds the citizens who followed from", "story", "ayodhya")];
RAMAYANA_FIRST_RIVERS_LOCAL_ROUTES["kosala-road-story-world"] = [
  route("kosala-road-to-ayodhya", "leaves behind", "place", "ayodhya"),
  route("kosala-road-to-shringaverapura", "reaches", "story", "shringaverapura-story-world"),
];
RAMAYANA_FIRST_RIVERS_LOCAL_ROUTES["shringaverapura-story-world"] = [
  route("shringaverapura-to-guha", "is cared for by", "association", "guha"),
  route("shringaverapura-to-ganga", "opens onto", "place", "ganga-crossing-story-world"),
];
RAMAYANA_FIRST_RIVERS_LOCAL_ROUTES["ganga-crossing-story-world"] = [
  route("ganga-crossing-to-guha", "is made possible by", "association", "guha"),
  route("ganga-crossing-to-first-forest-night", "continues toward", "story", "first-forest-night-story-world"),
];
RAMAYANA_FIRST_RIVERS_LOCAL_ROUTES["first-forest-night-story-world"] = [route("first-forest-night-to-prayaga", "continues toward", "story", "prayaga-confluence-story-world")];
RAMAYANA_FIRST_RIVERS_LOCAL_ROUTES["prayaga-confluence-story-world"] = [
  route("prayaga-to-bharadvaja", "is guided by", "association", "bharadvaja"),
  route("prayaga-to-yamuna", "opens the road across", "story", "yamuna-crossing-story-world"),
];
RAMAYANA_FIRST_RIVERS_LOCAL_ROUTES["yamuna-crossing-story-world"] = [route("yamuna-to-chitrakoot-home", "carries the travellers toward", "story", "chitrakoot-cottage-story-world")];
RAMAYANA_FIRST_RIVERS_LOCAL_ROUTES["chitrakoot-cottage-story-world"] = [
  route("chitrakoot-home-to-chitrakoot", "belongs to the narrative world of", "place", "chitrakoot"),
  route("chitrakoot-home-to-rama", "is inhabited by", "story", "rama"),
  route("chitrakoot-home-to-sita", "is inhabited by", "story", "sita"),
  route("chitrakoot-home-to-lakshmana", "is built by", "story", "lakshmana"),
];

export const RAMAYANA_FIRST_RIVERS_MOMENTS: Record<string, StoryMoment> = {
  "city-follows-car": {
    id: "city-follows-car",
    decisiveChange: { en: "The exile leaves the palace and becomes the grief of an entire city.", hi: "वनवास महल से निकलकर पूरे नगर का शोक बन जाता है।" },
    beats: [
      { id: "inner-rooms-erupt", title: { en: "The inner rooms erupt", hi: "अंतःपुर में विलाप उठता है" }, narration: { en: "As the car leaves, voices rise through the royal apartments. The people who depended on Rama ask where their refuge is going; private loss spills into the city.", hi: "रथ निकलते ही राजमहल के अंतःपुर में स्वर उठते हैं। राम पर निर्भर लोग पूछते हैं कि उनका सहारा कहाँ जा रहा है; निजी हानि पूरे नगर में फैल जाती है।" }, visualCue: "Palace balconies fill with grieving figures as a small chariot moves toward the gate.", characterIds: ["rama", "sita", "lakshmana", "king-dasharatha"] },
      { id: "dasharatha-watches-dust", title: { en: "Dasharatha watches the dust", hi: "दशरथ धूल को देखते रहते हैं" }, narration: { en: "Dasharatha keeps his eyes on the departing car until even its dust disappears. Only then does his body give way and Kausalya helps raise him from the road.", hi: "दशरथ जाते रथ को तब तक देखते हैं जब तक उसकी धूल भी ओझल नहीं हो जाती। तभी उनका शरीर जवाब देता है और कौसल्या उन्हें मार्ग से उठाती हैं।" }, visualCue: "An ageing king reaches toward a distant dust trail under the city gate.", characterIds: ["king-dasharatha", "kausalya", "rama"] },
      { id: "kausalya-imagines-road", title: { en: "Kausalya imagines the road", hi: "कौसल्या आगे की राह कल्पना करती हैं" }, narration: { en: "Inside the darkened palace, Kausalya imagines the three without familiar beds, food, or shelter. Her grief stretches ahead to the day Ayodhya might see them return.", hi: "अँधेरे महल में कौसल्या तीनों को परिचित शय्या, भोजन और आश्रय के बिना सोचती हैं। उनका शोक उस दिन तक फैलता है जब अयोध्या उन्हें लौटते देख सकेगी।" }, visualCue: "Kausalya sits beside the collapsed king while the imagined forest glows beyond a window.", characterIds: ["kausalya", "king-dasharatha", "rama", "sita", "lakshmana"] },
      { id: "sumitra-holds-return", title: { en: "Sumitra keeps return imaginable", hi: "सुमित्रा वापसी की आशा थामती हैं" }, narration: { en: "Sumitra does not erase the pain. She reminds Kausalya that Lakshmana and Sita chose to accompany Rama and insists that the road can still end in return.", hi: "सुमित्रा पीड़ा को नकारती नहीं हैं। वे कौसल्या को याद दिलाती हैं कि लक्ष्मण और सीता ने राम का साथ चुना है और यह राह वापसी पर भी समाप्त हो सकती है।" }, visualCue: "Two mothers sit together as a thin line of dawn enters the room.", characterIds: ["kausalya", "lakshmana", "sita", "rama"] },
      { id: "citizens-take-road", title: { en: "The citizens take the road", hi: "नगरवासी भी राह पकड़ते हैं" }, narration: { en: "Citizens follow on foot and ask the horses to stop. Rama leaves the car to walk beside elders who cannot keep pace, and darkness finds the crowd still following.", hi: "नगरवासी पैदल पीछे चलते हैं और घोड़ों से रुकने की विनती करते हैं। राम धीमे चल रहे बुज़ुर्गों के साथ पैदल हो जाते हैं, और अँधेरा भीड़ को अब भी मार्ग पर पाता है।" }, visualCue: "The three travellers walk beside elders while the chariot rolls slowly through a widening crowd.", characterIds: ["rama", "sita", "lakshmana", "sumantra"] },
    ],
  },
  "tamasa-night": {
    id: "tamasa-night",
    decisiveChange: { en: "The first night of exile ends with a departure the sleeping city cannot prevent.", hi: "वनवास की पहली रात ऐसे प्रस्थान में बदलती है जिसे सोया नगर रोक नहीं सकता।" },
    beats: [
      { id: "first-night-named", title: { en: "Rama names the first night", hi: "राम पहली रात को पहचानते हैं" }, narration: { en: "At the Tamasa, Rama calls this the first night of exile. He speaks of the parents and city behind them while the forest answers with birds and animals settling into darkness.", hi: "तमसा के तट पर राम इसे वनवास की पहली रात कहते हैं। वे पीछे छूटे माता-पिता और नगर की बात करते हैं, जबकि वन पक्षियों और पशुओं के रात्रि-स्वरों से उत्तर देता है।" }, visualCue: "A river mirrors moonlight while the travellers make a sparse camp beneath trees.", characterIds: ["rama", "sita", "lakshmana", "sumantra"] },
      { id: "city-sleeps-under-trees", title: { en: "Ayodhya sleeps beneath trees", hi: "अयोध्या वृक्षों के नीचे सोती है" }, narration: { en: "The citizens who followed lie exhausted nearby. Their determination has carried a piece of Ayodhya into the open country, but fatigue finally closes their eyes.", hi: "पीछे आए नगरवासी पास ही थककर लेट जाते हैं। उनका संकल्प अयोध्या का एक अंश खुले प्रदेश तक ले आया है, पर थकान अंततः उनकी आँखें बंद कर देती है।" }, visualCue: "Hundreds of sleeping citizens form quiet rings beneath the riverbank trees.", characterIds: ["rama", "sita", "lakshmana"] },
      { id: "leave-before-dawn", title: { en: "Compassion requires leaving", hi: "करुणा अब चले जाने को कहती है" }, narration: { en: "Rama says a ruler should not let citizens destroy themselves for his hardship. He chooses to leave while they sleep rather than keep rewarding their refusal to turn home.", hi: "राम कहते हैं कि शासक को अपनी कठिनाई के कारण प्रजा को स्वयं कष्ट में नहीं डालना चाहिए। वे उनके जागने से पहले निकलना चुनते हैं, ताकि उनका लौटने से इंकार बढ़े नहीं।" }, visualCue: "Rama looks back at the sleeping crowd while Lakshmana readies the quiet chariot.", characterIds: ["rama", "lakshmana", "sita", "sumantra"] },
      { id: "tracks-turn-north", title: { en: "The tracks tell the wrong story", hi: "रथचिह्न दूसरी कहानी कहते हैं" }, narration: { en: "Sumantra first drives north, then turns and takes the forest road so the trail cannot be followed. The chariot crosses the Tamasa before dawn fully arrives.", hi: "सुमंत्र पहले रथ उत्तर की ओर ले जाते हैं, फिर मोड़कर वनमार्ग पकड़ते हैं ताकि चिह्नों का पीछा न हो सके। पूर्ण भोर से पहले रथ तमसा पार कर जाता है।" }, visualCue: "Wheel tracks fork on pale ground while the chariot slips through blue predawn mist.", characterIds: ["sumantra", "rama", "sita", "lakshmana"] },
      { id: "citizens-wake-to-absence", title: { en: "The citizens wake to absence", hi: "नगरवासी रिक्तता में जागते हैं" }, narration: { en: "At sunrise the followers find no car and lose its track. Their return to Ayodhya is not defeat in one line: homes, markets, kitchens, music, and ordinary recognition all fall silent.", hi: "सूर्योदय पर अनुयायियों को रथ नहीं मिलता और उसके चिह्न खो जाते हैं। उनकी अयोध्या-वापसी एक पंक्ति की हार नहीं—घर, बाज़ार, रसोई, संगीत और रोज़मर्रा की पहचान सब मौन हो जाते हैं।" }, visualCue: "An empty riverbank dissolves into shuttered markets and dark homes in the distance.", characterIds: ["rama"] },
    ],
  },
  "roads-beyond-kosala": {
    id: "roads-beyond-kosala",
    decisiveChange: { en: "Ayodhya becomes a promise behind them as the Ganga opens ahead.", hi: "अयोध्या पीछे छूटा वचन बनती है और आगे गंगा खुलती है।" },
    beats: [
      { id: "villages-speak-aloud", title: { en: "The villages speak aloud", hi: "गाँव खुलकर बोलते हैं" }, narration: { en: "Passing ploughed fields and flowering woods, the travellers hear villagers condemn the decision that sent them away. The political rupture travels faster than the car.", hi: "जुते खेतों और फूलते वनों से गुजरते हुए यात्री गाँववालों को उस निर्णय की निंदा करते सुनते हैं जिसने उन्हें भेजा। राजनीतिक टूटन रथ से भी तेज़ फैलती है।" }, visualCue: "Field workers pause as the chariot passes between green plots and flowering groves.", characterIds: ["rama", "sita", "lakshmana", "sumantra"] },
      { id: "rivers-mark-distance", title: { en: "Rivers measure the distance", hi: "नदियाँ दूरी मापती हैं" }, narration: { en: "The Vedashruti, Gomati, and Sandika are crossed amid cultivated land, birds, and cattle. Each waterline makes the palace world less immediate.", hi: "वेदश्रुति, गोमती और स्यंदिका को खेतों, पक्षियों और पशुओं के बीच पार किया जाता है। हर जलरेखा महल के संसार को थोड़ा और दूर कर देती है।" }, visualCue: "A layered landscape of fields and silver rivers recedes behind the moving chariot.", characterIds: ["rama", "sita", "lakshmana", "sumantra"] },
      { id: "rama-faces-ayodhya", title: { en: "Rama faces Ayodhya once more", hi: "राम एक बार फिर अयोध्या की ओर देखते हैं" }, narration: { en: "At the edge of Kosala, Rama turns back, salutes the city and its guardians, and says he will return after completing what he owes his father.", hi: "कोसल की सीमा पर राम पीछे मुड़कर नगर और उसके रक्षकों को प्रणाम करते हैं और कहते हैं कि पिता का दायित्व पूरा कर वे लौटेंगे।" }, visualCue: "Rama stands in the chariot facing a tiny city on the far horizon.", characterIds: ["rama", "sita", "lakshmana"] },
      { id: "ganga-fills-horizon", title: { en: "The Ganga fills the horizon", hi: "गंगा क्षितिज भर देती है" }, narration: { en: "The journey reaches a river too vast to be another passing stream. Water, sandbanks, birds, trees, and hermitages expand into a new world beside Shringaverapura.", hi: "यात्रा ऐसी नदी तक पहुँचती है जो केवल एक और धारा नहीं। जल, रेतीले तट, पक्षी, वृक्ष और आश्रम शृंगवेरपुर के पास एक नया संसार खोलते हैं।" }, visualCue: "The road crests above a vast luminous river threaded with sandbanks and forest.", characterIds: ["rama", "sita", "lakshmana", "sumantra"] },
      { id: "guha-arrives-as-friend", title: { en: "Guha arrives as a friend", hi: "गुह मित्र बनकर आते हैं" }, narration: { en: "Guha comes with kin and offerings, embraces Rama, and asks after the journey. The first welcome beyond Kosala is offered as friendship, not as a faceless service stop.", hi: "गुह अपने लोगों और भेंटों के साथ आते हैं, राम को आलिंगन देते हैं और यात्रा का हाल पूछते हैं। कोसल के बाहर पहला स्वागत मित्रता है, कोई अनाम पड़ाव नहीं।" }, visualCue: "Guha approaches the river camp with open arms while his community gathers behind him.", characterIds: ["guha", "rama", "sita", "lakshmana", "sumantra"] },
    ],
  },
  "guha-night-watch": {
    id: "guha-night-watch",
    decisiveChange: { en: "Hospitality becomes shared vigilance around a friendship that refuses indifference.", hi: "आतिथ्य ऐसी साझा चौकसी बनता है जिसमें मित्रता उदासीन नहीं रह सकती।" },
    beats: [
      { id: "guha-offers-a-kingdom", title: { en: "Guha offers everything at hand", hi: "गुह अपने पास का सब कुछ प्रस्तुत करते हैं" }, narration: { en: "Food, beds, supplies, protection, and even the settlement are placed before Rama. Guha's welcome has political weight as well as personal affection.", hi: "भोजन, शय्या, सामग्री, सुरक्षा और यहाँ तक कि अपना क्षेत्र भी गुह राम के सामने रखते हैं। उनका स्वागत निजी स्नेह के साथ राजनीतिक भार भी रखता है।" }, visualCue: "Offerings, horses, and boats frame Guha and Rama beside the river settlement.", characterIds: ["guha", "rama"] },
      { id: "vow-shapes-acceptance", title: { en: "The vow shapes what can be accepted", hi: "व्रत तय करता है कि क्या स्वीकार होगा" }, narration: { en: "Rama accepts the affection but declines comforts incompatible with the life he has undertaken. He asks only that Dasharatha's horses be fed and tended well.", hi: "राम स्नेह स्वीकार करते हैं, पर अपने चुने वनजीवन से असंगत सुख-सामग्री नहीं। वे केवल दशरथ के घोड़ों के भोजन और देखभाल का आग्रह करते हैं।" }, visualCue: "Rama gently redirects rich trays toward the waiting horses.", characterIds: ["rama", "guha", "sumantra"] },
      { id: "ground-bed-by-ganga", title: { en: "Rama and Sita sleep on the ground", hi: "राम और सीता धरती पर सोते हैं" }, narration: { en: "After water and evening observance, Rama and Sita lie beneath the tree. The image is not serene decoration: everyone watching knows what comforts and people lie behind them.", hi: "जल और संध्या-क्रम के बाद राम और सीता वृक्ष के नीचे लेटते हैं। यह केवल शांत सजावट नहीं—देखने वाले जानते हैं कि उनके पीछे कौन-से सुख और लोग छूटे हैं।" }, visualCue: "The couple rest beneath an ingudi tree while firelight fades at the camp edge.", characterIds: ["rama", "sita", "lakshmana", "guha"] },
      { id: "lakshmana-refuses-bed", title: { en: "Lakshmana refuses the bed", hi: "लक्ष्मण शय्या अस्वीकार करते हैं" }, narration: { en: "Guha offers Lakshmana rest and takes responsibility for protection. Lakshmana answers that he cannot sleep while Rama and Sita lie on grass before him.", hi: "गुह लक्ष्मण को विश्राम देते और सुरक्षा की जिम्मेदारी लेते हैं। लक्ष्मण कहते हैं कि राम और सीता को घास पर सोते देखकर वे कैसे सो सकते हैं।" }, visualCue: "An unused bed remains behind Lakshmana as he takes his bow beneath the tree.", characterIds: ["lakshmana", "guha", "rama", "sita"] },
      { id: "two-friends-keep-watch", title: { en: "Two friends keep watch", hi: "दो मित्र रात भर पहरा देते हैं" }, narration: { en: "Lakshmana speaks his fear that Dasharatha and the mothers may not survive the night. Guha listens, weeps, and keeps watch with him until daybreak.", hi: "लक्ष्मण अपना भय कहते हैं कि दशरथ और माताएँ शायद यह रात न सह सकें। गुह सुनते हैं, आँसू बहाते हैं और भोर तक उनके साथ पहरा देते हैं।" }, visualCue: "Two armed silhouettes share a low fire while the river and sleeping camp recede behind them.", characterIds: ["lakshmana", "guha", "king-dasharatha", "kausalya"] },
    ],
  },
  "ganga-crossing": {
    id: "ganga-crossing",
    decisiveChange: { en: "The chariot turns back while the three travellers cross into a life that must continue on foot.", hi: "रथ लौटता है और तीनों ऐसी जीवन-यात्रा में पार जाते हैं जो अब पैदल चलेगी।" },
    beats: [
      { id: "boat-waits-at-dawn", title: { en: "A boat waits at dawn", hi: "भोर में नाव तैयार है" }, narration: { en: "Bird calls announce morning and Guha has a strong boat brought to the bank. Bows, quivers, travel bundles, and Sita must all cross together.", hi: "पक्षियों के स्वर भोर बताते हैं और गुह मजबूत नाव तट पर मँगवाते हैं। धनुष, तरकश, यात्रा-सामान और सीता—सबको साथ पार होना है।" }, visualCue: "A long wooden boat rocks in dawn light beneath the riverbank trees.", characterIds: ["guha", "rama", "sita", "lakshmana"] },
      { id: "sumantra-asks-to-stay", title: { en: "Sumantra asks not to return alone", hi: "सुमंत्र अकेले लौटने से मना करते हैं" }, narration: { en: "Sumantra pleads to remain for all fourteen years. He imagines Ayodhya seeing the empty car and asks how a truth so painful can be carried back.", hi: "सुमंत्र चौदहों वर्ष साथ रहने की विनती करते हैं। वे खाली रथ को देखती अयोध्या की कल्पना करते हैं और पूछते हैं कि इतना पीड़ादायक सत्य कैसे लौटाया जाए।" }, visualCue: "Sumantra holds the chariot rail while the waiting boat and river fill the background.", characterIds: ["sumantra", "rama", "sita", "lakshmana"] },
      { id: "messages-return-to-ayodhya", title: { en: "Messages return in their place", hi: "उनकी जगह संदेश लौटते हैं" }, narration: { en: "Rama asks Sumantra to steady Dasharatha, greet the mothers, summon Bharata, and report that the three do not regret keeping the command. The empty car will carry words.", hi: "राम सुमंत्र से दशरथ को संभालने, माताओं को प्रणाम कहने, भरत को बुलाने और यह बताने को कहते हैं कि तीनों आदेश निभाने पर पछता नहीं रहे। खाली रथ अब शब्द ले जाएगा।" }, visualCue: "Rama grips Sumantra's hand as palace figures appear like distant memories in the river mist.", characterIds: ["rama", "sumantra", "king-dasharatha", "kausalya"] },
      { id: "forest-vow-takes-form", title: { en: "The forest vow becomes visible", hi: "वन-व्रत दिखाई देने लगता है" }, narration: { en: "With Guha's help, Rama and Lakshmana bind their hair into matted locks. The change is treated as their source-story decision, not a costume reward or instruction for the user.", hi: "गुह की सहायता से राम और लक्ष्मण जटा बाँधते हैं। यह परिवर्तन स्रोत-कथा का उनका निर्णय है, कोई पोशाक-इनाम या उपयोगकर्ता के लिए निर्देश नहीं।" }, visualCue: "At the water's edge, practical hands prepare the travellers for the foot journey ahead.", characterIds: ["rama", "lakshmana", "guha"] },
      { id: "sita-prays-midstream", title: { en: "Sita speaks hope in midstream", hi: "मध्यधारा में सीता आशा बोलती हैं" }, narration: { en: "In the middle of the Ganga, Sita prays that the vow be completed and that all three return. The prayer belongs to this character and moment; it is not presented as universal modern vidhi.", hi: "गंगा की मध्यधारा में सीता प्रार्थना करती हैं कि व्रत पूरा हो और तीनों लौटें। यह इस पात्र और क्षण की प्रार्थना है, सार्वभौमिक आधुनिक विधि नहीं।" }, visualCue: "Sita joins her hands as the oars pull the small boat through a river of morning light.", characterIds: ["sita", "rama", "lakshmana", "guha"] },
    ],
  },
  "first-forest-night": {
    id: "first-forest-night",
    decisiveChange: { en: "Without road, car, or escort, grief finally speaks without ceremony.", hi: "मार्ग, रथ और साथियों के बिना शोक पहली बार बिना औपचारिकता के बोलता है।" },
    beats: [
      { id: "first-night-without-sumantra", title: { en: "The chariot is gone", hi: "रथ अब जा चुका है" }, narration: { en: "Under a great tree, Rama names this the first night beyond inhabited country without Sumantra. Leaves must become the bed and the three must provide for one another.", hi: "एक विशाल वृक्ष के नीचे राम इसे सुमंत्र और बस्ती से बाहर पहली रात कहते हैं। पत्ते शय्या बनेंगे और तीनों को एक-दूसरे की देखभाल करनी होगी।" }, visualCue: "Three small figures gather leaves beneath a vast tree in an uninhabited forest.", characterIds: ["rama", "sita", "lakshmana"] },
      { id: "rama-fears-for-home", title: { en: "Rama fears for those at home", hi: "राम घरवालों के लिए डरते हैं" }, narration: { en: "Rama imagines Dasharatha weakened, Kausalya exposed, and Kaikeyi pressing her advantage. Exile does not switch off anxiety about the household left behind.", hi: "राम दशरथ को निर्बल, कौसल्या को असुरक्षित और कैकेयी को अपना लाभ बढ़ाते सोचते हैं। वनवास पीछे छूटे परिवार की चिंता बंद नहीं करता।" }, visualCue: "Rama sits awake while the dark forest briefly mirrors the palace he fears for.", characterIds: ["rama", "king-dasharatha", "kausalya"] },
      { id: "anger-is-spoken-not-acted", title: { en: "Anger is spoken, not acted", hi: "क्रोध कहा जाता है, किया नहीं जाता" }, narration: { en: "He admits that force could seize Ayodhya, then rejects the act as wrong. The scene preserves the anger and the refusal instead of flattening him into effortless calm.", hi: "वे स्वीकारते हैं कि बल से अयोध्या ली जा सकती है, फिर उस कर्म को अनुचित कहकर छोड़ते हैं। दृश्य उन्हें सहज शांत बनाने के बजाय क्रोध और उसके त्याग दोनों को रखता है।" }, visualCue: "A clenched hand relaxes beside an unused bow as the fire burns low.", characterIds: ["rama", "lakshmana"] },
      { id: "lakshmana-answers-belonging", title: { en: "Lakshmana answers with belonging", hi: "लक्ष्मण साथ होने का उत्तर देते हैं" }, narration: { en: "Lakshmana tells Rama that neither he nor Sita can live apart from him. His answer does not solve Ayodhya; it makes companionship present in this forest.", hi: "लक्ष्मण कहते हैं कि न वे, न सीता राम से अलग रह सकते हैं। उनका उत्तर अयोध्या की समस्या नहीं सुलझाता; वह इस वन में साथ को उपस्थित करता है।" }, visualCue: "Lakshmana sits beside Rama while Sita's resting place remains protected behind them.", characterIds: ["lakshmana", "rama", "sita"] },
      { id: "leaves-become-a-bed", title: { en: "Leaves become the first bed", hi: "पत्ते पहली शय्या बनते हैं" }, narration: { en: "The conversation ends in practical care. A bed of leaves is spread, the night is endured, and the three remain together in a place no palace plan prepared them to inhabit.", hi: "संवाद व्यावहारिक देखभाल में समाप्त होता है। पत्तों की शय्या बिछती है, रात काटी जाती है और तीनों ऐसे स्थान में साथ रहते हैं जिसके लिए किसी महल-योजना ने उन्हें तैयार नहीं किया था।" }, visualCue: "A small leaf bed glows beneath the tree while the forest opens into deep layers beyond.", characterIds: ["rama", "sita", "lakshmana"] },
    ],
  },
  "prayaga-to-yamuna": {
    id: "prayaga-to-yamuna",
    decisiveChange: { en: "Guidance turns an unknown forest into a chosen road toward Chitrakoot.", hi: "मार्गदर्शन अनजान वन को चित्रकूट की चुनी हुई राह में बदल देता है।" },
    beats: [
      { id: "smoke-above-confluence", title: { en: "Smoke rises above two rivers", hi: "दो नदियों के ऊपर धुआँ उठता है" }, narration: { en: "Near evening, Rama sees smoke and hears the meeting waters of Ganga and Yamuna. Signs of human practice reveal Bharadvaja's hermitage before the travellers reach it.", hi: "साँझ के पास राम धुआँ देखते और गंगा-यमुना के मिलते जल की ध्वनि सुनते हैं। मानवीय साधना के संकेत यात्रियों के पहुँचने से पहले भरद्वाज के आश्रम का पता देते हैं।" }, visualCue: "Two rivers converge beneath evening mist while a thread of smoke rises from the forest.", characterIds: ["rama", "sita", "lakshmana", "bharadvaja"] },
      { id: "bharadvaja-receives-travellers", title: { en: "Bharadvaja receives the travellers", hi: "भरद्वाज यात्रियों का स्वागत करते हैं" }, narration: { en: "The three introduce themselves and explain the exile. Bharadvaja offers water, food from the forest, a place to rest, and the possibility of staying at the confluence.", hi: "तीनों अपना परिचय और वनवास बताते हैं। भरद्वाज जल, वन का भोजन, विश्राम-स्थान और संगम पर रहने की संभावना देते हैं।" }, visualCue: "The travellers sit within a riverside hermitage as disciples and animals settle around them.", characterIds: ["bharadvaja", "rama", "sita", "lakshmana"] },
      { id: "rama-chooses-deeper-solitude", title: { en: "Rama asks for a more distant home", hi: "राम अधिक दूर घर माँगते हैं" }, narration: { en: "Rama worries that people from the city will keep coming if he stays nearby. He asks for a place where Sita can live well without making the hermitage a public court.", hi: "राम सोचते हैं कि पास रहने पर नगर के लोग आते रहेंगे। वे ऐसी जगह पूछते हैं जहाँ सीता ठीक रह सकें और आश्रम सार्वजनिक दरबार न बन जाए।" }, visualCue: "Rama and Bharadvaja study the distant mountain line beyond the confluence.", characterIds: ["rama", "sita", "bharadvaja"] },
      { id: "chitrakoot-road-is-drawn", title: { en: "The road to Chitrakoot is drawn", hi: "चित्रकूट की राह खींची जाती है" }, narration: { en: "Bharadvaja describes the mountain, its fruit, water, animals, ascetics, and paths. The next destination becomes a lived landscape rather than an abstract name.", hi: "भरद्वाज पर्वत, फल, जल, पशु, तपस्वी और मार्गों का वर्णन करते हैं। अगला पड़ाव अमूर्त नाम के बजाय रहने योग्य भू-दृश्य बन जाता है।" }, visualCue: "A hand-drawn path of river, tree, and mountain seems to rise from Bharadvaja's gesture.", characterIds: ["bharadvaja", "rama", "sita", "lakshmana"] },
      { id: "raft-crosses-yamuna", title: { en: "A raft crosses the Yamuna", hi: "बेड़ा यमुना पार करता है" }, narration: { en: "The brothers build a raft and a seat for Sita. Midstream she voices another hope of return; beyond the bank, flowers, the Syama tree, birds, and new questions make the road active.", hi: "भाई बेड़ा और सीता के लिए आसन बनाते हैं। मध्यधारा में वे फिर वापसी की आशा कहती हैं; दूसरे तट पर फूल, श्यामा-वृक्ष, पक्षी और नए प्रश्न राह को जीवित रखते हैं।" }, visualCue: "A hand-built raft moves through copper water toward a flowering forest and a vast green tree.", characterIds: ["rama", "sita", "lakshmana"] },
    ],
  },
  "chitrakoot-home": {
    id: "chitrakoot-home",
    decisiveChange: { en: "The road pauses because the travellers make—not merely find—a home.", hi: "राह इसलिए ठहरती है क्योंकि यात्री घर केवल पाते नहीं, बनाते हैं।" },
    beats: [
      { id: "birds-call-them-forward", title: { en: "Birdsong begins the final walk", hi: "पक्षियों का स्वर अंतिम चाल शुरू करता है" }, narration: { en: "Rama wakes Lakshmana to the forest's bird calls. Flowering trees, fruit, honeycombs, peacocks, and elephants make the approach to Chitrakoot feel inhabited before any cottage exists.", hi: "राम वन-पक्षियों के स्वर पर लक्ष्मण को जगाते हैं। फूलते वृक्ष, फल, मधुकोष, मोर और हाथी किसी कुटिया से पहले ही चित्रकूट को जीवित बना देते हैं।" }, visualCue: "Morning birds sweep through flowering forest as the travellers climb toward distant peaks.", characterIds: ["rama", "sita", "lakshmana"] },
      { id: "mountain-becomes-place", title: { en: "The mountain becomes a place to stay", hi: "पर्वत रहने की जगह बनता है" }, narration: { en: "At Chitrakoot, water, roots, fruit, birds, and ascetic communities make subsistence imaginable. Rama says plainly: let this be our abode.", hi: "चित्रकूट में जल, कंद, फल, पक्षी और तपस्वी समुदाय जीवन को संभव बनाते हैं। राम स्पष्ट कहते हैं—यही हमारा निवास हो।" }, visualCue: "The three stand before layered green peaks cut by streams and lit by morning sun.", characterIds: ["rama", "sita", "lakshmana"] },
      { id: "valmiki-welcomes-them", title: { en: "A hermitage receives them", hi: "एक आश्रम उन्हें स्वीकारता है" }, narration: { en: "The travellers greet Valmiki at his hermitage and explain the road that has brought them there. He receives the three before they continue toward Chitrakoot, giving the unfamiliar forest journey another human point of welcome.", hi: "यात्री वाल्मीकि के आश्रम में प्रणाम करके वह राह बताते हैं जो उन्हें यहाँ तक लाई। वे चित्रकूट की ओर बढ़ने से पहले तीनों का स्वागत करते हैं, जिससे अनजान वन-यात्रा में एक और मानवीय ठहराव खुलता है।" }, visualCue: "A forest sage welcomes the three at the edge of a modest hermitage.", characterIds: ["rama", "sita", "lakshmana"] },
      { id: "lakshmana-builds-cottage", title: { en: "Lakshmana builds the cottage", hi: "लक्ष्मण कुटिया बनाते हैं" }, narration: { en: "Rama chooses the site and Lakshmana gathers strong wood, raises walls and doors, and thatches the roof with leaves. The first forest home appears through work.", hi: "राम स्थान चुनते हैं और लक्ष्मण मजबूत लकड़ी जुटाकर दीवारें और द्वार खड़े करते, पत्तों की छत डालते हैं। पहला वन-घर श्रम से सामने आता है।" }, visualCue: "Timber frames rise in stages while Sita organizes the small clearing and Rama brings materials.", characterIds: ["lakshmana", "rama", "sita"] },
      { id: "three-enter-their-home", title: { en: "The three enter their home", hi: "तीनों अपने घर में प्रवेश करते हैं" }, narration: { en: "The source describes household rites before entry; Devam presents them as narrative evidence, not current user instruction. When the three enter, the text allows city-grief to loosen for the first time.", hi: "स्रोत प्रवेश से पहले गृह-क्रम बताता है; देवम् उसे कथा-साक्ष्य के रूप में रखता है, आज के उपयोगकर्ता के निर्देश की तरह नहीं। तीनों के भीतर आते ही नगर-वियोग पहली बार कुछ ढीला पड़ता है।" }, visualCue: "Warm lamplight fills the finished leaf cottage as the forest night gathers outside.", characterIds: ["rama", "sita", "lakshmana"] },
    ],
  },
};

export const RAMAYANA_FIRST_RIVERS_DISTRICT: StoryDistrict = {
  id: "first-rivers-v1",
  title: { en: "Across the first rivers", hi: "पहली नदियों के पार" },
  invitation: { en: "Follow the city to the Tamasa, keep watch with Guha, cross the Ganga and Yamuna, and make a first home at Chitrakoot.", hi: "नगर के साथ तमसा तक चलें, गुह के साथ पहरा दें, गंगा-यमुना पार करें और चित्रकूट में पहला घर बनते देखें।" },
  entryMomentId: "city-follows-car",
  momentIds: ["city-follows-car", "tamasa-night", "roads-beyond-kosala", "guha-night-watch", "ganga-crossing", "first-forest-night", "prayaga-to-yamuna", "chitrakoot-home"],
  compassTurnIds: ["road-out-of-ayodhya"],
};
