import type { StoryMoment } from "@/lib/domain/story-world";
import type { RamayanaLibraryScene } from "./ramayana-thin-turn-library-scenes";

const scene = (
  value: Omit<RamayanaLibraryScene, "sourceGlobalOrdinal"> & { sourceGlobalOrdinal?: number },
): RamayanaLibraryScene => ({ ...value, sourceGlobalOrdinal: value.sourceGlobalOrdinal ?? value.sourceStart });

/**
 * Data-only source partitions for the three thin turns left after the first
 * whole-journey review. Story copy is consumer-facing; source identities stay
 * in metadata. No image, district, or navigation asset is added here.
 */
export const RAMAYANA_REMAINING_THIN_TURN_LIBRARY_SCENES: RamayanaLibraryScene[] = [
  scene({
    id: "anasuya-receives-sita",
    turnId: "deeper-into-forest",
    detailOrdinal: 2,
    title: { en: "Anasuya receives Sita", hi: "अनसूया सीता का स्वागत करती हैं" },
    synopsis: {
      en: "After Chitrakoot becomes unlivable, Atri welcomes the travellers and entrusts Sita to the elderly Anasuya, whose hospitality includes affection, formidable remembered austerity, and inherited counsel about marriage.",
      hi: "चित्रकूट में रहना कठिन हो जाने के बाद अत्रि यात्रियों का स्वागत करते हैं और सीता को वृद्ध अनसूया के स्नेहपूर्ण साथ में भेजते हैं; इस आतिथ्य में अनसूया की तपस्या की स्मृति और विवाह पर मिला पुराना उपदेश भी शामिल है।",
    },
    sourceStart: 117,
    sourceEnd: 117,
    sourceGlobalOrdinal: 192,
    spanSha256s: ["bab5eb49324e11cd02796717f2ef6eca9983e1886c57413e1bda41349e205e4d"],
    nodeIds: ["atri-anasuya-hermitage-story-world", "atri", "anasuya", "sita", "rama", "lakshmana"],
    places: ["Atri and Anasuya's hermitage"],
    moment: {
      id: "anasuya-receives-sita",
      decisiveChange: {
        en: "A departure forced by fear becomes an intimate meeting between Sita and an elder woman.",
        hi: "भय से शुरू हुआ प्रस्थान सीता और एक वृद्ध स्त्री की आत्मीय भेंट में बदल जाता है।",
      },
      beats: [
        {
          id: "chitrakoot-is-left-behind",
          title: { en: "Chitrakoot is left behind", hi: "चित्रकूट पीछे छूटता है" },
          narration: {
            en: "Rama can no longer separate Chitrakoot from the frightened hermitages, Bharata's grief, and the traces of the great visiting camp. He, Sita, and Lakshmana choose another road rather than pretend the first forest home still offers peace.",
            hi: "राम अब चित्रकूट को भयभीत आश्रमों, भरत के शोक और विशाल शिविर के बचे निशानों से अलग नहीं देख पाते। पहला वन-घर अब भी शांत है ऐसा मानने के बजाय वे सीता और लक्ष्मण के साथ दूसरी राह चुनते हैं।",
          },
          visualCue: "Three travellers leave the familiar ridge while the marked ground of the old camp fades behind them.",
          characterIds: ["rama", "sita", "lakshmana", "bharata"],
        },
        {
          id: "atri-welcomes-the-travellers",
          title: { en: "Atri welcomes the travellers", hi: "अत्रि यात्रियों का स्वागत करते हैं" },
          narration: {
            en: "At Atri's hermitage, the sage receives Rama like a son and extends the same care to Lakshmana and Sita. The journey pauses inside a household of elders rather than at an anonymous shelter.",
            hi: "अत्रि के आश्रम में ऋषि राम को पुत्र की तरह स्वीकार करते हैं और लक्ष्मण तथा सीता का भी उसी आदर से स्वागत करते हैं। यात्रा किसी अनजान पड़ाव पर नहीं, वृद्ध मेजबानों के घर में ठहरती है।",
          },
          visualCue: "Atri steps forward from the hermitage fire as the travellers lower their packs.",
          characterIds: ["atri", "rama", "sita", "lakshmana"],
        },
        {
          id: "atri-introduces-anasuya",
          title: { en: "Atri introduces Anasuya", hi: "अत्रि अनसूया से मिलाते हैं" },
          narration: {
            en: "Atri recalls Anasuya's endurance during a long drought and the help her austerity brought to others. He asks her to receive Sita, presenting an elder whose authority comes from a life already tested by hardship.",
            hi: "अत्रि लंबे अकाल में अनसूया के धैर्य और उनकी तपस्या से दूसरों को मिली सहायता को याद करते हैं। वे उनसे सीता को अपनाने का अनुरोध करते हैं और ऐसी वृद्धा से मिलाते हैं जिसका सम्मान कठिन जीवन से बना है।",
          },
          visualCue: "An aged Anasuya approaches slowly while remembered drought and flowing water form a quiet background.",
          characterIds: ["atri", "anasuya", "sita", "rama"],
        },
        {
          id: "anasuya-offers-inherited-counsel",
          title: { en: "Anasuya offers inherited counsel", hi: "अनसूया पुराना वैवाहिक उपदेश देती हैं" },
          narration: {
            en: "Anasuya welcomes Sita and praises the choice to share Rama's exile. She also repeats demanding ideals of a wife's duty that belong to the world and speakers of this story; the counsel remains the elder's view inside this conversation, not a command to every later listener.",
            hi: "अनसूया सीता का स्वागत करती हैं और राम के वनवास में साथ आने के निर्णय की प्रशंसा करती हैं। वे पत्नी के कर्तव्य पर कठोर पुराने आदर्श भी दोहराती हैं, जो इस कथा-समय और उसके पात्रों के विचार हैं; यह उस वृद्धा की राय है, हर बाद के श्रोता के लिए आदेश नहीं।",
          },
          visualCue: "Sita and Anasuya sit face to face, with warmth in the meeting and visible distance around the inherited counsel.",
          characterIds: ["anasuya", "sita", "rama"],
        },
      ],
    } satisfies StoryMoment,
  }),
  scene({
    id: "sita-tells-her-own-beginning",
    turnId: "deeper-into-forest",
    detailOrdinal: 3,
    title: { en: "Sita tells her own beginning", hi: "सीता अपनी शुरुआत स्वयं सुनाती हैं" },
    synopsis: {
      en: "Sita answers Anasuya in her own voice, receives gifts without asking for a boon, recounts how Janaka found and raised her and how Rama broke the bow, then leaves the hermitage with the dangerous Dandaka road ahead.",
      hi: "सीता अनसूया को अपने शब्दों में उत्तर देती हैं, बिना वर माँगे स्नेहपूर्ण उपहार स्वीकार करती हैं, जनक द्वारा पाए और पाले जाने से लेकर राम के धनुष तोड़ने तक अपनी कथा सुनाती हैं, और फिर दण्डक के कठिन मार्ग की ओर निकलती हैं।",
    },
    sourceStart: 118,
    sourceEnd: 118,
    sourceGlobalOrdinal: 193,
    spanSha256s: ["825d631e12f0c602dd2bc68ad810722cf11237e5495ec9d64d24dbd60c78d378"],
    nodeIds: ["sita-tells-her-beginning-event", "atri-anasuya-hermitage-story-world", "sita", "anasuya", "king-janaka", "rama", "lakshmana", "urmila"],
    places: ["Atri and Anasuya's hermitage", "Mithila", "Mithila bow hall"],
    moment: {
      id: "sita-tells-her-own-beginning",
      decisiveChange: {
        en: "Sita becomes the narrator of the life that brought her to Rama and the forest road.",
        hi: "सीता उस जीवन की कथावाचक बनती हैं जो उन्हें राम और वन-मार्ग तक लाया।",
      },
      beats: [
        {
          id: "sita-answers-from-her-own-experience",
          title: { en: "Sita answers for herself", hi: "सीता अपने अनुभव से उत्तर देती हैं" },
          narration: {
            en: "Sita says she remembers the teachings of her mother and mothers-in-law, but her loyalty is also tied to the Rama she knows: affectionate, controlled, and respectful toward every royal mother. Her answer gives personal reasons rather than remaining silent under instruction.",
            hi: "सीता कहती हैं कि उन्हें अपनी माँ और सासों की सीख याद है, पर उनकी निष्ठा उस राम से भी जुड़ी है जिन्हें वे जानती हैं—स्नेही, संयमी और हर राजमाता का आदर करने वाले। उनका उत्तर केवल उपदेश के आगे मौन नहीं रहता, अपने कारण भी बताता है।",
          },
          visualCue: "Sita speaks while remembered palace figures appear as people she has known rather than abstract rules.",
          characterIds: ["sita", "rama", "kausalya", "kaikeyi", "sumitra"],
        },
        {
          id: "anasuya-offers-a-boon",
          title: { en: "Anasuya offers a boon", hi: "अनसूया वर देना चाहती हैं" },
          narration: {
            en: "Pleased by Sita's answer, Anasuya offers to use the strength of her austerity for any desired good. Sita replies that the welcome itself is enough, refusing to turn the meeting into a demand for power or reward.",
            hi: "सीता के उत्तर से प्रसन्न होकर अनसूया अपनी तपस्या के बल से कोई भी मनचाहा वर देना चाहती हैं। सीता कहती हैं कि उनका स्नेह ही पर्याप्त है और इस भेंट को शक्ति या पुरस्कार की माँग में नहीं बदलतीं।",
          },
          visualCue: "Anasuya extends an open hand while Sita answers with a small grateful smile.",
          characterIds: ["anasuya", "sita"],
        },
        {
          id: "gifts-mark-affection-not-payment",
          title: { en: "Gifts mark affection", hi: "उपहार स्नेह का चिह्न बनते हैं" },
          narration: {
            en: "Anasuya still gives Sita a garland, clothing, ornaments, and fragrant paste that will not fade. Sita accepts them as an elder's affection, and the evening conversation becomes a rare interval of care inside exile.",
            hi: "अनसूया फिर भी सीता को माला, वस्त्र, आभूषण और सुगंधित लेप देती हैं जिनकी चमक फीकी नहीं पड़ेगी। सीता उन्हें एक वृद्धा के स्नेह के रूप में स्वीकार करती हैं और वनवास के बीच यह संध्या देखभाल का दुर्लभ विराम बनती है।",
          },
          visualCue: "Simple gifts lie between the two women as evening gathers around the hermitage.",
          characterIds: ["anasuya", "sita"],
        },
        {
          id: "janaka-finds-a-daughter",
          title: { en: "Janaka finds a daughter", hi: "जनक को एक पुत्री मिलती है" },
          narration: {
            en: "Asked to tell her marriage story, Sita begins earlier: Janaka finds her while ploughing the sacrificial ground, lifts the dust-covered child into his arms, and raises her as his daughter. Her account makes belonging an act of recognition and care.",
            hi: "विवाह की कथा पूछे जाने पर सीता उससे भी पहले से शुरू करती हैं: यज्ञभूमि जोतते समय जनक उन्हें पाते हैं, धूल से ढकी बालिका को गोद में उठाते हैं और अपनी पुत्री की तरह पालते हैं। उनकी कथा में अपनापन पहचान और देखभाल से बनता है।",
          },
          visualCue: "A furrow opens into the remembered moment when Janaka lifts an infant from the earth.",
          characterIds: ["sita", "king-janaka"],
        },
        {
          id: "the-bow-finds-its-answer",
          title: { en: "The bow finds its answer", hi: "धनुष को अपना उत्तर मिलता है" },
          narration: {
            en: "Janaka worries about finding a fitting husband and makes the ancient bow the test. Kings cannot move it; Rama arrives with Vishvamitra, lifts, strings, and breaks it, but accepts the marriage only after the two families consent and gather.",
            hi: "जनक योग्य वर को लेकर चिंतित होते हैं और प्राचीन धनुष को परीक्षा बनाते हैं। राजा उसे हिला नहीं पाते; विश्वामित्र के साथ आए राम उसे उठाकर चढ़ाते और तोड़ते हैं, पर विवाह तभी स्वीकार करते हैं जब दोनों परिवार सहमत होकर मिलते हैं।",
          },
          visualCue: "The bow breaks across a crowded hall, followed immediately by messengers travelling between Mithila and Ayodhya.",
          characterIds: ["sita", "king-janaka", "rama", "vishvamitra", "king-dasharatha"],
        },
        {
          id: "night-closes-and-dandaka-opens",
          title: { en: "Night closes; Dandaka opens", hi: "रात ढलती है, दण्डक खुलता है" },
          narration: {
            en: "Anasuya embraces Sita after the story. Sita returns to Rama wearing the gifts, the three travellers rest, and at dawn the hermits warn that the road ahead is haunted by violent attackers. Blessings behind them, they enter deeper forest together.",
            hi: "कथा सुनकर अनसूया सीता को गले लगाती हैं। उपहार पहने सीता राम के पास लौटती हैं, तीनों रात बिताते हैं और भोर में तपस्वी आगे के हिंसक संकटों की चेतावनी देते हैं। आशीर्वाद लेकर वे साथ-साथ गहरे वन में प्रवेश करते हैं।",
          },
          visualCue: "Moonlit hospitality gives way to a dawn path disappearing into dense Dandaka forest.",
          characterIds: ["anasuya", "sita", "rama", "lakshmana"],
        },
      ],
    } satisfies StoryMoment,
  }),
  scene({
    id: "jatayu-promises-protection",
    turnId: "panchavati-surpanakha",
    detailOrdinal: 1,
    title: { en: "Jatayu promises protection", hi: "जटायु रक्षा का वचन देते हैं" },
    synopsis: {
      en: "On the road to Panchavati, Rama and Lakshmana first mistake a vast vulture for danger; Jatayu names his friendship with Dasharatha, his family connection to Sampati, and his willingness to watch over Sita.",
      hi: "पंचवटी के मार्ग पर राम और लक्ष्मण पहले विशाल गिद्ध को संकट समझते हैं; जटायु दशरथ से अपनी मित्रता, सम्पाती से अपना पारिवारिक संबंध और सीता की रक्षा करने की इच्छा बताते हैं।",
    },
    sourceStart: 13,
    sourceEnd: 13,
    spanSha256s: ["efb495936dd015c72ce586443ef010077ca713e5652fa1d187fc77cd885ad925"],
    nodeIds: ["jatayu-welcomes-panchavati-event", "jatayu", "sampati", "rama", "sita", "lakshmana", "king-dasharatha"],
    places: ["Jatayu's Panchavati threshold", "Panchavati"],
    moment: {
      id: "jatayu-promises-protection",
      decisiveChange: {
        en: "A frightening silhouette becomes family memory and a future guardian.",
        hi: "भयावह आकृति पारिवारिक स्मृति और भविष्य के रक्षक में बदल जाती है।",
      },
      beats: [
        {
          id: "a-vulture-blocks-the-road",
          title: { en: "A vast vulture blocks the road", hi: "एक विशाल गिद्ध मार्ग पर दिखता है" },
          narration: {
            en: "Approaching Panchavati, the brothers see a huge bird and prepare for the possibility that it is a disguised attacker. The forest has taught them not to treat appearance as proof of safety.",
            hi: "पंचवटी के पास पहुँचते हुए भाइयों को एक विशाल पक्षी दिखता है और वे उसके छद्म आक्रमणकारी होने की आशंका के लिए तैयार हो जाते हैं। वन ने उन्हें सिखाया है कि केवल रूप को सुरक्षा का प्रमाण न मानें।",
          },
          visualCue: "A broad-winged silhouette fills the path while the brothers hold their distance.",
          characterIds: ["rama", "lakshmana", "jatayu"],
        },
        {
          id: "dasharathas-friend-speaks",
          title: { en: "Dasharatha's friend speaks", hi: "दशरथ का मित्र बोलता है" },
          narration: {
            en: "The bird answers gently: he is a friend of Dasharatha. Rama's posture changes at once, and suspicion makes room for the lost father's living connection.",
            hi: "पक्षी कोमल स्वर में बताता है कि वह दशरथ का मित्र है। राम का व्यवहार तुरंत बदलता है और संदेह के बीच दिवंगत पिता से जुड़ा जीवित संबंध सामने आता है।",
          },
          visualCue: "Weapons lower as Jatayu speaks Dasharatha's name and an old friendship enters the clearing.",
          characterIds: ["jatayu", "rama", "king-dasharatha"],
        },
        {
          id: "jatayu-names-his-family",
          title: { en: "Jatayu names his family", hi: "जटायु अपना वंश बताते हैं" },
          narration: {
            en: "Jatayu places himself within a vast genealogy of birds, animals, people, and other beings, then gives the relation that matters for the road ahead: he is Aruna's son and Sampati's younger brother.",
            hi: "जटायु स्वयं को पक्षियों, पशुओं, मनुष्यों और अन्य जीवों की विशाल वंशकथा में रखते हैं, फिर आगे की यात्रा के लिए मुख्य संबंध बताते हैं—वे अरुण के पुत्र और सम्पाती के छोटे भाई हैं।",
          },
          visualCue: "Branching silhouettes of many beings narrow toward Jatayu and the distant figure of Sampati.",
          characterIds: ["jatayu", "sampati", "aruna", "garuda"],
        },
        {
          id: "a-guardian-joins-the-household",
          title: { en: "A guardian joins the household", hi: "एक रक्षक परिवार से जुड़ता है" },
          narration: {
            en: "Jatayu offers practical help: when Rama and Lakshmana leave the cottage, he will watch over Sita. Rama embraces his father's friend, and the promise becomes part of the Panchavati household before the house itself is built.",
            hi: "जटायु व्यावहारिक सहायता देते हैं: जब राम और लक्ष्मण कुटिया से बाहर जाएँगे, वे सीता की रक्षा करेंगे। राम पिता के मित्र को गले लगाते हैं और घर बनने से पहले ही यह वचन पंचवटी परिवार का हिस्सा बन जाता है।",
          },
          visualCue: "Rama embraces Jatayu as Sita and Lakshmana stand beside the still-unbuilt homeward path.",
          characterIds: ["jatayu", "rama", "sita", "lakshmana", "king-dasharatha"],
        },
      ],
    } satisfies StoryMoment,
  }),
  scene({
    id: "lakshmana-builds-panchavati-home",
    turnId: "panchavati-surpanakha",
    detailOrdinal: 2,
    title: { en: "Lakshmana builds the Panchavati home", hi: "लक्ष्मण पंचवटी का घर बनाते हैं" },
    synopsis: {
      en: "Rama, Sita, and Lakshmana choose a living site near the Godavari; Lakshmana raises the cottage, completes its welcome rites, and receives Rama's embrace for turning a forest clearing into a shared home.",
      hi: "राम, सीता और लक्ष्मण गोदावरी के पास रहने की जगह चुनते हैं; लक्ष्मण कुटिया बनाकर गृह-प्रवेश की विधि पूरी करते हैं और वन की खुली भूमि को साझा घर बनाने पर राम का आलिंगन पाते हैं।",
    },
    sourceStart: 14,
    sourceEnd: 14,
    spanSha256s: ["b1d9e6facb955b0f1ec14b118b80b6ace2eff31bf5d84299db831267bff4cc31"],
    nodeIds: ["jatayu-welcomes-panchavati-event", "panchavati-cottage-story-world", "rama", "sita", "lakshmana", "jatayu"],
    places: ["Panchavati", "The cottage at Panchavati", "Godavari"],
    moment: {
      id: "lakshmana-builds-panchavati-home",
      decisiveChange: {
        en: "A recommended destination becomes a home made by the family's own labour.",
        hi: "बताया गया स्थान परिवार के अपने श्रम से घर बन जाता है।",
      },
      beats: [
        {
          id: "the-family-chooses-a-site",
          title: { en: "The family chooses a site", hi: "परिवार रहने की जगह चुनता है" },
          narration: {
            en: "At Panchavati, Rama asks Lakshmana to help find level ground near water, fuel, flowers, and forest resources. The choice is not a palace plan but a practical decision about how three people will live each day.",
            hi: "पंचवटी में राम लक्ष्मण से जल, ईंधन, फूल और वन-सामग्री के पास समतल भूमि खोजने को कहते हैं। यह महल की योजना नहीं, तीन लोगों के रोजमर्रा के जीवन का व्यावहारिक निर्णय है।",
          },
          visualCue: "The three compare river distance, shade, open ground, and the surrounding hills.",
          characterIds: ["rama", "sita", "lakshmana"],
        },
        {
          id: "godavari-shapes-the-home",
          title: { en: "The Godavari shapes the home", hi: "गोदावरी घर का रूप तय करती है" },
          narration: {
            en: "They select a place close enough to the Godavari for water but not pressed against the river, with lotus pools, birds, deer, flowering trees, and nearby hills. The landscape is part of the household rather than a blank backdrop.",
            hi: "वे गोदावरी से इतना पास स्थान चुनते हैं कि जल मिल सके, पर नदी से बिल्कुल सटा न हो; पास में कमल-सरोवर, पक्षी, हिरण, फूलों वाले वृक्ष और पहाड़ियाँ हैं। भू-दृश्य घर की दुनिया का हिस्सा बनता है, खाली पृष्ठभूमि नहीं।",
          },
          visualCue: "River, pool, hill, and grove align around a modest clearing selected for the cottage.",
          characterIds: ["rama", "sita", "lakshmana"],
        },
        {
          id: "lakshmana-raises-the-cottage",
          title: { en: "Lakshmana raises the cottage", hi: "लक्ष्मण कुटिया खड़ी करते हैं" },
          narration: {
            en: "Lakshmana builds with clay, bamboo, branches, cord, grass, reeds, and leaves. The story gives the work weight: walls, pillars, roof, binding, and a level floor turn gathered material into shelter.",
            hi: "लक्ष्मण मिट्टी, बाँस, डालियों, रस्सियों, घास, नरकट और पत्तों से कुटिया बनाते हैं। कथा श्रम को महत्व देती है—दीवार, खंभे, छत, बंधन और समतल फर्श जुटी सामग्री को आश्रय बनाते हैं।",
          },
          visualCue: "The cottage rises step by step from measured bamboo, packed clay, tied roof beams, and layered leaves.",
          characterIds: ["lakshmana", "rama", "sita"],
        },
        {
          id: "the-house-is-welcomed",
          title: { en: "The house is welcomed", hi: "घर का स्वागत होता है" },
          narration: {
            en: "After bathing in the river, Lakshmana returns with flowers and fruit and performs the house-peace observance before showing the completed cottage. Shelter is treated as a place to enter responsibly, not merely occupy.",
            hi: "नदी में स्नान के बाद लक्ष्मण फूल और फल लाकर गृह-शांति की विधि करते हैं, फिर बनी हुई कुटिया दिखाते हैं। आश्रय को केवल घेर लेने की जगह नहीं, जिम्मेदारी से प्रवेश करने वाला घर माना जाता है।",
          },
          visualCue: "Flowers and water mark the cottage threshold before the family steps inside.",
          characterIds: ["lakshmana", "rama", "sita"],
        },
        {
          id: "rama-rewards-work-with-embrace",
          title: { en: "Rama answers work with an embrace", hi: "राम श्रम का उत्तर आलिंगन से देते हैं" },
          narration: {
            en: "Rama sees the finished home with Sita and embraces Lakshmana, saying that such care keeps their father's presence alive. Panchavati begins not with royal wealth but with gratitude among the people who made it habitable.",
            hi: "सीता के साथ बना घर देखकर राम लक्ष्मण को गले लगाते हैं और कहते हैं कि ऐसी देखभाल में पिता की उपस्थिति जीवित रहती है। पंचवटी की शुरुआत राजसी धन से नहीं, उसे रहने योग्य बनाने वालों के आपसी आभार से होती है।",
          },
          visualCue: "The brothers embrace at the threshold while Sita looks across the completed home and river beyond.",
          characterIds: ["rama", "lakshmana", "sita", "king-dasharatha"],
        },
      ],
    } satisfies StoryMoment,
  }),
  scene({
    id: "winter-at-panchavati-remembers-bharata",
    turnId: "panchavati-surpanakha",
    detailOrdinal: 3,
    title: { en: "Winter at Panchavati remembers Bharata", hi: "पंचवटी की सर्दी भरत को याद करती है" },
    synopsis: {
      en: "A cold morning makes Panchavati feel lived-in: Lakshmana observes the fields, mist, river, animals, and season, then imagines Bharata enduring the same cold at Nandigrama until Rama stops blame from falling on Kaikeyi.",
      hi: "एक ठंडी सुबह पंचवटी को सचमुच बसा हुआ संसार बनाती है: लक्ष्मण खेत, धुंध, नदी, पशु और ऋतु देखते हैं, फिर नन्दिग्राम में वही ठंड सहते भरत की कल्पना करते हैं, जब तक राम कैकेयी पर दोष डालने से उन्हें रोकते नहीं।",
    },
    sourceStart: 15,
    sourceEnd: 15,
    spanSha256s: ["ea4a16188efd6d3fd1e26ba374f74db4aed7c38a1e74b2dcaf3874a32ba2146a"],
    nodeIds: ["jatayu-welcomes-panchavati-event", "panchavati-cottage-story-world", "rama", "sita", "lakshmana", "bharata", "kaikeyi"],
    places: ["Panchavati", "Godavari", "Nandigrama", "Sarayu"],
    moment: {
      id: "winter-at-panchavati-remembers-bharata",
      decisiveChange: {
        en: "The new home acquires a season, and the season reconnects exile to Bharata's parallel life.",
        hi: "नए घर को एक ऋतु मिलती है और वही ऋतु वनवास को भरत के समानांतर जीवन से जोड़ती है।",
      },
      beats: [
        {
          id: "winter-enters-the-household",
          title: { en: "Winter enters the household", hi: "सर्दी घर में प्रवेश करती है" },
          narration: {
            en: "After autumn, the family walks to the Godavari on a cold morning. Dew roughens the skin, mist softens the sun, fire feels welcome, and the river that supports daily life becomes difficult to enter.",
            hi: "शरद के बाद एक ठंडी सुबह परिवार गोदावरी की ओर चलता है। ओस त्वचा को रूखा करती है, धुंध सूर्य को फीका बनाती है, आग सुख देती है और रोजमर्रा का सहारा नदी अब उतरने में कठिन लगती है।",
          },
          visualCue: "Breath, dew, pale sunlight, and cold river water make the same Panchavati landscape newly physical.",
          characterIds: ["rama", "sita", "lakshmana"],
        },
        {
          id: "lakshmana-reads-the-season",
          title: { en: "Lakshmana reads the season", hi: "लक्ष्मण ऋतु को पढ़ते हैं" },
          narration: {
            en: "Lakshmana notices ripening grain, quiet forests, frost-damaged lotuses, thirsty elephants pulling back from cold water, resting birds, and long nights. The story lets ordinary climate and animal behaviour carry time forward.",
            hi: "लक्ष्मण पकते अनाज, शांत वन, पाले से मुरझाए कमल, ठंडे जल से सूँड़ खींचते हाथी, किनारे बैठे पक्षी और लंबी रातें देखते हैं। साधारण मौसम और पशुओं का व्यवहार कथा में समय को आगे बढ़ाते हैं।",
          },
          visualCue: "Fields, folded lotuses, hesitant elephants, and still birds unfold as one winter panorama.",
          characterIds: ["lakshmana", "rama", "sita"],
        },
        {
          id: "cold-connects-lakshmana-to-bharata",
          title: { en: "Cold connects Lakshmana to Bharata", hi: "ठंड लक्ष्मण को भरत से जोड़ती है" },
          narration: {
            en: "The difficult river bath makes Lakshmana imagine Bharata sleeping on the ground, limiting food, and approaching the Sarayu before dawn while governing in Rama's name. Distance collapses through a shared physical hardship.",
            hi: "कठिन नदी-स्नान लक्ष्मण को भरत की कल्पना कराता है—भूमि पर सोते, सीमित भोजन लेते और राम के नाम पर शासन करते हुए भोर से पहले सरयू जाते भरत। समान शारीरिक कठिनाई दूरी को कुछ क्षण के लिए मिटा देती है।",
          },
          visualCue: "The Godavari's cold surface reflects a distant Bharata walking toward the Sarayu before sunrise.",
          characterIds: ["lakshmana", "bharata", "rama"],
        },
        {
          id: "rama-stops-blame-and-keeps-love",
          title: { en: "Rama stops blame and keeps love", hi: "राम दोष रोककर स्नेह बचाते हैं" },
          narration: {
            en: "Lakshmana contrasts Bharata's conduct with Kaikeyi's decision, but Rama refuses to let him condemn their mother. He asks instead to speak of Bharata and admits how intensely he longs to see both absent brothers again.",
            hi: "लक्ष्मण भरत के आचरण की तुलना कैकेयी के निर्णय से करते हैं, पर राम उन्हें अपनी माँ की निंदा करने से रोकते हैं। वे भरत की ही बात करने को कहते हैं और स्वीकारते हैं कि दोनों दूर भाइयों से मिलने की इच्छा कितनी तीव्र है।",
          },
          visualCue: "Rama interrupts the accusatory gesture, turning the conversation toward Bharata and Shatrughna.",
          characterIds: ["rama", "lakshmana", "bharata", "shatrughna", "kaikeyi"],
        },
      ],
    } satisfies StoryMoment,
  }),
  scene({
    id: "surpanakha-carries-janasthana-to-lanka",
    turnId: "golden-deer-plot",
    detailOrdinal: 1,
    title: { en: "Surpanakha carries Janasthana to Lanka", hi: "शूर्पणखा जनस्थान की हार लंका ले जाती हैं" },
    synopsis: {
      en: "After Janasthana falls, Surpanakha enters Ravana's court, attacks his failure to know his own frontier, describes Rama, Lakshmana, and Sita, and turns grief, humiliation, and desire into a proposal to abduct Sita.",
      hi: "जनस्थान के पतन के बाद शूर्पणखा रावण के दरबार में पहुँचती हैं, अपने ही सीमांत की खबर न रखने पर उसे घेरती हैं, राम, लक्ष्मण और सीता का वर्णन करती हैं और शोक, अपमान तथा इच्छा को सीता-हरण के प्रस्ताव में बदल देती हैं।",
    },
    sourceStart: 31,
    sourceEnd: 33,
    spanSha256s: [
      "0fdcf1f418a0496148f3cffa7a8ff081ed232da1413ecdc74737393989414e8d",
      "353cebab9b5ec70ad25eac60b8b1ed5fe5c2ebb0dcc12277612ccedd6048f50d",
      "c0a156a47e9476ff9284983d09eef2ab12bb5e6aceca71371a94be8ae7f97776",
    ],
    nodeIds: ["ravana-chooses-deception-event", "ravana", "surpanakha", "rama", "lakshmana", "sita", "khara", "dushana", "trishira"],
    places: ["Lanka", "Ravana's court", "Janasthana"],
    moment: {
      id: "surpanakha-carries-janasthana-to-lanka",
      decisiveChange: {
        en: "A forest defeat becomes a decision inside Lanka's court.",
        hi: "वन की हार लंका के दरबार में लिए जाने वाले निर्णय में बदल जाती है।",
      },
      beats: [
        {
          id: "surpanakha-enters-the-court",
          title: { en: "Surpanakha enters the court", hi: "शूर्पणखा दरबार में प्रवेश करती हैं" },
          narration: {
            en: "Having seen Khara, Dushana, Trishira, and the Janasthana force destroyed, Surpanakha goes directly to Lanka. She enters a court built around Ravana's reputation for conquest and shows the injury that his distant power failed to prevent.",
            hi: "खर, दूषण, त्रिशिरा और जनस्थान की सेना का विनाश देखकर शूर्पणखा सीधे लंका जाती हैं। वे रावण की विजय-प्रतिष्ठा से भरे दरबार में पहुँचकर वह चोट दिखाती हैं जिसे उसकी दूर फैली शक्ति रोक नहीं सकी।",
          },
          visualCue: "The ordered court breaks around Surpanakha's arrival and the visible evidence of Janasthana's collapse.",
          characterIds: ["surpanakha", "ravana", "khara", "dushana", "trishira"],
        },
        {
          id: "a-sister-attacks-the-kings-blindness",
          title: { en: "A sister attacks the king's blindness", hi: "बहन राजा की अनदेखी पर प्रहार करती है" },
          narration: {
            en: "Surpanakha does not begin with flattery. She says a ruler absorbed in pleasure, without reliable spies or timely action, can lose both kingdom and loyalty; Janasthana has fallen and Ravana learned of it only from the survivor standing before him.",
            hi: "शूर्पणखा चापलूसी से शुरू नहीं करतीं। वे कहती हैं कि भोग में डूबा, भरोसेमंद सूचना और समय पर कार्रवाई से दूर राजा राज्य और निष्ठा दोनों खो सकता है; जनस्थान गिर चुका है और रावण को खबर सामने खड़ी जीवित बची स्त्री से मिल रही है।",
          },
          visualCue: "An empty frontier map opens beside the court as Surpanakha names the failure of information.",
          characterIds: ["surpanakha", "ravana"],
        },
        {
          id: "ravana-demands-the-measure-of-rama",
          title: { en: "Ravana demands the measure of Rama", hi: "रावण राम की पूरी जानकारी माँगता है" },
          narration: {
            en: "Ravana asks who Rama is, what weapons and strength he possesses, why he lives in Dandaka, and who injured Surpanakha. The questions turn an insult to royal pride into focused attention on one forest household.",
            hi: "रावण पूछता है कि राम कौन हैं, उनके हथियार और शक्ति क्या हैं, वे दण्डक में क्यों रहते हैं और शूर्पणखा को किसने घायल किया। ये प्रश्न राजसी अपमान को एक वन-परिवार पर केन्द्रित ध्यान में बदल देते हैं।",
          },
          visualCue: "Ravana's questions draw Rama, Lakshmana, Sita, and the fallen commanders into the centre of the chamber.",
          characterIds: ["ravana", "surpanakha", "rama", "lakshmana", "sita"],
        },
        {
          id: "description-becomes-abduction-plan",
          title: { en: "Description becomes an abduction plan", hi: "वर्णन हरण की योजना बनता है" },
          narration: {
            en: "Surpanakha describes Rama's speed in battle and Lakshmana's loyalty, then presents Sita's beauty as something Ravana should seize. Her account hides her own attack on Sita and recasts the injury as a reason for coercion, giving Ravana desire and revenge in the same proposal.",
            hi: "शूर्पणखा युद्ध में राम की गति और लक्ष्मण की निष्ठा बताती हैं, फिर सीता के सौंदर्य को ऐसी वस्तु की तरह रखती हैं जिसे रावण छीन ले। वे सीता पर अपने आक्रमण को छिपाकर चोट को जबरन हरण का कारण बनाती हैं और एक ही प्रस्ताव में रावण को इच्छा तथा बदला दोनों देती हैं।",
          },
          visualCue: "The truthful battlefield account narrows into a distorted image of Sita as the proposed target.",
          characterIds: ["surpanakha", "ravana", "rama", "lakshmana", "sita"],
        },
      ],
    } satisfies StoryMoment,
  }),
  scene({
    id: "ravana-seeks-marichas-help",
    turnId: "golden-deer-plot",
    detailOrdinal: 2,
    title: { en: "Ravana seeks Maricha's help", hi: "रावण मारीच की सहायता माँगता है" },
    synopsis: {
      en: "Ravana privately chooses Surpanakha's proposal, crosses the coast to Maricha's retreat, misrepresents Rama as the aggressor, and asks Maricha to become a golden deer that will empty Sita's cottage.",
      hi: "रावण अकेले शूर्पणखा का प्रस्ताव चुनता है, समुद्र-तट पार कर मारीच के आश्रम पहुँचता है, राम को आक्रमणकारी बताकर कथा उलटता है और मारीच से स्वर्ण-मृग बनकर सीता की कुटिया खाली कराने को कहता है।",
    },
    sourceStart: 34,
    sourceEnd: 35,
    spanSha256s: [
      "40b48410aa3db3d64b2594bc7672404c3b97cef30a65883683824674181032de",
      "c5845dbc8eb6b0dffd074ac05c7dfef7c2e00facc631e080f2cf70fe31991361",
    ],
    nodeIds: ["ravana-maricha-road-story-world", "ravana", "maricha", "surpanakha", "rama", "sita", "lakshmana"],
    places: ["Ravana's road to Maricha", "Maricha's retreat", "Lanka"],
    moment: {
      id: "ravana-seeks-marichas-help",
      decisiveChange: {
        en: "Ravana turns a court suggestion into a deception requiring Maricha's body and skill.",
        hi: "रावण दरबार के सुझाव को ऐसी छल-योजना में बदलता है जिसमें मारीच का शरीर और कौशल चाहिए।",
      },
      beats: [
        {
          id: "ravana-chooses-the-plan-alone",
          title: { en: "Ravana chooses the plan alone", hi: "रावण अकेले योजना चुनता है" },
          narration: {
            en: "After dismissing the court, Ravana weighs the proposal and decides to act. He does not open the choice to Vibhishana or a wider council; he orders a chariot and leaves in disguise for the coast.",
            hi: "दरबार हटाने के बाद रावण प्रस्ताव पर विचार कर उसे लागू करने का निर्णय लेता है। वह विभीषण या व्यापक मंत्रणा के सामने विकल्प नहीं रखता; रथ मँगाकर वेश बदलता है और तट की ओर निकल पड़ता है।",
          },
          visualCue: "The council chamber empties before a single chariot leaves Lanka under secrecy.",
          characterIds: ["ravana", "vibhishana"],
        },
        {
          id: "the-coastal-road-hides-the-purpose",
          title: { en: "A beautiful road hides the purpose", hi: "सुंदर मार्ग उद्देश्य को छिपाता है" },
          narration: {
            en: "The route passes sea, groves, hermitages, towns, mountains, and places linked to Garuda's old deeds. The splendour does not cleanse the journey: Ravana is travelling through a living world toward a plan that will violate another home.",
            hi: "मार्ग समुद्र, उपवन, आश्रम, नगर, पर्वत और गरुड़ की पुरानी कथा से जुड़े स्थानों से गुजरता है। दृश्य की सुंदरता यात्रा का उद्देश्य नहीं बदलती—रावण एक जीवित संसार से होकर दूसरे के घर पर आघात करने जा रहा है।",
          },
          visualCue: "A richly varied coastline scrolls past a closed chariot whose purpose remains concealed.",
          characterIds: ["ravana", "garuda"],
        },
        {
          id: "maricha-receives-an-old-king",
          title: { en: "Maricha receives an old king", hi: "मारीच पुराने राजा का स्वागत करता है" },
          narration: {
            en: "Maricha now lives under restraint at a secluded retreat. He gives Ravana formal hospitality and asks why the king has returned so quickly, unaware that the visit will make his past violence the instrument of a new crime.",
            hi: "मारीच अब एकांत आश्रम में संयमित जीवन बिताता है। वह रावण का विधिवत स्वागत कर पूछता है कि राजा इतनी जल्दी फिर क्यों आया है, बिना जाने कि यह भेंट उसके पुराने हिंसक कौशल को नए अपराध का साधन बनाने वाली है।",
          },
          visualCue: "A sparse retreat receives the ornate chariot, placing Maricha's restraint beside Ravana's urgency.",
          characterIds: ["maricha", "ravana"],
        },
        {
          id: "ravana-assigns-the-golden-deer",
          title: { en: "Ravana assigns the golden deer", hi: "रावण स्वर्ण-मृग की भूमिका देता है" },
          narration: {
            en: "Ravana reports Janasthana but falsely paints Rama as vicious and unprovoked. He orders Maricha to appear as a silver-spotted golden deer so Sita will send the brothers after it, leaving Ravana to take her from an empty cottage.",
            hi: "रावण जनस्थान की बात बताता है, पर राम को बिना कारण हिंसा करने वाला बताकर कथा उलट देता है। वह मारीच को चाँदी के धब्बों वाला स्वर्ण-मृग बनने का आदेश देता है ताकि सीता भाइयों को उसके पीछे भेजें और खाली कुटिया से रावण उनका हरण कर सके।",
          },
          visualCue: "The proposed deer appears as a diagram between Ravana, Maricha, and the imagined empty cottage.",
          characterIds: ["ravana", "maricha", "rama", "sita", "lakshmana", "surpanakha"],
        },
      ],
    } satisfies StoryMoment,
  }),
  scene({
    id: "maricha-warns-ravana-twice",
    turnId: "golden-deer-plot",
    detailOrdinal: 3,
    title: { en: "Maricha warns Ravana twice", hi: "मारीच रावण को दो बार चेताते हैं" },
    synopsis: {
      en: "Maricha rejects Ravana's version of Rama, warns that abducting Sita will destroy Lanka, and supports the warning with two memories of surviving Rama's arrows—memories that still govern his dreams and daily life.",
      hi: "मारीच राम के बारे में रावण की उलटी कथा को अस्वीकार करते हैं, सीता-हरण से लंका के विनाश की चेतावनी देते हैं और राम के बाणों से दो बार बचने की स्मृतियों से अपनी बात सिद्ध करते हैं—वे स्मृतियाँ आज भी उनके सपनों और जीवन पर छाई हैं।",
    },
    sourceStart: 36,
    sourceEnd: 38,
    spanSha256s: [
      "f8ae6bed6fa2fa8ffee8f746687d4d5bb5519fce57af4142df353ce790f82039",
      "27a0aead92c348b7b6aff4d499c03dcb9c12754dfbae49843d035e6ce9b00b0f",
      "83c0479495ac1e1da7d871159b26d3c16e20e56b418f65965b9922aeef628b01",
    ],
    nodeIds: ["ravana-chooses-deception-event", "ravana-maricha-road-story-world", "maricha", "ravana", "rama", "sita", "vishvamitra", "lakshmana"],
    places: ["Maricha's retreat", "Siddhashrama", "Dandaka", "Lanka"],
    moment: {
      id: "maricha-warns-ravana-twice",
      decisiveChange: {
        en: "The proposed accomplice becomes the clearest witness against the plan.",
        hi: "जिसे साथी बनाना था वही योजना के विरुद्ध सबसे स्पष्ट साक्षी बन जाता है।",
      },
      beats: [
        {
          id: "unwelcome-truth-is-rare",
          title: { en: "Unwelcome truth is rare", hi: "अप्रिय सत्य दुर्लभ होता है" },
          narration: {
            en: "Maricha says pleasant speakers are common but people willing to give—and hear—painful useful counsel are rare. He corrects Ravana's claim: Rama was not expelled for vice, and the Janasthana force was not an innocent victim.",
            hi: "मारीच कहते हैं कि सुखद बातें कहने वाले बहुत मिलते हैं, पर कष्टदायक उपयोगी सलाह देने और सुनने वाले दुर्लभ हैं। वे रावण की कथा सुधारते हैं—राम दोष के कारण नहीं निकाले गए थे और जनस्थान की सेना निर्दोष पीड़ित नहीं थी।",
          },
          visualCue: "Maricha holds his ground as Ravana's distorted account breaks into its missing facts.",
          characterIds: ["maricha", "ravana", "rama", "surpanakha"],
        },
        {
          id: "sita-is-not-a-road-to-victory",
          title: { en: "Sita is not a road to victory", hi: "सीता विजय का मार्ग नहीं हैं" },
          narration: {
            en: "Maricha warns that Sita is not a prize Ravana can remove from consequence. Abduction will bring Rama to Lanka, destroy households along with the guilty, and make one ruler's obsession a calamity for people who did not choose it.",
            hi: "मारीच चेताते हैं कि सीता ऐसी वस्तु नहीं जिन्हें परिणाम से अलग छीन लिया जाए। हरण राम को लंका तक लाएगा, दोषियों के साथ घर-परिवार उजाड़ेगा और एक शासक की आसक्ति को उन लोगों की विपत्ति बना देगा जिन्होंने इसे नहीं चुना।",
          },
          visualCue: "The imagined empty cottage expands into a threatened city full of unrelated households.",
          characterIds: ["maricha", "ravana", "sita", "rama"],
        },
        {
          id: "a-young-rama-once-spared-maricha",
          title: { en: "A young Rama once spared Maricha", hi: "युवा राम ने एक बार मारीच को जीवित छोड़ा था" },
          narration: {
            en: "Maricha remembers attacking Vishvamitra's sacrifice in confidence. The young Rama's arrow hurled him across the sea but did not kill him; Maricha survived while his companions fell, learning that Rama's youth did not mean helplessness.",
            hi: "मारीच याद करते हैं कि वे आत्मविश्वास से विश्वामित्र के यज्ञ पर आक्रमण करने गए थे। युवा राम के बाण ने उन्हें समुद्र पार फेंक दिया पर मारा नहीं; साथी मारे गए और मारीच ने जाना कि कम आयु का अर्थ असहाय होना नहीं है।",
          },
          visualCue: "The quiet retreat gives way to the remembered sacrifice and one arrow carrying Maricha beyond the horizon.",
          characterIds: ["maricha", "rama", "vishvamitra"],
        },
        {
          id: "a-second-attack-ended-two-lives",
          title: { en: "A second attack ended two lives", hi: "दूसरे आक्रमण में दो साथी मारे गए" },
          narration: {
            en: "Maricha later returned to Dandaka in deer form with two companions and attacked again. Rama killed the other two; Maricha escaped and abandoned that predatory life for an ascetic retreat, but survival did not erase what he had done.",
            hi: "बाद में मारीच दो साथियों के साथ मृग-रूप में दण्डक लौटे और फिर आक्रमण किया। राम ने दोनों साथियों को मार दिया; मारीच बचकर हिंसक जीवन छोड़ आश्रम में रहने लगे, पर जीवित बचना उनके किए को मिटा नहीं सका।",
          },
          visualCue: "Three false deer rush a hermitage; only one shadow escapes the returning arrows.",
          characterIds: ["maricha", "rama"],
        },
        {
          id: "fear-now-fills-marichas-world",
          title: { en: "Fear now fills Maricha's world", hi: "भय अब मारीच की दुनिया भर देता है" },
          narration: {
            en: "Maricha says he sees Rama in trees, empty directions, dreams, and even words beginning with the same sound. His terror is not abstract praise of power but the lasting consequence of repeated violence, and he refuses to follow Ravana toward it again.",
            hi: "मारीच कहते हैं कि उन्हें वृक्षों, खाली दिशाओं, सपनों और समान ध्वनि से शुरू होने वाले शब्दों में भी राम दिखाई देते हैं। उनका भय शक्ति की अमूर्त प्रशंसा नहीं, बार-बार की हिंसा का स्थायी परिणाम है; वे रावण के साथ उसी ओर लौटने से इनकार करते हैं।",
          },
          visualCue: "The retreat multiplies with remembered bow-bearing silhouettes while Maricha refuses the road.",
          characterIds: ["maricha", "rama", "ravana"],
        },
      ],
    } satisfies StoryMoment,
  }),
  scene({
    id: "ravana-coerces-maricha",
    turnId: "golden-deer-plot",
    detailOrdinal: 4,
    title: { en: "Ravana coerces Maricha", hi: "रावण मारीच को विवश करता है" },
    synopsis: {
      en: "Ravana rejects advice he did not ask for, repeats the deception in greater detail, offers reward and threatens immediate death; Maricha warns once more, then agrees because every available path now appears fatal.",
      hi: "रावण उस सलाह को ठुकराता है जो उसने माँगी नहीं थी, छल-योजना को और विस्तार से दोहराता है, पुरस्कार देता है और तत्काल मृत्यु की धमकी भी; मारीच अंतिम बार चेताते हैं, फिर मानते हैं क्योंकि अब हर उपलब्ध मार्ग उन्हें मृत्यु की ओर जाता दिखता है।",
    },
    sourceStart: 39,
    sourceEnd: 41,
    spanSha256s: [
      "da8a59e3eef29867fb669f6c12d07c5f6b82f7a92dbdcecd88c2f4f5aadc7fc4",
      "2c13a0d2449d05326f4fdf3fce8ea4e262dc3f134e22bb3d8a9df1e518ae9956",
      "b5d36204c2d0c5256c3d54771d87fbd01d5418cc8f81fe3fdbc50fe2e42b6233",
    ],
    nodeIds: ["ravana-chooses-deception-event", "ravana-maricha-road-story-world", "ravana", "maricha", "rama", "sita", "lakshmana"],
    places: ["Maricha's retreat", "Ravana's road to Maricha", "Panchavati"],
    moment: {
      id: "ravana-coerces-maricha",
      decisiveChange: {
        en: "Counsel fails under a threat that converts cooperation into coerced participation.",
        hi: "धमकी सलाह को विफल कर सहयोग को जबरन भागीदारी में बदल देती है।",
      },
      beats: [
        {
          id: "ravana-rejects-the-right-to-advise",
          title: { en: "Ravana rejects the right to advise", hi: "रावण सलाह देने का अधिकार ठुकराता है" },
          narration: {
            en: "Ravana says Maricha was summoned to help, not to judge the plan. He invokes royal authority to demand agreeable speech, treating honest counsel as disrespect whenever it resists his settled desire.",
            hi: "रावण कहता है कि मारीच को योजना पर निर्णय देने नहीं, सहायता करने बुलाया गया है। वह राजसत्ता का सहारा लेकर केवल मनभावन बात चाहता है और अपनी तय इच्छा का विरोध करने वाली ईमानदार सलाह को अपमान मानता है।",
          },
          visualCue: "Ravana's seat and weapons crowd the small retreat as the space for counsel closes.",
          characterIds: ["ravana", "maricha"],
        },
        {
          id: "the-deception-gains-a-stolen-voice",
          title: { en: "The deception gains a stolen voice", hi: "छल में चुराई हुई आवाज जुड़ती है" },
          narration: {
            en: "Ravana now specifies that the deer must draw Rama far away and then cry out in Rama's voice. Sita will urge Lakshmana to follow, allowing Ravana to exploit trust, fear, and the brothers' concern for one another.",
            hi: "रावण अब कहता है कि मृग राम को दूर ले जाए और फिर राम की आवाज में पुकारे। सीता लक्ष्मण को भेजेंगी और रावण विश्वास, भय तथा भाइयों की आपसी चिंता का दुरुपयोग करके कुटिया खाली कराएगा।",
          },
          visualCue: "A false cry travels from the distant deer to the cottage, splitting the three family positions.",
          characterIds: ["ravana", "maricha", "rama", "sita", "lakshmana"],
        },
        {
          id: "reward-and-death-frame-the-choice",
          title: { en: "Reward and death frame the choice", hi: "पुरस्कार और मृत्यु विकल्प को घेरते हैं" },
          narration: {
            en: "Ravana offers half his kingdom after success, then says refusal means death by his hand while obedience risks Rama's arrow. The offer is not free consent: Maricha must choose between an immediate execution and a deadly role in another man's crime.",
            hi: "रावण सफलता पर आधा राज्य देने की बात करता है, फिर कहता है कि इनकार पर वह स्वयं मार देगा जबकि मानने पर राम का बाण सामने होगा। यह स्वतंत्र सहमति नहीं है—मारीच को तत्काल हत्या और दूसरे के अपराध में घातक भूमिका के बीच चुनना है।",
          },
          visualCue: "A crown and a raised weapon form two sides of the same narrowing path around Maricha.",
          characterIds: ["ravana", "maricha", "rama"],
        },
        {
          id: "maricha-agrees-without-believing",
          title: { en: "Maricha agrees without believing", hi: "मारीच बिना विश्वास के मानते हैं" },
          narration: {
            en: "Maricha again predicts the destruction of Ravana, Lanka, and people who had no part in the decision. He finally agrees, not because the warning was answered, but because Ravana has removed every safe refusal; the two leave together for Panchavati.",
            hi: "मारीच फिर रावण, लंका और निर्णय में शामिल न रहे लोगों के विनाश की भविष्यवाणी करते हैं। अंत में वे इसलिए मानते हैं कि चेतावनी का उत्तर मिल गया, ऐसा नहीं; रावण ने सुरक्षित इनकार का हर मार्ग बंद कर दिया है। दोनों पंचवटी की ओर निकलते हैं।",
          },
          visualCue: "Maricha boards the chariot under watch, carrying the certainty that the road does not end in safety.",
          characterIds: ["maricha", "ravana"],
        },
      ],
    } satisfies StoryMoment,
  }),
  scene({
    id: "golden-deer-reaches-panchavati",
    turnId: "golden-deer-plot",
    detailOrdinal: 5,
    title: { en: "The golden deer reaches Panchavati", hi: "स्वर्ण-मृग पंचवटी पहुँचता है" },
    synopsis: {
      en: "Ravana and Maricha reach the cottage; Maricha becomes an impossible jewelled deer, draws Sita's attention, survives Lakshmana's warning as Rama chooses pursuit, and leaves Lakshmana responsible for the home.",
      hi: "रावण और मारीच कुटिया तक पहुँचते हैं; मारीच असंभव रत्न-जटित मृग बनकर सीता का ध्यान खींचते हैं, लक्ष्मण की चेतावनी के बावजूद राम पीछा करने का निर्णय लेते हैं और घर की रक्षा लक्ष्मण को सौंपते हैं।",
    },
    sourceStart: 42,
    sourceEnd: 42,
    spanSha256s: ["a8462f415f5a4c60109581129d281d85b2a077e061cacae1449aac1d44a5ef50"],
    nodeIds: ["golden-deer-separates-house-event", "golden-deer-path-story-world", "maricha", "ravana", "sita", "rama", "lakshmana", "jatayu"],
    places: ["Panchavati", "The cottage at Panchavati", "The golden deer path"],
    moment: {
      id: "golden-deer-reaches-panchavati",
      decisiveChange: {
        en: "A coerced performance enters the household and persuades Rama to cross its protective boundary.",
        hi: "जबरन कराया गया अभिनय घर में प्रवेश कर राम को उसकी सुरक्षा-सीमा पार करने के लिए राजी कर लेता है।",
      },
      beats: [
        {
          id: "maricha-becomes-the-impossible-deer",
          title: { en: "Maricha becomes the impossible deer", hi: "मारीच असंभव मृग बनते हैं" },
          narration: {
            en: "At the edge of the cottage, Maricha takes a form of gold, silver spots, jewel-like horns, and shifting colour. He approaches, retreats, grazes, and circles so that wonder appears natural while every movement serves the plan.",
            hi: "कुटिया के पास मारीच सोने, चाँदी के धब्बों, रत्न जैसे सींगों और बदलते रंगों वाला रूप लेते हैं। वे पास आते, हटते, चरते और चक्कर लगाते हैं ताकि आश्चर्य स्वाभाविक लगे, जबकि हर गति योजना का हिस्सा है।",
          },
          visualCue: "The deer alternates between grove and clearing while Ravana remains hidden beyond the household's sight.",
          characterIds: ["maricha", "ravana"],
        },
        {
          id: "sita-calls-the-brothers-to-see",
          title: { en: "Sita calls the brothers to see", hi: "सीता भाइयों को देखने बुलाती हैं" },
          narration: {
            en: "While gathering flowers, Sita sees a creature unlike anything in the forest and calls Rama and Lakshmana. She wants it alive if possible, imagining it as a wonder to carry home after exile, and admits that the wish has overtaken her usual restraint.",
            hi: "फूल चुनते समय सीता वन में कभी न देखा जीव देखकर राम और लक्ष्मण को बुलाती हैं। वे संभव हो तो उसे जीवित चाहती हैं, वनवास के बाद घर ले जाने योग्य आश्चर्य की तरह सोचती हैं और मानती हैं कि यह इच्छा उनके सामान्य संयम से आगे निकल गई है।",
          },
          visualCue: "Sita's flower basket lowers as the deer holds her gaze between the cottage and grove.",
          characterIds: ["sita", "rama", "lakshmana", "maricha"],
        },
        {
          id: "lakshmana-names-maricha",
          title: { en: "Lakshmana names Maricha", hi: "लक्ष्मण मारीच को पहचानते हैं" },
          narration: {
            en: "Lakshmana says no earthly deer has such a body and identifies Maricha's known method of using animal forms against forest travellers. His warning is specific and correct, but beauty and the apparent opportunity make certainty difficult to hold.",
            hi: "लक्ष्मण कहते हैं कि धरती के किसी मृग का ऐसा शरीर नहीं होता और वन-यात्रियों के विरुद्ध पशु-रूप अपनाने की मारीच की पुरानी चाल पहचानते हैं। उनकी चेतावनी स्पष्ट और सही है, पर सौंदर्य और अवसर का भ्रम उस सत्य को थामना कठिन बना देता है।",
          },
          visualCue: "Lakshmana traces the impossible features while the deer keeps just beyond reach.",
          characterIds: ["lakshmana", "maricha", "rama", "sita"],
        },
        {
          id: "rama-decides-to-pursue",
          title: { en: "Rama decides to pursue", hi: "राम पीछा करने का निर्णय लेते हैं" },
          narration: {
            en: "Rama accepts that the deer may be Maricha, yet concludes that this would itself justify killing the attacker. Sita's wish, the creature's beauty, and Rama's confidence converge into a decision to follow it rather than preserve the household formation.",
            hi: "राम मानते हैं कि मृग मारीच हो सकता है, फिर भी सोचते हैं कि तब भी उस आक्रमणकारी को मारना उचित होगा। सीता की इच्छा, जीव का सौंदर्य और राम का आत्मविश्वास मिलकर घर की संयुक्त सुरक्षा बनाए रखने के बजाय पीछा करने का निर्णय बनाते हैं।",
          },
          visualCue: "Rama takes up his bow as the deer opens a path away from the cottage.",
          characterIds: ["rama", "sita", "lakshmana", "maricha"],
        },
        {
          id: "lakshmana-is-left-with-the-home",
          title: { en: "Lakshmana is left with the home", hi: "घर की रक्षा लक्ष्मण को सौंपी जाती है" },
          narration: {
            en: "Before leaving, Rama tells Lakshmana to remain alert with Sita and invokes Jatayu as another nearby guardian. The scene ends at the first separation: Rama follows the deer while the cottage still holds, unaware that the plan depends on breaking the remaining pair apart too.",
            hi: "जाने से पहले राम लक्ष्मण को सीता के साथ सतर्क रहने को कहते हैं और पास के रक्षक के रूप में जटायु का भी स्मरण करते हैं। दृश्य पहली जुदाई पर रुकता है—राम मृग के पीछे जाते हैं, कुटिया अभी सुरक्षित है और किसी को नहीं मालूम कि योजना शेष जोड़ी को भी अलग करने पर टिकी है।",
          },
          visualCue: "Rama crosses into the deer path while Lakshmana and Sita remain framed by the cottage threshold.",
          characterIds: ["rama", "lakshmana", "sita", "maricha", "jatayu"],
        },
      ],
    } satisfies StoryMoment,
  }),
];
