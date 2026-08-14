import type { RamayanaBeginningPlayableScene } from "./ramayana-beginnings-playable";

/** Complete consumer scenes for Balakanda 5-17 in the selected Dutt expression. */
export const RAMAYANA_HEIRS_PLAYABLE_SCENES: RamayanaBeginningPlayableScene[] = [
  {
    id: "ayodhya-built-for-life",
    nodeIds: ["ayodhya", "kosala", "sarayu", "dasharatha"],
    moment: {
      id: "ayodhya-built-for-life",
      decisiveChange: {
        en: "Before the royal family enters, Ayodhya appears as a living system built to protect, feed, and delight its people.",
        hi: "राजपरिवार के आने से पहले अयोध्या एक ऐसे जीवित नगर के रूप में सामने आती है जो लोगों की रक्षा, आजीविका और सुख के लिए बना है।",
      },
      beats: [
        {
          id: "kosala-rises-by-sarayu",
          title: { en: "A fertile country gathers around the Sarayu", hi: "सरयू के किनारे समृद्ध कोसल बसता है" },
          narration: {
            en: "The story first locates Ayodhya inside Kosala, a prosperous country sustained by grain, wealth, and the Sarayu. Its dynastic memory reaches back through Ikshvaku and Sagara, placing Rama's future family inside a much older landscape of rulers, settlements, rivers, and inherited responsibility.",
            hi: "कथा पहले अयोध्या को कोसल के भीतर रखती है—अनाज, संपदा और सरयू से पोषित एक समृद्ध देश। उसकी वंश-स्मृति इक्ष्वाकु और सगर तक जाती है; इस तरह राम का भावी परिवार शासकों, बस्तियों, नदियों और विरासत में मिले उत्तरदायित्व के बहुत पुराने भू-दृश्य में स्थित होता है।",
          },
          visualCue: "The Sarayu threads through fields and settlements until roads, walls, and towers gather into Ayodhya on the horizon.",
          characterIds: ["ikshvaku", "sagara"],
        },
        {
          id: "city-designed-for-movement",
          title: { en: "Roads, gates, markets, and water make a city", hi: "सड़कें, द्वार, बाज़ार और जल मिलकर नगर बनाते हैं" },
          narration: {
            en: "Ayodhya is not introduced as one palace floating above empty ground. Broad roads connect gates and markets; trees, watered streets, workshops, storehouses, homes, and public spaces support daily movement. Fortifications protect the city, but abundance and organisation are what make it feel inhabited.",
            hi: "अयोध्या को खाली भूमि के ऊपर तैरते एक महल की तरह नहीं दिखाया जाता। चौड़ी सड़कें द्वारों और बाज़ारों को जोड़ती हैं; वृक्ष, सींची हुई गलियाँ, कार्यशालाएँ, भंडार, घर और सार्वजनिक स्थान रोज़मर्रा की गति को संभालते हैं। किलेबंदी रक्षा करती है, पर नगर को जीवित बनाती है उसकी समृद्धि और व्यवस्था।",
          },
          visualCue: "A continuous street-level flight moves from fortified gates through markets, workshops, shaded avenues, reservoirs, and crowded courtyards.",
          characterIds: ["ayodhya-citizens"],
        },
        {
          id: "culture-fills-the-streets",
          title: { en: "Skill and celebration give the city its voice", hi: "कौशल और उत्सव नगर को अपनी आवाज़ देते हैं" },
          narration: {
            en: "Musicians, performers, merchants, artisans, learned teachers, warriors, and householders fill the source's city portrait. The variety matters: Ayodhya's splendour comes from many kinds of work and knowledge meeting in one place, not only from royal treasure or military strength.",
            hi: "संगीतकार, कलाकार, व्यापारी, शिल्पी, विद्वान शिक्षक, योद्धा और गृहस्थ स्रोत के नगर-चित्र को भरते हैं। यह विविधता महत्त्वपूर्ण है—अयोध्या की शोभा केवल राजकोष या सेना से नहीं, अनेक प्रकार के श्रम और ज्ञान के एक स्थान पर मिलने से बनती है।",
          },
          visualCue: "Music carries across layered neighbourhoods while craft, trade, study, training, and family life unfold simultaneously without becoming a static diagram.",
          characterIds: ["ayodhya-citizens", "ayodhya-artisans", "ayodhya-performers"],
        },
        {
          id: "beauty-rests-on-security",
          title: { en: "Prosperity is paired with restraint", hi: "समृद्धि के साथ संयम भी जुड़ा है" },
          narration: {
            en: "The selected telling praises trained defenders who can protect the city yet are expected not to strike the abandoned, hidden, or fleeing. Its idealised portrait connects beauty with security and security with rules, establishing the civic world whose unresolved absence of heirs will soon trouble Dasharatha.",
            hi: "चुनी हुई कथा प्रशिक्षित रक्षकों की प्रशंसा करती है जो नगर की रक्षा कर सकते हैं, पर त्यागे हुए, छिपे या भागते व्यक्ति पर प्रहार न करने की मर्यादा रखते हैं। यह आदर्श चित्र सौंदर्य को सुरक्षा और सुरक्षा को नियमों से जोड़ता है—यही वह नागरिक संसार है जिसकी उत्तराधिकार-विहीनता शीघ्र ही दशरथ को चिंतित करेगी।",
          },
          visualCue: "The city panorama closes on disciplined guards lowering their weapons as civilian life continues safely behind them.",
          characterIds: ["ayodhya-defenders", "dasharatha"],
        },
      ],
    },
  },
  {
    id: "dasharatha-rules-with-council",
    nodeIds: ["dasharatha", "ayodhya", "vasishta", "vamadeva", "sumantra", "royal-council"],
    moment: {
      id: "dasharatha-rules-with-council",
      decisiveChange: {
        en: "Ayodhya's apparent stability is revealed as the work of a king surrounded by capable, truth-tested counsel.",
        hi: "अयोध्या की स्थिरता एक अकेले राजा का चमत्कार नहीं, सक्षम और सत्य-परीक्षित सलाहकारों के सामूहिक कार्य के रूप में सामने आती है।",
      },
      beats: [
        {
          id: "dasharatha-enters-the-city",
          title: { en: "The king is measured by the city he protects", hi: "राजा का मूल्य उस नगर से आँका जाता है जिसकी वह रक्षा करता है" },
          narration: {
            en: "Dasharatha enters the narrative after the city, not before it. He is described as learned, self-controlled, far-sighted, formidable in war, and dear to rural and urban people. His power is meaningful because it serves a populated realm whose wellbeing the previous scene has made visible.",
            hi: "दशरथ कथा में नगर के बाद आते हैं, उससे पहले नहीं। वे विद्वान, संयमी, दूरदर्शी, युद्ध में प्रबल और गाँव तथा नगर दोनों के लोगों के प्रिय बताए जाते हैं। उनकी शक्ति इसलिए अर्थपूर्ण है क्योंकि वह उस आबाद राज्य की सेवा करती है जिसका जीवन पिछला दृश्य दिखा चुका है।",
          },
          visualCue: "Dasharatha rides through working streets rather than posing above them, meeting farmers, traders, soldiers, and families along one connected route.",
          characterIds: ["dasharatha", "ayodhya-citizens"],
        },
        {
          id: "prosperity-is-governed",
          title: { en: "Order reaches beyond the palace", hi: "व्यवस्था महल से बहुत आगे तक जाती है" },
          narration: {
            en: "The source's idealised Ayodhya contains prosperous households, ritual learning, trained forces, animals, trade, and public confidence. Dasharatha's reign holds these systems together through administration and restraint; the city is secure enough for people to pursue different forms of life.",
            hi: "स्रोत की आदर्श अयोध्या में समृद्ध परिवार, अनुष्ठानिक अध्ययन, प्रशिक्षित सेना, पशुधन, व्यापार और सार्वजनिक विश्वास साथ दिखाई देते हैं। दशरथ का शासन प्रशासन और संयम से इन व्यवस्थाओं को जोड़ता है; नगर इतना सुरक्षित है कि लोग जीवन के अलग-अलग मार्ग अपना सकें।",
          },
          visualCue: "Administrative lines spread from the court into granaries, training grounds, markets, shrines, stables, and surrounding countryside.",
          characterIds: ["dasharatha", "ayodhya-citizens"],
        },
        {
          id: "eight-ministers-test-decisions",
          title: { en: "Eight ministers turn information into judgment", hi: "आठ मंत्री सूचना को निर्णय में बदलते हैं" },
          narration: {
            en: "Dhrishti, Vijaya, Surashtra, Rashtravardhana, Akopa, Dharmapala, and Sumantra are named among the king's principal ministers. The telling values their ability to understand motives, protect confidentiality, gather intelligence, judge evidence, and remain committed to the realm rather than personal display.",
            hi: "धृष्टि, विजय, सुराष्ट्र, राष्ट्रवर्धन, अकोप, धर्मपाल और सुमंत्र राजा के प्रमुख मंत्रियों में गिने जाते हैं। कथा उनकी उस क्षमता को महत्त्व देती है जिससे वे उद्देश्यों को समझें, गोपनीयता रखें, सूचना जुटाएँ, प्रमाण पर निर्णय लें और निजी प्रदर्शन के बजाय राज्य के प्रति निष्ठावान रहें।",
          },
          visualCue: "A council table becomes an information map of roads, borders, harvests, disputes, and risks, with each minister testing a different connection.",
          characterIds: ["dasharatha", "sumantra", "royal-council"],
        },
        {
          id: "priests-and-counsellors-share-the-burden",
          title: { en: "No single voice owns the future", hi: "भविष्य पर किसी एक आवाज़ का अधिकार नहीं" },
          narration: {
            en: "Vasishta and Vamadeva serve as family priests alongside other learned counsellors. The source praises a court that investigates before punishing, guards secrets, recognises ability, and can disagree without abandoning duty. That collective structure will now face a problem force alone cannot solve.",
            hi: "वसिष्ठ और वामदेव अन्य विद्वान सलाहकारों के साथ राजपुरोहित हैं। स्रोत ऐसे दरबार की प्रशंसा करता है जो दंड से पहले जाँच करता है, रहस्य सुरक्षित रखता है, योग्यता पहचानता है और मतभेद के बीच भी कर्तव्य नहीं छोड़ता। अब इसी सामूहिक व्यवस्था के सामने ऐसा संकट आएगा जिसे केवल शक्ति हल नहीं कर सकती।",
          },
          visualCue: "The council circle remains open around an unoccupied place representing succession, shifting the mood from confidence to vulnerability.",
          characterIds: ["dasharatha", "vasishta", "vamadeva", "sumantra"],
        },
      ],
    },
  },
  {
    id: "king-chooses-horse-sacrifice",
    nodeIds: ["dasharatha", "sumantra", "vasishta", "ayodhya", "sarayu", "horse-sacrifice"],
    moment: {
      id: "king-chooses-horse-sacrifice",
      decisiveChange: {
        en: "The private pain of having no heir becomes a public, counselled undertaking whose risks must be openly managed.",
        hi: "उत्तराधिकारी न होने का निजी दुःख एक सार्वजनिक और परामर्श-आधारित संकल्प बनता है, जिसके जोखिमों को खुलकर संभालना होगा।",
      },
      beats: [
        {
          id: "absence-inside-abundance",
          title: { en: "A flourishing kingdom has no clear future", hi: "समृद्ध राज्य का भविष्य स्पष्ट नहीं है" },
          narration: {
            en: "Despite Ayodhya's wealth and Dasharatha's capability, he has no son to continue the line. The contrast gives succession civic weight: the problem is not simply that a king wants a child, but that a stable realm does not know how authority and responsibility will continue after him.",
            hi: "अयोध्या की संपदा और दशरथ की क्षमता के बावजूद उनका कोई पुत्र नहीं है जो वंश आगे बढ़ाए। यह विरोध उत्तराधिकार को सार्वजनिक महत्त्व देता है—समस्या केवल राजा की संतान-इच्छा नहीं, बल्कि यह है कि स्थिर राज्य को नहीं मालूम कि उनके बाद अधिकार और उत्तरदायित्व कैसे आगे बढ़ेंगे।",
          },
          visualCue: "The full city continues moving while the royal lineage display ends in an empty branch above an aging Dasharatha.",
          characterIds: ["dasharatha"],
        },
        {
          id: "idea-enters-council",
          title: { en: "Dasharatha refuses to decide alone", hi: "दशरथ अकेले निर्णय नहीं लेते" },
          narration: {
            en: "Dasharatha considers a horse sacrifice directed toward obtaining heirs, then calls Sumantra, the priests, and ritual specialists. He presents the proposal and asks them to assess it. Even a deeply personal hope must pass through expertise, consent, planning, and institutional memory.",
            hi: "दशरथ संतान-प्राप्ति के लिए अश्वमेध का विचार करते हैं, फिर सुमंत्र, पुरोहितों और अनुष्ठान-विशेषज्ञों को बुलाते हैं। वे प्रस्ताव सामने रखकर उनका मत माँगते हैं। अत्यंत निजी आशा भी विशेषज्ञता, सहमति, योजना और संस्थागत स्मृति से होकर गुजरती है।",
          },
          visualCue: "A solitary thought in the king's chamber expands into a council where ritual maps, resources, routes, and responsibilities appear together.",
          characterIds: ["dasharatha", "sumantra", "vasishta"],
        },
        {
          id: "danger-is-named-before-action",
          title: { en: "The undertaking can fail if handled carelessly", hi: "असावधानी से पूरा संकल्प विफल हो सकता है" },
          narration: {
            en: "The advisers approve but do not treat the sacrifice as automatic magic. They require exact preparation, qualified officiants, protection from disruption, a suitable ground on the Sarayu, and attention to every rule. The scene makes responsibility visible before spectacle begins.",
            hi: "सलाहकार सहमति देते हैं, पर यज्ञ को स्वतः फल देने वाला जादू नहीं मानते। वे शुद्ध तैयारी, योग्य आचार्य, विघ्न से सुरक्षा, सरयू तट पर उपयुक्त भूमि और प्रत्येक नियम पर ध्यान की माँग करते हैं। दृश्य आरंभ से पहले ही उत्तरदायित्व को स्पष्ट कर देता है।",
          },
          visualCue: "Possible failure paths flare around the ritual plan, then resolve into assigned roles, safeguards, and a marked site north of the Sarayu.",
          characterIds: ["dasharatha", "vasishta", "ritual-specialists"],
        },
        {
          id: "hope-reaches-the-queens",
          title: { en: "The decision returns to the family", hi: "निर्णय फिर परिवार तक लौटता है" },
          narration: {
            en: "After instructing the ministers, Dasharatha tells his wives that the undertaking is meant to bring children into the household. Their faces brighten after a long season of uncertainty. Public succession and intimate longing meet without becoming the same thing.",
            hi: "मंत्रियों को निर्देश देने के बाद दशरथ अपनी रानियों को बताते हैं कि यह संकल्प परिवार में संतान लाने के लिए है। लंबे अनिश्चित समय के बाद उनके चेहरे खिल उठते हैं। सार्वजनिक उत्तराधिकार और निजी आकांक्षा यहाँ मिलते हैं, पर एक-दूसरे में पूरी तरह घुलते नहीं।",
          },
          visualCue: "The formal council dissolves into a quieter inner chamber where guarded hope moves across the queens' faces like returning spring light.",
          characterIds: ["dasharatha", "kausalya", "kaikeyi", "sumitra"],
        },
      ],
    },
  },
  {
    id: "rishyasringa-brought-from-seclusion",
    nodeIds: ["rishyasringa", "shanta", "romapada", "dasharatha", "sumantra", "anga", "ayodhya"],
    moment: {
      id: "rishyasringa-brought-from-seclusion",
      decisiveChange: {
        en: "A controversial old story of isolation and persuasion leads to a present alliance built through Shanta and Rishyasringa.",
        hi: "एकांत और प्रलोभन की विवादास्पद पुरानी कथा शांता और ऋष्यशृंग के माध्यम से बने वर्तमान सहयोग तक पहुँचती है।",
      },
      beats: [
        {
          id: "sumantra-remembers-a-prediction",
          title: { en: "An old prediction enters a present problem", hi: "पुरानी भविष्यवाणी वर्तमान संकट में लौटती है" },
          narration: {
            en: "Sumantra privately tells Dasharatha that an old teaching names Rishyasringa as the officiant connected with the birth of his sons. Rishyasringa has grown in forest seclusion under his father Vibhandaka, with little knowledge of society beyond disciplined study and service.",
            hi: "सुमंत्र दशरथ को एक पुरानी भविष्यवाणी बताते हैं जिसमें ऋष्यशृंग को उनके पुत्र-जन्म से जुड़े आचार्य के रूप में नामित किया गया है। ऋष्यशृंग अपने पिता विभांडक के साथ वन के एकांत में बड़े हुए हैं और अनुशासित अध्ययन तथा सेवा के बाहर समाज का बहुत कम अनुभव रखते हैं।",
          },
          visualCue: "A remembered prophecy overlays the present council, then carries the viewpoint into a remote hermitage cut off from roads and cities.",
          characterIds: ["sumantra", "dasharatha", "rishyasringa", "vibhandaka"],
        },
        {
          id: "anga-uses-deception-against-drought",
          title: { en: "A kingdom in drought chooses manipulation", hi: "सूखे से जूझता राज्य छल का मार्ग चुनता है" },
          narration: {
            en: "Sumantra recounts how Anga once suffered without rain and advisers sought to bring the secluded ascetic into the city. Courtesans approached him in disguise, using unfamiliar affection, food, fragrance, and performance. Devam retains the source sequence without presenting the manipulation as a model of consent.",
            hi: "सुमंत्र बताते हैं कि अंग देश कभी वर्षा-विहीन हो गया था और सलाहकारों ने एकांतवासी ऋषि को नगर लाने की योजना बनाई। गणिकाएँ वेश बदलकर अपरिचित स्नेह, भोजन, सुगंध और प्रस्तुति के माध्यम से उनके पास पहुँचीं। देवम स्रोत का क्रम सुरक्षित रखता है, पर इस छल को सहमति का आदर्श नहीं मानता।",
          },
          visualCue: "A dry kingdom and an isolated hermitage occupy opposite halves of the world, joined by a deliberately uneasy route of disguise and persuasion.",
          characterIds: ["rishyasringa", "romapada", "anga-courtesans"],
        },
        {
          id: "rain-arrives-with-rishyasringa",
          title: { en: "The arrival changes Anga's sky", hi: "ऋष्यशृंग के आगमन से अंग का आकाश बदलता है" },
          narration: {
            en: "When Rishyasringa reaches Anga, rain comes and King Romapada receives him with humility, anxious to prevent anger over the means used. Romapada joins him with Shanta, and the source moves from the troubling recruitment story toward a settled household and public relief.",
            hi: "ऋष्यशृंग के अंग पहुँचते ही वर्षा होती है। राजा रोमपाद विनम्रता से उनका स्वागत करते हैं और अपनाए गए उपाय पर उनके क्रोध से बचना चाहते हैं। रोमपाद उनका विवाह शांता से कराते हैं; स्रोत असहज बुलावे से आगे बढ़कर स्थिर गृहस्थ जीवन और सार्वजनिक राहत की ओर जाता है।",
          },
          visualCue: "Rain crosses the parched city as Rishyasringa and Shanta meet within a court that carries both relief and unresolved moral discomfort.",
          characterIds: ["rishyasringa", "shanta", "romapada"],
        },
        {
          id: "shanta-rishyasringa-come-to-ayodhya",
          title: { en: "An alliance brings the couple to Ayodhya", hi: "सहयोग शांता और ऋष्यशृंग को अयोध्या लाता है" },
          narration: {
            en: "Dasharatha travels to his friend Romapada and asks that Shanta and Rishyasringa come oversee the planned rites. They are welcomed into Ayodhya with public celebration and affection inside the household. Rishyasringa arrives not as a tool taken from a forest, but as Shanta's husband and an honoured specialist whose cooperation is requested.",
            hi: "दशरथ अपने मित्र रोमपाद के पास जाकर शांता और ऋष्यशृंग से नियोजित अनुष्ठानों का संचालन करने का अनुरोध करते हैं। अयोध्या में उनका सार्वजनिक उत्सव और परिवार के स्नेह से स्वागत होता है। ऋष्यशृंग अब वन से लाए गए साधन नहीं, शांता के पति और सम्मानित विशेषज्ञ के रूप में आते हैं जिनका सहयोग माँगा गया है।",
          },
          visualCue: "The route from Anga to Ayodhya becomes a formal procession centred equally on Shanta and Rishyasringa, ending in a warm family reception.",
          characterIds: ["dasharatha", "romapada", "shanta", "rishyasringa"],
        },
      ],
    },
  },
  {
    id: "sacrifice-city-rises",
    nodeIds: ["dasharatha", "rishyasringa", "shanta", "vasishta", "sarayu", "sacrifice-city"],
    moment: {
      id: "sacrifice-city-rises",
      decisiveChange: {
        en: "A year of preparation turns the riverbank into a temporary city whose hospitality and precision are part of the rite itself.",
        hi: "एक वर्ष की तैयारी सरयू तट को अस्थायी नगर में बदल देती है, जहाँ आतिथ्य और शुद्ध व्यवस्था स्वयं अनुष्ठान का भाग हैं।",
      },
      beats: [
        {
          id: "horse-leaves-and-clock-begins",
          title: { en: "The horse is released and a year begins", hi: "अश्व छोड़ा जाता है और एक वर्ष की घड़ी चलती है" },
          narration: {
            en: "In spring, Rishyasringa tells Dasharatha to gather provisions, release the consecrated horse, and prepare the ground north of the Sarayu. The undertaking stretches across seasons; its scale is established through waiting, supervision, and repeated preparation rather than one spectacular day.",
            hi: "वसंत में ऋष्यशृंग दशरथ से सामग्री जुटाने, यज्ञ-अश्व छोड़ने और सरयू के उत्तर तट पर भूमि तैयार करने को कहते हैं। यह संकल्प ऋतुओं तक फैलता है; उसका विस्तार एक चमत्कारी दिन से नहीं, प्रतीक्षा, निगरानी और बार-बार की तैयारी से बनता है।",
          },
          visualCue: "The horse departs along a widening route while the riverbank changes through rain, heat, harvest, and returning spring.",
          characterIds: ["rishyasringa", "dasharatha", "horse-guard"],
        },
        {
          id: "workers-build-a-temporary-world",
          title: { en: "Many kinds of work build the ritual ground", hi: "अनेक प्रकार का श्रम अनुष्ठान-स्थल बनाता है" },
          narration: {
            en: "Vasishta coordinates priests, builders, carpenters, cooks, water carriers, accountants, guards, servants, and experienced elders. Roads, pavilions, residences, kitchens, storage, animal shelters, and water systems rise together. Ritual precision depends on ordinary labour being visible and supported.",
            hi: "वसिष्ठ पुरोहितों, निर्माणकारों, बढ़इयों, रसोइयों, जल-वाहकों, लेखाकारों, रक्षकों, सेवकों और अनुभवी बुज़ुर्गों का समन्वय करते हैं। सड़कें, मंडप, आवास, रसोई, भंडार, पशु-स्थल और जल-व्यवस्था साथ बनते हैं। अनुष्ठान की शुद्धता साधारण श्रम को देखने और सहारा देने पर निर्भर है।",
          },
          visualCue: "The empty bank becomes a dense construction simulation where every pavilion is linked to food, water, shelter, movement, and accountable hands.",
          characterIds: ["vasishta", "rishyasringa", "ritual-workers"],
        },
        {
          id: "hospitality-is-not-optional",
          title: { en: "Every guest must be fed and respected", hi: "हर अतिथि को भोजन और सम्मान मिलना चाहिए" },
          narration: {
            en: "Kings, learned guests, families, travellers, workers, and people from different regions are invited and housed. The instructions repeatedly insist that food and regard must not be distributed carelessly or contemptuously. A rite meant to secure the future cannot be built on humiliation in the present.",
            hi: "राजाओं, विद्वानों, परिवारों, यात्रियों, श्रमिकों और अलग-अलग क्षेत्रों के लोगों को बुलाकर ठहराया जाता है। निर्देश बार-बार कहते हैं कि भोजन और सम्मान लापरवाही या तिरस्कार से न बाँटे जाएँ। भविष्य सुरक्षित करने वाला अनुष्ठान वर्तमान में अपमान पर नहीं खड़ा हो सकता।",
          },
          visualCue: "Dining lines and guest quarters fill without hierarchy swallowing the frame; attendants notice empty plates, lost visitors, and overlooked workers.",
          characterIds: ["vasishta", "dasharatha", "invited-guests", "ritual-workers"],
        },
        {
          id: "horse-returns-and-rite-completes",
          title: { en: "The returning horse closes one vow and opens another", hi: "लौटता अश्व एक संकल्प पूरा कर दूसरा खोलता है" },
          narration: {
            en: "After a full year the horse returns and the officiants complete the demanding sequence on the Sarayu. Dasharatha gives lavish gifts, but Rishyasringa's promise matters most: four sons will be born. The horse sacrifice ends, and a more focused rite for offspring begins.",
            hi: "पूरा वर्ष बीतने पर अश्व लौटता है और आचार्य सरयू तट पर कठिन अनुष्ठान-क्रम पूरा करते हैं। दशरथ बड़े दान देते हैं, पर सबसे महत्त्वपूर्ण ऋष्यशृंग का आश्वासन है—चार पुत्र जन्म लेंगे। अश्वमेध समाप्त होता है और संतान के लिए अधिक केंद्रित अनुष्ठान आरंभ होता है।",
          },
          visualCue: "The returning horse crosses the finished temporary city as one ritual circle closes and a smaller, brighter fire is prepared at its centre.",
          characterIds: ["dasharatha", "rishyasringa", "vasishta"],
        },
      ],
    },
  },
  {
    id: "gods-name-ravana-problem",
    nodeIds: ["rishyasringa", "dasharatha", "brahma", "ravana", "devas", "sacred-fire"],
    moment: {
      id: "gods-name-ravana-problem",
      decisiveChange: {
        en: "Dasharatha's rite and the gods' crisis converge: the hoped-for births become connected to Ravana's unchecked violence.",
        hi: "दशरथ का अनुष्ठान और देवताओं का संकट एक बिंदु पर मिलते हैं—आने वाले जन्म रावण की अनियंत्रित हिंसा से जुड़ जाते हैं।",
      },
      beats: [
        {
          id: "rite-turns-toward-sons",
          title: { en: "Rishyasringa begins the son-conferring rite", hi: "ऋष्यशृंग पुत्र-प्राप्ति का अनुष्ठान आरंभ करते हैं" },
          narration: {
            en: "Rishyasringa uses the prescribed mantras and offerings for the focused rite Dasharatha requested. The household's hope remains present, but the narrative viewpoint widens as celestial beings gather for their shares and bring a danger that extends far beyond Ayodhya.",
            hi: "ऋष्यशृंग दशरथ की संतान-कामना के लिए निर्धारित मंत्रों और आहुतियों से केंद्रित अनुष्ठान आरंभ करते हैं। परिवार की आशा बनी रहती है, पर कथा का दृष्टिकोण फैल जाता है—देवता अपने भाग के लिए आते हैं और अयोध्या से बहुत बड़ा संकट सामने रखते हैं।",
          },
          visualCue: "The intimate fire ritual expands vertically into a celestial assembly while Ayodhya remains visible below, linking household hope to a wider emergency.",
          characterIds: ["rishyasringa", "dasharatha", "devas"],
        },
        {
          id: "ravana-protected-by-boon",
          title: { en: "A boon has become shelter for abuse", hi: "एक वरदान अत्याचार की ढाल बन गया है" },
          narration: {
            en: "The gods tell Brahma that Ravana uses the protection earned through austerity to terrorise worlds, obstruct sacred practice, and act without restraint. The problem is not strength by itself; it is power insulated from consequence by the terms of an old boon.",
            hi: "देवता ब्रह्मा से कहते हैं कि रावण तपस्या से मिले संरक्षण का उपयोग लोकों को आतंकित करने, साधना में विघ्न डालने और बिना मर्यादा चलने के लिए करता है। समस्या केवल शक्ति नहीं, बल्कि पुराने वरदान की शर्तों से परिणामों से बची हुई शक्ति है।",
          },
          visualCue: "Ravana's expanding shadow passes over hermitages and celestial paths while the boon appears as a shield deflecting every familiar response.",
          characterIds: ["ravana", "brahma", "devas"],
        },
        {
          id: "forgotten-human-exception",
          title: { en: "The ignored possibility becomes the opening", hi: "जिस संभावना को तुच्छ समझा गया वही मार्ग बनती है" },
          narration: {
            en: "Brahma remembers the exact boundary of his promise: Ravana asked protection from powerful classes of beings but dismissed humans as beneath concern. The loophole is not invented after the fact; it lies inside Ravana's own contempt and the source's stated terms.",
            hi: "ब्रह्मा अपने वरदान की ठीक सीमा याद करते हैं—रावण ने शक्तिशाली प्राणी-वर्गों से सुरक्षा माँगी थी, पर मनुष्यों को तुच्छ समझकर छोड़ दिया। यह मार्ग बाद में बनाया गया बहाना नहीं; वह रावण के अपने अहंकार और स्रोत में कही शर्तों के भीतर मौजूद है।",
          },
          visualCue: "The shield of the boon reveals one small unguarded human-shaped opening that grows brighter as the assembly understands it.",
          characterIds: ["brahma", "ravana", "devas"],
        },
        {
          id: "assembly-turns-to-vishnu",
          title: { en: "The gods ask Vishnu to enter human life", hi: "देवता विष्णु से मानव जीवन में आने का अनुरोध करते हैं" },
          narration: {
            en: "The assembly turns to Vishnu and asks him to take human birth, uproot Ravana's violence, and relieve the worlds. The request does not yet decide the family or form; that answer will connect the cosmic problem directly to Dasharatha's waiting household.",
            hi: "सभा विष्णु से मानव जन्म लेने, रावण की हिंसा का अंत करने और लोकों को राहत देने का अनुरोध करती है। अभी परिवार और रूप निश्चित नहीं हुआ है; अगला उत्तर इस व्यापक संकट को सीधे दशरथ के प्रतीक्षारत परिवार से जोड़ेगा।",
          },
          visualCue: "Every line in the celestial assembly converges on Vishnu while the sacrificial fire below waits like an unanswered doorway.",
          characterIds: ["vishnu", "brahma", "devas"],
        },
      ],
    },
  },
  {
    id: "vishnu-chooses-fourfold-birth",
    nodeIds: ["vishnu", "dasharatha", "kausalya", "kaikeyi", "sumitra", "payasa-being", "ayodhya"],
    moment: {
      id: "vishnu-chooses-fourfold-birth",
      decisiveChange: {
        en: "The answer to Ravana's protection enters Dasharatha's household as shared sacred food and four promised births.",
        hi: "रावण के संरक्षण का उत्तर पवित्र प्रसाद और चार नियत जन्मों के रूप में दशरथ के परिवार में प्रवेश करता है।",
      },
      beats: [
        {
          id: "vishnu-accepts-human-form",
          title: { en: "Vishnu chooses the disregarded human path", hi: "विष्णु उपेक्षित मानव मार्ग चुनते हैं" },
          narration: {
            en: "Vishnu asks the gods to state the means clearly, then accepts their answer: Ravana can be defeated through human form. He chooses to be born in four portions among Dasharatha's sons, joining the cosmic response to a real family rather than appearing as a detached weapon.",
            hi: "विष्णु देवताओं से उपाय स्पष्ट कहने को कहते हैं, फिर उत्तर स्वीकार करते हैं—रावण का अंत मानव रूप से संभव है। वे दशरथ के पुत्रों में चार अंशों के रूप में जन्म लेने का निर्णय करते हैं; इस तरह व्यापक उत्तर किसी अलग हथियार की तरह नहीं, वास्तविक परिवार के भीतर आता है।",
          },
          visualCue: "Vishnu's light divides into four connected currents descending toward the still-burning ritual ground at Ayodhya.",
          characterIds: ["vishnu", "dasharatha", "devas"],
        },
        {
          id: "being-rises-from-fire",
          title: { en: "A messenger emerges carrying the food", hi: "अग्नि से प्रसाद लिए एक दूत प्रकट होता है" },
          narration: {
            en: "A radiant, formidable being rises from the fire holding a golden vessel of payasa prepared by the gods. He identifies himself as a messenger and tells Dasharatha to give the food to his wives. The invisible decision becomes a concrete act the family must perform.",
            hi: "अग्नि से एक तेजस्वी और प्रभावशाली पुरुष स्वर्ण-पात्र में देवताओं द्वारा तैयार पायस लेकर प्रकट होता है। वह स्वयं को दूत बताकर दशरथ से यह प्रसाद अपनी रानियों को देने को कहता है। अदृश्य निर्णय अब परिवार द्वारा किए जाने वाले ठोस कार्य में बदल जाता है।",
          },
          visualCue: "The fire opens around a dark radiant figure whose golden vessel becomes the brightest object in the temporary ritual city.",
          characterIds: ["payasa-being", "dasharatha"],
        },
        {
          id: "dasharatha-distributes-payasa",
          title: { en: "Dasharatha shares the vessel among the queens", hi: "दशरथ प्रसाद को रानियों में बाँटते हैं" },
          narration: {
            en: "Dasharatha receives the vessel reverently and distributes its portions among Kausalya, Sumitra, and Kaikeyi, with Sumitra receiving from the shared division twice. The scene is intimate and deliberate: the future brothers enter the story through one vessel distributed across relationships.",
            hi: "दशरथ पात्र को आदर से ग्रहण करके उसका भाग कौसल्या, सुमित्रा और कैकेयी में बाँटते हैं; साझा विभाजन में सुमित्रा को दो बार अंश मिलता है। दृश्य निजी और सावधान है—भावी भाई एक ही पात्र से रिश्तों के बीच बाँटे गए प्रसाद के माध्यम से कथा में प्रवेश करते हैं।",
          },
          visualCue: "One golden vessel passes through the family circle, its light dividing without severing the visual bond among the three queens.",
          characterIds: ["dasharatha", "kausalya", "sumitra", "kaikeyi"],
        },
        {
          id: "waiting-becomes-pregnancy",
          title: { en: "The household's long uncertainty changes form", hi: "परिवार की लंबी प्रतीक्षा नया रूप लेती है" },
          narration: {
            en: "After receiving the payasa, the queens become pregnant, and Dasharatha sees the hoped-for future begin to take shape. The source compares their radiance to fire and sun; the turn ends before the births, holding the family in expectant transformation.",
            hi: "पायस ग्रहण करने के बाद रानियाँ गर्भवती होती हैं और दशरथ अपनी प्रतीक्षित भविष्य-रेखा को आकार लेते देखते हैं। स्रोत उनकी दीप्ति की तुलना अग्नि और सूर्य से करता है; दृश्य जन्म से पहले रुकता है और परिवार को आशापूर्ण परिवर्तन में थामे रखता है।",
          },
          visualCue: "The ritual city's lights recede as three quiet palace chambers glow, connected by four subtle pulses of approaching life.",
          characterIds: ["dasharatha", "kausalya", "sumitra", "kaikeyi"],
        },
      ],
    },
  },
  {
    id: "allies-born-for-future-war",
    nodeIds: ["hanuman", "sugriva", "vali", "nala", "nila", "jambavan", "vanara-allies", "rama"],
    moment: {
      id: "allies-born-for-future-war",
      decisiveChange: {
        en: "Before Rama is born, the future alliance is already taking shape across mountains, forests, and many extraordinary households.",
        hi: "राम के जन्म से पहले ही भावी सहयोग पर्वतों, वनों और अनेक असाधारण परिवारों में आकार लेने लगता है।",
      },
      beats: [
        {
          id: "brahma-asks-for-allies",
          title: { en: "A human hero will not be sent alone", hi: "मानव नायक को अकेला नहीं भेजा जाएगा" },
          narration: {
            en: "After Vishnu accepts human birth, Brahma asks the gods and other celestial beings to create powerful allies able to change form, move with extraordinary speed, understand strategy, resist weapons, and act with intelligence. The response to Ravana is designed as cooperation, not solitary destiny.",
            hi: "विष्णु के मानव जन्म स्वीकार करने के बाद ब्रह्मा देवताओं और अन्य दिव्य प्राणियों से ऐसे शक्तिशाली सहयोगी उत्पन्न करने को कहते हैं जो रूप बदल सकें, तीव्र गति से चलें, नीति समझें, अस्त्र सह सकें और बुद्धि से काम लें। रावण के विरुद्ध उत्तर अकेली नियति नहीं, सहयोग के रूप में बनाया जाता है।",
          },
          visualCue: "The four descending birth currents are joined by hundreds of branching paths spreading toward forests, caves, mountains, and coastlines.",
          characterIds: ["brahma", "vishnu", "devas"],
        },
        {
          id: "future-leaders-take-form",
          title: { en: "The future leaders appear in different lineages", hi: "भावी नेता अलग-अलग वंशों में जन्म लेते हैं" },
          narration: {
            en: "The source names future vanara and bear leaders connected with different divine powers: Vali, Sugriva, Tara, Nala, Nila, Mainda, Dvivida, Sushena, Sharabha, and the already-created Jambavan. Their varied origins anticipate distinct abilities rather than one interchangeable army.",
            hi: "स्रोत अलग-अलग दिव्य शक्तियों से जुड़े भावी वानर और ऋक्ष नेताओं के नाम लेता है—वालि, सुग्रीव, तार, नल, नील, मैंद, द्विविद, सुषेण, शरभ और पहले से उत्पन्न जाम्बवान। उनकी विविध उत्पत्तियाँ एक जैसी सेना नहीं, अलग-अलग क्षमताओं का संकेत देती हैं।",
          },
          visualCue: "Named figures ignite across a vast relief map, each arrival marked by a different movement language, silhouette, and terrain.",
          characterIds: ["vali", "sugriva", "nala", "nila", "jambavan", "vanara-leaders"],
        },
        {
          id: "hanuman-carries-wind-and-thunder",
          title: { en: "Hanuman enters with the force of wind", hi: "हनुमान वायु के वेग के साथ कथा में आते हैं" },
          narration: {
            en: "Hanuman is born through the wind-god's power, with immense strength and movement compared to thunder and storm. At this point he has not met Rama and no devotion scene is invented; the narrative simply places his capacity in the world long before the relationship that will give it direction.",
            hi: "हनुमान वायु-देव की शक्ति से जन्म लेते हैं; उनकी गति और बल की तुलना तूफ़ान तथा गर्जना से की जाती है। अभी उनकी राम से भेंट नहीं हुई है और यहाँ कोई बाद की भक्ति-कथा नहीं जोड़ी जाती; कथा केवल उनकी क्षमता को उस संबंध से बहुत पहले संसार में रखती है जो उसे दिशा देगा।",
          },
          visualCue: "A current of wind crosses mountain ridges and gathers into the young Hanuman's silhouette without previewing later devotional iconography as present action.",
          characterIds: ["hanuman", "vayu"],
        },
        {
          id: "earth-fills-with-unmet-companions",
          title: { en: "The world fills with companions who have not met", hi: "संसार उन साथियों से भरता है जो अभी मिले नहीं हैं" },
          narration: {
            en: "Mountains, forests, caves, and ocean edges become home to immense communities of vanaras, bears, and related beings. They carry strength, intelligence, distinctive marks, and local leadership. The scene closes on dramatic irony: the network that will help Rama already exists, but none of its members yet knows the story that will connect them.",
            hi: "पर्वत, वन, गुफाएँ और समुद्र-तट वानरों, ऋक्षों और संबंधित प्राणियों के विशाल समुदायों का घर बनते हैं। उनके पास बल, बुद्धि, अलग पहचान और स्थानीय नेतृत्व है। दृश्य इस विडंबना पर समाप्त होता है कि राम की सहायता करने वाला जाल पहले से मौजूद है, पर उसके सदस्य अभी उस कथा को नहीं जानते जो उन्हें जोड़ेगी।",
          },
          visualCue: "The camera pulls back from separate communities until hidden lines reveal one immense future alliance surrounding an as-yet-unborn Rama.",
          characterIds: ["hanuman", "sugriva", "vali", "jambavan", "vanara-allies", "rama"],
        },
      ],
    },
  },
];
