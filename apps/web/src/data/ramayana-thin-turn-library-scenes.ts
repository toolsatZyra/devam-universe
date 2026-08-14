import type { StoryMoment } from "@/lib/domain/story-world";

export type RamayanaLibraryScene = {
  id: string;
  turnId: string;
  detailOrdinal: number;
  title: { en: string; hi: string };
  synopsis: { en: string; hi: string };
  sourceStart: number;
  sourceEnd: number;
  sourceGlobalOrdinal: number;
  spanSha256s: string[];
  nodeIds: string[];
  places: string[];
  moment: StoryMoment;
};

const ayodhyaNodes = ["coronation-dawn-event", "ayodhya", "king-dasharatha", "rama", "sita", "vasishta"];
const janasthanaNodes = ["janasthana-falls-event", "janasthana-battlefield-story-world", "rama", "lakshmana", "sita", "surpanakha", "khara", "dushana", "akampana"];

/**
 * Data-only story-depth repairs for live districts whose visual stop currently
 * compresses several independently meaningful source units. These scenes
 * replace that one stop only in the consumer narrative snapshot. They do not
 * add images, alter the live district, or duplicate a source unit.
 */
export const RAMAYANA_THIN_TURN_LIBRARY_SCENES: RamayanaLibraryScene[] = [
  {
    id: "dasharatha-chooses-rama",
    turnId: "coronation-dawn",
    detailOrdinal: 1,
    title: { en: "Dasharatha chooses Rama", hi: "दशरथ राम को उत्तराधिकारी चुनते हैं" },
    synopsis: {
      en: "With Bharata and Shatrughna away, an ageing Dasharatha responds to ominous dreams by asking the court to consider Rama as heir; the assembly's approval makes a private urgency into a public decision.",
      hi: "भरत और शत्रुघ्न के दूर रहते हुए वृद्ध दशरथ अशुभ स्वप्नों से चिंतित होकर सभा के सामने राम को उत्तराधिकारी बनाने का प्रस्ताव रखते हैं; सभा की सहमति निजी जल्दबाज़ी को सार्वजनिक निर्णय बना देती है।",
    },
    sourceStart: 1,
    sourceEnd: 2,
    sourceGlobalOrdinal: 76,
    spanSha256s: [
      "9db8b2e98d9245a9868f37f19eac53a872488d7a7144ad85cf5739a498a45876",
      "1c19a29d688fe51db5522f82fba2cc74e6561cda352c0741607d6f4cc11dc9ad",
    ],
    nodeIds: ayodhyaNodes,
    places: ["Ayodhya"],
    moment: {
      id: "dasharatha-chooses-rama",
      decisiveChange: {
        en: "A king's fear about time becomes a public succession decision.",
        hi: "समय को लेकर राजा की चिंता सार्वजनिक उत्तराधिकार-निर्णय बन जाती है।",
      },
      beats: [
        {
          id: "bharata-and-shatrughna-are-away",
          title: { en: "Two brothers are away", hi: "दो भाई नगर से दूर हैं" },
          narration: {
            en: "Bharata and Shatrughna are staying with Bharata's maternal family. Ayodhya's next great decision therefore begins while two of Dasharatha's sons are absent from the city and its council.",
            hi: "भरत और शत्रुघ्न भरत के ननिहाल में रह रहे हैं। इस तरह अयोध्या का अगला बड़ा निर्णय उस समय शुरू होता है जब दशरथ के दो पुत्र नगर और उसकी सभा से दूर हैं।",
          },
          visualCue: "Two empty places in the family line dissolve into a distant road beyond Ayodhya's walls.",
          characterIds: ["bharata", "shatrughna", "king-dasharatha"],
        },
        {
          id: "age-and-omens-create-urgency",
          title: { en: "Age and omens create urgency", hi: "आयु और अपशकुन जल्दबाज़ी लाते हैं" },
          narration: {
            en: "Dasharatha feels age pressing on him and speaks of disturbing signs and dreams. He does not want the kingdom's future to remain unsettled if his own life or judgment suddenly fails.",
            hi: "दशरथ को अपनी बढ़ती आयु का दबाव महसूस होता है और वे अशुभ संकेतों तथा स्वप्नों की बात करते हैं। वे नहीं चाहते कि उनके जीवन या निर्णय-शक्ति पर अचानक संकट आने से राज्य का भविष्य अनिश्चित रह जाए।",
          },
          visualCue: "The king studies a darkened sky from a palace balcony while dawn gathers behind the city.",
          characterIds: ["king-dasharatha"],
        },
        {
          id: "rama-has-earned-public-trust",
          title: { en: "Rama has earned public trust", hi: "राम ने जन-विश्वास अर्जित किया है" },
          narration: {
            en: "The case for Rama is built from conduct rather than birth alone: people know him as attentive, self-controlled, capable in conflict, and willing to hear those who approach the court.",
            hi: "राम के पक्ष में तर्क केवल जन्म पर नहीं, आचरण पर टिकता है: लोग उन्हें सुनने वाला, संयमी, संघर्ष में सक्षम और दरबार आने वालों की बात समझने वाला मानते हैं।",
          },
          visualCue: "Brief memories of Rama listening in the street and training in the court gather around the council chamber.",
          characterIds: ["rama", "king-dasharatha"],
        },
        {
          id: "dasharatha-opens-the-question",
          title: { en: "Dasharatha opens the question", hi: "दशरथ प्रस्ताव सभा के सामने रखते हैं" },
          narration: {
            en: "Dasharatha does not simply announce a finished coronation. He places Rama's installation before rulers and elders and asks them to judge whether the proposal serves the kingdom.",
            hi: "दशरथ तैयार राज्याभिषेक की केवल घोषणा नहीं करते। वे राजाओं और सभासदों के सामने राम के युवराज-पद का प्रस्ताव रखकर पूछते हैं कि क्या यह राज्य के हित में है।",
          },
          visualCue: "The royal hall widens as Dasharatha's proposal moves from the throne toward the assembled council.",
          characterIds: ["king-dasharatha", "rama", "vasishta"],
        },
        {
          id: "the-assembly-answers-together",
          title: { en: "The assembly answers together", hi: "सभा एक स्वर में उत्तर देती है" },
          narration: {
            en: "The gathered leaders respond with strong approval and explain why Rama already commands affection and confidence. The expected future now belongs to the whole city's imagination, not only Dasharatha's household.",
            hi: "एकत्रित नेता प्रबल सहमति देते हैं और बताते हैं कि राम पहले ही लोगों का स्नेह और भरोसा क्यों पा चुके हैं। अब आने वाला भविष्य केवल दशरथ के परिवार का नहीं, पूरे नगर की कल्पना बन जाता है।",
          },
          visualCue: "Rows of elders rise in agreement as the open hall reveals Ayodhya beyond them.",
          characterIds: ["king-dasharatha", "rama", "vasishta"],
        },
      ],
    },
  },
  {
    id: "ayodhya-prepares-the-heir",
    turnId: "coronation-dawn",
    detailOrdinal: 2,
    title: { en: "Ayodhya prepares its heir", hi: "अयोध्या युवराज की तैयारी करती है" },
    synopsis: {
      en: "The approved proposal becomes an immediate citywide operation, while Dasharatha privately asks Rama to meet kingship with restraint and warns that delay may be dangerous.",
      hi: "स्वीकृत प्रस्ताव तुरंत पूरे नगर की तैयारी बन जाता है; इसी बीच दशरथ निजी रूप से राम से राजपद को संयम से ग्रहण करने को कहते हैं और चेताते हैं कि देर करना जोखिमपूर्ण हो सकता है।",
    },
    sourceStart: 3,
    sourceEnd: 4,
    sourceGlobalOrdinal: 78,
    spanSha256s: [
      "a3721522e299c0ae9c3fbf9fd5763ae03b7a1c2e8be8505e96892f794ccf18a8",
      "a66fe379d3146daa2d3c5be722ade87f605e50c0145621faa23b9fde343a6989",
    ],
    nodeIds: ayodhyaNodes,
    places: ["Ayodhya"],
    moment: {
      id: "ayodhya-prepares-the-heir",
      decisiveChange: {
        en: "Public agreement turns into a citywide preparation that assumes tomorrow is secure.",
        hi: "जन-सहमति नगर-व्यापी तैयारी में बदलती है, मानो कल का भविष्य निश्चित हो।",
      },
      beats: [
        {
          id: "approval-becomes-orders",
          title: { en: "Approval becomes orders", hi: "सहमति आदेशों में बदलती है" },
          narration: {
            en: "Dasharatha receives the assembly's answer with relief. Priests, officials, household leaders, and city workers are assigned the water, food, garlands, music, security, and ceremonial work needed by morning.",
            hi: "दशरथ सभा का उत्तर राहत के साथ स्वीकार करते हैं। पुरोहितों, अधिकारियों, गृह-प्रमुखों और नगर-कर्मियों को भोर तक जल, भोजन, मालाएँ, संगीत, सुरक्षा और समारोह की व्यवस्था सौंपी जाती है।",
          },
          visualCue: "Instructions branch from the council into kitchens, storehouses, shrines, gates, and crowded streets.",
          characterIds: ["king-dasharatha", "vasishta"],
        },
        {
          id: "the-city-learns-the-news",
          title: { en: "The city learns the news", hi: "नगर को समाचार मिलता है" },
          narration: {
            en: "The decision travels faster than the officials. Homes, roads, and public spaces fill with expectation as people begin speaking of Rama's coming rule as if it has already arrived.",
            hi: "निर्णय अधिकारियों से भी तेज़ फैलता है। घर, मार्ग और सार्वजनिक स्थान आशा से भर जाते हैं; लोग राम के आने वाले शासन की चर्चा ऐसे करने लगते हैं मानो वह शुरू हो चुका हो।",
          },
          visualCue: "Banners and lamps spread across layered neighbourhoods as the news moves from doorway to doorway.",
          characterIds: ["rama", "king-dasharatha"],
        },
        {
          id: "dasharatha-summons-rama-privately",
          title: { en: "Dasharatha speaks to Rama alone", hi: "दशरथ राम से अकेले में बात करते हैं" },
          narration: {
            en: "After the public council, Dasharatha calls Rama close. He asks him to remain disciplined, attend to allies and subjects, and carry the new authority without letting desire or anger govern him.",
            hi: "सार्वजनिक सभा के बाद दशरथ राम को पास बुलाते हैं। वे संयम बनाए रखने, सहयोगियों और प्रजा का ध्यान रखने तथा इच्छा या क्रोध को शासन न करने देने की सीख देते हैं।",
          },
          visualCue: "The vast council empties until father and son remain in a quieter pool of light.",
          characterIds: ["king-dasharatha", "rama"],
        },
        {
          id: "tomorrow-is-fixed-too-quickly",
          title: { en: "Tomorrow is fixed at once", hi: "राज्याभिषेक तुरंत अगले दिन तय होता है" },
          narration: {
            en: "The installation is set for the next day. Dasharatha's haste comes from fear that circumstances—and even well-disposed relatives—can change; the speed leaves little room for absent family to return or respond.",
            hi: "राज्याभिषेक अगले ही दिन के लिए तय होता है। दशरथ को भय है कि परिस्थितियाँ और शुभचिंतक संबंधी भी बदल सकते हैं; इस तेज़ी में दूर मौजूद परिवार के लौटने या उत्तर देने की बहुत कम जगह बचती है।",
          },
          visualCue: "A ceremonial calendar closes on the next dawn while a distant road remains empty.",
          characterIds: ["king-dasharatha", "rama", "bharata"],
        },
      ],
    },
  },
  {
    id: "rama-and-sita-keep-the-night",
    turnId: "coronation-dawn",
    detailOrdinal: 3,
    title: { en: "Rama and Sita keep the night", hi: "राम और सीता रात्रि-व्रत रखते हैं" },
    synopsis: {
      en: "Vasishta carries the preparations into Rama and Sita's household; they fast, pray, and rest simply while Kausalya and the wider city wait for a dawn they believe will bring coronation.",
      hi: "वसिष्ठ तैयारी को राम और सीता के गृह तक पहुँचाते हैं; दोनों उपवास, प्रार्थना और साधारण शय्या पर रात बिताते हैं, जबकि कौसल्या और पूरा नगर उस भोर की प्रतीक्षा करते हैं जिसे वे राज्याभिषेक की सुबह मानते हैं।",
    },
    sourceStart: 5,
    sourceEnd: 6,
    sourceGlobalOrdinal: 80,
    spanSha256s: [
      "a17dcc6a2f7230b58a1277d179cc40d89120292718f213346f39bdaff293fe65",
      "3ef945c1e29bba47b53e0c668592207f293f1932d00153b287fec6e99a4ad657",
    ],
    nodeIds: ayodhyaNodes,
    places: ["Ayodhya"],
    moment: {
      id: "rama-and-sita-keep-the-night",
      decisiveChange: {
        en: "The city celebrates outside while Rama and Sita enter a night of restraint inside.",
        hi: "बाहर नगर उत्सव मनाता है, भीतर राम और सीता संयम की रात में प्रवेश करते हैं।",
      },
      beats: [
        {
          id: "vasishta-brings-the-instructions",
          title: { en: "Vasishta brings the instructions", hi: "वसिष्ठ निर्देश लेकर आते हैं" },
          narration: {
            en: "Vasishta reaches Rama's household with the observances expected before installation. The great public event enters the private rooms as a demand for fasting, attention, and preparation.",
            hi: "वसिष्ठ राज्याभिषेक से पहले के नियम लेकर राम के गृह पहुँचते हैं। बड़ा सार्वजनिक आयोजन अब उपवास, एकाग्रता और तैयारी की माँग बनकर निजी कक्षों में प्रवेश करता है।",
          },
          visualCue: "Vasishta crosses from crowded palace corridors into a quiet chamber prepared for vigil.",
          characterIds: ["vasishta", "rama", "sita"],
        },
        {
          id: "kausalya-prepares-with-hope",
          title: { en: "Kausalya prepares with hope", hi: "कौसल्या आशा के साथ तैयारी करती हैं" },
          narration: {
            en: "Kausalya receives the news she has long desired and turns toward prayer, gifts, and household preparation. Her happiness deepens the cost of the reversal that the next night will bring.",
            hi: "कौसल्या लंबे समय से चाहा समाचार पाकर प्रार्थना, दान और गृह-तैयारी में लगती हैं। उनकी प्रसन्नता उस उलटफेर की पीड़ा को और गहरा करती है जो अगली रात आने वाला है।",
          },
          visualCue: "Kausalya's attendants arrange offerings while warm light reaches into the family rooms.",
          characterIds: ["kausalya", "rama"],
        },
        {
          id: "rama-and-sita-choose-restraint",
          title: { en: "Rama and Sita choose restraint", hi: "राम और सीता संयम अपनाते हैं" },
          narration: {
            en: "Rama and Sita bathe, pray together, fast, and lie on a simple bed of kusa grass. The expected crown is met not with a victory feast but with a deliberately quiet household vigil.",
            hi: "राम और सीता स्नान करके साथ प्रार्थना करते हैं, उपवास रखते हैं और कुश की साधारण शय्या पर विश्राम करते हैं। आने वाले मुकुट का स्वागत विजय-भोज से नहीं, शांत गृह-व्रत से होता है।",
          },
          visualCue: "The couple sit beside a small lamp on kusa grass while distant palace music remains beyond the arches.",
          characterIds: ["rama", "sita"],
        },
        {
          id: "ayodhya-waits-for-morning",
          title: { en: "Ayodhya waits for morning", hi: "अयोध्या भोर की प्रतीक्षा करती है" },
          narration: {
            en: "Citizens remain awake amid decorated streets and confident talk of the future. Almost everyone believes the next movement will be coronation; the story pauses inside that shared certainty before breaking it.",
            hi: "सजे मार्गों और भविष्य की आश्वस्त चर्चा के बीच नगरवासी जागते रहते हैं। लगभग सबको लगता है कि अगला दृश्य राज्याभिषेक होगा; कथा उसे तोड़ने से पहले इसी सामूहिक विश्वास पर ठहरती है।",
          },
          visualCue: "A lamp-filled Ayodhya holds its breath beneath a dark blue sky just before dawn.",
          characterIds: ["rama", "sita", "king-dasharatha"],
        },
      ],
    },
  },
  {
    id: "surpanakha-brings-fourteen-fighters",
    turnId: "war-at-janasthana",
    detailOrdinal: 1,
    title: { en: "Surpanakha brings fourteen fighters", hi: "शूर्पणखा चौदह योद्धाओं को लाती हैं" },
    synopsis: {
      en: "Surpanakha carries her injury to Khara, returns with a first armed party, and watches Rama destroy it after placing Sita under Lakshmana's protection.",
      hi: "शूर्पणखा अपनी चोट लेकर खर के पास जाती हैं, पहले सशस्त्र दल के साथ लौटती हैं और देखती हैं कि सीता को लक्ष्मण की सुरक्षा में भेजने के बाद राम उस दल को पराजित कर देते हैं।",
    },
    sourceStart: 18,
    sourceEnd: 20,
    sourceGlobalOrdinal: 18,
    spanSha256s: [
      "7c0709781f8a6cb5354309c706c994817bb23171b096894ec26b9dd011ed56be",
      "8ccbebb64de4aef40137b3a185dd2cb9acf3270b90c4ffe113a519b69be84bad",
      "87bff0b5df1306c107f5bb48edbc4c8370180a6b5645eeb208d5f57b7c4543e6",
    ],
    nodeIds: janasthanaNodes,
    places: ["Janasthana", "Panchavati"],
    moment: {
      id: "surpanakha-brings-fourteen-fighters",
      decisiveChange: {
        en: "A violent injury becomes the first organized attack on the Panchavati household.",
        hi: "हिंसक चोट पंचवटी के परिवार पर पहला संगठित आक्रमण बन जाती है।",
      },
      beats: [
        {
          id: "khara-sees-surpanakhas-injury",
          title: { en: "Khara sees the injury", hi: "खर शूर्पणखा की चोट देखते हैं" },
          narration: {
            en: "Surpanakha reaches Khara bleeding and disfigured. Khara's first response is outrage and a demand to know who has harmed his sister and dared to provoke Janasthana.",
            hi: "शूर्पणखा रक्तस्राव और विरूपता की अवस्था में खर के पास पहुँचती हैं। खर क्रोध में पूछते हैं कि उनकी बहन को किसने घायल किया और जनस्थान को चुनौती देने का साहस किसने किया।",
          },
          visualCue: "A wounded Surpanakha stands before Khara as the forest stronghold closes around their anger.",
          characterIds: ["surpanakha", "khara"],
        },
        {
          id: "surpanakha-identifies-the-household",
          title: { en: "Surpanakha identifies the household", hi: "शूर्पणखा वन-परिवार का परिचय देती हैं" },
          narration: {
            en: "She names Rama, Lakshmana, and Sita, describes the encounter through her pain and fury, and demands their deaths. Her account turns a charged personal conflict into Khara's military concern.",
            hi: "वह राम, लक्ष्मण और सीता का नाम लेकर अपनी पीड़ा और क्रोध से भरा वृत्तांत सुनाती हैं तथा उनकी मृत्यु माँगती हैं। उनका वर्णन निजी संघर्ष को खर की सैन्य चिंता बना देता है।",
          },
          visualCue: "Three remembered silhouettes appear in the smoke between Surpanakha and Khara.",
          characterIds: ["surpanakha", "khara", "rama", "lakshmana", "sita"],
        },
        {
          id: "fourteen-leave-for-panchavati",
          title: { en: "Fourteen leave for Panchavati", hi: "चौदह योद्धा पंचवटी की ओर निकलते हैं" },
          narration: {
            en: "Khara sends fourteen fighters with Surpanakha rather than marching himself. They follow her back toward the cottage, treating a household they have not seen as a quick act of retaliation.",
            hi: "खर स्वयं जाने के बजाय चौदह योद्धाओं को शूर्पणखा के साथ भेजते हैं। वे उस परिवार को आसान प्रतिशोध मानकर कुटिया की ओर बढ़ते हैं जिसे उन्होंने अभी देखा भी नहीं है।",
          },
          visualCue: "Fourteen torchlit figures file from Janasthana into the darker forest behind Surpanakha.",
          characterIds: ["surpanakha", "khara"],
        },
        {
          id: "rama-separates-defence-from-battle",
          title: { en: "Rama separates defence from battle", hi: "राम रक्षा और युद्ध को अलग करते हैं" },
          narration: {
            en: "When the group reaches Panchavati, Rama asks Lakshmana to remain with Sita. The decision makes protection of the household a separate task before Rama faces the attackers outside it.",
            hi: "दल के पंचवटी पहुँचने पर राम लक्ष्मण से सीता के साथ रहने को कहते हैं। इस निर्णय से परिवार की सुरक्षा अलग दायित्व बनती है, फिर राम बाहर आए आक्रमणकारियों का सामना करते हैं।",
          },
          visualCue: "The cottage path divides: Lakshmana and Sita move toward cover while Rama steps into the clearing.",
          characterIds: ["rama", "lakshmana", "sita"],
        },
        {
          id: "the-first-force-falls",
          title: { en: "The first force falls", hi: "पहला दल पराजित होता है" },
          narration: {
            en: "The fourteen attack together and are killed by Rama. Surpanakha escapes the failed retaliation and returns to Khara, making the conflict larger instead of ending it.",
            hi: "चौदहों एक साथ आक्रमण करते हैं और राम के हाथों मारे जाते हैं। शूर्पणखा असफल प्रतिशोध से बचकर खर के पास लौटती हैं; संघर्ष समाप्त होने के बजाय और बड़ा हो जाता है।",
          },
          visualCue: "The clearing falls silent as Surpanakha's retreating path points back toward Janasthana.",
          characterIds: ["rama", "surpanakha", "khara"],
        },
      ],
    },
  },
  {
    id: "khara-marches-under-omens",
    turnId: "war-at-janasthana",
    detailOrdinal: 2,
    title: { en: "Khara marches under omens", hi: "खर अपशकुनों के बीच सेना लेकर चलते हैं" },
    synopsis: {
      en: "Surpanakha turns the first defeat into a challenge to Khara's honour; Dushana mobilizes Janasthana, omens trouble the march, and Rama sends Sita and Lakshmana to shelter.",
      hi: "शूर्पणखा पहली हार को खर के सम्मान की चुनौती बना देती हैं; दूषण जनस्थान की सेना जुटाता है, मार्ग में अपशकुन उभरते हैं और राम सीता तथा लक्ष्मण को आश्रय की ओर भेजते हैं।",
    },
    sourceStart: 21,
    sourceEnd: 24,
    sourceGlobalOrdinal: 21,
    spanSha256s: [
      "85cf4321d279e65c8c1a86fb7f5eaa8e933a33304b96b24f23d07791a13ca45c",
      "f2b24ecb75f2b8f063467612337cc8e6b17c4907008a63a55d1334fe789c96a6",
      "5f4a51f2977fb0443aa962b5e0b8491535aa0ad9eb24425475db8043cd992809",
      "feabd08133fff2a5c45cdf029e061e2cef3ac380123a2d2d20d50cc4b61bcbc2",
    ],
    nodeIds: janasthanaNodes,
    places: ["Janasthana", "Panchavati"],
    moment: {
      id: "khara-marches-under-omens",
      decisiveChange: {
        en: "A failed raid expands into Janasthana's full military march.",
        hi: "असफल छोटा आक्रमण जनस्थान की पूरी सैन्य चढ़ाई में बदल जाता है।",
      },
      beats: [
        {
          id: "surpanakha-returns-with-defeat",
          title: { en: "Surpanakha returns again", hi: "शूर्पणखा फिर लौटती हैं" },
          narration: {
            en: "Khara is startled to see Surpanakha return after the force he sent. She reports their deaths and refuses any answer that leaves Rama's household untouched.",
            hi: "अपने भेजे दल के बाद शूर्पणखा को लौटते देखकर खर चकित होते हैं। वह सबकी मृत्यु बताकर ऐसा कोई उत्तर स्वीकार नहीं करतीं जिसमें राम का परिवार सुरक्षित रह जाए।",
          },
          visualCue: "Surpanakha's second arrival interrupts Khara before the first decision can feel complete.",
          characterIds: ["surpanakha", "khara"],
        },
        {
          id: "honour-is-turned-into-pressure",
          title: { en: "Honour is turned into pressure", hi: "सम्मान को दबाव बनाया जाता है" },
          narration: {
            en: "Surpanakha attacks Khara's pride and capacity to rule if he cannot answer the loss. Her grief and rage become public pressure inside his own stronghold.",
            hi: "शूर्पणखा खर के गर्व और शासन-क्षमता पर प्रश्न उठाती हैं कि यदि वे इस हार का उत्तर नहीं दे सकते तो उनका अधिकार कैसा है। उनकी पीड़ा और क्रोध दुर्ग के भीतर सार्वजनिक दबाव बन जाते हैं।",
          },
          visualCue: "Khara's gathered commanders watch as Surpanakha's accusation turns every gaze toward him.",
          characterIds: ["surpanakha", "khara", "dushana"],
        },
        {
          id: "dushana-mobilizes-janasthana",
          title: { en: "Dushana mobilizes Janasthana", hi: "दूषण जनस्थान की सेना जुटाता है" },
          narration: {
            en: "Khara orders Dushana to assemble the larger force. Chariots, fighters, weapons, and commanders gather until retaliation has become a campaign.",
            hi: "खर दूषण को बड़ी सेना एकत्र करने का आदेश देते हैं। रथ, योद्धा, अस्त्र और सेनापति जुटते-जुटते प्रतिशोध को पूरा अभियान बना देते हैं।",
          },
          visualCue: "Dushana's signals awaken ranks across the forest stronghold and set the army in motion.",
          characterIds: ["khara", "dushana", "surpanakha"],
        },
        {
          id: "the-march-ignores-its-omens",
          title: { en: "The march ignores its omens", hi: "सेना अपशकुनों को अनदेखा करती है" },
          narration: {
            en: "Dark signs trouble the route—violent weather, frightened animals, and disruptions in the sky—but Khara treats warning as weakness and continues toward Panchavati.",
            hi: "मार्ग पर उग्र मौसम, भयभीत पशु और आकाश की विचित्र हलचल जैसे संकेत उभरते हैं, पर खर चेतावनी को कमजोरी मानकर पंचवटी की ओर बढ़ते रहते हैं।",
          },
          visualCue: "A dense marching column passes beneath a disturbed sky while animals flee across its path.",
          characterIds: ["khara", "dushana"],
        },
        {
          id: "rama-sends-sita-to-shelter",
          title: { en: "Rama sends Sita to shelter", hi: "राम सीता को आश्रय की ओर भेजते हैं" },
          narration: {
            en: "Rama reads the same signs as immediate danger. He asks Lakshmana to take Sita to a protected cave and remain with her while he holds the approaching force in the open.",
            hi: "राम उन्हीं संकेतों को निकट संकट के रूप में पढ़ते हैं। वे लक्ष्मण से सीता को सुरक्षित गुफा तक ले जाकर उनके साथ रहने को कहते हैं और स्वयं खुले मैदान में आती सेना के सामने ठहरते हैं।",
          },
          visualCue: "One path carries Sita and Lakshmana toward rock shelter while Rama turns toward the advancing noise.",
          characterIds: ["rama", "sita", "lakshmana"],
        },
      ],
    },
  },
  {
    id: "dushana-and-trishira-fall",
    turnId: "war-at-janasthana",
    detailOrdinal: 3,
    title: { en: "Dushana and Trishira fall", hi: "दूषण और त्रिशिरा गिरते हैं" },
    synopsis: {
      en: "Khara's army attacks in waves; Dushana commits another force, Trishira volunteers to reverse the battle, and each defeat leaves Khara increasingly alone.",
      hi: "खर की सेना लहरों में आक्रमण करती है; दूषण नया दल उतारता है, त्रिशिरा युद्ध पलटने का वचन देता है और हर हार खर को अधिक अकेला छोड़ती जाती है।",
    },
    sourceStart: 25,
    sourceEnd: 27,
    sourceGlobalOrdinal: 25,
    spanSha256s: [
      "3b8751c22db3b7ee962eb6f559817215eabc5597c4c053a989564b0454d3471f",
      "6ea07a1abaa1656f757ea3b6fe822c375ff18bf2a71729a8d2941053486f1a42",
      "e76632a5b9aec751cabf17d397ae05a40f612edbb7b7395524f9424f5fc097ff",
    ],
    nodeIds: janasthanaNodes,
    places: ["Janasthana battlefield"],
    moment: {
      id: "dushana-and-trishira-fall",
      decisiveChange: {
        en: "The large force loses its commanders and narrows toward Khara himself.",
        hi: "विशाल सेना अपने सेनापतियों को खोकर अंततः खर तक सिमटने लगती है।",
      },
      beats: [
        {
          id: "khara-orders-the-attack",
          title: { en: "Khara orders the attack", hi: "खर आक्रमण का आदेश देते हैं" },
          narration: {
            en: "The force reaches Rama and releases weapons in massed waves. The battle is no longer a single duel or quick punishment; it fills the forest around the place where one household had lived.",
            hi: "सेना राम तक पहुँचकर लहरों में अस्त्र छोड़ती है। अब यह एक द्वंद्व या छोटा दंड नहीं रहता; युद्ध उस वन को भर देता है जहाँ एक परिवार ने घर बनाया था।",
          },
          visualCue: "Successive lines of weapons cross the clearing while the abandoned cottage remains distant behind the battle.",
          characterIds: ["khara", "rama", "dushana"],
        },
        {
          id: "rama-breaks-the-first-waves",
          title: { en: "Rama breaks the first waves", hi: "राम पहली युद्ध-लहरें तोड़ते हैं" },
          narration: {
            en: "Rama withstands the converging attack and cuts through formations around him. The army's numerical confidence begins to fail as its lines cannot close the distance safely.",
            hi: "राम चारों ओर से आते आक्रमण को रोककर सेनाओं की पंक्तियाँ तोड़ते हैं। संख्या पर आधारित विश्वास डगमगाने लगता है क्योंकि दल सुरक्षित रूप से उनके पास नहीं पहुँच पाते।",
          },
          visualCue: "The battle curves around a solitary defender as broken formations open gaps in the field.",
          characterIds: ["rama", "khara", "dushana"],
        },
        {
          id: "dushana-commits-five-thousand",
          title: { en: "Dushana commits another force", hi: "दूषण नया विशाल दल उतारता है" },
          narration: {
            en: "Dushana sends thousands more into the fight and enters the pressure himself. The escalation spends lives to recover a campaign whose first assumption—that Rama would be easily overwhelmed—has already failed.",
            hi: "दूषण हजारों और योद्धाओं को युद्ध में उतारकर स्वयं भी दबाव बढ़ाता है। यह बढ़ता संघर्ष उस अभियान को बचाने के लिए जीवन खर्च करता है जिसकी पहली धारणा—कि राम आसानी से घिर जाएँगे—पहले ही टूट चुकी है।",
          },
          visualCue: "A new mass enters from the forest edge as Dushana advances through the opening ranks.",
          characterIds: ["dushana", "rama", "khara"],
        },
        {
          id: "dushana-is-killed",
          title: { en: "Dushana is killed", hi: "दूषण मारा जाता है" },
          narration: {
            en: "Dushana's attack is stopped and he is killed. The loss removes the commander who organized Janasthana's march and leaves the remaining leaders to improvise amid collapse.",
            hi: "दूषण का आक्रमण रुकता है और वह मारा जाता है। जनस्थान की चढ़ाई संगठित करने वाला सेनापति हट जाता है और बाकी नेताओं को टूटती सेना के बीच नया उपाय खोजना पड़ता है।",
          },
          visualCue: "Dushana's command standard drops as the formations behind it lose their shared direction.",
          characterIds: ["dushana", "rama", "khara"],
        },
        {
          id: "trishira-makes-his-promise",
          title: { en: "Trishira makes his promise", hi: "त्रिशिरा युद्ध पलटने का वचन देता है" },
          narration: {
            en: "Trishira asks Khara to hold back and promises to kill Rama. His intervention offers Khara one last buffer from the direct confrontation now approaching.",
            hi: "त्रिशिरा खर से पीछे रहने को कहकर राम को मारने का वचन देता है। उसका हस्तक्षेप खर और निकट आते सीधे द्वंद्व के बीच अंतिम अवरोध बनता है।",
          },
          visualCue: "Trishira moves between Khara and the open field, claiming the failing battle as his own test.",
          characterIds: ["khara", "trishira", "rama"],
        },
        {
          id: "trishira-falls-and-khara-advances",
          title: { en: "Trishira falls; Khara advances", hi: "त्रिशिरा गिरता है, खर आगे बढ़ता है" },
          narration: {
            en: "Trishira is killed despite his promise. With Dushana, Trishira, and the main force gone, Khara can no longer command the conflict from behind others and moves toward Rama himself.",
            hi: "अपने वचन के बावजूद त्रिशिरा मारा जाता है। दूषण, त्रिशिरा और मुख्य सेना के नष्ट होने पर खर अब दूसरों के पीछे से संघर्ष नहीं चला सकता और स्वयं राम की ओर बढ़ता है।",
          },
          visualCue: "The field clears between Khara and Rama as the last protective ranks fall away.",
          characterIds: ["trishira", "khara", "rama"],
        },
      ],
    },
  },
  {
    id: "khara-falls-akampana-carries-news",
    turnId: "war-at-janasthana",
    detailOrdinal: 4,
    title: { en: "Khara falls; Akampana carries the news", hi: "खर गिरता है, अकम्पन समाचार ले जाता है" },
    synopsis: {
      en: "Khara's final confrontation ends Janasthana's campaign, but Akampana escapes to Ravana and redirects the disaster toward a plan to abduct Sita.",
      hi: "खर का अंतिम द्वंद्व जनस्थान के अभियान को समाप्त करता है, पर अकम्पन बचकर रावण तक पहुँचता है और इस विनाश को सीता-हरण की योजना की ओर मोड़ देता है।",
    },
    sourceStart: 28,
    sourceEnd: 30,
    sourceGlobalOrdinal: 28,
    spanSha256s: [
      "843486302a8668bce6beaae2284703bfdb94ad298b23768872077c43b105d3e6",
      "35bf8e962dbed3c0e19d21c6168003e9b24e7ccbbd4b568d9fc7d8183306af90",
      "76872083edff96218c17551107725fa6c009f60cd5a921e2e2af0adf4bf240a3",
    ],
    nodeIds: janasthanaNodes,
    places: ["Janasthana battlefield", "Lanka"],
    moment: {
      id: "khara-falls-akampana-carries-news",
      decisiveChange: {
        en: "Janasthana falls, but its surviving report opens the road to Sita's abduction.",
        hi: "जनस्थान गिरता है, पर बचा हुआ समाचार सीता-हरण की राह खोल देता है।",
      },
      beats: [
        {
          id: "khara-enters-the-final-fight",
          title: { en: "Khara enters the final fight", hi: "खर अंतिम युद्ध में उतरता है" },
          narration: {
            en: "Khara finally attacks Rama directly. Fear has entered his calculation, but retreat would expose the destruction of his force and the failure of the authority Surpanakha challenged.",
            hi: "खर अंततः स्वयं राम पर आक्रमण करता है। अब उसके निर्णय में भय भी है, पर पीछे हटने का अर्थ अपनी सेना के विनाश और उस अधिकार की विफलता स्वीकार करना होगा जिसे शूर्पणखा ने चुनौती दी थी।",
          },
          visualCue: "Khara crosses the emptied field toward Rama with Janasthana's broken ranks behind him.",
          characterIds: ["khara", "rama", "surpanakha"],
        },
        {
          id: "khara-loses-his-chariot",
          title: { en: "Khara loses his chariot", hi: "खर अपना रथ खो देता है" },
          narration: {
            en: "The final battle strips away Khara's chariot and the distance it gives him. He continues on foot with a mace, turning a military campaign into a close and desperate confrontation.",
            hi: "अंतिम युद्ध खर का रथ और उससे मिलने वाली दूरी छीन लेता है। वह गदा लेकर पैदल लड़ता रहता है; सैन्य अभियान निकट और हताश द्वंद्व में बदल जाता है।",
          },
          visualCue: "A shattered chariot burns at the edge as Khara advances on foot through the smoke.",
          characterIds: ["khara", "rama"],
        },
        {
          id: "the-opponents-accuse-each-other",
          title: { en: "The opponents accuse each other", hi: "दोनों एक-दूसरे पर आरोप लगाते हैं" },
          narration: {
            en: "Before the end, Rama names the violence committed from Janasthana, while Khara answers with contempt and threats. The exchange makes the conflict a dispute over power and punishment as well as survival.",
            hi: "अंत से पहले राम जनस्थान से हुई हिंसा का आरोप लगाते हैं, जबकि खर तिरस्कार और धमकी से उत्तर देता है। यह संवाद संघर्ष को केवल जीवन-मरण नहीं, शक्ति और दंड के विवाद के रूप में भी सामने लाता है।",
          },
          visualCue: "The battle pauses at speaking distance while the devastated forest holds the cost around them.",
          characterIds: ["rama", "khara"],
        },
        {
          id: "the-mace-breaks",
          title: { en: "The mace breaks", hi: "गदा टूट जाती है" },
          narration: {
            en: "Khara throws his remaining strength into the mace, but Rama cuts it down. Even after losing weapon, chariot, commanders, and army, Khara continues the attack rather than yield.",
            hi: "खर अपनी बची शक्ति गदा में लगाता है, पर राम उसे काट देते हैं। अस्त्र, रथ, सेनापति और सेना खोने के बाद भी खर समर्पण के बजाय आक्रमण जारी रखता है।",
          },
          visualCue: "The broken mace spins into the dark earth as Khara closes the remaining distance.",
          characterIds: ["khara", "rama"],
        },
        {
          id: "khara-dies-and-janasthana-falls",
          title: { en: "Khara dies; Janasthana falls", hi: "खर मरता है, जनस्थान गिरता है" },
          narration: {
            en: "Rama kills Khara and the organized force from Janasthana is gone. Sita and Lakshmana can return from shelter, but the forest has been transformed by mass death and cannot return to its earlier quiet.",
            hi: "राम खर को मार देते हैं और जनस्थान की संगठित सेना समाप्त हो जाती है। सीता और लक्ष्मण आश्रय से लौट सकते हैं, पर व्यापक मृत्यु से बदला वन अपनी पुरानी शांति में वापस नहीं जा सकता।",
          },
          visualCue: "Sita and Lakshmana emerge toward a battlefield whose silence is heavier than the quiet before it.",
          characterIds: ["rama", "khara", "sita", "lakshmana"],
        },
        {
          id: "akampana-redirects-the-disaster",
          title: { en: "Akampana redirects the disaster", hi: "अकम्पन विनाश को नई योजना की ओर मोड़ता है" },
          narration: {
            en: "Akampana escapes and reaches Ravana with news that Khara, Dushana, Trishira, and their force are dead. Unable to offer a direct military answer, he describes Sita and suggests that separating her from Rama is the more vulnerable path.",
            hi: "अकम्पन बचकर रावण तक पहुँचता है और बताता है कि खर, दूषण, त्रिशिरा तथा उनकी सेना मारी गई है। सीधे युद्ध का उपाय न देखकर वह सीता का वर्णन करता है और राम से उन्हें अलग करने को अधिक कमज़ोर राह बताता है।",
          },
          visualCue: "A lone survivor crosses into Ravana's hall as the battlefield dissolves into the outline of a new threat.",
          characterIds: ["akampana", "ravana", "sita", "rama"],
        },
      ],
    },
  },
];
