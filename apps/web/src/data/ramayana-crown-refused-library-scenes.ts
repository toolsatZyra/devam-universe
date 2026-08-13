import type { StoryBeat, StoryMoment } from "@/lib/domain/story-world";
import type { RamayanaLibraryScene } from "./ramayana-thin-turn-library-scenes";

const b = (id: string, en: string, hi: string, enText: string, hiText: string, visualCue: string, characterIds: string[]): StoryBeat => ({
  id,
  title: { en, hi },
  narration: { en: enText, hi: hiText },
  visualCue,
  characterIds,
});

const s = (
  id: string,
  detailOrdinal: number,
  sourceOrdinal: number,
  sourceGlobalOrdinal: number,
  spanSha256: string,
  title: { en: string; hi: string },
  synopsis: { en: string; hi: string },
  places: string[],
  nodeIds: string[],
  beats: StoryBeat[],
): RamayanaLibraryScene => ({
  id,
  turnId: "king-dies-bharata-returns",
  detailOrdinal,
  title,
  synopsis,
  sourceStart: sourceOrdinal,
  sourceEnd: sourceOrdinal,
  sourceGlobalOrdinal,
  spanSha256s: [spanSha256],
  nodeIds,
  places,
  moment: { id, decisiveChange: synopsis, beats } satisfies StoryMoment,
});

export const RAMAYANA_CROWN_REFUSED_LIBRARY_SCENES: RamayanaLibraryScene[] = [
  s(
    "bharata-stops-shatrughnas-assault",
    22,
    78,
    153,
    "04e729bcf932b384b82c4bf896ea36ac126f4273646bf1621f5f49c960121a51",
    { en: "Bharata stops Shatrughna's assault", hi: "भरत शत्रुघ्न का आक्रमण रोकते हैं" },
    {
      en: "Shatrughna's grief turns into violence against Manthara; Bharata, who initially hands her over, stops the assault before rage can become killing and leaves the moral failure visible rather than celebrating revenge.",
      hi: "शत्रुघ्न का शोक मंथरा के विरुद्ध हिंसा बन जाता है; उन्हें पहले शत्रुघ्न को सौंपने वाले भरत हत्या बनने से पहले आक्रमण रोकते हैं और प्रतिशोध का उत्सव बनाने के बजाय नैतिक विफलता को सामने रहने देते हैं।",
    },
    ["Ayodhya inner palace", "Doorway to the women's apartments", "Kaikeyi's chamber"],
    ["bharata", "shatrughna", "manthara", "kaikeyi", "rama", "palace-women", "crown-refused-road-event"],
    [
      b("shatrughna-blames-the-family-for-not-stopping-exile", "Shatrughna asks why the exile was not stopped", "शत्रुघ्न पूछते हैं कि वनवास रोका क्यों नहीं गया", "As Bharata plans the journey toward Rama, Shatrughna asks why a powerful family allowed Dasharatha's harmful command to proceed and why Lakshmana did not stop it. His question identifies failures around the decision, but grief quickly narrows his attention from shared institutional responsibility toward a vulnerable person he can physically reach.", "जब भरत राम की ओर यात्रा की योजना बना रहे हैं, शत्रुघ्न पूछते हैं कि शक्तिशाली परिवार ने दशरथ की हानिकारक आज्ञा को क्यों चलने दिया और लक्ष्मण ने उसे रोका क्यों नहीं। उनका प्रश्न निर्णय के आसपास की विफलताएँ पहचानता है, लेकिन शोक शीघ्र ही साझा उत्तरदायित्व से हटकर उस निर्बल व्यक्ति पर सिमट जाता है जिस तक वे शारीरिक रूप से पहुँच सकते हैं।", "Keep the larger palace and absent decision-makers visible as Shatrughna's anger fixes on the approaching doorway.", ["shatrughna", "bharata", "rama", "lakshmana", "king-dasharatha"]),
      b("bharata-hands-manthara-to-shatrughna", "Bharata hands Manthara to Shatrughna", "भरत मंथरा को शत्रुघ्न के हवाले करते हैं", "Manthara enters in rich clothing and ornaments, and Bharata identifies her as responsible for Rama's exile and Dasharatha's death before telling Shatrughna to deal with her. This is Bharata's participation in the escalation, not an innocent position outside it. Her body and appearance do not explain wrongdoing or make her a legitimate object of ridicule.", "मंथरा समृद्ध वस्त्र और आभूषण पहनकर आती हैं। भरत उन्हें राम के वनवास और दशरथ की मृत्यु के लिए उत्तरदायी बताते हुए शत्रुघ्न से उनके साथ जैसा चाहें वैसा करने को कहते हैं। यह बढ़ती हिंसा में भरत की भागीदारी है, उससे बाहर निर्दोष स्थिति नहीं। मंथरा का शरीर और रूप किसी गलत काम का कारण नहीं और न उपहास का उचित आधार है।", "Show Bharata's directing gesture and Manthara as a person in danger; do not use caricature, bodily comedy, or triumphant revenge framing.", ["bharata", "shatrughna", "manthara"]),
      b("shatrughna-assaults-manthara-and-the-women-flee", "Shatrughna assaults Manthara and the women flee", "शत्रुघ्न मंथरा पर आक्रमण करते हैं और स्त्रियाँ भागती हैं", "Shatrughna seizes, drags, and violently pushes Manthara while her companions flee in fear that his rage will spread to them. Her ornaments scatter and she loses consciousness. The scene records assault and terror without turning pain into spectacle, repeating dehumanizing comparisons, or presenting violence against a blamed woman as justice.", "शत्रुघ्न मंथरा को पकड़ते, घसीटते और हिंसक ढंग से धकेलते हैं, जबकि उनकी साथी स्त्रियाँ इस भय से भागती हैं कि क्रोध उन तक भी पहुँचेगा। उनके आभूषण बिखरते हैं और वे चेतना खो देती हैं। दृश्य आक्रमण और आतंक दर्ज करता है, पर पीड़ा को तमाशा, अमानवीय तुलना या दोषी ठहराई गई स्त्री पर हिंसा को न्याय नहीं बनाता।", "Use a broken line of scattered ornaments and fleeing witnesses to show consequences while keeping the physical attack brief and non-gratifying.", ["shatrughna", "manthara", "palace-women", "kaikeyi"]),
      b("bharata-stops-the-violence-before-it-becomes-killing", "Bharata stops the violence before it becomes killing", "भरत हिंसा को हत्या बनने से पहले रोकते हैं", "Kaikeyi seeks Bharata's protection, and he tells Shatrughna to release Manthara. His stated reasons invoke a ban on killing women and the fear that Rama would reject both brothers if they killed Manthara or Kaikeyi. The intervention saves a life, but its reasoning does not erase the assault, Bharata's earlier command, or Manthara's right not to be harmed.", "कैकेयी भरत की शरण लेती हैं और वे शत्रुघ्न से मंथरा को छोड़ने को कहते हैं। उनके बताए कारण स्त्री-हत्या के निषेध और इस भय पर टिके हैं कि मंथरा या कैकेयी की हत्या होने पर राम दोनों भाइयों को अस्वीकार करेंगे। हस्तक्षेप जीवन बचाता है, पर उसका तर्क आक्रमण, भरत की पहली आज्ञा या मंथरा के अहिंसा के अधिकार को नहीं मिटाता।", "End with Manthara released into Kaikeyi's care while both brothers face the harm already done rather than receiving a heroic victory pose.", ["bharata", "shatrughna", "manthara", "kaikeyi", "rama"]),
    ],
  ),
  s(
    "bharata-turns-the-crown-toward-rama",
    23,
    79,
    154,
    "6be42e1da724077223a7a75c69560db388edd03d6acbc3c87a1fe26d7af39dfd",
    { en: "Bharata turns the crown toward Rama", hi: "भरत मुकुट की दिशा राम की ओर मोड़ते हैं" },
    {
      en: "Ministers ask Bharata to fill the empty throne, but he refuses installation, names Rama as king, offers to take the forest place himself, and turns coronation materials into the leading edge of a return expedition.",
      hi: "मंत्री भरत से रिक्त सिंहासन सँभालने को कहते हैं, लेकिन वे राज्याभिषेक अस्वीकार कर राम को राजा बताते हैं, स्वयं वन में रहने की पेशकश करते हैं और अभिषेक-सामग्री को वापसी-अभियान की अग्रिम पंक्ति बना देते हैं।",
    },
    ["Ayodhya council chamber", "Installation pavilion", "Imagined road to Rama"],
    ["bharata", "rama", "ministers", "ayodhya-citizens", "installation-materials", "road-to-rama-story-world"],
    [
      b("ministers-offer-the-empty-throne", "Ministers offer the empty throne", "मंत्री रिक्त सिंहासन प्रस्तुत करते हैं", "On the fourteenth morning after Dasharatha's death, ministers say the kingdom has no ruler and ask Bharata to accept the prepared installation. They understand Dasharatha's decision as authorization and present continuity as urgent public need. Their proposal is institutional reasoning, not proof that the transfer was just or freely accepted.", "दशरथ की मृत्यु के चौदहवें दिन की सुबह मंत्री कहते हैं कि राज्य शासक-विहीन है और भरत से तैयार राज्याभिषेक स्वीकार करने को कहते हैं। वे दशरथ के निर्णय को अधिकार मानते हैं और शासन की निरंतरता को तात्कालिक सार्वजनिक आवश्यकता बताते हैं। उनका प्रस्ताव संस्थागत तर्क है, हस्तांतरण के न्यायपूर्ण या स्वेच्छा से स्वीकार होने का प्रमाण नहीं।", "Arrange the installation vessels, throne, umbrella, ministers, and waiting citizens as a complete path Bharata must actively answer.", ["ministers", "bharata", "king-dasharatha", "ayodhya-citizens"]),
      b("bharata-refuses-installation-and-names-rama", "Bharata refuses installation and names Rama", "भरत राज्याभिषेक अस्वीकार कर राम का नाम लेते हैं", "Bharata circles the prepared objects but refuses their destination, saying Rama as eldest brother should govern. He does not merely decline personal comfort; he disputes the legitimacy of completing the result created by Kaikeyi's demands and Dasharatha's command while Rama remains absent in the forest.", "भरत तैयार वस्तुओं की परिक्रमा करते हैं, पर उनका नियत लक्ष्य अस्वीकार कर कहते हैं कि ज्येष्ठ भाई राम को शासन करना चाहिए। वे केवल निजी सुख नहीं ठुकराते; राम के वन में अनुपस्थित रहते कैकेयी की माँग और दशरथ की आज्ञा से बने परिणाम को पूरा करने की वैधता पर प्रश्न उठाते हैं।", "Let Bharata walk around the ceremonial objects and turn their visual line away from himself toward an open forest road.", ["bharata", "rama", "kaikeyi", "king-dasharatha", "installation-materials"]),
      b("the-forest-exchange-becomes-a-plan", "The forest exchange becomes a plan", "वन में स्थान-बदल योजना बनता है", "Bharata says he will carry the installation materials to Rama, crown him there if necessary, and bring him back at the head of the procession. If someone must complete the fourteen years away, Bharata offers himself. The proposal expresses repair and loyalty, but Rama has not yet heard or consented to the exchange.", "भरत कहते हैं कि वे अभिषेक-सामग्री राम तक ले जाएँगे, आवश्यकता हो तो वहीं उनका अभिषेक करेंगे और उन्हें यात्रा के अग्रभाग में वापस लाएँगे। यदि किसी को चौदह वर्ष बाहर रहने हैं तो भरत स्वयं को प्रस्तुत करते हैं। प्रस्ताव सुधार और निष्ठा व्यक्त करता है, पर राम ने अभी इसे सुना या स्वीकार नहीं किया है।", "Stage two possible paths—Rama returning and Bharata remaining—without treating either as settled before the brothers meet.", ["bharata", "rama", "installation-materials", "forest-exile"]),
      b("court-grief-turns-into-road-orders", "Court grief turns into road orders", "दरबार का शोक मार्ग-निर्देश बनता है", "The councillors answer with tears and approval, and Bharata orders a four-part force, skilled route-finders, and workers to prepare the difficult road. Mourning begins to move through administrative labour. The scale promises access to Rama, but it will also carry a large court and military presence into inhabited landscapes.", "सभासद आँसुओं और सहमति से उत्तर देते हैं, और भरत चार अंगों वाली सेना, कुशल मार्गदर्शकों तथा कठिन राह तैयार करने वाले श्रमिकों का आदेश देते हैं। शोक प्रशासनिक श्रम के माध्यम से गति पकड़ता है। यह विस्तार राम तक पहुँच का साधन है, पर बसे हुए भू-दृश्यों में विशाल दरबार और सैन्य उपस्थिति भी ले जाएगा।", "Transform lists and tears into route maps, work crews, supply lines, and a gathering force while preserving the scale's ambiguity.", ["bharata", "ministers", "road-workers", "army", "rama"]),
    ],
  ),
  s(
    "many-workers-build-the-road-to-rama",
    24,
    80,
    155,
    "2d910bfca01b85399f39acdcb55d61e25e48598e58f2ece6ec359a29fe6bda9a",
    { en: "Many workers build the road to Rama", hi: "अनेक श्रमिक राम तक जाने की राह बनाते हैं" },
    {
      en: "Surveyors, builders, guides, guards, cooks, craftspeople, and paid labourers transform a difficult route into roads, bridges, water points, and fortified camps for an expedition of royal scale.",
      hi: "सर्वेक्षक, निर्माता, मार्गदर्शक, रक्षक, रसोइए, कारीगर और वेतनभोगी श्रमिक कठिन भूभाग को राजकीय विस्तार वाली यात्रा के लिए सड़कों, पुलों, जल-स्थलों और सुरक्षित शिविरों में बदलते हैं।",
    },
    ["Road from Ayodhya", "Construction camps", "Water works", "Route toward the Ganga"],
    ["bharata", "road-workers", "surveyors", "craftspeople", "cooks", "guards", "ganga", "road-to-rama-story-world"],
    [
      b("the-expedition-depends-on-many-kinds-of-skill", "The expedition depends on many kinds of skill", "यात्रा अनेक प्रकार के कौशल पर निर्भर करती है", "People who read soil and water conditions travel with tent makers, diggers, canal builders, vehicle makers, carpenters, guards, cooks, perfumers, wicker workers, and guides. Bharata's decision becomes possible through many named forms of expertise rather than through royal intention alone.", "मिट्टी और जल की दशा समझने वाले लोग तंबू बनाने वालों, खोदने वालों, नहर निर्माताओं, वाहन कारीगरों, बढ़इयों, रक्षकों, रसोइयों, सुगंधकारों, टोकरी कारीगरों और मार्गदर्शकों के साथ चलते हैं। भरत का निर्णय केवल राजकीय इच्छा से नहीं, अनेक पहचाने गए कौशलों के श्रम से संभव होता है।", "Introduce each craft through a distinct task and tool, keeping workers in the foreground rather than as decoration behind the prince.", ["road-workers", "surveyors", "craftspeople", "cooks", "guards", "bharata"]),
      b("rough-ground-is-cut-filled-and-bridged", "Rough ground is cut, filled, and bridged", "कठिन भूमि काटी, भरी और पुलों से जोड़ी जाती है", "Crews cut branches and shrubs, remove stones and trees, level rises, fill hollows and wells, break earth, and build crossings. The work creates passage but also visibly alters vegetation, soil, and water. The episode records royal logistics; it is not a present-day model for environmentally responsible road building.", "दल शाखाएँ और झाड़ियाँ काटते, पत्थर और वृक्ष हटाते, ऊँचाइयाँ समतल करते, गड्ढे और कुएँ भरते, धरती तोड़ते तथा पार-पथ बनाते हैं। काम मार्ग बनाता है, पर वनस्पति, मिट्टी और जल को भी स्पष्ट रूप से बदलता है। प्रसंग राजकीय रसद दर्ज करता है; यह आज के पर्यावरण-सम्मत सड़क निर्माण का आदर्श नहीं।", "Show the route opening alongside stumps, displaced earth, filled hollows, and new bridges so transformation is not visually costless.", ["road-workers", "trees", "water", "soil", "bridges"]),
      b("water-and-shelter-are-made-along-the-route", "Water and shelter are made along the route", "राह में जल और आश्रय बनाए जाते हैं", "Where water is scarce, workers dig reservoirs and prepare stopping places; where the ground permits, they build paved stretches and plant or preserve flowering trees. The route becomes a chain of support systems that can feed, shelter, and move a huge company rather than a simple line drawn through empty land.", "जहाँ जल कम है वहाँ श्रमिक जलाशय खोदते और पड़ाव बनाते हैं; जहाँ भूमि अनुमति देती है वहाँ पक्के हिस्से तैयार होते और फूलदार वृक्ष लगाए या बचाए जाते हैं। राह खाली भूमि पर खींची रेखा नहीं रहती, बल्कि विशाल समूह को भोजन, आश्रय और गति देने वाली सहायक व्यवस्थाओं की श्रृंखला बनती है।", "Pull back to reveal water points, shaded stops, pavements, supply work, and the many people required to sustain them.", ["road-workers", "water-workers", "camp-workers", "trees", "travellers"]),
      b("fortified-camps-copy-a-moving-capital", "Fortified camps copy a moving capital", "सुरक्षित शिविर चलते हुए नगर का रूप लेते हैं", "Camp crews raise roads, walls, towers, banners, buildings, and guarded enclosures until the temporary settlement is compared to a celestial capital. The grandeur communicates the expedition's political weight. It should not hide the labour, unequal power, material cost, or pressure such a moving court can place on the country it crosses.", "शिविर-दल रास्ते, दीवारें, मीनारें, ध्वज, भवन और सुरक्षित घेरे खड़े करते हैं, यहाँ तक कि अस्थायी बस्ती की तुलना दिव्य राजधानी से होती है। वैभव यात्रा का राजनीतिक भार दिखाता है। वह श्रम, असमान शक्ति, सामग्री की लागत या चलते दरबार द्वारा पार किए प्रदेश पर पड़ने वाले दबाव को नहीं छिपाता।", "Build the camp upward like a temporary city while workers, materials, perimeter guards, and the surrounding landscape remain visible.", ["camp-workers", "guards", "bharata", "army", "ganga"]),
    ],
  ),
  s(
    "bharata-silences-royal-praise",
    25,
    81,
    156,
    "fb6d8a6f729653c2382b3198dbd903bd452bf5a8731bde2734a74d3920f7e596",
    { en: "Bharata silences royal praise", hi: "भरत राजस्तुति रोकते हैं" },
    {
      en: "A morning designed for kingship wakes Bharata with drums and genealogy; he stops it, says he is not king, mourns the leaderless state, and enters the full court Vasishta has summoned.",
      hi: "राजसत्ता के लिए रची सुबह भरत को नगाड़ों और वंशगान से जगाती है; वे उसे रोककर कहते हैं कि वे राजा नहीं, नेतृत्व-विहीन राज्य पर शोक करते हैं और वसिष्ठ द्वारा बुलाई पूरी सभा में प्रवेश करते हैं।",
    },
    ["Bharata's chamber", "Palace corridors", "Golden assembly hall"],
    ["bharata", "shatrughna", "vasishta", "sumantra", "court-musicians", "assembly", "empty-throne"],
    [
      b("drums-and-genealogy-address-a-king", "Drums and genealogy address a king", "नगाड़े और वंशगान एक राजा को संबोधित करते हैं", "After preliminary ceremonies, praise singers and genealogists wake Bharata with consecrated hymns while drums, conches, and trumpets announce dawn. The palace machinery treats succession as already completed. For Bharata, each sound intensifies grief because it assigns him the identity he has publicly refused.", "प्रारंभिक अनुष्ठानों के बाद स्तुतिगायक और वंशवाचक पवित्र गान से भरत को जगाते हैं, जबकि नगाड़े, शंख और तुरहियाँ भोर की घोषणा करते हैं। महल की व्यवस्था उत्तराधिकार को पूरा हुआ मानती है। भरत के लिए हर स्वर शोक बढ़ाता है क्योंकि वह उन्हें वही पहचान देता है जिसे वे सार्वजनिक रूप से अस्वीकार कर चुके हैं।", "Let ceremonial sound fill the chamber while the empty royal seat appears as an unwanted silhouette behind Bharata.", ["bharata", "court-musicians", "genealogists", "empty-throne"]),
      b("bharata-says-he-is-not-king", "Bharata says he is not king", "भरत कहते हैं कि वे राजा नहीं हैं", "Bharata wakes and stops the music by declaring that he is not king. He tells Shatrughna that Kaikeyi's action and Dasharatha's death have left royal authority like a boat without a helmsman while Rama remains in the forest. The statement separates his physical presence in the palace from legitimacy in his own judgment.", "भरत जागकर यह कहते हुए संगीत रोकते हैं कि वे राजा नहीं हैं। वे शत्रुघ्न से कहते हैं कि कैकेयी के कार्य और दशरथ की मृत्यु ने राजसत्ता को बिना कर्णधार की नाव जैसा छोड़ दिया है, जबकि राम वन में हैं। कथन महल में उनकी शारीरिक उपस्थिति को उनकी अपनी दृष्टि में वैधता से अलग करता है।", "A raised hand stills every instrument; leave the visual line from Bharata to the throne deliberately broken.", ["bharata", "shatrughna", "kaikeyi", "king-dasharatha", "rama"]),
      b("vasishta-calls-the-state-into-one-room", "Vasishta calls the state into one room", "वसिष्ठ राज्य को एक कक्ष में बुलाते हैं", "Vasishta enters the royal court and orders envoys to summon Brahmins, Kshatriyas, warriors, counsellors, commanders, princes, Bharata, Shatrughna, Yudhajit, and Sumantra. The list gathers religious, military, administrative, and dynastic authority so the succession dispute will be answered before a public institution rather than in private alone.", "वसिष्ठ राजसभा में आकर दूतों को ब्राह्मणों, क्षत्रियों, योद्धाओं, सलाहकारों, सेनानायकों, राजकुमारों, भरत, शत्रुघ्न, युधाजित और सुमंत्र को बुलाने का आदेश देते हैं। यह सूची धार्मिक, सैन्य, प्रशासनिक और वंशगत अधिकार को एकत्र करती है ताकि उत्तराधिकार का प्रश्न केवल निजी रूप से नहीं, सार्वजनिक संस्था के सामने उत्तर पाए।", "Fill the golden hall in concentric groups whose differing roles and authority remain distinguishable.", ["vasishta", "bharata", "shatrughna", "yudhajit", "sumantra", "assembly"]),
      b("the-court-recognizes-dasharathas-son", "The court recognizes Dasharatha's son", "सभा दशरथ के पुत्र को पहचानती है", "People arrive by chariot, horse, and elephant, and the assembly brightens when Bharata enters because his presence recalls Dasharatha. Their welcome shows continuity and hope, but resemblance to the dead king does not settle who should rule. The unresolved question moves with Bharata into the crowded hall.", "लोग रथ, घोड़े और हाथियों से आते हैं, और भरत के प्रवेश पर सभा इसलिए उज्ज्वल होती है क्योंकि उनकी उपस्थिति दशरथ की याद दिलाती है। स्वागत निरंतरता और आशा दिखाता है, लेकिन मृत राजा से समानता यह तय नहीं करती कि शासन किसे करना चाहिए। अनसुलझा प्रश्न भरत के साथ भरी सभा में प्रवेश करता है।", "Let recognition ripple through the court while the unoccupied throne remains the central unanswered object.", ["bharata", "king-dasharatha", "assembly", "vasishta"]),
    ],
  ),
  s(
    "assembly-becomes-an-expedition",
    26,
    82,
    157,
    "ce9143611b23e18313d2188417fe5626bf56fb3c903a402057dc11063493bb6f",
    { en: "The assembly becomes an expedition", hi: "सभा यात्रा-अभियान में बदलती है" },
    {
      en: "Vasishta formally offers Bharata the kingdom, Bharata refuses before the assembled state, promises every effort to bring Rama back, and orders Sumantra and the commanders to turn deliberation into departure.",
      hi: "वसिष्ठ औपचारिक रूप से भरत को राज्य प्रस्तुत करते हैं, भरत समूचे राज्य की सभा के सामने अस्वीकार करते हैं, राम को लौटाने का हर प्रयास करने का वचन देते हैं और सुमंत्र तथा सेनानायकों को विचार-विमर्श को प्रस्थान में बदलने का आदेश देते हैं।",
    },
    ["Ayodhya assembly hall", "Royal courtyard", "Mobilizing streets", "Road toward the forest"],
    ["bharata", "vasishta", "sumantra", "rama", "shatrughna", "assembly", "army", "ayodhya-citizens", "road-to-rama-story-world"],
    [
      b("vasishta-presents-the-kingdom-before-the-assembly", "Vasishta presents the kingdom before the assembly", "वसिष्ठ सभा के सामने राज्य प्रस्तुत करते हैं", "Before nobles and learned people seated by rank, Vasishta says Dasharatha completed his duties, Rama obeyed the exile command, and the prosperous kingdom has been left to Bharata. He asks Bharata to accept installation and the allegiance of rulers from every direction. The formal offer exposes the strongest case for institutional continuity.", "पदक्रम से बैठे कुलीन और विद्वान लोगों के सामने वसिष्ठ कहते हैं कि दशरथ ने अपने कर्तव्य पूरे किए, राम ने वनवास की आज्ञा मानी और समृद्ध राज्य भरत को छोड़ा गया है। वे भरत से राज्याभिषेक और चारों दिशाओं के शासकों की अधीनता स्वीकार करने को कहते हैं। औपचारिक प्रस्ताव संस्थागत निरंतरता का सबसे मजबूत पक्ष सामने रखता है।", "Place Vasishta, the ranked assembly, tribute paths, and the waiting throne in one formal political tableau.", ["vasishta", "bharata", "king-dasharatha", "rama", "assembly"]),
      b("bharata-refuses-before-the-whole-state", "Bharata refuses before the whole state", "भरत समूचे राज्य के सामने अस्वीकार करते हैं", "Bharata asks how he could deprive Rama of the kingdom and tells Vasishta to speak for the eldest brother's claim before everyone present. He condemns the result created by his mother and bows toward the absent Rama. The refusal is no longer family speech; it becomes a public challenge to ratifying the transfer.", "भरत पूछते हैं कि वे राम को राज्य से कैसे वंचित कर सकते हैं और वसिष्ठ से सबके सामने ज्येष्ठ भाई के अधिकार की बात करने को कहते हैं। वे अपनी माँ द्वारा बनाए परिणाम की निंदा करते और अनुपस्थित राम की ओर झुकते हैं। यह अस्वीकार अब पारिवारिक कथन नहीं; हस्तांतरण की पुष्टि को सार्वजनिक चुनौती बन जाता है।", "Turn Bharata away from the throne and toward an open line through the assembly that points to the forest.", ["bharata", "rama", "vasishta", "kaikeyi", "assembly"]),
      b("bringing-rama-back-becomes-a-public-commitment", "Bringing Rama back becomes a public commitment", "राम को लौटाना सार्वजनिक प्रतिज्ञा बनता है", "Bharata says that if persuasion fails he will remain in the forest like Lakshmana, and that he will use every available means to ask Rama home. The assembly weeps with relief and turns its attention from crowning the person present to reaching the person absent. Rama's eventual answer, however, remains his own.", "भरत कहते हैं कि यदि समझाना विफल हुआ तो वे लक्ष्मण की तरह वन में रहेंगे और राम से घर लौटने का अनुरोध करने के लिए हर उपलब्ध उपाय अपनाएँगे। सभा राहत में रोती है और सामने उपस्थित व्यक्ति के अभिषेक से ध्यान हटाकर अनुपस्थित व्यक्ति तक पहुँचने लगती है। फिर भी राम का अंतिम उत्तर उनका अपना रहेगा।", "Let the throne recede as maps, roads, and the distant forest become the assembly's shared direction without showing consent already won.", ["bharata", "rama", "lakshmana", "assembly"]),
      b("sumantra-and-the-commanders-set-the-city-moving", "Sumantra and the commanders set the city moving", "सुमंत्र और सेनानायक नगर को गति देते हैं", "Bharata orders Sumantra to ready his chariot and notify the commanders. Soldiers, households, traders, priests, vehicles, animals, and supplies begin assembling for the march. Excitement spreads because the journey aims to bring Rama back, while the immense mobilization also carries hierarchy, force, and logistical pressure onto the road.", "भरत सुमंत्र को रथ तैयार करने और सेनानायकों को सूचना देने का आदेश देते हैं। सैनिक, परिवार, व्यापारी, पुरोहित, वाहन, पशु और सामग्री यात्रा के लिए जुटने लगते हैं। राम को लौटाने के लक्ष्य से उत्साह फैलता है, जबकि यह विशाल जुटान पदक्रम, सैन्य बल और रसद का दबाव भी राह पर ले जाता है।", "Open the court doors onto a city assembling by many social groups, vehicles, animals, and supply lines rather than one anonymous army shot.", ["bharata", "sumantra", "commanders", "army", "households", "ayodhya-citizens"]),
    ],
  ),
];
