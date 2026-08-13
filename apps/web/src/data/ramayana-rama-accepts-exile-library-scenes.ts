import type { StoryMoment } from "@/lib/domain/story-world";
import type { RamayanaLibraryScene } from "./ramayana-thin-turn-library-scenes";

const commonNodes = [
  "rama-accepts-exile-event",
  "ayodhya",
  "forest-exile",
  "rama",
  "kausalya",
  "lakshmana",
  "king-dasharatha",
];

export const RAMAYANA_RAMA_ACCEPTS_EXILE_LIBRARY_SCENES: RamayanaLibraryScene[] = [
  {
    id: "rama-answers-kaikeyi-and-leaves-the-chamber",
    turnId: "exile-accepted",
    detailOrdinal: 1,
    title: { en: "Rama answers Kaikeyi and leaves the chamber", hi: "राम कैकेयी को उत्तर देकर कक्ष से निकलते हैं" },
    synopsis: {
      en: "Rama accepts the forest order, asks why Dasharatha could not speak it himself, withstands Kaikeyi's pressure for immediate departure, and walks through the abandoned coronation preparations toward Kausalya.",
      hi: "राम वन जाने का आदेश स्वीकार करते हैं, पूछते हैं कि दशरथ स्वयं क्यों नहीं कह सके, तत्काल प्रस्थान के कैकेयी के दबाव को सहते हैं और छूटती राज्याभिषेक-सामग्री के बीच से कौसल्या की ओर बढ़ते हैं।",
    },
    sourceStart: 19,
    sourceEnd: 19,
    sourceGlobalOrdinal: 94,
    spanSha256s: ["4bf9ad8812da06c0066bcd63d9e0e0329dccbae8dabaf52a4e9322ad2f87dc6c"],
    nodeIds: commonNodes,
    places: ["Kaikeyi's room after the boons", "Coronation pavilion", "Road to Kausalya's apartments"],
    moment: {
      id: "rama-answers-kaikeyi-and-leaves-the-chamber",
      decisiveChange: {
        en: "The contested command becomes an immediate departure plan while Dasharatha remains unable to speak.",
        hi: "दशरथ के बोल न पाने के बीच विवादित आदेश तत्काल प्रस्थान की योजना बन जाता है।",
      },
      beats: [
        {
          id: "rama-accepts-with-one-question",
          title: { en: "Rama accepts with one painful question", hi: "राम एक पीड़ादायक प्रश्न के साथ स्वीकार करते हैं" },
          narration: {
            en: "Rama says Bharata may receive the kingdom and he will enter Dandaka for fourteen years. He does not bargain for power, but asks why Dasharatha—father, king, and teacher—could not tell him directly and now looks down in tears.",
            hi: "राम कहते हैं कि भरत राज्य लें और वे चौदह वर्ष के लिए दंडक वन चले जाएँगे। वे सत्ता का सौदा नहीं करते, पर पूछते हैं कि पिता, राजा और गुरु दशरथ यह बात स्वयं क्यों नहीं कह सके और आँसू बहाते हुए नीचे क्यों देख रहे हैं।",
          },
          visualCue: "Keep Rama between Kaikeyi's firm demand and Dasharatha's lowered, tearful silence.",
          characterIds: ["rama", "kaikeyi", "king-dasharatha", "bharata"],
        },
        {
          id: "kaikeyi-presses-for-speed",
          title: { en: "Kaikeyi presses for speed", hi: "कैकेयी तत्काल प्रस्थान पर जोर देती हैं" },
          narration: {
            en: "Kaikeyi treats Rama's consent as something that must be completed before anyone can reverse it. She says Dasharatha is silent from shame, orders messengers to fetch Bharata, and insists Rama leave before the king eats or bathes.",
            hi: "कैकेयी राम की सहमति को ऐसी बात मानती हैं जिसे किसी के बदलने से पहले पूरा कर लेना चाहिए। वे कहती हैं कि दशरथ लज्जा से मौन हैं, भरत को बुलाने के लिए दूत भेजती हैं और जोर देती हैं कि राजा के भोजन या स्नान से पहले राम निकलें।",
          },
          visualCue: "Make the chamber's exits and waiting messengers carry Kaikeyi's urgency without turning it into neutral logistics.",
          characterIds: ["kaikeyi", "rama", "king-dasharatha", "bharata", "messengers"],
        },
        {
          id: "dasharatha-falls-rama-bows",
          title: { en: "Dasharatha falls; Rama still bows", hi: "दशरथ गिरते हैं; राम फिर भी प्रणाम करते हैं" },
          narration: {
            en: "Dasharatha cries out and collapses. Rama lifts him, repeats that he will satisfy his father's word, asks leave to speak with Kausalya and Sita, then bows to both the insensible king and Kaikeyi before walking out with Lakshmana following in anger and tears.",
            hi: "दशरथ पुकारकर मूर्छित हो गिरते हैं। राम उन्हें सँभालते हैं, पिता का वचन पूरा करने की बात दोहराते हैं, कौसल्या और सीता से मिलने की अनुमति माँगते हैं, फिर अचेत राजा और कैकेयी दोनों को प्रणाम करके निकलते हैं; लक्ष्मण क्रोध और आँसुओं में पीछे चलते हैं।",
          },
          visualCue: "Let the bow before the collapsed king coexist with visible family rupture and Lakshmana's clenched anger.",
          characterIds: ["king-dasharatha", "rama", "kaikeyi", "lakshmana", "kausalya", "sita"],
        },
        {
          id: "coronation-objects-are-left-behind",
          title: { en: "Rama passes the life prepared for him", hi: "राम अपने लिए तैयार जीवन के पास से गुजरते हैं" },
          narration: {
            en: "Rama circles the installation house and looks at its assembled objects before setting aside umbrella, fly-whisks, chariot, and public procession. People search his face for collapse; he greets them gently and continues toward his mother while worrying about the damage the news will do to those he loves.",
            hi: "राम अभिषेक-गृह की परिक्रमा करते हैं और जुटी सामग्री को देखते हुए छत्र, चँवर, रथ और सार्वजनिक जुलूस पीछे छोड़ते हैं। लोग उनके चेहरे पर टूटन खोजते हैं; वे मधुरता से मिलते हुए माँ की ओर बढ़ते हैं और सोचते हैं कि यह समाचार प्रियजनों को कितना घायल करेगा।",
          },
          visualCue: "Track Rama past unused coronation objects while the crowd's hopeful lines fall away behind him.",
          characterIds: ["rama", "lakshmana", "ayodhya-citizens", "kausalya"],
        },
      ],
    } satisfies StoryMoment,
  },
  {
    id: "kausalya-hears-the-coronation-is-gone",
    turnId: "exile-accepted",
    detailOrdinal: 2,
    title: { en: "Kausalya hears the coronation is gone", hi: "कौसल्या सुनती हैं कि राज्याभिषेक नहीं होगा" },
    synopsis: {
      en: "Kausalya welcomes Rama amid blessings and ritual preparations, learns that his royal seat has become a forest mat, collapses, and gives voice to years of neglect, hope, fear, and the wish to follow him.",
      hi: "कौसल्या आशीर्वाद और अनुष्ठान की तैयारी के बीच राम का स्वागत करती हैं, जानती हैं कि राजसिंहासन वन की कुशा-चटाई बन गया है, गिर पड़ती हैं और वर्षों की उपेक्षा, आशा, भय तथा साथ चलने की इच्छा को स्वर देती हैं।",
    },
    sourceStart: 20,
    sourceEnd: 20,
    sourceGlobalOrdinal: 95,
    spanSha256s: ["c084c6450f76e73e6461116ff15a6c1f4a9f81abcebf1505cd7973f096f1c31d"],
    nodeIds: commonNodes,
    places: ["Kausalya's apartments", "Kausalya's worship room", "Inner palace"],
    moment: {
      id: "kausalya-hears-the-coronation-is-gone",
      decisiveChange: {
        en: "A mother's morning of fulfilment becomes an open account of family loss and unequal power.",
        hi: "माँ की पूर्णता की सुबह पारिवारिक हानि और असमान सत्ता का खुला बयान बन जाती है।",
      },
      beats: [
        {
          id: "the-palace-women-name-the-loss",
          title: { en: "The palace women name what is being lost", hi: "महल की स्त्रियाँ खोती चीज़ का नाम लेती हैं" },
          narration: {
            en: "As Rama leaves Kaikeyi's side, women in the inner palace cry that the person who cared for them without being asked is being sent away. Their grief widens the rupture beyond succession: dependants, older women, and ordinary household ties are losing a protector.",
            hi: "राम के कैकेयी के कक्ष से निकलते ही अंतःपुर की स्त्रियाँ विलाप करती हैं कि बिना कहे उनकी देखभाल करने वाला व्यक्ति भेजा जा रहा है। उनका शोक उत्तराधिकार से आगे जाता है—आश्रित, वृद्ध स्त्रियाँ और साधारण घरेलू संबंध एक सहारा खो रहे हैं।",
          },
          visualCue: "Let grief travel through interconnected household rooms rather than remain a private royal reaction.",
          characterIds: ["rama", "palace-women", "king-dasharatha"],
        },
        {
          id: "kausalya-waits-with-blessings",
          title: { en: "Kausalya waits with blessings ready", hi: "कौसल्या आशीर्वाद तैयार रखकर प्रतीक्षा करती हैं" },
          narration: {
            en: "Kausalya has spent the night praying and is preparing offerings for the coronation morning. She embraces Rama, blesses the future she believes has arrived, offers him a seat and food, and has not yet seen that every object around her now belongs to a cancelled life.",
            hi: "कौसल्या रातभर प्रार्थना कर राज्याभिषेक की सुबह के लिए अर्पण तैयार करती रही हैं। वे राम को गले लगाती हैं, आए हुए भविष्य का आशीर्वाद देती हैं, आसन और भोजन देती हैं—उन्हें अभी नहीं पता कि आसपास की हर वस्तु अब रद्द हो चुके जीवन की है।",
          },
          visualCue: "Hold Kausalya's prepared offerings and hopeful embrace before allowing the news to enter the room.",
          characterIds: ["kausalya", "rama", "lakshmana"],
        },
        {
          id: "the-seat-becomes-a-forest-mat",
          title: { en: "The seat becomes a forest mat", hi: "आसन वन की चटाई बन जाता है" },
          narration: {
            en: "Rama touches the offered seat but does not occupy it. He tells Kausalya that Bharata will be installed and he will live for fourteen years on forest roots and fruit, exchanging the prepared throne for ground covered with kusa grass.",
            hi: "राम दिए गए आसन को छूते हैं पर बैठते नहीं। वे कौसल्या को बताते हैं कि भरत का अभिषेक होगा और वे चौदह वर्ष वन के फल-मूल पर रहेंगे—तैयार सिंहासन की जगह कुशा बिछी भूमि होगी।",
          },
          visualCue: "Place the untouched royal seat opposite a simple imagined forest mat as the room understands the substitution.",
          characterIds: ["rama", "kausalya", "bharata", "lakshmana"],
        },
        {
          id: "kausalya-falls-and-rama-lifts-her",
          title: { en: "Kausalya falls and Rama lifts her", hi: "कौसल्या गिरती हैं और राम उन्हें उठाते हैं" },
          narration: {
            en: "Kausalya falls unconscious and dust covers the silk she wore for celebration. Rama kneels, lifts her, and wipes her gently. The story does not hurry from shock to doctrine; her body registers the news before argument begins.",
            hi: "कौसल्या मूर्छित होकर गिरती हैं और उत्सव के रेशमी वस्त्र धूल से भर जाते हैं। राम घुटनों पर बैठकर उन्हें उठाते और धीरे से धूल पोंछते हैं। कथा आघात से सीधे सिद्धांत पर नहीं जाती; बहस से पहले उनका शरीर समाचार को महसूस करता है।",
          },
          visualCue: "Bring mother and son to floor level while coronation preparations blur into unusable background.",
          characterIds: ["kausalya", "rama", "lakshmana"],
        },
        {
          id: "kausalya-names-years-of-neglect",
          title: { en: "Kausalya names years of neglect", hi: "कौसल्या वर्षों की उपेक्षा का नाम लेती हैं" },
          narration: {
            en: "Kausalya says her hope in Rama's future sustained her through neglect, rivalry, and diminished standing in the palace. She fears what will happen when he is absent, mourns the austerities with which she raised him, and says affection pulls her toward the forest after him.",
            hi: "कौसल्या कहती हैं कि राम के भविष्य की आशा ने उन्हें उपेक्षा, सौतों के तनाव और महल में घटती स्थिति के बीच जीवित रखा। वे उनके बिना होने वाली स्थिति से डरती हैं, पालन-पोषण की तपस्या याद करती हैं और कहती हैं कि स्नेह उन्हें पीछे-पीछे वन तक खींचता है।",
          },
          visualCue: "Connect Kausalya's present grief to remembered years of isolation without reducing her speech to generic maternal sorrow.",
          characterIds: ["kausalya", "rama", "kaikeyi", "king-dasharatha", "lakshmana"],
        },
      ],
    } satisfies StoryMoment,
  },
  {
    id: "lakshmana-calls-for-resistance",
    turnId: "exile-accepted",
    detailOrdinal: 3,
    title: { en: "Lakshmana calls for resistance", hi: "लक्ष्मण प्रतिरोध का आह्वान करते हैं" },
    synopsis: {
      en: "Lakshmana condemns the unexplained exile, proposes securing Rama's installation by force, escalates into threats against the city and even Dasharatha, while Kausalya asks Rama to recognise her claim before he answers them both.",
      hi: "लक्ष्मण बिना कारण दिए वनवास की निंदा करते हैं, बल से राम का अभिषेक कराने की बात कहते हैं, नगर और दशरथ तक के विरुद्ध धमकियों में बढ़ते हैं; कौसल्या अपने अधिकार की बात रखती हैं और फिर राम दोनों को उत्तर देते हैं।",
    },
    sourceStart: 21,
    sourceEnd: 21,
    sourceGlobalOrdinal: 96,
    spanSha256s: ["9b997bf4f8509b4f6815cd269fc4894b4196e852c631937e20c1531a87b8b514"],
    nodeIds: commonNodes,
    places: ["Kausalya's apartments", "Imagined Ayodhya battlefield", "Coronation pavilion"],
    moment: {
      id: "lakshmana-calls-for-resistance",
      decisiveChange: {
        en: "Private grief becomes an explicit proposal for violent succession conflict, which Rama refuses.",
        hi: "निजी शोक हिंसक उत्तराधिकार-संघर्ष के स्पष्ट प्रस्ताव में बदलता है, जिसे राम अस्वीकार करते हैं।",
      },
      beats: [
        {
          id: "lakshmana-calls-the-order-unjust",
          title: { en: "Lakshmana calls the order unjust", hi: "लक्ष्मण आदेश को अन्यायपूर्ण कहते हैं" },
          narration: {
            en: "Lakshmana says no fault in Rama can justify banishment and attacks Dasharatha's judgment under Kaikeyi's influence. His argument gives language to the obvious injustice, but it also begins turning a family wrong into a contest over who may use force.",
            hi: "लक्ष्मण कहते हैं कि राम में ऐसा कोई दोष नहीं जो वनवास को उचित ठहराए और कैकेयी के प्रभाव में दशरथ के निर्णय पर प्रहार करते हैं। उनका तर्क स्पष्ट अन्याय को शब्द देता है, पर साथ ही पारिवारिक अपराध को बल-प्रयोग की होड़ में बदलने लगता है।",
          },
          visualCue: "Keep the unjust command legible while showing Lakshmana's proposed remedy beginning to open dangerous routes.",
          characterIds: ["lakshmana", "rama", "king-dasharatha", "kaikeyi"],
        },
        {
          id: "he-offers-to-secure-the-throne",
          title: { en: "He offers to secure the throne", hi: "वे सिंहासन सुरक्षित करने का प्रस्ताव देते हैं" },
          narration: {
            en: "Before the decision becomes public, Lakshmana urges Rama to complete the installation under his armed protection. He claims loyalty and strength can prevent anyone from interrupting the ceremony and treats Rama's restraint as the reason injustice might succeed.",
            hi: "निर्णय सार्वजनिक होने से पहले लक्ष्मण राम से अपने सशस्त्र संरक्षण में अभिषेक पूरा करने को कहते हैं। वे मानते हैं कि निष्ठा और शक्ति समारोह को रोके जाने से बचा सकती है और राम की संयमता को अन्याय की सफलता का कारण समझते हैं।",
          },
          visualCue: "Illuminate the coronation route behind armed protection while Rama remains visibly unwilling to enter it.",
          characterIds: ["lakshmana", "rama", "ayodhya-citizens"],
        },
        {
          id: "anger-expands-to-collective-violence",
          title: { en: "Anger expands into collective violence", hi: "क्रोध सामूहिक हिंसा तक फैलता है" },
          narration: {
            en: "Lakshmana's speech escalates: he threatens supporters of Bharata, imagines depopulating Ayodhya, and even speaks of killing Dasharatha if the king acts as an enemy. These are an enraged character's threats, not endorsed action or current ethical instruction.",
            hi: "लक्ष्मण का भाषण बढ़ता जाता है—वे भरत के समर्थकों को धमकाते हैं, अयोध्या को उजाड़ने की कल्पना करते हैं और दशरथ को शत्रु मानने पर मारने तक की बात कहते हैं। ये क्रोधित पात्र की धमकियाँ हैं, स्वीकृत कर्म या आज की नैतिक शिक्षा नहीं।",
          },
          visualCue: "Mark the threatened city and family as potential victims; never stage this speech as a heroic combat invitation.",
          characterIds: ["lakshmana", "rama", "bharata", "king-dasharatha", "ayodhya-citizens"],
        },
        {
          id: "kausalya-asks-rama-to-recognise-her-claim",
          title: { en: "Kausalya asks Rama to recognise her claim", hi: "कौसल्या राम से अपने अधिकार को मानने को कहती हैं" },
          narration: {
            en: "Kausalya does not repeat Lakshmana's threats. She argues that a mother's authority and care also matter, asks Rama to remain with her, and says separation makes life unbearable. Her plea and Lakshmana's violence share a room but are not the same demand.",
            hi: "कौसल्या लक्ष्मण की धमकियाँ नहीं दोहरातीं। वे कहती हैं कि माँ का अधिकार और देखभाल भी महत्त्व रखते हैं, राम से रुकने को कहती हैं और बताती हैं कि वियोग जीवन असह्य कर देगा। उनकी विनती और लक्ष्मण की हिंसा एक कक्ष में हैं, पर एक जैसी माँग नहीं।",
          },
          visualCue: "Separate Kausalya's appeal for relationship from Lakshmana's armed path using distinct spatial lines.",
          characterIds: ["kausalya", "rama", "lakshmana"],
        },
        {
          id: "rama-refuses-violence-and-asks-for-release",
          title: { en: "Rama refuses violence and asks for release", hi: "राम हिंसा अस्वीकार कर विदा माँगते हैं" },
          narration: {
            en: "Rama says he will not defy Dasharatha's command and asks Lakshmana to abandon cruelty. He bows to Kausalya, promises to return after fulfilling the term, and asks her to stop the coronation rites and give the blessing she is not yet ready to give.",
            hi: "राम कहते हैं कि वे दशरथ के आदेश का उल्लंघन नहीं करेंगे और लक्ष्मण से क्रूरता छोड़ने को कहते हैं। वे कौसल्या को प्रणाम कर अवधि पूरी करके लौटने का वचन देते हैं और उनसे अभिषेक-विधि रोककर वह आशीर्वाद माँगते हैं जिसे देने के लिए वे अभी तैयार नहीं हैं।",
          },
          visualCue: "Close the armed route and return focus to Rama bowing before Kausalya with the unfinished ceremony between them.",
          characterIds: ["rama", "lakshmana", "kausalya", "king-dasharatha"],
        },
      ],
    } satisfies StoryMoment,
  },
  {
    id: "rama-turns-coronation-work-into-departure-work",
    turnId: "exile-accepted",
    detailOrdinal: 4,
    title: { en: "Rama turns coronation work into departure work", hi: "राम राज्याभिषेक की तैयारी को प्रस्थान की तैयारी बनाते हैं" },
    synopsis: {
      en: "Rama asks Lakshmana to dismantle the installation with the same care used to assemble it, explains his decision through an attributed appeal to destiny, and refuses to blame either parent while converting ceremony into departure.",
      hi: "राम लक्ष्मण से उसी सावधानी से अभिषेक-सामग्री हटाने को कहते हैं जिस तरह उसे जुटाया गया था, नियति की अपनी व्याख्या से निर्णय समझाते हैं और समारोह को प्रस्थान में बदलते हुए माता-पिता पर दोष लगाने से इंकार करते हैं।",
    },
    sourceStart: 22,
    sourceEnd: 22,
    sourceGlobalOrdinal: 97,
    spanSha256s: ["4e7a896a81b3c18b167ca066b1724727b27b0ec0be242c3113e9daaee7e18cb2"],
    nodeIds: commonNodes,
    places: ["Coronation pavilion", "Kausalya's apartments", "Imagined Dandaka road"],
    moment: {
      id: "rama-turns-coronation-work-into-departure-work",
      decisiveChange: {
        en: "The labour built for installation is redirected into an orderly exit rather than civil conflict.",
        hi: "अभिषेक के लिए किया श्रम गृह-संघर्ष की जगह व्यवस्थित प्रस्थान की ओर मोड़ दिया जाता है।",
      },
      beats: [
        {
          id: "rama-asks-lakshmana-to-lower-his-anger",
          title: { en: "Rama asks Lakshmana to lower his anger", hi: "राम लक्ष्मण से क्रोध शांत करने को कहते हैं" },
          narration: {
            en: "Rama sees anger and grief pulling Lakshmana toward action that cannot be undone. He asks his brother to recover patience, bear the insult without pretending it is pleasant, and make room for practical work.",
            hi: "राम देखते हैं कि क्रोध और शोक लक्ष्मण को ऐसे कर्म की ओर खींच रहे हैं जिसे लौटाया नहीं जा सकता। वे भाई से धैर्य वापस पाने, अपमान को सुखद बताए बिना सहने और व्यावहारिक काम के लिए जगह बनाने को कहते हैं।",
          },
          visualCue: "Move Lakshmana from an armed stance toward the scattered material tasks in front of him.",
          characterIds: ["rama", "lakshmana"],
        },
        {
          id: "the-installation-must-be-dismantled",
          title: { en: "The installation must be dismantled", hi: "अभिषेक की तैयारी हटानी होगी" },
          narration: {
            en: "Rama asks Lakshmana to expend as much care stopping the installation as he used collecting its materials. Jars, ornaments, and ceremonial routes must be reassigned because leaving them active would prolong Dasharatha's fear and the family's uncertainty.",
            hi: "राम लक्ष्मण से कहते हैं कि अभिषेक रोकने में उतनी ही सावधानी लगाएँ जितनी सामग्री जुटाने में लगी थी। कलश, आभूषण और समारोह की राहें बदलनी होंगी, क्योंकि उन्हें सक्रिय रखना दशरथ का भय और परिवार की अनिश्चितता बढ़ाएगा।",
          },
          visualCue: "Show many hands reversing the coronation setup carefully rather than smashing ceremonial objects in anger.",
          characterIds: ["rama", "lakshmana", "king-dasharatha", "palace-attendants"],
        },
        {
          id: "rama-attributes-the-shock-to-destiny",
          title: { en: "Rama attributes the shock to destiny", hi: "राम इस आघात को नियति से जोड़ते हैं" },
          narration: {
            en: "Rama says his equal affection for all his mothers and Kaikeyi's earlier affection make her reversal incomprehensible to him; he therefore calls it destiny. This is Rama's way of containing blame and grief in the scene, not a database claim that human choices caused nothing.",
            hi: "राम कहते हैं कि सभी माताओं के प्रति उनका समान स्नेह और कैकेयी का पुराना प्रेम इस बदलाव को समझ से बाहर बनाते हैं; इसलिए वे इसे नियति कहते हैं। यह दृश्य में दोष और शोक को सँभालने का राम का तरीका है, यह दावा नहीं कि मानवीय चुनावों का कोई कारण या परिणाम नहीं।",
          },
          visualCue: "Keep Kaikeyi's choices visible even as Rama uses a destiny frame to prevent Lakshmana's retaliatory path.",
          characterIds: ["rama", "lakshmana", "kaikeyi", "king-dasharatha"],
        },
        {
          id: "coronation-water-can-open-another-vow",
          title: { en: "Coronation water can open another vow", hi: "राज्याभिषेक का जल दूसरी प्रतिज्ञा खोल सकता है" },
          narration: {
            en: "Rama briefly imagines using the gathered water to begin the forest vow, then says even ordinary well water would suffice. He strips grandeur from the transition: the road does not require a substitute spectacle before it can begin.",
            hi: "राम क्षणभर सोचते हैं कि जुटा जल वन-व्रत आरंभ कर सकता है, फिर कहते हैं कि साधारण कुएँ का पानी भी पर्याप्त होगा। वे परिवर्तन से भव्यता हटा देते हैं—राह शुरू होने से पहले नए तमाशे की जरूरत नहीं।",
          },
          visualCue: "Reduce the field from ceremonial jars to one ordinary vessel and the road beyond it.",
          characterIds: ["rama", "lakshmana"],
        },
      ],
    } satisfies StoryMoment,
  },
  {
    id: "lakshmana-argues-against-destiny",
    turnId: "exile-accepted",
    detailOrdinal: 5,
    title: { en: "Lakshmana argues against destiny", hi: "लक्ष्मण नियति के विरुद्ध तर्क करते हैं" },
    synopsis: {
      en: "Lakshmana rejects destiny as an excuse for Dasharatha and Kaikeyi, argues that determined action can overturn the exile, offers to hold the kingdom for Rama, and again escalates into graphic threats before Rama returns to his chosen boundary.",
      hi: "लक्ष्मण दशरथ और कैकेयी के लिए नियति को बहाना मानने से इंकार करते हैं, कहते हैं कि दृढ़ कर्म वनवास पलट सकता है, राम के लिए राज्य सँभालने की पेशकश करते हैं और फिर हिंसक धमकियों तक बढ़ते हैं; राम अपनी चुनी सीमा पर लौटते हैं।",
    },
    sourceStart: 23,
    sourceEnd: 23,
    sourceGlobalOrdinal: 98,
    spanSha256s: ["a21d1b0d43b1c5efc24072647cde90ff677230efd4ae166feafb63192b2bbe25"],
    nodeIds: commonNodes,
    places: ["Kausalya's apartments", "Imagined coronation battlefield", "Ayodhya kingdom"],
    moment: {
      id: "lakshmana-argues-against-destiny",
      decisiveChange: {
        en: "Lakshmana fully states the action-first alternative, revealing both its appeal and its catastrophic cost.",
        hi: "लक्ष्मण कर्म-प्रधान विकल्प को पूरा सामने रखते हैं, जिससे उसका आकर्षण और विनाशकारी मूल्य दोनों खुलते हैं।",
      },
      beats: [
        {
          id: "lakshmana-rejects-destiny-as-an-excuse",
          title: { en: "Lakshmana rejects destiny as an excuse", hi: "लक्ष्मण नियति को बहाना मानने से इंकार करते हैं" },
          narration: {
            en: "Lakshmana says hidden destiny should not erase visible decisions by Dasharatha and Kaikeyi. He suspects the old promises are being used as a pious cover for transferring power and argues that accepting the explanation will teach the city to mistake coercion for virtue.",
            hi: "लक्ष्मण कहते हैं कि छिपी नियति दशरथ और कैकेयी के दिखते निर्णयों को मिटा नहीं सकती। उन्हें संदेह है कि पुराने वर सत्ता हस्तांतरण का धार्मिक आवरण बन रहे हैं और वे कहते हैं कि इसे मान लेना नगर को दबाव को धर्म समझना सिखाएगा।",
          },
          visualCue: "Keep the boon, command, and actors connected as visible choices while the destiny label is contested.",
          characterIds: ["lakshmana", "rama", "king-dasharatha", "kaikeyi"],
        },
        {
          id: "he-sets-human-effort-against-fate",
          title: { en: "He sets human effort against fate", hi: "वे पुरुषार्थ को भाग्य के सामने रखते हैं" },
          narration: {
            en: "Lakshmana argues that strength is proved by resisting harmful outcomes, not naming them inevitable. He promises the same city that watched destiny stop the coronation will watch determined human action defeat that result.",
            hi: "लक्ष्मण तर्क करते हैं कि शक्ति हानिकारक परिणाम को अनिवार्य कहने में नहीं, उसका प्रतिरोध करने में सिद्ध होती है। वे कहते हैं कि जिस नगर ने भाग्य को अभिषेक रोकते देखा, वही दृढ़ मानवीय कर्म को परिणाम पलटते देखेगा।",
          },
          visualCue: "Stage fate and effort as competing arguments, not supernatural meters that resolve the ethical dispute.",
          characterIds: ["lakshmana", "rama", "ayodhya-citizens"],
        },
        {
          id: "lakshmana-offers-to-hold-the-kingdom",
          title: { en: "Lakshmana offers to hold the kingdom", hi: "लक्ष्मण राज्य थामने की पेशकश करते हैं" },
          narration: {
            en: "He tells Rama to complete the installation and promises to protect the kingdom until a later, orderly forest retirement. In Lakshmana's imagined future, force now preserves justice and succession later; the unresolved question is who bears the violence needed to impose it.",
            hi: "वे राम से अभिषेक पूरा करने को कहते हैं और बाद के व्यवस्थित वन-प्रस्थान तक राज्य की रक्षा का वचन देते हैं। लक्ष्मण की कल्पना में अभी का बल न्याय और बाद का उत्तराधिकार बचाता है; अनुत्तरित प्रश्न है कि उसे थोपने की हिंसा कौन सहेगा।",
          },
          visualCue: "Open Lakshmana's proposed long reign but keep threatened civilians and family conflict visible beneath it.",
          characterIds: ["lakshmana", "rama", "ayodhya-citizens", "bharata"],
        },
        {
          id: "weapons-become-the-answer-in-his-speech",
          title: { en: "Weapons become the answer in his speech", hi: "उनके भाषण में शस्त्र उत्तर बन जाते हैं" },
          narration: {
            en: "Lakshmana names bow, sword, arrows, and his own hands as tools meant to destroy opposition, then describes mass battlefield harm. The detail exposes how rapidly righteous anger can make opponents, animals, soldiers, relatives, and a whole city expendable.",
            hi: "लक्ष्मण धनुष, तलवार, बाण और अपने हाथों को विरोध मिटाने के साधन कहते हैं और व्यापक रण-हानि का वर्णन करते हैं। यह विस्तार दिखाता है कि धार्मिक क्रोध कितनी जल्दी विरोधियों, पशुओं, सैनिकों, संबंधियों और पूरे नगर को खर्च करने योग्य मान सकता है।",
          },
          visualCue: "Represent the threatened casualties as people and living beings, not as satisfying combat targets or spectacle.",
          characterIds: ["lakshmana", "soldiers", "war-horses", "war-elephants", "ayodhya-citizens"],
        },
        {
          id: "rama-returns-to-his-boundary",
          title: { en: "Rama returns to his boundary", hi: "राम अपनी सीमा पर लौटते हैं" },
          narration: {
            en: "Rama wipes Lakshmana's tears and does not accept the army, throne, or enemies Lakshmana offers him. He repeats the decision that sets the next action: whatever anyone else thinks of fate or justice, he will not begin rule by overturning his father's order through bloodshed.",
            hi: "राम लक्ष्मण के आँसू पोंछते हैं और उनके दिए युद्ध, सिंहासन या शत्रु-निर्माण को स्वीकार नहीं करते। वे अगला कर्म तय करने वाला निर्णय दोहराते हैं—भाग्य या न्याय पर किसी की भी राय हो, वे रक्तपात से पिता का आदेश पलटकर शासन शुरू नहीं करेंगे।",
          },
          visualCue: "Close every battle route as Rama steadies Lakshmana without humiliating or endorsing his anger.",
          characterIds: ["rama", "lakshmana", "king-dasharatha"],
        },
      ],
    } satisfies StoryMoment,
  },
  {
    id: "kausalya-releases-rama-to-the-road",
    turnId: "exile-accepted",
    detailOrdinal: 6,
    title: { en: "Kausalya releases Rama to the road", hi: "कौसल्या राम को राह के लिए विदा देती हैं" },
    synopsis: {
      en: "Kausalya imagines Rama's forest deprivation and asks to follow; Rama urges her to remain with Dasharatha through a historically gendered duty argument; after repeated pleading she stops trying to prevent departure and prepares to bless him.",
      hi: "कौसल्या वन में राम के अभाव की कल्पना कर साथ चलने को कहती हैं; राम ऐतिहासिक स्त्री-कर्तव्य के तर्क से उन्हें दशरथ के पास रहने को कहते हैं; बार-बार की विनती के बाद वे प्रस्थान रोकना छोड़कर आशीर्वाद की तैयारी करती हैं।",
    },
    sourceStart: 24,
    sourceEnd: 24,
    sourceGlobalOrdinal: 99,
    spanSha256s: ["4cf1e66d6d0c247faf30e29e89e98f1f2001b86a675a2fa80d121795ab6bfdea"],
    nodeIds: commonNodes,
    places: ["Kausalya's apartments", "Imagined Dandaka forest", "Dasharatha's palace"],
    moment: {
      id: "kausalya-releases-rama-to-the-road",
      decisiveChange: {
        en: "Kausalya does not become unhurt or fully persuaded, but she stops withholding departure and turns toward protection.",
        hi: "कौसल्या न पीड़ा से मुक्त होती हैं, न पूरी तरह सहमत; फिर भी वे प्रस्थान रोकना छोड़कर सुरक्षा की ओर मुड़ती हैं।",
      },
      beats: [
        {
          id: "kausalya-imagines-the-daily-forest-life",
          title: { en: "Kausalya imagines the daily forest life", hi: "कौसल्या वन के रोज़मर्रा जीवन की कल्पना करती हैं" },
          narration: {
            en: "Kausalya asks how a person raised amid prepared food and attendants will live on gathered grain, roots, and fruit. Her grief moves from abstract exile to daily hunger, labour, distance, and counting the days until return.",
            hi: "कौसल्या पूछती हैं कि पका भोजन और सेवक देखने वाला व्यक्ति बटोरे अनाज, फल और मूल पर कैसे रहेगा। उनका शोक अमूर्त वनवास से रोज़ की भूख, श्रम, दूरी और वापसी तक दिन गिनने पर उतर आता है।",
          },
          visualCue: "Replace the generic forest icon with small recurring tasks and Kausalya's imagined calendar of absence.",
          characterIds: ["kausalya", "rama"],
        },
        {
          id: "she-asks-to-follow-like-a-mother",
          title: { en: "She asks to follow as his mother", hi: "वे माँ के रूप में साथ चलने को कहती हैं" },
          narration: {
            en: "Kausalya again asks to follow Rama rather than remain among painful palace relationships. Her request is not adventure; she imagines dependence, age, and sorrow moving together into the forest because separation feels worse.",
            hi: "कौसल्या फिर राम के साथ चलने को कहती हैं, बजाय उन पीड़ादायक महल-संबंधों में रहने के। उनकी माँग रोमांच की नहीं है; वे उम्र, निर्भरता और शोक को साथ वन में ले जाना चाहती हैं क्योंकि वियोग अधिक कठिन लगता है।",
          },
          visualCue: "Open a possible road for Kausalya that visibly carries age and care needs rather than a romanticised escape.",
          characterIds: ["kausalya", "rama", "king-dasharatha", "kaikeyi"],
        },
        {
          id: "rama-asks-her-to-remain-with-dasharatha",
          title: { en: "Rama asks her to remain with Dasharatha", hi: "राम उनसे दशरथ के पास रहने को कहते हैं" },
          narration: {
            en: "Rama fears Dasharatha may die if Kausalya also leaves and asks her to care for the old king. He supports this request with the era's prescriptive language about a wife's duty to her husband. The story attributes that claim to Rama and its historical setting; it does not turn it into universal modern guidance.",
            hi: "राम को भय है कि कौसल्या भी चली गईं तो दशरथ जीवित नहीं रहेंगे, इसलिए वे उनसे वृद्ध राजा की देखभाल को कहते हैं। वे इस अनुरोध को उस युग की पत्नी-कर्तव्य वाली निर्देशात्मक भाषा से सहारा देते हैं। कथा इस दावे को राम और उसके ऐतिहासिक संदर्भ से जोड़ती है; इसे आज का सार्वभौमिक निर्देश नहीं बनाती।",
          },
          visualCue: "Keep Dasharatha's real care need visible while labelling the gendered duty argument as attributed historical speech.",
          characterIds: ["rama", "kausalya", "king-dasharatha", "bharata"],
        },
        {
          id: "kausalya-can-no-longer-stop-him",
          title: { en: "Kausalya can no longer stop him", hi: "कौसल्या अब उन्हें रोक नहीं पातीं" },
          narration: {
            en: "Kausalya says she cannot live comfortably among the other queens, but recognises that Rama's resolution will not move. She does not declare the situation just. She releases the attempt to prevent him, asks him to return in peace, and lets hope occupy the space where persuasion failed.",
            hi: "कौसल्या कहती हैं कि दूसरी रानियों के बीच सहज रहना उनके लिए कठिन होगा, पर समझती हैं कि राम का निर्णय नहीं बदलेगा। वे स्थिति को न्यायपूर्ण घोषित नहीं करतीं। वे रोकने का प्रयास छोड़ती हैं, सुरक्षित लौटने को कहती हैं और जहाँ तर्क विफल हुआ वहाँ आशा को जगह देती हैं।",
          },
          visualCue: "Show a road opening through grief rather than a sudden conversion to agreement or happiness.",
          characterIds: ["kausalya", "rama", "king-dasharatha"],
        },
        {
          id: "grief-turns-toward-a-blessing",
          title: { en: "Grief turns toward a blessing", hi: "शोक आशीर्वाद की ओर मुड़ता है" },
          narration: {
            en: "Kausalya looks repeatedly at the son she cannot keep and begins preparing protection rites. The coming blessing is not proof that the exile has become acceptable; it is what she can still do when power over the decision is gone.",
            hi: "कौसल्या उस पुत्र को बार-बार देखती हैं जिसे रोक नहीं सकतीं और रक्षा-विधि की तैयारी करती हैं। आने वाला आशीर्वाद यह प्रमाण नहीं कि वनवास स्वीकार्य हो गया; निर्णय पर अधिकार खोने के बाद यही वह काम है जो वे अभी कर सकती हैं।",
          },
          visualCue: "Move Kausalya's hands from grasping at departure toward arranging protective materials, with tears still present.",
          characterIds: ["kausalya", "rama"],
        },
      ],
    } satisfies StoryMoment,
  },
  {
    id: "kausalya-builds-a-world-of-protection",
    turnId: "exile-accepted",
    detailOrdinal: 7,
    title: { en: "Kausalya builds a world of protection", hi: "कौसल्या सुरक्षा का पूरा संसार रचती हैं" },
    synopsis: {
      en: "Unable to stop the exile, Kausalya invokes worship, weapons, landscapes, creatures, time, household rites, remembered blessings, priests, an amulet, embrace, and the promised image of Rama's return before sending him onward to Sita.",
      hi: "वनवास रोक न सकने पर कौसल्या पूजा, शस्त्र, भू-दृश्य, जीव-जगत, समय, गृह-विधि, पुराने आशीर्वाद, पुरोहित, रक्षा-सूत्र, आलिंगन और राम की वापसी की कल्पना को एकत्र कर उन्हें सीता की ओर विदा करती हैं।",
    },
    sourceStart: 25,
    sourceEnd: 25,
    sourceGlobalOrdinal: 100,
    spanSha256s: ["f916e01f5a376033d7f60252fe3f86eedd9754bc17aa058b50ffd97a1ff66ec1"],
    nodeIds: commonNodes,
    places: ["Kausalya's worship room", "Imagined forest world", "Road to Sita's chamber"],
    moment: {
      id: "kausalya-builds-a-world-of-protection",
      decisiveChange: {
        en: "Kausalya converts helplessness into a layered act of care and finally sends Rama toward the next farewell.",
        hi: "कौसल्या असहायता को बहुस्तरीय देखभाल में बदलकर अंततः राम को अगली विदाई की ओर भेजती हैं।",
      },
      beats: [
        {
          id: "she-begins-with-ramas-lived-discipline",
          title: { en: "She begins with Rama's lived discipline", hi: "वे राम के अपने अनुशासन से आरंभ करती हैं" },
          narration: {
            en: "Kausalya first asks that the truthfulness, restraint, service, daily worship, and weapons training Rama has already practised protect him. Her blessing begins with capacities and relationships he carries, not a promise that danger will disappear.",
            hi: "कौसल्या पहले प्रार्थना करती हैं कि राम का सत्य, संयम, सेवा, दैनिक पूजा और प्राप्त शस्त्र-विद्या उनकी रक्षा करे। उनका आशीर्वाद उन क्षमताओं और संबंधों से शुरू होता है जिन्हें वे साथ ले जा रहे हैं, किसी खतरा-मुक्ति की गारंटी से नहीं।",
          },
          visualCue: "Link Rama's existing practices, mentors, and tools into the protection network before cosmic elements appear.",
          characterIds: ["kausalya", "rama", "vishvamitra", "king-dasharatha"],
        },
        {
          id: "the-landscape-and-creatures-enter-the-blessing",
          title: { en: "The landscape and creatures enter the blessing", hi: "भू-दृश्य और जीव आशीर्वाद में प्रवेश करते हैं" },
          narration: {
            en: "Mountains, trees, lakes, rivers, sky, earth, seasons, stars, animals, insects, and unseen beings are all named. The unknown forest is no longer a blank danger zone; Kausalya tries to turn every part of it into a possible ally rather than an enemy.",
            hi: "पर्वत, वृक्ष, झील, नदी, आकाश, धरती, ऋतु, तारे, पशु, कीट और अदृश्य जीव सबका नाम लिया जाता है। अज्ञात वन अब खाली खतरा नहीं रहता; कौसल्या उसके हर अंश को शत्रु की जगह संभावित सहायक बनाना चाहती हैं।",
          },
          visualCue: "As each element is named, connect it into one living forest network around the small travelling figure.",
          characterIds: ["kausalya", "rama", "forest-creatures", "seasons"],
        },
        {
          id: "time-and-direction-surround-the-road",
          title: { en: "Time and direction surround the road", hi: "समय और दिशाएँ राह को घेरती हैं" },
          narration: {
            en: "Days, nights, months, years, directions, planets, oceans, and guardians are invoked around Rama's journey. Fourteen years becomes a lived span moving through cycles rather than one number between departure and return.",
            hi: "दिन, रात, महीने, वर्ष, दिशाएँ, ग्रह, समुद्र और उनके रक्षक राम की यात्रा के चारों ओर पुकारे जाते हैं। चौदह वर्ष केवल प्रस्थान और वापसी के बीच की संख्या नहीं, बदलते चक्रों में जी जाने वाला समय बनता है।",
          },
          visualCue: "Wrap the forest route in changing light, seasons, direction, and calendars without implying a deterministic map.",
          characterIds: ["kausalya", "rama", "time", "four-oceans"],
        },
        {
          id: "the-household-completes-what-it-can",
          title: { en: "The household completes what it can", hi: "घर जितना कर सकता है उतना पूरा करता है" },
          narration: {
            en: "Kausalya works with priests, fire offerings, fragrant materials, food gifts, and payments to complete the protection ceremony. The household cannot cancel the political decision, but it can organise care, witness departure, and refuse to let Rama leave as if no one marked the loss.",
            hi: "कौसल्या पुरोहितों, अग्नि-अर्पण, सुगंधित सामग्री, भोजन और दक्षिणा के साथ रक्षा-विधि पूरी करती हैं। घर राजनीतिक निर्णय रद्द नहीं कर सकता, पर देखभाल संगठित कर सकता है, विदाई का साक्षी बन सकता है और राम को ऐसे नहीं जाने देता जैसे किसी ने हानि देखी ही न हो।",
          },
          visualCue: "Show coordinated household care through many small actions rather than foregrounding technical ritual apparatus.",
          characterIds: ["kausalya", "rama", "priests", "palace-attendants"],
        },
        {
          id: "older-protections-are-remembered",
          title: { en: "Older protections are remembered", hi: "पुराने संरक्षण याद किए जाते हैं" },
          narration: {
            en: "Kausalya recalls blessings associated with Indra, Garuda, Aditi, and Vishnu and directs their remembered success toward Rama. These comparisons enlarge her hope; they do not guarantee that the forest will reproduce those older victories.",
            hi: "कौसल्या इंद्र, गरुड़, अदिति और विष्णु से जुड़े पुराने आशीर्वाद याद कर उनकी स्मृत सफलता को राम की ओर मोड़ती हैं। ये तुलना उनकी आशा बढ़ाती हैं; वे यह गारंटी नहीं कि वन पुराने विजय-प्रसंग दोहराएगा।",
          },
          visualCue: "Render remembered protective stories as distant constellations feeding hope, never as guaranteed outcome badges.",
          characterIds: ["kausalya", "rama", "indra", "garuda", "aditi", "vishnu"],
        },
        {
          id: "amulet-embrace-and-return-image",
          title: { en: "An amulet, an embrace, and an image of return", hi: "रक्षा-सूत्र, आलिंगन और वापसी की छवि" },
          narration: {
            en: "Kausalya places grains on Rama's head, marks him with fragrant substances, ties a protective plant amulet, embraces him, and imagines seeing him return healthy to Ayodhya. She circles him, looks again and again, and Rama repeatedly bows before walking toward Sita's chamber.",
            hi: "कौसल्या राम के सिर पर अक्षत रखती हैं, सुगंध लगाती हैं, औषधीय रक्षा-सूत्र बाँधती हैं, गले लगाती हैं और उन्हें स्वस्थ अयोध्या लौटते देखने की कल्पना करती हैं। वे उनकी परिक्रमा करती, बार-बार देखती हैं; राम बार-बार प्रणाम कर सीता के कक्ष की ओर चलते हैं।",
          },
          visualCue: "End on repeated looks and bows, with the route to Sita opening only after the protection network is complete.",
          characterIds: ["kausalya", "rama", "sita"],
        },
      ],
    } satisfies StoryMoment,
  },
];
