import type { StoryCompass, StoryCompassArc, StoryCompassTurn } from "@/lib/domain/story-world";

type TurnSeed = Omit<StoryCompassTurn, "arcId" | "ordinal" | "places" | "coverage" | "sourceRange"> & {
  range: [number, number];
};

const sourceByArc: Record<string, { kandaSlug: string; sourceSha256: string }> = {
  beginnings: { kandaSlug: "bala", sourceSha256: "7d3b9e1613d60dfacea39f2564243e943cf38703eadb7245d92337b238082034" },
  exile: { kandaSlug: "ayodhya", sourceSha256: "7d3b9e1613d60dfacea39f2564243e943cf38703eadb7245d92337b238082034" },
  forest: { kandaSlug: "aranya", sourceSha256: "c3ef74a07ef0cf016eb0428deb76d6036d13be343c65225946471113a2da475b" },
  alliance: { kandaSlug: "kishkindha", sourceSha256: "c3ef74a07ef0cf016eb0428deb76d6036d13be343c65225946471113a2da475b" },
  leap: { kandaSlug: "sundara", sourceSha256: "c3ef74a07ef0cf016eb0428deb76d6036d13be343c65225946471113a2da475b" },
  war: { kandaSlug: "yuddha", sourceSha256: "8d1b8901823f5b5bd8b3207370991ddf95e5c76cb30ad5271aef835c9708464b" },
  aftermath: { kandaSlug: "uttara", sourceSha256: "076d03a68387f8ccd43b0cc211829f017ef120746d7b0f68a401f1c6fb4b221d" },
};

const seeds: Record<string, TurnSeed[]> = {
  beginnings: [
    { id: "story-finds-a-voice", title: { en: "A story finds its voice", hi: "कथा को स्वर मिलता है" }, hook: { en: "A question to Narada becomes Valmiki's vision, then a story taught to two young singers.", hi: "नारद से पूछा गया प्रश्न वाल्मीकि की दृष्टि और फिर दो बाल गायकों की कथा बनता है।" }, place: "Valmiki's hermitage", characters: ["Valmiki", "Narada", "Lava", "Kusha"], threads: ["storytelling", "memory"], range: [1, 4] },
    { id: "ayodhya-awaits-heirs", title: { en: "Ayodhya waits for heirs", hi: "अयोध्या उत्तराधिकारी की प्रतीक्षा करती है" }, hook: { en: "Dasharatha's longing draws the royal household toward the sacrifice and the births of four sons.", hi: "दशरथ की अभिलाषा राजपरिवार को यज्ञ और चार पुत्रों के जन्म तक ले जाती है।" }, place: "Ayodhya", characters: ["Dasharatha", "Kaushalya", "Kaikeyi", "Sumitra"], threads: ["family", "succession"], range: [5, 17] },
    { id: "princes-enter-world", title: { en: "The princes enter the wider world", hi: "राजकुमार बड़े संसार में प्रवेश करते हैं" }, hook: { en: "Vishvamitra leads Rama and Lakshmana beyond the palace, through danger, learning, and the protected rite.", hi: "विश्वामित्र राम और लक्ष्मण को महल से बाहर संकट, शिक्षा और यज्ञ-रक्षा की यात्रा पर ले जाते हैं।" }, place: "Siddhashrama road", characters: ["Rama", "Lakshmana", "Vishvamitra", "Tataka"], threads: ["coming of age", "duty"], range: [18, 30] },
    { id: "road-to-mithila", title: { en: "The road to Mithila", hi: "मिथिला की राह" }, hook: { en: "Every halt opens another remembered world before the travellers reach Ahalya and Janaka's city.", hi: "हर पड़ाव एक पुरानी कथा खोलता है, फिर यात्री अहल्या और जनक की नगरी तक पहुँचते हैं।" }, place: "Ganga to Mithila", characters: ["Rama", "Lakshmana", "Vishvamitra", "Ahalya"], threads: ["journey", "restoration"], range: [31, 48] },
    { id: "sita-and-the-bow", title: { en: "Sita and the impossible bow", hi: "सीता और असंभव धनुष" }, hook: { en: "Janaka's vow, Sita's future, and Rama's arrival meet when the ancient bow breaks.", hi: "जनक का प्रण, सीता का भविष्य और राम का आगमन प्राचीन धनुष टूटने पर एक हो जाते हैं।" }, place: "Mithila", characters: ["Sita", "Rama", "Janaka", "Vishvamitra"], threads: ["choice", "marriage"], range: [49, 65] },
    { id: "weddings-and-challenge", title: { en: "Weddings, then one last challenge", hi: "विवाह, फिर अंतिम चुनौती" }, hook: { en: "The families unite, but the homeward road is interrupted by Parashurama's fierce test.", hi: "परिवार एक होते हैं, पर घर लौटती राह पर परशुराम की कठोर चुनौती सामने आती है।" }, place: "Mithila to Ayodhya", characters: ["Rama", "Sita", "Lakshmana", "Parashurama"], threads: ["marriage", "identity"], range: [66, 75] },
  ],
  exile: [
    { id: "coronation-dawn", title: { en: "A coronation dawns", hi: "राज्याभिषेक की भोर" }, hook: { en: "Ayodhya prepares to welcome Rama as heir; joy fills the city before anyone knows the night will turn.", hi: "अयोध्या राम को युवराज बनाने की तैयारी करती है; रात बदलने से पहले नगर आनंद से भर जाता है।" }, place: "Ayodhya", characters: ["Rama", "Dasharatha", "Sita"], threads: ["kingship", "expectation"], range: [1, 6], playableMomentId: "coronation-dawn" },
    { id: "two-boons", title: { en: "Two boons change the kingdom", hi: "दो वरदान राज्य बदल देते हैं" }, hook: { en: "Manthara awakens Kaikeyi's fear, and an old promise becomes Bharata's crown and Rama's exile.", hi: "मंथरा कैकेयी का भय जगाती है और पुराना वचन भरत के राज्य तथा राम के वनवास में बदल जाता है।" }, place: "Kaikeyi's chamber", characters: ["Kaikeyi", "Manthara", "Dasharatha"], threads: ["promise", "fear"], range: [7, 18], playableMomentId: "manthara-sees-city" },
    { id: "exile-accepted", title: { en: "Rama accepts the exile", hi: "राम वनवास स्वीकार करते हैं" }, hook: { en: "Rama chooses his father's word; Sita and Lakshmana refuse to let him face the forest alone.", hi: "राम पिता का वचन निभाते हैं; सीता और लक्ष्मण उन्हें वन में अकेले जाने नहीं देते।" }, place: "Ayodhya palace", characters: ["Rama", "Sita", "Lakshmana", "Dasharatha"], threads: ["duty", "companionship"], range: [19, 40], playableMomentId: "rama-accepts-exile" },
    { id: "road-out-of-ayodhya", title: { en: "The road out of Ayodhya", hi: "अयोध्या से बाहर की राह" }, hook: { en: "Citizens follow, Guha helps at the Ganga, and the three travellers make a forest home at Chitrakuta.", hi: "नगरवासी पीछे चलते हैं, गंगा पर गुह सहायता करते हैं और तीनों चित्रकूट में वन-घर बनाते हैं।" }, place: "Ayodhya to Chitrakuta", characters: ["Rama", "Sita", "Lakshmana", "Guha"], threads: ["departure", "friendship"], range: [41, 57], playableMomentId: "city-follows-car" },
    { id: "king-dies-bharata-returns", title: { en: "A king dies; Bharata returns", hi: "राजा का अंत, भरत की वापसी" }, hook: { en: "Dasharatha dies in grief. Bharata returns to a crown he never asked for and learns how it was won.", hi: "दशरथ शोक में प्राण त्यागते हैं। भरत लौटकर उस सिंहासन का सत्य जानते हैं जिसे उन्होंने कभी माँगा नहीं।" }, place: "Ayodhya", characters: ["Dasharatha", "Bharata", "Kaikeyi", "Shatrughna"], threads: ["grief", "succession"], range: [58, 75] },
    { id: "bharata-follows", title: { en: "Bharata follows the forest road", hi: "भरत वन की राह पकड़ते हैं" }, hook: { en: "With the queens, ministers, and citizens, Bharata travels to bring Rama home.", hi: "रानियों, मंत्रियों और नगरवासियों के साथ भरत राम को वापस लाने निकलते हैं।" }, place: "Ayodhya to Chitrakuta", characters: ["Bharata", "Shatrughna", "Kaushalya", "Guha"], threads: ["repair", "journey"], range: [76, 90] },
    { id: "sandals-and-promise", title: { en: "The sandals carry the promise", hi: "पादुकाएँ वचन सँभालती हैं" }, hook: { en: "Brothers argue from love and duty; Rama stays, while Bharata takes the sandals to rule only in trust.", hi: "भाई प्रेम और कर्तव्य के बीच संवाद करते हैं; राम रहते हैं और भरत पादुकाओं के नाम पर राज्य सँभालते हैं।" }, place: "Chitrakuta", characters: ["Rama", "Bharata", "Sita", "Lakshmana"], threads: ["brotherhood", "legitimacy"], range: [91, 113] },
    { id: "deeper-into-forest", title: { en: "Deeper into the forest", hi: "वन के और भीतर" }, hook: { en: "After the family departs, the forest grows crowded with memory and Rama moves farther from Chitrakuta.", hi: "परिवार के लौटने के बाद चित्रकूट स्मृतियों से भर जाता है और राम वन में आगे बढ़ते हैं।" }, place: "Chitrakuta to Dandaka", characters: ["Rama", "Sita", "Lakshmana"], threads: ["separation", "journey"], range: [114, 118] },
  ],
  forest: [
    { id: "dandaka-vows", title: { en: "Vows in Dandaka", hi: "दंडक वन में प्रतिज्ञाएँ" }, hook: { en: "The travellers meet ascetics, face Viradha, and enter a forest where protection carries moral cost.", hi: "यात्री ऋषियों से मिलते, विराध का सामना करते और ऐसे वन में प्रवेश करते हैं जहाँ रक्षा का मूल्य है।" }, place: "Dandaka forest", characters: ["Rama", "Sita", "Lakshmana", "Viradha"], threads: ["protection", "violence"], range: [1, 12] },
    { id: "panchavati-surpanakha", title: { en: "Panchavati and Surpanakha", hi: "पंचवटी और शूर्पणखा" }, hook: { en: "A forest home, Jatayu's friendship, and Surpanakha's arrival turn quiet life toward conflict.", hi: "वन-घर, जटायु की मित्रता और शूर्पणखा का आगमन शांत जीवन को संघर्ष की ओर मोड़ते हैं।" }, place: "Panchavati", characters: ["Rama", "Sita", "Lakshmana", "Surpanakha", "Jatayu"], threads: ["home", "desire"], range: [13, 17] },
    { id: "war-at-janasthana", title: { en: "War reaches Janasthana", hi: "जनस्थान तक युद्ध पहुँचता है" }, hook: { en: "Surpanakha calls Khara's forces; their destruction carries news of Rama to Ravana.", hi: "शूर्पणखा खर की सेना बुलाती है; उसका विनाश राम का समाचार रावण तक पहुँचाता है।" }, place: "Janasthana", characters: ["Rama", "Surpanakha", "Khara", "Akampana"], threads: ["escalation", "revenge"], range: [18, 30] },
    { id: "golden-deer-plot", title: { en: "The golden deer plot", hi: "स्वर्ण-मृग की योजना" }, hook: { en: "Ravana bends Maricha's fear into a deception designed to separate the forest household.", hi: "रावण मारीच के भय को छल में बदलता है ताकि वन का परिवार अलग हो जाए।" }, place: "Lanka to Panchavati", characters: ["Ravana", "Maricha", "Sita", "Rama"], threads: ["deception", "abduction"], range: [31, 42] },
    { id: "sita-is-taken", title: { en: "Sita is taken", hi: "सीता का हरण" }, hook: { en: "The cry draws Lakshmana away; Ravana seizes Sita, and Jatayu rises against him in the sky.", hi: "पुकार लक्ष्मण को दूर ले जाती है; रावण सीता का हरण करता है और जटायु आकाश में उसका सामना करते हैं।" }, place: "Panchavati sky-road", characters: ["Sita", "Ravana", "Jatayu", "Lakshmana"], threads: ["abduction", "resistance"], range: [43, 53] },
    { id: "broken-trail", title: { en: "The broken trail", hi: "टूटी हुई खोज-राह" }, hook: { en: "Rama and Lakshmana return to emptiness, search through grief, and find the dying Jatayu.", hi: "राम और लक्ष्मण खाली आश्रम लौटते हैं, शोक में खोजते हैं और अंतिम साँस लेते जटायु को पाते हैं।" }, place: "Panchavati forest", characters: ["Rama", "Lakshmana", "Jatayu"], threads: ["grief", "search"], range: [54, 68] },
    { id: "toward-pampa", title: { en: "Toward Pampa and a new ally", hi: "पंपा और नए साथी की ओर" }, hook: { en: "Kabandha points toward Sugriva; Savari's welcome carries the brothers to Pampa and the next world.", hi: "कबंध सुग्रीव की दिशा बताते हैं; शबरी का स्वागत भाइयों को पंपा और अगले संसार तक पहुँचाता है।" }, place: "Dandaka to Pampa", characters: ["Rama", "Lakshmana", "Kabandha", "Savari"], threads: ["guidance", "hospitality"], range: [69, 75] },
  ],
  alliance: [
    { id: "hanuman-meets-rama", title: { en: "Hanuman meets Rama", hi: "हनुमान राम से मिलते हैं" }, hook: { en: "At Pampa, a careful stranger's questions become recognition and a path to Sugriva.", hi: "पंपा पर एक सावधान अजनबी के प्रश्न पहचान और सुग्रीव तक पहुँचने की राह बनते हैं।" }, place: "Pampa and Rishyamuka", characters: ["Hanuman", "Rama", "Lakshmana", "Sugriva"], threads: ["recognition", "friendship"], range: [1, 5] },
    { id: "two-losses-one-alliance", title: { en: "Two losses, one alliance", hi: "दो वियोग, एक मैत्री" }, hook: { en: "Rama and Sugriva exchange their wounds and promises; proof of strength turns hope into a plan.", hi: "राम और सुग्रीव अपने दुख और वचन साझा करते हैं; शक्ति का प्रमाण आशा को योजना बनाता है।" }, place: "Rishyamuka", characters: ["Rama", "Sugriva", "Hanuman", "Vali"], threads: ["alliance", "trust"], range: [6, 14] },
    { id: "vali-falls", title: { en: "Vali falls; Kishkindha changes", hi: "वालि का अंत, किष्किंधा का परिवर्तन" }, hook: { en: "The brothers fight, Rama's arrow intervenes, and grief, argument, succession, and responsibility follow.", hi: "भाइयों का युद्ध होता है, राम का बाण हस्तक्षेप करता है और फिर शोक, तर्क, उत्तराधिकार तथा दायित्व आते हैं।" }, place: "Kishkindha", characters: ["Vali", "Sugriva", "Rama", "Tara", "Angada"], threads: ["justice", "succession"], range: [15, 26] },
    { id: "rains-and-delay", title: { en: "Rains, waiting, and a forgotten promise", hi: "वर्षा, प्रतीक्षा और भूला वचन" }, hook: { en: "The monsoon closes the roads; when it clears, Rama's grief collides with Sugriva's delay.", hi: "वर्षा मार्ग बंद करती है; उसके बाद राम का शोक सुग्रीव की देरी से टकराता है।" }, place: "Prasravana and Kishkindha", characters: ["Rama", "Lakshmana", "Sugriva", "Tara"], threads: ["waiting", "accountability"], range: [27, 39] },
    { id: "search-every-horizon", title: { en: "Search every horizon", hi: "हर दिशा में खोज" }, hook: { en: "Vast teams receive landscapes, dangers, deadlines, and one purpose: discover where Sita was taken.", hi: "विशाल दलों को भू-दृश्य, संकट, समय-सीमा और एक लक्ष्य मिलता है—सीता को खोजना।" }, place: "Kishkindha and four directions", characters: ["Sugriva", "Hanuman", "Angada", "Jambavan"], threads: ["search", "leadership"], range: [40, 49] },
    { id: "sampati-reveals-lanka", title: { en: "At the edge of despair, Sampati sees Lanka", hi: "निराशा के किनारे संपाति लंका देखते हैं" }, hook: { en: "The southern party nearly gives up; Jatayu's brother turns grief into the missing direction.", hi: "दक्षिणी दल हार मानने वाला होता है; जटायु के भाई का शोक उन्हें सही दिशा देता है।" }, place: "Vindhya to southern ocean", characters: ["Angada", "Hanuman", "Jambavan", "Sampati"], threads: ["despair", "discovery"], range: [50, 64] },
    { id: "hanuman-remembers", title: { en: "Hanuman remembers his strength", hi: "हनुमान अपनी शक्ति याद करते हैं" }, hook: { en: "Each hero measures the ocean; Jambavan's words awaken the one leap that can continue the story.", hi: "हर वीर समुद्र की दूरी आँकता है; जाम्बवान के शब्द उस छलाँग की शक्ति जगाते हैं जो कथा आगे बढ़ाएगी।" }, place: "Southern ocean", characters: ["Hanuman", "Jambavan", "Angada"], threads: ["courage", "awakening"], range: [65, 67] },
  ],
  leap: [
    { id: "leap-across-ocean", title: { en: "The leap across the ocean", hi: "समुद्र पार की छलाँग" }, hook: { en: "Hanuman expands into his task, meets wonders and obstacles in the sky, and reaches Lanka alone.", hi: "हनुमान अपने कार्य के अनुरूप विशाल होते हैं, आकाश के संकट पार कर अकेले लंका पहुँचते हैं।" }, place: "Ocean to Lanka", characters: ["Hanuman", "Mainaka", "Surasa", "Simhika"], threads: ["courage", "journey"], range: [1, 4] },
    { id: "searching-lanka", title: { en: "Searching the sleeping city", hi: "सोती नगरी में खोज" }, hook: { en: "Hanuman moves unseen through palaces and streets, resisting false conclusions until another grove appears.", hi: "हनुमान महलों और गलियों में अदृश्य चलते हैं, जल्दबाज़ी के निष्कर्ष रोकते हैं और एक नए उपवन तक पहुँचते हैं।" }, place: "Lanka", characters: ["Hanuman", "Ravana", "Mandodari"], threads: ["search", "discernment"], range: [5, 14] },
    { id: "sita-in-ashoka-grove", title: { en: "Sita in the ashoka grove", hi: "अशोक वाटिका में सीता" }, hook: { en: "Hanuman finds Sita surrounded by threats, hears Ravana's demand, and waits for a safe way to speak.", hi: "हनुमान सीता को धमकियों के बीच पाते हैं, रावण की माँग सुनते हैं और बोलने का सुरक्षित समय खोजते हैं।" }, place: "Ashoka grove", characters: ["Sita", "Hanuman", "Ravana", "Trijata"], threads: ["endurance", "witness"], range: [15, 29] },
    { id: "messenger-and-token", title: { en: "A messenger, a ring, and a reply", hi: "दूत, मुद्रिका और उत्तर" }, hook: { en: "Rama's story earns Sita's trust; tokens and private memories become proof carried in both directions.", hi: "राम की कथा सीता का विश्वास जीतती है; चिह्न और निजी स्मृतियाँ दोनों दिशाओं में प्रमाण बनती हैं।" }, place: "Ashoka grove", characters: ["Sita", "Hanuman", "Rama"], threads: ["recognition", "message"], range: [30, 39] },
    { id: "lanka-burns", title: { en: "The garden breaks; Lanka burns", hi: "वाटिका टूटती है, लंका जलती है" }, hook: { en: "Hanuman chooses visible disruption, faces Ravana's court, and turns the punishment of his tail into fire.", hi: "हनुमान खुली चुनौती चुनते हैं, रावण की सभा का सामना करते हैं और पूँछ की सज़ा को अग्नि बना देते हैं।" }, place: "Lanka", characters: ["Hanuman", "Ravana", "Indrajit", "Vibhishana"], threads: ["defiance", "warning"], range: [40, 54] },
    { id: "return-over-ocean", title: { en: "The return over the ocean", hi: "समुद्र के ऊपर वापसी" }, hook: { en: "Hanuman confirms Sita is safe, crosses back, and lets the waiting search party hear success in his roar.", hi: "हनुमान सीता की कुशलता देखकर लौटते हैं और उनकी गर्जना से प्रतीक्षारत दल सफलता पहचान लेता है।" }, place: "Lanka to Mahendra", characters: ["Hanuman", "Sita", "Angada", "Jambavan"], threads: ["return", "hope"], range: [55, 60] },
    { id: "news-reaches-rama", title: { en: "The news reaches Rama", hi: "समाचार राम तक पहुँचता है" }, hook: { en: "Celebration spills through Madhuvana before Hanuman gives Rama Sita's jewel, words, and remaining time.", hi: "मधुवन में उत्सव के बाद हनुमान राम को सीता की मणि, संदेश और शेष समय बताते हैं।" }, place: "Madhuvana to Prasravana", characters: ["Hanuman", "Rama", "Lakshmana", "Sugriva"], threads: ["message", "mobilization"], range: [61, 66] },
  ],
  war: [
    { id: "ocean-and-bridge", title: { en: "The ocean, Vibhishana, and the bridge", hi: "समुद्र, विभीषण और सेतु" }, hook: { en: "The allies reach the sea, receive Ravana's brother, confront the ocean, and make a road to Lanka.", hi: "साथी समुद्र तक पहुँचते हैं, रावण के भाई को स्वीकार करते हैं और लंका तक सेतु बनाते हैं।" }, place: "Ocean crossing", characters: ["Rama", "Lakshmana", "Vibhishana", "Nala"], threads: ["refuge", "engineering"], range: [1, 24] },
    { id: "lanka-surrounded", title: { en: "Lanka is surrounded", hi: "लंका घिर जाती है" }, hook: { en: "Spies, counsel, a final embassy, and the first assaults make retreat less possible for every side.", hi: "गुप्तचर, सलाह, अंतिम दूत और शुरुआती आक्रमण दोनों पक्षों के लिए पीछे हटना कठिन कर देते हैं।" }, place: "Lanka and Suvela", characters: ["Rama", "Ravana", "Angada", "Sugriva"], threads: ["diplomacy", "siege"], range: [25, 44] },
    { id: "kumbhakarna-rises", title: { en: "Kumbhakarna rises", hi: "कुंभकर्ण उठता है" }, hook: { en: "War consumes commanders until the sleeping giant enters, questions Ravana, fights, and falls.", hi: "युद्ध सेनापतियों को निगलता है; फिर निद्रा से उठा कुंभकर्ण रावण से प्रश्न कर युद्ध में गिरता है।" }, place: "Lanka battlefield", characters: ["Kumbhakarna", "Ravana", "Rama", "Sugriva"], threads: ["war", "loyalty"], range: [45, 69] },
    { id: "indrajits-last-war", title: { en: "Indrajit's last war", hi: "इंद्रजीत का अंतिम युद्ध" }, hook: { en: "Illusion, hidden weapons, and the battle at Nikumbhila lead Lakshmana to Ravana's formidable son.", hi: "माया, अदृश्य अस्त्र और निकुंभिला का युद्ध लक्ष्मण को रावण के प्रबल पुत्र तक ले जाता है।" }, place: "Lanka and Nikumbhila", characters: ["Indrajit", "Lakshmana", "Hanuman", "Vibhishana"], threads: ["illusion", "sacrifice"], range: [70, 90] },
    { id: "ravanas-final-battle", title: { en: "Ravana's final battle", hi: "रावण का अंतिम युद्ध" }, hook: { en: "After Lakshmana is wounded and restored, Rama meets Ravana through a long final exchange of weapons.", hi: "लक्ष्मण के घायल होकर बचने के बाद राम और रावण का दीर्घ अंतिम अस्त्र-युद्ध होता है।" }, place: "Lanka battlefield", characters: ["Rama", "Ravana", "Lakshmana", "Matali"], threads: ["war", "ending"], range: [91, 108] },
    { id: "sita-and-aftermath", title: { en: "Sita and the aftermath of victory", hi: "सीता और विजय का परिणाम" }, hook: { en: "Grief enters Lanka; Sita is brought before Rama, faces public ordeal, and the gods answer the battlefield.", hi: "लंका शोक में डूबती है; सीता राम के सामने आती हैं, सार्वजनिक परीक्षा का सामना करती हैं और देवता उत्तर देते हैं।" }, place: "Lanka", characters: ["Sita", "Rama", "Vibhishana", "Mandodari"], threads: ["aftermath", "public judgment"], range: [109, 121] },
    { id: "road-home", title: { en: "The road home", hi: "घर वापसी की राह" }, hook: { en: "The Pushpaka retraces the whole world, news reaches Bharata, and Ayodhya receives the returning company.", hi: "पुष्पक पूरे संसार की राह लौटता है, समाचार भरत तक पहुँचता है और अयोध्या लौटते दल का स्वागत करती है।" }, place: "Lanka to Ayodhya", characters: ["Rama", "Sita", "Hanuman", "Bharata"], threads: ["homecoming", "memory"], range: [122, 128], playableMomentId: "leave-lanka" },
  ],
  aftermath: [
    { id: "origins-behind-war", title: { en: "The histories behind the war", hi: "युद्ध के पीछे की कथाएँ" }, hook: { en: "Visiting sages unfold the origins, ambitions, boons, families, and earlier conflicts behind Ravana's world.", hi: "आए हुए ऋषि रावण के संसार के जन्म, वरदान, परिवार, महत्वाकांक्षा और पुराने संघर्ष खोलते हैं।" }, place: "Ayodhya and remembered worlds", characters: ["Rama", "Agastya", "Ravana", "Vibhishana"], threads: ["backstory", "consequence"], range: [1, 45] },
    { id: "companions-depart", title: { en: "Companions depart; public voices remain", hi: "साथी विदा होते हैं, लोक-वाणी रह जाती है" }, hook: { en: "Allies return home while Rama asks what the city says; private happiness meets public reputation.", hi: "साथी अपने घर लौटते हैं और राम नगर की वाणी पूछते हैं; निजी सुख लोक-प्रतिष्ठा से टकराता है।" }, place: "Ayodhya", characters: ["Rama", "Sita", "Hanuman", "Bhadra"], threads: ["kingship", "public voice"], range: [46, 53] },
    { id: "sita-sent-away", title: { en: "Sita is sent away", hi: "सीता को वन भेजा जाता है" }, hook: { en: "Rama responds to censure by ordering Lakshmana to leave the pregnant Sita near Valmiki's hermitage.", hi: "लोक-निंदा के उत्तर में राम लक्ष्मण को गर्भवती सीता को वाल्मीकि आश्रम के पास छोड़ने कहते हैं।" }, place: "Ayodhya to Valmiki's hermitage", characters: ["Sita", "Rama", "Lakshmana", "Valmiki"], threads: ["separation", "public duty"], range: [54, 61] },
    { id: "kingdom-tales-and-twins", title: { en: "Kingdom tales and the birth of the twins", hi: "राज्य-कथाएँ और जुड़वाँ पुत्रों का जन्म" }, hook: { en: "Later acts of rule interweave with Shatrughna's campaign and the birth and naming of Lava and Kusha.", hi: "राज्य के प्रसंग शत्रुघ्न के अभियान तथा लव-कुश के जन्म और नामकरण से जुड़ते हैं।" }, place: "Ayodhya, Madhura, Valmiki's hermitage", characters: ["Shatrughna", "Lavana", "Sita", "Lava", "Kusha"], threads: ["kingdom", "new generation"], range: [62, 84] },
    { id: "later-reign", title: { en: "The later reign turns toward sacrifice", hi: "उत्तरकालीन शासन यज्ञ की ओर बढ़ता है" }, hook: { en: "Judgments, visitors, and kingdom narratives accumulate until Rama begins the great horse sacrifice.", hi: "निर्णय, अतिथि और राज्य-कथाएँ एकत्र होती हैं और अंततः राम अश्वमेध आरंभ करते हैं।" }, place: "Kosala and neighbouring realms", characters: ["Rama", "Lakshmana", "Bharata", "Shatrughna"], threads: ["governance", "ritual"], range: [85, 102] },
    { id: "twins-sing-sita-returns", title: { en: "The twins sing; Sita returns", hi: "जुड़वाँ कथा गाते हैं, सीता लौटती हैं" }, hook: { en: "Lava and Kusha sing the Ramayana before Rama; recognition leads to Sita's final public testimony and return to Earth.", hi: "लव-कुश राम के सामने रामायण गाते हैं; पहचान सीता की अंतिम सार्वजनिक साक्षी और पृथ्वी में वापसी तक जाती है।" }, place: "Horse-sacrifice ground", characters: ["Lava", "Kusha", "Rama", "Sita", "Valmiki"], threads: ["storytelling", "recognition"], range: [103, 110] },
    { id: "last-departures", title: { en: "The last departures", hi: "अंतिम प्रस्थान" }, hook: { en: "The reign continues, then Lakshmana and Rama meet the limits of vows and walk toward the Sarayu.", hi: "शासन चलता रहता है; फिर लक्ष्मण और राम वचनों की अंतिम सीमा पर सरयू की ओर बढ़ते हैं।" }, place: "Ayodhya and Sarayu", characters: ["Rama", "Lakshmana", "Bharata", "Lava", "Kusha"], threads: ["departure", "legacy"], range: [111, 123] },
  ],
};

const placesByTurn: Record<string, string[]> = {
  "story-finds-a-voice": ["Valmiki's hermitage"],
  "ayodhya-awaits-heirs": ["Ayodhya"],
  "princes-enter-world": ["Ayodhya", "Siddhashrama"],
  "road-to-mithila": ["Ganga", "Ahalya's hermitage", "Mithila"],
  "sita-and-the-bow": ["Mithila"],
  "weddings-and-challenge": ["Mithila", "Ayodhya"],
  "coronation-dawn": ["Ayodhya"],
  "two-boons": ["Ayodhya"],
  "exile-accepted": ["Ayodhya"],
  "road-out-of-ayodhya": ["Ayodhya", "The Tamasa riverbank", "The road beyond Kosala", "Shringaverapura", "The Ganga crossing", "The first forest night", "The confluence at Prayaga", "The Yamuna crossing", "The cottage at Chitrakoot", "Chitrakuta"],
  "king-dies-bharata-returns": ["Ayodhya", "The silent city", "The darkened royal chamber", "The Sarayu of an old memory", "The palace between death and succession", "The urgent road from Kekaya", "Kaikeyi's room after the boons", "The funeral bank of the Sarayu"],
  "bharata-follows": ["Ayodhya", "The road prepared for Rama", "Shringaverapura", "Chitrakuta"],
  "sandals-and-promise": ["Chitrakuta"],
  "deeper-into-forest": ["Chitrakuta", "Dandaka"],
  "dandaka-vows": ["Dandaka"],
  "panchavati-surpanakha": ["Panchavati"],
  "war-at-janasthana": ["Janasthana"],
  "golden-deer-plot": ["Lanka", "Panchavati"],
  "sita-is-taken": ["Panchavati"],
  "broken-trail": ["Panchavati"],
  "toward-pampa": ["Dandaka", "Savari's hermitage", "Pampa"],
  "hanuman-meets-rama": ["Pampa", "Rishyamuka"],
  "two-losses-one-alliance": ["Rishyamuka"],
  "vali-falls": ["Kishkindha"],
  "rains-and-delay": ["Prasravana", "Kishkindha"],
  "search-every-horizon": ["Kishkindha"],
  "sampati-reveals-lanka": ["Vindhya cave", "Southern ocean"],
  "hanuman-remembers": ["Southern ocean"],
  "leap-across-ocean": ["Southern ocean", "Lanka"],
  "searching-lanka": ["Lanka"],
  "sita-in-ashoka-grove": ["Lanka", "Ashoka grove"],
  "messenger-and-token": ["Ashoka grove"],
  "lanka-burns": ["Lanka"],
  "return-over-ocean": ["Lanka", "Southern ocean", "Mahendra"],
  "news-reaches-rama": ["Madhuvana", "Prasravana"],
  "ocean-and-bridge": ["Southern ocean", "Lanka"],
  "lanka-surrounded": ["Suvela", "Lanka"],
  "kumbhakarna-rises": ["Lanka battlefield"],
  "indrajits-last-war": ["Lanka", "Nikumbhila"],
  "ravanas-final-battle": ["Lanka battlefield"],
  "sita-and-aftermath": ["Lanka"],
  "road-home": ["Lanka", "Kishkindha", "Pampa", "Chitrakuta", "Bharadvaja's hermitage", "Nandigrama", "Ayodhya"],
  "origins-behind-war": ["Ayodhya", "Lanka"],
  "companions-depart": ["Ayodhya"],
  "sita-sent-away": ["Ayodhya", "Valmiki's hermitage"],
  "kingdom-tales-and-twins": ["Ayodhya", "Madhura", "Valmiki's hermitage"],
  "later-reign": ["Ayodhya", "Kosala"],
  "twins-sing-sita-returns": ["Horse-sacrifice ground"],
  "last-departures": ["Ayodhya", "Sarayu"],
};

const arcCopy: Array<Omit<StoryCompassArc, "turnIds">> = [
  { id: "beginnings", ordinal: 1, title: { en: "Beginnings", hi: "आरंभ" }, invitation: { en: "From the first question to Sita's wedding", hi: "पहले प्रश्न से सीता-विवाह तक" } },
  { id: "exile", ordinal: 2, title: { en: "The exile", hi: "वनवास" }, invitation: { en: "A crown lost and a promise carried", hi: "छूटा राज्य और निभाया वचन" } },
  { id: "forest", ordinal: 3, title: { en: "The forest breaks", hi: "वन का टूटना" }, invitation: { en: "Panchavati, abduction, and the broken trail", hi: "पंचवटी, हरण और टूटी खोज-राह" } },
  { id: "alliance", ordinal: 4, title: { en: "Alliance and search", hi: "मैत्री और खोज" }, invitation: { en: "Hanuman, Sugriva, and every horizon", hi: "हनुमान, सुग्रीव और हर दिशा" } },
  { id: "leap", ordinal: 5, title: { en: "The leap to Lanka", hi: "लंका की छलाँग" }, invitation: { en: "One messenger crosses the impossible", hi: "एक दूत असंभव दूरी पार करता है" } },
  { id: "war", ordinal: 6, title: { en: "War and return", hi: "युद्ध और वापसी" }, invitation: { en: "The bridge, the battle, and the road home", hi: "सेतु, युद्ध और घर वापसी" } },
  { id: "aftermath", ordinal: 7, title: { en: "After victory", hi: "विजय के बाद" }, invitation: { en: "Memory, rule, separation, and legacy", hi: "स्मृति, शासन, वियोग और विरासत" } },
];

export function buildRamayanaCompass(): StoryCompass {
  const turns: Record<string, StoryCompassTurn> = {};
  const arcs = arcCopy.map((arc) => {
    const arcSeeds = seeds[arc.id];
    const source = sourceByArc[arc.id];
    const turnIds = arcSeeds.map((seed, index) => {
      const { range, playableMomentId, ...copy } = seed;
      const places = placesByTurn[seed.id];
      if (!places?.length) throw new Error(`Ramayana compass turn has no canonical place: ${seed.id}`);
      turns[seed.id] = {
        ...copy,
        places,
        arcId: arc.id,
        ordinal: index + 1,
        coverage: playableMomentId ? "playable" : "orientation",
        playableMomentId,
        sourceRange: {
          ...source,
          startOrdinal: range[0],
          endOrdinal: range[1],
        },
      };
      return seed.id;
    });
    return { ...arc, turnIds };
  });

  return {
    expressionLabel: "Manmatha Nath Dutt's English prose Ramayana, Project Gutenberg four-volume electronic edition",
    sourceBoundary: "This compass covers all 652 source-ordered sections in this selected English expression exactly once. It is not Sanskrit, a critical edition, every recension, or the complete Ramayana tradition. A mapped turn is orientation, not a finished playable scene.",
    totalSourceUnits: 652,
    arcs,
    turns,
  };
}
