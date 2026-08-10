import type {
  StoryDistrict,
  StoryMoment,
  StoryWorldNode,
  StoryWorldRoute,
} from "@/lib/domain/story-world";

const SOURCE_REF = "sha256:7d3b9e1613d60dfacea39f2564243e943cf38703eadb7245d92337b238082034";

export const RAMAYANA_EMPTY_THRONE_SCENE_NODE_IDS: Record<string, string[]> = {
  "empty-chariot-return": ["empty-chariot-return-event", "silent-ayodhya-story-world", "sumantra", "king-dasharatha", "kausalya", "rama", "sita", "lakshmana"],
  "palace-grief-dialogue": ["palace-grief-dialogue-event", "gloomy-king-chamber", "kausalya", "king-dasharatha", "sumantra", "sumitra"],
  "river-sound-confession": ["river-sound-confession-event", "sarayu-memory-story-world", "king-dasharatha", "kausalya"],
  "city-without-king": ["city-without-king-event", "suspended-palace-story-world", "kausalya", "kaikeyi", "vasishta"],
  "bharata-urgent-return": ["bharata-urgent-return-event", "kekaya-road-story-world", "bharata", "shatrughna", "vasishta"],
  "bharata-rejects-boons": ["bharata-rejects-boons-event", "kaikeyi-revelation-chamber", "bharata", "kaikeyi", "rama"],
  "funeral-and-trust": ["funeral-and-trust-event", "sarayu-funeral-bank-story-world", "bharata", "shatrughna", "kausalya", "vasishta"],
  "crown-refused-road": ["crown-refused-road-event", "road-to-rama-story-world", "bharata", "shatrughna", "manthara", "vasishta", "sumantra"],
};

export const RAMAYANA_EMPTY_THRONE_CAST_NODE_IDS: Record<string, string> = {
  Sumitra: "sumitra",
};

const eventNodes: StoryWorldNode[] = [
  ["empty-chariot-return-event", "The empty chariot returns", "Sumantra returns through a silent Ayodhya and must tell the palace what happened after the Ganga crossing."],
  ["palace-grief-dialogue-event", "Grief speaks inside the palace", "Kausalya, Sumantra, and Dasharatha confront what exile has done to the family during the fifth night."],
  ["river-sound-confession-event", "The sound by the river returns", "Dasharatha recounts the fatal mistake of his youth and understands an old curse through his present loss."],
  ["city-without-king-event", "Ayodhya wakes without a king", "Morning ceremony becomes discovery, mourning, suspended funeral rites, and an urgent council over an empty throne."],
  ["bharata-urgent-return-event", "Bharata races toward the silence", "A dark dream, guarded messengers, and a seven-night journey bring Bharata into an Ayodhya he no longer recognizes."],
  ["bharata-rejects-boons-event", "Bharata rejects the promised kingdom", "Kaikeyi reveals the death, exile, and boons as good news; Bharata refuses the result and vows to bring Rama home."],
  ["funeral-and-trust-event", "Mourning becomes trust", "Kausalya tests Bharata's innocence, the family performs Dasharatha's last rites, and the brothers face the ashes together."],
  ["crown-refused-road-event", "The crown is refused and the road opens", "Bharata stops vengeance, refuses installation, and turns the machinery of kingship toward finding Rama."],
].map(([id, label, summary]) => ({
  id,
  label,
  kind: "Story event",
  family: "event_story",
  summary,
  searchQuery: `${label} Ramayana Ayodhya Kanda`,
  evidenceBoundary: "This event is a Devam retelling bounded to Ayodhyā Kāṇḍa sections LVII–LXXXII in the selected Manmatha Nath Dutt Project Gutenberg electronic edition. It is not every Ramayana telling, historical reconstruction, ethical verdict, or modern geographic claim.",
}));

const placeAndCharacterNodes: StoryWorldNode[] = [
  {
    id: "sumitra",
    label: "Sumitra",
    kind: "Narrative queen",
    family: "being_person",
    summary: "Meet Sumitra within the grieving royal household as exile and Dasharatha's death reshape every relationship in the palace.",
    searchQuery: "Sumitra Ramayana Ayodhya Kanda Dasharatha death",
    evidenceBoundary: "This character doorway follows one selected English edition and is not a complete Sumitra biography, theology, or every Ramayana tradition.",
  },
  {
    id: "silent-ayodhya-story-world",
    label: "The silent city",
    kind: "Narrative city state",
    family: "place_polity",
    summary: "Enter Ayodhya with Sumantra as crowds run toward a chariot that has returned without Rama, Sita, or Lakshmana.",
    searchQuery: "Sumantra empty chariot returns Ayodhya Ramayana",
    evidenceBoundary: "This is Ayodhya as narrative atmosphere in the selected edition, not an archaeological reconstruction or a claim about a present-day city.",
  },
  {
    id: "gloomy-king-chamber",
    label: "The darkened royal chamber",
    kind: "Narrative interior",
    family: "place_polity",
    summary: "Stay inside the chamber where Sumantra's report, Kausalya's anguish, and Dasharatha's remorse collide.",
    searchQuery: "Dasharatha Kausalya Sumantra Ayodhya Kanda LVIII LXII",
    evidenceBoundary: "This is an edition-scoped story interior, not a recoverable architectural plan or historical palace claim.",
  },
  {
    id: "sarayu-memory-story-world",
    label: "The Sarayu of an old memory",
    kind: "Remembered narrative place",
    family: "place_polity",
    summary: "Enter the rainy riverbank remembered by Dasharatha, where an unseen sound and one arrow changed two families.",
    searchQuery: "Dasharatha sound arrow ascetic youth Sarayu Ramayana",
    evidenceBoundary: "This is a remembered narrative setting in the selected edition. It does not identify a modern coordinate or adjudicate historical fact.",
  },
  {
    id: "suspended-palace-story-world",
    label: "The palace between death and succession",
    kind: "Narrative civic place",
    family: "place_polity",
    summary: "Move from the unawakened king to a city that cannot complete funeral rites or install a successor until Bharata returns.",
    searchQuery: "Dasharatha death body oil vessel Bharata summoned Ramayana",
    evidenceBoundary: "This is a source-story account of royal mourning and succession, not modern funerary or constitutional guidance.",
  },
  {
    id: "kekaya-road-story-world",
    label: "The urgent road from Kekaya",
    kind: "Narrative route",
    family: "place_polity",
    summary: "Follow guarded messengers, Bharata's troubled dream, and the long return into a city whose silence reveals the news first.",
    searchQuery: "Bharata dream return Kekaya Ayodhya Kanda",
    evidenceBoundary: "This route follows narrative geography in the selected edition and does not assert a recoverable modern itinerary.",
  },
  {
    id: "kaikeyi-revelation-chamber",
    label: "Kaikeyi's room after the boons",
    kind: "Narrative interior",
    family: "place_polity",
    summary: "Enter the room where Kaikeyi expects gratitude and Bharata hears the combined cost of the two promises.",
    searchQuery: "Kaikeyi tells Bharata Dasharatha death Rama exile",
    evidenceBoundary: "This scene preserves one edition's sequence without flattening Kaikeyi or Bharata into a universal moral label.",
  },
  {
    id: "sarayu-funeral-bank-story-world",
    label: "The funeral bank of the Sarayu",
    kind: "Narrative mourning place",
    family: "place_polity",
    summary: "Follow the royal household from the preserved body to the pyre, water rites, mourning days, and the gathering of ashes.",
    searchQuery: "Dasharatha funeral Sarayu Bharata Ayodhya Kanda",
    evidenceBoundary: "These are source-story funeral actions, not instructions for present-day rites, caste rules, family practice, or priestly authority.",
  },
  {
    id: "road-to-rama-story-world",
    label: "The road prepared for Rama",
    kind: "Narrative route",
    family: "place_polity",
    summary: "See the proposed coronation redirected into a public expedition to find Rama and ask him to return.",
    searchQuery: "Bharata refuses crown road builders bring Rama back",
    evidenceBoundary: "This is a narrative expedition in the selected edition, not a modern route, environmental recommendation, or royal-protocol guide.",
  },
];

export const RAMAYANA_EMPTY_THRONE_LOCAL_NODES: Record<string, StoryWorldNode> = Object.fromEntries(
  [...eventNodes, ...placeAndCharacterNodes].map((node) => [node.id, node]),
);

const route = (id: string, relation: string, relationKind: StoryWorldRoute["relationKind"], destinationId: string): StoryWorldRoute => ({
  id,
  relation,
  relationKind,
  destinationId,
  sourceRef: SOURCE_REF,
});

export const RAMAYANA_EMPTY_THRONE_LOCAL_ROUTES: Record<string, StoryWorldRoute[]> = Object.fromEntries(
  Object.entries(RAMAYANA_EMPTY_THRONE_SCENE_NODE_IDS).map(([, nodeIds]) => {
    const [eventId, placeId, ...characterIds] = nodeIds;
    return [eventId, [
      route(`${eventId}-to-${placeId}`, "unfolds at", "place", placeId),
      ...characterIds.slice(0, 6).map((nodeId) => route(`${eventId}-to-${nodeId}`, "changes the path of", "story", nodeId)),
    ] satisfies StoryWorldRoute[]];
  }),
);

RAMAYANA_EMPTY_THRONE_LOCAL_ROUTES["silent-ayodhya-story-world"] = [route("silent-ayodhya-to-sumantra", "is entered with", "story", "sumantra"), route("silent-ayodhya-to-ayodhya", "is a changed state of", "place", "ayodhya")];
RAMAYANA_EMPTY_THRONE_LOCAL_ROUTES["gloomy-king-chamber"] = [route("gloomy-chamber-to-dasharatha", "holds the final nights of", "story", "king-dasharatha"), route("gloomy-chamber-to-kausalya", "holds the grief of", "story", "kausalya")];
RAMAYANA_EMPTY_THRONE_LOCAL_ROUTES["sarayu-memory-story-world"] = [route("sarayu-memory-to-dasharatha", "is remembered by", "story", "king-dasharatha")];
RAMAYANA_EMPTY_THRONE_LOCAL_ROUTES["suspended-palace-story-world"] = [route("suspended-palace-to-vasishta", "is steadied by", "association", "vasishta"), route("suspended-palace-to-bharata", "awaits the return of", "story", "bharata")];
RAMAYANA_EMPTY_THRONE_LOCAL_ROUTES["kekaya-road-story-world"] = [route("kekaya-road-to-bharata", "carries", "story", "bharata"), route("kekaya-road-to-ayodhya", "returns to", "place", "ayodhya")];
RAMAYANA_EMPTY_THRONE_LOCAL_ROUTES["kaikeyi-revelation-chamber"] = [route("revelation-chamber-to-kaikeyi", "holds the disclosure by", "story", "kaikeyi"), route("revelation-chamber-to-bharata", "changes the purpose of", "story", "bharata")];
RAMAYANA_EMPTY_THRONE_LOCAL_ROUTES["sarayu-funeral-bank-story-world"] = [route("funeral-bank-to-bharata", "holds the mourning of", "story", "bharata"), route("funeral-bank-to-sarayu-memory", "returns the story to", "place", "sarayu-memory-story-world")];
RAMAYANA_EMPTY_THRONE_LOCAL_ROUTES["road-to-rama-story-world"] = [route("road-to-rama-to-bharata", "is ordered by", "story", "bharata"), route("road-to-rama-to-chitrakoot", "points toward", "place", "chitrakoot")];

export const RAMAYANA_EMPTY_THRONE_MOMENTS: Record<string, StoryMoment> = {
  "empty-chariot-return": {
    id: "empty-chariot-return",
    decisiveChange: { en: "The chariot returns, but the people it carried do not.", hi: "रथ लौटता है, पर जिन्हें वह ले गया था वे नहीं लौटते।" },
    beats: [
      { id: "sumantra-turns-home", title: { en: "Sumantra finally turns home", hi: "सुमंत्र अंततः घर की ओर मुड़ते हैं" }, narration: { en: "After learning that Rama, Sita, and Lakshmana have reached Bharadvaja and are bound for Chitrakoot, Sumantra leaves Guha. The car that carried the exile out now bears only its witness back.", hi: "राम, सीता और लक्ष्मण के भरद्वाज तक पहुँचने और चित्रकूट जाने का समाचार पाकर सुमंत्र गुह से विदा लेते हैं। जो रथ वनवास को बाहर ले गया था, अब केवल उसके साक्षी को वापस ला रहा है।" }, visualCue: "A lone charioteer turns an empty royal car toward a dark horizon while the river recedes behind him.", characterIds: ["sumantra", "rama", "sita", "lakshmana"] },
      { id: "crowds-find-empty-car", title: { en: "The city runs toward an absence", hi: "नगर एक अनुपस्थिति की ओर दौड़ता है" }, narration: { en: "At dusk, Ayodhya looks still and joyless. Hundreds surround the returning car and ask where Rama is; the answer that he crossed the Ganga moves through streets and palace windows as a fresh wave of grief.", hi: "साँझ में अयोध्या स्थिर और उदास दिखती है। सैकड़ों लोग लौटे रथ को घेरकर राम का पता पूछते हैं; गंगा पार करने का उत्तर गलियों और महल की खिड़कियों में शोक की नई लहर बन जाता है।" }, visualCue: "Citizens flood a dim avenue around an unmistakably empty chariot.", characterIds: ["sumantra", "rama"] },
      { id: "dasharatha-asks-every-detail", title: { en: "Dasharatha asks how they live", hi: "दशरथ पूछते हैं वे कैसे जी रहे हैं" }, narration: { en: "Revived from a faint, Dasharatha asks what the three eat, where they sleep, how Sita walks, and what each person said. The questions are not court business; they are a father trying to rebuild the vanished road in his mind.", hi: "मूर्छा से लौटकर दशरथ पूछते हैं कि तीनों क्या खाते हैं, कहाँ सोते हैं, सीता कैसे चलती हैं और किसने क्या कहा। ये राजकाज के प्रश्न नहीं—एक पिता अपने मन में खोई राह फिर से बना रहा है।" }, visualCue: "The dusty charioteer kneels before an ageing king in a nearly unlit chamber.", characterIds: ["king-dasharatha", "sumantra", "rama", "sita", "lakshmana"] },
      { id: "messages-fill-chamber", title: { en: "Three voices return through one witness", hi: "एक साक्षी से तीन स्वर लौटते हैं" }, narration: { en: "Sumantra carries Rama's respectful messages to parents and Bharata, Lakshmana's anger at the exile, and Sita's wordless tears beside the departing car. The people are absent, but their distinct responses fill the chamber.", hi: "सुमंत्र माता-पिता और भरत के लिए राम के सम्मानपूर्ण संदेश, वनवास पर लक्ष्मण का क्रोध और जाते रथ के पास सीता के मौन आँसू सुनाते हैं। लोग उपस्थित नहीं, पर उनकी अलग-अलग प्रतिक्रियाएँ कक्ष भर देती हैं।" }, visualCue: "Three translucent memory tableaux—calm, anger, and grief—surround Sumantra's testimony.", characterIds: ["sumantra", "rama", "sita", "lakshmana", "king-dasharatha"] },
      { id: "horses-and-city-grieve", title: { en: "Even the road returned reluctantly", hi: "राह भी अनिच्छा से लौटी" }, narration: { en: "Sumantra remembers the horses slowing and shedding tears when he turned away. He describes a kingdom whose streets, gardens, animals, and people all appear altered by the same absence; Dasharatha begs to be taken after the car again.", hi: "सुमंत्र याद करते हैं कि लौटते समय घोड़े धीमे पड़े और आँसू बहाते रहे। वे बताते हैं कि गलियाँ, उद्यान, पशु और लोग—पूरा राज्य उसी अनुपस्थिति से बदला दिखता है; दशरथ फिर रथ के पीछे ले चलने की विनती करते हैं।" }, visualCue: "Tired horses lower their heads in a deserted courtyard while the king reaches toward the reins.", characterIds: ["sumantra", "king-dasharatha", "rama"] },
    ],
  },
  "palace-grief-dialogue": {
    id: "palace-grief-dialogue",
    decisiveChange: { en: "The palace stops hiding the human cost of the command.", hi: "महल अब आदेश की मानवीय कीमत छिपा नहीं पाता।" },
    beats: [
      { id: "kausalya-asks-for-car", title: { en: "Kausalya asks to be taken to them", hi: "कौसल्या उनके पास ले चलने को कहती हैं" }, narration: { en: "Kausalya asks Sumantra to turn the car toward the forest because life without the three feels impossible. Her demand is grief speaking before counsel can make the situation orderly.", hi: "कौसल्या सुमंत्र से रथ वन की ओर मोड़ने को कहती हैं, क्योंकि तीनों के बिना जीवन असंभव लगता है। व्यवस्था समझाने से पहले उनका शोक बोलता है।" }, visualCue: "Kausalya grips the empty chariot rail as attendants hesitate at the palace threshold.", characterIds: ["kausalya", "sumantra", "rama", "sita", "lakshmana"] },
      { id: "sumantra-describes-road", title: { en: "Sumantra offers what reassurance he can", hi: "सुमंत्र जितना हो सके उतना आश्वासन देते हैं" }, narration: { en: "He says Lakshmana serves them attentively and Sita keeps asking about rivers, villages, trees, and the changing landscape. The report does not erase hardship; it gives Kausalya evidence that the travellers are still acting, noticing, and caring for one another.", hi: "वे बताते हैं कि लक्ष्मण सावधानी से सेवा कर रहे हैं और सीता नदियों, गाँवों, वृक्षों और बदलते भू-दृश्य के बारे में पूछती चल रही हैं। यह कठिनाई नहीं मिटाता; बस बताता है कि तीनों अभी भी सक्रिय हैं, देख रहे हैं और एक-दूसरे का ध्यान रख रहे हैं।" }, visualCue: "A forest memory grows beyond the chamber: Sita points toward a river while the brothers answer.", characterIds: ["sumantra", "sita", "rama", "lakshmana", "kausalya"] },
      { id: "kausalya-confronts-king", title: { en: "Kausalya names what was destroyed", hi: "कौसल्या बताती हैं क्या-क्या टूट गया" }, narration: { en: "Kausalya asks how a gentle son, a young daughter-in-law, and Lakshmana can bear the forest after palace life. Her speech widens from family pain to a ruined city and a kingdom whose future has been damaged by its own king.", hi: "कौसल्या पूछती हैं कि महल के जीवन के बाद कोमल पुत्र, युवा पुत्रवधू और लक्ष्मण वन कैसे सहेंगे। उनका कथन परिवार के दर्द से फैलकर टूटे नगर और अपने ही राजा से घायल भविष्य तक पहुँचता है।" }, visualCue: "Kausalya stands between the collapsed king and abandoned coronation objects.", characterIds: ["kausalya", "king-dasharatha", "rama", "sita", "lakshmana"] },
      { id: "dasharatha-asks-forgiveness", title: { en: "The king asks his grieving wife for mercy", hi: "राजा शोकाकुल पत्नी से क्षमा माँगते हैं" }, narration: { en: "Dasharatha joins his hands and asks Kausalya not to strike him with further words while he is already broken. She immediately recognizes the pain her speech added and bows, without pretending the original wrong has vanished.", hi: "दशरथ हाथ जोड़कर कौसल्या से कहते हैं कि वे पहले ही टूट चुके हैं, इसलिए शब्दों से और न घायल करें। कौसल्या तुरंत अपने शब्दों की चोट पहचानकर झुकती हैं, पर मूल अन्याय को मिटा हुआ नहीं मानतीं।" }, visualCue: "Two exhausted elders lower themselves toward each other on the chamber floor.", characterIds: ["king-dasharatha", "kausalya"] },
      { id: "fifth-night-stretches", title: { en: "Five nights feel like five years", hi: "पाँच रातें पाँच वर्ष लगती हैं" }, narration: { en: "Kausalya says sorrow destroys patience and knowledge, and that the five nights since Rama left have stretched into years. Evening closes around a temporary reconciliation, but Dasharatha's older memory has already begun to rise.", hi: "कौसल्या कहती हैं कि शोक धैर्य और ज्ञान दोनों नष्ट करता है, और राम के जाने की पाँच रातें वर्षों जैसी हो गई हैं। अस्थायी मेल के चारों ओर रात उतरती है, पर दशरथ की पुरानी स्मृति जाग चुकी है।" }, visualCue: "Five fading lamps lengthen their shadows across the reconciled but sleepless chamber.", characterIds: ["kausalya", "king-dasharatha"] },
    ],
  },
  "river-sound-confession": {
    id: "river-sound-confession",
    decisiveChange: { en: "Dasharatha understands the present through an old, irreversible mistake.", hi: "दशरथ वर्तमान को अपनी पुरानी, अपरिवर्तनीय भूल से समझते हैं।" },
    beats: [
      { id: "sixth-night-memory", title: { en: "On the sixth night, another loss returns", hi: "छठी रात एक और हानि लौटती है" }, narration: { en: "Dasharatha wakes at midnight and tells Kausalya that actions ripen into consequences. Rama's exile has brought back a deed from his youth that he had never escaped.", hi: "आधी रात दशरथ जागकर कौसल्या से कहते हैं कि कर्म परिणाम बनकर लौटते हैं। राम का वनवास उनकी युवावस्था की उस घटना को वापस ले आया है जिससे वे कभी मुक्त नहीं हुए।" }, visualCue: "The dark chamber dissolves into a rain-filled riverbank from decades earlier.", characterIds: ["king-dasharatha", "kausalya"] },
      { id: "rain-and-unseen-sound", title: { en: "A hunter aims at a sound", hi: "शिकारी एक ध्वनि पर निशाना लगाता है" }, narration: { en: "As a young prince in the rainy season, Dasharatha waits beside the Sarayu and hears what he believes is an animal filling the night with water sounds. Confident in shooting by sound, he releases an arrow without seeing the target.", hi: "वर्षा ऋतु में युवा राजकुमार दशरथ सरयू तट पर प्रतीक्षा करते हैं और जल भरने की ध्वनि को पशु समझते हैं। ध्वनि से निशाना लगाने के कौशल पर भरोसा कर वे लक्ष्य देखे बिना बाण छोड़ देते हैं।" }, visualCue: "Rain veils the river as a drawn bow points toward ripples and an unseen clay pitcher.", characterIds: ["king-dasharatha"] },
      { id: "human-cry-answers", title: { en: "A human voice answers the arrow", hi: "बाण का उत्तर मानव स्वर देता है" }, narration: { en: "The cry from the water is an ascetic youth gathering water for his blind parents. Mortally wounded, he worries less about himself than about the two people waiting for him and directs Dasharatha to their hermitage.", hi: "जल से उठी पुकार अपने दृष्टिहीन माता-पिता के लिए पानी भरते एक तपस्वी युवक की है। मृत्यु के निकट वह अपने से अधिक प्रतीक्षा करते माता-पिता की चिंता करता है और दशरथ को उनके आश्रम का मार्ग बताता है।" }, visualCue: "A fallen water jar, the wounded youth, and the shocked prince emerge from the rain.", characterIds: ["king-dasharatha"] },
      { id: "parents-hear-footsteps", title: { en: "The parents hear the wrong footsteps", hi: "माता-पिता गलत पदचाप सुनते हैं" }, narration: { en: "The blind parents welcome approaching steps as their son's return. Dasharatha must identify himself, confess the error, lead them to the body, and stand inside grief he caused but cannot repair.", hi: "दृष्टिहीन माता-पिता आती पदचाप को पुत्र की वापसी समझते हैं। दशरथ को अपना परिचय देना, भूल स्वीकारना, उन्हें शव तक ले जाना और उस शोक के भीतर खड़ा होना पड़ता है जिसे वे सुधार नहीं सकते।" }, visualCue: "Two elderly figures reach hopefully toward a young prince carrying a water vessel in both hands.", characterIds: ["king-dasharatha"] },
      { id: "curse-reaches-present", title: { en: "The old words reach the present night", hi: "पुराने शब्द वर्तमान रात तक पहुँचते हैं" }, narration: { en: "The father says Dasharatha too will die from grief for a son. Remembering the curse, the old king feels his senses dim, calls for Rama, names the family around him, and dies before the night is half gone.", hi: "पिता कहते हैं कि दशरथ भी पुत्र-वियोग में प्राण देंगे। श्राप याद आते ही वृद्ध राजा की इंद्रियाँ मंद पड़ती हैं; वे राम और परिवार को पुकारते हैं और आधी रात बीतने से पहले प्राण छोड़ देते हैं।" }, visualCue: "The remembered parents fade into Kausalya and Sumitra beside Dasharatha's extinguishing lamp.", characterIds: ["king-dasharatha", "kausalya", "sumitra", "rama"] },
    ],
  },
  "city-without-king": {
    id: "city-without-king",
    decisiveChange: { en: "A private death becomes a civic emergency and a suspended farewell.", hi: "निजी मृत्यु नगर का संकट और रुकी हुई विदाई बन जाती है।" },
    beats: [
      { id: "morning-music-arrives", title: { en: "Morning performs the old routine", hi: "सुबह पुरानी दिनचर्या निभाती है" }, narration: { en: "Bards, singers, attendants, sacred water, mirrors, garments, and royal service arrive as usual. The sun rises while everyone waits for a king who will not wake.", hi: "गायक, वंशवाचक, सेवक, पवित्र जल, दर्पण, वस्त्र और राजसेवा हमेशा की तरह पहुँचते हैं। सूर्य उगता है, पर सब उस राजा की प्रतीक्षा करते हैं जो अब नहीं जागेगा।" }, visualCue: "Bright ceremonial objects wait outside a sealed chamber while morning light advances.", characterIds: ["king-dasharatha"] },
      { id: "stillness-is-discovered", title: { en: "Touch confirms the stillness", hi: "स्पर्श स्थिरता की पुष्टि करता है" }, narration: { en: "The women beside Dasharatha finally feel that his pulse no longer moves. Their cries wake Kausalya and Sumitra, and the palace understands all at once what happened during the night.", hi: "दशरथ के पास बैठी स्त्रियाँ अंततः पाती हैं कि उनकी नाड़ी नहीं चल रही। उनके विलाप से कौसल्या और सुमित्रा जागती हैं, और महल एक साथ रात की घटना समझ लेता है।" }, visualCue: "Hands hover over the still king as the chamber erupts from silence into motion.", characterIds: ["king-dasharatha", "kausalya", "sumitra"] },
      { id: "queens-and-city-wail", title: { en: "The lament leaves the room", hi: "विलाप कक्ष से बाहर फैलता है" }, narration: { en: "Kausalya holds Dasharatha's head and addresses Kaikeyi; the other queens gather, and grief fills halls, terraces, and streets already wounded by Rama's absence.", hi: "कौसल्या दशरथ का सिर गोद में लेकर कैकेयी से बोलती हैं; अन्य रानियाँ जुटती हैं और राम की अनुपस्थिति से पहले ही घायल सभागार, छतें और गलियाँ शोक से भर जाती हैं।" }, visualCue: "Concentric waves of mourners spread from the royal bed through palace balconies and city streets.", characterIds: ["kausalya", "kaikeyi", "king-dasharatha", "rama"] },
      { id: "farewell-must-wait", title: { en: "The funeral cannot yet begin", hi: "अंत्येष्टि अभी शुरू नहीं हो सकती" }, narration: { en: "With the sons absent, the counsellors do not perform the final rites. Dasharatha's body is placed in oil and the palace enters an unnatural pause between death and succession.", hi: "पुत्रों की अनुपस्थिति में मंत्री अंतिम संस्कार नहीं करते। दशरथ का शरीर तेल में सुरक्षित रखा जाता है और महल मृत्यु तथा उत्तराधिकार के बीच अस्वाभाविक ठहराव में चला जाता है।" }, visualCue: "A guarded, lamp-lit chamber holds the king in solemn suspension while doors remain closed.", characterIds: ["king-dasharatha", "vasishta"] },
      { id: "council-faces-empty-throne", title: { en: "The council faces a kingdom without a centre", hi: "सभा केंद्रहीन राज्य का सामना करती है" }, narration: { en: "At dawn, Vasishta and the counsellors describe the practical danger of a kingless realm—roads, trade, protection, fields, gatherings, and public trust can all unravel. The empty throne is now more than a symbol.", hi: "भोर में वसिष्ठ और मंत्री राजाविहीन राज्य के व्यावहारिक संकट बताते हैं—मार्ग, व्यापार, सुरक्षा, खेत, सभाएँ और सार्वजनिक भरोसा सब बिखर सकते हैं। खाली सिंहासन अब केवल प्रतीक नहीं रहा।" }, visualCue: "An empty throne sits at the centre of a council whose maps and petitions accumulate around it.", characterIds: ["vasishta"] },
      { id: "messengers-carry-silence", title: { en: "Messengers leave with guarded words", hi: "दूत सँभले हुए शब्द लेकर निकलते हैं" }, narration: { en: "Vasishta sends fast riders to Kekaya to bring Bharata and Shatrughna. They are ordered not to mention Dasharatha's death or Rama's exile; urgency must travel without its reason.", hi: "वसिष्ठ तेज घुड़सवारों को भरत और शत्रुघ्न को लाने के लिए केकय भेजते हैं। उन्हें दशरथ की मृत्यु और राम के वनवास का उल्लेख न करने का आदेश है; कारण के बिना ही तात्कालिकता यात्रा करती है।" }, visualCue: "Four riders leave the sleeping city before dawn carrying sealed gifts and unspoken news.", characterIds: ["vasishta", "bharata", "shatrughna"] },
    ],
  },
  "bharata-urgent-return": {
    id: "bharata-urgent-return",
    decisiveChange: { en: "Before anyone tells Bharata, the world around him begins to reveal the loss.", hi: "किसी के बताने से पहले ही भरत के आसपास की दुनिया हानि प्रकट करने लगती है।" },
    beats: [
      { id: "bharata-dark-dream", title: { en: "A dream refuses celebration", hi: "एक स्वप्न उत्सव को अस्वीकार करता है" }, narration: { en: "On the night the messengers arrive, Bharata dreams of his father falling, the ocean drying, the moon descending, fire dying, and a dark southward journey. Music and performance cannot make him laugh afterward.", hi: "दूतों के आने की रात भरत पिता के गिरने, समुद्र सूखने, चंद्रमा उतरने, अग्नि बुझने और अँधेरी दक्षिण दिशा की यात्रा का स्वप्न देखते हैं। उसके बाद संगीत और अभिनय भी उन्हें हँसा नहीं पाते।" }, visualCue: "A sleepless Bharata sits amid fading performers while ominous dream fragments orbit the ceiling.", characterIds: ["bharata", "king-dasharatha"] },
      { id: "envoys-answer-carefully", title: { en: "Every question receives half an answer", hi: "हर प्रश्न को आधा उत्तर मिलता है" }, narration: { en: "Bharata asks after Dasharatha, Rama, Lakshmana, Kausalya, Sumitra, and Kaikeyi. The envoys say those he asks about are well and insist that a matter cannot wait; their careful phrasing deepens his unease.", hi: "भरत दशरथ, राम, लक्ष्मण, कौसल्या, सुमित्रा और कैकेयी का कुशल पूछते हैं। दूत कहते हैं कि जिनका वे पूछ रहे हैं वे कुशल हैं और एक काम विलंब नहीं सहता; सँभली हुई भाषा उनकी बेचैनी बढ़ाती है।" }, visualCue: "Messengers bow with controlled faces while Bharata studies the space between their words.", characterIds: ["bharata", "vasishta"] },
      { id: "seven-night-ride", title: { en: "The road is crossed without rest", hi: "राह बिना विश्राम पार होती है" }, narration: { en: "Bharata and Shatrughna leave their maternal family and travel for seven nights across rivers, forests, settlements, and difficult crossings. The geographic sequence becomes a countdown to news they do not yet possess.", hi: "भरत और शत्रुघ्न ननिहाल से निकलकर सात रातें नदियों, वनों, बस्तियों और कठिन पारों से गुजरते हैं। भूगोल उस समाचार की उलटी गिनती बन जाता है जो उन्हें अभी नहीं मिला।" }, visualCue: "A fast chariot crosses layered rivers and forests under seven changing night skies.", characterIds: ["bharata", "shatrughna"] },
      { id: "ayodhya-silence-speaks", title: { en: "Ayodhya tells him before people do", hi: "लोगों से पहले अयोध्या बता देती है" }, narration: { en: "From a distance Bharata sees no crowds, hears no instruments, smells no incense, and finds gardens, shops, shrines, and homes neglected. He recognizes the signs that accompany a monarch's death.", hi: "दूर से भरत न भीड़ देखते हैं, न वाद्य सुनते हैं, न धूप की गंध पाते हैं; उद्यान, दुकानें, पूजा-स्थल और घर उपेक्षित हैं। वे राजा की मृत्यु के साथ आने वाले संकेत पहचान लेते हैं।" }, visualCue: "The arriving chariot passes dusty open doors, unlit shrines, and empty market stalls.", characterIds: ["bharata", "king-dasharatha"] },
      { id: "bharata-enters-palace", title: { en: "The palace has no answer at its centre", hi: "महल के केंद्र में कोई उत्तर नहीं" }, narration: { en: "Bharata dismisses the gatekeepers' courtesies and enters with his head bowed. His father's quarters are empty, so the urgent journey ends at Kaikeyi's door.", hi: "भरत द्वारपालों की औपचारिकता रोककर सिर झुकाए भीतर जाते हैं। पिता का कक्ष खाली है, इसलिए तात्कालिक यात्रा कैकेयी के द्वार पर समाप्त होती है।" }, visualCue: "Bharata crosses a sequence of empty royal rooms toward one lit doorway.", characterIds: ["bharata", "kaikeyi"] },
    ],
  },
  "bharata-rejects-boons": {
    id: "bharata-rejects-boons",
    decisiveChange: { en: "The person for whom the boons were claimed rejects their meaning and result.", hi: "जिसके लिए वर माँगे गए थे, वही उनके अर्थ और परिणाम को अस्वीकार करता है।" },
    beats: [
      { id: "kaikeyi-welcomes-son", title: { en: "Kaikeyi welcomes the son she expected to reward", hi: "कैकेयी उस पुत्र का स्वागत करती हैं जिससे पुरस्कार की आशा थी" }, narration: { en: "Kaikeyi rises, embraces Bharata, asks about the journey, and expects the room to become triumphant. Bharata instead notices his father's missing bed and asks where the king is.", hi: "कैकेयी उठकर भरत को गले लगाती हैं, यात्रा पूछती हैं और कक्ष के विजयी होने की अपेक्षा रखती हैं। भरत पिता की खाली शय्या देखते हैं और राजा का पता पूछते हैं।" }, visualCue: "A warmly lit mother reaches toward Bharata while an empty royal bed dominates the frame.", characterIds: ["kaikeyi", "bharata", "king-dasharatha"] },
      { id: "father-death-spoken", title: { en: "The first truth drops him to the floor", hi: "पहला सत्य उन्हें भूमि पर गिरा देता है" }, narration: { en: "Kaikeyi says Dasharatha has reached the end common to all beings. Bharata collapses, grieves the father whose hand once brushed dust from him, and asks for Rama as his elder, refuge, and next father.", hi: "कैकेयी कहती हैं कि दशरथ सभी प्राणियों की समान अंतिम अवस्था को प्राप्त हुए। भरत गिर पड़ते हैं, उस पिता का शोक करते हैं जो उनके शरीर से धूल झाड़ता था, और राम को बड़े भाई, आश्रय और अब पिता के समान पुकारते हैं।" }, visualCue: "Bharata falls beside the empty bed while Kaikeyi remains seated above him.", characterIds: ["bharata", "king-dasharatha", "rama"] },
      { id: "exile-revealed-next", title: { en: "Rama is not in the next room", hi: "राम अगले कक्ष में नहीं हैं" }, narration: { en: "When Bharata asks to go to Rama, Kaikeyi tells him that Rama, Sita, and Lakshmana wear bark in the forest. Bharata first assumes Rama must have committed some grave wrong; he cannot imagine exile without fault.", hi: "भरत राम के पास जाने को कहते हैं तो कैकेयी बताती हैं कि राम, सीता और लक्ष्मण वल्कल पहनकर वन में हैं। भरत पहले किसी गंभीर अपराध की आशंका करते हैं; दोष बिना वनवास की कल्पना नहीं कर पाते।" }, visualCue: "The chamber opens into a stark vision of three travellers disappearing among forest trees.", characterIds: ["bharata", "kaikeyi", "rama", "sita", "lakshmana"] },
      { id: "kaikeyi-claims-success", title: { en: "Kaikeyi names the boons as success", hi: "कैकेयी वरों को सफलता बताती हैं" }, narration: { en: "She explains that Rama did no wrong: she herself demanded Bharata's kingdom and Rama's exile, Dasharatha kept his promise and died grieving, and now Bharata should perform the funeral and take power.", hi: "वे बताती हैं कि राम ने कोई अपराध नहीं किया: उन्होंने स्वयं भरत के लिए राज्य और राम का वनवास माँगा, दशरथ ने वचन निभाया और शोक में मरे, इसलिए अब भरत संस्कार कर सत्ता लें।" }, visualCue: "Two ceremonial boons glow behind Kaikeyi while Bharata recoils from them.", characterIds: ["kaikeyi", "bharata", "king-dasharatha", "rama"] },
      { id: "bharata-rejects-result", title: { en: "Bharata refuses to become the ending", hi: "भरत इस परिणाम का अंत बनने से इंकार करते हैं" }, narration: { en: "Bharata says the kingdom cannot replace father or elder brother, denies any knowledge of the plan, rejects Kaikeyi's purpose, and vows to bring Rama from the forest and serve him.", hi: "भरत कहते हैं कि राज्य पिता या बड़े भाई का स्थान नहीं ले सकता, योजना की जानकारी से इंकार करते हैं, कैकेयी के उद्देश्य को अस्वीकार करते हैं और राम को वन से लाकर उनकी सेवा करने की प्रतिज्ञा करते हैं।" }, visualCue: "Bharata turns away from crown and throne toward a distant forest path opening beyond the chamber.", characterIds: ["bharata", "kaikeyi", "rama"] },
    ],
  },
  "funeral-and-trust": {
    id: "funeral-and-trust",
    decisiveChange: { en: "Suspicion inside the family gives way to shared mourning and a verified intention.", hi: "परिवार का संदेह साझा शोक और प्रमाणित संकल्प में बदलता है।" },
    beats: [
      { id: "kausalya-fears-complicity", title: { en: "Kausalya cannot yet know whom to trust", hi: "कौसल्या अभी नहीं जानतीं किस पर भरोसा करें" }, narration: { en: "Hearing Bharata's voice, Kausalya meets him while still believing he may have wanted the kingdom. She asks to be sent to Rama rather than live inside the result of Kaikeyi's plan.", hi: "भरत की आवाज़ सुनकर कौसल्या उनसे मिलती हैं, पर अभी मानती हैं कि वे राज्य चाहते थे। वे कैकेयी की योजना के परिणाम में रहने के बजाय राम के पास भेजे जाने को कहती हैं।" }, visualCue: "Kausalya approaches Bharata guarded by grief while Sumitra stands close behind.", characterIds: ["kausalya", "bharata", "sumitra", "rama"] },
      { id: "bharata-clears-himself", title: { en: "Bharata puts his whole self behind the denial", hi: "भरत अपने पूरे अस्तित्व से इंकार करते हैं" }, narration: { en: "He falls at Kausalya's feet and swears that he neither desired the kingdom nor knew of the exile. The long oath is the story's way of making his innocence answerable, not merely asserted.", hi: "वे कौसल्या के चरणों में गिरकर शपथ लेते हैं कि न उन्होंने राज्य चाहा, न वनवास जाना। लंबी शपथ उनकी निर्दोषता को केवल कथन नहीं, उत्तरदायित्व बनाती है।" }, visualCue: "Bharata kneels at Kausalya's feet as witnesses gather in a quiet circle.", characterIds: ["bharata", "kausalya"] },
      { id: "kausalya-embraces-bharata", title: { en: "Kausalya recognizes another grieving son", hi: "कौसल्या एक और शोकाकुल पुत्र को पहचानती हैं" }, narration: { en: "Kausalya tells Bharata that his loyalty to what is right makes the oath itself painful to hear. She draws him into her lap, and their separate grief becomes a shared commitment to Rama.", hi: "कौसल्या कहती हैं कि धर्मनिष्ठ भरत की शपथ सुनना ही उन्हें और दुख देता है। वे उन्हें गोद में खींचती हैं और अलग-अलग शोक राम के प्रति साझा संकल्प बन जाता है।" }, visualCue: "The defensive distance closes into an embrace at floor level.", characterIds: ["kausalya", "bharata", "rama"] },
      { id: "dasharatha-leaves-palace", title: { en: "The suspended farewell moves to the Sarayu", hi: "रुकी हुई विदाई सरयू की ओर बढ़ती है" }, narration: { en: "Vasishta asks Bharata to perform the rites. Dasharatha's body is raised from the oil, placed on a bier, and carried with priests, queens, attendants, incense, lament, and gifts toward the funeral ground.", hi: "वसिष्ठ भरत से संस्कार करने को कहते हैं। दशरथ का शरीर तेल से उठाकर अर्थी पर रखा जाता है और पुरोहितों, रानियों, सेवकों, सुगंध, विलाप तथा दान के साथ श्मशान की ओर ले जाया जाता है।" }, visualCue: "A solemn torchlit procession leaves the palace and descends toward the river.", characterIds: ["bharata", "king-dasharatha", "vasishta", "kausalya"] },
      { id: "ten-days-and-ashes", title: { en: "Mourning is allowed to take time", hi: "शोक को समय लेने दिया जाता है" }, narration: { en: "The family performs water rites, sleeps on the ground through the mourning period, completes the shraddha, and returns to gather bones and ashes. Bharata and Shatrughna both collapse under the renewed finality.", hi: "परिवार जलांजलि देता है, शोक अवधि में भूमि पर सोता है, श्राद्ध पूरा करता है और अस्थियाँ तथा राख लेने लौटता है। अंतिमता फिर सामने आते ही भरत और शत्रुघ्न दोनों टूट पड़ते हैं।" }, visualCue: "Days pass over the same riverbank until two brothers kneel beside cooled ash at dawn.", characterIds: ["bharata", "shatrughna", "king-dasharatha"] },
      { id: "duties-remain-after-grief", title: { en: "The living are called back to unfinished duties", hi: "जीवितों को अधूरे कर्तव्यों की ओर लौटाया जाता है" }, narration: { en: "Vasishta and Sumantra lift the brothers and remind them that the remaining rites must be completed. The scene does not end grief; it establishes that action must now continue through it.", hi: "वसिष्ठ और सुमंत्र भाइयों को उठाकर शेष संस्कार पूरे करने की याद दिलाते हैं। दृश्य शोक समाप्त नहीं करता; वह बताता है कि अब कर्म उसी के भीतर से आगे बढ़ेगा।" }, visualCue: "Vasishta and Sumantra raise the brothers as the river catches the first light.", characterIds: ["bharata", "shatrughna", "vasishta", "sumantra"] },
    ],
  },
  "crown-refused-road": {
    id: "crown-refused-road",
    decisiveChange: { en: "The institutions prepared to crown Bharata are redirected toward restoring Rama.", hi: "भरत के राज्याभिषेक को तैयार संस्थाएँ राम को लौटाने की ओर मुड़ती हैं।" },
    beats: [
      { id: "bharata-stops-vengeance", title: { en: "Bharata stops the punishment Rama would reject", hi: "भरत वह दंड रोकते हैं जिसे राम स्वीकार न करते" }, narration: { en: "Shatrughna seizes Manthara in anger over the destruction around them. Bharata stops him: harming her or killing his mother would itself estrange the very brother whose standard he intends to follow.", hi: "चारों ओर हुए विनाश पर क्रोधित शत्रुघ्न मंथरा को पकड़ लेते हैं। भरत उन्हें रोकते हैं: उसे हानि पहुँचाना या माँ की हत्या करना उसी भाई से दूर कर देगा जिसकी मर्यादा वे मानना चाहते हैं।" }, visualCue: "Bharata catches Shatrughna's raised arm while Manthara's scattered ornaments mark the floor.", characterIds: ["bharata", "shatrughna", "manthara", "rama"] },
      { id: "ministers-offer-crown", title: { en: "The kingdom offers the available answer", hi: "राज्य उपलब्ध उत्तर प्रस्तुत करता है" }, narration: { en: "Ministers place the installation materials before Bharata and argue that Dasharatha's command has made the throne his. Their proposal is practical, lawful in their reading, and exactly what he refuses.", hi: "मंत्री राज्याभिषेक-सामग्री भरत के सामने रखकर कहते हैं कि दशरथ की आज्ञा ने सिंहासन उन्हें दिया है। उनका प्रस्ताव व्यावहारिक और उनकी दृष्टि में वैध है—और भरत ठीक इसी को अस्वीकार करते हैं।" }, visualCue: "Crown, vessels, white umbrella, and royal seal form a bright path toward an empty throne.", characterIds: ["bharata", "vasishta"] },
      { id: "rama-named-king", title: { en: "Bharata names the absent king", hi: "भरत अनुपस्थित राजा का नाम लेते हैं" }, narration: { en: "He says the eldest must rule, Rama is king, and he will take the installation objects into the forest, ask Rama to return, and remain there himself if an exchange is required.", hi: "वे कहते हैं कि ज्येष्ठ ही शासन करेंगे, राम राजा हैं; वे अभिषेक-सामग्री वन ले जाकर राम से लौटने की विनती करेंगे और आवश्यकता पड़ी तो स्वयं वहीं रहेंगे।" }, visualCue: "Bharata turns the line of ceremonial objects away from the throne toward an open forest gate.", characterIds: ["bharata", "rama"] },
      { id: "road-builders-go-first", title: { en: "A decision becomes physical work", hi: "निर्णय भौतिक कार्य बनता है" }, narration: { en: "Surveyors, diggers, carpenters, bridge-builders, cooks, guides, and camp workers go ahead. They level difficult ground, prepare crossings, find water, and establish the route for a huge public journey.", hi: "सर्वेक्षक, खोदने वाले, बढ़ई, पुल बनाने वाले, रसोइए, मार्गदर्शक और शिविर-कर्मी आगे जाते हैं। वे कठिन भूमि समतल करते, पार बनाते, जल जुटाते और विशाल सार्वजनिक यात्रा की राह तैयार करते हैं।" }, visualCue: "Many skilled crews transform a rough route in depth—bridges, water points, tents, and marked paths appearing in sequence.", characterIds: ["bharata"] },
      { id: "i-am-not-the-king", title: { en: "Morning praise is silenced", hi: "सुबह की राजस्तुति रोक दी जाती है" }, narration: { en: "At dawn, drums and genealogists wake Bharata with royal praise. He stops them with the words, 'I am not the king,' before entering the great assembly called by Vasishta.", hi: "भोर में नगाड़े और वंशवाचक भरत को राजस्तुति से जगाते हैं। वे 'मैं राजा नहीं हूँ' कहकर सब रोकते हैं और वसिष्ठ की बुलाई महान सभा में जाते हैं।" }, visualCue: "A raised hand stills drums and conches while the empty throne waits beyond the doors.", characterIds: ["bharata", "vasishta", "shatrughna"] },
      { id: "assembly-orders-journey", title: { en: "The whole city turns toward Rama", hi: "पूरा नगर राम की ओर मुड़ता है" }, narration: { en: "When Vasishta again presents the throne, Bharata refuses before the gathered city, promises every effort to bring Rama back, and orders Sumantra to ready the car and commanders to marshal the expedition.", hi: "वसिष्ठ सभा में फिर सिंहासन प्रस्तुत करते हैं तो भरत सबके सामने इंकार करते हैं, राम को लौटाने का हर प्रयास करने की प्रतिज्ञा करते हैं और सुमंत्र को रथ तथा सेनानायकों को यात्रा तैयार करने का आदेश देते हैं।" }, visualCue: "The assembly rises as one; beyond it, chariots, riders, and citizens align toward the forest road.", characterIds: ["bharata", "vasishta", "sumantra", "rama"] },
    ],
  },
};

export const RAMAYANA_EMPTY_THRONE_DISTRICT: StoryDistrict = {
  id: "empty-throne-v1",
  title: { en: "The empty throne", hi: "खाली सिंहासन" },
  invitation: { en: "Return with the empty chariot, stay through Dasharatha's last night, race home with Bharata, and watch the crown become a road toward Rama.", hi: "खाली रथ के साथ लौटें, दशरथ की अंतिम रात में ठहरें, भरत के साथ घर दौड़ें और मुकुट को राम की ओर जाती राह बनते देखें।" },
  entryMomentId: "empty-chariot-return",
  momentIds: ["empty-chariot-return", "palace-grief-dialogue", "river-sound-confession", "city-without-king", "bharata-urgent-return", "bharata-rejects-boons", "funeral-and-trust", "crown-refused-road"],
  compassTurnIds: ["road-out-of-ayodhya", "king-dies-bharata-returns", "bharata-follows"],
};
