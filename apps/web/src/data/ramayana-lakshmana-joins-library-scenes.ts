import type { StoryMoment } from "@/lib/domain/story-world";
import type { RamayanaLibraryScene } from "./ramayana-thin-turn-library-scenes";

const commonNodes = [
  "lakshmana-joins-event",
  "ayodhya",
  "forest-exile",
  "lakshmana",
  "rama",
  "sita",
  "kausalya",
  "king-dasharatha",
];

export const RAMAYANA_LAKSHMANA_JOINS_LIBRARY_SCENES: RamayanaLibraryScene[] = [
  {
    id: "lakshmana-chooses-exile",
    turnId: "exile-accepted",
    detailOrdinal: 4,
    title: { en: "Lakshmana chooses exile", hi: "लक्ष्मण वनवास चुनते हैं" },
    synopsis: {
      en: "After hearing Sita win her place on the road, Lakshmana asks to join, defines the work he will do, answers Rama's concern for those left behind, and is sent to retrieve the family's entrusted weapons.",
      hi: "सीता को अपने लिए वन-मार्ग चुनते सुनकर लक्ष्मण साथ चलने की अनुमति माँगते हैं, अपना काम बताते हैं, पीछे छूटने वालों की चिंता का उत्तर देते हैं और परिवार के सुरक्षित रखे शस्त्र लेने भेजे जाते हैं।",
    },
    sourceStart: 31,
    sourceEnd: 31,
    sourceGlobalOrdinal: 106,
    spanSha256s: ["c7e1692d5d077a6cde1998b56db351d31e5d657551ce6072ebeeebf5af7a0ecf"],
    nodeIds: commonNodes,
    places: ["Sita's chamber", "Ayodhya palace", "royal armoury"],
    moment: {
      id: "lakshmana-chooses-exile",
      decisiveChange: {
        en: "The couple's departure becomes a three-person commitment with practical roles.",
        hi: "दंपति का प्रस्थान व्यावहारिक भूमिकाओं वाली तीन लोगों की प्रतिबद्धता बन जाता है।",
      },
      beats: [
        {
          id: "lakshmana-takes-hold-of-ramas-feet",
          title: { en: "Lakshmana asks not to be left", hi: "लक्ष्मण पीछे न छोड़े जाने की विनती करते हैं" },
          narration: {
            en: "Lakshmana hears the decision and takes hold of Rama's feet. He does not ask for a place of honour; he asks not to remain in Ayodhya while Rama and Sita face the forest without him.",
            hi: "निर्णय सुनकर लक्ष्मण राम के चरण पकड़ लेते हैं। वे सम्मान की जगह नहीं माँगते; वे केवल यह चाहते हैं कि राम और सीता वन का सामना करें तो उन्हें अयोध्या में पीछे न छोड़ा जाए।",
          },
          visualCue: "Lakshmana kneels between the prepared palace room and the open road beyond it.",
          characterIds: ["lakshmana", "rama", "sita"],
        },
        {
          id: "lakshmana-defines-the-work",
          title: { en: "He defines the work", hi: "वे अपना काम स्पष्ट करते हैं" },
          narration: {
            en: "He offers to walk ahead with bow in hand, find roots and fruit, prepare each stopping place, and keep watch while Rama and Sita rest. Companionship is translated into daily labour rather than a dramatic declaration alone.",
            hi: "वे धनुष लेकर आगे चलने, कंद-मूल और फल जुटाने, हर पड़ाव तैयार करने तथा राम और सीता के विश्राम के समय पहरा देने का प्रस्ताव रखते हैं। साथ चलना केवल भावुक घोषणा नहीं, रोजमर्रा के श्रम में बदलता है।",
          },
          visualCue: "The imagined forest road fills with small tasks: scouting, gathering, shelter, water, and watch.",
          characterIds: ["lakshmana", "rama", "sita"],
        },
        {
          id: "rama-tests-the-duty-left-behind",
          title: { en: "Rama asks about those left behind", hi: "राम पीछे छूटने वालों की बात पूछते हैं" },
          narration: {
            en: "Rama reminds Lakshmana that Kausalya and Sumitra will remain inside a household transformed by Bharata's return. Lakshmana answers that provision and allies already exist for both mothers; his presence in the forest need not mean abandoning them.",
            hi: "राम याद दिलाते हैं कि कौसल्या और सुमित्रा ऐसे राजघराने में रहेंगी जो भरत की वापसी से बदल जाएगा। लक्ष्मण बताते हैं कि दोनों माताओं के लिए साधन और सहायक मौजूद हैं; वन में जाना उनका परित्याग करना नहीं होगा।",
          },
          visualCue: "The road pauses beside remembered images of Kausalya, Sumitra, and the households that will support them.",
          characterIds: ["rama", "lakshmana", "kausalya", "sumitra", "bharata"],
        },
        {
          id: "weapons-are-retrieved-for-the-road",
          title: { en: "The entrusted weapons are retrieved", hi: "सुरक्षित शस्त्र यात्रा के लिए लाए जाते हैं" },
          narration: {
            en: "Rama accepts Lakshmana's choice and sends him for the two bows, armour, swords, and inexhaustible quivers entrusted to the household after the Mithila wedding. Lakshmana returns with them, turning intention into readiness.",
            hi: "राम लक्ष्मण का निर्णय स्वीकार कर उन्हें मिथिला-विवाह के बाद सुरक्षित रखे दो धनुष, कवच, तलवारें और अक्षय तरकश लेने भेजते हैं। लक्ष्मण उन्हें लेकर लौटते हैं और इच्छा को वास्तविक तैयारी में बदल देते हैं।",
          },
          visualCue: "Wedding-era weapons are unwrapped from storage and placed beside plain travel bundles.",
          characterIds: ["rama", "lakshmana", "sita", "king-janaka"],
        },
      ],
    } satisfies StoryMoment,
  },
  {
    id: "wealth-and-weapons-leave-the-palace",
    turnId: "exile-accepted",
    detailOrdinal: 5,
    title: { en: "Wealth and weapons leave the palace", hi: "धन और शस्त्र महल से बाहर जाते हैं" },
    synopsis: {
      en: "Rama and Sita distribute possessions across teachers, dependants, workers, friends, and people in need; then the three carry only weapons and travel necessities through a city beginning to understand that the coronation has vanished.",
      hi: "राम और सीता अपनी संपत्ति गुरुजनों, आश्रितों, कामगारों, मित्रों और जरूरतमंद लोगों में बाँटते हैं; फिर तीनों केवल शस्त्र और यात्रा-सामग्री लेकर उस नगर से गुजरते हैं जिसे अब समझ आने लगता है कि राज्याभिषेक समाप्त हो चुका है।",
    },
    sourceStart: 32,
    sourceEnd: 33,
    sourceGlobalOrdinal: 107,
    spanSha256s: [
      "c6494cf0b7843f4d94a418fc0e0cf8236672550594c676612a2e2a5068d01e3e",
      "eb4661142e44a6342a062a7715423878fe7ef3a9b08cba5653fa6d2b54250d7b",
    ],
    nodeIds: commonNodes,
    places: ["Ayodhya palace", "public roads", "royal armoury"],
    moment: {
      id: "wealth-and-weapons-leave-the-palace",
      decisiveChange: {
        en: "The resources of a coming reign are redistributed while three travellers retain only what the road requires.",
        hi: "आने वाले शासन के साधन बाँट दिए जाते हैं और तीन यात्री केवल मार्ग की आवश्यक वस्तुएँ रखते हैं।",
      },
      beats: [
        {
          id: "suyajna-is-called-from-the-fire",
          title: { en: "Suyajna is called from the fire", hi: "सुयज्ञ को अग्निशाला से बुलाया जाता है" },
          narration: {
            en: "Lakshmana first invites Suyajna, the family priest's son, from his sacrificial chamber. Rama and Sita honour him and his wife with ornaments, clothing, animals, and goods that had been prepared for a very different future.",
            hi: "लक्ष्मण पहले कुलपुरोहित के पुत्र सुयज्ञ को अग्निशाला से बुलाते हैं। राम और सीता उनका तथा उनकी पत्नी का आभूषण, वस्त्र, पशु और उन वस्तुओं से सम्मान करते हैं जो एक बिल्कुल अलग भविष्य के लिए रखी गई थीं।",
          },
          visualCue: "Gifts meant for palace continuity cross from the royal chamber into the priestly household.",
          characterIds: ["lakshmana", "rama", "sita", "suyajna"],
        },
        {
          id: "possession-becomes-provision",
          title: { en: "Possession becomes provision", hi: "संपत्ति सहारे में बदलती है" },
          narration: {
            en: "Teachers, students, attendants, charioteers, dependants, and long-serving workers receive cattle, money, ornaments, clothing, and enough support for the years ahead. The distribution is unequal and royal in scale, but it acknowledges lives tied to the departing household.",
            hi: "गुरु, विद्यार्थी, सेवक, सारथी, आश्रित और लंबे समय से काम करने वाले लोगों को पशु, धन, आभूषण, वस्त्र और आने वाले वर्षों के लिए सहारा मिलता है। वितरण राजसी और असमान व्यवस्था के भीतर है, फिर भी वह प्रस्थान करने वाले घर से जुड़े जीवनों को पहचानता है।",
          },
          visualCue: "Different palace and city households receive provisions marked for the long absence ahead.",
          characterIds: ["rama", "sita", "lakshmana", "sumantra"],
        },
        {
          id: "the-poor-brahmin-tests-the-gift",
          title: { en: "An old staff measures a gift", hi: "वृद्ध की लाठी उपहार की सीमा नापती है" },
          narration: {
            en: "An elderly poor Brahmin named Trijata arrives with his family in need. Rama playfully asks him to throw his staff and grants the cattle standing as far as it lands, then reassures him that the challenge was meant to reveal strength, not mock poverty.",
            hi: "त्रिजट नामक वृद्ध निर्धन ब्राह्मण अपने जरूरतमंद परिवार के साथ आते हैं। राम उनसे लाठी फेंकने को कहते हैं और जहाँ तक वह गिरती है वहाँ तक के पशु दे देते हैं, फिर स्पष्ट करते हैं कि परीक्षा उनकी शक्ति दिखाने के लिए थी, गरीबी का उपहास करने के लिए नहीं।",
          },
          visualCue: "A worn staff arcs across the cattle ground while the old man's family watches its landing.",
          characterIds: ["rama", "trijata-brahmin"],
        },
        {
          id: "three-carry-what-cannot-be-given-away",
          title: { en: "Three carry what the road requires", hi: "तीनों मार्ग की आवश्यक वस्तुएँ उठाते हैं" },
          narration: {
            en: "With distribution complete, Rama and Lakshmana take the bows, swords, armour, and tools while attendants carry little else. Sita walks with them; wealth moves outward as responsibility for the dangerous road stays close.",
            hi: "वितरण पूरा होने पर राम और लक्ष्मण धनुष, तलवार, कवच और उपयोगी औजार उठाते हैं, जबकि साथ चलने वाले बहुत कम सामान रखते हैं। सीता उनके साथ हैं; धन बाहर बाँट दिया गया है और कठिन मार्ग की जिम्मेदारी पास रहती है।",
          },
          visualCue: "Open storerooms stand behind compact gear, wreath-decked weapons, and three departing figures.",
          characterIds: ["rama", "sita", "lakshmana"],
        },
        {
          id: "the-city-sees-the-lost-coronation",
          title: { en: "The city sees the lost coronation", hi: "नगर खोया हुआ राज्याभिषेक देखता है" },
          narration: {
            en: "Citizens climb roofs and crowd roads expecting royal procession but see the intended heir walking toward exile with Sita and Lakshmana. Admiration turns into grief and open criticism of the decision made inside the palace.",
            hi: "नागरिक छतों और मार्गों पर राजसी जुलूस देखने आते हैं, पर भावी राजा को सीता और लक्ष्मण के साथ वनवास की ओर पैदल जाते देखते हैं। प्रशंसा शोक और महल के भीतर हुए निर्णय की खुली आलोचना में बदल जाती है।",
          },
          visualCue: "Decorated balconies overlook three travellers where a coronation procession should have been.",
          characterIds: ["rama", "sita", "lakshmana", "ayodhya-citizens"],
        },
      ],
    } satisfies StoryMoment,
  },
  {
    id: "rama-faces-dasharatha-again",
    turnId: "exile-accepted",
    detailOrdinal: 6,
    title: { en: "Rama faces Dasharatha again", hi: "राम फिर दशरथ के सामने आते हैं" },
    synopsis: {
      en: "Rama asks leave from the father who cannot bear to see him go, refuses a last invitation to seize or delay the kingdom, seeks provision for dependants, and listens as Sumantra openly challenges Kaikeyi's decision.",
      hi: "राम उस पिता से विदा माँगते हैं जो उन्हें जाते नहीं देख पा रहे, राज्य छीनने या एक रात रुकने का अंतिम प्रस्ताव ठुकराते हैं, आश्रितों के लिए सहायता माँगते हैं और सुमंत्र को कैकेयी के निर्णय का खुला विरोध करते सुनते हैं।",
    },
    sourceStart: 34,
    sourceEnd: 35,
    sourceGlobalOrdinal: 109,
    spanSha256s: [
      "3982739d94026626b5d92af1d707946693ff01ac272cc3cfcb4355ab3aa0c7c8",
      "47bce8f4f934da99860e895fa7a2fc3c488f1f71eb1acc8ca8acadea3f3d5ce0",
    ],
    nodeIds: commonNodes,
    places: ["The darkened royal chamber", "Ayodhya palace"],
    moment: {
      id: "rama-faces-dasharatha-again",
      decisiveChange: {
        en: "A king's helpless grief and a son's fixed decision meet in public farewell.",
        hi: "राजा का असहाय शोक और पुत्र का अटल निर्णय सार्वजनिक विदाई में आमने-सामने आते हैं।",
      },
      beats: [
        {
          id: "sumantra-announces-the-three",
          title: { en: "Sumantra announces the three", hi: "सुमंत्र तीनों के आने की सूचना देते हैं" },
          narration: {
            en: "Rama asks Sumantra to announce them. The charioteer finds Dasharatha sunk in grief, surrounded by queens, and brings Rama, Sita, and Lakshmana into a chamber where every witness knows the road is near.",
            hi: "राम सुमंत्र से उनके आने की सूचना देने को कहते हैं। सारथी दशरथ को रानियों के बीच शोक में डूबा पाते हैं और राम, सीता तथा लक्ष्मण को ऐसे कक्ष में लाते हैं जहाँ हर साक्षी जानता है कि प्रस्थान निकट है।",
          },
          visualCue: "The three enter a crowded chamber centred on a king unable to rise steadily.",
          characterIds: ["sumantra", "king-dasharatha", "rama", "sita", "lakshmana"],
        },
        {
          id: "dasharatha-offers-resistance-and-delay",
          title: { en: "Dasharatha offers resistance and delay", hi: "दशरथ विरोध और विलंब का प्रस्ताव देते हैं" },
          narration: {
            en: "Dasharatha tells Rama to disregard him, take the kingdom by force, or at least remain one night so father and son can see each other. The offers expose a king who wants escape from the consequence of his own promise.",
            hi: "दशरथ राम से कहते हैं कि वे उनकी बात न मानें, बल से राज्य ले लें या कम से कम एक रात रुकें ताकि पिता-पुत्र एक-दूसरे को देख सकें। ये प्रस्ताव अपने ही वचन के परिणाम से बचना चाहने वाले राजा की असहायता दिखाते हैं।",
          },
          visualCue: "A crown, a night lamp, and the road form three impossible alternatives before Rama.",
          characterIds: ["king-dasharatha", "rama"],
        },
        {
          id: "rama-refuses-a-delayed-truth",
          title: { en: "Rama refuses a delayed truth", hi: "राम टले हुए सत्य को अस्वीकार करते हैं" },
          narration: {
            en: "Rama refuses both seizure and delay. One more night of palace comfort would deepen attachment without changing the command; he asks instead for permission to leave with Sita and Lakshmana and for care of those dependent on them.",
            hi: "राम राज्य छीनने और रुकने दोनों से इनकार करते हैं। महल की एक और रात लगाव बढ़ाएगी, आदेश नहीं बदलेगा; वे सीता और लक्ष्मण के साथ जाने की अनुमति तथा अपने आश्रितों की देखभाल माँगते हैं।",
          },
          visualCue: "Rama turns from the waiting bed and crown toward the practical list of people needing support.",
          characterIds: ["rama", "king-dasharatha", "sita", "lakshmana"],
        },
        {
          id: "sumantra-rebukes-kaikeyi",
          title: { en: "Sumantra rebukes Kaikeyi", hi: "सुमंत्र कैकेयी को फटकारते हैं" },
          narration: {
            en: "Unable to contain himself, Sumantra tells Kaikeyi that the decision has broken Dasharatha, outraged the city, and may drive away the people whose trust sustains a kingdom. A court servant says openly what the king cannot.",
            hi: "स्वयं को रोक न पाकर सुमंत्र कैकेयी से कहते हैं कि इस निर्णय ने दशरथ को तोड़ दिया, नगर को क्रोधित किया और उन लोगों को दूर कर सकता है जिनके विश्वास पर राज्य टिका है। एक राजसेवक वह बात खुलकर कहता है जो राजा नहीं कह पा रहा।",
          },
          visualCue: "Sumantra steps between the silent king and Kaikeyi as the watching court holds its breath.",
          characterIds: ["sumantra", "kaikeyi", "king-dasharatha", "rama"],
        },
        {
          id: "kaikeyi-does-not-withdraw",
          title: { en: "Kaikeyi does not withdraw", hi: "कैकेयी अपना निर्णय वापस नहीं लेतीं" },
          narration: {
            en: "Sumantra invokes Kaikeyi's family and the danger of repeating inherited hardness, but the rebuke does not reverse her demand. The story remains inside a failed intervention: moral force is spoken, heard, and still unable to stop departure.",
            hi: "सुमंत्र कैकेयी के परिवार और विरासत में मिली कठोरता दोहराने के खतरे का उल्लेख करते हैं, पर उनकी फटकार माँग नहीं बदलती। कथा एक विफल हस्तक्षेप के भीतर रहती है—नैतिक विरोध बोला और सुना जाता है, फिर भी प्रस्थान नहीं रुकता।",
          },
          visualCue: "The plea fills the chamber but the prepared road remains unchanged beyond its doors.",
          characterIds: ["sumantra", "kaikeyi", "rama", "king-dasharatha"],
        },
      ],
    } satisfies StoryMoment,
  },
  {
    id: "retinue-is-refused-bark-is-demanded",
    turnId: "exile-accepted",
    detailOrdinal: 7,
    title: { en: "The retinue is refused; bark is demanded", hi: "दल ठुकराया जाता है, वल्कल माँगा जाता है" },
    synopsis: {
      en: "Dasharatha tries to send army, merchants, entertainers, wealth, and supplies; Kaikeyi fears an emptied kingdom, Rama refuses to carry the palace into exile, and the arrival of bark garments exposes Sita to a demand the elders contest.",
      hi: "दशरथ सेना, व्यापारी, कलाकार, धन और सामग्री भेजना चाहते हैं; कैकेयी खाली राज्य से डरती हैं, राम महल को वनवास में ले जाने से इनकार करते हैं और वल्कल आने पर सीता ऐसी माँग के सामने खड़ी होती हैं जिसका बुजुर्ग विरोध करते हैं।",
    },
    sourceStart: 36,
    sourceEnd: 38,
    sourceGlobalOrdinal: 111,
    spanSha256s: [
      "fcb5d6addbb476a9057114d2228eb297cd944c9910c29a8746f96df782abdc05",
      "bb45fada135c5267d69f86e8dda6d5a0ebfed0c3f40364770f93cb475627d9ad",
      "ecb547a916e1e0326a028d471b18cb18137bf3eac0d4ebc3e27febdc6f63b6f1",
    ],
    nodeIds: commonNodes,
    places: ["The darkened royal chamber", "Ayodhya palace", "roads from Ayodhya"],
    moment: {
      id: "retinue-is-refused-bark-is-demanded",
      decisiveChange: {
        en: "Attempts to soften exile reveal a struggle over whether it will remain exile at all—and who must visibly bear it.",
        hi: "वनवास को आसान बनाने के प्रयास इस संघर्ष को उजागर करते हैं कि वह वनवास रहेगा भी या नहीं—और उसका दृश्य भार किसे उठाना होगा।",
      },
      beats: [
        {
          id: "dasharatha-orders-a-moving-kingdom",
          title: { en: "Dasharatha orders a moving kingdom", hi: "दशरथ चलता हुआ राज्य भेजना चाहते हैं" },
          narration: {
            en: "Dasharatha orders army, merchants, performers, hunters, servants, carts, wealth, grain, and tools to accompany Rama. If he cannot cancel exile, he tries to wrap royal infrastructure around it.",
            hi: "दशरथ सेना, व्यापारी, कलाकार, शिकारी, सेवक, रथ, धन, अनाज और औजार राम के साथ भेजने का आदेश देते हैं। वनवास रद्द नहीं कर सकते तो उसके चारों ओर राजसी व्यवस्था खड़ी करना चाहते हैं।",
          },
          visualCue: "A vast caravan assembles on paper around three travellers who had prepared to leave lightly.",
          characterIds: ["king-dasharatha", "rama", "sita", "lakshmana"],
        },
        {
          id: "kaikeyi-fears-an-empty-crown",
          title: { en: "Kaikeyi fears an empty crown", hi: "कैकेयी खाली मुकुट से डरती हैं" },
          narration: {
            en: "Kaikeyi protests that sending Ayodhya's people and resources with Rama would leave Bharata a hollow kingdom. Her demand was for power transferred intact, not a title after loyalty and capacity have followed the exiled heir.",
            hi: "कैकेयी विरोध करती हैं कि अयोध्या के लोग और साधन राम के साथ चले गए तो भरत को खोखला राज्य मिलेगा। उनकी माँग केवल उपाधि नहीं, निष्ठा और क्षमता सहित अक्षुण्ण सत्ता के हस्तांतरण की थी।",
          },
          visualCue: "The imagined caravan drains colour from the throne waiting for Bharata.",
          characterIds: ["kaikeyi", "bharata", "rama", "king-dasharatha"],
        },
        {
          id: "rama-refuses-to-carry-the-palace",
          title: { en: "Rama refuses to carry the palace", hi: "राम महल को साथ ले जाने से इनकार करते हैं" },
          narration: {
            en: "Rama says a full retinue would make renunciation meaningless, like keeping an elephant's tether after giving up the elephant. He asks only for forest tools and bark clothing appropriate to the life being imposed.",
            hi: "राम कहते हैं कि पूरा राजदल साथ ले जाना त्याग को अर्थहीन बना देगा, जैसे हाथी छोड़कर उसकी जंजीर सँभालना। वे केवल वन-जीवन के औजार और उसी जीवन के अनुरूप वल्कल माँगते हैं।",
          },
          visualCue: "The large caravan dissolves until axes, baskets, bows, and folded bark remain.",
          characterIds: ["rama", "king-dasharatha", "kaikeyi"],
        },
        {
          id: "sita-does-not-know-how-to-wear-bark",
          title: { en: "Sita does not know how to wear bark", hi: "सीता वल्कल पहनना नहीं जानतीं" },
          narration: {
            en: "Kaikeyi produces bark garments. Rama and Lakshmana put them on, but Sita stands confused, still in fine dress, asking how the rough cloth is worn. Rama ties it over her clothing while the chamber erupts in protest.",
            hi: "कैकेयी वल्कल लाती हैं। राम और लक्ष्मण उन्हें पहन लेते हैं, पर सुंदर वस्त्रों में खड़ी सीता नहीं जानतीं कि खुरदरा कपड़ा कैसे बाँधा जाए। राम उसे उनके वस्त्रों के ऊपर बाँधते हैं और कक्ष विरोध से भर उठता है।",
          },
          visualCue: "Sita holds the unfamiliar bark cloth while elders and attendants react around her.",
          characterIds: ["sita", "rama", "lakshmana", "kaikeyi"],
        },
        {
          id: "vasishta-contests-sitas-burden",
          title: { en: "Vasishta contests Sita's burden", hi: "वसिष्ठ सीता पर डाले भार का विरोध करते हैं" },
          narration: {
            en: "Vasishta declares that Sita was not named in the exile demand and should not be stripped of possessions or dignity. Dasharatha agrees she may carry clothing and ornaments; Sita chooses the road, but the court refuses to pretend every added hardship was required.",
            hi: "वसिष्ठ कहते हैं कि वनवास की माँग में सीता का नाम नहीं था और उनसे संपत्ति या गरिमा छीनना उचित नहीं। दशरथ सहमत होते हैं कि वे वस्त्र और आभूषण ले जा सकती हैं; सीता मार्ग चुनती हैं, पर दरबार हर अतिरिक्त कष्ट को अनिवार्य मानने से इनकार करता है।",
          },
          visualCue: "Vasishta steps forward as Sita stands between chosen departure and an unnecessary imposed humiliation.",
          characterIds: ["vasishta", "sita", "king-dasharatha", "kaikeyi", "rama"],
        },
      ],
    } satisfies StoryMoment,
  },
  {
    id: "three-take-the-last-blessings",
    turnId: "exile-accepted",
    detailOrdinal: 8,
    title: { en: "Three take the last blessings", hi: "तीनों अंतिम आशीर्वाद लेते हैं" },
    synopsis: {
      en: "Dasharatha collapses into regret, the three bow to him and the royal mothers, Sumitra gives Lakshmana a demanding map of loyalty, Sita receives the women's farewell, and the family finally turns toward the gate.",
      hi: "दशरथ पछतावे में टूटते हैं, तीनों उन्हें और राजमाताओं को प्रणाम करते हैं, सुमित्रा लक्ष्मण को निष्ठा का कठोर मार्ग देती हैं, सीता स्त्रियों से विदा लेती हैं और परिवार अंततः द्वार की ओर मुड़ता है।",
    },
    sourceStart: 39,
    sourceEnd: 40,
    sourceGlobalOrdinal: 114,
    spanSha256s: [
      "b6622c6fed83e47966b33ebf4c10e93e02113f178f8848cc52c66964362cfb47",
      "0952769a8705a0c029e7ff9c1e9dc3d0677e92fa09656bf82c911f7a196c2af9",
    ],
    nodeIds: commonNodes,
    places: ["The darkened royal chamber", "Ayodhya palace", "Ayodhya gate"],
    moment: {
      id: "three-take-the-last-blessings",
      decisiveChange: {
        en: "Argument ends not in agreement but in irreversible family departure.",
        hi: "विवाद सहमति में नहीं, अपरिवर्तनीय पारिवारिक प्रस्थान में समाप्त होता है।",
      },
      beats: [
        {
          id: "dasharatha-collapses-before-the-bark",
          title: { en: "Dasharatha collapses before the bark", hi: "वल्कल देखकर दशरथ टूट जाते हैं" },
          narration: {
            en: "Seeing Rama dressed for exile, Dasharatha loses consciousness. When he wakes, he blames his own promise, imagines past wrongdoing returning as consequence, and cannot reconcile kingship with the sight of his son leaving.",
            hi: "राम को वनवासी वस्त्रों में देखकर दशरथ अचेत हो जाते हैं। होश आने पर वे अपने वचन को दोष देते हैं, पुराने कर्म को लौटते परिणाम की तरह याद करते हैं और पुत्र के प्रस्थान को अपने राजधर्म से जोड़ नहीं पाते।",
          },
          visualCue: "The king falls as coronation fabric and bark clothing occupy the same chamber.",
          characterIds: ["king-dasharatha", "rama", "kaikeyi"],
        },
        {
          id: "the-three-bow-and-circle-the-king",
          title: { en: "The three bow and circle the king", hi: "तीनों राजा को प्रणाम कर परिक्रमा करते हैं" },
          narration: {
            en: "Rama, Sita, and Lakshmana bow to Dasharatha and circle him before leaving. The gesture honours the father and king even though the command has caused profound harm; reverence does not erase the rupture visible to everyone present.",
            hi: "राम, सीता और लक्ष्मण दशरथ को प्रणाम कर उनकी परिक्रमा करते हैं। यह पिता और राजा का सम्मान है, भले आदेश ने गहरा आघात किया हो; श्रद्धा उपस्थित सभी लोगों को दिखती टूटन को मिटाती नहीं।",
          },
          visualCue: "Three travellers circle the seated king inside a ring of grieving witnesses.",
          characterIds: ["rama", "sita", "lakshmana", "king-dasharatha"],
        },
        {
          id: "lakshmana-bows-to-two-mothers",
          title: { en: "Lakshmana bows to two mothers", hi: "लक्ष्मण दो माताओं को प्रणाम करते हैं" },
          narration: {
            en: "Lakshmana first honours Kausalya and then goes to Sumitra. His departure is not simply following an admired brother; it requires leaving his own mother and asking her blessing for years of service elsewhere.",
            hi: "लक्ष्मण पहले कौसल्या का सम्मान करते हैं, फिर सुमित्रा के पास जाते हैं। उनका प्रस्थान केवल प्रिय भाई के पीछे चलना नहीं; अपनी माँ को छोड़कर वर्षों तक दूसरे स्थान पर सेवा के लिए उनका आशीर्वाद माँगना भी है।",
          },
          visualCue: "Lakshmana moves from Kausalya's embrace to kneel before Sumitra.",
          characterIds: ["lakshmana", "kausalya", "sumitra", "rama"],
        },
        {
          id: "sumitra-gives-a-map-of-loyalty",
          title: { en: "Sumitra gives a map of loyalty", hi: "सुमित्रा निष्ठा का मार्ग बताती हैं" },
          narration: {
            en: "Sumitra tells Lakshmana to see Rama as father, Sita as mother, and the forest as Ayodhya. Her blessing is loving and demanding: he must keep the chosen household whole without treating exile as a lesser life.",
            hi: "सुमित्रा लक्ष्मण से राम को पिता, सीता को माता और वन को अयोध्या मानने को कहती हैं। उनका आशीर्वाद स्नेही भी है और कठोर भी—उन्हें चुने हुए परिवार को एक रखना है और वनवास को घटिया जीवन नहीं मानना।",
          },
          visualCue: "Sumitra's words connect the palace family to the unknown forest household ahead.",
          characterIds: ["sumitra", "lakshmana", "rama", "sita"],
        },
        {
          id: "sita-and-rama-leave-the-womens-chambers",
          title: { en: "Sita and Rama leave the women's chambers", hi: "सीता और राम स्त्री-कक्षों से विदा लेते हैं" },
          narration: {
            en: "The royal women bless Sita, warn her not to let hardship turn into contempt, and grieve for all three. Rama answers that Sita's loyalty is already known. With farewells exhausted rather than resolved, the travellers finally turn toward Ayodhya's gate.",
            hi: "राजमहल की स्त्रियाँ सीता को आशीर्वाद देती हैं, कठिनाई में तिरस्कार न आने की सीख देती हैं और तीनों के लिए शोक करती हैं। राम कहते हैं कि सीता की निष्ठा पहले से स्पष्ट है। विदाई सुलझती नहीं, केवल पूरी होती है और यात्री अयोध्या के द्वार की ओर मुड़ते हैं।",
          },
          visualCue: "The women's chambers recede behind Rama, Sita, and Lakshmana as the gate road opens ahead.",
          characterIds: ["sita", "rama", "lakshmana", "kausalya", "sumitra"],
        },
      ],
    } satisfies StoryMoment,
  },
];
