import type { RamayanaSceneOutline } from "./ramayana-beginnings-outline";

/**
 * Source-partitioned editorial denominator for Yuddha Kanda 45-69.
 * Every section belongs to exactly one scene; the briefs are not displayed as
 * substitutes for the detailed bilingual playable scenes.
 */
export const RAMAYANA_KUMBHAKARNA_RISES_SCENE_OUTLINES: RamayanaSceneOutline[] = [
  {
    id: "the-unseen-attack-finishes", turnId: "kumbhakarna-rises", ordinal: 1, sourceStart: 45, sourceEnd: 45,
    title: { en: "The unseen attack finishes", hi: "अदृश्य आक्रमण अपना प्रहार पूरा करता है" },
    synopsis: { en: "Rama sends leaders to find the hidden Indrajit, but the search cannot stop the serpent-like arrows; Rama and Lakshmana fall covered in wounds while the people around them struggle to understand whether either brother can still be saved.", hi: "राम छिपे इंद्रजीत को खोजने के लिए सेनानायक भेजते हैं, पर खोज सर्प-जैसे बाणों को रोक नहीं पाती। राम और लक्ष्मण घायल होकर गिरते हैं और आसपास के लोग यह समझने की कोशिश करते हैं कि दोनों भाइयों को अब भी बचाया जा सकता है या नहीं।" },
    characters: ["Rama", "Lakshmana", "Indrajit", "Hanuman", "Sugriva", "Vibhishana"], places: ["Night battlefield outside Lanka"],
  },
  {
    id: "vibhishana-holds-the-circle", turnId: "kumbhakarna-rises", ordinal: 2, sourceStart: 46, sourceEnd: 46,
    title: { en: "Vibhishana holds the circle", hi: "विभीषण घेरा संभालते हैं" },
    synopsis: { en: "Indrajit wounds the leaders guarding the fallen brothers and returns to Lanka claiming victory. Vibhishana refuses that conclusion, steadies Sugriva and the frightened ranks, and turns their attention from despair to protection and the next responsible act.", hi: "इंद्रजीत गिरे भाइयों की रक्षा कर रहे सेनानायकों को घायल करके लंका लौटता है और विजय घोषित करता है। विभीषण उस निष्कर्ष को स्वीकार नहीं करते; वे सुग्रीव और भयभीत दलों को संभालकर निराशा से उनका ध्यान सुरक्षा और अगले जिम्मेदार कदम की ओर मोड़ते हैं।" },
    characters: ["Vibhishana", "Sugriva", "Rama", "Lakshmana", "Indrajit", "Hanuman", "Jambavan"], places: ["Guarded battlefield circle", "Lanka"],
  },
  {
    id: "sita-is-forced-to-look", turnId: "kumbhakarna-rises", ordinal: 3, sourceStart: 47, sourceEnd: 48,
    title: { en: "Sita is forced to look", hi: "सीता को युद्धभूमि देखने के लिए विवश किया जाता है" },
    synopsis: { en: "Ravana orders Sita carried above the battlefield to make apparent death another instrument of coercion. Her grief is answered not by empty optimism but by Trijata's careful reading of the living signs below, after which Sita returns to the grove still carrying uncertainty.", hi: "रावण सीता को युद्धभूमि के ऊपर ले जाने का आदेश देता है ताकि दिखाई पड़ती मृत्यु भी दबाव का साधन बन जाए। उनके शोक का उत्तर खोखली आशा नहीं, बल्कि नीचे दिख रहे जीवित संकेतों को त्रिजटा द्वारा ध्यान से पढ़ना है; फिर भी सीता अनिश्चितता लिए वाटिका लौटती हैं।" },
    characters: ["Sita", "Trijata", "Ravana", "Rama", "Lakshmana", "Sugriva", "Vibhishana"], places: ["Pushpaka above the battlefield", "Ashoka grove"],
  },
  {
    id: "rama-wakes-into-grief", turnId: "kumbhakarna-rises", ordinal: 4, sourceStart: 49, sourceEnd: 49,
    title: { en: "Rama wakes into grief", hi: "राम शोक के बीच जागते हैं" },
    synopsis: { en: "Rama regains awareness, sees Lakshmana motionless, and speaks from acute grief as though every bond and future has ended. At the same moment a frightened crowd mistakes the approaching Vibhishana for Indrajit, showing how trauma can break both judgment and recognition.", hi: "राम होश में आकर लक्ष्मण को निश्चल देखते हैं और तीव्र शोक में ऐसे बोलते हैं मानो हर संबंध और भविष्य समाप्त हो गया हो। उसी समय भयभीत भीड़ आते विभीषण को इंद्रजीत समझ बैठती है, जिससे दिखता है कि आघात निर्णय और पहचान दोनों को तोड़ सकता है।" },
    characters: ["Rama", "Lakshmana", "Vibhishana", "Sugriva", "Hanuman", "Jambavan"], places: ["Guarded battlefield circle"],
  },
  {
    id: "garuda-breaks-the-bonds", turnId: "kumbhakarna-rises", ordinal: 5, sourceStart: 50, sourceEnd: 50,
    title: { en: "Garuda breaks the bonds", hi: "गरुड़ बंधन तोड़ते हैं" },
    synopsis: { en: "Recognition is restored, Sugriva and Vibhishana support one another, and Sushena proposes a search for medicines before Garuda arrives and releases the brothers. His sweeping warning about Lanka belongs to his alarmed counsel, not to the worth of every person inside the city.", hi: "पहचान लौटती है, सुग्रीव और विभीषण एक-दूसरे को संभालते हैं और सुषेण औषधि खोजने की योजना रखते हैं; तभी गरुड़ आकर भाइयों को मुक्त करते हैं। लंका के बारे में उनकी व्यापक चेतावनी उनके चिंतित परामर्श का हिस्सा है, नगर के हर व्यक्ति के मूल्य का निर्णय नहीं।" },
    characters: ["Garuda", "Rama", "Lakshmana", "Sugriva", "Vibhishana", "Sushena", "Hanuman"], places: ["Guarded battlefield circle", "Lanka gates"],
  },
  {
    id: "dhumraksha-takes-the-west-road", turnId: "kumbhakarna-rises", ordinal: 6, sourceStart: 51, sourceEnd: 52,
    title: { en: "Dhumraksha takes the west road", hi: "धूम्राक्ष पश्चिमी मार्ग से निकलता है" },
    synopsis: { en: "Ravana learns that the brothers have risen and sends Dhumraksha against the western gate. Interpreted omens, frightened animals, wrecked vehicles, exhausted fighters, and Hanuman's final counterstroke keep the sortie inside the cost it creates rather than turning it into a victory counter.", hi: "रावण को भाइयों के उठने का समाचार मिलता है और वह धूम्राक्ष को पश्चिमी द्वार भेजता है। पढ़े गए अपशकुन, डरे पशु, टूटे वाहन, थके योद्धा और हनुमान का अंतिम प्रत्याघात इस अभियान को उसके पैदा किए नुकसान के भीतर रखते हैं, केवल विजय-गिनती में नहीं बदलते।" },
    characters: ["Ravana", "Dhumraksha", "Hanuman", "Allied fighters", "Lanka defenders"], places: ["Ravana's court", "West gate battlefield"],
  },
  {
    id: "angada-meets-vajradanshtra", turnId: "kumbhakarna-rises", ordinal: 7, sourceStart: 53, sourceEnd: 54,
    title: { en: "Angada meets Vajradanshtra", hi: "अंगद वज्रदंष्ट्र का सामना करते हैं" },
    synopsis: { en: "Vajradanshtra leads another sortie and the battle narrows from mass confusion to an exhausting contest with Angada. Trees, rock, maces, hands, and swords change the advantage repeatedly before Angada survives, while the field around them records lives, animals, and equipment lost.", hi: "वज्रदंष्ट्र अगला अभियान लेकर निकलता है और व्यापक अव्यवस्था धीरे-धीरे अंगद के साथ थकाऊ द्वंद्व में सिमटती है। वृक्ष, शिला, गदा, हाथ और तलवार बार-बार बढ़त बदलते हैं; अंगद बचते हैं, पर आसपास का मैदान खोए जीवन, पशु और साधनों की कीमत दर्ज रखता है।" },
    characters: ["Angada", "Vajradanshtra", "Ravana", "Allied fighters", "Lanka defenders"], places: ["South gate battlefield"],
  },
  {
    id: "dust-erases-the-two-sides", turnId: "kumbhakarna-rises", ordinal: 8, sourceStart: 55, sourceEnd: 56,
    title: { en: "Dust erases the two sides", hi: "धूल दोनों पक्षों की पहचान मिटा देती है" },
    synopsis: { en: "Akampana enters battle, but a dense dust cloud destroys recognition and makes both armies strike their own companions. Hanuman later restores a visible centre and defeats Akampana, yet the decisive warning remains that environment can turn force into harm without intention or control.", hi: "अकंपन युद्ध में उतरता है, पर घनी धूल पहचान मिटाकर दोनों सेनाओं से अपने ही साथियों पर प्रहार करा देती है। बाद में हनुमान दृश्य केंद्र लौटाकर अकंपन को हराते हैं, फिर भी निर्णायक चेतावनी यही रहती है कि वातावरण बल को बिना इरादे या नियंत्रण के हानि में बदल सकता है।" },
    characters: ["Akampana", "Hanuman", "Ravana", "Allied fighters", "Lanka defenders"], places: ["Dust-covered battlefield"],
  },
  {
    id: "prahasta-chooses-the-war-he-warned-against", turnId: "kumbhakarna-rises", ordinal: 9, sourceStart: 57, sourceEnd: 58,
    title: { en: "Prahasta chooses the war he warned against", hi: "प्रहस्त उसी युद्ध को चुनता है जिसके विरुद्ध उसने चेताया था" },
    synopsis: { en: "Prahasta admits that he once urged Sita's return and knew refusal would bring war, yet gifts, duty, and loyalty draw him into the eastern sortie. Vibhishana identifies him, Nila stops him, and his death exposes the human consequence of recognising a wrong course but serving it anyway.", hi: "प्रहस्त स्वीकार करता है कि उसने कभी सीता-वापसी की सलाह दी थी और जानता था कि इनकार युद्ध लाएगा, फिर भी उपहार, कर्तव्य और निष्ठा उसे पूर्वी अभियान में खींचते हैं। विभीषण उसे पहचानते हैं, नील रोकते हैं और उसकी मृत्यु गलत राह पहचानकर भी उसकी सेवा करने का मानवीय परिणाम खोलती है।" },
    characters: ["Prahasta", "Ravana", "Nila", "Vibhishana", "Allied fighters", "Lanka defenders"], places: ["Ravana's court", "East gate battlefield"],
  },
  {
    id: "ravana-enters-and-is-sent-back", turnId: "kumbhakarna-rises", ordinal: 10, sourceStart: 59, sourceEnd: 59,
    title: { en: "Ravana enters and is sent back", hi: "रावण युद्ध में आता है और वापस भेजा जाता है" },
    synopsis: { en: "Ravana enters after Prahasta's death and the alliance identifies each dangerous commander rather than treating the city as a faceless mass. Sugriva, Nila, Lakshmana, Hanuman, and Rama meet successive danger before Rama removes Ravana's weapons and vehicle but sends the exhausted ruler away alive.", hi: "प्रहस्त की मृत्यु के बाद रावण स्वयं उतरता है और मित्र-दल नगर को बेचेहरा समूह मानने के बजाय हर खतरनाक सेनानायक की पहचान करता है। सुग्रीव, नील, लक्ष्मण, हनुमान और राम क्रमिक संकट झेलते हैं; अंत में राम रावण के शस्त्र और वाहन नष्ट करके थके शासक को जीवित वापस भेजते हैं।" },
    characters: ["Ravana", "Rama", "Lakshmana", "Hanuman", "Sugriva", "Nila", "Vibhishana"], places: ["Lanka battlefield", "Lanka gate"],
  },
  {
    id: "lanka-wakes-kumbhakarna", turnId: "kumbhakarna-rises", ordinal: 11, sourceStart: 60, sourceEnd: 61,
    title: { en: "Lanka wakes Kumbhakarna", hi: "लंका कुंभकर्ण को जगाती है" },
    synopsis: { en: "Humiliated, Ravana orders the sleeping Kumbhakarna awakened through a vast, chaotic operation. When the immense figure approaches the battlefield, inherited accounts of his appetite and origin amplify panic; Vibhishana counters that fear with recognition, formation, and a practical explanation.", hi: "अपमानित रावण सोए कुंभकर्ण को जगाने का आदेश देता है और एक विशाल, अव्यवस्थित प्रयास शुरू होता है। जब विशाल आकृति युद्धभूमि की ओर आती है, उसकी भूख और उत्पत्ति के पुराने वृत्तांत भय बढ़ाते हैं; विभीषण उस डर का उत्तर पहचान, गठन और व्यावहारिक समझ से देते हैं।" },
    characters: ["Kumbhakarna", "Ravana", "Rama", "Vibhishana", "Lanka attendants", "Allied fighters"], places: ["Kumbhakarna's sleeping chamber", "Lanka streets", "Allied line"],
  },
  {
    id: "kumbhakarna-names-the-failure", turnId: "kumbhakarna-rises", ordinal: 12, sourceStart: 62, sourceEnd: 64,
    title: { en: "Kumbhakarna names the failure", hi: "कुंभकर्ण विफलता का नाम बताता है" },
    synopsis: { en: "Kumbhakarna tells Ravana that power without deliberation, the wrong order of actions, and contempt for sound counsel created the disaster. Ravana appeals to friendship after failure; Kumbhakarna then knowingly chooses loyalty to the person who caused the war, while Mahodara proposes another deception aimed at Sita.", hi: "कुंभकर्ण रावण से कहता है कि विचारहीन शक्ति, कामों का गलत क्रम और सही सलाह का अपमान इस संकट को लाए। विफलता के बाद रावण मित्रता की दुहाई देता है; कुंभकर्ण युद्ध के कारण बने व्यक्ति के प्रति निष्ठा जानबूझकर चुनता है, जबकि महोदर सीता पर लक्षित एक और छल सुझाता है।" },
    characters: ["Kumbhakarna", "Ravana", "Mahodara", "Sita", "Vibhishana"], places: ["Ravana's council chamber", "Ashoka grove in the proposed deception"],
  },
  {
    id: "the-army-flees-and-returns", turnId: "kumbhakarna-rises", ordinal: 13, sourceStart: 65, sourceEnd: 66,
    title: { en: "The army flees and returns", hi: "सेना भागती है और फिर लौटती है" },
    synopsis: { en: "Kumbhakarna rejects Mahodara's scheme, acknowledges that the allied fighters themselves did not wrong Lanka, and goes out to attack them anyway. His arrival scatters the army; Angada's first rally leans on shame and death-glory before courage is rebuilt through shared position and hope.", hi: "कुंभकर्ण महोदर की योजना ठुकराता है, मानता है कि मित्र-योद्धाओं ने स्वयं लंका का अपकार नहीं किया, फिर भी उन्हीं पर आक्रमण करने निकलता है। उसका आगमन सेना बिखेर देता है; अंगद की पहली पुकार लज्जा और मृत्यु-गौरव पर टिकी है, फिर साझा स्थिति और आशा से साहस दोबारा बनता है।" },
    characters: ["Kumbhakarna", "Mahodara", "Ravana", "Angada", "Hanuman", "Sugriva", "Allied fighters"], places: ["Lanka gate", "Allied battlefield line"],
  },
  {
    id: "kumbhakarna-falls", turnId: "kumbhakarna-rises", ordinal: 14, sourceStart: 67, sourceEnd: 67,
    title: { en: "Kumbhakarna falls", hi: "कुंभकर्ण गिरता है" },
    synopsis: { en: "Kumbhakarna overwhelms formations, captures Sugriva, loses track of friend and opponent, and continues after terrible injuries. Sugriva preserves his own agency, Lakshmana and Rama meet the advance, and Rama finally stops it, leaving damage on both armies and inside Lanka.", hi: "कुंभकर्ण दलों को रौंदता, सुग्रीव को पकड़ता और मित्र-शत्रु की पहचान खोकर भी भयानक घावों के बाद आगे बढ़ता है। सुग्रीव अपनी क्षमता बचाते हैं, लक्ष्मण और राम उसका सामना करते हैं और अंततः राम उसे रोकते हैं; नुकसान दोनों सेनाओं और लंका के भीतर रह जाता है।" },
    characters: ["Kumbhakarna", "Sugriva", "Hanuman", "Angada", "Lakshmana", "Rama", "Allied fighters", "Lanka defenders"], places: ["Lanka battlefield", "Lanka streets", "Lanka gate", "Sea below Lanka"],
  },
  {
    id: "grief-sends-the-next-generation-out", turnId: "kumbhakarna-rises", ordinal: 15, sourceStart: 68, sourceEnd: 69,
    title: { en: "Grief sends the next generation out", hi: "शोक अगली पीढ़ी को युद्ध में भेजता है" },
    synopsis: { en: "Ravana collapses over his brother's death, recognises that Vibhishana's rejected advice was beneficial, and briefly sees his own causation without undoing it. Trishira rallies the court, younger relatives enter battle, and another sequence of deaths shows grief reproducing war instead of ending it.", hi: "रावण भाई की मृत्यु पर टूटता है, मानता है कि विभीषण की ठुकराई सलाह हितकारी थी और क्षण भर अपने कारण को देखता है, पर उसे बदल नहीं पाता। त्रिशिरा सभा संभालता है, युवा संबंधी युद्ध में उतरते हैं और नई मृत्यु-श्रृंखला दिखाती है कि शोक युद्ध रोकने के बजाय उसे आगे बढ़ा रहा है।" },
    characters: ["Ravana", "Kumbhakarna", "Vibhishana", "Trishira", "Atikaya", "Narantaka", "Devantaka", "Mahodara", "Angada", "Hanuman", "Nila", "Rishabha"], places: ["Ravana's court", "Lanka battlefield"],
  },
];
